---
title: "How to Solve Find Products of Elements of Big Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Products of Elements of Big Array. Hard difficulty, 24.5% acceptance rate. Topics: Array, Binary Search, Bit Manipulation."
date: "2026-09-27"
category: "dsa-patterns"
tags:
  ["find-products-of-elements-of-big-array", "array", "binary-search", "bit-manipulation", "hard"]
---

# How to Solve "Find Products of Elements of Big Array"

This problem asks us to work with a "Big Array" constructed from the powerful arrays of consecutive integers, then answer queries about the product of elements within specific ranges. The challenge lies in efficiently handling enormous ranges (up to 10¹⁵) while dealing with products that would quickly overflow normal integer bounds. The key insight is transforming the product problem into a sum problem using prime factorization, specifically focusing on the exponent of 2.

## Visual Walkthrough

Let's trace through a small example to build intuition. We're told the Big Array is built by concatenating powerful arrays of numbers 0, 1, 2, 3, ...

First, recall what powerful arrays are:

- Powerful array of 0 = [] (empty)
- Powerful array of 1 = [1] (2⁰)
- Powerful array of 2 = [2] (2¹)
- Powerful array of 3 = [1, 2] (2⁰ + 2¹)
- Powerful array of 4 = [4] (2²)
- Powerful array of 5 = [1, 4] (2⁰ + 2²)

So the Big Array starts as: [], [1], [2], [1,2], [4], [1,4], ...

Now consider a query: `queries = [[1,3,2]]`. This asks for the product of elements from index 1 to 3 (0-based) in the Big Array, then take that product modulo 2^2.

The Big Array indices:

- Index 0: (from 0's powerful array) - none
- Index 1: 1 (from 1's powerful array)
- Index 2: 2 (from 2's powerful array)
- Index 3: 1 (first element of 3's powerful array)
- Index 4: 2 (second element of 3's powerful array)

So indices 1-3 contain: [1, 2, 1]
Product = 1 × 2 × 1 = 2
2 modulo 2^2 = 2 modulo 4 = 2

But here's the crucial observation: instead of computing the actual product (which would quickly overflow), we can compute the exponent of 2 in the prime factorization of the product. For any number, if the exponent of 2 is `e`, then the number modulo 2^k is:

- 0 if e ≥ k
- 2^e × (odd part) mod 2^k otherwise

Since we only need the result modulo 2^k, and k ≤ 30, we can work entirely with the exponent of 2.

## Brute Force Approach

A naive approach would be:

1. Actually construct the Big Array up to the maximum index needed
2. For each query, multiply all elements in the range
3. Take the result modulo 2^k

The problem with this approach is scale. With indices up to 10¹⁵, we cannot possibly construct or store the array. Even if we could, the product would overflow any standard integer type. This brute force is completely infeasible, which tells us we need mathematical insight rather than direct computation.

## Optimized Approach

The key insight comes in three parts:

1. **Powerful arrays are just binary representations**: The powerful array of a number `x` contains the powers of 2 where the binary representation of `x` has a 1. For example, 5 in binary is 101₂, so its powerful array is [2⁰, 2²] = [1, 4].

2. **Product becomes sum of exponents**: When multiplying numbers that are all powers of 2, the product is 2^(sum of exponents). So instead of tracking the actual numbers, we can track the sum of exponents.

3. **We can count contributions efficiently**: For a range of indices in the Big Array, we need to find which numbers contribute which powers of 2. This becomes: for each possible exponent e (0 to ~60 since numbers go up to 10¹⁵), how many numbers in a certain range have the e-th bit set in their binary representation?

The algorithm outline:

- For each query [l, r, mod]:
  1. Compute S = sum of all exponents in Big Array from index l to r
  2. If S ≥ mod, return 0 (since 2^S is divisible by 2^mod)
  3. Otherwise, compute 2^S modulo 2^mod

The clever part is computing S efficiently. We can use a helper function `countBits(x, e)` that counts how many numbers from 0 to x have the e-th bit set. Then the count from l to r is `countBits(r, e) - countBits(l-1, e)`.

To compute `countBits(x, e)`:

- Numbers with the e-th bit set follow a pattern: they come in blocks of size 2^(e+1)
- In each complete block of 2^(e+1) numbers, exactly 2^e numbers have the e-th bit set
- The remainder needs special handling

## Optimal Solution

<div class="code-group">

```python
# Time: O(q * log(max(r))) where q = len(queries), log(max(r)) ≈ 60
# Space: O(1) excluding output
class Solution:
    def findProductsOfElements(self, queries):
        """
        Main function to process queries on the Big Array.

        The Big Array is constructed by concatenating powerful arrays
        of consecutive integers starting from 0.
        Each powerful array contains powers of 2 corresponding to
        the binary representation of the number.
        """
        def count_set_bits_up_to(x, bit_pos):
            """
            Count how many numbers from 0 to x (inclusive) have the
            bit at position 'bit_pos' set in their binary representation.

            The pattern repeats every 2^(bit_pos+1) numbers:
            - First 2^bit_pos numbers: bit is 0
            - Next 2^bit_pos numbers: bit is 1
            - Then repeats...
            """
            if x < 0:
                return 0

            block_size = 1 << (bit_pos + 1)  # 2^(bit_pos+1)
            full_blocks = (x + 1) // block_size
            count_in_full_blocks = full_blocks * (1 << bit_pos)  # full_blocks * 2^bit_pos

            remainder = (x + 1) % block_size
            count_in_remainder = max(0, remainder - (1 << bit_pos))

            return count_in_full_blocks + count_in_remainder

        def sum_of_exponents_in_range(l, r):
            """
            Calculate the sum of all exponents (powers of 2) in the
            Big Array from index l to r (inclusive).

            For each possible bit position (exponent), we count how many
            numbers in the range have that bit set, then multiply by the
            exponent value (since each set bit contributes that exponent
            to the sum).
            """
            total = 0
            # We need to consider bits up to ~60 because numbers can go up to ~10^15
            # and 2^60 ≈ 1.15e18 > 10^15
            for bit_pos in range(60):  # 60 bits is sufficient for 10^15
                # Count numbers with this bit set in range [0, r] minus [0, l-1]
                count_r = count_set_bits_up_to(r, bit_pos)
                count_l = count_set_bits_up_to(l - 1, bit_pos)
                count_in_range = count_r - count_l

                # Each number with this bit set contributes 'bit_pos' to the exponent sum
                total += count_in_range * bit_pos

            return total

        result = []
        for l, r, mod in queries:
            # Step 1: Calculate sum of exponents in range [l, r]
            exponent_sum = sum_of_exponents_in_range(l, r)

            # Step 2: If exponent_sum >= mod, result is 0 (divisible by 2^mod)
            if exponent_sum >= mod:
                result.append(0)
            else:
                # Step 3: Compute 2^exponent_sum modulo 2^mod
                # Since mod <= 30, we can use bit shifting
                result.append(1 << exponent_sum)

        return result
```

```javascript
// Time: O(q * log(max(r))) where q = queries.length, log(max(r)) ≈ 60
// Space: O(1) excluding output
/**
 * @param {number[][]} queries
 * @return {number[]}
 */
var findProductsOfElements = function (queries) {
  /**
   * Count how many numbers from 0 to x (inclusive) have the
   * bit at position 'bitPos' set in their binary representation.
   */
  const countSetBitsUpTo = (x, bitPos) => {
    if (x < 0) return 0;

    const blockSize = 1 << (bitPos + 1); // 2^(bitPos+1)
    const fullBlocks = Math.floor((x + 1) / blockSize);
    const countInFullBlocks = fullBlocks * (1 << bitPos); // fullBlocks * 2^bitPos

    const remainder = (x + 1) % blockSize;
    const countInRemainder = Math.max(0, remainder - (1 << bitPos));

    return countInFullBlocks + countInRemainder;
  };

  /**
   * Calculate the sum of all exponents (powers of 2) in the
   * Big Array from index l to r (inclusive).
   */
  const sumOfExponentsInRange = (l, r) => {
    let total = 0;
    // Consider bits up to 60 (sufficient for numbers up to 10^15)
    for (let bitPos = 0; bitPos < 60; bitPos++) {
      // Count numbers with this bit set in range [0, r] minus [0, l-1]
      const countR = countSetBitsUpTo(r, bitPos);
      const countL = countSetBitsUpTo(l - 1, bitPos);
      const countInRange = countR - countL;

      // Each number with this bit set contributes 'bitPos' to the exponent sum
      total += countInRange * bitPos;
    }
    return total;
  };

  const result = [];
  for (const [l, r, mod] of queries) {
    // Step 1: Calculate sum of exponents in range [l, r]
    const exponentSum = sumOfExponentsInRange(l, r);

    // Step 2: If exponentSum >= mod, result is 0 (divisible by 2^mod)
    if (exponentSum >= mod) {
      result.push(0);
    } else {
      // Step 3: Compute 2^exponentSum modulo 2^mod
      // Since mod <= 30, we can use bit shifting
      result.push(1 << exponentSum);
    }
  }

  return result;
};
```

```java
// Time: O(q * log(max(r))) where q = queries.length, log(max(r)) ≈ 60
// Space: O(1) excluding output
class Solution {
    /**
     * Main function to process queries on the Big Array.
     */
    public long[] findProductsOfElements(long[][] queries) {
        long[] result = new long[queries.length];

        for (int i = 0; i < queries.length; i++) {
            long l = queries[i][0];
            long r = queries[i][1];
            long mod = queries[i][2];

            // Step 1: Calculate sum of exponents in range [l, r]
            long exponentSum = sumOfExponentsInRange(l, r);

            // Step 2: If exponentSum >= mod, result is 0 (divisible by 2^mod)
            if (exponentSum >= mod) {
                result[i] = 0;
            } else {
                // Step 3: Compute 2^exponentSum modulo 2^mod
                // Since mod <= 30, we can use bit shifting
                result[i] = 1L << exponentSum;
            }
        }

        return result;
    }

    /**
     * Calculate the sum of all exponents (powers of 2) in the
     * Big Array from index l to r (inclusive).
     */
    private long sumOfExponentsInRange(long l, long r) {
        long total = 0;
        // Consider bits up to 60 (sufficient for numbers up to 10^15)
        for (int bitPos = 0; bitPos < 60; bitPos++) {
            // Count numbers with this bit set in range [0, r] minus [0, l-1]
            long countR = countSetBitsUpTo(r, bitPos);
            long countL = countSetBitsUpTo(l - 1, bitPos);
            long countInRange = countR - countL;

            // Each number with this bit set contributes 'bitPos' to the exponent sum
            total += countInRange * bitPos;
        }
        return total;
    }

    /**
     * Count how many numbers from 0 to x (inclusive) have the
     * bit at position 'bitPos' set in their binary representation.
     */
    private long countSetBitsUpTo(long x, int bitPos) {
        if (x < 0) return 0;

        long blockSize = 1L << (bitPos + 1);  // 2^(bitPos+1)
        long fullBlocks = (x + 1) / blockSize;
        long countInFullBlocks = fullBlocks * (1L << bitPos);  // fullBlocks * 2^bitPos

        long remainder = (x + 1) % blockSize;
        long countInRemainder = Math.max(0, remainder - (1L << bitPos));

        return countInFullBlocks + countInRemainder;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(q × B) where q is the number of queries and B is the number of bits we need to check (approximately 60). For each query, we iterate through 60 bit positions, and for each bit position, we perform O(1) operations to count set bits. So overall O(60q) = O(q).

**Space Complexity:** O(1) extra space excluding the output array. We only use a constant amount of variables regardless of input size.

The efficiency comes from:

1. Not constructing the actual Big Array
2. Using mathematical patterns to count set bits in ranges
3. Working with exponents instead of actual products

## Common Mistakes

1. **Actually trying to construct the array**: With indices up to 10¹⁵, any attempt to build the array will fail. Recognize when a problem requires mathematical insight rather than simulation.

2. **Incorrect bit counting formula**: The formula for counting numbers with a specific bit set is tricky. Common errors include:
   - Forgetting the `+1` in `(x + 1) // blockSize`
   - Mishandling the remainder calculation
   - Using `x` instead of `x + 1` when counting numbers from 0 to x inclusive

3. **Not handling large exponents correctly**: When computing `2^exponent_sum`, candidates might try to compute the actual power, which could overflow. Since we only need the result modulo `2^mod` and `mod ≤ 30`, we can use the fact that if `exponent_sum ≥ mod`, the result is 0, otherwise it's just `1 << exponent_sum`.

4. **Confusing array indices with numbers**: Remember that `l` and `r` are indices in the Big Array, not the numbers whose powerful arrays we're concatenating. We need to count which numbers contribute to these indices.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary representation as a sum of powers of 2**: Similar to problems like "Counting Bits" (LeetCode 338) or "Total Hamming Distance" (LeetCode 477), where you need to count set bits in ranges.

2. **Mathematical pattern recognition for counting**: The technique of counting numbers with specific bit patterns appears in problems like "Range Sum Query" variants where you need to compute aggregate properties over ranges without iterating through all elements.

3. **Product to sum transformation**: When dealing with products of numbers with a common base (like all powers of 2), converting to sums of exponents is a powerful technique. This appears in problems involving modular exponentiation or when working with prime factorizations.

Related LeetCode problems:

- **338. Counting Bits**: Counting set bits for each number up to n
- **477. Total Hamming Distance**: Counting bit differences across all pairs
- **233. Number of Digit One**: Counting occurrences of a digit in number ranges using mathematical patterns

## Key Takeaways

1. **When faced with enormous ranges (10¹⁵), think mathematically, not iteratively**. Look for patterns, formulas, and properties that let you compute results without constructing data structures.

2. **Products of powers of 2 become sums of exponents**. This transformation is crucial for avoiding overflow and simplifying computations.

3. **Bit counting in ranges has efficient formulas**. Learn the pattern: for the k-th bit, numbers alternate in blocks of size 2^k. This lets you count set bits in a range in O(1) time per bit position.

[Practice this problem on CodeJeet](/problem/find-products-of-elements-of-big-array)
