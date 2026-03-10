---
title: "How to Solve Minimum Time to Revert Word to Initial State I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Time to Revert Word to Initial State I. Medium difficulty, 42.3% acceptance rate. Topics: String, Rolling Hash, String Matching, Hash Function."
date: "2029-09-02"
category: "dsa-patterns"
tags:
  [
    "minimum-time-to-revert-word-to-initial-state-i",
    "string",
    "rolling-hash",
    "string-matching",
    "medium",
  ]
---

# How to Solve Minimum Time to Revert Word to Initial State I

This problem asks us to find the minimum number of seconds needed for a string `word` to return to its original state when we repeatedly remove the first `k` characters and add any `k` characters to the end. The tricky part is that we can add _any_ characters, not necessarily the ones we removed, which means we can strategically choose characters to accelerate the reversion process. The core challenge is recognizing that this is essentially a string matching problem where we need to find how quickly the suffix can match the prefix after repeated truncations.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `word = "abacaba"` and `k = 3`.

**Initial state:** `"abacaba"`

**Second 1:**

- Remove first 3 characters: `"abacaba"` → `"caba"`
- Add any 3 characters: We want to revert to the original state as quickly as possible, so we should add characters that match the original string. The original string starts with `"aba"`, so we add `"aba"` to get `"caba" + "aba" = "cabaaba"`

**Second 2:**

- Remove first 3 characters: `"cabaaba"` → `"aaba"`
- Add any 3 characters: The original string's next 3 characters after position 3 are `"cab"`, so we add `"cab"` to get `"aaba" + "cab" = "aabacab"`

**Second 3:**

- Remove first 3 characters: `"aabacab"` → `"acab"`
- Add any 3 characters: The original string's next 3 characters after position 6 are `"a"` (but we need 3, so we look at the original string cyclically). Actually, we've reached the end of the original string, so we need to think differently.

Wait, let's reconsider. The key insight is that after `t` seconds, we've removed `t*k` characters from the front. For the string to be back to its original state, the remaining suffix (starting at position `t*k`) must match the prefix of the original string. Why? Because if the suffix matches the prefix, we can add the next part of the original string to complete it.

More formally: After `t` operations, the current string is `word[t*k:] + X` where `X` is what we added in the last operation. For the string to equal the original `word`, we need `word[t*k:]` to be a prefix of `word`. Then we can set `X` to be `word[len(word[t*k:]):]` (the remaining part).

Let's check with our example:

- `word = "abacaba"`, `k = 3`
- Try `t = 1`: `word[3:] = "caba"`. Is `"caba"` a prefix of `"abacaba"`? No.
- Try `t = 2`: `word[6:] = "a"`. Is `"a"` a prefix of `"abacaba"`? Yes!
- So after 2 seconds, we have `"a"` remaining. We need to add 3 characters to make the full original string. The original string is `"abacaba"`, and we have `"a"`, so we need to add `"bac"` (wait, that's not right...)

Actually, we need `word[t*k:]` to equal `word[0:len(word)-t*k]`. Let me recalculate:

- `t = 2`: `t*k = 6`, `word[6:] = "a"`, length = 1
- We need `word[0:1] = "a"`. Yes, they match!
- So after removing 6 characters, we have `"a"` left, which matches the first character of the original. We then add `k=3` characters. The original string after position 1 is `"bacaba"`, but we only need 3 characters to fill up to length 7. Actually, we need to add characters to make the string length 7 again. The current length is 1, we add 3 to get 4, not 7. Hmm...

I see the issue. Each second we remove `k` AND add `k`, so the length stays constant at `n`. So after `t` seconds:

- First `t*k` characters have been removed from original
- Last `t*k` characters are ones we added
- Middle `n - t*k` characters are from the original suffix

For the string to equal original, the middle part `word[t*k:]` must equal `word[:n-t*k]`.

Let's verify:

- `n = 7`, `k = 3`
- `t = 1`: `t*k = 3`, `word[3:] = "caba"`, `word[:4] = "abac"`. Not equal.
- `t = 2`: `t*k = 6`, `word[6:] = "a"`, `word[:1] = "a"`. Equal!
- So `t = 2` works.

Thus the answer is 2 seconds.

## Brute Force Approach

The brute force approach would be to simulate the process for increasing values of `t` until we find one that works. For each `t`:

1. Check if `word[t*k:]` equals `word[:n-t*k]`
2. If yes, return `t`
3. Otherwise, continue to next `t`

The maximum possible `t` is `ceil(n/k)` because after that many operations, we would have removed more than `n` characters.

However, comparing strings directly takes O(n) time for each `t`, and we might check up to O(n/k) values of `t`, giving us O(n²/k) time complexity, which is O(n²) in worst case when k=1. This is too slow for n up to 10⁵.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def brute_force(word, k):
    n = len(word)
    max_t = (n + k - 1) // k  # ceil(n/k)

    for t in range(1, max_t + 1):
        removed_chars = t * k
        if removed_chars >= n:
            # After removing all characters, we can rebuild from scratch
            return t

        suffix = word[removed_chars:]
        prefix = word[:n - removed_chars]

        if suffix == prefix:
            return t

    return max_t  # Worst case: rebuild entire string
```

```javascript
// Time: O(n²) | Space: O(1)
function bruteForce(word, k) {
  const n = word.length;
  const maxT = Math.ceil(n / k);

  for (let t = 1; t <= maxT; t++) {
    const removedChars = t * k;
    if (removedChars >= n) {
      // After removing all characters, we can rebuild from scratch
      return t;
    }

    const suffix = word.substring(removedChars);
    const prefix = word.substring(0, n - removedChars);

    if (suffix === prefix) {
      return t;
    }
  }

  return maxT; // Worst case: rebuild entire string
}
```

```java
// Time: O(n²) | Space: O(1)
public int bruteForce(String word, int k) {
    int n = word.length();
    int maxT = (n + k - 1) / k;  // ceil(n/k)

    for (int t = 1; t <= maxT; t++) {
        int removedChars = t * k;
        if (removedChars >= n) {
            // After removing all characters, we can rebuild from scratch
            return t;
        }

        String suffix = word.substring(removedChars);
        String prefix = word.substring(0, n - removedChars);

        if (suffix.equals(prefix)) {
            return t;
        }
    }

    return maxT;  // Worst case: rebuild entire string
}
```

</div>

## Optimized Approach

The key insight is that we need to efficiently check for many suffix-prefix matches of varying lengths. Specifically, for each `t`, we need to check if `word[t*k:]` equals `word[:n-t*k]`. This is equivalent to checking if the suffix starting at position `t*k` matches the prefix of length `n-t*k`.

We can solve this efficiently using **rolling hash** (Rabin-Karp algorithm). The idea:

1. Precompute hash values for all prefixes of `word`
2. For each candidate `t`, compute the hash of `word[t*k:]` (suffix of length `n-t*k`) and compare it with the hash of `word[:n-t*k]`
3. If hashes match, we should still do a direct string comparison to handle collisions, but with a good hash function, collisions are rare

Alternatively, we can use **KMP preprocessing** (from the "Longest Happy Prefix" problem) to find the longest prefix that is also a suffix for various lengths. However, rolling hash is more straightforward for this problem since we need to check matches at specific positions (`t*k`).

The rolling hash approach:

- Compute prefix hashes: `hash[i]` = hash of `word[0:i]`
- To get hash of substring `word[l:r]`, use `hash[r] - hash[l] * pow[r-l]`
- For each `t`, compare hash of `word[t*k:n]` with hash of `word[0:n-t*k]`

## Optimal Solution

Here's the complete solution using rolling hash with a large prime modulus to minimize collisions:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumTimeToInitialState(word: str, k: int) -> int:
    n = len(word)

    # Base and modulus for rolling hash
    base = 131  # A prime number, commonly used
    mod = 10**9 + 7  # Large prime modulus

    # Precompute powers of base modulo mod
    pow_base = [1] * (n + 1)
    for i in range(1, n + 1):
        pow_base[i] = (pow_base[i-1] * base) % mod

    # Precompute prefix hashes
    prefix_hash = [0] * (n + 1)
    for i in range(n):
        prefix_hash[i+1] = (prefix_hash[i] * base + ord(word[i])) % mod

    # Helper function to get hash of substring word[l:r]
    def get_hash(l, r):
        # hash of word[l:r] = prefix_hash[r] - prefix_hash[l] * base^(r-l)
        hash_val = (prefix_hash[r] - prefix_hash[l] * pow_base[r-l]) % mod
        return hash_val if hash_val >= 0 else hash_val + mod

    # Check for each possible t
    max_t = (n + k - 1) // k  # ceil(n/k)
    for t in range(1, max_t + 1):
        removed_chars = t * k

        if removed_chars >= n:
            # If we've removed all characters, we can always rebuild
            return t

        # Length of the suffix that remains from original word
        suffix_len = n - removed_chars

        # Get hash of suffix starting at position removed_chars
        suffix_hash = get_hash(removed_chars, n)

        # Get hash of prefix of length suffix_len
        prefix_hash_val = get_hash(0, suffix_len)

        # If hashes match, do direct string comparison to be sure
        if suffix_hash == prefix_hash_val:
            # Direct comparison to handle hash collisions
            if word[removed_chars:] == word[:suffix_len]:
                return t

    # Worst case: need to rebuild entire string
    return max_t
```

```javascript
// Time: O(n) | Space: O(n)
function minimumTimeToInitialState(word, k) {
  const n = word.length;

  // Base and modulus for rolling hash
  const base = 131n; // Using BigInt to avoid overflow
  const mod = 1000000007n;

  // Precompute powers of base modulo mod
  const powBase = new Array(n + 1);
  powBase[0] = 1n;
  for (let i = 1; i <= n; i++) {
    powBase[i] = (powBase[i - 1] * base) % mod;
  }

  // Precompute prefix hashes
  const prefixHash = new Array(n + 1);
  prefixHash[0] = 0n;
  for (let i = 0; i < n; i++) {
    const charCode = BigInt(word.charCodeAt(i));
    prefixHash[i + 1] = (prefixHash[i] * base + charCode) % mod;
  }

  // Helper function to get hash of substring word[l:r]
  const getHash = (l, r) => {
    // hash of word[l:r] = prefixHash[r] - prefixHash[l] * base^(r-l)
    let hashVal = (prefixHash[r] - prefixHash[l] * powBase[r - l]) % mod;
    if (hashVal < 0n) hashVal += mod;
    return hashVal;
  };

  // Check for each possible t
  const maxT = Math.ceil(n / k);
  for (let t = 1; t <= maxT; t++) {
    const removedChars = t * k;

    if (removedChars >= n) {
      // If we've removed all characters, we can always rebuild
      return t;
    }

    // Length of the suffix that remains from original word
    const suffixLen = n - removedChars;

    // Get hash of suffix starting at position removedChars
    const suffixHash = getHash(removedChars, n);

    // Get hash of prefix of length suffixLen
    const prefixHashVal = getHash(0, suffixLen);

    // If hashes match, do direct string comparison to be sure
    if (suffixHash === prefixHashVal) {
      // Direct comparison to handle hash collisions
      if (word.substring(removedChars) === word.substring(0, suffixLen)) {
        return t;
      }
    }
  }

  // Worst case: need to rebuild entire string
  return maxT;
}
```

```java
// Time: O(n) | Space: O(n)
public int minimumTimeToInitialState(String word, int k) {
    int n = word.length();

    // Base and modulus for rolling hash
    final long base = 131L;
    final long mod = 1000000007L;

    // Precompute powers of base modulo mod
    long[] powBase = new long[n + 1];
    powBase[0] = 1L;
    for (int i = 1; i <= n; i++) {
        powBase[i] = (powBase[i-1] * base) % mod;
    }

    // Precompute prefix hashes
    long[] prefixHash = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefixHash[i+1] = (prefixHash[i] * base + word.charAt(i)) % mod;
    }

    // Helper function to get hash of substring word[l:r]
    // Using a private helper method
    java.util.function.BiFunction<Integer, Integer, Long> getHash = (l, r) -> {
        // hash of word[l:r] = prefixHash[r] - prefixHash[l] * base^(r-l)
        long hashVal = (prefixHash[r] - prefixHash[l] * powBase[r-l]) % mod;
        if (hashVal < 0) hashVal += mod;
        return hashVal;
    };

    // Check for each possible t
    int maxT = (n + k - 1) / k;  // ceil(n/k)
    for (int t = 1; t <= maxT; t++) {
        int removedChars = t * k;

        if (removedChars >= n) {
            // If we've removed all characters, we can always rebuild
            return t;
        }

        // Length of the suffix that remains from original word
        int suffixLen = n - removedChars;

        // Get hash of suffix starting at position removedChars
        long suffixHash = getHash.apply(removedChars, n);

        // Get hash of prefix of length suffixLen
        long prefixHashVal = getHash.apply(0, suffixLen);

        // If hashes match, do direct string comparison to be sure
        if (suffixHash == prefixHashVal) {
            // Direct comparison to handle hash collisions
            if (word.substring(removedChars).equals(word.substring(0, suffixLen))) {
                return t;
            }
        }
    }

    // Worst case: need to rebuild entire string
    return maxT;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- Computing powers of base: O(n)
- Computing prefix hashes: O(n)
- Checking each `t`: We check up to O(n/k) values of `t`, and each check takes O(1) time for hash comparison plus O(n) for the direct string comparison in the worst case when hashes match. However, the direct comparison only happens when we have a potential match, which happens at most once (when we find the answer). So amortized O(n/k) which is O(n) since k ≥ 1.

**Space Complexity:** O(n)

- We store arrays of size n+1 for `pow_base` and `prefix_hash`

## Common Mistakes

1. **Not handling the case when `t*k >= n`**: When we've removed all original characters, we can always add the original string back. Some candidates forget this edge case and continue checking beyond this point or return an incorrect value.

2. **Off-by-one errors in substring indices**: When computing `word[t*k:]` and `word[:n-t*k]`, it's easy to mess up the indices. Remember Python slicing is `[start:end]` where `end` is exclusive, while Java/JavaScript use `substring(start, end)` with `end` exclusive.

3. **Not using modulo arithmetic correctly in rolling hash**: When computing `(a - b) % mod`, if `a - b` is negative, we need to add `mod` to get a positive result. Many candidates forget this and get incorrect hash values.

4. **Assuming we can only add the characters we removed**: The problem says we can add _any_ characters, not necessarily the ones we removed. This is what allows us to accelerate the process by strategically choosing characters that match the original string.

## When You'll See This Pattern

The rolling hash technique used here appears in many string matching problems:

1. **Longest Happy Prefix (LeetCode 1392)**: Find the longest prefix that is also a suffix. This is essentially the same as checking if `word[i:]` matches `word[:n-i]` for various `i`.

2. **Repeated Substring Pattern (LeetCode 459)**: Check if a string can be formed by repeating a substring. This involves checking if prefixes match suffixes at specific intervals.

3. **Rabin-Karp String Matching Algorithm**: The rolling hash technique is the core of this algorithm for finding pattern occurrences in text.

The key pattern is when you need to compare many substrings or check for prefix-suffix matches efficiently without O(n) comparisons each time.

## Key Takeaways

1. **String reversion problems often reduce to prefix-suffix matching**: When you can arbitrarily choose characters to add, the optimal strategy is to match the remaining suffix with the original prefix.

2. **Rolling hash enables O(1) substring comparisons**: By precomputing prefix hashes and powers of the base, you can compute the hash of any substring in O(1) time, making it efficient to check many potential matches.

3. **Check edge cases systematically**: Always consider what happens when you remove all characters (t\*k ≥ n) and when k doesn't divide n evenly.

Related problems: [Longest Happy Prefix](/problem/longest-happy-prefix)
