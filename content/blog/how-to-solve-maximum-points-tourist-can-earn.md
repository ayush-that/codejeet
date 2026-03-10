---
title: "How to Solve Maximum Points Tourist Can Earn — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Points Tourist Can Earn. Medium difficulty, 47.5% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2030-03-09"
category: "dsa-patterns"
tags: ["maximum-points-tourist-can-earn", "array", "dynamic-programming", "matrix", "medium"]
---

# How to Solve Maximum Points Tourist Can Earn

You need to find the maximum points a tourist can earn over exactly `k` days visiting `n` cities, where each day they either stay in their current city (earning `stayScore[day][city]`) or travel to a different city (earning `travelScore[day][from][to]`). The challenge is that with `n` cities and `k` days, the number of possible journeys grows exponentially — you can't try them all. This problem is interesting because it looks like a classic dynamic programming problem, but the 2D travel score matrix adds complexity that requires careful state tracking.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- `n = 2` cities (0 and 1)
- `k = 3` days (days 0, 1, 2)
- `stayScore = [[1, 2], [3, 4], [5, 6]]` (day × city)
- `travelScore = [[[0, 1], [2, 0]], [[0, 3], [4, 0]], [[0, 5], [6, 0]]]` (day × from × to)

**Day 0 (starting day):**

- The tourist starts in city 0 or 1 (we'll try both)
- If start in city 0: earn `stayScore[0][0] = 1`
- If start in city 1: earn `stayScore[0][1] = 2`

**Day 1:**
For each possible city from day 0:

- From city 0:
  - Stay in city 0: earn `stayScore[1][0] = 3` → total = 1 + 3 = 4
  - Travel to city 1: earn `travelScore[1][0][1] = 3` → total = 1 + 3 = 4
- From city 1:
  - Stay in city 1: earn `stayScore[1][1] = 4` → total = 2 + 4 = 6
  - Travel to city 0: earn `travelScore[1][1][0] = 4` → total = 2 + 4 = 6

**Day 2:**
We continue similarly, tracking the maximum for each ending city:

- From (day1, city0, total=4):
  - Stay: 4 + `stayScore[2][0]` = 4 + 5 = 9
  - Travel: 4 + `travelScore[2][0][1]` = 4 + 5 = 9
- From (day1, city0, total=4) [same as above, different path]:
  - Stay: 4 + 5 = 9
  - Travel: 4 + 5 = 9
- From (day1, city1, total=6):
  - Stay: 6 + `stayScore[2][1]` = 6 + 6 = 12
  - Travel: 6 + `travelScore[2][1][0]` = 6 + 6 = 12

Maximum at the end: **12** (ending in either city with that total).

This shows we need to track, for each day and each city, the maximum points achievable.

## Brute Force Approach

A naive solution would try all possible sequences of cities over `k` days. For each day, you have `n` choices (any city), so there are `n^k` possible journeys. For each journey, you'd sum up the scores:

- Day 0: `stayScore[0][city0]` (starting city)
- Day i > 0: if city same as previous, add `stayScore[i][city]`; else add `travelScore[i][prevCity][currentCity]`

This brute force approach has exponential time complexity `O(n^k * k)` (the `* k` comes from summing scores for each day of each journey). Even for modest `n=10` and `k=10`, that's 10 billion possibilities — completely infeasible.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with overlapping subproblems. The optimal solution for day `i` ending in city `c` depends only on:

1. The maximum points achievable on day `i-1` for each possible previous city `p`
2. Whether we stayed (`c == p`) or traveled (`c != p`) from `p` to `c`

We can define:

- `dp[day][city]` = maximum points achievable by day `day` ending in `city`

Transition formula:

- For day 0: `dp[0][city] = stayScore[0][city]` (starting points)
- For day i > 0: `dp[i][city] = max over all prevCity of:`
  - If `city == prevCity`: `dp[i-1][prevCity] + stayScore[i][city]`
  - If `city != prevCity`: `dp[i-1][prevCity] + travelScore[i][prevCity][city]`

We need to compute this for all `i` from 0 to `k-1` and all cities. The answer is `max(dp[k-1][city])` over all cities.

This reduces the complexity from exponential to polynomial: `O(k * n^2)` time and `O(k * n)` space.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(k * n^2) - We iterate through k days, and for each day and city,
#                    we check all n previous cities
# Space: O(k * n) - We store a 2D DP table of size k x n
def maxPoints(n, k, stayScore, travelScore):
    # dp[day][city] = max points achievable by day 'day' ending in 'city'
    dp = [[0] * n for _ in range(k)]

    # Day 0: starting points (tourist must start in some city)
    for city in range(n):
        dp[0][city] = stayScore[0][city]

    # Fill DP table for days 1 to k-1
    for day in range(1, k):
        for current_city in range(n):
            # Initialize with a very small number (or -inf)
            max_points = float('-inf')

            # Check all possible previous cities we could have come from
            for prev_city in range(n):
                if current_city == prev_city:
                    # Stayed in the same city
                    points = dp[day-1][prev_city] + stayScore[day][current_city]
                else:
                    # Traveled from prev_city to current_city
                    points = dp[day-1][prev_city] + travelScore[day][prev_city][current_city]

                # Update maximum for this (day, current_city)
                max_points = max(max_points, points)

            dp[day][current_city] = max_points

    # Answer is the maximum points achievable by the last day (day k-1)
    # in any city
    return max(dp[k-1])

# Example usage (same as visual walkthrough):
n = 2
k = 3
stayScore = [[1, 2], [3, 4], [5, 6]]
travelScore = [[[0, 1], [2, 0]], [[0, 3], [4, 0]], [[0, 5], [6, 0]]]
print(maxPoints(n, k, stayScore, travelScore))  # Output: 12
```

```javascript
// Time: O(k * n^2) - We iterate through k days, and for each day and city,
//                    we check all n previous cities
// Space: O(k * n) - We store a 2D DP table of size k x n
function maxPoints(n, k, stayScore, travelScore) {
  // dp[day][city] = max points achievable by day 'day' ending in 'city'
  const dp = Array(k)
    .fill()
    .map(() => Array(n).fill(0));

  // Day 0: starting points (tourist must start in some city)
  for (let city = 0; city < n; city++) {
    dp[0][city] = stayScore[0][city];
  }

  // Fill DP table for days 1 to k-1
  for (let day = 1; day < k; day++) {
    for (let currentCity = 0; currentCity < n; currentCity++) {
      // Initialize with a very small number
      let maxPoints = -Infinity;

      // Check all possible previous cities we could have come from
      for (let prevCity = 0; prevCity < n; prevCity++) {
        let points;
        if (currentCity === prevCity) {
          // Stayed in the same city
          points = dp[day - 1][prevCity] + stayScore[day][currentCity];
        } else {
          // Traveled from prevCity to currentCity
          points = dp[day - 1][prevCity] + travelScore[day][prevCity][currentCity];
        }

        // Update maximum for this (day, currentCity)
        maxPoints = Math.max(maxPoints, points);
      }

      dp[day][currentCity] = maxPoints;
    }
  }

  // Answer is the maximum points achievable by the last day (day k-1)
  // in any city
  return Math.max(...dp[k - 1]);
}

// Example usage:
const n = 2;
const k = 3;
const stayScore = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const travelScore = [
  [
    [0, 1],
    [2, 0],
  ],
  [
    [0, 3],
    [4, 0],
  ],
  [
    [0, 5],
    [6, 0],
  ],
];
console.log(maxPoints(n, k, stayScore, travelScore)); // Output: 12
```

```java
// Time: O(k * n^2) - We iterate through k days, and for each day and city,
//                    we check all n previous cities
// Space: O(k * n) - We store a 2D DP table of size k x n
public class Solution {
    public int maxPoints(int n, int k, int[][] stayScore, int[][][] travelScore) {
        // dp[day][city] = max points achievable by day 'day' ending in 'city'
        int[][] dp = new int[k][n];

        // Day 0: starting points (tourist must start in some city)
        for (int city = 0; city < n; city++) {
            dp[0][city] = stayScore[0][city];
        }

        // Fill DP table for days 1 to k-1
        for (int day = 1; day < k; day++) {
            for (int currentCity = 0; currentCity < n; currentCity++) {
                // Initialize with a very small number
                int maxPoints = Integer.MIN_VALUE;

                // Check all possible previous cities we could have come from
                for (int prevCity = 0; prevCity < n; prevCity++) {
                    int points;
                    if (currentCity == prevCity) {
                        // Stayed in the same city
                        points = dp[day-1][prevCity] + stayScore[day][currentCity];
                    } else {
                        // Traveled from prevCity to currentCity
                        points = dp[day-1][prevCity] + travelScore[day][prevCity][currentCity];
                    }

                    // Update maximum for this (day, currentCity)
                    maxPoints = Math.max(maxPoints, points);
                }

                dp[day][currentCity] = maxPoints;
            }
        }

        // Answer is the maximum points achievable by the last day (day k-1)
        // in any city
        int result = Integer.MIN_VALUE;
        for (int city = 0; city < n; city++) {
            result = Math.max(result, dp[k-1][city]);
        }
        return result;
    }

    // Example usage:
    public static void main(String[] args) {
        Solution sol = new Solution();
        int n = 2;
        int k = 3;
        int[][] stayScore = {{1, 2}, {3, 4}, {5, 6}};
        int[][][] travelScore = {{{0, 1}, {2, 0}}, {{0, 3}, {4, 0}}, {{0, 5}, {6, 0}}};
        System.out.println(sol.maxPoints(n, k, stayScore, travelScore));  // Output: 12
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k × n²)**

- We have `k` days to process
- For each day, we iterate through all `n` cities as current city
- For each current city, we check all `n` possible previous cities
- Total: `k × n × n = k × n²` operations

**Space Complexity: O(k × n)**

- We store a DP table of size `k × n`
- We could optimize to `O(n)` by only storing the previous day's results, but the problem constraints typically make `k × n` manageable

## Common Mistakes

1. **Off-by-one errors with day indexing**: The problem says "exactly k 0-indexed days." Day 0 is the first day. Some candidates start with day 1 or try to access `travelScore[k]` instead of `travelScore[k-1]`. Always trace with the example to verify.

2. **Forgetting that travelScore is 3D**: The travel score depends on the day AND the from-city AND the to-city. A common mistake is using `travelScore[from][to]` instead of `travelScore[day][from][to]`.

3. **Initializing DP incorrectly for day 0**: On day 0, you can only earn the stay score for your starting city. Some candidates try to incorporate travel on day 0, but you can't travel before you've started somewhere.

4. **Not handling the "stay" case separately**: When current city equals previous city, you add `stayScore`, not `travelScore[prev][prev]` (which might be 0 or undefined). These are different score sources.

## When You'll See This Pattern

This type of dynamic programming with state transitions based on previous choices appears in many problems:

1. **House Robber II (LeetCode 213)**: Similar state tracking where you can't rob adjacent houses, but with a circular arrangement. The "stay/travel" decision is analogous to "rob/skip."

2. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)**: You track states (hold, sold, cooldown) and transition between them each day, similar to tracking which city you're in.

3. **Minimum Path Sum (LeetCode 64)**: Grid DP where you can only move right or down, with accumulation of scores. This problem is like a more complex version where you can "move" to any city.

The pattern is: when you have a sequence of decisions (days) and your score depends on both your current choice and previous state, DP with state tracking is the solution.

## Key Takeaways

1. **Recognize sequence + state problems**: When you have a sequence of steps (days) and your options at each step depend on your previous state (which city you're in), think dynamic programming with a 2D table `dp[step][state]`.

2. **Define clear transition rules**: Write out the exact formula for how to compute `dp[i][j]` from `dp[i-1][*]`. This often involves taking a maximum over all possible previous states.

3. **Watch for 0-indexing in problem statements**: Many problems use 0-indexed days/cities. Always check the first and last indices in your loops.

[Practice this problem on CodeJeet](/problem/maximum-points-tourist-can-earn)
