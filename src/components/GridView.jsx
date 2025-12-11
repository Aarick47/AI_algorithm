import React from "react";

export default function GridView({ grid, start, end, path, onCellClick, isAnimating, visited }) {
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div className="relative">
      <div
        className="relative inline-block"
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${rows}, 48px)`,
          gridTemplateColumns: `repeat(${cols}, 48px)`,
          gap: "3px",
          padding: "24px",
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
          borderRadius: "24px",
          border: "2px solid rgba(148, 163, 184, 0.2)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.05)",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isWall = cell === 1;
            const isStart = start && start[0] === r && start[1] === c;
            const isEnd = end && end[0] === r && end[1] === c;
            const pathIndex = path.findIndex(p => p[0] === r && p[1] === c);
            const isPath = pathIndex !== -1;
            const isVisited = visited?.has(`${r},${c}`);

            let cellStyle = {
              background: "linear-gradient(135deg, rgba(51, 65, 85, 0.4), rgba(71, 85, 105, 0.3))",
              border: "1px solid rgba(100, 116, 139, 0.3)",
            };

            if (isWall) {
              cellStyle = {
                background: "linear-gradient(135deg, #203b1eff, #55334cff)",
                border: "1px solid rgba(71, 85, 105, 0.6)",
                boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.6)",
              };
            } else if (isStart) {
              cellStyle = {
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                border: "2px solid #38bdf8",
                boxShadow: "0 0 30px rgba(14, 165, 233, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
              };
            } else if (isEnd) {
              cellStyle = {
                background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                border: "2px solid #fb7185",
                boxShadow: "0 0 30px rgba(244, 63, 94, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
              };
            } else if (isPath) {
              const intensity = 0.4 + (pathIndex / path.length) * 0.6;
              cellStyle = {
                background: `linear-gradient(135deg, rgba(16, 185, 129, ${intensity}), rgba(5, 150, 105, ${intensity}))`,
                border: "2px solid #34d399",
                boxShadow: `0 0 20px rgba(16, 185, 129, ${intensity * 0.8})`,
              };
            } else if (isVisited) {
              cellStyle = {
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(129, 140, 248, 0.3)",
              };
            }

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => !isAnimating && onCellClick(r, c)}
                className="flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-95 hover:brightness-110"
                style={{
                  ...cellStyle,
                  borderRadius: "8px",
                  animation: isPath ? `pathPulse 0.5s ease-out ${pathIndex * 0.04}s both` : "none",
                }}
              >
                {isStart && (
                  <div className="w-5 h-5 bg-white rounded-full shadow-lg" 
                       style={{ boxShadow: "0 0 15px rgba(255, 255, 255, 0.8)" }} />
                )}
                {isEnd && (
                  <div className="w-5 h-5 bg-white rotate-45" 
                       style={{ borderRadius: "2px", boxShadow: "0 0 15px rgba(255, 255, 255, 0.8)" }} />
                )}
              </div>
            );
          })
        )}
        <style>{`
          @keyframes pathPulse {
            0% {
              opacity: 0;
              transform: scale(0.7);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}