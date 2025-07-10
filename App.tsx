
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Instructions } from './components/Instructions';
import { DownloadIcon, PrintIcon, SphereIcon, CubeIcon, LoadingSpinnerIcon, ArrowLeftIcon } from './components/icons';
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

  const handleGoBack = () => {
    if (processedImageUrl) {
      setProcessedImageUrl(null);
      setProcessedShape(null);
      setError(null);
    } 
    else if (sourceImageUrl) {
      handleReset();
    }
  };
  
  const getShapeName = (shape: Shape | null) => {
    if (shape === 'sphere') return 'Esfera';
    if (shape === 'cube') return 'Cubo';
    return '';
  };

  const showBackButton = sourceImageUrl && !isLoading && !error;
  const getHeaderTitle = () => {
    if (error) return "Ocorreu um Erro";
    if (isLoading) return "Processando...";
    if (processedImageUrl) return `Resultado: ${getShapeName(processedShape)}`;
    if (sourceImageUrl) return "Escolha o Formato";
    return ""; // No title on welcome screen
  };

  return (
    <div className="bg-gradient-to-br from-[#A23CCA] to-indigo-600 min-h-screen text-white font-sans">
      
      <header className="no-print bg-transparent absolute top-0 left-0 right-0 z-30">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-center h-16">
                  {showBackButton && (
                    <button
                      onClick={handleGoBack}
                      className="absolute left-0 p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#A23CCA] focus:ring-white"
                      aria-label="Voltar"
                    >
                      <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                  )}
                  <h1 className="text-lg font-bold tracking-tight text-center px-12 truncate">
                      {getHeaderTitle()}
                  </h1>
              </div>
          </div>
      </header>

      <main className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-8 flex flex-col justify-center min-h-screen">
        <div className="max-w-md w-full mx-auto">
          {!sourceImageUrl && !isLoading && !error && (
            <>
              <div className="flex flex-col items-center text-center mb-8 no-print">
                <img src="/assets/logo.png" alt="Logo do Aplicativo" className="h-52 w-auto object-contain" />
                <h1 className="text-4xl font-bold mt-6 text-white tracking-tight">Bem-vindo!</h1>
                <p className="mt-2 text-white/80 max-w-sm">Transforme imagens 360 em sólidos de papel para montar.</p>
              </div>
              <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
            </>
          )}

          {isLoading && (
              <div className="w-full flex flex-col items-center justify-center p-8 min-h-[300px] bg-white/90 backdrop-blur-sm text-slate-800 rounded-3xl shadow-2xl shadow-black/20">
                  <LoadingSpinnerIcon className="w-16 h-16 text-[#A23CCA]"/>
                  <p className="mt-4 text-lg text-slate-600 text-center">Processando sua imagem...</p>
              </div>
          )}

          {error && (
              <div className="w-full my-4 p-8 bg-white/90 backdrop-blur-sm rounded-3xl text-center shadow-2xl shadow-black/20">
                  <p className="font-bold text-lg text-red-700">Ocorreu um Erro!</p>
                  <p className="text-red-600 mt-2">{error}</p>
                  <button onClick={handleReset} className="mt-6 w-full flex items-center justify-center gap-3 px-8 py-3 bg-[#A23CCA] text-white font-bold text-base rounded-full hover:bg-[#8f2eb8] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#a23cca]/30 focus:outline-none focus:ring-4 focus:ring-[#a23cca]/50">
                      Tentar Novamente
                  </button>
              </div>
          )}
          
          {sourceImageUrl && !processedImageUrl && !isLoading && !error && (
            <div className="w-full bg-white/90 backdrop-blur-sm text-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/20 no-print">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 tracking-tight text-center">Sua Imagem Original</h2>
                <div className="w-full aspect-video bg-slate-100 rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-inner mb-8">
                    <img src={sourceImageUrl} alt="Original" className="w-full h-full object-cover" />
                </div>
              
                <div className="w-full border-t border-slate-200 pt-6 text-center">
                    <div className="flex flex-col justify-center items-center gap-4 w-full">
                    <button
                        onClick={() => handleProcessRequest('sphere')}
                        className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-[#A23CCA] text-white font-bold text-base rounded-full hover:bg-[#8f2eb8] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#a23cca]/30 focus:outline-none focus:ring-4 focus:ring-[#a23cca]/50"
                    >
                        <SphereIcon className="w-6 h-6" />
                        Gerar Esfera
                    </button>
                    <button
                        onClick={() => handleProcessRequest('cube')}
                        className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-white text-[#A23CCA] border-2 border-purple-200 font-bold text-base rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-500/20 focus:outline-none focus:ring-4 focus:ring-purple-200"
                    >
                        <CubeIcon className="w-6 h-6" />
                        Gerar Cubo
                    </button>
                    </div>
                </div>
              </div>
            </div>
          )}
          
          {processedImageUrl && !isLoading && !error && (
            <>
              <div className="w-full bg-white/90 backdrop-blur-sm text-slate-800 p-4 sm:p-6 rounded-3xl shadow-2xl shadow-black/20 no-print">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
                      <h2 className="text-lg font-bold mb-3 text-slate-800 text-center">
                        Pronto para Imprimir ({getShapeName(processedShape)})
                      </h2>
                      <div id="printable-area" className="w-full aspect-[297/210] bg-white rounded-lg p-1 shadow-inner ring-1 ring-slate-200">
                          {processedImageUrl && <img id="printable-image" src={processedImageUrl} alt="Processada para impressão" className="w-full h-full object-contain" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
                        <h2 className="text-lg font-bold mb-3 text-slate-800 text-center">Sua Imagem Original</h2>
                        <div className="w-full aspect-video bg-slate-100 rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-inner">
                            {sourceImageUrl && <img src={sourceImageUrl} alt="Original" className="w-full h-full object-cover" />}
                        </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-4 w-full">
                    <a
                      href={processedImageUrl}
                      download={`printable_${processedShape}.png`}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-white text-[#A23CCA] border-2 border-purple-200 font-bold text-base rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-slate-500/20 focus:outline-none focus:ring-4 focus:ring-purple-200"
                    >
                      <DownloadIcon className="w-5 h-5" />
                      Download
                    </a>
                    <button
                      onClick={handlePrint}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-[#A23CCA] text-white font-bold text-base rounded-full hover:bg-[#8f2eb8] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#a23cca]/30 focus:outline-none focus:ring-4 focus:ring-[#a23cca]/50"
                    >
                      <PrintIcon className="w-5 h-5" />
                      Imprimir
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                {processedShape && <Instructions shape={processedShape} />}
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
