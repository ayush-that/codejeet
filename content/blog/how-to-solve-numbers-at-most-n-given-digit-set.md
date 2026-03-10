---
title: "How to Solve Numbers At Most N Given Digit Set — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Numbers At Most N Given Digit Set. Hard difficulty, 44.6% acceptance rate. Topics: Array, Math, String, Binary Search, Dynamic Programming."
date: "2028-06-13"
category: "dsa-patterns"
tags: ["numbers-at-most-n-given-digit-set", "array", "math", "string", "hard"]
---

# How to Solve Numbers At Most N Given Digit Set

This problem asks: given a set of digits (like `['1','3','5']`) and an upper bound `n`, how many positive integers can we form using only those digits, where each integer must be ≤ `n`? The challenge is that `n` can be up to 10⁹, making brute force enumeration impossible. The tricky part is handling numbers with fewer digits than `n` (which are always valid) versus numbers with the same digit count (which require careful digit-by-digit comparison).

## Visual Walkthrough

Let's trace through `digits = ['1','3','5']`, `n = 541`.

**Step 1: Count numbers with fewer digits than `n`**

- `n` has 3 digits, so numbers with 1 or 2 digits are always valid.
- For 1-digit numbers: we can use any of the 3 digits → 3 numbers.
- For 2-digit numbers: we have 3 choices for the first digit × 3 choices for the second digit = 3² = 9 numbers.
- Total so far: 3 + 9 = 12 numbers.

**Step 2: Count 3-digit numbers (same length as `n`)**
We need to build numbers digit by digit, comparing with `n = 541`:

- **First digit position (hundreds place):**
  - Digits less than `5`: `'1'` and `'3'` → 2 choices.
  - For each such choice, the remaining two digits can be anything: 2 × 3² = 18 numbers.
  - Digit equal to `5`: we can't decide yet — we must check the next digit.

- **Second digit position (tens place), given first digit = `5`:**
  - Compare with `n`'s second digit `4`.
  - Digits less than `4`: only `'1'` and `'3'` → 2 choices.
  - For each, the last digit can be anything: 2 × 3¹ = 6 numbers.
  - Digit equal to `4`: not in our digit set, so stop here.

- **Third digit position (ones place), given first two digits = `54`:**
  - Compare with `n`'s third digit `1`.
  - Digits less than `1`: none in our set.
  - Digit equal to `1`: yes, it's in our set → 1 valid number (`541` itself).

**Step 3: Sum all valid numbers**

- Fewer-digit numbers: 12
- 3-digit numbers with first digit < 5: 18
- 3-digit numbers with first digit = 5 and second digit < 4: 6
- 3-digit number exactly equal to n: 1
- Total: 12 + 18 + 6 + 1 = **37**

## Brute Force Approach

A naive approach would generate all possible numbers using the given digits, check if each is ≤ `n`, and count them. For `k` digits and maximum length `L` (number of digits in `n`), there are `k + k² + ... + kᴸ` possible numbers. With `k` up to 9 and `L` up to 10 (since `n ≤ 10⁹`), this could be up to 9¹⁰ ≈ 3.5 billion numbers — far too many.

Even if we generate numbers in increasing order and stop when exceeding `n`, we'd still need to generate all numbers with fewer digits, which is exponential in `L`. This approach is impractical for the constraints.

## Optimized Approach

The key insight is to separate the count into two parts:

1. **Numbers with fewer digits than `n`**: These are always valid. For each length `ℓ` from 1 to `len(n)-1`, we have `k^ℓ` possibilities (where `k = len(digits)`).

2. **Numbers with exactly `len(n)` digits**: We process digit by digit from left to right:
   - For each position `i`, count digits strictly less than `n[i]`. For each such digit, the remaining positions can be any digit from our set → multiply by `k^(remaining positions)`.
   - If `n[i]` is in our digit set, we continue to the next digit (because we can match it exactly).
   - If `n[i]` is not in our set, we stop (no numbers starting with the matched prefix can be valid).
   - If we process all digits successfully, we add 1 for the number exactly equal to `n`.

This approach runs in `O(L)` time where `L` is the number of digits in `n`, which is at most 10.

## Optimal Solution

<div class="code-group">

```python
# Time: O(L) where L = len(str(n)) ≤ 10
# Space: O(L) for storing digits of n
def atMostNGivenDigitSet(self, digits, n):
    """
    Count numbers ≤ n formed using only given digits.

    Approach:
    1. Count all numbers with fewer digits than n (always valid)
    2. Count numbers with same digit count as n using digit-by-digit comparison
    """
    s = str(n)
    k = len(digits)  # Number of available digits
    L = len(s)       # Number of digits in n

    # Step 1: Count numbers with fewer digits than n
    # For each length ℓ from 1 to L-1, we have k^ℓ possibilities
    total = sum(k**i for i in range(1, L))

    # Step 2: Count numbers with exactly L digits
    # Process each digit position from left to right
    for i, ch in enumerate(s):
        # Count digits strictly less than current digit of n
        less_count = sum(1 for d in digits if d < ch)
        # For each such digit, remaining positions can be any digit
        total += less_count * (k ** (L - i - 1))

        # Check if current digit of n is in our digit set
        if ch not in digits:
            # No numbers starting with matched prefix can be valid
            return total

        # Otherwise, continue to next digit (we matched this digit exactly)

    # If we processed all digits, n itself is valid
    return total + 1
```

```javascript
// Time: O(L) where L = digits in n ≤ 10
// Space: O(L) for storing digits of n
function atMostNGivenDigitSet(digits, n) {
  // Convert n to string for digit-by-digit comparison
  const s = n.toString();
  const k = digits.length; // Number of available digits
  const L = s.length; // Number of digits in n

  // Step 1: Count numbers with fewer digits than n
  // For each length ℓ from 1 to L-1, we have k^ℓ possibilities
  let total = 0;
  for (let i = 1; i < L; i++) {
    total += Math.pow(k, i);
  }

  // Step 2: Count numbers with exactly L digits
  // Process each digit position from left to right
  for (let i = 0; i < L; i++) {
    const ch = s[i];

    // Count digits strictly less than current digit of n
    let lessCount = 0;
    for (const d of digits) {
      if (d < ch) lessCount++;
    }

    // For each such digit, remaining positions can be any digit
    total += lessCount * Math.pow(k, L - i - 1);

    // Check if current digit of n is in our digit set
    if (!digits.includes(ch)) {
      // No numbers starting with matched prefix can be valid
      return total;
    }

    // Otherwise, continue to next digit (we matched this digit exactly)
  }

  // If we processed all digits, n itself is valid
  return total + 1;
}
```

```java
// Time: O(L) where L = digits in n ≤ 10
// Space: O(L) for storing digits of n
class Solution {
    public int atMostNGivenDigitSet(String[] digits, int n) {
        // Convert n to string for digit-by-digit comparison
        String s = Integer.toString(n);
        int k = digits.length;  // Number of available digits
        int L = s.length();     // Number of digits in n

        // Step 1: Count numbers with fewer digits than n
        // For each length ℓ from 1 to L-1, we have k^ℓ possibilities
        int total = 0;
        for (int i = 1; i < L; i++) {
            total += (int)Math.pow(k, i);
        }

        // Step 2: Count numbers with exactly L digits
        // Process each digit position from left to right
        for (int i = 0; i < L; i++) {
            char ch = s.charAt(i);

            // Count digits strictly less than current digit of n
            int lessCount = 0;
            for (String d : digits) {
                if (d.charAt(0) < ch) {
                    lessCount++;
                }
            }

            // For each such digit, remaining positions can be any digit
            total += lessCount * (int)Math.pow(k, L - i - 1);

            // Check if current digit of n is in our digit set
            boolean found = false;
            for (String d : digits) {
                if (d.charAt(0) == ch) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                // No numbers starting with matched prefix can be valid
                return total;
            }

            // Otherwise, continue to next digit (we matched this digit exactly)
        }

        // If we processed all digits, n itself is valid
        return total + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(L) where L is the number of digits in `n` (at most 10). We iterate through digits of `n` once, and for each position, we check all available digits (at most 9). The geometric series for fewer-digit numbers also takes O(L) time.

**Space Complexity:** O(L) for storing the string representation of `n`. We use only a few additional variables, so the space is dominated by the string.

## Common Mistakes

1. **Forgetting to count numbers with fewer digits**: Candidates sometimes only handle numbers with the same digit count as `n`. Remember: any number with fewer digits is automatically ≤ `n`.

2. **Incorrect handling of digit equality**: When a digit of `n` equals one of our digits, we must continue to the next digit rather than counting it in the "less than" case. Failing to do this leads to double-counting.

3. **Off-by-one with exponent calculation**: When counting numbers with `ℓ` digits, it's `k^ℓ`, not `k^(ℓ-1)`. For the remaining positions after choosing a digit less than `n[i]`, there are `L-i-1` positions left.

4. **Not returning early when digit not found**: If `n[i]` is not in our digit set, we should return immediately after counting numbers with smaller digits at that position. Continuing would incorrectly count numbers that can't be formed.

## When You'll See This Pattern

This digit-by-digit counting pattern appears in problems where you need to count numbers satisfying certain digit constraints:

1. **Count Numbers with Unique Digits (LeetCode 357)**: Count numbers with no repeated digits. Similar digit-by-digit construction with constraints.

2. **Numbers With Repeated Digits (LeetCode 1012)**: Count numbers with at least one repeated digit. Often solved by counting the complement (numbers with all unique digits).

3. **Digit DP problems**: More complex digit constraints (like sum of digits, divisibility) use dynamic programming over digit positions with state tracking.

The core technique is breaking the problem by digit positions and using combinatorial counting for each decision point.

## Key Takeaways

1. **Break by digit length**: When dealing with digit constraints, separate numbers by their digit count. Numbers with fewer digits are often easier to count.

2. **Process digits left to right**: For numbers with the same digit count as the limit, process from most significant to least significant digit, making decisions at each position.

3. **Use combinatorial counting**: Instead of generating all numbers, count possibilities using multiplication principle (`k^ℓ` for `ℓ` positions with `k` choices each).

[Practice this problem on CodeJeet](/problem/numbers-at-most-n-given-digit-set)
