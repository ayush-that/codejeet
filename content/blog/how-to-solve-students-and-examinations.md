---
title: "How to Solve Students and Examinations — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Students and Examinations. Easy difficulty, 61.0% acceptance rate. Topics: Database."
date: "2027-01-14"
category: "dsa-patterns"
tags: ["students-and-examinations", "database", "easy"]
---

# How to Solve Students and Examinations

This problem asks us to generate a report showing how many exams each student attended for each subject. The challenge comes from the fact that we need to handle students who may not have taken any exams for certain subjects, requiring careful handling of NULL values and proper joins. The interesting part is creating a complete matrix of all student-subject combinations before counting exam participations.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

**Students table:**
| student_id | student_name |
|------------|--------------|
| 1 | Alice |
| 2 | Bob |

**Subjects table:**
| subject_name |
|--------------|
| Math |
| Physics |

**Examinations table:**
| student_id | subject_name |
|------------|--------------|
| 1 | Math |
| 1 | Physics |
| 1 | Math |
| 1 | Math |
| 2 | Math |

Step-by-step reasoning:

1. First, we need all possible combinations of students and subjects. This gives us:
   - Alice × Math
   - Alice × Physics
   - Bob × Math
   - Bob × Physics

2. Next, we need to count how many times each student took each exam. Looking at the Examinations table:
   - Alice took Math 3 times
   - Alice took Physics 1 time
   - Bob took Math 1 time
   - Bob took Physics 0 times

3. The final report should show:
   | student_id | student_name | subject_name | attended_exams |
   |------------|--------------|--------------|----------------|
   | 1 | Alice | Math | 3 |
   | 1 | Alice | Physics | 1 |
   | 2 | Bob | Math | 1 |
   | 2 | Bob | Physics | 0 |

Notice how Bob has 0 for Physics even though he never took that exam. This is why we need the cross join first - to ensure all student-subject combinations appear in the result.

## Brute Force Approach

A naive approach might try to solve this by:

1. Getting all students
2. For each student, getting all subjects
3. For each student-subject pair, counting exam records

In SQL, this would require multiple queries or complex procedural logic. The problem with this approach is efficiency - it would require multiple passes through the data and potentially O(n³) operations if implemented poorly.

More importantly, the real issue is correctness: without creating the complete matrix first, we might miss student-subject pairs where the count should be zero. A naive LEFT JOIN from Students to Examinations would miss subjects that students never took.

## Optimal Solution

The key insight is that we need a **CROSS JOIN** between Students and Subjects to create all possible combinations, then LEFT JOIN to Examinations to count participations. The COUNT() function with GROUP BY will handle the aggregation, and we need to use COUNT(exam.subject_name) instead of COUNT(\*) to count only actual exam records (not NULLs).

<div class="code-group">

```sql
-- Time: O(m*n) for the cross join, where m = students, n = subjects
-- Space: O(m*n) for storing the result set
SELECT
    s.student_id,
    s.student_name,
    sub.subject_name,
    -- Count only non-NULL exam records for this student-subject pair
    COUNT(e.subject_name) AS attended_exams
FROM
    -- Step 1: Create all possible student-subject combinations
    Students s
    CROSS JOIN Subjects sub
    -- Step 2: Left join to include exam records where they exist
    LEFT JOIN Examinations e
        ON s.student_id = e.student_id
        AND sub.subject_name = e.subject_name
-- Step 3: Group by all three identifying columns to get counts per student-subject
GROUP BY
    s.student_id,
    s.student_name,
    sub.subject_name
-- Step 4: Order by student_id then subject_name for clean output
ORDER BY
    s.student_id,
    sub.subject_name;
```

</div>

**Line-by-line explanation:**

1. **SELECT s.student_id, s.student_name, sub.subject_name** - We want these three columns in our final report
2. **COUNT(e.subject_name) AS attended_exams** - Critical: We count e.subject_name (not COUNT(\*)) because when there's no matching exam, e.subject_name will be NULL, and COUNT() ignores NULLs. This gives us 0 for student-subject pairs with no exams.
3. **FROM Students s CROSS JOIN Subjects sub** - This creates the complete matrix of all possible combinations. Every student gets paired with every subject.
4. **LEFT JOIN Examinations e ON s.student_id = e.student_id AND sub.subject_name = e.subject_name** - We join on BOTH conditions: student_id AND subject_name. This ensures we only match exam records for the specific student AND subject.
5. **GROUP BY s.student_id, s.student_name, sub.subject_name** - We group by all three columns because each unique combination represents one row in our final report.
6. **ORDER BY s.student_id, sub.subject_name** - Standard ordering for readable output.

## Complexity Analysis

**Time Complexity:** O(m × n) where m is the number of students and n is the number of subjects. The CROSS JOIN creates m × n rows, and the subsequent operations (JOIN, GROUP BY) process these rows. In database terms, this is efficient because it uses set operations rather than nested loops.

**Space Complexity:** O(m × n) for storing the intermediate result of the cross join and the final result set. The database needs to materialize all student-subject combinations before performing the aggregation.

## Common Mistakes

1. **Using INNER JOIN instead of LEFT JOIN**: This is the most common mistake. If you use INNER JOIN between the cross join result and Examinations, you'll lose all student-subject pairs with zero exams. The result will only show combinations where at least one exam was taken.

2. **Counting with COUNT(\*) instead of COUNT(e.subject_name)**: COUNT(\*) counts all rows, including those where the LEFT JOIN resulted in NULLs. This would give 1 for student-subject pairs with no exams instead of 0. Always count a specific column from the right table in a LEFT JOIN when you want to exclude NULLs.

3. **Forgetting to GROUP BY all non-aggregated columns**: In standard SQL, all columns in the SELECT that aren't part of aggregate functions must appear in the GROUP BY clause. Forgetting student_name or subject_name in the GROUP BY would cause an error or incorrect grouping.

4. **Incorrect JOIN conditions**: Joining only on student_id (forgetting subject_name) would incorrectly count all exams a student took, regardless of subject. Each student would show the same count for every subject.

## When You'll See This Pattern

This pattern of using CROSS JOIN to create a complete matrix appears in several database problems:

1. **LeetCode 1978: Employees Whose Manager Left the Company** - Similar need to compare all employees with certain conditions.
2. **LeetCode 180: Consecutive Numbers** - Uses self-joins to create combinations of rows for comparison.
3. **LeetCode 184: Department Highest Salary** - Requires creating complete department-employee combinations before filtering.

The core technique is recognizing when you need **all possible combinations** of two sets before applying filters or aggregations. This often comes up in reporting scenarios where you need to show zeros for missing data rather than omitting those rows entirely.

## Key Takeaways

1. **Use CROSS JOIN for complete combinations**: When you need every item from set A paired with every item from set B, CROSS JOIN is your tool. This is essential for reports that should show zeros for missing relationships.

2. **COUNT(column) vs COUNT(\*) in LEFT JOINs**: Remember that COUNT(column) ignores NULLs while COUNT(\*) counts all rows. In LEFT JOIN scenarios where you want to count only matching records, always count a column from the right table.

3. **Think in sets, not loops**: SQL is designed for set operations. Instead of thinking "for each student, for each subject," think "all students cross all subjects." This mental shift helps write more efficient, declarative SQL.

[Practice this problem on CodeJeet](/problem/students-and-examinations)
