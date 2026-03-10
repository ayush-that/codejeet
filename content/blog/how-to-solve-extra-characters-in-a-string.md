---
title: "How to Solve Extra Characters in a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Extra Characters in a String. Medium difficulty, 57.3% acceptance rate. Topics: Array, Hash Table, String, Dynamic Programming, Trie."
date: "2028-10-23"
category: "dsa-patterns"
tags: ["extra-characters-in-a-string", "array", "hash-table", "string", "medium"]
---

# How to Solve Extra Characters in a String

This problem asks us to break a string into dictionary words while minimizing the number of characters that don't belong to any valid substring. What makes this interesting is that it's essentially a **Word Break** problem with a twist: instead of just checking if the entire string can be segmented, we need to find the minimum number of leftover characters when we allow some characters to remain unsegmented. This transforms a decision problem into an optimization problem, requiring dynamic programming to track the minimum extra characters at each position.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
s = "leetscode"
dictionary = ["leet", "code", "leetcode"]
```

We want to find the minimum number of extra characters left after breaking `s` into dictionary words.

**Step-by-step reasoning:**

1. Start at position 0: We can check all possible substrings starting at index 0:
   - "l" - not in dictionary → 1 extra character
   - "le" - not in dictionary → 2 extra characters
   - "lee" - not in dictionary → 3 extra characters
   - "leet" - in dictionary! → 0 extra characters for this segment

2. If we take "leet" (positions 0-3), we move to position 4:
   - Check substrings starting at index 4:
   - "s" - not in dictionary → 1 extra character
   - "sc" - not in dictionary → 2 extra characters
   - "sco" - not in dictionary → 3 extra characters
   - "scod" - not in dictionary → 4 extra characters
   - "scode" - not in dictionary → 5 extra characters
   - "code" (positions 4-7) - in dictionary! → 0 extra characters

3. After taking "code", we're at position 8:
   - Only "e" remains, which isn't in dictionary → 1 extra character

Total extra characters: 0 (leet) + 0 (code) + 1 (e) = 1

But wait, there might be a better way! What if we use "leetcode" instead?

4. Check "leetcode" starting at position 0:
   - "leetcode" (positions 0-7) - in dictionary! → 0 extra characters

5. After taking "leetcode", we're at position 8:
   - Only "e" remains → 1 extra character

Total: 0 + 1 = 1 extra character (same result)

The optimal solution gives us 1 extra character. This shows we need to systematically explore all possibilities to find the minimum.

## Brute Force Approach

A naive approach would be to try all possible segmentations of the string. For each position, we could:

1. Either skip the current character (treat it as extra)
2. Or try to match a dictionary word starting at that position

This leads to exponential time complexity because at each character, we have multiple choices: skip it or try to match words of various lengths. For a string of length `n`, there are `2^n` possible ways to decide which characters to skip, and for each non-skipped segment, we need to check if it forms a dictionary word.

The brute force recursion would look like:

- For position `i` in the string:
  - Option 1: Skip character `i` → add 1 to extra count, recurse on `i+1`
  - Option 2: For each word in dictionary that matches starting at `i`, recurse on `i+len(word)`

This approach is too slow because it repeatedly solves the same subproblems. For example, after processing "leet" from position 0, we need to solve the subproblem for position 4 ("scode"). But we might also reach position 4 through other paths (like skipping some characters first).

## Optimized Approach

The key insight is that this problem has **optimal substructure**: the optimal solution for the entire string depends on optimal solutions for its prefixes. This is a classic sign that dynamic programming can help.

We can define `dp[i]` as the minimum number of extra characters in the substring `s[i:]` (from position `i` to the end).

The recurrence relation:

- Base case: `dp[n] = 0` (empty string has 0 extra characters)
- For position `i` from `n-1` down to 0:
  1. We can skip character `i`: `dp[i] = 1 + dp[i+1]` (treat `s[i]` as extra)
  2. Or, for every word `w` in dictionary that matches `s[i:i+len(w)]`:
     - If the word matches, then `dp[i] = min(dp[i], dp[i+len(w)])` (no extra characters for this word)

We take the minimum of all these possibilities.

To efficiently check if a substring matches any dictionary word, we can use a hash set for O(1) lookups. However, we only need to check words that could possibly start at position `i`, so we can optimize further by only considering words with appropriate lengths.

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n^2 * m) where n = len(s), m = avg word length
# Space: O(n + k) where k = len(dictionary)
def minExtraChar(s: str, dictionary: list[str]) -> int:
    n = len(s)
    # Convert dictionary to set for O(1) lookups
    word_set = set(dictionary)

    # dp[i] = minimum extra characters in s[i:]
    dp = [0] * (n + 1)

    # Base case: empty string has 0 extra characters
    dp[n] = 0

    # Process from the end to the beginning
    for i in range(n - 1, -1, -1):
        # Option 1: Skip current character (treat as extra)
        dp[i] = 1 + dp[i + 1]

        # Option 2: Try all possible words starting at position i
        # We only need to check up to n-i characters
        for length in range(1, n - i + 1):
            substring = s[i:i + length]
            if substring in word_set:
                # If this word matches, we can take it with 0 extra chars
                dp[i] = min(dp[i], dp[i + length])

    return dp[0]
```

```javascript
// Time: O(n^2 * m) where n = s.length, m = avg word length
// Space: O(n + k) where k = dictionary.length
function minExtraChar(s, dictionary) {
  const n = s.length;
  // Convert dictionary to Set for O(1) lookups
  const wordSet = new Set(dictionary);

  // dp[i] = minimum extra characters in s[i:]
  const dp = new Array(n + 1).fill(0);

  // Base case: empty string has 0 extra characters
  dp[n] = 0;

  // Process from the end to the beginning
  for (let i = n - 1; i >= 0; i--) {
    // Option 1: Skip current character (treat as extra)
    dp[i] = 1 + dp[i + 1];

    // Option 2: Try all possible words starting at position i
    // We only need to check up to n-i characters
    for (let length = 1; length <= n - i; length++) {
      const substring = s.substring(i, i + length);
      if (wordSet.has(substring)) {
        // If this word matches, we can take it with 0 extra chars
        dp[i] = Math.min(dp[i], dp[i + length]);
      }
    }
  }

  return dp[0];
}
```

```java
// Time: O(n^2 * m) where n = s.length(), m = avg word length
// Space: O(n + k) where k = dictionary.size()
public int minExtraChar(String s, String[] dictionary) {
    int n = s.length();
    // Convert dictionary to HashSet for O(1) lookups
    Set<String> wordSet = new HashSet<>();
    for (String word : dictionary) {
        wordSet.add(word);
    }

    // dp[i] = minimum extra characters in s.substring(i)
    int[] dp = new int[n + 1];

    // Base case: empty string has 0 extra characters
    dp[n] = 0;

    // Process from the end to the beginning
    for (int i = n - 1; i >= 0; i--) {
        // Option 1: Skip current character (treat as extra)
        dp[i] = 1 + dp[i + 1];

        // Option 2: Try all possible words starting at position i
        // We only need to check up to n-i characters
        for (int length = 1; length <= n - i; length++) {
            String substring = s.substring(i, i + length);
            if (wordSet.contains(substring)) {
                // If this word matches, we can take it with 0 extra chars
                dp[i] = Math.min(dp[i], dp[i + length]);
            }
        }
    }

    return dp[0];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² \* m) where n is the length of string `s` and m is the average word length in the dictionary. Here's why:

- We have an outer loop iterating through n positions
- For each position i, we check all possible substrings starting at i (up to n-i possibilities)
- For each substring, we check if it exists in the hash set (O(m) for the substring extraction and hash computation)

**Space Complexity:** O(n + k) where:

- O(n) for the dp array
- O(k) for storing the dictionary in a hash set, where k is the total number of characters in all dictionary words

We can optimize further to O(n²) by precomputing which substrings are valid, but the hash set approach is usually sufficient for interview settings.

## Common Mistakes

1. **Starting from the beginning instead of the end**: Some candidates try to build the solution forward, but it's more natural to work backward because when we're at position i, we need to know the optimal solution for the remainder of the string. Working forward would require more complex state tracking.

2. **Forgetting to initialize dp[n] = 0**: The base case is crucial. An empty string has 0 extra characters. Forgetting this leads to incorrect results.

3. **Not considering the "skip character" option**: Some candidates only try to match dictionary words and forget that we can always choose to treat a character as extra. This means we need the `1 + dp[i+1]` term in the recurrence.

4. **Inefficient substring matching**: Checking every word in the dictionary at each position gives O(n _ k _ m) time. Using a hash set and only checking possible lengths is much more efficient. Even better would be using a Trie to check prefixes, which would give O(n²) time.

## When You'll See This Pattern

This problem uses a **dynamic programming with string segmentation** pattern that appears in several other problems:

1. **Word Break (LeetCode 139)**: The classic problem that asks whether a string can be segmented into dictionary words. This is essentially a decision version of our problem.

2. **Word Break II (LeetCode 140)**: Similar to Word Break but requires returning all possible segmentations. This builds on the same DP approach but adds backtracking.

3. **Decode Ways (LeetCode 91)**: While not about dictionary words, it uses similar DP where each position can be decoded as one or two characters, analogous to matching words of different lengths.

The core pattern is: when you need to partition a sequence (string, array) where each partition must satisfy some condition, and you want to optimize some metric (minimize extra characters, maximize matches, etc.), dynamic programming with a dp[i] representing the optimal solution for the suffix starting at i is often the right approach.

## Key Takeaways

1. **String segmentation problems often benefit from suffix-based DP**: Define `dp[i]` as the optimal solution for `s[i:]`. This lets you build solutions from the end to the beginning, which is often more intuitive than working forward.

2. **Always consider both options**: When breaking a string, you usually have the choice to either "skip" the current element (treat it as extra/cost) or "take" a valid segment starting at that position.

3. **Hash sets are your friend for dictionary lookups**: Converting a list of words to a set gives O(1) average-case lookups, which is much faster than checking against the entire list at each step.

4. **The recurrence relation often has a "skip" term and a "take" term**: This pattern appears in many optimization problems where you can either include or exclude elements.

Related problems: [Word Break](/problem/word-break)
