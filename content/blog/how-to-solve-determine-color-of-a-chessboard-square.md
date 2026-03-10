---
title: "How to Solve Determine Color of a Chessboard Square — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Determine Color of a Chessboard Square. Easy difficulty, 79.8% acceptance rate. Topics: Math, String."
date: "2027-03-05"
category: "dsa-patterns"
tags: ["determine-color-of-a-chessboard-square", "math", "string", "easy"]
---

## How to Solve "Determine Color of a Chessboard Square"

You're given a chessboard coordinate like `"a1"` or `"h8"` and need to determine whether that square is white. The chessboard alternates colors in a checkerboard pattern, starting with a dark square at `"a1"`. While this seems trivial, the trick lies in recognizing the mathematical pattern without hardcoding the entire board. This problem tests your ability to extract patterns from visual problems and implement them cleanly.

## Visual Walkthrough

Let's trace through `"c3"` step by step:

1. **Break down the coordinate**: `"c3"` means column `'c'` (3rd letter) and row `3`.
2. **Convert to indices**:
   - Column: `'a'` = 1, `'b'` = 2, `'c'` = 3
   - Row: `3` = 3
3. **Observe the pattern**: On a chessboard, squares are white when:
   - Both column and row are odd (1,1 = a1 is dark, so actually white squares occur when...)
     Let's check examples:
   - `"a1"` (1,1): Dark (odd+odd = even index sum? Let's check: 1+1=2, even = dark)
   - `"a2"` (1,2): White (1+2=3, odd = white)
   - `"b1"` (2,1): White (2+1=3, odd = white)
   - `"b2"` (2,2): Dark (2+2=4, even = dark)

**Pattern discovered**: White squares have **odd** sums of (column index + row index). Dark squares have **even** sums.

4. **Apply to `"c3"`**:
   - Column 'c' = 3, row = 3
   - Sum = 3 + 3 = 6 (even)
   - Result: Dark square → `false`

## Brute Force Approach

A naive approach would be to hardcode the entire chessboard as a 2D array or dictionary mapping each coordinate to its color. While this would work (there are only 64 squares), it's inefficient in terms of code length and doesn't demonstrate problem-solving skills. More importantly, it doesn't scale conceptually—imagine if the board were 1000×1000!

```python
# Not recommended - hardcoded approach
def squareIsWhite(coordinates):
    board = {
        "a1": False, "a2": True, "a3": False, "a4": True,
        "a5": False, "a6": True, "a7": False, "a8": True,
        # ... and so on for all 64 squares
    }
    return board[coordinates]
```

**Why this fails**: It's verbose, error-prone, and doesn't show the interviewer you can identify patterns. The interviewer wants to see you derive the mathematical relationship.

## Optimal Solution

The key insight is that chessboard colors alternate in both directions. If we number columns (a=1, b=2, etc.) and rows (1=1, 2=2, etc.), then:

- `(column + row) % 2 == 0` → dark square (returns `false`)
- `(column + row) % 2 == 1` → white square (returns `true`)

Wait, let's verify with `"a1"`: column=1, row=1, sum=2, even → dark (correct, returns `false`).
For `"a2"`: column=1, row=2, sum=3, odd → white (correct, returns `true`).

So our formula is: `return (column + row) % 2 == 1`

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def squareIsWhite(coordinates):
    # Extract column letter and row number from the coordinate string
    col_letter, row_str = coordinates[0], coordinates[1]

    # Convert column letter to numerical index: 'a' -> 1, 'b' -> 2, etc.
    # ord('a') = 97, so ord(col_letter) - ord('a') + 1 gives us 1 for 'a'
    col_num = ord(col_letter) - ord('a') + 1

    # Convert row character to integer
    row_num = int(row_str)

    # White squares have odd sum of column and row indices
    # Dark squares have even sum
    return (col_num + row_num) % 2 == 1
```

```javascript
// Time: O(1) | Space: O(1)
function squareIsWhite(coordinates) {
  // Split the coordinate into column letter and row number
  const colLetter = coordinates[0];
  const rowStr = coordinates[1];

  // Convert column letter to number: 'a' -> 1, 'b' -> 2, etc.
  // charCodeAt('a') = 97, so subtract 96 to get 1 for 'a'
  const colNum = colLetter.charCodeAt(0) - "a".charCodeAt(0) + 1;

  // Convert row character to integer
  const rowNum = parseInt(rowStr);

  // White squares have odd sum, dark squares have even sum
  return (colNum + rowNum) % 2 === 1;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public boolean squareIsWhite(String coordinates) {
        // Extract column letter and row number
        char colLetter = coordinates.charAt(0);
        char rowChar = coordinates.charAt(1);

        // Convert column letter to number: 'a' -> 1, 'b' -> 2, etc.
        // In Java, subtracting 'a' gives 0 for 'a', so add 1
        int colNum = colLetter - 'a' + 1;

        // Convert row character to integer
        int rowNum = Character.getNumericValue(rowChar);

        // White squares have odd sum, dark squares have even sum
        return (colNum + rowNum) % 2 == 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(1)  
We perform a constant number of operations: extracting characters, converting letters to numbers, and one arithmetic operation. The input size is always exactly 2 characters.

**Space Complexity**: O(1)  
We use only a few integer variables regardless of input size. No additional data structures scale with input.

## Common Mistakes

1. **Off-by-one errors in column conversion**: Forgetting that `ord('a')` is 97, not 1. If you use `ord(col_letter) - 96` instead of `- 97 + 1`, that's actually correct (96 = 97 - 1). But using `ord(col_letter) - ord('a')` gives 0 for 'a', so you must add 1.

2. **Incorrect parity check**: Mixing up whether white squares have even or odd sums. Always test with `"a1"` (dark) and `"a2"` (white) to verify your logic. Remember: `(1+1)=2` even → dark, `(1+2)=3` odd → white.

3. **Not converting row character to integer**: Trying to use `rowStr` directly in arithmetic without converting from char/string to int. In Python, `int(coordinates[1])` is needed; in JavaScript, `parseInt()`; in Java, `Character.getNumericValue()` or subtracting `'0'`.

4. **Assuming the board starts with white**: Chessboards traditionally have a dark square at `"a1"` (bottom-left from white's perspective). Some candidates assume `"a1"` is white, which flips all results.

## When You'll See This Pattern

This problem uses **coordinate parity checking**, a common pattern in grid/board problems:

1. **Check if Two Chessboard Squares Have the Same Color** (LeetCode 2490): Direct extension—check if `(col1+row1)` and `(col2+row2)` have the same parity.

2. **Minimum Moves to Reach Target with Rotations** (LeetCode 1210): Uses parity to determine reachable positions in grid problems.

3. **Bishop and Pawn** (CodeSignal): Determines if a bishop can capture a pawn based on diagonal movement, which depends on same-color squares.

The core technique is converting spatial/visual patterns into mathematical relationships, often using modular arithmetic (mod 2 for alternating patterns, mod other values for repeating patterns).

## Key Takeaways

1. **Look for mathematical patterns in visual problems**: Instead of hardcoding, ask "what formula describes this pattern?" Chessboards, checkerboards, and alternating patterns often use `(x + y) % 2`.

2. **Test with corner cases**: Always verify your formula with `"a1"`, `"a2"`, `"h1"`, and `"h8"` to ensure it works at boundaries.

3. **Coordinate conversion is a common subproblem**: Converting between letter/number coordinates and indices appears in spreadsheet columns (A→1, Z→26, AA→27) and other grid problems.

Related problems: [Check if Two Chessboard Squares Have the Same Color](/problem/check-if-two-chessboard-squares-have-the-same-color)
