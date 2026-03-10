---
title: "How to Solve Find the Winning Player in Coin Game — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Winning Player in Coin Game. Easy difficulty, 53.1% acceptance rate. Topics: Math, Simulation, Game Theory."
date: "2028-05-20"
category: "dsa-patterns"
tags: ["find-the-winning-player-in-coin-game", "math", "simulation", "game-theory", "easy"]
---

# How to Solve Find the Winning Player in Coin Game

This problem presents a two-player game where Alice and Bob alternate picking coins totaling exactly 115 from a limited supply of coins worth 75 and 10. The player who cannot make a valid move loses. While it appears to be a game theory problem, the constraints make it solvable through careful analysis rather than complex simulation.

What makes this problem interesting is that it looks like it requires game tree exploration, but the specific values (75, 10, 115) create a mathematical pattern that allows for a much simpler solution. The key insight is recognizing that 115 can only be formed in specific ways from 75 and 10 coins.

## Visual Walkthrough

Let's trace through an example with `x = 2` (coins worth 75) and `y = 5` (coins worth 10):

**Turn 1 (Alice):** Alice needs to pick coins totaling 115. She has several options:

- Option 1: 1×75 + 4×10 = 75 + 40 = 115 ✓
- Option 2: 2×75 + 0×10 = 150 (too high) ✗
- Option 3: 0×75 + 12×10 = 0 + 120 (close but not 115) ✗

Alice chooses option 1: uses 1 coin of 75 and 4 coins of 10.
Remaining: `x = 1`, `y = 1`

**Turn 2 (Bob):** Bob needs to pick coins totaling 115 from what's left:

- Option 1: 1×75 + 4×10 = 115 (needs 4 coins of 10, but only 1 available) ✗
- Option 2: 0×75 + 12×10 = 115 (needs 12 coins of 10, but only 1 available) ✗

Bob cannot make a valid move, so Bob loses and Alice wins.

This example shows us that the game depends on whether players can always make valid moves. Notice that 115 can only be formed as:

1. 1×75 + 4×10 = 115
2. 0×75 + 12×10 = 115 (but this requires 12 coins of value 10)

Since we need integer solutions to `75a + 10b = 115` where `a` and `b` are non-negative integers, the only valid combinations are (a=1, b=4) and (a=0, b=12).

## Brute Force Approach

A naive approach would simulate every possible game sequence using recursion or BFS. At each turn, the player would try all valid combinations of coins that sum to 115, then recursively check if the opponent would lose from the resulting state.

The brute force solution would look like this:

1. Check all possible ways to pick coins (1×75 + 4×10, or 0×75 + 12×10)
2. For each valid move, recursively check if the opponent would lose
3. If any move leads to opponent losing, current player wins

However, this approach has exponential time complexity because it explores the entire game tree. With `x` and `y` up to 100, the state space could be enormous. Even with memoization, we'd need to track `(x, y, player)` states, which is O(x×y) in space and time.

More importantly, the brute force misses the mathematical insight: we don't need to simulate the entire game because the outcome follows a predictable pattern based on the availability of the (1,4) combination.

## Optimal Solution

The optimal solution recognizes that the (1×75 + 4×10) combination is the only practical one in most cases, since (0×75 + 12×10) requires 12 coins of value 10, which is often not available. Each (1,4) move consumes 1 coin of 75 and 4 coins of 10.

The game becomes a race: players will keep making (1,4) moves until either:

1. They run out of 75-coins (x becomes 0)
2. They run out of 10-coins (y becomes less than 4)

Since Alice starts, if the number of possible (1,4) moves is odd, Alice wins; if even, Bob wins. Each (1,4) move consumes 1 coin of 75, so the maximum number of such moves is `min(x, y // 4)`.

Wait, there's a catch! What if y is very large? Then the (0,12) move becomes possible. But notice: (0,12) consumes 12 coins of 10 without touching the 75-coins. If a player has this option, they could use it strategically. However, since 12 is a multiple of 4, using a (0,12) move is equivalent to making 3 consecutive (1,4) moves in terms of 10-coin consumption (but without using 75-coins).

Actually, let's think more carefully. The (0,12) move requires exactly 12 coins of value 10. If available, a player could use it. But would they want to? Using (0,12) doesn't affect the 75-coins, so it doesn't change the count of possible (1,4) moves. It just reduces y by 12.

Here's the key insight: **The (0,12) move is never optimal if (1,4) is available.** Why? Because if you use (0,12), you're wasting 12 coins of 10 that could have been used for 3 separate (1,4) moves (with 3 different 75-coins). Using (0,12) doesn't reduce the opponent's options with 75-coins.

Therefore, optimal play always uses the (1,4) combination when possible. The game ends when either x = 0 or y < 4. The number of moves is `min(x, y // 4)`. If this number is odd, Alice (who moves first) wins. If even, Bob wins.

But wait! What if y // 4 > x? Then we'll run out of 75-coins first. The last move will be made by the player who takes the last available (1,4) combination. If x ≤ y // 4, then the number of moves = x. If x > y // 4, then the number of moves = y // 4.

So the solution is simply: `return "Alice" if min(x, y // 4) % 2 == 1 else "Bob"`

Let's verify with our example: x=2, y=5, min(2, 5//4=1) = 1, 1%2=1 → Alice wins ✓

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def winning_player(x: int, y: int) -> str:
    """
    Determines the winner of the coin game.

    The game rules:
    - Two players: Alice (starts) and Bob
    - Coins: x coins of value 75, y coins of value 10
    - Each turn: player must pick coins totaling exactly 115
    - If a player cannot make a valid move, they lose

    Key insight: 115 can only be formed as:
    1. 1×75 + 4×10 = 115 (primary move)
    2. 0×75 + 12×10 = 115 (requires 10-coins, rarely optimal)

    Optimal strategy: Always use the (1,4) combination when possible.
    The (0,12) move is suboptimal as it doesn't reduce 75-coins.

    The game ends when either:
    - No 75-coins left (x = 0), or
    - Not enough 10-coins for (1,4) move (y < 4)

    Number of possible (1,4) moves = min(x, y // 4)
    If odd → Alice wins (she moves first)
    If even → Bob wins
    """
    # Calculate maximum number of (1,4) moves possible
    moves = min(x, y // 4)

    # Alice wins if moves is odd (1st, 3rd, 5th... moves are Alice's)
    # Bob wins if moves is even (Alice gets even-numbered moves: 2nd, 4th...)
    return "Alice" if moves % 2 == 1 else "Bob"
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Determines the winner of the coin game.
 *
 * Game rules:
 * - Players: Alice (starts) and Bob
 * - Coins: x coins of value 75, y coins of value 10
 * - Each turn: pick coins totaling exactly 115
 * - Cannot move → lose
 *
 * Key insight: 115 = 1×75 + 4×10 (optimal move)
 * Alternative: 115 = 0×75 + 12×10 (suboptimal, doesn't use 75-coins)
 *
 * Optimal play: Always use (1,4) combination when possible.
 * Game ends when x=0 or y<4.
 *
 * Number of moves = min(x, Math.floor(y / 4))
 * Odd moves → Alice wins (makes 1st, 3rd, 5th... moves)
 * Even moves → Bob wins
 */
function winningPlayer(x, y) {
  // Calculate maximum (1,4) moves possible
  const moves = Math.min(x, Math.floor(y / 4));

  // Determine winner based on move parity
  return moves % 2 === 1 ? "Alice" : "Bob";
}
```

```java
// Time: O(1) | Space: O(1)
public class Solution {
    /**
     * Determines the winner of the coin game.
     *
     * Game Analysis:
     * - Valid moves: (1×75 + 4×10) or (0×75 + 12×10)
     * - (1,4) is optimal: consumes both coin types
     * - (0,12) is suboptimal: only consumes 10-coins
     *
     * Optimal strategy: Always use (1,4) when possible.
     * Game continues until x=0 or y<4.
     *
     * Total moves = min(x, y / 4)
     * Odd count → Alice wins (makes moves 1, 3, 5...)
     * Even count → Bob wins
     */
    public String winningPlayer(int x, int y) {
        // Calculate maximum number of (1,4) moves
        int moves = Math.min(x, y / 4);

        // Alice wins if she makes the last move (odd total moves)
        return moves % 2 == 1 ? "Alice" : "Bob";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a constant number of operations: one division, one min operation, one modulo operation.
- No loops or recursion, regardless of input size.

**Space Complexity:** O(1)

- We use only a few integer variables to store intermediate results.
- No additional data structures that scale with input size.

The efficiency comes from the mathematical insight that reduces what appears to be a game tree problem to a simple formula. This is why understanding the problem's constraints (75, 10, 115) is crucial—with different numbers, the solution might not be as simple.

## Common Mistakes

1. **Overcomplicating with game tree simulation:** Many candidates try to implement full game simulation with recursion or BFS. While this works for small inputs, it's inefficient and misses the mathematical insight. The constraints (x, y ≤ 100) might seem to allow simulation, but the state space is actually O(x×y) which is 10,000 states—manageable but unnecessary.

2. **Forgetting about the (0,12) move:** Some solutions only consider the (1,4) combination. While we proved it's never optimal when (1,4) is available, we should at least consider why. A complete solution should acknowledge the (0,12) move and explain why it's not used in optimal play.

3. **Incorrect move counting:** The formula `min(x, y // 4)` is subtle. Some candidates use `min(x, y / 4)` without integer division, or `min(x, y // 4)` when y is small. For example, with x=3, y=3: y//4 = 0, so moves = 0, Bob wins. But can Alice move? 3 coins of 10 can't make 115, so indeed Alice cannot move and loses immediately.

4. **Off-by-one in parity check:** Remember Alice makes move #1, Bob makes move #2, etc. So odd-numbered moves are Alice's. The check should be `moves % 2 == 1` not `moves % 2 == 0`. A good way to verify: if moves=1, Alice should win (she makes the only move).

## When You'll See This Pattern

This problem exemplifies **mathematical game theory** patterns where optimal play follows a deterministic formula rather than requiring game tree exploration. Similar patterns appear in:

1. **Nim Game (LeetCode 292):** Another game where the winner is determined by a simple modulo operation on pile sizes. Like our coin game, Nim has a mathematical solution (XOR of pile sizes ≠ 0) rather than requiring simulation.

2. **Divisor Game (LeetCode 1025):** Players choose divisors of the current number. The winner is determined by whether the starting number is even or odd—another mathematical pattern rather than game tree search.

3. **Stone Game (LeetCode 877):** While this can be solved with DP, there's also a mathematical insight that the first player always wins with optimal play given the constraints (even number of piles, total stones odd).

These problems teach us to look for mathematical patterns in seemingly complex games, especially when moves are symmetric or resources deplete predictably.

## Key Takeaways

1. **Look for mathematical simplifications in game problems:** When you see specific numbers like 75, 10, 115, there's often a mathematical pattern. Ask: "How can the target be formed from the available values?" and "What's the optimal move when multiple options exist?"

2. **Parity (odd/even) often determines turn-based game winners:** In many two-player alternating games, the winner is determined by whether the total number of moves is odd or even. The player who moves first gets the odd-numbered moves.

3. **Consider all valid moves, then eliminate suboptimal ones:** Even if multiple moves are valid, one is often dominant. In this case, (1,4) dominates (0,12) because it consumes the scarcer resource (75-coins).

Related problems: [Can I Win](/problem/can-i-win), [Predict the Winner](/problem/predict-the-winner)
