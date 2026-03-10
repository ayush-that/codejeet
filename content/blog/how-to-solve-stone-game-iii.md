---
title: "How to Solve Stone Game III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Stone Game III. Hard difficulty, 63.3% acceptance rate. Topics: Array, Math, Dynamic Programming, Game Theory."
date: "2027-04-13"
category: "dsa-patterns"
tags: ["stone-game-iii", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Stone Game III

Stone Game III is a two-player zero-sum game where players take stones from a sequence, trying to maximize their own score. The twist is that on each turn, a player can take 1, 2, or 3 stones from the **front** of the remaining array. This creates a sequential decision problem where each choice affects all future possibilities. The challenge is determining which player wins (or if it's a tie) when both play optimally.

## Visual Walkthrough

Let's trace through a small example: `stoneValue = [1, 2, 3, 7]`

**Game State:** We'll track the remaining stones and the current player's advantage.

**Turn 1 (Alice's turn):**

- Alice can take 1, 2, or 3 stones from the front
- If she takes 1 stone: Gets 1 point, remaining `[2, 3, 7]`
- If she takes 2 stones: Gets 3 points (1+2), remaining `[3, 7]`
- If she takes 3 stones: Gets 6 points (1+2+3), remaining `[7]`

Alice needs to think ahead: Bob will play optimally to maximize his own score (which minimizes Alice's advantage).

Let's evaluate each option:

1. Take 1 stone → Alice gets 1, then Bob faces `[2, 3, 7]`
2. Take 2 stones → Alice gets 3, then Bob faces `[3, 7]`
3. Take 3 stones → Alice gets 6, then Bob faces `[7]`

We need to work backwards from the end to determine the optimal play. This is where dynamic programming shines.

**Working backwards:**

- If only `[7]` remains: Current player takes it (gets 7)
- If `[3, 7]` remains: Player can take 3 (gets 3, opponent gets 7) or take 3+7=10 (gets all)
- If `[2, 3, 7]` remains: Player can take 2, 3, or 2+3=5
- If `[1, 2, 3, 7]` remains (starting position): Alice chooses best option

The key insight: At each position `i`, we want to know the **maximum advantage** the current player can achieve over their opponent when playing optimally from that position onward.

## Brute Force Approach

A naive approach would explore all possible game sequences through recursion. At each turn, the player has 3 choices (take 1, 2, or 3 stones), leading to a branching factor of 3. For an array of length `n`, this creates 3^n possible sequences.

The brute force recursion would look like:

```
function solve(i):
    if i >= n: return 0
    best = -infinity
    for take in 1 to 3:
        if i + take <= n:
            stones_taken = sum(stoneValue[i:i+take])
            opponent_best = solve(i + take)
            best = max(best, stones_taken - opponent_best)
    return best
```

**Why this fails:**

- Time complexity: O(3^n) — exponential growth makes it impractical for n > 20
- Redundant calculations: The same subproblem `solve(i)` gets computed many times
- No memoization: We're recomputing results for the same position repeatedly

Even with memoization, the naive approach still requires calculating sums repeatedly, which is inefficient.

## Optimized Approach

The key insight is that this is a **minimax game with perfect information**, which can be solved with dynamic programming. We define:

`dp[i]` = maximum score advantage (current player's score minus opponent's score) when starting at position `i` with stones `stoneValue[i:]`

**Transition formula:**
At position `i`, the current player can take 1, 2, or 3 stones:

- If taking 1 stone: advantage = `stoneValue[i] - dp[i+1]`
- If taking 2 stones: advantage = `(stoneValue[i] + stoneValue[i+1]) - dp[i+2]`
- If taking 3 stones: advantage = `(stoneValue[i] + stoneValue[i+1] + stoneValue[i+2]) - dp[i+3]`

The player chooses the maximum of these three options.

**Why subtract dp[i+k]?**
Because `dp[i+k]` represents the advantage the **opponent** will have when they start playing at position `i+k`. Since advantage = current player's score - opponent's score, and the opponent will try to maximize their own advantage (which is `dp[i+k]`), we subtract it.

**Base case:** `dp[n] = 0` (no stones left, advantage is 0)

**Computing efficiently:**
We need prefix sums to quickly calculate the sum of stones taken: `prefix[i] = sum of first i stones`
Then `sum(i, j) = prefix[j] - prefix[i]`

**Final result:**

- If `dp[0] > 0`: Alice wins
- If `dp[0] < 0`: Bob wins
- If `dp[0] == 0`: Tie

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def stoneGameIII(stoneValue):
    n = len(stoneValue)

    # dp[i] = maximum score advantage when starting at position i
    # We need n+3 to handle i+1, i+2, i+3 safely
    dp = [0] * (n + 3)

    # Calculate from the end to the beginning
    for i in range(n - 1, -1, -1):
        # Initialize with taking just stone i
        best = stoneValue[i] - dp[i + 1]

        # Try taking 2 stones if available
        if i + 1 < n:
            take_two = stoneValue[i] + stoneValue[i + 1] - dp[i + 2]
            best = max(best, take_two)

        # Try taking 3 stones if available
        if i + 2 < n:
            take_three = stoneValue[i] + stoneValue[i + 1] + stoneValue[i + 2] - dp[i + 3]
            best = max(best, take_three)

        dp[i] = best

    # Determine the winner based on the advantage at the start
    if dp[0] > 0:
        return "Alice"
    elif dp[0] < 0:
        return "Bob"
    else:
        return "Tie"
```

```javascript
// Time: O(n) | Space: O(n)
function stoneGameIII(stoneValue) {
  const n = stoneValue.length;

  // dp[i] = maximum score advantage when starting at position i
  // We use n+3 to safely handle i+1, i+2, i+3 without bounds checking
  const dp = new Array(n + 3).fill(0);

  // Calculate from the end to the beginning (bottom-up DP)
  for (let i = n - 1; i >= 0; i--) {
    // Start with taking just the current stone
    let best = stoneValue[i] - dp[i + 1];

    // Try taking 2 stones if available
    if (i + 1 < n) {
      const takeTwo = stoneValue[i] + stoneValue[i + 1] - dp[i + 2];
      best = Math.max(best, takeTwo);
    }

    // Try taking 3 stones if available
    if (i + 2 < n) {
      const takeThree = stoneValue[i] + stoneValue[i + 1] + stoneValue[i + 2] - dp[i + 3];
      best = Math.max(best, takeThree);
    }

    dp[i] = best;
  }

  // Determine winner based on advantage at the start
  if (dp[0] > 0) {
    return "Alice";
  } else if (dp[0] < 0) {
    return "Bob";
  } else {
    return "Tie";
  }
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String stoneGameIII(int[] stoneValue) {
        int n = stoneValue.length;

        // dp[i] = maximum score advantage when starting at position i
        // We use n+3 to safely handle i+1, i+2, i+3 without bounds checking
        int[] dp = new int[n + 3];

        // Calculate from the end to the beginning (bottom-up DP)
        for (int i = n - 1; i >= 0; i--) {
            // Start with taking just the current stone
            int best = stoneValue[i] - dp[i + 1];

            // Try taking 2 stones if available
            if (i + 1 < n) {
                int takeTwo = stoneValue[i] + stoneValue[i + 1] - dp[i + 2];
                best = Math.max(best, takeTwo);
            }

            // Try taking 3 stones if available
            if (i + 2 < n) {
                int takeThree = stoneValue[i] + stoneValue[i + 1] + stoneValue[i + 2] - dp[i + 3];
                best = Math.max(best, takeThree);
            }

            dp[i] = best;
        }

        // Determine winner based on advantage at the start
        if (dp[0] > 0) {
            return "Alice";
        } else if (dp[0] < 0) {
            return "Bob";
        } else {
            return "Tie";
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once from the end to the beginning
- At each position `i`, we perform at most 3 constant-time operations (calculating sums and comparisons)
- Total operations: approximately 3n = O(n)

**Space Complexity: O(n)**

- We use a DP array of size `n+3` to store the advantage at each position
- This is the main space requirement
- We could optimize to O(1) space by only storing the last 3 values, but O(n) is typically acceptable

## Common Mistakes

1. **Incorrect DP state definition**: Defining `dp[i]` as the maximum score instead of maximum advantage (score difference). This fails because you need to account for the opponent's optimal play.

2. **Wrong iteration direction**: Starting from the beginning instead of the end. Since the game ends at the last stone, we need to build our solution backwards from the base case.

3. **Insufficient array size**: Using `dp[n]` instead of `dp[n+3]`. When `i = n-2` and we check `i+3`, we access `dp[n+1]`, which would cause an index error without proper padding.

4. **Forgetting to handle ties**: Only checking for `dp[0] > 0` and `dp[0] < 0` but not `dp[0] == 0`. The problem explicitly requires returning "Tie" when scores are equal.

## When You'll See This Pattern

This minimax game DP pattern appears in many competitive programming problems:

1. **Stone Game series** (I-VII): Each variant changes the rules (taking from ends, splitting piles, etc.) but all use similar DP with game theory.

2. **Predict the Winner** (LeetCode 486): Similar concept but players take from either end of the array.

3. **Can I Win** (LeetCode 464): Different constraints but same minimax DP approach with memoization.

The core pattern is: two-player zero-sum game with perfect information → use DP to compute optimal outcomes, working backwards from terminal states.

## Key Takeaways

1. **Minimax games with perfect information** can often be solved with dynamic programming by defining the state as the advantage (difference in scores) from the current position.

2. **Work backwards from terminal states** when solving sequential decision problems. The base case is usually when no moves remain, and you build the solution towards the starting position.

3. **The DP transition subtracts the opponent's optimal result** because in zero-sum games, what's good for your opponent is bad for you. If `dp[i]` represents your advantage starting at `i`, then your opponent's advantage starting at `i+k` is `dp[i+k]`, so your net advantage is `(stones you take) - dp[i+k]`.

Related problems: [Stone Game V](/problem/stone-game-v), [Stone Game VI](/problem/stone-game-vi), [Stone Game VII](/problem/stone-game-vii)
