---
title: "How to Solve Find the Index of the First Occurrence in a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Index of the First Occurrence in a String. Easy difficulty, 46.3% acceptance rate. Topics: Two Pointers, String, String Matching."
date: "2026-03-07"
category: "dsa-patterns"
tags:
  [
    "find-the-index-of-the-first-occurrence-in-a-string",
    "two-pointers",
    "string",
    "string-matching",
    "easy",
  ]
---

# How to Solve Find the Index of the First Occurrence in a String

This problem asks us to find the starting index of the first occurrence of one string (`needle`) within another string (`haystack`), returning `-1` if the `needle` isn't found. While it seems straightforward, the challenge lies in implementing an efficient solution that handles edge cases properly. Many candidates jump to using built-in string search methods, but interviewers want to see you implement the matching logic yourself to demonstrate understanding of string manipulation and algorithm design.

## Visual Walkthrough

Let's trace through an example step by step to build intuition:

**Input:** `haystack = "hello world"`, `needle = "world"`

We need to check if `"world"` appears in `"hello world"`:

1. **First position (index 0):** Compare `haystack[0:5]` = `"hello"` with `"world"` → no match
2. **Second position (index 1):** Compare `haystack[1:6]` = `"ello "` with `"world"` → no match
3. **Third position (index 2):** Compare `haystack[2:7]` = `"llo w"` with `"world"` → no match
4. **Fourth position (index 3):** Compare `haystack[3:8]` = `"lo wo"` with `"world"` → no match
5. **Fifth position (index 4):** Compare `haystack[4:9]` = `"o wor"` with `"world"` → no match
6. **Sixth position (index 5):** Compare `haystack[5:10]` = `" worl"` with `"world"` → no match
7. **Seventh position (index 6):** Compare `haystack[6:11]` = `"world"` with `"world"` → **MATCH!**

We return index `6` as the starting position.

The key insight is that we only need to check positions in `haystack` where there's enough room for the entire `needle` to fit. If `haystack` has length `n` and `needle` has length `m`, we only need to check indices `0` through `n-m`.

## Brute Force Approach

The most straightforward approach is to check every possible starting position in `haystack` where `needle` could fit. For each starting position `i`, we compare each character of `needle` with the corresponding character in `haystack`.

**Why this approach works:** It's exhaustive - if `needle` exists in `haystack`, we'll eventually find it by checking every possible position.

**Why it's inefficient:** In the worst case, we compare all `m` characters of `needle` for each of the `(n-m+1)` starting positions, giving us O((n-m+1) \* m) time complexity. When `n` and `m` are large (e.g., `n=1000`, `m=500`), this becomes O(500,000) operations. While acceptable for small inputs, this is inefficient for large strings.

Here's what the brute force implementation looks like:

```python
def strStrBruteForce(haystack: str, needle: str) -> int:
    n = len(haystack)
    m = len(needle)

    # Edge case: needle is empty string
    if m == 0:
        return 0

    # Check each possible starting position
    for i in range(n - m + 1):
        # Check if needle matches starting at position i
        match = True
        for j in range(m):
            if haystack[i + j] != needle[j]:
                match = False
                break

        # If we found a match, return the starting index
        if match:
            return i

    # Needle not found
    return -1
```

While this solution is correct, we can optimize it. The optimal solution uses the same sliding window concept but can be implemented more cleanly.

## Optimal Solution

The optimal solution follows the same sliding window approach as the brute force but implements it more efficiently by avoiding unnecessary comparisons. We'll iterate through `haystack` and for each position, check if the substring starting there matches `needle`. The key optimization is stopping early when we know a position can't work.

<div class="code-group">

```python
# Time: O((n-m+1) * m) in worst case, O(n) average | Space: O(1)
def strStr(haystack: str, needle: str) -> int:
    """
    Find the index of the first occurrence of needle in haystack.

    Args:
        haystack: The string to search within
        needle: The string to search for

    Returns:
        The starting index of the first occurrence, or -1 if not found
    """
    # Get lengths of both strings
    n = len(haystack)
    m = len(needle)

    # Edge case 1: needle is empty string
    # According to problem constraints, return 0 for empty needle
    if m == 0:
        return 0

    # Edge case 2: needle is longer than haystack
    # Can't possibly be found if it's longer
    if m > n:
        return -1

    # Only need to check starting positions where needle could fit
    # The last possible starting position is n - m
    for i in range(n - m + 1):
        # Check if the substring starting at i matches needle
        # We can use slicing for cleaner code
        if haystack[i:i + m] == needle:
            return i

    # If we've checked all positions and found nothing
    return -1
```

```javascript
// Time: O((n-m+1) * m) in worst case, O(n) average | Space: O(1)
/**
 * Find the index of the first occurrence of needle in haystack.
 * @param {string} haystack - The string to search within
 * @param {string} needle - The string to search for
 * @return {number} The starting index of the first occurrence, or -1 if not found
 */
function strStr(haystack, needle) {
  // Get lengths of both strings
  const n = haystack.length;
  const m = needle.length;

  // Edge case 1: needle is empty string
  // According to problem constraints, return 0 for empty needle
  if (m === 0) {
    return 0;
  }

  // Edge case 2: needle is longer than haystack
  // Can't possibly be found if it's longer
  if (m > n) {
    return -1;
  }

  // Only need to check starting positions where needle could fit
  // The last possible starting position is n - m
  for (let i = 0; i <= n - m; i++) {
    // Check if the substring starting at i matches needle
    // Using substring method for cleaner code
    if (haystack.substring(i, i + m) === needle) {
      return i;
    }
  }

  // If we've checked all positions and found nothing
  return -1;
}
```

```java
// Time: O((n-m+1) * m) in worst case, O(n) average | Space: O(1)
class Solution {
    /**
     * Find the index of the first occurrence of needle in haystack.
     * @param haystack The string to search within
     * @param needle The string to search for
     * @return The starting index of the first occurrence, or -1 if not found
     */
    public int strStr(String haystack, String needle) {
        // Get lengths of both strings
        int n = haystack.length();
        int m = needle.length();

        // Edge case 1: needle is empty string
        // According to problem constraints, return 0 for empty needle
        if (m == 0) {
            return 0;
        }

        // Edge case 2: needle is longer than haystack
        // Can't possibly be found if it's longer
        if (m > n) {
            return -1;
        }

        // Only need to check starting positions where needle could fit
        // The last possible starting position is n - m
        for (int i = 0; i <= n - m; i++) {
            // Check if the substring starting at i matches needle
            // Using substring method for cleaner code
            if (haystack.substring(i, i + m).equals(needle)) {
                return i;
            }
        }

        // If we've checked all positions and found nothing
        return -1;
    }
}
```

</div>

**Why this is optimal for an interview setting:** While there are more advanced algorithms like KMP (Knuth-Morris-Pratt) with O(n+m) worst-case time complexity, they're overkill for an "Easy" problem and rarely expected. This sliding window solution is what interviewers expect to see - it's clean, handles edge cases, and demonstrates understanding of string manipulation.

## Complexity Analysis

**Time Complexity:**

- **Worst case:** O((n-m+1) \* m) where n is length of `haystack` and m is length of `needle`
  - This occurs when we check almost all positions and compare almost all characters each time (e.g., `haystack = "aaaaaaa"`, `needle = "aaab"`)
  - We have (n-m+1) possible starting positions, and for each we might compare up to m characters
- **Average case:** O(n) - In practice, we often find mismatches early or the needle is found quickly
- **Best case:** O(m) - When `needle` is at the beginning of `haystack`

**Space Complexity:** O(1) - We only use a few integer variables for indices and lengths, regardless of input size.

## Common Mistakes

1. **Off-by-one errors in the loop range:** The most common mistake is writing `for i in range(n - m)` instead of `for i in range(n - m + 1)`. Remember: if `n=5` and `m=2`, valid starting indices are 0, 1, 2, 3 (that's 4 positions, which is `5-2+1`).

2. **Forgetting to handle the empty needle case:** The problem states that for an empty `needle`, we should return 0. This is a common edge case that trips up many candidates.

3. **Not checking if needle is longer than haystack:** If `m > n`, we should immediately return -1 since `needle` can't possibly fit in `haystack`. Without this check, you might get index errors or infinite loops.

4. **Using built-in functions without implementing the logic:** While `haystack.find(needle)` or `indexOf()` would solve the problem in one line, interviewers want to see you implement the search logic yourself to demonstrate understanding.

## When You'll See This Pattern

The sliding window pattern used here appears in many string and array problems:

1. **Repeated Substring Pattern (LeetCode 459):** This problem asks if a string can be constructed by taking a substring of itself and repeating it multiple times. The solution involves checking substrings of different lengths using a similar sliding window approach.

2. **Shortest Palindrome (LeetCode 214):** While more complex, this hard problem builds on string matching concepts. You need to find the longest palindrome prefix, which involves matching substrings.

3. **Implement strStr() variations:** Many real-world applications like text editors, search engines, and DNA sequence alignment use variations of this pattern. The core idea of sliding a pattern over text appears in bioinformatics (BLAST algorithm) and data compression.

## Key Takeaways

1. **Sliding window is your go-to for substring search:** When you need to find a pattern in a string or array, consider sliding a window of the pattern's size across the text. This pattern works for many "find occurrence" problems.

2. **Always check edge cases first:** Before diving into the main logic, handle trivial cases like empty strings, pattern longer than text, or single-character inputs. This shows thoroughness and prevents bugs.

3. **Understand the limits of your loop:** The key to avoiding off-by-one errors is to clearly define what your loop variable represents (starting index) and calculate the maximum valid value based on both string lengths.

Related problems: [Shortest Palindrome](/problem/shortest-palindrome), [Repeated Substring Pattern](/problem/repeated-substring-pattern)
