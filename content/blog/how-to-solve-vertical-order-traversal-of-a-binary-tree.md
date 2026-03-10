---
title: "How to Solve Vertical Order Traversal of a Binary Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Vertical Order Traversal of a Binary Tree. Hard difficulty, 53.3% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Sorting."
date: "2027-01-20"
category: "dsa-patterns"
tags:
  ["vertical-order-traversal-of-a-binary-tree", "hash-table", "tree", "depth-first-search", "hard"]
---

# How to Solve Vertical Order Traversal of a Binary Tree

This problem asks us to traverse a binary tree vertically, grouping nodes by their column positions while sorting nodes in the same column and row by their values. What makes this problem tricky is that it's not just a simple vertical traversal—we need to handle three sorting criteria: columns (left to right), rows (top to bottom), and values (for nodes in the same position). The "Hard" difficulty comes from managing these multiple sorting layers correctly.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree:

```
        3
       / \
      9   20
         /  \
        15   7
```

**Step 1: Assign coordinates**

- Root (3) at (row=0, col=0)
- Left child (9) at (row=1, col=-1)
- Right child (20) at (row=1, col=1)
- 20's left child (15) at (row=2, col=0)
- 20's right child (7) at (row=2, col=2)

**Step 2: Group by column**

- Column -1: [9 at (1,-1)]
- Column 0: [3 at (0,0), 15 at (2,0)]
- Column 1: [20 at (1,1)]
- Column 2: [7 at (2,2)]

**Step 3: Sort within columns**
For column 0, we have two nodes at different rows. They should be sorted by row first (top to bottom), so 3 comes before 15. No value sorting needed since they're at different rows.

**Final output:** `[[9], [3,15], [20], [7]]`

Now let's consider a more complex case where sorting by value matters:

```
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

At column 0, we have nodes 2 (row=1) and 6 (row=2) — different rows, so row sorting applies.
At column -1, we have nodes 4 (row=2) and 5 (row=2) — same row and column, so we must sort by value: [4,5].

## Brute Force Approach

A naive approach might be:

1. Traverse the tree and collect all nodes with their (row, col, value) tuples
2. Group nodes by column
3. For each column, sort by row, then by value
4. Extract just the values from each sorted group

While this approach would technically work, it's inefficient because:

- We're doing global sorting across all nodes when we only need sorting within columns
- The grouping step requires additional passes through the data
- We need to handle the three-level sorting manually

More importantly, a truly naive implementation might miss the subtle requirement that nodes at the same (row, col) must be sorted by value. Many candidates initially think "just sort by column, then row" and fail their first submission.

## Optimized Approach

The key insight is that we need to track three pieces of information for each node: column, row, and value. We can use a traversal (DFS or BFS) to collect this data, then process it efficiently.

**Step-by-step reasoning:**

1. **Traverse the tree** using DFS or BFS, tracking (row, col) for each node
2. **Store nodes in a dictionary** keyed by column: `column -> list of (row, value)`
3. **After traversal**, for each column:
   - Sort the list first by row (ascending), then by value (ascending)
   - Extract just the values from the sorted list
4. **Sort columns** from leftmost (most negative) to rightmost (most positive)
5. **Return** the lists of values in column order

The critical optimization is using a dictionary for O(1) grouping by column during traversal, then only sorting within each column rather than sorting all nodes globally.

## Optimal Solution

Here's the complete solution using DFS with careful sorting:

<div class="code-group">

```python
# Time: O(n log n) - sorting within columns
# Space: O(n) - storing all nodes in dictionary
class Solution:
    def verticalTraversal(self, root: Optional[TreeNode]) -> List[List[int]]:
        # Dictionary to store nodes by column: {col: [(row, value), ...]}
        column_map = {}

        def dfs(node, row, col):
            if not node:
                return

            # Add current node to its column group
            if col not in column_map:
                column_map[col] = []
            column_map[col].append((row, node.val))

            # Traverse left child: row increases by 1, column decreases by 1
            dfs(node.left, row + 1, col - 1)
            # Traverse right child: row increases by 1, column increases by 1
            dfs(node.right, row + 1, col + 1)

        # Start DFS from root at position (0, 0)
        dfs(root, 0, 0)

        # Get sorted list of columns (left to right)
        sorted_columns = sorted(column_map.keys())

        result = []
        for col in sorted_columns:
            # Sort nodes in this column by row first, then by value
            column_nodes = sorted(column_map[col], key=lambda x: (x[0], x[1]))
            # Extract just the values in sorted order
            column_values = [val for _, val in column_nodes]
            result.append(column_values)

        return result
```

```javascript
// Time: O(n log n) - sorting within columns
// Space: O(n) - storing all nodes in map
function verticalTraversal(root) {
  // Map to store nodes by column: col -> [{row, val}, ...]
  const columnMap = new Map();

  function dfs(node, row, col) {
    if (!node) return;

    // Add current node to its column group
    if (!columnMap.has(col)) {
      columnMap.set(col, []);
    }
    columnMap.get(col).push({ row, val: node.val });

    // Traverse left child: row + 1, col - 1
    dfs(node.left, row + 1, col - 1);
    // Traverse right child: row + 1, col + 1
    dfs(node.right, row + 1, col + 1);
  }

  // Start DFS from root at position (0, 0)
  dfs(root, 0, 0);

  // Get sorted list of columns (left to right)
  const sortedColumns = Array.from(columnMap.keys()).sort((a, b) => a - b);

  const result = [];
  for (const col of sortedColumns) {
    // Sort nodes in this column by row first, then by value
    const columnNodes = columnMap.get(col);
    columnNodes.sort((a, b) => {
      if (a.row === b.row) {
        return a.val - b.val;
      }
      return a.row - b.row;
    });

    // Extract just the values in sorted order
    const columnValues = columnNodes.map((node) => node.val);
    result.push(columnValues);
  }

  return result;
}
```

```java
// Time: O(n log n) - sorting within columns
// Space: O(n) - storing all nodes in map
class Solution {
    public List<List<Integer>> verticalTraversal(TreeNode root) {
        // TreeMap to store nodes by column, automatically sorted by column
        // Column -> List of {row, value} pairs
        TreeMap<Integer, List<int[]>> columnMap = new TreeMap<>();

        // DFS traversal
        dfs(root, 0, 0, columnMap);

        // Build result from sorted columns
        List<List<Integer>> result = new ArrayList<>();
        for (int col : columnMap.keySet()) {
            // Get nodes in this column
            List<int[]> nodes = columnMap.get(col);

            // Sort by row first, then by value
            nodes.sort((a, b) -> {
                if (a[0] == b[0]) {
                    return a[1] - b[1];  // Compare values if same row
                }
                return a[0] - b[0];      // Compare rows
            });

            // Extract values
            List<Integer> columnValues = new ArrayList<>();
            for (int[] node : nodes) {
                columnValues.add(node[1]);
            }
            result.add(columnValues);
        }

        return result;
    }

    private void dfs(TreeNode node, int row, int col,
                     TreeMap<Integer, List<int[]>> columnMap) {
        if (node == null) return;

        // Add current node to its column group
        columnMap.putIfAbsent(col, new ArrayList<>());
        columnMap.get(col).add(new int[]{row, node.val});

        // Traverse left child
        dfs(node.left, row + 1, col - 1, columnMap);
        // Traverse right child
        dfs(node.right, row + 1, col + 1, columnMap);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- DFS/BFS traversal: O(n) to visit all n nodes
- Sorting columns: O(c log c) where c is number of columns (≤ n)
- Sorting within each column: In worst case, all nodes could be in one column, requiring O(n log n) sorting
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- Recursion stack: O(h) where h is tree height (O(n) in worst case for skewed tree)
- Dictionary/map storage: O(n) to store all nodes with their metadata
- Output list: O(n) for the result

The log factor comes from sorting nodes within columns. We can't avoid this because the problem requires specific ordering.

## Common Mistakes

1. **Forgetting to sort by value when rows are equal**: This is the most common mistake. Candidates correctly sort by column and row but miss that nodes at the same (row, col) must be sorted by value. Always check the example `[[1,2,3,4,5,6,7]]` where nodes 4 and 5 are at the same position.

2. **Using BFS without proper sorting**: With BFS, nodes at the same row are discovered in level order, but this doesn't guarantee value ordering within the same (row, col). You still need to sort after traversal.

3. **Incorrect column sorting order**: Columns should be sorted from most negative (leftmost) to most positive (rightmost). Using a regular hash map without sorting keys or using `Collections.sort()` incorrectly can lead to wrong column order.

4. **Not handling empty tree**: Always check if root is null and return empty list immediately. The traversal will handle it, but being explicit shows defensive programming.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Tree Traversal with Coordinate Tracking**: Similar to problems like:
   - "Binary Tree Level Order Traversal" (LeetCode 102) - but with 2D coordinates
   - "Binary Tree Right Side View" (LeetCode 199) - tracking depth/position

2. **Multi-level Sorting**: Problems requiring sorting by multiple criteria:
   - "Sort Characters By Frequency" (LeetCode 451) - sort by frequency, then character
   - "Reorder Data in Log Files" (LeetCode 937) - complex multi-field sorting

3. **Column/Grid-based Grouping**:
   - "Diagonal Traverse" (LeetCode 498) - grouping by diagonal (row-col constant)
   - "Find Duplicate Subtrees" (LeetCode 652) - using hashing to group similar structures

The core technique of traversing while tracking metadata (coordinates) and then grouping/sorting appears in many tree and graph problems.

## Key Takeaways

1. **When a problem requires grouping by computed properties** (like column position), use a dictionary/map during traversal to collect elements, then process the groups afterward. This avoids multiple passes through the data.

2. **For multi-criteria sorting**, use tuple sorting or custom comparators that check criteria in priority order. Remember: when the primary criteria are equal, fall back to secondary criteria.

3. **Tree problems often combine traversal with additional state tracking**. Whether it's coordinates, depth, path sums, or other metadata, extending basic DFS/BFS with parameter tracking is a powerful pattern.

[Practice this problem on CodeJeet](/problem/vertical-order-traversal-of-a-binary-tree)
