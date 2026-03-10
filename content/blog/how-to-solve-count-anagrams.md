---
title: "How to Solve Count Anagrams — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Anagrams. Hard difficulty, 37.0% acceptance rate. Topics: Hash Table, Math, String, Combinatorics, Counting."
date: "2029-11-24"
category: "dsa-patterns"
tags: ["count-anagrams", "hash-table", "math", "string", "hard"]
---

# How to Solve Count Anagrams

This problem asks us to count how many distinct anagrams exist for a given string `s` where each word in the anagram must be a permutation of the corresponding word in the original string. The challenge lies in efficiently calculating permutations while avoiding overcounting duplicates, and handling large results modulo 10⁹+7. What makes this problem interesting is the combination of combinatorial mathematics with practical string manipulation—you need to understand both permutation formulas and how to implement them efficiently with modular arithmetic.

## Visual Walkthrough

Let's trace through a small example: `s = "aa b c"`

**Step 1: Split into words**
We get three words: `["aa", "b", "c"]`

**Step 2: Calculate permutations for each word**

- Word 1: `"aa"` has 2 characters with 'a' appearing twice
  - Total permutations = 2! / (2!) = 1 (since duplicates reduce permutations)
- Word 2: `"b"` has 1 character
  - Total permutations = 1! = 1
- Word 3: `"c"` has 1 character
  - Total permutations = 1! = 1

**Step 3: Multiply results**
Total anagrams = 1 × 1 × 1 = 1

Wait, that seems too simple. Let's try `s = "ab bc"`:

**Step 1: Split into words**
Words: `["ab", "bc"]`

**Step 2: Calculate permutations**

- Word 1: `"ab"` has characters 'a' and 'b' (both unique)
  - Permutations = 2! = 2 ("ab" and "ba")
- Word 2: `"bc"` has characters 'b' and 'c' (both unique)
  - Permutations = 2! = 2 ("bc" and "cb")

**Step 3: Multiply results**
Total anagrams = 2 × 2 = 4

The actual anagrams would be:

1. "ab bc" (original)
2. "ab cb"
3. "ba bc"
4. "ba cb"

This shows the pattern: for each word independently, we count its permutations, then multiply all word-level results together.

## Brute Force Approach

A naive approach would be to:

1. Split the string into words
2. For each word, generate all permutations
3. Count unique permutations for each word
4. Multiply the counts

The problem with this approach is combinatorial explosion. A word with `n` unique characters has `n!` permutations. For a 10-character word with all unique letters, that's 3,628,800 permutations! Generating all of them is computationally infeasible.

Even if we tried to calculate permutations mathematically without generating them, a naive implementation might:

- Calculate factorial for each word length
- For each character count, divide by factorial of that count
- Multiply results

But this has issues too: factorials grow extremely fast (100! has 158 digits), so we can't compute them directly even for moderately long words. We need modular arithmetic and efficient computation.

## Optimized Approach

The key insight is that for each word, the number of distinct permutations is given by the multinomial coefficient formula:

```
P = n! / (c1! × c2! × ... × ck!)
```

Where:

- `n` = length of the word
- `c1, c2, ..., ck` = counts of each distinct character

For the entire string, the total anagrams is the product of `P` for all words.

**Step-by-step reasoning:**

1. **Split the string** into individual words
2. **For each word:**
   - Count frequency of each character
   - Calculate `n! mod M` where M = 10⁹+7
   - Calculate product of factorials of all character counts
   - Use modular inverse to divide (since we're working modulo M)
3. **Multiply results** for all words
4. **Return final result modulo M**

The critical optimization is precomputing factorials up to the maximum word length, and their modular inverses. This allows O(1) lookup for factorial calculations instead of recomputing each time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = total characters, m = max word length
# Space: O(m) for factorial arrays
MOD = 10**9 + 7

class Solution:
    def countAnagrams(self, s: str) -> int:
        # Step 1: Precompute factorials and inverse factorials up to max length
        words = s.split()
        max_len = max(len(word) for word in words)

        # factorial[i] = i! mod MOD
        factorial = [1] * (max_len + 1)
        for i in range(2, max_len + 1):
            factorial[i] = (factorial[i-1] * i) % MOD

        # inv_factorial[i] = modular inverse of i! mod MOD
        inv_factorial = [1] * (max_len + 1)
        # Using Fermat's Little Theorem: a^(MOD-2) ≡ a^(-1) mod MOD
        inv_factorial[max_len] = pow(factorial[max_len], MOD-2, MOD)
        for i in range(max_len-1, -1, -1):
            inv_factorial[i] = (inv_factorial[i+1] * (i+1)) % MOD

        # Step 2: Process each word
        result = 1
        for word in words:
            n = len(word)

            # Count character frequencies
            freq = {}
            for ch in word:
                freq[ch] = freq.get(ch, 0) + 1

            # Calculate permutations for this word: n! / (c1! * c2! * ... * ck!)
            word_perms = factorial[n]
            for count in freq.values():
                word_perms = (word_perms * inv_factorial[count]) % MOD

            # Multiply with overall result
            result = (result * word_perms) % MOD

        return result
```

```javascript
// Time: O(n + m) where n = total characters, m = max word length
// Space: O(m) for factorial arrays
const MOD = 10 ** 9 + 7;

/**
 * @param {string} s
 * @return {number}
 */
var countAnagrams = function (s) {
  // Step 1: Split into words and find maximum length
  const words = s.split(" ");
  let maxLen = 0;
  for (const word of words) {
    maxLen = Math.max(maxLen, word.length);
  }

  // Step 2: Precompute factorials and inverse factorials
  const factorial = new Array(maxLen + 1).fill(1);
  for (let i = 2; i <= maxLen; i++) {
    factorial[i] = (factorial[i - 1] * i) % MOD;
  }

  const invFactorial = new Array(maxLen + 1).fill(1);
  // Modular inverse using Fermat's Little Theorem
  invFactorial[maxLen] = modPow(factorial[maxLen], MOD - 2);
  for (let i = maxLen - 1; i >= 0; i--) {
    invFactorial[i] = (invFactorial[i + 1] * (i + 1)) % MOD;
  }

  // Step 3: Process each word
  let result = 1;
  for (const word of words) {
    const n = word.length;

    // Count character frequencies
    const freq = new Map();
    for (const ch of word) {
      freq.set(ch, (freq.get(ch) || 0) + 1);
    }

    // Calculate permutations: n! / (c1! * c2! * ... * ck!)
    let wordPerms = factorial[n];
    for (const count of freq.values()) {
      wordPerms = (wordPerms * invFactorial[count]) % MOD;
    }

    // Multiply with overall result
    result = (result * wordPerms) % MOD;
  }

  return result;
};

// Helper function for modular exponentiation
function modPow(base, exp) {
  let result = 1;
  base %= MOD;
  while (exp > 0) {
    if (exp & 1) {
      result = (result * base) % MOD;
    }
    base = (base * base) % MOD;
    exp >>= 1;
  }
  return result;
}
```

```java
// Time: O(n + m) where n = total characters, m = max word length
// Space: O(m) for factorial arrays
class Solution {
    private static final int MOD = 1_000_000_007;

    public int countAnagrams(String s) {
        // Step 1: Split into words and find maximum length
        String[] words = s.split(" ");
        int maxLen = 0;
        for (String word : words) {
            maxLen = Math.max(maxLen, word.length());
        }

        // Step 2: Precompute factorials and inverse factorials
        long[] factorial = new long[maxLen + 1];
        factorial[0] = 1;
        for (int i = 1; i <= maxLen; i++) {
            factorial[i] = (factorial[i-1] * i) % MOD;
        }

        long[] invFactorial = new long[maxLen + 1];
        // Modular inverse using Fermat's Little Theorem
        invFactorial[maxLen] = modPow(factorial[maxLen], MOD - 2);
        for (int i = maxLen - 1; i >= 0; i--) {
            invFactorial[i] = (invFactorial[i+1] * (i+1)) % MOD;
        }

        // Step 3: Process each word
        long result = 1;
        for (String word : words) {
            int n = word.length();

            // Count character frequencies
            int[] freq = new int[26];
            for (char ch : word.toCharArray()) {
                freq[ch - 'a']++;
            }

            // Calculate permutations: n! / (c1! * c2! * ... * ck!)
            long wordPerms = factorial[n];
            for (int count : freq) {
                if (count > 0) {
                    wordPerms = (wordPerms * invFactorial[count]) % MOD;
                }
            }

            // Multiply with overall result
            result = (result * wordPerms) % MOD;
        }

        return (int) result;
    }

    // Helper method for modular exponentiation
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

**Time Complexity: O(n + m)**

- `n` = total number of characters in the input string
- `m` = length of the longest word
- Splitting the string: O(n)
- Building frequency maps: O(n)
- Precomputing factorials: O(m)
- Computing modular inverses: O(m)
- Overall: O(n + m)

**Space Complexity: O(m + A)**

- `m` = length of longest word (for factorial arrays)
- `A` = alphabet size (26 for lowercase English letters)
- Factorial arrays: O(m)
- Frequency maps: O(A) per word, but we process one at a time
- Overall: O(m + A) which simplifies to O(m) since m ≥ A in practice

## Common Mistakes

1. **Not using modular arithmetic for large factorials**: Even for words of length 20, 20! = 2.43×10¹⁸ which exceeds 32-bit integer limits. Always compute modulo 10⁹+7.

2. **Incorrectly computing modular division**: You can't just divide modulo M. You need to multiply by the modular inverse. Remember: `a / b mod M = a × b^(-1) mod M`, where `b^(-1)` is the modular inverse computed via Fermat's Little Theorem as `b^(M-2) mod M`.

3. **Forgetting duplicate characters**: The formula is `n! / (c1! × c2! × ... × ck!)`, not just `n!`. Words with repeated letters have fewer distinct permutations.

4. **Inefficient inverse computation**: Computing modular inverse for each factorial separately would be O(m log M) using fast exponentiation each time. The backward computation method shown above computes all inverses in O(m).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Combinatorial counting with modular arithmetic**: Similar to "Count Ways to Build Rooms in an Ant Colony" where you need to count permutations/combinations modulo a prime. The key technique is precomputing factorials and their modular inverses.

2. **Frequency-based anagram analysis**: Like "Group Anagrams" but with mathematical counting instead of actual grouping. Both problems rely on character frequency analysis.

3. **Multinomial coefficients**: Any problem involving counting distinct permutations of multisets uses this pattern. For example, counting distinct rearrangements of a string with duplicate letters.

4. **Modular inverse computation**: Problems requiring division under modulo prime constraints, like "Number of Good Ways to Split a String" or any counting problem with combinatorial formulas.

## Key Takeaways

1. **For permutation counting with duplicates**, use the multinomial formula: `n! / (c1! × c2! × ... × ck!)` where `ci` are character frequencies.

2. **When working modulo a prime**, use precomputed factorials and modular inverses for O(1) combinatorial calculations. Compute inverses backward for efficiency.

3. **Break complex problems into independent subproblems**: Here, each word's permutations are independent, so we can multiply results. This "divide and conquer" approach simplifies both reasoning and implementation.

4. **Always consider integer overflow** in counting problems. When numbers grow quickly (like factorials), use modular arithmetic from the start, not as an afterthought.

Related problems: [Group Anagrams](/problem/group-anagrams), [Count Ways to Build Rooms in an Ant Colony](/problem/count-ways-to-build-rooms-in-an-ant-colony)
