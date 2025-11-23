import React, {useEffect, useState, useRef} from "react";
import { Stage, Layer, Image as KImage, Text, Rect, Group } from "react-konva";

export default function CanvasViewer() {
  const [canvas, setCanvas] = useState(null);
  const [images, setImages] = useState({});
  useEffect(() => {
    function handler(e) {
      setCanvas(e.detail);
    }
    window.addEventListener("load-canvas", handler);
    return () => window.removeEventListener("load-canvas", handler);
  }, []);

  useEffect(() => {
    if (!canvas) {
      // attempt to load default canvas from /canvas folder
      fetch("/canvas/creative_square_1080.json").then(r => r.json()).then(j => setCanvas(j)).catch(()=>{});
      return;
    }
    // Preload images
    const newImgs = {};
    for (const layer of canvas.layers) {
      if (layer.type === "image") {
        const url = layer.asset.url;
        const img = new window.Image();
        img.src = url;
        img.crossOrigin = "anonymous";
        img.onload = () => {
          newImgs[layer.id] = img;
          setImages(prev => Object.assign({}, prev, newImgs));
        };
      }
    }
  }, [canvas]);

  if (!canvas) return <div>Loading canvas...</div>;
  return (
    <div>
      <h2>Canvas preview: {canvas.id}</h2>
      <div style={{border: "1px solid #ccc", width: canvas.width, height: canvas.height}}>
        <Stage width={canvas.width} height={canvas.height}>
          <Layer>
            {canvas.layers.map(layer => {
              if (layer.type === "image") {
                const img = images[layer.id];
                return (
                  <KImage
                    key={layer.id}
                    image={img}
                    x={layer.transform.x}
                    y={layer.transform.y}
                    width={layer.transform.width}
                    height={layer.transform.height}
                    rotation={layer.transform.rotation || 0}
                  />
                );
              } else if (layer.type === "text") {
                return (
                  <Text
                    key={layer.id}
                    text={layer.text}
                    x={layer.transform.x}
                    y={layer.transform.y}
                    width={layer.transform.width}
                    fontSize={layer.style.fontSize}
                    fontFamily={layer.style.fontFamily || "Arial"}
                    fontStyle={layer.style.fontWeight >= 700 ? "bold" : "normal"}
                    fill={layer.fill || "#000"}
                  />
                );
              } else if (layer.type === "shape") {
                return (
                  <Group key={layer.id}>
                    <Rect
                      x={layer.props.x}
                      y={layer.props.y}
                      width={layer.props.width}
                      height={layer.props.height}
                      cornerRadius={layer.props.cornerRadius || 0}
                      fill={layer.style.fill}
                    />
                    <Text
                      text={layer.text.value}
                      x={layer.text.x}
                      y={layer.text.y}
                      fontSize={layer.text.fontSize}
                      fontFamily="Inter"
                      fill={layer.text.fill}
                      width={layer.props.width}
                      align="center"
                    />
                  </Group>
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
