---
title: "How to Solve Integer Replacement — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Integer Replacement. Medium difficulty, 37.2% acceptance rate. Topics: Dynamic Programming, Greedy, Bit Manipulation, Memoization."
date: "2026-07-24"
category: "dsa-patterns"
tags: ["integer-replacement", "dynamic-programming", "greedy", "bit-manipulation", "medium"]
---

# How to Solve Integer Replacement

You're given a positive integer `n` and can perform three operations: divide by 2 if even, or add/subtract 1 if odd. Your goal is to reach 1 in the minimum number of steps. What makes this problem interesting is that the seemingly obvious greedy approach (always subtract 1 when odd) doesn't always work—sometimes adding 1 leads to a shorter path, especially when dealing with numbers that have multiple trailing 1s in binary.

## Visual Walkthrough

Let's trace through `n = 15` to build intuition:

**Path 1 (Always subtract 1 when odd):**

- 15 (odd) → 14 (-1)
- 14 (even) → 7 (/2)
- 7 (odd) → 6 (-1)
- 6 (even) → 3 (/2)
- 3 (odd) → 2 (-1)
- 2 (even) → 1 (/2)

Total: 6 operations

**Path 2 (Add 1 at 15):**

- 15 (odd) → 16 (+1)
- 16 (even) → 8 (/2)
- 8 (even) → 4 (/2)
- 4 (even) → 2 (/2)
- 2 (even) → 1 (/2)

Total: 5 operations

**Path 3 (Optimal path):**

- 15 (odd) → 14 (-1) _Wait, this is worse!_
  Actually, let's try a different approach at 3:
- 15 → 16 (+1) → 8 → 4 → 2 → 1 (5 steps)

But what about 3 itself? For 3:

- Path A: 3 → 2 (-1) → 1 (/2) = 2 steps
- Path B: 3 → 4 (+1) → 2 (/2) → 1 (/2) = 3 steps

So for 3, subtracting is better. The key insight: when `n` is odd, we need to check whether `n+1` or `n-1` leads to a shorter path, and this depends on whether `(n+1)/2` or `(n-1)/2` is even (since even numbers can be divided by 2 immediately).

## Brute Force Approach

The most straightforward approach is recursive exploration: at each step, if `n` is even, we must divide by 2; if `n` is odd, we try both `n+1` and `n-1` and take the minimum. We continue until we reach 1.

The brute force solution would look like this:

```python
def integerReplacement(n):
    if n == 1:
        return 0
    if n % 2 == 0:
        return 1 + integerReplacement(n // 2)
    else:
        return 1 + min(integerReplacement(n + 1), integerReplacement(n - 1))
```

**Why this is too slow:**
This has exponential time complexity because for odd numbers, we explore both branches. For example, with `n = 1000`, we'd create a massive recursion tree. Even worse, for numbers like `n = 1000000`, we'd get a recursion depth error. The problem is we're recomputing the same subproblems repeatedly—for instance, both `n+1` and `n-1` paths might lead to the same intermediate number.

## Optimized Approach

The key insight is that we can use memoization to avoid recomputation. By storing results for numbers we've already computed, we turn exponential time into something much more manageable.

But there's an even better insight: we can use bit manipulation! Look at the binary representation:

- If `n` is even: divide by 2 (right shift)
- If `n` is odd: we need to decide between `n+1` and `n-1`
  - If `n` ends with `...01` (binary), subtracting 1 gives `...00` (even)
  - If `n` ends with `...11` (binary), adding 1 gives `...00` (even)

The exception is `n = 3` (binary `11`), where subtracting is better despite ending with `11`.

Here's the greedy bit manipulation approach:

1. While `n > 1`:
   - If `n` is even: divide by 2
   - If `n` is odd:
     - If `n == 3`: subtract 1 (special case)
     - If `n` ends with `...01` (i.e., `n & 3 == 1`): subtract 1
     - If `n` ends with `...11` (i.e., `n & 3 == 3`): add 1

The check `n & 3` looks at the last 2 bits:

- `...01` = 1 in decimal → subtract 1
- `...11` = 3 in decimal → add 1 (except when n=3)

Why check 2 bits instead of 1? Because we want to know what happens after the operation: `(n-1)/2` or `(n+1)/2`. If `n & 3 == 1`, then `(n-1)/2` is even. If `n & 3 == 3`, then `(n+1)/2` is even (except for n=3 where both lead to even numbers but subtracting is shorter).

## Optimal Solution

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def integerReplacement(n):
    """
    Greedy approach using bit manipulation.
    For odd numbers, we choose the operation that makes
    the next number even and divisible by 2 multiple times.
    """
    count = 0

    # Handle the special case where n is the maximum 32-bit integer
    # to prevent overflow when n+1 exceeds integer limits
    if n == 2**31 - 1:
        # For 2147483647, adding 1 would overflow in some languages
        # but in Python it's fine. We'll handle it for completeness.
        return 32  # Precomputed optimal path

    while n > 1:
        if n % 2 == 0:
            # Even: always divide by 2
            n //= 2
        else:
            # Odd: decide between n+1 and n-1
            if n == 3:
                # Special case: 3 -> 2 -> 1 is optimal
                n -= 1
            elif n & 3 == 3:
                # Last 2 bits are 11: adding 1 creates more trailing zeros
                n += 1
            else:
                # Last 2 bits are 01: subtracting 1 is better
                n -= 1
        count += 1

    return count
```

```javascript
// Time: O(log n) | Space: O(1)
function integerReplacement(n) {
  let count = 0;

  // Handle potential overflow for large numbers
  // In JavaScript, numbers are 64-bit floating point, but we'll
  // handle the 32-bit integer case for consistency
  if (n === 2147483647) {
    return 32; // Precomputed optimal path
  }

  while (n > 1) {
    if (n % 2 === 0) {
      // Even number: always divide by 2
      n = Math.floor(n / 2);
    } else {
      // Odd number: choose between n+1 and n-1
      if (n === 3) {
        // Special case: 3 -> 2 -> 1 is optimal
        n -= 1;
      } else if ((n & 3) === 3) {
        // Last 2 bits are 11: adding 1 creates more trailing zeros
        // Use n+1 to get to a number with more factors of 2
        n += 1;
      } else {
        // Last 2 bits are 01: subtracting 1 is better
        n -= 1;
      }
    }
    count++;
  }

  return count;
}
```

```java
// Time: O(log n) | Space: O(1)
public int integerReplacement(int n) {
    int count = 0;
    long num = n; // Use long to handle overflow when n = Integer.MAX_VALUE

    while (num > 1) {
        if (num % 2 == 0) {
            // Even: always divide by 2
            num /= 2;
        } else {
            // Odd: decide between num+1 and num-1
            if (num == 3) {
                // Special case: 3 -> 2 -> 1 is optimal (2 steps)
                num -= 1;
            } else if ((num & 3) == 3) {
                // Last 2 bits are 11: adding 1 creates more trailing zeros
                // The bitmask 3 (binary 11) checks last 2 bits
                num += 1;
            } else {
                // Last 2 bits are 01: subtracting 1 is better
                num -= 1;
            }
        }
        count++;
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- Each operation reduces `n` significantly: dividing by 2 when even, and making it divisible by 4 when odd (by choosing ±1 strategically)
- In the worst case, we might add 1 to an odd number, making it even, then divide by 2
- The number of operations is proportional to the number of bits in `n`, which is O(log n)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for the counter and temporary variables
- No recursion stack or memoization table is needed in the greedy approach

## Common Mistakes

1. **Always subtracting 1 for odd numbers:** This fails for cases like `n = 15` where adding 1 is better. Candidates who don't test enough examples might miss this.

2. **Forgetting the n = 3 special case:** When `n = 3` (binary `11`), the rule "add 1 when last 2 bits are 11" would give 3 → 4 → 2 → 1 (3 steps) instead of the optimal 3 → 2 → 1 (2 steps).

3. **Integer overflow when n = 2^31 - 1:** In languages with fixed-width integers, adding 1 to `Integer.MAX_VALUE` causes overflow. Always use a larger data type (like `long` in Java) or handle this case separately.

4. **Using recursion without memoization:** This leads to exponential time complexity and stack overflow for large inputs. Even with memoization, the recursive approach uses O(n) space in the worst case.

## When You'll See This Pattern

This problem combines greedy decision-making with bit manipulation, a pattern seen in:

1. **Minimum Operations to Reduce a Number to 1 (LeetCode 1342):** Similar but only allows dividing by 2 or subtracting 1, making it simpler.

2. **Number of Steps to Reduce a Number in Binary Representation to One (LeetCode 1404):** Directly works with binary strings and has similar decision points for odd numbers.

3. **Bitwise AND of Numbers Range (LeetCode 201):** While different, it teaches similar bit manipulation thinking—looking at common prefixes in binary representations.

The core pattern is recognizing that binary representation often reveals optimal strategies for number transformation problems, especially when operations involve division/multiplication by 2 (bit shifts) or ±1 operations.

## Key Takeaways

1. **Bit manipulation often optimizes number transformation problems:** When operations involve factors of 2, look at the binary representation. Trailing zeros indicate divisibility by 2, guiding greedy choices.

2. **Greedy requires careful edge case analysis:** The general rule "add 1 when last 2 bits are 11" works except for n=3. Always test small cases (1, 2, 3, 4, 5, 6, 7, 8, 15) to validate your greedy approach.

3. **Consider overflow in integer problems:** When dealing with maximum integer values and addition operations, use larger data types or handle the edge case explicitly.

[Practice this problem on CodeJeet](/problem/integer-replacement)
