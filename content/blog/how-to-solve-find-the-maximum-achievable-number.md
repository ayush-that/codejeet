---
title: "How to Solve Find the Maximum Achievable Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Maximum Achievable Number. Easy difficulty, 91.2% acceptance rate. Topics: Math."
date: "2028-10-09"
category: "dsa-patterns"
tags: ["find-the-maximum-achievable-number", "math", "easy"]
---

# How to Solve Find the Maximum Achievable Number

This problem asks us to find the largest integer `x` that can become equal to `num` after at most `t` operations, where each operation allows us to change both `x` and `num` by 1 in any direction. What makes this interesting is that we're not just finding a single value—we're finding the maximum possible value that satisfies a constraint involving simultaneous changes to two numbers.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `num = 4` and `t = 2`.

We want to find the largest `x` such that we can make `x` equal to `num` in at most 2 operations. Each operation lets us:

- Increase `x` by 1 AND increase `num` by 1
- Increase `x` by 1 AND decrease `num` by 1
- Decrease `x` by 1 AND increase `num` by 1
- Decrease `x` by 1 AND decrease `num` by 1

The key insight: each operation changes the difference between `x` and `num` by 0, 2, or -2.

Let's test some values:

- If `x = 4`: Already equal to `num`, takes 0 operations ✓
- If `x = 5`: Difference is 1. We can decrease `x` by 1 and increase `num` by 1 → both become 5 in 1 operation ✓
- If `x = 6`: Difference is 2. We can decrease `x` by 1 and increase `num` by 1 → `x=5`, `num=5` in 1 operation ✓
- If `x = 7`: Difference is 3. We need 2 operations: (1) decrease `x` by 1, increase `num` by 1 → `x=6`, `num=5`; (2) decrease `x` by 1, increase `num` by 1 → `x=5`, `num=6`... wait, that doesn't work.

Let's think differently. The fastest way to make `x` equal to `num` is to move them toward each other. Each operation can reduce their absolute difference by at most 2 (when we move them toward each other: decrease the larger by 1, increase the smaller by 1).

So for `x = 7` and `num = 4`:

- Initial difference: |7 - 4| = 3
- Each operation reduces difference by 2
- We need ceil(3/2) = 2 operations ✓

For `x = 8`:

- Difference: |8 - 4| = 4
- Operations needed: ceil(4/2) = 2 ✓

For `x = 9`:

- Difference: |9 - 4| = 5
- Operations needed: ceil(5/2) = 3 ✗ (exceeds t=2)

So the maximum achievable `x` is 8. Notice the pattern: `x = num + 2*t`.

## Brute Force Approach

A naive approach would be to test values starting from `num` and going upward, checking if each value can be achieved within `t` operations:

1. Start with `x = num`
2. Increment `x` by 1
3. For each `x`, calculate the minimum operations needed
4. Stop when we find an `x` that requires more than `t` operations

The minimum operations needed for a given `x` is `ceil(|x - num| / 2)` because each operation can reduce the difference by at most 2.

While this brute force approach would work (since we're just counting upward), it's inefficient because we can derive a direct formula. A candidate might waste time implementing this iterative approach when a simple mathematical solution exists.

## Optimal Solution

The optimal solution comes from realizing that:

1. Each operation can change the difference between `x` and `num` by -2, 0, or +2
2. To minimize operations, we always choose to reduce the difference by 2 (move them toward each other)
3. The minimum operations needed = ceil(|x - num| / 2)
4. We want the largest `x` where ceil(|x - num| / 2) ≤ t
5. This simplifies to |x - num| ≤ 2t
6. Since we want the maximum `x`, we take `x = num + 2t`

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def theMaximumAchievableX(num: int, t: int) -> int:
    """
    Returns the maximum achievable number x.

    Each operation allows changing both x and num by ±1.
    The maximum difference we can bridge in t operations is 2t
    (since each operation can reduce the gap by 2).

    Therefore, the maximum x is num + 2t.
    """
    # The largest possible x is when we increase x and decrease num
    # in every operation, giving us num + 2t
    return num + 2 * t
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Returns the maximum achievable number x.
 * Each operation allows changing both x and num by ±1.
 * The maximum difference we can bridge in t operations is 2t
 * (since each operation can reduce the gap by 2).
 * Therefore, the maximum x is num + 2t.
 */
function theMaximumAchievableX(num, t) {
  // The largest possible x is when we increase x and decrease num
  // in every operation, giving us num + 2t
  return num + 2 * t;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Returns the maximum achievable number x.
     * Each operation allows changing both x and num by ±1.
     * The maximum difference we can bridge in t operations is 2t
     * (since each operation can reduce the gap by 2).
     * Therefore, the maximum x is num + 2t.
     */
    public int theMaximumAchievableX(int num, int t) {
        // The largest possible x is when we increase x and decrease num
        // in every operation, giving us num + 2t
        return num + 2 * t;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a single arithmetic operation regardless of input size
- No loops or recursion involved

**Space Complexity:** O(1)

- We use only a constant amount of extra space
- No data structures that grow with input size

## Common Mistakes

1. **Using `num + t` instead of `num + 2t`**: This is the most common error. Candidates forget that each operation changes the difference by 2 (when moving numbers toward each other), not by 1. Always test with the example `num=4, t=2` where the answer is 8, not 6.

2. **Overcomplicating with simulation**: Some candidates try to simulate the process or use BFS/DFS to explore all possible operation sequences. This is unnecessary for an Easy problem and wastes valuable interview time. Recognize when a mathematical formula exists.

3. **Not considering negative numbers**: While the problem constraints don't specify non-negative inputs, the formula `num + 2t` works for all integers. However, some candidates might worry about integer overflow, but with the given constraints (1 ≤ num, t ≤ 50), this isn't an issue.

4. **Forgetting to return an integer**: In languages with type coercion like JavaScript, ensure you're returning a number, not a string or other type.

## When You'll See This Pattern

This problem teaches the pattern of **mathematical simplification**—recognizing when a problem that seems to require simulation or search can be reduced to a simple formula.

Related problems:

1. **258. Add Digits**: Finding the digital root has a mathematical formula (`1 + (num - 1) % 9`) instead of repeatedly summing digits.
2. **292. Nim Game**: Determining if you can win a Nim game reduces to checking if `n % 4 != 0`.
3. **319. Bulb Switcher**: The number of bulbs on after n rounds reduces to counting perfect squares (floor(sqrt(n))).

These problems all share the characteristic that while you could simulate the process, there's a mathematical insight that gives an O(1) solution.

## Key Takeaways

1. **Look for mathematical patterns in operation-based problems**: When operations have symmetric effects or change values by fixed amounts, there's often a formula instead of needing simulation.

2. **Test with small examples**: The pattern `num + 2t` becomes obvious when you work through examples like `num=4, t=2`. Always build intuition with concrete cases before coding.

3. **Easy problems often have one-line solutions**: If an Easy problem seems to require complex code, you're probably missing a simpler approach. Step back and look for patterns.

[Practice this problem on CodeJeet](/problem/find-the-maximum-achievable-number)
