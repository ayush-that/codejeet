---
title: "How to Solve Minimum Time to Finish the Race — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Time to Finish the Race. Hard difficulty, 43.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2030-02-24"
category: "dsa-patterns"
tags: ["minimum-time-to-finish-the-race", "array", "dynamic-programming", "hard"]
---

# How to Solve Minimum Time to Finish the Race

This problem asks us to find the minimum time to complete `numLaps` laps in a race, given a set of tires where each tire gets slower the more consecutive laps you use it. The tricky part is that each tire's lap time follows a geometric progression: the first lap takes `f` seconds, the second takes `f * r` seconds, the third takes `f * r²` seconds, and so on. You can change tires at any time (which resets the lap counter for that tire), but changing tires costs `changeTime` seconds. This creates a complex optimization problem where you need to balance using a tire for many consecutive laps (avoiding change costs but suffering from increasing lap times) versus changing frequently (paying change costs but getting fresh fast laps).

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose:

- `tires = [[2, 3], [3, 2]]` (two tire types)
- `changeTime = 5`
- `numLaps = 3`

**Tire 1:** `f=2, r=3`

- Lap 1: 2 seconds
- Lap 2: 2 × 3 = 6 seconds
- Lap 3: 2 × 3² = 18 seconds

**Tire 2:** `f=3, r=2`

- Lap 1: 3 seconds
- Lap 2: 3 × 2 = 6 seconds
- Lap 3: 3 × 2² = 12 seconds

Now let's consider strategies for 3 laps:

**Strategy A: Use Tire 1 for all 3 laps**

- Total time = 2 + 6 + 18 = 26 seconds
- No change time needed

**Strategy B: Use Tire 2 for all 3 laps**

- Total time = 3 + 6 + 12 = 21 seconds
- No change time needed

**Strategy C: Change tires between laps**

- Option 1: Tire 1 (lap 1) → change → Tire 2 (lap 2) → change → Tire 1 (lap 3)
  - Time = 2 + 5 + 3 + 5 + 2 = 17 seconds
- Option 2: Tire 1 (lap 1-2) → change → Tire 2 (lap 3)
  - Time = (2 + 6) + 5 + 3 = 16 seconds
- Option 3: Tire 2 (lap 1-2) → change → Tire 1 (lap 3)
  - Time = (3 + 6) + 5 + 2 = 16 seconds

The best strategy takes 16 seconds. This shows why we need to consider all possible sequences of tire changes.

## Brute Force Approach

A naive approach would try all possible ways to partition `numLaps` into segments, where each segment represents consecutive laps on a single tire. For each segment of length `k`, we'd need to choose the best tire for running exactly `k` consecutive laps (considering all tire types). Then we'd sum these segment times plus change times between segments.

The problem with this brute force approach is the number of partitions grows exponentially with `numLaps`. For `numLaps = 1000`, there are approximately 2^(numLaps-1) possible partitions, which is astronomically large. Even if we precompute the best time for each possible segment length, we'd still need to consider all partitions.

What makes this problem tractable is a key observation: because lap times grow geometrically, there's a practical limit to how many consecutive laps you'd ever want to run on a single tire before changing. Once lap times become too large, it's always better to change tires and start fresh.

## Optimized Approach

The key insight is **dynamic programming with bounded segment lengths**. Here's the step-by-step reasoning:

1. **Precompute best times for segments of length k**: For each possible segment length `k` (consecutive laps on one tire), compute the minimum time to complete exactly `k` laps on any single tire without changing. This accounts for the geometric progression of lap times.

2. **Bound the maximum useful segment length**: Because `r ≥ 2` (given in constraints), lap times grow at least exponentially. Even with the smallest `f=2` and `r=2`, the 20th lap would take over 1 million seconds! In practice, we only need to consider segments up to about 20 laps because beyond that, it's always better to change tires.

3. **DP state definition**: Let `dp[i]` = minimum time to complete `i` laps. We initialize `dp[0] = 0` (0 laps take 0 time).

4. **DP transition**: For each `i` from 1 to `numLaps`, and for each possible segment length `k` (from 1 to `maxLaps`), we consider completing the last `k` laps as a segment:

   ```
   dp[i] = min(dp[i], dp[i-k] + bestTime[k] + changeTime)
   ```

   The `+ changeTime` accounts for changing to a new tire before starting this segment. We add an extra `changeTime` at the beginning too.

5. **Final adjustment**: Since we don't need to change tires before the first segment, we subtract one `changeTime` from the final answer.

The critical optimization is bounding `maxLaps` to around 20, which makes the DP O(numLaps × 20) instead of O(numLaps²).

## Optimal Solution

<div class="code-group">

```python
# Time: O(numLaps * min(numLaps, maxLaps)) where maxLaps ≈ 20
# Space: O(numLaps + maxLaps)
def minimumFinishTime(tires, changeTime, numLaps):
    # Step 1: Precompute the minimum time for each possible segment length
    # We only need to consider segments up to a certain length because
    # geometric growth makes very long segments impractical
    INF = 10**18
    maxLaps = 0

    # Find maximum useful segment length
    # With r >= 2, even with f=1, the lap time grows exponentially
    # We can bound it by when f * r^(k-1) exceeds changeTime + f
    # (when it's better to change tires and start fresh)
    for f, r in tires:
        lap = f
        total = 0
        k = 1
        while k <= numLaps and lap <= changeTime + f:
            total += lap
            maxLaps = max(maxLaps, k)
            # Store the best time for k consecutive laps on any tire
            if k >= len(bestTime):
                bestTime.append(total)
            else:
                bestTime[k] = min(bestTime[k], total)
            lap *= r
            k += 1

    # Step 2: Dynamic programming to find minimum time for numLaps
    dp = [INF] * (numLaps + 1)
    dp[0] = 0

    for i in range(1, numLaps + 1):
        # Try all possible segment lengths for the last segment
        for k in range(1, min(i, maxLaps) + 1):
            # dp[i-k] is min time for first i-k laps
            # bestTime[k] is min time for k consecutive laps on one tire
            # changeTime is cost to switch to new tire before this segment
            dp[i] = min(dp[i], dp[i - k] + bestTime[k] + changeTime)

    # Subtract changeTime because we don't need to change before first segment
    return dp[numLaps] - changeTime
```

```javascript
// Time: O(numLaps * min(numLaps, maxLaps)) where maxLaps ≈ 20
// Space: O(numLaps + maxLaps)
function minimumFinishTime(tires, changeTime, numLaps) {
  // Step 1: Precompute best times for each segment length
  const INF = Number.MAX_SAFE_INTEGER;
  let maxLaps = 0;
  const bestTime = new Array(numLaps + 1).fill(INF);

  for (const [f, r] of tires) {
    let lap = f;
    let total = 0;
    let k = 1;

    // Only consider segments where it might be worth using this tire
    while (k <= numLaps && lap <= changeTime + f) {
      total += lap;
      maxLaps = Math.max(maxLaps, k);

      // Store minimum time for k consecutive laps
      bestTime[k] = Math.min(bestTime[k], total);

      lap *= r;
      k++;
    }
  }

  // Step 2: Dynamic programming
  const dp = new Array(numLaps + 1).fill(INF);
  dp[0] = 0;

  for (let i = 1; i <= numLaps; i++) {
    // Try all possible last segment lengths
    for (let k = 1; k <= Math.min(i, maxLaps); k++) {
      // Transition: complete i-k laps, then change tire, then do k laps
      dp[i] = Math.min(dp[i], dp[i - k] + bestTime[k] + changeTime);
    }
  }

  // Remove the extra changeTime added before first segment
  return dp[numLaps] - changeTime;
}
```

```java
// Time: O(numLaps * min(numLaps, maxLaps)) where maxLaps ≈ 20
// Space: O(numLaps + maxLaps)
class Solution {
    public int minimumFinishTime(int[][] tires, int changeTime, int numLaps) {
        // Step 1: Precompute minimum time for each possible segment length
        final long INF = Long.MAX_VALUE / 2;
        int maxLaps = 0;
        long[] bestTime = new long[numLaps + 1];
        Arrays.fill(bestTime, INF);

        for (int[] tire : tires) {
            int f = tire[0];
            int r = tire[1];
            long lap = f;
            long total = 0;
            int k = 1;

            // Only consider segments where continuing might be beneficial
            while (k <= numLaps && lap <= changeTime + f) {
                total += lap;
                maxLaps = Math.max(maxLaps, k);

                // Update best time for k consecutive laps
                bestTime[k] = Math.min(bestTime[k], total);

                lap *= r;
                k++;
            }
        }

        // Step 2: Dynamic programming
        long[] dp = new long[numLaps + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;

        for (int i = 1; i <= numLaps; i++) {
            // Try all possible lengths for the last segment
            for (int k = 1; k <= Math.min(i, maxLaps); k++) {
                // dp[i-k]: min time for first i-k laps
                // bestTime[k]: min time for k consecutive laps on one tire
                // changeTime: cost to switch tires before this segment
                dp[i] = Math.min(dp[i], dp[i - k] + bestTime[k] + changeTime);
            }
        }

        // Subtract changeTime because we don't change before first segment
        return (int)(dp[numLaps] - changeTime);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(numLaps × min(numLaps, maxLaps)) where maxLaps is approximately 20. The first phase iterates through all tires and computes best times for up to maxLaps segments per tire, which is O(n × maxLaps) where n is the number of tires. The DP phase is O(numLaps × maxLaps). Since maxLaps is bounded (≈20), this is effectively O(numLaps).

**Space Complexity:** O(numLaps + maxLaps). We store the `bestTime` array of size maxLaps and the `dp` array of size numLaps+1.

The key to the efficiency is the observation that `maxLaps` is small because geometric growth makes very long segments impractical. Even with the smallest possible `r=2`, the lap time doubles each lap, so after 20 laps it would be over a million times the initial lap time!

## Common Mistakes

1. **Not bounding segment lengths**: Trying to consider all possible segment lengths up to numLaps (which could be 1000) leads to O(numLaps²) DP, which is too slow. The geometric growth means we only need to consider segments up to about 20 laps.

2. **Forgetting to subtract the initial changeTime**: The DP formula adds `changeTime` for every segment, but we don't need to change tires before the first segment. Forgetting to subtract one `changeTime` at the end is a common off-by-one error.

3. **Integer overflow**: Lap times can grow very large (f × r^(k-1)). Using 32-bit integers can overflow. Always use 64-bit integers (long in Java, long long in C++, normal integers in Python handle big numbers).

4. **Incorrect geometric progression**: The problem states the xth successive lap takes `f * r^(x-1)` seconds. Some candidates mistakenly use `f * r^x` for the xth lap. Remember: first lap (x=1) takes `f * r^0 = f` seconds.

## When You'll See This Pattern

This problem combines **dynamic programming with bounded transitions** and **precomputation of expensive operations**. Similar patterns appear in:

1. **Minimum Skips to Arrive at Meeting On Time (Hard)**: Also uses DP where you partition a journey into segments (driving intervals), with the optimization that you don't need to consider all possible segment lengths due to constraints.

2. **Coin Change (Medium)**: Uses DP to find minimum coins for an amount, with transitions based on coin denominations. The bounded segment length here is analogous to bounded coin values.

3. **Perfect Squares (Medium)**: Find minimum number of perfect squares that sum to n. You only need to consider squares up to √n, similar to how we only consider segments up to maxLaps.

The core pattern is: when a problem involves partitioning into segments where the cost of a segment can be precomputed, and there's a natural bound on segment sizes, use DP with bounded transitions.

## Key Takeaways

1. **Look for natural bounds in seemingly unbounded problems**: Geometric/exponential growth often provides practical limits. If something grows quickly enough, you only need to consider small cases.

2. **DP with precomputed segment costs**: When you need to partition into segments, precompute the minimum cost for each possible segment length, then use DP to find the optimal partition.

3. **Watch for off-by-one in change/transition costs**: When adding costs between segments, remember whether the first/last segment needs special handling.

Related problems: [Minimum Skips to Arrive at Meeting On Time](/problem/minimum-skips-to-arrive-at-meeting-on-time)
