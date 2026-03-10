---
title: "How to Solve Last Person to Fit in the Bus — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Last Person to Fit in the Bus. Medium difficulty, 69.0% acceptance rate. Topics: Database."
date: "2027-11-23"
category: "dsa-patterns"
tags: ["last-person-to-fit-in-the-bus", "database", "medium"]
---

# How to Solve Last Person to Fit in the Bus

This problem asks us to find the name of the last person who can board a bus without exceeding its 1000 kg weight limit, given that people board in the order of their `turn` value. The tricky part is that we need to simulate a cumulative weight process and find the exact point where adding the next person would exceed the limit, then return the last person who successfully boarded.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Queue` table contains:

| person_id | person_name | weight | turn |
| --------- | ----------- | ------ | ---- |
| 5         | Alice       | 250    | 1    |
| 4         | Bob         | 175    | 5    |
| 3         | Alex        | 350    | 2    |
| 6         | John Cena   | 400    | 3    |
| 1         | Winston     | 500    | 6    |
| 2         | Marie       | 200    | 4    |

**Step 1: Sort by turn** (people board in this order):

1. Alice (250 kg, turn 1)
2. Alex (350 kg, turn 2)
3. John Cena (400 kg, turn 3)
4. Marie (200 kg, turn 4)
5. Bob (175 kg, turn 5)
6. Winston (500 kg, turn 6)

**Step 2: Calculate cumulative weight as each person boards:**

- After Alice: 250 kg (under 1000)
- After Alex: 250 + 350 = 600 kg (under 1000)
- After John Cena: 600 + 400 = 1000 kg (exactly at limit)
- If we try to add Marie: 1000 + 200 = 1200 kg (exceeds 1000)

**Step 3: Identify the last person who fits:**
John Cena is the last person who can board without exceeding the 1000 kg limit.

The key insight is that we need to find the person with the highest `turn` value where the cumulative weight up to and including that person is ≤ 1000, but the cumulative weight including the next person would exceed 1000.

## Brute Force Approach

A naive approach would be to:

1. Sort the table by `turn`
2. Iterate through each person
3. For each person, calculate the cumulative weight from the beginning up to that person
4. Stop when cumulative weight exceeds 1000
5. Return the previous person's name

The problem with this approach is efficiency. For each person at position `i`, we're summing weights from person 1 to person `i`, which gives us O(n²) time complexity in the worst case. While this might work for small datasets, it's inefficient for larger ones.

## Optimized Approach

The key insight is that we need a **running total** (cumulative sum) of weights as we process people in order of their `turn`. Instead of recalculating the sum from scratch for each person, we can maintain a running total.

Here's the step-by-step reasoning:

1. **Sort by turn**: People must board in the order specified by their `turn` value
2. **Calculate cumulative weight**: As we process each person in sorted order, add their weight to a running total
3. **Find the threshold**: We need the person with the highest `turn` where cumulative weight ≤ 1000
4. **SQL implementation**: We can use window functions (available in MySQL 8.0+, PostgreSQL, etc.) to efficiently calculate running totals

The window function approach allows us to calculate the cumulative sum in O(n) time after sorting, which is much more efficient than the brute force O(n²) approach.

## Optimal Solution

The optimal solution uses a window function to calculate the running total of weights ordered by `turn`. We then filter to find all people where the running total is ≤ 1000, and select the one with the maximum `turn` value.

<div class="code-group">

```sql
-- Time: O(n log n) for sorting, O(n) for window function | Space: O(n) for temporary results
SELECT person_name
FROM (
    -- Subquery to calculate running total for each person
    SELECT
        person_id,
        person_name,
        weight,
        turn,
        -- Calculate cumulative sum of weights ordered by turn
        SUM(weight) OVER (ORDER BY turn) AS cumulative_weight
    FROM Queue
) AS weighted_queue
-- Filter to only include people where cumulative weight <= 1000
WHERE cumulative_weight <= 1000
-- Get the person with the highest turn (last to board successfully)
ORDER BY turn DESC
LIMIT 1;
```

```sql
-- Alternative approach using a common table expression (CTE)
-- Time: O(n log n) for sorting, O(n) for window function | Space: O(n) for temporary results
WITH CumulativeWeights AS (
    SELECT
        person_name,
        turn,
        SUM(weight) OVER (ORDER BY turn) AS running_total
    FROM Queue
)
SELECT person_name
FROM CumulativeWeights
WHERE running_total <= 1000
ORDER BY turn DESC
LIMIT 1;
```

```sql
-- For databases without window functions (like older MySQL versions)
-- Time: O(n²) in worst case | Space: O(1) additional space
SELECT q1.person_name
FROM Queue q1
JOIN Queue q2 ON q1.turn >= q2.turn  -- Join with all people with turn <= current person
GROUP BY q1.person_id, q1.person_name, q1.turn
HAVING SUM(q2.weight) <= 1000  -- Sum weights of all people up to and including current
ORDER BY q1.turn DESC
LIMIT 1;
```

</div>

**Code Explanation:**

1. **Window Function**: `SUM(weight) OVER (ORDER BY turn)` calculates the running total of weights as we process people in order of their `turn`. This is the key optimization.
2. **Filtering**: `WHERE cumulative_weight <= 1000` keeps only people who can board without exceeding the limit.
3. **Final Selection**: `ORDER BY turn DESC LIMIT 1` gives us the person with the highest `turn` value (last to board) among those who fit.

## Complexity Analysis

**Time Complexity:**

- Sorting: O(n log n) where n is the number of people in the queue
- Window function calculation: O(n) to compute running totals
- Filtering and sorting results: O(n log n) in worst case
- **Overall: O(n log n)** dominated by the sorting operation

**Space Complexity:**

- O(n) for storing intermediate results with cumulative weights
- The window function may use additional memory proportional to the window size

## Common Mistakes

1. **Forgetting to sort by `turn`**: People must board in the order specified by their `turn` value. If you don't sort by `turn`, you'll get incorrect results.

2. **Incorrect cumulative sum logic**: Using `SUM(weight) OVER ()` without `ORDER BY turn` gives the total sum of all weights, not a running total. The `ORDER BY` clause in the window function is crucial.

3. **Off-by-one errors in the limit**: Some candidates might use `LIMIT 1` without `ORDER BY turn DESC`, which would give the first person who fits, not the last. We need the person with the highest `turn` value.

4. **Not handling edge cases**:
   - What if all people fit? Then we should return the person with the highest `turn`.
   - What if the first person exceeds 1000 kg? Then no one can board, but the problem guarantees at least one person can board.
   - What if multiple people have the same cumulative weight exactly at 1000? The `turn` order determines who boards first.

## When You'll See This Pattern

This problem uses **cumulative sums/running totals**, a common pattern in database problems and algorithmic challenges:

1. **Running Total for Different Genders** - Similar cumulative sum calculation but partitioned by gender
2. **The Number of Seniors and Juniors to Join the Company** - Uses cumulative sums to allocate budget across employees
3. **Find Cumulative Salary of an Employee** - Calculating running totals of salaries over months
4. **Game Play Analysis** - Analyzing consecutive days of gameplay often uses window functions with running counts

The pattern appears whenever you need to:

- Calculate running totals or moving averages
- Find points where a cumulative metric crosses a threshold
- Analyze sequences or ordered events

## Key Takeaways

1. **Window functions are powerful for running calculations**: The `SUM() OVER (ORDER BY ...)` pattern efficiently computes cumulative sums without self-joins or correlated subqueries.

2. **Order matters in sequence problems**: When dealing with turns, timestamps, or any sequential data, always sort by the sequence indicator before performing calculations.

3. **Look for threshold-crossing patterns**: Many problems ask for "the last X before Y happens" - these often involve calculating running totals and finding where they cross a limit.

Related problems: [Running Total for Different Genders](/problem/running-total-for-different-genders), [The Number of Seniors and Juniors to Join the Company](/problem/the-number-of-seniors-and-juniors-to-join-the-company), [The Number of Seniors and Juniors to Join the Company II](/problem/the-number-of-seniors-and-juniors-to-join-the-company-ii)
