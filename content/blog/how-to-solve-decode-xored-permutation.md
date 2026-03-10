---
title: "How to Solve Decode XORed Permutation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Decode XORed Permutation. Medium difficulty, 66.9% acceptance rate. Topics: Array, Bit Manipulation."
date: "2029-11-09"
category: "dsa-patterns"
tags: ["decode-xored-permutation", "array", "bit-manipulation", "medium"]
---

# How to Solve Decode XORed Permutation

You're given an encoded array where each element is the XOR of consecutive elements in a hidden permutation of the first `n` positive integers (with `n` odd). Your task is to recover the original permutation. What makes this problem interesting is that you need to leverage XOR properties to work backward from the encoded array to the original permutation, even though XOR operations aren't directly reversible like addition or subtraction.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `encoded = [6, 5, 4, 6]` (length 4, so `n = 5`)
- We need to find `perm = [a, b, c, d, e]` where:
  - `a XOR b = 6`
  - `b XOR c = 5`
  - `c XOR d = 4`
  - `d XOR e = 6`

We know `perm` contains all numbers from 1 to 5 exactly once.

**Step 1: Find the XOR of all numbers from 1 to n**

```
1 XOR 2 XOR 3 XOR 4 XOR 5 = 1
```

We can calculate this efficiently: for `n = 5`, the XOR of 1..n = 1.

**Step 2: Notice a pattern in the encoded array**
If we XOR every other element of `encoded` starting from index 1:

```
encoded[1] XOR encoded[3] = 5 XOR 6 = 3
```

But what does this represent? Let's expand:

```
(encoded[1] XOR encoded[3]) = (b XOR c) XOR (d XOR e) = b XOR c XOR d XOR e
```

**Step 3: Use this to find the first element**
We have:

- `total_XOR = a XOR b XOR c XOR d XOR e = 1`
- `partial_XOR = b XOR c XOR d XOR e = 3`

Therefore:

```
a = total_XOR XOR partial_XOR = 1 XOR 3 = 2
```

So `perm[0] = 2`.

**Step 4: Reconstruct the rest**
Now we can use the property that `a XOR b = encoded[0]`, so:

- `b = a XOR encoded[0] = 2 XOR 6 = 4`
- `c = b XOR encoded[1] = 4 XOR 5 = 1`
- `d = c XOR encoded[2] = 1 XOR 4 = 5`
- `e = d XOR encoded[3] = 5 XOR 6 = 3`

Thus `perm = [2, 4, 1, 5, 3]`, which contains all numbers 1-5 exactly once.

## Brute Force Approach

A naive approach might try to guess the first element and verify:

1. Try each possible first element from 1 to n
2. For each candidate, reconstruct the entire permutation using `perm[i+1] = perm[i] XOR encoded[i]`
3. Check if the result is a valid permutation of 1..n

This would be O(n²) time complexity since for each of n candidates, we need to:

- Reconstruct n elements (O(n))
- Verify it's a permutation (O(n) with a set)

The problem constraints (n up to 10⁵) make this approach infeasible. Even with optimizations, the O(n²) complexity is too slow.

## Optimized Approach

The key insight comes from understanding XOR properties:

1. **XOR is its own inverse**: If `a XOR b = c`, then `a = b XOR c` and `b = a XOR c`
2. **XOR is associative and commutative**: We can rearrange XOR operations
3. **XOR of all numbers 1..n has a pattern**: For any n, we can compute this efficiently

The critical observation: If we XOR every other element of `encoded` starting from index 1, we get:

```
encoded[1] XOR encoded[3] XOR encoded[5] XOR ... =
(b XOR c) XOR (d XOR e) XOR (f XOR g) XOR ... = b XOR c XOR d XOR e XOR f XOR g ...
```

This gives us the XOR of all elements EXCEPT the first one. Since we know the XOR of ALL elements (1..n), we can find the first element:

```
first_element = total_XOR XOR (XOR of all except first)
```

Once we have the first element, we can reconstruct the entire permutation using the inverse property: `perm[i+1] = perm[i] XOR encoded[i]`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def decode(encoded):
    """
    Decodes the XORed permutation.

    Args:
        encoded: List of integers where encoded[i] = perm[i] XOR perm[i+1]

    Returns:
        The original permutation of first n positive integers
    """
    n = len(encoded) + 1  # Original permutation length

    # Step 1: Calculate XOR of all numbers from 1 to n
    # XOR of 1..n has a pattern: n % 4 == 0 -> n, n % 4 == 1 -> 1,
    # n % 4 == 2 -> n+1, n % 4 == 3 -> 0
    total_xor = 0
    if n % 4 == 0:
        total_xor = n
    elif n % 4 == 1:
        total_xor = 1
    elif n % 4 == 2:
        total_xor = n + 1
    else:  # n % 4 == 3
        total_xor = 0

    # Step 2: Calculate XOR of all encoded elements at odd indices
    # This gives us XOR of perm[1] through perm[n-1]
    odd_indices_xor = 0
    for i in range(1, len(encoded), 2):
        odd_indices_xor ^= encoded[i]

    # Step 3: Find the first element of the permutation
    # first = total_xor XOR (XOR of all elements except first)
    # XOR of all except first = odd_indices_xor
    first = total_xor ^ odd_indices_xor

    # Step 4: Reconstruct the entire permutation
    perm = [0] * n
    perm[0] = first
    for i in range(len(encoded)):
        # Since encoded[i] = perm[i] XOR perm[i+1]
        # Then perm[i+1] = perm[i] XOR encoded[i]
        perm[i + 1] = perm[i] ^ encoded[i]

    return perm
```

```javascript
// Time: O(n) | Space: O(n) for the result array
/**
 * Decodes the XORed permutation.
 * @param {number[]} encoded - Array where encoded[i] = perm[i] XOR perm[i+1]
 * @return {number[]} The original permutation of first n positive integers
 */
function decode(encoded) {
  const n = encoded.length + 1; // Original permutation length

  // Step 1: Calculate XOR of all numbers from 1 to n
  // Using the pattern for XOR of 1..n
  let totalXor;
  if (n % 4 === 0) {
    totalXor = n;
  } else if (n % 4 === 1) {
    totalXor = 1;
  } else if (n % 4 === 2) {
    totalXor = n + 1;
  } else {
    // n % 4 === 3
    totalXor = 0;
  }

  // Step 2: Calculate XOR of all encoded elements at odd indices
  // This gives us XOR of perm[1] through perm[n-1]
  let oddIndicesXor = 0;
  for (let i = 1; i < encoded.length; i += 2) {
    oddIndicesXor ^= encoded[i];
  }

  // Step 3: Find the first element of the permutation
  // first = totalXor XOR (XOR of all elements except first)
  const first = totalXor ^ oddIndicesXor;

  // Step 4: Reconstruct the entire permutation
  const perm = new Array(n);
  perm[0] = first;
  for (let i = 0; i < encoded.length; i++) {
    // Since encoded[i] = perm[i] XOR perm[i+1]
    // Then perm[i+1] = perm[i] XOR encoded[i]
    perm[i + 1] = perm[i] ^ encoded[i];
  }

  return perm;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
class Solution {
    /**
     * Decodes the XORed permutation.
     * @param encoded Array where encoded[i] = perm[i] XOR perm[i+1]
     * @return The original permutation of first n positive integers
     */
    public int[] decode(int[] encoded) {
        int n = encoded.length + 1;  // Original permutation length

        // Step 1: Calculate XOR of all numbers from 1 to n
        // Using the pattern for XOR of 1..n
        int totalXor;
        if (n % 4 == 0) {
            totalXor = n;
        } else if (n % 4 == 1) {
            totalXor = 1;
        } else if (n % 4 == 2) {
            totalXor = n + 1;
        } else {  // n % 4 == 3
            totalXor = 0;
        }

        // Step 2: Calculate XOR of all encoded elements at odd indices
        // This gives us XOR of perm[1] through perm[n-1]
        int oddIndicesXor = 0;
        for (int i = 1; i < encoded.length; i += 2) {
            oddIndicesXor ^= encoded[i];
        }

        // Step 3: Find the first element of the permutation
        // first = totalXor XOR (XOR of all elements except first)
        int first = totalXor ^ oddIndicesXor;

        // Step 4: Reconstruct the entire permutation
        int[] perm = new int[n];
        perm[0] = first;
        for (int i = 0; i < encoded.length; i++) {
            // Since encoded[i] = perm[i] XOR perm[i+1]
            // Then perm[i+1] = perm[i] XOR encoded[i]
            perm[i + 1] = perm[i] ^ encoded[i];
        }

        return perm;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Calculating the XOR of 1..n using the pattern formula: O(1)
- Calculating XOR of encoded elements at odd indices: O(n) in worst case (we iterate through roughly half the array)
- Reconstructing the permutation: O(n) (we iterate through the entire encoded array once)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We need to store the result permutation of size n: O(n)
- We use only a few extra variables for intermediate calculations: O(1)
- Total: O(n) for the output, which is required by the problem

## Common Mistakes

1. **Forgetting that n is odd**: The problem guarantees n is odd, which ensures our pattern for XORing odd indices works correctly. If n were even, we'd need a different approach.

2. **Incorrect XOR pattern for 1..n**: Many candidates try to compute XOR of 1..n by iterating, which is O(n). While this still gives O(n) overall, it's less efficient than using the mathematical pattern. The pattern is:
   - n % 4 == 0 → n
   - n % 4 == 1 → 1
   - n % 4 == 2 → n + 1
   - n % 4 == 3 → 0

3. **Wrong index selection for odd_indices_xor**: Some candidates start at index 0 instead of index 1. Remember:
   - `encoded[1] = perm[1] XOR perm[2]`
   - `encoded[3] = perm[3] XOR perm[4]`
   - XORing these gives `perm[1] XOR perm[2] XOR perm[3] XOR perm[4]` = all elements except `perm[0]`

4. **Confusing XOR properties**: Remember that XOR is its own inverse: if `a XOR b = c`, then `a = b XOR c` and `b = a XOR c`. This is crucial for the reconstruction step.

## When You'll See This Pattern

This problem combines two important patterns:

1. **XOR properties for decoding**: Similar problems use XOR's self-inverse property to recover original values from encoded data. For example:
   - [1720. Decode XORed Array](https://leetcode.com/problems/decode-xored-array/) - Simpler version where first element is given
   - [2433. Find The Original Array of Prefix Xor](https://leetcode.com/problems/find-the-original-array-of-prefix-xor/) - Recover array from prefix XOR

2. **Mathematical patterns in sequences**: Problems that require computing XOR of 1..n appear in:
   - [1486. XOR Operation in an Array](https://leetcode.com/problems/xor-operation-in-an-array/) - Similar XOR pattern recognition
   - [Missing Number](https://leetcode.com/problems/missing-number/) - Uses XOR of 1..n to find missing element

3. **Reconstruction from pairwise relationships**: When you have relationships between adjacent elements and need to reconstruct the whole sequence.

## Key Takeaways

1. **XOR is its own inverse**: This property (`a XOR b = c` implies `a = b XOR c`) is incredibly useful for decoding problems. Whenever you see XOR encoding, think about how to apply this inverse.

2. **Look for patterns in cumulative operations**: When dealing with sequences of numbers, there are often mathematical shortcuts (like the XOR pattern for 1..n) that can optimize your solution.

3. **Start with what you know**: In reconstruction problems, find one element you can determine uniquely, then use the given relationships to find the rest. Here, we found the first element by comparing the total XOR with the XOR of all other elements.

Related problems: [Find Xor-Beauty of Array](/problem/find-xor-beauty-of-array)
