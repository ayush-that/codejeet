---
title: "How to Solve Replace the Substring for Balanced String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Replace the Substring for Balanced String. Medium difficulty, 40.6% acceptance rate. Topics: String, Sliding Window."
date: "2028-08-31"
category: "dsa-patterns"
tags: ["replace-the-substring-for-balanced-string", "string", "sliding-window", "medium"]
---

# How to Solve Replace the Substring for Balanced String

You're given a string containing only four characters (Q, W, E, R) and need to find the minimum length substring you can replace to make the entire string balanced, where balanced means each character appears exactly n/4 times. What makes this problem interesting is that it looks like a string replacement problem but is actually a clever sliding window problem in disguise—you're not actually replacing anything, just finding the smallest window containing "excess" characters that need to be changed.

## Visual Walkthrough

Let's trace through an example: `s = "WQWRQQQW"` (n = 8, so each character should appear 8/4 = 2 times).

First, count all characters:

- Q: 4 (2 excess)
- W: 3 (1 excess)
- E: 0 (2 needed)
- R: 1 (1 needed)

The key insight: any substring we replace can fix ALL imbalances at once. If we find a window containing at least the excess of each character, then replacing that window can redistribute characters to achieve balance.

Let's find the smallest such window:

**Step 1:** Initialize left = 0, right = 0, minLength = ∞
Current window: "" (empty)

**Step 2:** Expand right to 0: "W" (W count in window: 1)
Outside window: Q:4, W:2, E:0, R:1
Check if outside counts ≤ n/4 (2): Q:4 > 2 ❌

**Step 3:** Expand right to 1: "WQ" (W:1, Q:1)
Outside: Q:3, W:2, E:0, R:1
Q:3 > 2 ❌

**Step 4:** Expand right to 2: "WQW" (W:2, Q:1)
Outside: Q:3, W:1, E:0, R:1
Q:3 > 2 ❌

**Step 5:** Expand right to 3: "WQWR" (W:2, Q:1, R:1)
Outside: Q:3, W:1, E:0, R:0
Q:3 > 2 ❌

**Step 6:** Expand right to 4: "WQWRQ" (W:2, Q:2, R:1)
Outside: Q:2, W:1, E:0, R:0
All outside ≤ 2! ✓
Update minLength = 5, shrink window...

**Step 7:** Move left to 1: "QWRQ" (Q:2, W:1, R:1)
Outside: Q:2, W:2, E:0, R:0
All outside ≤ 2! ✓
Update minLength = 4, shrink...

**Step 8:** Move left to 2: "WRQ" (W:1, R:1, Q:1)
Outside: Q:3, W:2, E:0, R:0
Q:3 > 2 ❌ Stop shrinking

Continue expanding right... Eventually we find minLength = 4.

## Brute Force Approach

A naive approach would be to check every possible substring (O(n²) of them), for each substring count what's outside the substring, check if all outside counts ≤ n/4, and track the minimum valid substring length. For each substring, we'd need to recount characters (O(n)), making this O(n³) overall.

Even if we precompute prefix sums to check outside counts in O(1), we still have O(n²) substrings to check, which is too slow for n up to 10⁵.

What a candidate might try: "Let me find which characters exceed n/4 and try to replace contiguous blocks of them." This doesn't work because excess characters might be scattered, and the optimal replacement window often contains characters that aren't even in excess.

## Optimized Approach

The key insight is that we can use a **sliding window** to find the smallest substring where, if we remove it (or replace it), the remaining characters are all within the n/4 limit.

Here's the step-by-step reasoning:

1. **Count total occurrences** of each character in the entire string.
2. **Calculate n/4** - this is our target frequency for a balanced string.
3. **The condition for a valid window**: For each character, the count _outside_ the window must be ≤ n/4. If this holds, we can replace the window to redistribute characters and achieve balance.
4. **Why sliding window works**: As we expand the right pointer, we include more characters in our window, which decreases the outside counts. When all outside counts ≤ n/4, we have a valid window. We then shrink from the left to find smaller valid windows.
5. **What we're minimizing**: The window size (right - left + 1), since that's the substring we'd need to replace.

The trick is maintaining the "outside counts" efficiently: outsideCount[char] = totalCount[char] - windowCount[char].

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - only 4 characters to track
def balancedString(s: str) -> int:
    n = len(s)
    target = n // 4  # Each character should appear this many times

    # Step 1: Count total occurrences of each character
    total_count = {'Q': 0, 'W': 0, 'E': 0, 'R': 0}
    for char in s:
        total_count[char] += 1

    # Step 2: If string is already balanced, return 0
    if (total_count['Q'] == target and total_count['W'] == target and
        total_count['E'] == target and total_count['R'] == target):
        return 0

    # Step 3: Initialize sliding window
    left = 0
    min_length = n  # Worst case: replace entire string
    window_count = {'Q': 0, 'W': 0, 'E': 0, 'R': 0}

    # Step 4: Expand window with right pointer
    for right in range(n):
        # Add current character to window
        window_count[s[right]] += 1

        # Step 5: Check if current window is valid
        # A window is valid if for ALL characters:
        # total_count[char] - window_count[char] <= target
        # This means characters outside window don't exceed target
        while (left <= right and
               total_count['Q'] - window_count['Q'] <= target and
               total_count['W'] - window_count['W'] <= target and
               total_count['E'] - window_count['E'] <= target and
               total_count['R'] - window_count['R'] <= target):

            # Update minimum length found so far
            min_length = min(min_length, right - left + 1)

            # Shrink window from left to try finding smaller valid window
            window_count[s[left]] -= 1
            left += 1

    return min_length
```

```javascript
// Time: O(n) | Space: O(1)
function balancedString(s) {
  const n = s.length;
  const target = n / 4; // Each character should appear this many times

  // Step 1: Count total occurrences of each character
  const totalCount = { Q: 0, W: 0, E: 0, R: 0 };
  for (let char of s) {
    totalCount[char]++;
  }

  // Step 2: If string is already balanced, return 0
  if (
    totalCount.Q === target &&
    totalCount.W === target &&
    totalCount.E === target &&
    totalCount.R === target
  ) {
    return 0;
  }

  // Step 3: Initialize sliding window
  let left = 0;
  let minLength = n; // Worst case: replace entire string
  const windowCount = { Q: 0, W: 0, E: 0, R: 0 };

  // Step 4: Expand window with right pointer
  for (let right = 0; right < n; right++) {
    // Add current character to window
    windowCount[s[right]]++;

    // Step 5: Check if current window is valid
    // A window is valid if for ALL characters:
    // totalCount[char] - windowCount[char] <= target
    // This means characters outside window don't exceed target
    while (
      left <= right &&
      totalCount.Q - windowCount.Q <= target &&
      totalCount.W - windowCount.W <= target &&
      totalCount.E - windowCount.E <= target &&
      totalCount.R - windowCount.R <= target
    ) {
      // Update minimum length found so far
      minLength = Math.min(minLength, right - left + 1);

      // Shrink window from left to try finding smaller valid window
      windowCount[s[left]]--;
      left++;
    }
  }

  return minLength;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int balancedString(String s) {
        int n = s.length();
        int target = n / 4;  // Each character should appear this many times

        // Step 1: Count total occurrences of each character
        int[] totalCount = new int[4];  // Index: Q=0, W=1, E=2, R=3
        for (int i = 0; i < n; i++) {
            totalCount[charToIndex(s.charAt(i))]++;
        }

        // Step 2: If string is already balanced, return 0
        if (totalCount[0] == target && totalCount[1] == target &&
            totalCount[2] == target && totalCount[3] == target) {
            return 0;
        }

        // Step 3: Initialize sliding window
        int left = 0;
        int minLength = n;  // Worst case: replace entire string
        int[] windowCount = new int[4];

        // Step 4: Expand window with right pointer
        for (int right = 0; right < n; right++) {
            // Add current character to window
            windowCount[charToIndex(s.charAt(right))]++;

            // Step 5: Check if current window is valid
            // A window is valid if for ALL characters:
            // totalCount[char] - windowCount[char] <= target
            // This means characters outside window don't exceed target
            while (left <= right &&
                   totalCount[0] - windowCount[0] <= target &&
                   totalCount[1] - windowCount[1] <= target &&
                   totalCount[2] - windowCount[2] <= target &&
                   totalCount[3] - windowCount[3] <= target) {

                // Update minimum length found so far
                minLength = Math.min(minLength, right - left + 1);

                // Shrink window from left to try finding smaller valid window
                windowCount[charToIndex(s.charAt(left))]--;
                left++;
            }
        }

        return minLength;
    }

    // Helper method to convert character to array index
    private int charToIndex(char c) {
        switch (c) {
            case 'Q': return 0;
            case 'W': return 1;
            case 'E': return 2;
            case 'R': return 3;
            default: return -1;  // Should never happen given constraints
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** - Each character is added to the window exactly once and removed at most once. The `while` loop inside the `for` loop doesn't make it O(n²) because `left` only moves forward—each character is processed at most twice (once when added via `right`, once when removed via `left`).

**Space Complexity: O(1)** - We only store counts for 4 characters, which is constant space regardless of input size. Even with the array-to-index mapping in Java, we're using fixed-size arrays of length 4.

## Common Mistakes

1. **Checking the wrong condition**: Some candidates check if window counts ≥ excess counts. The correct condition is checking if _outside_ counts ≤ target. Remember: we want the characters _outside_ the window to be balanced or deficient, not excessive.

2. **Forgetting the early return**: If the string is already balanced (all counts = n/4), we can return 0 immediately. Missing this doesn't affect correctness but shows lack of optimization thinking.

3. **Incorrect window shrinking**: The condition `left <= right` in the while loop is crucial. Without it, you might try to shrink an empty window when `left > right`.

4. **Using the wrong data structure**: While dictionaries/maps work fine, arrays with index mapping (like in Java solution) are more efficient. But the biggest mistake is trying to track which specific characters are in excess—we need to check ALL four characters every time.

## When You'll See This Pattern

This "minimum window substring" pattern appears in several LeetCode problems:

1. **Minimum Window Substring (LeetCode 76)** - Find the minimum window in s containing all characters of t. Same sliding window approach with character counts.

2. **Longest Substring Without Repeating Characters (LeetCode 3)** - Uses sliding window with character frequency tracking to maintain uniqueness.

3. **Fruit Into Baskets (LeetCode 904)** - Find longest contiguous subarray with at most 2 distinct elements. Similar window maintenance logic.

The pattern: When you need to find a contiguous subarray/substring satisfying some condition based on character frequencies, sliding window with frequency counts is often the solution.

## Key Takeaways

1. **Reformulate the problem**: Instead of thinking "what substring should I replace?", think "what's the smallest window such that everything outside is balanced?" This mental shift is crucial.

2. **Sliding window with frequency counts**: When you see "minimum length substring" with frequency constraints, sliding window is your first thought. The window represents the candidate substring, and you maintain counts of what's inside vs. outside.

3. **Check the complement**: The valid window condition checks the _outside_ counts, not the inside counts. This counterintuitive insight is what makes this problem medium difficulty rather than easy.

[Practice this problem on CodeJeet](/problem/replace-the-substring-for-balanced-string)
