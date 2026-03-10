---
title: "How to Solve Find Special Substring of Length K — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Special Substring of Length K. Easy difficulty, 35.1% acceptance rate. Topics: String."
date: "2028-11-03"
category: "dsa-patterns"
tags: ["find-special-substring-of-length-k", "string", "easy"]
---

# How to Solve "Find Special Substring of Length K"

This problem asks us to check if a string contains a substring of exactly length `k` where all characters are identical. The tricky part is that we need to find **any** contiguous block of the same character that's exactly `k` characters long—not just the longest run of identical characters. While conceptually simple, it tests your ability to efficiently scan strings and handle edge cases.

## Visual Walkthrough

Let's trace through an example step by step to build intuition.

**Example:** `s = "aaabbc"`, `k = 3`

We need to find any substring of length 3 where all characters are the same.

1. **Start at index 0:** Character is `'a'`
   - Check next characters: `s[1] = 'a'`, `s[2] = 'a'`
   - All three are `'a'`, so we found `"aaa"` of length 3
   - **Result:** `True` — we can return immediately

**Another example:** `s = "aaabbc"`, `k = 2`

1. **Start at index 0:** Character is `'a'`
   - Check `s[1] = 'a'` → we have `"aa"` of length 2
   - **Result:** `True`

**Edge case example:** `s = "abcde"`, `k = 3`

1. **Start at index 0:** `'a'`
   - Check `s[1] = 'b'` → different character, stop checking this position
2. **Move to index 1:** `'b'`
   - Check `s[2] = 'c'` → different, stop
3. **Continue scanning:** No run of 3 identical characters anywhere
   - **Result:** `False`

The key insight: we don't need to check every possible substring of length `k`. Instead, we can scan through the string and look for runs of identical characters. If any run has length `≥ k`, then there exists a substring of exactly length `k` within it.

## Brute Force Approach

A naive approach would check every possible substring of length `k`:

1. Generate all substrings of length `k` (there are `n - k + 1` of them)
2. For each substring, check if all characters are the same
3. Return `true` if any substring passes the check

**Why this is inefficient:**

- Time complexity: O((n - k + 1) × k) = O(nk) in worst case
- For `k = n/2`, this becomes O(n²)
- We're doing redundant work by re-checking characters multiple times

**What a naive candidate might miss:**

- If `k > n`, we can immediately return `false` (no substring can be longer than the string itself)
- If `k ≤ 0`, we should handle it (though problem constraints typically make `k` positive)

## Optimal Solution

The optimal approach uses a single pass through the string. We maintain a counter for the current run of identical characters. When we find a run of length `≥ k`, we can return `true` immediately.

**Algorithm:**

1. Handle edge cases: if `k > len(s)` or `k ≤ 0`, return `false`
2. Initialize `current_run = 1` (we count the current character)
3. Iterate through the string starting from index 1
4. If current character equals previous character, increment `current_run`
5. If current character differs, reset `current_run = 1`
6. If at any point `current_run ≥ k`, return `true`
7. If we finish scanning without finding such a run, return `false`

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def has_special_substring(s: str, k: int) -> bool:
    """
    Check if string s contains a substring of exactly length k
    where all characters are identical.

    Args:
        s: Input string
        k: Required substring length

    Returns:
        True if such substring exists, False otherwise
    """
    # Edge case: if k is larger than string length or non-positive,
    # no such substring can exist
    if k > len(s) or k <= 0:
        return False

    # Special case: if k == 1, any non-empty string has a valid substring
    # (any single character)
    if k == 1:
        return len(s) > 0

    # Count of consecutive identical characters
    current_run = 1

    # Start from index 1, comparing each character with the previous one
    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            # Same character as previous, extend the run
            current_run += 1
        else:
            # Different character, reset the run counter
            current_run = 1

        # If we've found k consecutive identical characters,
        # we have a valid substring
        if current_run >= k:
            return True

    # If we've scanned the entire string without finding k consecutive
    # identical characters, no such substring exists
    return False
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if string s contains a substring of exactly length k
 * where all characters are identical.
 *
 * @param {string} s - Input string
 * @param {number} k - Required substring length
 * @return {boolean} True if such substring exists, False otherwise
 */
function hasSpecialSubstring(s, k) {
  // Edge case: if k is larger than string length or non-positive,
  // no such substring can exist
  if (k > s.length || k <= 0) {
    return false;
  }

  // Special case: if k == 1, any non-empty string has a valid substring
  // (any single character)
  if (k === 1) {
    return s.length > 0;
  }

  // Count of consecutive identical characters
  let currentRun = 1;

  // Start from index 1, comparing each character with the previous one
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      // Same character as previous, extend the run
      currentRun++;
    } else {
      // Different character, reset the run counter
      currentRun = 1;
    }

    // If we've found k consecutive identical characters,
    // we have a valid substring
    if (currentRun >= k) {
      return true;
    }
  }

  // If we've scanned the entire string without finding k consecutive
  // identical characters, no such substring exists
  return false;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if string s contains a substring of exactly length k
     * where all characters are identical.
     *
     * @param s Input string
     * @param k Required substring length
     * @return True if such substring exists, False otherwise
     */
    public boolean hasSpecialSubstring(String s, int k) {
        // Edge case: if k is larger than string length or non-positive,
        // no such substring can exist
        if (k > s.length() || k <= 0) {
            return false;
        }

        // Special case: if k == 1, any non-empty string has a valid substring
        // (any single character)
        if (k == 1) {
            return !s.isEmpty();
        }

        // Count of consecutive identical characters
        int currentRun = 1;

        // Start from index 1, comparing each character with the previous one
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                // Same character as previous, extend the run
                currentRun++;
            } else {
                // Different character, reset the run counter
                currentRun = 1;
            }

            // If we've found k consecutive identical characters,
            // we have a valid substring
            if (currentRun >= k) {
                return true;
            }
        }

        // If we've scanned the entire string without finding k consecutive
        // identical characters, no such substring exists
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string, comparing each character with its predecessor
- Each character is examined exactly once
- Early exit when we find a valid substring (could be faster than O(n) in practice)

**Space Complexity: O(1)**

- We only use a constant amount of extra space: `current_run` counter and loop index
- No additional data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors in the run counter:**
   - Starting `current_run` at 0 instead of 1
   - Forgetting to reset `current_run` when characters differ
   - **Fix:** Remember we count the current character, so start at 1 for the first character

2. **Not handling edge cases properly:**
   - Forgetting to check if `k > len(s)` (impossible case)
   - Not handling `k = 1` as a special case (though our algorithm handles it correctly)
   - **Fix:** Always check boundary conditions before the main logic

3. **Inefficient brute force checking:**
   - Checking every substring of length `k` individually
   - Not realizing that if we have a run of length `m ≥ k`, then any `k`-length window within it is valid
   - **Fix:** Look for runs of identical characters instead of checking all windows

4. **Early termination condition:**
   - Checking `current_run == k` instead of `current_run ≥ k`
   - If we have a run of length 5 and `k = 3`, we should return `true` immediately
   - **Fix:** Use `≥` comparison since any run longer than `k` contains a valid substring

## When You'll See This Pattern

This problem uses the **"run-length encoding"** pattern, where we process consecutive identical elements as a group. You'll encounter similar patterns in:

1. **LeetCode 485: Max Consecutive Ones**
   - Find the maximum number of consecutive 1's in a binary array
   - Same pattern: track current run, reset when value changes, track maximum

2. **LeetCode 1446: Consecutive Characters**
   - Find the maximum length of a substring consisting of the same character
   - Almost identical to this problem but looking for maximum instead of specific length

3. **LeetCode 1869: Longer Contiguous Segments of Ones than Zeros**
   - Compare lengths of longest runs of 1's vs 0's
   - Uses the same run-tracking technique for two different values

The core technique—tracking runs of identical elements with a counter—appears in many string and array processing problems.

## Key Takeaways

1. **Look for runs, not windows:** When checking for consecutive identical elements, it's more efficient to track runs than to check every possible window. A run of length `m` contains `m - k + 1` valid windows of length `k`.

2. **Early exit optimization:** Once you find a run of length `≥ k`, you can return immediately. Don't continue scanning unnecessarily.

3. **Boundary conditions matter:** Always check for edge cases like `k > n`, `k ≤ 0`, or empty strings before your main logic. These simple checks can prevent bugs and show interviewers you're thorough.

[Practice this problem on CodeJeet](/problem/find-special-substring-of-length-k)
