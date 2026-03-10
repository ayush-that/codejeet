---
title: "How to Solve Partition Array into Two Equal Product Subsets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Array into Two Equal Product Subsets. Medium difficulty, 35.1% acceptance rate. Topics: Array, Bit Manipulation, Recursion, Enumeration."
date: "2029-02-23"
category: "dsa-patterns"
tags:
  [
    "partition-array-into-two-equal-product-subsets",
    "array",
    "bit-manipulation",
    "recursion",
    "medium",
  ]
---

## How to Solve Partition Array into Two Equal Product Subsets

You’re given an array of distinct positive integers and need to split it into two non‑empty subsets whose products are equal. This is tricky because the product of all numbers can be huge—far beyond what fits in standard integer types—so we can’t just compute products directly. The key is to realize that equal product subsets mean the total product must be a perfect square, and we need to find a subset whose product equals the square root of that total.

---

## Visual Walkthrough

Let’s take `nums = [2, 3, 12]`.  
**Step 1:** Compute total product: \( 2 \times 3 \times 12 = 72 \).  
**Step 2:** Check if 72 is a perfect square. \( \sqrt{72} \approx 8.485 \), not integer → impossible to split into equal product subsets.  
**Step 3:** If it were a perfect square, say `nums = [2, 8, 16]`, total product = \( 256 \), sqrt = \( 16 \). Now we need to find a subset whose product is 16.

- Try `{2, 8}`: product = 16 ✓. Remaining subset `{16}` product = 16. Works.

The challenge: products grow astronomically. Even a 20‑element array with modest values can overflow 64‑bit integers. We must avoid computing the actual product.

---

## Brute Force Approach

A brute force way is to enumerate all subsets (excluding empty and full set), compute each subset’s product, and see if any equals the square root of the total product.  
But computing products directly will overflow for most inputs. Even if we use big integers, the number of subsets is \( 2^n \), which is exponential.  
We can’t store or compare huge numbers efficiently. This forces us to think differently.

---

## Optimized Approach

**Key insight:** If two subsets have equal product, then multiplying all numbers gives \( P = \text{prod}\_1 \times \text{prod}\_2 = (\text{prod}\_1)^2 \).  
So the total product must be a perfect square. Let \( S = \sqrt{P} \) (must be integer).  
Now the problem reduces to: _Is there a subset whose product equals S?_

But S can still be huge. We can’t compute it directly. Instead, we use prime factorization.

**Why prime factorization?**

- Every integer can be uniquely factored into primes.
- If we factor each number into primes, the total product’s exponent for each prime is the sum of exponents from all numbers.
- For the total product to be a perfect square, every prime’s total exponent must be even.
- Then, finding a subset whose product equals S means: for each prime, the subset’s exponent sum must be exactly half of the total exponent.

**Transformation:**  
Let `total_exp[p]` = sum of exponents of prime p across all numbers.  
If any `total_exp[p]` is odd → answer is `false`.  
Otherwise, we need a subset where for each prime p, the sum of exponents in the subset = `total_exp[p] / 2`.  
This becomes a **multi‑dimensional subset sum problem** with dimensions = number of distinct primes.

**Optimization:**  
We don’t need to track all primes separately if we note that exponents are small (because numbers ≤ 10^4). We can represent the exponent vector as a state and use DP with bitmask or dictionary.

**Practical trick:**  
We can avoid big integers by working with exponents modulo something? No — we need exact half.  
Better: Use GCD reasoning. If we take the multiset of numbers, compute total product, check if it’s a perfect square via prime factorization, then try to pick a subset that multiplies to sqrt(total).  
But computing sqrt(total) exactly may be impossible without big ints.  
However, we can note: If total product is a perfect square, then for each prime, total exponent is even. Then we just need to see if we can pick a subset where for each prime, the sum of exponents = half of total. This is NP‑hard in general, but here n ≤ 20 (from constraints), so we can brute force subsets.

**Wait — constraints?** The problem statement didn’t give n limit, but typical LeetCode version has n ≤ 20. Then brute force over subsets is feasible.

**So the plan:**

1. Factor each number into primes, store exponent vectors.
2. Sum vectors to get total exponents.
3. If any total exponent is odd → false.
4. Compute target vector = total / 2 for each prime.
5. Try all subsets to see if any matches target vector.

---

## Optimal Solution

Since n ≤ 20, we can brute force over all subsets using bitmasks.  
We avoid big integer products by using prime factorization and comparing exponent vectors.

Steps:

1. Precompute primes up to max(nums).
2. For each num, get its prime factorization (exponents).
3. Sum exponents over all nums → total_exps.
4. If any total_exps[prime] is odd → return false.
5. target_exps = total_exps / 2 for each prime.
6. Enumerate all non‑empty proper subsets, compute their exponent sums, check if equals target_exps.

We must ensure both subsets are non‑empty, so we skip subsets that are empty or full.

---

<div class="code-group">

```python
# Time: O(2^n * p) where p is number of primes, n ≤ 20
# Space: O(p) for storing exponent vectors
from math import isqrt

def canPartition(nums):
    # Step 1: Precompute primes up to max(nums)
    max_num = max(nums)
    is_prime = [True] * (max_num + 1)
    is_prime[0] = is_prime[1] = False
    primes = []
    for i in range(2, max_num + 1):
        if is_prime[i]:
            primes.append(i)
            for j in range(i * i, max_num + 1, i):
                is_prime[j] = False

    # Step 2: Factor each number into prime exponents
    # prime_index maps prime -> index in exponent array
    prime_index = {p: i for i, p in enumerate(primes)}
    m = len(primes)
    exp_vectors = []
    for num in nums:
        vec = [0] * m
        temp = num
        for p in primes:
            if p * p > temp:
                break
            while temp % p == 0:
                vec[prime_index[p]] += 1
                temp //= p
        if temp > 1:
            if temp in prime_index:
                vec[prime_index[temp]] += 1
            else:
                # If temp > max_num and prime, we need to extend primes list
                # But given constraints, temp will be ≤ max_num
                pass
        exp_vectors.append(vec)

    # Step 3: Compute total exponents
    total_exps = [0] * m
    for vec in exp_vectors:
        for i in range(m):
            total_exps[i] += vec[i]

    # Step 4: Check if all total exponents are even
    for exp in total_exps:
        if exp % 2 == 1:
            return False

    # Step 5: Target exponents = half of total
    target = [exp // 2 for exp in total_exps]

    # Step 6: Enumerate all subsets (skip empty and full)
    n = len(nums)
    total_subsets = 1 << n
    for mask in range(1, total_subsets - 1):  # exclude 0 and (1<<n)-1
        subset_exps = [0] * m
        for i in range(n):
            if mask >> i & 1:
                vec = exp_vectors[i]
                for j in range(m):
                    subset_exps[j] += vec[j]
        if subset_exps == target:
            return True
    return False
```

```javascript
// Time: O(2^n * p) where p is number of primes, n ≤ 20
// Space: O(p) for exponent vectors
function canPartition(nums) {
  // Step 1: Precompute primes up to max(nums)
  const maxNum = Math.max(...nums);
  const isPrime = Array(maxNum + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  const primes = [];
  for (let i = 2; i <= maxNum; i++) {
    if (isPrime[i]) {
      primes.push(i);
      for (let j = i * i; j <= maxNum; j += i) {
        isPrime[j] = false;
      }
    }
  }

  // Step 2: Factor each number into prime exponents
  const primeIndex = {};
  primes.forEach((p, idx) => (primeIndex[p] = idx));
  const m = primes.length;
  const expVectors = [];
  for (const num of nums) {
    const vec = Array(m).fill(0);
    let temp = num;
    for (const p of primes) {
      if (p * p > temp) break;
      while (temp % p === 0) {
        vec[primeIndex[p]]++;
        temp /= p;
      }
    }
    if (temp > 1 && primeIndex[temp] !== undefined) {
      vec[primeIndex[temp]]++;
    }
    expVectors.push(vec);
  }

  // Step 3: Compute total exponents
  const totalExps = Array(m).fill(0);
  for (const vec of expVectors) {
    for (let i = 0; i < m; i++) {
      totalExps[i] += vec[i];
    }
  }

  // Step 4: Check if all total exponents are even
  for (const exp of totalExps) {
    if (exp % 2 === 1) return false;
  }

  // Step 5: Target exponents = half of total
  const target = totalExps.map((exp) => exp / 2);

  // Step 6: Enumerate all subsets (skip empty and full)
  const n = nums.length;
  const totalSubsets = 1 << n;
  for (let mask = 1; mask < totalSubsets - 1; mask++) {
    const subsetExps = Array(m).fill(0);
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        const vec = expVectors[i];
        for (let j = 0; j < m; j++) {
          subsetExps[j] += vec[j];
        }
      }
    }
    // Compare arrays
    let match = true;
    for (let j = 0; j < m; j++) {
      if (subsetExps[j] !== target[j]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}
```

```java
// Time: O(2^n * p) where p is number of primes, n ≤ 20
// Space: O(p) for exponent vectors
import java.util.*;

public class Solution {
    public boolean canPartition(int[] nums) {
        // Step 1: Precompute primes up to max(nums)
        int maxNum = 0;
        for (int num : nums) maxNum = Math.max(maxNum, num);
        boolean[] isPrime = new boolean[maxNum + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= maxNum; i++) {
            if (isPrime[i]) {
                primes.add(i);
                for (int j = i * i; j <= maxNum; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        // Step 2: Factor each number into prime exponents
        Map<Integer, Integer> primeIndex = new HashMap<>();
        for (int i = 0; i < primes.size(); i++) {
            primeIndex.put(primes.get(i), i);
        }
        int m = primes.size();
        List<int[]> expVectors = new ArrayList<>();
        for (int num : nums) {
            int[] vec = new int[m];
            int temp = num;
            for (int p : primes) {
                if (p * p > temp) break;
                while (temp % p == 0) {
                    vec[primeIndex.get(p)]++;
                    temp /= p;
                }
            }
            if (temp > 1 && primeIndex.containsKey(temp)) {
                vec[primeIndex.get(temp)]++;
            }
            expVectors.add(vec);
        }

        // Step 3: Compute total exponents
        int[] totalExps = new int[m];
        for (int[] vec : expVectors) {
            for (int i = 0; i < m; i++) {
                totalExps[i] += vec[i];
            }
        }

        // Step 4: Check if all total exponents are even
        for (int exp : totalExps) {
            if (exp % 2 == 1) return false;
        }

        // Step 5: Target exponents = half of total
        int[] target = new int[m];
        for (int i = 0; i < m; i++) {
            target[i] = totalExps[i] / 2;
        }

        // Step 6: Enumerate all subsets (skip empty and full)
        int n = nums.length;
        int totalSubsets = 1 << n;
        for (int mask = 1; mask < totalSubsets - 1; mask++) {
            int[] subsetExps = new int[m];
            for (int i = 0; i < n; i++) {
                if (((mask >> i) & 1) == 1) {
                    int[] vec = expVectors.get(i);
                    for (int j = 0; j < m; j++) {
                        subsetExps[j] += vec[j];
                    }
                }
            }
            if (Arrays.equals(subsetExps, target)) {
                return true;
            }
        }
        return false;
    }
}
```

</div>

---

## Complexity Analysis

- **Time:** \( O(2^n \cdot p) \) where \( n \) is length of `nums` (≤ 20) and \( p \) is number of primes up to `max(nums)`.  
  We iterate over all \( 2^n \) subsets, and for each subset we sum exponent vectors of size \( p \).  
  Since \( n \) is small, this is feasible.

- **Space:** \( O(p + n \cdot p) \) for storing prime list and exponent vectors.  
  In practice, \( p \) is small because primes up to 10^4 are only ~1229.

---

## Common Mistakes

1. **Computing products directly** — causes overflow even with 64‑bit integers. Use prime factorization to avoid huge numbers.
2. **Forgetting to check both subsets are non‑empty** — the loop must skip mask = 0 (empty) and mask = (1<<n)-1 (full set).
3. **Missing prime factors** — when factoring, remember to handle the remaining `temp > 1` as a prime factor.
4. **Not checking perfect square condition early** — if any prime’s total exponent is odd, return false immediately.

---

## When You'll See This Pattern

This is a **subset selection problem with multi‑dimensional constraints** (each prime is a dimension). Similar patterns appear in:

- **Partition Equal Subset Sum** — find subset with sum = total/2 (1D version).
- **Target Sum** — assign +/- to get target (can be seen as subset difference).
- **Fair Distribution of Cookies** — partition into k groups with minimum max sum.

The technique of transforming product constraints into sum of exponents is also used in problems involving divisibility or gcd constraints.

---

## Key Takeaways

1. **Products → exponents** — when dealing with products and divisibility, prime factorization converts multiplication into addition of exponents, making it easier to reason about.
2. **Small n → brute force** — if n ≤ 20, consider subset enumeration via bitmask as a viable solution.
3. **Early pruning** — check necessary conditions (like all exponents even) before exhaustive search to save time.

---

[Practice this problem on CodeJeet](/problem/partition-array-into-two-equal-product-subsets)
