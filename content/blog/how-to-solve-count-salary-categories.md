---
title: "How to Solve Count Salary Categories — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Salary Categories. Medium difficulty, 64.0% acceptance rate. Topics: Database."
date: "2028-02-01"
category: "dsa-patterns"
tags: ["count-salary-categories", "database", "medium"]
---

# How to Solve Count Salary Categories

This problem asks us to categorize bank accounts into three salary ranges (Low, Average, High) and count how many accounts fall into each category. The challenge lies in handling the conditional logic properly in SQL and ensuring we get all three categories even when some have zero counts. This is a classic "pivot" or "categorization" problem that tests your understanding of conditional aggregation and handling edge cases in SQL queries.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have this `Accounts` table:

| account_id | income |
| ---------- | ------ |
| 1          | 10000  |
| 2          | 45000  |
| 3          | 90000  |
| 4          | 150000 |
| 5          | 25000  |

We need to categorize each account:

- **Low Salary**: income < 20000
- **Average Salary**: 20000 ≤ income ≤ 50000
- **High Salary**: income > 50000

Now let's categorize each row:

- Account 1: 10000 → Low Salary
- Account 2: 45000 → Average Salary
- Account 3: 90000 → High Salary
- Account 4: 150000 → High Salary
- Account 5: 25000 → Average Salary

Counting by category:

- Low Salary: 1 account
- Average Salary: 2 accounts
- High Salary: 2 accounts

The tricky part is that we need to output ALL three categories even if some have zero counts. If we had no accounts with income < 20000, we'd still need to show "Low Salary" with a count of 0.

## Brute Force Approach

A naive approach might try to write three separate queries and combine them:

```sql
-- Query 1: Count Low Salary
SELECT 'Low Salary' as category, COUNT(*) as accounts_count
FROM Accounts
WHERE income < 20000

UNION ALL

-- Query 2: Count Average Salary
SELECT 'Average Salary' as category, COUNT(*) as accounts_count
FROM Accounts
WHERE income BETWEEN 20000 AND 50000

UNION ALL

-- Query 3: Count High Salary
SELECT 'High Salary' as category, COUNT(*) as accounts_count
FROM Accounts
WHERE income > 50000
```

**Why this fails:** This approach has a critical flaw - if any category has zero accounts, that entire SELECT statement returns no rows, so that category won't appear in the final result. We need ALL three categories regardless of whether they have matching accounts.

Another brute force approach might involve creating a temporary table with all three categories and then joining, but that's more complex than necessary.

## Optimized Approach

The key insight is that we need to **guarantee all three categories appear in the output**, even with zero counts. We can achieve this by:

1. **Creating a base table** with all three categories
2. **Left joining** this with the categorized counts from the Accounts table
3. **Using COALESCE** to convert NULL counts to 0

The most elegant solution uses a **CASE statement** inside a **SUM aggregation** to count accounts in each category. However, we still need to ensure all categories appear. We can do this by creating the categories using a **UNION of values** or a **VALUES clause** (depending on your SQL dialect).

The optimal approach uses conditional aggregation with a UNION to create the category rows:

1. Create a derived table with all three categories using UNION
2. Left join with a subquery that calculates counts for each category
3. Handle NULL values with COALESCE to get 0 for missing categories

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n) where n is number of accounts | Space: O(1) for output
SELECT
    categories.category,
    COALESCE(account_counts.accounts_count, 0) AS accounts_count
FROM (
    -- Create a table with all three categories we need to report
    SELECT 'Low Salary' AS category
    UNION ALL
    SELECT 'Average Salary' AS category
    UNION ALL
    SELECT 'High Salary' AS category
) AS categories
LEFT JOIN (
    -- Calculate counts for each category from the Accounts table
    SELECT
        CASE
            WHEN income < 20000 THEN 'Low Salary'
            WHEN income BETWEEN 20000 AND 50000 THEN 'Average Salary'
            ELSE 'High Salary'
        END AS category,
        COUNT(*) AS accounts_count
    FROM Accounts
    GROUP BY
        CASE
            WHEN income < 20000 THEN 'Low Salary'
            WHEN income BETWEEN 20000 AND 50000 THEN 'Average Salary'
            ELSE 'High Salary'
        END
) AS account_counts
ON categories.category = account_counts.category
ORDER BY
    -- Optional: Order by category for consistent output
    CASE categories.category
        WHEN 'Low Salary' THEN 1
        WHEN 'Average Salary' THEN 2
        WHEN 'High Salary' THEN 3
    END;
```

```sql
-- Alternative solution using conditional aggregation (MySQL/PostgreSQL)
-- Time: O(n) | Space: O(1)
WITH category_counts AS (
    SELECT
        SUM(CASE WHEN income < 20000 THEN 1 ELSE 0 END) AS low_count,
        SUM(CASE WHEN income BETWEEN 20000 AND 50000 THEN 1 ELSE 0 END) AS average_count,
        SUM(CASE WHEN income > 50000 THEN 1 ELSE 0 END) AS high_count
    FROM Accounts
)
SELECT 'Low Salary' AS category, low_count AS accounts_count FROM category_counts
UNION ALL
SELECT 'Average Salary' AS category, average_count AS accounts_count FROM category_counts
UNION ALL
SELECT 'High Salary' AS category, high_count AS accounts_count FROM category_counts;
```

</div>

**Step-by-step explanation of the first solution:**

1. **Create categories table**: We use `UNION ALL` to create a derived table with all three required categories. This ensures we have a row for each category regardless of whether any accounts exist in that category.

2. **Calculate category counts**: In the subquery, we use a `CASE` statement to categorize each account based on income. The `GROUP BY` with the same `CASE` logic groups accounts into these categories, and `COUNT(*)` gives us the number in each group.

3. **Left join categories with counts**: We perform a `LEFT JOIN` from the categories table to the counts subquery. This is crucial - a `LEFT JOIN` ensures ALL categories from the left table (categories) appear in the result, even if there's no matching count.

4. **Handle NULL counts**: When a category has no matching accounts, the join produces a NULL count. We use `COALESCE(account_counts.accounts_count, 0)` to convert NULL to 0.

5. **Optional ordering**: The `ORDER BY` with a `CASE` statement ensures categories appear in the logical order: Low, Average, High.

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Accounts table. We need to scan the entire table once to categorize and count the accounts. The UNION operations and joins on small derived tables are O(1) since they involve only 3 rows.

**Space Complexity:** O(1) for the output (just 3 rows). The intermediate results also use minimal space since we're only working with 3 categories and aggregate counts.

## Common Mistakes

1. **Forgetting to include categories with zero counts**: This is the most common mistake. Candidates write queries that only return categories with non-zero counts. Always test with edge cases where one or more categories have no accounts.

2. **Incorrect boundary handling**: The problem states "Average Salary" includes incomes between 20000 and 50000 **inclusive**. Using `BETWEEN 20000 AND 50000` correctly includes both endpoints. Some candidates use `income > 20000 AND income < 50000`, which excludes the boundary values.

3. **Using UNION instead of UNION ALL**: `UNION` removes duplicates, which isn't necessary here since we have distinct categories. `UNION ALL` is more efficient as it doesn't check for duplicates. While both work in this case, `UNION ALL` is the better practice.

4. **Not handling NULL values in counts**: After the LEFT JOIN, categories with no matching accounts will have NULL in the accounts_count column. Forgetting to convert these NULLs to 0 with COALESCE or IFNULL will result in NULL appearing in the output instead of 0.

## When You'll See This Pattern

This pattern of **categorization with guaranteed output for all categories** appears in several database problems:

1. **Create a Session Bar Chart (Easy)**: Similar structure - you need to count sessions in duration buckets and show all buckets even with zero counts. The solution involves creating a buckets table and left joining with session counts.

2. **Group Sold Products By The Date (Easy)**: While not exactly the same, it involves grouping and conditional logic to format output in a specific way.

3. **Market Analysis I (Medium)**: Involves counting and categorizing user activities with potential zero counts for some users.

The core pattern is: when you need to report on all possible categories/buckets regardless of whether they have data, create a table with all expected values first, then left join with your aggregated data.

## Key Takeaways

1. **Always consider edge cases with zero counts**: When a problem asks for counts by category, ask yourself: "Do I need to show categories with zero counts?" If yes, you'll likely need to create a base table with all categories and use a LEFT JOIN.

2. **Use CASE statements for categorization**: The CASE statement is perfect for mapping values to categories. You can use it in both SELECT and GROUP BY clauses when categorizing.

3. **UNION ALL is useful for creating small constant tables**: When you need a small table with fixed values (like category names), UNION ALL of SELECT statements is a clean, standard SQL way to create it.

4. **Remember COALESCE/IFNULL for NULL handling**: After LEFT JOINs, always consider if you need to convert NULLs to default values (like 0 for counts).

Related problems: [Create a Session Bar Chart](/problem/create-a-session-bar-chart)
