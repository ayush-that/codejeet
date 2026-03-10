---
title: "How to Solve Reconstruct a 2-Row Binary Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reconstruct a 2-Row Binary Matrix. Medium difficulty, 48.7% acceptance rate. Topics: Array, Greedy, Matrix."
date: "2029-02-28"
category: "dsa-patterns"
tags: ["reconstruct-a-2-row-binary-matrix", "array", "greedy", "matrix", "medium"]
---

# How to Solve Reconstruct a 2-Row Binary Matrix

You're given the number of columns `n`, the sum of the upper row `upper`, the sum of the lower row `lower`, and a special array `colsum` where each element tells you the sum of the two rows in that column. Your task is to reconstruct the 2×n binary matrix, or return an empty array if it's impossible. The challenge lies in satisfying three constraints simultaneously: each column sum must match `colsum[i]`, the total of the upper row must equal `upper`, and the total of the lower row must equal `lower`. This problem tests your ability to handle multiple constraints with greedy allocation.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `upper = 2`, `lower = 1`
- `colsum = [1,1,1]` (so `n = 3`)

We need to fill a 2×3 matrix where:

- Column 0 sum = 1, Column 1 sum = 1, Column 2 sum = 1
- Total of row 0 = 2
- Total of row 1 = 1

**Step 1: Identify easy columns first**

- If `colsum[i] = 2`, both rows must be 1. This consumes 1 from both `upper` and `lower`.
- If `colsum[i] = 0`, both rows must be 0. This consumes nothing.
- If `colsum[i] = 1`, we have a choice: put 1 in upper row OR lower row.

**Step 2: Process our example**
No columns have sum 2 or 0, so all three columns have sum 1. We need to allocate these three "flexible" 1's between the two rows such that row 0 gets 2 total and row 1 gets 1 total.

**Step 3: Greedy allocation**
We can start by giving row 0 as many 1's as possible from the flexible columns:

- Column 0: Put 1 in upper row → upper becomes 1, lower stays 0
- Column 1: Put 1 in upper row → upper becomes 2, lower stays 0
- Column 2: Now upper is satisfied (2), so put 1 in lower row → lower becomes 1

Result matrix:

```
Upper: [1, 1, 0]
Lower: [0, 0, 1]
```

Check: Column sums are [1,1,1] ✓, Upper total = 2 ✓, Lower total = 1 ✓

The key insight: We should handle `colsum[i] = 2` columns first (they're forced), then allocate `colsum[i] = 1` columns greedily to whichever row still needs more 1's.

## Brute Force Approach

A naive approach would try all possible combinations for columns with `colsum[i] = 1`. For each such column, we have 2 choices (1 in upper or 1 in lower). With `k` columns of sum 1, that's 2^k possibilities. We'd generate each combination, check if the row sums match `upper` and `lower`, and return the first valid matrix.

Why this fails:

- Exponential time: O(2^k) where k ≤ n
- n can be up to 10^5, making brute force impossible
- Even for smaller n, this approach doesn't leverage the problem's structure

The brute force helps us understand the search space but isn't practical. We need a deterministic, linear-time solution.

## Optimized Approach

The optimal solution uses **greedy allocation with two passes**:

**Key Insight 1: Fixed columns dictate requirements**

- Columns with `colsum[i] = 2` consume 1 from both `upper` and `lower`
- Columns with `colsum[i] = 0` consume nothing
- After handling these, we know how many more 1's each row needs from the flexible columns

**Key Insight 2: Allocation strategy for flexible columns**
After counting fixed columns:

1. Calculate remaining needs: `upper_remaining = upper - count2`, `lower_remaining = lower - count2`
2. For each column with `colsum[i] = 1`:
   - If `upper_remaining > 0`, put 1 in upper row (helps satisfy upper requirement)
   - Otherwise, put 1 in lower row (upper is already satisfied)

**Why this greedy approach works:**

- We prioritize satisfying the upper row first because the order doesn't matter for validity
- As long as `upper_remaining + lower_remaining = count1` (the number of flexible columns), a solution exists
- This allocation is optimal because it never wastes a flexible column - each goes to a row that still needs it

**Validation check:**
A solution exists if and only if:

1. `upper + lower = sum(colsum)` (total 1's match)
2. `upper ≤ count2 + count1` and `lower ≤ count2 + count1` (each row can't need more 1's than available)
3. `upper ≥ count2` and `lower ≥ count2` (each row needs at least the forced 1's from sum=2 columns)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result matrix
def reconstructMatrix(upper, lower, colsum):
    """
    Reconstructs a 2-row binary matrix given row sums and column sums.

    Args:
        upper: Target sum for the first row
        lower: Target sum for the second row
        colsum: List of column sums (each is 0, 1, or 2)

    Returns:
        2D list representing the matrix, or empty list if impossible
    """
    n = len(colsum)

    # Initialize the result matrix with zeros
    result = [[0] * n for _ in range(2)]

    # First pass: handle columns with sum = 2 (both rows must be 1)
    count2 = 0
    for i in range(n):
        if colsum[i] == 2:
            result[0][i] = 1
            result[1][i] = 1
            upper -= 1  # Consume one from upper's requirement
            lower -= 1  # Consume one from lower's requirement
            count2 += 1

    # Check if we've already exceeded requirements (negative means impossible)
    if upper < 0 or lower < 0:
        return []

    # Second pass: handle columns with sum = 1 (choose which row gets the 1)
    for i in range(n):
        if colsum[i] == 1:
            if upper > 0:
                # Give to upper row if it still needs more 1's
                result[0][i] = 1
                upper -= 1
            else:
                # Otherwise give to lower row
                result[1][i] = 1
                lower -= 1

    # Final validation: both row sums should be exactly satisfied
    if upper == 0 and lower == 0:
        return result
    else:
        return []
```

```javascript
// Time: O(n) | Space: O(n) for the result matrix
function reconstructMatrix(upper, lower, colsum) {
  const n = colsum.length;

  // Initialize the result matrix with zeros
  const result = [new Array(n).fill(0), new Array(n).fill(0)];

  // First pass: handle columns with sum = 2 (both rows must be 1)
  let count2 = 0;
  for (let i = 0; i < n; i++) {
    if (colsum[i] === 2) {
      result[0][i] = 1;
      result[1][i] = 1;
      upper--; // Consume one from upper's requirement
      lower--; // Consume one from lower's requirement
      count2++;
    }
  }

  // Check if we've already exceeded requirements (negative means impossible)
  if (upper < 0 || lower < 0) {
    return [];
  }

  // Second pass: handle columns with sum = 1 (choose which row gets the 1)
  for (let i = 0; i < n; i++) {
    if (colsum[i] === 1) {
      if (upper > 0) {
        // Give to upper row if it still needs more 1's
        result[0][i] = 1;
        upper--;
      } else {
        // Otherwise give to lower row
        result[1][i] = 1;
        lower--;
      }
    }
  }

  // Final validation: both row sums should be exactly satisfied
  if (upper === 0 && lower === 0) {
    return result;
  } else {
    return [];
  }
}
```

```java
// Time: O(n) | Space: O(n) for the result matrix
import java.util.*;

class Solution {
    public List<List<Integer>> reconstructMatrix(int upper, int lower, int[] colsum) {
        int n = colsum.length;

        // Initialize the result matrix with zeros
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>(Collections.nCopies(n, 0)));
        result.add(new ArrayList<>(Collections.nCopies(n, 0)));

        // First pass: handle columns with sum = 2 (both rows must be 1)
        int count2 = 0;
        for (int i = 0; i < n; i++) {
            if (colsum[i] == 2) {
                result.get(0).set(i, 1);
                result.get(1).set(i, 1);
                upper--;  // Consume one from upper's requirement
                lower--;  // Consume one from lower's requirement
                count2++;
            }
        }

        // Check if we've already exceeded requirements (negative means impossible)
        if (upper < 0 || lower < 0) {
            return new ArrayList<>();
        }

        // Second pass: handle columns with sum = 1 (choose which row gets the 1)
        for (int i = 0; i < n; i++) {
            if (colsum[i] == 1) {
                if (upper > 0) {
                    // Give to upper row if it still needs more 1's
                    result.get(0).set(i, 1);
                    upper--;
                } else {
                    // Otherwise give to lower row
                    result.get(1).set(i, 1);
                    lower--;
                }
            }
        }

        // Final validation: both row sums should be exactly satisfied
        if (upper == 0 && lower == 0) {
            return result;
        } else {
            return new ArrayList<>();
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the `colsum` array
- First pass handles columns with sum = 2
- Second pass handles columns with sum = 1
- Each pass does constant work per column

**Space Complexity: O(n)**

- We store the result matrix which has 2 rows and n columns
- This is O(2n) = O(n)
- We could optimize to O(1) extra space by modifying the input if allowed, but typically we need to return the matrix

The space is optimal because we must return the matrix itself, which requires O(n) space to represent.

## Common Mistakes

1. **Not checking validity early**: Some candidates process all columns first, then check if `upper` and `lower` are satisfied. It's better to check after handling `colsum[i] = 2` columns since if `upper` or `lower` goes negative at that point, the problem is impossible.

2. **Incorrect allocation order**: Allocating `colsum[i] = 1` columns randomly or always to the same row can fail. The greedy approach of giving to the row with higher remaining need (starting with upper) guarantees a solution if one exists.

3. **Forgetting to validate total sum**: A valid solution must have `upper + lower = sum(colsum)`. While our algorithm implicitly checks this through the final `upper == 0 && lower == 0` condition, explicitly checking this first can provide an early exit.

4. **Off-by-one with array indices**: When working with 2D arrays in different languages, remember that Python uses `result[0][i]`, JavaScript uses `result[0][i]`, and Java uses `result.get(0).set(i, value)`.

## When You'll See This Pattern

This **greedy allocation with constraints** pattern appears in problems where you need to distribute limited resources to satisfy multiple requirements:

1. **Find Valid Matrix Given Row and Column Sums (Medium)** - Very similar! Instead of 2 rows, you have an m×n matrix with given row and column sums. The solution uses a similar greedy approach: for each cell, put the minimum of the remaining row sum and column sum.

2. **Task Scheduler (Medium)** - While different on the surface, it also involves allocating limited resources (CPU cycles) to satisfy constraints (cooldown periods).

3. **Split Array into Consecutive Subsequences (Medium)** - Requires greedy allocation of numbers to sequences while maintaining consecutive property.

The core pattern: when you have multiple constraints and need to make local decisions that don't violate global requirements, greedy allocation often works if you process items in the right order.

## Key Takeaways

1. **Handle forced choices first**: When some decisions are predetermined (like `colsum[i] = 2` requiring both rows to be 1), process these first. They reduce your flexibility but clarify what remains to be allocated.

2. **Greedy works with the right ordering**: For flexible choices (`colsum[i] = 1`), allocate to the most constrained resource first. Here, we gave to the upper row while it still needed 1's, then to the lower row.

3. **Validate as you go**: Check constraints incrementally rather than at the end. If `upper` or `lower` becomes negative after processing forced columns, return immediately.

Related problems: [Find Valid Matrix Given Row and Column Sums](/problem/find-valid-matrix-given-row-and-column-sums)
