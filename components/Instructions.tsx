import React from 'react';
import { ScissorsIcon, CubeIcon } from './icons';

interface InstructionsProps {
  shape: 'sphere' | 'cube';
}

export const Instructions: React.FC<InstructionsProps> = ({ shape }) => {

  if (shape === 'cube') {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xl no-print">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-full border border-blue-200">
            <CubeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Como Montar seu Cubo</h2>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-slate-600 text-lg marker:text-slate-400">
          <li>
            <span className="font-semibold text-slate-800">Imprima:</span> Imprima a imagem gerada em uma folha A4. Use papel mais grosso (cartolina) para um resultado mais firme.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Recorte:</span> Recorte cuidadosamente o contorno externo da forma (a "cruz").
          </li>
          <li>
            <span className="font-semibold text-slate-800">Dobre:</span> Dobre para dentro ao longo de todas as linhas internas que separam os quadrados.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Cole:</span> Forme o cubo e cole as abas para unir as faces. Comece formando uma "caixa" aberta e depois feche a "tampa".
          </li>
        </ol>
        <p className="mt-8 text-blue-800 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <strong>Dica:</strong> Vincar bem as dobras com uma régua antes de colar ajuda a obter um cubo com ângulos mais retos e definidos.
        </p>
      </div>
    );
  }

  if (shape === 'sphere') {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xl no-print">
        <div className="flex items-center gap-4 mb-6">
           <div className="p-3 bg-blue-100 rounded-full border border-blue-200">
            <ScissorsIcon className="w-8 h-8 text-blue-600" />
           </div>
          <h2 className="text-3xl font-bold text-slate-800">Como Montar sua Esfera</h2>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-slate-600 text-lg marker:text-slate-400">
          <li>
            <span className="font-semibold text-slate-800">Imprima:</span> Imprima a imagem gerada em uma folha de papel A4. Use um papel mais grosso (cartolina) para um resultado mais firme.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Recorte:</span> Recorte cuidadosamente cada um dos 12 gomos (as fatias que parecem gomos de laranja).
          </li>
          <li>
            <span className="font-semibold text-slate-800">Cole as Bordas:</span> Comece a colar as bordas dos gomos umas nas outras. Alinhe bem as pontas (os polos) para que a esfera fique simétrica.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Feche a Esfera:</span> Continue colando até restar apenas a última junção. Passe cola na última borda e feche cuidadosamente para completar sua esfera.
          </li>
        </ol>
        <p className="mt-8 text-blue-800 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <strong>Dica:</strong> Faça pequenas dobras nas bordas antes de colar para facilitar a junção. Tenha paciência e divirta-se!
        </p>
      </div>
    );
  }

  return null;
};