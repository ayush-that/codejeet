---
title: "Hard Expedia Interview Questions: Strategy Guide"
description: "How to tackle 6 hard difficulty questions from Expedia — patterns, time targets, and practice tips."
date: "2032-09-04"
category: "tips"
tags: ["expedia", "hard", "interview prep"]
---

Hard Expedia interview questions aren't just about solving a problem; they're about solving a _system_. While Medium problems often ask you to implement a single algorithm or data structure, Hard problems at Expedia typically involve orchestrating multiple concepts, managing complex state, or optimizing a solution that has a deceptively simple brute-force approach. The six Hard questions in their tagged list often involve graph traversal with a twist, dynamic programming on non-standard structures, or advanced string/array manipulation requiring careful indexing logic. The jump in difficulty comes from the need for deeper pattern recognition and the ability to break down a complex, often wordy, problem statement into discrete, solvable components.

## Common Patterns and Templates

Expedia's Hard problems frequently test your ability to handle **Graphs with Additional Constraints** and **Multi-dimensional Dynamic Programming**. A recurring theme is finding a path or sequence under specific rules, which often maps to a modified BFS or DFS on an implicit or explicit graph. The most common pattern you'll need is **BFS for Shortest Path in an Unweighted Graph with State**. This isn't just a standard grid BFS; it's BFS where each node carries extra information (e.g., keys collected, obstacles broken, direction faced). The queue stores _state objects_, and the visited set must account for this full state to avoid cycles.

Here is the core template for this pattern:

<div class="code-group">

```python
from collections import deque

def bfs_with_state(start_state):
    """
    Template for BFS on a graph where each node has associated state.
    Returns the minimum steps to reach a goal state, or -1 if impossible.
    """
    # Queue stores tuples of (state, steps)
    queue = deque([(start_state, 0)])
    # Visited set tracks seen states to prevent cycles
    visited = set([start_state])

    while queue:
        current_state, steps = queue.popleft()

        # Check if current_state is a goal state
        if is_goal(current_state):
            return steps

        # Generate all possible next states from current_state
        for next_state in get_neighbors(current_state):
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, steps + 1))

    return -1  # Goal not reachable

# The functions is_goal() and get_neighbors() are problem-specific.
# The 'state' is often a tuple like (row, col, keys_bitmask).
```

```javascript
function bfsWithState(startState) {
  // Queue stores objects of {state, steps}
  const queue = [{ state: startState, steps: 0 }];
  // Visited Set tracks seen states
  const visited = new Set();
  visited.add(serializeState(startState)); // Often need to serialize for JS Set

  while (queue.length > 0) {
    const { state, steps } = queue.shift();

    if (isGoal(state)) {
      return steps;
    }

    for (const nextState of getNeighbors(state)) {
      const serialized = serializeState(nextState);
      if (!visited.has(serialized)) {
        visited.add(serialized);
        queue.push({ state: nextState, steps: steps + 1 });
      }
    }
  }
  return -1;
}

// Problem-specific: isGoal(state), getNeighbors(state), serializeState(state)
```

```java
import java.util.*;

public class StateBFS {
    public int bfsWithState(State startState) {
        // Queue stores nodes with state and distance
        Queue<Node> queue = new LinkedList<>();
        queue.offer(new Node(startState, 0));
        // Visited set for full state
        Set<State> visited = new HashSet<>();
        visited.add(startState);

        while (!queue.isEmpty()) {
            Node current = queue.poll();
            State currentState = current.state;
            int steps = current.steps;

            if (isGoal(currentState)) {
                return steps;
            }

            for (State nextState : getNeighbors(currentState)) {
                if (!visited.contains(nextState)) {
                    visited.add(nextState);
                    queue.offer(new Node(nextState, steps + 1));
                }
            }
        }
        return -1;
    }

    class Node {
        State state;
        int steps;
        Node(State s, int d) { state = s; steps = d; }
    }
    // Problem-specific: boolean isGoal(State s), List<State> getNeighbors(State s)
    // State class must properly implement hashCode() and equals().
}
```

</div>

**Time Complexity:** O(S \* N), where S is the number of possible unique states and N is the number of neighbors per state. **Space Complexity:** O(S) for the visited set and queue.

## Time Benchmarks and What Interviewers Look For

For a 45-60 minute interview slot, you should aim to solve one Hard problem. The breakdown is key: spend no more than 5-7 minutes understanding the problem and asking clarifying questions, 10-15 minutes designing the approach and explaining it, 15-20 minutes writing clean code, and the final 5-10 minutes testing with examples and discussing edge cases.

Beyond a correct answer, Expedia interviewers are evaluating:

1.  **Systematic Decomposition:** Can you take a complex requirement (e.g., "shortest path but you can break exactly one wall") and break it into a state representation and graph model?
2.  **Code Hygiene:** Your solution will be longer. Use helper functions with clear names (`getNeighbors`, `isValid`). This makes your logic readable and shows you can manage complexity.
3.  **State Space Analysis:** Do you recognize why a visited set is crucial? Can you estimate the size of your state space to justify your approach's feasibility?
4.  **Communication of Trade-offs:** Be prepared to discuss why you chose BFS over DFS (shortest path), or why a 2D DP array wasn't sufficient and you needed a 3rd dimension.

## Upgrading from Medium to Hard

The leap from Medium to Hard is less about new data structures and more about **composition and optimization**. You know the pieces; now you must assemble them under pressure.

- **New Technique: Stateful BFS/DFS.** As shown above, this is the single most important pattern to master for Hard graph problems.
- **New Technique: DP with Bitmasking.** Used for problems where you have a small set of items (n <= 20) and need to represent "used/not used" as a bitmask integer. This adds a dimension to your DP state.
- **Mindset Shift: From "Find the Algorithm" to "Design the State."** For Medium problems, you often recognize "this is a sliding window." For Hard problems, the first step is defining what a "node" or "DP state" is. Ask yourself: "What minimal information do I need to know at this point to make future decisions?"
- **Increased Scrutiny on Edge Cases.** Hard problems often have tricky boundaries: empty input, maximum input size causing overflow, or states that seem valid but aren't. You must explicitly walk through these.

## Specific Patterns for Hard

**1. Shortest Path in a Grid with Obstacles (with a removal allowance).**
This is a direct application of the stateful BFS template. The state becomes `(row, col, k)` where `k` is the number of obstacles you're still allowed to break. `LeetCode 1293: Shortest Path in a Grid with Obstacles Elimination` is the classic example. The `get_neighbors` function checks if the next cell is an obstacle and decrements `k` if possible.

**2. Dynamic Programming on Intervals or Sequences with a Twist.**
Problems like `LeetCode 312: Burst Balloons` require a non-obvious DP definition. Instead of thinking about which balloon to burst first, you think about which balloon is burst _last_ in a subarray. This requires a DP array where `dp[i][j]` represents the best score for the subarray `(i, j)`, and you iterate over the last burst `k`. The key is mastering the transition: `dp[i][j] = max(dp[i][j], dp[i][k-1] + nums[i-1]*nums[k]*nums[j+1] + dp[k+1][j])`.

**3. Union-Find with Additional Tracking.**
Hard problems may use Union-Find not just for connectivity, but to track properties like group size or whether a group is connected to a boundary. `LeetCode 305: Number of Islands II` is a foundational problem here. The pattern involves initializing a UF structure for all possible points, then as you add points, union with neighboring existing points and cleverly maintain the count of components.

## Practice Strategy

Don't just solve these six problems. Use them as archetypes to learn the patterns.

1.  **Week 1-2: Pattern Immersion.** Focus on the core patterns, not Expedia-specific questions. Solve 5-10 problems for each: Stateful BFS, Bitmask DP, Interval DP.
2.  **Week 3: Expedia Tagged Problems.** Now, attempt the 6 Hard Expedia questions. Your goal is not to solve them quickly, but to identify which pattern each one maps to. If you get stuck for 20 minutes, study the solution, map it to a pattern, and re-implement it the next day.
3.  **Daily Target:** When in active prep, aim for 1-2 Hard problems per day, maximum. Spend 45 minutes attempting one, then 45 minutes thoroughly analyzing the solution and writing a clean implementation. Quality of understanding trumps quantity.
4.  **Simulate:** Once a week, do a full 60-minute mock interview with a random Hard problem. Practice talking through your state design process out loud.

The goal is to build a reflex: when you see a complex pathfinding rule, you think "stateful BFS." When you see a small set selection, you think "bitmask." Master these lenses, and Hard problems become structured puzzles instead of insurmountable walls.

[Practice Hard Expedia questions](/company/expedia/hard)
