import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const EditorComponent = () => {
  const [code, setCode] = useState<string>(''); // The code the user writes
  const [output, setOutput] = useState<string>(''); // The output from Judge0
  const [isExecuting, setIsExecuting] = useState(false); // Flag to show loading state
  const [isProcessing, setIsProcessing] = useState(false); // Flag for processing state

  // Function to handle Monaco Editor change
  const handleEditorChange = (value: string) => {
    setCode(value);
  };

  // Function to execute code via Judge0
  const executeCode = async () => {
    setIsExecuting(true);
    setIsProcessing(true);
    try {
      // Submit code to the Judge0 API route
      const response = await axios.post('/api/judge0', {
        code,
        language_id: 4, // Example: 4 for C
        stdin: '', // Optional, provide input if needed
      });
      console.log(response.data)
      const { token } = response.data;

      // Poll the status of the submission every 2 seconds
      const checkStatus = setInterval(async () => {
        const statusResponse = await axios.get(`/api/judge0-status?token=${token}`);
        console.log(statusResponse.data)
        if (statusResponse.data.status === 'Processing') {
          // Continue polling until finished
          return;
        }
        setIsProcessing(false);
        setIsExecuting(false);
        clearInterval(checkStatus);
        setOutput(statusResponse.data.output || statusResponse.data.errors || 'No output');
      }, 2000); // Poll every 2 seconds
    } catch (error) {
      console.error('Error executing code:', error);
      setIsExecuting(false);
      setOutput('Error executing code');
    }
  };

  return (
    <div>
      <h1>Monaco Editor with Judge0 Integration</h1>
      <Editor
        height="70vh"
        defaultLanguage="javascript"
        defaultValue="// Write your code here"
        onChange={(value) => handleEditorChange(value!)} // Update on change
      />
      <button onClick={executeCode} disabled={isExecuting}>
        {isExecuting ? 'Executing...' : 'Run Code'}
      </button>
      {isProcessing && <p>Processing...</p>}
      <pre>{output}</pre> {/* Display output here */}
    </div>
  );
};

export default EditorComponent;
