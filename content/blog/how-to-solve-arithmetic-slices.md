---
title: "How to Solve Arithmetic Slices — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Arithmetic Slices. Medium difficulty, 64.8% acceptance rate. Topics: Array, Dynamic Programming, Sliding Window."
date: "2027-09-16"
category: "dsa-patterns"
tags: ["arithmetic-slices", "array", "dynamic-programming", "sliding-window", "medium"]
---

# How to Solve Arithmetic Slices

This problem asks us to count all contiguous arithmetic subarrays of length at least 3 in a given integer array. An arithmetic subarray is one where the difference between consecutive elements is constant. What makes this problem interesting is that while the definition is simple, efficiently counting all valid subarrays requires recognizing a pattern that connects overlapping subarrays rather than checking each one independently.

## Visual Walkthrough

Let's trace through the example `nums = [1, 2, 3, 4, 5]` to build intuition:

**Step 1:** Check all possible subarrays of length ≥ 3:

- `[1, 2, 3]`: Differences: 2-1=1, 3-2=1 → constant difference ✓
- `[2, 3, 4]`: Differences: 3-2=1, 4-3=1 → constant difference ✓
- `[3, 4, 5]`: Differences: 4-3=1, 5-4=1 → constant difference ✓
- `[1, 2, 3, 4]`: All differences = 1 → constant difference ✓
- `[2, 3, 4, 5]`: All differences = 1 → constant difference ✓
- `[1, 2, 3, 4, 5]`: All differences = 1 → constant difference ✓

Total: 6 arithmetic slices.

**Key observation:** Notice how arithmetic slices build upon each other:

- When we have `[1, 2, 3]` (1 slice), adding `4` gives us `[1, 2, 3, 4]` which contains 2 new slices: `[1, 2, 3, 4]` itself and `[2, 3, 4]`
- Adding `5` to `[1, 2, 3, 4]` gives us 3 new slices: `[1, 2, 3, 4, 5]`, `[2, 3, 4, 5]`, and `[3, 4, 5]`

This pattern shows that when we extend an arithmetic sequence by one element, the number of new arithmetic slices increases by 1 each time we successfully extend it.

## Brute Force Approach

The most straightforward approach is to check every possible subarray of length at least 3:

1. For each starting index `i` from 0 to `n-3`
2. For each ending index `j` from `i+2` to `n-1`
3. Check if `nums[i...j]` is arithmetic by verifying all consecutive differences are equal

This approach is intuitive but inefficient because it repeatedly checks overlapping subarrays and has O(n³) time complexity in the worst case (checking O(n²) subarrays, each taking O(n) time to verify).

<div class="code-group">

```python
# Time: O(n^3) | Space: O(1)
def numberOfArithmeticSlices_brute(nums):
    n = len(nums)
    count = 0

    # Check all possible subarrays of length >= 3
    for i in range(n - 2):  # Starting index
        for j in range(i + 2, n):  # Ending index
            # Check if nums[i...j] is arithmetic
            diff = nums[i + 1] - nums[i]
            is_arithmetic = True

            # Verify all consecutive differences are equal
            for k in range(i + 1, j):
                if nums[k + 1] - nums[k] != diff:
                    is_arithmetic = False
                    break

            if is_arithmetic:
                count += 1

    return count
```

```javascript
// Time: O(n^3) | Space: O(1)
function numberOfArithmeticSlicesBrute(nums) {
  const n = nums.length;
  let count = 0;

  // Check all possible subarrays of length >= 3
  for (let i = 0; i < n - 2; i++) {
    // Starting index
    for (let j = i + 2; j < n; j++) {
      // Ending index
      // Check if nums[i...j] is arithmetic
      const diff = nums[i + 1] - nums[i];
      let isArithmetic = true;

      // Verify all consecutive differences are equal
      for (let k = i + 1; k < j; k++) {
        if (nums[k + 1] - nums[k] !== diff) {
          isArithmetic = false;
          break;
        }
      }

      if (isArithmetic) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n^3) | Space: O(1)
public int numberOfArithmeticSlicesBrute(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Check all possible subarrays of length >= 3
    for (int i = 0; i < n - 2; i++) {  // Starting index
        for (int j = i + 2; j < n; j++) {  // Ending index
            // Check if nums[i...j] is arithmetic
            int diff = nums[i + 1] - nums[i];
            boolean isArithmetic = true;

            // Verify all consecutive differences are equal
            for (int k = i + 1; k < j; k++) {
                if (nums[k + 1] - nums[k] != diff) {
                    isArithmetic = false;
                    break;
                }
            }

            if (isArithmetic) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every subarray independently. Instead, we can use **dynamic programming** or a **sliding window** approach to build upon previous results.

**Dynamic Programming Insight:**
Let `dp[i]` represent the number of arithmetic slices ending at index `i`. The recurrence relation is:

- If `nums[i] - nums[i-1] == nums[i-1] - nums[i-2]`, then we can extend all arithmetic slices ending at `i-1` by one element, plus we get a new 3-element slice `[i-2, i-1, i]`
- So `dp[i] = dp[i-1] + 1` when the last 3 elements form an arithmetic sequence
- Otherwise, `dp[i] = 0`

The total number of arithmetic slices is the sum of all `dp[i]` values.

**Alternative Sliding Window Approach:**
We can also use a sliding window to find the longest arithmetic sequence at each position and calculate how many subarrays it contains. For a sequence of length `L`, the number of arithmetic subarrays of length ≥ 3 is `(L-1)*(L-2)/2`.

## Optimal Solution

Here's the dynamic programming solution, which is more efficient and elegant:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - optimized space version
def numberOfArithmeticSlices(nums):
    n = len(nums)
    if n < 3:
        return 0  # Need at least 3 elements for an arithmetic slice

    total_slices = 0
    current_slices = 0  # Represents dp[i] in the DP approach

    # Start from index 2 since we need at least 3 elements
    for i in range(2, n):
        # Check if nums[i-2], nums[i-1], nums[i] form an arithmetic sequence
        if nums[i] - nums[i-1] == nums[i-1] - nums[i-2]:
            # If they do, we can extend all slices ending at i-1 by one element
            # Plus we get a new 3-element slice [i-2, i-1, i]
            current_slices += 1
            total_slices += current_slices
        else:
            # If not, we can't extend any slices, reset the counter
            current_slices = 0

    return total_slices
```

```javascript
// Time: O(n) | Space: O(1)
function numberOfArithmeticSlices(nums) {
  const n = nums.length;
  if (n < 3) {
    return 0; // Need at least 3 elements for an arithmetic slice
  }

  let totalSlices = 0;
  let currentSlices = 0; // Represents dp[i] in the DP approach

  // Start from index 2 since we need at least 3 elements
  for (let i = 2; i < n; i++) {
    // Check if nums[i-2], nums[i-1], nums[i] form an arithmetic sequence
    if (nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2]) {
      // If they do, we can extend all slices ending at i-1 by one element
      // Plus we get a new 3-element slice [i-2, i-1, i]
      currentSlices += 1;
      totalSlices += currentSlices;
    } else {
      // If not, we can't extend any slices, reset the counter
      currentSlices = 0;
    }
  }

  return totalSlices;
}
```

```java
// Time: O(n) | Space: O(1)
public int numberOfArithmeticSlices(int[] nums) {
    int n = nums.length;
    if (n < 3) {
        return 0;  // Need at least 3 elements for an arithmetic slice
    }

    int totalSlices = 0;
    int currentSlices = 0;  // Represents dp[i] in the DP approach

    // Start from index 2 since we need at least 3 elements
    for (int i = 2; i < n; i++) {
        // Check if nums[i-2], nums[i-1], nums[i] form an arithmetic sequence
        if (nums[i] - nums[i-1] == nums[i-1] - nums[i-2]) {
            // If they do, we can extend all slices ending at i-1 by one element
            // Plus we get a new 3-element slice [i-2, i-1, i]
            currentSlices += 1;
            totalSlices += currentSlices;
        } else {
            // If not, we can't extend any slices, reset the counter
            currentSlices = 0;
        }
    }

    return totalSlices;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array from index 2 to n-1
- Each iteration performs constant-time operations (subtractions and additions)

**Space Complexity: O(1)**

- We only use a constant amount of extra space (total_slices and current_slices variables)
- Even if we used the full DP array approach, we could optimize to O(1) by only storing the previous value

## Common Mistakes

1. **Starting the loop at the wrong index:** Candidates often start at index 1 instead of index 2. Remember we need at least 3 elements to form an arithmetic slice, so we need to check indices `i-2`, `i-1`, and `i`.

2. **Forgetting to reset current_slices:** When the arithmetic sequence breaks (differences aren't equal), we must reset `current_slices` to 0. Failing to do this will incorrectly count slices across non-arithmetic boundaries.

3. **Incorrect formula for counting slices:** Some candidates try to use combinatorial formulas without understanding the DP recurrence. The pattern `current_slices += 1; total_slices += current_slices;` correctly counts all subarrays ending at the current position.

4. **Not handling small arrays:** For arrays with fewer than 3 elements, we should return 0 immediately. This is an important edge case to check.

## When You'll See This Pattern

This problem teaches a common dynamic programming pattern for counting contiguous subarrays that satisfy some property. You'll see similar patterns in:

1. **Number of Zero-Filled Subarrays (LeetCode 2348):** Counts all subarrays filled with 0s. The DP approach is similar: when you see another zero, you can extend all zero-subarrays ending at the previous position.

2. **Maximum Subarray (LeetCode 53):** While it finds the maximum sum rather than counting, it uses a similar "extend or reset" logic with Kadane's algorithm.

3. **Longest Turbulent Subarray (LeetCode 978):** Counts or finds the longest subarray where the comparison sign alternates. The state transition logic is more complex but follows similar principles.

## Key Takeaways

1. **Look for overlapping subproblems:** When counting contiguous subarrays with a property, check if ending at position `i` relates to ending at position `i-1`. This is the hallmark of a DP solution.

2. **The "extend or reset" pattern:** Many array problems use this pattern. If the current element maintains the property when added to the previous subarray, extend it. Otherwise, reset and start fresh.

3. **Space optimization is often possible:** Even when the DP formulation uses an array `dp[i]`, check if you only need the previous value. This can reduce space from O(n) to O(1).

Related problems: [Arithmetic Slices II - Subsequence](/problem/arithmetic-slices-ii-subsequence), [Arithmetic Subarrays](/problem/arithmetic-subarrays), [Number of Zero-Filled Subarrays](/problem/number-of-zero-filled-subarrays)
