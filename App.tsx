
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Instructions } from './components/Instructions';
import { DownloadIcon, PrintIcon, SphereIcon, CubeIcon, LoadingSpinnerIcon } from './components/icons';
import { processImageToGores, processImageToCubeMap } from './services/imageProcessor';

type Shape = 'sphere' | 'cube';

const App: React.FC = () => {
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [processedShape, setProcessedShape] = useState<Shape | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);
    setProcessedImageUrl(null);
    setSourceImageUrl(null);
    setProcessedShape(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setSourceImageUrl(imageUrl);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError('Falha ao ler o arquivo de imagem.');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleProcessRequest = async (shape: Shape) => {
    if (!sourceImageUrl) return;

    setIsLoading(true);
    setError(null);
    setProcessedImageUrl(null);

    try {
      let processed: string;
      if (shape === 'sphere') {
        processed = await processImageToGores(sourceImageUrl);
      } else { // shape === 'cube'
        processed = await processImageToCubeMap(sourceImageUrl);
      }
      setProcessedImageUrl(processed);
      setProcessedShape(shape);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido durante o processamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
      window.print();
  };
  
  const handleReset = () => {
    setSourceImageUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    setIsLoading(false);
    setProcessedShape(null);
  };
  
  const getShapeName = (shape: Shape | null) => {
    if (shape === 'sphere') return 'Esfera';
    if (shape === 'cube') return 'Cubo';
    return '';
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8 transition-all duration-300">
      <header className="w-full max-w-5xl text-center mb-8 no-print">
        <div className="flex items-center justify-center gap-4 mb-2">
            <SphereIcon className="w-12 h-12 text-cyan-400"/>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Gerador de Sólidos Imprimíveis</h1>
        </div>
        <p className="text-lg text-gray-400">Transforme sua imagem 360° em uma esfera ou cubo de papel.</p>
      </header>

      <main className="w-full max-w-5xl flex-grow">
        {!sourceImageUrl && !isLoading && (
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
        )}

        {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-lg">
                <LoadingSpinnerIcon className="w-16 h-16 text-cyan-400"/>
                <p className="mt-4 text-lg text-gray-300">Processando sua imagem... por favor, aguarde.</p>
            </div>
        )}

        {error && (
            <div className="my-4 p-4 bg-red-800/50 border border-red-600 rounded-lg text-center">
                <p className="font-semibold text-red-300">Erro!</p>
                <p className="text-red-400">{error}</p>
                 <button onClick={handleReset} className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md font-semibold transition-colors">
                    Tentar Novamente
                </button>
            </div>
        )}

        {sourceImageUrl && !processedImageUrl && !isLoading && (
          <div className="flex flex-col items-center no-print">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">1. Sua Imagem Original</h2>
            <div className="w-full max-w-2xl aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
              <img src={sourceImageUrl} alt="Original" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">2. Escolha o Formato Final</h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6">
              <button
                onClick={() => handleProcessRequest('sphere')}
                className="flex items-center gap-3 px-8 py-4 bg-cyan-600 text-white font-bold text-lg rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 shadow-lg"
              >
                <SphereIcon className="w-7 h-7" />
                Gerar Esfera
              </button>
              <button
                onClick={() => handleProcessRequest('cube')}
                className="flex items-center gap-3 px-8 py-4 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-500 transition-transform transform hover:scale-105 shadow-lg"
              >
                <CubeIcon className="w-7 h-7" />
                Gerar Cubo
              </button>
            </div>
          </div>
        )}
        
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${!processedImageUrl ? 'hidden' : ''}`}>
             <div className="flex flex-col items-center no-print">
                <h2 className="text-2xl font-semibold mb-4 text-gray-300">Sua Imagem Original</h2>
                <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    {sourceImageUrl && <img src={sourceImageUrl} alt="Original" className="w-full h-full object-cover" />}
                </div>
            </div>
            
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-gray-300 no-print">
                  Pronto para Imprimir ({getShapeName(processedShape)})
                </h2>
                <div id="printable-area" className="w-full aspect-[297/210] bg-white rounded-lg overflow-hidden shadow-lg ring-2 ring-cyan-500/50">
                     {processedImageUrl && <img id="printable-image" src={processedImageUrl} alt="Processada para impressão" className="w-full h-full object-contain" />}
                </div>
                {processedImageUrl && (
                  <div className="flex items-center gap-4 mt-6 no-print">
                     <a
                        href={processedImageUrl}
                        download={`${processedShape}-para-imprimir.png`}
                        className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 shadow-lg"
                      >
                        <DownloadIcon className="w-5 h-5" />
                        Baixar PNG
                      </a>
                       <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105 shadow-lg"
                      >
                        <PrintIcon className="w-5 h-5" />
                        Imprimir
                      </button>
                  </div>
                )}
            </div>
        </div>

        {processedImageUrl && (
            <div className="mt-12 no-print">
                <Instructions shape={processedShape!} />
                <div className="text-center mt-8">
                     <button onClick={handleReset} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors">
                        Começar de Novo com Outra Imagem
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
