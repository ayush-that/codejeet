---
title: "How to Solve Minimum Swaps To Make Sequences Increasing — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Swaps To Make Sequences Increasing. Hard difficulty, 41.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-07-09"
category: "dsa-patterns"
tags: ["minimum-swaps-to-make-sequences-increasing", "array", "dynamic-programming", "hard"]
---

# How to Solve Minimum Swaps To Make Sequences Increasing

You have two integer arrays of the same length, and you can only swap elements at the same index between the two arrays. Your goal is to make both arrays strictly increasing using the minimum number of swaps. What makes this problem tricky is that at each position, you have two choices (swap or don't swap), and your decision affects future possibilities—a classic dynamic programming scenario where you need to track both possibilities simultaneously.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider:

```
nums1 = [1, 3, 5, 4]
nums2 = [1, 2, 3, 7]
```

We need both arrays to be strictly increasing. Let's examine each position:

**Position 0 (i=0):**  
Both arrays have `[1, 1]`. They're already increasing (no previous element to compare with), so we have two valid states:

- Don't swap: cost = 0 swaps
- Swap: cost = 1 swap

**Position 1 (i=1):**  
We have `nums1[1]=3`, `nums2[1]=2`. Compare with position 0:

- If we didn't swap at i=0: `nums1=[1,3]` and `nums2=[1,2]`
  - Check increasing: `1<3` ✓ and `1<2` ✓ → valid with 0 swaps
- If we swapped at i=0: arrays would be `[1,3]` and `[1,2]` (same as above since swapping identical values does nothing)
  - Check increasing: `1<3` ✓ and `1<2` ✓ → valid with 1 swap

**Position 2 (i=2):**  
We have `nums1[2]=5`, `nums2[2]=3`. Now things get interesting:

- Coming from "no swap at i=1": `nums1=[1,3,5]`, `nums2=[1,2,3]`
  - Check: `3<5` ✓ and `2<3` ✓ → valid with 0 swaps
- Coming from "swap at i=1": Arrays would be `[1,2,5]` and `[1,3,3]`
  - Check: `2<5` ✓ but `3<3` ✗ (not strictly increasing) → invalid

But wait! We could swap at position 2 itself. Let's think systematically...

The key insight: At each position, we need to consider both possibilities (swap or don't swap) and track the minimum cost for each state. We'll build this intuition in the optimized approach.

## Brute Force Approach

A naive approach would try all possible combinations of swaps. At each of the n positions, we have 2 choices (swap or don't swap), giving us 2^n possible configurations. We could generate all these configurations, check which ones result in strictly increasing arrays, and count the swaps in each valid configuration to find the minimum.

However, this is extremely inefficient—O(2^n) time complexity, which becomes impossible for n > 30. Even for n=100, 2^100 is an astronomically large number.

What a candidate might initially try is a greedy approach: "Swap whenever the current elements are out of order." But this fails because a swap might fix the current position but break future possibilities, or vice versa. Consider:

```
nums1 = [1, 4, 3]
nums2 = [2, 3, 4]
```

A greedy swap at i=1 would give `[1,3,3]` and `[2,4,4]`, which fails at i=2. The optimal solution is to swap at i=2 instead.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with **two states** at each position:

1. `keep[i]`: Minimum swaps needed to make both arrays increasing up to position i, assuming we **do not swap** at position i
2. `swap[i]`: Minimum swaps needed to make both arrays increasing up to position i, assuming we **do swap** at position i

At each step, we need to check the validity of transitions from the previous state to the current state. There are four possible transitions:

- Previous: kept, Current: keep
- Previous: kept, Current: swap
- Previous: swapped, Current: keep
- Previous: swapped, Current: swap

The validity of each transition depends on whether the arrays remain strictly increasing. We need to check two conditions:

1. If we don't swap at current position i, then `nums1[i] > nums1[i-1]` and `nums2[i] > nums2[i-1]` must hold
2. If we swap at current position i, then `nums1[i] > nums2[i-1]` and `nums2[i] > nums1[i-1]` must hold (since swapping exchanges which array gets which value)

But here's the subtle part: Sometimes **both** transitions are valid, sometimes only one, and sometimes we need to consider cross-conditions. Actually, we need to check:

- Can we go from "previous kept" to "current keep"? Check: `nums1[i] > nums1[i-1] && nums2[i] > nums2[i-1]`
- Can we go from "previous swapped" to "current keep"? Check: `nums1[i] > nums2[i-1] && nums2[i] > nums1[i-1]`
- Can we go from "previous kept" to "current swap"? Check: `nums2[i] > nums1[i-1] && nums1[i] > nums2[i-1]`
- Can we go from "previous swapped" to "current swap"? Check: `nums2[i] > nums2[i-1] && nums1[i] > nums1[i-1]`

Wait, that's getting complex. Let's simplify: At position i, we have two natural conditions:

1. Natural order: `nums1[i] > nums1[i-1] && nums2[i] > nums2[i-1]`
2. Cross order: `nums1[i] > nums2[i-1] && nums2[i] > nums1[i-1]`

If natural order holds, we can continue the same swap pattern (keep→keep or swap→swap).
If cross order holds, we need to change the pattern (keep→swap or swap→keep).

This leads to a clean DP formulation where we only need to track the previous state, not all states, giving us O(1) space complexity.

## Optimal Solution

Here's the complete solution using dynamic programming with constant space:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minSwap(nums1, nums2):
    """
    Returns the minimum number of swaps to make both arrays strictly increasing.

    We maintain two variables:
    - keep: min swaps needed if we DON'T swap at current position
    - swap: min swaps needed if we DO swap at current position

    At each position, we calculate new_keep and new_swap based on whether
    the natural order or cross order conditions are satisfied.
    """
    n = len(nums1)

    # Base case: For the first element (i=0)
    # keep = 0 (no swap needed if we don't swap)
    # swap = 1 (one swap if we do swap)
    keep, swap = 0, 1

    for i in range(1, n):
        # Initialize new values with infinity (invalid state)
        new_keep = float('inf')
        new_swap = float('inf')

        # Condition 1: Natural order is maintained
        # This means nums1[i] > nums1[i-1] and nums2[i] > nums2[i-1]
        # If this holds, we can continue the same pattern:
        # - If we kept at i-1, we can keep at i
        # - If we swapped at i-1, we can swap at i
        if nums1[i] > nums1[i-1] and nums2[i] > nums2[i-1]:
            # Continue keeping: cost same as previous keep
            new_keep = min(new_keep, keep)
            # Continue swapping: cost is previous swap + 1 (swap at current position)
            new_swap = min(new_swap, swap + 1)

        # Condition 2: Cross order is valid
        # This means nums1[i] > nums2[i-1] and nums2[i] > nums1[i-1]
        # If this holds, we need to change the pattern:
        # - If we kept at i-1, we must swap at i
        # - If we swapped at i-1, we must keep at i
        if nums1[i] > nums2[i-1] and nums2[i] > nums1[i-1]:
            # From keep to swap: cost is previous keep + 1
            new_swap = min(new_swap, keep + 1)
            # From swap to keep: cost same as previous swap
            new_keep = min(new_keep, swap)

        # Update for next iteration
        keep, swap = new_keep, new_swap

    # Return the minimum of the two possible final states
    return min(keep, swap)
```

```javascript
// Time: O(n) | Space: O(1)
function minSwap(nums1, nums2) {
  /**
   * Returns the minimum number of swaps to make both arrays strictly increasing.
   *
   * We maintain two variables:
   * - keep: min swaps needed if we DON'T swap at current position
   * - swap: min swaps needed if we DO swap at current position
   *
   * At each position, we calculate newKeep and newSwap based on whether
   * the natural order or cross order conditions are satisfied.
   */
  const n = nums1.length;

  // Base case: For the first element (i=0)
  // keep = 0 (no swap needed if we don't swap)
  // swap = 1 (one swap if we do swap)
  let keep = 0,
    swap = 1;

  for (let i = 1; i < n; i++) {
    // Initialize new values with Infinity (invalid state)
    let newKeep = Infinity;
    let newSwap = Infinity;

    // Condition 1: Natural order is maintained
    // This means nums1[i] > nums1[i-1] and nums2[i] > nums2[i-1]
    // If this holds, we can continue the same pattern:
    // - If we kept at i-1, we can keep at i
    // - If we swapped at i-1, we can swap at i
    if (nums1[i] > nums1[i - 1] && nums2[i] > nums2[i - 1]) {
      // Continue keeping: cost same as previous keep
      newKeep = Math.min(newKeep, keep);
      // Continue swapping: cost is previous swap + 1 (swap at current position)
      newSwap = Math.min(newSwap, swap + 1);
    }

    // Condition 2: Cross order is valid
    // This means nums1[i] > nums2[i-1] and nums2[i] > nums1[i-1]
    // If this holds, we need to change the pattern:
    // - If we kept at i-1, we must swap at i
    // - If we swapped at i-1, we must keep at i
    if (nums1[i] > nums2[i - 1] && nums2[i] > nums1[i - 1]) {
      // From keep to swap: cost is previous keep + 1
      newSwap = Math.min(newSwap, keep + 1);
      // From swap to keep: cost same as previous swap
      newKeep = Math.min(newKeep, swap);
    }

    // Update for next iteration
    keep = newKeep;
    swap = newSwap;
  }

  // Return the minimum of the two possible final states
  return Math.min(keep, swap);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minSwap(int[] nums1, int[] nums2) {
        /**
         * Returns the minimum number of swaps to make both arrays strictly increasing.
         *
         * We maintain two variables:
         * - keep: min swaps needed if we DON'T swap at current position
         * - swap: min swaps needed if we DO swap at current position
         *
         * At each position, we calculate newKeep and newSwap based on whether
         * the natural order or cross order conditions are satisfied.
         */
        int n = nums1.length;

        // Base case: For the first element (i=0)
        // keep = 0 (no swap needed if we don't swap)
        // swap = 1 (one swap if we do swap)
        int keep = 0, swap = 1;

        for (int i = 1; i < n; i++) {
            // Initialize new values with max value (invalid state)
            int newKeep = Integer.MAX_VALUE;
            int newSwap = Integer.MAX_VALUE;

            // Condition 1: Natural order is maintained
            // This means nums1[i] > nums1[i-1] and nums2[i] > nums2[i-1]
            // If this holds, we can continue the same pattern:
            // - If we kept at i-1, we can keep at i
            // - If we swapped at i-1, we can swap at i
            if (nums1[i] > nums1[i-1] && nums2[i] > nums2[i-1]) {
                // Continue keeping: cost same as previous keep
                newKeep = Math.min(newKeep, keep);
                // Continue swapping: cost is previous swap + 1 (swap at current position)
                newSwap = Math.min(newSwap, swap + 1);
            }

            // Condition 2: Cross order is valid
            // This means nums1[i] > nums2[i-1] and nums2[i] > nums1[i-1]
            // If this holds, we need to change the pattern:
            // - If we kept at i-1, we must swap at i
            // - If we swapped at i-1, we must keep at i
            if (nums1[i] > nums2[i-1] && nums2[i] > nums1[i-1]) {
                // From keep to swap: cost is previous keep + 1
                newSwap = Math.min(newSwap, keep + 1);
                // From swap to keep: cost same as previous swap
                newKeep = Math.min(newKeep, swap);
            }

            // Update for next iteration
            keep = newKeep;
            swap = newSwap;
        }

        // Return the minimum of the two possible final states
        return Math.min(keep, swap);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We iterate through the array once, performing constant-time operations at each position. The two condition checks and updates are all O(1) operations.

**Space Complexity:** O(1)  
We only use a fixed number of variables (`keep`, `swap`, `newKeep`, `newSwap`, loop counter), regardless of the input size. This is an optimized version of what would normally be an O(n) DP solution if we stored the entire DP array.

## Common Mistakes

1. **Trying greedy approach:** Candidates often try to swap whenever `nums1[i] <= nums1[i-1]` or `nums2[i] <= nums2[i-1]`. This fails because a swap might fix the current issue but create a bigger problem later. Always verify with counterexamples.

2. **Incorrect condition checking:** The most subtle part is understanding when both conditions can be true simultaneously. For example, if both natural and cross orders are valid, we need to consider ALL possible transitions and take the minimum cost for each state. Missing this leads to incorrect results.

3. **Forgetting to initialize with large values:** When calculating `newKeep` and `newSwap`, we must initialize them to infinity (or a very large number) because we're taking the minimum. If we initialize to 0, we might incorrectly think a state is valid when it's not.

4. **Off-by-one in swap counting:** When continuing a swap pattern (swap→swap), remember to add 1 to the cost because we're swapping at the current position too. The `swap` variable represents "minimum swaps if we swap at current position," so going from `swap` to `newSwap` means we swap at position i as well.

## When You'll See This Pattern

This "two-state DP" pattern appears in problems where you have binary choices at each step, and the validity of your current choice depends on previous choices. Other problems using similar patterns:

1. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309):** You have states like "hold stock," "sold stock," and "cooldown" that transition based on your actions.

2. **House Robber (LeetCode 198):** At each house, you choose to rob or not rob, and your decision affects adjacent houses. This is simpler (no cross-conditions) but uses the same DP-with-states thinking.

3. **Paint House (LeetCode 256):** At each house, you choose one of three colors, and your cost depends on the previous house's color. This extends the pattern to multiple states.

The key recognition signal: When you have a sequence of decisions where each decision has a small number of options (usually 2-3), and the validity or cost of option X at step i depends on what you chose at step i-1.

## Key Takeaways

1. **Two-state DP is powerful for binary decision sequences:** When you have "do it" vs "don't do it" at each step with dependencies between steps, maintain two DP values representing the minimum cost for each state.

2. **Check both "continue" and "change" conditions:** In sequence problems, often you can either continue the same pattern or switch patterns. Check both possibilities and take the minimum valid transition.

3. **Space optimization is often possible:** If you only need the previous state to compute the current state, you can reduce O(n) space to O(1) by only keeping the last computed values.

Related problems: [Minimum Operations to Make the Array K-Increasing](/problem/minimum-operations-to-make-the-array-k-increasing), [Minimum Operations to Maximize Last Elements in Arrays](/problem/minimum-operations-to-maximize-last-elements-in-arrays)
