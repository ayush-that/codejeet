---
title: "How to Solve Jump Game III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Jump Game III. Medium difficulty, 66.7% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search."
date: "2028-01-18"
category: "dsa-patterns"
tags: ["jump-game-iii", "array", "depth-first-search", "breadth-first-search", "medium"]
---

# How to Solve Jump Game III

In Jump Game III, you're given an array of non-negative integers and a starting index. From any index `i`, you can jump to either `i + arr[i]` or `i - arr[i]`, as long as you stay within array bounds. Your goal is to determine if you can reach **any** index where the value is 0. What makes this problem interesting is that unlike traditional jump games where you can only move forward, here you can move both forward and backward, creating a search problem rather than a greedy one.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `arr = [4, 2, 3, 0, 3, 1, 2]` with `start = 5`.

**Step 1:** Start at index 5, value = 1

- From index 5, we can jump to:
  - `5 + 1 = 6` (valid, value = 2)
  - `5 - 1 = 4` (valid, value = 3)

**Step 2:** Let's explore index 4 first, value = 3

- From index 4, we can jump to:
  - `4 + 3 = 7` (invalid, out of bounds)
  - `4 - 3 = 1` (valid, value = 2)

**Step 3:** From index 1, value = 2

- From index 1, we can jump to:
  - `1 + 2 = 3` (valid, value = 0 ← found a zero!)
  - `1 - 2 = -1` (invalid, out of bounds)

We found a zero at index 3, so we can return `true`. Notice how we had to explore multiple paths and could move both forward and backward. This is essentially a graph traversal problem where each index is a node with edges to `i + arr[i]` and `i - arr[i]`.

## Brute Force Approach

A naive approach would be to recursively explore all possible paths without any tracking of visited indices. At each index, we'd recursively try both possible jumps:

1. Check if current index has value 0 (base case for success)
2. Recursively try jumping to `i + arr[i]` if valid
3. Recursively try jumping to `i - arr[i]` if valid

The problem with this approach is that it can lead to infinite loops. Consider `arr = [1, 1, 1]` with `start = 0`:

- From index 0 (value 1) → index 1 (value 1)
- From index 1 (value 1) → index 0 (value 1)
- This creates a cycle: 0 ↔ 1 ↔ 0 ↔ 1...

Without tracking visited indices, the recursion would never terminate. Even with cycle detection, the brute force approach explores many redundant paths and has exponential time complexity in the worst case.

## Optimized Approach

The key insight is that this is essentially a **graph traversal problem**:

- Each array index is a node
- From node `i`, there are directed edges to `i + arr[i]` and `i - arr[i]` (if within bounds)
- We need to find if there's a path from the start node to any node with value 0

We can solve this using either **Depth-First Search (DFS)** or **Breadth-First Search (BFS)**. Both work equally well since we're just checking for reachability, not shortest path.

**DFS Approach:**

1. Use a stack (or recursion) to explore paths
2. Track visited indices to avoid cycles
3. At each index, check if value is 0 (success)
4. Otherwise, push valid neighboring indices onto stack

**BFS Approach:**

1. Use a queue to explore level by level
2. Track visited indices to avoid cycles
3. At each index, check if value is 0 (success)
4. Otherwise, enqueue valid neighboring indices

The BFS approach might be slightly more intuitive since it explores all possibilities at the current "distance" before moving further, but both have the same time and space complexity.

## Optimal Solution

Here's the complete solution using BFS (queue-based approach) with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# We visit each index at most once, and we store visited indices in a set
def canReach(arr, start):
    """
    Determines if we can reach any index with value 0 starting from 'start'.

    Args:
        arr: List of non-negative integers
        start: Starting index

    Returns:
        True if we can reach any index with value 0, False otherwise
    """
    n = len(arr)

    # Queue for BFS traversal - stores indices to explore
    queue = deque([start])

    # Set to track visited indices - prevents infinite loops
    visited = set([start])

    while queue:
        # Get the next index to explore
        current = queue.popleft()

        # Check if we've found a zero - success condition
        if arr[current] == 0:
            return True

        # Calculate possible next indices
        forward = current + arr[current]
        backward = current - arr[current]

        # Check forward jump (if within bounds and not visited)
        if 0 <= forward < n and forward not in visited:
            visited.add(forward)
            queue.append(forward)

        # Check backward jump (if within bounds and not visited)
        if 0 <= backward < n and backward not in visited:
            visited.add(backward)
            queue.append(backward)

    # If we exhaust all reachable indices without finding zero
    return False
```

```javascript
// Time: O(n) | Space: O(n)
// We visit each index at most once, and we store visited indices in a Set
/**
 * Determines if we can reach any index with value 0 starting from 'start'.
 *
 * @param {number[]} arr - Array of non-negative integers
 * @param {number} start - Starting index
 * @return {boolean} True if we can reach any index with value 0, False otherwise
 */
function canReach(arr, start) {
  const n = arr.length;

  // Queue for BFS traversal - stores indices to explore
  const queue = [start];

  // Set to track visited indices - prevents infinite loops
  const visited = new Set([start]);

  while (queue.length > 0) {
    // Get the next index to explore
    const current = queue.shift();

    // Check if we've found a zero - success condition
    if (arr[current] === 0) {
      return true;
    }

    // Calculate possible next indices
    const forward = current + arr[current];
    const backward = current - arr[current];

    // Check forward jump (if within bounds and not visited)
    if (forward >= 0 && forward < n && !visited.has(forward)) {
      visited.add(forward);
      queue.push(forward);
    }

    // Check backward jump (if within bounds and not visited)
    if (backward >= 0 && backward < n && !visited.has(backward)) {
      visited.add(backward);
      queue.push(backward);
    }
  }

  // If we exhaust all reachable indices without finding zero
  return false;
}
```

```java
// Time: O(n) | Space: O(n)
// We visit each index at most once, and we store visited indices in a boolean array
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    /**
     * Determines if we can reach any index with value 0 starting from 'start'.
     *
     * @param arr Array of non-negative integers
     * @param start Starting index
     * @return True if we can reach any index with value 0, False otherwise
     */
    public boolean canReach(int[] arr, int start) {
        int n = arr.length;

        // Queue for BFS traversal - stores indices to explore
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(start);

        // Boolean array to track visited indices - prevents infinite loops
        boolean[] visited = new boolean[n];
        visited[start] = true;

        while (!queue.isEmpty()) {
            // Get the next index to explore
            int current = queue.poll();

            // Check if we've found a zero - success condition
            if (arr[current] == 0) {
                return true;
            }

            // Calculate possible next indices
            int forward = current + arr[current];
            int backward = current - arr[current];

            // Check forward jump (if within bounds and not visited)
            if (forward >= 0 && forward < n && !visited[forward]) {
                visited[forward] = true;
                queue.offer(forward);
            }

            // Check backward jump (if within bounds and not visited)
            if (backward >= 0 && backward < n && !visited[backward]) {
                visited[backward] = true;
                queue.offer(backward);
            }
        }

        // If we exhaust all reachable indices without finding zero
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we might visit every index in the array once
- Each index is processed at most once (added to and removed from the queue)
- For each index, we perform constant-time operations: checking bounds, updating visited set, and enqueueing neighbors

**Space Complexity: O(n)**

- The queue can hold up to O(n) indices in the worst case
- The visited set/array requires O(n) space to track all indices
- In the recursive DFS version, the call stack could also use O(n) space in the worst case

## Common Mistakes

1. **Forgetting to track visited indices**: This leads to infinite loops when there are cycles in the graph. Always use a visited set/array when doing graph traversal on potentially cyclic graphs.

2. **Incorrect bounds checking**: When calculating `i + arr[i]` or `i - arr[i]`, candidates sometimes check `>= 0` and `<= n` instead of `< n`. Remember array indices go from `0` to `n-1` inclusive.

3. **Using the wrong data structure for visited tracking**: For BFS/DFS, a set or boolean array is appropriate. Using a list and checking `if x in visited` with O(n) lookup time makes the overall complexity O(n²) instead of O(n).

4. **Not handling the start index correctly**: Some candidates forget to mark the start index as visited initially, which can cause issues if the start index is revisited later.

## When You'll See This Pattern

This "reachability in implicit graph" pattern appears in several LeetCode problems:

1. **Jump Game (Medium)**: Similar but only allows forward jumps and uses greedy/DP approach rather than BFS/DFS.

2. **Jump Game II (Medium)**: Also about jumping forward only, but focuses on minimum number of jumps to reach the end.

3. **Jump Game VII (Medium)**: More complex constraints on jumps but still about reachability in an array.

4. **01 Matrix (Medium)**: Uses BFS to find distances to nearest zero, similar graph traversal concept.

5. **Rotting Oranges (Medium)**: Multi-source BFS problem that also uses queue-based traversal.

The key insight is recognizing when a problem can be modeled as graph traversal, even when the graph isn't explicitly given.

## Key Takeaways

1. **Recognize implicit graphs**: When you can move between positions according to some rule, you're often dealing with an implicit graph. Each position is a node, and the movement rules define edges.

2. **BFS/DFS for reachability**: When asked "can you reach" or "is there a path", BFS or DFS with visited tracking is usually the right approach.

3. **Always prevent cycles**: In graph traversal problems, always track visited nodes to avoid infinite loops when cycles might exist.

Related problems: [Jump Game II](/problem/jump-game-ii), [Jump Game](/problem/jump-game), [Jump Game VII](/problem/jump-game-vii)
