---
title: "Hard Intuit Interview Questions: Strategy Guide"
description: "How to tackle 14 hard difficulty questions from Intuit — patterns, time targets, and practice tips."
date: "2032-06-24"
category: "tips"
tags: ["intuit", "hard", "interview prep"]
---

# Hard Intuit Interview Questions: Strategy Guide

Intuit's interview questions are known for their practical, business-logic flavor, even at the Hard difficulty. Out of their 71 tagged problems, 14 are classified as Hard. What separates these from Medium problems isn't just raw algorithmic complexity—it's the _layering_. A Hard Intuit question often combines a known algorithmic pattern with a non-obvious business constraint, data transformation, or optimization requirement that demands careful problem decomposition. You're not just implementing Dijkstra's algorithm; you're implementing it on a graph where nodes represent tax forms and edges represent dependency rules, then answering queries about the earliest possible filing date. The jump tests your ability to translate a messy real-world scenario into clean, efficient code.

## Common Patterns and Templates

Intuit's Hard problems frequently involve **Graph Traversal with State** and **Dynamic Programming on Intervals or Sequences**. The graph problems often model workflows, dependencies, or resource allocation (think TurboTax's interview scheduling or QuickBooks' transaction categorization). The DP problems tend to focus on optimization of business processes—minimizing cost, maximizing throughput, or validating complex sequences against rules.

A recurring template for their graph problems is **Multi-source BFS with Additional Constraints**. You'll often need to track not just visited nodes, but also the "state" you arrived with (e.g., remaining budget, special permissions used, or a timestamp). Here's a skeleton of that pattern:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs_with_state(grid: List[List[int]], sources: List[tuple]) -> int:
    """
    Template for Intuit-style BFS with layered state.
    Example problem: Finding shortest path where you can break k obstacles.
    """
    m, n = len(grid), len(grid[0])
    # Visited tracks (row, col, state). State could be obstacles_removed, keys_held, etc.
    # Use a 3D array or set of tuples.
    visited = [[[False] * (K + 1) for _ in range(n)] for _ in range(m)]
    queue = deque()

    # Initialize: for each source, push (r, c, state, distance)
    for r, c in sources:
        init_state = 0  # e.g., no obstacles removed yet
        queue.append((r, c, init_state, 0))
        visited[r][c][init_state] = True

    while queue:
        r, c, state, dist = queue.popleft()

        # Check if we reached a goal (could be a specific cell or condition)
        if is_goal(r, c, state):
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                # Compute new state based on what's in grid[nr][nc]
                new_state = compute_new_state(state, grid[nr][nc])
                # Possibly check if state is valid (e.g., within limit K)
                if new_state <= K and not visited[nr][nc][new_state]:
                    visited[nr][nc][new_state] = True
                    queue.append((nr, nc, new_state, dist + 1))

    return -1  # Goal not reachable

# Time: O(m * n * S) where S is number of possible states (e.g., K+1)
# Space: O(m * n * S) for the visited structure
```

```javascript
function multiSourceBfsWithState(grid, sources) {
  // Template for Intuit-style BFS with layered state.
  const m = grid.length,
    n = grid[0].length;
  const K = 5; // example state limit
  // visited[r][c][state]
  const visited = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => Array(K + 1).fill(false))
  );
  const queue = [];

  for (const [r, c] of sources) {
    const initState = 0;
    queue.push([r, c, initState, 0]);
    visited[r][c][initState] = true;
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.length) {
    const [r, c, state, dist] = queue.shift();

    if (isGoal(r, c, state)) return dist;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        const newState = computeNewState(state, grid[nr][nc]);
        if (newState <= K && !visited[nr][nc][newState]) {
          visited[nr][nc][newState] = true;
          queue.push([nr, nc, newState, dist + 1]);
        }
      }
    }
  }
  return -1;
}
// Time: O(m * n * S) | Space: O(m * n * S)
```

```java
import java.util.*;

public class MultiSourceBfsWithState {
    public int bfsTemplate(int[][] grid, int[][] sources) {
        int m = grid.length, n = grid[0].length;
        int K = 5; // example state limit
        boolean[][][] visited = new boolean[m][n][K + 1];
        Queue<int[]> queue = new LinkedList<>(); // [r, c, state, dist]

        for (int[] src : sources) {
            int r = src[0], c = src[1];
            int initState = 0;
            queue.offer(new int[]{r, c, initState, 0});
            visited[r][c][initState] = true;
        }

        int[][] directions = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0], c = curr[1], state = curr[2], dist = curr[3];

            if (isGoal(r, c, state)) return dist;

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    int newState = computeNewState(state, grid[nr][nc]);
                    if (newState <= K && !visited[nr][nc][newState]) {
                        visited[nr][nc][newState] = true;
                        queue.offer(new int[]{nr, nc, newState, dist + 1});
                    }
                }
            }
        }
        return -1;
    }
    // Time: O(m * n * S) | Space: O(m * n * S)
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot with a Hard problem, you should aim to have a working, optimized solution within 30-35 minutes. This leaves 10-15 minutes for discussion, edge cases, and follow-ups. The first 5-10 minutes are for clarifying requirements and designing your approach.

Beyond correctness, Intuit interviewers watch for:

1. **Business logic translation**: Can you map their scenario (e.g., "tax form dependencies") to a known data structure without getting lost in the domain?
2. **Code readability**: Use descriptive variable names (`remaining_obstacles` not `k_left`). Group related logic into helper functions.
3. **Constraint awareness**: Explicitly state time/space complexity and justify why it's optimal. Mention if you're trading space for time.
4. **Testing instinct**: Verbally walk through a small example, including edge cases like empty input, single element, or maximum constraints. For graph problems, always consider cycles.

## Upgrading from Medium to Hard

The leap from Medium to Hard at Intuit involves three key shifts:

1. **State management**: Medium problems often have binary state (visited/unvisited). Hard problems require tracking multiple dimensions: `(node, steps_used, special_flag)`. You need to design a visited structure that captures all relevant state to avoid redundant work.

2. **Problem decomposition**: Medium problems are usually solvable with one algorithm. Hard problems often require chaining techniques: first transform the input (build a graph), then run a modified standard algorithm (BFS with state), then post-process results. Practice breaking problems into clear, separate phases.

3. **Optimization proofs**: For Medium, "this is O(n²)" might suffice. For Hard, you'll need to argue _why_ your solution is optimal—often by identifying the invariant or proving that BFS explores the minimal state space. Be prepared to discuss alternative approaches and why yours is best.

## Specific Patterns for Hard

**Pattern 1: Interval DP with Business Rules**
Problems like "Employee Free Time" variants become Hard when you add constraints like "must schedule meetings with priority levels" or "minimize context switches." The solution often involves DP where `dp[i][j]` represents the optimal outcome for the first `i` intervals with `j` resources used. You'll see this in scheduling optimization questions.

**Pattern 2: Graph with Node/Edge Attributes**
In "Network Delay Time" (#743), edges have weights. The Hard version adds node attributes—like "processing time at node" or "node availability windows." This requires modifying Dijkstra's priority queue to account for both travel time and node constraints, effectively working in a time-state space.

**Pattern 3: Union-Find with Dynamic Components**
Standard Union-Find connects components. Hard problems ask for "largest component after k removals" or "component properties under transactions." This requires maintaining additional data in the union-find structure (like component size, sum, or a monotonic property) and supporting temporary states or rollbacks.

## Practice Strategy

Don't just solve all 14 Hard problems sequentially. Group them by pattern:

1. Start with **2-3 graph-with-state problems** (e.g., "Shortest Path in a Grid with Obstacles Elimination").
2. Move to **2-3 interval DP problems** focusing on scheduling or validation.
3. Finish with **1-2 Union-Find variations**.

Spend 45 minutes per problem simulating real interview conditions: 5 minutes to understand, 10 to design, 20 to code, 10 to test. If you can't solve it, study the solution, then _re-implement it from scratch the next day_ without looking. This builds muscle memory for the pattern.

Aim for 1 Hard problem daily, paired with 2 Medium review problems from Intuit's list. After completing all 14, do a "mock interview week" where you randomly pick 2 Hard problems back-to-back with a 90-minute timer.

[Practice Hard Intuit questions](/company/intuit/hard)
