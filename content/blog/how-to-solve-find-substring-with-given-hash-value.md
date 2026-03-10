---
title: "How to Solve Find Substring With Given Hash Value — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Substring With Given Hash Value. Hard difficulty, 26.0% acceptance rate. Topics: String, Sliding Window, Rolling Hash, Hash Function."
date: "2030-01-29"
category: "dsa-patterns"
tags: ["find-substring-with-given-hash-value", "string", "sliding-window", "rolling-hash", "hard"]
---

# How to Solve Find Substring With Given Hash Value

This problem asks us to find the first substring of length `k` in a string `s` whose hash value equals a given `hashValue`. The hash function is defined as: `hash(s, p, m) = (val(s[0]) * p⁰ + val(s[1]) * p¹ + ... + val(s[k-1]) * p^(k-1)) mod m`, where `val(c)` gives the 1-based position of a lowercase letter in the alphabet. The tricky part is that we need to find the **first** occurrence (starting from the end of the string) that matches the hash, and we must compute this efficiently for strings up to length 2×10⁵.

## Visual Walkthrough

Let's walk through an example: `s = "leetcode"`, `p = 7`, `m = 20`, `k = 2`, `hashValue = 0`.

First, understand the hash calculation:

- `val('a') = 1`, `val('b') = 2`, ..., `val('z') = 26`
- For substring `"le"`: `val('l')=12`, `val('e')=5`
- Hash = `(12 × 7⁰ + 5 × 7¹) mod 20 = (12 + 35) mod 20 = 47 mod 20 = 7`

But we need to find hash 0, so let's calculate all length-2 substrings from the **end**:

Working backwards from the end:

1. Last substring: `"de"` (positions 6-7)
   - `val('d')=4`, `val('e')=5`
   - Hash = `(4 × 7⁰ + 5 × 7¹) mod 20 = (4 + 35) mod 20 = 39 mod 20 = 19`

2. Next: `"od"` (positions 5-6)
   - `val('o')=15`, `val('d')=4`
   - Hash = `(15 × 7⁰ + 4 × 7¹) mod 20 = (15 + 28) mod 20 = 43 mod 20 = 3`

3. Next: `"co"` (positions 4-5)
   - `val('c')=3`, `val('o')=15`
   - Hash = `(3 × 7⁰ + 15 × 7¹) mod 20 = (3 + 105) mod 20 = 108 mod 20 = 8`

4. Next: `"tc"` (positions 3-4)
   - `val('t')=20`, `val('c')=3`
   - Hash = `(20 × 7⁰ + 3 × 7¹) mod 20 = (20 + 21) mod 20 = 41 mod 20 = 1`

5. Next: `"et"` (positions 2-3)
   - `val('e')=5`, `val('t')=20`
   - Hash = `(5 × 7⁰ + 20 × 7¹) mod 20 = (5 + 140) mod 20 = 145 mod 20 = 5`

6. Next: `"ee"` (positions 1-2)
   - `val('e')=5`, `val('e')=5`
   - Hash = `(5 × 7⁰ + 5 × 7¹) mod 20 = (5 + 35) mod 20 = 40 mod 20 = 0` ← Found it!

Since we're looking for the **first** occurrence from the end, we continue checking:

7. Next: `"le"` (positions 0-1)
   - Hash = 7 (calculated earlier)

The first substring from the end with hash 0 is `"ee"` at index 1. The key insight is that we need to process from the end because the problem asks for the first occurrence when checking from the end.

## Brute Force Approach

The naive solution would compute the hash for every substring of length `k`:

1. Generate all substrings of length `k` (there are `n-k+1` of them)
2. For each substring, compute the hash from scratch using the formula
3. Check if the hash equals `hashValue`
4. Track the first one found when iterating from the end

The problem with this approach is efficiency. Computing each hash from scratch takes O(k) time, and we have O(n) substrings, giving O(n×k) time complexity. With `n` up to 2×10⁵ and `k` potentially large, this is too slow.

Even if we precompute powers of `p`, we still need O(k) per substring. We need a way to compute the hash in O(1) time for each new substring.

## Optimized Approach

The key insight is to use a **rolling hash** technique. Notice that when we move from one substring to the next, most of the calculation stays the same. For example, when moving from `"de"` to `"od"` in our example:

- `"de"` hash = `(val('d') × p⁰ + val('e') × p¹) mod m`
- `"od"` hash = `(val('o') × p⁰ + val('d') × p¹) mod m`

If we process from the end (right to left), we can maintain the current hash and update it efficiently. Let's derive the formula:

When moving from substring ending at position `i` to substring ending at position `i-1`:

- Old substring: `s[i-k+1..i]`
- New substring: `s[i-k..i-1]`
- The new substring adds `s[i-k]` at the beginning and removes `s[i]` at the end

The hash update formula becomes:

```
new_hash = (old_hash - val(s[i]) × p^(k-1)) × p + val(s[i-k])
```

But we must handle modulo arithmetic carefully and work with negative numbers properly.

Actually, it's easier to process from left to right with a different formula, but the problem asks for the **first** occurrence from the end. So we should process from right to left and use this formula:

When moving left by one position:

- We remove the rightmost character's contribution
- Multiply the remaining by `p` (shifting all exponents up by 1)
- Add the new leftmost character

Mathematically:

```
hash(s[i-k+1..i]) = (val(s[i-k+1]) × p⁰ + ... + val(s[i]) × p^(k-1)) mod m
hash(s[i-k..i-1]) = (val(s[i-k]) × p⁰ + ... + val(s[i-1]) × p^(k-1)) mod m

We can compute:
hash(s[i-k..i-1]) = (hash(s[i-k+1..i]) - val(s[i]) × p^(k-1)) × p + val(s[i-k])
```

We need to handle modulo operations carefully to avoid negative values.

## Optimal Solution

We'll process the string from right to left:

1. First compute the hash of the last substring (positions `n-k` to `n-1`)
2. Check if it matches `hashValue`
3. Move left one position at a time, updating the hash using the rolling formula
4. Track the first (rightmost) substring with matching hash

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def subStrHash(self, s: str, power: int, modulo: int, k: int, hashValue: int) -> str:
    n = len(s)

    # Helper function to get character value (1-indexed)
    def val(c: str) -> int:
        return ord(c) - ord('a') + 1

    # Precompute power^k modulo modulo for efficient removal of last character
    # We need p^(k-1) mod m for the rolling hash update
    pk = 1
    for _ in range(k - 1):
        pk = (pk * power) % modulo

    # Step 1: Compute hash of the last substring (rightmost k characters)
    current_hash = 0
    # Start from the end of the last substring
    for i in range(n - k, n):
        # val(s[i]) * p^(i - (n-k)) mod modulo
        exponent = i - (n - k)
        current_hash = (current_hash + val(s[i]) * pow(power, exponent, modulo)) % modulo

    # Initialize result index (start of substring)
    result_index = n - k if current_hash == hashValue else -1

    # Step 2: Move left through the string, updating hash
    # We go from position n-k-1 down to 0
    for i in range(n - k - 1, -1, -1):
        # Remove the rightmost character (at position i+k)
        # Its contribution is val(s[i+k]) * p^(k-1) mod modulo
        right_char_val = val(s[i + k])
        # Subtract this contribution (add modulo to handle negative)
        current_hash = (current_hash - right_char_val * pk) % modulo

        # Multiply by p (shift all remaining terms)
        current_hash = (current_hash * power) % modulo

        # Add the new leftmost character (at position i)
        # Its contribution is val(s[i]) * p^0 = val(s[i])
        left_char_val = val(s[i])
        current_hash = (current_hash + left_char_val) % modulo

        # Check if this substring matches
        if current_hash == hashValue:
            result_index = i

    # Return the substring starting at result_index
    return s[result_index:result_index + k]
```

```javascript
// Time: O(n) | Space: O(1)
function subStrHash(s, power, modulo, k, hashValue) {
  const n = s.length;

  // Helper function to get character value (1-indexed)
  const val = (c) => c.charCodeAt(0) - "a".charCodeAt(0) + 1;

  // Precompute power^(k-1) modulo modulo
  let pk = 1;
  for (let i = 0; i < k - 1; i++) {
    pk = (pk * power) % modulo;
  }

  // Step 1: Compute hash of the last substring
  let currentHash = 0;
  for (let i = n - k; i < n; i++) {
    const exponent = i - (n - k);
    // Use modular exponentiation to avoid overflow
    let powerExp = 1;
    for (let j = 0; j < exponent; j++) {
      powerExp = (powerExp * power) % modulo;
    }
    currentHash = (currentHash + val(s[i]) * powerExp) % modulo;
  }

  // Initialize result index
  let resultIndex = currentHash === hashValue ? n - k : -1;

  // Step 2: Move left through the string
  for (let i = n - k - 1; i >= 0; i--) {
    // Remove rightmost character
    const rightCharVal = val(s[i + k]);
    // JavaScript's % can return negative, so we add modulo
    currentHash = (currentHash - ((rightCharVal * pk) % modulo) + modulo) % modulo;

    // Multiply by power
    currentHash = (currentHash * power) % modulo;

    // Add new leftmost character
    const leftCharVal = val(s[i]);
    currentHash = (currentHash + leftCharVal) % modulo;

    // Check if this substring matches
    if (currentHash === hashValue) {
      resultIndex = i;
    }
  }

  return s.substring(resultIndex, resultIndex + k);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public String subStrHash(String s, int power, int modulo, int k, int hashValue) {
        int n = s.length();

        // Helper function to get character value (1-indexed)
        // Inlined for efficiency
        // val(c) = c - 'a' + 1

        // Precompute power^(k-1) modulo modulo
        long pk = 1;
        for (int i = 0; i < k - 1; i++) {
            pk = (pk * power) % modulo;
        }

        // Step 1: Compute hash of the last substring
        long currentHash = 0;
        for (int i = n - k; i < n; i++) {
            int exponent = i - (n - k);
            // Use modular exponentiation
            long powerExp = 1;
            for (int j = 0; j < exponent; j++) {
                powerExp = (powerExp * power) % modulo;
            }
            int charVal = s.charAt(i) - 'a' + 1;
            currentHash = (currentHash + charVal * powerExp) % modulo;
        }

        // Initialize result index
        int resultIndex = (currentHash == hashValue) ? n - k : -1;

        // Step 2: Move left through the string
        for (int i = n - k - 1; i >= 0; i--) {
            // Remove rightmost character
            int rightCharVal = s.charAt(i + k) - 'a' + 1;
            // Handle negative modulo carefully
            currentHash = (currentHash - (rightCharVal * pk) % modulo + modulo) % modulo;

            // Multiply by power
            currentHash = (currentHash * power) % modulo;

            // Add new leftmost character
            int leftCharVal = s.charAt(i) - 'a' + 1;
            currentHash = (currentHash + leftCharVal) % modulo;

            // Check if this substring matches
            if (currentHash == hashValue) {
                resultIndex = i;
            }
        }

        return s.substring(resultIndex, resultIndex + k);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Precomputing `p^(k-1) mod m` takes O(k) time
- Computing the initial hash of the last substring takes O(k) time
- The main loop iterates O(n) times, with O(1) operations per iteration
- Total: O(n + k) = O(n) since k ≤ n

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables like `current_hash`, `pk`, `result_index`, etc.
- No additional data structures that scale with input size

## Common Mistakes

1. **Processing from the wrong direction**: The problem asks for the "first" substring from the end. If you process left to right and take the first match, you'll get the wrong answer. Always process right to left and update your result whenever you find a match.

2. **Incorrect rolling hash formula**: The update formula is tricky:
   - For right-to-left processing: `new_hash = (old_hash - right_char × p^(k-1)) × p + left_char`
   - For left-to-right processing (if the problem asked for first from start): `new_hash = (old_hash - left_char × p^(k-1)) × p + right_char`
     Mixing these up will give wrong hashes.

3. **Modulo arithmetic with negative numbers**: In many languages, `-3 % 5 = -3` instead of `2`. Always add the modulo before taking modulo when subtracting: `(a - b) % m` should be `(a - b % m + m) % m`.

4. **Integer overflow**: Even with modulo, intermediate calculations can overflow 32-bit integers. Use 64-bit integers (long in Java/JavaScript, normal int in Python handles big integers).

## When You'll See This Pattern

The rolling hash technique is common in string problems where you need to compare or find substrings efficiently:

1. **Distinct Echo Substrings (Hard)**: Find all substrings that can be written as `t + t` (concatenation of two identical strings). Rolling hash helps quickly compare halves of substrings.

2. **Longest Duplicate Substring (Hard)**: Find the longest substring that appears at least twice. Rolling hash enables binary search + hash set approach.

3. **Rabin-Karp Algorithm**: The classic string searching algorithm uses rolling hash to find pattern occurrences in text in O(n+m) average time.

The pattern to recognize: when you need to process many overlapping substrings of fixed length, and direct comparison or computation would be O(k) per substring, consider if a rolling hash can reduce it to O(1) updates.

## Key Takeaways

1. **Rolling hash enables O(1) substring hash updates**: When moving from one substring to the next overlapping substring, you can update the hash in constant time instead of recomputing from scratch.

2. **Direction matters for "first occurrence"**: Always check whether the problem wants the first occurrence from the start or end, and process in the appropriate direction.

3. **Handle modulo arithmetic carefully**: With subtraction and negative numbers, always add the modulus before taking modulo to ensure non-negative results.

Related problems: [Distinct Echo Substrings](/problem/distinct-echo-substrings)
