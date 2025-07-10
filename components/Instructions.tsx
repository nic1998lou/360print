import React from 'react';
import { ScissorsIcon, CubeIcon } from './icons';

interface InstructionsProps {
  shape: 'sphere' | 'cube';
}

export const Instructions: React.FC<InstructionsProps> = ({ shape }) => {

  const baseCardClasses = "w-full bg-white/90 backdrop-blur-sm text-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/20 no-print";

  if (shape === 'cube') {
    return (
      <div className={baseCardClasses}>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-full border border-purple-200">
            <CubeIcon className="w-8 h-8 text-[#A23CCA]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">Como Montar seu Cubo</h2>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-slate-600 text-lg marker:text-slate-400">
          <li>
            <span className="font-semibold text-slate-800">Imprima:</span> Em papel A4, de preferência cartolina.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Recorte:</span> Recorte o contorno externo da forma.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Dobre:</span> Dobre para dentro ao longo das linhas tracejadas.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Cole:</span> Forme o cubo e cole as abas para unir as faces.
          </li>
        </ol>
        <p className="mt-8 text-purple-800 bg-purple-50 p-4 rounded-lg border border-purple-200">
          <strong>Dica:</strong> Vincar bem as dobras com uma régua ajuda a obter um cubo com ângulos mais retos.
        </p>
      </div>
    );
  }

  if (shape === 'sphere') {
    return (
      <div className={baseCardClasses}>
        <div className="flex items-center gap-4 mb-6">
           <div className="p-3 bg-purple-100 rounded-full border border-purple-200">
            <ScissorsIcon className="w-8 h-8 text-[#A23CCA]" />
           </div>
          <h2 className="text-2xl sm:text-3xl font-bold">Como Montar sua Esfera</h2>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-slate-600 text-lg marker:text-slate-400">
          <li>
            <span className="font-semibold text-slate-800">Imprima:</span> Em papel A4, de preferência cartolina.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Recorte:</span> Recorte cada um dos 12 gomos.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Cole as Bordas:</span> Comece a colar as bordas dos gomos umas nas outras, alinhando as pontas.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Feche a Esfera:</span> Continue colando até fechar a última junção.
          </li>
        </ol>
        <p className="mt-8 text-purple-800 bg-purple-50 p-4 rounded-lg border border-purple-200">
          <strong>Dica:</strong> Faça pequenas dobras nas bordas antes de colar para facilitar a junção. Tenha paciência!
        </p>
      </div>
    );
  }

  return null;
};