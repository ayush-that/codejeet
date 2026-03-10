---
title: "How to Solve Minimum Operations to Make a Uni-Value Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make a Uni-Value Grid. Medium difficulty, 67.5% acceptance rate. Topics: Array, Math, Sorting, Matrix."
date: "2026-10-18"
category: "dsa-patterns"
tags: ["minimum-operations-to-make-a-uni-value-grid", "array", "math", "sorting", "medium"]
---

# How to Solve Minimum Operations to Make a Uni-Value Grid

You're given a 2D grid and an integer `x`. In each operation, you can add or subtract `x` from any cell. Your goal is to make all cells equal with the minimum number of operations. The tricky part is that you can only change values by multiples of `x`, which means not all target values are possible—the target must be congruent modulo `x` with all original values.

## Visual Walkthrough

Let's trace through a concrete example:

```
grid = [[2, 4], [6, 8]], x = 2
```

**Step 1: Flatten and sort the values**
All values: [2, 4, 6, 8]
Sorted: [2, 4, 6, 8]

**Step 2: Check modulo condition**
Each value mod x must be equal:

- 2 % 2 = 0
- 4 % 2 = 0
- 6 % 2 = 0
- 8 % 2 = 0
  All have remainder 0, so a solution exists.

**Step 3: Find optimal target**
We need to find a value T such that:

1. T ≡ 2 (mod 2) = 0 (mod 2)
2. Minimizes Σ|valueᵢ - T| / x

Since all differences must be divisible by x, we can work with normalized values:
Normalized = [2/x, 4/x, 6/x, 8/x] = [1, 2, 3, 4]

Now we need to minimize Σ|normalizedᵢ - T'| where T' = T/x

**Step 4: Apply median property**
For minimizing sum of absolute deviations, the median is optimal:
Sorted normalized: [1, 2, 3, 4]
Median = 2.5 → can use either 2 or 3

**Step 5: Calculate operations**
If T' = 2:
Operations = |1-2| + |2-2| + |3-2| + |4-2| = 1 + 0 + 1 + 2 = 4
If T' = 3:
Operations = |1-3| + |2-3| + |3-3| + |4-3| = 2 + 1 + 0 + 1 = 4

Total operations = 4 × x = 4 × 2 = 8

Wait—we made a mistake! We already divided by x, so we should multiply back:
Operations = 4 (from normalized) × 1 = 4 operations

Let's verify directly:
Target T = 6 (since T' = 3, T = 3×2 = 6):

- 2 → 6: (6-2)/2 = 2 operations
- 4 → 6: (6-4)/2 = 1 operation
- 6 → 6: 0 operations
- 8 → 6: (8-6)/2 = 1 operation
  Total = 2 + 1 + 0 + 1 = 4 operations ✓

## Brute Force Approach

A naive approach would try every possible target value between the min and max in the grid, checking if it's reachable from all values (i.e., (target - value) % x == 0). For each candidate target, calculate the total operations needed.

**Why this fails:**

1. **Range too large**: The grid values can be up to 10⁴, and grid size up to 10⁵, so trying all values between min and max is O(range × m×n), which is infeasible.
2. **Inefficient**: Even if we only try values that are congruent modulo x, there could still be thousands of candidates.
3. **No optimization**: We'd be recalculating the sum of absolute differences repeatedly.

The brute force helps us understand the problem but isn't practical for the constraints.

## Optimized Approach

The key insight is that this problem reduces to **Minimize Sum of Absolute Deviations**, which is solved by the **median**.

**Step-by-step reasoning:**

1. **Modulo Check**: All values must have the same remainder when divided by x. If not, return -1 immediately.
   - Reason: If values have different remainders, no amount of adding/subtracting x can make them equal.

2. **Normalization**: Since we can only change values by ±x, divide all values by x (after adjusting).
   - Convert each value v to (v - base) / x where base is the remainder.
   - Now we need to make all normalized values equal with minimum sum of absolute differences.

3. **Median Property**: For a set of numbers, the sum of absolute deviations Σ|aᵢ - t| is minimized when t is the median.
   - Proof intuition: If you move t away from the median, you increase more distances than you decrease.

4. **Two Median Candidates**: For an even number of elements, any value between the two middle elements gives the same minimum sum. We can use either middle element.

5. **Calculate Operations**:
   - Find median of normalized values
   - Sum |normalizedᵢ - median| for all i
   - This sum equals the minimum number of operations

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n log(m*n)) for sorting | Space: O(m*n) for storing flattened array
def minOperations(self, grid, x):
    """
    :type grid: List[List[int]]
    :type x: int
    :rtype: int
    """
    # Step 1: Flatten the 2D grid into a 1D list
    nums = []
    for row in grid:
        nums.extend(row)

    # Step 2: Sort to easily find median and check remainders
    nums.sort()

    # Step 3: Check if all numbers have the same remainder modulo x
    # We compare each number's remainder with the first number's remainder
    remainder = nums[0] % x
    for num in nums:
        if num % x != remainder:
            return -1  # Impossible to make all numbers equal

    # Step 4: Normalize the numbers by subtracting the base remainder
    # and dividing by x. This transforms the problem into making
    # all normalized numbers equal with minimum sum of absolute differences.
    normalized = [(num - remainder) // x for num in nums]

    # Step 5: Find the median of normalized numbers
    # For odd length, median is the middle element
    # For even length, either middle element works (both give same minimum sum)
    n = len(normalized)
    median = normalized[n // 2]

    # Step 6: Calculate minimum operations
    # Sum of absolute differences from each number to the median
    operations = 0
    for num in normalized:
        operations += abs(num - median)

    return operations
```

```javascript
// Time: O(m*n log(m*n)) for sorting | Space: O(m*n) for storing flattened array
/**
 * @param {number[][]} grid
 * @param {number} x
 * @return {number}
 */
var minOperations = function (grid, x) {
  // Step 1: Flatten the 2D grid into a 1D array
  const nums = [];
  for (const row of grid) {
    nums.push(...row);
  }

  // Step 2: Sort to easily find median and check remainders
  nums.sort((a, b) => a - b);

  // Step 3: Check if all numbers have the same remainder modulo x
  const remainder = nums[0] % x;
  for (const num of nums) {
    if (num % x !== remainder) {
      return -1; // Impossible to make all numbers equal
    }
  }

  // Step 4: Normalize the numbers
  // Subtract the base remainder and divide by x
  const normalized = nums.map((num) => (num - remainder) / x);

  // Step 5: Find the median of normalized numbers
  const n = normalized.length;
  const median = normalized[Math.floor(n / 2)];

  // Step 6: Calculate minimum operations
  // Sum of absolute differences from each number to the median
  let operations = 0;
  for (const num of normalized) {
    operations += Math.abs(num - median);
  }

  return operations;
};
```

```java
// Time: O(m*n log(m*n)) for sorting | Space: O(m*n) for storing flattened array
class Solution {
    public int minOperations(int[][] grid, int x) {
        // Step 1: Flatten the 2D grid into a 1D list
        int m = grid.length;
        int n = grid[0].length;
        int[] nums = new int[m * n];
        int idx = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                nums[idx++] = grid[i][j];
            }
        }

        // Step 2: Sort to easily find median and check remainders
        Arrays.sort(nums);

        // Step 3: Check if all numbers have the same remainder modulo x
        int remainder = nums[0] % x;
        for (int num : nums) {
            if (num % x != remainder) {
                return -1;  // Impossible to make all numbers equal
            }
        }

        // Step 4: Normalize the numbers
        // Subtract the base remainder and divide by x
        int[] normalized = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            normalized[i] = (nums[i] - remainder) / x;
        }

        // Step 5: Find the median of normalized numbers
        int median = normalized[normalized.length / 2];

        // Step 6: Calculate minimum operations
        // Sum of absolute differences from each number to the median
        int operations = 0;
        for (int num : normalized) {
            operations += Math.abs(num - median);
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n log(m×n))**

- Flattening the grid takes O(m×n)
- Sorting the flattened array takes O(m×n log(m×n)) - this dominates
- Checking remainders takes O(m×n)
- Normalizing and calculating operations takes O(m×n)

**Space Complexity: O(m×n)**

- We store the flattened array of size m×n
- We also store the normalized array of the same size
- Sorting typically requires O(log n) stack space for recursion, but the arrays dominate

## Common Mistakes

1. **Forgetting the modulo check**: Candidates often jump straight to finding the median without verifying that all values have the same remainder modulo x. This leads to incorrect solutions when it's actually impossible.
   - **How to avoid**: Always check `(num % x) == (first_num % x)` for all nums before proceeding.

2. **Using mean instead of median**: The sum of absolute deviations is minimized by the median, not the mean. Using the mean gives suboptimal results.
   - **How to avoid**: Remember this property: For minimizing |aᵢ - t|, use median; for minimizing (aᵢ - t)², use mean.

3. **Incorrect normalization**: Some candidates try to work with the original values without dividing by x, which makes the median calculation invalid.
   - **How to avoid**: Convert to normalized values `(value - remainder) / x` before finding the median.

4. **Off-by-one in median selection**: For even-length arrays, both middle elements work, but some candidates try to average them or choose the wrong index.
   - **How to avoid**: Use `nums[n//2]` in Python/Java or `nums[Math.floor(n/2)]` in JavaScript. Any middle element gives the same result.

## When You'll See This Pattern

This "minimize sum of absolute deviations" pattern appears in several problems:

1. **Minimum Moves to Equal Array Elements II (LeetCode 462)** - The exact 1D version of this problem without the modulo constraint. Solution: Sort and use median.

2. **Best Meeting Point (LeetCode 296)** - Minimize total Manhattan distance to a meeting point. The x and y coordinates can be optimized independently using the median.

3. **Minimum Cost to Make Array Equal (LeetCode 2448)** - Similar concept but with weighted operations and continuous target values.

The core insight is that when you need to minimize the sum of absolute distances to a single point (in 1D, 2D Manhattan, or modulo-constrained space), the median is usually the answer.

## Key Takeaways

1. **Median minimizes absolute deviations**: When you need to minimize Σ|aᵢ - t|, the optimal t is the median of the aᵢ's. This is a fundamental optimization property to remember.

2. **Modulo constraints create equivalence classes**: When you can only change values by multiples of k, all values must be in the same residue class modulo k for a solution to exist.

3. **Normalize before applying patterns**: Complex constraints (like only changing by ±x) can often be removed by normalizing the data, reducing to a simpler known problem.

Related problems: [Minimum Moves to Equal Array Elements II](/problem/minimum-moves-to-equal-array-elements-ii)
