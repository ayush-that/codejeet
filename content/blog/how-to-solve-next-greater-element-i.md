---
title: "How to Solve Next Greater Element I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Next Greater Element I. Easy difficulty, 75.8% acceptance rate. Topics: Array, Hash Table, Stack, Monotonic Stack."
date: "2026-08-06"
category: "dsa-patterns"
tags: ["next-greater-element-i", "array", "hash-table", "stack", "easy"]
---

# How to Solve Next Greater Element I

You’re given two arrays: `nums1` (a subset of `nums2`) and `nums2`. For each element in `nums1`, you need to find the **next greater element** in `nums2**—the first number to its right that is larger. If none exists, return -1. The challenge is doing this efficiently, especially when `nums2`is large. While the brute force is straightforward, the optimal solution uses a **monotonic stack** to compute all next-greater relationships in`nums2`in linear time, then quickly look them up for`nums1`.

## Visual Walkthrough

Let’s walk through an example to build intuition.

**Input:**

```
nums1 = [4, 1, 2]
nums2 = [1, 3, 4, 2]
```

We need to find, for each element in `nums1`, the next greater element in `nums2`.

**Step-by-step for `nums2`:**
We’ll process `nums2` from left to right, using a stack to track elements for which we haven’t yet found a next greater element.

1. **Start:** Stack = `[]`
2. **Process 1:** Stack is empty, push `1` → Stack = `[1]`
3. **Process 3:** Compare `3` with stack top (`1`). `3 > 1`, so `1`’s next greater is `3`. Pop `1`. Stack now empty. Push `3` → Stack = `[3]`
4. **Process 4:** Compare `4` with stack top (`3`). `4 > 3`, so `3`’s next greater is `4`. Pop `3`. Stack empty. Push `4` → Stack = `[4]`
5. **Process 2:** Compare `2` with stack top (`4`). `2 < 4`, so no pop. Push `2` → Stack = `[4, 2]`

Now, any elements left in the stack (`4` and `2`) have no next greater element (we’ll map them to -1).

We’ve computed:

- `1` → `3`
- `3` → `4`
- `4` → `-1`
- `2` → `-1`

**Lookup for `nums1`:**

- `4` → `-1`
- `1` → `3`
- `2` → `-1`

Result: `[-1, 3, -1]`

This process efficiently finds all next-greater elements in one pass through `nums2`.

## Brute Force Approach

A naive approach is to directly simulate the problem statement: for each element in `nums1`, find its position in `nums2`, then scan rightwards to find the first larger element.

**Algorithm:**

1. For each `x` in `nums1`:
   - Find index `i` of `x` in `nums2` (linear search).
   - Scan `nums2` from `i+1` to end to find first element > `x`.
   - If found, add to result; else add -1.

**Why it’s inefficient:**

- Finding index in `nums2` takes O(n) per element.
- Scanning rightwards takes O(n) in worst case.
- Total time: O(m \* n) where m = `nums1.length`, n = `nums2.length`.
- This becomes too slow for large inputs (e.g., n = 10^4, m = 10^4 → 10^8 operations).

The brute force works but fails on large inputs. We need to preprocess `nums2` to answer queries in O(1) time.

## Optimal Solution

The optimal solution uses a **monotonic decreasing stack** to compute the next greater element for every element in `nums2` in a single pass. Then, we store these mappings in a hash map for O(1) lookup per `nums1` element.

**Key insight:** When we process a new element in `nums2`, it becomes the **next greater element** for all smaller elements on the stack that we pop. This is the core of the monotonic stack pattern.

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums2), m = len(nums1)
# Space: O(n) for the stack and hash map
def nextGreaterElement(nums1, nums2):
    # Step 1: Create a hash map to store next greater element for each number in nums2
    next_greater = {}
    # Step 2: Use a stack to maintain a decreasing sequence
    stack = []

    # Step 3: Process each element in nums2 from left to right
    for num in nums2:
        # While stack is not empty and current number > top of stack
        while stack and num > stack[-1]:
            # Current number is the next greater element for the top of stack
            smaller = stack.pop()
            next_greater[smaller] = num
        # Push current number onto stack (it's looking for its own next greater)
        stack.append(num)

    # Step 4: Any numbers left in stack have no next greater element
    while stack:
        remaining = stack.pop()
        next_greater[remaining] = -1

    # Step 5: Build result by looking up each nums1 element in the hash map
    result = []
    for num in nums1:
        result.append(next_greater[num])

    return result
```

```javascript
// Time: O(n + m) where n = nums2.length, m = nums1.length
// Space: O(n) for the stack and hash map
function nextGreaterElement(nums1, nums2) {
  // Step 1: Create a map to store next greater element for each number in nums2
  const nextGreater = new Map();
  // Step 2: Use a stack to maintain a decreasing sequence
  const stack = [];

  // Step 3: Process each element in nums2 from left to right
  for (const num of nums2) {
    // While stack is not empty and current number > top of stack
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      // Current number is the next greater element for the top of stack
      const smaller = stack.pop();
      nextGreater.set(smaller, num);
    }
    // Push current number onto stack (it's looking for its own next greater)
    stack.push(num);
  }

  // Step 4: Any numbers left in stack have no next greater element
  while (stack.length > 0) {
    const remaining = stack.pop();
    nextGreater.set(remaining, -1);
  }

  // Step 5: Build result by looking up each nums1 element in the map
  const result = [];
  for (const num of nums1) {
    result.push(nextGreater.get(num));
  }

  return result;
}
```

```java
// Time: O(n + m) where n = nums2.length, m = nums1.length
// Space: O(n) for the stack and hash map
public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    // Step 1: Create a hash map to store next greater element for each number in nums2
    Map<Integer, Integer> nextGreater = new HashMap<>();
    // Step 2: Use a stack to maintain a decreasing sequence
    Stack<Integer> stack = new Stack<>();

    // Step 3: Process each element in nums2 from left to right
    for (int num : nums2) {
        // While stack is not empty and current number > top of stack
        while (!stack.isEmpty() && num > stack.peek()) {
            // Current number is the next greater element for the top of stack
            int smaller = stack.pop();
            nextGreater.put(smaller, num);
        }
        // Push current number onto stack (it's looking for its own next greater)
        stack.push(num);
    }

    // Step 4: Any numbers left in stack have no next greater element
    while (!stack.isEmpty()) {
        int remaining = stack.pop();
        nextGreater.put(remaining, -1);
    }

    // Step 5: Build result by looking up each nums1 element in the hash map
    int[] result = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) {
        result[i] = nextGreater.get(nums1[i]);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- We process each element in `nums2` exactly once (pushed and popped at most once) → O(n).
- We process each element in `nums1` exactly once for lookup → O(m).
- Total: O(n + m).

**Space Complexity: O(n)**

- The stack can hold up to n elements in worst case (strictly decreasing array).
- The hash map stores n key-value pairs.
- Both are O(n).

## Common Mistakes

1. **Forgetting to handle elements with no next greater:** Candidates often forget to map remaining stack elements to -1. This causes missing values or errors when looking up those numbers later. Always clear the stack at the end.

2. **Processing nums2 in wrong direction:** The monotonic stack approach requires processing left-to-right to find the _first_ greater element to the right. Processing right-to-left would find the _last_ greater element, which is incorrect.

3. **Using array instead of hash map for lookup:** Some candidates try to use an array indexed by value, but values can be large (up to 10^4) and negative. A hash map is the correct choice.

4. **Not verifying nums1 is a subset:** The problem guarantees `nums1` is a subset of `nums2`, so lookups will always succeed. But in interviews, it’s good to mention this assumption.

## When You'll See This Pattern

The **monotonic stack** pattern appears whenever you need to find the next/previous greater/smaller element in an array. It’s especially useful when you need to process this for all elements efficiently.

**Related LeetCode problems:**

1. **Next Greater Element II** (Medium): Circular array version. Solve by doubling the array or using modulo indexing with the same monotonic stack approach.
2. **Daily Temperatures** (Medium): Instead of the next greater element itself, you need the distance to it. The stack stores indices instead of values.
3. **Next Greater Element III** (Medium): Number manipulation problem, but uses similar “next greater” conceptual thinking.

## Key Takeaways

1. **Monotonic stacks excel at finding next/previous greater/smaller elements** in O(n) time. The stack maintains elements in increasing or decreasing order as you process the array.
2. **Preprocessing the larger array** is often the key when you have query arrays. Compute answers for all possible queries once, then answer each query in O(1) time.
3. **Recognize the pattern**: When a problem asks for “first larger/smaller element to the right/left,” think monotonic stack immediately.

**Related problems:** [Next Greater Element II](/problem/next-greater-element-ii), [Next Greater Element III](/problem/next-greater-element-iii), [Daily Temperatures](/problem/daily-temperatures)
