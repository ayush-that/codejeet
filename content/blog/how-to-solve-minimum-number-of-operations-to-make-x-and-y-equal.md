---
title: "How to Solve Minimum Number of Operations to Make X and Y Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make X and Y Equal. Medium difficulty, 48.4% acceptance rate. Topics: Dynamic Programming, Breadth-First Search, Memoization."
date: "2029-06-16"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-operations-to-make-x-and-y-equal",
    "dynamic-programming",
    "breadth-first-search",
    "memoization",
    "medium",
  ]
---

# How to Solve Minimum Number of Operations to Make X and Y Equal

This problem asks us to find the minimum number of operations to transform integer `x` into integer `y` using four specific operations: dividing by 11 (if divisible), dividing by 5 (if divisible), decrementing by 1, or incrementing by 1. What makes this problem interesting is that it's essentially a shortest path problem in an infinite graph of integers, but with constraints that make traditional BFS potentially inefficient if not handled carefully.

## Visual Walkthrough

Let's trace through an example: `x = 25`, `y = 30`

We need to find the shortest path from 25 to 30. Let's think about possible moves:

1. From 25, we could:
   - Divide by 5 (since 25 is divisible by 5) → 5
   - Decrement by 1 → 24
   - Increment by 1 → 26

2. If we choose increment: 25 → 26
   From 26, we could:
   - Decrement → 25 (backtracking)
   - Increment → 27
     (26 isn't divisible by 5 or 11)

3. Continuing incrementing: 27 → 28 → 29 → 30
   Total operations: 5 (25→26→27→28→29→30)

But wait, is there a better path? What if we use division first?

4. From 25 → 5 (divide by 5)
   From 5 → 4 (decrement)
   From 4 → 3 → 2 → 1 → 0 → 1 → 2 → ... This seems worse!

Actually, let's think differently. What if we go from 25 → 24 → 23 → 22?
From 22 (divisible by 11) → 2
From 2 → 3 → 4 → 5 → 6 → ... This also seems worse.

The key insight is that we need to explore systematically, and we might need to go below `y` to use division operations effectively. For example, if `y` is small and `x` is large, dividing might be faster than decrementing one by one.

## Brute Force Approach

A naive approach would be to try all possible sequences of operations until we reach `y`. This is essentially a depth-first search without bounds. The problem is that the search space grows exponentially with the number of operations, and there's no guarantee we'll find the shortest path efficiently.

We could try a recursive approach:

```python
def minOperations(x, y):
    if x == y:
        return 0
    if x < y:
        # Only increment operations make sense
        return y - x

    # Try all operations
    results = []
    if x % 11 == 0:
        results.append(1 + minOperations(x // 11, y))
    if x % 5 == 0:
        results.append(1 + minOperations(x // 5, y))
    results.append(1 + minOperations(x - 1, y))
    results.append(1 + minOperations(x + 1, y))

    return min(results)
```

This brute force solution has several problems:

1. It doesn't handle cycles (we could go back and forth between numbers)
2. It explores the same states repeatedly
3. The recursion depth could be huge
4. It's exponential time: O(4^n) where n is the number of operations needed

## Optimized Approach

The key insight is that this is a **shortest path problem** in an unweighted graph where:

- Nodes are integers
- Edges connect numbers that can be reached in one operation
- We need the shortest path from `x` to `y`

**BFS (Breadth-First Search)** is perfect for finding shortest paths in unweighted graphs. However, we need to be careful about the search space:

1. **Search bounds**: We don't need to explore numbers that are too far from our target. If `x > y`, we might need to go below `y` to use division effectively, but we should bound how far below.
2. **Upper bound**: The maximum number we should consider is `max(x, y) + some_buffer`. Why? Because incrementing beyond `y` when `x < y` doesn't make sense, and when `x > y`, going too high would require coming back down.
3. **Lower bound**: We might need to go below `y` to use division, but how far? Consider that dividing by 11 or 5 reduces numbers significantly. We should explore until we reach 0 or negative numbers.

Actually, let's think more carefully. The operations allow us to:

- Increase: only by +1
- Decrease: by -1, or by division (which can be much larger decreases)

So when `x > y`, we might want to:

1. Decrement until we reach `y` (cost: `x - y`)
2. Or use division to jump down faster, even if it means going below `y` and then incrementing back up

The optimal approach: **Bidirectional BFS** or **BFS with smart bounds**. We can use BFS starting from `x`, but we need to limit how far we explore. A practical bound is `max(x, y) * 2` because:

- If we go beyond `2 * max(x, y)`, we're probably taking a suboptimal path
- Division operations reduce numbers quickly, so we won't need extremely large numbers

## Optimal Solution

We'll use BFS with a visited set to avoid cycles. The queue stores tuples of `(current_value, operations_count)`. We explore until we find `y`.

<div class="code-group">

```python
from collections import deque

def minimumOperationsToMakeEqual(x: int, y: int) -> int:
    """
    Find minimum operations to transform x to y using:
    1. Divide by 11 if divisible by 11
    2. Divide by 5 if divisible by 5
    3. Decrement by 1
    4. Increment by 1

    Time: O(V + E) where V is number of vertices visited, E is edges
    Space: O(V) for visited set and queue
    """
    if x == y:
        return 0

    # BFS queue: (current_value, operations_count)
    queue = deque([(x, 0)])
    visited = set([x])

    # We need bounds to prevent infinite search
    # Upper bound: max(x, y) * 2 is sufficient
    # Lower bound: 0 (we shouldn't go negative since operations don't allow it)
    upper_bound = max(x, y) * 2 + 1

    while queue:
        current, steps = queue.popleft()

        # Try all possible operations from current position
        next_values = []

        # Operation 1: Divide by 11 if divisible
        if current % 11 == 0:
            next_values.append(current // 11)

        # Operation 2: Divide by 5 if divisible
        if current % 5 == 0:
            next_values.append(current // 5)

        # Operation 3: Decrement by 1
        next_values.append(current - 1)

        # Operation 4: Increment by 1
        next_values.append(current + 1)

        for next_val in next_values:
            # Check if we found the target
            if next_val == y:
                return steps + 1

            # Only explore if within reasonable bounds and not visited
            if 0 <= next_val <= upper_bound and next_val not in visited:
                visited.add(next_val)
                queue.append((next_val, steps + 1))

    # This line should never be reached for valid inputs
    return -1
```

```javascript
/**
 * Find minimum operations to transform x to y
 * Time: O(V + E) where V is vertices visited, E is edges
 * Space: O(V) for visited set and queue
 */
function minimumOperationsToMakeEqual(x, y) {
  if (x === y) return 0;

  // BFS queue: each element is [currentValue, operationsCount]
  const queue = [[x, 0]];
  const visited = new Set([x]);

  // Set bounds to prevent infinite search
  const upperBound = Math.max(x, y) * 2 + 1;

  while (queue.length > 0) {
    const [current, steps] = queue.shift();

    // Generate all possible next values
    const nextValues = [];

    // Operation 1: Divide by 11 if divisible
    if (current % 11 === 0) {
      nextValues.push(Math.floor(current / 11));
    }

    // Operation 2: Divide by 5 if divisible
    if (current % 5 === 0) {
      nextValues.push(Math.floor(current / 5));
    }

    // Operation 3: Decrement by 1
    nextValues.push(current - 1);

    // Operation 4: Increment by 1
    nextValues.push(current + 1);

    for (const nextVal of nextValues) {
      // Check if we found the target
      if (nextVal === y) {
        return steps + 1;
      }

      // Only explore if within bounds and not visited
      if (nextVal >= 0 && nextVal <= upperBound && !visited.has(nextVal)) {
        visited.add(nextVal);
        queue.push([nextVal, steps + 1]);
      }
    }
  }

  // Should never reach here for valid inputs
  return -1;
}
```

```java
import java.util.*;

class Solution {
    /**
     * Find minimum operations to transform x to y
     * Time: O(V + E) where V is vertices visited, E is edges
     * Space: O(V) for visited set and queue
     */
    public int minimumOperationsToMakeEqual(int x, int y) {
        if (x == y) return 0;

        // BFS queue: each element is int array [currentValue, operationsCount]
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{x, 0});

        // Visited set to avoid cycles
        Set<Integer> visited = new HashSet<>();
        visited.add(x);

        // Set bounds to prevent infinite search
        int upperBound = Math.max(x, y) * 2 + 1;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int currentVal = current[0];
            int steps = current[1];

            // Generate all possible next values
            List<Integer> nextValues = new ArrayList<>();

            // Operation 1: Divide by 11 if divisible
            if (currentVal % 11 == 0) {
                nextValues.add(currentVal / 11);
            }

            // Operation 2: Divide by 5 if divisible
            if (currentVal % 5 == 0) {
                nextValues.add(currentVal / 5);
            }

            // Operation 3: Decrement by 1
            nextValues.add(currentVal - 1);

            // Operation 4: Increment by 1
            nextValues.add(currentVal + 1);

            for (int nextVal : nextValues) {
                // Check if we found the target
                if (nextVal == y) {
                    return steps + 1;
                }

                // Only explore if within bounds and not visited
                if (nextVal >= 0 && nextVal <= upperBound && !visited.contains(nextVal)) {
                    visited.add(nextVal);
                    queue.offer(new int[]{nextVal, steps + 1});
                }
            }
        }

        // Should never reach here for valid inputs
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(V + E) where V is the number of vertices (unique integers) visited and E is the number of edges explored. In practice:

- Each number generates at most 4 neighbors
- We bound the search to numbers between 0 and `max(x, y) * 2`
- In the worst case, we might visit all numbers in this range: O(max(x, y))

**Space Complexity:** O(V) where V is the number of vertices visited. This includes:

- The visited set storing all visited numbers
- The BFS queue storing frontier nodes
- In worst case, this could be O(max(x, y))

The actual performance is much better in practice because:

1. Division operations jump over many numbers
2. We stop as soon as we find `y`
3. Many numbers won't be reachable due to divisibility constraints

## Common Mistakes

1. **Not handling cycles**: Without a visited set, BFS can get stuck in infinite loops (e.g., alternating between increment and decrement).

2. **Unbounded search**: Exploring numbers without bounds can lead to memory overflow or infinite loops when `x < y` and we keep incrementing.

3. **Incorrect bounds**: Setting bounds too small might miss optimal paths that require going below `y` to use division. Setting bounds too large wastes memory and time.

4. **Forgetting integer division**: When checking divisibility and performing division, ensure you're using integer division. Floating point division would give wrong results.

5. **Not checking bounds before queue insertion**: Checking `next_val == y` before bounds check is correct, but we must check bounds before adding to queue to avoid exploring invalid paths.

## When You'll See This Pattern

This problem uses **BFS for shortest path in an implicit graph**, a pattern that appears in many LeetCode problems:

1. **Word Ladder (Medium)**: Transform one word to another by changing one letter at a time, with valid words from a dictionary. Similar BFS approach on an implicit graph of words.

2. **Minimum Genetic Mutation (Medium)**: Similar to Word Ladder but with genetic sequences.

3. **Open the Lock (Medium)**: Find minimum turns to reach a target combination on a lock, with forbidden states. Each dial turn creates neighbors.

4. **Sliding Puzzle (Hard)**: Find minimum moves to solve a sliding puzzle. Each move creates new board states.

The common pattern: you have a start state, target state, allowed transitions (edges), and need the shortest path. BFS is the natural choice for unweighted graphs.

## Key Takeaways

1. **Recognize implicit graphs**: When a problem involves transforming one state to another with defined operations, think of it as a graph search problem.

2. **BFS for shortest unweighted paths**: BFS finds the shortest path in unweighted graphs. Use a queue, visited set, and process level by level.

3. **Bound your search**: For problems with potentially infinite state spaces, determine reasonable bounds based on the operations and constraints.

4. **Watch for optimization opportunities**: In this problem, we could optimize further by using bidirectional BFS (searching from both `x` and `y` simultaneously) or A\* search with a heuristic.

Related problems: [Shortest Bridge](/problem/shortest-bridge), [Minimum Moves to Spread Stones Over Grid](/problem/minimum-moves-to-spread-stones-over-grid)
