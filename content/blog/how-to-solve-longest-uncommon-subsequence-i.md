---
title: "How to Solve Longest Uncommon Subsequence I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Longest Uncommon Subsequence I. Easy difficulty, 62.0% acceptance rate. Topics: String."
date: "2026-09-15"
category: "dsa-patterns"
tags: ["longest-uncommon-subsequence-i", "string", "easy"]
---

# How to Solve Longest Uncommon Subsequence I

This problem asks us to find the length of the longest string that is a subsequence of exactly one of two given strings. What makes this problem interesting is that it appears more complex than it actually is—many candidates overthink it by trying to generate actual subsequences, when the solution is surprisingly simple once you understand the definition.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `a = "aba"` and `b = "cdc"`.

**What is an uncommon subsequence?**

- A subsequence is any string formed by deleting zero or more characters from the original string while maintaining order
- An uncommon subsequence must be a subsequence of exactly one string (not both)

**Key insight:** The entire string itself is always a subsequence of that string.

Let's check:

- Is `"aba"` a subsequence of `"cdc"`? No, because `"cdc"` doesn't contain `'a'`
- Is `"cdc"` a subsequence of `"aba"`? No, because `"aba"` doesn't contain `'c'`

Therefore, the longest uncommon subsequence is simply the longer of the two strings, which has length 3.

Now consider `a = "aaa"` and `b = "aaa"`:

- Both strings are identical
- Any subsequence of `a` is also a subsequence of `b`
- The only way to have an uncommon subsequence is if the strings are different
- Since they're identical, return -1

What about `a = "abc"` and `b = "aebdc"`?

- `"abc"` is a subsequence of `"aebdc"` (take positions 1, 3, 5: `"abc"`)
- `"aebdc"` is NOT a subsequence of `"abc"` (too long)
- So the longest uncommon subsequence is `"aebdc"` with length 5

The pattern emerges: if the strings are equal, no uncommon subsequence exists. Otherwise, the longer string is always an uncommon subsequence (unless the shorter string is a subsequence of the longer one, in which case the longer string still works).

## Brute Force Approach

A naive approach would be to generate all possible subsequences of both strings, then find the longest one that appears in exactly one string. However, this is extremely inefficient:

1. Generate all 2^n subsequences of string `a` (where n is length of `a`)
2. Generate all 2^m subsequences of string `b` (where m is length of `b`)
3. Compare all pairs to find the longest uncommon subsequence

This would take O(2^n + 2^m) time and space, which is exponential and completely impractical for strings of any reasonable length.

Even a slightly better brute force—checking if each string is a subsequence of the other—would still require O(n+m) time for the subsequence check, but we can do even better by recognizing the simple logic.

## Optimal Solution

The key insight is that there are only three cases:

1. If the strings are identical, no uncommon subsequence exists → return -1
2. If the strings have different lengths, the longer string cannot be a subsequence of the shorter one, so it's an uncommon subsequence → return length of longer string
3. If the strings have the same length but are different, then neither is a subsequence of the other (since they're the same length but different), so either works → return the length

Wait, let's test case 3 more carefully: `a = "abc"`, `b = "abd"` (same length, different). Neither is a subsequence of the other, so both are uncommon subsequences of length 3.

Actually, there's a subtlety: what if `a = "ab"` and `b = "ac"`? They're the same length and different. `"ab"` is not a subsequence of `"ac"` (missing `'b'`), and `"ac"` is not a subsequence of `"ab"` (missing `'c'`). So both work.

But what if `a = "ab"` and `b = "abc"`? Different lengths. `"ab"` IS a subsequence of `"abc"`, but `"abc"` is NOT a subsequence of `"ab"`. So the longest uncommon subsequence is `"abc"` with length 3.

So the complete logic is:

- If strings are equal → return -1
- Otherwise → return max(len(a), len(b))

Why does this work? If the strings are different, then the longer string cannot be a subsequence of the shorter one (by definition, a subsequence can't be longer than the original). If they're the same length but different, then neither can be a subsequence of the other (since they'd have to be equal to be a subsequence when lengths are equal).

<div class="code-group">

```python
# Time: O(min(n, m)) for string comparison, O(1) overall
# Space: O(1) - no extra data structures used
def findLUSlength(a: str, b: str) -> int:
    """
    Find the length of the longest uncommon subsequence between two strings.

    The key insight is that if the strings are equal, no uncommon subsequence exists.
    Otherwise, the longer string is always an uncommon subsequence (since a longer
    string cannot be a subsequence of a shorter string).

    Args:
        a: First input string
        b: Second input string

    Returns:
        Length of longest uncommon subsequence, or -1 if none exists
    """
    # Case 1: Strings are identical
    # No string can be a subsequence of exactly one of them
    if a == b:
        return -1

    # Case 2: Strings are different
    # The longer string cannot be a subsequence of the shorter one
    # Therefore, it's an uncommon subsequence
    return max(len(a), len(b))
```

```javascript
// Time: O(min(n, m)) for string comparison, O(1) overall
// Space: O(1) - no extra data structures used
/**
 * Find the length of the longest uncommon subsequence between two strings.
 *
 * The key insight is that if the strings are equal, no uncommon subsequence exists.
 * Otherwise, the longer string is always an uncommon subsequence (since a longer
 * string cannot be a subsequence of a shorter string).
 *
 * @param {string} a - First input string
 * @param {string} b - Second input string
 * @return {number} Length of longest uncommon subsequence, or -1 if none exists
 */
function findLUSlength(a, b) {
  // Case 1: Strings are identical
  // No string can be a subsequence of exactly one of them
  if (a === b) {
    return -1;
  }

  // Case 2: Strings are different
  // The longer string cannot be a subsequence of the shorter one
  // Therefore, it's an uncommon subsequence
  return Math.max(a.length, b.length);
}
```

```java
// Time: O(min(n, m)) for string comparison, O(1) overall
// Space: O(1) - no extra data structures used
class Solution {
    /**
     * Find the length of the longest uncommon subsequence between two strings.
     *
     * The key insight is that if the strings are equal, no uncommon subsequence exists.
     * Otherwise, the longer string is always an uncommon subsequence (since a longer
     * string cannot be a subsequence of a shorter string).
     *
     * @param a First input string
     * @param b Second input string
     * @return Length of longest uncommon subsequence, or -1 if none exists
     */
    public int findLUSlength(String a, String b) {
        // Case 1: Strings are identical
        // No string can be a subsequence of exactly one of them
        if (a.equals(b)) {
            return -1;
        }

        // Case 2: Strings are different
        // The longer string cannot be a subsequence of the shorter one
        // Therefore, it's an uncommon subsequence
        return Math.max(a.length(), b.length());
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(min(n, m))

- The string equality check takes O(min(n, m)) time in the worst case (when strings are equal or differ early)
- In practice, most implementations optimize this and return as soon as a difference is found
- The max length calculation is O(1)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for the comparison and return value
- No additional data structures are created

## Common Mistakes

1. **Overcomplicating with subsequence generation:** The most common mistake is trying to actually generate and compare subsequences. This leads to exponential time complexity when the problem has an O(1) solution. Always look for patterns and simplifications before implementing complex logic.

2. **Missing the edge case of equal strings:** Some candidates return the length of the longer string without checking if the strings are identical. Remember: if `a == b`, then every subsequence of `a` is also a subsequence of `b`, so no uncommon subsequence exists.

3. **Incorrect handling of same-length different strings:** Some think they need to check if one string is a subsequence of the other even when lengths are equal. But if two strings have the same length and are different, neither can be a subsequence of the other (a subsequence of a string with the same length must be the string itself).

4. **Forgetting about empty strings:** The solution handles empty strings correctly. If `a = ""` and `b = "abc"`, they're different, so the answer is 3. If both are empty `""`, they're equal, so the answer is -1.

## When You'll See This Pattern

This problem teaches the important skill of **looking for simplifications before implementing complex solutions**. Many "easy" problems on LeetCode have simple solutions that aren't immediately obvious:

1. **Longest Uncommon Subsequence II** (Medium) - The harder version of this problem with multiple strings. It requires more work but builds on the same understanding of uncommon subsequences.

2. **Add Strings** (Easy) - Seems like it requires complex digit-by-digit addition, but has a clean solution using carry propagation.

3. **Valid Anagram** (Easy) - Could be solved by sorting (O(n log n)), but the optimal solution uses a frequency counter (O(n)).

4. **Ransom Note** (Easy) - Similar to Valid Anagram, where the optimal solution uses frequency counting rather than more complex approaches.

The pattern is: when a problem seems like it should require complex operations, step back and ask if there's a mathematical or logical simplification. Often, constraints or definitions lead to much simpler solutions than initially apparent.

## Key Takeaways

1. **Read definitions carefully:** The definition of "uncommon subsequence" is key here. Understanding that the entire string is always a subsequence of itself leads to the simple solution.

2. **Look for the simplest case first:** Before implementing complex logic, ask: "What's the longest possible candidate?" Often it's one of the input strings themselves.

3. **Consider all cases systematically:** Break the problem into cases (equal strings, different lengths, same length but different) and reason through each one. This methodical approach often reveals simplifications.

4. **Easy problems often have trick solutions:** If a problem is marked "Easy" but seems to require complex algorithms, there's probably a simple insight you're missing. Take time to find it before coding.

Related problems: [Longest Uncommon Subsequence II](/problem/longest-uncommon-subsequence-ii)
