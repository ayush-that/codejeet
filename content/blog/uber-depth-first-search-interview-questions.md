---
title: "Depth-First Search Questions at Uber: What to Expect"
description: "Prepare for Depth-First Search interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-03"
category: "dsa-patterns"
tags: ["uber", "depth-first-search", "interview prep"]
---

If you're preparing for a software engineering interview at Uber, you've likely seen the statistic: they have around 50 Depth-First Search (DFS) tagged problems in their question bank. That's a significant 13% of their total LeetCode-style problems. But what does that _actually_ mean for your interview? Is DFS a core focus, or just a common tool? The answer is nuanced. Uber, with its massive focus on mapping, routing, marketplace dynamics, and nested data structures (think trip states, user permissions hierarchies, or city/region/zone mappings), doesn't just _ask_ DFS problems—it _encounters_ DFS problems. The algorithm is a fundamental tool for navigating the complex, often tree- or graph-like data models that underpin their real-world systems. In an interview, you're less likely to get a pure "traverse this binary tree" question and more likely to get a problem where DFS is the optimal engine for solving a larger, Uber-relevant challenge, like finding valid configurations, exploring state spaces, or processing nested structures.

## Specific Patterns Uber Favors

Uber's DFS questions tend to cluster around a few high-utility patterns that mirror their engineering domains:

1.  **DFS on Implicit Graphs (State Space Exploration):** This is huge. Problems where you need to explore all possible states or configurations, often with constraints. Think generating all valid trip sequences, driver availability states, or feature flag combinations. It's DFS as a backtracking engine. **LeetCode 78 (Subsets)** and **LeetCode 22 (Generate Parentheses)** are classic examples of this pattern.
2.  **DFS on Matrices (Grid Traversal):** Given Uber's mapping focus, traversing a 2D grid is a natural fit. The twist is rarely just counting islands (**LeetCode 200**). It's more likely to be a modified DFS that tracks additional state, like in **LeetCode 694 (Number of Distinct Islands)**, where you must encode the shape's path, or problems involving reachability under specific rules.
3.  **DFS with Memoization (Top-Down Dynamic Programming):** For optimization problems on tree or DAG structures—like maximizing some value given a dependency tree—Uber often favors the recursive, memoized DFS approach. It's more intuitive to derive and explain during an interview. **LeetCode 337 (House Robber III)** on a binary tree is a perfect example.
4.  **DFS for Cycle Detection & Dependency Resolution:** This speaks to system design. Tasks like determining if a set of prerequisites (or service dependencies) is valid or finding a valid processing order. **LeetCode 207 (Course Schedule)** is the canonical problem here.

The emphasis is on _applied_ DFS. You'll be expected to modify the standard algorithm to carry and return custom state, prune invalid branches early (backtracking), and articulate the recursion stack's role.

## How to Prepare

Mastering DFS for Uber means moving beyond template regurgitation. You need to internalize the recursive skeleton and then learn where to inject your problem-specific logic. The most critical pattern is **Backtracking DFS**.

Let's look at the core backtracking template. The key is the "choose-explore-unchoose" pattern, which maintains state integrity.

<div class="code-group">

```python
def backtrack(path, state, ...):
    """
    Core backtracking DFS skeleton.
    """
    # 1. Base Case: Have we reached a valid solution?
    if is_solution(state):
        result.append(path[:])  # Append a COPY of the path
        return

    # 2. Iterate over candidates
    for candidate in get_candidates(state):
        # 3. Prune invalid candidates early (optional but critical for efficiency)
        if not is_valid(candidate, state):
            continue

        # 4. CHOOSE: Take the candidate
        path.append(candidate)
        update_state(state, candidate)  # Modify state

        # 5. EXPLORE: Recurse
        backtrack(path, state, ...)

        # 6. UNCHOOSE: Backtrack (restore state)
        path.pop()
        restore_state(state, candidate)  # Undo the state change

# Example: Generating all subsets (LeetCode 78)
def subsets(nums):
    result = []

    def dfs(start, current):
        # Every node in the recursion tree is a subset
        result.append(current[:])
        for i in range(start, len(nums)):
            # CHOOSE
            current.append(nums[i])
            # EXPLORE
            dfs(i + 1, current)  # i+1 ensures we don't reuse elements
            # UNCHOOSE
            current.pop()

    dfs(0, [])
    return result

# Time: O(N * 2^N) - 2^N subsets, each taking up to O(N) to copy.
# Space: O(N) for the recursion call stack and current path.
```

```javascript
/**
 * Core backtracking DFS skeleton.
 */
function backtrack(path, state, ...args) {
  // 1. Base Case
  if (isSolution(state)) {
    result.push([...path]); // Append a shallow copy
    return;
  }

  // 2. Iterate over candidates
  for (let candidate of getCandidates(state)) {
    // 3. Prune
    if (!isValid(candidate, state)) continue;

    // 4. CHOOSE
    path.push(candidate);
    updateState(state, candidate);

    // 5. EXPLORE
    backtrack(path, state, ...args);

    // 6. UNCHOOSE
    path.pop();
    restoreState(state, candidate);
  }
}

// Example: Generating all subsets (LeetCode 78)
function subsets(nums) {
  const result = [];

  function dfs(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      // CHOOSE
      current.push(nums[i]);
      // EXPLORE
      dfs(i + 1, current);
      // UNCHOOSE
      current.pop();
    }
  }

  dfs(0, []);
  return result;
}
// Time: O(N * 2^N) | Space: O(N)
```

```java
// Core backtracking pattern
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        dfs(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void dfs(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
        // Base "case" is implicit: we add every node.
        result.add(new ArrayList<>(current)); // Crucial: add a copy

        for (int i = start; i < nums.length; i++) {
            // CHOOSE
            current.add(nums[i]);
            // EXPLORE
            dfs(nums, i + 1, current, result);
            // UNCHOOSE
            current.remove(current.size() - 1);
        }
    }
}
// Time: O(N * 2^N) | Space: O(N) for recursion depth and current list.
```

</div>

The second essential pattern is **DFS with Memoization** for optimization. This is essentially top-down DP.

<div class="code-group">

```python
def dfs_with_memo(state, memo):
    # 1. Base Cases
    if is_base_case(state):
        return base_value

    # 2. Check Memo
    if state in memo:
        return memo[state]

    # 3. Recurrence Relation: Explore all choices
    result = initial_value
    for choice in get_choices(state):
        new_state = apply_choice(state, choice)
        sub_result = dfs_with_memo(new_state, memo)
        result = combine(result, sub_result)  # e.g., min, max, sum

    # 4. Store in Memo and Return
    memo[state] = result
    return result

# Example: House Robber III (LeetCode 337)
def rob(root):
    # memo dict: node -> (rob_this_node, skip_this_node)
    memo = {}

    def dfs(node):
        if not node:
            return (0, 0)
        if node in memo:
            return memo[node]

        # Results from children
        left = dfs(node.left)
        right = dfs(node.right)

        # If we rob this node, we cannot rob direct children
        rob = node.val + left[1] + right[1]
        # If we skip this node, we can choose the best from children
        skip = max(left[0], left[1]) + max(right[0], right[1])

        memo[node] = (rob, skip)
        return (rob, skip)

    result = dfs(root)
    return max(result[0], result[1])
# Time: O(N) | Space: O(N) for recursion and memo.
```

```javascript
function dfsWithMemo(state, memo) {
  if (isBaseCase(state)) return baseValue;
  if (memo.has(state)) return memo.get(state);

  let result = initialValue;
  for (let choice of getChoices(state)) {
    let newState = applyChoice(state, choice);
    let subResult = dfsWithMemo(newState, memo);
    result = combine(result, subResult);
  }
  memo.set(state, result);
  return result;
}

// Example: House Robber III
function rob(root) {
  const memo = new Map(); // node -> [rob, skip]

  function dfs(node) {
    if (!node) return [0, 0];
    if (memo.has(node)) return memo.get(node);

    const left = dfs(node.left);
    const right = dfs(node.right);

    const rob = node.val + left[1] + right[1];
    const skip = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

    const res = [rob, skip];
    memo.set(node, res);
    return res;
  }

  const res = dfs(root);
  return Math.max(res[0], res[1]);
}
// Time: O(N) | Space: O(N)
```

```java
class Solution {
    public int rob(TreeNode root) {
        int[] result = dfs(root);
        return Math.max(result[0], result[1]);
    }

    // Returns int[2]: {robThisNode, skipThisNode}
    private int[] dfs(TreeNode node) {
        if (node == null) return new int[]{0, 0};

        int[] left = dfs(node.left);
        int[] right = dfs(node.right);

        int rob = node.val + left[1] + right[1];
        int skip = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

        return new int[]{rob, skip};
    }
    // This version uses the recursion stack itself as implicit memoization
    // for a tree. Time: O(N) | Space: O(H) where H is tree height.
}
```

</div>

## How Uber Tests Depth-First Search vs Other Companies

Uber's DFS questions sit at a specific intersection. Compared to Google, which might lean into more abstract, mathematically-tinged graph theory, Uber's problems often feel more "applied." Compared to Facebook (Meta), which historically loved pure tree traversal, Uber often adds a layer of _state_ or _constraint_. Amazon might wrap a DFS problem in object-oriented design; Uber wraps it in a scenario about geofences, trip states, or menu permissions.

The unique aspect is the **emphasis on efficiency within the search space**. You'll be expected to identify pruning opportunities quickly. An interviewer might follow up with, "How would this scale if the input had 10,000 nodes?" expecting you to discuss the impact of your pruning logic or suggest a transition to an iterative or BFS approach if depth is a concern. They test not just if you can implement DFS, but if you understand _when_ and _how_ to deploy it effectively on a problem that feels like it could be part of their stack.

## Study Order

Tackle DFS in this logical progression:

1.  **Foundation:** Standard traversal on Trees (pre/in/post-order) and Graphs (adjacency list, visited set). Build muscle memory for the recursive call.
2.  **Pathfinding & State:** Problems where you track the path (e.g., all root-to-leaf paths). This introduces the concept of carrying state through the recursion.
3.  **Backtracking:** The "choose-explore-unchoose" pattern. This is where you learn to modify and restore state, which is critical for Uber-style problems.
4.  **Memoization:** Learn to cache results of subproblems in a hash map keyed by the recursive function's parameters. This bridges DFS to DP.
5.  **Cycle Detection & Topological Sort:** Understand DFS's role in analyzing graph dependencies, crucial for system design discussions.
6.  **Complex Applications:** Combined patterns, like DFS with bitmask state or on implicit graphs with complex constraints.

This order works because each step uses the skills of the previous one as a building block. Jumping straight to backtracking without understanding basic state propagation is much harder.

## Recommended Practice Order

Solve these problems in sequence to build up the patterns:

1.  **LeetCode 104 (Maximum Depth of Binary Tree)** - Pure traversal.
2.  **LeetCode 112 (Path Sum)** - Basic path-based state.
3.  **LeetCode 200 (Number of Islands)** - Grid DFS, foundational for mapping.
4.  **LeetCode 78 (Subsets)** - Core backtracking introduction.
5.  **LeetCode 22 (Generate Parentheses)** - Backtracking with constraints.
6.  **LeetCode 79 (Word Search)** - Backtracking on a grid, a very Uber-relevant combo.
7.  **LeetCode 337 (House Robber III)** - DFS with memoization (top-down DP).
8.  **LeetCode 207 (Course Schedule)** - DFS for cycle detection/topological sort.
9.  **LeetCode 694 (Number of Distinct Islands)** - Advanced state tracking in grid DFS.
10. **LeetCode 698 (Partition to K Equal Sum Subsets)** - A challenging backtracking problem that tests pruning and state optimization.

This sequence takes you from the absolute basics to the complex, constraint-heavy searches that Uber interviews might include. Remember, the goal isn't to memorize these problems, but to understand how the recursive DFS engine is adapted for each new task.

[Practice Depth-First Search at Uber](/company/uber/depth-first-search)
