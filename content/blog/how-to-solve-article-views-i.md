---
title: "How to Solve Article Views I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Article Views I. Easy difficulty, 76.7% acceptance rate. Topics: Database."
date: "2026-07-07"
category: "dsa-patterns"
tags: ["article-views-i", "database", "easy"]
---

# How to Solve Article Views I

This problem asks us to find all authors who viewed at least one of their own articles. While conceptually simple, it's a great introduction to SQL self-joins and understanding how to filter data based on relationships within the same table. The tricky part is recognizing that we need to compare two columns (`author_id` and `viewer_id`) from the same row to identify self-views.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Views` table contains:

| article_id | author_id | viewer_id | view_date  |
| ---------- | --------- | --------- | ---------- |
| 1          | 3         | 5         | 2024-01-01 |
| 1          | 3         | 3         | 2024-01-02 |
| 2          | 7         | 7         | 2024-01-01 |
| 3          | 7         | 6         | 2024-01-02 |
| 4          | 5         | 5         | 2024-01-03 |

We need to find authors who viewed their own articles. Let's examine each row:

1. **Row 1**: author_id = 3, viewer_id = 5 → Different → Not a self-view
2. **Row 2**: author_id = 3, viewer_id = 3 → Same → Author 3 viewed their own article
3. **Row 3**: author_id = 7, viewer_id = 7 → Same → Author 7 viewed their own article
4. **Row 4**: author_id = 7, viewer_id = 6 → Different → Not a self-view
5. **Row 5**: author_id = 5, viewer_id = 5 → Same → Author 5 viewed their own article

So authors 3, 7, and 5 have all viewed their own articles. However, we need to return these in ascending order without duplicates. The final result should be: [3, 5, 7].

## Brute Force Approach

A naive approach might involve multiple steps: first finding all self-views, then collecting author IDs, then removing duplicates, and finally sorting. While this could work conceptually, in SQL we'd typically write an inefficient query that might scan the table multiple times or use suboptimal operations.

For example, a beginner might try:

```sql
-- Inefficient approach with multiple scans
SELECT DISTINCT author_id
FROM Views
WHERE author_id IN (
    SELECT viewer_id
    FROM Views
    WHERE article_id IN (
        SELECT article_id
        FROM Views
        WHERE author_id = viewer_id
    )
)
ORDER BY author_id;
```

This approach is problematic because:

1. It uses nested subqueries that could cause multiple full table scans
2. The logic is unnecessarily complex for what should be a simple filter
3. It doesn't leverage the fact that we can check `author_id = viewer_id` directly in a single row

The key insight is that we don't need to join the table with itself or use complex subqueries. We simply need to filter rows where the `author_id` equals the `viewer_id` in the same row.

## Optimal Solution

The optimal solution is straightforward: filter rows where `author_id = viewer_id`, select the distinct `author_id` values, and sort them in ascending order. The `DISTINCT` keyword ensures we don't get duplicate author IDs even if an author viewed multiple of their own articles.

<div class="code-group">

```sql
-- Time: O(n log n) for sorting | Space: O(n) for storing results
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id  -- Filter for self-views only
ORDER BY author_id;          -- Return results in ascending order
```

```sql
-- Alternative with explicit column alias
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id
ORDER BY id;  -- Can reference the alias in ORDER BY
```

```sql
-- Another valid approach using GROUP BY instead of DISTINCT
SELECT author_id AS id
FROM Views
WHERE author_id = viewer_id
GROUP BY author_id  -- GROUP BY also removes duplicates
ORDER BY author_id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT DISTINCT author_id AS id`**:
   - `SELECT` retrieves data from the table
   - `DISTINCT` removes duplicate author IDs (an author might have multiple self-views)
   - `AS id` renames the output column to match the expected result format

2. **`FROM Views`**:
   - Specifies the table we're querying from

3. **`WHERE author_id = viewer_id`**:
   - This is the core filter condition
   - Only rows where the author is also the viewer are selected
   - This directly checks if someone viewed their own article

4. **`ORDER BY author_id`**:
   - Sorts the results in ascending order (default for ORDER BY)
   - Ensures the output matches the expected sorted format

## Complexity Analysis

**Time Complexity: O(n log n)**

- The `WHERE` clause requires scanning all `n` rows in the table: O(n)
- Removing duplicates with `DISTINCT` typically involves sorting or hashing: O(n log n) worst case
- The final sorting with `ORDER BY` is also O(n log n)
- Overall, the dominant factor is sorting, giving us O(n log n)

**Space Complexity: O(n)**

- We need to store the intermediate result set of matching rows
- In the worst case, if every author viewed their own article, we'd store all `n` rows
- The final distinct result set could be up to `n` entries if all authors are unique

## Common Mistakes

1. **Forgetting DISTINCT**: Without `DISTINCT` or `GROUP BY`, authors who viewed multiple of their own articles will appear multiple times in the results. Always check if the problem asks for unique values.

2. **Incorrect column alias**: The problem expects the result column to be named `id`. Using `SELECT author_id` without an alias or using a different alias like `author_id` will produce the wrong output format.

3. **Missing ORDER BY**: The results must be sorted in ascending order. SQL doesn't guarantee any particular order unless explicitly specified with `ORDER BY`. Even if results appear sorted during testing, they might not be in production.

4. **Overcomplicating the solution**: Some candidates try to use `JOIN` operations or subqueries when a simple `WHERE` filter suffices. Remember: if you can solve it with a single table scan and simple condition, that's usually the best approach.

5. **Not handling NULL values**: While not an issue in this specific problem (the schema doesn't show NULL constraints), in real-world scenarios you might need to consider if `author_id` or `viewer_id` could be NULL and how `NULL = NULL` comparisons work in SQL (they return NULL/false).

## When You'll See This Pattern

This pattern of filtering rows based on relationships between columns in the same table appears in many SQL problems:

1. **Employees Earning More Than Their Managers (LeetCode 181)**: Find employees who earn more than their managers by comparing `salary` column with manager's salary through a self-join.

2. **Rising Temperature (LeetCode 197)**: Find dates with temperatures higher than the previous day by comparing temperature values on consecutive dates.

3. **Consecutive Numbers (LeetCode 180)**: Find numbers that appear at least three times consecutively by comparing values across multiple rows.

The common thread is comparing values within the same table, either in the same row (like this problem) or across different rows (using self-joins or window functions).

## Key Takeaways

1. **Simple filters often suffice**: Before reaching for complex joins or subqueries, check if you can solve the problem with a simple `WHERE` condition comparing columns in the same row.

2. **Always consider duplicates and ordering**: When a problem asks for "all unique" values or specifies an order, remember to include `DISTINCT`/`GROUP BY` and `ORDER BY` clauses.

3. **Understand the data relationships**: This problem teaches you to look for relationships between columns within a single row. Recognizing that `author_id = viewer_id` represents a self-view is the key insight.

[Practice this problem on CodeJeet](/problem/article-views-i)
