// nodes is an array of Ids?
// edges is an array of??

// add node

interface Edge {
  node: string;
  incoming: {};
  incomingNodes: string[];
  hasOutgoing: boolean;
  value: null;
}

interface Args {
  nodes: string[];
  edges: Record<string, Edge>;
}

class DAG {
  nodes: string[];
  edges: Record<string, Edge>;

  constructor(args: Args) {
    const { nodes, edges } = args;

    this.nodes = nodes;
    this.edges = edges;
  }

  addNode(node: string) {
    if (!node) return;

    if (this.edges[node]) {
      return this.edges[node];
    }

    const edge: Edge = {
      node,
      incoming: {},
      incomingNodes: [],
      hasOutgoing: false,
      value: null,
    };

    this.edges[node] = edge;
    this.nodes.push(node);
    return edge;
  }
}

export default DAG;

/**
 * Example
 */
