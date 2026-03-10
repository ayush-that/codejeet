---
title: "How to Solve Find if Path Exists in Graph — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find if Path Exists in Graph. Easy difficulty, 54.8% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2027-02-05"
category: "dsa-patterns"
tags:
  [
    "find-if-path-exists-in-graph",
    "depth-first-search",
    "breadth-first-search",
    "union-find",
    "easy",
  ]
---

# How to Solve "Find if Path Exists in Graph"

This problem asks whether there's a path between two given nodes in an undirected graph. While conceptually simple, it's a foundational graph problem that tests your ability to implement basic graph traversal or union-find algorithms. The "trick" is recognizing that since the graph is undirected, you need to avoid infinite loops when traversing, and you must handle potentially disconnected components.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- n = 6 (vertices 0 through 5)
- edges = [[0,1], [0,2], [3,5], [5,4], [4,3]]
- source = 0
- destination = 5

**Step 1: Build adjacency list**
We convert edges into a structure showing each vertex's neighbors:

- 0: [1, 2]
- 1: [0]
- 2: [0]
- 3: [5, 4]
- 4: [5, 3]
- 5: [3, 4]

**Step 2: Traverse from source (0)**
We start at vertex 0 and explore its neighbors:

- Visit 0 → mark visited
- Check neighbors: 1 and 2
- Visit 1 → mark visited (no path to 5 found)
- Visit 2 → mark visited (no path to 5 found)

**Step 3: Check connectivity**
Vertices 0, 1, and 2 form one connected component. Vertices 3, 4, and 5 form another. Since source (0) and destination (5) are in different components, there's no path between them.

**Result:** false

If destination were 2 instead of 5, we'd find it during traversal and return true.

## Brute Force Approach

A truly naive approach might try to enumerate all possible paths from source to destination, which is exponential in complexity. However, the reasonable "first attempt" most candidates make is either DFS or BFS without proper cycle prevention.

The issue with a naive traversal is infinite loops in cycles. Consider this graph:

- edges = [[0,1], [1,2], [2,0]]
- source = 0, destination = 2

Without tracking visited nodes, DFS might go: 0 → 1 → 2 (found!) but could also go: 0 → 1 → 0 → 1 → 0... infinitely. The brute force fails because it doesn't prevent revisiting nodes.

## Optimal Solution

We have three optimal approaches: DFS, BFS, and Union-Find. All run in O(V + E) time (or near-linear for Union-Find). Here's the DFS solution, which is most intuitive for this problem:

<div class="code-group">

```python
# Time: O(V + E) where V = n vertices, E = len(edges)
# Space: O(V + E) for adjacency list and recursion stack/visited set
class Solution:
    def validPath(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
        # Step 1: Build adjacency list representation of the graph
        # This is more efficient than adjacency matrix for sparse graphs
        graph = [[] for _ in range(n)]

        # Since graph is undirected, add both directions for each edge
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # Step 2: Track visited nodes to prevent infinite loops in cycles
        visited = set()

        # Step 3: DFS helper function
        def dfs(node):
            # Base case: found destination
            if node == destination:
                return True

            # Mark current node as visited
            visited.add(node)

            # Explore all neighbors
            for neighbor in graph[node]:
                # Only visit unvisited neighbors
                if neighbor not in visited:
                    # If any path from neighbor leads to destination, return True
                    if dfs(neighbor):
                        return True

            # No path found from this node
            return False

        # Step 4: Start DFS from source
        return dfs(source)
```

```javascript
// Time: O(V + E) where V = n vertices, E = edges.length
// Space: O(V + E) for adjacency list and recursion stack/visited set
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} source
 * @param {number} destination
 * @return {boolean}
 */
var validPath = function (n, edges, source, destination) {
  // Step 1: Build adjacency list
  const graph = new Array(n);
  for (let i = 0; i < n; i++) {
    graph[i] = [];
  }

  // Add edges in both directions (undirected graph)
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Track visited nodes
  const visited = new Set();

  // Step 3: DFS function
  const dfs = (node) => {
    // Found destination
    if (node === destination) {
      return true;
    }

    // Mark as visited
    visited.add(node);

    // Explore all neighbors
    for (const neighbor of graph[node]) {
      // Only visit unvisited neighbors
      if (!visited.has(neighbor)) {
        // If path exists from neighbor, return true
        if (dfs(neighbor)) {
          return true;
        }
      }
    }

    // No path found from this node
    return false;
  };

  // Step 4: Start DFS from source
  return dfs(source);
};
```

```java
// Time: O(V + E) where V = n vertices, E = edges.length
// Space: O(V + E) for adjacency list and recursion stack/visited set
class Solution {
    public boolean validPath(int n, int[][] edges, int source, int destination) {
        // Step 1: Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

        // Add edges in both directions (undirected graph)
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph.get(u).add(v);
            graph.get(v).add(u);
        }

        // Step 2: Track visited nodes
        boolean[] visited = new boolean[n];

        // Step 3: DFS helper
        return dfs(graph, visited, source, destination);
    }

    private boolean dfs(List<List<Integer>> graph, boolean[] visited,
                       int current, int destination) {
        // Base case: found destination
        if (current == destination) {
            return true;
        }

        // Mark current node as visited
        visited[current] = true;

        // Explore all neighbors
        for (int neighbor : graph.get(current)) {
            // Only visit unvisited neighbors
            if (!visited[neighbor]) {
                // If path exists from neighbor, return true
                if (dfs(graph, visited, neighbor, destination)) {
                    return true;
                }
            }
        }

        // No path found from this node
        return false;
    }
}
```

</div>

**BFS Alternative:** Instead of DFS, you could use BFS which is iterative and avoids recursion depth limits:

<div class="code-group">

```python
def validPath(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    # BFS setup
    visited = set([source])
    queue = deque([source])

    while queue:
        node = queue.popleft()
        if node == destination:
            return True

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return False
```

</div>

**Union-Find Alternative:** For repeated queries on the same graph, Union-Find is more efficient:

<div class="code-group">

```python
def validPath(self, n: int, edges: List[List[int]], source: int, destination: int) -> bool:
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]  # Path compression
            x = parent[x]
        return x

    def union(x, y):
        root_x, root_y = find(x), find(y)
        if root_x != root_y:
            parent[root_y] = root_x

    # Connect all edges
    for u, v in edges:
        union(u, v)

    # Check if source and destination are connected
    return find(source) == find(destination)
```

</div>

## Complexity Analysis

**DFS/BFS Complexity:**

- **Time:** O(V + E) where V = n (vertices) and E = number of edges. We visit each vertex once and check each edge once.
- **Space:** O(V + E) for:
  - Adjacency list: O(V + E) storage
  - Visited set: O(V)
  - DFS recursion stack / BFS queue: O(V) in worst case

**Union-Find Complexity:**

- **Time:** O(E \* α(V)) where α is the inverse Ackermann function (effectively constant)
- **Space:** O(V) for parent array

The O(V + E) complexity comes from:

1. Building adjacency list: O(E) operations
2. Traversing: Each vertex visited once (O(V)), each edge considered once (O(E))

## Common Mistakes

1. **Forgetting the graph is undirected:** Only adding edges in one direction. This creates one-way streets in what should be a two-way road system.
   - **Fix:** Always add both `graph[u].append(v)` AND `graph[v].append(u)`

2. **Infinite recursion in cycles:** Not tracking visited nodes, causing infinite loops in cyclic graphs.
   - **Fix:** Use a `visited` set/array to mark nodes you've already explored.

3. **Using adjacency matrix for sparse graphs:** Creating an n×n matrix uses O(n²) space vs O(V+E) for adjacency list.
   - **Fix:** Use adjacency list unless the graph is dense (edges ≈ n²).

4. **Early termination in DFS:** Some candidates return `False` immediately if a neighbor doesn't lead to destination, instead of checking all neighbors.
   - **Fix:** Only return `False` after checking ALL neighbors of a node.

## When You'll See This Pattern

This "graph connectivity" pattern appears in many problems:

1. **Number of Provinces (LeetCode 547):** Count connected components in an undirected graph. Same core logic: traverse from each unvisited node to mark its entire component.

2. **Redundant Connection (LeetCode 684):** Find which edge creates a cycle in an undirected graph. Union-Find is perfect here—when you try to union two already-connected nodes, you've found the redundant edge.

3. **Is Graph Bipartite? (LeetCode 785):** Similar traversal pattern but with alternating colors. You still need to visit all nodes and check edges, just with different validation logic.

4. **Clone Graph (LeetCode 133):** Requires traversing the entire graph while creating copies of nodes. The BFS/DFS pattern is identical.

## Key Takeaways

1. **Undirected vs Directed:** Always check if the graph is undirected (edges go both ways) or directed (one-way). This changes how you build the adjacency list.

2. **Cycle Prevention is Critical:** Any graph traversal without cycle detection can infinite loop. Always use a `visited` set/array.

3. **Adjacency List > Adjacency Matrix:** For interview problems, graphs are usually sparse. Adjacency lists save space and are faster to iterate through neighbors.

4. **Three Approaches, One Core Idea:** DFS (recursive/stack), BFS (queue), and Union-Find all solve connectivity problems. DFS is simplest for "path exists," BFS finds shortest paths in unweighted graphs, and Union-Find excels for multiple queries.

**Related problems:** [Valid Arrangement of Pairs](/problem/valid-arrangement-of-pairs), [Paths in Maze That Lead to Same Room](/problem/paths-in-maze-that-lead-to-same-room)
