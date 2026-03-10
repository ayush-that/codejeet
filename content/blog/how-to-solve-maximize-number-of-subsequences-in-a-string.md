---
title: "How to Solve Maximize Number of Subsequences in a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Number of Subsequences in a String. Medium difficulty, 35.9% acceptance rate. Topics: String, Greedy, Prefix Sum."
date: "2029-08-19"
category: "dsa-patterns"
tags: ["maximize-number-of-subsequences-in-a-string", "string", "greedy", "prefix-sum", "medium"]
---

# Maximize Number of Subsequences in a String - Solution Guide

You're given a string `text` and a 2-character pattern `pattern`. You can add exactly one character (either `pattern[0]` or `pattern[1]`) anywhere in `text` to maximize the number of times `pattern` appears as a subsequence. The challenge is figuring out where to place that single character to get the biggest boost in subsequence count.

What makes this problem interesting is that you can't just count subsequences naively after trying every possible insertion - that would be too slow. Instead, you need to understand how inserting a character affects the subsequence count in a predictable way.

## Visual Walkthrough

Let's walk through an example: `text = "abdcdbc"`, `pattern = "ab"`.

**Step 1: Understanding subsequence counting**
A subsequence `"ab"` means we need to find all pairs where an `'a'` appears before a `'b'`. In our text:

- `'a'` at index 0, `'b'` at index 1 → 1 subsequence
- `'a'` at index 0, `'b'` at index 5 → 1 subsequence
  Total: 2 subsequences initially.

**Step 2: What happens when we add a character?**
We can add either `'a'` or `'b'` anywhere. Let's think strategically:

If we add `'a'` at position `i`:

- It creates new subsequences with every `'b'` that comes AFTER position `i`
- It also gets paired with `'b'`s that come BEFORE it? No! For `"ab"`, the `'a'` must come before the `'b'`

If we add `'b'` at position `i`:

- It creates new subsequences with every `'a'` that comes BEFORE position `i`
- It doesn't pair with `'a'`s that come after it

**Step 3: Try adding `'a'` at the beginning**
Add `'a'` at index 0: `"aabdcdbc"`

- New `'a'` pairs with all 3 `'b'`s in the string (at indices 2, 6, 7)
- Adds 3 new subsequences
  Total: 2 + 3 = 5

**Step 4: Try adding `'b'` at the beginning**  
Add `'b'` at index 0: `"babdcdbc"`

- New `'b'` gets paired with the 1 `'a'` before it? Wait, there's no `'a'` before index 0!
- Actually, the new `'b'` at index 0 pairs with `'a'`s that come after it? No, for `"ab"`, `'a'` must come first
- So this adds 0 new subsequences
  Total: 2 + 0 = 2

**Step 5: The optimal placement**
We should add `'a'` at the very beginning to pair with ALL `'b'`s in the string. Or add `'b'` at the very end to pair with ALL `'a'`s. Let's check adding `'b'` at the end:
Add `'b'` at the end: `"abdcdbcb"`

- New `'b'` pairs with the 1 `'a'` that comes before it
- Adds 1 new subsequence  
  Total: 2 + 1 = 3

So adding `'a'` at the beginning (5 total) is better than adding `'b'` at the end (3 total).

## Brute Force Approach

A naive approach would be to try every possible insertion:

1. For each position in `text` (including before first and after last)
2. Try inserting `pattern[0]`
3. Try inserting `pattern[1]`
4. For each resulting string, count all subsequences equal to `pattern`
5. Return the maximum count

The subsequence counting for a string of length `n` takes O(n²) time if done naively (checking all pairs), or O(n) with a smarter count. But we have O(n) insertion positions × 2 characters × O(n) counting = O(n²) time.

For n up to 10⁵ (typical constraints), O(n²) is far too slow - that's up to 10¹⁰ operations!

```python
# Brute force - too slow for large inputs
def bruteForce(text, pattern):
    max_count = 0
    n = len(text)

    # Try all insertion positions (0 = before first char, n = after last char)
    for i in range(n + 1):
        # Try inserting pattern[0]
        new_text = text[:i] + pattern[0] + text[i:]
        count = 0
        # Count subsequences "pattern"
        # This O(n²) counting makes the whole solution O(n³)!
        for j in range(len(new_text)):
            if new_text[j] == pattern[0]:
                for k in range(j + 1, len(new_text)):
                    if new_text[k] == pattern[1]:
                        count += 1
        max_count = max(max_count, count)

        # Try inserting pattern[1]
        new_text = text[:i] + pattern[1] + text[i:]
        count = 0
        for j in range(len(new_text)):
            if new_text[j] == pattern[0]:
                for k in range(j + 1, len(new_text)):
                    if new_text[k] == pattern[1]:
                        count += 1
        max_count = max(max_count, count)

    return max_count
```

The brute force is O(n³) with naive counting or O(n²) with smarter counting - both unacceptable.

## Optimized Approach

The key insight is that we don't need to actually insert the character and recount! We can calculate how many NEW subsequences would be created by each possible insertion.

Let's define:

- `count_b_after[i]` = number of `pattern[1]` characters after position `i`
- `count_a_before[i]` = number of `pattern[0]` characters before position `i`

If we insert `pattern[0]` at position `i`:

- It will create new subsequences with every `pattern[1]` that comes AFTER position `i`
- New subsequences added = `count_b_after[i]`

If we insert `pattern[1]` at position `i`:

- It will create new subsequences with every `pattern[0]` that comes BEFORE position `i`
- New subsequences added = `count_a_before[i]`

We also need the base count - subsequences already in the original `text`. We can compute this while building our prefix/suffix counts.

The optimal solution is: `max(base_count + max(count_b_after), base_count + max(count_a_before))`

But wait - we should also consider inserting at the very beginning or very end! That's why our arrays need to handle indices 0 to n (inclusive).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumSubsequenceCount(text, pattern):
    """
    Returns the maximum number of times pattern appears as a subsequence
    after adding exactly one character (pattern[0] or pattern[1]) anywhere in text.
    """
    n = len(text)

    # count_b_after[i] = number of pattern[1] characters from position i to end
    # We need n+1 positions to handle insertion at the very end
    count_b_after = [0] * (n + 1)

    # Build count_b_after from right to left
    for i in range(n - 1, -1, -1):
        count_b_after[i] = count_b_after[i + 1]
        if text[i] == pattern[1]:
            count_b_after[i] += 1

    base_count = 0  # Subsequences in original text
    count_a_so_far = 0  # Number of pattern[0] seen so far

    # Calculate base count and prepare for insertion calculations
    for i in range(n):
        if text[i] == pattern[0]:
            # Each 'a' pairs with all 'b's that come after it
            base_count += count_b_after[i + 1]
            count_a_so_far += 1
        # Note: We don't count 'b's here since we already counted them
        # when we encountered their corresponding 'a's

    # Now consider adding one character
    # Option 1: Add pattern[0] somewhere
    # Best place to add pattern[0] is at the beginning to pair with ALL 'b's
    # Adding at position 0 gives count_b_after[0] new subsequences
    option1 = base_count + count_b_after[0]

    # Option 2: Add pattern[1] somewhere
    # Best place to add pattern[1] is at the end to pair with ALL 'a's
    # But we need to know how many 'a's are in the whole string
    # count_a_so_far now has the total count of pattern[0] in text
    option2 = base_count + count_a_so_far

    # Return the maximum of the two options
    return max(option1, option2)
```

```javascript
// Time: O(n) | Space: O(n)
function maximumSubsequenceCount(text, pattern) {
  const n = text.length;

  // countBAfter[i] = number of pattern[1] from position i to end
  const countBAfter = new Array(n + 1).fill(0);

  // Build countBAfter from right to left
  for (let i = n - 1; i >= 0; i--) {
    countBAfter[i] = countBAfter[i + 1];
    if (text[i] === pattern[1]) {
      countBAfter[i]++;
    }
  }

  let baseCount = 0; // Subsequences in original text
  let countASoFar = 0; // Number of pattern[0] seen so far

  // Calculate base count
  for (let i = 0; i < n; i++) {
    if (text[i] === pattern[0]) {
      // Each 'a' pairs with all 'b's after it
      baseCount += countBAfter[i + 1];
      countASoFar++;
    }
  }

  // Option 1: Add pattern[0] at beginning
  const option1 = baseCount + countBAfter[0];

  // Option 2: Add pattern[1] at end
  const option2 = baseCount + countASoFar;

  return Math.max(option1, option2);
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public long maximumSubsequenceCount(String text, String pattern) {
        int n = text.length();

        // countBAfter[i] = number of pattern.charAt(1) from i to end
        long[] countBAfter = new long[n + 1];

        // Build countBAfter from right to left
        for (int i = n - 1; i >= 0; i--) {
            countBAfter[i] = countBAfter[i + 1];
            if (text.charAt(i) == pattern.charAt(1)) {
                countBAfter[i]++;
            }
        }

        long baseCount = 0;  // Subsequences in original text
        long countASoFar = 0; // Number of pattern.charAt(0) seen

        // Calculate base count
        for (int i = 0; i < n; i++) {
            if (text.charAt(i) == pattern.charAt(0)) {
                // Each pattern[0] pairs with all pattern[1] after it
                baseCount += countBAfter[i + 1];
                countASoFar++;
            }
        }

        // Option 1: Add pattern[0] at beginning
        long option1 = baseCount + countBAfter[0];

        // Option 2: Add pattern[1] at end
        long option2 = baseCount + countASoFar;

        return Math.max(option1, option2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one right-to-left to build `count_b_after`, and one left-to-right to calculate the base count and count of `pattern[0]`.
- Each pass does O(1) work per character.
- Total: O(2n) = O(n)

**Space Complexity: O(n)**

- We need the `count_b_after` array of size n+1 to store counts of `pattern[1]` after each position.
- We could optimize to O(1) by calculating on the fly, but the O(n) solution is clearer and still efficient.

## Common Mistakes

1. **Forgetting that insertion can happen at the very beginning or end** - Many candidates only consider inserting between existing characters. Remember: we can insert before the first character (position 0) or after the last character (position n).

2. **Double-counting when pattern[0] == pattern[1]** - If both characters in the pattern are the same (e.g., `"aa"`), the logic changes! In this case, adding a character creates C(n+1, 2) subsequences where n is the total count of that character after insertion. The provided solution actually handles this correctly because when `pattern[0] == pattern[1]`, both options give the same result.

3. **Using int instead of long for large counts** - The result can be as large as ~n²/2 (when all characters match the pattern). For n up to 10⁵, this is ~5×10⁹, which exceeds 32-bit int range. Always use 64-bit integers (long in Java/C++, long long in C).

4. **Incorrectly calculating the base count** - A common error is to count pairs where both characters are the original text. Remember: for each `pattern[0]`, you need to count how many `pattern[1]` appear AFTER it, not the total count of `pattern[1]`.

## When You'll See This Pattern

This problem uses **prefix/suffix counting** - a technique where you precompute counts from left-to-right or right-to-left to answer queries quickly.

Similar problems:

1. **Product of Array Except Self (LeetCode 238)** - Uses prefix and suffix products to compute the answer without division.
2. **Trapping Rain Water (LeetCode 42)** - Uses prefix-max and suffix-max arrays to determine how much water can be trapped at each position.
3. **Maximum Subarray (LeetCode 53)** - While not exactly the same, it uses the idea of keeping running counts to find optimal solutions.

The core idea is: when you need to answer queries about "elements before" and "elements after" current position, precomputing prefix/suffix arrays lets you answer in O(1) time instead of O(n).

## Key Takeaways

1. **Think incrementally** - Instead of recomputing everything after each insertion, calculate how much the insertion adds. This is a common optimization pattern: "What changes when I make this modification?"

2. **Prefix/suffix arrays are powerful** - When you need to know "how many X are before/after position i", precompute it! This transforms O(n) queries into O(1) lookups.

3. **Consider extreme positions** - For optimization problems where you can add/remove elements, the optimal often lies at the boundaries (beginning or end). Always check these edge cases.

Related problems: [Longest Common Subsequence](/problem/longest-common-subsequence)
