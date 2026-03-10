---
title: "How to Solve Find COVID Recovery Patients — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find COVID Recovery Patients. Medium difficulty, 41.2% acceptance rate. Topics: Database."
date: "2026-05-13"
category: "dsa-patterns"
tags: ["find-covid-recovery-patients", "database", "medium"]
---

## How to Solve Find COVID Recovery Patients

This problem asks us to identify patients who have recovered from COVID-19 based on their condition records. The tricky part is that we need to find patients who had COVID-19 (conditions containing "COVID-19") but don't have any subsequent conditions indicating they're still affected. This requires careful filtering and comparison of dates to ensure we only return patients who have truly recovered.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Patients Table:**

```
patient_id | patient_name | age
-----------|--------------|-----
1          | Alice        | 35
2          | Bob          | 42
3          | Charlie      | 28
```

**Conditions Table:**

```
patient_id | condition_name | date_diagnosed
-----------|----------------|---------------
1          | COVID-19       | 2023-01-10
1          | Fatigue        | 2023-02-15
2          | COVID-19       | 2023-03-01
2          | Pneumonia      | 2023-03-20
3          | Flu            | 2023-01-05
```

**Step-by-step reasoning:**

1. First, we identify patients who had COVID-19: Patients 1 and 2
2. For each COVID-19 patient, we need to check if they have any condition diagnosed AFTER their COVID-19 diagnosis
3. Patient 1: COVID-19 on 2023-01-10, Fatigue on 2023-02-15 → Has a condition after COVID-19
4. Patient 2: COVID-19 on 2023-03-01, Pneumonia on 2023-03-20 → Has a condition after COVID-19
5. Patient 3: Never had COVID-19 → Not considered

In this example, no patients have recovered because both COVID-19 patients have subsequent conditions. A recovered patient would be someone who had COVID-19 but has no conditions diagnosed after that date.

## Brute Force Approach

A naive approach would be to:

1. First find all patients who had COVID-19
2. For each COVID-19 patient, scan through ALL their conditions to check if any were diagnosed after their COVID-19 date
3. Keep only patients with no subsequent conditions

The brute force SQL might look like:

```sql
SELECT DISTINCT p.patient_id, p.patient_name, p.age
FROM patients p
WHERE p.patient_id IN (
    SELECT patient_id
    FROM conditions
    WHERE condition_name LIKE '%COVID-19%'
)
AND p.patient_id NOT IN (
    SELECT c1.patient_id
    FROM conditions c1
    JOIN conditions c2 ON c1.patient_id = c2.patient_id
    WHERE c1.condition_name LIKE '%COVID-19%'
    AND c2.date_diagnosed > c1.date_diagnosed
)
```

**Why this is inefficient:**

- The double subquery approach creates multiple scans of the conditions table
- The self-join in the second subquery can be expensive for large datasets
- It doesn't efficiently handle patients with multiple COVID-19 diagnoses
- The `LIKE '%COVID-19%'` pattern matching is applied repeatedly

## Optimized Approach

The key insight is that we need to find the **latest COVID-19 diagnosis date** for each patient, then check if that patient has **any condition diagnosed after that date**. If they don't have any conditions after their last COVID-19 diagnosis, they've recovered.

**Step-by-step reasoning:**

1. First, identify each patient's most recent COVID-19 diagnosis date
2. Then, for each patient, check if they have ANY condition diagnosed after that date
3. Patients with no conditions after their last COVID-19 date have recovered

We can optimize this by:

- Using window functions or subqueries to find the maximum COVID-19 date per patient
- Using a LEFT JOIN with a condition to find subsequent diagnoses
- Filtering for patients where no subsequent condition exists (NULL check)

## Optimal Solution

Here's the complete, well-commented solution:

<div class="code-group">

```sql
-- Time: O(n log n) for sorting and grouping | Space: O(n) for intermediate results
SELECT
    p.patient_id,
    p.patient_name,
    p.age
FROM patients p
-- Step 1: Join with a subquery to get each patient's latest COVID-19 diagnosis date
INNER JOIN (
    SELECT
        patient_id,
        MAX(date_diagnosed) as last_covid_date
    FROM conditions
    -- Find all COVID-19 related conditions (case-insensitive search)
    WHERE LOWER(condition_name) LIKE '%covid-19%'
    GROUP BY patient_id
) covid ON p.patient_id = covid.patient_id
-- Step 2: Left join with conditions to find any diagnosis after COVID recovery
LEFT JOIN conditions c ON p.patient_id = c.patient_id
    -- This join condition finds conditions diagnosed AFTER the last COVID-19 date
    AND c.date_diagnosed > covid.last_covid_date
-- Step 3: Filter for patients with NO conditions after their last COVID-19 date
WHERE c.patient_id IS NULL
ORDER BY p.patient_id;
```

```sql
-- Alternative solution using NOT EXISTS (often more readable)
-- Time: O(n²) in worst case but optimized by database | Space: O(n)
SELECT
    p.patient_id,
    p.patient_name,
    p.age
FROM patients p
WHERE EXISTS (
    -- Patient must have had COVID-19 at some point
    SELECT 1
    FROM conditions c1
    WHERE c1.patient_id = p.patient_id
    AND LOWER(c1.condition_name) LIKE '%covid-19%'
)
AND NOT EXISTS (
    -- Patient must NOT have any condition after their last COVID-19
    SELECT 1
    FROM conditions c2
    WHERE c2.patient_id = p.patient_id
    AND c2.date_diagnosed > (
        -- Find this patient's last COVID-19 diagnosis date
        SELECT MAX(date_diagnosed)
        FROM conditions c3
        WHERE c3.patient_id = p.patient_id
        AND LOWER(c3.condition_name) LIKE '%covid-19%'
    )
)
ORDER BY p.patient_id;
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n) in the optimal solution**

- Finding the maximum COVID-19 date per patient requires grouping/sorting: O(n log n)
- The JOIN operations are typically O(n) with proper indexing
- The LIKE pattern matching adds O(k) per row where k is string length

**Space Complexity: O(n)**

- The subquery creating the `covid` temporary table stores up to n rows
- Intermediate JOIN results may require additional memory
- Final result set is at most O(n) in size

**With proper indexing:**

- Index on `conditions(patient_id, date_diagnosed)` would optimize the date comparisons
- Index on `conditions(condition_name)` would speed up the COVID-19 filtering
- Composite index on `conditions(patient_id, condition_name, date_diagnosed)` would be ideal

## Common Mistakes

1. **Forgetting case-insensitive search**: Using `condition_name LIKE '%COVID-19%'` instead of `LOWER(condition_name) LIKE '%covid-19%'` could miss records with different casing.

2. **Not handling multiple COVID-19 diagnoses**: Checking for ANY condition after ANY COVID-19 date instead of the LATEST COVID-19 date. A patient could have:
   - COVID-19 on 2023-01-01
   - Recovery period with no conditions
   - COVID-19 again on 2023-06-01
   - We should use the 2023-06-01 date, not 2023-01-01

3. **Incorrect NULL handling in the LEFT JOIN**: Forgetting the `WHERE c.patient_id IS NULL` condition would return ALL COVID-19 patients instead of only recovered ones.

4. **Missing patients with no conditions at all**: Some solutions might exclude patients who only have a COVID-19 diagnosis and no other conditions. These patients SHOULD be included as recovered.

## When You'll See This Pattern

This "find records with no subsequent matching records" pattern appears in many database problems:

1. **LeetCode 197: Rising Temperature** - Find dates with temperatures higher than the previous day. Similar date comparison logic.

2. **LeetCode 185: Department Top Three Salaries** - Uses similar subquery patterns to compare records within groups.

3. **LeetCode 601: Human Traffic of Stadium** - Finding consecutive records based on date/sequence comparisons.

4. **Employee retention analysis** - Finding employees with no activity after a certain event (similar to "no conditions after COVID").

The core technique is using self-joins or subqueries with date/sequence comparisons to find gaps or endpoints in temporal data.

## Key Takeaways

1. **For "no subsequent events" queries**, the LEFT JOIN + NULL check pattern is often the most efficient: join on the condition that would find subsequent events, then filter where the join fails (IS NULL).

2. **Always consider the latest occurrence** when dealing with temporal data. Use MAX() with GROUP BY or window functions like ROW_NUMBER() to find most recent events.

3. **Test edge cases thoroughly**: Patients with multiple COVID-19 diagnoses, patients with no conditions at all, and patients with same-day conditions all need special consideration.

4. **Use LOWER() for case-insensitive text matching** in SQL unless the problem specifies exact casing.

[Practice this problem on CodeJeet](/problem/find-covid-recovery-patients)
