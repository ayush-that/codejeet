---
title: "How to Solve Find The Original Array of Prefix Xor — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find The Original Array of Prefix Xor. Medium difficulty, 88.3% acceptance rate. Topics: Array, Bit Manipulation."
date: "2026-03-01"
category: "dsa-patterns"
tags: ["find-the-original-array-of-prefix-xor", "array", "bit-manipulation", "medium"]
---

# How to Solve "Find The Original Array of Prefix Xor"

This problem asks us to reconstruct an original array `arr` given its prefix XOR array `pref`, where `pref[i] = arr[0] ^ arr[1] ^ ... ^ arr[i]`. While the problem statement is simple, it tests your understanding of XOR properties and how to reverse a cumulative operation. The key insight is recognizing that XOR is its own inverse for reconstruction, making this problem solvable in linear time with constant space (excluding output).

## Visual Walkthrough

Let's trace through a concrete example: `pref = [5, 2, 0, 3, 1]`

We need to find `arr` such that:

- `pref[0] = arr[0] = 5`
- `pref[1] = arr[0] ^ arr[1] = 2`
- `pref[2] = arr[0] ^ arr[1] ^ arr[2] = 0`
- `pref[3] = arr[0] ^ arr[1] ^ arr[2] ^ arr[3] = 3`
- `pref[4] = arr[0] ^ arr[1] ^ arr[2] ^ arr[3] ^ arr[4] = 1`

**Step 1:** From the first equation, we immediately get `arr[0] = pref[0] = 5`

**Step 2:** For the second equation: `pref[1] = arr[0] ^ arr[1] = 2`
We know `arr[0] = 5`, so `5 ^ arr[1] = 2`
To isolate `arr[1]`, we XOR both sides with `arr[0]`:
`arr[1] = 5 ^ 2 = 7` (because `5 ^ 7 = 2`)

**Step 3:** For the third equation: `pref[2] = arr[0] ^ arr[1] ^ arr[2] = 0`
We know `arr[0] ^ arr[1] = pref[1] = 2`, so `2 ^ arr[2] = 0`
Thus `arr[2] = 2 ^ 0 = 2`

**Step 4:** For the fourth equation: `pref[3] = arr[0] ^ arr[1] ^ arr[2] ^ arr[3] = 3`
We know `arr[0] ^ arr[1] ^ arr[2] = pref[2] = 0`, so `0 ^ arr[3] = 3`
Thus `arr[3] = 0 ^ 3 = 3`

**Step 5:** For the fifth equation: `pref[4] = arr[0] ^ arr[1] ^ arr[2] ^ arr[3] ^ arr[4] = 1`
We know `arr[0] ^ arr[1] ^ arr[2] ^ arr[3] = pref[3] = 3`, so `3 ^ arr[4] = 1`
Thus `arr[4] = 3 ^ 1 = 2`

So our reconstructed array is `arr = [5, 7, 2, 3, 2]`

Notice the pattern: `arr[i] = pref[i] ^ pref[i-1]` for `i > 0`, with `arr[0] = pref[0]`.

## Brute Force Approach

A naive approach might try to guess the array by trying all possible values, but that's exponential and impractical. Another brute force would be to use the definition directly: for each position `i`, we could compute `arr[i]` by solving the equation `pref[i] = pref[i-1] ^ arr[i]` (for `i > 0`), which is actually the optimal approach!

The confusion some candidates have is thinking they need to try multiple possibilities or use backtracking, but XOR's properties make the solution deterministic and straightforward. If someone were to implement a truly brute force solution, they might try all possible `arr[0]` values, then for each try all possible `arr[1]` values, etc., which would be O(k^n) where k is the range of possible integers (enormous).

## Optimized Approach

The key insight comes from understanding XOR properties:

1. XOR is associative: `a ^ (b ^ c) = (a ^ b) ^ c`
2. XOR is commutative: `a ^ b = b ^ a`
3. `a ^ a = 0` (any number XOR itself is 0)
4. `a ^ 0 = a` (any number XOR 0 is itself)

From the definition: `pref[i] = arr[0] ^ arr[1] ^ ... ^ arr[i]`

For `i > 0`, we also have: `pref[i-1] = arr[0] ^ arr[1] ^ ... ^ arr[i-1]`

If we XOR these two equations:
`pref[i] ^ pref[i-1] = (arr[0] ^ ... ^ arr[i]) ^ (arr[0] ^ ... ^ arr[i-1])`

Due to associativity and commutativity, all terms from `arr[0]` to `arr[i-1]` appear twice, and `a ^ a = 0`, so they cancel out:
`pref[i] ^ pref[i-1] = 0 ^ arr[i] = arr[i]`

Thus: `arr[i] = pref[i] ^ pref[i-1]` for `i > 0`, and `arr[0] = pref[0]`.

This gives us a simple linear algorithm: iterate through `pref`, compute each `arr[i]` using the formula above, and return the result.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the output array
def findArray(pref):
    """
    Reconstructs the original array from its prefix XOR array.

    Args:
        pref: List of integers representing prefix XOR values

    Returns:
        List of integers representing the original array
    """
    n = len(pref)
    arr = [0] * n  # Initialize result array with same length as pref

    # First element is simply pref[0] since pref[0] = arr[0]
    arr[0] = pref[0]

    # For each subsequent element, use the property:
    # arr[i] = pref[i] ^ pref[i-1]
    for i in range(1, n):
        arr[i] = pref[i] ^ pref[i - 1]

    return arr
```

```javascript
// Time: O(n) | Space: O(n) for the output array
/**
 * Reconstructs the original array from its prefix XOR array.
 *
 * @param {number[]} pref - Array of prefix XOR values
 * @return {number[]} The original array
 */
function findArray(pref) {
  const n = pref.length;
  const arr = new Array(n); // Initialize result array with same length as pref

  // First element is simply pref[0] since pref[0] = arr[0]
  arr[0] = pref[0];

  // For each subsequent element, use the property:
  // arr[i] = pref[i] ^ pref[i-1]
  for (let i = 1; i < n; i++) {
    arr[i] = pref[i] ^ pref[i - 1];
  }

  return arr;
}
```

```java
// Time: O(n) | Space: O(n) for the output array
class Solution {
    /**
     * Reconstructs the original array from its prefix XOR array.
     *
     * @param pref Array of prefix XOR values
     * @return The original array
     */
    public int[] findArray(int[] pref) {
        int n = pref.length;
        int[] arr = new int[n];  // Initialize result array with same length as pref

        // First element is simply pref[0] since pref[0] = arr[0]
        arr[0] = pref[0];

        // For each subsequent element, use the property:
        // arr[i] = pref[i] ^ pref[i-1]
        for (int i = 1; i < n; i++) {
            arr[i] = pref[i] ^ pref[i - 1];
        }

        return arr;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the `pref` array once, performing a constant-time XOR operation for each element (except the first).
- The loop runs n-1 times for an array of size n, which is O(n).

**Space Complexity:** O(n) for the output array

- We need to store the result array `arr` which has the same size as the input.
- If we don't count the output space (as is common in some interview contexts), the space complexity is O(1) since we only use a few variables.
- We cannot modify the input array in-place because we need previous `pref` values to compute current `arr` values.

## Common Mistakes

1. **Starting the loop at i=0 instead of i=1**: If you try to compute `arr[0] = pref[0] ^ pref[-1]`, you'll get an index error or incorrect result. Remember the base case: `arr[0] = pref[0]`.

2. **Misunderstanding XOR properties**: Some candidates try to use subtraction or division instead of XOR. Remember that XOR is its own inverse for this operation: if `a ^ b = c`, then `a = c ^ b` and `b = c ^ a`.

3. **Attempting to modify pref array in-place**: While you could theoretically overwrite `pref` to save space, you need the original `pref[i-1]` to compute `arr[i]`. If you modify `pref[i-1]`, you lose information needed for subsequent computations.

4. **Not handling the single-element case**: When `pref` has only one element, the loop shouldn't execute at all. Our solution handles this correctly since the loop starts at i=1 and won't run if n=1.

## When You'll See This Pattern

This problem tests your ability to reverse a cumulative operation, which appears in various forms:

1. **Decode XORed Array (LeetCode 1720)**: Almost identical problem where you're given the first element and XOR of consecutive elements. The technique is exactly the same.

2. **Single Number III (LeetCode 260)**: While more complex, it uses XOR properties to separate two unique numbers in an array where all others appear twice.

3. **Count Triplets That Can Form Two Arrays of Equal XOR (LeetCode 1442)**: Uses prefix XOR to find subarrays with equal XOR, applying similar XOR properties.

4. **Range XOR Queries**: Problems where you need to answer XOR queries for subarrays efficiently use prefix XOR arrays, similar to prefix sum arrays.

The core pattern is recognizing that certain operations (like XOR, but also subtraction for prefix sums) can be reversed using the relationship between consecutive cumulative values.

## Key Takeaways

1. **XOR is its own inverse for reconstruction**: If you have `a ^ b = c`, you can recover either `a` or `b` by XORing with the other: `a = c ^ b` and `b = c ^ a`.

2. **Prefix operations are often reversible**: Whether it's prefix sums (reversible by subtraction) or prefix XOR (reversible by XOR), cumulative operations often contain enough information to reconstruct the original sequence.

3. **Look for mathematical properties before coding**: This problem appears to require complex logic, but a few moments of algebraic manipulation reveals a simple O(n) solution. Always explore mathematical properties of operations before implementing complex algorithms.

Related problems: [Single Number III](/problem/single-number-iii), [Count Triplets That Can Form Two Arrays of Equal XOR](/problem/count-triplets-that-can-form-two-arrays-of-equal-xor), [Decode XORed Array](/problem/decode-xored-array)
