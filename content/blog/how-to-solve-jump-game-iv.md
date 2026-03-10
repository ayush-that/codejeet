---
title: "How to Solve Jump Game IV — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Jump Game IV. Hard difficulty, 46.2% acceptance rate. Topics: Array, Hash Table, Breadth-First Search."
date: "2026-07-10"
category: "dsa-patterns"
tags: ["jump-game-iv", "array", "hash-table", "breadth-first-search", "hard"]
---

# How to Solve Jump Game IV

You're given an array of integers where from any position, you can jump to adjacent indices or to any other index with the same value. Your goal is to find the minimum number of jumps needed to reach the last index starting from the first. What makes this problem tricky is that it's not a simple greedy problem like earlier Jump Game variations—you need to consider all three types of jumps simultaneously while finding the shortest path.

## Visual Walkthrough

Let's trace through a small example: `arr = [100, -23, -23, 404, 100, 23, 23, 23, 3, 404]`

Starting at index 0 (value 100), we have three options:

1. Jump to index 1 (adjacent right)
2. Jump to index 4 (same value 100)
3. Can't jump left since we're at index 0

The key insight is that we need to explore all possible paths simultaneously to find the shortest one. Think of this as a graph problem where each index is a node, and edges connect:

- Each node to its left neighbor (if exists)
- Each node to its right neighbor (if exists)
- Each node to all other nodes with the same value

We want the shortest path from node 0 to node 9. This is a classic **Breadth-First Search (BFS)** problem because BFS finds the shortest path in an unweighted graph.

Let's visualize the first few BFS levels:

- Level 0: Start at index 0 (distance = 0)
- Level 1: From index 0, we can reach indices 1 and 4 (distance = 1)
- Level 2: From index 1 (value -23), we can reach indices 0, 2, and... wait, index 1 also connects to index 2 (same value -23)! So from level 1, we actually get indices 0, 2, and 4. But we've already visited index 0, so we only add new indices.

The challenge is efficiently handling the "jump to same value" edges without creating O(n²) edges.

## Brute Force Approach

A naive approach would be to treat this as a graph and run BFS, but explicitly creating all edges would be inefficient. For each index with value `v`, you'd need to connect it to every other index with value `v`. In the worst case (all values equal), this creates O(n²) edges.

Here's what the brute force BFS might look like:

1. Create adjacency list where each node connects to:
   - i-1 if i > 0
   - i+1 if i < n-1
   - All j where arr[j] == arr[i] and j != i
2. Run standard BFS from index 0 to index n-1

The problem is step 1: finding all indices with the same value for each index requires O(n²) time in worst case. Even if we precompute groups of indices with same values, we'd still create O(n²) edges when all values are equal.

## Optimized Approach

The key optimization is to **process all same-value jumps at once** and then **clear the list** to avoid redundant processing. Here's the insight:

1. **BFS naturally finds shortest paths** in unweighted graphs
2. **We don't need to store all edges explicitly** - we can generate neighbors on the fly
3. **Once we visit all nodes with a particular value, we never need to jump between them again** because:
   - If we reach ANY node with value X, we can immediately reach ALL nodes with value X
   - After processing value X once, we should mark it as "done" to avoid O(n²) behavior

The algorithm:

1. Preprocess: Create a hash map `value_to_indices` mapping each value to all indices containing it
2. BFS from index 0 with queue, visited set, and distance tracking
3. For each node we process:
   - Add left and right neighbors if valid and unvisited
   - Add ALL indices with the same value (from our hash map)
   - **Crucially**: After adding same-value indices, CLEAR that value's list in the hash map
     This ensures each value is processed at most once, giving us O(n) total same-value jumps

Why does clearing work? Once BFS reaches ANY index with value X, it immediately gets access to ALL indices with value X. Adding them all at that moment gives the shortest possible path to each. There's no benefit to reaching other X-values later through different paths.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minJumps(arr):
    """
    Find minimum jumps to reach last index using BFS with optimization.

    Args:
        arr: List of integers

    Returns:
        Minimum number of jumps (0 if already at last index)
    """
    n = len(arr)
    if n <= 1:
        return 0

    # Step 1: Build value-to-indices mapping
    # This allows O(1) access to all indices with same value
    value_to_indices = {}
    for i, val in enumerate(arr):
        if val not in value_to_indices:
            value_to_indices[val] = []
        value_to_indices[val].append(i)

    # Step 2: BFS initialization
    from collections import deque
    queue = deque([0])          # Start BFS from index 0
    visited = [False] * n
    visited[0] = True
    steps = 0

    # Step 3: BFS traversal
    while queue:
        # Process all nodes at current distance level
        level_size = len(queue)
        for _ in range(level_size):
            current = queue.popleft()

            # Check if we reached the last index
            if current == n - 1:
                return steps

            # Option 1: Jump to left neighbor
            left = current - 1
            if left >= 0 and not visited[left]:
                visited[left] = True
                queue.append(left)

            # Option 2: Jump to right neighbor
            right = current + 1
            if right < n and not visited[right]:
                visited[right] = True
                queue.append(right)

            # Option 3: Jump to all indices with same value
            # CRITICAL: Process all at once, then clear to avoid O(n²)
            for neighbor in value_to_indices.get(arr[current], []):
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)

            # Clear the list for this value to prevent reprocessing
            # This is the key optimization that makes it O(n)
            value_to_indices[arr[current]] = []

        # Move to next level (increment step count)
        steps += 1

    # We should always reach the end, but return -1 if not
    return -1
```

```javascript
// Time: O(n) | Space: O(n)
function minJumps(arr) {
  /**
   * Find minimum jumps to reach last index using BFS with optimization.
   *
   * @param {number[]} arr - Array of integers
   * @return {number} Minimum number of jumps (0 if already at last index)
   */
  const n = arr.length;
  if (n <= 1) return 0;

  // Step 1: Build value-to-indices mapping
  // This allows O(1) access to all indices with same value
  const valueToIndices = new Map();
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    if (!valueToIndices.has(val)) {
      valueToIndices.set(val, []);
    }
    valueToIndices.get(val).push(i);
  }

  // Step 2: BFS initialization
  const queue = [0]; // Start BFS from index 0
  const visited = new Array(n).fill(false);
  visited[0] = true;
  let steps = 0;

  // Step 3: BFS traversal
  while (queue.length > 0) {
    // Process all nodes at current distance level
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const current = queue.shift();

      // Check if we reached the last index
      if (current === n - 1) {
        return steps;
      }

      // Option 1: Jump to left neighbor
      const left = current - 1;
      if (left >= 0 && !visited[left]) {
        visited[left] = true;
        queue.push(left);
      }

      // Option 2: Jump to right neighbor
      const right = current + 1;
      if (right < n && !visited[right]) {
        visited[right] = true;
        queue.push(right);
      }

      // Option 3: Jump to all indices with same value
      // CRITICAL: Process all at once, then clear to avoid O(n²)
      const sameValueIndices = valueToIndices.get(arr[current]) || [];
      for (const neighbor of sameValueIndices) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }

      // Clear the list for this value to prevent reprocessing
      // This is the key optimization that makes it O(n)
      valueToIndices.set(arr[current], []);
    }

    // Move to next level (increment step count)
    steps++;
  }

  // We should always reach the end, but return -1 if not
  return -1;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int minJumps(int[] arr) {
        /**
         * Find minimum jumps to reach last index using BFS with optimization.
         *
         * @param arr Array of integers
         * @return Minimum number of jumps (0 if already at last index)
         */
        int n = arr.length;
        if (n <= 1) return 0;

        // Step 1: Build value-to-indices mapping
        // This allows O(1) access to all indices with same value
        Map<Integer, List<Integer>> valueToIndices = new HashMap<>();
        for (int i = 0; i < n; i++) {
            valueToIndices.computeIfAbsent(arr[i], k -> new ArrayList<>()).add(i);
        }

        // Step 2: BFS initialization
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);          // Start BFS from index 0
        boolean[] visited = new boolean[n];
        visited[0] = true;
        int steps = 0;

        // Step 3: BFS traversal
        while (!queue.isEmpty()) {
            // Process all nodes at current distance level
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                int current = queue.poll();

                // Check if we reached the last index
                if (current == n - 1) {
                    return steps;
                }

                // Option 1: Jump to left neighbor
                int left = current - 1;
                if (left >= 0 && !visited[left]) {
                    visited[left] = true;
                    queue.offer(left);
                }

                // Option 2: Jump to right neighbor
                int right = current + 1;
                if (right < n && !visited[right]) {
                    visited[right] = true;
                    queue.offer(right);
                }

                // Option 3: Jump to all indices with same value
                // CRITICAL: Process all at once, then clear to avoid O(n²)
                List<Integer> sameValueIndices = valueToIndices.get(arr[current]);
                if (sameValueIndices != null) {
                    for (int neighbor : sameValueIndices) {
                        if (!visited[neighbor]) {
                            visited[neighbor] = true;
                            queue.offer(neighbor);
                        }
                    }
                    // Clear the list for this value to prevent reprocessing
                    // This is the key optimization that makes it O(n)
                    valueToIndices.get(arr[current]).clear();
                }
            }

            // Move to next level (increment step count)
            steps++;
        }

        // We should always reach the end, but return -1 if not
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the value-to-indices map: O(n) to iterate through array once
- BFS traversal: Each node is processed at most once
  - Left/right neighbors: Each edge visited at most once (O(n) total)
  - Same-value jumps: Each value's indices are processed at most once due to clearing
  - Total BFS operations: O(n)

**Space Complexity: O(n)**

- Value-to-indices map: Stores all indices, O(n) in worst case
- Visited array: O(n)
- BFS queue: O(n) in worst case
- Total: O(n)

The key to achieving O(n) time is clearing the same-value indices list after processing. Without this, in the worst case (all values equal), we'd have O(n²) operations.

## Common Mistakes

1. **Not clearing the same-value indices list**: This is the most common mistake. Candidates process same-value jumps but forget to clear the list, leading to O(n²) time when values repeat. Remember: once BFS reaches ANY index with value X, it gets immediate access to ALL indices with value X. There's no benefit to processing them again.

2. **Using DFS instead of BFS**: DFS doesn't guarantee shortest path in unweighted graphs. Some candidates try DFS with memoization, but BFS is simpler and more efficient for this problem.

3. **Incorrect level counting in BFS**: Forgetting to process nodes level-by-level and increment steps after each level. The correct pattern is:

   ```python
   steps = 0
   while queue:
       for _ in range(len(queue)):  # Process current level
           # ... process node
       steps += 1  # Increment after processing entire level
   ```

4. **Adding current index to its own same-value jumps**: The problem says `i != j`, so don't add the current index when processing same-value jumps. Our map includes all indices with the value, but we check `!visited[neighbor]` which handles this since current is already visited.

## When You'll See This Pattern

This "BFS with value grouping and clearing" pattern appears in problems where:

1. You need the shortest path in an unweighted graph
2. Nodes have "teleportation" edges to other nodes with same properties
3. The graph has implicit edges that can be generated on demand

Related problems:

- **Word Ladder (LeetCode 127)**: Similar BFS with word transformations, where each word connects to all words differing by one letter
- **Open the Lock (LeetCode 752)**: BFS through states with "adjacent" digit changes
- **Sliding Puzzle (LeetCode 773)**: BFS through board states with sliding moves

The core technique is recognizing when BFS is appropriate (shortest path in unweighted graph) and optimizing edge generation to avoid O(n²) complexity.

## Key Takeaways

1. **BFS finds shortest paths in unweighted graphs**: When a problem asks for "minimum steps" and moves are unweighted, BFS is usually the right approach.

2. **Optimize edge generation with grouping and clearing**: When nodes connect to all nodes with same property, process them all at once then mark the property as "done" to avoid O(n²) behavior.

3. **Level-order BFS for step counting**: Use the `process level → increment steps` pattern to correctly count moves in BFS.

Remember: The hardest part of this problem isn't the BFS itself—it's recognizing the need to clear same-value indices after processing. This optimization transforms an O(n²) solution into O(n).

Related problems: [Jump Game VII](/problem/jump-game-vii), [Jump Game VIII](/problem/jump-game-viii), [Maximum Number of Jumps to Reach the Last Index](/problem/maximum-number-of-jumps-to-reach-the-last-index)
