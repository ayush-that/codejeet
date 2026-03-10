---
title: "How to Solve Maximum Repeating Substring — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Repeating Substring. Easy difficulty, 41.1% acceptance rate. Topics: String, Dynamic Programming, String Matching."
date: "2027-05-20"
category: "dsa-patterns"
tags: ["maximum-repeating-substring", "string", "dynamic-programming", "string-matching", "easy"]
---

# How to Solve Maximum Repeating Substring

This problem asks us to find the maximum number of times a given `word` can be repeated consecutively while still being a substring of `sequence`. The challenge lies in efficiently checking for consecutive repetitions without unnecessary recomputation. While the problem is rated Easy, it tests your ability to recognize when a simple brute force approach can be optimized with careful observation about string matching.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose:

- `sequence = "ababcababcababc"`
- `word = "ab"`

We want to find the largest `k` such that `"ab"` repeated `k` times appears in `sequence`.

**Step-by-step checking:**

1. Check if `"ab"` (k=1) exists in sequence: Yes, at positions 0, 2, 5, 8, 11
2. Check if `"abab"` (k=2) exists: Yes, at positions 0, 5, 8
3. Check if `"ababab"` (k=3) exists: Yes, at positions 0, 5
4. Check if `"abababab"` (k=4) exists: No

The maximum k is 3. Notice that we're looking for **consecutive repetitions** - `"ab"` repeated 3 times in a row. The key insight is that if `word` repeated k times exists, then `word` repeated (k-1) times must also exist in the same position. This suggests we can build up our answer incrementally.

## Brute Force Approach

A naive approach would be to check every possible k from 1 up to some maximum, building the repeated string each time and checking if it exists in sequence:

1. Start with k = 1
2. Build `repeated_word = word * k`
3. Check if `repeated_word` is a substring of `sequence`
4. Increment k and repeat until `repeated_word` is no longer a substring
5. Return k-1 (the last k that worked)

**Why this is inefficient:**

- For each k, we build a new string of length `len(word) * k`
- We perform a substring search which could be O(n\*m) in worst case
- If the maximum k is large, we're doing repeated work building longer and longer strings
- Time complexity could be O(k_max _ n _ m) where n = len(sequence), m = len(word)

The brute force works but is inefficient for longer sequences. We can optimize by noticing that we don't need to rebuild the entire repeated string each time - we can check for consecutive repetitions directly in the sequence.

## Optimal Solution

The optimal approach uses a simple linear scan with dynamic programming. The key insight is that if we find `word` starting at position `i` in sequence, we can check if there's also a `word` starting at position `i + len(word)`. If so, we have at least 2 consecutive repetitions. We can extend this logic to count consecutive repetitions at each starting position.

Here's the algorithm:

1. Initialize a DP array `dp` of size `len(sequence)` with zeros
2. Iterate through sequence from right to left (or left to right with adjustment)
3. For each position `i`, check if `word` matches starting at `i`
4. If it matches, set `dp[i] = 1 + dp[i + len(word)]` (if `i + len(word)` is within bounds)
5. Track the maximum value in `dp`
6. Return the maximum value

This works because `dp[i]` stores the count of consecutive `word` repetitions starting at position `i`. If `word` appears at position `i` and also starts another repetition at `i + len(word)`, then we have consecutive repetitions.

<div class="code-group">

```python
# Time: O(n * m) where n = len(sequence), m = len(word)
# Space: O(n) for the dp array
def maxRepeating(sequence: str, word: str) -> int:
    n = len(sequence)
    m = len(word)

    # dp[i] will store the maximum repeating count starting at position i
    dp = [0] * n

    # We iterate from right to left to build dp values correctly
    for i in range(n - m, -1, -1):
        # Check if word matches starting at position i
        if sequence[i:i + m] == word:
            # If we have a match, we have at least 1 repetition
            dp[i] = 1

            # If there's room for another word after this one
            # and that position also has repetitions, add them
            if i + m < n:
                dp[i] += dp[i + m]

    # Return the maximum value in dp (or 0 if dp is empty)
    return max(dp) if dp else 0
```

```javascript
// Time: O(n * m) where n = sequence.length, m = word.length
// Space: O(n) for the dp array
function maxRepeating(sequence, word) {
  const n = sequence.length;
  const m = word.length;

  // dp[i] will store the maximum repeating count starting at position i
  const dp = new Array(n).fill(0);

  // We iterate from right to left to build dp values correctly
  for (let i = n - m; i >= 0; i--) {
    // Check if word matches starting at position i
    if (sequence.substring(i, i + m) === word) {
      // If we have a match, we have at least 1 repetition
      dp[i] = 1;

      // If there's room for another word after this one
      // and that position also has repetitions, add them
      if (i + m < n) {
        dp[i] += dp[i + m];
      }
    }
  }

  // Return the maximum value in dp (or 0 if dp is empty)
  return dp.length > 0 ? Math.max(...dp) : 0;
}
```

```java
// Time: O(n * m) where n = sequence.length(), m = word.length()
// Space: O(n) for the dp array
class Solution {
    public int maxRepeating(String sequence, String word) {
        int n = sequence.length();
        int m = word.length();

        // dp[i] will store the maximum repeating count starting at position i
        int[] dp = new int[n];

        // We iterate from right to left to build dp values correctly
        for (int i = n - m; i >= 0; i--) {
            // Check if word matches starting at position i
            if (sequence.substring(i, i + m).equals(word)) {
                // If we have a match, we have at least 1 repetition
                dp[i] = 1;

                // If there's room for another word after this one
                // and that position also has repetitions, add them
                if (i + m < n) {
                    dp[i] += dp[i + m];
                }
            }
        }

        // Find and return the maximum value in dp
        int maxVal = 0;
        for (int val : dp) {
            maxVal = Math.max(maxVal, val);
        }
        return maxVal;
    }
}
```

</div>

**Alternative simpler approach:** We can also solve this by checking for increasing k values but being smarter about it:

<div class="code-group">

```python
# Time: O(n * m) in worst case, but often faster
# Space: O(1)
def maxRepeating(sequence: str, word: str) -> int:
    k = 1
    # Keep checking while word repeated k times is in sequence
    while word * k in sequence:
        k += 1
    return k - 1  # Return last k that worked
```

```javascript
// Time: O(n * m) in worst case, but often faster
// Space: O(1)
function maxRepeating(sequence, word) {
  let k = 1;
  // Keep checking while word repeated k times is in sequence
  while (sequence.includes(word.repeat(k))) {
    k++;
  }
  return k - 1; // Return last k that worked
}
```

```java
// Time: O(n * m) in worst case, but often faster
// Space: O(1)
class Solution {
    public int maxRepeating(String sequence, String word) {
        int k = 1;
        // Keep checking while word repeated k times is in sequence
        while (sequence.contains(word.repeat(k))) {
            k++;
        }
        return k - 1;  // Return last k that worked
    }
}
```

</div>

The simpler approach is actually quite efficient for most cases since k typically won't be very large, and modern string searching algorithms are optimized.

## Complexity Analysis

**Time Complexity:**

- For the DP approach: O(n \* m) where n = len(sequence), m = len(word)
  - We iterate through n positions
  - At each position, we do an O(m) comparison to check if word matches
- For the simpler approach: O(k_max \* n) in worst case, but typically faster
  - k_max is usually small relative to n
  - String searching (`in` operator or `contains()`) is often optimized

**Space Complexity:**

- DP approach: O(n) for the dp array
- Simpler approach: O(1) additional space (though string building uses O(k\*m) temporarily)

## Common Mistakes

1. **Not handling the case when word is longer than sequence:** Always check bounds. If `len(word) > len(sequence)`, the answer must be 0.

2. **Off-by-one errors in the DP indices:** When accessing `dp[i + len(word)]`, ensure `i + len(word)` is within bounds. The condition `if i + m < n:` is crucial.

3. **Checking non-consecutive repetitions:** The problem asks for consecutive repetitions. A candidate might mistakenly count non-consecutive occurrences. For example, in `"ababa"` with `word = "ab"`, the maximum consecutive repetitions is 1 (not 2, because the occurrences at positions 0 and 2 are not consecutive).

4. **Inefficient string building in the simple approach:** While `word * k in sequence` is clean, building the string `word * k` for large k could be memory intensive. In interviews, mention that for extremely large k, we might want to use the DP approach instead.

## When You'll See This Pattern

This problem uses a **dynamic programming on strings** pattern where we build up solutions to subproblems (repetition counts starting at each position). Similar patterns appear in:

1. **Detect Pattern of Length M Repeated K or More Times (Easy)** - Directly related, looking for any pattern of length M repeated K times.

2. **Longest Repeating Character Replacement (Medium)** - Uses sliding window with character counting to find the longest substring with repeated characters after replacements.

3. **Repeated Substring Pattern (Easy)** - Checks if a string can be formed by repeating a substring multiple times, using clever string concatenation tricks.

The core technique of using DP to track consecutive patterns in strings is useful for many substring and pattern matching problems.

## Key Takeaways

1. **For consecutive pattern problems, DP from right to left (or left to right) often works well** - Each position's value depends on values at later (or earlier) positions.

2. **Sometimes the simplest solution is acceptable** - The `while word * k in sequence: k++` approach is clean, readable, and efficient enough for most cases unless constraints are very large.

3. **Always consider edge cases** - Empty strings, word longer than sequence, and single-character words all need to be handled correctly.

Related problems: [Detect Pattern of Length M Repeated K or More Times](/problem/detect-pattern-of-length-m-repeated-k-or-more-times), [Minimum Number of Operations to Make Word K-Periodic](/problem/minimum-number-of-operations-to-make-word-k-periodic)
