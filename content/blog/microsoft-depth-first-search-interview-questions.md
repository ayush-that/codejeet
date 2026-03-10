---
title: "Depth-First Search Questions at Microsoft: What to Expect"
description: "Prepare for Depth-First Search interview questions at Microsoft — patterns, difficulty breakdown, and study tips."
date: "2027-04-06"
category: "dsa-patterns"
tags: ["microsoft", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Microsoft: What to Expect

Microsoft has 138 Depth-First Search (DFS) questions out of their 1352 total on LeetCode. That’s roughly 10% of their problem set, which is a significant chunk. But what does that mean for your interview? Is DFS a core focus or just another topic in the mix?

In my experience conducting and participating in Microsoft interviews, DFS isn't just a random algorithm they test. It's a fundamental building block for assessing how you think about **systematic exploration** and **state management**. Microsoft builds operating systems, cloud services, and developer tools—systems where understanding dependencies, traversing file directories, or exploring configuration states is daily work. A DFS question isn't just about knowing the algorithm; it's about demonstrating you can model a real-world problem as a graph and navigate it correctly. I’ve seen DFS appear in roughly 1 out of every 3 or 4 technical screens or on-site rounds, often disguised as a tree, grid, or graph problem. It’s a secondary topic in the sense that you won’t get a question that _only_ asks you to implement DFS. It’s a primary topic in that it’s the tool you’ll use to solve a more complex, applied problem.

## Specific Patterns Microsoft Favors

Microsoft’s DFS problems tend to cluster around a few key patterns that reflect their engineering domains.

1.  **Grid Traversal with Constraints (Matrix as Graph):** This is arguably the most common pattern. You’re given a 2D grid (like a map, image, or game board) and asked to explore connected regions, often with a twist. The twist is what Microsoft cares about—it tests if you can incorporate a constraint into your DFS state. Classic examples are "Number of Islands" variations, but Microsoft favorites include problems where you must track additional state beyond `visited`, like a remaining resource (e.g., "Shortest Path in a Grid with Obstacles Elimination").
2.  **Tree Path Problems with Global State:** Microsoft loves tree questions where the solution requires tracking a path from root to leaf and making a decision based on the entire path. This tests your ability to manage state in recursion (passing down, bubbling up) and often combines DFS with simple arithmetic or string building. Think "Binary Tree Maximum Path Sum" or "Sum Root to Leaf Numbers."
3.  **Graph Construction + Traversal (Dependency Resolution):** This pattern mirrors real Microsoft scenarios like build systems (MSBuild) or package management (NuGet). You’re given a list of prerequisites or dependencies and must determine if a valid order exists (cycle detection) or output the order (topological sort via DFS). "Course Schedule" and "Alien Dictionary" are quintessential examples.
4.  **Iterative DFS for Explicit Stack Control:** While recursive DFS is elegant, Microsoft interviewers often probe your understanding of the stack by asking for an iterative version, especially in problems where the recursion depth could be large (deep trees) or where you need to manually manage a complex stack frame. Be ready to convert any recursive solution to an iterative one using an explicit stack.

## How to Prepare

The key is to internalize the DFS skeleton and then learn where to inject the problem-specific logic. Let's look at the most critical variation: **DFS on a grid with a state constraint**. The basic "Number of Islands" DFS marks cells as visited. The advanced version must track, for example, how many obstacles we've removed so far.

Here’s the template for a grid DFS that tracks an extra `k` state (like remaining obstacle removals). This pattern is central to problems like "Shortest Path in a Grid with Obstacles Elimination."

<div class="code-group">

```python
def dfs_grid_with_state(grid, start, k):
    """
    Template for DFS on a grid with an extra state variable.
    This example finds if a target is reachable with <= k obstacle removals.
    """
    rows, cols = len(grid), len(grid[0])
    # Visited set must include state: (r, c, remaining_k)
    visited = set()

    def dfs(r, c, remaining_k):
        # 1. Base cases: out of bounds
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False
        # 2. Check if we've visited this exact state before
        if (r, c, remaining_k) in visited:
            return False
        visited.add((r, c, remaining_k))

        # 3. Handle obstacles: use a removal if we can
        if grid[r][c] == 1:  # 1 represents an obstacle
            if remaining_k <= 0:
                return False
            remaining_k -= 1

        # 4. Check if we reached the target (example: bottom-right)
        if r == rows-1 and c == cols-1:
            return True

        # 5. Recursively explore neighbors
        directions = [(0,1), (1,0), (0,-1), (-1,0)]
        for dr, dc in directions:
            if dfs(r + dr, c + dc, remaining_k):
                return True
        return False

    return dfs(start[0], start[1], k)

# Time Complexity: O(rows * cols * k). In worst case, we visit each cell for each possible k value.
# Space Complexity: O(rows * cols * k) for the visited set and recursion depth.
```

```javascript
function dfsGridWithState(grid, start, k) {
  const rows = grid.length,
    cols = grid[0].length;
  const visited = new Set();

  const dfs = (r, c, remainingK) => {
    // 1. Base cases: out of bounds
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    // 2. Check visited state
    const stateKey = `${r},${c},${remainingK}`;
    if (visited.has(stateKey)) return false;
    visited.add(stateKey);

    // 3. Handle obstacles
    if (grid[r][c] === 1) {
      // obstacle
      if (remainingK <= 0) return false;
      remainingK--;
    }

    // 4. Check target (bottom-right)
    if (r === rows - 1 && c === cols - 1) return true;

    // 5. Explore
    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    for (const [dr, dc] of dirs) {
      if (dfs(r + dr, c + dc, remainingK)) return true;
    }
    return false;
  };

  return dfs(start[0], start[1], k);
}

// Time: O(rows * cols * k) | Space: O(rows * cols * k)
```

```java
public boolean dfsGridWithState(int[][] grid, int[] start, int k) {
    int rows = grid.length, cols = grid[0].length;
    boolean[][][] visited = new boolean[rows][cols][k + 1]; // 3D visited array

    return dfs(start[0], start[1], k, grid, visited);
}

private boolean dfs(int r, int c, int remainingK, int[][] grid, boolean[][][] visited) {
    int rows = grid.length, cols = grid[0].length;
    // 1. Out of bounds
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    // 2. Already visited with same remainingK
    if (visited[r][c][remainingK]) return false;
    visited[r][c][remainingK] = true;

    // 3. Handle obstacle
    if (grid[r][c] == 1) {
        if (remainingK <= 0) return false;
        remainingK--;
    }

    // 4. Check target
    if (r == rows - 1 && c == cols - 1) return true;

    // 5. Explore
    int[][] dirs = {{0,1}, {1,0}, {0,-1}, {-1,0}};
    for (int[] dir : dirs) {
        if (dfs(r + dir[0], c + dir[1], remainingK, grid, visited)) {
            return true;
        }
    }
    return false;
}

// Time: O(rows * cols * k) | Space: O(rows * cols * k) for visited array and recursion stack.
```

</div>

Another essential pattern is **Tree DFS with path accumulation**. Microsoft often asks problems where you need to construct all root-to-leaf paths or compute something along each path.

<div class="code-group">

```python
def all_paths_root_to_leaf(root):
    """
    Classic pattern: DFS to collect all root-to-leaf paths.
    Demonstrates backtracking by appending and popping.
    """
    if not root:
        return []

    all_paths = []
    current_path = []

    def dfs(node):
        # 1. Add current node to path
        current_path.append(node.val)

        # 2. If leaf, save the path
        if not node.left and not node.right:
            all_paths.append(list(current_path)) # copy the path

        # 3. Recurse on children
        if node.left:
            dfs(node.left)
        if node.right:
            dfs(node.right)

        # 4. Backtrack: remove current node before returning
        current_path.pop()

    dfs(root)
    return all_paths

# Time: O(N) where N is nodes, we visit each once.
# Space: O(H) for recursion stack, plus O(N * H) for output list in worst case (balanced tree).
```

```javascript
function allPathsRootToLeaf(root) {
  if (!root) return [];
  const allPaths = [];
  const currentPath = [];

  function dfs(node) {
    // 1. Add node value
    currentPath.push(node.val);

    // 2. If leaf, save copy of path
    if (!node.left && !node.right) {
      allPaths.push([...currentPath]);
    }

    // 3. Recurse
    if (node.left) dfs(node.left);
    if (node.right) dfs(node.right);

    // 4. Backtrack
    currentPath.pop();
  }

  dfs(root);
  return allPaths;
}

// Time: O(N) | Space: O(H) for recursion, O(N * H) for output.
```

```java
public List<List<Integer>> allPathsRootToLeaf(TreeNode root) {
    List<List<Integer>> allPaths = new ArrayList<>();
    if (root == null) return allPaths;
    List<Integer> currentPath = new ArrayList<>();
    dfs(root, currentPath, allPaths);
    return allPaths;
}

private void dfs(TreeNode node, List<Integer> currentPath, List<List<Integer>> allPaths) {
    // 1. Add node value
    currentPath.add(node.val);

    // 2. If leaf, save a copy
    if (node.left == null && node.right == null) {
        allPaths.add(new ArrayList<>(currentPath));
    }

    // 3. Recurse
    if (node.left != null) dfs(node.left, currentPath, allPaths);
    if (node.right != null) dfs(node.right, currentPath, allPaths);

    // 4. Backtrack
    currentPath.remove(currentPath.size() - 1);
}

// Time: O(N) | Space: O(H) recursion, O(N * H) output.
```

</div>

## How Microsoft Tests Depth-First Search vs Other Companies

Microsoft’s DFS questions have a distinct flavor compared to other tech giants.

- **vs. Google:** Google’s DFS problems often lean more toward pure algorithmic cleverness and optimization, sometimes with a mathematical twist. Microsoft’s feel more _applied_—you can often trace the problem back to a scenario in software development (e.g., file system traversal, dependency resolution, game logic on a grid).
- **vs. Amazon:** Amazon’s DFS questions frequently tie directly to data structures from their domain (e.g., product categories as trees, warehouse grids). Microsoft’s are similar but often involve a lower-level or systems-oriented constraint (like memory limits or stack overflows, prompting an iterative solution).
- **vs. Meta:** Meta’s DFS problems on social graphs are famous, often requiring multi-source BFS/DFS. Microsoft’s graph problems are more often about _directed_ dependencies (like in a build system) rather than undirected social connections.

The unique aspect of Microsoft’s approach is the **emphasis on stateful traversal**. It’s rarely just "find all nodes." It’s "find all nodes _given this changing condition_," which tests your ability to design a visited set that accounts for more than just position.

## Study Order

Don’t jump into advanced grid problems. Build your understanding sequentially.

1.  **Basic Tree Traversal (Pre/In/Post-order):** Master recursion on trees. This is the foundation. Understand the call stack.
2.  **Simple Grid DFS (No State):** Solve "Number of Islands" and "Flood Fill." Get comfortable converting a 2D grid into an implicit graph.
3.  **Tree Path Problems:** Practice problems where you accumulate a value along a path ("Path Sum," "Binary Tree Paths"). This teaches you backtracking.
4.  **Graph DFS on Explicit Adjacency Lists:** Learn to handle cycles with a visited set. Do "Clone Graph" and "Keys and Rooms."
5.  **DFS for Cycle Detection & Topological Sort:** This is critical for Microsoft. Master "Course Schedule" I and II.
6.  **Grid DFS with State:** This is the peak. Practice problems where your DFS function signature carries an extra variable (like `k` or `steps`). "Shortest Path in a Grid with Obstacles Elimination" is the classic.
7.  **Iterative DFS:** Finally, learn to implement all the above using an explicit stack. This shows deep understanding and is often an excellent follow-up question.

## Recommended Practice Order

Tackle these Microsoft-tagged problems in this sequence to build complexity naturally:

1.  **Binary Tree Inorder Traversal (#94)** - Master basic tree recursion.
2.  **Number of Islands (#200)** - Learn grid DFS fundamentals.
3.  **Binary Tree Maximum Path Sum (#124)** - Introduces the concept of post-order DFS and global state.
4.  **Clone Graph (#133)** - Graph DFS with a map to handle cycles.
5.  **Course Schedule (#207)** - Cycle detection in directed graphs.
6.  **Alien Dictionary (#269)** - Advanced topological sort (a known Microsoft favorite).
7.  **Shortest Path in a Grid with Obstacles Elimination (#1293)** - The ultimate test of grid DFS with state. Start with BFS, then try DFS to understand the state space.
8.  **Robot Room Cleaner (#489)** - A challenging iterative DFS problem that simulates a real-world API.

Remember, at Microsoft, the goal is to show you can see the "graph" in the problem and traverse it correctly while managing complexity. It’s less about knowing the most obscure algorithm and more about applying a fundamental one with precision to a messy, realistic scenario.

[Practice Depth-First Search at Microsoft](/company/microsoft/depth-first-search)
