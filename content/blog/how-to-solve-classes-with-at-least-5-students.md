---
title: "How to Solve Classes With at Least 5 Students — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Classes With at Least 5 Students. Easy difficulty, 63.2% acceptance rate. Topics: Database."
date: "2026-12-04"
category: "dsa-patterns"
tags: ["classes-with-at-least-5-students", "database", "easy"]
---

# How to Solve Classes With at Least 5 Students

This problem asks us to find all classes that have at least 5 students enrolled. While it seems straightforward, the key challenge is understanding how to properly group and filter data in SQL, especially when dealing with potential duplicate student enrollments in the same class (which the primary key prevents). The interesting part is recognizing that we need to count distinct students per class, not just count rows, even though the primary key ensures no duplicates exist.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Courses` table contains:

| student | class   |
| ------- | ------- |
| Alice   | Math    |
| Bob     | Math    |
| Charlie | Math    |
| David   | Math    |
| Eve     | Math    |
| Frank   | Science |
| Grace   | Science |
| Henry   | Science |
| Alice   | Science |
| Bob     | Science |
| Charlie | History |
| David   | History |

**Step 1: Group by class**  
We need to organize students by their class:

- Math: Alice, Bob, Charlie, David, Eve (5 students)
- Science: Frank, Grace, Henry, Alice, Bob (5 students)
- History: Charlie, David (2 students)

**Step 2: Count students per class**  
We count how many students are in each class:

- Math: 5 students
- Science: 5 students
- History: 2 students

**Step 3: Filter classes with ≥5 students**  
We only keep classes where the count is 5 or more:

- Math: 5 students ✓
- Science: 5 students ✓
- History: 2 students ✗

**Result:** Math and Science

Notice that even though Alice and Bob appear in both Math and Science, we count them separately for each class. The grouping happens independently for each class.

## Brute Force Approach

A naive approach might try to solve this without proper SQL grouping. For example, someone might try to manually track counts using variables or subqueries for each class. However, SQL is designed specifically for this type of aggregation problem, so any approach that doesn't use `GROUP BY` and `HAVING` would be unnecessarily complex and inefficient.

The most common "brute force" mistake would be to write a query that doesn't properly handle the aggregation. For instance:

```sql
-- Incorrect: This doesn't aggregate at all
SELECT class FROM Courses WHERE COUNT(*) >= 5;
```

This would fail because `COUNT()` is an aggregate function that needs to work with `GROUP BY`. Another incorrect approach might use a subquery for each class, which would be O(n²) complexity if implemented manually.

The proper SQL approach is actually optimal, so there's no true "brute force" that's meaningfully different from the optimal solution for this problem.

## Optimal Solution

The optimal solution uses `GROUP BY` to group rows by class, `COUNT()` to count students in each class, and `HAVING` to filter groups where the count meets our threshold. The `HAVING` clause is crucial because it filters groups after aggregation, unlike `WHERE` which filters rows before aggregation.

<div class="code-group">

```sql
-- Time: O(n) for scanning the table | Space: O(k) for grouping, where k is number of classes
SELECT class
FROM Courses
GROUP BY class          -- Step 1: Group all rows by their class
HAVING COUNT(student) >= 5;  -- Step 2: Only keep groups with 5 or more students
```

```sql
-- Alternative with COUNT(*): Since (student, class) is primary key, no NULLs exist
-- Time: O(n) | Space: O(k)
SELECT class
FROM Courses
GROUP BY class
HAVING COUNT(*) >= 5;  -- COUNT(*) counts all rows in each group
```

```sql
-- Explicit version showing each step clearly
-- Time: O(n) | Space: O(k)
SELECT class
FROM Courses
GROUP BY class          -- Create groups: one per unique class
HAVING COUNT(DISTINCT student) >= 5;  -- Count unique students per group
-- Note: DISTINCT isn't needed here since primary key prevents duplicates,
-- but it's good practice for similar problems without primary key constraints
```

</div>

**Line-by-line explanation:**

1. **`SELECT class`**: We only want to output the class names that meet our criteria.

2. **`FROM Courses`**: Specify the table we're querying.

3. **`GROUP BY class`**: This is the key operation. It groups all rows that have the same class value together. After this operation, we're no longer working with individual rows but with groups of rows.

4. **`HAVING COUNT(student) >= 5`**:
   - `COUNT(student)`: Counts how many students are in each group. Since we grouped by class, this counts students per class.
   - `>= 5`: Our threshold condition.
   - `HAVING` (not `WHERE`): Filters the groups after aggregation. `WHERE` filters rows before grouping; `HAVING` filters groups after grouping.

**Why COUNT(student) vs COUNT(\*):**

- `COUNT(*)` counts all rows in the group.
- `COUNT(student)` counts non-NULL values in the student column.
- Since (student, class) is the primary key, student cannot be NULL, so both work identically here.
- `COUNT(DISTINCT student)` would also work and is more general for cases where a student might be enrolled multiple times in the same class (though the primary key prevents this).

## Complexity Analysis

**Time Complexity:** O(n), where n is the number of rows in the Courses table. The database needs to:

1. Scan all rows in the table (O(n))
2. Group them by class (typically O(n) with hash-based grouping)
3. Count rows per group (O(1) per row during grouping)
4. Filter groups based on the count (O(k), where k is number of classes)

**Space Complexity:** O(k), where k is the number of distinct classes. The database needs to maintain aggregation state for each unique class value while processing rows. In the worst case where every row has a different class, k = n, so O(n) space.

The actual performance depends on the database implementation, but most modern databases use hash-based aggregation which provides linear time complexity for this type of query.

## Common Mistakes

1. **Using WHERE instead of HAVING with aggregate functions**

   ```sql
   -- WRONG: Aggregate functions can't be used in WHERE clause
   SELECT class FROM Courses WHERE COUNT(*) >= 5 GROUP BY class;
   ```

   **Why it fails:** `WHERE` filters rows before aggregation, but `COUNT()` is an aggregate function that only makes sense after rows are grouped. Use `HAVING` for conditions involving aggregate functions.

2. **Forgetting GROUP BY when using aggregate functions**

   ```sql
   -- WRONG: What class does this refer to when there are multiple classes?
   SELECT class, COUNT(*) FROM Courses HAVING COUNT(*) >= 5;
   ```

   **Why it fails:** Without `GROUP BY`, the entire table is treated as one group, so `COUNT(*)` returns the total number of rows in the table, not per class.

3. **Including non-aggregated columns in SELECT without GROUP BY**

   ```sql
   -- WRONG: student isn't in GROUP BY and isn't aggregated
   SELECT student, class FROM Courses GROUP BY class HAVING COUNT(*) >= 5;
   ```

   **Why it fails:** When using `GROUP BY`, each SELECT expression must either be in the GROUP BY clause or be an aggregate function. Here, `student` is neither, so it's ambiguous which student to show from each group.

4. **Using DISTINCT incorrectly**
   ```sql
   -- WRONG: DISTINCT applies to the entire result, not per group
   SELECT DISTINCT class FROM Courses HAVING COUNT(*) >= 5;
   ```
   **Why it fails:** The `DISTINCT` keyword is redundant here since `GROUP BY class` already ensures unique classes in the result. More importantly, the syntax is wrong—`DISTINCT` and `HAVING` don't interact this way.

## When You'll See This Pattern

This "group-filter-count" pattern appears frequently in database problems:

1. **Duplicate Emails (LeetCode 182)** - Find all emails that appear more than once:

   ```sql
   SELECT email FROM Person GROUP BY email HAVING COUNT(*) > 1;
   ```

2. **Department Top Three Salaries (LeetCode 185)** - Uses grouping with window functions to find top N per group.

3. **Customers Who Never Order (LeetCode 183)** - Uses grouping and filtering to find customers with zero orders.

4. **Big Countries (LeetCode 595)** - Uses filtering on aggregated conditions (WHERE instead of HAVING since it's not per-group).

The core pattern is: when you need to find groups that meet some condition based on aggregated values (count, sum, average, etc.), think `GROUP BY` + `HAVING`.

## Key Takeaways

1. **GROUP BY + HAVING is for group-level filtering**: Use `GROUP BY` to create groups of rows, then `HAVING` to filter those groups based on aggregate calculations. Remember: `WHERE` filters rows before grouping; `HAVING` filters groups after grouping.

2. **Primary keys ensure uniqueness**: When a table has a primary key on relevant columns (like (student, class) here), you don't need `DISTINCT` in your count since duplicates can't exist. This simplifies the query.

3. **All SELECT columns must be accounted for in GROUP BY queries**: Every column in the SELECT clause of a grouped query must either be in the GROUP BY clause or be used with an aggregate function. This prevents ambiguous results.

[Practice this problem on CodeJeet](/problem/classes-with-at-least-5-students)
