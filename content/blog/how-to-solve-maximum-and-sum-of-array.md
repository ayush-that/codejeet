---
title: "How to Solve Maximum AND Sum of Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum AND Sum of Array. Hard difficulty, 50.7% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2030-01-07"
category: "dsa-patterns"
tags: ["maximum-and-sum-of-array", "array", "dynamic-programming", "bit-manipulation", "hard"]
---

# How to Solve Maximum AND Sum of Array

You need to place numbers from an array into slots (each holding at most two numbers) to maximize the sum of each number ANDed with its slot index. The challenge is that each slot can hold 0, 1, or 2 numbers, and you need to find the optimal assignment among all possible placements—a combinatorial optimization problem that grows factorially with input size.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`, `numSlots = 3`. Each slot (1, 2, 3) can hold up to 2 numbers.

We need to assign each number to a slot. Let's explore some assignments:

**Assignment 1**: Put all numbers in slot 1 (capacity 2 exceeded → invalid)

**Assignment 2**: Put 1 in slot 1, 2 in slot 2, 3 in slot 3:

- 1 & 1 = 1
- 2 & 2 = 2
- 3 & 3 = 3
- Total = 1 + 2 + 3 = 6

**Assignment 3**: Put 1 and 2 in slot 1, 3 in slot 2:

- 1 & 1 = 1
- 2 & 1 = 0
- 3 & 2 = 2
- Total = 1 + 0 + 2 = 3

**Assignment 4**: Put 1 in slot 1, 2 and 3 in slot 2:

- 1 & 1 = 1
- 2 & 2 = 2
- 3 & 2 = 2
- Total = 1 + 2 + 2 = 5

The maximum is 6 from Assignment 2. With just 3 numbers, we can brute force check all assignments, but with larger inputs, we need a smarter approach.

The key insight: We can think of each slot's capacity as two "sub-slots"—each number takes one sub-slot. With `numSlots` slots, we have `2 * numSlots` sub-slots total. Since `2 * numSlots >= n`, we have enough capacity.

## Brute Force Approach

A naive solution would generate all possible assignments of `n` numbers to slots with capacity constraints. For each number, we could try placing it in any slot that still has capacity. This leads to exploring all permutations of assignments.

The complexity is roughly O(n! * numSlots) in the worst case because for the first number we have `numSlots` choices, for the second we have up to `numSlots` choices (if slots still have capacity), etc. With n up to 18 and numSlots up to 9 (so 2*9=18 sub-slots maximum), 18! is astronomically large (~6.4×10¹⁵).

Even with pruning, this approach is infeasible. We need to leverage the fact that slots are identical in capacity and differ only in their index value for the AND operation.

## Optimized Approach

The optimal solution uses **bitmask dynamic programming** with state compression. Here's the reasoning:

1. **State Representation**: We can represent which numbers have been placed using a bitmask of length `n` (bits = 1 for placed numbers). But we also need to track slot usage. Since each slot has capacity 2, we can represent slot states with a base-3 number or two separate bitmasks.

2. **Key Insight**: Instead of tracking slots separately, notice that we're placing numbers one by one. When placing the k-th number (where k = popcount(mask)), we need to know which slots still have capacity. We can use a single integer mask where each pair of bits represents a slot's usage:
   - 00: slot empty
   - 01: slot has 1 number
   - 10: slot has 2 numbers
   - 11: invalid (shouldn't occur)

3. **DP State**: Let `dp[mask]` = maximum AND sum achievable when slots are in state represented by `mask`. The mask has `2 * numSlots` bits (2 bits per slot).

4. **Transition**: For current state `mask`, we try placing the next number (index = number of placed numbers so far) into any slot that has capacity. If slot `i` has less than 2 numbers, we can add the number to that slot and get value `nums[count] & (i+1)`.

5. **Optimization**: We iterate over all slot states and try to add to any available slot. The number of states is `3^numSlots` (each slot can be 0, 1, or 2 numbers). With numSlots ≤ 9, `3^9 = 19,683` states is manageable.

## Optimal Solution

We implement DP with memoization. The state is `(mask, index)` where mask is base-3 representation of slot usage and index is how many numbers placed. Alternatively, we can derive index from mask by counting total numbers placed.

<div class="code-group">

```python
# Time: O(numSlots * 3^numSlots) | Space: O(3^numSlots)
class Solution:
    def maximumANDSum(self, nums, numSlots):
        # DP memoization dictionary: mask -> max AND sum
        # mask is base-3 number where each digit represents a slot's count (0,1,2)
        memo = {}

        def dfs(mask, idx):
            # Base case: all numbers placed
            if idx == len(nums):
                return 0

            # Check memo
            if (mask, idx) in memo:
                return memo[(mask, idx)]

            max_sum = 0
            # Try placing current number (nums[idx]) into each slot
            for slot in range(1, numSlots + 1):
                # Get current count of numbers in this slot
                # Extract base-3 digit for this slot
                count = (mask // (3 ** (slot - 1))) % 3

                # Check if slot has capacity (count < 2)
                if count < 2:
                    # Calculate new mask: increment count for this slot
                    new_mask = mask + (3 ** (slot - 1))
                    # Calculate AND value for this placement
                    and_value = nums[idx] & slot
                    # Recursively compute maximum for remaining numbers
                    current_sum = and_value + dfs(new_mask, idx + 1)
                    max_sum = max(max_sum, current_sum)

            memo[(mask, idx)] = max_sum
            return max_sum

        # Start with empty slots (mask = 0) and first number (idx = 0)
        return dfs(0, 0)
```

```javascript
// Time: O(numSlots * 3^numSlots) | Space: O(3^numSlots)
var maximumANDSum = function (nums, numSlots) {
  const memo = new Map();

  const dfs = (mask, idx) => {
    // Base case: all numbers placed
    if (idx === nums.length) return 0;

    // Check memo
    const key = `${mask},${idx}`;
    if (memo.has(key)) return memo.get(key);

    let maxSum = 0;
    // Try placing current number into each slot
    for (let slot = 1; slot <= numSlots; slot++) {
      // Get current count in this slot from base-3 mask
      // (mask / 3^(slot-1)) % 3
      let count = Math.floor(mask / Math.pow(3, slot - 1)) % 3;

      // Check if slot has capacity
      if (count < 2) {
        // New mask with incremented count for this slot
        const newMask = mask + Math.pow(3, slot - 1);
        // AND value for this placement
        const andValue = nums[idx] & slot;
        // Recursive call for remaining numbers
        const currentSum = andValue + dfs(newMask, idx + 1);
        maxSum = Math.max(maxSum, currentSum);
      }
    }

    memo.set(key, maxSum);
    return maxSum;
  };

  return dfs(0, 0);
};
```

```java
// Time: O(numSlots * 3^numSlots) | Space: O(3^numSlots)
class Solution {
    private Map<String, Integer> memo = new HashMap<>();
    private int[] nums;
    private int numSlots;

    public int maximumANDSum(int[] nums, int numSlots) {
        this.nums = nums;
        this.numSlots = numSlots;
        return dfs(0, 0);
    }

    private int dfs(int mask, int idx) {
        // Base case: all numbers placed
        if (idx == nums.length) return 0;

        // Check memo
        String key = mask + "," + idx;
        if (memo.containsKey(key)) return memo.get(key);

        int maxSum = 0;
        // Try placing current number into each slot
        for (int slot = 1; slot <= numSlots; slot++) {
            // Get current count in this slot from base-3 mask
            // (mask / 3^(slot-1)) % 3
            int count = (mask / (int)Math.pow(3, slot - 1)) % 3;

            // Check if slot has capacity
            if (count < 2) {
                // New mask with incremented count for this slot
                int newMask = mask + (int)Math.pow(3, slot - 1);
                // AND value for this placement
                int andValue = nums[idx] & slot;
                // Recursive call for remaining numbers
                int currentSum = andValue + dfs(newMask, idx + 1);
                maxSum = Math.max(maxSum, currentSum);
            }
        }

        memo.put(key, maxSum);
        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(numSlots × 3^numSlots × n) in naive DP implementation, but we can optimize to O(numSlots × 3^numSlots). Here's why:

- We have at most 3^numSlots states (each slot can be 0, 1, or 2)
- For each state, we try placing the next number into each of numSlots slots
- The recursive depth is at most n (number of numbers)
- With memoization, each state is computed once, giving O(numSlots × 3^numSlots)

**Space Complexity**: O(3^numSlots) for the memoization cache plus O(n) for recursion stack. Since numSlots ≤ 9, 3^9 = 19,683 states is manageable.

## Common Mistakes

1. **Forgetting slot capacity constraint**: Each slot can hold at most 2 numbers. Some solutions incorrectly allow unlimited numbers per slot or treat capacity as 1.

2. **Inefficient state representation**: Using a bitmask for numbers only (2^n states) without tracking slot usage leads to incorrect results because different slot assignments with the same set of placed numbers give different AND sums.

3. **Base confusion in mask representation**: When using base-3 representation, remember that digit positions correspond to slots, and digit values (0,1,2) represent counts. Off-by-one errors in extracting digits are common.

4. **Not using memoization**: Trying pure recursion without memoization leads to exponential re-computation of states. With n up to 18, this quickly becomes infeasible.

## When You'll See This Pattern

This **bitmask DP with state compression** pattern appears in assignment problems with constraints:

1. **Minimum XOR Sum of Two Arrays** (LeetCode 1879): Similar state representation for assigning numbers from one array to another.

2. **Campus Bikes II** (LeetCode 1066): Assign bikes to workers with capacity constraints, using bitmask DP.

3. **Maximum Compatibility Score Sum** (LeetCode 1947): Assign students to mentors with compatibility scores.

These problems all involve optimal assignment with constraints where the state space can be encoded compactly.

## Key Takeaways

1. **State compression is powerful**: When dealing with assignment problems, look for ways to represent the assignment state compactly using bitmasks or base-k numbers.

2. **DP over subsets with additional state**: Sometimes tracking just which elements are used isn't enough—you may need additional state (like slot counts here).

3. **Constraint encoding**: Capacity constraints can often be encoded in the state representation itself (base-3 for capacity 2, base-(k+1) for capacity k).

Related problems: [Minimum XOR Sum of Two Arrays](/problem/minimum-xor-sum-of-two-arrays)
