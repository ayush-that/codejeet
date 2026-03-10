---
title: "How to Solve Binary Number with Alternating Bits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Number with Alternating Bits. Easy difficulty, 69.8% acceptance rate. Topics: Bit Manipulation."
date: "2028-01-17"
category: "dsa-patterns"
tags: ["binary-number-with-alternating-bits", "bit-manipulation", "easy"]
---

# How to Solve Binary Number with Alternating Bits

This problem asks us to determine whether a positive integer has alternating bits in its binary representation — meaning every adjacent pair of bits has different values (no two consecutive bits are the same). While the concept is straightforward, the challenge lies in efficiently checking this property without converting the entire number to a string, which would be less optimal. The interesting part is how bit manipulation provides an elegant O(1) space solution.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we're given the number `10`, which in binary is `1010`.

**Step-by-step check:**

1. Binary representation: `1 0 1 0`
2. Compare bit 0 and bit 1: `1` vs `0` → different ✓
3. Compare bit 1 and bit 2: `0` vs `1` → different ✓
4. Compare bit 2 and bit 3: `1` vs `0` → different ✓

All adjacent bits are different, so `10` has alternating bits.

Now let's try `7` (binary `111`):

1. Binary: `1 1 1`
2. Compare bit 0 and bit 1: `1` vs `1` → same ✗
   Already we found a violation, so `7` does NOT have alternating bits.

The key insight is that we can check this property by examining pairs of consecutive bits as we process the number from right to left (least significant bit to most significant bit).

## Brute Force Approach

A naive approach would be to convert the integer to its binary string representation and then check each adjacent pair of characters:

1. Convert the number to binary string using `bin()` in Python or similar methods
2. Iterate through the string from index 1 to end
3. Check if `string[i] == string[i-1]` for any i
4. If any pair is equal, return `False`; otherwise return `True`

**Why this isn't optimal:**

- Converting to string creates O(log n) space overhead (where n is the input number)
- String operations are generally slower than bit operations
- While the time complexity is still O(log n), we can do better with pure bit manipulation
- The problem specifically tests bit manipulation skills, so interviewers expect a solution using bit operations

## Optimal Solution

The optimal solution uses bit manipulation to check adjacent bits without any string conversion. Here's the core idea:

1. Get the last bit (least significant bit) of the number
2. Right-shift the number by 1 bit to examine the next bit
3. Compare the new last bit with the previous one
4. If they're ever equal, the bits aren't alternating
5. Continue until we've processed all bits

The clever part: we can check if two consecutive bits are equal by comparing `(n & 1) == ((n >> 1) & 1)`. If this is true at any point, we return `False`.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
# where n is the input number (we process each bit once)
def hasAlternatingBits(n: int) -> bool:
    # Get the last bit of the current number
    last_bit = n & 1

    # Right shift to remove the bit we just checked
    n >>= 1

    # Continue while there are bits left to check
    while n > 0:
        # Get the new last bit after shifting
        current_bit = n & 1

        # If current bit equals previous bit, not alternating
        if current_bit == last_bit:
            return False

        # Update last_bit for next comparison
        last_bit = current_bit

        # Right shift to process next bit
        n >>= 1

    # All adjacent bits were different
    return True
```

```javascript
// Time: O(log n) | Space: O(1)
// where n is the input number (we process each bit once)
function hasAlternatingBits(n) {
  // Get the least significant bit (rightmost bit)
  let lastBit = n & 1;

  // Right shift to examine the next bit
  n >>= 1;

  // Process all remaining bits
  while (n > 0) {
    // Get the new least significant bit
    const currentBit = n & 1;

    // If two consecutive bits are the same, not alternating
    if (currentBit === lastBit) {
      return false;
    }

    // Update lastBit for next comparison
    lastBit = currentBit;

    // Right shift to process next bit
    n >>= 1;
  }

  // All adjacent bits were different
  return true;
}
```

```java
// Time: O(log n) | Space: O(1)
// where n is the input number (we process each bit once)
public boolean hasAlternatingBits(int n) {
    // Extract the least significant bit
    int lastBit = n & 1;

    // Right shift to move to the next bit
    n >>= 1;

    // Process all bits until n becomes 0
    while (n > 0) {
        // Get the new least significant bit
        int currentBit = n & 1;

        // If consecutive bits are equal, not alternating
        if (currentBit == lastBit) {
            return false;
        }

        // Update lastBit for next iteration
        lastBit = currentBit;

        // Right shift to examine next bit
        n >>= 1;
    }

    // All adjacent bits were different
    return true;
}
```

</div>

**Alternative one-liner approach:** There's an even more elegant solution using the property that for a number with alternating bits, `n ^ (n >> 1)` should have all bits set to 1. Then we can check if `(n ^ (n >> 1) + 1)` is a power of two:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def hasAlternatingBits(n: int) -> bool:
    # XOR n with itself right-shifted by 1
    # For alternating bits, this gives all 1's in binary
    x = n ^ (n >> 1)

    # Check if x+1 is a power of two (all 1's plus 1 = power of two)
    # x & (x + 1) == 0 checks if x has all bits set to 1
    return (x & (x + 1)) == 0
```

```javascript
// Time: O(1) | Space: O(1)
function hasAlternatingBits(n) {
  // XOR with right-shifted self
  const x = n ^ (n >> 1);

  // Check if x has all bits set to 1
  // (x & (x + 1)) === 0 means x is all 1's
  return (x & (x + 1)) === 0;
}
```

```java
// Time: O(1) | Space: O(1)
public boolean hasAlternatingBits(int n) {
    // XOR n with n right-shifted by 1
    int x = n ^ (n >> 1);

    // Check if x has all bits set to 1
    // (x & (x + 1)) == 0 indicates x is all 1's
    return (x & (x + 1)) == 0;
}
```

</div>

**Why this works:** When a number has alternating bits, XORing it with itself shifted right by 1 produces a number with all bits set to 1. For example:

- `10` (1010) ^ `5` (0101) = `15` (1111)
- Then `15 & 16` = `0`, confirming all bits are 1's

## Complexity Analysis

**Time Complexity: O(log n)**

- In the first approach, we process each bit exactly once
- The number of bits in n is log₂(n), so we make O(log n) iterations
- In the alternative approach, we perform constant-time bit operations, so O(1)

**Space Complexity: O(1)**

- We only use a few integer variables regardless of input size
- No additional data structures that grow with input

## Common Mistakes

1. **Off-by-one errors in the loop:** When checking adjacent bits, candidates sometimes compare the wrong indices or forget to update the `last_bit` variable correctly. Always trace through a small example to verify your indices.

2. **Not handling the shift properly:** Forgetting to right-shift `n` in the loop will cause an infinite loop. Remember that `n >>= 1` is crucial to progress through the bits.

3. **Incorrect bit extraction:** Using `n % 2` instead of `n & 1` works but is slightly less conventional for bit manipulation problems. Both give the least significant bit, but `& 1` is more idiomatic for bit problems.

4. **Missing the positive integer constraint:** The problem states the input is positive, but some candidates write unnecessary checks for negative numbers. While defensive programming is good, recognize when constraints simplify the problem.

5. **Using string conversion unnecessarily:** While converting to binary string works, it shows you're not comfortable with bit manipulation, which is what this problem tests. Always prefer bit operations for bit problems.

## When You'll See This Pattern

This alternating bits pattern appears in several bit manipulation problems:

1. **Number of 1 Bits (LeetCode 191)** - Both problems involve examining individual bits through shifting and masking. The alternating bits check is essentially a variation where you compare each bit with its neighbor.

2. **Reverse Bits (LeetCode 190)** - Similar bit-by-bit processing using shifting, but instead of comparing, you're rearranging bits.

3. **Single Number (LeetCode 136)** - Uses XOR operation extensively, which is also key in the alternative solution for this problem.

4. **Power of Two (LeetCode 231)** - The alternative solution uses the same "power of two" check technique (`(x & (x-1)) == 0` or similar).

The core technique of `n & 1` to get the last bit and `n >>= 1` to shift bits right is fundamental to almost all bit manipulation problems.

## Key Takeaways

1. **Bit manipulation fundamentals:** This problem reinforces the essential operations: `& 1` to extract the least significant bit, `>>` to right-shift, and `^` for XOR operations.

2. **Pattern recognition for alternating sequences:** When checking if adjacent elements alternate, compare each element with its predecessor while iterating. This pattern applies beyond bits to arrays and strings.

3. **Elegant mathematical insights:** The alternative solution shows how properties of numbers (like "all bits set to 1") can lead to cleaner, more efficient solutions than straightforward iteration.

4. **Constraint awareness:** The problem's "positive integer" constraint eliminates edge cases with negative numbers or zero, allowing cleaner solutions.

Remember: for bit manipulation problems, always think about how shifting and masking can help you examine or transform bits without converting to other representations.

Related problems: [Number of 1 Bits](/problem/number-of-1-bits)
