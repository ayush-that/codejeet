---
title: "How to Solve Tree Node — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Tree Node. Medium difficulty, 75.2% acceptance rate. Topics: Database."
date: "2028-05-31"
category: "dsa-patterns"
tags: ["tree-node", "database", "medium"]
---

## How to Solve Tree Node

This database problem asks us to categorize each node in a tree structure as either "Root", "Inner", or "Leaf" based on its position in the hierarchy. The tricky part is that we need to reason about relationships between rows in the same table — a node is a root if it has no parent, a leaf if it has no children, and inner otherwise. This requires thinking about both parent-child relationships in both directions.

## Visual Walkthrough

Let's trace through a concrete example. Consider this tree:

```
      1
     / \
    2   3
   / \
  4   5
```

In table form:

```
id | p_id
---+-----
1  | null
2  | 1
3  | 1
4  | 2
5  | 2
```

Now let's categorize each node:

- **Node 1**: Has no parent (p_id is null) → "Root"
- **Node 2**: Has parent (1) AND has children (4,5) → "Inner"
- **Node 3**: Has parent (1) but no children → "Leaf"
- **Node 4**: Has parent (2) but no children → "Leaf"
- **Node 5**: Has parent (2) but no children → "Leaf"

The key insight is that we need to check two things for each node:

1. Does it have a parent? (Check p_id column)
2. Does it have any children? (Check if any other row has this node's id as their p_id)

## Brute Force Approach

A naive approach would be to scan the entire table for each node to determine its type. For each node, we would:

1. Check if p_id is NULL → if yes, it's "Root"
2. Otherwise, scan the entire table to see if any other node has this node's id as their p_id
   - If yes → "Inner"
   - If no → "Leaf"

While this approach would technically work, it's extremely inefficient. For a table with n rows, we'd perform O(n) work for each of the n rows, resulting in O(n²) time complexity. With large datasets, this becomes prohibitively slow.

## Optimized Approach

The key optimization is realizing we can determine a node's type by joining the table with itself. Specifically:

1. **Root nodes**: Have p_id IS NULL
2. **Inner nodes**: Have at least one child (their id appears in another row's p_id column)
3. **Leaf nodes**: Have a parent (p_id is not NULL) AND have no children

We can find nodes with children by doing a self-join: `JOIN Tree AS children ON Tree.id = children.p_id`. However, we need to be careful because a LEFT JOIN will give us NULL for leaf nodes in the children table, which is exactly what we need to identify leaves.

The optimal approach uses a CASE statement with EXISTS or a LEFT JOIN to efficiently check for children without scanning the entire table for each node.

## Optimal Solution

Here's the complete solution using a CASE statement with EXISTS subqueries, which is clean and efficient:

<div class="code-group">

```sql
-- Time: O(n) | Space: O(1) - assuming proper indexing
SELECT
    id,
    CASE
        -- Root: has no parent
        WHEN p_id IS NULL THEN 'Root'
        -- Inner: has parent AND has at least one child
        WHEN EXISTS (
            SELECT 1
            FROM Tree AS children
            WHERE children.p_id = Tree.id
        ) THEN 'Inner'
        -- Leaf: has parent but no children
        ELSE 'Leaf'
    END AS type
FROM Tree
ORDER BY id;
```

```sql
-- Alternative using LEFT JOIN (also optimal)
-- Time: O(n) | Space: O(n) for the join result
SELECT
    DISTINCT t.id,
    CASE
        WHEN t.p_id IS NULL THEN 'Root'
        WHEN c.p_id IS NOT NULL THEN 'Inner'
        ELSE 'Leaf'
    END AS type
FROM Tree t
LEFT JOIN Tree c ON t.id = c.p_id
ORDER BY t.id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT id,`**: We're selecting the node ID and its calculated type
2. **`CASE`**: The CASE statement lets us categorize each node based on conditions
3. **`WHEN p_id IS NULL THEN 'Root'`**: If a node has no parent (p_id is NULL), it's the root
4. **`WHEN EXISTS (...)`**: This checks if the current node has any children
   - The subquery looks for any row where `children.p_id = Tree.id`
   - If such a row exists, the current node has at least one child
5. **`THEN 'Inner'`**: Nodes with both parent and children are inner nodes
6. **`ELSE 'Leaf'`**: Nodes that have a parent but no children are leaves
7. **`ORDER BY id`**: Optional but makes output easier to read

The LEFT JOIN alternative works similarly:

- Join each node with potential children (where `t.id = c.p_id`)
- Root: `t.p_id IS NULL`
- Inner: Has children (`c.p_id IS NOT NULL`)
- Leaf: Has parent but no children (LEFT JOIN gives NULL for `c.p_id`)

## Complexity Analysis

**Time Complexity: O(n)**

- The EXISTS version checks each node once and performs a subquery that, with proper indexing on `p_id`, runs in constant time per node
- The LEFT JOIN version performs a single join operation which is O(n) with proper indexing
- Sorting by id adds O(n log n), but this is often required for output consistency

**Space Complexity: O(1) for EXISTS, O(n) for LEFT JOIN**

- EXISTS version uses minimal additional space
- LEFT JOIN version creates a temporary result set that could be O(n) in size
- Both are acceptable for interview purposes

With proper indexing on `(p_id)` and `(id)`, database optimizations make both approaches efficient even for large tables.

## Common Mistakes

1. **Forgetting that root nodes have NULL p_id**: Some candidates check for `p_id = 0` or empty string instead of `IS NULL`. In SQL, absence of a parent is represented as NULL, not 0 or empty string.

2. **Incorrect child detection logic**: A common error is checking `WHERE id IN (SELECT p_id FROM Tree)` to find inner nodes. This finds nodes that are parents, but doesn't distinguish between roots and inner nodes. You need to check both parent and child relationships.

3. **Assuming every tree has exactly one root**: While true for the problem constraints, some candidates write overly complex logic to handle multiple roots. The simple `p_id IS NULL` check handles single or multiple roots correctly.

4. **Not handling the ORDER BY**: While not strictly required, most interviewers expect ordered output. Forgetting `ORDER BY id` makes the output messy and harder to verify.

## When You'll See This Pattern

This type of hierarchical data classification appears in many database problems:

1. **Department Hierarchy Problems** (e.g., "Find all managers who have at least 5 direct reports"): Similar self-joins to find employee-manager relationships.

2. **Nested Comments/Threads** (e.g., "Find all root comments and their reply counts"): Using parent_id to build comment trees requires similar logic.

3. **Product Categories** (e.g., "Find all leaf categories with no subcategories"): Classifying nodes in category hierarchies uses identical patterns.

The core technique is **self-referencing joins** or **EXISTS subqueries** to traverse parent-child relationships within the same table. Once you master this pattern, you can solve a wide range of hierarchical data problems.

## Key Takeaways

1. **Use CASE statements for categorization**: When you need to classify rows into discrete categories based on conditions, CASE statements are cleaner than multiple separate queries.

2. **Self-joins reveal hierarchical relationships**: Joining a table to itself on `id = p_id` (or similar) is the standard way to traverse parent-child relationships in SQL.

3. **NULL handling is crucial**: In hierarchical data, root nodes often have NULL parent references. Always use `IS NULL`/`IS NOT NULL` instead of `= NULL` or `!= NULL`.

[Practice this problem on CodeJeet](/problem/tree-node)
