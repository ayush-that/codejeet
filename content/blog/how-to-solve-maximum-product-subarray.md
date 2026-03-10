---
title: "How to Solve Maximum Product Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Product Subarray. Medium difficulty, 36.0% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-06-01"
category: "dsa-patterns"
tags: ["maximum-product-subarray", "array", "dynamic-programming", "medium"]
---

# How to Solve Maximum Product Subarray

Finding the maximum product subarray looks deceptively similar to the classic maximum sum subarray problem, but there's a crucial twist: negative numbers. With sums, a negative number always reduces the total, so you can simply reset when the running sum goes negative. With products, two negatives multiply to a positive, so a negative number can actually become beneficial later if another negative appears. This makes the problem significantly more interesting and requires tracking both maximum and minimum products simultaneously.

## Visual Walkthrough

Let's trace through the array `[2, 3, -2, 4]` to understand the challenge:

**Step 1:** Start with `2`. Our current max and min are both `2`. Global max = `2`.

**Step 2:** Process `3`. We have three candidates for the new max:

- `3` (start fresh)
- `2 × 3 = 6` (extend previous max)
- `2 × 3 = 6` (extend previous min)

Max becomes `6`, min becomes `3` (since `3` is smaller than `6`). Global max updates to `6`.

**Step 3:** Process `-2`. This is where it gets interesting:

- `-2` (start fresh)
- `6 × -2 = -12` (extend previous max)
- `3 × -2 = -6` (extend previous min)

Wait, `-6` is actually larger than `-12`! So our new max is `-2`, and our new min is `-12`. Global max stays `6`.

**Step 4:** Process `4`:

- `4` (start fresh)
- `-2 × 4 = -8` (extend previous max)
- `-12 × 4 = -48` (extend previous min)

Max becomes `4`, min becomes `-48`. Global max remains `6`.

The maximum product subarray is `[2, 3]` with product `6`.

Now let's see why tracking only the maximum isn't enough. Consider `[-2, 3, -4]`:

- After `-2`: max = `-2`, min = `-2`
- After `3`: max = `3`, min = `-6` (from `-2 × 3`)
- After `-4`: max = `24` (from `-6 × -4`!), min = `-12` (from `3 × -4`)

If we only tracked the maximum, we'd miss that `-6` could become `24` when multiplied by `-4`.

## Brute Force Approach

The brute force solution checks every possible subarray and computes its product:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def maxProductBrute(nums):
    if not nums:
        return 0

    max_product = float('-inf')

    # Try every starting index
    for i in range(len(nums)):
        # Try every ending index
        for j in range(i, len(nums)):
            # Compute product of nums[i..j]
            product = 1
            for k in range(i, j + 1):
                product *= nums[k]

            # Update max if needed
            if product > max_product:
                max_product = product

    return max_product
```

```javascript
// Time: O(n³) | Space: O(1)
function maxProductBrute(nums) {
  if (nums.length === 0) return 0;

  let maxProduct = -Infinity;

  // Try every starting index
  for (let i = 0; i < nums.length; i++) {
    // Try every ending index
    for (let j = i; j < nums.length; j++) {
      // Compute product of nums[i..j]
      let product = 1;
      for (let k = i; k <= j; k++) {
        product *= nums[k];
      }

      // Update max if needed
      if (product > maxProduct) {
        maxProduct = product;
      }
    }
  }

  return maxProduct;
}
```

```java
// Time: O(n³) | Space: O(1)
public int maxProductBrute(int[] nums) {
    if (nums.length == 0) return 0;

    int maxProduct = Integer.MIN_VALUE;

    // Try every starting index
    for (int i = 0; i < nums.length; i++) {
        // Try every ending index
        for (int j = i; j < nums.length; j++) {
            // Compute product of nums[i..j]
            int product = 1;
            for (int k = i; k <= j; k++) {
                product *= nums[k];
            }

            // Update max if needed
            if (product > maxProduct) {
                maxProduct = product;
            }
        }
    }

    return maxProduct;
}
```

</div>

**Why it's insufficient:** This runs in O(n³) time. For an array of length 1000, that's about 1 billion operations - far too slow. Even if we optimize to O(n²) by reusing products (multiplying by the next element instead of recomputing from scratch), it's still O(n²), which is borderline for n=10⁵.

## Optimized Approach

The key insight is **dynamic programming with state tracking**. Unlike maximum sum where we only need to track one value (the current maximum sum), for maximum product we need to track two values at each position:

1. **max_ending_here**: Maximum product subarray ending at current position
2. **min_ending_here**: Minimum product subarray ending at current position

Why track the minimum? Because the smallest (most negative) product can become the largest if multiplied by another negative number.

At each step, when we process `nums[i]`, we have three choices:

1. Start a new subarray at `i` (value = `nums[i]`)
2. Extend the previous maximum product subarray: `max_ending_here × nums[i]`
3. Extend the previous minimum product subarray: `min_ending_here × nums[i]`

The new maximum is the maximum of these three, and the new minimum is the minimum of these three.

We also maintain a global maximum that gets updated at each step.

## Optimal Solution

Here's the optimal O(n) time, O(1) space solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxProduct(nums):
    if not nums:
        return 0

    # Initialize with first element
    max_so_far = nums[0]  # Global maximum
    max_ending_here = nums[0]  # Maximum product ending at current position
    min_ending_here = nums[0]  # Minimum product ending at current position

    # Process remaining elements
    for i in range(1, len(nums)):
        current = nums[i]

        # We need to calculate new max and min using the OLD values
        # before updating them, so we store them temporarily
        temp_max = max_ending_here
        temp_min = min_ending_here

        # Three candidates for new max: current number alone,
        # current × previous max, or current × previous min
        max_ending_here = max(current,
                              temp_max * current,
                              temp_min * current)

        # Three candidates for new min (tracking minimum is crucial
        # because a very negative number can become positive with another negative)
        min_ending_here = min(current,
                              temp_max * current,
                              temp_min * current)

        # Update global maximum
        max_so_far = max(max_so_far, max_ending_here)

    return max_so_far
```

```javascript
// Time: O(n) | Space: O(1)
function maxProduct(nums) {
  if (nums.length === 0) return 0;

  // Initialize with first element
  let maxSoFar = nums[0]; // Global maximum
  let maxEndingHere = nums[0]; // Maximum product ending at current position
  let minEndingHere = nums[0]; // Minimum product ending at current position

  // Process remaining elements
  for (let i = 1; i < nums.length; i++) {
    const current = nums[i];

    // Store old values before updating (important!)
    const tempMax = maxEndingHere;
    const tempMin = minEndingHere;

    // Three candidates for new max: current number alone,
    // current × previous max, or current × previous min
    maxEndingHere = Math.max(current, tempMax * current, tempMin * current);

    // Three candidates for new min
    minEndingHere = Math.min(current, tempMax * current, tempMin * current);

    // Update global maximum
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxProduct(int[] nums) {
    if (nums.length == 0) return 0;

    // Initialize with first element
    int maxSoFar = nums[0];      // Global maximum
    int maxEndingHere = nums[0]; // Maximum product ending at current position
    int minEndingHere = nums[0]; // Minimum product ending at current position

    // Process remaining elements
    for (int i = 1; i < nums.length; i++) {
        int current = nums[i];

        // Store old values before updating (crucial!)
        int tempMax = maxEndingHere;
        int tempMin = minEndingHere;

        // Three candidates for new max: current number alone,
        // current × previous max, or current × previous min
        maxEndingHere = Math.max(current,
                                 Math.max(tempMax * current,
                                         tempMin * current));

        // Three candidates for new min
        minEndingHere = Math.min(current,
                                 Math.min(tempMax * current,
                                         tempMin * current));

        // Update global maximum
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }

    return maxSoFar;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** - We make a single pass through the array, performing constant work at each element (just a few multiplications and comparisons).

**Space Complexity: O(1)** - We only use a few variables regardless of input size. The temporary variables don't scale with `n`.

## Common Mistakes

1. **Only tracking the maximum**: This is the most common mistake. Candidates try to adapt the Kadane's algorithm from maximum subarray sum, resetting to the current element when the product becomes negative. But with products, a negative value isn't necessarily bad - it could become positive with another negative.

2. **Forgetting to store old values before updating**: If you update `max_ending_here` first, then use the new (incorrect) value to calculate `min_ending_here`, you'll get wrong results. Always store the old values in temporary variables.

3. **Not considering all three candidates**: Some candidates forget that starting a new subarray at the current position (`nums[i]` alone) is always an option. This is important when both previous max and min multiplied by current give worse results.

4. **Edge case: array with single negative number**: For input `[-5]`, the answer should be `-5`, not `0`. Make sure your initialization handles this correctly by starting with `nums[0]` rather than `0` or `1`.

## When You'll See This Pattern

This "track both max and min" pattern appears in several dynamic programming problems where the next state depends on potentially flipping the sign or magnitude:

1. **Maximum Sum Circular Subarray (LeetCode 918)**: Similar to maximum subarray but the array is circular. You need to track both maximum and minimum sums because the maximum might wrap around.

2. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)**: You track multiple states (hold, sold, rest) to make optimal decisions.

3. **House Robber series (LeetCode 198, 213)**: You track whether you robbed the previous house or not to make optimal decisions about the current house.

The core idea is: when the next step can dramatically change the "direction" or sign of your accumulated value (like negative numbers flipping products), you often need to track multiple states.

## Key Takeaways

1. **Products behave differently than sums with negative numbers**: Two negatives make a positive, so you can't just reset when you encounter a negative value. Always ask yourself: "Could this negative become beneficial later?"

2. **When one state isn't enough, track multiple states**: If the optimal solution at position `i` depends on more than just the best value up to `i-1`, consider tracking additional information (like both maximum and minimum).

3. **The "Kadane's algorithm for products" pattern**: For maximum product subarray, maintain `max_ending_here` and `min_ending_here` at each step, and update both using the three candidates: current element alone, current × previous max, and current × previous min.

Related problems: [Maximum Subarray](/problem/maximum-subarray), [House Robber](/problem/house-robber), [Product of Array Except Self](/problem/product-of-array-except-self)
