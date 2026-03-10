---
title: "How to Solve Number of Bit Changes to Make Two Integers Equal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Bit Changes to Make Two Integers Equal. Easy difficulty, 63.4% acceptance rate. Topics: Bit Manipulation."
date: "2028-07-16"
category: "dsa-patterns"
tags: ["number-of-bit-changes-to-make-two-integers-equal", "bit-manipulation", "easy"]
---

# How to Solve Number of Bit Changes to Make Two Integers Equal

You need to transform integer `n` into `k` by repeatedly changing 1-bits to 0-bits in `n`'s binary representation. Return the minimum number of such changes, or -1 if impossible. The key insight is that you can only _remove_ 1-bits from `n` (by turning them to 0), never add 1-bits. This makes the problem a careful bitwise comparison rather than a general edit distance.

## Visual Walkthrough

Let's trace through an example: `n = 13`, `k = 5`.

**Step 1: Binary representations**

- `n = 13` in binary: `1101` (bits: 8 + 4 + 0 + 1)
- `k = 5` in binary: `0101` (bits: 0 + 4 + 0 + 1)

**Step 2: Compare bit by bit from right to left**

- Bit 0 (LSB): Both have `1` → no change needed
- Bit 1: Both have `0` → no change needed
- Bit 2: Both have `1` → no change needed
- Bit 3: `n` has `1`, `k` has `0` → we can change this 1 to 0

**Step 3: Check if transformation is possible**
We only needed to change one bit (bit 3). Since we're allowed to change 1-bits to 0-bits, this is valid. The answer is 1.

**Impossible example**: `n = 5`, `k = 7`

- `n = 5`: `0101`
- `k = 7`: `0111`
  At bit 1: `n` has `0`, `k` has `1`. We cannot turn a 0 into a 1, so it's impossible → return -1.

The rule becomes clear: For every bit position where `k` has a 1, `n` must also have a 1 at that position. If `n` has a 1 where `k` has a 0, we can fix it by changing that 1 to 0. But if `k` has a 1 where `n` has a 0, it's impossible.

## Brute Force Approach

A naive approach would be to convert both numbers to binary strings, pad them to equal length, then compare character by character:

1. Convert `n` and `k` to binary strings
2. Pad the shorter string with leading zeros
3. Compare each position:
   - If `k[i] == '1'` and `n[i] == '0'`: return -1 (impossible)
   - If `n[i] == '1'` and `k[i] == '0'`: increment counter
4. Return the counter

This works but involves string manipulation. A more direct brute force would examine each bit position using bit shifting:

```python
def minChanges(n, k):
    changes = 0
    while n > 0 or k > 0:
        # Get the least significant bit of each number
        bit_n = n & 1
        bit_k = k & 1

        if bit_k == 1 and bit_n == 0:
            return -1
        if bit_n == 1 and bit_k == 0:
            changes += 1

        # Shift right to examine next bit
        n >>= 1
        k >>= 1

    return changes
```

This approach examines up to 32 bits (for 32-bit integers), so it's actually O(1) time. However, it's not the most elegant bit manipulation solution, and candidates might forget to handle the case where `n` and `k` have different numbers of bits (the loop condition handles this).

## Optimal Solution

The optimal solution uses bitwise operations more cleverly. The key observation:

- If `k` has a 1-bit at any position where `n` has a 0-bit, it's impossible → return -1
- Otherwise, count how many 1-bits in `n` need to be turned to 0 to match `k`

We can express this as: `(n & k) == k` must be true (all 1-bits in `k` must also be 1 in `n`). Then the answer is the number of 1-bits in `n` that are 0 in `k`, which is `popcount(n & ~k)`.

Let's break this down:

1. `~k` flips all bits of `k` (0→1, 1→0)
2. `n & ~k` gives bits that are 1 in `n` but 0 in `k`
3. Count the 1-bits in this result

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def minChanges(n: int, k: int) -> int:
    # Check if transformation is possible
    # All 1-bits in k must also be 1-bits in n
    # Equivalent to: (n & k) == k
    if (n & k) != k:
        return -1

    # Count how many 1-bits in n need to be changed to 0
    # These are bits where n has 1 and k has 0
    # n & ~k gives us exactly those bits
    bits_to_change = n & ~k

    # Count the number of 1-bits in bits_to_change
    # Using built-in bit_count() in Python 3.8+
    return bits_to_change.bit_count()

# Alternative without bit_count() for older Python versions
def minChanges_alternative(n: int, k: int) -> int:
    if (n & k) != k:
        return -1

    bits_to_change = n & ~k
    count = 0

    # Count 1-bits manually
    while bits_to_change:
        # Clear the least significant 1-bit
        bits_to_change &= bits_to_change - 1
        count += 1

    return count
```

```javascript
// Time: O(1) | Space: O(1)
function minChanges(n, k) {
  // Check if transformation is possible
  // All 1-bits in k must also be 1-bits in n
  if ((n & k) !== k) {
    return -1;
  }

  // Bits that need changing: 1 in n but 0 in k
  const bitsToChange = n & ~k;

  // Count 1-bits in bitsToChange
  // Using built-in bitCount method or manual counting
  let count = 0;
  let temp = bitsToChange;

  // Brian Kernighan's algorithm
  while (temp !== 0) {
    // Clear the least significant 1-bit
    temp &= temp - 1;
    count++;
  }

  return count;
}

// Alternative using toString(2) for clarity
function minChangesString(n, k) {
  if ((n & k) !== k) return -1;

  const bitsToChange = n & ~k;
  // Convert to binary string and count '1's
  return bitsToChange.toString(2).split("1").length - 1;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int minChanges(int n, int k) {
        // Check if transformation is possible
        // All 1-bits in k must also be 1-bits in n
        if ((n & k) != k) {
            return -1;
        }

        // Bits that need changing: 1 in n but 0 in k
        int bitsToChange = n & ~k;

        // Count 1-bits using Integer.bitCount
        return Integer.bitCount(bitsToChange);
    }
}

// Alternative without Integer.bitCount
class SolutionAlternative {
    public int minChanges(int n, int k) {
        if ((n & k) != k) {
            return -1;
        }

        int bitsToChange = n & ~k;
        int count = 0;

        // Brian Kernighan's algorithm
        while (bitsToChange != 0) {
            // Clear the least significant 1-bit
            bitsToChange &= bitsToChange - 1;
            count++;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- The bitwise operations (`&`, `~`, `!=`) are constant time
- Counting 1-bits is O(number of bits) = O(32) = O(1) for 32-bit integers
- Even with Brian Kernighan's algorithm, we only iterate through the number of 1-bits, which is at most 32

**Space Complexity:** O(1)

- We only use a few integer variables
- No additional data structures that grow with input size

## Common Mistakes

1. **Not checking impossibility first**: Some candidates start counting changes without verifying if the transformation is possible. Remember: if `k` has any 1-bit where `n` has a 0-bit, return -1 immediately.

2. **Using string conversion unnecessarily**: While converting to binary strings and comparing characters works, it's less efficient and more error-prone than bitwise operations. Interviewers prefer the bit manipulation approach for bit-related problems.

3. **Off-by-one in bit counting**: When manually counting bits, ensure your loop terminates correctly. Brian Kernighan's algorithm (`n &= n - 1`) is a clean way to count bits without off-by-one errors.

4. **Forgetting that n and k are positive integers**: The problem states they're positive, so we don't need to handle negative numbers or zero specially (though the solution works for zero too).

5. **Misunderstanding the operation**: Some candidates think they can change 0→1 as well. Read carefully: you can only change 1→0, never 0→1.

## When You'll See This Pattern

This problem tests understanding of **bit masking** and **subset bit checking**. The pattern `(a & b) == b` checks if all 1-bits in `b` are also 1 in `a`, which is useful for:

1. **Subset checking in bitmask problems**: In problems where you represent sets as bitmasks, checking if one set is a subset of another uses this pattern.

2. **Power of Two**: `(n & (n-1)) == 0` checks if a number is a power of two (has exactly one 1-bit).

3. **Single Number variations**: Problems like "Single Number" (LeetCode 136) and "Single Number II" (LeetCode 137) use similar bit manipulation techniques.

4. **Minimum Flips to Make a OR b Equal to c** (LeetCode 1318): Similar bit-by-bit analysis of what changes are needed.

## Key Takeaways

1. **Bitmask subset checking**: `(a & b) == b` is a concise way to check if all 1-bits in `b` are present in `a`. This is useful whenever you need to verify one bitmask is a subset of another.

2. **Extracting difference bits**: `a & ~b` gives bits that are 1 in `a` but 0 in `b`. This pattern appears when you need to find elements present in one set but not another.

3. **Brian Kernighan's algorithm**: `n &= n - 1` clears the least significant 1-bit. Use this to count 1-bits efficiently or iterate through set bits.

4. **Read operations carefully**: The constraint "can only change 1 to 0" makes this problem different from general edit distance. Always verify what operations are allowed before designing your solution.

[Practice this problem on CodeJeet](/problem/number-of-bit-changes-to-make-two-integers-equal)
