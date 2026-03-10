---
title: "How to Solve Find Subarray With Bitwise OR Closest to K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Subarray With Bitwise OR Closest to K. Hard difficulty, 30.8% acceptance rate. Topics: Array, Binary Search, Bit Manipulation, Segment Tree."
date: "2030-02-25"
category: "dsa-patterns"
tags:
  [
    "find-subarray-with-bitwise-or-closest-to-k",
    "array",
    "binary-search",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Find Subarray With Bitwise OR Closest to K

You need to find a contiguous subarray whose bitwise OR value has the smallest possible absolute difference from a given integer `k`. The challenge is that bitwise OR is non-decreasing when you extend a subarray (adding elements can only set more bits to 1), but it's not strictly increasing, making binary search tricky. The real difficulty comes from efficiently tracking all possible OR values as you extend subarrays.

## Visual Walkthrough

Let's trace through `nums = [1, 2, 4]` with `k = 3`:

**Step 1:** Start with empty OR value = 0

- Difference from k: |0 - 3| = 3

**Step 2:** Consider all subarrays ending at index 0:

- `[1]`: OR = 1, diff = |1 - 3| = 2 (new best)

**Step 3:** Consider all subarrays ending at index 1:

- `[2]`: OR = 2, diff = |2 - 3| = 1 (new best)
- `[1, 2]`: OR = 1 | 2 = 3, diff = |3 - 3| = 0 (perfect match!)

**Step 4:** Consider all subarrays ending at index 2:

- `[4]`: OR = 4, diff = |4 - 3| = 1
- `[2, 4]`: OR = 2 | 4 = 6, diff = |6 - 3| = 3
- `[1, 2, 4]`: OR = 1 | 2 | 4 = 7, diff = |7 - 3| = 4

The best subarray is `[1, 2]` with OR = 3, giving difference 0.

The key observation: When we move to the next element, we don't need to recompute OR for all previous subarrays from scratch. Instead, we can maintain a set of unique OR values for subarrays ending at the current position.

## Brute Force Approach

The brute force solution checks every possible subarray `nums[i..j]`:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Compute the OR of `nums[i..j]`
4. Track the minimum absolute difference from `k`

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def brute_force(nums, k):
    n = len(nums)
    min_diff = float('inf')
    best_l, best_r = 0, 0

    for i in range(n):
        for j in range(i, n):
            # Compute OR of nums[i..j]
            current_or = 0
            for idx in range(i, j + 1):
                current_or |= nums[idx]

            diff = abs(current_or - k)
            if diff < min_diff:
                min_diff = diff
                best_l, best_r = i, j

    return nums[best_l:best_r+1] if n > 0 else []
```

```javascript
// Time: O(n³) | Space: O(1)
function bruteForce(nums, k) {
  const n = nums.length;
  let minDiff = Infinity;
  let bestL = 0,
    bestR = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Compute OR of nums[i..j]
      let currentOr = 0;
      for (let idx = i; idx <= j; idx++) {
        currentOr |= nums[idx];
      }

      const diff = Math.abs(currentOr - k);
      if (diff < minDiff) {
        minDiff = diff;
        bestL = i;
        bestR = j;
      }
    }
  }

  return nums.slice(bestL, bestR + 1);
}
```

```java
// Time: O(n³) | Space: O(1)
public int[] bruteForce(int[] nums, int k) {
    int n = nums.length;
    int minDiff = Integer.MAX_VALUE;
    int bestL = 0, bestR = 0;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Compute OR of nums[i..j]
            int currentOr = 0;
            for (int idx = i; idx <= j; idx++) {
                currentOr |= nums[idx];
            }

            int diff = Math.abs(currentOr - k);
            if (diff < minDiff) {
                minDiff = diff;
                bestL = i;
                bestR = j;
            }
        }
    }

    return Arrays.copyOfRange(nums, bestL, bestR + 1);
}
```

</div>

**Why it's too slow:** For an array of size `n`, there are O(n²) subarrays, and computing each OR takes O(n) time, resulting in O(n³) time complexity. For n = 1000, that's 10⁹ operations — far too slow.

## Optimized Approach

The key insight is that for subarrays ending at position `j`, the set of possible OR values is surprisingly small. When we extend a subarray by one element, the OR can only:

1. Stay the same (if the new element doesn't add any new 1-bits)
2. Increase by setting some 0-bits to 1

More importantly, each bit can only change from 0 to 1 once as we extend leftward. Since there are at most 32 bits (for 32-bit integers), there can be at most 32 distinct OR values for subarrays ending at a given position!

**Algorithm:**

1. Maintain a set of unique OR values for subarrays ending at the current position
2. For each new element, create a new set by OR-ing it with all previous OR values
3. Also include the element itself as a single-element subarray
4. Track the minimum difference from `k` across all OR values
5. Since the number of unique OR values per position is bounded by 32, this gives us O(32n) = O(n) time

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * 32) = O(n) | Space: O(32) = O(1)
def subarrayORClosestToK(nums, k):
    """
    Find subarray with bitwise OR closest to k.

    Args:
        nums: List of integers
        k: Target integer

    Returns:
        List containing the subarray with OR closest to k
    """
    if not nums:
        return []

    n = len(nums)
    min_diff = float('inf')
    best_l, best_r = 0, 0

    # For each ending position j
    for j in range(n):
        # Set to store unique OR values for subarrays ending at j
        current_or_set = set()
        current_or_set.add(0)  # Start with empty subarray

        # For each starting position i from j down to 0
        for i in range(j, -1, -1):
            # New set for OR values ending at i
            new_or_set = set()

            # OR nums[i] with all previous OR values
            for val in current_or_set:
                new_val = val | nums[i]
                new_or_set.add(new_val)

                # Check if this gives us a better difference
                diff = abs(new_val - k)
                if diff < min_diff:
                    min_diff = diff
                    best_l, best_r = i, j

                # Early exit if we found perfect match
                if min_diff == 0:
                    return nums[best_l:best_r+1]

            # Update current set for next iteration (moving left)
            current_or_set = new_or_set

    return nums[best_l:best_r+1]
```

```javascript
// Time: O(n * 32) = O(n) | Space: O(32) = O(1)
function subarrayORClosestToK(nums, k) {
  /**
   * Find subarray with bitwise OR closest to k.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Target integer
   * @return {number[]} Subarray with OR closest to k
   */
  if (!nums || nums.length === 0) {
    return [];
  }

  const n = nums.length;
  let minDiff = Infinity;
  let bestL = 0,
    bestR = 0;

  // For each ending position j
  for (let j = 0; j < n; j++) {
    // Set to store unique OR values for subarrays ending at j
    let currentOrSet = new Set();
    currentOrSet.add(0); // Start with empty subarray

    // For each starting position i from j down to 0
    for (let i = j; i >= 0; i--) {
      // New set for OR values ending at i
      const newOrSet = new Set();

      // OR nums[i] with all previous OR values
      for (const val of currentOrSet) {
        const newVal = val | nums[i];
        newOrSet.add(newVal);

        // Check if this gives us a better difference
        const diff = Math.abs(newVal - k);
        if (diff < minDiff) {
          minDiff = diff;
          bestL = i;
          bestR = j;
        }

        // Early exit if we found perfect match
        if (minDiff === 0) {
          return nums.slice(bestL, bestR + 1);
        }
      }

      // Update current set for next iteration (moving left)
      currentOrSet = newOrSet;
    }
  }

  return nums.slice(bestL, bestR + 1);
}
```

```java
// Time: O(n * 32) = O(n) | Space: O(32) = O(1)
import java.util.*;

public class Solution {
    public int[] subarrayORClosestToK(int[] nums, int k) {
        /**
         * Find subarray with bitwise OR closest to k.
         *
         * @param nums Array of integers
         * @param k Target integer
         * @return Subarray with OR closest to k
         */
        if (nums == null || nums.length == 0) {
            return new int[0];
        }

        int n = nums.length;
        int minDiff = Integer.MAX_VALUE;
        int bestL = 0, bestR = 0;

        // For each ending position j
        for (int j = 0; j < n; j++) {
            // Set to store unique OR values for subarrays ending at j
            Set<Integer> currentOrSet = new HashSet<>();
            currentOrSet.add(0);  // Start with empty subarray

            // For each starting position i from j down to 0
            for (int i = j; i >= 0; i--) {
                // New set for OR values ending at i
                Set<Integer> newOrSet = new HashSet<>();

                // OR nums[i] with all previous OR values
                for (int val : currentOrSet) {
                    int newVal = val | nums[i];
                    newOrSet.add(newVal);

                    // Check if this gives us a better difference
                    int diff = Math.abs(newVal - k);
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestL = i;
                        bestR = j;
                    }

                    // Early exit if we found perfect match
                    if (minDiff == 0) {
                        return Arrays.copyOfRange(nums, bestL, bestR + 1);
                    }
                }

                // Update current set for next iteration (moving left)
                currentOrSet = newOrSet;
            }
        }

        return Arrays.copyOfRange(nums, bestL, bestR + 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × B) where B is the maximum number of unique OR values per position. Since each integer has at most 32 bits, B ≤ 32. Thus, time complexity is O(32n) = **O(n)**.

**Space Complexity:** O(B) for storing the set of unique OR values at each step. Since B ≤ 32, this is **O(1)** constant space.

The critical insight is the bound on unique OR values: when OR-ing numbers, each bit can only change from 0 to 1 once. With 32 bits, we get at most 32 distinct values.

## Common Mistakes

1. **Trying to use binary search directly:** Bitwise OR isn't monotonic in the usual sense needed for binary search. While OR values are non-decreasing as you extend a subarray, they can plateau, making binary search on subarray length unreliable.

2. **Forgetting the empty subarray:** The empty subarray has OR = 0, which might be closer to k than any non-empty subarray. Always consider OR = 0 in your initial set.

3. **Not using early termination:** If you find a subarray with OR exactly equal to k (difference = 0), you can return immediately. This optimization can significantly speed up the solution in practice.

4. **Inefficient set management:** Some candidates try to maintain all OR values for all positions, which gives O(n²) space. The key is to only keep OR values for subarrays ending at the current position, then discard older values as you move forward.

## When You'll See This Pattern

This "bounded unique values" pattern appears in problems where:

1. Operations have limited possible outcomes per element
2. The state space grows slowly with array size
3. You need to track all possible "states" for subarrays ending at each position

**Related problems:**

- **Subarray Bitwise ORs** (LeetCode 898): Count distinct ORs of all subarrays — uses the same bounded OR values insight
- **Maximum XOR of Two Numbers in an Array** (LeetCode 421): Uses bitwise properties and bounded search space
- **Find the Maximum Subarray XOR** (LeetCode 1707): Similar bit manipulation with bounded possibilities

## Key Takeaways

1. **Bitwise operations often have bounded state spaces:** For 32-bit integers, OR/AND/XOR operations typically produce at most 32 distinct values when applied sequentially. This turns seemingly O(n²) problems into O(n).

2. **Think in terms of subarrays ending at each position:** Many subarray problems become tractable when you consider all subarrays ending at index j, then use the solution for j-1 to compute for j efficiently.

3. **Early optimization matters:** Always check if you can return early when you find a perfect match (difference = 0). In interviews, mentioning this optimization shows practical thinking.

Related problems: [Minimum Sum of Values by Dividing Array](/problem/minimum-sum-of-values-by-dividing-array)
