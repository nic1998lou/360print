import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onImageUpload]);


  return (
    <div className="w-full max-w-2xl mx-auto no-print">
      <label
        htmlFor="image-upload"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`group w-full flex flex-col items-center justify-center text-center cursor-pointer p-8 sm:p-10 rounded-2xl transition-all duration-300 border-2 border-dashed shadow-xl
        ${isDragging ? 'border-blue-500 bg-white/95' : 'border-slate-300/60 bg-white/80 hover:border-blue-400'}
        backdrop-blur-md`}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <div className={`p-3 rounded-full bg-slate-200/50 mb-4 transition-all duration-300`}>
            <UploadIcon className={`w-10 h-10 text-slate-500 transition-colors duration-300`} />
        </div>
        <h3 className="text-xl font-semibold text-slate-700">Arraste e solte sua imagem aqui</h3>
        <p className="text-slate-500 mt-1.5 text-sm">ou</p>
        <div className="mt-4 px-6 py-2.5 bg-[#0052ff] hover:bg-[#0048e0] rounded-lg font-medium text-white transition-colors duration-200 shadow-sm">
          Selecione um arquivo
        </div>
        <p className="text-xs text-slate-500 mt-6">Use imagens panorâmicas (equiretangular 2:1) para melhores resultados.</p>
      </label>
    </div>
  );
};