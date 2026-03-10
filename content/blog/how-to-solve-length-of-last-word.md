---
title: "How to Solve Length of Last Word — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Length of Last Word. Easy difficulty, 58.3% acceptance rate. Topics: String."
date: "2026-03-22"
category: "dsa-patterns"
tags: ["length-of-last-word", "string", "easy"]
---

# How to Solve Length of Last Word

This problem asks us to find the length of the last word in a string, where words are separated by spaces. While it seems straightforward, the challenge lies in handling edge cases like trailing spaces, multiple spaces between words, and empty strings. Many candidates fail because they don't properly account for these scenarios.

## Visual Walkthrough

Let's trace through an example: `"Hello World  "` (note the two trailing spaces)

**Step-by-step reasoning:**

1. Start from the end of the string: position 12 (last character is space)
2. Move left while we encounter spaces: positions 12 and 11 are both spaces
3. Now we're at position 10: character 'd' (start of last word "World")
4. Count characters while they're not spaces: 'd' (1), 'l' (2), 'r' (3), 'o' (4), 'W' (5)
5. Next character at position 5 is space, so we stop counting
6. Result: length = 5

Another example: `"a "`

1. Start from end: position 1 is space
2. Move left: position 0 is 'a' (not a space)
3. Count: 'a' (1)
4. We've reached the beginning, so stop
5. Result: length = 1

## Brute Force Approach

A naive approach might be to:

1. Split the string by spaces using `s.split()`
2. Filter out empty strings from multiple spaces
3. Take the last element and return its length

While this works, it's not the most efficient approach because:

- It creates multiple string objects (one for each word)
- It processes the entire string even when we only need the last word
- The split operation has to scan the entire string

However, for this particular problem, the brute force approach using `split()` is actually quite reasonable since the problem constraints are small. But in an interview, you should demonstrate you can solve it more efficiently by processing from the end.

## Optimal Solution

The optimal approach processes the string from the end to avoid unnecessary work:

1. Start from the last character and skip all trailing spaces
2. Once we find a non-space character, start counting
3. Continue counting until we hit a space or the beginning of the string

This approach only processes the necessary portion of the string and uses O(1) extra space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# We might traverse the entire string in worst case, but only once
def lengthOfLastWord(s: str) -> int:
    # Initialize length counter
    length = 0

    # Start from the end of the string
    i = len(s) - 1

    # Step 1: Skip all trailing spaces
    # We need to handle cases like "Hello World   " where there are spaces at the end
    while i >= 0 and s[i] == ' ':
        i -= 1

    # Step 2: Count characters of the last word
    # Now i points to the last character of the last word (or -1 if string is empty)
    while i >= 0 and s[i] != ' ':
        length += 1
        i -= 1

    return length
```

```javascript
// Time: O(n) | Space: O(1)
// We traverse from end to beginning, stopping at the first space before the last word
function lengthOfLastWord(s) {
  // Initialize length counter
  let length = 0;

  // Start from the end of the string
  let i = s.length - 1;

  // Step 1: Skip all trailing spaces
  // Important: This handles cases with spaces at the end of the string
  while (i >= 0 && s[i] === " ") {
    i--;
  }

  // Step 2: Count characters of the last word
  // Now i points to the last character of the last word
  // We count until we hit a space or reach the beginning
  while (i >= 0 && s[i] !== " ") {
    length++;
    i--;
  }

  return length;
}
```

```java
// Time: O(n) | Space: O(1)
// We only traverse the necessary portion from the end of the string
class Solution {
    public int lengthOfLastWord(String s) {
        // Initialize length counter
        int length = 0;

        // Start from the end of the string
        int i = s.length() - 1;

        // Step 1: Skip all trailing spaces
        // This is crucial for strings ending with spaces
        while (i >= 0 && s.charAt(i) == ' ') {
            i--;
        }

        // Step 2: Count characters of the last word
        // i now points to the last character of the last word
        // We count backwards until we find a space or reach string start
        while (i >= 0 && s.charAt(i) != ' ') {
            length++;
            i--;
        }

        return length;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we might traverse the entire string (e.g., when there are no spaces or only trailing spaces)
- However, we only traverse once from the end, and we stop as soon as we finish counting the last word
- This is optimal since we need to at least examine the last word

**Space Complexity: O(1)**

- We only use a constant amount of extra space (variables for index and length counter)
- No additional data structures are created
- The input string is not modified

## Common Mistakes

1. **Forgetting to handle trailing spaces**: This is the most common mistake. Candidates often start counting from the end without skipping spaces first, which gives incorrect results for strings like `"Hello World  "`.

2. **Not handling empty strings or strings with only spaces**: When the string is empty or contains only spaces, we should return 0. The solution handles this because the first while loop will decrement `i` to -1, and the second while loop won't execute.

3. **Using split() without considering multiple spaces**: If you use `s.split(' ')` (with a space as delimiter) instead of `s.split()` (which handles multiple spaces), you'll get empty strings in the array for consecutive spaces.

4. **Off-by-one errors in index manipulation**: When moving backwards through the string, it's easy to go out of bounds. Always check `i >= 0` before accessing `s[i]`.

## When You'll See This Pattern

This "traverse from the end" pattern appears in many string manipulation problems:

1. **Reverse String** (LeetCode 344): Similar backward traversal technique
2. **Valid Palindrome** (LeetCode 125): Often solved with two pointers, one from each end
3. **Reverse Words in a String** (LeetCode 151): Requires similar logic to identify word boundaries
4. **String Compression** (LeetCode 443): Sometimes processed from the end to avoid overwriting

The key insight is that when you only care about the end of a sequence (array or string), starting from the end can be more efficient than processing the entire sequence.

## Key Takeaways

1. **When a problem asks about the "last" something, consider processing from the end**. This often leads to simpler and more efficient solutions than processing from the beginning.

2. **Always test edge cases with spaces**: For string problems, test cases with leading spaces, trailing spaces, multiple consecutive spaces, and empty strings.

3. **The two-pointer technique isn't just for the beginning and end**: Here we use a single pointer moving backward, but the concept of starting from where the action is (the end of the string) is similar to the two-pointer intuition.

[Practice this problem on CodeJeet](/problem/length-of-last-word)
