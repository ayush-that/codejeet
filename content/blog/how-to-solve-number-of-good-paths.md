---
title: "How to Solve Number of Good Paths — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Good Paths. Hard difficulty, 56.3% acceptance rate. Topics: Array, Hash Table, Tree, Union-Find, Graph Theory."
date: "2028-03-16"
category: "dsa-patterns"
tags: ["number-of-good-paths", "array", "hash-table", "tree", "hard"]
---

# How to Solve Number of Good Paths

This problem asks us to count "good paths" in a tree where a path is "good" if both endpoints have the same value, and that value is the maximum value along the entire path. The challenge lies in efficiently counting these paths without checking all possible node pairs, which would be prohibitively slow for large trees.

What makes this problem interesting is that it combines tree traversal with union-find in a clever way: instead of starting from nodes and exploring paths, we process nodes in increasing order of value and use union-find to connect components as we go. This allows us to count paths for each value independently while ensuring we only consider paths where that value is the maximum.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
vals = [1, 3, 2, 1, 3]
edges = [[0,1],[0,2],[2,3],[2,4]]
```

We have 5 nodes with values shown. The tree structure looks like:

```
    1 (val=3)
    |
    0 (val=1)
    |
    2 (val=2)
   / \
  3   4
 (1) (3)
```

**Step-by-step reasoning:**

1. A "good path" requires both endpoints to have the same value, and that value must be the maximum along the path.
2. For value 1: Nodes 0 and 3 have value 1. Path 0-2-3 has maximum value 2 (at node 2), so it's not good. Path 0-1 has maximum 3, so not good. No path between 0 and 3 where 1 is the maximum. So only single-node paths: [0], [3] → 2 paths.
3. For value 2: Only node 2 has value 2. Single-node path: [2] → 1 path.
4. For value 3: Nodes 1 and 4 have value 3. Path 1-0-2-4 has nodes with values [3,1,2,3]. The maximum is 3, and both endpoints are 3 → good path! Plus single-node paths: [1], [4] → 3 paths total.

Total good paths: 2 + 1 + 3 = 6.

The key insight: For each value, we only care about paths where all intermediate nodes have values ≤ that value. This suggests processing nodes in increasing order of value.

## Brute Force Approach

A naive approach would check all possible pairs of nodes:

1. For each pair of nodes (i, j), find the path between them (using BFS/DFS since it's a tree).
2. Check if vals[i] == vals[j] and if this value equals the maximum value along the path.
3. Count all such pairs.

**Why this fails:**

- There are O(n²) pairs of nodes in a tree with n nodes.
- Finding the path between two nodes takes O(n) time with BFS/DFS.
- Total time: O(n³) → far too slow for n up to 3×10⁴.

Even with optimizations like precomputing all-pairs maximums using tree DP, we'd still have O(n²) time and space, which is too much.

## Optimized Approach

The key insight is to process nodes in increasing order of value and use union-find (disjoint set union):

1. **Sort nodes by value**: We process nodes from smallest to largest value.
2. **Union-Find with component tracking**: For each value group, we connect all nodes with that value to their neighbors that have already been processed (neighbors with values ≤ current value).
3. **Count paths within components**: When we process all nodes of a particular value, within each connected component formed so far, if there are k nodes with the current value, they can form C(k,2) + k = k\*(k+1)/2 good paths (pairs + single nodes).
4. **Why this works**: By processing in increasing order, when we connect nodes of value v, all nodes in the component have values ≤ v. So any path between two nodes with value v within the component will have v as the maximum value.

**Step-by-step algorithm:**

1. Build adjacency list for the tree.
2. Sort node indices by their values.
3. Initialize union-find structure.
4. For each unique value in sorted order:
   - Process all nodes with this value: union each node with its neighbors that have values ≤ current value.
   - After processing all nodes of this value, count how many nodes of this value are in each component.
   - Add count\*(count+1)/2 for each component to the total.
5. Return total count.

## Optimal Solution

Here's the complete implementation using union-find with path compression and union by size:

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n α(n)) for union-find ≈ O(n log n)
# Space: O(n) for adjacency list, parent, size arrays, and value groups
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n  # Track component size for union by size

    def find(self, x):
        # Path compression: make parent of x point to root
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by size: attach smaller tree under larger tree
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return

        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x

        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]

class Solution:
    def numberOfGoodPaths(self, vals: List[int], edges: List[List[int]]) -> int:
        n = len(vals)

        # Step 1: Build adjacency list for the tree
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        # Step 2: Group nodes by their values and sort by value
        # We'll process nodes from smallest to largest value
        value_to_nodes = {}
        for i, val in enumerate(vals):
            if val not in value_to_nodes:
                value_to_nodes[val] = []
            value_to_nodes[val].append(i)

        # Get sorted unique values
        sorted_values = sorted(value_to_nodes.keys())

        # Step 3: Initialize union-find
        uf = UnionFind(n)

        # Step 4: Process nodes in increasing order of value
        good_paths = 0

        for val in sorted_values:
            nodes_with_val = value_to_nodes[val]

            # First, connect each node with this value to its neighbors
            # that have values <= current value
            for node in nodes_with_val:
                for neighbor in adj[node]:
                    # Only union if neighbor's value <= current value
                    # (neighbors with larger values will be processed later)
                    if vals[neighbor] <= val:
                        uf.union(node, neighbor)

            # After connecting, count how many nodes with current value
            # are in each connected component
            component_count = {}
            for node in nodes_with_val:
                root = uf.find(node)
                component_count[root] = component_count.get(root, 0) + 1

            # For each component, if it has k nodes with current value,
            # they form k*(k+1)/2 good paths (pairs + single nodes)
            for count in component_count.values():
                good_paths += count * (count + 1) // 2

        return good_paths
```

```javascript
// Time: O(n log n) for sorting + O(n α(n)) for union-find ≈ O(n log n)
// Space: O(n) for adjacency list, parent, size arrays, and value groups
class UnionFind {
  constructor(n) {
    this.parent = new Array(n);
    this.size = new Array(n);

    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
  }

  find(x) {
    // Path compression: make parent of x point to root
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by size: attach smaller tree under larger tree
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.size[rootX] < this.size[rootY]) {
      [rootX, rootY] = [rootY, rootX];
    }

    this.parent[rootY] = rootX;
    this.size[rootX] += this.size[rootY];
  }
}

/**
 * @param {number[]} vals
 * @param {number[][]} edges
 * @return {number}
 */
var numberOfGoodPaths = function (vals, edges) {
  const n = vals.length;

  // Step 1: Build adjacency list for the tree
  const adj = new Array(n);
  for (let i = 0; i < n; i++) adj[i] = [];

  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // Step 2: Group nodes by their values
  const valueToNodes = new Map();
  for (let i = 0; i < n; i++) {
    const val = vals[i];
    if (!valueToNodes.has(val)) {
      valueToNodes.set(val, []);
    }
    valueToNodes.get(val).push(i);
  }

  // Get sorted unique values
  const sortedValues = Array.from(valueToNodes.keys()).sort((a, b) => a - b);

  // Step 3: Initialize union-find
  const uf = new UnionFind(n);

  // Step 4: Process nodes in increasing order of value
  let goodPaths = 0;

  for (const val of sortedValues) {
    const nodesWithVal = valueToNodes.get(val);

    // First, connect each node with this value to its neighbors
    // that have values <= current value
    for (const node of nodesWithVal) {
      for (const neighbor of adj[node]) {
        // Only union if neighbor's value <= current value
        if (vals[neighbor] <= val) {
          uf.union(node, neighbor);
        }
      }
    }

    // After connecting, count how many nodes with current value
    // are in each connected component
    const componentCount = new Map();
    for (const node of nodesWithVal) {
      const root = uf.find(node);
      componentCount.set(root, (componentCount.get(root) || 0) + 1);
    }

    // For each component, if it has k nodes with current value,
    // they form k*(k+1)/2 good paths (pairs + single nodes)
    for (const count of componentCount.values()) {
      goodPaths += (count * (count + 1)) / 2;
    }
  }

  return goodPaths;
};
```

```java
// Time: O(n log n) for sorting + O(n α(n)) for union-find ≈ O(n log n)
// Space: O(n) for adjacency list, parent, size arrays, and value groups
class UnionFind {
    private int[] parent;
    private int[] size;

    public UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    public int find(int x) {
        // Path compression: make parent of x point to root
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union by size: attach smaller tree under larger tree
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        if (size[rootX] < size[rootY]) {
            int temp = rootX;
            rootX = rootY;
            rootY = temp;
        }

        parent[rootY] = rootX;
        size[rootX] += size[rootY];
    }
}

class Solution {
    public int numberOfGoodPaths(int[] vals, int[][] edges) {
        int n = vals.length;

        // Step 1: Build adjacency list for the tree
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].add(v);
            adj[v].add(u);
        }

        // Step 2: Group nodes by their values
        TreeMap<Integer, List<Integer>> valueToNodes = new TreeMap<>();
        for (int i = 0; i < n; i++) {
            valueToNodes.computeIfAbsent(vals[i], k -> new ArrayList<>()).add(i);
        }

        // Step 3: Initialize union-find
        UnionFind uf = new UnionFind(n);

        // Step 4: Process nodes in increasing order of value
        int goodPaths = 0;

        for (Map.Entry<Integer, List<Integer>> entry : valueToNodes.entrySet()) {
            int val = entry.getKey();
            List<Integer> nodesWithVal = entry.getValue();

            // First, connect each node with this value to its neighbors
            // that have values <= current value
            for (int node : nodesWithVal) {
                for (int neighbor : adj[node]) {
                    // Only union if neighbor's value <= current value
                    if (vals[neighbor] <= val) {
                        uf.union(node, neighbor);
                    }
                }
            }

            // After connecting, count how many nodes with current value
            // are in each connected component
            Map<Integer, Integer> componentCount = new HashMap<>();
            for (int node : nodesWithVal) {
                int root = uf.find(node);
                componentCount.put(root, componentCount.getOrDefault(root, 0) + 1);
            }

            // For each component, if it has k nodes with current value,
            // they form k*(k+1)/2 good paths (pairs + single nodes)
            for (int count : componentCount.values()) {
                goodPaths += count * (count + 1) / 2;
            }
        }

        return goodPaths;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting unique values: O(n log n) in worst case (all values distinct)
- Building adjacency list: O(n)
- Union-find operations: O(n α(n)) where α(n) is the inverse Ackermann function (effectively constant)
- Processing each node and its neighbors: O(n) total since each edge is considered at most twice
- Dominated by the sorting step: O(n log n)

**Space Complexity:** O(n)

- Adjacency list: O(n)
- Union-find arrays: O(n)
- Value-to-nodes mapping: O(n)
- Component count map: O(n) in worst case

## Common Mistakes

1. **Processing nodes in wrong order**: If you process nodes in arbitrary order or decreasing order, you might connect nodes through paths with larger values, violating the "maximum value" condition. Always process in increasing order.

2. **Forgetting single-node paths**: Each node by itself is a valid path (length 0). Remember to add k for k nodes with the same value, not just C(k,2) pairs.

3. **Not using union by size/path compression**: A naive union-find implementation without optimizations can degrade to O(n²) time. Always implement both path compression and union by size/rank.

4. **Counting paths before connecting all nodes of same value**: You must first union all nodes of the current value with eligible neighbors, THEN count within components. Counting before connecting misses paths that go through newly connected components.

## When You'll See This Pattern

This "process in sorted order + union-find" pattern appears in problems where:

1. You need to consider elements in some order (increasing/decreasing)
2. Connectivity changes as you process elements
3. You need to answer queries about components or count things within components

**Related LeetCode problems:**

1. **Checking Existence of Edge Length Limited Paths (Hard)**: Similar pattern of sorting queries by limit and adding edges as they become valid.
2. **Swim in Rising Water (Hard)**: Process cells in increasing order of height, using union-find to connect when water level rises.
3. **Connecting Cities With Minimum Cost (Medium)**: Kruskal's algorithm uses the same "sort edges + union-find" pattern.

## Key Takeaways

1. **When you need to ensure a property holds along an entire path** (like "value is maximum"), consider processing elements in sorted order and using union-find to maintain connectivity under constraints.

2. **Union-find isn't just for MSTs**: It's a powerful tool for dynamically maintaining connectivity while processing elements in a specific order. The "sort + union-find" pattern is worth memorizing.

3. **Break problems by value groups**: When a problem involves nodes/edges with values and constraints on those values, grouping by value and processing in order often leads to efficient solutions.

Related problems: [Checking Existence of Edge Length Limited Paths](/problem/checking-existence-of-edge-length-limited-paths), [Checking Existence of Edge Length Limited Paths II](/problem/checking-existence-of-edge-length-limited-paths-ii), [Longest Nice Substring](/problem/longest-nice-substring)
