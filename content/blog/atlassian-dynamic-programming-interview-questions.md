---
title: "Dynamic Programming Questions at Atlassian: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-24"
category: "dsa-patterns"
tags: ["atlassian", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a core algorithmic technique for optimizing solutions to complex problems by breaking them into overlapping subproblems. At Atlassian, with 9 out of 62 total coding questions tagged as DP, it's a significant part of their technical interview landscape. This emphasis exists because DP mirrors real-world engineering challenges at scale—whether optimizing resource allocation in Jira, managing state in Bitbucket pipelines, or improving performance in Confluence. It tests a candidate's ability to recognize patterns, reason about optimal substructure, and implement efficient, scalable solutions, which are daily requirements for building and maintaining their large-scale distributed systems.

## What to Expect — Types of Problems

Atlassian's DP questions typically fall into two practical categories. First, **classical optimization problems** with direct business analogs, like the "Knapsack" problem (resource allocation for features or servers), "Coin Change" (minimum services to deploy a change), or "Longest Common Subsequence" (data diffing or version comparison). Second, **array/string manipulation problems** that require state transition thinking, such as finding the maximum sum of non-adjacent elements (like selecting optimal tasks) or counting ways to decode a message (routing or parsing scenarios). The problems often have constraints that make brute force infeasible, pushing you to identify the recurrence relation and optimize using memoization or tabulation.

## How to Prepare — Study Tips with One Code Example

Start by mastering the core principle: a DP problem can be broken into smaller, overlapping subproblems whose results are stored to avoid recomputation. Internalize the two main implementation approaches: **top-down with memoization** (recursive, caching results) and **bottom-up with tabulation** (iterative, building a table). Practice deriving the recurrence relation before writing code. For example, a fundamental pattern is the "Fibonacci-like" recurrence, which appears in many problems like climbing stairs or decoding ways.

Here is a classic "Climbing Stairs" example (find distinct ways to reach step `n` taking 1 or 2 steps at a time):

<div class="code-group">

```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

```javascript
function climbStairs(n) {
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
public int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

</div>

This demonstrates the bottom-up tabulation approach. The recurrence is `dp[i] = dp[i-1] + dp[i-2]`. Practice both this and a top-down recursive version with memoization.

## Recommended Practice Order

Build competency progressively. First, solve foundational problems: Fibonacci, Climbing Stairs, Coin Change. Next, tackle one-dimensional DP problems like House Robber. Then, move to two-dimensional DP for sequences: Longest Common Subsequence, Edit Distance. Finally, practice more complex problems like 0/1 Knapsack and Partition Equal Subset Sum. Always analyze time and space complexity. For each problem, attempt to solve it recursively first, then add memoization, and finally derive the iterative tabulation. This solidifies understanding of the state transitions and optimization.

[Practice Dynamic Programming at Atlassian](/company/atlassian/dynamic-programming)
