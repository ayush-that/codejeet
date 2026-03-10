---
title: "How to Solve Shortest and Lexicographically Smallest Beautiful String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest and Lexicographically Smallest Beautiful String. Medium difficulty, 40.9% acceptance rate. Topics: String, Sliding Window."
date: "2029-03-10"
category: "dsa-patterns"
tags:
  ["shortest-and-lexicographically-smallest-beautiful-string", "string", "sliding-window", "medium"]
---

# How to Solve Shortest and Lexicographically Smallest Beautiful String

This problem asks us to find the lexicographically smallest substring containing exactly `k` ones in a binary string. The challenge is twofold: we need to find the shortest possible length first, then among all substrings of that length with exactly `k` ones, find the lexicographically smallest one. What makes this interesting is that we can't just find any substring with `k` ones—we need the optimal one according to both length and lexicographic order.

## Visual Walkthrough

Let's trace through an example: `s = "110010"`, `k = 2`.

**Step 1: Understanding the requirements**
We need substrings with exactly 2 ones. Let's list all of them:

- "11" (positions 0-1): length 2, value "11"
- "1100" (0-3): length 4, value "1100"
- "1001" (1-4): length 4, value "1001"
- "0010" (2-5): length 4, value "0010"
- "010" (3-5): length 3, value "010"
- "10" (4-5): length 2, value "10"

**Step 2: Finding shortest length**
The shortest length where we can have exactly 2 ones is 2. We have two candidates of length 2: "11" and "10".

**Step 3: Lexicographic comparison**
Between "11" and "10", which is lexicographically smaller? Compare character by character:

- First character: both '1'
- Second character: '1' vs '0' → '0' is smaller
  So "10" is lexicographically smaller than "11".

Thus, the answer is "10".

Notice the pattern: the shortest substring with exactly `k` ones will always start and end with a '1' (otherwise we could trim zeros from the ends to make it shorter). Among all such substrings of minimal length, the lexicographically smallest will be the one that starts earliest when we have consecutive ones at the beginning.

## Brute Force Approach

A naive approach would be to check every possible substring:

1. Generate all possible substrings (O(n²) of them)
2. For each substring, count the number of ones (O(n) per substring)
3. Keep track of substrings with exactly `k` ones
4. Among those, find the shortest length
5. Among those with the shortest length, find the lexicographically smallest

This would take O(n³) time: O(n²) substrings × O(n) to count ones for each. Even with optimization (precomputing prefix sums to count ones in O(1)), we'd still have O(n²) substrings to check, which is too slow for n up to 100.

The key insight we're missing: we only need to consider substrings that start and end with '1' and contain exactly `k` ones. These substrings are determined by the positions of the ones in the string.

## Optimized Approach

The optimal approach uses a **sliding window** technique with a crucial observation:

1. **Finding candidate substrings**: We only need to look at substrings that start at a '1' and end at a '1' with exactly `k` ones in between. If we track all indices where '1' occurs, then any substring containing exactly `k` ones must start at some one[i] and end at one[i+k-1] (where `one` is the array of indices where '1' occurs).

2. **Minimizing length**: The length of such a substring is `one[i+k-1] - one[i] + 1`. To minimize length, we want consecutive ones in the `one` array that are as close together as possible.

3. **Lexicographic comparison**: Among substrings of equal minimal length, we compare them lexicographically. Since they all have the same start and end positions relative to ones, the lexicographic comparison is essentially comparing the original string from each candidate's starting position.

4. **Efficient comparison**: We don't need to compare entire substrings. We can compare them character by character, stopping at the first difference. Since all candidates have the same length, we just need to find the smallest starting index among those with minimal length.

The algorithm:

1. Collect all indices where `s[i] == '1'` into an array `ones`
2. If `len(ones) < k`, return "" (not enough ones)
3. Initialize `min_len = INF` and `result = ""`
4. For each `i` from `0` to `len(ones)-k`:
   - Calculate `start = ones[i]`, `end = ones[i+k-1]`
   - Calculate `length = end - start + 1`
   - If `length < min_len`: update `min_len` and `result`
   - If `length == min_len`: compare lexicographically with current result
5. Return `result`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def shortestBeautifulSubstring(s: str, k: int) -> str:
    """
    Find the lexicographically smallest substring with exactly k ones.

    Approach:
    1. Collect all indices of '1's in the string
    2. For every window of k consecutive ones, calculate the substring
    3. Track the shortest substring, breaking ties lexicographically
    """
    # Step 1: Collect all indices where character is '1'
    ones = [i for i, char in enumerate(s) if char == '1']

    # If there aren't enough ones, return empty string
    if len(ones) < k:
        return ""

    min_len = float('inf')
    result = ""

    # Step 2: Slide a window of size k over the ones array
    for i in range(len(ones) - k + 1):
        # Start index of the substring (first '1' in window)
        start = ones[i]
        # End index of the substring (last '1' in window)
        end = ones[i + k - 1]
        # Length of this candidate substring
        length = end - start + 1

        # Extract the actual substring
        candidate = s[start:end + 1]

        # Step 3: Update result based on length and lexicographic order
        if length < min_len:
            # Found a shorter substring
            min_len = length
            result = candidate
        elif length == min_len and candidate < result:
            # Same length but lexicographically smaller
            result = candidate

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function shortestBeautifulSubstring(s, k) {
  /**
   * Find the lexicographically smallest substring with exactly k ones.
   *
   * Approach:
   * 1. Collect all indices of '1's in the string
   * 2. For every window of k consecutive ones, calculate the substring
   * 3. Track the shortest substring, breaking ties lexicographically
   */

  // Step 1: Collect all indices where character is '1'
  const ones = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "1") {
      ones.push(i);
    }
  }

  // If there aren't enough ones, return empty string
  if (ones.length < k) {
    return "";
  }

  let minLen = Infinity;
  let result = "";

  // Step 2: Slide a window of size k over the ones array
  for (let i = 0; i <= ones.length - k; i++) {
    // Start index of the substring (first '1' in window)
    const start = ones[i];
    // End index of the substring (last '1' in window)
    const end = ones[i + k - 1];
    // Length of this candidate substring
    const length = end - start + 1;

    // Extract the actual substring
    const candidate = s.substring(start, end + 1);

    // Step 3: Update result based on length and lexicographic order
    if (length < minLen) {
      // Found a shorter substring
      minLen = length;
      result = candidate;
    } else if (length === minLen && candidate < result) {
      // Same length but lexicographically smaller
      result = candidate;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String shortestBeautifulSubstring(String s, int k) {
        /**
         * Find the lexicographically smallest substring with exactly k ones.
         *
         * Approach:
         * 1. Collect all indices of '1's in the string
         * 2. For every window of k consecutive ones, calculate the substring
         * 3. Track the shortest substring, breaking ties lexicographically
         */

        // Step 1: Collect all indices where character is '1'
        List<Integer> ones = new ArrayList<>();
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '1') {
                ones.add(i);
            }
        }

        // If there aren't enough ones, return empty string
        if (ones.size() < k) {
            return "";
        }

        int minLen = Integer.MAX_VALUE;
        String result = "";

        // Step 2: Slide a window of size k over the ones list
        for (int i = 0; i <= ones.size() - k; i++) {
            // Start index of the substring (first '1' in window)
            int start = ones.get(i);
            // End index of the substring (last '1' in window)
            int end = ones.get(i + k - 1);
            // Length of this candidate substring
            int length = end - start + 1;

            // Extract the actual substring
            String candidate = s.substring(start, end + 1);

            // Step 3: Update result based on length and lexicographic order
            if (length < minLen) {
                // Found a shorter substring
                minLen = length;
                result = candidate;
            } else if (length == minLen && candidate.compareTo(result) < 0) {
                // Same length but lexicographically smaller
                result = candidate;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the string to collect indices of ones: O(n)
- We then iterate through the ones array, which has at most n elements: O(n)
- Substring extraction and comparison are O(L) where L is substring length, but since we're comparing substrings of minimal length and there are at most n/k windows, the total is still O(n)

**Space Complexity: O(n)**

- We store the indices of all ones in the string. In the worst case (all characters are '1'), this is O(n)
- We also store the result substring, which is O(min_len) ≤ O(n)

## Common Mistakes

1. **Not handling the case when k > number of ones**: Some candidates forget to check if there are enough ones in the string. Always return "" when `len(ones) < k`.

2. **Incorrect window boundaries**: When iterating through the ones array, the loop should go up to `len(ones) - k` (inclusive). A common off-by-one error is using `len(ones) - k - 1` or `len(ones) - k + 1`.

3. **Comparing substrings incorrectly for lexicographic order**: Remember that for strings of equal length, lexicographic comparison is straightforward. But some candidates try to compare lengths first, then strings, without realizing that when lengths are equal, we need string comparison.

4. **Extracting wrong substring indices**: The substring should be from `start` to `end` inclusive. In Python, that's `s[start:end+1]`; in Java/JavaScript, it's `substring(start, end+1)`.

## When You'll See This Pattern

This problem combines **sliding window** with **lexicographic comparison**, a pattern that appears in several other problems:

1. **Minimum Window Substring (LeetCode 76)**: Find the minimum window in a string that contains all characters of another string. Similar sliding window approach but with character frequency counts.

2. **Find All Anagrams in a String (LeetCode 438)**: Find starting indices of all anagrams of a pattern in a string. Uses sliding window with character frequency tracking.

3. **Permutation in String (LeetCode 567)**: Check if one string contains a permutation of another. Similar sliding window with frequency counts.

The key insight in all these problems is that we're looking for a substring satisfying certain constraints, and we can efficiently track these constraints as we slide a window through the string.

## Key Takeaways

1. **When looking for substrings with specific character counts**, consider tracking the indices of those characters rather than checking every possible substring. This often reduces O(n²) to O(n).

2. **For "shortest substring" problems**, the minimal substring will always start and end with the constrained character (here, '1'). You can't make it shorter without losing the constraint.

3. **When you need both minimal length and lexicographic ordering**, find all candidates with minimal length first, then compare them lexicographically. Don't try to optimize both simultaneously in one pass unless you're certain of the logic.

[Practice this problem on CodeJeet](/problem/shortest-and-lexicographically-smallest-beautiful-string)
