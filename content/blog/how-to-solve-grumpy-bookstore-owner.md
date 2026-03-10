---
title: "How to Solve Grumpy Bookstore Owner — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Grumpy Bookstore Owner. Medium difficulty, 64.0% acceptance rate. Topics: Array, Sliding Window."
date: "2028-06-18"
category: "dsa-patterns"
tags: ["grumpy-bookstore-owner", "array", "sliding-window", "medium"]
---

# How to Solve Grumpy Bookstore Owner

The Grumpy Bookstore Owner problem presents an interesting twist on maximizing satisfaction under constraints. You’re given two arrays: `customers` (number entering each minute) and `grumpy` (whether the owner is grumpy that minute, losing those customers). You can use a secret technique to keep the owner not grumpy for `minutes` consecutive minutes, but only once. The goal is to maximize total satisfied customers. What makes this tricky is that you need to find the **best contiguous window** to apply the technique, which directly affects your total satisfaction.

## Visual Walkthrough

Let’s walk through a concrete example to build intuition:

**Input:**

```
customers = [1,0,1,2,1,1,7,5]
grumpy    = [0,1,0,1,0,1,0,1]
minutes = 3
```

**Step 1: Calculate baseline satisfaction**
First, let’s find how many customers we satisfy without using the secret technique. We only satisfy customers when `grumpy[i] == 0`:

- Minute 0: 1 customer, not grumpy → +1
- Minute 1: 0 customers, grumpy → +0
- Minute 2: 1 customer, not grumpy → +1
- Minute 3: 2 customers, grumpy → +0
- Minute 4: 1 customer, not grumpy → +1
- Minute 5: 1 customer, grumpy → +0
- Minute 6: 7 customers, not grumpy → +7
- Minute 7: 5 customers, grumpy → +0

**Baseline total = 1 + 1 + 1 + 7 = 10**

**Step 2: Find best window to apply technique**
We can make the owner not grumpy for any 3 consecutive minutes. During those minutes, we’ll satisfy **all** customers in that window, not just the ones we normally would.

Let’s calculate the **extra** customers we’d gain for each possible window:

**Window [0,2]** (minutes 0-2):

- Normally satisfied in this window: 1 (min 0) + 0 (min 1) + 1 (min 2) = 2
- With technique: 1 + 0 + 1 = 2
- Extra gain = 2 - 2 = 0

**Window [1,3]** (minutes 1-3):

- Normally: 0 + 0 + 0 = 0 (all grumpy minutes)
- With technique: 0 + 1 + 2 = 3
- Extra gain = 3 - 0 = 3

**Window [2,4]** (minutes 2-4):

- Normally: 1 + 0 + 1 = 2
- With technique: 1 + 2 + 1 = 4
- Extra gain = 4 - 2 = 2

**Window [3,5]** (minutes 3-5):

- Normally: 0 + 1 + 0 = 1
- With technique: 2 + 1 + 1 = 4
- Extra gain = 4 - 1 = 3

**Window [4,6]** (minutes 4-6):

- Normally: 1 + 0 + 7 = 8
- With technique: 1 + 1 + 7 = 9
- Extra gain = 9 - 8 = 1

**Window [5,7]** (minutes 5-7):

- Normally: 0 + 7 + 0 = 7
- With technique: 1 + 7 + 5 = 13
- Extra gain = 13 - 7 = 6

**Best extra gain = 6** (from window [5,7])

**Step 3: Calculate final answer**
Total satisfied customers = Baseline (10) + Best extra gain (6) = **16**

This walkthrough shows the core challenge: we need to efficiently find which `minutes`-length window gives us the maximum additional satisfied customers when we apply the technique.

## Brute Force Approach

The most straightforward approach is to try every possible starting point for our `minutes`-length window:

1. Calculate the baseline satisfaction (sum of customers where grumpy[i] == 0)
2. For each starting index `i` from 0 to `n - minutes`:
   - Calculate how many extra customers we'd satisfy if we apply the technique from `i` to `i + minutes - 1`
   - Track the maximum extra customers
3. Return baseline + maximum extra

The problem with this approach is efficiency. For each starting position, we need to sum up to `minutes` elements to calculate the extra satisfaction. This gives us O(n × minutes) time complexity, which becomes O(n²) in the worst case when `minutes ≈ n`. For n up to 20,000 (typical constraint), this is too slow.

## Optimized Approach

The key insight is that we can use a **sliding window** to efficiently calculate the extra satisfaction for each possible window. Instead of recalculating the sum from scratch for each window, we can maintain a running sum:

1. **Calculate baseline satisfaction** - Sum customers where owner is not grumpy
2. **Calculate initial window** - For the first `minutes` minutes, sum customers where owner WOULD be grumpy (since these are the ones we'd gain by applying the technique)
3. **Slide the window** - As we move the window one position to the right:
   - Subtract the contribution from the minute leaving the window (if owner was grumpy there)
   - Add the contribution from the new minute entering the window (if owner is grumpy there)
4. **Track maximum** - Keep track of the maximum "grumpy customers in window" we encounter
5. **Final answer** = baseline + maximum grumpy customers in any window

This works because:

- The "extra" customers we gain in a window are exactly the customers who would have been lost due to grumpiness
- By sliding the window, we avoid redundant calculations
- We only need to consider windows of exactly `minutes` length since making it shorter wouldn't help and longer isn't allowed

## Optimal Solution

Here's the complete solution using the sliding window technique:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxSatisfied(customers, grumpy, minutes):
    """
    Calculate maximum satisfied customers using secret technique once.

    Args:
        customers: List[int] - customers entering each minute
        grumpy: List[int] - 1 if owner grumpy that minute, 0 otherwise
        minutes: int - consecutive minutes we can keep owner not grumpy

    Returns:
        int - maximum satisfied customers
    """
    n = len(customers)
    total_satisfied = 0

    # Step 1: Calculate baseline satisfaction (without using technique)
    # We satisfy customers only when owner is not grumpy
    for i in range(n):
        if grumpy[i] == 0:
            total_satisfied += customers[i]

    # Step 2: Calculate initial window of 'minutes' length
    # This window represents where we might apply the technique
    # We only care about customers during grumpy minutes in this window
    # because those are the ones we'd gain by using the technique
    window_grumpy_sum = 0
    for i in range(minutes):
        if grumpy[i] == 1:
            window_grumpy_sum += customers[i]

    # Step 3: Initialize max_grumpy_sum with initial window
    max_grumpy_sum = window_grumpy_sum

    # Step 4: Slide the window across the array
    # For each new position, we:
    # 1. Remove the leftmost element if it was grumpy
    # 2. Add the new rightmost element if it's grumpy
    for i in range(minutes, n):
        # Remove the element leaving the window (left side)
        if grumpy[i - minutes] == 1:
            window_grumpy_sum -= customers[i - minutes]

        # Add the new element entering the window (right side)
        if grumpy[i] == 1:
            window_grumpy_sum += customers[i]

        # Update maximum if current window is better
        max_grumpy_sum = max(max_grumpy_sum, window_grumpy_sum)

    # Step 5: Total = baseline + best extra from using technique
    return total_satisfied + max_grumpy_sum
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate maximum satisfied customers using secret technique once.
 *
 * @param {number[]} customers - customers entering each minute
 * @param {number[]} grumpy - 1 if owner grumpy that minute, 0 otherwise
 * @param {number} minutes - consecutive minutes we can keep owner not grumpy
 * @return {number} - maximum satisfied customers
 */
function maxSatisfied(customers, grumpy, minutes) {
  const n = customers.length;
  let totalSatisfied = 0;

  // Step 1: Calculate baseline satisfaction (without using technique)
  // We satisfy customers only when owner is not grumpy
  for (let i = 0; i < n; i++) {
    if (grumpy[i] === 0) {
      totalSatisfied += customers[i];
    }
  }

  // Step 2: Calculate initial window of 'minutes' length
  // This window represents where we might apply the technique
  // We only care about customers during grumpy minutes in this window
  let windowGrumpySum = 0;
  for (let i = 0; i < minutes; i++) {
    if (grumpy[i] === 1) {
      windowGrumpySum += customers[i];
    }
  }

  // Step 3: Initialize maxGrumpySum with initial window
  let maxGrumpySum = windowGrumpySum;

  // Step 4: Slide the window across the array
  // For each new position, we:
  // 1. Remove the leftmost element if it was grumpy
  // 2. Add the new rightmost element if it's grumpy
  for (let i = minutes; i < n; i++) {
    // Remove the element leaving the window (left side)
    if (grumpy[i - minutes] === 1) {
      windowGrumpySum -= customers[i - minutes];
    }

    // Add the new element entering the window (right side)
    if (grumpy[i] === 1) {
      windowGrumpySum += customers[i];
    }

    // Update maximum if current window is better
    maxGrumpySum = Math.max(maxGrumpySum, windowGrumpySum);
  }

  // Step 5: Total = baseline + best extra from using technique
  return totalSatisfied + maxGrumpySum;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate maximum satisfied customers using secret technique once.
     *
     * @param customers - customers entering each minute
     * @param grumpy - 1 if owner grumpy that minute, 0 otherwise
     * @param minutes - consecutive minutes we can keep owner not grumpy
     * @return maximum satisfied customers
     */
    public int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
        int n = customers.length;
        int totalSatisfied = 0;

        // Step 1: Calculate baseline satisfaction (without using technique)
        // We satisfy customers only when owner is not grumpy
        for (int i = 0; i < n; i++) {
            if (grumpy[i] == 0) {
                totalSatisfied += customers[i];
            }
        }

        // Step 2: Calculate initial window of 'minutes' length
        // This window represents where we might apply the technique
        // We only care about customers during grumpy minutes in this window
        int windowGrumpySum = 0;
        for (int i = 0; i < minutes; i++) {
            if (grumpy[i] == 1) {
                windowGrumpySum += customers[i];
            }
        }

        // Step 3: Initialize maxGrumpySum with initial window
        int maxGrumpySum = windowGrumpySum;

        // Step 4: Slide the window across the array
        // For each new position, we:
        // 1. Remove the leftmost element if it was grumpy
        // 2. Add the new rightmost element if it's grumpy
        for (int i = minutes; i < n; i++) {
            // Remove the element leaving the window (left side)
            if (grumpy[i - minutes] == 1) {
                windowGrumpySum -= customers[i - minutes];
            }

            // Add the new element entering the window (right side)
            if (grumpy[i] == 1) {
                windowGrumpySum += customers[i];
            }

            // Update maximum if current window is better
            maxGrumpySum = Math.max(maxGrumpySum, windowGrumpySum);
        }

        // Step 5: Total = baseline + best extra from using technique
        return totalSatisfied + maxGrumpySum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one to calculate baseline satisfaction (O(n)), and one to slide the window (O(n))
- The sliding window part only does constant work per element (adding/subtracting one value and comparing)
- Even though we have nested loops in the code structure, each element is processed at most twice

**Space Complexity: O(1)**

- We only use a few integer variables regardless of input size
- No additional data structures that grow with input size

## Common Mistakes

1. **Incorrect window initialization**: Forgetting to calculate the initial window separately before starting the slide. This leads to missing the first possible window position.

2. **Wrong index calculations in sliding**: Using `i - minutes + 1` instead of `i - minutes` when removing the left element. Remember: if current window ends at index `i`, it starts at `i - minutes + 1`, so the element leaving is at `i - minutes`.

3. **Adding all customers in window instead of just grumpy ones**: When calculating what we gain from using the technique, we should only count customers who would have been lost (grumpy minutes). Some candidates mistakenly add all customers in the window, including those already satisfied.

4. **Not handling edge cases**:
   - When `minutes >= n`: We can make the owner not grumpy for the entire day. The answer is simply the sum of all customers.
   - When `minutes = 0`: We can't use the technique at all, so answer is just baseline satisfaction.
   - When all grumpy values are 0: Technique doesn't help, answer is sum of all customers.

## When You'll See This Pattern

The sliding window pattern used here appears in many problems where you need to find an optimal contiguous subarray/substring:

1. **Maximum Sum Subarray of Size K** (LeetCode 643) - Almost identical pattern: find maximum sum of any contiguous subarray of fixed length K.

2. **Fruit Into Baskets** (LeetCode 904) - Find longest contiguous subarray with at most 2 distinct values. Uses a variable-size sliding window.

3. **Longest Substring Without Repeating Characters** (LeetCode 3) - Find longest substring with all unique characters. Another variable-size sliding window problem.

4. **Minimum Size Subarray Sum** (LeetCode 209) - Find minimal length contiguous subarray whose sum ≥ target. Uses sliding window to efficiently find the minimum window.

The key recognition signal: when you need to find an optimal **contiguous** segment of an array/string, especially with a fixed or bounded length constraint.

## Key Takeaways

1. **Sliding window optimization**: When you need to examine all contiguous subarrays of a fixed length, sliding window reduces time from O(n×k) to O(n) by avoiding redundant calculations.

2. **Decompose the problem**: Break into (baseline) + (maximum gain from intervention). This separation simplifies thinking about what the technique actually accomplishes.

3. **Window maintenance pattern**:
   - Initialize with first window
   - Slide: remove left, add right, update best
   - Handle edge cases (window size ≥ array length)

Remember: the sliding window technique is your go-to when you see "contiguous subarray" and "fixed length" or "bounded constraint" in the problem description.

[Practice this problem on CodeJeet](/problem/grumpy-bookstore-owner)
