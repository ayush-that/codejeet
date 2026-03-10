---
title: "How to Solve Intervals Between Identical Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Intervals Between Identical Elements. Medium difficulty, 45.5% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2029-07-08"
category: "dsa-patterns"
tags: ["intervals-between-identical-elements", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Intervals Between Identical Elements

You're given an array of integers and need to compute, for each element, the sum of distances to all other elements with the same value. The challenge is doing this efficiently—a brute force approach would be O(n²), but we need something closer to O(n). What makes this problem interesting is that it requires clever mathematical insight combined with prefix sums to avoid redundant calculations.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [2, 1, 3, 1, 2, 3, 3]`

For element at index 0 (value 2), we need to find all other 2's:

- Index 4 has value 2
- Distance = |0 - 4| = 4
- Total for index 0 = 4

For element at index 1 (value 1):

- Index 3 has value 1
- Distance = |1 - 3| = 2
- Total for index 1 = 2

But here's the key insight: when we process all indices with the same value together, we can use prefix sums to compute distances efficiently. Let's look at all 3's at indices 2, 5, and 6:

For index 2 (first 3):

- Distance to index 5 = |2 - 5| = 3
- Distance to index 6 = |2 - 6| = 4
- Total = 3 + 4 = 7

For index 5 (second 3):

- Distance to index 2 = |5 - 2| = 3
- Distance to index 6 = |5 - 6| = 1
- Total = 3 + 1 = 4

Notice the pattern: for each element, the sum of distances to all elements to its left plus all elements to its right. We can compute this efficiently using prefix sums of indices.

## Brute Force Approach

The most straightforward solution is to check every pair of elements:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def brute_force(arr):
    n = len(arr)
    result = [0] * n

    # For each element
    for i in range(n):
        total = 0
        # Compare with every other element
        for j in range(n):
            if i != j and arr[i] == arr[j]:
                total += abs(i - j)
        result[i] = total

    return result
```

```javascript
// Time: O(n²) | Space: O(n)
function bruteForce(arr) {
  const n = arr.length;
  const result = new Array(n).fill(0);

  // For each element
  for (let i = 0; i < n; i++) {
    let total = 0;
    // Compare with every other element
    for (let j = 0; j < n; j++) {
      if (i !== j && arr[i] === arr[j]) {
        total += Math.abs(i - j);
      }
    }
    result[i] = total;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(n)
public long[] bruteForce(int[] arr) {
    int n = arr.length;
    long[] result = new long[n];

    // For each element
    for (int i = 0; i < n; i++) {
        long total = 0;
        // Compare with every other element
        for (int j = 0; j < n; j++) {
            if (i != j && arr[i] == arr[j]) {
                total += Math.abs(i - j);
            }
        }
        result[i] = total;
    }

    return result;
}
```

</div>

**Why this fails:** With n up to 10⁵, O(n²) operations would be 10¹⁰—far too slow. We need to avoid comparing every pair directly.

## Optimized Approach

The key insight is that for elements with the same value, we can compute distances using mathematical properties rather than pairwise comparisons.

Consider all indices where a particular value appears: `[i₁, i₂, i₃, ..., iₖ]`

For index `iₚ`:

- Distance to all indices to the left: `(iₚ - i₁) + (iₚ - i₂) + ... + (iₚ - iₚ₋₁)`
- Distance to all indices to the right: `(iₚ₊₁ - iₚ) + (iₚ₊₂ - iₚ) + ... + (iₖ - iₚ)`

We can rewrite the left distances as: `p × iₚ - (i₁ + i₂ + ... + iₚ₋₁)`
And the right distances as: `(iₚ₊₁ + iₚ₊₂ + ... + iₖ) - (k - p - 1) × iₚ`

This reveals the pattern: if we have prefix sums of the indices, we can compute the total distance for each position in O(1) time!

**Step-by-step reasoning:**

1. Group indices by value using a hash map
2. For each group of indices (sorted naturally since we process left to right):
   - Compute prefix sums of the indices
   - For each position in the group:
     - Left contribution = current_index × position_count_left - prefix_sum_left
     - Right contribution = prefix_sum_right - current_index × position_count_right
     - Total = left + right
3. Build the result array

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def getDistances(arr):
    n = len(arr)
    result = [0] * n

    # Dictionary to store indices for each value
    indices_map = {}

    # Step 1: Group indices by value
    for i, num in enumerate(arr):
        if num not in indices_map:
            indices_map[num] = []
        indices_map[num].append(i)

    # Step 2: Process each group of indices
    for indices in indices_map.values():
        m = len(indices)

        # Compute prefix sums of indices
        prefix_sums = [0] * (m + 1)
        for i in range(m):
            prefix_sums[i + 1] = prefix_sums[i] + indices[i]

        # For each index in the group, compute total distance
        for i in range(m):
            current_idx = indices[i]

            # Left side: indices[0] to indices[i-1]
            # Count of elements on left = i
            # Sum of indices on left = prefix_sums[i]
            left_sum = i * current_idx - prefix_sums[i]

            # Right side: indices[i+1] to indices[m-1]
            # Count of elements on right = m - i - 1
            # Sum of indices on right = prefix_sums[m] - prefix_sums[i+1]
            right_sum = (prefix_sums[m] - prefix_sums[i + 1]) - (m - i - 1) * current_idx

            # Total distance for this element
            result[current_idx] = left_sum + right_sum

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function getDistances(arr) {
  const n = arr.length;
  const result = new Array(n).fill(0);

  // Map to store indices for each value
  const indicesMap = new Map();

  // Step 1: Group indices by value
  for (let i = 0; i < n; i++) {
    const num = arr[i];
    if (!indicesMap.has(num)) {
      indicesMap.set(num, []);
    }
    indicesMap.get(num).push(i);
  }

  // Step 2: Process each group of indices
  for (const indices of indicesMap.values()) {
    const m = indices.length;

    // Compute prefix sums of indices
    const prefixSums = new Array(m + 1).fill(0);
    for (let i = 0; i < m; i++) {
      prefixSums[i + 1] = prefixSums[i] + indices[i];
    }

    // For each index in the group, compute total distance
    for (let i = 0; i < m; i++) {
      const currentIdx = indices[i];

      // Left side: indices[0] to indices[i-1]
      // Count of elements on left = i
      // Sum of indices on left = prefixSums[i]
      const leftSum = i * currentIdx - prefixSums[i];

      // Right side: indices[i+1] to indices[m-1]
      // Count of elements on right = m - i - 1
      // Sum of indices on right = prefixSums[m] - prefixSums[i+1]
      const rightSum = prefixSums[m] - prefixSums[i + 1] - (m - i - 1) * currentIdx;

      // Total distance for this element
      result[currentIdx] = leftSum + rightSum;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public long[] getDistances(int[] arr) {
    int n = arr.length;
    long[] result = new long[n];

    // Map to store indices for each value
    Map<Integer, List<Integer>> indicesMap = new HashMap<>();

    // Step 1: Group indices by value
    for (int i = 0; i < n; i++) {
        int num = arr[i];
        indicesMap.putIfAbsent(num, new ArrayList<>());
        indicesMap.get(num).add(i);
    }

    // Step 2: Process each group of indices
    for (List<Integer> indices : indicesMap.values()) {
        int m = indices.size();

        // Compute prefix sums of indices
        long[] prefixSums = new long[m + 1];
        for (int i = 0; i < m; i++) {
            prefixSums[i + 1] = prefixSums[i] + indices.get(i);
        }

        // For each index in the group, compute total distance
        for (int i = 0; i < m; i++) {
            long currentIdx = indices.get(i);

            // Left side: indices[0] to indices[i-1]
            // Count of elements on left = i
            // Sum of indices on left = prefixSums[i]
            long leftSum = i * currentIdx - prefixSums[i];

            // Right side: indices[i+1] to indices[m-1]
            // Count of elements on right = m - i - 1
            // Sum of indices on right = prefixSums[m] - prefixSums[i+1]
            long rightSum = (prefixSums[m] - prefixSums[i + 1]) - (m - i - 1) * currentIdx;

            // Total distance for this element
            result[(int)currentIdx] = leftSum + rightSum;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the indices map: O(n) to iterate through the array once
- Processing each group: Each index is processed exactly once in its group
- Prefix sum computation: Linear in the size of each group, totaling O(n) across all groups
- Overall: O(n) since we perform constant work per element

**Space Complexity: O(n)**

- Result array: O(n)
- Indices map: Stores all n indices, so O(n)
- Prefix sums: Temporary arrays per group, but total size across all groups is O(n)
- Overall: O(n) auxiliary space

## Common Mistakes

1. **Using brute force without optimization**: The most common mistake is implementing the O(n²) solution without realizing it's too slow for the constraints. Always check constraints first—with n up to 10⁵, O(n²) is impossible.

2. **Incorrect prefix sum indexing**: When computing `left_sum = i * current_idx - prefix_sums[i]`, candidates often use `prefix_sums[i-1]` or forget that prefix sums are 1-indexed. Remember: `prefix_sums[i]` contains sum of first i elements (indices 0 to i-1).

3. **Integer overflow**: With n up to 10⁵ and distances potentially large, the total can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/JavaScript, Python handles big integers automatically).

4. **Forgetting to handle duplicate values efficiently**: Some candidates try to optimize by precomputing distances but miss the mathematical insight about left and right contributions. The key is recognizing that `|i - j|` can be split into two cases: `i - j` when `i > j` and `j - i` when `j > i`.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Grouping by value with hash maps**: Similar to problems like "Group Anagrams" (LeetCode 49) or "Top K Frequent Elements" (LeetCode 347), where you need to process elements with the same characteristic together.

2. **Prefix sums for distance calculations**: This appears in problems like "Minimum Operations to Make Array Equal" (LeetCode 1551) or "Can Make Arithmetic Progression From Sequence" (LeetCode 1502), where you need to compute sums of distances efficiently.

3. **Mathematical simplification of absolute values**: Problems involving `|a - b|` often benefit from sorting and considering contributions separately. You'll see this in "Minimum Moves to Equal Array Elements II" (LeetCode 462).

## Key Takeaways

1. **When you see absolute differences between indices**, consider sorting and using prefix sums. The expression `|i - j|` naturally splits into two cases based on which index is larger.

2. **Group processing is often more efficient than pairwise comparisons**. Instead of comparing each element with every other, group identical elements first, then process each group efficiently.

3. **Mathematical insight beats brute force**. Recognizing that `sum(|i - j|) = sum(i - j for j < i) + sum(j - i for j > i)` allows O(1) computation per element with prefix sums, turning O(n²) into O(n).

Related problems: [Continuous Subarray Sum](/problem/continuous-subarray-sum)
