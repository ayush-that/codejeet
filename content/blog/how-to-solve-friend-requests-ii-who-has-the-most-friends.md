---
title: "How to Solve Friend Requests II: Who Has the Most Friends — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Friend Requests II: Who Has the Most Friends. Medium difficulty, 62.3% acceptance rate. Topics: Database."
date: "2027-11-16"
category: "dsa-patterns"
tags: ["friend-requests-ii-who-has-the-most-friends", "database", "medium"]
---

# How to Solve Friend Requests II: Who Has the Most Friends

This problem asks us to find the person(s) with the most friends from a table of friend requests. The tricky part is that friendships are bidirectional—if person A sends a request to person B and it's accepted, both A and B gain a friend. This means we need to count each person's appearances in both the `requester_id` and `accepter_id` columns to get their total friend count.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `RequestAccepted` table contains:

| requester_id | accepter_id | accept_date |
| ------------ | ----------- | ----------- |
| 1            | 2           | 2020-01-01  |
| 1            | 3           | 2020-01-01  |
| 2            | 3           | 2020-01-02  |
| 3            | 4           | 2020-01-03  |

**Step 1: Understand the relationships**

- Row 1: Person 1 and 2 are friends → Both get +1 friend
- Row 2: Person 1 and 3 are friends → Both get +1 friend
- Row 3: Person 2 and 3 are friends → Both get +1 friend
- Row 4: Person 3 and 4 are friends → Both get +1 friend

**Step 2: Count friends for each person**

- Person 1: Appears as requester in rows 1 & 2 → 2 friends
- Person 2: Appears as requester in row 3, accepter in row 1 → 2 friends
- Person 3: Appears as requester in row 4, accepter in rows 2 & 3 → 3 friends
- Person 4: Appears as accepter in row 4 → 1 friend

**Step 3: Find the maximum**
Person 3 has 3 friends, which is the highest count. So our result should be:

| id  | num |
| --- | --- |
| 3   | 3   |

## Brute Force Approach

A naive approach might try to process each person individually:

1. Get all distinct person IDs from both columns
2. For each person, count how many times they appear in `requester_id`
3. For each person, count how many times they appear in `accepter_id`
4. Sum these two counts for each person
5. Find the maximum sum

While this would work, it's inefficient because we'd be scanning the table multiple times—once to get all distinct IDs, then for each person, we'd scan the entire table to count their appearances. If we have `n` rows and `m` distinct people, this becomes O(m × n), which is too slow for large datasets.

The key insight is that we need to **treat both columns equally** since friendships are bidirectional, and we need to **aggregate counts efficiently** without multiple passes.

## Optimized Approach

The optimal solution uses these key steps:

1. **Combine both columns**: Since a friendship involves two people regardless of who requested/accepted, we need to count each person's appearances in BOTH columns. We can use `UNION ALL` to stack the two columns into one list of IDs.

2. **Count occurrences**: Once we have all IDs in a single column, we can use `GROUP BY` and `COUNT()` to get each person's total friend count.

3. **Find the maximum**: We need to find the person(s) with the highest count. Since multiple people could tie for the most friends, we can't just use `LIMIT 1`. Instead, we can use a subquery to find the maximum count, then select all people with that count.

The critical insight is recognizing that `UNION ALL` (not `UNION`) preserves duplicates, which is exactly what we need for counting. If person A appears 3 times as a requester and 2 times as an accepter, we want to count all 5 appearances.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n) where n is the number of rows (we scan the table once)
-- Space: O(n) for the temporary result set

-- Step 1: Combine both requester_id and accepter_id into a single column
-- We use UNION ALL (not UNION) because we want to count duplicates
WITH all_ids AS (
    SELECT requester_id AS id FROM RequestAccepted
    UNION ALL
    SELECT accepter_id AS id FROM RequestAccepted
),

-- Step 2: Count how many times each ID appears in the combined list
-- This gives us each person's total number of friends
friend_counts AS (
    SELECT
        id,
        COUNT(*) AS num  -- Count all occurrences of each ID
    FROM all_ids
    GROUP BY id          -- Group by person ID to get per-person counts
)

-- Step 3: Find the ID(s) with the maximum friend count
-- We need to handle ties, so we can't just use LIMIT 1
SELECT
    id,
    num
FROM friend_counts
WHERE num = (
    -- Subquery to find the maximum friend count
    SELECT MAX(num)
    FROM friend_counts
)
ORDER BY id;  -- Optional: Sort for consistent output
```

</div>

**Line-by-line explanation:**

1. **`WITH all_ids AS (...)`**: This Common Table Expression (CTE) creates a temporary table containing all IDs from both columns. `UNION ALL` stacks the results without removing duplicates, which is crucial for accurate counting.

2. **`SELECT requester_id AS id FROM RequestAccepted`**: Takes all requester IDs and aliases them as `id` for consistency.

3. **`UNION ALL SELECT accepter_id AS id FROM RequestAccepted`**: Appends all accepter IDs to the same column. Using `UNION ALL` (not `UNION`) preserves duplicate entries, so if someone appears multiple times, all appearances are counted.

4. **`friend_counts AS (...)`**: The second CTE counts how many times each ID appears in the combined list. `GROUP BY id` groups all occurrences of the same ID together, and `COUNT(*)` counts how many rows are in each group.

5. **`WHERE num = (SELECT MAX(num) FROM friend_counts)`**: This finds all people whose friend count equals the maximum count. The subquery `SELECT MAX(num) FROM friend_counts` calculates the highest friend count. This approach correctly handles ties—if multiple people have the same maximum number of friends, they'll all be returned.

## Complexity Analysis

**Time Complexity: O(n)**

- We scan the `RequestAccepted` table twice: once for `requester_id` and once for `accepter_id` in the `UNION ALL`. This is O(2n) = O(n).
- The `GROUP BY` operation typically uses hashing or sorting, which is O(n log n) in worst case but often optimized to O(n) in modern databases.
- The subquery `MAX(num)` scans the aggregated results once, which is O(k) where k is the number of distinct people.

**Space Complexity: O(n)**

- The `UNION ALL` creates a temporary table with 2n rows (since each original row contributes 2 IDs).
- The `GROUP BY` creates a result set with k rows (one per distinct person).
- In practice, databases may use streaming aggregation to reduce memory usage.

## Common Mistakes

1. **Using `UNION` instead of `UNION ALL`**: This is the most common mistake. `UNION` removes duplicates, which would undercount friends. For example, if person A appears 3 times as requester and 2 times as accepter, `UNION` would only count them once, while `UNION ALL` correctly counts all 5 appearances.

2. **Forgetting to handle ties**: Using `ORDER BY num DESC LIMIT 1` would only return one person even if multiple people have the same maximum friend count. The problem doesn't specify how to handle ties, but returning all people with the maximum count is the standard expectation.

3. **Incorrect column naming**: When using `UNION`, both SELECT statements must have the same number of columns with compatible types. Using different aliases or column counts would cause an error.

4. **Not considering edge cases**:
   - Empty table: Should return an empty result set.
   - Single row: Should return both people with 1 friend each.
   - All people have the same number of friends: Should return all people.

## When You'll See This Pattern

This problem teaches the **"combine and aggregate"** pattern, which appears in many SQL problems:

1. **Combine columns with UNION ALL**:
   - LeetCode 1978: "Employees Whose Manager Left the Company" - Combine employee and manager IDs
   - LeetCode 1795: "Rearrange Products Table" - Unpivot columns into rows

2. **Find maximum with ties**:
   - LeetCode 184: "Department Highest Salary" - Find employees with the highest salary in each department
   - LeetCode 586: "Customer Placing the Largest Number of Orders" - Similar pattern but with `LIMIT` since ties might not matter

3. **Bidirectional relationship counting**:
   - Any problem involving undirected graphs or symmetric relationships in database form

The core technique of using `UNION ALL` to treat bidirectional relationships symmetrically is particularly useful for social network problems, recommendation systems, and graph analysis in SQL.

## Key Takeaways

1. **For bidirectional relationships, combine both directions**: When a relationship goes both ways (like friendship), you often need to combine data from both columns using `UNION ALL` to get complete counts.

2. **Use subqueries to handle ties**: When finding maximum/minimum values where multiple records can tie, use a subquery to get the extreme value, then filter for records matching that value.

3. **`UNION ALL` vs `UNION`**: Remember that `UNION` removes duplicates while `UNION ALL` preserves them. For counting problems, you usually want `UNION ALL`; for distinct lists, use `UNION`.

[Practice this problem on CodeJeet](/problem/friend-requests-ii-who-has-the-most-friends)
