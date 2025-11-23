import React, {useState, useEffect} from "react";
import axios from "axios";
import CanvasViewer from "./src/components/CanvasViewer";

export default function App() {
  const [candidates, setCandidates] = useState([]);
  useEffect(() => {
    // fetch suggested layouts
    axios.post("/api/layouts/suggest").then(res => {
      setCandidates(res.data.candidates || []);
    }).catch(err => {
      console.error("Can't fetch candidates from backend:", err);
      // Try to load from /canvas (frontend static relative)
      fetch("/canvas/creative_square_1080.json").then(r => r.json()).then(j => setCandidates([j]));
    });
  }, []);

  return (
    <div style={{padding: 20, fontFamily: "Inter, Arial"}}>
      <h1>Retail Creative Builder - Prototype</h1>
      <p>Three suggested canvases are loaded from the backend. Click a tile to view editable preview.</p>
      <div style={{display: "flex", gap: 12}}>
        {candidates.map(c => (
          <div key={c.id} style={{border: "1px solid #ddd", padding: 8, width: 240}}>
            <h3>{c.id}</h3>
            <button onClick={() => window.dispatchEvent(new CustomEvent("load-canvas", {detail: c}))}>Load</button>
          </div>
        ))}
      </div>
      <hr />
      <CanvasViewer />
    </div>
  );
}
