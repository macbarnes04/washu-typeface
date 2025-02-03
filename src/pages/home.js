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
        WashU Archictectural Font
        <div className="button" onClick={() => navigate("/fullfont")}>
          Specimen
        </div>
      </div>
      <div id="text-main">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight * 0.4} // Set canvas height to 40% of the page height
        >
          <Layer>
            {images.map((image, index) => {
              const imageAspectRatio = image.height / image.width;
              const height = 310;
              const width = height / imageAspectRatio;

              // Dynamically adjust the x-position based on the image width and a fixed gap
              const gap = 20; // Space between the images
              const xPosition = 50 + (index * (width + gap)); // Include the gap in the position

              return (
                image && (
                  <KonvaImage
                    key={index}
                    image={image}
                    x={xPosition}
                    y={10} // Adjust y for centering vertically within the Stage
                    width={width} // Fixed width
                    height={height} // Auto height based on the aspect ratio
                  />
                )
              );
            })}
          </Layer>
        </Stage>
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
