---
title: "How to Solve Bank Account Summary II — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Bank Account Summary II. Easy difficulty, 83.0% acceptance rate. Topics: Database."
date: "2026-07-01"
category: "dsa-patterns"
tags: ["bank-account-summary-ii", "database", "easy"]
---

# How to Solve Bank Account Summary II

This problem asks us to generate a report showing users whose total transaction amounts exceed $10,000. While it's categorized as "Easy" and involves straightforward SQL operations, it's interesting because it tests your understanding of JOIN operations, GROUP BY with aggregation, and filtering aggregated results using HAVING. The tricky part is recognizing when to use HAVING versus WHERE and understanding how to properly combine data from two related tables.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Users Table:**

```
account | name
--------|------
1       | Alice
2       | Bob
3       | Charlie
```

**Transactions Table:**

```
trans_id | account | amount
---------|---------|--------
1        | 1       | 5000
2        | 1       | 7000
3        | 2       | 3000
4        | 2       | 4000
5        | 3       | 1000
```

**Step-by-step reasoning:**

1. **First, we need to calculate total balance for each account:**
   - Account 1: 5000 + 7000 = 12000
   - Account 2: 3000 + 4000 = 7000
   - Account 3: 1000 = 1000

2. **Next, filter accounts with balance > 10000:**
   - Account 1 qualifies (12000 > 10000)
   - Account 2 doesn't (7000 < 10000)
   - Account 3 doesn't (1000 < 10000)

3. **Finally, join with Users table to get names:**
   - Account 1 → Alice
   - Result: Alice with balance 12000

The key insight is that we need to:

1. Aggregate transaction amounts by account
2. Filter the aggregated results
3. Join with user information

## Brute Force Approach

A naive approach might try to process this without proper SQL aggregation:

```sql
-- This doesn't work properly!
SELECT u.name, t.amount
FROM Users u
JOIN Transactions t ON u.account = t.account
WHERE t.amount > 10000
```

**Why this fails:**

1. It checks individual transactions instead of sums
2. A user could have multiple small transactions that total > 10000 but no single transaction > 10000
3. It doesn't aggregate amounts per user

Another incorrect approach might use a subquery incorrectly:

```sql
-- Still wrong - WHERE filters before aggregation
SELECT u.name, SUM(t.amount) as balance
FROM Users u
JOIN Transactions t ON u.account = t.account
WHERE SUM(t.amount) > 10000  -- ERROR: can't use aggregate in WHERE
GROUP BY u.account, u.name
```

The fundamental issue is that **WHERE filters rows before aggregation**, but we need to filter **after aggregation**. This is exactly what the HAVING clause is designed for.

## Optimal Solution

The correct solution involves:

1. JOINing Users and Transactions tables
2. GROUPing BY account to aggregate transactions
3. Using HAVING to filter aggregated results
4. SELECTing the required columns

<div class="code-group">

```sql
-- Time: O(n + m) where n = users, m = transactions | Space: O(k) where k = distinct accounts
SELECT
    u.name,                    -- Select the user's name
    SUM(t.amount) AS balance   -- Calculate total balance by summing all transactions
FROM
    Users u                    -- Start from Users table
JOIN
    Transactions t             -- Join with Transactions table
    ON u.account = t.account   -- Match on account number
GROUP BY
    u.account, u.name          -- Group by account and name to aggregate per user
HAVING
    SUM(t.amount) > 10000      -- Filter for users with total balance > 10000
```

```sql
-- Alternative: Using subquery first (same complexity, different approach)
-- Time: O(n + m) | Space: O(k)
SELECT
    u.name,                    -- Select user name
    t.total_balance AS balance -- Use pre-calculated balance
FROM
    Users u                    -- Start from Users
JOIN (
    SELECT                     -- Subquery to calculate balances first
        account,
        SUM(amount) AS total_balance
    FROM
        Transactions
    GROUP BY
        account
    HAVING
        SUM(amount) > 10000    -- Filter in subquery
) t ON u.account = t.account   -- Join filtered results
```

```sql
-- Another approach: Using CTE (Common Table Expression)
-- Time: O(n + m) | Space: O(k)
WITH AccountBalances AS (
    SELECT
        account,
        SUM(amount) AS total_balance
    FROM
        Transactions
    GROUP BY
        account
    HAVING
        SUM(amount) > 10000
)
SELECT
    u.name,
    ab.total_balance AS balance
FROM
    Users u
JOIN
    AccountBalances ab
    ON u.account = ab.account
```

</div>

**Line-by-line explanation of the main solution:**

1. `SELECT u.name, SUM(t.amount) AS balance` - We want to output the user's name and their total balance. The `AS balance` gives a clear column name.

2. `FROM Users u JOIN Transactions t ON u.account = t.account` - We join the two tables using the account number as the common key. The `u` and `t` are table aliases that make the query more readable.

3. `GROUP BY u.account, u.name` - This groups all transactions by account. We include both account and name in the GROUP BY because name is functionally dependent on account (each account has exactly one name).

4. `HAVING SUM(t.amount) > 10000` - This is the crucial part. HAVING filters groups **after** aggregation, unlike WHERE which filters rows **before** aggregation. We check if the sum of amounts for each group exceeds 10000.

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of rows in Users table
- `m` = number of rows in Transactions table
- The JOIN operation needs to match each transaction with its user, which in the worst case requires examining all rows in both tables.
- The GROUP BY operation needs to aggregate transactions by account, which requires scanning all transactions once.

**Space Complexity: O(k)**

- `k` = number of distinct accounts with transactions
- The database needs to maintain intermediate results for grouping and aggregation.
- In the worst case, if every transaction is from a different account, `k` could equal `m`.

**Why these complexities matter:**

- For large datasets, the O(n + m) time complexity is efficient and scales linearly.
- The space complexity depends on how many distinct accounts exist, which is typically much smaller than the total number of transactions.

## Common Mistakes

1. **Using WHERE instead of HAVING for aggregated results**

   ```sql
   -- WRONG: WHERE filters before aggregation
   SELECT u.name, SUM(t.amount) as balance
   FROM Users u
   JOIN Transactions t ON u.account = t.account
   WHERE SUM(t.amount) > 10000  -- Error!
   GROUP BY u.account, u.name
   ```

   **Fix:** Use HAVING to filter after aggregation.

2. **Forgetting to include non-aggregated columns in GROUP BY**

   ```sql
   -- WRONG: name isn't in GROUP BY (in strict SQL mode)
   SELECT u.name, SUM(t.amount) as balance
   FROM Users u
   JOIN Transactions t ON u.account = t.account
   GROUP BY u.account  -- Missing u.name!
   HAVING SUM(t.amount) > 10000
   ```

   **Fix:** Include all non-aggregated SELECT columns in GROUP BY.

3. **Not handling accounts with no transactions**
   The problem doesn't require showing users with zero balance, but in similar problems, you might need LEFT JOIN instead of JOIN to include all users.
4. **Incorrect JOIN condition**
   ```sql
   -- WRONG: Joining on wrong columns
   SELECT u.name, SUM(t.amount) as balance
   FROM Users u
   JOIN Transactions t ON u.name = t.account  -- Type mismatch!
   GROUP BY u.account, u.name
   HAVING SUM(t.amount) > 10000
   ```
   **Fix:** Always verify JOIN conditions match the correct columns with compatible types.

## When You'll See This Pattern

This problem teaches a fundamental SQL pattern: **aggregate-filter-join**. You'll see variations of this pattern in:

1. **LeetCode 1174 - Immediate Food Delivery II**
   - Similar structure: need to calculate percentages of orders meeting certain criteria
   - Uses aggregation with filtering on calculated values

2. **LeetCode 550 - Game Play Analysis IV**
   - Requires calculating ratios/percentages from event data
   - Involves grouping player activities and filtering aggregated results

3. **LeetCode 1070 - Product Sales Analysis III**
   - Requires finding first year sales for each product
   - Uses aggregation with MIN() and GROUP BY

The common thread is needing to perform calculations on grouped data and then filter or further process those results.

## Key Takeaways

1. **HAVING vs WHERE**: Remember that WHERE filters individual rows **before** aggregation, while HAVING filters groups **after** aggregation. When you need to filter based on aggregated results (SUM, AVG, COUNT, etc.), you must use HAVING.

2. **GROUP BY rules**: In standard SQL, every column in the SELECT clause that isn't part of an aggregate function must appear in the GROUP BY clause. Some databases are lenient about this, but it's good practice to follow the rule.

3. **Join-aggregate pattern**: Many reporting queries follow this pattern: JOIN related tables → GROUP BY key columns → aggregate calculations → filter aggregated results. Recognizing this pattern helps you structure similar queries quickly.

[Practice this problem on CodeJeet](/problem/bank-account-summary-ii)
