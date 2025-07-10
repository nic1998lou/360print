/**
 * Processes a 360-degree equirectangular image into a gored sphere projection.
 * This output can be printed, cut, and assembled into a sphere.
 * @param imageUrl The data URL of the source image.
 * @param numGores The number of segments (gores) to create. 12 is a good default.
 * @returns A Promise that resolves with a data URL of the processed PNG image.
 */
export const processImageToGores = async (
  imageUrl: string,
  numGores: number = 12,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const sourceImage = new Image();
    sourceImage.crossOrigin = "Anonymous";

    sourceImage.onload = () => {
      // Use high-resolution dimensions matching A4 at 300 DPI (landscape)
      const outputWidth = 3508;
      const outputHeight = 2480;

      const outCanvas = document.createElement('canvas');
      outCanvas.width = outputWidth;
      outCanvas.height = outputHeight;
      const outCtx = outCanvas.getContext('2d', { willReadFrequently: true });

      if (!outCtx) {
        return reject(new Error('Não foi possível obter o contexto do canvas de saída.'));
      }

      // Fill with a white background for printing
      outCtx.fillStyle = 'white';
      outCtx.fillRect(0, 0, outputWidth, outputHeight);

      // Create an intermediate canvas for the source image to read pixels efficiently
      const inCanvas = document.createElement('canvas');
      inCanvas.width = sourceImage.width;
      inCanvas.height = sourceImage.height;
      const inCtx = inCanvas.getContext('2d', { willReadFrequently: true });
       if (!inCtx) {
        return reject(new Error('Não foi possível obter o contexto do canvas de origem.'));
      }
      inCtx.drawImage(sourceImage, 0, 0);
      const inImageData = inCtx.getImageData(0, 0, inCanvas.width, inCanvas.height);
      const inPixels = inImageData.data;

      // Mathematical constants for projection
      const PI = Math.PI;
      const PI_2 = PI / 2;
      const TWO_PI = PI * 2;

      // To create a perfect sphere, the length of a gore (pole-to-pole) must be
      // half the sphere's circumference. The total width of all gores laid side-by-side
      // represents the circumference at the equator.
      // Therefore, the height of the gore pattern must be half of its total width.
      const totalGorePatternWidth = outputWidth;
      const correctGoreHeight = Math.floor(totalGorePatternWidth / 2);
      const goreWidth = totalGorePatternWidth / numGores;

      // Calculate vertical offset to center the gores on the A4 page
      const yOffset = (outputHeight - correctGoreHeight) / 2;


      // Loop through every pixel of the target drawing area
      for (let y = 0; y < correctGoreHeight; y++) {
        for (let x = 0; x < totalGorePatternWidth; x++) {
          
          const goreIndex = Math.floor(x / goreWidth);
          const xInGore = x % goreWidth;

          // Convert the pixel's y-coordinate to latitude (-PI/2 to PI/2)
          // This calculation is now based on the geometrically correct height.
          const lat = (y / correctGoreHeight) * PI - PI_2;
          
          // Calculate the width of the gore at this latitude
          const widthAtLat = Math.cos(lat) * (goreWidth / 2);

          // Check if the current pixel is inside the gore's curved boundary
          if (Math.abs(xInGore - goreWidth / 2) < widthAtLat) {
            // Map the position within the gore slice to a longitude
            const lon_in_gore_slice = ((xInGore - goreWidth / 2) / widthAtLat) * (PI / numGores);
            const lon = (goreIndex - (numGores / 2 - 0.5)) * (TWO_PI / numGores) + lon_in_gore_slice;
            
            // Convert longitude/latitude to UV coordinates of the source image
            let u = (lon + PI) / TWO_PI;
            let v = (lat + PI_2) / PI;

            const sourceX = Math.floor(u * inCanvas.width);
            const sourceY = Math.floor(v * inCanvas.height);

            if (sourceX >= 0 && sourceX < inCanvas.width && sourceY >= 0 && sourceY < inCanvas.height) {
              const pixelIndex = (sourceY * inCanvas.width + sourceX) * 4;
              const r = inPixels[pixelIndex];
              const g = inPixels[pixelIndex + 1];
              const b = inPixels[pixelIndex + 2];
              
              outCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              // Draw the pixel at the correct location, including the vertical offset
              outCtx.fillRect(x, y + yOffset, 1, 1);
            }
          }
        }
      }
      
      resolve(outCanvas.toDataURL('image/png'));
    };

    sourceImage.onerror = (err) => {
      console.error("Image loading error:", err);
      reject(new Error(`Falha ao carregar a imagem. Verifique se o arquivo é válido.`));
    };

    sourceImage.src = imageUrl;
  });
};

/**
 * Processes a 360-degree equirectangular image into a cube map net.
 * This output can be printed, cut, and folded into a cube.
 * @param imageUrl The data URL of the source image.
 * @returns A Promise that resolves with a data URL of the processed PNG image.
 */
export const processImageToCubeMap = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const sourceImage = new Image();
    sourceImage.crossOrigin = 'Anonymous';

    sourceImage.onload = () => {
      const outputWidth = 3508;
      const outputHeight = 2480;

      const outCanvas = document.createElement('canvas');
      outCanvas.width = outputWidth;
      outCanvas.height = outputHeight;
      const outCtx = outCanvas.getContext('2d', { willReadFrequently: true });
      if (!outCtx) return reject(new Error('Could not get output canvas context.'));

      outCtx.fillStyle = 'white';
      outCtx.fillRect(0, 0, outputWidth, outputHeight);

      const inCanvas = document.createElement('canvas');
      inCanvas.width = sourceImage.width;
      inCanvas.height = sourceImage.height;
      const inCtx = inCanvas.getContext('2d', { willReadFrequently: true });
      if (!inCtx) return reject(new Error('Could not get input canvas context.'));
      inCtx.drawImage(sourceImage, 0, 0);
      const inImageData = inCtx.getImageData(0, 0, inCanvas.width, inCanvas.height);
      const inPixels = inImageData.data;
      
      const PI = Math.PI;
      const PI_2 = PI / 2;

      // Layout for a cross shape (3 faces wide, 4 faces high) on landscape A4
      const faceSize = 600; // Face side length
      const layoutWidth = 3 * faceSize;
      const layoutHeight = 4 * faceSize;
      const offsetX = (outputWidth - layoutWidth) / 2;
      const offsetY = (outputHeight - layoutHeight) / 2;

      const faces = {
        top:    { x: offsetX + faceSize, y: offsetY },
        left:   { x: offsetX, y: offsetY + faceSize },
        front:  { x: offsetX + faceSize, y: offsetY + faceSize },
        right:  { x: offsetX + 2 * faceSize, y: offsetY + faceSize },
        bottom: { x: offsetX + faceSize, y: offsetY + 2 * faceSize },
        back:   { x: offsetX + faceSize, y: offsetY + 3 * faceSize },
      };

      const copyPixel = (sourceX: number, sourceY: number, destX: number, destY: number) => {
          const sx = Math.floor(sourceX) % inCanvas.width;
          const sy = Math.floor(sourceY) % inCanvas.height;
          const i = (sy * inCanvas.width + sx) * 4;
          const r = inPixels[i];
          const g = inPixels[i + 1];
          const b = inPixels[i + 2];
          outCtx.fillStyle = `rgb(${r},${g},${b})`;
          outCtx.fillRect(destX, destY, 1, 1);
      };

      for (let faceName in faces) {
        const face = faces[faceName as keyof typeof faces];

        for (let j = 0; j < faceSize; j++) {
          for (let i = 0; i < faceSize; i++) {
            const u = (2 * i / faceSize) - 1; // -1 to 1
            const v = (2 * j / faceSize) - 1; // -1 to 1

            let x=0, y=0, z=0;
            switch(faceName) {
                case 'front':  x = u;      y = -v;     z = 1;      break;
                case 'back':   x = -u;     y = v;      z = -1;     break; // Flipped vertically
                case 'left':   x = -1;     y = -v;     z = u;      break;
                case 'right':  x = 1;      y = -v;     z = -u;     break;
                case 'top':    x = u;      y = 1;      z = v;      break;
                case 'bottom': x = u;      y = -1;     z = -v;     break;
            }
            
            const r = Math.sqrt(x * x + y * y + z * z);
            // Invert the X coordinate in atan2 to correct the horizontal mirroring of the image.
            const lon = Math.atan2(-x, z);
            const lat = Math.asin(y / r);

            const sourceU = (lon + PI) / (2 * PI);
            const sourceV = (lat + PI_2) / PI;
            
            const sourceX = sourceU * inCanvas.width;
            const sourceY = sourceV * inCanvas.height;

            copyPixel(sourceX, sourceY, face.x + i, face.y + j);
          }
        }
      }

      // Draw cut and fold lines
      const S = faceSize;
      
      // Cut lines (outer border)
      outCtx.strokeStyle = 'rgba(0,0,0,0.4)';
      outCtx.lineWidth = 2;
      outCtx.setLineDash([]); // Solid line
      outCtx.beginPath();
      outCtx.moveTo(faces.top.x, faces.top.y);
      outCtx.lineTo(faces.top.x + S, faces.top.y);
      outCtx.lineTo(faces.top.x + S, faces.right.y);
      outCtx.lineTo(faces.right.x + S, faces.right.y);
      outCtx.lineTo(faces.right.x + S, faces.right.y + S);
      outCtx.lineTo(faces.bottom.x + S, faces.right.y + S);
      outCtx.lineTo(faces.bottom.x + S, faces.bottom.y + S);
      outCtx.lineTo(faces.back.x + S, faces.bottom.y + S);
      outCtx.lineTo(faces.back.x + S, faces.back.y + S);
      outCtx.lineTo(faces.back.x, faces.back.y + S);
      outCtx.lineTo(faces.back.x, faces.bottom.y + S);
      outCtx.lineTo(faces.left.x, faces.bottom.y + S);
      outCtx.lineTo(faces.left.x, faces.left.y + S);
      outCtx.lineTo(faces.left.x + S, faces.left.y + S);
      outCtx.lineTo(faces.left.x + S, faces.top.y);
      outCtx.closePath();
      outCtx.stroke();
      
      // Fold lines (inner lines)
      outCtx.strokeStyle = 'rgba(50,50,50,0.5)';
      outCtx.setLineDash([15, 5]);
      outCtx.beginPath();
      outCtx.moveTo(faces.top.x, faces.top.y + S);
      outCtx.lineTo(faces.top.x + S, faces.top.y + S);
      outCtx.moveTo(faces.front.x, faces.front.y + S);
      outCtx.lineTo(faces.front.x + S, faces.front.y + S);
      outCtx.moveTo(faces.bottom.x, faces.bottom.y + S);
      outCtx.lineTo(faces.bottom.x + S, faces.bottom.y + S);
      outCtx.moveTo(faces.left.x + S, faces.left.y);
      outCtx.lineTo(faces.left.x + S, faces.left.y + S);
      outCtx.moveTo(faces.right.x, faces.right.y);
      outCtx.lineTo(faces.right.x, faces.right.y + S);
      outCtx.stroke();

      resolve(outCanvas.toDataURL('image/png'));
    };

    sourceImage.onerror = (err) => {
      console.error("Image loading error:", err);
      reject(new Error('Falha ao carregar a imagem. Verifique se o arquivo é válido.'));
    };

    sourceImage.src = imageUrl;
  });
};