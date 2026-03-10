---
title: "How to Solve Number of Paths with Max Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Paths with Max Score. Hard difficulty, 42.1% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2029-12-21"
category: "dsa-patterns"
tags: ["number-of-paths-with-max-score", "array", "dynamic-programming", "matrix", "hard"]
---

# How to Solve Number of Paths with Max Score

This problem asks us to find the maximum score achievable when moving from the bottom-right ('S') to top-left ('E') of a square board, while also counting how many paths achieve that maximum score. You can only move up, left, or diagonally up-left, and numeric cells contribute to your score. What makes this tricky is that we need to track both the maximum score AND the number of paths achieving it simultaneously - a classic dynamic programming problem with a twist.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Board:  ["E23",
         "2X2",
         "12S"]
```

We start at 'S' (position [2,2]) and need to reach 'E' (position [0,0]). 'X' represents an obstacle we cannot pass through.

**Step-by-step reasoning:**

1. From 'S' (value 0), we can move to:
   - Up: '2' at [1,2] (score +2)
   - Left: '2' at [2,1] (score +2)
   - Diagonal: 'X' at [1,1] (blocked)

2. From each of those positions, we continue moving toward 'E', accumulating scores.

3. The key insight: At each cell, we need to know:
   - The maximum score achievable from that cell to 'E'
   - How many paths achieve that maximum score

4. For cell [0,0] ('E'), the maximum score is 0 and there's exactly 1 way to be there (we've arrived).

5. We work backwards from 'E' to 'S', calculating for each cell based on its reachable neighbors (down, right, down-right since we're moving backward).

## Brute Force Approach

A naive approach would be to explore all possible paths from 'S' to 'E' using DFS/backtracking:

1. Start at 'S' (bottom-right)
2. Try all valid moves (up, left, diagonal up-left)
3. When reaching 'E', record the path's score
4. Keep track of the maximum score and count paths achieving it

**Why this fails:**

- The number of paths grows exponentially with board size
- For an n×n board, there are roughly 3ⁿ paths to explore
- With n up to 100, this is computationally impossible (3¹⁰⁰ ≈ 5×10⁴⁷ operations)
- We're doing redundant work - many paths share common subpaths

**Time Complexity:** O(3ⁿ) - Exponential, completely infeasible
**Space Complexity:** O(n) for recursion depth

## Optimized Approach

The key insight is that this is a **dynamic programming** problem:

1. **Optimal Substructure**: The maximum score from any cell depends only on the maximum scores from cells we can reach from it (up, left, diagonal).

2. **Overlapping Subproblems**: Many paths share the same intermediate cells, so we can memoize results.

3. **Two DP tables**: We need two pieces of information at each cell:
   - `dp_score[i][j]`: Maximum score achievable from cell (i,j) to 'E'
   - `dp_count[i][j]`: Number of paths achieving that maximum score from (i,j) to 'E'

4. **Transition Formula**:
   - From any cell, look at three possible moves: down, right, down-right (since we're processing backward)
   - Take the maximum score among reachable cells
   - If multiple cells have the same maximum score, sum their path counts
   - Add current cell's value to the score (if it's a number)

5. **Processing Order**: We process from 'E' (top-left) to 'S' (bottom-right) because:
   - 'E' is our destination with score 0
   - Each cell's value depends on cells closer to 'S'
   - This is essentially computing the reverse path

6. **Obstacles**: 'X' cells are unreachable (score = -inf, count = 0)

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
# where n is the board dimension
def pathsWithMaxScore(board):
    n = len(board)
    MOD = 10**9 + 7

    # Initialize DP tables
    # dp_score[i][j] = max score from (i,j) to (0,0)
    # dp_count[i][j] = number of paths achieving that max score
    dp_score = [[-1] * n for _ in range(n)]
    dp_count = [[0] * n for _ in range(n)]

    # Base case: 'E' at (0,0) has score 0 and 1 way to be there
    dp_score[0][0] = 0
    dp_count[0][0] = 1

    # Process cells in row-major order from top-left to bottom-right
    for i in range(n):
        for j in range(n):
            # Skip obstacles and uninitialized cells
            if board[i][j] == 'X' or dp_score[i][j] == -1:
                continue

            current_score = dp_score[i][j]

            # Check three possible moves: down, right, down-right
            # These correspond to moving up, left, up-left in the forward direction

            # Move down (forward: move up)
            if i + 1 < n and board[i+1][j] != 'X':
                new_score = current_score
                if board[i+1][j] != 'E' and board[i+1][j] != 'S':
                    new_score += int(board[i+1][j])

                if new_score > dp_score[i+1][j]:
                    dp_score[i+1][j] = new_score
                    dp_count[i+1][j] = dp_count[i][j]
                elif new_score == dp_score[i+1][j]:
                    dp_count[i+1][j] = (dp_count[i+1][j] + dp_count[i][j]) % MOD

            # Move right (forward: move left)
            if j + 1 < n and board[i][j+1] != 'X':
                new_score = current_score
                if board[i][j+1] != 'E' and board[i][j+1] != 'S':
                    new_score += int(board[i][j+1])

                if new_score > dp_score[i][j+1]:
                    dp_score[i][j+1] = new_score
                    dp_count[i][j+1] = dp_count[i][j]
                elif new_score == dp_score[i][j+1]:
                    dp_count[i][j+1] = (dp_count[i][j+1] + dp_count[i][j]) % MOD

            # Move down-right (forward: move up-left)
            if i + 1 < n and j + 1 < n and board[i+1][j+1] != 'X':
                new_score = current_score
                if board[i+1][j+1] != 'E' and board[i+1][j+1] != 'S':
                    new_score += int(board[i+1][j+1])

                if new_score > dp_score[i+1][j+1]:
                    dp_score[i+1][j+1] = new_score
                    dp_count[i+1][j+1] = dp_count[i][j]
                elif new_score == dp_score[i+1][j+1]:
                    dp_count[i+1][j+1] = (dp_count[i+1][j+1] + dp_count[i][j]) % MOD

    # Get result from bottom-right cell ('S')
    max_score = dp_score[n-1][n-1] if dp_score[n-1][n-1] != -1 else 0
    path_count = dp_count[n-1][n-1]

    return [max_score, path_count]
```

```javascript
// Time: O(n²) | Space: O(n²)
// where n is the board dimension
function pathsWithMaxScore(board) {
  const n = board.length;
  const MOD = 10 ** 9 + 7;

  // Initialize DP tables
  // dpScore[i][j] = max score from (i,j) to (0,0)
  // dpCount[i][j] = number of paths achieving that max score
  const dpScore = Array(n)
    .fill()
    .map(() => Array(n).fill(-1));
  const dpCount = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Base case: 'E' at (0,0) has score 0 and 1 way to be there
  dpScore[0][0] = 0;
  dpCount[0][0] = 1;

  // Process cells in row-major order from top-left to bottom-right
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // Skip obstacles and uninitialized cells
      if (board[i][j] === "X" || dpScore[i][j] === -1) {
        continue;
      }

      const currentScore = dpScore[i][j];

      // Check three possible moves: down, right, down-right
      // These correspond to moving up, left, up-left in the forward direction

      // Move down (forward: move up)
      if (i + 1 < n && board[i + 1][j] !== "X") {
        let newScore = currentScore;
        if (board[i + 1][j] !== "E" && board[i + 1][j] !== "S") {
          newScore += parseInt(board[i + 1][j]);
        }

        if (newScore > dpScore[i + 1][j]) {
          dpScore[i + 1][j] = newScore;
          dpCount[i + 1][j] = dpCount[i][j];
        } else if (newScore === dpScore[i + 1][j]) {
          dpCount[i + 1][j] = (dpCount[i + 1][j] + dpCount[i][j]) % MOD;
        }
      }

      // Move right (forward: move left)
      if (j + 1 < n && board[i][j + 1] !== "X") {
        let newScore = currentScore;
        if (board[i][j + 1] !== "E" && board[i][j + 1] !== "S") {
          newScore += parseInt(board[i][j + 1]);
        }

        if (newScore > dpScore[i][j + 1]) {
          dpScore[i][j + 1] = newScore;
          dpCount[i][j + 1] = dpCount[i][j];
        } else if (newScore === dpScore[i][j + 1]) {
          dpCount[i][j + 1] = (dpCount[i][j + 1] + dpCount[i][j]) % MOD;
        }
      }

      // Move down-right (forward: move up-left)
      if (i + 1 < n && j + 1 < n && board[i + 1][j + 1] !== "X") {
        let newScore = currentScore;
        if (board[i + 1][j + 1] !== "E" && board[i + 1][j + 1] !== "S") {
          newScore += parseInt(board[i + 1][j + 1]);
        }

        if (newScore > dpScore[i + 1][j + 1]) {
          dpScore[i + 1][j + 1] = newScore;
          dpCount[i + 1][j + 1] = dpCount[i][j];
        } else if (newScore === dpScore[i + 1][j + 1]) {
          dpCount[i + 1][j + 1] = (dpCount[i + 1][j + 1] + dpCount[i][j]) % MOD;
        }
      }
    }
  }

  // Get result from bottom-right cell ('S')
  const maxScore = dpScore[n - 1][n - 1] !== -1 ? dpScore[n - 1][n - 1] : 0;
  const pathCount = dpCount[n - 1][n - 1];

  return [maxScore, pathCount];
}
```

```java
// Time: O(n²) | Space: O(n²)
// where n is the board dimension
class Solution {
    public int[] pathsWithMaxScore(List<String> board) {
        int n = board.size();
        int MOD = 1000000007;

        // Initialize DP tables
        // dpScore[i][j] = max score from (i,j) to (0,0)
        // dpCount[i][j] = number of paths achieving that max score
        int[][] dpScore = new int[n][n];
        int[][] dpCount = new int[n][n];

        // Initialize with -1 for unreachable cells
        for (int i = 0; i < n; i++) {
            Arrays.fill(dpScore[i], -1);
        }

        // Base case: 'E' at (0,0) has score 0 and 1 way to be there
        dpScore[0][0] = 0;
        dpCount[0][0] = 1;

        // Process cells in row-major order from top-left to bottom-right
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // Skip obstacles and uninitialized cells
                if (board.get(i).charAt(j) == 'X' || dpScore[i][j] == -1) {
                    continue;
                }

                int currentScore = dpScore[i][j];

                // Check three possible moves: down, right, down-right
                // These correspond to moving up, left, up-left in the forward direction

                // Move down (forward: move up)
                if (i + 1 < n && board.get(i+1).charAt(j) != 'X') {
                    int newScore = currentScore;
                    char nextChar = board.get(i+1).charAt(j);
                    if (nextChar != 'E' && nextChar != 'S') {
                        newScore += nextChar - '0';
                    }

                    if (newScore > dpScore[i+1][j]) {
                        dpScore[i+1][j] = newScore;
                        dpCount[i+1][j] = dpCount[i][j];
                    } else if (newScore == dpScore[i+1][j]) {
                        dpCount[i+1][j] = (dpCount[i+1][j] + dpCount[i][j]) % MOD;
                    }
                }

                // Move right (forward: move left)
                if (j + 1 < n && board.get(i).charAt(j+1) != 'X') {
                    int newScore = currentScore;
                    char nextChar = board.get(i).charAt(j+1);
                    if (nextChar != 'E' && nextChar != 'S') {
                        newScore += nextChar - '0';
                    }

                    if (newScore > dpScore[i][j+1]) {
                        dpScore[i][j+1] = newScore;
                        dpCount[i][j+1] = dpCount[i][j];
                    } else if (newScore == dpScore[i][j+1]) {
                        dpCount[i][j+1] = (dpCount[i][j+1] + dpCount[i][j]) % MOD;
                    }
                }

                // Move down-right (forward: move up-left)
                if (i + 1 < n && j + 1 < n && board.get(i+1).charAt(j+1) != 'X') {
                    int newScore = currentScore;
                    char nextChar = board.get(i+1).charAt(j+1);
                    if (nextChar != 'E' && nextChar != 'S') {
                        newScore += nextChar - '0';
                    }

                    if (newScore > dpScore[i+1][j+1]) {
                        dpScore[i+1][j+1] = newScore;
                        dpCount[i+1][j+1] = dpCount[i][j];
                    } else if (newScore == dpScore[i+1][j+1]) {
                        dpCount[i+1][j+1] = (dpCount[i+1][j+1] + dpCount[i][j]) % MOD;
                    }
                }
            }
        }

        // Get result from bottom-right cell ('S')
        int maxScore = dpScore[n-1][n-1] != -1 ? dpScore[n-1][n-1] : 0;
        int pathCount = dpCount[n-1][n-1];

        return new int[]{maxScore, pathCount};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We process each of the n² cells exactly once
- For each cell, we perform constant-time operations (checking 3 neighbors, updating scores and counts)
- The double nested loop gives us O(n²) operations

**Space Complexity:** O(n²)

- We maintain two n×n DP tables: `dp_score` and `dp_count`
- Each table requires O(n²) space
- We could optimize to O(n) by only keeping the current and previous rows, but the code would be more complex

## Common Mistakes

1. **Forgetting to handle 'S' and 'E' as special cases**: These cells don't contribute to the score. If you add their character values (which aren't numbers), you'll get incorrect results or runtime errors.

2. **Not using modulo operations for large counts**: The number of paths can grow extremely large. Without modulo 10⁹+7, integer overflow will occur in most languages.

3. **Incorrect direction of DP propagation**: Some candidates try to go from 'S' to 'E' instead of 'E' to 'S'. While both are possible, going backward from destination to start is more intuitive because the destination has known values (score 0, count 1).

4. **Not handling obstacles properly**: 'X' cells should be completely unreachable. This means they should never contribute scores or path counts to neighboring cells.

5. **Missing the case where multiple neighbors have the same maximum score**: When two or three possible moves from a cell lead to the same maximum score, you need to sum their path counts, not just pick one.

## When You'll See This Pattern

This problem combines two classic DP patterns:

1. **Grid DP with multiple states**: Similar to:
   - [Unique Paths II](https://leetcode.com/problems/unique-paths-ii/) - Counting paths with obstacles
   - [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/) - Finding minimum score path
   - [Dungeon Game](https://leetcode.com/problems/dungeon-game/) - Complex grid DP with health constraints

2. **DP with auxiliary information**: Problems where you need to track more than just the optimal value:
   - [Number of Ways to Paint N × 3 Grid](https://leetcode.com/problems/number-of-ways-to-paint-n-3-grid/) - Counting valid configurations
   - [Knight Probability in Chessboard](https://leetcode.com/problems/knight-probability-in-chessboard/) - Probability as additional state

The core pattern is: when you need both the optimal value AND the count of ways to achieve it, maintain two DP tables that update together.

## Key Takeaways

1. **When a problem asks for both "maximum/minimum value" and "number of ways", think two DP tables**: One for the optimal value, one for the count. They update together based on the same transitions.

2. **Grid DP often works backward from destination to start**: The destination usually has known base values, making the recurrence more straightforward to implement.

3. **Pay attention to special cells and obstacles**: Always check for edge cases like start/end positions, obstacles, and boundary conditions before accessing array elements.

4. **Large counts need modulo arithmetic**: When counting combinatorial objects that grow quickly, always apply modulo operations to prevent overflow.

[Practice this problem on CodeJeet](/problem/number-of-paths-with-max-score)
