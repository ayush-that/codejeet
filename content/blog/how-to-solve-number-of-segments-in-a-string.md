---
title: "How to Solve Number of Segments in a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Segments in a String. Easy difficulty, 37.0% acceptance rate. Topics: String."
date: "2028-03-22"
category: "dsa-patterns"
tags: ["number-of-segments-in-a-string", "string", "easy"]
---

# How to Solve Number of Segments in a String

This problem asks you to count the number of "segments" in a string, where a segment is defined as a contiguous sequence of non-space characters. While it seems straightforward, the challenge lies in correctly handling edge cases like multiple consecutive spaces, leading/trailing spaces, and empty strings. Many candidates fail this "easy" problem because they don't carefully consider all these scenarios.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the string: `"   Hello,   world!   How are you?   "`

We need to count segments of non-space characters. Visually, we can think of walking through the string character by character:

1. Start with three spaces - no segment yet
2. `H` - this starts a new segment (segment 1: "Hello,")
3. Continue through `e`, `l`, `l`, `o`, `,` - still in the same segment
4. Three spaces - segment 1 ended
5. `w` - starts a new segment (segment 2: "world!")
6. Continue through `o`, `r`, `l`, `d`, `!` - still in segment 2
7. Three spaces - segment 2 ended
8. `H` - starts a new segment (segment 3: "How")
9. Space - segment 3 ended
10. `a` - starts a new segment (segment 4: "are")
11. Space - segment 4 ended
12. `y` - starts a new segment (segment 5: "you?")
13. Three spaces - segment 5 ended

Total segments: 5. The key insight is that a new segment begins whenever we transition from a space to a non-space character.

## Brute Force Approach

A naive approach might be to use string splitting functions like Python's `split()` or JavaScript's `split(' ')`. However, these often handle multiple spaces differently across languages, and some implementations might not correctly handle all edge cases. Another brute force approach would be to manually split the string by spaces and count non-empty strings:

```python
def countSegments(s):
    words = s.split(' ')
    count = 0
    for word in words:
        if word != '':
            count += 1
    return count
```

This works but isn't the most efficient approach since `split()` creates a list of all substrings, which uses O(n) extra space. More importantly, candidates who rely solely on built-in functions without understanding the underlying logic often struggle with edge cases and can't explain their solution clearly to interviewers.

## Optimal Solution

The optimal solution uses a single pass through the string with O(1) extra space. The algorithm is simple but requires careful handling of state:

1. Initialize a counter to 0
2. Iterate through each character in the string
3. Track whether we're currently "inside" a segment
4. When we transition from space to non-space, increment the counter
5. Return the counter

The key insight is that we increment our count at the **beginning** of each segment, which occurs when:

- The current character is not a space
- AND either:
  - We're at the first character of the string, OR
  - The previous character was a space

<div class="code-group">

```python
# Time: O(n) | Space: O(1) where n is the length of the string
def countSegments(s):
    """
    Count the number of segments (contiguous non-space characters) in a string.

    Args:
        s: Input string to analyze

    Returns:
        Number of segments in the string
    """
    count = 0  # Initialize segment counter

    # Iterate through each character in the string with its index
    for i in range(len(s)):
        # A segment starts when:
        # 1. Current character is not a space
        # 2. AND either we're at the first character OR previous character was a space
        if s[i] != ' ' and (i == 0 or s[i-1] == ' '):
            count += 1  # We found the beginning of a new segment

    return count
```

```javascript
// Time: O(n) | Space: O(1) where n is the length of the string
function countSegments(s) {
  /**
   * Count the number of segments (contiguous non-space characters) in a string.
   *
   * @param {string} s - Input string to analyze
   * @return {number} Number of segments in the string
   */
  let count = 0; // Initialize segment counter

  // Iterate through each character in the string with its index
  for (let i = 0; i < s.length; i++) {
    // A segment starts when:
    // 1. Current character is not a space
    // 2. AND either we're at the first character OR previous character was a space
    if (s[i] !== " " && (i === 0 || s[i - 1] === " ")) {
      count++; // We found the beginning of a new segment
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1) where n is the length of the string
class Solution {
    /**
     * Count the number of segments (contiguous non-space characters) in a string.
     *
     * @param s Input string to analyze
     * @return Number of segments in the string
     */
    public int countSegments(String s) {
        int count = 0;  // Initialize segment counter

        // Iterate through each character in the string with its index
        for (int i = 0; i < s.length(); i++) {
            // A segment starts when:
            // 1. Current character is not a space
            // 2. AND either we're at the first character OR previous character was a space
            if (s.charAt(i) != ' ' && (i == 0 || s.charAt(i-1) == ' ')) {
                count++;  // We found the beginning of a new segment
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the length of the input string. We make a single pass through the string, examining each character exactly once.

**Space Complexity:** O(1). We only use a constant amount of extra space (the `count` variable and loop index). This is an in-place algorithm that doesn't create any additional data structures proportional to the input size.

The linear time complexity is optimal because we must examine every character at least once to determine if it's part of a segment. The constant space complexity makes this solution memory-efficient.

## Common Mistakes

1. **Using built-in split without handling multiple spaces:** Many candidates write `return len(s.split())` in Python, which works but doesn't demonstrate understanding of the algorithm. In interviews, you need to show you can implement the logic yourself.

2. **Off-by-one errors with boundary conditions:** Forgetting to check `i == 0` when examining `s[i-1]` will cause an index out of bounds error. Always test your solution with empty strings and single-character strings.

3. **Incorrectly counting spaces as segments:** Some candidates count transitions from non-space to space instead of space to non-space. Remember: a segment **starts** when we go from space to non-space, not when it ends.

4. **Not handling trailing spaces:** With input like `"hello "`, some implementations might incorrectly try to start a new segment after the final space. Our condition `s[i] != ' '` prevents this.

5. **Assuming ASCII spaces only:** While the problem uses regular spaces, in real interviews you might need to handle other whitespace characters like tabs (`\t`) or newlines (`\n`). Always clarify requirements with your interviewer.

## When You'll See This Pattern

This "state transition" pattern appears in many string processing problems:

1. **Valid Palindrome (LeetCode 125):** Similar character-by-character comparison with careful handling of non-alphanumeric characters and case sensitivity.

2. **Reverse Words in a String (LeetCode 151):** Requires identifying word boundaries (segments) to reverse their order while maintaining internal character order.

3. **String Compression (LeetCode 443):** Counting consecutive identical characters uses a similar state-tracking approach.

4. **Count Binary Substrings (LeetCode 696):** Counting groups of consecutive 0s and 1s uses similar transition detection logic.

The core pattern is: **iterate through a sequence, track state changes, and take action on transitions between states.** This is a fundamental technique for many array and string problems.

## Key Takeaways

1. **State transitions are key:** Many string problems boil down to detecting transitions between states (space/non-space, digit/non-digit, etc.). Look for these patterns.

2. **Boundary conditions matter:** Always test with empty strings, single characters, strings with only spaces, and strings with multiple consecutive spaces.

3. **Single-pass O(1) space is often possible:** For many "easy" string problems, the optimal solution involves a single iteration with minimal extra storage.

4. **Understand, don't just memorize:** While built-in functions like `split()` might give the right answer, interviewers want to see that you understand the underlying algorithm.

[Practice this problem on CodeJeet](/problem/number-of-segments-in-a-string)
