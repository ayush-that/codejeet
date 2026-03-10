---
title: "How to Solve Smallest Good Base — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Smallest Good Base. Hard difficulty, 45.5% acceptance rate. Topics: Math, Binary Search."
date: "2029-04-22"
category: "dsa-patterns"
tags: ["smallest-good-base", "math", "binary-search", "hard"]
---

# How to Solve Smallest Good Base

This problem asks us to find the smallest integer `k ≥ 2` such that when we represent the given integer `n` in base `k`, all digits are `1`s. For example, if `n = 13`, then base `3` works because `13` in base `3` is `111` (since `1*3² + 1*3¹ + 1*3⁰ = 9 + 3 + 1 = 13`). The challenge is that `n` can be up to `10¹⁸`, making brute force impossible — we need mathematical insights combined with binary search.

## Visual Walkthrough

Let's trace through `n = 13` step by step:

1. **Understanding the problem**: We need to find the smallest `k ≥ 2` where `n` can be expressed as `1 + k + k² + ... + k^(m-1)` for some integer `m ≥ 2`.

2. **Testing possibilities**:
   - For `m = 2`: `n = 1 + k` → `k = n - 1 = 12`. Base 12 representation of 13 is `11` (all 1's ✓). But is this the smallest?
   - For `m = 3`: `n = 1 + k + k² = 13`. Solving `k² + k - 12 = 0` gives `k = 3` (positive solution). Base 3 representation is `111` (all 1's ✓).
   - For `m = 4`: `n = 1 + k + k² + k³ = 13`. The smallest possible with `k=2` is `1+2+4+8=15 > 13`, so no solution.

   The smallest good base is `3`, not `12`, because while both work, `3 < 12`.

3. **Key insight**: The number of digits `m` is limited! For a given `n`, the maximum possible `m` occurs when `k=2` (smallest base). Since `1 + 2 + 4 + ... + 2^(m-1) = 2^m - 1 ≤ n`, we get `m ≤ log₂(n+1) ≈ 60` for `n ≤ 10¹⁸`.

## Brute Force Approach

A naive approach would try every base `k` from `2` up to `n-1` (since for `m=2`, `k = n-1`):

1. For each `k`, convert `n` to base `k`
2. Check if all digits are `1`
3. Return the first (smallest) `k` that satisfies this

This is extremely inefficient — `O(n log n)` operations where `n` can be `10¹⁸`. Even checking up to `√n` isn't enough since the answer could be close to `n`.

**Why brute force fails**:

- Direct base conversion for each `k` is `O(logₖ n)`
- With `k` going up to `n-1`, we have `O(n log n)` total operations
- For `n = 10¹⁸`, this is computationally impossible

## Optimized Approach

The key insight is to **reverse our thinking**: Instead of searching for `k`, search for the number of digits `m`!

**Mathematical foundation**: If `n` has all 1's in base `k` with `m` digits, then:

```
n = 1 + k + k² + ... + k^(m-1) = (k^m - 1) / (k - 1)
```

**The optimization strategy**:

1. **Loop over possible digit lengths `m`**: From the maximum possible (≈60) down to 2
   - Why from large to small? Because for a given `n`, larger `m` means smaller `k`. Since we want the smallest `k`, checking larger `m` first makes sense.
2. **For each `m`, binary search for `k`**:
   - Lower bound: `k = 2`
   - Upper bound: From the inequality `k^(m-1) < n`, we get `k < n^(1/(m-1))`. We can use `n^(1/(m-1)) + 1` as upper bound.
3. **Check if `(k^m - 1)/(k - 1) = n`**:
   - Compute carefully to avoid overflow
   - Use the equivalent form: `1 + k + k² + ... + k^(m-1)`

**Why this works**:

- Number of `m` values is small (≤60)
- For each `m`, binary search takes `O(log n)` operations
- Total complexity is manageable: `O(60 * log n)`

## Optimal Solution

<div class="code-group">

```python
# Time: O(log²n) - We iterate over possible digit lengths (O(log n))
#       and for each do binary search (O(log n))
# Space: O(1) - Only constant extra space used
class Solution:
    def smallestGoodBase(self, n: str) -> str:
        # Convert string to integer
        n = int(n)

        # Maximum possible number of digits is when base is 2
        # n = 1 + 2 + 4 + ... + 2^(m-1) = 2^m - 1
        # So m_max = floor(log2(n)) + 1
        max_m = int(math.log2(n)) + 1

        # Try from largest m to smallest (larger m gives smaller k)
        for m in range(max_m, 1, -1):
            # Binary search for base k
            left, right = 2, int(n ** (1/(m-1))) + 1

            while left <= right:
                k = (left + right) // 2

                # Compute sum = 1 + k + k^2 + ... + k^(m-1)
                # Use Horner's method to avoid overflow
                sum_val = 1
                curr = 1
                for _ in range(1, m):
                    curr *= k
                    sum_val += curr
                    # Early exit if sum already exceeds n
                    if sum_val > n:
                        break

                if sum_val == n:
                    return str(k)
                elif sum_val < n:
                    left = k + 1
                else:
                    right = k - 1

        # If no other base found, return n-1 (for m=2 case)
        return str(n - 1)
```

```javascript
// Time: O(log²n) - We iterate over possible digit lengths (O(log n))
//       and for each do binary search (O(log n))
// Space: O(1) - Only constant extra space used
var smallestGoodBase = function (n) {
  // Convert string to BigInt for large numbers
  n = BigInt(n);

  // Maximum possible number of digits is when base is 2
  // n = 1 + 2 + 4 + ... + 2^(m-1) = 2^m - 1
  // So m_max = floor(log2(n)) + 1
  const maxM = Math.floor(Math.log2(Number(n))) + 1;

  // Try from largest m to smallest (larger m gives smaller k)
  for (let m = maxM; m >= 2; m--) {
    // Binary search for base k
    let left = 2n;
    // Upper bound: k^(m-1) < n => k < n^(1/(m-1))
    let right = BigInt(Math.pow(Number(n), 1 / (m - 1))) + 1n;

    while (left <= right) {
      const k = (left + right) / 2n;

      // Compute sum = 1 + k + k^2 + ... + k^(m-1)
      // Use geometric series formula: (k^m - 1)/(k - 1)
      let sum = 0n;
      let power = 1n;

      for (let i = 0; i < m; i++) {
        sum += power;
        power *= k;
        // Early exit if sum already exceeds n
        if (sum > n) break;
      }

      if (sum === n) {
        return k.toString();
      } else if (sum < n) {
        left = k + 1n;
      } else {
        right = k - 1n;
      }
    }
  }

  // If no other base found, return n-1 (for m=2 case)
  return (n - 1n).toString();
};
```

```java
// Time: O(log²n) - We iterate over possible digit lengths (O(log n))
//       and for each do binary search (O(log n))
// Space: O(1) - Only constant extra space used
class Solution {
    public String smallestGoodBase(String n) {
        long num = Long.parseLong(n);

        // Maximum possible number of digits is when base is 2
        // n = 1 + 2 + 4 + ... + 2^(m-1) = 2^m - 1
        // So m_max = floor(log2(n)) + 1
        int maxM = (int)(Math.log(num) / Math.log(2)) + 1;

        // Try from largest m to smallest (larger m gives smaller k)
        for (int m = maxM; m >= 2; m--) {
            // Binary search for base k
            long left = 2;
            // Upper bound: k^(m-1) < n => k < n^(1/(m-1))
            long right = (long)Math.pow(num, 1.0 / (m - 1)) + 1;

            while (left <= right) {
                long k = left + (right - left) / 2;

                // Compute sum = 1 + k + k^2 + ... + k^(m-1)
                // Use geometric series formula: (k^m - 1)/(k - 1)
                long sum = 0;
                long power = 1;

                for (int i = 0; i < m; i++) {
                    // Check for overflow
                    if (sum > num - power) {
                        sum = num + 1; // Make sum > num to break
                        break;
                    }
                    sum += power;
                    // Check for overflow in multiplication
                    if (i < m - 1 && power > num / k) {
                        power = num + 1; // Make power large to break
                    } else if (i < m - 1) {
                        power *= k;
                    }
                }

                if (sum == num) {
                    return Long.toString(k);
                } else if (sum < num) {
                    left = k + 1;
                } else {
                    right = k - 1;
                }
            }
        }

        // If no other base found, return n-1 (for m=2 case)
        return Long.toString(num - 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(log² n)`

- Outer loop runs over possible digit lengths `m`: `O(log n)` iterations (since `m ≤ log₂n`)
- For each `m`, we perform binary search: `O(log n)` iterations
- Each binary search iteration computes the sum in `O(m) = O(log n)` time
- Total: `O(log n × log n × log n) = O(log³ n)` in naive calculation, but careful analysis shows it's `O(log² n)` because the sum computation can exit early

**Space Complexity**: `O(1)`

- We only use a constant amount of extra space for variables
- No data structures that grow with input size

## Common Mistakes

1. **Overflow errors**: When computing `k^m` for large values, even 64-bit integers can overflow. Use early termination checks or switch to big integers.
   - **Fix**: Check `if (sum > n - term)` before adding, or use `BigInteger` in Java/JavaScript.

2. **Incorrect upper bound for binary search**: Using `n` as upper bound for `k` is too large and makes binary search inefficient.
   - **Fix**: Use `k < n^(1/(m-1))` to get a tight upper bound.

3. **Checking m in wrong order**: Starting from `m=2` and going up will find larger bases first, requiring checking all possibilities.
   - **Fix**: Start from largest `m` and go down — the first found base will be the smallest.

4. **Missing the m=2 case**: For prime numbers `n`, the only solution is often `k = n-1` (two digits: `11` in base `n-1`).
   - **Fix**: Always return `n-1` as fallback after all `m` values are checked.

## When You'll See This Pattern

This "mathematical insight + binary search" pattern appears in problems where:

1. Direct search is too expensive
2. The search space can be constrained mathematically
3. The function is monotonic, allowing binary search

**Related LeetCode problems**:

1. **Sqrt(x)** (Easy): Binary search for square root — similar monotonic property
2. **Divide Two Integers** (Medium): Using binary search to find quotient
3. **Kth Smallest Number in Multiplication Table** (Hard): Binary search on the answer space with a counting function

## Key Takeaways

1. **When brute force is impossible, look for mathematical constraints**: The key insight was that the number of digits `m` is limited to `log₂n`, reducing the search space dramatically.

2. **Binary search isn't just for arrays**: You can binary search on the answer space when you have a way to test whether a candidate is too high or too low.

3. **Work backwards from the property**: Instead of testing bases, we tested digit lengths because that gave us a much smaller search space with a monotonic relationship.

[Practice this problem on CodeJeet](/problem/smallest-good-base)
