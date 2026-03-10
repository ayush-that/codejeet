---
title: "How to Solve Steps to Make Array Non-decreasing — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Steps to Make Array Non-decreasing. Medium difficulty, 24.6% acceptance rate. Topics: Array, Linked List, Dynamic Programming, Stack, Monotonic Stack."
date: "2029-04-16"
category: "dsa-patterns"
tags:
  ["steps-to-make-array-non-decreasing", "array", "linked-list", "dynamic-programming", "medium"]
---

# How to Solve Steps to Make Array Non-decreasing

This problem asks us to simulate a process where we repeatedly remove elements that violate the non-decreasing property, counting how many rounds it takes until the array is sorted. The tricky part is that removals in one round affect which elements violate the condition in subsequent rounds, creating a chain reaction that's not immediately obvious.

## Visual Walkthrough

Let's trace through an example: `nums = [5, 3, 4, 4, 7, 3, 6, 11, 8, 5, 11]`

**Step 1:** We remove all elements where `nums[i-1] > nums[i]`:

- `5 > 3` → remove 3 (index 1)
- `4 > 3` → remove 3 (index 5)
- `11 > 8` → remove 8 (index 8)
- `8 > 5` → remove 5 (index 9)

After step 1: `[5, 4, 4, 7, 6, 11, 11]`

**Step 2:** Check the new array:

- `7 > 6` → remove 6 (now at index 4)

After step 2: `[5, 4, 4, 7, 11, 11]`

**Step 3:** Check again:

- `5 > 4` → remove 4 (index 1)

After step 3: `[5, 4, 7, 11, 11]`

**Step 4:** Check again:

- `5 > 4` → remove 4 (now at index 1)

After step 4: `[5, 7, 11, 11]` ← Now non-decreasing!

**Total steps:** 4

The key insight: when we remove an element, the element to its right now compares with the element to its left, potentially creating new violations in future steps. This creates a domino effect.

## Brute Force Approach

The most straightforward approach is to literally simulate the process:

1. Initialize `steps = 0`
2. While the array is not non-decreasing:
   - Create a new array with only elements that don't need to be removed
   - Increment `steps`
3. Return `steps`

<div class="code-group">

```python
# Time: O(n²) worst case | Space: O(n)
def brute_force(nums):
    steps = 0
    while True:
        # Check if array is already non-decreasing
        is_sorted = True
        for i in range(1, len(nums)):
            if nums[i-1] > nums[i]:
                is_sorted = False
                break

        if is_sorted:
            return steps

        # Build new array without elements to remove
        new_nums = [nums[0]]  # First element is never removed
        for i in range(1, len(nums)):
            if nums[i-1] <= nums[i]:
                new_nums.append(nums[i])

        nums = new_nums
        steps += 1
```

```javascript
// Time: O(n²) worst case | Space: O(n)
function bruteForce(nums) {
  let steps = 0;

  while (true) {
    // Check if array is already non-decreasing
    let isSorted = true;
    for (let i = 1; i < nums.length; i++) {
      if (nums[i - 1] > nums[i]) {
        isSorted = false;
        break;
      }
    }

    if (isSorted) return steps;

    // Build new array without elements to remove
    const newNums = [nums[0]]; // First element is never removed
    for (let i = 1; i < nums.length; i++) {
      if (nums[i - 1] <= nums[i]) {
        newNums.push(nums[i]);
      }
    }

    nums = newNums;
    steps++;
  }
}
```

```java
// Time: O(n²) worst case | Space: O(n)
public int bruteForce(int[] nums) {
    List<Integer> list = new ArrayList<>();
    for (int num : nums) list.add(num);

    int steps = 0;

    while (true) {
        // Check if array is already non-decreasing
        boolean isSorted = true;
        for (int i = 1; i < list.size(); i++) {
            if (list.get(i-1) > list.get(i)) {
                isSorted = false;
                break;
            }
        }

        if (isSorted) return steps;

        // Build new list without elements to remove
        List<Integer> newList = new ArrayList<>();
        newList.add(list.get(0));  // First element is never removed
        for (int i = 1; i < list.size(); i++) {
            if (list.get(i-1) <= list.get(i)) {
                newList.add(list.get(i));
            }
        }

        list = newList;
        steps++;
    }
}
```

</div>

**Why this is inefficient:** In the worst case (like a strictly decreasing array), we remove only one element per step, requiring O(n) steps. Each step takes O(n) time to process the array, giving us O(n²) total time complexity. For n up to 10⁵ (common in LeetCode), this is far too slow.

## Optimized Approach

The key insight is that we need to track **when** each element gets removed, not just **if** it gets removed. Think about it this way:

1. An element `nums[i]` gets removed in step `k` if:
   - There's some element `nums[j]` to its left that's greater than it
   - All elements between `j` and `i` have been removed by step `k-1`

2. We can process this using a stack that stores pairs of `(value, step_removed)`

3. For each element `nums[i]`:
   - Initialize `step = 1` (minimum step when this element might be removed)
   - While stack is not empty and top element > current element:
     - The current element will be removed no earlier than `max(step, top_step + 1)`
     - Pop from stack
   - Push `(nums[i], step)` to stack
   - Update answer with `step`

This works because:

- The stack maintains a decreasing sequence of values
- When we see a smaller element, it will be removed in some future step
- The step number propagates forward through the chain of removals

## Optimal Solution

Here's the efficient solution using a monotonic stack approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def totalSteps(nums):
    """
    Calculate the number of steps to make array non-decreasing.

    The key insight is that we need to track when each element gets removed,
    not just if it gets removed. We use a stack to maintain decreasing
    elements and track the step at which they would be removed.
    """
    stack = []  # Stores tuples of (value, step_when_removed)
    max_steps = 0  # Track the maximum steps needed

    for num in nums:
        # Initialize step for current element
        step = 0

        # While we have elements in stack and current element is smaller
        # than stack top, it means current element will be removed
        while stack and stack[-1][0] <= num:
            # Current element will be removed no earlier than
            # max(step, top_step + 1)
            step = max(step, stack[-1][1])
            stack.pop()

        # If stack is not empty, current element will be removed
        # (because some element to left is greater)
        if stack:
            step += 1
        else:
            # If stack is empty, current element won't be removed
            step = 0

        # Update maximum steps
        max_steps = max(max_steps, step)

        # Push current element with its removal step
        stack.append((num, step))

    return max_steps
```

```javascript
// Time: O(n) | Space: O(n)
function totalSteps(nums) {
  /**
   * Calculate the number of steps to make array non-decreasing.
   *
   * We use a stack to track elements and the step at which they
   * would be removed. This allows us to compute the domino effect
   * of removals efficiently.
   */
  const stack = []; // Each element is [value, stepWhenRemoved]
  let maxSteps = 0;

  for (const num of nums) {
    let step = 0;

    // Process all elements in stack that are <= current element
    while (stack.length > 0 && stack[stack.length - 1][0] <= num) {
      // Current element removal step is max of current step
      // and (top element step + 1)
      step = Math.max(step, stack[stack.length - 1][1]);
      stack.pop();
    }

    // If stack has elements, current element will be removed
    // because some left element is greater
    if (stack.length > 0) {
      step += 1;
    } else {
      // No greater element to left, won't be removed
      step = 0;
    }

    // Update maximum steps seen so far
    maxSteps = Math.max(maxSteps, step);

    // Push current element with its removal step
    stack.push([num, step]);
  }

  return maxSteps;
}
```

```java
// Time: O(n) | Space: O(n)
public int totalSteps(int[] nums) {
    /**
     * Calculate steps to make array non-decreasing using stack.
     *
     * Stack stores pairs of (value, stepWhenRemoved) to track
     * the propagation of removal steps through the array.
     */
    Stack<int[]> stack = new Stack<>();
    int maxSteps = 0;

    for (int num : nums) {
        int step = 0;

        // Process elements from stack while current element >= stack top
        while (!stack.isEmpty() && stack.peek()[0] <= num) {
            // Update step to max of current step and (top step + 1)
            step = Math.max(step, stack.peek()[1]);
            stack.pop();
        }

        // If stack not empty, current element will be removed
        if (!stack.isEmpty()) {
            step += 1;
        } else {
            // No greater element to left, won't be removed
            step = 0;
        }

        // Update maximum steps
        maxSteps = Math.max(maxSteps, step);

        // Push current element with its removal step
        stack.push(new int[]{num, step});
    }

    return maxSteps;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
Each element is pushed onto the stack exactly once and popped at most once. Even though we have a while loop inside the for loop, the total number of operations across all iterations is O(n) due to each element being processed at most twice.

**Space Complexity:** O(n)  
In the worst case (strictly decreasing array), we store all n elements in the stack. In practice, the stack size is bounded by the length of the longest decreasing subsequence.

## Common Mistakes

1. **Simulating the process literally:** As shown in the brute force approach, this leads to O(n²) time complexity which times out for large inputs. Recognize that we need to compute the result without actually modifying the array repeatedly.

2. **Incorrect step propagation:** When an element `nums[i]` is removed because `nums[j] > nums[i]` (where `j < i`), all elements between `j` and `i` must have been removed first. The step for `nums[i]` is `max(step, steps_for_element_between + 1)`. Forgetting the `+1` or the `max` operation is a common error.

3. **Not handling equal elements correctly:** The condition is `nums[i-1] > nums[i]`, not `>=`. Equal elements don't trigger removal. In the stack approach, we use `<=` when comparing to handle this correctly.

4. **Forgetting the first element:** The first element (index 0) is never removed because there's no element before it to compare with. Make sure your solution accounts for this.

## When You'll See This Pattern

This problem uses a **monotonic stack** pattern combined with **dynamic programming**-like state propagation. You'll see similar patterns in:

1. **Daily Temperatures (LeetCode 739)** - Uses monotonic stack to find next greater element, similar to tracking when elements get "removed" or processed.

2. **Next Greater Element I/II (LeetCode 496/503)** - Classic monotonic stack problems for finding next greater elements in arrays.

3. **Largest Rectangle in Histogram (LeetCode 84)** - Uses monotonic stack to track boundaries where heights decrease, similar to how we track removal conditions here.

The pattern is: when you need to process elements based on their relationship with neighboring elements, and the result depends on a chain reaction, consider using a stack to maintain a monotonic sequence and propagate state information.

## Key Takeaways

1. **Monotonic stacks are powerful for chain reaction problems:** When removals or processing of elements creates a domino effect, a stack can help simulate this efficiently by propagating state information.

2. **Track "when" not just "if":** For problems involving multiple rounds or steps, it's often more efficient to compute when something happens rather than simulating each round separately.

3. **Equal elements matter:** Pay close attention to whether comparisons are strict (`>`) or non-strict (`>=`). This often determines whether you use `<` or `<=` in your stack comparisons.

Related problems: [Remove One Element to Make the Array Strictly Increasing](/problem/remove-one-element-to-make-the-array-strictly-increasing)
