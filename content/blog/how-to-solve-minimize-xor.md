---
title: "How to Solve Minimize XOR — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize XOR. Medium difficulty, 62.4% acceptance rate. Topics: Greedy, Bit Manipulation."
date: "2026-11-08"
category: "dsa-patterns"
tags: ["minimize-xor", "greedy", "bit-manipulation", "medium"]
---

# How to Solve Minimize XOR

We need to find an integer `x` that has exactly the same number of 1-bits (set bits) as `num2`, while minimizing the XOR value with `num1`. The challenge lies in balancing two constraints: matching the bit count while making `x` as similar as possible to `num1` in binary representation (since XOR is minimal when bits match).

## Visual Walkthrough

Let's trace through `num1 = 3` (binary `011`), `num2 = 5` (binary `101`).  
`num2` has 2 set bits, so `x` must also have exactly 2 set bits.

**Step 1:** Compare `num1` bits with potential `x` bits.  
We want `x` to match `num1` as much as possible to minimize XOR.  
`num1 = 011` (bits from most significant: 0, 1, 1)

**Step 2:** Start with `x = 0`. We need to place 2 set bits.  
Where should we put them? To minimize XOR, we should match `num1`'s 1s first.

**Step 3:** Process bits from most significant to least significant:

- Bit position 2 (value 4): `num1` has 0 here. If we put 1, XOR would be 1 (bad). Skip.
- Bit position 1 (value 2): `num1` has 1 here. If we put 1, XOR would be 0 (good). Use it. Remaining bits: 1.
- Bit position 0 (value 1): `num1` has 1 here. If we put 1, XOR would be 0 (good). Use it. Remaining bits: 0.

**Result:** `x = 110` (binary) = 6. Check: `x` has 2 set bits ✓, `3 XOR 6 = 5`.

But wait — is this minimal? Let's check alternative: `x = 011` (3) has only 2 set bits? No, it has 2 set bits actually (011 has two 1s). `3 XOR 3 = 0` which is smaller than 5! So why didn't we get that?

Because we processed from most significant bit, but we should actually prioritize matching `num1`'s 1s in **any** position first. The key insight: to minimize XOR, we want `x` to match `num1` wherever possible. So we should:

1. First set bits where `num1` has 1s (these give XOR=0)
2. If we still need more set bits, set bits where `num1` has 0s (these give XOR=1), starting from least significant position (to minimize the numerical value of the XOR result).

Let's recalculate:
`num1 = 3` (011), need 2 set bits.

1. Set bits where `num1` has 1s: positions 1 and 0 → use both. That's 2 bits already.
2. `x = 011` = 3. `3 XOR 3 = 0`.

This is indeed better. The algorithm becomes: match `num1`'s 1s first, then fill remaining needed bits in `num1`'s 0s from least significant position.

## Brute Force Approach

A brute force would try all possible `x` values with the correct number of set bits. We could:

1. Count set bits in `num2` (let's call it `k`)
2. Generate all numbers from 1 to some upper bound
3. Check each number's popcount equals `k`
4. Compute XOR with `num1` and track minimum

The upper bound is tricky — theoretically up to 2³¹ for 32-bit integers. This gives O(2ⁿ) possibilities, completely infeasible.

Even a smarter brute force that only generates numbers with exactly `k` set bits using combinations would still be O(C(n,k)) where n is bit length, which grows factorially.

## Optimized Approach

The optimal approach uses **greedy bit manipulation**:

1. **Count set bits in `num2`** → this is our target count for `x`.
2. **Build `x` bit by bit**:
   - First priority: Set bits in positions where `num1` has 1s (starting from most significant). This minimizes XOR because matching 1s gives XOR=0.
   - Second priority: If we still need more set bits after using all of `num1`'s 1s, set bits in positions where `num1` has 0s, but starting from **least significant** position. This minimizes the numerical impact because setting a 0 in a less significant position creates a smaller XOR value.

Why this greedy approach works:

- XOR is minimized when `x` and `num1` have identical bits (XOR=0).
- When we must set bits where they differ (because we've used all matching positions), setting them in less significant positions creates smaller XOR values (e.g., XOR difference at position 0 adds 1, at position 1 adds 2, at position 2 adds 4, etc.).

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) - we process at most 32 bits
# Space: O(1) - only a few variables
def minimizeXor(num1: int, num2: int) -> int:
    # Step 1: Count set bits in num2 (target count for x)
    target_bits = num2.bit_count()  # Python 3.8+: bin(num2).count('1')

    # Step 2: Initialize result x and track remaining bits to set
    x = 0
    remaining_bits = target_bits

    # Step 3: First pass: set bits where num1 has 1s (from most significant)
    # This minimizes XOR by matching num1's 1s
    for i in range(31, -1, -1):  # Check bits 31 down to 0
        if remaining_bits == 0:
            break
        # Check if num1 has a 1 at position i
        if num1 & (1 << i):
            # Set the same bit in x
            x |= (1 << i)
            remaining_bits -= 1

    # Step 4: Second pass: if still need bits, set them in num1's 0 positions
    # Start from least significant to minimize XOR value
    for i in range(32):  # Check bits 0 to 31
        if remaining_bits == 0:
            break
        # Check if num1 has a 0 at position i (and x doesn't already have 1)
        if not (num1 & (1 << i)) and not (x & (1 << i)):
            # Set this bit in x
            x |= (1 << i)
            remaining_bits -= 1

    return x
```

```javascript
// Time: O(1) - we process at most 32 bits
// Space: O(1) - only a few variables
function minimizeXor(num1, num2) {
  // Step 1: Count set bits in num2 (target count for x)
  let targetBits = 0;
  let temp = num2;
  while (temp > 0) {
    targetBits += temp & 1;
    temp >>= 1;
  }

  // Step 2: Initialize result x and track remaining bits to set
  let x = 0;
  let remainingBits = targetBits;

  // Step 3: First pass: set bits where num1 has 1s (from most significant)
  // This minimizes XOR by matching num1's 1s
  for (let i = 31; i >= 0; i--) {
    if (remainingBits === 0) break;
    // Check if num1 has a 1 at position i
    if (num1 & (1 << i)) {
      // Set the same bit in x
      x |= 1 << i;
      remainingBits--;
    }
  }

  // Step 4: Second pass: if still need bits, set them in num1's 0 positions
  // Start from least significant to minimize XOR value
  for (let i = 0; i < 32; i++) {
    if (remainingBits === 0) break;
    // Check if num1 has a 0 at position i (and x doesn't already have 1)
    if (!(num1 & (1 << i)) && !(x & (1 << i))) {
      // Set this bit in x
      x |= 1 << i;
      remainingBits--;
    }
  }

  return x;
}
```

```java
// Time: O(1) - we process at most 32 bits
// Space: O(1) - only a few variables
public int minimizeXor(int num1, int num2) {
    // Step 1: Count set bits in num2 (target count for x)
    int targetBits = Integer.bitCount(num2);

    // Step 2: Initialize result x and track remaining bits to set
    int x = 0;
    int remainingBits = targetBits;

    // Step 3: First pass: set bits where num1 has 1s (from most significant)
    // This minimizes XOR by matching num1's 1s
    for (int i = 31; i >= 0; i--) {
        if (remainingBits == 0) break;
        // Check if num1 has a 1 at position i
        if ((num1 & (1 << i)) != 0) {
            // Set the same bit in x
            x |= (1 << i);
            remainingBits--;
        }
    }

    // Step 4: Second pass: if still need bits, set them in num1's 0 positions
    // Start from least significant to minimize XOR value
    for (int i = 0; i < 32; i++) {
        if (remainingBits == 0) break;
        // Check if num1 has a 0 at position i (and x doesn't already have 1)
        if ((num1 & (1 << i)) == 0 && (x & (1 << i)) == 0) {
            // Set this bit in x
            x |= (1 << i);
            remainingBits--;
        }
    }

    return x;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)  
We iterate through at most 32 bits twice (once from MSB to LSB, once from LSB to MSB). Since integers are fixed at 32 bits (or 64 in some contexts), this is constant time.

**Space Complexity:** O(1)  
We only use a few integer variables (`x`, `remainingBits`, loop counters). No additional data structures.

## Common Mistakes

1. **Processing bits in wrong order**: Some candidates process bits from LSB to MSB in both passes. This fails because when setting bits in `num1`'s 0s, we want the least significant positions first to minimize the XOR value. The first pass should be MSB→LSB to match `num1`'s 1s in the most significant positions first (which gives larger XOR reduction), while the second pass should be LSB→MSB to add bits in the least significant 0s.

2. **Forgetting to check if bit is already set**: In the second pass, we need `!(x & (1 << i))` to ensure we don't double-count a bit that was already set in the first pass. Without this check, we might incorrectly count bits.

3. **Incorrect bit counting**: Using `log2` operations or string conversions for bit counting is less efficient than using built-in functions (`bit_count()` in Python, `Integer.bitCount()` in Java) or bit manipulation loops.

4. **Not handling the case when `num1` has fewer 1s than needed**: The algorithm naturally handles this — if `num1` has fewer 1s than `targetBits`, the first pass sets all of `num1`'s 1s, then the second pass fills the remaining bits in `num1`'s 0s.

## When You'll See This Pattern

This greedy bit manipulation pattern appears in problems where you need to construct a number with specific bit properties while optimizing some relationship with another number:

1. **Maximum XOR of Two Numbers in an Array** - Uses a trie to greedily choose opposite bits to maximize XOR. Similar concept of optimizing bit relationships.

2. **Maximum XOR With an Element From Array** - Builds on the previous problem with queries, using tries and greedy bit selection.

3. **Single Number II** - Uses bit counting across all numbers to find the unique one.

4. **Counting Bits** - Dynamic programming with bit manipulation to count set bits efficiently.

The core pattern: when dealing with bit optimization problems, consider processing bits from most significant to least significant for maximizing/minimizing values, and use greedy choices based on the current state.

## Key Takeaways

1. **Greedy bit manipulation works**: When constructing a number with bit constraints, process bits in the order that minimizes/maximizes your objective function. For minimizing XOR with a target, match the target's bits first.

2. **Direction matters**: Process from MSB when matching existing bits (to get the biggest impact), and from LSB when adding new bits in empty positions (to minimize the numerical impact).

3. **Bit counting is fundamental**: Many bit manipulation problems require counting set bits as a first step. Know efficient methods: built-in functions, Brian Kernighan's algorithm (`n & (n-1)`), or simple loops.

Related problems: [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-array), [Maximum XOR With an Element From Array](/problem/maximum-xor-with-an-element-from-array)
