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
  const [isRed, setIsRed] = useState(false);
  const [redStates, setRedStates] = useState([]);
  const imageRefs = useRef([]); // Store references to each Konva image

  const handleEnterClick = () => {
    // Enter Click animations
  };

  const handleImageClick = (index) => {
    setRedStates((prevRedStates) => {
      const newRedStates = [...prevRedStates];
      newRedStates[index] = !newRedStates[index]; // Toggle red state for clicked image
      return newRedStates;
    });
  };
  

  useEffect(() => {
    // Clear images if text is empty
    if (text === "") {
      setImages([]);
      return; // Don't try to load images if there's no text
    }
  
    const letterImages = text.split("").map((letter) => {
      const imageSrc = `/letters/${letter.toUpperCase()}.png`; // Corrected path to images
      return imageSrc;
    });
  
    // Load the images asynchronously
    const loadImages = async () => {
      try {
        const loadedImages = await Promise.all(
          letterImages.map((src) => loadImage(src))
        );
        setImages(loadedImages); // Update the state once all images are loaded
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
  
    if (letterImages.length > 0) {
      loadImages();
    }
  }, [text]); // Re-run when text changes
  

  const handleTextChange = (e) => setText(e.target.value);

  return (
    <div className="App">
      <div className="header">
        WashU Architectural Font
        <div className="button" onClick={() => navigate("/fullfont")}>Specimen</div>
      </div>
      
      <div id="text-main">
        <Stage width={window.innerWidth} height={window.innerHeight * 0.4}>
          <Layer>
            {(() => {
              // Calculate total width for centering
              const totalWidth = images.reduce((sum, image) => {
                const width = 251 * (image.width / image.height);
                return sum + width + 30;
              }, -30);

              const startX = (window.innerWidth / 2) - (totalWidth / 2);
              let currentX = startX;

              return images.map((image, index) => {
                const imageAspectRatio = image.width / image.height;
                const height = 251; // Fixed height
                const width = height * imageAspectRatio; // Maintain aspect ratio

                const xPosition = currentX; // Store the current position
                currentX += width + 30; // Move position for next image

                const isRed = redStates[index]; // Get the red state for the current image

                return (
                  <KonvaImage
                    key={index}
                    image={image}
                    x={xPosition}
                    y={10}
                    width={width}
                    height={height}
                    ref={(node) => {
                      if (node) {
                        if (isRed) {
                          node.cache();
                          node.filters([Konva.Filters.RGBA]); // Corrected import
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
              });
            })()}
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
