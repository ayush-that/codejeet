---
title: "How to Solve Smallest Integer Divisible by K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Integer Divisible by K. Medium difficulty, 54.3% acceptance rate. Topics: Hash Table, Math."
date: "2026-03-23"
category: "dsa-patterns"
tags: ["smallest-integer-divisible-by-k", "hash-table", "math", "medium"]
---

# How to Solve Smallest Integer Divisible by K

This problem asks us to find the length of the smallest number consisting only of digit '1' that is divisible by a given positive integer `k`. The challenge is that this number could be enormous—far beyond what fits in standard integer types—so we can't directly compute it. Instead, we need a clever mathematical approach that works with remainders.

## Visual Walkthrough

Let's trace through an example with `k = 7`. We're looking for the smallest number made of only 1's that is divisible by 7.

We'll build numbers incrementally:

- `1` → remainder when divided by 7 is `1`
- `11` → remainder is `4` (since 11 ÷ 7 = 1 remainder 4)
- `111` → remainder is `6` (111 ÷ 7 = 15 remainder 6)
- `1111` → remainder is `5` (1111 ÷ 7 = 158 remainder 5)
- `11111` → remainder is `2` (11111 ÷ 7 = 1587 remainder 2)
- `111111` → remainder is `0` (111111 ÷ 7 = 15873 exactly)

We found it! The number `111111` has length 6 and is divisible by 7. Notice we never actually computed the full number—we only tracked remainders. This is key because remainders stay small (between 0 and k-1) while the actual numbers grow exponentially.

## Brute Force Approach

A naive approach would be to generate numbers 1, 11, 111, 1111, ... and check divisibility by `k`. However, this fails for two reasons:

1. **Integer overflow**: Even for moderately sized `k`, the answer might require a number with thousands of digits, far beyond 64-bit integer limits.
2. **Inefficiency**: If no such number exists, we'd loop forever. We need to know when to stop.

A slightly better brute force would use modular arithmetic to avoid overflow:

- Start with `remainder = 0`
- For length from 1 to some large limit:
  - Update remainder: `remainder = (remainder * 10 + 1) % k`
  - If remainder becomes 0, return current length

But when do we stop? We can't loop forever. The key insight: if we see the same remainder twice, we're in a cycle and will never reach 0. This gives us our stopping condition.

## Optimized Approach

The optimal solution uses modular arithmetic and cycle detection:

**Key Insight**:

- Numbers made of only 1's follow a pattern: `1, 11, 111, 1111, ...`
- We can generate these numbers modulo `k` without overflow: if `n` has remainder `r`, then `n*10 + 1` has remainder `(r*10 + 1) % k`
- By the pigeonhole principle, there are only `k` possible remainders (0 to k-1)
- If we don't reach remainder 0 within `k` steps, we must have seen some remainder twice, creating a cycle that will never reach 0

**Step-by-step reasoning**:

1. Initialize `remainder = 0` (we haven't built any number yet)
2. For `length` from 1 to `k` (inclusive):
   - Compute next remainder: `remainder = (remainder * 10 + 1) % k`
   - If remainder becomes 0, return `length` (we found our number)
3. If we finish the loop without finding remainder 0, return -1 (no such number exists)

**Why does this work?**

- We check up to `k` numbers because if a solution exists, it must appear within the first `k` numbers in the sequence (by the pigeonhole principle)
- If we don't find it within `k` steps, the remainders will cycle and we'll never reach 0
- This algorithm runs in O(k) time and O(1) space

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(k) - We check at most k remainders
# Space: O(1) - We only store the current remainder
def smallestRepunitDivByK(k: int) -> int:
    # If k is even or divisible by 5, no number made of only 1's can be divisible by k
    # because any number ending with 1 is not divisible by 2 or 5
    if k % 2 == 0 or k % 5 == 0:
        return -1

    remainder = 0
    # We need to check at most k numbers
    # If we don't find a solution in k steps, we'll never find one
    for length in range(1, k + 1):
        # Build the next number in the sequence: n = n * 10 + 1
        # But we only care about the remainder modulo k
        remainder = (remainder * 10 + 1) % k

        # If remainder is 0, we found our number
        if remainder == 0:
            return length

    # If we've checked k numbers and none worked, no solution exists
    return -1
```

```javascript
// Time: O(k) - We check at most k remainders
// Space: O(1) - We only store the current remainder
function smallestRepunitDivByK(k) {
  // If k is even or divisible by 5, no number made of only 1's can be divisible by k
  // because any number ending with 1 is not divisible by 2 or 5
  if (k % 2 === 0 || k % 5 === 0) {
    return -1;
  }

  let remainder = 0;
  // We need to check at most k numbers
  // If we don't find a solution in k steps, we'll never find one
  for (let length = 1; length <= k; length++) {
    // Build the next number in the sequence: n = n * 10 + 1
    // But we only care about the remainder modulo k
    remainder = (remainder * 10 + 1) % k;

    // If remainder is 0, we found our number
    if (remainder === 0) {
      return length;
    }
  }

  // If we've checked k numbers and none worked, no solution exists
  return -1;
}
```

```java
// Time: O(k) - We check at most k remainders
// Space: O(1) - We only store the current remainder
class Solution {
    public int smallestRepunitDivByK(int k) {
        // If k is even or divisible by 5, no number made of only 1's can be divisible by k
        // because any number ending with 1 is not divisible by 2 or 5
        if (k % 2 == 0 || k % 5 == 0) {
            return -1;
        }

        int remainder = 0;
        // We need to check at most k numbers
        // If we don't find a solution in k steps, we'll never find one
        for (int length = 1; length <= k; length++) {
            // Build the next number in the sequence: n = n * 10 + 1
            // But we only care about the remainder modulo k
            remainder = (remainder * 10 + 1) % k;

            // If remainder is 0, we found our number
            if (remainder == 0) {
                return length;
            }
        }

        // If we've checked k numbers and none worked, no solution exists
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(k)

- In the worst case, we iterate up to `k` times (when k is prime and not divisible by 2 or 5)
- Each iteration does constant work: one multiplication, one addition, and one modulo operation
- The early return for even numbers and multiples of 5 improves practical performance but doesn't change worst-case complexity

**Space Complexity**: O(1)

- We only use a few integer variables (`remainder`, `length`, and the input `k`)
- No additional data structures are needed

## Common Mistakes

1. **Trying to store the actual number**: Candidates often try to build the number as an integer (1, 11, 111, ...) which quickly overflows. Remember: we only need remainders, not the actual values.

2. **Infinite loops**: Without the `k` iteration limit, the algorithm would loop forever when no solution exists. The pigeonhole principle guarantees we only need to check `k` numbers.

3. **Missing the early optimization**: While not strictly necessary, checking if `k` is even or divisible by 5 provides an immediate answer (-1) and improves efficiency. Numbers ending with 1 cannot be divisible by 2 or 5.

4. **Off-by-one errors in the loop**: The loop should run from 1 to `k` inclusive (not `k-1`). We're checking `k` possible remainders, and the answer could be exactly `k`.

## When You'll See This Pattern

This problem combines **modular arithmetic** with **cycle detection**—a pattern that appears in several other LeetCode problems:

1. **Happy Number (LeetCode 202)**: Uses cycle detection to determine if a number eventually reaches 1 when repeatedly summing squares of digits. Similar to our remainder tracking.

2. **Fraction to Recurring Decimal (LeetCode 166)**: Uses remainder tracking to detect repeating cycles in decimal expansions, storing remainders in a hash map to identify when repetition begins.

3. **Linked List Cycle II (LeetCode 142)**: While not about modular arithmetic, it uses Floyd's cycle detection algorithm, which is conceptually similar to detecting repeating remainders.

The core pattern: when dealing with sequences that could repeat or cycle, track visited states (remainders, sums, nodes) and detect when you revisit a state.

## Key Takeaways

1. **Modular arithmetic avoids overflow**: When dealing with potentially huge numbers, work with remainders modulo some value instead of the actual numbers.

2. **Pigeonhole principle for cycle detection**: If you have `n` possible states and make more than `n` transitions, you must revisit a state, creating a cycle. This gives you a stopping condition.

3. **Look for mathematical optimizations**: Simple observations (like numbers ending in 1 can't be divisible by 2 or 5) can dramatically improve efficiency, even if the asymptotic complexity remains the same.

[Practice this problem on CodeJeet](/problem/smallest-integer-divisible-by-k)
