---
title: "How to Solve Restore the Array From Adjacent Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Restore the Array From Adjacent Pairs. Medium difficulty, 75.1% acceptance rate. Topics: Array, Hash Table, Depth-First Search."
date: "2027-01-14"
category: "dsa-patterns"
tags:
  ["restore-the-array-from-adjacent-pairs", "array", "hash-table", "depth-first-search", "medium"]
---

# How to Solve Restore the Array From Adjacent Pairs

You're given pairs of adjacent elements from an original array, but the array itself is lost. Your task is to reconstruct the original array from these adjacent pairs. The challenge is that the pairs are given in no particular order, and you need to figure out the correct sequence of unique elements. This problem is interesting because it's essentially about finding a Hamiltonian path in an undirected graph where each element is a node and each adjacent pair is an edge.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have `adjacentPairs = [[2,1],[3,4],[3,2]]`.

**Step 1: Understanding the structure**

- The original array has 4 elements (since we have 3 pairs: n-1 = 3, so n = 4)
- The pairs tell us: 2 is next to 1, 3 is next to 4, and 3 is next to 2

**Step 2: Building connections**
We can think of this as a graph:

- 2 connects to 1 and 3
- 1 connects to 2
- 3 connects to 4 and 2
- 4 connects to 3

**Step 3: Finding the endpoints**
In a linear array, the first and last elements appear in only one adjacent pair (they're each adjacent to only one other element). All middle elements appear in exactly two pairs.

Looking at our connections:

- 1 appears only with 2 → could be an endpoint
- 4 appears only with 3 → could be an endpoint
- 2 appears with both 1 and 3 → middle element
- 3 appears with both 4 and 2 → middle element

**Step 4: Reconstructing the array**
Let's start with endpoint 1:

- 1 connects to 2
- 2 connects to 1 and 3 (but we came from 1, so go to 3)
- 3 connects to 2 and 4 (but we came from 2, so go to 4)
- 4 connects only to 3 (end reached)

Result: `[1, 2, 3, 4]` (We could also start from 4 and get `[4, 3, 2, 1]` — both are valid since the problem doesn't specify direction.)

## Brute Force Approach

A naive approach might try to generate all permutations of the unique elements and check which one satisfies all adjacent pairs. Here's why this fails:

1. **Find all unique elements** from the pairs (n elements)
2. **Generate all permutations** of these n elements (n! possibilities)
3. **For each permutation**, check if every adjacent pair in the permutation exists in the given `adjacentPairs`

The problem with this approach is the factorial time complexity. For n = 10^5 (the problem constraints), 10^5! is astronomically large — completely infeasible. Even for small n, this approach is inefficient.

<div class="code-group">

```python
# Brute force approach - DO NOT USE for actual solving
# Time: O(n! * n) | Space: O(n)
def restoreArray_brute(adjacentPairs):
    # Step 1: Get all unique elements
    elements = set()
    for u, v in adjacentPairs:
        elements.add(u)
        elements.add(v)

    elements = list(elements)
    n = len(elements)

    # Step 2: Generate all permutations (using itertools for demonstration)
    from itertools import permutations

    # Convert adjacentPairs to set for O(1) lookup
    pair_set = set()
    for u, v in adjacentPairs:
        pair_set.add((u, v))
        pair_set.add((v, u))  # Add both directions since order doesn't matter

    # Step 3: Check each permutation
    for perm in permutations(elements):
        valid = True
        for i in range(n - 1):
            if (perm[i], perm[i + 1]) not in pair_set:
                valid = False
                break
        if valid:
            return list(perm)

    return []  # Should never reach here with valid input
```

```javascript
// Brute force approach - DO NOT USE for actual solving
// Time: O(n! * n) | Space: O(n)
function restoreArrayBrute(adjacentPairs) {
  // Step 1: Get all unique elements
  const elements = new Set();
  for (const [u, v] of adjacentPairs) {
    elements.add(u);
    elements.add(v);
  }

  const elementList = Array.from(elements);
  const n = elementList.length;

  // Step 2: Convert adjacentPairs to set for O(1) lookup
  const pairSet = new Set();
  for (const [u, v] of adjacentPairs) {
    pairSet.add(`${u},${v}`);
    pairSet.add(`${v},${u}`); // Add both directions
  }

  // Helper function to generate permutations
  function* permutations(arr) {
    if (arr.length === 1) {
      yield arr;
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      for (const perm of permutations(rest)) {
        yield [arr[i], ...perm];
      }
    }
  }

  // Step 3: Check each permutation
  for (const perm of permutations(elementList)) {
    let valid = true;
    for (let i = 0; i < n - 1; i++) {
      if (!pairSet.has(`${perm[i]},${perm[i + 1]}`)) {
        valid = false;
        break;
      }
    }
    if (valid) {
      return perm;
    }
  }

  return []; // Should never reach here with valid input
}
```

```java
// Brute force approach - DO NOT USE for actual solving
// Time: O(n! * n) | Space: O(n)
import java.util.*;

public class Solution {
    public int[] restoreArrayBrute(int[][] adjacentPairs) {
        // Step 1: Get all unique elements
        Set<Integer> elements = new HashSet<>();
        for (int[] pair : adjacentPairs) {
            elements.add(pair[0]);
            elements.add(pair[1]);
        }

        List<Integer> elementList = new ArrayList<>(elements);
        int n = elementList.size();

        // Step 2: Convert adjacentPairs to set for O(1) lookup
        Set<String> pairSet = new HashSet<>();
        for (int[] pair : adjacentPairs) {
            pairSet.add(pair[0] + "," + pair[1]);
            pairSet.add(pair[1] + "," + pair[0]);  // Add both directions
        }

        // Step 3: Generate and check permutations
        List<List<Integer>> permutations = generatePermutations(elementList);

        for (List<Integer> perm : permutations) {
            boolean valid = true;
            for (int i = 0; i < n - 1; i++) {
                String key = perm.get(i) + "," + perm.get(i + 1);
                if (!pairSet.contains(key)) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                int[] result = new int[n];
                for (int i = 0; i < n; i++) {
                    result[i] = perm.get(i);
                }
                return result;
            }
        }

        return new int[0];  // Should never reach here with valid input
    }

    private List<List<Integer>> generatePermutations(List<Integer> nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new ArrayList<>(), new boolean[nums.size()], result);
        return result;
    }

    private void backtrack(List<Integer> nums, List<Integer> current,
                          boolean[] used, List<List<Integer>> result) {
        if (current.size() == nums.size()) {
            result.add(new ArrayList<>(current));
            return;
        }

        for (int i = 0; i < nums.size(); i++) {
            if (!used[i]) {
                used[i] = true;
                current.add(nums.get(i));
                backtrack(nums, current, used, result);
                current.remove(current.size() - 1);
                used[i] = false;
            }
        }
    }
}
```

</div>

## Optimized Approach

The key insight is recognizing this as a **graph traversal problem**:

1. **Graph Representation**: Each unique element is a node. Each adjacent pair `[u, v]` represents an undirected edge between nodes u and v.

2. **Endpoint Identification**: In a linear array (which forms a path in graph terms), the first and last elements have degree 1 (connected to only one other element), while all middle elements have degree 2.

3. **Traversal Strategy**: Once we find an endpoint, we can perform a DFS or iterative traversal to reconstruct the entire array. At each step, we look at the current node's neighbors and move to the one we haven't visited yet.

4. **Handling Undirected Edges**: Since edges are undirected, when we store neighbors, we need to add each node to the other's neighbor list.

The algorithm works like this:

- Build an adjacency list (graph) from the pairs
- Find a node with only one neighbor (an endpoint)
- Starting from that endpoint, traverse the graph:
  - Add current node to result
  - Look at its neighbors
  - Move to the neighbor we haven't visited yet
  - Repeat until we've visited all nodes

## Optimal Solution

Here's the step-by-step optimal solution using graph traversal:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def restoreArray(adjacentPairs):
    """
    Reconstructs the original array from adjacent pairs using graph traversal.

    Approach:
    1. Build adjacency list (graph) from pairs
    2. Find starting point (node with only one neighbor)
    3. Traverse from start to end using DFS/iterative approach
    4. Return the reconstructed array
    """

    # Step 1: Build adjacency list (graph representation)
    # Each node maps to a list of its neighbors
    graph = {}

    for u, v in adjacentPairs:
        # Add v to u's neighbor list
        if u not in graph:
            graph[u] = []
        graph[u].append(v)

        # Add u to v's neighbor list
        if v not in graph:
            graph[v] = []
        graph[v].append(u)

    # Step 2: Find starting point - a node with only one neighbor
    # In a linear array, endpoints have degree 1
    start = None
    for node, neighbors in graph.items():
        if len(neighbors) == 1:
            start = node
            break

    # Step 3: Reconstruct the array by traversing the graph
    result = []
    visited = set()
    current = start
    prev = None  # Track previous node to avoid going backward

    # Traverse until we've visited all nodes
    while len(result) < len(graph):
        result.append(current)
        visited.add(current)

        # Find next node to visit
        # Look at current node's neighbors and pick the one we haven't visited
        for neighbor in graph[current]:
            if neighbor != prev:  # Don't go back to previous node
                prev = current
                current = neighbor
                break

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function restoreArray(adjacentPairs) {
  /**
   * Reconstructs the original array from adjacent pairs using graph traversal.
   *
   * Approach:
   * 1. Build adjacency list (graph) from pairs
   * 2. Find starting point (node with only one neighbor)
   * 3. Traverse from start to end using iterative approach
   * 4. Return the reconstructed array
   */

  // Step 1: Build adjacency list (graph representation)
  // Each node maps to an array of its neighbors
  const graph = new Map();

  for (const [u, v] of adjacentPairs) {
    // Add v to u's neighbor list
    if (!graph.has(u)) {
      graph.set(u, []);
    }
    graph.get(u).push(v);

    // Add u to v's neighbor list
    if (!graph.has(v)) {
      graph.set(v, []);
    }
    graph.get(v).push(u);
  }

  // Step 2: Find starting point - a node with only one neighbor
  // In a linear array, endpoints have degree 1
  let start = null;
  for (const [node, neighbors] of graph.entries()) {
    if (neighbors.length === 1) {
      start = node;
      break;
    }
  }

  // Step 3: Reconstruct the array by traversing the graph
  const result = [];
  const visited = new Set();
  let current = start;
  let prev = null; // Track previous node to avoid going backward

  // Traverse until we've visited all nodes
  while (result.length < graph.size) {
    result.push(current);
    visited.add(current);

    // Find next node to visit
    // Look at current node's neighbors and pick the one we haven't visited
    const neighbors = graph.get(current);
    for (const neighbor of neighbors) {
      if (neighbor !== prev) {
        // Don't go back to previous node
        prev = current;
        current = neighbor;
        break;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] restoreArray(int[][] adjacentPairs) {
        /**
         * Reconstructs the original array from adjacent pairs using graph traversal.
         *
         * Approach:
         * 1. Build adjacency list (graph) from pairs
         * 2. Find starting point (node with only one neighbor)
         * 3. Traverse from start to end using iterative approach
         * 4. Return the reconstructed array
         */

        // Step 1: Build adjacency list (graph representation)
        // Each node maps to a list of its neighbors
        Map<Integer, List<Integer>> graph = new HashMap<>();

        for (int[] pair : adjacentPairs) {
            int u = pair[0];
            int v = pair[1];

            // Add v to u's neighbor list
            graph.putIfAbsent(u, new ArrayList<>());
            graph.get(u).add(v);

            // Add u to v's neighbor list
            graph.putIfAbsent(v, new ArrayList<>());
            graph.get(v).add(u);
        }

        // Step 2: Find starting point - a node with only one neighbor
        // In a linear array, endpoints have degree 1
        int start = 0;
        for (Map.Entry<Integer, List<Integer>> entry : graph.entrySet()) {
            if (entry.getValue().size() == 1) {
                start = entry.getKey();
                break;
            }
        }

        // Step 3: Reconstruct the array by traversing the graph
        int n = graph.size();
        int[] result = new int[n];
        Set<Integer> visited = new HashSet<>();
        int current = start;
        int prev = Integer.MIN_VALUE;  // Track previous node to avoid going backward

        // Traverse until we've visited all nodes
        for (int i = 0; i < n; i++) {
            result[i] = current;
            visited.add(current);

            // Find next node to visit
            // Look at current node's neighbors and pick the one we haven't visited
            List<Integer> neighbors = graph.get(current);
            for (int neighbor : neighbors) {
                if (neighbor != prev) {  // Don't go back to previous node
                    prev = current;
                    current = neighbor;
                    break;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the graph: O(n) where n is the number of unique elements (we process n-1 pairs)
- Finding the start node: O(n) in worst case (but could be optimized by tracking during graph building)
- Traversing the graph: O(n) since we visit each node exactly once
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Graph storage: O(n) for adjacency lists (each edge stored twice for undirected graph)
- Result array: O(n)
- Visited set: O(n) (though we can optimize this by not using an explicit visited set if we track previous node)
- Total: O(n)

The space complexity is linear in the number of elements, which is optimal since we need to store the result array anyway.

## Common Mistakes

1. **Forgetting to handle both directions in the graph**: Since adjacent pairs are undirected, you need to add each node to the other's neighbor list. If you only add one direction, you'll miss connections when traversing.

2. **Not properly identifying the start node**: Some candidates try to start from any node, but middle nodes have two neighbors, making it ambiguous which direction to go first. Always start from a node with degree 1.

3. **Infinite loop during traversal**: Without tracking the previous node or using a visited set, you might bounce back and forth between two nodes. The `prev` variable or visited set prevents this.

4. **Assuming the array has a specific direction**: The problem doesn't specify whether the reconstructed array should be in forward or reverse order. Both `[1,2,3,4]` and `[4,3,2,1]` are valid solutions. Don't waste time trying to figure out the "correct" direction.

## When You'll See This Pattern

This graph traversal pattern appears in several other LeetCode problems:

1. **Reconstruct Itinerary (LeetCode 332)**: Similar concept of reconstructing a sequence from pairs, but with directed edges and the possibility of multiple valid itineraries.

2. **Course Schedule II (LeetCode 210)**: While this uses topological sort for directed acyclic graphs, the concept of reconstructing an order from prerequisites (which are essentially directed pairs) is similar.

3. **Find if Path Exists in Graph (LeetCode 1971)**: Uses similar graph building techniques but focuses on connectivity checking rather than path reconstruction.

4. **All Paths From Source to Target (LeetCode 797)**: Another graph traversal problem where you need to find all paths, not just reconstruct one.

The core pattern is: when you need to reconstruct an order or sequence from pairwise relationships, think about representing the problem as a graph and using traversal algorithms.

## Key Takeaways

1. **Pairwise relationships often indicate a graph problem**: When you see "adjacent pairs" or "prerequisites" or any kind of "A must come before/after B" relationships, consider building a graph.

2. **Linear sequences correspond to paths in graphs**: A linear array is essentially a path where each node (except endpoints) has degree 2. This insight helps identify start/end points.

3. **Track visited nodes or previous node to avoid cycles**: In undirected graph traversal for linear paths, you need to avoid going backward. Either use a visited set or track the previous node.

4. **Start from endpoints when possible**: In path reconstruction problems, starting from an endpoint (degree 1 node) simplifies the traversal since there's only one possible next step.

Remember: The key to solving this problem efficiently is recognizing it as a graph traversal problem rather than a permutation problem. Once you see the graph structure, the solution becomes straightforward.

[Practice this problem on CodeJeet](/problem/restore-the-array-from-adjacent-pairs)
