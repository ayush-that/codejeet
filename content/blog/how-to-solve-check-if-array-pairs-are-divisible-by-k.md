---
title: "How to Solve Check If Array Pairs Are Divisible by k — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check If Array Pairs Are Divisible by k. Medium difficulty, 46.2% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-09-11"
category: "dsa-patterns"
tags: ["check-if-array-pairs-are-divisible-by-k", "array", "hash-table", "counting", "medium"]
---

# How to Solve Check If Array Pairs Are Divisible by k

This problem asks whether we can pair all elements in an even-length array so that each pair's sum is divisible by a given integer `k`. The challenge lies in efficiently checking compatibility between numbers when their remainders modulo `k` determine whether their sums are divisible by `k`. A brute force pairing approach would be factorial in complexity, so we need a smarter counting-based solution.

## Visual Walkthrough

Let's walk through an example: `arr = [1, 2, 3, 4, 5, 6]`, `k = 5`.

First, we compute each number's remainder when divided by `k`:

- 1 % 5 = 1
- 2 % 5 = 2
- 3 % 5 = 3
- 4 % 5 = 4
- 5 % 5 = 0
- 6 % 5 = 1

Now we have remainders: [1, 2, 3, 4, 0, 1]

**Key Insight**: Two numbers `a` and `b` have a sum divisible by `k` if and only if `(a % k) + (b % k) = k` or `(a % k) + (b % k) = 0`. This means:

- Remainder 0 must pair with remainder 0
- Remainder 1 must pair with remainder 4 (since 1 + 4 = 5)
- Remainder 2 must pair with remainder 3 (since 2 + 3 = 5)

Let's count our remainders:

- Remainder 0: 1 occurrence (from 5)
- Remainder 1: 2 occurrences (from 1 and 6)
- Remainder 2: 1 occurrence (from 2)
- Remainder 3: 1 occurrence (from 3)
- Remainder 4: 1 occurrence (from 4)

Now check pairings:

1. Remainder 0: We have 1 occurrence, which is odd. Remainder 0 elements must pair with each other, so we need an even count. Already we have a problem! But wait, let's continue...
2. Remainder 1 & 4: We have 2 of remainder 1 and 1 of remainder 4. They should have equal counts to pair completely. 2 ≠ 1, so this fails too.

Thus, for this input, the answer is `false`. Let's try a valid example: `arr = [1, 2, 3, 4, 5, 10]`, `k = 5`.

Remainders: 1%5=1, 2%5=2, 3%5=3, 4%5=4, 5%5=0, 10%5=0 → [1, 2, 3, 4, 0, 0]

Counts:

- Remainder 0: 2 occurrences ✓ (can pair with each other)
- Remainder 1: 1 occurrence
- Remainder 4: 1 occurrence ✓ (1 + 4 = 5)
- Remainder 2: 1 occurrence
- Remainder 3: 1 occurrence ✓ (2 + 3 = 5)

All complementary pairs have equal counts, so the answer is `true`.

## Brute Force Approach

The most straightforward approach is to generate all possible pairings of the `n` elements into `n/2` pairs and check if every pair sums to a multiple of `k`. We could use backtracking: try to pair each unpaired element with every other unpaired element, recursively building pairs.

However, this approach has factorial time complexity. For an array of length `n`, there are `(n-1) × (n-3) × ... × 1` ways to form pairs, which is approximately `n! / (2^(n/2) × (n/2)!)`. For `n = 20`, that's already over 6 million possibilities. For the problem constraints (n up to 10^5), this is completely infeasible.

Even if we add pruning (stopping early when a pair doesn't sum to a multiple of `k`), in the worst case we'd still explore exponentially many possibilities. We need a more mathematical approach.

## Optimized Approach

The optimal solution uses modular arithmetic and counting. Here's the step-by-step reasoning:

1. **Modular Arithmetic Insight**: For any two integers `a` and `b`, `(a + b) % k = 0` if and only if `a % k = -b % k = (k - b % k) % k`. In other words, if `a` has remainder `r`, then `b` must have remainder `(k - r) % k` for their sum to be divisible by `k`.

2. **Special Cases**:
   - When `r = 0`, we need `b % k = 0` (since `(k - 0) % k = 0`). So remainder 0 elements must pair with other remainder 0 elements.
   - When `r = k/2` and `k` is even, we need `b % k = k/2` (since `(k - k/2) % k = k/2`). So remainder `k/2` elements must pair with each other.

3. **Counting Strategy**:
   - Count how many elements have each remainder `r` from 0 to `k-1`.
   - For each remainder `r`, check if `count[r] == count[(k - r) % k]`.
   - For `r = 0` and `r = k/2` (when `k` is even), we need `count[r]` to be even.

4. **Why This Works**: If we have equal counts of complementary remainders, we can always pair them up. If counts don't match, we can't form all required pairs.

This reduces the problem to a simple counting and verification task with O(n + k) time and O(k) space.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + k) | Space: O(k)
def canArrange(arr, k):
    """
    Returns True if arr can be divided into pairs where each pair's sum
    is divisible by k, False otherwise.

    Approach: Count remainders modulo k, then verify complementary
    remainders have equal counts.
    """
    # Step 1: Initialize remainder counts
    # We use a list of size k to store counts of remainders 0 to k-1
    remainder_counts = [0] * k

    # Step 2: Count remainders for each number
    # For negative numbers, Python's % gives non-negative remainders
    # e.g., -1 % 5 = 4, which is exactly what we need
    for num in arr:
        remainder = num % k
        remainder_counts[remainder] += 1

    # Step 3: Check if pairing is possible
    # We only need to check up to k//2 because we check pairs (r, k-r)
    for r in range(1, k // 2 + 1):
        # For remainders r and k-r, their counts must be equal
        # (except when r == k-r, handled separately)
        if r != k - r:
            if remainder_counts[r] != remainder_counts[k - r]:
                return False

    # Step 4: Special cases
    # Remainder 0 must have even count (they pair with themselves)
    if remainder_counts[0] % 2 != 0:
        return False

    # When k is even, remainder k/2 must have even count
    # (they also pair with themselves)
    if k % 2 == 0 and remainder_counts[k // 2] % 2 != 0:
        return False

    # Step 5: All checks passed
    return True
```

```javascript
// Time: O(n + k) | Space: O(k)
function canArrange(arr, k) {
  /**
   * Returns true if arr can be divided into pairs where each pair's sum
   * is divisible by k, false otherwise.
   *
   * Approach: Count remainders modulo k, then verify complementary
   * remainders have equal counts.
   */

  // Step 1: Initialize remainder counts
  // We use an array of size k to store counts of remainders 0 to k-1
  const remainderCounts = new Array(k).fill(0);

  // Step 2: Count remainders for each number
  // JavaScript's % operator gives negative remainders for negative numbers
  // We need to adjust to get non-negative remainders
  for (const num of arr) {
    // Handle negative numbers: ((num % k) + k) % k gives non-negative remainder
    const remainder = ((num % k) + k) % k;
    remainderCounts[remainder]++;
  }

  // Step 3: Check if pairing is possible
  // We only need to check up to Math.floor(k/2) because we check pairs (r, k-r)
  for (let r = 1; r <= Math.floor(k / 2); r++) {
    // For remainders r and k-r, their counts must be equal
    // (except when r == k-r, handled separately)
    if (r !== k - r) {
      if (remainderCounts[r] !== remainderCounts[k - r]) {
        return false;
      }
    }
  }

  // Step 4: Special cases
  // Remainder 0 must have even count (they pair with themselves)
  if (remainderCounts[0] % 2 !== 0) {
    return false;
  }

  // When k is even, remainder k/2 must have even count
  // (they also pair with themselves)
  if (k % 2 === 0 && remainderCounts[k / 2] % 2 !== 0) {
    return false;
  }

  // Step 5: All checks passed
  return true;
}
```

```java
// Time: O(n + k) | Space: O(k)
class Solution {
    public boolean canArrange(int[] arr, int k) {
        /**
         * Returns true if arr can be divided into pairs where each pair's sum
         * is divisible by k, false otherwise.
         *
         * Approach: Count remainders modulo k, then verify complementary
         * remainders have equal counts.
         */

        // Step 1: Initialize remainder counts
        // We use an array of size k to store counts of remainders 0 to k-1
        int[] remainderCounts = new int[k];

        // Step 2: Count remainders for each number
        // Java's % operator gives negative remainders for negative numbers
        // We need to adjust to get non-negative remainders
        for (int num : arr) {
            // Handle negative numbers: ((num % k) + k) % k gives non-negative remainder
            int remainder = ((num % k) + k) % k;
            remainderCounts[remainder]++;
        }

        // Step 3: Check if pairing is possible
        // We only need to check up to k/2 because we check pairs (r, k-r)
        for (int r = 1; r <= k / 2; r++) {
            // For remainders r and k-r, their counts must be equal
            // (except when r == k-r, handled separately)
            if (r != k - r) {
                if (remainderCounts[r] != remainderCounts[k - r]) {
                    return false;
                }
            }
        }

        // Step 4: Special cases
        // Remainder 0 must have even count (they pair with themselves)
        if (remainderCounts[0] % 2 != 0) {
            return false;
        }

        // When k is even, remainder k/2 must have even count
        // (they also pair with themselves)
        if (k % 2 == 0 && remainderCounts[k / 2] % 2 != 0) {
            return false;
        }

        // Step 5: All checks passed
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n + k)

- O(n) to iterate through the array and count remainders
- O(k) to check the counts (we iterate up to k/2, which is O(k))
- Total: O(n + k)

**Space Complexity**: O(k)

- We need an array of size k to store remainder counts
- No other significant space usage

In practice, since k can be up to 10^5 (same as n), this is effectively O(n) time and space.

## Common Mistakes

1. **Not handling negative numbers correctly**: In JavaScript and Java, the modulo operator `%` returns negative remainders for negative numbers (e.g., `-1 % 5 = -1`). We need to adjust to get non-negative remainders: `((num % k) + k) % k`. Python handles this correctly by default.

2. **Forgetting the special case when r = k/2**: When k is even, remainder k/2 pairs with itself (since k/2 + k/2 = k). We need to check that `count[k/2]` is even, not that it equals `count[k/2]` (which is always true).

3. **Checking all remainders instead of half**: Some candidates check all k remainders, comparing `count[r]` with `count[(k-r)%k]` for every r. This works but is less efficient and requires careful handling of the r=0 case. The cleaner approach is to check only up to k/2.

4. **Not verifying remainder 0 has even count**: Remainder 0 elements must pair with each other, so we need an even number of them. This is a separate check from the complementary remainder check.

## When You'll See This Pattern

This "remainder pairing" pattern appears in problems where we need to check divisibility conditions between pairs or groups of numbers:

1. **Count Array Pairs Divisible by K (Hard)**: Instead of checking if ALL pairs can be formed, count how many pairs have sums divisible by k. Uses similar remainder counting but requires handling large counts combinatorially.

2. **Two Sum (Easy)**: While not exactly the same, it shares the idea of looking for complementary values (target - current) using a hash map.

3. **Continuous Subarray Sum (Medium)**: Uses prefix sums with modulo arithmetic to find subarrays with sums divisible by k.

4. **Pairs of Songs With Total Durations Divisible by 60 (Medium)**: Almost identical problem structure but with k=60 fixed.

The core technique is recognizing that when dealing with divisibility by k, working with remainders modulo k simplifies the problem significantly.

## Key Takeaways

1. **Modular arithmetic transforms pairing problems into counting problems**: Instead of checking all possible pairings (exponential), count remainders and verify complementary counts match (linear).

2. **Handle edge cases separately**: Remainder 0 and (when k is even) remainder k/2 are special because they pair with themselves, requiring even counts rather than matching complementary counts.

3. **Language differences matter**: Python's `%` always returns non-negative remainders, while JavaScript and Java can return negative ones. Always test with negative inputs.

**Related problems**: [Count Array Pairs Divisible by K](/problem/count-array-pairs-divisible-by-k), [Minimum Deletions to Make Array Divisible](/problem/minimum-deletions-to-make-array-divisible), [Count Pairs That Form a Complete Day II](/problem/count-pairs-that-form-a-complete-day-ii)
