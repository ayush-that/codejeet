---
title: "How to Solve Find Missing Observations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Missing Observations. Medium difficulty, 57.4% acceptance rate. Topics: Array, Math, Simulation."
date: "2026-05-10"
category: "dsa-patterns"
tags: ["find-missing-observations", "array", "math", "simulation", "medium"]
---

# How to Solve Find Missing Observations

You have `m` observed dice rolls and know the average of all `n + m` rolls (including `n` missing ones). You need to reconstruct the missing rolls so that when combined with the observed rolls, they produce the given average. The challenge is that each die roll must be between 1 and 6, making this a constrained reconstruction problem.

What makes this interesting is that it's not just about finding any solution — you need to find a valid distribution of dice rolls that satisfies both the total sum requirement and the per-roll constraints. It tests your ability to work with constraints and handle edge cases where no solution exists.

## Visual Walkthrough

Let's walk through an example:  
`rolls = [3, 2, 4, 3]` (m = 4 observed rolls)  
`mean = 4` (average of all rolls)  
`n = 2` (missing rolls)

**Step 1: Calculate the total sum needed**

- Total rolls = n + m = 2 + 4 = 6 rolls
- Total sum needed = mean × total rolls = 4 × 6 = 24

**Step 2: Calculate sum of observed rolls**

- Sum of [3, 2, 4, 3] = 12

**Step 3: Calculate required sum for missing rolls**

- Missing sum = total sum needed - observed sum = 24 - 12 = 12

**Step 4: Check if solution is possible**

- Minimum possible for 2 missing rolls: 2 × 1 = 2
- Maximum possible for 2 missing rolls: 2 × 6 = 12
- Required sum 12 is within [2, 12] ✓

**Step 5: Distribute the sum**
We need 2 numbers between 1-6 that sum to 12.

- Start with base of 1 for each: [1, 1] (sum = 2)
- Need to add 10 more (12 - 2 = 10)
- Distribute evenly: 10 ÷ 2 = 5 each
- Add to base: [1+5, 1+5] = [6, 6]

**Step 6: Handle remainder**
If remainder existed (e.g., needed to add 11), we'd add 5 to first, 6 to second, giving [6, 6] with remainder 0 distributed.

Final missing rolls: [6, 6]

## Brute Force Approach

A naive approach would try all possible combinations of `n` dice rolls (each between 1-6), check if their sum plus the observed sum equals the required total, and return the first valid combination.

The problem with this brute force:

- There are 6ⁿ possible combinations
- For n up to 10⁵ (as per constraints), this is astronomically large (6¹⁰⁰⁰⁰⁰)
- Even for small n, it's exponential time complexity: O(6ⁿ)

What candidates might incorrectly try:

1. Random generation until finding a match (unreliable, potentially infinite)
2. Backtracking with pruning (still exponential for large n)
3. Trying to use dynamic programming for the sum distribution without considering the per-roll constraints properly

## Optimized Approach

The key insight is that this is a **constrained distribution problem**. We need to distribute the required sum among `n` rolls, each between 1 and 6.

**Step-by-step reasoning:**

1. **Calculate the target sum** for missing rolls:
   - Total sum needed = mean × (n + m)
   - Missing sum = total sum needed - sum(observed rolls)

2. **Check feasibility**:
   - Minimum possible sum = n × 1
   - Maximum possible sum = n × 6
   - If missing sum is outside this range → return empty array

3. **Distribute the sum**:
   - Start with all rolls at minimum value (1)
   - Calculate how much extra we need: extra = missing sum - n
   - Distribute the extra as evenly as possible:
     - Each roll gets base = extra // n added to its starting 1
     - First (extra % n) rolls get one more (to handle remainder)

4. **Why this works**:
   - Starting from minimum ensures we don't exceed maximum
   - Even distribution minimizes deviation from average
   - Adding remainder to first few rolls handles any leftover amount

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) | Space: O(n) for the result
def missingRolls(rolls, mean, n):
    """
    Reconstruct n missing dice rolls given m observed rolls and the mean of all rolls.

    Args:
        rolls: List of observed dice rolls (length m)
        mean: Average of all n + m rolls
        n: Number of missing rolls to reconstruct

    Returns:
        List of n integers between 1-6, or empty list if impossible
    """
    m = len(rolls)
    total_rolls = n + m

    # Step 1: Calculate total sum needed for all rolls
    total_sum_needed = mean * total_rolls

    # Step 2: Calculate sum of observed rolls
    observed_sum = sum(rolls)

    # Step 3: Calculate required sum for missing rolls
    missing_sum = total_sum_needed - observed_sum

    # Step 4: Check if solution is possible
    # Each missing roll must be between 1 and 6
    if missing_sum < n or missing_sum > 6 * n:
        return []  # Impossible to achieve with dice rolls 1-6

    # Step 5: Distribute the sum among n rolls
    # Start with minimum value (1) for each roll
    result = [1] * n

    # Calculate how much extra we need beyond the minimum
    extra = missing_sum - n  # We already have n from the 1's

    # Distribute extra evenly
    # Each roll gets at least base_extra added to its starting 1
    base_extra = extra // n

    # Some rolls may get one more if there's a remainder
    remainder = extra % n

    # Apply the distribution
    for i in range(n):
        result[i] += base_extra
        if i < remainder:
            result[i] += 1

    return result
```

```javascript
// Time: O(n + m) | Space: O(n) for the result
function missingRolls(rolls, mean, n) {
  /**
   * Reconstruct n missing dice rolls given m observed rolls and the mean of all rolls.
   *
   * @param {number[]} rolls - Array of observed dice rolls (length m)
   * @param {number} mean - Average of all n + m rolls
   * @param {number} n - Number of missing rolls to reconstruct
   * @return {number[]} - Array of n integers between 1-6, or empty array if impossible
   */
  const m = rolls.length;
  const totalRolls = n + m;

  // Step 1: Calculate total sum needed for all rolls
  const totalSumNeeded = mean * totalRolls;

  // Step 2: Calculate sum of observed rolls
  const observedSum = rolls.reduce((sum, val) => sum + val, 0);

  // Step 3: Calculate required sum for missing rolls
  const missingSum = totalSumNeeded - observedSum;

  // Step 4: Check if solution is possible
  // Each missing roll must be between 1 and 6
  if (missingSum < n || missingSum > 6 * n) {
    return []; // Impossible to achieve with dice rolls 1-6
  }

  // Step 5: Distribute the sum among n rolls
  // Start with minimum value (1) for each roll
  const result = new Array(n).fill(1);

  // Calculate how much extra we need beyond the minimum
  const extra = missingSum - n; // We already have n from the 1's

  // Distribute extra evenly
  // Each roll gets at least baseExtra added to its starting 1
  const baseExtra = Math.floor(extra / n);

  // Some rolls may get one more if there's a remainder
  const remainder = extra % n;

  // Apply the distribution
  for (let i = 0; i < n; i++) {
    result[i] += baseExtra;
    if (i < remainder) {
      result[i] += 1;
    }
  }

  return result;
}
```

```java
// Time: O(n + m) | Space: O(n) for the result
class Solution {
    public int[] missingRolls(int[] rolls, int mean, int n) {
        /**
         * Reconstruct n missing dice rolls given m observed rolls and the mean of all rolls.
         *
         * @param rolls - Array of observed dice rolls (length m)
         * @param mean - Average of all n + m rolls
         * @param n - Number of missing rolls to reconstruct
         * @return - Array of n integers between 1-6, or empty array if impossible
         */
        int m = rolls.length;
        int totalRolls = n + m;

        // Step 1: Calculate total sum needed for all rolls
        long totalSumNeeded = (long) mean * totalRolls;

        // Step 2: Calculate sum of observed rolls
        long observedSum = 0;
        for (int roll : rolls) {
            observedSum += roll;
        }

        // Step 3: Calculate required sum for missing rolls
        long missingSum = totalSumNeeded - observedSum;

        // Step 4: Check if solution is possible
        // Each missing roll must be between 1 and 6
        if (missingSum < n || missingSum > 6L * n) {
            return new int[0];  // Impossible to achieve with dice rolls 1-6
        }

        // Step 5: Distribute the sum among n rolls
        int[] result = new int[n];

        // Calculate how much extra we need beyond the minimum (1 for each)
        long extra = missingSum - n;  // We already have n from the 1's

        // Distribute extra evenly
        int baseExtra = (int) (extra / n);
        int remainder = (int) (extra % n);

        // Fill the result array
        for (int i = 0; i < n; i++) {
            result[i] = 1 + baseExtra;  // Start with 1, add base extra
            if (i < remainder) {
                result[i] += 1;  // Add one more for the first 'remainder' rolls
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- O(m) to calculate the sum of observed rolls
- O(n) to construct the result array
- The distribution loop runs O(n) times
- Total: O(n + m), which is linear in the total number of rolls

**Space Complexity: O(n)**

- We need O(n) space for the result array
- O(1) additional space for variables (sums, counters, etc.)
- Note: Some languages might use O(n) for the result regardless, but we can't avoid this since we must return the missing rolls

## Common Mistakes

1. **Integer overflow when calculating total sum**
   - Using `int` instead of `long` in Java/C++ when `mean × (n + m)` can exceed 2³¹
   - Fix: Use 64-bit integers for intermediate calculations

2. **Forgetting to check both bounds**
   - Only checking if sum is ≤ maximum (6n) but not ≥ minimum (n)
   - Example: If missing sum is 0 but n=2, impossible since min sum is 2
   - Fix: Check `if missing_sum < n or missing_sum > 6 * n`

3. **Incorrect distribution logic**
   - Trying to use floating point division or complex formulas
   - Forgetting to handle the remainder properly
   - Fix: Use integer division and modulo as shown in the solution

4. **Off-by-one in remainder distribution**
   - Adding remainder to last rolls instead of first rolls
   - This still produces a valid solution but the problem doesn't specify order
   - However, consistent approach is better for clarity

## When You'll See This Pattern

This problem uses **constrained distribution** — distributing a total sum among items with min/max constraints. You'll see similar patterns in:

1. **Candy (LeetCode 135)** - Distribute candy with rating constraints
   - Similar: Need to give at least 1 candy to each child, with additional constraints
   - Different: Constraints are based on comparisons with neighbors

2. **Gas Station (LeetCode 134)** - Circular route with gas constraints
   - Similar: Need to distribute travel across stations with supply/demand
   - Different: Circular nature adds complexity

3. **Split Array Largest Sum (LeetCode 410)** - Split array into m parts with minimized maximum sum
   - Similar: Distributing sum across partitions with constraints
   - Different: Optimization objective rather than exact reconstruction

## Key Takeaways

1. **Constrained distribution problems** often have a greedy solution: start from minimum values, then distribute the "extra" evenly.
2. **Always check feasibility first** before attempting reconstruction. Validate that the target sum is within the possible range given constraints.
3. **Integer division and modulo** are powerful tools for evenly distributing quantities with remainder handling.

This problem teaches how to transform a reconstruction problem into a simple distribution problem by working with sums and constraints rather than trying to brute force combinations.

Related problems: [Number of Dice Rolls With Target Sum](/problem/number-of-dice-rolls-with-target-sum), [Dice Roll Simulation](/problem/dice-roll-simulation)
