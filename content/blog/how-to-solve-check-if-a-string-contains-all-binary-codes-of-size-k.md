---
title: "How to Solve Check If a String Contains All Binary Codes of Size K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check If a String Contains All Binary Codes of Size K. Medium difficulty, 61.5% acceptance rate. Topics: Hash Table, String, Bit Manipulation, Rolling Hash, Hash Function."
date: "2028-04-17"
category: "dsa-patterns"
tags:
  [
    "check-if-a-string-contains-all-binary-codes-of-size-k",
    "hash-table",
    "string",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve "Check If a String Contains All Binary Codes of Size K"

This problem asks us to determine whether a binary string `s` contains every possible binary code (substring) of length `k` as a contiguous substring. For example, if `k = 2`, there are 4 possible binary codes: "00", "01", "10", and "11". The challenge is to efficiently check if all these codes appear in `s` without explicitly generating and searching for all 2^k possibilities.

What makes this problem interesting is the exponential growth of possibilities (2^k) — a brute force check would be impossible for larger `k`. The key insight is that we don't need to generate all codes; we just need to track which codes we've actually seen in `s`.

## Visual Walkthrough

Let's trace through an example: `s = "00110110"`, `k = 2`

**Step 1:** There are 2^k = 2^2 = 4 possible binary codes of length 2: {"00", "01", "10", "11"}

**Step 2:** Extract all length-2 substrings from `s`:

- Starting at index 0: "00"
- Starting at index 1: "01"
- Starting at index 2: "11"
- Starting at index 3: "10"
- Starting at index 4: "01" (duplicate)
- Starting at index 5: "11" (duplicate)
- Starting at index 6: "10" (duplicate)

**Step 3:** Collect unique substrings seen: {"00", "01", "11", "10"}

**Step 4:** Compare with all possible codes: We have all 4 codes, so return `true`.

Notice we only need to check if we've seen 4 unique codes — we don't need to know which specific ones are missing. Also, `s` must be at least `k + 2^k - 1` characters long to possibly contain all codes, but that's just a quick sanity check, not a guarantee.

## Brute Force Approach

A naive approach would:

1. Generate all 2^k possible binary strings of length `k`
2. For each generated string, check if it exists as a substring in `s`
3. Return `false` if any string is not found, `true` otherwise

This approach has two major problems:

1. **Time complexity is O(2^k \* n)** where n is the length of `s` — exponential in `k`
2. **Space complexity is O(2^k)** to store all possible codes

Even for moderate `k` (like k=20), 2^k is over 1 million, making this approach infeasible. The brute force also redundantly searches through `s` for each code instead of processing `s` once.

## Optimized Approach

The key insight is: **We don't need to generate all possible codes. We just need to know if we've seen 2^k unique codes in `s`.**

Here's the step-by-step reasoning:

1. **Unique codes tracking**: As we slide through `s`, extract each length-`k` substring and add it to a set. A set automatically handles duplicates.

2. **Early exit**: If at any point our set size reaches 2^k, we can return `true` immediately (though we typically check at the end).

3. **Efficient extraction**: Instead of creating new strings for each substring (which would be O(k) each), we can use a rolling approach:
   - Convert substrings to integers for faster comparison
   - Use bit manipulation to efficiently "slide" the window
   - This reduces substring extraction from O(k) to O(1) per step

4. **Boundary check**: There are only `n - k + 1` substrings of length `k` in a string of length `n`. If `n - k + 1 < 2^k`, we can immediately return `false` since there aren't enough substrings to contain all codes.

The optimal solution uses a hash set to track seen codes and processes the string in one pass.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of s
# Space: O(min(n, 2^k)) for the hash set
def hasAllCodes(s: str, k: int) -> bool:
    # Early exit: if string is too short to contain all 2^k codes
    # We need at least k + 2^k - 1 characters, but checking n - k + 1 < 2^k is sufficient
    if len(s) - k + 1 < 2**k:
        return False

    # Set to store unique binary codes we've seen
    seen_codes = set()

    # Slide a window of size k through the string
    for i in range(len(s) - k + 1):
        # Extract substring of length k starting at i
        current_code = s[i:i+k]
        # Add to set (duplicates are ignored automatically)
        seen_codes.add(current_code)

        # Early exit optimization: if we've already found all possible codes
        # This check is optional but can save time for some inputs
        if len(seen_codes) == 2**k:
            return True

    # Check if we've seen all 2^k possible codes
    return len(seen_codes) == 2**k
```

```javascript
// Time: O(n) where n is the length of s
// Space: O(min(n, 2^k)) for the hash set
function hasAllCodes(s, k) {
  // Early exit: if string is too short to contain all 2^k codes
  if (s.length - k + 1 < Math.pow(2, k)) {
    return false;
  }

  // Set to store unique binary codes we've seen
  const seenCodes = new Set();

  // Slide a window of size k through the string
  for (let i = 0; i <= s.length - k; i++) {
    // Extract substring of length k starting at i
    const currentCode = s.substring(i, i + k);
    // Add to set (duplicates are ignored automatically)
    seenCodes.add(currentCode);

    // Early exit optimization: if we've already found all possible codes
    if (seenCodes.size === Math.pow(2, k)) {
      return true;
    }
  }

  // Check if we've seen all 2^k possible codes
  return seenCodes.size === Math.pow(2, k);
}
```

```java
// Time: O(n) where n is the length of s
// Space: O(min(n, 2^k)) for the hash set
public boolean hasAllCodes(String s, int k) {
    // Early exit: if string is too short to contain all 2^k codes
    // Use long to avoid integer overflow for large k
    if (s.length() - k + 1 < (1L << k)) {
        return false;
    }

    // Set to store unique binary codes we've seen
    Set<String> seenCodes = new HashSet<>();

    // Slide a window of size k through the string
    for (int i = 0; i <= s.length() - k; i++) {
        // Extract substring of length k starting at i
        String currentCode = s.substring(i, i + k);
        // Add to set (duplicates are ignored automatically)
        seenCodes.add(currentCode);

        // Early exit optimization: if we've already found all possible codes
        if (seenCodes.size() == (1 << k)) {
            return true;
        }
    }

    // Check if we've seen all 2^k possible codes
    return seenCodes.size() == (1 << k);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, extracting `n - k + 1` substrings
- Each substring extraction is O(k) in the basic implementation, but modern languages optimize this
- Set insertion is O(1) on average
- Overall linear in the length of the input string

**Space Complexity: O(min(n, 2^k))**

- We store at most `2^k` unique codes in the set
- In practice, we store at most `n - k + 1` codes (the number of substrings in `s`)
- So the space is bounded by the smaller of these two values

## Common Mistakes

1. **Off-by-one errors in the loop range**: The loop should run from `0` to `n - k` inclusive (or `n - k + 1` iterations). A common mistake is `range(len(s) - k)` which misses the last substring when `i = len(s) - k`.

2. **Not checking the early exit condition**: For large `k`, `2^k` can be enormous. If `s` is too short to possibly contain all codes, we should return `false` immediately. Without this check, we might waste time or even cause memory issues.

3. **Using a list instead of a set**: Some candidates use a list to track seen codes, then check `len(list) == 2^k`. This is incorrect because lists allow duplicates, so you might have `2^k` items but they're not all unique. Always use a set for tracking unique items.

4. **Integer overflow when calculating 2^k**: In Java, `1 << k` can overflow for `k >= 31`. Use `1L << k` or `Math.pow(2, k)` for the comparison. In Python, integers are arbitrary precision, so this isn't an issue.

## When You'll See This Pattern

This problem uses the **sliding window with hash set** pattern, which appears in many string and array problems:

1. **Longest Substring Without Repeating Characters (LeetCode 3)**: Similar sliding window with a set to track characters in the current window.

2. **Find All Anagrams in a String (LeetCode 438)**: Uses a sliding window to track character frequencies, similar to tracking substrings.

3. **Repeated DNA Sequences (LeetCode 187)**: Almost identical pattern — find all 10-letter sequences that occur more than once in a DNA string.

The core idea is to maintain a window of fixed size `k`, process each window in O(1) time, and use a hash-based data structure to track what you've seen.

## Key Takeaways

1. **When checking for existence of all combinations, track what you've seen, not what's missing**: Instead of generating all 2^k possibilities and checking each, extract what actually appears and compare counts.

2. **Sets are perfect for tracking unique items**: Whenever you need to check "have I seen this before?" or "how many unique items are there?", reach for a hash set.

3. **Fixed-size sliding windows often have O(n) solutions**: When processing all substrings of fixed length `k`, you can usually do it in linear time by sliding a window and updating incrementally.

[Practice this problem on CodeJeet](/problem/check-if-a-string-contains-all-binary-codes-of-size-k)
