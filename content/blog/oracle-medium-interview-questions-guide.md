---
title: "Medium Oracle Interview Questions: Strategy Guide"
description: "How to tackle 205 medium difficulty questions from Oracle — patterns, time targets, and practice tips."
date: "2032-02-01"
category: "tips"
tags: ["oracle", "medium", "interview prep"]
---

Medium questions at Oracle typically focus on core data structures, algorithmic thinking, and clean implementation. They are less about obscure tricks and more about applying fundamental computer science concepts to solve practical problems efficiently. You'll encounter problems involving arrays, strings, trees, graphs, and common design patterns. Success hinges on a systematic approach rather than raw memorization.

## Common Patterns

Oracle's Medium problems often test a few key areas. Mastering these patterns is crucial.

**Tree and Graph Traversals:** Questions frequently involve binary trees (BST operations, LCA, path sums) and graph searches (BFS/DFS for connectivity, shortest path in unweighted graphs). You must handle recursion and iteration fluently.

<div class="code-group">

```python
# DFS on a binary tree to find a path sum.
def has_path_sum(root, target):
    if not root:
        return False
    if not root.left and not root.right:
        return target == root.val
    new_target = target - root.val
    return (has_path_sum(root.left, new_target) or
            has_path_sum(root.right, new_target))
```

```javascript
// DFS on a binary tree to find a path sum.
function hasPathSum(root, target) {
  if (!root) return false;
  if (!root.left && !root.right) return target === root.val;
  const newTarget = target - root.val;
  return hasPathSum(root.left, newTarget) || hasPathSum(root.right, newTarget);
}
```

```java
// DFS on a binary tree to find a path sum.
public boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return targetSum == root.val;
    int newTarget = targetSum - root.val;
    return hasPathSum(root.left, newTarget) || hasPathSum(root.right, newTarget);
}
```

</div>

**Array/String Manipulation:** Problems like subarray sums, two-pointer techniques (e.g., removing duplicates, palindrome checks), and sliding window for substring problems are common. You need to optimize for O(n) time.

**Dynamic Programming:** Expect problems involving classic DP patterns such as knapsack variations, longest increasing subsequence, or counting ways. The focus is on defining the state and transition clearly.

## Time Targets

In a 45-60 minute interview, you should aim to solve a Medium problem within 25-30 minutes. This includes:

- **5 minutes:** Understanding the problem, asking clarifying questions, and discussing edge cases.
- **10-15 minutes:** Designing the algorithm, explaining your approach (including time/space complexity), and getting interviewer buy-in.
- **10 minutes:** Writing clean, correct code in your chosen language.
- **Remaining time:** Walking through a test case, discussing optimizations, or handling a follow-up question. Pacing is critical; practice under timed conditions.

## Practice Strategy

Don't just solve problems passively. Use a targeted method:

1. **Pattern-First Practice:** Sort Oracle's Medium questions by frequency or pattern. Solve all problems for a specific pattern (e.g., "BFS") in one session to build deep intuition.
2. **Simulate the Interview:** For each problem, set a 25-minute timer. Verbally explain your thought process as you would to an interviewer. This builds communication skills under pressure.
3. **Post-Solution Analysis:** After solving, review the optimal solution. If your approach differed, analyze why. Write down the key insight you missed. This turns every problem into a learning opportunity.
4. **Focus on Implementation Quality:** Oracle values robust, readable code. Practice writing bug-free code on the first try. Use meaningful variable names and add brief comments for complex logic.

Consistent, deliberate practice on these core patterns will build the fluency needed to pass the technical screen.

[Practice Medium Oracle questions](/company/oracle/medium)
