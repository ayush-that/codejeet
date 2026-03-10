---
title: "How to Solve Count Distinct Numbers on Board — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Distinct Numbers on Board. Easy difficulty, 61.7% acceptance rate. Topics: Array, Hash Table, Math, Simulation."
date: "2028-03-31"
category: "dsa-patterns"
tags: ["count-distinct-numbers-on-board", "array", "hash-table", "math", "easy"]
---

# How to Solve Count Distinct Numbers on Board

This problem asks us to simulate a process where numbers are added to a board based on a specific rule, but there's a clever mathematical insight that makes the simulation unnecessary. The tricky part is recognizing that the process stabilizes almost immediately, and we can derive a simple formula instead of simulating 10⁹ days.

## Visual Walkthrough

Let's trace through an example with `n = 5`:

**Day 0:** Only `5` is on the board.

**Day 1:** For each number `x` on the board, we find all `i` where `x % i == 1`.

- For `x = 5`: We need `5 % i == 1`
  - `i = 2`: `5 % 2 = 1` ✓ → add `2`
  - `i = 4`: `5 % 4 = 1` ✓ → add `4`
  - Other `i` values don't satisfy the condition
- Board now has: `5, 2, 4`

**Day 2:** Process repeats with all current numbers:

- For `x = 5`: Same as before → would add `2, 4` (already present)
- For `x = 2`: `2 % i == 1`
  - `i = 1`: `2 % 1 = 0` ✗
  - No `i` satisfies this for `x = 2`
- For `x = 4`: `4 % i == 1`
  - `i = 3`: `4 % 3 = 1` ✓ → add `3`
  - Board now has: `5, 2, 4, 3`

**Day 3:** Process repeats:

- For `x = 3`: `3 % i == 1`
  - `i = 2`: `3 % 2 = 1` ✓ → `2` already present
  - No new numbers added

The board now has `{2, 3, 4, 5}`. Notice that `1` is missing because no number `x` can satisfy `x % 1 == 1` (since `x % 1` is always 0).

The key observation: **Numbers from 2 to n will eventually appear on the board, but 1 will never appear.**

## Brute Force Approach

A naive approach would simulate all 10⁹ days exactly as described:

1. Start with a set containing only `n`
2. For each day up to 10⁹:
   - For each number `x` currently on the board
   - For each `i` from 1 to `n`
   - If `x % i == 1`, add `i` to the board
3. Return the size of the set

This approach has several problems:

- 10⁹ iterations is computationally impossible
- Even with optimization, the nested loops make this O(10⁹ × board_size × n)
- The board grows quickly, making each iteration slower

However, we don't need to simulate because we can observe the pattern: once a number appears, it stays forever, and numbers propagate downward from `n`.

## Optimal Solution

The mathematical insight is that for any number `x > 1`, we can always find some `i` such that `x % i == 1`. Specifically:

- If `x > 2`, then `x % (x-1) == 1` (since `x = (x-1) + 1`)
- This means `x-1` will be added to the board
- This creates a chain: `n` adds `n-1`, `n-1` adds `n-2`, and so on
- The chain stops at 2 because `2 % 1 ≠ 1`

Therefore, all numbers from 2 to n will eventually appear on the board. The only exception is when `n = 1`, where the board only contains 1.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def distinctIntegers(self, n: int) -> int:
    """
    Returns the count of distinct numbers that will appear on the board
    after 10^9 days of the given process.

    The key insight: All numbers from 2 to n will eventually appear,
    but 1 will never appear (except when n = 1).

    Args:
        n: The initial number placed on the board

    Returns:
        The count of distinct integers on the board
    """
    # Special case: if n == 1, only 1 is on the board
    if n == 1:
        return 1

    # For n > 1, all numbers from 2 to n will appear
    # So the count is n - 1 (excluding 1) + 1 (including n itself)
    # Wait, that's just n - 1... Let's think carefully:
    # Numbers on board: 2, 3, 4, ..., n
    # That's n - 1 numbers total

    return n - 1
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Returns the count of distinct numbers that will appear on the board
 * after 10^9 days of the given process.
 *
 * The key insight: All numbers from 2 to n will eventually appear,
 * but 1 will never appear (except when n = 1).
 *
 * @param {number} n - The initial number placed on the board
 * @return {number} The count of distinct integers on the board
 */
var distinctIntegers = function (n) {
  // Special case: if n == 1, only 1 is on the board
  if (n === 1) {
    return 1;
  }

  // For n > 1, all numbers from 2 to n will appear
  // That's n - 1 numbers total
  return n - 1;
};
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Returns the count of distinct numbers that will appear on the board
     * after 10^9 days of the given process.
     *
     * The key insight: All numbers from 2 to n will eventually appear,
     * but 1 will never appear (except when n = 1).
     *
     * @param n The initial number placed on the board
     * @return The count of distinct integers on the board
     */
    public int distinctIntegers(int n) {
        // Special case: if n == 1, only 1 is on the board
        if (n == 1) {
            return 1;
        }

        // For n > 1, all numbers from 2 to n will appear
        // That's n - 1 numbers total
        return n - 1;
    }
}
```

</div>

Wait, let's double-check our logic with the example `n = 5`. Our formula gives `5 - 1 = 4`, which matches our visual walkthrough where we got `{2, 3, 4, 5}` (4 numbers).

Actually, let me reconsider: The initial number `n` is already on the board. Then we add `n-1`, then `n-2`, etc. So the total is all numbers from 2 to n inclusive. That's `n - 1` numbers (since we exclude 1).

But what about `n = 2`? Our formula gives `2 - 1 = 1`. Let's verify:

- Day 0: Board has `2`
- Day 1: For `x = 2`, find `i` where `2 % i == 1`
  - No `i` satisfies this (2 % 1 = 0, can't use i = 2)
- So board only has `2` → 1 number ✓

What about `n = 3`? Formula gives `3 - 1 = 2`:

- Day 0: Board has `3`
- Day 1: For `x = 3`, find `i` where `3 % i == 1`
  - `i = 2`: `3 % 2 = 1` ✓ → add `2`
- Board has `{2, 3}` → 2 numbers ✓

The formula works!

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a simple conditional check and arithmetic operation
- No loops or recursion needed

**Space Complexity:** O(1)

- We only use a constant amount of extra space
- No data structures that grow with input size

## Common Mistakes

1. **Attempting to simulate the process:** The most common mistake is trying to actually simulate 10⁹ days. Candidates see "for 10⁹ days" and think they need to write a loop. The huge number is a hint that there's a mathematical shortcut.

2. **Incorrect handling of n = 1:** Many candidates return `n - 1 = 0` for `n = 1`, but the correct answer is 1. Always test edge cases!

3. **Off-by-one errors:** Some candidates return `n` (thinking all numbers 1 to n appear) or `n - 2` (miscounting the range). Always test with small examples: n=1,2,3,5.

4. **Overcomplicating with sets and simulation:** Even if recognizing the pattern, some candidates still write simulation code for a few iterations "to be safe." This adds unnecessary complexity and potential bugs.

## When You'll See This Pattern

This problem teaches **mathematical simplification of simulation problems**. When you see:

1. A process that runs for an extremely large number of steps (like 10⁹)
2. A process where states propagate or create chains
3. A problem that seems to require simulation but has a simple closed-form solution

Look for patterns in small examples and try to derive a formula.

Related problems that use similar patterns:

1. **Count of Matches in Tournament (Easy)** - A tournament elimination process that seems to require simulation but has a simple mathematical solution (n-1 matches total).

2. **Bulb Switcher (Medium)** - Bulbs toggled multiple times; the pattern emerges from analyzing divisors rather than simulating all toggles.

3. **Nim Game (Easy)** - A game theory problem where the optimal strategy can be determined mathematically without simulating all moves.

## Key Takeaways

1. **Large iteration counts are hints:** When a problem mentions an extremely large number of iterations (like 10⁹), it's almost always a clue that you should look for a mathematical pattern rather than simulating.

2. **Test small cases systematically:** By working through examples with n=1,2,3,4,5, you can often spot patterns that lead to a general formula.

3. **Look for propagation chains:** In this problem, numbers create a chain reaction (n → n-1 → n-2 → ...). Recognizing such propagation patterns helps simplify many simulation problems.

Related problems: [Count of Matches in Tournament](/problem/count-of-matches-in-tournament)
