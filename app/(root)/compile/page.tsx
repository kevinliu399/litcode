'use client';
import React, { useState } from "react";

const PythonExecutor = () => {
    const [scriptName, setScriptName] = useState("");
    const [args, setArgs] = useState("");
    const [result, setResult] = useState("");

    const runScript = async () => {
        try {
            const response = await fetch("/api/testcode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scriptName,
                    args: args.split(" "),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setResult(data.result);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (error) {
            setResult(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Python Script Executor</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Script name (e.g., add.py)"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Arguments (e.g., 3 4)"
                    value={args}
                    onChange={(e) => setArgs(e.target.value)}
                    className="border p-2 mr-2"
                />
                <button
                    onClick={runScript}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Run
                </button>
            </div>
            {result && (
                <div className="mt-4">
                    <h2 className="text-lg font-bold">Result:</h2>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
};

export default PythonExecutor;
