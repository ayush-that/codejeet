---
title: "How to Solve Minimum Array Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Array Sum. Medium difficulty, 31.0% acceptance rate. Topics: Array, Dynamic Programming."
date: "2030-02-01"
category: "dsa-patterns"
tags: ["minimum-array-sum", "array", "dynamic-programming", "medium"]
---

# How to Solve Minimum Array Sum

This problem asks us to minimize the sum of an array by performing two types of operations: dividing elements by 2 (rounding up) and subtracting 1 from elements. We have limited uses of each operation, making this a constrained optimization problem. What makes this tricky is that we need to decide not only which elements to operate on, but also in what order to apply operations, since dividing first affects how much we can subtract later.

## Visual Walkthrough

Let's trace through a small example: `nums = [5, 7, 3]`, `k = 3`, `op1 = 2`, `op2 = 2`

**Step 1: Understanding the operations**

- Operation 1 (divide by 2, round up): `5 → 3`, `7 → 4`, `3 → 2`
- Operation 2 (subtract 1): `5 → 4`, `7 → 6`, `3 → 2`

**Step 2: Initial state**
Initial sum = 5 + 7 + 3 = 15
We need to reduce the sum by at least `k = 3` to reach sum ≤ 15 - 3 = 12

**Step 3: Try greedy approach**
If we apply operation 1 to the largest numbers first:

- Apply op1 to 7: 7 → 4 (cost 1 op1, sum = 5 + 4 + 3 = 12)
  We've already reached sum ≤ 12! But wait, we need to check if we can do better.

**Step 4: Consider operation order**
What if we apply op2 first then op1?

- Apply op2 to 7: 7 → 6 (cost 1 op2, sum = 5 + 6 + 3 = 14)
- Apply op1 to 6: 6 → 3 (cost 1 op1, sum = 5 + 3 + 3 = 11)
  This gives us sum = 11, which is even better!

**Step 5: Key insight**
The order matters because:

1. Applying op2 first makes numbers smaller, which means op1 (divide by 2) becomes more effective
2. But we have limited operations, so we need to choose wisely

This shows why we need a systematic approach rather than just trying operations randomly.

## Brute Force Approach

A naive approach would be to try all possible sequences of operations. For each element, we could:

1. Try 0 to op1 division operations
2. Try 0 to op2 subtraction operations
3. Try all combinations of these

The complexity would be astronomical. For each of `n` elements, if we can apply up to `op1` divisions and `op2` subtractions, the number of possibilities grows combinatorially. Even for small constraints, this approach is infeasible.

What makes this particularly challenging is that operations on different elements interact through the total sum constraint. We can't just optimize each element independently because we have shared operation budgets.

## Optimized Approach

The key insight is that we should think about this as a **dynamic programming** problem where we track:

1. How many division operations we've used so far
2. How many subtraction operations we've used so far
3. The current total reduction achieved

**Why DP works:**

- Each operation reduces a number, and the reduction amount depends on the current value
- The order of operations on the same element matters (subtract then divide is better)
- But we can process elements one by one, deciding how many operations to use on each

**State definition:**
Let `dp[i][d][s]` = maximum total reduction achievable using first `i` elements, `d` division operations, and `s` subtraction operations.

**Transition:**
For element `nums[i]`, we try all possible numbers of division operations `div` (0 to min(d, maxDivisionsForThisElement)) and for each, all possible subtraction operations `sub` (0 to min(s, something)). We calculate the reduction for that combination and update the DP state.

**Optimization:**
We can precompute for each element and each number of divisions, what's the maximum reduction achievable with various numbers of subtractions. This avoids recalculating the same reductions repeatedly.

## Optimal Solution

The solution uses dynamic programming with careful state tracking. We process each element, and for each possible number of division operations used so far, we track the maximum reduction achievable.

<div class="code-group">

```python
# Time: O(n * op1 * op2 * log(max(nums))) | Space: O(n * op1 * op2)
def minArraySum(nums, k, op1, op2):
    """
    Returns the minimum possible sum after applying operations.

    Args:
        nums: List of integers
        k: Target reduction amount
        op1: Maximum division operations
        op2: Maximum subtraction operations

    Returns:
        Minimum possible sum after operations
    """
    n = len(nums)

    # dp[d][s] = maximum reduction using d divisions and s subtractions
    # We only need to track the previous and current element
    dp = [[-1] * (op2 + 1) for _ in range(op1 + 1)]
    dp[0][0] = 0  # Base case: no operations, no reduction

    for num in nums:
        # new_dp will store reductions for current element
        new_dp = [[-1] * (op2 + 1) for _ in range(op1 + 1)]

        # For each possible number of divisions used so far
        for d in range(op1 + 1):
            for s in range(op2 + 1):
                if dp[d][s] == -1:
                    continue  # This state is unreachable

                # Try all possible numbers of divisions on current element
                for div in range(op1 - d + 1):
                    # Start with original number
                    current = num

                    # Apply divisions first (but remember subtract then divide is better)
                    # We'll handle the optimal order in the inner loop
                    for sub in range(op2 - s + 1):
                        # Try applying 'sub' subtractions and 'div' divisions
                        # in optimal order: apply subtractions first, then divisions
                        temp = num

                        # Apply subtractions
                        for _ in range(sub):
                            if temp > 0:
                                temp -= 1

                        # Apply divisions
                        for _ in range(div):
                            temp = (temp + 1) // 2  # Round up division

                        reduction = num - temp

                        # Update new_dp if we found better reduction
                        new_d = d + div
                        new_s = s + sub
                        if new_d <= op1 and new_s <= op2:
                            if new_dp[new_d][new_s] < dp[d][s] + reduction:
                                new_dp[new_d][new_s] = dp[d][s] + reduction

        # Move to next element
        dp = new_dp

    # Find the maximum reduction that's at least k
    total_sum = sum(nums)
    for d in range(op1 + 1):
        for s in range(op2 + 1):
            if dp[d][s] >= k:
                return total_sum - dp[d][s]

    # If we can't achieve reduction of at least k, return minimum possible
    # which is total_sum minus maximum reduction we can achieve
    max_reduction = 0
    for d in range(op1 + 1):
        for s in range(op2 + 1):
            max_reduction = max(max_reduction, dp[d][s])

    return total_sum - max_reduction
```

```javascript
// Time: O(n * op1 * op2 * log(max(nums))) | Space: O(n * op1 * op2)
function minArraySum(nums, k, op1, op2) {
  /**
   * Returns the minimum possible sum after applying operations.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Target reduction amount
   * @param {number} op1 - Maximum division operations
   * @param {number} op2 - Maximum subtraction operations
   * @return {number} Minimum possible sum after operations
   */
  const n = nums.length;

  // dp[d][s] = maximum reduction using d divisions and s subtractions
  // Initialize with -1 to represent unreachable states
  let dp = Array(op1 + 1)
    .fill()
    .map(() => Array(op2 + 1).fill(-1));
  dp[0][0] = 0; // Base case: no operations, no reduction

  // Process each number in the array
  for (const num of nums) {
    // Create new DP table for current element
    const newDp = Array(op1 + 1)
      .fill()
      .map(() => Array(op2 + 1).fill(-1));

    // Iterate through all possible operation counts used so far
    for (let d = 0; d <= op1; d++) {
      for (let s = 0; s <= op2; s++) {
        if (dp[d][s] === -1) continue; // Skip unreachable states

        // Try all possible operations on current element
        for (let div = 0; div <= op1 - d; div++) {
          // For each division count, try all subtraction counts
          for (let sub = 0; sub <= op2 - s; sub++) {
            // Apply operations in optimal order: subtract first, then divide
            let temp = num;

            // Apply subtractions
            for (let i = 0; i < sub; i++) {
              if (temp > 0) temp--;
            }

            // Apply divisions (rounding up)
            for (let i = 0; i < div; i++) {
              temp = Math.floor((temp + 1) / 2);
            }

            const reduction = num - temp;
            const newD = d + div;
            const newS = s + sub;

            // Update DP state if we found better reduction
            if (newD <= op1 && newS <= op2) {
              const newReduction = dp[d][s] + reduction;
              if (newDp[newD][newS] < newReduction) {
                newDp[newD][newS] = newReduction;
              }
            }
          }
        }
      }
    }

    // Move to next element
    dp = newDp;
  }

  // Calculate total sum of original array
  const totalSum = nums.reduce((sum, num) => sum + num, 0);

  // Check if we can achieve at least k reduction
  for (let d = 0; d <= op1; d++) {
    for (let s = 0; s <= op2; s++) {
      if (dp[d][s] >= k) {
        return totalSum - dp[d][s];
      }
    }
  }

  // If we can't achieve k reduction, return best we can do
  let maxReduction = 0;
  for (let d = 0; d <= op1; d++) {
    for (let s = 0; s <= op2; s++) {
      maxReduction = Math.max(maxReduction, dp[d][s]);
    }
  }

  return totalSum - maxReduction;
}
```

```java
// Time: O(n * op1 * op2 * log(max(nums))) | Space: O(n * op1 * op2)
class Solution {
    public int minArraySum(int[] nums, int k, int op1, int op2) {
        /**
         * Returns the minimum possible sum after applying operations.
         *
         * @param nums Array of integers
         * @param k Target reduction amount
         * @param op1 Maximum division operations
         * @param op2 Maximum subtraction operations
         * @return Minimum possible sum after operations
         */
        int n = nums.length;

        // dp[d][s] = maximum reduction using d divisions and s subtractions
        int[][] dp = new int[op1 + 1][op2 + 1];

        // Initialize with -1 to represent unreachable states
        for (int d = 0; d <= op1; d++) {
            Arrays.fill(dp[d], -1);
        }
        dp[0][0] = 0;  // Base case: no operations, no reduction

        // Process each number in the array
        for (int num : nums) {
            // Create new DP table for current element
            int[][] newDp = new int[op1 + 1][op2 + 1];
            for (int d = 0; d <= op1; d++) {
                Arrays.fill(newDp[d], -1);
            }

            // Iterate through all possible operation counts used so far
            for (int d = 0; d <= op1; d++) {
                for (int s = 0; s <= op2; s++) {
                    if (dp[d][s] == -1) continue;  // Skip unreachable states

                    // Try all possible operations on current element
                    for (int div = 0; div <= op1 - d; div++) {
                        // For each division count, try all subtraction counts
                        for (int sub = 0; sub <= op2 - s; sub++) {
                            // Apply operations in optimal order: subtract first, then divide
                            int temp = num;

                            // Apply subtractions
                            for (int i = 0; i < sub; i++) {
                                if (temp > 0) temp--;
                            }

                            // Apply divisions (rounding up)
                            for (int i = 0; i < div; i++) {
                                temp = (temp + 1) / 2;
                            }

                            int reduction = num - temp;
                            int newD = d + div;
                            int newS = s + sub;

                            // Update DP state if we found better reduction
                            if (newD <= op1 && newS <= op2) {
                                int newReduction = dp[d][s] + reduction;
                                if (newDp[newD][newS] < newReduction) {
                                    newDp[newD][newS] = newReduction;
                                }
                            }
                        }
                    }
                }
            }

            // Move to next element
            dp = newDp;
        }

        // Calculate total sum of original array
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        // Check if we can achieve at least k reduction
        for (int d = 0; d <= op1; d++) {
            for (int s = 0; s <= op2; s++) {
                if (dp[d][s] >= k) {
                    return totalSum - dp[d][s];
                }
            }
        }

        // If we can't achieve k reduction, return best we can do
        int maxReduction = 0;
        for (int d = 0; d <= op1; d++) {
            for (int s = 0; s <= op2; s++) {
                maxReduction = Math.max(maxReduction, dp[d][s]);
            }
        }

        return totalSum - maxReduction;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × op1 × op2 × M) where M is the maximum number of operations we try per element. In the worst case, for each element we try all combinations of divisions and subtractions, which gives us O(n × op1 × op2 × (op1 × op2)) = O(n × op1² × op2²). However, with optimizations and constraints, this is often manageable.

**Space Complexity:** O(op1 × op2) for the DP table. We only need to store the current and previous states, not all n elements simultaneously.

The complexity might seem high, but given typical constraints in coding interviews (op1, op2 ≤ 50, n ≤ 100), this solution is practical.

## Common Mistakes

1. **Wrong operation order:** Applying divisions before subtractions. Remember that subtracting first makes divisions more effective because you're dividing a smaller number. Always apply subtractions first, then divisions.

2. **Forgetting about operation limits:** Not checking that we don't exceed op1 and op2 when trying operation combinations. Always validate that `d + div ≤ op1` and `s + sub ≤ op2`.

3. **Integer overflow with large numbers:** When numbers get very small, repeated operations might cause issues. Always check for `num > 0` before subtracting.

4. **Not handling unreachable states:** Initializing DP table with 0 instead of -1 for unreachable states. This can cause incorrect propagation of values. Use -1 or a special value to mark unreachable states.

## When You'll See This Pattern

This type of constrained optimization problem with multiple operation types appears in various forms:

1. **Coin Change (LeetCode 322):** Similar DP structure where you track amount and coin usage, though with simpler operations.

2. **Partition Equal Subset Sum (LeetCode 416):** Uses DP to track achievable sums, similar to how we track achievable reductions here.

3. **Target Sum (LeetCode 494):** Another DP problem where you track different states (sums) achievable with operations (adding or subtracting).

The core pattern is using dynamic programming to track resource usage (operations) and the resulting state (reduction achieved), then finding the optimal combination.

## Key Takeaways

1. **When you have limited operations and need to optimize a global metric** (like total sum), think about DP where states represent resource usage.

2. **Operation order matters** when operations interact non-linearly. Always test different orders to find the optimal sequence.

3. **Precomputation helps** - for each element, you can precompute the result of different operation combinations to avoid repeated calculations.

[Practice this problem on CodeJeet](/problem/minimum-array-sum)
