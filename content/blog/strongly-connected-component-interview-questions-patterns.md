---
title: "Strongly Connected Component Interview Questions: Patterns and Strategies"
description: "Master Strongly Connected Component problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-07-11"
category: "dsa-patterns"
tags: ["strongly-connected-component", "dsa", "interview prep"]
---

# Strongly Connected Component Interview Questions: Patterns and Strategies

You're solving a graph problem in an interview. You've identified it's about connectivity, so you reach for your trusty Union-Find or DFS. You start coding confidently, only to have the interviewer ask: "What about directed edges?" That's when candidates realize they've been solving the wrong problem. This exact scenario happens with problems like **Critical Connections in a Network (LeetCode #1192)**, where many candidates initially miss that the graph is directed, making their undirected connectivity solutions fail spectacularly.

Strongly Connected Components (SCC) questions are rare but dangerous—they appear in only about 0.5% of interview questions, but when they do, they're almost always **Hard** problems that separate senior candidates from the rest. The data shows 100% of SCC problems are rated Hard, with companies like Amazon, Google, and Bloomberg using them to test deep graph theory knowledge.

## Common Patterns

### Pattern 1: Kosaraju's Algorithm — The Two-Pass DFS

Kosaraju's algorithm is the most intuitive SCC algorithm for interviews. It works in two passes: first DFS to get finishing times, second DFS on the transposed graph to find components. The key insight is that in a directed graph, the finishing order matters—components that finish together often belong together.

**Problems using this pattern:**

- **Course Schedule II (LeetCode #210)** — when you need to find if courses can be ordered with prerequisites
- **Find Eventual Safe States (LeetCode #802)** — identifying nodes that eventually reach a terminal state
- **Critical Connections in a Network (LeetCode #1192)** — finding bridges in directed networks

<div class="code-group">

```python
# Time: O(V + E) | Space: O(V)
def kosaraju_scc(n, edges):
    """
    Find all strongly connected components in a directed graph.
    Returns list of components where each component is a list of nodes.
    """
    # Build adjacency lists
    graph = [[] for _ in range(n)]
    reverse_graph = [[] for _ in range(n)]

    for u, v in edges:
        graph[u].append(v)
        reverse_graph[v].append(u)

    # First pass: DFS to get finishing order
    visited = [False] * n
    stack = []

    def dfs_first(u):
        visited[u] = True
        for v in graph[u]:
            if not visited[v]:
                dfs_first(v)
        stack.append(u)  # Add to stack after visiting all neighbors

    for i in range(n):
        if not visited[i]:
            dfs_first(i)

    # Second pass: DFS on reversed graph
    visited = [False] * n
    components = []

    def dfs_second(u, component):
        visited[u] = True
        component.append(u)
        for v in reverse_graph[u]:
            if not visited[v]:
                dfs_second(v, component)

    while stack:
        node = stack.pop()
        if not visited[node]:
            component = []
            dfs_second(node, component)
            components.append(component)

    return components
```

```javascript
// Time: O(V + E) | Space: O(V)
function kosarajuSCC(n, edges) {
  // Build adjacency lists
  const graph = Array.from({ length: n }, () => []);
  const reverseGraph = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {
    graph[u].push(v);
    reverseGraph[v].push(u);
  }

  // First pass: DFS to get finishing order
  const visited = Array(n).fill(false);
  const stack = [];

  function dfsFirst(u) {
    visited[u] = true;
    for (const v of graph[u]) {
      if (!visited[v]) {
        dfsFirst(v);
      }
    }
    stack.push(u); // Add to stack after visiting all neighbors
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfsFirst(i);
    }
  }

  // Second pass: DFS on reversed graph
  visited.fill(false);
  const components = [];

  function dfsSecond(u, component) {
    visited[u] = true;
    component.push(u);
    for (const v of reverseGraph[u]) {
      if (!visited[v]) {
        dfsSecond(v, component);
      }
    }
  }

  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited[node]) {
      const component = [];
      dfsSecond(node, component);
      components.push(component);
    }
  }

  return components;
}
```

```java
// Time: O(V + E) | Space: O(V)
import java.util.*;

public class KosarajuSCC {
    public List<List<Integer>> kosaraju(int n, int[][] edges) {
        // Build adjacency lists
        List<Integer>[] graph = new ArrayList[n];
        List<Integer>[] reverseGraph = new ArrayList[n];

        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
            reverseGraph[i] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            reverseGraph[v].add(u);
        }

        // First pass: DFS to get finishing order
        boolean[] visited = new boolean[n];
        Stack<Integer> stack = new Stack<>();

        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfsFirst(i, graph, visited, stack);
            }
        }

        // Second pass: DFS on reversed graph
        Arrays.fill(visited, false);
        List<List<Integer>> components = new ArrayList<>();

        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (!visited[node]) {
                List<Integer> component = new ArrayList<>();
                dfsSecond(node, reverseGraph, visited, component);
                components.add(component);
            }
        }

        return components;
    }

    private void dfsFirst(int u, List<Integer>[] graph, boolean[] visited, Stack<Integer> stack) {
        visited[u] = true;
        for (int v : graph[u]) {
            if (!visited[v]) {
                dfsFirst(v, graph, visited, stack);
            }
        }
        stack.push(u);  // Add to stack after visiting all neighbors
    }

    private void dfsSecond(int u, List<Integer>[] graph, boolean[] visited, List<Integer> component) {
        visited[u] = true;
        component.add(u);
        for (int v : graph[u]) {
            if (!visited[v]) {
                dfsSecond(v, graph, visited, component);
            }
        }
    }
}
```

</div>

### Pattern 2: Tarjan's Algorithm — Single Pass with Low-Link Values

Tarjan's algorithm is more efficient in practice and runs in a single DFS pass. It uses the concept of "low-link values"—the smallest node ID reachable from a node including itself. When a node's low-link value equals its discovery time, you've found the root of an SCC.

**Problems using this pattern:**

- **Critical Connections in a Network (LeetCode #1192)** — finding bridges and articulation points
- **Find Eventual Safe States (LeetCode #802)** — cycle detection in state machines
- **Minimum Height Trees (LeetCode #310)** — when adapted for directed graphs

<div class="code-group">

```python
# Time: O(V + E) | Space: O(V)
def tarjan_scc(n, edges):
    """
    Tarjan's algorithm for finding strongly connected components.
    Uses low-link values and a single DFS pass.
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)

    index = 0
    stack = []
    on_stack = [False] * n
    indices = [-1] * n
    low_link = [0] * n
    components = []

    def strongconnect(v):
        nonlocal index
        # Set depth index for v to the smallest unused index
        indices[v] = index
        low_link[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True

        # Consider successors of v
        for w in graph[v]:
            if indices[w] == -1:
                # Successor w has not yet been visited; recurse on it
                strongconnect(w)
                low_link[v] = min(low_link[v], low_link[w])
            elif on_stack[w]:
                # Successor w is in stack and hence in current SCC
                low_link[v] = min(low_link[v], indices[w])

        # If v is a root node, pop the stack and generate an SCC
        if low_link[v] == indices[v]:
            component = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                component.append(w)
                if w == v:
                    break
            components.append(component)

    for v in range(n):
        if indices[v] == -1:
            strongconnect(v)

    return components
```

```javascript
// Time: O(V + E) | Space: O(V)
function tarjanSCC(n, edges) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
  }

  let index = 0;
  const stack = [];
  const onStack = Array(n).fill(false);
  const indices = Array(n).fill(-1);
  const lowLink = Array(n).fill(0);
  const components = [];

  function strongConnect(v) {
    // Set depth index for v to the smallest unused index
    indices[v] = index;
    lowLink[v] = index;
    index++;
    stack.push(v);
    onStack[v] = true;

    // Consider successors of v
    for (const w of graph[v]) {
      if (indices[w] === -1) {
        // Successor w has not yet been visited; recurse on it
        strongConnect(w);
        lowLink[v] = Math.min(lowLink[v], lowLink[w]);
      } else if (onStack[w]) {
        // Successor w is in stack and hence in current SCC
        lowLink[v] = Math.min(lowLink[v], indices[w]);
      }
    }

    // If v is a root node, pop the stack and generate an SCC
    if (lowLink[v] === indices[v]) {
      const component = [];
      while (true) {
        const w = stack.pop();
        onStack[w] = false;
        component.push(w);
        if (w === v) break;
      }
      components.push(component);
    }
  }

  for (let v = 0; v < n; v++) {
    if (indices[v] === -1) {
      strongConnect(v);
    }
  }

  return components;
}
```

```java
// Time: O(V + E) | Space: O(V)
import java.util.*;

public class TarjanSCC {
    public List<List<Integer>> tarjan(int n, int[][] edges) {
        // Build adjacency list
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            graph[edge[0]].add(edge[1]);
        }

        int index = 0;
        Stack<Integer> stack = new Stack<>();
        boolean[] onStack = new boolean[n];
        int[] indices = new int[n];
        int[] lowLink = new int[n];
        Arrays.fill(indices, -1);
        List<List<Integer>> components = new ArrayList<>();

        for (int v = 0; v < n; v++) {
            if (indices[v] == -1) {
                strongConnect(v, graph, indices, lowLink, stack, onStack, components, index);
            }
        }

        return components;
    }

    private void strongConnect(int v, List<Integer>[] graph, int[] indices, int[] lowLink,
                              Stack<Integer> stack, boolean[] onStack,
                              List<List<Integer>> components, int index) {
        // Set depth index for v to the smallest unused index
        indices[v] = index;
        lowLink[v] = index;
        index++;
        stack.push(v);
        onStack[v] = true;

        // Consider successors of v
        for (int w : graph[v]) {
            if (indices[w] == -1) {
                // Successor w has not yet been visited; recurse on it
                strongConnect(w, graph, indices, lowLink, stack, onStack, components, index);
                lowLink[v] = Math.min(lowLink[v], lowLink[w]);
            } else if (onStack[w]) {
                // Successor w is in stack and hence in current SCC
                lowLink[v] = Math.min(lowLink[v], indices[w]);
            }
        }

        // If v is a root node, pop the stack and generate an SCC
        if (lowLink[v] == indices[v]) {
            List<Integer> component = new ArrayList<>();
            while (true) {
                int w = stack.pop();
                onStack[w] = false;
                component.add(w);
                if (w == v) break;
            }
            components.add(component);
        }
    }
}
```

</div>

### Pattern 3: Condensation Graph — From SCC to DAG

Once you find SCCs, you often need to build a condensation graph where each SCC becomes a single node. This creates a Directed Acyclic Graph (DAG), which is much easier to work with for problems like topological sorting or finding longest paths.

**Problems using this pattern:**

- **Course Schedule II (LeetCode #210)** — after finding SCCs, topological sort the condensation graph
- **Find Eventual Safe States (LeetCode #802)** — safe states are SCCs with no outgoing edges to other SCCs
- **Alien Dictionary (LeetCode #269)** — when there are cycles in the character ordering

## When to Use Strongly Connected Component vs Alternatives

The key decision point is **directionality**. Ask yourself these questions:

1. **Are edges directed?** If yes, consider SCC. If no, use Union-Find or regular DFS/BFS for connected components.
2. **Do you need to find cycles in directed graphs?** SCC algorithms naturally find cycles since any cycle forms an SCC with more than one node.
3. **Is the graph potentially disconnected?** Both SCC and alternatives handle this, but SCC gives you more structural information.
4. **Do you need to process the graph as a DAG?** If you need topological order or want to eliminate cycles, SCC → condensation graph is your best bet.

**Decision criteria:**

- Use **Union-Find** for undirected graphs where you only need connectivity information
- Use **DFS/BFS** for pathfinding or when you need to traverse the graph
- Use **SCC algorithms** when you have a directed graph and need to understand its cyclic structure
- Use **Topological Sort** only on DAGs—if you're not sure if it's a DAG, use SCC first

## Edge Cases and Gotchas

1. **Self-loops**: A node with an edge to itself forms a trivial SCC. Both algorithms handle this correctly, but make sure your implementation doesn't infinite loop.

2. **Disconnected graphs**: Your algorithm must handle multiple starting points. Always iterate through all nodes and start DFS from unvisited ones.

3. **Large recursion depth**: For graphs with thousands of nodes, recursive DFS might cause stack overflow. Consider iterative DFS or increase recursion limits.

4. **Empty or single-node graphs**: These should return empty lists or single-element components, not crash.

5. **Parallel edges**: Multiple edges between the same nodes shouldn't affect SCC detection, but they might affect performance if not handled efficiently.

<div class="code-group">

```python
# Handling edge cases in SCC algorithms
def safe_scc(n, edges):
    """SCC implementation with edge case handling."""
    if n == 0:
        return []

    # Handle self-loops and parallel edges by using sets
    graph = [set() for _ in range(n)]
    reverse_graph = [set() for _ in range(n)]

    for u, v in edges:
        if 0 <= u < n and 0 <= v < n:  # Validate node indices
            graph[u].add(v)
            reverse_graph[v].add(u)

    # Rest of Kosaraju's algorithm...
    # Use iterative DFS for large graphs to avoid recursion depth issues
```

```javascript
// Handling edge cases in SCC algorithms
function safeSCC(n, edges) {
  // Handle empty graph
  if (n === 0) return [];

  // Use Sets to handle parallel edges
  const graph = Array.from({ length: n }, () => new Set());
  const reverseGraph = Array.from({ length: n }, () => new Set());

  for (const [u, v] of edges) {
    // Validate indices
    if (u >= 0 && u < n && v >= 0 && v < n) {
      graph[u].add(v);
      reverseGraph[v].add(u);
    }
  }

  // Convert Sets back to arrays for iteration
  const adjGraph = graph.map((set) => Array.from(set));
  const adjReverseGraph = reverseGraph.map((set) => Array.from(set));

  // Rest of Kosaraju's algorithm...
  // Consider iterative approach for very large n
}
```

```java
// Handling edge cases in SCC algorithms
import java.util.*;

public class SafeSCC {
    public List<List<Integer>> safeSCC(int n, int[][] edges) {
        // Handle empty graph
        if (n == 0) return new ArrayList<>();

        // Use Sets to handle parallel edges
        Set<Integer>[] graph = new HashSet[n];
        Set<Integer>[] reverseGraph = new HashSet[n];

        for (int i = 0; i < n; i++) {
            graph[i] = new HashSet<>();
            reverseGraph[i] = new HashSet<>();
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            // Validate indices
            if (u >= 0 && u < n && v >= 0 && v < n) {
                graph[u].add(v);
                reverseGraph[v].add(u);
            }
        }

        // Convert Sets to Lists for DFS
        List<Integer>[] adjGraph = new ArrayList[n];
        List<Integer>[] adjReverseGraph = new ArrayList[n];

        for (int i = 0; i < n; i++) {
            adjGraph[i] = new ArrayList<>(graph[i]);
            adjReverseGraph[i] = new ArrayList<>(reverseGraph[i]);
        }

        // Rest of Kosaraju's algorithm...
        // Use iterative DFS with explicit stack for large n
        return new ArrayList<>();
    }
}
```

</div>

## Difficulty Breakdown

The 100% Hard rating for SCC problems tells a clear story: these are advanced questions reserved for senior positions or specialized roles. When you see an SCC problem in an interview, the interviewer is testing:

1. **Graph theory fundamentals**: Do you understand directed vs undirected graphs?
2. **Algorithm knowledge**: Can you implement non-trivial graph algorithms?
3. **Problem decomposition**: Can you break down a complex problem into SCC detection + condensation + processing?

This difficulty distribution means you shouldn't prioritize SCC for general interview prep, but if you're interviewing for roles involving networks, compilers, or complex systems, SCC becomes crucial.

## Which Companies Ask Strongly Connected Component

1. **Amazon** (/company/amazon) — Asks SCC in system design contexts, like modeling service dependencies in microservices architectures. They often present it as a "detect circular dependencies" problem.

2. **Google** (/company/google) — Uses SCC in compiler and dependency resolution problems. Think about how Google's build system (Bazel) needs to detect dependency cycles.

3. **Bloomberg** (/company/bloomberg) — Presents SCC in financial network problems, like detecting circular ownership structures or money flow cycles.

4. **Argo AI** (/company/argo-ai) — Applies SCC to sensor fusion and state estimation problems in autonomous vehicles, where different sensor readings need to form consistent "components" of truth.

5. **Sprinklr** (/company/sprinklr) — Uses SCC in social network analysis to find tightly-knit groups or echo chambers in directed follower networks.

Each company has a different flavor: Amazon focuses on practical system design, Google on algorithmic purity, Bloomberg on financial modeling, Argo AI on real-time systems, and Sprinklr on network analysis.

## Study Tips

1. **Master one algorithm deeply**: Don't try to learn both Kosaraju and Tarjan perfectly. Choose one (I recommend Tarjan for interviews—it's more impressive) and understand it thoroughly.

2. **Practice in this order**:
   - Start with **Course Schedule II (#210)** to understand the basic pattern
   - Move to **Find Eventual Safe States (#802)** for cycle detection applications
   - Finish with **Critical Connections in a Network (#1192)** for the full SCC + condensation graph pattern

3. **Draw the graphs**: SCC algorithms are visual. Always draw small examples (5-7 nodes) and trace through the algorithm step by step.

4. **Time-box your practice**: Since SCC problems are rare, spend no more than 5-10% of your graph study time on them. Focus on more common patterns like BFS, DFS, and Union-Find first.

Remember: The goal isn't to memorize SCC algorithms, but to understand when and why they work. When you can explain why the low-link value trick works in Tarjan's algorithm, you're ready for any SCC interview question.

[Practice all Strongly Connected Component questions on CodeJeet](/topic/strongly-connected-component)
