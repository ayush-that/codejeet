---
title: "How to Solve Find Sum of Array Product of Magical Sequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Sum of Array Product of Magical Sequences. Hard difficulty, 62.0% acceptance rate. Topics: Array, Math, Dynamic Programming, Bit Manipulation, Combinatorics."
date: "2028-06-30"
category: "dsa-patterns"
tags:
  ["find-sum-of-array-product-of-magical-sequences", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Find Sum of Array Product of Magical Sequences

This problem asks us to find the sum of products of all magical sequences, where a sequence is magical if it has length `m`, its elements are indices into `nums`, and the binary representation of `2^seq[0] + 2^seq[1] + ... + 2^seq[m-1]` has exactly `k` set bits. The tricky part is that we need to consider all possible index combinations while efficiently checking the bit condition and computing the product sum.

## Visual Walkthrough

Let's walk through a small example: `nums = [2, 3, 5]`, `m = 2`, `k = 1`.

We need to find all sequences of length 2 where each element is an index (0, 1, or 2). Let's list all possible sequences:

1. `[0, 0]`: Value = 2^0 + 2^0 = 1 + 1 = 2 (binary: 10) → 1 set bit ✓
   Product = nums[0] × nums[0] = 2 × 2 = 4

2. `[0, 1]`: Value = 2^0 + 2^1 = 1 + 2 = 3 (binary: 11) → 2 set bits ✗

3. `[0, 2]`: Value = 2^0 + 2^2 = 1 + 4 = 5 (binary: 101) → 2 set bits ✗

4. `[1, 0]`: Value = 2^1 + 2^0 = 2 + 1 = 3 (binary: 11) → 2 set bits ✗

5. `[1, 1]`: Value = 2^1 + 2^1 = 2 + 2 = 4 (binary: 100) → 1 set bit ✓
   Product = nums[1] × nums[1] = 3 × 3 = 9

6. `[1, 2]`: Value = 2^1 + 2^2 = 2 + 4 = 6 (binary: 110) → 2 set bits ✗

7. `[2, 0]`: Value = 2^2 + 2^0 = 4 + 1 = 5 (binary: 101) → 2 set bits ✗

8. `[2, 1]`: Value = 2^2 + 2^1 = 4 + 2 = 6 (binary: 110) → 2 set bits ✗

9. `[2, 2]`: Value = 2^2 + 2^2 = 4 + 4 = 8 (binary: 1000) → 1 set bit ✓
   Product = nums[2] × nums[2] = 5 × 5 = 25

Total sum = 4 + 9 + 25 = 38

Notice that sequences like `[0, 1]` and `[1, 0]` produce the same value (3) but are different sequences. The bit condition depends only on which indices are chosen (with repetition allowed), not their order.

## Brute Force Approach

The brute force approach would generate all possible sequences of length `m` where each element is between 0 and `n-1` (where `n = len(nums)`). For each sequence:

1. Compute the sum of 2^seq[i] for all i
2. Count the number of set bits in this sum
3. If it equals `k`, compute the product of nums[seq[i]] for all i and add to total

This approach has `n^m` possible sequences, which grows exponentially with `m`. Even for moderate values like `n=10` and `m=10`, we'd have 10^10 sequences to check, which is completely infeasible.

The key insight is that the bit condition doesn't depend on the order of indices, only on which indices appear (with multiplicities). We can think of each sequence as a multiset of indices.

## Optimized Approach

The optimized approach uses dynamic programming with bitmasking:

1. **Observation**: The value `2^seq[0] + 2^seq[1] + ... + 2^seq[m-1]` is essentially a bitmask where bit `i` is set if index `i` appears in the sequence. However, since indices can repeat, we need to track how many times each index appears.

2. **Key Insight**: Instead of tracking exact counts, we can use generating functions. Let `dp[mask][j]` = sum of products of all sequences that use indices corresponding to bits in `mask` and have length `j`. But this still has complexity O(2^n × m), which is too slow for n up to 15.

3. **Better Insight**: Since `n ≤ 15`, we can iterate over all possible masks (2^n possibilities). For each mask, if it has exactly `k` set bits, we need to find all ways to create sequences of length `m` using only indices in the mask (with repetition allowed) and sum their products.

4. **Combinatorial Formula**: For a given mask with `k` indices, the sum of products of all sequences of length `m` using only these indices (with repetition) is `(sum of nums[i] for i in mask)^m`. Wait, that's not quite right - that would be if we were summing the values, but we need to sum products.

5. **Correct Formula**: Actually, the sum of products of all sequences of length `m` using indices from set S is `(sum_{i∈S} nums[i])^m`. Let's verify with our example:
   - For mask with indices {0}: sum = 2, sequences: [0,0], product = 2×2 = 4, (2)^2 = 4 ✓
   - For mask with indices {1}: sum = 3, sequences: [1,1], product = 3×3 = 9, (3)^2 = 9 ✓
   - For mask with indices {2}: sum = 5, sequences: [2,2], product = 5×5 = 25, (5)^2 = 25 ✓

   But what about masks with multiple indices? Let's test mask {0,1} with m=2:
   - Sequences: [0,0],[0,1],[1,0],[1,1]
   - Products: 4, 6, 6, 9
   - Sum: 25
   - (2+3)^2 = 25 ✓

6. **Final Algorithm**:
   - Iterate over all masks from 0 to 2^n - 1
   - If a mask has exactly `k` set bits:
     - Compute sum of nums[i] for all i where mask has bit i set
     - Add (sum)^m to the total answer
   - Return answer modulo 10^9+7

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^n * n) where n = len(nums) ≤ 15
# Space: O(1) excluding input storage
def sumOfProduct(nums, m, k):
    MOD = 10**9 + 7
    n = len(nums)
    result = 0

    # Iterate over all possible masks (0 to 2^n - 1)
    for mask in range(1 << n):
        # Count number of set bits in mask
        bit_count = bin(mask).count('1')

        # Only consider masks with exactly k set bits
        if bit_count != k:
            continue

        # Compute sum of nums[i] for all set bits in mask
        current_sum = 0
        for i in range(n):
            if mask & (1 << i):  # Check if i-th bit is set
                current_sum += nums[i]

        # Add (current_sum)^m to result
        # Use modular exponentiation for efficiency with large m
        result = (result + pow(current_sum, m, MOD)) % MOD

    return result
```

```javascript
// Time: O(2^n * n) where n = nums.length ≤ 15
// Space: O(1) excluding input storage
function sumOfProduct(nums, m, k) {
  const MOD = 1_000_000_007n; // Use BigInt for safety with large numbers
  const n = nums.length;
  let result = 0n;

  // Iterate over all possible masks (0 to 2^n - 1)
  for (let mask = 0; mask < 1 << n; mask++) {
    // Count number of set bits in mask
    let bitCount = 0;
    let tempMask = mask;
    while (tempMask > 0) {
      bitCount += tempMask & 1;
      tempMask >>= 1;
    }

    // Only consider masks with exactly k set bits
    if (bitCount !== k) {
      continue;
    }

    // Compute sum of nums[i] for all set bits in mask
    let currentSum = 0n;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        // Check if i-th bit is set
        currentSum += BigInt(nums[i]);
      }
    }

    // Add (currentSum)^m to result using modular exponentiation
    result = (result + modPow(currentSum, BigInt(m), MOD)) % MOD;
  }

  return Number(result);
}

// Helper function for modular exponentiation
function modPow(base, exponent, mod) {
  let result = 1n;
  base = base % mod;

  while (exponent > 0n) {
    // If exponent is odd, multiply base with result
    if (exponent & 1n) {
      result = (result * base) % mod;
    }
    // exponent must be even now
    exponent >>= 1n;
    base = (base * base) % mod;
  }

  return result;
}
```

```java
// Time: O(2^n * n) where n = nums.length ≤ 15
// Space: O(1) excluding input storage
public class Solution {
    private static final int MOD = 1_000_000_007;

    public int sumOfProduct(int[] nums, int m, int k) {
        int n = nums.length;
        long result = 0;

        // Iterate over all possible masks (0 to 2^n - 1)
        for (int mask = 0; mask < (1 << n); mask++) {
            // Count number of set bits in mask
            if (Integer.bitCount(mask) != k) {
                continue;
            }

            // Compute sum of nums[i] for all set bits in mask
            long currentSum = 0;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {  // Check if i-th bit is set
                    currentSum += nums[i];
                }
            }

            // Add (currentSum)^m to result using modular exponentiation
            result = (result + modPow(currentSum % MOD, m)) % MOD;
        }

        return (int) result;
    }

    // Helper function for modular exponentiation
    private long modPow(long base, int exponent) {
        long result = 1;
        base = base % MOD;

        while (exponent > 0) {
            // If exponent is odd, multiply base with result
            if ((exponent & 1) == 1) {
                result = (result * base) % MOD;
            }
            // exponent must be even now
            exponent >>= 1;
            base = (base * base) % MOD;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(2^n × n) where n is the length of nums. We iterate through all 2^n possible masks, and for each mask, we:

1. Count bits (O(n) in worst case, though some languages have O(1) bitCount)
2. Compute sum of selected nums (O(n))
   Since n ≤ 15, 2^15 = 32768, and 32768 × 15 ≈ 500,000 operations, which is efficient.

**Space Complexity**: O(1) excluding the input storage. We only use a few variables to store the mask, sum, and result.

## Common Mistakes

1. **Forgetting about modulo operations**: The result can be very large, so we need to apply modulo 10^9+7 after each operation, not just at the end. In the Java solution, we take `currentSum % MOD` before exponentiation to avoid overflow.

2. **Incorrect bit counting**: Some candidates manually count bits with a loop but forget that mask can be 0. Always handle the mask=0 case properly - if k=0, mask=0 is valid.

3. **Misunderstanding the sequence generation**: The biggest mistake is trying to generate all sequences explicitly. The key insight is recognizing that for a fixed set of indices S, the sum of products of all sequences using only indices from S (with repetition) is `(sum_{i∈S} nums[i])^m`.

4. **Overflow in intermediate calculations**: Even with modulo, intermediate calculations like `currentSum^m` can overflow before modulo is applied. Always use modular exponentiation.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmask enumeration**: When you need to consider all subsets of a small set (n ≤ 20), bitmask enumeration is often the solution. Related problems:
   - [Subsets](https://leetcode.com/problems/subsets/) - Generate all subsets of a set
   - [Maximum Product of Word Lengths](https://leetcode.com/problems/maximum-product-of-word-lengths/) - Use bitmask to represent letters in words

2. **Combinatorial sums with repetition**: The formula `(sum)^m` for the sum of products of all sequences comes from the multinomial theorem. Related problems:
   - [Count Sorted Vowel Strings](https://leetcode.com/problems/count-sorted-vowel-strings/) - Counting combinations with repetition
   - [Unique Paths](https://leetcode.com/problems/unique-paths/) - Another combinatorial counting problem

3. **Modular exponentiation**: When dealing with large exponents modulo a prime, always use fast modular exponentiation. Related problems:
   - [Super Pow](https://leetcode.com/problems/super-pow/) - Modular exponentiation with large exponents
   - [Pow(x, n)](https://leetcode.com/problems/powx-n/) - Fast exponentiation without modulo

## Key Takeaways

1. **When n is small (≤ 20), consider bitmask enumeration** as a way to iterate through all subsets. The constraint n ≤ 15 in this problem is a strong hint towards this approach.

2. **Look for mathematical simplifications** before implementing brute force. The transformation from "sum of products of all sequences" to `(sum)^m` is the key insight that makes the problem tractable.

3. **Always consider modular arithmetic** when the problem mentions large numbers or asks for result modulo some value. Use modular exponentiation for computing large powers efficiently.

Related problems: [Product of Array Except Self](/problem/product-of-array-except-self), [Smallest Number With All Set Bits](/problem/smallest-number-with-all-set-bits)
