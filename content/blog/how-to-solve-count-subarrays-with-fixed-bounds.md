---
title: "How to Solve Count Subarrays With Fixed Bounds — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Subarrays With Fixed Bounds. Hard difficulty, 69.2% acceptance rate. Topics: Array, Queue, Sliding Window, Monotonic Queue."
date: "2028-06-21"
category: "dsa-patterns"
tags: ["count-subarrays-with-fixed-bounds", "array", "queue", "sliding-window", "hard"]
---

# How to Solve Count Subarrays With Fixed Bounds

This problem asks us to count all subarrays of a given array where the minimum value equals `minK` and the maximum value equals `maxK`. What makes this problem tricky is that we need to efficiently track both the minimum and maximum values within every possible subarray, which seems to require checking O(n²) subarrays. The key insight is that we can use a sliding window approach with careful tracking of boundary positions to solve this in linear time.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider:

- `nums = [1, 3, 5, 2, 7, 5]`
- `minK = 1`
- `maxK = 5`

We need to count subarrays where min=1 and max=5. Let's think about valid subarrays:

1. `[1, 3, 5]` - min=1, max=5 ✓
2. `[1, 3, 5, 2]` - min=1, max=5 ✓
3. `[1, 3, 5, 2, 7]` - contains 7 > maxK, invalid
4. `[3, 5, 2]` - min=2, max=5 ✗ (min should be 1)
5. `[5, 2]` - min=2, max=5 ✗

The pattern emerges: for a subarray to be valid:

1. It must contain at least one `minK` and one `maxK`
2. All elements must be between `minK` and `maxK` (inclusive)
3. Any element outside `[minK, maxK]` breaks the subarray

Let's process the array step by step:

- Index 0: `1` (minK found at position 0)
- Index 1: `3` (valid, between minK and maxK)
- Index 2: `5` (maxK found at position 2)
  Now we have both minK and maxK. How many valid subarrays end at index 2?
  The left boundary can be anywhere from the start (0) to min(0, 2) = 0
  So only `[1, 3, 5]` is valid → 1 subarray
- Index 3: `2` (valid)
  minK last seen at 0, maxK last seen at 2
  Left boundary can be from start (0) to min(0, 2) = 0
  Subarrays ending at index 3: `[1, 3, 5, 2]` → 1 subarray
- Index 4: `7` (invalid, > maxK)
  This resets everything. We need to start fresh.
- Index 5: `5` (maxK found)
  But we don't have minK yet, so no valid subarrays.

Total valid subarrays = 2.

## Brute Force Approach

The brute force solution would check every possible subarray O(n²) and for each subarray, find its minimum and maximum O(n), resulting in O(n³) time complexity.

A slightly better brute force would be O(n²) by iterating through all starting indices and expanding the window while tracking min/max:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countSubarrays_brute(nums, minK, maxK):
    n = len(nums)
    count = 0

    for i in range(n):
        # Track min and max for subarrays starting at i
        current_min = float('inf')
        current_max = float('-inf')

        for j in range(i, n):
            # Update min and max as we expand the window
            current_min = min(current_min, nums[j])
            current_max = max(current_max, nums[j])

            # If we encounter an element outside bounds, break
            if nums[j] < minK or nums[j] > maxK:
                break

            # Check if this subarray meets the criteria
            if current_min == minK and current_max == maxK:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countSubarraysBrute(nums, minK, maxK) {
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    // Track min and max for subarrays starting at i
    let currentMin = Infinity;
    let currentMax = -Infinity;

    for (let j = i; j < n; j++) {
      // Update min and max as we expand the window
      currentMin = Math.min(currentMin, nums[j]);
      currentMax = Math.max(currentMax, nums[j]);

      // If we encounter an element outside bounds, break
      if (nums[j] < minK || nums[j] > maxK) {
        break;
      }

      // Check if this subarray meets the criteria
      if (currentMin === minK && currentMax === maxK) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public long countSubarraysBrute(int[] nums, int minK, int maxK) {
    int n = nums.length;
    long count = 0;

    for (int i = 0; i < n; i++) {
        // Track min and max for subarrays starting at i
        int currentMin = Integer.MAX_VALUE;
        int currentMax = Integer.MIN_VALUE;

        for (int j = i; j < n; j++) {
            // Update min and max as we expand the window
            currentMin = Math.min(currentMin, nums[j]);
            currentMax = Math.max(currentMax, nums[j]);

            // If we encounter an element outside bounds, break
            if (nums[j] < minK || nums[j] > maxK) {
                break;
            }

            // Check if this subarray meets the criteria
            if (currentMin == minK && currentMax == maxK) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

This brute force approach is too slow for large inputs (n up to 10⁵ would require ~10¹⁰ operations). We need an O(n) solution.

## Optimized Approach

The key insight is that we can process the array in a single pass using a sliding window approach with careful tracking of positions. Here's the reasoning:

1. **Invalid elements reset everything**: Any element outside `[minK, maxK]` cannot be part of any valid subarray. When we encounter such an element, we need to reset our tracking.

2. **We need to track specific positions**:
   - `lastMinPos`: the most recent index where we saw `minK`
   - `lastMaxPos`: the most recent index where we saw `maxK`
   - `leftBoundary`: the most recent index where we encountered an invalid element (or -1 if none yet)

3. **Counting valid subarrays ending at current position**:
   For a subarray ending at index `i` to be valid:
   - It must contain at least one `minK` and one `maxK`
   - All elements must be within `[minK, maxK]`

   The starting index of valid subarrays ending at `i` can be anywhere from `(leftBoundary + 1)` to `min(lastMinPos, lastMaxPos)`. This is because:
   - We can't start before or at `leftBoundary` (that would include invalid elements)
   - We need to include both `minK` and `maxK`, so we must start at or before the earlier of `lastMinPos` and `lastMaxPos`

4. **Formula for counting**:
   At each position `i`, if we have seen both `minK` and `maxK` since the last invalid element:
   ```
   valid_starts = min(lastMinPos, lastMaxPos) - leftBoundary
   ```
   If this is positive, add it to the total count.

## Optimal Solution

Here's the O(n) solution implementing the above logic:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countSubarrays(nums, minK, maxK):
    """
    Count subarrays where min == minK and max == maxK.

    The key insight: for each ending position i, count how many starting positions j
    would create a valid subarray [j..i]. A starting position j is valid if:
    1. j > last_invalid (where last_invalid is index of last element outside [minK, maxK])
    2. j <= min(last_min_pos, last_max_pos) (to include both minK and maxK)
    """
    n = len(nums)
    count = 0

    # Track the most recent positions of minK and maxK
    last_min_pos = -1
    last_max_pos = -1

    # Track the most recent invalid element (outside [minK, maxK])
    # This acts as the left boundary for valid subarrays
    left_boundary = -1

    for i in range(n):
        # Check if current element is outside the valid range
        if nums[i] < minK or nums[i] > maxK:
            # Reset everything - this element cannot be part of any valid subarray
            left_boundary = i
            last_min_pos = -1
            last_max_pos = -1
            continue

        # Update the most recent positions of minK and maxK
        if nums[i] == minK:
            last_min_pos = i
        if nums[i] == maxK:
            last_max_pos = i

        # If we have seen both minK and maxK since the last invalid element
        if last_min_pos != -1 and last_max_pos != -1:
            # The starting index must be after left_boundary and <= min(last_min_pos, last_max_pos)
            # to include both minK and maxK
            valid_start = min(last_min_pos, last_max_pos)

            # Count valid subarrays ending at i
            # All starting indices from (left_boundary + 1) to valid_start are valid
            count += max(0, valid_start - left_boundary)

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function countSubarrays(nums, minK, maxK) {
  const n = nums.length;
  let count = 0;

  // Track the most recent positions of minK and maxK
  let lastMinPos = -1;
  let lastMaxPos = -1;

  // Track the most recent invalid element (outside [minK, maxK])
  // This acts as the left boundary for valid subarrays
  let leftBoundary = -1;

  for (let i = 0; i < n; i++) {
    // Check if current element is outside the valid range
    if (nums[i] < minK || nums[i] > maxK) {
      // Reset everything - this element cannot be part of any valid subarray
      leftBoundary = i;
      lastMinPos = -1;
      lastMaxPos = -1;
      continue;
    }

    // Update the most recent positions of minK and maxK
    if (nums[i] === minK) {
      lastMinPos = i;
    }
    if (nums[i] === maxK) {
      lastMaxPos = i;
    }

    // If we have seen both minK and maxK since the last invalid element
    if (lastMinPos !== -1 && lastMaxPos !== -1) {
      // The starting index must be after leftBoundary and <= min(lastMinPos, lastMaxPos)
      // to include both minK and maxK
      const validStart = Math.min(lastMinPos, lastMaxPos);

      // Count valid subarrays ending at i
      // All starting indices from (leftBoundary + 1) to validStart are valid
      count += Math.max(0, validStart - leftBoundary);
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public long countSubarrays(int[] nums, int minK, int maxK) {
    int n = nums.length;
    long count = 0;

    // Track the most recent positions of minK and maxK
    int lastMinPos = -1;
    int lastMaxPos = -1;

    // Track the most recent invalid element (outside [minK, maxK])
    // This acts as the left boundary for valid subarrays
    int leftBoundary = -1;

    for (int i = 0; i < n; i++) {
        // Check if current element is outside the valid range
        if (nums[i] < minK || nums[i] > maxK) {
            // Reset everything - this element cannot be part of any valid subarray
            leftBoundary = i;
            lastMinPos = -1;
            lastMaxPos = -1;
            continue;
        }

        // Update the most recent positions of minK and maxK
        if (nums[i] == minK) {
            lastMinPos = i;
        }
        if (nums[i] == maxK) {
            lastMaxPos = i;
        }

        // If we have seen both minK and maxK since the last invalid element
        if (lastMinPos != -1 && lastMaxPos != -1) {
            // The starting index must be after leftBoundary and <= min(lastMinPos, lastMaxPos)
            // to include both minK and maxK
            int validStart = Math.min(lastMinPos, lastMaxPos);

            // Count valid subarrays ending at i
            // All starting indices from (leftBoundary + 1) to validStart are valid
            count += Math.max(0, validStart - leftBoundary);
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing constant-time operations at each position.
- Each element is processed exactly once.

**Space Complexity: O(1)**

- We use only a few integer variables to track positions, regardless of input size.
- No additional data structures that scale with input size.

## Common Mistakes

1. **Forgetting to reset tracking variables when encountering invalid elements**: When you see an element outside `[minK, maxK]`, you must reset `lastMinPos`, `lastMaxPos`, and update `leftBoundary`. Failing to do this will count invalid subarrays.

2. **Incorrect counting formula**: The number of valid subarrays ending at position `i` is `max(0, min(lastMinPos, lastMaxPos) - leftBoundary)`, not `i - leftBoundary` or other variations. You need the `min()` to ensure both `minK` and `maxK` are included.

3. **Using 0-based vs 1-based indexing incorrectly**: When `leftBoundary` is initialized to -1, `leftBoundary + 1` gives the first valid starting index (0 if no invalid elements yet). Some candidates initialize it to 0 and get off-by-one errors.

4. **Not handling the case when minK == maxK**: The algorithm works correctly even when `minK == maxK`, but some candidates write special logic that breaks in this case. The algorithm handles it naturally because when `minK == maxK`, we need the same value to appear in the subarray, and our tracking still works.

## When You'll See This Pattern

This "track last occurrence positions" pattern appears in several subarray counting problems:

1. **Count Number of Nice Subarrays (LeetCode 1248)**: Count subarrays with exactly k odd numbers. Similar tracking of boundary positions where conditions are met.

2. **Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit (LeetCode 1438)**: Uses monotonic deques to track min and max in sliding window, though the data structure is different.

3. **Subarrays with K Different Integers (LeetCode 992)**: Uses the "at most K" minus "at most K-1" technique with sliding window and last occurrence tracking.

The common theme is efficiently counting subarrays that satisfy certain constraints by tracking boundary positions where conditions become true/false.

## Key Takeaways

1. **For subarray counting problems, think about valid starting positions for each ending position**: Instead of checking all O(n²) subarrays, fix the ending position and count how many starting positions would make a valid subarray.

2. **Track boundary positions of important elements**: When you need elements with specific values (like minK and maxK), track their most recent occurrences. When you need to exclude certain elements, track the last invalid position.

3. **Invalid elements act as reset points**: Elements that violate constraints often break continuity, allowing you to reset tracking and process segments independently.

Related problems: [Count Number of Nice Subarrays](/problem/count-number-of-nice-subarrays), [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](/problem/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit), [Find the Number of Subarrays Where Boundary Elements Are Maximum](/problem/find-the-number-of-subarrays-where-boundary-elements-are-maximum)
