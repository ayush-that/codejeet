---
title: "How to Solve Maximum Rows Covered by Columns — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Rows Covered by Columns. Medium difficulty, 57.7% acceptance rate. Topics: Array, Backtracking, Bit Manipulation, Matrix, Enumeration."
date: "2029-11-17"
category: "dsa-patterns"
tags: ["maximum-rows-covered-by-columns", "array", "backtracking", "bit-manipulation", "medium"]
---

# How to Solve Maximum Rows Covered by Columns

You're given a binary matrix where you need to select exactly `numSelect` columns to cover as many rows as possible. A row is covered if all the 1's in that row are in your selected columns. What makes this problem interesting is that it's essentially a set cover problem in disguise — you're choosing columns (sets) to cover rows (elements), but with the twist that you must select exactly `numSelect` columns, not just enough to cover everything.

## Visual Walkthrough

Let's walk through a concrete example:

```
matrix = [[1,0,0,1],
          [1,1,0,0],
          [0,0,1,1]]
numSelect = 2
```

We have 4 columns (0, 1, 2, 3) and need to choose exactly 2 of them.

**Row 0**: Has 1's in columns 0 and 3. To cover this row, we must select BOTH columns 0 and 3.
**Row 1**: Has 1's in columns 0 and 1. To cover this row, we must select BOTH columns 0 and 1.
**Row 2**: Has 1's in columns 2 and 3. To cover this row, we must select BOTH columns 2 and 3.

Now let's evaluate some column selections:

- Select columns {0, 1}: Covers row 1 only (row 0 needs column 3, row 2 needs column 2)
- Select columns {0, 3}: Covers row 0 only (row 1 needs column 1, row 2 needs column 2)
- Select columns {1, 2}: Covers no rows (row 0 needs 0 and 3, row 1 needs 0, row 2 needs 3)
- Select columns {2, 3}: Covers row 2 only (row 0 needs 0, row 1 needs 0 and 1)

The maximum rows we can cover is 1 row. The key insight is that we need to check all possible combinations of columns to find the best one.

## Brute Force Approach

The most straightforward approach is to generate all possible combinations of `numSelect` columns from the `n` total columns. For each combination, we check how many rows are covered.

Why this is too slow:

- Number of combinations: C(n, numSelect) = n! / (numSelect! × (n-numSelect)!)
- For each combination, we need to check all `m` rows
- Worst case when n=12 and numSelect=6: C(12,6) = 924 combinations × m rows
- But constraints can be larger (up to 12 columns in the actual problem), making this approach borderline but potentially acceptable with optimizations

However, the real issue is that this approach doesn't scale well. If n were larger (though constrained to 12 in this problem), the combinatorial explosion would make it infeasible.

## Optimized Approach

The key insight is that we can represent each row as a bitmask of which columns contain 1's. Then:

1. Convert each row to a bitmask where bit i is 1 if matrix[row][i] == 1
2. Generate all possible column selections (bitmask of selected columns)
3. For each selection, count how many rows have all their 1-bits also set in the selection mask
4. Track the maximum count

The clever optimization is in step 3: A row is covered if `(row_mask & selection_mask) == row_mask`. This works because:

- `row_mask` has bits set only for columns where the row has 1's
- `selection_mask` has bits set for columns we selected
- The bitwise AND gives us which of the row's 1-columns are selected
- If this equals the row_mask, then ALL of the row's 1-columns are selected

Since n ≤ 12 (from problem constraints), there are at most 2^12 = 4096 possible column selections to check, which is manageable.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * n + m * 2^n) where n ≤ 12
# Space: O(m) for storing row masks
def maximumRows(matrix, numSelect):
    m, n = len(matrix), len(matrix[0])

    # Step 1: Convert each row to a bitmask
    # Each bit represents whether that column has a 1 in the row
    row_masks = []
    for i in range(m):
        mask = 0
        for j in range(n):
            if matrix[i][j] == 1:
                mask |= (1 << j)  # Set the j-th bit
        row_masks.append(mask)

    max_covered = 0

    # Step 2: Try all possible column selections
    # We iterate through all bitmasks from 0 to 2^n - 1
    for selection in range(1 << n):
        # Step 3: Check if we selected exactly numSelect columns
        # Count bits in selection mask
        bits = bin(selection).count('1')
        if bits != numSelect:
            continue  # Skip if not exactly numSelect columns

        # Step 4: Count how many rows are covered by this selection
        covered = 0
        for row_mask in row_masks:
            # A row is covered if ALL its 1-bits are in the selection
            # This means: (row_mask & selection) == row_mask
            if (row_mask & selection) == row_mask:
                covered += 1

        # Step 5: Update maximum
        max_covered = max(max_covered, covered)

    return max_covered
```

```javascript
// Time: O(m * n + m * 2^n) where n ≤ 12
// Space: O(m) for storing row masks
function maximumRows(matrix, numSelect) {
  const m = matrix.length;
  const n = matrix[0].length;

  // Step 1: Convert each row to a bitmask
  const rowMasks = [];
  for (let i = 0; i < m; i++) {
    let mask = 0;
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1) {
        mask |= 1 << j; // Set the j-th bit
      }
    }
    rowMasks.push(mask);
  }

  let maxCovered = 0;

  // Step 2: Try all possible column selections
  // Total possibilities: 2^n (since n ≤ 12, max 4096)
  for (let selection = 0; selection < 1 << n; selection++) {
    // Step 3: Check if we selected exactly numSelect columns
    // Count bits in selection mask
    let bits = 0;
    let temp = selection;
    while (temp > 0) {
      bits += temp & 1; // Add 1 if LSB is 1
      temp >>= 1; // Shift right to check next bit
    }

    if (bits !== numSelect) {
      continue; // Skip if not exactly numSelect columns
    }

    // Step 4: Count how many rows are covered by this selection
    let covered = 0;
    for (const rowMask of rowMasks) {
      // A row is covered if ALL its 1-bits are in the selection
      if ((rowMask & selection) === rowMask) {
        covered++;
      }
    }

    // Step 5: Update maximum
    maxCovered = Math.max(maxCovered, covered);
  }

  return maxCovered;
}
```

```java
// Time: O(m * n + m * 2^n) where n ≤ 12
// Space: O(m) for storing row masks
class Solution {
    public int maximumRows(int[][] matrix, int numSelect) {
        int m = matrix.length;
        int n = matrix[0].length;

        // Step 1: Convert each row to a bitmask
        int[] rowMasks = new int[m];
        for (int i = 0; i < m; i++) {
            int mask = 0;
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    mask |= (1 << j);  // Set the j-th bit
                }
            }
            rowMasks[i] = mask;
        }

        int maxCovered = 0;

        // Step 2: Try all possible column selections
        // Total possibilities: 2^n (since n ≤ 12, max 4096)
        for (int selection = 0; selection < (1 << n); selection++) {
            // Step 3: Check if we selected exactly numSelect columns
            if (Integer.bitCount(selection) != numSelect) {
                continue;  // Skip if not exactly numSelect columns
            }

            // Step 4: Count how many rows are covered by this selection
            int covered = 0;
            for (int rowMask : rowMasks) {
                // A row is covered if ALL its 1-bits are in the selection
                if ((rowMask & selection) == rowMask) {
                    covered++;
                }
            }

            // Step 5: Update maximum
            maxCovered = Math.max(maxCovered, covered);
        }

        return maxCovered;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n + m × 2^n)

- `m × n`: Convert each row to a bitmask (process each cell once)
- `m × 2^n`: For each of the 2^n possible column selections, check all m rows
- Since n ≤ 12 (from problem constraints), 2^n ≤ 4096, making this feasible

**Space Complexity:** O(m)

- We store a bitmask for each of the m rows
- The selection iteration uses O(1) extra space

The constraint n ≤ 12 is crucial — it makes the exponential 2^n term manageable. Without this constraint, the problem would be much harder (likely NP-hard).

## Common Mistakes

1. **Incorrect coverage check**: Using `(row_mask & selection) > 0` instead of `(row_mask & selection) == row_mask`. The former checks if ANY 1 is covered, but we need ALL 1's covered.

2. **Not handling numSelect = 0**: When numSelect is 0, we can only cover rows that have no 1's (all zeros). The solution handles this correctly since selection=0 has 0 bits set.

3. **Inefficient bit counting**: Some candidates manually count bits in O(n) time for each selection. While acceptable here (n ≤ 12), using built-in functions like `Integer.bitCount()` or `bin().count('1')` is cleaner.

4. **Missing the n ≤ 12 constraint**: Trying to solve for larger n with this approach would timeout. Always check problem constraints before deciding on an exponential solution.

## When You'll See This Pattern

This problem uses **bitmask enumeration** and **subset checking**, patterns common in:

1. **Maximum Product of Word Lengths** (LeetCode 318): Uses bitmasks to represent letters in words, then checks for disjoint masks with bitwise AND.

2. **Smallest Sufficient Team** (LeetCode 1125): Similar bitmask DP where you select people to cover required skills.

3. **Partition to K Equal Sum Subsets** (LeetCode 698): Uses bitmask DP to track which elements have been used.

The pattern appears when:

- You need to select subsets from a small set (n ≤ 20)
- You need to check coverage/containment relationships
- The problem has combinatorial nature but small enough for brute force

## Key Takeaways

1. **Bitmask representation is powerful for small sets**: When n ≤ 20, consider representing subsets as bitmasks. Operations like checking subset relationships become O(1) bitwise operations.

2. **Constraint analysis is crucial**: The n ≤ 12 constraint signals that O(2^n) solutions are acceptable. Always check constraints before designing your solution.

3. **Coverage vs. intersection**: Remember that covering all elements of a set means the selection must be a superset, not just have non-empty intersection. The bitwise check `(A & B) == A` tests if B contains all bits of A.

Related problems: [Matchsticks to Square](/problem/matchsticks-to-square), [Partition to K Equal Sum Subsets](/problem/partition-to-k-equal-sum-subsets), [Find the Shortest Superstring](/problem/find-the-shortest-superstring)
