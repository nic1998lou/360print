
import React from 'react';
import { ScissorsIcon, CubeIcon } from './icons';

interface InstructionsProps {
  shape: 'sphere' | 'cube';
}

export const Instructions: React.FC<InstructionsProps> = ({ shape }) => {

  if (shape === 'cube') {
    return (
      <div className="w-full max-w-3xl mx-auto bg-gray-800/50 p-6 sm:p-8 rounded-lg border border-gray-700 no-print">
        <div className="flex items-center gap-4 mb-6">
          <CubeIcon className="w-8 h-8 text-teal-400" />
          <h2 className="text-3xl font-bold text-white">Como Montar seu Cubo</h2>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-gray-300 text-lg">
          <li>
            <span className="font-semibold text-white">Imprima:</span> Imprima a imagem gerada em uma folha A4. Use papel mais grosso (cartolina) para um resultado mais firme.
          </li>
          <li>
            <span className="font-semibold text-white">Recorte:</span> Recorte cuidadosamente o contorno externo da forma (a "cruz").
          </li>
          <li>
            <span className="font-semibold text-white">Dobre:</span> Dobre para dentro ao longo de todas as linhas internas que separam os quadrados.
          </li>
          <li>
            <span className="font-semibold text-white">Cole:</span> Forme o cubo e cole as abas para unir as faces. Comece formando uma "caixa" aberta e depois feche a "tampa".
          </li>
        </ol>
        <p className="mt-6 text-teal-300 bg-teal-900/50 p-3 rounded-md">
          <strong>Dica:</strong> Vincar bem as dobras com uma régua antes de colar ajuda a obter um cubo com ângulos mais retos e definidos.
        </p>
      </div>
    );
  }

  if (shape === 'sphere') {
    return (
      <div className="w-full max-w-3xl mx-auto bg-gray-800/50 p-6 sm:p-8 rounded-lg border border-gray-700 no-print">
        <div className="flex items-center gap-4 mb-6">
          <ScissorsIcon className="w-8 h-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">Como Montar sua Esfera</h2>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-gray-300 text-lg">
          <li>
            <span className="font-semibold text-white">Imprima:</span> Imprima a imagem gerada em uma folha de papel A4. Use um papel mais grosso (cartolina) para um resultado mais firme.
          </li>
          <li>
            <span className="font-semibold text-white">Recorte:</span> Recorte cuidadosamente cada um dos 12 gomos (as fatias que parecem gomos de laranja).
          </li>
          <li>
            <span className="font-semibold text-white">Cole as Bordas:</span> Comece a colar as bordas dos gomos umas nas outras. Alinhe bem as pontas (os polos) para que a esfera fique simétrica.
          </li>
          <li>
            <span className="font-semibold text-white">Feche a Esfera:</span> Continue colando até restar apenas a última junção. Passe cola na última borda e feche cuidadosamente para completar sua esfera.
          </li>
        </ol>
        <p className="mt-6 text-cyan-300 bg-cyan-900/50 p-3 rounded-md">
          <strong>Dica:</strong> Faça pequenas dobras nas bordas antes de colar para facilitar a junção. Tenha paciência e divirta-se!
        </p>
      </div>
    );
  }

  return null;
};
