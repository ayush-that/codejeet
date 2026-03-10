---
title: "How to Solve Distinct Prime Factors of Product of Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Distinct Prime Factors of Product of Array. Medium difficulty, 54.2% acceptance rate. Topics: Array, Hash Table, Math, Number Theory."
date: "2028-09-06"
category: "dsa-patterns"
tags: ["distinct-prime-factors-of-product-of-array", "array", "hash-table", "math", "medium"]
---

# How to Solve Distinct Prime Factors of Product of Array

This problem asks us to find the number of distinct prime factors in the product of all elements in an array. While it sounds straightforward, the challenge lies in efficiently finding prime factors without actually computing the potentially massive product (which could overflow). The key insight is that the prime factors of a product are simply the union of prime factors of each individual number.

## Visual Walkthrough

Let's trace through an example: `nums = [12, 25, 18]`

**Step 1:** Instead of computing the product (12 × 25 × 18 = 5400) and then finding its prime factors, we'll find prime factors of each number individually:

- 12 = 2 × 2 × 3 → prime factors: {2, 3}
- 25 = 5 × 5 → prime factors: {5}
- 18 = 2 × 3 × 3 → prime factors: {2, 3}

**Step 2:** Take the union of all prime factors: {2, 3, 5}

**Step 3:** Count the distinct prime factors: 3

The result is 3, which matches what we'd get if we factored 5400 = 2³ × 3³ × 5².

**Why this works:** When you multiply numbers, their prime factorizations combine. If 2 is a factor of any number in the array, it will be a factor of the product. The distinct prime factors of the product are exactly the union of prime factors from all numbers.

## Brute Force Approach

A naive approach would be:

1. Multiply all numbers together (risk of integer overflow!)
2. Factor the resulting product by testing divisibility by all numbers up to √product

**Why this fails:**

- The product can be astronomically large (imagine 100 numbers each around 10⁹)
- Even with 64-bit integers, overflow is almost guaranteed
- Factoring a huge number is computationally expensive

**Time Complexity:** O(P) where P is the product value (exponential in input size)
**Space Complexity:** O(1)

This approach is completely impractical for the constraints of this problem.

## Optimized Approach

The key insight is that we don't need to compute the product at all. We can work with each number independently:

1. For each number in the array, find its prime factors
2. Collect all distinct prime factors in a set
3. Return the size of the set

**Efficient prime factorization:**

- For a number n, we only need to check divisors up to √n
- When we find a divisor d, we can keep dividing n by d while n % d == 0
- This ensures we extract all powers of d
- After checking all divisors up to √n, if n > 1, then n itself is prime

**Why this is efficient:**

- Each number is factored independently
- We stop checking at √n for each number
- The set operations are O(1) on average

## Optimal Solution

The optimal solution factors each number individually and collects distinct prime factors in a set. We use the standard factorization algorithm that checks divisors up to √n.

<div class="code-group">

```python
# Time: O(n * √m) where n = len(nums), m = max(nums)
# Space: O(k) where k = number of distinct prime factors
def distinctPrimeFactors(self, nums):
    """
    Find distinct prime factors in the product of all numbers in nums.

    Approach:
    1. Use a set to store distinct prime factors
    2. For each number, factor it using trial division up to sqrt(num)
    3. Add all prime factors found to the set
    4. Return the size of the set
    """
    prime_factors = set()

    for num in nums:
        # Factor the current number
        d = 2

        # Check divisors up to sqrt(num)
        while d * d <= num:
            # If d divides num, it's a prime factor
            if num % d == 0:
                prime_factors.add(d)
                # Remove all factors of d from num
                while num % d == 0:
                    num //= d
            d += 1

        # If num > 1 after division, it's a prime factor itself
        if num > 1:
            prime_factors.add(num)

    return len(prime_factors)
```

```javascript
// Time: O(n * √m) where n = nums.length, m = max(nums)
// Space: O(k) where k = number of distinct prime factors
function distinctPrimeFactors(nums) {
  /**
   * Find distinct prime factors in the product of all numbers in nums.
   *
   * Approach:
   * 1. Use a Set to store distinct prime factors
   * 2. For each number, factor it using trial division up to sqrt(num)
   * 3. Add all prime factors found to the Set
   * 4. Return the size of the Set
   */
  const primeFactors = new Set();

  for (let num of nums) {
    // Factor the current number
    let d = 2;

    // Check divisors up to sqrt(num)
    while (d * d <= num) {
      // If d divides num, it's a prime factor
      if (num % d === 0) {
        primeFactors.add(d);
        // Remove all factors of d from num
        while (num % d === 0) {
          num = Math.floor(num / d);
        }
      }
      d++;
    }

    // If num > 1 after division, it's a prime factor itself
    if (num > 1) {
      primeFactors.add(num);
    }
  }

  return primeFactors.size;
}
```

```java
// Time: O(n * √m) where n = nums.length, m = max(nums)
// Space: O(k) where k = number of distinct prime factors
public int distinctPrimeFactors(int[] nums) {
    /**
     * Find distinct prime factors in the product of all numbers in nums.
     *
     * Approach:
     * 1. Use a HashSet to store distinct prime factors
     * 2. For each number, factor it using trial division up to sqrt(num)
     * 3. Add all prime factors found to the HashSet
     * 4. Return the size of the HashSet
     */
    Set<Integer> primeFactors = new HashSet<>();

    for (int num : nums) {
        // Factor the current number
        int d = 2;

        // Check divisors up to sqrt(num)
        while (d * d <= num) {
            // If d divides num, it's a prime factor
            if (num % d == 0) {
                primeFactors.add(d);
                // Remove all factors of d from num
                while (num % d == 0) {
                    num /= d;
                }
            }
            d++;
        }

        // If num > 1 after division, it's a prime factor itself
        if (num > 1) {
            primeFactors.add(num);
        }
    }

    return primeFactors.size();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × √m)

- `n` is the length of the input array
- `m` is the maximum value in the array
- For each number, we check divisors up to its square root
- In the worst case, we process all numbers and check up to √m divisors for each

**Space Complexity:** O(k)

- `k` is the number of distinct prime factors across all numbers
- We store each distinct prime factor exactly once in a set
- In the worst case, if all numbers are distinct primes, k = n

**Why this is optimal:**

- We must examine each number at least once: Ω(n)
- Factoring a number requires checking up to its square root in the worst case
- The set operations are constant time on average

## Common Mistakes

1. **Computing the product first:** This causes integer overflow for even moderately sized inputs. Remember: 100 numbers around 10⁹ would produce a product with 900 digits!

2. **Forgetting to handle the leftover prime:** After the while loop (d \* d <= num), if num > 1, it's a prime factor. Candidates often miss this case, especially for prime numbers themselves.

3. **Not removing all occurrences of a factor:** When you find a divisor d, you must divide num by d repeatedly (while num % d == 0). Otherwise, you might add composite factors to your set.

4. **Using inefficient factorization:** Some candidates check divisibility by all numbers up to n instead of √n. This makes the solution O(n × m) instead of O(n × √m).

5. **Confusing factors with prime factors:** The problem asks for prime factors specifically. Don't add composite factors like 4, 6, or 9 to your set.

## When You'll See This Pattern

This problem combines number theory with set operations, a pattern seen in several LeetCode problems:

1. **2 Keys Keyboard (Medium):** Requires understanding of prime factorization to find the minimum number of operations. The optimal solution involves breaking n into its prime factors.

2. **Largest Component Size by Common Factor (Hard):** Uses prime factorization to build a graph where numbers are connected if they share a prime factor, then finds the largest connected component.

3. **Closest Divisors (Medium):** Involves finding factors of numbers to minimize the difference between two divisors.

The core pattern is: when dealing with products, divisors, or factors of numbers, consider working with prime factorizations instead of the numbers themselves. This often simplifies the problem and avoids overflow issues.

## Key Takeaways

1. **Prime factorization is distributive over multiplication:** The prime factors of a product are the union of prime factors of the individual factors. This lets us avoid computing huge products.

2. **Efficient factorization uses √n bound:** To factor a number n, you only need to check divisors up to √n. Any factor larger than √n would pair with a factor smaller than √n.

3. **Sets are perfect for tracking distinct elements:** When you need to collect unique items from multiple sources, a set provides O(1) insertion and deduplication.

4. **Handle the leftover prime:** After dividing by all factors up to √n, if n > 1, then n itself is prime and must be included in the result.

Related problems: [2 Keys Keyboard](/problem/2-keys-keyboard), [Largest Component Size by Common Factor](/problem/largest-component-size-by-common-factor), [Closest Divisors](/problem/closest-divisors)
