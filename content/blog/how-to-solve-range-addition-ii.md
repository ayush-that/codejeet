---
title: "How to Solve Range Addition II — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Range Addition II. Easy difficulty, 58.4% acceptance rate. Topics: Array, Math."
date: "2026-12-20"
category: "dsa-patterns"
tags: ["range-addition-ii", "array", "math", "easy"]
---

# How to Solve Range Addition II

At first glance, this problem seems like it requires simulating an entire matrix and performing all operations, which could be computationally expensive. However, the key insight is that we don't actually need to build or modify the matrix at all. The maximum values will always be in the top-left corner, and we can determine their count by finding the smallest dimensions affected by all operations.

**What makes this problem interesting:** It appears to be a matrix manipulation problem, but it's actually a simple minimization problem in disguise. The operations always start from (0,0) and extend to (aᵢ, bᵢ), so the maximum values will accumulate in the intersection of all these rectangular regions.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** m = 3, n = 3, ops = [[2,2],[3,3]]

**Step 1:** Start with a 3×3 matrix of zeros:

```
[0, 0, 0]
[0, 0, 0]
[0, 0, 0]
```

**Step 2:** Apply operation [2,2] - increment rows 0-1 and columns 0-1:

```
[1, 1, 0]
[1, 1, 0]
[0, 0, 0]
```

**Step 3:** Apply operation [3,3] - increment rows 0-2 and columns 0-2:

```
[2, 2, 1]
[2, 2, 1]
[1, 1, 0]
```

**Observation:** The maximum value is 2, and it appears in the top-left 2×2 submatrix. This is exactly the intersection of the two operations: min(2,3) = 2 for rows and min(2,3) = 2 for columns.

**Result:** The number of maximum integers is 2 × 2 = 4.

This pattern holds for any number of operations: the maximum values will always be in the rectangle from (0,0) to (min_a, min_b), where min_a is the smallest aᵢ across all operations and min_b is the smallest bᵢ across all operations.

## Brute Force Approach

The most straightforward approach is to simulate the entire process:

1. Create an m×n matrix initialized with zeros
2. For each operation [a,b], increment all cells where 0 ≤ x < a and 0 ≤ y < b
3. Find the maximum value in the matrix
4. Count how many cells have this maximum value

**Why this is inefficient:** If m and n are large (up to 40,000 in constraints) and we have many operations, we could be performing up to m×n×k operations, where k is the number of operations. This is O(m×n×k) time complexity, which is far too slow for the constraints.

Even if we optimize by tracking maximum values as we go, we still need to update O(a×b) cells per operation, which could be up to O(m×n) per operation.

## Optimal Solution

The key insight is that every operation increments the same rectangular region starting from (0,0). Therefore, the cells that get incremented the most are those that fall within **all** operation regions. This is simply the intersection of all rectangles defined by the operations.

The intersection rectangle goes from (0,0) to (min_a, min_b), where:

- min_a = minimum of all aᵢ values in ops
- min_b = minimum of all bᵢ values in ops

If there are no operations, then no increments happen, so all cells remain at 0, and the entire m×n matrix contains the maximum value.

<div class="code-group">

```python
# Time: O(k) where k is the number of operations
# Space: O(1) - we only use a few variables
def maxCount(m, n, ops):
    """
    Counts the number of maximum integers after performing all operations.

    Args:
        m: Number of rows in the matrix
        n: Number of columns in the matrix
        ops: List of operations, where each operation is [a, b]

    Returns:
        Number of cells containing the maximum value
    """
    # If there are no operations, all cells remain 0 (the maximum)
    # So the entire m x n matrix contains the maximum value
    if not ops:
        return m * n

    # Initialize min_a and min_b with the first operation
    # We'll find the minimum a and minimum b across all operations
    min_a = ops[0][0]
    min_b = ops[0][1]

    # Iterate through all operations to find the smallest dimensions
    for a, b in ops:
        # Update min_a if current a is smaller
        if a < min_a:
            min_a = a
        # Update min_b if current b is smaller
        if b < min_b:
            min_b = b

    # The maximum values will be in the rectangle from (0,0) to (min_a, min_b)
    # The count is simply the area of this rectangle
    return min_a * min_b
```

```javascript
// Time: O(k) where k is the number of operations
// Space: O(1) - we only use a few variables
/**
 * Counts the number of maximum integers after performing all operations.
 *
 * @param {number} m - Number of rows in the matrix
 * @param {number} n - Number of columns in the matrix
 * @param {number[][]} ops - Array of operations, where each operation is [a, b]
 * @return {number} - Number of cells containing the maximum value
 */
function maxCount(m, n, ops) {
  // If there are no operations, all cells remain 0 (the maximum)
  // So the entire m x n matrix contains the maximum value
  if (!ops || ops.length === 0) {
    return m * n;
  }

  // Initialize minA and minB with the first operation
  // We'll find the minimum a and minimum b across all operations
  let minA = ops[0][0];
  let minB = ops[0][1];

  // Iterate through all operations to find the smallest dimensions
  for (let i = 0; i < ops.length; i++) {
    const [a, b] = ops[i];

    // Update minA if current a is smaller
    if (a < minA) {
      minA = a;
    }

    // Update minB if current b is smaller
    if (b < minB) {
      minB = b;
    }
  }

  // The maximum values will be in the rectangle from (0,0) to (minA, minB)
  // The count is simply the area of this rectangle
  return minA * minB;
}
```

```java
// Time: O(k) where k is the number of operations
// Space: O(1) - we only use a few variables
class Solution {
    /**
     * Counts the number of maximum integers after performing all operations.
     *
     * @param m Number of rows in the matrix
     * @param n Number of columns in the matrix
     * @param ops Array of operations, where each operation is [a, b]
     * @return Number of cells containing the maximum value
     */
    public int maxCount(int m, int n, int[][] ops) {
        // If there are no operations, all cells remain 0 (the maximum)
        // So the entire m x n matrix contains the maximum value
        if (ops == null || ops.length == 0) {
            return m * n;
        }

        // Initialize minA and minB with the first operation
        // We'll find the minimum a and minimum b across all operations
        int minA = ops[0][0];
        int minB = ops[0][1];

        // Iterate through all operations to find the smallest dimensions
        for (int i = 0; i < ops.length; i++) {
            int a = ops[i][0];
            int b = ops[i][1];

            // Update minA if current a is smaller
            if (a < minA) {
                minA = a;
            }

            // Update minB if current b is smaller
            if (b < minB) {
                minB = b;
            }
        }

        // The maximum values will be in the rectangle from (0,0) to (minA, minB)
        // The count is simply the area of this rectangle
        return minA * minB;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k), where k is the number of operations. We simply iterate through the operations once to find the minimum a and minimum b values.

**Space Complexity:** O(1). We only use a constant amount of extra space to store min_a and min_b (or minA and minB), regardless of the input size.

This is optimal because we must at least examine each operation once to know what operations were performed.

## Common Mistakes

1. **Forgetting to handle the empty operations case:** If ops is empty, no increments happen, so all cells remain at 0. The entire m×n matrix contains the maximum value (0), so the answer should be m × n.

2. **Using m and n as initial minimum values:** Some candidates initialize min_a = m and min_b = n, thinking these are the maximum possible bounds. This works mathematically but is conceptually incorrect because operations could have aᵢ > m or bᵢ > n (though they'd be capped by the matrix bounds). It's cleaner to initialize with the first operation's values.

3. **Confusing rows and columns:** The operations are given as [a,b] where a affects rows (x from 0 to a-1) and b affects columns (y from 0 to b-1). Mixing these up will give incorrect results.

4. **Overcomplicating with matrix simulation:** The most common mistake is trying to actually build and update the matrix. This not only wastes time during implementation but also leads to inefficient solutions that fail on larger inputs.

## When You'll See This Pattern

This problem teaches the **intersection of ranges** pattern, which appears in various forms:

1. **Range Addition (LeetCode 370):** While more complex (dealing with 1D ranges that can start anywhere), it uses a similar prefix sum/difference array technique to avoid simulating all increments.

2. **Sum of Matrix After Queries (LeetCode 2718):** Another matrix operation problem where direct simulation is too slow, requiring clever observation about operation ordering and overlap.

3. **Rectangle Overlap (LeetCode 836):** Determining if two rectangles overlap involves similar logic with minimum and maximum coordinate comparisons.

4. **Meeting Rooms II (LeetCode 253):** Finding the minimum number of conference rooms requires tracking overlapping time intervals, a related concept of range intersections.

The core idea is recognizing when operations affect overlapping regions and finding efficient ways to compute the result without simulating every individual update.

## Key Takeaways

1. **Look for mathematical insights before coding:** Many "simulation" problems have mathematical shortcuts. When all operations start from the same point (like (0,0) here), the result is often determined by minimum/maximum values.

2. **Consider what's being maximized/minimized:** In this problem, we want the cells that receive the most increments. Since every operation increments from (0,0), the most-incremented cells are those in the intersection of all operation ranges.

3. **Empty input is a valid edge case:** Always check for empty or null inputs. In this case, empty ops means no increments, which changes the result significantly.

4. **Constraints guide optimization:** The problem constraints (m, n up to 40,000) should immediately signal that O(m×n) solutions won't work, pushing you to find a more efficient approach.

Related problems: [Range Addition](/problem/range-addition), [Sum of Matrix After Queries](/problem/sum-of-matrix-after-queries)
