---
title: "How to Solve Minimum Cost For Tickets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost For Tickets. Medium difficulty, 67.4% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-06-01"
category: "dsa-patterns"
tags: ["minimum-cost-for-tickets", "array", "dynamic-programming", "medium"]
---

# How to Solve Minimum Cost For Tickets

You're planning train travel for specific days throughout the year, and you need to buy passes that cover all your travel days. Passes come in three durations (1-day, 7-day, and 30-day) with different costs. The challenge is finding the minimum cost to cover all your travel days, where passes can be purchased in advance and cover future days. This problem is tricky because you need to consider overlapping coverage periods and make optimal decisions about when to buy which pass.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose:

- `days = [1, 4, 6, 7, 8, 20]`
- `costs = [2, 7, 15]` (1-day: $2, 7-day: $7, 30-day: $15)

We need to cover all travel days with passes. Let's think day by day:

**Day 1**: We must cover this day. Options:

- Buy 1-day pass: cost $2, covers day 1 only
- Buy 7-day pass: cost $7, covers days 1-7
- Buy 30-day pass: cost $15, covers days 1-30

**Day 4**: If we bought a 1-day pass on day 1, we need to cover day 4. But if we bought a 7-day pass on day 1, it already covers day 4!

**Day 6, 7, 8**: These are consecutive days. A 7-day pass starting on day 6 would cover days 6-12 for $7, which is cheaper than buying three 1-day passes ($6).

**Day 20**: Far from previous days, so likely needs its own pass.

The optimal strategy here is:

- Buy a 7-day pass on day 1: covers days 1, 4, 6, 7, 8 for $7
- Buy a 1-day pass on day 20: covers day 20 for $2
- Total: $9

This example shows we need to consider future coverage when making decisions today.

## Brute Force Approach

A naive approach would be to try all possible combinations of passes for each travel day. For each day, we could:

1. Try buying a 1-day pass that covers just that day
2. Try buying a 7-day pass that covers this day plus the next 6 days
3. Try buying a 30-day pass that covers this day plus the next 29 days

We'd recursively explore all possibilities and track the minimum cost. However, with 365 possible days and 3 choices at each step, this leads to exponential time complexity O(3^n) where n is the number of travel days. For the maximum case (365 travel days), this is completely infeasible.

Even a slightly better brute force would be to consider each day from 1 to 365 and decide whether to buy a pass on that day. But with 365 days and 3 pass types, we'd still have O(365 × 3^365) possibilities in the worst case.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem. We can build up the solution incrementally:

1. **State definition**: Let `dp[i]` represent the minimum cost to cover all travel days up to day `i` (where `i` ranges from 0 to 365).

2. **State transition**: For each day `i`:
   - If `i` is not a travel day, then `dp[i] = dp[i-1]` (no cost today)
   - If `i` is a travel day, we need to cover it. We have three options:
     - Buy a 1-day pass: `dp[i] = dp[i-1] + costs[0]`
     - Buy a 7-day pass: `dp[i] = dp[i-7] + costs[1]` (if `i-7 < 0`, use `dp[0]`)
     - Buy a 30-day pass: `dp[i] = dp[i-30] + costs[2]` (if `i-30 < 0`, use `dp[0]`)
   - Take the minimum of these three options

3. **Optimization**: We only need to track days up to the last travel day, not all 365 days. We can use a set for O(1) lookup of travel days.

4. **Alternative approach**: Instead of iterating through all 365 days, we can iterate only through travel days and use a queue to track when passes expire. This gives us O(n) time where n is the number of travel days.

## Optimal Solution

Here's the complete solution using dynamic programming with optimization for only necessary days:

<div class="code-group">

```python
# Time: O(W) where W is the last travel day (max 365)
# Space: O(W) for the dp array
def mincostTickets(days, costs):
    """
    Calculate minimum cost to cover all travel days with passes.

    Args:
        days: List of travel days (1-indexed, 1-365)
        costs: List of costs for [1-day, 7-day, 30-day] passes

    Returns:
        Minimum total cost
    """
    # Create a set for O(1) lookup of travel days
    travel_days = set(days)

    # dp[i] = min cost to cover days up to day i
    # We need up to the last travel day + 1
    last_day = days[-1]
    dp = [0] * (last_day + 1)

    # Iterate through all days from 1 to last_day
    for day in range(1, last_day + 1):
        if day not in travel_days:
            # Not a travel day, carry forward previous cost
            dp[day] = dp[day - 1]
        else:
            # Day is a travel day, need to cover it
            # Option 1: Buy 1-day pass
            cost1 = dp[day - 1] + costs[0]

            # Option 2: Buy 7-day pass (covers current day and previous 6)
            # If day < 7, pass covers from day 1, so cost is just pass cost
            cost7 = dp[max(0, day - 7)] + costs[1]

            # Option 3: Buy 30-day pass
            cost30 = dp[max(0, day - 30)] + costs[2]

            # Take the minimum of all options
            dp[day] = min(cost1, cost7, cost30)

    return dp[last_day]
```

```javascript
// Time: O(W) where W is the last travel day (max 365)
// Space: O(W) for the dp array
function mincostTickets(days, costs) {
  /**
   * Calculate minimum cost to cover all travel days with passes.
   *
   * @param {number[]} days - List of travel days (1-indexed, 1-365)
   * @param {number[]} costs - Costs for [1-day, 7-day, 30-day] passes
   * @return {number} Minimum total cost
   */

  // Create a Set for O(1) lookup of travel days
  const travelDays = new Set(days);

  // dp[i] = min cost to cover days up to day i
  const lastDay = days[days.length - 1];
  const dp = new Array(lastDay + 1).fill(0);

  // Iterate through all days from 1 to lastDay
  for (let day = 1; day <= lastDay; day++) {
    if (!travelDays.has(day)) {
      // Not a travel day, carry forward previous cost
      dp[day] = dp[day - 1];
    } else {
      // Day is a travel day, need to cover it
      // Option 1: Buy 1-day pass
      const cost1 = dp[day - 1] + costs[0];

      // Option 2: Buy 7-day pass
      // If day < 7, pass covers from day 1
      const cost7 = dp[Math.max(0, day - 7)] + costs[1];

      // Option 3: Buy 30-day pass
      const cost30 = dp[Math.max(0, day - 30)] + costs[2];

      // Take the minimum of all options
      dp[day] = Math.min(cost1, cost7, cost30);
    }
  }

  return dp[lastDay];
}
```

```java
// Time: O(W) where W is the last travel day (max 365)
// Space: O(W) for the dp array
class Solution {
    public int mincostTickets(int[] days, int[] costs) {
        /**
         * Calculate minimum cost to cover all travel days with passes.
         *
         * @param days - Array of travel days (1-indexed, 1-365)
         * @param costs - Costs for [1-day, 7-day, 30-day] passes
         * @return Minimum total cost
         */

        // Create a boolean array for O(1) lookup of travel days
        boolean[] isTravelDay = new boolean[366];
        for (int day : days) {
            isTravelDay[day] = true;
        }

        // dp[i] = min cost to cover days up to day i
        int lastDay = days[days.length - 1];
        int[] dp = new int[lastDay + 1];

        // Iterate through all days from 1 to lastDay
        for (int day = 1; day <= lastDay; day++) {
            if (!isTravelDay[day]) {
                // Not a travel day, carry forward previous cost
                dp[day] = dp[day - 1];
            } else {
                // Day is a travel day, need to cover it
                // Option 1: Buy 1-day pass
                int cost1 = dp[day - 1] + costs[0];

                // Option 2: Buy 7-day pass
                // If day < 7, pass covers from day 1
                int cost7 = dp[Math.max(0, day - 7)] + costs[1];

                // Option 3: Buy 30-day pass
                int cost30 = dp[Math.max(0, day - 30)] + costs[2];

                // Take the minimum of all options
                dp[day] = Math.min(cost1, Math.min(cost7, cost30));
            }
        }

        return dp[lastDay];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(W) where W is the last travel day (maximum 365). We iterate through each day from 1 to the last travel day once, performing constant-time operations at each step.

**Space Complexity**: O(W) for the DP array. We could optimize this to O(30) by only keeping the last 30 days in memory, but O(365) is acceptable given the constraints.

The key insight is that while we have 365 possible days, we only need to compute costs for days up to the last travel day, not all 365 days. This makes the solution efficient within the problem constraints.

## Common Mistakes

1. **Off-by-one errors with pass durations**: A 7-day pass covers 7 days including the purchase day, so if bought on day `i`, it covers days `i` through `i+6`. Many candidates mistakenly think it covers `i` through `i+7` or `i+1` through `i+7`.

2. **Forgetting to handle early days**: When `day < 7` or `day < 30`, we can't access `dp[day-7]` or `dp[day-30]`. We need to use `max(0, day-7)` and `max(0, day-30)` to handle these cases correctly.

3. **Incorrectly handling non-travel days**: On non-travel days, the cost should equal the previous day's cost (`dp[day] = dp[day-1]`), not zero. Some candidates mistakenly set it to zero or skip these days entirely.

4. **Using greedy approach**: This problem looks like it could be solved greedily (always buy the pass with best value per day), but that doesn't work. For example, with `days = [1, 4, 6, 7, 8, 20]` and `costs = [2, 7, 15]`, a greedy approach might buy a 30-day pass on day 1 ($15), but the optimal is a 7-day pass on day 1 plus a 1-day pass on day 20 ($9).

## When You'll See This Pattern

This type of **interval covering with dynamic programming** appears in several problems:

1. **Coin Change (LeetCode 322)**: Similar state transition where you consider different "denominations" (pass durations) to cover a "target" (travel days).

2. **Maximum Profit in Job Scheduling (LeetCode 1235)**: Also involves intervals with costs/values, requiring DP with careful state transitions.

3. **House Robber (LeetCode 198)**: Simpler version where you make decisions at each house (day) based on previous states.

The pattern is: when you have decisions that affect future states (like a pass covering multiple days), and you need to find an optimal sequence of decisions, dynamic programming with careful state definition is often the solution.

## Key Takeaways

1. **Recognize interval coverage problems**: When a decision today affects multiple future time periods, think about dynamic programming where `dp[i]` represents the optimal cost up to time `i`.

2. **Handle edge cases systematically**: Always check what happens at boundaries (day 1, days less than pass duration) and with non-action days (non-travel days in this case).

3. **Consider time-space tradeoffs**: While we used O(W) space here, we could optimize to O(30) by only storing the last 30 days. In interviews, mention both approaches and their tradeoffs.

Related problems: [Coin Change](/problem/coin-change), [Most Expensive Item That Can Not Be Bought](/problem/most-expensive-item-that-can-not-be-bought)
