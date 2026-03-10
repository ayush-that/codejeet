---
title: "How to Solve Length of the Longest Alphabetical Continuous Substring — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Length of the Longest Alphabetical Continuous Substring. Medium difficulty, 60.3% acceptance rate. Topics: String."
date: "2028-04-03"
category: "dsa-patterns"
tags: ["length-of-the-longest-alphabetical-continuous-substring", "string", "medium"]
---

# How to Solve Length of the Longest Alphabetical Continuous Substring

This problem asks us to find the longest substring where characters appear in consecutive alphabetical order. While it sounds simple, the tricky part is efficiently tracking these sequences without repeatedly checking every possible substring. The core challenge is recognizing that this is essentially a **maximum consecutive sequence** problem disguised as a string manipulation task.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Consider the string `s = "abacaba"`.

We'll scan through the string, tracking the current alphabetical sequence length:

- Start at index 0: `'a'` → current length = 1, max length = 1
- Index 1: `'b'` follows `'a'` alphabetically? Yes (b = a+1) → current length = 2, max length = 2
- Index 2: `'a'` follows `'b'` alphabetically? No (a ≠ b+1) → reset current length = 1, max length = 2
- Index 3: `'c'` follows `'a'` alphabetically? No (c ≠ a+1) → reset current length = 1, max length = 2
- Index 4: `'a'` follows `'c'` alphabetically? No (a ≠ c+1) → reset current length = 1, max length = 2
- Index 5: `'b'` follows `'a'` alphabetically? Yes (b = a+1) → current length = 2, max length = 2
- Index 6: `'a'` follows `'b'` alphabetically? No (a ≠ b+1) → reset current length = 1, max length = 2

The longest alphabetical continuous substring is `"ab"` with length 2.

Notice the pattern: we only need to compare each character with the previous one. If they're consecutive in the alphabet, we extend our current sequence. Otherwise, we start a new sequence.

## Brute Force Approach

A naive approach would be to check every possible substring to see if it's alphabetical. For each starting index `i`, we would check substrings starting at `i` and ending at `j` (where `j ≥ i`), verifying that each character follows the previous one alphabetically.

The brute force algorithm would look like:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Check if substring s[i:j+1] is alphabetical
4. Track the maximum length found

This approach has O(n³) time complexity because:

- O(n²) substrings to check
- O(n) time to verify each substring is alphabetical

Even with some optimizations (like breaking early when a substring isn't alphabetical), this would still be O(n²) in the worst case, which is too slow for constraints where n can be up to 10⁵.

## Optimized Approach

The key insight is that we don't need to check every substring. We can solve this in a **single pass** through the string using a **sliding window** or **two-pointer** approach, but there's an even simpler method.

Think about it: an alphabetical continuous substring is just a sequence where each character is exactly one more than the previous character in ASCII value. So we can:

1. Start with a current length of 1 (any single character is trivially alphabetical)
2. Move through the string from left to right
3. For each character, compare it with the previous one
4. If current char = previous char + 1, increment current length
5. Otherwise, reset current length to 1
6. Always track the maximum length seen

This works because alphabetical continuity is a **local property** - if the sequence breaks at any point, we must start a new substring. We don't need to look back or check multiple possibilities.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestContinuousSubstring(s: str) -> int:
    """
    Finds the length of the longest alphabetical continuous substring.

    Args:
        s: Input string to search within

    Returns:
        Length of the longest substring where characters are consecutive in alphabet
    """
    # Handle edge case: empty string
    if not s:
        return 0

    max_length = 1  # Minimum possible length is 1 (single character)
    current_length = 1  # Start counting from first character

    # Iterate through the string starting from second character
    for i in range(1, len(s)):
        # Check if current character follows previous character alphabetically
        # In ASCII, lowercase letters are consecutive: 'a'=97, 'b'=98, etc.
        if ord(s[i]) == ord(s[i-1]) + 1:
            # Characters are consecutive, extend current sequence
            current_length += 1
        else:
            # Sequence broken, start new sequence from current character
            current_length = 1

        # Update maximum length if current sequence is longer
        max_length = max(max_length, current_length)

    return max_length
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Finds the length of the longest alphabetical continuous substring.
 *
 * @param {string} s - Input string to search within
 * @return {number} Length of the longest substring where characters are consecutive in alphabet
 */
function longestContinuousSubstring(s) {
  // Handle edge case: empty string
  if (s.length === 0) {
    return 0;
  }

  let maxLength = 1; // Minimum possible length is 1 (single character)
  let currentLength = 1; // Start counting from first character

  // Iterate through the string starting from second character
  for (let i = 1; i < s.length; i++) {
    // Check if current character follows previous character alphabetically
    // In Unicode, lowercase letters are consecutive: 'a'=97, 'b'=98, etc.
    if (s.charCodeAt(i) === s.charCodeAt(i - 1) + 1) {
      // Characters are consecutive, extend current sequence
      currentLength++;
    } else {
      // Sequence broken, start new sequence from current character
      currentLength = 1;
    }

    // Update maximum length if current sequence is longer
    maxLength = Math.max(maxLength, currentLength);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Finds the length of the longest alphabetical continuous substring.
     *
     * @param s Input string to search within
     * @return Length of the longest substring where characters are consecutive in alphabet
     */
    public int longestContinuousSubstring(String s) {
        // Handle edge case: empty string
        if (s == null || s.length() == 0) {
            return 0;
        }

        int maxLength = 1;  // Minimum possible length is 1 (single character)
        int currentLength = 1;  // Start counting from first character

        // Iterate through the string starting from second character
        for (int i = 1; i < s.length(); i++) {
            // Check if current character follows previous character alphabetically
            // In ASCII, lowercase letters are consecutive: 'a'=97, 'b'=98, etc.
            if (s.charAt(i) == s.charAt(i - 1) + 1) {
                // Characters are consecutive, extend current sequence
                currentLength++;
            } else {
                // Sequence broken, start new sequence from current character
                currentLength = 1;
            }

            // Update maximum length if current sequence is longer
            maxLength = Math.max(maxLength, currentLength);
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string, performing constant-time operations at each character
- The loop runs exactly n-1 times (for a string of length n), giving us O(n) time

**Space Complexity: O(1)**

- We only use a few integer variables (max_length, current_length, loop counter)
- No additional data structures that grow with input size
- Even the input string is provided, not created by our algorithm

## Common Mistakes

1. **Off-by-one errors with string indices**: Forgetting that we need to start comparing from index 1 (not 0) since we compare each character with the previous one. Starting at index 0 would cause an index out of bounds error when accessing `s[i-1]`.

2. **Incorrect alphabetical comparison**: Trying to compare characters directly with `s[i] == s[i-1] + 1` in Python (which works) but forgetting that in some languages you need to convert to character codes first. Or worse, comparing with `s[i] == s[i-1] + 'a'` which doesn't make mathematical sense.

3. **Forgetting to reset current_length**: When the sequence breaks, it's crucial to reset `current_length = 1` (not 0), because the current character itself forms a new sequence of length 1.

4. **Edge case handling**: Missing the empty string case. If the input is empty, we should return 0, but our loop won't execute, so we need to check this before the loop.

5. **Initializing max_length incorrectly**: Starting with `max_length = 0` fails for single-character strings. Since any single character is trivially an alphabetical continuous substring, we should start with `max_length = 1`.

## When You'll See This Pattern

This "maximum consecutive sequence" pattern appears in many problems:

1. **Longest Consecutive Sequence (LeetCode 128)**: Find the longest consecutive elements sequence in an unsorted array. Similar concept but with numbers instead of characters, requiring sorting or hash sets for efficiency.

2. **Max Consecutive Ones (LeetCode 485)**: Find the maximum number of consecutive 1s in a binary array. Exactly the same pattern - reset counter when sequence breaks.

3. **Arithmetic Slices (LeetCode 413)**: Count arithmetic subarrays (consecutive elements with same difference). More complex but builds on the same "track consecutive sequences" idea.

4. **Maximum Subarray (LeetCode 53)**: While not exactly the same, it uses similar "track current and max" logic for a different condition (sum instead of consecutive values).

The pattern is: **when you need to find the longest sequence satisfying some local condition, you can often do it in one pass by tracking the current sequence length and resetting when the condition fails.**

## Key Takeaways

1. **Local conditions enable linear solutions**: When a property only depends on adjacent elements (like "consecutive in alphabet"), you can solve it in O(n) time with a single pass, comparing each element with its neighbor.

2. **The "current and max" pattern is versatile**: Tracking both the current sequence length and the maximum seen so far is a common technique for consecutive sequence problems. Reset "current" when the sequence breaks, and always update "max" if current exceeds it.

3. **Character arithmetic is straightforward**: In most languages, you can perform arithmetic on characters (via their ASCII/Unicode values). `'b' == 'a' + 1` is true because 'a'=97 and 'b'=98 in ASCII.

4. **Edge cases matter**: Always consider empty input, single character input, and what happens at the beginning/end of your loop. These are often where bugs hide.

Related problems: [Longest Consecutive Sequence](/problem/longest-consecutive-sequence), [Arithmetic Slices](/problem/arithmetic-slices), [Max Consecutive Ones](/problem/max-consecutive-ones)
