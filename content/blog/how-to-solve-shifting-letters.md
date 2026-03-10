---
title: "How to Solve Shifting Letters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shifting Letters. Medium difficulty, 46.1% acceptance rate. Topics: Array, String, Prefix Sum."
date: "2026-11-27"
category: "dsa-patterns"
tags: ["shifting-letters", "array", "string", "prefix-sum", "medium"]
---

# How to Solve Shifting Letters

You're given a string `s` of lowercase letters and an integer array `shifts` of the same length. For each position `i`, you need to shift the letter `s[i]` by the sum of all `shifts[j]` where `j >= i`. The tricky part is that each shift operation wraps around the alphabet ('z' becomes 'a'), and the naive approach of calculating shifts for each position independently leads to O(n²) time complexity.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `s = "abc"`, `shifts = [3, 5, 9]`

**Step 1: Understanding what we need**
For each position `i`, we need to shift the letter by the sum of all shifts from index `i` to the end:

- Position 0: shift by `shifts[0] + shifts[1] + shifts[2] = 3 + 5 + 9 = 17`
- Position 1: shift by `shifts[1] + shifts[2] = 5 + 9 = 14`
- Position 2: shift by `shifts[2] = 9`

**Step 2: Applying the shifts with wrap-around**
We need to handle wrap-around: shifting 'z' by 1 gives 'a', shifting 'a' by 26 gives 'a' again (full circle).

Let's calculate:

- Position 0: 'a' shifted by 17 → 'a' → 'b' (1), 'c' (2), ... after 17 steps: 'r'
  - Quick math: ('a' = 1) + 17 = 18 → 18 % 26 = 18 → 'r'
- Position 1: 'b' shifted by 14 → 'b' (2) + 14 = 16 → 16 % 26 = 16 → 'p'
- Position 2: 'c' shifted by 9 → 'c' (3) + 9 = 12 → 12 % 26 = 12 → 'l'

**Result:** `"rpl"`

The key insight: we need cumulative sums from the end, which suggests using **prefix sums from the right**.

## Brute Force Approach

The most straightforward approach is to calculate the shift amount for each position independently by summing all shifts from that position to the end:

1. For each index `i` from 0 to n-1:
   - Calculate total shift for position `i` by summing `shifts[i] + shifts[i+1] + ... + shifts[n-1]`
   - Apply the shift to `s[i]` with modulo 26 to handle wrap-around
   - Build the result string

**Why this is inefficient:**

- For position 0, we sum n elements
- For position 1, we sum n-1 elements
- For position 2, we sum n-2 elements
- ...
- Total operations: n + (n-1) + (n-2) + ... + 1 = O(n²)

This becomes too slow for large inputs (n up to 10⁵ would require ~5×10⁹ operations).

## Optimized Approach

The key insight is that we can compute the cumulative shifts efficiently using **suffix sums** (or prefix sums from the right):

1. **Calculate suffix sums:** Start from the end and work backward, accumulating the total shift for each position.
   - Create an array `totalShifts` where `totalShifts[i]` = sum of all `shifts[j]` for `j >= i`
   - We can compute this in O(n) by noticing: `totalShifts[i] = shifts[i] + totalShifts[i+1]`

2. **Apply shifts with modulo:** For each position, shift the character by `totalShifts[i] % 26` to handle wrap-around.
   - Since shifting by 26 is a full circle (back to the same letter), we only need the remainder when divided by 26.

3. **Build the result:** Convert each shifted character back to a letter and construct the final string.

**Why this works:**

- We avoid redundant calculations by reusing the cumulative sum from the next position
- Each position's total shift is computed in O(1) once we have the suffix sums
- Total time complexity becomes O(n) instead of O(n²)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result string, O(1) extra space
def shiftingLetters(s: str, shifts: List[int]) -> str:
    """
    Shifts each character in s by the sum of all shifts from its position to the end.

    Approach:
    1. Calculate suffix sums of shifts (from right to left)
    2. For each character, apply the shift modulo 26 to handle wrap-around
    3. Build the result string

    Example:
    s = "abc", shifts = [3,5,9]
    suffix sums: [17,14,9]
    Result: "rpl"
    """
    n = len(s)
    result = [''] * n  # Pre-allocate list for efficiency

    # Step 1: Calculate suffix sums and apply shifts in one pass
    # We'll work from right to left to accumulate the suffix sum
    cumulative_shift = 0

    for i in range(n - 1, -1, -1):
        # Add current shift to the cumulative total
        cumulative_shift += shifts[i]

        # Get the current character's position in alphabet (0-25)
        # ord('a') gives 97, so ord(s[i]) - ord('a') gives 0 for 'a', 1 for 'b', etc.
        char_position = ord(s[i]) - ord('a')

        # Apply the shift modulo 26 to handle wrap-around
        # Modulo ensures we stay within 0-25 range
        new_position = (char_position + cumulative_shift) % 26

        # Convert back to character and store in result
        # Adding ord('a') converts 0→'a', 1→'b', etc.
        result[i] = chr(new_position + ord('a'))

    # Step 2: Join all characters to form the final string
    return ''.join(result)
```

```javascript
// Time: O(n) | Space: O(n) for the result string
/**
 * Shifts each character in s by the sum of all shifts from its position to the end.
 *
 * @param {string} s - The input string of lowercase letters
 * @param {number[]} shifts - Array of shift amounts
 * @return {string} - The shifted string
 */
function shiftingLetters(s, shifts) {
  const n = s.length;
  const result = new Array(n); // Pre-allocate array for efficiency

  // Step 1: Calculate suffix sums and apply shifts in one pass
  // We work from right to left to accumulate the suffix sum
  let cumulativeShift = 0;

  for (let i = n - 1; i >= 0; i--) {
    // Add current shift to the cumulative total
    cumulativeShift += shifts[i];

    // Get the current character's position in alphabet (0-25)
    // 'a'.charCodeAt(0) gives 97, so subtracting gives 0 for 'a', 1 for 'b', etc.
    const charPosition = s.charCodeAt(i) - "a".charCodeAt(0);

    // Apply the shift modulo 26 to handle wrap-around
    // Modulo ensures we stay within 0-25 range
    const newPosition = (charPosition + cumulativeShift) % 26;

    // Convert back to character and store in result
    // Adding 'a'.charCodeAt(0) converts 0→'a', 1→'b', etc.
    result[i] = String.fromCharCode(newPosition + "a".charCodeAt(0));
  }

  // Step 2: Join all characters to form the final string
  return result.join("");
}
```

```java
// Time: O(n) | Space: O(n) for the result string
class Solution {
    public String shiftingLetters(String s, int[] shifts) {
        int n = s.length();
        char[] result = new char[n];  // Use char array for efficiency

        // Step 1: Calculate suffix sums and apply shifts in one pass
        // We work from right to left to accumulate the suffix sum
        long cumulativeShift = 0;  // Use long to prevent integer overflow

        for (int i = n - 1; i >= 0; i--) {
            // Add current shift to the cumulative total
            cumulativeShift += shifts[i];

            // Get the current character's position in alphabet (0-25)
            // 'a' has ASCII value 97, so subtracting gives 0 for 'a', 1 for 'b', etc.
            int charPosition = s.charAt(i) - 'a';

            // Apply the shift modulo 26 to handle wrap-around
            // Modulo ensures we stay within 0-25 range
            // We need to mod cumulativeShift first to prevent overflow in addition
            int newPosition = (charPosition + (int)(cumulativeShift % 26)) % 26;

            // Convert back to character and store in result
            // Adding 'a' converts 0→'a', 1→'b', etc.
            result[i] = (char)('a' + newPosition);
        }

        // Step 2: Convert char array to String
        return new String(result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array from right to left
- Each iteration does O(1) work: addition, modulo, and character conversion
- Total: n iterations × O(1) = O(n)

**Space Complexity: O(n)**

- We need O(n) space for the result string
- The algorithm itself uses O(1) extra space (just a few variables)
- In languages like Python and Java, strings are immutable, so we need additional storage to build the result

**Why this is optimal:**

- We must at least read the entire input (Ω(n) time)
- We must produce the entire output (Ω(n) space for the result)
- Our algorithm achieves both lower bounds

## Common Mistakes

1. **Not using modulo 26 correctly:** Some candidates apply modulo only to the character position but forget that the shift amount itself can be reduced modulo 26. If `cumulativeShift` is very large (e.g., 10⁹), adding it to a character position could cause integer overflow in some languages.

2. **Wrong direction for cumulative sum:** A common error is to calculate prefix sums from left to right instead of suffix sums from right to left. Remember: for position `i`, we need the sum of all shifts from `i` to the end, not from the start to `i`.

3. **Forgetting about integer overflow:** In Java, if `shifts` contains large values and `n` is large, the cumulative sum could exceed `Integer.MAX_VALUE`. Always use `long` for the cumulative sum in Java to be safe.

4. **Inefficient string building:** In Python, repeatedly concatenating strings with `+=` in a loop creates a new string each time (O(n²) time). Always use list comprehension or `join()` for building strings character by character.

## When You'll See This Pattern

The **suffix sum/prefix sum from the right** pattern appears in problems where each element's value depends on all subsequent elements:

1. **Product of Array Except Self (LeetCode 238):** Instead of sums, you need products, but the concept of computing from both directions is similar.

2. **Running Sum of 1d Array (LeetCode 1480):** The simpler version where you only need prefix sums from the left.

3. **Range Sum Query - Immutable (LeetCode 303):** Uses prefix sums to answer range sum queries in O(1) time.

4. **Corporate Flight Bookings (LeetCode 1109):** Uses a difference array technique that's conceptually related to prefix sums.

The core idea is recognizing when a value depends on a cumulative property of subsequent (or preceding) elements, and optimizing the O(n²) brute force to O(n) by computing the cumulative property in one pass.

## Key Takeaways

1. **Suffix sums solve "sum of all elements to the right" problems:** When you need the sum of all elements from position i to the end, compute from right to left, accumulating as you go.

2. **Modulo arithmetic handles cyclic shifts:** For alphabet shifting problems, always use modulo 26 to handle wrap-around. Apply modulo to the shift amount before adding to avoid overflow.

3. **Right-to-left iteration is key for suffix operations:** When each element depends on all elements to its right, process the array from the end to the beginning.

4. **Pre-allocate result arrays for efficiency:** Building strings character by character is more efficient than repeated concatenation.

Related problems: [Replace All Digits with Characters](/problem/replace-all-digits-with-characters), [Shifting Letters II](/problem/shifting-letters-ii), [Lexicographically Smallest String After Substring Operation](/problem/lexicographically-smallest-string-after-substring-operation)
