---
title: "How to Solve Maximum Score of Non-overlapping Intervals — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Score of Non-overlapping Intervals. Hard difficulty, 31.0% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Sorting."
date: "2026-09-14"
category: "dsa-patterns"
tags:
  [
    "maximum-score-of-non-overlapping-intervals",
    "array",
    "binary-search",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Maximum Score of Non-overlapping Intervals

You're given intervals with start times, end times, and weights, and you need to select up to 4 non-overlapping intervals that maximize the total weight. What makes this problem tricky is the combination of three constraints: intervals can overlap arbitrarily, you can only choose up to 4 intervals (not all of them), and you need to maximize weight rather than just count intervals. This is essentially a weighted interval scheduling problem with a cardinality constraint.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
intervals = [[1,3,5], [2,5,6], [4,6,3], [6,7,4], [5,8,2]]
```

First, we sort intervals by their end times:

```
[1,3,5]  (ends at 3)
[2,5,6]  (ends at 5)
[4,6,3]  (ends at 6)
[6,7,4]  (ends at 7)
[5,8,2]  (ends at 8)
```

Now let's think about building up our solution. For each interval, we need to consider:

1. Taking this interval and adding it to the best solution from intervals that end before this one starts
2. Not taking this interval and keeping the previous best

But we also need to track solutions for different numbers of intervals taken (0, 1, 2, 3, or 4). So for interval `[4,6,3]`:

- If we take it as our 1st interval: weight = 3
- If we take it as our 2nd interval: we need the best 1-interval solution from intervals ending before time 4
- If we take it as our 3rd interval: we need the best 2-interval solution from intervals ending before time 4

The key insight is that for each interval `i`, we can binary search to find the last interval that ends before `intervals[i]` starts. This gives us a way to combine solutions efficiently.

## Brute Force Approach

A naive approach would be to consider all possible combinations of up to 4 intervals from `n` intervals, check if they're non-overlapping, and track the maximum weight. The number of combinations is:

- 1 interval: `n` choices
- 2 intervals: `n choose 2` combinations
- 3 intervals: `n choose 3` combinations
- 4 intervals: `n choose 4` combinations

This gives us O(n⁴) combinations to check. For each combination, we need to verify they're non-overlapping (O(k) time where k ≤ 4). The total time would be O(n⁴), which is far too slow for n up to 10⁵.

Even if we try to be smarter with backtracking or recursion, any approach that explicitly enumerates combinations will be exponential in the worst case. We need a more structured approach.

## Optimized Approach

The optimal solution uses dynamic programming with binary search. Here's the step-by-step reasoning:

1. **Sort by end time**: This is standard for interval scheduling problems. When we process intervals in order of their end times, we guarantee that when we consider taking an interval, all intervals that could come before it have already been processed.

2. **DP state definition**: Let `dp[i][k]` represent the maximum score we can achieve using the first `i` intervals (after sorting) and selecting exactly `k` intervals. However, this O(n×k) space is manageable since k ≤ 4.

3. **Transition logic**: For each interval `i` and each count `k` from 1 to 4:
   - Option 1: Don't take interval `i` → `dp[i][k] = dp[i-1][k]`
   - Option 2: Take interval `i` as the k-th interval → we need the best solution with `k-1` intervals from intervals ending before `intervals[i]` starts. We find this using binary search.

4. **Binary search optimization**: Instead of linearly searching for the last non-overlapping interval, we binary search in the sorted array of end times. This reduces the search from O(n) to O(log n).

5. **Final answer**: The answer is the maximum of `dp[n][k]` for k = 0 to 4 (though k=0 gives 0).

The key insight is that by sorting and using binary search, we can efficiently find compatible previous intervals without checking all combinations.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(nk log n) for DP, where k=4 → O(n log n)
# Space: O(nk) = O(n) since k=4 is constant
def maxScore(intervals):
    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    n = len(intervals)

    # Extract end times for binary search
    ends = [interval[1] for interval in intervals]

    # dp[i][k] = max score using first i intervals with exactly k intervals selected
    # We'll use 1-indexing for intervals and 0-indexing for k
    dp = [[0] * 5 for _ in range(n + 1)]

    # Process each interval
    for i in range(1, n + 1):
        l, r, weight = intervals[i-1]

        # Copy previous row (case: don't take current interval)
        for k in range(5):
            dp[i][k] = dp[i-1][k]

        # Case: take current interval as the first interval (k=1)
        dp[i][1] = max(dp[i][1], weight)

        # For k = 2, 3, 4: try taking current interval as the k-th interval
        for k in range(2, 5):
            # Binary search to find the last interval that ends before current starts
            # We're looking for the rightmost index where ends[idx] < l
            lo, hi = 0, i-2  # i-2 because intervals is 0-indexed and we're at i-1
            last_compatible = -1

            while lo <= hi:
                mid = (lo + hi) // 2
                if ends[mid] < l:
                    last_compatible = mid
                    lo = mid + 1
                else:
                    hi = mid - 1

            # If we found a compatible interval
            if last_compatible != -1:
                # last_compatible is 0-indexed in intervals array
                # In dp table, index = last_compatible + 1 (1-indexed)
                dp[i][k] = max(dp[i][k], dp[last_compatible + 1][k-1] + weight)

    # Answer is max over all k from 0 to 4 (though k=0 gives 0)
    return max(dp[n])
```

```javascript
// Time: O(n log n) for sorting + O(nk log n) for DP → O(n log n)
// Space: O(nk) = O(n) since k=4 is constant
function maxScore(intervals) {
  // Sort intervals by their end time
  intervals.sort((a, b) => a[1] - b[1]);

  const n = intervals.length;

  // Extract end times for binary search
  const ends = intervals.map((interval) => interval[1]);

  // dp[i][k] = max score using first i intervals with exactly k intervals selected
  // We'll use 1-indexing for intervals
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(5).fill(0));

  // Process each interval
  for (let i = 1; i <= n; i++) {
    const [l, r, weight] = intervals[i - 1];

    // Copy previous row (case: don't take current interval)
    for (let k = 0; k <= 4; k++) {
      dp[i][k] = dp[i - 1][k];
    }

    // Case: take current interval as the first interval (k=1)
    dp[i][1] = Math.max(dp[i][1], weight);

    // For k = 2, 3, 4: try taking current interval as the k-th interval
    for (let k = 2; k <= 4; k++) {
      // Binary search to find the last interval that ends before current starts
      let lo = 0,
        hi = i - 2;
      let lastCompatible = -1;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (ends[mid] < l) {
          lastCompatible = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      // If we found a compatible interval
      if (lastCompatible !== -1) {
        // lastCompatible is 0-indexed in intervals array
        // In dp table, index = lastCompatible + 1 (1-indexed)
        dp[i][k] = Math.max(dp[i][k], dp[lastCompatible + 1][k - 1] + weight);
      }
    }
  }

  // Answer is max over all k from 0 to 4
  return Math.max(...dp[n]);
}
```

```java
// Time: O(n log n) for sorting + O(nk log n) for DP → O(n log n)
// Space: O(nk) = O(n) since k=4 is constant
public int maxScore(int[][] intervals) {
    // Sort intervals by their end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int n = intervals.length;

    // Extract end times for binary search
    int[] ends = new int[n];
    for (int i = 0; i < n; i++) {
        ends[i] = intervals[i][1];
    }

    // dp[i][k] = max score using first i intervals with exactly k intervals selected
    // We'll use 1-indexing for intervals
    int[][] dp = new int[n + 1][5];

    // Process each interval
    for (int i = 1; i <= n; i++) {
        int l = intervals[i - 1][0];
        int r = intervals[i - 1][1];
        int weight = intervals[i - 1][2];

        // Copy previous row (case: don't take current interval)
        for (int k = 0; k <= 4; k++) {
            dp[i][k] = dp[i - 1][k];
        }

        // Case: take current interval as the first interval (k=1)
        dp[i][1] = Math.max(dp[i][1], weight);

        // For k = 2, 3, 4: try taking current interval as the k-th interval
        for (int k = 2; k <= 4; k++) {
            // Binary search to find the last interval that ends before current starts
            int lo = 0, hi = i - 2;
            int lastCompatible = -1;

            while (lo <= hi) {
                int mid = lo + (hi - lo) / 2;
                if (ends[mid] < l) {
                    lastCompatible = mid;
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }

            // If we found a compatible interval
            if (lastCompatible != -1) {
                // lastCompatible is 0-indexed in intervals array
                // In dp table, index = lastCompatible + 1 (1-indexed)
                dp[i][k] = Math.max(dp[i][k], dp[lastCompatible + 1][k - 1] + weight);
            }
        }
    }

    // Answer is max over all k from 0 to 4
    int maxScore = 0;
    for (int k = 0; k <= 4; k++) {
        maxScore = Math.max(maxScore, dp[n][k]);
    }
    return maxScore;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the intervals: O(n log n)
- For each of n intervals, we perform binary search O(log n) for each k (k ≤ 4): O(n × 4 × log n) = O(n log n)
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity: O(n)**

- We store the sorted intervals: O(n)
- We store the dp table with (n+1) × 5 entries: O(5n) = O(n)
- We store the ends array: O(n)
- Total: O(n)

The constant factor of 5 (for k = 0..4) is negligible for large n.

## Common Mistakes

1. **Not sorting by end time**: Some candidates try to sort by start time or weight. Sorting by end time is crucial because it allows us to use binary search to find compatible previous intervals efficiently.

2. **Incorrect binary search bounds**: When searching for the last compatible interval, you need to search in `[0, i-2]` (0-indexed) not `[0, n-1]`. Searching beyond `i-1` doesn't make sense since we're only considering intervals before the current one.

3. **Forgetting to handle the "don't take" case**: For each interval, you must copy the previous row's values. Otherwise, you're forcing yourself to take intervals when it might be better to skip them.

4. **Off-by-one errors in dp indices**: The dp table uses 1-indexing for intervals (row 0 represents no intervals processed), while the intervals array is 0-indexed. Mixing these up is a common source of bugs.

5. **Not considering all k values in the final answer**: The problem says "up to 4 intervals", so the answer could come from taking 0, 1, 2, 3, or 4 intervals. You need to take the maximum over all k.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Weighted Interval Scheduling**: The core is a DP solution for selecting non-overlapping intervals with maximum weight. Similar problems include:
   - "Maximum Profit in Job Scheduling" (LeetCode 1235) - Same DP + binary search pattern
   - "Two Best Non-Overlapping Events" (LeetCode 2054) - Simplified version with k=2

2. **DP with Cardinality Constraints**: When you need to select exactly k items (or up to k items) that satisfy certain constraints. Other examples:
   - "Maximum Number of Events That Can Be Attended II" (LeetCode 1751) - Almost identical but with general k
   - "Best Team With No Conflicts" (LeetCode 1626) - Different constraints but similar DP structure

The pattern to recognize: When you need to select a limited number of non-overlapping intervals/events with weights, think "sort by end time + DP with binary search".

## Key Takeaways

1. **Sorting by end time enables efficient compatibility checking**: This transforms an O(n) linear search into an O(log n) binary search for finding the last non-overlapping interval.

2. **DP dimensions often include both position and count**: When there's a constraint on how many items you can select, add a dimension to your DP state to track how many you've selected so far.

3. **"Up to k" means check all values ≤ k**: Don't just check the case with exactly k items - the optimal solution might use fewer.

Related problems: [Two Best Non-Overlapping Events](/problem/two-best-non-overlapping-events)
