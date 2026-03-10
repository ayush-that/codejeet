---
title: "How to Solve 132 Pattern — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode 132 Pattern. Medium difficulty, 34.5% acceptance rate. Topics: Array, Binary Search, Stack, Monotonic Stack, Ordered Set."
date: "2027-12-02"
category: "dsa-patterns"
tags: ["132-pattern", "array", "binary-search", "stack", "medium"]
---

# How to Solve 132 Pattern

The 132 pattern problem asks us to find three indices `i < j < k` where `nums[i] < nums[k] < nums[j]`. The challenge lies in efficiently checking all possible triple combinations without resorting to O(n³) brute force. The interesting twist is that the middle element `nums[j]` must be the largest of the three, while `nums[k]` sits between the other two values.

## Visual Walkthrough

Let's trace through `nums = [3, 1, 4, 2]` to build intuition:

We need `nums[i] < nums[k] < nums[j]` with `i < j < k`.

1. **Candidate i=0, j=1, k=2**: `3 < 4 < 1` ❌ (4 < 1 is false)
2. **Candidate i=0, j=1, k=3**: `3 < 2 < 1` ❌ (2 < 1 is false)
3. **Candidate i=0, j=2, k=3**: `3 < 2 < 4` ❌ (3 < 2 is false)
4. **Candidate i=1, j=2, k=3**: `1 < 2 < 4` ✅

Found it! `nums[1] = 1`, `nums[2] = 4`, `nums[3] = 2` satisfies `1 < 2 < 4`.

The key insight: For each position `j`, we need to know:

- The minimum value to its left (potential `nums[i]`)
- Some value to its right that's greater than that minimum but less than `nums[j]` (potential `nums[k]`)

## Brute Force Approach

The most straightforward solution checks all possible triplets:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def find132pattern_brute(nums):
    n = len(nums)
    # Check all possible i, j, k combinations
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if nums[i] < nums[k] < nums[j]:
                    return True
    return False
```

```javascript
// Time: O(n³) | Space: O(1)
function find132patternBrute(nums) {
  const n = nums.length;
  // Check all possible i, j, k combinations
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] < nums[k] && nums[k] < nums[j]) {
          return true;
        }
      }
    }
  }
  return false;
}
```

```java
// Time: O(n³) | Space: O(1)
public boolean find132patternBrute(int[] nums) {
    int n = nums.length;
    // Check all possible i, j, k combinations
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                if (nums[i] < nums[k] && nums[k] < nums[j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
```

</div>

This approach is correct but extremely inefficient. For an array of size `n`, we check `n choose 3` ≈ O(n³) combinations. With `n` up to 2×10⁵ in typical constraints, this would take far too long.

## Optimized Approach

The optimal solution uses a **monotonic decreasing stack** to track potential `nums[j]` values while maintaining the best possible `nums[k]` candidate. Here's the step-by-step reasoning:

1. **Precompute minimums**: For each position, compute the minimum value to its left. This gives us the best possible `nums[i]` for each potential `nums[j]`.

2. **Process from right to left**: We iterate from the end of the array to the beginning. This lets us maintain a stack of values that could serve as `nums[j]`.

3. **Stack invariant**: The stack maintains values in decreasing order (monotonic decreasing). When we encounter a new number:
   - If it's greater than the current minimum, it could be `nums[j]`
   - We pop from the stack while the top is ≤ current minimum (these can't be `nums[k]`)
   - If the stack isn't empty and the top is < current number, we found a 132 pattern!

4. **Why this works**: The stack stores values that are greater than the current minimum (potential `nums[k]` values). By processing right-to-left, we ensure `k > j`. When we find a number that's greater than a stack value, that stack value serves as `nums[k]`, the current number as `nums[j]`, and the precomputed minimum as `nums[i]`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def find132pattern(nums):
    n = len(nums)
    if n < 3:
        return False

    # Step 1: Precompute minimum value to the left of each index
    # min_left[i] = minimum value in nums[0:i] (exclusive of i)
    min_left = [float('inf')] * n
    min_left[0] = nums[0]

    for i in range(1, n):
        min_left[i] = min(min_left[i - 1], nums[i])

    # Step 2: Process from right to left using a monotonic decreasing stack
    stack = []  # stores potential nums[k] values

    for j in range(n - 1, -1, -1):
        # nums[j] must be greater than min_left[j] to be a valid middle element
        if nums[j] > min_left[j]:
            # Remove values from stack that are <= min_left[j]
            # These can't be valid nums[k] since nums[k] must be > nums[i] (min_left[j])
            while stack and stack[-1] <= min_left[j]:
                stack.pop()

            # If stack has a value and it's less than nums[j], we found a 132 pattern
            # stack[-1] is potential nums[k], min_left[j] is nums[i], nums[j] is middle
            if stack and stack[-1] < nums[j]:
                return True

            # Add current number to stack as potential nums[k] for future iterations
            stack.append(nums[j])

    return False
```

```javascript
// Time: O(n) | Space: O(n)
function find132pattern(nums) {
  const n = nums.length;
  if (n < 3) return false;

  // Step 1: Precompute minimum value to the left of each index
  // minLeft[i] = minimum value in nums[0:i] (exclusive of i)
  const minLeft = new Array(n);
  minLeft[0] = nums[0];

  for (let i = 1; i < n; i++) {
    minLeft[i] = Math.min(minLeft[i - 1], nums[i]);
  }

  // Step 2: Process from right to left using a monotonic decreasing stack
  const stack = []; // stores potential nums[k] values

  for (let j = n - 1; j >= 0; j--) {
    // nums[j] must be greater than minLeft[j] to be a valid middle element
    if (nums[j] > minLeft[j]) {
      // Remove values from stack that are <= minLeft[j]
      // These can't be valid nums[k] since nums[k] must be > nums[i] (minLeft[j])
      while (stack.length > 0 && stack[stack.length - 1] <= minLeft[j]) {
        stack.pop();
      }

      // If stack has a value and it's less than nums[j], we found a 132 pattern
      // stack[stack.length - 1] is potential nums[k], minLeft[j] is nums[i], nums[j] is middle
      if (stack.length > 0 && stack[stack.length - 1] < nums[j]) {
        return true;
      }

      // Add current number to stack as potential nums[k] for future iterations
      stack.push(nums[j]);
    }
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean find132pattern(int[] nums) {
    int n = nums.length;
    if (n < 3) return false;

    // Step 1: Precompute minimum value to the left of each index
    // minLeft[i] = minimum value in nums[0:i] (exclusive of i)
    int[] minLeft = new int[n];
    minLeft[0] = nums[0];

    for (int i = 1; i < n; i++) {
        minLeft[i] = Math.min(minLeft[i - 1], nums[i]);
    }

    // Step 2: Process from right to left using a monotonic decreasing stack
    Stack<Integer> stack = new Stack<>();  // stores potential nums[k] values

    for (int j = n - 1; j >= 0; j--) {
        // nums[j] must be greater than minLeft[j] to be a valid middle element
        if (nums[j] > minLeft[j]) {
            // Remove values from stack that are <= minLeft[j]
            // These can't be valid nums[k] since nums[k] must be > nums[i] (minLeft[j])
            while (!stack.isEmpty() && stack.peek() <= minLeft[j]) {
                stack.pop();
            }

            // If stack has a value and it's less than nums[j], we found a 132 pattern
            // stack.peek() is potential nums[k], minLeft[j] is nums[i], nums[j] is middle
            if (!stack.isEmpty() && stack.peek() < nums[j]) {
                return true;
            }

            // Add current number to stack as potential nums[k] for future iterations
            stack.push(nums[j]);
        }
    }

    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Precomputing minimums: O(n) for a single pass through the array
- Main loop with stack operations: Each element is pushed and popped at most once, so O(n) total
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- `min_left` array: O(n) to store minimums for each position
- Stack: In worst case stores all elements, O(n)
- Total: O(n) + O(n) = O(n)

## Common Mistakes

1. **Processing left-to-right instead of right-to-left**: This breaks the `j < k` constraint. When we process from the right, we ensure any value in the stack comes from indices greater than `j`.

2. **Forgetting to check `nums[j] > min_left[j]`**: If `nums[j]` isn't greater than the minimum to its left, it can't be the middle element of a 132 pattern.

3. **Incorrect stack popping condition**: Popping while `stack[-1] <= nums[j]` instead of `stack[-1] <= min_left[j]` is wrong. We need to ensure `nums[k] > nums[i]` (which is `min_left[j]`), not `nums[k] > nums[j]`.

4. **Not handling the base case**: For arrays with fewer than 3 elements, we should immediately return `false` since a 132 pattern requires 3 elements.

## When You'll See This Pattern

The monotonic stack technique used here appears in several other problems:

1. **Next Greater Element (LeetCode 496)**: Uses a similar stack to find the next greater element for each position.

2. **Daily Temperatures (LeetCode 739)**: Uses a monotonic decreasing stack to find how many days until a warmer temperature.

3. **Largest Rectangle in Histogram (LeetCode 84)**: Uses a monotonic increasing stack to find the maximum area rectangle.

The key insight across these problems is using a stack to maintain elements in a specific order while processing elements, allowing O(n) solutions to problems that seem to require O(n²) comparisons.

## Key Takeaways

1. **Monotonic stacks excel at finding "next greater/lesser" relationships**: When you need to compare each element with others in a specific direction while maintaining order, consider a monotonic stack.

2. **Precomputation can simplify complex constraints**: By computing `min_left` upfront, we transform the three-variable problem into checking simpler conditions at each position.

3. **Direction matters**: Processing from right to left was crucial here because it let us maintain potential `nums[k]` values that come after `j`. Always consider which traversal direction makes the problem easier.

[Practice this problem on CodeJeet](/problem/132-pattern)
