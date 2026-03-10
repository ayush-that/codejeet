---
title: "How to Solve Distinct Echo Substrings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Distinct Echo Substrings. Hard difficulty, 53.0% acceptance rate. Topics: String, Trie, Rolling Hash, Hash Function."
date: "2029-10-07"
category: "dsa-patterns"
tags: ["distinct-echo-substrings", "string", "trie", "rolling-hash", "hard"]
---

## How to Solve Distinct Echo Substrings

This problem asks us to count all distinct substrings of a given string that can be expressed as the concatenation of a string with itself (like "abcabc" where "abc" + "abc"). The challenge lies in efficiently finding all such "echo" substrings while avoiding duplicates, especially since the string length can be up to 2000 characters.

## Visual Walkthrough

Let's trace through the example `text = "abcabcabc"`:

We need to find all substrings that can be written as `a + a`. Let's look for patterns:

1. **Length 2**: Must be like "aa", "bb", etc.
   - "ab" ❌, "bc" ❌, "ca" ❌, "ab" ❌, "bc" ❌, "ca" ❌, "ab" ❌, "bc" ❌
   - No matches

2. **Length 4**: Must be like "abab", "bcbc", etc.
   - "abca" ❌ (abc vs a? No)
   - "bcab" ❌
   - "cabc" ❌
   - "abca" ❌
   - "bcab" ❌
   - "cabc" ❌
   - Wait, we need to check all substrings of length 4 where first half = second half
   - "abca": "ab" ≠ "ca" ❌
   - "bcab": "bc" ≠ "ab" ❌
   - "cabc": "ca" ≠ "bc" ❌
   - "abca": "ab" ≠ "ca" ❌
   - "bcab": "bc" ≠ "ab" ❌
   - "cabc": "ca" ≠ "bc" ❌
   - No matches

3. **Length 6**: Must be like "abcabc", "bcabca", etc.
   - "abcabc": "abc" = "abc" ✅ (found "abcabc")
   - "bcabca": "bca" = "bca" ✅ (found "bcabca")
   - "cabcab": "cab" = "cab" ✅ (found "cabcab")
   - "abcabc": duplicate of first
   - Total distinct: 3

4. **Length 8**: Must be like "abcabcab"
   - "abcabcab": "abca" ≠ "bcab" ❌
   - "bcabcabc": "bcab" ≠ "cabc" ❌
   - No matches

The key insight: For a substring to be an echo, it must have even length, and the first half must equal the second half. We need to check all possible even-length substrings efficiently.

## Brute Force Approach

The most straightforward approach is to:

1. Generate all possible substrings
2. For each substring with even length, check if first half equals second half
3. Add valid substrings to a set to handle duplicates

<div class="code-group">

```python
# Brute Force Solution - Too Slow!
# Time: O(n³) | Space: O(n²)
def distinctEchoSubstrings_brute(text):
    n = len(text)
    result = set()

    # Try all possible starting positions
    for i in range(n):
        # Try all possible ending positions (must be even length)
        for j in range(i + 2, n + 1, 2):  # Step by 2 for even length
            length = j - i
            mid = i + length // 2

            # Check if first half equals second half
            if text[i:mid] == text[mid:j]:
                result.add(text[i:j])

    return len(result)
```

```javascript
// Brute Force Solution - Too Slow!
// Time: O(n³) | Space: O(n²)
function distinctEchoSubstringsBrute(text) {
  const n = text.length;
  const result = new Set();

  // Try all possible starting positions
  for (let i = 0; i < n; i++) {
    // Try all possible ending positions (must be even length)
    for (let j = i + 2; j <= n; j += 2) {
      // Step by 2 for even length
      const length = j - i;
      const mid = i + Math.floor(length / 2);

      // Check if first half equals second half
      if (text.substring(i, mid) === text.substring(mid, j)) {
        result.add(text.substring(i, j));
      }
    }
  }

  return result.size;
}
```

```java
// Brute Force Solution - Too Slow!
// Time: O(n³) | Space: O(n²)
public int distinctEchoSubstringsBrute(String text) {
    int n = text.length();
    Set<String> result = new HashSet<>();

    // Try all possible starting positions
    for (int i = 0; i < n; i++) {
        // Try all possible ending positions (must be even length)
        for (int j = i + 2; j <= n; j += 2) {  // Step by 2 for even length
            int length = j - i;
            int mid = i + length / 2;

            // Check if first half equals second half
            if (text.substring(i, mid).equals(text.substring(mid, j))) {
                result.add(text.substring(i, j));
            }
        }
    }

    return result.size();
}
```

</div>

**Why this is too slow:**

- Generating substrings: O(n²) possibilities
- Comparing strings: O(n) per comparison
- Total: O(n³) time complexity
- For n = 2000, this is ~8 billion operations, which is far too slow

## Optimized Approach

The key insight is that we don't need to compare entire substrings character by character. We can use **rolling hash** to compare substrings in O(1) time after preprocessing.

**Rolling Hash Technique:**

1. Precompute hash values for all prefixes of the string
2. Use these to compute hash of any substring in O(1) time
3. Compare substrings by comparing their hashes (with collision handling)

**Algorithm Steps:**

1. Precompute prefix hashes using a polynomial rolling hash
2. For each possible length L (even numbers from 2 to n)
3. For each starting position i where i + L ≤ n
4. Compute hash of first half (i to i+L/2-1) and second half (i+L/2 to i+L-1)
5. If hashes match, add the substring to a set
6. Handle potential hash collisions by double-checking with string comparison

**Why this works:**

- Rolling hash allows O(1) substring comparison after O(n) preprocessing
- We only need to store hashes, not actual substrings, until we find a match
- Using a large prime modulus minimizes collisions

## Optimal Solution

Here's the optimized solution using rolling hash:

<div class="code-group">

```python
# Optimal Solution using Rolling Hash
# Time: O(n²) | Space: O(n²)
def distinctEchoSubstrings(text):
    n = len(text)
    if n < 2:
        return 0

    # Constants for rolling hash
    base = 131  # A prime number, good for ASCII strings
    mod = 10**9 + 7  # Large prime to avoid overflow

    # Precompute powers of base for O(1) hash computation
    powers = [1] * (n + 1)
    for i in range(1, n + 1):
        powers[i] = (powers[i-1] * base) % mod

    # Precompute prefix hashes
    prefix_hash = [0] * (n + 1)
    for i in range(n):
        # Convert character to its ASCII value
        char_val = ord(text[i])
        # Update prefix hash: hash[i] = hash[i-1] * base + char_val
        prefix_hash[i+1] = (prefix_hash[i] * base + char_val) % mod

    # Helper function to get hash of substring [l, r) in O(1)
    def get_hash(l, r):
        # hash(l, r) = hash(r) - hash(l) * base^(r-l)
        hash_val = (prefix_hash[r] - prefix_hash[l] * powers[r-l]) % mod
        return hash_val if hash_val >= 0 else hash_val + mod

    result = set()

    # Try all possible even lengths
    for length in range(2, n + 1, 2):
        # Try all possible starting positions for this length
        for i in range(n - length + 1):
            mid = i + length // 2

            # Get hashes of both halves
            hash1 = get_hash(i, mid)
            hash2 = get_hash(mid, i + length)

            # If hashes match, we might have found an echo substring
            if hash1 == hash2:
                # Double-check to handle hash collisions
                if text[i:mid] == text[mid:i + length]:
                    # Store the actual substring to ensure distinctness
                    result.add(text[i:i + length])

    return len(result)
```

```javascript
// Optimal Solution using Rolling Hash
// Time: O(n²) | Space: O(n²)
function distinctEchoSubstrings(text) {
  const n = text.length;
  if (n < 2) return 0;

  // Constants for rolling hash
  const base = 131; // A prime number, good for ASCII strings
  const mod = 10 ** 9 + 7; // Large prime to avoid overflow

  // Precompute powers of base for O(1) hash computation
  const powers = new Array(n + 1).fill(1);
  for (let i = 1; i <= n; i++) {
    powers[i] = (powers[i - 1] * base) % mod;
  }

  // Precompute prefix hashes
  const prefixHash = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    // Convert character to its ASCII value
    const charVal = text.charCodeAt(i);
    // Update prefix hash: hash[i] = hash[i-1] * base + charVal
    prefixHash[i + 1] = (prefixHash[i] * base + charVal) % mod;
  }

  // Helper function to get hash of substring [l, r) in O(1)
  const getHash = (l, r) => {
    // hash(l, r) = hash(r) - hash(l) * base^(r-l)
    let hashVal = (prefixHash[r] - prefixHash[l] * powers[r - l]) % mod;
    return hashVal >= 0 ? hashVal : hashVal + mod;
  };

  const result = new Set();

  // Try all possible even lengths
  for (let length = 2; length <= n; length += 2) {
    // Try all possible starting positions for this length
    for (let i = 0; i <= n - length; i++) {
      const mid = i + length / 2;

      // Get hashes of both halves
      const hash1 = getHash(i, mid);
      const hash2 = getHash(mid, i + length);

      // If hashes match, we might have found an echo substring
      if (hash1 === hash2) {
        // Double-check to handle hash collisions
        if (text.substring(i, mid) === text.substring(mid, i + length)) {
          // Store the actual substring to ensure distinctness
          result.add(text.substring(i, i + length));
        }
      }
    }
  }

  return result.size;
}
```

```java
// Optimal Solution using Rolling Hash
// Time: O(n²) | Space: O(n²)
public int distinctEchoSubstrings(String text) {
    int n = text.length();
    if (n < 2) return 0;

    // Constants for rolling hash
    final int base = 131;  // A prime number, good for ASCII strings
    final int mod = 1_000_000_007;  // Large prime to avoid overflow

    // Precompute powers of base for O(1) hash computation
    long[] powers = new long[n + 1];
    powers[0] = 1;
    for (int i = 1; i <= n; i++) {
        powers[i] = (powers[i-1] * base) % mod;
    }

    // Precompute prefix hashes
    long[] prefixHash = new long[n + 1];
    for (int i = 0; i < n; i++) {
        // Convert character to its ASCII value
        int charVal = text.charAt(i);
        // Update prefix hash: hash[i] = hash[i-1] * base + charVal
        prefixHash[i+1] = (prefixHash[i] * base + charVal) % mod;
    }

    // Helper function to get hash of substring [l, r) in O(1)
    java.util.function.BiFunction<Integer, Integer, Long> getHash = (l, r) -> {
        // hash(l, r) = hash(r) - hash(l) * base^(r-l)
        long hashVal = (prefixHash[r] - prefixHash[l] * powers[r-l]) % mod;
        return hashVal >= 0 ? hashVal : hashVal + mod;
    };

    Set<String> result = new HashSet<>();

    // Try all possible even lengths
    for (int length = 2; length <= n; length += 2) {
        // Try all possible starting positions for this length
        for (int i = 0; i <= n - length; i++) {
            int mid = i + length / 2;

            // Get hashes of both halves
            long hash1 = getHash.apply(i, mid);
            long hash2 = getHash.apply(mid, i + length);

            // If hashes match, we might have found an echo substring
            if (hash1 == hash2) {
                // Double-check to handle hash collisions
                if (text.substring(i, mid).equals(text.substring(mid, i + length))) {
                    // Store the actual substring to ensure distinctness
                    result.add(text.substring(i, i + length));
                }
            }
        }
    }

    return result.size();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Precomputing powers and prefix hashes: O(n)
- Outer loop over even lengths: O(n/2) ≈ O(n)
- Inner loop over starting positions: O(n) per length
- Hash comparison: O(1) per substring
- String comparison (only when hashes match): O(n) but happens rarely
- Total: O(n²) in practice

**Space Complexity: O(n²)**

- Powers array: O(n)
- Prefix hash array: O(n)
- Result set: In worst case, could store O(n²) substrings if every even-length substring is an echo

## Common Mistakes

1. **Forgetting to handle hash collisions**: Rolling hash can produce false positives. Always double-check with actual string comparison when hashes match.

2. **Off-by-one errors in substring indices**: Remember that substring [l, r) includes l but excludes r. A common mistake is using `mid = i + length/2` without considering whether length/2 is integer division.

3. **Not checking for even length**: Echo substrings must have even length since they're concatenation of two equal strings. Forgetting this check wastes time on impossible candidates.

4. **Using inappropriate base or modulus**: Using base=26 (for lowercase letters only) fails with mixed case. Using small modulus increases collision probability. Always use a large prime modulus.

## When You'll See This Pattern

The rolling hash technique is essential for substring comparison problems:

1. **Find Substring With Given Hash Value (Hard)** - Direct application of rolling hash to compute substring hashes with given formula.

2. **Longest Duplicate Substring (Medium)** - Finding the longest repeating substring efficiently requires comparing many substrings.

3. **Repeated DNA Sequences (Medium)** - Finding repeated substrings of fixed length (10) in DNA sequences.

4. **Rabin-Karp Algorithm** - The classic string searching algorithm that uses rolling hash to find pattern in text in O(n+m) time.

## Key Takeaways

1. **Rolling hash enables O(1) substring comparison** after O(n) preprocessing, transforming O(n³) brute force to O(n²).

2. **Always handle hash collisions** by verifying with actual string comparison when hashes match.

3. **For concatenation problems**, consider the structure: echo substrings have even length and first half equals second half. This insight reduces the search space.

4. **Choose appropriate constants**: Use a prime base > alphabet size and a large prime modulus to minimize collisions.

Related problems: [Find Substring With Given Hash Value](/problem/find-substring-with-given-hash-value)
