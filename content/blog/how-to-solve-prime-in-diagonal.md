---
title: "How to Solve Prime In Diagonal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Prime In Diagonal. Easy difficulty, 37.4% acceptance rate. Topics: Array, Math, Matrix, Number Theory."
date: "2028-02-07"
category: "dsa-patterns"
tags: ["prime-in-diagonal", "array", "math", "matrix", "easy"]
---

# How to Solve Prime In Diagonal

This problem asks us to find the largest prime number that appears on either diagonal of a square matrix. While the concept is straightforward, it combines matrix traversal with prime checking—two fundamental skills that often trip up candidates under pressure. The tricky part isn't the algorithm itself, but handling edge cases efficiently while maintaining clean code.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
nums = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
```

**Step 1: Identify the diagonals**

- Primary diagonal: elements where row index equals column index
  - Positions: (0,0)=1, (1,1)=5, (2,2)=9
- Secondary diagonal: elements where row index + column index = n-1
  - Positions: (0,2)=3, (1,1)=5, (2,0)=7

**Step 2: Collect unique diagonal elements**
We get: {1, 3, 5, 7, 9} (note: 5 appears on both diagonals but we only need it once)

**Step 3: Check each number for primality**

- 1: Not prime (primes must be >1)
- 3: Prime ✓
- 5: Prime ✓
- 7: Prime ✓
- 9: Not prime (divisible by 3)

**Step 4: Return the largest prime**
From {3, 5, 7}, the largest is 7

So for this input, the function should return 7.

## Brute Force Approach

A naive approach would be:

1. Traverse the entire matrix
2. For each element, check if it's on either diagonal
3. If it is, check if it's prime
4. Track the maximum prime found

While this approach works, it's inefficient because:

- We check primality for every element in the matrix, not just diagonals
- We might check the same diagonal element twice (for elements on both diagonals)
- The primality check itself can be optimized

However, the problem constraints (matrix size up to 300×300) make even a naive approach acceptable in terms of time complexity. The real issue with a truly brute force approach would be an inefficient primality check—like checking divisibility by all numbers up to n instead of up to √n.

## Optimal Solution

The optimal approach has three clear steps:

1. Collect all unique elements from both diagonals
2. Check each collected number for primality using an efficient method
3. Return the largest prime found (or 0 if none exist)

The key insight is that we only need to check numbers on the diagonals, and we should avoid duplicate checks for the center element in odd-sized matrices.

<div class="code-group">

```python
# Time: O(n * √m) where n is matrix dimension, m is max diagonal value
# Space: O(n) for storing diagonal elements
def diagonalPrime(nums):
    n = len(nums)
    diagonal_elements = set()

    # Step 1: Collect elements from both diagonals
    for i in range(n):
        # Primary diagonal: row index == column index
        diagonal_elements.add(nums[i][i])

        # Secondary diagonal: row index + column index == n-1
        diagonal_elements.add(nums[i][n-1-i])

    # Step 2: Find the largest prime among diagonal elements
    max_prime = 0

    for num in diagonal_elements:
        # Check if number is prime and larger than current max
        if num > max_prime and is_prime(num):
            max_prime = num

    return max_prime

def is_prime(num):
    # Prime numbers must be greater than 1
    if num <= 1:
        return False

    # Check divisibility up to square root of num
    # We start from 2 because 1 divides everything
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False

    return True
```

```javascript
// Time: O(n * √m) where n is matrix dimension, m is max diagonal value
// Space: O(n) for storing diagonal elements
function diagonalPrime(nums) {
  const n = nums.length;
  const diagonalElements = new Set();

  // Step 1: Collect elements from both diagonals
  for (let i = 0; i < n; i++) {
    // Primary diagonal: row index == column index
    diagonalElements.add(nums[i][i]);

    // Secondary diagonal: row index + column index == n-1
    diagonalElements.add(nums[i][n - 1 - i]);
  }

  // Step 2: Find the largest prime among diagonal elements
  let maxPrime = 0;

  for (const num of diagonalElements) {
    // Check if number is prime and larger than current max
    if (num > maxPrime && isPrime(num)) {
      maxPrime = num;
    }
  }

  return maxPrime;
}

function isPrime(num) {
  // Prime numbers must be greater than 1
  if (num <= 1) {
    return false;
  }

  // Check divisibility up to square root of num
  // We start from 2 because 1 divides everything
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n * √m) where n is matrix dimension, m is max diagonal value
// Space: O(n) for storing diagonal elements
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int diagonalPrime(int[][] nums) {
        int n = nums.length;
        Set<Integer> diagonalElements = new HashSet<>();

        // Step 1: Collect elements from both diagonals
        for (int i = 0; i < n; i++) {
            // Primary diagonal: row index == column index
            diagonalElements.add(nums[i][i]);

            // Secondary diagonal: row index + column index == n-1
            diagonalElements.add(nums[i][n - 1 - i]);
        }

        // Step 2: Find the largest prime among diagonal elements
        int maxPrime = 0;

        for (int num : diagonalElements) {
            // Check if number is prime and larger than current max
            if (num > maxPrime && isPrime(num)) {
                maxPrime = num;
            }
        }

        return maxPrime;
    }

    private boolean isPrime(int num) {
        // Prime numbers must be greater than 1
        if (num <= 1) {
            return false;
        }

        // Check divisibility up to square root of num
        // We start from 2 because 1 divides everything
        for (int i = 2; i * i <= num; i++) {
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

**Time Complexity: O(n × √m)**

- `n`: dimension of the matrix (we iterate through `n` rows to collect diagonal elements)
- `m`: maximum value in the diagonals (primality check runs in O(√m) time)
- We collect 2n elements but remove duplicates using a Set, so in worst case we check 2n elements
- Each primality check takes O(√m) time where m is the number being checked

**Space Complexity: O(n)**

- We store up to 2n diagonal elements in a Set (though duplicates are removed)
- In worst case with no duplicates, we store 2n elements
- The primality check uses O(1) additional space

## Common Mistakes

1. **Forgetting that 1 is not prime**: This is the most common error. The problem statement says "greater than 1," but candidates often miss this. Always include `if num <= 1: return false` in your primality check.

2. **Inefficient primality checking**: Checking divisibility up to `num-1` instead of `√num` makes the solution O(n × m) instead of O(n × √m). While acceptable for this problem's constraints, it shows poor algorithmic thinking.

3. **Checking the center element twice**: In odd-sized matrices, the center element appears on both diagonals. While our Set approach handles this automatically, some candidates might check primality twice for the same number, wasting computation.

4. **Not handling empty or 1x1 matrices**: While the problem guarantees a square matrix, edge cases matter. A 1x1 matrix only has one diagonal element. Make sure your code handles n=1 correctly.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Matrix diagonal traversal**: Used in problems like:
   - [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/) - More complex diagonal traversal
   - [Toeplitz Matrix](https://leetcode.com/problems/toeplitz-matrix/) - Checking diagonal properties
   - [Matrix Diagonal Sum](https://leetcode.com/problems/matrix-diagonal-sum/) - Almost identical diagonal access pattern

2. **Primality checking**: Used in problems like:
   - [Count Primes](https://leetcode.com/problems/count-primes/) - Sieve of Eratosthenes optimization
   - [Ugly Number](https://leetcode.com/problems/ugly-number/) - Prime factor checking
   - [Prime Palindrome](https://leetcode.com/problems/prime-palindrome/) - Combining primality with other properties

The combination of these patterns makes this problem excellent interview practice—it's simple enough to complete in 20 minutes but tests attention to detail.

## Key Takeaways

1. **Use Sets for duplicate elimination**: When you need unique elements from multiple sources, a Set automatically handles duplicates with O(1) lookups.

2. **Optimize primality checks**: Always check up to √n, not n. This reduces O(n) to O(√n) for each check—a massive improvement for large numbers.

3. **Matrix indices follow patterns**: Primary diagonal: `[i][i]`. Secondary diagonal: `[i][n-1-i]`. Memorize these patterns—they appear frequently in matrix problems.

[Practice this problem on CodeJeet](/problem/prime-in-diagonal)
