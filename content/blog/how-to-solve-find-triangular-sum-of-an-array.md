---
title: "How to Solve Find Triangular Sum of an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Triangular Sum of an Array. Medium difficulty, 82.0% acceptance rate. Topics: Array, Math, Simulation, Combinatorics, Number Theory."
date: "2028-06-06"
category: "dsa-patterns"
tags: ["find-triangular-sum-of-an-array", "array", "math", "simulation", "medium"]
---

# How to Solve Find Triangular Sum of an Array

The problem asks us to repeatedly reduce an array by replacing adjacent pairs with their sum modulo 10 until only one element remains. While the simulation approach is straightforward, the challenge lies in recognizing the mathematical pattern that allows for an efficient solution. This problem is interesting because it combines array manipulation with combinatorial mathematics, revealing a connection to Pascal's Triangle and binomial coefficients.

## Visual Walkthrough

Let's trace through the example `nums = [1, 2, 3, 4, 5]` step by step:

**Initial array:** `[1, 2, 3, 4, 5]`

**Step 1:** Create new array from adjacent sums modulo 10:

- (1 + 2) % 10 = 3
- (2 + 3) % 10 = 5
- (3 + 4) % 10 = 7
- (4 + 5) % 10 = 9
  Result: `[3, 5, 7, 9]`

**Step 2:** Repeat the process:

- (3 + 5) % 10 = 8
- (5 + 7) % 10 = 2
- (7 + 9) % 10 = 6
  Result: `[8, 2, 6]`

**Step 3:** Repeat again:

- (8 + 2) % 10 = 0
- (2 + 6) % 10 = 8
  Result: `[0, 8]`

**Step 4:** Final step:

- (0 + 8) % 10 = 8

**Final answer:** `8`

The process creates a triangular shape of operations, hence the name "triangular sum."

## Brute Force Approach

The most straightforward approach is to simulate the process exactly as described in the problem statement. We repeatedly create a new array where each element is the sum modulo 10 of adjacent elements from the current array, until only one element remains.

**Why this approach is inefficient:**

- For an array of size `n`, we perform `n-1` reduction steps
- Each step processes a shrinking array: first step processes `n-1` pairs, next step processes `n-2` pairs, and so on
- This results in O(n²) time complexity, which is acceptable for small inputs but becomes problematic for larger arrays
- The space complexity is O(n) for storing intermediate arrays

While this brute force solution would technically work and is easy to understand, we can do better by recognizing the mathematical pattern behind the operations.

## Optimized Approach

The key insight is that the triangular sum follows a pattern related to binomial coefficients (Pascal's Triangle). Each element in the original array contributes to the final result based on its position, and the contribution is weighted by binomial coefficients modulo 10.

**Mathematical Insight:**

- After `n-1` reduction steps, the final result is the sum of `nums[i] * C(n-1, i)` for all `i`, taken modulo 10
- `C(n-1, i)` is the binomial coefficient "n-1 choose i"
- We need to compute binomial coefficients modulo 10 efficiently

**Why this works:**

1. Each reduction step is essentially applying the transformation: `new[i] = (old[i] + old[i+1]) % 10`
2. This is similar to building Pascal's Triangle where each element is the sum of the two above it
3. After `k` reductions, each element is a linear combination of the original elements with binomial coefficients as weights
4. After `n-1` reductions, we get the final single value

**Optimization Strategy:**
We can compute binomial coefficients iteratively using the recurrence relation:

- `C(n, 0) = 1` for any n
- `C(n, k) = C(n-1, k-1) + C(n-1, k)` for 0 < k < n

Since we only need the coefficients modulo 10, we can compute them efficiently in O(n²) time with O(n) space.

## Optimal Solution

The most efficient approach combines the mathematical insight with in-place computation. We can modify the original array in-place to avoid extra space usage while maintaining the O(n²) time complexity.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def triangularSum(nums):
    """
    Calculate the triangular sum of an array in-place.

    The algorithm works by repeatedly reducing the array size by 1,
    updating each element to be the sum of itself and the next element modulo 10.
    This is done in-place to avoid using extra space.

    Args:
        nums: List[int] - Array of digits 0-9

    Returns:
        int - The triangular sum
    """
    n = len(nums)

    # Continue until only one element remains
    while n > 1:
        # For each position in the new (smaller) array
        for i in range(n - 1):
            # Update current element to be (current + next) % 10
            # This effectively creates the next row of the triangle
            nums[i] = (nums[i] + nums[i + 1]) % 10

        # Reduce the effective size of the array
        n -= 1

    # After the loop, nums[0] contains the triangular sum
    return nums[0]
```

```javascript
// Time: O(n²) | Space: O(1)
function triangularSum(nums) {
  /**
   * Calculate the triangular sum of an array in-place.
   *
   * The algorithm works by repeatedly reducing the array size by 1,
   * updating each element to be the sum of itself and the next element modulo 10.
   * This is done in-place to avoid using extra space.
   *
   * @param {number[]} nums - Array of digits 0-9
   * @return {number} - The triangular sum
   */
  let n = nums.length;

  // Continue until only one element remains
  while (n > 1) {
    // For each position in the new (smaller) array
    for (let i = 0; i < n - 1; i++) {
      // Update current element to be (current + next) % 10
      // This effectively creates the next row of the triangle
      nums[i] = (nums[i] + nums[i + 1]) % 10;
    }

    // Reduce the effective size of the array
    n--;
  }

  // After the loop, nums[0] contains the triangular sum
  return nums[0];
}
```

```java
// Time: O(n²) | Space: O(1)
class Solution {
    public int triangularSum(int[] nums) {
        /**
         * Calculate the triangular sum of an array in-place.
         *
         * The algorithm works by repeatedly reducing the array size by 1,
         * updating each element to be the sum of itself and the next element modulo 10.
         * This is done in-place to avoid using extra space.
         *
         * @param nums - Array of digits 0-9
         * @return The triangular sum
         */
        int n = nums.length;

        // Continue until only one element remains
        while (n > 1) {
            // For each position in the new (smaller) array
            for (int i = 0; i < n - 1; i++) {
                // Update current element to be (current + next) % 10
                // This effectively creates the next row of the triangle
                nums[i] = (nums[i] + nums[i + 1]) % 10;
            }

            // Reduce the effective size of the array
            n--;
        }

        // After the loop, nums[0] contains the triangular sum
        return nums[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- The outer `while` loop runs `n-1` times (from `n` down to 2)
- The inner `for` loop runs `n-1` times in the first iteration, `n-2` times in the second, and so on
- Total operations: `(n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)`

**Space Complexity: O(1)**

- We modify the input array in-place without using additional data structures
- Only a constant amount of extra space is used for variables `n` and `i`

## Common Mistakes

1. **Forgetting the modulo operation**: The problem specifies that sums should be taken modulo 10. Without this, intermediate values could exceed the digit range and the final result would be incorrect.

2. **Incorrect loop boundaries**: When updating elements in-place, it's crucial to stop at `n-2` (or use `n-1` as the exclusive bound) to avoid accessing out-of-bounds elements. Accessing `nums[i+1]` when `i = n-1` would cause an index error.

3. **Modifying the wrong elements**: When updating in-place, we must process elements from left to right. If we process from right to left, we would be using already-updated values incorrectly.

4. **Not handling the single-element case**: While the loop condition `while n > 1` handles this, some implementations might forget that when `n=1`, the answer is simply `nums[0]` without any processing.

## When You'll See This Pattern

This problem demonstrates patterns that appear in several other coding problems:

1. **Pascal's Triangle (LeetCode 118 & 119)**: The triangular sum is essentially computing a single value from Pascal's Triangle modulo 10. The recurrence relation `new[i] = old[i] + old[i+1]` is exactly how Pascal's Triangle is built.

2. **Min Max Game (LeetCode 2293)**: Similar reduction pattern where array size is repeatedly halved by applying an operation to adjacent elements. The main difference is the operation (min/max vs. sum modulo 10).

3. **Calculate Digit Sum of a String (LeetCode 2243)**: Involves repeatedly summing digits until a single digit remains, though applied to strings rather than arrays.

4. **Dynamic Programming problems**: The in-place update technique where we overwrite previous values as we compute new ones is common in DP problems that optimize space complexity.

## Key Takeaways

1. **In-place array modification**: When processing arrays in stages, you can often overwrite previous values to save space, as long as you're careful about the order of updates.

2. **Mathematical patterns in array reductions**: Operations that combine adjacent elements often relate to combinatorial mathematics. Recognizing these patterns can lead to more efficient solutions.

3. **Modular arithmetic**: When working with digits 0-9, remember to apply modulo 10 operations to keep values within bounds. This is especially important when sums might exceed single digits.

4. **Loop boundary awareness**: When accessing `arr[i]` and `arr[i+1]`, the loop must stop one element early to avoid index errors. This is a common pattern in adjacent element processing.

Related problems: [Pascal's Triangle II](/problem/pascals-triangle-ii), [Calculate Digit Sum of a String](/problem/calculate-digit-sum-of-a-string), [Min Max Game](/problem/min-max-game)
