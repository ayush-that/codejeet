---
title: "How to Solve Number of 1 Bits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of 1 Bits. Easy difficulty, 76.4% acceptance rate. Topics: Divide and Conquer, Bit Manipulation."
date: "2026-05-26"
category: "dsa-patterns"
tags: ["number-of-1-bits", "divide-and-conquer", "bit-manipulation", "easy"]
---

# How to Solve Number of 1 Bits

This problem asks you to count the number of `1` bits (set bits) in the binary representation of a given positive integer. While seemingly straightforward, it's a classic bit manipulation problem that tests your understanding of binary arithmetic and optimization techniques. The challenge lies in efficiently extracting and counting bits without converting the number to a string, which would be inefficient and misses the point of the exercise.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Suppose our input is `n = 11`.

**Binary representation:** 11 in binary is `1011` (8 + 2 + 1 = 11).

**Counting the 1s:** We need to count how many `1` bits appear in this binary representation:

- Bit position 0 (rightmost): `1` ✓
- Bit position 1: `1` ✓
- Bit position 2: `0`
- Bit position 3: `1` ✓

Total count = 3.

**Manual approach:** We could check each bit individually:

1. Is the rightmost bit 1? Yes → count = 1
2. Shift right to check next bit: `1011` → `101`
3. Is the new rightmost bit 1? Yes → count = 2
4. Shift right: `101` → `10`
5. Is the new rightmost bit 0? No change → count = 2
6. Shift right: `10` → `1`
7. Is the new rightmost bit 1? Yes → count = 3
8. Shift right: `1` → `0` (done)

This process of repeatedly checking the least significant bit and shifting right forms the basis of our solution.

## Brute Force Approach

The most intuitive approach is to convert the integer to its binary string representation and count the `'1'` characters. While this works, it's inefficient because:

1. String conversion has overhead
2. We're using high-level operations when bit-level operations would be more efficient
3. It doesn't demonstrate understanding of bit manipulation, which is the core skill being tested

Here's what that might look like:

```python
def hammingWeight(n):
    # Convert to binary string (removes '0b' prefix)
    binary_str = bin(n)[2:]
    # Count '1' characters
    return binary_str.count('1')
```

While this passes test cases for small numbers, it's not optimal and misses the learning objective of the problem. In an interview, you'd want to demonstrate you understand how to work with bits directly.

## Optimal Solution

The optimal approach uses bit manipulation to efficiently count set bits. We'll explore two efficient techniques:

### Method 1: Bit Shifting

Continuously check the least significant bit (LSB) and right-shift the number until it becomes zero.

### Method 2: Brian Kernighan's Algorithm

Use the trick `n & (n-1)` to clear the lowest set bit. This is more efficient as it only iterates once for each set bit rather than for every bit position.

<div class="code-group">

```python
# Time: O(k) where k is number of bits (32 for this problem) | Space: O(1)
def hammingWeight(n):
    """
    Count the number of 1 bits in the binary representation of n.

    Approach: Brian Kernighan's Algorithm
    Key insight: n & (n-1) clears the lowest set bit
    We count how many times we can clear bits until n becomes 0
    """
    count = 0

    # Continue until all bits are cleared
    while n:
        # Clear the lowest set bit
        # Example: n = 101100, n-1 = 101011
        # n & (n-1) = 101000 (cleared the rightmost 1)
        n &= n - 1

        # Increment count for each cleared bit
        count += 1

    return count

# Alternative: Bit shifting approach
# Time: O(k) where k is number of bits | Space: O(1)
def hammingWeight_shift(n):
    count = 0

    # Process all 32 bits (for 32-bit unsigned integer)
    while n:
        # Check if least significant bit is 1
        # n & 1 isolates the LSB
        count += n & 1

        # Right shift to process next bit
        # Using >>= 1 to shift all bits right by 1 position
        n >>= 1

    return count
```

```javascript
// Time: O(k) where k is number of bits (32 for this problem) | Space: O(1)
/**
 * Count the number of 1 bits in the binary representation of n.
 *
 * Approach: Brian Kernighan's Algorithm
 * Key insight: n & (n-1) clears the lowest set bit
 * We count how many times we can clear bits until n becomes 0
 */
function hammingWeight(n) {
  let count = 0;

  // Continue until all bits are cleared
  // Note: In JavaScript, we need to handle 32-bit unsigned integers
  while (n !== 0) {
    // Clear the lowest set bit
    // Example: n = 101100, n-1 = 101011
    // n & (n-1) = 101000 (cleared the rightmost 1)
    n &= n - 1;

    // Increment count for each cleared bit
    count++;

    // Convert to unsigned 32-bit integer
    // This ensures we're working with proper binary representation
    n >>>= 0;
  }

  return count;
}

// Alternative: Bit shifting approach
// Time: O(k) where k is number of bits | Space: O(1)
function hammingWeightShift(n) {
  let count = 0;

  // Process all 32 bits
  while (n !== 0) {
    // Check if least significant bit is 1
    // n & 1 isolates the LSB
    count += n & 1;

    // Right shift to process next bit
    // Using >>> for unsigned right shift
    n >>>= 1;
  }

  return count;
}
```

```java
// Time: O(k) where k is number of bits (32 for this problem) | Space: O(1)
public class Solution {
    /**
     * Count the number of 1 bits in the binary representation of n.
     *
     * Approach: Brian Kernighan's Algorithm
     * Key insight: n & (n-1) clears the lowest set bit
     * We count how many times we can clear bits until n becomes 0
     */
    public int hammingWeight(int n) {
        int count = 0;

        // Continue until all bits are cleared
        // Note: We need to handle n as unsigned integer
        while (n != 0) {
            // Clear the lowest set bit
            // Example: n = 101100, n-1 = 101011
            // n & (n-1) = 101000 (cleared the rightmost 1)
            n &= (n - 1);

            // Increment count for each cleared bit
            count++;
        }

        return count;
    }

    // Alternative: Bit shifting approach
    // Time: O(k) where k is number of bits | Space: O(1)
    public int hammingWeightShift(int n) {
        int count = 0;

        // Process all 32 bits
        while (n != 0) {
            // Check if least significant bit is 1
            // n & 1 isolates the LSB
            count += n & 1;

            // Right shift to process next bit
            // Using unsigned right shift >>>
            n >>>= 1;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Brian Kernighan's Algorithm:**

- **Time Complexity:** O(k) where k is the number of set bits (1s) in the binary representation. In the worst case (when all bits are 1, like `0xFFFFFFFF`), this is O(32) = O(1) for 32-bit integers.
- **Space Complexity:** O(1) as we only use a constant amount of extra space for the counter.

**Bit Shifting Approach:**

- **Time Complexity:** O(32) = O(1) since we always process all 32 bits for a 32-bit integer.
- **Space Complexity:** O(1) as we only use a constant amount of extra space.

**Why Brian Kernighan's is more efficient:** While both are O(1) for fixed-width integers, Brian Kernighan's algorithm only loops once per set bit, while the shifting approach always loops 32 times. For numbers with few set bits (like powers of 2), Brian Kernighan's algorithm is significantly faster.

## Common Mistakes

1. **Infinite loops with negative numbers:** When using right shift (`>>`) instead of unsigned right shift (`>>>` in Java/JS), negative numbers can cause infinite loops because the sign bit gets preserved. Always use unsigned right shift or convert to unsigned representation.

2. **Forgetting to handle 32-bit constraint:** The problem specifies a 32-bit unsigned integer. Some solutions might try to process more than 32 bits or fail with large numbers. Ensure your loop terminates after processing all bits.

3. **Using string conversion:** While `bin(n).count('1')` works in Python, it doesn't demonstrate understanding of bit manipulation and would be less efficient for repeated operations. Interviewers want to see you understand the bit-level operations.

4. **Off-by-one errors with bit masks:** When checking individual bits, remember that `1 << 0` gives you the mask for the least significant bit (position 0), not position 1. The loop should run from 0 to 31 inclusive for 32-bit integers.

## When You'll See This Pattern

This bit manipulation pattern appears in many problems:

1. **Power of Two (Easy):** A number is a power of two if it has exactly one set bit. You can use `n & (n-1) == 0` to check this.

2. **Counting Bits (Easy):** This problem asks for the number of set bits for all numbers from 0 to n. The optimal solution uses dynamic programming with bit manipulation: `bits[i] = bits[i >> 1] + (i & 1)`.

3. **Reverse Bits (Easy):** To reverse bits, you extract each bit from the original number and place it in the reversed position. This uses similar bit extraction techniques.

4. **Single Number (Easy):** Uses XOR bit manipulation to find the unique number in an array where every other number appears twice.

## Key Takeaways

1. **`n & (n-1)` clears the lowest set bit:** This is the most important trick to remember. It's useful for counting set bits, checking if a number is a power of two, and many other bit manipulation problems.

2. **Right shift vs. unsigned right shift:** When working with bits, be mindful of signed vs. unsigned operations. Use unsigned right shift (`>>>`) to avoid sign extension issues.

3. **Bit masks isolate specific bits:** The expression `n & 1` isolates the least significant bit. Similarly, `n & (1 << k)` checks if the k-th bit is set.

4. **For fixed-width integers, O(32) = O(1):** Don't be tricked into thinking O(n) where n is the number of bits is inefficient—for fixed-width integers, it's constant time.

Related problems: [Reverse Bits](/problem/reverse-bits), [Power of Two](/problem/power-of-two), [Counting Bits](/problem/counting-bits)
