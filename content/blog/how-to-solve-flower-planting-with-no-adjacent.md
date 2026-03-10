---
title: "How to Solve Flower Planting With No Adjacent — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Flower Planting With No Adjacent. Medium difficulty, 53.4% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-06-02"
category: "dsa-patterns"
tags:
  [
    "flower-planting-with-no-adjacent",
    "depth-first-search",
    "breadth-first-search",
    "graph-theory",
    "medium",
  ]
---

# How to Solve Flower Planting With No Adjacent

You need to assign one of four flower types to `n` gardens such that no two connected gardens share the same flower type. Each garden has at most 3 connections, which is crucial—it means there will always be a valid flower available. The challenge is designing an efficient algorithm that works for up to 10,000 gardens without backtracking.

## Visual Walkthrough

Let's trace through a small example: `n = 4`, paths = `[[1,2],[2,3],[3,4],[4,1]]` (forming a square).

1. **Garden 1**: No neighbors assigned yet. Pick flower 1.
2. **Garden 2**: Connected to garden 1 (flower 1). Avoid flower 1 → pick flower 2.
3. **Garden 3**: Connected to garden 2 (flower 2). Avoid flower 2 → pick flower 1.
4. **Garden 4**: Connected to garden 3 (flower 1) and garden 1 (flower 1). Avoid flower 1 → pick flower 2.

Result: `[1, 2, 1, 2]` works! Notice we processed gardens in order 1→4. Since each garden has ≤3 neighbors, and we have 4 flower types, there's always at least one flower not used by neighbors.

## Brute Force Approach

A naive approach would try all possible flower assignments (4^n possibilities) and check if any violates adjacency constraints. For n=10,000, this is impossible (4^10000 operations).

Even backtracking with pruning would be inefficient if we don't leverage the degree constraint. A candidate might try to use BFS/DFS with backtracking when no flower is available—but with the degree constraint, backtracking is unnecessary.

**Why brute force fails**: Exponential time complexity makes it infeasible for large n. The problem's structure guarantees a greedy solution works.

## Optimized Approach

The key insight: **Each garden has at most 3 neighbors, and we have 4 flower types**. Therefore, for any garden, at least one flower type is _not_ used by its neighbors. We can assign flowers greedily!

**Step-by-step reasoning**:

1. Build an adjacency list to represent connections between gardens.
2. Initialize result array with zeros (unassigned).
3. For each garden from 1 to n:
   - Check which flowers its neighbors already have.
   - Pick the smallest-numbered flower not used by neighbors.
   - Assign it to the current garden.
4. Return the result.

**Why this works without backtracking**: When we reach garden i, some neighbors might be unassigned (if their index > i). That's fine—we only avoid flowers from _already-assigned_ neighbors. Since each garden has ≤3 neighbors, and we have 4 colors, there will always be at least one available flower even if all assigned neighbors have different flowers.

**Data structures**: Use adjacency list for O(1) neighbor lookup, and a simple array for assignments.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = #gardens, m = #paths
# Space: O(n + m) for adjacency list
def gardenNoAdj(n, paths):
    """
    Greedy flower assignment using graph coloring principles.
    Since each node has degree ≤ 3 and we have 4 colors,
    we can always find a valid color for each node.
    """
    # Step 1: Build adjacency list
    # Use 0-indexed for simplicity (gardens 1..n become 0..n-1)
    adj = [[] for _ in range(n)]
    for x, y in paths:
        adj[x-1].append(y-1)  # Convert to 0-index
        adj[y-1].append(x-1)

    # Step 2: Initialize result array (0 = unassigned)
    result = [0] * n

    # Step 3: Assign flowers to each garden
    for garden in range(n):
        # Track flowers used by neighbors
        used = [False] * 5  # Index 1-4, ignore 0

        # Check all neighbors
        for neighbor in adj[garden]:
            neighbor_flower = result[neighbor]
            if neighbor_flower != 0:
                used[neighbor_flower] = True

        # Pick the smallest available flower (1-4)
        for flower in range(1, 5):
            if not used[flower]:
                result[garden] = flower
                break

    return result
```

```javascript
// Time: O(n + m) where n = #gardens, m = #paths
// Space: O(n + m) for adjacency list
function gardenNoAdj(n, paths) {
  /**
   * Greedy flower assignment using graph coloring principles.
   * Since each node has degree ≤ 3 and we have 4 colors,
   * we can always find a valid color for each node.
   */

  // Step 1: Build adjacency list
  // Use 0-indexed for simplicity (gardens 1..n become 0..n-1)
  const adj = Array.from({ length: n }, () => []);
  for (const [x, y] of paths) {
    adj[x - 1].push(y - 1); // Convert to 0-index
    adj[y - 1].push(x - 1);
  }

  // Step 2: Initialize result array (0 = unassigned)
  const result = new Array(n).fill(0);

  // Step 3: Assign flowers to each garden
  for (let garden = 0; garden < n; garden++) {
    // Track flowers used by neighbors
    const used = new Array(5).fill(false); // Index 1-4, ignore 0

    // Check all neighbors
    for (const neighbor of adj[garden]) {
      const neighborFlower = result[neighbor];
      if (neighborFlower !== 0) {
        used[neighborFlower] = true;
      }
    }

    // Pick the smallest available flower (1-4)
    for (let flower = 1; flower <= 4; flower++) {
      if (!used[flower]) {
        result[garden] = flower;
        break;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n + m) where n = #gardens, m = #paths
// Space: O(n + m) for adjacency list
class Solution {
    public int[] gardenNoAdj(int n, int[][] paths) {
        /**
         * Greedy flower assignment using graph coloring principles.
         * Since each node has degree ≤ 3 and we have 4 colors,
         * we can always find a valid color for each node.
         */

        // Step 1: Build adjacency list
        // Use 0-indexed for simplicity (gardens 1..n become 0..n-1)
        List<Integer>[] adj = new List[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }

        for (int[] path : paths) {
            int x = path[0] - 1;  // Convert to 0-index
            int y = path[1] - 1;
            adj[x].add(y);
            adj[y].add(x);
        }

        // Step 2: Initialize result array (0 = unassigned)
        int[] result = new int[n];

        // Step 3: Assign flowers to each garden
        for (int garden = 0; garden < n; garden++) {
            // Track flowers used by neighbors
            boolean[] used = new boolean[5];  // Index 1-4, ignore 0

            // Check all neighbors
            for (int neighbor : adj[garden]) {
                int neighborFlower = result[neighbor];
                if (neighborFlower != 0) {
                    used[neighborFlower] = true;
                }
            }

            // Pick the smallest available flower (1-4)
            for (int flower = 1; flower <= 4; flower++) {
                if (!used[flower]) {
                    result[garden] = flower;
                    break;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n + m) where n is number of gardens and m is number of paths.

- Building adjacency list: O(m) to process all paths.
- Assigning flowers: O(n × degree). Since degree ≤ 3, this is O(3n) = O(n).
- Total: O(n + m).

**Space Complexity**: O(n + m)

- Adjacency list stores all connections: O(m) for undirected edges (each stored twice).
- Result array: O(n).
- Used array per garden: O(1) since it's size 5 and recreated each iteration.
- Total: O(n + m).

## Common Mistakes

1. **Forgetting to convert 1-indexed to 0-indexed**: The problem uses garden numbers 1..n, but arrays are 0-indexed. Forgetting `-1` when accessing arrays causes index errors.
   _Fix_: Consistently subtract 1 when using garden numbers as indices.

2. **Using backtracking unnecessarily**: Some candidates implement DFS with backtracking, thinking they need to handle conflicts. This adds O(4^n) complexity.
   _Fix_: Recognize the degree constraint guarantees a greedy solution works.

3. **Not checking only assigned neighbors**: When processing garden i, only check neighbors with index < i (already assigned). Checking all neighbors might seem to create circular dependencies, but it still works because we have 4 colors.
   _Fix_: The provided solution handles this correctly by checking `result[neighbor] != 0`.

4. **Assuming gardens are connected**: The graph may have disconnected components. The algorithm works regardless because we process each garden independently.
   _Fix_: No special handling needed—the adjacency list handles isolated nodes naturally.

## When You'll See This Pattern

This problem uses **greedy graph coloring with bounded degree**, a pattern useful for:

1. **Course Schedule II (LeetCode 210)**: Similar topological sorting with dependency constraints.
2. **Is Graph Bipartite? (LeetCode 785)**: Checking if graph can be colored with 2 colors—this is the 2-color special case.
3. **Minimum Height Trees (LeetCode 310)**: Graph problems where degree constraints matter.

The core pattern: **When you have more colors than the maximum degree, greedy coloring always works**. This appears in scheduling problems (tasks with conflicts, limited resources) and register allocation in compilers.

## Key Takeaways

1. **Degree constraint enables greedy solutions**: If maximum degree < number of colors, you can color vertices in any order without backtracking.
2. **Graph problems often simplify with adjacency lists**: For sparse graphs (each node has few connections), adjacency lists are more efficient than matrices.
3. **1-indexed vs 0-indexed conversion**: Always check problem indexing and convert consistently to avoid off-by-one errors.

[Practice this problem on CodeJeet](/problem/flower-planting-with-no-adjacent)
