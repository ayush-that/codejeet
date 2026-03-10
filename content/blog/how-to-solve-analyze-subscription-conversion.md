---
title: "How to Solve Analyze Subscription Conversion  — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Analyze Subscription Conversion . Medium difficulty, 74.1% acceptance rate. Topics: Database."
date: "2029-11-14"
category: "dsa-patterns"
tags: ["analyze-subscription-conversion", "database", "medium"]
---

## How to Solve "Analyze Subscription Conversion"

This problem asks you to analyze user behavior data to determine conversion rates from free trial users to paid subscribers. You're given a table of user activities with dates, activity types, and durations, and need to calculate what percentage of users who started free trials eventually became paid subscribers. The challenge lies in correctly identifying which users had both activities and calculating the conversion rate accurately while handling edge cases like users with multiple activities or no conversion.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have this data:

| user_id | activity_date | activity_type     | activity_duration |
| ------- | ------------- | ----------------- | ----------------- |
| 1       | 2023-01-01    | free_trial        | 7                 |
| 1       | 2023-01-05    | paid_subscription | 30                |
| 2       | 2023-01-02    | free_trial        | 7                 |
| 3       | 2023-01-03    | free_trial        | 7                 |
| 3       | 2023-01-04    | free_trial        | 7                 |
| 4       | 2023-01-05    | paid_subscription | 30                |

**Step 1: Identify trial users**  
Users who had at least one `free_trial`: users 1, 2, and 3.

**Step 2: Identify converted users**  
Users who had at least one `paid_subscription`: users 1 and 4.

**Step 3: Find intersection**  
Users who had BOTH activities: only user 1.

**Step 4: Calculate conversion rate**  
Total trial users = 3  
Converted users = 1  
Conversion rate = 1/3 = 33.33%

Notice that user 4 had a paid subscription but no free trial, so they don't count as a trial user. User 3 had multiple free trials but no paid subscription, so they count as a trial user but not as converted.

## Brute Force Approach

A naive approach would be to:

1. Get all distinct users with free trials
2. Get all distinct users with paid subscriptions
3. For each trial user, check if they exist in the paid subscription list

In SQL, this might look like:

```sql
-- Inefficient approach with multiple scans
SELECT
    COUNT(DISTINCT CASE WHEN u2.user_id IS NOT NULL THEN u1.user_id END) * 100.0 /
    COUNT(DISTINCT u1.user_id) AS conversion_rate
FROM UserActivity u1
LEFT JOIN UserActivity u2 ON u1.user_id = u2.user_id
WHERE u1.activity_type = 'free_trial'
AND u2.activity_type = 'paid_subscription';
```

**Why this is problematic:**

- The JOIN can create a Cartesian product if users have multiple activities
- Multiple table scans are inefficient
- Doesn't handle NULL cases cleanly
- Can double-count users with multiple activities

## Optimized Approach

The key insight is that we need to:

1. **Separately identify** users with each activity type
2. **Count distinct users** in each group
3. **Calculate the ratio** of users in the intersection

A better approach uses **conditional aggregation** with `CASE` statements inside aggregate functions. This allows us to scan the table once and build both sets simultaneously.

**Step-by-step reasoning:**

1. Use `COUNT(DISTINCT CASE ...)` to count trial users
2. Use `COUNT(DISTINCT CASE ...)` to count users who had both activities
3. The conversion rate is: (users with both) / (trial users) × 100
4. Handle division by zero with `NULLIF`

The critical realization is that a user "converted" if they have **at least one** free trial AND **at least one** paid subscription. We don't care about the order or timing for this basic conversion rate calculation.

## Optimal Solution

Here's the complete, optimized solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n) where n is rows in table | Space: O(1) for the aggregation
SELECT
    -- Count distinct users who had BOTH free trial AND paid subscription
    -- CASE returns user_id when both conditions met, NULL otherwise
    -- COUNT(DISTINCT) ignores NULLs, counting only converted users
    COUNT(DISTINCT
        CASE
            WHEN activity_type IN ('free_trial', 'paid_subscription')
            THEN user_id
            ELSE NULL
        END
    ) * 100.0 /

    -- Count distinct users who had free trials
    -- NULLIF prevents division by zero (returns NULL if no trial users)
    NULLIF(
        COUNT(DISTINCT
            CASE
                WHEN activity_type = 'free_trial'
                THEN user_id
                ELSE NULL
            END
        ),
        0
    ) AS conversion_rate
FROM UserActivity;
```

```sql
-- Alternative approach using subqueries (same complexity, different style)
-- Time: O(n) | Space: O(k) where k is distinct users
SELECT
    -- Calculate conversion rate with proper NULL handling
    COALESCE(
        -- Users with both activities divided by trial users
        (SELECT COUNT(DISTINCT user_id)
         FROM UserActivity
         WHERE activity_type = 'paid_subscription'
         AND user_id IN (
             SELECT DISTINCT user_id
             FROM UserActivity
             WHERE activity_type = 'free_trial'
         )) * 100.0 /
        NULLIF(
            (SELECT COUNT(DISTINCT user_id)
             FROM UserActivity
             WHERE activity_type = 'free_trial'),
            0
        ),
        0  -- Default to 0 if no trial users
    ) AS conversion_rate;
```

</div>

**Line-by-line explanation of the optimal solution:**

1. **`COUNT(DISTINCT CASE ...)` for converted users**:  
   This counts unique users who have at least one record with either activity type. However, we need to ensure we're counting users who have BOTH. The trick is that we're dividing by trial users, so the numerator needs to be the intersection.

2. **Actually, let me correct that** - the first solution I showed has a logic error! It counts users with EITHER activity, not BOTH. Here's the correct optimal solution:

<div class="code-group">

```sql
-- CORRECTED Optimal Solution
-- Time: O(n) | Space: O(1)
SELECT
    -- Count users who had BOTH free trial AND paid subscription
    -- We do this by checking if a user appears in both filtered sets
    COUNT(DISTINCT
        CASE
            WHEN activity_type = 'paid_subscription'
            AND user_id IN (
                SELECT DISTINCT user_id
                FROM UserActivity
                WHERE activity_type = 'free_trial'
            )
            THEN user_id
            ELSE NULL
        END
    ) * 100.0 /

    -- Count distinct trial users with NULLIF to avoid division by zero
    NULLIF(
        COUNT(DISTINCT
            CASE
                WHEN activity_type = 'free_trial'
                THEN user_id
                ELSE NULL
            END
        ),
        0
    ) AS conversion_rate
FROM UserActivity;
```

```sql
-- Alternative CORRECT solution using CTEs (clearer but similar performance)
WITH trial_users AS (
    SELECT DISTINCT user_id
    FROM UserActivity
    WHERE activity_type = 'free_trial'
),
paid_users AS (
    SELECT DISTINCT user_id
    FROM UserActivity
    WHERE activity_type = 'paid_subscription'
)
SELECT
    -- Count users in both groups
    (SELECT COUNT(*)
     FROM trial_users t
     INNER JOIN paid_users p ON t.user_id = p.user_id) * 100.0 /

    -- Divide by total trial users
    NULLIF((SELECT COUNT(*) FROM trial_users), 0) AS conversion_rate;
```

</div>

**Why this works correctly:**

1. The subquery `SELECT DISTINCT user_id FROM UserActivity WHERE activity_type = 'free_trial'` gets all trial users
2. The `CASE` statement in the numerator only returns `user_id` when:
   - The current row is a paid subscription
   - AND that user is in the list of trial users (from the subquery)
3. `COUNT(DISTINCT ...)` ensures we count each converted user only once
4. `NULLIF(..., 0)` handles the edge case where there are no trial users

## Complexity Analysis

**Time Complexity: O(n)**

- We scan the UserActivity table once for the main query
- The subquery for trial users also scans the table, but most databases will optimize this
- In practice, with proper indexing on `activity_type`, this could be O(k) where k is relevant rows

**Space Complexity: O(m)** where m is the number of distinct trial users

- The subquery needs to store the list of distinct trial users
- In the worst case, if all users are trial users, this is O(u) where u is distinct users

## Common Mistakes

1. **Counting activities instead of users**

   ```sql
   -- WRONG: Counts activities, not users
   SELECT COUNT(*) FROM UserActivity WHERE activity_type = 'paid_subscription'
   ```

   **Fix:** Always use `COUNT(DISTINCT user_id)` when counting users.

2. **Forgetting to handle division by zero**  
   If there are no trial users, the conversion rate should be 0 or NULL, not an error.
   **Fix:** Use `NULLIF(denominator, 0)` or `CASE WHEN denominator > 0 THEN ... ELSE 0 END`.

3. **Incorrect logic for "converted" users**  
   A user is converted if they have **at least one** of each activity type, not necessarily in sequence.
   **Fix:** Use set intersection logic (IN or JOIN), not sequential filtering.

4. **Not considering users with multiple activities**  
   Users might have multiple free trials or multiple subscriptions.
   **Fix:** Use `DISTINCT` when counting users to avoid double-counting.

## When You'll See This Pattern

This type of "conversion rate" or "cohort analysis" problem appears frequently in analytics interviews:

1. **LeetCode 550: Game Play Analysis IV**  
   Similar pattern: Calculate fraction of players who logged in on the day after their first login.

2. **LeetCode 1097: Game Play Analysis V**  
   Requires calculating retention rates across multiple days, using similar cohort analysis.

3. **LeetCode 1126: Active Businesses**  
   Finding businesses with activity above average uses similar conditional aggregation patterns.

The core pattern is: **Use conditional aggregation (`CASE` inside `COUNT`/`SUM`) to create multiple metrics from a single table scan, then combine them with arithmetic.**

## Key Takeaways

1. **Conditional aggregation is powerful**: You can compute multiple related metrics in a single query pass using `CASE` statements inside aggregate functions.

2. **Think in sets, not sequences**: For "has both A and B" problems, think about set intersection rather than temporal sequence (unless the problem specifically requires ordering).

3. **Always handle edge cases**: Division by zero, NULL values, and empty result sets are common pitfalls in analytics queries. Use `NULLIF`, `COALESCE`, or `CASE` to handle them gracefully.

[Practice this problem on CodeJeet](/problem/analyze-subscription-conversion)
