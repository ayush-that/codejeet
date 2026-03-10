---
title: "Dynamic Programming Questions at Capgemini: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-04-22"
category: "dsa-patterns"
tags: ["capgemini", "dynamic-programming", "interview prep"]
---

## Why Dynamic Programming Matters at Capgemini

Let's start with a reality check: Capgemini's technical interviews are not primarily algorithm-heavy like FAANG companies. With only 3 Dynamic Programming (DP) questions out of 36 total in their question bank, DP represents about 8% of their technical assessment scope. However, this small percentage is deceptive in its importance. In my experience conducting mock interviews with Capgemini candidates, DP questions serve as a key differentiator for mid-to-senior roles. They're not asking you to solve obscure research problems; they're testing whether you can recognize optimization patterns in business logic—something Capgemini deals with daily in enterprise consulting.

The 3 DP questions exist precisely because Capgemini wants to filter for engineers who think beyond brute force. When you're designing a supply chain optimization system or a financial transaction processor, the difference between O(2ⁿ) and O(n²) isn't academic—it's the difference between a system that scales and one that fails at enterprise volumes. They use DP questions to assess your ability to identify overlapping subproblems and optimal substructure in real-world business scenarios.

## Specific Patterns Capgemini Favors

Capgemini's DP questions consistently follow two patterns: **1D linear DP** and **unbounded knapsack variations**. They avoid complex 2D matrix DP or tree/graph DP that require advanced data structure knowledge. Their questions map directly to business scenarios: resource allocation (knapsack), sequence decisions (linear DP), and cost optimization.

The most common pattern is the **unbounded knapsack**—think "Coin Change" (LeetCode #322) or "Perfect Squares" (LeetCode #279). These model scenarios like "minimum resources to achieve a target" or "optimal combination of services." The second pattern is **1D linear DP with simple recurrence**—similar to "Climbing Stairs" (LeetCode #70) or "House Robber" (LeetCode #198), which model sequential decision-making.

Here's the unbounded knapsack pattern they love:

<div class="code-group">

```python
# Unbounded Knapsack Pattern - Coin Change (LeetCode #322)
# Time: O(amount * n) | Space: O(amount)
def coinChange(coins, amount):
    # dp[i] = min coins to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                # Key insight: dp[i] = min(dp[i], 1 + dp[i - coin])
                dp[i] = min(dp[i], 1 + dp[i - coin])

    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Unbounded Knapsack Pattern - Coin Change (LeetCode #322)
// Time: O(amount * n) | Space: O(amount)
function coinChange(coins, amount) {
  // dp[i] = min coins to make amount i
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case: 0 coins for amount 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        // Key insight: dp[i] = Math.min(dp[i], 1 + dp[i - coin])
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }

  return dp[amount] !== Infinity ? dp[amount] : -1;
}
```

```java
// Unbounded Knapsack Pattern - Coin Change (LeetCode #322)
// Time: O(amount * n) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    // dp[i] = min coins to make amount i
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // Use amount+1 as "infinity"
    dp[0] = 0;  // Base case: 0 coins for amount 0

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                // Key insight: dp[i] = Math.min(dp[i], 1 + dp[i - coin])
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

## How to Prepare

Master the **three-step DP framework** that Capgemini interviewers explicitly look for:

1. **Define the DP state** clearly (e.g., "dp[i] represents the minimum cost to reach step i")
2. **Establish the recurrence relation** (the formula connecting states)
3. **Identify base cases** (where the recursion stops)

Practice explaining this framework while solving problems. Capgemini cares about your thought process as much as the solution. When you encounter a problem, ask: "Can this be broken into overlapping subproblems? Does it have optimal substructure?"

For the 1D linear DP pattern, here's the template they expect:

<div class="code-group">

```python
# 1D Linear DP Pattern - Climbing Stairs (LeetCode #70)
# Time: O(n) | Space: O(n) [can be optimized to O(1)]
def climbStairs(n):
    if n <= 2:
        return n

    # dp[i] = ways to reach step i
    dp = [0] * (n + 1)
    dp[1] = 1  # Base case: 1 way to reach step 1
    dp[2] = 2  # Base case: 2 ways to reach step 2

    # Recurrence: ways to reach step i = ways to reach (i-1) + ways to reach (i-2)
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]

# Space-optimized version (preferred in interviews)
# Time: O(n) | Space: O(1)
def climbStairsOptimized(n):
    if n <= 2:
        return n

    prev1, prev2 = 2, 1  # dp[i-1], dp[i-2]
    for _ in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current

    return prev1
```

```javascript
// 1D Linear DP Pattern - Climbing Stairs (LeetCode #70)
// Time: O(n) | Space: O(n) [can be optimized to O(1)]
function climbStairs(n) {
  if (n <= 2) return n;

  // dp[i] = ways to reach step i
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1; // Base case: 1 way to reach step 1
  dp[2] = 2; // Base case: 2 ways to reach step 2

  // Recurrence: ways to reach step i = ways to reach (i-1) + ways to reach (i-2)
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// Space-optimized version (preferred in interviews)
// Time: O(n) | Space: O(1)
function climbStairsOptimized(n) {
  if (n <= 2) return n;

  let prev1 = 2,
    prev2 = 1; // dp[i-1], dp[i-2]
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

```java
// 1D Linear DP Pattern - Climbing Stairs (LeetCode #70)
// Time: O(n) | Space: O(n) [can be optimized to O(1)]
public int climbStairs(int n) {
    if (n <= 2) return n;

    // dp[i] = ways to reach step i
    int[] dp = new int[n + 1];
    dp[1] = 1;  // Base case: 1 way to reach step 1
    dp[2] = 2;  // Base case: 2 ways to reach step 2

    // Recurrence: ways to reach step i = ways to reach (i-1) + ways to reach (i-2)
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

// Space-optimized version (preferred in interviews)
// Time: O(n) | Space: O(1)
public int climbStairsOptimized(int n) {
    if (n <= 2) return n;

    int prev1 = 2, prev2 = 1;  // dp[i-1], dp[i-2]
    for (int i = 3; i <= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}
```

</div>

## How Capgemini Tests Dynamic Programming vs Other Companies

Capgemini's DP questions differ from FAANG in three key ways:

1. **Business context framing**: While Google might ask "unique paths in a grid," Capgemini frames it as "optimizing delivery routes in a warehouse grid." The underlying pattern is the same, but they want to see you translate business requirements to DP states.

2. **Reduced difficulty ceiling**: Capgemini's DP questions rarely exceed medium difficulty on LeetCode. You won't see "Regular Expression Matching" (#10) or "Burst Balloons" (#312). Their hardest is typically "Coin Change" (#322) level.

3. **Emphasis on explanation over optimization**: At Amazon, they might demand the O(1) space solution. At Capgemini, a clear O(n) space solution with perfect explanation beats an optimized but poorly explained O(1) solution. They're assessing communication for client-facing roles.

4. **No memoization-heavy recursion**: They prefer bottom-up iterative DP because it's easier to explain to non-technical stakeholders. Top-down with memoization is acceptable but less common.

## Study Order

Follow this progression to build DP intuition systematically:

1. **Fibonacci sequence variations** - Understand the simplest overlapping subproblems. Practice both recursive (with memoization) and iterative approaches.
2. **1D linear DP** - Master "Climbing Stairs" (#70), "House Robber" (#198), and "Min Cost Climbing Stairs" (#746). These teach state definition and recurrence.

3. **Unbounded knapsack** - Learn "Coin Change" (#322) and "Perfect Squares" (#279). This is Capgemini's favorite pattern for resource optimization problems.

4. **0/1 knapsack** - Study "Partition Equal Subset Sum" (#416) to understand the classic DP decision pattern. Capgemini occasionally uses simplified versions.

5. **2D grid DP (basic only)** - Practice "Unique Paths" (#62) and "Minimum Path Sum" (#64). These occasionally appear framed as business optimization grids.

Skip: tree DP, graph DP, interval DP, or DP with bitmasking. These don't appear in Capgemini's question bank.

## Recommended Practice Order

Solve these in sequence:

1. Climbing Stairs (#70) - Master the foundation
2. Min Cost Climbing Stairs (#746) - Add cost optimization
3. House Robber (#198) - Introduce decision-making
4. Coin Change (#322) - Learn unbounded knapsack (Capgemini favorite)
5. Perfect Squares (#279) - Apply unbounded knapsack pattern
6. Partition Equal Subset Sum (#416) - Learn 0/1 knapsack
7. Unique Paths (#62) - Basic 2D DP
8. Minimum Path Sum (#64) - 2D DP with optimization

After these 8 problems, you'll have covered every DP pattern Capgemini tests. Focus on explaining your solution clearly, defining states precisely, and connecting the pattern to business scenarios.

[Practice Dynamic Programming at Capgemini](/company/capgemini/dynamic-programming)
