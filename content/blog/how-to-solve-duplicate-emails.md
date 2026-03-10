---
title: "How to Solve Duplicate Emails — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Duplicate Emails. Easy difficulty, 73.4% acceptance rate. Topics: Database."
date: "2026-09-24"
category: "dsa-patterns"
tags: ["duplicate-emails", "database", "easy"]
---

# How to Solve Duplicate Emails

This problem asks us to find all duplicate emails in a `Person` table. While it's categorized as "Easy," it's interesting because it tests your understanding of fundamental SQL operations—specifically grouping and filtering—which form the backbone of many real-world database queries. The trick is recognizing that we need to identify emails that appear more than once, not just find any duplicates.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Person` table contains:

| id  | email             |
| --- | ----------------- |
| 1   | alice@email.com   |
| 2   | bob@email.com     |
| 3   | alice@email.com   |
| 4   | charlie@email.com |
| 5   | bob@email.com     |

We need to find emails that appear more than once. Let's think through this step-by-step:

1. **Group by email**: We first group all rows by their email address:
   - `alice@email.com`: rows with id 1 and 3
   - `bob@email.com`: rows with id 2 and 5
   - `charlie@email.com`: row with id 4

2. **Count occurrences**: For each group, we count how many rows it contains:
   - `alice@email.com`: 2 rows
   - `bob@email.com`: 2 rows
   - `charlie@email.com`: 1 row

3. **Filter for duplicates**: We only want emails where the count is greater than 1:
   - `alice@email.com`: count 2 > 1 ✓
   - `bob@email.com`: count 2 > 1 ✓
   - `charlie@email.com`: count 1 > 1 ✗

4. **Final result**: We return just the email column for the duplicates:
   - `alice@email.com`
   - `bob@email.com`

This thought process leads us directly to the SQL solution using `GROUP BY` and `HAVING`.

## Brute Force Approach

While SQL problems don't typically have "brute force" solutions in the same way algorithmic problems do, a naive approach would be to use a self-join. We could join the table with itself on matching emails but different IDs:

```sql
SELECT DISTINCT p1.email
FROM Person p1, Person p2
WHERE p1.email = p2.email AND p1.id != p2.id;
```

**Why this isn't optimal:**

- **Performance**: This creates a Cartesian product of the table with itself, resulting in O(n²) comparisons. For a table with 10,000 rows, that's 100 million comparisons.
- **Readability**: The self-join approach is less intuitive than the grouping approach.
- **Scalability**: As the table grows, this approach becomes exponentially slower.

The self-join works correctly but is inefficient for large datasets. In an interview, you might mention this as a starting point but should quickly move to the optimal solution.

## Optimal Solution

The optimal solution uses `GROUP BY` to group rows by email, then `HAVING` to filter groups with more than one occurrence. The `HAVING` clause is crucial here—it's like a `WHERE` clause for aggregated results.

<div class="code-group">

```sql
-- Time: O(n) for grouping, Space: O(n) for grouping storage
SELECT email
FROM Person
GROUP BY email
HAVING COUNT(email) > 1;
```

</div>

**Line-by-line explanation:**

1. **`SELECT email`**: We only need to return the email addresses themselves, not the counts or IDs.
2. **`FROM Person`**: Specifies the table we're querying.

3. **`GROUP BY email`**: This is the key operation. It groups all rows that have the same email value together. Without this, we'd be working with individual rows.

4. **`HAVING COUNT(email) > 1`**: After grouping, `HAVING` filters the groups. `COUNT(email)` counts how many rows are in each group. The condition `> 1` ensures we only keep groups with more than one row—in other words, duplicate emails.

**Alternative with subquery (also acceptable):**

<div class="code-group">

```sql
-- Time: O(n) for grouping, Space: O(n) for grouping storage
SELECT email
FROM (
    SELECT email, COUNT(*) as count
    FROM Person
    GROUP BY email
) AS email_counts
WHERE count > 1;
```

</div>

This version uses a subquery to first create a temporary table with emails and their counts, then filters that result. It's slightly more verbose but achieves the same result.

## Complexity Analysis

**Time Complexity: O(n)**

- The database must scan the entire table once to perform the grouping operation.
- The grouping operation typically uses hashing, which has O(n) average time complexity.
- Counting within each group is O(1) per group.

**Space Complexity: O(n)**

- In the worst case, if all emails are unique, the database needs to store n groups.
- Each group requires storage for the email and a counter.
- The space is proportional to the number of distinct emails, which is at most n.

The actual performance depends on the database implementation and indexing, but this is the theoretical complexity.

## Common Mistakes

1. **Using `WHERE` instead of `HAVING`**:

   ```sql
   -- WRONG: This won't work
   SELECT email
   FROM Person
   WHERE COUNT(email) > 1
   GROUP BY email;
   ```

   **Why it fails**: `WHERE` filters individual rows before grouping, while `HAVING` filters groups after aggregation. Aggregate functions like `COUNT()` can't be used in `WHERE` clauses.

   **How to avoid**: Remember: `WHERE` → rows, `HAVING` → groups.

2. **Forgetting the `GROUP BY` clause**:

   ```sql
   -- WRONG: This returns an error or incorrect result
   SELECT email
   FROM Person
   HAVING COUNT(email) > 1;
   ```

   **Why it fails**: Without `GROUP BY`, the entire table is treated as one group, so `COUNT(email)` returns the total number of rows.

   **How to avoid**: Always pair `HAVING` with `GROUP BY` when filtering based on aggregation.

3. **Returning extra columns without aggregation**:

   ```sql
   -- WRONG: This may return an error in strict SQL modes
   SELECT id, email
   FROM Person
   GROUP BY email
   HAVING COUNT(email) > 1;
   ```

   **Why it fails**: When using `GROUP BY`, any column in the `SELECT` clause must either be in the `GROUP BY` clause or used with an aggregate function. The `id` column doesn't meet either condition.

   **How to avoid**: Only select columns that are grouped or aggregated.

4. **Using `DISTINCT` unnecessarily**:

   ```sql
   -- INEFFICIENT: DISTINCT adds extra processing
   SELECT DISTINCT email
   FROM Person
   GROUP BY email
   HAVING COUNT(email) > 1;
   ```

   **Why it's inefficient**: The `GROUP BY` already ensures each email appears only once in the result. Adding `DISTINCT` is redundant and adds unnecessary processing.

   **How to avoid**: Remember that `GROUP BY` inherently produces distinct grouped values.

## When You'll See This Pattern

The `GROUP BY` + `HAVING` pattern appears in many SQL problems where you need to filter based on aggregated data:

1. **LeetCode 182 - Duplicate Emails** (this problem): Find emails that appear more than once.

2. **LeetCode 181 - Employees Earning More Than Their Managers**: While not using `HAVING`, it uses self-join which is another common SQL pattern.

3. **LeetCode 183 - Customers Who Never Order**: Uses `LEFT JOIN` and `WHERE ... IS NULL` to find missing relationships.

4. **LeetCode 176 - Second Highest Salary**: Uses `LIMIT` and `OFFSET` or subqueries to find nth highest values.

5. **LeetCode 197 - Rising Temperature**: Uses `DATEDIFF` and self-join to compare rows with previous rows.

The core concept—filtering groups based on aggregate properties—appears in business queries like:

- "Find customers with more than 5 orders"
- "Find products sold less than 10 times"
- "Find users who logged in on more than 3 consecutive days"

## Key Takeaways

1. **`GROUP BY` groups rows, `HAVING` filters groups**: This is the fundamental pattern for working with aggregated data in SQL. Remember that `WHERE` filters rows before grouping, while `HAVING` filters groups after aggregation.

2. **Aggregate functions require grouping**: Functions like `COUNT()`, `SUM()`, `AVG()`, `MAX()`, and `MIN()` are designed to work with groups of rows. Use them with `GROUP BY` or on the entire table.

3. **SQL execution order matters**: SQL executes clauses in this order: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. Understanding this helps debug why certain queries don't work as expected.

4. **Practice different SQL patterns**: While this problem uses `GROUP BY` and `HAVING`, real interviews test various SQL patterns including joins, subqueries, window functions, and date operations.

[Practice this problem on CodeJeet](/problem/duplicate-emails)
