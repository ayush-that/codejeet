---
title: "How to Solve Bitwise ORs of Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Bitwise ORs of Subarrays. Medium difficulty, 56.8% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation."
date: "2026-12-05"
category: "dsa-patterns"
tags: ["bitwise-ors-of-subarrays", "array", "dynamic-programming", "bit-manipulation", "medium"]
---

# How to Solve Bitwise ORs of Subarrays

This problem asks us to count the number of distinct bitwise OR results from all possible contiguous subarrays of a given integer array. What makes this problem interesting is that while a brute force approach is straightforward, it's far too slow for typical constraints. The challenge lies in finding an efficient way to track OR values without explicitly computing every subarray.

## Visual Walkthrough

Let's trace through a small example: `arr = [1, 2, 4]`

**Step 1: List all subarrays and their ORs**

- `[1]` → OR = 1
- `[2]` → OR = 2
- `[4]` → OR = 4
- `[1, 2]` → OR = 1 | 2 = 3 (binary: 01 | 10 = 11)
- `[1, 2, 4]` → OR = 1 | 2 | 4 = 7 (binary: 001 | 010 | 100 = 111)
- `[2, 4]` → OR = 2 | 4 = 6 (binary: 010 | 100 = 110)

**Step 2: Collect distinct ORs**
We get: {1, 2, 3, 4, 6, 7} → 6 distinct values

**Key observation**: Notice how OR values grow as we extend subarrays, but they never decrease (since OR is monotonic). Also, each new element can only add new bits to the OR, never remove them. This means the number of distinct OR values ending at position `i` is limited by the number of bits in the numbers.

## Brute Force Approach

The most straightforward solution is to compute ORs for all possible subarrays:

1. Generate all possible starting indices `i` from 0 to n-1
2. For each starting index, generate all ending indices `j` from i to n-1
3. Compute the OR of elements from i to j
4. Store results in a set to eliminate duplicates
5. Return the size of the set

<div class="code-group">

```python
# Time: O(n³) | Space: O(n²)
def subarrayBitwiseORs_brute(arr):
    n = len(arr)
    distinct_ors = set()

    # Generate all subarrays
    for i in range(n):
        current_or = 0
        for j in range(i, n):
            # Compute OR of arr[i..j]
            current_or |= arr[j]
            distinct_ors.add(current_or)

    return len(distinct_ors)
```

```javascript
// Time: O(n³) | Space: O(n²)
function subarrayBitwiseORsBrute(arr) {
  const n = arr.length;
  const distinctORs = new Set();

  // Generate all subarrays
  for (let i = 0; i < n; i++) {
    let currentOR = 0;
    for (let j = i; j < n; j++) {
      // Compute OR of arr[i..j]
      currentOR |= arr[j];
      distinctORs.add(currentOR);
    }
  }

  return distinctORs.size;
}
```

```java
// Time: O(n³) | Space: O(n²)
public int subarrayBitwiseORsBrute(int[] arr) {
    int n = arr.length;
    Set<Integer> distinctORs = new HashSet<>();

    // Generate all subarrays
    for (int i = 0; i < n; i++) {
        int currentOR = 0;
        for (int j = i; j < n; j++) {
            // Compute OR of arr[i..j]
            currentOR |= arr[j];
            distinctORs.add(currentOR);
        }
    }

    return distinctORs.size();
}
```

</div>

**Why this fails**: With time complexity O(n²) for generating subarrays and O(n) for computing ORs (if done naively), we get O(n³) total. Even with the optimization shown above (accumulating ORs), it's still O(n²), which is too slow for n up to 5×10⁴ as in typical LeetCode constraints.

## Optimized Approach

The key insight is that we don't need to compute ORs for every subarray from scratch. Instead, we can build upon previous results:

1. **Observation 1**: The OR operation is monotonic - adding more elements can only set more bits to 1, never clear bits.
2. **Observation 2**: For any position `i`, the number of distinct OR values for subarrays ending at `i` is limited by the number of bits (at most 32 for 32-bit integers).
3. **Observation 3**: If we know all distinct ORs for subarrays ending at position `i-1`, we can compute those ending at `i` by OR-ing each with `arr[i]`.

**Step-by-step reasoning**:

- Maintain a set `current` of all OR values for subarrays ending at the current position
- For each new element `arr[i]`:
  - Create a new set `next` starting with just `arr[i]` (the subarray of length 1)
  - For each value in `current`, OR it with `arr[i]` and add to `next`
  - Update `current` to `next` for the next iteration
  - Add all values from `current` to our global set of distinct ORs
- The size of `current` grows slowly because OR values quickly saturate (reach maximum possible value)

**Why this works**: Each element can add at most 32 new bits, so `current` has at most 32 elements. This gives us O(32n) = O(n) time complexity.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k) where k ≤ 32 | Space: O(n * k)
def subarrayBitwiseORs(arr):
    """
    Count distinct bitwise ORs of all subarrays.

    The key insight is that for each position i, the set of OR values
    for subarrays ending at i has size at most 32 (bits in an integer).
    We build these sets incrementally.
    """
    # Set to store all distinct OR values we encounter
    distinct_ors = set()

    # Set of OR values for subarrays ending at previous position
    current = set()

    for num in arr:
        # Set for OR values ending at current position
        next_set = set()

        # Subarray consisting of just the current element
        next_set.add(num)

        # For each OR value from subarrays ending at previous position,
        # OR it with current element to extend those subarrays
        for val in current:
            next_set.add(val | num)

        # Update current set for next iteration
        current = next_set

        # Add all OR values from subarrays ending at current position
        distinct_ors.update(current)

    return len(distinct_ors)
```

```javascript
// Time: O(n * k) where k ≤ 32 | Space: O(n * k)
function subarrayBitwiseORs(arr) {
  /**
   * Count distinct bitwise ORs of all subarrays.
   *
   * The key insight is that for each position i, the set of OR values
   * for subarrays ending at i has size at most 32 (bits in an integer).
   * We build these sets incrementally.
   */
  // Set to store all distinct OR values we encounter
  const distinctORs = new Set();

  // Set of OR values for subarrays ending at previous position
  let current = new Set();

  for (const num of arr) {
    // Set for OR values ending at current position
    const nextSet = new Set();

    // Subarray consisting of just the current element
    nextSet.add(num);

    // For each OR value from subarrays ending at previous position,
    // OR it with current element to extend those subarrays
    for (const val of current) {
      nextSet.add(val | num);
    }

    // Update current set for next iteration
    current = nextSet;

    // Add all OR values from subarrays ending at current position
    for (const val of current) {
      distinctORs.add(val);
    }
  }

  return distinctORs.size;
}
```

```java
// Time: O(n * k) where k ≤ 32 | Space: O(n * k)
public int subarrayBitwiseORs(int[] arr) {
    /**
     * Count distinct bitwise ORs of all subarrays.
     *
     * The key insight is that for each position i, the set of OR values
     * for subarrays ending at i has size at most 32 (bits in an integer).
     * We build these sets incrementally.
     */
    // Set to store all distinct OR values we encounter
    Set<Integer> distinctORs = new HashSet<>();

    // Set of OR values for subarrays ending at previous position
    Set<Integer> current = new HashSet<>();

    for (int num : arr) {
        // Set for OR values ending at current position
        Set<Integer> nextSet = new HashSet<>();

        // Subarray consisting of just the current element
        nextSet.add(num);

        // For each OR value from subarrays ending at previous position,
        // OR it with current element to extend those subarrays
        for (int val : current) {
            nextSet.add(val | num);
        }

        // Update current set for next iteration
        current = nextSet;

        // Add all OR values from subarrays ending at current position
        distinctORs.addAll(current);
    }

    return distinctORs.size();
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × k), where n is the length of the array and k is the maximum size of the `current` set. Since each integer has at most 32 bits, k ≤ 32. Therefore, the time complexity is O(32n) = **O(n)**.

**Space Complexity**: O(n × k) in the worst case for storing all distinct ORs. Since k ≤ 32 and the total number of distinct ORs is bounded by 32n, the space complexity is **O(n)**. In practice, it's often much less because many OR values are duplicates.

**Why the bound is 32**: Each new element can only add bits that weren't already set in previous OR values. Since there are only 32 bits in a 32-bit integer, we can have at most 32 distinct OR values ending at any position (each representing a different combination of bits set).

## Common Mistakes

1. **Using brute force O(n²) approach**: Candidates often don't realize the 32-bit bound and try to optimize the brute force. This still times out for large n (up to 5×10⁴). Always check constraints before implementing.

2. **Forgetting to include single-element subarrays**: The problem says "non-empty subarrays," which includes subarrays of length 1. Make sure your solution starts with each element as its own subarray.

3. **Incorrectly updating the current set**: Some candidates try to modify the `current` set while iterating over it, which can cause errors. Always create a new set for the next iteration.

4. **Assuming OR values will quickly saturate**: While OR values do tend to saturate, you can't assume they'll reach maximum quickly. The worst case (like powers of 2: [1, 2, 4, 8, ...]) maintains many distinct values.

## When You'll See This Pattern

This pattern of maintaining a bounded set of possible values for subarrays ending at each position appears in several bit manipulation problems:

1. **Longest Nice Subarray (Medium)**: Find the longest subarray where AND of all elements equals 0. Uses a similar approach with sliding window and bit tracking.

2. **Smallest Subarrays With Maximum Bitwise OR (Medium)**: For each position, find the smallest subarray starting at that position with maximum OR. Uses the insight that OR is monotonic.

3. **Bitwise OR of All Subsequence Sums (Medium)**: Similar bit-bound reasoning applies to subsequence sums when combined with OR operations.

The core technique is recognizing when a property (like number of bits in OR results) has a fixed upper bound, allowing you to maintain a manageable set of states as you process the array.

## Key Takeaways

1. **Bit operations often have bounded state space**: For 32-bit integers, OR/AND/XOR operations can produce at most 2³² possible values, but in practice, the number of distinct values ending at any position is much smaller (≤ 32 for OR).

2. **Think incrementally**: Instead of computing all subarrays from scratch, build upon results from previous positions. This is a form of dynamic programming where the state is the set of possible OR values.

3. **Monotonic operations enable optimization**: Since OR only adds bits (never removes), the set of possible values grows slowly and saturates quickly. Look for monotonic properties in other problems too.

**Related problems**: [Longest Nice Subarray](/problem/longest-nice-subarray), [Smallest Subarrays With Maximum Bitwise OR](/problem/smallest-subarrays-with-maximum-bitwise-or), [Bitwise OR of All Subsequence Sums](/problem/bitwise-or-of-all-subsequence-sums)
