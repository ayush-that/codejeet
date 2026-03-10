---
title: "Dynamic Programming Interview Questions: Patterns and Strategies"
description: "Master Dynamic Programming problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-07"
category: "dsa-patterns"
tags: ["dynamic-programming", "dsa", "interview prep"]
---

# Dynamic Programming Interview Questions: Patterns and Strategies

Dynamic programming is the great equalizer in coding interviews. With 497 questions tagged on LeetCode (49% medium, 49% hard), it's the topic that separates candidates who've done their homework from those who haven't. What makes DP particularly challenging isn't just the complexity—it's that problems that look simple at first glance often hide DP solutions.

Take "House Robber" (#198) as an example. Many candidates initially approach it with greedy thinking: "Just take every other house!" But what about houses with values [2, 1, 1, 2]? The greedy approach gives 3 (2+1), while the optimal is 4 (2+2). This catches people off guard because the problem looks like it should be simpler than it is. The realization that you need to consider overlapping subproblems—whether to rob house i depends on decisions about houses i-1 and i-2—is the classic "aha" moment that defines DP thinking.

## Common Patterns

### 1. The Fibonacci Pattern (1D DP)

This is where most people start with DP, and for good reason—it teaches the fundamental concept of building solutions from smaller subproblems. The pattern: your solution for position `i` depends on solutions at `i-1` and `i-2` (or sometimes `i-k` for some constant k).

**Key Problems:** Climbing Stairs (#70), House Robber (#198), Decode Ways (#91)

The intuition: If you're trying to reach step `n`, you could have come from step `n-1` (taking 1 step) or step `n-2` (taking 2 steps). The total ways to reach `n` equals the sum of ways to reach `n-1` and `n-2`. This overlapping subproblem structure screams DP.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - optimized version
def climbStairs(n: int) -> int:
    if n <= 2:
        return n

    # We only need the last two values
    prev1, prev2 = 2, 1  # ways for n=2 and n=1

    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current

    return prev1

# Space: O(n) version for clarity
def climbStairsDP(n: int) -> int:
    if n <= 2:
        return n

    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2

    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]
```

```javascript
// Time: O(n) | Space: O(1)
function climbStairs(n) {
  if (n <= 2) return n;

  let prev1 = 2; // ways for n=2
  let prev2 = 1; // ways for n=1

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Space: O(n) version
function climbStairsDP(n) {
  if (n <= 2) return n;

  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}
```

```java
// Time: O(n) | Space: O(1)
public int climbStairs(int n) {
    if (n <= 2) return n;

    int prev1 = 2;  // ways for n=2
    int prev2 = 1;  // ways for n=1

    for (int i = 3; i <= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}

// Space: O(n) version
public int climbStairsDP(int n) {
    if (n <= 2) return n;

    int[] dp = new int[n + 1];
    dp[1] = 1;
    dp[2] = 2;

    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }

    return dp[n];
}
```

</div>

### 2. The 0/1 Knapsack Pattern

This is the workhorse of DP problems. You have items with weights and values, and a capacity constraint. For each item, you either take it or don't (0 or 1). The pattern extends to many problems that don't look like knapsack at first glance.

**Key Problems:** Partition Equal Subset Sum (#416), Target Sum (#494), Coin Change (#322) (unbounded variant)

The intuition: For each item `i` and capacity `c`, you have two choices: include item `i` (if it fits) or exclude it. The optimal solution is the better of these two choices. This creates a 2D DP table where `dp[i][c]` represents the best value using the first `i` items with capacity `c`.

<div class="code-group">

```python
# Time: O(n * target) | Space: O(target) - optimized
def canPartition(nums: List[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False

    target = total // 2
    # dp[c] = can we achieve sum c using processed items?
    dp = [False] * (target + 1)
    dp[0] = True  # empty set has sum 0

    for num in nums:
        # Process backwards to avoid reusing same num
        for c in range(target, num - 1, -1):
            dp[c] = dp[c] or dp[c - num]

    return dp[target]
```

```javascript
// Time: O(n * target) | Space: O(target)
function canPartition(nums) {
  const total = nums.reduce((sum, num) => sum + num, 0);
  if (total % 2 !== 0) return false;

  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let c = target; c >= num; c--) {
      dp[c] = dp[c] || dp[c - num];
    }
  }

  return dp[target];
}
```

```java
// Time: O(n * target) | Space: O(target)
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int num : nums) total += num;
    if (total % 2 != 0) return false;

    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;

    for (int num : nums) {
        for (int c = target; c >= num; c--) {
            dp[c] = dp[c] || dp[c - num];
        }
    }

    return dp[target];
}
```

</div>

### 3. The Longest Common Subsequence Pattern (2D DP for Sequences)

When you're comparing two sequences (strings, arrays) and looking for optimal alignment or common structure, think LCS. The recurrence relation is elegant: if characters match, extend the solution; if not, take the best of skipping one character from either sequence.

**Key Problems:** Longest Common Subsequence (#1143), Edit Distance (#72), Longest Palindromic Subsequence (#516)

The intuition: For strings `text1[0..i]` and `text2[0..j]`, if the last characters match, the LCS is 1 + LCS of the prefixes. If they don't match, it's the maximum of LCS ignoring either character. This creates overlapping subproblems perfect for DP.

<div class="code-group">

```python
# Time: O(m * n) | Space: O(min(m, n)) - space optimized
def longestCommonSubsequence(text1: str, text2: str) -> int:
    # Ensure text1 is the shorter string for space optimization
    if len(text1) > len(text2):
        text1, text2 = text2, text1

    m, n = len(text1), len(text2)
    # Previous row of DP table
    prev = [0] * (m + 1)

    for j in range(1, n + 1):
        curr = [0] * (m + 1)
        for i in range(1, m + 1):
            if text1[i-1] == text2[j-1]:
                curr[i] = prev[i-1] + 1
            else:
                curr[i] = max(prev[i], curr[i-1])
        prev = curr

    return prev[m]
```

```javascript
// Time: O(m * n) | Space: O(min(m, n))
function longestCommonSubsequence(text1, text2) {
  // Make text1 the shorter string
  if (text1.length > text2.length) {
    [text1, text2] = [text2, text1];
  }

  const m = text1.length,
    n = text2.length;
  let prev = new Array(m + 1).fill(0);

  for (let j = 1; j <= n; j++) {
    const curr = new Array(m + 1).fill(0);
    for (let i = 1; i <= m; i++) {
      if (text1[i - 1] === text2[j - 1]) {
        curr[i] = prev[i - 1] + 1;
      } else {
        curr[i] = Math.max(prev[i], curr[i - 1]);
      }
    }
    prev = curr;
  }

  return prev[m];
}
```

```java
// Time: O(m * n) | Space: O(min(m, n))
public int longestCommonSubsequence(String text1, String text2) {
    // Ensure text1 is shorter for space optimization
    if (text1.length() > text2.length()) {
        String temp = text1;
        text1 = text2;
        text2 = temp;
    }

    int m = text1.length(), n = text2.length();
    int[] prev = new int[m + 1];

    for (int j = 1; j <= n; j++) {
        int[] curr = new int[m + 1];
        for (int i = 1; i <= m; i++) {
            if (text1.charAt(i-1) == text2.charAt(j-1)) {
                curr[i] = prev[i-1] + 1;
            } else {
                curr[i] = Math.max(prev[i], curr[i-1]);
            }
        }
        prev = curr;
    }

    return prev[m];
}
```

</div>

## When to Use Dynamic Programming vs Alternatives

Recognizing DP problems is half the battle. Here's my mental checklist:

1. **Look for "optimal" or "maximum/minimum"** - If the problem asks for the best possible outcome (max profit, min cost, longest sequence), DP is a candidate.

2. **Check for overlapping subproblems** - Can the problem be broken down into smaller versions of itself? Would solving those smaller problems help solve the larger one? Would you solve the same subproblem multiple times in a naive approach?

3. **Consider decision sequences** - Are you making a sequence of decisions where each decision affects future options? The "state" after k decisions should be enough to determine optimal future decisions.

**When to choose alternatives:**

- **Greedy**: When local optimal choices guarantee global optimum (e.g., activity selection, Huffman coding). Test with counterexamples.
- **Divide and Conquer**: When subproblems don't overlap (e.g., merge sort, binary search).
- **BFS/DFS**: When you need to explore all possible states/paths (e.g., maze solving, graph traversal).
- **Simple iteration/math**: Sometimes there's a closed-form solution (e.g., "Climbing Stairs" is just Fibonacci).

**Decision criteria**: If you find yourself thinking "I could try all combinations, but that's exponential," and those combinations share substructure, you're likely looking at DP.

## Edge Cases and Gotchas

1. **Empty or single-element inputs** - DP problems often fail on empty arrays or strings. Always check `if not nums: return 0` or similar. For "House Robber," what if there's only one house? Two houses?

2. **Integer overflow in recurrence relations** - In problems like "Climbing Stairs" with large n, the Fibonacci numbers can overflow. Use modulo if specified, or discuss with your interviewer.

3. **Off-by-one in DP array indices** - The classic mistake: `dp[i]` representing solution for first `i` elements vs `i-1` elements. Be consistent. I prefer making `dp` length `n+1` with `dp[0]` as base case for empty input.

4. **Initialization of DP table** - What values should `dp[0]`, `dp[1]`, etc., have? For minimization problems, initialize with `inf`. For maximization, sometimes with `-inf` or `0`. Get this wrong and everything breaks.

5. **Direction of iteration matters** - In the knapsack space-optimized version, you must iterate backwards through the capacity array. Going forwards would allow reusing the same item multiple times (unbounded knapsack).

## Difficulty Breakdown

The 12% easy, 49% medium, 49% hard split tells a story: DP doesn't come easy. Those "easy" problems (like Climbing Stairs) are there to teach the concept. The near-equal medium/hard split means companies use DP to differentiate candidates.

**Study prioritization**:

1. Master the easy problems thoroughly—understand why they're DP.
2. Tackle medium problems by pattern (Fibonacci, knapsack, LCS).
3. Save hard problems for last—they often combine multiple DP concepts or add twists.

Don't be discouraged by the high percentage of hard problems. Many "hard" DP problems are just medium problems with an extra constraint or dimension.

## Which Companies Ask Dynamic Programming

- **Google** (/company/google): Loves DP problems with clever optimizations. Expect problems that can be solved in O(n²) but have an O(n log n) or O(n) solution if you're sharp. They also like DP on trees.

- **Amazon** (/company/amazon): Practical DP problems often related to their business—inventory optimization, scheduling, resource allocation. Knapsack variants are common.

- **Microsoft** (/company/microsoft): String DP problems (edit distance, regex matching) and game theory DP (minimax, two-player games).

- **Meta** (/company/meta): DP on arrays and strings for their interview loops. Expect problems like "Word Break" (#139) and "Longest Increasing Subsequence" (#300).

- **Bloomberg** (/company/bloomberg): Financial DP problems—maximizing profit with constraints, portfolio optimization. Also string manipulation DP.

Each company has its style, but all expect you to recognize DP patterns quickly and implement them correctly.

## Study Tips

1. **Learn by pattern, not by problem** - Don't memorize solutions. When you solve a problem, identify which pattern it uses. Create a mental library: "This is a knapsack problem disguised as..."

2. **Start with recursion, then add memoization, then convert to DP** - This three-step approach ensures you understand the recurrence relation. Write the brute force recursive solution first, even if it's exponential.

3. **Draw the DP table** - Before coding, sketch a small example. Fill in the table manually. This reveals the recurrence relation and initialization needs.

4. **Practice in this order**:
   - Fibonacci pattern (Climbing Stairs, House Robber)
   - 0/1 Knapsack (Subset Sum, Partition Equal Subset Sum)
   - Unbounded Knapsack (Coin Change)
   - LCS pattern (Longest Common Subsequence, Edit Distance)
   - DP on intervals (Matrix Chain Multiplication, Burst Balloons)
   - DP on trees (House Robber III)

5. **Time yourself** - In interviews, you have 25-35 minutes for a medium DP problem. Practice explaining your thought process while solving.

The key insight about DP is that it's fundamentally about smart recursion—avoiding repeated work by remembering past results. Once you internalize the common patterns, you'll start seeing DP opportunities everywhere. It's a skill that improves with deliberate practice.

[Practice all Dynamic Programming questions on CodeJeet](/topic/dynamic-programming)
