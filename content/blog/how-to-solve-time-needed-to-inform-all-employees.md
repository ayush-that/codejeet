---
title: "How to Solve Time Needed to Inform All Employees — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Time Needed to Inform All Employees. Medium difficulty, 60.4% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search."
date: "2028-04-21"
category: "dsa-patterns"
tags:
  [
    "time-needed-to-inform-all-employees",
    "tree",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve "Time Needed to Inform All Employees"

This problem asks us to calculate the total time required for a message to propagate from the company head to all employees through a management hierarchy. Each employee has exactly one direct manager (forming a tree structure), and information flows downward with each edge having a time cost. The challenge lies in efficiently calculating the maximum time path from the root to any leaf in this weighted tree.

## Visual Walkthrough

Let's trace through a small example:

- n = 6, headID = 2
- manager = [2,2,-1,2,2,2]
- informTime = [0,0,1,0,0,0]

This represents a company where employee 2 is the head (manager[2] = -1), and employees 0, 1, 3, 4, 5 all report directly to employee 2. The informTime array tells us that employee 2 needs 1 minute to inform their direct reports, while all other employees need 0 minutes.

The tree structure looks like:

```
        2 (1 min)
     / / | \ \
    0 1  3 4 5 (all 0 min)
```

The information flow:

1. At time 0: Employee 2 (head) starts receiving the info (or has it initially)
2. From time 0 to 1: Employee 2 spends 1 minute informing their direct reports
3. At time 1: All other employees (0, 1, 3, 4, 5) receive the information

Total time needed: 1 minute

Now consider a more complex example:

- n = 8, headID = 4
- manager = [2,2,4,4,-1,4,5,5]
- informTime = [0,0,4,0,7,3,0,0]

Tree structure:

```
          4 (7 min)
         /   \
        2     5 (3 min)
       / \   / \
      0   1 6   7
       \
        3
```

Information flow:

- Path 4→2→0→3: 7 + 4 + 0 + 0 = 11 minutes
- Path 4→2→1: 7 + 4 + 0 = 11 minutes
- Path 4→5→6: 7 + 3 + 0 = 10 minutes
- Path 4→5→7: 7 + 3 + 0 = 10 minutes

Maximum time: 11 minutes

## Brute Force Approach

A naive approach might try to trace every possible path from each employee up to the head, but this would be inefficient. Another brute force approach would be to repeatedly traverse from leaves to root for each employee, calculating their individual receive time by summing informTimes along the path to the head.

The problem with this approach is that we'd be repeatedly calculating the same subpaths. For example, in the tree above, employees 0 and 1 both share the path from employee 2 to the head, but we'd calculate it twice. This leads to O(n²) worst-case time complexity for a degenerate tree (where all employees are in a straight line).

## Optimized Approach

The key insight is that this is essentially finding the **maximum weighted path from root to any leaf in a tree**. Since each employee has exactly one manager (except the head), the management structure forms a tree rooted at the headID.

We can solve this efficiently using **DFS (Depth-First Search)** or **BFS (Breadth-First Search)**:

1. **Build an adjacency list**: Convert the manager array into a more useful structure. Since information flows downward (from managers to subordinates), we need to know for each manager, who their direct reports are.

2. **Traverse the tree**: Starting from the head, traverse to all employees. At each node, add the current node's informTime to the total time so far, and continue to its subordinates.

3. **Track the maximum**: As we reach each employee (leaf or not), we track the maximum total time encountered.

The reason DFS works well here is that we're looking for the maximum path sum from root to any node, which is naturally computed through recursive traversal.

## Optimal Solution

We'll implement a DFS solution that builds an adjacency list and recursively calculates the maximum time.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numOfMinutes(n, headID, manager, informTime):
    """
    Calculate the total time needed to inform all employees.

    Args:
        n: Number of employees
        headID: ID of the head employee
        manager: List where manager[i] is the manager of employee i
        informTime: List where informTime[i] is time needed for employee i to inform direct reports

    Returns:
        Maximum time from head to any employee
    """
    # Step 1: Build adjacency list - for each manager, store list of direct reports
    # This converts the upward-pointing manager array to a downward-pointing tree structure
    adj = [[] for _ in range(n)]
    for i in range(n):
        if manager[i] != -1:  # Skip the head (has no manager)
            adj[manager[i]].append(i)

    # Step 2: DFS function to calculate maximum time from current node to any leaf
    def dfs(node):
        """
        Recursive DFS to find maximum time from current node to any leaf.

        Args:
            node: Current employee ID

        Returns:
            Maximum time from this node to any employee in its subtree
        """
        max_time = 0

        # For each subordinate of the current node
        for subordinate in adj[node]:
            # Recursively calculate max time for subordinate's subtree
            # Add informTime[node] because current node needs this time to inform the subordinate
            max_time = max(max_time, dfs(subordinate))

        # The total time for this node's path is:
        # max time in subtree + time needed for this node to inform its direct reports
        return max_time + informTime[node]

    # Step 3: Start DFS from the head
    return dfs(headID)
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Calculate the total time needed to inform all employees.
 *
 * @param {number} n - Number of employees
 * @param {number} headID - ID of the head employee
 * @param {number[]} manager - Array where manager[i] is the manager of employee i
 * @param {number[]} informTime - Array where informTime[i] is time needed for employee i to inform direct reports
 * @return {number} Maximum time from head to any employee
 */
function numOfMinutes(n, headID, manager, informTime) {
  // Step 1: Build adjacency list - for each manager, store list of direct reports
  // This converts the upward-pointing manager array to a downward-pointing tree structure
  const adj = new Array(n);
  for (let i = 0; i < n; i++) {
    adj[i] = [];
  }

  for (let i = 0; i < n; i++) {
    if (manager[i] !== -1) {
      // Skip the head (has no manager)
      adj[manager[i]].push(i);
    }
  }

  // Step 2: DFS function to calculate maximum time from current node to any leaf
  /**
   * Recursive DFS to find maximum time from current node to any leaf.
   *
   * @param {number} node - Current employee ID
   * @return {number} Maximum time from this node to any employee in its subtree
   */
  function dfs(node) {
    let maxTime = 0;

    // For each subordinate of the current node
    for (const subordinate of adj[node]) {
      // Recursively calculate max time for subordinate's subtree
      // The subordinate's time includes informTime[node] because current node
      // needs this time to inform the subordinate
      maxTime = Math.max(maxTime, dfs(subordinate));
    }

    // The total time for this node's path is:
    // max time in subtree + time needed for this node to inform its direct reports
    return maxTime + informTime[node];
  }

  // Step 3: Start DFS from the head
  return dfs(headID);
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Calculate the total time needed to inform all employees.
     *
     * @param n Number of employees
     * @param headID ID of the head employee
     * @param manager Array where manager[i] is the manager of employee i
     * @param informTime Array where informTime[i] is time needed for employee i to inform direct reports
     * @return Maximum time from head to any employee
     */
    public int numOfMinutes(int n, int headID, int[] manager, int[] informTime) {
        // Step 1: Build adjacency list - for each manager, store list of direct reports
        // This converts the upward-pointing manager array to a downward-pointing tree structure
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }

        for (int i = 0; i < n; i++) {
            if (manager[i] != -1) {  // Skip the head (has no manager)
                adj.get(manager[i]).add(i);
            }
        }

        // Step 2: Start DFS from the head
        return dfs(headID, adj, informTime);
    }

    /**
     * Recursive DFS to find maximum time from current node to any leaf.
     *
     * @param node Current employee ID
     * @param adj Adjacency list representing the tree
     * @param informTime Array of inform times for each employee
     * @return Maximum time from this node to any employee in its subtree
     */
    private int dfs(int node, List<List<Integer>> adj, int[] informTime) {
        int maxTime = 0;

        // For each subordinate of the current node
        for (int subordinate : adj.get(node)) {
            // Recursively calculate max time for subordinate's subtree
            // The subordinate's time includes informTime[node] because current node
            // needs this time to inform the subordinate
            maxTime = Math.max(maxTime, dfs(subordinate, adj, informTime));
        }

        // The total time for this node's path is:
        // max time in subtree + time needed for this node to inform its direct reports
        return maxTime + informTime[node];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list takes O(n) time as we iterate through all employees once
- The DFS visits each node exactly once, and for each node, we process all its edges
- In total, we process n-1 edges (since it's a tree with n nodes), resulting in O(n) time

**Space Complexity: O(n)**

- The adjacency list stores lists for all n employees. In total, it stores n-1 edges (each employee except head has one manager), so O(n) space
- The recursion call stack can go as deep as the height of the tree. In the worst case (degenerate tree), this is O(n)
- Total space: O(n) for adjacency list + O(n) for call stack = O(n)

## Common Mistakes

1. **Not building an adjacency list**: Some candidates try to work directly with the manager array, repeatedly traversing upward from each employee. This leads to O(n²) time for degenerate trees. Always convert to a more efficient data structure when possible.

2. **Incorrectly handling the head node**: The head has manager[headID] = -1. Forgetting to check for this when building the adjacency list can cause index errors or incorrect tree structure.

3. **Adding informTime at the wrong level**: A common error is to add the informTime of a node when processing its children instead of when processing the node itself. Remember: when employee X informs their direct reports, that time should be added to the path for all employees in X's subtree.

4. **Using BFS without proper time tracking**: While BFS can work, it requires careful tracking of cumulative time for each node. A naive BFS that just sums times level by level won't work correctly for trees of varying depths.

## When You'll See This Pattern

This problem uses **tree traversal with path sum accumulation**, a pattern common in many tree problems:

1. **Maximum Depth of Binary Tree (Easy)**: Similar concept but with uniform edge weights (each edge adds 1 to the depth). This problem generalizes that with weighted edges.

2. **Binary Tree Maximum Path Sum (Hard)**: Also involves finding maximum paths in trees, though more complex as paths don't have to go through the root. Both require careful tracking of maximum values during traversal.

3. **Sum Root to Leaf Numbers (Medium)**: Another path accumulation problem where you sum values along root-to-leaf paths.

4. **Longest Univalue Path (Medium)**: Finding the longest path with the same value nodes - similar tree traversal with state tracking.

The core pattern is: when you need to compute something along all root-to-leaf paths in a tree, DFS with proper state passing is usually the right approach.

## Key Takeaways

1. **Tree representation matters**: The given manager array points upward (child to parent), but for efficient downward traversal, convert it to an adjacency list pointing downward (parent to children).

2. **DFS for path problems**: When you need to find maximum/minimum/sum of paths from root to leaves in a tree, DFS is natural because it explores complete paths before backtracking.

3. **Think about what to store at each node**: In this problem, at each node we need to know the maximum time in its subtree. The recursive function returns this, and each node adds its own informTime to the maximum of its children's results.

Related problems: [Maximum Depth of Binary Tree](/problem/maximum-depth-of-binary-tree), [Binary Tree Maximum Path Sum](/problem/binary-tree-maximum-path-sum)
