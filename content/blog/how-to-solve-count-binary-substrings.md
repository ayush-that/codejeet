---
title: "How to Solve Count Binary Substrings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Binary Substrings. Easy difficulty, 70.3% acceptance rate. Topics: Two Pointers, String."
date: "2027-09-13"
category: "dsa-patterns"
tags: ["count-binary-substrings", "two-pointers", "string", "easy"]
---

# How to Solve Count Binary Substrings

This problem asks us to count all non-empty substrings of a binary string where:

1. The substring has equal numbers of 0's and 1's
2. All 0's are consecutive and all 1's are consecutive (they appear as a single group)

What makes this problem interesting is that while it seems like we need to check many substrings, there's a clever observation that lets us solve it efficiently. The consecutive grouping requirement means valid substrings always look like "000111" or "1100" - never "010101".

## Visual Walkthrough

Let's trace through an example: `s = "00110011"`

We need to find all substrings with equal consecutive groups. Let's break this down:

1. **First, identify consecutive groups:**
   - "00" (2 zeros)
   - "11" (2 ones)
   - "00" (2 zeros)
   - "11" (2 ones)

2. **Valid substrings occur at boundaries between groups:**
   - Between first "00" and first "11": We can form "0011" (full groups) and "01" (just the boundary)
     - "0011" uses all 2 zeros and 2 ones
     - "01" uses 1 zero and 1 one from the boundary
     - Total: 2 valid substrings from this boundary
   - Between first "11" and second "00": "1100" and "10"
     - "1100" uses all 2 ones and 2 zeros
     - "10" uses 1 one and 1 zero from the boundary
     - Total: 2 more substrings
   - Between second "00" and second "11": "0011" and "01"
     - Another 2 substrings

3. **Total count:** 2 + 2 + 2 = 6 valid substrings

The key insight: For any adjacent groups of zeros and ones, the number of valid substrings equals the minimum of their lengths. This works because we can take substrings starting from the end of the first group and ending at various points in the second group.

## Brute Force Approach

A naive approach would check every possible substring:

1. Generate all substrings (O(n²) substrings)
2. For each substring:
   - Check if it has equal zeros and ones
   - Check if zeros and ones are consecutive
3. Count valid substrings

This approach has O(n³) time complexity (O(n²) substrings × O(n) to check each one), which is far too slow for strings up to length 50,000.

Even with optimization, checking each substring individually is inefficient because we're doing redundant work. We need to recognize the pattern that valid substrings always span group boundaries.

## Optimal Solution

The optimal solution uses a single pass through the string with O(1) extra space:

1. Track the current consecutive group length and the previous group length
2. Whenever we encounter a change from 0 to 1 or 1 to 0:
   - The number of valid substrings ending at this position is min(current, previous)
   - Add this to our total count
   - Update previous to current, reset current to 1
3. If the character is the same as previous, increment current count

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countBinarySubstrings(s: str) -> int:
    """
    Count substrings with equal consecutive zeros and ones.

    Approach: Track lengths of consecutive groups. For each boundary
    between groups, the number of valid substrings equals the minimum
    of the two group lengths.
    """
    if not s or len(s) < 2:
        return 0

    prev_count = 0  # Length of previous consecutive group
    curr_count = 1  # Length of current consecutive group
    result = 0      # Total count of valid substrings

    # Start from second character (index 1)
    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            # Same character as previous, extend current group
            curr_count += 1
        else:
            # Character changed: we've reached a group boundary
            # Add min(prev_count, curr_count) to result
            # This counts all valid substrings ending at previous position
            result += min(prev_count, curr_count)

            # Update for next iteration
            prev_count = curr_count  # Current becomes previous
            curr_count = 1           # Start new current group

    # Don't forget the last boundary!
    # After loop ends, add substrings from last boundary
    result += min(prev_count, curr_count)

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function countBinarySubstrings(s) {
  /**
   * Count substrings with equal consecutive zeros and ones.
   *
   * Approach: Track lengths of consecutive groups. For each boundary
   * between groups, the number of valid substrings equals the minimum
   * of the two group lengths.
   */
  if (!s || s.length < 2) {
    return 0;
  }

  let prevCount = 0; // Length of previous consecutive group
  let currCount = 1; // Length of current consecutive group
  let result = 0; // Total count of valid substrings

  // Iterate through string starting from second character
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      // Same character as previous, extend current group
      currCount++;
    } else {
      // Character changed: we've reached a group boundary
      // Add min(prevCount, currCount) to result
      // This counts all valid substrings ending at previous position
      result += Math.min(prevCount, currCount);

      // Update for next iteration
      prevCount = currCount; // Current becomes previous
      currCount = 1; // Start new current group
    }
  }

  // Don't forget the last boundary!
  // After loop ends, add substrings from last boundary
  result += Math.min(prevCount, currCount);

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countBinarySubstrings(String s) {
        /**
         * Count substrings with equal consecutive zeros and ones.
         *
         * Approach: Track lengths of consecutive groups. For each boundary
         * between groups, the number of valid substrings equals the minimum
         * of the two group lengths.
         */
        if (s == null || s.length() < 2) {
            return 0;
        }

        int prevCount = 0;  // Length of previous consecutive group
        int currCount = 1;  // Length of current consecutive group
        int result = 0;     // Total count of valid substrings

        // Iterate through string starting from second character
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                // Same character as previous, extend current group
                currCount++;
            } else {
                // Character changed: we've reached a group boundary
                // Add min(prevCount, currCount) to result
                // This counts all valid substrings ending at previous position
                result += Math.min(prevCount, currCount);

                // Update for next iteration
                prevCount = currCount;  // Current becomes previous
                currCount = 1;          // Start new current group
            }
        }

        // Don't forget the last boundary!
        // After loop ends, add substrings from last boundary
        result += Math.min(prevCount, currCount);

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length n
- Each character is examined exactly once
- All operations inside the loop are O(1)

**Space Complexity: O(1)**

- We use only a constant amount of extra space (prev_count, curr_count, result, loop index)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the last boundary:** Many candidates forget to add `min(prev_count, curr_count)` after the loop ends. The loop processes boundaries when characters change, but the last boundary (between last two groups) isn't processed inside the loop since there's no character after the last one to trigger a change.

2. **Incorrect initialization:** Starting with `prev_count = 0` and `curr_count = 1` is correct because we begin counting the first group when we see the first character. Starting both at 0 or 1 leads to off-by-one errors.

3. **Overcounting or undercounting at boundaries:** Remember that for two adjacent groups of lengths 3 and 2, we get `min(3, 2) = 2` valid substrings, not 3 or 5. This is because we can only take substrings as long as the shorter group allows while maintaining the equal count property.

4. **Not handling edge cases:** Always check for empty strings, single-character strings, or very short strings. For `"0"` or `"1"`, the answer should be 0 since no substring can have equal zeros and ones.

## When You'll See This Pattern

This "group compression" or "run-length encoding" pattern appears in many string problems:

1. **String Compression (LeetCode 443):** Similar group counting but with different output requirements.
2. **Max Consecutive Ones (LeetCode 485):** Finding maximum length of consecutive groups.
3. **Partition Labels (LeetCode 763):** Uses similar boundary tracking between groups.
4. **Longest Turbulent Subarray (LeetCode 978):** Tracks alternating patterns similar to group boundaries.

The core technique is recognizing that you don't need to examine every substring individually when the problem has constraints about consecutive characters. Instead, compress the string into groups and reason about boundaries between them.

## Key Takeaways

1. **Look for consecutive patterns:** When a problem mentions "consecutive" or "grouped" characters, consider compressing the string into runs of identical characters. This often reduces O(n²) substring checking to O(n) group processing.

2. **Boundaries are key:** Valid substrings often span boundaries between different character groups. Counting at boundaries is more efficient than checking every possible substring.

3. **The min() trick:** When you have two adjacent groups, the number of valid crossing substrings is limited by the smaller group. This is a common pattern in problems with balanced requirements.

4. **Single pass with O(1) space:** Many "Easy" string problems that seem to require checking substrings can actually be solved with a single pass and minimal extra memory by tracking just a few variables.

Related problems: [Encode and Decode Strings](/problem/encode-and-decode-strings), [Number of Substrings With Fixed Ratio](/problem/number-of-substrings-with-fixed-ratio), [Count the Number of Substrings With Dominant Ones](/problem/count-the-number-of-substrings-with-dominant-ones)
