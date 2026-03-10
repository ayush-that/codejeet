---
title: "How to Solve Find the K-or of an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the K-or of an Array. Easy difficulty, 72.7% acceptance rate. Topics: Array, Bit Manipulation."
date: "2029-02-13"
category: "dsa-patterns"
tags: ["find-the-k-or-of-an-array", "array", "bit-manipulation", "easy"]
---

## How to Solve Find the K-or of an Array

The problem asks us to compute a "K-or" operation on an array of integers. For each bit position (from 0 to 31 for 32-bit integers), we check if at least `k` numbers in the array have that bit set to 1. If so, we set that bit to 1 in our result. This is essentially a generalization of the standard bitwise OR, where `k=1` would give the standard OR of all numbers.

What makes this problem interesting is that it combines bit manipulation with counting. While the concept is straightforward, it tests your ability to think in terms of bits and efficiently check conditions across multiple numbers. The tricky part is ensuring you correctly count bits at each position without getting lost in binary representations.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose `nums = [7, 12, 9, 8]` and `k = 2`.

First, let's look at the binary representations (using 4 bits for simplicity):

- 7 = 0111
- 12 = 1100
- 9 = 1001
- 8 = 1000

Now, for each bit position (from rightmost/least significant bit at position 0 to leftmost at position 3), we count how many numbers have a 1 in that position:

**Bit position 0** (rightmost, value 1):

- 7 has 1 (0111)
- 12 has 0 (1100)
- 9 has 1 (1001)
- 8 has 0 (1000)
  Count = 2. Since 2 ≥ k (2), we set this bit to 1 in our result.

**Bit position 1** (value 2):

- 7 has 1 (0111)
- 12 has 0 (1100)
- 9 has 0 (1001)
- 8 has 0 (1000)
  Count = 1. Since 1 < k (2), we set this bit to 0.

**Bit position 2** (value 4):

- 7 has 1 (0111)
- 12 has 1 (1100)
- 9 has 0 (1001)
- 8 has 0 (1000)
  Count = 2. Since 2 ≥ k, we set this bit to 1.

**Bit position 3** (value 8):

- 7 has 0 (0111)
- 12 has 1 (1100)
- 9 has 1 (1001)
- 8 has 1 (1000)
  Count = 3. Since 3 ≥ k, we set this bit to 1.

Our result has bits set at positions 0, 2, and 3. That's binary 1101, which is decimal 13. So the K-or of `[7, 12, 9, 8]` with `k=2` is 13.

## Brute Force Approach

A naive approach might try to compare every number with every other number, but that doesn't make sense for this problem. The more relevant "brute force" would be to check each bit position by literally counting how many numbers have that bit set, which is actually the optimal approach for this problem!

However, let's consider what a truly inefficient approach might look like: we could generate all possible subsets of size `k` from the array, compute the bitwise OR for each subset, then AND all those results together. This would be extremely inefficient with O(2^n) time complexity and is clearly not feasible for larger arrays.

The reason this problem only has one reasonable approach is that we're dealing with a fixed number of bits (32 for integers), so we can afford to check each bit position individually. The challenge is doing it efficiently and correctly.

## Optimal Solution

The optimal solution works by checking each bit position from 0 to 31. For each position, we count how many numbers in the array have that bit set. If the count is at least `k`, we set that bit in our result. We use bit shifting and masking to check individual bits.

<div class="code-group">

```python
# Time: O(32 * n) = O(n) | Space: O(1)
def findKOr(nums, k):
    """
    Compute the K-or of an array.

    Args:
        nums: List of integers
        k: Minimum count required to set a bit

    Returns:
        Integer representing the K-or result
    """
    result = 0  # Initialize result to 0

    # Check each bit position from 0 to 31 (for 32-bit integers)
    for bit in range(32):
        count = 0  # Count how many numbers have this bit set

        # Check each number in the array
        for num in nums:
            # Right shift the number by 'bit' positions and check if LSB is 1
            if (num >> bit) & 1:
                count += 1

        # If at least k numbers have this bit set, set it in the result
        if count >= k:
            # Left shift 1 by 'bit' positions to create mask, then OR with result
            result |= (1 << bit)

    return result
```

```javascript
// Time: O(32 * n) = O(n) | Space: O(1)
function findKOr(nums, k) {
  /**
   * Compute the K-or of an array.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Minimum count required to set a bit
   * @return {number} Integer representing the K-or result
   */
  let result = 0; // Initialize result to 0

  // Check each bit position from 0 to 31 (for 32-bit integers)
  for (let bit = 0; bit < 32; bit++) {
    let count = 0; // Count how many numbers have this bit set

    // Check each number in the array
    for (let num of nums) {
      // Right shift the number by 'bit' positions and check if LSB is 1
      if ((num >> bit) & 1) {
        count++;
      }
    }

    // If at least k numbers have this bit set, set it in the result
    if (count >= k) {
      // Left shift 1 by 'bit' positions to create mask, then OR with result
      result |= 1 << bit;
    }
  }

  return result;
}
```

```java
// Time: O(32 * n) = O(n) | Space: O(1)
class Solution {
    public int findKOr(int[] nums, int k) {
        /**
         * Compute the K-or of an array.
         *
         * @param nums Array of integers
         * @param k Minimum count required to set a bit
         * @return Integer representing the K-or result
         */
        int result = 0;  // Initialize result to 0

        // Check each bit position from 0 to 31 (for 32-bit integers)
        for (int bit = 0; bit < 32; bit++) {
            int count = 0;  // Count how many numbers have this bit set

            // Check each number in the array
            for (int num : nums) {
                // Right shift the number by 'bit' positions and check if LSB is 1
                if (((num >> bit) & 1) == 1) {
                    count++;
                }
            }

            // If at least k numbers have this bit set, set it in the result
            if (count >= k) {
                // Left shift 1 by 'bit' positions to create mask, then OR with result
                result |= (1 << bit);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(32 \* n) = O(n), where n is the length of the input array. We check 32 bit positions (constant for 32-bit integers), and for each position, we iterate through all n numbers. Since 32 is a constant, this simplifies to O(n).

**Space Complexity:** O(1). We only use a few integer variables (result, bit, count, and loop variables) regardless of input size. No additional data structures are needed.

The key insight is that 32 is a constant factor, not dependent on input size. Even if we consider 64-bit integers, it would still be O(64 \* n) = O(n).

## Common Mistakes

1. **Forgetting to handle k > n**: If k is greater than the number of elements in the array, no bit can possibly have k numbers with it set. The result should be 0. Our solution handles this correctly because count can never reach k in this case.

2. **Incorrect bit range**: Some candidates might check only up to 30 bits or check too many bits. For standard 32-bit signed integers, we need to check bits 0-31. Checking fewer bits might miss the most significant bits; checking more is unnecessary but harmless.

3. **Using division instead of bit shifting**: While `(num / (1 << bit)) % 2` works mathematically, it's less efficient and less clear than `(num >> bit) & 1`. Bit operations are the natural choice for bit manipulation problems.

4. **Not initializing result to 0**: Forgetting to initialize result means it could contain garbage values. Always initialize to 0 since we build the result by setting bits.

5. **Confusing bit positions with bit values**: Remember that bit position i corresponds to value 2^i. When we say "set bit at position i", we mean adding 2^i to our result.

## When You'll See This Pattern

This pattern of counting bits at each position appears in several bit manipulation problems:

1. **Counting Bits (LeetCode 338)**: While not identical, it also involves analyzing bits across numbers. The optimal solution uses dynamic programming with bit shifting.

2. **Sum of Values at Indices With K Set Bits (LeetCode 2859)**: This problem also involves counting set bits, though here you're counting bits in indices rather than values in an array.

3. **Single Number II (LeetCode 137)**: Uses a similar approach of counting bits at each position, then taking modulo 3 to find the number that appears once.

4. **Maximum XOR of Two Numbers in an Array (LeetCode 421)**: While more complex, it also involves analyzing bits position by position from most significant to least significant.

The core technique is breaking down numbers into their binary representations and processing one bit position at a time. This is often efficient because the number of bits is fixed (32 or 64), making it a constant factor.

## Key Takeaways

1. **Bit manipulation problems often benefit from processing one bit position at a time**. Since the number of bits is constant (32 or 64), this gives us O(n) solutions for problems that might seem more complex.

2. **The right shift (`>>`) and bitwise AND (`&`) operators are your friends** for checking individual bits. `(num >> i) & 1` is the standard idiom for checking if the i-th bit is set.

3. **When building a result bit by bit, use the left shift (`<<`) and OR (`|`) operations**. `result |= (1 << i)` sets the i-th bit in the result.

4. **Always consider edge cases**: What if k = 0? (All bits should be set, giving the bitwise OR of all numbers). What if k > n? (Result should be 0). What if the array is empty? (Result should be 0).

Related problems: [Counting Bits](/problem/counting-bits), [Sum of Values at Indices With K Set Bits](/problem/sum-of-values-at-indices-with-k-set-bits)
