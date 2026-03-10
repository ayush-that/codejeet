---
title: "Medium eBay Interview Questions: Strategy Guide"
description: "How to tackle 38 medium difficulty questions from eBay — patterns, time targets, and practice tips."
date: "2032-08-03"
category: "tips"
tags: ["ebay", "medium", "interview prep"]
---

Medium questions at eBay are the company's primary technical screening tool. Unlike the straightforward "can you code?" Easy questions or the specialized "can you optimize under pressure?" Hard questions, eBay's Medium problems test whether you can translate business logic into efficient, maintainable code. They often model real-world eBay systems: merging overlapping auction times, finding the shortest path in a shipping network, or validating hierarchical category data. The jump from Easy to Medium here isn't just about adding a loop; it's about shifting from writing functions to designing solutions.

## Common Patterns and Templates

eBay's Medium problems heavily favor **array/string manipulation**, **binary tree operations**, and **graph traversal (BFS/DFS)**. The most frequent pattern by far is the **"Modified BFS/DFS for State Search."** You're not just traversing a tree; you're traversing a state space—like finding the minimum bids to reach a price, or the shortest path in a grid with obstacles. The template below is your Swiss Army knife.

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(start_state, target_state):
    """
    Template for BFS on state space (e.g., word ladder, shortest path in grid).
    Handles visited states to avoid cycles.
    """
    if start_state == target_state:
        return 0  # or True, depending on problem

    queue = deque([start_state])
    visited = set([start_state])
    steps = 0

    while queue:
        # Process all nodes at current distance (level-order)
        for _ in range(len(queue)):
            current_state = queue.popleft()

            # Generate all possible next states from current
            for next_state in generate_next_states(current_state):
                if next_state == target_state:
                    return steps + 1
                if next_state not in visited:
                    visited.add(next_state)
                    queue.append(next_state)

        steps += 1

    return -1  # Target not reachable

# Time: O(b^d) where b is branching factor, d is depth | Space: O(b^d)
```

```javascript
function bfsShortestPath(startState, targetState) {
  if (startState === targetState) return 0;

  const queue = [startState];
  const visited = new Set([startState]);
  let steps = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const currentState = queue.shift();

      for (const nextState of generateNextStates(currentState)) {
        if (nextState === targetState) return steps + 1;
        if (!visited.has(nextState)) {
          visited.add(nextState);
          queue.push(nextState);
        }
      }
    }

    steps++;
  }

  return -1;
}

// Time: O(b^d) | Space: O(b^d)
```

```java
import java.util.*;

public int bfsShortestPath(String startState, String targetState) {
    if (startState.equals(targetState)) return 0;

    Queue<String> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();
    queue.offer(startState);
    visited.add(startState);
    int steps = 0;

    while (!queue.isEmpty()) {
        int levelSize = queue.size();

        for (int i = 0; i < levelSize; i++) {
            String currentState = queue.poll();

            for (String nextState : generateNextStates(currentState)) {
                if (nextState.equals(targetState)) return steps + 1;
                if (!visited.contains(nextState)) {
                    visited.add(nextState);
                    queue.offer(nextState);
                }
            }
        }

        steps++;
    }

    return -1;
}

// Time: O(b^d) | Space: O(b^d)
```

</div>

## Time Benchmarks and What Interviewers Look For

You have 25-30 minutes for a Medium question. Aim for a working solution in 15 minutes, leaving 10+ minutes for optimization, edge cases, and discussion. Interviewers watch for:

1. **Trade-off awareness**: Can you explain why you chose BFS over DFS for shortest path?
2. **Code clarity**: Variables named `visited` not `v`, helper functions for state generation.
3. **Early termination**: Do you check `if start == target` immediately?
4. **Memory management**: Using a `Set` for visited states, not a List.

The right answer with messy code is a yellow flag. A clean, well-communicated solution that's 95% optimal is often better than a perfect but opaque one.

## Key Differences from Easy Problems

Easy problems test syntax and single-concept application. Medium problems require **orchestration**. The new skills are:

- **Multi-step reasoning**: "First, I'll build an adjacency list from the edge list, then run BFS."
- **State representation**: Choosing between tuple, string, or custom object for visited tracking.
- **Cycle prevention**: The `visited` set in BFS/DFS—absent from most Easy tree problems.
- **Level-order tracking**: That `for _ in range(len(queue))` loop is critical for counting steps.

The mindset shift: you're no longer implementing an algorithm, you're adapting one. The BFS template above isn't memorized; it's understood and modified.

## Specific Patterns for Medium

**1. In-order Traversal for BST Validation**
eBay loves binary search trees for modeling hierarchical data (product categories). Validating a BST isn't just checking left < root < right; it's ensuring the entire left subtree is smaller. The efficient approach uses in-order traversal tracking the previous value.

<div class="code-group">

```python
def is_valid_bst(root):
    prev = None

    def inorder(node):
        nonlocal prev
        if not node:
            return True
        if not inorder(node.left):
            return False
        if prev is not None and node.val <= prev:
            return False
        prev = node.val
        return inorder(node.right)

    return inorder(root)

# Time: O(n) | Space: O(h) for recursion stack
```

```javascript
function isValidBST(root) {
  let prev = null;

  function inorder(node) {
    if (!node) return true;
    if (!inorder(node.left)) return false;
    if (prev !== null && node.val <= prev) return false;
    prev = node.val;
    return inorder(node.right);
  }

  return inorder(root);
}

// Time: O(n) | Space: O(h)
```

```java
class Solution {
    private Integer prev = null;

    public boolean isValidBST(TreeNode root) {
        return inorder(root);
    }

    private boolean inorder(TreeNode node) {
        if (node == null) return true;
        if (!inorder(node.left)) return false;
        if (prev != null && node.val <= prev) return false;
        prev = node.val;
        return inorder(node.right);
    }
}

// Time: O(n) | Space: O(h)
```

</div>

**2. Two-Pointer with Sliding Window for Substrings**
Many eBay Medium problems involve finding optimal substrings or subarrays—think "longest listing title without repeating characters" or "minimum window containing all search terms." The sliding window pattern appears constantly.

## Practice Strategy

Don't just solve problems; solve them in eBay's context. Here's a 3-week plan:

1. **Week 1 - Pattern Recognition**: Solve 15 problems focusing on the patterns above. Mix: 5 BFS/DFS, 5 tree, 5 array/string. Time yourself: 25 minutes max per problem.
2. **Week 2 - eBay's Top Hits**: Target eBay's most frequent Medium questions: Word Ladder (#127), Binary Tree Level Order Traversal (#102), Longest Substring Without Repeating Characters (#3). Solve each twice—once for correctness, once for optimality.
3. **Week 3 - Mock Interviews**: Do 2-3 full mock interviews with the 30-minute constraint. Verbalize your thought process like you would onsite.

Daily target: 2-3 Medium problems with 30 minutes of review. For each problem, write down: 1) The core pattern, 2) One edge case you missed initially, 3) The time/space complexity. This creates a feedback loop faster than brute-force solving.

Remember: eBay's Medium questions are designed to see if you can be the engineer who ships features, not just solves puzzles. Your code should look like it belongs in their codebase.

[Practice Medium eBay questions](/company/ebay/medium)
