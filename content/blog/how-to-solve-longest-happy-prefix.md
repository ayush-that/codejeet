---
title: "How to Solve Longest Happy Prefix — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Happy Prefix. Hard difficulty, 51.9% acceptance rate. Topics: String, Rolling Hash, String Matching, Hash Function."
date: "2027-08-07"
category: "dsa-patterns"
tags: ["longest-happy-prefix", "string", "rolling-hash", "string-matching", "hard"]
---

# How to Solve Longest Happy Prefix

Finding the longest happy prefix—a non-empty prefix that's also a suffix (excluding the whole string itself)—is a classic string matching problem that tests your understanding of efficient pattern matching. What makes this problem tricky is that a naive approach would be O(n²), which is unacceptable for large strings. The optimal solution requires either the Knuth-Morris-Pratt (KMP) algorithm or rolling hash technique, both of which are fundamental to string processing.

## Visual Walkthrough

Let's trace through the example `s = "ababab"` to build intuition:

We're looking for the longest prefix that's also a suffix, but not the entire string.

1. Check if `"ababab"` (length 6) equals itself? No—we exclude the whole string.
2. Check `"ababa"` (length 5): Prefix `"ababa"` vs suffix `"babab"` → Not equal.
3. Check `"abab"` (length 4): Prefix `"abab"` vs suffix `"abab"` → Equal! This is a happy prefix.
4. We could check shorter ones (`"aba"`, `"ab"`, `"a"`), but we want the longest, so we stop here.

The answer is `"abab"`.

But checking each possible length by comparing substrings directly would be inefficient. The key insight: we need to find the longest proper prefix that's also a suffix. This is exactly what the KMP algorithm's prefix table (also called LPS array) computes!

## Brute Force Approach

The most straightforward approach is to check every possible prefix length from `n-1` down to `1`:

1. For each length `i` from `n-1` down to `1`
2. Compare `s[0:i]` with `s[n-i:n]`
3. If they match, return `s[0:i]`
4. If none match, return `""`

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def longestPrefix_brute(s: str) -> str:
    n = len(s)
    # Check all possible lengths from largest to smallest
    for i in range(n - 1, 0, -1):  # i is the length of the prefix
        prefix = s[:i]
        suffix = s[n - i:]
        if prefix == suffix:
            return prefix
    return ""
```

```javascript
// Time: O(n²) | Space: O(1)
function longestPrefixBrute(s) {
  const n = s.length;
  // Check all possible lengths from largest to smallest
  for (let i = n - 1; i > 0; i--) {
    const prefix = s.substring(0, i);
    const suffix = s.substring(n - i);
    if (prefix === suffix) {
      return prefix;
    }
  }
  return "";
}
```

```java
// Time: O(n²) | Space: O(1)
public String longestPrefixBrute(String s) {
    int n = s.length();
    // Check all possible lengths from largest to smallest
    for (int i = n - 1; i > 0; i--) {
        String prefix = s.substring(0, i);
        String suffix = s.substring(n - i);
        if (prefix.equals(suffix)) {
            return prefix;
        }
    }
    return "";
}
```

</div>

**Why this is too slow:** For a string of length `n`, we check up to `n-1` lengths. Each comparison takes O(i) time where `i` is the length being compared. In the worst case (like `"aaaaa"`), we compare long strings many times, resulting in O(n²) time complexity. This fails for large `n` (e.g., n = 10⁵ would require ~10¹⁰ operations).

## Optimized Approach

The key insight is that we don't need to compare substrings directly. We can use the **KMP prefix table** (also called LPS array for "Longest Prefix Suffix").

The LPS array `lps[i]` stores the length of the longest proper prefix of `s[0..i]` that is also a suffix of `s[0..i]`. Notice that `lps[n-1]` gives us exactly what we want: the length of the longest prefix of the whole string that's also a suffix!

**How the LPS array works:**

- We build it in O(n) time using a two-pointer approach
- We maintain a `length` variable tracking the current longest prefix-suffix length
- For each character, we either extend a match or fall back to a shorter prefix

**Step-by-step for `s = "ababab"`:**

1. `lps[0] = 0` (single character has no proper prefix)
2. `i = 1`, compare `s[1] = 'b'` with `s[0] = 'a'` → no match, `lps[1] = 0`
3. `i = 2`, compare `s[2] = 'a'` with `s[0] = 'a'` → match! `lps[2] = 1`
4. `i = 3`, compare `s[3] = 'b'` with `s[1] = 'b'` (since `lps[2] = 1`) → match! `lps[3] = 2`
5. `i = 4`, compare `s[4] = 'a'` with `s[2] = 'a'` (since `lps[3] = 2`) → match! `lps[4] = 3`
6. `i = 5`, compare `s[5] = 'b'` with `s[3] = 'b'` (since `lps[4] = 3`) → match! `lps[5] = 4`

The last value `lps[5] = 4` tells us the longest happy prefix has length 4, which is `s[0:4] = "abab"`.

## Optimal Solution

Here's the complete KMP-based solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestPrefix(s: str) -> str:
    n = len(s)
    if n == 0:
        return ""

    # Step 1: Build the LPS (Longest Prefix Suffix) array
    lps = [0] * n  # lps[i] = longest prefix length for s[0..i] that's also a suffix

    length = 0  # Length of the previous longest prefix suffix
    i = 1       # Start from the second character

    while i < n:
        if s[i] == s[length]:
            # Characters match, we can extend the prefix
            length += 1
            lps[i] = length
            i += 1
        else:
            # Characters don't match
            if length != 0:
                # Try a shorter prefix
                length = lps[length - 1]
            else:
                # No prefix matches at this position
                lps[i] = 0
                i += 1

    # Step 2: The last value in LPS array gives us the length of the longest happy prefix
    longest_length = lps[-1]

    # Step 3: Return the prefix of that length
    return s[:longest_length]
```

```javascript
// Time: O(n) | Space: O(n)
function longestPrefix(s) {
  const n = s.length;
  if (n === 0) return "";

  // Step 1: Build the LPS (Longest Prefix Suffix) array
  const lps = new Array(n).fill(0); // lps[i] = longest prefix length for s[0..i]

  let length = 0; // Length of the previous longest prefix suffix
  let i = 1; // Start from the second character

  while (i < n) {
    if (s[i] === s[length]) {
      // Characters match, we can extend the prefix
      length++;
      lps[i] = length;
      i++;
    } else {
      // Characters don't match
      if (length !== 0) {
        // Try a shorter prefix
        length = lps[length - 1];
      } else {
        // No prefix matches at this position
        lps[i] = 0;
        i++;
      }
    }
  }

  // Step 2: The last value in LPS array gives us the length
  const longestLength = lps[n - 1];

  // Step 3: Return the prefix of that length
  return s.substring(0, longestLength);
}
```

```java
// Time: O(n) | Space: O(n)
public String longestPrefix(String s) {
    int n = s.length();
    if (n == 0) return "";

    // Step 1: Build the LPS (Longest Prefix Suffix) array
    int[] lps = new int[n]; // lps[i] = longest prefix length for s[0..i]

    int length = 0; // Length of the previous longest prefix suffix
    int i = 1;      // Start from the second character

    while (i < n) {
        if (s.charAt(i) == s.charAt(length)) {
            // Characters match, we can extend the prefix
            length++;
            lps[i] = length;
            i++;
        } else {
            // Characters don't match
            if (length != 0) {
                // Try a shorter prefix
                length = lps[length - 1];
            } else {
                // No prefix matches at this position
                lps[i] = 0;
                i++;
            }
        }
    }

    // Step 2: The last value in LPS array gives us the length
    int longestLength = lps[n - 1];

    // Step 3: Return the prefix of that length
    return s.substring(0, longestLength);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once to build the LPS array
- The `while` loop may seem like it could be O(n²) due to the inner `length = lps[length - 1]` operation, but each character is processed at most twice: once when we extend `length` and once when we decrease it
- This is a classic amortized O(n) analysis similar to the KMP algorithm

**Space Complexity: O(n)**

- We store the LPS array of size `n`
- We could optimize to O(1) if we only track the last LPS value, but we need the full array to compute it correctly

## Common Mistakes

1. **Off-by-one errors with indices**: The LPS array is built starting from index 1, not 0. Also, when falling back (`length = lps[length - 1]`), remember to subtract 1 to get the previous position.

2. **Forgetting to handle the empty string case**: An empty string has no non-empty prefix, so it should return `""`. Always check edge cases first.

3. **Returning the whole string**: The problem explicitly says "excluding itself," so when `lps[n-1] = n`, you need to use `lps[lps[n-1]-1]` to find the next shorter prefix. Actually, this case can't happen because `lps[i] < i+1` by definition (it's a proper prefix).

4. **Confusing prefix-suffix with palindrome**: A happy prefix must match exactly as prefix and suffix, not be symmetric around the center. "abcba" has "a" as both prefix and suffix, but "bcb" is a palindrome, not a prefix-suffix match.

## When You'll See This Pattern

The KMP prefix table (LPS array) is fundamental to string matching problems:

1. **Implement strStr()** (LeetCode 28): The classic string search problem where KMP was originally designed.

2. **Repeated Substring Pattern** (LeetCode 459): Check if a string can be formed by repeating a substring. The LPS array helps determine if the string has a periodic structure.

3. **Shortest Palindrome** (LeetCode 214): Find the shortest palindrome by adding characters to the beginning. You can reverse the string and use KMP to find the longest overlap.

4. **Sum of Scores of Built Strings** (LeetCode 2223): This problem directly builds on the LPS concept to compute scores efficiently.

## Key Takeaways

1. **The LPS array is the key**: When you need to find prefix-suffix relationships in a string, think of the KMP prefix table (LPS array). It efficiently captures all prefix-suffix matches in O(n) time.

2. **Proper prefix matters**: Remember that a "proper prefix" excludes the whole string itself. This is why `lps[i]` is always less than `i+1`.

3. **Pattern recognition**: If a problem involves finding overlaps, repetitions, or self-similarities in strings, KMP or its LPS array is often the right tool.

Related problems: [Sum of Scores of Built Strings](/problem/sum-of-scores-of-built-strings), [Maximum Deletions on a String](/problem/maximum-deletions-on-a-string), [Minimum Time to Revert Word to Initial State II](/problem/minimum-time-to-revert-word-to-initial-state-ii)
