---
title: "How to Solve Node With Highest Edge Score — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Node With Highest Edge Score. Medium difficulty, 49.2% acceptance rate. Topics: Hash Table, Graph Theory."
date: "2028-09-27"
category: "dsa-patterns"
tags: ["node-with-highest-edge-score", "hash-table", "graph-theory", "medium"]
---

# How to Solve Node With Highest Edge Score

You're given a directed graph where each node has exactly one outgoing edge, represented by an array `edges` where `edges[i]` points from node `i` to another node. The **edge score** of a node is the sum of all nodes that have an outgoing edge pointing to it. Your task is to find the node with the highest edge score, breaking ties by returning the smallest node index.

What makes this problem interesting is that while it looks like a graph problem, it's really about **frequency counting with tie-breaking rules**. The constraint that each node has exactly one outgoing edge simplifies the problem significantly, allowing for an efficient O(n) solution.

## Visual Walkthrough

Let's trace through a concrete example: `edges = [1, 0, 0, 2, 1, 4, 4, 6]` with `n = 8` nodes.

**Step 1: Understanding the graph structure**

- Node 0 points to node 1
- Node 1 points to node 0
- Node 2 points to node 0
- Node 3 points to node 2
- Node 4 points to node 1
- Node 5 points to node 4
- Node 6 points to node 4
- Node 7 points to node 6

**Step 2: Calculating edge scores**
We need to find which nodes are pointed to by other nodes:

- Node 0: Pointed to by nodes 1 and 2 → Score = 1 + 2 = 3
- Node 1: Pointed to by nodes 0 and 4 → Score = 0 + 4 = 4
- Node 2: Pointed to by node 3 → Score = 3
- Node 3: Not pointed to by anyone → Score = 0
- Node 4: Pointed to by nodes 5 and 6 → Score = 5 + 6 = 11
- Node 5: Not pointed to by anyone → Score = 0
- Node 6: Pointed to by node 7 → Score = 7
- Node 7: Not pointed to by anyone → Score = 0

**Step 3: Finding the highest score with tie-breaking**
The scores are: [3, 4, 3, 0, 11, 0, 7, 0]

- Highest score is 11 at node 4
- No tie to break, so answer is 4

This walkthrough shows we need to: (1) Count contributions to each node, (2) Track the maximum, (3) Handle ties by choosing the smallest index.

## Brute Force Approach

A naive approach would be to iterate through all nodes and for each target node, scan the entire `edges` array to find all nodes pointing to it:

1. For each node `i` from 0 to n-1:
   - Initialize score = 0
   - For each node `j` from 0 to n-1:
     - If `edges[j] == i`, add `j` to score
   - Track the maximum score and smallest index

This brute force has O(n²) time complexity because for each of n nodes, we scan all n elements. For n up to 10⁵ (typical LeetCode constraints), this would be 10¹⁰ operations — far too slow.

The key insight is that we don't need to scan for each target node separately. We can process each edge once and add its contribution directly to the target node's score.

## Optimized Approach

The optimal solution uses a **single pass accumulation**:

1. **Initialize an array** `scores` of size n with all zeros to store each node's edge score.

2. **Process each edge once**: For each node `i` from 0 to n-1:
   - The edge from `i` to `edges[i]` means node `i` contributes to the score of node `edges[i]`
   - Add `i` to `scores[edges[i]]`

3. **Find the maximum with tie-breaking**:
   - Track the maximum score seen so far
   - Track the node with that maximum score
   - When we find a higher score, update both
   - When we find an equal score but at a smaller node index, update only the node index

This approach works in O(n) time because we process each edge exactly once, and O(n) space for storing the scores.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def edgeScore(edges):
    n = len(edges)
    scores = [0] * n  # Step 1: Initialize score array for all nodes

    # Step 2: Calculate scores by processing each edge once
    for i in range(n):
        target = edges[i]  # Node i points to target
        scores[target] += i  # Add i's contribution to target's score

    # Step 3: Find node with highest score (break ties by smallest index)
    max_score = -1
    result_node = -1

    for node in range(n):
        # If we found a higher score, update both score and node
        if scores[node] > max_score:
            max_score = scores[node]
            result_node = node
        # If we found equal score at smaller node, update only the node
        elif scores[node] == max_score and node < result_node:
            result_node = node

    return result_node
```

```javascript
// Time: O(n) | Space: O(n)
function edgeScore(edges) {
  const n = edges.length;
  const scores = new Array(n).fill(0); // Step 1: Initialize score array

  // Step 2: Calculate scores by processing each edge once
  for (let i = 0; i < n; i++) {
    const target = edges[i]; // Node i points to target
    scores[target] += i; // Add i's contribution to target's score
  }

  // Step 3: Find node with highest score (break ties by smallest index)
  let maxScore = -1;
  let resultNode = -1;

  for (let node = 0; node < n; node++) {
    // If we found a higher score, update both score and node
    if (scores[node] > maxScore) {
      maxScore = scores[node];
      resultNode = node;
    }
    // If we found equal score at smaller node, update only the node
    else if (scores[node] === maxScore && node < resultNode) {
      resultNode = node;
    }
  }

  return resultNode;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int edgeScore(int[] edges) {
        int n = edges.length;
        long[] scores = new long[n];  // Use long to avoid integer overflow

        // Step 1 & 2: Calculate scores by processing each edge once
        for (int i = 0; i < n; i++) {
            int target = edges[i];  // Node i points to target
            scores[target] += i;    // Add i's contribution to target's score
        }

        // Step 3: Find node with highest score (break ties by smallest index)
        long maxScore = -1;
        int resultNode = -1;

        for (int node = 0; node < n; node++) {
            // If we found a higher score, update both score and node
            if (scores[node] > maxScore) {
                maxScore = scores[node];
                resultNode = node;
            }
            // If we found equal score at smaller node, update only the node
            else if (scores[node] == maxScore && node < resultNode) {
                resultNode = node;
            }
        }

        return resultNode;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one to calculate scores (n iterations), and one to find the maximum (n iterations).
- Each iteration does constant work (addition or comparison).
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We need an array of size n to store the scores for each node.
- The input array is given, so we don't count it toward our space usage.
- Additional variables (max_score, result_node) use O(1) space.
- Total: O(n) for the scores array.

## Common Mistakes

1. **Using the wrong data type for scores**: When n is large (up to 10⁵), the maximum score could be approximately n²/2 ≈ 5×10⁹, which exceeds 32-bit integer range (2.1×10⁹). In Java, use `long` to avoid overflow.

2. **Incorrect tie-breaking logic**: The problem requires returning the smallest node index when scores are equal. A common mistake is to return the first node with maximum score instead of the smallest index. Always check `node < resultNode` when scores are equal.

3. **Off-by-one errors with array indices**: Remember the graph has nodes 0 to n-1. When initializing the scores array, ensure it has exactly n elements. When iterating, use `range(n)` or `i < n`, not `i <= n`.

4. **Misunderstanding the scoring**: The score is the sum of **source node indices** that point to a target, not the count of incoming edges. Adding 1 for each edge instead of adding the source node index is a critical error.

## When You'll See This Pattern

This problem uses **frequency counting with accumulation**, a pattern that appears in many coding problems:

1. **Two Sum (Easy)**: While typically solved with hash maps, the core idea of processing elements once and tracking what you've seen is similar.

2. **Sort Characters By Frequency (Medium)**: Count character frequencies (like we count edge contributions), then sort or find maximum frequency.

3. **Find All Duplicates in an Array (Medium)**: Uses array indices to track which numbers have been seen, similar to how we use array indices to track scores.

4. **Degree of an Array (Easy)**: Find the maximum frequency of any element in an array, which is analogous to finding the maximum edge score.

The key pattern is: when you need to aggregate contributions to multiple "buckets" (nodes, characters, numbers), process each element once and add its contribution directly to the appropriate bucket.

## Key Takeaways

1. **Single-pass accumulation beats nested loops**: When you need to count contributions from all elements to multiple targets, process each source element once and add directly to its target. This transforms O(n²) to O(n).

2. **Watch for integer overflow with large sums**: When summing many numbers, the total can exceed 32-bit integer limits. Use 64-bit integers (long in Java, int is fine in Python/JavaScript).

3. **Tie-breaking requires careful comparison**: When multiple elements have the same value (score, frequency, etc.) and you need the smallest index, you must check both: (1) is the value greater? (2) if equal, is the index smaller?

Related problems: [Two Sum](/problem/two-sum), [Sort Characters By Frequency](/problem/sort-characters-by-frequency), [Sort Array by Increasing Frequency](/problem/sort-array-by-increasing-frequency)
