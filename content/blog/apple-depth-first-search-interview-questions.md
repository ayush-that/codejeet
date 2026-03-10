---
title: "Depth-First Search Questions at Apple: What to Expect"
description: "Prepare for Depth-First Search interview questions at Apple — patterns, difficulty breakdown, and study tips."
date: "2027-06-23"
category: "dsa-patterns"
tags: ["apple", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Apple: What to Expect

Apple has 36 Depth-First Search questions in its tagged LeetCode problems, representing about 10% of their total. This isn't a coincidence — DFS appears frequently in Apple interviews because it's fundamental to solving tree and graph problems, which model everything from file system navigation and UI view hierarchies to network connections and dependency resolution. While not every Apple interview will feature DFS, when it does appear, it's often testing your ability to think recursively about hierarchical structures, which is core to many Apple engineering domains.

What's more telling than the raw count is _how_ Apple uses DFS questions. They rarely ask straightforward "traverse this binary tree" problems. Instead, they embed DFS within more complex scenarios that test multiple concepts simultaneously — often combining tree traversal with path finding, state tracking, or optimization. The DFS becomes the engine, but the real challenge is designing the traversal logic correctly.

## Specific Patterns Apple Favors

Apple's DFS questions tend to fall into three distinct patterns:

1. **Path Problems on Trees**: Finding paths with specific properties, like maximum sum paths, paths that equal a target sum, or longest consecutive sequences. These test your ability to carry state through recursive calls and backtrack appropriately.

2. **Modified Tree Traversal with State**: Problems where you need to traverse a tree while maintaining additional information — like whether a node is a left child, the current depth, or visited status in a cloned graph. Apple loves these because they mirror real-world scenarios like serializing view hierarchies or validating data structures.

3. **DFS on Implicit Graphs**: Problems that don't present as obvious graphs but require DFS thinking, like word search (LeetCode #79) or number of islands (LeetCode #200). These test if you recognize when to apply DFS beyond explicit tree structures.

A classic Apple-style problem is **Binary Tree Maximum Path Sum (LeetCode #124)**. It looks like a simple tree problem but requires careful state management where each recursive call returns one value while potentially updating a global maximum with a different computation.

<div class="code-group">

```python
# LeetCode #124: Binary Tree Maximum Path Sum
# Time: O(n) where n is number of nodes | Space: O(h) for recursion stack
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        self.max_sum = float('-inf')

        def dfs(node):
            if not node:
                return 0

            # Get max path sums from left and right children
            # We use max(0, ...) to discard negative paths
            left_max = max(dfs(node.left), 0)
            right_max = max(dfs(node.right), 0)

            # Current path sum if we use this node as the "root" of the path
            current_path_sum = node.val + left_max + right_max

            # Update global maximum
            self.max_sum = max(self.max_sum, current_path_sum)

            # Return the maximum path sum where this node is part of the path
            # (not the root), so we can only take one branch
            return node.val + max(left_max, right_max)

        dfs(root)
        return self.max_sum
```

```javascript
// LeetCode #124: Binary Tree Maximum Path Sum
// Time: O(n) where n is number of nodes | Space: O(h) for recursion stack
var maxPathSum = function (root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;

    // Get max path sums from left and right children
    // We use Math.max(0, ...) to discard negative paths
    const leftMax = Math.max(dfs(node.left), 0);
    const rightMax = Math.max(dfs(node.right), 0);

    // Current path sum if we use this node as the "root" of the path
    const currentPathSum = node.val + leftMax + rightMax;

    // Update global maximum
    maxSum = Math.max(maxSum, currentPathSum);

    // Return the maximum path sum where this node is part of the path
    // (not the root), so we can only take one branch
    return node.val + Math.max(leftMax, rightMax);
  }

  dfs(root);
  return maxSum;
};
```

```java
// LeetCode #124: Binary Tree Maximum Path Sum
// Time: O(n) where n is number of nodes | Space: O(h) for recursion stack
class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return maxSum;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;

        // Get max path sums from left and right children
        // We use Math.max(0, ...) to discard negative paths
        int leftMax = Math.max(dfs(node.left), 0);
        int rightMax = Math.max(dfs(node.right), 0);

        // Current path sum if we use this node as the "root" of the path
        int currentPathSum = node.val + leftMax + rightMax;

        // Update global maximum
        maxSum = Math.max(maxSum, currentPathSum);

        // Return the maximum path sum where this node is part of the path
        // (not the root), so we can only take one branch
        return node.val + Math.max(leftMax, rightMax);
    }
}
```

</div>

## How to Prepare

Mastering DFS for Apple means going beyond memorizing traversal code. You need to develop intuition for when DFS is appropriate and how to structure the recursive function. Here's the mental framework:

1. **Identify the state**: What information needs to be passed down to children? (parameters)
2. **Identify the return value**: What should each recursive call compute and pass back up? (return type)
3. **Identify side effects**: What global or non-local state might be updated during traversal?
4. **Base cases**: When does the recursion stop?

Practice transforming iterative thinking into recursive thinking. For path problems, a common pattern is the "dual return" approach shown above, where the recursive function returns one value for the parent to use, but may update a separate result.

Another key pattern is DFS with backtracking, common in problems like **Word Search (LeetCode #79)**:

<div class="code-group">

```python
# LeetCode #79: Word Search
# Time: O(m*n*4^L) where L is word length | Space: O(L) for recursion depth
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])

        def dfs(r, c, index):
            # Base case: found the entire word
            if index == len(word):
                return True

            # Boundary and character check
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[index]:
                return False

            # Mark cell as visited
            temp = board[r][c]
            board[r][c] = '#'

            # Explore all four directions
            found = (dfs(r+1, c, index+1) or
                    dfs(r-1, c, index+1) or
                    dfs(r, c+1, index+1) or
                    dfs(r, c-1, index+1))

            # Backtrack: restore original character
            board[r][c] = temp

            return found

        # Try starting from every cell
        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True

        return False
```

```javascript
// LeetCode #79: Word Search
// Time: O(m*n*4^L) where L is word length | Space: O(L) for recursion depth
var exist = function (board, word) {
  const rows = board.length,
    cols = board[0].length;

  function dfs(r, c, index) {
    // Base case: found the entire word
    if (index === word.length) return true;

    // Boundary and character check
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[index]) {
      return false;
    }

    // Mark cell as visited
    const temp = board[r][c];
    board[r][c] = "#";

    // Explore all four directions
    const found =
      dfs(r + 1, c, index + 1) ||
      dfs(r - 1, c, index + 1) ||
      dfs(r, c + 1, index + 1) ||
      dfs(r, c - 1, index + 1);

    // Backtrack: restore original character
    board[r][c] = temp;

    return found;
  }

  // Try starting from every cell
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }

  return false;
};
```

```java
// LeetCode #79: Word Search
// Time: O(m*n*4^L) where L is word length | Space: O(L) for recursion depth
class Solution {
    public boolean exist(char[][] board, String word) {
        int rows = board.length, cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, r, c, word, 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, int r, int c, String word, int index) {
        // Base case: found the entire word
        if (index == word.length()) return true;

        // Boundary and character check
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length ||
            board[r][c] != word.charAt(index)) {
            return false;
        }

        // Mark cell as visited
        char temp = board[r][c];
        board[r][c] = '#';

        // Explore all four directions
        boolean found = dfs(board, r+1, c, word, index+1) ||
                       dfs(board, r-1, c, word, index+1) ||
                       dfs(board, r, c+1, word, index+1) ||
                       dfs(board, r, c-1, word, index+1);

        // Backtrack: restore original character
        board[r][c] = temp;

        return found;
    }
}
```

</div>

## How Apple Tests Depth-First Search vs Other Companies

Apple's DFS questions differ from other companies in subtle but important ways:

- **vs Google**: Google often asks DFS in the context of advanced graph algorithms (Dijkstra, A\*). Apple focuses more on tree problems and implicit graphs that model real iOS/macOS scenarios.
- **vs Facebook/Meta**: Meta leans toward social graph problems (friend recommendations, network propagation). Apple's DFS problems are more about hierarchical data structures.
- **vs Amazon**: Amazon frequently combines DFS with system design (file system operations). Apple's are more algorithmic and self-contained.

Apple interviewers particularly watch for:

1. **Clean recursion management**: They notice if you're uncomfortable with recursive thinking
2. **State handling**: How you pass information between recursive calls
3. **Base case precision**: Off-by-one errors in base cases are common failure points
4. **Space complexity awareness**: Especially for tree traversals where recursion depth matters

The difficulty curve at Apple tends to be: medium DFS problems as a warm-up, followed by hard DFS problems that combine with other concepts (like dynamic programming or memoization).

## Study Order

Don't jump straight into Apple's hardest DFS problems. Build systematically:

1. **Basic Tree Traversals** (preorder, inorder, postorder) - Understand the recursion pattern before adding complexity
2. **Simple Path Problems** - Like finding if a path sum exists (LeetCode #112)
3. **Global State Problems** - Where you need to track a result across the entire traversal
4. **Backtracking Problems** - DFS on grids with state modification and restoration
5. **Graph DFS** - On explicit graph representations (adjacency lists)
6. **Implicit Graph Problems** - Recognizing DFS opportunities in non-obvious structures
7. **Combination Problems** - DFS combined with memoization or other patterns

This order works because each step builds on the previous one. If you struggle with global state problems, it's often because you didn't fully grasp basic traversals. If backtracking confuses you, you might need more practice with state management.

## Recommended Practice Order

Solve these in sequence to build Apple-relevant DFS skills:

1. **Maximum Depth of Binary Tree (LeetCode #104)** - Basic recursion
2. **Path Sum (LeetCode #112)** - Simple path checking
3. **Binary Tree Paths (LeetCode #257)** - Path construction
4. **Sum Root to Leaf Numbers (LeetCode #129)** - Path value accumulation
5. **Longest Univalue Path (LeetCode #687)** - Global maximum tracking
6. **Number of Islands (LeetCode #200)** - Grid DFS
7. **Clone Graph (LeetCode #133)** - Graph DFS with visited tracking
8. **Word Search (LeetCode #79)** - Backtracking pattern
9. **Binary Tree Maximum Path Sum (LeetCode #124)** - Apple's favorite
10. **Serialize and Deserialize Binary Tree (LeetCode #297)** - Combines DFS with serialization

After these, tackle Apple's company-tagged DFS problems. You'll notice they often combine these patterns — a path problem with global state, or a tree traversal with serialization. The key is recognizing which building blocks to use.

[Practice Depth-First Search at Apple](/company/apple/depth-first-search)
