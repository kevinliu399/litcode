import pytest
import mongomock
import time
from datetime import datetime
from unittest.mock import Mock, patch
from flask import Flask
from flask_socketio import SocketIO
from copy import deepcopy

# Import your actual application
from app import app, socketio, GameState, Match, game_state, questions_collection, matches_collection, users_collection

@pytest.fixture
def mock_db():
    """Setup mock MongoDB collections"""
    with patch('pymongo.MongoClient') as mock_client:
        # Create mock collections
        mock_questions = mongomock.MongoClient().db.questions
        mock_matches = mongomock.MongoClient().db.matches
        mock_users = mongomock.MongoClient().db.users
        
        # Add sample question
        sample_question = {
            "_id": "507f1f77bcf86cd799439011",
            "title": "Test Question",
            "description": "Test description",
            "testCases": [
                {"input": "test1", "output": "test1"},
                {"input": "test2", "output": "test2"}
            ]
        }
        mock_questions.insert_one(sample_question)
        
        # Replace real collections with mock ones
        global questions_collection, matches_collection, users_collection
        questions_collection = mock_questions
        matches_collection = mock_matches
        users_collection = mock_users
        
        yield {
            'questions': mock_questions,
            'matches': mock_matches,
            'users': mock_users
        }

@pytest.fixture
def test_client():
    """Setup Flask test client"""
    app.config['TESTING'] = True
    return app.test_client()

@pytest.fixture
def socket_client():
    """Setup SocketIO test client"""
    return socketio.test_client(app)

class TestMatchmaking:
    def test_match_creation(self):
        """Test Match class initialization"""
        question = {
            "_id": "test_id",
            "testCases": [{"input": "1", "output": "1"}, {"input": "2", "output": "2"}]
        }
        match = Match("player1", "player2", question)
        
        assert match.player1['id'] == "player1"
        assert match.player2['id'] == "player2"
        assert match.player1['total_tests'] == 2
        assert match.player2['total_tests'] == 2
        assert match.is_active == True
        
    def test_match_winner_calculation(self):
        """Test winner calculation logic"""
        question = {
            "_id": "test_id",
            "testCases": [{"input": "1", "output": "1"}, {"input": "2", "output": "2"}]
        }
        match = Match("player1", "player2", question)
        
        # Set progress
        match.update_player_progress("player1", 2)  # All tests passed
        match.update_player_progress("player2", 1)  # Half tests passed
        
        assert match.get_winner() == "player1"
        
    def test_match_draw(self):
        """Test draw condition"""
        question = {
            "_id": "test_id",
            "testCases": [{"input": "1", "output": "1"}, {"input": "2", "output": "2"}]
        }
        match = Match("player1", "player2", question)
        
        # Set equal progress
        match.update_player_progress("player1", 1)
        match.update_player_progress("player2", 1)
        
        assert match.get_winner() is None

class TestSocketEvents:
    def test_connection(self, socket_client):
        """Test basic socket connection"""
        assert socket_client.is_connected()
    
    def test_queue_joining(self, socket_client, mock_db):
        """Test joining matchmaking queue"""
        # Clear existing queue
        game_state.waiting_queue = []
        
        # Join queue
        socket_client.emit('join_queue', {
            'player_id': 'test_player1',
            'player_name': 'Test Player 1'
        })
        
        assert len(game_state.waiting_queue) == 1
        assert game_state.waiting_queue[0]['player_id'] == 'test_player1'
    
    def test_match_creation_when_queue_full(self, mock_db):
        """Test match creation when two players are in queue"""
        # Create two socket clients
        client1 = socketio.test_client(app)
        client2 = socketio.test_client(app)
        
        # Clear existing queue and matches
        game_state.waiting_queue = []
        game_state.active_matches = {}
        
        # Join queue with both players
        client1.emit('join_queue', {
            'player_id': 'test_player1',
            'player_name': 'Test Player 1'
        })
        client2.emit('join_queue', {
            'player_id': 'test_player2',
            'player_name': 'Test Player 2'
        })
        
        # Wait for match creation
        time.sleep(0.1)
        
        # Check if match was created
        assert len(game_state.active_matches) == 1
        assert len(game_state.waiting_queue) == 0
        
        # Get the match
        match = list(game_state.active_matches.values())[0]
        assert match.player1['id'] == 'test_player1'
        assert match.player2['id'] == 'test_player2'

class TestGameProgression:
    def test_submit_result(self, socket_client, mock_db):
        """Test submitting results for a match"""
        # Create a match
        question = {
            "_id": "test_id",
            "testCases": [{"input": "1", "output": "1"}, {"input": "2", "output": "2"}]
        }
        match = Match("player1", "player2", question)
        game_state.active_matches[match.match_id] = match
        
        # Submit result
        socket_client.emit('submit_result', {
            'match_id': match.match_id,
            'player_id': 'player1',
            'tests_passed': 2,
            'total_tests': 2
        })
        
        # Check if progress was updated
        assert match.player1['tests_passed'] == 2
    
    def test_match_end_conditions(self, mock_db):
        """Test match ending conditions and database updates"""
        # Create a match
        question = {
            "_id": "test_id",
            "testCases": [{"input": "1", "output": "1"}, {"input": "2", "output": "2"}]
        }
        match = Match("player1", "player2", question)
        game_state.active_matches[match.match_id] = match
        
        # End match
        match.update_player_progress("player1", 2)
        match.update_player_progress("player2", 1)
        end_match(match)
        
        # Verify match was saved to database
        saved_match = matches_collection.find_one({'match_id': match.match_id})
        assert saved_match is not None
        assert saved_match['player1']['tests_passed'] == 2
        assert saved_match['player2']['tests_passed'] == 1
        assert not match.is_active

class TestErrorHandling:
    def test_disconnect_handling(self, socket_client, mock_db):
        """Test proper cleanup on disconnect"""
        # Add player to queue
        game_state.waiting_queue.append({
            'sid': socket_client.sid,
            'player_id': 'test_player',
            'player_name': 'Test Player'
        })
        
        # Disconnect
        socket_client.disconnect()
        
        # Check cleanup
        assert len([p for p in game_state.waiting_queue if p['sid'] == socket_client.sid]) == 0
    
    def test_invalid_match_id(self, socket_client, mock_db):
        """Test handling of invalid match ID in submit_result"""
        socket_client.emit('submit_result', {
            'match_id': 'invalid_id',
            'player_id': 'test_player',
            'tests_passed': 1,
            'total_tests': 2
        })
        
        # Should not raise any errors
        assert True

if __name__ == '__main__':
    pytest.main([__file__])