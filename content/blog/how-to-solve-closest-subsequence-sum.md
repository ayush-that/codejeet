---
title: "How to Solve Closest Subsequence Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Closest Subsequence Sum. Hard difficulty, 43.2% acceptance rate. Topics: Array, Two Pointers, Dynamic Programming, Bit Manipulation, Sorting."
date: "2029-06-20"
category: "dsa-patterns"
tags: ["closest-subsequence-sum", "array", "two-pointers", "dynamic-programming", "hard"]
---

# How to Solve Closest Subsequence Sum

You’re given an array of integers and a target goal. You need to pick a subsequence (any subset of elements, not necessarily contiguous) whose sum is as close as possible to the goal. The challenge is that the array can have up to 40 elements, which makes a brute-force enumeration of all 2⁴⁰ subsets impossible. This problem forces you to think about clever ways to split the problem and search efficiently.

## Visual Walkthrough

Let’s trace through a small example to build intuition. Suppose `nums = [2, 7, 11, 15]` and `goal = 9`.

A naive approach would check every possible subsequence:

- [] → sum = 0, difference = 9
- [2] → 2, difference = 7
- [7] → 7, difference = 2
- [11] → 11, difference = 2
- [15] → 15, difference = 6
- [2, 7] → 9, difference = 0 (perfect match!)
- [2, 11] → 13, difference = 4
- [2, 15] → 17, difference = 8
- [7, 11] → 18, difference = 9
- [7, 15] → 22, difference = 13
- [11, 15] → 26, difference = 17
- [2, 7, 11] → 20, difference = 11
- [2, 7, 15] → 24, difference = 15
- [2, 11, 15] → 28, difference = 19
- [7, 11, 15] → 33, difference = 24
- [2, 7, 11, 15] → 35, difference = 26

The minimum absolute difference is 0 from the subsequence [2, 7]. This brute-force check required examining 16 subsets. For 40 elements, that would be over a trillion subsets — clearly impossible.

The key insight is that we can split the array into two halves, generate all possible subset sums for each half, and then combine them intelligently. For our example, split into `[2, 7]` and `[11, 15]`:

Left half subset sums: [0, 2, 7, 9]
Right half subset sums: [0, 11, 15, 26]

Now, for each sum `left` from the left half, we want to find a `right` from the right half such that `left + right` is closest to `goal = 9`. Instead of checking all combinations (4 × 4 = 16, same as brute force), we can sort the right half sums and use binary search. For each `left`, we look for the value in the right half that makes `left + right` closest to `goal`, which is equivalent to finding the value in the right half closest to `goal - left`.

This “meet-in-the-middle” technique reduces the exponential search space dramatically.

## Brute Force Approach

The brute force solution enumerates all 2ⁿ subsequences using bitmasks or recursion, computes each sum, and tracks the minimum absolute difference from the goal. For an array of length n, this takes O(2ⁿ) time and O(1) extra space (excluding the recursion stack).

Why it’s too slow: With n up to 40, 2⁴⁰ ≈ 1.1 trillion operations is far beyond what’s acceptable in an interview or competition setting. Even for n = 30, it’s over a billion operations. This forces us to find a smarter approach.

<div class="code-group">

```python
# Time: O(2^n) | Space: O(1) ignoring recursion stack
def minAbsDifferenceBrute(nums, goal):
    n = len(nums)
    best_diff = float('inf')

    # Iterate over all bitmasks from 0 to 2^n - 1
    for mask in range(1 << n):
        current_sum = 0
        # For each bit set in the mask, add the corresponding element
        for i in range(n):
            if mask & (1 << i):
                current_sum += nums[i]
        # Update the best difference found
        best_diff = min(best_diff, abs(current_sum - goal))

    return best_diff
```

```javascript
// Time: O(2^n) | Space: O(1)
function minAbsDifferenceBrute(nums, goal) {
  const n = nums.length;
  let bestDiff = Infinity;

  // Iterate over all bitmasks from 0 to 2^n - 1
  for (let mask = 0; mask < 1 << n; mask++) {
    let currentSum = 0;
    // For each bit set in the mask, add the corresponding element
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        currentSum += nums[i];
      }
    }
    // Update the best difference found
    bestDiff = Math.min(bestDiff, Math.abs(currentSum - goal));
  }

  return bestDiff;
}
```

```java
// Time: O(2^n) | Space: O(1)
public int minAbsDifferenceBrute(int[] nums, int goal) {
    int n = nums.length;
    int bestDiff = Integer.MAX_VALUE;

    // Iterate over all bitmasks from 0 to 2^n - 1
    for (int mask = 0; mask < (1 << n); mask++) {
        int currentSum = 0;
        // For each bit set in the mask, add the corresponding element
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                currentSum += nums[i];
            }
        }
        // Update the best difference found
        bestDiff = Math.min(bestDiff, Math.abs(currentSum - goal));
    }

    return bestDiff;
}
```

</div>

## Optimized Approach

The optimal solution uses a technique called “meet-in-the-middle”. Here’s the step-by-step reasoning:

1. **Split the array**: Divide the array into two halves of roughly equal size. If n ≤ 20, we could brute force directly, but for n up to 40, splitting gives us two halves of up to 20 elements each.

2. **Generate all subset sums for each half**: For each half, compute all possible sums of subsequences. There are 2^(n/2) sums per half, which is at most 2²⁰ ≈ 1 million — manageable.

3. **Sort one half’s sums**: Sort the list of sums from the second half to enable binary search.

4. **Combine intelligently**: For each sum `left` from the first half, we want to find a sum `right` from the second half such that `left + right` is as close as possible to `goal`. This is equivalent to finding the value in the sorted second half that is closest to `target = goal - left`. We can use binary search to find the insertion point of `target` in the sorted array, then check the elements at that position and the one before it (if they exist).

5. **Track the minimum difference**: As we check each combination, keep updating the minimum absolute difference found.

The critical insight is that by splitting and using binary search, we reduce the time complexity from O(2ⁿ) to O(2^(n/2) _ log(2^(n/2))) = O(2^(n/2) _ n), which is feasible for n = 40.

## Optimal Solution

<div class="code-group">

```python
# Time: O(2^(n/2) * log(2^(n/2))) = O(2^(n/2) * n)
# Space: O(2^(n/2)) for storing subset sums
def minAbsDifference(nums, goal):
    n = len(nums)

    # Step 1: Split the array into two halves
    left_nums = nums[:n//2]
    right_nums = nums[n//2:]

    # Step 2: Generate all subset sums for the left half
    left_sums = [0]
    for num in left_nums:
        # For each existing sum, create a new sum by adding the current number
        new_sums = [s + num for s in left_sums]
        left_sums.extend(new_sums)

    # Step 3: Generate all subset sums for the right half
    right_sums = [0]
    for num in right_nums:
        new_sums = [s + num for s in right_sums]
        right_sums.extend(new_sums)

    # Step 4: Sort the right sums to enable binary search
    right_sums.sort()

    # Step 5: Initialize the minimum difference with the best from left half alone
    min_diff = min(abs(s - goal) for s in left_sums)

    # Step 6: For each left sum, find the best matching right sum
    for left_sum in left_sums:
        # We want left_sum + right_sum ≈ goal, so right_sum ≈ goal - left_sum
        target = goal - left_sum

        # Binary search to find the insertion point of target in right_sums
        idx = bisect_left(right_sums, target)

        # Check the element at the found index (if it exists)
        if idx < len(right_sums):
            total = left_sum + right_sums[idx]
            min_diff = min(min_diff, abs(total - goal))

        # Check the element just before the found index (if it exists)
        if idx > 0:
            total = left_sum + right_sums[idx - 1]
            min_diff = min(min_diff, abs(total - goal))

    return min_diff

# Note: Import bisect_left from the bisect module
from bisect import bisect_left
```

```javascript
// Time: O(2^(n/2) * log(2^(n/2))) = O(2^(n/2) * n)
// Space: O(2^(n/2)) for storing subset sums
function minAbsDifference(nums, goal) {
  const n = nums.length;

  // Step 1: Split the array into two halves
  const leftNums = nums.slice(0, Math.floor(n / 2));
  const rightNums = nums.slice(Math.floor(n / 2));

  // Helper function to generate all subset sums
  const generateSubsetSums = (arr) => {
    const sums = [0];
    for (const num of arr) {
      const currentLength = sums.length;
      for (let i = 0; i < currentLength; i++) {
        sums.push(sums[i] + num);
      }
    }
    return sums;
  };

  // Step 2: Generate all subset sums for both halves
  const leftSums = generateSubsetSums(leftNums);
  const rightSums = generateSubsetSums(rightNums);

  // Step 3: Sort the right sums to enable binary search
  rightSums.sort((a, b) => a - b);

  // Step 4: Initialize the minimum difference with the best from left half alone
  let minDiff = Math.min(...leftSums.map((s) => Math.abs(s - goal)));

  // Step 5: For each left sum, find the best matching right sum
  for (const leftSum of leftSums) {
    // We want leftSum + rightSum ≈ goal, so rightSum ≈ goal - leftSum
    const target = goal - leftSum;

    // Binary search to find the insertion point of target in rightSums
    let leftIdx = 0,
      rightIdx = rightSums.length - 1;
    while (leftIdx <= rightIdx) {
      const mid = Math.floor((leftIdx + rightIdx) / 2);
      if (rightSums[mid] < target) {
        leftIdx = mid + 1;
      } else {
        rightIdx = mid - 1;
      }
    }

    // leftIdx is the insertion point (first index where rightSums[i] >= target)
    // Check the element at leftIdx (if it exists)
    if (leftIdx < rightSums.length) {
      const total = leftSum + rightSums[leftIdx];
      minDiff = Math.min(minDiff, Math.abs(total - goal));
    }

    // Check the element just before leftIdx (if it exists)
    if (leftIdx > 0) {
      const total = leftSum + rightSums[leftIdx - 1];
      minDiff = Math.min(minDiff, Math.abs(total - goal));
    }
  }

  return minDiff;
}
```

```java
// Time: O(2^(n/2) * log(2^(n/2))) = O(2^(n/2) * n)
// Space: O(2^(n/2)) for storing subset sums
import java.util.*;

public class Solution {
    public int minAbsDifference(int[] nums, int goal) {
        int n = nums.length;

        // Step 1: Split the array into two halves
        int[] leftNums = Arrays.copyOfRange(nums, 0, n / 2);
        int[] rightNums = Arrays.copyOfRange(nums, n / 2, n);

        // Helper function to generate all subset sums
        List<Integer> generateSubsetSums(int[] arr) {
            List<Integer> sums = new ArrayList<>();
            sums.add(0); // The empty subset has sum 0
            for (int num : arr) {
                int currentSize = sums.size();
                for (int i = 0; i < currentSize; i++) {
                    sums.add(sums.get(i) + num);
                }
            }
            return sums;
        }

        // Step 2: Generate all subset sums for both halves
        List<Integer> leftSums = generateSubsetSums(leftNums);
        List<Integer> rightSums = generateSubsetSums(rightNums);

        // Step 3: Sort the right sums to enable binary search
        Collections.sort(rightSums);

        // Step 4: Initialize the minimum difference with the best from left half alone
        int minDiff = Integer.MAX_VALUE;
        for (int leftSum : leftSums) {
            minDiff = Math.min(minDiff, Math.abs(leftSum - goal));
        }

        // Step 5: For each left sum, find the best matching right sum
        for (int leftSum : leftSums) {
            // We want leftSum + rightSum ≈ goal, so rightSum ≈ goal - leftSum
            int target = goal - leftSum;

            // Binary search to find the insertion point of target in rightSums
            int idx = Collections.binarySearch(rightSums, target);
            if (idx < 0) {
                idx = -idx - 1; // Convert to insertion point
            }

            // Check the element at the found index (if it exists)
            if (idx < rightSums.size()) {
                int total = leftSum + rightSums.get(idx);
                minDiff = Math.min(minDiff, Math.abs(total - goal));
            }

            // Check the element just before the found index (if it exists)
            if (idx > 0) {
                int total = leftSum + rightSums.get(idx - 1);
                minDiff = Math.min(minDiff, Math.abs(total - goal));
            }
        }

        return minDiff;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(2^(n/2) _ log(2^(n/2))) = O(2^(n/2) _ n)

- Generating subset sums for each half: O(2^(n/2)) per half
- Sorting the right half sums: O(2^(n/2) \* log(2^(n/2)))
- For each of the 2^(n/2) left sums, we perform a binary search on the right sums: O(log(2^(n/2))) = O(n) per search
- Total: O(2^(n/2) + 2^(n/2) _ log(2^(n/2)) + 2^(n/2) _ log(2^(n/2))) = O(2^(n/2) \* n)

**Space Complexity**: O(2^(n/2))

- We store all subset sums for both halves, each requiring O(2^(n/2)) space
- The recursion stack (if using recursive generation) would add O(n), but our iterative approach uses O(1) extra space beyond the stored sums

For n = 40, 2^(n/2) = 2²⁰ ≈ 1 million operations, which is perfectly feasible.

## Common Mistakes

1. **Forgetting to include the empty subsequence**: The empty subsequence (sum = 0) is always valid. When generating subset sums, you must start with [0]. Missing this can lead to incorrect results when the goal is close to 0.

2. **Not checking both candidates in binary search**: After finding the insertion point `idx` with binary search, you must check both `right_sums[idx]` and `right_sums[idx-1]` (if they exist). The closest value could be on either side of the insertion point.

3. **Incorrect array splitting**: When n is odd, the two halves will have different sizes (floor(n/2) and ceil(n/2)). This is fine, but be careful with index calculations. Using `n//2` in Python or `Math.floor(n/2)` in JavaScript correctly handles both even and odd n.

4. **Not initializing min_diff properly**: You should initialize `min_diff` with the best difference from the left half alone (or right half alone) before combining. Otherwise, you might miss cases where the optimal subsequence comes entirely from one half.

## When You'll See This Pattern

The "meet-in-the-middle" technique appears in problems where the search space is too large for brute force but can be split into two manageable halves. You'll recognize it when:

- The input size is moderate (typically 30-50) making 2ⁿ impossible but 2^(n/2) feasible
- You need to find combinations or subsets that satisfy some condition
- The problem involves partitioning or dividing into groups

Related LeetCode problems:

1. **Partition Array Into Two Arrays to Minimize Sum Difference** (Hard): Very similar — split array, generate subset sums, find the closest to half the total sum.
2. **Minimum Operations to Form Subsequence With Target Sum** (Hard): Uses similar subset sum generation techniques.
3. **Subsets II** (Medium): While simpler, it practices the subset generation pattern.

## Key Takeaways

1. **Meet-in-the-middle is your go-to for n ≈ 40**: When you see an array of size 30-50 and need to check all subsets, think about splitting the array and combining results with binary search or two pointers.

2. **Subset sum generation is a building block**: The pattern of starting with [0] and extending with each new element is worth memorizing. It efficiently generates all 2^k subset sums.

3. **Binary search finds the closest value**: Once you have a sorted array, binary search can find not just exact matches but also the closest values by checking the insertion point and its neighbors.

Related problems: [Minimize the Difference Between Target and Chosen Elements](/problem/minimize-the-difference-between-target-and-chosen-elements), [Partition Array Into Two Arrays to Minimize Sum Difference](/problem/partition-array-into-two-arrays-to-minimize-sum-difference), [Minimum Operations to Form Subsequence With Target Sum](/problem/minimum-operations-to-form-subsequence-with-target-sum)
