---
title: "How to Solve Minimum Window Substring — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Window Substring. Hard difficulty, 47.0% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2026-05-25"
category: "dsa-patterns"
tags: ["minimum-window-substring", "hash-table", "string", "sliding-window", "hard"]
---

# How to Solve Minimum Window Substring

This problem asks us to find the smallest substring in `s` that contains all characters from `t`, including duplicates. What makes this problem tricky is that we need to track character frequencies while efficiently searching through all possible substrings. The brute force approach would be far too slow, so we need a smarter technique to avoid redundant work.

## Visual Walkthrough

Let's trace through an example: `s = "ADOBECODEBANC"`, `t = "ABC"`.

**Step 1:** Initialize two pointers `left = 0` and `right = 0`. We'll expand the right pointer to find a valid window, then contract the left pointer to minimize it.

**Step 2:** Move `right` from 0 to 5: `"ADOBEC"` contains A, B, and C. This is our first valid window (length 6).

**Step 3:** Move `left` to 1: `"DOBEC"` still contains all characters. Continue moving `left` until the window becomes invalid.

**Step 4:** At `left = 1`, `"DOBEC"` still valid. At `left = 2`, `"OBEC"` still valid. At `left = 3`, `"BEC"` missing A, so stop. Our best window so far is `"ADOBEC"` (length 6).

**Step 5:** Continue moving `right` to find another valid window. At `right = 9`, we have `"CODEBA"` which contains all characters.

**Step 6:** Contract `left` again. At `left = 5`, `"ODEBA"` still valid. At `left = 6`, `"DEBA"` still valid. At `left = 7`, `"EBA"` still valid. At `left = 8`, `"BA"` missing C, so stop. New best window is `"ODEBA"` (length 5).

**Step 7:** Continue moving `right`. At `right = 12`, we have `"BANC"` which contains all characters.

**Step 8:** Contract `left`. At `left = 9`, `"ANC"` still valid. At `left = 10`, `"NC"` missing B, so stop. New best window is `"BANC"` (length 4).

The minimum window is `"BANC"`.

## Brute Force Approach

The brute force solution would check every possible substring of `s`:

1. Generate all substrings of `s` (O(m²) substrings)
2. For each substring, check if it contains all characters from `t` (O(n) to check)
3. Track the minimum valid substring

This gives us O(m² × n) time complexity, which is far too slow for typical constraints (m up to 10⁵). Even with optimization, checking each substring would still be O(m²).

<div class="code-group">

```python
# Brute Force - Too Slow for Large Inputs
# Time: O(m² × n) | Space: O(1)
def minWindowBrute(s: str, t: str) -> str:
    if not s or not t or len(t) > len(s):
        return ""

    min_window = ""
    min_length = float('inf')

    # Check all possible substrings
    for i in range(len(s)):
        for j in range(i + len(t), len(s) + 1):
            substring = s[i:j]

            # Check if substring contains all characters from t
            temp_t = list(t)
            for char in substring:
                if char in temp_t:
                    temp_t.remove(char)

            # If all characters from t were found
            if not temp_t and j - i < min_length:
                min_length = j - i
                min_window = substring

    return min_window
```

```javascript
// Brute Force - Too Slow for Large Inputs
// Time: O(m² × n) | Space: O(1)
function minWindowBrute(s, t) {
  if (!s || !t || t.length > s.length) return "";

  let minWindow = "";
  let minLength = Infinity;

  // Check all possible substrings
  for (let i = 0; i < s.length; i++) {
    for (let j = i + t.length; j <= s.length; j++) {
      const substring = s.substring(i, j);

      // Check if substring contains all characters from t
      const tempT = t.split("");
      for (const char of substring) {
        const index = tempT.indexOf(char);
        if (index !== -1) {
          tempT.splice(index, 1);
        }
      }

      // If all characters from t were found
      if (tempT.length === 0 && j - i < minLength) {
        minLength = j - i;
        minWindow = substring;
      }
    }
  }

  return minWindow;
}
```

```java
// Brute Force - Too Slow for Large Inputs
// Time: O(m² × n) | Space: O(1)
public String minWindowBrute(String s, String t) {
    if (s == null || t == null || t.length() > s.length()) return "";

    String minWindow = "";
    int minLength = Integer.MAX_VALUE;

    // Check all possible substrings
    for (int i = 0; i < s.length(); i++) {
        for (int j = i + t.length(); j <= s.length(); j++) {
            String substring = s.substring(i, j);

            // Check if substring contains all characters from t
            List<Character> tempT = new ArrayList<>();
            for (char c : t.toCharArray()) tempT.add(c);

            for (char c : substring.toCharArray()) {
                int index = tempT.indexOf(c);
                if (index != -1) {
                    tempT.remove(index);
                }
            }

            // If all characters from t were found
            if (tempT.isEmpty() && j - i < minLength) {
                minLength = j - i;
                minWindow = substring;
            }
        }
    }

    return minWindow;
}
```

</div>

## Optimized Approach

The key insight is that we can use a **sliding window** with two pointers to avoid checking all substrings. Here's the step-by-step reasoning:

1. **Frequency Counting**: First, count the frequency of each character in `t` using a hash map. This tells us exactly what characters we need and how many of each.

2. **Two Pointers**: Use `left` and `right` pointers to define a window in `s`. Expand the window by moving `right` until we have all required characters.

3. **Valid Window Check**: Track how many characters from `t` we still need. When this count reaches zero, we have a valid window.

4. **Window Minimization**: Once we have a valid window, try to shrink it from the left by moving `left` forward while still maintaining validity.

5. **Efficient Updates**: When we add or remove characters from the window, update our frequency counts efficiently.

The optimization comes from the fact that we only traverse `s` once with each pointer (O(2m) = O(m)), and we use hash maps for O(1) lookups.

## Optimal Solution

Here's the complete solution using the sliding window approach:

<div class="code-group">

```python
# Optimal Solution using Sliding Window
# Time: O(m + n) | Space: O(1) - since character set is limited (ASCII)
def minWindow(s: str, t: str) -> str:
    if not s or not t or len(t) > len(s):
        return ""

    # Step 1: Create frequency map for characters in t
    # We need to know exactly what characters and how many of each we need
    t_freq = {}
    for char in t:
        t_freq[char] = t_freq.get(char, 0) + 1

    # Step 2: Initialize variables for sliding window
    left = 0  # Left pointer of the window
    required = len(t_freq)  # Number of unique characters we need to satisfy
    formed = 0  # Number of unique characters currently satisfied
    window_freq = {}  # Frequency of characters in current window

    # Step 3: Variables to track the minimum window
    min_length = float('inf')
    min_left = 0  # Starting index of minimum window

    # Step 4: Expand the window by moving right pointer
    for right in range(len(s)):
        char = s[right]

        # Add current character to window frequency
        window_freq[char] = window_freq.get(char, 0) + 1

        # Check if this character helps satisfy a requirement from t
        if char in t_freq and window_freq[char] == t_freq[char]:
            formed += 1

        # Step 5: Try to contract the window from the left
        # While we have all required characters, try to minimize window
        while left <= right and formed == required:
            # Update minimum window if current is smaller
            if right - left + 1 < min_length:
                min_length = right - left + 1
                min_left = left

            # Remove leftmost character from window
            left_char = s[left]
            window_freq[left_char] -= 1

            # Check if removing this character breaks a requirement
            if left_char in t_freq and window_freq[left_char] < t_freq[left_char]:
                formed -= 1

            # Move left pointer forward
            left += 1

    # Step 6: Return the minimum window or empty string if none found
    return "" if min_length == float('inf') else s[min_left:min_left + min_length]
```

```javascript
// Optimal Solution using Sliding Window
// Time: O(m + n) | Space: O(1) - since character set is limited
function minWindow(s, t) {
  if (!s || !t || t.length > s.length) return "";

  // Step 1: Create frequency map for characters in t
  const tFreq = {};
  for (const char of t) {
    tFreq[char] = (tFreq[char] || 0) + 1;
  }

  // Step 2: Initialize variables for sliding window
  let left = 0;
  let required = Object.keys(tFreq).length; // Unique characters needed
  let formed = 0; // Unique characters currently satisfied
  const windowFreq = {};

  // Step 3: Variables to track the minimum window
  let minLength = Infinity;
  let minLeft = 0;

  // Step 4: Expand the window by moving right pointer
  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // Add current character to window frequency
    windowFreq[char] = (windowFreq[char] || 0) + 1;

    // Check if this character helps satisfy a requirement from t
    if (tFreq[char] && windowFreq[char] === tFreq[char]) {
      formed++;
    }

    // Step 5: Try to contract the window from the left
    while (left <= right && formed === required) {
      // Update minimum window if current is smaller
      if (right - left + 1 < minLength) {
        minLength = right - left + 1;
        minLeft = left;
      }

      // Remove leftmost character from window
      const leftChar = s[left];
      windowFreq[leftChar]--;

      // Check if removing this character breaks a requirement
      if (tFreq[leftChar] && windowFreq[leftChar] < tFreq[leftChar]) {
        formed--;
      }

      // Move left pointer forward
      left++;
    }
  }

  // Step 6: Return the minimum window or empty string if none found
  return minLength === Infinity ? "" : s.substring(minLeft, minLeft + minLength);
}
```

```java
// Optimal Solution using Sliding Window
// Time: O(m + n) | Space: O(1) - since character set is limited (ASCII)
public String minWindow(String s, String t) {
    if (s == null || t == null || t.length() > s.length()) return "";

    // Step 1: Create frequency map for characters in t
    Map<Character, Integer> tFreq = new HashMap<>();
    for (char c : t.toCharArray()) {
        tFreq.put(c, tFreq.getOrDefault(c, 0) + 1);
    }

    // Step 2: Initialize variables for sliding window
    int left = 0;
    int required = tFreq.size(); // Unique characters needed
    int formed = 0; // Unique characters currently satisfied
    Map<Character, Integer> windowFreq = new HashMap<>();

    // Step 3: Variables to track the minimum window
    int minLength = Integer.MAX_VALUE;
    int minLeft = 0;

    // Step 4: Expand the window by moving right pointer
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);

        // Add current character to window frequency
        windowFreq.put(c, windowFreq.getOrDefault(c, 0) + 1);

        // Check if this character helps satisfy a requirement from t
        if (tFreq.containsKey(c) && windowFreq.get(c).intValue() == tFreq.get(c).intValue()) {
            formed++;
        }

        // Step 5: Try to contract the window from the left
        while (left <= right && formed == required) {
            // Update minimum window if current is smaller
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minLeft = left;
            }

            // Remove leftmost character from window
            char leftChar = s.charAt(left);
            windowFreq.put(leftChar, windowFreq.get(leftChar) - 1);

            // Check if removing this character breaks a requirement
            if (tFreq.containsKey(leftChar) && windowFreq.get(leftChar) < tFreq.get(leftChar)) {
                formed--;
            }

            // Move left pointer forward
            left++;
        }
    }

    // Step 6: Return the minimum window or empty string if none found
    return minLength == Integer.MAX_VALUE ? "" : s.substring(minLeft, minLeft + minLength);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m + n)**

- Building the frequency map for `t` takes O(n)
- The sliding window traverses `s` once with the right pointer (O(m))
- The left pointer also traverses `s` at most once (O(m))
- Each character is processed at most twice (once by right, once by left)

**Space Complexity: O(1)**

- The frequency maps store at most 26 (uppercase) + 26 (lowercase) = 52 entries for English letters
- If we consider extended ASCII, it's 256 entries
- This is constant space regardless of input size

## Common Mistakes

1. **Not handling duplicates correctly**: Candidates sometimes check only for presence of characters rather than their required counts. Remember that `t` can have duplicate characters, and the window must contain at least that many of each.

2. **Incorrect window contraction**: The trickiest part is knowing when to stop contracting the window. You must stop when removing a character would make the window invalid (no longer contains all required characters with sufficient counts).

3. **Forgetting edge cases**:
   - Empty strings: if either `s` or `t` is empty, return `""`
   - `t` longer than `s`: immediately return `""`
   - No valid window: return `""`

4. **Inefficient valid window checking**: Some candidates re-check the entire window each time, which makes the solution O(m²). The key optimization is tracking `formed` count to check validity in O(1).

## When You'll See This Pattern

The sliding window pattern with frequency counting appears in several related problems:

1. **Substring with Concatenation of All Words (Hard)**: Similar concept but with words instead of characters. You need to find all substrings containing all words from a list.

2. **Minimum Size Subarray Sum (Medium)**: Instead of character frequencies, you're tracking a sum. The window expands until the sum meets a target, then contracts to find the minimum.

3. **Longest Substring Without Repeating Characters (Medium)**: Uses a sliding window to track unique characters, contracting when duplicates are found.

4. **Permutation in String (Medium)**: Check if `s2` contains a permutation of `s1` - essentially checking for an exact frequency match in any window.

## Key Takeaways

1. **Sliding window with two pointers** is the go-to pattern for substring problems where you need to find a contiguous segment satisfying certain constraints.

2. **Frequency counting with hash maps** allows efficient tracking of character requirements. The `formed` counter trick avoids re-scanning the entire window.

3. **Expand then contract**: The general template is: expand the right pointer until you have a valid window, then contract the left pointer to minimize it while maintaining validity.

Related problems: [Substring with Concatenation of All Words](/problem/substring-with-concatenation-of-all-words), [Minimum Size Subarray Sum](/problem/minimum-size-subarray-sum), [Sliding Window Maximum](/problem/sliding-window-maximum)
