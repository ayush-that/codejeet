---
title: "How to Solve Maximize Total Cost of Alternating Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Total Cost of Alternating Subarrays. Medium difficulty, 29.5% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-08-01"
category: "dsa-patterns"
tags: ["maximize-total-cost-of-alternating-subarrays", "array", "dynamic-programming", "medium"]
---

# How to Solve Maximize Total Cost of Alternating Subarrays

This problem asks us to split an array into subarrays to maximize the sum of each subarray's "alternating sum" (where signs alternate starting with positive). The tricky part is that we can choose where to split the array, and each split creates a new subarray that starts with a positive sign again. This creates an interesting trade-off: sometimes it's better to keep elements together in one subarray, and sometimes it's better to split them into separate subarrays.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [3, -2, 4, 1]`

**Understanding the cost formula:**

- For subarray `[3, -2, 4]`: cost = `3 - (-2) + 4 = 3 + 2 + 4 = 9`
- For subarray `[1]`: cost = `1` (single element always positive)

**Possible splits and their total costs:**

1. **No splits** (one subarray: `[3, -2, 4, 1]`):
   - Cost = `3 - (-2) + 4 - 1 = 3 + 2 + 4 - 1 = 8`

2. **Split after first element**: `[3]` + `[-2, 4, 1]`
   - `[3]` cost = `3`
   - `[-2, 4, 1]` cost = `-2 - 4 + 1 = -2 - 4 + 1 = -5`
   - Total = `3 + (-5) = -2`

3. **Split after second element**: `[3, -2]` + `[4, 1]`
   - `[3, -2]` cost = `3 - (-2) = 5`
   - `[4, 1]` cost = `4 - 1 = 3`
   - Total = `5 + 3 = 8`

4. **Split after third element**: `[3, -2, 4]` + `[1]`
   - `[3, -2, 4]` cost = `3 - (-2) + 4 = 9`
   - `[1]` cost = `1`
   - Total = `9 + 1 = 10` ← **Maximum!**

5. **All single elements**: `[3]` + `[-2]` + `[4]` + `[1]`
   - Total = `3 + (-2) + 4 + 1 = 6`

The maximum total cost is 10, achieved by splitting after the third element. Notice that splitting can be beneficial when it allows negative elements to be in positions where they get subtracted (which is actually addition since subtracting a negative = addition).

## Brute Force Approach

A brute force approach would try every possible way to split the array. For an array of length `n`, there are `2^(n-1)` possible split points (between each pair of elements, we can either split or not split). We could:

1. Generate all possible split combinations
2. For each combination, calculate the total cost by summing alternating sums of each subarray
3. Track the maximum total cost

The time complexity would be O(n × 2^n) - exponential time! For n=20, that's over 20 million operations; for n=30, it's over 30 billion. Clearly not feasible.

Even a naive dynamic programming approach that doesn't account for the alternating sign pattern would fail. For example, you might think to use standard "maximum subarray sum" DP, but the alternating signs within each subarray make this different.

## Optimized Approach

The key insight is that we can use **dynamic programming** with two states at each position:

1. **dp_positive[i]**: Maximum total cost achievable considering elements up to index `i`, where the last subarray ends at `i` and the next element (if we continue this subarray) would have a **negative** sign.
2. **dp_negative[i]**: Maximum total cost achievable considering elements up to index `i`, where the last subarray ends at `i` and the next element (if we continue this subarray) would have a **positive** sign.

**Why two states?** Because when we're at position `i`, we need to know whether adding `nums[i]` to the current subarray means we add it or subtract it, which depends on the position within the current subarray.

**Transition logic:**

- We can either **start a new subarray** at position `i` (so `nums[i]` gets positive sign)
- Or **continue the current subarray** from position `i-1` (sign depends on whether we're at an even or odd position within the subarray)

More formally:

- `dp_positive[i]` = max(`dp_positive[i-1] - nums[i]`, `dp_negative[i-1] + nums[i]`, `nums[i]`)
  - Continue subarray with negative sign for current element, OR
  - Continue subarray with positive sign for current element, OR
  - Start new subarray here (just `nums[i]` with positive sign)
- `dp_negative[i]` = max(`dp_positive[i-1] - nums[i]`, `dp_negative[i-1] + nums[i]`)
  - Continue subarray (can't start new subarray with negative first sign)

The answer is `max(dp_positive[n-1], dp_negative[n-1])`.

Actually, there's an even simpler insight: We can think of this as finding the maximum sum where we can "reset" the alternating pattern at any point by starting a new subarray. This leads to a greedy-like approach where we track the maximum alternating sum ending at each position, with the option to restart.

## Optimal Solution

The cleanest solution uses dynamic programming where at each position, we decide whether to continue the current alternating sequence or start a new one (which resets the sign pattern). We maintain two values:

- `continue_pos`: best total if we continue and current element has positive sign
- `continue_neg`: best total if we continue and current element has negative sign

At each step, we can either:

1. Continue the sequence (flip the sign)
2. Start fresh with current element having positive sign

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumTotalCost(nums):
    """
    Calculate the maximum total cost by splitting nums into subarrays.
    Each subarray's cost is calculated with alternating signs starting positive.
    """
    n = len(nums)

    # Base case: if array is empty, return 0
    if n == 0:
        return 0

    # Initialize DP states
    # continue_pos: max total ending at current position with positive sign for next
    # continue_neg: max total ending at current position with negative sign for next
    continue_pos = nums[0]  # Start first element as positive
    continue_neg = float('-inf')  # Can't start with negative sign

    # Iterate through the array starting from second element
    for i in range(1, n):
        # Calculate new states for current position
        # Option 1: Start new subarray at current position (always positive start)
        new_start = max(continue_pos, continue_neg) + nums[i]

        # Option 2: Continue current alternating sequence
        # If previous had positive sign for next, current gets negative
        # If previous had negative sign for next, current gets positive
        new_continue_pos = continue_neg + nums[i]  # prev negative → current positive
        new_continue_neg = continue_pos - nums[i]  # prev positive → current negative

        # Update states for next iteration
        # For continue_pos: max of starting new or continuing with positive
        # For continue_neg: only continuing with negative (can't start with negative)
        continue_pos = max(new_start, new_continue_pos)
        continue_neg = new_continue_neg

    # Return maximum of both ending states
    return max(continue_pos, continue_neg)
```

```javascript
// Time: O(n) | Space: O(1)
function maximumTotalCost(nums) {
  /**
   * Calculate the maximum total cost by splitting nums into subarrays.
   * Each subarray's cost is calculated with alternating signs starting positive.
   */
  const n = nums.length;

  // Base case: if array is empty, return 0
  if (n === 0) {
    return 0;
  }

  // Initialize DP states
  // continuePos: max total ending at current position with positive sign for next
  // continueNeg: max total ending at current position with negative sign for next
  let continuePos = nums[0]; // Start first element as positive
  let continueNeg = -Infinity; // Can't start with negative sign

  // Iterate through the array starting from second element
  for (let i = 1; i < n; i++) {
    // Calculate new states for current position
    // Option 1: Start new subarray at current position (always positive start)
    const newStart = Math.max(continuePos, continueNeg) + nums[i];

    // Option 2: Continue current alternating sequence
    // If previous had positive sign for next, current gets negative
    // If previous had negative sign for next, current gets positive
    const newContinuePos = continueNeg + nums[i]; // prev negative → current positive
    const newContinueNeg = continuePos - nums[i]; // prev positive → current negative

    // Update states for next iteration
    // For continuePos: max of starting new or continuing with positive
    // For continueNeg: only continuing with negative (can't start with negative)
    continuePos = Math.max(newStart, newContinuePos);
    continueNeg = newContinueNeg;
  }

  // Return maximum of both ending states
  return Math.max(continuePos, continueNeg);
}
```

```java
// Time: O(n) | Space: O(1)
public class Solution {
    public long maximumTotalCost(int[] nums) {
        /**
         * Calculate the maximum total cost by splitting nums into subarrays.
         * Each subarray's cost is calculated with alternating signs starting positive.
         */
        int n = nums.length;

        // Base case: if array is empty, return 0
        if (n == 0) {
            return 0;
        }

        // Initialize DP states using long to prevent overflow
        // continuePos: max total ending at current position with positive sign for next
        // continueNeg: max total ending at current position with negative sign for next
        long continuePos = nums[0];  // Start first element as positive
        long continueNeg = Long.MIN_VALUE;  // Can't start with negative sign

        // Iterate through the array starting from second element
        for (int i = 1; i < n; i++) {
            // Calculate new states for current position
            // Option 1: Start new subarray at current position (always positive start)
            long newStart = Math.max(continuePos, continueNeg) + nums[i];

            // Option 2: Continue current alternating sequence
            // If previous had positive sign for next, current gets negative
            // If previous had negative sign for next, current gets positive
            long newContinuePos = continueNeg + nums[i];  // prev negative → current positive
            long newContinueNeg = continuePos - nums[i];  // prev positive → current negative

            // Update states for next iteration
            // For continuePos: max of starting new or continuing with positive
            // For continueNeg: only continuing with negative (can't start with negative)
            continuePos = Math.max(newStart, newContinuePos);
            continueNeg = newContinueNeg;
        }

        // Return maximum of both ending states
        return Math.max(continuePos, continueNeg);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations at each step.
- Each iteration involves a few comparisons and arithmetic operations.

**Space Complexity: O(1)**

- We only use a constant amount of extra space (two variables to track states).
- No additional arrays or data structures that grow with input size.

## Common Mistakes

1. **Forgetting to handle the empty array case**: Always check if `nums` is empty and return 0 immediately.

2. **Incorrect sign alternation within continued subarrays**: When continuing a subarray, the sign flips from the previous state. A common mistake is to always use the same sign pattern regardless of whether we're starting new or continuing.

3. **Not considering that starting a new subarray always begins with positive sign**: Some solutions incorrectly allow starting with negative sign, which violates the problem definition.

4. **Integer overflow with large numbers**: Use `long` in Java to handle potentially large sums, especially with the alternating additions and subtractions.

5. **Initializing `continueNeg` incorrectly**: At the first element, we can't have a negative sign (since each subarray starts with positive), so `continueNeg` should be initialized to negative infinity (or a very small number) to ensure it's not chosen.

## When You'll See This Pattern

This problem combines elements from several classic DP patterns:

1. **Maximum Subarray Sum (Kadane's Algorithm)** - Like Kadane's, we track the best sum ending at each position, but with the twist of alternating signs and the ability to "reset" the sign pattern.

2. **Best Time to Buy and Sell Stock with Cooldown** - Similar state machine DP where you have different states (hold, sold, cooldown) and transitions between them.

3. **House Robber** - The decision to "take or skip" current element is similar to deciding whether to start a new subarray or continue the current one.

Specifically, you'll see this "state machine DP" pattern in problems where:

- You need to make a sequence of decisions
- The optimal decision at each step depends not just on the current value, but on some "state" you're in
- You can transition between states according to specific rules

## Key Takeaways

1. **State machine DP is powerful for sequence problems with modes**: When your decision depends on what "mode" or "state" you're in (like "next sign should be positive" vs "next sign should be negative"), maintain separate DP values for each state.

2. **The "start fresh" option is often a key transition**: In many sequence optimization problems, you have the option to "reset" or start a new sequence at any point. This is represented by comparing continuation vs fresh start at each step.

3. **Initialize impossible states to "negative infinity"**: When a state is impossible at the beginning (like having negative first sign), initialize it to a value that will never be chosen in max comparisons.

[Practice this problem on CodeJeet](/problem/maximize-total-cost-of-alternating-subarrays)
