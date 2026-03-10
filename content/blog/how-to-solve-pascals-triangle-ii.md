---
title: "How to Solve Pascal's Triangle II — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Pascal's Triangle II. Easy difficulty, 67.1% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-09-04"
category: "dsa-patterns"
tags: ["pascals-triangle-ii", "array", "dynamic-programming", "easy"]
---

# How to Solve Pascal's Triangle II

Pascal's Triangle II asks us to return a specific row of Pascal's triangle given its 0-indexed row number. While the problem seems straightforward, the challenge lies in generating the row efficiently without storing the entire triangle. The key insight is that each row can be built directly from the previous row using a clever in-place update technique.

## Visual Walkthrough

Let's trace through generating row 4 (0-indexed) of Pascal's triangle. Remember that row 0 is `[1]`, row 1 is `[1, 1]`, row 2 is `[1, 2, 1]`, and so on.

**Goal:** Generate row 4 directly without storing previous rows.

We start with row 0: `[1]`

To get row 1 from row 0:

- We need a row of length 2
- First element is always 1
- Last element is always 1
- For row 1, there are no middle elements

To get row 2 from row 1 `[1, 1]`:

- We need a row of length 3
- First element: 1
- Middle element: sum of the two elements from previous row = 1 + 1 = 2
- Last element: 1
- Result: `[1, 2, 1]`

The pattern emerges: to get the next row, we can start with `[1]`, then for each position from 1 to n-1, add the current and previous elements from the previous row. However, there's a more efficient way: we can build the row in-place from right to left!

For row 4, we'll build it step by step:

1. Start with row 0: `[1]`
2. To get row 1: `[1, 1]` (add a 1 at the end)
3. To get row 2 from `[1, 1]`:
   - Work backwards: last element stays 1
   - Middle element = current middle (1) + previous element (1) = 2
   - First element stays 1
   - Result: `[1, 2, 1]`
4. To get row 3 from `[1, 2, 1]`:
   - Add a 1 at the end: `[1, 2, 1, 1]`
   - Work backwards from second-to-last to first:
     - Position 2: current 1 + previous 2 = 3 → `[1, 2, 3, 1]`
     - Position 1: current 2 + previous 1 = 3 → `[1, 3, 3, 1]`
5. To get row 4 from `[1, 3, 3, 1]`:
   - Add a 1 at the end: `[1, 3, 3, 1, 1]`
   - Work backwards:
     - Position 3: current 1 + previous 3 = 4 → `[1, 3, 3, 4, 1]`
     - Position 2: current 3 + previous 3 = 6 → `[1, 3, 6, 4, 1]`
     - Position 1: current 3 + previous 1 = 4 → `[1, 4, 6, 4, 1]`

Final result for row 4: `[1, 4, 6, 4, 1]`

## Brute Force Approach

The most intuitive brute force approach would be to generate the entire Pascal's triangle up to the requested row and then return the last row. This involves:

1. Create a list to store all rows
2. For each row from 0 to rowIndex:
   - Create a new row
   - Set first and last elements to 1
   - For middle elements, sum the two elements from the previous row
3. Return the last row

While this approach works, it uses O(n²) time and O(n²) space, where n is the row index. The space complexity is particularly wasteful since we only need one row, not the entire triangle.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def getRowBruteForce(rowIndex):
    # Initialize triangle with first row
    triangle = [[1]]

    # Generate each row up to rowIndex
    for i in range(1, rowIndex + 1):
        row = [1]  # First element is always 1

        # Calculate middle elements
        for j in range(1, i):
            # Sum of two elements from previous row
            row.append(triangle[i-1][j-1] + triangle[i-1][j])

        row.append(1)  # Last element is always 1
        triangle.append(row)

    return triangle[rowIndex]
```

```javascript
// Time: O(n²) | Space: O(n²)
function getRowBruteForce(rowIndex) {
  // Initialize triangle with first row
  const triangle = [[1]];

  // Generate each row up to rowIndex
  for (let i = 1; i <= rowIndex; i++) {
    const row = [1]; // First element is always 1

    // Calculate middle elements
    for (let j = 1; j < i; j++) {
      // Sum of two elements from previous row
      row.push(triangle[i - 1][j - 1] + triangle[i - 1][j]);
    }

    row.push(1); // Last element is always 1
    triangle.push(row);
  }

  return triangle[rowIndex];
}
```

```java
// Time: O(n²) | Space: O(n²)
public List<Integer> getRowBruteForce(int rowIndex) {
    // Initialize triangle with first row
    List<List<Integer>> triangle = new ArrayList<>();
    triangle.add(Arrays.asList(1));

    // Generate each row up to rowIndex
    for (int i = 1; i <= rowIndex; i++) {
        List<Integer> row = new ArrayList<>();
        row.add(1);  // First element is always 1

        // Calculate middle elements
        for (int j = 1; j < i; j++) {
            // Sum of two elements from previous row
            int sum = triangle.get(i-1).get(j-1) + triangle.get(i-1).get(j);
            row.add(sum);
        }

        row.add(1);  // Last element is always 1
        triangle.add(row);
    }

    return triangle.get(rowIndex);
}
```

</div>

## Optimal Solution

The optimal solution uses dynamic programming with O(n) space by building the row in-place from right to left. The key insight is that when we're calculating a new row, each element (except the first and last) is the sum of the element above it and the element to the left of that one. By working backwards, we can update the row in place without needing additional storage.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) - only storing the result row
def getRow(rowIndex):
    # Initialize the row with 1's
    # Row i has i+1 elements, all starting as 1
    row = [1] * (rowIndex + 1)

    # Start from row 1 (0-indexed) since row 0 is just [1]
    for i in range(1, rowIndex + 1):
        # Update the row in reverse order
        # We start from the second-to-last element and go backwards to the second element
        # This ensures we don't overwrite values we still need for calculations
        for j in range(i - 1, 0, -1):
            # Each element is the sum of the element above it (row[j])
            # and the element to the left of that one (row[j-1])
            row[j] = row[j] + row[j - 1]

    return row
```

```javascript
// Time: O(n²) | Space: O(n) - only storing the result row
function getRow(rowIndex) {
  // Initialize the row with 1's
  // Row i has i+1 elements, all starting as 1
  const row = new Array(rowIndex + 1).fill(1);

  // Start from row 1 (0-indexed) since row 0 is just [1]
  for (let i = 1; i <= rowIndex; i++) {
    // Update the row in reverse order
    // We start from the second-to-last element and go backwards to the second element
    // This ensures we don't overwrite values we still need for calculations
    for (let j = i - 1; j > 0; j--) {
      // Each element is the sum of the element above it (row[j])
      // and the element to the left of that one (row[j-1])
      row[j] = row[j] + row[j - 1];
    }
  }

  return row;
}
```

```java
// Time: O(n²) | Space: O(n) - only storing the result row
public List<Integer> getRow(int rowIndex) {
    // Initialize the row with 1's
    // Row i has i+1 elements, all starting as 1
    List<Integer> row = new ArrayList<>(rowIndex + 1);
    for (int i = 0; i <= rowIndex; i++) {
        row.add(1);
    }

    // Start from row 1 (0-indexed) since row 0 is just [1]
    for (int i = 1; i <= rowIndex; i++) {
        // Update the row in reverse order
        // We start from the second-to-last element and go backwards to the second element
        // This ensures we don't overwrite values we still need for calculations
        for (int j = i - 1; j > 0; j--) {
            // Each element is the sum of the element above it (row.get(j))
            // and the element to the left of that one (row.get(j-1))
            row.set(j, row.get(j) + row.get(j - 1));
        }
    }

    return row;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) where n is the row index. This might seem counterintuitive since we're only generating one row, but each row i has i+1 elements, and we're performing operations on each element. The total number of operations is approximately n(n+1)/2, which simplifies to O(n²).

**Space Complexity:** O(n) where n is the row index. We only store the current row, which has n+1 elements. This is optimal since we need to return a row of size n+1.

## Common Mistakes

1. **Off-by-one errors with row indexing:** Remember that rowIndex is 0-indexed, so row 0 has 1 element, row 1 has 2 elements, etc. A common mistake is to create an array of size rowIndex instead of rowIndex + 1.

2. **Updating in the wrong direction:** If you update the row from left to right, you'll overwrite values needed for subsequent calculations. For example, when calculating `row[2] = row[2] + row[1]`, if you've already updated `row[1]`, you'll get the wrong result. Always update from right to left.

3. **Forgetting that first and last elements are always 1:** Some candidates try to calculate all elements including the first and last, but these should always remain 1. The inner loop should run from `i-1` down to `1`, not `0`.

4. **Using the binomial coefficient formula inefficiently:** While you could calculate each element using the binomial coefficient formula C(n, k) = n! / (k! \* (n-k)!), this requires calculating factorials which can overflow for large n and is less efficient than the dynamic programming approach.

## When You'll See This Pattern

The in-place update technique from right to left appears in several dynamic programming problems where you need to build a new row based on the previous row but want to save space:

1. **Pascal's Triangle (Easy):** The classic version where you generate the entire triangle. The pattern is identical but applied to generate multiple rows.

2. **Find Triangular Sum of an Array (Medium):** This problem reduces an array by summing adjacent elements, similar to how Pascal's triangle is built. The in-place update technique is crucial for an efficient solution.

3. **Unique Paths (Medium):** When solving with dynamic programming, you often use a 1D array that gets updated in-place from left to right or right to left, similar to how we update the Pascal's triangle row.

4. **Coin Change (Medium):** The optimized dynamic programming solution for the minimum number of coins often uses a 1D array updated in a specific order to avoid overwriting needed values.

## Key Takeaways

1. **In-place updates can reduce space complexity:** When building sequences where each new value depends on previous values, consider whether you can update in place by processing in the correct order (often right-to-left).

2. **Pascal's triangle has multiple efficient generation methods:** While the binomial coefficient formula is mathematically elegant, the dynamic programming approach is more practical for coding interviews due to its simplicity and efficiency.

3. **Boundary conditions matter:** The first and last elements of Pascal's triangle rows are always 1. Recognizing and handling these boundary cases correctly is crucial for a clean solution.

Related problems: [Pascal's Triangle](/problem/pascals-triangle), [Find Triangular Sum of an Array](/problem/find-triangular-sum-of-an-array)
