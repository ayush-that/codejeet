---
title: "How to Solve Count the Number of Powerful Integers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count the Number of Powerful Integers. Hard difficulty, 46.3% acceptance rate. Topics: Math, String, Dynamic Programming."
date: "2027-11-28"
category: "dsa-patterns"
tags: ["count-the-number-of-powerful-integers", "math", "string", "dynamic-programming", "hard"]
---

# How to Solve Count the Number of Powerful Integers

This problem asks us to count how many integers between `start` and `finish` (inclusive) are "powerful" — meaning they end with a given suffix string `s`, and every digit in the number is ≤ `limit`. The challenge comes from the constraints: `start` and `finish` can be up to 10¹⁵, making brute force iteration impossible. We need a clever counting approach that works with digit constraints.

What makes this problem interesting is that it combines:

1. **Digit DP concepts** (counting numbers with digit constraints)
2. **Suffix matching** (numbers must end with specific digits)
3. **Range counting** (count in [start, finish] rather than [0, N])

## Visual Walkthrough

Let's trace through an example: `start = 1`, `finish = 6000`, `limit = 5`, `s = "124"`

We need to count numbers between 1 and 6000 where:

1. The number ends with "124" (e.g., 124, 1124, 2124, etc.)
2. Every digit is ≤ 5

**Step 1: Understanding the suffix constraint**

- Any powerful number must end with "124"
- So numbers like 124, 5124, 55124 are valid if all digits ≤ 5
- Numbers like 624 or 1125 are invalid (wrong suffix)

**Step 2: Breaking down the counting**
Instead of checking every number from 1 to 6000 (too slow), we'll count:

1. How many powerful numbers ≤ 6000?
2. How many powerful numbers ≤ 0? (or ≤ start-1)
3. Subtract: count(6000) - count(0)

**Step 3: Counting numbers ≤ 6000 ending with "124"**
Let's think about the structure: `[prefix][124]`

- The suffix "124" is fixed (3 digits)
- The prefix can be 0 to 3 digits (for numbers up to 4 digits total)
- Every digit in the prefix must also be ≤ 5

Possible prefixes for numbers ≤ 6000:

- 0-digit prefix: just "124" (124 ≤ 6000 ✓)
- 1-digit prefix: d + "124" where d ≤ 5
  - "0124" = 124 (same as above)
  - "1124" = 1124 ✓
  - "2124" ✓, "3124" ✓, "4124" ✓, "5124" ✓
- 2-digit prefix: dd + "124" where each d ≤ 5
  - "00124" = 124 (already counted)
  - We need to be careful about leading zeros!
- 3-digit prefix: ddd + "124" where each d ≤ 5
  - But wait: 6000 has 4 digits, so 3-digit prefix + 3-digit suffix = 6 digits > 4 digits
  - Actually, we need to handle this carefully...

This manual counting gets messy quickly. We need a systematic approach!

## Brute Force Approach

The brute force solution would iterate through every number from `start` to `finish`, check if it ends with `s`, and verify all digits ≤ `limit`. Here's what that might look like:

```python
def countPowerfulIntegers(start, finish, limit, s):
    count = 0
    for x in range(start, finish + 1):
        # Check if x ends with s
        str_x = str(x)
        if not str_x.endswith(s):
            continue

        # Check if all digits ≤ limit
        valid = True
        for digit in str_x:
            if int(digit) > limit:
                valid = False
                break

        if valid:
            count += 1

    return count
```

**Why this fails:**

- `start` and `finish` can be up to 10¹⁵
- That's up to 1 quadrillion iterations — impossibly slow
- Even checking each number's digits takes O(log₁₀ n) time per number
- Total complexity: O((finish - start) \* log(finish)) — astronomical

We need an approach that doesn't iterate through every number.

## Optimized Approach

The key insight is to use **digit dynamic programming (digit DP)**. Instead of checking each number, we count how many numbers satisfy our constraints.

**Core idea:** Count powerful numbers ≤ N using:

1. **Suffix handling:** Any powerful number = `prefix + s` (concatenation)
2. **Digit constraints:** All digits in `prefix` must be ≤ `limit`
3. **Range constraint:** `prefix + s` must be ≤ N

**Step-by-step reasoning:**

1. **Transform the problem:** Instead of counting numbers in [start, finish], count numbers ≤ finish and subtract numbers ≤ (start-1).

2. **Handle the suffix:** For a number to end with `s`, it must have the form `prefix + s` (string concatenation). The prefix can be empty.

3. **Count valid prefixes:** We need to count how many prefixes satisfy:
   - All digits in prefix are ≤ limit
   - When concatenated with `s`, the result is ≤ N
   - The prefix can have leading zeros (e.g., "0" + "124" = "0124" = 124)

4. **Special cases:**
   - If `len(s) > len(str(N))`, no numbers can end with `s` and be ≤ N
   - If any digit in `s` > limit, no numbers can be powerful (since s itself contains invalid digits)

5. **Counting prefixes ≤ bound:**
   Let `bound = N_without_suffix` (remove last len(s) digits from N)
   We need to count numbers ≤ bound where all digits ≤ limit.
   This is a standard digit DP problem!

6. **Digit DP approach:**
   - Process digits from most significant to least
   - Keep track of whether we're still matching the bound exactly (tight constraint)
   - Count valid digit sequences

## Optimal Solution

Here's the complete solution using digit DP:

<div class="code-group">

```python
# Time: O(d) where d = number of digits in finish (max 16)
# Space: O(d) for recursion stack and memoization
class Solution:
    def numberOfPowerfulInt(self, start: int, finish: int, limit: int, s: str) -> int:
        # Helper function: count powerful numbers ≤ N
        def count_up_to(N: int) -> int:
            str_N = str(N)
            len_N = len(str_N)
            len_s = len(s)

            # If N has fewer digits than s, no number can end with s
            if len_N < len_s:
                return 0

            # Check if s itself has any digit > limit
            for ch in s:
                if int(ch) > limit:
                    return 0

            # Get the prefix bound: first (len_N - len_s) digits of N
            if len_N == len_s:
                prefix_bound = 0  # No prefix digits
            else:
                prefix_bound = int(str_N[:len_N - len_s])

            # Convert prefix bound to digit array for DP
            bound_digits = list(map(int, str(prefix_bound))) if prefix_bound > 0 else []

            # Memoization for digit DP
            from functools import lru_cache

            @lru_cache(None)
            def dp(pos: int, tight: bool) -> int:
                """
                Count valid prefixes of length 'pos' digits.
                pos: current position (0 = most significant digit)
                tight: whether prefix so far matches bound exactly
                """
                if pos == len(bound_digits):
                    # Reached end of prefix
                    return 1  # One valid prefix (the empty or complete prefix)

                max_digit = bound_digits[pos] if tight else limit
                count = 0

                for digit in range(max_digit + 1):
                    if digit > limit:
                        break
                    next_tight = tight and (digit == max_digit)
                    count += dp(pos + 1, next_tight)

                return count

            # Count prefixes ≤ prefix_bound
            prefix_count = dp(0, True)

            # Now check if the suffix part (s) is ≤ the last len_s digits of N
            suffix_N = str_N[-len_s:]
            if s > suffix_N:
                # If s > suffix part, the last valid prefix is one less
                # because prefix + s would exceed N
                prefix_count -= 1

            return max(prefix_count, 0)  # Ensure non-negative

        # Count in range [start, finish] = count(≤finish) - count(≤start-1)
        return count_up_to(finish) - count_up_to(start - 1)
```

```javascript
// Time: O(d) where d = number of digits in finish (max 16)
// Space: O(d) for recursion stack and memoization
var numberOfPowerfulInt = function (start, finish, limit, s) {
  // Helper function: count powerful numbers ≤ N
  const countUpTo = (N) => {
    const strN = N.toString();
    const lenN = strN.length;
    const lenS = s.length;

    // If N has fewer digits than s, no number can end with s
    if (lenN < lenS) return 0;

    // Check if s itself has any digit > limit
    for (let ch of s) {
      if (parseInt(ch) > limit) return 0;
    }

    // Get the prefix bound: first (lenN - lenS) digits of N
    let prefixBound;
    if (lenN === lenS) {
      prefixBound = 0; // No prefix digits
    } else {
      prefixBound = parseInt(strN.substring(0, lenN - lenS)) || 0;
    }

    // Convert prefix bound to digit array for DP
    const boundDigits = prefixBound > 0 ? prefixBound.toString().split("").map(Number) : [];

    // Memoization for digit DP
    const memo = new Map();

    const dp = (pos, tight) => {
      // Create memo key
      const key = `${pos},${tight}`;
      if (memo.has(key)) return memo.get(key);

      // Base case: processed all prefix digits
      if (pos === boundDigits.length) {
        memo.set(key, 1); // One valid prefix
        return 1;
      }

      const maxDigit = tight ? boundDigits[pos] : limit;
      let count = 0;

      for (let digit = 0; digit <= maxDigit; digit++) {
        if (digit > limit) break;
        const nextTight = tight && digit === maxDigit;
        count += dp(pos + 1, nextTight);
      }

      memo.set(key, count);
      return count;
    };

    // Count prefixes ≤ prefixBound
    let prefixCount = dp(0, true);

    // Check if s > last lenS digits of N
    const suffixN = strN.substring(lenN - lenS);
    if (s > suffixN) {
      // prefix + s would exceed N, so subtract last prefix
      prefixCount--;
    }

    return Math.max(prefixCount, 0); // Ensure non-negative
  };

  // Count in range [start, finish]
  return countUpTo(finish) - countUpTo(start - 1);
};
```

```java
// Time: O(d) where d = number of digits in finish (max 16)
// Space: O(d) for recursion stack and memoization
class Solution {
    public long numberOfPowerfulInt(long start, long finish, int limit, String s) {
        return countUpTo(finish, limit, s) - countUpTo(start - 1, limit, s);
    }

    private long countUpTo(long N, int limit, String s) {
        String strN = Long.toString(N);
        int lenN = strN.length();
        int lenS = s.length();

        // If N has fewer digits than s, no number can end with s
        if (lenN < lenS) return 0;

        // Check if s itself has any digit > limit
        for (char ch : s.toCharArray()) {
            if (ch - '0' > limit) return 0;
        }

        // Get the prefix bound: first (lenN - lenS) digits of N
        long prefixBound;
        if (lenN == lenS) {
            prefixBound = 0;  // No prefix digits
        } else {
            prefixBound = Long.parseLong(strN.substring(0, lenN - lenS));
        }

        // Convert prefix bound to digit array for DP
        String boundStr = prefixBound > 0 ? Long.toString(prefixBound) : "";
        int[] boundDigits = new int[boundStr.length()];
        for (int i = 0; i < boundDigits.length; i++) {
            boundDigits[i] = boundStr.charAt(i) - '0';
        }

        // Memoization for digit DP
        Long[][] memo = new Long[boundDigits.length + 1][2];

        // DP function: count valid prefixes
        long prefixCount = dp(0, 1, boundDigits, limit, memo);

        // Check if s > last lenS digits of N
        String suffixN = strN.substring(lenN - lenS);
        if (s.compareTo(suffixN) > 0) {
            // prefix + s would exceed N, so subtract last prefix
            prefixCount--;
        }

        return Math.max(prefixCount, 0);  // Ensure non-negative
    }

    private long dp(int pos, int tight, int[] boundDigits, int limit, Long[][] memo) {
        // Base case: processed all prefix digits
        if (pos == boundDigits.length) {
            return 1;  // One valid prefix
        }

        if (memo[pos][tight] != null) {
            return memo[pos][tight];
        }

        int maxDigit = (tight == 1) ? boundDigits[pos] : limit;
        long count = 0;

        for (int digit = 0; digit <= maxDigit; digit++) {
            if (digit > limit) break;
            int nextTight = (tight == 1 && digit == maxDigit) ? 1 : 0;
            count += dp(pos + 1, nextTight, boundDigits, limit, memo);
        }

        memo[pos][tight] = count;
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(d)**

- `d` = number of digits in `finish` (max 16 since finish ≤ 10¹⁵)
- We perform digit DP twice: once for `finish`, once for `start-1`
- Each DP explores at most `d × 2` states (position × tight flag)
- Each state processes at most `limit + 1` digits (but limit ≤ 9)
- Total: O(2 × d × 10) = O(d)

**Space Complexity: O(d)**

- Recursion stack depth: O(d)
- Memoization table: O(d × 2) = O(d)
- Auxiliary arrays: O(d) for digit arrays

This is extremely efficient compared to brute force!

## Common Mistakes

1. **Not checking if `s` itself has digits > limit**
   - If any digit in `s` exceeds `limit`, no powerful numbers exist
   - Example: `limit = 3`, `s = "45"` → impossible since '4' and '5' > 3
   - **Fix:** Check all digits in `s` before counting

2. **Off-by-one errors with the suffix comparison**
   - After counting prefixes ≤ bound, need to check if `prefix + s ≤ N`
   - If `s > last_digits_of_N`, the last counted prefix is invalid
   - **Fix:** Compare `s` with the suffix part of `N` and adjust count

3. **Incorrect handling of leading zeros in prefixes**
   - Prefix "0" + "124" = "0124" = 124 (valid)
   - Prefix "00" + "124" = "00124" = 124 (same number!)
   - Wait — actually, we should NOT count duplicates. Our DP correctly handles this by counting each prefix once, regardless of leading zeros.

4. **Forgetting that `start` can be 0 or 1**
   - The problem says "positive integer", so 0 is not included
   - But `start` can be 0 in the input
   - **Fix:** Handle `start-1` carefully when `start = 0`

## When You'll See This Pattern

This problem combines several important patterns:

1. **Digit DP / Counting with Digit Constraints**
   - Similar to [Numbers With Repeated Digits](/problem/numbers-with-repeated-digits) (Hard)
   - Both count numbers with specific digit properties
   - Both use the "tight" flag to track bound matching

2. **Range Counting via Prefix Subtraction**
   - Common pattern: `count(a, b) = count(≤b) - count(≤a-1)`
   - Used in many counting problems to avoid double-counting
   - Similar to prefix sums in array problems

3. **Suffix/Substring Matching in Numbers**
   - Similar to checking if a number contains specific digits
   - Related to string matching problems applied to numerical ranges

## Key Takeaways

1. **Digit DP is powerful for counting problems with digit constraints**
   - When you need to count numbers with specific digit properties in a range
   - Key technique: process digits MSB to LSB, track "tight" constraint
   - Memoization reduces exponential search to linear

2. **Decompose complex constraints into simpler parts**
   - Powerful number = (valid prefix) + (fixed suffix)
   - Range constraint = count(≤finish) - count(≤start-1)
   - Breaking problems into independent subproblems makes them tractable

3. **Always check edge cases with bounds and special values**
   - What if `s` is longer than the number?
   - What if `s` itself violates constraints?
   - What if `start = 0` or `start = 1`?
   - Testing these prevents wrong answers on hidden test cases

Related problems: [Powerful Integers](/problem/powerful-integers), [Numbers With Repeated Digits](/problem/numbers-with-repeated-digits)
