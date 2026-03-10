---
title: "Database Interview Questions: Patterns and Strategies"
description: "Master Database problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-18"
category: "dsa-patterns"
tags: ["database", "dsa", "interview prep"]
---

# Database Interview Questions: Patterns and Strategies

You've mastered binary trees, dynamic programming, and sliding windows. You can reverse a linked list in your sleep. But then comes a database question, and suddenly you're staring at a JOIN clause wondering why your beautifully optimized algorithm feels irrelevant. I've seen strong candidates stumble on problems like "Department Top Three Salaries" (#185) because they approached it like a pure algorithm challenge rather than a data aggregation puzzle.

Database questions appear in about 15-20% of technical interviews, especially for backend, full-stack, and data engineering roles. The 81 database problems on LeetCode break down to 50 easy (62%), 27 medium (33%), and just 4 hard (5%). This distribution tells a story: companies test database fundamentals far more often than advanced optimization. They want to know you can think in sets, not just loops.

## Common Patterns

### 1. Self-Joins for Hierarchical or Comparative Data

When you need to compare rows within the same table, self-joins are your tool. The classic example is finding employees who earn more than their managers or finding consecutive records.

**Problems that use this:** "Employees Earning More Than Their Managers" (#181), "Consecutive Numbers" (#180), "Department Top Three Salaries" (#185)

The intuition: Imagine you have two copies of the same table. You're creating a Cartesian product where each row gets paired with every other row, then filtering to meaningful relationships. It's like having two identical decks of cards and matching each card from deck A with specific cards from deck B based on relationships.

<div class="code-group">

```sql
-- Find employees who earn more than their managers
-- Time: O(n²) for the join, but indexes can optimize | Space: O(n) for intermediate result
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;
```

```sql
-- Find all numbers that appear at least three times consecutively
-- Time: O(n²) | Space: O(n)
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l1.id = l2.id - 1
JOIN Logs l3 ON l1.id = l3.id - 2
WHERE l1.num = l2.num AND l1.num = l3.num;
```

```sql
-- Java/Python/JavaScript don't apply here since this is pure SQL pattern
-- The equivalent algorithmic approach would involve window functions or iteration
```

</div>

### 2. Window Functions for Rankings and Running Totals

Window functions let you perform calculations across related rows without collapsing them into a single output row. They're perfect for "top N per group" problems.

**Problems that use this:** "Department Highest Salary" (#184), "Rank Scores" (#178), "Nth Highest Salary" (#177)

The intuition: Instead of using correlated subqueries (which execute for each row), window functions compute values in a single pass. Think of it as adding a new column where each value depends on a sliding window of nearby rows. The PARTITION BY divides data into groups, ORDER BY determines sequence within windows, and functions like RANK(), DENSE_RANK(), or ROW_NUMBER() assign positions.

<div class="code-group">

```sql
-- Department highest salary using window function
-- Time: O(n log n) for sorting | Space: O(n)
WITH RankedSalaries AS (
    SELECT
        d.name AS Department,
        e.name AS Employee,
        e.salary AS Salary,
        DENSE_RANK() OVER (
            PARTITION BY e.departmentId
            ORDER BY e.salary DESC
        ) AS salary_rank
    FROM Employee e
    JOIN Department d ON e.departmentId = d.id
)
SELECT Department, Employee, Salary
FROM RankedSalaries
WHERE salary_rank = 1;
```

```sql
-- Alternative using MAX() with GROUP BY (simpler but less flexible)
-- Time: O(n) with proper indexes | Space: O(k) where k = departments
SELECT
    d.name AS Department,
    e.name AS Employee,
    e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary)
    FROM Employee
    GROUP BY departmentId
);
```

```sql
-- Window functions are SQL-specific; no direct Java/Python/JS equivalents
-- Algorithmically, you'd sort and track group maxima
```

</div>

### 3. Conditional Aggregation with CASE Statements

When you need to count or sum based on conditions within groups, CASE statements inside aggregate functions are essential.

**Problems that use this:** "Exchange Seats" (#626), "Tree Node" (#608), "Market Analysis I" (#1158)

The intuition: Instead of filtering before aggregating (which removes rows), conditional aggregation processes all rows but only includes some in calculations. It's like having a spreadsheet where you sum only the cells meeting certain criteria, while keeping the full dataset intact for other calculations.

<div class="code-group">

```sql
-- Categorize tree nodes (root, inner, leaf)
-- Time: O(n) | Space: O(n)
SELECT
    id,
    CASE
        WHEN p_id IS NULL THEN 'Root'
        WHEN id IN (SELECT DISTINCT p_id FROM Tree) THEN 'Inner'
        ELSE 'Leaf'
    END AS type
FROM Tree;
```

```sql
-- Count orders in 2019 per buyer (conditional count)
-- Time: O(n) | Space: O(n)
SELECT
    user_id AS buyer_id,
    COUNT(CASE WHEN YEAR(order_date) = 2019 THEN 1 END) AS orders_in_2019
FROM Orders
GROUP BY user_id;
```

```python
# Python equivalent of conditional aggregation
# Time: O(n) | Space: O(n)
from collections import defaultdict
def count_orders_by_year(orders):
    result = defaultdict(int)
    for user_id, order_date in orders:
        if order_date.year == 2019:
            result[user_id] += 1
    return dict(result)
```

</div>

## When to Use Database vs Alternatives

**Use SQL/database thinking when:**

1. The problem description mentions "tables," "rows," "columns," or specific SQL operations
2. You need to combine data from multiple sources (JOIN operations)
3. The solution involves aggregation (GROUP BY, SUM, COUNT, AVG)
4. You're asked to find rankings or positions within groups
5. The data naturally fits a relational model with clear relationships

**Use algorithmic approaches when:**

1. You need complex procedural logic that SQL can't express cleanly
2. Performance requires specialized data structures (heaps, tries, graphs)
3. You're processing streams of data rather than complete datasets
4. The problem involves complex string manipulation or mathematical operations

**Decision criteria:**

- If the interviewer provides table schemas, think SQL first
- If they mention "write a query," it's definitely SQL
- If the problem involves "top N per group," window functions usually beat algorithmic approaches
- For simple filtering and sorting, either approach works, but SQL is often more readable

## Edge Cases and Gotchas

### 1. NULL Handling in Joins and Comparisons

NULL ≠ NULL in SQL. This catches everyone. When joining on columns that might contain NULLs, you'll get no match unless you use IS NULL comparisons.

```sql
-- Wrong: misses NULL matches
SELECT * FROM A JOIN B ON A.id = B.id;

-- Right: handles NULLs explicitly
SELECT * FROM A JOIN B ON
    (A.id = B.id) OR (A.id IS NULL AND B.id IS NULL);
```

### 2. Duplicate Rines in Self-Joins

Self-joins can create duplicate pairs (A-B and B-A). Use DISTINCT or careful WHERE clauses to avoid this.

```sql
-- Might get duplicates
SELECT a.id, b.id FROM Table a JOIN Table b ON a.value = b.value;

-- Better: enforce ordering
SELECT a.id, b.id FROM Table a JOIN Table b
ON a.value = b.value AND a.id < b.id;
```

### 3. Performance of Correlated Subqueries

A subquery that references the outer query executes once per row—O(n²) time. Always check if you can rewrite it as a JOIN or window function.

```sql
-- Slow: O(n²)
SELECT name, (SELECT COUNT(*) FROM orders WHERE user_id = users.id)
FROM users;

-- Fast: O(n log n) or better with indexes
SELECT u.name, COUNT(o.id)
FROM users u LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

### 4. GROUP BY vs DISTINCT Misunderstanding

GROUP BY collapses rows; DISTINCT removes duplicates. If you need additional columns not in GROUP BY, you might need window functions instead.

## Difficulty Breakdown

The 62% easy, 33% medium, 5% hard split reveals the interview reality: companies prioritize **correctness and clarity** over advanced optimization for database questions.

**Easy problems** test fundamentals: basic SELECT, WHERE, JOIN, GROUP BY. Master these first—they're the bread and butter. If you can't solve easy problems quickly, you'll struggle with mediums.

**Medium problems** combine 2-3 concepts: window functions with joins, multiple subqueries, or complex conditional logic. These test if you can think in sets rather than procedural steps.

**Hard problems** are rare but test deep understanding: recursive CTEs, complex pivoting, or optimization of large datasets. Unless you're interviewing for a database specialist role, don't prioritize these.

Study priority: Easy → Medium → Hard. Spend 70% of your time on easy/medium problems until you can solve them in under 15 minutes.

## Which Companies Ask Database Questions

**[Google](/company/google)**: Leans toward practical problems with multiple joins and aggregations. They often present real-world scenarios like analyzing user behavior logs.

**[Amazon](/company/amazon)**: Heavy on business logic—order analysis, inventory management, customer behavior. Expect lots of GROUP BY and date functions.

**[Bloomberg](/company/bloomberg)**: Financial data analysis with window functions. Time-series data and ranking problems are common.

**[Meta](/company/meta)**: Social network analysis—friend relationships, content rankings, engagement metrics. Self-joins and recursive queries appear.

**[Microsoft](/company/microsoft)**: Mix of practical business problems and algorithmic thinking in SQL. Sometimes combines with other concepts.

**Oracle, IBM, Salesforce**: Database-heavy for obvious reasons. Expect more advanced SQL features and optimization questions.

## Study Tips

1. **Learn the mental model shift**: Practice thinking in sets, not loops. When you see a problem, ask: "What's the complete set of data I need?" not "How do I iterate through this?"

2. **Master the Big 4 operations first**: SELECT (filtering), JOIN (combining), GROUP BY (aggregating), ORDER BY (sorting). Everything else builds on these.

3. **Practice writing without auto-complete**: Interviews are often on whiteboards or simple editors. Write 10 queries by hand to build muscle memory.

4. **Follow this problem progression**:
   - Start with: #175 (Combine Two Tables), #176 (Second Highest Salary)
   - Then: #181 (Employees Earning More Than Managers), #182 (Duplicate Emails)
   - Then: #184 (Department Highest Salary), #185 (Department Top Three Salaries)
   - Finally: #262 (Trips and Users) for a comprehensive challenge

5. **Always test with NULLs, empty tables, and duplicates**: These are the most common pitfalls. Write your test cases mentally before coding.

Database questions test a different kind of thinking than algorithmic problems. Success comes from recognizing patterns in data relationships and knowing which SQL tool fits each situation. The patterns are fewer and more consistent than in algorithm interviews—master them, and you'll have a reliable advantage.

[Practice all Database questions on CodeJeet](/topic/database)
