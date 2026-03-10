---
title: "How to Solve Sum of Subarray Minimums — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Subarray Minimums. Medium difficulty, 38.3% acceptance rate. Topics: Array, Dynamic Programming, Stack, Monotonic Stack."
date: "2027-07-07"
category: "dsa-patterns"
tags: ["sum-of-subarray-minimums", "array", "dynamic-programming", "stack", "medium"]
---

# How to Solve Sum of Subarray Minimums

This problem asks us to find the sum of the minimum element in every contiguous subarray of a given integer array. The challenge is that a naive approach would require examining all O(n²) subarrays, which is too slow for constraints where n can be up to 3×10⁴. The key insight is that we can compute each element's contribution to the total sum by determining how many subarrays have that element as their minimum.

## Visual Walkthrough

Let's trace through a concrete example: `arr = [3, 1, 2, 4]`

**Brute force calculation:**

- Subarrays starting at index 0: `[3]` (min=3), `[3,1]` (min=1), `[3,1,2]` (min=1), `[3,1,2,4]` (min=1)
- Starting at index 1: `[1]` (min=1), `[1,2]` (min=1), `[1,2,4]` (min=1)
- Starting at index 2: `[2]` (min=2), `[2,4]` (min=2)
- Starting at index 3: `[4]` (min=4)

Sum = 3 + 1 + 1 + 1 + 1 + 1 + 1 + 2 + 2 + 4 = 17

**Better approach:** For each element, count how many subarrays have it as the minimum:

- Element 3 at index 0: Only subarray `[3]` has 3 as minimum. Why? Because to the right, element 1 is smaller, so any subarray extending past index 1 won't have 3 as minimum.
- Element 1 at index 1: All subarrays containing index 1 where 1 is the minimum. To the left, we can extend 0 positions (since 3 > 1, we could include it, but careful: if we include 3, then 3 would be the minimum, not 1). Actually, we need to find the nearest smaller element on the left - which is none, so we can extend 1 position to the left. To the right, we can extend 2 positions (2 and 4 are both ≥ 1). So we have (1+1) × (2+1) = 6 subarrays where 1 is minimum.
- Element 2 at index 2: Nearest smaller on left is 1 at index 1, so can extend 0 positions to left. Nearest smaller on right is none, so can extend 1 position to right. (0+1) × (1+1) = 2 subarrays.
- Element 4 at index 3: Nearest smaller on left is 2 at index 2, so can extend 0 positions. No element on right. (0+1) × (0+1) = 1 subarray.

Total = (3×1) + (1×6) + (2×2) + (4×1) = 3 + 6 + 4 + 4 = 17

This shows the pattern: For each element `arr[i]`, find:

- `left[i]` = number of consecutive elements to the left ≥ arr[i] before hitting a smaller element
- `right[i]` = number of consecutive elements to the right ≥ arr[i] before hitting a smaller element
- Contribution = `arr[i] × (left[i] + 1) × (right[i] + 1)`

## Brute Force Approach

The most straightforward solution is to generate all subarrays and find their minimums:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def sumSubarrayMins(arr):
    n = len(arr)
    total = 0
    MOD = 10**9 + 7

    # Generate all subarrays
    for i in range(n):
        for j in range(i, n):
            # Find minimum in subarray arr[i:j+1]
            min_val = arr[i]
            for k in range(i, j + 1):
                min_val = min(min_val, arr[k])
            total = (total + min_val) % MOD

    return total
```

```javascript
// Time: O(n³) | Space: O(1)
function sumSubarrayMins(arr) {
  const n = arr.length;
  let total = 0;
  const MOD = 10 ** 9 + 7;

  // Generate all subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Find minimum in subarray arr[i..j]
      let minVal = arr[i];
      for (let k = i; k <= j; k++) {
        minVal = Math.min(minVal, arr[k]);
      }
      total = (total + minVal) % MOD;
    }
  }

  return total;
}
```

```java
// Time: O(n³) | Space: O(1)
public int sumSubarrayMins(int[] arr) {
    int n = arr.length;
    long total = 0;
    final int MOD = 1_000_000_007;

    // Generate all subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Find minimum in subarray arr[i..j]
            int minVal = arr[i];
            for (int k = i; k <= j; k++) {
                minVal = Math.min(minVal, arr[k]);
            }
            total = (total + minVal) % MOD;
        }
    }

    return (int)total;
}
```

</div>

**Why this fails:** With O(n³) time complexity, this solution times out for n > 100. Even with optimization to O(n²) by keeping track of minimum while expanding subarrays, it's still too slow for n up to 30,000.

## Optimized Approach

The key insight is that instead of thinking about subarrays, we think about each element's contribution. For element `arr[i]` to be the minimum of a subarray:

1. The subarray must contain `arr[i]`
2. All elements in the subarray must be ≥ `arr[i]`
3. No element smaller than `arr[i]` can be in the subarray

We need to find for each `arr[i]`:

- How far to the left can we extend while maintaining `arr[i]` as minimum?
- How far to the right can we extend while maintaining `arr[i]` as minimum?

This is a classic **next smaller element** problem, which we can solve efficiently using a **monotonic increasing stack**. The stack helps us find, for each element, the nearest smaller element on both sides in O(n) time.

**Algorithm:**

1. Initialize two arrays `left` and `right` to store distances to next smaller elements
2. Use a monotonic increasing stack to find nearest smaller element on the left
3. Use another pass to find nearest smaller element on the right
4. For each element, compute contribution = `arr[i] × (left[i] + 1) × (right[i] + 1)`
5. Sum all contributions modulo 10⁹+7

## Optimal Solution

Here's the complete implementation using monotonic stacks:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def sumSubarrayMins(arr):
    n = len(arr)
    MOD = 10**9 + 7

    # left[i] = number of consecutive elements to the left >= arr[i]
    # right[i] = number of consecutive elements to the right > arr[i]
    # We use > for right to handle duplicates correctly (count each subarray once)
    left = [0] * n
    right = [0] * n

    # Monotonic increasing stack to find next smaller element on left
    stack = []
    for i in range(n):
        # Pop elements from stack while current element is smaller
        # This finds the nearest smaller element on the left
        while stack and arr[stack[-1]] > arr[i]:
            stack.pop()

        # Distance to nearest smaller element on left
        # If stack is empty, all elements to left are >= current
        left[i] = i - stack[-1] - 1 if stack else i
        stack.append(i)

    # Clear stack for next pass
    stack = []

    # Monotonic increasing stack to find next smaller element on right
    # Note: we use >= for right side to avoid double counting duplicates
    for i in range(n - 1, -1, -1):
        # Pop elements while current element is smaller or equal
        # Using >= ensures we handle duplicates correctly
        while stack and arr[stack[-1]] >= arr[i]:
            stack.pop()

        # Distance to nearest smaller element on right
        # If stack is empty, all elements to right are > current
        right[i] = stack[-1] - i - 1 if stack else n - i - 1
        stack.append(i)

    # Calculate total sum
    total = 0
    for i in range(n):
        # Contribution of arr[i] = arr[i] * number of subarrays where it's minimum
        # Number of subarrays = (left_count + 1) * (right_count + 1)
        total = (total + arr[i] * (left[i] + 1) * (right[i] + 1)) % MOD

    return total
```

```javascript
// Time: O(n) | Space: O(n)
function sumSubarrayMins(arr) {
  const n = arr.length;
  const MOD = 10 ** 9 + 7;

  // left[i] = number of consecutive elements to the left >= arr[i]
  // right[i] = number of consecutive elements to the right > arr[i]
  const left = new Array(n).fill(0);
  const right = new Array(n).fill(0);

  // Monotonic increasing stack to find next smaller element on left
  const stack = [];
  for (let i = 0; i < n; i++) {
    // Pop elements from stack while current element is smaller
    while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) {
      stack.pop();
    }

    // Distance to nearest smaller element on left
    left[i] = stack.length > 0 ? i - stack[stack.length - 1] - 1 : i;
    stack.push(i);
  }

  // Clear stack for next pass
  stack.length = 0;

  // Monotonic increasing stack to find next smaller element on right
  // Using >= for right side to avoid double counting duplicates
  for (let i = n - 1; i >= 0; i--) {
    // Pop elements while current element is smaller or equal
    while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {
      stack.pop();
    }

    // Distance to nearest smaller element on right
    right[i] = stack.length > 0 ? stack[stack.length - 1] - i - 1 : n - i - 1;
    stack.push(i);
  }

  // Calculate total sum
  let total = 0;
  for (let i = 0; i < n; i++) {
    // Contribution = arr[i] * number of subarrays where it's minimum
    total = (total + arr[i] * (left[i] + 1) * (right[i] + 1)) % MOD;
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(n)
public int sumSubarrayMins(int[] arr) {
    int n = arr.length;
    final int MOD = 1_000_000_007;

    // left[i] = number of consecutive elements to the left >= arr[i]
    // right[i] = number of consecutive elements to the right > arr[i]
    int[] left = new int[n];
    int[] right = new int[n];

    // Monotonic increasing stack to find next smaller element on left
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        // Pop elements from stack while current element is smaller
        while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) {
            stack.pop();
        }

        // Distance to nearest smaller element on left
        left[i] = !stack.isEmpty() ? i - stack.peek() - 1 : i;
        stack.push(i);
    }

    // Clear stack for next pass
    stack.clear();

    // Monotonic increasing stack to find next smaller element on right
    // Using >= for right side to avoid double counting duplicates
    for (int i = n - 1; i >= 0; i--) {
        // Pop elements while current element is smaller or equal
        while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {
            stack.pop();
        }

        // Distance to nearest smaller element on right
        right[i] = !stack.isEmpty() ? stack.peek() - i - 1 : n - i - 1;
        stack.push(i);
    }

    // Calculate total sum
    long total = 0;
    for (int i = 0; i < n; i++) {
        // Contribution = arr[i] * number of subarrays where it's minimum
        // Use long to avoid overflow during multiplication
        long contribution = (long) arr[i] * (left[i] + 1) * (right[i] + 1);
        total = (total + contribution) % MOD;
    }

    return (int) total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one left-to-right and one right-to-left
- Each element is pushed and popped from the stack at most once, so total operations are O(n)
- The final summation pass is also O(n)

**Space Complexity: O(n)**

- We store `left` and `right` arrays of size n
- The stack can contain up to n elements in the worst case (strictly decreasing array)
- Total space: O(3n) = O(n)

## Common Mistakes

1. **Not handling duplicates correctly**: If we use the same comparison operator (`>`) for both sides, duplicate values will cause some subarrays to be counted multiple times or not at all. The correct approach is to use `>` for left and `>=` for right (or vice versa) to ensure each subarray's minimum is counted exactly once.

2. **Forgetting the modulo operation**: The problem states the answer may be large and requires modulo 10⁹+7. Candidates often compute the correct value but forget to apply modulo throughout the calculation, leading to integer overflow.

3. **Off-by-one errors in distance calculation**: When computing `left[i]` and `right[i]`, it's easy to miscount. Remember: if there's no smaller element to the left, the distance is `i` (not `i-1`). If there's no smaller element to the right, the distance is `n-i-1`.

4. **Using the wrong data type for intermediate calculations**: In Java, the product `arr[i] × (left[i] + 1) × (right[i] + 1)` can easily exceed `Integer.MAX_VALUE`. Always use `long` for intermediate calculations before applying modulo.

## When You'll See This Pattern

The monotonic stack pattern for finding next smaller/greater elements appears in many array processing problems:

1. **Largest Rectangle in Histogram (Hard)**: Similar concept of finding boundaries where current element is the minimum/maximum.

2. **Daily Temperatures (Medium)**: Finding next greater element for each position.

3. **Trapping Rain Water (Hard)**: Finding boundaries where water can be trapped, often solved with monotonic stacks or two pointers.

4. **Sum of Subarray Ranges (Medium)**: Direct extension of this problem - find sum of (max - min) for all subarrays.

5. **Sum of Total Strength of Wizards (Hard)**: More complex variant that also involves prefix sums and requires careful handling of modulo operations.

## Key Takeaways

1. **Think in terms of contribution**: Instead of enumerating all subarrays (O(n²)), think about how much each element contributes to the final answer. This often leads to O(n) or O(n log n) solutions.

2. **Monotonic stacks are perfect for boundary problems**: When you need to find "nearest smaller/greater element" or boundaries where a property holds, monotonic stacks provide an O(n) solution.

3. **Handle duplicates carefully**: When counting subarrays where an element is minimum/maximum, decide on strict vs non-strict inequality for left and right boundaries to avoid double counting.

4. **Watch for overflow in product calculations**: When dealing with large arrays and multiplication, use larger data types (long in Java) and apply modulo operations early.

Related problems: [Sum of Subarray Ranges](/problem/sum-of-subarray-ranges), [Sum of Total Strength of Wizards](/problem/sum-of-total-strength-of-wizards)
