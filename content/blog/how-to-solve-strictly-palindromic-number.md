---
title: "How to Solve Strictly Palindromic Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Strictly Palindromic Number. Medium difficulty, 90.2% acceptance rate. Topics: Math, Two Pointers, Brainteaser."
date: "2026-04-27"
category: "dsa-patterns"
tags: ["strictly-palindromic-number", "math", "two-pointers", "brainteaser", "medium"]
---

# How to Solve Strictly Palindromic Number

This problem asks us to determine if an integer `n` is **strictly palindromic** - meaning that for **every** base `b` from 2 to `n-2` inclusive, the string representation of `n` in base `b` is a palindrome. While this sounds like a straightforward brute force problem, there's a clever mathematical insight that makes it much simpler than it initially appears.

What makes this problem interesting is that it looks like it requires checking multiple bases (potentially up to `n-3` bases), but there's actually a mathematical proof that shows **no integer n ≥ 4 can be strictly palindromic**. This transforms what seems like a computational problem into a reasoning problem.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `n = 4`:

**Base 2:** 4 in base 2 is `100`. Is `100` a palindrome? No (100 ≠ 001).
**Base 3:** 4 in base 3 is `11`. Is `11` a palindrome? Yes.

Already we see that `n = 4` fails at base 2, so it's not strictly palindromic.

Now let's try `n = 5`:

- Base 2: `101` ← palindrome ✓
- Base 3: `12` ← not palindrome (12 ≠ 21) ✗

What about `n = 6`?

- Base 2: `110` ← not palindrome ✗
- Base 3: `20` ← not palindrome ✗
- Base 4: `12` ← not palindrome ✗

Let's check the edge cases:

- `n = 1`: No bases to check (n-2 = -1), so vacuously true
- `n = 2`: No bases to check (n-2 = 0), so vacuously true
- `n = 3`: Only base 2 to check: 3 in base 2 is `11` ← palindrome ✓

Notice a pattern? For `n ≥ 4`, we always seem to find at least one base where the representation isn't palindromic. Let's think about why...

## Brute Force Approach

The most straightforward approach is to literally do what the problem asks: for each base `b` from 2 to `n-2`, convert `n` to base `b`, check if it's a palindrome, and return `false` if any base fails.

**Algorithm:**

1. For each base `b` from 2 to `n-2`:
   - Convert `n` to base `b` string
   - Check if the string equals its reverse
   - If not, return `false`
2. If all bases pass, return `true`

**Why this is problematic:**

- For large `n`, we could be checking up to `n-3` bases
- Each base conversion takes O(log_b(n)) time
- Overall complexity could be O(n log n) in worst case
- But more importantly, this misses the mathematical insight that makes the problem trivial

## Optimized Approach

The key insight comes from examining base `n-2` specifically. For any `n ≥ 4`:

- In base `n-2`, the number `n` is represented as `12` (since n = 1\*(n-2) + 2)
- The string `"12"` is clearly not a palindrome
- Therefore, for any `n ≥ 4`, it fails to be palindromic in base `n-2`

Let's verify with examples:

- `n = 4`: base 2 gives `12` (4 = 1\*2 + 2) ← not palindrome
- `n = 5`: base 3 gives `12` (5 = 1\*3 + 2) ← not palindrome
- `n = 6`: base 4 gives `12` (6 = 1\*4 + 2) ← not palindrome

What about the edge cases?

- `n = 1`, `n = 2`: No bases to check (n-2 ≤ 0), so vacuously true
- `n = 3`: Only base 2 to check, and 3 in base 2 is `11` ← palindrome

Thus, the solution reduces to: **Return true only if n < 4**

## Optimal Solution

Now we can implement the optimal solution with O(1) time and space complexity:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def isStrictlyPalindromic(n: int) -> bool:
    """
    Returns True if n is strictly palindromic, False otherwise.

    Key Insight: For any n >= 4, in base (n-2), n is represented as "12",
    which is not a palindrome. Therefore, only n < 4 can be strictly palindromic.

    Args:
        n: The integer to check

    Returns:
        bool: True if strictly palindromic, False otherwise
    """
    # For n = 1, 2, 3:
    # - n=1,2: No bases to check (n-2 <= 0), so vacuously true
    # - n=3: Only base 2, where 3 = "11" (palindrome)
    # For n >= 4: Always fails in base (n-2) as "12" is not palindrome
    return n < 4
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Returns true if n is strictly palindromic, false otherwise.
 *
 * Key Insight: For any n >= 4, in base (n-2), n is represented as "12",
 * which is not a palindrome. Therefore, only n < 4 can be strictly palindromic.
 *
 * @param {number} n - The integer to check
 * @return {boolean} - True if strictly palindromic, false otherwise
 */
function isStrictlyPalindromic(n) {
  // For n = 1, 2, 3:
  // - n=1,2: No bases to check (n-2 <= 0), so vacuously true
  // - n=3: Only base 2, where 3 = "11" (palindrome)
  // For n >= 4: Always fails in base (n-2) as "12" is not palindrome
  return n < 4;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Returns true if n is strictly palindromic, false otherwise.
     *
     * Key Insight: For any n >= 4, in base (n-2), n is represented as "12",
     * which is not a palindrome. Therefore, only n < 4 can be strictly palindromic.
     *
     * @param n The integer to check
     * @return true if strictly palindromic, false otherwise
     */
    public boolean isStrictlyPalindromic(int n) {
        // For n = 1, 2, 3:
        // - n=1,2: No bases to check (n-2 <= 0), so vacuously true
        // - n=3: Only base 2, where 3 = "11" (palindrome)
        // For n >= 4: Always fails in base (n-2) as "12" is not palindrome
        return n < 4;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We only perform a single comparison operation regardless of input size
- No loops or recursion needed

**Space Complexity:** O(1)

- We only use a constant amount of extra space
- No data structures that grow with input size

## Common Mistakes

1. **Actually implementing the brute force check:** Many candidates waste time writing code to convert numbers to different bases and check palindromes. While this would technically work, it shows a lack of mathematical insight and could be inefficient for large `n`.

2. **Missing the edge cases n = 1, 2, 3:** Some candidates might incorrectly return `false` for these values. Remember:
   - `n = 1, 2`: No bases to check (n-2 ≤ 0), so vacuously true
   - `n = 3`: Only base 2, where 3 = "11" which is a palindrome

3. **Incorrect base range:** The problem specifies bases from 2 to `n-2` **inclusive**. Some might mistakenly check up to `n-1` or miss the inclusive part.

4. **Not recognizing the mathematical insight:** The most common mistake is treating this as a pure coding problem rather than recognizing it's a mathematical reasoning problem. In an interview, explaining the insight (base n-2 always gives "12") is more important than writing code.

## When You'll See This Pattern

This problem is an example of a **mathematical insight** or **brainteaser** problem where the apparent computational complexity hides a simple mathematical truth. Similar patterns appear in:

1. **Stone Game (LeetCode 877)** - At first glance, it seems like a complex game theory problem, but there's a mathematical proof that the first player always wins with optimal play.

2. **Nim Game (LeetCode 292)** - Another game theory problem where the winner can be determined by a simple modulo operation rather than simulating all possible moves.

3. **Bulb Switcher (LeetCode 319)** - Seems to require simulating bulb toggling, but reduces to counting perfect squares.

These problems teach us to look for mathematical properties before diving into implementation, especially when the problem statement involves checking many cases or has constraints that suggest a pattern.

## Key Takeaways

1. **Look for mathematical insights first:** When a problem involves checking many cases (like all bases from 2 to n-2), there's often a mathematical property that simplifies it. Try small examples to spot patterns.

2. **Check edge cases systematically:** Always test the smallest possible inputs (n=1,2,3 here) to understand boundary behavior. These often reveal the general pattern.

3. **Read constraints carefully:** The fact that we need to check "every base b between 2 and n-2" is crucial. Focusing on the extreme case (b = n-2) led to the key insight.

4. **Interview strategy:** When you spot a brainteaser like this, explain your reasoning process out loud. Show how you arrived at the insight by working through examples, then present the simple solution.

Related problems: [Palindrome Number](/problem/palindrome-number), [Stone Game](/problem/stone-game)
