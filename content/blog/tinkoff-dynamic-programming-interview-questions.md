---
title: "Dynamic Programming Questions at Tinkoff: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Tinkoff — patterns, difficulty breakdown, and study tips."
date: "2030-12-16"
category: "dsa-patterns"
tags: ["tinkoff", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Tinkoff isn't just another topic on a checklist—it's a critical filter. With 3 out of their 27 core problem archetypes being DP-specific, you have an 11% chance of hitting one in any given interview round. In practice, this translates to a near-certainty you'll face at least one DP question in their multi-stage technical interview process. Why such emphasis? Tinkoff, as a fintech leader, deals heavily with optimization problems: maximizing portfolio returns, minimizing risk exposure, optimizing transaction routing. These are classic DP domains. The interviewers aren't just testing if you can memorize the "house robber" pattern; they're assessing if you can model a complex, constrained real-world problem into an optimal substructure and then implement it efficiently. Failing a DP question here isn't seen as a minor slip—it's often interpreted as a fundamental gap in problem-solving for the core business logic they build daily.

## Specific Patterns Tinkoff Favors

Tinkoff's DP questions tend to avoid overly abstract or purely combinatorial problems. They favor **1D and 2D iterative (bottom-up) DP** applied to concrete scenarios, often with a financial or sequential decision-making flavor. You'll rarely see matrix chain multiplication or obscure string alignment problems. Instead, expect variations on:

1.  **Classic 0/1 Knapsack & Unbounded Knapsack:** The foundational pattern for resource allocation. Think: "Given a capital of X rubles and a list of investment options with costs and expected profits, maximize total profit." This is directly analogous to LeetCode's "Partition Equal Subset Sum" (#416) or "Coin Change" (#322).
2.  **State Machine DP:** Problems where you hold an asset (like a stock) and can be in different states (e.g., "holding," "not holding," "cooldown"). This tests your ability to manage multiple interdependent DP arrays. The quintessential problem is "Best Time to Buy and Sell Stock with Cooldown" (#309).
3.  **Interval/Sequence DP:** Less frequent, but sometimes appears in the context of scheduling or segment optimization. "Palindromic Substrings" (#647) is a good representative of the 2D DP on a sequence they might use.

Recursive top-down with memoization is acceptable, but interviewers often push for the iterative, space-optimized bottom-up solution. They want to see you understand the _table-filling_ mechanics and can reason about space complexity optimization.

## How to Prepare

The key is to move from pattern recognition to _pattern derivation_. Don't just memorize that `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` for House Robber. Understand _why_: at each house `i`, your optimal decision depends on the optimal solutions to the subproblems `i-1` and `i-2`. This "state transition" thinking is what they test.

Let's look at the **State Machine DP** pattern, common in their "trading" problems. The trick is to define `dp` arrays representing each state you can be in.

<div class="code-group">

```python
# LeetCode #309: Best Time to Buy and Sell Stock with Cooldown
# Time: O(n) | Space: O(n) (can be optimized to O(1))
def maxProfit(prices):
    if not prices:
        return 0

    n = len(prices)
    # dp[i][0]: max profit on day i holding a stock
    # dp[i][1]: max profit on day i not holding, in cooldown (sold yesterday)
    # dp[i][2]: max profit on day i not holding, not in cooldown (can buy)
    dp = [[0, 0, 0] for _ in range(n)]
    dp[0][0] = -prices[0]  # Buy on day 0
    dp[0][1] = 0
    dp[0][2] = 0

    for i in range(1, n):
        # State 0 (Holding): Either held from i-1, or bought today from state 2 (not holding, not cooldown)
        dp[i][0] = max(dp[i-1][0], dp[i-1][2] - prices[i])
        # State 1 (Cooldown): Must have sold yesterday (transitioned from state 0)
        dp[i][1] = dp[i-1][0] + prices[i]
        # State 2 (Not holding, not cooldown): Either stayed in state 2, or came out of cooldown (state 1)
        dp[i][2] = max(dp[i-1][2], dp[i-1][1])

    # Max profit will be in a non-holding state
    return max(dp[n-1][1], dp[n-1][2])
```

```javascript
// LeetCode #309: Best Time to Buy and Sell Stock with Cooldown
// Time: O(n) | Space: O(n) (can be optimized to O(1))
function maxProfit(prices) {
  if (!prices.length) return 0;

  const n = prices.length;
  // dp[i][0]: holding, dp[i][1]: cooldown, dp[i][2]: not holding (can buy)
  const dp = Array.from({ length: n }, () => [0, 0, 0]);
  dp[0][0] = -prices[0];

  for (let i = 1; i < n; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][2] - prices[i]);
    dp[i][1] = dp[i - 1][0] + prices[i];
    dp[i][2] = Math.max(dp[i - 1][2], dp[i - 1][1]);
  }

  return Math.max(dp[n - 1][1], dp[n - 1][2]);
}
```

```java
// LeetCode #309: Best Time to Buy and Sell Stock with Cooldown
// Time: O(n) | Space: O(n) (can be optimized to O(1))
public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;

    int n = prices.length;
    // dp[i][0]: holding, dp[i][1]: cooldown, dp[i][2]: not holding (can buy)
    int[][] dp = new int[n][3];
    dp[0][0] = -prices[0];

    for (int i = 1; i < n; i++) {
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][2] - prices[i]);
        dp[i][1] = dp[i-1][0] + prices[i];
        dp[i][2] = Math.max(dp[i-1][2], dp[i-1][1]);
    }

    return Math.max(dp[n-1][1], dp[n-1][2]);
}
```

</div>

For **Knapsack** problems, master the space-optimized 1D array version. It shows deeper understanding.

<div class="code-group">

```python
# LeetCode #416: Partition Equal Subset Sum (0/1 Knapsack variant)
# Time: O(n * target) | Space: O(target)
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2

    # dp[j] = whether we can form sum j using processed numbers
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum of 0 is always possible (choose nothing)

    for num in nums:
        # Iterate backwards to prevent re-using the same num (0/1 property)
        for j in range(target, num - 1, -1):
            if dp[j - num]:  # If we could form sum (j-num) before, we can form sum j by adding num
                dp[j] = True
        if dp[target]:  # Early exit
            return True
    return dp[target]
```

```javascript
// LeetCode #416: Partition Equal Subset Sum (0/1 Knapsack variant)
// Time: O(n * target) | Space: O(target)
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let j = target; j >= num; j--) {
      if (dp[j - num]) {
        dp[j] = true;
      }
    }
    if (dp[target]) return true;
  }
  return dp[target];
}
```

```java
// LeetCode #416: Partition Equal Subset Sum (0/1 Knapsack variant)
// Time: O(n * target) | Space: O(target)
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;
    if (total % 2 != 0) return false;
    int target = total / 2;

    boolean[] dp = new boolean[target + 1];
    dp[0] = true;

    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            if (dp[j - num]) {
                dp[j] = true;
            }
        }
        if (dp[target]) return true;
    }
    return dp[target];
}
```

</div>

## How Tinkoff Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Tinkoff's DP questions are less about algorithmic trickery and more about **applied modeling**. At Google, you might get a DP problem disguised as a game on a bizarre tree structure. At Tinkoff, the problem statement will often sound like a simplified business case: "maximize profit given constraints," "minimize cost over a schedule." The difficulty is not in discovering the DP state (which is often fairly clear), but in correctly defining the transition rules and handling edge cases.

Unlike some hedge funds that focus on extreme optimization (e.g., "solve it in O(n) time and O(1) space or fail"), Tinkoff interviewers prioritize **clarity and correctness**. They want to follow your thought process. You should articulate the definition of your `dp` array, the base cases, the recurrence relation, and then implement it cleanly. They will, however, expect you to discuss space optimization as a follow-up.

## Study Order

Tackle DP in this logical sequence to build a compounding understanding:

1.  **1D Linear DP (Fibonacci-style):** Start with "Climbing Stairs" (#70) and "House Robber" (#198). This teaches the core concept: the solution to `dp[i]` depends on a few previous states. Master the iterative approach.
2.  **Classic 0/1 Knapsack:** Move to "Partition Equal Subset Sum" (#416). This introduces the concept of a _capacity_ dimension in your DP state. Understand both the 2D and the space-optimized 1D solutions.
3.  **Unbounded Knapsack & Coin Change:** Practice "Coin Change" (#322) and "Coin Change 2" (#518). This solidifies how the iteration order (forward vs. backward) changes based on whether you can reuse items.
4.  **2D/Grid DP:** Solve "Unique Paths" (#62) and "Minimum Path Sum" (#64). This extends the state definition to two dimensions, a common theme.
5.  **State Machine DP:** Tackle the stock problems: "Best Time to Buy and Sell Stock" (#121) first, then the one with cooldown (#309). This is where you learn to manage multiple concurrent states.
6.  **Interval DP (Advanced):** Finally, look at "Longest Palindromic Subsequence" (#516) or "Burst Balloons" (#312) if you have time. These are less common but test deeper recursive thinking.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  Climbing Stairs (#70) - 1D Linear
2.  House Robber (#198) - 1D Linear with a twist
3.  Partition Equal Subset Sum (#416) - 0/1 Knapsack
4.  Coin Change (#322) - Unbounded Knapsack (Minimization)
5.  Unique Paths (#62) - 2D Grid DP
6.  Best Time to Buy and Sell Stock (#121) - Simple State Machine
7.  Best Time to Buy and Sell Stock with Cooldown (#309) - Full State Machine
8.  Longest Palindromic Subsequence (#516) - Interval DP (Capstone)

This progression takes you from the absolute fundamentals to the type of applied, state-driven DP Tinkoff favors. Remember, their goal is to see if you can translate a business constraint into a working algorithm. Practice by not just coding, but by writing out the `dp` definition and recurrence in plain English before you touch the keyboard.

[Practice Dynamic Programming at Tinkoff](/company/tinkoff/dynamic-programming)
