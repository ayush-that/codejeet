---
title: "How to Solve Big Countries — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Big Countries. Easy difficulty, 68.4% acceptance rate. Topics: Database."
date: "2026-05-13"
category: "dsa-patterns"
tags: ["big-countries", "database", "easy"]
---

# How to Solve Big Countries

This problem asks us to query a database table to find countries that meet specific size criteria: either having an area of at least 3 million square kilometers OR a population of at least 25 million people. While conceptually straightforward, this SQL problem tests your understanding of basic query structure, filtering with WHERE clauses, and using logical operators correctly. The "tricky" part comes from remembering that we need to select specific columns and that the OR condition requires careful attention to parentheses in more complex queries.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this sample data:

| name        | continent | area    | population | gdp          |
| ----------- | --------- | ------- | ---------- | ------------ |
| Afghanistan | Asia      | 652230  | 25500100   | 20343000000  |
| Albania     | Europe    | 28748   | 2831741    | 12960000000  |
| Algeria     | Africa    | 2381741 | 37100000   | 188681000000 |
| Andorra     | Europe    | 468     | 78115      | 3712000000   |
| Angola      | Africa    | 1246700 | 20609294   | 100990000000 |

Now let's evaluate each country against our criteria:

1. **Afghanistan**:
   - Area: 652,230 (< 3,000,000) ❌
   - Population: 25,500,100 (≥ 25,000,000) ✅
   - **Result**: Include (meets population criteria)

2. **Albania**:
   - Area: 28,748 (< 3,000,000) ❌
   - Population: 2,831,741 (< 25,000,000) ❌
   - **Result**: Exclude

3. **Algeria**:
   - Area: 2,381,741 (< 3,000,000) ❌
   - Population: 37,100,000 (≥ 25,000,000) ✅
   - **Result**: Include (meets population criteria)

4. **Andorra**:
   - Area: 468 (< 3,000,000) ❌
   - Population: 78,115 (< 25,000,000) ❌
   - **Result**: Exclude

5. **Angola**:
   - Area: 1,246,700 (< 3,000,000) ❌
   - Population: 20,609,294 (< 25,000,000) ❌
   - **Result**: Exclude

Our final result should include Afghanistan and Algeria, showing only their `name`, `population`, and `area` columns.

## Brute Force Approach

For database problems, there isn't really a "brute force" in the algorithmic sense, but we can think about what a naive or incorrect approach might look like. A common mistake would be to write two separate queries and try to combine them:

```sql
-- Incorrect approach: Two separate queries don't work
SELECT name, population, area FROM World WHERE area >= 3000000;
SELECT name, population, area FROM World WHERE population >= 25000000;
```

This doesn't work because SQL expects a single result set. Another naive approach would be to use UNION without considering that it removes duplicates (which might be acceptable here but isn't the most straightforward solution):

```sql
-- Less optimal but technically correct
SELECT name, population, area FROM World WHERE area >= 3000000
UNION
SELECT name, population, area FROM World WHERE population >= 25000000;
```

The UNION approach works but is less efficient than using a single WHERE clause with OR, as it requires scanning the table twice (or using temporary storage for deduplication). It also makes the query more verbose than necessary.

## Optimal Solution

The optimal solution uses a single SELECT statement with a WHERE clause containing an OR condition. This allows the database to scan the table once and apply both conditions to each row, returning rows that satisfy either condition.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows in table | Space: O(1) for the query itself
SELECT
    name,        -- Select the country name
    population,  -- Select the population
    area         -- Select the area
FROM
    World        -- From the World table
WHERE
    area >= 3000000          -- First condition: area at least 3 million
    OR population >= 25000000; -- Second condition: population at least 25 million
    -- Using OR means a row satisfies the WHERE clause if EITHER condition is true
```

```sql
-- Time: O(n) where n is number of rows in table | Space: O(1) for the query itself
SELECT
    name,        -- Select the country name
    population,  -- Select the population
    area         -- Select the area
FROM
    World        -- From the World table
WHERE
    area >= 3000000          -- First condition: area at least 3 million
    OR population >= 25000000; -- Second condition: population at least 25 million
    -- Using OR means a row satisfies the WHERE clause if EITHER condition is true
```

```sql
-- Time: O(n) where n is number of rows in table | Space: O(1) for the query itself
SELECT
    name,        -- Select the country name
    population,  -- Select the population
    area         -- Select the area
FROM
    World        -- From the World table
WHERE
    area >= 3000000          -- First condition: area at least 3 million
    OR population >= 25000000; -- Second condition: population at least 25 million
    -- Using OR means a row satisfies the WHERE clause if EITHER condition is true
```

</div>

**Note**: SQL is a declarative language, so the same solution works across all database systems (MySQL, PostgreSQL, SQL Server, etc.). The code is identical for all languages since we're writing pure SQL.

## Complexity Analysis

**Time Complexity**: O(n), where n is the number of rows in the World table. The database must examine each row at least once to evaluate the WHERE conditions. In the worst case, with no indexes on the `area` or `population` columns, this requires a full table scan.

**Space Complexity**: O(1) for the query itself, but O(k) for the result set where k is the number of rows that satisfy the conditions. The database needs to store and return the qualifying rows, but this is output space, not auxiliary space used by the algorithm.

**Why these complexities matter**: Even though this is an "Easy" problem, understanding that a WHERE clause with OR typically prevents index usage on both columns (unless there's a composite index) is important for real-world database optimization. For interview purposes, recognizing that we need to scan the entire table is sufficient.

## Common Mistakes

1. **Forgetting to select the required columns**: The problem asks for `name`, `population`, and `area` only. Selecting `*` or including additional columns like `continent` or `gdp` would be incorrect.
2. **Using AND instead of OR**: This is the most common logical error. Using `WHERE area >= 3000000 AND population >= 25000000` would only return countries that satisfy BOTH conditions, while the problem asks for countries that satisfy EITHER condition.

3. **Incorrect threshold values**: Mixing up the numbers (using 25 million for area or 3 million for population) or missing zeros (writing 300000 instead of 3000000) will give wrong results.

4. **Adding unnecessary complexity**: Some candidates overthink the problem by using UNION, subqueries, or CASE statements. While these might produce correct results, they're less efficient and more error-prone than a simple WHERE clause with OR.

5. **Not considering NULL values**: While not explicitly mentioned in the problem, in real databases you might need to handle NULL values. If `area` or `population` could be NULL, the comparisons `NULL >= 3000000` and `NULL >= 25000000` both evaluate to NULL (which is treated as FALSE in WHERE clauses). This might be acceptable for this problem but is worth noting.

## When You'll See This Pattern

This problem teaches fundamental SQL query patterns that appear in many database problems:

1. **Combine Multiple Conditions**: Problems like "Find Customer Referee" (LeetCode 584) where you need to filter using `!=` or `IS NULL`, or "Employees Earning More Than Their Managers" (LeetCode 181) which uses self-joins with conditions.

2. **OR vs AND Logic**: Many filtering problems test your understanding of logical operators. For example, "Sales Person" (LeetCode 607) requires finding salespeople who DIDN'T have orders with certain companies, which often involves NOT IN or NOT EXISTS with subqueries.

3. **Simple Aggregation with Filtering**: While this problem doesn't use aggregation, the pattern of selecting specific columns with conditions extends to problems like "Classes More Than 5 Students" (LeetCode 596) where you need HAVING with GROUP BY.

The core pattern here is **filtering based on multiple criteria where satisfying any one criterion is sufficient**. This "any-of" pattern appears frequently in both database and algorithmic problems.

## Key Takeaways

1. **Understand the difference between OR and AND**: OR means "satisfy at least one condition," while AND means "satisfy all conditions." This problem specifically tests whether you recognize when to use OR.

2. **Read the problem requirements carefully**: The problem asks for only three specific columns. Always verify you're selecting exactly what's requested, not more or less.

3. **Keep SQL simple when possible**: For straightforward filtering requirements, a single WHERE clause with the appropriate logical operators is usually the cleanest and most efficient solution. Don't overcomplicate with unions or subqueries unless necessary.

4. **Practice translating word problems to conditions**: "Either... or..." in the problem statement directly translates to OR in SQL. Developing this translation skill is crucial for database interview questions.

[Practice this problem on CodeJeet](/problem/big-countries)
