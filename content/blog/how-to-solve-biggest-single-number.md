---
title: "How to Solve Biggest Single Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Biggest Single Number. Easy difficulty, 70.9% acceptance rate. Topics: Database."
date: "2027-04-21"
category: "dsa-patterns"
tags: ["biggest-single-number", "database", "easy"]
---

# How to Solve "Biggest Single Number"

This problem asks us to find the largest number that appears exactly once in a table that may contain duplicates. While it sounds straightforward, the challenge lies in handling SQL's NULL behavior when no such number exists. Many candidates forget that aggregate functions like MAX() return NULL when applied to an empty set, which is exactly what the problem expects when there's no single-occurrence number.

## Visual Walkthrough

Let's trace through a concrete example. Suppose our `MyNumbers` table contains these values:

```
num
---
8
8
3
3
1
4
4
5
```

**Step 1: Identify numbers that appear exactly once**
We need to find numbers with a count of 1. Looking at the data:

- 8 appears twice ❌
- 3 appears twice ❌
- 1 appears once ✅
- 4 appears twice ❌
- 5 appears once ✅

So our single-occurrence numbers are: 1 and 5.

**Step 2: Find the maximum among these**
Between 1 and 5, the maximum is 5.

**Step 3: Handle the case with no single-occurrence numbers**
What if our table only had duplicates? For example:

```
num
---
8
8
3
3
```

There are no numbers appearing exactly once, so our result should be NULL. This is a critical edge case that trips up many candidates.

## Brute Force Approach

A naive approach might try to solve this in multiple steps without proper aggregation:

1. First query to find all numbers
2. Second query to count occurrences of each
3. Third query to filter those with count = 1
4. Fourth query to find the maximum

While this conceptually works, it's inefficient and doesn't handle the NULL case properly. More importantly, in SQL problems, we're expected to write a single, elegant query that handles all cases correctly.

The real "brute force" mistake candidates make is forgetting to handle the NULL case. They might write:

```sql
SELECT MAX(num) AS num
FROM MyNumbers
GROUP BY num
HAVING COUNT(num) = 1
```

This seems correct, but what happens when there are no numbers with count = 1? The query returns an empty result set, not NULL. The problem specifically asks for NULL in that case.

## Optimal Solution

The optimal solution uses aggregation with a HAVING clause to filter groups, then applies MAX() to get the largest value. The key insight is that MAX() will return NULL when applied to an empty set, which satisfies the requirement.

<div class="code-group">

```sql
-- Time: O(n) for scanning the table | Space: O(n) for grouping
SELECT MAX(num) AS num
FROM (
    -- Step 1: Group by number to count occurrences
    SELECT num
    FROM MyNumbers
    GROUP BY num
    -- Step 2: Keep only numbers that appear exactly once
    HAVING COUNT(num) = 1
) AS single_numbers;
```

```sql
-- Alternative formulation using WITH clause (same complexity)
WITH single_numbers AS (
    SELECT num
    FROM MyNumbers
    GROUP BY num
    HAVING COUNT(num) = 1
)
SELECT MAX(num) AS num
FROM single_numbers;
```

```sql
-- Another approach using window functions
SELECT MAX(num) AS num
FROM (
    SELECT num, COUNT(*) OVER (PARTITION BY num) as cnt
    FROM MyNumbers
) t
WHERE cnt = 1;
```

</div>

**Line-by-line explanation:**

1. **`SELECT num FROM MyNumbers GROUP BY num`**: Groups all rows by their numeric value. This is necessary because we need to count how many times each number appears.

2. **`HAVING COUNT(num) = 1`**: Filters the groups to keep only those where the count is exactly 1. The HAVING clause works on aggregated results (unlike WHERE which works on individual rows).

3. **`SELECT MAX(num) FROM (...) AS single_numbers`**: Takes the maximum value from the filtered list. If the subquery returns no rows (empty set), MAX() returns NULL, which is exactly what we want.

## Complexity Analysis

**Time Complexity: O(n)**

- The database needs to scan the entire table once to build the groups
- Counting within each group happens during the scan
- Finding the maximum among the filtered numbers is O(k) where k ≤ n

**Space Complexity: O(n) in worst case**

- In the worst scenario where every number is unique, we need to store n groups
- In practice, with many duplicates, space usage is much less than n

The actual performance depends on the database engine's implementation of GROUP BY and HAVING, but conceptually we're doing a single pass through the data.

## Common Mistakes

1. **Forgetting the NULL case**: The most common error is not realizing that when no number appears exactly once, the result should be NULL, not an empty result set. Using MAX() on the filtered results automatically handles this.

2. **Using WHERE instead of HAVING**: Beginners often try `WHERE COUNT(num) = 1`, but aggregate functions can't be used in WHERE clauses. WHERE filters rows before aggregation, HAVING filters after aggregation.

3. **Not using a subquery or CTE**: Some candidates try to do everything in one SELECT: `SELECT MAX(num) FROM MyNumbers GROUP BY num HAVING COUNT(num) = 1`. This doesn't work because after GROUP BY, you're working with groups, not individual numbers.

4. **Misunderstanding the problem requirements**: Some think they need to find numbers that appear "at least once" rather than "exactly once." Read carefully: "biggest number which only appears once."

## When You'll See This Pattern

This problem combines several fundamental SQL patterns:

1. **Aggregation with filtering**: Similar to "Find Customer Referee" (LeetCode 584) where you use conditions on aggregated results.

2. **Handling empty results**: Like "Second Highest Salary" (LeetCode 176) where you need to return NULL when there's no second highest.

3. **Grouping with conditions**: Comparable to "Classes More Than 5 Students" (LeetCode 596) where you filter groups based on their size.

The core pattern is: "Find the extreme value (MAX/MIN) among items that meet a certain condition, and handle the case where no items meet the condition."

## Key Takeaways

1. **MAX() and MIN() return NULL for empty sets**: This is a crucial SQL behavior that elegantly solves edge cases where no data meets your criteria.

2. **HAVING vs WHERE**: Remember that WHERE filters rows before aggregation, HAVING filters groups after aggregation. Use COUNT() in HAVING, not WHERE.

3. **Subqueries organize complex logic**: When you need to perform multiple operations (filter then aggregate), subqueries or CTEs make your intent clearer and your code more maintainable.

This problem tests your understanding of SQL's aggregation model and NULL handling—concepts that come up frequently in database interview questions.

[Practice this problem on CodeJeet](/problem/biggest-single-number)
