---
title: "How to Solve Rising Temperature — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Rising Temperature. Easy difficulty, 51.0% acceptance rate. Topics: Database."
date: "2026-07-26"
category: "dsa-patterns"
tags: ["rising-temperature", "database", "easy"]
---

# How to Solve Rising Temperature

This problem asks us to find all dates where the temperature was higher than the previous day's temperature. While conceptually simple, it's tricky because we need to compare each row with its chronological predecessor in a SQL table. The challenge lies in properly joining the table with itself based on date sequencing rather than simple equality.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this weather data:

| id  | recordDate | temperature |
| --- | ---------- | ----------- |
| 1   | 2023-01-01 | 30          |
| 2   | 2023-01-02 | 28          |
| 3   | 2023-01-03 | 32          |
| 4   | 2023-01-04 | 31          |
| 5   | 2023-01-05 | 33          |

We need to compare each day with the day immediately before it:

- Day 2 (28°): Compare with Day 1 (30°) → 28 < 30 → No
- Day 3 (32°): Compare with Day 2 (28°) → 32 > 28 → Yes
- Day 4 (31°): Compare with Day 3 (32°) → 31 < 32 → No
- Day 5 (33°): Compare with Day 4 (31°) → 33 > 31 → Yes

So our result should include Day 3 (id 3) and Day 5 (id 5). Notice we can't simply sort by date and compare consecutive rows in the result set—we need to ensure we're comparing each date with exactly one day prior, even if there are gaps in the date sequence.

## Brute Force Approach

A naive approach might try to compare each date with every other date, checking if the other date is exactly one day earlier. This would require a self-join with a condition that checks date differences:

```sql
SELECT w1.id
FROM Weather w1, Weather w2
WHERE DATEDIFF(w1.recordDate, w2.recordDate) = 1
AND w1.temperature > w2.temperature;
```

While this works logically, it's inefficient because it creates a Cartesian product of the table with itself (O(n²) comparisons). For a table with 1,000 rows, this creates 1,000,000 comparisons. The database must check every possible pair of dates to find those exactly one day apart.

The key insight is that we need a more efficient way to pair each date with exactly its predecessor. We can't rely on row order in the result set, and we can't assume dates are consecutive without gaps.

## Optimal Solution

The optimal solution uses a self-join with the `DATEDIFF()` function (or equivalent date arithmetic) to pair each row with the row exactly one day before it. This approach is efficient because it only compares relevant pairs rather than all possible pairs.

<div class="code-group">

```sql
-- Time: O(n log n) for the join | Space: O(n) for intermediate result
SELECT w1.id
FROM Weather w1
-- Join with the weather table to find the previous day's record
INNER JOIN Weather w2
    -- Match each date with exactly one day before it
    ON DATEDIFF(w1.recordDate, w2.recordDate) = 1
-- Filter for dates where temperature increased
WHERE w1.temperature > w2.temperature;
```

```sql
-- Alternative using DATE_ADD for databases that support it
-- Time: O(n log n) | Space: O(n)
SELECT w1.id
FROM Weather w1
INNER JOIN Weather w2
    -- Match w2 as the day before w1
    ON w2.recordDate = DATE_SUB(w1.recordDate, INTERVAL 1 DAY)
WHERE w1.temperature > w2.temperature;
```

```sql
-- PostgreSQL/MySQL alternative using INTERVAL arithmetic
-- Time: O(n log n) | Space: O(n)
SELECT w1.id
FROM Weather w1
INNER JOIN Weather w2
    ON w2.recordDate = w1.recordDate - INTERVAL '1 day'
WHERE w1.temperature > w2.temperature;
```

</div>

**Step-by-step explanation:**

1. **Self-join the Weather table**: We create two aliases `w1` (current day) and `w2` (previous day) from the same table. This allows us to compare each row with other rows in the same table.

2. **Join condition with `DATEDIFF()`**: The key is `DATEDIFF(w1.recordDate, w2.recordDate) = 1`. This ensures we only pair dates that are exactly one day apart. `DATEDIFF(date1, date2)` returns the number of days between date1 and date2, so `= 1` means date1 is exactly one day after date2.

3. **Temperature comparison**: After establishing the correct date pairing, we simply check if `w1.temperature > w2.temperature`.

4. **Select only the ID**: We return just the `id` of days where the temperature rose, as required by the problem.

**Why this is optimal**: Instead of comparing every pair (O(n²)), we use the database's indexed join capabilities. Most databases can optimize this join efficiently, especially if there's an index on `recordDate`.

## Complexity Analysis

**Time Complexity**: O(n log n) in the average case. The self-join operation typically uses a hash join or sort-merge join algorithm. With an index on `recordDate`, this could approach O(n), but we conservatively estimate O(n log n) for the join operation.

**Space Complexity**: O(n) for the intermediate join result. The database needs to store the paired rows before applying the WHERE filter.

The complexity comes from:

- Scanning the Weather table twice (once for w1, once for w2): O(n) each
- Joining based on date difference: O(n log n) for the join algorithm
- Filtering results: O(m) where m is the number of joined pairs

## Common Mistakes

1. **Using `LAG()` without considering date gaps**: Some candidates try:

   ```sql
   SELECT id FROM (
     SELECT id, temperature, LAG(temperature) OVER (ORDER BY recordDate) as prev_temp
     FROM Weather
   ) t
   WHERE temperature > prev_temp;
   ```

   This fails if dates aren't consecutive! `LAG()` looks at the previous row in the result order, not the previous calendar day.

2. **Incorrect date arithmetic**: Using `recordDate - 1` instead of proper date functions. This treats dates as numbers and fails for month/year boundaries.

3. **Forgetting that dates might not be consecutive**: Assuming that ordering by date and comparing with the previous row is sufficient. If there's a gap (like missing 2023-01-03), the comparison will be wrong.

4. **Using `>` instead of `>=` for temperature**: The problem asks for "higher than," not "higher than or equal to." Using `>=` would include days where temperature stayed the same.

5. **Not handling the first day**: While not explicitly needed here, in variations of this problem, you might need to handle that the first day has no previous day to compare with.

## When You'll See This Pattern

This pattern of comparing each row with a related row in the same table appears frequently in SQL problems:

1. **Consecutive Numbers (LeetCode 180)**: Find all numbers that appear at least three times consecutively. Similar self-join approach with row number differences.

2. **Department Top Three Salaries (LeetCode 185)**: Compare each employee's salary with others in the same department using window functions or self-joins.

3. **Exchange Seats (LeetCode 626)**: Swap every two consecutive students, requiring pairing of adjacent rows.

4. **Game Play Analysis (LeetCode 511, 512)**: Analyze sequences of events for each player, often requiring comparison with previous events.

The core technique is using self-joins with conditions that establish specific relationships between rows (consecutive dates, adjacent seats, etc.) rather than simple equality.

## Key Takeaways

1. **Self-joins are powerful for row-to-row comparisons**: When you need to compare each row with other rows in the same table based on a specific relationship (like "one day before"), a self-join is often the right tool.

2. **Date functions matter for chronological analysis**: Use database-specific date functions (`DATEDIFF`, `DATE_ADD`, `INTERVAL`) rather than assuming dates are consecutive or treating them as simple integers.

3. **Consider data gaps in sequence problems**: When working with temporal data, always ask: "Are the dates guaranteed to be consecutive?" If not, you can't rely on row order alone.

4. **Test edge cases**: First/last records, duplicate dates, temperature equalities, and date gaps are all important test cases for this type of problem.

[Practice this problem on CodeJeet](/problem/rising-temperature)
