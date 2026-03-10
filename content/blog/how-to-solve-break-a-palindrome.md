---
title: "How to Solve Break a Palindrome — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Break a Palindrome. Medium difficulty, 51.6% acceptance rate. Topics: String, Greedy."
date: "2026-02-09"
category: "dsa-patterns"
tags: ["break-a-palindrome", "string", "greedy", "medium"]
---

# How to Solve Break a Palindrome

You're given a palindrome string and must change exactly one character to make it non-palindromic while achieving the lexicographically smallest result. The challenge lies in balancing two constraints: breaking the palindrome efficiently and minimizing the resulting string. This problem tests your understanding of palindrome properties and greedy decision-making.

## Visual Walkthrough

Let's trace through the example `"abba"`:

1. **Initial string**: `"abba"` (palindrome)
2. **Goal**: Change exactly one character to make it non-palindrome, smallest lexicographically
3. **Process**:
   - We examine characters from left to right
   - First character `'a'` at index 0: This is the smallest possible letter
   - If we change `'a'` to `'b'`, we get `"bbba"` which is NOT a palindrome
   - But can we do better? Changing `'a'` to `'a'` doesn't help (same character)
   - The next smallest after `'a'` is `'b'`, so `"bbba"` is valid
4. **Check alternatives**:
   - What if we change index 1 from `'b'` to `'a'`? We get `"aaba"` which is NOT a palindrome
   - Compare `"aaba"` vs `"bbba"`: `"aaba"` comes first lexicographically because `'a'` < `'b'`
   - So `"aaba"` is better than `"bbba"`
5. **Final result**: `"aaba"`

For a single-character palindrome like `"a"`, we can't break it by changing one character (it will always be a palindrome), so we return an empty string.

## Brute Force Approach

A naive approach would be:

1. Try changing each position (0 to n-1) to every possible letter ('a' to 'z')
2. For each modification, check if the resulting string is NOT a palindrome
3. Among all valid modifications, pick the lexicographically smallest

**Why this fails:**

- For a string of length n, there are n × 26 possible modifications
- Each palindrome check takes O(n) time
- Total complexity: O(n² × 26) = O(n²), which is inefficient
- More importantly, this approach misses the key insight about palindrome structure

**What candidates might try incorrectly:**

- Changing the middle character in odd-length palindromes (but this might not give the smallest result)
- Always changing the first non-'a' character to 'a' (but what if all characters are 'a'?)
- Forgetting to handle the single-character case

## Optimized Approach

The key insight is that palindromes have symmetric structure: `palindrome[i] == palindrome[n-1-i]`. To break a palindrome efficiently:

1. **Early exit for single character**: If length = 1, return "" (can't break it)
2. **Greedy left-to-right scan**:
   - For each position i from 0 to n/2 (only need to check first half due to symmetry)
   - If character at i is NOT 'a', change it to 'a' and return
   - Why? Changing to 'a' gives the smallest possible lexicographic result
   - Why check only first half? Changing a character in first half automatically breaks symmetry with its mirror
3. **All 'a' case**:
   - If all characters in first half are 'a', we can't change any of them to 'a' (already 'a')
   - Change the LAST character to 'b' (next smallest after 'a')
   - Why last character? Changing any earlier position to something other than 'a' would make the string larger lexicographically
   - Changing last character to 'b' gives the smallest possible increase

This greedy approach works because:

- We prioritize changing to 'a' whenever possible (smallest lexicographic change)
- We only need to check half the string due to palindrome symmetry
- The "all 'a'" case requires special handling to avoid creating another palindrome

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the new string
def breakPalindrome(palindrome: str) -> str:
    """
    Break a palindrome by changing exactly one character to create the
    lexicographically smallest non-palindrome.

    Approach:
    1. Single character palindrome cannot be broken
    2. Scan first half of string for any character > 'a'
    3. If found, change it to 'a' (smallest possible)
    4. If all 'a's, change last character to 'b'
    """
    n = len(palindrome)

    # Edge case: single character cannot be broken
    if n == 1:
        return ""

    # Convert to list for mutable operations
    chars = list(palindrome)

    # Scan only first half (due to palindrome symmetry)
    for i in range(n // 2):
        # If we find a character that's not 'a', we can break palindrome
        # by changing it to 'a' (smallest possible change)
        if chars[i] != 'a':
            chars[i] = 'a'
            return ''.join(chars)

    # If we get here, all characters in first half are 'a'
    # Changing any of them to 'a' wouldn't help (already 'a')
    # Changing them to something else would make string larger lexicographically
    # So we change the LAST character to 'b' (next smallest after 'a')
    chars[-1] = 'b'
    return ''.join(chars)
```

```javascript
// Time: O(n) | Space: O(n) for the new string
function breakPalindrome(palindrome) {
  /**
   * Break a palindrome by changing exactly one character to create the
   * lexicographically smallest non-palindrome.
   *
   * Approach:
   * 1. Single character palindrome cannot be broken
   * 2. Scan first half of string for any character > 'a'
   * 3. If found, change it to 'a' (smallest possible)
   * 4. If all 'a's, change last character to 'b'
   */
  const n = palindrome.length;

  // Edge case: single character cannot be broken
  if (n === 1) {
    return "";
  }

  // Convert to array for mutable operations
  const chars = palindrome.split("");

  // Scan only first half (due to palindrome symmetry)
  for (let i = 0; i < Math.floor(n / 2); i++) {
    // If we find a character that's not 'a', we can break palindrome
    // by changing it to 'a' (smallest possible change)
    if (chars[i] !== "a") {
      chars[i] = "a";
      return chars.join("");
    }
  }

  // If we get here, all characters in first half are 'a'
  // Changing any of them to 'a' wouldn't help (already 'a')
  // Changing them to something else would make string larger lexicographically
  // So we change the LAST character to 'b' (next smallest after 'a')
  chars[n - 1] = "b";
  return chars.join("");
}
```

```java
// Time: O(n) | Space: O(n) for the new string
class Solution {
    public String breakPalindrome(String palindrome) {
        /**
         * Break a palindrome by changing exactly one character to create the
         * lexicographically smallest non-palindrome.
         *
         * Approach:
         * 1. Single character palindrome cannot be broken
         * 2. Scan first half of string for any character > 'a'
         * 3. If found, change it to 'a' (smallest possible)
         * 4. If all 'a's, change last character to 'b'
         */
        int n = palindrome.length();

        // Edge case: single character cannot be broken
        if (n == 1) {
            return "";
        }

        // Convert to char array for mutable operations
        char[] chars = palindrome.toCharArray();

        // Scan only first half (due to palindrome symmetry)
        for (int i = 0; i < n / 2; i++) {
            // If we find a character that's not 'a', we can break palindrome
            // by changing it to 'a' (smallest possible change)
            if (chars[i] != 'a') {
                chars[i] = 'a';
                return new String(chars);
            }
        }

        // If we get here, all characters in first half are 'a'
        // Changing any of them to 'a' wouldn't help (already 'a')
        // Changing them to something else would make string larger lexicographically
        // So we change the LAST character to 'b' (next smallest after 'a')
        chars[n - 1] = 'b';
        return new String(chars);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through at most n/2 characters in the worst case
- Each iteration does constant-time operations (comparison and assignment)
- String construction takes O(n) time, but this is separate from the iteration
- Overall linear time relative to input size

**Space Complexity: O(n)**

- We create a new character array/list of size n to allow modifications
- In Python/JavaScript/Java, strings are immutable, so we need auxiliary space
- The output string also requires O(n) space
- Could be optimized to O(1) if we could modify the input string directly, but that's not possible with immutable strings

## Common Mistakes

1. **Forgetting the single-character case**: When n=1, any one-character change still results in a palindrome. Candidates often return the changed string instead of empty string.

2. **Changing the middle character for odd-length palindromes**: Some candidates think changing the middle character always breaks the palindrome, but this gives suboptimal results. For example, `"aba"` → `"abb"` is worse than `"aaa"` → `"aab"`.

3. **Not checking only the first half**: Checking the entire string wastes time and can lead to incorrect logic when you find a non-'a' in the second half that's actually the mirror of an earlier 'a'.

4. **Incorrect handling of all-'a' case**: When the string is all 'a's (like `"aaaa"`), changing any position to 'a' doesn't help. Candidates might try changing the first character to 'b', giving `"baaa"`, which is larger lexicographically than changing the last to 'b' (`"aaab"`).

## When You'll See This Pattern

This problem combines **greedy algorithms** with **palindrome properties**. Similar patterns appear in:

1. **Valid Palindrome II (LeetCode 680)**: Can you make a string a palindrome by removing at most one character? Also uses palindrome symmetry and greedy checking.

2. **Palindrome Partitioning (LeetCode 131)**: While more complex, it requires understanding palindrome properties to partition strings efficiently.

3. **Longest Palindromic Substring (LeetCode 5)**: Uses palindrome symmetry to expand around centers, similar to how we leverage symmetry here.

4. **Smallest Subsequence of Distinct Characters (LeetCode 1081)**: Another lexicographically smallest problem with greedy character replacement decisions.

The core pattern is: when dealing with palindromes, leverage their symmetric property to reduce work by half. When seeking lexicographically smallest results, think greedily from left to right, preferring smaller characters earlier.

## Key Takeaways

1. **Palindrome symmetry cuts work in half**: You only need to check/process the first half of a palindrome since the second half is determined by the first.

2. **Greedy left-to-right for lexicographic order**: When minimizing lexicographic order, process from left to right, making the earliest possible position as small as possible.

3. **Edge cases matter**: Single-character palindromes and all-'a' strings require special handling. Always test these boundary cases.

4. **Think about what makes a palindrome break**: Changing any character breaks the mirror relationship with its counterpart. The optimal break is the leftmost non-'a' you can change to 'a'.

[Practice this problem on CodeJeet](/problem/break-a-palindrome)
