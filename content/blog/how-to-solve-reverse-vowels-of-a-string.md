---
title: "How to Solve Reverse Vowels of a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse Vowels of a String. Easy difficulty, 60.7% acceptance rate. Topics: Two Pointers, String."
date: "2026-07-11"
category: "dsa-patterns"
tags: ["reverse-vowels-of-a-string", "two-pointers", "string", "easy"]
---

# How to Solve Reverse Vowels of a String

This problem asks us to reverse only the vowel characters in a string while keeping all other characters in their original positions. What makes this interesting is that we need to identify vowels (both uppercase and lowercase), track their positions, and swap them in a specific pattern—all while efficiently traversing the string. The challenge lies in doing this in-place when possible and handling edge cases like strings with no vowels or strings where vowels appear consecutively.

## Visual Walkthrough

Let's trace through the example `"hello"` step by step:

**Step 1:** Identify vowels in the string

- `"h"` - not a vowel
- `"e"` - vowel (position 1)
- `"l"` - not a vowel
- `"l"` - not a vowel
- `"o"` - vowel (position 4)

**Step 2:** Set up two pointers

- Left pointer starts at position 0
- Right pointer starts at position 4

**Step 3:** Move pointers inward until they find vowels

- Left pointer at 0: `"h"` is not a vowel → move to position 1
- Right pointer at 4: `"o"` is a vowel → stop

**Step 4:** Swap vowels at pointer positions

- Swap `"e"` (position 1) with `"o"` (position 4)
- String becomes `"holle"`

**Step 5:** Move pointers inward

- Left pointer moves to position 2
- Right pointer moves to position 3

**Step 6:** Check if pointers have crossed

- Left pointer (2) < Right pointer (3) → continue
- `"l"` is not a vowel → left moves to 3
- `"l"` is not a vowel → right moves to 2
- Now left (3) > right (2) → stop

**Result:** `"holle"`

## Brute Force Approach

A naive approach might be:

1. Extract all vowels from the string into an array
2. Reverse the vowel array
3. Create a new string by iterating through the original string and replacing vowels with characters from the reversed vowel array

While this approach works, it requires O(n) extra space for the vowel array and the new string. More importantly, it doesn't demonstrate the optimal in-place swapping technique that interviewers look for. The brute force also requires two passes through the string: one to collect vowels and another to build the result.

## Optimal Solution

The optimal solution uses the **two-pointer technique** to swap vowels in-place. We maintain a set of vowels for O(1) lookup and use two pointers starting from both ends of the string. We move the pointers inward until they both point to vowels, then swap them. This continues until the pointers meet or cross.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) ignoring the output string, O(n) including it
def reverseVowels(s: str) -> str:
    """
    Reverse only the vowels in a string using two-pointer technique.

    Args:
        s: Input string to process

    Returns:
        String with vowels reversed
    """
    # Convert string to list since strings are immutable in Python
    chars = list(s)

    # Define vowel set for O(1) lookup
    vowels = set('aeiouAEIOU')

    # Initialize two pointers
    left, right = 0, len(chars) - 1

    # Continue until pointers meet or cross
    while left < right:
        # Move left pointer until it finds a vowel
        while left < right and chars[left] not in vowels:
            left += 1

        # Move right pointer until it finds a vowel
        while left < right and chars[right] not in vowels:
            right -= 1

        # Swap the vowels if pointers haven't crossed
        if left < right:
            chars[left], chars[right] = chars[right], chars[left]
            left += 1
            right -= 1

    # Convert list back to string
    return ''.join(chars)
```

```javascript
// Time: O(n) | Space: O(1) ignoring the output string, O(n) including it
function reverseVowels(s) {
  /**
   * Reverse only the vowels in a string using two-pointer technique.
   *
   * @param {string} s - Input string to process
   * @return {string} String with vowels reversed
   */

  // Convert string to array since strings are immutable in JavaScript
  const chars = s.split("");

  // Define vowel set for O(1) lookup
  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);

  // Initialize two pointers
  let left = 0;
  let right = chars.length - 1;

  // Continue until pointers meet or cross
  while (left < right) {
    // Move left pointer until it finds a vowel
    while (left < right && !vowels.has(chars[left])) {
      left++;
    }

    // Move right pointer until it finds a vowel
    while (left < right && !vowels.has(chars[right])) {
      right--;
    }

    // Swap the vowels if pointers haven't crossed
    if (left < right) {
      [chars[left], chars[right]] = [chars[right], chars[left]];
      left++;
      right--;
    }
  }

  // Convert array back to string
  return chars.join("");
}
```

```java
// Time: O(n) | Space: O(1) ignoring the output string, O(n) including it
class Solution {
    public String reverseVowels(String s) {
        /**
         * Reverse only the vowels in a string using two-pointer technique.
         *
         * @param s Input string to process
         * @return String with vowels reversed
         */

        // Convert string to char array for in-place modification
        char[] chars = s.toCharArray();

        // Define vowel set for O(1) lookup
        Set<Character> vowels = new HashSet<>();
        vowels.add('a'); vowels.add('e'); vowels.add('i'); vowels.add('o'); vowels.add('u');
        vowels.add('A'); vowels.add('E'); vowels.add('I'); vowels.add('O'); vowels.add('U');

        // Initialize two pointers
        int left = 0;
        int right = chars.length - 1;

        // Continue until pointers meet or cross
        while (left < right) {
            // Move left pointer until it finds a vowel
            while (left < right && !vowels.contains(chars[left])) {
                left++;
            }

            // Move right pointer until it finds a vowel
            while (left < right && !vowels.contains(chars[right])) {
                right--;
            }

            // Swap the vowels if pointers haven't crossed
            if (left < right) {
                char temp = chars[left];
                chars[left] = chars[right];
                chars[right] = temp;
                left++;
                right--;
            }
        }

        // Convert char array back to string
        return new String(chars);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We traverse the string once with two pointers moving toward each other
- Each character is visited at most once
- The inner while loops don't add extra complexity since each pointer moves through each position exactly once

**Space Complexity:** O(n) for the character array/string, O(1) extra space

- We need O(n) space to store the character array (strings are immutable in Python/JavaScript/Java)
- The vowel set uses O(1) space since it contains only 10 characters
- The two pointers use O(1) space
- If we count the output string, total space is O(n); if we only count extra space beyond input/output, it's O(1)

## Common Mistakes

1. **Forgetting case sensitivity**: Using only lowercase vowels (`'aeiou'`) instead of both cases (`'aeiouAEIOU'`). This causes uppercase vowels to not be recognized or swapped.

2. **Infinite loop with pointer movement**: Not checking `left < right` in the inner while loops. If all characters between pointers are consonants, the inner loops could move pointers past each other without the outer loop condition catching it.

3. **Swapping non-vowel characters**: Swapping characters immediately without verifying both pointers point to vowels. This happens when candidates swap in the outer loop without the inner while loops to find vowels first.

4. **String immutability issues**: Trying to modify strings directly instead of converting to a mutable data structure first. In Python, JavaScript, and Java, strings are immutable, so we need to convert to a list/array, modify it, then convert back.

## When You'll See This Pattern

The two-pointer technique with inward movement is a fundamental pattern for:

- **Palindrome checking** (LeetCode 125): Similar pointer movement but checking for equality instead of swapping
- **Container with most water** (LeetCode 11): Moving pointers inward based on height comparisons
- **Two sum II - Input array is sorted** (LeetCode 167): Moving pointers based on sum comparisons
- **Reverse string** (LeetCode 344): Exactly the same pointer movement but swapping all characters instead of just vowels

This pattern is effective whenever you need to process elements from both ends of a sequence and move toward the center, especially when the decision to move each pointer depends on the values at those positions.

## Key Takeaways

1. **Two-pointer inward sweep** is ideal for symmetric operations on sequences where you need to process elements from both ends. The pointers converge in the middle, ensuring each element is processed exactly once.

2. **Use sets for O(1) membership testing** when you need to check if elements belong to a fixed collection. This is more efficient than checking against a list or string with O(n) lookup.

3. **Always consider string immutability** in your language of choice. Most languages require converting to a mutable format (list/array) for in-place modifications, then converting back to a string.

Related problems: [Reverse String](/problem/reverse-string), [Remove Vowels from a String](/problem/remove-vowels-from-a-string), [Faulty Keyboard](/problem/faulty-keyboard)
