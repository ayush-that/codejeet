---
title: "How to Solve Sorted GCD Pair Queries — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sorted GCD Pair Queries. Hard difficulty, 22.3% acceptance rate. Topics: Array, Hash Table, Math, Binary Search, Combinatorics."
date: "2026-08-17"
category: "dsa-patterns"
tags: ["sorted-gcd-pair-queries", "array", "hash-table", "math", "hard"]
---

# How to Solve Sorted GCD Pair Queries

This problem asks us to handle queries about the sorted list of GCD values from all unique pairs in an array. The challenge is that directly computing all O(n²) pairs and sorting them is impossible for large n (up to 10⁵). The key insight is that we need to count how many pairs have GCD ≤ x without explicitly generating all pairs, then use binary search to answer queries efficiently.

## Visual Walkthrough

Let's trace through a small example: `nums = [4, 6, 8, 10]` with one query `queries[0] = 3`.

**Step 1: Understanding the GCD pairs**
All unique pairs (i < j):

- (4,6): GCD = 2
- (4,8): GCD = 4
- (4,10): GCD = 2
- (6,8): GCD = 2
- (6,10): GCD = 2
- (8,10): GCD = 2

**Step 2: Creating sorted gcdPairs**
GCD values: [2, 4, 2, 2, 2, 2] → Sorted: [2, 2, 2, 2, 2, 4]

**Step 3: Answering the query**
For query value 3, we need the 3rd element (0-indexed) in sorted gcdPairs: gcdPairs[3] = 2

The brute force approach would compute all 6 pairs, sort them, then answer queries directly. For n=10⁵, this would be ~5×10⁹ pairs - clearly impossible. We need a smarter way.

## Brute Force Approach

The straightforward solution has three steps:

1. Generate all O(n²) unique pairs (i < j)
2. Compute GCD for each pair
3. Sort all GCD values
4. Answer queries by direct array access

<div class="code-group">

```python
# Time: O(n² log n) | Space: O(n²)
def brute_force(nums, queries):
    n = len(nums)
    gcd_pairs = []

    # Step 1: Generate all pairs and compute GCDs
    for i in range(n):
        for j in range(i + 1, n):
            import math
            gcd_pairs.append(math.gcd(nums[i], nums[j]))

    # Step 2: Sort all GCD values
    gcd_pairs.sort()

    # Step 3: Answer queries
    result = []
    for q in queries:
        result.append(gcd_pairs[q])

    return result
```

```javascript
// Time: O(n² log n) | Space: O(n²)
function bruteForce(nums, queries) {
  const n = nums.length;
  const gcdPairs = [];

  // Step 1: Generate all pairs and compute GCDs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      gcdPairs.push(gcd(nums[i], nums[j]));
    }
  }

  // Step 2: Sort all GCD values
  gcdPairs.sort((a, b) => a - b);

  // Step 3: Answer queries
  const result = [];
  for (const q of queries) {
    result.push(gcdPairs[q]);
  }

  return result;
}

function gcd(a, b) {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
```

```java
// Time: O(n² log n) | Space: O(n²)
import java.util.*;

public class Solution {
    public int[] bruteForce(int[] nums, int[] queries) {
        int n = nums.length;
        List<Integer> gcdPairs = new ArrayList<>();

        // Step 1: Generate all pairs and compute GCDs
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                gcdPairs.add(gcd(nums[i], nums[j]));
            }
        }

        // Step 2: Sort all GCD values
        Collections.sort(gcdPairs);

        // Step 3: Answer queries
        int[] result = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            result[i] = gcdPairs.get(queries[i]);
        }

        return result;
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

**Why this fails:** For n=10⁵, we'd need to compute ~5×10⁹ GCD operations and store them, requiring ~40GB of memory just for the GCD values. The time complexity O(n² log n) is completely infeasible.

## Optimized Approach

The key insight is that we don't need to generate all pairs explicitly. Instead, we can:

1. **Count frequency of each number** in nums
2. **For each possible GCD value g**, count how many pairs have GCD exactly equal to g
3. **Use prefix sums** to get count of pairs with GCD ≤ x
4. **Binary search** to find the k-th smallest GCD for each query

**Core mathematical insight:** If we want to count pairs with GCD exactly equal to g:

- First count all pairs where both numbers are multiples of g
- Then subtract pairs where GCD is actually a multiple of g (2g, 3g, 4g, etc.)

Let `count[g]` = number of pairs with GCD exactly g
Let `multiples[g]` = number of elements divisible by g

Then:

1. Total pairs with both numbers divisible by g = C(multiples[g], 2) = multiples[g] \* (multiples[g] - 1) / 2
2. But these include pairs with GCD = g, 2g, 3g, ...
3. So: count[g] = C(multiples[g], 2) - sum(count[2g] + count[3g] + count[4g] + ...)

We compute this from largest g to smallest using a sieve-like approach.

## Optimal Solution

Here's the complete optimized solution:

<div class="code-group">

```python
# Time: O(M log M + Q log M) where M = max(nums)
# Space: O(M)
from math import gcd
from bisect import bisect_right

class Solution:
    def solve(self, nums, queries):
        """
        Main solution function that computes answers for all queries.

        Args:
            nums: List of integers
            queries: List of query indices (0-indexed)

        Returns:
            List of answers for each query
        """
        if not nums:
            return []

        # Step 1: Find maximum value in nums to determine our range
        max_val = max(nums)

        # Step 2: Count frequency of each number
        freq = [0] * (max_val + 1)
        for num in nums:
            freq[num] += 1

        # Step 3: Count how many numbers are divisible by each value
        # multiples[g] = count of numbers divisible by g
        multiples = [0] * (max_val + 1)
        for g in range(1, max_val + 1):
            # Sum frequencies of all multiples of g
            for multiple in range(g, max_val + 1, g):
                multiples[g] += freq[multiple]

        # Step 4: Count pairs with GCD exactly equal to g
        # count[g] = number of pairs with GCD exactly g
        count = [0] * (max_val + 1)
        for g in range(max_val, 0, -1):
            if multiples[g] == 0:
                continue

            # Total pairs where both numbers are divisible by g
            total_pairs = multiples[g] * (multiples[g] - 1) // 2

            # Subtract pairs where GCD is actually a multiple of g (2g, 3g, ...)
            # This ensures we only count pairs with GCD exactly g
            for multiple in range(2 * g, max_val + 1, g):
                total_pairs -= count[multiple]

            count[g] = total_pairs

        # Step 5: Build prefix sum array for binary search
        # prefix[i] = total pairs with GCD <= i
        prefix = [0] * (max_val + 1)
        running_sum = 0
        for g in range(1, max_val + 1):
            running_sum += count[g]
            prefix[g] = running_sum

        # Step 6: Answer queries using binary search
        result = []
        total_pairs = prefix[max_val]  # Total number of GCD pairs

        for q in queries:
            # Handle edge case: query index out of bounds
            if q >= total_pairs:
                result.append(-1)  # Or raise error based on problem constraints
                continue

            # Binary search to find smallest g such that prefix[g] > q
            # bisect_right finds first index where prefix[index] > q
            answer = bisect_right(prefix, q, 1, max_val + 1)
            result.append(answer)

        return result
```

```javascript
// Time: O(M log M + Q log M) where M = max(nums)
// Space: O(M)
class Solution {
  solve(nums, queries) {
    if (!nums || nums.length === 0) return [];

    // Step 1: Find maximum value
    let maxVal = Math.max(...nums);

    // Step 2: Count frequency of each number
    const freq = new Array(maxVal + 1).fill(0);
    for (const num of nums) {
      freq[num]++;
    }

    // Step 3: Count numbers divisible by each value
    const multiples = new Array(maxVal + 1).fill(0);
    for (let g = 1; g <= maxVal; g++) {
      for (let multiple = g; multiple <= maxVal; multiple += g) {
        multiples[g] += freq[multiple];
      }
    }

    // Step 4: Count pairs with GCD exactly equal to g
    const count = new Array(maxVal + 1).fill(0);
    for (let g = maxVal; g >= 1; g--) {
      if (multiples[g] === 0) continue;

      // Total pairs where both numbers are divisible by g
      let totalPairs = (multiples[g] * (multiples[g] - 1)) / 2;

      // Subtract pairs where GCD is actually a multiple of g
      for (let multiple = 2 * g; multiple <= maxVal; multiple += g) {
        totalPairs -= count[multiple];
      }

      count[g] = totalPairs;
    }

    // Step 5: Build prefix sum array
    const prefix = new Array(maxVal + 1).fill(0);
    let runningSum = 0;
    for (let g = 1; g <= maxVal; g++) {
      runningSum += count[g];
      prefix[g] = runningSum;
    }

    // Step 6: Answer queries using binary search
    const result = [];
    const totalPairs = prefix[maxVal];

    for (const q of queries) {
      // Handle out of bounds query
      if (q >= totalPairs) {
        result.push(-1);
        continue;
      }

      // Binary search to find answer
      let left = 1,
        right = maxVal;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (prefix[mid] > q) {
          right = mid;
        } else {
          left = mid + 1;
        }
      }
      result.push(left);
    }

    return result;
  }
}
```

```java
// Time: O(M log M + Q log M) where M = max(nums)
// Space: O(M)
import java.util.*;

class Solution {
    public int[] solve(int[] nums, int[] queries) {
        if (nums == null || nums.length == 0) {
            return new int[0];
        }

        // Step 1: Find maximum value
        int maxVal = 0;
        for (int num : nums) {
            maxVal = Math.max(maxVal, num);
        }

        // Step 2: Count frequency of each number
        int[] freq = new int[maxVal + 1];
        for (int num : nums) {
            freq[num]++;
        }

        // Step 3: Count numbers divisible by each value
        int[] multiples = new int[maxVal + 1];
        for (int g = 1; g <= maxVal; g++) {
            for (int multiple = g; multiple <= maxVal; multiple += g) {
                multiples[g] += freq[multiple];
            }
        }

        // Step 4: Count pairs with GCD exactly equal to g
        long[] count = new long[maxVal + 1]; // Use long to avoid overflow
        for (int g = maxVal; g >= 1; g--) {
            if (multiples[g] == 0) continue;

            // Total pairs where both numbers are divisible by g
            long totalPairs = (long) multiples[g] * (multiples[g] - 1) / 2;

            // Subtract pairs where GCD is actually a multiple of g
            for (int multiple = 2 * g; multiple <= maxVal; multiple += g) {
                totalPairs -= count[multiple];
            }

            count[g] = totalPairs;
        }

        // Step 5: Build prefix sum array
        long[] prefix = new long[maxVal + 1];
        long runningSum = 0;
        for (int g = 1; g <= maxVal; g++) {
            runningSum += count[g];
            prefix[g] = runningSum;
        }

        // Step 6: Answer queries using binary search
        int[] result = new int[queries.length];
        long totalPairs = prefix[maxVal];

        for (int i = 0; i < queries.length; i++) {
            long q = queries[i];

            // Handle out of bounds query
            if (q >= totalPairs) {
                result[i] = -1;
                continue;
            }

            // Binary search to find answer
            int left = 1, right = maxVal;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (prefix[mid] > q) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }
            result[i] = left;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(M log M + Q log M)**

- `M = max(nums)` is the maximum value in the input array
- `O(M log M)`: The nested loops for computing multiples and count arrays run in O(M log M) time due to harmonic series: sum\_{g=1}^M M/g ≈ M log M
- `O(Q log M)`: Each query uses binary search over range [1, M], taking O(log M) time
- This is efficient since M ≤ 10⁵ in typical constraints

**Space Complexity: O(M)**

- We need arrays of size M+1 for freq, multiples, count, and prefix
- This is O(M) space, which is acceptable for M ≤ 10⁵

## Common Mistakes

1. **Forgetting to subtract multiples in count calculation**: The most subtle part is computing `count[g] = C(multiples[g], 2) - sum(count[2g] + count[3g] + ...)`. If you forget to subtract the multiples, you'll count pairs with GCD=2g, 3g, etc. as having GCD=g.

2. **Incorrect loop direction for count calculation**: You must compute `count[g]` from largest g to smallest. If you go from smallest to largest, when you try to subtract `count[2g]`, it hasn't been computed yet.

3. **Integer overflow with large counts**: When n=10⁵, the number of pairs can be ~5×10⁹, which fits in 64-bit integers but overflows 32-bit. Always use 64-bit integers (long in Java, default in Python).

4. **Not handling duplicate numbers correctly**: The frequency counting approach naturally handles duplicates. A common mistake is trying to use sets or unique values only, which would give wrong results for arrays with repeated numbers.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sieve-like counting with multiples**: Similar to counting problems where you need to process all multiples of a number. Used in:
   - [Count Primes](https://leetcode.com/problems/count-primes/) - Sieve of Eratosthenes
   - [Ugly Number II](https://leetcode.com/problems/ugly-number-ii/) - Generating numbers with prime factors

2. **Inclusion-Exclusion Principle**: Counting pairs with exact GCD g by first counting pairs divisible by g, then excluding those with larger GCDs. Used in:
   - [Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits/) - Counting with constraints
   - Combinatorial counting problems with divisibility conditions

3. **Binary search on prefix sums**: Finding the k-th element in a virtual sorted array without generating it. Used in:
   - [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)
   - [Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/)

## Key Takeaways

1. **When you need the k-th element of a virtual sorted array**, consider if you can count how many elements are ≤ x without generating all elements, then use binary search.

2. **For problems involving divisibility and GCD**, think about processing numbers by their multiples. The sieve approach (O(M log M)) is often efficient when M is reasonable (≤ 10⁶).

3. **The inclusion-exclusion principle** is powerful for counting things with exact properties when it's easier to count things with "at least" or "divisible by" properties first.

[Practice this problem on CodeJeet](/problem/sorted-gcd-pair-queries)
