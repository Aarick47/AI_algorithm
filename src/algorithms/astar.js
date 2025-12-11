export function astar(start, end, grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[1,0],[-1,0],[0,1],[0,-1]];

  function heuristic(a, b) {
    return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
  }

  const startKey = `${start[0]}-${start[1]}`;
  const endKey = `${end[0]}-${end[1]}`;

  let openSet = [{ pos: start, g: 0, f: heuristic(start,end) }];
  let cameFrom = {};
  let visited = new Set();

  while(openSet.length > 0){
    openSet.sort((a,b)=>a.f - b.f);
    const current = openSet.shift();
    const [r,c] = current.pos;
    const currentKey = `${r}-${c}`;

    if(currentKey === endKey){
      let path = [];
      let key = currentKey;
      while(key !== startKey){
        const [pr,pc] = key.split("-").map(Number);
        path.push([pr,pc]);
        key = `${cameFrom[key][0]}-${cameFrom[key][1]}`;
      }
      path.push(start);
      return path.reverse();
    }

    visited.add(currentKey);

    for(let [dr,dc] of directions){
      const nr = r+dr;
      const nc = c+dc;
      const neighborKey = `${nr}-${nc}`;

      if(nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]!==1 && !visited.has(neighborKey)){
        const gScore = current.g + 1;
        const fScore = gScore + heuristic([nr,nc],end);

        if(!openSet.some(n=>n.pos[0]===nr && n.pos[1]===nc && n.g <= gScore)){
          openSet.push({ pos: [nr,nc], g: gScore, f: fScore });
          cameFrom[neighborKey] = [r,c];
        }
      }
    }
  }

  return [];
}
