---
title: "How to Solve Bitwise XOR of All Pairings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Bitwise XOR of All Pairings. Medium difficulty, 66.9% acceptance rate. Topics: Array, Bit Manipulation, Brainteaser."
date: "2026-08-31"
category: "dsa-patterns"
tags: ["bitwise-xor-of-all-pairings", "array", "bit-manipulation", "brainteaser", "medium"]
---

# How to Solve Bitwise XOR of All Pairings

This problem asks us to compute the XOR of all possible pairs between two arrays, where each element from the first array is paired with every element from the second array. The challenge lies in doing this efficiently without actually generating all pairs, which would be too slow for large arrays. The key insight involves understanding XOR's mathematical properties.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Example:** nums1 = [1, 2], nums2 = [3, 4]

All possible pairings:

- 1 XOR 3 = 2
- 1 XOR 4 = 5
- 2 XOR 3 = 1
- 2 XOR 4 = 6

Now XOR all results together: 2 XOR 5 XOR 1 XOR 6 = 0

But notice something interesting: Let's rearrange the XOR operations:
(1 XOR 3) XOR (1 XOR 4) XOR (2 XOR 3) XOR (2 XOR 4)

By XOR's commutative and associative properties, we can rearrange:
(1 XOR 1 XOR 2 XOR 2) XOR (3 XOR 3 XOR 4 XOR 4)

Each number from nums1 appears len(nums2) times, and each number from nums2 appears len(nums1) times.

So we can compute:

- XOR of all nums1 elements, repeated len(nums2) times
- XOR of all nums2 elements, repeated len(nums1) times

For our example:

- XOR of nums1 = 1 XOR 2 = 3
- XOR of nums2 = 3 XOR 4 = 7

If len(nums2) is even: 3 appears even times → contributes 0
If len(nums1) is even: 7 appears even times → contributes 0

Since both lengths are 2 (even), final result is 0, which matches our brute force calculation.

## Brute Force Approach

The most straightforward approach is to generate all possible pairs and compute their XOR:

1. Initialize result = 0
2. For each element in nums1:
   - For each element in nums2:
     - Compute XOR of the pair
     - XOR it with the running result
3. Return the final result

This approach has O(m × n) time complexity where m = len(nums1) and n = len(nums2). For arrays with up to 10⁵ elements each (as typical in LeetCode constraints), this would require up to 10¹⁰ operations, which is far too slow.

<div class="code-group">

```python
# Time: O(m × n) | Space: O(1)
def xorAllNums_brute(nums1, nums2):
    result = 0
    for num1 in nums1:
        for num2 in nums2:
            result ^= (num1 ^ num2)
    return result
```

```javascript
// Time: O(m × n) | Space: O(1)
function xorAllNumsBrute(nums1, nums2) {
  let result = 0;
  for (let num1 of nums1) {
    for (let num2 of nums2) {
      result ^= num1 ^ num2;
    }
  }
  return result;
}
```

```java
// Time: O(m × n) | Space: O(1)
public int xorAllNumsBrute(int[] nums1, int[] nums2) {
    int result = 0;
    for (int num1 : nums1) {
        for (int num2 : nums2) {
            result ^= (num1 ^ num2);
        }
    }
    return result;
}
```

</div>

## Optimized Approach

The key insight comes from understanding XOR properties:

1. **Commutative**: a XOR b = b XOR a
2. **Associative**: (a XOR b) XOR c = a XOR (b XOR c)
3. **Self-inverse**: a XOR a = 0
4. **Identity**: a XOR 0 = a

When we expand all pairings:

- Each element from nums1 appears exactly len(nums2) times in the XOR chain
- Each element from nums2 appears exactly len(nums1) times in the XOR chain

Therefore:

- If len(nums2) is even, all nums1 elements cancel out (appear even times)
- If len(nums1) is even, all nums2 elements cancel out (appear even times)

The optimized algorithm:

1. Compute XOR of all elements in nums1 (call it xor1)
2. Compute XOR of all elements in nums2 (call it xor2)
3. Initialize result = 0
4. If len(nums2) is odd, XOR result with xor1
5. If len(nums1) is odd, XOR result with xor2
6. Return result

This works because:

- When a count is odd, the XOR of that array contributes to the result
- When a count is even, the XOR of that array cancels out completely

## Optimal Solution

<div class="code-group">

```python
# Time: O(m + n) | Space: O(1)
def xorAllNums(nums1, nums2):
    """
    Compute XOR of all possible pairs between nums1 and nums2.

    Key insight: Each element from nums1 appears len(nums2) times,
    and each element from nums2 appears len(nums1) times.
    If count is even, all occurrences cancel out (x ^ x = 0).
    If count is odd, the element contributes once.
    """
    # Step 1: Compute XOR of all elements in nums1
    xor1 = 0
    for num in nums1:
        xor1 ^= num

    # Step 2: Compute XOR of all elements in nums2
    xor2 = 0
    for num in nums2:
        xor2 ^= num

    # Step 3: Initialize result
    result = 0

    # Step 4: If nums2 has odd length, nums1 elements appear odd times
    # So include XOR of all nums1 elements
    if len(nums2) % 2 == 1:
        result ^= xor1

    # Step 5: If nums1 has odd length, nums2 elements appear odd times
    # So include XOR of all nums2 elements
    if len(nums1) % 2 == 1:
        result ^= xor2

    return result
```

```javascript
// Time: O(m + n) | Space: O(1)
function xorAllNums(nums1, nums2) {
  /**
   * Compute XOR of all possible pairs between nums1 and nums2.
   *
   * Key insight: Each element from nums1 appears nums2.length times,
   * and each element from nums2 appears nums1.length times.
   * If count is even, all occurrences cancel out (x ^ x = 0).
   * If count is odd, the element contributes once.
   */

  // Step 1: Compute XOR of all elements in nums1
  let xor1 = 0;
  for (let num of nums1) {
    xor1 ^= num;
  }

  // Step 2: Compute XOR of all elements in nums2
  let xor2 = 0;
  for (let num of nums2) {
    xor2 ^= num;
  }

  // Step 3: Initialize result
  let result = 0;

  // Step 4: If nums2 has odd length, nums1 elements appear odd times
  // So include XOR of all nums1 elements
  if (nums2.length % 2 === 1) {
    result ^= xor1;
  }

  // Step 5: If nums1 has odd length, nums2 elements appear odd times
  // So include XOR of all nums2 elements
  if (nums1.length % 2 === 1) {
    result ^= xor2;
  }

  return result;
}
```

```java
// Time: O(m + n) | Space: O(1)
public int xorAllNums(int[] nums1, int[] nums2) {
    /**
     * Compute XOR of all possible pairs between nums1 and nums2.
     *
     * Key insight: Each element from nums1 appears nums2.length times,
     * and each element from nums2 appears nums1.length times.
     * If count is even, all occurrences cancel out (x ^ x = 0).
     * If count is odd, the element contributes once.
     */

    // Step 1: Compute XOR of all elements in nums1
    int xor1 = 0;
    for (int num : nums1) {
        xor1 ^= num;
    }

    // Step 2: Compute XOR of all elements in nums2
    int xor2 = 0;
    for (int num : nums2) {
        xor2 ^= num;
    }

    // Step 3: Initialize result
    int result = 0;

    // Step 4: If nums2 has odd length, nums1 elements appear odd times
    // So include XOR of all nums1 elements
    if (nums2.length % 2 == 1) {
        result ^= xor1;
    }

    // Step 5: If nums1 has odd length, nums2 elements appear odd times
    // So include XOR of all nums2 elements
    if (nums1.length % 2 == 1) {
        result ^= xor2;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m + n)

- We iterate through nums1 once to compute its XOR: O(m)
- We iterate through nums2 once to compute its XOR: O(n)
- The conditional checks are O(1)
- Total: O(m + n)

**Space Complexity:** O(1)

- We only use a few integer variables (xor1, xor2, result)
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting XOR properties**: Some candidates try to use addition or multiplication instead of recognizing XOR's cancellation property (a XOR a = 0). Remember that XOR is not distributive over addition.

2. **Incorrect parity handling**: A common error is to check if array lengths are even/odd but apply the wrong logic. Remember:
   - If len(nums2) is odd → include XOR of nums1
   - If len(nums1) is odd → include XOR of nums2
     Not the other way around!

3. **Overcomplicating with bit counting**: Some candidates try to count bits at each position separately. While this works, it's unnecessarily complex (O(32×(m+n)) vs O(m+n)).

4. **Not testing edge cases**: Always test:
   - Empty arrays (should return 0)
   - Single-element arrays
   - Arrays where all elements are the same
   - Arrays with maximum values (to check for integer overflow - not an issue with XOR)

## When You'll See This Pattern

This pattern of using XOR properties appears in several other problems:

1. **Single Number (LeetCode 136)**: Find the element that appears once when all others appear twice. Solution: XOR all numbers together.

2. **Missing Number (LeetCode 268)**: Find the missing number in range [0, n]. Solution: XOR all numbers with indices.

3. **Find the Duplicate Number (LeetCode 287)**: While the optimal solution uses Floyd's algorithm, XOR-based approaches are common initial attempts.

4. **Decode XORed Array (LeetCode 1720)**: Reconstruct original array given XOR of consecutive elements.

The common thread is recognizing that XOR cancels identical values and has useful algebraic properties for solving problems without extra space.

## Key Takeaways

1. **XOR is your friend for cancellation problems**: When elements appear in pairs or specific counts, XOR often provides an O(n) solution with O(1) space.

2. **Count parity matters more than actual counts**: For XOR operations, only whether a count is odd or even matters, not the exact count.

3. **Always expand and rearrange operations**: When faced with combinatorial operations, try expanding a small example and rearranging using mathematical properties (commutative, associative, distributive).

4. **Think about frequency before implementation**: Before writing code, ask: "How many times does each element contribute to the final result?"

[Practice this problem on CodeJeet](/problem/bitwise-xor-of-all-pairings)
