---
title: "Depth-First Search Questions at DoorDash: What to Expect"
description: "Prepare for Depth-First Search interview questions at DoorDash — patterns, difficulty breakdown, and study tips."
date: "2028-08-16"
category: "dsa-patterns"
tags: ["doordash", "depth-first-search", "interview prep"]
---

If you're preparing for a DoorDash interview, you'll quickly notice that Depth-First Search (DFS) is a significant part of their technical assessment landscape. With 17 out of their 87 tagged questions on LeetCode, DFS isn't just a random topic—it's a core competency they actively test. This frequency suggests that DoorDash interviewers view DFS not merely as an algorithm, but as a fundamental problem-solving paradigm for navigating hierarchical data, exploring state spaces, and implementing backtracking, all of which are highly relevant to their domain of logistics, mapping, and menu/option trees.

In my experience conducting and analyzing these interviews, DFS questions at DoorDash rarely appear in their most textbook, "traverse this binary tree" form. Instead, they are almost always the vehicle for solving a more complex, applied problem. The interviewer is assessing your ability to recognize when a problem decomposes into independent sub-problems (a recursive structure) and your skill in implementing a clean, bug-free traversal that manages state correctly. Missing a base case or incorrectly propagating state back up the call stack is a common failure point they watch for.

## Specific Patterns DoorDash Favors

DoorDash's DFS problems tend to cluster around two main patterns, both with a practical bent.

**1. Backtracking on Implicit Graphs (State-Space Search):** This is their most common and distinctive flavor. You're not given an adjacency list; you're given rules to generate the next states from the current one. Classic examples are generating all combinations/permutations (like phone number letter combinations) or finding a path under constraints. The "graph" is the set of all possible states, and DFS explores it recursively.

- **LeetCode Examples:** `Letter Combinations of a Phone Number (#17)` is a quintessential example. `Generate Parentheses (#22)` and `Subsets (#78)` are also in this family. These test your ability to design a recursion tree, manage a `path` or `current` state variable, and know when to `pop()` or otherwise revert state after exploration.

**2. DFS on Trees with Value Propagation:** Here, the tree structure is explicit (often a binary tree), but the goal is to compute a value that requires information from the entire subtree. This mirrors real-world tasks like calculating metrics for a restaurant category and all its menu items.

- **LeetCode Examples:** `Diameter of Binary Tree (#543)` and `Maximum Path Sum (#124)` are perfect archetypes. They require a post-order traversal where each node's function returns a value (like max single path) but also updates a global result (like the actual diameter or max path sum) based on combining left and right child values.

They show a clear preference for **recursive implementations** over explicit stack-based iterative ones. The recursive solution is often more intuitive for these problems, and they want to see you handle recursion cleanly. You will almost never see pure graph theory problems (like detecting cycles in a directed graph); the DFS is applied to a problem with a tangible, often product-related, context.

## How to Prepare

The key is to internalize the template for recursive DFS with backtracking and for tree DFS with a return value. Let's look at the backtracking template, as it's the most versatile.

<div class="code-group">

```python
def backtrack(path, state, ...):
    """
    Template for DFS backtracking.
    path: current partial solution (e.g., a list)
    state: often the next index or choice to make
    """
    # 1. Base Case: Is the current path a complete solution?
    if is_complete(state):
        result.append(path.copy())  # Must take a copy!
        return

    # 2. Iterate over all possible candidates/choices at this state
    for choice in get_choices(state):
        # 3. Prune invalid choices early (optional optimization)
        if not is_valid(choice):
            continue

        # 4. Make the choice: add it to the path and update state
        path.append(choice)
        # update state (e.g., increment index, mark as used)

        # 5. Recurse: explore deeper with the new state
        backtrack(path, new_state, ...)

        # 6. Undo the choice (BACKTRACK): restore state for the next iteration
        path.pop()
        # revert state update

# Time Complexity: Typically O(branching_factor ^ depth). For subsets (n choices, include/exclude), it's O(2^n).
# Space Complexity: O(depth) for recursion call stack, plus O(depth) for the `path` list.
```

```javascript
function backtrack(path, state, ...) {
    // 1. Base Case
    if (isComplete(state)) {
        result.push([...path]); // Create a shallow copy
        return;
    }

    // 2. Iterate over choices
    for (let choice of getChoices(state)) {
        // 3. Prune
        if (!isValid(choice)) continue;

        // 4. Make choice
        path.push(choice);
        // update state

        // 5. Recurse
        backtrack(path, newState, ...);

        // 6. Undo choice (Backtrack)
        path.pop();
        // revert state
    }
}
// Time & Space: As above, depends on problem specifics.
```

```java
public void backtrack(List<Integer> path, int state, List<List<Integer>> result) {
    // 1. Base Case
    if (isComplete(state)) {
        result.add(new ArrayList<>(path)); // Crucial: new copy
        return;
    }

    // 2. Iterate over choices
    for (int choice : getChoices(state)) {
        // 3. Prune
        if (!isValid(choice)) continue;

        // 4. Make choice
        path.add(choice);
        // update state

        // 5. Recurse
        backtrack(path, newState, result);

        // 6. Undo choice (Backtrack)
        path.remove(path.size() - 1);
        // revert state
    }
}
// Time & Space: As above.
```

</div>

For tree DFS, the pattern is simpler but requires careful thought about what to return.

<div class="code-group">

```python
def dfs(node):
    # Base Case: null node
    if not node:
        return 0  # Or appropriate null value

    # Recursively get information from children (often post-order)
    left_info = dfs(node.left)
    right_info = dfs(node.right)

    # Process current node using children's info
    current_result = process(node.val, left_info, right_info)

    # Possibly update a global maximum (e.g., for diameter, path sum)
    global_max = max(global_max, combine(left_info, right_info))

    # Return value needed for parent's calculation
    return current_result

# Time: O(N) where N is number of nodes, we visit each once.
# Space: O(H) for recursion stack, where H is tree height (O(N) worst-case for skewed tree).
```

```javascript
function dfs(node) {
  if (!node) return 0;
  const left = dfs(node.left);
  const right = dfs(node.right);
  const current = process(node.val, left, right);
  globalMax = Math.max(globalMax, combine(left, right));
  return current;
}
// Time: O(N) | Space: O(H)
```

```java
public int dfs(TreeNode node) {
    if (node == null) return 0;
    int left = dfs(node.left);
    int right = dfs(node.right);
    int current = process(node.val, left, right);
    globalMax = Math.max(globalMax, combine(left, right));
    return current;
}
// Time: O(N) | Space: O(H)
```

</div>

## How DoorDash Tests Depth-First Search vs Other Companies

Compared to other companies, DoorDash's DFS questions are **applied and mid-difficulty**. They lack the extreme algorithmic cleverness of a Google "N-Queens" optimization or the massive graph scale of a Facebook social network problem. Instead, they feel like a **30-minute coding simulation of a real software task**.

At Amazon, you might get a DFS problem heavily wrapped in an object-oriented design context (e.g., parse a file system). At Meta, it might be closer to pure graph traversal on an adjacency list. DoorDash strikes a balance: the problem is abstract enough to be solved in an interview, but the scenario—generating delivery route options, exploring menu customizations—feels directly relevant. They test for **clean code, correct handling of edge cases (empty input, single element), and clarity of thought** more than they test for knowing an obscure algorithm variant.

## Study Order

Tackle these sub-topics in this order to build a solid foundation:

1.  **Basic Tree Traversal (Pre-order, In-order, Post-order):** Understand recursion on a known structure. This is your "hello world."
2.  **Simple Backtracking (Subsets, Combinations):** Learn the make-choice/recurse/undo-choice pattern without the distraction of complex validity checks.
3.  **Backtracking with Constraints (Permutations, N-Queens):** Introduce the `is_valid` pruning step. This is where most DoorDash problems live.
4.  **Tree DFS with Return Values (Diameter, Path Sum):** Shift gears to problems where the recursive function's return value is part of the computation, not just a void traversal.
5.  **DFS on Implicit Graphs (Word Search, Letter Combinations):** Apply the backtracking pattern to problems where the "graph" isn't given upfront but generated by rules.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **Binary Tree Inorder Traversal (#94)** - Master basic recursion.
2.  **Subsets (#78)** - Learn the fundamental backtracking skeleton.
3.  **Letter Combinations of a Phone Number (#17)** - Classic DoorDash-style implicit graph backtracking.
4.  **Generate Parentheses (#22)** - Backtracking with a custom validity rule (number of open vs. closed).
5.  **Diameter of Binary Tree (#543)** - Transition to tree DFS with value propagation.
6.  **Maximum Path Sum (#124)** - A harder version of the above, often the ceiling for DoorDash DFS difficulty.
7.  **Word Search (#79)** - DFS on a 2D grid (an implicit graph), excellent for final integration.

Focus on writing the recursive function signature first, then the base case, then the recurrence relation. At DoorDash, communicating this thought process clearly is as important as getting the code to run.

[Practice Depth-First Search at DoorDash](/company/doordash/depth-first-search)
