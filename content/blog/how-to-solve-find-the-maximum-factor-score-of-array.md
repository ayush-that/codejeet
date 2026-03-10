---
title: "How to Solve Find the Maximum Factor Score of Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Maximum Factor Score of Array. Medium difficulty, 40.9% acceptance rate. Topics: Array, Math, Number Theory."
date: "2029-08-29"
category: "dsa-patterns"
tags: ["find-the-maximum-factor-score-of-array", "array", "math", "number-theory", "medium"]
---

# How to Solve Find the Maximum Factor Score of Array

You’re given an array `nums` and need to find the maximum **factor score** after removing at most one element. The factor score is defined as the product of the LCM (Least Common Multiple) and GCD (Greatest Common Divisor) of all elements in the array. This problem is tricky because it combines number theory with efficient prefix/suffix computations—you can’t afford to recompute LCM and GCD for every possible removal.

## Visual Walkthrough

Let’s walk through a small example: `nums = [2, 4, 8, 16]`.

**Step 1 – Understanding the score without removal**  
First, compute the overall GCD and LCM:

- GCD(2,4,8,16) = 2
- LCM(2,4,8,16) = 16
- Factor score = 2 × 16 = 32

**Step 2 – Try removing each element**  
We need to check if removing one element can give a higher score.

- Remove index 0 (value 2): Remaining = [4,8,16]  
  GCD(4,8,16) = 4  
  LCM(4,8,16) = 16  
  Score = 4 × 16 = 64

- Remove index 1 (value 4): Remaining = [2,8,16]  
  GCD(2,8,16) = 2  
  LCM(2,8,16) = 16  
  Score = 2 × 16 = 32

- Remove index 2 (value 8): Remaining = [2,4,16]  
  GCD(2,4,16) = 2  
  LCM(2,4,16) = 16  
  Score = 32

- Remove index 3 (value 16): Remaining = [2,4,8]  
  GCD(2,4,8) = 2  
  LCM(2,4,8) = 8  
  Score = 16

**Step 3 – Compare all options**  
We keep the maximum:

- No removal: 32
- Remove index 0: 64
- Remove index 1: 32
- Remove index 2: 32
- Remove index 3: 16

Maximum factor score = **64** (achieved by removing the first element).

The key insight: we need to efficiently compute GCD and LCM for the array with each possible element removed, without recalculating from scratch every time.

## Brute Force Approach

A brute force solution would:

1. Compute the factor score for the original array.
2. For each index `i`, create a new array without `nums[i]`, compute its GCD and LCM, calculate the score, and track the maximum.
3. Return the maximum score found.

**Why this fails:**  
Computing GCD and LCM for each subarray from scratch is expensive. GCD of two numbers takes O(log(min(a,b))) time, and LCM can be derived as `a × b / GCD(a,b)`. For an array of length `n`, each removal requires O(n) GCD operations, leading to O(n² log M) time where M is the maximum number value. With n up to 10⁵, this is far too slow.

## Optimized Approach

We can precompute prefix and suffix arrays for GCD and LCM:

- `prefix_gcd[i]` = GCD of elements from `nums[0]` to `nums[i]`
- `suffix_gcd[i]` = GCD of elements from `nums[i]` to `nums[n-1]`
- Similarly for LCM.

Then, for each possible removal at index `i`, the GCD of the remaining array is:

```
GCD(prefix_gcd[i-1], suffix_gcd[i+1])
```

(Handling boundaries when i is at the start or end.)

The same applies to LCM.

This reduces the problem to:

1. Precompute prefix and suffix arrays in O(n) time.
2. For each index i, compute the “combined” GCD and LCM in O(1) time.
3. Calculate the score and track the maximum.

**Why this works:**  
GCD and LCM are associative operations. The GCD of a set can be computed by combining the GCD of two subsets. By storing prefix and suffix results, we can quickly get the GCD/LCM of the array without element i.

## Optimal Solution

We implement the prefix/suffix approach. Important details:

- LCM can grow very large, so we use `long` types to avoid overflow.
- For LCM of multiple numbers, we compute iteratively:  
  `LCM(a,b) = a / GCD(a,b) * b` (division first to minimize overflow).
- We must handle the case where we remove no element (i.e., consider the whole array).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxScore(nums):
    n = len(nums)
    if n == 1:
        # Single element: GCD = LCM = nums[0], score = nums[0] * nums[0]
        return nums[0] * nums[0]

    # Step 1: Precompute prefix GCD and LCM
    prefix_gcd = [0] * n
    prefix_lcm = [0] * n
    prefix_gcd[0] = nums[0]
    prefix_lcm[0] = nums[0]
    for i in range(1, n):
        # GCD is associative: GCD of first i elements = GCD(prev_gcd, nums[i])
        prefix_gcd[i] = gcd(prefix_gcd[i-1], nums[i])
        # LCM of first i elements = LCM(prev_lcm, nums[i])
        # LCM(a,b) = a // GCD(a,b) * b
        g = gcd(prefix_lcm[i-1], nums[i])
        prefix_lcm[i] = prefix_lcm[i-1] // g * nums[i]

    # Step 2: Precompute suffix GCD and LCM
    suffix_gcd = [0] * n
    suffix_lcm = [0] * n
    suffix_gcd[n-1] = nums[n-1]
    suffix_lcm[n-1] = nums[n-1]
    for i in range(n-2, -1, -1):
        suffix_gcd[i] = gcd(suffix_gcd[i+1], nums[i])
        g = gcd(suffix_lcm[i+1], nums[i])
        suffix_lcm[i] = suffix_lcm[i+1] // g * nums[i]

    # Step 3: Consider all possible removals (including no removal)
    max_score = 0
    for i in range(n):
        # Compute GCD after removing nums[i]
        if i == 0:
            # Remove first element: GCD is suffix starting from i+1
            current_gcd = suffix_gcd[i+1] if i+1 < n else 0
        elif i == n-1:
            # Remove last element: GCD is prefix ending at i-1
            current_gcd = prefix_gcd[i-1]
        else:
            # Remove middle: combine prefix before i and suffix after i
            current_gcd = gcd(prefix_gcd[i-1], suffix_gcd[i+1])

        # Compute LCM after removing nums[i]
        if i == 0:
            current_lcm = suffix_lcm[i+1] if i+1 < n else 0
        elif i == n-1:
            current_lcm = prefix_lcm[i-1]
        else:
            # LCM(a,b) = a // GCD(a,b) * b
            g = gcd(prefix_lcm[i-1], suffix_lcm[i+1])
            current_lcm = prefix_lcm[i-1] // g * suffix_lcm[i+1]

        # Calculate factor score
        score = current_gcd * current_lcm
        max_score = max(max_score, score)

    return max_score

def gcd(a, b):
    # Euclidean algorithm to compute GCD
    while b:
        a, b = b, a % b
    return a
```

```javascript
// Time: O(n) | Space: O(n)
function maxScore(nums) {
  const n = nums.length;
  if (n === 1) {
    // Single element: GCD = LCM = nums[0], score = nums[0] * nums[0]
    return nums[0] * nums[0];
  }

  // Helper: Euclidean algorithm for GCD
  const gcd = (a, b) => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  // Step 1: Precompute prefix GCD and LCM
  const prefixGCD = new Array(n);
  const prefixLCM = new Array(n);
  prefixGCD[0] = nums[0];
  prefixLCM[0] = nums[0];
  for (let i = 1; i < n; i++) {
    prefixGCD[i] = gcd(prefixGCD[i - 1], nums[i]);
    const g = gcd(prefixLCM[i - 1], nums[i]);
    // Use integer division (Math.floor) since we know it divides evenly
    prefixLCM[i] = Math.floor(prefixLCM[i - 1] / g) * nums[i];
  }

  // Step 2: Precompute suffix GCD and LCM
  const suffixGCD = new Array(n);
  const suffixLCM = new Array(n);
  suffixGCD[n - 1] = nums[n - 1];
  suffixLCM[n - 1] = nums[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    suffixGCD[i] = gcd(suffixGCD[i + 1], nums[i]);
    const g = gcd(suffixLCM[i + 1], nums[i]);
    suffixLCM[i] = Math.floor(suffixLCM[i + 1] / g) * nums[i];
  }

  // Step 3: Consider all possible removals
  let maxScore = 0;
  for (let i = 0; i < n; i++) {
    let currentGCD, currentLCM;

    // Compute GCD after removing nums[i]
    if (i === 0) {
      currentGCD = i + 1 < n ? suffixGCD[i + 1] : 0;
    } else if (i === n - 1) {
      currentGCD = prefixGCD[i - 1];
    } else {
      currentGCD = gcd(prefixGCD[i - 1], suffixGCD[i + 1]);
    }

    // Compute LCM after removing nums[i]
    if (i === 0) {
      currentLCM = i + 1 < n ? suffixLCM[i + 1] : 0;
    } else if (i === n - 1) {
      currentLCM = prefixLCM[i - 1];
    } else {
      const g = gcd(prefixLCM[i - 1], suffixLCM[i + 1]);
      currentLCM = Math.floor(prefixLCM[i - 1] / g) * suffixLCM[i + 1];
    }

    // Calculate factor score
    const score = currentGCD * currentLCM;
    maxScore = Math.max(maxScore, score);
  }

  return maxScore;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public long maxScore(int[] nums) {
        int n = nums.length;
        if (n == 1) {
            // Single element: GCD = LCM = nums[0], score = nums[0] * nums[0]
            return (long) nums[0] * nums[0];
        }

        // Step 1: Precompute prefix GCD and LCM
        long[] prefixGCD = new long[n];
        long[] prefixLCM = new long[n];
        prefixGCD[0] = nums[0];
        prefixLCM[0] = nums[0];
        for (int i = 1; i < n; i++) {
            prefixGCD[i] = gcd(prefixGCD[i-1], nums[i]);
            long g = gcd(prefixLCM[i-1], nums[i]);
            // Divide before multiplying to avoid overflow
            prefixLCM[i] = (prefixLCM[i-1] / g) * nums[i];
        }

        // Step 2: Precompute suffix GCD and LCM
        long[] suffixGCD = new long[n];
        long[] suffixLCM = new long[n];
        suffixGCD[n-1] = nums[n-1];
        suffixLCM[n-1] = nums[n-1];
        for (int i = n-2; i >= 0; i--) {
            suffixGCD[i] = gcd(suffixGCD[i+1], nums[i]);
            long g = gcd(suffixLCM[i+1], nums[i]);
            suffixLCM[i] = (suffixLCM[i+1] / g) * nums[i];
        }

        // Step 3: Consider all possible removals
        long maxScore = 0;
        for (int i = 0; i < n; i++) {
            long currentGCD, currentLCM;

            // Compute GCD after removing nums[i]
            if (i == 0) {
                currentGCD = (i+1 < n) ? suffixGCD[i+1] : 0;
            } else if (i == n-1) {
                currentGCD = prefixGCD[i-1];
            } else {
                currentGCD = gcd(prefixGCD[i-1], suffixGCD[i+1]);
            }

            // Compute LCM after removing nums[i]
            if (i == 0) {
                currentLCM = (i+1 < n) ? suffixLCM[i+1] : 0;
            } else if (i == n-1) {
                currentLCM = prefixLCM[i-1];
            } else {
                long g = gcd(prefixLCM[i-1], suffixLCM[i+1]);
                currentLCM = (prefixLCM[i-1] / g) * suffixLCM[i+1];
            }

            // Calculate factor score
            long score = currentGCD * currentLCM;
            if (score > maxScore) {
                maxScore = score;
            }
        }

        return maxScore;
    }

    // Euclidean algorithm for GCD
    private long gcd(long a, long b) {
        while (b != 0) {
            long temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make three passes through the array:
  1. Forward pass to compute prefix arrays: O(n)
  2. Backward pass to compute suffix arrays: O(n)
  3. Final pass to check each removal: O(n)
- Each GCD computation is O(log M) where M is the maximum number value, but since we compute GCD incrementally and reuse results, the total remains O(n log M). In practice, log M is small (≤ 64 for 64-bit integers), so we consider it O(n).

**Space Complexity:** O(n)

- We store four arrays of length n: prefix_gcd, prefix_lcm, suffix_gcd, suffix_lcm.

## Common Mistakes

1. **Not handling single-element arrays:** When n=1, removing an element leaves an empty array. The problem states that both LCM and GCD of a single number are the number itself, so the score is nums[0]². Our code handles this as a special case.

2. **Integer overflow when computing LCM:** LCM can become extremely large (imagine many large numbers). We must use `long` in Java/JavaScript and ensure we divide before multiplying: `a / gcd(a,b) * b` instead of `a * b / gcd(a,b)`.

3. **Incorrect boundary conditions when removing first/last element:** When i=0, there’s no prefix, so we use suffix[i+1]. When i=n-1, there’s no suffix, so we use prefix[i-1]. Forgetting to check these leads to index errors.

4. **Forgetting to consider the “no removal” case:** The problem says “after removing at most one element,” which includes removing zero elements. Our loop naturally includes this because when we compute GCD/LCM for the whole array, it’s equivalent to “removing” at an imaginary index. However, we must ensure our prefix/suffix arrays cover the full array.

## When You'll See This Pattern

The prefix/suffix precomputation technique appears whenever you need to answer queries about a subarray after removing one element, especially when the operation is associative (like GCD, LCM, sum, product, XOR).

Related LeetCode problems:

1. **Product of Array Except Self** – Uses prefix/suffix products to compute result without division.
2. **Maximum Subarray Sum After One Deletion** – Uses prefix/suffix maximum sums to find best deletion.
3. **Find the Highest Altitude** – Simpler prefix sum problem.

## Key Takeaways

1. **Prefix/Suffix arrays are powerful** for problems where you need to quickly compute a property of an array with one element removed. If the operation is associative (GCD, LCM, sum, etc.), you can precompute results from both ends.

2. **Handle edge cases early**: Single-element arrays, empty results after removal, and integer overflow are common pitfalls. Always test with n=1 and large numbers.

3. **LCM computation requires care**: Use `a / gcd(a,b) * b` to minimize overflow risk, and use 64-bit integers since products can exceed 32-bit range.

Related problems: [Greatest Common Divisor of Strings](/problem/greatest-common-divisor-of-strings), [Remove One Element to Make the Array Strictly Increasing](/problem/remove-one-element-to-make-the-array-strictly-increasing)
