---
title: "Dynamic Programming Questions at Zoho: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Zoho — patterns, difficulty breakdown, and study tips."
date: "2027-10-29"
category: "dsa-patterns"
tags: ["zoho", "dynamic-programming", "interview prep"]
---

If you're preparing for Zoho's technical interviews, you'll quickly notice a significant emphasis on Dynamic Programming (DP). With 36 DP questions out of their 179 total tagged problems on LeetCode, that's roughly 20% of their public question bank. This isn't a coincidence. Zoho, known for its deep engineering roots and complex product suite (from CRM to network management), values candidates who can break down intricate, stateful problems into optimal, efficient solutions. DP is the quintessential tool for this. In real interviews, you can expect at least one medium-to-hard DP question, often in the second or third technical round, serving as a key differentiator between candidates who can just code and those who can engineer optimal systems.

## Specific Patterns Zoho Favors

Zoho's DP questions aren't about obscure, theoretical graph theory. They lean heavily toward **classic, one-dimensional and two-dimensional iterative DP** applied to practical scenarios. You'll see a strong preference for:

1.  **String/Sequence DP:** Problems involving operations on strings (edit distance, subsequences, palindromes) or numerical sequences. This tests your ability to define a state based on positions or lengths.
2.  **Knapsack-style DP:** Not just the classic 0/1 Knapsack, but its variations—unbounded knapsack, partition problems, and counting ways. This aligns with resource allocation problems common in software.
3.  **State Machine DP:** Problems where the state isn't just an index, but includes an additional flag (like a "hold" state for stock problems). This tests multi-dimensional thinking.

They heavily favor **bottom-up, iterative tabulation** over top-down memoization. Interviewers want to see you derive the DP table, manage indices, and clearly articulate the state transition. Recursive solutions are often acceptable but seen as a stepping stone; the optimal, space-efficient iterative solution is the goal.

Specific LeetCode problems that mirror Zoho's style include:

- **Edit Distance (#72):** A classic 2D string DP.
- **Longest Palindromic Subsequence (#516):** Sequence DP with a clever state definition.
- **Partition Equal Subset Sum (#416):** A direct 0/1 knapsack application.
- **Coin Change (#322):** An unbounded knapsack (minimum coins) problem.
- **Best Time to Buy and Sell Stock with Cooldown (#309):** A prime example of state machine DP.

## How to Prepare

The key is to internalize the state definition and transition. Let's take the most common pattern: **2D DP for sequences (like LCS or Edit Distance)**. The mental model is: `dp[i][j] represents the answer for the subproblem considering the first i elements of sequence A and the first j elements of sequence B.`

Here is the foundational structure for solving Longest Common Subsequence (LCS), which you can adapt for many string problems:

<div class="code-group">

```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    # dp[i][j]: LCS length for text1[0:i] and text2[0:j]
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Build the table bottom-up
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                # Characters match, extend the LCS from the previous prefix
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                # Characters don't match, take the best result from ignoring one char
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]
# Time: O(m * n) | Space: O(m * n)
# Space can be optimized to O(min(m, n)) using two rows.
```

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length,
    n = text2.length;
  // dp[i][j]: LCS length for text1[0..i-1] and text2[0..j-1]
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
// Time: O(m * n) | Space: O(m * n)
```

```java
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    // dp[i][j]: LCS length for text1[0..i-1] and text2[0..j-1]
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i-1) == text2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}
// Time: O(m * n) | Space: O(m * n)
```

</div>

For the second major pattern, **Knapsack DP**, the state is usually `dp[i][w] = maximum value achievable with first i items and capacity w`. Here's the 0/1 Knapsack skeleton, which is the basis for Partition Equal Subset Sum (#416):

<div class="code-group">

```python
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    n = len(nums)

    # dp[i][s]: can we make sum 's' using the first 'i' numbers?
    # We optimize space to 1D by iterating backwards.
    dp = [False] * (target + 1)
    dp[0] = True  # Base case: sum 0 is always achievable

    for num in nums:
        # Iterate backwards to prevent re-using the same num (0/1 property)
        for s in range(target, num - 1, -1):
            if dp[s - num]:
                dp[s] = True
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
    for (let s = target; s >= num; s--) {
      if (dp[s - num]) {
        dp[s] = true;
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
        for (int s = target; s >= num; s--) {
            if (dp[s - num]) {
                dp[s] = true;
            }
        }
    }
    return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

</div>

## How Zoho Tests Dynamic Programming vs Other Companies

Zoho's DP questions sit in a unique middle ground. Compared to FAANG companies:

- **vs. Google/Meta:** Google often wraps DP in a complex story or combines it with other paradigms (e.g., DP on trees). Meta might ask DP but often prioritizes more practical, leetcode-medium problems. Zoho's DP is more "naked"—you're given a problem that is clearly a known DP pattern, but they expect a flawless, optimized implementation.
- **vs. Amazon:** Amazon's DP questions are often related to system design or operational problems (e.g., shortest path in a warehouse grid). Zoho's are more abstract and algorithmic, testing pure problem decomposition.
- **vs. Startups/Unicorns:** These companies often skip DP for more real-time coding or system design. Zoho, as an established product-based company, uses DP as a filter for strong algorithmic fundamentals.

What's unique is Zoho's **incremental probing**. An interviewer might start with a brute-force recursive solution, then ask for memoization, and finally push for the iterative, space-optimized version—all within 30-40 minutes. They care about the journey to the optimal solution.

## Study Order

Don't jump into hard problems. Build your intuition sequentially:

1.  **Foundation: Fibonacci & Climbing Stairs.** Understand overlapping subproblems and optimal substructure. Practice both top-down and bottom-up.
2.  **1D Linear DP.** Problems where state is just an index (e.g., House Robber #198). Master the "take or skip" decision.
3.  **Classic 2D Sequence DP.** Longest Common Subsequence (#1143) and Edit Distance (#72). This is the core of Zoho's string problems. Draw the table every time.
4.  **Knapsack & Variations.** Learn 0/1 Knapsack, then Unbounded Knapsack (Coin Change #322), then Partition problems (#416). Understand how the inner loop direction changes for each.
5.  **State Machine DP.** Best Time to Buy and Sell Stock series (#121, #122, #309). Learn to define states like `hold` and `cash`.
6.  **Advanced 2D/Grid DP.** Unique Paths (#62) and Dungeon Game (#174). These combine 2D state with more complex transitions.

## Recommended Practice Order

Solve these in sequence to build compounding knowledge:

1.  Climbing Stairs (#70) – 1D DP introduction.
2.  House Robber (#198) – 1D DP with a simple decision.
3.  Longest Common Subsequence (#1143) – Master the 2D table.
4.  Edit Distance (#72) – Apply the 2D pattern with different operations.
5.  Coin Change (#322) – Unbounded knapsack (minimum).
6.  Partition Equal Subset Sum (#416) – 0/1 knapsack (existence).
7.  Best Time to Buy and Sell Stock with Cooldown (#309) – State machine.
8.  Longest Palindromic Subsequence (#516) – A clever twist on LCS.
9.  Decode Ways (#91) – 1D DP with more complex validity checks.
10. Target Sum (#494) – A knapsack variation that tests understanding.

This progression ensures each problem reinforces a previous concept while introducing one new twist, exactly how Zoho interviews are structured.

[Practice Dynamic Programming at Zoho](/company/zoho/dynamic-programming)
