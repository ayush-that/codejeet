---
title: "How to Solve Minimum Array End — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Array End. Medium difficulty, 55.5% acceptance rate. Topics: Bit Manipulation."
date: "2027-04-14"
category: "dsa-patterns"
tags: ["minimum-array-end", "bit-manipulation", "medium"]
---

# How to Solve Minimum Array End

This problem asks us to construct a strictly increasing array of `n` positive integers where the bitwise AND of all elements equals `x`, and we need to return the smallest possible last element. The challenge lies in balancing two constraints: maintaining a strictly increasing sequence while preserving the bitwise AND result across all elements.

What makes this problem interesting is that bitwise AND is a "destructive" operation—once a bit is 0 in any element, it stays 0 in the final AND result. This means we need to ensure `x`'s 1-bits remain 1 in every element, while carefully adding extra bits to create `n` distinct increasing values.

## Visual Walkthrough

Let's trace through an example: `n = 3, x = 4` (binary `100`).

We need 3 numbers where:

1. All numbers have bit 2 set (since `x = 100₂` has bit 2 = 1)
2. Numbers are strictly increasing
3. The AND of all 3 numbers equals `100₂`

**Step 1: Start with the base number**
The smallest number that has all of `x`'s bits is `x` itself: `100₂` = 4

**Step 2: Add the next numbers**
We need 2 more numbers that are larger than 4 but still have bit 2 set. The simplest approach is to add numbers that have additional bits set in positions where `x` has 0s.

Let's try adding numbers with extra bits in the lowest positions:

- First number: `100₂` = 4
- Second number: `101₂` = 5 (adds bit 0)
- Third number: `110₂` = 6 (adds bit 1)

Check: `4 & 5 & 6 = 100₂ & 101₂ & 110₂ = 100₂ = 4` ✓
The sequence is strictly increasing: 4 < 5 < 6 ✓

But is this minimal? Let's check if we can do better. What if we try:

- 4 (`100₂`)
- 5 (`101₂`)
- 7 (`111₂`)

The last element would be 7, which is larger than 6. So our first attempt gave us 6 as the last element.

**Key insight**: We can think of each number as `x` plus some extra bits. To keep the last element minimal, we should add the smallest possible extra values to create `n` distinct numbers.

## Brute Force Approach

A naive approach would be to start from `x` and keep incrementing until we find `n` numbers where the AND equals `x`. For each candidate sequence, we'd check if all numbers have the required bits from `x` and are strictly increasing.

The brute force code might look like:

<div class="code-group">

```python
def minEnd(n, x):
    # Start from x
    current = x
    count = 1

    # Keep searching until we find n valid numbers
    while count < n:
        current += 1
        # Check if current number has all bits of x
        if (current & x) == x:
            count += 1

    return current
```

```javascript
function minEnd(n, x) {
  // Start from x
  let current = x;
  let count = 1;

  // Keep searching until we find n valid numbers
  while (count < n) {
    current++;
    // Check if current number has all bits of x
    if ((current & x) === x) {
      count++;
    }
  }

  return current;
}
```

```java
public long minEnd(int n, int x) {
    // Start from x
    long current = x;
    int count = 1;

    // Keep searching until we find n valid numbers
    while (count < n) {
        current++;
        // Check if current number has all bits of x
        if ((current & x) == x) {
            count++;
        }
    }

    return current;
}
```

</div>

**Why this fails**: This approach is far too slow. For example, if `x = 1` and `n = 10^5`, we might need to check millions of numbers. The time complexity would be O(n × 2^k) where k is the number of 0-bits in x, which is exponential in the worst case.

## Optimized Approach

The key insight is that we can construct the numbers by combining `x` with the binary representation of `(n-1)` in the positions where `x` has 0-bits.

**Reasoning step-by-step**:

1. **Bit preservation**: For the AND of all numbers to equal `x`, every 1-bit in `x` must remain 1 in every element. This means those bit positions are "locked" to 1.

2. **Flexible bits**: The positions where `x` has 0-bits are "flexible"—they can be 0 or 1 in individual elements, as long as the AND across all elements results in 0.

3. **Creating distinct numbers**: To create `n` distinct numbers, we need to vary the flexible bits. The smallest way to do this is to use the binary counting of `0` to `n-1` in the flexible bit positions.

4. **Construction formula**: Each number can be constructed as:
   - Start with `x` (preserves all required 1-bits)
   - For each flexible bit position (where `x` has 0), insert bits from the binary representation of `i` (where `i` ranges from 0 to `n-1`)

5. **Finding the last element**: Since we want the minimum last element, and we're constructing numbers in increasing order by counting up in the flexible bits, the last element corresponds to `i = n-1`.

**Example with `n = 3, x = 4` (100₂)**:

- `x` = `100₂` (bits: position 2 is 1, positions 1 and 0 are 0)
- Flexible bit positions: 1 and 0
- We need 3 numbers, so `i` ranges from 0 to 2:
  - `i = 0` (00₂): `100₂` = 4
  - `i = 1` (01₂): `101₂` = 5
  - `i = 2` (10₂): `110₂` = 6
- Last element is 6

## Optimal Solution

The implementation involves interleaving bits from `x` and `(n-1)`:

<div class="code-group">

```python
# Time: O(1) - constant time operations (max 60 bits for 64-bit integers)
# Space: O(1) - only a few variables used
def minEnd(n, x):
    # Convert to 0-based counting: we need n-1 numbers after the first
    m = n - 1

    result = 0
    bit_pos = 0  # Current bit position we're examining
    i = 0        # Current bit position in m

    # Process bits until we've handled all bits from both x and m
    while x > 0 or m > 0:
        # Get the current bit of x
        x_bit = x & 1

        if x_bit == 1:
            # If x has 1 at this position, we must set it to 1
            # This preserves the required bits for the AND operation
            result |= (1 << bit_pos)
        else:
            # If x has 0 at this position, we use a bit from m
            # This allows us to create distinct numbers
            m_bit = m & 1
            if m_bit == 1:
                result |= (1 << bit_pos)
            # Move to the next bit in m
            m >>= 1

        # Move to the next bit in x and next position in result
        x >>= 1
        bit_pos += 1

    # Handle remaining bits from m (if m has more bits than x had 0s)
    while m > 0:
        m_bit = m & 1
        if m_bit == 1:
            result |= (1 << bit_pos)
        m >>= 1
        bit_pos += 1

    return result
```

```javascript
// Time: O(1) - constant time operations (max 60 bits for 64-bit integers)
// Space: O(1) - only a few variables used
function minEnd(n, x) {
  // Convert to 0-based counting: we need n-1 numbers after the first
  let m = n - 1;

  let result = 0n; // Use BigInt to handle large numbers
  let bitPos = 0; // Current bit position we're examining
  let i = 0; // Current bit position in m

  // Convert to BigInt for consistent bit operations
  x = BigInt(x);
  m = BigInt(m);

  // Process bits until we've handled all bits from both x and m
  while (x > 0n || m > 0n) {
    // Get the current bit of x
    const xBit = x & 1n;

    if (xBit === 1n) {
      // If x has 1 at this position, we must set it to 1
      // This preserves the required bits for the AND operation
      result |= 1n << BigInt(bitPos);
    } else {
      // If x has 0 at this position, we use a bit from m
      // This allows us to create distinct numbers
      const mBit = m & 1n;
      if (mBit === 1n) {
        result |= 1n << BigInt(bitPos);
      }
      // Move to the next bit in m
      m >>= 1n;
    }

    // Move to the next bit in x and next position in result
    x >>= 1n;
    bitPos++;
  }

  // Handle remaining bits from m (if m has more bits than x had 0s)
  while (m > 0n) {
    const mBit = m & 1n;
    if (mBit === 1n) {
      result |= 1n << BigInt(bitPos);
    }
    m >>= 1n;
    bitPos++;
  }

  return Number(result);
}
```

```java
// Time: O(1) - constant time operations (max 60 bits for 64-bit integers)
// Space: O(1) - only a few variables used
public long minEnd(int n, int x) {
    // Convert to 0-based counting: we need n-1 numbers after the first
    long m = n - 1L;

    long result = 0L;
    int bitPos = 0;  // Current bit position we're examining

    // Process bits until we've handled all bits from both x and m
    while (x > 0 || m > 0) {
        // Get the current bit of x
        int xBit = x & 1;

        if (xBit == 1) {
            // If x has 1 at this position, we must set it to 1
            // This preserves the required bits for the AND operation
            result |= (1L << bitPos);
        } else {
            // If x has 0 at this position, we use a bit from m
            // This allows us to create distinct numbers
            long mBit = m & 1L;
            if (mBit == 1L) {
                result |= (1L << bitPos);
            }
            // Move to the next bit in m
            m >>= 1L;
        }

        // Move to the next bit in x and next position in result
        x >>= 1;
        bitPos++;
    }

    // Handle remaining bits from m (if m has more bits than x had 0s)
    while (m > 0) {
        long mBit = m & 1L;
        if (mBit == 1L) {
            result |= (1L << bitPos);
        }
        m >>= 1L;
        bitPos++;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(1)

- We process each bit of `x` and `(n-1)` exactly once
- Since integers have a fixed maximum number of bits (typically 32 or 64), this is constant time
- In practice, we process at most 60 bits for 64-bit integers

**Space Complexity**: O(1)

- We only use a few variables: `result`, `bitPos`, and temporary variables for bit extraction
- No additional data structures that scale with input size

## Common Mistakes

1. **Not using 64-bit integers**: The result can exceed 32-bit range for large `n`. Always use `long` in Java, `BigInt` in JavaScript, or ensure Python integers (which are arbitrary precision) are used correctly.

2. **Forgetting to handle remaining bits from `(n-1)`**: If `(n-1)` has more 1-bits than `x` has 0-bits, we need to continue processing. The second `while` loop in our solution handles this case.

3. **Incorrect bit interleaving**: The most subtle part is correctly mapping bits from `(n-1)` into the 0-bit positions of `x`. A good way to verify is to test with `x = 1` (binary `001`), where all bits except the LSB are flexible.

4. **Off-by-one with `n`**: Remember we need `n` numbers total, with the first being `x` itself. That's why we use `n-1` for counting in the flexible bits—we're creating `n-1` additional numbers after the first.

## When You'll See This Pattern

This bit interleaving pattern appears in several problems:

1. **Minimum OR After Operations (LeetCode 3097)**: Similar concept of preserving certain bits while minimizing others through bitwise operations.

2. **Construct Smallest Number From DI String (LeetCode 2375)**: While not bit-related, it shares the pattern of constructing a sequence with constraints, where you need to make optimal choices at each step.

3. **Bitwise AND of Numbers Range (LeetCode 201)**: Understanding how bits change across a range helps build intuition for problems like this one.

The core technique of separating "fixed" bits (that must maintain certain values) from "flexible" bits (that can vary to satisfy other constraints) is powerful for many bit manipulation problems.

## Key Takeaways

1. **Bit separation is key**: When dealing with bitwise constraints, identify which bits are fixed (must maintain specific values) and which are flexible (can vary to satisfy other requirements).

2. **Binary counting in flexible positions**: To create the smallest increasing sequence, use binary counting (0 to n-1) in the flexible bit positions. This ensures minimal values while creating the required number of distinct elements.

3. **Think in terms of bit positions, not values**: Instead of trying to find numbers through arithmetic, think about constructing them bit-by-bit. This shift in perspective is crucial for many bit manipulation problems.

[Practice this problem on CodeJeet](/problem/minimum-array-end)
