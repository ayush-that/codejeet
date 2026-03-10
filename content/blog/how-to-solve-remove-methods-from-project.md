---
title: "How to Solve Remove Methods From Project — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Methods From Project. Medium difficulty, 50.4% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory."
date: "2029-07-04"
category: "dsa-patterns"
tags:
  [
    "remove-methods-from-project",
    "depth-first-search",
    "breadth-first-search",
    "graph-theory",
    "medium",
  ]
---

## Problem Restatement

We have `n` methods (0 to n-1) and a bug in method `k`. When a method invokes another, the bug propagates. We need to find all methods that either **are** the buggy method `k` or **can invoke** `k` (directly or indirectly through a chain of invocations). These methods must be removed from the project. The tricky part is that the invocation graph isn't necessarily a tree—it can have cycles, and we need to avoid infinite loops while correctly identifying all reachable nodes from `k` in the **reverse graph** (since we care about who can call `k`, not who `k` calls).

## Visual Walkthrough

Let’s trace through a small example:

- `n = 5`, `k = 2`
- `invocations = [[0,1], [1,2], [3,4], [4,2], [2,3]]`

We need to find all methods that can reach method 2. Let’s think in reverse: instead of following where method 2 calls, we ask, "Who calls method 2?" and then "Who calls those callers?" This is a **reverse graph traversal**.

**Step 1:** Build the reverse adjacency list:

- 0 → 1
- 1 → 2
- 3 → 4
- 4 → 2
- 2 → 3

Reverse each edge:

- 1 → 0
- 2 → 1
- 4 → 3
- 2 → 4
- 3 → 2

So reverse list:

- 0: []
- 1: [0]
- 2: [1, 4]
- 3: [2]
- 4: [3]

**Step 2:** Start DFS/BFS from `k = 2` in the reverse graph:

- Start at 2 → mark 2 as reachable.
- Neighbors of 2: 1 and 4.
- Visit 1 → mark reachable → neighbor 0 → mark reachable.
- Visit 4 → mark reachable → neighbor 3 → mark reachable → neighbor 2 (already visited, stop).

**Step 3:** Reachable set = {0, 1, 2, 3, 4}. All methods are buggy! Return this list sorted.

The key insight: we traverse the **reverse graph** starting from `k` to find all ancestors (callers) of `k`.

## Brute Force Approach

A naive approach might try to simulate the bug propagation forward: start from `k`, follow invocations to see where the bug spreads, then collect those methods. But that’s **wrong**—the bug spreads **to** `k`, not from it. Another brute force idea: for each method `i`, check if there exists a path from `i` to `k` in the original graph by running DFS/BFS from every node. That’s `O(n * (n + e))` where `e` is the number of invocations. For `n` up to 10⁵, this is far too slow (10¹⁰ operations). We need a single traversal.

## Optimized Approach

The problem reduces to **finding all nodes that have a path to node `k` in a directed graph**. This is exactly the set of ancestors of `k`. If we reverse all edges, then ancestors become descendants—so we just need to find all nodes reachable from `k` in the **reversed graph**. This is a standard graph traversal (DFS or BFS) starting from `k`.

**Why reverse the graph?**

- Original edge `a → b` means `a` calls `b`.
- If `b` is buggy, `a` is buggy (because it calls buggy code).
- So we care about who calls `k`. In the original graph, that means finding nodes with a path **to** `k\*\*.
- Reversing edges turns "who calls k" into "who does k call in the reversed graph"—a straightforward reachability problem.

**Handling cycles:**
Cycles are fine—if methods A and B call each other, and one can reach `k`, both are buggy. Our visited set prevents infinite loops.

**Steps:**

1. Build reverse adjacency list.
2. Run DFS/BFS from `k` in the reversed graph.
3. Collect all visited nodes.
4. Return sorted list (or as a set if order doesn’t matter—problem says return in any order).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + e) where e = len(invocations)
# Space: O(n + e) for reverse adjacency list and visited set
from collections import deque

def removeMethods(n, k, invocations):
    # Step 1: Build reverse adjacency list
    reverse_adj = [[] for _ in range(n)]
    for caller, callee in invocations:
        # Original: caller -> callee
        # Reverse: callee -> caller (we want who calls whom)
        reverse_adj[callee].append(caller)

    # Step 2: BFS from k in the reversed graph
    visited = [False] * n
    queue = deque([k])
    visited[k] = True

    while queue:
        node = queue.popleft()
        # For each method that calls this node (in original graph)
        for neighbor in reverse_adj[node]:
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)

    # Step 3: Collect all visited nodes (methods that can invoke k)
    result = [i for i in range(n) if visited[i]]
    return result
```

```javascript
// Time: O(n + e) where e = invocations.length
// Space: O(n + e) for reverse adjacency list and visited array
function removeMethods(n, k, invocations) {
  // Step 1: Build reverse adjacency list
  const reverseAdj = Array.from({ length: n }, () => []);
  for (const [caller, callee] of invocations) {
    // Original: caller -> callee
    // Reverse: callee -> caller
    reverseAdj[callee].push(caller);
  }

  // Step 2: BFS from k in reversed graph
  const visited = new Array(n).fill(false);
  const queue = [k];
  visited[k] = true;

  while (queue.length > 0) {
    const node = queue.shift();
    // For each method that calls this node
    for (const neighbor of reverseAdj[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }

  // Step 3: Collect all visited nodes
  const result = [];
  for (let i = 0; i < n; i++) {
    if (visited[i]) result.push(i);
  }
  return result;
}
```

```java
// Time: O(n + e) where e = invocations.length
// Space: O(n + e) for reverse adjacency list and visited array
import java.util.*;

public class Solution {
    public List<Integer> removeMethods(int n, int k, int[][] invocations) {
        // Step 1: Build reverse adjacency list
        List<Integer>[] reverseAdj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            reverseAdj[i] = new ArrayList<>();
        }
        for (int[] inv : invocations) {
            int caller = inv[0];
            int callee = inv[1];
            // Original: caller -> callee
            // Reverse: callee -> caller
            reverseAdj[callee].add(caller);
        }

        // Step 2: BFS from k in reversed graph
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(k);
        visited[k] = true;

        while (!queue.isEmpty()) {
            int node = queue.poll();
            // For each method that calls this node
            for (int neighbor : reverseAdj[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }

        // Step 3: Collect all visited nodes
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (visited[i]) {
                result.add(i);
            }
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

- **Time Complexity:** `O(n + e)` where `e` is the number of invocations. We build the reverse adjacency list in `O(e)` time and traverse all reachable nodes in `O(n + e)` worst case (visiting each node and edge once).
- **Space Complexity:** `O(n + e)` for storing the reverse adjacency list (each edge stored once) and the visited array/queue (`O(n)`). In the worst case, the graph could be dense, but constraints typically keep this manageable.

## Common Mistakes

1. **Traversing the original graph from `k`:** This finds methods that `k` calls, but we need methods that call `k`. Always verify direction: bug propagates **upstream** to callers, not downstream to callees.
2. **Forgetting to handle cycles:** Without a visited set, cycles cause infinite recursion/loops. Always track visited nodes in graph traversal.
3. **Building the adjacency list incorrectly:** Mixing up caller and callee when reversing edges. Remember: we want `reverse_adj[callee].append(caller)`.
4. **Assuming the graph is connected:** Some methods may have no invocations—they’re isolated. Our BFS/DFS will only visit reachable nodes from `k`, which is correct.

## When You'll See This Pattern

This "reverse graph reachability" pattern appears in problems where you need to find ancestors/predecessors in a directed graph:

- **LeetCode 2192: All Ancestors of a Node in a Directed Acyclic Graph** — Exactly the same concept: find all ancestors by reverse DFS/BFS.
- **LeetCode 1557: Minimum Number of Vertices to Reach All Nodes** — While not identical, it involves analyzing reachability in directed graphs.
- **LeetCode 802: Find Eventual Safe States** — Uses reverse graph traversal to find nodes that eventually reach a terminal state.

Recognize this pattern when you need to find "who can reach this node" rather than "who can this node reach."

## Key Takeaways

1. **Reverse the graph to transform ancestor problems into reachability problems.** When you need to find all nodes with a path **to** a target, reverse edges and traverse **from** the target.
2. **Directed graph cycles don’t break BFS/DFS if you track visited nodes.** Use a visited set to avoid infinite loops.
3. **Always clarify edge direction in invocation/call graphs.** A small misunderstanding of "calls" vs "is called by" leads to completely wrong traversal.

[Practice this problem on CodeJeet](/problem/remove-methods-from-project)
