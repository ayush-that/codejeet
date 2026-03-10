---
title: "How to Solve Maximum Length Substring With Two Occurrences — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Length Substring With Two Occurrences. Easy difficulty, 65.2% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2028-04-05"
category: "dsa-patterns"
tags:
  [
    "maximum-length-substring-with-two-occurrences",
    "hash-table",
    "string",
    "sliding-window",
    "easy",
  ]
---

# How to Solve Maximum Length Substring With Two Occurrences

This problem asks us to find the longest substring where no character appears more than twice. While it sounds simple, the challenge lies in efficiently tracking character counts while expanding and contracting our search window. The "at most two occurrences" constraint makes this a classic sliding window problem with frequency tracking.

## Visual Walkthrough

Let's trace through `s = "abacba"` step by step:

We'll maintain a sliding window `[left, right]` and a frequency counter for characters within it.

**Step 1:** `left=0, right=0`, window="a", counts={a:1} ✓ Valid (max length=1)

**Step 2:** `left=0, right=1`, window="ab", counts={a:1, b:1} ✓ Valid (max length=2)

**Step 3:** `left=0, right=2`, window="aba", counts={a:2, b:1} ✓ Valid (a appears twice, which is allowed) (max length=3)

**Step 4:** `left=0, right=3`, window="abac", counts={a:2, b:1, c:1} ✓ Valid (max length=4)

**Step 5:** `left=0, right=4`, window="abacb", counts={a:2, b:2, c:1} ✓ Valid (max length=5)

**Step 6:** `left=0, right=5`, window="abacba", counts={a:3, b:2, c:1} ✗ Invalid! 'a' appears 3 times

Now we need to shrink from the left until valid again:

**Step 7:** `left=1, right=5`, window="bacba", counts={a:2, b:2, c:1} ✓ Valid (max length=5)

The maximum length we found was 5 (window "abacb" or "bacba").

## Brute Force Approach

A naive approach would check every possible substring:

1. Generate all substrings (O(n²) of them)
2. For each substring, count character frequencies
3. Check if all frequencies ≤ 2
4. Track the maximum length of valid substrings

This would be O(n³) time complexity (O(n²) substrings × O(n) to check each one) or O(n²) with optimization, which is still too slow for typical constraints (n up to 10⁵).

Even an optimized brute force checking all substrings starting at each position would be O(n²), which is insufficient. We need something linear.

## Optimal Solution

The optimal solution uses the **sliding window** pattern with a **hash map** to track character frequencies. As we expand the right pointer, we add characters to our frequency counter. If any character exceeds count 2, we shrink the window from the left until all counts are ≤ 2 again. We track the maximum window size throughout.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - because alphabet size is limited (26 letters)
def maximumLengthSubstring(s: str) -> int:
    """
    Find the longest substring where no character appears more than twice.

    Approach: Sliding window with frequency counter.
    Expand right pointer, add character to count.
    If any count > 2, shrink left pointer until valid again.
    Track maximum window size throughout.
    """
    left = 0  # Left pointer of sliding window
    max_len = 0  # Track maximum valid substring length
    char_count = {}  # Dictionary to store character frequencies in current window

    # Expand window by moving right pointer through the string
    for right in range(len(s)):
        # Add current character to frequency counter
        char = s[right]
        char_count[char] = char_count.get(char, 0) + 1

        # If current character count exceeds 2, shrink window from left
        while char_count[char] > 2:
            # Remove leftmost character from window
            left_char = s[left]
            char_count[left_char] -= 1
            # If count reaches 0, remove from dictionary to keep it clean
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1  # Move left pointer rightward

        # Update maximum length with current window size
        # Window size = right - left + 1
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Time: O(n) | Space: O(1) - because alphabet size is limited (26 letters)
function maximumLengthSubstring(s) {
  /**
   * Find the longest substring where no character appears more than twice.
   *
   * Approach: Sliding window with frequency counter.
   * Expand right pointer, add character to count.
   * If any count > 2, shrink left pointer until valid again.
   * Track maximum window size throughout.
   */
  let left = 0; // Left pointer of sliding window
  let maxLen = 0; // Track maximum valid substring length
  const charCount = new Map(); // Map to store character frequencies in current window

  // Expand window by moving right pointer through the string
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    // Add current character to frequency counter
    charCount.set(char, (charCount.get(char) || 0) + 1);

    // If current character count exceeds 2, shrink window from left
    while (charCount.get(char) > 2) {
      const leftChar = s[left];
      // Remove leftmost character from window
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      // If count reaches 0, remove from map to keep it clean
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++; // Move left pointer rightward
    }

    // Update maximum length with current window size
    // Window size = right - left + 1
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1) - because alphabet size is limited (26 letters)
public int maximumLengthSubstring(String s) {
    /**
     * Find the longest substring where no character appears more than twice.
     *
     * Approach: Sliding window with frequency counter.
     * Expand right pointer, add character to count.
     * If any count > 2, shrink left pointer until valid again.
     * Track maximum window size throughout.
     */
    int left = 0;  // Left pointer of sliding window
    int maxLen = 0;  // Track maximum valid substring length
    int[] charCount = new int[26];  // Array to store character frequencies (a-z)

    // Expand window by moving right pointer through the string
    for (int right = 0; right < s.length(); right++) {
        char currentChar = s.charAt(right);
        // Add current character to frequency counter
        charCount[currentChar - 'a']++;

        // If current character count exceeds 2, shrink window from left
        while (charCount[currentChar - 'a'] > 2) {
            char leftChar = s.charAt(left);
            // Remove leftmost character from window
            charCount[leftChar - 'a']--;
            left++;  // Move left pointer rightward
        }

        // Update maximum length with current window size
        // Window size = right - left + 1
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the string once with the right pointer (O(n))
- Each character is added to the window once and removed at most once (when left pointer moves)
- The while loop for shrinking doesn't make it O(n²) because each character is processed at most twice (once added, once removed)
- This is called **amortized O(n)** time

**Space Complexity: O(1)** for the Java array solution, O(26) = O(1) for Python/JavaScript

- We only store character frequencies
- Since the input is lowercase English letters, we have at most 26 distinct characters
- Even with Unicode, the space would be O(k) where k is the character set size, which is constant for a given problem

## Common Mistakes

1. **Using an array without checking character range**: In Java, some candidates might use `charCount[256]` without considering that characters might be lowercase only. Always check constraints - here we know it's lowercase English letters, so `charCount[26]` suffices.

2. **Forgetting to shrink the window properly**: When a character count exceeds 2, we need to shrink from the left **until** all counts are ≤ 2, not just remove one character. The while loop condition `while char_count[char] > 2:` is crucial.

3. **Off-by-one errors in window length calculation**: The window length is `right - left + 1`, not `right - left`. Remember that when `right == left`, the window has length 1, not 0.

4. **Not handling empty string**: While the problem likely guarantees non-empty input, robust code should handle `s = ""` by returning 0. Our code handles this correctly since the loop won't execute and `max_len` remains 0.

## When You'll See This Pattern

The sliding window with frequency counter pattern appears in many string problems with constraints on character frequencies:

1. **Longest Substring Without Repeating Characters (LeetCode 3)** - Similar but with stricter constraint (no repeats allowed). This is actually a simpler version of our problem with max count = 1 instead of 2.

2. **Longest Substring with At Most K Distinct Characters (LeetCode 340)** - Generalizes the constraint to limit distinct characters rather than frequency per character.

3. **Fruit Into Baskets (LeetCode 904)** - Another variation where you can have at most 2 types of "fruits" (characters).

The pattern is: when you need to find a **contiguous subarray/substring** satisfying some **constraint on element frequencies**, think sliding window with a frequency counter.

## Key Takeaways

1. **Sliding window is ideal for "longest substring with constraint" problems**: When you need to find the longest contiguous segment satisfying a condition, sliding window often provides an O(n) solution.

2. **Frequency counters enable efficient constraint checking**: Instead of recounting frequencies for each window (O(n²)), maintain a running count and update it in O(1) as the window slides.

3. **The shrinking condition is key**: Determine exactly when to shrink the window (here: when any character count > 2) and shrink until the constraint is satisfied again.

[Practice this problem on CodeJeet](/problem/maximum-length-substring-with-two-occurrences)
