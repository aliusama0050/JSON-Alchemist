import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JsonEditor } from './components/JsonEditor';
import { Button } from './components/Button';
import { transformJsonWithGemini } from './services/geminiService';
import { TransformStatus } from './types';
import { ArrowRight, Wand2, AlertCircle, Settings2, RefreshCw } from 'lucide-react';

const DEFAULT_TARGET_SCHEMA = `{
  "type": "object",
  "description": "Comprehensive academic data for undergraduate and graduate programs",
  "properties": {
    "undergraduate_programs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "program_name": { "type": "string" },
          "admission_requirements": {
            "type": "object",
            "properties": {
              "minimum_gpa": { "type": "number" },
              "minimum_test_scores": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "test_name": { "type": "string" },
                    "minimum_score": { "type": "string" }
                  }
                }
              },
              "other_requirements": { "type": "string" }
            }
          },
          "application_deadlines": { "type": "string" },
          "fee_structure": {
            "type": "object",
            "properties": {
              "domestic_students": { "type": "string" },
              "international_students": { "type": "string" }
            }
          },
          "core_courses": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "course_title": { "type": "string" },
                "description": { "type": "string" }
              }
            }
          },
          "scholarship_opportunities": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "scholarship_name": { "type": "string" },
                "eligibility_requirements": { "type": "string" },
                "award_amount": { "type": "string" }
              }
            }
          }
        },
        "required": [
          "program_name",
          "admission_requirements",
          "core_courses",
          "scholarship_opportunities"
        ]
      }
    },
    "graduate_programs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "program_name": { "type": "string" },
          "admission_requirements": {
            "type": "object",
            "properties": {
              "minimum_gpa": { "type": "number" },
              "minimum_test_scores": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "test_name": { "type": "string" },
                    "minimum_score": { "type": "string" }
                  }
                }
              },
              "other_requirements": { "type": "string" }
            }
          },
          "application_deadlines": { "type": "string" },
          "fee_structure": {
            "type": "object",
            "properties": {
              "domestic_students": { "type": "string" },
              "international_students": { "type": "string" }
            }
          },
          "core_courses": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "course_title": { "type": "string" },
                "description": { "type": "string" }
              }
            }
          },
          "scholarship_opportunities": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "scholarship_name": { "type": "string" },
                "eligibility_requirements": { "type": "string" },
                "award_amount": { "type": "string" }
              }
            }
          }
        },
        "required": [
          "program_name",
          "admission_requirements",
          "core_courses",
          "scholarship_opportunities"
        ]
      }
    }
  },
  "required": [
    "undergraduate_programs",
    "graduate_programs"
  ]
}`;

const DEFAULT_SOURCE_PLACEHOLDER = `[
  {
    "id": 101,
    "nombre": "Licenciatura en Ciencias de la Computación",
    "requisitos": { "promedio_minimo": 3.5, "examen": "SAT > 1200" },
    "cursos": [{ "titulo": "Algoritmos", "desc": "Intro a algoritmos" }]
  }
]`;

const DEFAULT_MODELS = [
  "gemini-3-pro-preview",
  "gemini-3-flash-preview",
  "gemini-2.5-flash-latest"
];

const App: React.FC = () => {
  const [sourceJson, setSourceJson] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<string>(DEFAULT_TARGET_SCHEMA);
  const [outputJson, setOutputJson] = useState<string>('');
  const [status, setStatus] = useState<TransformStatus>(TransformStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Settings
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3-pro-preview");
  const [tokenLimit, setTokenLimit] = useState<number>(1000000);
  const [availableModels, setAvailableModels] = useState<string[]>(DEFAULT_MODELS);
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  // Load example on mount if empty (optional, keeping clean for now)
  
  const fetchAvailableModels = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;

    setIsFetchingModels(true);
    try {
      // Trying to fetch models via REST API as it's not always exposed in frontend SDKs easily
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (!response.ok) throw new Error('Failed to fetch models');
      
      const data = await response.json();
      if (data.models) {
        const models = data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));
        
        // Merge with defaults to ensure we have the good ones
        const uniqueModels = Array.from(new Set([...DEFAULT_MODELS, ...models]));
        setAvailableModels(uniqueModels);
      }
    } catch (e) {
      console.warn("Could not fetch models dynamically, using defaults.", e);
      // Fallback is already set
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleTransform = async () => {
    if (!sourceJson.trim()) {
      setErrorMessage("Please provide source JSON data.");
      return;
    }
    if (!targetFormat.trim()) {
      setErrorMessage("Please provide a target format or schema.");
      return;
    }

    setStatus(TransformStatus.PROCESSING);
    setErrorMessage(null);
    setOutputJson('');

    try {
      const result = await transformJsonWithGemini(
        sourceJson, 
        targetFormat,
        selectedModel,
        tokenLimit
      );
      
      // Prettify
      let displayResult = result;
      try {
        const parsed = JSON.parse(result);
        displayResult = JSON.stringify(parsed, null, 2);
      } catch (e) {
        console.warn("Could not prettify result:", e);
      }
      
      setOutputJson(displayResult);
      setStatus(TransformStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setStatus(TransformStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!outputJson) return;
    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transformed_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadExample = () => {
    setSourceJson(DEFAULT_SOURCE_PLACEHOLDER);
    setTargetFormat(DEFAULT_TARGET_SCHEMA);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-darker flex flex-col font-sans selection:bg-primary/30">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <div className="mb-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Transform & Translate Data</h2>
            <p className="text-slate-400 max-w-2xl">
              Upload your JSON in any language. Define the output structure. 
              Let AI handle the mapping and translation to English instantly.
            </p>
          </div>
          <Button variant="secondary" onClick={handleLoadExample} className="whitespace-nowrap">
            Reset to Default
          </Button>
        </div>

        {/* Configuration Bar */}
        <div className="mb-6 bg-surface border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex items-center gap-2 text-slate-300 font-medium min-w-[100px]">
              <Settings2 className="w-5 h-5 text-secondary" />
              Settings
            </div>
            
            <div className="flex-1 flex flex-wrap gap-6 w-full">
              {/* Model Selector */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                <label className="text-xs text-slate-500 font-medium ml-1">AI Model</label>
                <div className="flex gap-2">
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="flex-1 bg-darker border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary outline-none"
                  >
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  <button 
                    onClick={fetchAvailableModels}
                    disabled={isFetchingModels}
                    className="p-2.5 bg-darker border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Fetch models from API"
                  >
                    <RefreshCw className={`w-4 h-4 ${isFetchingModels ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Token Limit */}
              <div className="flex flex-col gap-1.5 min-w-[150px]">
                <label className="text-xs text-slate-500 font-medium ml-1">Token Limit</label>
                <input 
                  type="number"
                  value={tokenLimit}
                  onChange={(e) => setTokenLimit(Number(e.target.value))}
                  step={1024}
                  min={1024}
                  className="bg-darker border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800/50 flex items-center gap-3 text-red-200 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-380px)] min-h-[600px]">
          
          {/* Left Column: Inputs */}
          <div className="flex flex-col gap-6 h-full">
            <div className="flex-1 min-h-0">
              <JsonEditor
                label="Source Data"
                subLabel="Paste JSON or upload file (any language)"
                value={sourceJson}
                onChange={setSourceJson}
                onFileUpload={setSourceJson}
                placeholder="// Paste source JSON here..."
              />
            </div>
            
            <div className="flex-1 min-h-0">
              <JsonEditor
                label="Target Structure"
                subLabel="Define schema or provide an example object"
                value={targetFormat}
                onChange={setTargetFormat}
                placeholder={DEFAULT_TARGET_SCHEMA}
              />
            </div>
          </div>

          {/* Center Action (Desktop) / Bottom Action (Mobile) */}
          <div className="lg:hidden flex justify-center py-4">
            <Button 
              onClick={handleTransform} 
              isLoading={status === TransformStatus.PROCESSING}
              leftIcon={<Wand2 className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Convert & Translate
            </Button>
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col h-full relative">
             {/* Desktop Floating Action Button */}
             <div className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10">
                <div className="bg-darker p-1 rounded-full border border-slate-800">
                  <button 
                    onClick={handleTransform}
                    disabled={status === TransformStatus.PROCESSING}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    title="Convert"
                  >
                    {status === TransformStatus.PROCESSING ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
             </div>

            <div className={`h-full transition-opacity duration-500 ${status === TransformStatus.PROCESSING ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <JsonEditor
                label="Result"
                subLabel="AI-transformed English JSON"
                value={outputJson}
                readOnly={true}
                onDownload={status === TransformStatus.SUCCESS ? handleDownload : undefined}
                placeholder="// Result will appear here..."
              />
            </div>

            {/* Processing Overlay inside the result area */}
            {status === TransformStatus.PROCESSING && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-darker/50 backdrop-blur-sm rounded-xl border border-slate-800 z-20">
                 <div className="flex items-center gap-3 text-primary mb-3">
                    <Wand2 className="w-6 h-6 animate-pulse" />
                    <span className="text-lg font-medium text-white">Alchemizing...</span>
                 </div>
                 <p className="text-sm text-slate-400">Processing complex data...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;