---
title: "How to Solve Group Sold Products By The Date — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Group Sold Products By The Date. Easy difficulty, 77.8% acceptance rate. Topics: Database."
date: "2027-08-06"
category: "dsa-patterns"
tags: ["group-sold-products-by-the-date", "database", "easy"]
---

# How to Solve "Group Sold Products By The Date"

This problem asks us to analyze sales data by grouping products sold on each date. While it seems straightforward, the challenge lies in properly aggregating the data: we need to count distinct products sold per date, list those products in alphabetical order, and format them as a comma-separated string. The tricky part is handling the string aggregation correctly while avoiding duplicates within each date.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose our `Activities` table contains:

| sell_date  | product    |
| ---------- | ---------- |
| 2020-05-30 | Headphone  |
| 2020-06-01 | Pencil     |
| 2020-06-02 | Mask       |
| 2020-05-30 | Basketball |
| 2020-06-01 | Bible      |
| 2020-06-02 | Mask       |
| 2020-05-30 | T-Shirt    |

**Step 1: Group by date**  
First, we need to organize products by their sell_date:

- 2020-05-30: Headphone, Basketball, T-Shirt
- 2020-06-01: Pencil, Bible
- 2020-06-02: Mask, Mask

**Step 2: Remove duplicates within each date**  
Notice that 2020-06-02 has "Mask" twice. We only want distinct products per date:

- 2020-05-30: Headphone, Basketball, T-Shirt
- 2020-06-01: Pencil, Bible
- 2020-06-02: Mask

**Step 3: Count products per date**  
Now count the distinct products:

- 2020-05-30: 3 products
- 2020-06-01: 2 products
- 2020-06-02: 1 product

**Step 4: Sort products alphabetically**  
For each date, sort the product names:

- 2020-05-30: Basketball, Headphone, T-Shirt
- 2020-06-01: Bible, Pencil
- 2020-06-02: Mask

**Step 5: Concatenate into comma-separated string**  
Finally, join the sorted products:

- 2020-05-30: "Basketball,Headphone,T-Shirt"
- 2020-06-01: "Bible,Pencil"
- 2020-06-02: "Mask"

Our final output should be:

| sell_date  | num_sold | products                     |
| ---------- | -------- | ---------------------------- |
| 2020-05-30 | 3        | Basketball,Headphone,T-Shirt |
| 2020-06-01 | 2        | Bible,Pencil                 |
| 2020-06-02 | 1        | Mask                         |

## Brute Force Approach

A naive approach might try to process this row-by-row in application code: read all rows, group by date manually, track seen products per date, then sort and concatenate. While this would work, it's inefficient for large datasets and misses the point of using SQL's built-in aggregation functions.

In SQL terms, a suboptimal approach might involve multiple passes over the data or using complex subqueries. For example, one might first get distinct products per date, then count them separately, then concatenate them in another query. This would be O(n²) in the worst case and difficult to maintain.

The key insight is that modern SQL databases provide functions specifically designed for this type of aggregation, particularly `GROUP_CONCAT()` in MySQL or `STRING_AGG()` in PostgreSQL/SQL Server. Using these built-in functions is both more efficient and cleaner.

## Optimal Solution

The optimal solution uses a single SQL query with proper aggregation. We'll use `DISTINCT` to remove duplicate products within each date, `COUNT()` to count them, and `GROUP_CONCAT()` (or equivalent) to concatenate them with alphabetical ordering.

<div class="code-group">

```sql
-- MySQL Solution
-- Time Complexity: O(n log n) for sorting within groups
-- Space Complexity: O(n) for storing intermediate results

SELECT
    sell_date,  -- Group by this column
    COUNT(DISTINCT product) AS num_sold,  -- Count distinct products per date
    GROUP_CONCAT(DISTINCT product ORDER BY product SEPARATOR ',') AS products  -- Concatenate distinct products alphabetically
FROM
    Activities
GROUP BY
    sell_date  -- Group all rows by sell_date
ORDER BY
    sell_date;  -- Optional: sort results by date for clean output
```

```sql
-- PostgreSQL/SQL Server Solution
-- Time Complexity: O(n log n) for sorting within groups
-- Space Complexity: O(n) for storing intermediate results

SELECT
    sell_date,  -- Group by this column
    COUNT(DISTINCT product) AS num_sold,  -- Count distinct products per date
    STRING_AGG(DISTINCT product, ',' ORDER BY product) AS products  -- Concatenate distinct products alphabetically
FROM
    Activities
GROUP BY
    sell_date  -- Group all rows by sell_date
ORDER BY
    sell_date;  -- Optional: sort results by date for clean output
```

```sql
-- Oracle Solution
-- Time Complexity: O(n log n) for sorting within groups
-- Space Complexity: O(n) for storing intermediate results

SELECT
    sell_date,  -- Group by this column
    COUNT(DISTINCT product) AS num_sold,  -- Count distinct products per date
    LISTAGG(DISTINCT product, ',' ) WITHIN GROUP (ORDER BY product) AS products  -- Concatenate distinct products alphabetically
FROM
    Activities
GROUP BY
    sell_date  -- Group all rows by sell_date
ORDER BY
    sell_date;  -- Optional: sort results by date for clean output
```

</div>

**Line-by-line explanation:**

1. **`SELECT sell_date`**: We start by selecting the date column that we'll group by.
2. **`COUNT(DISTINCT product) AS num_sold`**: For each date group, count how many unique products were sold. The `DISTINCT` keyword ensures we don't double-count the same product sold multiple times on the same day.
3. **`GROUP_CONCAT(DISTINCT product ORDER BY product SEPARATOR ',')`**: This is the key function:
   - `DISTINCT product`: Only include each product once per date
   - `ORDER BY product`: Sort products alphabetically within each group
   - `SEPARATOR ','`: Join the sorted products with commas
4. **`FROM Activities`**: Specify the source table.
5. **`GROUP BY sell_date`**: Group all rows with the same sell_date together. All aggregation functions (COUNT, GROUP_CONCAT) will operate within these groups.
6. **`ORDER BY sell_date`**: Sort the final results chronologically (optional but makes output cleaner).

## Complexity Analysis

**Time Complexity:** O(n log n) in the worst case, where n is the number of rows in the table. Here's why:

- Grouping the data requires hashing or sorting by `sell_date`: O(n log n)
- Within each group, we need to sort products alphabetically for concatenation: O(m log m) where m is products per group
- The database optimizer typically handles this efficiently, but worst-case involves sorting

**Space Complexity:** O(n) for storing intermediate grouped results. The database needs to:

- Store groups by date
- Track distinct products within each group
- Build the concatenated string for each group

The actual performance depends on the database implementation and indexes. If `sell_date` is indexed, grouping can be faster.

## Common Mistakes

1. **Forgetting DISTINCT within COUNT/GROUP_CONCAT**: Without `DISTINCT`, if the same product is sold multiple times on the same day, it will be counted multiple times and appear multiple times in the concatenated string. Always check: "Do I need unique values only?"

2. **Missing the ORDER BY in GROUP_CONCAT**: The problem requires products to be sorted alphabetically. `GROUP_CONCAT(DISTINCT product)` without `ORDER BY product` will produce products in arbitrary order, which may fail test cases.

3. **Incorrect separator or formatting**: Using the wrong separator (like space instead of comma) or forgetting quotes around the separator in the function call. Always check your database's syntax: MySQL uses `SEPARATOR ','`, while PostgreSQL uses just `','`.

4. **Not grouping by the correct column**: If you forget `GROUP BY sell_date`, you'll get a single row with all products concatenated together. The aggregation functions need to know how to group the data.

5. **Handling NULL values**: If some rows have NULL products, `COUNT(DISTINCT product)` will not count NULLs, but `GROUP_CONCAT` might include empty strings. Consider using `WHERE product IS NOT NULL` if the data has NULLs.

## When You'll See This Pattern

This pattern of "group and aggregate with string concatenation" appears in several database problems:

1. **Finding the Topic of Each Post (Hard)**: Similar grouping and string manipulation, but with more complex joins and filtering. This problem builds directly on the skills learned here.

2. **Group Anagrams (Medium)**: While not a SQL problem, the conceptual pattern is similar: group items by a transformed key (sorted string) and collect the original values.

3. **Department Top Three Salaries (Hard)**: Uses window functions with grouping, another common SQL pattern where you need to aggregate data within partitions.

4. **Market Analysis (Medium)**: Requires counting and grouping with conditions, similar to the counting aspect of this problem.

The core pattern is: "For each group X, collect/transform/aggregate values Y." Recognizing this lets you reach for `GROUP BY` with appropriate aggregation functions.

## Key Takeaways

1. **SQL has powerful built-in aggregation functions**: Don't try to do string manipulation in application code when SQL can do it more efficiently. Learn your database's specific functions: `GROUP_CONCAT()` (MySQL), `STRING_AGG()` (PostgreSQL/SQL Server), `LISTAGG()` (Oracle).

2. **Always consider uniqueness within groups**: When aggregating, ask: "Do I want all values or just distinct ones?" The `DISTINCT` keyword is crucial for correct counts and concatenations.

3. **Sorting within aggregates matters**: Many problems require sorted output within each group. Remember you can use `ORDER BY` inside aggregation functions like `GROUP_CONCAT`.

4. **Test with duplicate data**: Always verify your solution handles cases where the same value appears multiple times within a group. This catches missing `DISTINCT` clauses.

Related problems: [Finding the Topic of Each Post](/problem/finding-the-topic-of-each-post)
