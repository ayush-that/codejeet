---
title: "Dynamic Programming Questions at MakeMyTrip: What to Expect"
description: "Prepare for Dynamic Programming interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-07"
category: "dsa-patterns"
tags: ["makemytrip", "dynamic-programming", "interview prep"]
---

If you're preparing for a software engineering interview at MakeMyTrip, you've likely seen the stats: 9 out of their 24 tagged LeetCode problems are Dynamic Programming (DP). That's a significant 37.5% of their problem set. This isn't a coincidence or a quirk of the tagging system. It signals a deliberate focus. In my experience conducting and analyzing interviews, MakeMyTrip uses DP not just to test algorithmic knowledge, but to evaluate a candidate's ability to break down complex, real-world optimization problems—like pricing algorithms, route optimization, or inventory management—into manageable, efficient solutions. They want engineers who can think in terms of overlapping subproblems and optimal substructure, because that's how you build scalable systems that save the company money and improve user experience. Expect at least one medium-to-hard DP question in your technical rounds.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's DP questions aren't about obscure theoretical puzzles. They lean heavily towards **iterative, bottom-up DP on arrays and strings**, often with a clear sequential or "choice" element. You'll rarely see matrix DP or highly abstract state definitions here. Their problems often feel like classic combinatorial optimization: "What's the minimum cost?" or "How many ways are there?" applied to practical scenarios.

Two patterns dominate:

1.  **1D DP with State:** Problems where your `dp[i]` represents the best answer for the first `i` elements, but the recurrence requires looking back more than one step or considering a "state" (like holding a stock or having a coupon). **House Robber (#198)** and its variants are the archetype.
2.  **String/Sequence Alignment & Comparison:** This is a major theme. Think **Edit Distance (#72)** and **Longest Common Subsequence (#1143)**. These problems test your ability to model the relationship between two sequences (e.g., matching user search queries to destination names, calculating similarity).

They occasionally dip into **2D DP for strings** (like the classic interleaving string problem) and **DP on intervals**, but the core is 1D and sequence comparison. Recursive top-down with memoization is acceptable, but interviewers often push for the space-optimized iterative bottom-up solution, as it demonstrates a deeper understanding of the state transitions.

## How to Prepare

The key is to master the state transition for the 1D pattern. Let's look at a generalized "minimum cost with at most k steps back" pattern, which covers problems like **Minimum Cost For Tickets (#983)** and **Climbing Stairs (#70)**.

The mental model: You have a sequence of decisions (days, stairs, houses). At point `i`, your optimal cost `dp[i]` is derived from the optimal costs at previous points `i - step`, plus the cost of the action that gets you from there to `i`. You must define what the "step" options are.

<div class="code-group">

```python
# Pattern: 1D DP with multiple look-back steps (e.g., Min Cost for Tickets)
# Time: O(n * k) where n = days length, k = pass durations (e.g., 3)
# Space: O(n) for the dp array, often optimizable to O(max_duration)
def mincostTickets(days, costs):
    """
    days: sorted list of travel days (1-indexed)
    costs: [1-day pass cost, 7-day pass cost, 30-day pass cost]
    """
    last_day = days[-1]
    # dp[i] = min cost to travel up to day i
    dp = [0] * (last_day + 1)

    travel_days = set(days)  # for O(1) look-up

    for day in range(1, last_day + 1):
        if day not in travel_days:
            dp[day] = dp[day - 1]  # no travel, cost carries over
        else:
            # The recurrence: min cost if we bought a pass ending today.
            # We look back to the day *before* the pass would have started.
            cost1 = dp[day - 1] + costs[0]          # 1-day pass
            cost7 = dp[max(0, day - 7)] + costs[1]  # 7-day pass
            cost30 = dp[max(0, day - 30)] + costs[2] # 30-day pass
            dp[day] = min(cost1, cost7, cost30)
    return dp[last_day]
```

```javascript
// Pattern: 1D DP with multiple look-back steps
// Time: O(n * k) | Space: O(n)
function mincostTickets(days, costs) {
  const lastDay = days[days.length - 1];
  const dp = new Array(lastDay + 1).fill(0);
  const travelSet = new Set(days);

  for (let day = 1; day <= lastDay; day++) {
    if (!travelSet.has(day)) {
      dp[day] = dp[day - 1];
    } else {
      const cost1 = dp[day - 1] + costs[0];
      const cost7 = dp[Math.max(0, day - 7)] + costs[1];
      const cost30 = dp[Math.max(0, day - 30)] + costs[2];
      dp[day] = Math.min(cost1, cost7, cost30);
    }
  }
  return dp[lastDay];
}
```

```java
// Pattern: 1D DP with multiple look-back steps
// Time: O(n * k) | Space: O(n)
public int mincostTickets(int[] days, int[] costs) {
    int lastDay = days[days.length - 1];
    int[] dp = new int[lastDay + 1];
    boolean[] travelDay = new boolean[lastDay + 1];
    for (int day : days) travelDay[day] = true;

    for (int day = 1; day <= lastDay; day++) {
        if (!travelDay[day]) {
            dp[day] = dp[day - 1];
        } else {
            int cost1 = dp[day - 1] + costs[0];
            int cost7 = dp[Math.max(0, day - 7)] + costs[1];
            int cost30 = dp[Math.max(0, day - 30)] + costs[2];
            dp[day] = Math.min(cost1, Math.min(cost7, cost30));
        }
    }
    return dp[lastDay];
}
```

</div>

For string comparison, the pattern is a classic 2D DP grid. The insight is that `dp[i][j]` represents the answer for the first `i` chars of `text1` and first `j` chars of `text2`.

<div class="code-group">

```python
# Pattern: 2D DP for String Comparison (Longest Common Subsequence)
# Time: O(m * n) | Space: O(m * n)
def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    # dp[i][j] = LCS length for text1[:i] and text2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                # Characters match, extend the LCS from the previous prefix
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                # Take the best LCS by skipping a char from either string
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
```

```javascript
// Pattern: 2D DP for String Comparison (Longest Common Subsequence)
// Time: O(m * n) | Space: O(m * n)
function longestCommonSubsequence(text1, text2) {
  const m = text1.length,
    n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

```java
// Pattern: 2D DP for String Comparison (Longest Common Subsequence)
// Time: O(m * n) | Space: O(m * n)
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}
```

</div>

## How MakeMyTrip Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, MakeMyTrip's DP questions are less about clever "ah-ha!" moments and more about **methodical application of known patterns to a business-logic wrapper**. At Google, you might get a DP problem disguised as a game on a bizarre graph. At MakeMyTrip, the problem statement will often directly describe a travel or e-commerce scenario. The challenge is not in recognizing that it's DP (that's usually clear), but in correctly modeling the state and recurrence.

The difficulty is consistently in the **medium range** on LeetCode's scale. You won't often see "hard" problems that require 3D DP or complex state compression. However, they do expect clean, optimal, and well-explained code. The interviewer will likely ask for a walkthrough of your DP table with a small example to verify your understanding. Be prepared to discuss space optimization (e.g., going from O(n²) to O(n) in string problems).

## Study Order

Don't jump into MakeMyTrip's hardest tagged problems first. Build your foundation sequentially.

1.  **Foundation - Simple 1D DP:** Start with **Climbing Stairs (#70)** and **House Robber (#198)**. These teach you the core concept: `dp[i]` depends on a few previous states. Master the recurrence before moving on.
2.  **1D DP with Choices:** Progress to problems where at each step you have multiple "purchase" or "action" options, like **Minimum Cost For Tickets (#983)** and **Best Time to Buy and Sell Stock with Cooldown (#309)**. This is the heart of the MakeMyTrip pattern.
3.  **String Comparison DP:** Learn the 2D grid approach with **Longest Common Subsequence (#1143)** and **Edit Distance (#72)**. Practice drawing the 2D table.
4.  **2D DP on Arrays/Matrices:** Touch on **Unique Paths (#62)** and **Minimum Path Sum (#64)** to understand moving through a grid. This is less common but good background.
5.  **Knapsack & Partition Problems:** Finally, study the classic **0/1 Knapsack** pattern and **Partition Equal Subset Sum (#416)**. These introduce the concept of a DP dimension representing a "capacity" or "target sum," which can appear in optimization scenarios.

## Recommended Practice Order

Solve these problems in this sequence to build the specific skills MakeMyTrip tests:

1.  Climbing Stairs (#70) - The absolute basic.
2.  House Robber (#198) - Introduces the "skip one" lookback.
3.  Min Cost Climbing Stairs (#746) - Simple cost minimization.
4.  **Minimum Cost For Tickets (#983)** - _Crucial_. This is the archetypal MakeMyTrip problem with multiple look-back choices.
5.  Longest Common Subsequence (#1143) - Learn the 2D string grid.
6.  Edit Distance (#72) - A harder but essential string DP.
7.  Best Time to Buy and Sell Stock with Cooldown (#309) - Excellent for learning to define states (`hold`, `sold`, `cooldown`).
8.  Coin Change (#322) - Introduces the "unbounded knapsack" or "minimum coins" pattern.
9.  **Decode Ways (#91)** - A classic MakeMyTrip problem that combines 1D DP with string parsing and conditional lookbacks.

This progression moves from simple recurrence to handling multiple choices, then to 2D string problems, and finally to more complex state management. By the end, you'll have covered the exact patterns that MakeMyTrip's interviewers favor.

[Practice Dynamic Programming at MakeMyTrip](/company/makemytrip/dynamic-programming)
