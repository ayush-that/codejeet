---
title: "Depth-First Search Interview Questions: Patterns and Strategies"
description: "Master Depth-First Search problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-15"
category: "dsa-patterns"
tags: ["depth-first-search", "dsa", "interview prep"]
---

# Depth-First Search Interview Questions: Patterns and Strategies

You’re 20 minutes into a Google interview, feeling good about your solution to a tree problem. Then the interviewer casually asks, “Now, what if the tree is actually a graph with cycles?” Your elegant recursive DFS suddenly risks infinite recursion. This exact scenario plays out in problems like **Clone Graph (#133)**, where candidates who only know tree DFS get trapped. Depth-First Search isn’t just about trees—it’s a fundamental graph traversal paradigm that appears in 242 LeetCode questions, with 59% at Medium difficulty. Mastering its patterns means recognizing when to use it, how to adapt it, and what pitfalls to avoid.

## Common Patterns

### 1. Recursive Backtracking with State Restoration

This pattern appears in permutation/combination problems where you build a solution incrementally, explore all possibilities, then backtrack. The key insight is that you must restore state after each recursive call so the next branch starts fresh.

<div class="code-group">

```python
# Time: O(n * n!) | Space: O(n) for recursion depth + O(n!) for output
def permute(nums):
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])  # Copy the current permutation
            return

        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                backtrack(path, used)
                # Restore state for next iteration
                path.pop()
                used[i] = False

    result = []
    backtrack([], [False] * len(nums))
    return result

# Problems: Permutations (#46), Combination Sum (#39), Palindrome Partitioning (#131)
```

```javascript
// Time: O(n * n!) | Space: O(n) for recursion depth + O(n!) for output
function permute(nums) {
  const result = [];

  function backtrack(path, used) {
    if (path.length === nums.length) {
      result.push([...path]); // Shallow copy
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (!used[i]) {
        used[i] = true;
        path.push(nums[i]);
        backtrack(path, used);
        // Restore state
        path.pop();
        used[i] = false;
      }
    }
  }

  backtrack([], new Array(nums.length).fill(false));
  return result;
}
```

```java
// Time: O(n * n!) | Space: O(n) for recursion depth + O(n!) for output
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(result, new ArrayList<>(), nums, new boolean[nums.length]);
    return result;
}

private void backtrack(List<List<Integer>> result, List<Integer> path,
                      int[] nums, boolean[] used) {
    if (path.size() == nums.length) {
        result.add(new ArrayList<>(path));  // Copy
        return;
    }

    for (int i = 0; i < nums.length; i++) {
        if (!used[i]) {
            used[i] = true;
            path.add(nums[i]);
            backtrack(result, path, nums, used);
            // Restore state
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
```

</div>

### 2. Post-order Traversal for Bottom-up Computation

In tree problems, sometimes you need information from children before processing the parent. Post-order DFS (left → right → root) lets you compute child results first. This is essential for problems like **Diameter of Binary Tree (#543)** where the longest path might not pass through the root.

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is tree height (worst-case O(n))
def diameterOfBinaryTree(root):
    diameter = 0

    def dfs(node):
        nonlocal diameter
        if not node:
            return 0

        # Get depths from both children
        left_depth = dfs(node.left)
        right_depth = dfs(node.right)

        # Update global diameter with path through current node
        diameter = max(diameter, left_depth + right_depth)

        # Return depth of current node
        return 1 + max(left_depth, right_depth)

    dfs(root)
    return diameter

# Problems: Diameter of Binary Tree (#543), Binary Tree Maximum Path Sum (#124)
```

```javascript
// Time: O(n) | Space: O(h) where h is tree height
function diameterOfBinaryTree(root) {
  let diameter = 0;

  function dfs(node) {
    if (!node) return 0;

    const leftDepth = dfs(node.left);
    const rightDepth = dfs(node.right);

    diameter = Math.max(diameter, leftDepth + rightDepth);

    return 1 + Math.max(leftDepth, rightDepth);
  }

  dfs(root);
  return diameter;
}
```

```java
// Time: O(n) | Space: O(h) where h is tree height
class Solution {
    private int diameter = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        dfs(root);
        return diameter;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;

        int leftDepth = dfs(node.left);
        int rightDepth = dfs(node.right);

        diameter = Math.max(diameter, leftDepth + rightDepth);

        return 1 + Math.max(leftDepth, rightDepth);
    }
}
```

</div>

### 3. Cycle Detection and Graph Coloring

For graph problems, DFS with a "visited state" array can detect cycles and classify nodes. The three-color system (0=unvisited, 1=visiting, 2=visited) is particularly useful for topological sort and cycle detection in directed graphs.

<div class="code-group">

```python
# Time: O(V + E) | Space: O(V) for state array and recursion stack
def canFinish(numCourses, prerequisites):
    # Build adjacency list
    graph = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        graph[course].append(prereq)

    state = [0] * numCourses  # 0=unvisited, 1=visiting, 2=visited

    def hasCycle(course):
        if state[course] == 1:  # Found a cycle
            return True
        if state[course] == 2:  # Already processed
            return False

        state[course] = 1  # Mark as visiting

        for prereq in graph[course]:
            if hasCycle(prereq):
                return True

        state[course] = 2  # Mark as visited
        return False

    for course in range(numCourses):
        if hasCycle(course):
            return False

    return True

# Problems: Course Schedule (#207), Graph Valid Tree (#261)
```

```javascript
// Time: O(V + E) | Space: O(V)
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  for (const [course, prereq] of prerequisites) {
    graph[course].push(prereq);
  }

  const state = new Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=visited

  function hasCycle(course) {
    if (state[course] === 1) return true;
    if (state[course] === 2) return false;

    state[course] = 1;

    for (const prereq of graph[course]) {
      if (hasCycle(prereq)) return true;
    }

    state[course] = 2;
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
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<Integer>[] graph = new ArrayList[numCourses];
        for (int i = 0; i < numCourses; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] prereq : prerequisites) {
            graph[prereq[0]].add(prereq[1]);
        }

        int[] state = new int[numCourses];  // 0=unvisited, 1=visiting, 2=visited

        for (int course = 0; course < numCourses; course++) {
            if (hasCycle(graph, state, course)) {
                return false;
            }
        }

        return true;
    }

    private boolean hasCycle(List<Integer>[] graph, int[] state, int course) {
        if (state[course] == 1) return true;
        if (state[course] == 2) return false;

        state[course] = 1;

        for (int prereq : graph[course]) {
            if (hasCycle(graph, state, prereq)) {
                return true;
            }
        }

        state[course] = 2;
        return false;
    }
}
```

</div>

## When to Use Depth-First Search vs Alternatives

**DFS shines when:**

- You need to explore all possible paths (backtracking problems)
- The solution might be deep in the search space
- You need post-order processing (children before parent)
- Memory is constrained (DFS uses O(h) vs BFS's O(w), where h = height, w = width)

**Choose BFS instead when:**

- You need the shortest path in an unweighted graph
- The solution is likely close to the start (social network connections, word ladder)
- You need level-order processing (tree level traversal)

**Decision criteria:**

1. **"Find all possible..."** → DFS with backtracking
2. \*\*"Shortest path" in unweighted graph → BFS
3. **Tree problems needing child results first** → Post-order DFS
4. **Cycle detection in directed graphs** → DFS with coloring
5. **Connected components in undirected graphs** → Either works, but DFS is often simpler

For **Number of Islands (#200)**, both DFS and BFS work. DFS is more concise for recursive implementation, but BFS avoids stack overflow for huge grids. If asked about tradeoffs, mention DFS's O(m×n) worst-case stack space vs BFS's O(min(m,n)) queue space.

## Edge Cases and Gotchas

### 1. Stack Overflow in Deep Recursion

When trees are skewed or graphs are deep, recursion can overflow the call stack. For **Maximum Depth of Binary Tree (#104)**, a skewed tree with 10,000 nodes will cause recursion depth errors in Python (default recursion limit ~1000).

**Solution:** Use iterative DFS with an explicit stack, or increase recursion limits (but mention this as a workaround, not a solution).

### 2. Modifying Visited State During Backtracking

In **Word Search (#79)**, you must mark cells as visited during exploration but unmark them when backtracking. A common mistake is forgetting to unmark, which prevents exploring alternative paths through that cell.

### 3. Graph vs Tree Assumptions

Many candidates assume inputs are trees when they're actually general graphs. In **Clone Graph (#133)**, you need a visited map to handle cycles. Always ask: "Can there be cycles?" or "Is this guaranteed to be a tree?"

### 4. Implicit Graph Representations

Problems like **Number of Islands (#200)** use a 2D grid as an implicit graph. The gotcha is remembering to mark cells as visited _before_ recursing to avoid revisiting the same cell multiple times in different branches.

## Difficulty Breakdown

With 242 DFS questions distributed as 15% Easy, 59% Medium, and 26% Hard, here's what this means for your preparation:

**Easy problems** test basic DFS traversal on trees (pre/in/post-order). Master these first—they're confidence builders and appear in phone screens. Examples: **Maximum Depth of Binary Tree (#104)**, **Invert Binary Tree (#226)**.

**Medium problems** (the majority) combine DFS with other concepts: backtracking, memoization, or graph algorithms. These are the core interview questions. Prioritize patterns like permutation generation, graph coloring, and post-order computation.

**Hard problems** often involve optimizing DFS with pruning, dynamic programming on trees, or complex state management. While important, don't start here. Build medium proficiency first, then tackle hards like **Binary Tree Maximum Path Sum (#124)** and **Word Search II (#212)**.

## Which Companies Ask Depth-First Search

**[Google](/company/google)** loves graph and tree DFS problems, often with a twist. Expect questions like **Number of Islands (#200)** but modified ("What if islands can be connected diagonally?") or **Course Schedule (#207)** with follow-ups about parallel course scheduling.

**[Amazon](/company/amazon)** frequently asks tree DFS problems in their online assessments and interviews. **Diameter of Binary Tree (#543)** and **Binary Tree Zigzag Level Order Traversal (#103)** are common. They often combine DFS with string manipulation.

**[Meta](/company/meta)** emphasizes graph problems for their social network domain. **Clone Graph (#133)** is a classic Meta question. They also like backtracking problems for feature implementation scenarios.

**[Microsoft](/company/microsoft)** asks balanced tree and graph problems. **Validate Binary Search Tree (#98)** tests recursive DFS with range propagation. They often include follow-ups about iterative solutions.

**[Bloomberg](/company/bloomberg)** prefers practical applications: file system traversal, XML parsing, or financial data tree analysis. **Binary Tree Maximum Path Sum (#124)** aligns with their financial context.

## Study Tips

1. **Master the three DFS orders for trees first.** Implement pre-order, in-order, and post-order traversal both recursively and iteratively. This builds intuition for when each is useful.

2. **Practice pattern recognition with this progression:**
   - Week 1: Tree traversal (Easy: #104, #226, #101)
   - Week 2: Backtracking (Medium: #46, #39, #78)
   - Week 3: Graph DFS (Medium: #200, #207, #133)
   - Week 4: Advanced patterns (Hard: #124, #212, #329)

3. **Always implement both recursive and iterative versions** for core patterns. Interviewers often ask: "Can you do this iteratively to avoid stack overflow?" Use an explicit stack for iterative DFS.

4. **Draw the recursion tree** for backtracking problems before coding. This visualization helps you understand state propagation and where to prune invalid branches.

Depth-First Search is more than a traversal algorithm—it's a problem-solving framework that appears in nearly every interview. The patterns here will help you recognize when DFS is the right approach and implement it correctly under pressure.

[Practice all Depth-First Search questions on CodeJeet](/topic/depth-first-search)
