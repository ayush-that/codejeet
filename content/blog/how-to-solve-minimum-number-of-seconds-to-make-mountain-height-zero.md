---
title: "How to Solve Minimum Number of Seconds to Make Mountain Height Zero — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Seconds to Make Mountain Height Zero. Medium difficulty, 36.9% acceptance rate. Topics: Array, Math, Binary Search, Greedy, Heap (Priority Queue)."
date: "2029-08-07"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-seconds-to-make-mountain-height-zero",
    "array",
    "math",
    "binary-search",
    "medium",
  ]
---

# How to Solve Minimum Number of Seconds to Make Mountain Height Zero

This problem asks us to find the minimum time required for multiple workers to reduce a mountain's height to zero when they work simultaneously. Each worker has a specific work time (in seconds) needed to remove one unit of height, and they can work continuously. The tricky part is that workers work in parallel, so we need to calculate how much total work gets done in a given time period, not just sum individual worker times.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `mountainHeight = 10`, `workerTimes = [2, 3, 5]`

We have 3 workers:

- Worker 0: Takes 2 seconds to remove 1 unit of height
- Worker 1: Takes 3 seconds to remove 1 unit of height
- Worker 2: Takes 5 seconds to remove 1 unit of height

If we have `T` seconds of work time:

- Worker 0 can remove `⌊T/2⌋` units (floor division since they can only complete whole units)
- Worker 1 can remove `⌊T/3⌋` units
- Worker 2 can remove `⌊T/5⌋` units

Let's test different time values:

**T = 5 seconds:**

- Worker 0: `⌊5/2⌋ = 2` units
- Worker 1: `⌊5/3⌋ = 1` unit
- Worker 2: `⌊5/5⌋ = 1` unit
- **Total removed:** 2 + 1 + 1 = 4 units (not enough, need 10)

**T = 10 seconds:**

- Worker 0: `⌊10/2⌋ = 5` units
- Worker 1: `⌊10/3⌋ = 3` units
- Worker 2: `⌊10/5⌋ = 2` units
- **Total removed:** 5 + 3 + 2 = 10 units (exactly enough!)

So the minimum time is 10 seconds. Notice that if we try T = 9 seconds:

- Worker 0: `⌊9/2⌋ = 4` units
- Worker 1: `⌊9/3⌋ = 3` units
- Worker 2: `⌊9/5⌋ = 1` unit
- **Total removed:** 4 + 3 + 1 = 8 units (not enough)

This shows us that the relationship between time and total work is monotonic: more time always means more work completed. This monotonic property is what allows us to use binary search!

## Brute Force Approach

A naive approach would be to try every possible time value starting from 1 and check if it's sufficient:

1. Start with time = 1
2. Calculate total work done in that time by summing `⌊time / workerTime⌋` for each worker
3. If total work ≥ mountainHeight, return time
4. Otherwise, increment time by 1 and repeat

The problem with this approach is that the required time could be very large (up to `mountainHeight × max(workerTimes)` in the worst case). If `mountainHeight = 10^9` and the slowest worker takes `10^9` seconds per unit, we'd need to check up to `10^18` time values, which is completely infeasible.

Even if we try to be smarter and increment by larger steps, we still don't have a systematic way to find the minimum time efficiently.

## Optimized Approach

The key insight is that **the relationship between time and total work is monotonic**. If time `T` is sufficient to remove the mountain, then any time greater than `T` is also sufficient. Conversely, if time `T` is insufficient, then any time less than `T` is also insufficient.

This monotonic property allows us to use **binary search** to find the minimum sufficient time:

1. Define a search range:
   - Lower bound (`left`): 1 (minimum possible time)
   - Upper bound (`right`): `mountainHeight × min(workerTimes)` (a conservative upper bound where even the fastest worker alone could finish)
2. While `left < right`:
   - Calculate `mid = left + (right - left) // 2`
   - Compute total work done in `mid` seconds
   - If total work ≥ mountainHeight: `mid` might be sufficient (or we could do even better), so search left half (`right = mid`)
   - If total work < mountainHeight: `mid` is insufficient, so search right half (`left = mid + 1`)
3. When the loop ends, `left` (or `right`) contains the minimum sufficient time

The binary search reduces the time complexity from linear to logarithmic in the search space size.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log(m)) where n = len(workerTimes), m = mountainHeight * min(workerTimes)
# Space: O(1)
def minTimeToZero(mountainHeight, workerTimes):
    """
    Returns the minimum time required for all workers to reduce
    the mountain height to zero.

    Args:
        mountainHeight: The initial height of the mountain
        workerTimes: List of times each worker needs to remove one unit

    Returns:
        Minimum time in seconds
    """
    # Helper function to check if a given time is sufficient
    def canComplete(time):
        """
        Check if all workers working for 'time' seconds can remove
        at least mountainHeight units.
        """
        total_work = 0
        for wt in workerTimes:
            # Each worker can remove floor(time / wt) units
            total_work += time // wt
            # Early exit: if we already have enough, no need to continue
            if total_work >= mountainHeight:
                return True
        return total_work >= mountainHeight

    # Edge case: if mountainHeight is 0, no time is needed
    if mountainHeight == 0:
        return 0

    # Binary search bounds
    # Minimum possible time is 1 (can't have 0 time if mountainHeight > 0)
    left = 1
    # Maximum possible time: if only the fastest worker works
    # They need mountainHeight * min(workerTimes) seconds
    # This is a safe upper bound (actual answer will be ≤ this)
    right = mountainHeight * min(workerTimes)

    # Binary search for the minimum sufficient time
    while left < right:
        mid = left + (right - left) // 2  # Avoid overflow

        if canComplete(mid):
            # mid is sufficient, try to find smaller time
            right = mid
        else:
            # mid is insufficient, need more time
            left = mid + 1

    # When loop ends, left == right, and this is our answer
    return left
```

```javascript
// Time: O(n log(m)) where n = workerTimes.length, m = mountainHeight * min(workerTimes)
// Space: O(1)
function minTimeToZero(mountainHeight, workerTimes) {
  /**
   * Returns the minimum time required for all workers to reduce
   * the mountain height to zero.
   *
   * @param {number} mountainHeight - The initial height of the mountain
   * @param {number[]} workerTimes - Array of times each worker needs to remove one unit
   * @return {number} Minimum time in seconds
   */

  // Helper function to check if a given time is sufficient
  const canComplete = (time) => {
    /**
     * Check if all workers working for 'time' seconds can remove
     * at least mountainHeight units.
     */
    let totalWork = 0;
    for (const wt of workerTimes) {
      // Each worker can remove Math.floor(time / wt) units
      totalWork += Math.floor(time / wt);
      // Early exit: if we already have enough, no need to continue
      if (totalWork >= mountainHeight) {
        return true;
      }
    }
    return totalWork >= mountainHeight;
  };

  // Edge case: if mountainHeight is 0, no time is needed
  if (mountainHeight === 0) {
    return 0;
  }

  // Binary search bounds
  // Minimum possible time is 1 (can't have 0 time if mountainHeight > 0)
  let left = 1;
  // Maximum possible time: if only the fastest worker works
  // They need mountainHeight * min(workerTimes) seconds
  // This is a safe upper bound (actual answer will be ≤ this)
  const minWorkerTime = Math.min(...workerTimes);
  let right = mountainHeight * minWorkerTime;

  // Binary search for the minimum sufficient time
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2); // Avoid overflow

    if (canComplete(mid)) {
      // mid is sufficient, try to find smaller time
      right = mid;
    } else {
      // mid is insufficient, need more time
      left = mid + 1;
    }
  }

  // When loop ends, left == right, and this is our answer
  return left;
}
```

```java
// Time: O(n log(m)) where n = workerTimes.length, m = mountainHeight * min(workerTimes)
// Space: O(1)
public class Solution {
    public int minTimeToZero(int mountainHeight, int[] workerTimes) {
        /**
         * Returns the minimum time required for all workers to reduce
         * the mountain height to zero.
         *
         * @param mountainHeight The initial height of the mountain
         * @param workerTimes Array of times each worker needs to remove one unit
         * @return Minimum time in seconds
         */

        // Edge case: if mountainHeight is 0, no time is needed
        if (mountainHeight == 0) {
            return 0;
        }

        // Find minimum worker time for upper bound calculation
        int minWorkerTime = Integer.MAX_VALUE;
        for (int wt : workerTimes) {
            minWorkerTime = Math.min(minWorkerTime, wt);
        }

        // Binary search bounds
        // Minimum possible time is 1 (can't have 0 time if mountainHeight > 0)
        long left = 1;  // Use long to avoid overflow
        // Maximum possible time: if only the fastest worker works
        // They need mountainHeight * min(workerTimes) seconds
        // This is a safe upper bound (actual answer will be ≤ this)
        long right = (long) mountainHeight * minWorkerTime;

        // Binary search for the minimum sufficient time
        while (left < right) {
            long mid = left + (right - left) / 2;  // Avoid overflow

            if (canComplete(mid, mountainHeight, workerTimes)) {
                // mid is sufficient, try to find smaller time
                right = mid;
            } else {
                // mid is insufficient, need more time
                left = mid + 1;
            }
        }

        // When loop ends, left == right, and this is our answer
        return (int) left;
    }

    // Helper method to check if a given time is sufficient
    private boolean canComplete(long time, int mountainHeight, int[] workerTimes) {
        /**
         * Check if all workers working for 'time' seconds can remove
         * at least mountainHeight units.
         */
        long totalWork = 0;
        for (int wt : workerTimes) {
            // Each worker can remove time / wt units (integer division)
            totalWork += time / wt;
            // Early exit: if we already have enough, no need to continue
            if (totalWork >= mountainHeight) {
                return true;
            }
        }
        return totalWork >= mountainHeight;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log(m))

- `n` is the number of workers (`len(workerTimes)`)
- `m` is the search space size (`mountainHeight × min(workerTimes)`)
- For each binary search iteration (O(log m)), we check all workers (O(n))
- The early exit in `canComplete` doesn't change worst-case complexity but helps in practice

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- The input arrays are not modified
- No additional data structures are needed

## Common Mistakes

1. **Using linear search instead of binary search:** Candidates often try to increment time by 1 until they find a sufficient time. This fails for large inputs because the required time can be up to 10^18.

2. **Incorrect upper bound for binary search:** Using `mountainHeight × max(workerTimes)` as the upper bound is correct but less efficient. Using `mountainHeight × min(workerTimes)` gives a tighter bound. Some candidates use a fixed large number like 10^18, which works but may cause more binary search iterations.

3. **Integer overflow:** When calculating `mountainHeight × min(workerTimes)`, the product can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, regular ints are fine in Python).

4. **Off-by-one errors in binary search:** The classic binary search pitfalls:
   - Using `while (left <= right)` instead of `while (left < right)`
   - Forgetting to use `mid + 1` when moving left bound
   - Using `right = mid - 1` instead of `right = mid` when `mid` might be the answer

5. **Not handling edge cases:**
   - `mountainHeight = 0` should return 0 immediately
   - Single worker case still works with the same logic

## When You'll See This Pattern

This "binary search on answer" pattern appears whenever:

1. You're looking for a minimum or maximum value
2. The relationship between the value and feasibility is monotonic
3. Checking feasibility is easier than finding the value directly

**Related LeetCode problems:**

1. **Koko Eating Bananas (LeetCode 875)** - Similar structure: find minimum eating speed where Koko can eat all bananas in H hours. The feasibility check involves summing `ceil(pile / speed)`.

2. **Capacity To Ship Packages Within D Days (LeetCode 1011)** - Find minimum ship capacity to deliver all packages within D days. Feasibility check involves greedy loading of packages.

3. **Split Array Largest Sum (LeetCode 410)** - Find minimum largest sum when splitting array into m subarrays. Feasibility check involves greedy splitting.

4. **Minimum Time to Complete Trips (LeetCode 2187)** - Almost identical structure: find minimum time for buses to complete totalTrips.

## Key Takeaways

1. **Recognize "binary search on answer" opportunities:** When you need to find a minimum/maximum value and have a monotonic feasibility function, binary search is often the solution.

2. **Focus on the feasibility check:** The core of these problems is designing an efficient O(n) or O(n log n) check for whether a candidate value works.

3. **Choose appropriate bounds:** The lower bound is often 1 or 0, while the upper bound should be a provable maximum that's easy to compute. Tighter bounds mean fewer binary search iterations.

4. **Watch for overflow:** When dealing with large numbers (especially in Java), use long integers for intermediate calculations to avoid overflow.

[Practice this problem on CodeJeet](/problem/minimum-number-of-seconds-to-make-mountain-height-zero)
