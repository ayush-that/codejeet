---
title: "How to Solve Sum of Two Integers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Two Integers. Medium difficulty, 55.1% acceptance rate. Topics: Math, Bit Manipulation."
date: "2027-01-29"
category: "dsa-patterns"
tags: ["sum-of-two-integers", "math", "bit-manipulation", "medium"]
---

# How to Solve Sum of Two Integers Without Using + or -

This problem asks us to calculate the sum of two integers without using the `+` or `-` operators. At first glance, this seems impossible — addition is fundamental! The trick is that we must implement addition ourselves using **bit manipulation**. This problem tests your understanding of how computers actually perform addition at the binary level, making it a favorite for interviews about low-level operations.

## Visual Walkthrough

Let's trace through adding `a = 5` and `b = 3` using only bit operations:

**Step 1: Convert to binary**

- `5` in binary: `0101`
- `3` in binary: `0011`

**Step 2: Think about how addition works**
When adding binary numbers, we need to handle two things:

1. The sum bits (ignoring carries)
2. The carry bits (which get added to the next position)

**Step 3: Calculate sum without carry (XOR)**
XOR (`^`) gives us the sum without considering carries:

```
0101 (5)
0011 (3) XOR
----
0110 (6)  ← This is 5 + 3 without carries
```

**Step 4: Calculate carries (AND + left shift)**
AND (`&`) finds where both bits are 1 (these create carries):

```
0101 (5)
0011 (3) AND
----
0001 (1)  ← These bits will generate carries
```

Now left shift by 1 to move carries to the correct position:

```
0001 << 1 = 0010 (2)  ← This is the carry value
```

**Step 5: Add sum and carry**
We need to add `0110` (sum) and `0010` (carry). But wait — we can't use `+`! So we repeat the process with these new numbers.

**Step 6: Repeat until no carries remain**
Second iteration:

- New sum (XOR): `0110 ^ 0010 = 0100` (4)
- New carry: `(0110 & 0010) << 1 = (0010) << 1 = 0100` (4)

Third iteration:

- New sum: `0100 ^ 0100 = 0000` (0)
- New carry: `(0100 & 0100) << 1 = 0100 << 1 = 1000` (8)

Fourth iteration:

- New sum: `0000 ^ 1000 = 1000` (8)
- New carry: `(0000 & 1000) << 1 = 0000` (0) ← No more carry!

**Result:** `1000` in binary = `8` in decimal. Correct!

## Brute Force Approach

There's no traditional "brute force" for this problem since we're explicitly forbidden from using `+` and `-`. However, a naive candidate might try:

1. **Using built-in functions**: Trying to use `sum()`, `add()`, or other language-specific functions that internally use addition. This misses the point of the problem.

2. **Increment/decrement loops**: Using loops with `++` or `--` operators:

   ```python
   def getSum(a, b):
       if b > 0:
           for _ in range(b):
               a += 1  # Oops! Using +!
       else:
           for _ in range(abs(b)):
               a -= 1  # Oops! Using -!
       return a
   ```

   Even if we could use increment/decrement (which we can't in Python), this would be O(n) where n is the absolute value of b — extremely inefficient for large numbers.

3. **Mathematical workarounds**: Trying `math.log(exp(a) * exp(b))` or similar tricks. These often fail with edge cases (negative numbers, overflow) and don't demonstrate the bit manipulation skills being tested.

The key insight is that we need to think at the binary level, not try to work around the restriction at the arithmetic level.

## Optimized Approach

The optimal solution uses **bitwise operations** to simulate how hardware adders work. Here's the step-by-step reasoning:

**Key Insight**: Binary addition can be broken down into:

1. **XOR (`^`)** gives the sum without carries
2. **AND (`&`)** followed by **left shift (`<<`)** gives the carry bits

**Why this works**:

- When two bits are different (1 and 0), XOR gives 1 (correct sum, no carry)
- When two bits are both 1, XOR gives 0 (but we need to carry 1 to the next position)
- The AND operation finds exactly where we have two 1s (where carries are generated)
- Left shifting moves the carry to the correct next position

**The Algorithm**:

1. Calculate `sum_without_carry = a ^ b`
2. Calculate `carry = (a & b) << 1`
3. Now we need to add `sum_without_carry` and `carry`
4. Repeat steps 1-3 until `carry == 0`
5. The final `sum_without_carry` is our answer

**Why we need to repeat**: After the first XOR and carry calculation, we still have two numbers to add (the sum and the carry). We apply the same process to these two numbers, continuing until there are no more carries.

**Handling negative numbers**: This approach works beautifully with negative numbers because computers use **two's complement** representation. The bitwise operations handle negative numbers correctly without any special cases!

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) - At most 32/64 iterations (number of bits in integer)
# Space: O(1) - Only using a few variables
def getSum(a: int, b: int) -> int:
    """
    Calculate sum of two integers using only bitwise operations.

    The key insight: a + b = (a ^ b) + ((a & b) << 1)
    We repeatedly apply this until there's no carry left.
    """
    # 32-bit mask to handle Python's unlimited integers
    # Python integers are unbounded, so we need to simulate 32-bit overflow
    mask = 0xFFFFFFFF

    while b != 0:
        # Step 1: Calculate sum without carry (XOR)
        # XOR gives us the sum bits where there's no carry
        sum_without_carry = (a ^ b) & mask

        # Step 2: Calculate carry bits
        # AND finds where both bits are 1 (these generate carries)
        # Left shift moves carries to the correct position
        carry = ((a & b) << 1) & mask

        # Step 3: Prepare for next iteration
        # The new 'a' is the sum without carry
        # The new 'b' is the carry (which we need to add)
        a = sum_without_carry
        b = carry

    # Handle negative results (two's complement)
    # If a is negative in 32-bit representation, convert it back
    if a > 0x7FFFFFFF:  # 0x7FFFFFFF is max positive in 32-bit signed
        a = ~(a ^ mask)  # Convert from 32-bit unsigned to signed

    return a
```

```javascript
// Time: O(1) - At most 32 iterations (number of bits in integer)
// Space: O(1) - Only using a few variables
/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var getSum = function (a, b) {
  /**
   * Calculate sum of two integers using only bitwise operations.
   *
   * The key insight: a + b = (a ^ b) + ((a & b) << 1)
   * We repeatedly apply this until there's no carry left.
   */

  while (b !== 0) {
    // Step 1: Calculate sum without carry (XOR)
    // XOR gives us the sum bits where there's no carry
    const sumWithoutCarry = a ^ b;

    // Step 2: Calculate carry bits
    // AND finds where both bits are 1 (these generate carries)
    // Left shift moves carries to the correct position
    // The >>> 0 converts to unsigned 32-bit integer
    const carry = ((a & b) << 1) >>> 0;

    // Step 3: Prepare for next iteration
    // The new 'a' is the sum without carry
    // The new 'b' is the carry (which we need to add)
    a = sumWithoutCarry >>> 0; // Convert to unsigned 32-bit
    b = carry;
  }

  // Convert back to signed 32-bit integer
  // If a is greater than max signed int, it's negative
  if (a > 0x7fffffff) {
    a = a - 0x100000000;
  }

  return a;
};
```

```java
// Time: O(1) - At most 32 iterations (number of bits in integer)
// Space: O(1) - Only using a few variables
class Solution {
    public int getSum(int a, int b) {
        /**
         * Calculate sum of two integers using only bitwise operations.
         *
         * The key insight: a + b = (a ^ b) + ((a & b) << 1)
         * We repeatedly apply this until there's no carry left.
         */

        while (b != 0) {
            // Step 1: Calculate sum without carry (XOR)
            // XOR gives us the sum bits where there's no carry
            int sumWithoutCarry = a ^ b;

            // Step 2: Calculate carry bits
            // AND finds where both bits are 1 (these generate carries)
            // Left shift moves carries to the correct position
            // Note: We need to handle Java's signed left shift carefully
            int carry = (a & b) << 1;

            // Step 3: Prepare for next iteration
            // The new 'a' is the sum without carry
            // The new 'b' is the carry (which we need to add)
            a = sumWithoutCarry;
            b = carry;
        }

        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The loop runs at most 32 times for 32-bit integers (or 64 times for 64-bit)
- Each iteration performs constant-time bitwise operations (XOR, AND, shift)
- Even with the worst-case input (like -1 + 1), we'll only iterate 32 times
- This is considered constant time since 32/64 is bounded regardless of input size

**Space Complexity: O(1)**

- We only use a few integer variables (`a`, `b`, `carry`, `sum_without_carry`)
- No additional data structures that grow with input size
- The memory usage is constant regardless of input values

**Why it's O(1) not O(n)**: Some might think it's O(n) where n is the number of bits, but since integers have a fixed maximum number of bits (32 or 64), we consider this constant time in algorithm analysis.

## Common Mistakes

1. **Forgetting to handle integer overflow/underflow**:
   - In Python, integers are unbounded, so we need to manually mask to 32 bits
   - In Java/JavaScript, we need to be careful with signed vs unsigned operations
   - **Fix**: Use bit masks (`0xFFFFFFFF`) and handle conversion between signed/unsigned

2. **Infinite loop with negative numbers**:
   - Without proper masking, negative numbers can cause infinite loops
   - Example: `-1 + 1` might loop forever if not handled correctly
   - **Fix**: Use unsigned right shift (`>>>` in JavaScript) or proper masking in Python

3. **Trying to use increment/decrement operators**:
   - Some candidates try `a++` or `a--` thinking these don't count as `+` or `-`
   - But these are equivalent to `a = a + 1` or `a = a - 1`
   - **Fix**: Stick strictly to bitwise operations (`^`, `&`, `|`, `<<`, `>>`)

4. **Not understanding why XOR gives sum without carry**:
   - Candidates who memorize the solution without understanding fail when asked to explain
   - **Fix**: Practice with binary examples until the pattern is intuitive
   - Remember: `0^0=0`, `0^1=1`, `1^0=1`, `1^1=0` (sum without carry)

## When You'll See This Pattern

This bit manipulation pattern appears in several important algorithm problems:

1. **Single Number** (LeetCode 136):
   - Uses XOR to find the unique element in an array where all others appear twice
   - `a ^ a = 0` and `a ^ 0 = a` properties are key
   - Related because it uses XOR's ability to "cancel out" pairs

2. **Missing Number** (LeetCode 268):
   - Find the missing number in `[0, n]` using XOR
   - XOR all numbers from 0 to n, then XOR with array elements
   - The result is the missing number

3. **Number of 1 Bits** (LeetCode 191):
   - Count set bits using bit manipulation tricks
   - Uses `n & (n-1)` to clear the lowest set bit
   - Similar low-level bit manipulation thinking

4. **Reverse Bits** (LeetCode 190):
   - Reverse the bits of a 32-bit unsigned integer
   - Requires understanding of bit extraction and placement
   - Uses similar shift and mask operations

## Key Takeaways

1. **XOR is addition without carry**: When adding bits, XOR gives the correct result unless both bits are 1 (which requires a carry). This is fundamental to understanding many bit manipulation problems.

2. **AND finds where carries happen**: `a & b` identifies all positions where both bits are 1 — exactly where carries are generated in addition.

3. **Hardware simulation approach**: Many bit manipulation problems ask you to implement operations that hardware normally handles. Thinking about how circuits would do it (with gates like XOR and AND) often leads to the solution.

4. **Masking is crucial for language differences**: Different languages handle integers differently (signed/unsigned, bounded/unbounded). Always consider the bit width and use masks when necessary.

Related problems: [Add Two Numbers](/problem/add-two-numbers)
