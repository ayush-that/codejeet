---
title: "How to Solve Count Non-Decreasing Subarrays After K Operations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Non-Decreasing Subarrays After K Operations. Hard difficulty, 23.8% acceptance rate. Topics: Array, Stack, Segment Tree, Queue, Sliding Window."
date: "2026-09-16"
category: "dsa-patterns"
tags:
  ["count-non-decreasing-subarrays-after-k-operations", "array", "stack", "segment-tree", "hard"]
---

# How to Solve Count Non-Decreasing Subarrays After K Operations

This problem asks us to count how many subarrays of `nums` can be made non-decreasing by applying at most `k` operations, where each operation increments any element in the subarray by 1. The challenge is that we need to consider **every subarray independently** — operations applied to one subarray don't affect others — and we need to do this efficiently for arrays up to 10⁵ elements. The tricky part is determining for each subarray whether we have enough operations to "fix" decreasing elements while respecting that we can only increment values.

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 1, 2, 1]` with `k = 2`.

For each subarray, we need to check if we can make it non-decreasing with ≤ k increments. Let's examine a few:

**Subarray [3, 1]**: To make it non-decreasing, we need `3 ≤ 1`. Since 1 < 3, we must increment 1 until it's ≥ 3. We need 2 operations (1→2, 2→3). That's exactly k=2, so this subarray counts.

**Subarray [1, 2, 1]**: We need `1 ≤ 2 ≤ 1`. The issue is at the last pair: 2 > 1. We need to increment 1 to ≥ 2 (1 operation). But wait — after incrementing the last 1 to 2, we have `1 ≤ 2 ≤ 2`, which is valid. That's 1 operation, which is ≤ k=2, so this counts.

**Subarray [3, 1, 2]**: We need `3 ≤ 1 ≤ 2`. First, 1 needs 2 operations to reach 3. But then we have `3 ≤ 3 ≤ 2` — now 2 needs 1 operation to reach 3. Total operations = 3, which exceeds k=2, so this doesn't count.

The key insight: For a subarray to be fixable, the total "deficit" — how much we need to raise each element to match or exceed the previous one — must be ≤ k. But there's a catch: raising an element affects all subsequent comparisons in that subarray!

## Brute Force Approach

A naive solution would:

1. Generate all O(n²) subarrays
2. For each subarray, simulate fixing it:
   - Start from the first element
   - For each subsequent element, if it's less than the previous, increment it until it's equal
   - Count total operations
   - Stop if operations exceed k
3. Count subarrays where operations ≤ k

<div class="code-group">

```python
# Time: O(n³) worst case | Space: O(1)
def countSubarraysBrute(nums, k):
    n = len(nums)
    count = 0

    for i in range(n):           # O(n) starting points
        for j in range(i, n):    # O(n) ending points
            ops = 0
            prev = nums[i]

            for idx in range(i + 1, j + 1):  # O(n) to check subarray
                if nums[idx] < prev:
                    # Need to raise current element to at least prev
                    ops += prev - nums[idx]
                    if ops > k:
                        break
                    # After raising, current becomes prev for next comparison
                    current = prev
                else:
                    current = nums[idx]

                prev = current

            if ops <= k:
                count += 1

    return count
```

```javascript
// Time: O(n³) worst case | Space: O(1)
function countSubarraysBrute(nums, k) {
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    // O(n) starting points
    for (let j = i; j < n; j++) {
      // O(n) ending points
      let ops = 0;
      let prev = nums[i];

      for (let idx = i + 1; idx <= j; idx++) {
        // O(n) to check subarray
        if (nums[idx] < prev) {
          // Need to raise current element to at least prev
          ops += prev - nums[idx];
          if (ops > k) break;
          // After raising, current becomes prev for next comparison
          current = prev;
        } else {
          current = nums[idx];
        }

        prev = current;
      }

      if (ops <= k) count++;
    }
  }

  return count;
}
```

```java
// Time: O(n³) worst case | Space: O(1)
public int countSubarraysBrute(int[] nums, int k) {
    int n = nums.length;
    int count = 0;

    for (int i = 0; i < n; i++) {           // O(n) starting points
        for (int j = i; j < n; j++) {       // O(n) ending points
            int ops = 0;
            int prev = nums[i];

            for (int idx = i + 1; idx <= j; idx++) {  // O(n) to check subarray
                if (nums[idx] < prev) {
                    // Need to raise current element to at least prev
                    ops += prev - nums[idx];
                    if (ops > k) break;
                    // After raising, current becomes prev for next comparison
                    int current = prev;
                    prev = current;
                } else {
                    prev = nums[idx];
                }
            }

            if (ops <= k) count++;
        }
    }

    return count;
}
```

</div>

This brute force is O(n³) — far too slow for n up to 10⁵. We need to optimize.

## Optimized Approach

The key insight: We can use a **sliding window** with a **monotonic stack** to track the "deficit" efficiently.

Think about expanding a window [left, right]:

- As we add `nums[right]`, we need to ensure the entire window can be made non-decreasing
- The challenge is that raising an element affects all elements to its right in the window
- We need to track "plateaus" — when we raise an element, it creates a flat segment

Better insight: For a window to be valid, the total operations needed is:

```
ops = sum over i of max(0, needed[i] - nums[i])
```

where `needed[i]` is the minimum value `nums[i]` must have after operations.

Actually, there's an even cleaner approach: For a subarray starting at `left`, as we extend to `right`, we maintain a **monotonic decreasing stack** of "cliffs" — places where we need to raise elements. Each stack entry tracks:

1. The value that elements after it must reach
2. How many elements are affected by this requirement

The operations needed = sum over stack of `(required_value - original_value) * count_of_elements`

When we add a new element `nums[right]`:

1. Pop from stack while top value > nums[right] (we need to raise nums[right])
2. Calculate how much we need to raise nums[right] to match the new requirement
3. Push the new requirement onto stack
4. If total operations > k, shrink window from left

This gives us O(n) time because each element enters and exits the stack at most once.

## Optimal Solution

Here's the O(n) solution using a monotonic stack with a sliding window:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countSubarrays(nums, k):
    n = len(nums)
    count = 0
    left = 0
    total_ops = 0

    # Stack stores pairs: (required_value, count_of_elements_at_this_value)
    stack = []

    for right in range(n):
        # Count of elements at current position is initially 1
        cnt = 1

        # While stack is not empty and top value > current nums[right]
        # We need to raise nums[right] to at least the top value
        while stack and stack[-1][0] > nums[right]:
            required_val, elements_count = stack.pop()
            # The deficit for these elements: they need to be raised from nums[right] to required_val
            total_ops -= (required_val - nums[right]) * elements_count
            cnt += elements_count  # These elements now join the current "plateau"

        # Push the new plateau onto stack
        # The required value is max(nums[right], previous requirement)
        required_val = max(nums[right], stack[-1][0] if stack else nums[right])
        stack.append((required_val, cnt))

        # If we had to raise nums[right], add those operations
        if required_val > nums[right]:
            total_ops += (required_val - nums[right]) * cnt

        # Shrink window from left if operations exceed k
        while total_ops > k:
            # Remove leftmost element from stack
            required_val, elements_count = stack[0]

            # If there's only one element at this level, pop it
            if elements_count == 1:
                stack.pop(0)
                # If we raised this element, subtract the operations
                if required_val > nums[left]:
                    total_ops -= (required_val - nums[left])
            else:
                # Decrease count of elements at this level
                stack[0] = (required_val, elements_count - 1)
                # Subtract operations for one element
                if required_val > nums[left]:
                    total_ops -= (required_val - nums[left])

            # Move left pointer
            left += 1

        # All subarrays ending at 'right' with start ≥ 'left' are valid
        count += (right - left + 1)

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function countSubarrays(nums, k) {
  const n = nums.length;
  let count = 0;
  let left = 0;
  let totalOps = 0;

  // Stack stores pairs: [requiredValue, countOfElementsAtThisValue]
  const stack = [];

  for (let right = 0; right < n; right++) {
    // Count of elements at current position is initially 1
    let cnt = 1;

    // While stack is not empty and top value > current nums[right]
    // We need to raise nums[right] to at least the top value
    while (stack.length > 0 && stack[stack.length - 1][0] > nums[right]) {
      const [requiredVal, elementsCount] = stack.pop();
      // The deficit for these elements: they need to be raised from nums[right] to requiredVal
      totalOps -= (requiredVal - nums[right]) * elementsCount;
      cnt += elementsCount; // These elements now join the current "plateau"
    }

    // Push the new plateau onto stack
    // The required value is max(nums[right], previous requirement)
    const requiredVal = Math.max(
      nums[right],
      stack.length > 0 ? stack[stack.length - 1][0] : nums[right]
    );
    stack.push([requiredVal, cnt]);

    // If we had to raise nums[right], add those operations
    if (requiredVal > nums[right]) {
      totalOps += (requiredVal - nums[right]) * cnt;
    }

    // Shrink window from left if operations exceed k
    while (totalOps > k) {
      // Remove leftmost element from stack
      const [requiredVal, elementsCount] = stack[0];

      // If there's only one element at this level, shift it
      if (elementsCount === 1) {
        stack.shift();
        // If we raised this element, subtract the operations
        if (requiredVal > nums[left]) {
          totalOps -= requiredVal - nums[left];
        }
      } else {
        // Decrease count of elements at this level
        stack[0][1] = elementsCount - 1;
        // Subtract operations for one element
        if (requiredVal > nums[left]) {
          totalOps -= requiredVal - nums[left];
        }
      }

      // Move left pointer
      left++;
    }

    // All subarrays ending at 'right' with start ≥ 'left' are valid
    count += right - left + 1;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int countSubarrays(int[] nums, int k) {
    int n = nums.length;
    int count = 0;
    int left = 0;
    long totalOps = 0;  // Use long to avoid overflow

    // Stack stores pairs: (requiredValue, countOfElementsAtThisValue)
    // Using ArrayDeque for efficient operations at both ends
    Deque<long[]> stack = new ArrayDeque<>();

    for (int right = 0; right < n; right++) {
        // Count of elements at current position is initially 1
        int cnt = 1;

        // While stack is not empty and top value > current nums[right]
        // We need to raise nums[right] to at least the top value
        while (!stack.isEmpty() && stack.peekLast()[0] > nums[right]) {
            long[] top = stack.pollLast();
            long requiredVal = top[0];
            long elementsCount = top[1];

            // The deficit for these elements: they need to be raised from nums[right] to requiredVal
            totalOps -= (requiredVal - nums[right]) * elementsCount;
            cnt += elementsCount;  // These elements now join the current "plateau"
        }

        // Push the new plateau onto stack
        // The required value is max(nums[right], previous requirement)
        long requiredVal = nums[right];
        if (!stack.isEmpty()) {
            requiredVal = Math.max(requiredVal, stack.peekLast()[0]);
        }
        stack.addLast(new long[]{requiredVal, cnt});

        // If we had to raise nums[right], add those operations
        if (requiredVal > nums[right]) {
            totalOps += (requiredVal - nums[right]) * cnt;
        }

        // Shrink window from left if operations exceed k
        while (totalOps > k) {
            // Remove leftmost element from stack
            long[] first = stack.peekFirst();
            long firstRequiredVal = first[0];
            long firstElementsCount = first[1];

            // If there's only one element at this level, remove it
            if (firstElementsCount == 1) {
                stack.pollFirst();
                // If we raised this element, subtract the operations
                if (firstRequiredVal > nums[left]) {
                    totalOps -= (firstRequiredVal - nums[left]);
                }
            } else {
                // Decrease count of elements at this level
                first[1] = firstElementsCount - 1;
                // Subtract operations for one element
                if (firstRequiredVal > nums[left]) {
                    totalOps -= (firstRequiredVal - nums[left]);
                }
            }

            // Move left pointer
            left++;
        }

        // All subarrays ending at 'right' with start ≥ 'left' are valid
        count += (right - left + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
Each element is:

1. Pushed onto the stack once
2. Popped from the stack at most once
3. Processed during left pointer movement at most once

The while loops for stack operations and window shrinking are amortized O(1) per element because each element enters/exits the stack/window exactly once.

**Space Complexity: O(n)**  
In the worst case, the stack could store all n elements (when the array is strictly decreasing).

## Common Mistakes

1. **Forgetting that raising an element affects all subsequent comparisons**  
   When you increment `nums[i]`, you're not just fixing `nums[i-1] ≤ nums[i]` — you're also potentially breaking `nums[i] ≤ nums[i+1]` if `nums[i+1]` was already close to the original `nums[i]`. The stack approach correctly handles this chain reaction.

2. **Incorrectly calculating operations when multiple elements share the same "plateau"**  
   If elements `i`, `i+1`, ..., `j` all need to be raised to the same value, the operations are `(required_value - original_value) * count`, not just summing individual differences. Our stack stores `(value, count)` pairs to handle this efficiently.

3. **Using integer overflow for operations count**  
   With n up to 10⁵ and values up to 10⁹, total operations could exceed 32-bit integer range. Use 64-bit integers (long in Java, no issue in Python).

4. **Not handling the stack as a deque when removing from left**  
   We need to remove from the front of the stack when shrinking the window. Using a proper deque (ArrayDeque in Java, list in Python, array in JavaScript) ensures O(1) removal from both ends.

## When You'll See This Pattern

This "monotonic stack + sliding window" pattern appears in problems where you need to maintain some property over subarrays while efficiently expanding/shrinking windows:

1. **Number of Subarrays with Bounded Maximum** (LeetCode 795) — Similar sliding window with monotonic stack to track maximum values
2. **Sum of Subarray Minimums** (LeetCode 907) — Uses monotonic stack to find how many subarrays have each element as minimum
3. **Shortest Subarray with Sum at Least K** (LeetCode 862) — Uses deque to maintain prefix sums in increasing order

The key insight is using a monotonic structure to maintain aggregated information about the window, allowing O(1) updates when adding/removing elements.

## Key Takeaways

1. **When a problem asks about "all subarrays" with some property, think sliding window + two pointers** — but you'll often need an auxiliary data structure to maintain window properties efficiently.

2. **Monotonic stacks/deques are powerful for maintaining running minimums/maximums or "required values"** — they let you aggregate information about contiguous segments with the same requirements.

3. **For "make array non-decreasing" problems, think in terms of "plateaus"** — when you raise an element, you create a flat segment where subsequent elements must meet at least that height.

Related problems: [Non-decreasing Array](/problem/non-decreasing-array)
