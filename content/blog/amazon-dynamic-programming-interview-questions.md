---
title: "Dynamic Programming Questions at Amazon: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Amazon — patterns, difficulty breakdown, and study tips."
date: "2027-02-17"
category: "dsa-patterns"
tags: ["amazon", "dynamic-programming", "interview prep"]
---

## Why Dynamic Programming Matters at Amazon

Let's start with a reality check. Amazon has 277 Dynamic Programming (DP) problems in their tagged question list on LeetCode. That's 14% of their total tagged problems — a significant chunk, but not the majority. The truth is, DP isn't _the_ most common topic at Amazon (that's usually arrays/strings and trees), but it's absolutely a critical differentiator between candidates who get the offer and those who don't.

Here's what most candidates miss: Amazon doesn't just test DP for the sake of testing algorithms. They test it because it mirrors real Amazon engineering problems. Think about it — optimal resource allocation (AWS instances), inventory management (warehouse optimization), pricing algorithms (dynamic pricing models), and even the recommendation engine (sequence prediction) all have DP-like thinking at their core. When you're optimizing for scale at Amazon's level, brute force solutions don't cut it.

In actual interviews, you'll typically encounter at least one DP problem if you're interviewing for SDE II or above. For new grad roles, it's less frequent but still appears as a "hard" problem to separate top candidates. The key insight: Amazon interviewers often disguise DP problems as something else initially. They might present it as a "string manipulation" or "array" problem, then watch to see if you recognize the optimal substructure.

## Specific Patterns Amazon Favors

Amazon has distinct preferences when it comes to DP problems. Based on analyzing hundreds of reported interviews, here are the patterns you absolutely must know:

1. **Knapsack Variations** — Not just the classic 0/1 knapsack, but particularly _unbounded knapsack_ problems. These model inventory and resource allocation perfectly. Look for problems about "minimum coins" or "ways to make change."

2. **String/Sequence DP** — Longest Common Subsequence (#1143) and Edit Distance (#72) appear constantly. These test your ability to work with two-dimensional DP tables for sequence comparison — crucial for anything from data deduplication to DNA sequence matching in AWS genomics.

3. **State Machine DP** — Problems like Best Time to Buy and Sell Stock with Cooldown (#309) are favorites because they model real-world state transitions (idle, bought, sold, cooldown). Amazon loves these for system design thinking.

4. **Matrix/Grid DP** — Unique Paths (#62) and Minimum Path Sum (#64) are common warm-ups, but the real test comes with obstacles and constraints.

Here's the critical distinction: Amazon prefers _iterative bottom-up_ DP over recursive memoization in interviews. Why? Bottom-up demonstrates better space optimization thinking (can you reduce O(n²) to O(n)?) and shows you understand the actual computation flow, not just pattern matching.

<div class="code-group">

```python
# Amazon-favored pattern: Bottom-up DP for Unbounded Knapsack
# LeetCode #322: Coin Change
# Time: O(amount * n) | Space: O(amount)
def coinChange(coins, amount):
    # dp[i] = minimum coins to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Amazon-favored pattern: Bottom-up DP for Unbounded Knapsack
// LeetCode #322: Coin Change
// Time: O(amount * n) | Space: O(amount)
function coinChange(coins, amount) {
  // dp[i] = minimum coins to make amount i
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case: 0 coins needed for amount 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] !== Infinity ? dp[amount] : -1;
}
```

```java
// Amazon-favored pattern: Bottom-up DP for Unbounded Knapsack
// LeetCode #322: Coin Change
// Time: O(amount * n) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    // dp[i] = minimum coins to make amount i
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // Use amount+1 as "infinity"
    dp[0] = 0;  // Base case: 0 coins needed for amount 0

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

## How to Prepare

Most candidates fail Amazon DP interviews not because they don't know DP, but because they can't _explain_ their thinking. Here's my battle-tested approach:

1. **Always start with brute force** — Verbalize the recursive solution first. Amazon wants to see you understand the problem space before optimizing.

2. **Identify the subproblems explicitly** — Say "The subproblem here is..." and write it down. Amazon interviewers look for this structured thinking.

3. **Draw the DP table** — Literally draw a grid on the whiteboard or in your coding editor. Fill in a few cells to demonstrate you understand the recurrence relation.

4. **Optimize space last** — Only after you have the working 2D solution should you mention "We can optimize this to O(n) space by noticing we only need the previous row."

Here's a pattern that appears in multiple Amazon DP problems — the "two strings" DP:

<div class="code-group">

```python
# Classic Amazon pattern: Two-string DP (Longest Common Subsequence)
# LeetCode #1143: Longest Common Subsequence
# Time: O(m * n) | Space: O(m * n) -> can optimize to O(min(m, n))
def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]
```

```javascript
// Classic Amazon pattern: Two-string DP (Longest Common Subsequence)
// LeetCode #1143: Longest Common Subsequence
// Time: O(m * n) | Space: O(m * n) -> can optimize to O(min(m, n))
function longestCommonSubsequence(text1, text2) {
  const m = text1.length,
    n = text2.length;
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

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
// Classic Amazon pattern: Two-string DP (Longest Common Subsequence)
// LeetCode #1143: Longest Common Subsequence
// Time: O(m * n) | Space: O(m * n) -> can optimize to O(min(m, n))
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

## How Amazon Tests Dynamic Programming vs Other Companies

Amazon's DP questions have a distinct flavor compared to other FAANG companies:

- **vs Google**: Google loves clever, mathematical DP (think "Dungeon Game" #174). Amazon prefers practical, business-applicable DP. If it could model warehouse logistics, it's probably an Amazon question.

- **vs Facebook/Meta**: Meta often combines DP with graphs or trees. Amazon keeps DP relatively pure but adds constraints that mirror real systems (rate limits, capacity constraints).

- **vs Microsoft**: Microsoft favors string DP almost exclusively. Amazon has a broader mix including knapsack, matrix, and state machine problems.

The unique Amazon twist: **They test follow-up optimization relentlessly**. You'll solve the basic DP, then immediately get "Now what if we have memory constraints?" or "How would this work in a distributed system?" This tests both algorithmic knowledge and systems thinking — the Amazon Leadership Principle of "Invent and Simplify" in action.

## Study Order

Don't just randomly solve DP problems. Follow this progression:

1. **1D DP** — Start with Fibonacci and Climbing Stairs (#70). Understand memoization vs tabulation here first.

2. **2D Grid DP** — Unique Paths (#62) and Minimum Path Sum (#64). Learn to visualize the DP table.

3. **Knapsack Family** — In order: 0/1 Knapsack → Unbounded Knapsack → Partition Equal Subset Sum (#416). This builds intuition for "include/exclude" decisions.

4. **String DP** — Longest Common Subsequence (#1143) → Edit Distance (#72). Master the "two strings" DP table pattern.

5. **State Machine DP** — Best Time to Buy and Sell Stock (#121) → with cooldown (#309). This is where you graduate to advanced DP thinking.

6. **Hard Constraints** — Word Break (#139) and Decode Ways (#91). These test if you can identify DP in disguised problems.

Why this order? Each step builds on the previous. 1D teaches recurrence relations. 2D adds spatial thinking. Knapsack introduces decision trees. String DP combines it all. State machine teaches multi-dimensional thinking. Hard constraints test pattern recognition.

## Recommended Practice Order

Solve these in sequence — each prepares you for the next:

1. Climbing Stairs (#70) — Basic 1D DP
2. House Robber (#198) — Slightly more complex 1D decisions
3. Unique Paths (#62) — Introduction to 2D DP
4. Minimum Path Sum (#64) — 2D DP with costs
5. Coin Change (#322) — Unbounded knapsack (Amazon favorite)
6. Longest Common Subsequence (#1143) — Must-know string DP
7. Edit Distance (#72) — Another Amazon frequent flyer
8. Best Time to Buy and Sell Stock with Cooldown (#309) — State machine thinking
9. Word Break (#139) — Disguised DP recognition test
10. Decode Ways (#91) — Boundary cases and constraint handling

After these 10, you'll have covered 90% of Amazon's DP patterns. The remaining 10% are variations and combinations — solvable once you have this foundation.

Remember: At Amazon, it's not just about solving the problem. It's about articulating why DP applies, how you derived the recurrence relation, and what the business implication might be. Practice explaining your thinking out loud — that's what separates the "solved it" candidate from the "got the offer" candidate.

[Practice Dynamic Programming at Amazon](/company/amazon/dynamic-programming)
