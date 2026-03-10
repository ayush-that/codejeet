---
title: "How to Solve Calculate Money in Leetcode Bank — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Calculate Money in Leetcode Bank. Easy difficulty, 82.3% acceptance rate. Topics: Math."
date: "2028-01-15"
category: "dsa-patterns"
tags: ["calculate-money-in-leetcode-bank", "math", "easy"]
---

# How to Solve "Calculate Money in Leetcode Bank"

Hercy is saving money by depositing an increasing amount each day of the week, with a weekly reset that increases the starting amount by $1. Given `n` days, we need to calculate his total savings. While this is labeled "Easy," the tricky part lies in handling the weekly pattern correctly without simulating day-by-day, which would be inefficient for large `n`.

## Visual Walkthrough

Let's trace through `n = 10` days to understand the pattern:

**Week 1 (days 1-7):** Monday = $1, Tuesday = $2, Wednesday = $3, Thursday = $4, Friday = $5, Saturday = $6, Sunday = $7  
**Week 2 (days 8-10):** Monday = $2, Tuesday = $3, Wednesday = $4

We can visualize this as:

```
Day:   1  2  3  4  5  6  7  8  9  10
Amt:   1  2  3  4  5  6  7  2  3  4
```

Notice the pattern:

- Each week's deposits form an arithmetic sequence starting at `(week_number)` and increasing by 1 each day
- Week 1: 1, 2, 3, 4, 5, 6, 7
- Week 2: 2, 3, 4, 5, 6, 7, 8 (but we only have 3 days)

The total is:  
Week 1: 1+2+3+4+5+6+7 = 28  
Week 2 (partial): 2+3+4 = 9  
Total = 28 + 9 = 37

This reveals our approach: calculate complete weeks separately from the partial final week.

## Brute Force Approach

The most straightforward solution is to simulate day-by-day:

1. Start with `total = 0` and `day_of_week = 0`
2. For each day from 1 to `n`:
   - Calculate deposit as `week_number + day_of_week`
   - Add to total
   - Increment day_of_week, resetting to 0 after Sunday
   - Increment week_number when starting a new week

While this works, it has O(n) time complexity. For `n` up to 1000 (as typical in LeetCode), this is acceptable, but it's not the most elegant solution. More importantly, it doesn't take advantage of the mathematical pattern, which could handle much larger `n` efficiently.

## Optimal Solution

We can solve this mathematically by recognizing two patterns:

1. Each complete week forms an arithmetic sequence
2. The partial week (if any) forms another arithmetic sequence

**Mathematical Insight:**

- Complete weeks: For `k` complete weeks, week `i` (0-indexed) has deposits: `(i+1) + 0`, `(i+1) + 1`, ..., `(i+1) + 6`
- Sum for week `i`: `7*(i+1) + (0+1+2+3+4+5+6)` = `7*(i+1) + 21`
- Partial week: If we have `r` remaining days, they form an arithmetic sequence starting at `(k+1)` with difference 1

**Steps:**

1. Calculate complete weeks: `k = n // 7`
2. Calculate remaining days: `r = n % 7`
3. Sum complete weeks using arithmetic series formula
4. Sum partial week using arithmetic series formula
5. Return total

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def totalMoney(n: int) -> int:
    """
    Calculate total money saved after n days using mathematical formula.

    Args:
        n: Number of days to calculate savings for

    Returns:
        Total amount saved after n days
    """
    # Step 1: Calculate number of complete weeks and remaining days
    complete_weeks = n // 7
    remaining_days = n % 7

    # Step 2: Calculate sum for complete weeks
    # Each complete week i (0-indexed) contributes: 7*(i+1) + 21
    # This is because:
    # - Base amount for the week: 7*(i+1) (each day starts at i+1)
    # - Additional increments: 0+1+2+3+4+5+6 = 21
    # Sum over k weeks: 7*(1+2+...+k) + 21*k = 7*k*(k+1)/2 + 21*k
    complete_weeks_sum = complete_weeks * (complete_weeks + 1) // 2 * 7 + 21 * complete_weeks

    # Step 3: Calculate sum for remaining days
    # Remaining days form an arithmetic sequence starting at (complete_weeks + 1)
    # with difference 1, having 'remaining_days' terms
    # Sum = r * start + r*(r-1)/2
    remaining_sum = remaining_days * (complete_weeks + 1) + remaining_days * (remaining_days - 1) // 2

    # Step 4: Return total
    return complete_weeks_sum + remaining_sum
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate total money saved after n days using mathematical formula.
 * @param {number} n - Number of days to calculate savings for
 * @return {number} Total amount saved after n days
 */
function totalMoney(n) {
  // Step 1: Calculate number of complete weeks and remaining days
  const completeWeeks = Math.floor(n / 7);
  const remainingDays = n % 7;

  // Step 2: Calculate sum for complete weeks
  // Formula: 7 * (1+2+...+k) + 21*k = 7*k*(k+1)/2 + 21*k
  const completeWeeksSum = ((completeWeeks * (completeWeeks + 1)) / 2) * 7 + 21 * completeWeeks;

  // Step 3: Calculate sum for remaining days
  // Remaining days form arithmetic sequence starting at (completeWeeks + 1)
  // Sum = r * start + r*(r-1)/2
  const remainingSum =
    remainingDays * (completeWeeks + 1) + (remainingDays * (remainingDays - 1)) / 2;

  // Step 4: Return total
  return completeWeeksSum + remainingSum;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate total money saved after n days using mathematical formula.
     * @param n Number of days to calculate savings for
     * @return Total amount saved after n days
     */
    public int totalMoney(int n) {
        // Step 1: Calculate number of complete weeks and remaining days
        int completeWeeks = n / 7;
        int remainingDays = n % 7;

        // Step 2: Calculate sum for complete weeks
        // Formula: 7 * (1+2+...+k) + 21*k = 7*k*(k+1)/2 + 21*k
        // Note: Use long to avoid overflow, then cast back to int
        long completeWeeksSum = (long)completeWeeks * (completeWeeks + 1) / 2 * 7 + 21L * completeWeeks;

        // Step 3: Calculate sum for remaining days
        // Remaining days form arithmetic sequence starting at (completeWeeks + 1)
        // Sum = r * start + r*(r-1)/2
        long remainingSum = (long)remainingDays * (completeWeeks + 1) + (long)remainingDays * (remainingDays - 1) / 2;

        // Step 4: Return total as int
        return (int)(completeWeeksSum + remainingSum);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**  
We perform a constant number of arithmetic operations regardless of input size. The calculations for complete weeks and remaining days use closed-form formulas without loops.

**Space Complexity: O(1)**  
We only use a few variables to store intermediate results, requiring constant space.

## Common Mistakes

1. **Off-by-one errors in week counting**: Forgetting that week numbers start at 1 (not 0) for deposit calculations. The first Monday is week 1 with $1, not week 0. Always test with small `n` like 1, 7, and 8.

2. **Incorrect arithmetic sequence formulas**: Misapplying the sum formula `n/2 * (first + last)` or forgetting to handle the partial week correctly. Remember:
   - Complete weeks: Each week is `7*(week_number) + 21`
   - Partial week: `r * start + r*(r-1)/2`

3. **Integer overflow in Java**: Not using `long` for intermediate calculations when `n` is large. With `n = 1000`, the total can exceed 2 billion, which may overflow 32-bit integers during multiplication.

4. **Simulation when mathematical solution exists**: While simulating day-by-day works for the given constraints, it shows lack of mathematical insight. Interviewers prefer the O(1) solution as it demonstrates pattern recognition.

## When You'll See This Pattern

This problem combines **arithmetic sequences** with **modular arithmetic** (weekly cycles). You'll encounter similar patterns in:

1. **Distribute Money to Maximum Children (Easy)**: Similar mathematical reasoning about distributing money optimally with constraints.

2. **Count Integers With Even Digit Sum (Easy)**: Uses mathematical formulas to count numbers meeting certain criteria without iterating through all.

3. **Day of the Week (Easy)**: Calculates which day of the week a given date falls on using modular arithmetic and known reference points.

4. **Bulb Switcher (Medium)**: While more complex, it also involves finding mathematical patterns rather than simulation.

The key insight is recognizing when a problem has a periodic pattern that can be described mathematically rather than through simulation.

## Key Takeaways

1. **Look for mathematical patterns in seemingly iterative problems**: When you see regular increments, cycles, or sequences, consider whether closed-form formulas exist.

2. **Break problems into complete cycles and partial cycles**: Many periodic problems can be solved by handling complete periods with a formula and the partial period separately.

3. **Test edge cases systematically**: For problems with cycles, test inputs at cycle boundaries (e.g., n=7, n=8, n=14, n=15) to catch off-by-one errors.

Related problems: [Distribute Money to Maximum Children](/problem/distribute-money-to-maximum-children)
