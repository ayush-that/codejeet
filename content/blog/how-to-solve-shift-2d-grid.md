---
title: "How to Solve Shift 2D Grid — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Shift 2D Grid. Easy difficulty, 67.9% acceptance rate. Topics: Array, Matrix, Simulation."
date: "2027-01-20"
category: "dsa-patterns"
tags: ["shift-2d-grid", "array", "matrix", "simulation", "easy"]
---

# How to Solve Shift 2D Grid

You're given a 2D grid and need to shift all elements right by `k` positions, wrapping around to the next row when you hit the end of a row, and wrapping from the bottom-right corner to the top-left. While this seems like a simple matrix manipulation problem, the wrapping behavior makes it tricky to implement correctly without careful index calculations.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 2×3 grid:

```
Original grid:
[1, 2, 3]
[4, 5, 6]
```

If we shift it once (k=1):

- Element at (0,0)=1 moves to (0,1)
- Element at (0,1)=2 moves to (0,2)
- Element at (0,2)=3 moves to (1,0) (wraps to next row)
- Element at (1,0)=4 moves to (1,1)
- Element at (1,1)=5 moves to (1,2)
- Element at (1,2)=6 moves to (0,0) (wraps from bottom-right to top-left)

Result after 1 shift:

```
[6, 1, 2]
[3, 4, 5]
```

For k=2, we'd apply the same process twice. Notice that shifting 6 times (m×n=6) would bring us back to the original grid. This tells us we can reduce `k` modulo the total number of elements to avoid unnecessary work.

## Brute Force Approach

The most straightforward approach is to simulate the shift operation `k` times:

1. For each shift operation (k times):
   - Create a new grid
   - Copy each element to its new position according to the shift rules
   - Replace the original grid with the new one

This approach has O(k×m×n) time complexity, which becomes inefficient when `k` is large. For example, with a 100×100 grid and k=1,000,000, we'd perform 10 billion operations! The key insight is that after shifting m×n times, we return to the original grid, so we only need to perform k % (m×n) shifts.

However, even with this optimization, simulating each shift individually is still O(m×n) per shift. We can do better by calculating the final position of each element directly.

## Optimal Solution

The optimal approach uses modular arithmetic to calculate each element's final position in one pass. Think of the 2D grid as a 1D array of length m×n. When we shift right by k positions in this 1D representation:

- The element at index `i` moves to index `(i + k) % (m×n)`
- To convert from 1D index back to 2D coordinates:
  - Row = index // n (integer division)
  - Column = index % n

We can implement this by:

1. Flattening the grid to a 1D list
2. Calculating the split point: elements from the end wrap to the beginning
3. Reconstructing the grid with elements in their new positions

Here's the complete implementation:

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n) for the result grid
def shiftGrid(self, grid, k):
    """
    Shift a 2D grid k times to the right with wrap-around.

    Args:
        grid: List[List[int]] - The 2D grid to shift
        k: int - Number of shift operations to perform

    Returns:
        List[List[int]] - The shifted grid
    """
    m, n = len(grid), len(grid[0])

    # Calculate effective shifts (avoid unnecessary full cycles)
    total_elements = m * n
    k %= total_elements  # After m*n shifts, we're back to original

    # If no effective shift needed, return original
    if k == 0:
        return grid

    # Flatten the grid to 1D for easier manipulation
    flat = []
    for i in range(m):
        for j in range(n):
            flat.append(grid[i][j])

    # The last k elements will wrap to the front
    # Split the flattened array at the wrap point
    split_idx = total_elements - k
    shifted_flat = flat[split_idx:] + flat[:split_idx]

    # Reconstruct the 2D grid from shifted 1D array
    result = []
    idx = 0
    for i in range(m):
        row = []
        for j in range(n):
            row.append(shifted_flat[idx])
            idx += 1
        result.append(row)

    return result
```

```javascript
// Time: O(m*n) | Space: O(m*n) for the result grid
/**
 * Shift a 2D grid k times to the right with wrap-around.
 *
 * @param {number[][]} grid - The 2D grid to shift
 * @param {number} k - Number of shift operations to perform
 * @return {number[][]} - The shifted grid
 */
var shiftGrid = function (grid, k) {
  const m = grid.length;
  const n = grid[0].length;
  const total = m * n;

  // Reduce k to avoid unnecessary full cycles
  k %= total;

  // Early return if no shift needed
  if (k === 0) return grid;

  // Flatten the 2D grid to 1D array
  const flat = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      flat.push(grid[i][j]);
    }
  }

  // Calculate split point: elements after this index wrap to front
  const splitIdx = total - k;

  // Create shifted array by concatenating the two parts
  const shiftedFlat = flat.slice(splitIdx).concat(flat.slice(0, splitIdx));

  // Reconstruct 2D grid from shifted 1D array
  const result = [];
  let idx = 0;
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(shiftedFlat[idx]);
      idx++;
    }
    result.push(row);
  }

  return result;
};
```

```java
// Time: O(m*n) | Space: O(m*n) for the result grid
class Solution {
    /**
     * Shift a 2D grid k times to the right with wrap-around.
     *
     * @param grid The 2D grid to shift
     * @param k Number of shift operations to perform
     * @return The shifted grid
     */
    public List<List<Integer>> shiftGrid(int[][] grid, int k) {
        int m = grid.length;
        int n = grid[0].length;
        int total = m * n;

        // Reduce k to avoid unnecessary cycles
        k %= total;

        // Early return if no shift needed
        if (k == 0) {
            List<List<Integer>> result = new ArrayList<>();
            for (int[] row : grid) {
                List<Integer> listRow = new ArrayList<>();
                for (int val : row) {
                    listRow.add(val);
                }
                result.add(listRow);
            }
            return result;
        }

        // Flatten the 2D grid to 1D array
        int[] flat = new int[total];
        int idx = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                flat[idx++] = grid[i][j];
            }
        }

        // Calculate split point
        int splitIdx = total - k;

        // Create shifted array
        int[] shiftedFlat = new int[total];
        System.arraycopy(flat, splitIdx, shiftedFlat, 0, k);
        System.arraycopy(flat, 0, shiftedFlat, k, splitIdx);

        // Reconstruct 2D grid
        List<List<Integer>> result = new ArrayList<>();
        idx = 0;
        for (int i = 0; i < m; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j < n; j++) {
                row.add(shiftedFlat[idx++]);
            }
            result.add(row);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n)

- We iterate through all elements twice: once to flatten the grid, and once to reconstruct it.
- The array concatenation/slicing operations are O(m×n) as they copy all elements.
- Reducing k modulo m×n is O(1).

**Space Complexity:** O(m×n)

- We store a flattened version of the grid (m×n elements).
- We store the shifted flattened array (another m×n elements).
- The result grid also requires O(m×n) space.
- Total auxiliary space is O(m×n), which is optimal since we need to return a new grid.

## Common Mistakes

1. **Not reducing k modulo m×n:** When k ≥ m×n, shifting k times is equivalent to shifting k % (m×n) times. Failing to do this wastes time on unnecessary cycles.

2. **Incorrect wrap-around logic:** The trickiest part is determining where to split the flattened array. It should be at `total - k`, not `k`. The last k elements become the first k elements in the result.

3. **Off-by-one errors in index calculations:** When converting between 1D and 2D indices:
   - Row = 1D_index // n (not m)
   - Column = 1D_index % n (not m)
     Mixing up m and n is a common mistake.

4. **Modifying the input grid in-place:** The problem doesn't specify whether you can modify the input. It's safer to create a new grid unless the problem explicitly allows in-place modification.

## When You'll See This Pattern

This problem teaches the technique of **flattening multi-dimensional data** to simplify operations, then reconstructing the original structure. You'll see similar patterns in:

1. **Rotate Image (LeetCode 48)** - Rotating a matrix can be approached by flattening and repositioning elements, though that problem has a more efficient in-place solution.

2. **Spiral Matrix (LeetCode 54)** - While not identical, it also involves navigating a 2D grid in a non-linear pattern, requiring careful index management.

3. **Reshape the Matrix (LeetCode 566)** - Directly applies the flattening technique to convert between different matrix dimensions.

4. **Game of Life (LeetCode 289)** - Uses a similar approach of creating a new grid rather than modifying in-place when simultaneous updates are needed.

## Key Takeaways

1. **Flatten multi-dimensional problems:** When dealing with wrap-around or complex traversals in 2D/3D structures, consider flattening to 1D to simplify index calculations.

2. **Use modular arithmetic for cyclic operations:** For problems involving rotation, shifting, or wrapping, k % n tells you the effective operation count after removing full cycles.

3. **Think in terms of final positions:** Instead of simulating each step, calculate where each element ends up directly. This often turns O(k×n) operations into O(n).

[Practice this problem on CodeJeet](/problem/shift-2d-grid)
