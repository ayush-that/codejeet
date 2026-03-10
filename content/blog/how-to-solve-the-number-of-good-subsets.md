---
title: "How to Solve The Number of Good Subsets — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode The Number of Good Subsets. Hard difficulty, 37.1% acceptance rate. Topics: Array, Hash Table, Math, Dynamic Programming, Bit Manipulation."
date: "2026-04-30"
category: "dsa-patterns"
tags: ["the-number-of-good-subsets", "array", "hash-table", "math", "hard"]
---

# How to Solve "The Number of Good Subsets"

This problem asks us to count subsets of an array where the product of the subset can be expressed as a product of distinct prime numbers. The tricky part is that numbers can contain repeated prime factors (like 4 = 2×2), which makes them invalid for good subsets unless handled carefully. The problem becomes a combinatorial counting challenge with constraints on prime factorization.

## Visual Walkthrough

Let's trace through `nums = [1, 2, 3, 4]` to build intuition:

**Step 1: Understanding valid numbers**

- `1`: Special case - doesn't affect the product's prime factors
- `2`: Prime number (2) - valid
- `3`: Prime number (3) - valid
- `4`: 2×2 - contains duplicate prime factor 2 - invalid for good subsets

**Step 2: Building good subsets**
We can only use numbers with distinct prime factors:

- `[2]`: Product = 2 (prime) ✓
- `[3]`: Product = 3 (prime) ✓
- `[2, 3]`: Product = 6 = 2×3 (distinct primes) ✓
- `[1, 2]`: Product = 2 (prime) ✓ - 1 doesn't change prime factors
- `[1, 3]`: Product = 3 (prime) ✓
- `[1, 2, 3]`: Product = 6 = 2×3 ✓

**Step 3: The role of 1**
Notice that for every good subset without 1, we can also include 1 to create another valid subset. If there are `k` ones in the array, each good subset can be extended by including any subset of the ones, giving us `2^k` variations.

**Step 4: Representing prime factors as bits**
We can represent each number's prime factors as a bitmask:

- `2` (prime 2) → bit 1 (2¹)
- `3` (prime 3) → bit 2 (2²)
- `4` (2×2) → invalid (duplicate prime)
- `6` (2×3) → bits 1|2 = 3

This bitmask representation helps us track which primes we've used in a subset.

## Brute Force Approach

A naive approach would generate all `2^n` subsets, compute each product, factor it into primes, and check if all primes are distinct. For each subset:

1. Compute the product
2. Factor it into prime factors
3. Check if any prime repeats
4. Count valid subsets

The problem with this approach:

- `n` can be up to 10⁵, so `2^n` is impossibly large
- Factoring large products is computationally expensive
- We'd be doing redundant work checking similar subsets

Even with optimizations like pruning invalid numbers early, the exponential nature makes this infeasible.

## Optimized Approach

The key insight is that we only care about numbers ≤ 30. Why?

1. The product must be a product of distinct primes
2. The smallest primes are 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
3. The product of the first few primes grows quickly: 2×3×5×7 = 210 > 30
4. Any number > 30 that's valid for our problem must be prime itself

But there's a catch: numbers like 4, 8, 9, 12, etc., contain duplicate prime factors and are invalid. We only consider numbers that are:

- 1 (special case)
- Prime numbers ≤ 30
- Products of distinct primes ≤ 30 (like 6 = 2×3, 10 = 2×5, etc.)

**Step-by-step reasoning:**

1. **Precompute valid numbers**: Identify numbers 1-30 that are products of distinct primes
2. **Count frequencies**: Count how many times each number appears in `nums`
3. **Dynamic programming with bitmasks**:
   - Each state represents which primes we've used (bitmask)
   - dp[mask] = number of ways to achieve this prime combination
   - Process each valid number (except 1), adding it to existing combinations
4. **Handle 1 separately**: Each good subset can include any subset of the 1s

**Why bitmask DP works:**

- There are only 10 primes ≤ 30
- That's 2¹⁰ = 1024 possible states
- We process each valid number once, updating states
- This is essentially counting subsets with constraints on prime usage

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m * 2^p) where n = len(nums), m = valid numbers ≤ 30, p = primes ≤ 30
# Space: O(2^p) for DP array
class Solution:
    def numberOfGoodSubsets(self, nums: List[int]) -> int:
        MOD = 10**9 + 7
        primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

        # Step 1: Count frequency of each number 1-30
        freq = [0] * 31
        for num in nums:
            if num <= 30:  # Only care about numbers ≤ 30
                freq[num] += 1

        # Step 2: Precompute valid numbers and their prime masks
        # A number is valid if it's a product of distinct primes
        valid_masks = {}

        for num in range(2, 31):
            if freq[num] == 0:
                continue  # Skip numbers not in nums

            mask = 0
            temp = num
            valid = True

            # Compute prime factorization
            for i, prime in enumerate(primes):
                if temp % prime == 0:
                    temp //= prime
                    mask |= (1 << i)  # Set bit for this prime

                    # Check for duplicate prime factor
                    if temp % prime == 0:
                        valid = False
                        break

            # If number has prime factor > 29 or duplicate primes, skip
            if valid and temp == 1:
                valid_masks[num] = mask

        # Step 3: Dynamic Programming
        # dp[mask] = number of ways to achieve this combination of primes
        dp = [0] * (1 << len(primes))
        dp[0] = 1  # Empty subset

        # Process each valid number
        for num, mask in valid_masks.items():
            # For each existing state, try adding this number
            # Iterate backwards to avoid reusing the same number
            for state in range((1 << len(primes)) - 1, -1, -1):
                # If this number's primes don't overlap with state's primes
                if state & mask == 0:
                    # Add ways to create new state = ways to create old state * count of this number
                    dp[state | mask] = (dp[state | mask] + dp[state] * freq[num]) % MOD

        # Step 4: Calculate result
        # Sum all non-empty valid subsets (state != 0)
        result = 0
        for state in range(1, 1 << len(primes)):
            result = (result + dp[state]) % MOD

        # Step 5: Handle 1's
        # Each good subset can include any subset of the 1's
        # There are 2^(count of 1's) ways to choose 1's
        if freq[1] > 0:
            result = (result * pow(2, freq[1], MOD)) % MOD

        return result
```

```javascript
// Time: O(n + m * 2^p) where n = nums.length, m = valid numbers ≤ 30, p = primes ≤ 30
// Space: O(2^p) for DP array
var numberOfGoodSubsets = function (nums) {
  const MOD = 10 ** 9 + 7;
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

  // Step 1: Count frequency of each number 1-30
  const freq = new Array(31).fill(0);
  for (const num of nums) {
    if (num <= 30) {
      // Only care about numbers ≤ 30
      freq[num]++;
    }
  }

  // Step 2: Precompute valid numbers and their prime masks
  const validMasks = new Map();

  for (let num = 2; num <= 30; num++) {
    if (freq[num] === 0) continue; // Skip numbers not in nums

    let mask = 0;
    let temp = num;
    let valid = true;

    // Compute prime factorization
    for (let i = 0; i < primes.length; i++) {
      const prime = primes[i];
      if (temp % prime === 0) {
        temp /= prime;
        mask |= 1 << i; // Set bit for this prime

        // Check for duplicate prime factor
        if (temp % prime === 0) {
          valid = false;
          break;
        }
      }
    }

    // If number has prime factor > 29 or duplicate primes, skip
    if (valid && temp === 1) {
      validMasks.set(num, mask);
    }
  }

  // Step 3: Dynamic Programming
  // dp[mask] = number of ways to achieve this combination of primes
  const dp = new Array(1 << primes.length).fill(0);
  dp[0] = 1; // Empty subset

  // Process each valid number
  for (const [num, mask] of validMasks) {
    // For each existing state, try adding this number
    // Iterate backwards to avoid reusing the same number
    for (let state = (1 << primes.length) - 1; state >= 0; state--) {
      // If this number's primes don't overlap with state's primes
      if ((state & mask) === 0) {
        // Add ways to create new state = ways to create old state * count of this number
        dp[state | mask] = (dp[state | mask] + dp[state] * freq[num]) % MOD;
      }
    }
  }

  // Step 4: Calculate result
  // Sum all non-empty valid subsets (state != 0)
  let result = 0;
  for (let state = 1; state < 1 << primes.length; state++) {
    result = (result + dp[state]) % MOD;
  }

  // Step 5: Handle 1's
  // Each good subset can include any subset of the 1's
  // There are 2^(count of 1's) ways to choose 1's
  if (freq[1] > 0) {
    // Fast exponentiation for 2^freq[1] mod MOD
    let pow2 = 1;
    for (let i = 0; i < freq[1]; i++) {
      pow2 = (pow2 * 2) % MOD;
    }
    result = (result * pow2) % MOD;
  }

  return result;
};
```

```java
// Time: O(n + m * 2^p) where n = nums.length, m = valid numbers ≤ 30, p = primes ≤ 30
// Space: O(2^p) for DP array
class Solution {
    public int numberOfGoodSubsets(int[] nums) {
        final int MOD = 1000000007;
        int[] primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29};

        // Step 1: Count frequency of each number 1-30
        int[] freq = new int[31];
        for (int num : nums) {
            if (num <= 30) {  // Only care about numbers ≤ 30
                freq[num]++;
            }
        }

        // Step 2: Precompute valid numbers and their prime masks
        // A number is valid if it's a product of distinct primes
        int[] validMasks = new int[31];  // 0 means invalid

        for (int num = 2; num <= 30; num++) {
            if (freq[num] == 0) {
                continue;  // Skip numbers not in nums
            }

            int mask = 0;
            int temp = num;
            boolean valid = true;

            // Compute prime factorization
            for (int i = 0; i < primes.length; i++) {
                int prime = primes[i];
                if (temp % prime == 0) {
                    temp /= prime;
                    mask |= (1 << i);  // Set bit for this prime

                    // Check for duplicate prime factor
                    if (temp % prime == 0) {
                        valid = false;
                        break;
                    }
                }
            }

            // If number has prime factor > 29 or duplicate primes, skip
            if (valid && temp == 1) {
                validMasks[num] = mask;
            }
        }

        // Step 3: Dynamic Programming
        // dp[mask] = number of ways to achieve this combination of primes
        long[] dp = new long[1 << primes.length];
        dp[0] = 1;  // Empty subset

        // Process each valid number
        for (int num = 2; num <= 30; num++) {
            int mask = validMasks[num];
            if (mask == 0 || freq[num] == 0) {
                continue;  // Skip invalid numbers or numbers not in nums
            }

            // For each existing state, try adding this number
            // Iterate backwards to avoid reusing the same number
            for (int state = (1 << primes.length) - 1; state >= 0; state--) {
                // If this number's primes don't overlap with state's primes
                if ((state & mask) == 0) {
                    // Add ways to create new state = ways to create old state * count of this number
                    dp[state | mask] = (dp[state | mask] + dp[state] * freq[num]) % MOD;
                }
            }
        }

        // Step 4: Calculate result
        // Sum all non-empty valid subsets (state != 0)
        long result = 0;
        for (int state = 1; state < (1 << primes.length); state++) {
            result = (result + dp[state]) % MOD;
        }

        // Step 5: Handle 1's
        // Each good subset can include any subset of the 1's
        // There are 2^(count of 1's) ways to choose 1's
        if (freq[1] > 0) {
            // Fast exponentiation for 2^freq[1] mod MOD
            long pow2 = 1;
            for (int i = 0; i < freq[1]; i++) {
                pow2 = (pow2 * 2) % MOD;
            }
            result = (result * pow2) % MOD;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m × 2^p)

- `n`: Length of input array for counting frequencies
- `m`: Number of valid numbers ≤ 30 (at most 18)
- `p`: Number of primes ≤ 30 (10, so 2^p = 1024)

The dominant term is m × 2^p ≈ 18 × 1024 ≈ 18,000 operations, which is efficient.

**Space Complexity:** O(2^p)

- DP array of size 2^p = 1024
- Frequency array of size 31
- Total space is dominated by the DP array

## Common Mistakes

1. **Not handling 1 correctly**: Candidates often forget that 1 can be included in any subset without affecting the prime factors. Remember: if there are k ones, each valid subset can be extended in 2^k ways.

2. **Including numbers with duplicate prime factors**: Numbers like 4 (2×2), 8 (2×2×2), 9 (3×3), 12 (2×2×3) are invalid because they contain duplicate primes. Always check for duplicate prime factors during factorization.

3. **Wrong DP iteration order**: When updating DP states, you must iterate backwards through states. If you iterate forwards, you might reuse the same number multiple times in the same subset.

4. **Missing the MOD operation**: The result can be huge, so you need to apply modulo after each addition and multiplication. Forgetting this causes integer overflow.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmask DP for subset selection**: When you need to choose elements with constraints on which "types" you can select together. The bitmask tracks which types are already used.
   - Related: [Smallest Sufficient Team](/problem/smallest-sufficient-team) - bitmask DP for skill coverage
   - Related: [Number of Ways to Wear Different Hats to Each Other](/problem/number-of-ways-to-wear-different-hats-to-each-other) - assignment with constraints

2. **Prime factorization for constraints**: When the problem involves divisibility or prime factors as constraints.
   - Related: [Largest Component Size by Common Factor](/problem/largest-component-size-by-common-factor) - union-find with prime factors

3. **Counting subsets with product constraints**: When you need to count subsets where the product has certain properties.
   - Related: [Number of Subsequences That Satisfy the Given Sum Condition](/problem/number-of-subsequences-that-satisfy-the-given-sum-condition) - counting subsets with sum constraints

## Key Takeaways

1. **Bitmask DP is powerful for "choose with constraints" problems**: When you have up to ~20 types/attributes to track, bitmask DP (2^k states) is often the right approach.

2. **Look for bounds that simplify the problem**: The observation that we only need to consider numbers ≤ 30 is crucial. Always check if constraints allow simplification.

3. **Handle special cases separately**: The number 1 doesn't affect prime factors but multiplies the count. Isolating special cases makes the core logic cleaner.

4. **Prime factorization reveals structure**: When a problem involves products or divisibility, prime factorization often reveals constraints that can be represented as bitmasks or other discrete structures.

Related problems: [Smallest Sufficient Team](/problem/smallest-sufficient-team), [Fair Distribution of Cookies](/problem/fair-distribution-of-cookies), [Number of Ways to Wear Different Hats to Each Other](/problem/number-of-ways-to-wear-different-hats-to-each-other)
