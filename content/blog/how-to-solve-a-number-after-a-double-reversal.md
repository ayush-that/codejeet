---
title: "How to Solve A Number After a Double Reversal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode A Number After a Double Reversal. Easy difficulty, 82.0% acceptance rate. Topics: Math."
date: "2026-09-04"
category: "dsa-patterns"
tags: ["a-number-after-a-double-reversal", "math", "easy"]
---

# How to Solve "A Number After a Double Reversal"

This problem asks: given an integer `num`, reverse its digits to get `reversed1`, then reverse `reversed1` to get `reversed2`. Return `true` if `reversed2` equals the original `num`, otherwise `false`. The tricky part is understanding how trailing zeros behave during reversal—they get dropped when the number is reversed, which affects the double reversal result.

## Visual Walkthrough

Let's trace through two examples to build intuition:

**Example 1: num = 526**

- Reverse 526 → digits: 6, 2, 5 → reversed1 = 625
- Reverse 625 → digits: 5, 2, 6 → reversed2 = 526
- 526 == 526 → return true

**Example 2: num = 1800**

- Reverse 1800 → digits: 0, 0, 8, 1 → but leading zeros are dropped! So reversed1 = 81
- Reverse 81 → digits: 1, 8 → reversed2 = 18
- 1800 ≠ 18 → return false

The key insight: trailing zeros in the original number become leading zeros when reversed, and leading zeros are discarded. So any number with trailing zeros will change after double reversal unless those zeros are in the middle of the number.

## Brute Force Approach

The brute force approach follows the problem statement literally:

1. Write a helper function to reverse an integer
2. Call it twice on the input
3. Compare the final result with the original

While this approach works, it's more complex than needed. The reversal operation requires careful handling of negative numbers and zeros. A naive implementation might incorrectly handle edge cases like `num = 0` or `num = -120`.

However, the real issue isn't performance—the brute force has the same time complexity as the optimal solution. The problem is that implementing integer reversal correctly requires careful thinking about overflow (though not in this problem since we're guaranteed valid 32-bit integers) and zero handling.

## Optimal Solution

Instead of actually performing the double reversal, we can reason mathematically about when `num == reversed(reversed(num))`.

**Observation**: The double reversal equals the original number if and only if the original number has no trailing zeros. Why? Because:

- Trailing zeros become leading zeros when reversed
- Leading zeros are discarded
- So trailing zeros get "lost" during the first reversal

The only exception is `num = 0`, which remains 0 after double reversal.

Thus, the solution reduces to checking: `num == 0 OR num % 10 != 0`

Let's implement this with detailed comments:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isSameAfterReversals(num: int) -> bool:
    """
    Returns True if num equals its double reversal, False otherwise.

    Key insight: A number changes after double reversal only if it has
    trailing zeros (except for the number 0 itself).

    Examples:
    - 526 → 625 → 526 (same, no trailing zeros)
    - 1800 → 81 → 18 (different, has trailing zeros)
    - 0 → 0 → 0 (same, special case)
    """
    # Case 1: num is 0 → always same after double reversal
    if num == 0:
        return True

    # Case 2: num has trailing zeros → last digit is 0
    # When reversed, trailing zeros become leading zeros and get dropped
    # So the double reversal won't equal the original
    if num % 10 == 0:
        return False

    # Case 3: num has no trailing zeros → double reversal equals original
    return True
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Returns true if num equals its double reversal, false otherwise.
 *
 * Key insight: A number changes after double reversal only if it has
 * trailing zeros (except for the number 0 itself).
 *
 * Examples:
 * - 526 → 625 → 526 (same, no trailing zeros)
 * - 1800 → 81 → 18 (different, has trailing zeros)
 * - 0 → 0 → 0 (same, special case)
 */
function isSameAfterReversals(num) {
  // Case 1: num is 0 → always same after double reversal
  if (num === 0) {
    return true;
  }

  // Case 2: num has trailing zeros → last digit is 0
  // When reversed, trailing zeros become leading zeros and get dropped
  // So the double reversal won't equal the original
  if (num % 10 === 0) {
    return false;
  }

  // Case 3: num has no trailing zeros → double reversal equals original
  return true;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Returns true if num equals its double reversal, false otherwise.
     *
     * Key insight: A number changes after double reversal only if it has
     * trailing zeros (except for the number 0 itself).
     *
     * Examples:
     * - 526 → 625 → 526 (same, no trailing zeros)
     * - 1800 → 81 → 18 (different, has trailing zeros)
     * - 0 → 0 → 0 (same, special case)
     */
    public boolean isSameAfterReversals(int num) {
        // Case 1: num is 0 → always same after double reversal
        if (num == 0) {
            return true;
        }

        // Case 2: num has trailing zeros → last digit is 0
        // When reversed, trailing zeros become leading zeros and get dropped
        // So the double reversal won't equal the original
        if (num % 10 == 0) {
            return false;
        }

        // Case 3: num has no trailing zeros → double reversal equals original
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform at most two arithmetic operations (modulo and comparison)
- No loops or recursion, constant time regardless of input size

**Space Complexity: O(1)**

- We use only a few variables (constant space)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the special case of 0**: Candidates often check `num % 10 == 0` and return `false` without handling `num = 0` separately. Since 0 % 10 = 0, this would incorrectly return `false` for `num = 0`.

2. **Implementing actual reversal unnecessarily**: Some candidates jump straight to writing a reversal function without realizing the mathematical insight. While this gets the correct answer, it's more code with more potential bugs (handling negatives, overflow, etc.).

3. **Misunderstanding trailing vs. leading zeros**: Candidates might think "any zero in the number" rather than specifically "trailing zeros." For example, 101 has a zero but it's not trailing, so double reversal preserves it.

4. **Not testing edge cases**: Failing to test with:
   - `num = 0` (should return true)
   - `num = 10, 100, 1000` (should return false)
   - `num = 101, 1101` (should return true—zeros aren't trailing)

## When You'll See This Pattern

This problem teaches **mathematical simplification**—reducing an operation to a simple property check. Instead of performing the actual operations, we analyze their mathematical properties to find a simpler condition.

Similar problems include:

1. **Reverse Integer (LeetCode 7)**: Also involves digit reversal but adds overflow constraints. The pattern of extracting digits with modulo and building the reversed number is similar to what you'd implement in the brute force approach here.

2. **Palindrome Number (LeetCode 9)**: Checks if a number reads the same forwards and backwards. Like our problem, it involves reasoning about digit positions and can be solved by reversing half the digits.

3. **Reverse Bits (LeetCode 190)**: Reverses the bits of a 32-bit unsigned integer. The bit manipulation techniques (shifting, masking) are analogous to digit manipulation in base 10.

## Key Takeaways

1. **Look for mathematical properties before implementing operations**: Many problems that ask "check if property P holds after operation O" can be simplified by analyzing what O actually does mathematically.

2. **Trailing zeros matter in digit manipulation**: When working with digit representations, remember that leading zeros are typically discarded, which means trailing zeros in the original can disappear.

3. **Always handle edge cases early**: Special values like 0 often break simple rules. Check for them first to avoid incorrect logic.

Related problems: [Reverse Integer](/problem/reverse-integer), [Reverse Bits](/problem/reverse-bits)
