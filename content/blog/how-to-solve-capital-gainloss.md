---
title: "How to Solve Capital Gain/Loss — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Capital Gain/Loss. Medium difficulty, 84.6% acceptance rate. Topics: Database."
date: "2026-07-04"
category: "dsa-patterns"
tags: ["capital-gainloss", "database", "medium"]
---

# How to Solve Capital Gain/Loss

This problem asks us to calculate the total capital gain/loss for each stock by summing the difference between all "Sell" and "Buy" operations. What makes this interesting is that we need to aggregate operations across multiple days per stock, handling the fact that buys and sells can be interleaved in any order. The key challenge is correctly pairing operations to calculate net profit/loss per stock.

## Visual Walkthrough

Let's trace through a small example:

**Sample Data:**
| stock_name | operation | operation_day | price |
|------------|-----------|---------------|-------|
| Leetcode | Buy | 1 | 1000 |
| Corona Masks| Buy | 2 | 10 |
| Leetcode | Sell | 5 | 9000 |
| Handbags | Buy | 17 | 30000 |
| Corona Masks| Sell | 3 | 1010 |
| Corona Masks| Buy | 4 | 1000 |
| Corona Masks| Sell | 5 | 500 |
| Corona Masks| Buy | 6 | 1000 |
| Handbags | Sell | 29 | 7000 |
| Corona Masks| Sell | 10 | 10000 |

**Step-by-step calculation:**

For **Leetcode**:

- Buy at day 1: price = 1000
- Sell at day 5: price = 9000
- Capital gain = 9000 - 1000 = **8000**

For **Corona Masks**:

- Buy day 2: 10
- Sell day 3: 1010 → Gain: 1010 - 10 = 1000
- Buy day 4: 1000
- Sell day 5: 500 → Loss: 500 - 1000 = -500
- Buy day 6: 1000
- Sell day 10: 10000 → Gain: 10000 - 1000 = 9000
- Total: 1000 + (-500) + 9000 = **9500**

For **Handbags**:

- Buy day 17: 30000
- Sell day 29: 7000 → Loss: 7000 - 30000 = **-23000**

Notice that we don't need to pair specific buys with specific sells chronologically. We can simply sum all sell prices and subtract all buy prices for each stock, since every buy must eventually be matched with a sell (or vice versa for short selling, but here operations are only Buy/Sell).

## Brute Force Approach

A naive approach would be to process each stock separately, collecting all its operations, sorting them by day, and then pairing buys with sells in chronological order. This would require:

1. Grouping operations by stock_name
2. For each stock, sorting operations by operation_day
3. Iterating through sorted operations, maintaining a running total

While this would work, it's unnecessarily complex. The chronological pairing isn't actually needed because the net gain/loss is simply: **Total Sell Prices - Total Buy Prices** for each stock. Any buy that isn't sold would contribute negatively, and any sell without a corresponding buy would contribute positively (though in reality, you can't sell without first buying).

The brute force approach might also involve multiple passes through the data or complex state tracking, which is error-prone and less efficient than necessary.

## Optimized Approach

The key insight is that we don't need to track the chronological order of operations or pair specific buys with specific sells. For each stock, the net capital gain/loss is simply:

**Sum of all Sell prices - Sum of all Buy prices**

This works because:

1. Every Buy operation represents money spent (negative contribution to capital)
2. Every Sell operation represents money earned (positive contribution to capital)
3. The order doesn't matter for calculating the final net result

We can implement this efficiently using:

1. **GROUP BY** to process each stock separately
2. **CASE statements** or conditional aggregation to separate Buy and Sell prices
3. **SUM aggregation** to calculate the difference

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(m) where m is number of distinct stocks
SELECT
    stock_name,
    -- Calculate capital gain/loss as total sell minus total buy
    SUM(
        CASE
            WHEN operation = 'Sell' THEN price  -- Sell adds to capital
            ELSE -price  -- Buy subtracts from capital (could also use WHEN 'Buy' THEN -price)
        END
    ) AS capital_gain_loss
FROM Stocks
-- Group by stock to calculate separately for each stock
GROUP BY stock_name
-- Order is optional but makes output more readable
ORDER BY stock_name;
```

```sql
-- Alternative approach using explicit condition for Buy operations
SELECT
    stock_name,
    -- Sum of Sell prices minus Sum of Buy prices
    SUM(CASE WHEN operation = 'Sell' THEN price ELSE 0 END) -
    SUM(CASE WHEN operation = 'Buy' THEN price ELSE 0 END) AS capital_gain_loss
FROM Stocks
GROUP BY stock_name
ORDER BY stock_name;
```

```sql
-- Another alternative using MySQL IF() function (MySQL specific)
SELECT
    stock_name,
    SUM(IF(operation = 'Sell', price, -price)) AS capital_gain_loss
FROM Stocks
GROUP BY stock_name
ORDER BY stock_name;
```

</div>

**Explanation of key parts:**

1. **SELECT stock_name**: We need to output each stock name with its calculated gain/loss
2. **SUM(CASE...)**: This is the core logic. For each row:
   - If operation is 'Sell', add the price (positive contribution)
   - If operation is 'Buy', subtract the price (negative contribution)
3. **GROUP BY stock_name**: Ensures calculations are done separately for each stock
4. **ORDER BY stock_name**: Optional but makes output organized and easier to read

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Stocks table. The database needs to scan each row once to perform the aggregation. The GROUP BY operation typically involves hashing or sorting, but modern databases optimize this efficiently.

**Space Complexity:** O(m) where m is the number of distinct stock names. The database needs to maintain aggregation state for each unique stock during the GROUP BY operation. In the worst case where all stocks are distinct, this would be O(n), but typically m << n.

## Common Mistakes

1. **Forgetting GROUP BY**: Without GROUP BY, you'll get a single aggregated result instead of per-stock results. The query will either error or give incorrect totals.

2. **Incorrect sign logic**: Mixing up the signs for Buy vs Sell operations. Remember: Buy = money out (negative), Sell = money in (positive). A common mistake is to do `SUM(CASE WHEN operation = 'Buy' THEN price ELSE -price END)` which reverses the logic.

3. **Using WHERE instead of CASE**: Trying to filter with WHERE clauses won't work because you need both Buy and Sell operations in the same calculation:

   ```sql
   -- WRONG: This calculates total sells but loses buy information
   SELECT stock_name, SUM(price) FROM Stocks WHERE operation = 'Sell' GROUP BY stock_name
   ```

4. **Not handling NULL values**: While not an issue with the given schema, in real scenarios you might need to handle NULL prices with `COALESCE(price, 0)` to avoid incorrect calculations.

5. **Overcomplicating with chronological pairing**: Some candidates try to pair each Buy with the next Sell chronologically, which is unnecessary and more complex. The simple aggregation approach works because the net effect is the same regardless of pairing order.

## When You'll See This Pattern

This problem uses **conditional aggregation** with GROUP BY, a common pattern in SQL problems:

1. **Calculate Special Bonus (LeetCode 1873)**: Similar conditional logic to calculate bonuses based on employee conditions.
2. **Patients With a Condition (LeetCode 1527)**: Using LIKE with CASE statements in aggregation.
3. **Monthly Transactions I (LeetCode 1193)**: Grouping by month and country with conditional aggregation for transaction types.
4. **Market Analysis I (LeetCode 1158)**: Counting orders with specific conditions per user.

The pattern also appears in financial calculations, inventory management, and any scenario where you need to aggregate data differently based on conditions within groups.

## Key Takeaways

1. **Conditional aggregation is powerful**: The `CASE` statement inside aggregation functions (SUM, COUNT, AVG) lets you perform different calculations based on row values within a single query.

2. **Think about mathematical equivalence**: Often, complex business logic (like pairing transactions) can be simplified to basic arithmetic if you understand the underlying mathematics. Here, chronological pairing simplifies to simple subtraction of totals.

3. **GROUP BY creates subsets**: When you need calculations per category/group, GROUP BY is your tool. Each group is processed independently with its own aggregation.

4. **Test with edge cases**: Always test with stocks that have only buys, only sells, or multiple alternating operations to ensure your logic handles all scenarios.

[Practice this problem on CodeJeet](/problem/capital-gainloss)
