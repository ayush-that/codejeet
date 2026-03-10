---
title: "Hard Atlassian Interview Questions: Strategy Guide"
description: "How to tackle 12 hard difficulty questions from Atlassian — patterns, time targets, and practice tips."
date: "2032-07-30"
category: "tips"
tags: ["atlassian", "hard", "interview prep"]
---

Atlassian’s Hard questions are a different breed. While their Medium problems often test your ability to implement a known algorithm cleanly, their Hard problems are almost exclusively about **designing an algorithm under constraints**. You won’t find many textbook "apply Dijkstra here" problems. Instead, you'll encounter scenarios that require you to synthesize multiple concepts, optimize a naive solution through keen observation, and handle complex state management. The jump from Medium to Hard at Atlassian is less about learning a new data structure and more about developing the **problem-solving muscle** to break down a novel, intricate problem into manageable, optimizable components.

## Common Patterns and Templates

Atlassian's Hard problems frequently involve **simulation with optimization** and **advanced graph traversal with state**. You're often asked to model a real-world Atlassian-adjacent process (like ticket routing, dependency resolution, or concurrent editing) and find the most efficient outcome. The most common overarching pattern is the **BFS/DFS on a state graph**, where the "state" is more complex than just a node ID—it might include time steps, resources held, or a bitmask representing visited nodes or completed tasks.

Here’s a template for the BFS on a state graph pattern, which is foundational for problems like "Shortest Path in a Grid with Keys" (LeetCode #864) or "Sliding Puzzle" (LeetCode #773).

<div class="code-group">

```python
from collections import deque

def bfs_with_state(start_state):
    """
    Template for BFS on a state graph.
    State is often a tuple (position, keys_held, steps, etc.)
    """
    # 1. Define initial state. Often (row, col, bitmask)
    start = (0, 0, 0)  # example: start at (0,0) with no keys
    queue = deque([start])

    # 2. visited dict tracks min steps to reach a given state
    # Key: state tuple, Value: steps taken
    visited = {start: 0}

    # 3. Directions for grid movement (if applicable)
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while queue:
        row, col, keys = queue.popleft()
        current_steps = visited[(row, col, keys)]

        # 4. Check for goal condition
        if is_goal(row, col, keys):
            return current_steps

        # 5. Explore neighbors (next positions + state updates)
        for dr, dc in directions:
            new_r, new_c = row + dr, col + dc

            if not is_valid(new_r, new_c):
                continue

            # 6. Handle cell interaction (wall, key, door)
            cell = grid[new_r][new_c]
            new_keys = keys

            if 'a' <= cell <= 'f':  # it's a key
                new_keys = keys | (1 << (ord(cell) - ord('a')))
            elif 'A' <= cell <= 'F':  # it's a door
                if not (keys & (1 << (ord(cell) - ord('A')))):
                    continue  # missing key, can't pass

            new_state = (new_r, new_c, new_keys)

            # 7. Only queue if state is new or we found a shorter path
            if new_state not in visited or current_steps + 1 < visited[new_state]:
                visited[new_state] = current_steps + 1
                queue.append(new_state)

    return -1  # Goal not reachable

# Time: O(R * C * 2^K) where K is number of keys. We explore states = positions * key combinations.
# Space: O(R * C * 2^K) for the visited dictionary and queue.
```

```javascript
function bfsWithState(startState) {
  // 1. Define initial state.
  let start = [0, 0, 0]; // [row, col, bitmask]
  let queue = [start];

  // 2. visited Map tracks min steps to a state.
  let visited = new Map();
  visited.set(key(start), 0);

  // 3. Directions
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  while (queue.length > 0) {
    let [row, col, keys] = queue.shift();
    let currentSteps = visited.get(key([row, col, keys]));

    // 4. Goal check
    if (isGoal(row, col, keys)) return currentSteps;

    // 5. Explore neighbors
    for (let [dr, dc] of dirs) {
      let newR = row + dr,
        newC = col + dc;
      if (!isValid(newR, newC)) continue;

      let cell = grid[newR][newC];
      let newKeys = keys;

      // 6. Handle cell interaction
      if ("a" <= cell && cell <= "f") {
        let keyBit = 1 << (cell.charCodeAt(0) - "a".charCodeAt(0));
        newKeys = keys | keyBit;
      } else if ("A" <= cell && cell <= "F") {
        let doorBit = 1 << (cell.charCodeAt(0) - "A".charCodeAt(0));
        if ((keys & doorBit) === 0) continue;
      }

      let newState = [newR, newC, newKeys];
      let stateKey = key(newState);
      let newSteps = currentSteps + 1;

      // 7. Queue if state is new or we have a shorter path
      if (!visited.has(stateKey) || newSteps < visited.get(stateKey)) {
        visited.set(stateKey, newSteps);
        queue.push(newState);
      }
    }
  }
  return -1;
}

// Helper to use an array as a Map key
function key(arr) {
  return arr.join(",");
}

// Time: O(R * C * 2^K) | Space: O(R * C * 2^K)
```

```java
import java.util.*;

public class StateBFS {
    public int bfsWithState(int[][] grid) {
        // 1. Define initial state.
        int[] start = new int[]{0, 0, 0}; // row, col, keysBitmask
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(start);

        // 2. visited map. Encode state as string "row,col,keys"
        Map<String, Integer> visited = new HashMap<>();
        visited.put(encodeState(start), 0);

        // 3. Directions
        int[][] dirs = new int[][]{{0,1}, {1,0}, {0,-1}, {-1,0}};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0], col = current[1], keys = current[2];
            int steps = visited.get(encodeState(current));

            // 4. Goal check (implement isGoal accordingly)
            if (isGoal(row, col, keys, grid)) return steps;

            // 5. Explore neighbors
            for (int[] d : dirs) {
                int newR = row + d[0], newC = col + d[1];
                if (!isValid(newR, newC, grid)) continue;

                char cell = (char) grid[newR][newC];
                int newKeys = keys;

                // 6. Handle cell interaction
                if (cell >= 'a' && cell <= 'f') {
                    int keyShift = cell - 'a';
                    newKeys = keys | (1 << keyShift);
                } else if (cell >= 'A' && cell <= 'F') {
                    int doorShift = cell - 'A';
                    if ((keys & (1 << doorShift)) == 0) continue;
                }

                int[] newState = new int[]{newR, newC, newKeys};
                String stateKey = encodeState(newState);
                int newSteps = steps + 1;

                // 7. Queue if new or better path
                if (!visited.containsKey(stateKey) || newSteps < visited.get(stateKey)) {
                    visited.put(stateKey, newSteps);
                    queue.offer(newState);
                }
            }
        }
        return -1;
    }

    private String encodeState(int[] state) {
        return state[0] + "," + state[1] + "," + state[2];
    }

    // Time: O(R * C * 2^K) | Space: O(R * C * 2^K)
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot with a Hard problem, the expectation isn't that you blaze through it in 15 minutes. A solid performance looks like this: **5-10 minutes** to understand the problem and ask clarifying questions, **15-20 minutes** to derive a working solution (often starting with a brute force or naive approach), and **10-15 minutes** to optimize it and code it cleanly. Leaving 5 minutes for discussion is ideal.

Beyond correctness, Atlassian interviewers are keenly watching for:

- **Systematic Optimization:** Can you articulate the bottlenecks in your first solution? They want to see you analyze time/space complexity and propose concrete improvements (e.g., "My DFS is O(2^n), but I see overlapping subproblems, so I can memoize with a state key").
- **Code as Communication:** Your code should read like a clear explanation of your algorithm. Use descriptive variable names (`keysBitmask` instead of `k`), extract complex logic into well-named helper functions (`canOpenDoor(keys, door)`), and comment on the non-obvious parts of your state representation.
- **Edge Case Hunting:** Proactively discuss edge cases _before_ the interviewer points them out. For graph/state problems, think about: cycles with state changes, unreachable goals, maximum input sizes causing overflow, and initialization of your visited set.

## Upgrading from Medium to Hard

The leap isn't about new data structures; it's about **complexity management**. Medium problems typically have one main "trick" (e.g., use a heap, use two pointers). Hard problems have **multiple intertwined constraints** that you must satisfy simultaneously.

The required mindset shifts are:

1.  **From "Find the Pattern" to "Design the Pattern":** You won't always recognize the problem. You must learn to model it from scratch. Practice describing the problem space as a graph or a state machine.
2.  **Embrace Intermediate Data Structures:** Your state might need to be stored in a custom object or a tuple. Your visited set might become a dictionary mapping `(position, resources)` to `min_cost`.
3.  **Master Bitmasking:** This is the single most important technical skill for Atlassian Hards. Representing a set of small, discrete items (keys, tasks, nodes) as an integer bitmask is crucial for state compression in BFS/DFS and Dynamic Programming. If you're not comfortable with bitwise operations (`&`, `|`, `<<`, `>>`), drill them now.

## Specific Patterns for Hard

1.  **Simulation with Priority Queue (Scheduling):** Problems like "Meeting Rooms III" (LeetCode #2402) require you to simulate resource allocation over time. The pattern involves using a min-heap to track when resources become free and another to queue waiting tasks.
    - **Key Insight:** You often need to process events (task start/end) in chronological order, making a priority queue the natural choice for efficient "next event" selection.

2.  **DP with Bitmask (Assignment/TSP variant):** Problems like "Maximum Employees to Be Invited to a Meeting" or "Minimum Cost to Connect All Nodes" are essentially assignment problems. You use DP where the state is `dp[bitmask][last_node]` representing the minimum cost to visit the set of nodes in `bitmask`, ending at `last_node`.
    - **Key Insight:** The bitmask represents a subset of elements, and your transition is adding one new element to the subset. Complexity is often `O(n^2 * 2^n)`, feasible for `n <= 20`.

## Practice Strategy

Don't just solve these 12 problems. **Understand their family tree.** Group them by pattern:

1.  **Start with State BFS:** Do "Shortest Path to Get All Keys" (#864) and "Sliding Puzzle" (#773). Internalize the template above.
2.  **Move to Bitmask DP:** Attempt "Campus Bikes II" (#1066 - Medium, but perfect practice) and "Maximum Students Taking Exam" (#1349).
3.  **Tackle Simulation:** Solve "Meeting Rooms III" (#2402) and "Process Tasks Using Servers" (#1882).

**Daily Target:** Don't do more than 2 Hard problems in a day. Spend 45-60 minutes _attempting_ one problem. If stuck, study the solution for 30 minutes, then **close all tabs and re-implement it from memory the next day**. The goal is to absorb the problem-solving framework, not memorize solutions.

Your end goal is to look at a novel Hard problem and confidently say, "I need to model the states, define the transitions, and find the optimal path/cost." That's the engineer Atlassian is looking for.

[Practice Hard Atlassian questions](/company/atlassian/hard)
