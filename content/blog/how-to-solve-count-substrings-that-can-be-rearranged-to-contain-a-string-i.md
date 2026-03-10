---
title: "How to Solve Count Substrings That Can Be Rearranged to Contain a String I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Substrings That Can Be Rearranged to Contain a String I. Medium difficulty, 42.7% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2029-11-27"
category: "dsa-patterns"
tags:
  [
    "count-substrings-that-can-be-rearranged-to-contain-a-string-i",
    "hash-table",
    "string",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Count Substrings That Can Be Rearranged to Contain a String I

You're given two strings `word1` and `word2`. A substring of `word1` is valid if you can rearrange its characters to have `word2` as a prefix. Your task is to count all such valid substrings. What makes this problem interesting is that we're not looking for exact matches—we're looking for substrings that contain enough characters to form `word2` at the beginning after rearrangement. This is essentially a "character frequency" problem disguised as a substring counting challenge.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- `word1 = "abcabc"`
- `word2 = "abc"`

We need to count all substrings of `word1` that contain at least one 'a', one 'b', and one 'c' (since we need to form "abc" as a prefix after rearrangement).

**Step-by-step counting:**

1. Start at index 0: substring "a" → missing 'b' and 'c' → invalid
2. Index 0-1: "ab" → missing 'c' → invalid
3. Index 0-2: "abc" → has all required letters → valid
4. Index 0-3: "abca" → has all required letters → valid
5. Index 0-4: "abcab" → valid
6. Index 0-5: "abcabc" → valid

Now move starting point to index 1:

1. Index 1: "b" → missing 'a' and 'c' → invalid
2. Index 1-2: "bc" → missing 'a' → invalid
3. Index 1-3: "bca" → has all required letters → valid
4. Index 1-4: "bcab" → valid
5. Index 1-5: "bcabc" → valid

Continue this process for all starting positions. The key insight: once we find a valid substring starting at position `i`, all longer substrings starting at `i` will also be valid (since adding more characters can't remove the required ones).

For our example, the valid substrings are:

- Starting at 0: "abc", "abca", "abcab", "abcabc" (4 substrings)
- Starting at 1: "bca", "bcab", "bcabc" (3 substrings)
- Starting at 2: "cab", "cabc" (2 substrings)
- Starting at 3: "abc" (1 substring)
- Starting at 4: "bc" → missing 'a' → invalid
- Starting at 5: "c" → invalid

Total: 4 + 3 + 2 + 1 = 10 valid substrings.

## Brute Force Approach

The most straightforward approach is to check every possible substring of `word1`. For each substring:

1. Count character frequencies in the substring
2. Check if it contains at least the required count of each character in `word2`

<div class="code-group">

```python
# Time: O(n³) | Space: O(m) where m is size of character set
def bruteForceCountSubstrings(word1, word2):
    n = len(word1)
    m = len(word2)
    count = 0

    # Count required characters in word2
    from collections import Counter
    required = Counter(word2)

    # Check all possible substrings
    for i in range(n):
        for j in range(i, n):
            # Count characters in current substring word1[i:j+1]
            substring_counts = Counter(word1[i:j+1])

            # Check if substring has all required characters
            valid = True
            for char, need in required.items():
                if substring_counts.get(char, 0) < need:
                    valid = False
                    break

            if valid:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(m) where m is size of character set
function bruteForceCountSubstrings(word1, word2) {
  const n = word1.length;
  const m = word2.length;
  let count = 0;

  // Count required characters in word2
  const required = new Map();
  for (const char of word2) {
    required.set(char, (required.get(char) || 0) + 1);
  }

  // Check all possible substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count characters in current substring
      const substringCounts = new Map();
      for (let k = i; k <= j; k++) {
        const char = word1[k];
        substringCounts.set(char, (substringCounts.get(char) || 0) + 1);
      }

      // Check if substring has all required characters
      let valid = true;
      for (const [char, need] of required) {
        if ((substringCounts.get(char) || 0) < need) {
          valid = false;
          break;
        }
      }

      if (valid) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(m) where m is size of character set
public int bruteForceCountSubstrings(String word1, String word2) {
    int n = word1.length();
    int count = 0;

    // Count required characters in word2
    Map<Character, Integer> required = new HashMap<>();
    for (char c : word2.toCharArray()) {
        required.put(c, required.getOrDefault(c, 0) + 1);
    }

    // Check all possible substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Count characters in current substring
            Map<Character, Integer> substringCounts = new HashMap<>();
            for (int k = i; k <= j; k++) {
                char c = word1.charAt(k);
                substringCounts.put(c, substringCounts.getOrDefault(c, 0) + 1);
            }

            // Check if substring has all required characters
            boolean valid = true;
            for (Map.Entry<Character, Integer> entry : required.entrySet()) {
                char c = entry.getKey();
                int need = entry.getValue();
                if (substringCounts.getOrDefault(c, 0) < need) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is inefficient:**

- Time complexity is O(n³): O(n²) substrings, and for each substring we need O(n) to count characters (or O(m) where m is the character set size, but worst case n).
- For n = 1000, this would be ~10⁹ operations, which is far too slow.

## Optimized Approach

The key insight is to use a **sliding window** approach. For each starting position `i`, we find the smallest `j` such that `word1[i:j+1]` contains all required characters from `word2`. Once we find this minimal valid substring, we know that all substrings starting at `i` and ending at `j` or later are also valid.

**Step-by-step reasoning:**

1. First, count character frequencies in `word2` to know what we need.
2. Use two pointers: `left` (start of substring) and `right` (end of substring).
3. Maintain a window count of characters between `left` and `right`.
4. For each `left`, move `right` until the window contains all required characters.
5. Once we have a valid window at `[left, right]`, all substrings `[left, k]` where `k >= right` are valid. That's `n - right` substrings.
6. Then move `left` forward by 1, update window counts, and repeat.

**Why this works:**

- The sliding window ensures we don't recompute character counts from scratch each time.
- When we find a valid window starting at `left` and ending at `right`, we know that extending the window further (increasing `right`) will keep it valid (adding characters can't remove required ones).
- So we can count all valid substrings starting at `left` in O(1) time once we find the minimal valid window.

## Optimal Solution

Here's the optimized sliding window solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed size character frequency arrays
def countSubstrings(word1, word2):
    n = len(word1)

    # Count required characters in word2
    # We use arrays of size 26 since problem states lowercase English letters
    required = [0] * 26
    for char in word2:
        required[ord(char) - ord('a')] += 1

    # Current window character counts
    window = [0] * 26
    left = 0
    total = 0

    # Helper function to check if window contains all required characters
    def is_valid():
        for i in range(26):
            if window[i] < required[i]:
                return False
        return True

    # Sliding window approach
    for right in range(n):
        # Add character at right pointer to window
        window[ord(word1[right]) - ord('a')] += 1

        # While window is valid, count substrings and shrink from left
        while left <= right and is_valid():
            # All substrings starting at left and ending at right or later are valid
            total += (n - right)

            # Remove character at left from window and move left pointer
            window[ord(word1[left]) - ord('a')] -= 1
            left += 1

    return total
```

```javascript
// Time: O(n) | Space: O(1) - fixed size character frequency arrays
function countSubstrings(word1, word2) {
  const n = word1.length;

  // Count required characters in word2
  // We use arrays of size 26 since problem states lowercase English letters
  const required = new Array(26).fill(0);
  for (const char of word2) {
    required[char.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Current window character counts
  const window = new Array(26).fill(0);
  let left = 0;
  let total = 0;

  // Helper function to check if window contains all required characters
  const isValid = () => {
    for (let i = 0; i < 26; i++) {
      if (window[i] < required[i]) {
        return false;
      }
    }
    return true;
  };

  // Sliding window approach
  for (let right = 0; right < n; right++) {
    // Add character at right pointer to window
    window[word1.charCodeAt(right) - "a".charCodeAt(0)]++;

    // While window is valid, count substrings and shrink from left
    while (left <= right && isValid()) {
      // All substrings starting at left and ending at right or later are valid
      total += n - right;

      // Remove character at left from window and move left pointer
      window[word1.charCodeAt(left) - "a".charCodeAt(0)]--;
      left++;
    }
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(1) - fixed size character frequency arrays
public int countSubstrings(String word1, String word2) {
    int n = word1.length();

    // Count required characters in word2
    // We use arrays of size 26 since problem states lowercase English letters
    int[] required = new int[26];
    for (char c : word2.toCharArray()) {
        required[c - 'a']++;
    }

    // Current window character counts
    int[] window = new int[26];
    int left = 0;
    int total = 0;

    // Sliding window approach
    for (int right = 0; right < n; right++) {
        // Add character at right pointer to window
        window[word1.charAt(right) - 'a']++;

        // Check if window contains all required characters
        boolean valid = true;
        while (left <= right && valid) {
            for (int i = 0; i < 26; i++) {
                if (window[i] < required[i]) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                // All substrings starting at left and ending at right or later are valid
                total += (n - right);

                // Remove character at left from window and move left pointer
                window[word1.charAt(left) - 'a']--;
                left++;

                // Need to recheck validity after shrinking window
                valid = true;
            }
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character at most twice: once when it enters the window (right pointer moves) and once when it leaves (left pointer moves).
- The `is_valid()` check runs in O(26) = O(1) time since we only have 26 lowercase letters.
- Total operations: O(2n \* 26) = O(n).

**Space Complexity: O(1)**

- We use two fixed-size arrays of length 26 to store character frequencies.
- No additional data structures that scale with input size.

## Common Mistakes

1. **Off-by-one errors in substring counting**: When you find a valid window `[left, right]`, the number of valid substrings starting at `left` is `n - right`, not `n - right + 1`. Remember that `right` is 0-indexed, so `n - right` gives you the count of ending positions from `right` to `n-1`.

2. **Forgetting to handle multiple occurrences of the same character**: If `word2 = "aab"`, you need two 'a's and one 'b'. Some solutions only check if characters are present without counting frequencies.

3. **Inefficient validity checking**: Re-checking all 26 characters every time in the while loop seems inefficient, but it's actually O(1). However, an optimization is to track how many requirements are satisfied and only update when counts cross thresholds.

4. **Not resetting window counts properly when moving left pointer**: When you shrink the window, you must decrement the count for the character at `left` BEFORE moving the pointer, not after.

## When You'll See This Pattern

This sliding window pattern with character frequency tracking appears in several LeetCode problems:

1. **Minimum Window Substring (Hard)**: Find the minimum substring containing all characters of another string. Very similar to our problem but looking for minimum length instead of counting all valid substrings.

2. **Find All Anagrams in a String (Medium)**: Find starting indices of all anagrams of a string in another string. Uses the same character frequency tracking with a sliding window.

3. **Permutation in String (Medium)**: Check if one string contains a permutation of another. A simpler version of our problem where window size is fixed.

The core pattern: when you need to find substrings that satisfy character frequency constraints, think sliding window with frequency counters.

## Key Takeaways

1. **Sliding window with frequency counters** is the go-to approach for substring problems with character requirements. The window expands to meet requirements and contracts to find minimal valid substrings.

2. **Once a substring is valid, all longer substrings starting at the same position are also valid** when adding characters (can't remove existing ones). This lets you count in O(1) time.

3. **Fixed-size arrays are more efficient than hash maps** for character frequency when the character set is small and known (like 26 lowercase letters).

Related problems: [Minimum Window Substring](/problem/minimum-window-substring)
