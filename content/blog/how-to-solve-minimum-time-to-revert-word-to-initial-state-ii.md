---
title: "How to Solve Minimum Time to Revert Word to Initial State II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Time to Revert Word to Initial State II. Hard difficulty, 35.1% acceptance rate. Topics: String, Rolling Hash, String Matching, Hash Function."
date: "2026-03-15"
category: "dsa-patterns"
tags:
  [
    "minimum-time-to-revert-word-to-initial-state-ii",
    "string",
    "rolling-hash",
    "string-matching",
    "hard",
  ]
---

# How to Solve Minimum Time to Revert Word to Initial State II

This problem asks us to find the minimum number of seconds needed for a string `word` to return to its initial state when we repeatedly remove the first `k` characters and add any `k` characters to the end. The tricky part is that we can add _any_ characters, not necessarily the ones we removed, which means we can strategically choose characters to accelerate the reversion process. This creates an interesting optimization problem where we need to find the earliest point where the remaining suffix matches the prefix of the original word.

## Visual Walkthrough

Let's trace through an example: `word = "abacaba"`, `k = 3`.

**Initial state:** `"abacaba"`

**Second 1:**

- Remove first 3 chars: `"caba"` remains
- We need to add 3 chars to the end. We want to match the original word as quickly as possible.
- The original word starts with `"aba"`. Our current string ends with `"aba"` (the last 3 chars of `"caba"`).
- Wait, let's check: `"caba"` ends with `"aba"`, which matches the first 3 chars of the original word!
- So if we add `"cab"` (the next 3 chars from original), we get `"caba" + "cab" = "cabacab"`

**Second 2:**

- Remove first 3 chars: `"acab"` remains
- Check if current string `"acab"` equals the first 4 chars of original? No, `"abac"` ≠ `"acab"`
- But we only need to check if the _remaining_ string matches a _prefix_ of original
- `"acab"` vs original prefix of length 4: `"abac"` ≠ `"acab"`

**Let's think differently:** Actually, after each operation, we're left with a suffix of the original word. The question is: when does this suffix equal a prefix of the original word?

Original: `"abacaba"`
After 1st removal (remove `"aba"`): remaining `"caba"`

- Does `"caba"` equal first 4 chars of original? `"abac"` ≠ `"caba"`

After 2nd removal (remove `"cab"` from `"cabacab"`): remaining `"acab"`

- Does `"acab"` equal first 4 chars? `"abac"` ≠ `"acab"`

After 3rd removal (remove `"aca"` from `"acab???"`): We'd need to calculate...

This manual approach gets messy. The key insight: we need to find the smallest `i` (number of seconds) such that:

- After removing `i*k` characters from the front
- The remaining suffix of length `n - i*k` equals the prefix of the original word of the same length

For our example `"abacaba"`, `k=3`, `n=7`:

- `i=1`: Compare suffix of length 4 (`"caba"`) with prefix of length 4 (`"abac"`) → No match
- `i=2`: Compare suffix of length 1 (`"a"`) with prefix of length 1 (`"a"`) → Match!

So after 2 seconds, we have just `"a"` remaining, which equals the first character of the original word. We can then add characters to rebuild the original.

Thus, minimum time = 2 seconds.

## Brute Force Approach

The brute force approach would be to simulate the process for each possible number of seconds from 1 up to `n/k` (since we can't remove more characters than the word length). For each second `i`, we would:

1. Calculate how many characters remain: `remaining_len = n - i*k`
2. Check if the last `remaining_len` characters of the original word equal the first `remaining_len` characters
3. Return the smallest `i` where this is true

The naive string comparison would take O(n) time for each check, leading to O(n²/k) time complexity, which is too slow for the constraints (word length up to 10⁵).

```python
# Brute force - too slow for large inputs
def minimumTimeToInitialState_brute(word, k):
    n = len(word)
    # Try each possible number of seconds
    for i in range(1, n // k + 1):
        remaining_len = n - i * k
        # Check if suffix matches prefix
        if word[-remaining_len:] == word[:remaining_len]:
            return i
    # If no match found, we need to remove all characters
    return (n + k - 1) // k  # ceil(n/k)
```

The problem with this approach is the repeated string comparisons. Each `word[-remaining_len:] == word[:remaining_len]` creates new strings and compares them character by character, which is inefficient.

## Optimized Approach

The key insight is that we need to efficiently check if a suffix of the word equals a prefix of the same length. This is exactly what the **Longest Prefix Suffix (LPS)** array from the KMP algorithm helps us find!

However, we don't need the full KMP algorithm here. We can use **rolling hash** (Rabin-Karp) to compare substrings in O(1) time after O(n) preprocessing.

Here's the step-by-step reasoning:

1. We need to check for each `i` from 1 to `ceil(n/k)` whether:
   `word[n - (n - i*k):] == word[:n - i*k]`
   Simplified: `word[i*k:] == word[:n - i*k]`

2. But checking this directly for each `i` would be O(n²/k). We need O(1) comparisons.

3. Using rolling hash:
   - Precompute prefix hashes of the word
   - Precompute suffix hashes of the word
   - For any `i`, we can get hash of `word[:n-i*k]` (prefix) and `word[i*k:]` (suffix) in O(1)
   - Compare these hashes to check equality

4. We also need to handle hash collisions, so we either:
   - Use a large modulus and hope for no collisions (risky)
   - Use double hashing with two different moduli (safer)
   - Actually compare the strings when hashes match (guaranteed correct)

5. The algorithm:
   - Precompute prefix hashes
   - For `i` from 1 to `ceil(n/k)`:
     - `len = n - i*k`
     - If `len <= 0`: we've removed all characters, return `i`
     - Get hash of prefix `word[:len]`
     - Get hash of suffix `word[i*k:i*k+len]` (which is `word[i*k:]` since `len = n-i*k`)
     - If hashes match, return `i`

The rolling hash formula:

- `hash(s[l:r]) = (prefix_hash[r] - prefix_hash[l] * pow(base, r-l, mod)) % mod`

## Optimal Solution

Here's the complete solution using rolling hash with double hashing for collision safety:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumTimeToInitialState(word: str, k: int) -> int:
    n = len(word)

    # Double hashing for collision resistance
    MOD1 = 10**9 + 7
    MOD2 = 10**9 + 9
    BASE = 131  # A prime number larger than alphabet size

    # Precompute powers for rolling hash
    pow1 = [1] * (n + 1)
    pow2 = [1] * (n + 1)
    for i in range(1, n + 1):
        pow1[i] = (pow1[i-1] * BASE) % MOD1
        pow2[i] = (pow2[i-1] * BASE) % MOD2

    # Precompute prefix hashes
    pref1 = [0] * (n + 1)
    pref2 = [0] * (n + 1)
    for i in range(n):
        val = ord(word[i]) - ord('a') + 1
        pref1[i+1] = (pref1[i] * BASE + val) % MOD1
        pref2[i+1] = (pref2[i] * BASE + val) % MOD2

    # Helper function to get hash of substring [l, r) in O(1)
    def get_hash(l, r, mod, pref, pow_arr):
        # hash(s[l:r]) = pref[r] - pref[l] * BASE^(r-l)
        hash_val = (pref[r] - pref[l] * pow_arr[r-l]) % mod
        return hash_val if hash_val >= 0 else hash_val + mod

    # Check for each possible second
    for i in range(1, (n + k - 1) // k + 1):  # ceil(n/k) iterations
        remaining_len = n - i * k

        # If we've removed all characters or more
        if remaining_len <= 0:
            return i

        # Get hash of prefix [0, remaining_len)
        prefix_hash1 = get_hash(0, remaining_len, MOD1, pref1, pow1)
        prefix_hash2 = get_hash(0, remaining_len, MOD2, pref2, pow2)

        # Get hash of suffix starting at i*k, length remaining_len
        suffix_hash1 = get_hash(i * k, i * k + remaining_len, MOD1, pref1, pow1)
        suffix_hash2 = get_hash(i * k, i * k + remaining_len, MOD2, pref2, pow2)

        # If both hashes match, we found the minimum time
        if prefix_hash1 == suffix_hash1 and prefix_hash2 == suffix_hash2:
            # Double-check with actual string comparison to handle hash collisions
            if word[:remaining_len] == word[i*k:i*k+remaining_len]:
                return i

    # Worst case: remove all characters
    return (n + k - 1) // k
```

```javascript
// Time: O(n) | Space: O(n)
function minimumTimeToInitialState(word, k) {
  const n = word.length;

  // Double hashing for collision resistance
  const MOD1 = 1000000007n;
  const MOD2 = 1000000009n;
  const BASE = 131n;

  // Precompute powers for rolling hash
  const pow1 = new Array(n + 1).fill(1n);
  const pow2 = new Array(n + 1).fill(1n);
  for (let i = 1; i <= n; i++) {
    pow1[i] = (pow1[i - 1] * BASE) % MOD1;
    pow2[i] = (pow2[i - 1] * BASE) % MOD2;
  }

  // Precompute prefix hashes
  const pref1 = new Array(n + 1).fill(0n);
  const pref2 = new Array(n + 1).fill(0n);
  for (let i = 0; i < n; i++) {
    const val = BigInt(word.charCodeAt(i) - "a".charCodeAt(0) + 1);
    pref1[i + 1] = (pref1[i] * BASE + val) % MOD1;
    pref2[i + 1] = (pref2[i] * BASE + val) % MOD2;
  }

  // Helper function to get hash of substring [l, r) in O(1)
  function getHash(l, r, mod, pref, powArr) {
    // hash(s[l:r]) = pref[r] - pref[l] * BASE^(r-l)
    const hashVal = (pref[r] - pref[l] * powArr[r - l]) % mod;
    return hashVal >= 0n ? hashVal : hashVal + mod;
  }

  // Check for each possible second
  for (let i = 1; i <= Math.ceil(n / k); i++) {
    const remainingLen = n - i * k;

    // If we've removed all characters or more
    if (remainingLen <= 0) {
      return i;
    }

    // Get hash of prefix [0, remainingLen)
    const prefixHash1 = getHash(0, remainingLen, MOD1, pref1, pow1);
    const prefixHash2 = getHash(0, remainingLen, MOD2, pref2, pow2);

    // Get hash of suffix starting at i*k, length remainingLen
    const suffixHash1 = getHash(i * k, i * k + remainingLen, MOD1, pref1, pow1);
    const suffixHash2 = getHash(i * k, i * k + remainingLen, MOD2, pref2, pow2);

    // If both hashes match, we found the minimum time
    if (prefixHash1 === suffixHash1 && prefixHash2 === suffixHash2) {
      // Double-check with actual string comparison to handle hash collisions
      if (word.substring(0, remainingLen) === word.substring(i * k, i * k + remainingLen)) {
        return i;
      }
    }
  }

  // Worst case: remove all characters
  return Math.ceil(n / k);
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minimumTimeToInitialState(String word, int k) {
        int n = word.length();

        // Double hashing for collision resistance
        final long MOD1 = 1_000_000_007L;
        final long MOD2 = 1_000_000_009L;
        final long BASE = 131L;

        // Precompute powers for rolling hash
        long[] pow1 = new long[n + 1];
        long[] pow2 = new long[n + 1];
        pow1[0] = 1;
        pow2[0] = 1;
        for (int i = 1; i <= n; i++) {
            pow1[i] = (pow1[i-1] * BASE) % MOD1;
            pow2[i] = (pow2[i-1] * BASE) % MOD2;
        }

        // Precompute prefix hashes
        long[] pref1 = new long[n + 1];
        long[] pref2 = new long[n + 1];
        for (int i = 0; i < n; i++) {
            long val = word.charAt(i) - 'a' + 1;
            pref1[i+1] = (pref1[i] * BASE + val) % MOD1;
            pref2[i+1] = (pref2[i] * BASE + val) % MOD2;
        }

        // Helper function to get hash of substring [l, r) in O(1)
        // Using array parameters to avoid copying
        long getHash(int l, int r, long mod, long[] pref, long[] powArr) {
            // hash(s[l:r]) = pref[r] - pref[l] * BASE^(r-l)
            long hashVal = (pref[r] - pref[l] * powArr[r-l]) % mod;
            return hashVal >= 0 ? hashVal : hashVal + mod;
        }

        // Check for each possible second
        for (int i = 1; i <= (n + k - 1) / k; i++) {  // ceil(n/k) iterations
            int remainingLen = n - i * k;

            // If we've removed all characters or more
            if (remainingLen <= 0) {
                return i;
            }

            // Get hash of prefix [0, remainingLen)
            long prefixHash1 = getHash(0, remainingLen, MOD1, pref1, pow1);
            long prefixHash2 = getHash(0, remainingLen, MOD2, pref2, pow2);

            // Get hash of suffix starting at i*k, length remainingLen
            long suffixHash1 = getHash(i * k, i * k + remainingLen, MOD1, pref1, pow1);
            long suffixHash2 = getHash(i * k, i * k + remainingLen, MOD2, pref2, pow2);

            // If both hashes match, we found the minimum time
            if (prefixHash1 == suffixHash1 && prefixHash2 == suffixHash2) {
                // Double-check with actual string comparison to handle hash collisions
                if (word.substring(0, remainingLen).equals(word.substring(i * k, i * k + remainingLen))) {
                    return i;
                }
            }
        }

        // Worst case: remove all characters
        return (n + k - 1) / k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- Precomputing powers: O(n)
- Precomputing prefix hashes: O(n)
- Main loop: O(ceil(n/k)) iterations, each with O(1) hash computations
- Total: O(n + n/k) = O(n) since n/k ≤ n

**Space Complexity:** O(n)

- We store:
  - pow1 and pow2 arrays: O(n) each
  - pref1 and pref2 arrays: O(n) each
  - Total: O(4n) = O(n)

The O(n) space is acceptable given the constraints (n ≤ 10⁵).

## Common Mistakes

1. **Off-by-one errors in substring indices:** When computing `remaining_len = n - i*k`, ensure it's non-negative. The substring comparison should be `word[i*k:i*k+remaining_len]`, not `word[i*k:]` (though they're equivalent when `remaining_len = n-i*k`).

2. **Forgetting to handle the case when k > n:** If `k > n`, we remove all characters in one operation, so answer should be 1. Our loop condition `(n + k - 1) // k` handles this correctly.

3. **Hash collisions without verification:** Using a single hash modulus can lead to collisions. Always use double hashing or verify with actual string comparison when hashes match.

4. **Incorrect rolling hash formula:** The formula `hash(s[l:r]) = (pref[r] - pref[l] * pow[r-l]) % mod` is critical. A common mistake is forgetting to multiply by the power or using wrong indices.

## When You'll See This Pattern

The rolling hash technique is essential for problems involving:

1. **Substring comparisons** where you need to compare many substrings efficiently
2. **Pattern matching** with sliding windows
3. **Palindrome checking** in substrings
4. **String periodicity** problems

Related problems:

- **Longest Happy Prefix** (LeetCode 1392): Directly uses the prefix-suffix matching concept
- **Repeated Substring Pattern** (LeetCode 459): Checks if a string can be constructed by repeating a substring
- **Rabin-Karp Algorithm** (pattern matching): The foundational algorithm for rolling hash

## Key Takeaways

1. **Rolling hash enables O(1) substring comparisons** after O(n) preprocessing. This is crucial when you need to compare many substrings of a string.

2. **Prefix-suffix matching problems often reduce to finding where a suffix equals a prefix** of certain lengths. Think about what remains after removals and what needs to match.

3. **Always handle hash collisions** in production code. Use double hashing or fall back to direct string comparison when hashes match.

4. **The worst case is removing all characters**, which takes `ceil(n/k)` seconds. This provides an upper bound for our search.

Related problems: [Longest Happy Prefix](/problem/longest-happy-prefix)
