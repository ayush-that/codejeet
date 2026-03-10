---
title: "Hard Uber Interview Questions: Strategy Guide"
description: "How to tackle 103 hard difficulty questions from Uber — patterns, time targets, and practice tips."
date: "2032-01-14"
category: "tips"
tags: ["uber", "hard", "interview prep"]
---

## Hard Uber Interview Questions: Strategy Guide

Uber has 103 Hard questions out of 381 total — that's a significant 27% of their problem set. But what actually makes a question "Hard" at Uber? It's not just about raw algorithmic complexity. Uber's Hard problems typically combine three elements: multiple algorithmic concepts layered together, non-obvious state transitions, and real-world system design implications disguised as coding problems. While Medium questions might ask you to implement a standard BFS or DP solution, Hard questions force you to _design_ the state machine, _invent_ the reduction, or _recognize_ that this graph problem is actually a union-find problem in disguise.

## Common Patterns and Templates

Uber's Hard problems heavily favor graph algorithms, dynamic programming with non-standard states, and interval problems with additional constraints. The most common pattern I've seen across dozens of Uber interviews is **multi-source BFS with state tracking** — problems where you're not just finding the shortest path, but the shortest path under specific constraints (like visiting certain nodes, carrying capacity, or time windows).

Here's the template for this pattern:

<div class="code-group">

```python
from collections import deque
from typing import List, Tuple

def multi_source_bfs_with_state(grid: List[List[int]], sources: List[Tuple[int, int]]) -> int:
    """
    Template for Uber's favorite Hard pattern: BFS with additional state.
    Common in problems like "Shortest Path with Obstacles" variations.
    """
    m, n = len(grid), len(grid[0])

    # State: (row, col, additional_state)
    # visited[row][col][state] tracks if we've been here with this state
    # The third dimension size depends on possible states (e.g., keys collected, obstacles removed)
    k = 1 << 6  # Example: 64 possible states for bitmask problems
    visited = [[[False] * k for _ in range(n)] for _ in range(m)]

    queue = deque()
    for r, c in sources:
        initial_state = 0  # Starting state (no keys, no obstacles broken, etc.)
        queue.append((r, c, initial_state, 0))  # (row, col, state, distance)
        visited[r][c][initial_state] = True

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while queue:
        r, c, state, dist = queue.popleft()

        # Check if we've reached goal with required state
        if is_goal(r, c, state):
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            if 0 <= nr < m and 0 <= nc < n:
                # Check if we can move to this cell with current state
                if can_move(grid[nr][nc], state):
                    new_state = update_state(state, grid[nr][nc])

                    if not visited[nr][nc][new_state]:
                        visited[nr][nc][new_state] = True
                        queue.append((nr, nc, new_state, dist + 1))

    return -1  # No valid path found

# Time: O(m * n * 2^k) where k is number of state bits | Space: O(m * n * 2^k)
```

```javascript
function multiSourceBfsWithState(grid, sources) {
  /**
   * Template for Uber's favorite Hard pattern: BFS with additional state.
   * Common in problems like "Shortest Path with Obstacles" variations.
   */
  const m = grid.length,
    n = grid[0].length;

  // State tracking with bitmask (common in Uber Hard problems)
  const k = 1 << 6; // 64 possible states
  const visited = Array(m)
    .fill()
    .map(() =>
      Array(n)
        .fill()
        .map(() => Array(k).fill(false))
    );

  const queue = [];
  for (const [r, c] of sources) {
    const initialState = 0;
    queue.push([r, c, initialState, 0]); // [row, col, state, distance]
    visited[r][c][initialState] = true;
  }

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  while (queue.length > 0) {
    const [r, c, state, dist] = queue.shift();

    if (isGoal(r, c, state)) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;

      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        if (canMove(grid[nr][nc], state)) {
          const newState = updateState(state, grid[nr][nc]);

          if (!visited[nr][nc][newState]) {
            visited[nr][nc][newState] = true;
            queue.push([nr, nc, newState, dist + 1]);
          }
        }
      }
    }
  }

  return -1; // No valid path found
}

// Time: O(m * n * 2^k) where k is number of state bits | Space: O(m * n * 2^k)
```

```java
import java.util.*;

public class MultiSourceBfsWithState {
    /**
     * Template for Uber's favorite Hard pattern: BFS with additional state.
     * Common in problems like "Shortest Path with Obstacles" variations.
     */
    public int multiSourceBfsWithState(int[][] grid, int[][] sources) {
        int m = grid.length, n = grid[0].length;

        // State tracking with bitmask
        int k = 1 << 6; // 64 possible states
        boolean[][][] visited = new boolean[m][n][k];

        Queue<int[]> queue = new LinkedList<>();
        for (int[] source : sources) {
            int r = source[0], c = source[1];
            int initialState = 0;
            queue.offer(new int[]{r, c, initialState, 0}); // {row, col, state, distance}
            visited[r][c][initialState] = true;
        }

        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int r = current[0], c = current[1], state = current[2], dist = current[3];

            if (isGoal(r, c, state)) {
                return dist;
            }

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];

                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    if (canMove(grid[nr][nc], state)) {
                        int newState = updateState(state, grid[nr][nc]);

                        if (!visited[nr][nc][newState]) {
                            visited[nr][nc][newState] = true;
                            queue.offer(new int[]{nr, nc, newState, dist + 1});
                        }
                    }
                }
            }
        }

        return -1; // No valid path found
    }

    // Time: O(m * n * 2^k) where k is number of state bits | Space: O(m * n * 2^k)
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For Uber Hard problems, you have 30-35 minutes total. Break this down: 5 minutes to understand and ask clarifying questions, 15 minutes to design and explain your approach, 8 minutes to code, and 5 minutes to test and discuss edge cases. The biggest differentiator isn't speed — it's clarity of thought under pressure.

Interviewers watch for three key signals beyond correctness:

1. **Problem decomposition**: Can you break this Hard problem into Medium-sized subproblems? For example, "This is essentially Dijkstra's algorithm, but we need to track fuel state as an additional dimension in our priority queue."
2. **Trade-off articulation**: When you choose an approach, can you explain _why_ you're choosing O(n²) with O(1) space over O(n) with O(n) space? Uber engineers constantly make these trade-offs in production systems.
3. **Testing intuition**: Don't just test the example. Say, "Let me test the edge cases: empty input, maximum constraints, and the case where the greedy approach would fail."

## Upgrading from Medium to Hard

The jump from Medium to Hard requires three specific skill upgrades:

1. **State space design**: Medium DP problems give you the state definition. Hard problems make you design it. Practice asking: "What information do I need to carry forward to make optimal decisions later?" This is why bitmask DP appears so often — you're tracking sets of visited nodes, collected keys, or used resources.

2. **Reduction recognition**: Hard problems are often "problem A" disguised as "problem B." Uber's "Word Ladder II" (#126) isn't just BFS — it's BFS to find distances, then DFS to reconstruct all paths, with careful attention to avoid exponential blowup. The skill is recognizing you need both algorithms together.

3. **Optimization justification**: In Medium problems, O(n²) might be acceptable. In Hard problems, you need to explain why your O(n log n) solution is necessary and how you'd further optimize if constraints were larger.

## Specific Patterns for Hard

**Pattern 1: Dijkstra with Resource Constraints**
Uber loves transportation problems. "Cheapest Flights Within K Stops" (#787) is the classic example. The twist: you're not just minimizing cost, you're minimizing cost within K stops. This requires storing (city, stops_used) as your state in the priority queue.

**Pattern 2: Union-Find with Dynamic Connections**
Problems like "Number of Islands II" (#305) start with empty grid and add land points. The naive O(k _ m _ n) solution fails. The Hard approach: union-find that only processes the new point and its neighbors, achieving near O(k) amortized time.

**Pattern 3: Monotonic Stack with Next Greater Element Variations**
"Largest Rectangle in Histogram" (#84) appears in modified forms. The key insight: maintain a stack of increasing heights, and when you find a smaller bar, you can compute the maximum rectangle ending at each popped bar.

## Practice Strategy

Don't just solve Uber Hard problems randomly. Follow this progression:

**Week 1-2: Pattern Recognition**

- 2 problems daily, 60 minutes each max
- Focus on identifying which pattern applies before coding
- Practice problems: Word Ladder II (#126), Cheapest Flights Within K Stops (#787), Employee Free Time (#759)

**Week 3-4: Implementation Speed**

- 1 problem daily, 45 minutes timed
- Implement flawlessly without IDE assistance
- Practice problems: Serialize and Deserialize N-ary Tree (#428), Alien Dictionary (#269), Reconstruct Itinerary (#332)

**Week 5-6: Mock Interviews**

- 2 full interviews weekly with a partner
- Verbalize your thought process entirely
- Focus on Uber's most frequent: Graph problems (35%), DP (25%), Intervals (20%)

Remember: Uber's Hard questions test whether you can design algorithms, not just implement them. The interviewer wants to see you wrestle with the problem space and emerge with a clean, well-reasoned solution.

[Practice Hard Uber questions](/company/uber/hard)
