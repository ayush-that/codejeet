---
title: "Dynamic Programming Questions at Intuit: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Intuit — patterns, difficulty breakdown, and study tips."
date: "2028-10-25"
category: "dsa-patterns"
tags: ["intuit", "dynamic-programming", "interview prep"]
---

If you're preparing for a software engineering interview at Intuit, you've likely seen the statistic: they have 21 Dynamic Programming (DP) questions tagged in their LeetCode company list out of a total of 71. That's nearly 30%. This isn't a quirk of their question bank; it's a signal. Intuit, a company built on complex financial software (TurboTax, QuickBooks, Mailchimp), deals with optimization problems daily—maximizing deductions, minimizing tax liability, optimizing campaign budgets, and scheduling transactions. The logical, step-by-step, state-based reasoning required for DP is directly analogous to building robust, efficient financial engines. In a real Intuit interview, you can expect at least one DP question in the technical rounds, often as the second or main coding problem. It's not a secondary topic; it's a core assessment of your ability to model a problem, identify overlapping subproblems, and build an efficient solution from the ground up.

## Specific Patterns Intuit Favors

Intuit's DP questions rarely involve obscure graph theory or complex state compression. They favor **practical, iterative DP on arrays and strings** that model real-world constraints. You'll see a heavy emphasis on:

1.  **Classic 1D/2D Knapsack Variations:** The "bounded resource" pattern is everywhere in finance. Think: maximizing profit with a budget (knapsack), making change (coin change), or partitioning resources.
2.  **String/Sequence Alignment & Comparison:** Useful for data matching, transaction categorization, or document comparison.
3.  **State Machine DP:** Problems where your state depends not just on position but on a specific status (e.g., cooldown periods, holding stock). This tests your ability to manage multiple decision paths.

Look for problems like **Coin Change (#322)**, **Partition Equal Subset Sum (#416)**, **Longest Common Subsequence (#1143)**, and **Best Time to Buy and Sell Stock with Cooldown (#309)**. They prefer iterative, bottom-up tabulation over recursive memoization in interviews because it's easier to walk through, explain, and analyze for space optimization.

## How to Prepare

The key is to internalize the framework, not just memorize problems. For any DP problem, practice stating: 1) The meaning of `dp[i]` (or `dp[i][j]`), 2) The base case(s), 3) The recurrence relation, and 4) The order of iteration.

Let's look at the most common pattern: the **1D Knapsack (Subset Sum)**. The problem "Partition Equal Subset Sum (#416)" is a perfect example. Can we partition an array into two subsets with equal sums?

<div class="code-group">

```python
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2

    # dp[j] will be True if a subset with sum 'j' can be formed
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum of 0 is always possible (empty subset)

    for num in nums:
        # Iterate backwards to avoid re-using the same num in the same round
        for j in range(target, num - 1, -1):
            # Either we don't take num (dp[j]) or we take it (dp[j - num])
            dp[j] = dp[j] or dp[j - num]
    return dp[target]
# Time: O(n * target) | Space: O(target)
```

```javascript
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  // dp[j] = true if sum 'j' is achievable
  const dp = new Array(target + 1).fill(false);
  dp[0] = true; // Base case

  for (const num of nums) {
    // Iterate backwards to prevent overwriting states for this num
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }
  return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

```java
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;
    if (total % 2 != 0) return false;
    int target = total / 2;

    boolean[] dp = new boolean[target + 1];
    dp[0] = true; // Base case

    for (int num : nums) {
        // Iterate backwards to ensure each num is used at most once per subset
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

</div>

Another critical pattern is **State Machine DP**, common in transaction problems. Let's examine "Best Time to Buy and Sell Stock with Cooldown (#309)".

<div class="code-group">

```python
def maxProfit(prices):
    if not prices:
        return 0

    # State definitions:
    # hold: max profit if we are holding a stock on day i
    # sold: max profit if we sold a stock on day i (enters cooldown)
    # rest: max profit if we are in cooldown or idle on day i
    hold, sold, rest = -float('inf'), 0, 0

    for price in prices:
        prev_hold, prev_sold, prev_rest = hold, sold, rest
        # Can stay holding, or buy today (from rest state)
        hold = max(prev_hold, prev_rest - price)
        # Sold today, so we must have been holding yesterday
        sold = prev_hold + price
        # Rest today: either stayed resting, or just finished cooldown from sold
        rest = max(prev_rest, prev_sold)

    # Max profit will be in either sold or rest state (not holding)
    return max(sold, rest)
# Time: O(n) | Space: O(1)
```

```javascript
function maxProfit(prices) {
  if (prices.length === 0) return 0;

  let hold = -Infinity; // Holding a stock
  let sold = 0; // Just sold, in cooldown next day
  let rest = 0; // Cooldown or idle

  for (let price of prices) {
    let prevHold = hold,
      prevSold = sold,
      prevRest = rest;
    hold = Math.max(prevHold, prevRest - price);
    sold = prevHold + price;
    rest = Math.max(prevRest, prevSold);
  }
  return Math.max(sold, rest);
}
// Time: O(n) | Space: O(1)
```

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;

    int hold = Integer.MIN_VALUE; // Holding a stock
    int sold = 0;                 // Just sold
    int rest = 0;                 // Cooldown or idle

    for (int price : prices) {
        int prevHold = hold, prevSold = sold, prevRest = rest;
        hold = Math.max(prevHold, prevRest - price);
        sold = prevHold + price;
        rest = Math.max(prevRest, prevSold);
    }
    return Math.max(sold, rest);
}
// Time: O(n) | Space: O(1)
```

</div>

## How Intuit Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Intuit's DP questions tend to be more "applied" and less "academic." At Google or Meta, you might get a DP problem disguised as a novel graph or game theory puzzle. At Intuit, the problem statement often feels closer to a business logic constraint. The difficulty is similar to mid-to-high LeetCode medium; you're unlikely to see a "hard" DP problem requiring 3D states or complex bitmasking. What's unique is the interviewer's focus on **trade-offs and clarity**. They want you to explain why DP is the right approach (optimal substructure, overlapping subproblems), walk through your DP table with a small example, and discuss space optimization. They care that you can translate a business rule into a recurrence relation.

## Study Order

Don't jump into the hardest problems. Build your intuition sequentially:

1.  **Foundation: Fibonacci & Climbing Stairs (#70).** Learn the core concept of a recurrence relation and memoization vs. tabulation.
2.  **1D Linear DP:** Path problems like **Minimum Path Sum (#64)** and **Decode Ways (#91)**. These solidify the "state depends on previous states" idea.
3.  **Classic Knapsack & Variations:** Start with **Coin Change (#322)** (unbounded) and **Partition Equal Subset Sum (#416)** (0/1). This is the heart of Intuit's DP catalog.
4.  **String Comparison DP:** **Longest Common Subsequence (#1143)** and **Edit Distance (#72)**. Master building the 2D table and deriving the relation.
5.  **State Machine DP:** **Best Time to Buy and Sell Stock with Cooldown (#309)**. This teaches you to manage multiple decision states.
6.  **(Optional) Advanced 2D/Interval DP:** Problems like **Burst Balloons (#312)** if you have extra time, but these are less frequent.

This order works because each step introduces one new major complexity: from simple recurrence to resource constraints (knapsack), to two-sequence comparison, to multi-state decisions.

## Recommended Practice Order

Solve these Intuit-tagged problems in this sequence to build confidence:

1.  Climbing Stairs (#70) - Warm-up
2.  Coin Change (#322) - Unbounded knapsack
3.  Partition Equal Subset Sum (#416) - 0/1 knapsack
4.  Longest Common Subsequence (#1143) - String/2D DP
5.  Best Time to Buy and Sell Stock with Cooldown (#309) - State machine
6.  Edit Distance (#72) - Classic 2D application
7.  Word Break (#139) - A slightly different take on sequence DP

Master these, and you'll be able to deconstruct almost any DP problem Intuit throws at you. Remember, they're testing your structured problem-solving, not your ability to recall an obscure algorithm. Practice explaining your DP table out loud as you code.

[Practice Dynamic Programming at Intuit](/company/intuit/dynamic-programming)
