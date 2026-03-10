---
title: "How to Solve Maximum Product of Three Elements After One Replacement — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Product of Three Elements After One Replacement. Medium difficulty, 47.1% acceptance rate. Topics: Array, Math, Greedy, Sorting."
date: "2029-04-18"
category: "dsa-patterns"
tags:
  ["maximum-product-of-three-elements-after-one-replacement", "array", "math", "greedy", "medium"]
---

# How to Solve Maximum Product of Three Elements After One Replacement

This problem asks us to find the maximum possible product of any three distinct elements after we're allowed to replace exactly one element with any value in the range [-10⁵, 10⁵]. The challenge lies in strategically choosing which element to replace and what value to replace it with to maximize the three-element product. Unlike the simpler "Maximum Product of Three Numbers" problem, here we have the flexibility to change one element, which opens up interesting optimization possibilities.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 4, 5]`

**Step 1: Understand the replacement power**
We can replace any one element with any value between -10⁵ and 10⁵. This means we can effectively "create" a very large positive number (10⁵) or a very large negative number (-10⁵) if it helps our product.

**Step 2: Consider the original maximum product**
Without replacement, the maximum product would be `3 × 4 × 5 = 60` (the three largest numbers).

**Step 3: Think about replacement strategies**

1. **Replace the smallest element with 10⁵**: Replace `1` with `10⁵`, then product = `10⁵ × 4 × 5 = 2,000,000`
2. **Replace a middle element with 10⁵**: Replace `2` with `10⁵`, then product = `10⁵ × 4 × 5 = 2,000,000`
3. **Replace the largest element with 10⁵**: Replace `5` with `10⁵`, then product = `10⁵ × 3 × 4 = 1,200,000`

**Step 4: Consider negative numbers**
Now let's try `nums = [-5, -4, 1, 2, 3]`

Without replacement: max product = `(-5) × (-4) × 3 = 60`

With replacement strategies:

1. Replace `1` with `10⁵`: `10⁵ × (-5) × (-4) = 2,000,000`
2. Replace `2` with `10⁵`: `10⁵ × (-5) × (-4) = 2,000,000`
3. Replace `3` with `10⁵`: `10⁵ × (-5) × (-4) = 2,000,000`

The key insight: When we have negative numbers, their product can be positive (if we have an even number of negatives), so we need to consider combinations involving negative numbers too.

## Brute Force Approach

A naive approach would be:

1. For each element in the array
2. Replace it with every possible value from -10⁵ to 10⁵
3. For each replacement, calculate all possible 3-element products
4. Track the maximum product found

This approach has several problems:

- The value range is huge: 200,001 possible values to try for each element
- For each replacement, we need to check all combinations of 3 elements: O(n³)
- Total complexity: O(n × 200,001 × n³) = O(n⁴ × 200,001), which is completely infeasible

Even a slightly better brute force would try replacing each element with either the maximum possible value (10⁵) or minimum possible value (-10⁵), then check all 3-element combinations. This would be O(n⁴), still too slow for typical constraints (n up to 10⁵).

## Optimized Approach

The key insight is that we don't need to actually try every possible replacement value. Since we can choose any value in [-10⁵, 10⁵], we can always choose the extreme values that maximize our product. Specifically:

1. **To maximize a product**, we want the largest possible numbers
2. **After replacement**, we can effectively "add" either 10⁵ or -10⁵ to our set of available numbers
3. **The optimal strategy** is to replace some element with either 10⁵ or -10⁵, whichever gives a better product

But which element should we replace? Let's think systematically:

**Case 1: Replace with 10⁵ (maximum positive value)**

- We're adding a very large positive number to our array
- To maximize product with this new number, we want to pair it with the two largest other numbers
- So candidate product = 10⁵ × (largest number) × (second largest number)

**Case 2: Replace with -10⁵ (minimum negative value)**

- We're adding a very large negative number (very small in value)
- A product with two negatives becomes positive: (-10⁵) × (most negative) × (second most negative)
- So candidate product = (-10⁵) × (smallest number) × (second smallest number)

**Case 3: What if we don't use the replaced element at all?**

- Then we're just finding the maximum product of three original elements
- This is the classic "Maximum Product of Three Numbers" problem

So we need to consider all three cases and take the maximum:

1. Original maximum product of three numbers
2. Product with 10⁵ and the two largest other numbers
3. Product with -10⁵ and the two smallest other numbers

Wait, there's a subtlety: When we use the replaced element, we need to make sure we're not using the same element twice. If we replace the largest element with 10⁵, then use 10⁵ and the largest element, we'd be using the same element twice. So we need to be careful about which elements we choose.

The complete algorithm:

1. Sort the array
2. Find the three largest numbers (for original max product)
3. Find the two largest numbers (for case with 10⁵)
4. Find the two smallest numbers (for case with -10⁵)
5. Consider all valid combinations and take the maximum

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) if we sort in-place, O(n) if we use sorted()
def maximumProductAfterReplacement(nums):
    """
    Calculate the maximum product of three distinct elements after replacing
    exactly one element with any value in [-10^5, 10^5].

    Args:
        nums: List of integers

    Returns:
        Maximum possible product after one replacement
    """
    n = len(nums)

    # Edge case: if array has less than 3 elements, we can't form a product
    if n < 3:
        return 0

    # Sort the array to easily find smallest and largest elements
    nums.sort()

    # Case 1: Maximum product without using the replaced element
    # This is simply the product of the three largest numbers
    original_max = nums[n-1] * nums[n-2] * nums[n-3]

    # Case 2: Replace an element with MAX_VALUE (10^5) and use it in the product
    # We want to pair MAX_VALUE with the two largest other numbers
    # But we need to be careful: if the largest element is the one we replace,
    # we should use the next two largest
    MAX_VAL = 10**5

    # Option A: Replace a non-largest element with MAX_VALUE
    # Then product = MAX_VALUE * largest * second_largest
    product_with_max = MAX_VAL * nums[n-1] * nums[n-2]

    # Option B: Replace the largest element with MAX_VALUE
    # Then product = MAX_VALUE * second_largest * third_largest
    product_with_max_replace_largest = MAX_VAL * nums[n-2] * nums[n-3]

    # Take the better of the two options for MAX_VALUE replacement
    best_with_max = max(product_with_max, product_with_max_replace_largest)

    # Case 3: Replace an element with MIN_VALUE (-10^5) and use it in the product
    # Negative times negative gives positive, so we want two most negative numbers
    MIN_VAL = -10**5

    # Option A: Replace a non-smallest element with MIN_VALUE
    # Then product = MIN_VALUE * smallest * second_smallest
    # Since MIN_VALUE is negative and smallest numbers are negative,
    # product = negative * negative * negative = negative (bad!)
    # Wait, we need to think carefully here...

    # Actually, MIN_VALUE is very negative (-10^5). If we multiply it with
    # two negative numbers, we get: negative * negative * negative = negative
    # But if we multiply it with one negative and one positive, we get positive!
    # So we need to consider different combinations...

    # Let's think systematically about MIN_VALUE replacement:
    # MIN_VALUE is negative. To get a positive product, we need an even number
    # of negatives in our triple. So we have two cases:

    # 1. Use MIN_VALUE with two other negatives: product is negative (bad)
    # 2. Use MIN_VALUE with one negative and one positive: product is positive

    # For the second case, we want the most negative (smallest) and the most positive (largest)
    # So: MIN_VALUE * smallest * largest

    # But wait, if smallest is the element we replace with MIN_VALUE,
    # then we should use the next smallest

    # Option A: Replace a non-extreme element with MIN_VALUE
    # Then product = MIN_VALUE * smallest * largest
    product_with_min = MIN_VAL * nums[0] * nums[n-1]

    # Option B: Replace the smallest element with MIN_VALUE
    # Then product = MIN_VALUE * second_smallest * largest
    product_with_min_replace_smallest = MIN_VAL * nums[1] * nums[n-1]

    # Option C: Replace the largest element with MIN_VALUE
    # Then product = MIN_VALUE * smallest * second_largest
    product_with_min_replace_largest = MIN_VAL * nums[0] * nums[n-2]

    # Take the best of all MIN_VALUE options
    best_with_min = max(product_with_min, product_with_min_replace_smallest,
                       product_with_min_replace_largest)

    # The answer is the maximum of all cases
    return max(original_max, best_with_max, best_with_min)
```

```javascript
// Time: O(n log n) | Space: O(1) if we sort in-place, O(n) for the sorted array
function maximumProductAfterReplacement(nums) {
  /**
   * Calculate the maximum product of three distinct elements after replacing
   * exactly one element with any value in [-10^5, 10^5].
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Maximum possible product after one replacement
   */
  const n = nums.length;

  // Edge case: if array has less than 3 elements, we can't form a product
  if (n < 3) {
    return 0;
  }

  // Sort the array to easily find smallest and largest elements
  // We need to create a copy to avoid modifying the original array
  const sorted = [...nums].sort((a, b) => a - b);

  // Case 1: Maximum product without using the replaced element
  // This is simply the product of the three largest numbers
  const originalMax = sorted[n - 1] * sorted[n - 2] * sorted[n - 3];

  // Case 2: Replace an element with MAX_VALUE (10^5) and use it in the product
  const MAX_VAL = 100000;

  // Option A: Replace a non-largest element with MAX_VALUE
  const productWithMax = MAX_VAL * sorted[n - 1] * sorted[n - 2];

  // Option B: Replace the largest element with MAX_VALUE
  const productWithMaxReplaceLargest = MAX_VAL * sorted[n - 2] * sorted[n - 3];

  // Take the better of the two options for MAX_VALUE replacement
  const bestWithMax = Math.max(productWithMax, productWithMaxReplaceLargest);

  // Case 3: Replace an element with MIN_VALUE (-10^5) and use it in the product
  const MIN_VAL = -100000;

  // Option A: Replace a non-extreme element with MIN_VALUE
  const productWithMin = MIN_VAL * sorted[0] * sorted[n - 1];

  // Option B: Replace the smallest element with MIN_VALUE
  const productWithMinReplaceSmallest = MIN_VAL * sorted[1] * sorted[n - 1];

  // Option C: Replace the largest element with MIN_VALUE
  const productWithMinReplaceLargest = MIN_VAL * sorted[0] * sorted[n - 2];

  // Take the best of all MIN_VALUE options
  const bestWithMin = Math.max(
    productWithMin,
    productWithMinReplaceSmallest,
    productWithMinReplaceLargest
  );

  // The answer is the maximum of all cases
  return Math.max(originalMax, bestWithMax, bestWithMin);
}
```

```java
// Time: O(n log n) | Space: O(1) if we sort in-place, O(n) for the sorted array
import java.util.Arrays;

public class Solution {
    public int maximumProductAfterReplacement(int[] nums) {
        /**
         * Calculate the maximum product of three distinct elements after replacing
         * exactly one element with any value in [-10^5, 10^5].
         *
         * @param nums Array of integers
         * @return Maximum possible product after one replacement
         */
        int n = nums.length;

        // Edge case: if array has less than 3 elements, we can't form a product
        if (n < 3) {
            return 0;
        }

        // Sort the array to easily find smallest and largest elements
        // We need to create a copy to avoid modifying the original array
        int[] sorted = nums.clone();
        Arrays.sort(sorted);

        // Case 1: Maximum product without using the replaced element
        // This is simply the product of the three largest numbers
        int originalMax = sorted[n-1] * sorted[n-2] * sorted[n-3];

        // Case 2: Replace an element with MAX_VALUE (10^5) and use it in the product
        final int MAX_VAL = 100000;

        // Option A: Replace a non-largest element with MAX_VALUE
        int productWithMax = MAX_VAL * sorted[n-1] * sorted[n-2];

        // Option B: Replace the largest element with MAX_VALUE
        int productWithMaxReplaceLargest = MAX_VAL * sorted[n-2] * sorted[n-3];

        // Take the better of the two options for MAX_VALUE replacement
        int bestWithMax = Math.max(productWithMax, productWithMaxReplaceLargest);

        // Case 3: Replace an element with MIN_VALUE (-10^5) and use it in the product
        final int MIN_VAL = -100000;

        // Option A: Replace a non-extreme element with MIN_VALUE
        int productWithMin = MIN_VAL * sorted[0] * sorted[n-1];

        // Option B: Replace the smallest element with MIN_VALUE
        int productWithMinReplaceSmallest = MIN_VAL * sorted[1] * sorted[n-1];

        // Option C: Replace the largest element with MIN_VALUE
        int productWithMinReplaceLargest = MIN_VAL * sorted[0] * sorted[n-2];

        // Take the best of all MIN_VALUE options
        int bestWithMin = Math.max(productWithMin,
                                  Math.max(productWithMinReplaceSmallest,
                                          productWithMinReplaceLargest));

        // The answer is the maximum of all cases
        return Math.max(originalMax, Math.max(bestWithMax, bestWithMin));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- All subsequent operations (finding max/min elements, calculating products) take O(1) time
- The sorting step dominates the time complexity

**Space Complexity: O(n) or O(1)**

- If we sort in-place: O(1) additional space (but modifies input)
- If we create a sorted copy: O(n) additional space (preserves input)
- The space for a few integer variables is O(1)

## Common Mistakes

1. **Forgetting that the replaced element might not be used in the final product**
   Some candidates only consider cases where the replaced element is part of the triple, forgetting that sometimes the best product comes from three original elements.

2. **Incorrect handling of negative numbers with MIN_VALUE**
   The trickiest part is understanding that MIN_VALUE (-10⁵) is negative, so to get a positive product we need an even number of negatives in our triple. Many candidates mistakenly think MIN_VALUE × two smallest (negative) numbers gives a positive product, but it actually gives negative × negative × negative = negative.

3. **Double-counting elements**
   When replacing the largest element with MAX_VALUE, you can't use both MAX_VALUE and the original largest element in the same product. You need to use the next largest elements instead.

4. **Not considering all replacement options for MIN_VALUE**
   There are three reasonable options when replacing with MIN_VALUE: replacing a middle element, replacing the smallest, or replacing the largest. Each gives a different product that needs to be considered.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Extreme value selection** (like "Maximum Product of Three Numbers"): The solution involves selecting extreme values (largest, smallest) from a sorted array to form optimal combinations.

2. **Greedy optimization with constraints** (like "Maximum Product Subarray"): We're trying to maximize a product under specific constraints, which often involves considering edge cases with negative numbers.

3. **Problem transformation** (like "Best Time to Buy and Sell Stock"): The insight that we only need to consider replacing with extreme values (10⁵ or -10⁵) transforms the problem from searching a huge space to comparing a few cases.

Related problems that use similar patterns:

- **Maximum Product of Three Numbers** (Easy): The simpler version without replacement
- **Maximum Product Subarray** (Medium): Also deals with maximizing products and handling negatives
- **Maximum Sum Circular Subarray** (Medium): Another problem where considering extreme cases is key

## Key Takeaways

1. **When you can choose any value from a range, consider only the extremes**: If you can replace an element with any value in [a, b], the optimal replacement will almost always be either a or b (the extremes).

2. **With products, carefully track the sign of numbers**: The product of an odd number of negatives is negative, while the product of an even number of negatives is positive. This is crucial when negative numbers are involved.

3. **Sorting often simplifies extreme value selection**: While we could find the largest/smallest elements in O(n) without sorting, sorting makes the logic clearer and less error-prone for handling the "next largest/smallest" elements when we replace an extreme value.

Related problems: [Maximum Product of Three Numbers](/problem/maximum-product-of-three-numbers)
