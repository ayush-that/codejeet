---
title: "How to Solve Range Product Queries of Powers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Range Product Queries of Powers. Medium difficulty, 61.4% acceptance rate. Topics: Array, Bit Manipulation, Prefix Sum."
date: "2027-02-23"
category: "dsa-patterns"
tags: ["range-product-queries-of-powers", "array", "bit-manipulation", "prefix-sum", "medium"]
---

# How to Solve Range Product Queries of Powers

This problem asks us to work with a special array representation of numbers: given a positive integer `n`, we need to create an array containing the minimum number of powers of 2 that sum to `n`, sorted in non-decreasing order. Then, given multiple range queries, we need to calculate the product of all elements in each specified range, modulo `10⁹ + 7`.

What makes this problem interesting is that it combines three key concepts: bit manipulation (to generate the powers array), modular arithmetic (for handling large products), and efficient range queries. The challenge is that a naive approach would be too slow when dealing with many queries.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `n = 15` and we have queries `[[0,1],[2,2],[0,2]]`.

**Step 1: Generate the powers array**

- `n = 15` in binary is `1111` (8 + 4 + 2 + 1)
- The minimum powers of 2 that sum to 15 are: 1, 2, 4, 8
- Sorted array: `powers = [1, 2, 4, 8]`

**Step 2: Process queries**

1. Query `[0,1]`: Product of elements at indices 0-1 = `1 × 2 = 2`
2. Query `[2,2]`: Product of element at index 2 = `4`
3. Query `[0,2]`: Product of elements at indices 0-2 = `1 × 2 × 4 = 8`

**Step 3: Apply modulo**
All results are less than `10⁹ + 7`, so they remain: `[2, 4, 8]`

The key insight is that we need to handle potentially many queries efficiently. If we have `q` queries and the powers array has length `m`, a naive approach that computes each product from scratch would take `O(q × m)` time, which could be too slow if both `q` and `m` are large.

## Brute Force Approach

The most straightforward approach would be:

1. Generate the powers array by checking each bit position of `n`
2. For each query `[left, right]`, iterate through the range and multiply all elements
3. Apply modulo `10⁹ + 7` to each result

Here's what the brute force code might look like:

```python
def brute_force(n, queries):
    MOD = 10**9 + 7

    # Step 1: Generate powers array
    powers = []
    bit = 0
    while n > 0:
        if n & 1:  # Check if current bit is set
            powers.append(1 << bit)  # Add 2^bit
        n >>= 1  # Shift right to check next bit
        bit += 1

    # Step 2: Process each query
    results = []
    for left, right in queries:
        product = 1
        for i in range(left, right + 1):
            product = (product * powers[i]) % MOD
        results.append(product)

    return results
```

**Why this is insufficient:**

- Time complexity: `O(b + q × m)` where `b` is number of bits in `n`, `q` is number of queries, and `m` is length of powers array
- In the worst case, `n` could be up to `10⁹` (30 bits), and we could have up to `10⁵` queries
- If the powers array is large (up to 30 elements) and we have many queries, this could mean up to 3 million operations, which might be borderline but could fail with tighter constraints
- More importantly, this approach doesn't scale well and shows poor interview performance

## Optimized Approach

The key insight for optimization is recognizing that we're repeatedly calculating products over ranges. This is a classic scenario where **prefix products** can help.

**Prefix Products Technique:**
Instead of computing each product from scratch, we can precompute:

- `prefix[i]` = product of first `i` elements (prefix[0] = 1)
- Then, product from `left` to `right` = `prefix[right+1] / prefix[left]`

However, we're working modulo a prime number (`10⁹ + 7`), so we can't use regular division. Instead, we use **modular inverses**:

- `(a / b) mod MOD = a × b⁻¹ mod MOD`, where `b⁻¹` is the modular inverse of `b`
- Since `MOD` is prime, we can use Fermat's Little Theorem: `b⁻¹ = b^(MOD-2) mod MOD`

**Alternative: Prefix Products with Modular Arithmetic**
We can store prefix products modulo `MOD`, and for each query:

- Product = `prefix[right+1] × modular_inverse(prefix[left]) mod MOD`

**Even Simpler Approach:**
Since we're dealing with powers of 2, we could also note that:

- Product of powers of 2 = `2^(sum of exponents)`
- But the prefix product approach is more general and works for any numbers

**Step-by-step reasoning:**

1. Generate the powers array using bit manipulation
2. Compute prefix products array where `prefix[0] = 1` and `prefix[i+1] = (prefix[i] × powers[i]) % MOD`
3. For each query `[left, right]`:
   - Compute `product = (prefix[right+1] × mod_inverse(prefix[left])) % MOD`
   - Or compute directly using modular exponentiation

## Optimal Solution

Here's the complete solution using prefix products with modular inverses:

<div class="code-group">

```python
# Time: O(b + q) where b is number of bits in n, q is number of queries
# Space: O(b) for storing powers and prefix arrays
class Solution:
    def productQueries(self, n: int, queries: List[List[int]]) -> List[int]:
        MOD = 10**9 + 7

        # Step 1: Generate powers array using bit manipulation
        powers = []
        bit = 0
        while n > 0:
            if n & 1:  # Check if current bit is set
                powers.append(1 << bit)  # Add 2^bit to powers
            n >>= 1  # Shift right to check next bit
            bit += 1

        # Step 2: Compute prefix products
        # prefix[i] = product of first i elements (prefix[0] = 1)
        prefix = [1] * (len(powers) + 1)
        for i in range(len(powers)):
            prefix[i + 1] = (prefix[i] * powers[i]) % MOD

        # Step 3: Helper function for modular exponentiation
        # Computes a^b mod MOD efficiently using binary exponentiation
        def mod_pow(a, b, mod):
            result = 1
            while b > 0:
                if b & 1:  # If current bit is set
                    result = (result * a) % mod
                a = (a * a) % mod  # Square the base
                b >>= 1  # Move to next bit
            return result

        # Step 4: Process each query
        results = []
        for left, right in queries:
            # Using modular inverse: a/b mod MOD = a * b^(-1) mod MOD
            # By Fermat's Little Theorem: b^(-1) = b^(MOD-2) mod MOD
            denominator_inv = mod_pow(prefix[left], MOD - 2, MOD)
            product = (prefix[right + 1] * denominator_inv) % MOD
            results.append(product)

        return results
```

```javascript
// Time: O(b + q) where b is number of bits in n, q is number of queries
// Space: O(b) for storing powers and prefix arrays
/**
 * @param {number} n
 * @param {number[][]} queries
 * @return {number[]}
 */
var productQueries = function (n, queries) {
  const MOD = 10 ** 9 + 7;

  // Step 1: Generate powers array using bit manipulation
  const powers = [];
  let bit = 0;
  while (n > 0) {
    if (n & 1) {
      // Check if current bit is set
      powers.push(1 << bit); // Add 2^bit to powers
    }
    n >>= 1; // Shift right to check next bit
    bit++;
  }

  // Step 2: Compute prefix products
  // prefix[i] = product of first i elements (prefix[0] = 1)
  const prefix = new Array(powers.length + 1);
  prefix[0] = 1;
  for (let i = 0; i < powers.length; i++) {
    prefix[i + 1] = (prefix[i] * powers[i]) % MOD;
  }

  // Step 3: Helper function for modular exponentiation
  // Computes a^b mod MOD efficiently using binary exponentiation
  const modPow = function (a, b, mod) {
    let result = 1n; // Use BigInt for safety with large numbers
    a = BigInt(a) % BigInt(mod);
    b = BigInt(b);
    const modBig = BigInt(mod);

    while (b > 0n) {
      if (b & 1n) {
        // If current bit is set
        result = (result * a) % modBig;
      }
      a = (a * a) % modBig; // Square the base
      b >>= 1n; // Move to next bit
    }
    return Number(result);
  };

  // Step 4: Process each query
  const results = [];
  for (const [left, right] of queries) {
    // Using modular inverse: a/b mod MOD = a * b^(-1) mod MOD
    // By Fermat's Little Theorem: b^(-1) = b^(MOD-2) mod MOD
    const denominatorInv = modPow(prefix[left], MOD - 2, MOD);
    const product = (prefix[right + 1] * denominatorInv) % MOD;
    results.push(product);
  }

  return results;
};
```

```java
// Time: O(b + q) where b is number of bits in n, q is number of queries
// Space: O(b) for storing powers and prefix arrays
class Solution {
    private static final int MOD = 1_000_000_007;

    public int[] productQueries(int n, int[][] queries) {
        // Step 1: Generate powers array using bit manipulation
        List<Integer> powersList = new ArrayList<>();
        int bit = 0;
        while (n > 0) {
            if ((n & 1) == 1) {  // Check if current bit is set
                powersList.add(1 << bit);  // Add 2^bit to powers
            }
            n >>= 1;  // Shift right to check next bit
            bit++;
        }

        // Convert list to array for easier indexing
        int[] powers = new int[powersList.size()];
        for (int i = 0; i < powersList.size(); i++) {
            powers[i] = powersList.get(i);
        }

        // Step 2: Compute prefix products
        // prefix[i] = product of first i elements (prefix[0] = 1)
        long[] prefix = new long[powers.length + 1];
        prefix[0] = 1;
        for (int i = 0; i < powers.length; i++) {
            prefix[i + 1] = (prefix[i] * powers[i]) % MOD;
        }

        // Step 3: Process each query
        int[] results = new int[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int left = queries[i][0];
            int right = queries[i][1];

            // Using modular inverse: a/b mod MOD = a * b^(-1) mod MOD
            // By Fermat's Little Theorem: b^(-1) = b^(MOD-2) mod MOD
            long denominatorInv = modPow(prefix[left], MOD - 2);
            long product = (prefix[right + 1] * denominatorInv) % MOD;
            results[i] = (int) product;
        }

        return results;
    }

    // Helper function for modular exponentiation
    // Computes a^b mod MOD efficiently using binary exponentiation
    private long modPow(long a, long b) {
        long result = 1;
        a %= MOD;

        while (b > 0) {
            if ((b & 1) == 1) {  // If current bit is set
                result = (result * a) % MOD;
            }
            a = (a * a) % MOD;  // Square the base
            b >>= 1;  // Move to next bit
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Generating powers array: `O(log n)` since we process each bit of `n`
- Computing prefix products: `O(m)` where `m` is the length of powers array (at most 30)
- Processing queries: `O(q)` for `q` queries, with each query requiring `O(log MOD)` for modular exponentiation
- Total: `O(log n + m + q × log MOD) = O(log n + q)` since `m ≤ log n` and `log MOD` is constant

**Space Complexity:**

- Powers array: `O(log n)` to store at most one power per bit
- Prefix array: `O(log n)` for the prefix products
- Total: `O(log n)`

## Common Mistakes

1. **Forgetting modular arithmetic**: Not applying modulo `10⁹ + 7` during intermediate calculations can cause integer overflow. Always apply modulo after each multiplication.

2. **Incorrect prefix array indexing**: A common off-by-one error is using `prefix[right] / prefix[left-1]` instead of `prefix[right+1] / prefix[left]`. Remember: `prefix[i]` = product of first `i` elements, so `prefix[0] = 1`.

3. **Using integer division instead of modular inverse**: In modular arithmetic, we can't use regular division. We must multiply by the modular inverse using Fermat's Little Theorem.

4. **Inefficient modular exponentiation**: Computing `a^(MOD-2)` naively would be `O(MOD)` which is far too slow. Always use binary exponentiation (`O(log MOD)`).

5. **Missing the powers array generation logic**: Some candidates try to generate all powers of 2 up to `n`, but we only need the bits that are set in `n`'s binary representation.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix Products/Sums**: Similar to "Range Sum Query - Immutable" (LeetCode 303) but with products instead of sums. The prefix technique is essential for answering multiple range queries efficiently.

2. **Modular Arithmetic with Inverses**: Appears in problems like "Count Good Numbers" (LeetCode 1922) where you need to compute large powers modulo a prime number.

3. **Bit Manipulation for Powers of 2**: The powers array generation uses the same technique as counting set bits or checking power-of-two properties, seen in problems like "Number of 1 Bits" (LeetCode 191).

4. **Binary Exponentiation**: The `mod_pow` function is a standard technique for computing large powers modulo a number, used in many number theory problems.

## Key Takeaways

1. **Prefix arrays transform range queries into point queries**: When you need to answer many range queries on a static array, precomputing prefix sums/products reduces each query from `O(range length)` to `O(1)`.

2. **Modular arithmetic requires special handling for division**: In prime modulo arithmetic, division becomes multiplication by modular inverse, which can be computed using Fermat's Little Theorem and binary exponentiation.

3. **Bit manipulation often provides efficient representations**: The binary representation of a number naturally gives us the minimum powers of 2 needed to sum to it - each set bit corresponds to a power of 2.

4. **Always consider the constraints**: With up to `10⁵` queries, any `O(q × m)` solution would be too slow, motivating the need for the prefix product optimization.

[Practice this problem on CodeJeet](/problem/range-product-queries-of-powers)
