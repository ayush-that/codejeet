---
title: "How to Solve Prime Subtraction Operation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Prime Subtraction Operation. Medium difficulty, 55.6% acceptance rate. Topics: Array, Math, Binary Search, Greedy, Number Theory."
date: "2027-02-14"
category: "dsa-patterns"
tags: ["prime-subtraction-operation", "array", "math", "binary-search", "medium"]
---

# How to Solve Prime Subtraction Operation

You're given an array of integers and can repeatedly subtract prime numbers from elements, but each element can only be modified once. The goal is to determine if you can make the array strictly increasing through these operations. What makes this problem interesting is the combination of number theory (finding primes) with a greedy optimization strategy.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [4, 9, 6, 10]`

**Step 1:** Start with the first element `4`. We need to make it as small as possible while still positive (since we can only subtract primes less than the number). The primes less than 4 are: 2, 3. The smallest we can make 4 is `4 - 3 = 1`. So we set `nums[0] = 1`.

**Step 2:** Move to the second element `9`. We need it to be strictly greater than 1. The primes less than 9 are: 2, 3, 5, 7. We want the smallest number greater than 1. Let's try:

- `9 - 7 = 2` (greater than 1 ✓)
- Could we get 1? No, because 9 - 8 = 1 but 8 isn't prime.
- So the best we can do is 2. Set `nums[1] = 2`.

**Step 3:** Third element `6`. Must be strictly greater than 2. Primes less than 6: 2, 3, 5.

- `6 - 5 = 1` (not > 2 ✗)
- `6 - 3 = 3` (greater than 2 ✓)
- `6 - 2 = 4` (greater than 2 ✓)
  We want the smallest number > 2, which is 3. Set `nums[2] = 3`.

**Step 4:** Fourth element `10`. Must be strictly greater than 3. Primes less than 10: 2, 3, 5, 7.

- `10 - 7 = 3` (not > 3 ✗)
- `10 - 5 = 5` (greater than 3 ✓)
- `10 - 3 = 7` (greater than 3 ✓)
- `10 - 2 = 8` (greater than 3 ✓)
  Smallest > 3 is 5. Set `nums[3] = 5`.

Final array: `[1, 2, 3, 5]` which is strictly increasing. Return `true`.

The key insight: At each step, we want to make the current element as small as possible while still being greater than the previous element. This greedy approach works because making the current element smaller gives more flexibility to later elements.

## Brute Force Approach

A naive approach would try all possible primes for each element. For each index `i`, we could:

1. Generate all primes less than `nums[i]`
2. Try subtracting each prime
3. Recursively try all combinations for remaining elements

This leads to exponential time complexity. Even if we optimize with memoization, we'd still need to consider all prime combinations. For an element with value up to 1000, there could be ~168 primes (number of primes under 1000), leading to 168^n possibilities in worst case.

The brute force fails because:

- It explores unnecessary branches
- Doesn't leverage the greedy insight that we should always make the current element as small as possible
- Has exponential time complexity for arrays of reasonable size

## Optimized Approach

The optimal solution uses a greedy strategy with precomputed primes:

1. **Precompute primes** up to 1000 (the maximum constraint for `nums[i]`). We need quick access to the largest prime less than a given number.

2. **Process array left to right**:
   - For the first element, make it as small as possible (subtract the largest prime < `nums[0]`)
   - For each subsequent element, we need `nums[i] > nums[i-1]`
   - Find the largest prime `p` such that `nums[i] - p > nums[i-1]`
   - If no such prime exists, return `false`
   - Update `nums[i] = nums[i] - p`

3. **Why greedy works**: Making the current element as small as possible (while maintaining the increasing property) maximizes the chance that future elements can be made larger than it. If we made the current element larger than necessary, we might force a future element to be even larger, potentially exceeding what's possible with prime subtraction.

4. **Finding the right prime efficiently**: Instead of checking all primes, we can use binary search on the precomputed prime list to find the largest prime that satisfies our condition.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(P)) where P is number of primes up to 1000 (~168)
# Space: O(P) for storing primes list
class Solution:
    def primeSubOperation(self, nums: List[int]) -> bool:
        # Step 1: Precompute all primes up to 1000 using Sieve of Eratosthenes
        MAX_VAL = 1000
        is_prime = [True] * (MAX_VAL + 1)
        is_prime[0] = is_prime[1] = False  # 0 and 1 are not primes

        for i in range(2, int(MAX_VAL**0.5) + 1):
            if is_prime[i]:
                # Mark all multiples of i as non-prime
                for j in range(i * i, MAX_VAL + 1, i):
                    is_prime[j] = False

        # Create list of prime numbers
        primes = [i for i in range(2, MAX_VAL + 1) if is_prime[i]]

        # Step 2: Process the array greedily
        prev = 0  # The value that current element must be greater than

        for i in range(len(nums)):
            current = nums[i]

            # We need to find the largest prime p such that:
            # 1. p < current (can only subtract primes less than the number)
            # 2. current - p > prev (must be strictly greater than previous)

            # This is equivalent to finding the smallest result > prev
            # which means we want the largest p that satisfies: p < current - prev

            target = current - prev

            # If target <= 1, we cannot make current > prev
            # because the smallest we can make current is 1 (by subtracting largest prime)
            if target <= 1:
                # Check if current is already > prev without any subtraction
                if current <= prev:
                    return False
                # current is already > prev, so we don't subtract anything
                prev = current
                continue

            # Find the largest prime < min(current, target)
            # We need p < current AND p < target
            max_allowed = min(current, target) - 1

            # Binary search for the largest prime <= max_allowed
            left, right = 0, len(primes) - 1
            prime_to_subtract = -1

            while left <= right:
                mid = left + (right - left) // 2
                if primes[mid] <= max_allowed:
                    prime_to_subtract = primes[mid]
                    left = mid + 1  # Look for larger prime
                else:
                    right = mid - 1

            if prime_to_subtract == -1:
                # No prime available that satisfies conditions
                if current <= prev:
                    return False
                prev = current
            else:
                # Subtract the found prime
                new_val = current - prime_to_subtract
                prev = new_val

        return True
```

```javascript
// Time: O(n * log(P)) where P is number of primes up to 1000 (~168)
// Space: O(P) for storing primes array
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var primeSubOperation = function (nums) {
  // Step 1: Precompute all primes up to 1000 using Sieve of Eratosthenes
  const MAX_VAL = 1000;
  const isPrime = new Array(MAX_VAL + 1).fill(true);
  isPrime[0] = isPrime[1] = false; // 0 and 1 are not primes

  for (let i = 2; i * i <= MAX_VAL; i++) {
    if (isPrime[i]) {
      // Mark all multiples of i as non-prime
      for (let j = i * i; j <= MAX_VAL; j += i) {
        isPrime[j] = false;
      }
    }
  }

  // Create array of prime numbers
  const primes = [];
  for (let i = 2; i <= MAX_VAL; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }

  // Step 2: Process the array greedily
  let prev = 0; // The value that current element must be greater than

  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];

    // We need to find the largest prime p such that:
    // 1. p < current (can only subtract primes less than the number)
    // 2. current - p > prev (must be strictly greater than previous)

    // This is equivalent to finding the smallest result > prev
    // which means we want the largest p that satisfies: p < current - prev

    const target = current - prev;

    // If target <= 1, we cannot make current > prev
    // because the smallest we can make current is 1 (by subtracting largest prime)
    if (target <= 1) {
      // Check if current is already > prev without any subtraction
      if (current <= prev) {
        return false;
      }
      // current is already > prev, so we don't subtract anything
      prev = current;
      continue;
    }

    // Find the largest prime < min(current, target)
    // We need p < current AND p < target
    const maxAllowed = Math.min(current, target) - 1;

    // Binary search for the largest prime <= maxAllowed
    let left = 0,
      right = primes.length - 1;
    let primeToSubtract = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (primes[mid] <= maxAllowed) {
        primeToSubtract = primes[mid];
        left = mid + 1; // Look for larger prime
      } else {
        right = mid - 1;
      }
    }

    if (primeToSubtract === -1) {
      // No prime available that satisfies conditions
      if (current <= prev) {
        return false;
      }
      prev = current;
    } else {
      // Subtract the found prime
      const newVal = current - primeToSubtract;
      prev = newVal;
    }
  }

  return true;
};
```

```java
// Time: O(n * log(P)) where P is number of primes up to 1000 (~168)
// Space: O(P) for storing primes list
class Solution {
    public boolean primeSubOperation(int[] nums) {
        // Step 1: Precompute all primes up to 1000 using Sieve of Eratosthenes
        final int MAX_VAL = 1000;
        boolean[] isPrime = new boolean[MAX_VAL + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;  // 0 and 1 are not primes

        for (int i = 2; i * i <= MAX_VAL; i++) {
            if (isPrime[i]) {
                // Mark all multiples of i as non-prime
                for (int j = i * i; j <= MAX_VAL; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        // Create list of prime numbers
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= MAX_VAL; i++) {
            if (isPrime[i]) {
                primes.add(i);
            }
        }

        // Step 2: Process the array greedily
        int prev = 0;  // The value that current element must be greater than

        for (int i = 0; i < nums.length; i++) {
            int current = nums[i];

            // We need to find the largest prime p such that:
            // 1. p < current (can only subtract primes less than the number)
            // 2. current - p > prev (must be strictly greater than previous)

            // This is equivalent to finding the smallest result > prev
            // which means we want the largest p that satisfies: p < current - prev

            int target = current - prev;

            // If target <= 1, we cannot make current > prev
            // because the smallest we can make current is 1 (by subtracting largest prime)
            if (target <= 1) {
                // Check if current is already > prev without any subtraction
                if (current <= prev) {
                    return false;
                }
                // current is already > prev, so we don't subtract anything
                prev = current;
                continue;
            }

            // Find the largest prime < min(current, target)
            // We need p < current AND p < target
            int maxAllowed = Math.min(current, target) - 1;

            // Binary search for the largest prime <= maxAllowed
            int left = 0, right = primes.size() - 1;
            int primeToSubtract = -1;

            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (primes.get(mid) <= maxAllowed) {
                    primeToSubtract = primes.get(mid);
                    left = mid + 1;  // Look for larger prime
                } else {
                    right = mid - 1;
                }
            }

            if (primeToSubtract == -1) {
                // No prime available that satisfies conditions
                if (current <= prev) {
                    return false;
                }
                prev = current;
            } else {
                // Subtract the found prime
                int newVal = current - primeToSubtract;
                prev = newVal;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n \* log(P))**

- Precomputing primes using Sieve of Eratosthenes: O(MAX_VAL _ log(log(MAX_VAL))) ≈ O(1000 _ log(log(1000))) which is effectively constant
- Processing each of the n elements: O(n)
- For each element, binary search on primes list: O(log P) where P ≈ 168 (primes under 1000)
- Total: O(n \* log P) which is efficient for n up to 1000

**Space Complexity: O(P)**

- Storing the boolean array for sieve: O(MAX_VAL) = O(1000)
- Storing the list of primes: O(P) ≈ O(168)
- Total: O(MAX_VAL) which is constant space relative to input size

## Common Mistakes

1. **Not handling the "strictly less than" constraint correctly**: The problem states we can only subtract primes **strictly less than** `nums[i]`. Some candidates forget this and try to subtract primes equal to `nums[i]`, which would make the result 0 or negative (invalid).

2. **Missing the greedy insight**: Trying to find any prime that works rather than the optimal one. For example, subtracting a small prime when a larger one would give a better (smaller) result. This might work for some cases but fails when it leaves the element too large for subsequent elements.

3. **Inefficient prime checking**: Checking if a number is prime for each candidate value using trial division (O(√n) per check). This leads to O(n \* √MAX_VAL) complexity which is slower than precomputing with sieve.

4. **Forgetting edge cases**:
   - Single element array: Always return true since no ordering constraints
   - Already strictly increasing array: Should return true without any operations
   - Array with duplicate values: Must make them strictly increasing, so duplicates need to be resolved

## When You'll See This Pattern

This problem combines greedy processing with number theory. Similar patterns appear in:

1. **"Make Array Strictly Increasing" (LeetCode 1187)**: Also involves transforming an array to be strictly increasing with operations, though with different constraints.

2. **"Next Greater Element" problems**: The greedy "make it as small as possible" strategy is similar to maintaining monotonic stacks where you want to keep elements as small as possible for future flexibility.

3. **Problems with prime number constraints**: Like "Prime Palindrome" (LeetCode 866) or "Count Primes" (LeetCode 204), where efficient prime generation is key.

The core pattern is: **When you need to transform a sequence to satisfy ordering constraints, process elements in order and make each element as "good" as possible for future elements.**

## Key Takeaways

1. **Greedy with lookahead**: When making decisions that affect future elements, choose the option that maximizes flexibility for subsequent choices. Here, making the current element as small as possible (while maintaining constraints) is optimal.

2. **Precomputation for efficiency**: When you need to repeatedly answer queries about primes (or any mathematical property), precompute once and reuse. The Sieve of Eratosthenes is a must-know for prime-related problems.

3. **Binary search on monotonic properties**: When you need to find the largest/smallest value satisfying a condition in a sorted list, binary search is your friend. Here, we use it to find the largest prime meeting our constraints.

[Practice this problem on CodeJeet](/problem/prime-subtraction-operation)
