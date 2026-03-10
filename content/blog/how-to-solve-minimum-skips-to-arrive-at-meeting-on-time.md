---
title: "How to Solve Minimum Skips to Arrive at Meeting On Time — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Skips to Arrive at Meeting On Time. Hard difficulty, 38.8% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-06-27"
category: "dsa-patterns"
tags: ["minimum-skips-to-arrive-at-meeting-on-time", "array", "dynamic-programming", "hard"]
---

# How to Solve Minimum Skips to Arrive at Meeting On Time

You need to travel through `n` roads with given distances, but you must rest after each road unless you skip rest. Given a time limit, find the minimum number of skips needed to arrive on time. The challenge is that you can't simply skip all rests—you must strategically choose when to skip to minimize total travel time while accounting for floating-point precision issues.

## Visual Walkthrough

Let's trace through a small example: `dist = [2, 7, 11]`, `speed = 5`, `hoursBefore = 3`.

**Understanding the travel rules:**

- Travel time for road i = `dist[i] / speed` hours
- After each road, you must rest unless you skip
- Rest time = `ceil(travel_time) - travel_time` (wait until next full hour)
- If you skip rest, you continue immediately

**Step-by-step calculation:**

1. Road 1: 2 km at 5 km/h = 0.4 hours
   - If rest: wait 0.6 hours (ceil to 1 hour), total = 1.0
   - If skip: continue immediately, total = 0.4

2. Road 2: 7 km at 5 km/h = 1.4 hours
   - If rested before: start at 1.0, travel to 2.4
   - If skipped before: start at 0.4, travel to 1.8

3. Road 3: 11 km at 5 km/h = 2.2 hours
   - Continue similarly...

The key insight: At each road, we track the earliest arrival time for each possible number of skips used so far. We need to find the minimum skips where total time ≤ hoursBefore.

## Brute Force Approach

A naive approach would try all combinations of skipping or resting at each road. For `n` roads, there are `2^n` possibilities. For each combination:

1. Calculate total travel time with rests
2. Check if ≤ hoursBefore
3. Track minimum skips

This is clearly exponential and impractical for `n` up to 1000. Even worse, floating-point arithmetic with division and ceiling operations can lead to precision errors.

**Why brute force fails:**

- `2^1000` is astronomically large
- Floating-point errors accumulate
- No way to prune the search space efficiently

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. At each road, for each possible number of skips used so far, we want to know the earliest arrival time.

**DP State Definition:**
Let `dp[i][k]` = minimum time to reach the end of road `i` using exactly `k` skips.

**Transition:**
For road `i` with travel time `t = dist[i] / speed`:

1. If we rest after road `i`: `time = ceil(dp[i-1][k] + t)`
2. If we skip rest after road `i`: `time = dp[i-1][k-1] + t` (if k > 0)

Take the minimum of these two options.

**Precision Handling:**
Instead of floating-point, multiply everything by `speed` to work with integers:

- Travel time for road i = `dist[i]`
- Rest time = `(speed - (time % speed)) % speed` to wait until next multiple of speed

**Final Answer:**
Find the smallest `k` where `dp[n-1][k] / speed ≤ hoursBefore`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def minSkips(dist, speed, hoursBefore):
    """
    Calculate minimum skips needed to arrive on time.

    Args:
        dist: List of road distances in kilometers
        speed: Travel speed in km/h
        hoursBefore: Time limit in hours

    Returns:
        Minimum skips needed, or -1 if impossible
    """
    n = len(dist)
    INF = float('inf')

    # dp[k] = minimum time (in speed units) to reach current road with k skips
    # We use speed units to avoid floating-point errors
    dp = [INF] * (n + 1)
    dp[0] = 0  # 0 skips used initially

    for i in range(n):
        # Process roads in reverse to avoid overwriting needed values
        for k in range(i, -1, -1):
            if dp[k] == INF:
                continue

            # Option 1: Rest after this road
            # Ceil to next multiple of speed: (time + speed - 1) // speed * speed
            time_with_rest = (dp[k] + dist[i] + speed - 1) // speed * speed
            dp[k] = time_with_rest

            # Option 2: Skip rest (if we have skips available)
            if k + 1 <= n:
                time_with_skip = dp[k] - ((dp[k] + dist[i] + speed - 1) // speed * speed) + (dp[k] + dist[i])
                dp[k + 1] = min(dp[k + 1], dp[k] + dist[i])

    # Convert back to hours and check
    for k in range(n + 1):
        if dp[k] <= hoursBefore * speed:
            return k

    return -1
```

```javascript
// Time: O(n^2) | Space: O(n^2)
function minSkips(dist, speed, hoursBefore) {
  /**
   * Calculate minimum skips needed to arrive on time.
   *
   * @param {number[]} dist - Road distances in kilometers
   * @param {number} speed - Travel speed in km/h
   * @param {number} hoursBefore - Time limit in hours
   * @return {number} Minimum skips needed, or -1 if impossible
   */
  const n = dist.length;
  const INF = Number.MAX_SAFE_INTEGER;

  // dp[k] = minimum time (in speed units) with k skips
  let dp = new Array(n + 1).fill(INF);
  dp[0] = 0; // Start with 0 skips

  for (let i = 0; i < n; i++) {
    // Process in reverse to avoid using updated values prematurely
    for (let k = i; k >= 0; k--) {
      if (dp[k] === INF) continue;

      // Option 1: Take rest after this road
      // Ceil to next multiple of speed
      const timeWithRest = Math.floor((dp[k] + dist[i] + speed - 1) / speed) * speed;
      dp[k] = timeWithRest;

      // Option 2: Skip rest (if we have skips available)
      if (k + 1 <= n) {
        const timeWithSkip = dp[k] + dist[i];
        dp[k + 1] = Math.min(dp[k + 1], timeWithSkip);
      }
    }
  }

  // Check which number of skips gets us there on time
  const timeLimit = hoursBefore * speed;
  for (let k = 0; k <= n; k++) {
    if (dp[k] <= timeLimit) {
      return k;
    }
  }

  return -1;
}
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    public int minSkips(int[] dist, int speed, int hoursBefore) {
        /**
         * Calculate minimum skips needed to arrive on time.
         *
         * @param dist Road distances in kilometers
         * @param speed Travel speed in km/h
         * @param hoursBefore Time limit in hours
         * @return Minimum skips needed, or -1 if impossible
         */
        int n = dist.length;
        long INF = Long.MAX_VALUE / 2;

        // dp[k] = minimum time (in speed units) with k skips
        long[] dp = new long[n + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;  // Start with 0 skips

        for (int i = 0; i < n; i++) {
            // Process in reverse to avoid using updated values
            for (int k = i; k >= 0; k--) {
                if (dp[k] == INF) continue;

                // Option 1: Take rest after this road
                // Ceil to next multiple of speed
                long timeWithRest = ((dp[k] + dist[i] + speed - 1) / speed) * speed;
                dp[k] = timeWithRest;

                // Option 2: Skip rest (if we have skips available)
                if (k + 1 <= n) {
                    long timeWithSkip = dp[k] + dist[i];
                    dp[k + 1] = Math.min(dp[k + 1], timeWithSkip);
                }
            }
        }

        // Check which number of skips gets us there on time
        long timeLimit = (long) hoursBefore * speed;
        for (int k = 0; k <= n; k++) {
            if (dp[k] <= timeLimit) {
                return k;
            }
        }

        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have `n` roads to process
- For each road `i`, we iterate through up to `i` possible skip counts
- This gives us Σ(i=0 to n-1) i = n(n-1)/2 = O(n²) operations

**Space Complexity:** O(n)

- We only maintain a 1D DP array of size `n+1`
- We process roads in reverse to reuse the same array
- If we used a 2D array, it would be O(n²), but the optimized version uses O(n)

## Common Mistakes

1. **Floating-point precision errors**: Using `float` or `double` for time calculations can lead to incorrect comparisons. Always multiply by speed to work with integers.
2. **Incorrect ceiling calculation**: The formula `(time + speed - 1) // speed * speed` correctly computes the next multiple of speed. Using `Math.ceil(time/speed)*speed` with floats can give wrong results.

3. **Forgetting to process in reverse**: When updating the DP array, if you process forward, you might use newly updated values for the same road. Always process skip counts in descending order.

4. **Not handling the last road correctly**: After the last road, no rest is needed. Some implementations incorrectly add rest time after the final road.

## When You'll See This Pattern

This DP pattern appears in problems where you need to make sequential decisions with cumulative constraints:

1. **Minimum Speed to Arrive on Time (LeetCode 1870)**: Similar time-constrained travel problem, but uses binary search on speed instead of DP on skips.

2. **Minimum Time to Finish the Race (LeetCode 2188)**: Another optimization problem with time constraints and equipment choices.

3. **Coin Change (LeetCode 322)**: DP with minimization over choices, though simpler since it's 1D.

4. **Partition Equal Subset Sum (LeetCode 416)**: DP with boolean states tracking achievable sums.

## Key Takeaways

1. **When to use DP**: Look for problems with sequential decisions where each choice affects future options, and you need to optimize some quantity (min skips, min time, max profit).

2. **Integer arithmetic for precision**: When dealing with divisions and comparisons, multiply by denominators to avoid floating-point errors.

3. **Space optimization**: Many 2D DP problems can be optimized to 1D by processing in reverse order when updates depend on previous states.

4. **State definition is key**: The right DP state (`dp[i][k]` = min time after i roads with k skips) makes the transitions natural.

Related problems: [Minimum Speed to Arrive on Time](/problem/minimum-speed-to-arrive-on-time), [Minimum Time to Finish the Race](/problem/minimum-time-to-finish-the-race)
