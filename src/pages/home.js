import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Circle } from "react-konva";
import { Shape } from "react-konva";
import Konva from "konva";  // Import Konva for filters

// Function to load a single image
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous"; // Fix CORS issues if needed
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

// const Midpoint = ({ positions }) => {
//   if (!positions || Object.keys(positions).length === 0) return null;

//   return (
//     <>
//       {Object.entries(positions).map(([letter, letterPositions]) => {
//         if (!letterPositions.length) return null;

//         // Compute midpoint for this letter
//         let sumX = 0,
//           sumY = 0;
//         letterPositions.forEach(({ x, y }) => {
//           sumX += x;
//           sumY += y;
//         });

//         const midX = sumX / letterPositions.length;
//         const midY = sumY / letterPositions.length;

//         return (
//           <Circle
//             key={letter}
//             x={midX}
//             y={midY}
//             radius={5}
//             fill="red"
//           />
//         );
//       })}
//     </>
//   );
// };
const getMidpoint = (image, position) => {
  const midpointX = position.x + (image.width / 2);
  const midpointY = position.y + (image.height / 2);
  return { x: midpointX, y: midpointY };
};



const Home = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [redStates, setRedStates] = useState([]);
  const [positions, setPositions] = useState([]); // Separate positions state
  const [greenShapes, setGreenShapes] = useState([]); // Store green rectangles and circles
  const imageRefs = useRef([]); // Store references to each Konva image
  const layerRef = useRef(null); // Store layer reference for batch drawing
  const [pathVisible, setPathVisible] = useState(false); // Path visibility flag

  const descriptions = [
    "Location for A",
    "Location for B",
    "Location for C",
    "Location for D",
    "Location for E",
    "Location for F",
    "Location for G",
    "Location for H",
    "Location for I",
    "Location for J",
    "Location for K",
    "Location for L",
    "Location for M",
    "Location for N",
    "Location for O",
    "Location for P",
    "Location for Q",
    "Location for R",
    "Location for S",
    "Location for T",
    "Location for U",
    "Location for V",
    "Location for W",
    "Location for X",
    "Location for Y",
    "Location for Z"
  ];
  

  const handleKeyPress = (event) => {
    const key = event.key; // Get the key being pressed

    // Check if the key is a letter (a-z or A-Z)
    if (!/^[a-zA-Z]$/.test(key)) {
      event.preventDefault(); // Prevent non-alphabet characters from being typed
    }
  };

  const handleImageClick = (index) => {
    setRedStates((prevRedStates) => {
      const newRedStates = [...prevRedStates];
      newRedStates[index] = !newRedStates[index]; // Toggle red state for clicked image
      return newRedStates;
    });
  };

  // Load images based on typed text
  useEffect(() => {
    const letterImages = text.split("").map((letter) => {
      const imageSrc = `/letters/${letter.toUpperCase()}.png`; // Corrected path to images
      return imageSrc;
    });

    const loadImages = async () => {
      try {
        const loadedImages = await Promise.all(
          letterImages.map((src) => loadImage(src))
        );
        setImages(loadedImages); // Update the state once all images are loaded
        setRedStates(new Array(loadedImages.length).fill(false)); // Initialize red states

        // Initialize positions after images are loaded
        const initialPositions = calculateCenteredPositions(loadedImages.length, loadedImages);
        setPositions(initialPositions);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    if (letterImages.length > 0) {
      loadImages();
    } else {
      setImages([]); // If text is empty, clear images
      setRedStates([]); // Clear red states as well
      setPositions([]); // Clear positions
    }
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const calculateCenteredPositions = (numImages, loadedImages) => {
    if (numImages === 0) return []; // Return empty array if no images

    const totalWidth = loadedImages.reduce((acc, image) => acc + image.width, 0);
    const startX = (window.innerWidth / 2) - (totalWidth / 2); // Centering on the canvas

    let currentX = startX;
    const positions = [];

    loadedImages.forEach((image) => {
      const position = { x: currentX, y: window.innerHeight * 0.3 }; // Fixed Y position
      currentX += image.width; // Move position for next image based on width
      positions.push(position);
    });

    return positions;
  };

  const handleEnterClick = () => {
    const boxWidth = 300;  // Fixed width of each letter block
    const boxHeight = 301; // Fixed height of each letter block (251 height + 50 padding)

    const gridCols = Math.floor(window.innerWidth / boxWidth);
    const gridRows = Math.floor(window.innerHeight / boxHeight);
    setPathVisible(true);

    if (gridCols <= 0 || gridRows <= 0) return; // Safety check

    // Calculate available positions for the grid
    let availablePositions = [];
    for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        availablePositions.push({ x, y });
      }
    }

    // Shuffle grid positions for random placement
    availablePositions = availablePositions.sort(() => Math.random() - 0.5);

    // Calculate the offset to center the grid horizontally
    const offsetX = (window.innerWidth - gridCols * boxWidth) / 2;

    // Calculate the remaining vertical space and move it to the bottom
    const totalGridHeight = gridRows * boxHeight;
    const remainingVerticalSpace = window.innerHeight - totalGridHeight;

    // Distribute any extra vertical margin at the bottom
    const offsetY = remainingVerticalSpace > 0 ? remainingVerticalSpace : 0;

    // Save positions of buildings in state
    setPositions((prevPositions) =>
      prevPositions.map((_, index) => {
        if (index >= availablePositions.length) return { x: 0, y: 0 }; // Fallback

        const { x: gridX, y: gridY } = availablePositions[index];

        // Add more variability in positions for the first few letters and beyond
        const randomX = Math.random() * 60 - 30; // Random X variation (-30 to 30)
        const randomY = Math.random() * 40 - 20; // Random Y variation (-20 to 20)

        // Adjust the Y positioning further for the bottom-most rows
        const adjustedY = gridY * boxHeight + randomY;

        return {
          x: gridX * boxWidth + offsetX + randomX,
          y: adjustedY,
        };
      })
    );

    // Generate random green rectangles and circles
    const greenShapes = generateGreenShapes();
    setGreenShapes(greenShapes);

    // Now that positions have been updated, call the drawPaths function
    if (layerRef.current) {
      layerRef.current.batchDraw();
    }
  };

  const generateGreenShapes = () => {
    const shapes = [];
    const numRectangles = 7; // Number of random rectangles
    const numClusters = 10; // Number of clusters of circles

    const existingShapes = []; // Track existing shapes' bounding boxes

    // Helper function to check if a new shape overlaps with existing shapes
    const isOverlapping = (newShape) => {
      return existingShapes.some(shape => {
        return (
          newShape.x < shape.x + shape.width &&
          newShape.x + newShape.width > shape.x &&
          newShape.y < shape.y + shape.height &&
          newShape.y + newShape.height > shape.y
        );
      });
    };

    // Generate rectangles (larger size)
    for (let i = 0; i < numRectangles; i++) {
      const width = Math.random() * 100 + 300;  // Random width (between 300 and 900)
      const height = Math.random() * 300 + 100;  // Random height (between 150 and 450)
      let x, y;

      // Ensure the rectangle doesn't overlap with existing shapes
      let attempts = 0;
      do {
        x = Math.random() * (window.innerWidth - width);  // Random X position
        y = Math.random() * (window.innerHeight - height); // Random Y position
        attempts++;
        if (attempts > 100) break; // Avoid infinite loop
      } while (isOverlapping({ x, y, width, height }));

      shapes.push(
        <Rect
          key={`rect-${i}`}
          x={x}
          y={y}
          width={width}
          height={height}
          fill="green"
          cornerRadius={15}
          opacity={0.5}
          zIndex={-100} // Ensures rectangles are behind other elements
        />
      );

      // Add the rectangle's bounding box to the list of existing shapes
      existingShapes.push({ x, y, width, height });
    }

    // Generate clusters of circles (smaller size)
    for (let i = 0; i < numClusters; i++) {
      let clusterX = Math.random() * window.innerWidth;  // Random cluster X position
      let clusterY = Math.random() * window.innerHeight; // Random cluster Y position

      // Add a few circles to each cluster
      for (let j = 0; j < 1 + Math.floor(Math.random() * 2); j++) { // 3 to 4 circles per cluster
        const radius = Math.random() * 15 + 20;  // Random radius (between 20 and 35)
        let x = clusterX + Math.random() * 50 - 25; // Random offset in X
        let y = clusterY + Math.random() * 50 - 25; // Random offset in Y

        // Ensure no overlap with existing circles or rectangles
        let attempts = 0;
        do {
          x = clusterX + Math.random() * 50 - 25;
          y = clusterY + Math.random() * 50 - 25;
          attempts++;
          if (attempts > 100) break; // Avoid infinite loop
        } while (isOverlapping({ x, y, width: radius * 2, height: radius * 2 }));

        shapes.push(
          <Circle
            key={`circle-${i}-${j}`}
            x={x}
            y={y}
            radius={radius}
            fill="darkgreen"
            opacity={.8}
            zIndex={-1} // Ensures circles are behind other elements
          />
        );

        // Add the circle's bounding box to the existing shapes
        existingShapes.push({
          x: x - radius,
          y: y - radius,
          width: radius * 2,
          height: radius * 2
        });
      }
    }

    return shapes;
  };

  const drawPath = () => {
    if (!layerRef.current) return;

    const points = [];
    images.forEach((image, index) => {
      const { x, y } = positions[index] || { x: 0, y: 0 };
      const midpoint = getMidpoint(image, { x, y });
      console.log(midpoint); // Check the values of the midpoints
      points.push(midpoint.x, midpoint.y);
    });

    const path = new Konva.Line({
      points: points,
      stroke: '#E5D3B3',
      strokeWidth: 0,
      lineJoin: 'round',
      lineCap: 'round',
    });

    if (pathVisible) {
      path.to({
        strokeWidth: 20,
        duration: 1,
        onFinish: () => {
          layerRef.current.batchDraw(); // Redraw the layer after animation
        },
      });
    }

    return path;
  };

  useEffect(() => {
    const path = drawPath(); // Create the path
    if (path) {
      layerRef.current.add(path); // Add the path to the layer
      layerRef.current.batchDraw(); // Redraw the layer after adding the path
    }

    // Cleanup function to remove the path when component is unmounted or dependencies change
    return () => {
      if (path) {
        path.destroy(); // Destroy the path to prevent memory leaks
      }
    };
  }, [images, positions, pathVisible]);

  return (
    <div className="App">
      <div className="header">
        WashU Architectural Font
        <div className="button" onClick={() => navigate("/fullfont")}>Specimen</div>
      </div>

      <div id="text-main">
        <Stage width={window.innerWidth - 100} height={window.innerHeight * 0.7}>
          <Layer ref={layerRef}>
            {greenShapes}
            {/* Render images */}
            {images.map((image, index) => {
              const imageAspectRatio = image.width / image.height;
              const height = 251; // Fixed height
              const width = height * imageAspectRatio; // Maintain aspect ratio
              const { x, y } = positions[index] || { x: 0, y: 0 }; // Get the position for the current image
              const isRed = redStates[index]; // Get the red state for the current image

              return (
                <KonvaImage
                  key={index}
                  image={image}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  ref={(node) => {
                    if (node) {
                      if (isRed) {
                        node.cache();
                        node.filters([Konva.Filters.RGBA]);
                        node.red(186);
                        node.green(12);
                        node.blue(47);
                        node.getLayer()?.batchDraw();
                      } else {
                        node.cache();
                        node.filters([Konva.Filters.RGBA]); // Reset filter
                        node.red(0);
                        node.green(0);
                        node.blue(0);
                        node.getLayer()?.batchDraw();
                      }
                    }
                  }}
                  onClick={() => handleImageClick(index)} // Add click handler for toggling red
                />
                
              );
            })}
          </Layer>
        </Stage>

        <div id="inputs">
          <div className="text-box-container">
            <input
              type="text"
              id="input"
              placeholder="One word to describe WashU's Campus..."
              onChange={handleTextChange}
              onKeyPress={handleKeyPress} // Add this to prevent non-alphabet characters
              value={text}
            />
          </div>
          <div className="enter" onClick={handleEnterClick}>Enter</div>
        </div>
      </div>

      <div className="footer">
        Designed by Mac Barnes <br />
        Advanced Interaction Design <br />
        Spring 2025
      </div>
    </div>
  );
};

export default Home;  