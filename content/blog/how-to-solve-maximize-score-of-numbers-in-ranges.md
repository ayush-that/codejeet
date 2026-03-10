---
title: "How to Solve Maximize Score of Numbers in Ranges — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Score of Numbers in Ranges. Medium difficulty, 35.6% acceptance rate. Topics: Array, Binary Search, Greedy, Sorting."
date: "2029-09-10"
category: "dsa-patterns"
tags: ["maximize-score-of-numbers-in-ranges", "array", "binary-search", "greedy", "medium"]
---

# How to Solve "Maximize Score of Numbers in Ranges"

This problem asks us to select one number from each of `n` intervals (where each interval is `[start[i], start[i] + d]`) such that the **minimum absolute difference** between any two selected numbers is maximized. In other words, we want to space out our chosen numbers as evenly as possible while respecting the interval constraints. What makes this problem tricky is that we're optimizing for the worst-case spacing (the minimum gap), which requires careful placement rather than simply picking endpoints.

## Visual Walkthrough

Let's walk through an example: `start = [2, 7, 11, 15]` and `d = 3`.

Our intervals are:

- Interval 0: [2, 5]
- Interval 1: [7, 10]
- Interval 2: [11, 14]
- Interval 3: [15, 18]

We need to choose one number from each interval. Let's try to maximize the minimum gap between any two consecutive chosen numbers (after sorting them).

**Step 1: Sort the intervals**
The intervals are already sorted by their start positions: [2,5], [7,10], [11,14], [15,18].

**Step 2: Try a candidate minimum gap**
Suppose we want a minimum gap of at least 3. Can we achieve this?

- Pick first number: smallest possible, 2 from interval 0
- Next must be ≥ 2 + 3 = 5. Interval 1 starts at 7, so pick 7
- Next must be ≥ 7 + 3 = 10. Interval 2 starts at 11, so pick 11
- Next must be ≥ 11 + 3 = 14. Interval 3 starts at 15, so pick 15

Success! All gaps are at least 3.

**Step 3: Try a larger gap**
What about minimum gap of 4?

- First: 2
- Next ≥ 6, interval 1 has [7,10], pick 7
- Next ≥ 11, interval 2 has [11,14], pick 11
- Next ≥ 15, interval 3 has [15,18], pick 15

Success! All gaps ≥ 4.

**Step 4: Try gap of 5**

- First: 2
- Next ≥ 7, pick 7 from interval 1
- Next ≥ 12, interval 2 has [11,14], pick 12 (within range)
- Next ≥ 17, interval 3 has [15,18], pick 17

Success! All gaps ≥ 5.

**Step 5: Try gap of 6**

- First: 2
- Next ≥ 8, interval 1 has [7,10], pick 8
- Next ≥ 14, interval 2 has [11,14], pick 14
- Next ≥ 20, but interval 3 ends at 18 → FAIL

So the maximum achievable minimum gap is 5.

This process reveals the core insight: we can **binary search** on the answer (the minimum gap), and for each candidate gap, use a **greedy algorithm** to check if we can place numbers with at least that spacing.

## Brute Force Approach

A brute force approach would try all possible combinations of numbers from each interval. Since each interval has `d+1` possible integers, and there are `n` intervals, there are `(d+1)^n` possible selections. For each selection, we would:

1. Sort the chosen numbers
2. Compute all pairwise differences
3. Find the minimum difference
4. Track the maximum of these minimum differences

This is clearly infeasible for any reasonable input size. Even with `n=10` and `d=10`, we'd have `11^10 ≈ 2.6×10^10` combinations to check.

What makes this problem challenging is that we can't simply pick numbers independently — the spacing constraint couples all choices together. A naive candidate might try to always pick the smallest available number or alternate between endpoints, but these heuristics fail on many test cases.

## Optimized Approach

The key insight is that we can **binary search on the answer** because:

1. If we can achieve a minimum gap of `k`, we can definitely achieve any gap smaller than `k` (by moving numbers closer together)
2. If we cannot achieve a minimum gap of `k`, we cannot achieve any gap larger than `k`

This monotonic property allows binary search. For each candidate gap `mid` in our binary search, we use a **greedy placement algorithm**:

- Always pick the smallest possible number that maintains at least `mid` gap from the previously chosen number
- Start with the smallest number in the first interval
- For each subsequent interval, pick `max(interval_start, prev_chosen + mid)`
- If this value exceeds `interval_end`, the candidate gap is impossible

Why does greedy work? If we have a choice between picking a smaller or larger number from an interval, picking the smallest leaves more "room" for future intervals while still satisfying the current gap constraint. This is optimal because we want to maximize our chances of fitting all numbers.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log(max_gap)) where max_gap is the maximum possible gap
# Space: O(1) excluding input storage
def maximizeScore(start, d):
    """
    Returns the maximum possible minimum absolute difference between
    any two chosen numbers, where we choose one number from each
    interval [start[i], start[i] + d].
    """
    n = len(start)

    # Sort intervals by their start positions
    # We need to process intervals in order to place numbers greedily
    intervals = sorted([(s, s + d) for s in start])

    # Helper function to check if we can achieve at least 'gap' spacing
    def can_achieve(gap):
        # Start with the smallest possible number in the first interval
        prev = intervals[0][0]

        # Try to place numbers in remaining intervals
        for i in range(1, n):
            curr_start, curr_end = intervals[i]

            # We need at least 'gap' distance from previous number
            target = prev + gap

            # If target is within current interval, pick it
            if target <= curr_end:
                # But we can't pick before the interval starts
                prev = max(target, curr_start)
            else:
                # Can't place a number with required gap
                return False

        return True

    # Binary search for the maximum achievable gap
    # Minimum possible gap is 0 (all numbers could be equal if intervals overlap)
    # Maximum possible gap is (max_end - min_start) when we pick extremes
    left, right = 0, intervals[-1][1] - intervals[0][0]

    while left < right:
        # Use mid = (left + right + 1) // 2 to avoid infinite loop
        mid = (left + right + 1) // 2

        if can_achieve(mid):
            # We can achieve this gap, try for larger
            left = mid
        else:
            # Cannot achieve this gap, try smaller
            right = mid - 1

    return left
```

```javascript
// Time: O(n log(max_gap)) where max_gap is the maximum possible gap
// Space: O(n) for storing sorted intervals
function maximizeScore(start, d) {
  const n = start.length;

  // Create and sort intervals by start position
  const intervals = start.map((s) => [s, s + d]).sort((a, b) => a[0] - b[0]);

  // Helper to check if a given gap is achievable
  const canAchieve = (gap) => {
    // Start with smallest number in first interval
    let prev = intervals[0][0];

    // Try to place numbers in remaining intervals
    for (let i = 1; i < n; i++) {
      const [currStart, currEnd] = intervals[i];

      // We need at least 'gap' distance from previous
      const target = prev + gap;

      if (target <= currEnd) {
        // Pick the smallest number that satisfies the gap
        // but not smaller than interval start
        prev = Math.max(target, currStart);
      } else {
        // Cannot place number with required gap
        return false;
      }
    }

    return true;
  };

  // Binary search bounds
  // Minimum gap is 0, maximum is when we pick extremes
  let left = 0;
  let right = intervals[n - 1][1] - intervals[0][0];

  while (left < right) {
    // Add 1 to mid to avoid infinite loop with left = mid
    const mid = Math.floor((left + right + 1) / 2);

    if (canAchieve(mid)) {
      // This gap works, try larger
      left = mid;
    } else {
      // This gap doesn't work, try smaller
      right = mid - 1;
    }
  }

  return left;
}
```

```java
// Time: O(n log(max_gap)) where max_gap is the maximum possible gap
// Space: O(n) for storing sorted intervals
import java.util.Arrays;

public class Solution {
    public int maximizeScore(int[] start, int d) {
        int n = start.length;

        // Create intervals and sort by start position
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            intervals[i][0] = start[i];
            intervals[i][1] = start[i] + d;
        }

        // Sort intervals by start position
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        // Binary search for maximum achievable gap
        int left = 0;
        int right = intervals[n-1][1] - intervals[0][0];

        while (left < right) {
            // Use +1 to avoid infinite loop
            int mid = left + (right - left + 1) / 2;

            if (canAchieve(intervals, mid)) {
                left = mid;  // Try for larger gap
            } else {
                right = mid - 1;  // Try smaller gap
            }
        }

        return left;
    }

    private boolean canAchieve(int[][] intervals, int gap) {
        // Start with smallest number in first interval
        long prev = intervals[0][0];  // Use long to avoid overflow

        for (int i = 1; i < intervals.length; i++) {
            int currStart = intervals[i][0];
            int currEnd = intervals[i][1];

            // Need at least 'gap' distance from previous
            long target = prev + gap;

            if (target <= currEnd) {
                // Pick smallest number that satisfies gap constraint
                prev = Math.max(target, currStart);
            } else {
                return false;  // Cannot place number
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n log M)` where `n` is the number of intervals and `M` is the maximum possible gap.

- Sorting the intervals takes `O(n log n)`
- Binary search runs `O(log M)` times, where `M` is at most `max_end - min_start`
- Each `can_achieve` check takes `O(n)` time
- Overall: `O(n log n + n log M)`. Since `log M` is typically larger than `log n`, we simplify to `O(n log M)`

**Space Complexity:** `O(n)` for storing the sorted intervals (or `O(1)` if we sort in-place and modify the input, but we assume we shouldn't modify the input).

## Common Mistakes

1. **Forgetting to sort intervals:** The greedy algorithm only works if we process intervals in increasing order of their start positions. If intervals are out of order, we might incorrectly conclude a gap is impossible when it could be achieved by reordering choices.

2. **Incorrect binary search bounds:** Using `mid = (left + right) // 2` instead of `(left + right + 1) // 2` can cause infinite loops when `left` and `right` differ by 1. The `+1` ensures we always make progress.

3. **Integer overflow in target calculation:** When `prev + gap` exceeds integer limits (especially in Java), we get incorrect results. Always use `long` for intermediate calculations when values could be large.

4. **Not handling the case where target < interval start:** The greedy pick should be `max(target, interval_start)`, not just `target`. If `target` is smaller than the interval start, we must pick the interval start to stay within bounds.

## When You'll See This Pattern

This "binary search on answer + greedy verification" pattern appears in optimization problems where:

1. We're maximizing/minimizing some value
2. Verifying a candidate value is easier than finding the optimal value directly
3. The verification function is monotonic with respect to the answer

Related LeetCode problems:

1. **Find K-th Smallest Pair Distance (Hard)** - Binary search on the distance, with a two-pointer method to count pairs with distance ≤ mid
2. **Split Array Largest Sum (Hard)** - Binary search on the maximum subarray sum, with greedy verification
3. **Capacity To Ship Packages Within D Days (Medium)** - Binary search on shipping capacity, with greedy loading verification

## Key Takeaways

1. **When you need to maximize/minimize a "minimum" or "maximum" value**, consider binary search on the answer if verifying a candidate is easier than finding the optimal directly.

2. **Greedy placement with "pick smallest feasible"** often works for spacing problems because it leaves maximum flexibility for future placements.

3. **Always sort intervals by start position** when dealing with range selection problems unless there's a specific reason not to.

Related problems: [Find K-th Smallest Pair Distance](/problem/find-k-th-smallest-pair-distance)
