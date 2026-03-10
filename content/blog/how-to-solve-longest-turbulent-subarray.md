---
title: "How to Solve Longest Turbulent Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Turbulent Subarray. Medium difficulty, 48.9% acceptance rate. Topics: Array, Dynamic Programming, Sliding Window."
date: "2026-11-18"
category: "dsa-patterns"
tags: ["longest-turbulent-subarray", "array", "dynamic-programming", "sliding-window", "medium"]
---

# How to Solve Longest Turbulent Subarray

This problem asks us to find the longest contiguous subarray where the comparison between adjacent elements alternates between "greater than" and "less than" for every pair. What makes this interesting is that we're not just looking for monotonic sequences, but sequences where the direction flips at every step. The tricky part is handling the edge cases where adjacent elements are equal (which breaks the turbulent pattern) and efficiently tracking the alternating pattern without checking every possible subarray.

## Visual Walkthrough

Let's trace through an example: `arr = [9, 4, 2, 10, 7, 8, 8, 1, 9]`

We'll build our understanding step by step:

1. **Start at index 0**: Compare 9 and 4 → 9 > 4 (downward trend). Current turbulent length = 2.
2. **Index 1**: Compare 4 and 2 → 4 > 2 (downward again). Problem! We need alternating signs. The pattern broke, so we reset. New turbulent subarray starts at index 1: [4, 2]. Length = 2.
3. **Index 2**: Compare 2 and 10 → 2 < 10 (upward). Good alternation from previous downward. Current length = 3 (4, 2, 10).
4. **Index 3**: Compare 10 and 7 → 10 > 7 (downward). Good alternation from previous upward. Current length = 4 (4, 2, 10, 7).
5. **Index 4**: Compare 7 and 8 → 7 < 8 (upward). Good alternation from previous downward. Current length = 5 (4, 2, 10, 7, 8).
6. **Index 5**: Compare 8 and 8 → 8 == 8 (equal). This breaks the turbulent condition. Reset. New subarray starts at index 6: [8]. Length = 1.
7. **Index 6**: Compare 8 and 1 → 8 > 1 (downward). Current length = 2 (8, 1).
8. **Index 7**: Compare 1 and 9 → 1 < 9 (upward). Good alternation from previous downward. Current length = 3 (8, 1, 9).

The maximum length we found was 5 for subarray [4, 2, 10, 7, 8].

## Brute Force Approach

The most straightforward approach is to check every possible subarray to see if it's turbulent. For each starting index `i`, we would:

1. Initialize a variable to track the expected comparison sign (we don't know if it should start with > or <)
2. For each ending index `j` from `i+1` to `n-1`, check if `arr[j-1]` and `arr[j]` have the correct alternating relationship
3. Track the maximum length found

The problem with this approach is its time complexity: O(n³) in the worst case. For each starting index `i` (O(n)), we check each ending index `j` (O(n)), and for each subarray we might need to traverse it again to verify the turbulent condition (O(n)). Even with some optimizations, it would still be O(n²), which is too slow for typical constraints where `n` can be up to 40,000.

## Optimized Approach

The key insight is that we don't need to check every possible subarray. Instead, we can use a **dynamic programming** or **sliding window** approach where we maintain the current turbulent subarray length and extend it as long as the alternating pattern holds.

Think of it this way: at each position `i`, we're asking "What's the longest turbulent subarray ending at position `i`?" If we know the answer for position `i-1`, we can compute the answer for position `i` by checking:

- If `arr[i] > arr[i-1]` and the previous trend was downward (or we're starting fresh)
- If `arr[i] < arr[i-1]` and the previous trend was upward (or we're starting fresh)
- If `arr[i] == arr[i-1]`, the pattern breaks completely

We need to track two things:

1. `up`: length of turbulent subarray ending at `i` with an upward trend (arr[i] > arr[i-1])
2. `down`: length of turbulent subarray ending at `i` with a downward trend (arr[i] < arr[i-1])

At each step, we update these values based on the comparison between `arr[i]` and `arr[i-1]`:

- If `arr[i] > arr[i-1]`: `up = down + 1` (we extend the downward trend with an upward move)
- If `arr[i] < arr[i-1]`: `down = up + 1` (we extend the upward trend with a downward move)
- If equal: reset both to 1 (single element subarray)

The maximum turbulent length is the maximum of all `up` and `down` values we see.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxTurbulenceSize(arr):
    """
    Returns the length of the longest turbulent subarray.
    A turbulent subarray has alternating comparison signs between adjacent elements.
    """
    n = len(arr)

    # Base case: empty array or single element
    if n <= 1:
        return n

    # Initialize variables to track turbulent subarray lengths
    # up: length of turbulent subarray ending at current index with upward trend
    # down: length of turbulent subarray ending at current index with downward trend
    up = 1
    down = 1
    max_len = 1  # Track the maximum length found

    # Iterate through the array starting from the second element
    for i in range(1, n):
        if arr[i] > arr[i-1]:
            # Current element is greater than previous: upward trend
            # We can extend a downward-trending subarray with this upward move
            up = down + 1
            # Reset down since we can't have two upward moves in a row
            down = 1
        elif arr[i] < arr[i-1]:
            # Current element is less than previous: downward trend
            # We can extend an upward-trending subarray with this downward move
            down = up + 1
            # Reset up since we can't have two downward moves in a row
            up = 1
        else:
            # Equal elements break the turbulent pattern
            # Reset both to 1 (single element subarray)
            up = 1
            down = 1

        # Update the maximum length with the longer of up and down
        max_len = max(max_len, up, down)

    return max_len
```

```javascript
// Time: O(n) | Space: O(1)
function maxTurbulenceSize(arr) {
  /**
   * Returns the length of the longest turbulent subarray.
   * A turbulent subarray has alternating comparison signs between adjacent elements.
   */
  const n = arr.length;

  // Base case: empty array or single element
  if (n <= 1) {
    return n;
  }

  // Initialize variables to track turbulent subarray lengths
  // up: length of turbulent subarray ending at current index with upward trend
  // down: length of turbulent subarray ending at current index with downward trend
  let up = 1;
  let down = 1;
  let maxLen = 1; // Track the maximum length found

  // Iterate through the array starting from the second element
  for (let i = 1; i < n; i++) {
    if (arr[i] > arr[i - 1]) {
      // Current element is greater than previous: upward trend
      // We can extend a downward-trending subarray with this upward move
      up = down + 1;
      // Reset down since we can't have two upward moves in a row
      down = 1;
    } else if (arr[i] < arr[i - 1]) {
      // Current element is less than previous: downward trend
      // We can extend an upward-trending subarray with this downward move
      down = up + 1;
      // Reset up since we can't have two downward moves in a row
      up = 1;
    } else {
      // Equal elements break the turbulent pattern
      // Reset both to 1 (single element subarray)
      up = 1;
      down = 1;
    }

    // Update the maximum length with the longer of up and down
    maxLen = Math.max(maxLen, up, down);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maxTurbulenceSize(int[] arr) {
        /**
         * Returns the length of the longest turbulent subarray.
         * A turbulent subarray has alternating comparison signs between adjacent elements.
         */
        int n = arr.length;

        // Base case: empty array or single element
        if (n <= 1) {
            return n;
        }

        // Initialize variables to track turbulent subarray lengths
        // up: length of turbulent subarray ending at current index with upward trend
        // down: length of turbulent subarray ending at current index with downward trend
        int up = 1;
        int down = 1;
        int maxLen = 1;  // Track the maximum length found

        // Iterate through the array starting from the second element
        for (int i = 1; i < n; i++) {
            if (arr[i] > arr[i - 1]) {
                // Current element is greater than previous: upward trend
                // We can extend a downward-trending subarray with this upward move
                up = down + 1;
                // Reset down since we can't have two upward moves in a row
                down = 1;
            } else if (arr[i] < arr[i - 1]) {
                // Current element is less than previous: downward trend
                // We can extend an upward-trending subarray with this downward move
                down = up + 1;
                // Reset up since we can't have two downward moves in a row
                up = 1;
            } else {
                // Equal elements break the turbulent pattern
                // Reset both to 1 (single element subarray)
                up = 1;
                down = 1;
            }

            // Update the maximum length with the longer of up and down
            maxLen = Math.max(maxLen, Math.max(up, down));
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing constant-time operations at each step.
- The loop runs exactly `n-1` times (from index 1 to n-1).

**Space Complexity: O(1)**

- We use only a constant amount of extra space regardless of input size.
- The variables `up`, `down`, `max_len`, and loop counter `i` use O(1) space.
- We don't create any additional data structures proportional to the input size.

## Common Mistakes

1. **Forgetting to handle equal elements**: When `arr[i] == arr[i-1]`, the turbulent pattern breaks completely. Some candidates try to continue with the same trend or only reset one counter, but both `up` and `down` should be reset to 1.

2. **Incorrect initialization**: The minimum turbulent subarray length is 1 (a single element). Initializing `up` and `down` to 0 instead of 1 will undercount by 1 in all cases.

3. **Not tracking both trends**: Some candidates try to track only a single "current length" variable, but this fails because we need to know whether we ended with an upward or downward trend to decide if we can extend the subarray.

4. **Off-by-one errors in the loop**: Starting the loop at index 0 instead of 1 will cause index out of bounds when comparing `arr[i]` and `arr[i-1]`. Always verify your loop boundaries.

## When You'll See This Pattern

This problem uses a **state machine DP** approach where we maintain multiple states (up/down trends) and transition between them based on comparisons. You'll see similar patterns in:

1. **Maximum Subarray (Kadane's Algorithm)**: Both problems track the "best subarray ending at current position" and use it to compute the next position's answer.

2. **Longest Alternating Subarray**: Almost identical pattern but with simpler alternating conditions (often just checking if current differs from previous by 1).

3. **Best Time to Buy and Sell Stock with Cooldown**: Uses similar state transitions between "hold", "sell", and "cooldown" states.

4. **House Robber**: Maintains two states (rob current house or skip) and transitions between them based on adjacency constraints.

## Key Takeaways

1. **When you need to find the longest subarray satisfying some local condition**, consider tracking the "longest subarray ending at position i" as you iterate. This often leads to O(n) solutions.

2. **For alternating patterns**, maintain separate states for each possible ending condition (like up/down trends). The transition between states is determined by comparing adjacent elements.

3. **Equal elements often break alternating patterns completely**. Always check if your problem has special handling for equality cases.

Related problems: [Maximum Subarray](/problem/maximum-subarray), [Longest Alternating Subarray](/problem/longest-alternating-subarray)
