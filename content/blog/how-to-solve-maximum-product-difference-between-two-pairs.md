---
title: "How to Solve Maximum Product Difference Between Two Pairs — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Product Difference Between Two Pairs. Easy difficulty, 83.0% acceptance rate. Topics: Array, Sorting."
date: "2028-01-19"
category: "dsa-patterns"
tags: ["maximum-product-difference-between-two-pairs", "array", "sorting", "easy"]
---

# How to Solve Maximum Product Difference Between Two Pairs

The problem asks us to find the maximum possible product difference between two pairs of distinct elements from an array. The product difference is defined as `(a * b) - (c * d)` where `(a, b)` and `(c, d)` are two pairs of distinct indices. While this might initially seem complex, the key insight is that to maximize this difference, we want the largest possible product minus the smallest possible product. This makes the problem much simpler than it first appears.

## Visual Walkthrough

Let's walk through an example: `nums = [5, 6, 2, 7, 4]`

**Step 1: Understanding what we need**
We want to maximize `(a * b) - (c * d)`. Since subtraction is involved, we want `(a * b)` to be as large as possible and `(c * d)` to be as small as possible.

**Step 2: Finding the largest product**
The largest product comes from multiplying the two largest numbers in the array:

- Sort the array: `[2, 4, 5, 6, 7]`
- Two largest numbers: `6` and `7`
- Largest product: `6 * 7 = 42`

**Step 3: Finding the smallest product**
The smallest product comes from multiplying the two smallest numbers:

- Two smallest numbers: `2` and `4`
- Smallest product: `2 * 4 = 8`

**Step 4: Calculating the maximum product difference**

- Maximum product difference = `42 - 8 = 34`

**Step 5: Verification**
Let's check if we could get a larger difference with other combinations:

- If we used `5` and `7` for large product: `5 * 7 = 35` (smaller than 42)
- If we used `2` and `5` for small product: `2 * 5 = 10` (larger than 8)
- Any other combination gives us a smaller difference than `34`

This shows that the optimal approach is simply: `(largest * second_largest) - (smallest * second_smallest)`.

## Brute Force Approach

A naive approach would be to try all possible combinations of four distinct indices and calculate their product difference. For each set of four indices, we'd need to consider all possible pairings of those four numbers into two pairs, then find the maximum difference among those pairings.

The brute force approach would involve:

1. Generating all combinations of 4 distinct indices from n elements
2. For each combination, trying all ways to split the 4 numbers into two pairs
3. Calculating the product difference for each pairing
4. Tracking the maximum difference found

This approach has several problems:

- The number of 4-element combinations is C(n, 4) = n!/(4!(n-4)!)
- For each combination of 4 numbers, we have 3 possible ways to pair them into two pairs
- This results in O(n⁴) time complexity, which is far too slow for typical constraints (n up to 10⁴)

The key insight that makes the brute force unnecessary is that we don't need to consider all combinations - we just need the two largest and two smallest numbers in the entire array.

## Optimal Solution

The optimal solution is straightforward once we recognize the pattern: to maximize `(a * b) - (c * d)`, we want `a * b` to be as large as possible and `c * d` to be as small as possible. The largest product comes from the two largest numbers in the array, and the smallest product comes from the two smallest numbers.

We have two implementation approaches:

1. **Sorting approach**: Sort the array and take the first two and last two elements
2. **Linear scan approach**: Find the two largest and two smallest numbers in one pass

The sorting approach is simpler to implement and understand, while the linear scan approach has better theoretical time complexity (though for practical purposes with n ≤ 10⁴, both are fine).

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def maxProductDifference(nums):
    """
    Calculate the maximum product difference between two pairs of numbers.

    The maximum product difference is achieved by taking:
    (largest * second_largest) - (smallest * second_smallest)

    Args:
        nums: List of integers

    Returns:
        Maximum product difference
    """
    # Step 1: Sort the array in ascending order
    # This brings the smallest numbers to the front and largest to the back
    nums.sort()

    # Step 2: Get the two smallest numbers (first two elements)
    smallest1, smallest2 = nums[0], nums[1]

    # Step 3: Get the two largest numbers (last two elements)
    largest2, largest1 = nums[-2], nums[-1]  # Note: -1 is last, -2 is second last

    # Step 4: Calculate the maximum product difference
    # (largest * second_largest) - (smallest * second_smallest)
    max_product = (largest1 * largest2) - (smallest1 * smallest2)

    return max_product
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function maxProductDifference(nums) {
  /**
   * Calculate the maximum product difference between two pairs of numbers.
   *
   * The maximum product difference is achieved by taking:
   * (largest * second_largest) - (smallest * second_smallest)
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Maximum product difference
   */

  // Step 1: Sort the array in ascending order
  // This brings the smallest numbers to the front and largest to the back
  nums.sort((a, b) => a - b); // Important: numeric sort, not lexicographic

  // Step 2: Get the two smallest numbers (first two elements)
  const smallest1 = nums[0];
  const smallest2 = nums[1];

  // Step 3: Get the two largest numbers (last two elements)
  const n = nums.length;
  const largest2 = nums[n - 2]; // Second last element
  const largest1 = nums[n - 1]; // Last element

  // Step 4: Calculate the maximum product difference
  // (largest * second_largest) - (smallest * second_smallest)
  const maxProduct = largest1 * largest2 - smallest1 * smallest2;

  return maxProduct;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
class Solution {
    public int maxProductDifference(int[] nums) {
        /**
         * Calculate the maximum product difference between two pairs of numbers.
         *
         * The maximum product difference is achieved by taking:
         * (largest * second_largest) - (smallest * second_smallest)
         *
         * @param nums Array of integers
         * @return Maximum product difference
         */

        // Step 1: Sort the array in ascending order
        // This brings the smallest numbers to the front and largest to the back
        Arrays.sort(nums);

        // Step 2: Get the two smallest numbers (first two elements)
        int smallest1 = nums[0];
        int smallest2 = nums[1];

        // Step 3: Get the two largest numbers (last two elements)
        int n = nums.length;
        int largest2 = nums[n - 2];  // Second last element
        int largest1 = nums[n - 1];  // Last element

        // Step 4: Calculate the maximum product difference
        // (largest * second_largest) - (smallest * second_smallest)
        int maxProduct = (largest1 * largest2) - (smallest1 * smallest2);

        return maxProduct;
    }
}
```

</div>

**Alternative: Linear Scan Approach**
For completeness, here's the O(n) approach that finds the two largest and two smallest numbers in one pass:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxProductDifferenceLinear(nums):
    # Initialize with extreme values
    max1 = max2 = float('-inf')  # largest and second largest
    min1 = min2 = float('inf')   # smallest and second smallest

    for num in nums:
        # Update two largest numbers
        if num > max1:
            max2 = max1  # old max1 becomes max2
            max1 = num   # new max1
        elif num > max2:
            max2 = num   # new max2

        # Update two smallest numbers
        if num < min1:
            min2 = min1  # old min1 becomes min2
            min1 = num   # new min1
        elif num < min2:
            min2 = num   # new min2

    return (max1 * max2) - (min1 * min2)
```

</div>

## Complexity Analysis

**Sorting Approach:**

- **Time Complexity:** O(n log n) - Dominated by the sorting operation
- **Space Complexity:** O(1) or O(n) - Depends on the sorting algorithm implementation. Some languages use O(1) space for sorting (like Python's Timsort for arrays), while others might use O(n) in worst case.

**Linear Scan Approach:**

- **Time Complexity:** O(n) - Single pass through the array
- **Space Complexity:** O(1) - Only storing four variables regardless of input size

For most interview scenarios and practical purposes with n ≤ 10⁴, the sorting approach is perfectly acceptable and often preferred for its simplicity and readability.

## Common Mistakes

1. **Not using distinct indices**: The problem requires four distinct indices, but since we're taking the two largest and two smallest numbers from the entire array, they will automatically be distinct as long as the array has at least 4 elements.

2. **Incorrect sorting in JavaScript**: Using `nums.sort()` without a comparator function in JavaScript performs lexicographic (string) sorting, not numeric sorting. For `[10, 2, 5, 2]`, `sort()` gives `[10, 2, 2, 5]` (wrong), while `sort((a,b) => a-b)` gives `[2, 2, 5, 10]` (correct).

3. **Off-by-one errors with array indices**: When accessing the last two elements, remember that `nums[-1]` works in Python but not in Java or JavaScript. In Java/JS, use `nums[nums.length-1]` and `nums[nums.length-2]`.

4. **Not handling small arrays**: While the problem guarantees at least 4 elements, in real interviews you might be asked about edge cases. Always clarify assumptions about input size.

5. **Overcomplicating the solution**: Some candidates try to find all combinations or use complex data structures, missing the simple observation that only the extremes matter.

## When You'll See This Pattern

This problem teaches the important pattern of **"extremes give optimal results"** for certain types of optimization problems. You'll see similar patterns in:

1. **Maximum Product of Three Numbers (LeetCode 628)** - To maximize the product of three numbers, you need either the three largest numbers (all positive) or the two smallest (negative) times the largest (if negatives make a positive).

2. **Maximum Average Subarray I (LeetCode 643)** - While not exactly the same, it involves finding optimal contiguous subarrays, which often involves considering boundary cases.

3. **Two Sum (LeetCode 1)** - The complementary problem of finding pairs that sum to a target often involves sorting and considering elements from both ends.

4. **Container With Most Water (LeetCode 11)** - Uses the two-pointer technique starting from both ends, similar to how we consider extremes.

The key insight across these problems is that for many optimization problems involving products, sums, or differences, the optimal solution often involves the extreme values (minimum/maximum) rather than values in the middle.

## Key Takeaways

1. **Look for mathematical simplification**: Before diving into coding, analyze the mathematical expression. For `(a*b) - (c*d)` to be maximized, we need `a*b` maximized and `c*d` minimized.

2. **Extremes often give optimal solutions**: In many array optimization problems, the answer involves the smallest/largest elements. Always check if sorting or finding extremes simplifies the problem.

3. **Don't overcomplicate easy problems**: This is marked "Easy" for a reason. If you find yourself designing complex algorithms for an easy problem, step back and reconsider the problem statement.

4. **Know your language's sorting behavior**: Different languages handle sorting differently (especially JavaScript). Always use comparator functions for numeric sorting when needed.

[Practice this problem on CodeJeet](/problem/maximum-product-difference-between-two-pairs)
