---
title: "How to Solve Find the Divisibility Array of a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Divisibility Array of a String. Medium difficulty, 35.7% acceptance rate. Topics: Array, Math, String."
date: "2028-12-14"
category: "dsa-patterns"
tags: ["find-the-divisibility-array-of-a-string", "array", "math", "string", "medium"]
---

# How to Solve "Find the Divisibility Array of a String"

This problem asks us to determine, for each prefix of a numeric string, whether that prefix's integer value is divisible by a given integer `m`. The challenge is that the string can be up to 10⁵ characters long, and converting each prefix to an integer would create numbers far too large to handle efficiently. The key insight is that we don't need the full integer value—we only need to track the remainder modulo `m` as we build the prefixes digit by digit.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `word = "998244353"` and `m = 3`.

We need to check each prefix:

- `"9"`: 9 % 3 = 0 → divisible → `div[0] = 1`
- `"99"`: 99 % 3 = 0 → divisible → `div[1] = 1`
- `"998"`: 998 % 3 = 2 → not divisible → `div[2] = 0`
- `"9982"`: 9982 % 3 = 1 → not divisible → `div[3] = 0`
- `"99824"`: 99824 % 3 = 2 → not divisible → `div[4] = 0`
- `"998244"`: 998244 % 3 = 0 → divisible → `div[5] = 1`
- `"9982443"`: 9982443 % 3 = 0 → divisible → `div[6] = 1`
- `"99824435"`: 99824435 % 3 = 2 → not divisible → `div[7] = 0`
- `"998244353"`: 998244353 % 3 = 2 → not divisible → `div[8] = 0`

The naive approach would convert each prefix string to an integer and check divisibility. But for a 10⁵-digit number, that integer would be astronomically large (up to 10¹⁰⁰⁰⁰⁰), far beyond what standard integer types can handle. We need a smarter approach that processes digits incrementally.

## Brute Force Approach

The most straightforward solution would be:

1. Initialize an empty result array
2. For each index `i` from 0 to n-1:
   - Extract substring `word[0:i+1]`
   - Convert it to an integer (using big integers if available)
   - Check if it's divisible by `m`
   - Append 1 or 0 to result

**Why this fails:**

- Converting substrings repeatedly is O(n²) time complexity
- The numbers become astronomically large for long strings
- Even with big integers, the operations become prohibitively slow
- For n = 10⁵, this approach would be far too slow

## Optimized Approach

The key insight comes from modular arithmetic. When we extend a prefix by one digit, we can compute the new remainder without ever dealing with the full large number.

If we have a prefix with remainder `r` and we append digit `d`, the new number is `old_number * 10 + d`. The new remainder is:

```
new_remainder = (r * 10 + d) % m
```

This works because:

- `(a + b) % m = (a % m + b % m) % m`
- `(a * b) % m = ((a % m) * (b % m)) % m`

So we can process the string left to right:

1. Start with remainder = 0
2. For each digit:
   - Convert char to integer digit
   - Update remainder = (remainder \* 10 + digit) % m
   - If remainder == 0, the current prefix is divisible by m
3. Append 1 or 0 to result based on remainder

This approach only requires O(1) space for the remainder and processes each digit exactly once.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of word | Space: O(n) for the result array
def divisibilityArray(word: str, m: int):
    """
    Returns an array where each element indicates whether the prefix
    ending at that index is divisible by m.

    The key insight: we don't need to store the entire number.
    We only need to track the remainder as we process digits left to right.
    For each new digit d, new_remainder = (old_remainder * 10 + d) % m
    """
    n = len(word)
    result = [0] * n  # Initialize result array with zeros
    remainder = 0  # Track remainder of current prefix modulo m

    for i in range(n):
        # Convert current character to integer digit
        digit = ord(word[i]) - ord('0')

        # Update remainder using modular arithmetic
        # (a * b + c) % m = ((a % m) * b + c) % m
        remainder = (remainder * 10 + digit) % m

        # If remainder is 0, current prefix is divisible by m
        result[i] = 1 if remainder == 0 else 0

    return result
```

```javascript
// Time: O(n) where n is length of word | Space: O(n) for the result array
function divisibilityArray(word, m) {
  /**
   * Returns an array where each element indicates whether the prefix
   * ending at that index is divisible by m.
   *
   * The key insight: we don't need to store the entire number.
   * We only need to track the remainder as we process digits left to right.
   * For each new digit d, new_remainder = (old_remainder * 10 + d) % m
   */
  const n = word.length;
  const result = new Array(n).fill(0); // Initialize result array with zeros
  let remainder = 0; // Track remainder of current prefix modulo m

  for (let i = 0; i < n; i++) {
    // Convert current character to integer digit
    const digit = word.charCodeAt(i) - "0".charCodeAt(0);

    // Update remainder using modular arithmetic
    // (a * b + c) % m = ((a % m) * b + c) % m
    // Use BigInt to prevent overflow for very large m
    remainder = (remainder * 10 + digit) % m;

    // If remainder is 0, current prefix is divisible by m
    result[i] = remainder === 0 ? 1 : 0;
  }

  return result;
}
```

```java
// Time: O(n) where n is length of word | Space: O(n) for the result array
class Solution {
    public int[] divisibilityArray(String word, int m) {
        /**
         * Returns an array where each element indicates whether the prefix
         * ending at that index is divisible by m.
         *
         * The key insight: we don't need to store the entire number.
         * We only need to track the remainder as we process digits left to right.
         * For each new digit d, new_remainder = (old_remainder * 10 + d) % m
         */
        int n = word.length();
        int[] result = new int[n];  // Initialize result array (defaults to 0)
        long remainder = 0;  // Use long to prevent overflow

        for (int i = 0; i < n; i++) {
            // Convert current character to integer digit
            int digit = word.charAt(i) - '0';

            // Update remainder using modular arithmetic
            // (a * b + c) % m = ((a % m) * b + c) % m
            // We use long to handle cases where remainder * 10 might overflow int
            remainder = (remainder * 10 + digit) % m;

            // If remainder is 0, current prefix is divisible by m
            result[i] = (remainder == 0) ? 1 : 0;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each character of the string exactly once
- Each operation (digit conversion, multiplication, addition, modulo) is O(1)
- Total operations scale linearly with string length

**Space Complexity:** O(n)

- We need to store the result array of length n
- Additional O(1) space for the remainder variable
- If we don't count the output array, space complexity is O(1)

## Common Mistakes

1. **Integer overflow:** When `m` is large (up to 10⁹), `remainder * 10` can exceed 32-bit integer limits. In Java, always use `long` for the remainder. In Python, integers are arbitrary precision, so overflow isn't an issue. In JavaScript, consider using `BigInt` for very large numbers.

2. **Incorrect digit conversion:** Using `int(word[i])` directly won't work—it gives the ASCII code, not the numeric value. Always subtract `'0'` or `'0'.charCodeAt(0)` to get the actual digit value.

3. **Forgetting to modulo at each step:** Some candidates try to accumulate the full number then take modulo at the end. This fails for long strings because the number becomes too large to store.

4. **Misunderstanding the problem requirements:** The problem asks about prefixes starting from index 0, not arbitrary substrings. Each `div[i]` corresponds to `word[0..i]`, not `word[i..j]`.

## When You'll See This Pattern

This problem uses **prefix remainders with modular arithmetic**, a pattern that appears in many string and array problems involving divisibility or remainder constraints:

1. **Subarray Sums Divisible by K (LeetCode 974):** Instead of tracking prefixes of a numeric string, we track prefix sums of an array. The core idea is the same: `(prefix_sum[j] - prefix_sum[i]) % k == 0` implies `prefix_sum[j] % k == prefix_sum[i] % k`.

2. **Make Sum Divisible by P (LeetCode 1590):** Find the smallest subarray to remove so the remaining sum is divisible by p. Uses prefix sums and remainder tracking.

3. **Continuous Subarray Sum (LeetCode 523):** Check if there's a subarray with sum multiple of k. Uses the same remainder tracking technique.

The pattern is: when dealing with divisibility of prefixes or subarrays, track remainders modulo the divisor rather than the full values.

## Key Takeaways

1. **Modular arithmetic enables incremental processing:** When checking divisibility of growing numbers, you only need to track the remainder modulo the divisor, not the full number. This transforms an impossible problem (handling astronomically large numbers) into a simple O(n) scan.

2. **Prefix problems often have O(n) solutions:** When a problem asks about all prefixes (or can be reframed as a prefix problem), look for a way to process elements sequentially while maintaining some state.

3. **Watch for overflow in remainder calculations:** In languages with fixed-width integers, multiplication in remainder updates can overflow. Use larger integer types or take modulo more frequently.

Related problems: [Subarray Sums Divisible by K](/problem/subarray-sums-divisible-by-k), [Make Sum Divisible by P](/problem/make-sum-divisible-by-p)
