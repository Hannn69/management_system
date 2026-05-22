"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image", className = "" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
        <Upload className="h-3 w-3" /> {label}
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-6 transition-all hover:bg-zinc-200 dark:hover:bg-white/[0.08] hover:border-emerald-500/30 cursor-pointer overflow-hidden shadow-inner"
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {value ? (
          <div className="relative w-full aspect-video md:aspect-auto md:h-32 rounded-xl overflow-hidden shadow-lg border border-white/10">
            <img src={value} alt="Preview" className="h-full w-full object-contain" />
            <button 
              onClick={handleClear}
              className="absolute right-2 top-2 rounded-full bg-rose-500 p-1.5 text-white shadow-lg transition-transform hover:scale-110 active:scale-90"
              title="Remove Image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 transition-transform group-hover:scale-110">
              <Upload className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-600 dark:text-zinc-200">
                {fileName || "Click to select file"}
              </p>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest font-medium">
                PNG, JPG or SVG (Max 2MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
