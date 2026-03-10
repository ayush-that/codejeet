---
title: "How to Solve Longest Substring with At Least K Repeating Characters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Substring with At Least K Repeating Characters. Medium difficulty, 46.1% acceptance rate. Topics: Hash Table, String, Divide and Conquer, Sliding Window."
date: "2028-01-25"
category: "dsa-patterns"
tags:
  [
    "longest-substring-with-at-least-k-repeating-characters",
    "hash-table",
    "string",
    "divide-and-conquer",
    "medium",
  ]
---

# How to Solve Longest Substring with At Least K Repeating Characters

This problem asks us to find the longest substring where every character appears at least `k` times. What makes this tricky is that we can't use a standard sliding window approach directly—we need to ensure _all_ characters in the window meet the frequency requirement, not just track unique characters. This constraint forces us to think differently about how we explore substrings.

## Visual Walkthrough

Let's trace through `s = "aaabb"`, `k = 3`:

1. **Full string check**: `"aaabb"` has 'a' appears 3 times (≥3) but 'b' appears 2 times (<3). So the whole string doesn't work.
2. **Try substrings**:
   - `"aaab"`: 'a'=3 (≥3), 'b'=1 (<3) ❌
   - `"aabb"`: 'a'=2 (<3), 'b'=2 (<3) ❌
   - `"aaa"`: 'a'=3 (≥3) ✅ Length=3
   - `"abb"`: 'a'=1 (<3), 'b'=2 (<3) ❌
   - `"aa"`: 'a'=2 (<3) ❌
   - `"bb"`: 'b'=2 (<3) ❌
3. **Longest valid substring**: `"aaa"` with length 3.

For `s = "ababbc"`, `k = 2`:

1. **Full string**: 'a'=2 (≥2), 'b'=3 (≥2), 'c'=1 (<2) ❌
2. **Key insight**: Character 'c' appears only once (<2), so _any_ valid substring cannot contain 'c'. We can split the problem at 'c':
   - Left of 'c': `"ababb"` → Check recursively
   - Right of 'c': `""` (empty)
3. **Recurse on `"ababb"`**: Check full string: 'a'=2 (≥2), 'b'=3 (≥2) ✅ Length=5
4. **Answer**: 5

This splitting approach is the core of our optimized solution.

## Brute Force Approach

A naive solution would check every possible substring. For each substring:

1. Count frequency of each character
2. Verify all frequencies ≥ k
3. Track the maximum length

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n)
def longestSubstring_brute(s: str, k: int) -> int:
    n = len(s)
    max_len = 0

    # Try all possible substrings
    for i in range(n):
        for j in range(i, n):
            # Count frequencies in substring s[i:j+1]
            freq = {}
            for ch in s[i:j+1]:
                freq[ch] = freq.get(ch, 0) + 1

            # Check if all frequencies >= k
            valid = True
            for count in freq.values():
                if count < k:
                    valid = False
                    break

            if valid:
                max_len = max(max_len, j - i + 1)

    return max_len
```

```javascript
// Time: O(n^3) | Space: O(n)
function longestSubstringBrute(s, k) {
  const n = s.length;
  let maxLen = 0;

  // Try all possible substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count frequencies in substring s[i:j+1]
      const freq = new Map();
      for (let idx = i; idx <= j; idx++) {
        const ch = s[idx];
        freq.set(ch, (freq.get(ch) || 0) + 1);
      }

      // Check if all frequencies >= k
      let valid = true;
      for (const count of freq.values()) {
        if (count < k) {
          valid = false;
          break;
        }
      }

      if (valid) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n^3) | Space: O(n)
public int longestSubstringBrute(String s, int k) {
    int n = s.length();
    int maxLen = 0;

    // Try all possible substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Count frequencies in substring s[i:j+1]
            Map<Character, Integer> freq = new HashMap<>();
            for (int idx = i; idx <= j; idx++) {
                char ch = s.charAt(idx);
                freq.put(ch, freq.getOrDefault(ch, 0) + 1);
            }

            // Check if all frequencies >= k
            boolean valid = true;
            for (int count : freq.values()) {
                if (count < k) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}
```

</div>

**Why this is inefficient**: With O(n²) substrings and O(n) time to count frequencies for each, we get O(n³) time complexity. For n=100, that's ~1,000,000 operations—too slow for typical constraints.

## Optimized Approach

The key insight is **divide and conquer** using characters that appear too infrequently as split points:

1. **Count all character frequencies** in the current substring
2. **Find characters with frequency < k** — these "bad" characters cannot be part of any valid substring
3. **If no bad characters**: The entire substring is valid
4. **If bad characters exist**: Split the string at each bad character and recursively check each segment
   - Any valid substring must lie entirely within one segment (since crossing a bad character would include it)
5. **Return the maximum length** from all segments

This works because we eliminate invalid characters early, reducing the search space dramatically.

## Optimal Solution

Here's the divide-and-conquer implementation:

<div class="code-group">

```python
# Time: O(n^2) worst case, but O(n log n) average | Space: O(n) for recursion stack
def longestSubstring(s: str, k: int) -> int:
    # Base case: empty string or k > length
    if len(s) < k:
        return 0

    # Step 1: Count frequency of each character
    freq = {}
    for ch in s:
        freq[ch] = freq.get(ch, 0) + 1

    # Step 2: Find the first character with frequency < k
    # We'll use this character to split the string
    for i, ch in enumerate(s):
        if freq[ch] < k:
            # Step 3: Split and conquer
            # Recursively check left and right segments
            left = longestSubstring(s[:i], k)
            right = longestSubstring(s[i+1:], k)
            return max(left, right)

    # Step 4: If we get here, all characters have frequency >= k
    return len(s)
```

```javascript
// Time: O(n^2) worst case, but O(n log n) average | Space: O(n) for recursion stack
function longestSubstring(s, k) {
  // Base case: empty string or k > length
  if (s.length < k) return 0;

  // Step 1: Count frequency of each character
  const freq = new Map();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  // Step 2: Find the first character with frequency < k
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (freq.get(ch) < k) {
      // Step 3: Split and conquer
      // Recursively check left and right segments
      const left = longestSubstring(s.substring(0, i), k);
      const right = longestSubstring(s.substring(i + 1), k);
      return Math.max(left, right);
    }
  }

  // Step 4: If we get here, all characters have frequency >= k
  return s.length;
}
```

```java
// Time: O(n^2) worst case, but O(n log n) average | Space: O(n) for recursion stack
public int longestSubstring(String s, int k) {
    // Base case: empty string or k > length
    if (s.length() < k) return 0;

    // Step 1: Count frequency of each character
    Map<Character, Integer> freq = new HashMap<>();
    for (char ch : s.toCharArray()) {
        freq.put(ch, freq.getOrDefault(ch, 0) + 1);
    }

    // Step 2: Find the first character with frequency < k
    for (int i = 0; i < s.length(); i++) {
        char ch = s.charAt(i);
        if (freq.get(ch) < k) {
            // Step 3: Split and conquer
            // Recursively check left and right segments
            int left = longestSubstring(s.substring(0, i), k);
            int right = longestSubstring(s.substring(i + 1), k);
            return Math.max(left, right);
        }
    }

    // Step 4: If we get here, all characters have frequency >= k
    return s.length();
}
```

</div>

**Alternative optimized approach**: We can also solve this with a sliding window by limiting the number of unique characters. For each possible number of unique characters (1 to 26), we find the longest substring with exactly that many unique characters where each appears ≥ k times. This gives O(26n) = O(n) time.

## Complexity Analysis

**Divide and Conquer Approach**:

- **Time**: O(n²) in worst case (e.g., `"abcdefghij"` with k=2, splits one character at a time). Average case is O(n log n) with balanced splits.
- **Space**: O(n) for the recursion stack in worst case.

**Sliding Window Approach** (alternative):

- **Time**: O(26n) = O(n) since we try 1 to 26 unique characters
- **Space**: O(1) for frequency arrays of size 26

The divide-and-conquer solution is simpler to implement and explain in interviews, which is why we focus on it here.

## Common Mistakes

1. **Trying to use standard sliding window directly**: Candidates often try to expand/contract a window while tracking character counts, but there's no clear condition for when to shrink the window. The requirement "all characters must appear ≥ k times" doesn't give a simple invalid condition for sliding window.

2. **Forgetting to handle the base case**: If k > length of string, we should return 0 immediately. Also, empty strings should return 0.

3. **Incorrect splitting logic**: When splitting at a bad character, some candidates try to check substrings that include the bad character or skip checking both sides. Remember: any valid substring cannot contain the bad character, so we must check segments on both sides separately.

4. **Not considering all split points**: Some implementations only split at the first bad character, but we need to recursively handle all segments. The recursion naturally handles this.

## When You'll See This Pattern

This divide-and-conquer pattern appears in problems where:

1. The solution for a segment depends only on elements within that segment
2. There are "invalid" elements that prevent a global solution
3. Removing invalid elements creates independent subproblems

**Related problems**:

- **395. Longest Substring with At Least K Repeating Characters** (this problem) - Classic example
- **241. Different Ways to Add Parentheses** - Split at operators, recursively evaluate both sides
- **108. Convert Sorted Array to Binary Search Tree** - Split array at midpoint to build balanced BST
- **53. Maximum Subarray** (Divide & Conquer variant) - Split array, find max crossing sum

## Key Takeaways

1. **Divide and conquer with split points**: When a problem has elements that invalidate a solution, use them as boundaries to create independent subproblems.

2. **Character frequency problems often need creative approaches**: Standard sliding window works for "at most K unique" or "no duplicates" problems, but "all characters meet condition" requires different thinking.

3. **Recursion simplifies complex validation**: Instead of trying to validate all substrings directly, recursively break down the problem until validation becomes trivial (all characters meet the condition).

**Related problems**: [Longest Subsequence Repeated k Times](/problem/longest-subsequence-repeated-k-times), [Number of Equal Count Substrings](/problem/number-of-equal-count-substrings), [Optimal Partition of String](/problem/optimal-partition-of-string)
