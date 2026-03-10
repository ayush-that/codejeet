---
title: "How to Solve Find the Median of the Uniqueness Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Median of the Uniqueness Array. Hard difficulty, 29.9% acceptance rate. Topics: Array, Hash Table, Binary Search, Sliding Window."
date: "2026-06-22"
category: "dsa-patterns"
tags: ["find-the-median-of-the-uniqueness-array", "array", "hash-table", "binary-search", "hard"]
---

# How to Solve "Find the Median of the Uniqueness Array"

This problem asks us to find the median of all possible subarray distinct counts. Given an array `nums`, we need to consider every subarray `nums[i..j]`, count how many distinct elements it contains, collect all these counts into an array, sort it, and return its median. What makes this problem challenging is that there are O(n²) subarrays, so we cannot explicitly generate all distinct counts. We need a smarter way to find the median without constructing the entire uniqueness array.

## Visual Walkthrough

Let's walk through a small example: `nums = [1, 2, 1]`.

First, let's list all subarrays and their distinct counts:

- `[1]` → 1 distinct
- `[1, 2]` → 2 distinct
- `[1, 2, 1]` → 2 distinct
- `[2]` → 1 distinct
- `[2, 1]` → 2 distinct
- `[1]` → 1 distinct

The uniqueness array (sorted distinct counts) is: `[1, 1, 1, 2, 2, 2]`
The median is the average of the 3rd and 4th elements: `(1 + 2) / 2 = 1.5`

The key insight: we don't need to generate all these values. Instead, we can use **binary search** on the answer space combined with a **sliding window** to count how many subarrays have ≤ k distinct elements. This transforms the problem from "generate all values" to "count subarrays meeting a condition."

## Brute Force Approach

A naive solution would generate all O(n²) subarrays, count distinct elements for each (using a hash set), collect all counts, sort them, and return the median.

```python
def medianOfUniquenessArray_brute(nums):
    n = len(nums)
    distinct_counts = []

    for i in range(n):
        for j in range(i, n):
            # Count distinct elements in nums[i..j]
            distinct = len(set(nums[i:j+1]))
            distinct_counts.append(distinct)

    distinct_counts.sort()
    m = len(distinct_counts)

    if m % 2 == 1:
        return distinct_counts[m // 2]
    else:
        return (distinct_counts[m // 2 - 1] + distinct_counts[m // 2]) / 2
```

**Why this fails:** With n up to 10⁵, there are ~5×10⁹ subarrays. Generating and processing them is impossible. Even with optimizations, O(n²) is far too slow. We need at most O(n log n) or O(n log C) where C is the range of possible distinct counts (1 to n).

## Optimized Approach

The core optimization uses two techniques:

1. **Binary Search on Answer Space**: The median value must be between 1 and n (the number of distinct elements possible). Instead of finding the median directly, we ask: "Is the median ≤ k?" We can binary search for the smallest k where the number of subarrays with ≤ k distinct elements is at least half of all subarrays.

2. **Sliding Window to Count Subarrays**: For a given k, we need to count how many subarrays have ≤ k distinct elements. This is a classic sliding window problem: expand the right pointer, shrink the left when distinct count > k, and count valid subarrays ending at each right position.

The total number of subarrays is `n*(n+1)/2`. Let `total = n*(n+1)/2`. We want the median, which is the `(total+1)//2`-th smallest value (for 1-based indexing). In our counting approach, we find the smallest k such that the number of subarrays with ≤ k distinct elements is ≥ `(total+1)//2`.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def medianOfUniquenessArray(nums):
    n = len(nums)
    total_subarrays = n * (n + 1) // 2
    # We're looking for the k-th smallest value where k = (total_subarrays + 1) // 2
    # (1-based indexing for median position)
    kth = (total_subarrays + 1) // 2

    # Helper function: count how many subarrays have ≤ max_distinct distinct elements
    def count_subarrays_with_at_most(max_distinct):
        """
        Returns the number of subarrays with at most max_distinct distinct elements.
        Uses sliding window with hash map to track frequencies.
        """
        count = 0
        left = 0
        freq = {}
        distinct = 0

        for right in range(n):
            # Add nums[right] to the window
            freq[nums[right]] = freq.get(nums[right], 0) + 1
            if freq[nums[right]] == 1:
                distinct += 1

            # Shrink window from left while we have too many distinct elements
            while distinct > max_distinct:
                freq[nums[left]] -= 1
                if freq[nums[left]] == 0:
                    distinct -= 1
                left += 1

            # All subarrays ending at 'right' with start from 'left' to 'right' are valid
            # That's (right - left + 1) subarrays
            count += (right - left + 1)

        return count

    # Binary search for the smallest max_distinct such that
    # count_subarrays_with_at_most(max_distinct) >= kth
    low, high = 1, n

    while low < high:
        mid = (low + high) // 2
        count = count_subarrays_with_at_most(mid)

        if count >= kth:
            # median is ≤ mid, so search lower half (including mid)
            high = mid
        else:
            # median is > mid, so search upper half (excluding mid)
            low = mid + 1

    # low is the median value (k-th smallest distinct count)
    median = low

    # Handle even total_subarrays case: median is average of low and low-1?
    # Actually, if total_subarrays is even, median is average of kth and (kth+1)-th values
    # But our binary search found the kth smallest value. We need to check if we need average.
    if total_subarrays % 2 == 0:
        # We have the kth value where k = total_subarrays//2 (since (total+1)//2 when even)
        # Actually with 1-based: positions total/2 and total/2 + 1
        # We found value at position total/2 (since kth = total/2 + 1? Let's recalc)
        # When total is even: kth = total/2 + 1 (1-based)
        # So we have the (total/2 + 1)-th value, need the total/2-th value too
        k1 = total_subarrays // 2  # the position before kth
        # Count how many subarrays have ≤ (median-1) distinct
        count_before = count_subarrays_with_at_most(median - 1)
        if count_before >= k1:
            # The k1-th value is also median (same as kth value)
            return median
        else:
            # The k1-th value is median-1
            return (median - 1 + median) / 2
    else:
        return median
```

```javascript
// Time: O(n log n) | Space: O(n)
function medianOfUniquenessArray(nums) {
  const n = nums.length;
  const totalSubarrays = (n * (n + 1)) / 2;
  // kth is the position of median in 1-based indexing
  const kth = Math.floor((totalSubarrays + 1) / 2);

  // Helper: count subarrays with at most maxDistinct distinct elements
  function countSubarraysWithAtMost(maxDistinct) {
    let count = 0;
    let left = 0;
    const freq = new Map();
    let distinct = 0;

    for (let right = 0; right < n; right++) {
      // Add nums[right] to window
      const rightNum = nums[right];
      freq.set(rightNum, (freq.get(rightNum) || 0) + 1);
      if (freq.get(rightNum) === 1) {
        distinct++;
      }

      // Shrink window while we have too many distinct elements
      while (distinct > maxDistinct) {
        const leftNum = nums[left];
        freq.set(leftNum, freq.get(leftNum) - 1);
        if (freq.get(leftNum) === 0) {
          distinct--;
        }
        left++;
      }

      // All subarrays ending at 'right' with start in [left, right] are valid
      count += right - left + 1;
    }

    return count;
  }

  // Binary search for the median value
  let low = 1,
    high = n;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const count = countSubarraysWithAtMost(mid);

    if (count >= kth) {
      // Median is ≤ mid
      high = mid;
    } else {
      // Median is > mid
      low = mid + 1;
    }
  }

  const median = low;

  // Handle even number of subarrays case
  if (totalSubarrays % 2 === 0) {
    const k1 = totalSubarrays / 2; // the position before kth
    const countBefore = countSubarraysWithAtMost(median - 1);

    if (countBefore >= k1) {
      // The k1-th value is also 'median'
      return median;
    } else {
      // The k1-th value is 'median - 1'
      return (median - 1 + median) / 2;
    }
  } else {
    return median;
  }
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public double medianOfUniquenessArray(int[] nums) {
        int n = nums.length;
        long totalSubarrays = (long) n * (n + 1) / 2;
        // kth is the position of median in 1-based indexing
        long kth = (totalSubarrays + 1) / 2;

        // Helper function to count subarrays with at most maxDistinct distinct elements
        long countSubarraysWithAtMost(int maxDistinct) {
            long count = 0;
            int left = 0;
            Map<Integer, Integer> freq = new HashMap<>();
            int distinct = 0;

            for (int right = 0; right < n; right++) {
                // Add nums[right] to window
                int rightNum = nums[right];
                freq.put(rightNum, freq.getOrDefault(rightNum, 0) + 1);
                if (freq.get(rightNum) == 1) {
                    distinct++;
                }

                // Shrink window while we have too many distinct elements
                while (distinct > maxDistinct) {
                    int leftNum = nums[left];
                    freq.put(leftNum, freq.get(leftNum) - 1);
                    if (freq.get(leftNum) == 0) {
                        distinct--;
                    }
                    left++;
                }

                // All subarrays ending at 'right' with start in [left, right] are valid
                count += (right - left + 1);
            }

            return count;
        }

        // Binary search for the median value
        int low = 1, high = n;

        while (low < high) {
            int mid = low + (high - low) / 2;
            long count = countSubarraysWithAtMost(mid);

            if (count >= kth) {
                // Median is ≤ mid
                high = mid;
            } else {
                // Median is > mid
                low = mid + 1;
            }
        }

        int median = low;

        // Handle even number of subarrays case
        if (totalSubarrays % 2 == 0) {
            long k1 = totalSubarrays / 2; // the position before kth
            long countBefore = countSubarraysWithAtMost(median - 1);

            if (countBefore >= k1) {
                // The k1-th value is also 'median'
                return median;
            } else {
                // The k1-th value is 'median - 1'
                return (median - 1 + median) / 2.0;
            }
        } else {
            return median;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Binary search runs O(log n) iterations (search space is 1 to n)
- Each iteration calls `count_subarrays_with_at_most()` which uses sliding window: O(n) time
- Total: O(n log n)

**Space Complexity:** O(n)

- The frequency hash map stores at most n distinct elements
- Other variables use O(1) space

The log n factor comes from binary search, and the n factor comes from the sliding window pass. This is efficient enough for n ≤ 10⁵.

## Common Mistakes

1. **Forgetting to handle even vs odd total subarrays**: When the total number of subarrays is even, the median is the average of two middle values. Candidates often return just the k-th value without checking if an average is needed.

2. **Incorrect binary search bounds**: Using `while low <= high` instead of `while low < high` can cause infinite loops. The pattern `while low < high` with `high = mid` and `low = mid + 1` is standard for "find first true" binary search.

3. **Off-by-one in counting valid subarrays**: When counting subarrays with ≤ k distinct, for each right pointer, the number of valid subarrays ending at `right` is `(right - left + 1)`, not `(right - left)`. This counts all subarrays starting from `left` to `right`.

4. **Not using long/int64 for large counts**: With n=10⁵, total subarrays is ~5×10⁹, which exceeds 32-bit integer range. Use 64-bit integers (long in Java/JavaScript, int in Python handles big integers).

## When You'll See This Pattern

This "binary search on answer + sliding window counting" pattern appears in several hard problems:

1. **Find K-th Smallest Pair Distance (LeetCode 719)**: Binary search on distance, use sliding window to count pairs with distance ≤ mid.

2. **K-th Smallest Subarray Sum (LeetCode 1918)**: Binary search on sum, use sliding window to count subarrays with sum ≤ mid.

3. **Total Appeal of A String (LeetCode 2262)**: Similar concept of counting contributions of subarrays based on distinct characters.

The pattern is: when you need to find a percentile/rank in a huge implicit array, binary search on the value space and count how many elements satisfy a condition using an efficient method (often sliding window or two pointers).

## Key Takeaways

1. **Transform ranking problems to counting problems**: Instead of finding the k-th smallest value directly, ask "how many values are ≤ x?" and binary search for the smallest x where count ≥ k.

2. **Sliding window efficiently counts subarrays with constraints**: When you need to count subarrays satisfying a condition on distinct elements/sum/etc., sliding window with hash map is often O(n).

3. **Watch for parity in median calculations**: For even-sized lists, the median is the average of two middle values, which may require an extra counting step.

Related problems: [Find K-th Smallest Pair Distance](/problem/find-k-th-smallest-pair-distance), [Total Appeal of A String](/problem/total-appeal-of-a-string)
