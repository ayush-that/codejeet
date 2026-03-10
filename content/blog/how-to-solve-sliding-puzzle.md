---
title: "How to Solve Sliding Puzzle — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sliding Puzzle. Hard difficulty, 74.2% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Breadth-First Search, Memoization."
date: "2028-10-25"
category: "dsa-patterns"
tags: ["sliding-puzzle", "array", "dynamic-programming", "backtracking", "hard"]
---

# How to Solve Sliding Puzzle

You're given a 2×3 sliding puzzle board where one empty square (0) can swap with adjacent numbered tiles (1-5). Your goal is to find the minimum number of moves to reach the solved state `[[1,2,3],[4,5,0]]`. What makes this problem interesting is that it's essentially a shortest-path search through a space of possible board configurations, disguised as a puzzle game.

## Visual Walkthrough

Let's trace through an example: `[[4,1,2],[5,0,3]]`

**Step 1:** The empty square (0) is at position (1,1) - second row, second column. It can swap with:

- Left: 5 at (1,0) → `[[4,1,2],[0,5,3]]`
- Up: 1 at (0,1) → `[[4,0,2],[5,1,3]]`
- Right: 3 at (1,2) → `[[4,1,2],[5,3,0]]`

**Step 2:** From `[[4,1,2],[5,0,3]]`, if we swap with 5 (left), we get `[[4,1,2],[0,5,3]]`. Now 0 is at (1,0) and can swap with:

- Right: 5 at (1,1) → back to starting position
- Up: 4 at (0,0) → `[[0,1,2],[4,5,3]]`

**Step 3:** Continuing this way, we'd eventually reach `[[1,2,3],[4,5,0]]`. The challenge is finding the shortest sequence of such swaps.

## Brute Force Approach

A naive approach might try random swaps or depth-first search, but these would be extremely inefficient. The brute force equivalent would be exploring all possible board states without any guidance, which is essentially what we need to do systematically.

The problem with a completely naive approach:

1. **No direction:** Random swapping might never reach the solution
2. **Infinite loops:** Could get stuck in cycles
3. **No optimality guarantee:** Even if we find a solution, it might not be the shortest path

What we need is a systematic way to explore all possible states while avoiding repetition and finding the shortest path.

## Optimized Approach

The key insight is to treat this as a **shortest path problem** in a graph:

- **Nodes:** Each possible board configuration
- **Edges:** A single swap between 0 and an adjacent tile
- **Start node:** The given board configuration
- **Target node:** `[[1,2,3],[4,5,0]]`

**BFS (Breadth-First Search)** is perfect for this because:

1. It explores all states level by level
2. The first time we reach the target, we've found the shortest path
3. It naturally avoids cycles by tracking visited states

**Step-by-step reasoning:**

1. Convert the 2D board to a string for easier hashing and comparison
2. Use a queue for BFS, storing (board_state, moves_count)
3. For each state, find where '0' is located
4. Generate all possible next states by swapping 0 with valid neighbors
5. Skip states we've already seen to avoid cycles
6. Stop when we reach the target state

**Why BFS over DFS?** BFS guarantees the shortest path in an unweighted graph. DFS might find a solution faster but not necessarily the shortest one.

## Optimal Solution

<div class="code-group">

```python
# Time: O((m*n)!) worst case, but practically O(m*n * (m*n)!) | Space: O((m*n)!)
# where m=2, n=3 for this specific problem
def slidingPuzzle(board):
    """
    Solve the 2x3 sliding puzzle using BFS.

    Approach:
    1. Convert board to string for easy hashing
    2. Use BFS to explore all possible states
    3. Track visited states to avoid cycles
    4. Return minimum moves when target is reached
    """
    # Target state as a string for easy comparison
    target = "123450"

    # Convert 2D board to 1D string representation
    start = ""
    for i in range(2):
        for j in range(3):
            start += str(board[i][j])

    # If we're already at the target, return 0 moves
    if start == target:
        return 0

    # BFS initialization
    queue = [(start, 0)]  # (current_state, moves_count)
    visited = set([start])

    # Define possible moves for each position (0-indexed)
    # For a 2x3 board, positions: 0 1 2
    #                          3 4 5
    moves_map = {
        0: [1, 3],      # Top-left: can swap with right and down
        1: [0, 2, 4],   # Top-middle: left, right, down
        2: [1, 5],      # Top-right: left, down
        3: [0, 4],      # Bottom-left: up, right
        4: [1, 3, 5],   # Bottom-middle: left, up, right
        5: [2, 4]       # Bottom-right: left, up
    }

    while queue:
        current_state, moves = queue.pop(0)

        # Find position of '0' (empty square)
        zero_pos = current_state.index('0')

        # Try all possible swaps from current position
        for swap_pos in moves_map[zero_pos]:
            # Convert string to list for swapping
            state_list = list(current_state)

            # Swap 0 with adjacent tile
            state_list[zero_pos], state_list[swap_pos] = state_list[swap_pos], state_list[zero_pos]

            # Convert back to string
            new_state = "".join(state_list)

            # Check if we've reached the target
            if new_state == target:
                return moves + 1

            # If not visited, add to queue
            if new_state not in visited:
                visited.add(new_state)
                queue.append((new_state, moves + 1))

    # If BFS completes without finding target, puzzle is unsolvable
    return -1
```

```javascript
// Time: O((m*n)!) worst case, but practically O(m*n * (m*n)!) | Space: O((m*n)!)
// where m=2, n=3 for this specific problem
function slidingPuzzle(board) {
  /**
   * Solve the 2x3 sliding puzzle using BFS.
   *
   * Approach:
   * 1. Convert board to string for easy hashing
   * 2. Use BFS to explore all possible states
   * 3. Track visited states to avoid cycles
   * 4. Return minimum moves when target is reached
   */

  // Target state as a string for easy comparison
  const target = "123450";

  // Convert 2D board to 1D string representation
  let start = "";
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 3; j++) {
      start += board[i][j].toString();
    }
  }

  // If we're already at the target, return 0 moves
  if (start === target) {
    return 0;
  }

  // BFS initialization
  const queue = [[start, 0]]; // [current_state, moves_count]
  const visited = new Set([start]);

  // Define possible moves for each position (0-indexed)
  // For a 2x3 board, positions: 0 1 2
  //                          3 4 5
  const movesMap = {
    0: [1, 3], // Top-left: can swap with right and down
    1: [0, 2, 4], // Top-middle: left, right, down
    2: [1, 5], // Top-right: left, down
    3: [0, 4], // Bottom-left: up, right
    4: [1, 3, 5], // Bottom-middle: left, up, right
    5: [2, 4], // Bottom-right: left, up
  };

  while (queue.length > 0) {
    const [currentState, moves] = queue.shift();

    // Find position of '0' (empty square)
    const zeroPos = currentState.indexOf("0");

    // Try all possible swaps from current position
    for (const swapPos of movesMap[zeroPos]) {
      // Convert string to array for swapping
      const stateArray = currentState.split("");

      // Swap 0 with adjacent tile
      [stateArray[zeroPos], stateArray[swapPos]] = [stateArray[swapPos], stateArray[zeroPos]];

      // Convert back to string
      const newState = stateArray.join("");

      // Check if we've reached the target
      if (newState === target) {
        return moves + 1;
      }

      // If not visited, add to queue
      if (!visited.has(newState)) {
        visited.add(newState);
        queue.push([newState, moves + 1]);
      }
    }
  }

  // If BFS completes without finding target, puzzle is unsolvable
  return -1;
}
```

```java
// Time: O((m*n)!) worst case, but practically O(m*n * (m*n)!) | Space: O((m*n)!)
// where m=2, n=3 for this specific problem
import java.util.*;

class Solution {
    public int slidingPuzzle(int[][] board) {
        /**
         * Solve the 2x3 sliding puzzle using BFS.
         *
         * Approach:
         * 1. Convert board to string for easy hashing
         * 2. Use BFS to explore all possible states
         * 3. Track visited states to avoid cycles
         * 4. Return minimum moves when target is reached
         */

        // Target state as a string for easy comparison
        String target = "123450";

        // Convert 2D board to 1D string representation
        StringBuilder startBuilder = new StringBuilder();
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 3; j++) {
                startBuilder.append(board[i][j]);
            }
        }
        String start = startBuilder.toString();

        // If we're already at the target, return 0 moves
        if (start.equals(target)) {
            return 0;
        }

        // BFS initialization
        Queue<State> queue = new LinkedList<>();
        queue.offer(new State(start, 0));
        Set<String> visited = new HashSet<>();
        visited.add(start);

        // Define possible moves for each position (0-indexed)
        // For a 2x3 board, positions: 0 1 2
        //                          3 4 5
        int[][] movesMap = {
            {1, 3},      // Position 0: can swap with 1 and 3
            {0, 2, 4},   // Position 1: can swap with 0, 2, and 4
            {1, 5},      // Position 2: can swap with 1 and 5
            {0, 4},      // Position 3: can swap with 0 and 4
            {1, 3, 5},   // Position 4: can swap with 1, 3, and 5
            {2, 4}       // Position 5: can swap with 2 and 4
        };

        while (!queue.isEmpty()) {
            State current = queue.poll();
            String currentState = current.state;
            int moves = current.moves;

            // Find position of '0' (empty square)
            int zeroPos = currentState.indexOf('0');

            // Try all possible swaps from current position
            for (int swapPos : movesMap[zeroPos]) {
                // Convert string to char array for swapping
                char[] stateArray = currentState.toCharArray();

                // Swap 0 with adjacent tile
                char temp = stateArray[zeroPos];
                stateArray[zeroPos] = stateArray[swapPos];
                stateArray[swapPos] = temp;

                // Convert back to string
                String newState = new String(stateArray);

                // Check if we've reached the target
                if (newState.equals(target)) {
                    return moves + 1;
                }

                // If not visited, add to queue
                if (!visited.contains(newState)) {
                    visited.add(newState);
                    queue.offer(new State(newState, moves + 1));
                }
            }
        }

        // If BFS completes without finding target, puzzle is unsolvable
        return -1;
    }

    // Helper class to store state and move count together
    class State {
        String state;
        int moves;

        State(String state, int moves) {
            this.state = state;
            this.moves = moves;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((m×n)! × m×n) in worst case, but practically much less

- There are (m×n)! possible permutations of the board (6! = 720 for 2×3)
- For each state, we check up to 4 neighbors (constant)
- The string operations are O(m×n) = O(6) = constant
- In practice, we explore far fewer than all permutations

**Space Complexity:** O((m×n)!)

- We store visited states in a set
- The queue can hold many states in the worst case
- For 2×3, maximum 720 states, which is manageable

## Common Mistakes

1. **Not tracking visited states:** This leads to infinite loops as you can revisit the same state multiple times. Always use a visited set in BFS for state space search.

2. **Using DFS instead of BFS:** DFS might find a solution but not the shortest one. BFS is essential for finding minimum moves in an unweighted graph.

3. **Inefficient state representation:** Comparing 2D arrays directly is slow. Converting to strings makes hashing and comparison efficient.

4. **Forgetting the unsolvable case:** Some puzzles are unsolvable. Always handle the case where BFS completes without finding the target by returning -1.

5. **Incorrect neighbor calculation:** Hardcoding neighbor positions incorrectly for edge/corner cases. Using a moves map ensures correct adjacency.

## When You'll See This Pattern

This BFS state-space search pattern appears in many problems:

1. **Word Ladder (LeetCode 127):** Find shortest transformation sequence between words, where each step changes one letter. Similar BFS through possible word states.

2. **Open the Lock (LeetCode 752):** Find minimum turns to reach target combination on a lock. Each dial can be turned up or down, creating a similar state space.

3. **Minimum Genetic Mutation (LeetCode 433):** Similar to Word Ladder but with genetic sequences.

4. **K Similar Strings (LeetCode 854):** Find minimum swaps to make strings anagrams, though this uses more advanced techniques.

The common thread: **You have a start state, a target state, and defined transitions between states. Find the shortest path.**

## Key Takeaways

1. **State-space problems are graph problems:** When you need to find the shortest path between configurations with defined transitions, think BFS on a graph where nodes are states and edges are valid moves.

2. **String representation is your friend:** For board/grid problems, converting to strings makes hashing, comparison, and storage much more efficient than multi-dimensional arrays.

3. **BFS guarantees shortest path in unweighted graphs:** When moves have equal cost (like single swaps), BFS level-order traversal ensures the first time you reach the target is via the shortest path.

4. **Always track visited states:** In state-space search, cycles are common. A visited set prevents exponential blowup and infinite loops.

[Practice this problem on CodeJeet](/problem/sliding-puzzle)
