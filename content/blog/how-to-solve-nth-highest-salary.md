---
title: "How to Solve Nth Highest Salary — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Nth Highest Salary. Medium difficulty, 38.8% acceptance rate. Topics: Database."
date: "2027-02-19"
category: "dsa-patterns"
tags: ["nth-highest-salary", "database", "medium"]
---

# How to Solve Nth Highest Salary

Finding the Nth highest salary is a classic SQL problem that tests your understanding of window functions, subqueries, and handling edge cases. What makes this problem interesting is that it requires careful handling of duplicate salaries—if multiple employees earn the same salary, that salary should only count once when determining the "Nth highest" value. This distinction between ranking distinct salary values versus individual employee records is the core challenge.

## Visual Walkthrough

Let's walk through a concrete example. Suppose we have this Employee table:

| id  | salary |
| --- | ------ |
| 1   | 100    |
| 2   | 200    |
| 3   | 300    |
| 4   | 200    |
| 5   | 150    |
| 6   | 300    |

If we're asked to find the 2nd highest salary, we need to consider distinct salary values, not individual records. Here's the step-by-step reasoning:

1. **Get distinct salaries**: [100, 150, 200, 300]
2. **Sort in descending order**: [300, 200, 150, 100]
3. **Find the 2nd element**: 200

Notice that even though there are two employees earning 300 and two earning 200, each salary value only appears once in our distinct list. The employee with id=2 and id=4 both earn 200, which is our answer.

If we're asked for the 3rd highest salary, we'd get 150. If asked for the 4th highest, we'd get 100. If asked for the 5th highest, we'd get NULL since there are only 4 distinct salary values.

## Brute Force Approach

A naive approach might try to sort all salaries and skip to the Nth position:

```sql
SELECT salary
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET (N-1)
```

**Why this fails**: This approach doesn't handle duplicate salaries correctly. Using our example above with N=2, this query would return the second row after sorting, which would be 300 (from the employee with id=6), not 200. We need to consider distinct salary values, not individual records.

Another brute force approach might use multiple subqueries:

```sql
SELECT MAX(salary) as SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee)
```

This works for N=2 but becomes extremely cumbersome for arbitrary N, requiring N-1 nested subqueries. For N=5, you'd need 4 levels of nesting, which is inefficient and hard to maintain.

## Optimized Approach

The key insight is that we need to:

1. Consider distinct salary values
2. Rank them in descending order
3. Select the Nth ranked salary
4. Handle cases where N exceeds the number of distinct salaries (return NULL)

We have two main approaches:

**Approach 1: DENSE_RANK() window function**

- Use `DENSE_RANK()` to assign ranks to distinct salary values
- `DENSE_RANK()` gives consecutive ranks without gaps (1, 2, 3...), which is exactly what we need
- Filter where rank = N

**Approach 2: DISTINCT with LIMIT/OFFSET**

- Select distinct salaries and sort descending
- Use LIMIT 1 OFFSET (N-1) to get the Nth highest
- Wrap in a subquery to handle the NULL case when N is too large

Both approaches are valid, but the DENSE_RANK() approach is more explicit about handling duplicates and is generally preferred in interviews because it clearly demonstrates understanding of window functions.

## Optimal Solution

Here are complete solutions using both approaches:

<div class="code-group">

```sql
-- Approach 1: Using DENSE_RANK() (Most explicit)
-- Time: O(n log n) for sorting | Space: O(n) for window function
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  RETURN (
      -- Use a subquery to handle the NULL case properly
      SELECT DISTINCT salary
      FROM (
          -- Assign ranks to distinct salary values
          SELECT
              salary,
              DENSE_RANK() OVER (ORDER BY salary DESC) as salary_rank
          FROM Employee
      ) ranked_salaries
      -- Filter for the Nth highest rank
      WHERE salary_rank = N
  );
END
```

```sql
-- Approach 2: Using DISTINCT with LIMIT/OFFSET
-- Time: O(n log n) for sorting | Space: O(n) for distinct values
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  -- Declare variable for OFFSET (MySQL requires variable for OFFSET)
  DECLARE M INT;
  SET M = N - 1;

  RETURN (
      -- Outer SELECT handles the NULL case when no rows match
      SELECT (
          -- Get distinct salaries in descending order
          SELECT DISTINCT salary
          FROM Employee
          ORDER BY salary DESC
          -- Skip first N-1 salaries, take the next one
          LIMIT 1 OFFSET M
      )
  );
END
```

```sql
-- Approach 3: Using correlated subquery (Alternative approach)
-- Time: O(n²) in worst case | Space: O(1)
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  RETURN (
      SELECT DISTINCT e1.salary
      FROM Employee e1
      -- Count how many distinct salaries are greater than current salary
      WHERE (SELECT COUNT(DISTINCT e2.salary)
             FROM Employee e2
             WHERE e2.salary > e1.salary) = N - 1
  );
END
```

</div>

**Key implementation details:**

1. **DENSE_RANK() vs RANK()**: We use `DENSE_RANK()` not `RANK()` because `RANK()` leaves gaps when there are ties (e.g., 1, 1, 3 for duplicate top salaries), while `DENSE_RANK()` gives consecutive ranks (1, 1, 2).

2. **Handling NULL**: The function should return NULL when N exceeds the number of distinct salaries. All three approaches handle this correctly.

3. **DISTINCT placement**: In Approach 1, we need `DISTINCT` in the outer query because multiple employees can have the same salary with the same rank.

4. **OFFSET calculation**: In Approach 2, we use `OFFSET N-1` because OFFSET 0 gives the first row, OFFSET 1 gives the second row, etc.

## Complexity Analysis

**Approach 1 (DENSE_RANK()):**

- **Time Complexity**: O(n log n) - The database needs to sort the data to assign ranks, and sorting n items takes O(n log n) time.
- **Space Complexity**: O(n) - The window function creates a temporary result set with ranks for all rows.

**Approach 2 (DISTINCT with LIMIT/OFFSET):**

- **Time Complexity**: O(n log n) - Finding distinct values and sorting them both require O(n log n) time.
- **Space Complexity**: O(n) - Storing distinct values requires additional space.

**Approach 3 (Correlated subquery):**

- **Time Complexity**: O(n²) - For each row in the outer query, we scan the entire table in the inner query.
- **Space Complexity**: O(1) - No additional data structures needed.

In practice, Approach 1 is preferred for clarity and reasonable performance. Approach 2 is also acceptable and might be slightly more efficient for some database engines. Approach 3 should be avoided for large datasets due to its quadratic time complexity.

## Common Mistakes

1. **Forgetting to handle duplicate salaries**: The most common mistake is treating each row as a separate ranking position. Remember: "Nth highest salary" refers to distinct salary values. If three employees earn $100,000 and two earn $80,000, the 2nd highest salary is $80,000, not the 2nd row in a sorted list.

2. **Using RANK() instead of DENSE_RANK()**: `RANK()` leaves gaps when there are ties. For salaries [100, 100, 90, 80], RANK() gives [1, 1, 3, 4] while DENSE_RANK() gives [1, 1, 2, 3]. We want consecutive ranks, so DENSE_RANK() is correct.

3. **Not handling the NULL case**: When N is larger than the number of distinct salaries, the function should return NULL. Many candidates forget this edge case. Always test with N values that are 0, 1, equal to the number of distinct salaries, and greater than the number of distinct salaries.

4. **OFFSET off-by-one errors**: Remember that `OFFSET 0` gives the first row, `OFFSET 1` gives the second row, so for the Nth highest salary, you need `OFFSET N-1`. A common mistake is using `OFFSET N`.

## When You'll See This Pattern

This problem teaches several important SQL patterns:

1. **Window functions for ranking**: Problems that require "top N per group" or "rank elements" often use `ROW_NUMBER()`, `RANK()`, or `DENSE_RANK()`.
   - Related problem: [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries/) - Uses similar ranking logic within groups
2. **Handling duplicates with DISTINCT**: When you need to consider unique values rather than all rows.
   - Related problem: [Second Highest Salary](https://leetcode.com/problems/second-highest-salary/) - A simpler version of this problem
3. **LIMIT/OFFSET for pagination**: The pattern of skipping rows and taking a specific number is common in pagination queries.
   - Related problem: [Combine Two Tables](https://leetcode.com/problems/combine-two-tables/) with pagination requirements

4. **Correlated subqueries for ranking**: While inefficient, understanding correlated subqueries helps with more complex filtering conditions.
   - Related problem: [Employees Earning More Than Their Managers](https://leetcode.com/problems/employees-earning-more-than-their-managers/) - Uses similar self-join patterns

## Key Takeaways

1. **Always clarify how to handle duplicates** - When a problem asks for "Nth highest" or "top N," ask whether duplicates should be considered separately or as one group. This clarification shows attention to detail.

2. **Window functions are powerful for ranking problems** - `DENSE_RANK()` is specifically designed for consecutive ranking of values, making it ideal for "Nth highest" type problems.

3. **Test edge cases systematically** - Always test with: empty table, single row, all duplicate values, N=1, N=last rank, N>total distinct values. This catches most implementation errors.

4. **Understand the performance implications** - Window functions (O(n log n)) are generally better than correlated subqueries (O(n²)) for ranking problems on large datasets.

Related problems: [The Number of Users That Are Eligible for Discount](/problem/the-number-of-users-that-are-eligible-for-discount)
