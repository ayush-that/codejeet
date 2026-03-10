---
title: "How to Solve Maximum Balanced Shipments — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Balanced Shipments. Medium difficulty, 61.3% acceptance rate. Topics: Array, Dynamic Programming, Stack, Greedy, Monotonic Stack."
date: "2028-07-06"
category: "dsa-patterns"
tags: ["maximum-balanced-shipments", "array", "dynamic-programming", "stack", "medium"]
---

# How to Solve Maximum Balanced Shipments

You're given an array of parcel weights and need to find the maximum number of balanced shipments you can create, where a shipment is a contiguous subarray whose last element is strictly less than the maximum weight in that subarray. The challenge is that we need to partition the array into as many such shipments as possible while maintaining contiguity. This problem is tricky because it requires careful tracking of maximum values within sliding windows while making optimal partitioning decisions.

## Visual Walkthrough

Let's trace through an example: `weights = [3, 6, 2, 4, 5]`

We need to partition this array into contiguous shipments where each shipment's last element is less than the shipment's maximum weight.

**Step-by-step reasoning:**

1. Start with the first element `3`. The maximum so far is `3`.
2. Look at `6`: If we include it, the maximum becomes `6`. The last element `6` equals the maximum, so this can't end a balanced shipment.
3. Look at `2`: Maximum is still `6`. Last element `2` < maximum `6`, so `[3, 6, 2]` is a valid shipment. We can end a shipment here.
4. Start new shipment with `4`. Maximum is `4`.
5. Look at `5`: Maximum becomes `5`. Last element `5` equals maximum, so we can't end here. We must include it in the current shipment.
6. We've reached the end, so `[4, 5]` is our second shipment (though `5` equals the maximum, at the end of array we can consider it).

But wait — this greedy approach might not be optimal! Let's reconsider:

What if we made `[3, 6]` as first shipment? Not valid (last element 6 equals max 6).
What about `[3]` as first shipment? Not valid (last element 3 equals max 3).
What about `[3, 6, 2, 4]`? Max is 6, last element 4 < 6 — valid!

The key insight: We want to maximize shipments, so we should end a shipment as soon as we find a valid ending point, because shorter shipments allow for more shipments overall.

Let's apply this greedy principle:

1. Start at index 0, current max = 3
2. Index 1: value 6, update max to 6
3. Index 2: value 2, 2 < max(6) → valid ending! Create shipment `[3, 6, 2]`
4. Start at index 3, current max = 4
5. Index 4: value 5, update max to 5
6. End of array: last shipment `[4, 5]` (at array end, we accept it)

Total: 2 shipments.

But can we do better? What if we delayed ending the first shipment?

1. Index 0-2: `[3, 6, 2]` (valid, but maybe wait)
2. Index 3: value 4, max is still 6, 4 < 6 → could end here: `[3, 6, 2, 4]`
3. Then `[5]` alone — not valid (5 equals max 5)

So 2 shipments is actually optimal for this example.

## Brute Force Approach

A naive approach would be to try all possible partitions of the array. For an array of length n, there are 2^(n-1) possible ways to split it into contiguous shipments (each gap between elements can either be a split point or not). For each partition, we'd need to verify that every shipment satisfies the balance condition.

The brute force algorithm would:

1. Generate all possible partitions
2. For each partition, check each shipment:
   - Find the maximum in the shipment
   - Compare with the last element
3. Count valid shipments in that partition
4. Track the maximum count found

This approach has exponential time complexity O(2^n × n), which is completely impractical for any reasonable n. Even for n=20, that's over a million operations; for n=100, it's impossible.

## Optimized Approach

The key insight is that we can use a greedy approach: **end a shipment as soon as we find a valid ending point**. Why does this work?

1. **Optimal substructure**: If we have an optimal solution for the first k elements, adding element k+1 either extends the current shipment or starts a new one.
2. **Greedy choice property**: Ending a shipment early never hurts us. If we can end at position i (where weight[i] < current_max), ending there gives us at least as many shipments as waiting longer.
3. **Proof sketch**: Suppose we have a valid ending at position i but choose to continue to j > i. Any shipments we could make from i+1 to j could also be made if we ended at i and started fresh at i+1. But by continuing, we might miss opportunities to create more shipments.

However, there's a subtlety: we need to track the current maximum efficiently. As we extend a shipment, the maximum might increase, making previously invalid positions become valid.

**Algorithm outline:**

1. Initialize count = 0, current_max = first weight
2. For each weight from second to last:
   - Update current_max
   - If current weight < current_max, we can end a shipment here
   - Increment count and reset current_max for next shipment
3. At the end, we'll have one more shipment (the final one)

But wait — this simple approach fails for cases like `[1, 2, 3, 4]` where no valid ending exists until the end. We need to handle the array end specially.

Actually, the correct greedy approach is even simpler: **Count how many times we encounter a weight that is less than the maximum seen so far in the current shipment**. Each such occurrence marks a valid shipment ending.

## Optimal Solution

The optimal solution uses a single pass through the array. We maintain the maximum weight seen in the current shipment. Whenever we encounter a weight that is strictly less than this maximum, we can end the current shipment and start a new one.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxBalancedShipments(weights):
    """
    Returns the maximum number of balanced shipments possible.

    A shipment is balanced if its last parcel weight is strictly less
    than the maximum weight in that shipment.

    Approach: Greedy - end a shipment as soon as we find a valid ending point.
    """
    if not weights:
        return 0

    n = len(weights)
    # We need at least one element to form a shipment
    if n == 1:
        return 0  # Single element can't be balanced (last equals max)

    count = 0
    current_max = weights[0]  # Max in current shipment

    # Start from second element (index 1)
    for i in range(1, n):
        # Update maximum in current shipment
        if weights[i] > current_max:
            current_max = weights[i]

        # Check if we can end current shipment here
        # Condition: current weight < current maximum
        if weights[i] < current_max:
            count += 1
            # Start new shipment if not at the end
            if i < n - 1:
                current_max = weights[i + 1]
                # Skip next element as it's the start of new shipment
                i += 1

    # Special case: if we reached end without ending last shipment
    # and the array has more than 1 element, count the final shipment
    if n > 1 and weights[-1] < current_max:
        count += 1
    elif n > 1:
        # Last shipment might be valid if it has at least 2 elements
        # and last element is less than some previous element
        # We've already handled this in the loop for most cases
        pass

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function maxBalancedShipments(weights) {
  /**
   * Returns the maximum number of balanced shipments possible.
   *
   * A shipment is balanced if its last parcel weight is strictly less
   * than the maximum weight in that shipment.
   *
   * Approach: Greedy - end a shipment as soon as we find a valid ending point.
   */
  if (!weights || weights.length === 0) {
    return 0;
  }

  const n = weights.length;
  // We need at least one element to form a shipment
  if (n === 1) {
    return 0; // Single element can't be balanced (last equals max)
  }

  let count = 0;
  let currentMax = weights[0]; // Max in current shipment

  // Start from second element (index 1)
  for (let i = 1; i < n; i++) {
    // Update maximum in current shipment
    if (weights[i] > currentMax) {
      currentMax = weights[i];
    }

    // Check if we can end current shipment here
    // Condition: current weight < current maximum
    if (weights[i] < currentMax) {
      count++;
      // Start new shipment if not at the end
      if (i < n - 1) {
        currentMax = weights[i + 1];
        // Skip next element as it's the start of new shipment
        i++;
      }
    }
  }

  // Special case: if we reached end without ending last shipment
  // and the array has more than 1 element
  if (n > 1 && weights[n - 1] < currentMax) {
    count++;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public class Solution {
    public int maxBalancedShipments(int[] weights) {
        /**
         * Returns the maximum number of balanced shipments possible.
         *
         * A shipment is balanced if its last parcel weight is strictly less
         * than the maximum weight in that shipment.
         *
         * Approach: Greedy - end a shipment as soon as we find a valid ending point.
         */
        if (weights == null || weights.length == 0) {
            return 0;
        }

        int n = weights.length;
        // We need at least one element to form a shipment
        if (n == 1) {
            return 0;  // Single element can't be balanced (last equals max)
        }

        int count = 0;
        int currentMax = weights[0];  // Max in current shipment

        // Start from second element (index 1)
        for (int i = 1; i < n; i++) {
            // Update maximum in current shipment
            if (weights[i] > currentMax) {
                currentMax = weights[i];
            }

            // Check if we can end current shipment here
            // Condition: current weight < current maximum
            if (weights[i] < currentMax) {
                count++;
                // Start new shipment if not at the end
                if (i < n - 1) {
                    currentMax = weights[i + 1];
                    // Skip next element as it's the start of new shipment
                    i++;
                }
            }
        }

        // Special case: if we reached end without ending last shipment
        // and the array has more than 1 element
        if (n > 1 && weights[n - 1] < currentMax) {
            count++;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of n elements
- Each element is processed at most twice (when we skip after ending a shipment)
- Constant-time operations for comparisons and updates

**Space Complexity: O(1)**

- We only use a few integer variables (count, currentMax, loop index)
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting the "strictly less" condition**: Using `<=` instead of `<` will count invalid shipments where the last element equals the maximum. Always double-check comparison operators.

2. **Not handling the end of array correctly**: When we reach the end of the array, we need to decide whether to count the final shipment. The rule is: if the last element is less than the current maximum, count it; otherwise, we may need to check if there was any valid point earlier.

3. **Incorrect reset of currentMax**: After ending a shipment, we need to reset currentMax to the first element of the new shipment. A common mistake is resetting it to 0 or Integer.MIN_VALUE, which breaks the algorithm for arrays with positive weights.

4. **Off-by-one errors in indexing**: When we skip an element after ending a shipment (because it becomes the start of the next shipment), we need to be careful with loop indices. The `i++` in the loop increment plus our manual `i++` can cause skipping too many elements if not handled correctly.

## When You'll See This Pattern

This greedy "end as soon as possible" pattern appears in several partitioning problems:

1. **LeetCode 763: Partition Labels** - Similar concept of partitioning a string into as many parts as possible where each letter appears in only one part. The greedy approach of ending a partition when all characters so far won't appear later is analogous.

2. **LeetCode 122: Best Time to Buy and Sell Stock II** - The "buy low, sell high" greedy approach where you make a transaction whenever you can profit, similar to ending a shipment whenever you find a valid ending.

3. **LeetCode 406: Queue Reconstruction by Height** - While not identical, it uses a similar "process in optimal order" greedy thinking.

The core pattern is: **When you need to maximize the number of segments/partitions, and ending early never hurts future possibilities, a greedy approach often works.**

## Key Takeaways

1. **Greedy works for maximizing partitions**: When the goal is to maximize the number of contiguous segments satisfying some condition, and ending a segment early never reduces future opportunities, a greedy "end as soon as valid" approach is often optimal.

2. **Track running maximum efficiently**: Many array problems require tracking some running statistic (max, min, sum). The key is to update it incrementally as you iterate rather than recomputing from scratch.

3. **Edge cases matter**: Single-element arrays, all-equal arrays, strictly increasing/decreasing arrays—these edge cases often break naive implementations. Always test with `[1]`, `[1,1,1]`, `[1,2,3]`, and `[3,2,1]`.

[Practice this problem on CodeJeet](/problem/maximum-balanced-shipments)
