---
title: "How to Solve Rank Scores — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rank Scores. Medium difficulty, 67.2% acceptance rate. Topics: Database."
date: "2027-02-10"
category: "dsa-patterns"
tags: ["rank-scores", "database", "medium"]
---

# How to Solve Rank Scores

This problem asks us to rank scores in a database table, where higher scores get better ranks, and ties receive the same rank. The tricky part is that ranks should be **dense** — after a tie, the next rank shouldn't skip numbers. For example, if two scores tie for 1st place, the next score should be 2nd, not 3rd.

## Visual Walkthrough

Let's trace through a concrete example. Suppose our `Scores` table contains:

| id  | score |
| --- | ----- |
| 1   | 3.50  |
| 2   | 3.65  |
| 3   | 4.00  |
| 4   | 3.85  |
| 5   | 4.00  |
| 6   | 3.65  |

We need to output scores in descending order with their ranks:

1. **Sort scores descending**: [4.00, 4.00, 3.85, 3.65, 3.65, 3.50]
2. **Assign ranks**:
   - First score (4.00): rank 1
   - Second score (4.00): also rank 1 (tie)
   - Third score (3.85): rank 2 (next number after 1)
   - Fourth score (3.65): rank 3
   - Fifth score (3.65): also rank 3 (tie)
   - Sixth score (3.50): rank 4

Final output:
| score | rank |
|-------|------|
| 4.00 | 1 |
| 4.00 | 1 |
| 3.85 | 2 |
| 3.65 | 3 |
| 3.65 | 3 |
| 3.50 | 4 |

Notice how ranks are **dense** — no gaps between rank numbers.

## Brute Force Approach

A naive approach would be to use a subquery for each row: count how many **distinct** scores are greater than or equal to the current score. This gives us the dense rank.

```sql
SELECT
    s1.score,
    (SELECT COUNT(DISTINCT s2.score)
     FROM Scores s2
     WHERE s2.score >= s1.score) AS rank
FROM Scores s1
ORDER BY s1.score DESC;
```

**Why this is inefficient**: For each of the N rows in the table, we run a subquery that scans the entire table. This results in O(N²) time complexity. With large datasets, this becomes prohibitively slow.

## Optimized Approach

The key insight is that we can compute dense ranks in a **single pass** over sorted data using window functions. SQL provides `DENSE_RANK()` specifically for this purpose, which:

1. Orders rows by score descending
2. Assigns ranks where ties get the same rank
3. Ensures no gaps in ranking sequence

If window functions weren't available, we could simulate dense ranking by:

1. Sorting scores descending
2. Using a variable to track the current rank
3. Incrementing the rank only when we encounter a new, lower score

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for sorting | Space: O(n) for result set
SELECT
    score,                       -- Select the score column
    DENSE_RANK() OVER (          -- Apply dense ranking window function
        ORDER BY score DESC      -- Order scores from highest to lowest
    ) AS rank                    -- Name the result column 'rank'
FROM Scores                      -- From the Scores table
ORDER BY score DESC;             -- Final ordering for output
```

```sql
-- Alternative solution without window functions (for MySQL versions < 8.0)
-- Time: O(n log n) | Space: O(n)
SELECT
    s1.score,
    -- Count distinct scores that are >= current score
    (SELECT COUNT(DISTINCT s2.score)
     FROM Scores s2
     WHERE s2.score >= s1.score) AS rank
FROM Scores s1
ORDER BY s1.score DESC;
```

```sql
-- Another alternative using variables (MySQL specific)
-- Time: O(n log n) | Space: O(n)
SELECT
    score,
    @rank := @rank + (score != @prev_score) AS rank,
    @prev_score := score
FROM Scores, (SELECT @rank := 0, @prev_score := NULL) init
ORDER BY score DESC;
```

</div>

**Line-by-line explanation**:

1. `SELECT score` — We need to output the original scores
2. `DENSE_RANK() OVER (ORDER BY score DESC)` — This is the core of the solution:
   - `OVER (ORDER BY score DESC)` creates a window ordered by score descending
   - `DENSE_RANK()` assigns ranks where ties get same rank, with no gaps
3. `AS rank` — Names the computed column
4. `FROM Scores` — Specifies the source table
5. `ORDER BY score DESC` — Final ordering to match expected output format

## Complexity Analysis

**Time Complexity**: O(n log n)

- The dominant operation is sorting the scores for the window function. Most databases use efficient sorting algorithms (quicksort, mergesort) with O(n log n) complexity.
- The dense rank computation itself is O(n) after sorting.

**Space Complexity**: O(n)

- We need to store the sorted result set.
- The window function may use additional temporary storage proportional to the input size.

## Common Mistakes

1. **Using `RANK()` instead of `DENSE_RANK()`**:
   - `RANK()` leaves gaps after ties (e.g., two 1st places would make the next rank 3)
   - Always verify whether the problem requires dense or regular ranking

2. **Forgetting the `DESC` in ordering**:
   - Ranks typically start at 1 for the highest score
   - Without `DESC`, the lowest score would get rank 1

3. **Not handling NULL scores**:
   - While not specified in this problem, in real scenarios NULL values need special handling
   - `DENSE_RANK()` treats NULL as the lowest value by default

4. **Incorrect variable initialization in MySQL workaround**:
   - When using session variables, ensure they're properly initialized
   - The order of operations matters: compute rank before updating previous score

## When You'll See This Pattern

This dense ranking pattern appears in various data analysis scenarios:

1. **Department Top Three Salaries (LeetCode #185)**: Find employees who earn the top three salaries in each department, requiring ranking within partitions.

2. **Nth Highest Salary (LeetCode #177)**: Use `DENSE_RANK()` to find the nth distinct salary.

3. **Game Play Analysis (LeetCode #534)**: Rank player activities by date to analyze sequences.

The common thread is **relative positioning within ordered data** — whenever you need to answer "what's the position of this value compared to others?" consider ranking functions.

## Key Takeaways

1. **Window functions are powerful for ranking problems**: `DENSE_RANK()`, `RANK()`, and `ROW_NUMBER()` solve different ranking variations efficiently.

2. **Understand the ranking type needed**:
   - `DENSE_RANK()`: Ties get same rank, no gaps (used here)
   - `RANK()`: Ties get same rank, but gaps after ties
   - `ROW_NUMBER()`: Always sequential, even with ties

3. **SQL optimization matters**: Window functions (O(n log n)) are vastly more efficient than correlated subqueries (O(n²)) for ranking operations.

[Practice this problem on CodeJeet](/problem/rank-scores)
