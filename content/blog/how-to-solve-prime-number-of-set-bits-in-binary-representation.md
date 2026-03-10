---
title: "How to Solve Prime Number of Set Bits in Binary Representation — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Prime Number of Set Bits in Binary Representation. Easy difficulty, 78.6% acceptance rate. Topics: Math, Bit Manipulation."
date: "2028-05-06"
category: "dsa-patterns"
tags: ["prime-number-of-set-bits-in-binary-representation", "math", "bit-manipulation", "easy"]
---

# How to Solve Prime Number of Set Bits in Binary Representation

This problem asks us to count how many numbers in a given range have a prime number of 1-bits in their binary representation. While the problem is categorized as "Easy," it combines several fundamental concepts: bit manipulation, prime checking, and range iteration. The interesting challenge lies in efficiently counting set bits and determining primality without unnecessary computation.

## Visual Walkthrough

Let's trace through an example with `left = 6` and `right = 10`. We need to check each number in this inclusive range:

1. **6** in binary is `110` → 2 set bits → 2 is prime → **Count = 1**
2. **7** in binary is `111` → 3 set bits → 3 is prime → **Count = 2**
3. **8** in binary is `1000` → 1 set bit → 1 is NOT prime → Count remains 2
4. **9** in binary is `1001` → 2 set bits → 2 is prime → **Count = 3**
5. **10** in binary is `1010` → 2 set bits → 2 is prime → **Count = 4**

So for the range [6, 10], the answer is 4. Notice that we need to:

1. Convert each number to binary
2. Count the number of 1-bits (set bits)
3. Check if that count is a prime number
4. Increment our counter when it is

## Brute Force Approach

The most straightforward approach is to iterate through each number in the range, count its set bits, and check if that count is prime. While this approach is conceptually simple, we need to be careful about efficiency when checking primality.

A naive primality check might iterate from 2 to n-1 to see if n is divisible by any number. However, we can optimize this by only checking up to √n, since any factor larger than √n would have a corresponding factor smaller than √n.

Even with this optimization, the brute force approach is still O((right-left) \* √M) where M is the maximum possible set bits (which is at most 32 for 32-bit integers). This is actually acceptable for the constraints of this problem, but we can do better by precomputing prime numbers.

## Optimal Solution

The key insight is that the number of set bits for any 32-bit integer ranges from 0 to 32. We only need to know which numbers in this range are prime. Instead of checking primality for each count, we can precompute a boolean array where `isPrime[i] = true` if i is prime.

We also need an efficient way to count set bits. We can use the built-in function in each language, or implement Brian Kernighan's algorithm which repeatedly clears the least significant set bit.

Here's the complete solution:

<div class="code-group">

```python
# Time: O(n) where n = right - left + 1
# Space: O(1) for fixed-size data structures
class Solution:
    def countPrimeSetBits(self, left: int, right: int) -> int:
        # Precompute prime numbers up to 32 (max bits for 32-bit integer)
        # We only need to check up to 32 because the maximum number of set bits
        # in a 32-bit integer is 32 (all bits are 1)
        primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31}

        count = 0

        # Iterate through each number in the range
        for num in range(left, right + 1):
            # Count set bits using built-in function
            set_bits = bin(num).count('1')

            # Check if the count is in our precomputed prime set
            if set_bits in primes:
                count += 1

        return count
```

```javascript
// Time: O(n) where n = right - left + 1
// Space: O(1) for fixed-size data structures
/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
var countPrimeSetBits = function (left, right) {
  // Precompute prime numbers up to 32
  // Using a Set for O(1) lookup
  const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]);

  let count = 0;

  // Iterate through each number in the range
  for (let num = left; num <= right; num++) {
    // Count set bits using Brian Kernighan's algorithm
    let setBits = 0;
    let n = num;

    // Brian Kernighan's algorithm: n & (n-1) clears the least significant set bit
    while (n > 0) {
      n = n & (n - 1);
      setBits++;
    }

    // Check if the count is prime
    if (primes.has(setBits)) {
      count++;
    }
  }

  return count;
};
```

```java
// Time: O(n) where n = right - left + 1
// Space: O(1) for fixed-size data structures
class Solution {
    public int countPrimeSetBits(int left, int right) {
        // Precompute prime numbers up to 32 using a boolean array
        // Index represents the number, value represents if it's prime
        boolean[] isPrime = new boolean[33]; // 0-32 inclusive

        // Initialize: 0 and 1 are not prime
        isPrime[0] = false;
        isPrime[1] = false;

        // Sieve-like initialization for numbers 2-32
        for (int i = 2; i <= 32; i++) {
            isPrime[i] = true;
        }

        // Mark non-prime numbers
        for (int i = 2; i * i <= 32; i++) {
            if (isPrime[i]) {
                for (int j = i * i; j <= 32; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        int count = 0;

        // Iterate through each number in the range
        for (int num = left; num <= right; num++) {
            // Count set bits using Integer.bitCount()
            int setBits = Integer.bitCount(num);

            // Check if the count is prime
            if (isPrime[setBits]) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n = right - left + 1

- We iterate through each number in the range exactly once
- For each number, we count set bits in O(k) time where k is the number of set bits (at most 32)
- The primality check is O(1) due to our precomputed set/array
- Overall linear time relative to the range size

**Space Complexity:** O(1)

- We use a fixed-size data structure for primes (size 33 in Java, 11 elements in Python/JavaScript sets)
- We use a constant amount of additional space for counters and loop variables
- The space does not grow with input size

## Common Mistakes

1. **Incorrect prime checking range:** Some candidates check primality up to n-1 instead of √n, or forget that 0 and 1 are not prime. Always remember: prime numbers are greater than 1 and have exactly two distinct positive divisors.

2. **Off-by-one errors with range:** The problem specifies an inclusive range [left, right]. Forgetting to include `right` in the loop (using `<` instead of `<=`) is a common mistake. Always double-check your loop boundaries.

3. **Inefficient set bit counting:** While converting to binary string and counting '1's works, it's less efficient than bit manipulation techniques. Brian Kernighan's algorithm (`n & (n-1)`) is more efficient as it only iterates through set bits rather than all bits.

4. **Not optimizing for the constraint:** Since we're dealing with 32-bit integers, the maximum set bits is 32. Some candidates create unnecessarily large prime checking functions instead of precomputing primes up to 32.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Bit counting with Brian Kernighan's algorithm:** This technique appears in problems like:
   - [Number of 1 Bits](/problem/number-of-1-bits) - Direct application of set bit counting
   - [Counting Bits](/problem/counting-bits) - Counting set bits for all numbers up to n
   - [Power of Two](/problem/power-of-two) - Checking if a number has exactly one set bit

2. **Precomputation for bounded ranges:** When you know your values will be within a small range (like 0-32 here), precomputing results can optimize your solution. This pattern appears in:
   - [Prime Palindrome](/problem/prime-palindrome) - Precomputing primes within a known range
   - [Ugly Number II](/problem/ugly-number-ii) - Precomputing numbers with specific prime factors

## Key Takeaways

1. **Combine multiple fundamental concepts:** This problem tests your ability to integrate bit manipulation, prime checking, and iteration. Breaking complex problems into smaller, familiar subproblems is a crucial interview skill.

2. **Optimize based on constraints:** The insight that set bits range from 0-32 for 32-bit integers allows for significant optimization through precomputation. Always look for bounds or constraints that can simplify your solution.

3. **Know your bit manipulation tricks:** Brian Kernighan's algorithm (`n & (n-1)`) is a powerful technique for counting set bits efficiently. It clears the least significant set bit in each iteration, making it run in O(k) time where k is the number of set bits.

Related problems: [Number of 1 Bits](/problem/number-of-1-bits)
