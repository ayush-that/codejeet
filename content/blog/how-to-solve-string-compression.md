---
title: "How to Solve String Compression — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode String Compression. Medium difficulty, 59.6% acceptance rate. Topics: Two Pointers, String."
date: "2026-10-10"
category: "dsa-patterns"
tags: ["string-compression", "two-pointers", "string", "medium"]
---

# How to Solve String Compression

String compression is a classic two-pointer problem that tests your ability to modify arrays in-place while tracking multiple indices. The challenge comes from needing to compress groups of consecutive characters and write the result back into the original array, all in a single pass. What makes this interesting is that you're not just counting characters—you're modifying the input array as you go, which requires careful index management.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the input: `["a","a","b","b","c","c","c"]`

We want to compress this by counting consecutive groups:

- First group: "a" appears 2 times → "a2"
- Second group: "b" appears 2 times → "b2"
- Third group: "c" appears 3 times → "c3"

The compressed string would be "a2b2c3", which has length 6. But here's the twist: we need to write this back into the original array and return the new length (6).

Let's walk through the process step by step:

1. Start at index 0, character "a"
2. Count how many "a"s: we find 2 consecutive "a"s
3. Write "a" at position 0 (write pointer = 0)
4. Since count > 1, write "2" at position 1 (write pointer = 1)
5. Move to next group starting at index 2, character "b"
6. Count 2 consecutive "b"s
7. Write "b" at position 2 (write pointer = 2)
8. Write "2" at position 3 (write pointer = 3)
9. Move to next group starting at index 4, character "c"
10. Count 3 consecutive "c"s
11. Write "c" at position 4 (write pointer = 4)
12. Write "3" at position 5 (write pointer = 5)

The array now contains `["a","2","b","2","c","3","c"]` in the first 6 positions, and we return 6.

## Brute Force Approach

A naive approach would be to build a separate compressed string and then copy it back. Here's what that might look like:

1. Create an empty string `result`
2. Iterate through the array, counting consecutive characters
3. For each group, append the character and its count (if > 1) to `result`
4. Copy each character from `result` back into the original array
5. Return the length of `result`

While this approach is conceptually simple, it has two main issues:

1. It uses O(n) extra space for the `result` string
2. It requires two passes over the data (one to build the string, one to copy it back)

The problem asks for in-place modification, and while the brute force technically works, it's not optimal in terms of space usage. More importantly, interviewers expect the two-pointer in-place solution for this problem.

## Optimized Approach

The key insight is that we can use **two pointers** to read and write in the same array simultaneously:

1. **Read pointer (`i`)**: Moves through the array to find groups of consecutive characters
2. **Write pointer (`write_idx`)**: Tracks where to write the compressed result

The algorithm works like this:

- Start both pointers at index 0
- Use the read pointer to find the end of the current character group
- Write the character at the write pointer position
- If the group length > 1, convert the count to string and write each digit
- Move the read pointer to the start of the next group
- Continue until we've processed all characters

The tricky part is handling multi-digit counts. For example, if we have 12 consecutive "a"s, we need to write "a", "1", "2" — three characters total.

## Optimal Solution

Here's the complete solution using the two-pointer technique:

<div class="code-group">

```python
# Time: O(n) where n is the length of chars
# Space: O(1) since we modify the array in-place
def compress(chars):
    """
    Compress the array in-place using two pointers.
    Returns the new length of the compressed array.
    """
    # Initialize write pointer - tracks where to write compressed result
    write_idx = 0
    # Initialize read pointer
    i = 0
    n = len(chars)

    while i < n:
        # Current character we're processing
        current_char = chars[i]
        # Count consecutive occurrences of current_char
        count = 0

        # Move through the array while we see the same character
        while i < n and chars[i] == current_char:
            i += 1
            count += 1

        # Write the character at write_idx position
        chars[write_idx] = current_char
        write_idx += 1

        # If count > 1, we need to write the count as well
        if count > 1:
            # Convert count to string and write each digit separately
            # This handles multi-digit counts like 12 -> "1", "2"
            for digit in str(count):
                chars[write_idx] = digit
                write_idx += 1

    # Return the new length (write_idx is now at the end of compressed array)
    return write_idx
```

```javascript
// Time: O(n) where n is the length of chars
// Space: O(1) since we modify the array in-place
function compress(chars) {
  /**
   * Compress the array in-place using two pointers.
   * Returns the new length of the compressed array.
   */
  // Initialize write pointer - tracks where to write compressed result
  let writeIdx = 0;
  // Initialize read pointer
  let i = 0;
  const n = chars.length;

  while (i < n) {
    // Current character we're processing
    const currentChar = chars[i];
    // Count consecutive occurrences of currentChar
    let count = 0;

    // Move through the array while we see the same character
    while (i < n && chars[i] === currentChar) {
      i++;
      count++;
    }

    // Write the character at writeIdx position
    chars[writeIdx] = currentChar;
    writeIdx++;

    // If count > 1, we need to write the count as well
    if (count > 1) {
      // Convert count to string and write each digit separately
      // This handles multi-digit counts like 12 -> "1", "2"
      const countStr = count.toString();
      for (let j = 0; j < countStr.length; j++) {
        chars[writeIdx] = countStr[j];
        writeIdx++;
      }
    }
  }

  // Return the new length (writeIdx is now at the end of compressed array)
  return writeIdx;
}
```

```java
// Time: O(n) where n is the length of chars
// Space: O(1) since we modify the array in-place
class Solution {
    public int compress(char[] chars) {
        /**
         * Compress the array in-place using two pointers.
         * Returns the new length of the compressed array.
         */
        // Initialize write pointer - tracks where to write compressed result
        int writeIdx = 0;
        // Initialize read pointer
        int i = 0;
        int n = chars.length;

        while (i < n) {
            // Current character we're processing
            char currentChar = chars[i];
            // Count consecutive occurrences of currentChar
            int count = 0;

            // Move through the array while we see the same character
            while (i < n && chars[i] == currentChar) {
                i++;
                count++;
            }

            // Write the character at writeIdx position
            chars[writeIdx] = currentChar;
            writeIdx++;

            // If count > 1, we need to write the count as well
            if (count > 1) {
                // Convert count to string and write each digit separately
                // This handles multi-digit counts like 12 -> "1", "2"
                String countStr = Integer.toString(count);
                for (int j = 0; j < countStr.length(); j++) {
                    chars[writeIdx] = countStr.charAt(j);
                    writeIdx++;
                }
            }
        }

        // Return the new length (writeIdx is now at the end of compressed array)
        return writeIdx;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We pass through the array once with our read pointer `i`
- Each character is read exactly once
- Writing the compressed result also happens in a single pass
- Even though we have nested while loops, each character is processed only once, so total operations are linear

**Space Complexity: O(1)**

- We modify the array in-place without using additional data structures
- We only use a few integer variables for pointers and counts
- The problem states we can assume the input array has enough space for the compressed result

## Common Mistakes

1. **Forgetting to handle multi-digit counts**: When a character appears 12 times, you need to write "1" and "2" as separate characters. Some candidates write the integer directly or convert it to a single character, which fails for counts ≥ 10.

2. **Incorrect pointer management**: The most common error is mixing up the read and write pointers. Remember: the read pointer (`i`) finds groups, and the write pointer (`write_idx`) writes the compressed result. They move at different rates.

3. **Not returning the correct length**: You must return the new length of the compressed portion, not the length of the original array. The write pointer's final position gives you this length.

4. **Modifying the array while reading**: If you try to write compressed results starting from index 0 while still reading from index 0, you'll overwrite characters you haven't processed yet. The two-pointer approach avoids this by separating reading and writing.

## When You'll See This Pattern

The two-pointer technique for in-place array modification appears in many problems:

1. **Remove Duplicates from Sorted Array (LeetCode 26)**: Similar pattern of using read/write pointers to modify array in-place while skipping duplicates.

2. **Move Zeroes (LeetCode 283)**: Use two pointers to move non-zero elements to the front while maintaining relative order.

3. **Sort Colors (LeetCode 75)**: The Dutch National Flag problem uses three pointers to sort an array in one pass.

The core pattern is: when you need to modify an array based on some condition while preserving some elements, consider using separate pointers for reading and writing.

## Key Takeaways

1. **Two-pointer in-place modification**: When a problem asks to modify an array in-place, consider using separate read and write pointers. This pattern allows O(1) space complexity.

2. **Group processing with while loops**: When you need to process consecutive groups of elements, use a while loop inside your main loop to count or process the entire group at once.

3. **Digit handling for counts**: Remember that counts ≥ 10 need to be written as multiple characters. Convert the integer to a string and iterate through its digits.

This problem teaches you to think carefully about index management when modifying data structures in-place—a crucial skill for optimizing algorithms.

Related problems: [Count and Say](/problem/count-and-say), [Encode and Decode Strings](/problem/encode-and-decode-strings), [Design Compressed String Iterator](/problem/design-compressed-string-iterator)
