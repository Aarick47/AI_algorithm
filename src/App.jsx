import React, { useState } from "react";
import GridView from "./components/GridView";
import { Play, RotateCcw, Zap, Eye, Settings } from "lucide-react";
import "./App.css";

// A* Algorithm
function astar(start, end, grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const openSet = [[...start, 0, heuristic(start, end)]];
  const cameFrom = {};
  const gScore = {};
  const key = (r, c) => `${r},${c}`;
  
  gScore[key(...start)] = 0;
  
  while (openSet.length > 0) {
    openSet.sort((a, b) => a[3] - b[3]);
    const [r, c, g] = openSet.shift();
    
    if (r === end[0] && c === end[1]) {
      return reconstructPath(cameFrom, end);
    }
    
    const neighbors = [
      [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
    ];
    
    for (const [nr, nc] of neighbors) {
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] === 1) continue;
      
      const tentativeG = g + 1;
      const nKey = key(nr, nc);
      
      if (!(nKey in gScore) || tentativeG < gScore[nKey]) {
        cameFrom[nKey] = [r, c];
        gScore[nKey] = tentativeG;
        const f = tentativeG + heuristic([nr, nc], end);
        openSet.push([nr, nc, tentativeG, f]);
      }
    }
  }
  
  return [];
}

function heuristic(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function reconstructPath(cameFrom, current) {
  const path = [[...current]];
  const key = (r, c) => `${r},${c}`;
  let currentKey = key(...current);
  
  while (currentKey in cameFrom) {
    current = cameFrom[currentKey];
    path.unshift([...current]);
    currentKey = key(...current);
  }
  
  return path;
}

// BFS Algorithm
function bfs(start, end, grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [[...start]];
  const visited = new Set([`${start[0]},${start[1]}`]);
  const cameFrom = {};
  
  while (queue.length > 0) {
    const [r, c] = queue.shift();
    
    if (r === end[0] && c === end[1]) {
      return reconstructPath(cameFrom, end);
    }
    
    const neighbors = [
      [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
    ];
    
    for (const [nr, nc] of neighbors) {
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
          grid[nr][nc] !== 1 && !visited.has(key)) {
        visited.add(key);
        cameFrom[key] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }
  
  return [];
}

export default function App() {
  const defaultGrid = [
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,0,1,0,0,1,0,0],
    [0,1,0,0,1,0,1,0,0,0],
    [0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,1,1,0,0,0],
    [0,0,0,1,0,0,0,1,0,0],
    [0,1,0,0,0,1,0,0,0,0],
    [0,0,0,1,0,0,1,0,1,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ];

  const [grid, setGrid] = useState(defaultGrid);
  const [start, setStart] = useState([0,0]);
  const [end, setEnd] = useState([9,9]);
  const [path, setPath] = useState([]);
  const [algorithm, setAlgorithm] = useState("astar");
  const [isAnimating, setIsAnimating] = useState(false);
  const [visited, setVisited] = useState(new Set());
  const [stats, setStats] = useState({ pathLength: 0, nodesExplored: 0, time: 0 });

  function onCellClick(r, c) {
    if (grid[r][c] === 1) return;
    if (!start || (start && end)) {
      setStart([r, c]);
      setEnd(null);
      setPath([]);
      setVisited(new Set());
    } else if (!end) {
      setEnd([r, c]);
      setPath([]);
      setVisited(new Set());
    }
  }

  function runAlgorithm() {
    if (!start || !end) {
      return;
    }

    setIsAnimating(true);
    setPath([]);
    setVisited(new Set());
    
    setTimeout(() => {
      const startTime = performance.now();
      const result = algorithm === "astar" ? astar(start, end, grid) : bfs(start, end, grid);
      const endTime = performance.now();
      
      setPath(result);
      setStats({
        pathLength: result.length,
        nodesExplored: result.length,
        time: (endTime - startTime).toFixed(2)
      });
      setIsAnimating(false);
    }, 150);
  }

  function resetGrid() {
    setGrid(defaultGrid);
    setStart([0, 0]);
    setEnd([9, 9]);
    setPath([]);
    setVisited(new Set());
    setIsAnimating(false);
    setStats({ pathLength: 0, nodesExplored: 0, time: 0 });
  }

  const algorithmInfo = {
    astar: {
      name: "A* Algorithm",
      description: "Optimal pathfinding with heuristic guidance",
      complexity: "O(b^d)",
      guarantee: "Shortest path"
    },
    bfs: {
      name: "Breadth-First Search",
      description: "Explores nodes level by level",
      complexity: "O(V + E)",
      guarantee: "Shortest path"
    }
  };

  return (
    <div className="app-container">
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
      </div>

      <div className="content-wrapper">
        <div className="header">
          <div className="badge">
            <Zap size={16} />
            <span>Algorithm Visualization</span>
          </div>
          <h1 className="title">
            <span className="title-gradient">Pathfinding</span>
          </h1>
          <p className="subtitle">
            Visualize intelligent navigation algorithms finding optimal paths through complex mazes
          </p>
        </div>

        <div className="main-grid">
          <div className="sidebar">
            <div className="card">
              <div className="card-header">
                <Settings size={20} />
                <h3>Algorithm Settings</h3>
              </div>
              
              <div className="card-body">
                <div className="form-group">
                  <label>Select Algorithm</label>
                  <div className="algorithm-buttons">
                    {Object.entries(algorithmInfo).map(([key, info]) => (
                      <button
                        key={key}
                        onClick={() => setAlgorithm(key)}
                        disabled={isAnimating}
                        className={`algorithm-btn ${algorithm === key ? 'active' : ''}`}
                      >
                        <div className="algorithm-name">{info.name}</div>
                        <div className="algorithm-desc">{info.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={runAlgorithm}
                    disabled={isAnimating || !start || !end}
                    className="btn btn-primary"
                  >
                    <Play size={20} />
                    <span>{isAnimating ? "Running..." : "Visualize Path"}</span>
                  </button>
                  
                  <button
                    onClick={resetGrid}
                    disabled={isAnimating}
                    className="btn btn-secondary"
                  >
                    <RotateCcw size={20} />
                    <span>Reset Grid</span>
                  </button>
                </div>
              </div>
            </div>

            {stats.pathLength > 0 && (
              <div className="card">
                <div className="card-header">
                  <Eye size={20} />
                  <h3>Results</h3>
                </div>
                
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Path Length</span>
                    <span className="stat-value stat-value-primary">{stats.pathLength}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Execution Time</span>
                    <span className="stat-value stat-value-secondary">{stats.time}ms</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Status</span>
                    <span className="stat-value stat-value-success">✓ Path Found</span>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <h3>Legend</h3>
              </div>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-box legend-start"></div>
                  <span>Start Point</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box legend-end"></div>
                  <span>End Point</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box legend-wall"></div>
                  <span>Wall (Obstacle)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box legend-path"></div>
                  <span>Optimal Path</span>
                </div>
              </div>
              <div className="legend-note">
                Click empty cells to set start and end points. The algorithm will find the shortest path avoiding walls.
              </div>
            </div>
          </div>

          <div className="grid-container">
            <GridView
              grid={grid}
              start={start}
              end={end}
              path={path}
              onCellClick={onCellClick}
              isAnimating={isAnimating}
              visited={visited}
            />
          </div>
        </div>
      </div>
    </div>
  );
}