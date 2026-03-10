---
title: "How to Solve Find Nth Smallest Integer With K One Bits — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Nth Smallest Integer With K One Bits. Hard difficulty, 34.1% acceptance rate. Topics: Math, Bit Manipulation, Combinatorics."
date: "2026-06-15"
category: "dsa-patterns"
tags:
  ["find-nth-smallest-integer-with-k-one-bits", "math", "bit-manipulation", "combinatorics", "hard"]
---

# How to Solve "Find Nth Smallest Integer With K One Bits"

You're given two integers `n` and `k`, and need to find the `n`-th smallest positive integer whose binary representation contains exactly `k` ones. The challenge is that we can't simply iterate through numbers (too slow), and must instead use combinatorial reasoning to directly construct the answer. This problem is tricky because it requires thinking about numbers as bit patterns and using combinations to count how many valid numbers exist below certain thresholds.

## Visual Walkthrough

Let's trace through an example: `n = 3, k = 2`

We need the 3rd smallest number with exactly 2 ones in binary. Let's list them in order:

1. `3` (binary `11`) - ones at positions 0 and 1
2. `5` (binary `101`) - ones at positions 0 and 2
3. `6` (binary `110`) - ones at positions 1 and 2
4. `9` (binary `1001`) - ones at positions 0 and 3
   ... and so on.

Our answer should be `6`. But how do we find this systematically without listing all numbers?

The key insight: Numbers with exactly `k` ones are determined by which bit positions contain the ones. If we think about placing `k` ones in `m` possible bit positions (from least significant bit 0 to position `m-1`), there are `C(m, k)` such numbers where the highest one is at position `m-1`.

For example, with `k=2` ones:

- With highest bit at position 1: `C(2, 2) = 1` number (`11` = 3)
- With highest bit at position 2: `C(3, 2) = 3` numbers (`101`, `110`, `011` but `011` = 3 is same as above)
- With highest bit at position 3: `C(4, 2) = 6` numbers

We can use this counting to find where our target number lies.

## Brute Force Approach

A naive approach would be to iterate through all positive integers, count the ones in their binary representation, and collect those with exactly `k` ones until we have `n` of them:

<div class="code-group">

```python
def nthSmallestBruteForce(n: int, k: int) -> int:
    count = 0
    num = 0

    while count < n:
        num += 1
        # Count ones in binary representation
        ones = bin(num).count('1')
        if ones == k:
            count += 1

    return num
```

```javascript
function nthSmallestBruteForce(n, k) {
  let count = 0;
  let num = 0;

  while (count < n) {
    num++;
    // Count ones in binary representation
    let ones = num.toString(2).split("1").length - 1;
    if (ones === k) {
      count++;
    }
  }

  return num;
}
```

```java
public int nthSmallestBruteForce(int n, int k) {
    int count = 0;
    int num = 0;

    while (count < n) {
        num++;
        // Count ones in binary representation
        int ones = Integer.bitCount(num);
        if (ones == k) {
            count++;
        }
    }

    return num;
}
```

</div>

**Why this fails:** The problem guarantees the answer is less than 250, but in the worst case (like `n=100, k=50`), we might need to check thousands of numbers. More importantly, this approach doesn't scale conceptually - an interviewer expects the combinatorial solution. The brute force has O(answer) time complexity, which could be up to O(2^k) in theory.

## Optimized Approach

The optimal solution uses combinatorial counting to directly construct the answer:

1. **Representation**: Any number with exactly `k` ones can be represented by the positions of those ones. For example, `101` (5) has ones at positions 0 and 2.

2. **Counting principle**: For a given highest bit position `m`, there are `C(m, k-1)` numbers with `k` ones where the highest one is at position `m`. Why `k-1`? Because one of the `k` ones is fixed at position `m`, and we need to choose `k-1` positions from the `m` lower positions.

3. **Search strategy**: We determine the bit positions from most significant to least significant:
   - Start with the highest possible bit position
   - At each position, count how many numbers would have a 0 at this position
   - If that count is less than `n`, we must place a 1 here and adjust `n`
   - Otherwise, we place a 0 and continue

4. **Example with n=3, k=2**:
   - Position 3: Count with 0 at position 3 = `C(3, 2) = 3`. Since 3 ≥ n=3, place 0.
   - Position 2: Count with 0 at position 2 = `C(2, 2) = 1`. Since 1 < n=3, place 1. Now we have 1 one placed, need 1 more. Adjust n = 3 - 1 = 2.
   - Position 1: With a 1 already placed, we need 1 more one. Count with 0 at position 1 = `C(1, 1) = 1`. Since 1 < n=2, place 1. Done.
   - Result: bits at positions 2 and 1 are 1 → `110` = 6.

## Optimal Solution

<div class="code-group">

```python
def nthSmallest(n: int, k: int) -> int:
    """
    Returns the n-th smallest integer with exactly k ones in binary.
    Time: O(log^2(answer)) - we check up to log(answer) positions,
          each requiring combination calculations
    Space: O(1) - we only store a few variables
    """
    result = 0

    # We'll determine bits from most significant to least significant
    # Start from a high bit position down to 0
    for bit_pos in range(60, -1, -1):
        # If we place 0 at current position, how many numbers are possible
        # with the remaining lower positions?
        if bit_pos >= k - 1:
            # C(bit_pos, k-1) counts numbers where current bit is 0
            # and we have k ones in total (all in lower positions)
            count = comb(bit_pos, k - 1)
        else:
            count = 0  # Not enough positions for k ones

        if count < n:
            # We need the n-th number, and there are 'count' numbers
            # with 0 at this position. So our number must have 1 here.
            result |= (1 << bit_pos)  # Set this bit to 1
            n -= count  # Remove those counted numbers from our search
            k -= 1  # We've used one of our k ones

            # If we've placed all k ones, fill remaining bits with 0
            if k == 0:
                break
        # else: count >= n, so we place 0 at this position and continue

    return result

# Helper function to compute combinations C(n, k)
def comb(n: int, k: int) -> int:
    """Compute binomial coefficient C(n, k) efficiently."""
    if k < 0 or k > n:
        return 0
    if k > n - k:
        k = n - k  # Use symmetry property

    result = 1
    for i in range(1, k + 1):
        result = result * (n - i + 1) // i

    return result
```

```javascript
function nthSmallest(n, k) {
  /**
   * Returns the n-th smallest integer with exactly k ones in binary.
   * Time: O(log^2(answer)) - we check up to log(answer) positions,
   *       each requiring combination calculations
   * Space: O(1) - we only store a few variables
   */
  let result = 0;

  // Helper function to compute combinations C(n, k)
  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    if (k > n - k) k = n - k; // Use symmetry property

    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = (res * (n - i + 1)) / i;
    }
    return Math.floor(res);
  }

  // Determine bits from most significant to least significant
  // 60 bits is enough since answer < 2^50
  for (let bitPos = 60; bitPos >= 0; bitPos--) {
    // Count how many numbers have 0 at current position
    let count = 0;
    if (bitPos >= k - 1) {
      count = comb(bitPos, k - 1);
    }

    if (count < n) {
      // Must place 1 at this position
      result |= 1 << bitPos;
      n -= count; // Skip the 'count' numbers with 0 here
      k--; // Used one of our k ones

      if (k === 0) {
        break; // All ones placed
      }
    }
    // else: place 0 (do nothing) and continue
  }

  return result;
}
```

```java
public int nthSmallest(int n, int k) {
    /**
     * Returns the n-th smallest integer with exactly k ones in binary.
     * Time: O(log^2(answer)) - we check up to log(answer) positions,
     *       each requiring combination calculations
     * Space: O(1) - we only store a few variables
     */
    int result = 0;

    // Determine bits from most significant to least significant
    // 60 bits is enough since answer < 2^50
    for (int bitPos = 60; bitPos >= 0; bitPos--) {
        // Count how many numbers have 0 at current position
        long count = 0;
        if (bitPos >= k - 1) {
            count = comb(bitPos, k - 1);
        }

        if (count < n) {
            // Must place 1 at this position
            result |= (1 << bitPos);
            n -= count;  // Skip the 'count' numbers with 0 here
            k--;  // Used one of our k ones

            if (k == 0) {
                break;  // All ones placed
            }
        }
        // else: place 0 (do nothing) and continue
    }

    return result;
}

// Helper method to compute combinations C(n, k)
private long comb(int n, int k) {
    if (k < 0 || k > n) return 0;
    if (k > n - k) k = n - k; // Use symmetry property

    long result = 1;
    for (int i = 1; i <= k; i++) {
        result = result * (n - i + 1) / i;
    }
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log²M) where M is the maximum possible answer (250 in this case, so logM ≈ 50).

- We iterate through at most logM bit positions (outer loop)
- For each position, we compute a combination which takes O(k) time in our implementation
- Since k ≤ logM, overall complexity is O(log²M)

**Space Complexity:** O(1) - we only use a constant amount of extra space for variables like `result`, `n`, `k`, and loop counters.

## Common Mistakes

1. **Off-by-one errors in combination calculations**: Using `C(bit_pos, k)` instead of `C(bit_pos, k-1)` when counting numbers with 0 at current position. Remember: if we place 0 at current position, all k ones must be in lower positions.

2. **Not handling the case when k becomes 0**: After placing all k ones, we should break out of the loop or ensure we don't try to compute `C(bit_pos, -1)`. The code should check `if k == 0: break`.

3. **Integer overflow in combination calculations**: With larger inputs, `C(50, 25)` is huge (~1.26×10¹⁴). We need to use 64-bit integers (long in Java, normal ints are fine in Python). Our problem constraints keep numbers manageable, but it's good practice.

4. **Incorrect bit position range**: Starting from too low of a bit position might miss the answer. Since answer < 250, we need at most 60 bits (2⁶⁰ is much larger than needed).

## When You'll See This Pattern

This combinatorial bit construction pattern appears in several problems:

1. **"K-th Smallest in Lexicographical Order" (LeetCode 440)** - Similar idea of counting how many numbers are in subtrees to determine the next digit.

2. **"Find K-th Bit in Nth Binary String" (LeetCode 1545)** - Constructing binary strings based on recursive patterns, using similar counting principles.

3. **"Permutation Sequence" (LeetCode 60)** - Finding the k-th permutation by counting how many permutations start with each digit.

All these problems share the core technique: instead of generating all possibilities, use combinatorial counting to determine each digit/bit sequentially.

## Key Takeaways

1. **Think in terms of bit positions, not just numbers**: When a problem involves binary representations, consider the positions of bits as the fundamental building blocks.

2. **Combinatorial counting beats enumeration**: If you need to find the n-th object in a sorted sequence, count how many objects would come before candidates with certain properties.

3. **Construct from most significant to least significant**: For lexicographical or numerical order problems, determining higher-order digits/bits first often simplifies the counting logic.

[Practice this problem on CodeJeet](/problem/find-nth-smallest-integer-with-k-one-bits)
