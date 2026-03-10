---
title: "How to Solve Decoded String at Index — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Decoded String at Index. Medium difficulty, 37.3% acceptance rate. Topics: String, Stack."
date: "2027-04-28"
category: "dsa-patterns"
tags: ["decoded-string-at-index", "string", "stack", "medium"]
---

# How to Solve Decoded String at Index

This problem asks us to decode an encoded string where letters are appended directly, but digits cause the entire current decoded string to be repeated that many times. The twist is that we don't need to build the entire decoded string—we only need to find the character at a specific index `k`. The challenge comes from the fact that the decoded string can be astronomically large (exponential growth with each digit), making direct simulation impossible.

## Visual Walkthrough

Let's trace through an example: `s = "leet2code3"`, `k = 10`

If we were to decode fully:

1. Start: `""`
2. `l` → `"l"`
3. `e` → `"le"`
4. `e` → `"lee"`
5. `t` → `"leet"`
6. `2` → `"leetleet"` (repeat "leet" 2 times)
7. `c` → `"leetleetc"`
8. `o` → `"leetleetco"`
9. `d` → `"leetleetcod"`
10. `e` → `"leetleetcod"`
11. `3` → `"leetleetcodleetleetcodleetleetcod"` (repeat 3 times)

The full decoded string has length 36. At index 10 (0-based), we find `"o"`.

But here's the key insight: we don't need to build this entire string. Instead, we can work backwards from the end:

1. First, calculate the total length of the decoded string: 36
2. We want index 10 (0-based)
3. Work backwards through the original encoded string:
   - Last char `"3"`: Before this digit, length was 12. `k = 10 < 12`, so we stay in the first copy. Update length to 12.
   - `"e"`: Length was 11. `k = 10 < 11`, so we're still in the first copy. Update length to 11.
   - `"d"`: Length was 10. `k = 10 == 10`, which means we're at the boundary. When `k == length`, we return the last character of the current segment, which is `"d"`? Wait, careful—this is a common pitfall. Actually, when `k == length`, we're at the last character of the current segment, which would be the character we just processed going backwards. But let's continue...
   - Actually, let's trace more carefully. When we hit a boundary case (`k == length % current_length`), we need to find the nearest letter going backwards.

The correct backward approach: Calculate total size, then work backwards, reducing `k` modulo the current length whenever we encounter a digit.

## Brute Force Approach

The brute force approach would be to actually build the entire decoded string:

1. Initialize an empty string `decoded`
2. Iterate through each character in `s`:
   - If it's a letter, append it to `decoded`
   - If it's a digit, repeat `decoded` that many times
3. Return the character at index `k-1` (if using 1-based indexing) or `k` (if using 0-based)

The problem with this approach is exponential growth. Consider `s = "a" * 100 + "9" * 10`. The final string would have length `100 * 9^10`, which is astronomically large (over 3.4 trillion characters). This would exceed memory limits and time limits.

## Optimized Approach

The key insight is that we don't need to build the string—we only need to know where in the original encoded string our target index maps to. We can work backwards:

1. **Forward pass to calculate total length**: First, calculate how long the decoded string would be without actually building it. Whenever we see a letter, length increases by 1. Whenever we see a digit, length multiplies by that digit.

2. **Backward pass to find the character**: Work backwards through the encoded string:
   - If the current character is a digit: The string before this digit was repeated `d` times. So we reduce the problem by taking `k = k % previous_length`. Why? Because position `k` in the full string corresponds to position `k % previous_length` in the unrepeated version.
   - If the current character is a letter: Check if `k == 0` or `k == current_length`. If so, this letter is our answer (because we've reduced the problem to the exact position).
   - Reduce the current length as we go backwards (divide by digit for digits, subtract 1 for letters).

This approach works because:

- Digits create repetitions, and `k` in a repeated string maps to `k % base_length` in the base string
- Letters are singular elements that either match our exact position or don't
- By working backwards, we reduce the problem size exponentially at each digit

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of encoded string
# Space: O(1) excluding input storage
def decodeAtIndex(s: str, k: int) -> str:
    """
    Decodes the string following the rules but only returns the k-th character
    (1-indexed in problem statement, but we'll work with 0-indexed internally).
    """
    # Convert k to 0-indexed for easier modulo arithmetic
    k -= 1

    # First, calculate the total length of the decoded string
    total_length = 0
    for char in s:
        if char.isdigit():
            # Multiply length by the digit
            total_length *= int(char)
        else:
            # Add 1 for a letter
            total_length += 1

    # Now work backwards through the string
    for i in range(len(s) - 1, -1, -1):
        char = s[i]

        if char.isdigit():
            # This digit caused the string to be repeated
            digit = int(char)

            # The length before this repetition was total_length // digit
            total_length //= digit

            # k in the repeated string corresponds to k % previous_length
            # in the unrepeated string
            k %= total_length
        else:
            # This is a letter
            # If k points to this character (either at the end or exact position)
            if k == total_length - 1:
                return char

            # Otherwise, this character isn't our answer
            # Reduce total_length by 1 since we're moving past this character
            total_length -= 1

    # We should always return within the loop
    return ""
```

```javascript
// Time: O(n) where n is length of encoded string
// Space: O(1) excluding input storage
function decodeAtIndex(s, k) {
  // Convert k to 0-indexed for easier modulo arithmetic
  k = k - 1;

  // First, calculate the total length of the decoded string
  let totalLength = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (!isNaN(char) && char !== " ") {
      // Character is a digit (check carefully for digits)
      totalLength *= parseInt(char, 10);
    } else {
      // Character is a letter
      totalLength += 1;
    }
  }

  // Now work backwards through the string
  for (let i = s.length - 1; i >= 0; i--) {
    const char = s[i];

    if (!isNaN(char) && char !== " ") {
      // This digit caused the string to be repeated
      const digit = parseInt(char, 10);

      // The length before this repetition was totalLength / digit
      totalLength = Math.floor(totalLength / digit);

      // k in the repeated string corresponds to k % previousLength
      // in the unrepeated string
      k = k % totalLength;
    } else {
      // This is a letter
      // If k points to this character (at the end of current segment)
      if (k === totalLength - 1) {
        return char;
      }

      // Otherwise, this character isn't our answer
      // Reduce totalLength by 1 since we're moving past this character
      totalLength -= 1;
    }
  }

  // We should always return within the loop
  return "";
}
```

```java
// Time: O(n) where n is length of encoded string
// Space: O(1) excluding input storage
class Solution {
    public String decodeAtIndex(String s, int k) {
        // Convert k to 0-indexed for easier modulo arithmetic
        long kLong = k - 1L;  // Use long to avoid overflow for large k

        // First, calculate the total length of the decoded string
        long totalLength = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                // Multiply length by the digit
                totalLength *= (c - '0');
            } else {
                // Add 1 for a letter
                totalLength += 1;
            }
        }

        // Now work backwards through the string
        for (int i = s.length() - 1; i >= 0; i--) {
            char c = s.charAt(i);

            if (Character.isDigit(c)) {
                // This digit caused the string to be repeated
                int digit = c - '0';

                // The length before this repetition was totalLength / digit
                totalLength /= digit;

                // k in the repeated string corresponds to k % previousLength
                // in the unrepeated string
                kLong %= totalLength;
            } else {
                // This is a letter
                // If k points to this character (at the end of current segment)
                if (kLong == totalLength - 1) {
                    return String.valueOf(c);
                }

                // Otherwise, this character isn't our answer
                // Reduce totalLength by 1 since we're moving past this character
                totalLength -= 1;
            }
        }

        // We should always return within the loop
        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the encoded string `s`. We make two passes through the string: one forward to calculate the total length, and one backward to find the target character.

**Space Complexity:** O(1) excluding the input storage. We only use a few variables to track the current length and position. Even though the decoded string could be exponentially large, we never construct it.

The key to the efficiency is that we avoid materializing the decoded string entirely. Each digit allows us to "skip" exponentially many characters by using modulo arithmetic.

## Common Mistakes

1. **Actually building the decoded string**: This is the most tempting mistake. Candidates often start building the string, only to realize too late that it grows exponentially. Always check constraints first—if digits can cause repetition, the output could be astronomically large.

2. **Off-by-one errors with k indexing**: The problem states k is 1-indexed, but modulo arithmetic is cleaner with 0-indexing. Forgetting to convert between these causes wrong answers. Always clarify: "Should I work with 0-indexed or 1-indexed k internally?"

3. **Incorrect modulo operation when working backwards**: When encountering a digit `d`, you need to do `k = k % previous_length`, not `k = k % current_length`. The previous length is `current_length / d`. Getting this wrong maps k to the wrong position in the unrepeated string.

4. **Not using long integers for large values**: In Java, using `int` for `totalLength` and `k` can cause overflow. The decoded length can exceed 2^31, so use `long` for these variables.

## When You'll See This Pattern

This "work backwards with modulo" pattern appears in problems where:

1. You have exponential or multiplicative growth
2. You only need a specific element, not the entire structure
3. The structure has a recursive or repetitive nature

Related LeetCode problems:

- **"Number of Atoms" (LeetCode 726)**: Similar parsing with multipliers, though you build the entire output
- **"Basic Calculator" (LeetCode 224)**: Different but involves parsing expressions with nested operations
- **"Decode String" (LeetCode 394)**: Actually builds the decoded string using stacks, which is what many candidates initially try for this problem

The key difference from "Decode String" is that here we can't build the output—we must work mathematically.

## Key Takeaways

1. **When faced with exponential growth, think mathematically, not literally**: If a problem involves repetition or multiplication that creates huge outputs, look for a way to compute positions directly using division and modulo operations.

2. **Working backwards simplifies reduction**: When you need to find "which original element maps to this position in the expanded result," working backwards from the end lets you peel away layers of repetition efficiently.

3. **Boundary cases matter**: Pay special attention to when `k == 0` or `k == current_length` during the backward pass. These indicate you've found the character at a segment boundary.

[Practice this problem on CodeJeet](/problem/decoded-string-at-index)
