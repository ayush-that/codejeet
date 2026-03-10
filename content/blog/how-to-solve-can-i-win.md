---
title: "How to Solve Can I Win — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Can I Win. Medium difficulty, 31.0% acceptance rate. Topics: Math, Dynamic Programming, Bit Manipulation, Memoization, Game Theory."
date: "2027-02-09"
category: "dsa-patterns"
tags: ["can-i-win", "math", "dynamic-programming", "bit-manipulation", "medium"]
---

# How to Solve Can I Win

This problem is a twist on the classic "100 game" where two players take turns picking numbers from 1 to `maxChoosableInteger` without replacement, trying to reach or exceed a target total. The challenge is determining whether the first player can force a win given perfect play from both sides. What makes this problem interesting is that it combines game theory with state compression using bit manipulation and memoization.

## Visual Walkthrough

Let's trace through a small example: `maxChoosableInteger = 3`, `desiredTotal = 4`.

**Game state:** Numbers available: {1, 2, 3}, running total = 0

**Player 1's turn:**

- If Player 1 picks 1: Remaining numbers {2, 3}, total = 1
  - Player 2's turn: If Player 2 picks 3: total = 4 → Player 2 wins
  - Player 2's turn: If Player 2 picks 2: total = 3
    - Player 1's turn: Only 3 remains, total = 6 → Player 1 wins
      So Player 2 would pick 3 and win

- If Player 1 picks 2: Remaining numbers {1, 3}, total = 2
  - Player 2's turn: If Player 2 picks 3: total = 5 → Player 2 wins
  - Player 2's turn: If Player 2 picks 1: total = 3
    - Player 1's turn: Only 3 remains, total = 6 → Player 1 wins
      So Player 2 would pick 3 and win

- If Player 1 picks 3: Remaining numbers {1, 2}, total = 3
  - Player 2's turn: Any pick (1 or 2) makes total ≥ 4 → Player 2 wins

In all scenarios, Player 2 wins. Therefore, with perfect play, Player 1 cannot force a win.

This example shows we need to explore all possible move sequences to determine if Player 1 has a winning strategy.

## Brute Force Approach

A naive approach would recursively try all possible sequences of moves:

1. At each turn, try every available number
2. If picking a number makes the total reach or exceed the target, the current player wins
3. Otherwise, recursively check if the opponent can win from the resulting state
4. If there exists any move where the opponent cannot force a win, the current player can win

The problem with this approach is the exponential time complexity. With `maxChoosableInteger = 20`, there are 20! possible move sequences, which is astronomically large. Even with pruning (stopping when a winning move is found), we'd still explore many redundant states.

## Optimized Approach

The key insight is that **the game state depends only on which numbers have been used, not the order they were chosen**. This allows us to use memoization to avoid recomputing the same states.

We can represent the set of used numbers as a bitmask:

- Bit `i` is 1 if number `i+1` has been used (since numbers start from 1)
- For example, with numbers 1-3: `011` (binary) means numbers 1 and 2 have been used

The recursive function `canWin(mask, total)` returns whether the current player can force a win given:

- `mask`: bitmask of used numbers
- `total`: current running total

At each step:

1. Try every number that hasn't been used
2. If picking that number makes `total + number ≥ desiredTotal`, return true (current player wins)
3. Otherwise, recursively check if the opponent can win from the new state
4. If the opponent cannot win from ANY of the resulting states, then the current player can win

We memoize results by `mask` since the total can be derived from the mask (initial total + sum of used numbers).

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^n * n) where n = maxChoosableInteger
# Space: O(2^n) for memoization cache
class Solution:
    def canIWin(self, maxChoosableInteger: int, desiredTotal: int) -> bool:
        # Edge case: if desiredTotal is 0 or negative, first player wins immediately
        if desiredTotal <= 0:
            return True

        # Edge case: if sum of all numbers is less than desiredTotal, nobody can win
        total_sum = maxChoosableInteger * (maxChoosableInteger + 1) // 2
        if total_sum < desiredTotal:
            return False

        # Memoization cache: mask -> can current player win from this state
        memo = {}

        def can_win(mask: int, current_total: int) -> bool:
            # Check if we've already computed this state
            if mask in memo:
                return memo[mask]

            # Try every available number
            for i in range(1, maxChoosableInteger + 1):
                # Check if number i is available (bit i-1 is 0)
                bit = 1 << (i - 1)
                if mask & bit == 0:  # Number i is available
                    # If picking i makes us reach or exceed the target, we win
                    if current_total + i >= desiredTotal:
                        memo[mask] = True
                        return True

                    # Otherwise, check if opponent can win from the new state
                    # New mask: mark number i as used
                    new_mask = mask | bit
                    # If opponent cannot win from the new state, then we win
                    if not can_win(new_mask, current_total + i):
                        memo[mask] = True
                        return True

            # If no winning move exists, current player loses
            memo[mask] = False
            return False

        # Start with empty mask (no numbers used) and total = 0
        return can_win(0, 0)
```

```javascript
// Time: O(2^n * n) where n = maxChoosableInteger
// Space: O(2^n) for memoization cache
/**
 * @param {number} maxChoosableInteger
 * @param {number} desiredTotal
 * @return {boolean}
 */
var canIWin = function (maxChoosableInteger, desiredTotal) {
  // Edge case: if desiredTotal is 0 or negative, first player wins immediately
  if (desiredTotal <= 0) return true;

  // Edge case: if sum of all numbers is less than desiredTotal, nobody can win
  const totalSum = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;
  if (totalSum < desiredTotal) return false;

  // Memoization cache: mask -> can current player win from this state
  const memo = new Map();

  const canWin = (mask, currentTotal) => {
    // Check if we've already computed this state
    if (memo.has(mask)) return memo.get(mask);

    // Try every available number
    for (let i = 1; i <= maxChoosableInteger; i++) {
      // Check if number i is available (bit i-1 is 0)
      const bit = 1 << (i - 1);
      if ((mask & bit) === 0) {
        // Number i is available
        // If picking i makes us reach or exceed the target, we win
        if (currentTotal + i >= desiredTotal) {
          memo.set(mask, true);
          return true;
        }

        // Otherwise, check if opponent can win from the new state
        // New mask: mark number i as used
        const newMask = mask | bit;
        // If opponent cannot win from the new state, then we win
        if (!canWin(newMask, currentTotal + i)) {
          memo.set(mask, true);
          return true;
        }
      }
    }

    // If no winning move exists, current player loses
    memo.set(mask, false);
    return false;
  };

  // Start with empty mask (no numbers used) and total = 0
  return canWin(0, 0);
};
```

```java
// Time: O(2^n * n) where n = maxChoosableInteger
// Space: O(2^n) for memoization cache
class Solution {
    public boolean canIWin(int maxChoosableInteger, int desiredTotal) {
        // Edge case: if desiredTotal is 0 or negative, first player wins immediately
        if (desiredTotal <= 0) return true;

        // Edge case: if sum of all numbers is less than desiredTotal, nobody can win
        int totalSum = maxChoosableInteger * (maxChoosableInteger + 1) / 2;
        if (totalSum < desiredTotal) return false;

        // Memoization cache: mask -> can current player win from this state
        Boolean[] memo = new Boolean[1 << maxChoosableInteger];

        return canWin(0, 0, maxChoosableInteger, desiredTotal, memo);
    }

    private boolean canWin(int mask, int currentTotal, int maxInt, int target, Boolean[] memo) {
        // Check if we've already computed this state
        if (memo[mask] != null) return memo[mask];

        // Try every available number
        for (int i = 1; i <= maxInt; i++) {
            // Check if number i is available (bit i-1 is 0)
            int bit = 1 << (i - 1);
            if ((mask & bit) == 0) {  // Number i is available
                // If picking i makes us reach or exceed the target, we win
                if (currentTotal + i >= target) {
                    memo[mask] = true;
                    return true;
                }

                // Otherwise, check if opponent can win from the new state
                // New mask: mark number i as used
                int newMask = mask | bit;
                // If opponent cannot win from the new state, then we win
                if (!canWin(newMask, currentTotal + i, maxInt, target, memo)) {
                    memo[mask] = true;
                    return true;
                }
            }
        }

        // If no winning move exists, current player loses
        memo[mask] = false;
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(2^n × n) where n = `maxChoosableInteger`

- There are 2^n possible states (each number can be either used or not used)
- For each state, we try up to n possible moves in the worst case
- The memoization ensures we compute each state only once

**Space Complexity:** O(2^n)

- We need to store results for all 2^n possible states in the memoization cache
- The recursion depth is at most n (when all numbers are used), so the call stack uses O(n) space

## Common Mistakes

1. **Forgetting the "sum of all numbers" edge case:** If the sum of 1 to `maxChoosableInteger` is less than `desiredTotal`, neither player can reach the target. Always check this first.

2. **Not using memoization correctly:** Some candidates memoize by `(mask, total)` instead of just `mask`. Since `total` can be derived from `mask` (initial total + sum of used numbers), this wastes memory and time.

3. **Incorrect bit manipulation:** Remember that numbers start from 1, so number `i` corresponds to bit `i-1`. A common mistake is using `1 << i` instead of `1 << (i-1)`.

4. **Missing the immediate win condition:** When `currentTotal + i >= desiredTotal`, the current player wins immediately. Don't forget to check this before making the recursive call.

## When You'll See This Pattern

This pattern of **game theory + state compression + memoization** appears in several LeetCode problems:

1. **Flip Game II (Medium):** Players flip "++" to "--" in a string. Similar state exploration with memoization.

2. **Predict the Winner (Medium):** Players pick from ends of an array. While not using bitmask, it uses memoization to avoid recomputing game states.

3. **Guess Number Higher or Lower II (Medium):** Finding the minimum cost to guarantee a win in a guessing game, using similar recursive exploration with memoization.

The core pattern is: when you need to explore all possible game states but the state space is exponential, look for ways to compress the state representation and use memoization to avoid redundant computation.

## Key Takeaways

1. **State compression with bitmasks** is powerful for problems where you need to track which elements have been used from a small set (typically n ≤ 20-30).

2. **Game theory problems** often reduce to: "Can the current player force a win?" → "Is there any move such that the opponent cannot force a win from the resulting state?"

3. **Memoization transforms exponential brute force into manageable complexity** when the state space is exponential but manageable (like 2^n for n ≤ 20).

Related problems: [Flip Game II](/problem/flip-game-ii), [Guess Number Higher or Lower II](/problem/guess-number-higher-or-lower-ii), [Predict the Winner](/problem/predict-the-winner)
