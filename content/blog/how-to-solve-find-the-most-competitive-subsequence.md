---
title: "How to Solve Find the Most Competitive Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Most Competitive Subsequence. Medium difficulty, 52.7% acceptance rate. Topics: Array, Stack, Greedy, Monotonic Stack."
date: "2027-10-26"
category: "dsa-patterns"
tags: ["find-the-most-competitive-subsequence", "array", "stack", "greedy", "medium"]
---

# How to Solve Find the Most Competitive Subsequence

You're given an array `nums` and an integer `k`. You need to return the most competitive subsequence of length `k` — meaning the lexicographically smallest subsequence you can form by removing elements. This problem is tricky because you can't just take the smallest numbers — you must maintain order and ensure you can still reach exactly `k` elements. The challenge is balancing greediness with future availability.

## Visual Walkthrough

Let's trace through `nums = [3,5,2,6]`, `k = 2`:

We want the lexicographically smallest 2-element subsequence. Lexicographic comparison means we compare first elements, then second, etc.

**Step 1:** Look at first element `3`. We have 4 total elements and need 2. After taking `3`, we'd need 1 more from the remaining `[5,2,6]`. That's possible.

**Step 2:** Next element `5`. If we take `3,5`, that's our subsequence. But is there something better? What if we skip `3`? Then we'd need 2 from `[5,2,6]`.

**Step 3:** Compare `3,5` vs starting with `2` from later. `2 < 3`, so `2,x` will beat `3,x` regardless of `x`. So we should skip `3` and `5` to get `2`.

**Step 4:** After taking `2`, we need 1 more from `[6]`. Result: `[2,6]`.

But how do we systematically decide when to skip? Let's try `nums = [2,4,3,3,5,4,6,9]`, `k = 4`:

We'll build our answer step by step:

1. Start with empty result: `[]`
2. Look at `2`: Can we skip it? If we skip, we'd need 4 from remaining 7 elements. Yes possible. But `2` is small, keep it: `[2]`
3. Look at `4`: Now have `[2]`, need 3 more. If we skip `4`, can we get 3 from remaining 6? Yes. Compare `4` vs next elements: `3 < 4`, so we should remove `4` to get `2,3,...` instead of `2,4,...`. Remove `4`: `[2]`
4. Look at `3`: Now `[2]`, need 3 more. Add `3`: `[2,3]`
5. Look at `3`: `[2,3]`, need 2 more. Current last element `3` vs new `3`: equal, keep both? Actually, we can only remove if new element is smaller. Keep: `[2,3,3]`
6. Look at `5`: `[2,3,3]`, need 1 more. `5` vs nothing to compare? Wait, we have 3 elements but need 4 total. Add `5`: `[2,3,3,5]`
7. But we still have `[4,6,9]` remaining! We already have 4 elements, but maybe we can improve by replacing `5` with `4`? Yes! `4 < 5`, and we can remove `5` since we have extra elements to fill. So: remove `5`, add `4`: `[2,3,3,4]`
8. Continue: `6` and `9` are larger than `4`, and we have exactly 4 elements. Done.

The pattern: maintain a stack of smallest elements, but allow yourself to pop if you'll still have enough elements left to reach `k`.

## Brute Force Approach

The brute force would generate all subsequences of length `k` and compare them lexicographically. For an array of length `n`, there are C(n,k) combinations (n choose k), which grows factorially. Even for modest n=100, k=50, this is astronomical.

A slightly better but still exponential approach uses backtracking: try including/excluding each element until you have k elements, keeping track of the best found. This is O(2^n) in worst case.

Both are far too slow for typical constraints (n up to 10^5).

## Optimized Approach

The key insight is **monotonic stack with removal limits**:

1. We want the smallest possible number in the first position
2. But we must leave enough numbers after it to complete k elements
3. So for position i, we can only remove it if: remaining elements (n - i - 1) ≥ (k - current_stack_size)

This is similar to "Remove K Digits" problem, but here we're not removing a fixed number — we're ensuring final length is exactly k.

**Step-by-step reasoning:**

- Use a stack to build the result
- For each number in nums:
  - While stack isn't empty, top of stack > current number, and we have enough remaining elements to still reach k after popping:
    - Pop from stack (remove the larger number)
  - Push current number
- If stack has more than k elements, truncate to k (take first k)
- If stack has less than k, we need all remaining elements (edge case)

The "enough remaining elements" check is crucial: `len(stack) + (n - i) > k`

- `len(stack)`: elements already in result
- `(n - i)`: elements remaining including current
- We need `> k` because we're considering popping then adding current

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - each element pushed/popped at most once
# Space: O(k) - stack stores at most k elements
def mostCompetitive(nums, k):
    """
    Returns the most competitive (lexicographically smallest) subsequence of length k.

    Approach: Use a monotonic increasing stack while ensuring we leave enough
    elements to reach length k.
    """
    stack = []
    n = len(nums)

    for i, num in enumerate(nums):
        # While we can improve the sequence:
        # 1. Stack has elements
        # 2. Top of stack is larger than current number
        # 3. We have enough remaining elements to still reach k after popping
        while stack and stack[-1] > num and len(stack) + (n - i) > k:
            stack.pop()

        # Add current number if we haven't reached k yet
        if len(stack) < k:
            stack.append(num)

    return stack
```

```javascript
// Time: O(n) - each element pushed/popped at most once
// Space: O(k) - stack stores at most k elements
function mostCompetitive(nums, k) {
  /**
   * Returns the most competitive (lexicographically smallest) subsequence of length k.
   *
   * Approach: Use a monotonic increasing stack while ensuring we leave enough
   * elements to reach length k.
   */
  const stack = [];
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    const num = nums[i];

    // While we can improve the sequence:
    // 1. Stack has elements
    // 2. Top of stack is larger than current number
    // 3. We have enough remaining elements to still reach k after popping
    while (stack.length > 0 && stack[stack.length - 1] > num && stack.length + (n - i) > k) {
      stack.pop();
    }

    // Add current number if we haven't reached k yet
    if (stack.length < k) {
      stack.push(num);
    }
  }

  return stack;
}
```

```java
// Time: O(n) - each element pushed/popped at most once
// Space: O(k) - stack stores at most k elements
public int[] mostCompetitive(int[] nums, int k) {
    /**
     * Returns the most competitive (lexicographically smallest) subsequence of length k.
     *
     * Approach: Use a monotonic increasing stack while ensuring we leave enough
     * elements to reach length k.
     */
    Stack<Integer> stack = new Stack<>();
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        // While we can improve the sequence:
        // 1. Stack has elements
        // 2. Top of stack is larger than current number
        // 3. We have enough remaining elements to still reach k after popping
        while (!stack.isEmpty() &&
               stack.peek() > nums[i] &&
               stack.size() + (n - i) > k) {
            stack.pop();
        }

        // Add current number if we haven't reached k yet
        if (stack.size() < k) {
            stack.push(nums[i]);
        }
    }

    // Convert stack to array
    int[] result = new int[k];
    for (int i = k - 1; i >= 0; i--) {
        result[i] = stack.pop();
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each element is pushed onto the stack exactly once
- Each element can be popped from the stack at most once
- The while loop might run multiple times per element, but total operations across all elements is O(n) (amortized analysis)

**Space Complexity: O(k)**

- The stack stores at most k elements (we only add if stack size < k)
- In practice, it might temporarily store more during processing, but final result is exactly k
- The Java solution uses O(k) for the result array plus O(k) for the stack = O(k)

## Common Mistakes

1. **Forgetting the "enough remaining elements" check**: This is the most critical part. Without it, you might pop too many elements and not have enough left to reach length k. Always verify: `stack.size() + remaining > k`.

2. **Using array instead of stack for pops**: Some candidates use arrays and try to simulate stack operations with indices. This works but is error-prone. Using actual stack operations (push/pop) makes the logic clearer.

3. **Not handling the case when stack grows beyond k**: The condition `if len(stack) < k` prevents adding extra elements, but what if we pop and then add? Actually, the while loop condition ensures we only pop if we can still reach k, and we only add if below k. This self-regulates.

4. **Confusing subsequence with substring**: Remember you can skip elements anywhere, not just at the ends. The stack approach naturally handles this by allowing removal of any element in the current result if a better one comes later.

## When You'll See This Pattern

This **monotonic stack with removal budget** pattern appears in several problems:

1. **Remove K Digits (LeetCode 402)**: Almost identical! Instead of fixed output length k, you remove exactly k digits to get smallest number. The condition changes slightly but the stack approach is the same.

2. **Smallest Subsequence of Distinct Characters (LeetCode 1081)**: Find lexicographically smallest subsequence containing all distinct characters exactly once. Similar stack logic with additional constraints for character counts.

3. **Create Maximum Number (LeetCode 321)**: More complex version where you merge two subsequences. The building block is creating the maximum (or minimum) subsequence of fixed length from one array.

4. **Daily Temperatures (LeetCode 739)**: Uses monotonic stack but for different purpose (finding next greater element). The stack maintenance pattern is similar.

## Key Takeaways

1. **When you need lexicographically smallest subsequence of fixed length**, think monotonic increasing stack with removal constraints. The core trade-off: remove larger elements early if you have enough elements later to reach the required length.

2. **The removal condition is critical**: `stack.size() + remaining > k` ensures you don't make the sequence too short. This accounts for both already-chosen elements and future available elements.

3. **This pattern generalizes to "optimal subsequence" problems**: Whether removing k digits, finding smallest subsequence with all letters, or creating competitive sequences, the stack approach with careful popping conditions is often the solution.

Related problems: [Remove K Digits](/problem/remove-k-digits), [Smallest Subsequence of Distinct Characters](/problem/smallest-subsequence-of-distinct-characters)
