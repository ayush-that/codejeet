---
title: "How to Solve Number of Ways to Paint N × 3 Grid — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Paint N × 3 Grid. Hard difficulty, 80.5% acceptance rate. Topics: Dynamic Programming."
date: "2026-12-08"
category: "dsa-patterns"
tags: ["number-of-ways-to-paint-n-3-grid", "dynamic-programming", "hard"]
---

# How to Solve Number of Ways to Paint N × 3 Grid

You need to paint an `n x 3` grid with three colors such that no two adjacent cells share the same color. The challenge is that each row's coloring depends on the row above it, creating a combinatorial problem that grows exponentially with `n`. What makes this interesting is that while brute force would be impossible for large `n`, we can use dynamic programming to find patterns in valid row arrangements and their transitions.

## Visual Walkthrough

Let's build intuition with `n = 2` (2 rows). We'll represent colors as R, Y, G.

**Row 1 possibilities:**
For a single row of 3 cells with 3 colors and no adjacent same colors:

- Valid patterns fall into two categories:
  1. **Three-color patterns** (all colors different): RYG, RGY, YRG, YGR, GRY, GYR
  2. **Two-color patterns** (first and third same, middle different): RYR, RGR, YRY, YGY, GRG, GYG

Actually, let's count systematically. With 3 positions and 3 colors, and no adjacent same colors:

- Position 1: 3 choices
- Position 2: 2 choices (can't match position 1)
- Position 3: 2 choices (can't match position 2, but can match position 1)

So total: 3 × 2 × 2 = 12 patterns. Let's categorize them:

**Type A (ABA patterns):** First and third colors same, middle different.
Examples: RYR, RGR, YRY, YGY, GRG, GYG → 6 patterns

**Type B (ABC patterns):** All three colors different.
Examples: RYG, RGY, YRG, YGR, GRY, GYR → 6 patterns

**Row 2 transitions:**
For each row 1 pattern, row 2 must have no vertical conflicts (position i in row 2 ≠ position i in row 1).

Example: If row 1 is RYR (Type A):

- Position 1: R, so row2[1] can be Y or G
- Position 2: Y, so row2[2] can be R or G
- Position 3: R, so row2[3] can be Y or G

We need to count how many valid row 2 patterns satisfy these constraints AND have no horizontal conflicts within row 2.

This is getting complex! The key insight: Instead of tracking all 12 patterns, we notice that Type A and Type B patterns have different transition properties to the next row. This leads us to the DP approach.

## Brute Force Approach

A naive solution would generate all possible colorings of the entire grid and count valid ones. For an `n x 3` grid:

- Each cell has 3 choices
- Total possibilities: 3^(3n) = 3^(3n)
- Need to check adjacency constraints for each

Even for `n = 5`, that's 3^15 ≈ 14 million possibilities. For `n = 10`, it's 3^30 ≈ 2 × 10^14. This is clearly infeasible.

A slightly better brute force would use backtracking: fill row by row, cell by cell, pruning invalid choices early. But this still explores exponential state space. The problem requires a smarter approach that leverages the structure of valid rows and their transitions.

## Optimized Approach

The key insight is **state compression and dynamic programming**:

1. **State Representation**: Instead of tracking all 12 patterns, we notice they fall into just 2 types:
   - **ABA** (first and third same): 6 patterns
   - **ABC** (all different): 6 patterns

2. **Transition Rules**: For a given row type, the next row can be:
   - From ABA: can transition to 3 ABC patterns and 2 ABA patterns
   - From ABC: can transition to 2 ABC patterns and 2 ABA patterns

   Why these numbers? Let's derive them:

   **ABA → Next row**:
   - Colors are like: Color1-Color2-Color1
   - For position 1: can't use Color1, so 2 choices
   - For position 2: can't use Color2, so 2 choices
   - For position 3: can't use Color1, so 2 choices
   - But we must also ensure no horizontal conflicts in the new row
   - If we try all combinations, we get: 3 ABC patterns + 2 ABA patterns

   **ABC → Next row**:
   - Colors are all different: Color1-Color2-Color3
   - Position 1: can't use Color1 → 2 choices
   - Position 2: can't use Color2 → 2 choices
   - Position 3: can't use Color3 → 2 choices
   - After ensuring no horizontal conflicts: 2 ABC patterns + 2 ABA patterns

3. **DP Formulation**:
   Let `dp_aba[i]` = number of ways to paint first `i` rows where row `i` is ABA type
   Let `dp_abc[i]` = number of ways to paint first `i` rows where row `i` is ABC type

   Recurrence:

   ```
   dp_aba[i] = dp_aba[i-1] * 2 + dp_abc[i-1] * 2
   dp_abc[i] = dp_aba[i-1] * 3 + dp_abc[i-1] * 2
   ```

   Base case (i=1):

   ```
   dp_aba[1] = 6  // 6 ABA patterns for first row
   dp_abc[1] = 6  // 6 ABC patterns for first row
   ```

4. **Answer**: Total ways = `dp_aba[n] + dp_abc[n]`

This reduces the problem from exponential to O(n) time!

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) with optimized space, O(n) with basic DP
def numOfWays(n: int) -> int:
    """
    Returns the number of ways to paint an n x 3 grid with 3 colors
    such that no two adjacent cells have the same color.

    Approach: Dynamic Programming with state compression.
    We track two types of row patterns:
    1. ABA type: First and third colors same (e.g., RYR, GYG)
    2. ABC type: All three colors different (e.g., RYG, GRY)

    Transition rules:
    - From ABA: can go to 3 ABC patterns and 2 ABA patterns
    - From ABC: can go to 2 ABC patterns and 2 ABA patterns
    """
    MOD = 10**9 + 7

    # Base case: for the first row
    # There are 6 patterns of each type
    aba = 6  # dp_aba for current row
    abc = 6  # dp_abc for current row

    # Build up from row 2 to row n
    for i in range(2, n + 1):
        # Calculate next row values using transition rules
        # IMPORTANT: Calculate both before updating to avoid using new values
        next_aba = (aba * 2 + abc * 2) % MOD
        next_abc = (aba * 3 + abc * 2) % MOD

        # Update for next iteration
        aba, abc = next_aba, next_abc

    # Total ways = sum of both pattern types
    return (aba + abc) % MOD
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Returns the number of ways to paint an n x 3 grid with 3 colors
 * such that no two adjacent cells have the same color.
 *
 * We use dynamic programming with two states:
 * - aba: row ends with ABA pattern (first and third colors same)
 * - abc: row ends with ABC pattern (all colors different)
 *
 * Transition:
 * aba_next = aba * 2 + abc * 2
 * abc_next = aba * 3 + abc * 2
 */
function numOfWays(n) {
  const MOD = 10 ** 9 + 7;

  // Base case: first row has 6 patterns of each type
  let aba = 6; // ABA type patterns
  let abc = 6; // ABC type patterns

  // Process rows 2 through n
  for (let i = 2; i <= n; i++) {
    // Calculate next values using transition formulas
    // Store in temp variables to avoid overwriting during calculation
    const nextABA = (aba * 2 + abc * 2) % MOD;
    const nextABC = (aba * 3 + abc * 2) % MOD;

    // Update for next iteration
    aba = nextABA;
    abc = nextABC;
  }

  // Total is sum of both pattern types
  return (aba + abc) % MOD;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int numOfWays(int n) {
        // Use long to prevent integer overflow during multiplication
        final int MOD = 1_000_000_007;

        // Base case: first row
        // 6 ABA patterns and 6 ABC patterns
        long aba = 6;  // Patterns where first and third colors are same
        long abc = 6;  // Patterns where all three colors are different

        // Dynamic programming: process each row from 2 to n
        for (int i = 2; i <= n; i++) {
            // Calculate next row values using transition rules
            // From ABA: 2 ways to next ABA, 3 ways to next ABC
            // From ABC: 2 ways to next ABA, 2 ways to next ABC
            long nextABA = (aba * 2 + abc * 2) % MOD;
            long nextABC = (aba * 3 + abc * 2) % MOD;

            // Update for next iteration
            aba = nextABA;
            abc = nextABC;
        }

        // Total ways = sum of both pattern types
        return (int)((aba + abc) % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate from row 2 to row n, performing constant-time operations at each step
- Each iteration involves 2 multiplications and 2 additions
- Total operations: ~4n, which is O(n)

**Space Complexity: O(1)**

- We only store two variables (`aba` and `abc`) for the current row
- Even if we used a full DP array, it would be O(n), but we optimized to O(1) by only keeping the previous row
- The space doesn't grow with n beyond a few variables

## Common Mistakes

1. **Not using modulo operations correctly**: The result grows extremely fast. Candidates often forget to apply modulo after each multiplication or addition, leading to integer overflow. In Java, use `long` type and apply `% MOD` after each operation.

2. **Confusing the transition counts**: The numbers 2, 3, 2, 2 in the recurrence are easy to mix up. Remember:
   - ABA → 3 ABC, 2 ABA
   - ABC → 2 ABC, 2 ABA
     A good check: For n=2, answer should be 54 (6×3 + 6×2 + 6×2 + 6×2 = 18+12+12+12=54).

3. **Incorrect base case**: Some candidates start with `aba=1, abc=1` or other wrong values. Remember: For the first row, there are 6 valid patterns of each type, so `aba=6, abc=6`.

4. **Updating variables in wrong order**: When calculating `next_aba` and `next_abc`, you must use the OLD values of `aba` and `abc`. A common mistake is:
   ```python
   aba = aba * 2 + abc * 2  # WRONG: overwrites aba before calculating abc!
   abc = aba * 3 + abc * 2  # Now uses NEW aba value!
   ```
   Always use temporary variables or calculate both before updating.

## When You'll See This Pattern

This problem uses **state machine DP** or **DP with state compression**, where:

1. The state space is large but can be categorized into a few types
2. Transitions between states follow predictable rules
3. The solution counts paths through this state machine

Similar problems include:

1. **Domino and Tromino Tiling (LeetCode 790)**: Count ways to tile a 2xn board with dominoes and trominoes. You track states based on how the last column is filled.

2. **Student Attendance Record II (LeetCode 552)**: Count valid attendance records of length n. You track states based on consecutive 'L's and whether 'A' has appeared.

3. **Knight Probability in Chessboard (LeetCode 688)**: Probability a knight remains on board after k moves. You track probability of being at each position.

4. **Painting a Grid With Three Different Colors (LeetCode 1931)**: The harder version of this problem with m x n grid instead of n x 3.

## Key Takeaways

1. **Look for state compression**: When the naive state space is exponential, look for ways to categorize states into a manageable number of types. Here, 12 patterns reduced to 2 types based on their structure.

2. **Derive transition rules systematically**: Don't guess the transition counts. Work through examples: given a row type, count how many valid next rows of each type exist.

3. **DP optimization**: When each state depends only on the previous state, you can use O(1) space instead of O(n) by only keeping the previous row's values.

Related problems: [Painting a Grid With Three Different Colors](/problem/painting-a-grid-with-three-different-colors)
