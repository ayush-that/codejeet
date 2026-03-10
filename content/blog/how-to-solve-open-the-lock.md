---
title: "How to Solve Open the Lock — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Open the Lock. Medium difficulty, 61.2% acceptance rate. Topics: Array, Hash Table, String, Breadth-First Search."
date: "2027-08-04"
category: "dsa-patterns"
tags: ["open-the-lock", "array", "hash-table", "string", "medium"]
---

# How to Solve Open the Lock

You're given a 4-digit combination lock where each digit can be rotated forward or backward, with wrap-around (9 goes to 0 and vice versa). You start at "0000" and need to reach a target combination, but certain combinations are "deadends" that you cannot use. The challenge is finding the minimum number of wheel turns to reach the target without hitting any deadends. What makes this problem interesting is that it's essentially a shortest path problem in a graph where each node is a lock state and edges connect states that differ by one wheel turn.

## Visual Walkthrough

Let's trace through a small example: `deadends = ["0201","0101","0102","1212","2002"]`, `target = "0202"`

We start at "0000" and want to reach "0202" with the fewest moves. Each move means turning one wheel one position forward or backward.

**Step 1:** From "0000", we can generate 8 possible moves:

- Turn wheel 1: "1000" (forward) or "9000" (backward)
- Turn wheel 2: "0100" or "0900"
- Turn wheel 3: "0010" or "0090"
- Turn wheel 4: "0001" or "0009"

**Step 2:** Check which moves are valid. "0100" is not a deadend, so we can explore it. "0900" is also valid. We continue this BFS process.

**Step 3:** From "0100", we generate its neighbors. One neighbor is "0200", which leads us closer to "0202".

**Step 4:** Eventually, we'll find the shortest path: "0000" → "0100" → "0200" → "0201" → "0202" (4 moves). Wait, "0201" is a deadend! So that path is blocked.

**Step 5:** We need to find an alternative path. Let's try: "0000" → "1000" → "1100" → ... This demonstrates why we need systematic exploration (BFS) to find the shortest valid path.

## Brute Force Approach

A naive approach might try to randomly explore paths or use DFS, but these would be inefficient and wouldn't guarantee the shortest path. The brute force equivalent would be to generate all possible sequences of moves up to a certain length and check if any reach the target without hitting deadends. This is exponential in the number of moves and completely impractical.

For a 4-digit lock with 10 possibilities per digit, there are 10,000 possible states. Checking all sequences of length L would require examining up to 8^L possibilities (since each state has up to 8 neighbors). Even for modest L=6, that's 262,144 possibilities to check, and the shortest path might be much longer.

The key insight is that this is a **shortest path problem in an unweighted graph**, which calls for **Breadth-First Search (BFS)**. BFS guarantees we find the shortest path because it explores all nodes at distance d before moving to distance d+1.

## Optimized Approach

The optimal solution uses BFS with careful handling of deadends and visited states:

1. **Model as a graph**: Each lock state (e.g., "1234") is a node. Two nodes are connected if they differ by exactly one digit, and that digit differs by 1 (with wrap-around).

2. **BFS for shortest path**: Starting from "0000", use BFS to explore all reachable states. The first time we reach the target, we've found the minimum moves.

3. **Avoid deadends**: Treat deadends as blocked nodes - we never enqueue them for exploration.

4. **Track visited states**: Use a set to avoid revisiting states, which prevents infinite loops.

5. **Generate neighbors efficiently**: For each of the 4 wheels, generate two new states: one by incrementing the digit (with wrap-around from 9 to 0) and one by decrementing (with wrap-around from 0 to 9).

The BFS approach is optimal because:

- It explores the state space level by level
- Each level represents all states reachable in exactly n moves
- When we first encounter the target, we know it's the minimum moves needed

## Optimal Solution

<div class="code-group">

```python
# Time: O(10^4 * 4 * 2) = O(1) since state space is fixed
# Space: O(10^4) for visited/deadends sets
from collections import deque

def openLock(deadends, target):
    """
    Find minimum turns to reach target from "0000" avoiding deadends.

    Args:
        deadends: List of strings representing forbidden combinations
        target: String representing the target combination

    Returns:
        Minimum number of moves, or -1 if target is unreachable
    """
    # Convert deadends to a set for O(1) lookup
    deadends_set = set(deadends)

    # If starting point is a deadend, we can't even begin
    if "0000" in deadends_set:
        return -1

    # If target is the starting point, no moves needed
    if target == "0000":
        return 0

    # BFS initialization
    queue = deque()
    visited = set()

    # Start from initial state "0000" with 0 moves
    queue.append(("0000", 0))
    visited.add("0000")

    # BFS loop
    while queue:
        current, moves = queue.popleft()

        # Generate all possible next states
        for i in range(4):  # For each of the 4 wheels
            # Convert string to list for character manipulation
            current_list = list(current)

            # Move wheel i forward (increment with wrap-around)
            forward_digit = str((int(current[i]) + 1) % 10)
            current_list[i] = forward_digit
            forward_state = "".join(current_list)

            # If we found the target, return moves + 1
            if forward_state == target:
                return moves + 1

            # Add to queue if not visited and not a deadend
            if forward_state not in visited and forward_state not in deadends_set:
                visited.add(forward_state)
                queue.append((forward_state, moves + 1))

            # Move wheel i backward (decrement with wrap-around)
            backward_digit = str((int(current[i]) - 1) % 10)
            # Python's modulo with negative numbers gives positive result
            # but we need to handle wrap from 0 to 9
            if backward_digit == "-1":
                backward_digit = "9"
            current_list[i] = backward_digit
            backward_state = "".join(current_list)

            # If we found the target, return moves + 1
            if backward_state == target:
                return moves + 1

            # Add to queue if not visited and not a deadend
            if backward_state not in visited and backward_state not in deadends_set:
                visited.add(backward_state)
                queue.append((backward_state, moves + 1))

    # If BFS completes without finding target, it's unreachable
    return -1
```

```javascript
// Time: O(10^4 * 4 * 2) = O(1) since state space is fixed
// Space: O(10^4) for visited/deadends sets
function openLock(deadends, target) {
  /**
   * Find minimum turns to reach target from "0000" avoiding deadends.
   *
   * @param {string[]} deadends - Array of forbidden combinations
   * @param {string} target - Target combination
   * @return {number} Minimum moves, or -1 if unreachable
   */

  // Convert deadends to a Set for O(1) lookup
  const deadendsSet = new Set(deadends);

  // If starting point is a deadend, can't even begin
  if (deadendsSet.has("0000")) {
    return -1;
  }

  // If target is already the starting point
  if (target === "0000") {
    return 0;
  }

  // BFS initialization
  const queue = [];
  const visited = new Set();

  // Start from initial state with 0 moves
  queue.push(["0000", 0]);
  visited.add("0000");

  // BFS loop
  while (queue.length > 0) {
    const [current, moves] = queue.shift();

    // Generate all possible next states
    for (let i = 0; i < 4; i++) {
      // Convert string to array for character manipulation
      const currentArray = current.split("");

      // Move wheel i forward (increment with wrap-around)
      const forwardDigit = (parseInt(current[i]) + 1) % 10;
      currentArray[i] = forwardDigit.toString();
      const forwardState = currentArray.join("");

      // Check if we found the target
      if (forwardState === target) {
        return moves + 1;
      }

      // Add to queue if valid
      if (!visited.has(forwardState) && !deadendsSet.has(forwardState)) {
        visited.add(forwardState);
        queue.push([forwardState, moves + 1]);
      }

      // Move wheel i backward (decrement with wrap-around)
      let backwardDigit = (parseInt(current[i]) - 1) % 10;
      // Handle wrap from 0 to 9
      if (backwardDigit < 0) {
        backwardDigit += 10;
      }
      currentArray[i] = backwardDigit.toString();
      const backwardState = currentArray.join("");

      // Check if we found the target
      if (backwardState === target) {
        return moves + 1;
      }

      // Add to queue if valid
      if (!visited.has(backwardState) && !deadendsSet.has(backwardState)) {
        visited.add(backwardState);
        queue.push([backwardState, moves + 1]);
      }
    }
  }

  // Target unreachable
  return -1;
}
```

```java
// Time: O(10^4 * 4 * 2) = O(1) since state space is fixed
// Space: O(10^4) for visited/deadends sets
import java.util.*;

class Solution {
    public int openLock(String[] deadends, String target) {
        /**
         * Find minimum turns to reach target from "0000" avoiding deadends.
         *
         * @param deadends Array of forbidden combinations
         * @param target Target combination
         * @return Minimum moves, or -1 if unreachable
         */

        // Convert deadends to a Set for O(1) lookup
        Set<String> deadendsSet = new HashSet<>(Arrays.asList(deadends));

        // If starting point is a deadend, can't even begin
        if (deadendsSet.contains("0000")) {
            return -1;
        }

        // If target is already the starting point
        if (target.equals("0000")) {
            return 0;
        }

        // BFS initialization
        Queue<String[]> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();

        // Start from initial state with 0 moves
        queue.offer(new String[]{"0000", "0"});
        visited.add("0000");

        // BFS loop
        while (!queue.isEmpty()) {
            String[] currentPair = queue.poll();
            String current = currentPair[0];
            int moves = Integer.parseInt(currentPair[1]);

            // Generate all possible next states
            for (int i = 0; i < 4; i++) {
                char[] currentArray = current.toCharArray();

                // Move wheel i forward (increment with wrap-around)
                char forwardDigit = (char)(((currentArray[i] - '0' + 1) % 10) + '0');
                currentArray[i] = forwardDigit;
                String forwardState = new String(currentArray);

                // Check if we found the target
                if (forwardState.equals(target)) {
                    return moves + 1;
                }

                // Add to queue if valid
                if (!visited.contains(forwardState) && !deadendsSet.contains(forwardState)) {
                    visited.add(forwardState);
                    queue.offer(new String[]{forwardState, String.valueOf(moves + 1)});
                }

                // Move wheel i backward (decrement with wrap-around)
                char backwardDigit = (char)(((currentArray[i] - '0' - 1 + 10) % 10) + '0');
                currentArray[i] = backwardDigit;
                String backwardState = new String(currentArray);

                // Check if we found the target
                if (backwardState.equals(target)) {
                    return moves + 1;
                }

                // Add to queue if valid
                if (!visited.contains(backwardState) && !deadendsSet.contains(backwardState)) {
                    visited.add(backwardState);
                    queue.offer(new String[]{backwardState, String.valueOf(moves + 1)});
                }
            }
        }

        // Target unreachable
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) in practice, O(N _ D _ 8) in theory where:

- N is the number of possible states (10^4 = 10,000 for 4 wheels with 10 digits each)
- D is the number of digits (4)
- 8 comes from generating 2 neighbors for each of 4 wheels

Since the state space is fixed at 10,000 states, and we process each state at most once, the time complexity is effectively constant. In the worst case, we might explore all 10,000 states.

**Space Complexity:** O(N) where N is the number of possible states (10,000). We need to store:

- The visited set (up to 10,000 elements)
- The deadends set (up to 10,000 elements)
- The BFS queue (up to 10,000 elements in worst case)

## Common Mistakes

1. **Forgetting to check if "0000" is a deadend**: If the starting position is in deadends, we should immediately return -1. Candidates often miss this edge case.

2. **Not handling wrap-around correctly**: When decrementing 0, it should wrap to 9, not -1. The modulo operation needs careful handling with negative numbers in some languages.

3. **Using DFS instead of BFS**: DFS won't guarantee the shortest path. This is a classic BFS problem for finding minimum moves in an unweighted graph.

4. **Not tracking visited states**: Without a visited set, you'll get infinite loops as you revisit the same states repeatedly.

5. **Inefficient deadend lookup**: Using a list for deadends gives O(n) lookup time. Always convert to a set for O(1) lookups.

## When You'll See This Pattern

This BFS pattern for shortest path in an implicit graph appears in many problems:

1. **Word Ladder (LeetCode 127)**: Similar concept but with words instead of lock combinations. Each word is a node, and edges connect words that differ by one letter.

2. **Minimum Genetic Mutation (LeetCode 433)**: Exactly the same pattern but with DNA sequences (A, C, G, T) instead of digits.

3. **Sliding Puzzle (LeetCode 773)**: Finding minimum moves to solve a puzzle, where each state is a board configuration and moves are valid slides.

4. **Reachable Nodes With Restrictions (LeetCode 2368)**: BFS through a graph with restricted nodes, similar to deadends in this problem.

The key insight is recognizing when you have a state space that can be explored level by level to find the shortest path.

## Key Takeaways

1. **BFS for shortest path in unweighted graphs**: When you need the minimum number of moves/transitions between states, BFS is almost always the right approach.

2. **Model implicit graphs**: Many problems don't explicitly give you a graph - you need to recognize that states are nodes and valid transitions are edges.

3. **Watch for fixed state spaces**: When the state space is limited (like 10,000 here), even "exponential" algorithms can be practical.

4. **Always check starting and ending conditions**: Before beginning BFS, check if start == target, and if start is valid (not a deadend).

Related problems: [Reachable Nodes With Restrictions](/problem/reachable-nodes-with-restrictions)
