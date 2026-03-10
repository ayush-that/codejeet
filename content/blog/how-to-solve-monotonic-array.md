---
title: "How to Solve Monotonic Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Monotonic Array. Easy difficulty, 62.2% acceptance rate. Topics: Array."
date: "2027-03-27"
category: "dsa-patterns"
tags: ["monotonic-array", "array", "easy"]
---

# How to Solve Monotonic Array

Determining whether an array is monotonic seems straightforward at first glance, but it's a classic example of a problem where the implementation details matter more than the concept. The tricky part isn't understanding what monotonic means, but rather writing clean, efficient code that handles edge cases properly while avoiding common pitfalls like premature conclusions or redundant checks.

## Visual Walkthrough

Let's trace through the example `[1, 3, 2, 4]` to build intuition:

1. **Initial observation**: The first two elements `[1, 3]` suggest the array might be increasing (since 1 < 3)
2. **Check third element**: `2` is less than the previous element `3`, so the increasing hypothesis fails
3. **Check decreasing**: `2` is not greater than `3`, so the decreasing hypothesis also fails
4. **Conclusion**: The array is not monotonic because we found both an increase (1→3) and a decrease (3→2)

Now let's trace a monotonic increasing example `[1, 2, 2, 3, 4]`:

1. **First comparison**: 1 ≤ 2 ✓
2. **Second comparison**: 2 ≤ 2 ✓ (equal values are allowed in monotonic increasing)
3. **Third comparison**: 2 ≤ 3 ✓
4. **Fourth comparison**: 3 ≤ 4 ✓
5. **Conclusion**: All adjacent pairs satisfy the non-decreasing condition

The key insight is that we don't need to compare every possible pair `(i, j)` where `i ≤ j` — we only need to check adjacent elements! If `nums[i] ≤ nums[i+1]` for all `i`, then by transitivity, `nums[i] ≤ nums[j]` for all `i ≤ j`.

## Brute Force Approach

A truly brute force approach would check every pair `(i, j)` where `i ≤ j`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def isMonotonicBruteForce(nums):
    n = len(nums)

    # Check if monotone increasing
    increasing = True
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] > nums[j]:
                increasing = False
                break
        if not increasing:
            break

    # Check if monotone decreasing
    decreasing = True
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] < nums[j]:
                decreasing = False
                break
        if not decreasing:
            break

    return increasing or decreasing
```

```javascript
// Time: O(n²) | Space: O(1)
function isMonotonicBruteForce(nums) {
  const n = nums.length;

  // Check if monotone increasing
  let increasing = true;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] > nums[j]) {
        increasing = false;
        break;
      }
    }
    if (!increasing) break;
  }

  // Check if monotone decreasing
  let decreasing = true;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] < nums[j]) {
        decreasing = false;
        break;
      }
    }
    if (!decreasing) break;
  }

  return increasing || decreasing;
}
```

```java
// Time: O(n²) | Space: O(1)
public boolean isMonotonicBruteForce(int[] nums) {
    int n = nums.length;

    // Check if monotone increasing
    boolean increasing = true;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] > nums[j]) {
                increasing = false;
                break;
            }
        }
        if (!increasing) break;
    }

    // Check if monotone decreasing
    boolean decreasing = true;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] < nums[j]) {
                decreasing = false;
                break;
            }
        }
        if (!decreasing) break;
    }

    return increasing || decreasing;
}
```

</div>

**Why this is inefficient**: The brute force approach runs in O(n²) time, which is unacceptable for large arrays. We're doing redundant work by comparing every pair when we only need to check adjacent elements.

## Optimal Solution

The optimal solution uses a single pass through the array, tracking whether we've seen evidence of increasing or decreasing patterns. We initialize two boolean flags and update them as we encounter comparisons between adjacent elements.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isMonotonic(nums):
    """
    Determines if an array is monotonic (either entirely non-increasing or non-decreasing).

    Args:
        nums: List of integers to check

    Returns:
        True if the array is monotonic, False otherwise
    """
    n = len(nums)

    # Edge case: arrays with 0 or 1 element are always monotonic
    if n <= 1:
        return True

    # Initialize flags to track monotonic properties
    increasing = True  # Assume it's increasing until proven otherwise
    decreasing = True  # Assume it's decreasing until proven otherwise

    # Iterate through the array, comparing each element with the next
    for i in range(n - 1):  # Stop at n-1 to avoid index out of bounds
        current = nums[i]
        next_num = nums[i + 1]

        # If current > next, array cannot be increasing
        if current > next_num:
            increasing = False

        # If current < next, array cannot be decreasing
        if current < next_num:
            decreasing = False

        # Early exit: if both flags are False, array is definitely not monotonic
        if not increasing and not decreasing:
            return False

    # Array is monotonic if it's either entirely non-increasing OR non-decreasing
    return increasing or decreasing
```

```javascript
// Time: O(n) | Space: O(1)
function isMonotonic(nums) {
  /**
   * Determines if an array is monotonic (either entirely non-increasing or non-decreasing).
   *
   * @param {number[]} nums - Array of integers to check
   * @return {boolean} True if the array is monotonic, False otherwise
   */
  const n = nums.length;

  // Edge case: arrays with 0 or 1 element are always monotonic
  if (n <= 1) {
    return true;
  }

  // Initialize flags to track monotonic properties
  let increasing = true; // Assume it's increasing until proven otherwise
  let decreasing = true; // Assume it's decreasing until proven otherwise

  // Iterate through the array, comparing each element with the next
  for (let i = 0; i < n - 1; i++) {
    // Stop at n-1 to avoid index out of bounds
    const current = nums[i];
    const next = nums[i + 1];

    // If current > next, array cannot be increasing
    if (current > next) {
      increasing = false;
    }

    // If current < next, array cannot be decreasing
    if (current < next) {
      decreasing = false;
    }

    // Early exit: if both flags are False, array is definitely not monotonic
    if (!increasing && !decreasing) {
      return false;
    }
  }

  // Array is monotonic if it's either entirely non-increasing OR non-decreasing
  return increasing || decreasing;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean isMonotonic(int[] nums) {
    /**
     * Determines if an array is monotonic (either entirely non-increasing or non-decreasing).
     *
     * @param nums Array of integers to check
     * @return True if the array is monotonic, False otherwise
     */
    int n = nums.length;

    // Edge case: arrays with 0 or 1 element are always monotonic
    if (n <= 1) {
        return true;
    }

    // Initialize flags to track monotonic properties
    boolean increasing = true;  // Assume it's increasing until proven otherwise
    boolean decreasing = true;  // Assume it's decreasing until proven otherwise

    // Iterate through the array, comparing each element with the next
    for (int i = 0; i < n - 1; i++) {  // Stop at n-1 to avoid index out of bounds
        int current = nums[i];
        int next = nums[i + 1];

        // If current > next, array cannot be increasing
        if (current > next) {
            increasing = false;
        }

        // If current < next, array cannot be decreasing
        if (current < next) {
            decreasing = false;
        }

        // Early exit: if both flags are False, array is definitely not monotonic
        if (!increasing && !decreasing) {
            return false;
        }
    }

    // Array is monotonic if it's either entirely non-increasing OR non-decreasing
    return increasing || decreasing;
}
```

</div>

**Key insights in this solution:**

1. **Single pass**: We traverse the array only once, comparing each element with its successor
2. **Two flags**: We maintain separate flags for increasing and decreasing possibilities
3. **Early exit**: Once both flags become false, we know the array cannot be monotonic
4. **Equal elements**: When `current == next`, neither flag gets updated, which is correct since equal elements don't violate either monotonic property

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations for each element
- The early exit optimization doesn't change the worst-case complexity but improves average-case performance

**Space Complexity: O(1)**

- We use only a constant amount of extra space (two boolean variables)
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting edge cases**: Many candidates forget that arrays with 0 or 1 element are trivially monotonic. Always check for these cases first.

2. **Incorrect comparison logic**: Some candidates try to determine direction first, then check consistency. For example:

   ```python
   # WRONG approach
   if nums[0] < nums[1]:
       direction = "increasing"
   elif nums[0] > nums[1]:
       direction = "decreasing"
   else:
       # What if all elements are equal? This logic fails
   ```

   This fails for arrays like `[1, 1, 1, 2]` where the first comparison doesn't reveal the direction.

3. **Off-by-one errors**: When iterating and comparing `nums[i]` with `nums[i+1]`, the loop should run until `i < n-1`, not `i < n`. Accessing `nums[n]` would cause an index out of bounds error.

4. **Overcomplicating with separate passes**: Some candidates write separate loops to check increasing and decreasing cases. While this is still O(n), it's less efficient than the single-pass approach and violates the DRY (Don't Repeat Yourself) principle.

## When You'll See This Pattern

The "two flags with early exit" pattern appears in several array validation problems:

1. **Valid Mountain Array (LeetCode 941)**: Similar logic but with stricter requirements - must increase then decrease, with no plateaus allowed at the peak.

2. **Non-decreasing Array (LeetCode 665)**: A variation where you're allowed to modify at most one element to make the array non-decreasing. The monotonic check is part of the solution.

3. **Wiggle Sort (LeetCode 280)**: Requires alternating comparisons (up, down, up, down...), which uses similar pairwise comparison logic but with alternating conditions.

The core pattern is: **when validating a global property of an array based on pairwise relationships, you often only need to check adjacent elements and maintain state flags**.

## Key Takeaways

1. **Transitivity is your friend**: For monotonic properties, checking adjacent pairs is sufficient due to mathematical transitivity. If `a ≤ b` and `b ≤ c`, then `a ≤ c`.

2. **Two flags simplify logic**: Instead of trying to determine direction upfront, maintain both possibilities and eliminate them as you encounter contradictory evidence.

3. **Early exits optimize**: Once you know an answer is impossible (both flags false), you can return immediately rather than completing the iteration.

4. **Equal elements don't break monotonicity**: Remember that `≤` and `≥` allow equality, so sequences like `[1, 1, 2, 2]` are perfectly valid monotonic arrays.

Related problems: [Count Hills and Valleys in an Array](/problem/count-hills-and-valleys-in-an-array), [Find the Count of Monotonic Pairs I](/problem/find-the-count-of-monotonic-pairs-i)
