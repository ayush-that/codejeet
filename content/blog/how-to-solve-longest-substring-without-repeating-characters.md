---
title: "How to Solve Longest Substring Without Repeating Characters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Substring Without Repeating Characters. Medium difficulty, 38.5% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2026-02-02"
category: "dsa-patterns"
tags:
  [
    "longest-substring-without-repeating-characters",
    "hash-table",
    "string",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Longest Substring Without Repeating Characters

Given a string `s`, we need to find the length of the longest contiguous substring that contains no duplicate characters. This problem is tricky because we need to efficiently track which characters we've seen and where they appeared, while expanding and contracting our search window intelligently.

## Visual Walkthrough

Let's trace through an example: `s = "abcabcbb"`

We'll use a sliding window approach with two pointers:

- `left` marks the start of our current substring
- `right` marks the end of our current substring
- We'll track characters we've seen in a hash map with their most recent index

Step-by-step:

1. Start: `left = 0`, `right = 0`, max length = 0
   - Window: `"a"` (no duplicates)
   - Max length = 1

2. `right = 1`: `"ab"` (no duplicates)
   - Max length = 2

3. `right = 2`: `"abc"` (no duplicates)
   - Max length = 3

4. `right = 3`: `"abca"` - duplicate 'a' found!
   - The first 'a' is at index 0
   - Move `left` to index 1 (past the first 'a')
   - Window: `"bca"`
   - Max length remains 3

5. `right = 4`: `"bcab"` - duplicate 'b' found!
   - The previous 'b' is at index 1
   - Move `left` to index 2 (past the previous 'b')
   - Window: `"cab"`
   - Max length remains 3

6. `right = 5`: `"cabc"` - duplicate 'c' found!
   - The previous 'c' is at index 2
   - Move `left` to index 3 (past the previous 'c')
   - Window: `"abc"`
   - Max length remains 3

7. `right = 6`: `"abcb"` - duplicate 'b' found!
   - The previous 'b' is at index 4
   - Move `left` to index 5 (past the previous 'b')
   - Window: `"cb"`
   - Max length remains 3

8. `right = 7`: `"cbb"` - duplicate 'b' found!
   - The previous 'b' is at index 6
   - Move `left` to index 7 (past the previous 'b')
   - Window: `"b"`
   - Max length remains 3

Final answer: 3 (substring `"abc"`)

## Brute Force Approach

The most straightforward approach is to check every possible substring and see if it contains duplicates:

1. Generate all possible substrings (O(n²) of them)
2. For each substring, check if all characters are unique (O(n) time with a set)
3. Track the maximum length of unique-character substrings

This gives us O(n³) time complexity, which is far too slow for typical constraints (n up to 5×10⁴).

Even with a slightly optimized brute force where we check uniqueness while expanding each substring, we still get O(n²) time, which is borderline for large inputs.

<div class="code-group">

```python
# Time: O(n³) | Space: O(min(n, m)) where m is character set size
def lengthOfLongestSubstring_brute(s: str) -> int:
    n = len(s)
    max_len = 0

    # Check all possible starting points
    for i in range(n):
        # Check all possible ending points
        for j in range(i, n):
            # Check if substring s[i:j+1] has all unique characters
            seen = set()
            has_duplicate = False

            for k in range(i, j + 1):
                if s[k] in seen:
                    has_duplicate = True
                    break
                seen.add(s[k])

            # If no duplicates, update max length
            if not has_duplicate:
                max_len = max(max_len, j - i + 1)

    return max_len
```

```javascript
// Time: O(n³) | Space: O(min(n, m)) where m is character set size
function lengthOfLongestSubstringBrute(s) {
  const n = s.length;
  let maxLen = 0;

  // Check all possible starting points
  for (let i = 0; i < n; i++) {
    // Check all possible ending points
    for (let j = i; j < n; j++) {
      // Check if substring s[i:j+1] has all unique characters
      const seen = new Set();
      let hasDuplicate = false;

      for (let k = i; k <= j; k++) {
        if (seen.has(s[k])) {
          hasDuplicate = true;
          break;
        }
        seen.add(s[k]);
      }

      // If no duplicates, update max length
      if (!hasDuplicate) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n³) | Space: O(min(n, m)) where m is character set size
public int lengthOfLongestSubstringBrute(String s) {
    int n = s.length();
    int maxLen = 0;

    // Check all possible starting points
    for (int i = 0; i < n; i++) {
        // Check all possible ending points
        for (int j = i; j < n; j++) {
            // Check if substring s[i:j+1] has all unique characters
            Set<Character> seen = new HashSet<>();
            boolean hasDuplicate = false;

            for (int k = i; k <= j; k++) {
                if (seen.contains(s.charAt(k))) {
                    hasDuplicate = true;
                    break;
                }
                seen.add(s.charAt(k));
            }

            // If no duplicates, update max length
            if (!hasDuplicate) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every substring from scratch. We can use a **sliding window** approach:

1. Maintain a window `[left, right]` that contains only unique characters
2. Expand the window by moving `right` pointer to the right
3. When we encounter a duplicate character, we need to shrink the window from the left until the duplicate is removed
4. Track the maximum window size we've seen

The optimization comes from using a hash map to store the **most recent index** of each character. When we find a duplicate:

- We don't just move `left` by 1 (which would be O(n²) worst case)
- Instead, we jump `left` directly to `max(left, last_seen_index + 1)`
- This ensures we skip past the previous occurrence of the duplicate character

This approach gives us O(n) time complexity since each character is processed at most twice (once by `right`, once by `left`).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(min(n, m)) where m is character set size
def lengthOfLongestSubstring(s: str) -> int:
    """
    Find the length of the longest substring without repeating characters.

    Args:
        s: Input string

    Returns:
        Maximum length of substring with all unique characters
    """
    # Dictionary to store the most recent index of each character
    char_index = {}

    # Left pointer of the sliding window
    left = 0

    # Maximum length found so far
    max_length = 0

    # Iterate through the string with right pointer
    for right in range(len(s)):
        current_char = s[right]

        # If we've seen this character before and it's within our current window
        if current_char in char_index and char_index[current_char] >= left:
            # Move left pointer to just after the previous occurrence
            # This ensures we remove the duplicate from our window
            left = char_index[current_char] + 1

        # Update the most recent index of this character
        char_index[current_char] = right

        # Calculate current window length and update max if needed
        # Window is from left to right (inclusive)
        current_length = right - left + 1
        max_length = max(max_length, current_length)

    return max_length
```

```javascript
// Time: O(n) | Space: O(min(n, m)) where m is character set size
function lengthOfLongestSubstring(s) {
  /**
   * Find the length of the longest substring without repeating characters.
   *
   * @param {string} s - Input string
   * @return {number} Maximum length of substring with all unique characters
   */
  // Map to store the most recent index of each character
  const charIndex = new Map();

  // Left pointer of the sliding window
  let left = 0;

  // Maximum length found so far
  let maxLength = 0;

  // Iterate through the string with right pointer
  for (let right = 0; right < s.length; right++) {
    const currentChar = s[right];

    // If we've seen this character before and it's within our current window
    if (charIndex.has(currentChar) && charIndex.get(currentChar) >= left) {
      // Move left pointer to just after the previous occurrence
      // This ensures we remove the duplicate from our window
      left = charIndex.get(currentChar) + 1;
    }

    // Update the most recent index of this character
    charIndex.set(currentChar, right);

    // Calculate current window length and update max if needed
    // Window is from left to right (inclusive)
    const currentLength = right - left + 1;
    maxLength = Math.max(maxLength, currentLength);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(min(n, m)) where m is character set size
public int lengthOfLongestSubstring(String s) {
    /**
     * Find the length of the longest substring without repeating characters.
     *
     * @param s Input string
     * @return Maximum length of substring with all unique characters
     */
    // Map to store the most recent index of each character
    Map<Character, Integer> charIndex = new HashMap<>();

    // Left pointer of the sliding window
    int left = 0;

    // Maximum length found so far
    int maxLength = 0;

    // Iterate through the string with right pointer
    for (int right = 0; right < s.length(); right++) {
        char currentChar = s.charAt(right);

        // If we've seen this character before and it's within our current window
        if (charIndex.containsKey(currentChar) && charIndex.get(currentChar) >= left) {
            // Move left pointer to just after the previous occurrence
            // This ensures we remove the duplicate from our window
            left = charIndex.get(currentChar) + 1;
        }

        // Update the most recent index of this character
        charIndex.put(currentChar, right);

        // Calculate current window length and update max if needed
        // Window is from left to right (inclusive)
        int currentLength = right - left + 1;
        maxLength = Math.max(maxLength, currentLength);
    }

    return maxLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once with the `right` pointer (n iterations)
- Each iteration does O(1) operations (hash map lookups and updates)
- The `left` pointer moves at most n times total, so amortized O(1) per iteration

**Space Complexity: O(min(n, m))**

- We store at most one entry per unique character in the hash map
- `m` is the size of the character set (e.g., 26 for lowercase English letters, 128 for ASCII)
- In the worst case, if all characters are unique, we store n entries
- So space is bounded by min(n, m)

## Common Mistakes

1. **Forgetting to check if the duplicate is within the current window**: When we find a character we've seen before, we need to verify that its last occurrence is at or after `left`. Otherwise, we might incorrectly shrink the window. Example: `"abba"` - when we get to the second 'a', the first 'a' is already outside our window.

2. **Using a set instead of a map for tracking indices**: A set can tell us if we've seen a character, but not where. This forces us to increment `left` one by one until we remove the duplicate, giving O(n²) worst-case time (e.g., `"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"` repeated).

3. **Not handling empty string**: Always check for edge cases. The function should return 0 for an empty string.

4. **Off-by-one errors in window length calculation**: Remember that `right - left + 1` gives the correct length for inclusive bounds. Using just `right - left` underestimates by 1.

## When You'll See This Pattern

The sliding window pattern with character frequency/index tracking appears in many string and array problems:

1. **Longest Substring with At Most Two Distinct Characters** (Medium): Same sliding window approach, but we track counts of characters and shrink when we have more than 2 distinct characters.

2. **Longest Substring with At Most K Distinct Characters** (Medium): Generalization of the previous problem. We maintain a map of character counts and shrink when we exceed k distinct characters.

3. **Minimum Window Substring** (Hard): More complex sliding window where we need to find the minimum window containing all characters from a target string. Uses similar two-pointer technique with frequency tracking.

4. **Subarrays with K Different Integers** (Hard): Array version of this pattern, using sliding window to count subarrays with exactly k distinct integers.

## Key Takeaways

1. **Sliding window is ideal for "longest substring" problems**: When you need to find a contiguous subsequence that satisfies some condition, think about using two pointers to define a window that you can expand and contract.

2. **Hash maps track more than just existence**: Storing indices or counts in a hash map allows for O(1) lookups and enables efficient window adjustments without scanning.

3. **The "jump" optimization is crucial**: When you find a duplicate, don't just increment `left` by 1. Jump it to `last_seen_index + 1` to maintain O(n) time complexity.

Related problems: [Longest Substring with At Most Two Distinct Characters](/problem/longest-substring-with-at-most-two-distinct-characters), [Longest Substring with At Most K Distinct Characters](/problem/longest-substring-with-at-most-k-distinct-characters), [Subarrays with K Different Integers](/problem/subarrays-with-k-different-integers)
