import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";

// Function to load a single image
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

const Home = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);

  // Load the images based on the typed text
  useEffect(() => {
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

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Calculate the total width of all images for centering
  const totalWidth = images.length * 60; // 60px is the horizontal space between images

  return (
    <div className="App">
      <div className="header">
        WashU Architectural Font
        <div className="button" onClick={() => navigate("/fullfont")}>
          Specimen
        </div>
      </div>
      <div id="text-main">
        <Stage width={window.innerWidth} height={window.innerHeight * 0.4}>
          <Layer>
            {(() => {
              // 1. Compute total width of all images including spacing
              const totalWidth = images.reduce((sum, image) => {
                const imageAspectRatio = image.width / image.height;
                const width = 151 * imageAspectRatio; // Maintain aspect ratio
                return sum + width + 30; // Add width of image + spacing
              }, -60); // Start at -60 to ignore the last extra gap

              const startX = (window.innerWidth / 2) - (totalWidth / 2); // Centering Fix

              let currentX = startX; // Track x-position dynamically

              return images.map((image, index) => {
                const imageAspectRatio = image.width / image.height;
                const height = 151; // Fixed height
                const width = height * imageAspectRatio; // Maintain aspect ratio

                const xPosition = currentX; // Store the current position
                currentX += width + 30; // Move position for next image

                return (
                  <KonvaImage
                    key={index}
                    image={image}
                    x={xPosition}
                    y={10} // Adjust as needed
                    width={width}
                    height={height}
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
              name="input"
              placeholder="Type something..."
              onChange={handleTextChange}
              value={text}
            />
          </div>
          <div className="enter">
          Enter
        </div>
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
