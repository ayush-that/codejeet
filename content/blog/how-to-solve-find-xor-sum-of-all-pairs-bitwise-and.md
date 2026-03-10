---
title: "How to Solve Find XOR Sum of All Pairs Bitwise AND — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find XOR Sum of All Pairs Bitwise AND. Hard difficulty, 62.5% acceptance rate. Topics: Array, Math, Bit Manipulation."
date: "2029-07-19"
category: "dsa-patterns"
tags: ["find-xor-sum-of-all-pairs-bitwise-and", "array", "math", "bit-manipulation", "hard"]
---

# How to Solve Find XOR Sum of All Pairs Bitwise AND

This problem asks us to compute the XOR sum of all possible pairs bitwise AND between two arrays. Specifically, given two arrays `arr1` and `arr2`, we need to compute the XOR of `(arr1[i] & arr2[j])` for every pair `(i, j)`. At first glance, this seems to require O(n²) operations, but the problem's constraints (arrays up to length 1000) make that approach too slow. The key insight lies in leveraging bit manipulation properties to transform this combinatorial problem into a linear-time solution.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider:

- `arr1 = [1, 2, 3]`
- `arr2 = [5, 6]`

The brute force approach would compute all 3×2 = 6 pairs:

1. 1 & 5 = 1 (binary: 001 & 101 = 001)
2. 1 & 6 = 0 (001 & 110 = 000)
3. 2 & 5 = 0 (010 & 101 = 000)
4. 2 & 6 = 2 (010 & 110 = 010)
5. 3 & 5 = 1 (011 & 101 = 001)
6. 3 & 6 = 2 (011 & 110 = 010)

Now we XOR all these results: 1 ⊕ 0 ⊕ 0 ⊕ 2 ⊕ 1 ⊕ 2 = ?

Let's compute step by step:

- Start with 0: 0 ⊕ 1 = 1
- 1 ⊕ 0 = 1
- 1 ⊕ 0 = 1
- 1 ⊕ 2 = 3
- 3 ⊕ 1 = 2
- 2 ⊕ 2 = 0

Final result: 0

Now here's the key observation: XOR has a distributive property with respect to AND when combined with XOR sums. Specifically, the XOR sum of all pairs AND equals the AND of the XOR sum of `arr1` with the XOR sum of `arr2`. Let's verify:

XOR sum of `arr1`: 1 ⊕ 2 ⊕ 3 = 0 (1⊕2=3, 3⊕3=0)
XOR sum of `arr2`: 5 ⊕ 6 = 3 (101⊕110=011=3)
0 & 3 = 0 ✓

This works! The mathematical property is: `⊕_{i,j} (a_i & b_j) = (⊕_i a_i) & (⊕_j b_j)`. We'll prove why this works in the optimized approach section.

## Brute Force Approach

The most straightforward solution computes every possible pair explicitly:

1. Initialize `result = 0`
2. For each element `x` in `arr1`:
   - For each element `y` in `arr2`:
     - Compute `x & y`
     - XOR it with the current `result`
3. Return `result`

This approach is simple to implement but has O(m×n) time complexity, where m and n are the lengths of the two arrays. With constraints up to 1000 elements each, that's up to 1,000,000 operations, which might be acceptable in some cases but isn't optimal. More importantly, it doesn't demonstrate the bit manipulation insights interviewers are looking for.

<div class="code-group">

```python
# Time: O(m*n) | Space: O(1)
def getXORSum_brute(arr1, arr2):
    """
    Brute force solution - computes all pairs explicitly.
    Works but too slow for large inputs.
    """
    result = 0

    # Iterate through all pairs
    for x in arr1:
        for y in arr2:
            # Compute AND and XOR with result
            result ^= (x & y)

    return result
```

```javascript
// Time: O(m*n) | Space: O(1)
function getXORSumBrute(arr1, arr2) {
  /**
   * Brute force solution - computes all pairs explicitly.
   * Works but too slow for large inputs.
   */
  let result = 0;

  // Iterate through all pairs
  for (let x of arr1) {
    for (let y of arr2) {
      // Compute AND and XOR with result
      result ^= x & y;
    }
  }

  return result;
}
```

```java
// Time: O(m*n) | Space: O(1)
public int getXORSumBrute(int[] arr1, int[] arr2) {
    /**
     * Brute force solution - computes all pairs explicitly.
     * Works but too slow for large inputs.
     */
    int result = 0;

    // Iterate through all pairs
    for (int x : arr1) {
        for (int y : arr2) {
            // Compute AND and XOR with result
            result ^= (x & y);
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight comes from understanding how XOR and AND interact. Let's break down the mathematical property:

We want to compute: `R = ⊕_{i,j} (a_i & b_j)`

Where ⊕ represents XOR over all pairs (i,j).

First, note that XOR is linear over bits - we can consider each bit position independently. Let's look at the k-th bit:

The k-th bit of the result is 1 if the number of pairs where `(a_i & b_j)` has the k-th bit set is odd.

For the k-th bit to be set in `(a_i & b_j)`, both `a_i` and `b_j` must have their k-th bit set.

Let:

- `count1` = number of elements in `arr1` with k-th bit set
- `count2` = number of elements in `arr2` with k-th bit set

Then the number of pairs where both have the k-th bit set is `count1 × count2`.

The k-th bit of the result is 1 if `(count1 × count2)` is odd.

Now, `(count1 × count2)` is odd if and only if both `count1` and `count2` are odd.

When is `count1` odd? When the XOR of all elements in `arr1` has the k-th bit set (because XOR counts parity of 1s).

Similarly, `count2` is odd when the XOR of all elements in `arr2` has the k-th bit set.

Therefore, the k-th bit of the result is 1 if and only if both:

1. The XOR of `arr1` has the k-th bit set
2. The XOR of `arr2` has the k-th bit set

This is exactly equivalent to taking the AND of the two XOR sums!

So the algorithm becomes:

1. Compute `xor1` = XOR of all elements in `arr1`
2. Compute `xor2` = XOR of all elements in `arr2`
3. Return `xor1 & xor2`

## Optimal Solution

Here's the implementation of the optimal O(m+n) solution:

<div class="code-group">

```python
# Time: O(m+n) | Space: O(1)
def getXORSum(arr1, arr2):
    """
    Optimal solution using bit manipulation properties.

    Key insight: XOR sum of all pairs AND equals
    AND of the XOR sums of the two arrays.

    Proof: Consider each bit position independently.
    The k-th bit is set in the result if and only if
    it's set in both xor1 and xor2.
    """
    # Step 1: Compute XOR of all elements in arr1
    xor1 = 0
    for num in arr1:
        xor1 ^= num

    # Step 2: Compute XOR of all elements in arr2
    xor2 = 0
    for num in arr2:
        xor2 ^= num

    # Step 3: The result is the AND of the two XOR sums
    return xor1 & xor2
```

```javascript
// Time: O(m+n) | Space: O(1)
function getXORSum(arr1, arr2) {
  /**
   * Optimal solution using bit manipulation properties.
   *
   * Key insight: XOR sum of all pairs AND equals
   * AND of the XOR sums of the two arrays.
   *
   * Proof: Consider each bit position independently.
   * The k-th bit is set in the result if and only if
   * it's set in both xor1 and xor2.
   */
  // Step 1: Compute XOR of all elements in arr1
  let xor1 = 0;
  for (let num of arr1) {
    xor1 ^= num;
  }

  // Step 2: Compute XOR of all elements in arr2
  let xor2 = 0;
  for (let num of arr2) {
    xor2 ^= num;
  }

  // Step 3: The result is the AND of the two XOR sums
  return xor1 & xor2;
}
```

```java
// Time: O(m+n) | Space: O(1)
public int getXORSum(int[] arr1, int[] arr2) {
    /**
     * Optimal solution using bit manipulation properties.
     *
     * Key insight: XOR sum of all pairs AND equals
     * AND of the XOR sums of the two arrays.
     *
     * Proof: Consider each bit position independently.
     * The k-th bit is set in the result if and only if
     * it's set in both xor1 and xor2.
     */
    // Step 1: Compute XOR of all elements in arr1
    int xor1 = 0;
    for (int num : arr1) {
        xor1 ^= num;
    }

    // Step 2: Compute XOR of all elements in arr2
    int xor2 = 0;
    for (int num : arr2) {
        xor2 ^= num;
    }

    // Step 3: The result is the AND of the two XOR sums
    return xor1 & xor2;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m + n), where m is the length of `arr1` and n is the length of `arr2`. We make two passes: one through each array to compute their XOR sums.

**Space Complexity:** O(1). We only use a constant amount of extra space to store the XOR sums.

Compare this to the brute force O(m×n) solution: for arrays of length 1000 each, that's 1,000,000 vs 2,000 operations - a 500× improvement!

## Common Mistakes

1. **Using the brute force approach without optimization**: While the brute force solution produces the correct answer, it's inefficient and doesn't demonstrate the bit manipulation insights interviewers want to see. Always look for patterns when dealing with bitwise operations.

2. **Misunderstanding the XOR sum definition**: Some candidates confuse XOR sum with regular sum. Remember: XOR sum uses the XOR operator (^), not addition. The XOR of a single element is the element itself.

3. **Incorrectly applying the distributive property**: The property `⊕_{i,j} (a_i & b_j) = (⊕_i a_i) & (⊕_j b_j)` is specific to XOR and AND. Don't assume it works for other combinations like OR or addition.

4. **Forgetting to handle empty arrays**: While the problem constraints guarantee non-empty arrays, it's good practice to consider edge cases. If either array were empty, the XOR sum would be 0 (XOR of empty set is 0).

## When You'll See This Pattern

This problem teaches the important technique of **bit independence analysis** - considering each bit position separately when dealing with bitwise operations. This pattern appears in several other problems:

1. **Maximum XOR of Two Numbers in an Array (LeetCode 421)**: Uses a similar bit-by-bit approach with a trie data structure to find maximum XOR pairs.

2. **Total Hamming Distance (LeetCode 477)**: Counts bits at each position independently to compute sum of Hamming distances between all pairs.

3. **Counting Bits (LeetCode 338)**: Uses bit manipulation patterns to count set bits efficiently.

4. **Single Number II (LeetCode 137)**: Extends the XOR concept to handle numbers appearing three times instead of twice.

The core idea is that many bitwise operation problems become simpler when you realize you can process each bit position independently and combine results.

## Key Takeaways

1. **Bit independence is powerful**: When dealing with XOR, AND, and OR operations, often you can consider each bit position separately. This transforms combinatorial problems into simpler counting problems.

2. **Look for mathematical properties**: XOR has unique algebraic properties that often lead to simplifications. The distributive property of XOR over AND (in this specific form) is worth remembering.

3. **Parity matters with XOR**: XOR essentially counts parity (odd/even) of 1s. This is why the product `count1 × count2` being odd requires both counts to be odd.

4. **Always verify with examples**: When you discover a pattern like `(⊕_i a_i) & (⊕_j b_j)`, test it with small examples to build confidence before implementing.

[Practice this problem on CodeJeet](/problem/find-xor-sum-of-all-pairs-bitwise-and)
