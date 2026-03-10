---
title: "How to Solve Minimum Incompatibility — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Incompatibility. Hard difficulty, 41.1% acceptance rate. Topics: Array, Hash Table, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2026-05-05"
category: "dsa-patterns"
tags: ["minimum-incompatibility", "array", "hash-table", "dynamic-programming", "hard"]
---

# How to Solve Minimum Incompatibility

This problem asks you to split an array into `k` equal-sized subsets where no subset contains duplicate elements, minimizing the sum of each subset's "incompatibility" (max-min difference). What makes this problem tricky is the combination of constraints: we need to partition elements into groups with no duplicates, ensure equal sizes, and minimize a specific metric. The exponential search space makes brute force impossible for typical constraints.

## Visual Walkthrough

Let's trace through a small example: `nums = [1,2,1,4]`, `k = 2`

**Step 1: Understanding the requirements**

- We need 2 subsets of equal size
- Each subset size must be 4/2 = 2
- No duplicates within any subset
- Minimize sum of (max-min) for each subset

**Step 2: Valid subset possibilities**
Possible valid subsets of size 2 with no duplicates:

- {1,2} → incompatibility = 2-1 = 1
- {1,4} → incompatibility = 4-1 = 3
- {2,4} → incompatibility = 4-2 = 2
- {2,1} → same as {1,2}
- {4,1} → same as {1,4}
- {4,2} → same as {2,4}

**Step 3: Finding valid partitions**
We need to partition all 4 elements into 2 groups of 2:

- Option 1: {1,2} and {1,4} → invalid (1 appears in both subsets)
- Option 2: {1,2} and {2,4} → invalid (2 appears in both)
- Option 3: {1,4} and {2,1} → invalid (1 appears in both)
- Option 4: {1,4} and {2,4} → invalid (4 appears in both)
- Option 5: {2,4} and {1,2} → invalid (2 appears in both)
- Option 6: {2,1} and {4,1} → invalid (1 appears in both)

Wait, we have a problem! With two 1's in the array, we can't create two subsets without duplicates. Let's check if this is even possible:

**Step 4: Checking feasibility**
We have 4 elements, k=2 → each subset size = 2
Element frequencies: 1 appears twice, 2 appears once, 4 appears once
Since 1 appears twice, and we need two subsets, we could put one 1 in each subset:

- Subset 1: {1,2} → incompatibility = 1
- Subset 2: {1,4} → incompatibility = 3
  Total incompatibility = 1 + 3 = 4

This is valid! Each subset has size 2, no duplicates within subsets, and all elements are used.

**Step 5: Finding minimum**
Is there a better arrangement?

- Subset 1: {1,4} → incompatibility = 3
- Subset 2: {1,2} → incompatibility = 1  
  Total = 4 (same)

- Subset 1: {2,4} → incompatibility = 2
  But then we have two 1's left that must go together → invalid (duplicates)

So minimum incompatibility = 4

## Brute Force Approach

A naive brute force would try all possible ways to partition `n` elements into `k` groups of size `n/k`. For each element, we'd try putting it in each available subset that doesn't already contain that element and has space. This is essentially a backtracking search.

The problem with this approach is the combinatorial explosion. With `n=16` and `k=8` (a typical constraint), we'd have 16!/(2!^8) possible arrangements, which is around 2.6 × 10¹¹ possibilities - far too many to explore.

Even with pruning (skipping invalid placements), the search space grows factorially with `n`. We need a smarter approach that leverages the fact that subsets are indistinguishable and we only care about which elements go together, not which subset they're in.

## Optimized Approach

The key insight is to use **bitmask dynamic programming** (DP). Here's the step-by-step reasoning:

1. **Precomputation**: First, we need to check if a solution is even possible. If any element appears more than `k` times, it's impossible (pigeonhole principle).

2. **Bitmask representation**: Since `n ≤ 16` (based on typical constraints), we can represent which elements are used with a bitmask of length `n`. Bit `i` = 1 means element `i` is already assigned to a subset.

3. **Valid subset precomputation**: Before running DP, we precompute all valid subsets of size `n/k` that contain no duplicates. For each valid subset (represented as a bitmask), we calculate its incompatibility.

4. **DP state definition**: Let `dp[mask]` = minimum total incompatibility achievable using the elements represented by `mask` (elements with bit 1 are used).

5. **DP transition**: For each state `mask`, we try adding one valid subset (from our precomputed list) that uses only elements not yet used (bits that are 0 in `mask`). The new state is `mask | subsetMask`, and we update:

   ```
   dp[mask | subsetMask] = min(dp[mask | subsetMask], dp[mask] + incompatibility(subsetMask))
   ```

6. **Base case**: `dp[0] = 0` (no elements used, zero incompatibility)

7. **Answer**: `dp[(1 << n) - 1]` (all elements used)

The critical optimization is that we process masks in increasing order of set bits, ensuring we only use subsets with elements that aren't already used.

## Optimal Solution

<div class="code-group">

```python
# Time: O(3^n) - iterating over all masks and their submasks
# Space: O(2^n) - for dp array and valid subsets
class Solution:
    def minimumIncompatibility(self, nums: List[int], k: int) -> int:
        n = len(nums)
        # Each subset must have exactly size elements
        size = n // k

        # Check feasibility: if any number appears more than k times, impossible
        from collections import Counter
        freq = Counter(nums)
        if max(freq.values()) > k:
            return -1

        # Precompute all valid subsets of size 'size' with no duplicates
        valid_subsets = {}
        # We'll use bitmask to represent which indices are in the subset
        for mask in range(1 << n):
            # Count number of bits set (elements in subset)
            if bin(mask).count('1') != size:
                continue

            # Extract the actual values at these indices
            values = []
            for i in range(n):
                if mask & (1 << i):
                    values.append(nums[i])

            # Check for duplicates
            if len(set(values)) != size:
                continue

            # Calculate incompatibility (max - min)
            incompatibility = max(values) - min(values)
            valid_subsets[mask] = incompatibility

        # DP array: dp[mask] = min total incompatibility for used elements in mask
        INF = float('inf')
        dp = [INF] * (1 << n)
        dp[0] = 0  # No elements used

        # Iterate over all masks
        for mask in range(1 << n):
            # Skip unreachable states
            if dp[mask] == INF:
                continue

            # Find unused elements (bits that are 0 in current mask)
            # We need to find which elements are still available
            unused_mask = ((1 << n) - 1) ^ mask

            # We need to iterate over submasks of unused_mask that are valid subsets
            # Efficient way: iterate over all valid subsets and check if they're submasks of unused_mask
            for subset_mask, inc in valid_subsets.items():
                # Check if this subset uses only unused elements
                # (subset_mask & mask) should be 0 (no overlap with used elements)
                # AND subset_mask should be a submask of unused_mask
                if (subset_mask & mask) == 0:
                    new_mask = mask | subset_mask
                    dp[new_mask] = min(dp[new_mask], dp[mask] + inc)

        return dp[(1 << n) - 1] if dp[(1 << n) - 1] != INF else -1
```

```javascript
// Time: O(3^n) - iterating over all masks and their submasks
// Space: O(2^n) - for dp array and valid subsets
function minimumIncompatibility(nums, k) {
  const n = nums.length;
  // Each subset must have exactly size elements
  const size = n / k;

  // Check feasibility: if any number appears more than k times, impossible
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  for (const count of freq.values()) {
    if (count > k) return -1;
  }

  // Helper to count bits in a mask
  function countBits(mask) {
    let count = 0;
    while (mask > 0) {
      count += mask & 1;
      mask >>= 1;
    }
    return count;
  }

  // Precompute all valid subsets of size 'size' with no duplicates
  const validSubsets = new Map();
  // Iterate over all possible masks (subsets of indices)
  for (let mask = 1; mask < 1 << n; mask++) {
    // Check if this mask has exactly 'size' bits set
    if (countBits(mask) !== size) continue;

    // Extract values at these indices
    const values = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        values.push(nums[i]);
      }
    }

    // Check for duplicates using Set
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== size) continue;

    // Calculate incompatibility (max - min)
    const incompatibility = Math.max(...values) - Math.min(...values);
    validSubsets.set(mask, incompatibility);
  }

  // DP array: dp[mask] = min total incompatibility for used elements in mask
  const INF = Infinity;
  const dp = new Array(1 << n).fill(INF);
  dp[0] = 0; // No elements used

  // Iterate over all masks
  for (let mask = 0; mask < 1 << n; mask++) {
    // Skip unreachable states
    if (dp[mask] === INF) continue;

    // Find unused elements (bits that are 0 in current mask)
    const unusedMask = ((1 << n) - 1) ^ mask;

    // Try to add any valid subset that uses only unused elements
    for (const [subsetMask, inc] of validSubsets) {
      // Check if this subset uses only unused elements
      // (subsetMask & mask) should be 0 (no overlap with used elements)
      if ((subsetMask & mask) === 0) {
        const newMask = mask | subsetMask;
        dp[newMask] = Math.min(dp[newMask], dp[mask] + inc);
      }
    }
  }

  const result = dp[(1 << n) - 1];
  return result !== INF ? result : -1;
}
```

```java
// Time: O(3^n) - iterating over all masks and their submasks
// Space: O(2^n) - for dp array and valid subsets
class Solution {
    public int minimumIncompatibility(int[] nums, int k) {
        int n = nums.length;
        // Each subset must have exactly size elements
        int size = n / k;

        // Check feasibility: if any number appears more than k times, impossible
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
        for (int count : freq.values()) {
            if (count > k) return -1;
        }

        // Precompute all valid subsets of size 'size' with no duplicates
        Map<Integer, Integer> validSubsets = new HashMap<>();
        // Iterate over all possible masks (subsets of indices)
        for (int mask = 1; mask < (1 << n); mask++) {
            // Check if this mask has exactly 'size' bits set
            if (Integer.bitCount(mask) != size) continue;

            // Extract values at these indices
            List<Integer> values = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    values.add(nums[i]);
                }
            }

            // Check for duplicates using Set
            Set<Integer> uniqueValues = new HashSet<>(values);
            if (uniqueValues.size() != size) continue;

            // Calculate incompatibility (max - min)
            int maxVal = Collections.max(values);
            int minVal = Collections.min(values);
            int incompatibility = maxVal - minVal;
            validSubsets.put(mask, incompatibility);
        }

        // DP array: dp[mask] = min total incompatibility for used elements in mask
        int INF = Integer.MAX_VALUE / 2;
        int[] dp = new int[1 << n];
        Arrays.fill(dp, INF);
        dp[0] = 0;  // No elements used

        // Iterate over all masks
        for (int mask = 0; mask < (1 << n); mask++) {
            // Skip unreachable states
            if (dp[mask] == INF) continue;

            // Find unused elements (bits that are 0 in current mask)
            int unusedMask = ((1 << n) - 1) ^ mask;

            // Try to add any valid subset that uses only unused elements
            for (Map.Entry<Integer, Integer> entry : validSubsets.entrySet()) {
                int subsetMask = entry.getKey();
                int inc = entry.getValue();

                // Check if this subset uses only unused elements
                // (subsetMask & mask) should be 0 (no overlap with used elements)
                if ((subsetMask & mask) == 0) {
                    int newMask = mask | subsetMask;
                    dp[newMask] = Math.min(dp[newMask], dp[mask] + inc);
                }
            }
        }

        int result = dp[(1 << n) - 1];
        return result != INF ? result : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(3ⁿ)

- We iterate over all masks from 0 to 2ⁿ - 1: O(2ⁿ)
- For each mask, we iterate over all valid subsets. In the worst case, there could be C(n, n/k) valid subsets, but practically fewer due to duplicate constraints.
- The nested iteration gives O(3ⁿ) in theory (sum over all masks of 2^(unused bits)), though with pruning it's often faster.

**Space Complexity**: O(2ⁿ)

- The DP array has size 2ⁿ
- We store valid subsets, which in worst case could be O(2ⁿ) but typically much smaller
- Additional O(n) space for frequency counting and temporary arrays

The exponential complexity is acceptable because n ≤ 16 in typical constraints, so 2¹⁶ = 65,536 states is manageable.

## Common Mistakes

1. **Not checking feasibility first**: Forgetting to check if any element appears more than `k` times. This is a quick early exit that saves computation time.

2. **Incorrect subset size calculation**: Using `n/k` without ensuring it's an integer. The problem guarantees `n` is divisible by `k`, but it's good to verify.

3. **Missing the "no duplicates within subset" constraint**: When generating valid subsets, candidates might forget to check for duplicates, leading to invalid solutions.

4. **Inefficient subset generation**: Trying to generate subsets by iterating over all permutations of indices instead of using bitmasks. With n=16, 16! is 2×10¹³ vs 2¹⁶=65,536 for bitmask approach.

5. **Not using DP memoization**: Attempting pure backtracking without DP leads to exponential re-computation of the same states.

## When You'll See This Pattern

This bitmask DP pattern appears in problems where you need to partition elements into groups with constraints:

1. **Partition to K Equal Sum Subsets (LC 698)**: Similar partitioning problem but with sum constraints instead of incompatibility.

2. **Minimum Number of Work Sessions to Finish Tasks (LC 1986)**: Tasks to sessions assignment with time constraints, uses similar bitmask DP.

3. **Campus Bikes II (LC 1066)**: Assign bikes to workers minimizing total distance, uses bitmask DP for assignment problems.

The common theme is: when you have to assign n items (n ≤ 20) to groups with constraints, and the assignment of one item affects others, bitmask DP is often the solution.

## Key Takeaways

1. **Bitmask DP is powerful for assignment/partitioning problems** with n ≤ 20. Represent used/assigned elements as bits in an integer.

2. **Precompute valid components** when possible. Here we precomputed all valid subsets before running DP, which simplifies the DP transition logic.

3. **Always check feasibility constraints early**. Problems often have quick checks (like frequency checks) that can save computation or provide early exits.

4. **The state definition is crucial**. `dp[mask]` = best solution using elements in `mask`. Transitions add compatible components to reach new states.

[Practice this problem on CodeJeet](/problem/minimum-incompatibility)
