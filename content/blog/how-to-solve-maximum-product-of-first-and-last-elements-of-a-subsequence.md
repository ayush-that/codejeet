---
title: "How to Solve Maximum Product of First and Last Elements of a Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Product of First and Last Elements of a Subsequence. Medium difficulty, 31.2% acceptance rate. Topics: Array, Two Pointers."
date: "2029-11-21"
category: "dsa-patterns"
tags:
  ["maximum-product-of-first-and-last-elements-of-a-subsequence", "array", "two-pointers", "medium"]
---

# How to Solve Maximum Product of First and Last Elements of a Subsequence

This problem asks us to find the maximum product of the first and last elements of any subsequence of size `m` from an array `nums`. The tricky part is that we're dealing with subsequences (not subarrays), which means we can pick elements from anywhere in the array, not necessarily contiguous ones. This gives us flexibility but also requires careful thinking about which elements to choose.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose `nums = [3, 5, 1, 8, 2]` and `m = 3`.

We need to choose a subsequence of size 3. The "first" element is the smallest index in our chosen subsequence, and the "last" element is the largest index in our chosen subsequence. The product we want to maximize is `nums[first_index] * nums[last_index]`.

Let's think about possible subsequences:

- If we choose indices [0, 1, 2] → first = 0 (value 3), last = 2 (value 1) → product = 3 × 1 = 3
- If we choose indices [0, 1, 3] → first = 0 (value 3), last = 3 (value 8) → product = 3 × 8 = 24
- If we choose indices [0, 2, 3] → first = 0 (value 3), last = 3 (value 8) → product = 3 × 8 = 24
- If we choose indices [0, 3, 4] → first = 0 (value 3), last = 4 (value 2) → product = 3 × 2 = 6
- If we choose indices [1, 2, 3] → first = 1 (value 5), last = 3 (value 8) → product = 5 × 8 = 40
- If we choose indices [1, 3, 4] → first = 1 (value 5), last = 4 (value 2) → product = 5 × 2 = 10
- If we choose indices [2, 3, 4] → first = 2 (value 1), last = 4 (value 2) → product = 1 × 2 = 2

The maximum product is 40 from indices [1, 2, 3].

Notice the pattern: For a subsequence of size `m`, if we fix the first element at index `i`, the last element must be at index `i + m - 1` or greater. Why? Because we need to have `m-1` other elements between them (or after them) to form a subsequence of size `m`.

This gives us the key insight: For each possible starting index `i`, the corresponding ending index must be at least `i + m - 1`. We want to maximize `nums[i] * nums[j]` where `j ≥ i + m - 1`.

## Brute Force Approach

A naive approach would be to generate all possible subsequences of size `m`, calculate the product of their first and last elements, and keep track of the maximum. However, the number of subsequences of size `m` from an array of size `n` is `C(n, m)` (n choose m), which grows factorially. Even for moderate values of `n` and `m`, this becomes computationally infeasible.

A slightly better but still inefficient brute force would be to try all pairs of indices `(i, j)` where `j - i ≥ m - 1` (meaning there are at least `m-1` indices between them, so we can form a subsequence of size `m`). For each valid pair, we check if we can actually pick `m-2` other elements from the indices between `i` and `j`. This check is always true because we can always pick any `m-2` elements from the range `(i, j)` as long as there are at least `m-2` elements available.

The time complexity would be O(n²) where n is the length of `nums`. For each of the O(n²) pairs, we'd need to verify we can form a subsequence of size `m`, which takes O(1) time since we just check if `j - i ≥ m - 1`. While O(n²) might work for small inputs, it's not optimal and can fail for larger constraints.

## Optimized Approach

The key insight is that for a fixed starting index `i`, we want to pair it with the maximum value among all possible ending indices `j` where `j ≥ i + m - 1`. Similarly, for a fixed ending index `j`, we want to pair it with the maximum value among all possible starting indices `i` where `i ≤ j - m + 1`.

This suggests two approaches:

1. For each possible starting index `i`, find the maximum value in the suffix starting from `i + m - 1`.
2. For each possible ending index `j`, find the maximum value in the prefix ending at `j - m + 1`.

Both approaches work, but the first one is more intuitive: We iterate through possible starting indices from left to right, and for each one, we need the maximum value in the remaining array starting from a certain position.

We can precompute suffix maximums: `suffix_max[i] = max(nums[i], nums[i+1], ..., nums[n-1])`. Then for each starting index `i`, the best partner is `suffix_max[i + m - 1]`, and we compute `nums[i] * suffix_max[i + m - 1]`.

Wait, there's a subtle issue: The suffix maximum gives us the maximum value, but we need the maximum product. Since we're multiplying, we also need to consider negative numbers. If `nums[i]` is negative, we might want to pair it with the minimum (most negative) value to get a large positive product. So we actually need to track both maximum and minimum suffix values.

The complete approach:

1. Precompute suffix maximums and suffix minimums.
2. For each starting index `i` where `i + m - 1 < n`:
   - Calculate `product1 = nums[i] * suffix_max[i + m - 1]`
   - Calculate `product2 = nums[i] * suffix_min[i + m - 1]`
   - Take the maximum of these two products
3. Track the overall maximum across all starting indices.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxProduct(nums, m):
    """
    Returns the maximum product of first and last elements of any subsequence of size m.

    Args:
        nums: List of integers
        m: Size of subsequence

    Returns:
        Maximum possible product
    """
    n = len(nums)

    # If m is 1, the subsequence has only one element, so first = last
    # The product would be nums[i] * nums[i] for some i
    # We need to return the maximum square
    if m == 1:
        return max(x * x for x in nums)

    # We need at least m elements to form a subsequence of size m
    if n < m:
        return 0  # Or raise an error based on problem constraints

    # Initialize suffix arrays
    # suffix_max[i] = maximum value from index i to end
    # suffix_min[i] = minimum value from index i to end
    suffix_max = [0] * n
    suffix_min = [0] * n

    # Fill suffix arrays from right to left
    suffix_max[-1] = nums[-1]
    suffix_min[-1] = nums[-1]

    for i in range(n - 2, -1, -1):
        suffix_max[i] = max(nums[i], suffix_max[i + 1])
        suffix_min[i] = min(nums[i], suffix_min[i + 1])

    max_product = float('-inf')

    # Try each possible starting index
    # The last possible starting index is n - m
    # because we need at least m-1 elements after it
    for i in range(n - m + 1):
        # The earliest possible ending index is i + m - 1
        end_index = i + m - 1

        # Calculate both possible products
        # We need to check both max and min because of negative numbers
        product_with_max = nums[i] * suffix_max[end_index]
        product_with_min = nums[i] * suffix_min[end_index]

        # Take the maximum of these two possibilities
        current_max = max(product_with_max, product_with_min)

        # Update overall maximum
        max_product = max(max_product, current_max)

    return max_product
```

```javascript
// Time: O(n) | Space: O(n)
function maxProduct(nums, m) {
  /**
   * Returns the maximum product of first and last elements of any subsequence of size m.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} m - Size of subsequence
   * @return {number} Maximum possible product
   */
  const n = nums.length;

  // If m is 1, the subsequence has only one element, so first = last
  // The product would be nums[i] * nums[i] for some i
  // We need to return the maximum square
  if (m === 1) {
    return Math.max(...nums.map((x) => x * x));
  }

  // We need at least m elements to form a subsequence of size m
  if (n < m) {
    return 0; // Or throw an error based on problem constraints
  }

  // Initialize suffix arrays
  // suffixMax[i] = maximum value from index i to end
  // suffixMin[i] = minimum value from index i to end
  const suffixMax = new Array(n);
  const suffixMin = new Array(n);

  // Fill suffix arrays from right to left
  suffixMax[n - 1] = nums[n - 1];
  suffixMin[n - 1] = nums[n - 1];

  for (let i = n - 2; i >= 0; i--) {
    suffixMax[i] = Math.max(nums[i], suffixMax[i + 1]);
    suffixMin[i] = Math.min(nums[i], suffixMin[i + 1]);
  }

  let maxProduct = -Infinity;

  // Try each possible starting index
  // The last possible starting index is n - m
  // because we need at least m-1 elements after it
  for (let i = 0; i <= n - m; i++) {
    // The earliest possible ending index is i + m - 1
    const endIndex = i + m - 1;

    // Calculate both possible products
    // We need to check both max and min because of negative numbers
    const productWithMax = nums[i] * suffixMax[endIndex];
    const productWithMin = nums[i] * suffixMin[endIndex];

    // Take the maximum of these two possibilities
    const currentMax = Math.max(productWithMax, productWithMin);

    // Update overall maximum
    maxProduct = Math.max(maxProduct, currentMax);
  }

  return maxProduct;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maxProduct(int[] nums, int m) {
        /**
         * Returns the maximum product of first and last elements of any subsequence of size m.
         *
         * @param nums Array of integers
         * @param m Size of subsequence
         * @return Maximum possible product
         */
        int n = nums.length;

        // If m is 1, the subsequence has only one element, so first = last
        // The product would be nums[i] * nums[i] for some i
        // We need to return the maximum square
        if (m == 1) {
            int maxSquare = Integer.MIN_VALUE;
            for (int num : nums) {
                maxSquare = Math.max(maxSquare, num * num);
            }
            return maxSquare;
        }

        // We need at least m elements to form a subsequence of size m
        if (n < m) {
            return 0;  // Or throw an exception based on problem constraints
        }

        // Initialize suffix arrays
        // suffixMax[i] = maximum value from index i to end
        // suffixMin[i] = minimum value from index i to end
        int[] suffixMax = new int[n];
        int[] suffixMin = new int[n];

        // Fill suffix arrays from right to left
        suffixMax[n - 1] = nums[n - 1];
        suffixMin[n - 1] = nums[n - 1];

        for (int i = n - 2; i >= 0; i--) {
            suffixMax[i] = Math.max(nums[i], suffixMax[i + 1]);
            suffixMin[i] = Math.min(nums[i], suffixMin[i + 1]);
        }

        int maxProduct = Integer.MIN_VALUE;

        // Try each possible starting index
        // The last possible starting index is n - m
        // because we need at least m-1 elements after it
        for (int i = 0; i <= n - m; i++) {
            // The earliest possible ending index is i + m - 1
            int endIndex = i + m - 1;

            // Calculate both possible products
            // We need to check both max and min because of negative numbers
            int productWithMax = nums[i] * suffixMax[endIndex];
            int productWithMin = nums[i] * suffixMin[endIndex];

            // Take the maximum of these two possibilities
            int currentMax = Math.max(productWithMax, productWithMin);

            // Update overall maximum
            maxProduct = Math.max(maxProduct, currentMax);
        }

        return maxProduct;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass from right to left to compute suffix maximums and minimums: O(n)
- We make another pass from left to right to try each starting index: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store two suffix arrays of size n: suffix_max and suffix_min
- Total additional space: O(2n) = O(n)

We could optimize space to O(1) by not storing the entire suffix arrays and instead computing values on the fly, but this would require a more complex implementation and the O(n) space is usually acceptable.

## Common Mistakes

1. **Forgetting to handle negative numbers**: Many candidates only track the maximum suffix value, but when the starting element is negative, multiplying by the minimum (most negative) value can give a larger positive product. Always consider both max and min.

2. **Incorrect index bounds**: The loop for starting indices should go from `0` to `n - m` (inclusive), not `n - 1`. If you go to `n - 1`, you might try to form subsequences that don't have enough elements. For example, with `n = 5` and `m = 3`, the last valid starting index is 2 (indices 2, 3, 4 form a subsequence of size 3).

3. **Not handling m = 1 as a special case**: When `m = 1`, the subsequence has only one element, so the first and last elements are the same. The product is `nums[i] * nums[i]`, so we need to return the maximum square. If you use the general algorithm with `m = 1`, you'd look for an ending index at `i + 0 = i`, which works, but it's clearer to handle this edge case separately.

4. **Confusing subsequences with subarrays**: Remember that subsequences don't need to be contiguous. You can skip elements between the first and last elements. This is why we only need to ensure there are at least `m-2` elements available between them, not exactly `m-2` elements.

## When You'll See This Pattern

This problem uses the **suffix/prefix array** pattern combined with **two-value tracking** (both max and min). You'll see similar patterns in:

1. **Maximum Product Subarray (LeetCode 152)**: This problem also requires tracking both maximum and minimum products because multiplying by a negative number can flip the sign. The insight about tracking both extremes is the same.

2. **Best Time to Buy and Sell Stock (LeetCode 121)**: While simpler, it uses a similar suffix maximum concept. You track the maximum price in the future for each day to compute the maximum profit.

3. **Trapping Rain Water (LeetCode 42)**: Uses both prefix and suffix maximums to determine how much water can be trapped at each position.

4. **Maximum Difference Between Increasing Elements (LeetCode 2016)**: Requires finding the maximum `nums[j] - nums[i]` with `j > i`, which can be solved with suffix maximums.

## Key Takeaways

1. **When dealing with products and negative numbers, always track both maximum and minimum values**. A negative times a negative gives a positive, which could be the maximum product.

2. **Suffix/prefix arrays are powerful tools for problems where you need to know something about the remaining part of the array**. Precomputing these arrays turns O(n) queries into O(1) lookups.

3. **For subsequence problems, focus on the constraints between the chosen elements**. Here, the key constraint was that for a starting index `i`, the ending index must be at least `i + m - 1` to have enough elements for a subsequence of size `m`.

[Practice this problem on CodeJeet](/problem/maximum-product-of-first-and-last-elements-of-a-subsequence)
