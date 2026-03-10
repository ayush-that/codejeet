---
title: "How to Solve Bitwise AND of Numbers Range — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Bitwise AND of Numbers Range. Medium difficulty, 48.7% acceptance rate. Topics: Bit Manipulation."
date: "2027-05-07"
category: "dsa-patterns"
tags: ["bitwise-and-of-numbers-range", "bit-manipulation", "medium"]
---

# How to Solve Bitwise AND of Numbers Range

The problem asks us to compute the bitwise AND of all integers in a given range `[left, right]`. At first glance, this seems straightforward—just iterate through all numbers and compute the AND. However, with constraints up to 2³¹ - 1, the brute force approach becomes impractical. The key insight lies in recognizing that the AND operation will only preserve bits that remain `1` across _every_ number in the range, and any bit that flips to `0` at any point will remain `0` in the final result.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `left = 5` (binary `0101`) and `right = 7` (binary `0111`).

We need to compute `5 & 6 & 7`:

- 5: `0101`
- 6: `0110`
- 7: `0111`

Performing the AND operation step by step:

1. `5 & 6 = 0101 & 0110 = 0100` (4)
2. `4 & 7 = 0100 & 0111 = 0100` (4)

The result is `4` (binary `0100`).

Notice what happened: The rightmost bit (least significant bit) became `0` because when we moved from 5 to 6, that bit flipped from `1` to `0`. Once a bit becomes `0` in any number within the range, it stays `0` in the final AND result because `0 & anything = 0`.

Now let's look at a more revealing example: `left = 12` (binary `1100`) and `right = 15` (binary `1111`).

The numbers are: 12 (`1100`), 13 (`1101`), 14 (`1110`), 15 (`1111`)

If we compute the AND:

- The two leftmost bits (`11`) remain `1` across all numbers
- The two rightmost bits change across the range (from `00` to `11`), so they become `0` in the final result

Thus, the result is `1100` (12), which is exactly `left` with the changing bits zeroed out.

This observation leads us to the key insight: **The result is the common prefix of the binary representations of `left` and `right`, with all remaining bits set to `0`.**

## Brute Force Approach

The most straightforward solution is to iterate through all numbers from `left` to `right` and compute the cumulative AND:

<div class="code-group">

```python
# Time: O(n) where n = right - left | Space: O(1)
def rangeBitwiseAndBrute(left, right):
    result = left
    for num in range(left + 1, right + 1):
        result &= num
        # Early exit: if result becomes 0, we can stop
        if result == 0:
            break
    return result
```

```javascript
// Time: O(n) where n = right - left | Space: O(1)
function rangeBitwiseAndBrute(left, right) {
  let result = left;
  for (let num = left + 1; num <= right; num++) {
    result &= num;
    // Early exit: if result becomes 0, we can stop
    if (result === 0) break;
  }
  return result;
}
```

```java
// Time: O(n) where n = right - left | Space: O(1)
public int rangeBitwiseAndBrute(int left, int right) {
    int result = left;
    for (int num = left + 1; num <= right; num++) {
        result &= num;
        // Early exit: if result becomes 0, we can stop
        if (result == 0) break;
    }
    return result;
}
```

</div>

**Why this fails:** While this approach works for small ranges, it becomes extremely slow for large ranges. In the worst case where `left = 0` and `right = 2³¹ - 1`, we'd need to iterate through over 2 billion numbers! Even with the early exit optimization, many test cases will still time out. We need a solution that doesn't depend on the size of the range.

## Optimized Approach

The optimal solution relies on bit manipulation. Let's develop the intuition step by step:

1. **Observation:** When we AND a sequence of consecutive numbers, any bit that changes from `1` to `0` or `0` to `1` within the range will be `0` in the final result.

2. **Key Insight:** The only bits that remain `1` in the final result are those that are `1` in _every_ number in the range. This means we're looking for the **common prefix** of `left` and `right` in their binary representations.

3. **How to find the common prefix:** We can right-shift both `left` and `right` until they become equal. The number of shifts tells us how many bits from the right are different (and therefore become `0` in the result).

4. **Alternative approach:** Another way is to clear the rightmost `1` bit of `right` repeatedly while `right > left`. This works because any bit that needs to be cleared to make `right` smaller than or equal to `left` is part of the changing bits.

Let's trace through `left = 12` (`1100`) and `right = 15` (`1111`):

- Common prefix: `11`
- Different bits: last 2 bits
- Result: `1100` (common prefix followed by zeros)

The algorithm becomes:

1. Count how many times we need to right-shift until `left == right`
2. Left-shift back by the same count to restore the common prefix with zeros in the lower bits

## Optimal Solution

Here's the implementation using the shift-counting approach:

<div class="code-group">

```python
# Time: O(1) - maximum 32 shifts for 32-bit integers | Space: O(1)
def rangeBitwiseAnd(left, right):
    """
    Compute the bitwise AND of all numbers in the range [left, right].

    The key insight is that the result is the common prefix of left and right
    in binary representation, with all remaining bits set to 0.

    We find this by right-shifting both numbers until they're equal,
    then left-shifting back by the same amount.
    """
    shift_count = 0

    # Keep right-shifting until left and right are equal
    # This finds the common prefix
    while left < right:
        left >>= 1  # Right shift left by 1 bit
        right >>= 1  # Right shift right by 1 bit
        shift_count += 1  # Count how many bits we've shifted

    # Left shift back to restore the common prefix with zeros in lower bits
    return left << shift_count
```

```javascript
// Time: O(1) - maximum 32 shifts for 32-bit integers | Space: O(1)
function rangeBitwiseAnd(left, right) {
  /**
   * Compute the bitwise AND of all numbers in the range [left, right].
   *
   * The key insight is that the result is the common prefix of left and right
   * in binary representation, with all remaining bits set to 0.
   *
   * We find this by right-shifting both numbers until they're equal,
   * then left-shifting back by the same amount.
   */
  let shiftCount = 0;

  // Keep right-shifting until left and right are equal
  // This finds the common prefix
  while (left < right) {
    left >>= 1; // Right shift left by 1 bit
    right >>= 1; // Right shift right by 1 bit
    shiftCount++; // Count how many bits we've shifted
  }

  // Left shift back to restore the common prefix with zeros in lower bits
  return left << shiftCount;
}
```

```java
// Time: O(1) - maximum 32 shifts for 32-bit integers | Space: O(1)
public int rangeBitwiseAnd(int left, int right) {
    /**
     * Compute the bitwise AND of all numbers in the range [left, right].
     *
     * The key insight is that the result is the common prefix of left and right
     * in binary representation, with all remaining bits set to 0.
     *
     * We find this by right-shifting both numbers until they're equal,
     * then left-shifting back by the same amount.
     */
    int shiftCount = 0;

    // Keep right-shifting until left and right are equal
    // This finds the common prefix
    while (left < right) {
        left >>= 1;  // Right shift left by 1 bit
        right >>= 1;  // Right shift right by 1 bit
        shiftCount++;  // Count how many bits we've shifted
    }

    // Left shift back to restore the common prefix with zeros in lower bits
    return left << shiftCount;
}
```

</div>

**Alternative implementation using bit clearing:** Some prefer this approach as it's more intuitive for understanding why it works:

<div class="code-group">

```python
# Alternative approach: Clear rightmost 1 bits of right until right <= left
def rangeBitwiseAndAlt(left, right):
    """
    Alternative approach: Clear the rightmost 1-bit of 'right'
    until right <= left.

    This works because any bit we clear from 'right' to make it <= 'left'
    is a bit that changes within the range and should be 0 in the result.
    """
    while left < right:
        # Clear the rightmost 1-bit of right
        # This is a common bit manipulation trick: n & (n-1) clears the rightmost 1
        right = right & (right - 1)

    # When right <= left, the remaining bits are the common prefix
    return right
```

```javascript
// Alternative approach: Clear rightmost 1 bits of right until right <= left
function rangeBitwiseAndAlt(left, right) {
  /**
   * Alternative approach: Clear the rightmost 1-bit of 'right'
   * until right <= left.
   *
   * This works because any bit we clear from 'right' to make it <= 'left'
   * is a bit that changes within the range and should be 0 in the result.
   */
  while (left < right) {
    // Clear the rightmost 1-bit of right
    // This is a common bit manipulation trick: n & (n-1) clears the rightmost 1
    right = right & (right - 1);
  }

  // When right <= left, the remaining bits are the common prefix
  return right;
}
```

```java
// Alternative approach: Clear rightmost 1 bits of right until right <= left
public int rangeBitwiseAndAlt(int left, int right) {
    /**
     * Alternative approach: Clear the rightmost 1-bit of 'right'
     * until right <= left.
     *
     * This works because any bit we clear from 'right' to make it <= 'left'
     * is a bit that changes within the range and should be 0 in the result.
     */
    while (left < right) {
        // Clear the rightmost 1-bit of right
        // This is a common bit manipulation trick: n & (n-1) clears the rightmost 1
        right = right & (right - 1);
    }

    // When right <= left, the remaining bits are the common prefix
    return right;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) for both approaches

- In the shift-counting approach, we perform at most 32 shifts for 32-bit integers (or 64 for 64-bit)
- In the bit-clearing approach, we clear at most 32 bits (one per iteration)
- Both are constant time regardless of input size

**Space Complexity:** O(1)

- We only use a few integer variables regardless of input size
- No additional data structures are needed

## Common Mistakes

1. **Using brute force without considering constraints:** The most common mistake is implementing the straightforward iterative solution without realizing it will time out for large ranges. Always check constraints before coding!

2. **Incorrect handling of edge cases:**
   - When `left == right`, the result should be `left` (or `right`)
   - When `left == 0`, the result is always `0` (since `0 & anything = 0`)
   - Large ranges where `right - left` is huge but `left` and `right` share a long common prefix

3. **Off-by-one errors in loops:** When implementing the brute force approach, candidates sometimes write `for num in range(left, right)` instead of `range(left, right + 1)` in Python, or similar errors in other languages.

4. **Misunderstanding bit manipulation operators:** Confusing `>>` (arithmetic right shift) with `>>>` (logical right shift in Java/JavaScript). For this problem, arithmetic shift is correct since we're dealing with signed integers.

5. **Not explaining the intuition:** In an interview, just presenting the code without explaining why the common prefix approach works is a missed opportunity. Always walk through the reasoning with examples.

## When You'll See This Pattern

This "common prefix" pattern in bit manipulation appears in several other problems:

1. **Number of 1 Bits (LeetCode 191):** Uses `n & (n-1)` to clear the rightmost 1-bit, similar to our alternative approach.

2. **Power of Two (LeetCode 231):** Checks if a number is a power of two using `n & (n-1) == 0`.

3. **Single Number (LeetCode 136):** Uses XOR to find the unique element, another common bit manipulation pattern.

4. **Longest Nice Subarray (LeetCode 2401):** This problem also involves bitwise operations on ranges, though it's more complex. It requires maintaining a sliding window where all elements have pairwise AND equal to 0.

The core technique of finding common prefixes or analyzing how bits change across ranges is useful in many bit manipulation problems, especially those involving ranges or sequences of numbers.

## Key Takeaways

1. **Bitwise AND of a range equals the common prefix** of the binary representations of the endpoints, with all other bits set to 0. This is the fundamental insight that makes the O(1) solution possible.

2. **Two approaches to implement this:**
   - Shift counting: Right-shift until equal, then left-shift back
   - Bit clearing: Use `n & (n-1)` to clear rightmost 1-bits of the larger number until it's ≤ the smaller number

3. **Always consider constraints before implementing brute force.** When ranges can be up to 2³¹, O(n) solutions are unacceptable. Look for mathematical or bit manipulation insights to reduce complexity.

4. **Practice bit manipulation tricks** like `n & (n-1)` to clear the rightmost 1-bit, which appears in many problems beyond this one.

Related problems: [Longest Nice Subarray](/problem/longest-nice-subarray)
