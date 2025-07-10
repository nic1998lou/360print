
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
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl transition-all duration-300 hover:border-cyan-500 hover:bg-gray-800/80 no-print">
      <label
        htmlFor="image-upload"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full flex flex-col items-center justify-center text-center cursor-pointer p-8 rounded-lg ${isDragging ? 'bg-cyan-500/10' : ''}`}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <UploadIcon className="w-16 h-16 mb-4 text-gray-500 transition-colors group-hover:text-cyan-400" />
        <h3 className="text-xl font-semibold text-white">Arraste e solte sua imagem aqui</h3>
        <p className="text-gray-400 mt-1">ou</p>
        <p className="mt-2 px-6 py-2 bg-gray-700 rounded-md font-medium text-white">
          Selecione um arquivo
        </p>
        <p className="text-xs text-gray-500 mt-6">Use imagens panorâmicas (equiretangular 2:1) para melhores resultados.</p>
      </label>
    </div>
  );
};
