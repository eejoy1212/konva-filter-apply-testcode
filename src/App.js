//되는거1->sepia만
// import React, { useEffect, useState } from 'react';
// import { Stage, Layer, Image as KonvaImage } from 'react-konva';
// import imgSrc from "./images/temp.jpg";
// import './App.css';
// import Konva from 'konva';

// function App() {
//   const [images, setImages] = useState([]);
//   const [sepiaValues, setSepiaValues] = useState([0.4, 1]);

//   useEffect(() => {
//     const loadImages = async () => {
//       const [image1, image2] = await Promise.all([
//         loadImage(imgSrc),
//         loadImage(imgSrc)
//       ]);

//       // 스타일 적용
//       applyStyles(image1, { width: 800 });
//       applyStyles(image2, { width: 800 });

//       setImages([image1, image2]);
//     };

//     loadImages();
//   }, []);

//   const loadImage = (src) => {
//     return new Promise((resolve) => {
//       const img = new window.Image();
//       img.crossOrigin = 'Anonymous';
//       img.src = src;
//       img.onload = () => resolve(img);
//     });
//   };

//   const applyStyles = (img, styles) => {
//     Object.assign(img, styles);
//   };

  // const applySepiaFilter = (image, sepiaValue) => {
  //   const canvas = document.createElement('canvas');
  //   const context = canvas.getContext('2d');
  //   canvas.width = image.width;
  //   canvas.height = image.height;
  //   context.drawImage(image, 0, 0, image.width, image.height);
  //   const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  //   const data = imageData.data;
  //   for (let i = 0; i < data.length; i += 4) {
  //     const r = data[i];
  //     const g = data[i + 1];
  //     const b = data[i + 2];
  //     data[i] = r * (1 - sepiaValue) + (r * 0.393 + g * 0.769 + b * 0.189) * sepiaValue;
  //     data[i + 1] = g * (1 - sepiaValue) + (r * 0.349 + g * 0.686 + b * 0.168) * sepiaValue;
  //     data[i + 2] = b * (1 - sepiaValue) + (r * 0.272 + g * 0.534 + b * 0.131) * sepiaValue;
  //   }
  //   context.putImageData(imageData, 0, 0);
  //   const newImage = new window.Image();
  //   newImage.src = canvas.toDataURL();
  //   return newImage;
  // };

//   return (
//     <div className="App">
//       <Stage width={window.innerWidth} height={window.innerHeight}>
//         <Layer>
//           {images.map((img, index) => (
//             <KonvaImage
//               key={index}
//               image={applySepiaFilter(img, sepiaValues[index])}
//               x={index * 1000}
//               y={50}
//               width={img.width}
//               height={img.height}
//             />
//           ))}
//         </Layer>
//       </Stage>
//     </div>
//   );
// }

// export default App;
//될거 같은거2->sepia grayscale 등등
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import imgSrc from "./images/temp.jpg";
import './App.css';

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const [image1, image2] = await Promise.all([
        loadImage(imgSrc),
        loadImage(imgSrc)
      ]);

      // 스타일 적용
      applyStyles(image1, { width: 800, filter: 'grayscale(0.5) sepia(0.1)' });
      applyStyles(image2, { width: 800, filter: 'sepia(1) opacity(0.5)' });

      setImages([image1, image2]);
    };

    loadImages();
  }, []);

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  const applyStyles = (img, styles) => {
    Object.assign(img, styles);
  };

  const applyFilters = (img, filters) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    filters.split(' ').forEach(filter => {
      const [name, value] = filter.replace(')', '').split('(');
      const floatValue = parseFloat(value);

      switch (name) {
        case 'grayscale':
          applyGrayscaleFilter(data, floatValue);
          break;
        case 'sepia':
          applySepiaFilter(data, floatValue);
          break;
        case 'opacity':
          applyOpacityFilter(data, floatValue);
          break;
        case 'saturate':
          applySaturateFilter(data, floatValue);
          break;
        default:
          break;
      }
    });

    context.putImageData(imageData, 0, 0);
    const newImage = new window.Image();
    newImage.src = canvas.toDataURL();
    return newImage;
  };

  const applyGrayscaleFilter = (data, value) => {
    for (let i = 0; i < data.length; i += 4) {
      const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i] * (1 - value) + avg * value;
      data[i + 1] = data[i + 1] * (1 - value) + avg * value;
      data[i + 2] = data[i + 2] * (1 - value) + avg * value;
    }
  };

  const applySepiaFilter = (data, value) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = r * (1 - value) + (r * 0.393 + g * 0.769 + b * 0.189) * value;
      data[i + 1] = g * (1 - value) + (r * 0.349 + g * 0.686 + b * 0.168) * value;
      data[i + 2] = b * (1 - value) + (r * 0.272 + g * 0.534 + b * 0.131) * value;
    }
  };

  const applyOpacityFilter = (data, value) => {
    for (let i = 3; i < data.length; i += 4) {
      data[i] = data[i] * value;
    }
  };

  const applySaturateFilter = (data, value) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = gray * (1 - value) + r * value;
      data[i + 1] = gray * (1 - value) + g * value;
      data[i + 2] = gray * (1 - value) + b * value;
    }
  };

  return (
    <div className="App">
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {images.map((img, index) => (
            <KonvaImage
              key={index}
              image={applyFilters(img, img.filter)}
              x={index * 1000}
              y={50}
              width={img.width}
              height={img.height}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
