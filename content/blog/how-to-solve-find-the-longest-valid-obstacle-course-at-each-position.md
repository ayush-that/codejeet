---
title: "How to Solve Find the Longest Valid Obstacle Course at Each Position — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Longest Valid Obstacle Course at Each Position. Hard difficulty, 62.6% acceptance rate. Topics: Array, Binary Search, Binary Indexed Tree."
date: "2028-02-09"
category: "dsa-patterns"
tags:
  [
    "find-the-longest-valid-obstacle-course-at-each-position",
    "array",
    "binary-search",
    "binary-indexed-tree",
    "hard",
  ]
---

# How to Solve "Find the Longest Valid Obstacle Course at Each Position"

This problem asks us to find, for each position `i` in an array of obstacle heights, the length of the longest valid obstacle course ending at that position. A valid course must be non-decreasing: each obstacle must be at least as tall as the previous one. The challenge is we need to compute this for **every position simultaneously** in better than O(n²) time.

What makes this tricky: It's essentially asking for the Longest Non-Decreasing Subsequence (LNDS) ending at each position, but we need to compute all n answers efficiently. A naive O(n²) approach would time out for n up to 10⁵.

## Visual Walkthrough

Let's trace through `obstacles = [1, 2, 3, 2]`:

**Position 0 (height 1):**

- Only obstacle is [1]
- Longest course length = 1

**Position 1 (height 2):**

- Can extend from position 0 (1 ≤ 2)
- Course: [1, 2]
- Length = 2

**Position 2 (height 3):**

- Can extend from position 1 (2 ≤ 3)
- Course: [1, 2, 3]
- Length = 3

**Position 3 (height 2):**

- Cannot extend from position 2 (3 > 2)
- Can extend from position 0 (1 ≤ 2)
- Course: [1, 2] (not [1, 2, 3, 2] because 3 > 2)
- Length = 2

So the answer is `[1, 2, 3, 2]`.

The key insight: For each new height, we need to find the **longest sequence ending with a height ≤ current height**, then extend it.

## Brute Force Approach

The brute force solution checks all previous positions for each current position:

For each `i` from 0 to n-1:

1. Initialize `maxLen = 1` (just the current obstacle)
2. For each `j` from 0 to i-1:
   - If `obstacles[j] ≤ obstacles[i]`, we can extend the course ending at `j`
   - Update `maxLen = max(maxLen, dp[j] + 1)` where `dp[j]` is the longest course ending at `j`
3. Store `maxLen` in `dp[i]`

This is O(n²) time and O(n) space. For n = 10⁵, this would require ~10¹⁰ operations, which is far too slow.

## Optimized Approach

The optimization uses the same insight as the **Longest Increasing Subsequence (LIS)** problem: we can maintain a list that represents the **smallest possible ending height** for sequences of each length.

Here's the step-by-step reasoning:

1. **Observation**: For sequences of the same length, we only care about the one with the smallest ending height, because it's the most "extendable" to future obstacles.

2. **Maintain a "tails" list**: `tails[l]` stores the smallest possible ending height for a valid course of length `l+1` (using 0-based indexing).

3. **For each new height**:
   - Binary search in `tails` to find where this height belongs
   - We're looking for the **rightmost position** where we can place this height while keeping `tails` non-decreasing
   - This position tells us the longest sequence we can extend
   - If the position is at the end, we append to `tails` (found a longer sequence)
   - Otherwise, we update `tails[pos]` with the current height (found a better ending for this length)

4. **Why binary search works**: The `tails` array is always sorted because we maintain the "smallest ending height" property. When we process a new height `h`:
   - If `h` is ≥ last element: we can extend the longest sequence
   - Otherwise: find where `h` fits in `tails` and update that position

5. **Getting the answer**: The position where we insert/update in `tails` (plus 1) gives us the length of the longest valid course ending at the current position.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def longestObstacleCourseAtEachPosition(obstacles):
    """
    For each position, find the length of the longest non-decreasing
    obstacle course ending at that position.

    Approach: Similar to LIS (Longest Increasing Subsequence) but for
    non-decreasing sequences. We maintain a 'tails' array where
    tails[i] = smallest ending height for a sequence of length i+1.
    """
    n = len(obstacles)
    answer = [1] * n  # Each position has at least length 1 (itself)
    tails = []  # tails[i] = smallest ending height for sequence of length i+1

    for i, height in enumerate(obstacles):
        # Binary search to find where height belongs in tails
        left, right = 0, len(tails)

        # We want the rightmost position where we can place height
        # while keeping tails non-decreasing (find first > height)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] <= height:
                # height can extend sequence of length mid+1
                left = mid + 1
            else:
                # height is too small, look left
                right = mid

        # 'left' is the position where height should go
        if left == len(tails):
            # height extends the longest sequence
            tails.append(height)
        else:
            # We found a better (smaller) ending height for sequence of length left+1
            tails[left] = height

        # The length of longest sequence ending at i is left+1
        # (because tails is 0-indexed: position 0 = length 1)
        answer[i] = left + 1

    return answer
```

```javascript
// Time: O(n log n) | Space: O(n)
function longestObstacleCourseAtEachPosition(obstacles) {
  /**
   * For each position, find the length of the longest non-decreasing
   * obstacle course ending at that position.
   *
   * Approach: Similar to LIS but for non-decreasing sequences.
   * Maintain 'tails' array where tails[i] = smallest ending height
   * for a sequence of length i+1.
   */
  const n = obstacles.length;
  const answer = new Array(n).fill(1); // Each position has at least length 1
  const tails = []; // tails[i] = smallest ending height for sequence of length i+1

  for (let i = 0; i < n; i++) {
    const height = obstacles[i];

    // Binary search to find where height belongs in tails
    let left = 0;
    let right = tails.length;

    // Find first position where tails[pos] > height
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] <= height) {
        // height can extend sequence of length mid+1
        left = mid + 1;
      } else {
        // height is too small, look left
        right = mid;
      }
    }

    // 'left' is the position where height should go
    if (left === tails.length) {
      // height extends the longest sequence
      tails.push(height);
    } else {
      // Found better ending height for sequence of length left+1
      tails[left] = height;
    }

    // Length of longest sequence ending at i is left+1
    answer[i] = left + 1;
  }

  return answer;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int[] longestObstacleCourseAtEachPosition(int[] obstacles) {
        /**
         * For each position, find the length of the longest non-decreasing
         * obstacle course ending at that position.
         *
         * Approach: Similar to LIS but for non-decreasing sequences.
         * Maintain 'tails' list where tails.get(i) = smallest ending height
         * for a sequence of length i+1.
         */
        int n = obstacles.length;
        int[] answer = new int[n];
        List<Integer> tails = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            int height = obstacles[i];

            // Binary search to find where height belongs in tails
            int left = 0;
            int right = tails.size();

            // Find first position where tails.get(pos) > height
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails.get(mid) <= height) {
                    // height can extend sequence of length mid+1
                    left = mid + 1;
                } else {
                    // height is too small, look left
                    right = mid;
                }
            }

            // 'left' is the position where height should go
            if (left == tails.size()) {
                // height extends the longest sequence
                tails.add(height);
            } else {
                // Found better ending height for sequence of length left+1
                tails.set(left, height);
            }

            // Length of longest sequence ending at i is left+1
            answer[i] = left + 1;
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- We process each of the n obstacles once
- For each obstacle, we perform a binary search on the `tails` array, which takes O(log k) where k ≤ n
- Total: O(n log n)

**Space Complexity: O(n)**

- We store the answer array of size n
- We store the `tails` array which can grow up to size n in the worst case (strictly increasing heights)
- Total: O(n)

## Common Mistakes

1. **Using ≤ instead of < in binary search**: When searching for where to place the current height, we need to find the first element **greater than** the current height (for the non-decreasing version). Using the wrong comparison can lead to incorrect sequence lengths.

2. **Forgetting to handle the append case**: When the current height is ≥ all elements in `tails`, we need to append it. Failing to check `if left == len(tails)` will cause index errors.

3. **Confusing sequence length with array index**: The position in `tails` is 0-indexed, but it represents sequences of length `position + 1`. A common mistake is to store `left` instead of `left + 1` in the answer array.

4. **Using the standard LIS algorithm without modification**: The standard LIS algorithm finds strictly increasing sequences. For non-decreasing sequences (allowing equal heights), we need to modify the binary search to use `≤` instead of `<` when comparing to `tails[mid]`.

## When You'll See This Pattern

This pattern appears whenever you need to find the **longest increasing/non-decreasing subsequence** or variations of it:

1. **Longest Increasing Subsequence (LeetCode 300)**: The classic problem that introduces this pattern. The only difference is strict vs. non-strict comparison.

2. **Russian Doll Envelopes (LeetCode 354)**: Requires finding the longest sequence of envelopes that can be nested. It uses the same LIS approach but in 2D (sort by one dimension, then find LIS on the other).

3. **Maximum Profit in Job Scheduling (LeetCode 1235)**: While not exactly LIS, it uses similar dynamic programming with binary search to find compatible previous jobs.

The core technique is **maintaining the smallest possible ending element for sequences of each length** and using **binary search** to efficiently find where new elements belong.

## Key Takeaways

1. **The LIS pattern is versatile**: It solves not just the classic LIS problem, but any problem where you need to find the longest sequence satisfying some ordering constraint.

2. **Binary search on a maintained array**: When you need to find "the longest sequence ending with property X," consider maintaining an array of optimal ending values and using binary search to find where new elements fit.

3. **Non-decreasing vs. increasing matters**: Pay close attention to whether the problem requires strictly increasing (use `<`) or non-decreasing (use `≤`) comparisons in your binary search.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence)
