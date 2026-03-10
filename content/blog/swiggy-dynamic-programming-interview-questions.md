---
title: "Dynamic Programming Questions at Swiggy: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-01-28"
category: "dsa-patterns"
tags: ["swiggy", "dynamic-programming", "interview prep"]
---

## Why Dynamic Programming Matters at Swiggy

Swiggy’s technical interviews place a significant emphasis on Dynamic Programming (DP). With 11 out of their 41 tagged problems being DP-related, it’s clear this isn’t a secondary topic—it’s a core assessment area. In real interviews, DP questions appear frequently, especially in the later rounds (typically the second or third coding interview). This makes sense given Swiggy’s domain: at its heart, Swiggy solves complex optimization problems—routing delivery executives, managing inventory, minimizing delivery times, and allocating orders efficiently. These are classic scenarios where DP shines. Interviewers use DP problems to evaluate not just your ability to write code, but your capacity to break down a complex, real-world optimization problem into overlapping subproblems and construct an efficient solution. If you’re interviewing at Swiggy, you must be comfortable with DP.

## Specific Patterns Swiggy Favors

Swiggy’s DP problems tend to cluster around a few key patterns that mirror their business logic. You won’t see many esoteric or purely mathematical DP problems here. Instead, expect problems related to sequences, strings, and basic grid traversal—patterns that underpin logistics and matching problems.

1.  **String/Sequence DP:** This is the most common category. Problems involve comparing, transforming, or finding patterns in strings or sequences. Think edit distance, longest common subsequence, or ways to decode a message. These map directly to data-matching and parsing challenges in their systems.
2.  **1D/2D "Take or Skip" DP (Knapsack-style):** Problems where you have a target (like a sum or a capacity) and a set of items, and you need to count ways or find an optimal combination. This pattern is fundamental for resource allocation.
3.  **Grid Traversal DP:** Simple 2D grid problems where you find unique paths or minimum path sums. These are often the "warm-up" DP questions and test your understanding of state definition and transition.

You will primarily be expected to write **iterative (bottom-up) DP** solutions. While explaining the recursive relation is crucial, the final, efficient code should use tabulation. Recursive + memoization solutions are sometimes accepted but are often probed for optimization to the iterative form.

**Example LeetCode problems that reflect Swiggy's style:** Edit Distance (#72), Longest Common Subsequence (#1143), Decode Ways (#91), Coin Change (#322), Unique Paths (#62).

## How to Prepare

The key to Swiggy’s DP problems is mastering the transition from a brute-force recursive thought process to an optimized tabular solution. Let’s take the **"Decode Ways"** problem (#91) as a template. The pattern here is a 1D DP array where `dp[i]` represents the number of ways to decode the substring up to index `i`.

**Step 1: Define the State.** What does `dp[i]` represent? Answer: The number of ways to decode the string `s[0:i+1]`.
**Step 2: Find the Recurrence Relation.** A character at index `i` can be decoded alone (if it's not '0') or paired with the previous character (if it forms a valid number between 10 and 26). So `dp[i] = dp[i-1] (if valid single) + dp[i-2] (if valid pair)`.
**Step 3: Base Cases.** Handle the start of the string (`dp[0]`) and an imaginary `dp[-1]` carefully.
**Step 4: Build Iteratively.** Fill the `dp` array from left to right.

Here is the iterative implementation of this pattern:

<div class="code-group">

```python
# LeetCode #91 - Decode Ways
# Time: O(n) | Space: O(n) (can be optimized to O(1))
def numDecodings(s: str) -> int:
    if not s or s[0] == '0':
        return 0

    n = len(s)
    # dp[i] = ways to decode s[:i+1]
    dp = [0] * (n + 1)
    # Base cases: dp[0] = 1 (empty string has 1 way), dp[1] = 1 (first char, if not '0', handled above)
    dp[0], dp[1] = 1, 1

    for i in range(2, n + 1):
        # Check single digit decode (s[i-1] must not be '0')
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        # Check two digit decode (s[i-2:i] must be between "10" and "26")
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]

    return dp[n]
```

```javascript
// LeetCode #91 - Decode Ways
// Time: O(n) | Space: O(n) (can be optimized to O(1))
function numDecodings(s) {
  if (!s || s[0] === "0") return 0;

  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  // Base cases
  dp[0] = 1; // empty string
  dp[1] = 1; // first character (non-zero, as per initial check)

  for (let i = 2; i <= n; i++) {
    // Single digit decode
    if (s[i - 1] !== "0") {
      dp[i] += dp[i - 1];
    }
    // Two digit decode
    const twoDigit = parseInt(s.substring(i - 2, i), 10);
    if (twoDigit >= 10 && twoDigit <= 26) {
      dp[i] += dp[i - 2];
    }
  }
  return dp[n];
}
```

```java
// LeetCode #91 - Decode Ways
// Time: O(n) | Space: O(n) (can be optimized to O(1))
public int numDecodings(String s) {
    if (s == null || s.length() == 0 || s.charAt(0) == '0') {
        return 0;
    }

    int n = s.length();
    int[] dp = new int[n + 1];
    // Base cases
    dp[0] = 1; // empty string
    dp[1] = 1; // first character (non-zero)

    for (int i = 2; i <= n; i++) {
        // Single digit decode
        if (s.charAt(i - 1) != '0') {
            dp[i] += dp[i - 1];
        }
        // Two digit decode
        int twoDigit = Integer.parseInt(s.substring(i - 2, i));
        if (twoDigit >= 10 && twoDigit <= 26) {
            dp[i] += dp[i - 2];
        }
    }
    return dp[n];
}
```

</div>

For a **2D DP pattern** like **"Edit Distance"** (#72), the state is `dp[i][j]` = min operations to convert `word1[0:i]` to `word2[0:j]`. The recurrence involves considering insert, delete, and replace operations.

<div class="code-group">

```python
# LeetCode #72 - Edit Distance
# Time: O(m*n) | Space: O(m*n)
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i  # deletions
    for j in range(n + 1):
        dp[0][j] = j  # insertions

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # characters match, no cost
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # delete from word1
                    dp[i][j-1],    # insert into word1
                    dp[i-1][j-1]   # replace
                )
    return dp[m][n]
```

```javascript
// LeetCode #72 - Edit Distance
// Time: O(m*n) | Space: O(m*n)
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // delete
            dp[i][j - 1], // insert
            dp[i - 1][j - 1] // replace
          );
      }
    }
  }
  return dp[m][n];
}
```

```java
// LeetCode #72 - Edit Distance
// Time: O(m*n) | Space: O(m*n)
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];

    // Base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(
                    Math.min(dp[i-1][j],   // delete
                             dp[i][j-1]),  // insert
                    dp[i-1][j-1]           // replace
                );
            }
        }
    }
    return dp[m][n];
}
```

</div>

## How Swiggy Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Swiggy’s DP problems are less about clever tricks and more about **applied optimization**. At companies like Google or Meta, you might get a DP problem disguised as a graph problem or requiring a non-intuitive state definition. At Swiggy, the DP application is more direct and often linked to a plausible scenario (e.g., "find the minimum cost to deliver orders" maps to a path or knapsack problem). The difficulty is usually in the **medium** range on LeetCode, with occasional medium-hard problems. What’s unique is the interviewer’s focus: they will deeply probe your reasoning behind the state definition and recurrence relation. They want to see that you understand _why_ the DP approach works for the given problem, not just that you’ve memorized a solution. Be prepared to walk through a small example and manually fill the DP table.

## Study Order

Do not jump into complex DP. Build your intuition systematically.

1.  **Foundation: Fibonacci & Climbing Stairs (#70).** Understand overlapping subproblems and memoization vs. tabulation. This is where you learn the core idea.
2.  **1D Linear DP.** Problems where `dp[i]` depends on a constant number of previous states (like Decode Ways #91, House Robber #198). This solidifies the state-transition model.
3.  **2D Grid DP.** Unique Paths (#62) and Minimum Path Sum (#64). This introduces 2D state and simple directional transitions.
4.  **String/Sequence Comparison DP.** Longest Common Subsequence (#1143) and Edit Distance (#72). This is critical for Swiggy. Master the "what if characters match? what if they don't?" logic.
5.  **Knapsack-style (0/1) DP.** Subset Sum problems and Coin Change (#322). Learn to handle problems with a target constraint.
6.  **(Optional) Advanced Patterns.** Problems like Longest Increasing Subsequence (#300) or DP on intervals. These are less frequent but good for completeness.

## Recommended Practice Order

Solve these problems in sequence to build the specific competency Swiggy looks for:

1.  Climbing Stairs (#70) - The absolute basics.
2.  House Robber (#198) - 1D DP with a simple decision.
3.  Unique Paths (#62) - 2D DP introduction.
4.  Decode Ways (#91) - Classic Swiggy-style 1D DP with conditions.
5.  Coin Change (#322) - Unbounded knapsack pattern.
6.  Longest Common Subsequence (#1143) - Foundational string DP.
7.  Edit Distance (#72) - The quintessential Swiggy DP problem. Know it cold.
8.  Target Sum (#494) - Adds a twist to the subset sum pattern.
9.  Partition Equal Subset Sum (#416) - Tests understanding of the knapsack application.
10. Minimum Path Sum (#64) - A straightforward but common 2D DP finale.

This progression moves from simple state definition to the conditional logic and 2D states prevalent in Swiggy's question bank.

[Practice Dynamic Programming at Swiggy](/company/swiggy/dynamic-programming)
