---
title: "How to Solve Minimum Operations to Make Median of Array Equal to K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Median of Array Equal to K. Medium difficulty, 47.7% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2029-04-21"
category: "dsa-patterns"
tags:
  ["minimum-operations-to-make-median-of-array-equal-to-k", "array", "greedy", "sorting", "medium"]
---

# How to Solve Minimum Operations to Make Median of Array Equal to K

You're given an array of integers and a target value `k`. You can increase or decrease any element by 1 in a single operation. Your goal is to make the median of the array equal to `k` using the minimum number of operations. The tricky part is that the median's position depends on whether the array has an odd or even length, and you need to efficiently determine which elements to modify.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider `nums = [1, 3, 5, 7, 9]` with `k = 6`. The array is already sorted: `[1, 3, 5, 7, 9]`.

**Step 1: Sort the array** (if not already sorted). This gives us `[1, 3, 5, 7, 9]`.

**Step 2: Identify the median position**. Since the array has 5 elements (odd length), the median is at index `n//2 = 5//2 = 2`, which is the value `5`.

**Step 3: Determine which elements need changing**. For the median to be `k=6`, the middle element must be at least `6`. But we also need to consider that elements to the left of the median should be ≤ `k`, and elements to the right should be ≥ `k` (to maintain the median property after modifications).

**Step 4: Calculate operations**:

- Element at index 2 (current value 5): needs to be at least 6 → `max(0, 6-5) = 1` operation
- Element at index 3 (value 7): already ≥ 6 → no change needed
- Element at index 4 (value 9): already ≥ 6 → no change needed
- Elements at indices 0 and 1 (values 1 and 3): These are to the left of the median. They can be ≤ 6, which they already are, so no operations needed.

Wait, that's not quite right! Let's think more carefully. If we only change the median element to 6, we get `[1, 3, 6, 7, 9]`. The median is indeed 6. But is this optimal? Let's check: total operations = 1.

Actually, we need to consider that for the median to be exactly `k`, ALL elements at or after the median position must be ≥ `k`, and elements before the median must be ≤ `k`. Why? Because if any element after the median is less than `k`, then after sorting, `k` might not be at the median position. Similarly, if any element before the median is greater than `k`, it could displace `k` from the median position.

So for our example:

- Elements at indices 0,1 (left side): must be ≤ 6 (they are: 1, 3)
- Elements at indices 2,3,4 (median and right side): must be ≥ 6
  - Index 2: 5 → needs 1 operation to reach 6
  - Index 3: 7 → already ≥ 6
  - Index 4: 9 → already ≥ 6

Total operations = 1. Good!

Let's try another example: `nums = [1, 2, 3, 4, 5, 6]` with `k = 4`. This has even length (n=6).

**Step 1: Sort**: Already sorted `[1, 2, 3, 4, 5, 6]`

**Step 2: Median position**: For even length, median is the average of the two middle elements at indices `n//2 - 1 = 2` and `n//2 = 3`. Values are 3 and 4, average = 3.5.

**Step 3: Determine requirements**: To make median = 4, we need BOTH middle elements to be at least 4? Actually, if we want the median to be exactly 4 (not just average to 4), we need to think differently. For the median to be `k` in an even-length array, the left middle element must be ≤ `k` and the right middle element must be ≥ `k`, but their average needs to equal `k`. The most efficient way is to make both equal to `k`.

Actually, let's think: After modifications, when we sort the array, the element at position `n//2` must be `k`. For even `n`, the median is defined as the middle element (some definitions use average of two middle elements, but in this problem, based on examples, it's the single middle element at index `n//2` for 0-based indexing after sorting).

So for `n=6`, median position is index `3` (0-based). We need `nums[3] = 4`. Also:

- Elements at indices 0,1,2 must be ≤ 4
- Elements at indices 3,4,5 must be ≥ 4

Check our array `[1, 2, 3, 4, 5, 6]`:

- Indices 0,1,2: 1,2,3 are all ≤ 4 ✓
- Indices 3,4,5: 4,5,6 are all ≥ 4 ✓
- Index 3 already equals 4 ✓

So 0 operations needed!

## Brute Force Approach

A naive approach might try all possible modifications to reach the target median. We could:

1. Sort the array
2. Try changing different combinations of elements
3. For each combination, check if median equals `k`
4. Track the minimum operations

The problem is the search space is enormous. For an array of length `n`, each element could be changed to any integer value, giving us infinite possibilities. Even if we bound the changes (say between some min and max), the complexity would be exponential.

Another brute force idea: Try making each element the median by adjusting others. For each element `nums[i]`, calculate operations to make it equal to `k` and ensure all elements to the left are ≤ `k` and all to the right are ≥ `k`. This is O(n²) since for each candidate median position, we might need to check/update all other elements.

Both approaches are too slow for typical constraints (n up to 10^5).

## Optimized Approach

The key insight is that **after sorting**, the median is fixed at position `n//2` (for 0-based indexing). To make the median equal to `k`:

1. **Elements before the median** (indices < `n//2`) must be ≤ `k`. If any is > `k`, we must decrease it to `k`.
2. **The median element** (at index `n//2`) must equal `k`. If it's < `k`, increase it; if > `k`, decrease it.
3. **Elements after the median** (indices > `n//2`) must be ≥ `k`. If any is < `k`, we must increase it to `k`.

Why this works: After we make these changes, when we sort the array (which is already sorted except our modifications might break sorting), the element at position `n//2` will be `k`. Actually, our modifications maintain the sorted order because:

- We only decrease elements on the left side (if they're > `k`)
- We only increase elements on the right side (if they're < `k`)
- The median itself becomes exactly `k`

So the array remains sorted, and `k` is at the median position.

The algorithm:

1. Sort the array
2. Initialize `operations = 0`
3. For each element at index `i`:
   - If `i < n//2` and `nums[i] > k`: operations += `nums[i] - k`
   - If `i == n//2`: operations += `abs(nums[i] - k)`
   - If `i > n//2` and `nums[i] < k`: operations += `k - nums[i]`
4. Return `operations`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(1) if we sort in-place, O(n) if not
def minOperations(nums, k):
    """
    Calculate minimum operations to make median equal to k.

    Args:
        nums: List[int] - input array
        k: int - target median value

    Returns:
        int - minimum number of +1/-1 operations needed
    """
    # Step 1: Sort the array to identify median position
    nums.sort()
    n = len(nums)
    median_idx = n // 2  # 0-based index of median element
    operations = 0

    # Step 2: Process elements before median
    # They must be <= k. If any > k, decrease to k
    for i in range(median_idx):
        if nums[i] > k:
            operations += nums[i] - k

    # Step 3: Process median element
    # It must equal exactly k
    operations += abs(nums[median_idx] - k)

    # Step 4: Process elements after median
    # They must be >= k. If any < k, increase to k
    for i in range(median_idx + 1, n):
        if nums[i] < k:
            operations += k - nums[i]

    return operations
```

```javascript
// Time: O(n log n) for sorting | Space: O(1) if sort in-place, O(n) if not
/**
 * Calculate minimum operations to make median equal to k.
 *
 * @param {number[]} nums - input array
 * @param {number} k - target median value
 * @return {number} - minimum number of +1/-1 operations needed
 */
function minOperations(nums, k) {
  // Step 1: Sort the array to identify median position
  nums.sort((a, b) => a - b); // Numeric sort
  const n = nums.length;
  const medianIdx = Math.floor(n / 2); // 0-based index of median element
  let operations = 0;

  // Step 2: Process elements before median
  // They must be <= k. If any > k, decrease to k
  for (let i = 0; i < medianIdx; i++) {
    if (nums[i] > k) {
      operations += nums[i] - k;
    }
  }

  // Step 3: Process median element
  // It must equal exactly k
  operations += Math.abs(nums[medianIdx] - k);

  // Step 4: Process elements after median
  // They must be >= k. If any < k, increase to k
  for (let i = medianIdx + 1; i < n; i++) {
    if (nums[i] < k) {
      operations += k - nums[i];
    }
  }

  return operations;
}
```

```java
// Time: O(n log n) for sorting | Space: O(1) if sort in-place, O(n) if not
import java.util.Arrays;

class Solution {
    /**
     * Calculate minimum operations to make median equal to k.
     *
     * @param nums - input array
     * @param k - target median value
     * @return minimum number of +1/-1 operations needed
     */
    public long minOperations(int[] nums, int k) {
        // Step 1: Sort the array to identify median position
        Arrays.sort(nums);
        int n = nums.length;
        int medianIdx = n / 2; // 0-based index of median element
        long operations = 0; // Use long to avoid overflow for large inputs

        // Step 2: Process elements before median
        // They must be <= k. If any > k, decrease to k
        for (int i = 0; i < medianIdx; i++) {
            if (nums[i] > k) {
                operations += (long) nums[i] - k;
            }
        }

        // Step 3: Process median element
        // It must equal exactly k
        operations += Math.abs((long) nums[medianIdx] - k);

        // Step 4: Process elements after median
        // They must be >= k. If any < k, increase to k
        for (int i = medianIdx + 1; i < n; i++) {
            if (nums[i] < k) {
                operations += (long) k - nums[i];
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Dominated by the sorting step which takes O(n log n) time
- The three passes through the array (before median, median, after median) each take O(n) time
- Overall: O(n log n) + O(n) = O(n log n)

**Space Complexity:** O(1) or O(n)

- If we can sort the input array in-place: O(1) additional space
- If we need to create a copy to avoid modifying input: O(n) space
- The algorithm itself uses only a few variables (operations counter, indices)

## Common Mistakes

1. **Not sorting the array first**: The median depends on the sorted order. If you try to work with the unsorted array, you'll get incorrect results because you don't know which element will end up at the median position.

2. **Incorrect median index calculation**: For 0-based indexing, the median is at index `n//2`. Some candidates use `(n-1)//2` or `n//2 - 1`. Test with both odd and even lengths to verify.

3. **Wrong inequality directions**:
   - Elements before median must be ≤ k (not < k)
   - Elements after median must be ≥ k (not > k)
   - If you use strict inequalities, you might make unnecessary operations.

4. **Integer overflow**: When n is large (up to 10^5) and values are large (up to 10^9), the total operations could exceed 32-bit integer range. Use 64-bit integers (long in Java, no issue in Python).

5. **Forgetting absolute value for median element**: The median element itself needs `abs(nums[median_idx] - k)` operations, not just one-directional change.

## When You'll See This Pattern

This problem uses a **greedy approach with sorting**. The pattern appears in problems where:

- You need to make elements satisfy positional constraints
- Operations have uniform cost
- The optimal solution involves processing elements in sorted order

Related problems:

1. **Minimum Moves to Equal Array Elements II** (LeetCode 462): Very similar! Instead of making median equal to k, you make all elements equal with minimum moves. The optimal target is the median.
2. **Minimum Operations to Reduce X to Zero** (LeetCode 1658): Different problem but uses similar prefix-sum thinking.
3. **Minimum Number of Operations to Make Array Continuous** (LeetCode 2009): Also involves sorting and adjusting elements to fit constraints.

The core technique: **Sort, then apply greedy rules based on positions**. Many "minimum operations" problems become tractable after sorting because it reveals structural properties.

## Key Takeaways

1. **Sorting reveals structure**: When a problem involves order statistics (median, percentiles, etc.), sorting is often the first step. It transforms a positional problem into an index-based one.

2. **Greedy works for uniform costs**: When each operation has the same cost (like +1/-1 here), greedy approaches that make locally optimal choices often yield globally optimal solutions.

3. **Think about constraints propagation**: Making the median equal to k imposes constraints on other elements. Elements before must be ≤ k, elements after must be ≥ k. This "ripple effect" is common in order-based problems.

4. **Test with both even and odd lengths**: Median problems often have edge cases depending on array length parity. Always test both.

Related problems: [Find Median from Data Stream](/problem/find-median-from-data-stream), [Sliding Window Median](/problem/sliding-window-median)
