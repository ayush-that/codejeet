---
title: "How to Solve Actors and Directors Who Cooperated At Least Three Times — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Actors and Directors Who Cooperated At Least Three Times. Easy difficulty, 70.9% acceptance rate. Topics: Database."
date: "2027-12-31"
category: "dsa-patterns"
tags: ["actors-and-directors-who-cooperated-at-least-three-times", "database", "easy"]
---

# How to Solve Actors and Directors Who Cooperated At Least Three Times

This problem asks us to find all pairs of actors and directors who have worked together at least three times. While it's categorized as "Easy" and involves basic SQL operations, what makes it interesting is that it tests your understanding of GROUP BY with multiple columns and the HAVING clause for filtering aggregated results. Many candidates stumble by trying to solve this with complex joins or subqueries when a simple aggregation approach exists.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `ActorDirector` table contains these records:

| actor_id | director_id | timestamp |
| -------- | ----------- | --------- |
| 1        | 1           | 0         |
| 1        | 1           | 1         |
| 1        | 1           | 2         |
| 1        | 2           | 3         |
| 1        | 2           | 4         |
| 2        | 1           | 5         |
| 2        | 1           | 6         |

**Step 1: Group by actor_id and director_id**
We need to count how many times each unique (actor_id, director_id) pair appears:

- (1, 1): appears 3 times
- (1, 2): appears 2 times
- (2, 1): appears 2 times

**Step 2: Filter pairs with count ≥ 3**
Only (1, 1) has 3 or more cooperations.

**Step 3: Return the result**
Our output should be:

| actor_id | director_id |
| -------- | ----------- |
| 1        | 1           |

This shows that actor 1 and director 1 have worked together at least three times.

## Brute Force Approach

A naive approach might try to solve this with multiple self-joins or subqueries. For example, one might try:

```sql
SELECT DISTINCT a1.actor_id, a1.director_id
FROM ActorDirector a1
JOIN ActorDirector a2 ON a1.actor_id = a2.actor_id AND a1.director_id = a2.director_id AND a1.timestamp != a2.timestamp
JOIN ActorDirector a3 ON a1.actor_id = a3.actor_id AND a1.director_id = a3.director_id AND a1.timestamp != a3.timestamp AND a2.timestamp != a3.timestamp
```

**Why this fails:**

1. **Performance**: This requires multiple joins which becomes O(n³) in the worst case
2. **Incorrect for >3 cooperations**: If a pair cooperates 4 times, this query would return the same pair multiple times (once for each combination of 3 timestamps)
3. **Complexity**: The query is hard to read, maintain, and extend (what if we needed "at least 5 times"?)
4. **NULL handling**: If timestamps could be NULL, the inequality checks become problematic

The brute force approach demonstrates why we need aggregation: we want to count occurrences, not find specific combinations of rows.

## Optimal Solution

The optimal solution uses GROUP BY on both columns and HAVING to filter the aggregated results. This is efficient because databases are optimized for aggregation operations.

<div class="code-group">

```sql
-- Time: O(n) for scanning the table | Space: O(k) where k is number of unique pairs
SELECT actor_id, director_id
FROM ActorDirector
-- Step 1: Group rows by both actor_id and director_id
-- This creates groups for each unique (actor, director) pair
GROUP BY actor_id, director_id
-- Step 2: Filter groups where the count of rows is 3 or more
-- COUNT(*) counts all rows in each group
HAVING COUNT(*) >= 3;
```

```sql
-- Alternative with COUNT(timestamp) - works the same since timestamp is never NULL
SELECT actor_id, director_id
FROM ActorDirector
GROUP BY actor_id, director_id
-- COUNT(timestamp) also works since timestamp is the primary key (non-null)
HAVING COUNT(timestamp) >= 3;
```

```sql
-- Explicit version showing the count in output (not required but helpful for understanding)
SELECT actor_id, director_id, COUNT(*) as cooperation_count
FROM ActorDirector
GROUP BY actor_id, director_id
HAVING cooperation_count >= 3;
```

</div>

**Line-by-line explanation:**

1. **`SELECT actor_id, director_id`**: We want to output the actor-director pairs that meet our criteria.

2. **`FROM ActorDirector`**: We're querying the given table.

3. **`GROUP BY actor_id, director_id`**: This is the key operation. It groups all rows that have the same combination of actor_id and director_id. Each group represents all cooperations between a specific actor and director.

4. **`HAVING COUNT(*) >= 3`**: After grouping, we filter to keep only those groups that have 3 or more rows. The `HAVING` clause is used instead of `WHERE` because we're filtering on an aggregated value (the count of rows in each group).

## Complexity Analysis

**Time Complexity: O(n)**

- The database needs to scan the entire table once to perform the grouping and counting
- The grouping operation typically uses hashing or sorting, but modern databases optimize this well
- The actual performance depends on the database implementation and indexes

**Space Complexity: O(k) where k is the number of unique (actor_id, director_id) pairs**

- The database needs to maintain counts for each unique pair
- In the worst case, if every row has a unique pair, k = n
- In practice, k is usually much smaller than n since actors and directors work together multiple times

## Common Mistakes

1. **Using WHERE instead of HAVING**:

   ```sql
   -- WRONG: WHERE filters rows BEFORE grouping
   SELECT actor_id, director_id
   FROM ActorDirector
   WHERE COUNT(*) >= 3  -- Error: aggregate functions not allowed in WHERE
   GROUP BY actor_id, director_id;
   ```

   **Fix**: Remember that WHERE filters individual rows, HAVING filters groups after aggregation.

2. **Forgetting to GROUP BY both columns**:

   ```sql
   -- WRONG: This groups by actor only, counting all directors they worked with
   SELECT actor_id, director_id
   FROM ActorDirector
   GROUP BY actor_id  -- Missing director_id!
   HAVING COUNT(*) >= 3;
   ```

   **Fix**: Always include all non-aggregated columns in the GROUP BY clause.

3. **Including timestamp in SELECT without aggregation**:

   ```sql
   -- WRONG: timestamp isn't in GROUP BY and isn't aggregated
   SELECT actor_id, director_id, timestamp
   FROM ActorDirector
   GROUP BY actor_id, director_id
   HAVING COUNT(*) >= 3;
   ```

   **Fix**: Either remove timestamp from SELECT or use an aggregate function like MIN(timestamp).

4. **Using COUNT(column) when column could be NULL**:
   ```sql
   -- POTENTIALLY WRONG: If a column could be NULL, COUNT(column) counts only non-NULL values
   SELECT actor_id, director_id
   FROM ActorDirector
   GROUP BY actor_id, director_id
   HAVING COUNT(some_nullable_column) >= 3;  -- Might miss rows where column is NULL
   ```
   **Fix**: Use COUNT(\*) to count all rows, or ensure the column in COUNT() is never NULL.

## When You'll See This Pattern

This "GROUP BY + HAVING" pattern appears frequently in SQL problems where you need to filter based on aggregated results:

1. **LeetCode 182: Duplicate Emails** - Find emails that appear more than once in a table

   ```sql
   SELECT email
   FROM Person
   GROUP BY email
   HAVING COUNT(*) > 1;
   ```

2. **LeetCode 586: Customer Placing the Largest Number of Orders** - Find the customer with the most orders

   ```sql
   SELECT customer_number
   FROM Orders
   GROUP BY customer_number
   ORDER BY COUNT(*) DESC
   LIMIT 1;
   ```

3. **LeetCode 1084: Sales Analysis III** - Find products sold only in a specific period
   ```sql
   SELECT product_id, product_name
   FROM Sales JOIN Product USING(product_id)
   GROUP BY product_id
   HAVING MIN(sale_date) >= '2019-01-01' AND MAX(sale_date) <= '2019-03-31';
   ```

The pattern is: when you need to filter based on a condition that applies to groups of rows (not individual rows), think "GROUP BY with HAVING."

## Key Takeaways

1. **GROUP BY with multiple columns** creates groups for each unique combination of the specified columns. This is perfect for analyzing relationships between entities.

2. **HAVING vs WHERE**: Use WHERE to filter rows before grouping, use HAVING to filter groups after aggregation. A good rule of thumb: if your filter condition uses an aggregate function (COUNT, SUM, AVG, etc.), you need HAVING.

3. **COUNT(\*) vs COUNT(column)**: COUNT(\*) counts all rows in a group, while COUNT(column) counts only rows where the column is not NULL. For primary keys or non-null columns, they're equivalent.

[Practice this problem on CodeJeet](/problem/actors-and-directors-who-cooperated-at-least-three-times)
