---
title: "How to Solve Minimum Sum of Mountain Triplets I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Sum of Mountain Triplets I. Easy difficulty, 67.2% acceptance rate. Topics: Array."
date: "2028-08-23"
category: "dsa-patterns"
tags: ["minimum-sum-of-mountain-triplets-i", "array", "easy"]
---

# How to Solve Minimum Sum of Mountain Triplets I

This problem asks us to find three indices `(i, j, k)` where `i < j < k`, `nums[i] < nums[j]`, and `nums[k] < nums[j]` — forming a "mountain" shape with `j` as the peak — and return the minimum possible sum `nums[i] + nums[j] + nums[k]`. If no such triplet exists, return `-1`. What makes this interesting is that while it looks like a 3Sum variant, the mountain constraint creates a specific structure we can exploit for optimization.

## Visual Walkthrough

Let's trace through example `nums = [8, 6, 1, 5, 3]`:

We need `i < j < k` with `nums[i] < nums[j]` and `nums[k] < nums[j]`. Visually, `nums[j]` is the peak, with smaller values on both sides.

**Step-by-step thinking:**

- For `j = 0` (value 8): No `i < 0`, so invalid.
- For `j = 1` (value 6): Possible `i = 0` (value 8) but `8 < 6` is false, so no valid `i`.
- For `j = 2` (value 1): Need `nums[i] < 1` for `i < 2`, but smallest before index 2 is 6, so no valid `i`.
- For `j = 3` (value 5):
  - Valid `i` values: `i = 0` (8) → `8 < 5` false, `i = 1` (6) → `6 < 5` false, `i = 2` (1) → `1 < 5` true ✓
  - Valid `k` values: `k = 4` (3) → `3 < 5` true ✓
  - Triplet: `(2, 3, 4)` with values `(1, 5, 3)` → sum = 9
- For `j = 4` (value 3): Need `nums[k] < 3` for `k > 4`, but no indices after 4.

The minimum sum we found is 9. But is there a better one? Let's check systematically: For each possible peak `j`, we want the smallest possible `nums[i]` to the left (with `nums[i] < nums[j]`) and the smallest possible `nums[k]` to the right (with `nums[k] < nums[j]`). Then we minimize `nums[i] + nums[j] + nums[k]` across all valid `j`.

## Brute Force Approach

The straightforward solution checks all possible triplets `(i, j, k)` with `i < j < k`:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def minimumSum(nums):
    n = len(nums)
    min_sum = float('inf')

    # Check all possible triplets
    for i in range(n):
        for j in range(i + 1, n):
            # Only continue if nums[i] < nums[j]
            if nums[i] < nums[j]:
                for k in range(j + 1, n):
                    # Check if nums[k] < nums[j]
                    if nums[k] < nums[j]:
                        current_sum = nums[i] + nums[j] + nums[k]
                        min_sum = min(min_sum, current_sum)

    return -1 if min_sum == float('inf') else min_sum
```

```javascript
// Time: O(n³) | Space: O(1)
function minimumSum(nums) {
  const n = nums.length;
  let minSum = Infinity;

  // Check all possible triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Only continue if nums[i] < nums[j]
      if (nums[i] < nums[j]) {
        for (let k = j + 1; k < n; k++) {
          // Check if nums[k] < nums[j]
          if (nums[k] < nums[j]) {
            const currentSum = nums[i] + nums[j] + nums[k];
            minSum = Math.min(minSum, currentSum);
          }
        }
      }
    }
  }

  return minSum === Infinity ? -1 : minSum;
}
```

```java
// Time: O(n³) | Space: O(1)
public int minimumSum(int[] nums) {
    int n = nums.length;
    int minSum = Integer.MAX_VALUE;

    // Check all possible triplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Only continue if nums[i] < nums[j]
            if (nums[i] < nums[j]) {
                for (int k = j + 1; k < n; k++) {
                    // Check if nums[k] < nums[j]
                    if (nums[k] < nums[j]) {
                        int currentSum = nums[i] + nums[j] + nums[k];
                        minSum = Math.min(minSum, currentSum);
                    }
                }
            }
        }
    }

    return minSum == Integer.MAX_VALUE ? -1 : minSum;
}
```

</div>

**Why this is insufficient:** With `n` up to 100 in constraints, O(n³) means up to 1,000,000 operations, which might pass but is inefficient. More importantly, this approach doesn't scale to larger `n`. We can do better by preprocessing.

## Optimal Solution

The key insight: For each index `j` as the peak, we need:

1. The minimum value to the left of `j` that is `< nums[j]`
2. The minimum value to the right of `j` that is `< nums[j]`

We can precompute these in O(n) time:

- `left_min[j]` = minimum value in `nums[0..j-1]` that is `< nums[j]`
- `right_min[j]` = minimum value in `nums[j+1..n-1]` that is `< nums[j]`

But wait — we need the minimum value that is **less than** `nums[j]`, not just the absolute minimum. A better approach: For each `j`, find the minimum value to its left (any value, not necessarily `< nums[j]`), and separately track whether we have a valid left candidate. Actually, we can compute `left_min[j]` as the minimum value in `nums[0..j-1]` (period), because if this minimum is `< nums[j]`, it's our best left candidate; if not, then no value to the left is `< nums[j]`, so `j` cannot be a peak.

Similarly for the right side: `right_min[j]` = minimum value in `nums[j+1..n-1]`.

Then for each `j`, if `left_min[j] < nums[j]` and `right_min[j] < nums[j]`, we have a valid mountain triplet with sum `left_min[j] + nums[j] + right_min[j]`. We take the minimum such sum.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumSum(nums):
    n = len(nums)
    if n < 3:
        return -1  # Need at least 3 elements for a triplet

    # Step 1: Precompute minimum value to the left of each index
    left_min = [float('inf')] * n
    current_min = float('inf')
    for i in range(1, n):
        current_min = min(current_min, nums[i - 1])
        left_min[i] = current_min

    # Step 2: Precompute minimum value to the right of each index
    right_min = [float('inf')] * n
    current_min = float('inf')
    for i in range(n - 2, -1, -1):
        current_min = min(current_min, nums[i + 1])
        right_min[i] = current_min

    # Step 3: Check each possible peak j
    min_sum = float('inf')
    for j in range(1, n - 1):  # j cannot be first or last index
        if left_min[j] < nums[j] and right_min[j] < nums[j]:
            current_sum = left_min[j] + nums[j] + right_min[j]
            min_sum = min(min_sum, current_sum)

    return -1 if min_sum == float('inf') else min_sum
```

```javascript
// Time: O(n) | Space: O(n)
function minimumSum(nums) {
  const n = nums.length;
  if (n < 3) return -1; // Need at least 3 elements for a triplet

  // Step 1: Precompute minimum value to the left of each index
  const leftMin = new Array(n).fill(Infinity);
  let currentMin = Infinity;
  for (let i = 1; i < n; i++) {
    currentMin = Math.min(currentMin, nums[i - 1]);
    leftMin[i] = currentMin;
  }

  // Step 2: Precompute minimum value to the right of each index
  const rightMin = new Array(n).fill(Infinity);
  currentMin = Infinity;
  for (let i = n - 2; i >= 0; i--) {
    currentMin = Math.min(currentMin, nums[i + 1]);
    rightMin[i] = currentMin;
  }

  // Step 3: Check each possible peak j
  let minSum = Infinity;
  for (let j = 1; j < n - 1; j++) {
    // j cannot be first or last index
    if (leftMin[j] < nums[j] && rightMin[j] < nums[j]) {
      const currentSum = leftMin[j] + nums[j] + rightMin[j];
      minSum = Math.min(minSum, currentSum);
    }
  }

  return minSum === Infinity ? -1 : minSum;
}
```

```java
// Time: O(n) | Space: O(n)
public int minimumSum(int[] nums) {
    int n = nums.length;
    if (n < 3) return -1;  // Need at least 3 elements for a triplet

    // Step 1: Precompute minimum value to the left of each index
    int[] leftMin = new int[n];
    int currentMin = Integer.MAX_VALUE;
    for (int i = 1; i < n; i++) {
        currentMin = Math.min(currentMin, nums[i - 1]);
        leftMin[i] = currentMin;
    }

    // Step 2: Precompute minimum value to the right of each index
    int[] rightMin = new int[n];
    currentMin = Integer.MAX_VALUE;
    for (int i = n - 2; i >= 0; i--) {
        currentMin = Math.min(currentMin, nums[i + 1]);
        rightMin[i] = currentMin;
    }

    // Step 3: Check each possible peak j
    int minSum = Integer.MAX_VALUE;
    for (int j = 1; j < n - 1; j++) {  // j cannot be first or last index
        if (leftMin[j] < nums[j] && rightMin[j] < nums[j]) {
            int currentSum = leftMin[j] + nums[j] + rightMin[j];
            minSum = Math.min(minSum, currentSum);
        }
    }

    return minSum == Integer.MAX_VALUE ? -1 : minSum;
}
```

</div>

**Why this works:** For each potential peak `j`, the smallest possible sum involving `j` uses the smallest available value to its left and the smallest available value to its right. By precomputing these minimums, we can check all `j` in O(n) time instead of O(n³).

## Complexity Analysis

**Time Complexity:** O(n)

- We make three passes through the array:
  1. Forward pass to compute `left_min` (O(n))
  2. Backward pass to compute `right_min` (O(n))
  3. Final pass to check each `j` (O(n))
- Total: O(3n) = O(n)

**Space Complexity:** O(n)

- We store two additional arrays `left_min` and `right_min`, each of size n
- Total: O(2n) = O(n)

## Common Mistakes

1. **Not handling the "no triplet" case:** Forgetting to return `-1` when no mountain triplet exists. Always initialize `min_sum` to a sentinel value (like `Infinity`) and check if it was updated.

2. **Incorrect index bounds:** When checking `j` as a peak, it must have at least one element to its left and right, so `j` should range from `1` to `n-2`. Including `j=0` or `j=n-1` will cause index errors or logical errors.

3. **Misunderstanding the mountain condition:** The problem requires `nums[i] < nums[j]` AND `nums[k] < nums[j]`, not `nums[i] < nums[j] < nums[k]`. Some candidates mistakenly look for strictly increasing then decreasing sequences.

4. **Using the wrong minimum:** When computing `left_min[j]`, we want the minimum value in `nums[0..j-1]`, not `nums[0..j]`. Similarly, `right_min[j]` should be minimum in `nums[j+1..n-1]`, not `nums[j..n-1]`. Off-by-one errors here will include `nums[j]` itself, which violates `i < j < k`.

## When You'll See This Pattern

This "precompute left/right information" pattern appears in many array problems where you need to make decisions based on values to the left and right of each element:

1. **Trapping Rain Water (LeetCode #42):** Precompute left and right maximum heights for each bar to determine how much water it can hold.

2. **Product of Array Except Self (LeetCode #238):** Precompute left and right products for each element to compute the product of all elements except itself.

3. **Maximum Subarray Min-Product (LeetCode #1856):** Uses monotonic stacks to find next smaller elements on left and right — similar "boundary finding" concept.

The core idea: When you need information about elements to the left/right of each position, precomputing it in O(n) time is often better than recalculating for each element.

## Key Takeaways

1. **Precomputation transforms O(n³) to O(n):** When you need to check triplets or pairs with specific relationships, consider what information you can precompute to avoid nested loops.

2. **Break symmetric problems into asymmetric parts:** The mountain triplet has symmetric conditions on left and right (`< nums[j]`). By solving left and right separately with precomputed arrays, we simplify the problem.

3. **Sentinel values are crucial for "not found" cases:** Using `Infinity` or `Integer.MAX_VALUE` as initial minimums and checking if they were updated is cleaner than special flags or exceptions.

Related problems: [3Sum](/problem/3sum), [Number of Arithmetic Triplets](/problem/number-of-arithmetic-triplets), [Maximum Value of an Ordered Triplet I](/problem/maximum-value-of-an-ordered-triplet-i)
