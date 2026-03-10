---
title: "How to Solve Minimum Moves to Reach Target with Rotations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Reach Target with Rotations. Hard difficulty, 51.8% acceptance rate. Topics: Array, Breadth-First Search, Matrix."
date: "2026-04-03"
category: "dsa-patterns"
tags:
  [
    "minimum-moves-to-reach-target-with-rotations",
    "array",
    "breadth-first-search",
    "matrix",
    "hard",
  ]
---

# How to Solve Minimum Moves to Reach Target with Rotations

This problem presents a unique twist on grid pathfinding: instead of moving a single cell, we're moving a 2-cell snake that can also rotate. The snake occupies two adjacent cells and can move right, down, or rotate clockwise/counterclockwise. What makes this tricky is that we need to track both cells' positions and orientations, making the state space more complex than traditional BFS problems.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 3×3 grid:

```
[[0,0,0],
 [0,1,0],
 [0,0,0]]
```

The snake starts at positions (0,0) and (0,1) - horizontally oriented at the top-left. Our goal is to reach positions (2,1) and (2,2) - horizontally oriented at the bottom-right.

**Step 1: Initial state**

- Head: (0,0), Tail: (0,1) (horizontal orientation)
- Moves: 0

**Step 2: Possible moves from initial state:**

1. Move right: Head (0,1), Tail (0,2) - valid (all cells are empty)
2. Move down: Head (1,0), Tail (1,1) - valid
3. Rotate clockwise (pivot at head): Head stays (0,0), Tail moves to (1,0) - INVALID because cell (1,0) must be empty AND cell (1,1) must be empty for rotation
4. Rotate counterclockwise (pivot at tail): Head moves to (1,1), Tail stays (0,1) - INVALID for same reason

**Step 3: Continue BFS exploration**
We'd explore both valid moves, checking rotations at each new position, until we find the shortest path to the target.

The key insight: we need to track not just position but orientation, and rotation moves require checking additional cells beyond just the snake's current positions.

## Brute Force Approach

A naive approach might try DFS with backtracking, exploring all possible move sequences. For each state (head position, tail position), we'd recursively try all 4 possible moves, marking visited states to avoid cycles.

The problem with this approach:

1. **Exponential time complexity**: With up to 4 moves from each state and a grid up to 100×100, the search space explodes
2. **No guarantee of shortest path**: DFS doesn't naturally find the minimum moves
3. **State explosion**: We need to track visited states properly to avoid infinite loops

Even with memoization, a DFS approach would be inefficient because we're looking for the shortest path, not just any path.

## Optimized Approach

The key insight is that this is a **shortest path problem in a state space**, which naturally calls for **Breadth-First Search (BFS)**. Each "state" in our search is defined by:

- The position of the snake's two cells
- The orientation (horizontal or vertical)

**Why BFS works:**

1. BFS explores all states reachable in 1 move, then 2 moves, etc., guaranteeing the first time we reach the target is with minimum moves
2. We can encode each state compactly: (row1, col1, row2, col2) or (row, col, orientation)
3. We need to check visited states to avoid re-exploring

**State representation optimization:**
Instead of storing all 4 coordinates, we can store:

- The position of the "head" (the cell with smaller row or col)
- Orientation: 0 for horizontal (head left of tail), 1 for vertical (head above tail)

**Move generation:**
From any state, we can generate up to 4 possible moves:

1. **Move right**: Both cells move right if the cells to their right are empty
2. **Move down**: Both cells move down if the cells below them are empty
3. **Rotate clockwise**: If horizontal, rotate around head to vertical (checking empty cells below)
4. **Rotate counterclockwise**: If horizontal, rotate around tail to vertical (checking empty cells below)
   (Similar for vertical to horizontal rotations)

**Critical validation for rotations:**
When rotating, we must check that:

1. The pivot cell remains in place
2. The rotating cell moves to a valid position
3. **The "blocking check" cells are empty** - this is the trickiest part!

For example, when rotating a horizontal snake clockwise around its head:

- Head stays at (r, c)
- Tail moves from (r, c+1) to (r+1, c)
- We must check that (r+1, c+1) is also empty!

## Optimal Solution

Here's the complete BFS solution with detailed comments:

<div class="code-group">

```python
# Time: O(n^2) - each cell/orientation combination visited at most once
# Space: O(n^2) - for visited set and BFS queue
from collections import deque

def minimumMoves(grid):
    n = len(grid)

    # State: (row, col, orientation)
    # orientation: 0 = horizontal (tail to the right), 1 = vertical (tail below)
    start = (0, 0, 0)  # Head at (0,0), horizontal
    target = (n-1, n-1, 0)  # Head at (n-1,n-1), horizontal

    queue = deque([start])
    visited = set([start])
    moves = 0

    while queue:
        # Process all states at current distance level
        for _ in range(len(queue)):
            r, c, orient = queue.popleft()

            # Check if we reached the target
            if (r, c, orient) == target:
                return moves

            # Generate all possible moves from current state

            # 1. Move right (both cells move right)
            if orient == 0:  # Horizontal
                # Check if tail can move right (head's right is tail's current position)
                if c + 2 < n and grid[r][c+2] == 0:
                    new_state = (r, c+1, orient)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)
            else:  # Vertical
                # Both cells need empty space to their right
                if c + 1 < n and grid[r][c+1] == 0 and grid[r+1][c+1] == 0:
                    new_state = (r, c+1, orient)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

            # 2. Move down (both cells move down)
            if orient == 0:  # Horizontal
                # Both cells need empty space below
                if r + 1 < n and grid[r+1][c] == 0 and grid[r+1][c+1] == 0:
                    new_state = (r+1, c, orient)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)
            else:  # Vertical
                # Check if tail can move down
                if r + 2 < n and grid[r+2][c] == 0:
                    new_state = (r+1, c, orient)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

            # 3. Rotate clockwise
            if orient == 0:  # Horizontal to vertical (rotate around head)
                # Need space below both current cells for rotation
                if r + 1 < n and grid[r+1][c] == 0 and grid[r+1][c+1] == 0:
                    new_state = (r, c, 1)  # Head stays same, orientation changes
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)
            else:  # Vertical to horizontal (rotate around head)
                # Need space to the right of both current cells
                if c + 1 < n and grid[r][c+1] == 0 and grid[r+1][c+1] == 0:
                    new_state = (r, c, 0)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

            # 4. Rotate counterclockwise
            if orient == 0:  # Horizontal to vertical (rotate around tail)
                # Tail is at (r, c+1), rotating it to (r+1, c+1)
                # Need space below both cells
                if r + 1 < n and grid[r+1][c] == 0 and grid[r+1][c+1] == 0:
                    # New head becomes (r, c+1) after rotation
                    new_state = (r, c+1, 1)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)
            else:  # Vertical to horizontal (rotate around tail)
                # Tail is at (r+1, c), rotating it to (r+1, c+1)
                # Need space to the right of both cells
                if c + 1 < n and grid[r][c+1] == 0 and grid[r+1][c+1] == 0:
                    # New head becomes (r+1, c) after rotation
                    new_state = (r+1, c, 0)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

        moves += 1

    return -1  # Target not reachable
```

```javascript
// Time: O(n^2) - each cell/orientation combination visited at most once
// Space: O(n^2) - for visited set and BFS queue
function minimumMoves(grid) {
  const n = grid.length;

  // State: [row, col, orientation]
  // orientation: 0 = horizontal, 1 = vertical
  const start = [0, 0, 0];
  const target = [n - 1, n - 1, 0];

  const queue = [start];
  const visited = new Set();
  visited.add(start.toString());

  let moves = 0;

  while (queue.length > 0) {
    // Process all states at current distance level
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c, orient] = queue.shift();

      // Check if we reached the target
      if (r === target[0] && c === target[1] && orient === target[2]) {
        return moves;
      }

      // Helper function to add state to queue
      const addState = (newR, newC, newOrient) => {
        const stateStr = [newR, newC, newOrient].toString();
        if (!visited.has(stateStr)) {
          visited.add(stateStr);
          queue.push([newR, newC, newOrient]);
        }
      };

      // 1. Move right
      if (orient === 0) {
        // Horizontal
        if (c + 2 < n && grid[r][c + 2] === 0) {
          addState(r, c + 1, orient);
        }
      } else {
        // Vertical
        if (c + 1 < n && grid[r][c + 1] === 0 && grid[r + 1][c + 1] === 0) {
          addState(r, c + 1, orient);
        }
      }

      // 2. Move down
      if (orient === 0) {
        // Horizontal
        if (r + 1 < n && grid[r + 1][c] === 0 && grid[r + 1][c + 1] === 0) {
          addState(r + 1, c, orient);
        }
      } else {
        // Vertical
        if (r + 2 < n && grid[r + 2][c] === 0) {
          addState(r + 1, c, orient);
        }
      }

      // 3. Rotate clockwise
      if (orient === 0) {
        // Horizontal to vertical (around head)
        if (r + 1 < n && grid[r + 1][c] === 0 && grid[r + 1][c + 1] === 0) {
          addState(r, c, 1);
        }
      } else {
        // Vertical to horizontal (around head)
        if (c + 1 < n && grid[r][c + 1] === 0 && grid[r + 1][c + 1] === 0) {
          addState(r, c, 0);
        }
      }

      // 4. Rotate counterclockwise
      if (orient === 0) {
        // Horizontal to vertical (around tail)
        if (r + 1 < n && grid[r + 1][c] === 0 && grid[r + 1][c + 1] === 0) {
          // New head is at old tail position
          addState(r, c + 1, 1);
        }
      } else {
        // Vertical to horizontal (around tail)
        if (c + 1 < n && grid[r][c + 1] === 0 && grid[r + 1][c + 1] === 0) {
          // New head is at old tail position
          addState(r + 1, c, 0);
        }
      }
    }

    moves++;
  }

  return -1; // Target not reachable
}
```

```java
// Time: O(n^2) - each cell/orientation combination visited at most once
// Space: O(n^2) - for visited set and BFS queue
import java.util.*;

class Solution {
    public int minimumMoves(int[][] grid) {
        int n = grid.length;

        // State class to represent (row, col, orientation)
        class State {
            int r, c, orient;
            State(int r, int c, int orient) {
                this.r = r;
                this.c = c;
                this.orient = orient;
            }

            @Override
            public boolean equals(Object obj) {
                if (this == obj) return true;
                if (obj == null || getClass() != obj.getClass()) return false;
                State state = (State) obj;
                return r == state.r && c == state.c && orient == state.orient;
            }

            @Override
            public int hashCode() {
                return Objects.hash(r, c, orient);
            }
        }

        State start = new State(0, 0, 0); // Horizontal orientation
        State target = new State(n-1, n-1, 0);

        Queue<State> queue = new LinkedList<>();
        Set<State> visited = new HashSet<>();

        queue.offer(start);
        visited.add(start);

        int moves = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                State current = queue.poll();

                // Check if we reached the target
                if (current.r == target.r && current.c == target.c &&
                    current.orient == target.orient) {
                    return moves;
                }

                int r = current.r;
                int c = current.c;
                int orient = current.orient;

                // 1. Move right
                if (orient == 0) { // Horizontal
                    if (c + 2 < n && grid[r][c+2] == 0) {
                        State newState = new State(r, c+1, orient);
                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(newState);
                        }
                    }
                } else { // Vertical
                    if (c + 1 < n && grid[r][c+1] == 0 && grid[r+1][c+1] == 0) {
                        State newState = new State(r, c+1, orient);
                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(newState);
                        }
                    }
                }

                // 2. Move down
                if (orient == 0) { // Horizontal
                    if (r + 1 < n && grid[r+1][c] == 0 && grid[r+1][c+1] == 0) {
                        State newState = new State(r+1, c, orient);
                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(newState);
                        }
                    }
                } else { // Vertical
                    if (r + 2 < n && grid[r+2][c] == 0) {
                        State newState = new State(r+1, c, orient);
                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(newState);
                        }
                    }
                }

                // 3. Rotate clockwise
                if (orient == 0) { // Horizontal to vertical (around head)
                    if (r + 1 < n && grid[r+1][c] == 0 && grid[r+1][c+1] == 0) {
                        State newState = new State(r, c, 1);
                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(newState);
                        }
                    }
                } else { // Vertical to horizontal (around head)
                    if (c + 1 < n && grid[r][c+1] == 0 && grid[r+1][c+1] == 0) {
                        State newState = new State(r, c, 0);
                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(newState);
                        }
                    }
                }

                // 4. Rotate counterclockwise
                if (orient == 0) { // Horizontal to vertical (around tail)
                    if (r + 1 < n && grid[r+1][c] == 0 && grid[r+1][c+1] == 0) {
                        // New head is at old tail position
                        State newState = new State(r, c+1, 1);
                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(newState);
                        }
                    }
                } else { // Vertical to horizontal (around tail)
                    if (c + 1 < n && grid[r][c+1] == 0 && grid[r+1][c+1] == 0) {
                        // New head is at old tail position
                        State newState = new State(r+1, c, 0);
                        if (!visited.contains(newState)) {
                            visited.add(newState);
                            queue.offer(newState);
                        }
                    }
                }
            }

            moves++;
        }

        return -1; // Target not reachable
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Each cell in the grid can be part of a state in 2 orientations (horizontal or vertical)
- We have n × n cells, so at most 2n² states
- Each state generates up to 4 moves, each checked in O(1) time
- Total: O(4 × 2n²) = O(n²)

**Space Complexity: O(n²)**

- Visited set stores up to 2n² states
- BFS queue stores at most O(n²) states in worst case
- Each state uses constant space (3 integers)

## Common Mistakes

1. **Missing the blocking check for rotations**: The most common error is forgetting to check that the "diagonal" cell is empty when rotating. For horizontal→vertical rotation, you need to check both cells below the current positions.

2. **Incorrect state representation**: Using full 4 coordinates (r1,c1,r2,c2) without normalization can cause duplicate states. Always represent the snake consistently (e.g., head is the cell with smaller coordinates).

3. **Boundary condition errors**: Forgetting to check array bounds before accessing grid cells, especially when the snake is near edges. Always verify `r+1 < n`, `c+1 < n` before accessing.

4. **Confusing head and tail during rotations**: When rotating counterclockwise, the head and tail swap roles. Make sure to update the head position correctly in the new state.

## When You'll See This Pattern

This problem combines several important patterns:

1. **BFS on implicit graphs**: Like "Word Ladder" (LeetCode 127) where each word is a node and one-letter changes are edges. Here, each snake state is a node and moves are edges.

2. **State-space search**: Similar to "Sliding Puzzle" (LeetCode 773) where you search through board configurations, or "Minimum Knight Moves" (LeetCode 1197) searching through position states.

3. **Grid pathfinding with constraints**: Related to "Unique Paths II" (LeetCode 63) but with more complex movement rules and state representation.

The key pattern is recognizing when you need to search through configurations/states rather than just positions, and using BFS when you need the shortest path.

## Key Takeaways

1. **BFS is optimal for unweighted shortest path problems**: When all moves cost the same (1 move), BFS guarantees the first time you reach the target is with minimum moves.

2. **Careful state representation is crucial**: For problems with complex objects (multi-cell snake, sliding puzzles, etc.), design a compact, normalized state representation for efficient visited checking.

3. **Rotation moves require checking extra cells**: Unlike translation moves, rotations often need to verify that cells beyond the object's current position are empty to avoid "blocking" issues.

[Practice this problem on CodeJeet](/problem/minimum-moves-to-reach-target-with-rotations)
