---
title: "How to Solve Range Sum of Sorted Subarray Sums — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Range Sum of Sorted Subarray Sums. Medium difficulty, 63.1% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting, Prefix Sum."
date: "2026-03-08"
category: "dsa-patterns"
tags: ["range-sum-of-sorted-subarray-sums", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Range Sum of Sorted Subarray Sums

You're given an array of positive integers and need to compute the sum of all contiguous subarray sums between two indices after sorting them. The challenge is that generating all subarray sums explicitly would create O(n²) elements, which is too large for constraints where n can be up to 10³ (creating ~500,000 sums). This problem tests your ability to work with sorted sequences without materializing them all.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`, `left = 1`, `right = 3`.

First, let's generate all contiguous subarrays and their sums:

- [1] = 1
- [2] = 2
- [3] = 3
- [1, 2] = 3
- [2, 3] = 5
- [1, 2, 3] = 6

Now sort these sums in non-decreasing order: [1, 2, 3, 3, 5, 6]

We need the sum from index `left = 1` to `right = 3` (0-indexed): elements at indices 1, 2, 3 are 2, 3, 3. Their sum is 8.

The key insight: we can't actually generate all these sums for large n. We need a way to count how many subarray sums are ≤ a given value without listing them all.

## Brute Force Approach

The straightforward approach is to:

1. Generate all O(n²) subarray sums using nested loops
2. Sort them (O(n² log n²) time)
3. Sum elements from `left` to `right`

<div class="code-group">

```python
# Time: O(n² log n) | Space: O(n²)
def rangeSum_brute(nums, left, right):
    n = len(nums)
    subarray_sums = []

    # Generate all subarray sums
    for i in range(n):
        current_sum = 0
        for j in range(i, n):
            current_sum += nums[j]
            subarray_sums.append(current_sum)

    # Sort all sums
    subarray_sums.sort()

    # Sum from left-1 to right-1 (convert to 0-indexed)
    total = 0
    for i in range(left-1, right):
        total += subarray_sums[i]

    return total
```

```javascript
// Time: O(n² log n) | Space: O(n²)
function rangeSumBrute(nums, left, right) {
  const n = nums.length;
  const subarraySums = [];

  // Generate all subarray sums
  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    for (let j = i; j < n; j++) {
      currentSum += nums[j];
      subarraySums.push(currentSum);
    }
  }

  // Sort all sums
  subarraySums.sort((a, b) => a - b);

  // Sum from left-1 to right-1 (convert to 0-indexed)
  let total = 0;
  for (let i = left - 1; i < right; i++) {
    total += subarraySums[i];
  }

  return total;
}
```

```java
// Time: O(n² log n) | Space: O(n²)
public int rangeSumBrute(int[] nums, int left, int right) {
    int n = nums.length;
    List<Integer> subarraySums = new ArrayList<>();

    // Generate all subarray sums
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        for (int j = i; j < n; j++) {
            currentSum += nums[j];
            subarraySums.add(currentSum);
        }
    }

    // Sort all sums
    Collections.sort(subarraySums);

    // Sum from left-1 to right-1 (convert to 0-indexed)
    int total = 0;
    for (int i = left - 1; i < right; i++) {
        total += subarraySums.get(i);
    }

    return total;
}
```

</div>

**Why this fails:** For n = 1000, we'd generate ~500,000 sums, requiring ~2MB of memory just to store them (assuming 4 bytes per integer). The sorting would take O(500,000 log 500,000) operations, which is too slow. We need a solution that works in O(n²) time without the log factor.

## Optimized Approach

The key insight is that we can use **binary search** on the answer space combined with a **sliding window** to count subarray sums ≤ a given value.

Here's the step-by-step reasoning:

1. **Binary Search on the k-th smallest sum**: We want to find the k-th smallest subarray sum. If we can do this, we can find the sum of all sums from left to right by calculating `sum(first right sums) - sum(first (left-1) sums)`.

2. **Counting subarray sums ≤ target**: Given a target value, we need to count how many subarray sums are ≤ target. Since all numbers are positive, we can use a sliding window:
   - For each starting index `i`, find the largest `j` such that `sum(nums[i..j]) ≤ target`
   - The number of valid subarrays starting at `i` is `(j - i + 1)`
   - Sum these counts for all starting indices

3. **Finding the k-th smallest sum**: Use binary search between `min(nums)` and `sum(nums)` to find the smallest value where the count of sums ≤ value is at least k.

4. **Calculating sum of first k sums**: We need more than just the k-th value - we need the sum of all sums ≤ the k-th value. We can modify our counting function to also sum the valid subarray sums.

## Optimal Solution

We'll implement a solution with:

1. A helper function that counts subarray sums ≤ target AND sums them
2. Binary search to find the value where count reaches k
3. Calculate the final answer using prefix sums of the binary search results

<div class="code-group">

```python
# Time: O(n² log S) where S is sum(nums) | Space: O(1)
def rangeSum(nums, left, right):
    MOD = 10**9 + 7

    def count_and_sum(limit):
        """Return (count, total_sum) of subarray sums <= limit"""
        count = 0
        total_sum = 0
        n = len(nums)

        # Use sliding window for each starting position
        for start in range(n):
            current_sum = 0
            # For fixed start, find all ends where sum <= limit
            for end in range(start, n):
                current_sum += nums[end]
                if current_sum > limit:
                    break
                count += 1
                total_sum += current_sum

        return count, total_sum

    def kth_value_and_sum(k):
        """Find the k-th smallest sum and sum of all sums <= k-th sum"""
        low, high = min(nums), sum(nums)

        while low < high:
            mid = (low + high) // 2
            count, _ = count_and_sum(mid)

            if count < k:
                low = mid + 1
            else:
                high = mid

        # Now low is the k-th smallest sum
        count, total_sum = count_and_sum(low)
        return low, total_sum

    # Get sum of first (right) sums
    _, sum_right = kth_value_and_sum(right)

    # Get sum of first (left-1) sums
    if left == 1:
        return sum_right % MOD
    else:
        _, sum_left_minus_1 = kth_value_and_sum(left - 1)
        return (sum_right - sum_left_minus_1) % MOD
```

```javascript
// Time: O(n² log S) where S is sum(nums) | Space: O(1)
function rangeSum(nums, left, right) {
  const MOD = 10 ** 9 + 7;

  function countAndSum(limit) {
    // Return [count, totalSum] of subarray sums <= limit
    let count = 0;
    let totalSum = 0;
    const n = nums.length;

    // Use sliding window for each starting position
    for (let start = 0; start < n; start++) {
      let currentSum = 0;
      // For fixed start, find all ends where sum <= limit
      for (let end = start; end < n; end++) {
        currentSum += nums[end];
        if (currentSum > limit) break;
        count++;
        totalSum += currentSum;
      }
    }

    return [count, totalSum];
  }

  function kthValueAndSum(k) {
    // Find the k-th smallest sum and sum of all sums <= k-th sum
    let low = Math.min(...nums);
    let high = nums.reduce((a, b) => a + b, 0);

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const [count] = countAndSum(mid);

      if (count < k) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    // Now low is the k-th smallest sum
    const [count, totalSum] = countAndSum(low);
    return [low, totalSum];
  }

  // Get sum of first (right) sums
  const [, sumRight] = kthValueAndSum(right);

  // Get sum of first (left-1) sums
  if (left === 1) {
    return sumRight % MOD;
  } else {
    const [, sumLeftMinus1] = kthValueAndSum(left - 1);
    return (sumRight - sumLeftMinus1) % MOD;
  }
}
```

```java
// Time: O(n² log S) where S is sum(nums) | Space: O(1)
public int rangeSum(int[] nums, int left, int right) {
    final int MOD = 1000000007;

    // Helper class to return both count and sum
    class Pair {
        long count;
        long sum;
        Pair(long c, long s) { count = c; sum = s; }
    }

    Pair countAndSum(int limit) {
        // Return count and sum of subarray sums <= limit
        long count = 0;
        long totalSum = 0;
        int n = nums.length;

        // Use sliding window for each starting position
        for (int start = 0; start < n; start++) {
            int currentSum = 0;
            // For fixed start, find all ends where sum <= limit
            for (int end = start; end < n; end++) {
                currentSum += nums[end];
                if (currentSum > limit) break;
                count++;
                totalSum += currentSum;
            }
        }

        return new Pair(count, totalSum);
    }

    Pair kthValueAndSum(int k) {
        // Find the k-th smallest sum and sum of all sums <= k-th sum
        int low = Integer.MAX_VALUE;
        int high = 0;
        for (int num : nums) {
            low = Math.min(low, num);
            high += num;
        }

        while (low < high) {
            int mid = low + (high - low) / 2;
            Pair result = countAndSum(mid);

            if (result.count < k) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        // Now low is the k-th smallest sum
        return countAndSum(low);
    }

    // Get sum of first (right) sums
    Pair rightResult = kthValueAndSum(right);
    long sumRight = rightResult.sum;

    // Get sum of first (left-1) sums
    if (left == 1) {
        return (int)(sumRight % MOD);
    } else {
        Pair leftResult = kthValueAndSum(left - 1);
        long sumLeftMinus1 = leftResult.sum;
        return (int)((sumRight - sumLeftMinus1) % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² log S) where n is the length of nums and S is the sum of all elements.

- The `count_and_sum` function runs in O(n²) time because for each starting index, we potentially iterate through all ending indices.
- We perform binary search over the range [min(nums), sum(nums)], which takes O(log S) iterations.
- Each binary search iteration calls `count_and_sum`, giving us O(n² log S) total.

**Space Complexity:** O(1) auxiliary space. We only use a few variables for counting and summing.

This is efficient because:

- For n = 1000, n² = 1,000,000 operations
- S ≤ n × max(nums) ≤ 1000 × 10⁵ = 10⁸, so log S ≈ 27
- Total operations ≈ 27 million, which is acceptable

## Common Mistakes

1. **Forgetting that left and right are 1-indexed**: The problem states indices are 1-based, but many candidates use 0-based indexing without adjustment. Always convert: sum elements from `left-1` to `right-1` in 0-based indexing.

2. **Not handling the modulo correctly at the end**: The result needs to be modulo 10⁹+7. A common mistake is applying modulo only at the end instead of during intermediate calculations, which can cause overflow in languages like Java.

3. **Incorrect binary search bounds**: Using 0 as the lower bound instead of `min(nums)`. Since all numbers are positive, the smallest subarray sum is the smallest element, not 0.

4. **Off-by-one in counting function**: When counting subarrays with sum ≤ limit, remember to include the subarray itself. If `sum(nums[i..j]) ≤ limit`, then there are `(j-i+1)` valid subarrays starting at i (from i to j inclusive).

## When You'll See This Pattern

This "k-th smallest in sorted sequence without materializing" pattern appears in several problems:

1. **Kth Smallest Element in a Sorted Matrix (LeetCode 378)**: Find the k-th smallest element in a matrix where rows and columns are sorted. Similar binary search approach with a counting function.

2. **Find K-th Smallest Pair Distance (LeetCode 719)**: Find the k-th smallest distance among all pairs. Uses binary search on the answer space with a sliding window to count pairs.

3. **Kth Smallest Number in Multiplication Table (LeetCode 668)**: Find the k-th smallest number in a multiplication table. Same pattern of binary search with counting.

The common theme: when you need to find the k-th smallest element in a implicitly defined sorted sequence that's too large to generate, use binary search on the answer space with a counting function.

## Key Takeaways

1. **Binary search on answer space**: When asked for the k-th smallest/largest element in a sorted sequence that's expensive to generate, consider binary searching for the answer and using a verification function.

2. **Sliding window for positive arrays**: When all numbers are positive, you can use a sliding window to count subarrays with sum ≤ target in O(n) time instead of O(n²).

3. **Convert range sum to prefix sums**: The sum from left to right equals `sum(first right) - sum(first (left-1))`. This lets us reuse the same k-th smallest finding logic.

[Practice this problem on CodeJeet](/problem/range-sum-of-sorted-subarray-sums)
