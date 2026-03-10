---
title: "How to Solve Nim Game — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Nim Game. Easy difficulty, 59.3% acceptance rate. Topics: Math, Brainteaser, Game Theory."
date: "2027-04-25"
category: "dsa-patterns"
tags: ["nim-game", "math", "brainteaser", "game-theory", "easy"]
---

# How to Solve Nim Game

The Nim Game is a classic two-player game where players take turns removing 1-3 stones from a pile, and the player who takes the last stone wins. You always go first. The challenge is determining whether you can force a win given the initial number of stones. What makes this problem interesting is that it appears to require complex game theory analysis, but has a surprisingly simple mathematical solution.

## Visual Walkthrough

Let's trace through small examples to build intuition:

**Example 1: n = 1 stone**

- Your turn: Take 1 stone (pile becomes 0)
- You win immediately
- **Result: You can win**

**Example 2: n = 2 stones**

- Your turn: Take 2 stones (pile becomes 0)
- You win immediately
- **Result: You can win**

**Example 3: n = 3 stones**

- Your turn: Take 3 stones (pile becomes 0)
- You win immediately
- **Result: You can win**

**Example 4: n = 4 stones**

- Your turn options:
  - Take 1: Leaves 3 stones for opponent
  - Take 2: Leaves 2 stones for opponent
  - Take 3: Leaves 1 stone for opponent
- No matter what you do, opponent gets 1-3 stones and can take them all to win
- **Result: You cannot force a win**

**Example 5: n = 5 stones**

- Your turn: Take 1 stone (leaves 4 for opponent)
- Opponent now faces 4 stones (losing position from Example 4)
- No matter what opponent does, you'll win on your next turn
- **Result: You can win**

**Pattern emerges**: When n is divisible by 4, you lose. Otherwise, you win.

## Brute Force Approach

A naive approach would be to simulate all possible game sequences using recursion or dynamic programming. For each state (number of stones remaining), we'd check if there's any move that leads to a losing position for the opponent.

However, this approach has exponential time complexity because each move branches into up to 3 possibilities. For n stones, the recursion tree could have up to O(3^n) nodes, which is completely impractical for large n.

Even if we memoize results, we'd still need O(n) time and space, which is unnecessary when we can derive the mathematical solution.

## Optimal Solution

The key insight is that 4 is a "losing number" - if you're left with 4 stones on your turn, you lose. This creates a cycle: positions 1, 2, 3 are winning (you take all), position 4 is losing, positions 5, 6, 7 are winning (you can leave 4 for opponent), position 8 is losing, and so on.

The optimal solution simply checks if n is not divisible by 4. If n % 4 != 0, you can win by always leaving a multiple of 4 stones for your opponent.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def canWinNim(n: int) -> bool:
    """
    Determines if you can win the Nim game given n stones.

    The key insight is that multiples of 4 are losing positions.
    If n % 4 == 0, you're in a losing position because no matter
    what move you make (1, 2, or 3 stones), your opponent can
    always respond to leave you with another multiple of 4.

    Args:
        n: Number of stones in the pile

    Returns:
        True if you can force a win, False otherwise
    """
    # If n is divisible by 4, you're in a losing position
    # Otherwise, you can win by always leaving multiples of 4
    # for your opponent
    return n % 4 != 0
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Determines if you can win the Nim game given n stones.
 *
 * The key insight is that multiples of 4 are losing positions.
 * If n % 4 == 0, you're in a losing position because no matter
 * what move you make (1, 2, or 3 stones), your opponent can
 * always respond to leave you with another multiple of 4.
 *
 * @param {number} n - Number of stones in the pile
 * @return {boolean} True if you can force a win, False otherwise
 */
function canWinNim(n) {
  // If n is divisible by 4, you're in a losing position
  // Otherwise, you can win by always leaving multiples of 4
  // for your opponent
  return n % 4 !== 0;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Determines if you can win the Nim game given n stones.
     *
     * The key insight is that multiples of 4 are losing positions.
     * If n % 4 == 0, you're in a losing position because no matter
     * what move you make (1, 2, or 3 stones), your opponent can
     * always respond to leave you with another multiple of 4.
     *
     * @param n Number of stones in the pile
     * @return True if you can force a win, False otherwise
     */
    public boolean canWinNim(int n) {
        // If n is divisible by 4, you're in a losing position
        // Otherwise, you can win by always leaving multiples of 4
        // for your opponent
        return n % 4 != 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The solution performs a single modulo operation, which takes constant time regardless of input size.

**Space Complexity: O(1)**

- The solution uses only a constant amount of extra space (just a few variables for the computation).

This is optimal since we must at least read the input, which is O(1) for a single integer.

## Common Mistakes

1. **Overcomplicating with recursion/DP**: Many candidates try to implement recursive solutions or dynamic programming when the mathematical pattern is much simpler. Always look for patterns with small examples before jumping to implementation.

2. **Incorrect base case handling**: Some candidates forget that with 0 stones, the game is already over (the previous player won). The input constraint typically ensures n > 0, but it's good to be aware.

3. **Misunderstanding the winning condition**: The problem asks whether you can _force_ a win with optimal play from both sides. Some candidates incorrectly think about average outcomes or assume the opponent makes mistakes.

4. **Not testing enough examples**: Candidates who only test n=1 through n=4 might miss the pattern. Always test at least through n=8 to see the repeating cycle.

## When You'll See This Pattern

This problem introduces **combinatorial game theory** patterns that appear in many other problems:

1. **Flip Game II (LeetCode 294)**: Similar pattern but with different move rules. You need to determine if the first player can force a win by flipping "++" to "--" in a string.

2. **Divisor Game (LeetCode 1025)**: Another game theory problem where the optimal strategy depends on mathematical properties (even/odd numbers).

3. **Stone Game (LeetCode 877)**: A more complex game theory problem involving piles of stones with different values, often solved with dynamic programming.

The key pattern to recognize is when a game has **symmetric moves** and **perfect information** (both players know everything), there's often a mathematical solution rather than needing to simulate all possibilities.

## Key Takeaways

1. **Always test small cases first**: By manually working through n=1 to n=8, the pattern becomes obvious. This should be your first step for any game theory problem.

2. **Look for cycles and losing positions**: In impartial combinatorial games (where both players have the same moves), there are often "losing positions" that propagate through the game tree. Finding the smallest losing position (4 in this case) reveals the pattern.

3. **Simple problems often have simple solutions**: When a problem is marked "Easy" and has high acceptance, there's usually a mathematical insight rather than a complex algorithm. Don't overengineer.

Related problems: [Flip Game II](/problem/flip-game-ii)
