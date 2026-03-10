---
title: "How to Solve Sum of Distances — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Distances. Medium difficulty, 32.5% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2029-06-03"
category: "dsa-patterns"
tags: ["sum-of-distances", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Sum of Distances

This problem asks us to compute, for each element in an array, the sum of distances to all other elements with the same value. The challenge is that a naive approach would be O(n²), which is too slow for large arrays. The interesting insight is that we can compute these sums efficiently using prefix sums and careful mathematical reasoning about how distances change between consecutive elements.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 3, 1, 1, 2]`

For each index `i`, we need to find all other indices `j` where `nums[j] == nums[i]` and sum up `|i - j|`.

**Index 0 (value 1):**

- Other 1's are at indices 2 and 3
- Distance to index 2: |0 - 2| = 2
- Distance to index 3: |0 - 3| = 3
- Sum = 2 + 3 = 5

**Index 1 (value 3):**

- No other 3's exist
- Sum = 0

**Index 2 (value 1):**

- Other 1's are at indices 0 and 3
- Distance to index 0: |2 - 0| = 2
- Distance to index 3: |2 - 3| = 1
- Sum = 2 + 1 = 3

**Index 3 (value 1):**

- Other 1's are at indices 0 and 2
- Distance to index 0: |3 - 0| = 3
- Distance to index 2: |3 - 2| = 1
- Sum = 3 + 1 = 4

**Index 4 (value 2):**

- No other 2's exist
- Sum = 0

So the result is `[5, 0, 3, 4, 0]`.

The brute force approach would compute each of these sums independently, but notice something interesting: when we look at consecutive elements with the same value, their distance sums are related. For example, going from index 0 to index 2 (both value 1), the sum changes from 5 to 3. Understanding this relationship is key to an efficient solution.

## Brute Force Approach

The most straightforward solution is to iterate through each element and, for each one, scan through the entire array to find all matching elements and compute the sum of distances.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) ignoring output array
def distance_brute_force(nums):
    n = len(nums)
    result = [0] * n

    for i in range(n):
        total = 0
        for j in range(n):
            if i != j and nums[i] == nums[j]:
                total += abs(i - j)
        result[i] = total

    return result
```

```javascript
// Time: O(n²) | Space: O(1) ignoring output array
function distanceBruteForce(nums) {
  const n = nums.length;
  const result = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let total = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j && nums[i] === nums[j]) {
        total += Math.abs(i - j);
      }
    }
    result[i] = total;
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(1) ignoring output array
public long[] distanceBruteForce(int[] nums) {
    int n = nums.length;
    long[] result = new long[n];

    for (int i = 0; i < n; i++) {
        long total = 0;
        for (int j = 0; j < n; j++) {
            if (i != j && nums[i] == nums[j]) {
                total += Math.abs(i - j);
            }
        }
        result[i] = total;
    }

    return result;
}
```

</div>

**Why this is insufficient:** With n up to 10⁵, O(n²) operations would be 10¹⁰, which is far too slow. We need an O(n) or O(n log n) solution.

## Optimized Approach

The key insight is that for each group of identical values, we can compute all distance sums in linear time using prefix sums. Let's understand the mathematical relationship:

Consider a value that appears at indices `[i₁, i₂, i₃, ..., iₖ]` in sorted order. For index `iₚ`:

1. **Distances to elements on the left** (indices < p):  
   Sum = `(iₚ - i₁) + (iₚ - i₂) + ... + (iₚ - iₚ₋₁)`  
   = `p × iₚ - (i₁ + i₂ + ... + iₚ₋₁)`

2. **Distances to elements on the right** (indices > p):  
   Sum = `(iₚ₊₁ - iₚ) + (iₚ₊₂ - iₚ) + ... + (iₖ - iₚ)`  
   = `(iₚ₊₁ + iₚ₊₂ + ... + iₖ) - (k - p) × iₚ`

The total distance sum for `iₚ` is the sum of these two parts.

We can compute prefix sums for each group to get the cumulative sums of indices efficiently:

- `prefix[p]` = sum of first p indices in the group
- Then `sum of first (p-1) indices` = `prefix[p-1]`
- And `sum of last (k-p) indices` = `total_sum - prefix[p]`

This allows us to compute each distance sum in O(1) time after preprocessing.

## Optimal Solution

Here's the step-by-step implementation:

1. Group indices by value using a hash map
2. For each group of indices (already in sorted order since we process left to right):
   - Compute prefix sums of indices
   - For each position in the group, compute left and right contributions using the formula above
3. Build the result array

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def distance(nums):
    n = len(nums)
    result = [0] * n

    # Step 1: Group indices by value
    indices_map = {}
    for i, num in enumerate(nums):
        if num not in indices_map:
            indices_map[num] = []
        indices_map[num].append(i)

    # Step 2: Process each group
    for indices in indices_map.values():
        k = len(indices)

        # If only one occurrence, all distances are 0 (already set)
        if k == 1:
            continue

        # Compute prefix sums of indices
        prefix = [0] * (k + 1)
        for i in range(k):
            prefix[i + 1] = prefix[i] + indices[i]

        # Total sum of all indices in this group
        total_sum = prefix[k]

        # Step 3: Compute distance sum for each index in the group
        for p in range(k):
            current_index = indices[p]

            # Left side contribution: p * current_index - sum of indices to the left
            left_sum = p * current_index - prefix[p]

            # Right side contribution: sum of indices to the right - (k - p - 1) * current_index
            right_sum = (total_sum - prefix[p + 1]) - (k - p - 1) * current_index

            # Total distance sum for this index
            result[current_index] = left_sum + right_sum

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function distance(nums) {
  const n = nums.length;
  const result = new Array(n).fill(0);

  // Step 1: Group indices by value
  const indicesMap = new Map();
  for (let i = 0; i < n; i++) {
    const num = nums[i];
    if (!indicesMap.has(num)) {
      indicesMap.set(num, []);
    }
    indicesMap.get(num).push(i);
  }

  // Step 2: Process each group
  for (const indices of indicesMap.values()) {
    const k = indices.length;

    // If only one occurrence, all distances are 0 (already set)
    if (k === 1) continue;

    // Compute prefix sums of indices
    const prefix = new Array(k + 1).fill(0);
    for (let i = 0; i < k; i++) {
      prefix[i + 1] = prefix[i] + indices[i];
    }

    // Total sum of all indices in this group
    const totalSum = prefix[k];

    // Step 3: Compute distance sum for each index in the group
    for (let p = 0; p < k; p++) {
      const currentIndex = indices[p];

      // Left side contribution: p * currentIndex - sum of indices to the left
      const leftSum = p * currentIndex - prefix[p];

      // Right side contribution: sum of indices to the right - (k - p - 1) * currentIndex
      const rightSum = totalSum - prefix[p + 1] - (k - p - 1) * currentIndex;

      // Total distance sum for this index
      result[currentIndex] = leftSum + rightSum;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public long[] distance(int[] nums) {
    int n = nums.length;
    long[] result = new long[n];

    // Step 1: Group indices by value
    Map<Integer, List<Integer>> indicesMap = new HashMap<>();
    for (int i = 0; i < n; i++) {
        indicesMap.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
    }

    // Step 2: Process each group
    for (List<Integer> indices : indicesMap.values()) {
        int k = indices.size();

        // If only one occurrence, all distances are 0 (already set)
        if (k == 1) continue;

        // Compute prefix sums of indices
        long[] prefix = new long[k + 1];
        for (int i = 0; i < k; i++) {
            prefix[i + 1] = prefix[i] + indices.get(i);
        }

        // Total sum of all indices in this group
        long totalSum = prefix[k];

        // Step 3: Compute distance sum for each index in the group
        for (int p = 0; p < k; p++) {
            int currentIndex = indices.get(p);

            // Left side contribution: p * currentIndex - sum of indices to the left
            long leftSum = p * (long)currentIndex - prefix[p];

            // Right side contribution: sum of indices to the right - (k - p - 1) * currentIndex
            long rightSum = (totalSum - prefix[p + 1]) - (k - p - 1) * (long)currentIndex;

            // Total distance sum for this index
            result[currentIndex] = leftSum + rightSum;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- Building the hash map: O(n) to iterate through all elements
- Processing each group: Each index is processed exactly once in its group, and computing prefix sums and distance sums is linear in the group size
- Total: O(n) since we process each element a constant number of times

**Space Complexity:** O(n)

- Hash map stores all indices: O(n)
- Prefix sum arrays: Total size across all groups is O(n)
- Output array: O(n)
- Total: O(n)

## Common Mistakes

1. **Using O(n²) brute force:** The most common mistake is not recognizing the mathematical relationship between consecutive elements' distance sums. Always ask yourself: "Can I compute this more efficiently by understanding how the answer changes?"

2. **Off-by-one errors in the formula:** When computing `left_sum = p * current_index - prefix[p]`, remember that `p` is the 0-based position in the group (so there are `p` elements to the left). Similarly, for right sum, there are `(k - p - 1)` elements to the right.

3. **Integer overflow:** The distance sums can be large (up to ~10¹⁰ for n=10⁵). Use 64-bit integers (long in Java, default in Python handles big integers, Number in JavaScript is 64-bit float but precise up to 2⁵³).

4. **Forgetting to handle single-element groups:** If a value appears only once, its distance sum should be 0. Our code handles this by skipping groups of size 1.

## When You'll See This Pattern

This problem uses **prefix sums with grouping**, a pattern that appears in many array problems:

1. **Minimum Operations to Make All Array Elements Equal (Medium):** Similar grouping and prefix sum approach to compute costs efficiently.

2. **Range Sum Query - Immutable (Easy):** The classic prefix sum problem that introduces the concept.

3. **Subarray Sum Equals K (Medium):** Uses prefix sums with hash maps to find subarrays with a target sum.

The core idea is recognizing when you can compute a function f(i) more efficiently by understanding how f(i) relates to f(i-1) or by using precomputed prefix sums.

## Key Takeaways

1. **Group then compute:** When dealing with "for each element, compute something relative to other elements with the same property," first group elements by that property, then process each group independently.

2. **Mathematical decomposition is powerful:** Breaking a complex sum into left and right components, then using prefix sums to compute each part efficiently, is a technique that applies to many problems.

3. **Prefix sums transform O(n) to O(1):** If you need to repeatedly compute sums of contiguous elements, prefix sums let you answer each query in constant time after linear preprocessing.

Related problems: [Remove Duplicates from Sorted Array](/problem/remove-duplicates-from-sorted-array), [Find All Duplicates in an Array](/problem/find-all-duplicates-in-an-array), [Minimum Operations to Make All Array Elements Equal](/problem/minimum-operations-to-make-all-array-elements-equal)
