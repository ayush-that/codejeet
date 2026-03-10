---
title: "Dynamic Programming Questions at Meta: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Meta — patterns, difficulty breakdown, and study tips."
date: "2027-03-09"
category: "dsa-patterns"
tags: ["meta", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Meta isn't just another topic on the list—it's a fundamental filter. With 191 DP problems in their tagged question bank (nearly 14% of their total), it's clear they consider it a core competency for evaluating a candidate's ability to break down complex, scalable problems. In my experience conducting and participating in interviews there, you can expect at least one DP question in the onsite loop, typically in the second or third coding round. It's rarely the warm-up question; it's the problem designed to see if you can move from a brute-force intuition to an optimized, bottom-up solution under pressure. The frequency is high because DP concepts directly translate to Meta's engineering challenges: optimizing news feed ranking (sequence decisions), minimizing computational resources for video processing (knapsack-like constraints), and handling state transitions in large-scale systems.

## Specific Patterns Meta Favors

Meta's DP questions have a distinct flavor. They heavily favor **iterative, bottom-up tabulation** over recursive memoization. Interviewers want to see you build the solution from the ground up, often because it leads to more discussable space optimization. The patterns are practical and often tied to string manipulation, array sequences, or simple state machines.

The top three patterns you'll encounter are:

1.  **1D/2D Sequence DP:** Classic problems like finding the longest palindromic substring, longest increasing subsequence, or counting ways to decode a string. These test your ability to define a state (`dp[i]` or `dp[i][j]`) that represents an optimal answer for a prefix or subarray.
2.  **Knapsack/Subset DP:** Not the classic "weight & value" problem, but variations involving partitioning arrays or making decisions with constraints. Think "Partition Equal Subset Sum" (LeetCode #416) or "Target Sum" (LeetCode #494). These test your ability to handle boolean or counting DP with a target.
3.  **State Machine DP:** This is a Meta favorite for problems involving sequences with restrictions. The classic example is "Best Time to Buy and Sell Stock with Cooldown" (LeetCode #309), where you must track multiple states (`hold`, `sold`, `cooldown`) at each day. It's less about a complex recurrence and more about managing clear, defined transitions.

You'll notice a distinct _lack_ of highly abstract graph DP (like Floyd-Warshall) or exotic DP on trees. Their problems are grounded and often have a direct brute-force recursive solution you're expected to evolve from.

## How to Prepare

The key is to master the transition from top-down thinking to bottom-up implementation. Start every DP problem by asking: "What is the smallest, trivial subproblem?" Then, determine how to build the answer for `i` using answers from `i-1`, `i-2`, etc.

Let's look at a foundational pattern: **1D Sequence DP for counting ways**. The problem "Decode Ways" (LeetCode #91) is quintessential Meta.

<div class="code-group">

```python
def numDecodings(s: str) -> int:
    # Time: O(n) | Space: O(n) -> can be optimized to O(1)
    if not s or s[0] == '0':
        return 0

    n = len(s)
    # dp[i] = number of ways to decode substring s[:i]
    dp = [0] * (n + 1)
    dp[0], dp[1] = 1, 1  # Empty string and first char

    for i in range(2, n + 1):
        # Check one-digit decode (s[i-1] must not be '0')
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        # Check two-digit decode (must be between "10" and "26")
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]

    return dp[n]
```

```javascript
function numDecodings(s) {
  // Time: O(n) | Space: O(n)
  if (!s || s[0] === "0") return 0;

  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    // One-digit decode
    if (s[i - 1] !== "0") {
      dp[i] += dp[i - 1];
    }
    // Two-digit decode
    const twoDigit = parseInt(s.substring(i - 2, i), 10);
    if (twoDigit >= 10 && twoDigit <= 26) {
      dp[i] += dp[i - 2];
    }
  }
  return dp[n];
}
```

```java
public int numDecodings(String s) {
    // Time: O(n) | Space: O(n)
    if (s == null || s.length() == 0 || s.charAt(0) == '0') return 0;

    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        // One-digit decode
        if (s.charAt(i - 1) != '0') {
            dp[i] += dp[i - 1];
        }
        // Two-digit decode
        int twoDigit = Integer.parseInt(s.substring(i - 2, i));
        if (twoDigit >= 10 && twoDigit <= 26) {
            dp[i] += dp[i - 2];
        }
    }
    return dp[n];
}
```

</div>

The pattern is clear: `dp[i]` depends on `dp[i-1]` and possibly `dp[i-2]`. The next step interviewers expect is to notice we only need the last two values, enabling an O(1) space optimization—a common follow-up.

For state machine DP, like in the stock with cooldown problem, the preparation is different. You must explicitly define your states and the transitions between them before writing any code. Draw the state diagram on your whiteboard first.

## How Meta Tests Dynamic Programming vs Other Companies

At Google or Amazon, a DP problem might be deeply nested within a graph or system design context. At Meta, the DP problem is often presented naked and algorithmic. The interviewer's focus is on your **process**: can you identify it as DP, derive the recurrence relation on the fly, and implement it bug-free? They are less interested in you knowing a specific trick and more interested in watching you _reason_.

The difficulty is calibrated to "Medium" on LeetCode, with occasional "Hard" for senior roles. The unique aspect is the **follow-up**. Almost invariably, after you present the O(n) space solution, you'll be asked: "Can we do better?" This is your cue to discuss rolling arrays or reducing the state dimension. They want to see that you understand the solution deeply enough to optimize it, not just memorize it.

## Study Order

Tackle DP in this order to build a compounding understanding:

1.  **Foundation: Fibonacci & Climbing Stairs (LeetCode #70).** Learn the concept of overlapping subproblems and how a simple recurrence works. Practice both top-down (memo) and bottom-up.
2.  **1D Linear DP.** Problems where `dp[i]` represents an answer for the prefix ending at `i`. Practice "Decode Ways" (#91), "House Robber" (#198), and "Longest Increasing Subsequence" (#300). This solidifies the state definition.
3.  **2D Grid/String DP.** Move to two-state definitions: `dp[i][j]` for two sequences or a subarray. Practice "Longest Common Subsequence" (#1143) and "Edit Distance" (#72). This teaches you to handle more complex recurrences.
4.  **Knapsack-style (0/1) DP.** Learn to handle problems with a target sum or capacity. Practice "Partition Equal Subset Sum" (#416) and "Target Sum" (#494). This introduces the concept of DP over a _range_ of possible sums.
5.  **State Machine DP.** Finally, tackle problems with clear, discrete states. Practice "Best Time to Buy and Sell Stock with Cooldown" (#309) and "Maximum Subarray" (#53) (which can be framed as a simple two-state problem). This is where you synthesize all prior knowledge.

## Recommended Practice Order

Solve these Meta-tagged problems in sequence. Each builds on the previous pattern:

1.  **Climbing Stairs (#70)** - The absolute baseline.
2.  **House Robber (#198)** - 1D DP with a simple decision.
3.  **Decode Ways (#91)** - 1D DP with more complex conditions (shown above).
4.  **Longest Palindromic Substring (#5)** - 2D DP on a string; a classic.
5.  **Word Break (#139)** - A blend of 1D DP and hash set lookup.
6.  **Partition Equal Subset Sum (#416)** - Introduction to subset-sum / knapsack DP.
7.  **Target Sum (#494)** - A variation on subset-sum, excellent for discussion.
8.  **Best Time to Buy and Sell Stock with Cooldown (#309)** - Master this state machine problem.
9.  **Maximum Product Subarray (#152)** - Looks like #53 but requires tracking two states (min and max).
10. **Edit Distance (#72)** - A rigorous 2D DP problem that tests your recurrence skills.

Remember, at Meta, the code is only half the battle. You must communicate your thought process, derive the recurrence relation aloud, and be prepared to optimize space. Practice by explaining your solution to an empty room as you code.

[Practice Dynamic Programming at Meta](/company/meta/dynamic-programming)
