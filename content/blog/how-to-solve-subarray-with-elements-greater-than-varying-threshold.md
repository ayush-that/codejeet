---
title: "How to Solve Subarray With Elements Greater Than Varying Threshold — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Subarray With Elements Greater Than Varying Threshold. Hard difficulty, 45.3% acceptance rate. Topics: Array, Stack, Union-Find, Monotonic Stack."
date: "2030-01-05"
category: "dsa-patterns"
tags:
  ["subarray-with-elements-greater-than-varying-threshold", "array", "stack", "union-find", "hard"]
---

# How to Solve Subarray With Elements Greater Than Varying Threshold

This problem asks us to find a subarray where every element is greater than `threshold / k`, where `k` is the length of that subarray. The tricky part is that the threshold condition depends on the subarray length itself—longer subarrays have a lower per-element requirement (`threshold/k` decreases as `k` increases). This creates an interesting optimization challenge: we need to efficiently check all possible subarrays while handling this length-dependent condition.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, 4, 3, 1]` with `threshold = 6`.

We need to find a subarray of length `k` where every element > `6/k`.

**Key insight**: For a given subarray, the minimum element determines whether the condition holds. If the minimum element > `threshold/k`, then ALL elements > `threshold/k`.

Let's check some possibilities:

- `k=1`: Need element > `6/1 = 6`. No single element meets this.
- `k=2`: Need every element > `6/2 = 3`. Check subarrays:
  - `[1,3]`: min=1 ≤ 3 ❌
  - `[3,4]`: min=3 ≤ 3 ❌ (needs to be strictly greater)
  - `[4,3]`: min=3 ≤ 3 ❌
  - `[3,1]`: min=1 ≤ 3 ❌
- `k=3`: Need every element > `6/3 = 2`. Check:
  - `[1,3,4]`: min=1 ≤ 2 ❌
  - `[3,4,3]`: min=3 > 2 ✅ Found! Return 3.

Notice that for `k=3`, we found `[3,4,3]` works because its minimum (3) > 2. The brute force would check all O(n²) subarrays, but we can do better by recognizing that for each position, we want to know: "What's the largest subarray where this element is the minimum?"

## Brute Force Approach

The brute force solution checks every possible subarray:

1. For each starting index `i` (0 to n-1)
2. For each ending index `j` (i to n-1)
3. Calculate `k = j-i+1` and `min_val = min(nums[i:j+1])`
4. Check if `min_val > threshold/k`

This takes O(n³) time if we naively find the minimum each time, or O(n²) with careful minimum tracking. Either way, it's too slow for n up to 10⁵.

**Why brute force fails**: With n=10⁵, O(n²) operations (10¹⁰) is impossible within time limits. We need O(n) or O(n log n).

<div class="code-group">

```python
# Brute Force - Too Slow for Large Inputs
# Time: O(n³) | Space: O(1)
def brute_force(nums, threshold):
    n = len(nums)

    # Check all possible subarrays
    for i in range(n):
        min_val = float('inf')
        for j in range(i, n):
            # Update minimum for current subarray
            min_val = min(min_val, nums[j])
            k = j - i + 1

            # Check condition: min > threshold/k
            if min_val > threshold / k:
                return k

    return -1
```

```javascript
// Brute Force - Too Slow for Large Inputs
// Time: O(n³) | Space: O(1)
function bruteForce(nums, threshold) {
  const n = nums.length;

  // Check all possible subarrays
  for (let i = 0; i < n; i++) {
    let minVal = Infinity;
    for (let j = i; j < n; j++) {
      // Update minimum for current subarray
      minVal = Math.min(minVal, nums[j]);
      const k = j - i + 1;

      // Check condition: min > threshold/k
      if (minVal > threshold / k) {
        return k;
      }
    }
  }

  return -1;
}
```

```java
// Brute Force - Too Slow for Large Inputs
// Time: O(n³) | Space: O(1)
public int bruteForce(int[] nums, int threshold) {
    int n = nums.length;

    // Check all possible subarrays
    for (int i = 0; i < n; i++) {
        int minVal = Integer.MAX_VALUE;
        for (int j = i; j < n; j++) {
            // Update minimum for current subarray
            minVal = Math.min(minVal, nums[j]);
            int k = j - i + 1;

            // Check condition: min > threshold/k
            if (minVal > threshold / (double) k) {
                return k;
            }
        }
    }

    return -1;
}
```

</div>

## Optimized Approach

The key insight is to reformulate the condition: For a subarray with minimum value `m` and length `k`, we need `m > threshold/k`. Multiply both sides by `k`: `m * k > threshold`.

So for each element `nums[i]` as the minimum of some subarray, we want the largest possible `k` (subarray length) where `nums[i]` remains the minimum. Then check if `nums[i] * k > threshold`.

**How to find these subarrays efficiently?** Use a **monotonic stack**:

1. For each position, find the previous smaller element (left boundary)
2. Find the next smaller element (right boundary)
3. The subarray where `nums[i]` is the minimum spans from `left+1` to `right-1`

**Why this works**: In the subarray `[left+1, right-1]`, `nums[i]` is strictly smaller than elements at `left` and `right` (or boundaries), so it's the minimum. Any larger subarray would include a smaller element.

**Algorithm**:

1. Find `prevSmaller` - index of previous element < current (or -1 if none)
2. Find `nextSmaller` - index of next element < current (or n if none)
3. For each `i`, calculate `k = nextSmaller[i] - prevSmaller[i] - 1`
4. Check if `nums[i] * k > threshold`
5. Return the maximum valid `k` found

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution using Monotonic Stack
# Time: O(n) | Space: O(n)
def validSubarraySize(nums, threshold):
    n = len(nums)

    # Step 1: Find previous smaller element for each position
    prev_smaller = [-1] * n
    stack = []

    for i in range(n):
        # Maintain increasing stack (strictly increasing)
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()

        # Top of stack is previous smaller (or -1 if empty)
        prev_smaller[i] = stack[-1] if stack else -1
        stack.append(i)

    # Step 2: Find next smaller element for each position
    next_smaller = [n] * n
    stack.clear()

    for i in range(n - 1, -1, -1):
        # Maintain increasing stack (strictly increasing)
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()

        # Top of stack is next smaller (or n if empty)
        next_smaller[i] = stack[-1] if stack else n
        stack.append(i)

    # Step 3: Check each element as potential minimum
    for i in range(n):
        # Length of subarray where nums[i] is minimum
        k = next_smaller[i] - prev_smaller[i] - 1

        # Check condition: min * length > threshold
        if nums[i] * k > threshold:
            return k

    return -1
```

```javascript
// Optimal Solution using Monotonic Stack
// Time: O(n) | Space: O(n)
function validSubarraySize(nums, threshold) {
  const n = nums.length;

  // Step 1: Find previous smaller element for each position
  const prevSmaller = new Array(n).fill(-1);
  const stack = [];

  for (let i = 0; i < n; i++) {
    // Maintain increasing stack (strictly increasing)
    while (stack.length && nums[stack[stack.length - 1]] >= nums[i]) {
      stack.pop();
    }

    // Top of stack is previous smaller (or -1 if empty)
    prevSmaller[i] = stack.length ? stack[stack.length - 1] : -1;
    stack.push(i);
  }

  // Step 2: Find next smaller element for each position
  const nextSmaller = new Array(n).fill(n);
  stack.length = 0; // Clear stack

  for (let i = n - 1; i >= 0; i--) {
    // Maintain increasing stack (strictly increasing)
    while (stack.length && nums[stack[stack.length - 1]] >= nums[i]) {
      stack.pop();
    }

    // Top of stack is next smaller (or n if empty)
    nextSmaller[i] = stack.length ? stack[stack.length - 1] : n;
    stack.push(i);
  }

  // Step 3: Check each element as potential minimum
  for (let i = 0; i < n; i++) {
    // Length of subarray where nums[i] is minimum
    const k = nextSmaller[i] - prevSmaller[i] - 1;

    // Check condition: min * length > threshold
    if (nums[i] * k > threshold) {
      return k;
    }
  }

  return -1;
}
```

```java
// Optimal Solution using Monotonic Stack
// Time: O(n) | Space: O(n)
public int validSubarraySize(int[] nums, int threshold) {
    int n = nums.length;

    // Step 1: Find previous smaller element for each position
    int[] prevSmaller = new int[n];
    Arrays.fill(prevSmaller, -1);
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        // Maintain increasing stack (strictly increasing)
        while (!stack.isEmpty() && nums[stack.peek()] >= nums[i]) {
            stack.pop();
        }

        // Top of stack is previous smaller (or -1 if empty)
        prevSmaller[i] = stack.isEmpty() ? -1 : stack.peek();
        stack.push(i);
    }

    // Step 2: Find next smaller element for each position
    int[] nextSmaller = new int[n];
    Arrays.fill(nextSmaller, n);
    stack.clear();

    for (int i = n - 1; i >= 0; i--) {
        // Maintain increasing stack (strictly increasing)
        while (!stack.isEmpty() && nums[stack.peek()] >= nums[i]) {
            stack.pop();
        }

        // Top of stack is next smaller (or n if empty)
        nextSmaller[i] = stack.isEmpty() ? n : stack.peek();
        stack.push(i);
    }

    // Step 3: Check each element as potential minimum
    for (int i = 0; i < n; i++) {
        // Length of subarray where nums[i] is minimum
        int k = nextSmaller[i] - prevSmaller[i] - 1;

        // Check condition: min * length > threshold
        if ((long) nums[i] * k > threshold) {
            return k;
        }
    }

    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We make two passes through the array to find previous and next smaller elements
- Each element is pushed and popped from the stack at most once
- Final pass to check conditions is O(n)
- Total: O(3n) = O(n)

**Space Complexity**: O(n)

- We store three arrays of size n: `prevSmaller`, `nextSmaller`, and the stack
- In practice, the stack uses at most O(n) space
- Total: O(3n) = O(n)

## Common Mistakes

1. **Using ≤ instead of < for stack comparisons**: We need strictly smaller elements to define boundaries. If we use `≤`, we might incorrectly include equal elements, making the minimum calculation wrong.

2. **Forgetting to handle multiplication overflow**: When `nums[i]` and `k` are large (up to 10⁵), their product can exceed 32-bit integer range. Use 64-bit integers (long in Java, no issue in Python/JS).

3. **Incorrect boundary initialization**: `prevSmaller` should default to -1 (left of array), and `nextSmaller` to n (right of array). Using 0 or n-1 would be wrong.

4. **Checking average instead of product**: Some candidates check `nums[i] > threshold/k` with division, which requires floating-point or careful integer division. The multiplication form `nums[i] * k > threshold` is cleaner and avoids precision issues.

## When You'll See This Pattern

This "minimum in subarray" pattern with monotonic stack appears in several problems:

1. **Maximum Subarray Min-Product (LeetCode 1856)**: Very similar—find max of `(subarray sum) * (minimum)`. Uses monotonic stack to find boundaries where each element is minimum.

2. **Largest Rectangle in Histogram (LeetCode 84)**: Exactly the same boundary-finding technique to calculate rectangle areas.

3. **Sum of Subarray Minimums (LeetCode 907)**: Find sum of minimums of all subarrays using similar boundary calculation.

The pattern: When you need to process all subarrays based on their minimum/maximum value, monotonic stack helps find the range where each element is the extremum.

## Key Takeaways

1. **Reformulate conditions**: Transform `min > threshold/k` to `min * k > threshold` to avoid division and work with integers.

2. **Monotonic stack finds boundaries**: For each element as minimum, the stack efficiently finds how far it extends left and right before encountering a smaller element.

3. **Think in terms of "contribution"**: Instead of checking all subarrays, think "for each element, what subarrays does it serve as minimum for?" This perspective change often leads to O(n) solutions.

Related problems: [Maximum Subarray Min-Product](/problem/maximum-subarray-min-product), [Smallest K-Length Subsequence With Occurrences of a Letter](/problem/smallest-k-length-subsequence-with-occurrences-of-a-letter), [K Divisible Elements Subarrays](/problem/k-divisible-elements-subarrays)
