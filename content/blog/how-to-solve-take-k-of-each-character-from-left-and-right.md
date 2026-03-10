---
title: "How to Solve Take K of Each Character From Left and Right — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Take K of Each Character From Left and Right. Medium difficulty, 51.5% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2027-03-16"
category: "dsa-patterns"
tags:
  [
    "take-k-of-each-character-from-left-and-right",
    "hash-table",
    "string",
    "sliding-window",
    "medium",
  ]
---

# How to Solve "Take K of Each Character From Left and Right"

You're given a string containing only 'a', 'b', and 'c' characters, and you need to collect at least `k` of each character by repeatedly taking either the leftmost or rightmost character from the string. The challenge is to find the **minimum number of moves** needed. What makes this problem interesting is that it looks like a two-pointer problem initially, but the optimal solution requires a clever transformation: instead of thinking about what we take from the ends, we think about what we **leave in the middle**.

## Visual Walkthrough

Let's trace through an example: `s = "aabaaaacaabc"`, `k = 2`

We need at least 2 of each 'a', 'b', and 'c'. The string has:

- 'a': 8 total
- 'b': 2 total
- 'c': 2 total

Since we need 2 of each and there are exactly 2 'b's and 2 'c's, we **must take all of them**. The 'a's are abundant, so we can be selective.

**Key Insight**: If we think about what remains in the middle after we're done taking characters from both ends, the middle portion represents characters we **didn't take**. Our goal is to maximize this middle portion (minimize what we take) while ensuring that what we take contains at least `k` of each character.

Another way: The characters we take = total characters - characters in middle. So minimizing moves = maximizing middle length while ensuring total - middle has enough of each character.

Let's find the longest contiguous middle substring where, if we leave it untouched, the remaining characters (from the ends) still contain at least `k` of each type.

Total counts: a=8, b=2, c=2
We need at least k=2 of each in what we take.

If the middle substring has counts: a=x, b=y, c=z
Then what we take has: a=(8-x), b=(2-y), c=(2-z)

We need: 8-x ≥ 2, 2-y ≥ 2, 2-z ≥ 2
Which means: x ≤ 6, y ≤ 0, z ≤ 0

So the middle can have at most 0 'b's and 0 'c's, but up to 6 'a's. The longest substring with 0 'b's and 0 'c's is "aaaaaa" (positions 2-7), length 6.

Therefore, we take 12 - 6 = 6 characters total = 6 moves minimum.

Let's verify: Taking from ends to get 2 'b's and 2 'c's:

- Take left 'a' (1 move) - have: a=1, b=0, c=0
- Take right 'c' (2 moves) - have: a=1, b=0, c=1
- Take right 'c' (3 moves) - have: a=1, b=0, c=2 ✓
- Take left 'a' (4 moves) - have: a=2, b=0, c=2
- Take left 'b' (5 moves) - have: a=2, b=1, c=2
- Take left 'b' (6 moves) - have: a=2, b=2, c=2 ✓

Yes, 6 moves works!

## Brute Force Approach

A naive approach would be to try all possible sequences of taking from left or right. For each sequence, we could simulate until we have at least `k` of each character. With `n` characters, there are 2^m possible sequences where m is the number of moves, and m could be up to n. This is exponential time O(2^n), completely impractical.

Another brute force: Try all possible middle substrings (all start and end positions O(n²)), count characters in each, check if total - middle has enough of each character. This is O(n³) if we count characters naively for each substring, or O(n²) with prefix sums. For n up to 10^5 (typical constraint), O(n²) is still too slow.

## Optimized Approach

The key insight is that we can transform the problem: Instead of minimizing moves (characters taken), we maximize the length of a contiguous middle substring that we **don't take**. Why? Because:

1. Total characters taken = n - middle_length
2. Characters taken = total_count - middle_count for each type
3. We need: total_count[i] - middle_count[i] ≥ k for i ∈ {'a','b','c'}
4. Equivalently: middle_count[i] ≤ total_count[i] - k

So we need to find the **longest substring** where the count of each character is ≤ (total_count[i] - k). If for any character, total_count[i] - k < 0, it's impossible (we can't get k of that character).

This becomes a **sliding window problem**: Find the longest window where count['a'] ≤ limit_a, count['b'] ≤ limit_b, count['c'] ≤ limit_c.

We can solve this in O(n) time with two pointers:

- Expand the right pointer to include characters
- If any count exceeds its limit, shrink the left pointer until all counts are within limits
- Track the maximum window length

The answer is n - max_window_length.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def takeCharacters(s: str, k: int) -> int:
    n = len(s)

    # Count total occurrences of each character
    total = {'a': 0, 'b': 0, 'c': 0}
    for ch in s:
        total[ch] += 1

    # Check if it's even possible to get k of each character
    if total['a'] < k or total['b'] < k or total['c'] < k:
        return -1

    # Calculate the maximum allowed count of each character in the middle substring
    # Middle can have at most (total - k) of each character
    limit_a = total['a'] - k
    limit_b = total['b'] - k
    limit_c = total['c'] - k

    # If all limits are non-negative, we can potentially take 0 characters
    # (if k=0, we need 0 of each, so 0 moves)
    if limit_a >= 0 and limit_b >= 0 and limit_c >= 0 and k == 0:
        return 0

    # Sliding window to find the longest valid middle substring
    left = 0
    window_counts = {'a': 0, 'b': 0, 'c': 0}
    max_middle_length = 0

    for right in range(n):
        # Add current character to window
        window_counts[s[right]] += 1

        # Shrink window from left if any count exceeds its limit
        while (window_counts['a'] > limit_a or
               window_counts['b'] > limit_b or
               window_counts['c'] > limit_c):
            window_counts[s[left]] -= 1
            left += 1

        # Update maximum valid middle length
        current_length = right - left + 1
        max_middle_length = max(max_middle_length, current_length)

    # Minimum moves = total length - longest valid middle
    return n - max_middle_length
```

```javascript
// Time: O(n) | Space: O(1)
function takeCharacters(s, k) {
  const n = s.length;

  // Count total occurrences of each character
  const total = { a: 0, b: 0, c: 0 };
  for (let ch of s) {
    total[ch]++;
  }

  // Check if it's even possible to get k of each character
  if (total["a"] < k || total["b"] < k || total["c"] < k) {
    return -1;
  }

  // Calculate the maximum allowed count of each character in the middle substring
  const limitA = total["a"] - k;
  const limitB = total["b"] - k;
  const limitC = total["c"] - k;

  // Special case: if k=0, we need 0 moves
  if (limitA >= 0 && limitB >= 0 && limitC >= 0 && k === 0) {
    return 0;
  }

  // Sliding window to find the longest valid middle substring
  let left = 0;
  const windowCounts = { a: 0, b: 0, c: 0 };
  let maxMiddleLength = 0;

  for (let right = 0; right < n; right++) {
    // Add current character to window
    windowCounts[s[right]]++;

    // Shrink window from left if any count exceeds its limit
    while (windowCounts["a"] > limitA || windowCounts["b"] > limitB || windowCounts["c"] > limitC) {
      windowCounts[s[left]]--;
      left++;
    }

    // Update maximum valid middle length
    const currentLength = right - left + 1;
    maxMiddleLength = Math.max(maxMiddleLength, currentLength);
  }

  // Minimum moves = total length - longest valid middle
  return n - maxMiddleLength;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int takeCharacters(String s, int k) {
        int n = s.length();

        // Count total occurrences of each character
        int[] total = new int[3]; // index 0:'a', 1:'b', 2:'c'
        for (int i = 0; i < n; i++) {
            char ch = s.charAt(i);
            total[ch - 'a']++;
        }

        // Check if it's even possible to get k of each character
        if (total[0] < k || total[1] < k || total[2] < k) {
            return -1;
        }

        // Calculate the maximum allowed count of each character in the middle substring
        int limitA = total[0] - k;
        int limitB = total[1] - k;
        int limitC = total[2] - k;

        // Special case: if k=0, we need 0 moves
        if (limitA >= 0 && limitB >= 0 && limitC >= 0 && k == 0) {
            return 0;
        }

        // Sliding window to find the longest valid middle substring
        int left = 0;
        int[] windowCounts = new int[3];
        int maxMiddleLength = 0;

        for (int right = 0; right < n; right++) {
            // Add current character to window
            char ch = s.charAt(right);
            windowCounts[ch - 'a']++;

            // Shrink window from left if any count exceeds its limit
            while (windowCounts[0] > limitA ||
                   windowCounts[1] > limitB ||
                   windowCounts[2] > limitC) {
                char leftChar = s.charAt(left);
                windowCounts[leftChar - 'a']--;
                left++;
            }

            // Update maximum valid middle length
            int currentLength = right - left + 1;
            maxMiddleLength = Math.max(maxMiddleLength, currentLength);
        }

        // Minimum moves = total length - longest valid middle
        return n - maxMiddleLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting total characters: O(n)
- Sliding window: Each character is added once and removed at most once, so O(2n) = O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We use fixed-size dictionaries/arrays for counts (3 elements each)
- No additional data structures that scale with input size
- Even though we have O(1) space, note that some languages might use O(n) for the string itself, but that's input storage, not algorithm storage

## Common Mistakes

1. **Not checking impossibility early**: Forgetting to check if `total[ch] < k` for any character before proceeding. If there aren't enough of a character in the entire string, return -1 immediately.

2. **Handling k=0 incorrectly**: When k=0, we need 0 of each character, which means 0 moves. Some implementations might return n (taking all characters) instead of 0. The sliding window approach handles this correctly since limits = total counts, so the whole string is valid middle.

3. **Off-by-one in sliding window**: When shrinking the window, it's easy to increment `left` before decrementing the count, or vice versa. Always decrement the count of the character at position `left`, then increment `left`.

4. **Misunderstanding the problem transformation**: Some candidates try to simulate taking from ends directly, which leads to complex DP or BFS solutions. The key is recognizing the "longest valid middle" transformation.

## When You'll See This Pattern

The "maximize middle/subarray subject to constraints" pattern appears in several sliding window problems:

1. **Longest Substring with At Most K Distinct Characters** (LeetCode 340): Find longest substring with ≤ k distinct chars. Similar constraint-checking in sliding window.

2. **Fruit Into Baskets** (LeetCode 904): Find longest subarray with at most 2 types of fruits. Same sliding window with type constraints.

3. **Minimum Window Substring** (LeetCode 76): Find minimum window containing all characters of target. This is the "dual" problem - minimizing instead of maximizing, but uses similar sliding window with character counts.

The pattern: When you need to find a contiguous subarray/substring that satisfies constraints on element frequencies, think sliding window with character counts.

## Key Takeaways

1. **Problem transformation is powerful**: Instead of directly solving "minimize moves from ends", transform to "maximize middle we don't take". This changes the problem from two-ended to contiguous subarray.

2. **Sliding window with frequency constraints**: When you need the longest subarray where each character's frequency satisfies some inequality, sliding window with character counts is often optimal.

3. **Check feasibility first**: Always verify constraints are satisfiable with global counts before attempting to find a solution.

Related problems: [Merge Sorted Array](/problem/merge-sorted-array), [Reorder List](/problem/reorder-list), [Defuse the Bomb](/problem/defuse-the-bomb)
