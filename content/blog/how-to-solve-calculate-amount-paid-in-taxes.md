---
title: "How to Solve Calculate Amount Paid in Taxes — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Calculate Amount Paid in Taxes. Easy difficulty, 69.0% acceptance rate. Topics: Array, Simulation."
date: "2028-05-25"
category: "dsa-patterns"
tags: ["calculate-amount-paid-in-taxes", "array", "simulation", "easy"]
---

# How to Solve Calculate Amount Paid in Taxes

This problem asks you to calculate the total tax paid given a series of progressive tax brackets and an income amount. While conceptually straightforward, it requires careful handling of bracket boundaries and income remaining after each bracket. The tricky part is correctly calculating the taxable amount in each bracket without double-counting or exceeding the total income.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- `brackets = [[3,50],[7,10],[12,25]]`
- `income = 10`

**Step-by-step calculation:**

1. **First bracket:** Upper bound = 3, Rate = 50%
   - Taxable amount = min(income, 3) = min(10, 3) = 3
   - Tax from this bracket = 3 × 50% = 1.5
   - Income remaining = 10 - 3 = 7

2. **Second bracket:** Upper bound = 7, Rate = 10%
   - Previous upper bound = 3
   - Taxable amount in this bracket = min(income remaining, 7 - 3) = min(7, 4) = 4
   - Tax from this bracket = 4 × 10% = 0.4
   - Income remaining = 7 - 4 = 3

3. **Third bracket:** Upper bound = 12, Rate = 25%
   - Previous upper bound = 7
   - Taxable amount in this bracket = min(income remaining, 12 - 7) = min(3, 5) = 3
   - Tax from this bracket = 3 × 25% = 0.75
   - Income remaining = 3 - 3 = 0 (no more income to tax)

**Total tax = 1.5 + 0.4 + 0.75 = 2.65**

The key insight is that for each bracket, we calculate the taxable amount as the minimum of:

1. The income remaining after previous brackets
2. The width of the current bracket (current upper bound minus previous upper bound)

## Brute Force Approach

A naive approach might try to calculate tax for every dollar of income individually, checking which bracket each dollar falls into:

```python
def calculateTax(brackets, income):
    total_tax = 0
    for dollar in range(1, income + 1):
        # Find which bracket this dollar falls into
        for upper, percent in brackets:
            if dollar <= upper:
                total_tax += percent / 100
                break
    return total_tax
```

**Why this fails:**

- **Time complexity:** O(income × brackets) which is O(n²) in worst case
- **Inefficient:** Processes each dollar individually when we can process entire ranges at once
- **Doesn't leverage sorted brackets:** The brute force doesn't use the fact that brackets are sorted by upper bound

The optimal solution processes income in chunks based on bracket boundaries, giving us O(n) time complexity where n is the number of brackets.

## Optimal Solution

The optimal approach processes each bracket sequentially, calculating the taxable amount in that bracket as the minimum of remaining income and the bracket width. We keep track of the previous upper bound to calculate each bracket's width correctly.

<div class="code-group">

```python
# Time: O(n) where n is number of brackets | Space: O(1)
def calculateTax(brackets, income):
    """
    Calculate total tax paid given progressive tax brackets and income.

    Args:
        brackets: List of [upper_bound, percentage] pairs, sorted by upper_bound
        income: Total income to calculate tax for

    Returns:
        Total tax paid as a float
    """
    total_tax = 0.0
    prev_upper = 0  # Previous bracket's upper bound, starts at 0

    for upper, percent in brackets:
        # Calculate the width of the current bracket
        bracket_width = upper - prev_upper

        # Taxable amount is the smaller of remaining income or bracket width
        taxable_amount = min(income, bracket_width)

        # Calculate tax for this portion and add to total
        total_tax += taxable_amount * (percent / 100.0)

        # Reduce remaining income by what we just taxed
        income -= taxable_amount

        # Update previous upper bound for next iteration
        prev_upper = upper

        # If no income left, we can stop early
        if income <= 0:
            break

    return total_tax
```

```javascript
// Time: O(n) where n is number of brackets | Space: O(1)
function calculateTax(brackets, income) {
  /**
   * Calculate total tax paid given progressive tax brackets and income.
   *
   * @param {number[][]} brackets - Array of [upper_bound, percentage] pairs, sorted by upper_bound
   * @param {number} income - Total income to calculate tax for
   * @return {number} Total tax paid
   */
  let totalTax = 0;
  let prevUpper = 0; // Previous bracket's upper bound, starts at 0

  for (const [upper, percent] of brackets) {
    // Calculate the width of the current bracket
    const bracketWidth = upper - prevUpper;

    // Taxable amount is the smaller of remaining income or bracket width
    const taxableAmount = Math.min(income, bracketWidth);

    // Calculate tax for this portion and add to total
    totalTax += taxableAmount * (percent / 100);

    // Reduce remaining income by what we just taxed
    income -= taxableAmount;

    // Update previous upper bound for next iteration
    prevUpper = upper;

    // If no income left, we can stop early
    if (income <= 0) {
      break;
    }
  }

  return totalTax;
}
```

```java
// Time: O(n) where n is number of brackets | Space: O(1)
class Solution {
    public double calculateTax(int[][] brackets, int income) {
        /**
         * Calculate total tax paid given progressive tax brackets and income.
         *
         * @param brackets - Array of [upper_bound, percentage] pairs, sorted by upper_bound
         * @param income - Total income to calculate tax for
         * @return Total tax paid as a double
         */
        double totalTax = 0.0;
        int prevUpper = 0;  // Previous bracket's upper bound, starts at 0

        for (int[] bracket : brackets) {
            int upper = bracket[0];
            int percent = bracket[1];

            // Calculate the width of the current bracket
            int bracketWidth = upper - prevUpper;

            // Taxable amount is the smaller of remaining income or bracket width
            int taxableAmount = Math.min(income, bracketWidth);

            // Calculate tax for this portion and add to total
            totalTax += taxableAmount * (percent / 100.0);

            // Reduce remaining income by what we just taxed
            income -= taxableAmount;

            // Update previous upper bound for next iteration
            prevUpper = upper;

            // If no income left, we can stop early
            if (income <= 0) {
                break;
            }
        }

        return totalTax;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through each bracket exactly once
- The `break` statement allows early termination when income is exhausted
- Each iteration performs constant-time operations (subtraction, multiplication, comparison)

**Space Complexity: O(1)**

- We only use a few variables: `total_tax`, `prev_upper`, and loop variables
- No additional data structures are created
- The input arrays are not modified

## Common Mistakes

1. **Forgetting to track previous upper bound:** Using the current bracket's upper bound as the taxable amount instead of calculating `upper - prev_upper`. This double-counts income from lower brackets.

2. **Not converting percentage to decimal:** Forgetting to divide by 100 when calculating tax. Remember: 50% = 0.50, not 50.

3. **Not handling income exhaustion:** Continuing to process brackets after income reaches 0. Always check if `income <= 0` and break early to avoid unnecessary calculations.

4. **Integer division errors:** In Java, using `percent / 100` instead of `percent / 100.0` will result in integer division and incorrect tax calculations. Always ensure at least one operand is a floating-point number.

5. **Assuming income exceeds highest bracket:** The problem doesn't guarantee income exceeds the highest bracket. Always use `min(income, bracket_width)` to handle cases where income falls within a middle bracket.

## When You'll See This Pattern

This problem uses a **progressive accumulation pattern** where you process ranges sequentially, accumulating results as you go. You'll see similar patterns in:

1. **LeetCode 1103: Distribute Candies to People** - Similar progressive distribution where you give increasing amounts until candies run out.

2. **LeetCode 228: Summary Ranges** - Processing consecutive ranges and summarizing them, though simpler than tax calculation.

3. **LeetCode 163: Missing Ranges** - Finding gaps between consecutive numbers, similar to calculating bracket widths.

4. **Any progressive calculation problem** - Like calculating commissions, bonuses, or tiered pricing where different rates apply to different portions of a total.

The core pattern is: iterate through sorted ranges, calculate the applicable amount for the current range, accumulate results, and reduce the remaining total.

## Key Takeaways

1. **Process ranges, not individual units:** When dealing with tiered systems (tax brackets, pricing tiers, commission structures), always think in terms of ranges rather than processing each unit individually.

2. **Track previous boundaries:** For progressive calculations, you need to know both the current and previous boundaries to calculate the width of each tier correctly.

3. **Early termination optimization:** When processing sorted data where you might exhaust your resource (income, candies, etc.), always check if you can break early to save computation.

4. **Watch for floating-point precision:** Financial calculations often require careful handling of percentages and currency. Convert percentages to decimals early and be mindful of integer vs. float division.

[Practice this problem on CodeJeet](/problem/calculate-amount-paid-in-taxes)
