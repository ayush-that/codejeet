---
title: "How to Solve Put Marbles in Bags — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Put Marbles in Bags. Hard difficulty, 72.2% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2026-08-29"
category: "dsa-patterns"
tags: ["put-marbles-in-bags", "array", "greedy", "sorting", "hard"]
---

# How to Solve Put Marbles in Bags

You need to divide `n` marbles with given weights into `k` non-empty bags, where the cost of a bag is the sum of its marbles' weights, and the total cost is the sum of each bag's cost. The twist: you also add the weights of the first and last marble in each bag to the total score. Your goal is to find the difference between the maximum and minimum possible total scores. This problem is tricky because it looks like a complex partitioning problem, but has a clever greedy insight that reduces it to simple sorting.

## Visual Walkthrough

Let's trace through a concrete example: `weights = [1, 3, 5, 1]` with `k = 2`.

We need to split the marbles into 2 non-empty bags. The possible splits are:

1. Bag 1: [1], Bag 2: [3, 5, 1]
   - Score = (1 + 1) + (3 + 1) = 2 + 4 = 6
2. Bag 1: [1, 3], Bag 2: [5, 1]
   - Score = (1 + 3) + (5 + 1) = 4 + 6 = 10
3. Bag 1: [1, 3, 5], Bag 2: [1]
   - Score = (1 + 5) + (1 + 1) = 6 + 2 = 8

Wait — let's understand the scoring formula better. The problem says: "The score after distributing the marbles is the sum of the weights of the first and last marble in each bag." So for each bag, we only add the first and last marble's weights, not the sum of all marbles in the bag.

Let's recalculate:

1. Bag 1: [1] → first = 1, last = 1 → contribution = 2  
   Bag 2: [3, 5, 1] → first = 3, last = 1 → contribution = 4  
   Total = 2 + 4 = 6
2. Bag 1: [1, 3] → first = 1, last = 3 → contribution = 4  
   Bag 2: [5, 1] → first = 5, last = 1 → contribution = 6  
   Total = 4 + 6 = 10
3. Bag 1: [1, 3, 5] → first = 1, last = 5 → contribution = 6  
   Bag 2: [1] → first = 1, last = 1 → contribution = 2  
   Total = 6 + 2 = 8

So maximum score = 10, minimum score = 6, difference = 4.

Now here's the key insight: When we split between indices `i` and `i+1`, the marble at position `i` is the last marble of one bag, and the marble at position `i+1` is the first marble of the next bag. In the total score, these both get counted! Except for the very first marble (always first of first bag) and very last marble (always last of last bag), which are always counted exactly once.

Therefore, each split point between `i` and `i+1` adds `weights[i] + weights[i+1]` to the total score. We have `k-1` split points to choose (to create `k` bags). To maximize the total score, we pick the `k-1` largest split sums. To minimize, we pick the `k-1` smallest split sums. The difference is simply the sum of the largest `k-1` split sums minus the sum of the smallest `k-1` split sums.

For our example:  
Split sums between consecutive marbles:

- Between index 0-1: 1 + 3 = 4
- Between index 1-2: 3 + 5 = 8
- Between index 2-3: 5 + 1 = 6

We need `k-1 = 1` split.  
Max: pick largest = 8  
Min: pick smallest = 4  
Difference = 8 - 4 = 4 ✓

## Brute Force Approach

A naive approach would try all possible ways to place `k-1` split points among `n-1` possible positions. This is choosing `k-1` positions from `n-1`, which gives `C(n-1, k-1)` combinations. For each combination, we'd calculate the total score by summing the first/last marbles of each bag, which takes O(k) time. Overall complexity is O(C(n-1, k-1) \* k), which is exponential and impractical for n up to 10^5.

Even if we tried dynamic programming, a straightforward DP would be O(n²k), still too slow. The problem constraints (n up to 10^5) tell us we need an O(n log n) or O(n) solution.

## Optimized Approach

The breakthrough realization is that the total score can be expressed as:

```
Total score = weights[0] + weights[n-1] + sum of (weights[i] + weights[i+1]) for each split between i and i+1
```

Why? Because:

- `weights[0]` is always the first marble of the first bag
- `weights[n-1]` is always the last marble of the last bag
- For each split between index `i` and `i+1`, marble `i` is the last marble of its bag, and marble `i+1` is the first marble of the next bag — both get counted

Since `weights[0]` and `weights[n-1]` are fixed regardless of how we split, they cancel out when computing the difference between max and min scores. We only need to consider the split point contributions.

Thus:

1. Compute all `n-1` consecutive pair sums: `weights[i] + weights[i+1]` for i = 0 to n-2
2. Sort these pair sums
3. The maximum score comes from picking the largest `k-1` pair sums
4. The minimum score comes from picking the smallest `k-1` pair sums
5. The difference is `(sum of largest k-1) - (sum of smallest k-1)`

Special case: if `k = 1`, we have no splits, so the difference is 0.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def putMarbles(weights, k):
    """
    Calculate the difference between maximum and minimum possible scores
    when dividing marbles into k bags.

    The key insight: Each split between marbles i and i+1 contributes
    weights[i] + weights[i+1] to the total score. We choose k-1 splits.
    """
    n = len(weights)

    # If k == 1, there are no splits, so max and min scores are identical
    if k == 1 or n == 1:
        return 0

    # Step 1: Compute all consecutive pair sums
    # There are n-1 possible split points between n marbles
    pair_sums = []
    for i in range(n - 1):
        pair_sums.append(weights[i] + weights[i + 1])

    # Step 2: Sort the pair sums to easily find largest and smallest k-1 values
    pair_sums.sort()

    # Step 3: Calculate sum of smallest k-1 pair sums
    min_sum = sum(pair_sums[:k - 1])

    # Step 4: Calculate sum of largest k-1 pair sums
    # Since the list is sorted, the largest k-1 are at the end
    max_sum = sum(pair_sums[-(k - 1):])

    # Step 5: The difference is what we're looking for
    return max_sum - min_sum
```

```javascript
// Time: O(n log n) | Space: O(n)
function putMarbles(weights, k) {
  /**
   * Calculate the difference between maximum and minimum possible scores
   * when dividing marbles into k bags.
   *
   * The key insight: Each split between marbles i and i+1 contributes
   * weights[i] + weights[i+1] to the total score. We choose k-1 splits.
   */
  const n = weights.length;

  // If k == 1, there are no splits, so max and min scores are identical
  if (k === 1 || n === 1) {
    return 0;
  }

  // Step 1: Compute all consecutive pair sums
  // There are n-1 possible split points between n marbles
  const pairSums = [];
  for (let i = 0; i < n - 1; i++) {
    pairSums.push(weights[i] + weights[i + 1]);
  }

  // Step 2: Sort the pair sums to easily find largest and smallest k-1 values
  pairSums.sort((a, b) => a - b);

  // Step 3: Calculate sum of smallest k-1 pair sums
  let minSum = 0;
  for (let i = 0; i < k - 1; i++) {
    minSum += pairSums[i];
  }

  // Step 4: Calculate sum of largest k-1 pair sums
  // Since the list is sorted, the largest k-1 are at the end
  let maxSum = 0;
  for (let i = pairSums.length - 1; i >= pairSums.length - (k - 1); i--) {
    maxSum += pairSums[i];
  }

  // Step 5: The difference is what we're looking for
  return maxSum - minSum;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    public long putMarbles(int[] weights, int k) {
        /**
         * Calculate the difference between maximum and minimum possible scores
         * when dividing marbles into k bags.
         *
         * The key insight: Each split between marbles i and i+1 contributes
         * weights[i] + weights[i+1] to the total score. We choose k-1 splits.
         */
        int n = weights.length;

        // If k == 1, there are no splits, so max and min scores are identical
        if (k == 1 || n == 1) {
            return 0;
        }

        // Step 1: Compute all consecutive pair sums
        // There are n-1 possible split points between n marbles
        long[] pairSums = new long[n - 1];
        for (int i = 0; i < n - 1; i++) {
            pairSums[i] = (long) weights[i] + weights[i + 1];
        }

        // Step 2: Sort the pair sums to easily find largest and smallest k-1 values
        Arrays.sort(pairSums);

        // Step 3: Calculate sum of smallest k-1 pair sums
        long minSum = 0;
        for (int i = 0; i < k - 1; i++) {
            minSum += pairSums[i];
        }

        // Step 4: Calculate sum of largest k-1 pair sums
        // Since the list is sorted, the largest k-1 are at the end
        long maxSum = 0;
        for (int i = pairSums.length - 1; i >= pairSums.length - (k - 1); i--) {
            maxSum += pairSums[i];
        }

        // Step 5: The difference is what we're looking for
        return maxSum - minSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Computing all `n-1` consecutive pair sums takes O(n) time
- Sorting these `n-1` sums takes O(n log n) time (dominant term)
- Summing the smallest and largest `k-1` elements takes O(k) time, which is O(n) in worst case

**Space Complexity:** O(n)

- We store the `n-1` pair sums in an array
- The sorting algorithm may use O(log n) to O(n) additional space depending on implementation, but we count the output array as the main space usage

## Common Mistakes

1. **Forgetting the k=1 edge case**: When k=1, we have no splits to make, so the difference should be 0. Without this check, you might try to access k-1 = 0 elements from the pair sums array, which could cause issues.

2. **Incorrect pair sum calculation**: Some candidates compute `weights[i] + weights[i]` instead of `weights[i] + weights[i+1]`. Remember we're looking at consecutive pairs for split points.

3. **Not using long for large sums**: The weights can be up to 10^9, and n up to 10^5, so sums can exceed 32-bit integer range. In Java, use `long` for the pair sums and result.

4. **Trying to optimize with heaps unnecessarily**: While you could use two heaps to track the k-1 smallest and largest sums without sorting, the O(n log n) sorting solution is simpler and acceptable. Over-engineering with heaps adds complexity without asymptotic improvement.

## When You'll See This Pattern

This "split point contribution" pattern appears in problems where:

1. You're partitioning an array into segments
2. The cost/score depends only on boundary elements of each segment
3. The total cost is additive across segments

Related LeetCode problems:

- **"Minimum Cost to Cut a Stick" (Problem 1547)**: Similar idea where each cut adds to the total cost based on the segment length, and optimal cut points can be selected greedily in a different context.
- **"Partition Array Such That Maximum Difference Is K" (Problem 2294)**: While not identical, it involves partitioning with constraints on segment values.
- **"Divide Chocolate" (Problem 1231)**: You split an array into k+1 pieces to maximize the minimum sum, using binary search but with similar partitioning concepts.

## Key Takeaways

1. **Look for what actually contributes to the score**: Instead of getting overwhelmed by all possible partitions, analyze what elements actually affect the total. Here, only the first and last marble of each bag matter, which simplifies to just the split points plus the two endpoints.

2. **Transformation is powerful**: The problem seems like complex DP but transforms into simple sorting once you realize the score formula. Always check if you can reformulate the problem in simpler terms.

3. **Fixed elements cancel out in difference problems**: When asked for the difference between max and min of something, look for components that are constant across all configurations—they'll cancel out and simplify your calculation.

[Practice this problem on CodeJeet](/problem/put-marbles-in-bags)
