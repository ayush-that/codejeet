---
title: "Database Interview Questions: Patterns and Strategies"
description: "Master Database problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-01-27"
category: "dsa-patterns"
tags: ["database", "dsa", "interview prep"]
---

Database questions test your ability to design, query, and optimize the systems that store an application's core data. While you won't be asked to run a live database server, you must demonstrate fluency in SQL, understand relational concepts, and reason about schema design and trade-offs. These questions assess practical engineering judgment.

## Common Patterns

Success hinges on recognizing a few recurring themes.

**1. Joins and Aggregation**
Most analytical questions require combining tables and summarizing data. The pattern is: `JOIN` the necessary tables, filter with `WHERE`, `GROUP BY` the relevant dimensions, and apply aggregate functions like `COUNT`, `SUM`, or `AVG`. Window functions (`RANK`, `LEAD/LAG`) are also key for medium-difficulty problems.

<div class="code-group">

```sql
-- Find the second highest salary
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);
```

```sql
-- Alternative using DENSE_RANK()
SELECT DISTINCT salary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk
    FROM Employee
) ranked
WHERE rnk = 2;
```

</div>

**2. Handling Hierarchies or Gaps**
Questions about manager-subordinate chains, consecutive records, or date ranges often use recursive CTEs (Common Table Expressions) or self-joins.

<div class="code-group">

```sql
-- Find employees who earn more than their managers (self-join)
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
```

```sql
-- Find consecutive login streaks (using LAG)
SELECT DISTINCT user_id
FROM (
    SELECT user_id, login_date,
           LAG(login_date) OVER (PARTITION BY user_id ORDER BY login_date) as prev_date
    FROM Logins
) t
WHERE DATEDIFF(login_date, prev_date) = 1;
```

</div>

**3. Schema Design and Normalization**
You may be asked to design tables for a system (e.g., a ride-sharing app). The strategy is to identify core entities (Users, Rides, Payments), define primary/foreign keys, and discuss normalization (reducing redundancy) versus denormalization (improving read performance for heavy queries).

## Difficulty Breakdown

The data shows a clear skew: **Easy (62%), Medium (33%), Hard (5%)**. This split is strategic.

- **Easy (62%):** These are your foundation. They test basic `SELECT`, `JOIN`, `WHERE`, `GROUP BY`, and simple subqueries. Mastering these is non-negotiable; they are the "must-solve" questions that build speed and confidence. Missing an easy question can be a red flag.
- **Medium (33%):** This is where candidates are separated. Problems involve multiple joins, complex aggregations, window functions, and recursive queries. You need to combine patterns and write efficient, correct SQL under time pressure.
- **Hard (5%):** These are rare but critical for top-tier roles. They test advanced optimization, intricate business logic requiring multiple CTEs, or deep schema design discussions involving sharding, indexing strategies, and trade-offs between database paradigms (SQL vs. NoSQL).

The distribution means you should prioritize a **breadth-first approach**: ensure 100% confidence on all easy patterns, then tackle mediums. The handful of hard questions often test concepts that, if understood, can be reasoned through even if not fully solved.

## Which Companies Ask Database

Database proficiency is universal, but it's a particular focus for companies managing vast, complex datasets.

- **[Google](/company/google)**: Asks design questions (e.g., design YouTube's database) and SQL for data analysis roles.
- **[Amazon](/company/amazon)**: Heavily emphasizes practical SQL for business metrics and system design (e.g., design an e-commerce order schema).
- **[Bloomberg](/company/bloomberg)**: A core focus. Expect complex financial reporting queries, joins across many tables, and performance tuning.
- **[Meta](/company/meta)**: Asks both SQL for analytics and deep dive into scalable schema design for social features.
- **[Microsoft](/company/microsoft)**: Covers a range from classic LeetCode-style SQL problems to system design involving Azure database services.

## Study Tips

1.  **Write SQL, Don't Just Read It.** Open a SQL playground (like DB Fiddle) and run every query. Syntax errors and logic bugs become obvious only when you execute. Practice until `JOIN` conditions and `GROUP BY` clauses are automatic.
2.  **Master the "Big Four" Clauses.** The order of execution is key: `WHERE` (filter rows) -> `GROUP BY` (aggregate) -> `HAVING` (filter groups) -> `SELECT` (return columns). Understanding this sequence prevents common mistakes with aliases and aggregates.
3.  **Practice Schema Design Verbally.** For each problem you solve, ask: "How would I design the tables for this?" Sketch the schema, list the columns, and explain your choice of primary and foreign keys. This bridges coding exercises and system design.
4.  **Analyze Query Plans (Conceptually).** For medium-hard questions, think about indexes. Would an index on the `JOIN` column or the `WHERE` column help? Know that `EXPLAIN` is the tool for this, even if you don't run it.

The goal is to make database logic a reflex. Start with the fundamentals, layer on complexity, and always connect the SQL to the real-world tables it would operate on.

[Practice all Database questions on CodeJeet](/topic/database)
