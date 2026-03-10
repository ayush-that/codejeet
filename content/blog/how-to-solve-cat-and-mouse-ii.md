---
title: "How to Solve Cat and Mouse II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Cat and Mouse II. Hard difficulty, 40.4% acceptance rate. Topics: Array, Math, Dynamic Programming, Graph Theory, Topological Sort."
date: "2026-06-11"
category: "dsa-patterns"
tags: ["cat-and-mouse-ii", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Cat and Mouse II

Cat and Mouse II is a complex game theory problem where two players move alternately on a grid, each trying to achieve their own objective. The mouse wants to reach food before being caught by the cat, while the cat wants to catch the mouse before it reaches food. What makes this problem particularly tricky is that it's a **turn-based game with perfect information** where both players play optimally, requiring us to determine the guaranteed outcome rather than just simulating random moves.

## Visual Walkthrough

Let's trace through a simple 2×3 example to build intuition:

```
Grid:
C . F
. . M

Positions:
Cat at (0,0), Mouse at (1,2), Food at (0,2)
```

**Turn 1 (Mouse moves first):**

- Mouse can move to (1,1) or (0,2)
- If mouse moves to (0,2) → reaches food immediately → MOUSE WINS
- Since mouse plays optimally, it will choose this winning move

**Turn 1 alternative (if mouse moved differently):**

- If mouse moves to (1,1):
  - Cat can move to (0,1) or (1,0)
  - From (0,1), cat is adjacent to mouse at (1,1) → CAT WINS
- Mouse would avoid this losing move

This shows the core challenge: we need to analyze **all possible game states** to determine which player can force a win with optimal play from both sides.

## Brute Force Approach

A naive approach would be to simulate all possible sequences of moves using recursion. At each turn, we'd generate all legal moves for the current player, recursively evaluate the resulting positions, and choose the best move according to game theory rules:

- Mouse tries to maximize its chances (prefer states where mouse wins)
- Cat tries to minimize mouse's chances (prefer states where cat wins)

The brute force recursion would look like:

```
function canMouseWin(catPos, mousePos, turn):
    if mouse reached food: return MOUSE_WIN
    if cat caught mouse: return CAT_WIN
    if turn > some limit: return DRAW (or continue)

    if turn is mouse's turn:
        best = CAT_WIN  // worst case for mouse
        for each mouse move:
            result = canMouseWin(catPos, newMousePos, catTurn)
            best = max(best, result)  // mouse wants best outcome
        return best
    else:  // cat's turn
        best = MOUSE_WIN  // worst case for cat
        for each cat move:
            result = canMouseWin(newCatPos, mousePos, mouseTurn)
            best = min(best, result)  // cat wants worst outcome for mouse
        return best
```

**Why this fails:**

1. **State explosion**: The game tree grows exponentially with turn depth
2. **Cycles**: Players can revisit positions, causing infinite recursion
3. **No memoization**: We'd recompute the same states repeatedly
4. **Turn limit**: Without careful handling, the game could continue indefinitely

The brute force approach has exponential time complexity O(b^d) where b is branching factor and d is depth, making it impractical for typical grid sizes.

## Optimized Approach

The key insight is to treat this as a **graph problem with game theory** and use **dynamic programming with memoization**. We can model the game as a directed graph where:

- Nodes represent game states: (cat_row, cat_col, mouse_row, mouse_col, turn)
- Edges represent legal moves from one state to another
- Terminal states are when mouse reaches food or cat catches mouse

We use a **topological sort approach** starting from known terminal states and working backwards:

1. Mark all terminal states as WIN for the player who just won
2. For non-terminal states, a state is a WIN for the player whose turn it is if:
   - They have **any move** to a state that's a WIN for them
3. A state is a LOSE for the player whose turn it is if:
   - **All moves** lead to states that are WIN for the opponent
4. We propagate these win/lose determinations backward through the state graph

This is essentially applying the **retrograde analysis** technique used in solving combinatorial games.

## Optimal Solution

Here's the complete solution using dynamic programming with memoization and optimal move generation:

<div class="code-group">

```python
# Time: O(rows² * cols² * max_moves) where max_moves is limited by the grid
# Space: O(rows² * cols²) for memoization
class Solution:
    def canMouseWin(self, grid, catJump, mouseJump):
        rows, cols = len(grid), len(grid[0])

        # Find initial positions
        cat_pos = mouse_pos = food_pos = None
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 'C':
                    cat_pos = (r, c)
                elif grid[r][c] == 'M':
                    mouse_pos = (r, c)
                elif grid[r][c] == 'F':
                    food_pos = (r, c)

        # Directions for movement
        dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]

        # Memoization dictionary: (cat_r, cat_c, mouse_r, mouse_c, turn) -> result
        # Result: 1 = mouse win, 2 = cat win, 0 = unknown/draw
        memo = {}

        def get_neighbors(pos, jump, is_cat):
            """Get all possible positions reachable from current position"""
            r, c = pos
            neighbors = [(r, c)]  # Can stay in place (important for cat)
            for dr, dc in dirs:
                for step in range(1, jump + 1):
                    nr, nc = r + dr * step, c + dc * step
                    # Check bounds and walls
                    if nr < 0 or nr >= rows or nc < 0 or nc >= cols:
                        break
                    if grid[nr][nc] == '#':  # Wall blocks further movement
                        break
                    # Cat cannot go to food position
                    if is_cat and (nr, nc) == food_pos:
                        continue
                    neighbors.append((nr, nc))
            return neighbors

        def dfs(cat_r, cat_c, mouse_r, mouse_c, turn):
            """DFS with memoization to determine game outcome"""
            state = (cat_r, cat_c, mouse_r, mouse_c, turn)

            # Check memoization
            if state in memo:
                return memo[state]

            # Terminal conditions
            if (mouse_r, mouse_c) == food_pos:
                memo[state] = 1  # Mouse wins
                return 1
            if (cat_r, cat_c) == (mouse_r, mouse_c):
                memo[state] = 2  # Cat wins
                return 2
            if turn >= 1000:  # Game goes on too long, cat wins by default
                memo[state] = 2
                return 2

            # Mouse's turn (turn is even)
            if turn % 2 == 0:
                mouse_can_win = False
                # Mouse tries all possible moves
                for nr, nc in get_neighbors((mouse_r, mouse_c), mouseJump, False):
                    result = dfs(cat_r, cat_c, nr, nc, turn + 1)
                    if result == 1:  # Mouse found a winning move
                        mouse_can_win = True
                        break
                memo[state] = 1 if mouse_can_win else 2
            # Cat's turn (turn is odd)
            else:
                cat_can_win = True
                # Cat tries all possible moves
                for nr, nc in get_neighbors((cat_r, cat_c), catJump, True):
                    # Cat cannot pass through food
                    if (nr, nc) == food_pos:
                        continue
                    result = dfs(nr, nc, mouse_r, mouse_c, turn + 1)
                    if result == 2:  # Cat found a winning move
                        cat_can_win = True
                        break
                    if result == 1:  # Cat found a move that leads to mouse win
                        cat_can_win = False
                memo[state] = 2 if cat_can_win else 1

            return memo[state]

        # Start the game with mouse's turn (turn = 0)
        result = dfs(cat_pos[0], cat_pos[1], mouse_pos[0], mouse_pos[1], 0)
        return result == 1
```

```javascript
// Time: O(rows² * cols² * max_moves) where max_moves is limited by the grid
// Space: O(rows² * cols²) for memoization
var canMouseWin = function (grid, catJump, mouseJump) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Find initial positions
  let catPos, mousePos, foodPos;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "C") catPos = [r, c];
      else if (grid[r][c] === "M") mousePos = [r, c];
      else if (grid[r][c] === "F") foodPos = [r, c];
    }
  }

  // Directions for movement
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  // Memoization map
  const memo = new Map();

  // Helper function to get reachable positions
  const getNeighbors = (pos, jump, isCat) => {
    const [r, c] = pos;
    const neighbors = [[r, c]]; // Can stay in place

    for (const [dr, dc] of dirs) {
      for (let step = 1; step <= jump; step++) {
        const nr = r + dr * step;
        const nc = c + dc * step;

        // Check bounds
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break;
        // Check for wall
        if (grid[nr][nc] === "#") break;
        // Cat cannot go to food
        if (isCat && nr === foodPos[0] && nc === foodPos[1]) continue;

        neighbors.push([nr, nc]);
      }
    }

    return neighbors;
  };

  // DFS with memoization
  const dfs = (catR, catC, mouseR, mouseC, turn) => {
    const stateKey = `${catR},${catC},${mouseR},${mouseC},${turn}`;

    // Check memoization
    if (memo.has(stateKey)) {
      return memo.get(stateKey);
    }

    // Terminal conditions
    if (mouseR === foodPos[0] && mouseC === foodPos[1]) {
      memo.set(stateKey, 1); // Mouse wins
      return 1;
    }
    if (catR === mouseR && catC === mouseC) {
      memo.set(stateKey, 2); // Cat wins
      return 2;
    }
    if (turn >= 1000) {
      // Game goes on too long
      memo.set(stateKey, 2);
      return 2;
    }

    let result;

    // Mouse's turn (even turns)
    if (turn % 2 === 0) {
      let mouseCanWin = false;
      const mouseMoves = getNeighbors([mouseR, mouseC], mouseJump, false);

      for (const [nr, nc] of mouseMoves) {
        const moveResult = dfs(catR, catC, nr, nc, turn + 1);
        if (moveResult === 1) {
          // Mouse found winning move
          mouseCanWin = true;
          break;
        }
      }

      result = mouseCanWin ? 1 : 2;
    }
    // Cat's turn (odd turns)
    else {
      let catCanWin = true;
      const catMoves = getNeighbors([catR, catC], catJump, true);

      for (const [nr, nc] of catMoves) {
        // Cat cannot move to food
        if (nr === foodPos[0] && nc === foodPos[1]) continue;

        const moveResult = dfs(nr, nc, mouseR, mouseC, turn + 1);
        if (moveResult === 2) {
          // Cat found winning move
          catCanWin = true;
          break;
        }
        if (moveResult === 1) {
          // This move leads to mouse win
          catCanWin = false;
        }
      }

      result = catCanWin ? 2 : 1;
    }

    memo.set(stateKey, result);
    return result;
  };

  const finalResult = dfs(catPos[0], catPos[1], mousePos[0], mousePos[1], 0);
  return finalResult === 1;
};
```

```java
// Time: O(rows² * cols² * max_moves) where max_moves is limited by the grid
// Space: O(rows² * cols²) for memoization
class Solution {
    private int rows, cols;
    private String[] grid;
    private int catJump, mouseJump;
    private int[] foodPos;
    private int[][][][][] memo;  // 5D memoization: catR, catC, mouseR, mouseC, turn

    // Directions: right, down, left, up
    private int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    public boolean canMouseWin(String[] grid, int catJump, int mouseJump) {
        this.rows = grid.length;
        this.cols = grid[0].length();
        this.grid = grid;
        this.catJump = catJump;
        this.mouseJump = mouseJump;

        // Initialize memoization array
        memo = new int[rows][cols][rows][cols][2];  // Only need 2 states for turn parity

        // Find positions
        int[] catPos = new int[2];
        int[] mousePos = new int[2];
        foodPos = new int[2];

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                char ch = grid[r].charAt(c);
                if (ch == 'C') {
                    catPos[0] = r;
                    catPos[1] = c;
                } else if (ch == 'M') {
                    mousePos[0] = r;
                    mousePos[1] = c;
                } else if (ch == 'F') {
                    foodPos[0] = r;
                    foodPos[1] = c;
                }
            }
        }

        // Start DFS from initial state
        return dfs(catPos[0], catPos[1], mousePos[0], mousePos[1], 0) == 1;
    }

    private int dfs(int catR, int catC, int mouseR, int mouseC, int turn) {
        // Check memoization (using turn % 2 for parity)
        if (memo[catR][catC][mouseR][mouseC][turn % 2] != 0) {
            return memo[catR][catC][mouseR][mouseC][turn % 2];
        }

        // Terminal conditions
        if (mouseR == foodPos[0] && mouseC == foodPos[1]) {
            memo[catR][catC][mouseR][mouseC][turn % 2] = 1;  // Mouse wins
            return 1;
        }
        if (catR == mouseR && catC == mouseC) {
            memo[catR][catC][mouseR][mouseC][turn % 2] = 2;  // Cat wins
            return 2;
        }
        if (turn >= 1000) {  // Game goes on too long
            memo[catR][catC][mouseR][mouseC][turn % 2] = 2;
            return 2;
        }

        int result;

        // Mouse's turn (even turns)
        if (turn % 2 == 0) {
            boolean mouseCanWin = false;
            List<int[]> mouseMoves = getNeighbors(mouseR, mouseC, mouseJump, false);

            for (int[] move : mouseMoves) {
                int nextResult = dfs(catR, catC, move[0], move[1], turn + 1);
                if (nextResult == 1) {  // Mouse found winning move
                    mouseCanWin = true;
                    break;
                }
            }

            result = mouseCanWin ? 1 : 2;
        }
        // Cat's turn (odd turns)
        else {
            boolean catCanWin = true;
            List<int[]> catMoves = getNeighbors(catR, catC, catJump, true);

            for (int[] move : catMoves) {
                // Cat cannot move to food
                if (move[0] == foodPos[0] && move[1] == foodPos[1]) continue;

                int nextResult = dfs(move[0], move[1], mouseR, mouseC, turn + 1);
                if (nextResult == 2) {  // Cat found winning move
                    catCanWin = true;
                    break;
                }
                if (nextResult == 1) {  // This move leads to mouse win
                    catCanWin = false;
                }
            }

            result = catCanWin ? 2 : 1;
        }

        memo[catR][catC][mouseR][mouseC][turn % 2] = result;
        return result;
    }

    private List<int[]> getNeighbors(int r, int c, int jump, boolean isCat) {
        List<int[]> neighbors = new ArrayList<>();
        neighbors.add(new int[]{r, c});  // Can stay in place

        for (int[] dir : dirs) {
            for (int step = 1; step <= jump; step++) {
                int nr = r + dir[0] * step;
                int nc = c + dir[1] * step;

                // Check bounds
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break;
                // Check for wall
                if (grid[nr].charAt(nc) == '#') break;
                // Cat cannot go to food
                if (isCat && nr == foodPos[0] && nc == foodPos[1]) continue;

                neighbors.add(new int[]{nr, nc});
            }
        }

        return neighbors;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(rows² × cols² × max_moves × T)

- There are O(rows × cols) possible positions for cat and O(rows × cols) for mouse, giving O(rows² × cols²) total states
- Each state considers up to O(max_moves) possible moves (4 directions × jump distance)
- T is the maximum turns (capped at 1000 in our implementation)
- In practice, with memoization and turn limiting, it's much faster than worst case

**Space Complexity:** O(rows² × cols²)

- For memoization of all possible states
- Each state stores the result (mouse win, cat win, or unknown)
- The recursion stack depth is limited by the turn limit

## Common Mistakes

1. **Forgetting that players can stay in place**: Both cat and mouse can choose not to move, which is a valid strategic option. Missing this leads to incorrect game trees.

2. **Not handling the turn limit correctly**: Without a turn limit, the game could cycle indefinitely. The problem statement implies that after a certain number of moves without resolution, the cat wins.

3. **Incorrect move generation for jumps**: When a player can jump multiple squares, they can't jump over walls. The wall blocks further movement in that direction, which needs careful handling in the neighbor generation.

4. **Not memoizing by turn parity**: Since the game state depends on whose turn it is, you need to include turn information in your memoization key. Using just positions leads to incorrect results.

## When You'll See This Pattern

This **game theory with memoization** pattern appears in several competitive programming problems:

1. **Cat and Mouse (LeetCode 913)**: The original version of this problem on a graph rather than a grid. Uses similar game theory concepts with memoization.

2. **Predict the Winner (LeetCode 486)**: Players take turns picking numbers from ends of an array. Uses minimax algorithm with memoization to determine if the first player can guarantee a win.

3. **Stone Game (LeetCode 877)**: Similar to Predict the Winner but with the additional constraint that the number of stones is even. Uses the same game theory DP approach.

4. **Nim Game (LeetCode 292)**: Simpler game theory problem where you determine if the first player can win a Nim game. Teaches the fundamental concept of winning/losing positions.

## Key Takeaways

1. **Game theory problems with perfect information** can often be solved with memoization and DFS, treating game states as nodes in a graph and propagating win/lose information backward from terminal states.

2. **The minimax principle** applies: the current player chooses the move that maximizes their chance of winning, assuming the opponent will play optimally to minimize it.

3. **State representation is crucial**: You need to capture all information that affects future moves (positions, whose turn it is, sometimes move count). Efficient state encoding enables effective memoization.

4. **Look for symmetry and constraints**: The turn limit, movement rules, and terminal conditions all help bound the search space and make the problem tractable.

Related problems: [Escape The Ghosts](/problem/escape-the-ghosts), [Cat and Mouse](/problem/cat-and-mouse)
