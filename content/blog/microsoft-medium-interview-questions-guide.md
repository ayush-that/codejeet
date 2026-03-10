---
title: "Medium Microsoft Interview Questions: Strategy Guide"
description: "How to tackle 762 medium difficulty questions from Microsoft — patterns, time targets, and practice tips."
date: "2031-12-25"
category: "tips"
tags: ["microsoft", "medium", "interview prep"]
---

# Medium Microsoft Interview Questions: Strategy Guide

Microsoft has 762 Medium questions out of 1352 total — that’s over 56% of their problem set. This isn’t an accident. Medium problems are the sweet spot where interviewers can assess both your fundamental data structure knowledge and your ability to apply it to non-trivial scenarios. Unlike Easy problems which often test single concepts, Medium problems at Microsoft typically combine 2-3 concepts and require you to navigate subtle constraints or optimize beyond brute force.

What separates Microsoft’s Medium problems from other companies is their emphasis on practical, systems-adjacent thinking. You’ll see more problems involving strings, file systems, object-oriented design patterns, and real-world constraints. The jump from Easy to Medium here isn’t just about complexity — it’s about learning to think in layers.

## Common Patterns and Templates

Microsoft’s Medium problems heavily favor certain patterns that reflect their engineering needs. The most common is the **modified traversal pattern** — taking a standard algorithm (like BFS or DFS) and adapting it to track additional state. This appears in problems about trees with parent pointers, graphs with weighted edges, or matrices with obstacles.

Here’s the template for a modified BFS that tracks both distance and a secondary state (like keys collected or obstacles removed):

<div class="code-group">

```python
from collections import deque
from typing import List

def modified_bfs(grid: List[List[str]]) -> int:
    """
    Template for BFS with state tracking.
    Example problems: Shortest Path in a Grid with Obstacles Elimination (#1293),
                      Shortest Path to Get All Keys (#864)
    """
    m, n = len(grid), len(grid[0])

    # State representation: (row, col, state_bits)
    # For obstacle elimination: state_bits = obstacles_removed_so_far
    # For keys collection: state_bits = bitmask of collected keys
    start_state = (0, 0, 0)  # (r, c, initial_state)

    # Visited needs to track position AND state
    # visited[r][c][state] = whether we've been here with this state
    visited = [[[False] * (1 << k) for _ in range(n)] for _ in range(m)]
    visited[0][0][0] = True

    queue = deque([start_state])
    steps = 0

    while queue:
        for _ in range(len(queue)):
            r, c, state = queue.popleft()

            # Check if we reached the goal with required state
            if is_goal(r, c, state):
                return steps

            for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
                nr, nc = r + dr, c + dc

                if 0 <= nr < m and 0 <= nc < n:
                    new_state = update_state(state, grid[nr][nc])

                    # Check if move is valid with current state
                    if is_valid_move(grid[nr][nc], state) and not visited[nr][nc][new_state]:
                        visited[nr][nc][new_state] = True
                        queue.append((nr, nc, new_state))

        steps += 1

    return -1  # No path found

# Time: O(m * n * 2^k) where k is number of state bits (obstacles or keys)
# Space: O(m * n * 2^k) for the visited array
```

```javascript
function modifiedBFS(grid) {
  /**
   * Template for BFS with state tracking.
   * Example problems: Shortest Path in a Grid with Obstacles Elimination (#1293),
   *                   Shortest Path to Get All Keys (#864)
   */
  const m = grid.length,
    n = grid[0].length;

  // State representation: [row, col, stateBits]
  const startState = [0, 0, 0];

  // visited[r][c][state] = whether we've been here with this state
  const visited = Array(m)
    .fill()
    .map(() =>
      Array(n)
        .fill()
        .map(() => ({}))
    );
  visited[0][0][0] = true;

  const queue = [startState];
  let steps = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c, state] = queue.shift();

      if (isGoal(r, c, state)) {
        return steps;
      }

      const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;

        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
          const newState = updateState(state, grid[nr][nc]);

          if (isValidMove(grid[nr][nc], state) && !visited[nr][nc][newState]) {
            visited[nr][nc][newState] = true;
            queue.push([nr, nc, newState]);
          }
        }
      }
    }

    steps++;
  }

  return -1; // No path found
}

// Time: O(m * n * 2^k) where k is number of state bits
// Space: O(m * n * 2^k) for the visited tracking
```

```java
import java.util.*;

public class ModifiedBFS {
    /**
     * Template for BFS with state tracking.
     * Example problems: Shortest Path in a Grid with Obstacles Elimination (#1293),
     *                   Shortest Path to Get All Keys (#864)
     */
    public int modifiedBFS(char[][] grid) {
        int m = grid.length, n = grid[0].length;

        // State representation: row, col, stateBits
        int[] startState = new int[]{0, 0, 0};

        // visited[r][c][state] = whether we've been here with this state
        boolean[][][] visited = new boolean[m][n][1 << 6]; // Adjust size based on max states

        visited[0][0][0] = true;

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(startState);
        int steps = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0], c = current[1], state = current[2];

                if (isGoal(r, c, state)) {
                    return steps;
                }

                int[][] directions = {{0,1},{1,0},{0,-1},{-1,0}};
                for (int[] dir : directions) {
                    int nr = r + dir[0], nc = c + dir[1];

                    if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                        int newState = updateState(state, grid[nr][nc]);

                        if (isValidMove(grid[nr][nc], state) && !visited[nr][nc][newState]) {
                            visited[nr][nc][newState] = true;
                            queue.offer(new int[]{nr, nc, newState});
                        }
                    }
                }
            }

            steps++;
        }

        return -1; // No path found
    }

    // Time: O(m * n * 2^k) where k is number of state bits
    // Space: O(m * n * 2^k) for the visited array
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Microsoft, you should aim to reach a working solution within 25-30 minutes, leaving 10-15 minutes for discussion and optimization. The first 5 minutes should be clarifying questions and examples, 15-20 minutes for implementation, and 5 minutes for testing.

Beyond correctness, Microsoft interviewers watch for:

1. **Code organization** — Can they easily follow your logic? Do you separate concerns?
2. **Edge case identification** — Do you ask about empty inputs, large values, or invalid states?
3. **Trade-off awareness** — Can you explain why you chose HashMap over Array, or BFS over DFS?
4. **Incremental improvement** — Do you start with brute force and optimize, or jump straight to optimal?

The biggest signal they’re looking for is whether you write code they’d want to maintain. Clean variable names, consistent formatting, and thoughtful comments matter more here than at companies that prioritize pure speed.

## Key Differences from Easy Problems

Easy problems test if you know a concept. Medium problems test if you know when to apply it. The shift involves:

1. **Multiple constraints** — Instead of “find the target,” it’s “find the target while minimizing X and respecting Y.”
2. **State management** — You need to track more than just position (keys collected, obstacles removed, previous character).
3. **Optimization requirements** — Brute force might technically work but will timeout. You need to recognize when to use memoization, sliding windows, or two pointers.
4. **Problem decomposition** — Medium problems often require breaking into subproblems (like validating BSTs by checking subtrees AND maintaining bounds).

The mindset shift is from “What algorithm solves this?” to “What combination of techniques handles these constraints?”

## Specific Patterns for Medium

**Pattern 1: Parent-Child Tree Navigation**
Microsoft loves tree problems where you need to move both up and down. Problems like “Lowest Common Ancestor of a Binary Tree III” (#1650) with parent pointers require thinking bidirectionally. The trick is to use two pointers like finding a linked list intersection.

**Pattern 2: String Processing with Constraints**
Problems like “Minimum Deletions to Make Character Frequencies Unique” (#1647) require counting, sorting, and greedy adjustments. The pattern: count frequencies, sort descending, iterate while ensuring each frequency is unique by decrementing duplicates.

**Pattern 3: Interval Merging with Twists**
Standard interval merging (#56) becomes Medium when you add conditions like “Minimum Number of Arrows to Burst Balloons” (#452) where intervals only need to touch, not fully overlap. The adjustment is in the comparison condition.

## Practice Strategy

Don’t just solve randomly. Here’s a targeted approach:

1. **First week**: Focus on the modified traversal pattern (10-15 problems). Start with “Rotting Oranges” (#994), then “Shortest Path in Binary Matrix” (#1091), then the state-tracking problems.
2. **Second week**: Practice tree problems with parent pointers and LCA variations (8-10 problems).
3. **Third week**: String manipulation with frequency counting and greedy approaches (8-10 problems).
4. **Daily target**: 2-3 Medium problems with 30-minute time limits each. Spend 15 minutes reviewing solutions you struggled with.

Always verbalize your thought process while practicing. Microsoft cares about communication as much as coding. If you get stuck, ask yourself: “What extra information would make this Easy?” That’s usually the state you need to track.

[Practice Medium Microsoft questions](/company/microsoft/medium)
