---
title: "How to Solve Minimize Maximum Component Cost — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize Maximum Component Cost. Medium difficulty, 43.4% acceptance rate. Topics: Binary Search, Union-Find, Graph Theory, Sorting."
date: "2029-09-08"
category: "dsa-patterns"
tags: ["minimize-maximum-component-cost", "binary-search", "union-find", "graph-theory", "medium"]
---

# How to Solve Minimize Maximum Component Cost

You're given a connected undirected graph with weighted edges and need to remove up to `k` edges to minimize the maximum total weight of any connected component. The challenge is that removing edges splits the graph into components, and you want the heaviest component to be as light as possible. This problem combines graph theory with optimization and requires clever use of binary search and union-find.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have 4 nodes with edges:

- Edge 0: (0, 1, weight 5)
- Edge 1: (1, 2, weight 8)
- Edge 2: (2, 3, weight 3)
- Edge 3: (0, 3, weight 6)

And `k = 1` (we can remove at most 1 edge).

**Goal**: Find the minimum possible maximum component weight after removing ≤1 edge.

**Step-by-step reasoning**:

1. If we remove no edges, all nodes are connected. Total weight = 5+8+3+6 = 22. Maximum component weight = 22.
2. If we remove edge (1,2,8):
   - Components: {0,1} (weight 5) and {2,3} (weight 3+6=9)
   - Maximum component weight = max(5,9) = 9
3. If we remove edge (0,3,6):
   - Components: {0,1,2} (weight 5+8=13) and {3} (weight 0)
   - Maximum component weight = 13
4. If we remove edge (0,1,5):
   - Components: {0,3,2} (weight 6+3+8=17) and {1} (weight 0)
   - Maximum component weight = 17
5. If we remove edge (2,3,3):
   - Components: {0,1,2} (weight 5+8=13) and {3} (weight 0)
   - Maximum component weight = 13

The best we can do is 9 by removing the weight-8 edge. But how do we find this systematically for larger graphs?

## Brute Force Approach

A naive approach would be to try all combinations of removing up to `k` edges:

1. Generate all subsets of edges of size 0 to `k`
2. For each subset, remove those edges and compute connected components
3. Calculate the maximum component weight for each configuration
4. Return the minimum of these maximums

**Why this fails**:

- Number of edges can be up to 10^5 (from constraints)
- Even for small `k`, the number of combinations is astronomical: C(m,0) + C(m,1) + ... + C(m,k)
- Computing components for each combination would be O(m × n) using BFS/DFS
- Total complexity would be exponential and completely infeasible

We need a smarter approach that doesn't require trying all edge removal combinations.

## Optimized Approach

The key insight is that we can use **binary search** on the answer combined with **union-find**:

**Core idea**: Instead of trying to find which edges to remove, we ask: "Can we achieve a maximum component weight of X?" If we can achieve X, we might be able to do better (lower X). If we can't achieve X, we need to try higher X.

**How to check if maximum component weight ≤ X is achievable**:

1. Sort edges by weight in descending order (heaviest first)
2. Initialize union-find with all nodes as separate components
3. Process edges from heaviest to lightest:
   - If adding this edge would keep all component weights ≤ X, add it (union the components)
   - Otherwise, we must remove this edge (count it toward our k removals)
4. If total removals needed ≤ k, then X is achievable

**Why this greedy approach works**:

- By processing heaviest edges first, we prioritize removing the most problematic edges
- If an edge connects two components and the combined weight would exceed X, we must remove it (otherwise we violate the X limit)
- We want to minimize removals, so we only remove edges when necessary
- Adding lighter edges first could cause issues: a heavy edge added later might force us to remove it, wasting a removal that could have been used elsewhere

**Binary search bounds**:

- Lower bound: 0 (empty components)
- Upper bound: sum of all edge weights (all nodes in one component)
- We search for the minimum X where the check function returns true

## Optimal Solution

Here's the complete implementation using binary search and union-find:

<div class="code-group">

```python
# Time: O(m log S + m log m) where S = sum of all edge weights
# Space: O(n + m) for union-find and edge sorting
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n  # Track component size (number of nodes)
        self.weight = [0] * n  # Track component weight

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y, edge_weight):
        # Union by size
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            # Already in same component, add weight to component
            self.weight[root_x] += edge_weight
            return True

        # Merge smaller component into larger one
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x

        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.weight[root_x] += self.weight[root_y] + edge_weight
        return True

    def get_weight(self, x):
        # Get total weight of component containing x
        return self.weight[self.find(x)]

def minimizeMaxComponentCost(n, edges, k):
    # Sort edges in descending order of weight
    edges.sort(key=lambda x: x[2], reverse=True)
    total_weight = sum(w for _, _, w in edges)

    def can_achieve(max_weight):
        """Check if we can achieve maximum component weight <= max_weight"""
        uf = UnionFind(n)
        removals = 0

        for u, v, w in edges:
            root_u = uf.find(u)
            root_v = uf.find(v)

            if root_u == root_v:
                # Edge connects nodes already in same component
                current_comp_weight = uf.get_weight(u)
                if current_comp_weight + w > max_weight:
                    # Adding this edge would exceed max_weight, must remove
                    removals += 1
                    if removals > k:
                        return False
                else:
                    # Safe to add edge within same component
                    uf.weight[root_u] += w
            else:
                # Edge connects different components
                weight_u = uf.get_weight(u)
                weight_v = uf.get_weight(v)

                if weight_u + weight_v + w > max_weight:
                    # Merging would exceed max_weight, must remove edge
                    removals += 1
                    if removals > k:
                        return False
                else:
                    # Safe to merge components
                    uf.union(u, v, w)

        return removals <= k

    # Binary search for minimum achievable max_weight
    left, right = 0, total_weight
    answer = total_weight

    while left <= right:
        mid = (left + right) // 2
        if can_achieve(mid):
            answer = mid
            right = mid - 1  # Try for smaller max_weight
        else:
            left = mid + 1  # Need larger max_weight

    return answer
```

```javascript
// Time: O(m log S + m log m) where S = sum of all edge weights
// Space: O(n + m) for union-find and edge sorting
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1); // Track component size
    this.weight = Array(n).fill(0); // Track component weight
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y, edgeWeight) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      // Already in same component, add weight
      this.weight[rootX] += edgeWeight;
      return true;
    }

    // Union by size: attach smaller tree to larger tree
    if (this.size[rootX] < this.size[rootY]) {
      [rootX, rootY] = [rootY, rootX];
    }

    this.parent[rootY] = rootX;
    this.size[rootX] += this.size[rootY];
    this.weight[rootX] += this.weight[rootY] + edgeWeight;
    return true;
  }

  getWeight(x) {
    return this.weight[this.find(x)];
  }
}

function minimizeMaxComponentCost(n, edges, k) {
  // Sort edges in descending order of weight
  edges.sort((a, b) => b[2] - a[2]);
  const totalWeight = edges.reduce((sum, edge) => sum + edge[2], 0);

  function canAchieve(maxWeight) {
    // Check if we can achieve maximum component weight <= maxWeight
    const uf = new UnionFind(n);
    let removals = 0;

    for (const [u, v, w] of edges) {
      const rootU = uf.find(u);
      const rootV = uf.find(v);

      if (rootU === rootV) {
        // Edge connects nodes already in same component
        const currentWeight = uf.getWeight(u);
        if (currentWeight + w > maxWeight) {
          // Adding would exceed limit, must remove
          removals++;
          if (removals > k) return false;
        } else {
          // Safe to add to existing component
          uf.weight[rootU] += w;
        }
      } else {
        // Edge connects different components
        const weightU = uf.getWeight(u);
        const weightV = uf.getWeight(v);

        if (weightU + weightV + w > maxWeight) {
          // Merging would exceed limit, must remove
          removals++;
          if (removals > k) return false;
        } else {
          // Safe to merge components
          uf.union(u, v, w);
        }
      }
    }

    return removals <= k;
  }

  // Binary search for minimum achievable maxWeight
  let left = 0;
  let right = totalWeight;
  let answer = totalWeight;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canAchieve(mid)) {
      answer = mid;
      right = mid - 1; // Try for smaller value
    } else {
      left = mid + 1; // Need larger value
    }
  }

  return answer;
}
```

```java
// Time: O(m log S + m log m) where S = sum of all edge weights
// Space: O(n + m) for union-find and edge sorting
import java.util.*;

class UnionFind {
    private int[] parent;
    private int[] size;
    private long[] weight;  // Use long to avoid overflow

    public UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        weight = new long[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
            weight[i] = 0;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y, long edgeWeight) {
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) {
            // Already in same component, add weight
            weight[rootX] += edgeWeight;
            return true;
        }

        // Union by size
        if (size[rootX] < size[rootY]) {
            int temp = rootX;
            rootX = rootY;
            rootY = temp;
        }

        parent[rootY] = rootX;
        size[rootX] += size[rootY];
        weight[rootX] += weight[rootY] + edgeWeight;
        return true;
    }

    public long getWeight(int x) {
        return weight[find(x)];
    }
}

class Solution {
    public int minimizeMaxComponentCost(int n, int[][] edges, int k) {
        // Sort edges in descending order of weight
        Arrays.sort(edges, (a, b) -> Integer.compare(b[2], a[2]));
        long totalWeight = 0;
        for (int[] edge : edges) {
            totalWeight += edge[2];
        }

        // Binary search for answer
        long left = 0;
        long right = totalWeight;
        long answer = totalWeight;

        while (left <= right) {
            long mid = left + (right - left) / 2;
            if (canAchieve(n, edges, k, mid)) {
                answer = mid;
                right = mid - 1;  // Try smaller value
            } else {
                left = mid + 1;   // Need larger value
            }
        }

        return (int) answer;
    }

    private boolean canAchieve(int n, int[][] edges, int k, long maxWeight) {
        UnionFind uf = new UnionFind(n);
        int removals = 0;

        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            long w = edge[2];

            int rootU = uf.find(u);
            int rootV = uf.find(v);

            if (rootU == rootV) {
                // Edge within same component
                long currentWeight = uf.getWeight(u);
                if (currentWeight + w > maxWeight) {
                    removals++;
                    if (removals > k) return false;
                } else {
                    // Update component weight
                    uf.union(u, v, w);  // This will just add weight since roots are same
                }
            } else {
                // Edge between different components
                long weightU = uf.getWeight(u);
                long weightV = uf.getWeight(v);

                if (weightU + weightV + w > maxWeight) {
                    removals++;
                    if (removals > k) return false;
                } else {
                    uf.union(u, v, w);
                }
            }
        }

        return removals <= k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m log S + m log m)

- Sorting edges: O(m log m) where m = number of edges
- Binary search: O(log S) where S = sum of all edge weights
- Each `can_achieve` check: O(m α(n)) where α(n) is inverse Ackermann (effectively constant)
- Total: O(m log m + m log S) = O(m log(mS))

**Space Complexity**: O(n + m)

- Union-find data structures: O(n) for parent, size, and weight arrays
- Edge sorting: O(m) for the sorted list (in-place sort uses O(log m) stack space)
- Total: O(n + m)

## Common Mistakes

1. **Processing edges in ascending order**: Adding light edges first seems intuitive but fails because heavy edges added later might force unnecessary removals. Always process from heaviest to lightest.

2. **Forgetting to track component weights properly**: When two components merge, you must add both their existing weights PLUS the new edge weight. A common error is only adding the edge weight.

3. **Incorrect binary search bounds**: Using max edge weight as upper bound instead of total weight. The worst case is all edges in one component, so upper bound should be sum of all weights.

4. **Not handling edges within same component**: After some unions, an edge might connect two nodes already in the same component. You still need to check if adding its weight would exceed the limit.

5. **Off-by-one in removal count**: Remember you can remove _up to_ k edges, so the condition is `removals <= k`, not `removals < k`.

## When You'll See This Pattern

This "binary search on answer + greedy validation" pattern appears in many optimization problems:

1. **LeetCode 410 "Split Array Largest Sum"**: Minimize the largest sum when splitting array into k subarrays. Binary search on the maximum sum, greedy validation.

2. **LeetCode 1011 "Capacity To Ship Packages Within D Days"**: Find minimum capacity to ship packages in D days. Binary search on capacity, greedy validation.

3. **LeetCode 875 "Koko Eating Bananas"**: Find minimum eating speed to finish bananas in h hours. Binary search on speed, greedy validation.

The pattern is: when asked to minimize a maximum (or maximize a minimum), and validation is easier than direct optimization, binary search on the answer is often the solution.

## Key Takeaways

1. **Minimax problems often suggest binary search**: When you need to minimize a maximum value (or vice versa), consider binary searching on the answer and writing a validation function.

2. **Greedy validation with sorting**: For validation, processing items in sorted order (often descending for minimization problems) frequently yields an optimal greedy strategy.

3. **Union-find tracks connectivity dynamically**: When you need to maintain and query connected components while adding/removing edges, union-find is more efficient than repeated BFS/DFS.

[Practice this problem on CodeJeet](/problem/minimize-maximum-component-cost)
