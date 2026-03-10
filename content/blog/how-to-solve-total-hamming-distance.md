---
title: "How to Solve Total Hamming Distance — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Total Hamming Distance. Medium difficulty, 54.6% acceptance rate. Topics: Array, Math, Bit Manipulation."
date: "2026-12-03"
category: "dsa-patterns"
tags: ["total-hamming-distance", "array", "math", "bit-manipulation", "medium"]
---

# How to Solve Total Hamming Distance

The problem asks us to compute the sum of Hamming distances between all pairs of integers in an array. The Hamming distance between two integers is the number of positions where their binary bits differ. What makes this problem interesting is that a brute-force approach checking every pair would be O(n²), which is too slow for large arrays. The key insight is that we can compute the total distance bit-by-bit independently, leading to an O(n) solution.

## Visual Walkthrough

Let's trace through a small example: `nums = [4, 14, 2]`.

First, let's write these numbers in binary (using 4 bits for clarity):

- 4 = 0100
- 14 = 1110
- 2 = 0010

Now, let's compute all pairwise Hamming distances:

- Between 4 (0100) and 14 (1110): bits differ at positions 0, 1, and 3 → distance = 3
- Between 4 (0100) and 2 (0010): bits differ at positions 1 and 2 → distance = 2
- Between 14 (1110) and 2 (0010): bits differ at positions 0, 1, and 3 → distance = 3

Total Hamming distance = 3 + 2 + 3 = 8.

Now let's see the smarter approach. Instead of comparing whole numbers, let's look at each bit position separately:

**Bit position 0 (rightmost bit, 2⁰):**

- 4: 0
- 14: 0
- 2: 0
  All bits are 0, so no pairs have different bits at this position → contribution = 0

**Bit position 1 (2¹):**

- 4: 0
- 14: 1
- 2: 1
  We have one 0 and two 1s. Each 0 pairs with each 1 → 1 × 2 = 2 pairs with different bits → contribution = 2

**Bit position 2 (2²):**

- 4: 1
- 14: 1
- 2: 0
  We have two 1s and one 0 → 2 × 1 = 2 pairs with different bits → contribution = 2

**Bit position 3 (2³):**

- 4: 0
- 14: 1
- 2: 0
  We have one 1 and two 0s → 1 × 2 = 2 pairs with different bits → contribution = 2

Total = 0 + 2 + 2 + 2 = 8, which matches our pairwise calculation.

The pattern is: for each bit position, count how many numbers have that bit set to 1 (let's call this `countOnes`). Then `countZeros = n - countOnes`. The number of pairs with different bits at this position is `countOnes × countZeros`. Sum this across all bit positions.

## Brute Force Approach

The most straightforward solution is to compute the Hamming distance for every pair of numbers and sum them up. We can compute Hamming distance between two numbers using XOR: `x ^ y` gives us a number where bits are set only where `x` and `y` differ, then we count the set bits.

<div class="code-group">

```python
# Time: O(n² * b) where n = len(nums), b = number of bits (32)
# Space: O(1)
def totalHammingDistanceBruteForce(nums):
    total = 0
    n = len(nums)

    # Check every pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            # XOR gives 1s only where bits differ
            xor_result = nums[i] ^ nums[j]

            # Count set bits in xor_result
            distance = 0
            while xor_result:
                # Clear the lowest set bit
                xor_result &= xor_result - 1
                distance += 1

            total += distance

    return total
```

```javascript
// Time: O(n² * b) where n = nums.length, b = number of bits (32)
// Space: O(1)
function totalHammingDistanceBruteForce(nums) {
  let total = 0;
  const n = nums.length;

  // Check every pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // XOR gives 1s only where bits differ
      let xorResult = nums[i] ^ nums[j];

      // Count set bits in xorResult
      let distance = 0;
      while (xorResult) {
        // Clear the lowest set bit
        xorResult &= xorResult - 1;
        distance++;
      }

      total += distance;
    }
  }

  return total;
}
```

```java
// Time: O(n² * b) where n = nums.length, b = number of bits (32)
// Space: O(1)
public int totalHammingDistanceBruteForce(int[] nums) {
    int total = 0;
    int n = nums.length;

    // Check every pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // XOR gives 1s only where bits differ
            int xorResult = nums[i] ^ nums[j];

            // Count set bits in xorResult
            int distance = 0;
            while (xorResult != 0) {
                // Clear the lowest set bit
                xorResult &= xorResult - 1;
                distance++;
            }

            total += distance;
        }
    }

    return total;
}
```

</div>

This brute force approach has O(n²) time complexity because we check all n(n-1)/2 pairs. For each pair, we count set bits which takes O(b) time where b is the number of bits (32 for 32-bit integers). This gives us O(n² × b) total time, which is too slow for n up to 10⁴ (the typical constraint for such problems).

## Optimized Approach

The key insight is that **Hamming distance is additive across bit positions**. We don't need to compare whole numbers; we can process each bit position independently.

For each bit position (from 0 to 31 for 32-bit integers):

1. Count how many numbers have that bit set to 1 (call this `countOnes`)
2. The remaining numbers have that bit set to 0: `countZeros = n - countOnes`
3. Each number with bit=1 forms a pair with each number with bit=0, contributing 1 to the total Hamming distance for that bit position
4. So the contribution from this bit position is `countOnes × countZeros`

We sum this across all 32 bit positions to get the total.

Why does this work? Because Hamming distance between two numbers is the sum of differences at each bit position. Each bit position contributes either 0 or 1 to the distance between a pair. By counting how many pairs have different bits at each position and summing across positions, we get the total.

This approach reduces the time complexity from O(n²) to O(n × b), where b=32 is constant, so it's effectively O(n).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * 32) = O(n) where n = len(nums)
# Space: O(1)
def totalHammingDistance(nums):
    total = 0
    n = len(nums)

    # Check each of the 32 bit positions (for 32-bit integers)
    for bit in range(32):
        # Count how many numbers have this bit set to 1
        count_ones = 0

        for num in nums:
            # Check if the bit at position 'bit' is set
            # Right shift num by 'bit' positions and check LSB
            if (num >> bit) & 1:
                count_ones += 1

        # Numbers with this bit = 0
        count_zeros = n - count_ones

        # Each 1 pairs with each 0, contributing 1 to total distance
        # for this bit position
        total += count_ones * count_zeros

    return total
```

```javascript
// Time: O(n * 32) = O(n) where n = nums.length
// Space: O(1)
function totalHammingDistance(nums) {
  let total = 0;
  const n = nums.length;

  // Check each of the 32 bit positions (for 32-bit integers)
  for (let bit = 0; bit < 32; bit++) {
    // Count how many numbers have this bit set to 1
    let countOnes = 0;

    for (let i = 0; i < n; i++) {
      // Check if the bit at position 'bit' is set
      // Right shift num by 'bit' positions and check LSB
      if ((nums[i] >> bit) & 1) {
        countOnes++;
      }
    }

    // Numbers with this bit = 0
    const countZeros = n - countOnes;

    // Each 1 pairs with each 0, contributing 1 to total distance
    // for this bit position
    total += countOnes * countZeros;
  }

  return total;
}
```

```java
// Time: O(n * 32) = O(n) where n = nums.length
// Space: O(1)
public int totalHammingDistance(int[] nums) {
    int total = 0;
    int n = nums.length;

    // Check each of the 32 bit positions (for 32-bit integers)
    for (int bit = 0; bit < 32; bit++) {
        // Count how many numbers have this bit set to 1
        int countOnes = 0;

        for (int num : nums) {
            // Check if the bit at position 'bit' is set
            // Right shift num by 'bit' positions and check LSB
            if (((num >> bit) & 1) == 1) {
                countOnes++;
            }
        }

        // Numbers with this bit = 0
        int countZeros = n - countOnes;

        // Each 1 pairs with each 0, contributing 1 to total distance
        // for this bit position
        total += countOnes * countZeros;
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 32) = O(n), where n is the length of the input array. We iterate through all 32 bit positions (constant), and for each bit position, we iterate through all n numbers to count how many have that bit set.

**Space Complexity:** O(1). We only use a few integer variables (`total`, `countOnes`, `countZeros`, loop counters) regardless of input size.

## Common Mistakes

1. **Using the wrong number of bits:** Some candidates use 31 bits instead of 32, forgetting that integers can use all 32 bits (including the sign bit). In this problem, we're given non-negative integers, but it's good practice to handle all 32 bits. Always check the problem constraints.

2. **Incorrect bit checking:** The expression `(num >> bit) & 1` is correct. A common mistake is using `(num & (1 << bit)) != 0`, which works but is less intuitive. Another mistake is forgetting the parentheses: `num >> bit & 1` might have wrong operator precedence in some languages.

3. **Off-by-one in bit range:** Looping `for bit in range(31)` instead of `range(32)` misses the highest bit. Remember: for 32-bit integers, bits are numbered 0 to 31.

4. **Not handling empty or single-element arrays:** The formula `countOnes * countZeros` works correctly even when n=0 or n=1. When n=1, `countZeros = 1 - countOnes`, so either `1*0=0` or `0*1=0`, giving total=0 correctly (no pairs).

## When You'll See This Pattern

This "count by bit position" pattern appears in several bit manipulation problems:

1. **Counting Bits (LeetCode 338):** While not identical, it also involves analyzing bits position by position to count set bits efficiently.

2. **Single Number II (LeetCode 137):** You count bits at each position modulo 3 to find the number that appears once.

3. **Maximum Product of Word Lengths (LeetCode 318):** Uses bitmasks to represent letters in words, then compares these masks using bit operations.

4. **Sum of Digit Differences of All Pairs (LeetCode 3153):** This is essentially the same problem but for decimal digits instead of binary bits.

The core pattern is: when a problem involves pairwise comparisons where the metric is additive across components (bits, digits, characters), consider processing each component separately and combining results.

## Key Takeaways

1. **Decompose additive metrics:** When a distance or difference metric between pairs can be expressed as a sum of independent components (like bits in Hamming distance), process each component separately. This often turns O(n²) problems into O(n) problems.

2. **Bit counting pattern:** For problems involving binary representations, consider counting how many numbers have each bit set. The formula `countOnes × countZeros` gives the number of pairs with different bits at that position.

3. **Think in terms of contributions:** Instead of computing pairwise distances directly, think about how each element (bit position, digit position) contributes to the total. This shift in perspective is key to optimizing many combinatorial problems.

Related problems: [Hamming Distance](/problem/hamming-distance), [Sum of Digit Differences of All Pairs](/problem/sum-of-digit-differences-of-all-pairs)
