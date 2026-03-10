---
title: "Medium Apple Interview Questions: Strategy Guide"
description: "How to tackle 206 medium difficulty questions from Apple — patterns, time targets, and practice tips."
date: "2032-01-18"
category: "tips"
tags: ["apple", "medium", "interview prep"]
---

Apple's Medium interview questions represent the core of their technical assessment. While Easy problems test basic competency, and Hard problems separate exceptional candidates, Medium questions determine whether you have the systematic thinking and clean coding skills Apple values. With 206 Medium questions out of 356 total, this is where most interviews are won or lost.

What makes Apple's Medium problems distinct is their focus on **practical implementation of core data structures** rather than obscure algorithmic tricks. You'll frequently encounter problems involving trees (especially binary trees), arrays/strings with constraints, and graph traversals applied to real-world scenarios like file systems or UI hierarchies. The jump from Easy isn't about complexity theory—it's about managing multiple moving parts while maintaining clean, production-ready code.

## Common Patterns and Templates

Apple's Medium problems heavily favor these categories:

1. **Binary Tree Manipulation** (path sums, transformations, LCA variations)
2. **Array/String Processing with State** (requires tracking multiple pointers or windows)
3. **Graph Traversal with Conditions** (BFS/DFS with early termination or path recording)
4. **Design Questions with Implementation** (simplified versions of system design)

The most frequent pattern across these is **recursive tree processing with state propagation**. Here's the template you'll adapt repeatedly:

<div class="code-group">

```python
# Template: Tree DFS with state propagation
# Time: O(n) | Space: O(h) for recursion stack
def solve_tree_problem(root):
    # Define result container (often a list or single value)
    result = []

    def dfs(node, state):
        if not node:
            return base_case_value

        # Update state based on current node
        new_state = modify_state(state, node.val)

        # Check termination conditions (leaf, target reached, etc.)
        if is_leaf(node) or should_terminate(new_state):
            process_result(result, new_state)
            return

        # Recursive calls with state propagation
        if node.left:
            dfs(node.left, new_state)
        if node.right:
            dfs(node.right, new_state)

    dfs(root, initial_state)
    return result

# Example adaptation for Path Sum II (LeetCode #113)
def pathSum(root, targetSum):
    result = []

    def dfs(node, current_sum, path):
        if not node:
            return

        current_sum += node.val
        path.append(node.val)

        if not node.left and not node.right:  # Leaf check
            if current_sum == targetSum:
                result.append(list(path))  # Copy the path
        else:
            dfs(node.left, current_sum, path)
            dfs(node.right, current_sum, path)

        path.pop()  # Backtrack

    dfs(root, 0, [])
    return result
```

```javascript
// Template: Tree DFS with state propagation
// Time: O(n) | Space: O(h) for recursion stack
function solveTreeProblem(root) {
  const result = [];

  function dfs(node, state) {
    if (!node) return;

    const newState = modifyState(state, node.val);

    if (isLeaf(node) || shouldTerminate(newState)) {
      processResult(result, newState);
      return;
    }

    if (node.left) dfs(node.left, newState);
    if (node.right) dfs(node.right, newState);
  }

  dfs(root, initialState);
  return result;
}

// Example adaptation for Path Sum II (LeetCode #113)
function pathSum(root, targetSum) {
  const result = [];

  function dfs(node, currentSum, path) {
    if (!node) return;

    currentSum += node.val;
    path.push(node.val);

    if (!node.left && !node.right) {
      if (currentSum === targetSum) {
        result.push([...path]); // Copy the path
      }
    } else {
      dfs(node.left, currentSum, path);
      dfs(node.right, currentSum, path);
    }

    path.pop(); // Backtrack
  }

  dfs(root, 0, []);
  return result;
}
```

```java
// Template: Tree DFS with state propagation
// Time: O(n) | Space: O(h) for recursion stack
class Solution {
    public List<List<Integer>> solveTreeProblem(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        dfs(root, initialState, result);
        return result;
    }

    private void dfs(TreeNode node, State state, List<List<Integer>> result) {
        if (node == null) return;

        State newState = modifyState(state, node.val);

        if (isLeaf(node) || shouldTerminate(newState)) {
            processResult(result, newState);
            return;
        }

        dfs(node.left, newState, result);
        dfs(node.right, newState, result);
    }
}

// Example adaptation for Path Sum II (LeetCode #113)
class PathSumSolution {
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> result = new ArrayList<>();
        dfs(root, targetSum, 0, new ArrayList<>(), result);
        return result;
    }

    private void dfs(TreeNode node, int target, int currentSum,
                     List<Integer> path, List<List<Integer>> result) {
        if (node == null) return;

        currentSum += node.val;
        path.add(node.val);

        if (node.left == null && node.right == null) {
            if (currentSum == target) {
                result.add(new ArrayList<>(path)); // Copy the path
            }
        } else {
            dfs(node.left, target, currentSum, path, result);
            dfs(node.right, target, currentSum, path, result);
        }

        path.remove(path.size() - 1); // Backtrack
    }
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For Apple Medium problems, you should aim for:

- **15-20 minutes** for complete solution (discussion + implementation + testing)
- **5-7 minutes** for problem understanding and verbalizing approach
- **8-10 minutes** for coding
- **3-5 minutes** for testing with edge cases

Beyond correctness, Apple interviewers watch for:

1. **Code organization** - Can they easily map your code to the problem statement?
2. **State management** - How cleanly do you track multiple variables through recursion/iteration?
3. **Early optimization** - Do you identify the optimal approach quickly, or waste time on suboptimal solutions?
4. **Apple-specific thinking** - Do you consider memory efficiency (important for mobile devices) and readability (important for large codebases)?

The strongest signal you can send is **finishing early and using the extra time to discuss tradeoffs**. Say something like: "This runs in O(n) time with O(h) space. We could reduce space to O(1) using Morris traversal, but that would sacrifice readability—which approach would you prefer given Apple's codebase standards?"

## Key Differences from Easy Problems

Easy problems at Apple typically involve:

- Single-pass solutions
- One primary data structure
- Straightforward edge cases
- Obvious optimal approaches

Medium problems introduce:

- **Multiple constraints** that interact (e.g., "find all paths where sum equals target AND length is even")
- **State that persists across recursive calls or iterations**
- **Backtracking requirements** (adding/removing from collections)
- **Early termination conditions** that aren't just "reached the end"
- **Space-time tradeoff decisions** that aren't obvious

The mindset shift: Instead of looking for "the trick," focus on **systematic decomposition**. Break the problem into: (1) traversal method, (2) state to track, (3) termination conditions, (4) result collection. This structured approach consistently works across Apple's Medium problems.

## Specific Patterns for Medium

**Pattern 1: In-place Array Transformation**
Apple loves problems where you manipulate arrays without extra space, simulating real-world memory constraints. Example: Sort Colors (LeetCode #75).

**Pattern 2: Binary Tree Construction from Traversals**
Given inorder and preorder/postorder traversals, reconstruct the tree. This tests understanding of tree structure and recursive partitioning.

**Pattern 3: Limited BFS with Level Tracking**
Unlike simple BFS, these problems require processing nodes level-by-level or tracking distances. Example: Binary Tree Right Side View (LeetCode #199).

## Practice Strategy

1. **Start with tree problems** (40% of Apple Mediums) - Master the template above
2. **Move to array/string problems with constraints** (30%) - Focus on in-place operations
3. **Practice graph traversals** (20%) - Especially on matrix representations
4. **Leave design-implementation hybrids** (10%) for last

Daily targets:

- Week 1-2: 2 tree problems daily, fully implementing and testing
- Week 3-4: 2 array problems + 1 tree review daily
- Week 5-6: Mixed practice - 3 random Apple Mediums daily

Always time yourself and verbalize your thinking. The goal isn't just to solve, but to solve _communicatively_ within 20 minutes.

[Practice Medium Apple questions](/company/apple/medium)
