---
title: "Dynamic Programming Questions at Goldman Sachs: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-07-27"
category: "dsa-patterns"
tags: ["goldman-sachs", "dynamic-programming", "interview prep"]
---

If you're preparing for Goldman Sachs interviews, you've likely seen the daunting statistic: they have **56 Dynamic Programming (DP) questions** in their tagged LeetCode list. That's over 20% of their total problem set. While this doesn't mean every interview will be a DP gauntlet, it signals a clear, non-negotiable truth: **Goldman Sachs treats Dynamic Programming as a core, first-class topic for assessing algorithmic problem-solving.** In my experience and from debriefing with candidates, DP questions appear frequently in the technical phone screens and onsite rounds, especially for roles involving quantitative strategies, risk analysis, and core software engineering. They use it as a high-signal filter—a candidate who can't reason about optimal substructure and overlapping subproblems often struggles with the complex, stateful systems the bank builds.

The key insight is _why_. It's not about academic puzzle-solving. Financial systems—from real-time risk engines to trading algorithms—are fundamentally built on optimizing decisions over time with constraints (capital, risk, regulations). DP is the mathematical framework for this. An interviewer is testing if you can model a messy real-world problem (e.g., "maximize profit given transaction fees and cooldown periods") into a clean, efficient computational solution.

## Specific Patterns Goldman Sachs Favors

Goldman Sachs DP questions have a distinct flavor. They heavily favor **iterative, bottom-up tabulation** over recursive memoization. This isn't an accident. Iterative DP maps directly to the kind of deterministic, sequential processing required in high-performance financial systems. You'll rarely see esoteric graph theory DP here. Instead, focus on these three high-probability categories:

1.  **Classic 1D/2D Sequence & State Problems:** These are workhorses. Think "Best Time to Buy and Sell Stock" variations (with transaction fees, cooldowns) or string/sequence alignment problems. They often involve managing a small number of states (e.g., `hold`, `sold`, `cooldown`).
2.  **Knapsack & Bounded Resource Problems:** This is pure finance. "Given a capital allocation (weight), a set of investments with projected returns (values) and risk weights (costs), maximize return." The classic 0/1 Knapsack and Unbounded Knapsack patterns are essential.
3.  **Pathfinding on a Grid:** Not general graph traversal, but specifically moving through a 2D grid (like a trading matrix or a risk surface) with constraints, often minimizing cost or maximizing score. This tests your ability to handle 2D DP and spatial state transitions.

For example, **Best Time to Buy and Sell Stock with Cooldown (LeetCode #309)** is a quintessential GS problem. It's a 1D sequence problem requiring you to manage three states. **Coin Change (LeetCode #322)** and **Coin Change 2 (LeetCode #518)** are pure unbounded knapsack problems. **Minimum Path Sum (LeetCode #64)** is their go-to 2D grid pathfinding problem.

Let's look at the state machine DP for the "with cooldown" stock problem. The key is defining the states clearly.

<div class="code-group">

```python
def maxProfit(prices):
    """
    State Machine DP.
    hold: max profit if I'm holding a stock on day i.
    sold: max profit if I sold a stock on day i.
    rest: max profit if I'm in cooldown/resting on day i.
    """
    if not prices:
        return 0

    # Initialize DP arrays for the three states
    hold = [0] * len(prices)
    sold = [0] * len(prices)
    rest = [0] * len(prices)

    # Base cases: Day 0
    hold[0] = -prices[0]  # Buy on day 0
    sold[0] = 0           # Can't sell on day 0
    rest[0] = 0           # Do nothing on day 0

    for i in range(1, len(prices)):
        # To be in 'hold' on day i: either held from i-1, or bought today from 'rest' state.
        hold[i] = max(hold[i-1], rest[i-1] - prices[i])
        # To be in 'sold' on day i: must sell the stock held on day i-1.
        sold[i] = hold[i-1] + prices[i]
        # To be in 'rest' on day i: either rested from i-1, or just finished cooldown from 'sold' at i-1.
        rest[i] = max(rest[i-1], sold[i-1])

    # The final answer is max of sold or rest (you never end with holding a stock).
    return max(sold[-1], rest[-1])

# Time: O(n) | Space: O(n) (can be optimized to O(1))
```

```javascript
function maxProfit(prices) {
  if (!prices.length) return 0;

  let hold = new Array(prices.length).fill(0);
  let sold = new Array(prices.length).fill(0);
  let rest = new Array(prices.length).fill(0);

  hold[0] = -prices[0];
  sold[0] = 0;
  rest[0] = 0;

  for (let i = 1; i < prices.length; i++) {
    hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
    sold[i] = hold[i - 1] + prices[i];
    rest[i] = Math.max(rest[i - 1], sold[i - 1]);
  }

  return Math.max(sold[prices.length - 1], rest[prices.length - 1]);
}
// Time: O(n) | Space: O(n)
```

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;

    int n = prices.length;
    int[] hold = new int[n];
    int[] sold = new int[n];
    int[] rest = new int[n];

    hold[0] = -prices[0];
    sold[0] = 0;
    rest[0] = 0;

    for (int i = 1; i < n; i++) {
        hold[i] = Math.max(hold[i-1], rest[i-1] - prices[i]);
        sold[i] = hold[i-1] + prices[i];
        rest[i] = Math.max(rest[i-1], sold[i-1]);
    }

    return Math.max(sold[n-1], rest[n-1]);
}
// Time: O(n) | Space: O(n)
```

</div>

## How to Prepare

Your study must be pattern-first, not problem-first. Memorizing 56 solutions is impossible; internalizing 5-6 patterns is achievable.

1.  **Master the Iterative Template:** For any new DP problem, immediately ask: "What is the smallest subproblem? What is my `dp` array? What does `dp[i]` represent?" Practice writing the nested for-loops for tabulation.
2.  **Draw the State Transition Diagram:** For problems like the stock example, sketching the states (nodes) and allowed transitions (edges) is the fastest way to derive the recurrence relation. This visual step is what interviewers want to see on the whiteboard.
3.  **Practice Space Optimization:** Goldman Sachs interviewers often follow up with, "Can we do this in O(1) space?" For 1D DP, this usually means keeping only the previous one or two values. Know how to collapse a `dp` array into a few variables.

Let's see the space-optimized version of the classic **0/1 Knapsack** DP, a pattern behind many resource allocation problems.

<div class="code-group">

```python
def knapsack(weights, values, capacity):
    """
    Classic 0/1 Knapsack. Space-optimized to use only 1D dp array.
    dp[w] = max value achievable with total weight exactly w.
    We iterate items first, then iterate capacity backwards to avoid re-using an item.
    """
    dp = [0] * (capacity + 1)

    for i in range(len(weights)):
        # Iterate backwards to ensure each item is used at most once
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]

# Time: O(n * capacity) | Space: O(capacity)
```

```javascript
function knapsack(weights, values, capacity) {
  let dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }

  return dp[capacity];
}
// Time: O(n * capacity) | Space: O(capacity)
```

```java
public int knapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];

    for (int i = 0; i < weights.length; i++) {
        for (int w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }

    return dp[capacity];
}
// Time: O(n * capacity) | Space: O(capacity)
```

</div>

## How Goldman Sachs Tests Dynamic Programming vs Other Companies

At a company like Google or Meta, a DP problem might be one part of a broader system design discussion or embedded in a graph context. At Goldman Sachs, the DP question _is often the main event_. The difficulty is high—typically LeetCode Medium to Hard—but the scope is focused. They want to see:

- **Financial Intuition:** Can you map the problem statement to a financial concept (optimization, cost minimization, sequence of decisions)?
- **Flawless Implementation:** Code must be clean, edge-case handled, and space-optimized. They have less tolerance for "almost correct" recursive solutions than a pure tech company might.
- **Step-by-Step Derivation:** They highly value the process. Talk through defining states, the recurrence, base cases, and the iteration order. A silent coder who jumps to code will struggle.

## Study Order

Don't dive into the tagged list randomly. Build your foundation in this order:

1.  **Foundation: 1D Linear DP.** Start with the simplest patterns: Fibonacci, Climbing Stairs (#70), House Robber (#198). This teaches you the core concept of a recurrence relation and building a `dp` array.
2.  **2D Grid Pathfinding.** Move to Minimum Path Sum (#64) and Unique Paths (#62). This solidifies handling 2D state and spatial transitions.
3.  **Classic Knapsack.** Learn 0/1 Knapsack and Unbounded Knapsack (Coin Change #322). This is the most directly applicable pattern to finance.
4.  **State Machine DP.** Tackle the "Buy/Sell Stock" series, especially with cooldown (#309) and transaction fee (#714). This teaches you to manage multiple concurrent states.
5.  **String/Sequence DP.** Finally, study Longest Common Subsequence (#1143) and Edit Distance (#72). These are complex but test if you can handle 2D DP on sequences, a pattern that sometimes appears.

## Recommended Practice Order

Solve these specific Goldman Sachs-tagged problems in sequence:

1.  **Climbing Stairs (#70)** - Warm-up for 1D DP.
2.  **Minimum Path Sum (#64)** - Introduction to 2D DP.
3.  **Coin Change (#322)** - Unbounded Knapsack.
4.  **Best Time to Buy and Sell Stock with Cooldown (#309)** - State Machine DP.
5.  **Longest Increasing Subsequence (#300)** - A different 1D DP pattern (patience sorting variant).
6.  **Partition Equal Subset Sum (#416)** - Disguised 0/1 Knapsack.
7.  **Edit Distance (#72)** - Challenging 2D sequence DP.

This progression builds complexity logically, ensuring each new problem reinforces a prior pattern while adding one new twist—exactly how Goldman Sachs interviewers construct their questions.

[Practice Dynamic Programming at Goldman Sachs](/company/goldman-sachs/dynamic-programming)
