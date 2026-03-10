---
title: "Medium Wix Interview Questions: Strategy Guide"
description: "How to tackle 31 medium difficulty questions from Wix — patterns, time targets, and practice tips."
date: "2032-08-27"
category: "tips"
tags: ["wix", "medium", "interview prep"]
---

Wix’s interview coding questions have a distinct flavor. While many companies pull directly from the LeetCode canon, Wix’s 31 Medium problems (out of their 56 total) often feel more _applied_. They are less about abstract algorithmic gymnastics and more about testing your ability to model a real-world scenario, manipulate data structures cleanly, and write robust, production-like code. The jump from Easy to Medium here isn't just about a more complex algorithm; it's about integrating several concepts—like traversal, state management, and object-oriented design—into a single, coherent solution. If Easy questions ask, "Can you implement a basic BFS?", Medium questions ask, "Can you design a system to serialize this custom tree structure and then optimize its traversal under memory constraints?"

## Common Patterns and Templates

Wix's Medium problems heavily favor **tree/graph traversal with state** and **array/string manipulation with systematic iteration**. You'll rarely see dynamic programming or complex mathematical puzzles. Instead, you'll be asked to traverse a structure while maintaining auxiliary data (like a path, a set of visited nodes with conditions, or a frequency map) to solve a problem. The most common pattern by far is **Depth-First Search (DFS) on a tree or graph where you need to pass information down and bubble results up**.

Here’s the universal template for this pattern. Master this, and you can solve a significant portion of Wix's Medium tree problems.

<div class="code-group">

```python
# Template for Tree DFS with State Passing
# Time: O(N) where N is number of nodes | Space: O(H) for recursion stack, where H is tree height
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def solve_medium_tree_problem(root):
    # Define the DFS function. It often returns an aggregate value (sum, bool, list)
    # and receives state from its parent (running sum, path list, etc.).
    def dfs(node, state):
        # Base case: null node
        if not node:
            # Return a neutral value for the aggregation (0 for sum, True for AND, etc.)
            return 0

        # 1. Update state based on current node (e.g., add to path, update sum)
        new_state = state + node.val

        # 2. Recursively process children, passing the updated state
        left_result = dfs(node.left, new_state)
        right_result = dfs(node.right, new_state)

        # 3. At this node, compute the result to return to parent.
        # This could be an aggregation of children's results or a check against the state.
        result = max(left_result, right_result)

        # Optional: Perform a global update (e.g., update a max_path variable)
        # nonlocal max_path
        # max_path = max(max_path, left_result + right_result + node.val)

        return result

    # Initialize any global state if needed (like a max_path variable)
    # max_path = float('-inf')
    return dfs(root, 0)  # Start DFS with initial state (e.g., sum=0)
```

```javascript
// Template for Tree DFS with State Passing
// Time: O(N) | Space: O(H)
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function solveMediumTreeProblem(root) {
  // Define DFS helper. It returns a result and takes a state parameter.
  const dfs = (node, state) => {
    if (!node) {
      return 0; // Neutral value for aggregation
    }

    // 1. Update state with current node's value
    const newState = state + node.val;

    // 2. Recurse on children with the new state
    const leftResult = dfs(node.left, newState);
    const rightResult = dfs(node.right, newState);

    // 3. Compute this node's result to return upward
    const result = Math.max(leftResult, rightResult);

    // Optional: Update a global variable (if declared in outer scope)
    // maxPath = Math.max(maxPath, leftResult + rightResult + node.val);

    return result;
  };

  // let maxPath = -Infinity;
  return dfs(root, 0); // Initial state
}
```

```java
// Template for Tree DFS with State Passing
// Time: O(N) | Space: O(H)
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    // Use a class member for global state if needed
    // private int maxPath = Integer.MIN_VALUE;

    public int solveMediumTreeProblem(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int state) {
        if (node == null) {
            return 0; // Neutral value
        }

        // 1. Update state
        int newState = state + node.val;

        // 2. Recurse
        int leftResult = dfs(node.left, newState);
        int rightResult = dfs(node.right, newState);

        // 3. Compute and return result for this subtree
        int result = Math.max(leftResult, rightResult);

        // Optional: Update global member
        // maxPath = Math.max(maxPath, leftResult + rightResult + node.val);

        return result;
    }
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you should aim to solve a Wix Medium problem in **25-30 minutes**. This leaves ample time for discussion, edge cases, and a potential follow-up. The interviewer isn't just a correctness checker; they're evaluating you as a potential peer. Key signals they watch for:

1.  **Systematic Exploration:** Do you jump straight into code, or do you briefly outline your approach, including data structure choices? A 1-minute verbal plan is gold.
2.  **Code as Communication:** Your variable names should be descriptive (`currentPathSum`, not `s`). Your functions should have a single, clear purpose. This demonstrates you write code for humans, not just compilers.
3.  **Edge Case Hunting:** Before running your code, verbally test it. For tree problems: null root, skewed tree (linked list), tree with negative values. For array problems: empty input, single element, duplicates. Proactively stating these shows defensive programming instincts.
4.  **Trade-off Awareness:** Be prepared to discuss the time/space complexity of your solution and, if asked, potential alternatives. Could you use BFS instead of DFS? What would change?

## Key Differences from Easy Problems

Easy problems at Wix often test a single, isolated concept: reversing a string, a one-pass array sum, or a standard BFS level order traversal. The solution is usually 5-10 lines.

Medium problems require a **synthesis of concepts**. You're not just traversing; you're traversing _while_ building a hash map, or traversing _while_ pruning branches based on a condition. The mindset shift is from "What's the one operation?" to "What are the two or three pieces of state I need to carry with me, and how do they interact at each step?" You must manage complexity by breaking the problem into logical helper functions and cleanly passing state between them.

## Specific Patterns for Medium

Beyond the universal DFS template, watch for these two patterns:

1.  **Simulation with Systematic Iteration:** Problems that ask you to process a 2D grid or array in waves or rounds (e.g., "rotate layers of a matrix," "spiral order"). The key is to define precise boundaries (`topRow`, `bottomRow`, `leftCol`, `rightCol`) and iterate within them, updating the boundaries after each processed layer.

2.  **Hash Map for Frequency/State with Sliding Window:** Used in string problems (e.g., "longest substring with at most K distinct characters"). You maintain a map of character counts within a window defined by two pointers. You expand the right pointer to add characters, and shrink the left pointer when a condition is violated (e.g., number of distinct chars > K), updating the map as you go.

## Practice Strategy

Don't just solve all 31 problems randomly. Group them thematically.

- **Week 1 (Foundation):** Focus on the **Tree/Graph DFS with State** pattern. Solve 8-10 problems in this category. Your goal is to internalize the template so you can adapt it without thinking.
- **Week 2 (Expansion):** Move to **Array/String Simulation & Sliding Window** problems. Solve another 8-10. Practice drawing the iteration boundaries or window movement on a whiteboard (or paper) before coding.
- **Week 3 (Integration & Mock):** Mix the remaining problems. Time yourself. For each problem, spend the first 5 minutes: 1) restating the problem in your own words, 2) sketching 2-3 test cases (including edges), 3) outlining your algorithm and complexity. Then code for 20 minutes. This mimics the interview rhythm.

Aim for **2-3 Medium problems per day** during focused prep, with at least one done in a timed, "interview-silent" setting. Quality over quantity: for each problem, after solving it, review the most elegant community solution. Did they use a more clever state variable? Could your code be refactored to be more readable?

The goal for Wix Medium questions is not to surprise the interviewer with brilliance, but to impress them with **robust, clean, and well-reasoned** code that solves a practical problem. That's the engineer they want to hire.

[Practice Medium Wix questions](/company/wix/medium)
