
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Instructions } from './components/Instructions';
import { DownloadIcon, PrintIcon, SphereIcon, CubeIcon, LoadingSpinnerIcon } from './components/icons';
import { processImageToGores, processImageToCubeMap } from './services/imageProcessor';

type Shape = 'sphere' | 'cube';

const GeometricDivider: React.FC = () => (
    <div className="absolute bottom-0 left-0 w-full h-[150px] overflow-hidden leading-none" aria-hidden="true">
        <svg
            className="relative block w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1440 150"
        >
            <path
                fill="#ffffff"
                d="M0 150 L0 70 L120 90 L240 60 L360 80 L480 50 L600 70 L720 40 L840 60 L960 30 L1080 50 L1200 20 L1320 40 L1440 20 L1440 150 Z"
            />
        </svg>
    </div>
);


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
    <div className="bg-white text-slate-700">
      
      <div className="relative no-print bg-[#0052ff] h-[480px]">
        <div className="relative z-10 text-center text-white px-4 pt-20 sm:pt-24">
            <h1 className="text-sm font-bold tracking-widest uppercase">Bem-vindo ao Futuro da Criação</h1>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mt-2">GERADOR DE SÓLIDOS</h2>
            <p className="mt-4 max-w-xl mx-auto text-lg">
            Transforme sua imagem panorâmica em um sólido de papel para imprimir e montar.
            </p>
        </div>
        <GeometricDivider />
      </div>

      <main className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto mt-[-208px] relative z-20">
            {!sourceImageUrl && !isLoading && !error && (
              <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
            )}

            {isLoading && (
                <div className="flex flex-col items-center justify-center h-96 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200">
                    <LoadingSpinnerIcon className="w-16 h-16 text-[#0052ff]"/>
                    <p className="mt-4 text-lg text-slate-600">Processando sua imagem... por favor, aguarde.</p>
                </div>
            )}

            {error && (
                <div className="w-full max-w-3xl mx-auto my-4 p-8 bg-red-50/80 backdrop-blur-md border border-red-300 rounded-3xl text-center shadow-2xl">
                    <p className="font-bold text-lg text-red-800">Ocorreu um Erro!</p>
                    <p className="text-red-600 mt-2">{error}</p>
                    <button onClick={handleReset} className="mt-6 px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500">
                        Tentar Novamente
                    </button>
                </div>
            )}
            
            {/* --- SHAPE SELECTION SCREEN --- */}
            {sourceImageUrl && !processedImageUrl && !isLoading && !error && (
              <div className="w-full max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-slate-200/50 no-print">
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold mb-6 text-slate-800 tracking-tight text-center">1. Sua Imagem Original</h2>
                  <div className="w-full max-w-3xl mx-auto aspect-video bg-slate-100 rounded-2xl overflow-hidden ring-1 ring-slate-200/50 shadow-inner">
                      <img src={sourceImageUrl} alt="Original" className="w-full h-full object-cover" />
                  </div>
                
                  <div className="w-full mt-12 text-center">
                      <h2 className="text-3xl font-bold mb-8 text-slate-800 tracking-tight">2. Escolha o Formato Final</h2>
                      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6">
                      <button
                          onClick={() => handleProcessRequest('sphere')}
                          className="flex items-center gap-3 px-8 py-4 bg-[#0052ff] text-white font-bold text-lg rounded-md hover:bg-[#0048e0] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                          <SphereIcon className="w-7 h-7" />
                          Gerar Esfera
                      </button>
                      <button
                          onClick={() => handleProcessRequest('cube')}
                          className="flex items-center gap-3 px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 font-bold text-lg rounded-md hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-500/20 focus:outline-none focus:ring-4 focus:ring-slate-200"
                      >
                          <CubeIcon className="w-7 h-7 text-[#0052ff]" />
                          Gerar Cubo
                      </button>
                      </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* --- RESULTS SCREEN --- */}
            {processedImageUrl && !isLoading && !error && (
              <>
                <div className="w-full bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-slate-200/50 no-print">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Original Image Card */}
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200">
                          <h2 className="text-xl font-bold mb-4 text-slate-800 text-center">Sua Imagem Original</h2>
                          <div className="w-full aspect-video bg-slate-100 rounded-lg overflow-hidden ring-1 ring-slate-200">
                              {sourceImageUrl && <img src={sourceImageUrl} alt="Original" className="w-full h-full object-cover" />}
                          </div>
                      </div>
                    </div>
                    
                    {/* Processed Image Card */}
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 text-center">
                          Pronto para Imprimir ({getShapeName(processedShape)})
                        </h2>
                        <div id="printable-area" className="w-full aspect-[297/210] bg-slate-50 rounded-lg p-2 shadow-inner">
                            {processedImageUrl && <img id="printable-image" src={processedImageUrl} alt="Processada para impressão" className="w-full h-full object-contain" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center flex-wrap justify-center gap-4 mt-8">
                      <a
                          href={processedImageUrl}
                          download={`${processedShape}-para-imprimir.png`}
                          className="flex items-center gap-2 px-6 py-3 bg-[#0052ff] text-white font-semibold rounded-lg hover:bg-[#0048e0] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                          <DownloadIcon className="w-5 h-5" />
                          Baixar PNG
                      </a>
                      <button
                          onClick={handlePrint}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-500/20 focus:outline-none focus:ring-4 focus:ring-slate-200"
                      >
                          <PrintIcon className="w-5 h-5" />
                          Imprimir
                      </button>
                  </div>
                </div>

                {/* Instructions and Reset */}
                <div className="mt-12 no-print">
                    <Instructions shape={processedShape!} />
                    <div className="text-center mt-12">
                        <button onClick={handleReset} className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400">
                            Começar de Novo com Outra Imagem
                        </button>
                    </div>
                </div>
              </>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
