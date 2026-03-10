---
title: "How to Solve Number of Unique Subjects Taught by Each Teacher — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Unique Subjects Taught by Each Teacher. Easy difficulty, 89.2% acceptance rate. Topics: Database."
date: "2027-05-11"
category: "dsa-patterns"
tags: ["number-of-unique-subjects-taught-by-each-teacher", "database", "easy"]
---

# How to Solve "Number of Unique Subjects Taught by Each Teacher"

This is a straightforward SQL aggregation problem where we need to count the distinct subjects each teacher teaches. While simple, it tests your understanding of grouping, counting distinct values, and handling potential duplicates in the data. The tricky part isn't the complexity but recognizing that teachers might teach the same subject in different departments or have duplicate records, so we need `COUNT(DISTINCT ...)` rather than just `COUNT()`.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Teacher` table has these rows:

| teacher_id | subject_id | dept_id |
| ---------- | ---------- | ------- | ------------------------------------ |
| 1          | 2          | 3       |
| 1          | 2          | 4       | ← Same subject, different department |
| 1          | 3          | 3       |
| 2          | 1          | 1       |
| 2          | 1          | 1       | ← Duplicate record                   |
| 2          | 2          | 1       |

**Step-by-step reasoning:**

1. Teacher 1 teaches subject 2 in department 3
2. Teacher 1 teaches subject 2 in department 4 → Same subject ID but different department
3. Teacher 1 teaches subject 3 in department 3
4. Teacher 2 teaches subject 1 in department 1
5. Teacher 2 teaches subject 1 in department 1 (duplicate)
6. Teacher 2 teaches subject 2 in department 1

If we just counted rows per teacher:

- Teacher 1: 3 rows
- Teacher 2: 3 rows

But that's wrong! We want **unique subjects** per teacher:

- Teacher 1: Subjects {2, 3} → 2 unique subjects
- Teacher 2: Subjects {1, 2} → 2 unique subjects (duplicate subject 1 only counts once)

The key insight: We need to count **distinct** subject_ids for each teacher, ignoring duplicates and ignoring department differences.

## Brute Force Approach

While there's no traditional "brute force" for SQL problems, a naive approach would be to first get all distinct teacher-subject pairs, then count them. Actually, that's exactly what we need to do! The "naive" mistake would be forgetting about distinct counting.

**What a candidate might try wrong:**

```sql
-- WRONG: Counts all rows, including duplicates
SELECT teacher_id, COUNT(subject_id) as cnt
FROM Teacher
GROUP BY teacher_id;
```

This would give us 3 for both teachers in our example, which is incorrect because:

1. Teacher 1 has subject 2 listed twice (different departments)
2. Teacher 2 has subject 1 listed twice (duplicate record)

The problem requires us to count each subject only once per teacher, regardless of how many times it appears or which departments it's taught in.

## Optimal Solution

The optimal solution is straightforward: group by `teacher_id` and count distinct `subject_id` values. The `COUNT(DISTINCT column)` function handles both duplicate records and the same subject taught in different departments.

<div class="code-group">

```sql
-- Time: O(n) for scanning the table | Space: O(n) for grouping results
SELECT
    teacher_id,                    -- Select the teacher identifier
    COUNT(DISTINCT subject_id) AS cnt  -- Count unique subjects for each teacher
FROM
    Teacher                        -- From the Teacher table
GROUP BY
    teacher_id;                    -- Group results by teacher
```

</div>

**Line-by-line explanation:**

1. `SELECT teacher_id` → We want one row per teacher in our result
2. `COUNT(DISTINCT subject_id) AS cnt` → For each teacher, count how many unique subject_ids they have. The `DISTINCT` keyword ensures we count each subject only once, even if it appears multiple times in different departments or as duplicates.
3. `FROM Teacher` → We're querying the Teacher table
4. `GROUP BY teacher_id` → Group all rows by teacher_id so the COUNT function operates on each teacher's records separately

## Complexity Analysis

**Time Complexity:** O(n)

- We need to scan the entire Teacher table once to process all rows
- The GROUP BY operation typically uses hashing or sorting, which is O(n) for scanning and grouping
- Counting distinct values within each group is also linear in the number of rows per group

**Space Complexity:** O(n) in the worst case

- If every row has a different teacher_id, we might need to store intermediate results for each teacher
- In practice, the database needs space to store the grouping keys and aggregation results
- The result set size is O(k) where k is the number of unique teachers

## Common Mistakes

1. **Forgetting DISTINCT in COUNT()**

   ```sql
   -- WRONG: Counts all subject entries, not unique subjects
   SELECT teacher_id, COUNT(subject_id) AS cnt FROM Teacher GROUP BY teacher_id;
   ```

   **Why it's wrong:** If a teacher teaches the same subject in multiple departments or has duplicate records, they'll be counted multiple times.
   **How to avoid:** Always ask yourself: "Do I want to count occurrences or unique values?" For "unique" anything, use `DISTINCT`.

2. **Including dept_id in the COUNT or SELECT incorrectly**

   ```sql
   -- WRONG: Trying to count distinct subject-department pairs
   SELECT teacher_id, COUNT(DISTINCT subject_id, dept_id) AS cnt FROM Teacher GROUP BY teacher_id;
   ```

   **Why it's wrong:** The problem asks for unique subjects, not unique subject-department combinations. A teacher teaching Math in both Science and Arts departments still teaches only one unique subject (Math).
   **How to avoid:** Read the problem carefully. It says "number of unique subjects" not "number of unique subject-department pairs."

3. **Overcomplicating with subqueries**

   ```sql
   -- Unnecessarily complex
   SELECT teacher_id, COUNT(*) AS cnt
   FROM (SELECT DISTINCT teacher_id, subject_id FROM Teacher) AS temp
   GROUP BY teacher_id;
   ```

   **Why it's suboptimal:** While correct, it creates an unnecessary temporary table. The `COUNT(DISTINCT ...)` in the main query is more efficient and readable.
   **How to avoid:** Remember that `COUNT(DISTINCT column)` exists and is designed exactly for this purpose.

4. **Forgetting the GROUP BY clause**
   ```sql
   -- WRONG: No grouping, will return only one row
   SELECT teacher_id, COUNT(DISTINCT subject_id) AS cnt FROM Teacher;
   ```
   **Why it's wrong:** Without GROUP BY, aggregate functions like COUNT operate on all rows, giving a single result for the entire table.
   **How to avoid:** If you want results per category (per teacher), you must use GROUP BY with the category column.

## When You'll See This Pattern

This pattern of "group and count distinct" appears frequently in database problems:

1. **"Number of Unique Subjects Taught by Each Teacher"** (this problem) - Group by teacher, count distinct subjects
2. **"Classes More Than 5 Students"** (LeetCode 596) - Group by class, count distinct students
3. **"Customer Placing the Largest Number of Orders"** (LeetCode 586) - Group by customer, count distinct orders
4. **"Big Countries"** (LeetCode 595) - While simpler, it uses similar filtering logic after aggregation

The core pattern is: When you need to aggregate data per category and count unique occurrences within each category, use `GROUP BY` with `COUNT(DISTINCT column)`.

## Key Takeaways

1. **`COUNT(DISTINCT column)` is different from `COUNT(column)`** - The former counts unique values, ignoring duplicates; the latter counts all non-null values, including duplicates. Always choose based on whether you need "how many times" vs "how many different."

2. **GROUP BY creates buckets** - Think of GROUP BY as putting rows into buckets based on the grouping column(s). All aggregate functions (COUNT, SUM, AVG, etc.) then operate within each bucket separately.

3. **Read the problem requirements carefully** - The difference between "subjects taught" and "unique subjects taught" is just one word but changes the entire solution. Similarly, watch for "different," "distinct," or "unique" in problem descriptions.

[Practice this problem on CodeJeet](/problem/number-of-unique-subjects-taught-by-each-teacher)
