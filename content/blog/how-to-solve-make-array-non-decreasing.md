---
title: "How to Solve Make Array Non-decreasing — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Make Array Non-decreasing. Medium difficulty, 56.8% acceptance rate. Topics: Array, Stack, Greedy, Monotonic Stack."
date: "2029-03-26"
category: "dsa-patterns"
tags: ["make-array-non-decreasing", "array", "stack", "greedy", "medium"]
---

# How to Solve "Make Array Non-decreasing"

This problem asks us to transform an array into a non-decreasing sequence by repeatedly replacing subarrays with their maximum value. The tricky part is that we want to maximize the _final length_ of the array, not just achieve non-decreasing order. Each operation reduces length, so we need to be strategic about which subarrays to compress.

## Visual Walkthrough

Let's trace through example `nums = [5, 2, 8, 7, 3, 1]`:

**Step 1:** Scan left to right, looking for decreasing pairs.

- `5 > 2` → decreasing! We need to handle this.

**Step 2:** Think about operations: We can replace subarrays with their max. For `[5, 2]`, if we replace it with `max(5, 2) = 5`, we get `[5, 8, 7, 3, 1]`. But wait — `5 ≤ 8` is fine, but we still have `8 > 7` later.

**Step 3:** Key insight: When we see a decreasing pair `nums[i] > nums[i+1]`, we can't keep both. We must either:

1. Merge them into one element (their max)
2. Or merge `nums[i]` with elements to its left until the sequence becomes valid

**Step 4:** Let's simulate optimally:

- Start: `[5, 2, 8, 7, 3, 1]`
- `5 > 2`: Merge `[5, 2]` → `[5, 8, 7, 3, 1]` (length 5)
- `8 > 7`: Merge `[8, 7]` → `[5, 8, 3, 1]` (length 4)
- `8 > 3`: Merge `[8, 3]` → `[5, 8, 1]` (length 3)
- `8 > 1`: Merge `[8, 1]` → `[5, 8]` (length 2)

We ended with length 2. But could we do better?

**Step 5:** Try a smarter approach: When we see `5 > 2`, instead of merging just those two, what if we merge `[5, 2]` into `5`, then immediately notice `5 ≤ 8` is fine. Continue:

- `[5, 8, 7, 3, 1]`
- `8 > 7`: Merge `[8, 7]` into `8` → `[5, 8, 3, 1]`
- `8 > 3`: Merge `[8, 3]` into `8` → `[5, 8, 1]`
- `8 > 1`: Merge `[8, 1]` into `8` → `[5, 8]`

Still length 2. The issue is that large numbers (like 8) block smaller numbers to their right.

**Step 6:** The optimal strategy: Use a stack to track "active" maxima. For each new number:

- If it's ≥ top of stack, push it (non-decreasing, so keep it)
- If it's < top, we need to merge. But how many elements should we merge?

Actually, the correct insight is: We process left to right, maintaining a stack of the maximum values we've kept. When we encounter a smaller number, we merge it with the largest number to its left that's greater than it. This is a **monotonic stack** pattern.

## Brute Force Approach

A naive approach would try all possible sequences of operations. For each decreasing pair `nums[i] > nums[i+1]`, we could:

1. Merge just those two
2. Merge `nums[i]` with some prefix
3. Try different combinations

We could use recursion: at each decreasing pair, try both keeping and merging options. However, with `n` elements, there are exponentially many sequences to try. Even with memoization, the state space is huge because the array changes after each operation.

The brute force is impractical for `n > 20`. We need a more efficient way to determine which merges are necessary.

## Optimized Approach

The key insight: Process the array left to right, maintaining a **monotonic non-decreasing stack**. Each element in the stack represents a "group" that has been merged. The value is the maximum of that group.

**Step-by-step reasoning:**

1. Initialize an empty stack. This will store the maximum values of merged groups.
2. For each number `num` in `nums`:
   - While stack is not empty AND `num < stack[-1]` (current number is smaller than last group's max):
     - We need to merge. The question is: merge `num` with which groups?
     - Actually, we should merge `num` with the _last group_ (top of stack) because that's the immediate violation.
     - But wait — what if merging with last group still leaves `num` smaller than the _previous_ group?
     - We continue merging until `num ≥ stack[-1]` or stack is empty.
   - After merging necessary groups, push `num` onto stack.
3. However, there's a subtlety: When we merge, the new value should be the **maximum** of the merged group. Since we're merging `num` with groups whose max > `num`, the new max remains the same as the group we merged with!

4. Actually, that's not quite right. Let's think: If we have stack `[2, 5]` and new `num = 3`:
   - `3 < 5`, so we need to merge.
   - Merging `[5, 3]` gives max = 5.
   - But now stack becomes `[2, 5]` (same as before), and we continue.
5. The correct algorithm: Use a stack that stores numbers. For each new number:
   - While stack not empty and new number < top:
     - Pop from stack (this represents merging the group)
   - Push the new number onto stack

   Wait, this would give wrong results. Let's test with `[5, 2, 8]`:
   - Process 5: stack = [5]
   - Process 2: 2 < 5 → pop 5, push 2 → stack = [2]
   - Process 8: 8 ≥ 2 → push 8 → stack = [2, 8]
     Final length = 2, which is correct.

6. But what about `[2, 5, 3]`?
   - Process 2: stack = [2]
   - Process 5: 5 ≥ 2 → push 5 → stack = [2, 5]
   - Process 3: 3 < 5 → pop 5, push 3 → stack = [2, 3]
     Final length = 2. Is this optimal? Let's check:
     Original: [2, 5, 3] has 5 > 3 violation.
     Options: Merge [5, 3] → [2, 5] (length 2) ✓

7. The algorithm works! Why? Because whenever we see a smaller number, we merge it with the largest number immediately to its left that's greater than it. By using a stack, we efficiently find that number.

## Optimal Solution

The solution uses a monotonic stack. For each number, we pop from stack while current number < top, then push current number. The final stack size is the maximum possible length.

**Why this maximizes length:** Each pop represents a necessary merge to maintain non-decreasing order. We only merge when forced to (when we see a decrease). By merging aggressively (popping larger elements), we allow more future elements to be included without merges.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def makeArrayNonDecreasing(nums):
    """
    Returns the maximum possible size of array after operations.

    Approach: Use a monotonic stack. For each number, we remove
    (merge) all larger numbers immediately to its left, then add
    the current number. The stack size is our answer.
    """
    stack = []

    for num in nums:
        # While current number is smaller than last element in stack,
        # we need to merge them (pop the larger one)
        while stack and num < stack[-1]:
            stack.pop()

        # Add current number to stack
        stack.append(num)

    # The stack contains all elements we can keep
    return len(stack)
```

```javascript
// Time: O(n) | Space: O(n)
function makeArrayNonDecreasing(nums) {
  /**
   * Returns the maximum possible size of array after operations.
   *
   * Approach: Use a monotonic stack. For each number, we remove
   * (merge) all larger numbers immediately to its left, then add
   * the current number. The stack size is our answer.
   */
  const stack = [];

  for (const num of nums) {
    // While current number is smaller than last element in stack,
    // we need to merge them (pop the larger one)
    while (stack.length > 0 && num < stack[stack.length - 1]) {
      stack.pop();
    }

    // Add current number to stack
    stack.push(num);
  }

  // The stack contains all elements we can keep
  return stack.length;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.Stack;

class Solution {
    public int makeArrayNonDecreasing(int[] nums) {
        /**
         * Returns the maximum possible size of array after operations.
         *
         * Approach: Use a monotonic stack. For each number, we remove
         * (merge) all larger numbers immediately to its left, then add
         * the current number. The stack size is our answer.
         */
        Stack<Integer> stack = new Stack<>();

        for (int num : nums) {
            // While current number is smaller than last element in stack,
            // we need to merge them (pop the larger one)
            while (!stack.isEmpty() && num < stack.peek()) {
                stack.pop();
            }

            // Add current number to stack
            stack.push(num);
        }

        // The stack contains all elements we can keep
        return stack.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
Each element is pushed onto the stack exactly once. Each element can be popped at most once. Even with the while loop inside the for loop, the total number of operations is linear because each element is processed at most twice (push and pop).

**Space Complexity:** O(n)  
In the worst case, when the array is already non-decreasing, we push all n elements onto the stack. In the best case (strictly decreasing), we only keep 1 element in the stack.

## Common Mistakes

1. **Trying to simulate all operations:** Some candidates try to actually perform the merge operations and track the resulting array. This is unnecessary and inefficient. We only need the _count_ of elements we can keep.

2. **Incorrect merge logic:** When seeing `nums[i] > nums[i+1]`, some think they should always merge just those two. But consider `[5, 4, 3]`: Merging `[5, 4]` gives `[5, 3]`, then `[5, 3]` needs another merge. Better to merge `[4, 3]` first? The stack approach handles this correctly.

3. **Forgetting the stack approach works:** This is a classic "next smaller element" variant. If you don't recognize the monotonic stack pattern, you might overcomplicate the solution.

4. **Edge case - empty array:** The problem doesn't specify if nums can be empty, but good practice is to handle it. Our solution works fine: empty input → empty stack → return 0.

## When You'll See This Pattern

This monotonic stack pattern appears in many array transformation problems:

1. **Daily Temperatures (LeetCode 739)** - Find how many days until a warmer temperature. Uses stack to track indices of temperatures waiting for a warmer day.

2. **Next Greater Element I (LeetCode 496)** - Find the next greater element for each array element. Similar stack-based traversal.

3. **Remove K Digits (LeetCode 402)** - Remove k digits to get smallest number. Uses stack to maintain increasing sequence while removing digits.

4. **Largest Rectangle in Histogram (LeetCode 84)** - More advanced but uses monotonic stack to find boundaries for each bar.

The common theme: When you need to compare each element with previous elements and potentially "remove" or "merge" based on comparisons, a monotonic stack is often the right tool.

## Key Takeaways

1. **Monotonic stacks excel at "next greater/smaller" problems:** When you need to process elements in order and compare with previous elements, consider a stack that maintains a monotonic (increasing or decreasing) sequence.

2. **Think in terms of what you can keep, not what to remove:** This problem asks for maximum length after operations. Instead of tracking operations, we track which elements survive.

3. **Test with edge cases:** Strictly decreasing arrays, already non-decreasing arrays, arrays with equal elements, and single-element arrays all test different aspects of the algorithm.

[Practice this problem on CodeJeet](/problem/make-array-non-decreasing)
