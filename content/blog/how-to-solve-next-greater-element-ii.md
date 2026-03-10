---
title: "How to Solve Next Greater Element II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Next Greater Element II. Medium difficulty, 67.9% acceptance rate. Topics: Array, Stack, Monotonic Stack."
date: "2026-12-30"
category: "dsa-patterns"
tags: ["next-greater-element-ii", "array", "stack", "monotonic-stack", "medium"]
---

# How to Solve Next Greater Element II

This problem asks us to find the next greater element for every number in a circular array. The "circular" part is what makes this interesting — after reaching the end of the array, we need to continue searching from the beginning. For each element, we need to find the first number to its right (wrapping around if needed) that is strictly greater than it. If no such number exists, we should return -1 for that position.

## Visual Walkthrough

Let's trace through the example `nums = [1, 2, 1]` step by step:

**For element at index 0 (value = 1):**

- Check index 1: value 2 > 1 ✓ Found next greater element = 2

**For element at index 1 (value = 2):**

- Check index 2: value 1 ≤ 2 ✗
- Wrap around to index 0: value 1 ≤ 2 ✗
- No greater element found → result = -1

**For element at index 2 (value = 1):**

- Wrap around to index 0: value 1 ≤ 1 ✗
- Continue to index 1: value 2 > 1 ✓ Found next greater element = 2

Final result: `[2, -1, 2]`

The circular nature means we effectively need to search through the array twice for each element in the worst case. A naive approach would check every element for every other element, leading to O(n²) time complexity.

## Brute Force Approach

The most straightforward solution is to simulate exactly what the problem asks: for each element, scan forward (wrapping around) until we find a greater element or return to our starting point.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) for the result array
def nextGreaterElements(nums):
    n = len(nums)
    result = [-1] * n

    for i in range(n):
        # Start checking from the next position
        j = (i + 1) % n

        # Continue until we wrap back to i
        while j != i:
            if nums[j] > nums[i]:
                result[i] = nums[j]
                break
            j = (j + 1) % n

    return result
```

```javascript
// Time: O(n²) | Space: O(n) for the result array
function nextGreaterElements(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    // Start checking from the next position
    let j = (i + 1) % n;

    // Continue until we wrap back to i
    while (j !== i) {
      if (nums[j] > nums[i]) {
        result[i] = nums[j];
        break;
      }
      j = (j + 1) % n;
    }
  }

  return result;
}
```

```java
// Time: O(n²) | Space: O(n) for the result array
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);

    for (int i = 0; i < n; i++) {
        // Start checking from the next position
        int j = (i + 1) % n;

        // Continue until we wrap back to i
        while (j != i) {
            if (nums[j] > nums[i]) {
                result[i] = nums[j];
                break;
            }
            j = (j + 1) % n;
        }
    }

    return result;
}
```

</div>

**Why this is inefficient:** For each of the n elements, we might scan through all other n-1 elements in the worst case (when all elements are equal or in descending order). This gives us O(n²) time complexity, which is too slow for large inputs (n up to 10⁴ would require ~10⁸ operations).

## Optimized Approach

The key insight is that we can use a **monotonic decreasing stack** to solve this in linear time. Here's the reasoning:

1. **Monotonic Stack Pattern:** When we need to find the "next greater element" for each item, a monotonic decreasing stack is perfect. We maintain a stack of indices where the corresponding values are in decreasing order.

2. **Circular Array Trick:** To handle the circular nature, we can simply traverse the array twice. The second pass will find next greater elements that wrap around.

3. **How it works:** As we iterate through the array (twice), for each element:
   - While the stack is not empty AND the current element is greater than the element at the top of the stack:
     - We've found the next greater element for the stack's top element
     - Record this result and pop from the stack
   - Push the current index onto the stack (but only during the first pass to avoid duplicates)

4. **Why two passes work:** The first pass handles all cases where the next greater element is to the right. The second pass handles cases where we need to wrap around to find the next greater element.

## Optimal Solution

Here's the complete solution using a monotonic stack with two passes:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def nextGreaterElements(nums):
    n = len(nums)
    result = [-1] * n  # Initialize all results to -1
    stack = []  # Monotonic decreasing stack storing indices

    # We traverse the array twice to handle circular nature
    for i in range(2 * n):
        # Use modulo to get the actual index in the array
        current_idx = i % n

        # While stack has elements and current element is greater than stack's top
        while stack and nums[current_idx] > nums[stack[-1]]:
            # We found the next greater element for the element at stack's top
            top_idx = stack.pop()
            result[top_idx] = nums[current_idx]

        # Only push indices during the first pass to avoid duplicates
        if i < n:
            stack.append(current_idx)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function nextGreaterElements(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1); // Initialize all results to -1
  const stack = []; // Monotonic decreasing stack storing indices

  // We traverse the array twice to handle circular nature
  for (let i = 0; i < 2 * n; i++) {
    // Use modulo to get the actual index in the array
    const currentIdx = i % n;

    // While stack has elements and current element is greater than stack's top
    while (stack.length > 0 && nums[currentIdx] > nums[stack[stack.length - 1]]) {
      // We found the next greater element for the element at stack's top
      const topIdx = stack.pop();
      result[topIdx] = nums[currentIdx];
    }

    // Only push indices during the first pass to avoid duplicates
    if (i < n) {
      stack.push(currentIdx);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);  // Initialize all results to -1
    Stack<Integer> stack = new Stack<>();  // Monotonic decreasing stack storing indices

    // We traverse the array twice to handle circular nature
    for (int i = 0; i < 2 * n; i++) {
        // Use modulo to get the actual index in the array
        int currentIdx = i % n;

        // While stack has elements and current element is greater than stack's top
        while (!stack.isEmpty() && nums[currentIdx] > nums[stack.peek()]) {
            // We found the next greater element for the element at stack's top
            int topIdx = stack.pop();
            result[topIdx] = nums[currentIdx];
        }

        // Only push indices during the first pass to avoid duplicates
        if (i < n) {
            stack.push(currentIdx);
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element at most twice (once when pushing onto the stack, once when popping from the stack)
- Even though we have a nested while loop inside a for loop, each element is pushed and popped at most once, giving us O(2n) = O(n) operations

**Space Complexity: O(n)**

- The stack can hold up to n indices in the worst case (when the array is strictly decreasing)
- The result array requires O(n) space
- Total space: O(n) + O(n) = O(n)

## Common Mistakes

1. **Forgetting to handle the circular aspect:** Some candidates solve the non-circular version correctly but forget that after reaching the end, they need to continue from the beginning. Always check if the problem mentions "circular" or "wrap around."

2. **Infinite loops in brute force:** When implementing the brute force with modulo arithmetic, it's easy to create an infinite loop by not properly handling the wrap-around condition. Always test with edge cases like single-element arrays.

3. **Pushing indices twice in the stack solution:** If you push indices during both passes, you'll process elements multiple times unnecessarily. The condition `if i < n:` is crucial to only push during the first pass.

4. **Confusing the stack order:** Remember we want a **monotonic decreasing** stack (values decreasing from bottom to top). If you accidentally make it increasing, you won't find the correct next greater elements.

## When You'll See This Pattern

The monotonic stack pattern appears in several "next greater/smaller element" problems:

1. **Next Greater Element I (LeetCode 496):** A simpler version without the circular aspect. This problem is excellent practice for understanding the monotonic stack pattern before tackling the circular version.

2. **Daily Temperatures (LeetCode 739):** Instead of finding the next greater element, you find how many days until a warmer temperature. The core algorithm is identical — you're just storing distances instead of values.

3. **Largest Rectangle in Histogram (LeetCode 84):** Uses monotonic stacks to find the next smaller element on both sides, which is key to calculating rectangle areas.

4. **Trapping Rain Water (LeetCode 42):** While not identical, it uses a similar "processing elements based on comparisons with stack tops" pattern.

## Key Takeaways

1. **Monotonic stacks are perfect for "next greater/smaller" problems:** When you need to find the next element that satisfies some condition relative to each element, consider if a monotonic stack can help.

2. **Circular arrays can often be handled by traversing twice:** If you need to wrap around, consider traversing `2n` elements and using modulo arithmetic. This trick works for many circular array problems.

3. **Each element is processed at most twice in optimal solution:** Even with nested loops, the O(n) complexity comes from the fact that each element is pushed and popped from the stack at most once. This amortized analysis is common with stack-based solutions.

Related problems: [Next Greater Element I](/problem/next-greater-element-i), [Next Greater Element III](/problem/next-greater-element-iii), [Maximum and Minimum Sums of at Most Size K Subarrays](/problem/maximum-and-minimum-sums-of-at-most-size-k-subarrays)
