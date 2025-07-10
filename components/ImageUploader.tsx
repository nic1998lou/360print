import React, { useState, useCallback } from 'react';

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
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`no-print w-full flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-3xl transition-all duration-300 shadow-2xl shadow-black/20 bg-white/90 backdrop-blur-sm
      ${isDragging ? 'ring-4 ring-[#A23CCA]' : 'ring-1 ring-white/20'}`}
    >
      <input
        id="image-upload"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <div className="w-full">
        <p className="hidden sm:block text-slate-500 mb-4 text-sm">
            Arraste e solte uma imagem panorâmica aqui, ou
        </p>
        <label htmlFor="image-upload" className="w-full cursor-pointer flex items-center justify-center gap-3 px-8 py-3 bg-[#A23CCA] text-white font-bold text-base rounded-full hover:bg-[#8f2eb8] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#a23cca]/30 focus:outline-none focus:ring-4 focus:ring-[#a23cca]/50">
            Selecionar Arquivo
        </label>
        <p className="text-xs text-slate-500 mt-4">Use imagens equirretangulares (2:1) para melhores resultados.</p>
      </div>
    </div>
  );
};