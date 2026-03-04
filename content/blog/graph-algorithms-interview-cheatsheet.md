---
title: "Graph Algorithms for Interviews: The Essential Cheatsheet"
description: "BFS, DFS, Dijkstra, topological sort, union-find — everything you need to know about graph algorithms for coding interviews."
date: "2026-06-15"
category: "tips"
tags: ["graphs", "BFS", "DFS", "algorithms", "interview prep"]
---

Here is the enhanced blog post with code examples and additional depth:

Graph problems show up in many forms -- grid traversal, social networks, dependency resolution, shortest paths -- but the underlying algorithms are a small, learnable set. This cheatsheet covers every graph concept you need for interviews.

## Graph Representation

**Adjacency list** is the default for interviews. Use a hash map where each key is a node and the value is a list of neighbors. O(V + E) space. This representation is efficient for sparse graphs and makes iterating through neighbors straightforward.

**Adjacency matrix** uses a 2D array. O(V²) space. Only practical for small, dense graphs. The matrix allows O(1) edge existence checks but requires O(V) time to list all neighbors of a node.

**Implicit graphs** are common. Grid problems (like Number of Islands) treat each cell as a node with edges to adjacent cells. You don't need to build an explicit graph structure—just traverse the grid directly.

Here's how to implement adjacency list representation in different languages:

<div class="code-group">

```python
# Adjacency list representation for an undirected graph
class Graph:
    def __init__(self, num_vertices):
        self.num_vertices = num_vertices
        self.adj_list = {i: [] for i in range(num_vertices)}

    def add_edge(self, u, v):
        self.adj_list[u].append(v)
        self.adj_list[v].append(u)  # For undirected graph

    def print_graph(self):
        for vertex in range(self.num_vertices):
            print(f"{vertex}: {self.adj_list[vertex]}")

# Usage
g = Graph(5)
g.add_edge(0, 1)
g.add_edge(0, 4)
g.add_edge(1, 2)
g.add_edge(1, 3)
g.print_graph()
```

```javascript
// Adjacency list representation for an undirected graph
class Graph {
  constructor(numVertices) {
    this.numVertices = numVertices;
    this.adjList = new Map();

    // Initialize adjacency list for each vertex
    for (let i = 0; i < numVertices; i++) {
      this.adjList.set(i, []);
    }
  }

  addEdge(u, v) {
    this.adjList.get(u).push(v);
    this.adjList.get(v).push(u); // For undirected graph
  }

  printGraph() {
    for (let [vertex, neighbors] of this.adjList) {
      console.log(`${vertex}: ${neighbors.join(", ")}`);
    }
  }
}

// Usage
const g = new Graph(5);
g.addEdge(0, 1);
g.addEdge(0, 4);
g.addEdge(1, 2);
g.addEdge(1, 3);
g.printGraph();
```

```java
import java.util.*;

// Adjacency list representation for an undirected graph
class Graph {
    private int numVertices;
    private List<List<Integer>> adjList;

    public Graph(int numVertices) {
        this.numVertices = numVertices;
        this.adjList = new ArrayList<>();

        // Initialize adjacency list for each vertex
        for (int i = 0; i < numVertices; i++) {
            adjList.add(new ArrayList<>());
        }
    }

    public void addEdge(int u, int v) {
        adjList.get(u).add(v);
        adjList.get(v).add(u);  // For undirected graph
    }

    public void printGraph() {
        for (int i = 0; i < numVertices; i++) {
            System.out.print(i + ": ");
            for (int neighbor : adjList.get(i)) {
                System.out.print(neighbor + " ");
            }
            System.out.println();
        }
    }
}

// Usage
Graph g = new Graph(5);
g.addEdge(0, 1);
g.addEdge(0, 4);
g.addEdge(1, 2);
g.addEdge(1, 3);
g.printGraph();
```

</div>

## BFS: Breadth-First Search

BFS explores nodes level by level using a queue. Use it for shortest path in unweighted graphs and level-order traversal. BFS guarantees that when you first visit a node, you've found the shortest path to it in terms of number of edges.

**Template:** Initialize a queue with the starting node(s), mark as visited, then process each node by adding unvisited neighbors. Track distance by processing level by level. For level tracking, you can either use a distance array or process nodes level by level with a nested loop.

**Key problems:** Word Ladder, Rotting Oranges (multi-source BFS), Shortest Path in Binary Matrix.

Here's a complete BFS implementation:

<div class="code-group">

```python
from collections import deque

def bfs(graph, start):
    """Standard BFS traversal returning visited nodes in BFS order."""
    visited = set()
    result = []
    queue = deque([start])
    visited.add(start)

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return result

# Example usage with adjacency list
graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1],
    5: [2]
}

print("BFS traversal starting from node 0:", bfs(graph, 0))
```

```javascript
function bfs(graph, start) {
  /** Standard BFS traversal returning visited nodes in BFS order. */
  const visited = new Set();
  const result = [];
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

// Example usage with adjacency list
const graph = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1],
  5: [2],
};

console.log("BFS traversal starting from node 0:", bfs(graph, 0));
```

```java
import java.util.*;

public class BFS {
    public static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
        /** Standard BFS traversal returning visited nodes in BFS order. */
        Set<Integer> visited = new HashSet<>();
        List<Integer> result = new ArrayList<>();
        Queue<Integer> queue = new LinkedList<>();

        queue.offer(start);
        visited.add(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);

            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }

        return result;
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(0, 3, 4));
        graph.put(2, Arrays.asList(0, 5));
        graph.put(3, Arrays.asList(1));
        graph.put(4, Arrays.asList(1));
        graph.put(5, Arrays.asList(2));

        System.out.println("BFS traversal starting from node 0: " + bfs(graph, 0));
    }
}
```

</div>

## DFS: Depth-First Search

DFS explores as deep as possible before backtracking, using recursion or an explicit stack. Use it for cycle detection, connected components, topological sorting, and path exploration. DFS is naturally recursive and is excellent for exploring all possible paths.

**Template:** Mark the current node as visited, then recursively visit each unvisited neighbor. For cycle detection in directed graphs, maintain a "currently in stack" set alongside the visited set. This helps detect back edges in directed graphs.

**Key problems:** Number of Islands, Clone Graph, Course Schedule, Pacific Atlantic Water Flow.

Here's DFS implementation with both recursive and iterative approaches:

<div class="code-group">

```python
def dfs_recursive(graph, node, visited=None, result=None):
    """Recursive DFS implementation."""
    if visited is None:
        visited = set()
    if result is None:
        result = []

    visited.add(node)
    result.append(node)

    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited, result)

    return result

def dfs_iterative(graph, start):
    """Iterative DFS implementation using a stack."""
    visited = set()
    result = []
    stack = [start]

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            result.append(node)
            # Add neighbors in reverse to maintain similar order to recursive
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)

    return result

# Example usage
graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1],
    5: [2]
}

print("Recursive DFS:", dfs_recursive(graph, 0))
print("Iterative DFS:", dfs_iterative(graph, 0))
```

```javascript
function dfsRecursive(graph, node, visited = new Set(), result = []) {
  /** Recursive DFS implementation. */
  visited.add(node);
  result.push(node);

  for (const neighbor of graph[node] || []) {
    if (!visited.has(neighbor)) {
      dfsRecursive(graph, neighbor, visited, result);
    }
  }

  return result;
}

function dfsIterative(graph, start) {
  /** Iterative DFS implementation using a stack. */
  const visited = new Set();
  const result = [];
  const stack = [start];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      // Add neighbors in reverse to maintain similar order to recursive
      const neighbors = graph[node] || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }
  }

  return result;
}

// Example usage
const graph = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1],
  5: [2],
};

console.log("Recursive DFS:", dfsRecursive(graph, 0));
console.log("Iterative DFS:", dfsIterative(graph, 0));
```

```java
import java.util.*;

public class DFS {
    public static List<Integer> dfsRecursive(Map<Integer, List<Integer>> graph, int node) {
        /** Recursive DFS implementation. */
        List<Integer> result = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        dfsRecursiveHelper(graph, node, visited, result);
        return result;
    }

    private static void dfsRecursiveHelper(Map<Integer, List<Integer>> graph, int node,
                                          Set<Integer> visited, List<Integer> result) {
        visited.add(node);
        result.add(node);

        for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                dfsRecursiveHelper(graph, neighbor, visited, result);
            }
        }
    }

    public static List<Integer> dfsIterative(Map<Integer, List<Integer>> graph, int start) {
        /** Iterative DFS implementation using a stack. */
        Set<Integer> visited = new HashSet<>();
        List<Integer> result = new ArrayList<>();
        Stack<Integer> stack = new Stack<>();

        stack.push(start);

        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (!visited.contains(node)) {
                visited.add(node);
                result.add(node);
                // Add neighbors in reverse to maintain similar order to recursive
                List<Integer> neighbors = graph.getOrDefault(node, new ArrayList<>());
                for (int i = neighbors.size() - 1; i >= 0; i--) {
                    if (!visited.contains(neighbors.get(i))) {
                        stack.push(neighbors.get(i));
                    }
                }
            }
        }

        return result;
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(0, 3, 4));
        graph.put(2, Arrays.asList(0, 5));
        graph.put(3, Arrays.asList(1));
        graph.put(4, Arrays.asList(1));
        graph.put(5, Arrays.asList(2));

        System.out.println("Recursive DFS: " + dfsRecursive(graph, 0));
        System.out.println("Iterative DFS: " + dfsIterative(graph, 0));
    }
}
```

</div>

## BFS vs DFS

Use BFS for shortest distance, minimum steps, or level-by-level processing. Use DFS for connected components, cycle detection, or path existence. For reachability alone, either works.

**Practical considerations:**

- BFS uses more memory (queue size can be O(V) in worst case)
- DFS uses less memory (stack depth is O(V) in worst case for recursive, but typically less)
- BFS finds the shortest path in unweighted graphs
- DFS is easier to implement recursively for tree-like exploration

## Topological Sort

Produces a linear ordering of nodes in a DAG such that every edge goes from earlier to later. Standard for dependency resolution. Topological sort only exists for Directed Acyclic Graphs (DAGs).

**Kahn's Algorithm (BFS-based):** Compute in-degrees, enqueue all nodes with in-degree 0, process each by decrementing neighbors' in-degrees, enqueue any that hit 0. This algorithm is intuitive and works well when you need to detect cycles.

**DFS-based:** Run DFS and push nodes onto a stack in post-order. Reverse for topological order. This approach is more natural if you're already doing DFS for other purposes.

**Key problems:** Course Schedule, Course Schedule II, Alien Dictionary.

Here's both implementations:

<div class="code-group">

```python
from collections import deque

def topological_sort_kahn(num_courses, prerequisites):
    """Kahn's algorithm for topological sort."""
    # Build graph and in-degree array
    graph = {i: [] for i in range(num_courses)}
    in_degree = [0] * num_courses

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1

    # Initialize queue with nodes having 0 in-degree
    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # Check if topological sort exists (graph is DAG)
    if len(result) == num_courses:
        return result
    return []  # Cycle detected

def topological_sort_dfs(num_courses, prerequisites):
    """DFS-based topological sort."""
    # Build graph
    graph = {i: [] for i in range(num_courses)}
    for course, prereq in prerequisites:
        graph[prereq].append(course)

    visited = [0] * num_courses  # 0=unvisited, 1=visiting, 2=visited
    result = []

    def dfs(node):
        if visited[node] == 1:  # Cycle detected
            return False
        if visited[node] == 2:  # Already processed
            return True

        visited[node] = 1  # Mark as visiting
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False

        visited[node] = 2  # Mark as visited
        result.append(node)
        return True

    for i in range(num_courses):
        if visited[i] == 0:
            if not dfs(i):
                return []  # Cycle detected

    return result[::-1]  # Reverse to get topological order

# Example usage
num_courses = 6
prerequisites = [[1, 0], [2, 1], [3, 1], [4, 2], [5, 3]]
print("Kahn's algorithm:", topological_sort_kahn(num_courses, prerequisites))
print("DFS-based:", topological_sort_dfs(num_courses, prerequisites))
```

```javascript
function topologicalSortKahn(numCourses, prerequisites) {
  /** Kahn's algorithm for topological sort. */
  // Build graph and in-degree array
  const graph = new Array(numCourses).fill(0).map(() => []);
  const inDegree = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }

  // Initialize queue with nodes having 0 in-degree
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  const result = [];

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);

    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Check if topological sort exists (graph is DAG)
  if (result.length === numCourses) {
    return result;
  }
  return []; // Cycle detected
}

function topologicalSortDFS(numCourses, prerequisites) {
  /** DFS-based topological sort. */
  // Build graph
  const graph = new Array(numCourses).fill(0).map(() => []);
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
  }

  const visited = new Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=visited
  const result = [];

  function dfs(node) {
    if (visited[node] === 1) {
      // Cycle detected
      return false;
    }
    if (visited[node] === 2) {
      // Already processed
      return true;
    }

    visited[node] = 1; // Mark as visiting
    for (const neighbor of graph[node]) {
      if (!dfs(neighbor)) {
        return false;
      }
    }

    visited[node] = 2; // Mark as visited
    result.push(node);
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (visited[i] === 0) {
      if (!dfs(i)) {
        return []; // Cycle detected
      }
    }
  }

  return result.reverse(); // Reverse to get topological order
}

// Example usage
const numCourses = 6;
const prerequisites = [
  [1, 0],
  [2, 1],
  [3, 1],
  [4, 2],
  [5, 3],
];
console.log("Kahn's algorithm:", topologicalSortKahn(numCourses, prerequisites));
console.log("DFS-based:", topologicalSortDFS(numCourses, prerequisites));
```

```java
import java.util.*;

public class TopologicalSort {
    public static List<Integer> topologicalSortKahn(int numCourses, int[][] prerequisites) {
        /** Kahn's algorithm for topological sort. */
        // Build graph and in-degree array
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        int[] inDegree = new int[numCourses];

        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int pre = prereq[1];
            graph.get(pre).add(course);
            inDegree[course]++;
        }

        // Initialize queue with nodes having 0 in-degree
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) {
                queue.offer(i);
            }
        }

        List<Integer> result = new ArrayList<>();

        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);

            for (int neighbor : graph.get(node)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        // Check if topological sort exists (graph is DAG)
        if (result.size() == numCourses) {
            return result;
        }
        return new ArrayList<>();  // Cycle detected
    }

    public static List<Integer> topologicalSortDFS(int numCourses, int[][] prerequisites) {
        /** DFS-based topological sort. */
        // Build graph
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int pre = prereq[1];
            graph.get(pre).add(course);
        }

        int[] visited = new int[numCourses];  // 0=unvisited, 1=visiting, 2=visited
        List<Integer> result = new ArrayList<>();

        for (int i = 0; i < numCourses; i++) {
            if (visited[i] == 0) {
                if (!dfs(i, graph, visited, result)) {
                    return new ArrayList<>();  // Cycle detected
                }
            }
        }

        Collections.reverse(result);  // Reverse to get topological order
        return result;
    }

    private static boolean dfs(int node, List<List<Integer>> graph,
                              int[] visited, List<Integer> result) {
        if (visited[node] == 1) {  // Cycle detected
            return false;
        }
        if (visited[node] == 2) {  // Already processed
            return true;
        }

        visited[node] = 1;  // Mark as visiting
        for (int neighbor : graph.get(node)) {
            if (!dfs(neighbor, graph, visited, result)) {
                return false;
            }
        }

        visited[node] = 2;  // Mark as visited
        result.add(node);
        return true;
    }

    public static void main(String[] args) {
        int numCourses = 6;
        int[][] prerequisites = {{1, 0}, {2, 1}, {3, 1}, {4, 2}, {5, 3}};
        System.out.println("Kahn's algorithm: " + topologicalSortKahn(numCourses, prerequisites));
        System.out.println("DFS-based: " + topologicalSortDFS(numCourses, prerequisites));
    }
}
```

</div>

## Dijkstra's Algorithm

Finds the shortest path in a weighted graph with non-negative edges. Uses a min-heap to always process the closest unvisited node. Dijkstra's algorithm is greedy and works by repeatedly selecting the vertex with the smallest known distance from the source.

**Template:** Initialize distances to infinity except the source (0). Push source into a min-heap. Pop the smallest, skip if processed, and relax all edges. The relaxation step checks if going through the current node provides a shorter path to its neighbors.

**Key problems:** Network Delay Time, Cheapest Flights Within K Stops, Path with Minimum Effort.

Here's Dijkstra's algorithm implementation:

<div class="code-group">

```python
import heapq

def dijkstra(graph, start):
    """Dijkstra's algorithm for shortest paths in weighted graphs."""
    # Initialize distances
    distances = {node: float('inf') for node in graph}
    distances[start] = 0

    # Priority queue: (distance, node)
    pq = [(0, start)]

    while pq:
        current_dist, current_node = heapq.heappop(pq)

        # Skip if we found a better path already
        if current_dist > distances[current_node]:
            continue

        # Relax edges
        for neighbor, weight in graph[current_node]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances

# Example usage: weighted graph as adjacency list
graph = {
    0: [(1, 4), (2, 1)],
    1: [(3, 1)],
    2: [(1, 2), (3, 5)],
    3: [(4, 3)],
    4: []
}

print("Shortest distances from node 0:", dijkstra(graph, 0))
```

```javascript
function dijkstra(graph, start) {
  /** Dijkstra's algorithm for shortest paths in weighted graphs. */
  // Initialize distances
  const distances = {};
  for (const node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  // Priority queue: [distance, node]
  const pq = new MinHeap((a, b) => a[0] - b[0]);
  pq.push([0, start]);

  while (!pq.isEmpty()) {
    const [currentDist, currentNode] = pq.pop();

    // Skip if we found a better path already
    if (currentDist > distances[currentNode]) {
      continue;
    }

    // Relax edges
    for (const [neighbor, weight] of graph[currentNode]) {
      const distance = currentDist + weight;
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        pq.push([distance, neighbor]);
      }
    }
  }

  return distances;
}

// Simple MinHeap implementation for Dijkstra
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return root;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const last = this.heap.length - 1;
    while (true) {
      let left = index * 2 + 1;
      let right = index * 2 + 2;
      let smallest = index;

      if (left <= last && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

// Example usage: weighted graph as adjacency list
const graph = {
  0: [
    [1, 4],
    [2, 1],
  ],
  1: [[3, 1]],
  2: [
    [1, 2],
    [3, 5],
  ],
  3: [[4, 3]],
  4: [],
};

console.log("Shortest distances from node 0:", dijkstra(graph, 0));
```

```java
import java.util.*;

public class Dijkstra {
    public static Map<Integer, Integer> dijkstra(Map<Integer, List<int[]>> graph, int start) {
        /** Dijkstra's algorithm for shortest paths in weighted graphs. */
        // Initialize distances
        Map<Integer, Integer> distances = new HashMap<>();
        for (int node : graph.keySet()) {
            distances.put(node, Integer.MAX_VALUE);
        }
        distances.put(start, 0);

        // Priority queue: [distance, node]
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, start});

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currentDist = current[0];
            int currentNode = current[1];

            // Skip if we found a better path already
            if (currentDist > distances.get(currentNode)) {
                continue;
            }

            // Relax edges
            for (int[] edge : graph.getOrDefault(currentNode, new ArrayList<>())) {
                int neighbor = edge[0];
                int weight = edge[1];
                int distance = currentDist + weight;

                if (distance < distances.get(neighbor)) {
                    distances.put(neighbor, distance);
                    pq.offer(new int[]{distance, neighbor});
                }
            }
        }

        return distances;
    }

    public static void main(String[] args) {
        // Example usage: weighted graph as adjacency list
        Map<Integer, List<int[]>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(new int[]{1, 4}, new int[]{2, 1}));
        graph.put(1, Arrays.asList(new int[]{3, 1}));
        graph.put(2, Arrays.asList(new int[]{1, 2}, new int[]{3, 5}));
        graph.put(3, Arrays.asList(new int[]{4, 3}));
        graph.put(4, new ArrayList<>());

        System.out.println("Shortest distances from node 0: " + dijkstra(graph, 0));
    }
}
```

</div>

## Union-Find (Disjoint Set Union)

Tracks connected components with near-O(1) find and union operations using path compression and union by rank. Union-Find is particularly useful for dynamic connectivity problems where edges are added over time.

**When to use:** Dynamically tracking components as edges are added, repeated connectivity queries, minimum spanning tree (Kruskal's). The two key optimizations are path compression (flattening the tree during find operations) and union by rank (attaching smaller trees to larger ones).

**Key problems:** Number of Provinces, Redundant Connection, Accounts Merge.

Here's a complete Union-Find implementation:

<div class="code-group">

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x):
        """Find with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        """Union by rank."""
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False  # Already connected

        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        self.components -= 1
        return True

    def connected(self, x, y):
        """Check if x and y are in the same component."""
        return self.find(x) == self.find(y)

    def count_components(self):
        """Return the number of connected components."""
        return self.components

# Example usage
uf = UnionFind(5)
print("Initial components:", uf.count_components())

uf.union(0, 1)
uf.union(1, 2)
uf.union(3, 4)

print("After unions:")
print("Are 0 and 2 connected?", uf.connected(0, 2))
print("Are 0 and 3 connected?", uf.connected(0, 3))
print("Components:", uf.count_components())
```

```javascript
class UnionFind {
  constructor(n) {
    this.parent = new Array(n);
    this.rank = new Array(n).fill(0);
    this.components = n;

    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }

  find(x) {
    /** Find with path compression. */
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    /** Union by rank. */
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Already connected
    }

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    this.components--;
    return true;
  }

  connected(x, y) {
    /** Check if x and y are in the same component. */
    return this.find(x) === this.find(y);
  }

  countComponents() {
    /** Return the number of connected components. */
    return this.components;
  }
}

// Example usage
const uf = new UnionFind(5);
console.log("Initial components:", uf.countComponents());

uf.union(0, 1);
uf.union(1, 2);
uf.union(3, 4);

console.log("After unions:");
console.log("Are 0 and 2 connected?", uf.connected(0, 2));
console.log("Are 0 and 3 connected?", uf.connected(0, 3));
console.log("Components:", uf.countComponents());
```

```java
class UnionFind {
    private int[] parent;
    private int[] rank;
    private int components;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        components = n;

        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        /** Find with path compression. */
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        /** Union by rank. */
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) {
            return false;  // Already connected
        }

        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {

```
