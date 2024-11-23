from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import websockets
import json

app = Flask(__name__)
CORS(app)

connected_clients = []  # List of connected clients
client_pairs = {}  # Dictionary to keep track of matched pairs

async def matchmaking_handler(websocket):
    print("A client connected.")
    connected_clients.append(websocket)
    
    try:
        # Wait for two clients to connect
        if len(connected_clients) >= 2:
            player1 = connected_clients.pop(0)
            player2 = connected_clients.pop(0)
            
            # Store the pair
            client_pairs[player1] = player2
            client_pairs[player2] = player1
            
            # Notify both players about the match
            await player1.send(json.dumps({"type": "MATCH_FOUND"}))
            await player2.send(json.dumps({"type": "MATCH_FOUND"}))
            print("Match made between two clients.")
        
        # Keep the connection open for messages
        while True:
            try:
                message = await websocket.recv()
                message_data = json.loads(message)
                
                # If this client has a paired partner, forward the message
                if websocket in client_pairs:
                    paired_client = client_pairs[websocket]
                    await paired_client.send(json.dumps({
                        "type": "MESSAGE",
                        "content": message_data.get("content", "")
                    }))
            except websockets.ConnectionClosed:
                break
            
    except websockets.ConnectionClosed:
        print("A client disconnected.")
    finally:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
        if websocket in client_pairs:
            # Clean up the pairs
            paired_client = client_pairs[websocket]
            del client_pairs[websocket]
            if paired_client in client_pairs:
                del client_pairs[paired_client]

async def start_server():
    server = await websockets.serve(matchmaking_handler, "0.0.0.0", 5000)
    print("Matchmaking server started on ws://0.0.0.0:5000")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(start_server())