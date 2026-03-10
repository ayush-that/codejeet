---
title: "How to Solve Human Traffic of Stadium — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Human Traffic of Stadium. Hard difficulty, 50.8% acceptance rate. Topics: Database."
date: "2026-06-11"
category: "dsa-patterns"
tags: ["human-traffic-of-stadium", "database", "hard"]
---

# How to Solve Human Traffic of Stadium

This problem asks us to find all consecutive rows in the Stadium table where at least 100 people visited for three or more consecutive days. What makes this tricky is that we need to identify consecutive sequences based on dates, not just row order, and the sequences can be longer than exactly 3 days. This is a classic gaps-and-islands problem in SQL where we need to group consecutive records.

## Visual Walkthrough

Let's trace through a concrete example:

**Sample Data:**

```
id | visit_date | people
---|------------|-------
1  | 2017-01-01 | 10
2  | 2017-01-02 | 109
3  | 2017-01-03 | 150
4  | 2017-01-04 | 99
5  | 2017-01-05 | 145
6  | 2017-01-06 | 1455
7  | 2017-01-07 | 199
8  | 2017-01-08 | 188
```

**Step-by-step reasoning:**

1. First, we filter to only rows where `people >= 100`: rows 2, 3, 5, 6, 7, 8
2. Now we need to find consecutive sequences. Row 2 and 3 are consecutive dates (Jan 2-3), but then row 4 is skipped (only 99 people), so that's a 2-day sequence - too short.
3. Row 5, 6, 7, 8 are all consecutive dates (Jan 5-8) with >= 100 people each day.
4. This gives us one valid sequence of length 4 (rows 5-8).
5. We need to return all rows from this sequence: rows 5, 6, 7, 8.

The challenge is that dates might have gaps, so we can't just check if the next row has >= 100 people. We need to identify true date-based consecutive sequences.

## Brute Force Approach

A naive approach would be to check every possible starting point and see how many consecutive days after it have >= 100 people:

1. For each row with people >= 100, start counting forward
2. Check if the next date exists and has people >= 100
3. Continue until the sequence breaks
4. If we counted 3 or more consecutive days, include all those rows

The problem with this approach in SQL is that it would require complex self-joins or window functions anyway, and it would be O(n²) in the worst case. More importantly, it's difficult to implement correctly in pure SQL without window functions or recursive CTEs.

What many candidates try first is something like:

```sql
SELECT s1.*
FROM Stadium s1, Stadium s2, Stadium s3
WHERE s1.people >= 100
  AND s2.people >= 100
  AND s3.people >= 100
  AND (
    (s1.id = s2.id - 1 AND s1.id = s3.id - 2) OR
    (s1.id = s2.id - 1 AND s1.id = s3.id + 1) OR
    -- ... more permutations
  )
```

This approach has several issues:

1. It only finds exactly 3 consecutive days, not 3 or more
2. It's messy with many OR conditions
3. It assumes IDs are consecutive (they might not be)
4. It doesn't handle sequences longer than 3 properly

## Optimized Approach

The key insight is that this is a classic "gaps and islands" problem. We need to:

1. First filter to only rows with people >= 100
2. Assign a "group number" to each consecutive sequence
3. Count how many rows are in each group
4. Return all rows from groups with count >= 3

**How to assign group numbers:**
We can use the fact that for consecutive dates, the difference between `visit_date` and a sequence number will be constant. For example:

- If we number the filtered rows 1, 2, 3, 4...
- And convert dates to sequential numbers (like days since epoch)
- Then `date_rank - row_number` will be the same for consecutive dates

**Example:**

```
Original:        After filtering >= 100:
id | date        | people | date_num | rn | date_num - rn
2  | 2017-01-02  | 109    | 2        | 1  | 1
3  | 2017-01-03  | 150    | 3        | 2  | 1
5  | 2017-01-05  | 145    | 5        | 3  | 2
6  | 2017-01-06  | 1455   | 6        | 4  | 2
7  | 2017-01-07  | 199    | 7        | 5  | 2
8  | 2017-01-08  | 188    | 8        | 6  | 2
```

Notice that rows 2-3 have `date_num - rn = 1` (one group), and rows 5-8 have `date_num - rn = 2` (another group). The group with value 2 has 4 rows, so it qualifies.

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for sorting | Space: O(n) for intermediate tables
WITH filtered_stadium AS (
    -- Step 1: Filter to only rows with 100+ people
    SELECT
        id,
        visit_date,
        people
    FROM Stadium
    WHERE people >= 100
),
ranked_stadium AS (
    -- Step 2: Assign row numbers and calculate grouping key
    SELECT
        id,
        visit_date,
        people,
        -- Convert date to a sequential number for calculation
        DATEDIFF(visit_date, '2000-01-01') AS date_num,
        -- Assign row number ordered by date
        ROW_NUMBER() OVER (ORDER BY visit_date) AS rn
    FROM filtered_stadium
),
grouped_stadium AS (
    -- Step 3: Calculate group identifier for consecutive sequences
    SELECT
        id,
        visit_date,
        people,
        -- The key insight: date_num - rn is constant for consecutive dates
        -- This creates a unique identifier for each "island" of consecutive dates
        (date_num - rn) AS group_id
    FROM ranked_stadium
),
valid_groups AS (
    -- Step 4: Find groups with 3 or more consecutive days
    SELECT
        group_id
    FROM grouped_stadium
    GROUP BY group_id
    -- Only keep groups with at least 3 consecutive days
    HAVING COUNT(*) >= 3
)
-- Step 5: Return all rows from valid groups, ordered by visit_date
SELECT
    id,
    visit_date,
    people
FROM grouped_stadium
WHERE group_id IN (SELECT group_id FROM valid_groups)
ORDER BY visit_date;
```

</div>

**Alternative, more concise solution using window functions:**

<div class="code-group">

```sql
-- Time: O(n log n) | Space: O(n)
WITH consecutive_groups AS (
    SELECT
        id,
        visit_date,
        people,
        -- Count how many consecutive rows before/after have people >= 100
        -- Using LAG and LEAD to check previous and next rows
        CASE
            WHEN people >= 100
                 AND LAG(people, 1) OVER (ORDER BY visit_date) >= 100
                 AND LAG(people, 2) OVER (ORDER BY visit_date) >= 100
            THEN 1
            WHEN people >= 100
                 AND LAG(people, 1) OVER (ORDER BY visit_date) >= 100
                 AND LEAD(people, 1) OVER (ORDER BY visit_date) >= 100
            THEN 1
            WHEN people >= 100
                 AND LEAD(people, 1) OVER (ORDER BY visit_date) >= 100
                 AND LEAD(people, 2) OVER (ORDER BY visit_date) >= 100
            THEN 1
            ELSE 0
        END AS is_consecutive
    FROM Stadium
)
SELECT
    id,
    visit_date,
    people
FROM consecutive_groups
WHERE is_consecutive = 1
ORDER BY visit_date;
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- The main cost is sorting the data for the window functions (ROW_NUMBER, LAG, LEAD)
- Filtering (WHERE) and grouping (GROUP BY) are O(n)
- In most database implementations, sorting dominates for large n

**Space Complexity:** O(n)

- We create intermediate tables (CTEs) with all filtered rows
- Window functions typically require storing the sorted data
- Final output is at most O(n)

## Common Mistakes

1. **Assuming IDs are consecutive:** The problem states IDs are sequential but dates determine consecutiveness. Always use dates, not IDs, to check consecutiveness.

2. **Only checking exactly 3 days:** Many solutions use complex self-joins that only find exactly 3 consecutive days, not 3 or more. The problem says "three or more consecutive days."

3. **Missing middle rows in sequences:** When using the LAG/LEAD approach, if you only check patterns like (current, previous, previous-1), you'll miss rows that are in the middle of longer sequences. That's why we need to check all three patterns.

4. **Forgetting to order results:** The problem requires results ordered by visit_date in ascending order. Always check output requirements.

5. **Not handling date gaps properly:** Using date arithmetic (DATEDIFF) is more reliable than assuming dates increment by 1 day each time.

## When You'll See This Pattern

This "gaps and islands" pattern appears in many SQL problems:

1. **Consecutive Numbers (LeetCode #180):** Find all numbers that appear at least three times consecutively. Same pattern but with numbers instead of dates.

2. **Department Top Three Salaries (LeetCode #185):** Uses similar window function techniques with DENSE_RANK() to find top N in each group.

3. **Game Play Analysis (LeetCode #550):** Finding consecutive login days uses the same date_num - rn technique.

4. **Find the Start and End of Continuous Ranges:** A common interview question where you need to find the start and end of continuous sequences (like 1,2,3,5,6,8 → ranges 1-3, 5-6, 8-8).

The core technique of using `value - row_number` to group consecutive items applies whenever you need to find sequences where some value increases predictably.

## Key Takeaways

1. **Gaps and islands problems** often use the pattern `value - ROW_NUMBER()` to create group identifiers for consecutive sequences. This works because for consecutive items, this difference remains constant.

2. **Window functions (LAG, LEAD, ROW_NUMBER)** are essential for comparing rows with their neighbors without complex self-joins. They make the code cleaner and often more efficient.

3. **Always consider edge cases:** What if there are gaps in dates? What if sequences are longer than the minimum? What if the table is empty? Test with various scenarios.

4. **Multiple approaches exist:** The date_num - rn method is more general and handles sequences of any length. The LAG/LEAD method is simpler for fixed-length sequences but harder to extend.

[Practice this problem on CodeJeet](/problem/human-traffic-of-stadium)
