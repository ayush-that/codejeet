---
title: "Dynamic Programming Questions at Adobe: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Adobe — patterns, difficulty breakdown, and study tips."
date: "2027-08-16"
category: "dsa-patterns"
tags: ["adobe", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Adobe isn't just another topic on a checklist—it's a critical filter. With 30 DP problems in their tagged LeetCode list (over 13% of their total), it's a core focus area that appears with surprising frequency in their interview loops, especially for mid-to-senior level roles. Why? Adobe's products, from Photoshop's image processing to Experience Manager's content optimization, often involve solving complex, overlapping subproblems—whether it's finding the most efficient rendering path, optimizing resource allocation, or calculating the minimum edits between document versions. An interviewer here isn't just testing if you memorized the Fibonacci sequence; they're probing your ability to decompose a real-world, stateful problem into an optimal substructure. Expect at least one medium-to-hard DP question in a typical on-site, often disguised initially as a string, array, or matrix problem.

## Specific Patterns Adobe Favors

Adobe's DP questions tend to skew towards practical, iterable patterns over highly abstract recursive ones. They heavily favor **1D and 2D Tabulation (Bottom-Up DP)**. You'll rarely see pure "memoized recursion" as the expected final solution; interviewers want to see you build the table and articulate the state transition clearly.

The most common patterns are:

1.  **String/Sequence DP:** This is their bread and butter. Problems like **Edit Distance (#72)**, **Longest Common Subsequence (#1143)**, and **Longest Palindromic Subsequence (#516)** are classic Adobe staples. They test your ability to define `dp[i][j]` for two sequences.
2.  **Knapsack/Subset DP:** Problems involving selection and capacity constraints, like **Partition Equal Subset Sum (#416)** or **Target Sum (#494)**. These assess your skill in modeling a "state" as a achievable sum.
3.  **Matrix/Grid Path DP:** While not exclusively DP, problems like **Unique Paths (#62)** and **Minimum Path Sum (#64)** are common entry points that can lead into more complex variants with obstacles.
4.  **State Machine DP:** A more advanced pattern they occasionally use, seen in problems like **Best Time to Buy and Sell Stock with Cooldown (#309)**. This tests if you can model multiple states (e.g., `hold`, `sold`, `cooldown`) and transitions between them.

You'll notice a distinct _lack_ of highly esoteric graph DP (like Floyd-Warshall) or tree DP. Their focus is on structured, tabular problems with clear overlapping subproblems.

## How to Prepare

The key is to master the framework, not just individual problems. For any DP problem, your thought process should be: 1) Identify the state variables, 2) Define the `dp` array/table, 3) Establish the base case, 4) Derive the recurrence relation (state transition), 5) Determine the iteration order and final answer location.

Let's look at the core pattern for 2D Sequence DP, using **Longest Common Subsequence** as the model.

<div class="code-group">

```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    # dp[i][j]: LCS length for text1[0:i] and text2[0:j]
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]  # +1 for empty prefix

    # Build from the bottom-up (smaller subproblems to larger)
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                # Characters match, extend the LCS from the previous prefix
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                # Characters don't match, take the best LCS from either
                # skipping char in text1 or skipping char in text2
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    # The answer is the LCS for the full strings
    return dp[m][n]
# Time: O(m * n) | Space: O(m * n)
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
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
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

</div>

For Knapsack-style problems like **Partition Equal Subset Sum**, the pattern shifts to a 1D DP array where the index represents an achievable sum.

<div class="code-group">

```python
def canPartition(nums: List[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2

    # dp[j]: whether sum `j` can be formed using processed numbers
    dp = [False] * (target + 1)
    dp[0] = True  # base case: sum 0 is always achievable

    for num in nums:
        # Iterate backwards to prevent reusing the same num in one iteration
        for j in range(target, num - 1, -1):
            if dp[j - num]:  # if we can form (j - num), we can form j by adding num
                dp[j] = True
        if dp[target]:  # early exit
            return True
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
    for (let j = target; j >= num; j--) {
      if (dp[j - num]) {
        dp[j] = true;
      }
    }
    if (dp[target]) return true;
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
        for (int j = target; j >= num; j--) {
            if (dp[j - num]) {
                dp[j] = true;
            }
        }
        if (dp[target]) return true;
    }
    return dp[target];
}
// Time: O(n * target) | Space: O(target)
```

</div>

## How Adobe Tests Dynamic Programming vs Other Companies

Compared to other tech giants, Adobe's DP questions are less about algorithmic trickery and more about **clean implementation and clear communication**. At Google or Meta, you might get a DP problem that's a small component of a larger system design or one heavily disguised. At Adobe, the DP problem is often the main event for that interview round. They want to see:

- **Step-by-step table building:** They'll ask you to walk through an example and fill out the `dp` table on the whiteboard or in a shared editor.
- **Space optimization:** After you give the 2D solution, be prepared to optimize to 1D ("Can we do better on space?"). The backward iteration in the knapsack code above is a classic follow-up.
- **Practical justification:** Be ready to explain _why_ DP applies—"Because the problem has optimal substructure and overlapping subproblems, as seen when we try these two examples..."

The difficulty is consistently in the **medium to medium-hard** range on LeetCode. You're unlikely to see a "hard" DP like "Cherry Pickup" unless you're applying for a specialized role.

## Study Order

Tackle DP in this logical sequence to build a solid foundation:

1.  **1D Linear DP:** Start with the simplest state definition. Problems: Fibonacci, Climbing Stairs (#70), House Robber (#198). This teaches you the core concept of a state (`dp[i]`) and a recurrence.
2.  **2D Grid Path DP:** Introduce a second state dimension in a simple, visual context. Problems: Unique Paths (#62), Minimum Path Sum (#64). This gets you comfortable with `dp[i][j]` and 2D iteration.
3.  **2D Sequence DP:** Apply the 2D table to sequences/strings. This is the most critical step for Adobe. Problems: Longest Common Subsequence (#1143), Edit Distance (#72).
4.  **1D Knapsack DP:** Learn to model a capacity constraint. Problems: Partition Equal Subset Sum (#416), Coin Change (#322). This teaches you the "include/exclude" decision and space-optimized iteration order.
5.  **Unbounded Knapsack & Variations:** Build on the knapsack pattern. Problems: Coin Change II (#518), Combination Sum IV (#377).
6.  **State Machine DP:** For advanced preparation. Problems: Best Time to Buy and Sell Stock with Cooldown (#309).

## Recommended Practice Order

Solve these Adobe-tagged problems in sequence:

1.  **Climbing Stairs (#70)** – The "hello world" of DP.
2.  **Unique Paths (#62)** – Introduces 2D tabulation.
3.  **Longest Common Subsequence (#1143)** – Master the core 2D sequence pattern.
4.  **Edit Distance (#72)** – A must-know Adobe problem; practice deriving the recurrence.
5.  **Partition Equal Subset Sum (#416)** – Master the 0/1 knapsack pattern and space optimization.
6.  **Coin Change (#322)** – Introduces the "minimum number of coins" variant.
7.  **Longest Palindromic Subsequence (#516)** – Applies LCS pattern to a single string.
8.  **Target Sum (#494)** – A good challenge that reduces to a subset sum problem.
9.  **Best Time to Buy and Sell Stock with Cooldown (#309)** – If you have time, tackle this state machine problem.

Remember, at Adobe, the interviewer is evaluating your problem decomposition skills as much as your coding. Always start by defining your state and recurrence relation out loud before writing a single line of code.

[Practice Dynamic Programming at Adobe](/company/adobe/dynamic-programming)
