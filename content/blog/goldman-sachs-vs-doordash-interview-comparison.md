---
title: "Goldman Sachs vs DoorDash: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and DoorDash — difficulty levels, topic focus, and preparation strategy."
date: "2028-02-08"
category: "tips"
tags: ["goldman-sachs", "doordash", "comparison"]
---

When preparing for technical interviews, understanding company-specific patterns is crucial for efficient study. Goldman Sachs and DoorDash represent distinct ends of the financial technology and consumer delivery spectra, which is reflected in their technical interview approaches. While both assess core algorithmic competency, their question volume, difficulty distribution, and topical emphasis differ significantly, requiring tailored preparation strategies.

## Question Volume and Difficulty

The sheer volume of documented questions is the most striking difference. Goldman Sachs's pool is over three times larger, with approximately 270 questions compared to DoorDash's 87. This suggests that for Goldman Sachs, interviewers draw from a much broader set of problems, making it harder to predict what you might see. The difficulty distribution also varies:

- **Goldman Sachs (E51/M171/H48):** The majority of questions are tagged as Medium (171), with a substantial number of Easy (51) and Hard (48) problems. This indicates a strong focus on intermediate problem-solving, but candidates must be prepared for a wide range of challenges.
- **DoorDash (E6/M51/H30):** The distribution is heavily skewed toward Medium (51) and Hard (30) questions, with very few Easy (6). This points to a consistently higher bar for algorithmic complexity. DoorDash interviews are known to be rigorous, often involving multi-layered problems that combine algorithms with system design considerations, especially for senior roles.

In essence, Goldman Sachs tests breadth across difficulties, while DoorDash tests depth, primarily at the Medium-Hard level.

## Topic Overlap

Both companies heavily emphasize foundational data structures. **Array, String, and Hash Table** problems are critical for both. However, their secondary focuses diverge, revealing their operational priorities.

- **Goldman Sachs** places a significant emphasis on **Dynamic Programming (DP)**. This aligns with financial modeling and optimization problems common in quantitative finance and risk analysis. Expect problems involving maximization, minimization, and state transition.
  <div class="code-group">
  ```python
  # Example DP problem: Coin Change
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
  // Example DP problem: Coin Change
  function coinChange(coins, amount) {
      const dp = new Array(amount + 1).fill(Infinity);
      dp[0] = 0;
      for (let i = 1; i <= amount; i++) {
          for (const coin of coins) {
              if (i - coin >= 0) {
                  dp[i] = Math.min(dp[i], dp[i - coin] + 1);
              }
          }
      }
      return dp[amount] === Infinity ? -1 : dp[amount];
  }
  ```
  ```java
  // Example DP problem: Coin Change
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

- **DoorDash** frequently tests **Depth-First Search (DFS)** and related graph/tree traversal. This is central to problems involving geographical data, route optimization, menu hierarchies, or dependency resolution—core to delivery logistics and platform features.
  <div class="code-group">
  ```python
  # Example DFS problem: Number of Islands
  def numIslands(grid):
      def dfs(r, c):
          if not (0 <= r < len(grid) and 0 <= c < len(grid[0]) and grid[r][c] == '1'):
              return
          grid[r][c] = '0'  # Mark as visited
          for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
              dfs(r + dr, c + dc)

      count = 0
      for r in range(len(grid)):
          for c in range(len(grid[0])):
              if grid[r][c] == '1':
                  dfs(r, c)
                  count += 1
      return count

  ````
  ```javascript
  // Example DFS problem: Number of Islands
  function numIslands(grid) {
      function dfs(r, c) {
          if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] === '0') return;
          grid[r][c] = '0';
          dfs(r + 1, c);
          dfs(r - 1, c);
          dfs(r, c + 1);
          dfs(r, c - 1);
      }

      let count = 0;
      for (let r = 0; r < grid.length; r++) {
          for (let c = 0; c < grid[0].length; c++) {
              if (grid[r][c] === '1') {
                  dfs(r, c);
                  count++;
              }
          }
      }
      return count;
  }
  ````

  ```java
  // Example DFS problem: Number of Islands
  public int numIslands(char[][] grid) {
      int count = 0;
      for (int r = 0; r < grid.length; r++) {
          for (int c = 0; c < grid[0].length; c++) {
              if (grid[r][c] == '1') {
                  dfs(grid, r, c);
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

Prepare for **DoorDash first** if you are interviewing at both. The reason is foundational: DoorDash's focus on high-difficulty graph and tree problems requires deep, conceptual understanding and practice. Mastering DFS, BFS, and complex graph algorithms will build a robust problem-solving muscle that is transferable. Once you are comfortable solving DoorDash's Medium-Hard problems, tackling Goldman Sachs's broader set will feel more manageable, as you will have already conquered some of the hardest problem types. Your study for Goldman Sachs would then involve filling in the specific gaps, particularly through extensive Dynamic Programming practice and brushing up on a wider variety of Easy and Medium problems from their large pool.

Start with core data structures (Array, Hash Table, String), then drill deeply into graph theory and recursion for DoorDash. Subsequently, expand into Dynamic Programming and a wider range of problem patterns for Goldman Sachs.

For targeted practice, explore the question banks directly: [Goldman Sachs Questions](/company/goldman-sachs) | [DoorDash Questions](/company/doordash)
