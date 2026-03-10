---
title: "How to Solve Find Longest Special Substring That Occurs Thrice II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Longest Special Substring That Occurs Thrice II. Medium difficulty, 39.1% acceptance rate. Topics: Hash Table, String, Binary Search, Sliding Window, Counting."
date: "2029-04-08"
category: "dsa-patterns"
tags:
  [
    "find-longest-special-substring-that-occurs-thrice-ii",
    "hash-table",
    "string",
    "binary-search",
    "medium",
  ]
---

# How to Solve Find Longest Special Substring That Occurs Thrice II

This problem asks us to find the maximum length of a "special substring" (a substring containing only one character) that appears at least three times in the given string. The challenge lies in efficiently checking all possible special substrings without explicitly generating every single one, which would be too slow for strings up to length 50,000.

## Visual Walkthrough

Let's trace through an example: `s = "aaaaabaaa"`

We need to find the longest special substring that appears at least 3 times. Let's think about special substrings of character 'a':

1. Length 1: 'a' appears many times (9 times total)
2. Length 2: 'aa' appears in positions 0-1, 1-2, 2-3, 3-4, 5-6, 6-7, 7-8 (7 times)
3. Length 3: 'aaa' appears in positions 0-2, 1-3, 2-4, 5-7, 6-8 (5 times)
4. Length 4: 'aaaa' appears in positions 0-3, 1-4 (2 times) - only appears twice!
5. Length 5: 'aaaaa' appears only once (positions 0-4)

The longest special substring appearing at least 3 times is 'aaa' with length 3. Notice that once we find a length that works, we can try longer lengths. But if a length fails, all longer lengths will also fail for that character (since a longer substring is more specific and appears fewer times).

Key insight: For each character, we can binary search on the length! Check if there exists a special substring of length L that appears at least 3 times.

## Brute Force Approach

A naive approach would be:

1. For each character 'a' to 'z'
2. For each possible length L from 1 up to the maximum possible (count of that character)
3. Slide a window of size L through the string, counting how many times that substring appears
4. Track the maximum L where count ≥ 3

This is extremely inefficient: O(26 × n²) where n is the string length. For n = 50,000, this is about 650 billion operations - far too slow.

The brute force fails because it explicitly checks every possible substring length for every character, and for each length, it scans the entire string.

## Optimized Approach

The key insight is that we can use **binary search** on the answer length combined with a **sliding window** to check feasibility efficiently.

Here's the reasoning:

1. The answer must be between 1 and n (the string length)
2. For a candidate length L, we need to check: "Is there any special substring of length L that appears at least 3 times?"
3. We can check this efficiently by sliding a window of size L through the string:
   - When we see a window containing only one character, we count it
   - We track counts for each character separately
   - If any character has count ≥ 3 for windows of size L, then L is feasible
4. Since feasibility is monotonic (if length L works, any shorter length also works; if L fails, any longer length also fails), we can binary search on L

Why does monotonicity hold?

- If a special substring of length L appears at least 3 times, then any shorter substring (which is a prefix of it) also appears at least 3 times (actually more)
- If no special substring of length L appears 3 times, then certainly no longer substring will (since longer substrings are more specific and appear less frequently)

The sliding window check runs in O(n) time, and binary search adds O(log n), giving us O(n log n) total - efficient enough for n = 50,000.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1)
def maximumLength(s: str) -> int:
    """
    Find the longest special substring that occurs at least three times.

    Approach: Binary search on the answer length combined with sliding window
    to check if a given length is feasible.
    """
    n = len(s)

    def can_find_length(L: int) -> bool:
        """
        Check if there exists any special substring of length L
        that appears at least 3 times.

        Uses sliding window to count occurrences of each character
        in windows of size L.
        """
        # Frequency count of characters in current window
        freq = [0] * 26
        # Count of windows where a character appears consecutively L times
        window_counts = [0] * 26

        # Initialize first window
        for i in range(L):
            idx = ord(s[i]) - ord('a')
            freq[idx] += 1
            if freq[idx] == L:  # Entire window is this character
                window_counts[idx] += 1
                if window_counts[idx] >= 3:
                    return True

        # Slide the window across the string
        for i in range(L, n):
            # Remove leftmost character of previous window
            left_idx = ord(s[i - L]) - ord('a')
            if freq[left_idx] == L:  # Was a complete special substring
                window_counts[left_idx] -= 1
            freq[left_idx] -= 1

            # Add new character to window
            right_idx = ord(s[i]) - ord('a')
            freq[right_idx] += 1
            if freq[right_idx] == L:  # Now a complete special substring
                window_counts[right_idx] += 1
                if window_counts[right_idx] >= 3:
                    return True

        return False

    # Binary search for the maximum valid length
    left, right = 1, n
    answer = -1

    while left <= right:
        mid = (left + right) // 2
        if can_find_length(mid):
            answer = mid  # Found a valid length, try longer
            left = mid + 1
        else:
            right = mid - 1  # Try shorter lengths

    return answer
```

```javascript
// Time: O(n log n) | Space: O(1)
function maximumLength(s) {
  /**
   * Find the longest special substring that occurs at least three times.
   *
   * Approach: Binary search on the answer length combined with sliding window
   * to check if a given length is feasible.
   */
  const n = s.length;

  /**
   * Check if there exists any special substring of length L
   * that appears at least 3 times.
   *
   * Uses sliding window to count occurrences of each character
   * in windows of size L.
   */
  const canFindLength = (L) => {
    // Frequency count of characters in current window
    const freq = new Array(26).fill(0);
    // Count of windows where a character appears consecutively L times
    const windowCounts = new Array(26).fill(0);

    // Initialize first window
    for (let i = 0; i < L; i++) {
      const idx = s.charCodeAt(i) - 97; // 'a' = 97
      freq[idx]++;
      if (freq[idx] === L) {
        // Entire window is this character
        windowCounts[idx]++;
        if (windowCounts[idx] >= 3) {
          return true;
        }
      }
    }

    // Slide the window across the string
    for (let i = L; i < n; i++) {
      // Remove leftmost character of previous window
      const leftIdx = s.charCodeAt(i - L) - 97;
      if (freq[leftIdx] === L) {
        // Was a complete special substring
        windowCounts[leftIdx]--;
      }
      freq[leftIdx]--;

      // Add new character to window
      const rightIdx = s.charCodeAt(i) - 97;
      freq[rightIdx]++;
      if (freq[rightIdx] === L) {
        // Now a complete special substring
        windowCounts[rightIdx]++;
        if (windowCounts[rightIdx] >= 3) {
          return true;
        }
      }
    }

    return false;
  };

  // Binary search for the maximum valid length
  let left = 1,
    right = n;
  let answer = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canFindLength(mid)) {
      answer = mid; // Found a valid length, try longer
      left = mid + 1;
    } else {
      right = mid - 1; // Try shorter lengths
    }
  }

  return answer;
}
```

```java
// Time: O(n log n) | Space: O(1)
class Solution {
    public int maximumLength(String s) {
        /**
         * Find the longest special substring that occurs at least three times.
         *
         * Approach: Binary search on the answer length combined with sliding window
         * to check if a given length is feasible.
         */
        int n = s.length();

        // Binary search for the maximum valid length
        int left = 1, right = n;
        int answer = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (canFindLength(s, mid)) {
                answer = mid;  // Found a valid length, try longer
                left = mid + 1;
            } else {
                right = mid - 1;  // Try shorter lengths
            }
        }

        return answer;
    }

    /**
     * Check if there exists any special substring of length L
     * that appears at least 3 times.
     *
     * Uses sliding window to count occurrences of each character
     * in windows of size L.
     */
    private boolean canFindLength(String s, int L) {
        int n = s.length();
        // Frequency count of characters in current window
        int[] freq = new int[26];
        // Count of windows where a character appears consecutively L times
        int[] windowCounts = new int[26];

        // Initialize first window
        for (int i = 0; i < L; i++) {
            int idx = s.charAt(i) - 'a';
            freq[idx]++;
            if (freq[idx] == L) {  // Entire window is this character
                windowCounts[idx]++;
                if (windowCounts[idx] >= 3) {
                    return true;
                }
            }
        }

        // Slide the window across the string
        for (int i = L; i < n; i++) {
            // Remove leftmost character of previous window
            int leftIdx = s.charAt(i - L) - 'a';
            if (freq[leftIdx] == L) {  // Was a complete special substring
                windowCounts[leftIdx]--;
            }
            freq[leftIdx]--;

            // Add new character to window
            int rightIdx = s.charAt(i) - 'a';
            freq[rightIdx]++;
            if (freq[rightIdx] == L) {  // Now a complete special substring
                windowCounts[rightIdx]++;
                if (windowCounts[rightIdx] >= 3) {
                    return true;
                }
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Binary search runs O(log n) iterations
- Each `can_find_length` check uses sliding window which takes O(n) time
- Total: O(n log n)

**Space Complexity:** O(1)

- We use fixed-size arrays of length 26 for frequency counts
- No additional space that scales with input size

## Common Mistakes

1. **Not recognizing monotonicity for binary search**: Some candidates try to check every length linearly. The key insight is that if length L works, all shorter lengths work too, enabling binary search.

2. **Inefficient feasibility check**: Even with binary search, checking each length by scanning for all possible substrings would be O(n² log n). The sliding window approach is crucial for O(n) checking.

3. **Off-by-one errors in sliding window**: When removing the left character and adding the right character, it's easy to get indices wrong. Always test with small examples like "aaa" with L=2.

4. **Forgetting to handle the no-solution case**: The problem states to return -1 if no special substring appears thrice. The binary search will naturally return -1 if no length works.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Binary search on answer**: When the answer is monotonic with respect to feasibility, you can binary search. Seen in:
   - "Koko Eating Bananas" (Medium) - binary search on eating speed
   - "Capacity To Ship Packages Within D Days" (Medium) - binary search on capacity

2. **Sliding window with frequency counts**: Efficiently checking substring properties. Seen in:
   - "Longest Substring Without Repeating Characters" (Medium) - sliding window with character counts
   - "Longest Substring with At Least K Repeating Characters" (Medium) - similar substring frequency constraints

## Key Takeaways

1. **When you need to find the maximum/minimum value satisfying a condition**, check if the condition is monotonic. If it is, binary search on the answer can reduce time complexity from linear to logarithmic.

2. **Sliding window is powerful for substring problems** where you need to check properties over all substrings of a certain length. It turns O(n²) scanning into O(n).

3. **Combine techniques for complex problems**: This problem isn't just binary search OR sliding window - it's both. Recognizing how to combine patterns is key to solving medium-hard problems.

Related problems: [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters), [Longest Substring with At Least K Repeating Characters](/problem/longest-substring-with-at-least-k-repeating-characters)
