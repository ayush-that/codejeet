---
title: "How to Solve Concatenation of Consecutive Binary Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Concatenation of Consecutive Binary Numbers. Medium difficulty, 66.0% acceptance rate. Topics: Math, Bit Manipulation, Simulation."
date: "2026-04-18"
category: "dsa-patterns"
tags:
  [
    "concatenation-of-consecutive-binary-numbers",
    "math",
    "bit-manipulation",
    "simulation",
    "medium",
  ]
---

# How to Solve Concatenation of Consecutive Binary Numbers

This problem asks us to compute the decimal value of a binary string formed by concatenating the binary representations of all integers from 1 to n, then return that value modulo 10⁹ + 7. What makes this problem interesting is that the concatenated binary string grows extremely quickly—for n=20, the string already has over 100 bits—so we need a clever mathematical approach rather than literal string concatenation.

## Visual Walkthrough

Let's trace through n=3 to build intuition:

**Step 1:** Binary representations:

- 1 → "1"
- 2 → "10"
- 3 → "11"

**Step 2:** Concatenation: "1" + "10" + "11" = "11011"

**Step 3:** Convert to decimal: "11011"₂ = 1×2⁴ + 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 16 + 8 + 0 + 2 + 1 = 27

**Step 4:** Modulo 10⁹ + 7: 27 % 1000000007 = 27

Now let's see how we can compute this without actually building the string. Notice that when we append the binary representation of a new number k to our existing result, we're effectively shifting the existing bits left by the length of k's binary representation, then adding k.

For n=3:

- Start with result = 0
- Add 1: result = (0 << 1) + 1 = 1
- Add 2: result = (1 << 2) + 2 = (1×4) + 2 = 6
- Add 3: result = (6 << 2) + 3 = (6×4) + 3 = 27

Wait, that gave us 27! But why did we shift by 2 bits for both 2 and 3? Because both have binary length 2. This reveals the pattern: we need to track the current length of the binary representation we're about to append.

## Brute Force Approach

The most straightforward approach would be to:

1. Generate binary strings for all numbers from 1 to n
2. Concatenate them into one giant string
3. Convert that binary string to decimal
4. Apply modulo operation

Here's what that might look like:

<div class="code-group">

```python
def concatenatedBinary_brute(n: int) -> int:
    MOD = 10**9 + 7
    binary_str = ""

    # Step 1: Build the concatenated binary string
    for i in range(1, n + 1):
        binary_str += bin(i)[2:]  # Remove '0b' prefix

    # Step 2: Convert to decimal
    result = 0
    for bit in binary_str:
        result = (result * 2 + int(bit)) % MOD

    return result
```

```javascript
function concatenatedBinaryBrute(n) {
  const MOD = 10 ** 9 + 7;
  let binaryStr = "";

  // Step 1: Build the concatenated binary string
  for (let i = 1; i <= n; i++) {
    binaryStr += i.toString(2);
  }

  // Step 2: Convert to decimal
  let result = 0;
  for (let bit of binaryStr) {
    result = (result * 2 + parseInt(bit)) % MOD;
  }

  return result;
}
```

```java
public int concatenatedBinaryBrute(int n) {
    final int MOD = 1_000_000_007;
    StringBuilder binaryStr = new StringBuilder();

    // Step 1: Build the concatenated binary string
    for (int i = 1; i <= n; i++) {
        binaryStr.append(Integer.toBinaryString(i));
    }

    // Step 2: Convert to decimal
    long result = 0;
    for (int i = 0; i < binaryStr.length(); i++) {
        result = (result * 2 + (binaryStr.charAt(i) - '0')) % MOD;
    }

    return (int) result;
}
```

</div>

**Why this fails:** The binary string grows exponentially with n. For n=10⁵, the string would have roughly 1.5 million bits, which is manageable but converting it character by character would be O(L) where L is the string length. However, the real issue is that building the string itself requires O(n log n) time and O(L) space, which becomes impractical for large n due to memory constraints.

## Optimized Approach

The key insight is that we don't need to build the actual binary string. We can compute the result iteratively using bit manipulation:

When we want to append the binary representation of number `k` to our current result `res`, we need to:

1. Shift `res` left by the number of bits in `k` (let's call this `len`)
2. Add `k` to the shifted result
3. Apply modulo to keep numbers manageable

Mathematically: `res = (res << len) + k`

But how do we know `len` (the number of bits in `k`)? We can detect when `k` is a power of 2 because that's when the binary length increases. For example:

- 1 (binary "1") has length 1
- 2 (binary "10") has length 2
- 3 (binary "11") has length 2
- 4 (binary "100") has length 3
- 5-7 have length 3
- 8 has length 4, and so on

So `len` increases whenever `k` is a power of 2. We can check this with: `(k & (k - 1)) == 0`

Alternative approach: We can compute the length directly using `bit_length()` in Python or similar methods in other languages.

## Optimal Solution

Here's the efficient solution that runs in O(n) time and O(1) space:

<div class="code-group">

```python
def concatenatedBinary(n: int) -> int:
    MOD = 10**9 + 7
    result = 0
    length = 0  # Current length of binary representation

    for i in range(1, n + 1):
        # Check if i is a power of 2 (binary length increases)
        # (i & (i - 1)) == 0 is true for powers of 2
        if (i & (i - 1)) == 0:
            length += 1

        # Shift current result left by 'length' bits and add i
        # Equivalent to: result = result * (2^length) + i
        result = ((result << length) | i) % MOD

    return result

# Alternative using bit_length() - cleaner but slightly slower
def concatenatedBinary2(n: int) -> int:
    MOD = 10**9 + 7
    result = 0

    for i in range(1, n + 1):
        # bit_length() gives the number of bits needed to represent i
        length = i.bit_length()

        # Shift and add
        result = ((result << length) | i) % MOD

    return result
```

```javascript
function concatenatedBinary(n) {
  const MOD = 10 ** 9 + 7;
  let result = 0;
  let length = 0; // Current length of binary representation

  for (let i = 1; i <= n; i++) {
    // Check if i is a power of 2 (binary length increases)
    // (i & (i - 1)) === 0 is true for powers of 2
    if ((i & (i - 1)) === 0) {
      length++;
    }

    // Shift current result left by 'length' bits and add i
    // Using BigInt to avoid overflow for large n
    result = Number((BigInt(result) << BigInt(length)) | BigInt(i)) % MOD;
  }

  return result;
}

// Alternative using bitLength - more readable
function concatenatedBinary2(n) {
  const MOD = 10 ** 9 + 7;
  let result = 0;

  for (let i = 1; i <= n; i++) {
    // Calculate number of bits in i
    const length = Math.floor(Math.log2(i)) + 1;

    // Shift and add
    result = Number((BigInt(result) << BigInt(length)) | BigInt(i)) % MOD;
  }

  return result;
}
```

```java
public int concatenatedBinary(int n) {
    final int MOD = 1_000_000_007;
    long result = 0;  // Use long to avoid overflow during intermediate calculations
    int length = 0;   // Current length of binary representation

    for (int i = 1; i <= n; i++) {
        // Check if i is a power of 2 (binary length increases)
        // (i & (i - 1)) == 0 is true for powers of 2
        if ((i & (i - 1)) == 0) {
            length++;
        }

        // Shift current result left by 'length' bits and add i
        // Equivalent to: result = result * (2^length) + i
        result = ((result << length) | i) % MOD;
    }

    return (int) result;
}

// Alternative using bitCount - more straightforward
public int concatenatedBinary2(int n) {
    final int MOD = 1_000_000_007;
    long result = 0;

    for (int i = 1; i <= n; i++) {
        // Integer.toBinaryString(i).length() gives the number of bits
        // But bitLength is more efficient
        int length = 32 - Integer.numberOfLeadingZeros(i);

        // Shift and add
        result = ((result << length) | i) % MOD;
    }

    return (int) result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through all numbers from 1 to n exactly once
- Each iteration performs constant-time operations (bit manipulation and modulo)
- Even though bit_length() or similar functions might seem like O(log n), they're implemented efficiently in hardware and are effectively O(1) for practical purposes

**Space Complexity:** O(1)

- We only use a few variables (result, length, loop counter)
- No data structures that grow with n
- The modulo operation keeps numbers bounded

## Common Mistakes

1. **Forgetting to apply modulo at each step**: If you only apply modulo at the end, the intermediate results can overflow even 64-bit integers for moderately large n. For n=10⁵, the result has about 1.5 million bits!

2. **Incorrect bit length calculation**: Some candidates try to compute length as `floor(log2(i)) + 1` but forget that `log2(1) = 0`, so they get length=0 for i=1. Always test with small values like n=1, 2, 3.

3. **Using string operations**: Building the actual binary string works for small n but fails for large n due to memory constraints. The string for n=10⁵ would be ~1.5MB, which is okay, but for n=10⁶ it would be ~20MB, and it grows O(n log n).

4. **Not handling powers of 2 correctly**: When checking `(i & (i - 1)) == 0`, remember that this works because for powers of 2, the binary representation has exactly one '1' bit. For i=0, this would be true, but our loop starts at 1, so we're safe.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bit manipulation for efficiency**: Problems that involve binary representations often benefit from bit operations. Similar problems:
   - [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) - Counting set bits using `n & (n-1)`
   - [231. Power of Two](https://leetcode.com/problems/power-of-two/) - Using `n & (n-1) == 0` to check if a number is a power of two

2. **Modular arithmetic with large numbers**: When dealing with potentially huge results, we often need to apply modulo at each step to prevent overflow. Similar problems:
   - [50. Pow(x, n)](https://leetcode.com/problems/powx-n/) - Fast exponentiation with modulo
   - [1017. Convert to Base -2](https://leetcode.com/problems/convert-to-base-2/) - Base conversion with careful handling

3. **Incremental construction**: Building a result incrementally rather than all at once. Similar problems:
   - [43. Multiply Strings](https://leetcode.com/problems/multiply-strings/) - Building product digit by digit
   - [67. Add Binary](https://leetcode.com/problems/add-binary/) - Adding binary strings bit by bit

## Key Takeaways

1. **Think in terms of mathematical operations rather than literal string manipulation**: When a problem involves concatenation or appending of representations, consider whether you can simulate the effect with arithmetic operations (shifting for binary, multiplying by powers for decimal).

2. **Powers of 2 have special properties in binary**: The pattern `(n & (n-1)) == 0` detects powers of 2, which is useful when binary length changes. This trick appears in many bit manipulation problems.

3. **Apply modulo early and often**: When a problem asks for results modulo some value (especially 10⁹+7), apply the modulo at each step of computation to prevent overflow and keep numbers manageable.

Related problems: [Maximum Possible Number by Binary Concatenation](/problem/maximum-possible-number-by-binary-concatenation)
