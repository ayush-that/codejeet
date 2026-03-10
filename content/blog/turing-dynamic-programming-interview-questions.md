---
title: "Dynamic Programming Questions at Turing: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Turing — patterns, difficulty breakdown, and study tips."
date: "2030-03-03"
category: "dsa-patterns"
tags: ["turing", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Turing isn't just another topic on the list—it's a critical filter. With 10 out of 40 total questions dedicated to DP, it represents a full 25% of their technical question bank. This is a significantly higher concentration than at many other large tech firms, where DP might appear in 10-15% of questions. At Turing, DP is used as a direct proxy for evaluating a candidate's ability to think in systems, optimize complex processes, and break down a seemingly intractable problem into manageable, overlapping subproblems. In real interviews, you can expect at least one DP question in the later stages of the onsite loop, often in the second or third technical round. It’s not a "gotcha" topic; it's a core focus area they use to separate strong systems thinkers from those who can only handle straightforward implementations.

## Specific Patterns Turing Favors

Turing’s DP questions have a distinct flavor. They heavily favor **iterative, bottom-up tabulation** over recursive memoization. This aligns with their engineering culture, which emphasizes efficiency, clear state transitions, and minimizing overhead. You'll rarely see purely academic DP problems (like the classic rod-cutting or egg-dropping). Instead, they lean heavily into **DP on strings** and **DP for optimization on arrays or sequences**, often with a twist that requires careful state definition.

Two patterns are particularly prevalent:

1.  **"Two-State" or "Take-or-Skip" DP:** Problems where at each step, you have a binary choice that affects future state, like in knapsack or subsequence problems. Turing often wraps this in a business logic context.
2.  **"DP on String Matching / Comparison":** Problems involving edit distance, subsequence matching, or palindrome partitioning. These test your ability to design a 2D DP table where `dp[i][j]` represents the state of processing up to a certain point in two different sequences.

For example, **"Longest Common Subsequence" (#1143)** is a fundamental building block. **"Edit Distance" (#72)** is another classic they expect you to know cold. A problem like **"Maximum Product Subarray" (#152)** tests your ability to manage multiple states (max and min) simultaneously—a common Turing twist.

## How to Prepare

The key is to master the framework, not just memorize solutions. For any DP problem, your thought process should be: 1) Define the state (`dp[i]` means what?), 2) Define the recurrence relation (how does `dp[i]` relate to earlier states?), 3) Define the base case, 4) Determine the iteration order, and 5) Extract the answer.

Let's look at the "Two-State" pattern using the classic **"0/1 Knapsack"** problem as our mental model. Here’s how you implement the iterative, bottom-up approach.

<div class="code-group">

```python
def knapsack(weights, values, capacity):
    """
    Solves the 0/1 Knapsack problem using bottom-up DP.
    :param weights: List of item weights
    :param values: List of item values
    :param capacity: Maximum weight capacity
    :return: Maximum achievable value
    """
    n = len(weights)
    # dp[i][w] represents the max value using the first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            # Choice 1: Skip the i-th item
            skip = dp[i-1][w]
            # Choice 2: Take the i-th item (if it fits)
            take = 0
            if weights[i-1] <= w:
                take = values[i-1] + dp[i-1][w - weights[i-1]]
            # Take the best option
            dp[i][w] = max(skip, take)

    return dp[n][capacity]

# Time: O(n * capacity) | Space: O(n * capacity)
# Space can be optimized to O(capacity) using a 1D array.
```

```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  // dp[i][w] = max value with first i items and capacity w
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      // Skip item i-1
      const skip = dp[i - 1][w];
      // Take item i-1 if possible
      let take = 0;
      if (weights[i - 1] <= w) {
        take = values[i - 1] + dp[i - 1][w - weights[i - 1]];
      }
      dp[i][w] = Math.max(skip, take);
    }
  }
  return dp[n][capacity];
}
// Time: O(n * capacity) | Space: O(n * capacity)
```

```java
public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    // dp[i][w] = max value with first i items and capacity w
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= capacity; w++) {
            // Option 1: Skip the (i-1)th item
            int skip = dp[i-1][w];
            // Option 2: Take the (i-1)th item if it fits
            int take = 0;
            if (weights[i-1] <= w) {
                take = values[i-1] + dp[i-1][w - weights[i-1]];
            }
            dp[i][w] = Math.max(skip, take);
        }
    }
    return dp[n][capacity];
}
// Time: O(n * capacity) | Space: O(n * capacity)
```

</div>

For the **"DP on Strings"** pattern, let's examine the core of **"Edit Distance" (#72)**. The state `dp[i][j]` is the minimum operations to convert `word1[0..i)` to `word2[0..j)`.

<div class="code-group">

```python
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i  # delete all chars from word1
    for j in range(n + 1):
        dp[0][j] = j  # insert all chars into word1

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                # Characters match, no operation needed
                dp[i][j] = dp[i-1][j-1]
            else:
                # Choose minimum of: insert, delete, or replace
                dp[i][j] = 1 + min(
                    dp[i][j-1],    # Insert into word1
                    dp[i-1][j],    # Delete from word1
                    dp[i-1][j-1]   # Replace
                )
    return dp[m][n]

# Time: O(m * n) | Space: O(m * n)
```

```javascript
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

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
            dp[i][j - 1], // insert
            dp[i - 1][j], // delete
            dp[i - 1][j - 1] // replace
          );
      }
    }
  }
  return dp[m][n];
}
// Time: O(m * n) | Space: O(m * n)
```

```java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(
                    Math.min(dp[i][j-1],   // insert
                            dp[i-1][j]),   // delete
                    dp[i-1][j-1]           // replace
                );
            }
        }
    }
    return dp[m][n];
}
// Time: O(m * n) | Space: O(m * n)
```

</div>

## How Turing Tests Dynamic Programming vs Other Companies

At companies like Google or Meta, a DP problem might be one part of a broader problem, or it could be disguised within a graph traversal. The focus is often on _identifying_ the DP pattern amidst other noise. At Turing, the DP question is frequently more "naked"—they present a problem that is clearly optimized via DP, but the difficulty lies in the _state design complexity_ and _edge case handling_.

What's unique is their emphasis on **space optimization**. It's common for a Turing interviewer to follow up a working O(n²) space solution with, "Can you improve the space complexity?" They want to see that you understand the underlying state dependencies well enough to collapse a 2D table to a 1D array, or that you recognize when only two rows of the table are needed. This reflects their real-world engineering priority on efficient resource utilization.

## Study Order

Don't jump into hard problems. Build your intuition systematically.

1.  **1D DP (Linear):** Start with the simplest state definition: `dp[i]` meaning "the answer for the subarray ending at i" or "the answer for the first i elements." Problems: Climbing Stairs (#70), House Robber (#198).
2.  **Classic 2D DP (Knapsack Family):** Learn the foundational `dp[i][w]` or `dp[i][j]` table. This teaches you how to model a resource constraint (capacity) or two sequences. Problems: 0/1 Knapsack, Subset Sum, Longest Common Subsequence (#1143).
3.  **DP on Strings (Comparison):** Apply the 2D table to string problems. This solidifies your understanding of state transition based on character matching. Problems: Edit Distance (#72), Longest Palindromic Subsequence (#516).
4.  **DP with Multiple States:** Turing loves these. Here, `dp[i]` isn't a single value but a tuple (e.g., `max_ending_here` and `min_ending_here`). Problems: Maximum Product Subarray (#152), Best Time to Buy/Sell Stock with Cooldown (#309).
5.  **Interval/Partition DP:** The most complex, where `dp[i][j]` represents the answer for the sub-interval `[i, j]`. Problems: Palindrome Partitioning II (#132), Burst Balloons (#312).

## Recommended Practice Order

Solve these in sequence. Master each pattern before moving to the next.

1.  Climbing Stairs (#70) - The "hello world" of DP.
2.  House Robber (#198) - Classic 1D linear DP.
3.  Coin Change (#322) - Unbounded knapsack variant.
4.  Longest Common Subsequence (#1143) - Foundational 2D string DP.
5.  Edit Distance (#72) - Must-know 2D string DP with three operations.
6.  Maximum Product Subarray (#152) - Requires managing two states (max and min).
7.  Word Break (#139) - Combines string DP with a lookup set.
8.  Longest Palindromic Subsequence (#516) - Clever reduction to LCS.
9.  Best Time to Buy/Sell Stock with Cooldown (#309) - A classic Turing-style multi-state DP.
10. Decode Ways (#91) - Excellent for practicing careful base cases and state transitions, a common Turing interview problem.

[Practice Dynamic Programming at Turing](/company/turing/dynamic-programming)
