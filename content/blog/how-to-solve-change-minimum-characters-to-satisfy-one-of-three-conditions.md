---
title: "How to Solve Change Minimum Characters to Satisfy One of Three Conditions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Change Minimum Characters to Satisfy One of Three Conditions. Medium difficulty, 37.8% acceptance rate. Topics: Hash Table, String, Counting, Prefix Sum."
date: "2030-02-03"
category: "dsa-patterns"
tags:
  [
    "change-minimum-characters-to-satisfy-one-of-three-conditions",
    "hash-table",
    "string",
    "counting",
    "medium",
  ]
---

# How to Solve Change Minimum Characters to Satisfy One of Three Conditions

You're given two strings `a` and `b` of lowercase letters. In one operation, you can change any character to any lowercase letter. Your goal is to satisfy **one** of three conditions with the minimum operations:

1. Every letter in `a` is strictly less than every letter in `b`
2. Every letter in `b` is strictly less than every letter in `a`
3. All letters in both strings are the same

What makes this problem tricky is that you need to evaluate three different transformation strategies and find the minimum cost among them. The key insight is that we can use character frequency counting to efficiently calculate how many changes are needed for each strategy.

## Visual Walkthrough

Let's trace through an example: `a = "aba"`, `b = "caa"`

**Understanding the three conditions:**

1. **Condition 1 (a < b):** Every character in `a` must be less than every character in `b`. For example, if all `a` characters are ≤ 'k', then all `b` characters must be ≥ 'l'.
2. **Condition 2 (b < a):** Every character in `b` must be less than every character in `a`.
3. **Condition 3 (same letters):** All characters in both strings must be the same letter.

**For Condition 1 (a < b):**
We need to find a "split point" - a character `c` such that:

- All characters in `a` become ≤ `c`
- All characters in `b` become > `c`

Let's try split point at 'b':

- In `a = "aba"`: 'a' is already ≤ 'b', 'b' is already ≤ 'b'
- In `b = "caa"`: 'c' needs to change (to > 'b'), 'a' needs to change (to > 'b')
- Changes needed: 1 in `a` (none), 2 in `b` ('c'→'d' or similar, 'a'→'c' or similar) = 2 total

We need to check all possible split points from 'a' to 'y' (can't use 'z' since `b` characters must be > split point).

**For Condition 2 (b < a):**
Same logic but reversed. Try split point at 'b':

- All `b` characters ≤ 'b': 'c' needs to change, 'a' already ≤ 'b'
- All `a` characters > 'b': 'a' needs to change, 'b' needs to change
- Changes: 1 in `b`, 2 in `a` = 3 total

**For Condition 3 (same letters):**
We need to pick a target letter that minimizes changes:

- Target 'a': Change 'b' in `a` to 'a' (1 change), change 'c' in `b` to 'a' (1 change) = 2 total
- Target 'b': Change 'a' in `a` to 'b' (2 changes), change 'c' and 'a' in `b` to 'b' (2 changes) = 4 total
- Target 'c': Change all in `a` to 'c' (3 changes), change 'a' in `b` to 'c' (2 changes) = 5 total

Minimum is 2 changes (target 'a').

**Final answer:** min(2, 3, 2) = 2

## Brute Force Approach

A naive approach would be to try all possible transformations:

1. For condition 1: Try all 25 possible split points (a-y), for each calculate changes needed by scanning both strings
2. For condition 2: Same as above
3. For condition 3: Try all 26 possible target letters, calculate changes

This would be O(26 × (m+n)) where m and n are string lengths. While this might actually be acceptable for the constraints (strings up to length 10^5), we can do better with preprocessing using frequency counts.

The real brute force that would be too slow would be to try all possible assignments of characters, which is exponential. But even the O(26 × (m+n)) approach, while workable, can be optimized to O(26 + m + n) using prefix sums.

## Optimized Approach

The key insight is that we can precompute character frequencies for both strings, then use prefix sums to quickly calculate how many changes are needed for any split point.

**Step-by-step reasoning:**

1. **Count frequencies:** Create two arrays of size 26 counting how many times each letter appears in `a` and `b`.

2. **For Condition 1 (a < b):**
   - We need to find split point `c` (0-24, representing 'a'-'y')
   - All `a` characters must be ≤ `c`: changes in `a` = total length of `a` minus count of letters ≤ `c` in `a`
   - All `b` characters must be > `c`: changes in `b` = count of letters ≤ `c` in `b`
   - We can compute prefix sums of frequencies to get these counts in O(1) after O(26) preprocessing

3. **For Condition 2 (b < a):**
   - Same logic but reversed roles of `a` and `b`

4. **For Condition 3 (same letters):**
   - For each target letter `c` (0-25), changes = (len(a) - freqA[c]) + (len(b) - freqB[c])
   - This means: change all non-`c` letters in `a` to `c`, and all non-`c` letters in `b` to `c`

5. **Take the minimum** of all these possibilities

The optimization comes from using prefix sums to avoid recalculating counts for each split point from scratch.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m + n + 26) = O(m + n) where m = len(a), n = len(b)
# Space: O(26) = O(1) for the frequency arrays
def minCharacters(a: str, b: str) -> int:
    m, n = len(a), len(b)

    # Step 1: Count frequencies of each letter in both strings
    freqA = [0] * 26
    freqB = [0] * 26

    for ch in a:
        freqA[ord(ch) - ord('a')] += 1
    for ch in b:
        freqB[ord(ch) - ord('a')] += 1

    # Step 2: Calculate prefix sums for efficient range queries
    # prefixA[i] = sum of freqA[0..i] (letters 'a' to chr(ord('a')+i))
    prefixA = [0] * 26
    prefixB = [0] * 26
    prefixA[0] = freqA[0]
    prefixB[0] = freqB[0]

    for i in range(1, 26):
        prefixA[i] = prefixA[i-1] + freqA[i]
        prefixB[i] = prefixB[i-1] + freqB[i]

    # Step 3: Try all possibilities and find minimum
    min_ops = float('inf')

    # Condition 1: Every letter in a < every letter in b
    # Split point c means: all a <= c, all b > c
    # c can be from 0 to 24 (letters 'a' to 'y')
    for c in range(25):  # 0 to 24 inclusive
        # Changes in a: letters > c need to become <= c
        changes_a = m - prefixA[c]
        # Changes in b: letters <= c need to become > c
        changes_b = prefixB[c]
        min_ops = min(min_ops, changes_a + changes_b)

    # Condition 2: Every letter in b < every letter in a
    # Split point c means: all b <= c, all a > c
    for c in range(25):  # 0 to 24 inclusive
        changes_b = n - prefixB[c]
        changes_a = prefixA[c]
        min_ops = min(min_ops, changes_a + changes_b)

    # Condition 3: All letters in both strings are the same
    # For each possible target letter
    for c in range(26):
        changes = (m - freqA[c]) + (n - freqB[c])
        min_ops = min(min_ops, changes)

    return min_ops
```

```javascript
// Time: O(m + n + 26) = O(m + n) where m = a.length, n = b.length
// Space: O(26) = O(1) for the frequency arrays
function minCharacters(a, b) {
  const m = a.length,
    n = b.length;

  // Step 1: Count frequencies of each letter in both strings
  const freqA = new Array(26).fill(0);
  const freqB = new Array(26).fill(0);

  for (let ch of a) {
    freqA[ch.charCodeAt(0) - 97]++; // 'a' has code 97
  }
  for (let ch of b) {
    freqB[ch.charCodeAt(0) - 97]++;
  }

  // Step 2: Calculate prefix sums for efficient range queries
  const prefixA = new Array(26).fill(0);
  const prefixB = new Array(26).fill(0);
  prefixA[0] = freqA[0];
  prefixB[0] = freqB[0];

  for (let i = 1; i < 26; i++) {
    prefixA[i] = prefixA[i - 1] + freqA[i];
    prefixB[i] = prefixB[i - 1] + freqB[i];
  }

  // Step 3: Try all possibilities and find minimum
  let minOps = Infinity;

  // Condition 1: Every letter in a < every letter in b
  // Split point c means: all a <= c, all b > c
  for (let c = 0; c < 25; c++) {
    // 0 to 24 inclusive
    // Changes in a: letters > c need to become <= c
    const changesA = m - prefixA[c];
    // Changes in b: letters <= c need to become > c
    const changesB = prefixB[c];
    minOps = Math.min(minOps, changesA + changesB);
  }

  // Condition 2: Every letter in b < every letter in a
  // Split point c means: all b <= c, all a > c
  for (let c = 0; c < 25; c++) {
    const changesB = n - prefixB[c];
    const changesA = prefixA[c];
    minOps = Math.min(minOps, changesA + changesB);
  }

  // Condition 3: All letters in both strings are the same
  // For each possible target letter
  for (let c = 0; c < 26; c++) {
    const changes = m - freqA[c] + (n - freqB[c]);
    minOps = Math.min(minOps, changes);
  }

  return minOps;
}
```

```java
// Time: O(m + n + 26) = O(m + n) where m = a.length(), n = b.length()
// Space: O(26) = O(1) for the frequency arrays
class Solution {
    public int minCharacters(String a, String b) {
        int m = a.length(), n = b.length();

        // Step 1: Count frequencies of each letter in both strings
        int[] freqA = new int[26];
        int[] freqB = new int[26];

        for (char ch : a.toCharArray()) {
            freqA[ch - 'a']++;
        }
        for (char ch : b.toCharArray()) {
            freqB[ch - 'a']++;
        }

        // Step 2: Calculate prefix sums for efficient range queries
        int[] prefixA = new int[26];
        int[] prefixB = new int[26];
        prefixA[0] = freqA[0];
        prefixB[0] = freqB[0];

        for (int i = 1; i < 26; i++) {
            prefixA[i] = prefixA[i-1] + freqA[i];
            prefixB[i] = prefixB[i-1] + freqB[i];
        }

        // Step 3: Try all possibilities and find minimum
        int minOps = Integer.MAX_VALUE;

        // Condition 1: Every letter in a < every letter in b
        // Split point c means: all a <= c, all b > c
        for (int c = 0; c < 25; c++) {  // 0 to 24 inclusive
            // Changes in a: letters > c need to become <= c
            int changesA = m - prefixA[c];
            // Changes in b: letters <= c need to become > c
            int changesB = prefixB[c];
            minOps = Math.min(minOps, changesA + changesB);
        }

        // Condition 2: Every letter in b < every letter in a
        // Split point c means: all b <= c, all a > c
        for (int c = 0; c < 25; c++) {
            int changesB = n - prefixB[c];
            int changesA = prefixA[c];
            minOps = Math.min(minOps, changesA + changesB);
        }

        // Condition 3: All letters in both strings are the same
        // For each possible target letter
        for (int c = 0; c < 26; c++) {
            int changes = (m - freqA[c]) + (n - freqB[c]);
            minOps = Math.min(minOps, changes);
        }

        return minOps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m + n + 26) = O(m + n)

- Counting frequencies: O(m + n) to iterate through both strings
- Building prefix sums: O(26) constant time
- Checking all conditions: O(26) for each of the three conditions = O(78) constant time
- Total: O(m + n + 26 + 78) = O(m + n)

**Space Complexity:** O(1)

- We use fixed-size arrays of length 26 for frequencies and prefix sums
- This is constant space regardless of input size

## Common Mistakes

1. **Forgetting the "strictly less" requirement:** The conditions require "strictly less" (a < b), not "less than or equal to" (a ≤ b). This means when we choose split point `c`, `a` characters must be ≤ `c` and `b` characters must be > `c`. A common mistake is allowing `b` characters to be ≥ `c`.

2. **Incorrect split point range:** For conditions 1 and 2, the split point can only go up to 'y' (index 24), not 'z' (index 25). If we use 'z' as split point, we can't have `b` characters > 'z'. Always check your loop bounds carefully.

3. **Double-counting changes in condition 3:** When making all letters the same, we need to change all non-target letters in BOTH strings. The formula is `(len(a) - countA[target]) + (len(b) - countB[target])`. Some candidates mistakenly only change one string or use the wrong counts.

4. **Not considering all three conditions:** Some candidates find the minimum for condition 3 and think they're done, but conditions 1 or 2 might require fewer changes. Always check all three possibilities.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Character frequency counting with fixed alphabet:** When dealing with strings and a fixed alphabet (like lowercase English letters), counting frequencies is often the first step. Related problems:
   - [242. Valid Anagram](https://leetcode.com/problems/valid-anagram/): Check if two strings are anagrams using frequency counts
   - [387. First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/): Find first non-repeating character using frequency array

2. **Prefix sums for range queries:** Using prefix sums to answer "how many elements are ≤ x" queries in O(1) time after O(n) preprocessing. Related problems:
   - [303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/): Classic prefix sum problem
   - [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/): Uses prefix and suffix products

3. **Minimizing operations to satisfy constraints:** Problems where you need to find the minimum changes to meet certain ordering or equality constraints. Related problems:
   - [926. Flip String to Monotone Increasing](https://leetcode.com/problems/flip-string-to-monotone-increasing/): Minimum flips to make binary string monotone increasing
   - [1151. Minimum Swaps to Group All 1's Together](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together/): Minimum swaps to group all 1s

## Key Takeaways

1. **When you see "lowercase letters" or a fixed small alphabet, think frequency arrays.** A size-26 array is more efficient than a hash map for English letters.

2. **Prefix sums transform O(n) range queries into O(1) lookups.** If you need to answer many "how many in range [0, x]" queries, precompute prefix sums.

3. **Break complex conditions into simpler subproblems.** This problem has three independent conditions - solve each separately and take the minimum. Don't try to solve them all at once.

4. **Always check edge cases in loop bounds.** The "strictly less" condition changes valid split points from 0-25 to 0-24. Off-by-one errors are common in interview problems.

[Practice this problem on CodeJeet](/problem/change-minimum-characters-to-satisfy-one-of-three-conditions)
