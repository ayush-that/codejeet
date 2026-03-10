---
title: "How to Solve Reverse Prefix of Word — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse Prefix of Word. Easy difficulty, 86.5% acceptance rate. Topics: Two Pointers, String, Stack."
date: "2027-09-01"
category: "dsa-patterns"
tags: ["reverse-prefix-of-word", "two-pointers", "string", "stack", "easy"]
---

# How to Solve Reverse Prefix of Word

This problem asks us to reverse a prefix of a string up to and including the first occurrence of a target character. While conceptually straightforward, it tests your ability to manipulate strings efficiently and handle edge cases properly. The tricky part lies in the inclusive reversal and what happens when the target character doesn't exist.

## Visual Walkthrough

Let's trace through an example: `word = "abcdefd"` and `ch = "d"`

1. **Find the target character**: We need to locate the first occurrence of 'd' in the string
   - Index 0: 'a' ≠ 'd'
   - Index 1: 'b' ≠ 'd'
   - Index 2: 'c' ≠ 'd'
   - Index 3: 'd' = 'd' ✓ Found at index 3

2. **Reverse the prefix**: We need to reverse characters from index 0 to index 3 (inclusive)
   - Original segment: "abcd"
   - Reversed: "dcba"

3. **Combine with the rest**: Append the remaining characters after index 3
   - Remaining: "efd"
   - Final result: "dcba" + "efd" = "dcbaefd"

What if `ch` doesn't exist? For `word = "abcd"` and `ch = "z"`:

- We search through the entire string but never find 'z'
- Since there's no target character, we return the original string unchanged: "abcd"

## Brute Force Approach

A truly naive approach might involve:

1. Creating a new empty string
2. Iterating through the original string to find `ch`
3. If found, manually building the reversed prefix by iterating backward
4. Appending the remaining characters

While this would work, it's unnecessarily complex. The "brute force" here isn't about time complexity (which would still be O(n)), but about writing more code than needed. A cleaner approach exists.

## Optimal Solution

The optimal solution follows these steps:

1. **Find the index** of the first occurrence of `ch` using built-in string methods
2. **If found**, extract the prefix (0 to index), reverse it, and concatenate with the suffix
3. **If not found**, return the original string unchanged

We can implement this efficiently using two-pointer reversal within the string or by converting to a list for in-place reversal in languages where strings are immutable.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) - Python strings are immutable
def reversePrefix(word: str, ch: str) -> str:
    """
    Reverse the prefix of word up to and including the first occurrence of ch.

    Steps:
    1. Find the index of the first occurrence of ch
    2. If found, reverse the prefix and concatenate with the rest
    3. If not found, return the original word
    """
    # Step 1: Find the index of the first occurrence of ch
    try:
        idx = word.index(ch)
    except ValueError:
        # ch not found in word, return original
        return word

    # Step 2: Reverse the prefix (0 to idx inclusive)
    # Convert to list for easy reversal since strings are immutable
    chars = list(word)

    # Use two-pointer technique to reverse the prefix in-place
    left, right = 0, idx
    while left < right:
        # Swap characters at left and right indices
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1

    # Step 3: Convert back to string and return
    return ''.join(chars)
```

```javascript
// Time: O(n) | Space: O(n) - JavaScript strings are immutable
function reversePrefix(word, ch) {
  /**
   * Reverse the prefix of word up to and including the first occurrence of ch.
   *
   * Steps:
   * 1. Find the index of the first occurrence of ch
   * 2. If found, reverse the prefix and concatenate with the rest
   * 3. If not found, return the original word
   */

  // Step 1: Find the index of the first occurrence of ch
  const idx = word.indexOf(ch);

  // If ch is not found, return the original word
  if (idx === -1) {
    return word;
  }

  // Step 2: Extract and reverse the prefix
  // Split the string into an array for easier manipulation
  const chars = word.split("");

  // Use two-pointer technique to reverse the prefix in-place
  let left = 0;
  let right = idx;

  while (left < right) {
    // Swap characters at left and right indices
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }

  // Step 3: Join the array back into a string
  return chars.join("");
}
```

```java
// Time: O(n) | Space: O(n) - Java strings are immutable
class Solution {
    public String reversePrefix(String word, char ch) {
        /**
         * Reverse the prefix of word up to and including the first occurrence of ch.
         *
         * Steps:
         * 1. Find the index of the first occurrence of ch
         * 2. If found, reverse the prefix and concatenate with the rest
         * 3. If not found, return the original word
         */

        // Step 1: Find the index of the first occurrence of ch
        int idx = word.indexOf(ch);

        // If ch is not found, return the original word
        if (idx == -1) {
            return word;
        }

        // Step 2: Convert to char array for in-place manipulation
        char[] chars = word.toCharArray();

        // Use two-pointer technique to reverse the prefix in-place
        int left = 0;
        int right = idx;

        while (left < right) {
            // Swap characters at left and right indices
            char temp = chars[left];
            chars[left] = chars[right];
            chars[right] = temp;

            left++;
            right--;
        }

        // Step 3: Convert back to string and return
        return new String(chars);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the index of `ch` takes O(n) in the worst case (when `ch` is at the end or doesn't exist)
- Reversing the prefix takes O(k) where k is the index of `ch`, which is at most O(n)
- Overall, we perform linear operations on the string

**Space Complexity: O(n)**

- In all three languages, strings are immutable, so we need to create a new character array/list
- The space used is proportional to the length of the input string
- The two-pointer reversal is done in-place on the character array, but we still need O(n) space for the array itself

## Common Mistakes

1. **Off-by-one errors in the reversal range**: The problem specifies the reversal should be inclusive of the target character. Some candidates reverse from 0 to `idx-1` instead of 0 to `idx`. Always double-check whether boundaries are inclusive or exclusive.

2. **Forgetting to handle the "not found" case**: If `ch` doesn't exist in `word`, we should return the original string unchanged. This is an easy edge case to miss during implementation.

3. **Inefficient string concatenation in loops**: In languages where strings are immutable (like Java and Python), repeatedly concatenating strings in a loop creates new string objects each time, leading to O(n²) time complexity. Always use character arrays or StringBuilder for such operations.

4. **Assuming the input is valid**: While not explicitly stated, you should consider edge cases like empty strings, single-character strings, or when `ch` appears at the very beginning (index 0) or end of the string.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Two-pointer reversal** - Used in many string and array problems:
   - [Reverse String](https://leetcode.com/problems/reverse-string/) - Exactly the same reversal technique
   - [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) - Uses two pointers to compare characters from both ends
   - [Reverse Words in a String III](https://leetcode.com/problems/reverse-words-in-a-string-iii/) - Applies reversal to substrings

2. **Prefix/suffix manipulation** - Common in string processing:
   - [Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/) - Works with prefixes of multiple strings
   - [Check If a Word Occurs As a Prefix of Any Word in a Sentence](https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence/) - Similar prefix matching logic

3. **Search and transform** - Find something, then perform an operation on it:
   - [Find First Palindromic String in the Array](https://leetcode.com/problems/find-first-palindromic-string-in-the-array/) - Find then check/transform

## Key Takeaways

1. **Two-pointer technique is versatile**: The same left/right pointer approach used here for reversing a substring appears in many other contexts like palindrome checking, sorted array problems, and sliding windows.

2. **Know your language's string characteristics**: Understanding whether strings are mutable or immutable in your language affects your implementation strategy and space complexity analysis.

3. **Always handle edge cases explicitly**: The "character not found" case is what separates a complete solution from an incomplete one. Interviewers specifically look for this attention to detail.

4. **Break problems into clear steps**: This problem naturally decomposes into: 1) Find index, 2) Reverse if found, 3) Return result. Articulating these steps shows structured thinking.

[Practice this problem on CodeJeet](/problem/reverse-prefix-of-word)
