---
title: "Dynamic Programming Questions at Flipkart: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-04-18"
category: "dsa-patterns"
tags: ["flipkart", "dynamic-programming", "interview prep"]
---

## Why Dynamic Programming Matters at Flipkart

Flipkart’s interview process is heavily weighted toward algorithmic problem-solving, and Dynamic Programming (DP) is a cornerstone of that focus. With 26 DP questions out of 117 total problems in their tagged set, DP represents over 22% of their technical question bank — a significant concentration. In practice, this means you are very likely to encounter at least one DP problem in your interview loop, especially in the machine coding or problem-solving rounds.

Why such emphasis? Flipkart deals with massive-scale optimization problems: inventory allocation, delivery route planning, pricing algorithms, and recommendation systems. DP is the go-to paradigm for solving optimization problems with overlapping subproblems and optimal substructure. Interviewers use DP questions not just to test your memorization of solutions, but to evaluate your ability to break down a complex real-world problem into manageable states and transitions — a skill directly applicable to designing efficient systems at scale.

## Specific Patterns Flipkart Favors

Flipkart’s DP questions tend to cluster around a few high-impact patterns rather than obscure variations. They strongly favor **iterative (bottom-up) DP** over recursive+memoization, as it’s more space-optimizable and aligns with production code style. The most frequent categories are:

1. **Unbounded Knapsack & Coin Change**: Problems about infinite supply combinations, like coin change (#322) and perfect squares (#279). These test your grasp of the order of loops (item-first vs. capacity-first matters).
2. **String/Sequence DP**: Longest common subsequence (#1143), edit distance (#72), and palindrome partitioning (#132). These are common because string manipulation and comparison appear in search and data matching systems.
3. **Matrix/Grid DP**: Unique paths (#62), minimum path sum (#64). These often serve as warm-ups but can be extended with obstacles or additional constraints.
4. **DP on Intervals**: Matrix chain multiplication or burst balloons (#312) style problems occasionally appear for senior roles, testing more advanced state definition.

Noticeably, Flipkart rarely uses pure graph DP (like Floyd-Warshall) in interviews — they separate graph theory into its own question type. Their DP problems are typically self-contained within arrays, strings, or matrices.

## How to Prepare

The key to Flipkart’s DP style is recognizing the pattern quickly and then implementing the space-optimized version. Let’s take the **Unbounded Knapsack** pattern, which appears in problems like “Coin Change II” (#518) — number of ways to make an amount given infinite coins.

The naive DP uses a 2D array: `dp[i][amount]` = ways using first i coins. The optimized version uses a 1D array because we can reuse coins infinitely.

<div class="code-group">

```python
# Coin Change II (#518) - Number of combinations
# Time: O(n * amount) | Space: O(amount)
def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1  # One way to make amount 0: use no coins

    for coin in coins:  # Outer loop over coins
        for a in range(coin, amount + 1):  # Inner loop over amounts
            dp[a] += dp[a - coin]  # Add ways from using this coin
    return dp[amount]
```

```javascript
// Coin Change II (#518) - Number of combinations
// Time: O(n * amount) | Space: O(amount)
function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      dp[a] += dp[a - coin];
    }
  }
  return dp[amount];
}
```

```java
// Coin Change II (#518) - Number of combinations
// Time: O(n * amount) | Space: O(amount)
public int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;

    for (int coin : coins) {
        for (int a = coin; a <= amount; a++) {
            dp[a] += dp[a - coin];
        }
    }
    return dp[amount];
}
```

</div>

Another common pattern is **String DP**, like edit distance. Flipkart often asks this to see if you can handle the subtle indexing and initialization.

<div class="code-group">

```python
# Edit Distance (#72) - Space optimized
# Time: O(m * n) | Space: O(min(m, n))
def minDistance(word1, word2):
    if len(word1) < len(word2):
        word1, word2 = word2, word1  # Ensure word2 is shorter for space optimization

    prev = list(range(len(word2) + 1))
    curr = [0] * (len(word2) + 1)

    for i in range(1, len(word1) + 1):
        curr[0] = i
        for j in range(1, len(word2) + 1):
            if word1[i-1] == word2[j-1]:
                curr[j] = prev[j-1]
            else:
                curr[j] = 1 + min(prev[j],      # delete
                                  curr[j-1],    # insert
                                  prev[j-1])    # replace
        prev, curr = curr, prev  # Swap for next row
    return prev[len(word2)]
```

```javascript
// Edit Distance (#72) - Space optimized
// Time: O(m * n) | Space: O(min(m, n))
function minDistance(word1, word2) {
  if (word1.length < word2.length) [word1, word2] = [word2, word1];

  let prev = Array.from({ length: word2.length + 1 }, (_, i) => i);
  let curr = new Array(word2.length + 1).fill(0);

  for (let i = 1; i <= word1.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= word2.length; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
      }
    }
    [prev, curr] = [curr, prev];
  }
  return prev[word2.length];
}
```

```java
// Edit Distance (#72) - Space optimized
// Time: O(m * n) | Space: O(min(m, n))
public int minDistance(String word1, String word2) {
    if (word1.length() < word2.length()) {
        String temp = word1;
        word1 = word2;
        word2 = temp;
    }

    int[] prev = new int[word2.length() + 1];
    for (int j = 0; j <= word2.length(); j++) prev[j] = j;
    int[] curr = new int[word2.length() + 1];

    for (int i = 1; i <= word1.length(); i++) {
        curr[0] = i;
        for (int j = 1; j <= word2.length(); j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                curr[j] = prev[j-1];
            } else {
                curr[j] = 1 + Math.min(prev[j], Math.min(curr[j-1], prev[j-1]));
            }
        }
        int[] temp = prev;
        prev = curr;
        curr = temp;
    }
    return prev[word2.length()];
}
```

</div>

## How Flipkart Tests Dynamic Programming vs Other Companies

Compared to other major tech companies, Flipkart’s DP questions have a distinct flavor:

- **Less emphasis on trickiness, more on clean implementation**: Unlike Google, which might embed DP in a complex scenario, Flipkart problems are often recognizable LeetCode mediums. The challenge is writing bug-free, optimized code under pressure.
- **Follow-up questions focus on scalability**: After solving the core DP, expect questions like “How would this handle 10 million items?” or “Can we parallelize this?” This reflects Flipkart’s data-heavy environment.
- **More likely to combine with system design**: For senior roles, DP might be part of a larger system design discussion (e.g., “How would you design a coupon system that applies these discount combinations optimally?”).
- **Difficulty ceiling**: Flipkart rarely goes beyond hard DP problems like “Burst Balloons” (#312) for most engineering roles. Their hards are typically optimized versions of mediums.

## Study Order

1. **Start with 1D DP** — Fibonacci, climbing stairs (#70). Understand state definition and transition before adding dimensions.
2. **2D Grid DP** — Unique paths (#62), minimum path sum (#64). Learn to handle 2D state spaces and initialization.
3. **Knapsack variants** — 0/1 knapsack first, then unbounded. This teaches you the difference between “each item once” vs “infinite supply” loop orders.
4. **String DP** — Longest common subsequence (#1143), then edit distance (#72). String problems test your off-by-one skills and space optimization.
5. **Partition/Interval DP** — Only after mastering the above. These are less frequent but test deeper recurrence relation skills.

This order builds from simple state transitions to complex ones, ensuring you don’t jump into multi-dimensional DP before understanding the fundamentals.

## Recommended Practice Order

Solve these in sequence:

1. Climbing Stairs (#70) — Basic 1D DP
2. Coin Change (#322) — Unbounded knapsack (minimum coins)
3. Coin Change II (#518) — Unbounded knapsack (number of ways)
4. Longest Increasing Subsequence (#300) — 1D DP with O(n²) and O(n log n) follow-up
5. Unique Paths (#62) — Basic 2D DP
6. Minimum Path Sum (#64) — 2D DP with value optimization
7. Longest Common Subsequence (#1143) — Classic string DP
8. Edit Distance (#72) — String DP with space optimization
9. Decode Ways (#91) — 1D DP with string constraints
10. Word Break (#139) — DP with hash set lookup

After these, tackle Flipkart’s tagged DP problems. You’ll find most are variations of these patterns.

[Practice Dynamic Programming at Flipkart](/company/flipkart/dynamic-programming)
