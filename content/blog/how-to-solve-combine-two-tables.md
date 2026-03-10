---
title: "How to Solve Combine Two Tables — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Combine Two Tables. Easy difficulty, 79.2% acceptance rate. Topics: Database."
date: "2026-06-18"
category: "dsa-patterns"
tags: ["combine-two-tables", "database", "easy"]
---

# How to Solve Combine Two Tables

This problem asks us to combine information from two database tables: `Person` (containing basic personal information) and `Address` (containing address details). The challenge is that not every person has an address recorded, but we still need to include all people in our result. This is a classic SQL problem that tests your understanding of different types of joins and how to handle missing data.

What makes this problem interesting is that it's not just about joining tables—it's about choosing the _right_ type of join. Many candidates jump straight to an INNER JOIN, which would exclude people without addresses. The key insight is recognizing that we need to preserve all records from the `Person` table regardless of whether they have matching records in `Address`.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Sample Data:**

```
Person table:
+----------+----------+-----------+
| personId | lastName | firstName |
+----------+----------+-----------+
| 1        | Wang     | Allen     |
| 2        | Alice    | Bob       |
+----------+----------+-----------+

Address table:
+-----------+----------+---------------+------------+
| addressId | personId | city          | state      |
+-----------+----------+---------------+------------+
| 1         | 2        | New York City | New York   |
+-----------+----------+---------------+------------+
```

**Step-by-step thought process:**

1. We want to combine information for both people: Allen Wang (personId 1) and Bob Alice (personId 2)
2. Bob Alice has an address in the Address table, so we can combine his personal info with his address info
3. Allen Wang doesn't have an entry in the Address table, but we still need to include him in our results
4. For Allen Wang, the address columns (city, state) should show as NULL since he has no address data
5. The final result should look like:

```
+-----------+----------+-----------+---------------+------------+
| firstName | lastName | city      | state         |
+-----------+----------+-----------+---------------+------------+
| Allen     | Wang     | null      | null          |
| Bob       | Alice    | New York  | New York City |
+-----------+----------+-----------+---------------+------------+
```

This visualization makes it clear: we need ALL people from the Person table, with their address information if it exists. This is exactly what a LEFT JOIN does.

## Brute Force Approach

For database problems, there isn't really a "brute force" in the algorithmic sense, but there are incorrect approaches that naive candidates might try:

**Wrong Approach 1: INNER JOIN**

```sql
SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
JOIN Address a ON p.personId = a.personId;
```

This approach fails because it only returns people who have addresses. In our example, Allen Wang would be excluded from the results.

**Wrong Approach 2: Using WHERE clause incorrectly**

```sql
SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p, Address a
WHERE p.personId = a.personId;
```

This is equivalent to an INNER JOIN and suffers from the same problem—it excludes people without addresses.

The fundamental issue with these approaches is that they don't preserve all records from the `Person` table. They're "brute force" in the sense that they're the most obvious way to combine tables, but they don't satisfy the problem requirements.

## Optimal Solution

The optimal solution uses a LEFT JOIN (or LEFT OUTER JOIN) to ensure we get all records from the `Person` table, with matching address information when it exists. When there's no matching address, the address columns will be NULL.

<div class="code-group">

```sql
-- Time: O(n + m) where n = rows in Person, m = rows in Address
-- Space: O(n) for the result set
SELECT
    p.firstName,    -- Select first name from Person table
    p.lastName,     -- Select last name from Person table
    a.city,         -- Select city from Address table (NULL if no address)
    a.state         -- Select state from Address table (NULL if no address)
FROM
    Person p        -- Start with the Person table as our base
LEFT JOIN
    Address a       -- LEFT JOIN ensures all Person records are kept
    ON p.personId = a.personId;  -- Match on personId to combine records
```

```sql
-- Alternative syntax that works in all SQL dialects
-- Time: O(n + m) | Space: O(n)
SELECT
    p.firstName,
    p.lastName,
    a.city,
    a.state
FROM
    Person p
LEFT OUTER JOIN
    Address a
    ON p.personId = a.personId;
```

```sql
-- Some databases support USING clause when column names are identical
-- Time: O(n + m) | Space: O(n)
SELECT
    firstName,
    lastName,
    city,
    state
FROM
    Person
LEFT JOIN
    Address
    USING (personId);
```

</div>

**Line-by-line explanation:**

1. `SELECT p.firstName, p.lastName, a.city, a.state` - We're selecting the specific columns requested in the problem statement. Notice we use table aliases (`p` and `a`) to make the query more readable and avoid ambiguity.

2. `FROM Person p` - This establishes `Person` as our primary table. All records from this table will be included in the result.

3. `LEFT JOIN Address a` - The key part! "LEFT" refers to the table on the left side of the JOIN (Person). A LEFT JOIN keeps all records from the left table, even if there's no match in the right table.

4. `ON p.personId = a.personId` - This is our join condition. We're matching records where the personId values are equal. For people without addresses, this condition won't be met, so the address columns will be NULL.

## Complexity Analysis

**Time Complexity: O(n + m)**

- `n` = number of rows in the Person table
- `m` = number of rows in the Address table
- The database needs to scan both tables once to perform the join. In the worst case, if every person has an address, the database might need to compare each person with each address, but with proper indexing on `personId`, this is optimized to O(n + m).

**Space Complexity: O(n)**

- The result set will contain at most `n` rows (one for each person)
- Each row contains 4 columns, so total space is proportional to the number of people

**Why these complexities matter:**

- With proper indexing on `personId` (which is the primary key for Person and a foreign key in Address), the database can perform the join very efficiently
- The LEFT JOIN doesn't create additional intermediate storage beyond the result set in most modern database engines

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**
   - This is the most common mistake. Candidates see "combine two tables" and immediately think JOIN, forgetting that not all joins preserve all records from one table.
   - **How to avoid:** Always ask yourself: "Do I need all records from one table, even if there's no match in the other?" If yes, use LEFT JOIN.

2. **Forgetting table aliases when columns have the same name**
   - If both tables had a `city` column, `SELECT city` would be ambiguous.
   - **How to avoid:** Use table aliases (`p.` and `a.`) consistently, even when not strictly necessary. It makes your query clearer and prevents errors.

3. **Incorrect join condition**
   - Using `ON p.personId = a.addressId` or other wrong column matches.
   - **How to avoid:** Carefully check which columns should be used for joining. In this case, we join on `personId` because that's the common field.

4. **Not handling NULL values in application code**
   - While not a SQL mistake, candidates sometimes forget that address columns will be NULL for people without addresses.
   - **How to avoid:** In your application code, always check for NULL values when processing the query results.

## When You'll See This Pattern

This LEFT JOIN pattern appears frequently in database problems where you need to preserve all records from one table while optionally including related data from another:

1. **Employee Bonus (LeetCode 577)** - Very similar problem where you need to find employee bonuses, but some employees have no bonus. Requires a LEFT JOIN between Employee and Bonus tables.

2. **Customers Who Never Order (LeetCode 183)** - Find customers who have never placed an order. This uses a LEFT JOIN from Customers to Orders, then filters for NULL order IDs.

3. **Department Top Three Salaries (LeetCode 185)** - While more complex, it uses LEFT JOIN-like logic to include all departments even if they have fewer than three employees.

The pattern also appears in real-world scenarios:

- Generating reports that include all customers, even those with no purchases
- Displaying user profiles with optional contact information
- Any situation where you have mandatory data in one table and optional, related data in another

## Key Takeaways

1. **Know your JOIN types:** INNER JOIN returns only matching records, LEFT JOIN returns all records from the left table with matches from the right (or NULLs), RIGHT JOIN is the opposite, and FULL OUTER JOIN returns all records from both tables.

2. **When to use LEFT JOIN:** Use it when you need ALL records from the primary table, regardless of whether related data exists in the secondary table. The question "Report the first name, last name, city, and state of each person" implies we want every person.

3. **Read requirements carefully:** The phrase "each person" or "all records" is a strong hint that you need a LEFT JOIN. If the problem said "people who have addresses," then INNER JOIN would be correct.

Remember: In database interviews, the choice of JOIN type is often more important than the SQL syntax itself. Understanding what each JOIN does will help you choose the right tool for each problem.

Related problems: [Employee Bonus](/problem/employee-bonus)
