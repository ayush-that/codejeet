---
title: "How to Solve Reverse Only Letters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse Only Letters. Easy difficulty, 68.2% acceptance rate. Topics: Two Pointers, String."
date: "2027-12-01"
category: "dsa-patterns"
tags: ["reverse-only-letters", "two-pointers", "string", "easy"]
---

# How to Solve Reverse Only Letters

This problem asks us to reverse only the English letters in a string while keeping all non-letter characters in their original positions. What makes this interesting is that we need to reverse elements selectively — we can't just reverse the entire string, nor can we simply filter out non-letters and reverse them independently. We need to maintain the original positions of non-letters while rearranging letters in reverse order.

## Visual Walkthrough

Let's trace through an example: `"a-bC-dEf-ghIj"`

**Step-by-step reasoning:**

1. First, identify all letter positions: `a`, `b`, `C`, `d`, `E`, `f`, `g`, `h`, `I`, `j`
2. The reversed letters would be: `j`, `I`, `h`, `g`, `f`, `E`, `d`, `C`, `b`, `a`
3. Now place them back into the original string positions where letters exist:
   - Position 0 (letter `a`) gets `j` → `j`
   - Position 1 (non-letter `-`) stays `-` → `j-`
   - Position 2 (letter `b`) gets `I` → `j-I`
   - Position 3 (letter `C`) gets `h` → `j-Ih`
   - Position 4 (non-letter `-`) stays `-` → `j-Ih-`
   - Position 5 (letter `d`) gets `g` → `j-Ih-g`
   - Position 6 (letter `E`) gets `f` → `j-Ih-gf`
   - Position 7 (letter `f`) gets `E` → `j-Ih-gfE`
   - Position 8 (non-letter `-`) stays `-` → `j-Ih-gfE-`
   - Position 9 (letter `g`) gets `d` → `j-Ih-gfE-d`
   - Position 10 (letter `h`) gets `C` → `j-Ih-gfE-dC`
   - Position 11 (letter `I`) gets `b` → `j-Ih-gfE-dCb`
   - Position 12 (letter `j`) gets `a` → `j-Ih-gfE-dCba`

Final result: `"j-Ih-gfE-dCba"`

This visual process reveals the core challenge: we need to traverse the string from both ends, swapping letters while skipping non-letters.

## Brute Force Approach

A naive approach might be:

1. Extract all letters into an array
2. Reverse that array
3. Create a new result string
4. Iterate through the original string, for each position:
   - If it's a letter, take the next character from the reversed letters array
   - If it's not a letter, copy the original character

While this approach works (O(n) time and O(n) space), it requires two passes and extra space for the letters array. More importantly, it doesn't demonstrate the optimal two-pointer technique that interviewers look for. The brute force also doesn't handle the problem in-place if we're working with mutable strings (like in C++ or when using character arrays).

## Optimal Solution

The optimal solution uses a two-pointer approach. We start with one pointer at the beginning (`left`) and one at the end (`right`) of the string. We move them toward each other, swapping letters when both pointers point to letters. If either pointer points to a non-letter, we move that pointer inward without swapping.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for Python strings (immutable), O(1) for mutable data structures
def reverseOnlyLetters(s: str) -> str:
    # Convert string to list since Python strings are immutable
    # This allows us to swap characters in place
    chars = list(s)

    # Initialize two pointers: left at start, right at end
    left, right = 0, len(s) - 1

    # Continue until pointers meet or cross
    while left < right:
        # Move left pointer until it points to a letter
        # isalpha() checks if character is an English letter
        while left < right and not chars[left].isalpha():
            left += 1

        # Move right pointer until it points to a letter
        while left < right and not chars[right].isalpha():
            right -= 1

        # Swap the letters at left and right positions
        # This places letters in reverse order while maintaining non-letter positions
        chars[left], chars[right] = chars[right], chars[left]

        # Move both pointers inward for next iteration
        left += 1
        right -= 1

    # Convert list back to string and return
    return ''.join(chars)
```

```javascript
// Time: O(n) | Space: O(n) for JavaScript strings (immutable)
function reverseOnlyLetters(s) {
  // Convert string to array since JavaScript strings are immutable
  // This allows character swapping
  const chars = s.split("");

  // Initialize two pointers
  let left = 0;
  let right = s.length - 1;

  // Helper function to check if character is an English letter
  const isLetter = (char) => {
    const code = char.charCodeAt(0);
    return (
      (code >= 65 && code <= 90) || // A-Z
      (code >= 97 && code <= 122)
    ); // a-z
  };

  // Process string from both ends
  while (left < right) {
    // Skip non-letters from left side
    while (left < right && !isLetter(chars[left])) {
      left++;
    }

    // Skip non-letters from right side
    while (left < right && !isLetter(chars[right])) {
      right--;
    }

    // Swap letters at current positions
    // This effectively reverses letters while keeping non-letters in place
    [chars[left], chars[right]] = [chars[right], chars[left]];

    // Move pointers inward
    left++;
    right--;
  }

  // Convert array back to string
  return chars.join("");
}
```

```java
// Time: O(n) | Space: O(n) for character array
class Solution {
    public String reverseOnlyLetters(String s) {
        // Convert string to character array for in-place modification
        char[] chars = s.toCharArray();

        // Initialize two pointers
        int left = 0;
        int right = s.length() - 1;

        // Process until pointers meet
        while (left < right) {
            // Move left pointer until it finds a letter
            // Character.isLetter() checks if it's a Unicode letter
            // For English letters only, we could use: (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
            while (left < right && !Character.isLetter(chars[left])) {
                left++;
            }

            // Move right pointer until it finds a letter
            while (left < right && !Character.isLetter(chars[right])) {
                right--;
            }

            // Swap the letters at left and right positions
            // This is the core of the reversal logic
            char temp = chars[left];
            chars[left] = chars[right];
            chars[right] = temp;

            // Move pointers inward for next iteration
            left++;
            right--;
        }

        // Convert character array back to string
        return new String(chars);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each character at most twice: once when moving pointers and once when swapping
- The inner while loops don't make this O(n²) because each pointer traverses each character exactly once
- In the worst case (all letters), we make n/2 swaps, which is O(n)

**Space Complexity:**

- Python/JavaScript: O(n) because we convert immutable strings to lists/arrays
- Java: O(n) for the character array
- If we could modify strings in-place (like in C++), space would be O(1)
- The algorithm itself uses O(1) extra space beyond the input storage

## Common Mistakes

1. **Forgetting to check pointer bounds in inner loops:** Without `left < right` in the inner while conditions, pointers can run out of bounds when the string ends with non-letters.

2. **Using wrong character classification:** Some candidates use `isalnum()` (alphanumeric) instead of `isalpha()`, which would incorrectly include digits. Others write custom checks but forget about case sensitivity (need both uppercase and lowercase).

3. **Incorrect swapping logic:** Swapping without checking if both pointers point to letters, or swapping even when one pointer points to a non-letter. This destroys the position of non-letters.

4. **Not handling edge cases:** Empty strings, strings with no letters, strings with only letters (should behave like normal reversal), and strings where non-letters are at the boundaries.

## When You'll See This Pattern

The two-pointer technique with conditional movement is common in string and array problems where you need to:

- Reverse elements with constraints
- Partition elements based on a condition
- Find pairs that satisfy certain criteria

Related problems:

1. **Move Zeroes (LeetCode #283)** - Uses similar two-pointer approach to move zeros to the end while maintaining relative order of non-zero elements
2. **Valid Palindrome (LeetCode #125)** - Uses two pointers to compare characters from both ends, skipping non-alphanumeric characters
3. **Sort Colors (LeetCode #75)** - Uses three pointers to partition array into three sections

## Key Takeaways

1. **Two-pointer technique is ideal for in-place reversal with constraints:** When you need to reverse elements while skipping certain ones, think of starting pointers at both ends and moving them conditionally.

2. **Character classification matters:** Know your language's built-in functions for checking character types (`isalpha()`, `isLetter()`, etc.), and understand what they include/exclude.

3. **Pointer bounds checking is critical:** Always check that pointers haven't crossed before accessing array elements, especially when moving them in inner loops.

Related problems: [Faulty Keyboard](/problem/faulty-keyboard), [Reverse Letters Then Special Characters in a String](/problem/reverse-letters-then-special-characters-in-a-string)
