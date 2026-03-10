---
title: "How to Solve Minimum Number of Operations to Make String Sorted — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Make String Sorted. Hard difficulty, 50.7% acceptance rate. Topics: Hash Table, Math, String, Combinatorics, Counting."
date: "2026-08-23"
category: "dsa-patterns"
tags: ["minimum-number-of-operations-to-make-string-sorted", "hash-table", "math", "string", "hard"]
---

# How to Solve Minimum Number of Operations to Make String Sorted

This problem asks us to count how many times we need to apply a specific operation to transform a given string into a sorted (ascending) string. The operation is essentially finding the next lexicographically smaller permutation and applying it. What makes this problem tricky is that directly simulating the operations would be impossibly slow for strings up to 3000 characters long, requiring us to find a mathematical relationship between the string and its position in the sorted permutation order.

## Visual Walkthrough

Let's trace through a small example: `s = "cba"`

**Step 1:** The sorted version of "cba" is "abc". We need to count how many operations transform "cba" → "abc".

**Step 2:** Understanding the operation:

1. Find largest `i` where `s[i] < s[i-1]` (first decreasing from right)
2. Find largest `j ≥ i` where `s[j] < s[i-1]`
3. Swap `s[i-1]` and `s[j]`
4. Reverse `s[i:]`

For "cba":

- `i = 1` (since 'b' < 'c' at position 1)
- `j = 2` (since 'a' < 'c' at position 2)
- Swap 'c' and 'a': "cba" → "abc"
- Reverse from i=1: "abc" → "abc"

This takes 1 operation. But what if we had "bac"?

**For "bac":**
Operation 1: "bac" → "acb" (swap 'b' and 'a', reverse "bc" → "cb")
Operation 2: "acb" → "abc" (swap 'c' and 'b', reverse "b" → "b")
Total: 2 operations

The key insight: Each operation moves the string one step backward in lexicographic order. So the number of operations equals the number of lexicographically smaller permutations!

## Brute Force Approach

A naive approach would be to:

1. Generate all permutations of the string
2. Sort them lexicographically
3. Find the index of our input string
4. That index equals the number of operations needed

However, for a string of length `n`, there are `n!` permutations. Even for `n=10`, that's 3.6 million permutations. The problem allows `n=3000`, making this approach completely infeasible.

The brute force fails because:

- Generating all permutations is O(n!) time complexity
- Storing them is O(n! × n) space complexity
- For n=3000, this is astronomically large

## Optimized Approach

The key insight is that we can calculate the position of a string in sorted order without generating all permutations using combinatorics. For each position `i` in the string:

1. Count how many characters to the right of position `i` are smaller than `s[i]`
2. Calculate how many permutations would have a smaller character at position `i`
3. Multiply by the number of ways to arrange the remaining characters
4. Sum these values across all positions

Mathematically, for position `i`:

- Let `count[c]` be the frequency of character `c` in `s[i+1:]`
- For each character `ch` smaller than `s[i]`, the number of permutations starting with `ch` at position `i` is:
  ```
  (n-i-1)! / (count[a]! × count[b]! × ...)
  ```
  where we decrement `count[ch]` by 1 in the denominator

We need to compute this efficiently using:

- Factorials modulo MOD (since results can be huge)
- Modular inverses for division
- Fenwick Tree or similar to count smaller characters to the right

## Optimal Solution

The solution uses combinatorics with modular arithmetic. We precompute factorials and inverse factorials, then for each position, count how many smaller characters are to the right and calculate the number of permutations they would generate.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
class Solution:
    def makeStringSorted(self, s: str) -> int:
        MOD = 10**9 + 7
        n = len(s)

        # Precompute factorials and inverse factorials modulo MOD
        fact = [1] * (n + 1)
        inv_fact = [1] * (n + 1)

        for i in range(2, n + 1):
            fact[i] = fact[i-1] * i % MOD

        # Fermat's little theorem for modular inverse
        inv_fact[n] = pow(fact[n], MOD-2, MOD)
        for i in range(n-1, -1, -1):
            inv_fact[i] = inv_fact[i+1] * (i+1) % MOD

        # Count frequencies of each character (a-z)
        freq = [0] * 26
        for ch in s:
            freq[ord(ch) - ord('a')] += 1

        result = 0

        # Process each character position
        for i in range(n):
            # Current character
            current = ord(s[i]) - ord('a')

            # Count how many characters smaller than current are to the right
            smaller_count = 0
            for ch in range(current):
                smaller_count += freq[ch]

            # Calculate number of permutations with smaller character at this position
            if smaller_count > 0:
                # Start with (n-i-1)! / (product of factorials of remaining frequencies)
                permutations = fact[n-i-1]
                for f in freq:
                    permutations = permutations * inv_fact[f] % MOD

                # Multiply by count of smaller characters
                result = (result + smaller_count * permutations) % MOD

            # Decrease frequency of current character for next iteration
            freq[current] -= 1

        return result
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * @param {string} s
 * @return {number}
 */
var makeStringSorted = function (s) {
  const MOD = 1000000007n; // Use BigInt for safety
  const n = s.length;

  // Precompute factorials and inverse factorials
  const fact = new Array(n + 1).fill(1n);
  const invFact = new Array(n + 1).fill(1n);

  for (let i = 2; i <= n; i++) {
    fact[i] = (fact[i - 1] * BigInt(i)) % MOD;
  }

  // Modular inverse using Fermat's little theorem
  invFact[n] = modPow(fact[n], MOD - 2n);
  for (let i = n - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD;
  }

  // Count character frequencies (a-z)
  const freq = new Array(26).fill(0);
  for (let i = 0; i < n; i++) {
    freq[s.charCodeAt(i) - 97]++;
  }

  let result = 0n;

  // Process each character
  for (let i = 0; i < n; i++) {
    const current = s.charCodeAt(i) - 97;

    // Count smaller characters to the right
    let smallerCount = 0n;
    for (let ch = 0; ch < current; ch++) {
      smallerCount += BigInt(freq[ch]);
    }

    if (smallerCount > 0) {
      // Calculate permutations = (n-i-1)! / (∏ freq[ch]!)
      let permutations = fact[n - i - 1];
      for (let f of freq) {
        permutations = (permutations * invFact[f]) % MOD;
      }

      // Add contributions from all smaller characters
      result = (result + smallerCount * permutations) % MOD;
    }

    // Remove current character from frequency count
    freq[current]--;
  }

  return Number(result);

  // Helper function for modular exponentiation
  function modPow(base, exp) {
    let result = 1n;
    base %= MOD;
    while (exp > 0) {
      if (exp & 1n) {
        result = (result * base) % MOD;
      }
      base = (base * base) % MOD;
      exp >>= 1n;
    }
    return result;
  }
};
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    private static final int MOD = 1_000_000_007;

    public int makeStringSorted(String s) {
        int n = s.length();

        // Precompute factorials and inverse factorials
        long[] fact = new long[n + 1];
        long[] invFact = new long[n + 1];
        fact[0] = 1;
        invFact[0] = 1;

        for (int i = 1; i <= n; i++) {
            fact[i] = (fact[i-1] * i) % MOD;
        }

        // Modular inverse using Fermat's little theorem
        invFact[n] = modPow(fact[n], MOD - 2);
        for (int i = n - 1; i >= 0; i--) {
            invFact[i] = (invFact[i+1] * (i+1)) % MOD;
        }

        // Count character frequencies
        int[] freq = new int[26];
        for (char c : s.toCharArray()) {
            freq[c - 'a']++;
        }

        long result = 0;

        for (int i = 0; i < n; i++) {
            int current = s.charAt(i) - 'a';

            // Count smaller characters to the right
            long smallerCount = 0;
            for (int ch = 0; ch < current; ch++) {
                smallerCount += freq[ch];
            }

            if (smallerCount > 0) {
                // Calculate permutations with smaller character at position i
                long permutations = fact[n - i - 1];
                for (int f : freq) {
                    permutations = (permutations * invFact[f]) % MOD;
                }

                // Add contribution from all smaller characters
                result = (result + smallerCount % MOD * permutations) % MOD;
            }

            // Remove current character from remaining counts
            freq[current]--;
        }

        return (int) result;
    }

    // Modular exponentiation helper
    private long modPow(long base, int exp) {
        long result = 1;
        base %= MOD;
        while (exp > 0) {
            if ((exp & 1) == 1) {
                result = (result * base) % MOD;
            }
            base = (base * base) % MOD;
            exp >>= 1;
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 26) = O(n)

- We iterate through the string once: O(n)
- For each position, we count smaller characters: O(26) constant time
- Precomputing factorials: O(n)
- Total: O(n + 26n) = O(n)

**Space Complexity:** O(n)

- Factorial arrays: O(n)
- Frequency array: O(26) = O(1)
- Total: O(n)

The 26 comes from the alphabet size (a-z). If the character set were larger, we could use a Fenwick Tree to count smaller characters in O(log k) time, where k is the alphabet size.

## Common Mistakes

1. **Forgetting modular arithmetic:** The number of permutations grows extremely fast. Without modulo operations, integers overflow even for moderate string lengths. Always apply MOD after each multiplication.

2. **Incorrect factorial/inverse computation:** The denominator in our permutation formula requires modular division, which we handle by multiplying with modular inverses. Using regular division or computing inverses incorrectly will give wrong results.

3. **Not updating frequencies correctly:** After processing position `i`, we must decrement `freq[current]` because that character is no longer available for positions to the right. Forgetting this leads to counting invalid permutations.

4. **Off-by-one errors in factorial indices:** Remember that for position `i`, we're arranging `n-i-1` remaining characters, not `n-i`. The -1 accounts for the current position being fixed.

## When You'll See This Pattern

This combinatorial counting pattern appears in several problems:

1. **LeetCode 60. Permutation Sequence** - Find the k-th permutation sequence. Similar combinatorial reasoning to determine each character position.
2. **LeetCode 1830. Minimum Number of Operations to Make String Sorted** - This is literally the same problem!
3. **LeetCode 1643. Kth Smallest Instructions** - Count paths using combinatorics with repeated characters.
4. **LeetCode 1416. Restore The Array** - Counting ways using combinatorial methods with constraints.

These problems all involve counting arrangements or sequences without generating them, using factorials and combinatorial formulas with modular arithmetic.

## Key Takeaways

1. **Combinatorial counting beats enumeration:** When asked to count permutations or arrangements, look for combinatorial formulas instead of generating all possibilities. Factorials and binomial coefficients are your friends.

2. **Modular arithmetic is essential for counting problems:** Large counts in programming problems usually require modulo operations. Remember Fermat's Little Theorem for modular inverses when the modulus is prime.

3. **Break problems into independent contributions:** The insight that each position's contribution can be calculated independently and summed is powerful. Look for ways to decompose problems into smaller, independent subproblems.

[Practice this problem on CodeJeet](/problem/minimum-number-of-operations-to-make-string-sorted)
