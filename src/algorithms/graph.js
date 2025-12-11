export class Graph {
  constructor() {
    this.adj = {};
  }

  addEdge(a, b, weight = 1) {
    if (!this.adj[a]) this.adj[a] = [];
    if (!this.adj[b]) this.adj[b] = [];
    this.adj[a].push({ node: b, weight });
    this.adj[b].push({ node: a, weight });
  }

  neighbors(node) {
    return this.adj[node] || [];
  }
}
