---
title: "How to Solve Divisor Game — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Divisor Game. Easy difficulty, 71.6% acceptance rate. Topics: Math, Dynamic Programming, Brainteaser, Game Theory."
date: "2027-09-04"
category: "dsa-patterns"
tags: ["divisor-game", "math", "dynamic-programming", "brainteaser", "easy"]
---

# How to Solve Divisor Game

The Divisor Game is a classic two-player game where players take turns reducing a number `n` by subtracting a divisor of `n` (excluding `n` itself). Alice starts first, and the player who cannot make a move loses. The challenge is determining whether Alice can force a win given perfect play from both sides. What makes this problem interesting is that while it appears to be a game theory problem requiring simulation, it has a surprisingly simple mathematical solution.

## Visual Walkthrough

Let's trace through the game with `n = 6` to build intuition:

**Turn 1 (Alice's turn):** `n = 6`

- Alice can choose any `x` where `0 < x < 6` and `6 % x == 0`
- Valid divisors: `1, 2, 3`
- If Alice chooses `x = 1`: `n` becomes `6 - 1 = 5`
- If Alice chooses `x = 2`: `n` becomes `6 - 2 = 4`
- If Alice chooses `x = 3`: `n` becomes `6 - 3 = 3`

Alice wants to force a win, so she needs to think ahead. Let's analyze what happens if she chooses `x = 1`:

- **Turn 2 (Bob's turn):** `n = 5`
- Valid divisors: only `1` (since 5 is prime)
- Bob must choose `x = 1`: `n` becomes `5 - 1 = 4`
- **Turn 3 (Alice's turn):** `n = 4`
- Valid divisors: `1, 2`
- If Alice chooses `x = 1`: `n` becomes `3`
- If Alice chooses `x = 2`: `n` becomes `2`
- Let's say Alice chooses `x = 1`
- **Turn 4 (Bob's turn):** `n = 3`
- Valid divisors: only `1`
- Bob chooses `x = 1`: `n` becomes `2`
- **Turn 5 (Alice's turn):** `n = 2`
- Valid divisors: only `1`
- Alice chooses `x = 1`: `n` becomes `1`
- **Turn 6 (Bob's turn):** `n = 1`
- No valid moves (no `x` where `0 < x < 1`)
- Bob loses, Alice wins!

This shows that with `n = 6`, Alice can win. But is there a pattern? Let's test smaller values:

- `n = 1`: Alice loses immediately (no moves)
- `n = 2`: Alice chooses `x = 1`, `n` becomes `1`, Bob loses
- `n = 3`: Alice must choose `x = 1`, `n` becomes `2`, Bob wins
- `n = 4`: Alice can choose `x = 1` (leaving 3 for Bob, who loses) or `x = 2` (leaving 2 for Bob, who wins) - she'll choose `x = 1` and win

Notice a pattern: Alice wins when `n` is even, loses when `n` is odd!

## Brute Force Approach

A naive approach would be to simulate all possible game sequences using recursion. For each turn, we'd try all valid moves and see if the current player can force a win:

```
function canWin(n):
    if n == 1: return false (current player loses)

    for each divisor x of n where 0 < x < n:
        if not canWin(n - x):  # If opponent loses
            return true         # Current player wins

    return false  # No winning move found
```

This brute force approach has exponential time complexity because we're exploring all possible game trees. For `n = 100`, we'd need to explore an enormous number of possibilities. Even with memoization (caching results for each `n`), we'd still need to check all divisors for each `n`, making it O(n²) in the worst case.

## Optimal Solution

The key insight is that this game has a mathematical pattern: **Alice wins if and only if `n` is even**. Here's why:

1. When `n` is even, Alice can always choose `x = 1`, making `n` odd for Bob
2. When `n` is odd, all its divisors are odd (except 1, which is also odd)
3. Subtracting an odd number from an odd number gives an even number
4. So if Alice starts with an odd `n`, she must leave an even `n` for Bob
5. Bob can then always choose `x = 1`, leaving an odd `n` for Alice
6. This continues until Alice gets `n = 1` and loses

Therefore, Alice wins if she starts with an even number, loses if she starts with an odd number.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def divisorGame(n: int) -> bool:
    """
    Determines if Alice wins the divisor game starting with number n.

    The solution is based on the mathematical observation that:
    - If n is even, Alice can always win by playing optimally
    - If n is odd, Alice always loses with perfect play from both sides

    Args:
        n: The starting number on the chalkboard

    Returns:
        True if Alice wins, False otherwise
    """
    # Alice wins if and only if n is even
    return n % 2 == 0
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Determines if Alice wins the divisor game starting with number n.
 *
 * The solution is based on the mathematical observation that:
 * - If n is even, Alice can always win by playing optimally
 * - If n is odd, Alice always loses with perfect play from both sides
 *
 * @param {number} n - The starting number on the chalkboard
 * @return {boolean} True if Alice wins, False otherwise
 */
function divisorGame(n) {
  // Alice wins if and only if n is even
  return n % 2 === 0;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Determines if Alice wins the divisor game starting with number n.
     *
     * The solution is based on the mathematical observation that:
     * - If n is even, Alice can always win by playing optimally
     * - If n is odd, Alice always loses with perfect play from both sides
     *
     * @param n The starting number on the chalkboard
     * @return True if Alice wins, False otherwise
     */
    public boolean divisorGame(int n) {
        // Alice wins if and only if n is even
        return n % 2 == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We only perform a single modulo operation to check if `n` is even
- No loops or recursion needed

**Space Complexity:** O(1)

- We use only a constant amount of extra space
- No data structures are created that scale with input size

## Common Mistakes

1. **Overcomplicating with DP or recursion:** Many candidates jump straight to dynamic programming or recursive simulation without looking for patterns. Always check small cases first to see if there's a mathematical pattern.

2. **Misunderstanding the game rules:** Some candidates think players can choose any `x` where `x` divides `n`, forgetting that `x` must be strictly between 0 and `n`. This changes the analysis significantly.

3. **Forgetting about optimal play:** The problem assumes both players play optimally. Some solutions incorrectly assume Alice wins if there's ANY path to victory, rather than considering that Bob will also play to win.

4. **Not testing edge cases:** Always test `n = 1` (Alice loses immediately), `n = 2` (Alice wins), and `n = 3` (Alice loses). These small cases often reveal the pattern.

## When You'll See This Pattern

This problem teaches pattern recognition in game theory problems. Similar problems include:

1. **Nim Game (LeetCode 292):** Another game theory problem where the solution is a simple mathematical condition (win if `n % 4 != 0`).

2. **Can I Win (LeetCode 464):** A more complex game theory problem that requires memoization and bitmasking, but shares the same "optimal play" concept.

3. **Stone Game (LeetCode 877):** A game theory problem where the first player can always win with even piles, similar to the parity pattern here.

The key insight is that many two-player turn-based games with perfect information have mathematical solutions based on parity, divisibility, or other number properties.

## Key Takeaways

1. **Always test small cases first:** By manually working through `n = 1, 2, 3, 4, 5, 6`, you'd discover the even/odd pattern without needing complex algorithms.

2. **Look for mathematical patterns in game theory:** Many game problems have simple mathematical solutions rather than requiring simulation or DP.

3. **Parity is powerful:** Many problems involving alternating turns or moves can be solved by analyzing even/odd patterns in the game state.

[Practice this problem on CodeJeet](/problem/divisor-game)
