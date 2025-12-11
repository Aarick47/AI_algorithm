// algorithms/mapAstar.js
export function astar(start, end, graph, heuristic) {
  const openSet = [{ node: start, g: 0, f: heuristic(start, end) }];
  const cameFrom = {};
  const visited = new Set();

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const node = current.node;

    if (node === end) {
      let path = [];
      let key = end;
      while (key !== start) {
        path.push(key);
        key = cameFrom[key];
      }
      path.push(start);
      return path.reverse();
    }

    visited.add(node);

    for (const neighbor of graph[node]) {
      if (visited.has(neighbor)) continue;
      const gScore = current.g + 1;
      const fScore = gScore + heuristic(neighbor, end);

      if (!openSet.some(n => n.node === neighbor && n.g <= gScore)) {
        openSet.push({ node: neighbor, g: gScore, f: fScore });
        cameFrom[neighbor] = node;
      }
    }
  }

  return [];
}
