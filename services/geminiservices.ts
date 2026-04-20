import React, { useRef } from 'react';
import { Copy, Upload, Trash2, FileJson, Download } from 'lucide-react';
import { Button } from './Button';

interface JsonEditorProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  onFileUpload?: (content: string) => void;
  onDownload?: () => void;
  height?: string;
  subLabel?: string;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  onFileUpload,
  onDownload,
  height = "h-[400px]",
  subLabel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onFileUpload(text);
      };
      reader.readAsText(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    if (onChange) onChange('');
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-slate-800 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-primary" />
            {label}
          </h3>
          {subLabel && <p className="text-xs text-slate-500 mt-0.5">{subLabel}</p>}
        </div>
        <div className="flex items-center gap-1">
          {!readOnly && onFileUpload && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,.txt"
                className="hidden"
              />
              <Button variant="ghost" size="sm" onClick={handleTriggerUpload} title="Upload File" className="p-2">
                <Upload className="w-4 h-4" />
              </Button>
            </>
          )}
          {!readOnly && (
            <Button variant="ghost" size="sm" onClick={handleClear} title="Clear" className="p-2 text-rose-400 hover:text-rose-300">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {readOnly && onDownload && value && (
             <Button variant="ghost" size="sm" onClick={onDownload} title="Download JSON" className="p-2 text-emerald-400 hover:text-emerald-300">
              <Download className="w-4 h-4" />
            </Button>
          )}
          {readOnly && (
            <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy to Clipboard" className="p-2">
              <Copy className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 relative">
        <textarea
          className={`w-full h-full p-4 bg-transparent text-sm font-mono text-slate-300 resize-none focus:outline-none custom-scrollbar ${readOnly ? 'cursor-text' : 'cursor-text'}`}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          placeholder={placeholder}
          style={{ minHeight: '300px' }}
        />
      </div>
    </div>
  );
};
