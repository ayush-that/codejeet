---
title: "How to Solve Find All Anagrams in a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find All Anagrams in a String. Medium difficulty, 53.3% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2026-09-11"
category: "dsa-patterns"
tags: ["find-all-anagrams-in-a-string", "hash-table", "string", "sliding-window", "medium"]
---

# How to Solve Find All Anagrams in a String

This problem asks us to find all starting indices in string `s` where an anagram of string `p` begins. An anagram is a rearrangement of letters — for example, "abc" has anagrams "acb", "bac", "bca", "cab", and "cba". What makes this problem interesting is that we need to efficiently check for pattern matches across a potentially large string `s`, which requires more than simple character-by-character comparison.

## Visual Walkthrough

Let's trace through an example: `s = "cbaebabacd"`, `p = "abc"`

We're looking for all positions in `s` where we can find a substring that contains exactly the same letters as `p` (same characters, same counts).

**Step-by-step:**

1. **Window 1 (indices 0-2):** `"cba"` → Contains 'c', 'b', 'a' → This is an anagram of "abc"! Add index 0 to result.
2. **Window 2 (indices 1-3):** `"bae"` → Contains 'b', 'a', 'e' → 'e' not in "abc", so not an anagram.
3. **Window 3 (indices 2-4):** `"aeb"` → Contains 'a', 'e', 'b' → 'e' not in "abc", so not an anagram.
4. **Window 4 (indices 3-5):** `"eba"` → Contains 'e', 'b', 'a' → 'e' not in "abc", so not an anagram.
5. **Window 5 (indices 4-6):** `"bab"` → Contains 'b', 'a', 'b' → Two 'b's but "abc" only has one, so not an anagram.
6. **Window 6 (indices 5-7):** `"aba"` → Contains 'a', 'b', 'a' → Two 'a's but "abc" only has one, so not an anagram.
7. **Window 7 (indices 6-8):** `"bac"` → Contains 'b', 'a', 'c' → This is an anagram of "abc"! Add index 6 to result.
8. **Window 8 (indices 7-9):** `"acd"` → Contains 'a', 'c', 'd' → 'd' not in "abc", so not an anagram.

**Result:** `[0, 6]`

The key insight: Instead of checking each window from scratch, we can maintain a sliding window and update character counts efficiently as we move through `s`.

## Brute Force Approach

A naive approach would be to check every possible substring of length `len(p)` in `s`:

1. For each starting index `i` from 0 to `len(s) - len(p)`
2. Extract substring `s[i:i+len(p)]`
3. Check if this substring is an anagram of `p` by comparing character frequencies

**Why this is inefficient:**

- Time complexity: O(n × m) where n = len(s), m = len(p)
- For each window, we need to count characters (O(m) time)
- With n windows, this becomes O(n × m)
- For large strings (n = 10^5, m = 10^4), this would be 10^9 operations — too slow!

The brute force fails because it doesn't reuse information between overlapping windows. When we slide the window one position to the right, most characters stay the same — only the leftmost character leaves and a new rightmost character enters.

## Optimized Approach

The key insight is to use a **sliding window with character frequency counting**. Here's the step-by-step reasoning:

1. **Count characters in `p`**: Create a frequency map (dictionary/hash map) of characters in `p`.
2. **Maintain a sliding window**: Keep a frequency map for the current window in `s`.
3. **Efficient updates**: When sliding the window right by one position:
   - Decrease count of the character leaving the window (leftmost)
   - Increase count of the character entering the window (rightmost)
4. **Compare efficiently**: Instead of comparing entire maps each time (O(26) for lowercase letters), we can track how many characters have matching counts between the window and `p`.
5. **Check for anagram**: When all characters have matching counts, we've found an anagram.

**Why this works:**

- We only process each character in `s` once when it enters and once when it leaves → O(n) time
- We maintain constant-time updates to our frequency tracking
- The comparison between window and `p` becomes O(1) with proper tracking

## Optimal Solution

Here's the complete solution using the sliding window approach:

<div class="code-group">

```python
# Time: O(n) where n = len(s) | Space: O(1) since we store at most 26 characters
def findAnagrams(s: str, p: str) -> List[int]:
    if len(p) > len(s):
        return []

    result = []
    p_count = [0] * 26  # Frequency count for characters in p
    window_count = [0] * 26  # Frequency count for current window in s

    # Count characters in p and first window of s
    for i in range(len(p)):
        p_count[ord(p[i]) - ord('a')] += 1
        window_count[ord(s[i]) - ord('a')] += 1

    # Check if first window is an anagram
    if p_count == window_count:
        result.append(0)

    # Slide the window through the rest of s
    for i in range(len(p), len(s)):
        # Remove leftmost character from window
        left_char = s[i - len(p)]
        window_count[ord(left_char) - ord('a')] -= 1

        # Add new character to window
        right_char = s[i]
        window_count[ord(right_char) - ord('a')] += 1

        # Check if current window is an anagram
        if p_count == window_count:
            result.append(i - len(p) + 1)

    return result
```

```javascript
// Time: O(n) where n = s.length | Space: O(1) since we store at most 26 characters
function findAnagrams(s, p) {
  if (p.length > s.length) return [];

  const result = [];
  const pCount = new Array(26).fill(0); // Frequency count for characters in p
  const windowCount = new Array(26).fill(0); // Frequency count for current window

  // Count characters in p and first window of s
  for (let i = 0; i < p.length; i++) {
    pCount[p.charCodeAt(i) - 97]++; // 'a' has ASCII code 97
    windowCount[s.charCodeAt(i) - 97]++;
  }

  // Check if first window is an anagram
  if (arraysEqual(pCount, windowCount)) {
    result.push(0);
  }

  // Slide the window through the rest of s
  for (let i = p.length; i < s.length; i++) {
    // Remove leftmost character from window
    const leftChar = s[i - p.length];
    windowCount[leftChar.charCodeAt(0) - 97]--;

    // Add new character to window
    const rightChar = s[i];
    windowCount[rightChar.charCodeAt(0) - 97]++;

    // Check if current window is an anagram
    if (arraysEqual(pCount, windowCount)) {
      result.push(i - p.length + 1);
    }
  }

  return result;
}

// Helper function to compare two arrays
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
```

```java
// Time: O(n) where n = s.length() | Space: O(1) since we store at most 26 characters
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();

    // Edge case: p cannot be longer than s
    if (p.length() > s.length()) {
        return result;
    }

    int[] pCount = new int[26];  // Frequency count for characters in p
    int[] windowCount = new int[26];  // Frequency count for current window

    // Count characters in p and first window of s
    for (int i = 0; i < p.length(); i++) {
        pCount[p.charAt(i) - 'a']++;
        windowCount[s.charAt(i) - 'a']++;
    }

    // Check if first window is an anagram
    if (Arrays.equals(pCount, windowCount)) {
        result.add(0);
    }

    // Slide the window through the rest of s
    for (int i = p.length(); i < s.length(); i++) {
        // Remove leftmost character from window
        char leftChar = s.charAt(i - p.length());
        windowCount[leftChar - 'a']--;

        // Add new character to window
        char rightChar = s.charAt(i);
        windowCount[rightChar - 'a']++;

        // Check if current window is an anagram
        if (Arrays.equals(pCount, windowCount)) {
            result.add(i - p.length() + 1);
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through `s` once to build the initial window: O(m) where m = len(p)
- We then slide the window through the remaining n-m characters: O(n-m)
- Each iteration does constant work (array updates and comparison)
- Total: O(m + (n-m)) = O(n)

**Space Complexity: O(1)**

- We use two fixed-size arrays of length 26 (for lowercase English letters)
- The result list could be O(n) in worst case (every position is an anagram), but this is output space, not auxiliary space
- Auxiliary space (extra space besides input and output) is constant: O(26) = O(1)

## Common Mistakes

1. **Forgetting the edge case where p is longer than s**: Always check this first! If `len(p) > len(s)`, there can't be any anagrams.

2. **Off-by-one errors in window indices**: When adding a result, remember it's the starting index. For window ending at index `i`, the start is `i - len(p) + 1`, not `i - len(p)`.

3. **Inefficient comparison of frequency maps**: Comparing two dictionaries/arrays each time takes O(26) time. While this is still constant, some candidates try to convert to strings or use other O(m) comparisons.

4. **Not handling the first window separately**: The sliding window loop typically starts from `len(p)`, so you need to check the initial window before the loop begins.

5. **Using the wrong data structure**: Some candidates use hash maps when arrays would be more efficient for lowercase letters. Arrays have O(1) access and fixed overhead.

## When You'll See This Pattern

The sliding window with frequency counting pattern appears in many string problems:

1. **Permutation in String (LeetCode 567)**: Almost identical to this problem — check if `s2` contains a permutation of `s1`.

2. **Minimum Window Substring (LeetCode 76)**: Find the minimum window in `s` that contains all characters of `t`. Uses similar frequency counting with two pointers.

3. **Longest Substring Without Repeating Characters (LeetCode 3)**: Uses sliding window to track character occurrences without repeats.

4. **Substring with Concatenation of All Words (LeetCode 30)**: A more complex version where you're looking for concatenations of words instead of anagrams of characters.

The pattern is recognizable when you need to find substrings with specific character frequency requirements and the input is too large for brute force checking of all substrings.

## Key Takeaways

1. **Sliding window + frequency counting** is the go-to approach for substring problems with character count constraints. When you see "anagram", "permutation", or "contains all characters" in a problem description, think of this pattern.

2. **Arrays beat hash maps for fixed alphabets**: When dealing with lowercase/uppercase English letters, use arrays of size 26/52 instead of hash maps for better constant factors.

3. **Track matches efficiently**: Instead of comparing entire frequency arrays each time, you could track the number of characters with matching counts between window and pattern. This optimization reduces the constant factor but adds complexity.

Related problems: [Valid Anagram](/problem/valid-anagram), [Permutation in String](/problem/permutation-in-string)
