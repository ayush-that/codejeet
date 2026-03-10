---
title: "How to Solve Equal Row and Column Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Equal Row and Column Pairs. Medium difficulty, 70.8% acceptance rate. Topics: Array, Hash Table, Matrix, Simulation."
date: "2027-08-08"
category: "dsa-patterns"
tags: ["equal-row-and-column-pairs", "array", "hash-table", "matrix", "medium"]
---

# How to Solve Equal Row and Column Pairs

You're given an n×n matrix and need to count how many row-column pairs contain identical elements in the same order. What makes this problem interesting is that while the brute force approach is straightforward, the optimal solution requires recognizing that we can preprocess data to avoid redundant comparisons—a common pattern in matrix problems where comparing all pairs would be too slow.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
grid = [[3,2,1],
        [1,7,6],
        [2,7,7]]
```

We need to count pairs (row i, column j) where the entire row equals the entire column.

**Step-by-step comparison:**

- Row 0: [3,2,1] vs Column 0: [3,1,2] → Not equal
- Row 0: [3,2,1] vs Column 1: [2,7,7] → Not equal
- Row 0: [3,2,1] vs Column 2: [1,6,7] → Not equal
- Row 1: [1,7,6] vs Column 0: [3,1,2] → Not equal
- Row 1: [1,7,6] vs Column 1: [2,7,7] → Not equal
- Row 1: [1,7,6] vs Column 2: [1,6,7] → Not equal
- Row 2: [2,7,7] vs Column 0: [3,1,2] → Not equal
- Row 2: [2,7,7] vs Column 1: [2,7,7] → ✓ Equal! (count = 1)
- Row 2: [2,7,7] vs Column 2: [1,6,7] → Not equal

**Result:** 1 matching pair (row 2, column 1)

The challenge is doing this efficiently for larger matrices without comparing every row with every column directly.

## Brute Force Approach

The most straightforward solution compares each row with each column element-by-element:

1. For each row i (0 to n-1)
2. For each column j (0 to n-1)
3. Compare all n elements of row i with column j
4. If all elements match, increment count

This requires O(n³) time because we have n² pairs and each comparison checks n elements. For n=1000, that's 1 billion operations—far too slow.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def equalPairsBrute(grid):
    n = len(grid)
    count = 0

    # Compare every row with every column
    for i in range(n):          # For each row
        for j in range(n):      # For each column
            match = True

            # Compare each element in row i with column j
            for k in range(n):
                if grid[i][k] != grid[k][j]:
                    match = False
                    break

            if match:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function equalPairsBrute(grid) {
  const n = grid.length;
  let count = 0;

  // Compare every row with every column
  for (let i = 0; i < n; i++) {
    // For each row
    for (let j = 0; j < n; j++) {
      // For each column
      let match = true;

      // Compare each element in row i with column j
      for (let k = 0; k < n; k++) {
        if (grid[i][k] !== grid[k][j]) {
          match = false;
          break;
        }
      }

      if (match) count++;
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int equalPairsBrute(int[][] grid) {
    int n = grid.length;
    int count = 0;

    // Compare every row with every column
    for (int i = 0; i < n; i++) {          // For each row
        for (int j = 0; j < n; j++) {      // For each column
            boolean match = true;

            // Compare each element in row i with column j
            for (int k = 0; k < n; k++) {
                if (grid[i][k] != grid[k][j]) {
                    match = false;
                    break;
                }
            }

            if (match) count++;
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to compare each row with each column directly. Instead:

1. **Convert rows and columns to hashable representations** (like tuples or strings) so we can count their frequencies
2. **Store all rows in a hash map** with their counts
3. **For each column**, check if its representation exists in the row map
4. **Multiply frequencies** - if a row pattern appears 3 times and a column has the same pattern, that creates 3 matches

Why this works: If row pattern X appears 3 times and column pattern X appears 2 times, there are 3×2 = 6 valid (row, column) pairs where they match.

This reduces the problem from O(n³) to O(n²) since we process each row and column once, and hash map lookups are O(1).

## Optimal Solution

Here's the efficient implementation using hash maps:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def equalPairs(grid):
    n = len(grid)
    row_counter = {}

    # Step 1: Convert each row to a tuple and count frequencies
    # Tuples are hashable and can be used as dictionary keys
    for i in range(n):
        # Convert the entire row to a tuple
        row_tuple = tuple(grid[i])
        # Increment count for this row pattern
        row_counter[row_tuple] = row_counter.get(row_tuple, 0) + 1

    count = 0

    # Step 2: For each column, convert to tuple and check against row patterns
    for j in range(n):
        # Build column tuple by collecting j-th element from each row
        col_tuple = tuple(grid[i][j] for i in range(n))

        # If this column pattern exists in row patterns, add its frequency
        if col_tuple in row_counter:
            count += row_counter[col_tuple]

    return count
```

```javascript
// Time: O(n²) | Space: O(n²)
function equalPairs(grid) {
  const n = grid.length;
  const rowCounter = new Map();

  // Step 1: Convert each row to a string and count frequencies
  // Strings are hashable in JavaScript Maps
  for (let i = 0; i < n; i++) {
    const rowStr = grid[i].join(",");
    // Increment count for this row pattern
    rowCounter.set(rowStr, (rowCounter.get(rowStr) || 0) + 1);
  }

  let count = 0;

  // Step 2: For each column, convert to string and check against row patterns
  for (let j = 0; j < n; j++) {
    // Build column array by collecting j-th element from each row
    const colArray = [];
    for (let i = 0; i < n; i++) {
      colArray.push(grid[i][j]);
    }
    const colStr = colArray.join(",");

    // If this column pattern exists in row patterns, add its frequency
    if (rowCounter.has(colStr)) {
      count += rowCounter.get(colStr);
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(n²)
public int equalPairs(int[][] grid) {
    int n = grid.length;
    Map<String, Integer> rowCounter = new HashMap<>();

    // Step 1: Convert each row to a string and count frequencies
    for (int i = 0; i < n; i++) {
        StringBuilder rowBuilder = new StringBuilder();
        for (int j = 0; j < n; j++) {
            rowBuilder.append(grid[i][j]);
            if (j < n - 1) rowBuilder.append(",");
        }
        String rowStr = rowBuilder.toString();
        rowCounter.put(rowStr, rowCounter.getOrDefault(rowStr, 0) + 1);
    }

    int count = 0;

    // Step 2: For each column, convert to string and check against row patterns
    for (int j = 0; j < n; j++) {
        StringBuilder colBuilder = new StringBuilder();
        for (int i = 0; i < n; i++) {
            colBuilder.append(grid[i][j]);
            if (i < n - 1) colBuilder.append(",");
        }
        String colStr = colBuilder.toString();

        // If this column pattern exists in row patterns, add its frequency
        if (rowCounter.containsKey(colStr)) {
            count += rowCounter.get(colStr);
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We iterate through all n rows once: O(n × n) = O(n²) to build row representations
- We iterate through all n columns once: O(n × n) = O(n²) to build column representations
- Hash map operations (insert and lookup) are O(1) on average
- Total: O(n² + n²) = O(n²)

**Space Complexity: O(n²)**

- We store up to n row representations in the hash map
- Each representation is a string/tuple of length n, so n × n = O(n²) in worst case
- In practice, if there are duplicate rows, we use less space

## Common Mistakes

1. **Forgetting to multiply frequencies**: If row pattern X appears 3 times and column pattern X appears 2 times, the answer is 6, not 1. Candidates often just increment by 1 when they find a match instead of adding the frequency.

2. **Using lists as dictionary keys**: In Python, lists aren't hashable. You must convert to tuples. In Java/JavaScript, you need to convert to strings or use custom objects with proper hashCode/equals.

3. **Incorrect column construction**: When building column representations, it's easy to accidentally use `grid[j][i]` instead of `grid[i][j]`. Remember: first index is row, second is column.

4. **Not handling empty matrix**: While the problem guarantees n ≥ 1, in interviews you might be asked about edge cases. An empty matrix should return 0.

## When You'll See This Pattern

This "convert to hashable representation and count frequencies" pattern appears in many problems:

1. **Group Anagrams (LeetCode 49)**: Convert each string to a sorted version or character count array, then group by this representation.

2. **Find All Duplicates in Array (LeetCode 442)**: While not identical, it uses frequency counting in arrays.

3. **Brick Wall (LeetCode 554)**: Count frequencies of prefix sums to find where to draw a vertical line.

The core idea is: when direct comparison is expensive, create a "fingerprint" or "signature" for each element that captures what matters for comparison, then use hash maps for efficient lookups.

## Key Takeaways

1. **When comparing complex structures, consider hashing**: If you need to compare rows/columns/strings frequently, convert them to a hashable form and use a hash map to avoid O(n) comparisons each time.

2. **Frequency multiplication for pair counting**: When counting pairs between two groups where order matters (row, column), multiply frequencies: count += freqA × freqB.

3. **Matrix traversal patterns**: Remember that `grid[i][j]` gives you element at row i, column j. Columns are vertical: all elements with same j index across different i values.

Related problems: [Delete Greatest Value in Each Row](/problem/delete-greatest-value-in-each-row)
