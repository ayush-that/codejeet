---
title: "Dynamic Programming Questions at Accenture: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Accenture — patterns, difficulty breakdown, and study tips."
date: "2028-01-15"
category: "dsa-patterns"
tags: ["accenture", "dynamic-programming", "interview prep"]
---

## Why Dynamic Programming Matters at Accenture

Accenture's 27 Dynamic Programming (DP) questions represent a significant 19% of their total problem catalog. This isn't an accident. While Accenture interviews for software engineering roles may not reach the extreme algorithmic depth of FAANG companies, they consistently test DP because it reveals how you think about optimization, state management, and breaking down complex problems—skills directly applicable to the large-scale enterprise systems and digital transformation projects that form Accenture's core business.

In real interviews, you're more likely to encounter DP in later technical rounds or for senior positions. The questions serve as a filter for candidates who can move beyond brute-force thinking to efficient, structured solutions. Unlike companies that might ask DP purely as an academic exercise, Accenture's DP problems often have a practical flavor—think optimization of resources, scheduling, or cost minimization scenarios that mirror real client engagements.

## Specific Patterns Accenture Favors

Accenture's DP problems cluster around three main patterns that reflect practical business scenarios:

1. **1D/2D Tabulation for Optimization Problems** - These dominate their question bank. You'll see classic problems like "Maximum Subarray" (#53) and "House Robber" (#198) that model profit maximization or resource allocation decisions.

2. **String/Sequence Alignment Problems** - Problems like "Longest Common Subsequence" (#1143) and "Edit Distance" (#72) appear frequently. These test your ability to handle state transitions between two sequences, which maps well to data transformation and integration tasks common in consulting projects.

3. **Knapsack-Style Problems** - While not always labeled as such, many Accenture DP problems follow the knapsack pattern: making optimal selections under constraints. "Coin Change" (#322) and "Partition Equal Subset Sum" (#416) are prime examples.

Notice what's missing: complex graph DP (like traveling salesman) and highly mathematical DP (like probability-based problems). Accenture stays in the practical lane.

<div class="code-group">

```python
# House Robber (#198) - Classic 1D DP with optimization
# Time: O(n) | Space: O(1) - optimized from O(n)
def rob(nums):
    """
    dp[i] = max money robbing up to house i
    Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    """
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]

    # Only need to keep last two states
    prev2, prev1 = 0, nums[0]

    for i in range(1, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, current

    return prev1
```

```javascript
// House Robber (#198) - Space-optimized DP
// Time: O(n) | Space: O(1)
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  // Maintain only previous two states
  let prev2 = 0;
  let prev1 = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const current = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

```java
// House Robber (#198) - Space-optimized DP
// Time: O(n) | Space: O(1)
public int rob(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];

    // Only track previous two states
    int prev2 = 0;
    int prev1 = nums[0];

    for (int i = 1; i < nums.length; i++) {
        int current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}
```

</div>

## How to Prepare

Start by internalizing the DP problem-solving framework that works in interviews:

1. **Define the state** - What does dp[i] or dp[i][j] represent?
2. **Establish the recurrence relation** - How does state i relate to previous states?
3. **Set base cases** - What are the smallest, trivial cases?
4. **Determine iteration direction** - In what order should states be computed?
5. **Extract the answer** - Where in the DP table is your final result?

For Accenture specifically, practice explaining your DP solution in business terms. Instead of just "dp[i] represents the maximum profit," try "dp[i] represents the optimal cost-benefit outcome after evaluating the first i options." This bridges the technical solution to business thinking.

Here's a pattern variation you'll see often—the "take or skip" decision structure:

<div class="code-group">

```python
# Coin Change (#322) - Minimum coins to make amount
# Time: O(amount * n) | Space: O(amount)
def coinChange(coins, amount):
    """
    dp[a] = min coins to make amount 'a'
    Recurrence: dp[a] = min(dp[a], 1 + dp[a - coin]) for coin in coins
    """
    # Initialize with infinity (impossible)
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins to make amount 0

    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], 1 + dp[a - coin])

    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Coin Change (#322) - Classic unbounded knapsack variant
// Time: O(amount * n) | Space: O(amount)
function coinChange(coins, amount) {
  // dp[a] = minimum coins to make amount a
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) {
        dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
      }
    }
  }

  return dp[amount] !== Infinity ? dp[amount] : -1;
}
```

```java
// Coin Change (#322) - Unbounded knapsack pattern
// Time: O(amount * n) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    // dp[a] = min coins to make amount a
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // Use amount+1 as "infinity"
    dp[0] = 0;  // Base case

    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (coin <= a) {
                dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

## How Accenture Tests Dynamic Programming vs Other Companies

Accenture's DP questions sit in a middle ground between difficulty levels. Compared to Google or Meta, Accenture problems are less likely to require clever state compression or complex recurrence relations. Compared to banks or traditional enterprises, they're more algorithmically focused.

What's unique: Accenture interviewers often want to see you **derive the DP solution from first principles** rather than just regurgitate a memorized pattern. They'll ask "Why did you choose this state definition?" or "How would this solution scale if we had memory constraints?" This reflects their consulting mindset—they care about your thought process as much as the final code.

Another distinction: Accenture DP problems often have **clear business analogs**. "House Robber" becomes "selecting projects with conflicting timelines." "Coin Change" becomes "minimizing resource units to meet a requirement." Be prepared to make these connections explicit.

## Study Order

1. **1D DP with simple recurrence** - Start with Fibonacci and Climbing Stairs (#70). These teach the basic DP mindset without complex state.
2. **1D DP with "take or skip" decisions** - House Robber (#198) and its variants. This introduces the fundamental choice pattern.
3. **Unbounded knapsack problems** - Coin Change (#322) and Perfect Squares (#279). Learn to handle items that can be reused.
4. **2D DP for two sequences** - Longest Common Subsequence (#1143). This introduces 2D state and matching decisions.
5. **2D DP for string operations** - Edit Distance (#72). This combines sequence alignment with cost minimization.
6. **Partition problems** - Partition Equal Subset Sum (#416). These test understanding of subset relationships.
7. **Grid path problems** - Unique Paths (#62) and Minimum Path Sum (#64). These introduce 2D spatial reasoning.

This order works because each step builds on the previous one. You move from single decisions to multiple decisions, from one dimension to two, from independent items to interrelated ones.

## Recommended Practice Order

Solve these in sequence to build Accenture-relevant DP skills:

1. Climbing Stairs (#70) - The "hello world" of DP
2. House Robber (#198) - Classic 1D optimization
3. Maximum Subarray (#53) - Kadane's algorithm (special DP case)
4. Coin Change (#322) - Unbounded knapsack foundation
5. Longest Increasing Subsequence (#300) - 1D with binary search optimization
6. Longest Common Subsequence (#1143) - Essential 2D DP
7. Edit Distance (#72) - Practical string operations
8. Partition Equal Subset Sum (#416) - Subset decision making
9. Decode Ways (#91) - String parsing with constraints
10. Word Break (#139) - Dictionary matching pattern

After these ten, you'll have covered 80% of the DP patterns Accenture uses. The remaining problems are variations on these themes.

[Practice Dynamic Programming at Accenture](/company/accenture/dynamic-programming)
