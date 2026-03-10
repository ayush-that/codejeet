---
title: "How to Solve Count Array Pairs Divisible by K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Array Pairs Divisible by K. Hard difficulty, 30.6% acceptance rate. Topics: Array, Hash Table, Math, Counting, Number Theory."
date: "2029-09-26"
category: "dsa-patterns"
tags: ["count-array-pairs-divisible-by-k", "array", "hash-table", "math", "hard"]
---

# How to Solve Count Array Pairs Divisible by K

You're given an array `nums` and an integer `k`. You need to count all pairs `(i, j)` where `i < j` and `nums[i] * nums[j]` is divisible by `k`. The challenge is that a brute force check of all pairs would be O(n²), which is too slow for n up to 10⁵. The key insight is that we don't need to check every pair directly—instead, we can use number theory to transform the problem into a counting problem.

What makes this problem interesting is that we're dealing with divisibility of products, not sums. The condition `nums[i] * nums[j] % k == 0` is equivalent to saying that the product contains all the prime factors of `k` with sufficient exponents. This leads us to think about greatest common divisors and factor representations.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose `nums = [1, 2, 3, 4, 5]` and `k = 6`.

**Step 1: Factorize k = 6**

- 6 = 2¹ × 3¹
- So for a product to be divisible by 6, it must contain at least one factor of 2 and one factor of 3.

**Step 2: Process each number**
For each number, we find what part of k it "covers" (its contribution toward the factors needed):

1. `num = 1`: gcd(1, 6) = 1 → covers 1 (needs 6/1 = 6 from partner)
2. `num = 2`: gcd(2, 6) = 2 → covers 2 (needs 6/2 = 3 from partner)
3. `num = 3`: gcd(3, 6) = 3 → covers 3 (needs 6/3 = 2 from partner)
4. `num = 4`: gcd(4, 6) = 2 → covers 2 (needs 6/2 = 3 from partner)
5. `num = 5`: gcd(5, 6) = 1 → covers 1 (needs 6/1 = 6 from partner)

**Step 3: Count valid pairs**
We maintain a frequency map of what each number needs from its partner:

- Process 1: needs 6 → check how many previous numbers have coverage divisible by 6 (none yet) → add coverage 1 to map
- Process 2: needs 3 → check previous numbers whose coverage is divisible by 3 (none yet) → add coverage 2 to map
- Process 3: needs 2 → check previous numbers whose coverage is divisible by 2 (coverage 2 from num=2) → found 1 pair (2,3) → add coverage 3 to map
- Process 4: needs 3 → check previous numbers whose coverage is divisible by 3 (coverage 3 from num=3) → found 1 pair (3,4) → add coverage 2 to map (now count=2)
- Process 5: needs 6 → check previous numbers whose coverage is divisible by 6 (none) → add coverage 1 to map

Total pairs = 2: (2,3) and (3,4). Let's verify:

- 2 × 3 = 6 (divisible by 6) ✓
- 3 × 4 = 12 (divisible by 6) ✓

## Brute Force Approach

The most straightforward solution is to check every possible pair:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countPairs(nums, k):
    n = len(nums)
    count = 0

    # Check every pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            # If product is divisible by k, count it
            if (nums[i] * nums[j]) % k == 0:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countPairs(nums, k) {
  let count = 0;
  const n = nums.length;

  // Check every pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // If product is divisible by k, count it
      if ((nums[i] * nums[j]) % k === 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public long countPairs(int[] nums, int k) {
    long count = 0;
    int n = nums.length;

    // Check every pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // If product is divisible by k, count it
            if ((long) nums[i] * nums[j] % k == 0) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n up to 10⁵, O(n²) is approximately 10¹⁰ operations, which is far too slow. We need a solution that scales better—ideally O(n log k) or O(n√k).

## Optimized Approach

The key insight is that for `nums[i] * nums[j]` to be divisible by `k`, the combined factors from both numbers must cover all prime factors of `k` with sufficient exponents.

**Mathematical transformation:**

1. Let `g = gcd(nums[i], k)`. This represents what part of `k` is "covered" by `nums[i]`.
2. For the product to be divisible by `k`, the remaining part `k/g` must divide `nums[j]`.
3. But more precisely, we need `gcd(nums[j], k)` to be divisible by `k/g`.

**Algorithm outline:**

1. For each number `num` in `nums`:
   - Compute `g = gcd(num, k)`
   - This `g` represents what factors of `k` this number provides
   - The partner needs to provide `k/g` (or a multiple of it)
2. For each number, before adding it to our counts, check how many previous numbers have a `gcd` value that is divisible by `k/g`. Those are valid partners.

3. Store frequencies of `gcd` values in a hash map for O(1) lookups.

**Why this works:**

- If `num1` covers `g1` and `num2` covers `g2`, then together they cover `lcm(g1, g2)`.
- We need `lcm(g1, g2)` to be divisible by `k`, which means `g1` and `g2` together must contain all factors of `k`.
- Checking if `g2 % (k/g1) == 0` ensures that `g2` contains all the missing factors from `g1`.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n * sqrt(k)) | Space: O(sqrt(k))
def countPairs(nums, k):
    from math import gcd
    from collections import defaultdict

    # Map to store frequency of gcd values
    gcd_count = defaultdict(int)
    result = 0

    for num in nums:
        # What part of k does this number cover?
        current_gcd = gcd(num, k)

        # What does the partner need to cover?
        need = k // current_gcd

        # Check all previous numbers that could be valid partners
        # We need to find numbers whose gcd with k is divisible by 'need'
        for g, count in gcd_count.items():
            if g % need == 0:
                result += count

        # Add current number's gcd to the map for future numbers
        gcd_count[current_gcd] += 1

    return result
```

```javascript
// Time: O(n * sqrt(k)) | Space: O(sqrt(k))
function countPairs(nums, k) {
  // Helper function to compute GCD
  const gcd = (a, b) => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // Map to store frequency of gcd values
  const gcdCount = new Map();
  let result = 0;

  for (const num of nums) {
    // What part of k does this number cover?
    const currentGcd = gcd(num, k);

    // What does the partner need to cover?
    const need = Math.floor(k / currentGcd);

    // Check all previous numbers that could be valid partners
    // We need to find numbers whose gcd with k is divisible by 'need'
    for (const [g, count] of gcdCount.entries()) {
      if (g % need === 0) {
        result += count;
      }
    }

    // Add current number's gcd to the map for future numbers
    gcdCount.set(currentGcd, (gcdCount.get(currentGcd) || 0) + 1);
  }

  return result;
}
```

```java
// Time: O(n * sqrt(k)) | Space: O(sqrt(k))
public long countPairs(int[] nums, int k) {
    // Helper function to compute GCD
    int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Map to store frequency of gcd values
    Map<Integer, Integer> gcdCount = new HashMap<>();
    long result = 0;

    for (int num : nums) {
        // What part of k does this number cover?
        int currentGcd = gcd(num, k);

        // What does the partner need to cover?
        int need = k / currentGcd;

        // Check all previous numbers that could be valid partners
        // We need to find numbers whose gcd with k is divisible by 'need'
        for (Map.Entry<Integer, Integer> entry : gcdCount.entrySet()) {
            if (entry.getKey() % need == 0) {
                result += entry.getValue();
            }
        }

        // Add current number's gcd to the map for future numbers
        gcdCount.put(currentGcd, gcdCount.getOrDefault(currentGcd, 0) + 1);
    }

    return result;
}
```

</div>

**Optimization note:** The inner loop iterates over all divisors of `k`, and there are at most O(√k) divisors. This is much better than O(n) for each number.

## Complexity Analysis

**Time Complexity: O(n × d(k))**

- `n` is the length of the input array
- `d(k)` is the number of divisors of `k`
- For each of the `n` numbers, we iterate through all divisors stored in our map
- The maximum number of divisors for any integer ≤ 10⁵ is about 128 (for highly composite numbers), but typically much less

**Space Complexity: O(d(k))**

- We store at most one entry for each divisor of `k` in our hash map
- In practice, this is O(√k) since we only store gcd values which are divisors of `k`

**Why this is efficient:**

- For k ≤ 10⁵, the number of divisors is small (≤ 128)
- This gives us roughly 10⁵ × 128 ≈ 1.28 × 10⁷ operations, which is feasible
- Compare this to the brute force 10¹⁰ operations

## Common Mistakes

1. **Integer overflow when multiplying:** When checking `(nums[i] * nums[j]) % k == 0` in brute force, the product can exceed 32-bit integer limits. Always use 64-bit integers for intermediate results.

2. **Forgetting that gcd values can repeat:** Multiple numbers can have the same gcd with k. We need to count frequencies, not just track presence/absence.

3. **Incorrect need calculation:** The partner needs to provide `k/gcd(num, k)`, but we actually need to check if the partner's gcd is divisible by this value, not equal to it. A partner with gcd = 12 works when need = 6, since 12 is divisible by 6.

4. **Processing order matters:** We must check against previous numbers only (i < j). If we add the current number to the map before checking, we might count pairs where i = j or count pairs twice.

5. **Not handling k = 1 specially:** When k = 1, every product is divisible by 1. The answer is simply n×(n-1)/2. Our algorithm handles this correctly since gcd(num, 1) = 1 for all numbers, and need = 1, so all previous numbers are valid partners.

## When You'll See This Pattern

This problem uses a **divisor counting pattern** combined with **gcd transformations**. You'll see similar techniques in:

1. **Check If Array Pairs Are Divisible by k (Medium)** - Also uses gcd and remainder counting to pair numbers that sum to multiples of k.

2. **Find the Number of Good Pairs II (Medium)** - Involves counting pairs based on divisibility conditions, though with a different mathematical transformation.

3. **Number of Single Divisor Triplets (Medium)** - Extends the pair counting to triplets with divisibility conditions.

4. **Count Good Meals (Medium)** - Uses similar frequency counting but for sums of powers of two rather than products.

The core pattern is: when dealing with pairwise conditions (sums, products, etc.) that must satisfy some divisibility property, transform the condition into something about individual elements, then use frequency counting to avoid O(n²) checking.

## Key Takeaways

1. **Transform product conditions into individual properties:** Instead of checking `a × b % k == 0`, find what each number contributes (`gcd(a, k)`) and what it needs from its partner.

2. **Use frequency maps for divisor counting:** When the transformed property has limited possible values (divisors of k), store frequencies in a hash map for O(1) lookups.

3. **Process elements sequentially for pair counting:** By processing array elements one by one and checking against previous elements, we ensure each pair is counted exactly once with i < j.

4. **Mathematical insight matters:** Understanding that `gcd(a, k) × gcd(b, k)` doesn't directly give us the answer, but rather we need `lcm(gcd(a, k), gcd(b, k))` to be divisible by k.

**Related problems:** [Number of Single Divisor Triplets](/problem/number-of-single-divisor-triplets), [Check If Array Pairs Are Divisible by k](/problem/check-if-array-pairs-are-divisible-by-k), [Find the Number of Good Pairs II](/problem/find-the-number-of-good-pairs-ii)
