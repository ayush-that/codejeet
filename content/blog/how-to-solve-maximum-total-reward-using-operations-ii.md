---
title: "How to Solve Maximum Total Reward Using Operations II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Total Reward Using Operations II. Hard difficulty, 21.9% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation."
date: "2026-06-23"
category: "dsa-patterns"
tags:
  [
    "maximum-total-reward-using-operations-ii",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Maximum Total Reward Using Operations II

This problem asks us to maximize our total reward by strategically selecting rewards from an array, but with a crucial constraint: we can only choose a reward if its value is **greater than** our current total reward. This creates an interesting sequencing challenge where the order of selection matters significantly. The problem is tricky because it combines elements of subset selection with a dynamic constraint that changes based on our previous choices.

## Visual Walkthrough

Let's trace through a concrete example: `rewardValues = [1, 6, 4, 3]`

**Step 1:** Sort the array first (this will be important later): `[1, 3, 4, 6]`

**Step 2:** Start with total reward `x = 0`

**Step 3:** We can choose any reward > 0. Let's think through possibilities:

- If we choose 1: `x = 1`
  - Now we can choose rewards > 1: 3, 4, or 6
  - If we choose 3: `x = 4`
    - Now we can choose rewards > 4: only 6
    - Choose 6: `x = 10` (final)
  - If we choose 4: `x = 5`
    - Now we can choose rewards > 5: only 6
    - Choose 6: `x = 11` (final)
  - If we choose 6: `x = 7`
    - Now we can choose rewards > 7: none
    - Final: `x = 7`

- If we choose 3 first: `x = 3`
  - Now we can choose rewards > 3: 4 or 6
  - If we choose 4: `x = 7`
    - Now we can choose rewards > 7: none
    - Final: `x = 7`
  - If we choose 6: `x = 9`
    - Now we can choose rewards > 9: none
    - Final: `x = 9`

- If we choose 4 first: `x = 4`
  - Now we can choose rewards > 4: only 6
  - Choose 6: `x = 10` (final)

- If we choose 6 first: `x = 6`
  - Now we can choose rewards > 6: none
  - Final: `x = 6`

The maximum we found was 11 (path: 1 → 4 → 6). Notice that sorting helped us see the available options at each step more clearly.

## Brute Force Approach

The brute force approach would be to try all possible sequences of selecting rewards that satisfy the constraint. For each reward, we have two choices: either take it (if allowed) or skip it. This leads to a recursive exploration of all valid sequences.

The naive recursive solution would look like this:

1. Start with current total `x = 0` and all indices unmarked
2. For each unmarked index `i`:
   - If `rewardValues[i] > x`, we can choose it
   - Mark index `i`, update `x = x + rewardValues[i]`
   - Recursively explore from this new state
3. Track the maximum `x` reached

The problem with this approach is its exponential time complexity. With `n` rewards, there are `2^n` possible subsets to consider, and for each subset, multiple valid orderings. Even with pruning (only considering rewards > current total), the worst-case complexity is still factorial in nature when all rewards can be taken in different orders.

## Optimized Approach

The key insight is that this problem is essentially about finding the maximum sum we can achieve where each element we add must be **greater than the current sum**. This is reminiscent of the classic "maximum subset sum with constraints" problem.

**Critical observations:**

1. We should process rewards in **ascending order**. Why? Because if we have a smaller reward available, we should consider taking it early to increase our total, which then allows us to take larger rewards later.
2. The constraint `reward > current_total` means that once our total reaches a certain value, only rewards larger than that value are available.
3. This is a **dynamic programming** problem where our state is the current total reward.

**DP State Definition:**
Let `dp[s]` represent whether we can achieve a total reward of exactly `s`. Since rewards can be up to 5×10⁵ and we can take at most all rewards, the maximum possible sum is bounded.

**Transition:**
For each reward `r` in sorted order:

- For each current sum `s` where `dp[s]` is true:
  - If `r > s`, we can add this reward to get new sum `s + r`
  - Set `dp[s + r] = true`

However, we need to be careful about the order of iteration. If we iterate `s` from low to high and update `dp[s + r]`, we might incorrectly use the same reward multiple times. We need to process rewards one by one and iterate `s` from high to low to avoid reusing the same reward.

**Optimization with Bitset:**
Since we're dealing with boolean states (can we achieve sum `s` or not), we can use a **bitset** for efficient operations. A bitset allows us to perform shift operations that represent adding the same reward to all achievable sums simultaneously.

The final approach:

1. Sort the rewards in ascending order
2. Initialize a bitset with bit 0 set to 1 (we can achieve sum 0)
3. For each reward `r`:
   - Create a mask of bits that are set and where `r > current_sum`
   - Shift this mask left by `r` positions (representing adding `r` to all those sums)
   - OR this with our current bitset
4. The maximum achievable sum is the highest set bit in the final bitset

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * max_sum / word_size) ≈ O(n * MAX/64) with bitset optimization
# Space: O(max_sum / word_size) for the bitset
def maxTotalReward(rewardValues):
    """
    Calculate the maximum total reward achievable by selecting rewards
    in any order, where each selected reward must be greater than the
    current total reward before selection.
    """
    # Sort rewards to process smaller ones first
    rewardValues.sort()

    # Initialize bitset: bit i represents whether sum i is achievable
    # Start with sum 0 achievable
    max_possible = 2 * max(rewardValues)  # Upper bound on achievable sum
    dp = 1  # Binary representation: only bit 0 is set initially

    # Process each reward
    for r in rewardValues:
        # Create mask of achievable sums where r > sum
        # We need sums where sum < r, so we take bits 0 to r-1
        mask = (1 << r) - 1  # This creates r bits set from 0 to r-1

        # Extract only the bits that are currently set AND < r
        valid_sums = dp & mask

        # Shift these valid sums by r (adding r to each)
        new_sums = valid_sums << r

        # Combine with existing achievable sums
        dp |= new_sums

    # Find the highest set bit (maximum achievable sum)
    # We start from the maximum possible sum and go downwards
    for i in range(max_possible, -1, -1):
        if dp & (1 << i):
            return i

    return 0  # Should never reach here since sum 0 is always achievable
```

```javascript
// Time: O(n * max_sum / 32) with bitset optimization
// Space: O(max_sum / 32) for the bitset
function maxTotalReward(rewardValues) {
  // Sort rewards in ascending order
  rewardValues.sort((a, b) => a - b);

  // Initialize bitset using BigInt for arbitrary precision
  // Bit i represents whether sum i is achievable
  let dp = 1n; // Start with sum 0 achievable (bit 0 = 1)

  // Process each reward
  for (const r of rewardValues) {
    // Create mask for sums < r: (1 << r) - 1
    // Using BigInt for bit manipulation
    const mask = (1n << BigInt(r)) - 1n;

    // Get achievable sums where sum < r
    const validSums = dp & mask;

    // Shift left by r to add r to each valid sum
    const newSums = validSums << BigInt(r);

    // Combine with existing achievable sums
    dp |= newSums;
  }

  // Find the highest set bit (maximum achievable sum)
  // Convert to string and find the length of binary representation
  const binaryStr = dp.toString(2);
  return parseInt(binaryStr, 2) >> (binaryStr.length - 1) ? (1 << (binaryStr.length - 1)) - 1 : 0;

  // Alternative: manual search for highest set bit
  // let maxSum = 0;
  // let bit = 1n;
  // for (let i = 0; i <= 100000; i++) {  // Upper bound
  //     if ((dp & bit) !== 0n) {
  //         maxSum = i;
  //     }
  //     bit <<= 1n;
  // }
  // return maxSum;
}
```

```java
// Time: O(n * max_sum / 64) with bitset optimization
// Space: O(max_sum / 64) for the bitset
import java.util.Arrays;
import java.util.BitSet;

class Solution {
    public int maxTotalReward(int[] rewardValues) {
        // Sort rewards in ascending order
        Arrays.sort(rewardValues);

        // Initialize bitset - using Java's BitSet class
        // Bit i represents whether sum i is achievable
        BitSet dp = new BitSet();
        dp.set(0);  // Start with sum 0 achievable

        // Process each reward
        for (int r : rewardValues) {
            // Get the subset of achievable sums where sum < r
            BitSet validSums = dp.get(0, r);  // Bits from 0 to r-1

            // Shift left by r (add r to each valid sum)
            // We need to create a new BitSet for the shifted values
            BitSet newSums = new BitSet();

            // Manually shift by setting bits at position sum + r
            for (int sum = validSums.nextSetBit(0); sum >= 0;
                 sum = validSums.nextSetBit(sum + 1)) {
                newSums.set(sum + r);
            }

            // Combine with existing achievable sums
            dp.or(newSums);
        }

        // Find the highest set bit (maximum achievable sum)
        return dp.length() - 1;  // length() returns index of highest set bit + 1
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × M / w), where:

- `n` is the number of rewards
- `M` is the maximum possible sum (bounded by 2 × max(rewardValues))
- `w` is the word size (typically 32 or 64 bits)

The bitset operations (AND, shift, OR) operate on `M/w` machine words, and we perform these operations for each of the `n` rewards.

**Space Complexity:** O(M / w) for storing the bitset, which is much more efficient than a boolean array of size M.

Without bitset optimization, a naive DP approach would be O(n × M), which is too slow given the constraints (M can be up to 10⁶).

## Common Mistakes

1. **Not sorting the rewards first:** Attempting to process rewards in their original order misses optimal sequences. The constraint `reward > current_total` means smaller rewards should generally be taken earlier to build up the total.

2. **Incorrect iteration order in DP:** When updating `dp[s + r]`, if you iterate `s` from low to high, you might use the same reward multiple times in the same iteration. Always iterate from high to low when adding items in knapsack-style DP.

3. **Using integer instead of bitset/BigInt:** With rewards up to 5×10⁵, the maximum sum can approach 10⁶, which requires a bitset or BigInt to represent efficiently. Regular integers in most languages can't hold bits for positions up to 10⁶.

4. **Missing the upper bound on maximum sum:** The maximum achievable sum is at most `2 × max(rewardValues)`. This is because once your total exceeds the maximum reward, you can't add any more rewards. This bound is crucial for limiting the bitset size.

## When You'll See This Pattern

This problem uses a **bitset-optimized dynamic programming** pattern that appears in several subset sum problems:

1. **Partition Equal Subset Sum (LeetCode 416):** Determine if an array can be partitioned into two subsets with equal sum. Uses bitset DP to track achievable sums.

2. **Target Sum (LeetCode 494):** Count the number of ways to assign +/- signs to get a target sum. Can be solved with bitset DP for counting variations.

3. **Coin Change II (LeetCode 518):** Count the number of combinations that make up an amount. While typically solved with 2D DP, bitset optimizations can apply.

The common thread is using a bitset to efficiently track which sums are achievable when combining elements from a set, especially when the sums can be large but the number of elements is moderate.

## Key Takeaways

1. **Bitset optimization is powerful for subset sum problems:** When you need to track which sums are achievable and the maximum sum is large but manageable (up to ~10⁶), bitsets provide an efficient O(M/word_size) representation instead of O(M) boolean array.

2. **Sorting often helps with "take if greater than current" constraints:** When you can only take an element if it's greater than your current state, processing in ascending order ensures you consider smaller elements first, which can help build up to take larger ones later.

3. **Understand the state space reduction:** The insight that we only care about whether a sum is achievable (not how we got there) reduces the problem from exponential to polynomial time. Always look for ways to reduce the state space in DP problems.

[Practice this problem on CodeJeet](/problem/maximum-total-reward-using-operations-ii)
