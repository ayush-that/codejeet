---
title: "Breadth-First Search Questions at Airbnb: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2029-01-01"
category: "dsa-patterns"
tags: ["airbnb", "breadth-first-search", "interview prep"]
---

## Why Breadth-First Search Matters at Airbnb

Airbnb's engineering problems often model real-world spatial and relational systems: finding available listings within certain constraints, calculating distances between locations, navigating user connections, or processing hierarchical data like organizational charts. This makes Breadth-First Search (BFS) a fundamental tool in their interview arsenal. With 9 out of 64 tagged problems focusing on BFS, it represents approximately 14% of their technical question bank—a significant concentration that places it among their top algorithmic topics.

In real interviews, you're more likely to encounter BFS in problems involving shortest paths, level-order traversal, or state-space search than in pure graph theory. Airbnb interviewers frequently embed BFS within problems that appear to be about arrays or strings initially, requiring you to recognize the underlying graph structure. The key insight is that Airbnb values BFS not as an academic exercise, but as a practical method for solving problems with layered exploration or minimum-distance requirements.

## Specific Patterns Airbnb Favors

Airbnb's BFS problems cluster around three distinct patterns:

1. **Grid/Matrix Traversal with Constraints** - Problems where you navigate a 2D grid with obstacles, often finding the shortest path to a target. These frequently involve multiple valid moves (up/down/left/right) and require tracking visited states.
2. **Level-Order Processing with Side Effects** - Problems where you need to process data layer by layer, often while collecting information or modifying values at each level. This appears in tree problems but also in scenarios where distance propagates through a network.

3. **Multi-Source BFS** - Problems where you start from multiple points simultaneously, commonly used in "distance from nearest" calculations. This is a subtle but important optimization that appears in several Airbnb questions.

For example, **Walls and Gates (#286)** is a classic Airbnb problem that combines grid traversal with multi-source BFS. You're given a grid with rooms, walls, and gates, and need to fill each empty room with the distance to the nearest gate. The efficient solution uses BFS starting from all gates simultaneously.

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n)
def wallsAndGates(rooms):
    """
    LeetCode #286: Fill each empty room with distance to nearest gate.
    -1: wall, 0: gate, INF: empty room
    """
    if not rooms:
        return

    m, n = len(rooms), len(rooms[0])
    queue = collections.deque()
    INF = 2**31 - 1

    # Multi-source BFS: start from all gates
    for i in range(m):
        for j in range(n):
            if rooms[i][j] == 0:
                queue.append((i, j))

    # Standard BFS ensures shortest path
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    distance = 0

    while queue:
        distance += 1
        for _ in range(len(queue)):
            x, y = queue.popleft()

            for dx, dy in directions:
                nx, ny = x + dx, y + dy

                # Valid position and is an empty room
                if 0 <= nx < m and 0 <= ny < n and rooms[nx][ny] == INF:
                    rooms[nx][ny] = distance
                    queue.append((nx, ny))
```

```javascript
// Time: O(m*n) | Space: O(m*n)
function wallsAndGates(rooms) {
  if (!rooms || rooms.length === 0) return;

  const m = rooms.length,
    n = rooms[0].length;
  const queue = [];
  const INF = 2 ** 31 - 1;

  // Multi-source initialization
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rooms[i][j] === 0) {
        queue.push([i, j]);
      }
    }
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let distance = 0;

  while (queue.length > 0) {
    distance++;
    const levelSize = queue.length;

    for (let k = 0; k < levelSize; k++) {
      const [x, y] = queue.shift();

      for (const [dx, dy] of directions) {
        const nx = x + dx,
          ny = y + dy;

        if (nx >= 0 && nx < m && ny >= 0 && ny < n && rooms[nx][ny] === INF) {
          rooms[nx][ny] = distance;
          queue.push([nx, ny]);
        }
      }
    }
  }
}
```

```java
// Time: O(m*n) | Space: O(m*n)
public void wallsAndGates(int[][] rooms) {
    if (rooms == null || rooms.length == 0) return;

    int m = rooms.length, n = rooms[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int INF = Integer.MAX_VALUE;

    // Add all gates to the queue
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (rooms[i][j] == 0) {
                queue.offer(new int[]{i, j});
            }
        }
    }

    int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    int distance = 0;

    while (!queue.isEmpty()) {
        distance++;
        int levelSize = queue.size();

        for (int k = 0; k < levelSize; k++) {
            int[] cell = queue.poll();
            int x = cell[0], y = cell[1];

            for (int[] dir : directions) {
                int nx = x + dir[0], ny = y + dir[1];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n && rooms[nx][ny] == INF) {
                    rooms[nx][ny] = distance;
                    queue.offer(new int[]{nx, ny});
                }
            }
        }
    }
}
```

</div>

## How to Prepare

Master BFS for Airbnb by focusing on pattern recognition rather than memorizing solutions. When you encounter a problem, ask yourself:

1. **Is this about finding the shortest path?** BFS is optimal for unweighted graphs.
2. **Does the problem involve layers or levels?** BFS processes nodes level by level.
3. **Can multiple starting points be processed together?** Consider multi-source BFS.

Practice implementing BFS with these variations:

- **Standard queue-based BFS** for trees and graphs
- **BFS with visited tracking** using sets or arrays
- **BFS with distance tracking** using separate arrays or storing distance in queue
- **Bidirectional BFS** for meeting in the middle (less common but good to know)

Here's the template for level-order BFS that appears in many tree problems:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def levelOrder(root):
    """
    LeetCode #102: Binary Tree Level Order Traversal
    Classic BFS pattern for trees
    """
    if not root:
        return []

    result = []
    queue = collections.deque([root])

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

```javascript
// Time: O(n) | Space: O(n)
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();

        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            currentLevel.add(node.val);

            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }

        result.add(currentLevel);
    }

    return result;
}
```

</div>

## How Airbnb Tests BFS vs Other Companies

Airbnb's BFS questions differ from other companies in several key ways:

**Compared to Google**: Google tends toward more abstract graph theory problems, while Airbnb's BFS questions are grounded in practical scenarios like navigating maps or processing hierarchical data. Airbnb problems often have clearer real-world analogs.

**Compared to Facebook/Meta**: Facebook favors BFS in social network contexts (friend suggestions, content propagation). Airbnb focuses more on spatial relationships and resource allocation.

**Compared to Amazon**: Amazon's BFS problems frequently involve production-like scenarios (warehouse navigation, delivery routes). Airbnb's are more about user experience (finding listings, calculating distances).

The unique Airbnb approach is their emphasis on **state representation**. Many of their BFS problems require you to design an appropriate state representation that includes not just position, but also additional context (keys collected, obstacles removed, etc.). This tests your ability to model complex real-world constraints.

## Study Order

1. **Basic BFS on Trees** - Start with simple level-order traversal to internalize the queue pattern without distractions.
2. **BFS on Graphs with Adjacency Lists** - Learn to handle cycles and visited tracking in general graphs.
3. **Grid BFS with Obstacles** - Practice 2D navigation problems, which form the basis for many Airbnb questions.
4. **Multi-Source BFS** - Master starting from multiple points, crucial for "distance from nearest" problems.
5. **BFS with State** - Learn to incorporate additional information into your BFS state (keys, time, special conditions).
6. **Bidirectional BFS** - Advanced optimization for meeting-in-the-middle scenarios.

This progression builds from simple to complex, ensuring you understand the core mechanics before tackling Airbnb's favorite variations. The jump from step 3 to 4 is particularly important—multi-source BFS appears in several Airbnb problems but is often overlooked by candidates.

## Recommended Practice Order

1. **Binary Tree Level Order Traversal (#102)** - Master the basic pattern
2. **Number of Islands (#200)** - Grid BFS fundamentals
3. **Rotting Oranges (#994)** - Multi-source BFS introduction
4. **Walls and Gates (#286)** - Classic Airbnb multi-source BFS
5. **Shortest Path in Binary Matrix (#1091)** - BFS with obstacles
6. **Open the Lock (#752)** - BFS with state representation
7. **Sliding Puzzle (#773)** - Advanced BFS with state (Airbnb favorite)
8. **Bus Routes (#815)** - BFS on abstract graphs (appears at Airbnb)
9. **Cut Off Trees for Golf Event (#675)** - Complex BFS with multiple targets (Airbnb-level challenge)

Solve these in sequence, and you'll build the specific BFS skills Airbnb interviewers look for. Notice how problems 4, 7, and 8 are known Airbnb questions—they test exactly the patterns discussed above.

[Practice Breadth-First Search at Airbnb](/company/airbnb/breadth-first-search)
