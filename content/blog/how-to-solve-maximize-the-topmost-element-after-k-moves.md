---
title: "How to Solve Maximize the Topmost Element After K Moves — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize the Topmost Element After K Moves. Medium difficulty, 24.0% acceptance rate. Topics: Array, Greedy."
date: "2028-12-22"
category: "dsa-patterns"
tags: ["maximize-the-topmost-element-after-k-moves", "array", "greedy", "medium"]
---

# How to Solve Maximize the Topmost Element After K Moves

This problem asks us to maximize the topmost element of a pile after exactly `k` moves, where each move can either remove the top element or add any previously removed element back to the top. The tricky part is that we must perform **exactly** `k` moves, not at most `k`, and we need to carefully consider which sequence of operations yields the maximum possible value at the top when we're done.

What makes this problem interesting is that it's not about finding a single optimal move, but about understanding the constraints of the operation sequence. We can't simply take the maximum element we can reach—we need to ensure there's a valid sequence of exactly `k` moves that leaves that element on top.

## Visual Walkthrough

Let's walk through an example: `nums = [2, 7, 11, 15]`, `k = 3`.

We start with pile: `[2, 7, 11, 15]` (2 is top)

**Move 1:** Remove 2 → pile: `[7, 11, 15]`
**Move 2:** Remove 7 → pile: `[11, 15]`
**Move 3:** Now we have two options:

- Option A: Remove 11 → pile: `[15]` (top is 15)
- Option B: Put back 2 or 7 → pile: `[2, 11, 15]` or `[7, 11, 15]` (top is 2 or 7)

But wait, there's another sequence:
**Move 1:** Remove 2 → pile: `[7, 11, 15]`
**Move 2:** Put back 2 → pile: `[2, 7, 11, 15]` (top is 2)
**Move 3:** Remove 2 → pile: `[7, 11, 15]` (top is 7)

Or yet another:
**Move 1:** Remove 2 → pile: `[7, 11, 15]`
**Move 2:** Remove 7 → pile: `[11, 15]`
**Move 3:** Put back 2 → pile: `[2, 11, 15]` (top is 2)

The key insight: After `k` moves, the top element could be:

1. An element that was originally at position `k-1` (if we remove `k-1` elements, then put one back)
2. An element that was originally at position `k` (if we remove `k` elements)
3. An element from earlier in the array that we put back at the right moment

But there are constraints: We can't put back an element we haven't removed yet, and we need exactly `k` moves.

## Brute Force Approach

A brute force approach would try all possible sequences of `k` moves. Each move has up to `n` choices (remove if pile not empty, or put back any previously removed element). This leads to an exponential number of sequences: approximately `O(n^k)` possibilities.

Even for moderate `n` and `k`, this is completely infeasible. For example, with `n=100` and `k=100`, we'd have `100^100` possibilities—more than the number of atoms in the universe.

The naive approach fails because it doesn't recognize the structure of the problem. We need to think about what's actually achievable rather than enumerating all possibilities.

## Optimized Approach

The key insight is that we only need to consider a few specific cases:

1. **If `k = 0`**: We can't make any moves, so the answer is simply `nums[0]`.

2. **If `n = 1`**: With only one element, if `k` is odd, we'll end with an empty pile (return -1). If `k` is even, we can remove and put back the element to end with it on top.

3. **General case**: After `k` moves, the top element can be:
   - Any element from `nums[0]` to `nums[k-2]` (remove `k-1` elements, then put back the max of what we removed)
   - The element at `nums[k]` (remove `k` elements)

   Why not `nums[k-1]`? Because if we remove `k-1` elements to reach it, we've used `k-1` moves, and we need one more move. That last move would either remove it (leaving `nums[k]` on top) or put something back on top of it.

4. **Special case when `k > n`**: We can remove all elements, then use remaining moves to put back the maximum element we removed.

The algorithm becomes:

- Handle base cases (`k=0`, `n=1`)
- Consider elements we can reach by removing `k-1` elements and putting one back (indices 0 to `k-2`)
- Consider the element at index `k` (if `k < n`)
- Take the maximum of these possibilities

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumTop(nums, k):
    """
    Returns the maximum possible top element after exactly k moves.

    Args:
        nums: List of integers representing the pile
        k: Number of moves to perform

    Returns:
        Maximum possible top element, or -1 if pile is empty
    """
    n = len(nums)

    # Special case: if k == 0, no moves allowed
    if k == 0:
        return nums[0]

    # Special case: only one element
    if n == 1:
        # With one element, if k is odd, we'll end with empty pile
        # If k is even, we can remove and put back to end with same element
        return -1 if k % 2 == 1 else nums[0]

    # Initialize answer to -1 (empty pile is possible outcome)
    ans = -1

    # Case 1: We can remove k-1 elements, then put back the max of what we removed
    # This gives us any element from indices 0 to k-2
    # We need at least 2 moves for this (remove one, put one back)
    # And k-2 must be within bounds (k-2 < n)
    end = min(k - 2, n - 1)
    for i in range(end + 1):
        ans = max(ans, nums[i])

    # Case 2: We can remove k elements (if k < n)
    # This leaves nums[k] as the top element
    if k < n:
        ans = max(ans, nums[k])

    # Case 3: If k > n, we can remove all elements and put back the maximum
    # This is actually covered by case 1 when we consider all elements
    # But we need to handle the case where k == n specially
    # When k == n, we can either:
    # - Remove all n elements (pile empty, return -1)
    # - Remove n-1 and put one back (covered by case 1)
    # So we need to consider both possibilities
    if k == n:
        # We've already considered putting back any of first n-1 elements in case 1
        # Empty pile (return -1) is already considered by initializing ans to -1
        pass
    elif k > n:
        # We can remove all and put back max element
        # This means we can get any element as top
        ans = max(ans, max(nums))

    return ans
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Returns the maximum possible top element after exactly k moves.
 *
 * @param {number[]} nums - Array representing the pile
 * @param {number} k - Number of moves to perform
 * @return {number} Maximum possible top element, or -1 if pile is empty
 */
function maximumTop(nums, k) {
  const n = nums.length;

  // Special case: if k == 0, no moves allowed
  if (k === 0) {
    return nums[0];
  }

  // Special case: only one element
  if (n === 1) {
    // With one element, if k is odd, we'll end with empty pile
    // If k is even, we can remove and put back to end with same element
    return k % 2 === 1 ? -1 : nums[0];
  }

  // Initialize answer to -1 (empty pile is possible outcome)
  let ans = -1;

  // Case 1: We can remove k-1 elements, then put back the max of what we removed
  // This gives us any element from indices 0 to k-2
  // We need at least 2 moves for this (remove one, put one back)
  // And k-2 must be within bounds (k-2 < n)
  const end = Math.min(k - 2, n - 1);
  for (let i = 0; i <= end; i++) {
    ans = Math.max(ans, nums[i]);
  }

  // Case 2: We can remove k elements (if k < n)
  // This leaves nums[k] as the top element
  if (k < n) {
    ans = Math.max(ans, nums[k]);
  }

  // Case 3: If k > n, we can remove all elements and put back the maximum
  // This is actually covered by case 1 when we consider all elements
  // But we need to handle the case where k == n specially
  if (k === n) {
    // We've already considered putting back any of first n-1 elements
    // Empty pile (return -1) is already considered by initializing ans to -1
  } else if (k > n) {
    // We can remove all and put back max element
    // This means we can get any element as top
    const maxNum = Math.max(...nums);
    ans = Math.max(ans, maxNum);
  }

  return ans;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Returns the maximum possible top element after exactly k moves.
     *
     * @param nums Array representing the pile
     * @param k Number of moves to perform
     * @return Maximum possible top element, or -1 if pile is empty
     */
    public int maximumTop(int[] nums, int k) {
        int n = nums.length;

        // Special case: if k == 0, no moves allowed
        if (k == 0) {
            return nums[0];
        }

        // Special case: only one element
        if (n == 1) {
            // With one element, if k is odd, we'll end with empty pile
            // If k is even, we can remove and put back to end with same element
            return k % 2 == 1 ? -1 : nums[0];
        }

        // Initialize answer to -1 (empty pile is possible outcome)
        int ans = -1;

        // Case 1: We can remove k-1 elements, then put back the max of what we removed
        // This gives us any element from indices 0 to k-2
        // We need at least 2 moves for this (remove one, put one back)
        // And k-2 must be within bounds (k-2 < n)
        int end = Math.min(k - 2, n - 1);
        for (int i = 0; i <= end; i++) {
            ans = Math.max(ans, nums[i]);
        }

        // Case 2: We can remove k elements (if k < n)
        // This leaves nums[k] as the top element
        if (k < n) {
            ans = Math.max(ans, nums[k]);
        }

        // Case 3: If k > n, we can remove all elements and put back the maximum
        // This is actually covered by case 1 when we consider all elements
        // But we need to handle the case where k == n specially
        if (k == n) {
            // We've already considered putting back any of first n-1 elements
            // Empty pile (return -1) is already considered by initializing ans to -1
        } else if (k > n) {
            // We can remove all and put back max element
            // This means we can get any element as top
            int maxNum = nums[0];
            for (int i = 1; i < n; i++) {
                maxNum = Math.max(maxNum, nums[i]);
            }
            ans = Math.max(ans, maxNum);
        }

        return ans;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through at most `min(k-1, n)` elements in the first case: O(min(k, n))
- We find the maximum of all elements when `k > n`: O(n)
- Overall, we touch each element at most once: O(n)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables like `ans`, `maxNum`, and loop counters
- No additional data structures are needed

## Common Mistakes

1. **Forgetting the `k=0` case**: When `k=0`, we can't make any moves, so the answer is simply `nums[0]`. Many candidates return -1 or try to process moves.

2. **Not handling the single-element case correctly**: With `n=1`, if `k` is odd, we'll inevitably end with an empty pile because we must make exactly `k` moves. If `k` is even, we can do pairs of remove/put-back operations.

3. **Incorrect bounds for the first case**: Candidates often use `k-1` instead of `k-2` when considering elements we can put back. Remember: if we remove `k-1` elements and want to put one back, we've used `k` moves total. The element at index `k-1` would be removed on the last move if we try to reach it.

4. **Missing the `nums[k]` case**: When `k < n`, we can simply remove `k` elements to leave `nums[k]` on top. This is often overlooked because it doesn't involve putting any element back.

## When You'll See This Pattern

This problem teaches **operation sequence analysis**—understanding what outcomes are achievable given constraints on operations. Similar patterns appear in:

1. **Gas Station (Medium)**: Both problems require analyzing sequences of operations to determine feasibility. Gas Station asks if you can complete a circuit given gas constraints, which involves analyzing cumulative sums—similar to analyzing move sequences here.

2. **Jump Game (Medium)**: Like analyzing what positions are reachable in an array given jump constraints, this problem asks what top elements are reachable given move constraints.

3. **Bulb Switcher (Medium)**: Both involve understanding the effect of multiple operations on a system. Bulb Switcher requires recognizing that only perfect squares remain on—a pattern emerges from the operation constraints.

## Key Takeaways

1. **When dealing with operation sequences, focus on what's achievable rather than enumerating all possibilities**. Look for constraints that limit the outcome space.

2. **Break the problem into cases based on relationships between parameters** (like `k` vs `n`, `k` even/odd). Special cases often hide at the boundaries.

3. **Test with small examples to build intuition** before coding. The visual walkthrough with `[2,7,11,15]` and `k=3` reveals why certain elements are or aren't reachable.

Related problems: [Gas Station](/problem/gas-station)
