---
title: "How to Solve Find Books with No Available Copies — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Books with No Available Copies. Easy difficulty, 53.5% acceptance rate. Topics: Database."
date: "2029-12-31"
category: "dsa-patterns"
tags: ["find-books-with-no-available-copies", "database", "easy"]
---

# How to Solve "Find Books with No Available Copies"

This problem asks us to identify books in a library database that have no available copies. We're given two tables: `library_books` containing book information and `book_copies` tracking individual copies and their availability status. The challenge lies in correctly joining these tables and filtering for books where ALL copies are unavailable (or where no copies exist at all). What makes this interesting is understanding the difference between "no copies available" and "no copies exist" - both should be included in our result.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**library_books table:**

```
book_id | title
--------|-----------
1       | Book A
2       | Book B
3       | Book C
4       | Book D
```

**book_copies table:**

```
copy_id | book_id | is_available
--------|---------|-------------
101     | 1       | true
102     | 1       | false
103     | 2       | false
104     | 2       | false
105     | 3       | true
```

Now let's trace what happens:

1. **Book A (book_id: 1)**: Has 2 copies. One is available (copy_id: 101), one is unavailable (copy_id: 102). Since at least one copy is available, this book should NOT be in our result.

2. **Book B (book_id: 2)**: Has 2 copies. Both are unavailable (copy_id: 103, 104). No copies are available, so this book SHOULD be in our result.

3. **Book C (book_id: 3)**: Has 1 copy that's available (copy_id: 105). Since there's an available copy, this book should NOT be in our result.

4. **Book D (book_id: 4)**: Has no entries in the book_copies table. This means no copies exist at all, so this book SHOULD be in our result.

Our final output should include Book B and Book D.

## Brute Force Approach

A naive approach might try to check each book individually:

1. For each book in `library_books`, query the `book_copies` table to get all its copies
2. Check if any copy has `is_available = true`
3. If no such copy exists, include the book in results

While this logic is correct, it would be extremely inefficient. For N books, we'd need to make N separate queries to the `book_copies` table, resulting in O(N²) complexity in the worst case. This doesn't leverage SQL's strength in set-based operations and would perform poorly with large datasets.

Another naive approach might use a subquery with `NOT IN`:

```sql
SELECT book_id, title
FROM library_books
WHERE book_id NOT IN (
    SELECT DISTINCT book_id
    FROM book_copies
    WHERE is_available = true
)
```

This is actually a valid solution, but it's worth understanding why it works and what alternatives exist.

## Optimal Solution

The optimal solution uses a LEFT JOIN to ensure we include books with no copies at all, combined with aggregation to check availability across all copies of each book. We need to find books where either:

1. No copies exist at all (no matching rows in book_copies), OR
2. All existing copies have `is_available = false`

<div class="code-group">

```sql
-- Time: O(n + m) where n = books, m = copies | Space: O(n) for result set
SELECT
    lb.book_id,
    lb.title
FROM
    library_books lb
    -- LEFT JOIN ensures books with no copies are included
    LEFT JOIN book_copies bc ON lb.book_id = bc.book_id
GROUP BY
    lb.book_id,
    lb.title
-- HAVING clause filters groups after aggregation
HAVING
    -- Condition 1: No copies exist at all (all bc.book_id are NULL)
    COUNT(bc.book_id) = 0
    OR
    -- Condition 2: All existing copies are unavailable
    -- SUM counts how many copies are available (true = 1, false = 0)
    -- If no copies are available, SUM will be 0
    SUM(CASE WHEN bc.is_available = true THEN 1 ELSE 0 END) = 0
ORDER BY
    lb.book_id;
```

```sql
-- Alternative solution using NOT EXISTS (often more readable)
-- Time: O(n * m) in worst case but optimized by DB | Space: O(n)
SELECT
    lb.book_id,
    lb.title
FROM
    library_books lb
WHERE
    NOT EXISTS (
        -- Subquery finds any available copy for this book
        SELECT 1
        FROM book_copies bc
        WHERE bc.book_id = lb.book_id
        AND bc.is_available = true
    )
ORDER BY
    lb.book_id;
```

```sql
-- Another alternative using aggregation in a subquery
-- Time: O(n + m) | Space: O(n)
SELECT
    lb.book_id,
    lb.title
FROM
    library_books lb
    LEFT JOIN (
        -- Pre-aggregate availability by book_id
        SELECT
            book_id,
            -- MAX returns true if ANY copy is available
            MAX(is_available) as has_available_copy
        FROM
            book_copies
        GROUP BY
            book_id
    ) bc ON lb.book_id = bc.book_id
WHERE
    -- Include books with no copies (bc.book_id IS NULL)
    -- OR books where no copies are available (has_available_copy = false)
    bc.book_id IS NULL
    OR bc.has_available_copy = false
ORDER BY
    lb.book_id;
```

</div>

**Line-by-line explanation of the first solution:**

1. `SELECT lb.book_id, lb.title` - We only need the book ID and title in our result
2. `FROM library_books lb` - Start with all books in the library
3. `LEFT JOIN book_copies bc ON lb.book_id = bc.book_id` - LEFT JOIN ensures books with no copies are included (they'll have NULL values for bc columns)
4. `GROUP BY lb.book_id, lb.title` - Group by book to aggregate information about all its copies
5. `HAVING COUNT(bc.book_id) = 0` - First condition: books with no copies (bc.book_id is NULL for all rows in the group)
6. `OR SUM(CASE WHEN bc.is_available = true THEN 1 ELSE 0 END) = 0` - Second condition: books where no copies are available. The CASE converts boolean to 1 for available, 0 otherwise
7. `ORDER BY lb.book_id` - Sort results for consistent output

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of rows in `library_books`
- `m` = number of rows in `book_copies`
- The JOIN operation processes each row once: O(n + m)
- The GROUP BY and aggregation also process each resulting row once
- In practice, database optimizers use indexes to make this more efficient

**Space Complexity: O(n)**

- The result set contains at most `n` rows (all books could have no available copies)
- Intermediate results during JOIN and GROUP BY may require additional memory, but this is managed by the database

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**: This is the most common mistake. INNER JOIN would exclude books with no copies at all, missing cases like Book D in our example. Always ask: "Should we include records with no matching rows in the joined table?"

2. **Forgetting to handle NULL values in aggregation**: When a book has no copies, `bc.is_available` is NULL. The expression `SUM(bc.is_available)` would treat NULL as 0 in some databases but could cause issues. Using `CASE WHEN bc.is_available = true THEN 1 ELSE 0 END` handles NULLs explicitly.

3. **Incorrect HAVING condition**: Some candidates try `HAVING MAX(bc.is_available) = false`, but this fails for books with no copies (NULL). The correct approach is to check both conditions: no copies OR all unavailable.

4. **Not considering performance with large datasets**: While the `NOT EXISTS` solution is often more readable, it can be less efficient than the aggregation approach for large datasets, as it may need to scan the `book_copies` table multiple times.

## When You'll See This Pattern

This "find records with no matching/qualifying related records" pattern appears frequently in database problems:

1. **LeetCode 183: Customers Who Never Order** - Find customers who have never placed an order. Similar structure: customers table LEFT JOIN orders table, filter where order_id IS NULL.

2. **LeetCode 607: Sales Person** - Find salespeople who didn't have orders related to a specific company. Uses LEFT JOIN with multiple conditions in the ON clause.

3. **LeetCode 1978: Employees Whose Manager Left the Company** - Find employees whose manager is no longer with the company. Uses self-join and filtering for non-existent manager records.

The core pattern is always: start with the main table, LEFT JOIN to related table(s), and filter based on the absence of qualifying related records.

## Key Takeaways

1. **Use LEFT JOIN when you need to preserve all records from the primary table**, even if there are no matches in the joined table. INNER JOIN filters out non-matching records.

2. **Aggregate then filter with HAVING for group-level conditions**. WHERE filters individual rows before grouping; HAVING filters groups after aggregation.

3. **Consider both explicit and implicit NULL handling**. Database NULL semantics can be tricky - test your queries with edge cases (no related records, all NULL values).

4. **Multiple approaches can solve the same problem** (LEFT JOIN + HAVING, NOT EXISTS, subquery with NOT IN). Understand the trade-offs: readability vs. performance, NULL handling differences.

[Practice this problem on CodeJeet](/problem/find-books-with-no-available-copies)
