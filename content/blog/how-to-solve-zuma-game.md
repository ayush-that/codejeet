---
title: "How to Solve Zuma Game — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Zuma Game. Hard difficulty, 30.2% acceptance rate. Topics: String, Dynamic Programming, Stack, Breadth-First Search, Memoization."
date: "2029-05-18"
category: "dsa-patterns"
tags: ["zuma-game", "string", "dynamic-programming", "stack", "hard"]
---

# How to Solve Zuma Game

This problem asks you to find the **minimum number of balls** you need to play from your hand to clear all balls from the board in a Zuma-like game. What makes this tricky is that you can insert balls at any position, potentially creating chains of 3+ consecutive identical balls that get removed, which might trigger further removals. The board state changes dynamically, and you need to explore different insertion sequences to find the optimal one.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Board:** "WRRBBW"  
**Hand:** "RB"  
**Goal:** Clear all balls with minimum plays from hand

1. **Initial state:** Board = "WRRBBW", Hand = "RB" (2 balls available)
2. **Option 1:** Insert 'R' after the first 'R' at position 2:
   - Board becomes "WRRRBBW" (inserted 'R' shown in lowercase: "WRrRBBW")
   - "RRR" (positions 2-4) gets removed → "WBBW"
   - No further removals possible
   - Board not cleared, used 1 ball from hand

3. **Option 2:** Insert 'B' after the first 'B' at position 4:
   - Board becomes "WRRBBBW"
   - "BBB" (positions 4-6) gets removed → "WRRW"
   - "RR" (positions 2-3) doesn't have 3 in a row, so no removal
   - Board not cleared, used 1 ball from hand

Neither single insertion clears the board. Let's try sequences:

4. **Sequence:** First insert 'R' at position 2, then insert 'B' at position 3 in the resulting board:
   - After first insertion (as in option 1): "WBBW"
   - Insert 'B' between the two B's: "WBBBW"
   - "BBB" gets removed → "WW"
   - Board not cleared, used 2 balls

5. **Better sequence:** Insert 'R' at position 2, then 'B' at position 4:
   - After first insertion: "WBBW"
   - Insert 'B' after the second B: "WBBB W" (space added for clarity)
   - Actually "WBBB" then "W" → "BBB" gets removed → "WW"
   - Still not cleared

Actually, with hand "RB", it's impossible to clear "WRRBBW". The answer is -1.

This shows why we need systematic exploration: the board changes after each insertion, and removals can cascade.

## Brute Force Approach

A naive approach would try all possible sequences of playing balls from hand:

1. At each step, try inserting each available ball from hand at every possible position on the board
2. After insertion, simulate the removal process (cascading if needed)
3. Recursively continue until board is empty or no balls left in hand
4. Track the minimum number of balls used to clear the board

The problem with this brute force is the explosion of possibilities:

- For a board of length `n` and hand size `m`, at each step you have up to `n+1` positions × `m` ball choices
- The recursion depth could be up to `m` (using all balls)
- This leads to `O((n×m)^m)` time complexity, which is infeasible even for moderate inputs

Additionally, the cascading removals after each insertion make it hard to prune the search space without proper optimization.

## Optimized Approach

The key insight is to use **BFS (Breadth-First Search) with memoization**:

1. **BFS over states**: Each state is defined by (current_board, current_hand). We start from the initial state and explore all possible next states by inserting one ball from hand at any valid position.

2. **Prune with memoization**: Use a visited set to avoid re-exploring the same (board, hand) state. Since hand balls are indistinguishable if they're the same color, we should sort the hand string to treat "RB" and "BR" as the same state.

3. **Optimize insertion positions**: Instead of trying all `n+1` positions, we only need to try positions where inserting a ball would either:
   - Create a group of 3+ identical balls immediately
   - Be adjacent to a ball of the same color (potential future group)

   Actually, for correctness, we should try all positions, but we can optimize by skipping positions between identical balls (inserting 'R' between two 'R's is same as inserting after the first or before the last).

4. **Efficient removal simulation**: After insertion, we need to simulate cascading removals. We can do this with a stack or two-pointer approach that finds and removes groups of 3+ consecutive identical balls repeatedly until no more removals are possible.

5. **Early termination**: If we reach an empty board, we've found a solution. Since BFS explores in increasing depth (number of balls used), the first time we reach empty board gives the minimum balls needed.

6. **Hand representation**: Since balls of the same color in hand are identical, we should use a frequency map or sorted string to avoid duplicate states.

## Optimal Solution

Here's the complete solution using BFS with memoization:

<div class="code-group">

```python
# Time: O((n+m)!/(n!m!)) in worst case, but much better with pruning
# Space: O((n+m)!/(n!m!)) for BFS queue and visited set
from collections import deque
from itertools import groupby

class Solution:
    def findMinStep(self, board: str, hand: str) -> int:
        # Helper function to remove consecutive balls of length >= 3
        def remove_consecutive(s):
            while True:
                new_s = []
                i = 0
                removed = False

                while i < len(s):
                    j = i
                    # Find group of identical consecutive balls
                    while j < len(s) and s[j] == s[i]:
                        j += 1
                    length = j - i

                    # Keep only groups of length < 3
                    if length < 3:
                        new_s.append(s[i:j])
                    else:
                        removed = True
                    i = j

                s = ''.join(new_s)
                if not removed:
                    break
            return s

        # Sort hand to treat different permutations as same state
        hand = ''.join(sorted(hand))

        # BFS queue: (board, hand, steps)
        queue = deque([(board, hand, 0)])
        visited = set([(board, hand)])

        while queue:
            curr_board, curr_hand, steps = queue.popleft()

            # Try inserting each ball from hand at each position
            for i in range(len(curr_board) + 1):
                for j in range(len(curr_hand)):
                    # Skip if same color as previous ball (duplicate insertion point)
                    if i > 0 and curr_board[i-1] == curr_hand[j]:
                        continue

                    # Skip if not using a ball when we have multiple same color
                    if j > 0 and curr_hand[j] == curr_hand[j-1]:
                        continue

                    # Create new board by insertion
                    new_board = curr_board[:i] + curr_hand[j] + curr_board[i:]

                    # Remove consecutive balls of length >= 3 (cascading)
                    new_board = remove_consecutive(new_board)

                    # If board is empty, we found the solution
                    if not new_board:
                        return steps + 1

                    # Create new hand by removing used ball
                    new_hand = curr_hand[:j] + curr_hand[j+1:]

                    # Sort hand to maintain canonical representation
                    new_hand = ''.join(sorted(new_hand))

                    # Skip if state already visited
                    if (new_board, new_hand) in visited:
                        continue

                    # Add to queue and visited set
                    visited.add((new_board, new_hand))
                    queue.append((new_board, new_hand, steps + 1))

        # No solution found
        return -1
```

```javascript
// Time: O((n+m)!/(n!m!)) in worst case, but much better with pruning
// Space: O((n+m)!/(n!m!)) for BFS queue and visited set
/**
 * @param {string} board
 * @param {string} hand
 * @return {number}
 */
var findMinStep = function (board, hand) {
  // Helper function to remove consecutive balls of length >= 3
  const removeConsecutive = (s) => {
    while (true) {
      let newS = "";
      let i = 0;
      let removed = false;

      while (i < s.length) {
        let j = i;
        // Find group of identical consecutive balls
        while (j < s.length && s[j] === s[i]) {
          j++;
        }
        const length = j - i;

        // Keep only groups of length < 3
        if (length < 3) {
          newS += s.substring(i, j);
        } else {
          removed = true;
        }
        i = j;
      }

      s = newS;
      if (!removed) {
        break;
      }
    }
    return s;
  };

  // Sort hand to treat different permutations as same state
  hand = hand.split("").sort().join("");

  // BFS queue: [board, hand, steps]
  const queue = [[board, hand, 0]];
  const visited = new Set();
  visited.add(`${board}|${hand}`);

  while (queue.length > 0) {
    const [currBoard, currHand, steps] = queue.shift();

    // Try inserting each ball from hand at each position
    for (let i = 0; i <= currBoard.length; i++) {
      for (let j = 0; j < currHand.length; j++) {
        // Skip if same color as previous ball (duplicate insertion point)
        if (i > 0 && currBoard[i - 1] === currHand[j]) {
          continue;
        }

        // Skip if not using a ball when we have multiple same color
        if (j > 0 && currHand[j] === currHand[j - 1]) {
          continue;
        }

        // Create new board by insertion
        let newBoard = currBoard.slice(0, i) + currHand[j] + currBoard.slice(i);

        // Remove consecutive balls of length >= 3 (cascading)
        newBoard = removeConsecutive(newBoard);

        // If board is empty, we found the solution
        if (newBoard.length === 0) {
          return steps + 1;
        }

        // Create new hand by removing used ball
        const newHand = currHand.slice(0, j) + currHand.slice(j + 1);

        // Sort hand to maintain canonical representation
        const sortedNewHand = newHand.split("").sort().join("");

        // Skip if state already visited
        const stateKey = `${newBoard}|${sortedNewHand}`;
        if (visited.has(stateKey)) {
          continue;
        }

        // Add to queue and visited set
        visited.add(stateKey);
        queue.push([newBoard, sortedNewHand, steps + 1]);
      }
    }
  }

  // No solution found
  return -1;
};
```

```java
// Time: O((n+m)!/(n!m!)) in worst case, but much better with pruning
// Space: O((n+m)!/(n!m!)) for BFS queue and visited set
import java.util.*;

class Solution {
    public int findMinStep(String board, String hand) {
        // Sort hand to treat different permutations as same state
        char[] handArr = hand.toCharArray();
        Arrays.sort(handArr);
        hand = new String(handArr);

        // BFS queue: each element is [board, hand, steps]
        Queue<String[]> queue = new LinkedList<>();
        queue.offer(new String[]{board, hand, "0"});

        // Visited set to avoid duplicate states
        Set<String> visited = new HashSet<>();
        visited.add(board + "|" + hand);

        while (!queue.isEmpty()) {
            String[] current = queue.poll();
            String currBoard = current[0];
            String currHand = current[1];
            int steps = Integer.parseInt(current[2]);

            // Try inserting each ball from hand at each position
            for (int i = 0; i <= currBoard.length(); i++) {
                for (int j = 0; j < currHand.length(); j++) {
                    // Skip if same color as previous ball (duplicate insertion point)
                    if (i > 0 && currBoard.charAt(i - 1) == currHand.charAt(j)) {
                        continue;
                    }

                    // Skip if not using a ball when we have multiple same color
                    if (j > 0 && currHand.charAt(j) == currHand.charAt(j - 1)) {
                        continue;
                    }

                    // Create new board by insertion
                    StringBuilder newBoard = new StringBuilder();
                    newBoard.append(currBoard.substring(0, i));
                    newBoard.append(currHand.charAt(j));
                    newBoard.append(currBoard.substring(i));

                    // Remove consecutive balls of length >= 3 (cascading)
                    String simplifiedBoard = removeConsecutive(newBoard.toString());

                    // If board is empty, we found the solution
                    if (simplifiedBoard.isEmpty()) {
                        return steps + 1;
                    }

                    // Create new hand by removing used ball
                    StringBuilder newHand = new StringBuilder();
                    newHand.append(currHand.substring(0, j));
                    newHand.append(currHand.substring(j + 1));

                    // Sort hand to maintain canonical representation
                    char[] newHandArr = newHand.toString().toCharArray();
                    Arrays.sort(newHandArr);
                    String sortedNewHand = new String(newHandArr);

                    // Skip if state already visited
                    String stateKey = simplifiedBoard + "|" + sortedNewHand;
                    if (visited.contains(stateKey)) {
                        continue;
                    }

                    // Add to queue and visited set
                    visited.add(stateKey);
                    queue.offer(new String[]{simplifiedBoard, sortedNewHand, String.valueOf(steps + 1)});
                }
            }
        }

        // No solution found
        return -1;
    }

    // Helper function to remove consecutive balls of length >= 3
    private String removeConsecutive(String s) {
        while (true) {
            StringBuilder result = new StringBuilder();
            int i = 0;
            boolean removed = false;

            while (i < s.length()) {
                int j = i;
                // Find group of identical consecutive balls
                while (j < s.length() && s.charAt(j) == s.charAt(i)) {
                    j++;
                }
                int length = j - i;

                // Keep only groups of length < 3
                if (length < 3) {
                    result.append(s.substring(i, j));
                } else {
                    removed = true;
                }
                i = j;
            }

            s = result.toString();
            if (!removed) {
                break;
            }
        }
        return s;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** In the worst case, we explore all possible states. The number of states is bounded by the number of ways to distribute `m` balls into `n+1` positions, which is `O((n+m)!/(n!m!))`. However, with pruning (skipping duplicate insertion points, using visited set, and early termination), the actual runtime is much better in practice. The removal simulation takes `O(n)` per state.

**Space Complexity:** We store visited states and the BFS queue. In worst case, this could be `O((n+m)!/(n!m!))` states, each storing strings of length up to `n+m`.

## Common Mistakes

1. **Not handling cascading removals correctly**: After inserting a ball and removing a group of 3+, you must check if new groups of 3+ form and remove them repeatedly. Some candidates only do one pass of removal.

2. **Forgetting to sort the hand string**: Balls of the same color are identical, so "RB" and "BR" should be treated as the same state. Without sorting, you'll explore duplicate states and potentially exceed time/memory limits.

3. **Trying to use DFS instead of BFS**: DFS won't guarantee finding the minimum number of balls. You need BFS to explore all possibilities with increasing depth (number of balls used).

4. **Not pruning insertion positions**: Trying all `n+1` positions for each ball is correct but less efficient. You can optimize by skipping positions between identical balls since inserting 'R' between two 'R's is equivalent to inserting after the first or before the last.

## When You'll See This Pattern

This BFS-over-states pattern appears in problems where:

1. You have an initial state and need to reach a goal state
2. Each move transforms the state in a non-trivial way
3. You need to find the minimum number of moves

Related LeetCode problems:

- **752. Open the Lock**: BFS over lock combinations (0000 to 9999)
- **773. Sliding Puzzle**: BFS over board configurations of sliding puzzle
- **127. Word Ladder**: BFS over word transformations

These all involve exploring a state space where each state leads to multiple next states, and BFS finds the shortest path to the goal.

## Key Takeaways

1. **BFS is for shortest path in state space**: When you need the minimum number of moves/operations to reach a goal state, and each operation transforms the current state, BFS over states is often the right approach.

2. **Memoization is crucial for state exploration**: Use a visited set to avoid re-exploring the same state. For states with interchangeable elements (like balls of same color), canonicalize the representation (e.g., by sorting).

3. **Simulate state transitions carefully**: In this problem, the cascading removal after insertion is subtle. Always trace through examples to ensure your simulation matches the problem rules.

[Practice this problem on CodeJeet](/problem/zuma-game)
