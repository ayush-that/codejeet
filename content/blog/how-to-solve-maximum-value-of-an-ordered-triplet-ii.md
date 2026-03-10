---
title: "How to Solve Maximum Value of an Ordered Triplet II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Value of an Ordered Triplet II. Medium difficulty, 56.4% acceptance rate. Topics: Array."
date: "2026-07-31"
category: "dsa-patterns"
tags: ["maximum-value-of-an-ordered-triplet-ii", "array", "medium"]
---

# How to Solve Maximum Value of an Ordered Triplet II

We need to find the maximum value of `(nums[i] - nums[j]) * nums[k]` where `i < j < k`. If all such triplets yield negative values, we return 0. The challenge is that we can't brute force all O(n³) triplets—we need an O(n) solution that cleverly tracks information as we scan the array.

What makes this problem interesting is that it looks like we need to consider three positions simultaneously, but we can break it down by fixing the middle element `j` and tracking the best possible `i` before it and the best possible `k` after it.

## Visual Walkthrough

Let's trace through `nums = [12, 6, 1, 2, 7]`:

We want to maximize `(nums[i] - nums[j]) * nums[k]`. For a fixed `j`, we need:

- The **maximum** `nums[i]` where `i < j` (to maximize the difference `nums[i] - nums[j]`)
- The **maximum** `nums[k]` where `k > j` (to multiply by the largest possible value)

Let's compute step by step:

**Step 1: Precompute maxLeft for each position**

- `maxLeft[0]`: No elements before index 0, so we can't use it as `j`
- `maxLeft[1]`: Max before index 1 = max(12) = 12
- `maxLeft[2]`: Max before index 2 = max(12, 6) = 12
- `maxLeft[3]`: Max before index 3 = max(12, 6, 1) = 12
- `maxLeft[4]`: Max before index 4 = max(12, 6, 1, 2) = 12

**Step 2: Precompute maxRight for each position**

- `maxRight[4]`: No elements after index 4, so we can't use it as `j`
- `maxRight[3]`: Max after index 3 = max(7) = 7
- `maxRight[2]`: Max after index 2 = max(2, 7) = 7
- `maxRight[1]`: Max after index 1 = max(1, 2, 7) = 7
- `maxRight[0]`: Max after index 0 = max(6, 1, 2, 7) = 7

**Step 3: Try each possible `j` from 1 to n-2**

- `j = 1`: `(maxLeft[1] - nums[1]) * maxRight[1] = (12 - 6) * 7 = 6 * 7 = 42`
- `j = 2`: `(12 - 1) * 7 = 11 * 7 = 77`
- `j = 3`: `(12 - 2) * 7 = 10 * 7 = 70`
- `j = 4`: Can't use as `j` because we need `k > j`

Maximum value is **77** at `j = 2` with `i = 0` (value 12) and `k = 4` (value 7).

## Brute Force Approach

The brute force solution checks all possible triplets `(i, j, k)` with `i < j < k`:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def maximumTripletValue(nums):
    n = len(nums)
    max_val = 0

    # Check all possible triplets
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                value = (nums[i] - nums[j]) * nums[k]
                max_val = max(max_val, value)

    return max_val
```

```javascript
// Time: O(n³) | Space: O(1)
function maximumTripletValue(nums) {
  const n = nums.length;
  let maxVal = 0;

  // Check all possible triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const value = (nums[i] - nums[j]) * nums[k];
        maxVal = Math.max(maxVal, value);
      }
    }
  }

  return maxVal;
}
```

```java
// Time: O(n³) | Space: O(1)
public long maximumTripletValue(int[] nums) {
    int n = nums.length;
    long maxVal = 0;

    // Check all possible triplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                long value = (long)(nums[i] - nums[j]) * nums[k];
                maxVal = Math.max(maxVal, value);
            }
        }
    }

    return maxVal;
}
```

</div>

**Why this fails:** With constraints up to 10⁵ elements, O(n³) is impossibly slow (10¹⁵ operations). We need at least O(n²), and ideally O(n).

## Optimized Approach

The key insight is that for a fixed middle index `j`, the optimal triplet uses:

1. The **maximum** value to the left of `j` (for `i`)
2. The **maximum** value to the right of `j` (for `k`)

Why? Let's break down the expression `(nums[i] - nums[j]) * nums[k]`:

- For fixed `j` and `k`, we want to maximize `nums[i]` (since `nums[j]` is fixed)
- For fixed `j` and `i`, we want to maximize `nums[k]` (since `(nums[i] - nums[j])` is fixed)
- Therefore, for fixed `j`, we want the maximum `nums[i]` to the left AND the maximum `nums[k]` to the right

This reduces the problem to:

1. Precompute `maxLeft[j]` = maximum value in `nums[0..j-1]` for each `j`
2. Precompute `maxRight[j]` = maximum value in `nums[j+1..n-1]` for each `j`
3. For each valid `j` (from 1 to n-2), compute `(maxLeft[j] - nums[j]) * maxRight[j]`
4. Track the maximum of these values

We can compute `maxLeft` in one forward pass and `maxRight` in one backward pass, then check all `j` in O(n) total time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumTripletValue(nums):
    n = len(nums)
    if n < 3:
        return 0  # Not enough elements for a triplet

    # Step 1: Precompute maxLeft for each position
    # maxLeft[j] = maximum value in nums[0..j-1]
    maxLeft = [0] * n
    currentMax = nums[0]
    for j in range(1, n):
        maxLeft[j] = currentMax
        currentMax = max(currentMax, nums[j])

    # Step 2: Precompute maxRight for each position
    # maxRight[j] = maximum value in nums[j+1..n-1]
    maxRight = [0] * n
    currentMax = nums[n-1]
    for j in range(n-2, -1, -1):
        maxRight[j] = currentMax
        currentMax = max(currentMax, nums[j])

    # Step 3: Try each possible middle index j
    maxVal = 0
    for j in range(1, n-1):  # j must have at least one element on each side
        value = (maxLeft[j] - nums[j]) * maxRight[j]
        maxVal = max(maxVal, value)

    return maxVal if maxVal > 0 else 0
```

```javascript
// Time: O(n) | Space: O(n)
function maximumTripletValue(nums) {
  const n = nums.length;
  if (n < 3) return 0; // Not enough elements for a triplet

  // Step 1: Precompute maxLeft for each position
  // maxLeft[j] = maximum value in nums[0..j-1]
  const maxLeft = new Array(n).fill(0);
  let currentMax = nums[0];
  for (let j = 1; j < n; j++) {
    maxLeft[j] = currentMax;
    currentMax = Math.max(currentMax, nums[j]);
  }

  // Step 2: Precompute maxRight for each position
  // maxRight[j] = maximum value in nums[j+1..n-1]
  const maxRight = new Array(n).fill(0);
  currentMax = nums[n - 1];
  for (let j = n - 2; j >= 0; j--) {
    maxRight[j] = currentMax;
    currentMax = Math.max(currentMax, nums[j]);
  }

  // Step 3: Try each possible middle index j
  let maxVal = 0;
  for (let j = 1; j < n - 1; j++) {
    // j must have at least one element on each side
    const value = (maxLeft[j] - nums[j]) * maxRight[j];
    maxVal = Math.max(maxVal, value);
  }

  return maxVal > 0 ? maxVal : 0;
}
```

```java
// Time: O(n) | Space: O(n)
public long maximumTripletValue(int[] nums) {
    int n = nums.length;
    if (n < 3) return 0;  // Not enough elements for a triplet

    // Step 1: Precompute maxLeft for each position
    // maxLeft[j] = maximum value in nums[0..j-1]
    int[] maxLeft = new int[n];
    int currentMax = nums[0];
    for (int j = 1; j < n; j++) {
        maxLeft[j] = currentMax;
        currentMax = Math.max(currentMax, nums[j]);
    }

    // Step 2: Precompute maxRight for each position
    // maxRight[j] = maximum value in nums[j+1..n-1]
    int[] maxRight = new int[n];
    currentMax = nums[n-1];
    for (int j = n-2; j >= 0; j--) {
        maxRight[j] = currentMax;
        currentMax = Math.max(currentMax, nums[j]);
    }

    // Step 3: Try each possible middle index j
    long maxVal = 0;
    for (int j = 1; j < n-1; j++) {  // j must have at least one element on each side
        long value = (long)(maxLeft[j] - nums[j]) * maxRight[j];
        maxVal = Math.max(maxVal, value);
    }

    return maxVal > 0 ? maxVal : 0;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Computing `maxLeft`: O(n) with one forward pass
- Computing `maxRight`: O(n) with one backward pass
- Checking all `j` values: O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We store two arrays of size n: `maxLeft` and `maxRight`
- Could be optimized to O(1) by computing on the fly, but O(n) is acceptable for clarity

## Common Mistakes

1. **Not handling the "return 0 if all values negative" requirement**: The problem states to return 0 if all triplets yield negative values. Some candidates forget to check `maxVal > 0` at the end.

2. **Integer overflow**: When n ≤ 10⁵ and values ≤ 10⁶, `(nums[i] - nums[j]) * nums[k]` can exceed 32-bit integer range. Always use 64-bit integers (long in Java/C++, long long in C).

3. **Incorrect index ranges**: For `j`, valid range is `[1, n-2]` since we need at least one element on each side. Using `j` from 0 to n-1 will cause index errors when accessing `maxLeft[j]` or `maxRight[j]`.

4. **Confusing the order in maxRight computation**: When computing `maxRight` backwards, remember that `maxRight[j]` should contain the maximum of elements **after** j, not including j itself. The backward pass should update `maxRight[j]` first, then update `currentMax`.

## When You'll See This Pattern

This "fix the middle, track max/min on both sides" pattern appears in many array problems:

1. **Trapping Rain Water (Hard)**: For each bar, the water it can trap is determined by the minimum of the maximum height to its left and right.

2. **Maximum Product Subarray (Medium)**: While not identical, it also involves tracking both maximum and minimum values as you scan.

3. **Sum of Beauty in the Array (Medium)**: Requires checking if an element is greater than all elements to its left and less than all elements to its right.

4. **Best Time to Buy and Sell Stock III (Hard)**: You track the best transaction before and after each day.

The core idea is to break a complex multi-position problem into simpler single-position problems by precomputing information from both directions.

## Key Takeaways

1. **When dealing with triplets or multiple indices, try fixing one position**: Often, fixing the middle element (or another specific position) simplifies the problem by allowing you to precompute optimal choices for the other positions.

2. **Precomputation from both ends is powerful**: Many array problems become tractable by making one forward pass to compute "best so far from left" and one backward pass for "best so far from right."

3. **Watch for integer overflow in multiplication problems**: When values can be up to 10⁶ and you're multiplying them, always use 64-bit integers to avoid overflow.

Related problems: [Trapping Rain Water](/problem/trapping-rain-water), [Sum of Beauty in the Array](/problem/sum-of-beauty-in-the-array), [Minimum Sum of Mountain Triplets II](/problem/minimum-sum-of-mountain-triplets-ii)
