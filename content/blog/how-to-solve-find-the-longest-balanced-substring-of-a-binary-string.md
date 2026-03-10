---
title: "How to Solve Find the Longest Balanced Substring of a Binary String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Longest Balanced Substring of a Binary String. Easy difficulty, 46.4% acceptance rate. Topics: String."
date: "2028-12-08"
category: "dsa-patterns"
tags: ["find-the-longest-balanced-substring-of-a-binary-string", "string", "easy"]
---

# How to Solve Find the Longest Balanced Substring of a Binary String

This problem asks us to find the longest substring in a binary string where all zeros come before all ones, and the counts of zeros and ones are equal. While the concept is straightforward, the challenge lies in efficiently scanning the string to track these balanced segments without checking every possible substring. The key insight is that balanced substrings must be contiguous blocks where zeros and ones appear in separate, adjacent groups.

## Visual Walkthrough

Let's trace through an example step by step: `s = "00111001"`

We need to find substrings where:

1. All zeros are before all ones (no mixing like "0101")
2. Number of zeros = number of ones

Let's manually check:

- Starting at index 0: "0011" has 2 zeros then 2 ones → balanced, length 4
- "001110" has 3 zeros then 3 ones but wait — after "0011" we have "10" which breaks the "all zeros before ones" rule. Actually "001110" contains "10" where 1 comes before 0, so it's not balanced.
- "111001" — zeros and ones are mixed, not balanced
- "11001" — mixed, not balanced
- "1001" — starts with 1, zeros not before ones
- "001" — only 2 zeros and 1 one, counts don't match
- "01" — 1 zero, 1 one → balanced, length 2
- "000111" doesn't exist in our string
- "1100" — zeros come after ones, not balanced

The longest balanced substring here is "0011" with length 4.

Now let's think about how to find this systematically. We need to look for transitions from zeros to ones and check if we have equal numbers on both sides of the transition point.

## Brute Force Approach

The brute force approach would check every possible substring `s[i:j]` and verify if it's balanced. For each substring:

1. Check that all zeros come before all ones (no '1' followed by '0' in the substring)
2. Count zeros and ones to ensure they're equal

This would take O(n³) time: O(n²) substrings, and O(n) to verify each one. Even with optimization, it's still O(n²), which is too slow for strings up to length 50 (though for this constraint, O(n²) might pass, but we can do better).

A slightly better brute force would be O(n²): for each starting index `i`, scan forward and track zeros and ones counts, resetting when we see a '1' followed by '0'. But we can optimize further.

## Optimal Solution

The optimal approach runs in O(n) time with O(1) space. The key insight is that balanced substrings must be of the form "00...011...1" where the zeros and ones are in contiguous blocks. We can scan through the string looking for transitions from zeros to ones, and at each transition, the balanced substring length is `2 * min(zeros_count, ones_count)`.

Here's the algorithm:

1. Initialize variables to track consecutive zeros and ones counts
2. Iterate through the string
3. When we see '0', if we were counting ones (previous char was '1'), reset zeros count
4. Increment zeros count for '0', ones count for '1'
5. After processing each '1', update the maximum balanced length: `2 * min(zeros_count, ones_count)`
6. Return the maximum length found

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findTheLongestBalancedSubstring(s: str) -> int:
    """
    Finds the longest balanced substring in a binary string.
    A balanced substring has all zeros before ones with equal counts.
    """
    max_length = 0
    zeros_count = 0
    ones_count = 0

    for i in range(len(s)):
        if s[i] == '0':
            # If previous character was '1', we're starting a new zero block
            # Reset zeros count since zeros must come before ones in balanced substring
            if i > 0 and s[i-1] == '1':
                zeros_count = 0
            zeros_count += 1
            # Reset ones count when we see zero because ones must follow zeros
            # in the same balanced substring
            ones_count = 0
        else:  # s[i] == '1'
            # Only count ones if we have seen zeros before in current block
            ones_count += 1
            # The balanced substring ending here has length 2 * min(zeros, ones)
            # We take min because we need equal numbers of zeros and ones
            current_length = 2 * min(zeros_count, ones_count)
            max_length = max(max_length, current_length)

    return max_length
```

```javascript
// Time: O(n) | Space: O(1)
function findTheLongestBalancedSubstring(s) {
  /**
   * Finds the longest balanced substring in a binary string.
   * A balanced substring has all zeros before ones with equal counts.
   */
  let maxLength = 0;
  let zerosCount = 0;
  let onesCount = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "0") {
      // If previous character was '1', we're starting a new zero block
      // Reset zeros count since zeros must come before ones in balanced substring
      if (i > 0 && s[i - 1] === "1") {
        zerosCount = 0;
      }
      zerosCount++;
      // Reset ones count when we see zero because ones must follow zeros
      // in the same balanced substring
      onesCount = 0;
    } else {
      // s[i] === '1'
      // Only count ones if we have seen zeros before in current block
      onesCount++;
      // The balanced substring ending here has length 2 * min(zeros, ones)
      // We take min because we need equal numbers of zeros and ones
      const currentLength = 2 * Math.min(zerosCount, onesCount);
      maxLength = Math.max(maxLength, currentLength);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int findTheLongestBalancedSubstring(String s) {
        /**
         * Finds the longest balanced substring in a binary string.
         * A balanced substring has all zeros before ones with equal counts.
         */
        int maxLength = 0;
        int zerosCount = 0;
        int onesCount = 0;

        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '0') {
                // If previous character was '1', we're starting a new zero block
                // Reset zeros count since zeros must come before ones in balanced substring
                if (i > 0 && s.charAt(i-1) == '1') {
                    zerosCount = 0;
                }
                zerosCount++;
                // Reset ones count when we see zero because ones must follow zeros
                // in the same balanced substring
                onesCount = 0;
            } else { // s.charAt(i) == '1'
                // Only count ones if we have seen zeros before in current block
                onesCount++;
                // The balanced substring ending here has length 2 * min(zeros, ones)
                // We take min because we need equal numbers of zeros and ones
                int currentLength = 2 * Math.min(zerosCount, onesCount);
                maxLength = Math.max(maxLength, currentLength);
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length n
- Each character is processed exactly once
- All operations inside the loop are O(1)

**Space Complexity: O(1)**

- We only use a few integer variables (max_length, zeros_count, ones_count)
- No additional data structures that scale with input size
- The input string is not modified

## Common Mistakes

1. **Not resetting counts properly at transitions**: When you see '0' after '1', you must reset the zeros count because a new balanced substring can only start with zeros. Similarly, when you see '0', you should reset ones count because ones must come after zeros in the same balanced substring.

2. **Checking balanced substrings only at the end of ones blocks**: Some candidates only update max_length when they see '0' after '1', but you should check after every '1' because balanced substrings can end anywhere within a ones block.

3. **Forgetting the `2 *` in the length calculation**: The balanced substring length is twice the minimum of zeros and ones counts (e.g., if you have 3 zeros and 2 ones, the balanced substring can only use 2 of each, giving length 4).

4. **Overcomplicating with stack or two-pass solutions**: While you could use a stack to track balances or make two passes (forward for zeros, backward for ones), the single-pass counting approach is simpler and more efficient.

## When You'll See This Pattern

This pattern of tracking consecutive counts and using `min()` to find balanced segments appears in several string problems:

1. **Maximum Nesting Depth of Parentheses (LeetCode 1614)**: Similar concept of tracking balance between opening and closing symbols.

2. **Longest Valid Parentheses (LeetCode 32)**: More complex but uses similar balance tracking with additional constraints.

3. **Count Binary Substrings (LeetCode 696)**: Almost identical pattern — count consecutive zeros and ones, and add `min(prev, curr)` to the result when the digit changes.

4. **Maximum Number of Balloons (LeetCode 1189)**: Uses similar `min()` of character counts to determine how many complete words can be formed.

The core technique is maintaining running counts of relevant characters and using minimums to find complete, balanced units.

## Key Takeaways

1. **Look for contiguous blocks**: When a problem requires balanced counts in substrings with ordering constraints (like all zeros before ones), the solution often involves finding contiguous blocks and checking boundaries between them.

2. **Single-pass counting is powerful**: Many string balance problems can be solved in O(n) time with O(1) space by maintaining running counts and resetting at appropriate boundaries.

3. **The `min()` function for balancing**: When you need equal numbers of two things, `min(count1, count2)` tells you how many complete pairs you can form. Multiply by 2 to get the total length.

Remember: For binary string problems with ordering constraints, think about transitions between character types and what needs to be reset when those transitions occur.

[Practice this problem on CodeJeet](/problem/find-the-longest-balanced-substring-of-a-binary-string)
