import { useState } from "react";

export default function RouteForm({ onRun }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [algorithm, setAlgorithm] = useState("astar");
  const [view, setView] = useState("map");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRun({ start, end, algorithm, view });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 10 }}>
      <h3>Route Planner</h3>

      <label>Start Node:</label>
      <input value={start} onChange={(e) => setStart(e.target.value)} />

      <label>End Node:</label>
      <input value={end} onChange={(e) => setEnd(e.target.value)} />

      <label>Search Algorithm:</label>
      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
        <option value="astar">A*</option>
        <option value="bfs">BFS</option>
      </select>

      <label>View Mode:</label>
      <select value={view} onChange={(e) => setView(e.target.value)}>
        <option value="map">Map View</option>
        <option value="grid">Grid Maze View</option>
      </select>

      <button type="submit">Find Route</button>
    </form>
  );
}
