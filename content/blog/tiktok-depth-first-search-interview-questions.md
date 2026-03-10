---
title: "Depth-First Search Questions at TikTok: What to Expect"
description: "Prepare for Depth-First Search interview questions at TikTok — patterns, difficulty breakdown, and study tips."
date: "2027-05-14"
category: "dsa-patterns"
tags: ["tiktok", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at TikTok: What to Expect

If you're preparing for a TikTok interview, you've probably seen the statistic: 44 Depth-First Search (DFS) questions out of their 383 total tagged problems on LeetCode. That's roughly 11.5% of their problem set, which is significant but not overwhelming. The real question isn't just the quantity—it's what this tells us about their interview philosophy.

TikTok's engineering interviews, particularly for backend and infrastructure roles, heavily feature tree and graph problems because they reflect real-world systems challenges. Think about it: TikTok's recommendation engine navigates user interaction graphs, their content moderation systems traverse dependency trees, and their distributed systems manage hierarchical data structures. DFS isn't just an algorithm they test—it's a fundamental tool their engineers use daily.

In actual interviews, you're more likely to encounter DFS as part of a medium-difficulty problem rather than as a standalone "implement DFS" question. They'll embed it in scenarios involving serialization, path finding, or constraint validation. The twist is usually in the problem constraints or the required output format.

## Specific Patterns TikTok Favors

TikTok's DFS problems cluster around three distinct patterns:

1. **Tree Serialization/Deserialization with Constraints** — They love problems where you need to serialize a binary tree with additional constraints, like including null markers or handling duplicate values. This tests both your DFS implementation and your understanding of data representation. Problems like _Serialize and Deserialize Binary Tree (#297)_ appear frequently in their question bank.

2. **Path Sum Variations with State Tracking** — Instead of simple "does a path sum to X" questions, they prefer problems where you need to track multiple pieces of state through the recursion. _Path Sum III (#437)_ is a classic example where you need to count paths summing to a target, requiring careful state management in your DFS.

3. **Graph Coloring with Business Logic** — Many of their graph problems involve checking bipartiteness or detecting cycles, but with a twist that mimics real business rules. For example, checking if a course schedule (_Course Schedule (#207)_) is valid becomes checking if content dependencies can be resolved without conflicts.

Here's the key insight: TikTok rarely asks pure algorithm implementation. They wrap DFS in domain-specific scenarios that require you to adapt the standard pattern.

## How to Prepare

The most common mistake candidates make is memorizing DFS templates without understanding state management. Let's look at the core pattern you must master: DFS with backtracking and path state tracking.

<div class="code-group">

```python
# Time: O(n) | Space: O(h) for recursion stack, where h is tree height
def count_paths(root, target_sum):
    """
    Count all paths where the sum equals target_sum.
    Path must go downward (parent to child).
    """
    def dfs(node, current_path_sums):
        if not node:
            return 0

        # Add current node's value to all sums in the path
        current_path_sums = [s + node.val for s in current_path_sums]
        current_path_sums.append(node.val)  # Path starting at current node

        # Count how many paths equal target_sum
        count = sum(1 for s in current_path_sums if s == target_sum)

        # Recurse to children
        count += dfs(node.left, current_path_sums)
        count += dfs(node.right, current_path_sums)

        return count

    return dfs(root, [])
```

```javascript
// Time: O(n) | Space: O(h) for recursion stack, where h is tree height
function countPaths(root, targetSum) {
  function dfs(node, currentPathSums) {
    if (!node) return 0;

    // Add current node's value to all sums in the path
    const newSums = currentPathSums.map((s) => s + node.val);
    newSums.push(node.val); // Path starting at current node

    // Count how many paths equal targetSum
    let count = newSums.filter((s) => s === targetSum).length;

    // Recurse to children
    count += dfs(node.left, newSums);
    count += dfs(node.right, newSums);

    return count;
  }

  return dfs(root, []);
}
```

```java
// Time: O(n) | Space: O(h) for recursion stack, where h is tree height
public int countPaths(TreeNode root, int targetSum) {
    return dfs(root, new ArrayList<>(), targetSum);
}

private int dfs(TreeNode node, List<Integer> currentPathSums, int targetSum) {
    if (node == null) return 0;

    // Add current node's value to all sums in the path
    List<Integer> newSums = new ArrayList<>();
    for (int sum : currentPathSums) {
        newSums.add(sum + node.val);
    }
    newSums.add(node.val);  // Path starting at current node

    // Count how many paths equal targetSum
    int count = 0;
    for (int sum : newSums) {
        if (sum == targetSum) count++;
    }

    // Recurse to children
    count += dfs(node.left, newSums, targetSum);
    count += dfs(node.right, newSums, targetSum);

    return count;
}
```

</div>

The pattern above demonstrates the key adaptation: instead of just tracking a single running sum, we maintain all possible sums from nodes above us. This is crucial for problems like Path Sum III.

For graph problems, you need to be equally comfortable with iterative DFS using a stack:

<div class="code-group">

```python
# Time: O(V + E) | Space: O(V)
def can_finish(num_courses, prerequisites):
    """
    Course Schedule (#207) - Detect cycle in directed graph
    """
    # Build adjacency list
    graph = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)

    visited = [0] * num_courses  # 0=unvisited, 1=visiting, 2=visited

    def has_cycle(node):
        if visited[node] == 1:  # Currently in recursion stack
            return True
        if visited[node] == 2:  # Already processed
            return False

        visited[node] = 1  # Mark as visiting
        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True
        visited[node] = 2  # Mark as visited
        return False

    for course in range(num_courses):
        if has_cycle(course):
            return False
    return True
```

```javascript
// Time: O(V + E) | Space: O(V)
function canFinish(numCourses, prerequisites) {
  // Build adjacency list
  const graph = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
  }

  const visited = new Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=visited

  function hasCycle(node) {
    if (visited[node] === 1) return true; // Currently in recursion stack
    if (visited[node] === 2) return false; // Already processed

    visited[node] = 1; // Mark as visiting
    for (const neighbor of graph[node]) {
      if (hasCycle(neighbor)) return true;
    }
    visited[node] = 2; // Mark as visited
    return false;
  }

  for (let course = 0; course < numCourses; course++) {
    if (hasCycle(course)) return false;
  }
  return true;
}
```

```java
// Time: O(V + E) | Space: O(V)
public boolean canFinish(int numCourses, int[][] prerequisites) {
    // Build adjacency list
    List<Integer>[] graph = new ArrayList[numCourses];
    for (int i = 0; i < numCourses; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] prereq : prerequisites) {
        graph[prereq[1]].add(prereq[0]);
    }

    int[] visited = new int[numCourses];  // 0=unvisited, 1=visiting, 2=visited

    for (int course = 0; course < numCourses; course++) {
        if (hasCycle(graph, visited, course)) {
            return false;
        }
    }
    return true;
}

private boolean hasCycle(List<Integer>[] graph, int[] visited, int node) {
    if (visited[node] == 1) return true;    // Currently in recursion stack
    if (visited[node] == 2) return false;   // Already processed

    visited[node] = 1;  // Mark as visiting
    for (int neighbor : graph[node]) {
        if (hasCycle(graph, visited, neighbor)) {
            return true;
        }
    }
    visited[node] = 2;  // Mark as visited
    return false;
}
```

</div>

## How TikTok Tests Depth-First Search vs Other Companies

Compared to other tech companies, TikTok's DFS questions have distinct characteristics:

- **More narrative context**: While Google might ask "detect a cycle in a directed graph," TikTok will frame it as "check if content dependencies can be resolved" or "validate user permission inheritance."
- **Emphasis on serialization**: Facebook also tests tree serialization, but TikTok often adds constraints like "serialize with minimal space" or "handle duplicate values correctly."
- **Medium difficulty focus**: Unlike Amazon (which leans easier) or Google (which goes harder), TikTok clusters around LeetCode medium difficulty. They want to see clean implementation under time pressure, not necessarily groundbreaking algorithmic insights.
- **Follow-up questions**: Expect "how would this scale?" or "what if the tree is too deep for recursion?" questions. They're testing practical engineering judgment alongside algorithmic knowledge.

## Study Order

Don't jump straight into TikTok's tagged problems. Build your foundation systematically:

1. **Basic tree traversals** — Understand pre-order, in-order, and post-order DFS implementations both recursively and iteratively. This is non-negotiable foundation.
2. **Path problems in binary trees** — Start with simple path sum checks, then progress to problems requiring path state tracking.
3. **Graph cycle detection** — Master both directed and undirected graph cycle detection using DFS with coloring.
4. **Topological sorting** — Understand how DFS enables topological ordering for dependency resolution.
5. **Tree serialization** — Practice multiple serialization formats and understand their trade-offs.
6. **Constraint satisfaction** — Learn how to incorporate business rules into your DFS logic.

This order works because each step builds on the previous one. You can't solve complex path tracking problems without mastering basic traversals, and you can't handle TikTok's dependency problems without understanding cycle detection.

## Recommended Practice Order

Solve these problems in sequence:

1. _Binary Tree Inorder Traversal (#94)_ — Basic recursive and iterative DFS
2. _Path Sum (#112)_ — Simple path checking
3. _Path Sum II (#113)_ — Path tracking with backtracking
4. _Path Sum III (#437)_ — Advanced path state management (key TikTok pattern)
5. _Serialize and Deserialize Binary Tree (#297)_ — Tree representation
6. _Course Schedule (#207)_ — Graph cycle detection with real-world context
7. _Number of Islands (#200)_ — Grid DFS (less common but good backup)
8. _Binary Tree Maximum Path Sum (#124)_ — Complex state management (harder TikTok problem)

After completing this sequence, you'll have covered 90% of the DFS patterns TikTok tests. The remaining 10% are variations that combine these patterns in novel ways—exactly what you'll see in a real interview.

[Practice Depth-First Search at TikTok](/company/tiktok/depth-first-search)
