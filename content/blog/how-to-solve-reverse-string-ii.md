---
title: "How to Solve Reverse String II — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse String II. Easy difficulty, 53.4% acceptance rate. Topics: Two Pointers, String."
date: "2027-09-03"
category: "dsa-patterns"
tags: ["reverse-string-ii", "two-pointers", "string", "easy"]
---

# How to Solve Reverse String II

This problem asks us to reverse the first `k` characters for every `2k` character segment in a string. The tricky part is handling the edge cases correctly: when we have fewer than `k` characters left, we reverse all of them; when we have between `k` and `2k-1` characters left, we only reverse the first `k`. This requires careful index management and understanding exactly when to apply the reversal operation.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "abcdefghij"` and `k = 3`.

We process the string in segments of length `2k = 6`:

1. **First segment (indices 0-5)**: Within this 6-character window, we reverse the first `k=3` characters.
   - Characters at indices 0,1,2 become 2,1,0 → "cba"
   - Characters at indices 3,4,5 remain unchanged → "def"
   - Result so far: "cbadef"

2. **Second segment (indices 6-9)**: We only have 4 characters left (indices 6-9: "ghij").
   - We check: do we have at least `k=3` characters? Yes (we have 4).
   - Do we have at least `2k=6` characters? No (we only have 4).
   - According to the rules: "If there are less than `2k` but greater than or equal to `k` characters, then reverse the first `k` characters."
   - So we reverse the first 3 of the remaining 4: indices 6,7,8 become 8,7,6 → "ihg"
   - The last character (index 9: "j") remains unchanged
   - Final result: "cbadefihgj"

The pattern is: for each starting index `i` where `i % (2k) == 0`, we reverse the substring from `i` to `i+k-1`, but only if it exists.

## Brute Force Approach

A naive approach might be to process the string character by character, trying to reverse segments as we encounter them. However, the most straightforward brute force would be:

1. Convert the string to a list (since strings are immutable in Python/Java)
2. For each starting index `i` from 0 to `len(s)-1` in steps of `2k`:
   - Find the end index for reversal: `min(i + k - 1, len(s) - 1)`
   - Reverse the characters between `i` and that end index

This is actually the optimal approach! The problem is simple enough that the "brute force" is already optimal. However, a truly naive candidate might try to:

- Process every single character individually with complex conditional logic
- Create multiple intermediate strings instead of modifying in-place
- Use string concatenation in a loop (which is O(n²) in some languages)

The key insight is that we can process the string in chunks of size `2k`, and within each chunk, we only need to reverse the first `k` characters if they exist.

## Optimal Solution

The optimal solution uses two pointers to reverse each segment. We iterate through the string with step size `2k`, and for each segment starting at index `i`, we reverse the substring from `i` to `min(i+k-1, len(s)-1)`.

<div class="code-group">

```python
# Time: O(n) - We process each character at most once during reversal
# Space: O(n) - We convert string to list for in-place modification in Python
def reverseStr(s, k):
    """
    Reverse the first k characters for every 2k characters in the string.

    Args:
        s: Input string
        k: Number of characters to reverse in each segment

    Returns:
        Modified string with specified reversals
    """
    # Convert string to list since strings are immutable in Python
    chars = list(s)

    # Process the string in chunks of size 2k
    for i in range(0, len(chars), 2 * k):
        # Left pointer starts at the beginning of current segment
        left = i
        # Right pointer is either i+k-1 or end of string, whichever is smaller
        # This handles the "fewer than k characters left" case
        right = min(i + k - 1, len(chars) - 1)

        # Reverse the characters between left and right pointers
        while left < right:
            # Swap characters at left and right positions
            chars[left], chars[right] = chars[right], chars[left]
            # Move pointers toward each other
            left += 1
            right -= 1

    # Convert list back to string and return
    return ''.join(chars)
```

```javascript
// Time: O(n) - We process each character at most once during reversal
// Space: O(n) - We convert string to array for modification
function reverseStr(s, k) {
  /**
   * Reverse the first k characters for every 2k characters in the string.
   *
   * @param {string} s - Input string
   * @param {number} k - Number of characters to reverse in each segment
   * @return {string} Modified string with specified reversals
   */
  // Convert string to array since strings are immutable in JavaScript
  const chars = s.split("");

  // Process the string in chunks of size 2k
  for (let i = 0; i < chars.length; i += 2 * k) {
    // Left pointer starts at the beginning of current segment
    let left = i;
    // Right pointer is either i+k-1 or end of string, whichever is smaller
    // This handles the "fewer than k characters left" case
    let right = Math.min(i + k - 1, chars.length - 1);

    // Reverse the characters between left and right pointers
    while (left < right) {
      // Swap characters at left and right positions
      [chars[left], chars[right]] = [chars[right], chars[left]];
      // Move pointers toward each other
      left++;
      right--;
    }
  }

  // Convert array back to string and return
  return chars.join("");
}
```

```java
// Time: O(n) - We process each character at most once during reversal
// Space: O(n) - We convert string to char array for modification
class Solution {
    public String reverseStr(String s, int k) {
        /**
         * Reverse the first k characters for every 2k characters in the string.
         *
         * @param s Input string
         * @param k Number of characters to reverse in each segment
         * @return Modified string with specified reversals
         */
        // Convert string to char array since strings are immutable in Java
        char[] chars = s.toCharArray();

        // Process the string in chunks of size 2k
        for (int i = 0; i < chars.length; i += 2 * k) {
            // Left pointer starts at the beginning of current segment
            int left = i;
            // Right pointer is either i+k-1 or end of string, whichever is smaller
            // This handles the "fewer than k characters left" case
            int right = Math.min(i + k - 1, chars.length - 1);

            // Reverse the characters between left and right pointers
            while (left < right) {
                // Swap characters at left and right positions
                char temp = chars[left];
                chars[left] = chars[right];
                chars[right] = temp;
                // Move pointers toward each other
                left++;
                right--;
            }
        }

        // Convert char array back to string and return
        return new String(chars);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string with a step size of `2k`, which gives us O(n/(2k)) iterations.
- In each iteration, we reverse at most `k` characters using the two-pointer swap technique, which takes O(k) time.
- Overall: O(n/(2k) \* k) = O(n/2) = O(n)
- Each character is swapped at most once, so we have linear time complexity.

**Space Complexity: O(n)**

- In Python and Java, strings are immutable, so we need to convert to a list/array to modify characters in-place. This requires O(n) additional space.
- In JavaScript, we also convert to an array for efficient modification.
- The two-pointer reversal uses only O(1) extra space for the pointers and temporary swap variable, but the array conversion dominates.

## Common Mistakes

1. **Off-by-one errors in the right pointer calculation**: Forgetting to subtract 1 when calculating `i + k - 1` is a common mistake. If you use `i + k` as the right pointer, you'll reverse `k+1` characters instead of `k`.

2. **Not handling the "fewer than k characters left" case**: Candidates often forget to take the minimum between `i + k - 1` and `len(s) - 1`. Without this, you'll get an index out of bounds error when trying to access characters beyond the string length.

3. **Incorrect loop increment**: Using `i += k` instead of `i += 2 * k` means you'll process overlapping segments. Remember: we only reverse the first `k` characters of each `2k` segment, then skip the next `k` characters.

4. **Modifying strings directly in languages where they're immutable**: In Python, Java, and JavaScript, strings are immutable. Trying to modify them directly with indexing (like `s[i] = s[j]`) will either throw an error or not work as expected. Always convert to a list/array first.

## When You'll See This Pattern

The two-pointer reversal pattern appears in many string manipulation problems:

1. **Reverse String (Easy)**: The classic two-pointer reversal problem where you reverse the entire string by swapping characters from both ends.

2. **Reverse Words in a String III (Easy)**: Similar pattern but applied to individual words within a string. You need to identify word boundaries and reverse each word using the same two-pointer technique.

3. **Rotate Array (Medium)**: While not exactly the same, it often involves reversal techniques - reverse the entire array, then reverse two segments.

4. **Palindrome-related problems**: Checking if a string is a palindrome often uses two pointers moving toward each other.

The core technique of using two pointers to reverse a segment in-place is fundamental to many array/string manipulation problems. Recognizing when to apply it comes down to identifying that you need to transform a contiguous segment of elements in a reversible way.

## Key Takeaways

1. **Two-pointer reversal is a fundamental technique**: When you need to reverse a contiguous segment of an array or string, think of using left and right pointers that move toward each other while swapping elements.

2. **Process strings in chunks for efficiency**: When a problem involves processing a string in regular segments (every `k` characters, every word, etc.), use a loop with an appropriate step size rather than processing character by character.

3. **Always handle edge cases with min() or conditional checks**: When calculating indices that might go out of bounds, use `min(index, len(s)-1)` or similar bounds checking to avoid errors.

4. **Remember string immutability**: In many languages, you need to convert strings to mutable arrays/lists before modifying them character by character.

Related problems: [Reverse String](/problem/reverse-string), [Reverse Words in a String III](/problem/reverse-words-in-a-string-iii), [Faulty Keyboard](/problem/faulty-keyboard)
