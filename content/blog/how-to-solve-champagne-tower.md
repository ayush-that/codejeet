---
title: "How to Solve Champagne Tower — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Champagne Tower. Medium difficulty, 64.1% acceptance rate. Topics: Dynamic Programming."
date: "2028-05-20"
category: "dsa-patterns"
tags: ["champagne-tower", "dynamic-programming", "medium"]
---

# How to Solve Champagne Tower

The Champagne Tower problem asks us to determine how much champagne is in a specific glass after pouring a certain amount into the top glass of a pyramid. The tricky part is that when a glass overflows, the excess liquid splits equally between the two glasses below it. This creates a cascading effect that makes brute force simulation computationally expensive.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we pour `4` cups of champagne into the top glass (glass at row 0, position 0).

**Row 0:** The top glass has capacity 1. With 4 cups poured, it overflows by 3 cups. Excess per child = 3/2 = 1.5 cups to each glass below.

**Row 1:**

- Glass (1,0) receives 1.5 cups from above. It overflows by 0.5 cups (since capacity is 1). Excess per child = 0.5/2 = 0.25 to each glass below.
- Glass (1,1) also receives 1.5 cups, overflows by 0.5, excess per child = 0.25.

**Row 2:**

- Glass (2,0) receives 0.25 from glass (1,0) above-left. Total = 0.25, which is less than capacity, so no overflow.
- Glass (2,1) receives 0.25 from glass (1,0) above-left AND 0.25 from glass (1,1) above-right. Total = 0.5, less than capacity, no overflow.
- Glass (2,2) receives 0.25 from glass (1,1) above-right. Total = 0.25, no overflow.

If we want to know how much is in glass (2,1) after pouring 4 cups, the answer is 0.5.

## Brute Force Approach

A naive approach would be to simulate every glass in the pyramid up to the 100th row. Since each row `i` has `i+1` glasses, there are approximately 100×101/2 = 5050 glasses total. For each glass, we need to calculate overflow and distribute it to children. However, if we pour a very large amount (like 10^9 cups), the overflow could cascade through all rows, requiring us to process all 5050 glasses.

The brute force simulation would work like this:

1. Create a 2D array representing all glasses
2. Pour all champagne into the top glass
3. For each glass from top to bottom:
   - If it has more than 1 cup, calculate overflow
   - Distribute overflow equally to the two glasses below
4. Return the amount in the target glass

The problem with this approach is that for very large pours, we might need to simulate all 100 rows, which is O(rows²) time and space. While this might be acceptable for 100 rows (5050 operations), we can do better with a more focused approach that only calculates what we need.

## Optimized Approach

The key insight is that we don't need to track every glass in the pyramid. We only care about the glasses that could possibly affect our target glass. Champagne flows downward following a pattern similar to Pascal's triangle: the amount reaching glass (i, j) depends on the overflow from glasses (i-1, j-1) and (i-1, j).

We can use dynamic programming with a 1D array:

1. Create an array `dp` of size `query_row + 2` (we need one extra for boundary handling)
2. Set `dp[0] = poured` (all champagne starts in the top glass)
3. For each row from 0 to `query_row`:
   - Process from right to left (to avoid overwriting values we still need)
   - For each position in the current row:
     - If the glass has more than 1, calculate overflow
     - Distribute half of the overflow to the glass below-left and half to below-right
     - Cap the glass at 1 (it can't hold more than 1)
4. The value in `dp[query_glass]` after processing row `query_row` is our answer

This approach is efficient because:

- We only process rows up to the one we care about
- We use O(row) space instead of O(row²)
- We avoid simulating glasses that don't affect our target

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(query_row²) | Space: O(query_row)
def champagneTower(poured, query_row, query_glass):
    """
    Calculate how much champagne is in a specific glass after pouring.

    Args:
        poured: Total cups poured into the top glass
        query_row: Row index (0-based) of the glass to check
        query_glass: Position index (0-based) in the row to check

    Returns:
        Amount of champagne in the specified glass (capped at 1.0)
    """
    # dp represents the current row of glasses
    # We need query_row + 1 elements because rows are 0-indexed
    dp = [0.0] * (query_row + 2)

    # All champagne starts in the top glass (position 0)
    dp[0] = poured

    # Process each row up to the query row
    for row in range(query_row + 1):
        # Process from right to left to avoid overwriting values
        # we still need for calculations
        for col in range(row, -1, -1):
            # Calculate overflow for this glass
            overflow = max(0.0, dp[col] - 1.0)

            # If there's overflow, distribute it to glasses below
            if overflow > 0:
                # Half goes to the glass below-left (same column in next row)
                # Half goes to the glass below-right (next column in next row)
                dp[col] = 1.0  # Glass is full
                dp[col + 1] += overflow / 2.0  # Below-right
                dp[col] += overflow / 2.0  # Below-left (stays in dp[col])
            else:
                # No overflow, glass contains whatever was in it
                # (which is less than or equal to 1)
                dp[col] = dp[col]  # This line is for clarity

    # The glass at query_row, query_glass now contains the answer
    # But we need to cap it at 1.0 (a glass can't hold more than 1)
    return min(1.0, dp[query_glass])
```

```javascript
// Time: O(query_row²) | Space: O(query_row)
function champagneTower(poured, query_row, query_glass) {
  /**
   * Calculate how much champagne is in a specific glass after pouring.
   *
   * @param {number} poured - Total cups poured into the top glass
   * @param {number} query_row - Row index (0-based) of the glass to check
   * @param {number} query_glass - Position index (0-based) in the row to check
   * @return {number} Amount of champagne in the specified glass (capped at 1.0)
   */

  // dp represents the current row of glasses
  // We need query_row + 1 elements because rows are 0-indexed
  const dp = new Array(query_row + 2).fill(0.0);

  // All champagne starts in the top glass (position 0)
  dp[0] = poured;

  // Process each row up to the query row
  for (let row = 0; row <= query_row; row++) {
    // Process from right to left to avoid overwriting values
    // we still need for calculations
    for (let col = row; col >= 0; col--) {
      // Calculate overflow for this glass
      const overflow = Math.max(0.0, dp[col] - 1.0);

      // If there's overflow, distribute it to glasses below
      if (overflow > 0) {
        // Half goes to the glass below-left (same column in next row)
        // Half goes to the glass below-right (next column in next row)
        dp[col] = 1.0; // Glass is full
        dp[col + 1] += overflow / 2.0; // Below-right
        dp[col] += overflow / 2.0; // Below-left (stays in dp[col])
      }
      // If no overflow, glass contains whatever was in it
      // (which is less than or equal to 1)
    }
  }

  // The glass at query_row, query_glass now contains the answer
  // But we need to cap it at 1.0 (a glass can't hold more than 1)
  return Math.min(1.0, dp[query_glass]);
}
```

```java
// Time: O(query_row²) | Space: O(query_row)
class Solution {
    public double champagneTower(int poured, int query_row, int query_glass) {
        /**
         * Calculate how much champagne is in a specific glass after pouring.
         *
         * @param poured Total cups poured into the top glass
         * @param query_row Row index (0-based) of the glass to check
         * @param query_glass Position index (0-based) in the row to check
         * @return Amount of champagne in the specified glass (capped at 1.0)
         */

        // dp represents the current row of glasses
        // We need query_row + 1 elements because rows are 0-indexed
        double[] dp = new double[query_row + 2];

        // All champagne starts in the top glass (position 0)
        dp[0] = poured;

        // Process each row up to the query row
        for (int row = 0; row <= query_row; row++) {
            // Process from right to left to avoid overwriting values
            // we still need for calculations
            for (int col = row; col >= 0; col--) {
                // Calculate overflow for this glass
                double overflow = Math.max(0.0, dp[col] - 1.0);

                // If there's overflow, distribute it to glasses below
                if (overflow > 0) {
                    // Half goes to the glass below-left (same column in next row)
                    // Half goes to the glass below-right (next column in next row)
                    dp[col] = 1.0;  // Glass is full
                    dp[col + 1] += overflow / 2.0;  // Below-right
                    dp[col] += overflow / 2.0;  // Below-left (stays in dp[col])
                }
                // If no overflow, glass contains whatever was in it
                // (which is less than or equal to 1)
            }
        }

        // The glass at query_row, query_glass now contains the answer
        // But we need to cap it at 1.0 (a glass can't hold more than 1)
        return Math.min(1.0, dp[query_glass]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(query_row²)

- We iterate through each row from 0 to `query_row`
- For row `i`, we process `i+1` glasses
- Total operations = 1 + 2 + 3 + ... + (query_row + 1) = O(query_row²)
- Since query_row ≤ 99 (problem constraint), this is efficient

**Space Complexity:** O(query_row)

- We use a 1D array of size `query_row + 2`
- This is much better than storing the entire pyramid (which would be O(query_row²))

## Common Mistakes

1. **Not processing from right to left:** If you process left to right, you'll overwrite values in `dp[col]` before they're used to calculate `dp[col+1]` in the same iteration. Right-to-left processing ensures we use the "old" values from the previous row.

2. **Forgetting to cap the result at 1.0:** The problem states each glass holds exactly 1 cup. Even if our calculation shows more than 1 in a glass (due to accumulation from multiple parents), we must return min(1.0, value).

3. **Incorrect array size:** Using `query_row + 1` instead of `query_row + 2` can cause index out of bounds when accessing `dp[col + 1]` for the last glass in a row.

4. **Using integer division:** When calculating overflow/2, ensure you're using floating-point division, not integer division. In Java, `overflow / 2` with integer `overflow` would give wrong results.

## When You'll See This Pattern

This problem uses **dynamic programming with state compression**, where we reduce a 2D DP problem to 1D by processing carefully. Similar patterns appear in:

1. **Pascal's Triangle (LeetCode 118)** - The champagne flow follows binomial distribution patterns similar to Pascal's triangle coefficients.

2. **Triangle (LeetCode 120)** - Finding minimum path sum in a triangle uses similar row-by-row processing with O(n) space.

3. **Unique Paths (LeetCode 62)** - Can be solved with 1D DP by realizing each cell's value depends only on the cell above and to the left.

The key insight is recognizing when you can compute the next state using only the previous state, allowing space optimization.

## Key Takeaways

1. **Think about information flow:** In pyramid/triangle problems, values typically flow downward. You only need to track the current row to compute the next one.

2. **Right-to-left processing matters:** When updating a 1D array in place where each element depends on itself and its left neighbor, process from right to left to avoid overwriting needed values.

3. **Constraints guide optimization:** The problem's constraint (100 rows max) means even O(n²) is acceptable, but the 1D DP solution is more elegant and teaches important DP compression techniques.

Related problems: [Number of Ways to Build House of Cards](/problem/number-of-ways-to-build-house-of-cards)
