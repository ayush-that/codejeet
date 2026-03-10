---
title: "How to Solve Remove Colored Pieces if Both Neighbors are the Same Color — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Colored Pieces if Both Neighbors are the Same Color. Medium difficulty, 63.0% acceptance rate. Topics: Math, String, Greedy, Game Theory."
date: "2026-07-15"
category: "dsa-patterns"
tags:
  [
    "remove-colored-pieces-if-both-neighbors-are-the-same-color",
    "math",
    "string",
    "greedy",
    "medium",
  ]
---

# How to Solve Remove Colored Pieces if Both Neighbors are the Same Color

This problem presents a two-player game where Alice and Bob alternately remove pieces from a line based on a simple rule: a piece can only be removed if both its neighbors are the same color as itself. The winner is determined by who makes the last move. The tricky part is that this isn't a traditional game theory problem requiring complex recursion—it's actually a counting problem in disguise. The key insight is that moves are independent for each player, and the winner is determined by who has more available moves.

## Visual Walkthrough

Let's trace through an example: `colors = "AAABABB"`

**Step 1: Understanding valid moves**

- A piece at position `i` can be removed if `colors[i-1] == colors[i] == colors[i+1]`
- This means we're looking for three consecutive pieces of the same color

**Step 2: Counting Alice's moves (A pieces)**
Looking at the string `"AAABABB"`:

- Positions 0,1,2: `"AAA"` → Alice can remove the middle 'A' at position 1
- No other triple 'A's exist
- Total Alice moves = 1

**Step 3: Counting Bob's moves (B pieces)**
Looking at the string `"AAABABB"`:

- Positions 3,4,5: `"BAB"` → Not a triple
- Positions 4,5,6: `"ABB"` → Bob can remove the middle 'B' at position 5
- Total Bob moves = 1

**Step 4: Determining the winner**

- Alice moves first
- If Alice has more moves than Bob, she wins
- If Alice has equal or fewer moves than Bob, she loses
- Here: Alice moves = 1, Bob moves = 1 → Alice loses

Wait, let's verify by simulating the game:

1. Alice removes position 1: string becomes `"AABABB"`
2. Bob removes position 4: string becomes `"AABAB"` (positions shift after removal)
3. No more triples exist → Bob made the last move → Bob wins

The counting approach works! The game reduces to comparing counts of removable pieces for each player.

## Brute Force Approach

A naive approach would be to simulate the entire game tree. At each turn:

1. Scan the string to find all valid moves
2. For each possible move, create a new string with that piece removed
3. Recursively explore all possibilities
4. Use minimax to determine the optimal play

This approach has several problems:

- The branching factor can be large (up to n moves per turn)
- The game tree depth is up to n
- Time complexity would be factorial in the worst case
- Even with memoization, the state space is huge (2^n possible strings)

The brute force is completely impractical for n up to 10^5. We need a smarter observation.

## Optimized Approach

The key insight is that **moves are independent for each player**. When Alice removes an 'A', she doesn't affect Bob's potential 'B' moves, and vice versa. Let's break down why:

1. **Move independence**: Removing an 'A' from a triple 'AAA' creates 'AA', which doesn't create new 'B' triples or destroy existing 'B' triples (except at boundaries, which we'll handle).

2. **Counting triples**: For a sequence of k consecutive 'A's:
   - The number of removable 'A's = max(0, k - 2)
   - Example: "AAAA" (k=4) has removable pieces at positions 1 and 2 → 4-2 = 2 moves
   - Example: "AAA" (k=3) has removable piece at position 1 → 3-2 = 1 move
   - Example: "AA" (k=2) has no removable pieces → 2-2 = 0 moves

3. **Boundary conditions**: Pieces at the very beginning or end can never be removed because they don't have two neighbors.

4. **Game theory simplification**: Since moves are independent and players alternate starting with Alice, Alice wins if and only if she has strictly more moves than Bob. If counts are equal, Bob wins because he gets the last move.

## Optimal Solution

We simply count consecutive runs of each color and calculate the number of removable pieces using the formula `max(0, length - 2)` for each run.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def winnerOfGame(colors: str) -> bool:
    """
    Determines if Alice wins the game.
    Alice wins if she has strictly more moves available than Bob.
    """
    alice_moves = 0  # Count of removable 'A' pieces
    bob_moves = 0    # Count of removable 'B' pieces

    n = len(colors)

    # We'll count consecutive runs of the same color
    # Start from index 1 and go to n-2 to check triples
    for i in range(1, n - 1):
        # Check if current piece and both neighbors are the same
        if colors[i-1] == colors[i] == colors[i+1]:
            # If it's 'A', it's a move for Alice
            if colors[i] == 'A':
                alice_moves += 1
            # If it's 'B', it's a move for Bob
            else:
                bob_moves += 1

    # Alice wins if she has strictly more moves than Bob
    return alice_moves > bob_moves
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Determines if Alice wins the game.
 * Alice wins if she has strictly more moves available than Bob.
 * @param {string} colors - String of 'A' and 'B' characters
 * @return {boolean} - True if Alice wins, false otherwise
 */
function winnerOfGame(colors) {
  let aliceMoves = 0; // Count of removable 'A' pieces
  let bobMoves = 0; // Count of removable 'B' pieces

  const n = colors.length;

  // Check each middle position for a valid triple
  for (let i = 1; i < n - 1; i++) {
    // Check if current piece and both neighbors are the same
    if (colors[i - 1] === colors[i] && colors[i] === colors[i + 1]) {
      // Increment the appropriate player's move count
      if (colors[i] === "A") {
        aliceMoves++;
      } else {
        bobMoves++;
      }
    }
  }

  // Alice wins if she has strictly more moves than Bob
  return aliceMoves > bobMoves;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Determines if Alice wins the game.
     * Alice wins if she has strictly more moves available than Bob.
     * @param colors - String of 'A' and 'B' characters
     * @return true if Alice wins, false otherwise
     */
    public boolean winnerOfGame(String colors) {
        int aliceMoves = 0;  // Count of removable 'A' pieces
        int bobMoves = 0;    // Count of removable 'B' pieces

        int n = colors.length();

        // Check each middle position for a valid triple
        for (int i = 1; i < n - 1; i++) {
            // Check if current piece and both neighbors are the same
            if (colors.charAt(i-1) == colors.charAt(i) &&
                colors.charAt(i) == colors.charAt(i+1)) {
                // Increment the appropriate player's move count
                if (colors.charAt(i) == 'A') {
                    aliceMoves++;
                } else {
                    bobMoves++;
                }
            }
        }

        // Alice wins if she has strictly more moves than Bob
        return aliceMoves > bobMoves;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string, checking each position from index 1 to n-2
- Each check involves comparing three characters, which is O(1) work
- Total work is proportional to n, giving us linear time complexity

**Space Complexity: O(1)**

- We only use a constant amount of extra space: two integer counters
- No additional data structures that grow with input size
- The input string is not modified

## Common Mistakes

1. **Off-by-one errors in loop boundaries**:
   - Mistake: Starting loop at i=0 or ending at i=n-1
   - Why it's wrong: Pieces at the ends can never be removed (no two neighbors)
   - Fix: Loop from i=1 to i=n-2 inclusive

2. **Incorrect winner condition**:
   - Mistake: Returning `alice_moves >= bob_moves`
   - Why it's wrong: If moves are equal, Bob wins because he gets the last move
   - Fix: Use strict inequality: `alice_moves > bob_moves`

3. **Overcomplicating with game theory**:
   - Mistake: Trying to implement minimax or recursion
   - Why it's wrong: The problem simplifies to counting due to move independence
   - Fix: Recognize that moves don't interfere with each other

4. **Not handling short strings**:
   - Mistake: Not considering strings shorter than 3 characters
   - Why it's wrong: No moves possible, so Alice loses
   - Fix: Our solution handles this automatically since loop won't execute for n<3

## When You'll See This Pattern

This problem teaches the **"count and compare"** pattern for simplified game theory problems:

1. **Nim Game (LeetCode 292)**: Another game that reduces to a simple modulo check rather than full game tree exploration.

2. **Divisor Game (LeetCode 1025)**: Appears to be a game theory problem but has a simple mathematical solution based on parity.

3. **Stone Game (LeetCode 877)**: While more complex, it also has a mathematical insight that Alice can always win certain configurations.

The common theme is recognizing when a game reduces to a counting or parity problem rather than requiring full game tree analysis. Look for:

- Independent moves that don't affect the opponent's options
- Symmetries in the game state
- Invariants that determine the outcome

## Key Takeaways

1. **Not all game problems need game theory**: Many coding interview game problems have mathematical simplifications. Always look for patterns before implementing complex recursion.

2. **Count consecutive elements**: When dealing with strings or arrays and operations on consecutive elements, counting runs is often the key insight.

3. **Boundaries matter**: Pay close attention to edge cases, especially when operations require neighbors on both sides.

4. **Simplify before coding**: Spend time analyzing the problem structure. Here, the realization that moves are independent transforms an O(n!) problem into O(n).

Related problems: [Longest Subarray With Maximum Bitwise AND](/problem/longest-subarray-with-maximum-bitwise-and)
