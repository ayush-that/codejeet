---
title: "How to Solve Stone Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Stone Game. Medium difficulty, 72.8% acceptance rate. Topics: Array, Math, Dynamic Programming, Game Theory."
date: "2027-11-17"
category: "dsa-patterns"
tags: ["stone-game", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Stone Game

Alice and Bob play a game with piles of stones arranged in a row. There are an **even** number of piles, each with a **positive** integer number of stones. Players take turns picking stones from either the **leftmost** or **rightmost** remaining pile. The player with more stones at the end wins. Given that the total stones is **odd** (so there are no ties), determine if Alice (who goes first) can always win with optimal play.

What makes this problem interesting is that it appears to be a complex game theory problem requiring dynamic programming, but there's actually a clever mathematical insight that leads to an O(1) solution. However, interviewers often expect you to work through the DP approach first.

## Visual Walkthrough

Let's trace through a small example: `piles = [5, 3, 4, 5]`

**Gameplay:**

1. Alice's turn: She can choose left (5) or right (5). Let's say she chooses left (5).
   - Remaining: `[3, 4, 5]`
   - Alice: 5, Bob: 0

2. Bob's turn: He can choose left (3) or right (5). He'll choose right (5) to maximize his score.
   - Remaining: `[3, 4]`
   - Alice: 5, Bob: 5

3. Alice's turn: She can choose left (3) or right (4). She chooses right (4).
   - Remaining: `[3]`
   - Alice: 9, Bob: 5

4. Bob's turn: Only one pile left (3).
   - Alice: 9, Bob: 8

Alice wins 9-8. But could Bob have played better? Let's see if Alice always wins with optimal play.

The key insight: With an even number of piles and odd total, Alice can **always** win by choosing all piles at even indices or all piles at odd indices (whichever has more stones). In our example:

- Even indices (0, 2): 5 + 4 = 9
- Odd indices (1, 3): 3 + 5 = 8
  Alice can guarantee getting all even-indexed piles by mirroring Bob's moves.

## Brute Force Approach

A naive approach would be to simulate all possible game sequences using recursion. At each turn, the current player can take either the leftmost or rightmost pile, then the game continues with the remaining piles.

The brute force solution would have exponential time complexity O(2^n) where n is the number of piles. For n=20, this is over 1 million possibilities; for n=100, it's completely infeasible.

<div class="code-group">

```python
# Brute Force Recursive Solution (Exponential Time)
# Time: O(2^n) | Space: O(n) for recursion stack
def stoneGame_brute(piles):
    def helper(left, right):
        # Base case: no piles left
        if left > right:
            return 0

        # Alice's turn (maximize Alice's score)
        # She can take from left or right
        take_left = piles[left] - helper(left + 1, right)
        take_right = piles[right] - helper(left, right - 1)

        return max(take_left, take_right)

    # Positive result means Alice wins
    return helper(0, len(piles) - 1) > 0
```

```javascript
// Brute Force Recursive Solution (Exponential Time)
// Time: O(2^n) | Space: O(n) for recursion stack
function stoneGameBrute(piles) {
  const helper = (left, right) => {
    // Base case: no piles left
    if (left > right) return 0;

    // Alice's turn (maximize Alice's score)
    // She can take from left or right
    const takeLeft = piles[left] - helper(left + 1, right);
    const takeRight = piles[right] - helper(left, right - 1);

    return Math.max(takeLeft, takeRight);
  };

  // Positive result means Alice wins
  return helper(0, piles.length - 1) > 0;
}
```

```java
// Brute Force Recursive Solution (Exponential Time)
// Time: O(2^n) | Space: O(n) for recursion stack
public boolean stoneGameBrute(int[] piles) {
    return helper(piles, 0, piles.length - 1) > 0;
}

private int helper(int[] piles, int left, int right) {
    // Base case: no piles left
    if (left > right) return 0;

    // Alice's turn (maximize Alice's score)
    // She can take from left or right
    int takeLeft = piles[left] - helper(piles, left + 1, right);
    int takeRight = piles[right] - helper(piles, left, right - 1);

    return Math.max(takeLeft, takeRight);
}
```

</div>

This brute force solution is correct but too slow for larger inputs. We need to optimize it using memoization or dynamic programming.

## Optimized Approach

The key insight for optimization is that we're solving overlapping subproblems. When we calculate `helper(left, right)`, we might need to calculate the same `(left, right)` pair multiple times. We can use **dynamic programming** to store and reuse these results.

We define `dp[left][right]` as the maximum score difference (Alice's score minus Bob's score) that the current player can achieve when playing with piles from index `left` to `right`.

The recurrence relation:

- If it's Alice's turn: `dp[left][right] = max(piles[left] - dp[left+1][right], piles[right] - dp[left][right-1])`
- If it's Bob's turn: The formula is the same! Why? Because Bob is trying to maximize `(Bob's score - Alice's score)`, which is the negative of `(Alice's score - Bob's score)`. So from the perspective of score difference, both players are trying to maximize the same quantity.

We can fill the DP table diagonally, starting from smaller subarrays and building up to the full array.

## Optimal Solution

Here's the dynamic programming solution with O(n²) time and O(n²) space:

<div class="code-group">

```python
# Dynamic Programming Solution
# Time: O(n²) | Space: O(n²)
def stoneGame(piles):
    n = len(piles)

    # Create a 2D DP table where dp[i][j] represents the maximum score
    # difference (current player's score - opponent's score) for piles[i:j+1]
    dp = [[0] * n for _ in range(n)]

    # Base case: when there's only one pile, the current player takes it
    for i in range(n):
        dp[i][i] = piles[i]

    # Fill the DP table diagonally
    # We start with subarrays of length 2, then 3, up to n
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1

            # The current player can take either piles[i] or piles[j]
            # If they take piles[i], the opponent gets dp[i+1][j]
            # So the difference is piles[i] - dp[i+1][j]
            # Similarly for piles[j]: piles[j] - dp[i][j-1]
            dp[i][j] = max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1])

    # dp[0][n-1] > 0 means Alice (who starts) can get more stones than Bob
    return dp[0][n - 1] > 0
```

```javascript
// Dynamic Programming Solution
// Time: O(n²) | Space: O(n²)
function stoneGame(piles) {
  const n = piles.length;

  // Create a 2D DP table where dp[i][j] represents the maximum score
  // difference (current player's score - opponent's score) for piles[i:j+1]
  const dp = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Base case: when there's only one pile, the current player takes it
  for (let i = 0; i < n; i++) {
    dp[i][i] = piles[i];
  }

  // Fill the DP table diagonally
  // We start with subarrays of length 2, then 3, up to n
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;

      // The current player can take either piles[i] or piles[j]
      // If they take piles[i], the opponent gets dp[i+1][j]
      // So the difference is piles[i] - dp[i+1][j]
      // Similarly for piles[j]: piles[j] - dp[i][j-1]
      dp[i][j] = Math.max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1]);
    }
  }

  // dp[0][n-1] > 0 means Alice (who starts) can get more stones than Bob
  return dp[0][n - 1] > 0;
}
```

```java
// Dynamic Programming Solution
// Time: O(n²) | Space: O(n²)
public boolean stoneGame(int[] piles) {
    int n = piles.length;

    // Create a 2D DP table where dp[i][j] represents the maximum score
    // difference (current player's score - opponent's score) for piles[i:j+1]
    int[][] dp = new int[n][n];

    // Base case: when there's only one pile, the current player takes it
    for (int i = 0; i < n; i++) {
        dp[i][i] = piles[i];
    }

    // Fill the DP table diagonally
    // We start with subarrays of length 2, then 3, up to n
    for (int length = 2; length <= n; length++) {
        for (int i = 0; i <= n - length; i++) {
            int j = i + length - 1;

            // The current player can take either piles[i] or piles[j]
            // If they take piles[i], the opponent gets dp[i+1][j]
            // So the difference is piles[i] - dp[i+1][j]
            // Similarly for piles[j]: piles[j] - dp[i][j-1]
            dp[i][j] = Math.max(
                piles[i] - dp[i + 1][j],
                piles[j] - dp[i][j - 1]
            );
        }
    }

    // dp[0][n-1] > 0 means Alice (who starts) can get more stones than Bob
    return dp[0][n - 1] > 0;
}
```

</div>

## Mathematical Insight (O(1) Solution)

There's actually a clever O(1) solution! Since there are an even number of piles and the total is odd, Alice can always win. Here's why:

1. Number the piles from 0 to n-1 (n is even)
2. Piles at even indices: 0, 2, 4, ...
3. Piles at odd indices: 1, 3, 5, ...
4. Since n is even, these two groups have the same number of piles
5. The total stones is odd, so one group must have more stones than the other
6. Alice can always take all piles from the richer group by:
   - If she wants even-indexed piles: Always take from the same end as Bob
   - If she wants odd-indexed piles: Always take from the opposite end as Bob

This leads to the trivial solution:

<div class="code-group">

```python
# Mathematical Solution (O(1) time and space)
# Time: O(1) | Space: O(1)
def stoneGame_math(piles):
    # Alice can always win with optimal play
    return True
```

```javascript
// Mathematical Solution (O(1) time and space)
// Time: O(1) | Space: O(1)
function stoneGameMath(piles) {
  // Alice can always win with optimal play
  return true;
}
```

```java
// Mathematical Solution (O(1) time and space)
// Time: O(1) | Space: O(1)
public boolean stoneGameMath(int[] piles) {
    // Alice can always win with optimal play
    return true;
}
```

</div>

In an interview, you should mention this insight but still implement the DP solution unless instructed otherwise, as it demonstrates your problem-solving skills.

## Complexity Analysis

**Dynamic Programming Solution:**

- **Time Complexity:** O(n²) where n is the number of piles. We fill an n×n DP table, and each cell takes O(1) time to compute.
- **Space Complexity:** O(n²) for the DP table. We can optimize to O(n) by only storing two rows at a time, but the n² version is clearer.

**Mathematical Solution:**

- **Time Complexity:** O(1)
- **Space Complexity:** O(1)

## Common Mistakes

1. **Forgetting the game theory aspect:** Some candidates try to use a greedy approach (always take the larger of the two ends), but this doesn't guarantee optimal play. Bob can force Alice into a bad sequence.

2. **Incorrect DP state definition:** Defining `dp[i][j]` as the maximum stones Alice can get (instead of score difference) makes the recurrence more complex because you need to track whose turn it is.

3. **Wrong filling order:** The DP table must be filled diagonally (by subarray length), not row by row. Filling row by row would use values that haven't been computed yet.

4. **Missing the mathematical insight:** While the DP solution works, mentioning the O(1) solution shows deeper understanding. However, don't just return `True` without explanation—interviewers want to see your reasoning process.

## When You'll See This Pattern

This "optimal game play" pattern appears in several LeetCode problems:

1. **Predict the Winner (LeetCode 486):** Almost identical to Stone Game, but without the constraints that guarantee Alice always wins.

2. **Stone Game II (LeetCode 1140):** A variation where you can take 1 to 2M piles from the left, where M doubles when you take all available piles.

3. **Stone Game VII (LeetCode 1690):** Players remove the leftmost or rightmost stone, scoring the sum of the remaining stones.

The core technique is **minimax DP** where `dp[i][j]` represents the optimal outcome for the current player given the subarray `[i, j]`. Both players are assumed to play optimally, so we use the same recurrence for both.

## Key Takeaways

1. **Game theory problems often use minimax DP:** When both players play optimally, we can model the game with DP where each state represents the best outcome for the current player.

2. **Look for mathematical insights:** Constraints like "even number of piles" and "odd total" often hint at a mathematical solution. Always check if special properties simplify the problem.

3. **DP filling order matters:** For interval DP problems, fill the table by increasing interval length, not by rows/columns.

4. **Score difference simplifies the recurrence:** Tracking `(current player's score - opponent's score)` eliminates the need to track whose turn it is explicitly.

Related problems: [Stone Game V](/problem/stone-game-v), [Stone Game VI](/problem/stone-game-vi), [Stone Game VII](/problem/stone-game-vii)
