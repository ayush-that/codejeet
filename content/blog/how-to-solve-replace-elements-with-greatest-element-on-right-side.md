---
title: "How to Solve Replace Elements with Greatest Element on Right Side — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Replace Elements with Greatest Element on Right Side. Easy difficulty, 72.0% acceptance rate. Topics: Array."
date: "2027-04-24"
category: "dsa-patterns"
tags: ["replace-elements-with-greatest-element-on-right-side", "array", "easy"]
---

# How to Solve Replace Elements with Greatest Element on Right Side

This problem asks us to transform an array by replacing each element with the largest value that appears to its right, with the last element becoming -1. While conceptually simple, the challenge lies in doing this efficiently without repeatedly scanning the same elements. The key insight is that we need to work backwards through the array, keeping track of the maximum value we've seen so far.

## Visual Walkthrough

Let's trace through the example `arr = [17, 18, 5, 4, 6, 1]`:

**Step-by-step process:**

1. Start from the end of the array. The last element (index 5, value 1) becomes -1.
2. Move left to index 4 (value 6). The greatest element to its right is 1, so 6 becomes 1.
3. Move left to index 3 (value 4). The greatest element to its right is max(6, 1) = 6, so 4 becomes 6.
4. Move left to index 2 (value 5). The greatest element to its right is max(4, 6, 1) = 6, so 5 becomes 6.
5. Move left to index 1 (value 18). The greatest element to its right is max(5, 4, 6, 1) = 6, so 18 becomes 6.
6. Move left to index 0 (value 17). The greatest element to its right is max(18, 5, 4, 6, 1) = 18, so 17 becomes 18.

Final result: `[18, 6, 6, 6, 1, -1]`

Notice that as we move from right to left, we can keep track of the maximum value we've seen so far, which becomes the "greatest element on the right" for the current position.

## Brute Force Approach

The most straightforward approach would be to use nested loops: for each element at index `i`, scan all elements from `i+1` to the end to find the maximum value.

**Why this is inefficient:**

- For an array of length `n`, the first element requires scanning `n-1` elements
- The second element requires scanning `n-2` elements
- This results in O(n²) time complexity, which is too slow for large arrays (n up to 10⁴ would be problematic)

**What a naive candidate might try:**
Some candidates might try to modify the array in-place from left to right, but this creates a problem: once we replace an element with the max from its right, we lose the original value that might be needed for elements to its left. This is why working from right to left is crucial.

## Optimal Solution

The optimal solution works backwards through the array, maintaining a running maximum of the values we've seen. We start from the second-to-last element and move toward the beginning, updating our maximum as we go.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) if we don't count output, O(n) if we do
def replaceElements(arr):
    """
    Replace each element with the greatest element to its right.
    The last element becomes -1.

    Approach: Traverse from right to left, keeping track of the
    maximum value seen so far.
    """
    n = len(arr)

    # Handle edge case: empty array
    if n == 0:
        return arr

    # Initialize max_so_far with -1 (for the last element)
    max_so_far = -1

    # Traverse from right to left
    for i in range(n - 1, -1, -1):
        # Store current element before we overwrite it
        current = arr[i]

        # Replace current element with max_so_far
        arr[i] = max_so_far

        # Update max_so_far for the next iteration (to the left)
        # We use max() to compare the original value with current max
        max_so_far = max(max_so_far, current)

    return arr
```

```javascript
// Time: O(n) | Space: O(1) if we don't count output, O(n) if we do
function replaceElements(arr) {
  /**
   * Replace each element with the greatest element to its right.
   * The last element becomes -1.
   *
   * Approach: Traverse from right to left, keeping track of the
   * maximum value seen so far.
   */
  const n = arr.length;

  // Handle edge case: empty array
  if (n === 0) {
    return arr;
  }

  // Initialize maxSoFar with -1 (for the last element)
  let maxSoFar = -1;

  // Traverse from right to left
  for (let i = n - 1; i >= 0; i--) {
    // Store current element before we overwrite it
    const current = arr[i];

    // Replace current element with maxSoFar
    arr[i] = maxSoFar;

    // Update maxSoFar for the next iteration (to the left)
    // We use Math.max() to compare the original value with current max
    maxSoFar = Math.max(maxSoFar, current);
  }

  return arr;
}
```

```java
// Time: O(n) | Space: O(1) if we don't count output, O(n) if we do
class Solution {
    public int[] replaceElements(int[] arr) {
        /**
         * Replace each element with the greatest element to its right.
         * The last element becomes -1.
         *
         * Approach: Traverse from right to left, keeping track of the
         * maximum value seen so far.
         */
        int n = arr.length;

        // Handle edge case: empty array
        if (n == 0) {
            return arr;
        }

        // Initialize maxSoFar with -1 (for the last element)
        int maxSoFar = -1;

        // Traverse from right to left
        for (int i = n - 1; i >= 0; i--) {
            // Store current element before we overwrite it
            int current = arr[i];

            // Replace current element with maxSoFar
            arr[i] = maxSoFar;

            // Update maxSoFar for the next iteration (to the left)
            // We use Math.max() to compare the original value with current max
            maxSoFar = Math.max(maxSoFar, current);
        }

        return arr;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the array exactly once from right to left
- Each iteration performs constant-time operations (comparison and assignment)
- This is optimal since we must at least look at each element once

**Space Complexity: O(1) auxiliary space**

- We only use a few extra variables (`max_so_far`, `current`, `i`)
- The algorithm modifies the input array in-place
- If we count the output array as space, it would be O(n), but typically we consider this as O(1) since we're reusing the input array

## Common Mistakes

1. **Working left to right instead of right to left**: This is the most common mistake. If you process from left to right, you overwrite values before they can be used as "greatest elements" for positions to their left. Always ask yourself: "Do I need information from the future (right side) to process the current element?"

2. **Forgetting to store the original value before overwriting**: In the loop, we need to save `arr[i]` to `current` before replacing it with `max_so_far`. Otherwise, we lose the original value that might be the new maximum for elements to the left.

3. **Incorrect initialization of max_so_far**: It should be initialized to -1, not 0 or arr[-1]. The last element must become -1, and -1 is always less than any array element (assuming positive integers, but the problem doesn't specify), so it won't interfere with finding the true maximum.

4. **Off-by-one errors in the loop range**: The loop should start at `n-1` (last element) and go down to 0 (first element). A common error is starting at `n-2` or ending at 1, which would skip processing the first or last element correctly.

## When You'll See This Pattern

This "right-to-left traversal with running maximum" pattern appears in several array transformation problems:

1. **Next Greater Element I (LeetCode 496)**: Find the next greater element for each element in an array. The optimal solution uses a similar right-to-left approach with a stack to track candidates.

2. **Daily Temperatures (LeetCode 739)**: For each day, find how many days you have to wait for a warmer temperature. Again, a right-to-left approach with a stack works efficiently.

3. **Trapping Rain Water (LeetCode 42)**: While more complex, part of the solution involves computing right maximums for each position, which uses a similar right-to-left scanning technique.

The core idea is recognizing when you need information from "the future" (elements to the right) to process "the present" (current element). When this happens, working backwards is often the key to an efficient solution.

## Key Takeaways

1. **When you need information from the right side, work from right to left**: This allows you to carry forward information (like a running maximum) as you process each element.

2. **Store original values before overwriting them**: When modifying arrays in-place, always save the original value if you might need it later in the computation.

3. **Initialize tracking variables carefully**: Think about what value makes sense for the edge case (usually the last element) and initialize your tracking variable accordingly.

This problem teaches a fundamental pattern for array transformations that depend on future elements, a pattern that appears in many interview questions.

Related problems: [Two Furthest Houses With Different Colors](/problem/two-furthest-houses-with-different-colors), [Next Greater Element IV](/problem/next-greater-element-iv)
