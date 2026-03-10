---
title: "How to Solve Monthly Transactions I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Monthly Transactions I. Medium difficulty, 58.9% acceptance rate. Topics: Database."
date: "2027-05-03"
category: "dsa-patterns"
tags: ["monthly-transactions-i", "database", "medium"]
---

# How to Solve Monthly Transactions I

This problem asks us to generate a monthly summary report from transaction data, grouping by month and country to show total transaction counts, total amounts, and separate statistics for approved transactions. What makes this interesting is the need to handle multiple aggregation levels simultaneously while correctly filtering and grouping data.

## Visual Walkthrough

Let's walk through a small example to understand what we need to compute. Suppose we have these transactions:

```
id | country | state    | amount | trans_date
---|---------|----------|--------|-----------
1  | US      | approved | 1000   | 2018-12-18
2  | US      | declined | 2000   | 2018-12-19
3  | US      | approved | 2000   | 2019-01-01
4  | CA      | approved | 500    | 2019-01-03
5  | CA      | approved | 300    | 2018-12-28
```

We need to group by month (year-month) and country. For each group:

1. Count all transactions (`trans_count`)
2. Sum all amounts (`trans_total_amount`)
3. Count approved transactions (`approved_count`)
4. Sum approved amounts (`approved_total_amount`)

For the US in Dec 2018:

- Total transactions: 2 (IDs 1 and 2)
- Total amount: 3000 (1000 + 2000)
- Approved transactions: 1 (ID 1)
- Approved amount: 1000

For the US in Jan 2019:

- Total transactions: 1 (ID 3)
- Total amount: 2000
- Approved transactions: 1 (ID 3)
- Approved amount: 2000

For CA in Dec 2018:

- Total transactions: 1 (ID 5)
- Total amount: 300
- Approved transactions: 1 (ID 5)
- Approved amount: 300

For CA in Jan 2019:

- Total transactions: 1 (ID 4)
- Total amount: 500
- Approved transactions: 1 (ID 4)
- Approved amount: 500

The final output should show these four rows with the calculated statistics.

## Brute Force Approach

A naive approach might try to process this with multiple separate queries or procedural logic:

1. Get all distinct month-country combinations
2. For each combination, run separate queries to count transactions, sum amounts, count approved transactions, and sum approved amounts
3. Combine the results

This would be extremely inefficient because it requires scanning the table multiple times (once for each combination and each metric). With N transactions and M month-country groups, this could approach O(N × M) complexity, which is unacceptable for large datasets.

Even writing this as multiple subqueries in SQL would be inefficient:

```sql
SELECT
    month,
    country,
    (SELECT COUNT(*) FROM Transactions t2 WHERE DATE_FORMAT(t2.trans_date, '%Y-%m') = t1.month AND t2.country = t1.country) as trans_count,
    (SELECT SUM(amount) FROM Transactions t3 WHERE DATE_FORMAT(t3.trans_date, '%Y-%m') = t1.month AND t3.country = t1.country) as trans_total_amount,
    -- ... and so on for approved transactions
FROM
    (SELECT DISTINCT DATE_FORMAT(trans_date, '%Y-%m') as month, country FROM Transactions) t1
```

This approach scans the table multiple times for each group and doesn't leverage SQL's aggregation capabilities efficiently.

## Optimized Approach

The key insight is that we can compute all required statistics in a single pass through the data using conditional aggregation. Here's the step-by-step reasoning:

1. **Extract month from date**: We need to group by year-month, so we first need to convert each `trans_date` to a string like '2018-12'.

2. **Group by month and country**: These are our two grouping dimensions.

3. **Use conditional aggregation**: Instead of filtering data before aggregation, we can use `CASE` statements or `IF` functions inside aggregate functions:
   - `COUNT(*)` gives us total transactions
   - `SUM(amount)` gives us total amount
   - `SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END)` gives us approved count
   - `SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END)` gives us approved total amount

4. **Handle NULL values**: When no transactions match a condition, the sum should be 0, not NULL. We can use `COALESCE` or ensure our conditional logic returns 0.

This approach processes each transaction once and computes all metrics simultaneously, making it optimal for this type of reporting query.

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n) where n is number of transactions (single table scan)
-- Space: O(m) where m is number of month-country groups (output size)
SELECT
    -- Step 1: Extract year-month from trans_date for grouping
    DATE_FORMAT(trans_date, '%Y-%m') AS month,

    -- Step 2: Group by country as well
    country,

    -- Step 3: Count all transactions in this group
    COUNT(*) AS trans_count,

    -- Step 4: Sum all amounts in this group
    SUM(amount) AS trans_total_amount,

    -- Step 5: Count only approved transactions using conditional sum
    -- CASE returns 1 for approved, 0 otherwise, then we sum those values
    SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count,

    -- Step 6: Sum amounts only for approved transactions
    -- CASE returns amount for approved, 0 otherwise
    SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount

FROM
    Transactions

-- Step 7: Group by both month and country to get statistics for each combination
GROUP BY
    DATE_FORMAT(trans_date, '%Y-%m'),
    country

-- Step 8: Order is optional but makes output more readable
ORDER BY
    month DESC,
    country;
```

```sql
-- Alternative using IF() function (MySQL specific, more concise)
-- Time: O(n) | Space: O(m)
SELECT
    DATE_FORMAT(trans_date, '%Y-%m') AS month,
    country,
    COUNT(*) AS trans_count,
    SUM(amount) AS trans_total_amount,
    SUM(IF(state = 'approved', 1, 0)) AS approved_count,
    SUM(IF(state = 'approved', amount, 0)) AS approved_total_amount
FROM
    Transactions
GROUP BY
    DATE_FORMAT(trans_date, '%Y-%m'),
    country
ORDER BY
    month DESC,
    country;
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Transactions table. The query must scan the entire table once to compute the aggregates. The grouping operation adds some overhead, but it's linear with respect to the input size.

**Space Complexity:** O(m) where m is the number of distinct month-country combinations. The database needs to maintain aggregation state for each unique group while processing the data. In the worst case, if every transaction has a unique month-country combination, m = n.

The DATE_FORMAT operation on each row is O(1), and the conditional checks within the aggregate functions are also O(1) per row. The grouping operation uses hashing or sorting internally, but these are optimized operations in database engines.

## Common Mistakes

1. **Forgetting to handle NULL values in conditional sums**: If you write `SUM(CASE WHEN state = 'approved' THEN amount END)` without an ELSE clause, non-approved transactions will contribute NULL to the sum, and the entire sum could become NULL. Always include `ELSE 0`.

2. **Incorrect month extraction**: Using `MONTH(trans_date)` instead of `DATE_FORMAT(trans_date, '%Y-%m')` will group January 2018 with January 2019, which is wrong. Always include the year in monthly groupings.

3. **Missing the GROUP BY clause for country**: Some candidates might group only by month, forgetting that statistics need to be broken down by country as well. Always check what dimensions are needed in the output.

4. **Confusing COUNT and SUM in conditional aggregates**: `COUNT(CASE WHEN state = 'approved' THEN 1 END)` works but counts non-NULL values. `SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END)` is more explicit and handles the logic consistently with amount summation.

## When You'll See This Pattern

This pattern of conditional aggregation appears frequently in reporting and analytics queries:

1. **Monthly Transactions II** (the follow-up problem) - Uses similar grouping but with additional complexity around chargebacks.

2. **Game Play Analysis I** (LeetCode 511) - Finding first login dates uses MIN() aggregation with grouping.

3. **User Purchase Platform** (LeetCode 1127) - Requires conditional counting of purchases by platform type, similar to our approved/declired counting.

4. **Sales Analysis III** (LeetCode 1084) - Uses aggregation with HAVING clause to filter groups based on conditions.

The core pattern is: when you need to compute multiple statistics that depend on different conditions within the same groups, use conditional aggregation instead of multiple separate queries.

## Key Takeaways

1. **Conditional aggregation is powerful**: Instead of filtering data before aggregation or running multiple queries, use `CASE` statements inside aggregate functions to compute different metrics in a single pass.

2. **Always include year in date groupings**: When grouping by month, use formats like 'YYYY-MM' to avoid mixing data from different years.

3. **Think in terms of groups and conditions**: For reporting queries, identify the grouping dimensions first, then determine what conditions affect each metric. This helps structure the query correctly from the start.

Related problems: [Monthly Transactions II](/problem/monthly-transactions-ii)
