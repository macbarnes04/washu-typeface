import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
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

const Home = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [redStates, setRedStates] = useState([]);
  const [positions, setPositions] = useState([]); // Separate positions state
  const imageRefs = useRef([]); // Store references to each Konva image

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
    // Randomize each image's position independently
    setPositions((prevPositions) =>
      prevPositions.map((_, index) => {
        const imageWidth = images[index].width; // Get the image width
        const imageHeight = 251; // Fixed height
  
        let newX, newY;
        let overlapDetected;
  
        do {
          overlapDetected = false;
  
          // Randomly generate a new position within bounds
          newX = Math.random() * (window.innerWidth - imageWidth);
          newY = Math.random() * (window.innerHeight * 0.6 - imageHeight);
  
          // Check for overlap with previously placed images
          for (let i = 0; i < index; i++) {
            const otherX = prevPositions[i].x;
            const otherY = prevPositions[i].y;
  
            const isOverlapping =
              newX < otherX + images[i].width &&
              newX + imageWidth > otherX &&
              newY < otherY + imageHeight &&
              newY + imageHeight > otherY;
  
            if (isOverlapping) {
              overlapDetected = true; // Mark overlap detected
              break; // Exit the loop to retry position
            }
          }
        } while (overlapDetected); // Keep generating until no overlap
  
        return { x: newX, y: newY };
      })
    );
  };
  

  return (
    <div className="App">
      <div className="header">
        WashU Architectural Font
        <div className="button" onClick={() => navigate("/fullfont")}>Specimen</div>
      </div>
      
      <div id="text-main">
        <Stage width={window.innerWidth} height={window.innerHeight * 0.6}>
          <Layer>
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
              placeholder="Type something..."
              onChange={handleTextChange}
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
