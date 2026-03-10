---
title: "How to Solve Find Students Who Improved — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Students Who Improved. Medium difficulty, 48.0% acceptance rate. Topics: Database."
date: "2029-09-09"
category: "dsa-patterns"
tags: ["find-students-who-improved", "database", "medium"]
---

## How to Solve "Find Students Who Improved"

This problem asks us to identify students who improved their scores in a subject between two consecutive exams. The tricky part is that we need to compare scores across different exam dates for the same student and subject, requiring careful handling of date ordering and self-joins. What makes this interesting is that it's a real-world analytics problem disguised as a SQL puzzle—you need to think about temporal comparisons and grouping simultaneously.

## Visual Walkthrough

Let's walk through a small example. Suppose our `Scores` table contains:

| student_id | subject | score | exam_date  |
| ---------- | ------- | ----- | ---------- |
| 101        | Math    | 80    | 2024-01-15 |
| 101        | Math    | 85    | 2024-02-15 |
| 101        | English | 90    | 2024-01-15 |
| 101        | English | 88    | 2024-02-15 |
| 102        | Math    | 70    | 2024-01-15 |
| 102        | Math    | 75    | 2024-02-15 |

**Step-by-step reasoning:**

1. For student 101 in Math: First exam score = 80, second exam score = 85 → improved (85 > 80)
2. For student 101 in English: First exam score = 90, second exam score = 88 → did NOT improve (88 < 90)
3. For student 102 in Math: First exam score = 70, second exam score = 75 → improved (75 > 70)

The expected output would be:
| student_id | subject |
|------------|---------|
| 101 | Math |
| 102 | Math |

Notice we only care about consecutive exams—if a student took three exams in Math, we'd compare the first two, then the second two, etc. The key insight is we need to pair each exam with the next exam for the same student and subject.

## Brute Force Approach

A naive approach would be to manually compare every possible pair of exams for each student-subject combination:

```sql
SELECT DISTINCT s1.student_id, s1.subject
FROM Scores s1
JOIN Scores s2
    ON s1.student_id = s2.student_id
    AND s1.subject = s2.subject
    AND s1.exam_date < s2.exam_date
WHERE s2.score > s1.score
AND NOT EXISTS (
    SELECT 1 FROM Scores s3
    WHERE s3.student_id = s1.student_id
    AND s3.subject = s1.subject
    AND s1.exam_date < s3.exam_date
    AND s3.exam_date < s2.exam_date
)
```

**Why this is problematic:**

1. **Performance:** The triple self-join creates O(n²) complexity with large datasets
2. **Complexity:** The NOT EXISTS subquery is hard to read and maintain
3. **Incorrect for multiple improvements:** This only finds pairs where the second exam is better than the first, but doesn't properly handle cases where there are more than two exams

The brute force approach demonstrates the core challenge: we need to compare consecutive rows ordered by date within each student-subject group.

## Optimized Approach

The key insight is to use **window functions** to access previous or next exam scores without complex self-joins. Specifically:

1. **Use LAG() or LEAD():** These window functions let us access data from previous or next rows within an ordered partition
2. **Partition by student and subject:** We want to compare scores within the same student and subject only
3. **Order by exam_date:** To ensure we're comparing consecutive exams chronologically

**Step-by-step reasoning:**

1. For each row (exam), we need to know the score from the previous exam for that same student and subject
2. If there's no previous exam (it's their first), we can't determine improvement
3. If the current score > previous score, then the student improved between those two consecutive exams
4. We need to return distinct student-subject pairs where at least one improvement occurred

The window function approach is elegant because it processes each row exactly once while having access to related data, avoiding the expensive self-joins of the brute force method.

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for sorting | Space: O(n) for window function storage
SELECT DISTINCT student_id, subject
FROM (
    -- Step 1: For each exam, get the previous exam's score for the same student and subject
    SELECT
        student_id,
        subject,
        score,
        -- LAG() gets the score from the previous row in the ordered partition
        -- The partition ensures we only compare within same student and subject
        -- ORDER BY ensures chronological comparison
        LAG(score) OVER (
            PARTITION BY student_id, subject
            ORDER BY exam_date
        ) AS prev_score
    FROM Scores
) AS score_comparison
-- Step 2: Filter for rows where current score > previous score
-- This indicates improvement between consecutive exams
WHERE score > prev_score
-- Step 3: Get distinct student-subject pairs
-- A student-subject pair might appear multiple times if they improved multiple times
-- DISTINCT ensures each pair appears only once in the final result
ORDER BY student_id, subject;
```

```sql
-- Alternative using LEAD() function
-- Time: O(n log n) | Space: O(n)
SELECT DISTINCT student_id, subject
FROM (
    SELECT
        student_id,
        subject,
        score,
        -- LEAD() looks ahead to the next exam's score
        LEAD(score) OVER (
            PARTITION BY student_id, subject
            ORDER BY exam_date
        ) AS next_score
    FROM Scores
) AS score_comparison
-- Compare current score with next score
WHERE next_score > score
ORDER BY student_id, subject;
```

</div>

**Line-by-line explanation:**

- `LAG(score) OVER (PARTITION BY student_id, subject ORDER BY exam_date)`: This is the core of the solution. It creates a window for each student-subject combination, orders exams by date, and retrieves the score from the previous row (previous exam).
- `WHERE score > prev_score`: Filters only the rows where the current exam score is higher than the previous exam score, indicating improvement.
- `SELECT DISTINCT student_id, subject`: Since a student might improve multiple times in a subject, we use DISTINCT to return each student-subject pair only once.
- The subquery is necessary because window functions can't be directly used in WHERE clauses in most SQL dialects.

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant cost is sorting the data for the window function. The `PARTITION BY student_id, subject ORDER BY exam_date` requires sorting all rows, which is O(n log n) in the worst case.
- The DISTINCT operation adds O(n) time but is dominated by the sorting.

**Space Complexity: O(n)**

- The window function needs to store the partitioned and ordered data, requiring O(n) additional space.
- The result set requires O(k) space where k is the number of student-subject pairs with improvements.

## Common Mistakes

1. **Forgetting to handle NULL previous scores:** When using LAG(), the first exam for each student-subject pair will have NULL as the previous score. The comparison `score > NULL` returns NULL (not TRUE), so these rows are correctly excluded. However, some candidates try to handle this with COALESCE, which could lead to incorrect results.

2. **Not using DISTINCT when needed:** If a student improves multiple times in a subject (e.g., scores 70→80→90), the query without DISTINCT would return the same student-subject pair multiple times. Always check if the problem asks for "students who improved" (distinct) versus "each time a student improved."

3. **Incorrect ordering in window function:** Using `ORDER BY exam_date DESC` instead of `ORDER BY exam_date ASC` would compare scores in reverse chronological order, giving incorrect results. Always verify the sort direction matches the problem requirement.

4. **Confusing LAG() and LEAD():** LAG() looks backward (previous row), LEAD() looks forward (next row). Both work for this problem, but you need to adjust the comparison accordingly. With LAG(), compare current > previous; with LEAD(), compare next > current.

## When You'll See This Pattern

This "compare consecutive rows within groups" pattern appears frequently in SQL interview problems:

1. **Rising Temperature (LeetCode 197):** Find dates where temperature was higher than the previous day. Same pattern: use LAG() to compare with previous row ordered by date.

2. **Consecutive Numbers (LeetCode 180):** Find numbers that appear at least three times consecutively. Uses similar window function logic with LAG() and LEAD() to check adjacent rows.

3. **Department Top Three Salaries (LeetCode 185):** Uses DENSE_RANK() window function to rank salaries within departments—another example of partitioning data into groups for analysis.

The common thread is using window functions (LAG, LEAD, RANK, etc.) with PARTITION BY to analyze data within logical groups without expensive self-joins.

## Key Takeaways

1. **Window functions are your friend for temporal comparisons:** When you need to compare a row with its neighbors (previous/next) within groups, LAG() and LEAD() are more efficient and readable than self-joins.

2. **Always consider the partition and order:** The power of window functions comes from correct partitioning (what groups to compare within) and ordering (what sequence to follow). Think carefully about both.

3. **Test edge cases:** What if a student has only one exam? What if scores are equal? What if dates aren't consecutive? Always test these scenarios—the window function approach handles them gracefully.

[Practice this problem on CodeJeet](/problem/find-students-who-improved)
