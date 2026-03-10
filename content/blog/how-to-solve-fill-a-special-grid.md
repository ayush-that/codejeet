---
title: "How to Solve Fill a Special Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Fill a Special Grid. Medium difficulty, 70.7% acceptance rate. Topics: Array, Divide and Conquer, Matrix."
date: "2029-10-31"
category: "dsa-patterns"
tags: ["fill-a-special-grid", "array", "divide-and-conquer", "matrix", "medium"]
---

# How to Solve Fill a Special Grid

This problem asks us to fill a `2n × 2n` grid with numbers from 0 to `2^(2n) - 1` such that all numbers in the top-right quadrant are smaller than those in the bottom-left quadrant. What makes this problem interesting is that it appears to be about sorting and placement, but the actual solution involves a clever divide-and-conquer approach that leverages the properties of binary representation.

## Visual Walkthrough

Let's trace through a small example with `n = 1` (creating a 2×2 grid). We need to fill numbers 0 through 3 (since `2^(2×1) - 1 = 3`).

Our grid has four quadrants (each 1×1 for n=1):

- Top-left (TL)
- Top-right (TR)
- Bottom-left (BL)
- Bottom-right (BR)

The condition says: **All numbers in TR must be smaller than all numbers in BL**.

Let's try to satisfy this:

1. We have numbers {0, 1, 2, 3}
2. The smallest number (0) should go somewhere
3. The largest number (3) should go somewhere
4. Since TR < BL, the largest number in TR must be smaller than the smallest number in BL

One valid arrangement:

```
0 1
2 3
```

Here: TR = 1, BL = 2, and indeed 1 < 2 ✓

Another valid arrangement:

```
0 2
1 3
```

Here: TR = 2, BL = 1, but 2 > 1 ✗ (fails!)

So we need a systematic way to ensure TR < BL. The key insight: if we sort all numbers and split them into two halves, we can put the smaller half in TR and the larger half in BL. But wait - we also need to fill TL and BR!

For n=1, sorted numbers: [0, 1, 2, 3]

- Smaller half: [0, 1] → could go in TR
- Larger half: [2, 3] → could go in BL
- But we still need TL and BR...

Actually, let's think recursively. For n=2 (4×4 grid), we need to solve the same problem for each quadrant! This suggests a divide-and-conquer approach.

## Brute Force Approach

A naive approach would be to generate all permutations of numbers 0 to `2^(2n) - 1` in the grid and check if each satisfies the condition.

Why this fails:

1. **Combinatorial explosion**: For n=2, we have 16 numbers → 16! ≈ 2×10¹³ permutations
2. **Exponential time**: Even for small n, this becomes intractable
3. **No insight**: Doesn't help us understand the structure of valid solutions

We need a smarter approach that constructs a valid solution directly rather than searching for one.

## Optimized Approach

The key insight comes from recognizing that this is a **recursive construction problem**. Let's think about what happens when we split the grid:

1. For a `2n × 2n` grid, we have four `n × n` quadrants
2. The condition only relates TR and BL quadrants
3. TL and BR quadrants have no constraints relative to other quadrants
4. But wait - each quadrant itself is a smaller grid that must satisfy the same property!

This suggests a recursive divide-and-conquer approach:

- Base case: n=0 (1×1 grid) - trivial, just place 0
- For n>0:
  1. Recursively fill each of the four `n × n` quadrants
  2. But we need to ensure numbers in TR < numbers in BL
  3. We can achieve this by adding an offset to certain quadrants

The clever trick: We can fill all quadrants with the same pattern, but add different offsets:

- TL quadrant: Use the pattern for size n-1
- TR quadrant: Use the pattern for size n-1 (this will be smaller)
- BL quadrant: Use the pattern for size n-1 with a large offset (this will be larger)
- BR quadrant: Use the pattern for size n-1

The offset needs to be `2^(2(n-1))` (the number of cells in each quadrant) to ensure all numbers in BL are greater than all numbers in TR.

## Optimal Solution

Here's the complete solution using divide-and-conquer with offset calculation:

<div class="code-group">

```python
# Time: O(4^n) = O((2n)^2) since we fill each cell once
# Space: O(2^n) for recursion stack, or O(1) if implemented iteratively
def fillSpecialGrid(n):
    """
    Returns a 2n x 2n grid filled with numbers 0 to 2^(2n)-1
    satisfying the special condition.
    """
    size = 1 << n  # 2^n
    grid = [[0] * (size * 2) for _ in range(size * 2)]

    def fill(x, y, size, offset):
        """
        Fill a subgrid of size `size` starting at (x, y)
        with numbers starting from `offset`.

        Args:
            x, y: Top-left coordinates of the subgrid
            size: Current subgrid size (power of 2)
            offset: Starting number for this subgrid
        """
        if size == 1:
            # Base case: 2x2 grid
            grid[x][y] = offset
            grid[x][y+1] = offset + 1
            grid[x+1][y] = offset + 2
            grid[x+1][y+1] = offset + 3
            return

        # Half size for recursion
        half = size // 2
        # Number of cells in each quadrant
        quadrant_cells = half * half

        # Recursively fill four quadrants with appropriate offsets
        # Top-left: same pattern, no extra offset
        fill(x, y, half, offset)
        # Top-right: same pattern, offset by quadrant_cells
        fill(x, y + half, half, offset + quadrant_cells)
        # Bottom-left: same pattern, offset by 3*quadrant_cells
        # This ensures BL > TR since BL starts at larger numbers
        fill(x + half, y, half, offset + 3 * quadrant_cells)
        # Bottom-right: same pattern, offset by 2*quadrant_cells
        fill(x + half, y + half, half, offset + 2 * quadrant_cells)

    # Start filling from top-left corner
    fill(0, 0, size, 0)
    return grid
```

```javascript
// Time: O(4^n) = O((2n)^2) since we fill each cell once
// Space: O(2^n) for recursion stack
function fillSpecialGrid(n) {
  const size = 1 << n; // 2^n
  const grid = Array.from({ length: size * 2 }, () => Array(size * 2).fill(0));

  /**
   * Fill a subgrid recursively
   * @param {number} x - Top row index
   * @param {number} y - Left column index
   * @param {number} size - Current subgrid size (power of 2)
   * @param {number} offset - Starting number for this subgrid
   */
  function fill(x, y, size, offset) {
    if (size === 1) {
      // Base case: 2x2 grid
      grid[x][y] = offset;
      grid[x][y + 1] = offset + 1;
      grid[x + 1][y] = offset + 2;
      grid[x + 1][y + 1] = offset + 3;
      return;
    }

    const half = size / 2;
    const quadrantCells = half * half;

    // Fill four quadrants with appropriate offsets
    // Top-left quadrant
    fill(x, y, half, offset);
    // Top-right quadrant
    fill(x, y + half, half, offset + quadrantCells);
    // Bottom-left quadrant (gets largest offset to ensure BL > TR)
    fill(x + half, y, half, offset + 3 * quadrantCells);
    // Bottom-right quadrant
    fill(x + half, y + half, half, offset + 2 * quadrantCells);
  }

  fill(0, 0, size, 0);
  return grid;
}
```

```java
// Time: O(4^n) = O((2n)^2) since we fill each cell once
// Space: O(2^n) for recursion stack
import java.util.Arrays;

public class Solution {
    public int[][] fillSpecialGrid(int n) {
        int size = 1 << n; // 2^n
        int[][] grid = new int[2 * size][2 * size];

        fill(grid, 0, 0, size, 0);
        return grid;
    }

    private void fill(int[][] grid, int x, int y, int size, int offset) {
        if (size == 1) {
            // Base case: fill 2x2 grid
            grid[x][y] = offset;
            grid[x][y + 1] = offset + 1;
            grid[x + 1][y] = offset + 2;
            grid[x + 1][y + 1] = offset + 3;
            return;
        }

        int half = size / 2;
        int quadrantCells = half * half;

        // Recursively fill four quadrants
        // Top-left quadrant
        fill(grid, x, y, half, offset);
        // Top-right quadrant
        fill(grid, x, y + half, half, offset + quadrantCells);
        // Bottom-left quadrant (gets largest offset)
        fill(grid, x + half, y, half, offset + 3 * quadrantCells);
        // Bottom-right quadrant
        fill(grid, x + half, y + half, half, offset + 2 * quadrantCells);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(4ⁿ) = O((2n)²)**

- Each recursive call processes 4 subproblems of size n/2
- The recurrence is T(n) = 4T(n/2) + O(1)
- Solving this gives O(4ⁿ) operations
- Since the grid has (2ⁿ × 2ⁿ) = 4ⁿ cells, we're doing constant work per cell

**Space Complexity: O(2ⁿ)**

- The recursion depth is n (since we divide by 2 each time)
- We need O(n) stack space for recursion
- The output grid itself takes O(4ⁿ) space, but this is not counted as extra space

## Common Mistakes

1. **Incorrect offset calculation**: The most common error is miscalculating the offset for each quadrant. Remember: each quadrant has `(size/2) × (size/2) = size²/4` cells. The offsets should be multiples of this number.

2. **Wrong base case handling**: For n=1 (2×2 grid), some implementations might recurse infinitely. The base case should be when we're filling a 2×2 block, not a 1×1 block.

3. **Confusing grid coordinates**: Mixing up row/column indices or forgetting to add the half offset when positioning quadrants. Always double-check: `(x, y)` is top-left, `(x, y+half)` is top-right, etc.

4. **Not understanding the recursion**: Trying to solve this with iteration or simple sorting won't work. The recursive structure is essential because each quadrant must itself satisfy the same property.

## When You'll See This Pattern

This divide-and-conquer pattern with offset calculation appears in several problems:

1. **Zigzag Matrix (LeetCode 498)**: While not identical, it involves traversing a matrix in a specific pattern that can be solved with careful indexing.

2. **Spiral Matrix (LeetCode 54)**: Another matrix traversal problem where you need to systematically visit all cells in a specific order.

3. **Gray Code (LeetCode 89)**: Generating sequences where successive values differ by one bit uses a similar recursive construction with mirroring.

4. **Construct Quad Tree (LeetCode 427)**: Directly uses divide-and-conquer on matrices, splitting into four quadrants recursively.

The core pattern is: when a problem has a self-similar structure (solving the same problem on smaller instances), and you need to combine results with some transformation (like adding offsets), think divide-and-conquer.

## Key Takeaways

1. **Divide-and-conquer is natural for matrix problems**: When a matrix problem involves quadrants or has a recursive structure, consider splitting the matrix and solving smaller instances.

2. **Offset patterns are powerful**: Adding different offsets to recursive results is a common technique for ensuring certain ordering constraints between different parts of the solution.

3. **Base cases matter**: For matrix recursion, the smallest non-trivial case is often 2×2 or 1×1. Getting the base case right is crucial for the recursion to work correctly.

4. **Visualize the recursion tree**: Drawing out how the problem splits can help you understand the offset calculations and ensure all cells get unique numbers.

[Practice this problem on CodeJeet](/problem/fill-a-special-grid)
