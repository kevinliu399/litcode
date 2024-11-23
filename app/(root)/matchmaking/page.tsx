'use client'
import { useState, useEffect, useRef } from "react";

export default function Matchmaking() {
    const [status, setStatus] = useState("Waiting to connect...");
    const [message, setMessage] = useState("");
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("https://f13f-142-157-239-111.ngrok-free.app");
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus("Connected to the matchmaking server. Waiting for a match...");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case "MATCH_FOUND":
                    setStatus("Match found! Starting the game...");
                    break;
                case "MESSAGE":
                    setReceivedMessages(prev => [...prev, data.content]);
                    break;
                default:
                    console.log("Unknown message type:", data.type);
            }
        };

        ws.onclose = () => {
            setStatus("Disconnected from the server.");
        };

        ws.onerror = (error) => {
            setStatus("An error occurred. Please try again.");
            console.error("WebSocket error:", error);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const sendMessage = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && message.trim()) {
            wsRef.current.send(JSON.stringify({
                type: "MESSAGE",
                content: message
            }));
            setMessage("");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Matchmaking</h1>
            <p className="mb-4">Status: {status}</p>
            
            <div className="mb-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border p-2 mr-2"
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Send
                </button>
            </div>

            <div className="border p-4 rounded">
                <h2 className="text-xl font-bold mb-2">Messages</h2>
                {receivedMessages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        {msg}
                    </div>
                ))}
            </div>
        </div>
    );
}