---
title: "How to Solve Swap Sex of Employees — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Swap Sex of Employees. Easy difficulty, 84.5% acceptance rate. Topics: Database."
date: "2027-04-16"
category: "dsa-patterns"
tags: ["swap-sex-of-employees", "database", "easy"]
---

# How to Solve Swap Sex of Employees

This problem asks us to update all values in the `sex` column of the `Salary` table, swapping 'm' to 'f' and 'f' to 'm'. While conceptually simple, this problem tests your understanding of SQL UPDATE statements, conditional logic in databases, and handling ENUM data types. The tricky part is writing a single UPDATE statement that handles both cases correctly without needing multiple queries or temporary variables.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose our `Salary` table contains:

| id  | name  | sex | salary |
| --- | ----- | --- | ------ |
| 1   | Alice | f   | 70000  |
| 2   | Bob   | m   | 80000  |
| 3   | Carol | f   | 90000  |
| 4   | David | m   | 60000  |

We need to swap each employee's sex:

- Alice's sex 'f' should become 'm'
- Bob's sex 'm' should become 'f'
- Carol's sex 'f' should become 'm'
- David's sex 'm' should become 'f'

After our update, the table should look like:

| id  | name  | sex | salary |
| --- | ----- | --- | ------ |
| 1   | Alice | m   | 70000  |
| 2   | Bob   | f   | 80000  |
| 3   | Carol | m   | 90000  |
| 4   | David | f   | 60000  |

The key insight is that we need to handle both cases ('m' → 'f' and 'f' → 'm') in a single UPDATE statement. We can't just set all values to 'm' or all to 'f' — we need to swap each value individually.

## Brute Force Approach

A naive approach might involve multiple queries or temporary storage. For example:

1. Create a temporary table to store the original data
2. Update all 'm' values to 'f'
3. Update all 'f' values to 'm' (but this would change the ones we just updated!)

This approach fails because after step 2, all values would be 'f', and step 3 would change them all back to 'm'. We need to handle the swap atomically.

Another brute force approach would be to write two separate UPDATE statements with careful WHERE clauses, but this still has issues:

```sql
-- This doesn't work correctly!
UPDATE Salary SET sex = 'f' WHERE sex = 'm';
UPDATE Salary SET sex = 'm' WHERE sex = 'f';
```

The problem with this approach is that after the first UPDATE, all values are now 'f', so the second UPDATE would change ALL rows back to 'm'. We need a way to swap values in a single operation.

## Optimal Solution

The optimal solution uses a CASE statement within a single UPDATE query. The CASE statement allows us to conditionally set values based on the current value of the sex column. This ensures the swap happens atomically without intermediate states that would cause incorrect results.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(1)
UPDATE Salary
SET sex =
    CASE
        -- When current sex is 'm', change it to 'f'
        WHEN sex = 'm' THEN 'f'
        -- When current sex is 'f', change it to 'm'
        WHEN sex = 'f' THEN 'm'
        -- Handle any other cases (though ENUM should only have 'm'/'f')
        ELSE sex
    END;

-- Alternative, more concise version:
UPDATE Salary
SET sex =
    CASE sex
        WHEN 'm' THEN 'f'
        WHEN 'f' THEN 'm'
    END;
```

```sql
-- JavaScript doesn't apply here since this is a SQL problem
-- The solution is the same SQL query shown above
```

```sql
-- Java doesn't apply here since this is a SQL problem
-- The solution is the same SQL query shown above
```

</div>

**Line-by-line explanation:**

1. `UPDATE Salary` - Specifies we're updating the Salary table
2. `SET sex =` - We're modifying the sex column
3. `CASE` - Begins the conditional logic block
4. `WHEN sex = 'm' THEN 'f'` - If the current value is 'm', set it to 'f'
5. `WHEN sex = 'f' THEN 'm'` - If the current value is 'f', set it to 'm'
6. `ELSE sex` - Fallback to keep the current value (handles edge cases)
7. `END` - Closes the CASE statement

The CASE statement evaluates each row's current sex value and applies the appropriate transformation. Since this happens within a single UPDATE statement, there's no intermediate state where all values are the same.

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Salary table. The database must read and update each row exactly once.

**Space Complexity:** O(1) additional space. The UPDATE happens in-place without requiring additional storage proportional to the table size. Some databases might use temporary storage for transaction logging, but this isn't counted in space complexity analysis for SQL problems.

The UPDATE statement with CASE is efficient because:

1. It processes each row only once
2. It doesn't require joining with another table or creating temporary tables
3. The database can optimize the operation since it's a simple value transformation

## Common Mistakes

1. **Using multiple UPDATE statements without proper conditions:** As shown in the brute force section, doing two separate UPDATE statements will fail because the first one changes all values to one type, making the second one change them all back.

2. **Forgetting the ELSE clause:** While not strictly necessary for this problem (since sex is an ENUM of only 'm' and 'f'), including an ELSE clause is good practice. It handles any unexpected values and makes the query more robust.

3. **Using IF instead of CASE in databases that don't support it:** Some candidates try to use IF statements, but CASE is the standard SQL way to handle conditional logic in UPDATE statements. MySQL, PostgreSQL, and SQL Server all support CASE in UPDATE statements.

4. **Not considering NULL values:** If the sex column could contain NULL (though ENUM typically doesn't), the CASE statement without ELSE would leave NULL unchanged, which might be the desired behavior. Always consider how your query handles edge cases.

## When You'll See This Pattern

The CASE statement pattern in UPDATE queries appears in various database problems where you need to conditionally modify data:

1. **LeetCode 627: Swap Salary** - This is essentially the same problem with a different table name. The solution is identical.

2. **LeetCode 196: Delete Duplicate Emails** - While not using CASE, it involves conditional logic in UPDATE/DELETE statements to handle data transformations based on row values.

3. **LeetCode 182: Duplicate Emails** - Involves finding and manipulating data based on conditions, though typically using SELECT with GROUP BY rather than UPDATE.

4. **Data cleaning tasks** - In real-world scenarios, you often need to standardize or transform data values conditionally, such as converting 'M'/'F' to 'Male'/'Female' or standardizing country codes.

The CASE statement is SQL's equivalent of if-else logic and is essential for any non-trivial data transformation in databases.

## Key Takeaways

1. **Use CASE for conditional updates in SQL:** When you need to update different rows with different values based on their current values, CASE is the right tool. It ensures all transformations happen atomically in a single statement.

2. **Think atomically in database operations:** Multiple separate UPDATE statements can lead to incorrect intermediate states. Always consider whether you can perform the entire operation in a single query.

3. **Consider edge cases even in "easy" problems:** While this problem seems straightforward, thinking about NULL values, unexpected data, and the ELSE clause demonstrates thoroughness that interviewers appreciate.

4. **ENUM columns behave like strings:** Even though sex is an ENUM type, you can compare and set it using string literals ('m' and 'f'). Don't overcomplicate by trying to handle ENUMs differently.

[Practice this problem on CodeJeet](/problem/swap-sex-of-employees)
