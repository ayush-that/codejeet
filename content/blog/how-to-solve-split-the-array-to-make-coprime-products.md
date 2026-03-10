---
title: "How to Solve Split the Array to Make Coprime Products — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Split the Array to Make Coprime Products. Hard difficulty, 28.7% acceptance rate. Topics: Array, Hash Table, Math, Number Theory."
date: "2029-12-09"
category: "dsa-patterns"
tags: ["split-the-array-to-make-coprime-products", "array", "hash-table", "math", "hard"]
---

# How to Solve Split the Array to Make Coprime Products

This problem asks us to find the smallest index where we can split an array so that the product of elements on the left and the product of elements on the right are coprime (share no common prime factors). What makes this problem tricky is that directly computing products would cause integer overflow for even moderately sized arrays, and checking coprimality by computing GCD of huge numbers is computationally expensive. The key insight is to work with prime factors instead of products.

## Visual Walkthrough

Let's trace through `nums = [2, 3, 3, 5, 7]` step by step:

**Step 1: Prime factorization of each element**

- 2 = {2}
- 3 = {3}
- 3 = {3}
- 5 = {5}
- 7 = {7}

**Step 2: Track prime factors as we move through the array**
We'll maintain two frequency maps: one for left side factors and one for right side factors.

Initially, left = {}, right = {2:1, 3:2, 5:1, 7:1}

**Step 3: Check split at index 0 (after first element)**
Left: {2:1}
Right: {3:2, 5:1, 7:1}
Do left and right share any prime factors? No → valid split!
Since we need the smallest index, we can return 0 immediately.

But let's see what happens if we continue with `nums = [4, 7, 8, 15, 7]`:

**Step 1: Prime factorization**

- 4 = {2, 2}
- 7 = {7}
- 8 = {2, 2, 2}
- 15 = {3, 5}
- 7 = {7}

**Step 2: Initial right frequency map**
Right = {2:5, 7:2, 3:1, 5:1}

**Step 3: Check split at index 0**
Left: {2:2}
Right: {2:3, 7:2, 3:1, 5:1}
Shared factor: 2 → invalid

**Step 4: Check split at index 1**
Move 7 from right to left:
Left: {2:2, 7:1}
Right: {2:3, 7:1, 3:1, 5:1}
Shared factor: 2 and 7 → invalid

**Step 5: Check split at index 2**
Move 8 from right to left:
Left: {2:5, 7:1}
Right: {7:1, 3:1, 5:1}
Shared factor: 7 → invalid

**Step 6: Check split at index 3**
Move 15 from right to left:
Left: {2:5, 7:1, 3:1, 5:1}
Right: {7:1}
Shared factor: 7 → invalid

No valid split → return -1

## Brute Force Approach

The brute force approach would be:

1. For each possible split index i from 0 to n-2
2. Compute product of nums[0..i]
3. Compute product of nums[i+1..n-1]
4. Check if gcd(product_left, product_right) == 1

The problem with this approach:

- **Integer overflow**: Products grow extremely fast (e.g., 100 numbers each ≤ 1000 would produce a number with ~3000 digits)
- **Time complexity**: O(n²) if we recompute products for each split, or O(n) per split with prefix/suffix products but still O(n²) for GCD computations on huge numbers
- **GCD on huge numbers** is computationally expensive

Even with big integers, the time complexity makes this infeasible for n up to 10⁴.

## Optimized Approach

The key insight is that **two numbers are coprime if and only if they share no prime factors**. Instead of tracking products, we track prime factor frequencies.

**Step-by-step reasoning:**

1. For each element, compute its prime factors with their frequencies
2. Build a frequency map of all prime factors in the entire array (right side map)
3. Initialize an empty left side map
4. Iterate through the array from left to right:
   - Move the current element's prime factors from right map to left map
   - Check if any prime factor exists in both maps
   - If no shared factors, we found the smallest valid split
5. If we finish without finding a split, return -1

**Why this works:**

- We're essentially checking if the multiset of prime factors on the left intersects with the multiset on the right
- When there's no intersection, the products are guaranteed to be coprime
- By processing from left to right, we find the smallest valid index first

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * sqrt(m)) where n = len(nums), m = max(nums)
# Space: O(n * log(m)) for storing prime factors
class Solution:
    def findValidSplit(self, nums: List[int]) -> int:
        # Helper function to get prime factors with their counts
        def get_prime_factors(x):
            factors = {}
            # Check for factor 2 separately for efficiency
            while x % 2 == 0:
                factors[2] = factors.get(2, 0) + 1
                x //= 2

            # Check odd factors up to sqrt(x)
            factor = 3
            while factor * factor <= x:
                while x % factor == 0:
                    factors[factor] = factors.get(factor, 0) + 1
                    x //= factor
                factor += 2

            # If x is still > 1, it's a prime factor
            if x > 1:
                factors[x] = factors.get(x, 0) + 1

            return factors

        n = len(nums)
        if n < 2:
            return -1

        # Precompute prime factors for each number
        factorizations = [get_prime_factors(num) for num in nums]

        # Count total frequency of each prime factor in the entire array
        total_factors = {}
        for factors in factorizations:
            for prime, count in factors.items():
                total_factors[prime] = total_factors.get(prime, 0) + count

        # Track factors on the left side of the split
        left_factors = {}
        # Track how many factors on the right side still need to be matched
        right_factors = total_factors.copy()

        # Check each possible split position
        for i in range(n - 1):
            # Move factors of current element from right to left
            for prime, count in factorizations[i].items():
                # Update left side
                left_factors[prime] = left_factors.get(prime, 0) + count

                # Update right side
                right_factors[prime] -= count
                if right_factors[prime] == 0:
                    # Remove from right_factors to simplify intersection check
                    del right_factors[prime]
                    # Also remove from left_factors if present (no longer shared)
                    if prime in left_factors:
                        del left_factors[prime]

            # Check if left and right sides share any prime factors
            # If left_factors is empty, no shared factors exist
            if not left_factors:
                return i

        return -1
```

```javascript
// Time: O(n * sqrt(m)) where n = nums.length, m = max(nums)
// Space: O(n * log(m)) for storing prime factors
/**
 * @param {number[]} nums
 * @return {number}
 */
var findValidSplit = function (nums) {
  // Helper function to get prime factors with their counts
  const getPrimeFactors = (x) => {
    const factors = new Map();

    // Handle factor 2 separately
    while (x % 2 === 0) {
      factors.set(2, (factors.get(2) || 0) + 1);
      x = Math.floor(x / 2);
    }

    // Check odd factors
    let factor = 3;
    while (factor * factor <= x) {
      while (x % factor === 0) {
        factors.set(factor, (factors.get(factor) || 0) + 1);
        x = Math.floor(x / factor);
      }
      factor += 2;
    }

    // If x > 1, it's a prime factor
    if (x > 1) {
      factors.set(x, (factors.get(x) || 0) + 1);
    }

    return factors;
  };

  const n = nums.length;
  if (n < 2) return -1;

  // Precompute prime factors for each number
  const factorizations = nums.map((num) => getPrimeFactors(num));

  // Count total frequency of each prime factor
  const totalFactors = new Map();
  for (const factors of factorizations) {
    for (const [prime, count] of factors) {
      totalFactors.set(prime, (totalFactors.get(prime) || 0) + count);
    }
  }

  // Track factors on left and right sides
  const leftFactors = new Map();
  const rightFactors = new Map(totalFactors);

  // Check each possible split
  for (let i = 0; i < n - 1; i++) {
    // Move current element's factors from right to left
    const currentFactors = factorizations[i];
    for (const [prime, count] of currentFactors) {
      // Update left side
      leftFactors.set(prime, (leftFactors.get(prime) || 0) + count);

      // Update right side
      const newRightCount = rightFactors.get(prime) - count;
      if (newRightCount === 0) {
        rightFactors.delete(prime);
        // If prime is no longer on right side, remove from left too
        leftFactors.delete(prime);
      } else {
        rightFactors.set(prime, newRightCount);
      }
    }

    // Check if left and right share any factors
    // If leftFactors is empty, no shared factors
    if (leftFactors.size === 0) {
      return i;
    }
  }

  return -1;
};
```

```java
// Time: O(n * sqrt(m)) where n = nums.length, m = max(nums)
// Space: O(n * log(m)) for storing prime factors
class Solution {
    public int findValidSplit(int[] nums) {
        int n = nums.length;
        if (n < 2) return -1;

        // Precompute prime factors for each number
        List<Map<Integer, Integer>> factorizations = new ArrayList<>();
        for (int num : nums) {
            factorizations.add(getPrimeFactors(num));
        }

        // Count total frequency of each prime factor
        Map<Integer, Integer> totalFactors = new HashMap<>();
        for (Map<Integer, Integer> factors : factorizations) {
            for (Map.Entry<Integer, Integer> entry : factors.entrySet()) {
                int prime = entry.getKey();
                int count = entry.getValue();
                totalFactors.put(prime, totalFactors.getOrDefault(prime, 0) + count);
            }
        }

        // Track factors on left and right sides
        Map<Integer, Integer> leftFactors = new HashMap<>();
        Map<Integer, Integer> rightFactors = new HashMap<>(totalFactors);

        // Check each possible split
        for (int i = 0; i < n - 1; i++) {
            Map<Integer, Integer> currentFactors = factorizations.get(i);

            // Move current element's factors from right to left
            for (Map.Entry<Integer, Integer> entry : currentFactors.entrySet()) {
                int prime = entry.getKey();
                int count = entry.getValue();

                // Update left side
                leftFactors.put(prime, leftFactors.getOrDefault(prime, 0) + count);

                // Update right side
                int newRightCount = rightFactors.get(prime) - count;
                if (newRightCount == 0) {
                    rightFactors.remove(prime);
                    // If prime is no longer on right side, remove from left too
                    leftFactors.remove(prime);
                } else {
                    rightFactors.put(prime, newRightCount);
                }
            }

            // Check if left and right share any factors
            // If leftFactors is empty, no shared factors
            if (leftFactors.isEmpty()) {
                return i;
            }
        }

        return -1;
    }

    // Helper method to get prime factors with counts
    private Map<Integer, Integer> getPrimeFactors(int x) {
        Map<Integer, Integer> factors = new HashMap<>();

        // Handle factor 2 separately
        while (x % 2 == 0) {
            factors.put(2, factors.getOrDefault(2, 0) + 1);
            x /= 2;
        }

        // Check odd factors
        for (int factor = 3; factor * factor <= x; factor += 2) {
            while (x % factor == 0) {
                factors.put(factor, factors.getOrDefault(factor, 0) + 1);
                x /= factor;
            }
        }

        // If x > 1, it's a prime factor
        if (x > 1) {
            factors.put(x, factors.getOrDefault(x, 0) + 1);
        }

        return factors;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n \* sqrt(m))**

- `n` is the length of the array
- `m` is the maximum value in the array
- For each element, we compute prime factors in O(sqrt(m)) time
- Updating and checking factor maps takes O(log m) per factor (amortized)
- In worst case, each number has O(log m) distinct prime factors

**Space Complexity: O(n \* log(m))**

- We store prime factorizations for all n elements
- Each factorization takes O(log m) space in worst case (when number is product of small primes)
- The factor maps also take O(n \* log(m)) space in total

## Common Mistakes

1. **Computing actual products**: This leads to integer overflow. Even with big integers, the numbers become astronomically large for arrays of length 100+.
2. **Forgetting to handle duplicate prime factors**: A number like 8 = 2³ has the prime factor 2 with multiplicity 3. We need to track counts, not just presence/absence.

3. **Inefficient prime factorization**: Checking divisibility by all numbers up to n is O(n). The optimal approach checks up to sqrt(n) and handles the remainder.

4. **Not checking all split positions**: Some candidates stop at the first index where products become coprime, but we need the smallest index. We must check from left to right.

## When You'll See This Pattern

This problem combines number theory with frequency counting, a pattern seen in:

1. **"Replace Non-Coprime Numbers in Array"** - Similar prime factor manipulation to merge non-coprime adjacent numbers.

2. **"Count Primes"** - Uses sieve-like thinking for prime-related computations.

3. **"Ugly Number II"** - Involves tracking multiples of prime factors.

4. **"Maximum Product of the Length of Two Palindromic Subsequences"** - Uses frequency maps to track character counts in subsets.

The core pattern is: when dealing with products and divisibility, work with prime factors instead of the numbers themselves. Frequency maps help track distributions across partitions.

## Key Takeaways

1. **Prime factors over products**: When a problem involves products, gcd, or divisibility, consider working with prime factorizations to avoid overflow and simplify logic.

2. **Frequency maps for partitioning**: Use frequency counts to track how elements are distributed between partitions without recomputing from scratch.

3. **Early exit optimization**: When searching for the smallest index satisfying a condition, process from left to right and return immediately when found.

Related problems: [Replace Non-Coprime Numbers in Array](/problem/replace-non-coprime-numbers-in-array)
