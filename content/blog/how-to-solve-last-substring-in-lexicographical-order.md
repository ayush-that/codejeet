---
title: "How to Solve Last Substring in Lexicographical Order — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Last Substring in Lexicographical Order. Hard difficulty, 35.0% acceptance rate. Topics: Two Pointers, String."
date: "2028-10-19"
category: "dsa-patterns"
tags: ["last-substring-in-lexicographical-order", "two-pointers", "string", "hard"]
---

# How to Solve Last Substring in Lexicographical Order

Given a string `s`, we need to find the last substring in lexicographical order. This means we're looking for the substring that would come last if we sorted all possible substrings alphabetically. The challenge here is that a string of length `n` has O(n²) possible substrings, so we can't generate them all. The key insight is that the last substring must start with the maximum character in the string, but not just any occurrence—it must be the rightmost occurrence that leads to the longest possible lexicographically largest substring.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "abab"`.

All substrings in lexicographical order would be:

- "a", "ab", "aba", "abab"
- "b", "ba", "bab"
- "a", "ab"
- "b"

The last one is "bab" (starting at index 2: "bab").

But how do we find this efficiently? Let's think step by step:

1. The maximum character in "abab" is 'b'
2. There are two 'b's at indices 1 and 3
3. Starting at index 1: "bab" (substring from index 1 to end)
4. Starting at index 3: "b" (just the last character)
5. Compare "bab" vs "b": "bab" is lexicographically larger

But wait, what about starting at index 1 vs index 3? When we compare "bab" and "b", we compare character by character:

- First char: 'b' vs 'b' (equal)
- Second char: 'a' vs (end of string) → 'a' > (nothing), so "bab" wins

The tricky part is when we have multiple candidates starting with the same character. We need to compare them efficiently without actually building all substrings.

## Brute Force Approach

The most straightforward approach would be to generate all substrings and keep track of the maximum one. For a string of length `n`, there are n(n+1)/2 substrings.

**Why this fails:**

- Time complexity: O(n³) if we compare strings naively (O(n) comparison for each of O(n²) substrings)
- Even with optimization: O(n²) to generate and compare substrings
- For n up to 4×10⁴ (typical LeetCode constraints), O(n²) is 1.6×10⁹ operations—far too slow

The brute force helps us understand the problem but isn't viable for the constraints.

## Optimized Approach

The key insight is that the last substring must:

1. Start with the maximum character in the string
2. Be the longest possible substring starting with that character
3. When multiple positions have the same starting character, we need to compare them efficiently

**Two-pointer technique:**
We maintain two pointers: `i` (current candidate) and `j` (comparing candidate). When `s[i]` and `s[j]` are equal, we compare the next characters by moving a third pointer `k`. The moment we find `s[i+k] != s[j+k]`, we can decide which candidate is better:

- If `s[i+k] > s[j+k]`: The substring starting at `i` is better, so we skip all positions between `j` and `j+k`
- If `s[i+k] < s[j+k]`: The substring starting at `j` is better, so we move `i` to `j` (or beyond)

This is similar to finding the maximum suffix, but we're comparing prefixes of suffixes starting from candidate positions.

**Why this works:**
We're essentially doing a tournament between candidate starting positions. When two candidates are tied for their first `k` characters, the `(k+1)`-th character breaks the tie. The loser can be eliminated along with all positions in between because any position between them would be worse than the winner.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def lastSubstring(s: str) -> str:
    """
    Find the last substring in lexicographical order.

    The key insight: the last substring must start with the maximum character,
    and when comparing two candidates starting with the same character,
    we can skip ahead when we find a difference.

    Args:
        s: Input string

    Returns:
        The last substring in lexicographical order
    """
    n = len(s)
    if n == 0:
        return ""

    # Start with first character as initial candidate
    i = 0  # Current best starting index
    j = 1  # Candidate to compare against
    k = 0  # Length of common prefix between s[i:] and s[j:]

    while j + k < n:
        # Compare characters at current positions
        if s[i + k] == s[j + k]:
            # Characters are equal, continue comparing
            k += 1
            continue

        if s[i + k] > s[j + k]:
            # Current candidate (i) is better
            # Skip all positions from j to j+k
            # because any substring starting there would be worse
            j = j + k + 1
        else:
            # Candidate (j) is better
            # Move i to j or beyond, but not past j
            i = max(i + k + 1, j)
            j = i + 1

        # Reset common prefix length
        k = 0

    # Return substring from best starting position to end
    return s[i:]
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Find the last substring in lexicographical order.
 *
 * The key insight: the last substring must start with the maximum character,
 * and when comparing two candidates starting with the same character,
 * we can skip ahead when we find a difference.
 *
 * @param {string} s - Input string
 * @return {string} The last substring in lexicographical order
 */
function lastSubstring(s) {
  const n = s.length;
  if (n === 0) return "";

  // Start with first character as initial candidate
  let i = 0; // Current best starting index
  let j = 1; // Candidate to compare against
  let k = 0; // Length of common prefix between s[i:] and s[j:]

  while (j + k < n) {
    // Compare characters at current positions
    if (s.charAt(i + k) === s.charAt(j + k)) {
      // Characters are equal, continue comparing
      k++;
      continue;
    }

    if (s.charAt(i + k) > s.charAt(j + k)) {
      // Current candidate (i) is better
      // Skip all positions from j to j+k
      // because any substring starting there would be worse
      j = j + k + 1;
    } else {
      // Candidate (j) is better
      // Move i to j or beyond, but not past j
      i = Math.max(i + k + 1, j);
      j = i + 1;
    }

    // Reset common prefix length
    k = 0;
  }

  // Return substring from best starting position to end
  return s.substring(i);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Find the last substring in lexicographical order.
     *
     * The key insight: the last substring must start with the maximum character,
     * and when comparing two candidates starting with the same character,
     * we can skip ahead when we find a difference.
     *
     * @param s Input string
     * @return The last substring in lexicographical order
     */
    public String lastSubstring(String s) {
        int n = s.length();
        if (n == 0) return "";

        // Start with first character as initial candidate
        int i = 0;  // Current best starting index
        int j = 1;  // Candidate to compare against
        int k = 0;  // Length of common prefix between s[i:] and s[j:]

        while (j + k < n) {
            // Compare characters at current positions
            if (s.charAt(i + k) == s.charAt(j + k)) {
                // Characters are equal, continue comparing
                k++;
                continue;
            }

            if (s.charAt(i + k) > s.charAt(j + k)) {
                // Current candidate (i) is better
                // Skip all positions from j to j+k
                // because any substring starting there would be worse
                j = j + k + 1;
            } else {
                // Candidate (j) is better
                // Move i to j or beyond, but not past j
                i = Math.max(i + k + 1, j);
                j = i + 1;
            }

            // Reset common prefix length
            k = 0;
        }

        // Return substring from best starting position to end
        return s.substring(i);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each character is examined at most a constant number of times
- The pointers `i` and `j` only move forward, and `k` resets after each comparison
- In the worst case (all characters equal), we compare each pair once: O(n)
- In practice, the algorithm typically performs much better than worst case

**Space Complexity: O(1)**

- We only use a few integer variables for pointers
- No additional data structures are needed
- The output substring is part of the input (in most languages) or can be constructed without extra space

## Common Mistakes

1. **Comparing entire substrings**: Some candidates try to compare `s[i:]` and `s[j:]` directly, which takes O(n) per comparison and leads to O(n²) time. The key is to compare character by character and skip ahead when possible.

2. **Incorrect pointer updates**: When `s[i+k] < s[j+k]`, it's tempting to set `i = j`. But we need `i = max(i + k + 1, j)` to avoid going backward and ensure progress. Setting `i = j` could cause infinite loops in some cases.

3. **Forgetting to reset k**: After deciding which candidate is better, we must reset `k = 0`. Otherwise, we carry over the comparison state incorrectly.

4. **Not handling all-equal strings**: For strings like "aaaa", the algorithm should return the entire string. The algorithm handles this correctly because when all characters are equal, `k` keeps increasing until `j + k` reaches `n`, at which point we return `s[i:]`.

## When You'll See This Pattern

This two-pointer technique with skipping is useful for several string comparison problems:

1. **Longest Happy Prefix** (LeetCode 1392): Finding the longest prefix which is also a suffix uses similar character-by-character comparison with efficient skipping.

2. **Repeated Substring Pattern** (LeetCode 459): Checking if a string can be formed by repeating a substring uses similar pointer manipulation.

3. **Find the Lexicographically Largest String From the Box I**: This is literally listed as a similar problem—it uses the same core concept of finding lexicographically maximum substrings.

The pattern is: when comparing strings or substrings, instead of comparing entire strings, compare character by character and skip ahead when you can determine the outcome early.

## Key Takeaways

1. **Lexicographical comparison optimization**: When comparing strings lexicographically, you don't need to compare entire strings—stop at the first differing character. This reduces O(n) comparisons to O(k) where k is the position of first difference.

2. **Two-pointer with skipping**: When searching for maximum/minimum substrings, maintain candidates and eliminate inferior ones efficiently by skipping positions that can't possibly be better.

3. **Suffix properties matter**: The last substring is always a suffix of the string (starts somewhere and goes to the end). This realization simplifies the problem from all substrings to just suffixes.

Related problems: [Find the Lexicographically Largest String From the Box I](/problem/find-the-lexicographically-largest-string-from-the-box-i)
