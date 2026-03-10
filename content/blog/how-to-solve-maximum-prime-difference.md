---
title: "How to Solve Maximum Prime Difference — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Prime Difference. Medium difficulty, 58.6% acceptance rate. Topics: Array, Math, Number Theory."
date: "2028-07-31"
category: "dsa-patterns"
tags: ["maximum-prime-difference", "array", "math", "number-theory", "medium"]
---

# How to Solve Maximum Prime Difference

This problem asks us to find the maximum distance between indices where prime numbers appear in an array. While the concept is straightforward, it combines array traversal with prime number checking, requiring careful handling of edge cases and efficient prime detection. The tricky part is recognizing that we only need to find the first and last prime numbers in the array—not all pairs of primes.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 2, 9, 5, 3]`

**Step 1: Identify prime numbers**

- Index 0: 4 → not prime (divisible by 2)
- Index 1: 2 → prime (only divisible by 1 and 2)
- Index 2: 9 → not prime (divisible by 3)
- Index 3: 5 → prime (only divisible by 1 and 5)
- Index 4: 3 → prime (only divisible by 1 and 3)

**Step 2: Track first and last prime indices**

- First prime at index 1 (value 2)
- Last prime at index 4 (value 3)

**Step 3: Calculate maximum distance**

- Distance = last index - first index = 4 - 1 = 3

The key insight: we don't need to compare every pair of prime indices. The maximum distance will always be between the first and last prime in the array (or 0 if there's only one prime or none).

## Brute Force Approach

A naive approach would be:

1. Find all indices where prime numbers occur
2. Compare every pair of indices to find the maximum difference

This approach has O(n²) time complexity where n is the number of primes found, which could be O(n²) in the worst case if all numbers are prime. The space complexity would be O(n) to store all prime indices.

While this would technically work, it's inefficient because we're doing unnecessary comparisons. Once we recognize that the maximum distance must involve the smallest and largest indices, we can optimize significantly.

## Optimized Approach

The optimal solution relies on two key insights:

1. **We only need the first and last prime indices**: The maximum distance between any two indices i and j (where i ≤ j) is maximized when i is as small as possible and j is as large as possible. Therefore, we just need to find the smallest index containing a prime and the largest index containing a prime.

2. **Efficient prime checking**: We need an O(√n) prime checking function that handles edge cases properly (1 is not prime, 2 is prime, negative numbers are not prime).

The algorithm:

- Initialize `firstPrimeIndex = -1` and `lastPrimeIndex = -1`
- Traverse the array from left to right
- For each number, check if it's prime
- If prime and `firstPrimeIndex == -1`, set it as first prime index
- Always update `lastPrimeIndex` when we find a prime
- Return `lastPrimeIndex - firstPrimeIndex` (or 0 if no primes found)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * √m) where n = len(nums), m = max(nums)
# Space: O(1)
def maximumPrimeDifference(nums):
    """
    Find the maximum distance between indices of prime numbers in nums.

    Args:
        nums: List of integers

    Returns:
        Maximum distance between first and last prime indices, or 0 if < 2 primes
    """

    def is_prime(num):
        """
        Check if a number is prime.

        Args:
            num: Integer to check

        Returns:
            True if prime, False otherwise
        """
        # Edge cases: numbers less than 2 are not prime
        if num < 2:
            return False

        # Check divisibility from 2 to sqrt(num)
        # We only need to check up to sqrt(num) because if num has a factor
        # greater than sqrt(num), it must have a corresponding factor less than sqrt(num)
        for i in range(2, int(num ** 0.5) + 1):
            if num % i == 0:
                return False
        return True

    first_idx = -1  # Track first prime index
    last_idx = -1   # Track last prime index

    # Iterate through array with index
    for i, num in enumerate(nums):
        if is_prime(num):
            # If this is the first prime we've found, record its index
            if first_idx == -1:
                first_idx = i
            # Always update last_idx when we find a prime
            last_idx = i

    # If no primes found or only one prime, return 0
    # Otherwise return distance between first and last prime
    if first_idx == -1 or last_idx == -1:
        return 0
    return last_idx - first_idx
```

```javascript
// Time: O(n * √m) where n = nums.length, m = max(nums)
// Space: O(1)
function maximumPrimeDifference(nums) {
  /**
   * Check if a number is prime.
   *
   * @param {number} num - Number to check
   * @returns {boolean} True if prime, false otherwise
   */
  function isPrime(num) {
    // Numbers less than 2 are not prime
    if (num < 2) {
      return false;
    }

    // Check divisibility from 2 to sqrt(num)
    // We use Math.floor to handle integer division correctly
    for (let i = 2; i <= Math.floor(Math.sqrt(num)); i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  }

  let firstIdx = -1; // Track first prime index
  let lastIdx = -1; // Track last prime index

  // Iterate through array
  for (let i = 0; i < nums.length; i++) {
    if (isPrime(nums[i])) {
      // If this is the first prime, record its index
      if (firstIdx === -1) {
        firstIdx = i;
      }
      // Always update last index when we find a prime
      lastIdx = i;
    }
  }

  // Handle cases with no primes or only one prime
  if (firstIdx === -1 || lastIdx === -1) {
    return 0;
  }

  // Return distance between first and last prime
  return lastIdx - firstIdx;
}
```

```java
// Time: O(n * √m) where n = nums.length, m = max(nums)
// Space: O(1)
class Solution {
    public int maximumPrimeDifference(int[] nums) {
        int firstIdx = -1;  // Track first prime index
        int lastIdx = -1;   // Track last prime index

        // Iterate through the array
        for (int i = 0; i < nums.length; i++) {
            if (isPrime(nums[i])) {
                // If this is the first prime, record its index
                if (firstIdx == -1) {
                    firstIdx = i;
                }
                // Always update last index when we find a prime
                lastIdx = i;
            }
        }

        // Handle cases with no primes or only one prime
        if (firstIdx == -1 || lastIdx == -1) {
            return 0;
        }

        // Return distance between first and last prime
        return lastIdx - firstIdx;
    }

    /**
     * Check if a number is prime.
     *
     * @param num Number to check
     * @return True if prime, false otherwise
     */
    private boolean isPrime(int num) {
        // Numbers less than 2 are not prime
        if (num < 2) {
            return false;
        }

        // Check divisibility from 2 to sqrt(num)
        // We only need to check up to sqrt(num) because if num has a factor
        // greater than sqrt(num), it must have a corresponding factor less than sqrt(num)
        for (int i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0) {
                return false;
            }
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × √m)

- `n` is the length of the input array
- `m` is the maximum value in the array
- For each of the `n` elements, we perform prime checking which takes O(√m) time in the worst case
- In practice, since we're only checking up to √m, this is efficient for typical constraints

**Space Complexity:** O(1)

- We only use a constant amount of extra space for tracking indices
- The prime checking function uses O(1) space (no additional data structures)

## Common Mistakes

1. **Incorrect prime checking for 1 and 2**: Many candidates forget that 1 is not prime and 2 is prime. Always handle these base cases explicitly.

2. **Inefficient prime checking**: Checking divisibility up to `num-1` instead of √num gives O(n) instead of O(√n) per check. Remember the mathematical property: if a number has a divisor greater than its square root, it must have a corresponding divisor less than its square root.

3. **Not handling the single/no prime case**: If there's only one prime or no primes, the distance should be 0. Always initialize indices to -1 and check before calculating the difference.

4. **Overcomplicating with two passes**: Some candidates do one pass to find all prime indices, then another to find min and max. A single pass is sufficient and more efficient.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Two-pointer/range tracking**: Similar to problems where you need to find the minimum or maximum distance between elements with certain properties. Related problems:
   - **Container With Most Water**: Find two lines that form the largest container
   - **Maximum Distance Between Two Elements**: General pattern of tracking first and last occurrences

2. **Prime number problems**: Many problems involve prime number checking as a subproblem:
   - **Count Primes**: Sieve of Eratosthenes for counting primes up to n
   - **Prime Palindrome**: Find the smallest prime palindrome

The core technique of tracking only the first and last occurrence of elements with a certain property (instead of all occurrences) is widely applicable in array problems.

## Key Takeaways

1. **Optimize by reducing what you track**: When looking for maximum distance between indices, you only need the minimum and maximum indices where the condition is satisfied, not all indices.

2. **Know your prime checking**: Memorize the efficient O(√n) prime checking algorithm with proper handling of edge cases (n < 2, n = 2).

3. **Single pass is often sufficient**: Many array problems can be solved in one pass with careful tracking of state, avoiding the need for additional data structures or multiple passes.

[Practice this problem on CodeJeet](/problem/maximum-prime-difference)
