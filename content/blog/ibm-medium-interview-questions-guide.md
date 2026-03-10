---
title: "Medium IBM Interview Questions: Strategy Guide"
description: "How to tackle 102 medium difficulty questions from IBM — patterns, time targets, and practice tips."
date: "2032-03-06"
category: "tips"
tags: ["ibm", "medium", "interview prep"]
---

IBM's coding interview questions have a distinct flavor. With 102 Medium questions out of their 170 total, this difficulty tier is the core of their technical assessment. Unlike some companies where Mediums can be thinly disguised Hards, IBM's Mediums are typically well-defined problems that test a candidate's ability to implement a standard algorithm with a twist, or to combine two fundamental concepts cleanly. The jump from Easy isn't about obscure data structures, but about managing increased complexity in logic, state, or implementation details within familiar domains like arrays, strings, and trees.

## Common Patterns and Templates

IBM heavily favors problems involving **arrays/strings** and **trees**. The most common pattern for their Medium problems is the **Modified Standard Algorithm**. You'll rarely be asked to implement a raw BFS on a binary tree. Instead, you'll be asked to perform a level-order traversal while tracking the maximum value per level, or to validate a BST with additional constraints. The template isn't for a specific algorithm, but for an approach: **1) Identify the core algorithm (DFS, BFS, Two Pointers, Sliding Window). 2) Determine the modification or extra state needed. 3. Implement cleanly, ensuring the modification doesn't break the algorithm's invariants.**

A classic example is performing a BFS but needing to process nodes in a zigzag pattern. The core is BFS; the modification is reversing the order of nodes at alternating levels.

<div class="code-group">

```python
from collections import deque

def zigzag_level_order(root):
    """
    LeetCode #103. Binary Tree Zigzag Level Order Traversal
    Core Algorithm: BFS (Level-order traversal)
    Modification: Reverse the list of node values at odd-numbered levels.
    """
    if not root:
        return []

    result = []
    queue = deque([root])
    left_to_right = True  # State to track direction

    while queue:
        level_size = len(queue)
        current_level = [0] * level_size  # Pre-allocate for efficiency

        for i in range(level_size):
            node = queue.popleft()

            # Determine index based on traversal direction
            index = i if left_to_right else (level_size - 1 - i)
            current_level[index] = node.val

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(current_level)
        left_to_right = not left_to_right  # Flip direction for next level

    return result
# Time: O(n) - each node processed once.
# Space: O(n) - for the output list. Queue holds at most width of tree.
```

```javascript
function zigzagLevelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];
  let leftToRight = true;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = new Array(levelSize);

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      const index = leftToRight ? i : levelSize - 1 - i;
      currentLevel[index] = node.val;

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
    leftToRight = !leftToRight;
  }

  return result;
}
// Time: O(n) | Space: O(n)
```

```java
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean leftToRight = true;

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>(levelSize);
        // Initialize list with placeholder values for index-based assignment
        for (int i = 0; i < levelSize; i++) currentLevel.add(0);

        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            int index = leftToRight ? i : (levelSize - 1 - i);
            currentLevel.set(index, node.val);

            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(currentLevel);
        leftToRight = !leftToRight;
    }
    return result;
}
// Time: O(n) | Space: O(n)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot with one Medium question, aim to have a working, optimal solution within **25-30 minutes**. This leaves 10-15 minutes for discussion, edge cases, and follow-ups. The interviewer isn't just a correctness checker. They're evaluating:

- **Code Quality:** Is your logic compartmentalized? Are variable names clear (`leftToRight` vs. `flag`)? Can they imagine maintaining this code?
- **Edge Case Proactivity:** Do you immediately mention and handle the empty input, single node, or sorted array edge cases? Verbally confirming these shows systematic thinking.
- **Communication of Trade-offs:** Can you explain _why_ your solution is O(n) time and O(n) space? If there's a trade-off (e.g., faster time for more memory), can you justify it?
- **Adaptability:** If they ask, "What if the tree is too deep for recursion?" can you pivot to an iterative approach? This is a common IBM follow-up for tree problems.

## Key Differences from Easy Problems

The leap from Easy to Medium at IBM is defined by two things: **state management** and **multi-step logic**.

1.  **State Management:** Easy problems often require a single pass or a simple counter. Medium problems require you to track and update multiple pieces of state simultaneously. In the zigzag example, you're managing the BFS queue _and_ the directional flag _and_ the index calculation. Missing one breaks the solution.
2.  **Multi-step Logic:** Easy problems are often solvable with one insight. Medium problems require chaining insights. For example, "Group Anagrams" (#49) requires you to a) realize anagrams have identical sorted strings, b) use that as a hash map key, and c) group accordingly. It's not enough to know about sorting or hash maps; you must combine them correctly.

The mindset shift is from "find the trick" to "orchestrate the components." You're no longer just writing a function; you're designing a small system with interacting parts.

## Specific Patterns for Medium

Beyond the modified algorithm template, watch for these:

1.  **Hash Map for Index/Count Tracking:** Problems like "Find All Anagrams in a String" (#438) use a sliding window, but the core challenge is maintaining a character frequency map and efficiently comparing it to a target map.
2.  **In-place Array Manipulation:** IBM asks questions like "Set Matrix Zeroes" (#73). The Medium difficulty comes from the constant-space constraint, forcing you to use the matrix itself to store state, which requires careful planning to avoid overwriting data you need later.

<div class="code-group">

```python
def setZeroes(matrix):
    """
    LeetCode #73. Set Matrix Zeroes
    Pattern: In-place state storage using first row/column as markers.
    """
    m, n = len(matrix), len(matrix[0])
    first_row_has_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_has_zero = any(matrix[i][0] == 0 for i in range(m))

    # Use first row/col as marker space
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0

    # Zero out cells based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0

    # Zero out first row/col if needed
    if first_row_has_zero:
        for j in range(n):
            matrix[0][j] = 0
    if first_col_has_zero:
        for i in range(m):
            matrix[i][0] = 0
# Time: O(m*n) | Space: O(1)
```

</div>

## Practice Strategy

Don't just solve all 102 questions. Practice with intent.

1.  **Pattern-First Approach:** Group problems by pattern (Modified BFS/DFS, Sliding Window + HashMap, In-place Array). Solve 3-4 from the same pattern in one sitting to internalize the template.
2.  **Daily Target:** Aim for 2-3 Medium problems per day under timed conditions (30 minutes max per problem). Spend at least 15 minutes afterward reviewing the optimal solution and writing a clean implementation from memory.
3.  **Recommended Order:** Start with high-frequency patterns: Tree Traversals with modifications, then Array in-place operations, then String/Array sliding window problems. This builds confidence with IBM's most common themes.
4.  **Simulate the Interview:** For every third problem, explain your solution out loud as you code, as if to an interviewer. This builds the crucial muscle memory for communication.

Mastering IBM's Medium tier is about precision, not genius. It's demonstrating you can reliably engineer robust solutions to well-scoped problems—exactly what they need their developers to do daily.

[Practice Medium IBM questions](/company/ibm/medium)
