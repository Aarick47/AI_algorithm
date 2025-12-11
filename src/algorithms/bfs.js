export function bfs(start,end,grid){
  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[1,0],[-1,0],[0,1],[0,-1]];

  const queue = [start];
  const visited = new Set();
  const cameFrom = {};
  const startKey = `${start[0]}-${start[1]}`;
  const endKey = `${end[0]}-${end[1]}`;
  visited.add(startKey);

  while(queue.length>0){
    const [r,c] = queue.shift();
    const currentKey = `${r}-${c}`;

    if(currentKey===endKey){
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

    for(let [dr,dc] of directions){
      const nr = r+dr;
      const nc = c+dc;
      const neighborKey = `${nr}-${nc}`;

      if(nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]!==1 && !visited.has(neighborKey)){
        queue.push([nr,nc]);
        visited.add(neighborKey);
        cameFrom[neighborKey] = [r,c];
      }
    }
  }

  return [];
}
