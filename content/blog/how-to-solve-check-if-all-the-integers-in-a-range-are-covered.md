---
title: "How to Solve Check if All the Integers in a Range Are Covered — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if All the Integers in a Range Are Covered. Easy difficulty, 50.8% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2028-02-25"
category: "dsa-patterns"
tags:
  ["check-if-all-the-integers-in-a-range-are-covered", "array", "hash-table", "prefix-sum", "easy"]
---

# How to Solve "Check if All the Integers in a Range Are Covered"

This problem asks us to verify whether every integer in a given range `[left, right]` is covered by at least one interval from a list of ranges. While the problem seems straightforward, the challenge lies in finding an efficient approach that doesn't require checking each integer individually against all intervals, which would be too slow for large ranges. The interesting part is recognizing that we can transform this coverage checking problem into a simpler counting problem.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `ranges = [[1,2], [3,4], [5,6]]`
- `left = 2`
- `right = 5`

We need to check if every integer from 2 to 5 (inclusive) is covered by at least one interval.

**Step-by-step visualization:**

1. **List all integers to check:** 2, 3, 4, 5
2. **Check coverage:**
   - Integer 2: Covered by `[1,2]` ✓
   - Integer 3: Covered by `[3,4]` ✓
   - Integer 4: Covered by `[3,4]` ✓
   - Integer 5: Covered by `[5,6]` ✓

All integers are covered, so the answer is `true`.

Now let's try a case where coverage fails:

**Input:**

- `ranges = [[1,3], [5,7]]`
- `left = 4`
- `right = 6`

**Step-by-step:**

1. **Integers to check:** 4, 5, 6
2. **Check coverage:**
   - Integer 4: Not covered by `[1,3]` or `[5,7]` ✗
   - Integer 5: Covered by `[5,7]` ✓
   - Integer 6: Covered by `[5,7]` ✓

Since integer 4 is not covered, the answer is `false`.

This visual approach helps us understand the problem, but checking each integer individually is inefficient. We need a smarter approach.

## Brute Force Approach

The most straightforward solution is to check each integer in `[left, right]` against all intervals:

1. For each integer `x` from `left` to `right`:
   - Check if `x` falls within any interval `[start, end]` in `ranges`
   - If any integer is not covered, return `false`
2. If all integers are covered, return `true`

**Why this is inefficient:**

- Time complexity: O((right - left + 1) × n) where n is the number of intervals
- For large ranges (e.g., left=1, right=10^5) and many intervals, this becomes O(10^5 × n), which is too slow
- We're doing redundant work by checking each integer separately

**Brute force code:**

<div class="code-group">

```python
# Time: O((right-left+1) * n) | Space: O(1)
def isCovered(ranges, left, right):
    # Check each integer in the target range
    for x in range(left, right + 1):
        covered = False
        # Check if this integer is covered by any interval
        for start, end in ranges:
            if start <= x <= end:
                covered = True
                break
        # If any integer is not covered, return False
        if not covered:
            return False
    return True
```

```javascript
// Time: O((right-left+1) * n) | Space: O(1)
function isCovered(ranges, left, right) {
  // Check each integer in the target range
  for (let x = left; x <= right; x++) {
    let covered = false;
    // Check if this integer is covered by any interval
    for (const [start, end] of ranges) {
      if (start <= x && x <= end) {
        covered = true;
        break;
      }
    }
    // If any integer is not covered, return false
    if (!covered) return false;
  }
  return true;
}
```

```java
// Time: O((right-left+1) * n) | Space: O(1)
public boolean isCovered(int[][] ranges, int left, int right) {
    // Check each integer in the target range
    for (int x = left; x <= right; x++) {
        boolean covered = false;
        // Check if this integer is covered by any interval
        for (int[] range : ranges) {
            int start = range[0];
            int end = range[1];
            if (start <= x && x <= end) {
                covered = true;
                break;
            }
        }
        // If any integer is not covered, return false
        if (!covered) return false;
    }
    return true;
}
```

</div>

## Optimal Solution

The key insight is that we don't need to check each integer individually. Instead, we can use a **difference array** or **prefix sum** approach to mark which integers are covered by the intervals, then check if all integers in `[left, right]` have coverage.

**Approach:**

1. Create an array `diff` of size 52 (since constraints say values go up to 50, we need 0-51)
2. For each interval `[start, end]`:
   - Mark the start by incrementing `diff[start]`
   - Mark the end+1 by decrementing `diff[end+1]`
3. Compute prefix sums to get the actual coverage count at each position
4. Check if all positions from `left` to `right` have coverage count > 0

**Why this works:**

- The difference array technique allows us to mark ranges efficiently in O(1) per interval
- The prefix sum reconstructs how many intervals cover each position
- We only need to check positions from `left` to `right`, not the entire array

<div class="code-group">

```python
# Time: O(n + m) where n = number of intervals, m = right-left+1 | Space: O(1) (fixed size array)
def isCovered(ranges, left, right):
    # Create a difference array of size 52 (since values go up to 50, we need 0-51)
    # We use 52 because we need to handle end+1 up to 51
    diff = [0] * 52

    # Step 1: Mark intervals in the difference array
    # For each interval [start, end], we increment diff[start] and decrement diff[end+1]
    # This marks that coverage increases at start and decreases after end
    for start, end in ranges:
        diff[start] += 1      # Coverage starts at 'start'
        diff[end + 1] -= 1    # Coverage ends after 'end' (at end+1)

    # Step 2: Compute prefix sum to get actual coverage count at each position
    # The prefix sum tells us how many intervals cover each integer
    prefix_sum = 0
    for i in range(1, 51):  # We only care about positions 1-50 based on constraints
        prefix_sum += diff[i]

        # Step 3: Check if current position is in [left, right] and has no coverage
        # If prefix_sum is 0, no interval covers this position
        if left <= i <= right and prefix_sum <= 0:
            return False

    return True
```

```javascript
// Time: O(n + m) where n = number of intervals, m = right-left+1 | Space: O(1) (fixed size array)
function isCovered(ranges, left, right) {
  // Create a difference array of size 52 (since values go up to 50, we need 0-51)
  // We use 52 because we need to handle end+1 up to 51
  const diff = new Array(52).fill(0);

  // Step 1: Mark intervals in the difference array
  // For each interval [start, end], we increment diff[start] and decrement diff[end+1]
  // This marks that coverage increases at start and decreases after end
  for (const [start, end] of ranges) {
    diff[start] += 1; // Coverage starts at 'start'
    diff[end + 1] -= 1; // Coverage ends after 'end' (at end+1)
  }

  // Step 2: Compute prefix sum to get actual coverage count at each position
  // The prefix sum tells us how many intervals cover each integer
  let prefixSum = 0;
  for (let i = 1; i <= 50; i++) {
    // We only care about positions 1-50 based on constraints
    prefixSum += diff[i];

    // Step 3: Check if current position is in [left, right] and has no coverage
    // If prefixSum is 0, no interval covers this position
    if (i >= left && i <= right && prefixSum <= 0) {
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n + m) where n = number of intervals, m = right-left+1 | Space: O(1) (fixed size array)
public boolean isCovered(int[][] ranges, int left, int right) {
    // Create a difference array of size 52 (since values go up to 50, we need 0-51)
    // We use 52 because we need to handle end+1 up to 51
    int[] diff = new int[52];

    // Step 1: Mark intervals in the difference array
    // For each interval [start, end], we increment diff[start] and decrement diff[end+1]
    // This marks that coverage increases at start and decreases after end
    for (int[] range : ranges) {
        int start = range[0];
        int end = range[1];
        diff[start] += 1;      // Coverage starts at 'start'
        diff[end + 1] -= 1;    // Coverage ends after 'end' (at end+1)
    }

    // Step 2: Compute prefix sum to get actual coverage count at each position
    // The prefix sum tells us how many intervals cover each integer
    int prefixSum = 0;
    for (int i = 1; i <= 50; i++) {  // We only care about positions 1-50 based on constraints
        prefixSum += diff[i];

        // Step 3: Check if current position is in [left, right] and has no coverage
        // If prefixSum is 0, no interval covers this position
        if (i >= left && i <= right && prefixSum <= 0) {
            return false;
        }
    }

    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n`: Number of intervals in `ranges`
- `m`: Size of the range to check (`right - left + 1`)
- We iterate through all intervals once to build the difference array: O(n)
- We iterate through positions 1-50 to compute prefix sums and check coverage: O(50) = O(1) constant
- In practice, we could say O(n + 50) which simplifies to O(n) since 50 is constant

**Space Complexity: O(1)**

- We use a fixed-size array of 52 elements regardless of input size
- No additional data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors with inclusive/exclusive boundaries:**
   - Forgetting that intervals are inclusive (both start and end are covered)
   - When using the difference array technique, you must decrement at `end + 1`, not `end`
   - **How to avoid:** Always test with small examples where you can manually verify coverage

2. **Checking unnecessary positions:**
   - Some candidates check all positions from 1 to 50 even when `left` and `right` are small
   - **How to avoid:** Only check positions from `left` to `right` when verifying coverage

3. **Not handling overlapping intervals correctly:**
   - The brute force approach handles this naturally, but optimized approaches need to account for multiple intervals covering the same position
   - **How to avoid:** The difference array approach naturally handles overlaps because prefix sums accumulate coverage counts

4. **Assuming sorted input:**
   - The problem doesn't guarantee intervals are sorted
   - **How to avoid:** Don't make assumptions about input ordering unless explicitly stated

## When You'll See This Pattern

The difference array/prefix sum technique for range updates is a powerful pattern that appears in many problems:

1. **Range Addition (LeetCode 370):** Direct application of the difference array technique
2. **Corporate Flight Bookings (LeetCode 1109):** Similar pattern for booking seats on flights
3. **Car Pooling (LeetCode 1094):** Tracking passenger counts with pickups and drop-offs
4. **Meeting Rooms II (LeetCode 253):** Can be solved with a similar approach by marking start and end times

The core idea is that when you need to apply many range updates and then query point values, difference arrays with prefix sums provide an O(1) update and O(n) reconstruction approach, which is much better than O(n) updates for each range.

## Key Takeaways

1. **Difference arrays transform range update problems into point update problems:** Instead of updating every element in a range, you mark the start and end points, then reconstruct with prefix sums.

2. **Look for problems with many range operations:** When a problem involves adding/subtracting values over ranges and then querying results, consider if difference arrays can help.

3. **Constraints matter:** The fixed range size (up to 50) makes the array approach feasible. For larger ranges, you might need a different approach like sorting intervals.

4. **Always verify edge cases:** Test with intervals that start/end at boundaries, overlapping intervals, and cases where coverage is exactly at the edges of `[left, right]`.

Related problems: [Find Maximal Uncovered Ranges](/problem/find-maximal-uncovered-ranges)
