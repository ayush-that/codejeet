---
title: "How to Solve Check Knight Tour Configuration — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check Knight Tour Configuration. Medium difficulty, 60.6% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix, Simulation."
date: "2028-06-25"
category: "dsa-patterns"
tags:
  [
    "check-knight-tour-configuration",
    "array",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Check Knight Tour Configuration

This problem asks us to verify whether a given chessboard configuration represents a valid knight's tour. The knight starts at the top-left cell (which must contain value 0), then moves according to chess knight rules to the cell containing value 1, then to value 2, and so on until visiting all n² cells exactly once. What makes this problem interesting is that we're not finding a tour—we're verifying whether a given board arrangement follows the rules of a valid knight's tour.

## Visual Walkthrough

Let's trace through a 3×3 example to build intuition:

```
grid = [
    [0, 3, 6],
    [5, 8, 1],
    [2, 7, 4]
]
```

A valid knight's tour must:

1. Start at value 0 (top-left corner)
2. Move from value k to value k+1 using knight moves
3. Visit all values from 0 to n²-1 exactly once

Let's verify step by step:

**Step 1:** Value 0 is at position (0,0) - correct starting position.

**Step 2:** From value 0, we need to find value 1. Value 1 is at (1,2). Is (1,2) a valid knight move from (0,0)?

- Knight moves are (±2, ±1) or (±1, ±2)
- (0,0) → (1,2): Δrow = 1, Δcol = 2 → This is a valid knight move (1,2) pattern

**Step 3:** From value 1 at (1,2), find value 2 at (2,0). Is (2,0) a valid move from (1,2)?

- Δrow = 1, Δcol = -2 → This is (1,-2) pattern, valid!

**Step 4:** Continue checking each consecutive pair until we reach value 8.

If at any step the move isn't valid, the configuration is invalid. Also, if we don't visit all cells, it's invalid.

## Brute Force Approach

A naive approach might try to:

1. Find the position of value 0
2. For each value k from 0 to n²-2:
   - Find position of value k+1
   - Check if it's a valid knight move from position of value k
3. Verify we visited all n² positions

The problem with this approach is step 2: finding positions by searching the entire grid for each value would take O(n⁴) time since we'd scan the n×n grid for each of n² values. While this would work for small n, it's inefficient.

A slightly better brute force would first create a mapping from values to positions, then check moves:

<div class="code-group">

```python
# Brute force with position mapping
# Time: O(n²) | Space: O(n²)
def bruteForceCheckValidGrid(grid):
    n = len(grid)

    # Step 1: Create mapping from values to positions
    positions = {}
    for i in range(n):
        for j in range(n):
            positions[grid[i][j]] = (i, j)

    # Step 2: Check starting position
    if grid[0][0] != 0:
        return False

    # Step 3: Check each consecutive move
    for k in range(n * n - 1):
        curr_row, curr_col = positions[k]
        next_row, next_col = positions[k + 1]

        # Check if this is a valid knight move
        row_diff = abs(next_row - curr_row)
        col_diff = abs(next_col - curr_col)

        # Knight moves: (2,1) or (1,2) patterns
        if not ((row_diff == 2 and col_diff == 1) or
                (row_diff == 1 and col_diff == 2)):
            return False

    return True
```

```javascript
// Brute force with position mapping
// Time: O(n²) | Space: O(n²)
function bruteForceCheckValidGrid(grid) {
  const n = grid.length;

  // Step 1: Create mapping from values to positions
  const positions = new Map();
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      positions.set(grid[i][j], [i, j]);
    }
  }

  // Step 2: Check starting position
  if (grid[0][0] !== 0) {
    return false;
  }

  // Step 3: Check each consecutive move
  for (let k = 0; k < n * n - 1; k++) {
    const [currRow, currCol] = positions.get(k);
    const [nextRow, nextCol] = positions.get(k + 1);

    // Check if this is a valid knight move
    const rowDiff = Math.abs(nextRow - currRow);
    const colDiff = Math.abs(nextCol - currCol);

    // Knight moves: (2,1) or (1,2) patterns
    if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
      return false;
    }
  }

  return true;
}
```

```java
// Brute force with position mapping
// Time: O(n²) | Space: O(n²)
public boolean bruteForceCheckValidGrid(int[][] grid) {
    int n = grid.length;

    // Step 1: Create mapping from values to positions
    Map<Integer, int[]> positions = new HashMap<>();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            positions.put(grid[i][j], new int[]{i, j});
        }
    }

    // Step 2: Check starting position
    if (grid[0][0] != 0) {
        return false;
    }

    // Step 3: Check each consecutive move
    for (int k = 0; k < n * n - 1; k++) {
        int[] currPos = positions.get(k);
        int[] nextPos = positions.get(k + 1);

        // Check if this is a valid knight move
        int rowDiff = Math.abs(nextPos[0] - currPos[0]);
        int colDiff = Math.abs(nextPos[1] - currPos[1]);

        // Knight moves: (2,1) or (1,2) patterns
        if (!((rowDiff == 2 && colDiff == 1) ||
              (rowDiff == 1 && colDiff == 2))) {
            return false;
        }
    }

    return true;
}
```

</div>

Wait—this "brute force" is actually optimal! The insight is that by creating a position mapping first, we avoid repeated searches. Let me clarify: the truly naive approach would search for each value in the grid repeatedly, giving O(n⁴) time. The mapping approach gives us O(n²) time, which is optimal since we must at least examine each cell once.

## Optimized Approach

The key insight is that we need to:

1. **Map values to positions** so we can instantly find where value k+1 is located
2. **Check consecutive moves** from 0 to n²-1
3. **Validate knight moves** using the (2,1)/(1,2) pattern

The optimization over the truly naive approach is using a dictionary/map to store positions. This transforms what could be O(n⁴) time (searching n×n grid for each of n² values) into O(n²) time (one pass to build map, one pass to check moves).

Step-by-step reasoning:

1. First pass: Build a mapping from each value to its (row, col) position
2. Check that value 0 is at (0,0) - the tour must start at top-left
3. For k from 0 to n²-2:
   - Get position of value k from map
   - Get position of value k+1 from map
   - Verify the move follows knight movement rules
4. If all moves are valid, return true

## Optimal Solution

Here's the complete optimal solution with detailed comments:

<div class="code-group">

```python
# Optimal Solution
# Time: O(n²) - we visit each cell once to build the map
# Space: O(n²) - we store position for each of n² values
def checkValidGrid(grid):
    n = len(grid)

    # Step 1: Create a mapping from each value to its position
    # This allows O(1) lookup for where value k+1 is located
    position_map = {}
    for row in range(n):
        for col in range(n):
            value = grid[row][col]
            position_map[value] = (row, col)

    # Step 2: Validate starting position
    # The knight's tour must start at the top-left cell with value 0
    if grid[0][0] != 0:
        return False

    # Step 3: Check each consecutive move from 0 to n²-2
    # We need to verify that value k+1 is reachable from value k
    # using a valid knight move
    for k in range(n * n - 1):
        # Get current position (where value k is located)
        curr_row, curr_col = position_map[k]
        # Get next position (where value k+1 is located)
        next_row, next_col = position_map[k + 1]

        # Calculate the absolute differences in row and column
        row_diff = abs(next_row - curr_row)
        col_diff = abs(next_col - curr_col)

        # Knight moves follow one of two patterns:
        # 1. Move 2 rows and 1 column (in either direction)
        # 2. Move 1 row and 2 columns (in either direction)
        # The absolute values must match one of these patterns
        if not ((row_diff == 2 and col_diff == 1) or
                (row_diff == 1 and col_diff == 2)):
            return False

    # Step 4: All moves validated successfully
    return True
```

```javascript
// Optimal Solution
// Time: O(n²) - we visit each cell once to build the map
// Space: O(n²) - we store position for each of n² values
function checkValidGrid(grid) {
  const n = grid.length;

  // Step 1: Create a mapping from each value to its position
  // This allows O(1) lookup for where value k+1 is located
  const positionMap = new Map();
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const value = grid[row][col];
      positionMap.set(value, [row, col]);
    }
  }

  // Step 2: Validate starting position
  // The knight's tour must start at the top-left cell with value 0
  if (grid[0][0] !== 0) {
    return false;
  }

  // Step 3: Check each consecutive move from 0 to n²-2
  // We need to verify that value k+1 is reachable from value k
  // using a valid knight move
  for (let k = 0; k < n * n - 1; k++) {
    // Get current position (where value k is located)
    const [currRow, currCol] = positionMap.get(k);
    // Get next position (where value k+1 is located)
    const [nextRow, nextCol] = positionMap.get(k + 1);

    // Calculate the absolute differences in row and column
    const rowDiff = Math.abs(nextRow - currRow);
    const colDiff = Math.abs(nextCol - currCol);

    // Knight moves follow one of two patterns:
    // 1. Move 2 rows and 1 column (in either direction)
    // 2. Move 1 row and 2 columns (in either direction)
    // The absolute values must match one of these patterns
    if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
      return false;
    }
  }

  // Step 4: All moves validated successfully
  return true;
}
```

```java
// Optimal Solution
// Time: O(n²) - we visit each cell once to build the map
// Space: O(n²) - we store position for each of n² values
public boolean checkValidGrid(int[][] grid) {
    int n = grid.length;

    // Step 1: Create a mapping from each value to its position
    // This allows O(1) lookup for where value k+1 is located
    Map<Integer, int[]> positionMap = new HashMap<>();
    for (int row = 0; row < n; row++) {
        for (int col = 0; col < n; col++) {
            int value = grid[row][col];
            positionMap.put(value, new int[]{row, col});
        }
    }

    // Step 2: Validate starting position
    // The knight's tour must start at the top-left cell with value 0
    if (grid[0][0] != 0) {
        return false;
    }

    // Step 3: Check each consecutive move from 0 to n²-2
    // We need to verify that value k+1 is reachable from value k
    // using a valid knight move
    for (int k = 0; k < n * n - 1; k++) {
        // Get current position (where value k is located)
        int[] currPos = positionMap.get(k);
        int currRow = currPos[0];
        int currCol = currPos[1];

        // Get next position (where value k+1 is located)
        int[] nextPos = positionMap.get(k + 1);
        int nextRow = nextPos[0];
        int nextCol = nextPos[1];

        // Calculate the absolute differences in row and column
        int rowDiff = Math.abs(nextRow - currRow);
        int colDiff = Math.abs(nextCol - currCol);

        // Knight moves follow one of two patterns:
        // 1. Move 2 rows and 1 column (in either direction)
        // 2. Move 1 row and 2 columns (in either direction)
        // The absolute values must match one of these patterns
        if (!((rowDiff == 2 && colDiff == 1) ||
              (rowDiff == 1 && colDiff == 2))) {
            return false;
        }
    }

    // Step 4: All moves validated successfully
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We make one pass through all n² cells to build the position mapping: O(n²)
- We iterate through values 0 to n²-1 to check moves: O(n²)
- Total: O(n²) + O(n²) = O(n²)

**Space Complexity: O(n²)**

- We store a mapping for each of the n² values to their positions
- Each entry stores a pair of integers (row, col)
- Total space: O(n²)

This is optimal because we must at least examine each cell once to verify the configuration, giving us a lower bound of Ω(n²) time.

## Common Mistakes

1. **Forgetting to check the starting position**: Many candidates jump straight into checking moves but forget that the tour must start at grid[0][0] with value 0. Always validate this first condition.

2. **Incorrect knight move validation**: The knight moves in an "L" shape: 2 squares in one direction and 1 square perpendicular. Common errors include:
   - Checking (2,2) or (1,1) which are not valid knight moves
   - Forgetting to use absolute values when calculating differences
   - Not covering all 8 possible knight directions (our solution handles this by checking the pattern, not individual directions)

3. **Off-by-one errors in the loop**: When checking moves from k to k+1, we need to stop at n²-2 (since k+1 would be n²-1 at the last iteration). Going to n²-1 would cause an index error when looking up position of n².

4. **Assuming values are in order in the grid**: The values in the grid are not necessarily in increasing order row-by-row. They could be scattered anywhere, which is why we need the position mapping. A common mistake is to assume grid[i][j] == some value based on position.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Position mapping for grid traversal**: When you need to follow a path through a grid where the next step is determined by value rather than position, creating a value→position map is key. Similar problems:
   - [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders/): Map board squares to their positions for BFS traversal
   - [Word Search](https://leetcode.com/problems/word-search/): While different, it also involves tracking positions during traversal

2. **Move validation in grid problems**: Many chess-related or grid movement problems require validating moves according to specific rules:
   - [Minimum Knight Moves](https://leetcode.com/problems/minimum-knight-moves/): Also involves knight movement rules but focuses on finding shortest path
   - [Robot Bounded In Circle](https://leetcode.com/problems/robot-bounded-in-circle/): Validating movement patterns over time

3. **Sequence validation**: Checking that a sequence of moves follows specific rules appears in problems like:
   - [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/): Checking that a board configuration follows Sudoku rules
   - [Alien Dictionary](https://leetcode.com/problems/alien-dictionary/): Verifying word ordering follows dictionary rules

## Key Takeaways

1. **When you need to follow a path based on values, not positions, build a value→position map first**. This transforms O(n⁴) "search for each value" into O(n²) "lookup each value."

2. **Knight moves follow specific patterns: (2,1) and (1,2) in absolute values**. You don't need to check all 8 directions individually—just verify the pattern of differences.

3. **Always validate boundary conditions first**: Check the starting position (grid[0][0] must be 0) before checking moves. This catches invalid configurations early.

4. **The problem constraints guarantee all values 0..n²-1 appear exactly once**, so we don't need to verify completeness separately—if all moves are valid and we start at 0, we'll necessarily visit all cells.

Related problems: [Minimum Knight Moves](/problem/minimum-knight-moves), [Maximum Number of Moves to Kill All Pawns](/problem/maximum-number-of-moves-to-kill-all-pawns)
