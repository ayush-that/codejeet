---
title: "How to Solve Sort Items by Groups Respecting Dependencies — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sort Items by Groups Respecting Dependencies. Hard difficulty, 65.6% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort."
date: "2028-03-05"
category: "dsa-patterns"
tags:
  [
    "sort-items-by-groups-respecting-dependencies",
    "depth-first-search",
    "breadth-first-search",
    "graph-theory",
    "hard",
  ]
---

# How to Solve Sort Items by Groups Respecting Dependencies

This problem asks us to sort items while respecting two types of constraints: items within the same group must stay together, and certain items must come before others based on given dependencies. What makes this tricky is that we need to handle both group-level ordering and item-level ordering simultaneously, with the added complexity that some items don't belong to any group.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

- n = 8 items, m = 2 groups
- group = [-1, -1, 1, 0, 0, 1, 1, -1]
  (Items 0,1,7 have no group; items 2,5,6 are in group 1; items 3,4 are in group 0)
- beforeItems = [[6], [6], [5], [6], [], [], [], []]

**Step-by-step reasoning:**

1. **First observation:** We have two types of dependencies:
   - Item-level: e.g., item 0 must come before item 6
   - Group-level: If items 2 and 5 are both in group 1, they must stay together

2. **Key insight:** We need to solve this as a two-level topological sort:
   - First, figure out the order of groups
   - Then, figure out the order of items within each group

3. **Building the graphs:**
   - Item graph: Nodes are items (0-7), edges from beforeItems
   - Group graph: Nodes are groups (0-1 plus "no group" items), edges derived from item dependencies that cross group boundaries

4. **Processing our example:**
   - Item 0 (no group) → item 6 (group 1): Creates edge: no-group-0 → group 1
   - Item 1 (no group) → item 6 (group 1): Creates edge: no-group-1 → group 1
   - Item 2 (group 1) → item 5 (group 1): Both in same group, so this is an internal group dependency
   - Item 3 (group 0) → item 6 (group 1): Creates edge: group 0 → group 1

5. **Topological sort results:**
   - Group order: [no-group-0, no-group-1, group 0, group 1]
   - Within group 1: Items ordered as [2, 5, 6] (respecting 2→5 and all before 6)
   - Final order: [0, 1, 3, 4, 2, 5, 6, 7]

## Brute Force Approach

A naive approach might try to brute force all permutations of items and check constraints:

1. Generate all permutations of n items (n! possibilities)
2. For each permutation, check:
   - All beforeItems constraints are satisfied
   - Items with the same group appear consecutively
3. Return the first valid permutation

**Why this fails:**

- With n up to 3×10⁴, n! is astronomically large
- Even for small n, checking each permutation would be O(n! × m) which is completely infeasible
- This approach doesn't leverage the graph structure of the problem

The brute force helps us understand the constraints but immediately shows we need a smarter approach using graph algorithms.

## Optimized Approach

The key insight is recognizing this as a **two-level topological sort problem**:

1. **Treat each group as a node** in a group dependency graph
2. **Treat each item as a node** in an item dependency graph
3. **Build group dependencies** from item dependencies that cross group boundaries
4. **Topologically sort groups** to determine group order
5. **Topologically sort items within each group** to determine internal order
6. **Combine results**: For each group in group order, append its sorted items

**Special handling for items without groups:**

- Treat each "no group" item as its own singleton group
- This simplifies the logic since all items now belong to some "group"

**Why topological sort works:**

- The beforeItems constraints create a directed graph
- If there's a cycle in either the group graph or any item graph, sorting is impossible
- Topological sort naturally handles ordering constraints in directed acyclic graphs (DAGs)

## Optimal Solution

Here's the complete implementation using Kahn's algorithm for topological sort:

<div class="code-group">

```python
# Time: O(n + m + E) where E is total dependencies | Space: O(n + m)
def sortItems(n, m, group, beforeItems):
    """
    Sort items respecting group membership and dependencies.

    Args:
        n: number of items
        m: number of groups
        group: list where group[i] is group of item i, or -1 if no group
        beforeItems: list of lists where beforeItems[i] contains items that must come before i

    Returns:
        Sorted list of items or empty list if impossible
    """

    # Step 1: Assign unique groups to items without groups
    # Each no-group item gets its own "singleton group" starting from m
    for i in range(n):
        if group[i] == -1:
            group[i] = m
            m += 1

    # Step 2: Build adjacency lists and indegree arrays for both graphs
    # item_adj: adjacency list for item graph
    # group_adj: adjacency list for group graph
    item_adj = [[] for _ in range(n)]
    group_adj = [[] for _ in range(m)]
    item_indegree = [0] * n
    group_indegree = [0] * m

    # Step 3: Build graphs from dependencies
    for i in range(n):
        for prev in beforeItems[i]:
            # Add edge in item graph
            item_adj[prev].append(i)
            item_indegree[i] += 1

            # If dependency crosses group boundary, add edge in group graph
            if group[prev] != group[i]:
                group_adj[group[prev]].append(group[i])

    # Step 4: Remove duplicate edges from group graph and update indegree
    # This is necessary because multiple item dependencies between same groups
    # should create only one group dependency
    for g in range(m):
        group_adj[g] = list(set(group_adj[g]))
        for neighbor in group_adj[g]:
            group_indegree[neighbor] += 1

    # Step 5: Topological sort of groups using Kahn's algorithm
    def topological_sort(adj, indegree, node_count):
        """Kahn's algorithm for topological sort."""
        queue = [node for node in range(node_count) if indegree[node] == 0]
        result = []

        while queue:
            node = queue.pop(0)
            result.append(node)

            for neighbor in adj[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)

        # If we didn't process all nodes, there's a cycle
        return result if len(result) == node_count else []

    group_order = topological_sort(group_adj, group_indegree, m)
    if not group_order:
        return []  # Cycle in group graph

    # Step 6: Topological sort of items within each group
    # First, group items by their group
    items_by_group = [[] for _ in range(m)]
    for i in range(n):
        items_by_group[group[i]].append(i)

    # Sort items within each group
    result = []
    for g in group_order:
        # Build subgraph for items in this group
        group_items = items_by_group[g]
        if not group_items:
            continue

        # Create mapping from item to index in group_items for faster lookup
        item_to_index = {item: idx for idx, item in enumerate(group_items)}

        # Build adjacency list for this group's items
        local_adj = [[] for _ in range(len(group_items))]
        local_indegree = [0] * len(group_items)

        for item in group_items:
            for neighbor in item_adj[item]:
                # Only include edges where both items are in this group
                if group[neighbor] == g:
                    local_adj[item_to_index[item]].append(item_to_index[neighbor])
                    local_indegree[item_to_index[neighbor]] += 1

        # Topological sort within the group
        local_order = topological_sort(local_adj, local_indegree, len(group_items))
        if not local_order:
            return []  # Cycle in item graph within this group

        # Add sorted items to result
        for idx in local_order:
            result.append(group_items[idx])

    return result
```

```javascript
// Time: O(n + m + E) where E is total dependencies | Space: O(n + m)
function sortItems(n, m, group, beforeItems) {
  // Step 1: Assign unique groups to items without groups
  for (let i = 0; i < n; i++) {
    if (group[i] === -1) {
      group[i] = m;
      m++;
    }
  }

  // Step 2: Initialize data structures
  const itemAdj = Array.from({ length: n }, () => []);
  const groupAdj = Array.from({ length: m }, () => new Set()); // Use Set to avoid duplicates
  const itemIndegree = new Array(n).fill(0);
  const groupIndegree = new Array(m).fill(0);

  // Step 3: Build graphs from dependencies
  for (let i = 0; i < n; i++) {
    for (const prev of beforeItems[i]) {
      // Add edge in item graph
      itemAdj[prev].push(i);
      itemIndegree[i]++;

      // If dependency crosses group boundary, add edge in group graph
      if (group[prev] !== group[i]) {
        groupAdj[group[prev]].add(group[i]);
      }
    }
  }

  // Step 4: Convert group adjacency sets to arrays and calculate indegree
  const groupAdjArray = Array.from({ length: m }, () => []);
  for (let g = 0; g < m; g++) {
    groupAdjArray[g] = Array.from(groupAdj[g]);
    for (const neighbor of groupAdjArray[g]) {
      groupIndegree[neighbor]++;
    }
  }

  // Step 5: Kahn's algorithm for topological sort
  function topologicalSort(adj, indegree, nodeCount) {
    const queue = [];
    for (let i = 0; i < nodeCount; i++) {
      if (indegree[i] === 0) {
        queue.push(i);
      }
    }

    const result = [];
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node);

      for (const neighbor of adj[node]) {
        indegree[neighbor]--;
        if (indegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

    return result.length === nodeCount ? result : [];
  }

  // Sort groups
  const groupOrder = topologicalSort(groupAdjArray, [...groupIndegree], m);
  if (groupOrder.length === 0) {
    return []; // Cycle in group graph
  }

  // Step 6: Group items by their group
  const itemsByGroup = Array.from({ length: m }, () => []);
  for (let i = 0; i < n; i++) {
    itemsByGroup[group[i]].push(i);
  }

  // Step 7: Sort items within each group
  const result = [];
  for (const g of groupOrder) {
    const groupItems = itemsByGroup[g];
    if (groupItems.length === 0) continue;

    // Create mapping from item to index
    const itemToIndex = new Map();
    groupItems.forEach((item, idx) => itemToIndex.set(item, idx));

    // Build local adjacency for this group
    const localAdj = Array.from({ length: groupItems.length }, () => []);
    const localIndegree = new Array(groupItems.length).fill(0);

    for (const item of groupItems) {
      for (const neighbor of itemAdj[item]) {
        if (group[neighbor] === g) {
          const itemIdx = itemToIndex.get(item);
          const neighborIdx = itemToIndex.get(neighbor);
          localAdj[itemIdx].push(neighborIdx);
          localIndegree[neighborIdx]++;
        }
      }
    }

    // Sort items within group
    const localOrder = topologicalSort(localAdj, localIndegree, groupItems.length);
    if (localOrder.length === 0) {
      return []; // Cycle in item graph within this group
    }

    // Add to result
    for (const idx of localOrder) {
      result.push(groupItems[idx]);
    }
  }

  return result;
}
```

```java
// Time: O(n + m + E) where E is total dependencies | Space: O(n + m)
class Solution {
    public int[] sortItems(int n, int m, int[] group, List<List<Integer>> beforeItems) {
        // Step 1: Assign unique groups to items without groups
        for (int i = 0; i < n; i++) {
            if (group[i] == -1) {
                group[i] = m;
                m++;
            }
        }

        // Step 2: Initialize data structures
        List<Integer>[] itemAdj = new ArrayList[n];
        List<Integer>[] groupAdj = new ArrayList[m];
        int[] itemIndegree = new int[n];
        int[] groupIndegree = new int[m];

        for (int i = 0; i < n; i++) itemAdj[i] = new ArrayList<>();
        for (int i = 0; i < m; i++) groupAdj[i] = new ArrayList<>();

        // Step 3: Build graphs from dependencies
        for (int i = 0; i < n; i++) {
            for (int prev : beforeItems.get(i)) {
                // Add edge in item graph
                itemAdj[prev].add(i);
                itemIndegree[i]++;

                // If dependency crosses group boundary, add edge in group graph
                if (group[prev] != group[i]) {
                    groupAdj[group[prev]].add(group[i]);
                }
            }
        }

        // Step 4: Remove duplicates from group adjacency and calculate indegree
        for (int g = 0; g < m; g++) {
            // Remove duplicates using a set
            List<Integer> uniqueNeighbors = new ArrayList<>(new HashSet<>(groupAdj[g]));
            groupAdj[g] = uniqueNeighbors;
            for (int neighbor : groupAdj[g]) {
                groupIndegree[neighbor]++;
            }
        }

        // Step 5: Topological sort of groups
        List<Integer> groupOrder = topologicalSort(groupAdj, groupIndegree, m);
        if (groupOrder.size() != m) {
            return new int[0]; // Cycle in group graph
        }

        // Step 6: Group items by their group
        List<Integer>[] itemsByGroup = new ArrayList[m];
        for (int i = 0; i < m; i++) itemsByGroup[i] = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            itemsByGroup[group[i]].add(i);
        }

        // Step 7: Sort items within each group
        List<Integer> result = new ArrayList<>();
        for (int g : groupOrder) {
            List<Integer> groupItems = itemsByGroup[g];
            if (groupItems.isEmpty()) continue;

            // Create mapping from item to index
            Map<Integer, Integer> itemToIndex = new HashMap<>();
            for (int idx = 0; idx < groupItems.size(); idx++) {
                itemToIndex.put(groupItems.get(idx), idx);
            }

            // Build local adjacency for this group
            List<Integer>[] localAdj = new ArrayList[groupItems.size()];
            int[] localIndegree = new int[groupItems.size()];
            for (int i = 0; i < groupItems.size(); i++) localAdj[i] = new ArrayList<>();

            for (int item : groupItems) {
                for (int neighbor : itemAdj[item]) {
                    if (group[neighbor] == g) {
                        int itemIdx = itemToIndex.get(item);
                        int neighborIdx = itemToIndex.get(neighbor);
                        localAdj[itemIdx].add(neighborIdx);
                        localIndegree[neighborIdx]++;
                    }
                }
            }

            // Sort items within group
            List<Integer> localOrder = topologicalSort(localAdj, localIndegree, groupItems.size());
            if (localOrder.size() != groupItems.size()) {
                return new int[0]; // Cycle in item graph within this group
            }

            // Add to result
            for (int idx : localOrder) {
                result.add(groupItems.get(idx));
            }
        }

        // Convert List<Integer> to int[]
        return result.stream().mapToInt(i -> i).toArray();
    }

    private List<Integer> topologicalSort(List<Integer>[] adj, int[] indegree, int nodeCount) {
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < nodeCount; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }

        List<Integer> result = new ArrayList<>();
        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);

            for (int neighbor : adj[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m + E)**

- `n`: Number of items
- `m`: Number of groups (after assigning singletons to no-group items)
- `E`: Total number of dependencies (sum of lengths of all beforeItems lists)

**Breakdown:**

1. Assigning groups to no-group items: O(n)
2. Building item graph: O(E)
3. Building group graph: O(E) for checking boundaries + O(m + E) for deduplication
4. Topological sort of groups: O(m + E_g) where E_g is edges in group graph
5. Grouping items by group: O(n)
6. Topological sort within each group: O(n + E) total across all groups

**Space Complexity: O(n + m + E)**

- Item adjacency list: O(n + E)
- Group adjacency list: O(m + E_g) where E_g ≤ E
- Indegree arrays: O(n + m)
- Items by group: O(n)
- Queue for BFS: O(n + m) in worst case

## Common Mistakes

1. **Forgetting to handle items without groups**: The trick of assigning each no-group item its own singleton group is crucial. Without this, you'd need special case handling throughout the algorithm.

2. **Creating duplicate edges in group graph**: Multiple item dependencies between the same two groups should create only one group dependency. Failing to deduplicate can cause incorrect indegree counts and topological sort failures.

3. **Not checking for cycles at both levels**: You must check for cycles in both the group graph AND within each group's item graph. A cycle at either level makes sorting impossible.

4. **Incorrectly building the within-group graph**: When building the adjacency for items within a group, you must only include edges where both endpoints are in that group. Including cross-group edges here would duplicate constraints already handled at the group level.

## When You'll See This Pattern

This two-level topological sort pattern appears in problems with hierarchical constraints:

1. **Course Schedule II (LeetCode 210)**: Single-level topological sort for course prerequisites. This problem extends that concept to two levels.

2. **Parallel Courses (LeetCode 1494)**: Scheduling courses with prerequisites across semesters, similar to grouping constraints.

3. **Alien Dictionary (LeetCode 269)**: Building ordering constraints from pairwise comparisons, then topologically sorting.

4. **Sequence Reconstruction (LeetCode 444)**: Verifying if a sequence is the unique topological sort of a graph.

The key insight is recognizing when constraints can be separated into independent levels that can be solved sequentially.

## Key Takeaways

1. **Hierarchical constraints often require layered topological sorts**: When you see ordering constraints at multiple levels (like group-level and item-level), consider solving each level independently.

2. **Simplify by normalizing the input**: Converting all items to have a group (by assigning singleton groups to no-group items) makes the algorithm cleaner and more uniform.

3. **Watch for duplicate edges in derived graphs**: When building higher-level graphs from lower-level dependencies, deduplication is often necessary to maintain correct indegree counts.

4. **Always check for cycles at every level**: In multi-level sorts, a cycle at any level makes the entire problem unsolvable.

[Practice this problem on CodeJeet](/problem/sort-items-by-groups-respecting-dependencies)
