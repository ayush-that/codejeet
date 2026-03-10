---
title: "How to Solve Find Followers Count — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Followers Count. Easy difficulty, 69.5% acceptance rate. Topics: Database."
date: "2027-06-07"
category: "dsa-patterns"
tags: ["find-followers-count", "database", "easy"]
---

# How to Solve Find Followers Count

This problem asks us to calculate the number of followers for each user from a `Followers` table. While it's a straightforward SQL query, what makes it interesting is understanding how to properly use aggregation functions with GROUP BY, and recognizing that we need to count distinct followers per user. The primary key being (user_id, follower_id) gives us a crucial hint about potential duplicates we need to handle.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Suppose our `Followers` table contains:

| user_id | follower_id |
| ------- | ----------- | ------------------------- |
| 0       | 1           |
| 1       | 0           |
| 0       | 2           |
| 2       | 0           |
| 0       | 1           | ← Duplicate of first row! |

**Step 1: Understanding the data**

- User 0 has followers: 1, 2, and 1 again (duplicate)
- User 1 has follower: 0
- User 2 has follower: 0

**Step 2: What we need to calculate**
We need to count _unique_ followers for each user. Even though user 0 appears to have 3 follower records, they only have 2 unique followers (users 1 and 2).

**Step 3: The thought process**

1. We need to group by `user_id` to organize all records for each user together
2. For each group, we need to count how many _distinct_ `follower_id` values exist
3. We should order the results by `user_id` as typically expected in such queries

The final result should be:
| user_id | followers_count |
|---------|-----------------|
| 0 | 2 |
| 1 | 1 |
| 2 | 1 |

## Brute Force Approach

For SQL problems, there isn't really a "brute force" in the algorithmic sense, but there are inefficient or incorrect approaches that candidates might try:

**Incorrect Approach 1: Counting all rows without DISTINCT**

```sql
SELECT user_id, COUNT(follower_id) as followers_count
FROM Followers
GROUP BY user_id
ORDER BY user_id;
```

This would give user 0 a count of 3 instead of 2 because it counts the duplicate follower_id.

**Incorrect Approach 2: Using subqueries unnecessarily**

```sql
SELECT user_id, (
    SELECT COUNT(DISTINCT follower_id)
    FROM Followers f2
    WHERE f2.user_id = f1.user_id
) as followers_count
FROM Followers f1
GROUP BY user_id
ORDER BY user_id;
```

While this works, it's less efficient than a simple GROUP BY with COUNT(DISTINCT) because it processes the table multiple times.

The key insight is that we need to use `COUNT(DISTINCT column)` when counting unique values within groups.

## Optimal Solution

The optimal solution uses a simple GROUP BY with COUNT(DISTINCT follower_id). This approach is efficient because:

1. It processes the table only once
2. The database can optimize DISTINCT counting within groups
3. It's readable and maintainable

<div class="code-group">

```sql
-- Time: O(n log n) for grouping and sorting | Space: O(n) for storing intermediate groups
SELECT
    user_id,                    -- Select the user_id column
    COUNT(DISTINCT follower_id) AS followers_count  -- Count unique followers for each user
FROM
    Followers                   -- From the Followers table
GROUP BY
    user_id                     -- Group records by user_id
ORDER BY
    user_id;                    -- Sort results by user_id in ascending order
```

</div>

**Line-by-line explanation:**

1. **`SELECT user_id`**: We want to display each user's ID in our result
2. **`COUNT(DISTINCT follower_id) AS followers_count`**: This is the core of the solution. We count how many _unique_ follower IDs exist for each user. The `DISTINCT` keyword ensures we don't double-count the same follower. We alias this result as `followers_count` for clarity.
3. **`FROM Followers`**: Specifies the table we're querying
4. **`GROUP BY user_id`**: Groups all rows with the same `user_id` together. This allows our COUNT function to operate on each user's followers separately.
5. **`ORDER BY user_id`**: Sorts the results by user_id in ascending order (default). This makes the output organized and easy to read.

## Complexity Analysis

**Time Complexity: O(n log n)**

- The database needs to sort or hash the data to group by `user_id`, which typically takes O(n log n) time where n is the number of rows in the table
- Counting distinct values within each group adds some overhead, but modern databases optimize this operation
- The final sorting by `user_id` is often optimized since the data is already grouped by `user_id`

**Space Complexity: O(n)**

- The database needs to store intermediate results for grouping
- In the worst case, if each row has a different `user_id`, we might need O(n) space to track all groups
- The output space is O(k) where k is the number of distinct users

## Common Mistakes

1. **Forgetting DISTINCT in COUNT**: This is the most common mistake. Without DISTINCT, you'll count duplicate follower relationships. Remember: the primary key is (user_id, follower_id), which means the same follower could follow the same user only once in the table, but it's still important to use DISTINCT for clarity and correctness in case of data anomalies.

2. **Missing GROUP BY**: Some beginners try to use COUNT without GROUP BY, which would count all rows in the table and return only one row. GROUP BY is essential to get per-user counts.

3. **Incorrect ORDER BY**: While not technically wrong, forgetting to order the results makes the output messy. Most interviewers expect ordered output unless specified otherwise. Some might even consider unordered output incorrect.

4. **Using subqueries unnecessarily**: As shown in the brute force section, some candidates overcomplicate the solution with correlated subqueries. While these work, they're less efficient and harder to read than the simple GROUP BY approach.

## When You'll See This Pattern

This pattern of using GROUP BY with aggregate functions (COUNT, SUM, AVG, etc.) appears frequently in database problems:

1. **LeetCode 182: Duplicate Emails** - Uses GROUP BY and HAVING COUNT(\*) > 1 to find duplicates
2. **LeetCode 181: Employees Earning More Than Their Managers** - Uses self-join with GROUP BY to compare salaries
3. **LeetCode 620: Not Boring Movies** - Uses WHERE with ORDER BY, similar filtering pattern
4. **LeetCode 1757: Recyclable and Low Fat Products** - Simple filtering with multiple conditions

The core pattern is: when you need to perform calculations on groups of rows (per user, per category, per date, etc.), think GROUP BY with appropriate aggregate functions.

## Key Takeaways

1. **GROUP BY + COUNT(DISTINCT column)** is the standard pattern for counting unique values per group in SQL. This combination appears in many real-world scenarios like counting unique visitors, distinct products purchased, etc.

2. **Always consider data uniqueness** when counting. The DISTINCT keyword is crucial when the same value might appear multiple times in the group. Look for hints in the problem statement or table schema about potential duplicates.

3. **Order your results** unless the problem specifies otherwise. Clean, organized output shows attention to detail and makes your solution more professional.

[Practice this problem on CodeJeet](/problem/find-followers-count)
