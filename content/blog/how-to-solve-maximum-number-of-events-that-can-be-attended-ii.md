---
title: "How to Solve Maximum Number of Events That Can Be Attended II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Events That Can Be Attended II. Hard difficulty, 63.6% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Sorting."
date: "2026-07-09"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-events-that-can-be-attended-ii",
    "array",
    "binary-search",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Maximum Number of Events That Can Be Attended II

You're given events with start days, end days, and values, and you can attend at most `k` events. The challenge is selecting events to maximize total value while ensuring no two selected events overlap in time. This is tricky because you need to consider both which events to pick and how many events you're allowed to pick, making it a two-dimensional optimization problem.

## Visual Walkthrough

Let's trace through a small example:  
`events = [[1,2,4],[3,4,3],[2,3,1]], k = 2`

First, we sort events by end day: `[[1,2,4],[2,3,1],[3,4,3]]`

Now let's think through the decisions:

- For event 0 (ends day 2, value 4): We can either take it or skip it
- If we take it, we can't take any event starting before day 3 next
- If we skip it, we can consider events starting earlier

The optimal path: Take event 0 (value 4), then event 2 (value 3) = total 7

Let's see why this works systematically:

1. After sorting, we process events in order of when they end
2. For each event, we have two choices: attend or skip
3. If we attend, we need to find the next event that starts after this one ends
4. We track both which event we're considering and how many events we've attended

This "choose or skip" pattern with a constraint on number of choices is classic dynamic programming.

## Brute Force Approach

A naive approach would try all combinations of up to `k` events:

1. Generate all subsets of events with size ≤ k
2. Check if events in each subset are non-overlapping
3. Calculate total value for valid subsets
4. Return the maximum value

This is exponential - O(2^n) time - and completely impractical for n up to 10^6. Even for small n, checking all combinations with the k constraint is complex.

What makes this particularly challenging is that we need to consider both:

- Which events to select (combinatorial choice)
- How many events we select (up to k constraint)

A slightly better brute force would use recursion: at each step, either take the current event (if we haven't reached k) and move to the next non-overlapping event, or skip it and move to the next event. This is still exponential in the worst case but gives us the right structure to optimize.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with two states:

1. Which event we're currently considering (index i)
2. How many events we've attended so far (count)

We can define `dp[i][count]` = maximum value we can get starting from event i having already attended count events.

For each event i, we have two choices:

1. **Skip event i**: Move to event i+1 with same count
2. **Take event i**: Add its value, then find the next event that starts after event i ends

The critical optimization is using **binary search** to find the next event. Since events are sorted by end day, we can binary search for the first event whose start day > current event's end day.

We also use **memoization** to avoid recomputing states, and we process events from last to first (bottom-up DP works too, but top-down is more intuitive).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n*k*log n) | Space: O(n*k)
def maxValue(events, k):
    """
    Main function to find maximum value from attending at most k events.

    Args:
        events: List of [start, end, value]
        k: Maximum number of events to attend

    Returns:
        Maximum total value achievable
    """
    # Step 1: Sort events by end day
    # This ensures when we process events, we know all "future" events end later
    events.sort(key=lambda x: x[1])

    n = len(events)

    # Step 2: Extract start, end, and value arrays for easier access
    starts = [events[i][0] for i in range(n)]
    ends = [events[i][1] for i in range(n)]
    values = [events[i][2] for i in range(n)]

    # Step 3: Create memoization table
    # dp[i][count] = max value starting from event i with count events taken
    # We use -1 to indicate uncomputed states
    dp = [[-1] * (k + 1) for _ in range(n)]

    def binary_search_next_event(current_end):
        """
        Find the index of the first event that starts after current_end.

        Args:
            current_end: The end day of the current event

        Returns:
            Index of next non-overlapping event, or n if none exists
        """
        left, right = 0, n - 1
        next_idx = n  # Default: no next event

        while left <= right:
            mid = (left + right) // 2
            if starts[mid] > current_end:
                # This event starts after current_end, so it's a candidate
                next_idx = mid
                # Try to find an earlier one that also works
                right = mid - 1
            else:
                # This event starts too early (overlaps)
                left = mid + 1

        return next_idx

    def dfs(i, count):
        """
        Recursive function with memoization.

        Args:
            i: Current event index
            count: Number of events attended so far

        Returns:
            Maximum value achievable from this state
        """
        # Base cases: no more events or reached maximum count
        if i >= n or count == k:
            return 0

        # Return memoized result if already computed
        if dp[i][count] != -1:
            return dp[i][count]

        # Option 1: Skip current event
        skip = dfs(i + 1, count)

        # Option 2: Take current event (if we haven't reached k)
        # Find next event that doesn't overlap
        next_event_idx = binary_search_next_event(ends[i])
        take = values[i] + dfs(next_event_idx, count + 1)

        # Store and return the better option
        dp[i][count] = max(skip, take)
        return dp[i][count]

    # Start from first event with 0 events taken
    return dfs(0, 0)
```

```javascript
// Time: O(n*k*log n) | Space: O(n*k)
function maxValue(events, k) {
  /**
   * Main function to find maximum value from attending at most k events.
   *
   * @param {number[][]} events - Array of [start, end, value]
   * @param {number} k - Maximum number of events to attend
   * @return {number} Maximum total value achievable
   */

  // Step 1: Sort events by end day
  events.sort((a, b) => a[1] - b[1]);

  const n = events.length;

  // Step 2: Extract start, end, and value arrays for easier access
  const starts = events.map((event) => event[0]);
  const ends = events.map((event) => event[1]);
  const values = events.map((event) => event[2]);

  // Step 3: Create memoization table
  // dp[i][count] = max value starting from event i with count events taken
  // We use -1 to indicate uncomputed states
  const dp = Array(n)
    .fill()
    .map(() => Array(k + 1).fill(-1));

  /**
   * Find the index of the first event that starts after current_end.
   *
   * @param {number} currentEnd - The end day of the current event
   * @return {number} Index of next non-overlapping event, or n if none exists
   */
  function binarySearchNextEvent(currentEnd) {
    let left = 0,
      right = n - 1;
    let nextIdx = n; // Default: no next event

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (starts[mid] > currentEnd) {
        // This event starts after currentEnd, so it's a candidate
        nextIdx = mid;
        // Try to find an earlier one that also works
        right = mid - 1;
      } else {
        // This event starts too early (overlaps)
        left = mid + 1;
      }
    }

    return nextIdx;
  }

  /**
   * Recursive function with memoization.
   *
   * @param {number} i - Current event index
   * @param {number} count - Number of events attended so far
   * @return {number} Maximum value achievable from this state
   */
  function dfs(i, count) {
    // Base cases: no more events or reached maximum count
    if (i >= n || count === k) {
      return 0;
    }

    // Return memoized result if already computed
    if (dp[i][count] !== -1) {
      return dp[i][count];
    }

    // Option 1: Skip current event
    const skip = dfs(i + 1, count);

    // Option 2: Take current event (if we haven't reached k)
    // Find next event that doesn't overlap
    const nextEventIdx = binarySearchNextEvent(ends[i]);
    const take = values[i] + dfs(nextEventIdx, count + 1);

    // Store and return the better option
    dp[i][count] = Math.max(skip, take);
    return dp[i][count];
  }

  // Start from first event with 0 events taken
  return dfs(0, 0);
}
```

```java
// Time: O(n*k*log n) | Space: O(n*k)
import java.util.Arrays;

class Solution {
    public int maxValue(int[][] events, int k) {
        /**
         * Main function to find maximum value from attending at most k events.
         *
         * @param events Array of [start, end, value]
         * @param k Maximum number of events to attend
         * @return Maximum total value achievable
         */

        // Step 1: Sort events by end day
        Arrays.sort(events, (a, b) -> Integer.compare(a[1], b[1]));

        int n = events.length;

        // Step 2: Extract start, end, and value arrays for easier access
        int[] starts = new int[n];
        int[] ends = new int[n];
        int[] values = new int[n];

        for (int i = 0; i < n; i++) {
            starts[i] = events[i][0];
            ends[i] = events[i][1];
            values[i] = events[i][2];
        }

        // Step 3: Create memoization table
        // dp[i][count] = max value starting from event i with count events taken
        // We use -1 to indicate uncomputed states
        int[][] dp = new int[n][k + 1];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dp[i], -1);
        }

        // Start from first event with 0 events taken
        return dfs(0, 0, starts, ends, values, dp, n, k);
    }

    /**
     * Find the index of the first event that starts after currentEnd.
     *
     * @param starts Array of event start days
     * @param currentEnd The end day of the current event
     * @param n Total number of events
     * @return Index of next non-overlapping event, or n if none exists
     */
    private int binarySearchNextEvent(int[] starts, int currentEnd, int n) {
        int left = 0, right = n - 1;
        int nextIdx = n;  // Default: no next event

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (starts[mid] > currentEnd) {
                // This event starts after currentEnd, so it's a candidate
                nextIdx = mid;
                // Try to find an earlier one that also works
                right = mid - 1;
            } else {
                // This event starts too early (overlaps)
                left = mid + 1;
            }
        }

        return nextIdx;
    }

    /**
     * Recursive function with memoization.
     *
     * @param i Current event index
     * @param count Number of events attended so far
     * @param starts Array of event start days
     * @param ends Array of event end days
     * @param values Array of event values
     * @param dp Memoization table
     * @param n Total number of events
     * @param k Maximum number of events to attend
     * @return Maximum value achievable from this state
     */
    private int dfs(int i, int count, int[] starts, int[] ends, int[] values,
                   int[][] dp, int n, int k) {
        // Base cases: no more events or reached maximum count
        if (i >= n || count == k) {
            return 0;
        }

        // Return memoized result if already computed
        if (dp[i][count] != -1) {
            return dp[i][count];
        }

        // Option 1: Skip current event
        int skip = dfs(i + 1, count, starts, ends, values, dp, n, k);

        // Option 2: Take current event (if we haven't reached k)
        // Find next event that doesn't overlap
        int nextEventIdx = binarySearchNextEvent(starts, ends[i], n);
        int take = values[i] + dfs(nextEventIdx, count + 1, starts, ends, values, dp, n, k);

        // Store and return the better option
        dp[i][count] = Math.max(skip, take);
        return dp[i][count];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × k × log n)**

- Sorting events: O(n log n)
- For each state (n × k possible states), we do a binary search: O(log n)
- Total: O(n log n + n × k × log n) = O(n × k × log n)

**Space Complexity: O(n × k)**

- Memoization table stores n × k states
- Recursion stack depth: O(n) in worst case
- Additional arrays for starts, ends, values: O(n)

The n × k factor comes from having two dimensions in our DP state: which event we're considering and how many we've taken. The log n factor comes from binary searching for the next non-overlapping event.

## Common Mistakes

1. **Not sorting by end day**: If you sort by start day instead, you can't efficiently find the next non-overlapping event using binary search. The "next event" depends on when the current event ends, not when it starts.

2. **Forgetting to handle the k constraint in DP state**: Some candidates try to use 1D DP (dp[i] = max value considering first i events), but this doesn't track how many events have been taken. You need both i and count as dimensions.

3. **Incorrect binary search for next event**: The search should find the first event with start > current_end (not ≥). Using ≥ would select overlapping events. Also, remember to handle the case where no such event exists (return n, not -1).

4. **Not using memoization or using it incorrectly**: With n up to 10^6 and k up to 10^6, we can't store n×k table entirely. In practice, constraints are smaller, but forgetting memoization leads to exponential time. Also, using 0 instead of -1 for uncomputed states can be wrong if 0 is a valid result.

## When You'll See This Pattern

This "choose or skip with constraint" pattern appears in many scheduling and selection problems:

1. **Maximum Profit in Job Scheduling** (LeetCode 1235): Similar structure with jobs having start, end, and profit. You choose jobs to maximize profit with no overlap.

2. **Maximum Earnings From Taxi** (LeetCode 2008): Pickup/dropoff with fares, maximize earnings. Same "take or skip" DP with binary search for next valid option.

3. **Two Best Non-Overlapping Events** (LeetCode 2054): Simpler version with k=2, but same core idea of selecting non-overlapping events.

The pattern is: when you have items with time intervals and values, and you need to select a limited number without overlap, think "DP with binary search" after sorting by end time.

## Key Takeaways

1. **Sort by end time for interval selection problems**: This enables efficient finding of next non-overlapping interval via binary search.

2. **DP state often needs to track both position and count**: When you have a constraint on how many items to select, add that constraint as a dimension in your DP state.

3. **Binary search is your friend for "next valid option"**: After sorting, use binary search to jump to the next compatible item instead of linear scan.

**Related problems**: [Maximum Number of Events That Can Be Attended](/problem/maximum-number-of-events-that-can-be-attended), [Maximum Earnings From Taxi](/problem/maximum-earnings-from-taxi), [Two Best Non-Overlapping Events](/problem/two-best-non-overlapping-events)
