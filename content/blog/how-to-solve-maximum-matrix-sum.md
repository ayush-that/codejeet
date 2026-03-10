---
title: "How to Solve Maximum Matrix Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Matrix Sum. Medium difficulty, 67.6% acceptance rate. Topics: Array, Greedy, Matrix."
date: "2028-06-17"
category: "dsa-patterns"
tags: ["maximum-matrix-sum", "array", "greedy", "matrix", "medium"]
---

# How to Solve Maximum Matrix Sum

This problem asks us to maximize the sum of all elements in an n×n matrix by repeatedly multiplying pairs of adjacent elements by -1. The tricky part is understanding how these operations affect the overall sum and what the theoretical maximum achievable sum actually is.

## Visual Walkthrough

Let's start with a simple 2×2 example:

```
[1, -2]
[-3, 4]
```

Initial sum = 1 + (-2) + (-3) + 4 = 0

**Key observation**: When we multiply two adjacent elements by -1, their combined value changes by 2×(sum of their absolute values) if they have opposite signs, or stays the same if they have the same sign. More importantly, we can move negative signs around the matrix.

Let's trace through what we can achieve:

1. Initial: [1, -2], [-3, 4]
2. Flip (1, -2): [-1, 2], [-3, 4] (sum = 2)
3. Flip (-1, -3): [1, 3], [2, 4] (sum = 10)

We went from sum 0 to sum 10! But is this the maximum? Let's think about the absolute values: |1| + |2| + |3| + |4| = 10. This suggests we might be able to get all positive numbers.

Actually, there's a limitation: The parity (odd/even count) of negative numbers matters. If we have an even number of negatives, we can make them all positive. If odd, we'll always have at least one negative number.

Let's test with an odd count:

```
[1, -2]
[3, -4]
```

Absolute sum = 1 + 2 + 3 + 4 = 10
But we have 3 negatives (odd), so we can only make 2 of them positive, leaving 1 negative. The best we can do is make the smallest absolute value negative: 10 - 2×1 = 8.

## Brute Force Approach

A naive approach might try to simulate all possible sequences of operations. For an n×n matrix, each cell has 4 neighbors (except edges), so at each step we have O(n²) possible moves. The number of sequences grows exponentially, making this completely infeasible even for small matrices.

What a candidate might incorrectly try is a greedy approach that always flips the most negative pair. But this doesn't work because flipping affects neighboring cells, creating complex dependencies.

## Optimized Approach

The key insight comes from understanding what these operations can and cannot do:

1. **Operation analysis**: Flipping two adjacent elements (multiplying both by -1) is equivalent to:
   - Changing the sign of both elements
   - The product of the two elements remains the same (since (-a)×(-b) = a×b)
   - The sum of all elements changes by 2×(a+b) if a and b have opposite signs

2. **What can we achieve?**:
   - We can move a negative sign to any position in the matrix by "pushing" it through adjacent flips
   - Two negative signs can cancel each other out (become positive)
   - With enough operations, we can pair up negatives

3. **The optimal strategy**:
   - Calculate the sum of absolute values of all elements
   - Count the number of negative numbers
   - If the count is even: we can make all numbers positive → answer = sum of absolute values
   - If the count is odd: we must leave one negative number → answer = sum of absolute values - 2×min_absolute_value
     (We choose the smallest absolute value to be negative to minimize the loss)

4. **Why this works**:
   - Each flip changes the parity (odd/even) of negative count in the affected row/column
   - With an even total count, we can pair them up and eliminate all negatives
   - With an odd count, the best we can do is minimize the negative value

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxMatrixSum(matrix):
    """
    Maximizes matrix sum by flipping signs of adjacent elements.

    Approach:
    1. Sum all absolute values (maximum possible if all could be positive)
    2. Track the smallest absolute value
    3. Count negative numbers
    4. If odd number of negatives, subtract 2×smallest_abs (make it negative)
    """
    total_sum = 0
    min_abs = float('inf')
    negative_count = 0

    # Iterate through all elements in the matrix
    for row in matrix:
        for num in row:
            # Add absolute value to total sum
            total_sum += abs(num)

            # Track the smallest absolute value we encounter
            min_abs = min(min_abs, abs(num))

            # Count negative numbers
            if num < 0:
                negative_count += 1

    # If we have an odd number of negatives, we must leave one negative
    # We choose the smallest absolute value to minimize the impact
    if negative_count % 2 == 1:
        total_sum -= 2 * min_abs

    return total_sum
```

```javascript
// Time: O(n²) | Space: O(1)
function maxMatrixSum(matrix) {
  /**
   * Maximizes matrix sum by flipping signs of adjacent elements.
   *
   * Approach:
   * 1. Sum all absolute values (maximum possible if all could be positive)
   * 2. Track the smallest absolute value
   * 3. Count negative numbers
   * 4. If odd number of negatives, subtract 2×smallest_abs (make it negative)
   */
  let totalSum = 0;
  let minAbs = Infinity;
  let negativeCount = 0;

  // Iterate through all elements in the matrix
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const num = matrix[i][j];

      // Add absolute value to total sum
      totalSum += Math.abs(num);

      // Track the smallest absolute value we encounter
      minAbs = Math.min(minAbs, Math.abs(num));

      // Count negative numbers
      if (num < 0) {
        negativeCount++;
      }
    }
  }

  // If we have an odd number of negatives, we must leave one negative
  // We choose the smallest absolute value to minimize the impact
  if (negativeCount % 2 === 1) {
    totalSum -= 2 * minAbs;
  }

  return totalSum;
}
```

```java
// Time: O(n²) | Space: O(1)
class Solution {
    public long maxMatrixSum(int[][] matrix) {
        /**
         * Maximizes matrix sum by flipping signs of adjacent elements.
         *
         * Approach:
         * 1. Sum all absolute values (maximum possible if all could be positive)
         * 2. Track the smallest absolute value
         * 3. Count negative numbers
         * 4. If odd number of negatives, subtract 2×smallest_abs (make it negative)
         */
        long totalSum = 0;
        int minAbs = Integer.MAX_VALUE;
        int negativeCount = 0;

        // Iterate through all elements in the matrix
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                int num = matrix[i][j];

                // Add absolute value to total sum
                totalSum += Math.abs(num);

                // Track the smallest absolute value we encounter
                minAbs = Math.min(minAbs, Math.abs(num));

                // Count negative numbers
                if (num < 0) {
                    negativeCount++;
                }
            }
        }

        // If we have an odd number of negatives, we must leave one negative
        // We choose the smallest absolute value to minimize the impact
        if (negativeCount % 2 == 1) {
            totalSum -= 2L * minAbs;
        }

        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) where n is the dimension of the matrix. We need to examine each of the n×n elements exactly once to compute the sum of absolute values, count negatives, and find the minimum absolute value.

**Space Complexity**: O(1). We only use a constant amount of extra space for variables tracking the total sum, minimum absolute value, and negative count. The input matrix is given and not counted toward our space usage.

## Common Mistakes

1. **Trying to simulate operations**: Some candidates attempt to actually perform the flips or use BFS/DFS to explore states. This is exponential and won't work for n > 3.

2. **Forgetting about zero**: Zero is neither positive nor negative. When counting negatives for parity check, zero doesn't affect the count. Also, if the minimum absolute value is zero, we can make it the "negative" without actually reducing the sum.

3. **Integer overflow**: The sum can be large (up to n² × 10⁵ = 10⁷ for n=1000). Use 64-bit integers (long in Java, no issue in Python).

4. **Incorrect handling of odd negative count**: When we have an odd number of negatives, we need to subtract 2×min_abs (not just min_abs) because we're changing a positive value to negative in our calculation.

## When You'll See This Pattern

This problem uses a **parity-based greedy** approach combined with **absolute value transformation**. Similar patterns appear in:

1. **Maximum Product Subarray (LeetCode 152)**: Also deals with sign changes and parity of negative counts, though in a 1D context.

2. **Bulb Switcher (LeetCode 319)**: Uses parity reasoning about toggles - each bulb is toggled once for each of its divisors, so only perfect squares remain on.

3. **Minimum Operations to Make Array Alternating (LeetCode 2170)**: Involves parity considerations when choosing elements at odd/even indices.

The core pattern is recognizing when operations have symmetry properties (like sign flipping preserving certain invariants) and using parity arguments to determine what's achievable.

## Key Takeaways

1. **Look for invariants**: When operations seem complex, check what properties they preserve. Here, the product of any two adjacent elements remains the same after flipping, but more importantly, we can move negative signs freely.

2. **Parity matters**: Many problems involving pairing or cancellation depend on whether counts are even or odd. Always check if the problem has a parity-based solution.

3. **Absolute value transformation**: When dealing with sign changes, converting to absolute values often simplifies the problem. The maximum sum we can achieve is bounded by the sum of absolute values.

[Practice this problem on CodeJeet](/problem/maximum-matrix-sum)
