// components/EditorComponent.tsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const EditorComponent = () => {
  const [code, setCode] = useState<string>(''); // The code the user writes
  const [output, setOutput] = useState<string>(''); // The output from Judge0
  const [isExecuting, setIsExecuting] = useState(false); // Flag to show loading state

  // Function to handle Monaco Editor change
  const handleEditorChange = (value: string) => {
    setCode(value);
  };

  // Function to execute code via Judge0 API
  const executeCode = async () => {
    setIsExecuting(true);
    try {
      const response = await axios.post('/api/judge0', {
        code,
        language: 'python3',  // Change this dynamically based on the user's selected language
      });

      setOutput(response.data.output); // The response contains the output of the code
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div>
      <h1>Monaco Editor with Judge0</h1>
      <Editor
        height="70vh"
        defaultLanguage="javascript"
        defaultValue="// Write your code here"
        onChange={(value) => handleEditorChange(value!)} // Update on change
      />
      <button onClick={executeCode} disabled={isExecuting}>
        {isExecuting ? 'Executing...' : 'Run Code'}
      </button>
      <pre>{output}</pre> {/* Display output here */}
    </div>
  );
};

export default EditorComponent;
