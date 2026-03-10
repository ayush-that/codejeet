---
title: "How to Solve Product Sales Analysis I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Product Sales Analysis I. Easy difficulty, 85.6% acceptance rate. Topics: Database."
date: "2026-08-20"
category: "dsa-patterns"
tags: ["product-sales-analysis-i", "database", "easy"]
---

# How to Solve Product Sales Analysis I

This problem asks us to retrieve the product name, year, and price for each sale from a sales table joined with a product table. While conceptually straightforward, it's a classic SQL join problem that tests your understanding of basic database operations and how to handle ambiguous requirements. The interesting part is recognizing that we need a simple inner join and nothing more—no aggregation, no filtering, just selecting specific columns from two related tables.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have these tables:

**Product table:**

```
product_id | product_name
-----------|-------------
100        | Nokia
200        | Apple
300        | Samsung
```

**Sales table:**

```
sale_id | product_id | year | quantity | price
--------|------------|------|----------|-------
1       | 100        | 2008 | 10       | 5000
2       | 100        | 2009 | 12       | 5000
3       | 200        | 2011 | 15       | 9000
```

Our goal is to produce a result that shows:

- Product name from the Product table
- Year and price from the Sales table
- Only for sales that have corresponding product information

The join process works like this:

1. Take the first row from Sales (sale_id=1, product_id=100, year=2008, price=5000)
2. Look for product_id=100 in the Product table → found "Nokia"
3. Output: ["Nokia", 2008, 5000]
4. Repeat for all sales rows

The result would be:

```
product_name | year | price
-------------|------|-------
Nokia        | 2008 | 5000
Nokia        | 2009 | 5000
Apple        | 2011 | 9000
```

Notice that we don't need aggregation because the problem asks for "each sale" - we want every sale record with its corresponding product name.

## Brute Force Approach

For database problems, there isn't really a "brute force" in the algorithmic sense, but there are inefficient or incorrect approaches that candidates might try:

1. **Cartesian Product (Cross Join)**: Joining every row from Sales with every row from Product, then filtering. This would be O(n\*m) where n and m are table sizes, which is extremely inefficient for large tables.

2. **Multiple Queries**: Running a separate query for each sale to fetch the product name. This would be O(n) queries instead of one efficient join.

3. **Suboptimal Joins**: Using outer joins (LEFT JOIN, RIGHT JOIN) when an INNER JOIN suffices. While functionally correct, it suggests a misunderstanding of the data relationship.

The correct approach is a simple INNER JOIN, which the database optimizer can execute efficiently using indexes on the join columns.

## Optimal Solution

The optimal solution uses a single INNER JOIN between the Sales and Product tables on the product_id column. We select exactly the three columns requested: product_name, year, and price.

<div class="code-group">

```sql
-- Time: O(n + m) in worst case, but typically O(n log m) with indexes
-- Space: O(k) where k is the number of rows in result
SELECT
    p.product_name,  -- Get the product name from Product table
    s.year,          -- Get the year from Sales table
    s.price          -- Get the price from Sales table
FROM
    Sales s          -- Alias 's' for Sales table
INNER JOIN
    Product p        -- Alias 'p' for Product table
ON
    s.product_id = p.product_id;  -- Join on the common product_id column
```

```sql
-- Alternative syntax (same performance, different style)
SELECT
    Product.product_name,
    Sales.year,
    Sales.price
FROM
    Sales
INNER JOIN
    Product
ON
    Sales.product_id = Product.product_id;
```

```sql
-- Using WHERE clause for join (older style, same result)
SELECT
    p.product_name,
    s.year,
    s.price
FROM
    Sales s, Product p
WHERE
    s.product_id = p.product_id;
```

</div>

**Line-by-line explanation:**

1. **`SELECT p.product_name, s.year, s.price`**: We're selecting exactly the three columns requested in the problem. Using table aliases (`p` and `s`) makes the query cleaner and easier to read.

2. **`FROM Sales s`**: We start with the Sales table as our base since every row in the result corresponds to a sale. The alias `s` lets us reference it easily.

3. **`INNER JOIN Product p`**: We join with the Product table to get product names. INNER JOIN ensures we only get sales that have corresponding product information.

4. **`ON s.product_id = p.product_id`**: This is the join condition. It matches each sale with its corresponding product using the product_id that exists in both tables.

## Complexity Analysis

**Time Complexity:**

- Best case (with indexed product_id): O(n log m) where n = rows in Sales, m = rows in Product. The database can use an index on product_id to quickly find matching products.
- Worst case (no indexes): O(n \* m) if it has to scan the entire Product table for each sale. However, in practice, product_id would typically be indexed as a foreign key.
- Average case: O(n + m) for hash joins or O(n log m) for indexed nested loops.

**Space Complexity:**

- O(k) where k is the number of rows in the result set (sales that have product information).
- The database needs to store the result set to return it, but doesn't need additional data structures beyond what's required for the join algorithm.

## Common Mistakes

1. **Using LEFT JOIN instead of INNER JOIN**:
   - **Mistake**: `SELECT ... FROM Sales LEFT JOIN Product ...`
   - **Why it's wrong**: LEFT JOIN would include all sales, even those without corresponding product information, resulting in NULL values for product_name.
   - **How to avoid**: Ask yourself: "Do I need all rows from the left table, or only matching rows?" Here, we only want sales with product info.

2. **Including unnecessary columns**:
   - **Mistake**: `SELECT *` or including sale_id, quantity, etc.
   - **Why it's wrong**: The problem specifically asks for only three columns. While not functionally incorrect, it shows poor attention to requirements.
   - **How to avoid**: Read the problem statement carefully and select only what's asked for.

3. **Forgetting the join condition**:
   - **Mistake**: `FROM Sales, Product` without a WHERE clause or ON condition.
   - **Why it's wrong**: This creates a Cartesian product (every sale paired with every product), giving completely wrong results.
   - **How to avoid**: Always specify how tables relate when joining.

4. **Using GROUP BY unnecessarily**:
   - **Mistake**: Adding `GROUP BY product_name, year, price`
   - **Why it's wrong**: The problem asks for "each sale," not aggregated data. GROUP BY would collapse duplicate rows if they exist.
   - **How to avoid**: Only use GROUP BY when you need aggregation (SUM, COUNT, AVG, etc.).

## When You'll See This Pattern

This basic join pattern appears in countless database problems:

1. **Combine Two Tables (LeetCode 175)**: Similar structure - join Person and Address tables on personId.
2. **Employees Earning More Than Their Managers (LeetCode 181)**: Self-join on the same table with different aliases.
3. **Customers Who Never Order (LeetCode 183)**: Uses LEFT JOIN and NULL check to find non-matching rows.
4. **Department Highest Salary (LeetCode 184)**: More complex join with grouping and subqueries.

The core pattern is: identify the relationship between tables (usually a foreign key), determine the type of join needed (INNER, LEFT, RIGHT), and select the specific columns required.

## Key Takeaways

1. **INNER JOIN vs. LEFT JOIN**: Use INNER JOIN when you only want rows with matches in both tables. Use LEFT JOIN when you want all rows from the left table regardless of matches.
2. **Foreign key relationships**: Most database join problems involve joining on foreign key columns (like product_id here). Identify these relationships first.
3. **Select only what you need**: Don't use `SELECT *` in interview problems unless specifically asked. Show you can read requirements precisely.

This problem teaches the fundamental skill of combining data from multiple tables - a core requirement for almost any real-world database query.

Related problems: [Product Sales Analysis II](/problem/product-sales-analysis-ii), [Product Sales Analysis IV](/problem/product-sales-analysis-iv), [Product Sales Analysis V](/problem/product-sales-analysis-v)
