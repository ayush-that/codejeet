---
title: "How to Solve Hamming Distance — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Hamming Distance. Easy difficulty, 76.6% acceptance rate. Topics: Bit Manipulation."
date: "2027-01-28"
category: "dsa-patterns"
tags: ["hamming-distance", "bit-manipulation", "easy"]
---

# How to Solve Hamming Distance

The Hamming distance between two integers is simply the count of bit positions where their binary representations differ. While this sounds straightforward, what makes this problem interesting is that it's a perfect introduction to bit manipulation techniques that appear in many harder problems. You need to understand how to extract and compare individual bits efficiently without converting to strings.

## Visual Walkthrough

Let's trace through an example with `x = 4` and `y = 14`:

1. First, convert to binary:
   - `4` in binary: `0100`
   - `14` in binary: `1110`

2. Compare bits position by position (from rightmost/least significant to leftmost):
   - Position 0 (rightmost): `0` vs `0` → same (distance = 0)
   - Position 1: `0` vs `1` → different (distance = 1)
   - Position 2: `1` vs `1` → same (distance = 1)
   - Position 3: `0` vs `1` → different (distance = 2)

3. The Hamming distance is 2.

The key insight is that we don't actually need to convert to binary strings. We can use bitwise operations to compare the bits directly.

## Brute Force Approach

A naive approach would be to convert both numbers to binary strings, pad them to equal length, then compare character by character:

```python
def hammingDistance_naive(x, y):
    # Convert to binary strings without '0b' prefix
    bin_x = bin(x)[2:]
    bin_y = bin(y)[2:]

    # Pad the shorter string with leading zeros
    max_len = max(len(bin_x), len(bin_y))
    bin_x = bin_x.zfill(max_len)
    bin_y = bin_y.zfill(max_len)

    # Count differences
    distance = 0
    for i in range(max_len):
        if bin_x[i] != bin_y[i]:
            distance += 1

    return distance
```

This approach works but has several inefficiencies:

1. String conversion and padding are computationally expensive
2. We're comparing characters instead of bits
3. The space complexity is O(n) where n is the number of bits

While this might pass for small inputs, it's not the elegant bit manipulation solution interviewers expect.

## Optimal Solution

The optimal solution uses XOR (exclusive OR) and bit counting. Here's the reasoning:

1. **XOR magic**: When we XOR two numbers (`x ^ y`), we get a number where each bit is:
   - `0` if the bits were the same
   - `1` if the bits were different

   This is perfect! The XOR result has 1s exactly where the bits differ.

2. **Count the 1s**: Now we just need to count how many 1s are in the XOR result. This is exactly the "Number of 1 Bits" problem (LeetCode 191).

3. **Efficient bit counting**: We can count 1s by repeatedly clearing the least significant 1 bit using `n & (n-1)` until the number becomes 0.

Here's the complete solution:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Since integers are fixed at 32 bits in many contexts, this is constant
def hammingDistance(x, y):
    # Step 1: XOR to find differing bits
    # XOR produces 1 where bits differ, 0 where they're the same
    xor_result = x ^ y

    # Step 2: Count the number of 1 bits in xor_result
    distance = 0

    # Continue until all bits are 0
    while xor_result:
        # n & (n-1) clears the least significant 1 bit
        # Each iteration removes one 1 bit
        xor_result = xor_result & (xor_result - 1)

        # Increment count for each 1 bit found
        distance += 1

    return distance
```

```javascript
// Time: O(1) | Space: O(1)
// JavaScript uses 32-bit signed integers for bitwise operations
function hammingDistance(x, y) {
  // Step 1: XOR to find differing bits
  // XOR produces 1 where bits differ, 0 where they're the same
  let xorResult = x ^ y;

  // Step 2: Count the number of 1 bits in xorResult
  let distance = 0;

  // Continue until all bits are 0
  while (xorResult) {
    // n & (n-1) clears the least significant 1 bit
    // Each iteration removes one 1 bit
    xorResult = xorResult & (xorResult - 1);

    // Increment count for each 1 bit found
    distance++;
  }

  return distance;
}
```

```java
// Time: O(1) | Space: O(1)
// Java integers are 32-bit, so operations are constant time
public int hammingDistance(int x, int y) {
    // Step 1: XOR to find differing bits
    // XOR produces 1 where bits differ, 0 where they're the same
    int xorResult = x ^ y;

    // Step 2: Count the number of 1 bits in xorResult
    int distance = 0;

    // Continue until all bits are 0
    while (xorResult != 0) {
        // n & (n-1) clears the least significant 1 bit
        // Each iteration removes one 1 bit
        xorResult = xorResult & (xorResult - 1);

        // Increment count for each 1 bit found
        distance++;
    }

    return distance;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The XOR operation takes constant time
- The while loop runs once for each 1 bit in the XOR result
- Since integers have a fixed number of bits (typically 32 or 64), the maximum number of iterations is constant
- In the worst case (all bits differ), we have 32 iterations for 32-bit integers

**Space Complexity: O(1)**

- We only use a few integer variables (xor_result and distance)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting that XOR gives us exactly what we need**: Some candidates try to extract and compare bits manually using right shifts and masks. While this works, XOR is cleaner and more efficient. Remember: XOR of two bits is 1 if they're different, 0 if they're the same.

2. **Incorrect bit counting**: Using a naive approach like shifting and checking each bit:

   ```python
   # Less efficient approach
   while xor_result:
       if xor_result & 1:
           distance += 1
       xor_result >>= 1
   ```

   This checks all 32 bits even if there are few 1s. The `n & (n-1)` trick is more efficient as it only iterates once per 1 bit.

3. **Not handling negative numbers correctly**: In languages like Java and JavaScript, bitwise operations work with signed integers. However, since we're just counting bits and the XOR operation works the same regardless of sign, this isn't usually an issue for this problem. But be aware that right shift (`>>`) is arithmetic (preserves sign) in some languages, while (`>>>`) is logical in JavaScript.

4. **Assuming unlimited bit length**: While Python integers can be arbitrarily large, in most contexts (and in other languages), integers have fixed width (32 or 64 bits). The solution still works, but the constant factor differs.

## When You'll See This Pattern

This XOR + bit counting pattern appears in many bit manipulation problems:

1. **Number of 1 Bits (LeetCode 191)**: The bit counting part (`n & (n-1)`) is exactly the same technique. This problem is essentially "Number of 1 Bits" applied to `x ^ y`.

2. **Single Number (LeetCode 136)**: Uses XOR to find the unique element in an array where every other element appears twice. XOR cancels out pairs.

3. **Total Hamming Distance (LeetCode 477)**: A medium problem that builds on this one. Instead of comparing two numbers, you compare all pairs in an array. The optimal solution counts bits position by position rather than pair by pair.

4. **Find the Difference (LeetCode 389)**: Uses XOR to find the one character that was added to a string.

The core insight is that XOR has these useful properties:

- `a ^ a = 0` (cancels identical values)
- `a ^ 0 = a` (identity)
- XOR is commutative and associative

## Key Takeaways

1. **XOR is your friend for finding differences**: When you need to find where two things differ at the bit level, XOR gives you exactly that information in a single operation.

2. **`n & (n-1)` efficiently clears the least significant 1 bit**: This trick appears in many bit manipulation problems for counting 1s or checking power-of-two status.

3. **Think in bits, not strings**: For bit manipulation problems, avoid converting to strings. Work directly with the bits using bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`).

Related problems: [Number of 1 Bits](/problem/number-of-1-bits), [Total Hamming Distance](/problem/total-hamming-distance)
