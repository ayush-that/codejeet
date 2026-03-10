---
title: "How to Solve Minimum Moves to Capture The Queen — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Capture The Queen. Medium difficulty, 22.3% acceptance rate. Topics: Math, Enumeration."
date: "2029-09-29"
category: "dsa-patterns"
tags: ["minimum-moves-to-capture-the-queen", "math", "enumeration", "medium"]
---

# How to Solve Minimum Moves to Capture The Queen

This problem presents a simplified chess scenario where you need to determine the minimum moves for white to capture the black queen, given that white has both a rook and a bishop on the board. The challenge lies in understanding chess piece movements and identifying the fewest moves needed when you can choose which piece to move. What makes this problem tricky is that you need to consider both pieces' capabilities, handle blocking scenarios, and account for the fact that pieces can't move through each other.

## Visual Walkthrough

Let's walk through an example: `a=1, b=1, c=3, d=3, e=5, f=5`

**Board Setup:**

- White rook at (1,1) - bottom-left corner
- White bishop at (3,3) - center-left diagonal
- Black queen at (5,5) - center-right diagonal

**Step 1: Check if queen is already under attack**

- Rook moves horizontally/vertically: From (1,1) to (5,5) - not same row or column ❌
- Bishop moves diagonally: From (3,3) to (5,5) - same diagonal! But we need to check if the path is clear...

**Step 2: Check if bishop can capture immediately**
Bishop at (3,3) and queen at (5,5) are on the same diagonal (slope = 1). The bishop would move along the path (3,3) → (4,4) → (5,5). Is the path blocked?

- Check if rook is blocking: Rook at (1,1) is not on the path between (3,3) and (5,5) ✅
  So bishop can capture in 1 move!

**Minimum moves = 1**

Let's try another example: `a=1, b=1, c=2, d=2, e=3, f=3`

**Board Setup:**

- Rook at (1,1)
- Bishop at (2,2)
- Queen at (3,3)

**Step 1: Check immediate captures**

- Rook: Not same row/column ❌
- Bishop: Same diagonal! But check path...

**Step 2: Check bishop's path**
Bishop at (2,2) to queen at (3,3) - direct diagonal move. Is rook blocking?
Rook at (1,1) is NOT between (2,2) and (3,3) ✅
So bishop can capture in 1 move!

**Minimum moves = 1**

One more tricky example: `a=1, b=1, c=2, d=2, e=8, f=8`

**Board Setup:**

- Rook at (1,1)
- Bishop at (2,2)
- Queen at (8,8)

**Step 1: Check immediate captures**

- Rook: Not same row/column ❌
- Bishop: Same diagonal! Check path...

**Step 2: Check bishop's path**
Bishop at (2,2) to queen at (8,8) - diagonal path. Is rook blocking?
Rook at (1,1) is NOT between (2,2) and (8,8) ✅
So bishop can capture in 1 move!

**Minimum moves = 1**

The key insight: We only need 2 moves maximum! Either:

1. One piece captures immediately (0 or 1 blocking scenarios)
2. We move one piece out of the way so the other can capture (2 moves)

## Brute Force Approach

A naive approach might try to simulate all possible moves, but that's overkill for this problem. The chessboard is only 8×8, but simulating moves would be complex because:

1. We'd need to track positions of all three pieces
2. We'd need to handle blocking rules
3. We'd need to consider which piece to move first
4. The search space, while finite, would be messy to implement

However, we can think about what a brute force reasoning process would look like:

1. Check if rook can capture queen immediately (same row/column, path not blocked)
2. Check if bishop can capture queen immediately (same diagonal, path not blocked)
3. If neither can capture immediately, try moving the rook to unblock the bishop
4. Try moving the bishop to unblock the rook
5. Try moving a piece to a position where it can capture in the next move

The key realization is that we never need more than 2 moves! This is because we can always:

- Move the blocking piece out of the way (1 move)
- Then capture with the other piece (1 move)

So our "brute force" is really just checking a few specific conditions.

## Optimized Approach

The optimal approach uses logical reasoning about chess piece movements:

**Key Insight 1: Maximum moves is 2**
We can always capture in at most 2 moves by:

1. Moving the piece that's blocking the other piece's path
2. Having the now-unblocked piece capture the queen

**Key Insight 2: Check for immediate capture (0 moves)**
A piece can capture immediately if:

- For rook: Same row (`a == e`) or same column (`b == f`) AND no other piece is blocking
- For bishop: Same diagonal (`abs(c-e) == abs(d-f)`) AND no other piece is blocking

**Key Insight 3: Check for 1-move capture**
If a piece is blocked, can we move it to capture in 1 move?
Actually, if a piece is blocked from capturing, we need to check if moving the blocking piece allows capture.

**Key Insight 4: The blocking logic**
A piece blocks another if it lies exactly on the path between the attacking piece and the queen. We need to check:

1. Is the piece between them? (using coordinate comparisons)
2. Is it exactly on the line? (for diagonals: same slope; for straight lines: same row/column)

**Key Insight 5: Special case - rook and bishop attack the same square**
If both rook and bishop can attack the queen from their starting positions (even if blocked), we might capture in 1 move by moving the blocking piece.

The algorithm becomes:

1. Check if rook can capture immediately → return 1
2. Check if bishop can capture immediately → return 1
3. Otherwise return 2 (since we can always capture in 2 moves by moving the blocking piece)

Wait, that's too simple! We need to be careful about the "immediate capture" checks - they must account for blocking.

## Optimal Solution

The complete solution involves checking all possible scenarios:

1. **Check if rook can capture immediately**: Same row/column AND bishop is not blocking
2. **Check if bishop can capture immediately**: Same diagonal AND rook is not blocking
3. **Check if we can capture in 1 move by moving the blocking piece**: This happens when the queen is under attack from both pieces but one is blocked by the other
4. **Otherwise, return 2** (move blocking piece, then capture)

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def minMovesToCaptureTheQueen(a: int, b: int, c: int, d: int, e: int, f: int) -> int:
    """
    Calculate minimum moves for white to capture black queen.

    Args:
        a, b: Rook position (row, column)
        c, d: Bishop position (row, column)
        e, f: Queen position (row, column)

    Returns:
        Minimum moves (1 or 2)
    """

    # Helper function to check if a point is between two other points on a straight line
    def is_between(x1, y1, x2, y2, x3, y3):
        """Check if (x2,y2) is strictly between (x1,y1) and (x3,y3) on a straight line."""
        # For horizontal/vertical lines
        if x1 == x2 == x3:
            return min(y1, y3) < y2 < max(y1, y3)
        if y1 == y2 == y3:
            return min(x1, x3) < x2 < max(x1, x3)
        # For diagonal lines (45 degree)
        if abs(x1 - x3) == abs(y1 - y3) and abs(x1 - x2) == abs(y1 - y2):
            # Check if (x2,y2) is between (x1,y1) and (x3,y3) on the diagonal
            dx1 = x2 - x1
            dx2 = x3 - x1
            dy1 = y2 - y1
            dy2 = y3 - y1
            # They should have same sign and |dx1| < |dx2|
            return dx1 * dx2 > 0 and dy1 * dy2 > 0 and abs(dx1) < abs(dx2)
        return False

    # Case 1: Rook can capture queen immediately
    # Rook moves horizontally or vertically
    if a == e or b == f:
        # Check if bishop is blocking the path
        if not is_between(a, b, c, d, e, f):
            return 1

    # Case 2: Bishop can capture queen immediately
    # Bishop moves diagonally (absolute difference in rows equals absolute difference in columns)
    if abs(c - e) == abs(d - f):
        # Check if rook is blocking the path
        if not is_between(c, d, a, b, e, f):
            return 1

    # Case 3: Queen is under double attack but one piece blocks the other
    # This is a special case where we might capture in 1 move
    # The queen is attacked by both rook and bishop, but one blocks the other
    # Actually, in this case we still need 2 moves (move blocker, then capture)
    # So we don't have a case for 1 move here

    # All other cases: We can capture in 2 moves
    # Move the piece that's blocking, then capture with the other piece
    return 2
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate minimum moves for white to capture black queen.
 *
 * @param {number} a - Rook row
 * @param {number} b - Rook column
 * @param {number} c - Bishop row
 * @param {number} d - Bishop column
 * @param {number} e - Queen row
 * @param {number} f - Queen column
 * @return {number} Minimum moves (1 or 2)
 */
function minMovesToCaptureTheQueen(a, b, c, d, e, f) {
  /**
   * Check if (x2,y2) is strictly between (x1,y1) and (x3,y3) on a straight line.
   */
  function isBetween(x1, y1, x2, y2, x3, y3) {
    // For horizontal lines (same row)
    if (x1 === x2 && x2 === x3) {
      return (y1 < y2 && y2 < y3) || (y3 < y2 && y2 < y1);
    }
    // For vertical lines (same column)
    if (y1 === y2 && y2 === y3) {
      return (x1 < x2 && x2 < x3) || (x3 < x2 && x2 < x1);
    }
    // For diagonal lines (45 degree)
    if (Math.abs(x1 - x3) === Math.abs(y1 - y3) && Math.abs(x1 - x2) === Math.abs(y1 - y2)) {
      // Check if (x2,y2) is between (x1,y1) and (x3,y3) on the diagonal
      const dx1 = x2 - x1;
      const dx2 = x3 - x1;
      const dy1 = y2 - y1;
      const dy2 = y3 - y1;
      // They should have same sign and |dx1| < |dx2|
      return dx1 * dx2 > 0 && dy1 * dy2 > 0 && Math.abs(dx1) < Math.abs(dx2);
    }
    return false;
  }

  // Case 1: Rook can capture queen immediately
  // Rook moves horizontally or vertically
  if (a === e || b === f) {
    // Check if bishop is blocking the path
    if (!isBetween(a, b, c, d, e, f)) {
      return 1;
    }
  }

  // Case 2: Bishop can capture queen immediately
  // Bishop moves diagonally
  if (Math.abs(c - e) === Math.abs(d - f)) {
    // Check if rook is blocking the path
    if (!isBetween(c, d, a, b, e, f)) {
      return 1;
    }
  }

  // All other cases: We can capture in 2 moves
  // Move the blocking piece, then capture with the other piece
  return 2;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate minimum moves for white to capture black queen.
     *
     * @param a Rook row
     * @param b Rook column
     * @param c Bishop row
     * @param d Bishop column
     * @param e Queen row
     * @param f Queen column
     * @return Minimum moves (1 or 2)
     */
    public int minMovesToCaptureTheQueen(int a, int b, int c, int d, int e, int f) {
        // Case 1: Rook can capture queen immediately
        // Rook moves horizontally or vertically
        if (a == e || b == f) {
            // Check if bishop is blocking the path
            if (!isBetween(a, b, c, d, e, f)) {
                return 1;
            }
        }

        // Case 2: Bishop can capture queen immediately
        // Bishop moves diagonally
        if (Math.abs(c - e) == Math.abs(d - f)) {
            // Check if rook is blocking the path
            if (!isBetween(c, d, a, b, e, f)) {
                return 1;
            }
        }

        // All other cases: We can capture in 2 moves
        // Move the blocking piece, then capture with the other piece
        return 2;
    }

    /**
     * Check if (x2,y2) is strictly between (x1,y1) and (x3,y3) on a straight line.
     */
    private boolean isBetween(int x1, int y1, int x2, int y2, int x3, int y3) {
        // For horizontal lines (same row)
        if (x1 == x2 && x2 == x3) {
            return (y1 < y2 && y2 < y3) || (y3 < y2 && y2 < y1);
        }
        // For vertical lines (same column)
        if (y1 == y2 && y2 == y3) {
            return (x1 < x2 && x2 < x3) || (x3 < x2 && x2 < x1);
        }
        // For diagonal lines (45 degree)
        if (Math.abs(x1 - x3) == Math.abs(y1 - y3) &&
            Math.abs(x1 - x2) == Math.abs(y1 - y2)) {
            // Check if (x2,y2) is between (x1,y1) and (x3,y3) on the diagonal
            int dx1 = x2 - x1;
            int dx2 = x3 - x1;
            int dy1 = y2 - y1;
            int dy2 = y3 - y1;
            // They should have same sign and |dx1| < |dx2|
            return dx1 * dx2 > 0 && dy1 * dy2 > 0 && Math.abs(dx1) < Math.abs(dx2);
        }
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- All operations are constant time: comparisons, arithmetic operations, and absolute values
- The `isBetween` function performs a fixed number of comparisons regardless of input
- No loops or recursion that depend on input size

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No data structures that grow with input size
- The recursion depth is constant (no recursion in this solution)

The constant time/space complexity makes sense because:

1. The chessboard size is fixed (8×8)
2. We only have 3 pieces to consider
3. We're not simulating moves, just checking geometric relationships

## Common Mistakes

1. **Forgetting to check for blocking pieces**: The most common error is checking if a piece can attack the queen without verifying if the path is clear. Remember: chess pieces can't move through other pieces!

2. **Incorrect diagonal checking**: When checking if the bishop can attack, candidates often forget that `abs(c-e) == abs(d-f)` is the condition for being on the same diagonal. They might try to calculate slopes, which can lead to floating-point precision issues.

3. **Off-by-one errors in "between" checks**: When determining if a piece is between two others, you must check for _strict_ betweenness. A piece is NOT blocking if it's at the same position as the attacker or target.

4. **Overcomplicating with BFS/DFS**: Some candidates try to implement full pathfinding with BFS or DFS. While this would work, it's unnecessary and more error-prone for this constrained problem.

5. **Missing the "maximum 2 moves" insight**: Without realizing you never need more than 2 moves, you might try to calculate exact distances or implement complex logic.

## When You'll See This Pattern

This problem combines **geometric reasoning** with **constraint checking**, which appears in several coding interview problems:

1. **"Available Captures for Rook" (LeetCode 999)**: Similar piece movement logic but simpler since it only involves a rook capturing pawns.

2. **"Queens That Can Attack the King" (LeetCode 1222)**: Requires checking multiple attack directions from the king's perspective, similar to checking if pieces are on the same row/column/diagonal.

3. **"N-Queens" problems**: While more complex, they use similar diagonal checking logic (`abs(row1 - row2) == abs(col1 - col2)`).

4. **Line of sight problems in game development**: Determining if one object can "see" another without obstacles in between uses similar betweenness checks.

The core pattern is: **Given positions on a grid, determine geometric relationships (same line, betweenness) and apply game-specific rules.**

## Key Takeaways

1. **Simplify with logical reasoning**: Instead of simulating all moves, reason about the minimum possible moves. The insight that you never need more than 2 moves is crucial.

2. **Break down complex rules**: Chess has many rules, but for this problem we only need: piece movement patterns and blocking logic. Isolate what matters.

3. **Geometric checks are fundamental**: Learn to check for:
   - Same row/column: `x1 == x2` or `y1 == y2`
   - Same diagonal: `abs(x1 - x2) == abs(y1 - y2)`
   - Point between two others: coordinate comparisons with careful inequality directions

4. **Test edge cases**: Always test scenarios where pieces are aligned but blocked, exactly on the same square (not possible here), or at board edges.

Related problems: [Available Captures for Rook](/problem/available-captures-for-rook), [Queens That Can Attack the King](/problem/queens-that-can-attack-the-king)
