---
title: "How to Solve Count the Number of Fair Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Number of Fair Pairs. Medium difficulty, 52.7% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2028-06-08"
category: "dsa-patterns"
tags: ["count-the-number-of-fair-pairs", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Count the Number of Fair Pairs

This problem asks us to count pairs of indices `(i, j)` where `i < j` and the sum of their corresponding values falls within a given range `[lower, upper]`. What makes this problem interesting is that we need to count pairs within a sum range rather than finding a single target sum, which requires a different approach than standard two-sum problems.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [0, 1, 4, 4, 5, 7]` with `lower = 3` and `upper = 6`.

**Step 1: Sort the array**  
Sorted: `[0, 1, 4, 4, 5, 7]` (already sorted in this case)

**Step 2: For each element, find valid partners**  
We'll use a two-pointer approach for each element:

- For `nums[0] = 0`: We need partners where `3 ≤ 0 + x ≤ 6`, so `3 ≤ x ≤ 6`
  - Find first index where `nums[j] ≥ 3` (binary search gives index 2)
  - Find last index where `nums[j] ≤ 6` (binary search gives index 4)
  - Valid indices: 2, 3, 4 (but must be > i, so all are valid)
  - Count: 3 pairs

- For `nums[1] = 1`: Need `2 ≤ x ≤ 5`
  - First index where `nums[j] ≥ 2`: index 2
  - Last index where `nums[j] ≤ 5`: index 4
  - Valid indices: 2, 3, 4 (must be > 1, so all valid)
  - Count: 3 pairs

- For `nums[2] = 4`: Need `-1 ≤ x ≤ 2` (but x must be ≥ 4 in sorted array, so no valid partners)
  - Count: 0 pairs

- For `nums[3] = 4`: Same as above, no valid partners
  - Count: 0 pairs

- For `nums[4] = 5`: Need `-2 ≤ x ≤ 1` (no valid partners since array is sorted ascending)
  - Count: 0 pairs

- For `nums[5] = 7`: Need `-4 ≤ x ≤ -1` (no valid partners)
  - Count: 0 pairs

**Total fair pairs:** 3 + 3 = 6

## Brute Force Approach

The brute force solution checks every possible pair `(i, j)` where `i < j`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countFairPairs(nums, lower, upper):
    n = len(nums)
    count = 0

    # Check every possible pair
    for i in range(n):
        for j in range(i + 1, n):
            pair_sum = nums[i] + nums[j]
            if lower <= pair_sum <= upper:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countFairPairs(nums, lower, upper) {
  let count = 0;
  const n = nums.length;

  // Check every possible pair
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const pairSum = nums[i] + nums[j];
      if (pairSum >= lower && pairSum <= upper) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int countFairPairs(int[] nums, int lower, int upper) {
    int count = 0;
    int n = nums.length;

    // Check every possible pair
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int pairSum = nums[i] + nums[j];
            if (pairSum >= lower && pairSum <= upper) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** With `n` up to 10⁵, checking all O(n²) pairs would require up to 5 billion operations, which is far too slow. We need an O(n log n) or better solution.

## Optimized Approach

The key insight is that we can **sort the array** first. Once sorted, for each element `nums[i]`, we need to find how many elements `nums[j]` (with `j > i`) satisfy:

```
lower ≤ nums[i] + nums[j] ≤ upper
```

This is equivalent to:

```
lower - nums[i] ≤ nums[j] ≤ upper - nums[i]
```

Since the array is sorted, we can use **binary search** to find:

1. The **first index** where `nums[j] ≥ lower - nums[i]`
2. The **last index** where `nums[j] ≤ upper - nums[i]`

The number of valid partners for `nums[i]` is the count of indices between these two bounds that are also greater than `i`.

**Why sorting works:** The problem doesn't require us to preserve original indices for the final count—we just need the total number of valid pairs. Sorting allows us to use binary search to find partners efficiently.

**Important nuance:** When we find the range of valid values, we must ensure `j > i`. We handle this by:

1. Finding the overall valid range with binary search
2. Adjusting the lower bound to be at least `i + 1`
3. Counting only if the adjusted range is valid (lower ≤ upper)

## Optimal Solution

Here's the complete solution using sorting and binary search:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def countFairPairs(nums, lower, upper):
    # Step 1: Sort the array to enable binary search
    nums.sort()
    n = len(nums)
    count = 0

    # Step 2: For each element, find valid partners using binary search
    for i in range(n):
        # We need nums[j] such that: lower - nums[i] ≤ nums[j] ≤ upper - nums[i]
        # And also j > i

        # Find the smallest index where nums[j] >= lower - nums[i]
        low_target = lower - nums[i]
        # Use bisect_left to find first position where element >= low_target
        left = bisect_left(nums, low_target)

        # Find the largest index where nums[j] <= upper - nums[i]
        high_target = upper - nums[i]
        # Use bisect_right to find first position where element > high_target,
        # then subtract 1 to get last position where element <= high_target
        right = bisect_right(nums, high_target) - 1

        # Adjust left to ensure j > i
        left = max(left, i + 1)

        # If valid range exists, add to count
        if left <= right:
            count += (right - left + 1)

    return count

# Helper functions (Python's bisect module provides these)
def bisect_left(arr, target):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo

def bisect_right(arr, target):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] <= target:
            lo = mid + 1
        else:
            hi = mid
    return lo
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function countFairPairs(nums, lower, upper) {
  // Step 1: Sort the array to enable binary search
  nums.sort((a, b) => a - b);
  let count = 0;
  const n = nums.length;

  // Step 2: For each element, find valid partners using binary search
  for (let i = 0; i < n; i++) {
    // We need nums[j] such that: lower - nums[i] ≤ nums[j] ≤ upper - nums[i]
    // And also j > i

    // Find the smallest index where nums[j] >= lower - nums[i]
    const lowTarget = lower - nums[i];
    let left = lowerBound(nums, lowTarget);

    // Find the largest index where nums[j] <= upper - nums[i]
    const highTarget = upper - nums[i];
    let right = upperBound(nums, highTarget) - 1;

    // Adjust left to ensure j > i
    left = Math.max(left, i + 1);

    // If valid range exists, add to count
    if (left <= right) {
      count += right - left + 1;
    }
  }

  return count;
}

// Binary search to find first index where arr[index] >= target
function lowerBound(arr, target) {
  let left = 0,
    right = arr.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}

// Binary search to find first index where arr[index] > target
function upperBound(arr, target) {
  let left = 0,
    right = arr.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
public int countFairPairs(int[] nums, int lower, int upper) {
    // Step 1: Sort the array to enable binary search
    Arrays.sort(nums);
    int count = 0;
    int n = nums.length;

    // Step 2: For each element, find valid partners using binary search
    for (int i = 0; i < n; i++) {
        // We need nums[j] such that: lower - nums[i] ≤ nums[j] ≤ upper - nums[i]
        // And also j > i

        // Find the smallest index where nums[j] >= lower - nums[i]
        int lowTarget = lower - nums[i];
        int left = lowerBound(nums, lowTarget);

        // Find the largest index where nums[j] <= upper - nums[i]
        int highTarget = upper - nums[i];
        int right = upperBound(nums, highTarget) - 1;

        // Adjust left to ensure j > i
        left = Math.max(left, i + 1);

        // If valid range exists, add to count
        if (left <= right) {
            count += (right - left + 1);
        }
    }

    return count;
}

// Binary search to find first index where arr[index] >= target
private int lowerBound(int[] arr, int target) {
    int left = 0, right = arr.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

// Binary search to find first index where arr[index] > target
private int upperBound(int[] arr, int target) {
    int left = 0, right = arr.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] <= target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the array takes O(n log n) time
- For each of the n elements, we perform two binary searches (O(log n) each)
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity:** O(1) or O(n)

- If we sort in-place (like Python's `sort()` or JavaScript's `sort()`), space is O(1) aside from recursion stack
- If sorting creates a new array (like Java's `Arrays.sort()` on primitives), space is O(n) for the sort
- The algorithm itself uses only O(1) additional space

## Common Mistakes

1. **Forgetting to sort the array:** The binary search approach only works on sorted data. Some candidates try to apply binary search directly to the unsorted array.

2. **Off-by-one errors in binary search:** Confusing `bisect_left` (first index ≥ target) with `bisect_right` (first index > target). For the upper bound, we need `bisect_right - 1` to get the last index ≤ target.

3. **Not handling the i < j constraint properly:** After finding the valid range `[left, right]`, we must ensure `left ≥ i + 1`. Forgetting this adjustment counts pairs where `j ≤ i`.

4. **Integer overflow in intermediate calculations:** When `nums[i]` is very large or very small, `lower - nums[i]` or `upper - nums[i]` might overflow. Use 64-bit integers (long in Java, BigInt in JavaScript if needed).

## When You'll See This Pattern

This "sort + binary search for range" pattern appears in several problems:

1. **Two Sum variations:** When you need to find pairs satisfying a condition rather than exact equality.
2. **Count of Range Sum (Hard):** A more advanced version using prefix sums and specialized data structures.
3. **Finding Pairs With Absolute Difference K (Easy):** Similar pattern but with absolute difference instead of sum range.
4. **3Sum Smaller (Medium):** Counts triplets with sum less than target, using similar two-pointer logic.

The core idea is: when you need to count pairs/triplets satisfying a range condition, sorting often enables efficient searching via binary search or two pointers.

## Key Takeaways

1. **Sorting transforms pair-finding problems:** When you only need to count pairs (not return their original indices), sorting is often the key to efficiency.

2. **Binary search finds ranges, not just single values:** Learn to use `lower_bound` (first ≥ target) and `upper_bound` (first > target) to find value ranges in sorted arrays.

3. **Constraint adjustment is crucial:** After finding the theoretical valid range, always check if you need to adjust for additional constraints (like `i < j` in this problem).

Related problems: [Count of Range Sum](/problem/count-of-range-sum), [Finding Pairs With a Certain Sum](/problem/finding-pairs-with-a-certain-sum), [Count Number of Pairs With Absolute Difference K](/problem/count-number-of-pairs-with-absolute-difference-k)
