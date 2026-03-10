---
title: "How to Solve Four Divisors — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Four Divisors. Medium difficulty, 56.6% acceptance rate. Topics: Array, Math."
date: "2026-02-14"
category: "dsa-patterns"
tags: ["four-divisors", "array", "math", "medium"]
---

# How to Solve Four Divisors

This problem asks us to find the sum of divisors for numbers in an array that have exactly four divisors. The challenge lies in efficiently determining whether a number has exactly four divisors and calculating their sum without checking every possible divisor, which would be too slow for large numbers.

## Visual Walkthrough

Let's walk through an example: `nums = [21, 4, 7]`

**For 21:**

- Divisors: 1, 3, 7, 21 → 4 divisors
- Sum of divisors: 1 + 3 + 7 + 21 = 32

**For 4:**

- Divisors: 1, 2, 4 → 3 divisors (not 4)
- Skip this number

**For 7:**

- Divisors: 1, 7 → 2 divisors (not 4)
- Skip this number

**Result:** 32

The key insight is that numbers with exactly four divisors have a specific mathematical property: they're either:

1. The cube of a prime (p³) → divisors: 1, p, p², p³
2. The product of two distinct primes (p × q) → divisors: 1, p, q, p×q

## Brute Force Approach

The most straightforward approach is to check every number in the array and find all its divisors by iterating from 1 to the number itself:

1. For each number `n` in `nums`
2. Initialize a list to store divisors
3. Loop from 1 to `n`:
   - If `i` divides `n` evenly, add it to the list
4. If the list has exactly 4 elements, add their sum to the result

**Why this is too slow:**

- For each number `n`, we check up to `n` possible divisors
- If `n` is up to 10⁵ and we have many numbers, this becomes O(n²) in the worst case
- The problem constraints require a more efficient approach

## Optimized Approach

The key optimization is to stop early when we find more than 4 divisors, and to only check divisors up to √n:

1. For each number `n`:
   - Initialize `divisors` list with 1 and `n` (every number has these)
   - Loop `i` from 2 to √n:
     - If `i` divides `n`:
       - Add `i` to divisors
       - If `i ≠ n/i`, add `n/i` to divisors (the complementary divisor)
     - If we have more than 4 divisors, break early
   - If we have exactly 4 divisors, add their sum to result

**Why this works:**

- Divisors come in pairs (d, n/d)
- We only need to check up to √n to find all divisor pairs
- We can stop early if we exceed 4 divisors
- This reduces time complexity from O(n) to O(√n) per number

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * √m) where n = len(nums), m = max(nums)
# Space: O(1) excluding output
def sumFourDivisors(nums):
    """
    Calculate sum of divisors for numbers with exactly four divisors.

    Approach:
    1. For each number, find all divisors by checking up to √n
    2. Stop early if we find more than 4 divisors
    3. If exactly 4 divisors found, add their sum to result
    """
    total_sum = 0

    for num in nums:
        divisors = []

        # Every number has 1 and itself as divisors
        divisors.append(1)
        if num != 1:  # Avoid adding num twice when num = 1
            divisors.append(num)

        # Check divisors from 2 to √num
        for i in range(2, int(num**0.5) + 1):
            # If we already have more than 4 divisors, break early
            if len(divisors) > 4:
                break

            if num % i == 0:
                divisors.append(i)
                # Add the complementary divisor if it's different
                if i != num // i:
                    divisors.append(num // i)

        # Check if we have exactly 4 divisors
        if len(divisors) == 4:
            total_sum += sum(divisors)

    return total_sum
```

```javascript
// Time: O(n * √m) where n = nums.length, m = max(nums)
// Space: O(1) excluding output
function sumFourDivisors(nums) {
  /**
   * Calculate sum of divisors for numbers with exactly four divisors.
   *
   * Approach:
   * 1. For each number, find all divisors by checking up to √n
   * 2. Stop early if we find more than 4 divisors
   * 3. If exactly 4 divisors found, add their sum to result
   */
  let totalSum = 0;

  for (let num of nums) {
    const divisors = [];

    // Every number has 1 and itself as divisors
    divisors.push(1);
    if (num !== 1) {
      // Avoid adding num twice when num = 1
      divisors.push(num);
    }

    // Check divisors from 2 to √num
    for (let i = 2; i * i <= num; i++) {
      // If we already have more than 4 divisors, break early
      if (divisors.length > 4) {
        break;
      }

      if (num % i === 0) {
        divisors.push(i);
        // Add the complementary divisor if it's different
        if (i !== num / i) {
          divisors.push(num / i);
        }
      }
    }

    // Check if we have exactly 4 divisors
    if (divisors.length === 4) {
      totalSum += divisors.reduce((sum, val) => sum + val, 0);
    }
  }

  return totalSum;
}
```

```java
// Time: O(n * √m) where n = nums.length, m = max(nums)
// Space: O(1) excluding output
class Solution {
    public int sumFourDivisors(int[] nums) {
        /**
         * Calculate sum of divisors for numbers with exactly four divisors.
         *
         * Approach:
         * 1. For each number, find all divisors by checking up to √n
         * 2. Stop early if we find more than 4 divisors
         * 3. If exactly 4 divisors found, add their sum to result
         */
        int totalSum = 0;

        for (int num : nums) {
            List<Integer> divisors = new ArrayList<>();

            // Every number has 1 and itself as divisors
            divisors.add(1);
            if (num != 1) {  // Avoid adding num twice when num = 1
                divisors.add(num);
            }

            // Check divisors from 2 to √num
            for (int i = 2; i * i <= num; i++) {
                // If we already have more than 4 divisors, break early
                if (divisors.size() > 4) {
                    break;
                }

                if (num % i == 0) {
                    divisors.add(i);
                    // Add the complementary divisor if it's different
                    if (i != num / i) {
                        divisors.add(num / i);
                    }
                }
            }

            // Check if we have exactly 4 divisors
            if (divisors.size() == 4) {
                for (int divisor : divisors) {
                    totalSum += divisor;
                }
            }
        }

        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × √m)

- `n` is the length of the input array
- `m` is the maximum value in the array
- For each number, we check divisors up to √num
- In the worst case, we process all numbers up to their square roots

**Space Complexity:** O(1) excluding output

- We only store a small list of divisors (at most 5 elements) for the current number
- The total sum is a single integer
- No additional data structures scale with input size

## Common Mistakes

1. **Not handling perfect squares correctly**: When `i = √n`, we get `i = n/i`. Adding both would create a duplicate divisor. Always check if `i != n/i` before adding the complementary divisor.

2. **Forgetting the early break condition**: Without breaking early when we exceed 4 divisors, we waste time finding all divisors for numbers with many divisors (like 60 which has 12 divisors).

3. **Incorrect loop bounds**: Using `i <= num/2` instead of `i <= √num` makes the solution O(n²) instead of O(n√n). The square root optimization is crucial.

4. **Missing the number 1 edge case**: The number 1 only has one divisor (itself), but our algorithm would add it twice if we don't check `if num != 1`.

## When You'll See This Pattern

This divisor counting pattern appears in several math-related problems:

1. **Count Primes (LeetCode 204)**: Uses similar optimization of checking up to √n to determine if a number is prime.

2. **Perfect Squares (LeetCode 279)**: Involves mathematical properties of numbers and their factors.

3. **Ugly Number (LeetCode 263)**: Checks divisibility by specific prime factors, similar to how we check for divisors here.

The core technique of checking divisors up to the square root and handling divisor pairs is fundamental to many number theory problems.

## Key Takeaways

1. **Divisors come in pairs**: For every divisor `d` of `n`, there's a complementary divisor `n/d`. This allows us to only check up to √n.

2. **Early termination is powerful**: When you know you've already found enough (or too many) of something, stop searching. This applies to many search and counting problems.

3. **Mathematical properties matter**: Recognizing that numbers with exactly 4 divisors are either p³ or p×q (distinct primes) could lead to an even more optimized solution using prime factorization.

[Practice this problem on CodeJeet](/problem/four-divisors)
