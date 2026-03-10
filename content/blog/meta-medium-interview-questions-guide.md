---
title: "Medium Meta Interview Questions: Strategy Guide"
description: "How to tackle 762 medium difficulty questions from Meta — patterns, time targets, and practice tips."
date: "2031-12-19"
category: "tips"
tags: ["meta", "medium", "interview prep"]
---

# Medium Meta Interview Questions: Strategy Guide

Meta has 762 Medium questions out of 1387 total. That's 55% of their problem bank. If you're preparing for a Meta interview, Medium difficulty questions aren't just important — they're the entire game. Getting comfortable with this difficulty level is what separates candidates who pass from those who don't.

Meta's Medium questions have a distinct character. While Easy problems test basic syntax and simple algorithms, Medium problems at Meta are designed to test your ability to navigate complexity while maintaining clean, production-quality code. They're not about obscure algorithms, but about applying fundamental patterns to realistic data processing scenarios you'd encounter at a company handling billions of users. You'll see problems involving trees, graphs, arrays, strings, and system design concepts — but always with a twist that requires careful thought about edge cases and optimization.

## Common Patterns and Templates

Meta's Medium problems heavily favor a few core patterns that reflect their engineering priorities:

1. **Tree/Graph Traversal with State** — Not just BFS/DFS, but traversals where you need to track additional information (path sums, parent-child relationships, visited states)
2. **Array/String Manipulation with Two Pointers** — Often with a sliding window or fast/slow pointer approach
3. **Hash Map with Preprocessing** — Using auxiliary data structures to reduce time complexity
4. **Recursion with Memoization** — Dynamic programming problems that aren't explicitly labeled as DP

The most common pattern you'll see is **Tree Traversal with Additional State Tracking**. Here's the template you should have memorized:

<div class="code-group">

```python
# Template: Tree Traversal with State Tracking
# Time: O(n) | Space: O(h) where h is tree height
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def solve_tree_problem(root):
    if not root:
        return 0  # or appropriate base case

    # Initialize state (could be sum, count, max/min value, etc.)
    state = 0
    result = 0

    def dfs(node, current_state):
        nonlocal result

        if not node:
            return

        # Update state based on current node
        updated_state = current_state + node.val  # Example: path sum

        # Check condition (could be at leaf node or any node)
        if not node.left and not node.right:
            # Leaf node - process complete path
            result = max(result, updated_state)  # Example: max path sum
            return

        # Recursive calls with updated state
        dfs(node.left, updated_state)
        dfs(node.right, updated_state)

    dfs(root, state)
    return result
```

```javascript
// Template: Tree Traversal with State Tracking
// Time: O(n) | Space: O(h) where h is tree height
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function solveTreeProblem(root) {
  if (!root) return 0; // or appropriate base case

  let result = 0;

  function dfs(node, currentState) {
    if (!node) return;

    // Update state based on current node
    const updatedState = currentState + node.val; // Example: path sum

    // Check condition
    if (!node.left && !node.right) {
      // Leaf node
      result = Math.max(result, updatedState);
      return;
    }

    // Recursive calls
    dfs(node.left, updatedState);
    dfs(node.right, updatedState);
  }

  dfs(root, 0);
  return result;
}
```

```java
// Template: Tree Traversal with State Tracking
// Time: O(n) | Space: O(h) where h is tree height
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    private int result = 0;

    public int solveTreeProblem(TreeNode root) {
        if (root == null) return 0;
        dfs(root, 0);
        return result;
    }

    private void dfs(TreeNode node, int currentState) {
        if (node == null) return;

        int updatedState = currentState + node.val;

        if (node.left == null && node.right == null) {
            result = Math.max(result, updatedState);
            return;
        }

        dfs(node.left, updatedState);
        dfs(node.right, updatedState);
    }
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Meta, you should aim to:

- **First 5 minutes**: Understand the problem, ask clarifying questions, identify edge cases
- **Next 10 minutes**: Develop and explain your approach, get interviewer buy-in
- **Next 15 minutes**: Write clean, working code with proper variable names
- **Last 5 minutes**: Test with examples, discuss edge cases, analyze complexity

Total: ~35 minutes per problem. Meta typically gives 2 problems in 45 minutes, so you need to be efficient.

Beyond correctness, Meta interviewers watch for:

1. **Code quality** — Variable names, function decomposition, readability
2. **Communication** — Explaining your thought process before coding
3. **Edge case handling** — Null inputs, empty arrays, single element cases
4. **Trade-off awareness** — Knowing when to optimize and when readability matters more

## Key Differences from Easy Problems

The jump from Easy to Medium at Meta isn't about learning new data structures — it's about managing complexity. Easy problems might ask "find the maximum in an array." Medium problems ask "find the maximum sum of a contiguous subarray of length k where elements can be negative, and return the starting indices of all such subarrays."

New techniques required:

1. **State management** in recursive functions (like the tree template above)
2. **Multiple pointer coordination** (not just two pointers, but sometimes three)
3. **Space-time tradeoff decisions** — knowing when to use O(n) space to get O(n) time
4. **Backtracking with pruning** — trying possibilities but cutting off dead ends early

The mindset shift: Easy problems are about implementing a known solution. Medium problems are about designing a solution given constraints and requirements.

## Specific Patterns for Medium

**Pattern 1: Modified Binary Search**
Meta loves binary search variations where the array isn't perfectly sorted or you're searching for something other than exact matches. Problems like "Find First and Last Position of Element in Sorted Array" (#34) or "Search in Rotated Sorted Array" (#33) test your understanding of binary search boundaries.

**Pattern 2: Graph BFS with Level Tracking**
Unlike simple BFS, Meta's Medium problems often require processing level-by-level. The template involves using a queue but tracking when you've finished a level:

```python
from collections import deque

def level_order_traversal(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        current_level = []

        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(current_level)

    return result
```

**Pattern 3: Sliding Window with Hash Map**
For substring problems, the pattern involves maintaining a window with character counts. "Longest Substring Without Repeating Characters" (#3) is the classic, but Meta extends this to problems with replacement allowances or multiple character types.

## Practice Strategy

Don't just solve problems — solve them strategically:

1. **First 2 weeks**: Focus on pattern recognition. Solve 3 problems daily: 1 tree/graph, 1 array/string, 1 from another category. Always implement the solution in your strongest language first, then re-implement in other languages you might use.

2. **Week 3**: Time yourself. Give yourself 35 minutes per problem. If you can't solve it, study the solution, wait 24 hours, then re-attempt without help.

3. **Final week**: Mock interviews. Have someone give you 2 Medium problems in 45 minutes. Record yourself and review your communication.

Recommended order for Meta Medium problems:

1. Start with high-frequency problems: "Binary Tree Level Order Traversal" (#102), "Clone Graph" (#133), "Lowest Common Ancestor of a Binary Tree" (#236)
2. Move to array problems: "Product of Array Except Self" (#238), "Find All Anagrams in a String" (#438)
3. Finish with graph problems: "Number of Islands" (#200), "Course Schedule" (#207)

Daily target: 3-5 Medium problems with full analysis. Quality over quantity — understanding why a solution works is more important than checking off boxes.

Remember: At Meta, Medium problems are where interviews are won or lost. They're testing not just whether you can code, but whether you can think systematically about real engineering problems.

[Practice Medium Meta questions](/company/meta/medium)
