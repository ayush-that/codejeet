---
title: "How to Solve Find the Number of Subarrays Where Boundary Elements Are Maximum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Number of Subarrays Where Boundary Elements Are Maximum. Hard difficulty, 32.8% acceptance rate. Topics: Array, Binary Search, Stack, Monotonic Stack."
date: "2026-02-08"
category: "dsa-patterns"
tags:
  [
    "find-the-number-of-subarrays-where-boundary-elements-are-maximum",
    "array",
    "binary-search",
    "stack",
    "hard",
  ]
---

# How to Solve "Find the Number of Subarrays Where Boundary Elements Are Maximum"

This problem asks us to count all subarrays where both the first and last elements equal the maximum value in that subarray. What makes this tricky is that we need to efficiently check the maximum condition for potentially O(n²) subarrays. The key insight is that for any subarray where the boundaries equal the maximum, that maximum value must be the largest element in the entire subarray, and it must appear at both ends.

## Visual Walkthrough

Let's trace through example `nums = [1, 4, 3, 3, 2]`:

We need to count subarrays where:

1. First element = Last element
2. That value is the maximum in the subarray

Let's examine some valid subarrays:

- `[1]`: First=Last=1, max=1 ✓
- `[4]`: First=Last=4, max=4 ✓
- `[3]`: First=Last=3, max=3 ✓
- `[3, 3]` (indices 2-3): First=Last=3, max=3 ✓
- `[4, 3, 3, 2]`: First=4, Last=2 ✗ (boundaries not equal)
- `[4, 3]`: First=4, Last=3 ✗ (boundaries not equal)

Now consider `[3, 3, 2]` (indices 2-4): First=3, Last=2 ✗ (boundaries not equal)

What about `[4, 3, 3]` (indices 1-3)? First=4, Last=3 ✗

The pattern emerges: For a subarray to be valid, it must start and end with the same value `x`, and there cannot be any element larger than `x` between them. This means we need to find, for each element, how far it can extend to the left and right without encountering a larger element.

## Brute Force Approach

The brute force solution checks every possible subarray:

1. Generate all O(n²) subarrays
2. For each subarray:
   - Find the maximum element
   - Check if first element = last element = maximum

This approach has O(n³) time complexity if we naively find the maximum for each subarray, or O(n²) if we track the maximum while generating subarrays. Even O(n²) is too slow for n up to 10⁵.

<div class="code-group">

```python
# Brute Force - Too Slow for Large Inputs
# Time: O(n²) | Space: O(1)
def bruteForce(nums):
    n = len(nums)
    count = 0

    for i in range(n):
        current_max = nums[i]
        for j in range(i, n):
            # Update max for the current subarray
            current_max = max(current_max, nums[j])

            # Check if boundaries equal the maximum
            if nums[i] == nums[j] == current_max:
                count += 1

    return count
```

```javascript
// Brute Force - Too Slow for Large Inputs
// Time: O(n²) | Space: O(1)
function bruteForce(nums) {
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    let currentMax = nums[i];
    for (let j = i; j < n; j++) {
      // Update max for the current subarray
      currentMax = Math.max(currentMax, nums[j]);

      // Check if boundaries equal the maximum
      if (nums[i] === nums[j] && nums[j] === currentMax) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Brute Force - Too Slow for Large Inputs
// Time: O(n²) | Space: O(1)
public int bruteForce(int[] nums) {
    int n = nums.length;
    int count = 0;

    for (int i = 0; i < n; i++) {
        int currentMax = nums[i];
        for (int j = i; j < n; j++) {
            // Update max for the current subarray
            currentMax = Math.max(currentMax, nums[j]);

            // Check if boundaries equal the maximum
            if (nums[i] == nums[j] && nums[j] == currentMax) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

The brute force fails because with n up to 10⁵, O(n²) operations (10¹⁰) is far too slow. We need an O(n) or O(n log n) solution.

## Optimized Approach

The key insight: For a subarray starting at index `i` and ending at index `j` to be valid:

1. `nums[i] == nums[j]` (boundaries equal)
2. `nums[i]` is the maximum in `nums[i:j+1]`

This means `nums[i]` must be ≥ all elements between i and j. In other words, `nums[i]` must be a "local maximum" in that range.

We can think of this as: For each element `nums[i]`, we need to find how far it can extend to the right before encountering a larger element. Similarly, we need to know how far it can extend to the left before encountering a larger element. Then, any subarray starting and ending with the same value `x` within these bounds is valid.

However, there's a more efficient approach using a monotonic stack:

1. For each element, find the next greater element to the right (NGE)
2. For each element, find the previous greater or equal element to the left (PGE)
3. For each element `nums[i]`, the valid subarrays ending at `i` are those starting at positions where:
   - The value equals `nums[i]`
   - There's no greater element between start and i

We can process this in O(n) using a monotonic decreasing stack that tracks indices of decreasing values.

## Optimal Solution

The optimal solution uses a monotonic stack to track elements in decreasing order. As we process each element, we pop from the stack while the current element is greater than the stack top. For equal elements, we need to handle them carefully to count all valid subarrays.

<div class="code-group">

```python
# Optimal Solution using Monotonic Stack
# Time: O(n) | Space: O(n)
def numberOfSubarrays(nums):
    n = len(nums)
    stack = []  # monotonic decreasing stack storing (value, count)
    result = 0

    for num in nums:
        # Pop elements smaller than current - they cannot extend further
        while stack and stack[-1][0] < num:
            stack.pop()

        # If top has same value, we can extend subarrays
        if stack and stack[-1][0] == num:
            # Add count of subarrays ending at previous same value
            # plus the new single-element subarray
            count = stack[-1][1] + 1
            result += count
            stack[-1] = (num, count)
        else:
            # New maximum or smaller value
            # Only count the single-element subarray
            result += 1
            stack.append((num, 1))

    return result
```

```javascript
// Optimal Solution using Monotonic Stack
// Time: O(n) | Space: O(n)
function numberOfSubarrays(nums) {
  const n = nums.length;
  const stack = []; // monotonic decreasing stack storing [value, count]
  let result = 0;

  for (const num of nums) {
    // Pop elements smaller than current - they cannot extend further
    while (stack.length > 0 && stack[stack.length - 1][0] < num) {
      stack.pop();
    }

    // If top has same value, we can extend subarrays
    if (stack.length > 0 && stack[stack.length - 1][0] === num) {
      // Add count of subarrays ending at previous same value
      // plus the new single-element subarray
      const count = stack[stack.length - 1][1] + 1;
      result += count;
      stack[stack.length - 1] = [num, count];
    } else {
      // New maximum or smaller value
      // Only count the single-element subarray
      result += 1;
      stack.push([num, 1]);
    }
  }

  return result;
}
```

```java
// Optimal Solution using Monotonic Stack
// Time: O(n) | Space: O(n)
public int numberOfSubarrays(int[] nums) {
    int n = nums.length;
    // Stack stores pairs: [0] = value, [1] = count of consecutive occurrences
    Stack<int[]> stack = new Stack<>();
    int result = 0;

    for (int num : nums) {
        // Pop elements smaller than current - they cannot extend further
        while (!stack.isEmpty() && stack.peek()[0] < num) {
            stack.pop();
        }

        // If top has same value, we can extend subarrays
        if (!stack.isEmpty() && stack.peek()[0] == num) {
            // Add count of subarrays ending at previous same value
            // plus the new single-element subarray
            int count = stack.peek()[1] + 1;
            result += count;
            stack.peek()[1] = count;
        } else {
            // New maximum or smaller value
            // Only count the single-element subarray
            result += 1;
            stack.push(new int[]{num, 1});
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element exactly once
- Each element is pushed and popped from the stack at most once
- The while loop's total operations across all iterations is O(n) due to amortized analysis

**Space Complexity: O(n)**

- In the worst case (strictly decreasing array), we store all n elements in the stack
- The stack stores at most n elements

## Common Mistakes

1. **Not handling equal elements correctly**: When values are equal, we need to count all combinations of equal elements that don't have a larger element between them. The stack approach naturally handles this by tracking counts of consecutive equal elements.

2. **Forgetting single-element subarrays**: Every single element forms a valid subarray (first=last=maximum). Candidates sometimes miss these when focusing on multi-element subarrays.

3. **Incorrect stack condition**: Using `<=` instead of `<` when popping from stack. We need strict inequality because when we encounter a larger element, it breaks all previous subarrays ending with smaller values.

4. **Trying to use two-pointer approach**: This problem looks like it could be solved with two pointers, but the maximum condition makes it unsuitable for a simple two-pointer solution. The monotonic stack is the right approach.

## When You'll See This Pattern

This problem uses a **monotonic stack** pattern, which appears in problems where you need to find next/previous greater/smaller elements or maintain a sliding window with monotonic properties.

Related problems:

1. **Next Greater Element I (Easy)**: Basic monotonic stack application
2. **Largest Rectangle in Histogram (Hard)**: Uses monotonic stack to find boundaries where heights are limiting factors
3. **Sum of Subarray Minimums (Medium)**: Similar pattern for counting subarrays based on minimum element
4. **Number of Subarrays with Bounded Maximum (Medium)**: Directly related - counting subarrays where maximum falls within bounds

## Key Takeaways

1. **Monotonic stacks excel at boundary problems**: When you need to find how far an element can extend before encountering a larger/smaller element, think monotonic stack.

2. **Equal elements require special handling**: In counting problems with equality conditions, track counts of consecutive equal elements rather than just the last occurrence.

3. **Break down complex conditions**: The requirement "first and last equal maximum" can be decomposed into: (a) boundaries equal, and (b) no larger element between them. This decomposition leads to the stack solution.

4. **Amortized analysis matters**: While the solution has nested loops, the total operations are O(n) because each element enters and leaves the stack at most once.

Related problems: [Number of Subarrays with Bounded Maximum](/problem/number-of-subarrays-with-bounded-maximum), [Count Subarrays With Fixed Bounds](/problem/count-subarrays-with-fixed-bounds), [Count Subarrays Where Max Element Appears at Least K Times](/problem/count-subarrays-where-max-element-appears-at-least-k-times)
