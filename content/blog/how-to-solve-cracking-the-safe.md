---
title: "How to Solve Cracking the Safe — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Cracking the Safe. Hard difficulty, 58.4% acceptance rate. Topics: String, Depth-First Search, Graph Theory, Eulerian Circuit."
date: "2028-01-25"
category: "dsa-patterns"
tags: ["cracking-the-safe", "string", "depth-first-search", "graph-theory", "hard"]
---

# How to Solve Cracking the Safe

This problem asks us to find the shortest possible string that contains every possible password of length `n` using digits from `0` to `k-1`. The tricky part is that the safe checks the most recent `n` digits entered, so we need to construct a sequence where every possible `n`-digit combination appears as a consecutive substring at least once. This is essentially finding a **de Bruijn sequence** - a cyclic sequence that contains every possible substring of length `n` exactly once.

## Visual Walkthrough

Let's trace through a small example with `n = 2` and `k = 2` (digits 0 and 1). All possible 2-digit passwords are:

- 00
- 01
- 10
- 11

We need to find the shortest string containing all these. One valid solution is `"00110"`:

- Position 0-1: "00"
- Position 1-2: "01"
- Position 2-3: "11"
- Position 3-4: "10"

Notice that positions overlap by `n-1 = 1` digit. This overlapping property is key - we can think of each password as an edge in a graph where nodes are `(n-1)`-digit sequences.

For `n=2, k=2`, nodes are 1-digit sequences: "0" and "1". Each node can transition to another by appending a digit:

- From "0": append 0 → "00" (edge to node "0"), append 1 → "01" (edge to node "1")
- From "1": append 0 → "10" (edge to node "0"), append 1 → "11" (edge to node "1")

We need to traverse all edges exactly once - this is finding an **Eulerian circuit** in a directed graph!

## Brute Force Approach

A naive approach would be to generate all possible strings of increasing length and check if they contain all passwords. For `n=3, k=2`, there are 8 possible passwords (000, 001, 010, 011, 100, 101, 110, 111). We could:

1. Start with length `n` (minimum possible)
2. Generate all strings of that length
3. Check if each contains all passwords
4. Increase length if none work

This is extremely inefficient! For `n=3, k=2`, the shortest valid string has length 10 (8 passwords + 2 extra digits for overlap). But there are `k^L = 2^10 = 1024` possible strings of length 10 to check. For larger inputs, this becomes impossible.

The brute force fails because it doesn't leverage the overlapping structure of the passwords. We need a smarter approach that builds the sequence incrementally while ensuring we cover all combinations.

## Optimized Approach

The key insight is that this problem maps to finding an **Eulerian circuit** in a **de Bruijn graph**:

1. **Graph Construction**: Create a graph where:
   - Nodes are all possible `(n-1)`-digit sequences
   - From node `u`, there's a directed edge to node `v` if the last `(n-2)` digits of `u` match the first `(n-2)` digits of `v`, and the edge represents the `n`-digit password formed by appending the last digit of `v` to `u`

2. **Eulerian Circuit**: In this graph:
   - Each node has `k` outgoing edges (append digits 0 to k-1)
   - Each node has `k` incoming edges (prepend digits 0 to k-1)
   - Since all nodes have equal indegree and outdegree, an Eulerian circuit exists

3. **Hierholzer's Algorithm**: We can use DFS-based Hierholzer's algorithm to find the Eulerian circuit efficiently. The algorithm:
   - Start from any node (we'll use "0" repeated n-1 times)
   - DFS to explore edges, removing visited edges
   - When stuck (no unvisited edges from current node), add the node to the path
   - Reverse the path at the end

4. **Building the Result**: The Eulerian circuit gives us a sequence of nodes. To get the final string:
   - Start with the initial node
   - For each subsequent node, append its last digit
   - This constructs a string containing all n-digit passwords

## Optimal Solution

Here's the implementation using Hierholzer's algorithm for finding an Eulerian circuit:

<div class="code-group">

```python
# Time: O(k^n) - we need to generate all k^n passwords
# Space: O(k^n) - to store visited edges and the result
class Solution:
    def crackSafe(self, n: int, k: int) -> str:
        # Edge case: if n=1, we just need all single digits
        if n == 1:
            return ''.join(str(i) for i in range(k))

        # Initialize with the starting node: n-1 zeros
        # We'll use string representation for nodes
        start = '0' * (n - 1)

        # Use a set to track visited edges
        # Each edge is represented as (node, next_digit)
        visited = set()
        result = []

        def dfs(node):
            # Try all possible digits we can append
            for digit in map(str, range(k)):
                edge = (node, digit)
                # If this edge hasn't been visited
                if edge not in visited:
                    # Mark edge as visited
                    visited.add(edge)
                    # The new node is: remove first char, append new digit
                    # This maintains length n-1
                    new_node = node[1:] + digit
                    # Continue DFS from new node
                    dfs(new_node)
                    # After exploring from new_node, append the digit to result
                    # This is post-order: we add digits after exploring all paths
                    result.append(digit)

        # Start DFS from initial node
        dfs(start)

        # The result is in reverse order (post-order traversal)
        # We need to reverse it and prepend the starting node
        return start + ''.join(reversed(result))
```

```javascript
// Time: O(k^n) - we need to generate all k^n passwords
// Space: O(k^n) - to store visited edges and the result
/**
 * @param {number} n
 * @param {number} k
 * @return {string}
 */
var crackSafe = function (n, k) {
  // Edge case: if n=1, we just need all single digits
  if (n === 1) {
    return Array.from({ length: k }, (_, i) => i.toString()).join("");
  }

  // Initialize with the starting node: n-1 zeros
  const start = "0".repeat(n - 1);

  // Use a Set to track visited edges
  // Each edge is represented as string "node,digit"
  const visited = new Set();
  const result = [];

  // DFS function to find Eulerian circuit
  const dfs = (node) => {
    // Try all possible digits from 0 to k-1
    for (let digit = 0; digit < k; digit++) {
      const edge = node + "," + digit;

      // If this edge hasn't been visited
      if (!visited.has(edge)) {
        // Mark edge as visited
        visited.add(edge);

        // Create new node: remove first char, append new digit
        // This maintains length n-1
        const newNode = node.substring(1) + digit.toString();

        // Continue DFS from new node
        dfs(newNode);

        // After exploring from newNode, add digit to result
        // Post-order: we add digits after exploring all paths
        result.push(digit.toString());
      }
    }
  };

  // Start DFS from initial node
  dfs(start);

  // The result is in reverse order (post-order traversal)
  // Reverse it and prepend the starting node
  return start + result.reverse().join("");
};
```

```java
// Time: O(k^n) - we need to generate all k^n passwords
// Space: O(k^n) - to store visited edges and the result
class Solution {
    public String crackSafe(int n, int k) {
        // Edge case: if n=1, we just need all single digits
        if (n == 1) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < k; i++) {
                sb.append(i);
            }
            return sb.toString();
        }

        // Initialize with the starting node: n-1 zeros
        String start = String.join("", Collections.nCopies(n - 1, "0"));

        // Use a Set to track visited edges
        // Each edge is represented as string "node,digit"
        Set<String> visited = new HashSet<>();
        StringBuilder result = new StringBuilder();

        // DFS to find Eulerian circuit
        dfs(start, k, visited, result);

        // The result is in reverse order (post-order traversal)
        // Reverse it and prepend the starting node
        return start + result.reverse().toString();
    }

    private void dfs(String node, int k, Set<String> visited, StringBuilder result) {
        // Try all possible digits from 0 to k-1
        for (int digit = 0; digit < k; digit++) {
            String edge = node + "," + digit;

            // If this edge hasn't been visited
            if (!visited.contains(edge)) {
                // Mark edge as visited
                visited.add(edge);

                // Create new node: remove first char, append new digit
                // This maintains length n-1
                String newNode = node.substring(1) + digit;

                // Continue DFS from new node
                dfs(newNode, k, visited, result);

                // After exploring from newNode, add digit to result
                // Post-order: we add digits after exploring all paths
                result.append(digit);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(k^n)`

- We need to visit all `k^n` edges (each representing an n-digit password)
- For each node, we iterate through `k` possible digits
- The DFS visits each edge exactly once

**Space Complexity**: `O(k^n)`

- We store all visited edges in a set: `k^n` edges
- The result string has length `n + k^n - 1` (starting node + digits from edges)
- Recursion depth is `O(k^n)` in worst case

## Common Mistakes

1. **Not handling n=1 edge case**: When n=1, the starting node would be empty string. Special handling is needed to return all digits from 0 to k-1.

2. **Incorrect edge representation**: Representing edges as just the node or just the digit can cause collisions. Use a tuple or concatenated string like "node,digit".

3. **Wrong node transition**: When moving from one node to the next, you must:
   - Remove the first character of current node
   - Append the new digit
   - This maintains the node length as n-1
   - Example: node="01", digit=1 → new_node="11" (not "011")

4. **Forgetting to reverse the result**: Hierholzer's algorithm produces the path in reverse order (post-order traversal). You need to reverse the collected digits and prepend the starting node.

## When You'll See This Pattern

This Eulerian circuit/de Bruijn sequence pattern appears in problems about:

- **Finding the shortest string containing all substrings** (this problem)
- **Reconstructing sequences from overlapping fragments** (DNA sequencing problems)
- **Problems involving all combinations with overlap**

Related LeetCode problems:

1. **Reconstruct Itinerary (332)**: Also uses Hierholzer's algorithm to find Eulerian path in a graph of flights.
2. **Alien Dictionary (269)**: While different, it involves constructing sequences from partial ordering, similar graph concepts.
3. **Course Schedule (207)**: Directed graph problems often use DFS-based approaches.

## Key Takeaways

1. **Recognize de Bruijn sequences**: When a problem asks for the shortest string containing all combinations of length n from an alphabet, think de Bruijn sequence → Eulerian circuit.

2. **Graph representation is key**: Convert the problem to a graph where nodes are (n-1)-length strings and edges are n-length strings. This overlapping representation is crucial.

3. **Hierholzer's algorithm for Eulerian circuits**: When you need to traverse all edges exactly once in a directed graph where all nodes have equal indegree and outdegree, use DFS-based Hierholzer's algorithm with post-order traversal.

[Practice this problem on CodeJeet](/problem/cracking-the-safe)
