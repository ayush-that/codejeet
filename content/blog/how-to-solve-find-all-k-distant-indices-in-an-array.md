---
title: "How to Solve Find All K-Distant Indices in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find All K-Distant Indices in an Array. Easy difficulty, 77.4% acceptance rate. Topics: Array, Two Pointers."
date: "2026-04-12"
category: "dsa-patterns"
tags: ["find-all-k-distant-indices-in-an-array", "array", "two-pointers", "easy"]
---

# How to Solve Find All K-Distant Indices in an Array

At first glance, this problem seems straightforward: find all indices `i` where there's some index `j` within distance `k` containing the `key`. The tricky part is that each `key` index can "cover" multiple positions in the array, and these coverage ranges can overlap. We need to efficiently find all indices that fall within at least one of these coverage intervals without duplicates, sorted in increasing order.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3,4,9,1,3,9,5]`, `key = 9`, `k = 1`.

First, we identify all indices where `nums[j] == key`:

- Index 2: `nums[2] = 9`
- Index 5: `nums[5] = 9`

For each `key` index, we determine which indices `i` satisfy `|i - j| <= k`:

- For `j = 2`: `|i - 2| <= 1` → `i ∈ [1, 3]` (indices 1, 2, 3)
- For `j = 5`: `|i - 5| <= 1` → `i ∈ [4, 6]` (indices 4, 5, 6)

Now we combine these ranges and remove duplicates:

- `[1, 3] ∪ [4, 6] = [1, 2, 3, 4, 5, 6]`

The result is `[1, 2, 3, 4, 5, 6]`. Notice how index 2 appears in both ranges but only appears once in the final answer.

The key insight is that we're essentially finding the union of intervals `[j-k, j+k]` for all `j` where `nums[j] == key`, then collecting all integer indices within that union.

## Brute Force Approach

A naive approach would be to check every index `i` from 0 to `n-1`, and for each `i`, check all indices `j` within `k` distance to see if any contain the `key`. This is straightforward but inefficient:

```python
def brute_force(nums, key, k):
    n = len(nums)
    result = []

    for i in range(n):
        # Check all j within k distance of i
        for j in range(max(0, i-k), min(n, i+k+1)):
            if nums[j] == key:
                result.append(i)
                break  # Found a valid j, no need to check others

    return result
```

**Why this is inefficient:**

- Time complexity: O(n × (2k+1)) = O(nk) in the worst case
- When `k` is large (up to `n-1`), this becomes O(n²)
- We're doing redundant work by repeatedly checking the same `key` indices

The brute force approach works but fails efficiency requirements for large inputs. We need a solution that scales better.

## Optimal Solution

The optimal approach uses a two-pointer technique to efficiently process the array in a single pass. Here's the strategy:

1. **Find all key indices**: First, collect all indices where `nums[j] == key`
2. **Merge intervals**: For each key index `j`, the covered range is `[j-k, j+k]`
3. **Collect all indices**: Traverse through the merged intervals and add all integer indices

However, we can optimize further by processing in one pass:

- Use two pointers: `i` for the current index we're checking, and `key_idx` to track which key index we're currently considering
- For each key index, we add all `i` values from `max(prev_end+1, j-k)` to `min(n-1, j+k)`
- This ensures we don't add duplicates and process each index at most once

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result list
def findKDistantIndices(nums, key, k):
    """
    Find all indices i where there exists at least one index j
    such that |i - j| <= k and nums[j] == key.

    Args:
        nums: List of integers
        key: The target value to find
        k: Maximum distance between i and j

    Returns:
        List of k-distant indices in increasing order
    """
    n = len(nums)
    result = []

    # Step 1: Find all indices where nums equals key
    key_indices = []
    for i in range(n):
        if nums[i] == key:
            key_indices.append(i)

    # Step 2: For each key index, add all indices within distance k
    # We track the last added index to avoid duplicates
    last_added = -1  # Last index added to result

    for j in key_indices:
        # Calculate the range of indices covered by this key index
        start = max(last_added + 1, j - k)  # Start from after last added or j-k
        end = min(n - 1, j + k)            # Don't go beyond array bounds

        # Add all indices in [start, end] to result
        for i in range(start, end + 1):
            result.append(i)
            last_added = i  # Update last added index

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function findKDistantIndices(nums, key, k) {
  /**
   * Find all indices i where there exists at least one index j
   * such that |i - j| <= k and nums[j] == key.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} key - The target value to find
   * @param {number} k - Maximum distance between i and j
   * @return {number[]} - List of k-distant indices in increasing order
   */
  const n = nums.length;
  const result = [];

  // Step 1: Find all indices where nums equals key
  const keyIndices = [];
  for (let i = 0; i < n; i++) {
    if (nums[i] === key) {
      keyIndices.push(i);
    }
  }

  // Step 2: For each key index, add all indices within distance k
  // We track the last added index to avoid duplicates
  let lastAdded = -1; // Last index added to result

  for (const j of keyIndices) {
    // Calculate the range of indices covered by this key index
    const start = Math.max(lastAdded + 1, j - k); // Start from after last added or j-k
    const end = Math.min(n - 1, j + k); // Don't go beyond array bounds

    // Add all indices in [start, end] to result
    for (let i = start; i <= end; i++) {
      result.push(i);
      lastAdded = i; // Update last added index
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result list
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findKDistantIndices(int[] nums, int key, int k) {
        /**
         * Find all indices i where there exists at least one index j
         * such that |i - j| <= k and nums[j] == key.
         *
         * @param nums - Array of integers
         * @param key - The target value to find
         * @param k - Maximum distance between i and j
         * @return List of k-distant indices in increasing order
         */
        int n = nums.length;
        List<Integer> result = new ArrayList<>();

        // Step 1: Find all indices where nums equals key
        List<Integer> keyIndices = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (nums[i] == key) {
                keyIndices.add(i);
            }
        }

        // Step 2: For each key index, add all indices within distance k
        // We track the last added index to avoid duplicates
        int lastAdded = -1;  // Last index added to result

        for (int j : keyIndices) {
            // Calculate the range of indices covered by this key index
            int start = Math.max(lastAdded + 1, j - k);  // Start from after last added or j-k
            int end = Math.min(n - 1, j + k);           // Don't go beyond array bounds

            // Add all indices in [start, end] to result
            for (int i = start; i <= end; i++) {
                result.add(i);
                lastAdded = i;  // Update last added index
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding all key indices: O(n) - we scan the array once
- Adding indices to result: Each index is added at most once, so O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Storing key indices: O(n) in worst case (all elements equal to key)
- Result list: O(n) in worst case (all indices are k-distant)
- Total: O(n) + O(n) = O(n)

The space complexity could be optimized to O(1) extra space (excluding the output) by scanning the array differently, but the O(n) approach is clearer and still efficient.

## Common Mistakes

1. **Forgetting to handle array bounds**: When calculating `j-k` and `j+k`, candidates might forget to clamp these values to `[0, n-1]`. This can lead to index out of bounds errors or incorrect results.

2. **Adding duplicate indices**: When key indices are close together (their coverage ranges overlap), candidates might add the same index multiple times. The `last_added` variable in our solution prevents this by tracking where we left off.

3. **Incorrect range calculation**: The condition is `|i - j| <= k`, which means `i` can be at most `k` away from `j` in either direction. Some candidates mistakenly use `< k` instead of `<= k`, missing boundary indices.

4. **Not sorting the result**: While our approach naturally produces sorted results, some approaches might need explicit sorting. The problem requires the result in increasing order.

## When You'll See This Pattern

This problem uses **interval merging** and **two-pointer traversal**, which appear in many array problems:

1. **Merge Intervals (Medium)**: Similar concept of merging overlapping intervals, though with more complex interval comparison logic.

2. **Insert Interval (Medium)**: Involves finding where a new interval fits within existing sorted intervals, similar to how we process each key index's coverage range.

3. **Summary Ranges (Easy)**: Requires grouping consecutive numbers into ranges, using a similar two-pointer approach to track current ranges.

4. **Shortest Word Distance (Easy)**: Also involves finding distances between indices with specific properties, though with a different distance calculation.

The core pattern is: when you need to process ranges or intervals in a sorted array, consider using a two-pointer approach that moves through the array in a single pass, tracking the current position in both the input and output.

## Key Takeaways

1. **Interval thinking**: Many array distance problems can be reframed as interval problems. Here, each key index creates an interval `[j-k, j+k]`, and we need the union of all such intervals.

2. **Avoid duplicates with tracking**: When merging or combining ranges, keep track of the last processed position to avoid adding the same element multiple times.

3. **Boundary awareness**: Always check array bounds when working with indices that involve arithmetic operations like `j-k` or `j+k`. Use `max(0, ...)` and `min(n-1, ...)` to stay within valid ranges.

4. **Sorted output for free**: By processing the array in order and adding indices as we go, we get sorted output without needing an explicit sort operation.

Related problems: [Two Sum](/problem/two-sum), [Shortest Word Distance](/problem/shortest-word-distance), [Minimum Absolute Difference Between Elements With Constraint](/problem/minimum-absolute-difference-between-elements-with-constraint)
