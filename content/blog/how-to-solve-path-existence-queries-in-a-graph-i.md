---
title: "How to Solve Path Existence Queries in a Graph I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Path Existence Queries in a Graph I. Medium difficulty, 55.3% acceptance rate. Topics: Array, Hash Table, Binary Search, Union-Find, Graph Theory."
date: "2029-10-08"
category: "dsa-patterns"
tags: ["path-existence-queries-in-a-graph-i", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Path Existence Queries in a Graph I

This problem asks us to determine if there exists a path between two nodes in a graph where edges exist only between nodes whose values differ by at most `maxDiff`. The tricky part is that we're not given an adjacency list upfront—we need to dynamically determine which edges exist based on the sorted node values, then answer multiple queries efficiently.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `n = 5`
- `nums = [1, 3, 5, 7, 9]`
- `maxDiff = 2`
- `queries = [[0,4], [1,2], [2,3]]`

**Step 1: Understanding the graph structure**
Nodes are labeled 0-4 with values [1,3,5,7,9]. An edge exists between nodes i and j if |nums[i] - nums[j]| ≤ maxDiff (2).

Let's check all possible edges:

- Node 0 (value 1): Can connect to node 1 (|1-3|=2) and node 2 (|1-5|=4>2)
- Node 1 (value 3): Can connect to nodes 0, 2 (|3-5|=2), and 3 (|3-7|=4>2)
- Node 2 (value 5): Can connect to nodes 1, 3 (|5-7|=2), and 4 (|5-9|=4>2)
- Node 3 (value 7): Can connect to nodes 2, 4 (|7-9|=2)
- Node 4 (value 9): Can connect to node 3

So our graph looks like: 0-1-2-3-4 (a chain).

**Step 2: Answering queries**

- Query [0,4]: Is there a path from 0 to 4? Yes, through 0→1→2→3→4
- Query [1,2]: Is there a path from 1 to 2? Yes, directly connected
- Query [2,3]: Is there a path from 2 to 3? Yes, directly connected

The answer would be [true, true, true].

The key insight: Since `nums` is sorted, nodes with close values are adjacent in the sorted order. If we think of the graph as having edges between "neighbors" in value space, connectivity forms contiguous segments.

## Brute Force Approach

A naive approach would be:

1. Build the complete adjacency list by checking all O(n²) pairs
2. Run BFS/DFS for each query to check connectivity

**Why this fails:**

- Building the graph takes O(n²) time
- Each query takes O(n + e) time with BFS/DFS
- With up to 10⁵ nodes and 10⁵ queries, this is impossibly slow (potentially 10¹⁰ operations)

Even a slightly better approach of building edges only between nodes within `maxDiff` value difference still requires checking many pairs and running expensive graph traversals for each query.

## Optimized Approach

The key insight comes from recognizing that:

1. Since `nums` is sorted, if |nums[i] - nums[j]| ≤ maxDiff, then all nodes between i and j in the sorted order are also within `maxDiff` of each other
2. This creates **contiguous connected components** in the sorted order
3. Two nodes are connected if and only if they belong to the same contiguous segment where adjacent nodes differ by ≤ maxDiff

**Step-by-step reasoning:**

1. Traverse the sorted nodes from left to right
2. Start a new component when we find a gap > maxDiff between consecutive nodes
3. All nodes in the same component are mutually reachable
4. For each query [u, v], check if both nodes belong to the same component

**Why this works:**

- If nodes are in the same contiguous segment, we can travel from any node to any other by stepping through intermediate nodes (each step is ≤ maxDiff)
- If nodes are in different segments, there's no path because you'd need to cross a gap > maxDiff somewhere

**Alternative approach using Union-Find:**
We can also solve this with Union-Find (Disjoint Set Union):

1. Iterate through the sorted nodes
2. For each node, check if it can connect to the previous node (difference ≤ maxDiff)
3. If yes, union the two nodes
4. For each query, check if the two nodes have the same root

Union-Find is particularly elegant here because it naturally handles the dynamic connectivity as we process nodes in sorted order.

## Optimal Solution

Here's the Union-Find implementation that efficiently solves this problem:

<div class="code-group">

```python
# Time: O(n * α(n) + q * α(n)) where α is inverse Ackermann (effectively constant)
# Space: O(n) for Union-Find arrays
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression: make parent point directly to root
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank: attach smaller tree under larger tree
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

class Solution:
    def distanceLimitedPathsExist(self, n: int, nums: List[int], maxDiff: int, queries: List[List[int]]) -> List[bool]:
        # Step 1: Create list of (value, index) pairs and sort by value
        nodes = [(nums[i], i) for i in range(n)]
        nodes.sort()  # Sort by value

        # Step 2: Initialize Union-Find
        uf = UnionFind(n)

        # Step 3: Connect nodes that are within maxDiff
        # Since nodes are sorted by value, we only need to check consecutive pairs
        for i in range(1, n):
            # If current node and previous node are within maxDiff, connect them
            if nodes[i][0] - nodes[i-1][0] <= maxDiff:
                uf.union(nodes[i][1], nodes[i-1][1])

        # Step 4: Answer queries by checking if nodes are in same component
        result = []
        for u, v in queries:
            result.append(uf.find(u) == uf.find(v))

        return result
```

```javascript
// Time: O(n * α(n) + q * α(n)) where α is inverse Ackermann (effectively constant)
// Space: O(n) for Union-Find arrays
class UnionFind {
  constructor(n) {
    this.parent = new Array(n);
    this.rank = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }

  find(x) {
    // Path compression: make parent point directly to root
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank: attach smaller tree under larger tree
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
  }
}

/**
 * @param {number} n
 * @param {number[]} nums
 * @param {number} maxDiff
 * @param {number[][]} queries
 * @return {boolean[]}
 */
var distanceLimitedPathsExist = function (n, nums, maxDiff, queries) {
  // Step 1: Create array of [value, index] pairs and sort by value
  const nodes = nums.map((value, index) => [value, index]);
  nodes.sort((a, b) => a[0] - b[0]);

  // Step 2: Initialize Union-Find
  const uf = new UnionFind(n);

  // Step 3: Connect nodes that are within maxDiff
  // Since nodes are sorted by value, we only need to check consecutive pairs
  for (let i = 1; i < n; i++) {
    // If current node and previous node are within maxDiff, connect them
    if (nodes[i][0] - nodes[i - 1][0] <= maxDiff) {
      uf.union(nodes[i][1], nodes[i - 1][1]);
    }
  }

  // Step 4: Answer queries by checking if nodes are in same component
  const result = [];
  for (const [u, v] of queries) {
    result.push(uf.find(u) === uf.find(v));
  }

  return result;
};
```

```java
// Time: O(n * α(n) + q * α(n)) where α is inverse Ackermann (effectively constant)
// Space: O(n) for Union-Find arrays
class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression: make parent point directly to root
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union by rank: attach smaller tree under larger tree
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
}

class Solution {
    public boolean[] distanceLimitedPathsExist(int n, int[] nums, int maxDiff, int[][] queries) {
        // Step 1: Create array of [value, index] pairs and sort by value
        int[][] nodes = new int[n][2];
        for (int i = 0; i < n; i++) {
            nodes[i][0] = nums[i];
            nodes[i][1] = i;
        }
        Arrays.sort(nodes, (a, b) -> Integer.compare(a[0], b[0]));

        // Step 2: Initialize Union-Find
        UnionFind uf = new UnionFind(n);

        // Step 3: Connect nodes that are within maxDiff
        // Since nodes are sorted by value, we only need to check consecutive pairs
        for (int i = 1; i < n; i++) {
            // If current node and previous node are within maxDiff, connect them
            if (nodes[i][0] - nodes[i-1][0] <= maxDiff) {
                uf.union(nodes[i][1], nodes[i-1][1]);
            }
        }

        // Step 4: Answer queries by checking if nodes are in same component
        boolean[] result = new boolean[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int u = queries[i][0];
            int v = queries[i][1];
            result[i] = uf.find(u) == uf.find(v);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting nodes: O(n log n)
- Union-Find operations: O(n × α(n)) for building components + O(q × α(n)) for queries, where α(n) is the inverse Ackermann function (effectively constant)
- Overall: O(n log n + (n + q) × α(n)) ≈ O(n log n + q) for practical purposes

**Space Complexity:**

- Storing nodes with indices: O(n)
- Union-Find arrays: O(n)
- Result array: O(q)
- Overall: O(n + q)

The O(n log n) sorting step dominates for large n, but this is optimal since we need to process nodes in sorted order to efficiently find contiguous components.

## Common Mistakes

1. **Not leveraging sorted property**: Some candidates try to check all O(n²) pairs instead of only consecutive pairs in sorted order. Remember: if |a-b| ≤ maxDiff and |b-c| ≤ maxDiff, then |a-c| ≤ 2×maxDiff, but not necessarily ≤ maxDiff. However, in a sorted list, connectivity forms transitive chains.

2. **Confusing node indices with values**: The problem uses node indices (0 to n-1) for queries, but we need to sort by node values. Always store the original index alongside the value when sorting.

3. **Using BFS/DFS for each query**: Even with precomputed components, some candidates run BFS/DFS for each query. Union-Find or component labeling allows O(α(n)) per query instead of O(n).

4. **Off-by-one with maxDiff comparison**: The condition is |nums[i] - nums[j]| ≤ maxDiff (≤ not <). Using < instead of ≤ will miss connections where values differ exactly by maxDiff.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Union-Find for dynamic connectivity**: Problems where you need to answer connectivity queries after building connections incrementally.
   - Related: LeetCode 547 "Number of Provinces", 684 "Redundant Connection", 1319 "Number of Operations to Make Network Connected"

2. **Processing sorted arrays to find contiguous segments**: When a condition depends on relative ordering, sorting often reveals structure.
   - Related: LeetCode 56 "Merge Intervals", 128 "Longest Consecutive Sequence"

3. **Graph connectivity with edge constraints**: Problems where edges exist based on some property between nodes.
   - Related: LeetCode 1631 "Path With Minimum Effort", 778 "Swim in Rising Water"

## Key Takeaways

1. **When you see "connected if condition holds between values" and the values are sortable, think about contiguous segments in sorted order.** Connectivity often forms transitive chains through sorted neighbors.

2. **Union-Find is ideal for batched connectivity queries** where you build the graph once then answer many queries. It's more efficient than running BFS/DFS for each query.

3. **Always consider what information sorting gives you.** Many graph problems become simpler when you process nodes in a meaningful order (by value, by weight, etc.).

[Practice this problem on CodeJeet](/problem/path-existence-queries-in-a-graph-i)
