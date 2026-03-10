---
title: "How to Solve Longest Binary Subsequence Less Than or Equal to K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Binary Subsequence Less Than or Equal to K. Medium difficulty, 52.8% acceptance rate. Topics: String, Dynamic Programming, Greedy, Memoization."
date: "2027-04-07"
category: "dsa-patterns"
tags:
  [
    "longest-binary-subsequence-less-than-or-equal-to-k",
    "string",
    "dynamic-programming",
    "greedy",
    "medium",
  ]
---

# How to Solve Longest Binary Subsequence Less Than or Equal to K

You're given a binary string `s` and an integer `k`, and need to find the longest subsequence that forms a binary number ≤ k. What makes this tricky is that subsequences aren't contiguous, and you need to balance between taking more characters (to maximize length) and keeping the numerical value small enough. The challenge lies in efficiently deciding which characters to include without trying all possible subsequences.

## Visual Walkthrough

Let's trace through `s = "1001010"`, `k = 5` (binary 101) step by step:

**Step 1:** Read from left to right. We want to maximize length while keeping value ≤ 5.

**Step 2:** First character '1' → value = 1 (≤5). Include it. Length=1, value=1.

**Step 3:** Second character '0' → if we include, value becomes 10 (binary) = 2 (decimal). 2 ≤ 5, so include. Length=2, value=2.

**Step 4:** Third character '0' → if we include, value becomes 100 (binary) = 4 (decimal). 4 ≤ 5, so include. Length=3, value=4.

**Step 5:** Fourth character '1' → if we include, value becomes 1001 (binary) = 9 (decimal). 9 > 5, so we CAN'T include this '1'. Skip it.

**Step 6:** Fifth character '0' → if we include, value becomes 10010 (binary) = 18 (decimal). 18 > 5. Wait, but we skipped the previous '1', so our current value is 100 (binary) = 4. Adding '0' gives 1000 (binary) = 8. 8 > 5, so skip this '0' too.

**Step 7:** Sixth character '1' → current value is 4 (100). Adding '1' gives 1001 (binary) = 9 > 5. Skip.

**Step 8:** Seventh character '0' → current value is 4. Adding '0' gives 1000 (binary) = 8 > 5. Skip.

Final subsequence: "100" (first three characters), length = 3.

But wait — is this optimal? What if we had made different choices? Let's think: The optimal answer is actually length 4 with subsequence "0010" (value = 2 ≤ 5). This shows our greedy approach of always including when possible doesn't work! We need a smarter strategy.

## Brute Force Approach

The brute force solution would generate all 2^n possible subsequences, convert each to decimal, check if ≤ k, and track the longest valid one. For each character, we either include it or don't, leading to exponential time complexity.

```python
def longestSubsequence_brute(s: str, k: int) -> int:
    n = len(s)
    max_len = 0

    # Try all 2^n subsequences
    for mask in range(1 << n):
        subsequence = ""
        for i in range(n):
            if mask & (1 << i):
                subsequence += s[i]

        # Check if valid
        if subsequence == "":
            value = 0
        else:
            value = int(subsequence, 2)

        if value <= k:
            max_len = max(max_len, len(subsequence))

    return max_len
```

**Why it's too slow:** For n=1000 (typical constraint), 2^1000 is astronomically large. We need O(n) or O(n log k) solution.

## Optimized Approach

The key insight: **We should take all '0's and be selective about '1's.**

Why?

1. '0's at any position don't increase the value much (just shift left, equivalent to multiplying by 2)
2. '1's can drastically increase the value (shift left + add 1)

**Step-by-step reasoning:**

1. Count all '0's in the string — we can always include them since leading zeros are allowed.
2. For '1's, we need to be careful. The value contributed by a '1' at position i (from right, 0-indexed) is 2^i.
3. We should take '1's from the **rightmost** positions first, since they contribute smaller values (2^0 = 1, 2^1 = 2, etc.).
4. Keep adding '1's from right to left until adding the next '1' would make the total value > k.
5. But there's a catch: If we have too many bits, even small values can overflow k. We need to check the bit length.

**Better approach:**

- Count all zeros (always safe to include)
- Process from right to left, adding '1's if the total value ≤ k
- Stop when adding another '1' would exceed k OR when we've processed enough bits that even the smallest possible value with that many bits would exceed k

**Why process right to left?** Because the rightmost bits have lowest positional value (2^0, 2^1, ...). By taking smallest-value '1's first, we maximize how many we can include.

## Optimal Solution

The optimal solution uses greedy selection from the right side. We maintain the current value and only add '1's if the new value would stay ≤ k.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def longestSubsequence(s: str, k: int) -> int:
    """
    Find longest subsequence of s that forms a binary number ≤ k.

    Approach:
    1. All '0's can always be included (they don't increase value much)
    2. For '1's, process from right to left (least significant bits first)
    3. Add '1's only if the total value remains ≤ k
    4. Stop when adding another '1' would exceed k
    """
    n = len(s)
    value = 0      # Current decimal value of our subsequence
    length = 0     # Length of subsequence built so far
    bit = 1        # Current bit value (2^0, 2^1, 2^2, ...)

    # Process from rightmost to leftmost character
    for i in range(n - 1, -1, -1):
        if s[i] == '0':
            # Always take '0's - they just shift existing bits left
            length += 1
        elif s[i] == '1':
            # Check if we can include this '1' without exceeding k
            # We need to check if value + bit <= k
            # But also need to consider that we might have future '0's
            # that will shift this bit left
            if value + bit <= k:
                # Include this '1'
                value += bit
                length += 1

        # Check if bit might overflow in next iteration
        # If bit > k, even a single '1' at this position would exceed k
        if bit <= k:
            bit <<= 1  # Multiply by 2 for next position (left shift)
        else:
            # If bit > k, we can't take any more '1's from left positions
            # But we should still count '0's if we encounter them
            bit = k + 1  # Ensure we don't take any more '1's

    return length
```

```javascript
// Time: O(n) | Space: O(1)
function longestSubsequence(s, k) {
  /**
   * Find longest subsequence of s that forms a binary number ≤ k.
   *
   * Approach:
   * 1. All '0's can always be included
   * 2. For '1's, process from right to left (least significant bits first)
   * 3. Add '1's only if total value remains ≤ k
   * 4. Stop when adding another '1' would exceed k
   */
  const n = s.length;
  let value = 0; // Current decimal value of subsequence
  let length = 0; // Length of subsequence built so far
  let bit = 1; // Current bit value (2^0, 2^1, 2^2, ...)

  // Process from rightmost to leftmost character
  for (let i = n - 1; i >= 0; i--) {
    if (s[i] === "0") {
      // Always take '0's - they just shift existing bits left
      length++;
    } else if (s[i] === "1") {
      // Check if we can include this '1' without exceeding k
      if (value + bit <= k) {
        // Include this '1'
        value += bit;
        length++;
      }
    }

    // Check if bit might overflow in next iteration
    // If bit > k, even a single '1' at this position would exceed k
    if (bit <= k) {
      bit <<= 1; // Multiply by 2 for next position
    } else {
      // Can't take any more '1's from left positions
      bit = k + 1; // Ensure we don't take any more '1's
    }
  }

  return length;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int longestSubsequence(String s, int k) {
        /**
         * Find longest subsequence of s that forms a binary number ≤ k.
         *
         * Approach:
         * 1. All '0's can always be included
         * 2. For '1's, process from right to left (least significant bits first)
         * 3. Add '1's only if total value remains ≤ k
         * 4. Stop when adding another '1' would exceed k
         */
        int n = s.length();
        long value = 0;      // Use long to avoid integer overflow
        int length = 0;      // Length of subsequence built so far
        long bit = 1;        // Current bit value (2^0, 2^1, 2^2, ...)

        // Process from rightmost to leftmost character
        for (int i = n - 1; i >= 0; i--) {
            if (s.charAt(i) == '0') {
                // Always take '0's - they just shift existing bits left
                length++;
            } else if (s.charAt(i) == '1') {
                // Check if we can include this '1' without exceeding k
                if (value + bit <= k) {
                    // Include this '1'
                    value += bit;
                    length++;
                }
            }

            // Check if bit might overflow in next iteration
            // If bit > k, even a single '1' at this position would exceed k
            if (bit <= k) {
                bit <<= 1;  // Multiply by 2 for next position
            } else {
                // Can't take any more '1's from left positions
                bit = k + 1; // Ensure we don't take any more '1's
            }
        }

        return length;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string from right to left
- Each character is processed exactly once
- All operations inside the loop are O(1)

**Space Complexity: O(1)**

- We only use a few variables (value, length, bit)
- No additional data structures that scale with input size
- The input string is given and not counted in our space usage

## Common Mistakes

1. **Processing left to right instead of right to left**: This causes you to take high-value '1's first, limiting how many total '1's you can include. Always process binary numbers from least significant bit (right) to most significant bit (left) when trying to minimize value.

2. **Not using long/int64 for bit calculations**: When k is up to 10^9 and you're shifting bits, you can easily overflow 32-bit integers. Always use 64-bit integers (long in Java/C++, long long in C) for bit value calculations.

3. **Forgetting to count '0's after you stop taking '1's**: Even if you can't take any more '1's (because bit > k), you should still count '0's you encounter. '0's don't increase the value, so they're always safe to include.

4. **Incorrectly checking value + bit ≤ k**: Some candidates check `value ≤ k` instead of `value + bit ≤ k`. Remember, you need to check if adding the NEW bit would exceed k, not just if the current value is ≤ k.

## When You'll See This Pattern

This greedy "take from least significant positions first" pattern appears in several optimization problems:

1. **Maximum Binary String After Change (LeetCode 1702)**: Similar binary string manipulation where you want to maximize value under constraints.

2. **Maximum Swap (LeetCode 670)**: While not exactly the same, it involves optimizing digit positions to maximize/minimize value.

3. **Monotone Increasing Digits (LeetCode 738)**: Another digit manipulation problem where you work from right to left to satisfy constraints.

The core pattern is: **When dealing with positional number systems (binary, decimal), process from least significant digit to most significant digit when trying to minimize value, and vice versa when trying to maximize value.**

## Key Takeaways

1. **For binary subsequence/value problems, always take all zeros** — they're "free" in terms of value increase but add to length.

2. **Process from right to left when minimizing value** — this lets you take as many small-value '1's as possible before hitting the limit.

3. **Use bit arithmetic carefully** — watch for integer overflow, and remember that each position leftwards doubles the value contribution of a '1'.

Remember: The empty subsequence has value 0, which is always ≤ k, so the answer is always at least 0 (though typically you'll get more by taking characters).

Related problems: [Maximum Binary String After Change](/problem/maximum-binary-string-after-change)
