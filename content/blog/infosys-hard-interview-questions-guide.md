---
title: "Hard Infosys Interview Questions: Strategy Guide"
description: "How to tackle 34 hard difficulty questions from Infosys — patterns, time targets, and practice tips."
date: "2032-03-14"
category: "tips"
tags: ["infosys", "hard", "interview prep"]
---

# Hard Infosys Interview Questions: Strategy Guide

Infosys categorizes 34 of its 158 coding problems as "Hard." What separates these from Medium and Easy questions isn't just raw algorithmic complexity—it's the combination of multiple concepts, nuanced constraints, and the need for careful implementation. While Easy problems test basic syntax and simple logic, and Medium problems validate your grasp of core algorithms, Hard problems at Infosys typically require you to orchestrate several techniques simultaneously. You might need dynamic programming with tricky state definitions, graph traversals with multiple conditions, or string manipulations that demand both efficiency and correctness under edge cases. The jump isn't just about knowing more algorithms; it's about applying them in less obvious, more integrated ways.

## Common Patterns and Templates

Infosys's Hard problems frequently involve **Dynamic Programming (DP) on sequences or grids**, **Graph algorithms with modifications**, and **Advanced string processing**. A recurring theme is the "state machine" DP pattern, where your DP array tracks not just a single value but multiple possible states or decisions. This is common in problems involving choices with restrictions, like "buy/sell stock with cooldown" variants or "maximum sum with no adjacent elements" with twists.

Here's a template for a classic 2D DP pattern that appears in several Infosys Hard problems—solving problems on sequences with an extra dimension for a "state" or "choice":

<div class="code-group">

```python
# Template: DP with state dimension (e.g., for problems with choices/restrictions)
# Problem type: Often used for "maximum profit with constraints" or "sequence with conditions"
# Time: O(n * k) where n is sequence length, k is number of states
# Space: O(n * k) for full DP table, often reducible to O(k)

def solve_with_state_dp(sequence):
    n = len(sequence)
    # Define number of states (e.g., 0=hold, 1=sold, 2=cooldown)
    k = 3
    # dp[i][s] = best value up to index i, ending in state s
    dp = [[0] * k for _ in range(n)]

    # Base cases for i=0
    dp[0][0] = -sequence[0]  # Example: buy on day 0
    dp[0][1] = 0
    dp[0][2] = 0

    for i in range(1, n):
        # State transitions based on problem rules
        dp[i][0] = max(dp[i-1][0], dp[i-1][2] - sequence[i])  # hold or buy after cooldown
        dp[i][1] = dp[i-1][0] + sequence[i]                   # sell from hold
        dp[i][2] = max(dp[i-1][1], dp[i-1][2])                # cooldown from sold or previous cooldown

    # Answer is usually max of states at last index
    return max(dp[-1])
```

```javascript
// Template: DP with state dimension
// Time: O(n * k) | Space: O(n * k) (often reducible to O(k))

function solveWithStateDP(sequence) {
  const n = sequence.length;
  const k = 3; // states: 0=hold, 1=sold, 2=cooldown
  const dp = Array.from({ length: n }, () => new Array(k).fill(0));

  // Base cases
  dp[0][0] = -sequence[0];
  dp[0][1] = 0;
  dp[0][2] = 0;

  for (let i = 1; i < n; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][2] - sequence[i]);
    dp[i][1] = dp[i - 1][0] + sequence[i];
    dp[i][2] = Math.max(dp[i - 1][1], dp[i - 1][2]);
  }

  return Math.max(...dp[n - 1]);
}
```

```java
// Template: DP with state dimension
// Time: O(n * k) | Space: O(n * k) (often reducible to O(k))

public int solveWithStateDP(int[] sequence) {
    int n = sequence.length;
    int k = 3; // states: 0=hold, 1=sold, 2=cooldown
    int[][] dp = new int[n][k];

    // Base cases
    dp[0][0] = -sequence[0];
    dp[0][1] = 0;
    dp[0][2] = 0;

    for (int i = 1; i < n; i++) {
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][2] - sequence[i]);
        dp[i][1] = dp[i-1][0] + sequence[i];
        dp[i][2] = Math.max(dp[i-1][1], dp[i-1][2]);
    }

    return Math.max(dp[n-1][0], Math.max(dp[n-1][1], dp[n-1][2]));
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Hard problem in a 45-60 minute Infosys interview, you should aim to produce a working, optimized solution within 25-30 minutes. This leaves time for discussion, edge cases, and follow-ups. Speed matters, but not at the expense of correctness—interviewers would rather see a slightly slower correct solution than a fast buggy one.

Beyond the answer, interviewers watch for:

1. **Systematic problem decomposition**: Can you break the Hard problem into manageable subproblems? Verbally outline your approach before coding.
2. **Edge case identification**: Hard problems often have subtle edge cases (empty inputs, large values, negative numbers). Mention these proactively.
3. **Code readability**: Use meaningful variable names, add brief comments for complex logic, and structure your code with helper functions if it clarifies intent.
4. **Space-time tradeoff awareness**: Can you explain why you chose a particular data structure or optimization? For example, "I'm using a min-heap here because we need repeated access to the smallest element, which gives us O(log n) operations."

## Upgrading from Medium to Hard

The leap from Medium to Hard requires three key shifts:

1. **Composition over single algorithms**: Medium problems often test one algorithm (e.g., BFS, binary search). Hard problems combine them—you might need Dijkstra's algorithm with a priority queue _and_ a visited set that tracks multiple states.
2. **State management**: Many Hard problems introduce an extra dimension of complexity—tracking whether you've used a coupon, how many transactions remain, or if you're in a particular mode. This is where DP with state machines or BFS with multi-state nodes becomes essential.
3. **Optimization constraints**: Medium problems often accept O(n²) solutions; Hard problems usually demand O(n log n) or better. You'll need to recognize when a greedy approach works or when you need advanced data structures (segment trees, union-find with ranks, monotonic stacks).

The mindset shift: treat each Hard problem as a _system design_ exercise for an algorithm. Instead of reaching for a standard template, ask: "What are the core subproblems? What information do I need to track at each step? What's the minimal state representation?"

## Specific Patterns for Hard

**Pattern 1: Modified Dijkstra's Algorithm**
Used in problems where you find shortest paths with an extra constraint (like limited fuel or tolls). Instead of a standard distance array, you maintain a 2D array `dist[node][k]` representing the shortest distance to `node` using exactly `k` "special moves" (like using a coupon). You then run Dijkstra on this state graph.

**Pattern 2: Interval DP on Strings**
Common in palindrome partitioning or scrambled string problems. You use a 3D DP array `dp[i][j][state]` where `i` and `j` are string indices, and `state` represents a condition (e.g., whether the substring is scrambled). The recurrence involves splitting the string at various points and checking conditions.

**Pattern 3: Binary Search on Answer**
When the problem asks for "minimum maximum" or "maximum minimum" (like "allocate minimum number of pages" or "split array largest sum"), you often can't directly compute the answer. Instead, binary search on the possible answer range, and for each mid value, write a greedy checker function to see if it's feasible. This turns an O(n!) brute force into O(n log m).

## Practice Strategy

Don't just solve Hard problems randomly. Follow this structured approach:

1. **Pattern-first learning**: Spend 2-3 days on each major pattern (DP with states, advanced graphs, interval DP). Solve 3-4 Infosys problems for that pattern.
2. **Daily mix**: Each day, solve 1 new Hard problem (45 minutes max), then review 1 previously solved Hard problem (15 minutes). Reviewing is crucial—you'll spot optimizations you missed.
3. **Order by frequency**: Start with DP problems (most common), then graphs, then strings. Within DP, begin with 1D/2D DP before tackling state machine DP.
4. **Simulate interviews**: Once a week, pick 2 Hard problems and solve them back-to-back with a 60-minute timer. Explain your reasoning out loud as you code.

Remember: The goal isn't to memorize solutions, but to recognize when a particular pattern applies and adapt it to new constraints.

[Practice Hard Infosys questions](/company/infosys/hard)
