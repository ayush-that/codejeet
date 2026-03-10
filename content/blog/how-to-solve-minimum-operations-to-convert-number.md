---
title: "How to Solve Minimum Operations to Convert Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Convert Number. Medium difficulty, 51.5% acceptance rate. Topics: Array, Breadth-First Search."
date: "2029-10-14"
category: "dsa-patterns"
tags: ["minimum-operations-to-convert-number", "array", "breadth-first-search", "medium"]
---

# How to Solve Minimum Operations to Convert Number

You're given a starting number `start`, a target `goal`, and a list of distinct numbers `nums`. You can repeatedly modify your current number by adding or subtracting any number from `nums`, but you must keep the result within the range [0, 1000]. The challenge is to find the minimum number of operations needed to reach `goal`, or return -1 if it's impossible. What makes this problem interesting is that it's essentially a shortest path problem disguised as a number manipulation puzzle.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 4, 6]`, `start = 0`, `goal = 10`

We begin at 0 and want to reach 10. At each step, we can add or subtract any number from `nums`:

**Step 0:** Current value: 0

- Possible moves: 0+2=2, 0-2=-2 (invalid, <0), 0+4=4, 0-4=-4 (invalid), 0+6=6, 0-6=-6 (invalid)

**Step 1:** We reach values 2, 4, 6 (1 operation each)

**Step 2:** From 2: 2+2=4 (already seen), 2-2=0 (already seen), 2+4=6 (already seen), 2-4=-2 (invalid), 2+6=8 (new!), 2-6=-4 (invalid)

**Step 3:** From 4: 4+6=10 (goal reached!)

So we found a path: 0 → 4 → 10, which takes 2 operations.

Notice that we need to track visited numbers to avoid cycles and ensure we find the shortest path. This is exactly what BFS does!

## Brute Force Approach

A naive approach might try all possible sequences of operations without tracking visited states. You could think: "Let me try adding 2 repeatedly until I reach 10 or exceed 1000, then backtrack..." This quickly becomes exponential.

The problem is that without tracking visited states, you'll revisit the same numbers repeatedly. For example, from 0 you could go 0→2→0→2→0... infinitely. Even with the [0, 1000] constraint, there are 1001 possible states, but an unguided search could explore far more paths than necessary.

A slightly better but still inefficient brute force would use recursion with memoization, but it's harder to guarantee we find the minimum operations. The key insight is that we need to find the shortest path in a state space, which calls for BFS.

## Optimized Approach

The optimal solution uses **Breadth-First Search (BFS)** on the number line. Here's why:

1. **State Representation**: Each number from 0 to 1000 is a node in a graph
2. **Edges**: From any number `x`, you can reach `x + nums[i]` and `x - nums[i]` (if within [0, 1000])
3. **Shortest Path**: BFS naturally finds the minimum number of steps to reach a target in an unweighted graph
4. **Cycle Prevention**: We track visited numbers to avoid infinite loops

The constraint that numbers must stay in [0, 1000] is actually helpful—it bounds our search space to 1001 possible states, making BFS efficient.

**Key Insight**: This is exactly like finding the shortest path in an unweighted graph where nodes are numbers and edges are the ± operations.

## Optimal Solution

Here's the BFS implementation with detailed comments:

<div class="code-group">

```python
# Time: O(1001 * n) where n = len(nums), but since 1001 is constant: O(n)
# Space: O(1001) for the visited set and queue
def minimumOperations(nums, start, goal):
    # We'll use BFS to find the shortest path from start to goal
    # Queue stores tuples of (current_value, operations_count)
    queue = [(start, 0)]

    # Track visited numbers to avoid cycles and redundant work
    visited = set([start])

    while queue:
        current, steps = queue.pop(0)  # Dequeue from front

        # Try all possible operations from current number
        for num in nums:
            # Generate both possible next values: current + num and current - num
            for next_val in (current + num, current - num):

                # If we found the goal, return steps + 1 (current operation)
                if next_val == goal:
                    return steps + 1

                # Only continue if next_val is within valid range AND not visited
                # The range [0, 1000] constraint is crucial
                if 0 <= next_val <= 1000 and next_val not in visited:
                    visited.add(next_val)
                    queue.append((next_val, steps + 1))

    # If BFS completes without finding goal, it's impossible
    return -1
```

```javascript
// Time: O(1001 * n) where n = nums.length, but 1001 is constant: O(n)
// Space: O(1001) for visited set and queue
function minimumOperations(nums, start, goal) {
  // BFS queue: each element is [currentValue, stepsTaken]
  const queue = [[start, 0]];

  // Track visited numbers to prevent cycles
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [current, steps] = queue.shift(); // Dequeue from front

    // Try all numbers in nums for + and - operations
    for (const num of nums) {
      // Generate both possible next values
      const candidates = [current + num, current - num];

      for (const nextVal of candidates) {
        // Check if we reached the goal
        if (nextVal === goal) {
          return steps + 1;
        }

        // Only proceed if within bounds and not visited
        if (nextVal >= 0 && nextVal <= 1000 && !visited.has(nextVal)) {
          visited.add(nextVal);
          queue.push([nextVal, steps + 1]);
        }
      }
    }
  }

  // Goal not reachable
  return -1;
}
```

```java
// Time: O(1001 * n) where n = nums.length, but 1001 is constant: O(n)
// Space: O(1001) for visited array and queue
public int minimumOperations(int[] nums, int start, int goal) {
    // BFS queue: we'll store both value and steps in arrays
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{start, 0});

    // Boolean array is more efficient than HashSet for fixed range [0, 1000]
    boolean[] visited = new boolean[1001];
    visited[start] = true;

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int currentVal = current[0];
        int steps = current[1];

        // Try all possible operations
        for (int num : nums) {
            // Generate both next values: current + num and current - num
            int[] nextValues = {currentVal + num, currentVal - num};

            for (int nextVal : nextValues) {
                // Check if we found the goal
                if (nextVal == goal) {
                    return steps + 1;
                }

                // Only proceed if within valid range and not visited
                if (nextVal >= 0 && nextVal <= 1000 && !visited[nextVal]) {
                    visited[nextVal] = true;
                    queue.offer(new int[]{nextVal, steps + 1});
                }
            }
        }
    }

    // If we exhaust all possibilities without finding goal
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(1001 × n) where n is the length of `nums`. In practice, since 1001 is a constant upper bound (numbers must stay in [0, 1000]), we simplify to O(n). Each of the 1001 possible states tries 2×n operations (add and subtract for each num).

**Space Complexity**: O(1001) for the visited set/array and the BFS queue. In the worst case, we might store all 1001 states in the queue.

The constant factors are manageable because 1001 × n ≤ 1001 × 1000 ≈ 1M operations in the worst case (when n=1000).

## Common Mistakes

1. **Forgetting the [0, 1000] constraint**: Candidates sometimes allow numbers outside this range, which leads to infinite search spaces or incorrect results. Always check bounds before enqueuing.

2. **Not checking for goal immediately**: You must check if `next_val == goal` BEFORE checking bounds. Why? Because `goal` might be outside [0, 1000], but reaching it in one operation is still valid. The problem states you want to convert `x` to `goal`, not that intermediate values must stay in [0, 1000].

3. **Using DFS instead of BFS**: DFS won't guarantee the minimum number of operations. BFS explores all possibilities level by level, so the first time we reach `goal`, we know it's the shortest path.

4. **Inefficient visited checking**: Using a list instead of a set/hash table for visited checks leads to O(n) lookups instead of O(1). With 1001 possible states, an array is actually optimal here.

## When You'll See This Pattern

This "BFS on state space" pattern appears in many LeetCode problems:

1. **Minimum Operations to Reduce X to Zero** (Problem 1658): While solved differently, it shares the "minimum operations" theme and often benefits from similar state-space thinking.

2. **Open the Lock** (Problem 752): Almost identical structure—you have a start state (lock combination), target state, and allowed operations (turning wheels up/down). BFS finds the shortest path.

3. **Word Ladder** (Problem 127): Start word, end word, and valid transformations. Again, BFS finds the shortest transformation sequence.

The pattern to recognize: When you need the **minimum number of steps/operations** to transform from a start state to a target state, and you have **discrete, reversible operations**, think BFS.

## Key Takeaways

1. **BFS for shortest transformation paths**: When a problem asks for "minimum operations" to transform one state to another with discrete steps, BFS is usually the right approach.

2. **State space constraints are your friend**: The [0, 1000] constraint seems limiting but actually makes the problem tractable by bounding the search space.

3. **Check goal before constraints**: The target might not satisfy intermediate constraints (like the [0, 1000] range), but reaching it directly is still valid.

Related problems: [Minimum Operations to Reduce X to Zero](/problem/minimum-operations-to-reduce-x-to-zero)
