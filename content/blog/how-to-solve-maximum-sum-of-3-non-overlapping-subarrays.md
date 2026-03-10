---
title: "How to Solve Maximum Sum of 3 Non-Overlapping Subarrays — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Sum of 3 Non-Overlapping Subarrays. Hard difficulty, 59.7% acceptance rate. Topics: Array, Dynamic Programming, Sliding Window, Prefix Sum."
date: "2026-08-20"
category: "dsa-patterns"
tags:
  [
    "maximum-sum-of-3-non-overlapping-subarrays",
    "array",
    "dynamic-programming",
    "sliding-window",
    "hard",
  ]
---

# How to Solve Maximum Sum of 3 Non-Overlapping Subarrays

You’re given an array `nums` and an integer `k`. You need to find **three non-overlapping subarrays** of length `k` that together give the **maximum possible sum**. Return the starting indices of these three subarrays. If multiple solutions exist, return the lexicographically smallest one. The challenge here is that you can’t just pick the three largest individual subarray sums—they must be non-overlapping, and the choice of each subarray affects where the others can be placed. This forces you to consider the **interdependence** between the three selections, making a greedy “pick the biggest” approach insufficient.

## Visual Walkthrough

Let’s walk through a small example to build intuition.  
Suppose `nums = [1, 2, 1, 2, 6, 7, 5, 1]` and `k = 2`.

**Step 1 – Compute subarray sums**  
First, we need the sum of every contiguous block of length `k`.  
For `k = 2`, the sums are:

- Index 0: `1 + 2 = 3`
- Index 1: `2 + 1 = 3`
- Index 2: `1 + 2 = 3`
- Index 3: `2 + 6 = 8`
- Index 4: `6 + 7 = 13`
- Index 5: `7 + 5 = 12`
- Index 6: `5 + 1 = 6`

So the sum array `sums` is `[3, 3, 3, 8, 13, 12, 6]`.

**Step 2 – Think about positions**  
We need three non-overlapping subarrays of length `k`.  
If the first subarray starts at `i`, the second must start at `j ≥ i + k`, and the third at `l ≥ j + k`.  
For `k = 2`, possible `(i, j, l)` triplets must have `i ≤ n - 3k`, `j ≤ n - 2k`, `l ≤ n - k`.

**Step 3 – Try a brute force check**  
We could try all combinations:

- `i=0, j=2, l=4` → sums: `3 + 3 + 13 = 19`
- `i=0, j=2, l=5` → `3 + 3 + 12 = 18`
- `i=0, j=3, l=5` → `3 + 8 + 12 = 23`
- `i=1, j=3, l=5` → `3 + 8 + 12 = 23`
- `i=2, j=4, l=6` → `3 + 13 + 6 = 22`
  … and so on.

We see `23` is the maximum, with two possible index sets: `[0, 3, 5]` and `[1, 3, 5]`. Lexicographically smallest is `[0, 3, 5]`.

**Step 4 – The optimization insight**  
Instead of checking all `O(n³)` triplets, we can fix the middle subarray.  
For each possible middle start index `j`, the best left subarray is the maximum sum subarray **strictly to the left** of `j` (ending before `j`), and the best right subarray is the maximum sum subarray **strictly to the right** of `j` (starting at or after `j + k`).  
We can precompute these best left and right choices using prefix maximums.

## Brute Force Approach

A brute force solution would iterate over all possible starting indices `i, j, l` such that:

- `0 ≤ i ≤ n - 3k`
- `i + k ≤ j ≤ n - 2k`
- `j + k ≤ l ≤ n - k`

For each triplet, compute the sum of the three subarrays (which we can precompute in `O(n)` for all starting indices) and track the maximum.  
This leads to `O(n³)` time complexity if we compute sums naively, or `O(n³)` with precomputed sums.  
For `n` up to 20,000, this is far too slow.

Even with precomputed sums, the triple nested loop is `O(n³)` in the worst case, which is infeasible.  
We need to reduce the search space.

## Optimized Approach

The key insight is to **fix the middle subarray**.  
If we know where the middle subarray starts (`j`), then:

- The left subarray must be the **best subarray** in the range `[0, j - k]` (since it must end before `j`).
- The right subarray must be the **best subarray** in the range `[j + k, n - k]` (since it must start at or after `j + k`).

We can precompute:

1. `leftBest[i]` = index of the starting position of the best subarray of length `k` in `nums[0..i]` (inclusive).
2. `rightBest[i]` = index of the starting position of the best subarray of length `k` in `nums[i..n-k]` (inclusive).

Then, for each possible middle start index `j` from `k` to `n - 2k`, we can get:

- `leftIdx = leftBest[j - 1]`
- `rightIdx = rightBest[j + k]`
- Total sum = `sums[leftIdx] + sums[j] + sums[rightIdx]`

We track the maximum total sum and the corresponding indices.

**Why does this work?**  
By fixing the middle, we decouple the problem: the best left and right choices become independent given a fixed middle. Precomputing `leftBest` and `rightBest` allows us to query the best left/right in `O(1)` per middle.

**Lexicographic smallest requirement**  
When two subarray sums are equal, we must pick the smaller index. This is handled by storing the **earliest** index when building `leftBest` and `rightBest` if sums are equal.

## Optimal Solution

We implement the approach in three steps:

1. Compute `sums[i]` = sum of subarray starting at `i` of length `k` (using sliding window or prefix sums).
2. Compute `leftBest` and `rightBest` arrays.
3. Iterate over all possible middle starts `j`, compute total sum using precomputed best left/right, and track the maximum.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxSumOfThreeSubarrays(nums, k):
    n = len(nums)

    # Step 1: Compute sums of all subarrays of length k
    sums = [0] * (n - k + 1)
    # Initial sum of first window
    window_sum = sum(nums[:k])
    sums[0] = window_sum
    # Slide the window to compute remaining sums
    for i in range(1, n - k + 1):
        window_sum += nums[i + k - 1] - nums[i - 1]
        sums[i] = window_sum

    # Step 2: Precompute best left subarray indices
    leftBest = [0] * len(sums)
    bestIdx = 0
    for i in range(len(sums)):
        # If current sum is greater, update best index
        # If equal, keep the smaller index for lexicographic order
        if sums[i] > sums[bestIdx]:
            bestIdx = i
        leftBest[i] = bestIdx

    # Step 3: Precompute best right subarray indices
    rightBest = [0] * len(sums)
    bestIdx = len(sums) - 1
    for i in range(len(sums) - 1, -1, -1):
        # Use > (not >=) to ensure we pick the leftmost index when sums are equal
        if sums[i] > sums[bestIdx]:
            bestIdx = i
        rightBest[i] = bestIdx

    # Step 4: Try every possible middle subarray start
    maxSum = 0
    result = []
    # Middle can start from k to n - 2k in terms of sums array indices
    for j in range(k, len(sums) - k):
        leftIdx = leftBest[j - k]      # Best left ending before middle starts
        rightIdx = rightBest[j + k]    # Best right starting after middle ends
        total = sums[leftIdx] + sums[j] + sums[rightIdx]
        # If we found a better total sum, or same sum but lexicographically smaller
        if total > maxSum:
            maxSum = total
            result = [leftIdx, j, rightIdx]

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function maxSumOfThreeSubarrays(nums, k) {
  const n = nums.length;

  // Step 1: Compute sums of all subarrays of length k
  const sums = new Array(n - k + 1).fill(0);
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  sums[0] = windowSum;
  for (let i = 1; i <= n - k; i++) {
    windowSum += nums[i + k - 1] - nums[i - 1];
    sums[i] = windowSum;
  }

  // Step 2: Precompute best left subarray indices
  const leftBest = new Array(sums.length).fill(0);
  let bestIdx = 0;
  for (let i = 0; i < sums.length; i++) {
    // If current sum is greater, update best index
    // If equal, keep current best (smaller index)
    if (sums[i] > sums[bestIdx]) {
      bestIdx = i;
    }
    leftBest[i] = bestIdx;
  }

  // Step 3: Precompute best right subarray indices
  const rightBest = new Array(sums.length).fill(0);
  bestIdx = sums.length - 1;
  for (let i = sums.length - 1; i >= 0; i--) {
    // Use > to pick leftmost index when sums are equal
    if (sums[i] > sums[bestIdx]) {
      bestIdx = i;
    }
    rightBest[i] = bestIdx;
  }

  // Step 4: Try every possible middle subarray start
  let maxSum = 0;
  const result = [];
  // Middle start index j in sums array must leave room for left and right
  for (let j = k; j < sums.length - k; j++) {
    const leftIdx = leftBest[j - k]; // Best left ending before j
    const rightIdx = rightBest[j + k]; // Best right starting after j+k-1
    const total = sums[leftIdx] + sums[j] + sums[rightIdx];
    if (total > maxSum) {
      maxSum = total;
      result[0] = leftIdx;
      result[1] = j;
      result[2] = rightIdx;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] maxSumOfThreeSubarrays(int[] nums, int k) {
        int n = nums.length;

        // Step 1: Compute sums of all subarrays of length k
        int[] sums = new int[n - k + 1];
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += nums[i];
        }
        sums[0] = windowSum;
        for (int i = 1; i <= n - k; i++) {
            windowSum += nums[i + k - 1] - nums[i - 1];
            sums[i] = windowSum;
        }

        // Step 2: Precompute best left subarray indices
        int[] leftBest = new int[sums.length];
        int bestIdx = 0;
        for (int i = 0; i < sums.length; i++) {
            // If current sum is greater, update best index
            // If equal, keep the smaller index (lexicographic order)
            if (sums[i] > sums[bestIdx]) {
                bestIdx = i;
            }
            leftBest[i] = bestIdx;
        }

        // Step 3: Precompute best right subarray indices
        int[] rightBest = new int[sums.length];
        bestIdx = sums.length - 1;
        for (int i = sums.length - 1; i >= 0; i--) {
            // Use > to ensure leftmost index when sums are equal
            if (sums[i] > sums[bestIdx]) {
                bestIdx = i;
            }
            rightBest[i] = bestIdx;
        }

        // Step 4: Try every possible middle subarray start
        int maxSum = 0;
        int[] result = new int[3];
        // Middle start index j must have space for left and right subarrays
        for (int j = k; j < sums.length - k; j++) {
            int leftIdx = leftBest[j - k];     // Best left ending before j
            int rightIdx = rightBest[j + k];   // Best right starting after j+k-1
            int total = sums[leftIdx] + sums[j] + sums[rightIdx];
            if (total > maxSum) {
                maxSum = total;
                result[0] = leftIdx;
                result[1] = j;
                result[2] = rightIdx;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Computing all subarray sums takes `O(n)` using the sliding window technique.
- Building `leftBest` and `rightBest` arrays each takes `O(n - k + 1) ≈ O(n)`.
- Iterating over possible middle indices takes `O(n)` as well.
- Overall linear time.

**Space Complexity: O(n)**

- We store the `sums` array of size `n - k + 1 ≈ O(n)`.
- We store `leftBest` and `rightBest` arrays of the same size.
- Total space is `O(n)`.

## Common Mistakes

1. **Off-by-one errors in index bounds**  
   When computing `leftBest[j - k]` and `rightBest[j + k]`, it’s easy to mix up whether to use `j - k` or `j - 1`. Remember: if the middle starts at index `j` in the `sums` array, the left subarray must end **before** `j`, meaning its last element is at most `j - 1`. Since each subarray in `sums` corresponds to `k` elements, the left subarray’s start index in `sums` must be `≤ j - k`. So `leftBest[j - k]` gives the best up to that point.

2. **Not handling lexicographic order correctly**  
   When two subarrays have equal sums, we must pick the smaller starting index. In `leftBest`, we update only when `sums[i] > sums[bestIdx]` (not `≥`), so we keep the earlier index when sums are equal. In `rightBest`, we traverse from right to left and update when `sums[i] > sums[bestIdx]`, which also preserves the leftmost index for equal sums because we encounter left indices later in the reverse traversal.

3. **Incorrect window sliding for sums**  
   When computing `sums`, a common mistake is to recalculate each window from scratch, leading to `O(n*k)` time. Always use the sliding window technique: subtract the element leaving the window and add the new element entering.

4. **Forgetting that indices are in `sums` array, not original `nums`**  
   The `sums` array indices correspond to starting positions in `nums`. When returning the result, we return these indices directly—no conversion needed. But when reasoning about overlaps, remember that `sums[i]` covers `nums[i..i+k-1]`.

## When You'll See This Pattern

This “fix the middle and precompute left/right best” pattern appears in problems where you need to pick multiple non-overlapping segments while optimizing a sum or score. It transforms an `O(n³)` search into `O(n)` by decoupling choices through precomputation.

**Related problems:**

- **Best Time to Buy and Sell Stock III (Hard)**: You can buy/sell at most twice. The idea is similar: split the array into two parts and find the best transaction in each part. Precompute best profit from left and right.
- **Maximum Sum of Two Non-Overlapping Subarrays (Medium)**: A simpler version of this problem with two subarrays. The same “fix one, precompute the other” logic applies.
- **Maximum Subarray Sum After One Deletion (Medium)**: You can delete one element to maximize subarray sum. Precompute best subarray ending at each index from left and right, then try deleting each element.

## Key Takeaways

1. **Decouple interdependent choices by fixing one element** – When you need to choose multiple items with constraints, fixing one (like the middle subarray) can make the others independent, allowing precomputation.
2. **Precompute prefix/suffix optima** – If you need to repeatedly query “best in range up to index i” or “best from index i onward”, precompute arrays like `leftBest` and `rightBest` in linear time.
3. **Sliding window for fixed-length subarray sums** – Always compute sums of all contiguous subarrays of fixed length `k` in `O(n)` using a sliding window, not `O(n*k)`.

**Related problems:** [Best Time to Buy and Sell Stock III](/problem/best-time-to-buy-and-sell-stock-iii), [Sum of Variable Length Subarrays](/problem/sum-of-variable-length-subarrays), [Maximize Y‑Sum by Picking a Triplet of Distinct X‑Values](/problem/maximize-ysum-by-picking-a-triplet-of-distinct-xvalues)
