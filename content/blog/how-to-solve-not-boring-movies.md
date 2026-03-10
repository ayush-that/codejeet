---
title: "How to Solve Not Boring Movies — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Not Boring Movies. Easy difficulty, 75.1% acceptance rate. Topics: Database."
date: "2026-10-05"
category: "dsa-patterns"
tags: ["not-boring-movies", "database", "easy"]
---

# How to Solve "Not Boring Movies"

This problem asks us to query a cinema database to find movies that are not boring, specifically those with odd-numbered IDs and descriptions that are not "boring," ordered by rating in descending order. While conceptually straightforward, this problem tests your ability to combine multiple filtering conditions, handle string comparisons, and order results properly in SQL—skills essential for real-world data retrieval tasks.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Cinema` table contains:

| id  | movie      | description | rating |
| --- | ---------- | ----------- | ------ |
| 1   | War        | great 3D    | 8.9    |
| 2   | Science    | fiction     | 8.5    |
| 3   | irish      | boring      | 6.2    |
| 4   | Ice song   | Fantacy     | 8.6    |
| 5   | House card | Interesting | 9.1    |

**Step 1: Filter odd-numbered IDs**  
We check each ID to see if it's odd (not divisible by 2):

- ID 1: 1 % 2 = 1 → odd ✓
- ID 2: 2 % 2 = 0 → even ✗
- ID 3: 3 % 2 = 1 → odd ✓
- ID 4: 4 % 2 = 0 → even ✗
- ID 5: 5 % 2 = 1 → odd ✓

**Step 2: Filter non-boring descriptions**  
We check the description of each remaining movie:

- ID 1: "great 3D" ≠ "boring" ✓
- ID 3: "boring" = "boring" ✗
- ID 5: "Interesting" ≠ "boring" ✓

**Step 3: Order by rating descending**  
Remaining movies: ID 1 (rating 8.9) and ID 5 (rating 9.1)

- ID 5 has higher rating (9.1) → comes first
- ID 1 has lower rating (8.9) → comes second

**Final result:**
| id | movie | description | rating |
|----|------------|-------------|--------|
| 5 | House card | Interesting | 9.1 |
| 1 | War | great 3D | 8.9 |

## Brute Force Approach

A naive approach might involve multiple steps: first selecting all movies, then filtering in application code, and finally sorting. While this would technically work, it's inefficient because:

1. It transfers unnecessary data from the database
2. It performs filtering and sorting in application code rather than leveraging the database's optimized query engine
3. It doesn't use SQL's declarative power to express the exact requirements

The correct approach is to write a single SQL query that lets the database handle all filtering and sorting efficiently.

## Optimal Solution

The optimal solution uses a single SQL query with `WHERE` clause for filtering and `ORDER BY` for sorting. We need to:

1. Filter for odd IDs using `id % 2 = 1` (or `MOD(id, 2) = 1`)
2. Filter for non-boring descriptions using `description != 'boring'`
3. Sort by rating in descending order using `ORDER BY rating DESC`

<div class="code-group">

```sql
-- Time: O(n log n) for sorting, O(n) for filtering | Space: O(1) for query, O(n) for result storage
SELECT *
FROM Cinema
WHERE
    -- Filter for odd-numbered IDs: id modulo 2 equals 1
    id % 2 = 1
    -- Filter for non-boring descriptions: description not equal to 'boring'
    AND description != 'boring'
-- Order results by rating in descending order (highest first)
ORDER BY rating DESC;
```

```sql
-- Alternative using MOD() function (more portable across SQL dialects)
SELECT *
FROM Cinema
WHERE
    MOD(id, 2) = 1
    AND description <> 'boring'
ORDER BY rating DESC;
```

```sql
-- Alternative using NOT operator for description filter
SELECT *
FROM Cinema
WHERE
    id % 2 = 1
    AND NOT description = 'boring'
ORDER BY rating DESC;
```

</div>

**Key explanations:**

- `id % 2 = 1`: The modulo operator `%` returns the remainder when `id` is divided by 2. If the remainder is 1, the ID is odd.
- `description != 'boring'`: The inequality operator `!=` filters out rows where description equals "boring". Note that SQL string comparisons are typically case-sensitive unless configured otherwise.
- `ORDER BY rating DESC`: `DESC` specifies descending order (highest rating first). Without `DESC`, it would default to ascending order.

## Complexity Analysis

**Time Complexity: O(n log n)**

- Filtering (`WHERE` clause): O(n) where n is the number of rows in the table. The database must examine each row to check the conditions.
- Sorting (`ORDER BY`): O(n log n) for comparison-based sorting algorithms. The database needs to sort the filtered results by rating.

**Space Complexity: O(k)**

- Where k is the number of rows returned by the query. The database needs to store the filtered and sorted results to return to the client.
- The query itself uses O(1) additional space beyond the input data.

## Common Mistakes

1. **Forgetting that SQL string comparisons are case-sensitive by default**
   - If a description is "Boring" (capital B), it won't match "boring" (lowercase b)
   - Solution: Use `LOWER(description) != 'boring'` if case-insensitive matching is needed

2. **Incorrect odd/even checking**
   - Using `id % 2 = 0` instead of `id % 2 = 1` would select even IDs
   - Some databases might use `MOD(id, 2)` instead of the `%` operator
   - Solution: Test with sample data to verify the logic

3. **Wrong sort order**
   - Using `ORDER BY rating` without `DESC` gives ascending order (lowest rating first)
   - Using `ORDER BY rating ASC` explicitly also gives ascending order
   - Solution: Always specify `DESC` when descending order is required

4. **Not considering NULL values**
   - If `description` could be NULL, `description != 'boring'` would return FALSE for NULL values
   - NULL comparisons always return NULL (treated as FALSE in WHERE clauses)
   - Solution: Add `OR description IS NULL` if NULL descriptions should be included

## When You'll See This Pattern

This problem combines several fundamental SQL patterns that appear in many database problems:

1. **Multiple condition filtering** (`WHERE` with `AND`/`OR`):
   - LeetCode 175: "Combine Two Tables" - Combining data from multiple tables
   - LeetCode 181: "Employees Earning More Than Their Managers" - Self-join with filtering

2. **Modulo operations for pattern-based filtering**:
   - LeetCode 627: "Swap Salary" - Using modulo or other arithmetic operations in updates
   - Real-world: Filtering records by parity, grouping by remainder classes

3. **Sorting with specific ordering**:
   - LeetCode 183: "Customers Who Never Order" - Often combined with ordering
   - LeetCode 197: "Rising Temperature" - Date comparisons with ordering

The core pattern of filtering by multiple conditions and ordering results is ubiquitous in SQL problems and real-world database queries.

## Key Takeaways

1. **SQL is declarative**: Focus on what you want, not how to get it. Let the database optimizer determine the most efficient execution plan for your `WHERE` and `ORDER BY` clauses.

2. **Combine conditions carefully**: When using multiple `AND` conditions, all must be true for a row to be selected. For `OR` conditions, at least one must be true. Parentheses can change evaluation order when mixing `AND` and `OR`.

3. **Test edge cases**: Always consider NULL values, empty strings, boundary values (like minimum/maximum IDs), and case sensitivity in string comparisons. These often reveal bugs in query logic.

[Practice this problem on CodeJeet](/problem/not-boring-movies)
