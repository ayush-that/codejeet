---
title: "How to Solve Word Break — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Word Break. Medium difficulty, 49.1% acceptance rate. Topics: Array, Hash Table, String, Dynamic Programming, Trie."
date: "2026-05-05"
category: "dsa-patterns"
tags: ["word-break", "array", "hash-table", "string", "medium"]
---

# How to Solve Word Break

You're given a string `s` and a dictionary `wordDict`. Your task is to determine if `s` can be broken into words from the dictionary, where dictionary words can be reused. This problem is tricky because a naive approach would try every possible split point, leading to exponential time complexity. The key insight is recognizing that this is a **dynamic programming** problem where we can build up solutions for prefixes of the string.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `s = "leetcode"`, `wordDict = ["leet", "code"]`

We want to check if we can break "leetcode" into dictionary words. Let's think about prefixes:

1. Check if the entire string "leetcode" is in the dictionary → No
2. Check if we can break it into smaller parts:
   - If we split after position 3: "leet" (positions 0-3) and "code" (positions 4-7)
   - "leet" is in the dictionary ✓
   - "code" is in the dictionary ✓
   - Therefore "leetcode" can be segmented as "leet code"

But how do we systematically check all possibilities? Let's think about building from left to right:

- Can we form the first 4 characters "leet"? Yes, it's in the dictionary
- If we can form "leet", then we need to check if we can form the remaining "code"
- "code" is in the dictionary, so we can form the entire string

Now consider a more complex example: `s = "applepenapple"`, `wordDict = ["apple", "pen"]`

We can break it as "apple" + "pen" + "apple". Notice that after forming "apple", we need to check if we can form "penapple", and so on. This overlapping subproblem structure is what makes dynamic programming the right approach.

## Brute Force Approach

The most straightforward approach is to use recursion with backtracking. At each position in the string, we try every possible word from the dictionary that matches the substring starting at that position. If a word matches, we recursively check if we can segment the remaining part of the string.

The problem with this approach is **exponential time complexity**. Consider a worst-case scenario where `s = "aaaaaaaa"` and `wordDict = ["a", "aa", "aaa", ...]`. At each position, we could try multiple words, leading to many recursive calls. For a string of length `n`, we could have up to `2^n` possible splits to check.

Here's what the brute force recursion looks like:

<div class="code-group">

```python
# Time: O(2^n) in worst case | Space: O(n) for recursion stack
def wordBreakBruteForce(s, wordDict):
    word_set = set(wordDict)

    def can_break(start):
        # If we've reached the end of the string, we successfully segmented it
        if start == len(s):
            return True

        # Try every possible end position
        for end in range(start + 1, len(s) + 1):
            # Check if substring s[start:end] is in dictionary
            if s[start:end] in word_set:
                # If it is, recursively check the rest
                if can_break(end):
                    return True

        # No valid segmentation found
        return False

    return can_break(0)
```

```javascript
// Time: O(2^n) in worst case | Space: O(n) for recursion stack
function wordBreakBruteForce(s, wordDict) {
  const wordSet = new Set(wordDict);

  function canBreak(start) {
    // If we've reached the end of the string, we successfully segmented it
    if (start === s.length) {
      return true;
    }

    // Try every possible end position
    for (let end = start + 1; end <= s.length; end++) {
      // Check if substring s[start:end] is in dictionary
      if (wordSet.has(s.substring(start, end))) {
        // If it is, recursively check the rest
        if (canBreak(end)) {
          return true;
        }
      }
    }

    // No valid segmentation found
    return false;
  }

  return canBreak(0);
}
```

```java
// Time: O(2^n) in worst case | Space: O(n) for recursion stack
public boolean wordBreakBruteForce(String s, List<String> wordDict) {
    Set<String> wordSet = new HashSet<>(wordDict);
    return canBreak(s, wordSet, 0);
}

private boolean canBreak(String s, Set<String> wordSet, int start) {
    // If we've reached the end of the string, we successfully segmented it
    if (start == s.length()) {
        return true;
    }

    // Try every possible end position
    for (int end = start + 1; end <= s.length(); end++) {
        // Check if substring s[start:end] is in dictionary
        if (wordSet.contains(s.substring(start, end))) {
            // If it is, recursively check the rest
            if (canBreak(s, wordSet, end)) {
                return true;
            }
        }
    }

    // No valid segmentation found
    return false;
}
```

</div>

The brute force solution is correct but too slow for longer strings. We need to optimize it.

## Optimized Approach

The key insight is that we're solving the same subproblems repeatedly. For example, when checking if we can segment "leetcode", we might check if we can segment "code" multiple times from different starting points. This is a classic **overlapping subproblems** scenario, which calls for dynamic programming.

We can use a **bottom-up dynamic programming** approach:

1. Create a boolean array `dp` where `dp[i]` means whether the substring `s[0:i]` (first i characters) can be segmented.
2. `dp[0] = true` because an empty string can always be segmented (it's our base case).
3. For each position `i` from 1 to `n`, check all positions `j` from 0 to `i-1`:
   - If `dp[j]` is true (we can segment the first j characters)
   - AND the substring `s[j:i]` is in the dictionary
   - Then `dp[i]` is true (we can segment the first i characters)

This approach has `O(n^2)` time complexity, which is much better than exponential. We can further optimize by only checking substrings up to the maximum word length in the dictionary.

## Optimal Solution

Here's the optimized dynamic programming solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * m) where n = len(s), m = max word length in wordDict
# Space: O(n) for the dp array
def wordBreak(s, wordDict):
    # Convert wordDict to a set for O(1) lookups
    word_set = set(wordDict)

    # Find the maximum word length to limit our substring checks
    max_len = 0
    for word in word_set:
        max_len = max(max_len, len(word))

    n = len(s)
    # dp[i] means whether s[0:i] (first i characters) can be segmented
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string can always be segmented

    # Check every position in the string
    for i in range(1, n + 1):
        # Only check back up to max_len characters or to the beginning
        # This optimization reduces the inner loop iterations
        for j in range(max(0, i - max_len), i):
            # If we can segment up to position j, and s[j:i] is a word
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # No need to check other j values

    return dp[n]
```

```javascript
// Time: O(n * m) where n = s.length, m = max word length in wordDict
// Space: O(n) for the dp array
function wordBreak(s, wordDict) {
  // Convert wordDict to a set for O(1) lookups
  const wordSet = new Set(wordDict);

  // Find the maximum word length to limit our substring checks
  let maxLen = 0;
  for (const word of wordSet) {
    maxLen = Math.max(maxLen, word.length);
  }

  const n = s.length;
  // dp[i] means whether s[0:i] (first i characters) can be segmented
  const dp = new Array(n + 1).fill(false);
  dp[0] = true; // Empty string can always be segmented

  // Check every position in the string
  for (let i = 1; i <= n; i++) {
    // Only check back up to maxLen characters or to the beginning
    // This optimization reduces the inner loop iterations
    const start = Math.max(0, i - maxLen);
    for (let j = start; j < i; j++) {
      // If we can segment up to position j, and s[j:i] is a word
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break; // No need to check other j values
      }
    }
  }

  return dp[n];
}
```

```java
// Time: O(n * m) where n = s.length(), m = max word length in wordDict
// Space: O(n) for the dp array
public boolean wordBreak(String s, List<String> wordDict) {
    // Convert wordDict to a set for O(1) lookups
    Set<String> wordSet = new HashSet<>(wordDict);

    // Find the maximum word length to limit our substring checks
    int maxLen = 0;
    for (String word : wordSet) {
        maxLen = Math.max(maxLen, word.length());
    }

    int n = s.length();
    // dp[i] means whether s[0:i] (first i characters) can be segmented
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;  // Empty string can always be segmented

    // Check every position in the string
    for (int i = 1; i <= n; i++) {
        // Only check back up to maxLen characters or to the beginning
        // This optimization reduces the inner loop iterations
        int start = Math.max(0, i - maxLen);
        for (int j = start; j < i; j++) {
            // If we can segment up to position j, and s[j:i] is a word
            if (dp[j] && wordSet.contains(s.substring(j, i))) {
                dp[i] = true;
                break;  // No need to check other j values
            }
        }
    }

    return dp[n];
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * m)` where `n` is the length of string `s` and `m` is the maximum word length in the dictionary. In the worst case without the max length optimization, it would be `O(n^2)`. The outer loop runs `n` times, and the inner loop runs at most `m` times (or `i` times without optimization).

**Space Complexity:** `O(n + k)` where `n` is for the DP array and `k` is the size of the word dictionary when converted to a set. In big O notation, we typically simplify this to `O(n)` since the dictionary size is usually smaller than `n` for this problem.

## Common Mistakes

1. **Forgetting to handle the empty string case:** The base case `dp[0] = true` is crucial. Without it, the algorithm won't work because we need a starting point.

2. **Off-by-one errors with indices:** When working with `dp[i]` representing the first `i` characters, remember that `s.substring(j, i)` gives characters from index `j` to `i-1`. This is a common source of confusion.

3. **Not converting the dictionary to a set:** Checking if a word is in a list takes `O(k)` time where `k` is the list size. Converting to a set gives us `O(1)` lookups, which is essential for efficiency.

4. **Missing the max length optimization:** Without limiting the inner loop to check only up to `max_len` characters back, the solution becomes `O(n^2)` instead of `O(n * m)`. While both might pass, the optimized version is more efficient.

## When You'll See This Pattern

This dynamic programming pattern appears in problems where you need to determine if a sequence can be broken into valid parts according to some rules. The key characteristics are:

- You're checking prefixes or suffixes of a sequence
- The decision at position `i` depends on decisions at earlier positions
- There are overlapping subproblems

Related problems that use similar patterns:

1. **Word Break II (Hard)** - The same problem but you need to return all possible segmentations instead of just checking if one exists.
2. **Extra Characters in a String (Medium)** - Similar segmentation problem but with a different optimization goal (minimizing extra characters).
3. **Decode Ways (Medium)** - Checking if a numeric string can be decoded into letters, using similar prefix-based DP.
4. **Palindrome Partitioning (Medium)** - Partitioning a string into palindromic substrings, using a similar DP approach to check prefixes.

## Key Takeaways

1. **Recognize overlapping subproblems:** When a problem asks "can this sequence be broken into valid parts" and you find yourself checking the same subproblems repeatedly, dynamic programming is likely the right approach.

2. **Think in terms of prefixes/suffixes:** For sequence segmentation problems, it's often helpful to build solutions for prefixes (from the start) or suffixes (from the end) of the sequence.

3. **Optimize with problem constraints:** Notice when you can limit your search space. In Word Break, we only need to check back up to the maximum word length, not all previous positions.

4. **Start with brute force, then optimize:** The recursive brute force solution helps you understand the problem structure, which then guides you to the DP solution with memoization or bottom-up approach.

Related problems: [Word Break II](/problem/word-break-ii), [Extra Characters in a String](/problem/extra-characters-in-a-string)
