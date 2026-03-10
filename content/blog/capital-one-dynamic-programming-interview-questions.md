---
title: "Dynamic Programming Questions at Capital One: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Capital One — patterns, difficulty breakdown, and study tips."
date: "2029-03-28"
category: "dsa-patterns"
tags: ["capital-one", "dynamic-programming", "interview prep"]
---

## Why Dynamic Programming Matters at Capital One

You might be surprised to learn that Capital One, a financial institution, asks dynamic programming (DP) questions in technical interviews. With 6 out of their 57 tagged LeetCode problems being DP-related, that's about 10% of their problem bank. In practice, DP questions appear in roughly 1 out of every 4-5 onsite interviews for software engineering roles, particularly for positions involving backend systems, data pipelines, or fraud detection algorithms.

The reason isn't that Capital One engineers are solving knapsack problems daily. It's that DP tests two critical skills for financial systems: **optimal decision-making under constraints** and **efficient computation on large datasets**. Whether you're optimizing transaction routing, minimizing risk exposure, or calculating compound interest scenarios, you're essentially looking for the most valuable outcome given limited resources—the exact thinking pattern DP formalizes.

## Specific Patterns Capital One Favors

Capital One's DP questions tend to cluster around three practical patterns rather than theoretical computer science puzzles:

1. **1D/2D Array DP for Sequence Problems** - These mirror financial planning scenarios. Think: maximizing profit over time with constraints (like "Best Time to Buy and Sell Stock" variants) or calculating ways to make change (the classic coin change problem).

2. **String/Subsequence DP** - Useful for text processing in financial documents, transaction matching, or name validation. Longest Common Subsequence (#1143) and Edit Distance (#72) appear in modified forms.

3. **Partition/Decision DP** - Problems where you split data into optimal groupings. "Partition Equal Subset Sum" (#416) is a favorite because it directly relates to balancing loads or dividing resources evenly.

Notice what's missing: complex graph DP (like traveling salesman), tree DP, or probability-based DP. Capital One stays close to business applications. Their problems are almost exclusively **iterative bottom-up DP** rather than recursive memoization—they want to see you build solutions from the ground up, reflecting how you'd process actual financial data batches.

## How to Prepare

The key insight for Capital One DP questions is recognizing the **state definition** quickly. Their problems often disguise classic patterns with financial terminology. When you see "maximum profit," think knapsack. When you see "number of ways," think coin change or climb stairs.

Let's examine the most common pattern: the 1D DP array for sequence decisions. Here's the template for "Best Time to Buy and Sell Stock with Cooldown" (#309), which captures the buy/sell/rest state machine common in trading systems:

<div class="code-group">

```python
def maxProfit(prices):
    """
    State machine DP with three states:
    hold[i] - max profit holding stock at day i
    sold[i] - max profit just sold at day i
    rest[i] - max profit in cooldown at day i
    """
    if not prices:
        return 0

    n = len(prices)
    hold = [0] * n
    sold = [0] * n
    rest = [0] * n

    # Base cases
    hold[0] = -prices[0]  # Buy on day 0
    sold[0] = float('-inf')  # Can't sell on day 0
    rest[0] = 0  # Do nothing

    for i in range(1, n):
        # Continue holding or buy today (from rest state)
        hold[i] = max(hold[i-1], rest[i-1] - prices[i])
        # Sell today (must have been holding)
        sold[i] = hold[i-1] + prices[i]
        # Continue resting or come from sold (cooldown)
        rest[i] = max(rest[i-1], sold[i-1])

    return max(sold[n-1], rest[n-1])

# Time: O(n) | Space: O(n) (can be optimized to O(1))
```

```javascript
function maxProfit(prices) {
  if (!prices.length) return 0;

  const n = prices.length;
  const hold = new Array(n).fill(0);
  const sold = new Array(n).fill(0);
  const rest = new Array(n).fill(0);

  // Base cases
  hold[0] = -prices[0];
  sold[0] = -Infinity;
  rest[0] = 0;

  for (let i = 1; i < n; i++) {
    hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
    sold[i] = hold[i - 1] + prices[i];
    rest[i] = Math.max(rest[i - 1], sold[i - 1]);
  }

  return Math.max(sold[n - 1], rest[n - 1]);
}

// Time: O(n) | Space: O(n)
```

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;

    int n = prices.length;
    int[] hold = new int[n];
    int[] sold = new int[n];
    int[] rest = new int[n];

    // Base cases
    hold[0] = -prices[0];
    sold[0] = Integer.MIN_VALUE;
    rest[0] = 0;

    for (int i = 1; i < n; i++) {
        hold[i] = Math.max(hold[i-1], rest[i-1] - prices[i]);
        sold[i] = hold[i-1] + prices[i];
        rest[i] = Math.max(rest[i-1], sold[i-1]);
    }

    return Math.max(sold[n-1], rest[n-1]);
}

// Time: O(n) | Space: O(n)
```

</div>

For partition problems like "Partition Equal Subset Sum" (#416), recognize it's essentially a knapsack where capacity = sum/2:

<div class="code-group">

```python
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False

    target = total // 2
    # dp[i] = whether sum i can be formed
    dp = [False] * (target + 1)
    dp[0] = True  # Empty set sums to 0

    for num in nums:
        # Iterate backwards to avoid reusing same element
        for i in range(target, num - 1, -1):
            if dp[i - num]:
                dp[i] = True

    return dp[target]

# Time: O(n * target) | Space: O(target)
```

```javascript
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;

  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let i = target; i >= num; i--) {
      if (dp[i - num]) {
        dp[i] = true;
      }
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
    dp[0] = true;

    for (int num : nums) {
        for (int i = target; i >= num; i--) {
            if (dp[i - num]) {
                dp[i] = true;
            }
        }
    }

    return dp[target];
}

// Time: O(n * target) | Space: O(target)
```

</div>

## How Capital One Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Capital One's DP questions are more **applied** and less **theoretical**. At Google, you might get a DP problem on a novel graph structure. At Capital One, you'll get a classic DP pattern dressed in financial clothing. The difficulty is medium—rarely hard—but they expect clean, efficient implementations.

What's unique: Capital One interviewers often ask **follow-up optimization questions**. After you solve the basic DP, expect: "Can we reduce the space complexity?" or "What if we had memory constraints?" They care about practical efficiency, not just correctness. Also, they're more likely to accept a brute-force explanation followed by DP optimization, showing your problem-solving process.

## Study Order

1. **Fibonacci & Climbing Stairs** (#70) - Learn the basic recurrence relation and memoization vs tabulation.
2. **0/1 Knapsack** - Understand the classic "include/exclude" decision pattern before tackling variants.
3. **Unbounded Knapsack (Coin Change)** (#322, #518) - Learn how unlimited items change the DP loop direction.
4. **Longest Common Subsequence** (#1143) - Master 2D DP for sequence comparison.
5. **Matrix/Grid DP** (#62, #64) - Practice DP on 2D arrays with movement constraints.
6. **State Machine DP** (#121, #309) - Handle problems with multiple states (like buy/sell/cooldown).

This order builds from simple recurrence to complex state management. Each pattern reuses concepts from previous ones while adding new dimensions.

## Recommended Practice Order

Solve these in sequence:

1. Climbing Stairs (#70) - Basic recurrence
2. House Robber (#198) - Simple 1D DP with decisions
3. Coin Change (#322) - Unbounded knapsack pattern
4. Partition Equal Subset Sum (#416) - 0/1 knapsack application
5. Longest Common Subsequence (#1143) - 2D string DP
6. Best Time to Buy and Sell Stock with Cooldown (#309) - State machine DP

After these six, you'll have covered 90% of DP patterns Capital One uses. Focus on explaining your state definition clearly and discussing space optimization—they value communication as much as coding.

[Practice Dynamic Programming at Capital One](/company/capital-one/dynamic-programming)
