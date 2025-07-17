import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { currentCodeAtom, selectedLanguageAtom, showCodeEditorAtom } from "@/store/interview";
import { Button } from "@/components/ui/button";
import { X, Play, Save, HelpCircle } from "lucide-react";

const languages = [
  { value: 'javascript', label: 'JavaScript', defaultCode: '// Write your JavaScript code here\nfunction solution() {\n    \n}' },
  { value: 'python', label: 'Python', defaultCode: '# Write your Python code here\ndef solution():\n    pass' },
  { value: 'java', label: 'Java', defaultCode: '// Write your Java code here\npublic class Solution {\n    public void solution() {\n        \n    }\n}' },
  { value: 'cpp', label: 'C++', defaultCode: '// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}' },
  { value: 'c', label: 'C', defaultCode: '// Write your C code here\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}' }
];

export const CodeEditor: React.FC = () => {
  const [code, setCode] = useAtom(currentCodeAtom);
  const [language, setLanguage] = useAtom(selectedLanguageAtom);
  const [showEditor, setShowEditor] = useAtom(showCodeEditorAtom);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const selectedLang = languages.find(lang => lang.value === language);
    if (selectedLang && !code) {
      setCode(selectedLang.defaultCode);
    }
  }, [language, code, setCode]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const selectedLang = languages.find(lang => lang.value === newLanguage);
    if (selectedLang) {
      setCode(selectedLang.defaultCode);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Simulate code execution (in a real implementation, you'd send this to a code execution service)
    setTimeout(() => {
      setOutput(`Code executed successfully!\n\nLanguage: ${language}\nCode length: ${code.length} characters\n\n// This is a simulation. In a real implementation,\n// you would integrate with a code execution service.`);
      setIsRunning(false);
    }, 2000);
  };

  const requestHint = () => {
    // This would integrate with your AI to provide hints
    setOutput(prev => prev + '\n\n💡 AI Hint: Consider breaking down the problem into smaller steps. Think about the input/output requirements first.');
  };

  const saveCode = () => {
    localStorage.setItem(`interview_code_${Date.now()}`, JSON.stringify({
      code,
      language,
      timestamp: new Date().toISOString()
    }));
    setOutput(prev => prev + '\n\n✅ Code saved successfully!');
  };

  if (!showEditor) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-[80vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h3 className="text-white text-lg font-semibold">Code Editor</h3>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={requestHint} variant="outline" size="sm">
              <HelpCircle className="size-4 mr-2" />
              Hint
            </Button>
            <Button onClick={saveCode} variant="outline" size="sm">
              <Save className="size-4 mr-2" />
              Save
            </Button>
            <Button onClick={runCode} disabled={isRunning} size="sm">
              <Play className="size-4 mr-2" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
            <Button
              onClick={() => setShowEditor(false)}
              variant="ghost"
              size="icon"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-2 bg-gray-800 border-b border-gray-700">
              <span className="text-gray-300 text-sm">main.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : language}</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-gray-900 text-white p-4 font-mono text-sm resize-none focus:outline-none"
              placeholder="Write your code here..."
              style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
            />
          </div>

          {/* Output Panel */}
          <div className="w-1/3 border-l border-gray-700 flex flex-col">
            <div className="p-2 bg-gray-800 border-b border-gray-700">
              <span className="text-gray-300 text-sm">Output</span>
            </div>
            <div className="flex-1 bg-gray-950 p-4 overflow-y-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {output || 'Click "Run" to execute your code...'}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Use Ctrl+Enter to run code quickly</span>
            <span>Lines: {code.split('\n').length} | Characters: {code.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};