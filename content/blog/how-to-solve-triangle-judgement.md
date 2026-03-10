---
title: "How to Solve Triangle Judgement — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Triangle Judgement. Easy difficulty, 74.5% acceptance rate. Topics: Database."
date: "2027-06-06"
category: "dsa-patterns"
tags: ["triangle-judgement", "database", "easy"]
---

# How to Solve Triangle Judgement

This problem asks us to determine whether three given side lengths can form a valid triangle. While mathematically straightforward, it requires careful implementation of the triangle inequality theorem in a SQL context. What makes this interesting is that it's a classic mathematical concept applied to database queries, testing your ability to translate mathematical logic into SQL conditions.

## Visual Walkthrough

Let's trace through a concrete example. Consider a table with these rows:

| x   | y   | z   |
| --- | --- | --- |
| 3   | 4   | 5   |
| 1   | 2   | 3   |
| 5   | 5   | 5   |
| 2   | 7   | 10  |

For each row, we need to check the triangle inequality theorem: **For any triangle, the sum of any two sides must be greater than the third side.**

**Row 1 (3, 4, 5):**

- 3 + 4 > 5 → 7 > 5 ✓
- 3 + 5 > 4 → 8 > 4 ✓
- 4 + 5 > 3 → 9 > 3 ✓
  All conditions satisfied → "Yes"

**Row 2 (1, 2, 3):**

- 1 + 2 > 3 → 3 > 3 ✗ (must be strictly greater)
  Even one failure means no triangle → "No"

**Row 3 (5, 5, 5):**

- 5 + 5 > 5 → 10 > 5 ✓
- 5 + 5 > 5 → 10 > 5 ✓
- 5 + 5 > 5 → 10 > 5 ✓
  All conditions satisfied → "Yes" (equilateral triangle)

**Row 4 (2, 7, 10):**

- 2 + 7 > 10 → 9 > 10 ✗
  Fails immediately → "No"

The key insight: we need to check ALL three inequalities, not just one or two.

## Brute Force Approach

In SQL problems, there's rarely a "brute force" in the algorithmic sense, but there are less efficient or incorrect approaches. A naive candidate might:

1. **Check only one inequality** - Some might think checking x + y > z is enough, but this fails for cases like (1, 3, 2) where 1+3>2 but 1+2 is not > 3.

2. **Use wrong comparison operator** - Using ≥ instead of >. The triangle inequality requires STRICTLY greater than. Three collinear points (like 1,2,3) don't form a triangle.

3. **Overcomplicate with sorting** - Some might try to sort the sides first, thinking they need to identify the longest side. While mathematically valid (if a ≤ b ≤ c, then just check a + b > c), in SQL this requires complex subqueries or window functions when a simple CASE statement suffices.

The correct approach is straightforward: implement all three inequalities directly in a CASE statement.

## Optimal Solution

The optimal solution uses a simple CASE statement to check all three triangle inequalities. We'll check if x + y > z AND x + z > y AND y + z > x, returning 'Yes' if all are true, 'No' otherwise.

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows | Space: O(1) additional space
SELECT
    x,
    y,
    z,
    CASE
        -- Check all three triangle inequalities
        -- All three conditions must be true for a valid triangle
        WHEN x + y > z AND x + z > y AND y + z > x THEN 'Yes'
        -- If any condition fails, it's not a valid triangle
        ELSE 'No'
    END AS triangle
FROM Triangle;
```

</div>

**Line-by-line explanation:**

1. **`SELECT x, y, z`** - We select all original columns plus our calculated result
2. **`CASE ... END AS triangle`** - The CASE statement evaluates conditions and returns corresponding values
3. **`WHEN x + y > z AND x + z > y AND y + z > x`** - This is the core logic:
   - `x + y > z` checks if sides x and y together are longer than z
   - `x + z > y` checks if sides x and z together are longer than y
   - `y + z > x` checks if sides y and z together are longer than x
   - All three must be true (AND) for a valid triangle
4. **`THEN 'Yes'`** - Returns 'Yes' when all conditions are satisfied
5. **`ELSE 'No'`** - Returns 'No' for any other case (when at least one inequality fails)

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the Triangle table. We need to process each row exactly once, performing three simple arithmetic operations and logical comparisons per row.

**Space Complexity:** O(1) additional space beyond the input storage. The query only adds one new column to the output, and SQL engines typically stream results without needing to store intermediate results for this simple transformation.

The database engine will perform a full table scan, but since we need to examine every row anyway, this is optimal. No indexes can improve this since we must evaluate every row's values.

## Common Mistakes

1. **Using ≥ instead of >** - This is the most common error. Remember: three collinear points (like sides 1, 2, 3) do NOT form a triangle. The triangle inequality requires STRICTLY greater than: `x + y > z`, not `x + y ≥ z`.

2. **Checking only one or two inequalities** - Some candidates check only `x + y > z`, forgetting that we need to ensure EACH side is less than the sum of the other two. Test with (1, 3, 2): 1+3>2 passes, but 1+2>3 fails.

3. **Misunderstanding NULL values** - If any side could be NULL (not specified in constraints but good practice), `NULL > anything` returns NULL, not false. The entire CASE would return NULL. Solution: add `AND x IS NOT NULL AND y IS NOT NULL AND z IS NOT NULL` if NULLs are possible.

4. **Integer overflow with large values** - While not common in interview settings, if x, y, and z are near the maximum integer value, their sum could overflow. In practice, SQL handles this, but it's worth mentioning in interviews to show thoroughness.

## When You'll See This Pattern

This problem teaches the pattern of **applying mathematical constraints in SQL queries**. You'll see similar patterns in:

1. **LeetCode 627: Swap Salary** - Applying conditional logic to update values based on mathematical conditions
2. **LeetCode 620: Not Boring Movies** - Filtering results based on mathematical conditions (odd ID, description not 'boring')
3. **LeetCode 182: Duplicate Emails** - Finding records that satisfy certain relational conditions

The core technique is using **CASE statements with compound conditions** to categorize or transform data based on multiple criteria. This pattern appears whenever you need to:

- Classify rows into categories
- Apply business rules or validation logic
- Transform data conditionally

## Key Takeaways

1. **The triangle inequality requires checking ALL three pairs**: a + b > c, a + c > b, AND b + c > a. One common optimization is to sort and check only a + b > c (where c is the largest), but in SQL, checking all three is simpler.

2. **SQL CASE statements are perfect for implementing business logic**: When you need to apply conditional logic to each row and produce a derived value, CASE statements are the right tool.

3. **Pay attention to strict vs non-strict inequalities**: Many mathematical conditions in programming (like triangle inequality, array bounds, comparison sorts) depend on whether you use > or ≥. Always verify which is mathematically correct.

[Practice this problem on CodeJeet](/problem/triangle-judgement)
