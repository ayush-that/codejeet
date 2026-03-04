---
title: "Goldman Sachs vs Snowflake: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Snowflake — difficulty levels, topic focus, and preparation strategy."
date: "2028-01-31"
category: "tips"
tags: ["goldman-sachs", "snowflake", "comparison"]
---

When preparing for technical interviews at Goldman Sachs and Snowflake, you're targeting two distinct industry leaders: a global investment bank and a modern cloud data platform. While both assess core algorithmic problem-solving, their interview styles, question volume, and emphasis reflect their different engineering cultures. A strategic preparation plan requires understanding these differences to allocate your study time effectively.

## Question Volume and Difficulty

Goldman Sachs presents a significantly larger and more challenging problem set. With 270 cataloged questions (48 Hard), its interview process is known for breadth and depth, particularly in quantitative and systems-focused roles. The high volume suggests you may encounter a wider variety of problem patterns, and the substantial Hard count indicates they test for advanced optimization and edge-case handling. Expect multi-part questions that blend algorithms with financial or systems logic.

Snowflake's catalog is more focused, with 104 questions (26 Hard). The lower volume doesn't imply simplicity but rather a more targeted approach. As a company built on complex data processing, their questions often test deep understanding of data structures, recursion, and efficient traversal. The difficulty distribution suggests a strong emphasis on solid Medium-level problem-solving, with Hard questions likely probing sophisticated tree/graph manipulations or concurrency concepts relevant to distributed systems.

## Topic Overlap

Both companies heavily test **Array**, **String**, and **Hash Table** fundamentals. Mastering these is non-negotiable.

**Goldman Sachs** adds a major emphasis on **Dynamic Programming (DP)**. This aligns with their work in optimization, risk analysis, and quantitative finance. You must be proficient in classic DP patterns (knapsack, longest common subsequence, etc.) and matrix traversal.

<div class="code-group">

```python
# Example DP: Coin Change
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Example DP: Coin Change
function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```java
// Example DP: Coin Change
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

**Snowflake** prominently features **Depth-First Search (DFS)**, reflecting its core work with hierarchical and graph-like data (e.g., JSON, query execution plans). Expect tree and graph traversal problems, often requiring recursive or iterative stack-based solutions.

<div class="code-group">

```python
# Example DFS: Number of Islands
def numIslands(grid):
    def dfs(r, c):
        if not (0 <= r < len(grid) and 0 <= c < len(grid[0]) and grid[r][c] == '1'):
            return
        grid[r][c] = '0'
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            dfs(r + dr, c + dc)

    count = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                dfs(i, j)
                count += 1
    return count
```

```javascript
// Example DFS: Number of Islands
function numIslands(grid) {
  function dfs(r, c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] === "0") return;
    grid[r][c] = "0";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "1") {
        dfs(i, j);
        count++;
      }
    }
  }
  return count;
}
```

```java
// Example DFS: Number of Islands
public int numIslands(char[][] grid) {
    int count = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1') {
                dfs(grid, i, j);
                count++;
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
```

</div>

## Which to Prepare for First

Prepare for **Goldman Sachs first** if you are early in your interview cycle. Its broader question catalog and emphasis on DP will force you to build a more comprehensive algorithmic foundation. Mastering the 270-question set, particularly the Hard DP problems, will inherently cover the core Array, String, and Hash Table skills needed for Snowflake. This approach builds maximum versatility.

Prepare for **Snowflake first** only if you have an imminent interview or are already strong in DP but weaker in graph/tree traversal. Their focused list allows for deep, concentrated practice on DFS and related recursive patterns. However, this path is riskier if you later pivot to Goldman Sachs, as you may lack the DP depth required.

In practice, start with the shared fundamentals, then drill into Goldman's DP problems. Once comfortable, transition to Snowflake's DFS and graph-focused questions. This sequence ensures you build the wider skill set first, then specialize.

For targeted practice, visit the company pages: [Goldman Sachs](/company/goldman-sachs) and [Snowflake](/company/snowflake).
