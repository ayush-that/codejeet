---
title: "How to Solve Matrix Similarity After Cyclic Shifts — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Matrix Similarity After Cyclic Shifts. Easy difficulty, 59.4% acceptance rate. Topics: Array, Math, Matrix, Simulation."
date: "2029-04-15"
category: "dsa-patterns"
tags: ["matrix-similarity-after-cyclic-shifts", "array", "math", "matrix", "easy"]
---

# How to Solve Matrix Similarity After Cyclic Shifts

This problem asks whether a matrix remains the same after performing `k` cycles of operations where even-indexed rows are shifted left and odd-indexed rows are shifted right. What makes this problem interesting is that we don't actually need to simulate all `k` operations—we can use mathematical reasoning to determine the final state directly. The challenge lies in recognizing that after a certain number of shifts, each row returns to its original configuration.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
mat = [[1,2,3],
       [4,5,6],
       [7,8,9]]
k = 2
```

**Step 1: First operation (k=1)**

- Row 0 (even): Shift left by 1 → [2,3,1]
- Row 1 (odd): Shift right by 1 → [6,4,5]
- Row 2 (even): Shift left by 1 → [8,9,7]

After first operation:

```
[[2,3,1],
 [6,4,5],
 [8,9,7]]
```

**Step 2: Second operation (k=2)**

- Row 0 (even): Shift left by 1 → [3,1,2]
- Row 1 (odd): Shift right by 1 → [5,6,4]
- Row 2 (even): Shift left by 1 → [9,7,8]

After second operation:

```
[[3,1,2],
 [5,6,4],
 [9,7,8]]
```

The matrix is clearly different from the original. But what if `k = 3`? Let's continue:

**Step 3: Third operation (k=3)**

- Row 0: [1,2,3] ← back to original!
- Row 1: [4,5,6] ← back to original!
- Row 2: [7,8,9] ← back to original!

This reveals the key insight: **After `n` shifts (where `n` is the number of columns), any row returns to its original configuration**. This is because shifting left by `n` positions is equivalent to no shift at all.

## Brute Force Approach

The most straightforward approach is to actually simulate all `k` operations:

1. For each of the `k` operations:
   - For each row in the matrix:
     - If the row index is even, shift it left by 1 position
     - If the row index is odd, shift it right by 1 position
2. After all operations, compare the resulting matrix with the original

**Why this is inefficient:**

- Time complexity: O(k × m × n) where m is rows, n is columns
- If `k` is very large (up to 10⁵ in constraints), this becomes extremely slow
- We're doing unnecessary work since rows repeat their configurations

**What a naive candidate might miss:**

- Not realizing that shifting left by 1 position `k` times is equivalent to shifting left by `(k % n)` positions
- Not recognizing that after `n` shifts, any row returns to its original state
- Trying to simulate all `k` operations when mathematical simplification is possible

## Optimal Solution

The key insight is that we don't need to simulate all `k` operations. For each row:

- Even-indexed rows: After `k` left shifts, each element moves `(k % n)` positions left
- Odd-indexed rows: After `k` right shifts, each element moves `(k % n)` positions right

But there's an even simpler observation: **A row returns to its original configuration after exactly `n` shifts** (where `n` is the number of columns). Therefore, we only need to check if `k % n == 0`. If it is, the matrix will be identical to the original. If not, it will be different.

Wait—that's not quite right! Let's think more carefully. The problem states we perform the entire process `k` times, not `k` shifts per row. Each "process" includes shifting even rows left and odd rows right. So after `k` processes:

- Even rows are shifted left by `k` positions total
- Odd rows are shifted right by `k` positions total

Since shifting by `n` positions brings a row back to its original state, we need to check if `k % n == 0`. If yes, all rows return to original. If no, at least some rows will be different.

Actually, let's test this with our example above:

- `n = 3` columns
- `k = 2` processes
- `2 % 3 = 2 ≠ 0`, so matrix should be different ✓
- `k = 3` processes
- `3 % 3 = 0`, so matrix should be same as original ✓

This matches our visual walkthrough!

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def areSimilar(mat, k):
    """
    Determines if the matrix is similar to the original after k operations.

    Key insight: Each row returns to its original configuration after exactly
    n shifts (where n is the number of columns). Therefore, we only need to
    check if k % n == 0.

    Args:
        mat: List[List[int]] - The input matrix
        k: int - Number of operations to perform

    Returns:
        bool: True if matrix is similar to original, False otherwise
    """
    # Get the number of columns in the matrix
    n = len(mat[0])

    # If k is a multiple of n, all rows return to their original positions
    # If k % n != 0, at least some rows will be in different positions
    return k % n == 0
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Determines if the matrix is similar to the original after k operations.
 *
 * Key insight: Each row returns to its original configuration after exactly
 * n shifts (where n is the number of columns). Therefore, we only need to
 * check if k % n == 0.
 *
 * @param {number[][]} mat - The input matrix
 * @param {number} k - Number of operations to perform
 * @return {boolean} True if matrix is similar to original, False otherwise
 */
function areSimilar(mat, k) {
  // Get the number of columns in the matrix
  const n = mat[0].length;

  // If k is a multiple of n, all rows return to their original positions
  // If k % n != 0, at least some rows will be in different positions
  return k % n === 0;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Determines if the matrix is similar to the original after k operations.
     *
     * Key insight: Each row returns to its original configuration after exactly
     * n shifts (where n is the number of columns). Therefore, we only need to
     * check if k % n == 0.
     *
     * @param mat The input matrix
     * @param k Number of operations to perform
     * @return True if matrix is similar to original, False otherwise
     */
    public boolean areSimilar(int[][] mat, int k) {
        // Get the number of columns in the matrix
        int n = mat[0].length;

        // If k is a multiple of n, all rows return to their original positions
        // If k % n != 0, at least some rows will be in different positions
        return k % n == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We only perform a single modulo operation regardless of the matrix size
- No iteration through the matrix is needed

**Space Complexity: O(1)**

- We only use a constant amount of extra space (the variable `n`)
- No additional data structures are created

The efficiency comes from the mathematical insight that eliminates the need for simulation. This is a great example of how understanding the underlying pattern can transform an O(k × m × n) solution into an O(1) solution.

## Common Mistakes

1. **Actually simulating all k operations**: This is the most common mistake. Candidates start writing loops to shift rows k times without realizing the mathematical simplification. Always look for patterns and cycles in problems involving repeated operations.

2. **Incorrect cycle length**: Some candidates think the cycle length is `2n` (because of even/odd rows) or `m × n`. Remember: each row independently cycles every `n` operations because it has `n` elements.

3. **Not handling the empty matrix edge case**: While not explicitly mentioned in constraints, always consider edge cases. If the matrix has 0 columns (`n = 0`), the modulo operation `k % 0` would cause an error. However, the problem guarantees `mat` is a valid matrix with at least 1 row and 1 column.

4. **Confusing left vs right shifts for odd rows**: The problem clearly states even rows shift left, odd rows shift right. Mixing these up would lead to incorrect reasoning about when rows return to their original state.

## When You'll See This Pattern

This problem teaches the important concept of **cycle detection in periodic systems**. You'll encounter similar patterns in:

1. **Rotate Array (LeetCode 189)**: Rotating an array k times—the optimal solution uses the fact that rotating by n positions returns the array to its original state.

2. **Robot Bounded In Circle (LeetCode 1041)**: Determining if a robot's path is bounded by recognizing that after 4 cycles of instructions, the robot returns to its original orientation.

3. **Repeated String Pattern (LeetCode 459)**: Checking if a string can be constructed by repeating a substring—related to finding cycles in the string's structure.

The core technique is recognizing when a system has periodic behavior and using modulo arithmetic to avoid unnecessary simulation.

## Key Takeaways

1. **Look for cycles in repeated operations**: When a problem involves applying the same operation multiple times, check if the system returns to a previous state after a fixed number of operations. This often allows you to use modulo arithmetic instead of simulation.

2. **Test with small examples**: The visual walkthrough with a 3×3 matrix and k=2,3 revealed the pattern. Always work through concrete examples to discover underlying mathematical properties.

3. **Even "Easy" problems can have clever optimizations**: Don't just implement the first solution that comes to mind. Think about whether there's a mathematical insight that can simplify the problem.

[Practice this problem on CodeJeet](/problem/matrix-similarity-after-cyclic-shifts)
