---
title: "How to Solve Minimum Operations to Make Array Equal to Target — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Array Equal to Target. Hard difficulty, 41.3% acceptance rate. Topics: Array, Dynamic Programming, Stack, Greedy, Monotonic Stack."
date: "2029-09-06"
category: "dsa-patterns"
tags:
  [
    "minimum-operations-to-make-array-equal-to-target",
    "array",
    "dynamic-programming",
    "stack",
    "hard",
  ]
---

# How to Solve Minimum Operations to Make Array Equal to Target

This problem asks us to transform one array into another using the minimum number of operations, where each operation can increment or decrement all elements in any contiguous subarray by 1. The challenge lies in finding an efficient way to track the cumulative effect of these operations without simulating each one individually. What makes this problem interesting is that it looks like a dynamic programming problem at first glance, but the optimal solution uses a clever greedy approach with difference arrays.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Example:** `nums = [1, 2, 3, 4]`, `target = [1, 3, 2, 5]`

First, let's calculate the difference between target and nums for each position:

- Position 0: 1 - 1 = 0 (already correct)
- Position 1: 3 - 2 = 1 (need to increase by 1)
- Position 2: 2 - 3 = -1 (need to decrease by 1)
- Position 3: 5 - 4 = 1 (need to increase by 1)

So we have difference array: `diff = [0, 1, -1, 1]`

Now think about operations: when we select a subarray and increment it, we're effectively adding 1 to a contiguous segment of our difference array (or subtracting 1 if decrementing). Our goal is to make all differences 0.

Let's simulate operations:

1. Start with `diff = [0, 1, -1, 1]`
2. We can apply a +1 operation to positions 1-3: `[0, 2, 0, 2]` (1 operation)
3. Now we need to fix position 1 (2 → 0) and position 3 (2 → 0)
4. Apply -1 to position 1: `[0, 1, 0, 2]` (2 operations)
5. Apply -1 to position 1 again: `[0, 0, 0, 2]` (3 operations)
6. Apply -1 to position 3: `[0, 0, 0, 1]` (4 operations)
7. Apply -1 to position 3 again: `[0, 0, 0, 0]` (5 operations)

But is this optimal? Let's think differently. Notice that each operation affects a contiguous segment. The key insight is that the minimum operations equals the sum of absolute differences between consecutive elements in the difference array, divided by 2. Let's see why:

For our `diff = [0, 1, -1, 1]`:

- Between position 0 and 1: |1 - 0| = 1
- Between position 1 and 2: |-1 - 1| = 2
- Between position 2 and 3: |1 - (-1)| = 2
- Total = 1 + 2 + 2 = 5
- Minimum operations = 5 / 2 = 2.5? Wait, that doesn't make sense...

Actually, we need to include the boundaries. Let's add a virtual 0 at the beginning and end:

- |1 - 0| = 1 (between virtual start 0 and position 0's 0)
- |0 - 1| = 1 (between position 0 and 1)
- |1 - (-1)| = 2 (between position 1 and 2)
- |-1 - 1| = 2 (between position 2 and 3)
- |1 - 0| = 1 (between position 3 and virtual end 0)
- Total = 1 + 1 + 2 + 2 + 1 = 7
- Minimum operations = 7 / 2 = 3.5? Still not right...

The correct formula is simpler: minimum operations = sum of positive differences between consecutive elements. Let me explain the proper approach in the next section.

## Brute Force Approach

A naive approach would be to simulate operations one by one. We could:

1. Find the first position where `nums[i] != target[i]`
2. Determine whether we need to increment or decrement
3. Extend the subarray as far as possible in the same direction
4. Apply the operation
5. Repeat until all elements match

However, this approach has several problems:

- It's not guaranteed to be optimal (we might make suboptimal choices about how far to extend)
- In the worst case, we might need O(max_diff × n) operations where max_diff is the maximum difference
- Each operation would take O(n) time to apply

The brute force is clearly infeasible for large inputs. We need a more mathematical approach.

## Optimized Approach

The key insight comes from thinking about the difference array `diff[i] = target[i] - nums[i]`. Each operation that increments a subarray `[l, r]` is equivalent to adding 1 to `diff[l..r]`, and each decrement operation subtracts 1.

Now consider this: if we look at consecutive differences, when `diff[i]` and `diff[i+1]` are different, we need at least `|diff[i+1] - diff[i]|` operations that start or end at position `i`. Why? Because operations that cover both positions `i` and `i+1` affect both differences equally, so they can't change the relative difference between them.

Here's the elegant solution: The minimum number of operations equals the sum of absolute differences between consecutive elements in the difference array, but wait — let's think about it more carefully.

Actually, consider this transformation: We want to make `diff` array all zeros. Each operation adds or subtracts 1 from a contiguous segment. This is equivalent to the problem of finding the minimum number of segment additions/subtractions needed to zero out an array.

The optimal solution: minimum operations = `|diff[0]| + Σ|diff[i] - diff[i-1]| for i=1 to n-1`? Let's test:

For our example `diff = [0, 1, -1, 1]`:

- Start with `|0| = 0`
- Add `|1 - 0| = 1` → total 1
- Add `|-1 - 1| = 2` → total 3
- Add `|1 - (-1)| = 2` → total 5

So we get 5 operations, which matches our simulation! But is this always correct?

Let me derive it properly: Think of `diff` as a sequence of heights. Each operation raises or lowers a contiguous segment by 1. The minimum operations equals the sum of all "upward steps" when scanning left to right. More precisely:

1. Start with current height = 0
2. For each position i, we need to reach height = diff[i]
3. The operations needed = |diff[0]| + Σ max(0, diff[i] - diff[i-1]) for i=1 to n-1

Wait, that's not symmetric. Actually, the correct formula is simpler: minimum operations = sum of absolute values of consecutive differences. Let me verify with another example.

Actually, I realize now: The minimum operations equals the sum of the absolute differences between consecutive elements, but we also need to account for the first element. The correct formula is:

**minimum operations = |diff[0]| + Σ|diff[i] - diff[i-1]| for i=1 to n-1**

But we need to divide by 2 because each operation affects two boundaries? Let me think...

No, here's the correct reasoning: Each operation that starts at position i contributes +1 to the count, and each operation that ends at position i contributes +1 to the count. So the total operations = (sum of all start points + sum of all end points) / 2.

For a difference array diff, the number of operations starting at i = max(0, diff[i] - diff[i-1]) where we define diff[-1] = 0.
The number of operations ending at i = max(0, diff[i-1] - diff[i]) where we define diff[n] = 0.

Actually, the cleanest way: minimum operations = sum of positive differences between consecutive elements (including with 0 at boundaries).

Let me implement this and test.

## Optimal Solution

The optimal solution uses a greedy approach. We calculate the difference array and then compute the minimum operations as the sum of all positive changes when scanning from left to right, including the boundaries with 0.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minOperations(nums, target):
    """
    Calculate minimum operations to transform nums into target.

    The key insight is that each operation affects a contiguous segment,
    so we only need to track changes between consecutive elements.
    """
    n = len(nums)
    operations = 0
    prev_diff = 0  # Treat the element before index 0 as having diff 0

    for i in range(n):
        # Calculate current difference needed
        curr_diff = target[i] - nums[i]

        # If current difference is greater than previous, we need
        # (curr_diff - prev_diff) operations that start at position i
        if curr_diff > prev_diff:
            operations += curr_diff - prev_diff

        # Update prev_diff for next iteration
        prev_diff = curr_diff

    # After processing all elements, we need to return to diff 0
    # If the last element has positive diff, we need to end operations
    if prev_diff > 0:
        operations += prev_diff

    return operations
```

```javascript
// Time: O(n) | Space: O(1)
function minOperations(nums, target) {
  /**
   * Calculate minimum operations to transform nums into target.
   *
   * We track the difference between consecutive positions and count
   * only when we need to start new operations.
   */
  const n = nums.length;
  let operations = 0;
  let prevDiff = 0; // Difference before first element (imaginary 0)

  for (let i = 0; i < n; i++) {
    // Current difference needed at position i
    const currDiff = target[i] - nums[i];

    // If we need to increase more than previous position,
    // we need to start new operations here
    if (currDiff > prevDiff) {
      operations += currDiff - prevDiff;
    }

    // Update previous difference for next iteration
    prevDiff = currDiff;
  }

  // If we end with positive difference, we need to end operations
  if (prevDiff > 0) {
    operations += prevDiff;
  }

  return operations;
}
```

```java
// Time: O(n) | Space: O(1)
public int minOperations(int[] nums, int[] target) {
    /**
     * Calculate minimum operations to transform nums into target.
     *
     * The algorithm works by tracking differences between consecutive
     * positions and counting operation starts and ends.
     */
    int n = nums.length;
    int operations = 0;
    int prevDiff = 0;  // Difference before first element

    for (int i = 0; i < n; i++) {
        // Compute current difference needed
        int currDiff = target[i] - nums[i];

        // When current difference exceeds previous, we need to
        // start new operations from this position
        if (currDiff > prevDiff) {
            operations += currDiff - prevDiff;
        }

        // Update for next iteration
        prevDiff = currDiff;
    }

    // Account for any remaining positive difference at the end
    if (prevDiff > 0) {
        operations += prevDiff;
    }

    return operations;
}
```

</div>

Wait, I need to handle negative differences too! The above only handles when we need to increment. Let me fix this to handle both increment and decrement operations:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minOperations(nums, target):
    """
    Calculate minimum operations to transform nums into target.

    The correct approach: minimum operations equals the sum of
    absolute differences between consecutive elements in the
    difference array, considering 0 at boundaries.
    """
    n = len(nums)
    operations = 0
    prev_diff = 0  # Difference before first element

    for i in range(n):
        # Current difference needed
        curr_diff = target[i] - nums[i]

        # Add the absolute difference between current and previous
        # This counts operations that start or end at position i-1
        operations += abs(curr_diff - prev_diff)

        # Update previous difference
        prev_diff = curr_diff

    # Add the absolute value of the last difference
    # This counts operations that end at the last position
    operations += abs(prev_diff)

    return operations // 2
```

```javascript
// Time: O(n) | Space: O(1)
function minOperations(nums, target) {
  /**
   * Calculate minimum operations to transform nums into target.
   *
   * Each operation affects a contiguous segment, so we count
   * the absolute differences between consecutive positions.
   */
  const n = nums.length;
  let operations = 0;
  let prevDiff = 0;

  for (let i = 0; i < n; i++) {
    const currDiff = target[i] - nums[i];
    operations += Math.abs(currDiff - prevDiff);
    prevDiff = currDiff;
  }

  // Add the last boundary
  operations += Math.abs(prevDiff);

  // Each operation is counted twice (at start and end)
  return operations / 2;
}
```

```java
// Time: O(n) | Space: O(1)
public int minOperations(int[] nums, int[] target) {
    /**
     * Calculate minimum operations to transform nums into target.
     *
     * We sum absolute differences between consecutive positions
     * and divide by 2 since each operation has a start and end.
     */
    int n = nums.length;
    int operations = 0;
    int prevDiff = 0;

    for (int i = 0; i < n; i++) {
        int currDiff = target[i] - nums[i];
        operations += Math.abs(currDiff - prevDiff);
        prevDiff = currDiff;
    }

    // Handle the boundary after last element
    operations += Math.abs(prevDiff);

    // Each operation is counted at both its start and end point
    return operations / 2;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the arrays. We make a single pass through the arrays to compute differences and accumulate operations.

**Space Complexity:** O(1) for all implementations. We only use a constant amount of extra space regardless of input size, storing just a few integer variables.

The key to the O(n) time complexity is that we don't simulate individual operations. Instead, we mathematically compute the minimum number needed by analyzing the difference array's "shape" — specifically, how much it changes between consecutive positions.

## Common Mistakes

1. **Forgetting to handle both increment and decrement operations:** Some candidates only write code for positive differences (increments) and forget that we might need to decrement. The solution must use absolute values to handle both cases.

2. **Off-by-one errors with boundaries:** It's easy to forget the boundaries (before first element and after last element). Remember that operations can start at position 0 and end at position n-1, so we need to include differences with the implicit 0 at both ends.

3. **Not dividing by 2 at the end:** Each operation is counted twice in our sum — once when it starts and once when it ends. Forgetting to divide by 2 will give double the actual answer.

4. **Integer division issues:** In languages like Java, dividing an odd number by 2 using integer division truncates. However, in this problem, the sum of absolute differences is always even (can you see why?), so integer division works correctly.

## When You'll See This Pattern

This "difference array" or "prefix sum of differences" pattern appears in several problems:

1. **LeetCode 1526: Minimum Number of Increments on Subarrays to Form a Target Array** - Almost identical problem! The solution uses the same insight about tracking differences between consecutive elements.

2. **LeetCode 2381: Shifting Letters II** - While not identical, it uses a similar concept of applying range updates efficiently using difference arrays.

3. **LeetCode 1094: Car Pooling** - Uses difference arrays to track passenger counts at various locations, similar to how we track operation counts here.

The core pattern is recognizing that when operations affect contiguous segments, you can often transform the problem into analyzing differences between consecutive positions rather than simulating each operation.

## Key Takeaways

1. **Range operation problems often reduce to difference analysis:** When you can add/subtract to contiguous segments, think about how the operation affects the difference between adjacent elements rather than simulating each operation.

2. **Boundaries matter:** Always consider what happens before the first element and after the last element. These implicit boundaries are often key to the solution.

3. **Each operation has two endpoints:** In contiguous segment operations, each operation starts somewhere and ends somewhere. Counting both gives you twice the actual number, hence the division by 2.

[Practice this problem on CodeJeet](/problem/minimum-operations-to-make-array-equal-to-target)
