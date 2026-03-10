---
title: "How to Solve Find the Prefix Common Array of Two Arrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Prefix Common Array of Two Arrays. Medium difficulty, 87.0% acceptance rate. Topics: Array, Hash Table, Bit Manipulation."
date: "2028-06-12"
category: "dsa-patterns"
tags:
  [
    "find-the-prefix-common-array-of-two-arrays",
    "array",
    "hash-table",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Find the Prefix Common Array of Two Arrays

This problem asks us to compute a prefix common array `C` where `C[i]` counts how many numbers appear in **both** arrays `A` and `B` within their first `i+1` elements (from index 0 to i). Both arrays are permutations of the numbers 1 to n, meaning each number appears exactly once in each array. The challenge lies in efficiently tracking which numbers have been "seen" in both arrays as we progress through them simultaneously.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
A = [1, 3, 2, 4]
B = [3, 1, 2, 4]
n = 4
```

We need to compute `C[i]` for i = 0 to 3:

**Step 1 (i=0):**

- Look at first elements: A[0]=1, B[0]=3
- Numbers seen so far in A: {1}
- Numbers seen so far in B: {3}
- Common numbers: {} → C[0] = 0

**Step 2 (i=1):**

- Add A[1]=3, B[1]=1
- Numbers seen in A: {1, 3}
- Numbers seen in B: {3, 1}
- Common numbers: {1, 3} → C[1] = 2

**Step 3 (i=2):**

- Add A[2]=2, B[2]=2
- Numbers seen in A: {1, 3, 2}
- Numbers seen in B: {3, 1, 2}
- Common numbers: {1, 3, 2} → C[2] = 3

**Step 4 (i=3):**

- Add A[3]=4, B[3]=4
- Numbers seen in A: {1, 3, 2, 4}
- Numbers seen in B: {3, 1, 2, 4}
- Common numbers: {1, 3, 2, 4} → C[3] = 4

**Result:** `C = [0, 2, 3, 4]`

The key observation: A number becomes "common" when it has appeared in **both** arrays. Since each number appears exactly once in each array, we just need to track when we've seen each number in both arrays.

## Brute Force Approach

A naive approach would be: for each index `i`, look at all elements from 0 to i in both arrays, count how many numbers appear in both ranges.

**How it works:**

1. For each i from 0 to n-1:
2. Create sets of elements in A[0..i] and B[0..i]
3. Find intersection of these sets
4. C[i] = size of intersection

**Why it's inefficient:**

- Time complexity: O(n³) if we rebuild sets from scratch each time
- Even with incremental updates: O(n²) since we'd need to check all previous elements
- Space: O(n) for the sets

The brute force fails because we're doing redundant work. We keep recounting the same numbers at each step instead of building on previous results.

## Optimized Approach

The key insight: Since `A` and `B` are permutations of 1..n, each number appears exactly once in each array. A number contributes to the common count **only after** it has appeared in both arrays.

**Efficient strategy:**

1. Track how many times we've seen each number (0, 1, or 2 times)
2. Maintain a counter for numbers seen exactly twice
3. For each position i:
   - Process A[i]: increment its count
   - If count becomes 2, increment common counter
   - Process B[i]: increment its count
   - If count becomes 2, increment common counter
   - C[i] = current common counter

**Why this works:**

- When count goes from 0→1: number seen in one array
- When count goes from 1→2: number now seen in both arrays
- We only count it once when it first becomes common
- The common counter accumulates as we go

## Optimal Solution

Here's the implementation using a frequency array to track counts:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findThePrefixCommonArray(A, B):
    """
    Compute the prefix common array of two permutations.

    Args:
        A: List[int] - first permutation of 1..n
        B: List[int] - second permutation of 1..n

    Returns:
        List[int] - prefix common array C
    """
    n = len(A)
    # Frequency array: index represents the number (1..n)
    # 0 = not seen, 1 = seen in one array, 2 = seen in both
    freq = [0] * (n + 1)  # n+1 because numbers are 1-indexed
    common_count = 0
    result = [0] * n

    for i in range(n):
        # Process element from A
        num_a = A[i]
        freq[num_a] += 1
        # If this is the second time we see this number
        if freq[num_a] == 2:
            common_count += 1

        # Process element from B
        num_b = B[i]
        freq[num_b] += 1
        # If this is the second time we see this number
        if freq[num_b] == 2:
            common_count += 1

        # Store result for current prefix
        result[i] = common_count

    return result
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Compute the prefix common array of two permutations.
 * @param {number[]} A - first permutation of 1..n
 * @param {number[]} B - second permutation of 1..n
 * @return {number[]} - prefix common array C
 */
function findThePrefixCommonArray(A, B) {
  const n = A.length;
  // Frequency array: index represents the number (1..n)
  // 0 = not seen, 1 = seen in one array, 2 = seen in both
  const freq = new Array(n + 1).fill(0); // n+1 because numbers are 1-indexed
  let commonCount = 0;
  const result = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    // Process element from A
    const numA = A[i];
    freq[numA]++;
    // If this is the second time we see this number
    if (freq[numA] === 2) {
      commonCount++;
    }

    // Process element from B
    const numB = B[i];
    freq[numB]++;
    // If this is the second time we see this number
    if (freq[numB] === 2) {
      commonCount++;
    }

    // Store result for current prefix
    result[i] = commonCount;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    /**
     * Compute the prefix common array of two permutations.
     * @param A - first permutation of 1..n
     * @param B - second permutation of 1..n
     * @return prefix common array C
     */
    public int[] findThePrefixCommonArray(int[] A, int[] B) {
        int n = A.length;
        // Frequency array: index represents the number (1..n)
        // 0 = not seen, 1 = seen in one array, 2 = seen in both
        int[] freq = new int[n + 1]; // n+1 because numbers are 1-indexed
        int commonCount = 0;
        int[] result = new int[n];

        for (int i = 0; i < n; i++) {
            // Process element from A
            int numA = A[i];
            freq[numA]++;
            // If this is the second time we see this number
            if (freq[numA] == 2) {
                commonCount++;
            }

            // Process element from B
            int numB = B[i];
            freq[numB]++;
            // If this is the second time we see this number
            if (freq[numB] == 2) {
                commonCount++;
            }

            // Store result for current prefix
            result[i] = commonCount;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the arrays once (n iterations)
- Each iteration does constant-time operations: array accesses, increments, and comparisons
- Total operations: ~4n (two array accesses, two increments, two comparisons per iteration)

**Space Complexity: O(n)**

- Frequency array of size n+1: O(n)
- Result array of size n: O(n)
- Total: O(n) auxiliary space
- Could be O(1) extra space if we modify input, but typically we don't count output space

## Common Mistakes

1. **Off-by-one errors with frequency array:** Forgetting that numbers are 1-indexed (1..n) but arrays are 0-indexed. Solution: Create frequency array of size n+1 and use the number itself as index.

2. **Double-counting numbers:** Incrementing common counter every time we see a number in the second array, even if we already counted it. Solution: Only increment when frequency goes from 1 to 2, not from 2 to 3.

3. **Processing arrays separately:** Trying to process all of A first, then all of B. This won't work because we need prefix-by-prefix comparison. Solution: Process A[i] and B[i] together in the same iteration.

4. **Using sets inefficiently:** Creating new sets at each iteration leads to O(n²) time. Solution: Use a frequency array or bitmask for O(1) updates.

## When You'll See This Pattern

This problem uses **frequency counting with incremental updates**, a pattern common in many array problems:

1. **Intersection of Two Arrays** (LeetCode 349, 350): Finding common elements between arrays, though those typically use hash sets.

2. **Find All Numbers Disappeared in an Array** (LeetCode 448): Uses frequency array to track which numbers 1..n have appeared.

3. **Find the Duplicate Number** (LeetCode 287): Uses frequency or cycle detection in a permutation.

4. **Check if All Characters Have Equal Number of Occurrences** (LeetCode 1941): Similar frequency counting pattern.

The core pattern: When you need to track occurrences across multiple sequences and compute incremental results, consider using a frequency counter that updates as you traverse.

## Key Takeaways

1. **Permutations have unique properties:** When arrays are permutations of 1..n, each element appears exactly once. This allows simple frequency tracking without worrying about duplicates.

2. **Incremental computation beats recomputation:** Instead of recomputing from scratch at each step, maintain running state (common_count) and update it based on new information.

3. **Frequency arrays are efficient for bounded ranges:** When values are bounded (like 1..n), use an array instead of hash map for O(1) access and better cache performance.

[Practice this problem on CodeJeet](/problem/find-the-prefix-common-array-of-two-arrays)
