---
title: "How to Solve User Activity for the Past 30 Days I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode User Activity for the Past 30 Days I. Easy difficulty, 50.5% acceptance rate. Topics: Database."
date: "2027-04-26"
category: "dsa-patterns"
tags: ["user-activity-for-the-past-30-days-i", "database", "easy"]
---

# How to Solve "User Activity for the Past 30 Days I"

This problem asks us to calculate the daily active user count for a 30-day window ending on a specific date. While it's an "Easy" SQL problem, it tests your understanding of date filtering, grouping, and handling edge cases like days with no activity. The tricky part is correctly defining the 30-day window and ensuring we only count distinct users per day.

## Visual Walkthrough

Let's walk through a small example. Suppose we have the following `Activity` table:

| user_id | session_id | activity_date | activity_type |
| ------- | ---------- | ------------- | ------------- |
| 1       | 1          | 2023-07-20    | open_session  |
| 1       | 2          | 2023-07-20    | scroll_down   |
| 2       | 3          | 2023-07-20    | open_session  |
| 1       | 4          | 2023-07-21    | send_message  |
| 3       | 5          | 2023-07-21    | open_session  |
| 4       | 6          | 2023-07-25    | open_session  |
| 2       | 7          | 2023-07-25    | open_session  |

And we're asked for activity between **2023-06-28** and **2023-07-27** (30 days ending on 2023-07-27).

**Step 1: Filter by date range**
We only keep rows where `activity_date` is between '2023-06-28' and '2023-07-27':

- 2023-07-20 ✓ (within range)
- 2023-07-21 ✓ (within range)
- 2023-07-25 ✓ (within range)

**Step 2: Group by date and count distinct users**

- 2023-07-20: users 1 and 2 → 2 active users
- 2023-07-21: users 1 and 3 → 2 active users
- 2023-07-25: users 2 and 4 → 2 active users

**Step 3: Handle missing dates**
What about 2023-07-22, 2023-07-23, 2023-07-24? These dates have no activity in our filtered data, so they won't appear in the result. That's correct—we only report dates that actually have activity.

Our final result would be:
| activity_date | active_users |
|---------------|--------------|
| 2023-07-20 | 2 |
| 2023-07-21 | 2 |
| 2023-07-25 | 2 |

## Brute Force Approach

A naive approach might be to:

1. Get all distinct dates in the 30-day window
2. For each date, count distinct users who have activity on that date
3. Return all dates with their counts

In SQL, this could be implemented with a subquery for each date, but that would be inefficient—especially if we have many dates to check. However, SQL's `GROUP BY` naturally handles this efficiently by grouping all rows with the same date together in one pass through the data.

The real "brute force" mistake would be to:

- Forget to filter by the 30-day window first (scanning the entire table unnecessarily)
- Not use `DISTINCT` when counting users (counting multiple sessions from the same user as multiple users)
- Manually listing all 30 dates instead of letting the database handle date range filtering

## Optimal Solution

The optimal solution uses a single query with proper filtering, grouping, and aggregation. We need to:

1. Filter activities to the 30-day window ending on '2019-07-27'
2. Group by `activity_date`
3. Count distinct `user_id` for each group
4. Return the results with the specified column names

<div class="code-group">

```sql
-- Time: O(n) where n is rows in Activity table | Space: O(m) where m is distinct dates
SELECT
    activity_date AS day,  -- Rename column as required
    COUNT(DISTINCT user_id) AS active_users  -- Count unique users per day
FROM
    Activity
WHERE
    -- Filter for 30-day window ending on 2019-07-27
    -- DATEDIFF calculates days between two dates
    -- We include dates where the difference is between 0 and 29 days
    DATEDIFF('2019-07-27', activity_date) BETWEEN 0 AND 29
    -- Alternative: activity_date BETWEEN DATE_SUB('2019-07-27', INTERVAL 29 DAY) AND '2019-07-27'
GROUP BY
    activity_date  -- Group all activities on the same date together
ORDER BY
    activity_date;  -- Optional: sort by date for cleaner output
```

```sql
-- Alternative using DATE_SUB for better readability
SELECT
    activity_date AS day,
    COUNT(DISTINCT user_id) AS active_users
FROM
    Activity
WHERE
    -- Filter for the 30-day period
    -- DATE_SUB subtracts 29 days from 2019-07-27
    -- We use BETWEEN to include both start and end dates
    activity_date BETWEEN DATE_SUB('2019-07-27', INTERVAL 29 DAY) AND '2019-07-27'
GROUP BY
    activity_date
ORDER BY
    activity_date;
```

</div>

**Key explanation of the WHERE clause:**

- `DATEDIFF('2019-07-27', activity_date) BETWEEN 0 AND 29`: This includes dates where the difference in days is 0 to 29. A difference of 0 means the same date (2019-07-27), 1 means one day before (2019-07-26), up to 29 days before (2019-06-28).
- Why 29 and not 30? Because when we say "past 30 days" including today, we're talking about 30 total days: today + 29 previous days.
- The `BETWEEN` is inclusive, so both the start and end dates are included.

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Activity table. The database needs to:

1. Scan the table (or use indexes) to filter rows in the date range: O(n)
2. Group the filtered rows by date: O(k log k) where k is filtered rows, but typically close to O(n)
3. Count distinct users per group: O(m) where m is users per group

In practice, with proper indexing on `activity_date`, this can be much faster than O(n).

**Space Complexity:** O(d) where d is the number of distinct dates in the result. The database needs to store intermediate results for each date group before returning the final result. In the worst case, if every day in the 30-day window has activity, d = 30.

## Common Mistakes

1. **Off-by-one error in date range:** Using 30 instead of 29 in the DATEDIFF or DATE_SUB. Remember: "past 30 days" including today = today + 29 previous days = 30 total days.

2. **Forgetting DISTINCT in COUNT:** Writing `COUNT(user_id)` instead of `COUNT(DISTINCT user_id)`. If a user has multiple sessions in a day, they'd be counted multiple times. Always ask: "Do we want to count users or sessions?"

3. **Incorrect column aliases:** The problem asks for columns named `day` and `active_users`. Forgetting the `AS` keyword or using different names will cause the solution to fail.

4. **Not handling the end date correctly:** The window ends on '2019-07-27', not the current date. Some candidates might use `CURDATE()` or `NOW()` instead of the specified end date.

5. **Including dates outside the range:** Forgetting the WHERE clause entirely or having incorrect boundary conditions. Always test with edge cases: what if activity_date equals exactly the start or end date?

## When You'll See This Pattern

This pattern of filtering by date range and aggregating appears frequently in real-world analytics and other LeetCode problems:

1. **Game Play Analysis I (LeetCode 511):** Similar concept but finding first login date for each player. Uses `MIN()` with `GROUP BY` instead of `COUNT(DISTINCT)`.

2. **Game Play Analysis II (LeetCode 512):** Extends the pattern to find specific events after grouping.

3. **Customer Placing the Largest Number of Orders (LeetCode 586):** Another grouping and counting problem, though without date filtering.

4. **Big Countries (LeetCode 595):** Simple filtering problem that teaches the same WHERE clause logic but with numerical comparisons instead of dates.

The core pattern is: **Filter → Group → Aggregate**. This is fundamental to SQL analytics and appears in nearly all reporting queries.

## Key Takeaways

1. **Date range filtering is inclusive:** When using `BETWEEN` or `DATEDIFF() BETWEEN`, remember that both boundaries are included. For "past 30 days including today," you need 0 to 29 days difference.

2. **Always consider distinct counts:** When the problem asks for "users" (not sessions or activities), you almost always need `COUNT(DISTINCT column)`. Read the problem statement carefully to determine what entity you're counting.

3. **SQL follows logical order:** Even though the SELECT clause appears first, SQL executes in this order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. Understanding this helps debug complex queries.

4. **Test edge cases:** Always check what happens on the boundary dates (first and last day of range) and when there are duplicate records.

[Practice this problem on CodeJeet](/problem/user-activity-for-the-past-30-days-i)
