// algorithms/mapBfs.js
export function bfs(start, end, graph) {
  const queue = [start];
  const cameFrom = {};
  const visited = new Set();
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();

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

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        cameFrom[neighbor] = node;
      }
    }
  }

  return [];
}
