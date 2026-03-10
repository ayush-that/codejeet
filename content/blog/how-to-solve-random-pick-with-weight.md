---
title: "How to Solve Random Pick with Weight — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Random Pick with Weight. Medium difficulty, 48.9% acceptance rate. Topics: Array, Math, Binary Search, Prefix Sum, Randomized."
date: "2027-01-25"
category: "dsa-patterns"
tags: ["random-pick-with-weight", "array", "math", "binary-search", "medium"]
---

# How to Solve Random Pick with Weight

You're given an array of weights where each weight represents the relative probability of selecting its index. The challenge is to implement `pickIndex()` that returns a random index with probability proportional to its weight. What makes this problem interesting is that we need to transform uniform random numbers into weighted probabilities efficiently — a common real-world requirement for load balancing, sampling, and game mechanics.

## Visual Walkthrough

Let's trace through the example `w = [2, 7, 11, 15]`:

1. **Calculate prefix sums**: First, we compute the cumulative weights:
   - Index 0: 2
   - Index 1: 2 + 7 = 9
   - Index 2: 9 + 11 = 20
   - Index 3: 20 + 15 = 35

   Our prefix array becomes `[2, 9, 20, 35]`. The last value (35) is our total weight.

2. **Generate random target**: We generate a random integer between 1 and 35 inclusive. Let's say we get 17.

3. **Find where target falls**: We need to find the first prefix sum ≥ 17:
   - Check index 0: 2 < 17 → continue
   - Check index 1: 9 < 17 → continue
   - Check index 2: 20 ≥ 17 → found!

   We return index 2.

Why does this work? Imagine dividing the total weight (35) into segments:

- Index 0 gets weight 2: positions 1-2
- Index 1 gets weight 7: positions 3-9
- Index 2 gets weight 11: positions 10-20
- Index 3 gets weight 15: positions 21-35

When we pick a random number 1-35, it falls into one of these segments. The prefix sum array tells us where each segment ends, so finding the first prefix ≥ our random number gives us the correct segment.

## Brute Force Approach

A naive approach would be to expand the weights into a list of indices. For `w = [2, 7, 11, 15]`, we'd create:

```
[0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
```

Then we'd pick a random index from this list. The probability of each original index matches its weight.

**Why this fails**: Space complexity is O(total weight), which could be enormous. For example, if weights are `[1000000, 2000000]`, we'd need 3 million elements! Time complexity for initialization is also O(total weight), making this impractical for large weights.

## Optimized Approach

The key insight is that we don't need to physically expand the weights. Instead, we can:

1. **Precompute prefix sums** during initialization
2. **Generate a random number** between 1 and total weight
3. **Binary search** to find which segment contains this number

Think of it like a number line where each index occupies a segment proportional to its weight. The prefix sums give us the end points of these segments. A random point on this line will land in exactly one segment, and we need to find which one.

The binary search works because prefix sums are sorted (all weights are positive). We're looking for the smallest index where `prefix[i] ≥ target`. This is a classic "first element ≥ target" search.

## Optimal Solution

<div class="code-group">

```python
import random
import bisect

class Solution:
    """
    Time Complexity:
    - __init__: O(n) where n is length of weights
    - pickIndex: O(log n) for binary search

    Space Complexity: O(n) for prefix sums array
    """

    def __init__(self, w: List[int]):
        # Step 1: Build prefix sums array
        # Each element prefix[i] = sum of weights[0..i]
        self.prefix_sums = []
        prefix_sum = 0

        for weight in w:
            prefix_sum += weight
            self.prefix_sums.append(prefix_sum)

        # Store total sum for random number generation
        self.total_sum = prefix_sum

    def pickIndex(self) -> int:
        # Step 2: Generate random target between 1 and total_sum (inclusive)
        # We use 1-based target because weights are positive integers
        target = random.randint(1, self.total_sum)

        # Step 3: Binary search to find first prefix sum >= target
        # bisect_left returns insertion point to maintain sorted order
        return bisect.bisect_left(self.prefix_sums, target)

# Alternative implementation without bisect for clarity:
class SolutionManualBinarySearch:
    def __init__(self, w: List[int]):
        self.prefix_sums = []
        prefix_sum = 0
        for weight in w:
            prefix_sum += weight
            self.prefix_sums.append(prefix_sum)
        self.total_sum = prefix_sum

    def pickIndex(self) -> int:
        target = random.randint(1, self.total_sum)

        # Manual binary search implementation
        left, right = 0, len(self.prefix_sums) - 1

        while left < right:
            mid = left + (right - left) // 2

            if self.prefix_sums[mid] < target:
                # Target is in the right half
                left = mid + 1
            else:
                # Target could be at mid or in left half
                right = mid

        return left
```

```javascript
/**
 * Time Complexity:
 * - constructor: O(n) where n is length of weights
 * - pickIndex: O(log n) for binary search
 *
 * Space Complexity: O(n) for prefix sums array
 */
class Solution {
  constructor(w) {
    // Step 1: Build prefix sums array
    this.prefixSums = [];
    let prefixSum = 0;

    for (let weight of w) {
      prefixSum += weight;
      this.prefixSums.push(prefixSum);
    }

    // Store total sum for random number generation
    this.totalSum = prefixSum;
  }

  pickIndex() {
    // Step 2: Generate random target between 1 and totalSum (inclusive)
    // Math.random() gives [0, 1), so we scale and add 1
    const target = Math.floor(Math.random() * this.totalSum) + 1;

    // Step 3: Binary search to find first prefix sum >= target
    let left = 0;
    let right = this.prefixSums.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (this.prefixSums[mid] < target) {
        // Target is in the right half
        left = mid + 1;
      } else {
        // Target could be at mid or in left half
        right = mid;
      }
    }

    return left;
  }
}
```

```java
import java.util.Random;

/**
 * Time Complexity:
 * - Solution(): O(n) where n is length of weights
 * - pickIndex(): O(log n) for binary search
 *
 * Space Complexity: O(n) for prefix sums array
 */
class Solution {
    private int[] prefixSums;
    private int totalSum;
    private Random random;

    public Solution(int[] w) {
        // Step 1: Build prefix sums array
        prefixSums = new int[w.length];
        int prefixSum = 0;

        for (int i = 0; i < w.length; i++) {
            prefixSum += w[i];
            prefixSums[i] = prefixSum;
        }

        // Store total sum for random number generation
        totalSum = prefixSum;
        random = new Random();
    }

    public int pickIndex() {
        // Step 2: Generate random target between 1 and totalSum (inclusive)
        // nextInt(totalSum) gives [0, totalSum-1], so we add 1
        int target = random.nextInt(totalSum) + 1;

        // Step 3: Binary search to find first prefix sum >= target
        int left = 0;
        int right = prefixSums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (prefixSums[mid] < target) {
                // Target is in the right half
                left = mid + 1;
            } else {
                // Target could be at mid or in left half
                right = mid;
            }
        }

        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization (`__init__`/constructor)**: O(n) where n is the number of weights. We iterate once through the input array to compute prefix sums.
- **`pickIndex()`**: O(log n) for the binary search. Each call performs a binary search on the prefix sums array.

**Space Complexity:** O(n) for storing the prefix sums array. We need to store cumulative weights for each index to enable efficient lookups.

The optimization comes from recognizing that:

1. Prefix sums create a monotonic increasing sequence (all weights are positive)
2. Binary search on this sequence gives us O(log n) lookups instead of O(n) linear search
3. We avoid the O(total weight) memory blowup of the brute force approach

## Common Mistakes

1. **Off-by-one errors with random number generation**: Generating `random(0, totalSum-1)` instead of `random(1, totalSum)`. Since weights are positive integers, we need 1-based targets. If you generate 0, the first weight (which covers positions 1-w[0]) would never be selected.

2. **Forgetting that prefix sums are already computed**: Some candidates recalculate the prefix sum during each `pickIndex()` call. This turns O(log n) into O(n) per call. Always precompute during initialization.

3. **Incorrect binary search condition**: Using `≤` instead of `≥` or vice versa. We want the **first** prefix sum that's **≥** target. If you use `>`, you might skip valid indices when the target equals a prefix sum.

4. **Not handling large weights**: Attempting to create an expanded array (brute force) for weights like `[1000000, 2000000]`. Always check constraints — weights can be up to 10^4, and there can be up to 10^4 weights, making the total weight up to 10^8, which is too large for an expanded array.

## When You'll See This Pattern

This "prefix sum + binary search" pattern appears whenever you need to:

1. Sample from a discrete probability distribution
2. Map uniform random numbers to weighted intervals
3. Implement weighted random selection in systems

**Related LeetCode problems:**

1. **Random Pick Index (Medium)**: Similar concept but with equal weights for matching values. Uses reservoir sampling instead.
2. **Random Point in Non-overlapping Rectangles (Medium)**: Extends this pattern to 2D — you pick a rectangle weighted by area, then pick a random point within it.
3. **Random Pick with Blacklist (Hard)**: Uses a similar mapping concept but with excluded ranges.

The core idea of mapping random numbers to intervals via prefix sums is a fundamental technique in randomized algorithms and sampling.

## Key Takeaways

1. **Prefix sums transform weights into segments** on a number line, enabling O(log n) weighted random selection instead of O(n) or worse.

2. **Binary search finds intervals efficiently** when you have a sorted array of breakpoints. Look for "first element ≥ target" patterns.

3. **Precomputation is key for repeated queries**. When a function will be called many times (like `pickIndex()`), invest in O(n) initialization to achieve O(log n) queries.

**Remember**: When you see "weighted random" or "probability proportional to", think prefix sums + binary search. This pattern efficiently bridges the gap between uniform randomness and weighted distributions.

Related problems: [Random Pick Index](/problem/random-pick-index), [Random Pick with Blacklist](/problem/random-pick-with-blacklist), [Random Point in Non-overlapping Rectangles](/problem/random-point-in-non-overlapping-rectangles)
