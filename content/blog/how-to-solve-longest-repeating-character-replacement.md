---
title: "How to Solve Longest Repeating Character Replacement — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Repeating Character Replacement. Medium difficulty, 59.1% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2026-07-19"
category: "dsa-patterns"
tags:
  ["longest-repeating-character-replacement", "hash-table", "string", "sliding-window", "medium"]
---

# How to Solve Longest Repeating Character Replacement

You're given a string `s` and an integer `k`. You can change any character to any other uppercase English character at most `k` times. Your task is to find the length of the longest substring that can be made entirely of the same character after these changes.

What makes this problem interesting is that it looks like a string manipulation problem but is actually a classic sliding window challenge. The key insight is that we don't actually need to track which characters we're changing—we just need to know if a window is "valid" (can be made uniform with ≤ k changes).

## Visual Walkthrough

Let's trace through an example: `s = "AABABBA"`, `k = 1`

We'll use a sliding window approach with two pointers: `left` and `right`. We'll also track character frequencies within our current window.

**Step 1:** Window = "A" (left=0, right=0)

- Frequency: {'A': 1}
- Most frequent char count = 1
- Window length = 1
- Changes needed = 1 - 1 = 0 ≤ k ✓
- Max length = 1

**Step 2:** Window = "AA" (left=0, right=1)

- Frequency: {'A': 2}
- Most frequent = 2
- Window length = 2
- Changes needed = 2 - 2 = 0 ≤ k ✓
- Max length = 2

**Step 3:** Window = "AAB" (left=0, right=2)

- Frequency: {'A': 2, 'B': 1}
- Most frequent = 2 (A)
- Window length = 3
- Changes needed = 3 - 2 = 1 ≤ k ✓
- Max length = 3

**Step 4:** Window = "AABA" (left=0, right=3)

- Frequency: {'A': 3, 'B': 1}
- Most frequent = 3 (A)
- Window length = 4
- Changes needed = 4 - 3 = 1 ≤ k ✓
- Max length = 4

**Step 5:** Window = "AABAB" (left=0, right=4)

- Frequency: {'A': 3, 'B': 2}
- Most frequent = 3 (A)
- Window length = 5
- Changes needed = 5 - 3 = 2 > k ✗
- Need to shrink window from left

**Step 6:** Shrink window to "ABAB" (left=1, right=4)

- Frequency: {'A': 2, 'B': 2}
- Most frequent = 2
- Window length = 4
- Changes needed = 4 - 2 = 2 > k ✗
- Shrink again

**Step 7:** Shrink window to "BAB" (left=2, right=4)

- Frequency: {'A': 1, 'B': 2}
- Most frequent = 2 (B)
- Window length = 3
- Changes needed = 3 - 2 = 1 ≤ k ✓
- Max length remains 4

**Step 8:** Expand to "BABB" (left=2, right=5)

- Frequency: {'A': 1, 'B': 3}
- Most frequent = 3 (B)
- Window length = 4
- Changes needed = 4 - 3 = 1 ≤ k ✓
- Max length = 4

**Step 9:** Expand to "BABBA" (left=2, right=6)

- Frequency: {'A': 2, 'B': 3}
- Most frequent = 3 (B)
- Window length = 5
- Changes needed = 5 - 3 = 2 > k ✗
- Shrink window

**Final result:** The longest valid substring we found has length 4.

## Brute Force Approach

A naive approach would be to check every possible substring. For each substring:

1. Count the frequency of each character
2. Find the most frequent character
3. Calculate: (substring length) - (count of most frequent character)
4. If this difference ≤ k, the substring is valid

This approach has O(n³) time complexity (O(n²) substrings × O(n) to count frequencies) which is far too slow for typical constraints (n up to 10⁵).

Even with optimization, the brute force would be O(n²) which still times out. We need something better.

## Optimized Approach

The key insight is that we can use a **sliding window** with two pointers. Here's the reasoning:

1. **What makes a window valid?** A window is valid if `(window length) - (count of most frequent character in window) ≤ k`. This means we can change the other characters to match the most frequent one within k operations.

2. **Why sliding window works:** As we expand the window to the right, the "changes needed" can only increase or stay the same. When it exceeds k, we need to shrink from the left.

3. **Tracking the most frequent character:** We need to know the count of the most frequent character in our current window. A hash map (dictionary) works well for this.

4. **The clever optimization:** We don't actually need to find the absolute maximum frequency in the window at every step. We just need to know if our window could be valid. We track the maximum frequency we've seen so far, and only update it when we see a new character that could become the new maximum.

5. **Why this optimization works:** When we shrink the window, the maximum frequency might decrease, but that's okay because:
   - If the true maximum decreases, our tracked maximum might be higher than actual
   - But this doesn't matter because we only care if `window length - max_freq ≤ k`
   - Having an overestimated max_freq makes our condition stricter (harder to satisfy)
   - So we might shrink more than necessary, but we won't miss valid windows

## Optimal Solution

Here's the complete solution using the sliding window approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(26) = O(1) since we only store uppercase English letters
def characterReplacement(s: str, k: int) -> int:
    """
    Finds the length of the longest substring that can be made
    with the same character using at most k replacements.

    Args:
        s: Input string (uppercase English letters only)
        k: Maximum number of character changes allowed

    Returns:
        Length of the longest valid substring
    """
    # Dictionary to store frequency of each character in current window
    char_count = {}

    # Left pointer of sliding window
    left = 0

    # Track the maximum frequency of any character in current window
    max_freq = 0

    # Result: length of longest valid substring found
    max_length = 0

    # Expand window by moving right pointer through the string
    for right in range(len(s)):
        # Add current character to frequency count
        char_count[s[right]] = char_count.get(s[right], 0) + 1

        # Update max_freq if current character's count is higher
        max_freq = max(max_freq, char_count[s[right]])

        # Calculate current window length
        window_length = right - left + 1

        # Check if current window is valid
        # If changes needed > k, shrink window from left
        if window_length - max_freq > k:
            # Remove leftmost character from frequency count
            char_count[s[left]] -= 1

            # Note: we don't update max_freq here even though it might decrease
            # This is the key optimization - we only need to know if the window
            # could be valid, and an overestimated max_freq makes our check stricter

            # Move left pointer to shrink window
            left += 1

            # Recalculate window length after shrinking
            window_length = right - left + 1

        # Update max_length if current window is longer
        max_length = max(max_length, window_length)

    return max_length
```

```javascript
// Time: O(n) | Space: O(26) = O(1) since we only store uppercase English letters
function characterReplacement(s, k) {
  /**
   * Finds the length of the longest substring that can be made
   * with the same character using at most k replacements.
   *
   * @param {string} s - Input string (uppercase English letters only)
   * @param {number} k - Maximum number of character changes allowed
   * @return {number} Length of the longest valid substring
   */

  // Object to store frequency of each character in current window
  const charCount = {};

  // Left pointer of sliding window
  let left = 0;

  // Track the maximum frequency of any character in current window
  let maxFreq = 0;

  // Result: length of longest valid substring found
  let maxLength = 0;

  // Expand window by moving right pointer through the string
  for (let right = 0; right < s.length; right++) {
    // Add current character to frequency count
    const currentChar = s[right];
    charCount[currentChar] = (charCount[currentChar] || 0) + 1;

    // Update maxFreq if current character's count is higher
    maxFreq = Math.max(maxFreq, charCount[currentChar]);

    // Calculate current window length
    let windowLength = right - left + 1;

    // Check if current window is valid
    // If changes needed > k, shrink window from left
    if (windowLength - maxFreq > k) {
      // Remove leftmost character from frequency count
      const leftChar = s[left];
      charCount[leftChar]--;

      // Note: we don't update maxFreq here even though it might decrease
      // This is the key optimization - we only need to know if the window
      // could be valid, and an overestimated maxFreq makes our check stricter

      // Move left pointer to shrink window
      left++;

      // Recalculate window length after shrinking
      windowLength = right - left + 1;
    }

    // Update maxLength if current window is longer
    maxLength = Math.max(maxLength, windowLength);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(26) = O(1) since we only store uppercase English letters
class Solution {
    public int characterReplacement(String s, int k) {
        /**
         * Finds the length of the longest substring that can be made
         * with the same character using at most k replacements.
         *
         * @param s Input string (uppercase English letters only)
         * @param k Maximum number of character changes allowed
         * @return Length of the longest valid substring
         */

        // Array to store frequency of each character in current window
        // Index 0-25 correspond to 'A'-'Z'
        int[] charCount = new int[26];

        // Left pointer of sliding window
        int left = 0;

        // Track the maximum frequency of any character in current window
        int maxFreq = 0;

        // Result: length of longest valid substring found
        int maxLength = 0;

        // Expand window by moving right pointer through the string
        for (int right = 0; right < s.length(); right++) {
            // Add current character to frequency count
            char currentChar = s.charAt(right);
            int charIndex = currentChar - 'A';
            charCount[charIndex]++;

            // Update maxFreq if current character's count is higher
            maxFreq = Math.max(maxFreq, charCount[charIndex]);

            // Calculate current window length
            int windowLength = right - left + 1;

            // Check if current window is valid
            // If changes needed > k, shrink window from left
            if (windowLength - maxFreq > k) {
                // Remove leftmost character from frequency count
                char leftChar = s.charAt(left);
                int leftCharIndex = leftChar - 'A';
                charCount[leftCharIndex]--;

                // Note: we don't update maxFreq here even though it might decrease
                // This is the key optimization - we only need to know if the window
                // could be valid, and an overestimated maxFreq makes our check stricter

                // Move left pointer to shrink window
                left++;

                // Recalculate window length after shrinking
                windowLength = right - left + 1;
            }

            // Update maxLength if current window is longer
            maxLength = Math.max(maxLength, windowLength);
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the string once with the right pointer (n iterations)
- Each iteration does O(1) operations (hash map/array access, comparisons)
- The left pointer also moves at most n times total
- Total operations are proportional to n, not n²

**Space Complexity: O(1)**

- We only store frequency counts for 26 possible uppercase English letters
- The hash map/array size is fixed regardless of input size
- Other variables (pointers, counters) use constant space

## Common Mistakes

1. **Updating max_freq when shrinking the window:** Many candidates try to recalculate the true maximum frequency when removing characters. This would require O(26) operations each time, making the solution O(26n). The key insight is that we don't need the true maximum—we only need to know if the window could be valid.

2. **Using a fixed-size array without considering character encoding:** In Java/C++, some candidates use array size 256 assuming ASCII, but the problem specifies uppercase English letters only. Using array size 26 is more memory-efficient and clearer.

3. **Incorrect window validity check:** The formula is `window_length - max_freq ≤ k`, not `max_freq ≥ window_length - k`. While mathematically equivalent, the first form is more intuitive: "changes needed = total characters - characters that are already correct".

4. **Forgetting to handle k = 0 case:** When k = 0, the problem reduces to finding the longest substring of identical characters. The sliding window solution handles this correctly because when max_freq doesn't increase, the window won't expand beyond consecutive identical characters.

## When You'll See This Pattern

The "sliding window with character count" pattern appears in several related problems:

1. **Longest Substring with At Most K Distinct Characters (Medium):** Similar structure but tracks distinct characters instead of frequency maximum. Both use a hash map to track window contents and shrink when a condition is violated.

2. **Max Consecutive Ones III (Medium):** Almost identical pattern but with binary arrays. Instead of character frequencies, you track count of zeros in the window.

3. **Fruit Into Baskets (Medium):** Another variation where you can have at most 2 types of "fruits" (characters) in your window.

4. **Minimum Window Substring (Hard):** A more complex version where you need to find the minimum window containing all characters from a target string.

## Key Takeaways

1. **Sliding window with frequency count** is a powerful pattern for substring problems with constraints on character composition. The window expands until a condition is violated, then shrinks from the left until valid again.

2. **You don't always need exact values**—sometimes an overestimate is sufficient. The optimization of not updating max_freq when shrinking is counterintuitive but correct because an overestimated max_freq makes the validity check stricter.

3. **The validity condition `window_length - max_freq ≤ k`** is the core of this problem. Understanding why this works (it represents the minimum number of changes needed) is more important than memorizing the code.

Related problems: [Longest Substring with At Most K Distinct Characters](/problem/longest-substring-with-at-most-k-distinct-characters), [Max Consecutive Ones III](/problem/max-consecutive-ones-iii), [Minimum Number of Operations to Make Array Continuous](/problem/minimum-number-of-operations-to-make-array-continuous)
