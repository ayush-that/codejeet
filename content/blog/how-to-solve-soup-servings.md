---
title: "How to Solve Soup Servings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Soup Servings. Medium difficulty, 59.7% acceptance rate. Topics: Math, Dynamic Programming, Probability and Statistics."
date: "2026-09-12"
category: "dsa-patterns"
tags: ["soup-servings", "math", "dynamic-programming", "probability-and-statistics", "medium"]
---

# How to Solve Soup Servings

This problem presents a probability calculation disguised as a dynamic programming problem. You have two soups, A and B, each starting with `n` mL. On each turn, you randomly choose one of four serving operations (each with 25% probability) that pour different amounts from each soup. The question asks: **What's the probability that soup A empties first, plus half the probability that both empty simultaneously?**

What makes this problem tricky is that `n` can be up to 10⁹, making direct simulation impossible. The key insight is that as `n` grows, the probability approaches 1, allowing us to cap large inputs.

## Visual Walkthrough

Let's trace through a small example with `n = 50` mL. Remember: we're calculating P(A empties first) + 0.5 × P(both empty simultaneously).

**Step 1: Understanding the operations**
Four operations (each probability 0.25):

1. (100, 0) → A loses 100mL, B loses 0mL
2. (75, 25) → A loses 75mL, B loses 25mL
3. (50, 50) → Both lose 50mL
4. (25, 75) → A loses 25mL, B loses 75mL

**Step 2: Base cases**

- If A ≤ 0 and B ≤ 0: Both empty simultaneously → return 0.5
- If A ≤ 0 only: A empties first → return 1
- If B ≤ 0 only: B empties first → return 0

**Step 3: Tracing n = 50**
We start with (50, 50). Each operation reduces both soups:

- Operation 1: (50-100, 50-0) = (-50, 50) → A empty first → contributes 1
- Operation 2: (50-75, 50-25) = (-25, 25) → A empty first → contributes 1
- Operation 3: (50-50, 50-50) = (0, 0) → both empty → contributes 0.5
- Operation 4: (50-25, 50-75) = (25, -25) → B empty first → contributes 0

Probability = 0.25 × (1 + 1 + 0.5 + 0) = 0.25 × 2.5 = 0.625

This matches the recursive calculation we'll implement.

## Brute Force Approach

A naive recursive solution would explore all possible sequences of operations until one or both soups are empty:

<div class="code-group">

```python
# Time: O(4^n) | Space: O(n) for recursion stack
def soupServings(n):
    def dfs(a, b):
        if a <= 0 and b <= 0:
            return 0.5  # Both empty simultaneously
        if a <= 0:
            return 1.0  # A empty first
        if b <= 0:
            return 0.0  # B empty first

        # Recursively try all 4 operations with equal probability
        return 0.25 * (dfs(a-100, b) +
                      dfs(a-75, b-25) +
                      dfs(a-50, b-50) +
                      dfs(a-25, b-75))

    return dfs(n, n)
```

```javascript
// Time: O(4^n) | Space: O(n) for recursion stack
function soupServings(n) {
  function dfs(a, b) {
    if (a <= 0 && b <= 0) return 0.5; // Both empty simultaneously
    if (a <= 0) return 1.0; // A empty first
    if (b <= 0) return 0.0; // B empty first

    // Recursively try all 4 operations with equal probability
    return (
      0.25 * (dfs(a - 100, b) + dfs(a - 75, b - 25) + dfs(a - 50, b - 50) + dfs(a - 25, b - 75))
    );
  }

  return dfs(n, n);
}
```

```java
// Time: O(4^n) | Space: O(n) for recursion stack
public double soupServings(int n) {
    return dfs(n, n);
}

private double dfs(int a, int b) {
    if (a <= 0 && b <= 0) return 0.5;  // Both empty simultaneously
    if (a <= 0) return 1.0;  // A empty first
    if (b <= 0) return 0.0;  // B empty first

    // Recursively try all 4 operations with equal probability
    return 0.25 * (dfs(a-100, b) +
                  dfs(a-75, b-25) +
                  dfs(a-50, b-50) +
                  dfs(a-25, b-75));
}
```

</div>

**Why this fails:**
The time complexity is O(4ⁿ) because each state branches into 4 new states. For n = 10⁹, this is astronomically large. Even for moderate n like 500, this approach is infeasible.

## Optimized Approach

The key insights for optimization:

1. **Dynamic Programming with Memoization**: Instead of recalculating states, store results in a memo table. Since operations reduce soup amounts by multiples of 25, we can work in units of 25mL to reduce state space.

2. **Mathematical Observation**: As n increases, the probability approaches 1. This happens because operations tend to remove more from A than B on average. We can cap large n at a threshold where probability is effectively 1 (within 10⁻⁶ error).

3. **State Reduction**: Instead of tracking exact mL, track in units of 25mL. If n % 25 ≠ 0, round up to handle partial servings.

**Step-by-step reasoning:**

1. Convert n to servings of 25mL: `m = ceil(n / 25)`
2. If m ≥ 200, probability > 0.999999, so return 1.0
3. Use DP[m+1][m+1] where dp[i][j] = probability when A has i servings and B has j servings
4. Fill DP from base cases upward using the 4 operations

## Optimal Solution

<div class="code-group">

```python
# Time: O(m²) where m = ceil(n/25) | Space: O(m²)
def soupServings(n):
    # If n is large enough, probability is effectively 1
    # Mathematical fact: for n ≥ 5000, probability > 0.999999
    if n >= 5000:
        return 1.0

    # Convert to servings of 25mL, rounding up
    m = (n + 24) // 25  # ceil(n / 25)

    # DP table: dp[i][j] = probability when A has i servings, B has j servings
    dp = [[0.0] * (m + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(1, m + 1):
        dp[0][0] = 0.5  # Both empty simultaneously
        dp[i][0] = 0.0  # B empty first (A still has soup)
        dp[0][i] = 1.0  # A empty first (B still has soup)

    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, m + 1):
            # Four operations converted to 25mL servings:
            # (100,0) → (4,0), (75,25) → (3,1), (50,50) → (2,2), (25,75) → (1,3)
            dp[i][j] = 0.25 * (
                dp[max(0, i - 4)][j] +      # Operation 1
                dp[max(0, i - 3)][max(0, j - 1)] +  # Operation 2
                dp[max(0, i - 2)][max(0, j - 2)] +  # Operation 3
                dp[max(0, i - 1)][max(0, j - 3)]    # Operation 4
            )

    return dp[m][m]
```

```javascript
// Time: O(m²) where m = ceil(n/25) | Space: O(m²)
function soupServings(n) {
  // If n is large enough, probability is effectively 1
  if (n >= 5000) return 1.0;

  // Convert to servings of 25mL, rounding up
  const m = Math.ceil(n / 25);

  // DP table: dp[i][j] = probability when A has i servings, B has j servings
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(m + 1).fill(0));

  // Base cases
  dp[0][0] = 0.5; // Both empty simultaneously
  for (let i = 1; i <= m; i++) {
    dp[i][0] = 0.0; // B empty first
    dp[0][i] = 1.0; // A empty first
  }

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= m; j++) {
      // Four operations converted to 25mL servings
      dp[i][j] =
        0.25 *
        (dp[Math.max(0, i - 4)][j] + // Operation 1
          dp[Math.max(0, i - 3)][Math.max(0, j - 1)] + // Operation 2
          dp[Math.max(0, i - 2)][Math.max(0, j - 2)] + // Operation 3
          dp[Math.max(0, i - 1)][Math.max(0, j - 3)]); // Operation 4
    }
  }

  return dp[m][m];
}
```

```java
// Time: O(m²) where m = ceil(n/25) | Space: O(m²)
public double soupServings(int n) {
    // If n is large enough, probability is effectively 1
    if (n >= 5000) return 1.0;

    // Convert to servings of 25mL, rounding up
    int m = (n + 24) / 25;  // ceil(n / 25)

    // DP table: dp[i][j] = probability when A has i servings, B has j servings
    double[][] dp = new double[m + 1][m + 1];

    // Base cases
    dp[0][0] = 0.5;  // Both empty simultaneously
    for (int i = 1; i <= m; i++) {
        dp[i][0] = 0.0;  // B empty first
        dp[0][i] = 1.0;  // A empty first
    }

    // Fill DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= m; j++) {
            // Four operations converted to 25mL servings
            dp[i][j] = 0.25 * (
                dp[Math.max(0, i - 4)][j] +                // Operation 1
                dp[Math.max(0, i - 3)][Math.max(0, j - 1)] +  // Operation 2
                dp[Math.max(0, i - 2)][Math.max(0, j - 2)] +  // Operation 3
                dp[Math.max(0, i - 1)][Math.max(0, j - 3)]    // Operation 4
            );
        }
    }

    return dp[m][m];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m²) where m = ceil(n/25)

- We create a DP table of size (m+1) × (m+1)
- Each cell requires constant time (4 lookups and arithmetic)
- For n < 5000, m ≤ 200, so at most 200² = 40,000 operations

**Space Complexity:** O(m²)

- We store the entire DP table
- Could be optimized to O(m) using rolling arrays since we only need previous rows

**Why the 5000 threshold works:**

- Each operation removes more from A on average (expected removal: A loses 62.5mL, B loses 37.5mL per turn)
- As n increases, the law of large numbers ensures A empties first with near certainty
- At n = 5000, probability > 1 - 10⁻⁶, which is within floating-point precision

## Common Mistakes

1. **Not handling large n efficiently**: Trying to create DP table for n up to 10⁹ would require 10¹⁸ entries. Always check for mathematical shortcuts before implementing DP.

2. **Incorrect base case order**: The order matters! Check "both empty" before checking individual emptiness. If A ≤ 0 and B ≤ 0, it's both empty (0.5), not A empty first (1.0).

3. **Forgetting to use max(0, ...) in DP lookups**: When an operation would make soup negative, we need to use 0 instead. This handles the "empty" condition correctly.

4. **Not converting to 25mL units**: Working directly with mL values creates unnecessarily large DP tables. Always look for opportunities to reduce state space through mathematical insight.

## When You'll See This Pattern

This problem combines **probability DP** with **mathematical optimization**:

1. **Knight Probability in Chessboard (LeetCode 688)**: Similar probability DP where you calculate the chance of a knight remaining on board after k moves.

2. **Dice Roll Simulation (LeetCode 1223)**: Probability/DP problem with constraints on consecutive rolls.

3. **New 21 Game (LeetCode 837)**: Another probability DP where you draw cards and want the probability of not exceeding a target.

The pattern: When you need to calculate probabilities with multiple random choices and the state space can be reduced through mathematical insight or unit conversion.

## Key Takeaways

1. **Always look for mathematical optimizations before coding**: The n ≥ 5000 shortcut reduces an impossible problem to a manageable one. In interviews, mention this insight even if you don't recall the exact threshold.

2. **Convert units to reduce state space**: By working in 25mL servings instead of mL, we reduced the DP table size by 25² = 625x.

3. **Probability DP often involves weighted averages**: The recurrence is typically dp[state] = Σ(probability × dp[next_state]) over all possible transitions.

[Practice this problem on CodeJeet](/problem/soup-servings)
