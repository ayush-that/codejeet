---
title: "How to Solve Queens That Can Attack the King — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Queens That Can Attack the King. Medium difficulty, 72.6% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2028-07-22"
category: "dsa-patterns"
tags: ["queens-that-can-attack-the-king", "array", "matrix", "simulation", "medium"]
---

# How to Solve Queens That Can Attack the King

This problem asks us to find all black queens that can attack the white king on an 8×8 chessboard. A queen can attack the king if they're in the same row, column, or diagonal without any pieces blocking the path. The tricky part is that we have multiple queens, and we need to find only the ones that have a clear line of sight to the king—not just any queen in the same row/column/diagonal.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
queens = [[0,1],[1,0],[4,0],[0,4],[3,3],[2,4]]
king = [0,0]
```

**Step-by-step reasoning:**

1. **Board setup:** We have a standard chessboard with coordinates from [0,0] to [7,7]. The king is at (0,0).

2. **Queen positions:**
   - (0,1): Same column as king (x=0), directly above
   - (1,0): Same row as king (y=0), directly to the right
   - (4,0): Same row as king but farther away
   - (0,4): Same column as king but farther away
   - (3,3): Diagonal from king (x-y = 0)
   - (2,4): Not in same row, column, or diagonal

3. **Checking attack paths:**
   - From king at (0,0), we look in all 8 directions
   - **Up (north):** Check positions (0,1), (0,2), (0,3), (0,4)... We find queen at (0,1) first
   - **Right (east):** Check (1,0), (2,0), (3,0), (4,0)... We find queen at (1,0) first
   - **Down-right (southeast):** Check (1,1), (2,2), (3,3)... We find queen at (3,3)
   - Other directions have no queens

4. **Blocking consideration:** Queen at (0,4) is in the same column but queen at (0,1) blocks it. Queen at (4,0) is in the same row but queen at (1,0) blocks it.

**Result:** [[0,1],[1,0],[3,3]]

## Brute Force Approach

A naive approach would be to check every queen and see if it can attack the king:

1. For each queen, check if it's in the same row, column, or diagonal as the king
2. If yes, check if there are any other pieces blocking the path
3. To check blocking, we'd need to examine all positions between the queen and king

The problem with this approach is the blocking check. We'd need to:

- Generate all positions between the queen and king
- Check if any other queen occupies those positions
- This becomes O(n²) where n is the number of queens (up to 63)

Even worse, if we're not careful, we might miss that a queen closer to the king blocks a farther queen in the same line. We'd need to sort queens by distance from the king for each direction, which adds complexity.

## Optimized Approach

The key insight is to **search outward from the king** rather than checking each queen. This way:

1. We only need to find the closest queen in each of the 8 directions
2. The first queen we encounter in each direction is the attacking queen (if any)
3. We don't need to check farther queens because they're blocked by the closer one

**Step-by-step reasoning:**

1. **Convert queen positions to a set** for O(1) lookup
2. **Define 8 direction vectors:** [0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1]
3. **For each direction:**
   - Start at the king's position
   - Move one step in that direction
   - Check if there's a queen at that position
   - If yes, add it to results and stop searching this direction
   - If no, continue moving until we go off the board
4. **Return all found attacking queens**

This approach is efficient because:

- We only check up to 7 positions in each direction (board is 8×8)
- Total checks: 8 directions × max 7 steps = 56 checks
- This is constant time regardless of how many queens there are

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) - constant time since board is fixed 8x8
# Space: O(1) - constant space for result and queen set
def queensAttacktheKing(queens, king):
    """
    Find all queens that can attack the king.

    Args:
        queens: List of [x, y] positions of black queens
        king: [x, y] position of white king

    Returns:
        List of queen positions that can attack the king
    """
    # Convert queen positions to a set for O(1) lookup
    # Using tuple because lists can't be hashed in Python
    queen_set = set((x, y) for x, y in queens)

    # All 8 possible directions a queen can attack from
    # [dx, dy] where dx is change in x, dy is change in y
    directions = [
        [0, 1],   # up (north)
        [1, 1],   # up-right (northeast)
        [1, 0],   # right (east)
        [1, -1],  # down-right (southeast)
        [0, -1],  # down (south)
        [-1, -1], # down-left (southwest)
        [-1, 0],  # left (west)
        [-1, 1]   # up-left (northwest)
    ]

    result = []

    # Check each direction from the king
    for dx, dy in directions:
        # Start from the king's position
        x, y = king[0], king[1]

        # Move in the current direction until we go off the board
        while 0 <= x < 8 and 0 <= y < 8:
            # Move one step in the current direction
            x += dx
            y += dy

            # Check if we're still on the board
            if 0 <= x < 8 and 0 <= y < 8:
                # Check if there's a queen at this position
                if (x, y) in queen_set:
                    # Found the closest queen in this direction
                    result.append([x, y])
                    # Stop searching this direction (farther queens are blocked)
                    break
            else:
                # We've gone off the board
                break

    return result
```

```javascript
// Time: O(1) - constant time since board is fixed 8x8
// Space: O(1) - constant space for result and queen set
function queensAttacktheKing(queens, king) {
  /**
   * Find all queens that can attack the king.
   *
   * @param {number[][]} queens - Array of [x, y] positions of black queens
   * @param {number[]} king - [x, y] position of white king
   * @return {number[][]} Queen positions that can attack the king
   */

  // Convert queen positions to a Set for O(1) lookup
  // Use string keys since JavaScript Sets compare by reference for objects
  const queenSet = new Set();
  for (const [x, y] of queens) {
    queenSet.add(`${x},${y}`);
  }

  // All 8 possible directions a queen can attack from
  // [dx, dy] where dx is change in x, dy is change in y
  const directions = [
    [0, 1], // up (north)
    [1, 1], // up-right (northeast)
    [1, 0], // right (east)
    [1, -1], // down-right (southeast)
    [0, -1], // down (south)
    [-1, -1], // down-left (southwest)
    [-1, 0], // left (west)
    [-1, 1], // up-left (northwest)
  ];

  const result = [];

  // Check each direction from the king
  for (const [dx, dy] of directions) {
    // Start from the king's position
    let x = king[0];
    let y = king[1];

    // Move in the current direction until we go off the board
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      // Move one step in the current direction
      x += dx;
      y += dy;

      // Check if we're still on the board
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        // Check if there's a queen at this position
        if (queenSet.has(`${x},${y}`)) {
          // Found the closest queen in this direction
          result.push([x, y]);
          // Stop searching this direction (farther queens are blocked)
          break;
        }
      } else {
        // We've gone off the board
        break;
      }
    }
  }

  return result;
}
```

```java
// Time: O(1) - constant time since board is fixed 8x8
// Space: O(1) - constant space for result and queen set
import java.util.*;

class Solution {
    public List<List<Integer>> queensAttacktheKing(int[][] queens, int[] king) {
        /**
         * Find all queens that can attack the king.
         *
         * @param queens: Array of [x, y] positions of black queens
         * @param king: [x, y] position of white king
         * @return List of queen positions that can attack the king
         */

        // Convert queen positions to a HashSet for O(1) lookup
        Set<String> queenSet = new HashSet<>();
        for (int[] queen : queens) {
            queenSet.add(queen[0] + "," + queen[1]);
        }

        // All 8 possible directions a queen can attack from
        // {dx, dy} where dx is change in x, dy is change in y
        int[][] directions = {
            {0, 1},   // up (north)
            {1, 1},   // up-right (northeast)
            {1, 0},   // right (east)
            {1, -1},  // down-right (southeast)
            {0, -1},  // down (south)
            {-1, -1}, // down-left (southwest)
            {-1, 0},  // left (west)
            {-1, 1}   // up-left (northwest)
        };

        List<List<Integer>> result = new ArrayList<>();

        // Check each direction from the king
        for (int[] dir : directions) {
            int dx = dir[0];
            int dy = dir[1];

            // Start from the king's position
            int x = king[0];
            int y = king[1];

            // Move in the current direction until we go off the board
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                // Move one step in the current direction
                x += dx;
                y += dy;

                // Check if we're still on the board
                if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                    // Check if there's a queen at this position
                    if (queenSet.contains(x + "," + y)) {
                        // Found the closest queen in this direction
                        List<Integer> queenPos = new ArrayList<>();
                        queenPos.add(x);
                        queenPos.add(y);
                        result.add(queenPos);
                        // Stop searching this direction (farther queens are blocked)
                        break;
                    }
                } else {
                    // We've gone off the board
                    break;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The board size is fixed at 8×8
- We check at most 7 positions in each of 8 directions = 56 checks
- Each check is O(1) due to the hash set lookup
- Even with more queens, we still only do 56 checks

**Space Complexity: O(1)**

- We store queen positions in a hash set: at most 63 queens (since one spot has the king)
- The result list contains at most 8 queens (one per direction)
- All storage is constant regardless of input size

## Common Mistakes

1. **Checking from queens instead of from king:** Many candidates start by checking each queen to see if it attacks the king. This requires checking blocking pieces, which is complex and error-prone. Always search outward from the king.

2. **Forgetting about diagonals:** Some candidates only check horizontal and vertical directions, forgetting that queens also attack diagonally. Remember all 8 directions.

3. **Not handling board boundaries:** When moving in a direction, you must stop when you go off the board (x < 0, x ≥ 8, y < 0, or y ≥ 8).

4. **Continuing past the first queen:** Once you find a queen in a direction, you must stop searching that direction. Any farther queens are blocked by the closer one.

5. **Using the wrong data structure for queen lookup:** Using a list for queen positions would make lookup O(n). Always use a hash set for O(1) lookups.

## When You'll See This Pattern

This "search outward in all directions" pattern appears in many grid-based problems:

1. **Battleships in a Board (LeetCode 419):** Similar concept of searching in fixed directions to identify ship segments.

2. **Number of Islands (LeetCode 200):** Uses directional search (DFS/BFS) to explore connected components.

3. **Robot Room Cleaner (LeetCode 489):** Requires systematic exploration in all directions.

4. **Minimum Moves to Capture The Queen (LeetCode 100157):** Directly related problem that builds on these concepts with additional chess pieces.

The core pattern is: when you need to find the closest object in each direction from a starting point, search outward systematically rather than checking all objects.

## Key Takeaways

1. **Search from the target, not the sources:** When looking for things that can reach a target, it's often easier to search outward from the target than to check each source.

2. **Use direction vectors for grid movement:** The 8 direction vectors pattern ([dx, dy] pairs) is reusable for many grid problems.

3. **Stop at the first hit in each direction:** In line-of-sight problems, the closest object blocks farther ones.

4. **Hash sets enable O(1) existence checks:** When you need to frequently check if a position contains something, convert to a hash set first.

Related problems: [Minimum Moves to Capture The Queen](/problem/minimum-moves-to-capture-the-queen)
