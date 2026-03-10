---
title: "How to Solve Number of Valid Move Combinations On Chessboard — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Valid Move Combinations On Chessboard. Hard difficulty, 48.8% acceptance rate. Topics: Array, String, Backtracking, Simulation."
date: "2026-08-20"
category: "dsa-patterns"
tags: ["number-of-valid-move-combinations-on-chessboard", "array", "string", "backtracking", "hard"]
---

# How to Solve Number of Valid Move Combinations On Chessboard

This problem asks you to count all valid move combinations for multiple chess pieces on an 8×8 board. Each piece moves according to its type (rook moves horizontally/vertically, bishop diagonally, queen both), and pieces can move simultaneously. The tricky part is that pieces cannot occupy the same square at the same time, and they cannot pass through each other during movement. This creates complex constraints that make brute force enumeration challenging.

## Visual Walkthrough

Let's trace through a simple example with 2 pieces:

- `pieces = ["rook","bishop"]`
- `positions = [[1,1],[4,4]]`

**Step 1: Understand individual piece movements**

- Rook at (1,1) can move to any square in row 1 or column 1 (14 total moves)
- Bishop at (4,4) can move along diagonals (13 total moves)

**Step 2: Consider simultaneous movement**
We need to consider ALL combinations where:

1. Each piece moves 0 or more squares in its allowed directions
2. No two pieces occupy the same square at the same time
3. No piece passes through another piece's path

**Step 3: Check a specific combination**
Say rook moves to (1,4) and bishop moves to (1,4):

- Both try to end at same square → INVALID

Say rook moves to (1,3) and bishop moves to (3,1):

- Rook path: (1,1)→(1,2)→(1,3)
- Bishop path: (4,4)→(3,3)→(2,2)→(1,1)
- They cross at (1,1) at different times? Actually, bishop passes through (1,1) at time 3, rook leaves (1,1) at time 0 → VALID (no simultaneous occupancy)

**Step 4: The challenge**
We need to check ALL possible destination combinations and ALL possible timing arrangements. This creates a massive search space that requires careful pruning.

## Brute Force Approach

A naive approach would:

1. Generate all possible destinations for each piece
2. Generate all possible move sequences (paths) to those destinations
3. Check all combinations of paths for conflicts

The problem with this approach:

- Each piece has up to 14 possible directions × up to 7 steps = ~100 possible moves
- For n pieces: ~100ⁿ combinations
- For each combination, we need to check all time steps for collisions
- This becomes O(100ⁿ × n × 8) which is impossible for n up to 4

Even for n=2, that's 10,000 combinations to check. The brute force is computationally infeasible.

## Optimized Approach

The key insight is that we can use **backtracking with pruning** and **time-based collision checking**:

1. **Generate moves efficiently**: Instead of all destinations, generate moves by direction and distance
2. **Backtrack piece by piece**: For each piece, try all possible moves (including staying put)
3. **Check conflicts incrementally**: As we assign moves, check if the current partial assignment could lead to conflicts
4. **Time-based simulation**: Track when pieces occupy each square to detect:
   - Two pieces occupying same square at same time
   - A piece passing through another piece's position

The critical optimization is checking conflicts **during** backtracking rather than after generating all combinations. We maintain:

- `positions_at_time[t][r][c]`: Which piece occupies square (r,c) at time t
- We only need to track up to time 8 (max distance on 8×8 board)

## Optimal Solution

We use DFS backtracking where at each step we assign a move to one piece. For each piece, we try:

1. Staying in place (move 0 steps)
2. Moving in each valid direction for 1-7 steps

During assignment, we simulate the move step-by-step to check for conflicts with already-assigned moves.

<div class="code-group">

```python
# Time: O(8^n * n * 8) but heavily pruned in practice | Space: O(n * 8^2)
class Solution:
    def countCombinations(self, pieces: List[str], positions: List[List[int]]) -> int:
        n = len(pieces)
        # Convert to 0-indexed positions
        start_pos = [(r-1, c-1) for r, c in positions]

        # Directions for each piece type
        dirs = {
            'rook': [(0,1),(0,-1),(1,0),(-1,0)],
            'bishop': [(1,1),(1,-1),(-1,1),(-1,-1)],
            'queen': [(0,1),(0,-1),(1,0),(-1,0),(1,1),(1,-1),(-1,1),(-1,-1)]
        }

        # Store all possible moves for each piece
        moves = [[] for _ in range(n)]
        for i in range(n):
            # Always include staying in place (0 steps)
            moves[i].append(((0,0), 0))

            # For each valid direction
            for dr, dc in dirs[pieces[i]]:
                r, c = start_pos[i]
                # Try 1 to 7 steps in this direction
                for steps in range(1, 8):
                    nr, nc = r + dr*steps, c + dc*steps
                    # Check if still on board
                    if 0 <= nr < 8 and 0 <= nc < 8:
                        moves[i].append(((dr, dc), steps))
                    else:
                        break

        self.count = 0
        # occupied[t][r][c] = piece index occupying (r,c) at time t
        occupied = [[[-1]*8 for _ in range(8)] for _ in range(8)]

        def dfs(piece_idx):
            if piece_idx == n:
                # All pieces assigned valid moves
                self.count += 1
                return

            # Try each possible move for current piece
            for (dr, dc), steps in moves[piece_idx]:
                r, c = start_pos[piece_idx]
                valid = True
                updates = []  # Track squares we occupy to rollback

                # Simulate the move step by step
                for t in range(steps + 1):  # +1 to include final position
                    nr, nc = r + dr*t, c + dc*t

                    # Check if square is occupied at this time
                    if occupied[t][nr][nc] != -1:
                        valid = False
                        break

                    # Mark this square as occupied at time t
                    occupied[t][nr][nc] = piece_idx
                    updates.append((t, nr, nc))

                if valid:
                    # Continue with next piece
                    dfs(piece_idx + 1)

                # Backtrack: remove our occupancy marks
                for t, nr, nc in updates:
                    occupied[t][nr][nc] = -1

        dfs(0)
        return self.count
```

```javascript
// Time: O(8^n * n * 8) but heavily pruned in practice | Space: O(n * 8^2)
var countCombinations = function (pieces, positions) {
  const n = pieces.length;
  // Convert to 0-indexed positions
  const startPos = positions.map(([r, c]) => [r - 1, c - 1]);

  // Directions for each piece type
  const dirs = {
    rook: [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ],
    bishop: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    queen: [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
  };

  // Generate all possible moves for each piece
  const moves = Array(n)
    .fill()
    .map(() => []);
  for (let i = 0; i < n; i++) {
    // Always include staying in place
    moves[i].push([[0, 0], 0]);

    const [r, c] = startPos[i];
    const pieceDirs = dirs[pieces[i]];

    // For each valid direction
    for (const [dr, dc] of pieceDirs) {
      // Try 1 to 7 steps in this direction
      for (let steps = 1; steps <= 7; steps++) {
        const nr = r + dr * steps;
        const nc = c + dc * steps;

        // Check if still on board
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          moves[i].push([[dr, dc], steps]);
        } else {
          break; // Can't go further in this direction
        }
      }
    }
  }

  let count = 0;
  // occupied[t][r][c] = piece index occupying (r,c) at time t
  const occupied = Array(8)
    .fill()
    .map(() =>
      Array(8)
        .fill()
        .map(() => Array(8).fill(-1))
    );

  function dfs(pieceIdx) {
    if (pieceIdx === n) {
      // All pieces assigned valid moves
      count++;
      return;
    }

    const [r, c] = startPos[pieceIdx];

    // Try each possible move for current piece
    for (const [[dr, dc], steps] of moves[pieceIdx]) {
      let valid = true;
      const updates = []; // Track squares we occupy to rollback

      // Simulate the move step by step
      for (let t = 0; t <= steps; t++) {
        const nr = r + dr * t;
        const nc = c + dc * t;

        // Check if square is occupied at this time
        if (occupied[t][nr][nc] !== -1) {
          valid = false;
          break;
        }

        // Mark this square as occupied at time t
        occupied[t][nr][nc] = pieceIdx;
        updates.push([t, nr, nc]);
      }

      if (valid) {
        // Continue with next piece
        dfs(pieceIdx + 1);
      }

      // Backtrack: remove our occupancy marks
      for (const [t, nr, nc] of updates) {
        occupied[t][nr][nc] = -1;
      }
    }
  }

  dfs(0);
  return count;
};
```

```java
// Time: O(8^n * n * 8) but heavily pruned in practice | Space: O(n * 8^2)
class Solution {
    private int count = 0;
    private int[][][] occupied; // occupied[t][r][c]
    private List<List<int[]>> moves; // moves[piece][i] = {dr, dc, steps}

    public int countCombinations(String[] pieces, int[][] positions) {
        int n = pieces.length;
        // Convert to 0-indexed positions
        int[][] startPos = new int[n][2];
        for (int i = 0; i < n; i++) {
            startPos[i][0] = positions[i][0] - 1;
            startPos[i][1] = positions[i][1] - 1;
        }

        // Directions for each piece type
        Map<String, int[][]> dirs = new HashMap<>();
        dirs.put("rook", new int[][]{{0,1},{0,-1},{1,0},{-1,0}});
        dirs.put("bishop", new int[][]{{1,1},{1,-1},{-1,1},{-1,-1}});
        dirs.put("queen", new int[][]{{0,1},{0,-1},{1,0},{-1,0},{1,1},{1,-1},{-1,1},{-1,-1}});

        // Generate all possible moves for each piece
        moves = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            List<int[]> pieceMoves = new ArrayList<>();
            // Always include staying in place
            pieceMoves.add(new int[]{0, 0, 0});

            int r = startPos[i][0];
            int c = startPos[i][1];
            int[][] pieceDirs = dirs.get(pieces[i]);

            // For each valid direction
            for (int[] dir : pieceDirs) {
                int dr = dir[0];
                int dc = dir[1];

                // Try 1 to 7 steps in this direction
                for (int steps = 1; steps <= 7; steps++) {
                    int nr = r + dr * steps;
                    int nc = c + dc * steps;

                    // Check if still on board
                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                        pieceMoves.add(new int[]{dr, dc, steps});
                    } else {
                        break; // Can't go further in this direction
                    }
                }
            }
            moves.add(pieceMoves);
        }

        // occupied[t][r][c] = piece index occupying (r,c) at time t
        occupied = new int[8][8][8];
        for (int t = 0; t < 8; t++) {
            for (int r = 0; r < 8; r++) {
                Arrays.fill(occupied[t][r], -1);
            }
        }

        dfs(0, startPos);
        return count;
    }

    private void dfs(int pieceIdx, int[][] startPos) {
        if (pieceIdx == startPos.length) {
            // All pieces assigned valid moves
            count++;
            return;
        }

        int r = startPos[pieceIdx][0];
        int c = startPos[pieceIdx][1];

        // Try each possible move for current piece
        for (int[] move : moves.get(pieceIdx)) {
            int dr = move[0];
            int dc = move[1];
            int steps = move[2];

            boolean valid = true;
            List<int[]> updates = new ArrayList<>(); // Track squares we occupy

            // Simulate the move step by step
            for (int t = 0; t <= steps; t++) {
                int nr = r + dr * t;
                int nc = c + dc * t;

                // Check if square is occupied at this time
                if (occupied[t][nr][nc] != -1) {
                    valid = false;
                    break;
                }

                // Mark this square as occupied at time t
                occupied[t][nr][nc] = pieceIdx;
                updates.add(new int[]{t, nr, nc});
            }

            if (valid) {
                // Continue with next piece
                dfs(pieceIdx + 1, startPos);
            }

            // Backtrack: remove our occupancy marks
            for (int[] update : updates) {
                occupied[update[0]][update[1]][update[2]] = -1;
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(8ⁿ × n × 8) in worst case, but heavily pruned in practice

- Each piece has ~O(8) possible moves (directions × distances + stay)
- For n pieces: O(8ⁿ) combinations to explore
- For each combination, we simulate up to 8 time steps
- Checking occupancy is O(1) per square
- In practice, pruning eliminates many invalid combinations early

**Space Complexity**: O(n × 8²)

- `occupied` array: 8 × 8 × 8 = 512 integers
- Recursion stack: O(n) depth
- Moves storage: O(n × moves_per_piece) ≈ O(8n)

## Common Mistakes

1. **Forgetting the "stay in place" option**: Each piece can choose to move 0 steps. Missing this counts fewer combinations.

2. **Not checking intermediate positions**: Only checking final destinations misses cases where pieces cross paths. You must check every time step from 0 to max(steps).

3. **Incorrect board bounds**: Using 1-indexed vs 0-indexed coordinates inconsistently. Always convert to 0-indexed at the start and stick with it.

4. **Not pruning early enough**: Checking conflicts only after generating all combinations leads to exponential blowup. Must prune during DFS.

5. **Mishandling piece types**: Each piece has different movement rules. Rooks can't move diagonally, bishops can't move straight.

## When You'll See This Pattern

This backtracking-with-pruning pattern appears in many constraint satisfaction problems:

1. **N-Queens (LeetCode 51)**: Place queens so none attack each other. Similar backtracking with conflict checking.

2. **Sudoku Solver (LeetCode 37)**: Fill grid following Sudoku rules. Backtrack with constraint propagation.

3. **Word Search II (LeetCode 212)**: Find words in grid. DFS with pruning when no words match current path.

The common theme: search space is large, but constraints allow early elimination of invalid paths. Always check constraints **during** search, not after.

## Key Takeaways

1. **Backtracking with incremental validation** is powerful for combinatorial problems with constraints. Check validity as you build solutions, not after.

2. **Time-based simulation** helps when objects move simultaneously. Track state at each time step to detect collisions.

3. **Prune aggressively**: In chess problems, pieces have limited movement ranges. Use board boundaries and piece-specific rules to limit search space.

4. **Always include the null move**: When counting "combinations," remember that not moving is a valid choice.

[Practice this problem on CodeJeet](/problem/number-of-valid-move-combinations-on-chessboard)
