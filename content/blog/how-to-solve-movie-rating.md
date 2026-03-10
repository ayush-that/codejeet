---
title: "How to Solve Movie Rating — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Movie Rating. Medium difficulty, 42.8% acceptance rate. Topics: Database."
date: "2028-02-26"
category: "dsa-patterns"
tags: ["movie-rating", "database", "medium"]
---

# How to Solve Movie Rating

This problem asks us to find the movie with the highest average rating in February 2020 and the user with the most movie ratings. The challenge comes from needing to handle two separate queries and combine them with a UNION ALL, while properly filtering by date and handling ties. What makes this interesting is that it's not just about writing one complex query, but about structuring two independent queries correctly and understanding how to handle edge cases like multiple movies/users with the same rating/count.

## Visual Walkthrough

Let's walk through a small example. Suppose we have these tables:

**Movies:**

```
movie_id | title
1        | Avengers
2        | Titanic
3        | Inception
```

**Users:**

```
user_id | name
1       | Alice
2       | Bob
3       | Carol
```

**MovieRating:**

```
movie_id | user_id | rating | created_at
1        | 1       | 3      | 2020-02-10
1        | 2       | 4      | 2020-02-15
2        | 1       | 5      | 2020-02-20
2        | 3       | 4      | 2020-03-01  ← Not in February!
3        | 2       | 2      | 2020-02-05
3        | 3       | 2      | 2020-02-08
```

**Step 1: Find highest average rating in February 2020**

- Avengers (movie_id=1): (3+4)/2 = 3.5 average
- Titanic (movie_id=2): Only 5/1 = 5 average (Carol's rating is in March)
- Inception (movie_id=3): (2+2)/2 = 2 average
- Highest average is Titanic with 5.0

**Step 2: Find user with most ratings in February 2020**

- Alice (user_id=1): 2 ratings (Avengers, Titanic)
- Bob (user_id=2): 2 ratings (Avengers, Inception)
- Carol (user_id=3): 1 rating (Inception only - Titanic rating was in March)
- Both Alice and Bob have 2 ratings, so we need alphabetical order: Alice comes first

**Final result:**

```
results
Alice
Titanic
```

## Brute Force Approach

A naive approach might try to do everything in one query or use inefficient subqueries. For example, someone might try:

1. First find all February 2020 ratings with a subquery
2. Then try to calculate averages and counts in the same query
3. Use ORDER BY with LIMIT 1 without handling ties properly

The problem with this approach is that it doesn't properly handle the requirement to return the movie with the **lowest title alphabetically** when there's a tie in average rating, or the user with the **lowest name alphabetically** when there's a tie in rating count. A brute force solution might use multiple passes through the data or inefficient joins.

## Optimized Approach

The key insight is that we need to solve two independent problems and combine them:

1. **Highest average rating query**: We need to filter by February 2020, calculate averages, find the maximum average, and handle ties by picking the movie with the lowest title alphabetically.
2. **Most active user query**: We need to count ratings per user in February 2020, find the maximum count, and handle ties by picking the user with the lowest name alphabetically.

The optimal approach uses:

- **Filtering with WHERE**: Use `MONTH(created_at) = 2 AND YEAR(created_at) = 2020` or `created_at BETWEEN '2020-02-01' AND '2020-02-29'`
- **Aggregation with GROUP BY**: Group by movie_id for averages, group by user_id for counts
- **Sorting with ORDER BY**: Sort by average rating DESC, title ASC for movies; sort by count DESC, name ASC for users
- **LIMIT 1**: Get only the top result from each query
- **UNION ALL**: Combine the two independent results

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for sorting | Space: O(n) for intermediate results
(
    -- First query: Find the user with the most ratings in February 2020
    SELECT u.name AS results
    FROM Users u
    JOIN MovieRating mr ON u.user_id = mr.user_id
    WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
    GROUP BY u.user_id, u.name
    ORDER BY COUNT(*) DESC, u.name ASC
    LIMIT 1
)
UNION ALL
(
    -- Second query: Find the movie with the highest average rating in February 2020
    SELECT m.title AS results
    FROM Movies m
    JOIN MovieRating mr ON m.movie_id = mr.movie_id
    WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
    GROUP BY m.movie_id, m.title
    ORDER BY AVG(mr.rating) DESC, m.title ASC
    LIMIT 1
);
```

```sql
-- Alternative solution using MONTH() and YEAR() functions
-- Time: O(n log n) for sorting | Space: O(n) for intermediate results
(
    -- Query 1: User with most ratings
    SELECT u.name AS results
    FROM Users u
    INNER JOIN MovieRating mr ON u.user_id = mr.user_id
    WHERE MONTH(mr.created_at) = 2 AND YEAR(mr.created_at) = 2020
    GROUP BY u.user_id, u.name
    ORDER BY COUNT(mr.rating) DESC, u.name ASC
    LIMIT 1
)
UNION ALL
(
    -- Query 2: Movie with highest average rating
    SELECT m.title AS results
    FROM Movies m
    INNER JOIN MovieRating mr ON m.movie_id = mr.movie_id
    WHERE MONTH(mr.created_at) = 2 AND YEAR(mr.created_at) = 2020
    GROUP BY m.movie_id, m.title
    ORDER BY AVG(mr.rating) DESC, m.title ASC
    LIMIT 1
);
```

</div>

**Line-by-line explanation:**

1. **First query (users):**
   - `FROM Users u JOIN MovieRating mr ON u.user_id = mr.user_id`: Join Users with MovieRating to get user names with their ratings
   - `WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'`: Filter to only February 2020 ratings
   - `GROUP BY u.user_id, u.name`: Group by user to count their ratings
   - `ORDER BY COUNT(*) DESC, u.name ASC`: Sort by rating count (highest first), then by name alphabetically (for ties)
   - `LIMIT 1`: Take only the top result

2. **Second query (movies):**
   - `FROM Movies m JOIN MovieRating mr ON m.movie_id = mr.movie_id`: Join Movies with MovieRating to get movie titles with their ratings
   - `WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'`: Filter to only February 2020 ratings
   - `GROUP BY m.movie_id, m.title`: Group by movie to calculate average rating
   - `ORDER BY AVG(mr.rating) DESC, m.title ASC`: Sort by average rating (highest first), then by title alphabetically (for ties)
   - `LIMIT 1`: Take only the top result

3. **UNION ALL:** Combines the two independent queries into a single result set

## Complexity Analysis

**Time Complexity:** O(n log n) in the worst case, where n is the number of rows in MovieRating

- Filtering with WHERE: O(n) to scan all ratings
- GROUP BY operations: O(n) to process groups
- ORDER BY operations: O(n log n) for sorting the results
- The dominant factor is the sorting operation for ordering by rating averages/counts

**Space Complexity:** O(n) in the worst case

- Intermediate results from GROUP BY: O(k) where k is the number of distinct movies/users
- Sorting operations: O(n) for temporary storage during sorting
- The UNION ALL result: O(2) = O(1) since we only return 2 rows

## Common Mistakes

1. **Forgetting to filter by February 2020:** This is the most common mistake. Candidates might calculate averages/counts over all time instead of just February 2020. Always double-check your WHERE clause.

2. **Not handling ties correctly:** When multiple movies have the same average rating or multiple users have the same rating count, you must return the one with the lowest alphabetical name/title. Forgetting the secondary ORDER BY clause (title ASC or name ASC) will fail test cases with ties.

3. **Using UNION instead of UNION ALL:** UNION removes duplicates, which isn't necessary here since we're getting one user and one movie (they can't be the same). UNION ALL is more efficient as it doesn't check for duplicates.

4. **Incorrect date filtering:** Using `MONTH(created_at) = 2` without checking the year would include all February ratings from any year. You need both month and year filters, or use the BETWEEN approach.

## When You'll See This Pattern

This problem combines several common SQL patterns:

1. **Aggregation with GROUP BY and ORDER BY:** Similar to problems like "Department Top Three Salaries" (LeetCode 185) where you need to rank within groups.

2. **Date filtering:** Problems like "User Activity for the Past 30 Days" (LeetCode 1141) require similar date range filtering techniques.

3. **Handling ties with secondary sorting:** This pattern appears in many ranking problems where you need a tie-breaker condition, similar to "Rank Scores" (LeetCode 178).

4. **Combining independent queries with UNION:** Problems like "Combine Two Tables" variations often use UNION/UNION ALL to merge results from different logical queries.

## Key Takeaways

1. **Break complex problems into independent parts:** When a problem asks for multiple unrelated statistics, solve each part separately with its own query, then combine them with UNION ALL.

2. **Always consider tie-breaking conditions:** When using ORDER BY with LIMIT 1 and there could be ties, add secondary sorting criteria to ensure deterministic results.

3. **Date filtering requires precision:** When filtering by specific time periods, be explicit about both the start and end dates or use both MONTH() and YEAR() functions to avoid including data from wrong years.

[Practice this problem on CodeJeet](/problem/movie-rating)
