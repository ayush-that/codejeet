---
title: "Depth-First Search Questions at Zepto: What to Expect"
description: "Prepare for Depth-First Search interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-12-02"
category: "dsa-patterns"
tags: ["zepto", "depth-first-search", "interview prep"]
---

## Why Depth-First Search Matters at Zepto

Zepto's technical interviews have a distinct flavor shaped by their business model. As a quick-commerce company delivering groceries in minutes, their engineering challenges revolve around real-time inventory management, delivery route optimization, and catalog navigation—all domains where graph traversal is fundamental. With DFS appearing in nearly 20% of their technical problems (5 out of 28), it's not just another algorithm; it's a core assessment area.

What's revealing is how they use DFS. Unlike companies that test pure algorithm knowledge, Zepto's DFS questions often simulate real platform scenarios: navigating product category trees, checking inventory availability across warehouse networks, or validating delivery zone connectivity. I've spoken with engineers who interviewed there, and they consistently report that DFS questions come up in either the first technical screen or the onsite system design follow-up. The frequency suggests they're looking for candidates who can think recursively about hierarchical data—exactly what you need when working with nested product catalogs or geographic zones.

## Specific Patterns Zepto Favors

Zepto's DFS problems cluster around three specific patterns that mirror their engineering needs:

**1. Tree Path Problems with Side Effects**
These aren't simple "find the maximum depth" questions. Zepto prefers problems where you traverse a tree while collecting or modifying data along the path. Think **Path Sum II (#113)** or **Binary Tree Maximum Path Sum (#124)**—problems where the recursive function returns one value but might update a global result. This pattern directly translates to their catalog system where you might need to find all product paths matching certain criteria.

**2. Matrix Traversal with Constraints**
Given their focus on delivery logistics, matrix DFS problems frequently appear, particularly those with visitation constraints. **Number of Islands (#200)** is the classic, but Zepto often adds twists like "can only move in certain directions" or "must avoid certain cells"—simulating delivery obstacles or restricted zones. These test both your DFS implementation and your ability to handle state.

**3. Nested Structure Validation**
Problems like **Validate Binary Search Tree (#98)** or **Serialize and Deserialize Binary Tree (#297)** test your understanding of recursive validation and reconstruction. This matters for Zepto because their product data often arrives as nested JSON that must be validated and transformed into their catalog hierarchy.

Here's the matrix traversal pattern you'll almost certainly encounter:

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n) in worst case due to recursion stack
def num_islands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        # Base case: out of bounds or not land
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return

        # Mark as visited
        grid[r][c] = '0'

        # Explore all four directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)

    return count
```

```javascript
// Time: O(m*n) | Space: O(m*n) in worst case
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") {
      return;
    }

    grid[r][c] = "0";

    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}
```

```java
// Time: O(m*n) | Space: O(m*n) in worst case
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length;
    int cols = grid[0].length;
    int count = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }

    return count;
}

private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') {
        return;
    }

    grid[r][c] = '0';

    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
```

</div>

## How to Prepare

Most candidates fail Zepto's DFS questions not because they don't know DFS, but because they can't adapt the pattern to the company's specific constraints. Here's how to prepare effectively:

**Master the State Management Pattern**
Zepto's problems often require tracking multiple pieces of information through the recursion. Practice problems where your DFS function returns one thing but modifies another. For example, in path sum problems, you might return whether a path exists but also collect all valid paths in a list.

**Practice Both Recursive and Iterative Implementations**
While recursion is cleaner for tree problems, Zepto interviewers sometimes ask for iterative solutions to test your understanding of the underlying stack. Be prepared to implement DFS using an explicit stack, especially for tree problems.

**Memorize This Template for Tree DFS:**

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is tree height
def tree_dfs_template(root):
    result = []

    def dfs(node, path):
        if not node:
            return

        # Process current node
        path.append(node.val)

        # Check if leaf node (common Zepto twist)
        if not node.left and not node.right:
            # Do something with complete path
            result.append(list(path))
        else:
            # Recurse on children
            dfs(node.left, path)
            dfs(node.right, path)

        # Backtrack
        path.pop()

    dfs(root, [])
    return result
```

```javascript
// Time: O(n) | Space: O(h)
function treeDfsTemplate(root) {
  const result = [];

  function dfs(node, path) {
    if (!node) return;

    path.push(node.val);

    if (!node.left && !node.right) {
      result.push([...path]);
    } else {
      dfs(node.left, path);
      dfs(node.right, path);
    }

    path.pop();
  }

  dfs(root, []);
  return result;
}
```

```java
// Time: O(n) | Space: O(h)
public List<List<Integer>> treeDfsTemplate(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    dfs(root, path, result);
    return result;
}

private void dfs(TreeNode node, List<Integer> path, List<List<Integer>> result) {
    if (node == null) return;

    path.add(node.val);

    if (node.left == null && node.right == null) {
        result.add(new ArrayList<>(path));
    } else {
        dfs(node.left, path, result);
        dfs(node.right, path, result);
    }

    path.remove(path.size() - 1);
}
```

</div>

## How Zepto Tests Depth-First Search vs Other Companies

At FAANG companies, DFS questions often test pure algorithmic knowledge with optimal time/space complexity as the primary goal. At Zepto, the focus shifts toward practical implementation with real-world constraints:

**Zepto's Unique Approach:**

- **Business context integration:** Problems are often framed around delivery zones, warehouse layouts, or product categories
- **State complexity:** They add more state to track than typical DFS problems (e.g., "also track the minimum value seen so far in the path")
- **Follow-up questions:** Instead of asking for BFS alternative, they might ask "How would this change if we had memory constraints?" reflecting their mobile app considerations

**Compared to Others:**

- **Amazon:** More emphasis on BFS for shortest path (delivery routes)
- **Google:** More theoretical graph theory mixed with DFS
- **Meta:** More tree serialization/deserialization problems
- **Zepto:** Balanced mix of tree and matrix DFS with practical constraints

## Study Order

1. **Basic Tree Traversal** - Start with preorder, inorder, postorder recursion until you can write them from memory. Understand why each traversal order matters for different problems.

2. **Path-Based Problems** - Move to problems where you need to track the path from root to leaf. This introduces backtracking, which is crucial for Zepto's style.

3. **Matrix Traversal** - Practice island-counting variants. Focus on marking visited cells efficiently—Zepto often asks about space optimization here.

4. **Validation Problems** - Learn to validate tree properties recursively. This teaches you to pass information both down and up the recursion tree.

5. **Iterative DFS** - Finally, implement DFS with explicit stacks. This shows deep understanding and prepares you for follow-up questions about stack overflow in production.

This order works because each step builds on the previous one while introducing new state management challenges—exactly how Zepto's interview difficulty progresses.

## Recommended Practice Order

1. **Maximum Depth of Binary Tree (#104)** - Warm up with basic recursion
2. **Path Sum (#112)** - Introduce path tracking
3. **Path Sum II (#113)** - Add result collection (key Zepto pattern)
4. **Validate Binary Search Tree (#98)** - Learn validation with bounds
5. **Number of Islands (#200)** - Switch to matrix traversal
6. **Binary Tree Maximum Path Sum (#124)** - Harder path problem with global state
7. **Serialize and Deserialize Binary Tree (#297)** - Practical tree reconstruction
8. **Clone Graph (#133)** - Graph DFS with visited tracking

After these eight problems, you'll have covered every DFS pattern Zepto uses. Time yourself: you should be able to solve problems 1-5 in under 20 minutes each, and 6-8 in under 30 minutes.

[Practice Depth-First Search at Zepto](/company/zepto/depth-first-search)
