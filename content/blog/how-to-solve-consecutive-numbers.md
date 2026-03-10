---
title: "How to Solve Consecutive Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Consecutive Numbers. Medium difficulty, 47.9% acceptance rate. Topics: Database."
date: "2027-01-08"
category: "dsa-patterns"
tags: ["consecutive-numbers", "database", "medium"]
---

# How to Solve Consecutive Numbers

This problem asks us to find all numbers that appear at least three times consecutively in the `Logs` table. The challenge comes from the fact that we need to compare rows in a specific order (by their `id` values) to determine if the same number appears in three consecutive rows, even though SQL tables are inherently unordered sets of data.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Sample Logs table:**

```
id | num
---|-----
1  | 1
2  | 1
3  | 1
4  | 2
5  | 1
6  | 2
7  | 2
8  | 2
```

**Step-by-step reasoning:**

1. We need to check if the same number appears in three consecutive rows
2. For row with id=1 (num=1): Check id=2 (num=1) and id=3 (num=1) → all three are 1 ✓
3. For row with id=2 (num=1): Check id=3 (num=1) and id=4 (num=2) → not all same ✗
4. For row with id=3 (num=1): Check id=4 (num=2) and id=5 (num=1) → not all same ✗
5. For row with id=4 (num=2): Check id=5 (num=1) and id=6 (num=2) → not all same ✗
6. For row with id=5 (num=1): Check id=6 (num=2) and id=7 (num=2) → not all same ✗
7. For row with id=6 (num=2): Check id=7 (num=2) and id=8 (num=2) → all three are 2 ✓

**Result:** Numbers 1 and 2 appear consecutively at least three times.

The key insight is that we need to look at each row along with the next two rows to check if they all have the same number.

## Brute Force Approach

A naive approach would be to use multiple self-joins to compare each row with the next two rows:

```sql
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l1.id = l2.id - 1
JOIN Logs l3 ON l1.id = l3.id - 2
WHERE l1.num = l2.num AND l2.num = l3.num;
```

**Why this is problematic:**

1. **Assumes consecutive IDs:** This assumes IDs are consecutive integers with no gaps. The problem states `id` is auto-incrementing, but real-world data might have gaps.
2. **Multiple self-joins:** For large tables, joining the same table three times creates O(n³) complexity in the worst case.
3. **Not truly checking consecutive rows:** This checks rows where IDs differ by exactly 1 and 2, but "consecutive" should mean "next in sequence" regardless of ID values.

While this might work for the specific test cases, it's not a robust solution and doesn't demonstrate understanding of window functions, which is what interviewers typically expect for this problem.

## Optimized Approach

The optimal solution uses **window functions** to solve this problem efficiently and correctly. Here's the step-by-step reasoning:

1. **We need to identify consecutive rows:** In SQL, "consecutive" means rows that come one after another when ordered by `id`. We can use the `ROW_NUMBER()` window function to assign a sequential number to each row when ordered by `id`.

2. **The key insight:** If we subtract `ROW_NUMBER()` from `id` for rows with the same `num`, consecutive rows with the same number will have the same difference. Let's see why:
   - For consecutive rows with the same number, both `id` and `ROW_NUMBER()` increase by 1, so their difference stays constant
   - When the number changes, the difference changes

3. **Example with our data:**

   ```
   id | num | row_num | id - row_num
   ---|-----|---------|-------------
   1  | 1   | 1       | 0
   2  | 1   | 2       | 0
   3  | 1   | 3       | 0
   4  | 2   | 4       | 0  ← Wait, this is also 0!
   ```

   This doesn't work because different numbers can have the same difference. We need to partition by `num` first.

4. **Correct approach:** Use `ROW_NUMBER() OVER (PARTITION BY num ORDER BY id)`. This resets the counter when `num` changes:

   ```
   id | num | row_num_partitioned | id - row_num_partitioned
   ---|-----|---------------------|--------------------------
   1  | 1   | 1                   | 0
   2  | 1   | 2                   | 0
   3  | 1   | 3                   | 0
   4  | 2   | 1                   | 3  ← Different!
   5  | 1   | 4                   | 1  ← Different from first group of 1s!
   ```

5. **Grouping consecutive numbers:** Now rows with the same `num` and same `id - row_num_partitioned` are consecutive. We can group by both `num` and this difference, then count how many are in each group.

## Optimal Solution

<div class="code-group">

```sql
-- Time: O(n log n) for sorting, Space: O(n) for window function
WITH NumberedLogs AS (
    SELECT
        id,
        num,
        -- Assign row numbers within each num group ordered by id
        -- This resets to 1 when num changes
        ROW_NUMBER() OVER (PARTITION BY num ORDER BY id) as row_num
    FROM Logs
),
GroupedConsecutive AS (
    SELECT
        num,
        -- id - row_num creates a unique identifier for consecutive sequences
        -- For consecutive rows with same num: id increases by 1, row_num increases by 1
        -- So id - row_num stays constant for the entire consecutive sequence
        id - row_num as group_id
    FROM NumberedLogs
),
ConsecutiveCounts AS (
    SELECT
        num,
        group_id,
        -- Count how many rows are in each consecutive sequence
        COUNT(*) as consecutive_count
    FROM GroupedConsecutive
    GROUP BY num, group_id
    -- Only keep sequences with at least 3 consecutive occurrences
    HAVING COUNT(*) >= 3
)
-- Select distinct numbers that have at least one sequence of 3+ consecutive occurrences
SELECT DISTINCT num as ConsecutiveNums
FROM ConsecutiveCounts;
```

```sql
-- Alternative, more concise solution using the same logic
SELECT DISTINCT num as ConsecutiveNums
FROM (
    SELECT
        num,
        -- Create groups of consecutive same numbers
        id - ROW_NUMBER() OVER (PARTITION BY num ORDER BY id) as group_id
    FROM Logs
) t
GROUP BY num, group_id
HAVING COUNT(*) >= 3;
```

</div>

**Line-by-line explanation of the concise solution:**

1. `ROW_NUMBER() OVER (PARTITION BY num ORDER BY id)` assigns sequential numbers to rows with the same `num`, ordered by `id`
2. `id - row_number` creates a grouping key that stays constant for consecutive rows with the same `num`
3. `GROUP BY num, group_id` groups rows into consecutive sequences of the same number
4. `HAVING COUNT(*) >= 3` filters to only keep sequences with 3 or more consecutive occurrences
5. `SELECT DISTINCT num` returns the unique numbers that have such sequences

## Complexity Analysis

**Time Complexity:** O(n log n)

- The `ROW_NUMBER()` window function requires sorting the data, which is O(n log n) in most SQL implementations
- The grouping operation is O(n) after sorting
- Overall dominated by the sorting operation

**Space Complexity:** O(n)

- Window functions typically create temporary structures proportional to the input size
- The grouping operation also requires space for intermediate results

## Common Mistakes

1. **Using LAG/LEAD without handling all cases:**

   ```sql
   -- This misses sequences longer than 3
   SELECT DISTINCT num
   FROM (
       SELECT num,
              LAG(num, 1) OVER (ORDER BY id) as prev1,
              LAG(num, 2) OVER (ORDER BY id) as prev2
       FROM Logs
   ) t
   WHERE num = prev1 AND num = prev2;
   ```

   This only finds exactly 3 consecutive, not "at least 3". A sequence of 4 would be counted twice, but `DISTINCT` hides this.

2. **Assuming consecutive IDs without gaps:**

   ```sql
   -- Wrong if IDs have gaps
   SELECT DISTINCT l1.num
   FROM Logs l1, Logs l2, Logs l3
   WHERE l1.id = l2.id - 1
     AND l2.id = l3.id - 1
     AND l1.num = l2.num
     AND l2.num = l3.num;
   ```

   This fails if IDs aren't consecutive (e.g., 1, 3, 5).

3. **Forgetting DISTINCT when numbers appear in multiple sequences:**
   If number 1 appears in sequences [1,1,1] and later [1,1,1,1], without `DISTINCT` it would appear twice in results.

4. **Incorrect GROUP BY logic:**
   Grouping by just `num` won't separate non-consecutive occurrences of the same number.

## When You'll See This Pattern

This "difference trick" (using `id - ROW_NUMBER()` to identify consecutive sequences) appears in several SQL problems:

1. **LeetCode 180: Consecutive Numbers** - This exact problem
2. **LeetCode 601: Human Traffic of Stadium** - Find periods where stadium has at least 100 people for 3+ consecutive days
3. **LeetCode 1454: Active Users** - Find users active for 5+ consecutive days
4. **Any problem requiring identification of consecutive sequences** - Whether it's consecutive days, consecutive numbers, or consecutive events

The pattern is: when you need to find consecutive occurrences, use `ROW_NUMBER() OVER (PARTITION BY grouping_column ORDER BY sequence_column)` and then subtract from the sequence column to create a grouping key.

## Key Takeaways

1. **Window functions are essential for sequence analysis:** `ROW_NUMBER()`, `LAG()`, `LEAD()` are crucial tools for comparing rows in a specific order.

2. **The "difference trick" identifies consecutive sequences:** For finding consecutive rows with the same value, calculate `sequence_column - ROW_NUMBER() OVER (PARTITION BY value_column ORDER BY sequence_column)`. Rows with the same result are consecutive.

3. **Think in terms of grouping, not just comparison:** Instead of comparing each row with its neighbors, create groups of consecutive rows and then analyze the groups.

[Practice this problem on CodeJeet](/problem/consecutive-numbers)
