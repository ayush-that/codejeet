---
title: "Depth-First Search Questions at Meesho: What to Expect"
description: "Prepare for Depth-First Search interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-25"
category: "dsa-patterns"
tags: ["meesho", "depth-first-search", "interview prep"]
---

## Why Depth-First Search Matters at Meesho

Meesho is a social commerce platform connecting suppliers with resellers. Their engineering challenges involve catalog navigation, recommendation trees, user relationship graphs, and inventory dependency resolution—all domains where Depth-First Search (DFS) naturally appears. With 4 out of 44 tagged problems being DFS-specific, it's not their most frequent topic, but it's a critical one. In real interviews, you're more likely to encounter DFS as a _component_ of a larger problem rather than a standalone "traverse this graph" question. For example, you might need DFS to explore state spaces in a feature configuration problem or to validate hierarchical data relationships. The key insight: Meesho uses DFS to solve _product_ problems, not academic ones.

## Specific Patterns Meesho Favors

Meesho's DFS questions lean heavily toward **tree and graph traversal on implicit structures**, not explicit adjacency lists. You'll rarely get a classic "Graph DFS" problem. Instead, you'll work with:

1. **Matrix Traversal (Grid DFS)**: Problems like "Number of Islands" but with a twist—perhaps counting specific types of connected supplier regions or validating warehouse layouts.
2. **Tree Path Problems**: Finding paths in n-ary trees that meet business logic constraints (e.g., "all nodes in the path must have a discount flag set").
3. **Backtracking with Pruning**: Exploring configurations where early exit conditions are based on business rules. Think "generate all valid coupon code combinations" rather than generic subsets.

They strongly prefer **recursive implementations** because they're clearer for tree problems and easier to modify with custom logic. Iterative stack-based DFS is less common in their problem set.

<div class="code-group">

```python
# Pattern: Matrix DFS with a visited set
# Problem type: Counting connected components in a grid (e.g., LeetCode #200 Number of Islands)
# Time: O(rows * cols) | Space: O(rows * cols) in worst case due to recursion stack/visited set
def count_components(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    visited = set()
    count = 0

    def dfs(r, c):
        # Base cases: out of bounds, already visited, or "water" cell
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            grid[r][c] == '0' or (r, c) in visited):
            return

        visited.add((r, c))
        # Explore all 4 directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                dfs(r, c)
                count += 1

    return count
```

```javascript
// Pattern: Matrix DFS with a visited set
// Time: O(rows * cols) | Space: O(rows * cols)
function countComponents(grid) {
  if (!grid.length) return 0;

  const rows = grid.length,
    cols = grid[0].length;
  const visited = new Set();
  let count = 0;

  function dfs(r, c) {
    if (
      r < 0 ||
      r >= rows ||
      c < 0 ||
      c >= cols ||
      grid[r][c] === "0" ||
      visited.has(`${r},${c}`)
    ) {
      return;
    }

    visited.add(`${r},${c}`);
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1" && !visited.has(`${r},${c}`)) {
        dfs(r, c);
        count++;
      }
    }
  }

  return count;
}
```

```java
// Pattern: Matrix DFS with a visited array
// Time: O(rows * cols) | Space: O(rows * cols)
public int countComponents(char[][] grid) {
    if (grid.length == 0) return 0;

    int rows = grid.length, cols = grid[0].length;
    boolean[][] visited = new boolean[rows][cols];
    int count = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1' && !visited[r][c]) {
                dfs(grid, r, c, visited);
                count++;
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c, boolean[][] visited) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length ||
        grid[r][c] == '0' || visited[r][c]) {
        return;
    }

    visited[r][c] = true;
    dfs(grid, r + 1, c, visited);
    dfs(grid, r - 1, c, visited);
    dfs(grid, r, c + 1, visited);
    dfs(grid, r, c - 1, visited);
}
```

</div>

## How to Prepare

Focus on clean, recursive implementations with clear base cases. Meesho interviewers care about code readability because they're evaluating how you'd write production code. Practice these variations:

1. **DFS with return values**: Where the recursive function returns a result (like max depth or path sum).
2. **DFS with side effects**: Where the function modifies an external structure (like collecting all paths).
3. **DFS with early stopping**: Where you prune branches based on conditions.

Always discuss trade-offs between recursion (stack overflow risk) vs iteration (explicit stack management). For Meesho's typical problem sizes, recursion is fine, but mention the caveat.

<div class="code-group">

```python
# Pattern: Tree DFS with path collection (LeetCode #257 Binary Tree Paths variant)
# Time: O(n) | Space: O(h) for recursion stack, where h is tree height
def find_all_paths(root):
    if not root:
        return []

    paths = []

    def dfs(node, current_path):
        # Add current node's value to the path
        current_path.append(str(node.val))

        # If leaf node, save the path
        if not node.left and not node.right:
            paths.append("->".join(current_path))
        else:
            if node.left:
                dfs(node.left, current_path)
            if node.right:
                dfs(node.right, current_path)

        # Backtrack: remove current node before returning
        current_path.pop()

    dfs(root, [])
    return paths
```

```javascript
// Pattern: Tree DFS with path collection
// Time: O(n) | Space: O(h)
function findAllPaths(root) {
  if (!root) return [];

  const paths = [];

  function dfs(node, currentPath) {
    currentPath.push(node.val.toString());

    if (!node.left && !node.right) {
      paths.push(currentPath.join("->"));
    } else {
      if (node.left) dfs(node.left, currentPath);
      if (node.right) dfs(node.right, currentPath);
    }

    currentPath.pop();
  }

  dfs(root, []);
  return paths;
}
```

```java
// Pattern: Tree DFS with path collection
// Time: O(n) | Space: O(h)
public List<String> findAllPaths(TreeNode root) {
    List<String> paths = new ArrayList<>();
    if (root == null) return paths;

    dfs(root, new StringBuilder(), paths);
    return paths;
}

private void dfs(TreeNode node, StringBuilder currentPath, List<String> paths) {
    int len = currentPath.length();
    if (len > 0) currentPath.append("->");
    currentPath.append(node.val);

    if (node.left == null && node.right == null) {
        paths.add(currentPath.toString());
    } else {
        if (node.left != null) dfs(node.left, currentPath, paths);
        if (node.right != null) dfs(node.right, currentPath, paths);
    }

    currentPath.setLength(len); // Backtrack
}
```

</div>

## How Meesho Tests DFS vs Other Companies

At large tech companies (FAANG), DFS problems often test pure algorithmic mastery—complex graph theory with cycle detection or topological sorting. At Meesho, DFS is applied to **domain-specific scenarios**. You might get a problem like: "Given a catalog category tree, find all categories where inventory is below threshold" (a filtered DFS). The difficulty is moderate—typically LeetCode Medium—but the challenge is adapting standard patterns to business constraints.

What's unique: Meesho problems often have **multiple valid traversal approaches**, and they want you to discuss which is most efficient for their specific data characteristics (e.g., "Our category tree is wide but shallow, so DFS is better than BFS for memory").

## Study Order

1. **Basic Tree Traversal** (Preorder, Inorder, Postorder) - Foundation for all tree DFS.
2. **Path Problems in Trees** - Learn to carry state through recursion (path sums, path lists).
3. **Matrix/Grid DFS** - Essential for implicit graph problems.
4. **Backtracking** - DFS with pruning, crucial for configuration problems.
5. **Graph Cycle Detection** - Less common but good to know for dependency issues.
6. **Memoized DFS (DFS + DP)** - For optimization problems like "maximum path with constraints".

This order builds from simple recursion to state management to optimization—exactly how Meesho interviews progress.

## Recommended Practice Order

Solve these in sequence:

1. LeetCode #94 Binary Tree Inorder Traversal (basic recursion)
2. LeetCode #112 Path Sum (carrying state)
3. LeetCode #200 Number of Islands (grid DFS)
4. LeetCode #79 Word Search (backtracking with pruning)
5. LeetCode #133 Clone Graph (graph DFS with visited tracking)
6. LeetCode #337 House Robber III (DFS with memoization—tree DP)

After these, try Meesho's tagged DFS problems. You'll notice they combine patterns from multiple problems above.

[Practice Depth-First Search at Meesho](/company/meesho/depth-first-search)
