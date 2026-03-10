---
title: "Depth-First Search Questions at Amazon: What to Expect"
description: "Prepare for Depth-First Search interview questions at Amazon — patterns, difficulty breakdown, and study tips."
date: "2027-02-25"
category: "dsa-patterns"
tags: ["amazon", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Amazon: What to Expect

Amazon has 185 Depth-First Search questions in their LeetCode tagged list out of 1938 total. That's roughly 9.5% of their problem bank, which is a significant chunk. But what does this number actually mean for your interview? It's not that you'll get a pure "implement DFS" question—those are rare. Instead, DFS is the hidden engine powering many of Amazon's favorite problem domains: tree and graph serialization, pathfinding in 2D grids (think warehouse navigation), dependency resolution (critical for their microservices architecture), and recursive backtracking for combinatorial problems (like feature flag combinations or order permutations). At Amazon, DFS isn't a standalone topic; it's a fundamental tool for solving problems that mirror real-world systems they build every day.

## Specific Patterns Amazon Favors

Amazon's DFS problems tend to cluster around three practical patterns:

1.  **Tree/Graph Serialization & Deserialization:** This is huge. Amazon systems constantly serialize dependency trees, configuration state, or object graphs for storage or network transfer. Problems like **Serialize and Deserialize Binary Tree (#297)** and **Serialize and Deserialize N-ary Tree (#428)** are classic. They test your ability to traverse a structure (using DFS for a compact representation) and, more importantly, reconstruct it—a direct analog to building a service from a configuration file.

2.  **Pathfinding in a Constrained 2D Grid:** Imagine an Amazon warehouse floor or a network of servers. Problems like **Number of Islands (#200)**, **Walls and Gates (#286)**, and **Robot Room Cleaner (#489)** use DFS (or BFS) to explore reachable areas, often with a "visited" state modification to avoid extra space. The twist Amazon adds is often a requirement to return a specific _path_ or modify the grid in-place, testing space optimization.

3.  **Recursive Backtracking with State Pruning:** For feature toggles, order combinations, or permission sets, they love problems that require generating all valid states. **Word Search II (#212)** is a prime example, combining a trie with DFS backtracking over a board. The key is implementing efficient pruning—knowing when to stop exploring a path. **Subsets (#78)** and **Palindrome Partitioning (#131)** also fit here. The pattern is: make a choice, recurse, undo the choice (backtrack).

You'll notice a theme: **iterative DFS is often preferred over recursive** in interviews for problems with deep recursion risks (like very deep trees or long paths). Interviewers want to see you manage an explicit stack. For backtracking, recursion is usually clearer.

<div class="code-group">

```python
# Pattern: Iterative DFS for Tree Serialization (Preorder)
# Time: O(n) | Space: O(n) for the serialized string, O(h) for the stack (where h is tree height)
class Codec:
    def serialize(self, root):
        """Encodes a tree to a single string using iterative DFS."""
        if not root:
            return "#"
        stack = [root]
        result = []
        while stack:
            node = stack.pop()
            if node is None:
                result.append("#")
                continue
            result.append(str(node.val))
            # Push right first so left is processed first (preorder: root, left, right)
            stack.append(node.right)
            stack.append(node.left)
        return ",".join(result)

    def deserialize(self, data):
        """Decodes your encoded data to tree using the same preorder logic."""
        vals = iter(data.split(","))
        def build():
            val = next(vals)
            if val == "#":
                return None
            node = TreeNode(int(val))
            node.left = build()  # Recursive deserialization is clean here
            node.right = build()
            return node
        return build()
```

```javascript
// Pattern: Iterative DFS for Tree Serialization (Preorder)
// Time: O(n) | Space: O(n) for the serialized string, O(h) for the stack
class Codec {
  serialize(root) {
    if (!root) return "#";
    const stack = [root];
    const result = [];
    while (stack.length) {
      const node = stack.pop();
      if (!node) {
        result.push("#");
        continue;
      }
      result.push(node.val.toString());
      // Push right first for preorder
      stack.push(node.right);
      stack.push(node.left);
    }
    return result.join(",");
  }

  deserialize(data) {
    const vals = data.split(",")[Symbol.iterator]();
    const build = () => {
      const { value, done } = vals.next();
      if (value === "#" || done) return null;
      const node = new TreeNode(parseInt(value));
      node.left = build();
      node.right = build();
      return node;
    };
    return build();
  }
}
```

```java
// Pattern: Iterative DFS for Tree Serialization (Preorder)
// Time: O(n) | Space: O(n) for the serialized string, O(h) for the stack
public class Codec {
    public String serialize(TreeNode root) {
        if (root == null) return "#";
        StringBuilder sb = new StringBuilder();
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            if (node == null) {
                sb.append("#,");
                continue;
            }
            sb.append(node.val).append(",");
            stack.push(node.right);
            stack.push(node.left);
        }
        return sb.toString();
    }

    public TreeNode deserialize(String data) {
        Deque<String> vals = new ArrayDeque<>(Arrays.asList(data.split(",")));
        return build(vals);
    }

    private TreeNode build(Deque<String> vals) {
        String val = vals.remove();
        if (val.equals("#")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = build(vals);
        node.right = build(vals);
        return node;
    }
}
```

</div>

## How to Prepare

Don't just memorize DFS traversal. Internalize the three patterns above. For each:

1.  **Write the skeleton first.** For backtracking, sketch the function signature (state, path, result list) and the base case before filling logic.
2.  **Practice space analysis.** Amazon cares about scalability. Can you modify the input grid to mark visited cells instead of using a separate `visited` set? (See Number of Islands). For recursive tree DFS, articulate that the space is O(h) for the call stack, where h could be O(n) in a skewed tree.
3.  **Choose recursion vs. iteration deliberately.** Use recursion for problems with a natural divide-and-conquer structure (like tree problems) or backtracking. Use an explicit stack for deep graphs or when you need to simulate a specific order that's tricky with recursion.

Here's the backtracking skeleton for problems like Word Search II:

<div class="code-group">

```python
# Pattern: Backtracking DFS Skeleton (for problems like Word Search II, Subsets)
# Time: Typically O(branching_factor ^ depth) | Space: O(depth) for recursion, O(n) for path
def backtrack(state, path, result):
    # 1. Base case: is the current state a valid solution?
    if is_valid(state):
        result.append(path.copy())  # Make a copy!
        return  # Optional: return if only need one solution

    # 2. Iterate over possible choices from the current state
    for choice in get_choices(state):
        # 3. Prune invalid choices early (critical for efficiency)
        if not is_valid_choice(state, choice):
            continue

        # 4. Apply the choice
        apply_choice(state, choice, path)

        # 5. Recurse with the new state
        backtrack(state, path, result)

        # 6. Undo the choice (backtrack)
        undo_choice(state, choice, path)
```

```javascript
// Pattern: Backtracking DFS Skeleton
// Time: Typically O(branching_factor ^ depth) | Space: O(depth) for recursion, O(n) for path
function backtrack(state, path, result) {
  // 1. Base case
  if (isValid(state)) {
    result.push([...path]); // Shallow copy
    return;
  }

  // 2. Iterate over possible choices
  for (let choice of getChoices(state)) {
    // 3. Prune
    if (!isValidChoice(state, choice)) continue;

    // 4. Apply
    applyChoice(state, choice, path);

    // 5. Recurse
    backtrack(state, path, result);

    // 6. Undo
    undoChoice(state, choice, path);
  }
}
```

```java
// Pattern: Backtracking DFS Skeleton
// Time: Typically O(branching_factor ^ depth) | Space: O(depth) for recursion, O(n) for path
void backtrack(State state, List<Choice> path, List<List<Choice>> result) {
    // 1. Base case
    if (isValid(state)) {
        result.add(new ArrayList<>(path)); // Copy
        return;
    }

    // 2. Iterate over possible choices
    for (Choice choice : getChoices(state)) {
        // 3. Prune
        if (!isValidChoice(state, choice)) continue;

        // 4. Apply
        applyChoice(state, choice, path);

        // 5. Recurse
        backtrack(state, path, result);

        // 6. Undo
        undoChoice(state, choice, path);
    }
}
```

</div>

## How Amazon Tests Depth-First Search vs Other Companies

At Google or Meta, a DFS problem might be a clever, abstract puzzle requiring a non-obvious state representation (like simulating a game). At Amazon, the DFS problem is almost always **grounded in a plausible system scenario**. You might be asked to find all dependency failures in a service graph, explore a delivery route map with obstacles, or restore a binary tree from a cached log. The difficulty isn't in inventing a novel algorithm; it's in applying the standard DFS patterns _correctly_ under constraints (like limited memory or needing to produce a specific output format).

The unique aspect is the **follow-up**. After you solve the core DFS, expect questions like: "How would you handle this if the tree was too large for memory?" (Answer: You'd serialize/deserialize in chunks, using external storage—which loops back to the serialization pattern). Or, "What if you needed the top 5 paths, not just one?" (Answer: Modify your result collection to use a min-heap of size 5). They test if you can see the engineering implications beyond the algorithm.

## Study Order

1.  **Basic Tree Traversals (Preorder, Inorder, Postorder)** – Recursive and iterative. This is your foundation. Understand the stack mechanics.
2.  **Graph Traversal on Adjacency Lists** – DFS to detect cycles, find connected components. This translates directly to dependency problems.
3.  **Backtracking Skeleton** – Practice on combinatorial problems (Subsets, Permutations) until adding/pruning/removing choices is muscle memory.
4.  **Grid DFS (Matrix Traversal)** – With and without modifying the input to mark visited. This is where you learn space optimization.
5.  **DFS with Memoization (Top-down DP)** – Problems like **Word Break (#139)** or **Longest Increasing Path in a Matrix (#329)**. This bridges DFS to dynamic programming, a common Amazon combo.
6.  **Complex Applications** – Combining DFS with other structures (Trie for Word Search II, Union-Find for alternative island counting) or complex state (like the Robot Cleaner).

This order builds from simple recursion to managing state, to optimization, to hybrid problems. You can't jump to Word Search II without mastering basic backtracking and trie insertion.

## Recommended Practice Order

Solve these in sequence. Each introduces a new twist on the core patterns.

1.  **Maximum Depth of Binary Tree (#104)** – Basic recursive DFS.
2.  **Binary Tree Inorder Traversal (#94)** – Implement iteratively with a stack.
3.  **Number of Islands (#200)** – Grid DFS with visited marking.
4.  **Clone Graph (#133)** – Graph DFS with a mapping to handle cycles.
5.  **Subsets (#78)** – Standard backtracking introduction.
6.  **Serialize and Deserialize Binary Tree (#297)** – Combines traversal with string handling.
7.  **Word Search II (#212)** – Advanced backtracking with a Trie for pruning. This is a classic Amazon "finale" problem.

Master these, and you'll have covered 90% of the DFS patterns Amazon throws at candidates. Remember, they're testing for clean, bug-free implementation of fundamental patterns that map to real systems, not algorithmic cleverness for its own sake.

[Practice Depth-First Search at Amazon](/company/amazon/depth-first-search)
