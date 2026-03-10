---
title: "How to Solve Reachable Nodes With Restrictions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reachable Nodes With Restrictions. Medium difficulty, 60.2% acceptance rate. Topics: Array, Hash Table, Tree, Depth-First Search, Breadth-First Search."
date: "2027-09-24"
category: "dsa-patterns"
tags: ["reachable-nodes-with-restrictions", "array", "hash-table", "tree", "medium"]
---

# How to Solve Reachable Nodes With Restrictions

You're given a tree with `n` nodes and a list of restricted nodes. Starting from node 0, you need to count how many nodes you can reach without passing through any restricted nodes. The challenge is that restricted nodes act as barriers that can split the tree into disconnected components, and you need to find the size of the component containing node 0.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

- n = 7
- edges = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6]]
- restricted = [4,5]

**Tree structure:**

```
      0
     / \
    1   5 (restricted)
   /     \
  2       6
 /
3
|
4 (restricted)
```

**Step-by-step reasoning:**

1. Start at node 0
2. From node 0, we can go to node 1 (since 1 is not restricted)
3. From node 1, we can go to node 2 (not restricted)
4. From node 2, we can go to node 3 (not restricted)
5. From node 3, we cannot go to node 4 because it's restricted
6. From node 0, we cannot go to node 5 because it's restricted
7. Therefore, we can reach nodes: 0, 1, 2, 3 → total of 4 nodes

The key insight is that we need to traverse the tree starting from node 0, but we must stop whenever we encounter a restricted node. Restricted nodes act as dead ends that block further exploration.

## Brute Force Approach

A naive approach might try to:

1. Build the tree structure
2. Start DFS/BFS from node 0
3. For each node visited, check if it's in the restricted list
4. If it is, don't explore its neighbors
5. Count all visited nodes

The problem with checking "if node in restricted" directly is that searching through an array takes O(r) time where r is the number of restricted nodes. In the worst case, this could make our traversal O(n × r), which is inefficient.

Here's what the inefficient version might look like:

<div class="code-group">

```python
# Time: O(n × r) | Space: O(n)
def reachableNodesBruteForce(n, edges, restricted):
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n
    count = 0

    def dfs(node):
        nonlocal count
        if node in restricted:  # O(r) check - inefficient!
            return
        if visited[node]:
            return

        visited[node] = True
        count += 1

        for neighbor in graph[node]:
            dfs(neighbor)

    dfs(0)
    return count
```

```javascript
// Time: O(n × r) | Space: O(n)
function reachableNodesBruteForce(n, edges, restricted) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const visited = Array(n).fill(false);
  let count = 0;

  function dfs(node) {
    if (restricted.includes(node)) {
      // O(r) check - inefficient!
      return;
    }
    if (visited[node]) {
      return;
    }

    visited[node] = true;
    count++;

    for (const neighbor of graph[node]) {
      dfs(neighbor);
    }
  }

  dfs(0);
  return count;
}
```

```java
// Time: O(n × r) | Space: O(n)
public int reachableNodesBruteForce(int n, int[][] edges, int[] restricted) {
    // Build adjacency list
    List<Integer>[] graph = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1];
        graph[u].add(v);
        graph[v].add(u);
    }

    boolean[] visited = new boolean[n];
    int[] count = new int[1];

    dfs(0, graph, restricted, visited, count);
    return count[0];
}

private void dfs(int node, List<Integer>[] graph, int[] restricted,
                 boolean[] visited, int[] count) {
    // Check if node is restricted - O(r) time
    for (int r : restricted) {
        if (node == r) {
            return;
        }
    }

    if (visited[node]) {
        return;
    }

    visited[node] = true;
    count[0]++;

    for (int neighbor : graph[node]) {
        dfs(neighbor, graph, restricted, visited, count);
    }
}
```

</div>

The brute force approach has O(n × r) time complexity because for each node we visit, we check if it's in the restricted list, which takes O(r) time. We need to optimize this.

## Optimized Approach

The key optimization is to use a hash set for the restricted nodes. This allows us to check if a node is restricted in O(1) time instead of O(r) time. Here's the step-by-step reasoning:

1. **Convert restricted array to a set**: This gives us O(1) lookup time to check if a node is restricted.
2. **Build adjacency list**: Since it's a tree with n-1 edges, we need to represent the graph efficiently.
3. **DFS/BFS from node 0**: Traverse the tree starting from node 0.
4. **Skip restricted nodes**: When we encounter a restricted node, we don't explore its neighbors.
5. **Count visited nodes**: Keep track of all nodes we can reach.

The critical insight is that restricted nodes act as barriers. When we encounter one, we treat it as if it has no connections (even though it physically does in the original tree). This effectively prunes the tree at restricted nodes.

## Optimal Solution

Here's the optimized solution using DFS with a hash set for restricted nodes:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def reachableNodes(n, edges, restricted):
    """
    Counts the number of reachable nodes starting from node 0
    without passing through any restricted nodes.

    Args:
        n: Total number of nodes
        edges: List of undirected edges
        restricted: List of restricted nodes

    Returns:
        Number of reachable nodes from node 0
    """
    # Step 1: Convert restricted list to a set for O(1) lookups
    restricted_set = set(restricted)

    # Step 2: Build adjacency list representation of the tree
    # Since it's a tree with n nodes, we have n-1 edges
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    # Step 3: Initialize visited array to avoid cycles
    # (Even though it's a tree, we're doing undirected traversal)
    visited = [False] * n

    # Step 4: DFS function to explore reachable nodes
    def dfs(node):
        # Base case: if node is restricted, don't explore further
        if node in restricted_set:
            return 0

        # Base case: if already visited, return 0
        if visited[node]:
            return 0

        # Mark current node as visited
        visited[node] = True

        # Start count with current node
        count = 1

        # Explore all neighbors
        for neighbor in graph[node]:
            count += dfs(neighbor)

        return count

    # Step 5: Start DFS from node 0 and return the count
    return dfs(0)
```

```javascript
// Time: O(n) | Space: O(n)
function reachableNodes(n, edges, restricted) {
  /**
   * Counts the number of reachable nodes starting from node 0
   * without passing through any restricted nodes.
   *
   * @param {number} n - Total number of nodes
   * @param {number[][]} edges - List of undirected edges
   * @param {number[]} restricted - List of restricted nodes
   * @return {number} - Number of reachable nodes from node 0
   */

  // Step 1: Convert restricted array to a Set for O(1) lookups
  const restrictedSet = new Set(restricted);

  // Step 2: Build adjacency list representation of the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 3: Initialize visited array to avoid cycles
  const visited = Array(n).fill(false);

  // Step 4: DFS function to explore reachable nodes
  function dfs(node) {
    // Base case: if node is restricted, don't explore further
    if (restrictedSet.has(node)) {
      return 0;
    }

    // Base case: if already visited, return 0
    if (visited[node]) {
      return 0;
    }

    // Mark current node as visited
    visited[node] = true;

    // Start count with current node
    let count = 1;

    // Explore all neighbors
    for (const neighbor of graph[node]) {
      count += dfs(neighbor);
    }

    return count;
  }

  // Step 5: Start DFS from node 0 and return the count
  return dfs(0);
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int reachableNodes(int n, int[][] edges, int[] restricted) {
        /**
         * Counts the number of reachable nodes starting from node 0
         * without passing through any restricted nodes.
         *
         * @param n - Total number of nodes
         * @param edges - Array of undirected edges
         * @param restricted - Array of restricted nodes
         * @return Number of reachable nodes from node 0
         */

        // Step 1: Convert restricted array to a Set for O(1) lookups
        Set<Integer> restrictedSet = new HashSet<>();
        for (int node : restricted) {
            restrictedSet.add(node);
        }

        // Step 2: Build adjacency list representation of the tree
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 3: Initialize visited array to avoid cycles
        boolean[] visited = new boolean[n];

        // Step 4: Start DFS from node 0
        return dfs(0, graph, restrictedSet, visited);
    }

    private int dfs(int node, List<Integer>[] graph,
                    Set<Integer> restrictedSet, boolean[] visited) {
        // Base case: if node is restricted, don't explore further
        if (restrictedSet.contains(node)) {
            return 0;
        }

        // Base case: if already visited, return 0
        if (visited[node]) {
            return 0;
        }

        // Mark current node as visited
        visited[node] = true;

        // Start count with current node
        int count = 1;

        // Explore all neighbors
        for (int neighbor : graph[node]) {
            count += dfs(neighbor, graph, restrictedSet, visited);
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list takes O(n) time (n-1 edges)
- Converting restricted array to a set takes O(r) time, where r ≤ n
- DFS traversal visits each node at most once, taking O(n) time
- Each edge is processed twice (once for each direction), but that's still O(n) since there are n-1 edges

**Space Complexity: O(n)**

- Adjacency list uses O(n) space (stores 2×(n-1) references)
- Restricted set uses O(r) space, where r ≤ n
- Visited array uses O(n) space
- Recursion stack in worst case could be O(n) for a skewed tree

## Common Mistakes

1. **Not using a hash set for restricted nodes**: The most common mistake is checking `if node in restricted` on an array/list, which takes O(r) time per check. This turns an O(n) solution into O(n × r).

2. **Forgetting that node 0 could be restricted**: Always check if the starting node is restricted. If node 0 is in the restricted list, the answer should be 0.

3. **Not marking nodes as visited**: Even though it's a tree, when doing undirected traversal, you need to mark nodes as visited to avoid infinite recursion. Without visited markers, you'll keep going back and forth between nodes.

4. **Counting restricted nodes in the result**: Make sure you stop counting when you hit a restricted node. Don't include restricted nodes in your final count, even if they're connected to reachable nodes.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph traversal with constraints**: Similar to "Open the Lock" where certain combinations are forbidden, or "Minimum Jumps to Reach Home" where certain positions are restricted.

2. **Component size calculation**: Finding the size of a connected component with constraints appears in problems like "Number of Provinces" or "Max Area of Island".

3. **Tree traversal with pruning**: This is essentially a DFS/BFS on a tree where certain branches are pruned based on constraints.

**Related problems:**

- **Open the Lock**: You have forbidden combinations that act like restricted nodes
- **Minimum Jumps to Reach Home**: Certain positions are forbidden (restricted)
- **Number of Provinces**: Finding connected components in a graph
- **Max Area of Island**: Finding the size of a connected component with constraints

## Key Takeaways

1. **Always optimize lookups with hash sets**: When you need to check membership frequently (like checking if a node is restricted), convert the list to a hash set for O(1) lookups.

2. **Tree problems often reduce to traversal**: Many tree problems are solved with DFS/BFS. The challenge is adding the right constraints and optimizations.

3. **Restricted nodes act as barriers**: In graph traversal problems, restricted/blocked nodes should stop further exploration. Think of them as dead ends that prune the search space.

4. **Start simple, then optimize**: First think about the brute force (traversal with array lookups), then identify the bottleneck (O(r) lookups), and finally optimize (use hash set).

Related problems: [Open the Lock](/problem/open-the-lock), [Minimum Jumps to Reach Home](/problem/minimum-jumps-to-reach-home)
