---
title: "How to Solve Length of the Longest Valid Substring — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Length of the Longest Valid Substring. Hard difficulty, 38.2% acceptance rate. Topics: Array, Hash Table, String, Sliding Window."
date: "2028-12-13"
category: "dsa-patterns"
tags: ["length-of-the-longest-valid-substring", "array", "hash-table", "string", "hard"]
---

# How to Solve Length of the Longest Valid Substring

This problem asks us to find the longest contiguous substring of a given string `word` where **no substring** appears in a forbidden list. The challenge is that we can't just check if the entire substring contains forbidden words—we must ensure that **every possible substring within it** is clean. This makes brute force checking exponentially expensive, requiring a smarter approach.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
word = "cbaaaabc"
forbidden = ["aaa", "cb"]
```

We need to find the longest substring where no part matches "aaa" or "cb".

**Step-by-step reasoning:**

1. Start with the full string "cbaaaabc"
   - Contains "cb" (starting at index 0) → invalid
2. Try substrings starting at index 1: "baaaabc"
   - Contains "aaa" (indices 2-4) → invalid
3. Try starting at index 2: "aaaabc"
   - Contains "aaa" immediately → invalid
4. Try starting at index 3: "aaabc"
   - Contains "aaa" (indices 3-5) → invalid
5. Try starting at index 4: "aabc"
   - Check all substrings: "a", "aa", "aab", "aabc", "a", "ab", "abc", "b", "bc", "c"
   - None match "aaa" or "cb" → valid! Length = 4
6. Continue checking other starting positions, but 4 is our longest valid substring.

The key insight: when we find a forbidden substring ending at position `j`, we know any larger substring containing it is also invalid. This suggests a **sliding window** approach where we move the left boundary past the violation.

## Brute Force Approach

A naive solution would check every possible substring `(i, j)` where `0 ≤ i ≤ j < n`:

1. For each starting index `i`
2. For each ending index `j ≥ i`
3. Check if substring `word[i:j+1]` contains any forbidden substring
4. Track the maximum length where all checks pass

The checking step (3) is problematic: we'd need to examine all substrings within `word[i:j+1]` against all forbidden strings. Even with a hash set for O(1) lookups, if `forbidden` contains strings up to length `m`, and `word` has length `n`, we have O(n²) substrings to check, each requiring up to O(m) comparisons → O(n³m) worst case.

This is clearly infeasible for constraints where `n` can be up to 10⁵.

## Optimized Approach

The optimal solution uses a **sliding window with a Trie**:

**Key insights:**

1. We only need to check substrings ending at our current position `j` against forbidden words
2. Forbidden words have maximum length 10 (per constraints), so we only need to check the last 10 characters
3. A Trie lets us efficiently check if any suffix of our current window matches a forbidden word
4. When we find a match, we move the left boundary `i` to `j - length + 2` to exclude the violation

**Why this works:**

- We maintain a window `[i, j]` that's always valid
- At each step `j`, we check suffixes ending at `j` against forbidden words
- If a forbidden word is found ending at `j`, we know the smallest violation ends at some position `k ≤ j`
- We move `i` to `k+1` to exclude this violation while keeping the window valid
- The maximum window size encountered is our answer

## Optimal Solution

Here's the complete implementation using a Trie and sliding window:

<div class="code-group">

```python
# Time: O(n * L) where L = max length of forbidden words (≤10)
# Space: O(T) where T = total characters in forbidden words
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Solution:
    def longestValidSubstring(self, word: str, forbidden: List[str]) -> int:
        # Build Trie from forbidden words
        root = TrieNode()
        for f in forbidden:
            node = root
            for ch in f:
                if ch not in node.children:
                    node.children[ch] = TrieNode()
                node = node.children[ch]
            node.is_end = True

        n = len(word)
        max_len = 0
        left = 0  # Left boundary of valid window

        for right in range(n):  # right boundary of window
            # Check all suffixes ending at 'right' against Trie
            # We only need to check up to min(10, right-left+1) characters
            node = root
            # Start from 'right' and go backwards up to 10 steps or until 'left'
            for k in range(right, max(left-1, right-10), -1):
                ch = word[k]
                if ch not in node.children:
                    break  # No forbidden word can match this suffix
                node = node.children[ch]
                if node.is_end:
                    # Found a forbidden word ending at 'right'
                    # Move left boundary to k+1 to exclude this violation
                    left = k + 1
                    break  # We found the shortest violation ending at 'right'

            # Update maximum valid substring length
            max_len = max(max_len, right - left + 1)

        return max_len
```

```javascript
// Time: O(n * L) where L = max length of forbidden words (≤10)
// Space: O(T) where T = total characters in forbidden words
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

var longestValidSubstring = function (word, forbidden) {
  // Build Trie from forbidden words
  const root = new TrieNode();
  for (const f of forbidden) {
    let node = root;
    for (const ch of f) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  const n = word.length;
  let maxLen = 0;
  let left = 0; // Left boundary of valid window

  for (let right = 0; right < n; right++) {
    // Check all suffixes ending at 'right' against Trie
    // We only need to check up to min(10, right-left+1) characters
    let node = root;
    // Start from 'right' and go backwards up to 10 steps or until 'left'
    for (let k = right; k >= Math.max(left, right - 9); k--) {
      const ch = word[k];
      if (!node.children.has(ch)) {
        break; // No forbidden word can match this suffix
      }
      node = node.children.get(ch);
      if (node.isEnd) {
        // Found a forbidden word ending at 'right'
        // Move left boundary to k+1 to exclude this violation
        left = k + 1;
        break; // We found the shortest violation ending at 'right'
      }
    }

    // Update maximum valid substring length
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
};
```

```java
// Time: O(n * L) where L = max length of forbidden words (≤10)
// Space: O(T) where T = total characters in forbidden words
class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEnd;

    TrieNode() {
        children = new HashMap<>();
        isEnd = false;
    }
}

class Solution {
    public int longestValidSubstring(String word, List<String> forbidden) {
        // Build Trie from forbidden words
        TrieNode root = new TrieNode();
        for (String f : forbidden) {
            TrieNode node = root;
            for (char ch : f.toCharArray()) {
                node.children.putIfAbsent(ch, new TrieNode());
                node = node.children.get(ch);
            }
            node.isEnd = true;
        }

        int n = word.length();
        int maxLen = 0;
        int left = 0;  // Left boundary of valid window

        for (int right = 0; right < n; right++) {
            // Check all suffixes ending at 'right' against Trie
            // We only need to check up to min(10, right-left+1) characters
            TrieNode node = root;
            // Start from 'right' and go backwards up to 10 steps or until 'left'
            for (int k = right; k >= Math.max(left, right - 9); k--) {
                char ch = word.charAt(k);
                if (!node.children.containsKey(ch)) {
                    break;  // No forbidden word can match this suffix
                }
                node = node.children.get(ch);
                if (node.isEnd) {
                    // Found a forbidden word ending at 'right'
                    // Move left boundary to k+1 to exclude this violation
                    left = k + 1;
                    break;  // We found the shortest violation ending at 'right'
                }
            }

            // Update maximum valid substring length
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × L) where:

- `n` is the length of `word`
- `L` is the maximum length of forbidden words (≤ 10 per constraints)
- For each position `right`, we check at most `L` characters backwards
- Building the Trie takes O(T) where T is total characters in forbidden words

**Space Complexity:** O(T) where:

- `T` is the total number of characters in all forbidden words
- The Trie stores each character of each forbidden word once
- We use O(1) additional space for pointers and counters

## Common Mistakes

1. **Checking all substrings within the window**: Instead of checking only suffixes ending at `right`, some candidates check all substrings in `[left, right]`. This adds an extra O(n) factor, making it O(n²L).

2. **Incorrect left boundary update**: When finding a forbidden word ending at position `k`, we must set `left = k + 1`, not `left = right + 1`. The latter would skip too many potentially valid characters.

3. **Forgetting the max length constraint**: The problem states forbidden words have max length 10. Not using this constraint means checking up to `right-left+1` characters instead of min(10, right-left+1), adding unnecessary work.

4. **Using a hash set instead of Trie**: A hash set of forbidden words works for exact matches, but we need to check suffixes. With a hash set, we'd need to generate all suffixes up to length 10, which is less efficient than Trie traversal.

## When You'll See This Pattern

This **sliding window with Trie** pattern appears in problems where you need to find substrings avoiding certain patterns:

1. **Longest Substring Without Repeating Characters (LeetCode 3)**: Similar sliding window, but uses hash set instead of Trie to track characters.

2. **Minimum Window Substring (LeetCode 76)**: Sliding window with frequency counting to find minimum window containing all target characters.

3. **Substring with Concatenation of All Words (LeetCode 30)**: Uses sliding window with word frequency maps to find concatenated substrings.

The key is recognizing when you need to efficiently check for pattern matches within a sliding window—Trie is ideal when patterns are strings you need to match exactly.

## Key Takeaways

1. **Sliding window with validation**: When looking for the longest valid substring, maintain a window that's always valid and expand/contract boundaries as needed.

2. **Trie for suffix matching**: When you need to check if any suffix matches a set of patterns, a Trie lets you do this in O(L) time where L is the maximum pattern length.

3. **Constraint awareness**: The 10-character limit for forbidden words is crucial—it bounds our suffix checking to constant time, making the overall solution O(n).

[Practice this problem on CodeJeet](/problem/length-of-the-longest-valid-substring)
