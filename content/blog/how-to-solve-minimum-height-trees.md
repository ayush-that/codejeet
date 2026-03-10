---
title: "How to Solve Minimum Height Trees — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Height Trees. Medium difficulty, 42.4% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort."
date: "2027-05-26"
category: "dsa-patterns"
tags:
  ["minimum-height-trees", "depth-first-search", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Minimum Height Trees

This problem asks us to find all "minimum height trees" — the nodes that, if chosen as the root, would minimize the height of the resulting rooted tree. The tricky part is that a brute force approach (trying every node as root) would be O(n²), which is too slow for n up to 2×10⁴. The interesting insight is that the solution involves thinking about the tree's "center" rather than calculating heights from every node.

## Visual Walkthrough

Let's trace through a simple example: n = 6, edges = [[0,1],[1,2],[1,3],[3,4],[3,5]]

```
    0
    |
    1
   / \
  2   3
     / \
    4   5
```

**Step 1 - Understanding the problem**: We want to find which nodes, when made the root, give us the shortest tree height. Let's think about extremes:

- If we root at node 2: height = 4 (2→1→0 and 2→1→3→4/5)
- If we root at node 1: height = 2 (1→0 and 1→3→4/5)
- If we root at node 3: height = 2 (3→1→0/2 and 3→4/5)

**Step 2 - Key observation**: The minimum height trees are actually the "center" nodes of the tree. In any tree, there can be at most 2 center nodes. We can find them by repeatedly removing leaves (nodes with degree 1) until we're left with 1 or 2 nodes.

**Step 3 - Applying leaf removal**:

1. Initial leaves: 0, 2, 4, 5 (degree 1)
2. Remove them: We're left with nodes 1 and 3
3. Now 1 and 3 become leaves (both have degree 1 to each other)
4. Remove them: We're left with nothing

The last nodes we had before running out are nodes 1 and 3 — these are our minimum height trees!

## Brute Force Approach

A naive approach would be to try every node as the root, calculate the tree height using BFS or DFS, and keep track of the minimum. Here's what that might look like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def findMinHeightTrees_brute(n, edges):
    if n == 1:
        return [0]

    # Build adjacency list
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    def bfs_height(start):
        """Calculate tree height when starting from 'start' node"""
        visited = [False] * n
        queue = deque([start])
        visited[start] = True
        height = 0

        while queue:
            level_size = len(queue)
            for _ in range(level_size):
                node = queue.popleft()
                for neighbor in adj[node]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        queue.append(neighbor)
            height += 1

        return height

    min_height = float('inf')
    result = []

    for i in range(n):
        height = bfs_height(i)
        if height < min_height:
            min_height = height
            result = [i]
        elif height == min_height:
            result.append(i)

    return result
```

```javascript
// Time: O(n²) | Space: O(n)
function findMinHeightTreesBrute(n, edges) {
  if (n === 1) return [0];

  // Build adjacency list
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  function bfsHeight(start) {
    const visited = new Array(n).fill(false);
    const queue = [start];
    visited[start] = true;
    let height = 0;

    while (queue.length > 0) {
      const levelSize = queue.length;
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        for (const neighbor of adj[node]) {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
          }
        }
      }
      height++;
    }

    return height;
  }

  let minHeight = Infinity;
  let result = [];

  for (let i = 0; i < n; i++) {
    const height = bfsHeight(i);
    if (height < minHeight) {
      minHeight = height;
      result = [i];
    } else if (height === minHeight) {
      result.push(i);
    }
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(n)
public List<Integer> findMinHeightTreesBrute(int n, int[][] edges) {
    if (n == 1) return Arrays.asList(0);

    // Build adjacency list
    List<Integer>[] adj = new ArrayList[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] edge : edges) {
        int u = edge[0], v = edge[1];
        adj[u].add(v);
        adj[v].add(u);
    }

    int minHeight = Integer.MAX_VALUE;
    List<Integer> result = new ArrayList<>();

    for (int i = 0; i < n; i++) {
        int height = bfsHeight(i, adj, n);
        if (height < minHeight) {
            minHeight = height;
            result.clear();
            result.add(i);
        } else if (height == minHeight) {
            result.add(i);
        }
    }

    return result;
}

private int bfsHeight(int start, List<Integer>[] adj, int n) {
    boolean[] visited = new boolean[n];
    Queue<Integer> queue = new LinkedList<>();
    queue.offer(start);
    visited[start] = true;
    int height = 0;

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        for (int i = 0; i < levelSize; i++) {
            int node = queue.poll();
            for (int neighbor : adj[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
        height++;
    }

    return height;
}
```

</div>

**Why this is insufficient**: For n = 2×10⁴, O(n²) is 400 million operations — far too slow. We need an O(n) solution.

## Optimized Approach

The key insight is that the minimum height trees correspond to the **center(s)** of the tree. In any tree:

1. A tree can have at most 2 centers
2. The centers are the middle nodes of the longest path (diameter) in the tree
3. We can find centers by repeatedly removing leaves until 1 or 2 nodes remain

**Step-by-step reasoning**:

1. **Build the graph**: Create an adjacency list representation
2. **Find initial leaves**: Nodes with degree 1 (only one neighbor)
3. **Iterative removal**:
   - Remove all current leaves from consideration
   - Decrease the degree of their neighbors
   - If any neighbor becomes a leaf (degree 1), add it to the next batch
4. **Stop condition**: When we have 1 or 2 nodes left
5. **Why this works**: Each iteration "peels" one layer from the tree. The last nodes remaining are the centers.

Think of it like peeling an onion: the outer layers (leaves) come off first, and what's left at the core are the minimum height roots.

## Optimal Solution

Here's the topological sort approach that implements the leaf removal strategy:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findMinHeightTrees(n, edges):
    """
    Find all minimum height trees in an undirected tree graph.
    Uses topological sort (leaf removal) to find the center nodes.
    """
    # Edge case: single node tree
    if n == 1:
        return [0]

    # Step 1: Build adjacency list and calculate initial degrees
    adj = [[] for _ in range(n)]
    degree = [0] * n

    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
        degree[u] += 1
        degree[v] += 1

    # Step 2: Initialize queue with all leaves (nodes with degree 1)
    leaves = deque()
    for i in range(n):
        if degree[i] == 1:
            leaves.append(i)

    # Step 3: Remove leaves layer by layer until 1 or 2 nodes remain
    remaining_nodes = n
    while remaining_nodes > 2:
        # Number of leaves in current layer
        leaves_count = len(leaves)
        remaining_nodes -= leaves_count

        # Process all leaves in current layer
        for _ in range(leaves_count):
            leaf = leaves.popleft()

            # For each neighbor of the leaf
            for neighbor in adj[leaf]:
                # Decrease neighbor's degree
                degree[neighbor] -= 1
                # If neighbor becomes a leaf, add to next layer
                if degree[neighbor] == 1:
                    leaves.append(neighbor)

    # Step 4: Remaining nodes are the centers (minimum height trees)
    return list(leaves)
```

```javascript
// Time: O(n) | Space: O(n)
function findMinHeightTrees(n, edges) {
  /**
   * Find all minimum height trees in an undirected tree graph.
   * Uses topological sort (leaf removal) to find the center nodes.
   */
  // Edge case: single node tree
  if (n === 1) return [0];

  // Step 1: Build adjacency list and calculate initial degrees
  const adj = Array.from({ length: n }, () => []);
  const degree = new Array(n).fill(0);

  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
    degree[u]++;
    degree[v]++;
  }

  // Step 2: Initialize queue with all leaves (nodes with degree 1)
  let leaves = [];
  for (let i = 0; i < n; i++) {
    if (degree[i] === 1) {
      leaves.push(i);
    }
  }

  // Step 3: Remove leaves layer by layer until 1 or 2 nodes remain
  let remainingNodes = n;
  while (remainingNodes > 2) {
    // Number of leaves in current layer
    const leavesCount = leaves.length;
    remainingNodes -= leavesCount;

    // Process all leaves in current layer
    const newLeaves = [];
    for (let i = 0; i < leavesCount; i++) {
      const leaf = leaves[i];

      // For each neighbor of the leaf
      for (const neighbor of adj[leaf]) {
        // Decrease neighbor's degree
        degree[neighbor]--;
        // If neighbor becomes a leaf, add to next layer
        if (degree[neighbor] === 1) {
          newLeaves.push(neighbor);
        }
      }
    }

    // Update leaves for next iteration
    leaves = newLeaves;
  }

  // Step 4: Remaining nodes are the centers (minimum height trees)
  return leaves;
}
```

```java
// Time: O(n) | Space: O(n)
public List<Integer> findMinHeightTrees(int n, int[][] edges) {
    /**
     * Find all minimum height trees in an undirected tree graph.
     * Uses topological sort (leaf removal) to find the center nodes.
     */
    // Edge case: single node tree
    if (n == 1) return Collections.singletonList(0);

    // Step 1: Build adjacency list and calculate initial degrees
    List<Integer>[] adj = new ArrayList[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    int[] degree = new int[n];

    for (int[] edge : edges) {
        int u = edge[0], v = edge[1];
        adj[u].add(v);
        adj[v].add(u);
        degree[u]++;
        degree[v]++;
    }

    // Step 2: Initialize queue with all leaves (nodes with degree 1)
    Queue<Integer> leaves = new LinkedList<>();
    for (int i = 0; i < n; i++) {
        if (degree[i] == 1) {
            leaves.offer(i);
        }
    }

    // Step 3: Remove leaves layer by layer until 1 or 2 nodes remain
    int remainingNodes = n;
    while (remainingNodes > 2) {
        // Number of leaves in current layer
        int leavesCount = leaves.size();
        remainingNodes -= leavesCount;

        // Process all leaves in current layer
        for (int i = 0; i < leavesCount; i++) {
            int leaf = leaves.poll();

            // For each neighbor of the leaf
            for (int neighbor : adj[leaf]) {
                // Decrease neighbor's degree
                degree[neighbor]--;
                // If neighbor becomes a leaf, add to next layer
                if (degree[neighbor] == 1) {
                    leaves.offer(neighbor);
                }
            }
        }
    }

    // Step 4: Remaining nodes are the centers (minimum height trees)
    return new ArrayList<>(leaves);
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- Building the adjacency list: O(n) since there are n-1 edges
- Initial leaf identification: O(n)
- Leaf removal process: Each edge is processed at most twice (once from each endpoint), so O(n) total

**Space Complexity**: O(n)

- Adjacency list: O(n) to store all edges
- Degree array: O(n)
- Queue: O(n) in worst case (when all nodes are leaves in a star graph)

## Common Mistakes

1. **Forgetting the n=1 edge case**: When n=1, edges is empty, but we should return [0]. Many candidates return [] by mistake.
2. **Not updating degrees correctly**: When removing a leaf, you must decrement the degree of ALL its neighbors, not just one. Missing this causes incorrect leaf detection in later iterations.

3. **Using DFS to find diameter then centers**: While correct in theory, implementing the "find diameter then take middle" approach is more complex and error-prone. The leaf removal approach is simpler and less buggy.

4. **Not processing leaves layer by layer**: Candidates sometimes remove leaves one at a time instead of processing all leaves in the current layer together. This can lead to incorrect results because nodes might become leaves during the same iteration.

## When You'll See This Pattern

This "leaf removal" or "topological sort on trees" pattern appears in several graph problems:

1. **Course Schedule (Medium)**: Uses topological sort on a directed graph to detect cycles and find valid course order. While directed, the concept of processing nodes with zero (or minimal) dependencies is similar.

2. **Course Schedule II (Medium)**: Extension of Course Schedule that returns the actual ordering. Same topological sort approach.

3. **Collect Coins in a Tree (Hard)**: A more complex tree problem where you need to prune leaves iteratively based on certain conditions. The leaf removal strategy is central to the solution.

The pattern is: when you need to process a tree from the outside in, or find central nodes, think about iterative leaf removal.

## Key Takeaways

1. **Trees have at most 2 centers**: This is a fundamental property of trees that simplifies many problems. The centers are the minimum height trees.

2. **Leaf removal is topological sort for trees**: Just as topological sort processes nodes with no dependencies in DAGs, leaf removal processes nodes with degree 1 in trees. Both work by iteratively removing "boundary" elements.

3. **Think about the problem structure**: Instead of brute force (calculate height from every node), recognize that the solution relates to the tree's global structure (its center). This shift from local to global thinking is key for optimization.

Related problems: [Course Schedule](/problem/course-schedule), [Course Schedule II](/problem/course-schedule-ii), [Collect Coins in a Tree](/problem/collect-coins-in-a-tree)
