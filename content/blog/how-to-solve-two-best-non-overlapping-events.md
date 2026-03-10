---
title: "How to Solve Two Best Non-Overlapping Events — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Two Best Non-Overlapping Events. Medium difficulty, 64.0% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Sorting, Heap (Priority Queue)."
date: "2026-04-24"
category: "dsa-patterns"
tags: ["two-best-non-overlapping-events", "array", "binary-search", "dynamic-programming", "medium"]
---

# How to Solve Two Best Non-Overlapping Events

You're given a list of events with start times, end times, and values, and you need to select at most two non-overlapping events to maximize the total value. The challenge is that you can't just pick the two highest-value events—they might overlap, and you need to efficiently search through all possible pairs while respecting the non-overlapping constraint.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `events = [[1,3,2],[4,5,2],[2,4,3],[7,10,1]]`

**Step 1: Sort events by end time**
Sorted: `[[1,3,2],[2,4,3],[4,5,2],[7,10,1]]`
Why sort by end time? This lets us use binary search to find the next non-overlapping event efficiently.

**Step 2: Process each event as a potential second event**
We'll maintain the best value we can get from a single event ending at or before each point.

- Event 0 `[1,3,2]`: No earlier events. Best single event value = 2
- Event 1 `[2,4,3]`: Find last event ending before time 2 (start time of current event). Event 0 ends at 3, which is not < 2. So no non-overlapping event before it. Best single event value = max(2, 3) = 3
- Event 2 `[4,5,2]`: Find last event ending before time 4. Event 1 ends at 4, which is not < 4. Event 0 ends at 3, which is < 4. So we can pair with event 0: 2 + 2 = 4. Best single event value = max(3, 2) = 3
- Event 3 `[7,10,1]`: Find last event ending before time 7. Event 2 ends at 5, which is < 7. So we can pair with best value up to event 2: 1 + 3 = 4. Best single event value = max(3, 1) = 3

**Maximum value:** 4 (either events 0+2 or events 1+3)

## Brute Force Approach

The most straightforward approach is to try all possible pairs of events:

1. Check if two events are non-overlapping (event1.end < event2.start or event2.end < event1.start)
2. Calculate their combined value
3. Track the maximum

We'd also need to consider cases where we take only one event.

**Why this fails:** With n events, there are O(n²) possible pairs to check. For n up to 10⁵ (typical constraint), this is 10¹⁰ operations—far too slow. We need O(n log n) or better.

## Optimized Approach

The key insight is that we can process events in sorted order and use binary search to efficiently find compatible events:

1. **Sort by end time:** This allows us to use binary search to find the last event that ends before the current event starts.

2. **Dynamic programming approach:** Maintain two arrays:
   - `dp[i]`: Maximum value we can get from at most one event ending at or before event i
   - For each event i, we can either:
     - Take it alone: `value[i]`
     - Pair it with the best event before it: `value[i] + dp[j]` where j is the last event ending before event i starts
     - Skip it: use `dp[i-1]`

3. **Binary search optimization:** Instead of linearly searching for j, we binary search in the sorted end times to find the rightmost event with end time < current start time.

4. **Alternative approach:** We can also solve this by iterating through events and using a max heap to track the best values of events that have already ended before the current event starts.

## Optimal Solution

Here's the DP with binary search approach:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxTwoEvents(events):
    """
    Find maximum value from at most two non-overlapping events.

    Approach:
    1. Sort events by end time to enable binary search
    2. For each event, find the last event ending before it starts
    3. Use DP to track best single event value up to each point
    4. Consider each event as second event and pair with best earlier event
    """
    # Sort events by end time - crucial for binary search
    events.sort(key=lambda x: x[1])

    n = len(events)

    # Extract end times for binary search
    end_times = [event[1] for event in events]

    # dp[i] = maximum value from at most one event ending at or before event i
    dp = [0] * n
    dp[0] = events[0][2]  # First event's value

    # Fill dp array: dp[i] = max(events[i][2], dp[i-1])
    for i in range(1, n):
        dp[i] = max(events[i][2], dp[i-1])

    # Initialize answer with best single event
    answer = max(dp)

    # For each event as potential second event
    for i in range(n):
        start_i, _, value_i = events[i]

        # Binary search to find last event ending before start_i
        # We're looking for rightmost end_time < start_i
        left, right = 0, n - 1
        j = -1  # Index of last compatible event, -1 if none

        while left <= right:
            mid = (left + right) // 2
            if end_times[mid] < start_i:
                j = mid  # This event ends before start_i
                left = mid + 1  # Try to find a later one
            else:
                right = mid - 1  # This event ends too late

        # If we found a compatible event, add its best value
        if j != -1:
            answer = max(answer, value_i + dp[j])

    return answer
```

```javascript
// Time: O(n log n) | Space: O(n)
function maxTwoEvents(events) {
  /**
   * Find maximum value from at most two non-overlapping events.
   *
   * Approach:
   * 1. Sort events by end time to enable binary search
   * 2. For each event, find the last event ending before it starts
   * 3. Use DP to track best single event value up to each point
   * 4. Consider each event as second event and pair with best earlier event
   */

  // Sort events by end time - crucial for binary search
  events.sort((a, b) => a[1] - b[1]);

  const n = events.length;

  // Extract end times for binary search
  const endTimes = events.map((event) => event[1]);

  // dp[i] = maximum value from at most one event ending at or before event i
  const dp = new Array(n).fill(0);
  dp[0] = events[0][2]; // First event's value

  // Fill dp array: dp[i] = max(events[i][2], dp[i-1])
  for (let i = 1; i < n; i++) {
    dp[i] = Math.max(events[i][2], dp[i - 1]);
  }

  // Initialize answer with best single event
  let answer = Math.max(...dp);

  // For each event as potential second event
  for (let i = 0; i < n; i++) {
    const [startI, , valueI] = events[i];

    // Binary search to find last event ending before startI
    // We're looking for rightmost end_time < startI
    let left = 0,
      right = n - 1;
    let j = -1; // Index of last compatible event, -1 if none

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (endTimes[mid] < startI) {
        j = mid; // This event ends before startI
        left = mid + 1; // Try to find a later one
      } else {
        right = mid - 1; // This event ends too late
      }
    }

    // If we found a compatible event, add its best value
    if (j !== -1) {
      answer = Math.max(answer, valueI + dp[j]);
    }
  }

  return answer;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    public int maxTwoEvents(int[][] events) {
        /**
         * Find maximum value from at most two non-overlapping events.
         *
         * Approach:
         * 1. Sort events by end time to enable binary search
         * 2. For each event, find the last event ending before it starts
         * 3. Use DP to track best single event value up to each point
         * 4. Consider each event as second event and pair with best earlier event
         */

        // Sort events by end time - crucial for binary search
        Arrays.sort(events, (a, b) -> Integer.compare(a[1], b[1]));

        int n = events.length;

        // Extract end times for binary search
        int[] endTimes = new int[n];
        for (int i = 0; i < n; i++) {
            endTimes[i] = events[i][1];
        }

        // dp[i] = maximum value from at most one event ending at or before event i
        int[] dp = new int[n];
        dp[0] = events[0][2];  // First event's value

        // Fill dp array: dp[i] = max(events[i][2], dp[i-1])
        for (int i = 1; i < n; i++) {
            dp[i] = Math.max(events[i][2], dp[i - 1]);
        }

        // Initialize answer with best single event
        int answer = dp[n - 1];

        // For each event as potential second event
        for (int i = 0; i < n; i++) {
            int startI = events[i][0];
            int valueI = events[i][2];

            // Binary search to find last event ending before startI
            // We're looking for rightmost end_time < startI
            int left = 0, right = n - 1;
            int j = -1;  // Index of last compatible event, -1 if none

            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (endTimes[mid] < startI) {
                    j = mid;  // This event ends before startI
                    left = mid + 1;  // Try to find a later one
                } else {
                    right = mid - 1;  // This event ends too late
                }
            }

            // If we found a compatible event, add its best value
            if (j != -1) {
                answer = Math.max(answer, valueI + dp[j]);
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the events: O(n log n)
- Building the dp array: O(n)
- For each of n events, we perform binary search: O(log n) each → O(n log n)
- Total: O(n log n) + O(n) + O(n log n) = O(n log n)

**Space Complexity:** O(n)

- We store the sorted events: O(n)
- We store the end_times array: O(n)
- We store the dp array: O(n)
- Total: O(n)

## Common Mistakes

1. **Sorting by start time instead of end time:** If you sort by start time, binary search becomes much harder because you need to find events that end before the current starts, but events aren't ordered by end time.

2. **Forgetting to handle the single event case:** The problem says "at most two" events, so you must also consider taking just one event. Initialize your answer with the maximum single event value.

3. **Incorrect binary search condition:** When searching for the last event ending before current start time, use `end_times[mid] < start_i` (strictly less than), not `<=`. Events ending exactly at the start time don't overlap.

4. **Not updating dp correctly:** `dp[i]` should be the maximum value from events 0 through i, not just `events[i][2]`. You need `dp[i] = max(events[i][2], dp[i-1])`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Interval scheduling with weights:** Similar to "Maximum Profit in Job Scheduling" (Hard), which also involves selecting non-overlapping intervals with weights but allows unlimited selections.

2. **DP with binary search on sorted array:** When you need to find the "closest" element satisfying a condition in a sorted array, binary search is your friend. Used in "Maximum Number of Events That Can Be Attended II" (Hard).

3. **Selecting k non-overlapping intervals:** A generalization of this problem. "Maximize Win From Two Segments" (Medium) is essentially the same problem but with a different framing.

## Key Takeaways

1. **Sorting by end time enables efficient compatibility checking:** When dealing with intervals, sorting by end time often makes it easier to find non-overlapping intervals using binary search.

2. **DP + binary search is powerful for interval problems:** Maintain a dp array of best results up to each point, and use binary search to find where to look up previous results.

3. **"At most k" means consider all cases ≤ k:** Don't forget to handle the cases where you take fewer than the maximum allowed items (in this case, 0 or 1 events).

Related problems: [Maximum Profit in Job Scheduling](/problem/maximum-profit-in-job-scheduling), [Maximum Number of Events That Can Be Attended II](/problem/maximum-number-of-events-that-can-be-attended-ii), [Maximize Win From Two Segments](/problem/maximize-win-from-two-segments)
