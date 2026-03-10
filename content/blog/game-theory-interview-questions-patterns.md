---
title: "Game Theory Interview Questions: Patterns and Strategies"
description: "Master Game Theory problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-05-30"
category: "dsa-patterns"
tags: ["game-theory", "dsa", "interview prep"]
---

# Game Theory Interview Questions: Patterns and Strategies

You're in the middle of an interview, feeling good about your solution to what seemed like a straightforward problem. The interviewer asks: "Given a pile of stones where players take turns removing 1-3 stones, and you go first, can you always win if there are 100 stones?" Your mind races — this isn't about arrays or trees. It's about predicting your opponent's moves and planning your own. Welcome to game theory in coding interviews.

Game theory problems appear in about 2-3% of technical interviews, but they're disproportionately represented at top companies. What makes them challenging isn't the complexity of the code (often it's just a few lines), but the mental shift required. You're not just solving a problem — you're modeling a competitive interaction. The most common mistake I see is candidates trying to brute-force these problems with DFS or BFS when a simple mathematical insight would solve it in O(1) time.

## Common Patterns

### Pattern 1: The Nim Game Pattern (Take-Away Games)

This is the classic pattern where players alternately remove items from a pile, with constraints on how many can be taken. The key insight is that these games often have a "winning position" and "losing position" that can be determined mathematically.

**Intuition**: For the standard Nim game (LeetCode #292), if the number of stones is divisible by 4, the first player loses with optimal play. Why? Because whatever move the first player makes (1, 2, or 3 stones), the second player can always make a move that brings the total back to a multiple of 4. This creates a cycle where the first player eventually faces 4 stones and loses.

<div class="code-group">

```python
# LeetCode #292: Nim Game
# Time: O(1) | Space: O(1)
def canWinNim(n: int) -> bool:
    """
    In Nim Game, you lose if you start with a multiple of 4.
    Your opponent can always mirror your moves to keep you at multiples of 4.
    """
    return n % 4 != 0

# More general take-away game: can take 1 to max_take stones
def canWinTakeAway(n: int, max_take: int) -> bool:
    """
    Generalized version: you lose if starting stones are divisible by (max_take + 1)
    because opponent can always take (max_take + 1 - your_move) to maintain the cycle.
    """
    return n % (max_take + 1) != 0
```

```javascript
// LeetCode #292: Nim Game
// Time: O(1) | Space: O(1)
function canWinNim(n) {
  // The losing positions are multiples of 4
  return n % 4 !== 0;
}

// Generalized take-away game
function canWinTakeAway(n, maxTake) {
  // You lose if starting with multiple of (maxTake + 1)
  return n % (maxTake + 1) !== 0;
}
```

```java
// LeetCode #292: Nim Game
// Time: O(1) | Space: O(1)
public boolean canWinNim(int n) {
    // If n is divisible by 4, you're in a losing position
    return n % 4 != 0;
}

// Generalized version
public boolean canWinTakeAway(int n, int maxTake) {
    // Mathematical pattern: losing positions are multiples of (maxTake + 1)
    return n % (maxTake + 1) != 0;
}
```

</div>

**Related Problems**: Nim Game (#292), Divisor Game (#1025), Stone Game IV (#1510)

### Pattern 2: Minimax with Memoization (Optimal Play Games)

When games have branching possibilities and you need to find if you can force a win with optimal play, minimax with memoization is your tool. The key is recognizing that you're searching game states, not just data structures.

**Intuition**: You're not trying to maximize your score — you're trying to ensure you can win regardless of your opponent's optimal responses. At each turn, you check if there exists any move that puts your opponent in a losing position. Memoization is crucial because game states repeat.

<div class="code-group">

```python
# LeetCode #464: Can I Win
# Time: O(2^n) worst case, but memoization prunes significantly
# Space: O(2^n) for memoization cache
def canIWin(maxChoosableInteger: int, desiredTotal: int) -> bool:
    if desiredTotal <= 0:
        return True

    # Quick check: if sum of all numbers < desiredTotal, impossible
    if maxChoosableInteger * (maxChoosableInteger + 1) // 2 < desiredTotal:
        return False

    memo = {}

    def dfs(remaining, used_mask):
        if remaining <= 0:
            return False  # Previous player won

        if used_mask in memo:
            return memo[used_mask]

        # Try every available number
        for i in range(1, maxChoosableInteger + 1):
            mask = 1 << (i - 1)
            if not (used_mask & mask):  # Number not used yet
                if not dfs(remaining - i, used_mask | mask):
                    # Found a move that makes opponent lose
                    memo[used_mask] = True
                    return True

        memo[used_mask] = False
        return False

    return dfs(desiredTotal, 0)
```

```javascript
// LeetCode #464: Can I Win
// Time: O(2^n) | Space: O(2^n)
function canIWin(maxChoosableInteger, desiredTotal) {
  if (desiredTotal <= 0) return true;

  // Check if total is even achievable
  const sum = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;
  if (sum < desiredTotal) return false;

  const memo = new Map();

  function dfs(remaining, usedMask) {
    if (remaining <= 0) return false;

    if (memo.has(usedMask)) return memo.get(usedMask);

    for (let i = 1; i <= maxChoosableInteger; i++) {
      const mask = 1 << (i - 1);
      if ((usedMask & mask) === 0) {
        if (!dfs(remaining - i, usedMask | mask)) {
          memo.set(usedMask, true);
          return true;
        }
      }
    }

    memo.set(usedMask, false);
    return false;
  }

  return dfs(desiredTotal, 0);
}
```

```java
// LeetCode #464: Can I Win
// Time: O(2^n) | Space: O(2^n)
public boolean canIWin(int maxChoosableInteger, int desiredTotal) {
    if (desiredTotal <= 0) return true;

    // Quick impossibility check
    int sum = maxChoosableInteger * (maxChoosableInteger + 1) / 2;
    if (sum < desiredTotal) return false;

    Map<Integer, Boolean> memo = new HashMap<>();

    return dfs(desiredTotal, 0, maxChoosableInteger, memo);
}

private boolean dfs(int remaining, int usedMask, int maxInt, Map<Integer, Boolean> memo) {
    if (remaining <= 0) return false;

    if (memo.containsKey(usedMask)) return memo.get(usedMask);

    for (int i = 1; i <= maxInt; i++) {
        int mask = 1 << (i - 1);
        if ((usedMask & mask) == 0) {
            if (!dfs(remaining - i, usedMask | mask, maxInt, memo)) {
                memo.put(usedMask, true);
                return true;
            }
        }
    }

    memo.put(usedMask, false);
    return false;
}
```

</div>

**Related Problems**: Can I Win (#464), Predict the Winner (#486), Stone Game II (#1140)

### Pattern 3: Sprague-Grundy Theorem (Impartial Games)

For more complex impartial games (where both players have the same moves), the Sprague-Grundy theorem provides a way to analyze them as Nim heaps. Each game state gets a "Grundy number" (or nimber), and you XOR these numbers like in Nim.

**Intuition**: The Grundy number of a position is the mex (minimum excludant) of the Grundy numbers of all positions reachable from it. A position is losing if its Grundy number is 0. This transforms complex games into Nim, where you XOR all Grundy numbers.

<div class="code-group">

```python
# LeetCode #294: Flip Game II (simplified example pattern)
# Time: O(n * 2^n) with memoization | Space: O(2^n)
def canWin(currentState: str) -> bool:
    memo = {}

    def dfs(state):
        if state in memo:
            return memo[state]

        # Try every possible "++" to flip to "--"
        for i in range(len(state) - 1):
            if state[i:i+2] == "++":
                next_state = state[:i] + "--" + state[i+2:]
                # If opponent cannot win from the resulting state, we win
                if not dfs(next_state):
                    memo[state] = True
                    return True

        memo[state] = False
        return False

    return dfs(currentState)
```

```javascript
// Pattern for impartial games using Grundy numbers
// Time: O(states * moves) | Space: O(states)
function calculateGrundy(position, memo) {
  if (memo.has(position)) return memo.get(position);

  const moves = generateMoves(position);
  const reachableGrundys = new Set();

  for (const move of moves) {
    const nextPosition = applyMove(position, move);
    reachableGrundys.add(calculateGrundy(nextPosition, memo));
  }

  // mex = minimum excludant (smallest non-negative integer not in set)
  let grundy = 0;
  while (reachableGrundys.has(grundy)) {
    grundy++;
  }

  memo.set(position, grundy);
  return grundy;
}

// A position is losing if its Grundy number is 0
function isWinningPosition(positions) {
  let xorSum = 0;
  for (const pos of positions) {
    xorSum ^= calculateGrundy(pos, new Map());
  }
  return xorSum !== 0; // Non-zero means winning position
}
```

```java
// Pattern for Sprague-Grundy analysis
// Time: O(states * moves) | Space: O(states)
public class GrundyCalculator {
    private Map<String, Integer> memo = new HashMap<>();

    public int calculateGrundy(String position) {
        if (memo.containsKey(position)) return memo.get(position);

        Set<Integer> reachable = new HashSet<>();
        List<String> nextPositions = generateMoves(position);

        for (String next : nextPositions) {
            reachable.add(calculateGrundy(next));
        }

        // Find mex (minimum excludant)
        int grundy = 0;
        while (reachable.contains(grundy)) {
            grundy++;
        }

        memo.put(position, grundy);
        return grundy;
    }

    public boolean isWinning(String[] positions) {
        int xorSum = 0;
        for (String pos : positions) {
            xorSum ^= calculateGrundy(pos);
        }
        return xorSum != 0;
    }
}
```

</div>

**Related Problems**: Flip Game II (#294), Stone Game variants with multiple piles

## When to Use Game Theory vs Alternatives

Recognizing a game theory problem is half the battle. Here's my decision framework:

1. **Look for turn-based competition** - If the problem mentions "two players alternate turns," "optimal play," or "guarantee a win," think game theory.

2. **Check for mathematical patterns first** - Before diving into DFS/BFS, ask: "Is there a modulo pattern?" (like Nim), "Is there a parity pattern?" (even/odd moves), or "Is there a symmetry I can exploit?"

3. **Game theory vs DFS/BFS**:
   - Use DFS/BFS when: You need to find a specific path or all possible outcomes
   - Use game theory when: You need to know if you can _force_ a win with optimal play from both sides
   - Key difference: In game theory, your opponent is trying to minimize your chances, not just making random moves

4. **When to use minimax**:
   - The game has a small enough state space (typically < 2^20 states)
   - You need to prove whether a winning strategy exists
   - The game is deterministic (no randomness)

5. **When to use Sprague-Grundy**:
   - Multiple independent game components (like multiple piles in Nim)
   - Both players have identical move options (impartial games)
   - You need to combine analysis of different game elements

## Edge Cases and Gotchas

1. **The "impossible game" edge case**: Always check if the desired total is even achievable with the available numbers (LeetCode #464). I've seen candidates waste 20 minutes on a solution only to realize the game was impossible from the start.

2. **Base case inversion in minimax**: This is the most common bug. Remember: if it's your turn and there are no moves left, _you lose_. If you make a move that immediately wins (remaining ≤ 0), you return True (you won). But in the recursive call, if remaining ≤ 0, the _previous_ player won, so return False.

3. **State representation for memoization**: For games where order doesn't matter (like used numbers in #464), use a bitmask. For games where order matters (like string states in #294), use the string itself. Choosing the wrong representation can blow up your state space.

4. **The "1-item" edge case**: In Nim-like games, always test with 1 item. Can you win if there's only 1 stone and you can take 1-3? (Yes, you take it and win immediately.)

5. **Integer overflow in bitmask**: In Java/C++, using `int` for bitmasks limits you to 32 items. For games with more states, use `long` or `BitSet`.

## Difficulty Breakdown

Looking at the 24 game theory questions on LeetCode:

- **Easy (3, 13%)**: These test basic pattern recognition (like Nim Game #292). Master these first — they're quick wins in interviews.
- **Medium (12, 50%)**: The meat of interview questions. These require minimax with memoization or more advanced pattern recognition. Spend 70% of your time here.
- **Hard (9, 38%)**: Often involve Sprague-Grundy or complex state spaces. Study these last, and focus on understanding the patterns rather than memorizing solutions.

Prioritization strategy: Start with all Easy problems, then do Medium problems by pattern (all Nim-like, then all minimax, etc.). Only attempt Hard problems after you're comfortable with Mediums.

## Which Companies Ask Game Theory

- **Google** (/company/google): Loves "smart" mathematical games. Expect Nim variants and problems requiring insight rather than brute force. They often ask problems that look complex but have O(1) solutions.

- **Amazon** (/company/amazon): Prefers practical-seeming game problems, often related to their business (like optimal bidding or resource allocation games). Expect minimax with memoization.

- **Bloomberg** (/company/bloomberg): Asks game theory less frequently, but when they do, it's usually mathematical pattern recognition rather than coding-heavy solutions.

- **Meta** (/company/meta): Tends toward game theory problems that can be solved with BFS/DFS if you don't see the pattern, but have more elegant solutions if you do. Good company to practice "brute force first, optimize later" approach.

- **Microsoft** (/company/microsoft): Asks classic game theory problems, often with a twist. They love problems where you need to recognize a known game (like Nim) in disguise.

## Study Tips

1. **Learn the patterns, not just problems**: When you solve a game theory problem, ask: "What's the general pattern here?" For example, after solving Nim Game, recognize that any take-away game where you can take 1-k items has losing positions at multiples of (k+1).

2. **Start with brute force, then optimize**: Even if you suspect a mathematical solution, implement the brute force DFS first. This helps you understand the game tree, and you can often add memoization to get an acceptable solution.

3. **Draw small game trees**: For problems with small n (n ≤ 10), manually draw the game tree. This builds intuition for the patterns. I keep a notebook of game trees for common problems.

4. **Recommended problem order**:
   1. Nim Game (#292) - Basic pattern recognition
   2. Divisor Game (#1025) - Mathematical proof
   3. Can I Win (#464) - Minimax with memoization
   4. Predict the Winner (#486) - Another minimax variant
   5. Stone Game II (#1140) - More complex minimax
   6. Flip Game II (#294) - Impartial game pattern

5. **Practice explaining the intuition**: In interviews, you need to explain _why_ your solution works. Practice saying: "This is a losing position because..." or "The first player can always force a win by..."

Remember: Game theory problems test your ability to think strategically, not just code. The interviewer wants to see if you can recognize patterns and think several moves ahead — skills that translate directly to system design and architecture decisions.

[Practice all Game Theory questions on CodeJeet](/topic/game-theory)
