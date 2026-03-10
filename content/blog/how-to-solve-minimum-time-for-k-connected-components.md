---
title: "How to Solve Minimum Time for K Connected Components — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Time for K Connected Components. Medium difficulty, 45.2% acceptance rate. Topics: Binary Search, Union-Find, Graph Theory, Sorting."
date: "2030-01-18"
category: "dsa-patterns"
tags:
  [
    "minimum-time-for-k-connected-components",
    "binary-search",
    "union-find",
    "graph-theory",
    "medium",
  ]
---

# How to Solve Minimum Time for K Connected Components

You're given a graph with `n` nodes and edges that can be removed at specific times. Your task is to find the earliest time when the graph has exactly `k` connected components. The challenge lies in efficiently determining when the graph transitions between different numbers of components as edges are removed over time.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 4
- edges = [[0,1,1], [1,2,2], [2,3,3], [0,3,4]]
- k = 2

**Initial state (time = 0):** All edges are present. The graph has 1 connected component (all nodes connected).

**Time = 1:** Edge [0,1] is removed. The graph now has 2 components: {0,3} and {1,2}. We've reached k=2 components! But wait, we need to check if this is the earliest time.

**Time = 2:** Edge [1,2] is removed. Now we have 3 components: {0,3}, {1}, {2}. This is more than k=2.

**Time = 3:** Edge [2,3] is removed. Now we have 4 components: {0}, {1}, {2}, {3}. Still more than k=2.

**Time = 4:** Edge [0,3] is removed. Now we have 4 components: {0}, {1}, {2}, {3}.

The earliest time when we have exactly k=2 components is time = 1.

But here's the key insight: We need to find the **maximum** time such that the graph has **at least** k components. Why? Because as time increases, more edges are removed, creating more components. We want the last moment before we exceed k components.

## Brute Force Approach

A naive approach would be to simulate the edge removal process at each distinct time:

1. Sort edges by removal time
2. For each unique time t:
   - Remove all edges with removal time ≤ t
   - Count connected components using BFS/DFS
   - If we have exactly k components, return t

**Why this fails:**

- There could be up to O(m) distinct times (where m = number of edges)
- Each BFS/DFS takes O(n + m) time
- Total complexity: O(m × (n + m)) which is O(m²) in worst case
- For n,m up to 10⁵, this is far too slow (10¹⁰ operations)

The brute force approach doesn't scale because we're doing expensive graph traversal for every possible time.

## Optimized Approach

The key insight is that we can use **binary search** on the answer combined with **Union-Find (Disjoint Set Union)**:

1. **Observation:** As time increases, more edges are removed, so the number of connected components increases (or stays the same). This monotonic property makes binary search applicable.

2. **Binary Search:** We search for the maximum time where the graph has at least k components. At time t, we consider all edges with removal time > t to be present (since they haven't been removed yet).

3. **Union-Find:** To efficiently count components at time t, we:
   - Start with n components (each node isolated)
   - Union nodes connected by edges with removal time > t
   - Count remaining components

4. **Why this works:** If at time t we have ≥ k components, then at earlier times we'll have even fewer components (since fewer edges are removed). If at time t we have < k components, we need to remove more edges (increase time).

**Step-by-step reasoning:**

1. Sort edges by removal time in descending order (we'll process edges that stay connected longer first)
2. Binary search on time from 0 to max_time
3. For each candidate time `mid`:
   - Use Union-Find to connect nodes with edges having removal time > mid
   - Count components in the resulting graph
   - If components ≥ k: search right half (try larger time)
   - If components < k: search left half (try smaller time)

## Optimal Solution

Here's the complete solution using binary search with Union-Find:

<div class="code-group">

```python
# Time: O(m * α(n) * log(max_time)) where α is inverse Ackermann (near constant)
# Space: O(n + m) for Union-Find and edge storage
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n  # Track number of components

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
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

        self.components -= 1  # Merging reduces components by 1
        return True

def minTimeForKComponents(n, edges, k):
    if k == n:
        return 0  # All nodes isolated from start

    # Sort edges by removal time in descending order
    # We'll process edges that stay connected longer first
    edges.sort(key=lambda x: -x[2])

    # Binary search on the answer (time)
    left, right = 0, max(edge[2] for edge in edges) if edges else 0

    # Helper function to check if we have at least k components at time t
    def has_at_least_k_components(time_limit):
        uf = UnionFind(n)

        # Connect nodes with edges that have removal time > time_limit
        # These edges are still present at time = time_limit
        for u, v, t in edges:
            if t <= time_limit:
                # All remaining edges have t <= time_limit, so we can break
                break
            uf.union(u, v)

        return uf.components >= k

    # Binary search for the maximum time where we have at least k components
    result = 0
    while left <= right:
        mid = (left + right) // 2

        if has_at_least_k_components(mid):
            # At time mid, we have at least k components
            # Try to find a larger time that still works
            result = mid
            left = mid + 1
        else:
            # At time mid, we have fewer than k components
            # Need to try smaller time
            right = mid - 1

    return result
```

```javascript
// Time: O(m * α(n) * log(max_time)) where α is inverse Ackermann (near constant)
// Space: O(n + m) for Union-Find and edge storage
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.components = n; // Track number of components
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
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

    this.components--; // Merging reduces components by 1
    return true;
  }
}

function minTimeForKComponents(n, edges, k) {
  if (k === n) {
    return 0; // All nodes isolated from start
  }

  // Sort edges by removal time in descending order
  edges.sort((a, b) => b[2] - a[2]);

  // Find maximum time for binary search range
  let maxTime = 0;
  for (const edge of edges) {
    maxTime = Math.max(maxTime, edge[2]);
  }

  // Helper function to check if we have at least k components at time t
  const hasAtLeastKComponents = (timeLimit) => {
    const uf = new UnionFind(n);

    // Connect nodes with edges that have removal time > timeLimit
    for (const [u, v, t] of edges) {
      if (t <= timeLimit) {
        // All remaining edges have t <= timeLimit, so we can break
        break;
      }
      uf.union(u, v);
    }

    return uf.components >= k;
  };

  // Binary search for the maximum time where we have at least k components
  let left = 0;
  let right = maxTime;
  let result = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (hasAtLeastKComponents(mid)) {
      // At time mid, we have at least k components
      // Try to find a larger time that still works
      result = mid;
      left = mid + 1;
    } else {
      // At time mid, we have fewer than k components
      // Need to try smaller time
      right = mid - 1;
    }
  }

  return result;
}
```

```java
// Time: O(m * α(n) * log(max_time)) where α is inverse Ackermann (near constant)
// Space: O(n + m) for Union-Find and edge storage
class UnionFind {
    private int[] parent;
    private int[] rank;
    private int components;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        components = n;  // Start with n components (each node isolated)

        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) {
            return false;  // Already connected
        }

        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }

        components--;  // Merging reduces components by 1
        return true;
    }

    public int getComponents() {
        return components;
    }
}

class Solution {
    public int minTimeForKComponents(int n, int[][] edges, int k) {
        if (k == n) {
            return 0;  // All nodes isolated from start
        }

        // Sort edges by removal time in descending order
        Arrays.sort(edges, (a, b) -> Integer.compare(b[2], a[2]));

        // Find maximum time for binary search range
        int maxTime = 0;
        for (int[] edge : edges) {
            maxTime = Math.max(maxTime, edge[2]);
        }

        // Binary search for the maximum time where we have at least k components
        int left = 0, right = maxTime;
        int result = 0;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (hasAtLeastKComponents(n, edges, mid, k)) {
                // At time mid, we have at least k components
                // Try to find a larger time that still works
                result = mid;
                left = mid + 1;
            } else {
                // At time mid, we have fewer than k components
                // Need to try smaller time
                right = mid - 1;
            }
        }

        return result;
    }

    private boolean hasAtLeastKComponents(int n, int[][] edges, int timeLimit, int k) {
        UnionFind uf = new UnionFind(n);

        // Connect nodes with edges that have removal time > timeLimit
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], t = edge[2];

            if (t <= timeLimit) {
                // All remaining edges have t <= timeLimit, so we can break
                break;
            }

            uf.union(u, v);
        }

        return uf.getComponents() >= k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × α(n) × log(T))

- Sorting edges: O(m log m)
- Binary search iterations: O(log T) where T is max removal time
- Each binary search check: O(m × α(n)) where α is inverse Ackermann function (near constant)
- Total: O(m log m + m × α(n) × log T) ≈ O(m log m) for practical purposes

**Space Complexity:** O(n + m)

- Union-Find data structures: O(n)
- Storing edges: O(m)
- Sorting (in-place or using O(m) extra space depending on implementation)

The α(n) term comes from Union-Find operations with path compression and union by rank, making it effectively constant for all practical values of n.

## Common Mistakes

1. **Binary search direction confusion:** Candidates often search for the minimum time with exactly k components instead of the maximum time with at least k components. Remember: as time increases, components increase. We want the last moment before we exceed k components.

2. **Not handling k = n edge case:** When k equals n, the answer is always 0 (all nodes start isolated). Forgetting this leads to incorrect binary search bounds.

3. **Inefficient component counting:** Using BFS/DFS for each binary search check instead of Union-Find. This changes complexity from O(m × α(n)) to O(m × (n + m)), which is too slow.

4. **Wrong edge processing order:** Processing edges in ascending order of removal time requires tracking which edges have been "removed" at each time. Processing in descending order is cleaner because we only add edges that are still present.

## When You'll See This Pattern

This problem combines two powerful patterns:

1. **Binary Search on Answer:** When you need to find the minimum/maximum value satisfying a condition, and the condition is monotonic with respect to the value.
   - Related: [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)
   - Related: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)

2. **Union-Find for Dynamic Connectivity:** When you need to efficiently track connected components as edges are added or removed.
   - Related: [Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/)
   - Related: [Checking Existence of Edge Length Limited Paths](https://leetcode.com/problems/checking-existence-of-edge-length-limited-paths/)

## Key Takeaways

1. **Monotonicity enables binary search:** When a property changes in one direction as a parameter increases (like components increasing as time increases), binary search can efficiently find boundary points.

2. **Union-Find is optimal for incremental connectivity:** When building up a graph by adding edges, Union-Find with path compression and union by rank provides near-constant time operations for tracking components.

3. **Sort edges by the limiting parameter:** When using binary search with Union-Find, sort edges by the parameter you're searching on (time in this case) to efficiently process only relevant edges for each check.

[Practice this problem on CodeJeet](/problem/minimum-time-for-k-connected-components)
