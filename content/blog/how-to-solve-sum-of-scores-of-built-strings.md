---
title: "How to Solve Sum of Scores of Built Strings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of Scores of Built Strings. Hard difficulty, 46.7% acceptance rate. Topics: String, Binary Search, Rolling Hash, Suffix Array, String Matching."
date: "2026-02-17"
category: "dsa-patterns"
tags: ["sum-of-scores-of-built-strings", "string", "binary-search", "rolling-hash", "hard"]
---

# How to Solve Sum of Scores of Built Strings

This problem asks us to compute the sum of scores for all strings `s_i` where `s_i` is the prefix of `s` of length `i`, and the score of `s_i` is the number of prefixes of `s_i` that are also suffixes of `s_i`. The tricky part is that we need to do this efficiently for a string `s` of length up to 10^5, where a naive O(n²) approach would be far too slow.

## Visual Walkthrough

Let's trace through `s = "ababa"` step by step:

1. **s₁ = "a"**
   - Prefixes: "a"
   - Suffixes: "a"
   - Score: 1 (only "a" is both prefix and suffix)

2. **s₂ = "ba"** (remember we prepend, so s₂ is the first 2 chars of original s)
   - Prefixes: "b", "ba"
   - Suffixes: "a", "ba"
   - Score: 1 (only "ba" matches)

3. **s₃ = "aba"**
   - Prefixes: "a", "ab", "aba"
   - Suffixes: "a", "ba", "aba"
   - Score: 2 ("a" and "aba" match)

4. **s₄ = "baba"**
   - Prefixes: "b", "ba", "bab", "baba"
   - Suffixes: "a", "ba", "aba", "baba"
   - Score: 2 ("ba" and "baba" match)

5. **s₅ = "ababa"**
   - Prefixes: "a", "ab", "aba", "abab", "ababa"
   - Suffixes: "a", "ba", "aba", "baba", "ababa"
   - Score: 3 ("a", "aba", and "ababa" match)

Total score = 1 + 1 + 2 + 2 + 3 = 9

Notice that for each sᵢ, we're essentially counting how many prefixes of sᵢ are also suffixes. This is equivalent to finding all border lengths of each prefix.

## Brute Force Approach

The most straightforward approach would be to:

1. For each i from 1 to n, consider the substring s[0:i]
2. For each possible prefix length j from 1 to i, check if s[0:j] == s[i-j:i]
3. Count all matches

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def sumScores_brute(s: str) -> int:
    n = len(s)
    total = 0

    for i in range(1, n + 1):  # O(n)
        current = s[:i]  # O(n) to slice
        score = 0

        for j in range(1, i + 1):  # O(n)
            prefix = current[:j]  # O(n) to slice
            suffix = current[i-j:i]  # O(n) to slice

            if prefix == suffix:  # O(n) to compare
                score += 1

        total += score

    return total
```

```javascript
// Time: O(n³) | Space: O(1)
function sumScoresBrute(s) {
  const n = s.length;
  let total = 0;

  for (let i = 1; i <= n; i++) {
    // O(n)
    const current = s.substring(0, i); // O(n)
    let score = 0;

    for (let j = 1; j <= i; j++) {
      // O(n)
      const prefix = s.substring(0, j); // O(n)
      const suffix = s.substring(i - j, i); // O(n)

      if (prefix === suffix) {
        // O(n)
        score++;
      }
    }

    total += score;
  }

  return total;
}
```

```java
// Time: O(n³) | Space: O(1)
public long sumScoresBrute(String s) {
    int n = s.length();
    long total = 0;

    for (int i = 1; i <= n; i++) {  // O(n)
        String current = s.substring(0, i);  // O(n)
        int score = 0;

        for (int j = 1; j <= i; j++) {  // O(n)
            String prefix = s.substring(0, j);  // O(n)
            String suffix = s.substring(i - j, i);  // O(n)

            if (prefix.equals(suffix)) {  // O(n)
                score++;
            }
        }

        total += score;
    }

    return total;
}
```

</div>

**Why this fails:** With n up to 10^5, O(n³) is impossibly slow (10^15 operations). Even with careful implementation avoiding string copies, checking each prefix-suffix pair would still be O(n²), which is 10^10 operations - still too slow.

## Optimized Approach

The key insight is that we can use the **Z-algorithm** (Z-function) to solve this efficiently. The Z-function z[i] gives the length of the longest substring starting at position i that is also a prefix of the string.

For our problem, we want to know for each prefix s[0:i], how many of its own prefixes are also suffixes. This is equivalent to finding all border lengths of each prefix. The Z-function helps because:

1. For the full string s, z[i] tells us how long the match is between s[0:] and s[i:]
2. For our problem, we need to consider each prefix s[0:j] and find matches with suffixes of that prefix
3. We can reverse the thinking: instead of checking each prefix, we can use the Z-function on the original string to find all matches

The trick is to realize that the score for sᵢ equals 1 plus the number of positions j where z[n-i+j] ≥ j. This comes from aligning the suffix of sᵢ with the prefix of the original string.

## Optimal Solution

We'll implement the Z-algorithm to compute the Z-function, then use it to calculate the total score.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def sumScores(s: str) -> int:
    n = len(s)

    # Step 1: Compute Z-function for the string
    # z[i] = length of longest substring starting at i that is also a prefix
    z = [0] * n
    l = r = 0  # [l, r) is the current Z-box (rightmost match)

    for i in range(1, n):
        # Case 1: i is outside current Z-box
        if i > r:
            l = r = i
            # Expand while characters match
            while r < n and s[r] == s[r - l]:
                r += 1
            z[i] = r - l
            r -= 1  # Adjust r back to last matching position
        # Case 2: i is inside current Z-box
        else:
            k = i - l  # Corresponding position in prefix

            # Case 2a: z[k] < remaining box length
            if z[k] < r - i + 1:
                z[i] = z[k]
            # Case 2b: z[k] >= remaining box length
            else:
                l = i  # Start new box from i
                while r < n and s[r] == s[r - l]:
                    r += 1
                z[i] = r - l
                r -= 1  # Adjust r back

    # Step 2: Calculate total score
    # The score for prefix of length i is 1 + count of z[n-i+j] >= j
    # But we can compute it more directly:
    # For each position i, z[i] contributes to scores of prefixes ending at i+z[i]-1
    total = n  # Each string has at least score 1 (the whole string itself)

    # Add contributions from all z-values
    for i in range(n):
        total += z[i]

    return total
```

```javascript
// Time: O(n) | Space: O(n)
function sumScores(s) {
  const n = s.length;

  // Step 1: Compute Z-function
  const z = new Array(n).fill(0);
  let l = 0,
    r = 0;

  for (let i = 1; i < n; i++) {
    // Case 1: i is outside current Z-box
    if (i > r) {
      l = r = i;
      while (r < n && s[r] === s[r - l]) {
        r++;
      }
      z[i] = r - l;
      r--;
    }
    // Case 2: i is inside current Z-box
    else {
      const k = i - l;

      // Case 2a: z[k] < remaining box length
      if (z[k] < r - i + 1) {
        z[i] = z[k];
      }
      // Case 2b: z[k] >= remaining box length
      else {
        l = i;
        while (r < n && s[r] === s[r - l]) {
          r++;
        }
        z[i] = r - l;
        r--;
      }
    }
  }

  // Step 2: Calculate total score
  let total = n; // Each string has at least score 1

  // Add contributions from all z-values
  for (let i = 0; i < n; i++) {
    total += z[i];
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(n)
public long sumScores(String s) {
    int n = s.length();

    // Step 1: Compute Z-function
    int[] z = new int[n];
    int l = 0, r = 0;

    for (int i = 1; i < n; i++) {
        // Case 1: i is outside current Z-box
        if (i > r) {
            l = r = i;
            while (r < n && s.charAt(r) == s.charAt(r - l)) {
                r++;
            }
            z[i] = r - l;
            r--;
        }
        // Case 2: i is inside current Z-box
        else {
            int k = i - l;

            // Case 2a: z[k] < remaining box length
            if (z[k] < r - i + 1) {
                z[i] = z[k];
            }
            // Case 2b: z[k] >= remaining box length
            else {
                l = i;
                while (r < n && s.charAt(r) == s.charAt(r - l)) {
                    r++;
                }
                z[i] = r - l;
                r--;
            }
        }
    }

    // Step 2: Calculate total score
    long total = n;  // Each string has at least score 1

    // Add contributions from all z-values
    for (int i = 0; i < n; i++) {
        total += z[i];
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- The Z-algorithm runs in O(n) time. Each character is compared at most twice: once when it's included in a Z-box, and once when we expand beyond it.
- The final summation loop is O(n).

**Space Complexity:** O(n)

- We need to store the Z-array of length n.
- No other significant space usage.

## Common Mistakes

1. **Forgetting the base score of 1:** Each string sᵢ always has at least a score of 1 because the entire string is both a prefix and suffix of itself. Candidates often miss this and only count the z-values.

2. **Incorrect Z-algorithm implementation:** The Z-algorithm has subtle boundary conditions. Common errors include:
   - Not adjusting `r` back after expansion
   - Mixing up the cases for when `i` is inside the Z-box
   - Using wrong indices when comparing characters

3. **Trying to use KMP instead of Z-algorithm:** While related, KMP's prefix function counts borders for the whole string, not for all prefixes simultaneously. The Z-function is specifically designed for this type of prefix-suffix matching across all positions.

4. **Integer overflow:** The total score can be large (up to n\*(n+1)/2 for a string of all same characters, which is ~5×10^9 for n=10^5). Use 64-bit integers (long in Java, no issue in Python).

## When You'll See This Pattern

The Z-algorithm pattern appears in problems involving:

1. **String matching with prefixes** - finding all occurrences of a pattern in text where the pattern is also a prefix
2. **Border problems** - counting or finding borders (prefix=suffix) in strings
3. **Periodicity detection** - finding the smallest period of a string

Related problems:

- **Longest Happy Prefix** - Direct application of finding the longest border
- **Find the Index of the First Occurrence in a String** - Can be solved with Z-algorithm
- **Repeated Substring Pattern** - Uses similar prefix-suffix matching concepts

## Key Takeaways

1. **The Z-algorithm is powerful for prefix-suffix matching:** When you need to compare a string with its own suffixes or find matches starting at each position, consider the Z-function.

2. **Think in terms of contributions:** Instead of checking each prefix individually, think about how each match contributes to multiple prefixes' scores. This shift in perspective is key to optimization.

3. **Practice the Z-algorithm implementation:** It's a tricky algorithm to implement correctly under pressure. Memorize the three cases and practice until you can write it bug-free.

Related problems: [Longest Happy Prefix](/problem/longest-happy-prefix)
