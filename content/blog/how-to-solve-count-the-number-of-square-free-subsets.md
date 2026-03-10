---
title: "How to Solve Count the Number of Square-Free Subsets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Number of Square-Free Subsets. Medium difficulty, 26.4% acceptance rate. Topics: Array, Math, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2026-02-26"
category: "dsa-patterns"
tags: ["count-the-number-of-square-free-subsets", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Count the Number of Square-Free Subsets

You're given an array of positive integers and need to count how many subsets have a product that's square-free — meaning no perfect square (other than 1) divides it. The challenge is that checking every subset directly would be impossibly slow (2^n possibilities), and we need to handle numbers up to 30 with their prime factorizations.

What makes this interesting: It's a **dynamic programming with bitmask** problem disguised as a math problem. Each number's prime factors can be represented as a bitmask, and we need to count subsets where no prime appears more than once in the product.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 3, 4]`

**Step 1: Understanding square-free numbers**

- 2 = 2 (square-free)
- 3 = 3 (square-free)
- 4 = 2² (NOT square-free — contains a squared prime)

**Step 2: Check each subset**

1. Empty subset {}: product = 1 (square-free) ✓
2. {2}: product = 2 (square-free) ✓
3. {3}: product = 3 (square-free) ✓
4. {4}: product = 4 = 2² (NOT square-free) ✗
5. {2, 3}: product = 6 (square-free) ✓
6. {2, 4}: product = 8 = 2³ (NOT square-free — has 2² as factor) ✗
7. {3, 4}: product = 12 = 2²×3 (NOT square-free) ✗
8. {2, 3, 4}: product = 24 = 2³×3 (NOT square-free) ✗

Valid subsets: {}, {2}, {3}, {2,3} → **4 subsets**

**Step 3: The bitmask approach**
Primes ≤ 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 (10 primes)

Number 2 → mask: 0000000001 (prime 2 at position 0)
Number 3 → mask: 0000000010 (prime 3 at position 1)
Number 4 = 2² → invalid (has squared prime)

We track DP[mask] = number of ways to get this prime combination:

- Start: DP[0] = 1 (empty subset)
- Add 2: DP[1] += DP[0] → DP[1] = 1
- Add 3: DP[3] += DP[0] → DP[3] = 1 (mask 1 | 2 = 3)
- Also: DP[3] += DP[1] → DP[3] = 2 ({3} and {2,3})

Total = sum(DP) - 1 (exclude empty) = 4 - 1 = 3? Wait, we need to include empty!

Actually: Total valid subsets = sum(DP) = 4 (includes empty subset)

## Brute Force Approach

The brute force checks all 2^n subsets:

1. Generate every subset (using bitmask or recursion)
2. For each subset, compute the product
3. Check if product is square-free by:
   - Finding all prime factors
   - Ensuring no prime appears ≥ 2 times

**Why this fails:**

- n can be up to 1000 → 2^1000 subsets is astronomical
- Even for n=30, 2^30 ≈ 1 billion operations is too slow
- Product can be huge (30^1000) causing overflow

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
# Time: O(2^n * sqrt(product)) - impossibly slow
# Space: O(n) for recursion

def is_square_free(num):
    """Check if a number is square-free"""
    if num == 1:
        return True

    # Check divisibility by squares of primes
    for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]:
        if p * p > num:
            break
        if num % (p * p) == 0:
            return False
    return True

def count_square_free_subsets_brute(nums):
    n = len(nums)
    count = 0

    # Try all subsets using bitmask
    for mask in range(1 << n):
        product = 1
        for i in range(n):
            if mask & (1 << i):
                product *= nums[i]

        if is_square_free(product):
            count += 1

    return count
```

```javascript
// BRUTE FORCE - TOO SLOW
// Time: O(2^n * sqrt(product))
// Space: O(n)

function isSquareFree(num) {
  if (num === 1) return true;

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  for (const p of primes) {
    if (p * p > num) break;
    if (num % (p * p) === 0) return false;
  }
  return true;
}

function countSquareFreeSubsetsBrute(nums) {
  const n = nums.length;
  let count = 0;

  // Generate all subsets
  for (let mask = 0; mask < 1 << n; mask++) {
    let product = 1;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        product *= nums[i];
      }
    }

    if (isSquareFree(product)) {
      count++;
    }
  }

  return count;
}
```

```java
// BRUTE FORCE - TOO SLOW
// Time: O(2^n * sqrt(product))
// Space: O(n)

public boolean isSquareFree(int num) {
    if (num == 1) return true;

    int[] primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29};
    for (int p : primes) {
        if (p * p > num) break;
        if (num % (p * p) == 0) return false;
    }
    return true;
}

public int countSquareFreeSubsetsBrute(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Try all subsets
    for (int mask = 0; mask < (1 << n); mask++) {
        long product = 1; // Use long to avoid overflow
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                product *= nums[i];
            }
        }

        if (isSquareFree((int)product)) {
            count++;
        }
    }

    return count;
}
```

</div>

## Optimized Approach

**Key Insight 1:** Numbers > 30 with repeated primes
Since nums[i] ≤ 30, we only have 10 primes to worry about: 2,3,5,7,11,13,17,19,23,29. Any number with a squared prime factor (like 4=2², 9=3², 25=5²) can't be in ANY valid subset except alone? Actually, they can't be in ANY valid subset at all!

**Key Insight 2:** Bitmask representation
Each number can be represented as a bitmask of its prime factors:

- 6 = 2×3 → mask: 0000000011 (bits 0 and 1 set)
- 15 = 3×5 → mask: 0000000110 (bits 1 and 2 set)

**Key Insight 3:** Subset product = OR of masks
If we multiply numbers, their prime factors combine. In bitmask terms: product mask = mask1 | mask2 | ...

**Key Insight 4:** Valid subset = no overlapping bits
A subset is valid if no prime appears twice → all masks in the subset must have disjoint bits (mask1 & mask2 == 0).

**Key Insight 5:** Dynamic programming
DP[mask] = number of ways to achieve this prime combination.
For each number with valid mask m:

- If m == 0: special case (number is 1)
- Otherwise: update DP from high to low to avoid double counting

**Why this works:**

- We only have 2^10 = 1024 possible masks (manageable)
- Each number processed once: O(n × 1024)
- Handles n up to 1000 efficiently

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution: DP with Bitmask
# Time: O(n * 2^p) where p = 10 primes ≤ 30
# Space: O(2^p) for DP array

class Solution:
    def squareFreeSubsets(self, nums):
        # Primes up to 30
        primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

        # Precompute mask for numbers 1-30
        # mask[i] = bitmask of primes dividing i, or -1 if invalid (has squared prime)
        mask = [0] * 31
        invalid = [False] * 31

        for i in range(2, 31):
            num = i
            m = 0
            # Check each prime
            for j, p in enumerate(primes):
                if num % p == 0:
                    num //= p
                    m |= (1 << j)  # Set j-th bit
                    if num % p == 0:  # Prime appears twice
                        invalid[i] = True
                        break

        # Count frequency of each number
        freq = [0] * 31
        for num in nums:
            freq[num] += 1

        # DP array: dp[mask] = number of ways
        MOD = 10**9 + 7
        dp = [0] * (1 << 10)
        dp[0] = 1  # Empty subset

        # Special handling for number 1
        # 1 has no prime factors, so it can be included any number of times
        # For each 1, we can either include it or not: 2^freq[1] possibilities
        if freq[1] > 0:
            dp[0] = pow(2, freq[1], MOD)

        # Process numbers 2 to 30
        for num in range(2, 31):
            if freq[num] == 0 or invalid[num]:
                continue

            m = mask[num]
            # Update DP in reverse to avoid double counting
            for state in range((1 << 10) - 1, -1, -1):
                # If masks don't overlap, we can add this number
                if (state & m) == 0:
                    # We can add this number 0 to freq[num] times
                    # But actually, we can either include it or not for each occurrence
                    # So we multiply by (freq[num] + 1) for the new state
                    new_state = state | m
                    dp[new_state] = (dp[new_state] + dp[state] * freq[num]) % MOD

        # Sum all non-empty subsets
        total = 0
        for i in range(1, 1 << 10):
            total = (total + dp[i]) % MOD

        # Also include subsets with only 1's (already counted in dp[0] but we exclude empty)
        # Actually dp[0] includes empty subset + all-1 subsets
        # So total valid = sum(dp) - 1 (exclude empty subset)
        total = (total + dp[0] - 1) % MOD

        return total
```

```javascript
// Optimal Solution: DP with Bitmask
// Time: O(n * 2^p) where p = 10 primes ≤ 30
// Space: O(2^p) for DP array

var squareFreeSubsets = function (nums) {
  // Primes up to 30
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  const MOD = 1e9 + 7;

  // Precompute masks and invalid flags
  const mask = new Array(31).fill(0);
  const invalid = new Array(31).fill(false);

  for (let i = 2; i <= 30; i++) {
    let num = i;
    let m = 0;
    for (let j = 0; j < primes.length; j++) {
      const p = primes[j];
      if (num % p === 0) {
        num /= p;
        m |= 1 << j;
        if (num % p === 0) {
          invalid[i] = true;
          break;
        }
      }
    }
    mask[i] = m;
  }

  // Count frequencies
  const freq = new Array(31).fill(0);
  for (const num of nums) {
    freq[num]++;
  }

  // DP array
  const dp = new Array(1 << 10).fill(0);
  dp[0] = 1;

  // Handle number 1 separately (2^freq[1] possibilities)
  if (freq[1] > 0) {
    let ways = 1;
    for (let i = 0; i < freq[1]; i++) {
      ways = (ways * 2) % MOD;
    }
    dp[0] = ways;
  }

  // Process numbers 2 to 30
  for (let num = 2; num <= 30; num++) {
    if (freq[num] === 0 || invalid[num]) {
      continue;
    }

    const m = mask[num];
    // Update in reverse to avoid reusing same number
    for (let state = (1 << 10) - 1; state >= 0; state--) {
      if ((state & m) === 0) {
        const newState = state | m;
        // For each occurrence, we can either include or not
        // So multiply by frequency
        dp[newState] = (dp[newState] + dp[state] * freq[num]) % MOD;
      }
    }
  }

  // Sum all subsets except empty
  let total = 0;
  for (let i = 1; i < 1 << 10; i++) {
    total = (total + dp[i]) % MOD;
  }

  // Add subsets with only 1's (minus empty)
  total = (total + dp[0] - 1) % MOD;
  if (total < 0) total += MOD; // Handle negative modulo

  return total;
};
```

```java
// Optimal Solution: DP with Bitmask
// Time: O(n * 2^p) where p = 10 primes ≤ 30
// Space: O(2^p) for DP array

class Solution {
    public int squareFreeSubsets(int[] nums) {
        // Primes up to 30
        int[] primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29};
        final int MOD = 1000000007;

        // Precompute masks and invalid flags
        int[] mask = new int[31];
        boolean[] invalid = new boolean[31];

        for (int i = 2; i <= 30; i++) {
            int num = i;
            int m = 0;
            for (int j = 0; j < primes.length; j++) {
                int p = primes[j];
                if (num % p == 0) {
                    num /= p;
                    m |= (1 << j);
                    if (num % p == 0) {
                        invalid[i] = true;
                        break;
                    }
                }
            }
            mask[i] = m;
        }

        // Count frequencies
        int[] freq = new int[31];
        for (int num : nums) {
            freq[num]++;
        }

        // DP array
        long[] dp = new long[1 << 10];
        dp[0] = 1;

        // Handle number 1 separately
        if (freq[1] > 0) {
            long ways = 1;
            for (int i = 0; i < freq[1]; i++) {
                ways = (ways * 2) % MOD;
            }
            dp[0] = ways;
        }

        // Process numbers 2 to 30
        for (int num = 2; num <= 30; num++) {
            if (freq[num] == 0 || invalid[num]) {
                continue;
            }

            int m = mask[num];
            // Update in reverse order
            for (int state = (1 << 10) - 1; state >= 0; state--) {
                if ((state & m) == 0) {
                    int newState = state | m;
                    dp[newState] = (dp[newState] + dp[state] * freq[num]) % MOD;
                }
            }
        }

        // Sum all non-empty subsets
        long total = 0;
        for (int i = 1; i < (1 << 10); i++) {
            total = (total + dp[i]) % MOD;
        }

        // Add subsets with only 1's (minus empty subset)
        total = (total + dp[0] - 1) % MOD;
        if (total < 0) total += MOD;

        return (int)total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + 30 × 2^p)

- n for counting frequencies
- 30 numbers × 1024 states = 30,720 operations
- p = 10 primes ≤ 30, so 2^p = 1024
- Overall: O(n + 30,720) which is efficient for n ≤ 1000

**Space Complexity:** O(2^p)

- DP array of size 1024
- Additional O(30) for masks and frequencies
- Total: O(1024) constant space

## Common Mistakes

1. **Forgetting to handle number 1 specially**: 1 has no prime factors, so any number of 1's can be included. The number of ways to include k ones is 2^k (each can be in or out).

2. **Not checking for numbers with squared primes**: Numbers like 4, 9, 12, 18, 20, 25, 28 have a prime factor appearing twice (e.g., 4=2²). These can't be in ANY valid subset and must be filtered out.

3. **Updating DP in wrong order**: When processing numbers, we must update DP from high states to low states. If we go low to high, we might use the same number multiple times in one subset.

4. **Modulo arithmetic errors**: Forgetting to apply modulo after multiplication or addition, especially when dealing with large frequencies. Always apply modulo after each operation.

## When You'll See This Pattern

This "DP with bitmask" pattern appears when:

1. You have a small set of "features" or "constraints" (here: 10 primes)
2. Each element contributes some combination of these features
3. You need to count combinations where features don't conflict

**Related problems:**

1. **Partition to K Equal Sum Subsets (LC 698)** - Uses bitmask DP to track which elements are used
2. **Maximum Product of the Length of Two Palindromic Subsequences (LC 2002)** - Bitmask to represent character frequencies
3. **Smallest Sufficient Team (LC 1125)** - Bitmask DP for skill coverage

## Key Takeaways

1. **When numbers are bounded (≤ 30), think about prime factorization and bitmask representation**. Small primes mean small state space.

2. **DP with bitmask is perfect for "no overlap" constraints**. If each element adds some "features" and features can't repeat, use bitmask to track used features.

3. **Always handle special cases early**: Number 1, numbers with squared primes, and the empty subset need careful handling in counting problems.

Related problems: [Distinct Prime Factors of Product of Array](/problem/distinct-prime-factors-of-product-of-array)
