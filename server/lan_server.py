from flask import Flask, request, jsonify, render_template_string
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from pymongo import MongoClient
import json
import threading
import time
from datetime import datetime
from bson import ObjectId
import os
from dotenv import load_dotenv
from typing import Dict, List

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS with specific settings for ngrok
CORS_ALLOWED_ORIGINS = [
    "https://*.ngrok-free.app",  # Allow ngrok domains
    "http://localhost:3000",     # Local development
    "http://localhost:3000",
    "http://127.0.0.1:3000"     # Local development
]

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

# Update CORS settings specifically for ngrok
CORS(app, resources={
    r"/*": {
        "origins": CORS_ALLOWED_ORIGINS,
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "OPTIONS"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Configure SocketIO with optimized settings for ngrok
socketio = SocketIO(
    app,
    cors_allowed_origins=CORS_ALLOWED_ORIGINS,
    ping_timeout=10000,
    ping_interval=1000,
    async_mode='threading',
    websocket=True,
    logger=True,
    engineio_logger=True,
    always_connect=True,
    manage_session=False,
    cookie=False
)

# MongoDB setup
client = MongoClient(os.getenv('MONGO_DB_KEY'))
db = client['litcodedb']
questions_collection = db['questions']
matches_collection = db['matches']
users_collection = db['users']

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "LitCode server is running"
    })

class GameState:
    def __init__(self):
        # Separate queues for each algorithm type
        self.waiting_queues = {
            'graph': [],
            'tree': [],
            'array': [],
            'random': []
        }
        self.active_matches = {}
        self.match_timers = {}

    def add_to_queue(self, player_data: dict, algorithm_type: str):
        if algorithm_type in self.waiting_queues:
            self.waiting_queues[algorithm_type].append(player_data)
            return True
        return False

    def remove_from_queue(self, sid: str):
        for queue in self.waiting_queues.values():
            queue[:] = [p for p in queue if p['sid'] != sid]

    def find_match(self, algorithm_type: str) -> tuple:
        # For random type, check all queues
        if algorithm_type == 'random':
            for queue_type, queue in self.waiting_queues.items():
                if len(queue) >= 2:
                    return queue.pop(0), queue.pop(0), queue_type
            return None, None, None

        # For specific type, check only that queue
        queue = self.waiting_queues[algorithm_type]
        if len(queue) >= 2:
            return queue.pop(0), queue.pop(0), algorithm_type
        return None, None, None

game_state = GameState()

class Match:
    def __init__(self, player1_id, player2_id, question: dict, algorithm_type: str, duration=1800):
        self.match_id = str(ObjectId())
        self.player1 = {
            'id': player1_id,
            'tests_passed': 0,
            'total_tests': len(question['testCases']),
            'completed': False
        }
        self.player2 = {
            'id': player2_id,
            'tests_passed': 0,
            'total_tests': len(question['testCases']),
            'completed': False
        }
        self.question_id = question['_id']
        self.algorithm_type = algorithm_type
        self.start_time = datetime.utcnow()
        self.duration = duration
        self.is_active = True

    def update_player_progress(self, clerkId, tests_passed):
        if self.player1['id'] == clerkId:
            self.player1['tests_passed'] = tests_passed
        elif self.player2['id'] == clerkId:
            self.player2['tests_passed'] = tests_passed

    def get_winner(self):
        p1_score = self.player1['tests_passed'] / self.player1['total_tests']
        p2_score = self.player2['tests_passed'] / self.player2['total_tests']
        
        if p1_score > p2_score:
            return self.player1['id']
        elif p2_score > p1_score:
            return self.player2['id']
        return None

    def to_dict(self):
        return {
            'match_id': self.match_id,
            'player1': self.player1,
            'player2': self.player2,
            'question_id': self.question_id,
            'algorithm_type': self.algorithm_type,
            'start_time': self.start_time,
            'duration': self.duration,
            'is_active': self.is_active
        }

# Match management functions
def start_match_timer(match_id, duration):
    def timer_callback():
        time.sleep(duration)
        if match_id in game_state.active_matches:
            match = game_state.active_matches[match_id]
            end_match(match)

    timer_thread = threading.Thread(target=timer_callback)
    timer_thread.start()
    game_state.match_timers[match_id] = timer_thread

def end_match(match):
    if not match.is_active:
        return

    match.is_active = False
    winner_id = match.get_winner()
    
    matches_collection.insert_one(match.to_dict())
    
    socketio.emit('match_ended', {
        'winner_id': winner_id,
        'final_scores': {
            'player1': match.player1,
            'player2': match.player2
        }
    }, room=match.match_id)

    if match.match_id in game_state.active_matches:
        del game_state.active_matches[match.match_id]

def get_random_question(algorithm_type: str):
    query = {}
    if algorithm_type != 'random':
        query['type'] = algorithm_type
    
    question = questions_collection.aggregate([
        {'$match': query},
        {'$sample': {'size': 1}}
    ]).next()
    
    question['_id'] = str(question['_id'])
    return question

# Socket event handlers
@socketio.on_error_default
def default_error_handler(e):
    print(f"SocketIO Error: {str(e)}")
    socketio.emit('error', {'message': str(e)}, room=request.sid)

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    emit('connection_established', {'sid': request.sid})

@socketio.on('join_queue')
def handle_join_queue(data):
    clerkId = data['clerkId']
    player_name = data['player_name']
    algorithm_type = data.get('algorithm_type', 'random')
    
    # Update user document
    users_collection.update_one(
        {'clerkId': clerkId},
        {
            '$set': {
                'clerkId': clerkId,
                'name': player_name,
                'last_active': datetime.utcnow()
            }
        },
        upsert=True
    )
    
    player_data = {
        'sid': request.sid,
        'clerkId': clerkId,
        'player_name': player_name
    }
    
    game_state.add_to_queue(player_data, algorithm_type)
    print(f"Player {player_name} ({clerkId}) joined {algorithm_type} queue.")
    
    # Try to find a match
    player1, player2, matched_type = game_state.find_match(algorithm_type)
    
    if player1 and player2:
        # Get a question of the matched type
        question = get_random_question(matched_type)
        
        match = Match(player1['clerkId'], player2['clerkId'], question, matched_type)
        game_state.active_matches[match.match_id] = match
        
        join_room(match.match_id, sid=player1['sid'])
        join_room(match.match_id, sid=player2['sid'])
        
        match_data = {
            'match_id': match.match_id,
            'opponent': {
                'id': player2['clerkId'],
                'name': player2['player_name']
            },
            'question': question,
            'total_tests': len(question['testCases'])
        }
        emit('match_found', match_data, room=player1['sid'])
        
        match_data['opponent'] = {
            'id': player1['clerkId'],
            'name': player1['player_name']
        }
        emit('match_found', match_data, room=player2['sid'])
        
        print(f"Match created between {player1['player_name']} and {player2['player_name']} for {matched_type} algorithm")
        start_match_timer(match.match_id, match.duration)

@socketio.on('submit_result')
def handle_submit_result(data):
    match_id = data['match_id']
    clerkId = data['clerkId']
    tests_passed = data['tests_passed']
    total_tests = data['total_tests']
    
    if match_id in game_state.active_matches:
        match = game_state.active_matches[match_id]
        match.update_player_progress(clerkId, tests_passed)
        
        emit('opponent_progress', {
            'tests_passed': tests_passed,
            'total_tests': total_tests
        }, room=match_id, skip_sid=request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
    try:
        game_state.remove_from_queue(request.sid)
        
        for match_id, match in list(game_state.active_matches.items()):
            if match.player1['id'] == request.sid or match.player2['id'] == request.sid:
                end_match(match)
                break
    except Exception as e:
        print(f"Error in disconnect handler: {str(e)}")

if __name__ == '__main__':
    socketio.run(
        app,
        debug=True,
        host='0.0.0.0',
        port=5000,
        allow_unsafe_werkzeug=True,
        log_output=True,
        use_reloader=False
    )