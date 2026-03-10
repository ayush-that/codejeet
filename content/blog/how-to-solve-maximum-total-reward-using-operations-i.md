---
title: "How to Solve Maximum Total Reward Using Operations I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Total Reward Using Operations I. Medium difficulty, 30.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-04-20"
category: "dsa-patterns"
tags: ["maximum-total-reward-using-operations-i", "array", "dynamic-programming", "medium"]
---

# How to Solve Maximum Total Reward Using Operations I

This problem asks us to maximize our total reward by strategically selecting rewards from an array, with a key constraint: we can only choose a reward if it's strictly greater than our current total. This creates an interesting dynamic where the order of selection matters significantly, and we need to find the optimal sequence to maximize the final total.

What makes this problem tricky is that it's not simply about picking the largest rewards first. Since we can only pick rewards larger than our current total, picking a very large reward early might block us from picking many smaller rewards later. This creates a trade-off that requires careful optimization.

## Visual Walkthrough

Let's trace through a concrete example: `rewardValues = [1, 6, 4, 3, 2]`

**Step 1:** Start with total reward `x = 0`. All rewards are available.

**Step 2:** We can pick any reward > 0. The smallest available is 1. If we pick 1:

- `x` becomes 1
- Available rewards: [6, 4, 3, 2]

**Step 3:** Now we need reward > 1. The smallest available > 1 is 2. If we pick 2:

- `x` becomes 3
- Available rewards: [6, 4, 3]

**Step 4:** Need reward > 3. The smallest available > 3 is 4. If we pick 4:

- `x` becomes 7
- Available rewards: [6, 3]

**Step 5:** Need reward > 7. Only 6 is available, but 6 ≤ 7, so we can't pick anything.

- Final total: 7

But is this optimal? Let's try a different order:

**Alternative path:**

1. Start with 2 (x = 2)
2. Pick 3 (x = 5)
3. Pick 4 (x = 9)
4. Pick 6 (x = 15)
5. Pick 1 (can't, since 1 ≤ 15)

Final total: 15! Much better.

This shows that picking rewards in ascending order (after sorting) often yields better results, but we need to verify this pattern holds generally.

## Brute Force Approach

The brute force approach would try all possible sequences of picking rewards. For each sequence, we would:

1. Start with x = 0
2. For each reward in the sequence, check if it's > current x
3. If yes, add it to x and continue
4. Track the maximum x achieved across all sequences

The number of possible sequences is n! (n factorial), which grows extremely fast. For n = 20, that's over 2.4 quintillion possibilities! Clearly, we need a smarter approach.

Even a recursive backtracking solution that explores all valid sequences would have exponential time complexity. We need to find structure in the problem to optimize.

## Optimized Approach

The key insight is that we should process rewards in **ascending order**. Here's why:

1. **Greedy intuition**: To maximize our total, we want to pick as many rewards as possible. Smaller rewards are easier to pick early since they require a smaller current total.

2. **Optimal substructure**: Once we sort the rewards, the problem exhibits optimal substructure. If we know the maximum total achievable with the first k rewards, we can compute it for k+1 rewards.

3. **Dynamic programming state**: Let dp[t] represent whether we can achieve total reward t. We initialize dp[0] = true (we can always have 0 reward).

4. **Transition**: For each reward value v in sorted order:
   - For each current total t where dp[t] = true
   - If v > t, then we can transition to t + v (set dp[t + v] = true)

5. **Why process in sorted order?**: This ensures we don't use the same reward multiple times. By processing in sorted order and only allowing transitions where v > t, we guarantee we're always picking rewards in increasing order of value.

The maximum possible total is bounded by 2 _ max(rewardValues), since in the worst case we could pick all rewards, and the sum would be at most n _ max(rewardValues), but actually tighter: if we pick rewards in sorted order a₁ ≤ a₂ ≤ ... ≤ aₖ, then aᵢ > sum of previous rewards, so the sum grows quickly.

## Optimal Solution

We'll use a bitset DP approach for efficiency. A bitset allows us to perform bulk operations on sets of totals efficiently.

<div class="code-group">

```python
# Time: O(n * max_sum / 64) where max_sum is the maximum possible total
# Space: O(max_sum / 64) for the bitset
def maxTotalReward(rewardValues):
    """
    Calculate the maximum total reward achievable by picking rewards
    in increasing order of value.

    Args:
        rewardValues: List of integers representing reward values

    Returns:
        Maximum achievable total reward
    """
    # Remove duplicates and sort the rewards
    # Sorting is crucial for the DP approach to work correctly
    rewards = sorted(set(rewardValues))

    # Initialize a bitset to track achievable totals
    # We use a bitset for efficiency since we need to track many possible totals
    # dp[bit] = 1 means we can achieve total 'bit'
    dp = 1  # Start with only total 0 achievable (bit 0 set to 1)

    # Process each reward in sorted order
    for v in rewards:
        # Create a mask for totals that are less than v
        # We can only use reward v if current total < v
        mask = (1 << v) - 1

        # Get all achievable totals that are less than v
        valid_totals = dp & mask

        # Shift valid totals by v to represent adding reward v
        # This gives us new achievable totals: old_total + v
        new_totals = valid_totals << v

        # Combine with existing achievable totals
        dp |= new_totals

    # Find the highest set bit in dp - this represents the maximum achievable total
    # We start from a high bit and work downwards
    max_bit = 0
    temp = dp
    while temp:
        max_bit += 1
        temp >>= 1

    # The maximum total is (max_bit - 1) since bits are 0-indexed
    return max_bit - 1
```

```javascript
// Time: O(n * max_sum / 32) where max_sum is the maximum possible total
// Space: O(max_sum / 32) for the bitset
function maxTotalReward(rewardValues) {
  /**
   * Calculate the maximum total reward achievable by picking rewards
   * in increasing order of value.
   *
   * @param {number[]} rewardValues - Array of integers representing reward values
   * @return {number} Maximum achievable total reward
   */

  // Remove duplicates and sort the rewards
  // Sorting is crucial for the DP approach to work correctly
  const rewards = [...new Set(rewardValues)].sort((a, b) => a - b);

  // Initialize a bitset to track achievable totals
  // We use a BigInt for the bitset to handle large numbers
  // dp bit i = 1 means we can achieve total i
  let dp = 1n; // Start with only total 0 achievable (bit 0 set to 1)

  // Process each reward in sorted order
  for (const v of rewards) {
    // Create a mask for totals that are less than v
    // We can only use reward v if current total < v
    const mask = (1n << BigInt(v)) - 1n;

    // Get all achievable totals that are less than v
    const validTotals = dp & mask;

    // Shift valid totals by v to represent adding reward v
    // This gives us new achievable totals: old_total + v
    const newTotals = validTotals << BigInt(v);

    // Combine with existing achievable totals
    dp |= newTotals;
  }

  // Find the highest set bit in dp - this represents the maximum achievable total
  // Convert to string in binary representation and find the highest '1'
  const binaryStr = dp.toString(2);
  return binaryStr.length - 1; // Length - 1 gives the highest bit position
}
```

```java
// Time: O(n * max_sum / 64) where max_sum is the maximum possible total
// Space: O(max_sum / 64) for the bitset
import java.util.*;

class Solution {
    public int maxTotalReward(int[] rewardValues) {
        /**
         * Calculate the maximum total reward achievable by picking rewards
         * in increasing order of value.
         *
         * @param rewardValues Array of integers representing reward values
         * @return Maximum achievable total reward
         */

        // Remove duplicates and sort the rewards
        // Sorting is crucial for the DP approach to work correctly
        Set<Integer> uniqueRewards = new HashSet<>();
        for (int val : rewardValues) {
            uniqueRewards.add(val);
        }
        List<Integer> rewards = new ArrayList<>(uniqueRewards);
        Collections.sort(rewards);

        // The maximum possible total is 2 * max(reward) - 1
        // This is because if we pick rewards in sorted order a1 < a2 < ... < ak,
        // then ai > sum of previous rewards, so the sum grows quickly
        int maxReward = rewards.get(rewards.size() - 1);
        int maxPossibleTotal = 2 * maxReward;

        // Initialize a bitset to track achievable totals
        // bitset[i] = true means we can achieve total i
        BitSet dp = new BitSet(maxPossibleTotal);
        dp.set(0); // Start with only total 0 achievable

        // Process each reward in sorted order
        for (int v : rewards) {
            // Get all achievable totals that are less than v
            // We can only use reward v if current total < v
            BitSet validTotals = dp.get(0, v);

            // Shift valid totals by v to represent adding reward v
            // This gives us new achievable totals: old_total + v
            for (int total = validTotals.nextSetBit(0); total >= 0;
                 total = validTotals.nextSetBit(total + 1)) {
                dp.set(total + v);
            }
        }

        // Find the highest set bit in dp - this represents the maximum achievable total
        return dp.previousSetBit(maxPossibleTotal - 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting: O(n log n) to sort the unique rewards
- DP processing: O(n \* S / w) where S is the maximum possible total and w is the word size (64 for Python/Java, 32 for JavaScript BigInt)
- In practice, S is bounded by 2 \* max(rewardValues), which is at most 4000 (since rewardValues[i] ≤ 2000)
- Overall: O(n log n + n \* max_reward / w)

**Space Complexity:**

- O(S / w) for the bitset, where S is the maximum possible total
- This is much more efficient than a boolean array of size S

The bitset approach is crucial for efficiency. A naive boolean array would require O(S) space and O(n _ S) time, which could be up to 4000 _ 2000 = 8 million operations. The bitset reduces this significantly through bitwise operations.

## Common Mistakes

1. **Not sorting the rewards**: This is the most common mistake. Without sorting, the DP transition doesn't work correctly because we might use the same reward multiple times or in the wrong order.

2. **Forgetting to remove duplicates**: If there are duplicate reward values, we can only use each once. The set operation ensures we don't accidentally use the same value multiple times.

3. **Incorrect mask calculation**: The mask `(1 << v) - 1` must use bit shifting correctly. Some candidates try to use `2^v - 1` which is mathematically correct but inefficient to compute.

4. **Not understanding the bitset representation**: The bitset represents achievable totals, not the rewards themselves. Bit position i represents total i, not reward i.

5. **Off-by-one errors in maximum total calculation**: When finding the highest set bit, remember that if the highest set bit is at position k, the maximum total is k (not k+1).

## When You'll See This Pattern

This problem uses a **bitset DP** pattern combined with **sorting for optimal ordering**. You'll see similar patterns in:

1. **Partition Equal Subset Sum (LeetCode 416)**: Uses bitset DP to determine if an array can be partitioned into two subsets with equal sum.

2. **Target Sum (LeetCode 494)**: Uses DP to count the number of ways to assign signs to get a target sum, often optimized with bitsets.

3. **Coin Change (LeetCode 322)**: While typically solved with standard DP, bitset optimizations can be applied for certain constraints.

4. **Maximum Earnings From Taxi (LeetCode 2008)**: Uses sorting and DP to maximize earnings, though with different transition rules.

The key insight is recognizing when you have a DP problem where the state can be represented as a set of achievable values, and bitwise operations can accelerate the transitions.

## Key Takeaways

1. **Sorting enables optimal substructure**: Many sequence selection problems become tractable when you process items in sorted order. This creates a natural progression that simplifies state transitions.

2. **Bitsets optimize set operations**: When your DP state is a set of achievable values (like possible sums), bitsets with bitwise operations are dramatically faster than boolean arrays.

3. **Constraint analysis guides implementation**: The constraint rewardValues[i] ≤ 2000 tells us the maximum sum is bounded, making bitset DP feasible. Always check constraints to guide your approach choice.

4. **Greedy ordering intuition**: While not strictly a greedy algorithm (we still need DP), the insight that processing in ascending order is optimal is crucial for both correctness and efficiency.

[Practice this problem on CodeJeet](/problem/maximum-total-reward-using-operations-i)
