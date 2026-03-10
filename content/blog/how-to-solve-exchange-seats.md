---
title: "How to Solve Exchange Seats — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Exchange Seats. Medium difficulty, 73.8% acceptance rate. Topics: Database."
date: "2027-06-23"
category: "dsa-patterns"
tags: ["exchange-seats", "database", "medium"]
---

# How to Solve Exchange Seats

This problem asks us to swap adjacent students' seats in a classroom seating chart. If there's an odd number of students, the last student remains in place. What makes this problem interesting is that it's a SQL problem requiring conditional logic and careful handling of edge cases, rather than a typical algorithmic challenge. The tricky part is handling the different cases (even vs. odd IDs) and ensuring the final result is ordered correctly.

## Visual Walkthrough

Let's trace through a concrete example. Suppose we have this seating arrangement:

| id  | student |
| --- | ------- |
| 1   | Abbot   |
| 2   | Doris   |
| 3   | Emerson |
| 4   | Green   |
| 5   | Jeames  |

We need to swap adjacent seats: student 1 swaps with 2, student 3 swaps with 4, and student 5 (being odd and last) stays in place.

The expected output should be:

| id  | student |
| --- | ------- |
| 1   | Doris   |
| 2   | Abbot   |
| 3   | Green   |
| 4   | Emerson |
| 5   | Jeames  |

Notice how:

- For even IDs (2, 4): they get the student from the previous row (id-1)
- For odd IDs that aren't last (1, 3): they get the student from the next row (id+1)
- For the last odd ID (5): they keep their own student

## Brute Force Approach

A naive approach might involve multiple queries or procedural logic. One might try:

1. Create a temporary table
2. Use multiple UPDATE statements with CASE logic
3. Manually handle each row

However, SQL problems don't typically have "brute force" in the algorithmic sense. Instead, the naive approach would be writing overly complex, non-optimal queries that don't handle edge cases properly or use inefficient operations.

For example, a suboptimal approach might use multiple subqueries or UNION operations instead of a clean CASE statement:

```sql
-- Inefficient approach using UNION
SELECT id-1 as id, student FROM Seat WHERE id % 2 = 0
UNION
SELECT id+1 as id, student FROM Seat WHERE id % 2 = 1 AND id < (SELECT MAX(id) FROM Seat)
UNION
SELECT id, student FROM Seat WHERE id % 2 = 1 AND id = (SELECT MAX(id) FROM Seat)
ORDER BY id;
```

This works but is inefficient because it requires multiple scans of the table and a UNION operation. More importantly, it's harder to read and maintain.

## Optimized Approach

The key insight is recognizing that we need to handle three cases:

1. **Even IDs**: They should get the student from the previous seat (id-1)
2. **Odd IDs that aren't last**: They should get the student from the next seat (id+1)
3. **Last odd ID**: They keep their own student

We can express this logic using a CASE statement combined with modulo arithmetic and comparison with the maximum ID. The elegant solution uses:

- `CASE` statement to handle the three conditions
- `MOD()` or `%` operator to check if ID is even or odd
- Comparison with `MAX(id)` to identify the last row
- Proper ordering to ensure the result is sorted by ID

## Optimal Solution

Here's the clean, optimized solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n log n) due to sorting | Space: O(n) for result set
SELECT
    -- We need to output all IDs in order
    id,
    -- Use CASE statement to determine which student sits in each seat
    CASE
        -- When ID is even, take the student from the previous seat (id-1)
        WHEN MOD(id, 2) = 0 THEN (
            SELECT student FROM Seat s2 WHERE s2.id = s1.id - 1
        )
        -- When ID is odd AND not the last seat, take the student from the next seat (id+1)
        WHEN MOD(id, 2) = 1 AND id < (SELECT MAX(id) FROM Seat) THEN (
            SELECT student FROM Seat s2 WHERE s2.id = s1.id + 1
        )
        -- Otherwise (odd ID and last seat), keep the same student
        ELSE student
    END AS student
FROM Seat s1
-- Order by ID to maintain the seating arrangement
ORDER BY id;
```

```sql
-- Alternative using CASE with JOIN instead of correlated subqueries
-- Time: O(n log n) | Space: O(n)
SELECT
    s1.id,
    CASE
        -- Even IDs get previous student
        WHEN s1.id % 2 = 0 THEN s2.student
        -- Odd IDs (not last) get next student
        WHEN s1.id % 2 = 1 AND s1.id < (SELECT MAX(id) FROM Seat) THEN s3.student
        -- Last odd ID keeps own student
        ELSE s1.student
    END AS student
FROM Seat s1
-- Left join to get previous student (for even IDs)
LEFT JOIN Seat s2 ON s1.id = s2.id + 1
-- Left join to get next student (for odd IDs)
LEFT JOIN Seat s3 ON s1.id = s3.id - 1
ORDER BY s1.id;
```

```sql
-- Using window functions (most elegant solution)
-- Time: O(n log n) | Space: O(n)
SELECT
    id,
    CASE
        -- Even ID: get the student from the row before
        WHEN id % 2 = 0 THEN LAG(student) OVER (ORDER BY id)
        -- Odd ID and not last: get the student from the row after
        WHEN id % 2 = 1 AND id != MAX(id) OVER () THEN LEAD(student) OVER (ORDER BY id)
        -- Otherwise (last odd ID): keep current student
        ELSE student
    END AS student
FROM Seat
ORDER BY id;
```

</div>

The window function approach is particularly elegant because:

1. `LAG(student)` gets the student from the previous row
2. `LEAD(student)` gets the student from the next row
3. `MAX(id) OVER ()` gives us the maximum ID across all rows
4. The CASE statement cleanly handles all three conditions

## Complexity Analysis

**Time Complexity: O(n log n)**

- The query needs to scan the entire table: O(n)
- The ORDER BY clause requires sorting: O(n log n)
- Window functions (if used) also operate in O(n) but the sort dominates

**Space Complexity: O(n)**

- We need to store the result set
- Window functions may use additional temporary storage
- The space grows linearly with the number of rows

The bottleneck is typically the sorting operation for ORDER BY. Without the ORDER BY, the query would be O(n), but we need the output sorted by ID.

## Common Mistakes

1. **Forgetting to handle the last odd ID**: This is the most common mistake. Candidates correctly swap even/odd pairs but forget that the last student (if odd) doesn't have a partner to swap with. Always check: "What if there's an odd number of rows?"

2. **Incorrect ordering**: After swapping, the result must still be ordered by ID. Some solutions produce correct swaps but in random order, which fails the requirement.

3. **Using UPDATE instead of SELECT**: The problem asks for a query that returns the result, not to modify the table. Some candidates write UPDATE statements, which would change the underlying data.

4. **Off-by-one errors in JOIN conditions**: When using JOINs, mixing up `id = id + 1` vs `id = id - 1` leads to incorrect swaps. Test with a small example to verify your logic.

## When You'll See This Pattern

This problem teaches conditional data transformation in SQL, which appears in various forms:

1. **Swap Salary (LeetCode 627)**: Similar concept but simpler - just swapping values in a single column based on a condition.

2. **Tree Node (LeetCode 608)**: Uses CASE statements with conditions based on relationships between rows (parent/child relationships).

3. **Department Top Three Salaries (LeetCode 185)**: Uses window functions (like RANK() or DENSE_RANK()) to handle complex conditional logic across rows.

The pattern is: "Transform data based on relationships between rows" - whether it's adjacent rows (like this problem), hierarchical relationships, or ranking-based conditions.

## Key Takeaways

1. **CASE statements are powerful for conditional logic**: They let you handle multiple scenarios cleanly in a single query. Remember to cover all possible cases.

2. **Window functions simplify row-relative operations**: LAG() and LEAD() are perfect for accessing previous/next row values. MAX() OVER () lets you compute aggregates without grouping.

3. **Always test edge cases**: For this problem: empty table, single row, even number of rows, odd number of rows. Edge cases often reveal flaws in conditional logic.

[Practice this problem on CodeJeet](/problem/exchange-seats)
