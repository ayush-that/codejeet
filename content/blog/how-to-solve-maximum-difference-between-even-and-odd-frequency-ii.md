---
title: "How to Solve Maximum Difference Between Even and Odd Frequency II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Difference Between Even and Odd Frequency II. Hard difficulty, 48.7% acceptance rate. Topics: String, Sliding Window, Enumeration, Prefix Sum."
date: "2028-05-03"
category: "dsa-patterns"
tags:
  [
    "maximum-difference-between-even-and-odd-frequency-ii",
    "string",
    "sliding-window",
    "enumeration",
    "hard",
  ]
---

# How to Solve Maximum Difference Between Even and Odd Frequency II

You need to find the maximum difference between frequencies of two characters in a substring where one character has odd frequency and the substring length is at least `k`. The challenge is that you can't just track the most frequent character—you need to consider all possible character pairs while maintaining the odd frequency constraint. This requires clever enumeration and sliding window techniques.

## Visual Walkthrough

Let's trace through `s = "aabbbcd"`, `k = 3`:

We need to find a substring of length ≥3 where:

1. Character `a` has odd frequency
2. We maximize `freq[a] - freq[b]` for some character `b`

Consider substring `"aab"` (positions 0-2):

- freq: a=2, b=1
- No character has odd frequency → invalid

Consider `"aabb"` (0-3):

- freq: a=2, b=2
- No odd frequency → invalid

Consider `"aabbb"` (0-4):

- freq: a=2, b=3
- b has odd frequency (3)
- Possible pairs: b-a = 3-2 = 1, b-c = 3-0 = 3, b-d = 3-0 = 3
- Best: max(1, 3, 3) = 3

Consider `"abbbcd"` (1-6):

- freq: a=1, b=3, c=1, d=1
- Characters with odd frequency: a(1), b(3), c(1), d(1)
- For a: a-b=1-3=-2, a-c=1-1=0, a-d=1-1=0
- For b: b-a=3-1=2, b-c=3-1=2, b-d=3-1=2
- For c: c-a=1-1=0, c-b=1-3=-2, c-d=1-1=0
- For d: similar to c
- Best: max(2, 2, 2) = 2

The maximum we found is 3 from substring `"aabbb"`.

## Brute Force Approach

A naive solution would check all possible substrings of length ≥k:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i+k-1 to n-1
3. Count frequencies of all characters in substring s[i:j+1]
4. For each character `a` with odd frequency
5. For each character `b` (including a itself)
6. Calculate freq[a] - freq[b] and track maximum

This is O(n³ × 26²) since there are O(n²) substrings, each requiring O(n) to count frequencies, and then O(26²) to check all pairs. For n up to 10⁵, this is impossible.

Even optimizing frequency counting with prefix sums gives O(n² × 26²), still too slow.

## Optimized Approach

The key insight: We can fix the character with odd frequency and use a sliding window to find the maximum difference.

For each character `odd_char` (26 possibilities):

1. Traverse the string with a sliding window
2. Treat `odd_char` as +1 when encountered, other characters as -1
3. Track the minimum prefix sum to maximize the difference
4. Ensure window length ≥ k

Why this works:

- We want to maximize `freq[odd_char] - freq[other_char]`
- For a fixed `other_char`, this equals `(count_odd - count_other)`
- We can rewrite as: `(count_odd + (total - count_odd - count_other)) - total`
  where `total` is window length
- But simpler: For each position, we track `count_odd - count_other`

Actually, the cleaner approach:
For each pair (odd_char, other_char):

- Convert string to array where:
  - odd_char = +1
  - other_char = -1
  - other characters = 0
- Find maximum subarray sum of length ≥ k
- This gives max(freq[odd_char] - freq[other_char])

But checking 26×26=676 pairs with O(n) each is O(676n) ≈ 6.76×10⁷ operations, which is acceptable.

## Optimal Solution

We use a two-level enumeration:

1. Outer loop: Choose the character with odd frequency (26 possibilities)
2. Inner loop: Choose the character to subtract (26 possibilities)
3. For each pair, use sliding window to find maximum difference with length ≥ k

The sliding window technique:

- Convert string to values: +1 for odd_char, -1 for other_char, 0 otherwise
- Track prefix sums and maintain a deque of valid starting points
- For each ending position, find the minimum prefix sum in valid starting positions

<div class="code-group">

```python
# Time: O(26*26*n) ≈ O(676n) | Space: O(n)
def maxDifference(self, s: str, k: int) -> int:
    n = len(s)
    if n < k:
        return 0

    max_diff = 0

    # Try each character as the one with odd frequency
    for odd_char in range(26):
        odd_char_chr = chr(ord('a') + odd_char)

        # Try each character as the one to subtract
        for other_char in range(26):
            other_char_chr = chr(ord('a') + other_char)

            # Skip if same character (difference would be 0)
            if odd_char == other_char:
                continue

            # Convert string to array of values
            # +1 for odd_char, -1 for other_char, 0 for others
            values = [0] * n
            for i in range(n):
                if s[i] == odd_char_chr:
                    values[i] = 1
                elif s[i] == other_char_chr:
                    values[i] = -1

            # Sliding window to find maximum sum subarray of length >= k
            prefix_sum = [0] * (n + 1)
            for i in range(n):
                prefix_sum[i + 1] = prefix_sum[i] + values[i]

            # Maintain a deque of candidate start positions
            from collections import deque
            dq = deque()

            for end in range(k, n + 1):
                # Add start position (end - k) to deque
                start_idx = end - k
                # Maintain deque in increasing order of prefix sum
                while dq and prefix_sum[dq[-1]] >= prefix_sum[start_idx]:
                    dq.pop()
                dq.append(start_idx)

                # Calculate maximum difference for current end position
                # The best start gives minimum prefix sum
                min_prefix = prefix_sum[dq[0]]
                current_diff = prefix_sum[end] - min_prefix
                max_diff = max(max_diff, current_diff)

                # Remove start positions that are too far left
                if dq[0] == end - k:
                    dq.popleft()

    return max_diff
```

```javascript
// Time: O(26*26*n) ≈ O(676n) | Space: O(n)
function maxDifference(s, k) {
  const n = s.length;
  if (n < k) return 0;

  let maxDiff = 0;

  // Try each character as the one with odd frequency
  for (let oddCharCode = 0; oddCharCode < 26; oddCharCode++) {
    const oddChar = String.fromCharCode("a".charCodeAt(0) + oddCharCode);

    // Try each character as the one to subtract
    for (let otherCharCode = 0; otherCharCode < 26; otherCharCode++) {
      const otherChar = String.fromCharCode("a".charCodeAt(0) + otherCharCode);

      // Skip if same character
      if (oddCharCode === otherCharCode) continue;

      // Convert string to array of values
      // +1 for odd_char, -1 for other_char, 0 for others
      const values = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        if (s[i] === oddChar) {
          values[i] = 1;
        } else if (s[i] === otherChar) {
          values[i] = -1;
        }
      }

      // Calculate prefix sums
      const prefixSum = new Array(n + 1).fill(0);
      for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + values[i];
      }

      // Deque for maintaining candidate start positions
      const dq = [];

      for (let end = k; end <= n; end++) {
        // Add start position (end - k) to deque
        const startIdx = end - k;
        // Maintain deque in increasing order of prefix sum
        while (dq.length > 0 && prefixSum[dq[dq.length - 1]] >= prefixSum[startIdx]) {
          dq.pop();
        }
        dq.push(startIdx);

        // Calculate maximum difference for current end
        const minPrefix = prefixSum[dq[0]];
        const currentDiff = prefixSum[end] - minPrefix;
        maxDiff = Math.max(maxDiff, currentDiff);

        // Remove start positions that are too far left
        if (dq[0] === end - k) {
          dq.shift();
        }
      }
    }
  }

  return maxDiff;
}
```

```java
// Time: O(26*26*n) ≈ O(676n) | Space: O(n)
public int maxDifference(String s, int k) {
    int n = s.length();
    if (n < k) return 0;

    int maxDiff = 0;

    // Try each character as the one with odd frequency
    for (char oddChar = 'a'; oddChar <= 'z'; oddChar++) {
        // Try each character as the one to subtract
        for (char otherChar = 'a'; otherChar <= 'z'; otherChar++) {
            // Skip if same character
            if (oddChar == otherChar) continue;

            // Convert string to array of values
            // +1 for odd_char, -1 for other_char, 0 for others
            int[] values = new int[n];
            for (int i = 0; i < n; i++) {
                char c = s.charAt(i);
                if (c == oddChar) {
                    values[i] = 1;
                } else if (c == otherChar) {
                    values[i] = -1;
                }
            }

            // Calculate prefix sums
            int[] prefixSum = new int[n + 1];
            for (int i = 0; i < n; i++) {
                prefixSum[i + 1] = prefixSum[i] + values[i];
            }

            // Deque for maintaining candidate start positions
            Deque<Integer> dq = new ArrayDeque<>();

            for (int end = k; end <= n; end++) {
                // Add start position (end - k) to deque
                int startIdx = end - k;
                // Maintain deque in increasing order of prefix sum
                while (!dq.isEmpty() && prefixSum[dq.peekLast()] >= prefixSum[startIdx]) {
                    dq.pollLast();
                }
                dq.offerLast(startIdx);

                // Calculate maximum difference for current end
                int minPrefix = prefixSum[dq.peekFirst()];
                int currentDiff = prefixSum[end] - minPrefix;
                maxDiff = Math.max(maxDiff, currentDiff);

                // Remove start positions that are too far left
                if (dq.peekFirst() == end - k) {
                    dq.pollFirst();
                }
            }
        }
    }

    return maxDiff;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(26 × 26 × n) = O(676n) ≈ O(n)

- Outer loop: 26 characters for odd frequency
- Inner loop: 26 characters to subtract from
- For each pair: O(n) sliding window pass
- In practice, 676n operations, which for n=10⁵ is ~6.76×10⁷ operations, acceptable

**Space Complexity:** O(n)

- We store the values array of size n
- We store prefix sums of size n+1
- The deque stores at most n elements
- Total: O(3n) ≈ O(n)

## Common Mistakes

1. **Forgetting the length constraint k**: Candidates often find the maximum difference in any substring, forgetting it must have length ≥ k. The sliding window must enforce this by only considering starts that are at least k positions before the end.

2. **Incorrect odd frequency handling**: The problem requires a character with odd frequency, but we're maximizing freq[a] - freq[b]. Some candidates try to track odd frequency dynamically, but our enumeration approach ensures we only consider characters that could have odd frequency.

3. **Inefficient pair enumeration**: Trying to track all 26 characters simultaneously is complex. The key insight is to fix two characters at a time and convert to a maximum subarray sum problem.

4. **Off-by-one errors in sliding window**: When maintaining the deque of start positions, remember that prefixSum[i] represents sum up to position i-1. The window from start to end (exclusive) has sum prefixSum[end] - prefixSum[start].

## When You'll See This Pattern

This problem combines several important patterns:

1. **Character frequency problems with constraints**: Similar to "Longest Substring with At Most K Distinct Characters" but with parity constraints.

2. **Maximum subarray sum with length constraint**: The core of converting to values and finding maximum sum subarray of length ≥ k appears in problems like "Maximum Sum of Distinct Subarrays With Length K".

3. **Enumeration optimization**: When direct computation is too expensive, enumerating over a small fixed set (like 26 letters) can make problems tractable. Seen in "Maximum Product of the Length of Two Palindromic Subsequences".

## Key Takeaways

1. **Convert constraints to numerical values**: When dealing with frequency differences, converting characters to +1/-1/0 values transforms the problem into a maximum subarray sum problem.

2. **Enumerate over small fixed sets**: When there are only 26 possible characters, O(26²n) is often acceptable even for large n.

3. **Sliding window with deque for min/max queries**: For problems requiring maximum/minimum over sliding windows with length constraints, a deque maintaining monotonic order is efficient.

Related problems: [Frequency of the Most Frequent Element](/problem/frequency-of-the-most-frequent-element), [Count Elements With Maximum Frequency](/problem/count-elements-with-maximum-frequency)
