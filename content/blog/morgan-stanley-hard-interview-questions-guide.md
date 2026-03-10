---
title: "Hard Morgan Stanley Interview Questions: Strategy Guide"
description: "How to tackle 6 hard difficulty questions from Morgan Stanley — patterns, time targets, and practice tips."
date: "2032-09-16"
category: "tips"
tags: ["morgan-stanley", "hard", "interview prep"]
---

Hard questions at Morgan Stanley are a different beast from what you might encounter at pure tech companies. While the bank certainly asks challenging algorithmic problems, their "Hard" designation often reflects a combination of algorithmic complexity and real-world financial modeling. Out of their 53 tagged problems, only 6 are marked Hard, which tells you something: these aren't just tricky puzzles; they're problems that test your ability to reason about systems, optimize under constraints, and implement solutions that are both correct and robust. The jump from Medium to Hard here often involves a layer of financial intuition (like modeling transactions or schedules) on top of a core data structure challenge.

## Common Patterns and Templates

Morgan Stanley's Hard problems frequently involve **Dynamic Programming (DP) on sequences or intervals** and **Graph traversal with state**. You'll notice themes of maximizing profit, minimizing cost, or scheduling resources—direct reflections of financial operations. The most common pattern by far is a **DP approach where `dp[i][k]` represents the optimal outcome up to day `i` with `k` transactions remaining**. This template is the key to cracking their classic stock trading problems.

<div class="code-group">

```python
def maxProfit(prices, k):
    """
    Template for 'Best Time to Buy/Sell Stock with K Transactions' type problems.
    This is the foundation for several Morgan Stanley Hard questions.
    """
    n = len(prices)
    if n <= 1 or k == 0:
        return 0

    # If k is large enough, we can make unlimited transactions (greedy approach)
    if k >= n // 2:
        profit = 0
        for i in range(1, n):
            if prices[i] > prices[i-1]:
                profit += prices[i] - prices[i-1]
        return profit

    # DP table: dp[t][d] = max profit with at most t transactions up to day d
    # We use two rows to optimize space
    dp = [[0] * n for _ in range(k+1)]

    for t in range(1, k+1):
        max_prev = -prices[0]  # Track the best "buy" scenario from previous days
        for d in range(1, n):
            # Either do nothing today, or sell today (using best previous buy)
            dp[t][d] = max(dp[t][d-1], prices[d] + max_prev)
            # Update best previous buy for the next day
            # It's dp[t-1][d-1] - prices[d] because we're considering buying today
            # after completing t-1 transactions by day d-1
            max_prev = max(max_prev, dp[t-1][d-1] - prices[d])

    return dp[k][n-1]

# Time: O(k * n) where k = transactions, n = days
# Space: O(k * n), optimizable to O(n) with careful implementation
```

```javascript
function maxProfit(prices, k) {
  const n = prices.length;
  if (n <= 1 || k === 0) return 0;

  // Unlimited transactions case (greedy)
  if (k >= n / 2) {
    let profit = 0;
    for (let i = 1; i < n; i++) {
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
      }
    }
    return profit;
  }

  // DP table
  const dp = Array.from({ length: k + 1 }, () => new Array(n).fill(0));

  for (let t = 1; t <= k; t++) {
    let maxPrev = -prices[0];
    for (let d = 1; d < n; d++) {
      dp[t][d] = Math.max(dp[t][d - 1], prices[d] + maxPrev);
      maxPrev = Math.max(maxPrev, dp[t - 1][d - 1] - prices[d]);
    }
  }

  return dp[k][n - 1];
}

// Time: O(k * n) | Space: O(k * n)
```

```java
public int maxProfit(int[] prices, int k) {
    int n = prices.length;
    if (n <= 1 || k == 0) return 0;

    // Unlimited transactions case
    if (k >= n / 2) {
        int profit = 0;
        for (int i = 1; i < n; i++) {
            if (prices[i] > prices[i-1]) {
                profit += prices[i] - prices[i-1];
            }
        }
        return profit;
    }

    // DP table
    int[][] dp = new int[k+1][n];

    for (int t = 1; t <= k; t++) {
        int maxPrev = -prices[0];
        for (int d = 1; d < n; d++) {
            dp[t][d] = Math.max(dp[t][d-1], prices[d] + maxPrev);
            maxPrev = Math.max(maxPrev, dp[t-1][d-1] - prices[d]);
        }
    }

    return dp[k][n-1];
}

// Time: O(k * n) | Space: O(k * n)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Hard problem at Morgan Stanley, you have 30-35 minutes to: understand the problem, discuss your approach, implement it, and test it. That means you need to recognize the pattern within 5-7 minutes. Interviewers here are particularly attentive to:

- **Financial intuition**: Can you explain why your algorithm models the trading scenario correctly?
- **Edge case handling**: Zero prices, single day, k=0, k extremely large. Mention these proactively.
- **Space optimization**: They'll often ask "can we do better?" after your initial solution. Be ready to optimize the DP table from O(kn) to O(n) or O(k).
- **Code readability**: Use meaningful variable names (`transactions` not `t`, `day` not `d`) in the actual interview, even if shorthand is fine in practice.

## Upgrading from Medium to Hard

The leap isn't about learning entirely new data structures—it's about **combining them in non-obvious ways** and **managing multiple states**. Medium problems might ask "find the maximum profit with one transaction" (simple scan). Hard problems ask "find maximum profit with k transactions and a cooldown period" (DP with three states: hold, sold, cooldown). New techniques required:

1. **State machine DP**: Modeling problems as transitions between states (like buy, sell, cooldown).
2. **DP dimension expansion**: Adding dimensions for transactions, cooldown days, or holding status.
3. **Graphs with modified BFS/DFS**: Searching with additional constraints (like "minimum steps while avoiding certain patterns").

The mindset shift: you're no longer just finding _an_ algorithm; you're designing a _correct computational model_ of a financial scenario.

## Specific Patterns for Hard

**Pattern 1: DP with State Machine**  
Used in problems like "Best Time to Buy/Sell Stock with Cooldown" (LeetCode #309). You maintain separate DP arrays for each state.

```python
def maxProfitWithCooldown(prices):
    hold, sold, cooldown = -float('inf'), 0, 0
    for price in prices:
        prev_hold, prev_sold, prev_cooldown = hold, sold, cooldown
        hold = max(prev_hold, prev_cooldown - price)  # Buy or keep holding
        sold = prev_hold + price                      # Sell today
        cooldown = max(prev_cooldown, prev_sold)      # Do nothing (after sell)
    return max(sold, cooldown)
# Time: O(n) | Space: O(1)
```

**Pattern 2: Modified BFS with Constraints**  
Used in problems like "Shortest Path in a Grid with Obstacles Elimination" (LeetCode #1293). You add a dimension to visited states to track remaining elimination capacity.

```python
def shortestPath(grid, k):
    from collections import deque
    m, n = len(grid), len(grid[0])
    # visited[row][col][remaining_eliminations]
    visited = [[[False] * (k+1) for _ in range(n)] for _ in range(m)]
    queue = deque([(0, 0, k, 0)])  # (r, c, remaining_k, steps)

    while queue:
        r, c, remaining, steps = queue.popleft()
        if r == m-1 and c == n-1:
            return steps
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < m and 0 <= nc < n:
                new_remaining = remaining - grid[nr][nc]
                if new_remaining >= 0 and not visited[nr][nc][new_remaining]:
                    visited[nr][nc][new_remaining] = True
                    queue.append((nr, nc, new_remaining, steps+1))
    return -1
# Time: O(m * n * k) | Space: O(m * n * k)
```

## Practice Strategy

Don't just solve all 6 Hard problems once. Use this 2-week plan:

- **Days 1-3**: Study the DP with transactions template above. Implement it from memory 3 times.
- **Days 4-7**: Solve 2 Hard problems (like "Best Time to Buy/Sell Stock IV" #188 and "Best Time to Buy/Sell Stock with Cooldown" #309). For each, write out the state transitions on paper before coding.
- **Days 8-10**: Solve the remaining 4 Hard problems, but with a 30-minute timer. Record yourself explaining your approach.
- **Days 11-14**: Re-solve all 6 problems, focusing on space optimization and edge cases. Time yourself to complete in under 25 minutes.

Remember: at Morgan Stanley, "Hard" means "business-critical modeling hard," not just "algorithmically hard." Your ability to translate financial constraints into clean code is what they're really assessing.

[Practice Hard Morgan Stanley questions](/company/morgan-stanley/hard)
