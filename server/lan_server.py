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

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS with specific settings for ngrok
CORS_ALLOWED_ORIGINS = [
    "https://*.ngrok-free.app",  # Allow ngrok domains
    "http://localhost:3000",     # Local development
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

# Update CORS headers middleware
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in CORS_ALLOWED_ORIGINS:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Debug routes
@app.route('/debug-connection')
def debug_connection():
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    return jsonify({
        "status": "connected",
        "client_ip": client_ip,
        "headers": dict(request.headers),
        "ngrok_headers": {
            "x-forwarded-for": request.headers.get('X-Forwarded-For'),
            "x-forwarded-proto": request.headers.get('X-Forwarded-Proto')
        }
    })

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

# Game state management
class GameState:
    def __init__(self):
        self.waiting_queue = []
        self.active_matches = {}
        self.match_timers = {}

game_state = GameState()

class Match:
    def __init__(self, player1_id, player2_id, question: dict, duration=1800):
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
        self.start_time = datetime.utcnow()
        self.duration = duration
        self.is_active = True

    def update_player_progress(self, player_id, tests_passed):
        if self.player1['id'] == player_id:
            self.player1['tests_passed'] = tests_passed
        elif self.player2['id'] == player_id:
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

def get_random_question():
    question = questions_collection.aggregate([{ '$sample': { 'size': 1 } }]).next()
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
    print(f"Transport: {request.args.get('transport', 'unknown')}")
    print(f"Headers: {request.headers}")
    emit('connection_established', {'sid': request.sid})

@socketio.on('join_queue')
def handle_join_queue(data):
    player_id = data['player_id']
    player_name = data['player_name']
    
    users_collection.update_one(
        {'_id': player_id},
        {'$set': {'name': player_name}},
        upsert=True
    )
    
    game_state.waiting_queue.append({
        'sid': request.sid,
        'player_id': player_id,
        'player_name': player_name
    })
    
    if len(game_state.waiting_queue) >= 2:
        player1 = game_state.waiting_queue.pop(0)
        player2 = game_state.waiting_queue.pop(0)
        
        question = get_random_question()
        
        match = Match(player1['player_id'], player2['player_id'], question)
        game_state.active_matches[match.match_id] = match
        
        join_room(match.match_id, sid=player1['sid'])
        join_room(match.match_id, sid=player2['sid'])
        
        match_data = {
            'match_id': match.match_id,
            'opponent': {
                'id': player2['player_id'],
                'name': player2['player_name']
            },
            'question': question,
            'total_tests': len(question['testCases'])
        }
        emit('match_found', match_data, room=player1['sid'])
        
        match_data['opponent'] = {
            'id': player1['player_id'],
            'name': player1['player_name']
        }
        emit('match_found', match_data, room=player2['sid'])
        
        start_match_timer(match.match_id, match.duration)

@socketio.on('submit_result')
def handle_submit_result(data):
    match_id = data['match_id']
    player_id = data['player_id']
    tests_passed = data['tests_passed']
    total_tests = data['total_tests']
    
    if match_id in game_state.active_matches:
        match = game_state.active_matches[match_id]
        match.update_player_progress(player_id, tests_passed)
        
        emit('opponent_progress', {
            'tests_passed': tests_passed,
            'total_tests': total_tests
        }, room=match_id, skip_sid=request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
    try:
        game_state.waiting_queue = [p for p in game_state.waiting_queue if p['sid'] != request.sid]
        
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