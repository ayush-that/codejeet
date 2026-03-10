---
title: "How to Solve Number of Subarrays with Bounded Maximum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Subarrays with Bounded Maximum. Medium difficulty, 54.7% acceptance rate. Topics: Array, Two Pointers."
date: "2027-08-26"
category: "dsa-patterns"
tags: ["number-of-subarrays-with-bounded-maximum", "array", "two-pointers", "medium"]
---

# How to Solve Number of Subarrays with Bounded Maximum

This problem asks us to count contiguous subarrays where the maximum element falls within a given range `[left, right]`. What makes this tricky is that we need to efficiently count subarrays without actually checking every possible subarray's maximum, which would be too slow. The key insight is that we can track how many subarrays are valid as we iterate through the array.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 1, 4, 3]`, `left = 2`, `right = 3`

We need to count subarrays where the maximum is 2 or 3. Let's think about what happens as we process each element:

1. **Element 2 (index 0)**: Value 2 is within range [2,3]
   - Subarrays ending at index 0: `[2]` ✓
   - Count so far: 1

2. **Element 1 (index 1)**: Value 1 is below range
   - Subarrays ending at index 1: `[1]` ✗ (max=1), `[2,1]` ✗ (max=2) ✓
   - Wait, `[2,1]` has max=2 which is in range! So we can extend valid subarrays from previous index
   - Count so far: 1 + 1 = 2

3. **Element 4 (index 2)**: Value 4 is above range
   - Any subarray containing 4 will have max ≥ 4, so none are valid
   - We need to reset our counting
   - Count so far: 2 + 0 = 2

4. **Element 3 (index 3)**: Value 3 is within range
   - Subarrays ending at index 3: `[3]` ✓, `[4,3]` ✗, `[1,4,3]` ✗, `[2,1,4,3]` ✗
   - Only `[3]` is valid since 4 breaks the chain
   - Count so far: 2 + 1 = 3

The answer is 3. Valid subarrays are: `[2]`, `[2,1]`, `[3]`

Notice the pattern: when we see a value within range, we can extend all subarrays from the previous valid position. When we see a value below range, we can extend but not start new ones. When we see a value above range, we need to reset completely.

## Brute Force Approach

The most straightforward approach is to check every possible subarray:

1. Generate all contiguous subarrays (n\*(n+1)/2 of them)
2. For each subarray, find its maximum
3. Check if the maximum is within [left, right]
4. Count the valid ones

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def numSubarrayBoundedMaxBrute(nums, left, right):
    n = len(nums)
    count = 0

    # Generate all subarrays
    for i in range(n):
        for j in range(i, n):
            # Find maximum in subarray nums[i:j+1]
            max_val = float('-inf')
            for k in range(i, j + 1):
                max_val = max(max_val, nums[k])

            # Check if maximum is in range
            if left <= max_val <= right:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function numSubarrayBoundedMaxBrute(nums, left, right) {
  let count = 0;
  const n = nums.length;

  // Generate all subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Find maximum in subarray nums[i..j]
      let maxVal = -Infinity;
      for (let k = i; k <= j; k++) {
        maxVal = Math.max(maxVal, nums[k]);
      }

      // Check if maximum is in range
      if (maxVal >= left && maxVal <= right) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int numSubarrayBoundedMaxBrute(int[] nums, int left, int right) {
    int count = 0;
    int n = nums.length;

    // Generate all subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Find maximum in subarray nums[i..j]
            int maxVal = Integer.MIN_VALUE;
            for (int k = i; k <= j; k++) {
                maxVal = Math.max(maxVal, nums[k]);
            }

            // Check if maximum is in range
            if (maxVal >= left && maxVal <= right) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails**: With O(n³) time complexity, this solution times out for arrays with just a few hundred elements. We need something closer to O(n).

## Optimized Approach

The key insight is that we don't need to check every subarray explicitly. Instead, we can track how many valid subarrays end at each position:

1. **Three categories of numbers**:
   - Numbers > right: These act as "breakers" - no subarray containing them can be valid
   - Numbers in [left, right]: These are "valid starters" - they can start new valid subarrays
   - Numbers < left: These are "extenders" - they can extend existing valid subarrays but can't start new ones

2. **Tracking strategy**:
   - Keep track of the last position where we saw a "breaker" (value > right)
   - Keep track of the last position where we saw a "valid starter" (value in [left, right])
   - For each position i, the number of valid subarrays ending at i is:
     - 0 if nums[i] > right (it's a breaker)
     - (i - last_breaker) if nums[i] is in range (can extend all subarrays since last breaker)
     - (last_valid - last_breaker) if nums[i] < left (can only extend subarrays that already had a valid max)

3. **Why this works**:
   - When we see a valid number, all subarrays from (last_breaker + 1) to i are valid
   - When we see a small number, we can only extend subarrays that already had a valid max
   - When we see a large number, we reset everything

## Optimal Solution

Here's the efficient O(n) solution using the counting strategy:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numSubarrayBoundedMax(nums, left, right):
    """
    Count subarrays where maximum is in [left, right].

    Strategy: Track last position where we saw:
    1. A value > right (breaker index)
    2. A value in [left, right] (valid index)

    For each position i:
    - If nums[i] > right: reset both trackers to i
    - If nums[i] in [left, right]: update valid index to i
    - Count subarrays ending at i as (valid index - breaker index)
    """
    count = 0
    last_breaker = -1  # Last index where nums[i] > right
    last_valid = -1    # Last index where left <= nums[i] <= right

    for i in range(len(nums)):
        if nums[i] > right:
            # Current element breaks all subarrays containing it
            last_breaker = i
            last_valid = i  # Reset valid index too
        elif nums[i] >= left:
            # Current element is valid, can start new subarrays
            last_valid = i

        # Count subarrays ending at current position
        # If current element < left, we can only extend existing valid subarrays
        # If current element is valid, we count all subarrays since last breaker
        count += (last_valid - last_breaker)

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function numSubarrayBoundedMax(nums, left, right) {
  /**
   * Count subarrays where maximum is in [left, right].
   *
   * Strategy: Track last position where we saw:
   * 1. A value > right (breaker index)
   * 2. A value in [left, right] (valid index)
   *
   * For each position i:
   * - If nums[i] > right: reset both trackers to i
   * - If nums[i] in [left, right]: update valid index to i
   * - Count subarrays ending at i as (valid index - breaker index)
   */
  let count = 0;
  let lastBreaker = -1; // Last index where nums[i] > right
  let lastValid = -1; // Last index where left <= nums[i] <= right

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > right) {
      // Current element breaks all subarrays containing it
      lastBreaker = i;
      lastValid = i; // Reset valid index too
    } else if (nums[i] >= left) {
      // Current element is valid, can start new subarrays
      lastValid = i;
    }

    // Count subarrays ending at current position
    // If current element < left, we can only extend existing valid subarrays
    // If current element is valid, we count all subarrays since last breaker
    count += lastValid - lastBreaker;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int numSubarrayBoundedMax(int[] nums, int left, int right) {
    /**
     * Count subarrays where maximum is in [left, right].
     *
     * Strategy: Track last position where we saw:
     * 1. A value > right (breaker index)
     * 2. A value in [left, right] (valid index)
     *
     * For each position i:
     * - If nums[i] > right: reset both trackers to i
     * - If nums[i] in [left, right]: update valid index to i
     * - Count subarrays ending at i as (valid index - breaker index)
     */
    int count = 0;
    int lastBreaker = -1;  // Last index where nums[i] > right
    int lastValid = -1;    // Last index where left <= nums[i] <= right

    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > right) {
            // Current element breaks all subarrays containing it
            lastBreaker = i;
            lastValid = i;  // Reset valid index too
        } else if (nums[i] >= left) {
            // Current element is valid, can start new subarrays
            lastValid = i;
        }

        // Count subarrays ending at current position
        // If current element < left, we can only extend existing valid subarrays
        // If current element is valid, we count all subarrays since last breaker
        count += (lastValid - lastBreaker);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We make a single pass through the array, performing constant-time operations at each position
- The loop runs exactly n times, where n is the length of nums

**Space Complexity**: O(1)

- We only use a few integer variables (count, last_breaker, last_valid)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to reset both indices when encountering a breaker**: When you see nums[i] > right, you need to reset both last_breaker AND last_valid to i. If you only reset last_breaker, last_valid might point to an index before the breaker, leading to incorrect counts.

2. **Incorrect counting logic for numbers < left**: The trickiest part is understanding that when nums[i] < left, the number of valid subarrays ending at i equals the number of valid subarrays ending at i-1 (if i-1 was valid). This is captured by `last_valid - last_breaker`.

3. **Off-by-one errors with index initialization**: Starting last_breaker and last_valid at -1 is crucial because it represents "no breaker/valid seen yet". If you start at 0, you'll miscount for the first element.

4. **Confusing subarray counting**: Remember we're counting subarrays **ending** at each position, not starting. The formula `last_valid - last_breaker` gives us exactly the number of valid starting points for subarrays ending at current position.

## When You'll See This Pattern

This "count valid subarrays ending at each position" pattern appears in many array counting problems:

1. **Count Subarrays With Median K (Hard)**: Similar idea of tracking valid subarrays as you iterate, though with more complex median calculation.

2. **Find the Number of Subarrays Where Boundary Elements Are Maximum (Hard)**: Uses similar tracking of "breaker" elements that limit subarray validity.

3. **Subarray Product Less Than K (Medium)**: Uses a sliding window to count subarrays with product < k, similar to tracking valid ranges.

4. **Number of Subarrays with Bounded Maximum is essentially this problem**: The pattern of tracking last invalid position and last valid position is reusable.

The core technique is: instead of checking all subarrays, track how the validity of subarrays changes as you extend them element by element.

## Key Takeaways

1. **Think in terms of subarrays ending at each position**: Many array counting problems become simpler when you count how many valid subarrays end at each index rather than trying to count all subarrays at once.

2. **Use "breaker" and "valid" trackers**: When a problem has elements that invalidate subarrays (like values > right here), track the last such "breaker". When elements can validate subarrays, track the last such "valid" element.

3. **The formula `valid - breaker` often gives the count**: For problems where you need to count subarrays with some property, the difference between a "valid start" index and an "invalid start" index frequently gives the number of valid subarrays ending at current position.

Related problems: [Count Subarrays With Median K](/problem/count-subarrays-with-median-k), [Find the Number of Subarrays Where Boundary Elements Are Maximum](/problem/find-the-number-of-subarrays-where-boundary-elements-are-maximum)
