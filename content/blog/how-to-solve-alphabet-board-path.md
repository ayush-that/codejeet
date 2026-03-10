---
title: "How to Solve Alphabet Board Path — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Alphabet Board Path. Medium difficulty, 51.8% acceptance rate. Topics: Hash Table, String."
date: "2028-05-01"
category: "dsa-patterns"
tags: ["alphabet-board-path", "hash-table", "string", "medium"]
---

# How to Solve Alphabet Board Path

This problem asks us to generate a sequence of moves on a special alphabet board to spell out a target string. The board is arranged as `["abcde", "fghij", "klmno", "pqrst", "uvwxy", "z"]`, where 'z' sits alone in the bottom-left corner. Starting at position (0,0) (letter 'a'), we need to output a string like "RDD!U!" where 'U', 'D', 'L', 'R' move up/down/left/right and '!' indicates we press the current letter.

What makes this problem tricky is the irregular board shape — 'z' is isolated in the last row, which means moving from 'z' to other letters (or vice versa) requires careful handling to avoid invalid moves off the board.

## Visual Walkthrough

Let's trace through `target = "zdz"`:

1. **Start at 'a' (0,0), target first letter 'z' (5,0):**
   - Current: row=0, col=0
   - Target 'z': row=5, col=0
   - We need to move down 5 rows: "DDDDD"
   - Press 'z': "!"
   - Path so far: "DDDDD!"

2. **From 'z' (5,0) to 'd' (0,3):**
   - Current: row=5, col=0
   - Target 'd': row=0, col=3
   - Important: We can't move right from 'z' immediately because there's no cell (5,1)!
   - Solution: Move up first, then right
   - Move up 5 rows: "UUUUU"
   - Move right 3 columns: "RRR"
   - Press 'd': "!"
   - Path so far: "DDDDD!UUUUURRR!"

3. **From 'd' (0,3) back to 'z' (5,0):**
   - Current: row=0, col=3
   - Target 'z': row=5, col=0
   - Can't move down from row 0, col 3 directly to 'z' — would need to go through non-existent cells
   - Solution: Move left first, then down
   - Move left 3 columns: "LLL"
   - Move down 5 rows: "DDDDD"
   - Press 'z': "!"
   - Final path: "DDDDD!UUUUURRR!LLLDDDDD!"

The key insight: **When moving to/from 'z', handle vertical moves before horizontal moves if going to 'z', and horizontal moves before vertical moves if leaving 'z'**.

## Brute Force Approach

A naive approach might try to BFS from each current position to each target letter, recording the shortest path. For each character in the target string (length n), we'd explore up to 26 positions with BFS that could visit all 26 cells in worst case. This gives O(n × 26²) = O(676n) operations, which is inefficient.

Even simpler: we could precompute all-pairs shortest paths (26×26) using BFS 26 times, then concatenate results. While this would work (O(26²) precomputation, O(n) lookup), it's overkill and doesn't teach the coordinate-based insight.

The real "brute force" mistake candidates make is trying to handle moves without considering the 'z' edge case, resulting in attempts to move to invalid board positions.

## Optimized Approach

The optimal solution uses **coordinate calculation**:

1. **Map each letter to its board coordinates:**
   - 'a' → (0,0), 'b' → (0,1), ..., 'z' → (5,0)
   - We can compute this mathematically: `row = (ord(ch) - ord('a')) // 5`, `col = (ord(ch) - ord('a')) % 5`

2. **For each target letter:**
   - Calculate vertical difference: `row_diff = target_row - current_row`
   - Calculate horizontal difference: `col_diff = target_col - current_col`
3. **Generate moves with 'z' handling:**
   - If moving **to 'z'** (target at row 5): move left/right first, then down
   - If moving **from 'z'** (current at row 5): move up first, then left/right
   - Otherwise: move vertically then horizontally (or vice versa — order doesn't matter for non-'z' positions)

4. **Append '!'** after reaching each target letter

This approach is O(n) time since we process each character once with constant-time coordinate calculations.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n = len(target) | Space: O(n) for output string
def alphabetBoardPath(target: str) -> str:
    """
    Generate move sequence to spell target on alphabet board.
    Key insight: Handle 'z' specially due to its isolated position.
    """
    result = []
    # Start at 'a' position
    curr_row, curr_col = 0, 0

    for ch in target:
        # Convert character to board coordinates
        # ord(ch) - ord('a') gives 0-25 index
        target_idx = ord(ch) - ord('a')
        target_row = target_idx // 5  # 5 columns per row
        target_col = target_idx % 5

        # Calculate required moves
        row_diff = target_row - curr_row
        col_diff = target_col - curr_col

        # SPECIAL HANDLING FOR 'z':
        # When moving TO 'z' (row 5), we must move LEFT/RIGHT before DOWN
        # to avoid trying to move right from position (5,0) which doesn't exist
        if target_row == 5 and target_col == 0:  # Moving to 'z'
            # Horizontal moves first (if needed), then vertical
            if col_diff < 0:
                result.append('L' * (-col_diff))
            elif col_diff > 0:
                result.append('R' * col_diff)
            if row_diff < 0:
                result.append('U' * (-row_diff))
            elif row_diff > 0:
                result.append('D' * row_diff)

        # When moving FROM 'z' (current at row 5), we must move UP before LEFT/RIGHT
        elif curr_row == 5 and curr_col == 0:  # Moving from 'z'
            # Vertical moves first, then horizontal
            if row_diff < 0:
                result.append('U' * (-row_diff))
            elif row_diff > 0:
                result.append('D' * row_diff)
            if col_diff < 0:
                result.append('L' * (-col_diff))
            elif col_diff > 0:
                result.append('R' * col_diff)

        # Normal case (not involving 'z' in problematic way)
        else:
            # Standard order: vertical then horizontal works fine
            if row_diff < 0:
                result.append('U' * (-row_diff))
            elif row_diff > 0:
                result.append('D' * row_diff)
            if col_diff < 0:
                result.append('L' * (-col_diff))
            elif col_diff > 0:
                result.append('R' * col_diff)

        # Press the current letter
        result.append('!')

        # Update current position
        curr_row, curr_col = target_row, target_col

    return ''.join(result)
```

```javascript
// Time: O(n) where n = target.length | Space: O(n) for output string
/**
 * Generate move sequence to spell target on alphabet board.
 * Key insight: Handle 'z' specially due to its isolated position.
 */
function alphabetBoardPath(target) {
  let result = [];
  // Start at 'a' position
  let currRow = 0,
    currCol = 0;

  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    // Convert character to board coordinates
    // charCodeAt gives ASCII, subtract 'a' gives 0-25 index
    const targetIdx = ch.charCodeAt(0) - "a".charCodeAt(0);
    const targetRow = Math.floor(targetIdx / 5); // 5 columns per row
    const targetCol = targetIdx % 5;

    // Calculate required moves
    const rowDiff = targetRow - currRow;
    const colDiff = targetCol - currCol;

    // SPECIAL HANDLING FOR 'z':
    // When moving TO 'z' (row 5), move LEFT/RIGHT before DOWN
    if (targetRow === 5 && targetCol === 0) {
      // Horizontal moves first
      if (colDiff < 0) result.push("L".repeat(-colDiff));
      else if (colDiff > 0) result.push("R".repeat(colDiff));
      // Then vertical moves
      if (rowDiff < 0) result.push("U".repeat(-rowDiff));
      else if (rowDiff > 0) result.push("D".repeat(rowDiff));
    }
    // When moving FROM 'z', move UP before LEFT/RIGHT
    else if (currRow === 5 && currCol === 0) {
      // Vertical moves first
      if (rowDiff < 0) result.push("U".repeat(-rowDiff));
      else if (rowDiff > 0) result.push("D".repeat(rowDiff));
      // Then horizontal moves
      if (colDiff < 0) result.push("L".repeat(-colDiff));
      else if (colDiff > 0) result.push("R".repeat(colDiff));
    }
    // Normal case
    else {
      // Standard order: vertical then horizontal
      if (rowDiff < 0) result.push("U".repeat(-rowDiff));
      else if (rowDiff > 0) result.push("D".repeat(rowDiff));
      if (colDiff < 0) result.push("L".repeat(-colDiff));
      else if (colDiff > 0) result.push("R".repeat(colDiff));
    }

    // Press the current letter
    result.push("!");

    // Update current position
    currRow = targetRow;
    currCol = targetCol;
  }

  return result.join("");
}
```

```java
// Time: O(n) where n = target.length() | Space: O(n) for output string
class Solution {
    public String alphabetBoardPath(String target) {
        StringBuilder result = new StringBuilder();
        // Start at 'a' position
        int currRow = 0, currCol = 0;

        for (int i = 0; i < target.length(); i++) {
            char ch = target.charAt(i);
            // Convert character to board coordinates
            // 'a' - 'a' = 0, 'z' - 'a' = 25
            int targetIdx = ch - 'a';
            int targetRow = targetIdx / 5;  // 5 columns per row
            int targetCol = targetIdx % 5;

            // Calculate required moves
            int rowDiff = targetRow - currRow;
            int colDiff = targetCol - currCol;

            // SPECIAL HANDLING FOR 'z':
            // When moving TO 'z' (row 5), move LEFT/RIGHT before DOWN
            if (targetRow == 5 && targetCol == 0) {
                // Horizontal moves first
                if (colDiff < 0) result.append("L".repeat(-colDiff));
                else if (colDiff > 0) result.append("R".repeat(colDiff));
                // Then vertical moves
                if (rowDiff < 0) result.append("U".repeat(-rowDiff));
                else if (rowDiff > 0) result.append("D".repeat(rowDiff));
            }
            // When moving FROM 'z', move UP before LEFT/RIGHT
            else if (currRow == 5 && currCol == 0) {
                // Vertical moves first
                if (rowDiff < 0) result.append("U".repeat(-rowDiff));
                else if (rowDiff > 0) result.append("D".repeat(rowDiff));
                // Then horizontal moves
                if (colDiff < 0) result.append("L".repeat(-colDiff));
                else if (colDiff > 0) result.append("R".repeat(colDiff));
            }
            // Normal case
            else {
                // Standard order: vertical then horizontal
                if (rowDiff < 0) result.append("U".repeat(-rowDiff));
                else if (rowDiff > 0) result.append("D".repeat(rowDiff));
                if (colDiff < 0) result.append("L".repeat(-colDiff));
                else if (colDiff > 0) result.append("R".repeat(colDiff));
            }

            // Press the current letter
            result.append('!');

            // Update current position
            currRow = targetRow;
            currCol = targetCol;
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the target string. We process each character exactly once, performing constant-time operations (character to coordinate conversion, difference calculation, string building).

**Space Complexity:** O(n) for the output string. Each character in the target could require up to ~10 moves (worst case: moving from 'a' to 'z' or vice versa), so the output length is O(n). We use O(n) additional space to build the result (except in Java where StringBuilder uses amortized O(n) space).

## Common Mistakes

1. **Not handling the 'z' edge case:** The most frequent error is treating the board as a perfect 5×5 grid. Since 'z' is at (5,0) with no cells to its right, moving from 'y' (4,4) to 'z' requires going left first, then down. Similarly, moving from 'z' to 'a' requires going up first, then right.

2. **Incorrect coordinate calculation:** Using `row = idx // 6` instead of `idx // 5` because there are 6 rows. But actually rows 0-4 have 5 columns, row 5 has only 1 column. The formula `row = idx // 5` works because indices 0-24 go to rows 0-4, and index 25 goes to row 5.

3. **Forgetting to update current position:** After processing each character, you must update `curr_row` and `curr_col` to the target position. Otherwise, all moves will be calculated from the starting position 'a'.

4. **Inefficient string concatenation:** Using `result += "U" * 5` in a loop creates new strings each time. Better to use list/array joining (Python/JavaScript) or StringBuilder (Java).

## When You'll See This Pattern

This problem combines **coordinate mapping** with **path generation with constraints**, similar to:

1. **Robot Return to Origin (LeetCode 657):** Simpler version where you just track net movement. This problem adds the complexity of generating the actual path.

2. **Minimum Path Sum (LeetCode 64):** Both involve moving on a grid with coordinate calculations, though that uses DP for optimization.

3. **Word Search (LeetCode 79):** Another grid navigation problem, though with backtracking search rather than direct coordinate calculation.

The core pattern is: **Map abstract positions to coordinates, calculate differences, generate constrained moves**. You'll see this in any problem involving movement on non-standard grids or with movement constraints.

## Key Takeaways

1. **Always visualize irregular grids:** When a problem gives a non-rectangular or irregular board, draw it and identify edge cases. Here, 'z' being alone in the last row was the key constraint.

2. **Coordinate mapping is powerful:** Converting letters/items to row/col coordinates (using division and modulo) lets you use simple arithmetic instead of complex search algorithms.

3. **Order matters with constraints:** When movement has restrictions (like can't move right from 'z'), you must sequence moves carefully. Test both directions of movement between constrained positions.

[Practice this problem on CodeJeet](/problem/alphabet-board-path)
