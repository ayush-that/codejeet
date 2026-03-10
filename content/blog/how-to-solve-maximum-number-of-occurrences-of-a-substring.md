---
title: "How to Solve Maximum Number of Occurrences of a Substring — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Occurrences of a Substring. Medium difficulty, 54.3% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2027-10-25"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-occurrences-of-a-substring",
    "hash-table",
    "string",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Maximum Number of Occurrences of a Substring

This problem asks us to find the maximum frequency of any substring in a string `s`, but with constraints: the substring must have at most `maxLetters` unique characters, and its length must be between `minSize` and `maxSize`. The tricky part is that while `maxSize` is given, we can ignore it entirely — any substring longer than `minSize` that satisfies the constraints will contain a shorter substring that also satisfies them and will occur at least as often. This key insight allows us to focus only on substrings of exactly `minSize`, dramatically reducing the search space.

## Visual Walkthrough

Let's walk through an example to build intuition.  
Given:  
`s = "aababcaab"`  
`maxLetters = 2`  
`minSize = 3`  
`maxSize = 4`

We only need to check substrings of length `minSize = 3` because:

- If a longer substring occurs `k` times, its first `minSize` characters also occur at least `k` times.
- The shorter substring still has ≤ `maxLetters` unique characters (it can't have more than the longer one).

**Step 1:** Check substring `"aab"` (indices 0-2)  
Unique characters: `{'a', 'b'}` → 2 unique (≤ maxLetters=2) ✅  
Add to count: `{"aab": 1}`

**Step 2:** Check `"aba"` (indices 1-3)  
Unique: `{'a', 'b'}` → 2 ✅  
Count: `{"aab": 1, "aba": 1}`

**Step 3:** Check `"bab"` (indices 2-4)  
Unique: `{'a', 'b'}` → 2 ✅  
Count: `{"aab": 1, "aba": 1, "bab": 1}`

**Step 4:** Check `"abc"` (indices 3-5)  
Unique: `{'a', 'b', 'c'}` → 3 (> maxLetters=2) ❌  
Skip this substring.

**Step 5:** Check `"bca"` (indices 4-6)  
Unique: `{'a', 'b', 'c'}` → 3 ❌  
Skip.

**Step 6:** Check `"caa"` (indices 5-7)  
Unique: `{'a', 'c'}` → 2 ✅  
Count: `{"aab": 1, "aba": 1, "bab": 1, "caa": 1}`

**Step 7:** Check `"aab"` (indices 6-8)  
Unique: `{'a', 'b'}` → 2 ✅  
Count: `{"aab": 2, "aba": 1, "bab": 1, "caa": 1}`

Maximum count is 2 for substring `"aab"`.  
Notice we never checked length 4 substrings — they're unnecessary!

## Brute Force Approach

A naive solution would check every possible substring length from `minSize` to `maxSize`, and for each length, check every starting position. For each substring, we'd:

1. Count unique characters (O(length) using a set)
2. If unique ≤ maxLetters, increment its count in a frequency map

This brute force has complexity O((maxSize - minSize + 1) × n × maxSize) where n is string length. For n up to 10^5 and maxSize up to 26, this could be O(26 × 10^5 × 26) ≈ 67 million operations — potentially acceptable but inefficient. However, the real issue is we're doing redundant work by checking longer substrings when we only need to check length `minSize`.

## Optimized Approach

The key insight is: **We only need to check substrings of length exactly `minSize`.**

Why?

1. If a substring of length L > minSize satisfies the constraints, its prefix of length minSize also satisfies them (same or fewer unique characters).
2. The shorter substring occurs at least as many times as the longer one (every occurrence of the longer substring contains an occurrence of the shorter one).
3. Therefore, the maximum frequency will always come from a substring of length minSize.

This reduces the problem to:

- Slide a window of size minSize across the string
- For each window, check if it has ≤ maxLetters unique characters
- If yes, count its occurrences (we can use a hash map)
- Track the maximum count

We can optimize further by maintaining a sliding count of unique characters instead of recalculating it for each window.

## Optimal Solution

We use a sliding window of fixed size `minSize`. As we slide the window, we maintain:

- A frequency map of characters in the current window
- A count of unique characters in the window
- A frequency map of valid substrings we've seen

For each window position:

1. Add the new character to the window
2. If we've exceeded window size, remove the oldest character
3. Update unique character count based on changes
4. If unique ≤ maxLetters, add the substring to our substring frequency map
5. Track the maximum frequency

<div class="code-group">

```python
# Time: O(n * minSize) - We process each window and build substring of length minSize
# Space: O(n) - In worst case, we store all substrings of length minSize
def maxFreq(s: str, maxLetters: int, minSize: int, maxSize: int) -> int:
    # We only need minSize due to the optimization explained above
    n = len(s)
    substring_count = {}  # Maps substring -> frequency
    window_count = {}     # Maps char -> count in current window
    unique = 0            # Unique chars in current window

    # Slide the fixed-size window across the string
    for i in range(n):
        # Add new character to the window
        new_char = s[i]
        window_count[new_char] = window_count.get(new_char, 0) + 1
        if window_count[new_char] == 1:
            unique += 1  # First occurrence of this char in window

        # Remove character that falls out of the window
        if i >= minSize:
            old_char = s[i - minSize]
            window_count[old_char] -= 1
            if window_count[old_char] == 0:
                unique -= 1  # No more of this char in window

        # If window has reached minSize and satisfies unique constraint
        if i >= minSize - 1 and unique <= maxLetters:
            # Extract the current substring of length minSize
            current_substring = s[i - minSize + 1:i + 1]
            substring_count[current_substring] = substring_count.get(current_substring, 0) + 1

    # Return the maximum frequency (0 if no valid substrings found)
    return max(substring_count.values()) if substring_count else 0
```

```javascript
// Time: O(n * minSize) - We process each window and build substring of length minSize
// Space: O(n) - In worst case, we store all substrings of length minSize
function maxFreq(s, maxLetters, minSize, maxSize) {
  // We only need minSize due to the optimization explained above
  const n = s.length;
  const substringCount = new Map(); // Maps substring -> frequency
  const windowCount = new Map(); // Maps char -> count in current window
  let unique = 0; // Unique chars in current window

  // Slide the fixed-size window across the string
  for (let i = 0; i < n; i++) {
    // Add new character to the window
    const newChar = s[i];
    windowCount.set(newChar, (windowCount.get(newChar) || 0) + 1);
    if (windowCount.get(newChar) === 1) {
      unique++; // First occurrence of this char in window
    }

    // Remove character that falls out of the window
    if (i >= minSize) {
      const oldChar = s[i - minSize];
      windowCount.set(oldChar, windowCount.get(oldChar) - 1);
      if (windowCount.get(oldChar) === 0) {
        unique--; // No more of this char in window
      }
    }

    // If window has reached minSize and satisfies unique constraint
    if (i >= minSize - 1 && unique <= maxLetters) {
      // Extract the current substring of length minSize
      const currentSubstring = s.substring(i - minSize + 1, i + 1);
      substringCount.set(currentSubstring, (substringCount.get(currentSubstring) || 0) + 1);
    }
  }

  // Return the maximum frequency (0 if no valid substrings found)
  let maxFreq = 0;
  for (const count of substringCount.values()) {
    maxFreq = Math.max(maxFreq, count);
  }
  return maxFreq;
}
```

```java
// Time: O(n * minSize) - We process each window and build substring of length minSize
// Space: O(n) - In worst case, we store all substrings of length minSize
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxFreq(String s, int maxLetters, int minSize, int maxSize) {
        // We only need minSize due to the optimization explained above
        int n = s.length();
        Map<String, Integer> substringCount = new HashMap<>();  // Maps substring -> frequency
        Map<Character, Integer> windowCount = new HashMap<>();  // Maps char -> count in current window
        int unique = 0;  // Unique chars in current window

        // Slide the fixed-size window across the string
        for (int i = 0; i < n; i++) {
            // Add new character to the window
            char newChar = s.charAt(i);
            windowCount.put(newChar, windowCount.getOrDefault(newChar, 0) + 1);
            if (windowCount.get(newChar) == 1) {
                unique++;  // First occurrence of this char in window
            }

            // Remove character that falls out of the window
            if (i >= minSize) {
                char oldChar = s.charAt(i - minSize);
                windowCount.put(oldChar, windowCount.get(oldChar) - 1);
                if (windowCount.get(oldChar) == 0) {
                    unique--;  // No more of this char in window
                }
            }

            // If window has reached minSize and satisfies unique constraint
            if (i >= minSize - 1 && unique <= maxLetters) {
                // Extract the current substring of length minSize
                String currentSubstring = s.substring(i - minSize + 1, i + 1);
                substringCount.put(currentSubstring, substringCount.getOrDefault(currentSubstring, 0) + 1);
            }
        }

        // Return the maximum frequency (0 if no valid substrings found)
        int maxFreq = 0;
        for (int count : substringCount.values()) {
            maxFreq = Math.max(maxFreq, count);
        }
        return maxFreq;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × minSize)

- We iterate through the string once: O(n)
- For each position, we may extract a substring of length minSize: O(minSize)
- Updating character counts is O(1) with hash maps
- Total: O(n × minSize)

**Space Complexity:** O(n)

- The substring frequency map could store up to n - minSize + 1 substrings in the worst case
- Each substring has length minSize, but we're counting distinct substrings, not storing all copies
- The window character count uses O(26) = O(1) since there are only 26 possible lowercase letters
- Total: O(n) for storing substrings

## Common Mistakes

1. **Checking all lengths from minSize to maxSize**: This is the most common inefficiency. Candidates often miss the insight that only minSize matters. Remember: any valid longer substring contains a valid shorter one with at least the same frequency.

2. **Forgetting to handle the empty result case**: When no substring satisfies the constraints, we should return 0. Always check if your frequency map is empty before taking the maximum.

3. **Incorrect window management**: When removing characters from the window, check if count becomes 0 to decrement the unique counter. Off-by-one errors are common when calculating window boundaries (use `i >= minSize - 1` to check if window is full).

4. **Recalculating unique characters for each substring**: Some candidates use a set for each window, which takes O(minSize) time per window. Maintaining a running count with a frequency map is more efficient.

## When You'll See This Pattern

This problem combines **sliding window** with **frequency counting** — a common pattern in string problems:

1. **Minimum Window Substring (Hard)**: Similar sliding window with character frequency tracking, but with a target string to match.

2. **Longest Substring Without Repeating Characters (Medium)**: Uses sliding window to track unique characters, maintaining a window where all characters are unique.

3. **Find All Anagrams in a String (Medium)**: Fixed-size sliding window comparing character frequencies to find anagram matches.

The key pattern is: when you need to examine all substrings satisfying certain constraints, a sliding window often avoids redundant computations.

## Key Takeaways

1. **Optimization insight matters**: The realization that only `minSize` substrings need checking transforms an O(n × maxSize) problem to O(n × minSize). In interviews, always look for properties that can reduce the search space.

2. **Sliding window + frequency map is powerful**: For substring problems with constraints on character counts, maintaining a running frequency map as you slide a window is often optimal.

3. **Test with small examples**: Walking through a concrete example (like we did in the visual walkthrough) often reveals optimization opportunities you might miss when thinking abstractly.

Related problems: [Rearrange Characters to Make Target String](/problem/rearrange-characters-to-make-target-string)
