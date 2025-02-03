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
  const imageRefs = useRef([]); // Store references to each Konva image

  const handleEnterClick = () => {
    setIsRed((prevIsRed) => {
      const newIsRed = !prevIsRed; // Correctly toggle the state
  
      imageRefs.current.forEach((imageNode) => {
        if (imageNode) {
          imageNode.cache();
          imageNode.filters([Konva.Filters.RGBA]); // Apply the filter
  
          if (newIsRed) {
            imageNode.red(186);
            imageNode.green(12);
            imageNode.blue(47);
          } else {
            imageNode.red(0);
            imageNode.green(0);
            imageNode.blue(0);
          }
  
          imageNode.getLayer()?.batchDraw();
        }
      });
  
      return newIsRed; // Update the state
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
                const width = 251 * (image.width / image.height);
                const xPosition = currentX;
                currentX += width + 30;

                return (
                  <KonvaImage
                    key={index}
                    ref={(el) => (imageRefs.current[index] = el)}
                    image={image}
                    x={xPosition}
                    y={10}
                    width={width}
                    height={251}
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
