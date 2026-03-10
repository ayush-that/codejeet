---
title: "How to Solve Balanced K-Factor Decomposition — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Balanced K-Factor Decomposition. Medium difficulty, 40.0% acceptance rate. Topics: Math, Backtracking, Number Theory."
date: "2029-06-26"
category: "dsa-patterns"
tags: ["balanced-k-factor-decomposition", "math", "backtracking", "number-theory", "medium"]
---

# How to Solve Balanced K-Factor Decomposition

This problem asks us to split an integer `n` into exactly `k` positive integers whose product equals `n`, while minimizing the maximum difference between any two numbers in the split. What makes this tricky is that we need to balance two competing goals: achieving the exact product `n` while keeping the numbers as close to each other as possible. This is essentially a constrained factorization problem with an optimization objective.

## Visual Walkthrough

Let's trace through an example: `n = 24, k = 3`

We need to find 3 positive integers that multiply to 24, with the smallest possible gap between the largest and smallest numbers.

**Step 1: Understanding the constraints**

- We need exactly 3 numbers: a × b × c = 24
- All numbers must be positive integers
- We want max(a,b,c) - min(a,b,c) to be as small as possible

**Step 2: Finding candidate splits**
Possible factor triples of 24:

- (1, 1, 24) → difference = 23
- (1, 2, 12) → difference = 11
- (1, 3, 8) → difference = 7
- (1, 4, 6) → difference = 5
- (2, 2, 6) → difference = 4
- (2, 3, 4) → difference = 2

**Step 3: Identifying the optimal split**
The triple (2, 3, 4) has the smallest difference of 2, so this is our answer.

Notice that the optimal solution tends to have numbers that are as close to each other as possible. In fact, if we could use any real numbers, the optimal would be when all numbers equal the k-th root of n (∛24 ≈ 2.88). Since we need integers, we aim for numbers near this value.

## Brute Force Approach

A naive approach would be to generate all possible ways to factor `n` into `k` positive integers and then pick the one with the smallest maximum difference. This could be done through:

1. Finding all divisors of `n`
2. Generating all combinations of `k` divisors whose product equals `n`
3. Calculating the difference between max and min for each combination
4. Returning the combination with the smallest difference

However, this approach has several problems:

- The number of divisors grows quickly with `n`
- Generating all k-combinations is combinatorial explosion
- Even for moderately sized `n`, this becomes computationally infeasible

For example, if `n` has 100 divisors (common for numbers around 10,000), and `k=5`, we'd need to check C(100,5) ≈ 75 million combinations, and that's just for the divisor selection without considering multiplicities.

## Optimized Approach

The key insight is that we don't need to check all possible combinations. Instead, we can use a greedy approach based on the mathematical observation that to minimize the difference between numbers, we want them to be as close to each other as possible.

**Step-by-step reasoning:**

1. **Prime factorization**: First, factor `n` into its prime factors. For example, 24 = 2³ × 3¹.

2. **Initial distribution**: Start with `k` ones: [1, 1, 1, ..., 1] (k times).

3. **Greedy assignment**: Distribute the prime factors one by one to the smallest current number in our list. This ensures numbers stay as balanced as possible.

4. **Why this works**: By always adding to the smallest number, we prevent any single number from growing too large while others remain small. This minimizes the maximum difference.

5. **Edge case handling**: If after distributing all factors we still have some ones (because k > number of prime factors), we need to combine factors. For example, if we need 3 numbers but only have 2 prime factors, we combine some factors to create the required count.

6. **Sorting for minimal difference**: Finally, we sort the numbers and return them. The greedy approach naturally gives us numbers that are close to each other.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(sqrt(n) + k log k) | Space: O(k + number of prime factors)
def balancedKFactorization(n, k):
    """
    Split n into k positive integers with product n,
    minimizing the maximum difference between any two numbers.

    Args:
        n: The number to split
        k: The number of parts to split into

    Returns:
        List of k integers satisfying the conditions
    """
    # Edge case: if k == 1, the only possible split is [n]
    if k == 1:
        return [n]

    # Edge case: if k > n, we cannot split n into k positive integers
    # because each integer must be at least 1, and 1^k = 1 ≠ n when n > 1
    if k > n:
        return []

    # Step 1: Get prime factors of n
    factors = []
    temp = n

    # Factor out 2s first (special case for even numbers)
    while temp % 2 == 0:
        factors.append(2)
        temp //= 2

    # Factor out odd numbers from 3 to sqrt(temp)
    i = 3
    while i * i <= temp:
        while temp % i == 0:
            factors.append(i)
            temp //= i
        i += 2

    # If temp is still > 1, it's a prime factor
    if temp > 1:
        factors.append(temp)

    # Step 2: Check if we have enough factors
    # We need at least k factors total (could be combined later)
    if len(factors) < k:
        # We need to combine some factors to reach k numbers
        # Start by creating a list of k ones
        result = [1] * k

        # Distribute all factors to the first len(factors) positions
        for i in range(len(factors)):
            result[i] *= factors[i]

        # Now combine from the end until we have exactly k numbers > 1
        # We'll combine the last elements until all are > 1
        idx = len(factors)
        while idx < k and len(factors) > 0:
            # Take a factor from the largest current number
            # and give it to a 1
            max_idx = result.index(max(result))
            # Find a factor of the largest number
            for i in range(2, int(result[max_idx]**0.5) + 1):
                if result[max_idx] % i == 0:
                    result[max_idx] //= i
                    result[idx] = i
                    idx += 1
                    break

        # Remove any remaining 1s by combining factors
        while 1 in result:
            result.remove(1)
            # If we removed a 1, we need to combine two other numbers
            if len(result) >= 2:
                result[0] *= result.pop()

        # If we still don't have k numbers, pad with 1s
        while len(result) < k:
            result.append(1)

        result.sort()
        return result

    # Step 3: We have enough factors (len(factors) >= k)
    # Start with k ones
    result = [1] * k

    # Sort factors to distribute smaller ones first
    factors.sort()

    # Greedy distribution: always add to the smallest current number
    for factor in factors:
        # Find the smallest number in result
        min_idx = result.index(min(result))
        # Multiply it by the current factor
        result[min_idx] *= factor

    # Step 4: Sort and return
    result.sort()
    return result
```

```javascript
// Time: O(sqrt(n) + k log k) | Space: O(k + number of prime factors)
function balancedKFactorization(n, k) {
  /**
   * Split n into k positive integers with product n,
   * minimizing the maximum difference between any two numbers.
   *
   * @param {number} n - The number to split
   * @param {number} k - The number of parts to split into
   * @return {number[]} - Array of k integers satisfying the conditions
   */

  // Edge case: if k == 1, the only possible split is [n]
  if (k === 1) {
    return [n];
  }

  // Edge case: if k > n, we cannot split n into k positive integers
  if (k > n) {
    return [];
  }

  // Step 1: Get prime factors of n
  let factors = [];
  let temp = n;

  // Factor out 2s first (special case for even numbers)
  while (temp % 2 === 0) {
    factors.push(2);
    temp = Math.floor(temp / 2);
  }

  // Factor out odd numbers from 3 to sqrt(temp)
  let i = 3;
  while (i * i <= temp) {
    while (temp % i === 0) {
      factors.push(i);
      temp = Math.floor(temp / i);
    }
    i += 2;
  }

  // If temp is still > 1, it's a prime factor
  if (temp > 1) {
    factors.push(temp);
  }

  // Step 2: Check if we have enough factors
  if (factors.length < k) {
    // We need to combine some factors to reach k numbers
    let result = new Array(k).fill(1);

    // Distribute all factors to the first factors.length positions
    for (let i = 0; i < factors.length; i++) {
      result[i] *= factors[i];
    }

    // Combine from the end until we have exactly k numbers > 1
    let idx = factors.length;
    while (idx < k && factors.length > 0) {
      // Find the index of the maximum element
      let maxIdx = result.indexOf(Math.max(...result));

      // Find a factor of the largest number
      let found = false;
      for (let j = 2; j <= Math.sqrt(result[maxIdx]); j++) {
        if (result[maxIdx] % j === 0) {
          result[maxIdx] = Math.floor(result[maxIdx] / j);
          result[idx] = j;
          idx++;
          found = true;
          break;
        }
      }

      if (!found) break;
    }

    // Remove any remaining 1s by combining factors
    while (result.includes(1)) {
      let oneIdx = result.indexOf(1);
      result.splice(oneIdx, 1);

      // If we have at least 2 numbers, combine the first and last
      if (result.length >= 2) {
        result[0] *= result.pop();
      }
    }

    // If we still don't have k numbers, pad with 1s
    while (result.length < k) {
      result.push(1);
    }

    result.sort((a, b) => a - b);
    return result;
  }

  // Step 3: We have enough factors (factors.length >= k)
  // Start with k ones
  let result = new Array(k).fill(1);

  // Sort factors to distribute smaller ones first
  factors.sort((a, b) => a - b);

  // Greedy distribution: always add to the smallest current number
  for (let factor of factors) {
    // Find the index of the minimum element
    let minIdx = result.indexOf(Math.min(...result));
    // Multiply it by the current factor
    result[minIdx] *= factor;
  }

  // Step 4: Sort and return
  result.sort((a, b) => a - b);
  return result;
}
```

```java
// Time: O(sqrt(n) + k log k) | Space: O(k + number of prime factors)
import java.util.*;

public class Solution {
    public List<Integer> balancedKFactorization(int n, int k) {
        /**
         * Split n into k positive integers with product n,
         * minimizing the maximum difference between any two numbers.
         *
         * @param n - The number to split
         * @param k - The number of parts to split into
         * @return List of k integers satisfying the conditions
         */

        List<Integer> result = new ArrayList<>();

        // Edge case: if k == 1, the only possible split is [n]
        if (k == 1) {
            result.add(n);
            return result;
        }

        // Edge case: if k > n, we cannot split n into k positive integers
        if (k > n) {
            return result;
        }

        // Step 1: Get prime factors of n
        List<Integer> factors = new ArrayList<>();
        int temp = n;

        // Factor out 2s first (special case for even numbers)
        while (temp % 2 == 0) {
            factors.add(2);
            temp /= 2;
        }

        // Factor out odd numbers from 3 to sqrt(temp)
        for (int i = 3; i * i <= temp; i += 2) {
            while (temp % i == 0) {
                factors.add(i);
                temp /= i;
            }
        }

        // If temp is still > 1, it's a prime factor
        if (temp > 1) {
            factors.add(temp);
        }

        // Step 2: Check if we have enough factors
        if (factors.size() < k) {
            // We need to combine some factors to reach k numbers
            for (int i = 0; i < k; i++) {
                result.add(1);
            }

            // Distribute all factors to the first factors.size() positions
            for (int i = 0; i < factors.size(); i++) {
                result.set(i, result.get(i) * factors.get(i));
            }

            // Combine from the end until we have exactly k numbers > 1
            int idx = factors.size();
            while (idx < k && !factors.isEmpty()) {
                // Find the index of the maximum element
                int maxIdx = 0;
                for (int i = 1; i < result.size(); i++) {
                    if (result.get(i) > result.get(maxIdx)) {
                        maxIdx = i;
                    }
                }

                // Find a factor of the largest number
                boolean found = false;
                int maxVal = result.get(maxIdx);
                for (int j = 2; j * j <= maxVal; j++) {
                    if (maxVal % j == 0) {
                        result.set(maxIdx, maxVal / j);
                        result.set(idx, j);
                        idx++;
                        found = true;
                        break;
                    }
                }

                if (!found) break;
            }

            // Remove any remaining 1s by combining factors
            while (result.contains(1)) {
                int oneIdx = result.indexOf(1);
                result.remove(oneIdx);

                // If we have at least 2 numbers, combine the first and last
                if (result.size() >= 2) {
                    int first = result.get(0);
                    int last = result.remove(result.size() - 1);
                    result.set(0, first * last);
                }
            }

            // If we still don't have k numbers, pad with 1s
            while (result.size() < k) {
                result.add(1);
            }

            Collections.sort(result);
            return result;
        }

        // Step 3: We have enough factors (factors.size() >= k)
        // Start with k ones
        for (int i = 0; i < k; i++) {
            result.add(1);
        }

        // Sort factors to distribute smaller ones first
        Collections.sort(factors);

        // Greedy distribution: always add to the smallest current number
        for (int factor : factors) {
            // Find the index of the minimum element
            int minIdx = 0;
            for (int i = 1; i < result.size(); i++) {
                if (result.get(i) < result.get(minIdx)) {
                    minIdx = i;
                }
            }

            // Multiply it by the current factor
            result.set(minIdx, result.get(minIdx) * factor);
        }

        // Step 4: Sort and return
        Collections.sort(result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(√n + k log k)**

- Prime factorization takes O(√n) time in the worst case (when n is prime or has a large prime factor)
- Sorting the result takes O(k log k) time
- The greedy distribution takes O(m × k) where m is the number of prime factors, but m ≤ log₂(n), so this is dominated by the other terms

**Space Complexity: O(k + m)** where m is the number of prime factors

- We store the prime factors (O(m))
- We store the result array of size k (O(k))
- The recursion stack for factorization is O(1) since we use iterative factorization

## Common Mistakes

1. **Forgetting edge cases**:
   - When k = 1, the answer is simply [n]
   - When k > n, it's impossible (except when n = 1 and k = 1)
   - When n = 1, the only valid split is k ones

2. **Incorrect prime factorization**:
   - Forgetting to handle the factor 2 separately
   - Not checking for the remaining prime factor after the loop (when temp > 1)
   - Using O(n) trial division instead of O(√n)

3. **Inefficient greedy strategy**:
   - Adding factors to random positions instead of always choosing the smallest
   - Not sorting factors before distribution
   - Not handling the case when number of prime factors < k properly

4. **Incorrect difference calculation**:
   - The problem asks to minimize the maximum difference, not necessarily make all numbers equal
   - Some candidates try to make all numbers exactly equal to the k-th root, which isn't always possible with integers

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prime Factorization**: Problems like "Ugly Number", "Count Primes", and "Largest Prime Factor" use similar factorization techniques.

2. **Greedy Distribution**: The "always add to the smallest" pattern appears in problems like "Minimum Number of Refueling Stops" and "Task Scheduler" where resources need to be balanced.

3. **Constrained Optimization**: Similar to "Split Array Largest Sum" and "Divide Chocolate" where you need to split something while optimizing a metric.

Specifically related problems:

- **LeetCode 1492: The kth Factor of n** - Also involves factorization of n
- **LeetCode 343: Integer Break** - Splitting a number to maximize product (similar but opposite goal)
- **LeetCode 650: 2 Keys Keyboard** - Uses prime factorization in a dynamic programming context

## Key Takeaways

1. **Prime factorization is fundamental**: Many number theory problems reduce to understanding and manipulating prime factors. The O(√n) trial division algorithm is worth memorizing.

2. **Greedy can work for balancing problems**: When you need to distribute resources evenly, always allocating to the smallest current pile often yields good results. This is analogous to load balancing in distributed systems.

3. **Edge cases matter in number theory**: Always check k=1, n=1, k>n, and cases where the number of prime factors is less than k. These special cases often break naive implementations.

[Practice this problem on CodeJeet](/problem/balanced-k-factor-decomposition)
