---
title: "How to Solve Split Array With Minimum Difference — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Split Array With Minimum Difference. Medium difficulty, 33.6% acceptance rate. Topics: Array, Prefix Sum."
date: "2028-11-18"
category: "dsa-patterns"
tags: ["split-array-with-minimum-difference", "array", "prefix-sum", "medium"]
---

# How to Solve Split Array With Minimum Difference

You're given an array and need to split it into two subarrays where the left part is strictly increasing and the right part is strictly decreasing. Your goal is to minimize the absolute difference between their sums. What makes this tricky is that you need to find a split point that satisfies both monotonicity constraints while also balancing the sums.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 3, 1, 4, 2]`

We need to find a split index `i` where:

- Elements `nums[0]` through `nums[i]` form a strictly increasing sequence
- Elements `nums[i+1]` through `nums[n-1]` form a strictly decreasing sequence

Let's check each possible split:

**Split at index 0** (left: [2], right: [3, 1, 4, 2])

- Left is increasing ✓ (single element always increasing)
- Right [3, 1, 4, 2] is NOT strictly decreasing (3→1 is decreasing, but 1→4 is increasing)
- **Invalid split**

**Split at index 1** (left: [2, 3], right: [1, 4, 2])

- Left [2, 3] is strictly increasing ✓
- Right [1, 4, 2] is NOT strictly decreasing (1→4 is increasing)
- **Invalid split**

**Split at index 2** (left: [2, 3, 1], right: [4, 2])

- Left [2, 3, 1] is NOT strictly increasing (3→1 is decreasing)
- **Invalid split**

**Split at index 3** (left: [2, 3, 1, 4], right: [2])

- Left [2, 3, 1, 4] is NOT strictly increasing (3→1 is decreasing)
- **Invalid split**

Wait, we found no valid splits! Let's try a different example: `nums = [1, 2, 3, 4, 3, 2, 1]`

**Split at index 3** (left: [1, 2, 3, 4], right: [3, 2, 1])

- Left [1, 2, 3, 4] is strictly increasing ✓
- Right [3, 2, 1] is strictly decreasing ✓
- Left sum = 10, right sum = 6, difference = |10 - 6| = 4

**Split at index 4** (left: [1, 2, 3, 4, 3], right: [2, 1])

- Left [1, 2, 3, 4, 3] is NOT strictly increasing (4→3 is decreasing)
- **Invalid split**

So the minimum difference is 4 for this array.

## Brute Force Approach

The brute force approach would check every possible split point `i` from 0 to n-2 (since both subarrays must be non-empty). For each split:

1. Check if `nums[0..i]` is strictly increasing
2. Check if `nums[i+1..n-1]` is strictly decreasing
3. If both conditions are met, calculate the absolute difference between sums
4. Track the minimum valid difference

This approach requires O(n) time to check each split (verifying monotonicity and calculating sums), and we have O(n) possible splits, giving us O(n²) total time complexity.

The problem with this approach is efficiency. With n up to 10⁵ (typical for medium problems), O(n²) is far too slow—it would require up to 10¹⁰ operations, which is impractical.

## Optimized Approach

The key insight is that we can precompute information to check validity and calculate sums in O(1) time per split. Here's the step-by-step reasoning:

1. **Prefix sums**: We can precompute prefix sums so that for any split at index `i`, we can get `leftSum = prefix[i+1]` and `rightSum = totalSum - leftSum` in O(1) time.

2. **Monotonicity checks**: We need to know if `nums[0..i]` is strictly increasing and if `nums[i+1..n-1]` is strictly decreasing. We can precompute:
   - `inc[i]`: whether `nums[0..i]` is strictly increasing
   - `dec[i]`: whether `nums[i..n-1]` is strictly decreasing

3. **Efficient computation**:
   - `inc[i]` can be computed left-to-right: `inc[i] = inc[i-1] && (nums[i] > nums[i-1])`
   - `dec[i]` can be computed right-to-left: `dec[i] = dec[i+1] && (nums[i] > nums[i+1])`

4. **Checking splits**: For split at index `i` (where left ends at `i` and right starts at `i+1`):
   - Left is valid if `inc[i]` is true
   - Right is valid if `dec[i+1]` is true
   - If both are valid, calculate difference using prefix sums

This reduces our per-split check to O(1) time, making the overall solution O(n).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumDifference(nums):
    n = len(nums)

    # Edge case: array must have at least 2 elements for a valid split
    if n < 2:
        return -1  # No valid split possible

    # Step 1: Precompute prefix sums for O(1) sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    total_sum = prefix[n]

    # Step 2: Precompute increasing array validity from left to right
    # inc[i] = True if nums[0..i] is strictly increasing
    inc = [False] * n
    inc[0] = True  # Single element is always increasing
    for i in range(1, n):
        inc[i] = inc[i - 1] and (nums[i] > nums[i - 1])

    # Step 3: Precompute decreasing array validity from right to left
    # dec[i] = True if nums[i..n-1] is strictly decreasing
    dec = [False] * n
    dec[n - 1] = True  # Single element is always decreasing
    for i in range(n - 2, -1, -1):
        dec[i] = dec[i + 1] and (nums[i] > nums[i + 1])

    # Step 4: Try all possible splits and find minimum difference
    min_diff = float('inf')
    # Split at index i means left = nums[0..i], right = nums[i+1..n-1]
    for i in range(n - 1):  # i goes from 0 to n-2 (both subarrays non-empty)
        # Check if left part is strictly increasing and right part is strictly decreasing
        if inc[i] and dec[i + 1]:
            left_sum = prefix[i + 1]  # Sum of nums[0..i]
            right_sum = total_sum - left_sum
            diff = abs(left_sum - right_sum)
            min_diff = min(min_diff, diff)

    # Return -1 if no valid split found, otherwise return minimum difference
    return -1 if min_diff == float('inf') else min_diff
```

```javascript
// Time: O(n) | Space: O(n)
function minimumDifference(nums) {
  const n = nums.length;

  // Edge case: array must have at least 2 elements for a valid split
  if (n < 2) {
    return -1; // No valid split possible
  }

  // Step 1: Precompute prefix sums for O(1) sum queries
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  const totalSum = prefix[n];

  // Step 2: Precompute increasing array validity from left to right
  // inc[i] = true if nums[0..i] is strictly increasing
  const inc = new Array(n).fill(false);
  inc[0] = true; // Single element is always increasing
  for (let i = 1; i < n; i++) {
    inc[i] = inc[i - 1] && nums[i] > nums[i - 1];
  }

  // Step 3: Precompute decreasing array validity from right to left
  // dec[i] = true if nums[i..n-1] is strictly decreasing
  const dec = new Array(n).fill(false);
  dec[n - 1] = true; // Single element is always decreasing
  for (let i = n - 2; i >= 0; i--) {
    dec[i] = dec[i + 1] && nums[i] > nums[i + 1];
  }

  // Step 4: Try all possible splits and find minimum difference
  let minDiff = Infinity;
  // Split at index i means left = nums[0..i], right = nums[i+1..n-1]
  for (let i = 0; i < n - 1; i++) {
    // i goes from 0 to n-2 (both subarrays non-empty)
    // Check if left part is strictly increasing and right part is strictly decreasing
    if (inc[i] && dec[i + 1]) {
      const leftSum = prefix[i + 1]; // Sum of nums[0..i]
      const rightSum = totalSum - leftSum;
      const diff = Math.abs(leftSum - rightSum);
      minDiff = Math.min(minDiff, diff);
    }
  }

  // Return -1 if no valid split found, otherwise return minimum difference
  return minDiff === Infinity ? -1 : minDiff;
}
```

```java
// Time: O(n) | Space: O(n)
public int minimumDifference(int[] nums) {
    int n = nums.length;

    // Edge case: array must have at least 2 elements for a valid split
    if (n < 2) {
        return -1;  // No valid split possible
    }

    // Step 1: Precompute prefix sums for O(1) sum queries
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    int totalSum = prefix[n];

    // Step 2: Precompute increasing array validity from left to right
    // inc[i] = true if nums[0..i] is strictly increasing
    boolean[] inc = new boolean[n];
    inc[0] = true;  // Single element is always increasing
    for (int i = 1; i < n; i++) {
        inc[i] = inc[i - 1] && (nums[i] > nums[i - 1]);
    }

    // Step 3: Precompute decreasing array validity from right to left
    // dec[i] = true if nums[i..n-1] is strictly decreasing
    boolean[] dec = new boolean[n];
    dec[n - 1] = true;  // Single element is always decreasing
    for (int i = n - 2; i >= 0; i--) {
        dec[i] = dec[i + 1] && (nums[i] > nums[i + 1]);
    }

    // Step 4: Try all possible splits and find minimum difference
    int minDiff = Integer.MAX_VALUE;
    // Split at index i means left = nums[0..i], right = nums[i+1..n-1]
    for (int i = 0; i < n - 1; i++) {  // i goes from 0 to n-2 (both subarrays non-empty)
        // Check if left part is strictly increasing and right part is strictly decreasing
        if (inc[i] && dec[i + 1]) {
            int leftSum = prefix[i + 1];  // Sum of nums[0..i]
            int rightSum = totalSum - leftSum;
            int diff = Math.abs(leftSum - rightSum);
            minDiff = Math.min(minDiff, diff);
        }
    }

    // Return -1 if no valid split found, otherwise return minimum difference
    return minDiff == Integer.MAX_VALUE ? -1 : minDiff;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Computing prefix sums: O(n)
- Computing `inc` array: O(n)
- Computing `dec` array: O(n)
- Checking all splits: O(n)
- Total: O(n) + O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Prefix sums array: O(n)
- `inc` array: O(n)
- `dec` array: O(n)
- Total: O(n) + O(n) + O(n) = O(n)

We could optimize space to O(1) by computing sums on the fly and checking monotonicity during the split loop, but that would make the code more complex. The O(n) space solution is usually acceptable in interviews.

## Common Mistakes

1. **Forgetting that both subarrays must be non-empty**: Candidates sometimes check splits where `i = n-1` (right subarray empty) or `i = -1` (left subarray empty). Remember: the loop should run from `i = 0` to `i = n-2`.

2. **Incorrect monotonicity checks**: The condition is "strictly increasing" and "strictly decreasing," not "non-decreasing" or "non-increasing." This means `nums[i] > nums[i-1]` for increasing, not `nums[i] >= nums[i-1]`.

3. **Off-by-one errors in prefix sums**: When using prefix sums, remember that `prefix[i]` is the sum of elements `0` to `i-1`. So the sum of `nums[0..i]` is `prefix[i+1]`, not `prefix[i]`.

4. **Not handling the "no valid split" case**: If no split satisfies both conditions, we must return -1 (or some sentinel value). Candidates often forget this edge case.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Prefix Sums + Two Pointers**: Problems like "Maximum Subarray", "Minimum Size Subarray Sum", and "Subarray Sum Equals K" use prefix sums for efficient range sum queries.

2. **Monotonic Array Validation**: Problems like "Monotonic Array" and "Valid Mountain Array" require checking array monotonicity properties.

3. **Split Array Problems**: Problems like "Split Array Largest Sum" and "Partition Array into Disjoint Intervals" involve finding optimal split points with certain constraints.

Specifically, this is similar to "Valid Mountain Array" (LeetCode 941) but with the added complexity of minimizing sum difference, making it a combination of monotonicity checking and optimization.

## Key Takeaways

1. **Precomputation is powerful**: When you need to answer many queries about array properties (like "is this subarray monotonic?" or "what's the sum of this subarray?"), precomputing the answers in O(n) time can reduce per-query cost to O(1).

2. **Break complex conditions into simpler ones**: Instead of checking both conditions at each split, precompute left validity and right validity separately, then combine them.

3. **Prefix sums enable O(1) range sum queries**: This is a fundamental technique that appears in many array problems. Remember that `prefix[r+1] - prefix[l]` gives the sum of `nums[l..r]`.

[Practice this problem on CodeJeet](/problem/split-array-with-minimum-difference)
