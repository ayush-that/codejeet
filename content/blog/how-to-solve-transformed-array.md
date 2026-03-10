---
title: "How to Solve Transformed Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Transformed Array. Easy difficulty, 70.4% acceptance rate. Topics: Array, Simulation."
date: "2026-05-16"
category: "dsa-patterns"
tags: ["transformed-array", "array", "simulation", "easy"]
---

# How to Solve Transformed Array

This problem asks us to transform a circular array by moving forward or backward based on each element's value. The tricky part is handling the circular nature correctly — when moving past the array boundaries, we need to wrap around to the other side. Each transformation is independent, meaning we calculate each result[i] separately without affecting other calculations.

## Visual Walkthrough

Let's trace through an example: `nums = [3, -2, 1, 4]`

For each index i, we need to find the new position:

- **i = 0**: `nums[0] = 3` (positive) → Move forward 3 steps
  - Start at index 0
  - Step 1: 0 → 1
  - Step 2: 1 → 2
  - Step 3: 2 → 3
  - Final position: 3 → `result[0] = nums[3] = 4`

- **i = 1**: `nums[1] = -2` (negative) → Move backward 2 steps
  - Start at index 1
  - Step 1: 1 → 0
  - Step 2: 0 → -1 (out of bounds, wrap around)
  - Wrap: -1 → length - 1 = 3
  - Final position: 3 → `result[1] = nums[3] = 4`

- **i = 2**: `nums[2] = 1` (positive) → Move forward 1 step
  - Start at index 2
  - Step 1: 2 → 3
  - Final position: 3 → `result[2] = nums[3] = 4`

- **i = 3**: `nums[3] = 4` (positive) → Move forward 4 steps
  - Start at index 3
  - Step 1: 3 → 4 (out of bounds, wrap around)
  - Wrap: 4 → 0
  - Step 2: 0 → 1
  - Step 3: 1 → 2
  - Step 4: 2 → 3
  - Final position: 3 → `result[3] = nums[3] = 4`

Final result: `[4, 4, 4, 4]`

## Brute Force Approach

A naive approach would be to literally simulate each step one by one. For each index i:

1. Start at position = i
2. If nums[i] > 0: repeat nums[i] times: position = (position + 1) % n
3. If nums[i] < 0: repeat abs(nums[i]) times: position = (position - 1 + n) % n
4. Set result[i] = nums[position]

This approach is correct but inefficient because for each element with value k, we perform |k| operations. If k can be large (up to 1000 in constraints), and we have n elements, worst-case time complexity becomes O(n × max|k|), which could be O(1000n).

However, we can optimize this by calculating the final position directly using modular arithmetic instead of simulating each step.

## Optimal Solution

We can compute the final position directly using the modulo operator. The key insight is that moving forward k steps from position i in a circular array of length n lands us at position `(i + k) % n`. Moving backward k steps is equivalent to moving forward `(n - (k % n))` steps, or simply `(i - k) % n` with proper handling of negative modulo.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def transformed_array(nums):
    """
    Transform a circular array according to the rules:
    - If nums[i] > 0: move forward nums[i] steps
    - If nums[i] < 0: move backward abs(nums[i]) steps
    - If nums[i] == 0: stay in place
    """
    n = len(nums)
    result = [0] * n  # Initialize result array with same size

    for i in range(n):
        # Calculate the new index based on nums[i]
        if nums[i] > 0:
            # Move forward: (current index + steps) % array length
            new_index = (i + nums[i]) % n
        elif nums[i] < 0:
            # Move backward: (current index - steps) % array length
            # Adding n ensures we get a positive result before modulo
            new_index = (i + nums[i]) % n
        else:
            # If nums[i] == 0, stay at current index
            new_index = i

        # Assign the value at the new index to result[i]
        result[i] = nums[new_index]

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function transformedArray(nums) {
  /**
   * Transform a circular array according to the rules:
   * - If nums[i] > 0: move forward nums[i] steps
   * - If nums[i] < 0: move backward Math.abs(nums[i]) steps
   * - If nums[i] == 0: stay in place
   */
  const n = nums.length;
  const result = new Array(n).fill(0); // Initialize result array with same size

  for (let i = 0; i < n; i++) {
    let newIndex;

    // Calculate the new index based on nums[i]
    if (nums[i] > 0) {
      // Move forward: (current index + steps) % array length
      newIndex = (i + nums[i]) % n;
    } else if (nums[i] < 0) {
      // Move backward: (current index + steps) % array length
      // JavaScript's % operator handles negatives correctly
      newIndex = (i + nums[i]) % n;
      // Ensure positive result
      if (newIndex < 0) {
        newIndex += n;
      }
    } else {
      // If nums[i] == 0, stay at current index
      newIndex = i;
    }

    // Assign the value at the new index to result[i]
    result[i] = nums[newIndex];
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] transformedArray(int[] nums) {
        /**
         * Transform a circular array according to the rules:
         * - If nums[i] > 0: move forward nums[i] steps
         * - If nums[i] < 0: move backward Math.abs(nums[i]) steps
         * - If nums[i] == 0: stay in place
         */
        int n = nums.length;
        int[] result = new int[n]; // Initialize result array with same size

        for (int i = 0; i < n; i++) {
            int newIndex;

            // Calculate the new index based on nums[i]
            if (nums[i] > 0) {
                // Move forward: (current index + steps) % array length
                newIndex = (i + nums[i]) % n;
            } else if (nums[i] < 0) {
                // Move backward: (current index + steps) % array length
                // Java's % operator gives remainder, not modulo, so we need to adjust
                newIndex = (i + nums[i]) % n;
                // Ensure positive result
                if (newIndex < 0) {
                    newIndex += n;
                }
            } else {
                // If nums[i] == 0, stay at current index
                newIndex = i;
            }

            // Assign the value at the new index to result[i]
            result[i] = nums[newIndex];
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time operations for each element.
- The modulo operation and index calculation are O(1) operations.

**Space Complexity:** O(n)

- We create a new result array of the same size as the input.
- The space used by the result array is O(n).
- We use only a few extra variables (n, i, newIndex), which is O(1) additional space.

## Common Mistakes

1. **Incorrect handling of negative modulo:** Different programming languages handle negative modulo differently. In Python, `-1 % 5 = 4`, but in Java and JavaScript, `-1 % 5 = -1`. Forgetting to adjust for this difference is a common pitfall.

2. **Forgetting the zero case:** The problem doesn't explicitly state what happens when `nums[i] == 0`, but logically it means "stay in place." Some candidates miss this edge case.

3. **Simulating steps instead of calculating directly:** While simulating each step (moving one position at a time) gives the correct answer, it's inefficient for large values. The optimal solution uses modular arithmetic to jump directly to the final position.

4. **Not handling circular wrap-around correctly:** When calculating the new index, candidates might forget to use modulo or might implement it incorrectly, leading to index out of bounds errors.

## When You'll See This Pattern

This problem teaches **modular arithmetic for circular array traversal**, a pattern that appears in many coding problems:

1. **Rotate Array (LeetCode 189)** - Uses similar circular shifting logic
2. **Find the Winner of the Circular Game (LeetCode 1823)** - Josephus problem with circular elimination
3. **Circular Array Loop (LeetCode 457)** - Detecting cycles in circular arrays
4. **Design Circular Queue (LeetCode 622)** - Implementing a circular buffer

The core technique is using `(index + k) % n` for forward movement and `(index - k + n) % n` for backward movement in circular arrays.

## Key Takeaways

1. **Modular arithmetic is the key to circular arrays:** Whenever you see "circular" or "wrap-around" in a problem description, think about using the modulo operator `%` to handle boundary conditions.

2. **Language matters for negative modulo:** Python's `%` gives true mathematical modulo (always non-negative), while Java and JavaScript give the remainder (can be negative). Always adjust negative results by adding `n`.

3. **Direct calculation beats simulation:** When you can compute a result mathematically instead of simulating step-by-step, it's usually more efficient. Look for patterns that allow direct computation.

[Practice this problem on CodeJeet](/problem/transformed-array)
