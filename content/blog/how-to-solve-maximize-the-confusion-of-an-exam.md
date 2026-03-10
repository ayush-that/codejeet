---
title: "How to Solve Maximize the Confusion of an Exam — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize the Confusion of an Exam. Medium difficulty, 69.7% acceptance rate. Topics: String, Binary Search, Sliding Window, Prefix Sum."
date: "2026-10-16"
category: "dsa-patterns"
tags: ["maximize-the-confusion-of-an-exam", "string", "binary-search", "sliding-window", "medium"]
---

# How to Solve "Maximize the Confusion of an Exam"

This problem asks us to find the longest consecutive sequence of identical answers ('T' or 'F') in an exam answer key, where we're allowed to change up to `k` answers to maximize this length. What makes this interesting is that it's essentially a **sliding window** problem in disguise — we need to find the longest substring containing at most `k` characters that are different from the majority character in that window.

## Visual Walkthrough

Let's trace through an example: `answerKey = "TTFFT"`, `k = 1`

We want the longest consecutive sequence where we can change at most 1 character. Let's think step by step:

**Window 1:** `"TT"` (indices 0-1)

- Current window: `"TT"`
- Majority character: `'T'` (count = 2)
- Characters to change: 0 (all are `'T'`)
- Length: 2 (valid since 0 ≤ k)

**Window 2:** Expand to `"TTF"` (indices 0-2)

- Current window: `"TTF"`
- Majority character: `'T'` (count = 2)
- Characters to change: 1 (the `'F'` needs changing)
- Length: 3 (valid since 1 ≤ k)

**Window 3:** Expand to `"TTFF"` (indices 0-3)

- Current window: `"TTFF"`
- Majority character: `'T'` (count = 2) or `'F'` (count = 2)
- If we choose `'T'`: need to change 2 `'F'`s → 2 > k
- If we choose `'F'`: need to change 2 `'T'`s → 2 > k
- Invalid window, so we shrink from left

**Window 4:** Shrink to `"TFF"` (indices 1-3)

- Current window: `"TFF"`
- Majority character: `'F'` (count = 2)
- Characters to change: 1 (the `'T'` needs changing)
- Length: 3 (valid since 1 ≤ k)

**Window 5:** Expand to `"TFFT"` (indices 1-4)

- Current window: `"TFFT"`
- Majority character: `'F'` (count = 2)
- Characters to change: 2 (both `'T'`s need changing)
- 2 > k, so invalid

**Window 6:** Shrink to `"FFT"` (indices 2-4)

- Current window: `"FFT"`
- Majority character: `'F'` (count = 2)
- Characters to change: 1 (the `'T'` needs changing)
- Length: 3 (valid since 1 ≤ k)

The maximum length we found was 3. Indeed, we can get `"TTT"` by changing index 2, or `"FFF"` by changing index 1 or 3.

## Brute Force Approach

A naive approach would be to check every possible substring and count how many characters we'd need to change to make it all `'T'` or all `'F'`. For each substring starting at index `i` and ending at index `j`:

1. Count the number of `'T'`s in the substring
2. The number of changes needed to make all `'T'` = length - countT
3. The number of changes needed to make all `'F'` = countT
4. Take the minimum of these two values
5. If this minimum ≤ k, update the maximum length

This approach has O(n³) time complexity: O(n²) substrings and O(n) to count characters for each substring. We could optimize counting with prefix sums to get O(n²), but that's still too slow for n up to 5×10⁴.

## Optimized Approach

The key insight is that this problem is identical to **Longest Repeating Character Replacement**. We can use a sliding window approach with two pointers:

1. Maintain a window `[left, right]` that represents our current substring
2. Track the frequency of `'T'` and `'F'` in the current window
3. The most frequent character in the window tells us what we should convert everything to
4. The number of changes needed = window length - count of most frequent character
5. If changes needed > k, shrink the window from the left
6. Keep track of the maximum valid window length

Why does this work? For any window, the optimal strategy is to change all characters to match the most frequent character in that window. This minimizes the number of changes needed. The sliding window efficiently finds the longest substring where this minimum number of changes is ≤ k.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxConsecutiveAnswers(answerKey: str, k: int) -> int:
    """
    Finds the longest consecutive sequence of identical answers
    after changing at most k answers.

    Uses sliding window approach similar to Longest Repeating Character Replacement.
    """
    max_length = 0
    left = 0
    # Track counts of 'T' and 'F' in current window
    count = {'T': 0, 'F': 0}
    max_count = 0  # Maximum frequency of any character in current window

    for right in range(len(answerKey)):
        # Expand window to include current character
        current_char = answerKey[right]
        count[current_char] += 1

        # Update max_count - this is the count of the most frequent character
        max_count = max(max_count, count[current_char])

        # Calculate current window length
        window_len = right - left + 1

        # If we need to change more than k characters to make all same
        # (changes needed = window_len - max_count)
        if window_len - max_count > k:
            # Shrink window from left
            left_char = answerKey[left]
            count[left_char] -= 1
            left += 1
            # Note: we don't update max_count here because it doesn't affect correctness
            # The window might temporarily have a smaller max_count, but we only care
            # about the maximum window length, not the exact max_count at all times

        # Update maximum length
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Finds the longest consecutive sequence of identical answers
 * after changing at most k answers.
 *
 * Uses sliding window approach similar to Longest Repeating Character Replacement.
 */
function maxConsecutiveAnswers(answerKey, k) {
  let maxLength = 0;
  let left = 0;
  // Track counts of 'T' and 'F' in current window
  const count = { T: 0, F: 0 };
  let maxCount = 0; // Maximum frequency of any character in current window

  for (let right = 0; right < answerKey.length; right++) {
    // Expand window to include current character
    const currentChar = answerKey[right];
    count[currentChar]++;

    // Update maxCount - this is the count of the most frequent character
    maxCount = Math.max(maxCount, count[currentChar]);

    // Calculate current window length
    const windowLen = right - left + 1;

    // If we need to change more than k characters to make all same
    // (changes needed = windowLen - maxCount)
    if (windowLen - maxCount > k) {
      // Shrink window from left
      const leftChar = answerKey[left];
      count[leftChar]--;
      left++;
      // Note: we don't update maxCount here because it doesn't affect correctness
      // The window might temporarily have a smaller maxCount, but we only care
      // about the maximum window length, not the exact maxCount at all times
    }

    // Update maximum length
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Finds the longest consecutive sequence of identical answers
     * after changing at most k answers.
     *
     * Uses sliding window approach similar to Longest Repeating Character Replacement.
     */
    public int maxConsecutiveAnswers(String answerKey, int k) {
        int maxLength = 0;
        int left = 0;
        // Track counts of 'T' and 'F' in current window
        int tCount = 0, fCount = 0;
        int maxCount = 0; // Maximum frequency of any character in current window

        for (int right = 0; right < answerKey.length(); right++) {
            // Expand window to include current character
            char currentChar = answerKey.charAt(right);

            // Update appropriate count
            if (currentChar == 'T') {
                tCount++;
                maxCount = Math.max(maxCount, tCount);
            } else {
                fCount++;
                maxCount = Math.max(maxCount, fCount);
            }

            // Calculate current window length
            int windowLen = right - left + 1;

            // If we need to change more than k characters to make all same
            // (changes needed = windowLen - maxCount)
            if (windowLen - maxCount > k) {
                // Shrink window from left
                char leftChar = answerKey.charAt(left);
                if (leftChar == 'T') {
                    tCount--;
                } else {
                    fCount--;
                }
                left++;
                // Note: we don't update maxCount here because it doesn't affect correctness
                // The window might temporarily have a smaller maxCount, but we only care
                // about the maximum window length, not the exact maxCount at all times
            }

            // Update maximum length
            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of `answerKey`. Each character is processed at most twice — once when expanding the right pointer and once when shrinking the left pointer.

**Space Complexity:** O(1). We only use a constant amount of extra space to store the character counts and pointers, regardless of input size.

## Common Mistakes

1. **Not understanding the problem transformation**: Some candidates try to solve this as two separate problems (longest consecutive 'T's with k changes and longest consecutive 'F's with k changes). While this approach works, it's less elegant than the single sliding window solution.

2. **Incorrectly updating max_count/maxCount when shrinking**: When we remove a character from the left, we don't need to update `max_count`. The algorithm still works because we're tracking the maximum window length, not the exact maximum frequency at every step. Trying to update `max_count` correctly would require O(n) time and break the linear complexity.

3. **Off-by-one errors in window calculation**: The formula `window_len - max_count > k` is correct. Some candidates use `≥` instead of `>`, which would shrink the window too early. Remember: we can tolerate exactly `k` changes, so we only shrink when we need more than `k` changes.

4. **Forgetting to handle empty string or k=0 cases**: While the problem constraints guarantee non-empty input, it's good practice to consider edge cases. When k=0, the problem reduces to finding the longest consecutive sequence of identical characters, which our solution handles correctly.

## When You'll See This Pattern

This sliding window pattern appears in problems where you need to find the longest substring satisfying some constraint with limited "changes" or "replacements":

1. **Longest Repeating Character Replacement** (LeetCode 424): Almost identical problem — find the longest substring containing the same letter after at most k replacements.

2. **Max Consecutive Ones III** (LeetCode 1004): Find the longest consecutive sequence of 1s in a binary array if you can flip at most k 0s.

3. **Longest Substring with At Most K Distinct Characters** (LeetCode 340): Find the longest substring with at most k distinct characters — similar sliding window but tracking distinct characters instead of changes needed.

The pattern is: maintain a window that satisfies the constraint, expand when possible, shrink when necessary, and track the maximum valid window length.

## Key Takeaways

1. **Recognize the sliding window pattern**: When a problem asks for the "longest substring" with some constraint involving "at most k changes/replacements", think sliding window with two pointers.

2. **Focus on what makes a window valid**: In this case, a window is valid if `window_length - max_frequency ≤ k`. This formula tells us how many changes we need to make all characters the same.

3. **Don't overcomplicate the implementation**: The elegant solution uses O(1) space and O(n) time. You don't need to track exact frequencies of both characters at all times — just the maximum frequency in the current window.

Related problems: [Longest Substring with At Most K Distinct Characters](/problem/longest-substring-with-at-most-k-distinct-characters), [Longest Repeating Character Replacement](/problem/longest-repeating-character-replacement), [Max Consecutive Ones III](/problem/max-consecutive-ones-iii)
