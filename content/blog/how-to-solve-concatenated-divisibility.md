---
title: "How to Solve Concatenated Divisibility — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Concatenated Divisibility. Hard difficulty, 30.6% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2026-08-14"
category: "dsa-patterns"
tags: ["concatenated-divisibility", "array", "dynamic-programming", "bit-manipulation", "hard"]
---

# How to Solve Concatenated Divisibility

This problem asks us to count how many permutations of an array of positive integers, when concatenated into a single number, are divisible by a given integer `k`. The challenge lies in the exponential number of permutations (n! possibilities) and the potentially huge concatenated numbers that can exceed standard integer limits. We need a clever way to track divisibility without actually building massive strings or numbers.

## Visual Walkthrough

Let's trace through a small example: `nums = [12, 3]`, `k = 6`.

**Step 1: Understanding concatenation**

- Permutation 1: [12, 3] → "123" → 123
- Permutation 2: [3, 12] → "312" → 312

**Step 2: Checking divisibility**

- 123 ÷ 6 = 20.5 ❌ (not divisible)
- 312 ÷ 6 = 52 ✅ (divisible)

So for this input, the answer is 1.

**Key insight:** When we concatenate numbers, we're essentially shifting digits. For example:

- Concatenating 12 then 3: (12 × 10¹) + 3 = 120 + 3 = 123
- The exponent 1 comes from the number of digits in 3 (which is 1)

This gives us a mathematical way to think about concatenation without string operations.

## Brute Force Approach

The most straightforward solution would be:

1. Generate all permutations of the array
2. For each permutation, concatenate the numbers into a string
3. Convert the string to an integer (or use big integers)
4. Check if it's divisible by `k`
5. Count the valid permutations

**Why this fails:**

- Time complexity: O(n! × n) to generate permutations and concatenate them
- Space complexity: O(n!) to store permutations
- For n = 10, that's 3.6 million permutations
- The concatenated numbers can have up to 10 × 10 = 100 digits (for 10-digit numbers), which exceeds standard integer limits

Even with optimizations like checking divisibility digit-by-digit, the factorial time complexity makes this infeasible for n > 10.

## Optimized Approach

The key insight is to use **dynamic programming with bitmasking**:

1. **Mathematical representation of concatenation:**
   If we have a current number `curr` and we want to append a new number `num` with `d` digits:

   ```
   new_curr = (curr × 10^d) + num
   ```

   Taking modulo k:

   ```
   new_curr % k = ((curr % k) × (10^d % k) + (num % k)) % k
   ```

2. **State definition:**
   We need to track:
   - Which numbers we've used so far (bitmask)
   - The current remainder modulo k

   Let `dp[mask][rem]` = number of ways to achieve remainder `rem` using the numbers represented by `mask`

3. **Transition:**
   For each state `(mask, rem)`, try adding any unused number `nums[i]`:
   - Calculate new remainder using the formula above
   - Add to `dp[new_mask][new_rem]`

4. **Base case:**
   `dp[0][0] = 1` (empty sequence has remainder 0)

5. **Answer:**
   `dp[(1 << n) - 1][0]` (all numbers used, remainder 0)

This reduces the problem to O(2ⁿ × n × k) time, which is feasible for n ≤ 15.

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^n * n * k) | Space: O(2^n * k)
def countDivisiblePermutations(nums, k):
    n = len(nums)

    # Precompute: number of digits and value % k for each number
    digit_counts = []
    num_mods = []

    for num in nums:
        # Count digits by converting to string (faster than math.log10)
        digit_counts.append(len(str(num)))
        num_mods.append(num % k)

    # Precompute: 10^digit % k for all possible digit counts
    # Maximum digits in any number (for shifting calculation)
    max_digits = max(digit_counts)
    pow10_mod = [1] * (max_digits + 1)  # pow10_mod[d] = 10^d % k

    for d in range(1, max_digits + 1):
        pow10_mod[d] = (pow10_mod[d-1] * 10) % k

    # DP table: dp[mask][rem] = number of ways
    # mask is bitmask of used numbers (1 = used, 0 = available)
    dp = [[0] * k for _ in range(1 << n)]
    dp[0][0] = 1  # Base case: empty sequence

    # Iterate over all masks
    for mask in range(1 << n):
        # For each possible remainder in current mask
        for rem in range(k):
            if dp[mask][rem] == 0:
                continue  # Skip unreachable states

            # Try to add each unused number
            for i in range(n):
                if mask & (1 << i):  # Number already used
                    continue

                # Calculate new remainder when appending nums[i]
                # Formula: new_rem = (rem * 10^digits + nums[i]) % k
                new_rem = (rem * pow10_mod[digit_counts[i]] + num_mods[i]) % k
                new_mask = mask | (1 << i)

                dp[new_mask][new_rem] += dp[mask][rem]

    # Answer: all numbers used (mask = all 1s), remainder = 0
    return dp[(1 << n) - 1][0]
```

```javascript
// Time: O(2^n * n * k) | Space: O(2^n * k)
function countDivisiblePermutations(nums, k) {
  const n = nums.length;

  // Precompute digit counts and num % k
  const digitCounts = new Array(n);
  const numMods = new Array(n);

  for (let i = 0; i < n; i++) {
    digitCounts[i] = String(nums[i]).length;
    numMods[i] = nums[i] % k;
  }

  // Precompute 10^digit % k
  const maxDigits = Math.max(...digitCounts);
  const pow10Mod = new Array(maxDigits + 1);
  pow10Mod[0] = 1 % k;

  for (let d = 1; d <= maxDigits; d++) {
    pow10Mod[d] = (pow10Mod[d - 1] * 10) % k;
  }

  // DP table: dp[mask][rem]
  const dp = new Array(1 << n);
  for (let i = 0; i < 1 << n; i++) {
    dp[i] = new Array(k).fill(0);
  }
  dp[0][0] = 1; // Base case

  // Iterate over all masks
  for (let mask = 0; mask < 1 << n; mask++) {
    for (let rem = 0; rem < k; rem++) {
      if (dp[mask][rem] === 0) continue;

      // Try adding each unused number
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) continue; // Already used

        const newMask = mask | (1 << i);
        // Calculate new remainder
        const newRem = (rem * pow10Mod[digitCounts[i]] + numMods[i]) % k;

        dp[newMask][newRem] += dp[mask][rem];
      }
    }
  }

  // All numbers used, remainder 0
  return dp[(1 << n) - 1][0];
}
```

```java
// Time: O(2^n * n * k) | Space: O(2^n * k)
public int countDivisiblePermutations(int[] nums, int k) {
    int n = nums.length;

    // Precompute digit counts and nums[i] % k
    int[] digitCounts = new int[n];
    int[] numMods = new int[n];

    for (int i = 0; i < n; i++) {
        digitCounts[i] = String.valueOf(nums[i]).length();
        numMods[i] = nums[i] % k;
    }

    // Find maximum digits for pow10Mod array
    int maxDigits = 0;
    for (int count : digitCounts) {
        maxDigits = Math.max(maxDigits, count);
    }

    // Precompute 10^d % k for d = 0..maxDigits
    int[] pow10Mod = new int[maxDigits + 1];
    pow10Mod[0] = 1 % k;
    for (int d = 1; d <= maxDigits; d++) {
        pow10Mod[d] = (pow10Mod[d-1] * 10) % k;
    }

    // DP table: dp[mask][rem]
    int[][] dp = new int[1 << n][k];
    dp[0][0] = 1;  // Base case: empty sequence

    // Iterate over all masks
    for (int mask = 0; mask < (1 << n); mask++) {
        for (int rem = 0; rem < k; rem++) {
            if (dp[mask][rem] == 0) continue;

            // Try to append each unused number
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) continue;  // Already used

                int newMask = mask | (1 << i);
                // Calculate new remainder: (rem * 10^digits + num) % k
                int newRem = (rem * pow10Mod[digitCounts[i]] + numMods[i]) % k;

                dp[newMask][newRem] += dp[mask][rem];
            }
        }
    }

    // Answer: all numbers used, remainder 0
    return dp[(1 << n) - 1][0];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(2ⁿ × n × k)

- We have 2ⁿ possible masks (subsets of numbers)
- For each mask, we iterate through k possible remainders
- For each (mask, rem) state, we try adding each of n numbers
- The precomputation of digit counts and pow10Mod takes O(n + maxDigits) time

**Space Complexity:** O(2ⁿ × k)

- The DP table has 2ⁿ rows and k columns
- Additional O(n) space for precomputed arrays

**Why this is acceptable:**

- Constraints typically limit n ≤ 15, so 2ⁿ = 32,768
- k can be up to 100 or 1000 in many problems
- Total operations: ~32,768 × 15 × 100 = ~49 million, which is feasible

## Common Mistakes

1. **Not using modulo properties correctly:**
   - Mistake: Computing `(rem * 10^digits + num) % k` without taking mod at each step
   - Result: Integer overflow for large numbers
   - Fix: Use `((rem % k) * (10^digits % k) + (num % k)) % k`

2. **Forgetting to precompute digit counts:**
   - Mistake: Calculating `len(str(num))` inside the DP loop
   - Result: O(n²) string operations instead of O(n)
   - Fix: Precompute digit counts once at the beginning

3. **Incorrect base case:**
   - Mistake: Setting `dp[0][0] = 0` or forgetting it
   - Result: All counts will be 0
   - Fix: `dp[0][0] = 1` (empty sequence is valid with remainder 0)

4. **Not handling k = 1 edge case:**
   - Observation: When k = 1, all numbers are divisible by 1
   - Result: Should return n! (all permutations)
   - Fix: The formula works correctly since any remainder 0..0 works

## When You'll See This Pattern

This **DP with bitmask** pattern appears in permutation/counting problems where:

1. Order matters (permutations, not combinations)
2. The state depends on which elements have been used
3. There's an additional constraint (like divisibility, sum, etc.)

**Related LeetCode problems:**

1. **#526 Beautiful Arrangement** - Count permutations where position divides number or vice versa
2. **#698 Partition to K Equal Sum Subsets** - Bitmask DP to track which numbers are used
3. **#847 Shortest Path Visiting All Nodes** - Bitmask to track visited nodes in graph traversal
4. **#1349 Maximum Students Taking Exam** - Bitmask DP with constraints between rows

## Key Takeaways

1. **Bitmask DP is powerful for permutation problems:** When you need to track which elements have been used from a small set (n ≤ 20), bitmask DP with O(2ⁿ) states is often the solution.

2. **Modular arithmetic avoids big numbers:** Instead of working with huge concatenated numbers, use modulo properties to work with manageable remainders.

3. **Precomputation is key:** Calculate digit counts, powers of 10 modulo k, and number mod k once at the beginning to avoid repeated expensive operations in the DP loop.

[Practice this problem on CodeJeet](/problem/concatenated-divisibility)
