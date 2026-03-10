---
title: "How to Solve Stone Game IX — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Stone Game IX. Medium difficulty, 30.0% acceptance rate. Topics: Array, Math, Greedy, Counting, Game Theory."
date: "2026-04-21"
category: "dsa-patterns"
tags: ["stone-game-ix", "array", "math", "greedy", "medium"]
---

# How to Solve Stone Game IX

This problem presents a turn-based game where players remove stones with values, and the game ends when the sum of removed stones is divisible by 3. The twist is that players can only remove stones that haven't been taken yet, and the loser is the player who cannot make a move. The challenge lies in determining whether Alice (who moves first) can force a win given optimal play from both sides. This isn't about finding the maximum sum—it's a **game theory** problem disguised as an array manipulation task.

## Visual Walkthrough

Let's trace through a small example: `stones = [5, 1, 2, 4, 3]`

First, we need to understand the modulo 3 pattern. Each stone's value modulo 3 gives us:

- 5 % 3 = 2
- 1 % 3 = 1
- 2 % 3 = 2
- 4 % 3 = 1
- 3 % 3 = 0

So we have: 0-stones: 1 stone, 1-stones: 2 stones, 2-stones: 2 stones.

The game starts with sum = 0. Players can choose stones with values 0, 1, or 2 mod 3:

- If they pick a 0-stone, sum stays the same modulo 3
- If they pick a 1-stone, sum increases by 1 modulo 3
- If they pick a 2-stone, sum increases by 2 modulo 3 (which is equivalent to decreasing by 1 modulo 3)

The game ends when sum becomes 0 modulo 3 after a move.

Let's simulate optimal play:

1. Alice starts with sum = 0. She could pick a 1-stone (sum becomes 1) or a 2-stone (sum becomes 2). Picking a 0-stone doesn't change the sum, so it's usually saved for later.
2. If Alice picks a 1-stone (sum = 1), Bob must avoid making sum = 0 mod 3. He could pick a 1-stone (sum becomes 2) or a 0-stone (sum stays 1).
3. The game continues with players trying to avoid being the one who makes sum = 0 mod 3.

The key insight is that we can think of this as a **state-based game** where the only thing that matters is:

- How many stones of each modulo class we have
- The current sum modulo 3
- Whose turn it is

## Brute Force Approach

A naive approach would try to simulate all possible sequences of moves using recursion. At each turn, the player could choose any remaining stone, and we'd need to check all permutations of stone selection.

```python
def brute_force(stones):
    # Try all possible move sequences recursively
    # This is exponential and impractical for n > 10
    pass
```

The brute force approach has complexity O(n!) because we're essentially checking all permutations of the stones. Even for n = 20, that's 2.4 × 10¹⁸ operations—completely infeasible.

What makes this problem tricky is that the order matters, but we don't need to track which specific stone was taken, only its value modulo 3 and how many of each type remain.

## Optimized Approach

The key insight is that **only the counts of stones modulo 3 matter**, not their actual values or positions. We can categorize stones into three groups:

- Type 0: stones where value % 3 == 0
- Type 1: stones where value % 3 == 1
- Type 2: stones where value % 3 == 2

Now the game becomes about managing these counts. Here's the step-by-step reasoning:

1. **Type 0 stones are special**: When you take a type 0 stone, the sum modulo 3 doesn't change. This means type 0 stones essentially give a player a "free turn" without affecting the modulo state. They can be used strategically to change who gets to move next in critical situations.

2. **The core game is between type 1 and type 2 stones**: Taking a type 1 stone increases sum by 1 modulo 3, taking a type 2 stone increases sum by 2 modulo 3 (which is -1 modulo 3).

3. **Game state representation**: We can think of the game as starting at sum = 0. Players alternate picking type 1 or type 2 stones, with type 0 stones available as "swap turns" cards.

4. **Winning strategy analysis**:
   - If there are no type 1 and no type 2 stones, Alice loses immediately (no moves)
   - If the difference between type 1 and type 2 counts is 2 or more, the first player has a winning strategy
   - Type 0 stones matter because if their count is even, they cancel out (each player can use them equally). If odd, they give Alice an extra "turn swap"

5. **The actual decision logic**:
   - Alice wins if she can force Bob into a position where he must make the sum divisible by 3
   - This happens when the counts are balanced in a certain way
   - We need to check two scenarios: Alice starting with a type 1 stone, and Alice starting with a type 2 stone

## Optimal Solution

The optimal solution counts stones by their modulo 3 values, then applies game theory logic to determine if Alice can force a win.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def stoneGameIX(stones):
    """
    Determine if Alice can win the stone game with optimal play.

    The key insight is that only stones' values modulo 3 matter.
    We categorize stones into three types:
    - type 0: value % 3 == 0 (doesn't change sum modulo 3)
    - type 1: value % 3 == 1 (adds 1 to sum modulo 3)
    - type 2: value % 3 == 2 (adds 2 to sum modulo 3, equivalent to -1)

    The game ends when a player makes the sum divisible by 3.
    """
    # Step 1: Count stones by their modulo 3 value
    count = [0, 0, 0]
    for stone in stones:
        count[stone % 3] += 1

    # Step 2: Helper function to check if Alice wins when starting with a specific type
    def check(start_type):
        """
        Check if Alice can win when she starts with a stone of given type.
        start_type should be 1 or 2.

        We simulate the optimal play pattern:
        - Type 0 stones can be used to swap turns
        - The sequence alternates between type 1 and type 2 stones
        """
        # Create copies since we'll modify counts during simulation
        c = count.copy()

        # If no stones of the starting type, Alice can't start with it
        if c[start_type] == 0:
            return False

        # Alice takes the first stone
        c[start_type] -= 1
        # sum modulo 3 after Alice's move
        turn = 1  # 0 for Alice, 1 for Bob (Bob's turn now)
        sum_mod = start_type % 3

        # Continue while there are moves
        while True:
            # If sum_mod == 0, the previous player lost
            # But in our simulation, we check before making a move

            # Try to make a move that doesn't make sum_mod become 0
            if sum_mod == 1:
                # Current sum mod 3 is 1
                # Taking type 1 makes sum_mod = 2 (safe)
                # Taking type 2 makes sum_mod = 0 (lose)
                if c[1] > 0:
                    c[1] -= 1
                    sum_mod = 2
                elif c[0] > 0:
                    c[0] -= 1
                    # sum_mod stays 1
                else:
                    # No valid move, current player loses
                    return turn == 1  # Alice wins if it's Bob's turn and he can't move

            elif sum_mod == 2:
                # Current sum mod 3 is 2
                # Taking type 2 makes sum_mod = 1 (safe)
                # Taking type 1 makes sum_mod = 0 (lose)
                if c[2] > 0:
                    c[2] -= 1
                    sum_mod = 1
                elif c[0] > 0:
                    c[0] -= 1
                    # sum_mod stays 2
                else:
                    # No valid move, current player loses
                    return turn == 1  # Alice wins if it's Bob's turn and he can't move

            else:  # sum_mod == 0, should not happen in valid play
                # This means previous player made a losing move
                return turn == 0  # If Alice just made sum_mod 0, she loses

            # Switch turns
            turn = 1 - turn

    # Step 3: Check both possible starting moves for Alice
    # Alice can start with type 1 or type 2 if available
    # If either gives her a winning strategy, she can win
    return check(1) or check(2)
```

```javascript
// Time: O(n) | Space: O(1)
function stoneGameIX(stones) {
  /**
   * Determine if Alice can win the stone game with optimal play.
   *
   * We categorize stones by their modulo 3 value:
   * - type 0: value % 3 === 0 (doesn't change sum modulo 3)
   * - type 1: value % 3 === 1 (adds 1 to sum modulo 3)
   * - type 2: value % 3 === 2 (adds 2 to sum modulo 3, equivalent to -1)
   */

  // Step 1: Count stones by their modulo 3 value
  const count = [0, 0, 0];
  for (const stone of stones) {
    count[stone % 3]++;
  }

  // Step 2: Helper function to check if Alice wins when starting with a specific type
  const check = (startType) => {
    /**
     * Check if Alice can win when she starts with a stone of given type.
     * startType should be 1 or 2.
     */

    // Create copies of counts for simulation
    const c = [...count];

    // If no stones of the starting type, Alice can't start with it
    if (c[startType] === 0) {
      return false;
    }

    // Alice takes the first stone
    c[startType]--;
    let sumMod = startType % 3;
    let turn = 1; // 0 for Alice, 1 for Bob (Bob's turn now)

    // Continue while there are moves
    while (true) {
      if (sumMod === 1) {
        // Current sum mod 3 is 1
        // Taking type 1 makes sumMod = 2 (safe)
        // Taking type 2 makes sumMod = 0 (lose)
        if (c[1] > 0) {
          c[1]--;
          sumMod = 2;
        } else if (c[0] > 0) {
          c[0]--;
          // sumMod stays 1
        } else {
          // No valid move, current player loses
          return turn === 1; // Alice wins if it's Bob's turn
        }
      } else if (sumMod === 2) {
        // Current sum mod 3 is 2
        // Taking type 2 makes sumMod = 1 (safe)
        // Taking type 1 makes sumMod = 0 (lose)
        if (c[2] > 0) {
          c[2]--;
          sumMod = 1;
        } else if (c[0] > 0) {
          c[0]--;
          // sumMod stays 2
        } else {
          // No valid move, current player loses
          return turn === 1; // Alice wins if it's Bob's turn
        }
      } else {
        // sumMod === 0
        // This means previous player made a losing move
        return turn === 0; // If Alice just made sumMod 0, she loses
      }

      // Switch turns
      turn = 1 - turn;
    }
  };

  // Step 3: Check both possible starting moves for Alice
  return check(1) || check(2);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean stoneGameIX(int[] stones) {
        /**
         * Determine if Alice can win the stone game with optimal play.
         *
         * Count stones by modulo 3 categories:
         * - type 0: stones[i] % 3 == 0 (neutral)
         * - type 1: stones[i] % 3 == 1 (adds 1 modulo 3)
         * - type 2: stones[i] % 3 == 2 (adds 2 modulo 3, equivalent to -1)
         */

        // Step 1: Count stones by their modulo 3 value
        int[] count = new int[3];
        for (int stone : stones) {
            count[stone % 3]++;
        }

        // Step 2: Check both possible starting moves for Alice
        return check(count, 1) || check(count, 2);
    }

    private boolean check(int[] count, int startType) {
        /**
         * Check if Alice can win when starting with a stone of given type.
         * startType should be 1 or 2.
         */

        // Create copies for simulation
        int[] c = count.clone();

        // If no stones of the starting type, Alice can't start with it
        if (c[startType] == 0) {
            return false;
        }

        // Alice takes the first stone
        c[startType]--;
        int sumMod = startType % 3;
        int turn = 1; // 0 for Alice, 1 for Bob (Bob's turn now)

        // Continue while there are moves
        while (true) {
            if (sumMod == 1) {
                // Current sum mod 3 is 1
                // Prefer type 1 (makes sumMod = 2, safe)
                if (c[1] > 0) {
                    c[1]--;
                    sumMod = 2;
                } else if (c[0] > 0) {
                    c[0]--;
                    // sumMod stays 1
                } else {
                    // No valid move, current player loses
                    return turn == 1; // Alice wins if it's Bob's turn
                }
            } else if (sumMod == 2) {
                // Current sum mod 3 is 2
                // Prefer type 2 (makes sumMod = 1, safe)
                if (c[2] > 0) {
                    c[2]--;
                    sumMod = 1;
                } else if (c[0] > 0) {
                    c[0]--;
                    // sumMod stays 2
                } else {
                    // No valid move, current player loses
                    return turn == 1; // Alice wins if it's Bob's turn
                }
            } else { // sumMod == 0
                // Previous player made a losing move
                return turn == 0; // If Alice just made sumMod 0, she loses
            }

            // Switch turns
            turn = 1 - turn;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all stones once to count them by modulo 3: O(n)
- The simulation runs in O(n) time in the worst case (each stone used once)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We use a fixed-size array of length 3 to store counts
- The simulation uses constant extra space
- Total: O(1) additional space beyond input

## Common Mistakes

1. **Not recognizing the modulo 3 pattern**: Candidates often try to track actual sums or use DP on stone values, missing the key insight that only the modulo matters.

2. **Forgetting about type 0 stones**: Type 0 stones (values divisible by 3) are special because they don't change the sum modulo 3. They act as "turn swaps" and can change who gets to move next in critical situations.

3. **Incorrect handling of edge cases**:
   - When there are no type 1 or type 2 stones, Alice loses immediately
   - When counts are very small, the simulation needs careful handling
   - Forgetting that Alice can choose to start with either type 1 or type 2 if available

4. **Overcomplicating with full game tree**: Some candidates try to build the complete game tree with memoization, which is O(3^n) and infeasible. The modulo categorization reduces state space dramatically.

## When You'll See This Pattern

This type of problem appears in **combinatorial game theory** and **modulo-based state reduction** problems:

1. **Nim Game (LeetCode 292)**: Also uses game theory with modulo patterns (specifically XOR instead of modulo 3).

2. **Divisor Game (LeetCode 1025)**: Another turn-based game where optimal play can be determined mathematically.

3. **Can I Win (LeetCode 464)**: More complex game theory with state memoization, but shares the "optimal play" analysis.

The pattern to recognize: when a game's state can be reduced to a small set of categories (like modulo classes) rather than tracking all individual elements, you can often find an optimal strategy through mathematical analysis rather than brute force simulation.

## Key Takeaways

1. **Look for state reduction**: When dealing with games or sequences, check if you can categorize elements into a small number of groups (like modulo classes) that capture all relevant information.

2. **Game theory often has mathematical solutions**: For turn-based games with simple rules, there's often an optimal strategy that can be determined through analysis rather than simulation.

3. **Start with small examples**: Tracing through concrete examples (like we did with 5 stones) helps reveal patterns that lead to the optimal solution.

Related problems: [Stone Game](/problem/stone-game), [Stone Game II](/problem/stone-game-ii), [Stone Game III](/problem/stone-game-iii)
