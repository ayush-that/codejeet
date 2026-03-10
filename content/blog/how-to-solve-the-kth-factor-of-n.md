---
title: "How to Solve The kth Factor of n — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The kth Factor of n. Medium difficulty, 70.2% acceptance rate. Topics: Math, Number Theory."
date: "2027-10-06"
category: "dsa-patterns"
tags: ["the-kth-factor-of-n", "math", "number-theory", "medium"]
---

# How to Solve The kth Factor of n

This problem asks us to find the k-th smallest factor of a given integer n. While conceptually simple, it becomes interesting when we consider efficiency—n can be as large as 1000, and a naive approach checking every number up to n would be O(n), which is acceptable but not optimal. The real challenge lies in recognizing the mathematical relationship between factors to achieve O(√n) time complexity.

## Visual Walkthrough

Let's trace through an example: `n = 12, k = 3`

Factors of 12 are numbers that divide 12 evenly:

- 1 (12 ÷ 1 = 12)
- 2 (12 ÷ 2 = 6)
- 3 (12 ÷ 3 = 4)
- 4 (12 ÷ 4 = 3)
- 6 (12 ÷ 6 = 2)
- 12 (12 ÷ 12 = 1)

Sorted ascending: [1, 2, 3, 4, 6, 12]

The 3rd factor is 3. But here's the key insight: factors come in pairs! When we find that 2 divides 12, we immediately know that 6 = 12 ÷ 2 is also a factor. This pairing property allows us to only check numbers up to √n.

For n = 12, √12 ≈ 3.46, so we only need to check 1, 2, 3:

- Check 1: factors found = [1], paired factor = 12
- Check 2: factors found = [1, 2], paired factor = 6
- Check 3: factors found = [1, 2, 3], paired factor = 4

We now have all factors: [1, 2, 3] from the first half and [4, 6, 12] from the second half.

## Brute Force Approach

The most straightforward solution is to iterate through all integers from 1 to n, checking if each divides n evenly, and return the k-th one we find.

**Why this works but isn't optimal:**

- It correctly finds all factors in ascending order
- Time complexity is O(n), which for n ≤ 1000 is actually acceptable (1000 operations is trivial)
- However, it doesn't demonstrate algorithmic thinking or knowledge of number theory properties

The brute force would pass all test cases given the constraints, but in an interview, you'd want to show the optimized approach to demonstrate deeper understanding.

## Optimized Approach

The key insight is that factors always come in pairs (i, n/i). If i divides n, then n/i also divides n. This means:

1. We only need to check numbers up to √n
2. For each factor i we find, we get its paired factor n/i
3. We need to be careful with perfect squares where i = n/i

**Step-by-step reasoning:**

1. Initialize an empty list for smaller factors (≤ √n)
2. Initialize an empty list for larger factors (> √n)
3. Iterate i from 1 to √n (inclusive):
   - If n % i == 0, i is a factor
   - Add i to smaller factors list
   - If i ≠ n/i (not a perfect square), add n/i to larger factors list
4. Combine: smaller factors + larger factors (in reverse order since larger factors were added in descending order)
5. If k ≤ total factors, return the (k-1)th element (0-indexed), else return -1

**Why this is optimal:**

- We only check up to √n instead of n
- Time complexity improves from O(n) to O(√n)
- For n = 1000, we do ~32 checks instead of 1000

## Optimal Solution

<div class="code-group">

```python
# Time: O(√n) | Space: O(√n) for storing factors
def kthFactor(n: int, k: int) -> int:
    """
    Find the k-th smallest factor of n using the factor pairing property.
    Factors come in pairs (i, n/i), so we only need to check up to √n.
    """
    smaller_factors = []  # Factors ≤ √n
    larger_factors = []   # Factors > √n (will be reversed at the end)

    # Only check up to √n due to factor pairing
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:  # i is a factor
            smaller_factors.append(i)

            # Add the paired factor if it's different
            # (avoid duplicate for perfect squares)
            if i != n // i:
                larger_factors.append(n // i)

    # Combine factors: all smaller ones + larger ones in reverse
    # Larger factors were collected in increasing order (since i increases,
    # n/i decreases), so we reverse to get ascending order
    all_factors = smaller_factors + larger_factors[::-1]

    # Check if k is within bounds (1-indexed k vs 0-indexed list)
    if k <= len(all_factors):
        return all_factors[k - 1]
    else:
        return -1
```

```javascript
// Time: O(√n) | Space: O(√n) for storing factors
function kthFactor(n, k) {
  /**
   * Find the k-th smallest factor of n using the factor pairing property.
   * Factors come in pairs (i, n/i), so we only need to check up to √n.
   */
  const smallerFactors = []; // Factors ≤ √n
  const largerFactors = []; // Factors > √n (will be reversed at the end)

  // Only check up to √n due to factor pairing
  for (let i = 1; i <= Math.floor(Math.sqrt(n)); i++) {
    if (n % i === 0) {
      // i is a factor
      smallerFactors.push(i);

      // Add the paired factor if it's different
      // (avoid duplicate for perfect squares)
      if (i !== n / i) {
        largerFactors.push(n / i);
      }
    }
  }

  // Combine factors: all smaller ones + larger ones in reverse
  // Larger factors were collected in increasing order (since i increases,
  // n/i decreases), so we reverse to get ascending order
  const allFactors = smallerFactors.concat(largerFactors.reverse());

  // Check if k is within bounds (1-indexed k vs 0-indexed array)
  if (k <= allFactors.length) {
    return allFactors[k - 1];
  } else {
    return -1;
  }
}
```

```java
// Time: O(√n) | Space: O(√n) for storing factors
class Solution {
    public int kthFactor(int n, int k) {
        /**
         * Find the k-th smallest factor of n using the factor pairing property.
         * Factors come in pairs (i, n/i), so we only need to check up to √n.
         */
        List<Integer> smallerFactors = new ArrayList<>();  // Factors ≤ √n
        List<Integer> largerFactors = new ArrayList<>();   // Factors > √n

        // Only check up to √n due to factor pairing
        for (int i = 1; i <= Math.sqrt(n); i++) {
            if (n % i == 0) {  // i is a factor
                smallerFactors.add(i);

                // Add the paired factor if it's different
                // (avoid duplicate for perfect squares)
                if (i != n / i) {
                    largerFactors.add(n / i);
                }
            }
        }

        // Combine factors: all smaller ones + larger ones in reverse
        // Larger factors were collected in increasing order (since i increases,
        // n/i decreases), so we reverse to get ascending order
        Collections.reverse(largerFactors);
        List<Integer> allFactors = new ArrayList<>(smallerFactors);
        allFactors.addAll(largerFactors);

        // Check if k is within bounds (1-indexed k vs 0-indexed list)
        if (k <= allFactors.size()) {
            return allFactors.get(k - 1);
        } else {
            return -1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(√n)**

- We iterate from 1 to √n, performing constant-time operations (modulo and list operations) for each i
- For n = 1000, we perform ~32 iterations instead of 1000
- The square root operation itself is O(1) for practical purposes

**Space Complexity: O(√n)**

- We store all factors of n in two lists
- The number of factors of n is at most 2√n (when all numbers up to √n are factors, which only happens for highly composite numbers)
- In practice, for most numbers, the actual number of factors is much smaller

## Common Mistakes

1. **Forgetting to handle perfect squares**: When n is a perfect square (like 16, 25, 36), the factor √n appears twice if not handled properly. The check `if i != n // i` prevents this duplicate.

2. **Incorrect ordering of larger factors**: When we find i, we add n/i to the larger factors list. As i increases, n/i decreases, so larger factors are collected in descending order. Forgetting to reverse them before combining results in incorrect ordering.

3. **Off-by-one errors with k**: The problem uses 1-indexed k (first factor is k=1), but lists/arrays are 0-indexed. Returning `all_factors[k]` instead of `all_factors[k-1]` is a common mistake.

4. **Checking up to n instead of √n**: While the brute force O(n) solution works for the given constraints, it shows lack of optimization awareness. In an interview, always aim for the optimal solution unless explicitly told otherwise.

## When You'll See This Pattern

The "factor pairing" and "check up to square root" pattern appears in many number theory problems:

1. **Count Primes (LeetCode 204)**: To check if a number is prime, you only need to check divisors up to √n. The Sieve of Eratosthenes also uses similar principles.

2. **Perfect Squares (LeetCode 367)**: To check if a number is a perfect square, you can check up to √n or use binary search between 1 and √n.

3. **Sum of Square Numbers (LeetCode 633)**: To check if a number can be expressed as a² + b², you only need to check a up to √n since b² = n - a² must be non-negative.

The core insight is recognizing symmetric properties in mathematical structures—when you find one part of a pair, you immediately know the other part exists.

## Key Takeaways

1. **Factors come in pairs**: For any factor i of n, n/i is also a factor. This cuts the search space from O(n) to O(√n).

2. **Perfect squares need special handling**: When i = n/i (i.e., n is a perfect square), the factor appears only once, not twice.

3. **Mathematical properties often enable optimization**: Many problems that seem to require O(n) time can be optimized using mathematical insights. Always ask: "Is there a property or pattern I can exploit?"

[Practice this problem on CodeJeet](/problem/the-kth-factor-of-n)
