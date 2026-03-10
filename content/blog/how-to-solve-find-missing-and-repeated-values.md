---
title: "How to Solve Find Missing and Repeated Values — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Missing and Repeated Values. Easy difficulty, 83.3% acceptance rate. Topics: Array, Hash Table, Math, Matrix."
date: "2027-11-20"
category: "dsa-patterns"
tags: ["find-missing-and-repeated-values", "array", "hash-table", "math", "easy"]
---

# How to Solve Find Missing and Repeated Values

You're given an n×n matrix containing numbers from 1 to n², where one number appears twice and another is missing. Your task is to find both the duplicate and missing numbers. What makes this problem interesting is that while it seems like a typical "find duplicate and missing" problem, the 2D matrix format adds a layer of complexity that requires careful handling of indices and mathematical relationships.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider a 3×3 matrix (n=3, so numbers should be 1-9):

```
grid = [[1, 3, 2],
        [9, 4, 5],
        [8, 6, 8]]
```

**Step 1: Understand what we're looking for**

- Numbers should be 1 through 9 (since n² = 9)
- One number appears twice (we can see it's 8)
- One number is missing (let's find out which)

**Step 2: Flatten the matrix mentally**
We can think of all values as: [1, 3, 2, 9, 4, 5, 8, 6, 8]

**Step 3: Find the duplicate**
If we track occurrences, we see 8 appears twice. So `a = 8`

**Step 4: Find the missing number**
The sum of numbers 1-9 is: 1+2+3+4+5+6+7+8+9 = 45
The actual sum of our flattened values is: 1+3+2+9+4+5+8+6+8 = 46
The difference is 46 - 45 = 1
But wait, we have a duplicate (8) instead of some missing number. The actual relationship is:
`actual_sum - expected_sum = duplicate - missing`
So: 46 - 45 = 8 - missing → 1 = 8 - missing → missing = 7

**Step 5: Verify**
Numbers present: 1, 2, 3, 4, 5, 6, 8, 8, 9
Missing: 7 ✓
Duplicate: 8 ✓

## Brute Force Approach

A naive approach would be:

1. Flatten the matrix into a 1D array
2. Count frequency of each number using a dictionary
3. The number with count 2 is the duplicate
4. Find which number from 1 to n² doesn't appear (by checking the dictionary)

While this works, it requires O(n²) space for the frequency map. We can do better by using mathematical properties to solve in O(1) space.

However, there's an even simpler brute force: for each number from 1 to n², count how many times it appears in the matrix by scanning the entire matrix. This takes O(n⁴) time (check n² numbers, each requiring n² checks), which is clearly impractical for any reasonable n.

## Optimal Solution

The optimal solution uses mathematical relationships to find both numbers in O(n²) time with O(1) space. The key insight is that we can compute:

1. The difference between actual sum and expected sum: `sum_diff = actual_sum - expected_sum`
2. The difference between actual sum of squares and expected sum of squares: `sq_diff = actual_sq_sum - expected_sq_sum`

These give us two equations:

1. `sum_diff = a - b` (where a is duplicate, b is missing)
2. `sq_diff = a² - b² = (a - b)(a + b)`

From these, we can solve for a and b:

- `a + b = sq_diff / sum_diff`
- Then solve the system: `a - b = sum_diff` and `a + b = sq_diff / sum_diff`

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def findMissingAndRepeatedValues(grid):
    """
    Find the duplicate and missing numbers in an n×n matrix.

    Approach: Use mathematical relationships between sums and sums of squares.
    For numbers 1 to n², with duplicate 'a' and missing 'b':
    1. sum_diff = actual_sum - expected_sum = a - b
    2. sq_diff = actual_sq_sum - expected_sq_sum = a² - b² = (a - b)(a + b)
    From these, we can solve for a and b.
    """
    n = len(grid)
    total_elements = n * n

    # Calculate expected sum and sum of squares for numbers 1 to n²
    expected_sum = total_elements * (total_elements + 1) // 2
    expected_sq_sum = total_elements * (total_elements + 1) * (2 * total_elements + 1) // 6

    # Initialize actual sums
    actual_sum = 0
    actual_sq_sum = 0

    # Traverse the entire matrix to compute actual sums
    for i in range(n):
        for j in range(n):
            val = grid[i][j]
            actual_sum += val
            actual_sq_sum += val * val

    # Calculate differences
    sum_diff = actual_sum - expected_sum  # This equals a - b
    sq_diff = actual_sq_sum - expected_sq_sum  # This equals a² - b²

    # From algebra: a² - b² = (a - b)(a + b)
    # So: a + b = sq_diff / sum_diff
    sum_ab = sq_diff // sum_diff  # Integer division is safe here

    # Now we have:
    # a - b = sum_diff
    # a + b = sum_ab
    # Solve this system of equations:
    a = (sum_diff + sum_ab) // 2  # (a-b)+(a+b) = 2a, divide by 2
    b = (sum_ab - sum_diff) // 2  # (a+b)-(a-b) = 2b, divide by 2

    return [a, b]
```

```javascript
// Time: O(n²) | Space: O(1)
/**
 * Find the duplicate and missing numbers in an n×n matrix.
 *
 * Approach: Use mathematical relationships between sums and sums of squares.
 * For numbers 1 to n², with duplicate 'a' and missing 'b':
 * 1. sum_diff = actual_sum - expected_sum = a - b
 * 2. sq_diff = actual_sq_sum - expected_sq_sum = a² - b² = (a - b)(a + b)
 * From these, we can solve for a and b.
 */
function findMissingAndRepeatedValues(grid) {
  const n = grid.length;
  const totalElements = n * n;

  // Calculate expected sum and sum of squares for numbers 1 to n²
  const expectedSum = (totalElements * (totalElements + 1)) / 2;
  const expectedSqSum = (totalElements * (totalElements + 1) * (2 * totalElements + 1)) / 6;

  // Initialize actual sums
  let actualSum = 0;
  let actualSqSum = 0;

  // Traverse the entire matrix to compute actual sums
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const val = grid[i][j];
      actualSum += val;
      actualSqSum += val * val;
    }
  }

  // Calculate differences
  const sumDiff = actualSum - expectedSum; // This equals a - b
  const sqDiff = actualSqSum - expectedSqSum; // This equals a² - b²

  // From algebra: a² - b² = (a - b)(a + b)
  // So: a + b = sqDiff / sumDiff
  const sumAB = sqDiff / sumDiff; // Division is safe here, result is integer

  // Now we have:
  // a - b = sumDiff
  // a + b = sumAB
  // Solve this system of equations:
  const a = (sumDiff + sumAB) / 2; // (a-b)+(a+b) = 2a, divide by 2
  const b = (sumAB - sumDiff) / 2; // (a+b)-(a-b) = 2b, divide by 2

  return [a, b];
}
```

```java
// Time: O(n²) | Space: O(1)
/**
 * Find the duplicate and missing numbers in an n×n matrix.
 *
 * Approach: Use mathematical relationships between sums and sums of squares.
 * For numbers 1 to n², with duplicate 'a' and missing 'b':
 * 1. sum_diff = actual_sum - expected_sum = a - b
 * 2. sq_diff = actual_sq_sum - expected_sq_sum = a² - b² = (a - b)(a + b)
 * From these, we can solve for a and b.
 */
public int[] findMissingAndRepeatedValues(int[][] grid) {
    int n = grid.length;
    long totalElements = n * n;  // Use long to avoid overflow for large n

    // Calculate expected sum and sum of squares for numbers 1 to n²
    long expectedSum = totalElements * (totalElements + 1) / 2;
    long expectedSqSum = totalElements * (totalElements + 1) * (2 * totalElements + 1) / 6;

    // Initialize actual sums
    long actualSum = 0;
    long actualSqSum = 0;

    // Traverse the entire matrix to compute actual sums
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            long val = grid[i][j];
            actualSum += val;
            actualSqSum += val * val;
        }
    }

    // Calculate differences
    long sumDiff = actualSum - expectedSum;  // This equals a - b
    long sqDiff = actualSqSum - expectedSqSum;  // This equals a² - b²

    // From algebra: a² - b² = (a - b)(a + b)
    // So: a + b = sqDiff / sumDiff
    long sumAB = sqDiff / sumDiff;  // Integer division is safe here

    // Now we have:
    // a - b = sumDiff
    // a + b = sumAB
    // Solve this system of equations:
    long a = (sumDiff + sumAB) / 2;  // (a-b)+(a+b) = 2a, divide by 2
    long b = (sumAB - sumDiff) / 2;  // (a+b)-(a-b) = 2b, divide by 2

    return new int[]{(int) a, (int) b};
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We traverse each cell of the n×n matrix exactly once to compute the sums
- Each operation inside the loop is O(1)
- The mathematical computations outside the loop are also O(1)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables (n, sums, differences)
- No additional data structures that grow with input size

## Common Mistakes

1. **Integer overflow**: For large n (like n=1000, n²=1,000,000), the sum of squares can be huge (~3.3×10¹⁷). Using 32-bit integers will overflow. Always use 64-bit integers (long in Java/C++, long long in C, regular integers are fine in Python).

2. **Confusing which is duplicate vs missing**: The equations give you `a - b = sum_diff`. If `sum_diff` is positive, then `a > b` (duplicate > missing). If negative, then `a < b` (duplicate < missing). Our solution handles both cases correctly.

3. **Forgetting the matrix is 0-indexed but values are 1-indexed**: The problem states values are in range [1, n²], but the matrix indexing is 0-based. This doesn't affect our solution since we're just reading values, but it's important to remember when thinking about the problem.

4. **Division by zero**: In theory, `sum_diff` could be zero if duplicate equals missing, but by problem definition (one appears twice, one is missing), this can't happen. The duplicate and missing must be different numbers.

## When You'll See This Pattern

This "sum and sum of squares" technique appears in several related problems:

1. **Missing Number (LeetCode 268)**: Find the missing number in an array containing n distinct numbers from 0 to n. The simpler version uses just the sum difference.

2. **Find the Duplicate Number (LeetCode 287)**: Find the duplicate in an array of n+1 integers where each integer is between 1 and n. This has a cycle detection solution, but the sum approach is a starting point.

3. **Set Mismatch (LeetCode 645)**: Almost identical to this problem but for a 1D array - find the duplicate and missing numbers in an array representing a set of numbers from 1 to n.

The core pattern is: when you need to find anomalies (duplicate, missing, or both) in a sequence of numbers, consider using mathematical properties of sums, XOR, or other aggregate operations that can give you equations to solve.

## Key Takeaways

1. **Mathematical relationships can replace hash tables**: Instead of O(n) space for frequency counting, we can often use O(1) space by leveraging properties like sum differences. This is especially useful in interview settings where optimal space complexity matters.

2. **The sum of squares trick extends the approach**: When you need to find two unknown values (like duplicate and missing), one equation (from regular sums) isn't enough. Adding sum of squares gives you a second independent equation, allowing you to solve for both unknowns.

3. **Always consider integer overflow**: When dealing with sums of sequences, especially squares, the numbers can get large quickly. Use appropriate data types (64-bit integers) to handle worst-case inputs.

[Practice this problem on CodeJeet](/problem/find-missing-and-repeated-values)
