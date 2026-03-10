---
title: "How to Solve Count Subarrays With Median K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Subarrays With Median K. Hard difficulty, 47.7% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2029-12-02"
category: "dsa-patterns"
tags: ["count-subarrays-with-median-k", "array", "hash-table", "prefix-sum", "hard"]
---

# How to Solve Count Subarrays With Median K

This problem asks us to count all non-empty subarrays where the median equals a given integer `k`. The array contains distinct integers from 1 to `n`, and `k` is guaranteed to be present. The challenge lies in efficiently checking median conditions across all possible subarrays without actually sorting each one.

What makes this problem tricky: The median depends on the sorted order, but we can't afford to sort every subarray. The key insight is transforming the problem into a prefix sum counting problem by representing numbers relative to `k`.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 2, 1, 4, 5]`, `k = 4`

First, note that `k=4` appears at index 3 (0-based). For a subarray to have median `k`:

1. `k` must be in the subarray
2. After sorting, `k` must be in the middle position

For odd-length subarrays: `k` must have equal numbers of elements less than `k` and greater than `k` on each side.
For even-length subarrays: `k` must have one more element less than `k` than elements greater than `k`.

Let's transform our thinking: For any number `x` in `nums`:

- If `x > k`, mark it as `+1`
- If `x < k`, mark it as `-1`
- If `x == k`, mark it as `0`

Our array becomes: `[-1, -1, -1, 0, 1]`

Now the condition becomes: For a subarray containing `k` (the 0), the sum of transformed values should be either:

- `0` (for odd-length subarrays where `k` is exactly in the middle)
- `1` (for even-length subarrays where `k` is the right-middle element)

Let's check a valid subarray: `[1, 4, 5]` → transformed: `[-1, 0, 1]` → sum = 0 ✓
Another: `[2, 1, 4]` → transformed: `[-1, -1, 0]` → sum = -2 ✗ (not valid)
Another: `[4, 5]` → transformed: `[0, 1]` → sum = 1 ✓

The problem reduces to: Count subarrays containing `k` where the sum of transformed values is 0 or 1.

## Brute Force Approach

A naive solution would check every possible subarray:

1. Generate all O(n²) subarrays
2. For each subarray, check if it contains `k`
3. If yes, sort it and check if the median equals `k`
4. Count valid subarrays

This approach has O(n³ log n) time complexity (O(n²) subarrays × O(n log n) sorting each). Even with optimizations, we can't get below O(n²) by brute force, which is too slow for n up to 10⁵.

The brute force fails because:

- Sorting each subarray is expensive
- We're recomputing the same information repeatedly
- We need a way to check median conditions without sorting

## Optimized Approach

The key insight is the transformation described in the visual walkthrough. After transforming numbers relative to `k`, we can use prefix sums to efficiently check conditions.

**Step-by-step reasoning:**

1. **Transform the array**: Create a new array where:
   - Numbers > k become +1
   - Numbers < k become -1
   - k itself becomes 0

2. **Find k's position**: Locate where k appears in the original array

3. **Use prefix sums**: For any subarray containing k, we can express its sum as:

   ```
   sum = prefix[right] - prefix[left-1]
   ```

   where `left` and `right` are the subarray boundaries

4. **Split into left and right parts**: Consider subarrays that include k at position `pos`:
   - Left part: elements from some index `i` to `pos-1`
   - Right part: elements from `pos` to some index `j`

   The total sum = (sum of left part) + (sum of right part)

5. **Count valid combinations**: We need to count pairs (left_sum, right_sum) where:
   - `left_sum + right_sum = 0` (odd-length subarrays)
   - `left_sum + right_sum = 1` (even-length subarrays)

6. **Use hash map for efficiency**: Instead of checking all O(n²) combinations, we can:
   - Precompute all possible left sums and their frequencies
   - For each right sum, check how many left sums make valid totals

## Optimal Solution

The solution uses prefix sums with a hash map to count valid subarrays in O(n) time:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countSubarrays(nums, k):
    """
    Count subarrays with median equal to k.

    Approach:
    1. Transform array: >k -> +1, <k -> -1, k -> 0
    2. Use prefix sums and hash map to count valid subarrays
    3. Handle both odd and even length subarrays
    """
    n = len(nums)

    # Step 1: Find position of k
    pos = -1
    for i in range(n):
        if nums[i] == k:
            pos = i
            break

    # Step 2: Initialize prefix sum and count map
    # We'll use a map to count frequencies of prefix sums
    count_map = {0: 1}  # Start with prefix sum 0 appearing once
    prefix_sum = 0
    result = 0

    # Step 3: Process elements to the left of k
    # For elements before k, we track prefix sums
    for i in range(pos - 1, -1, -1):
        # Update prefix sum: +1 if nums[i] > k, -1 if < k
        prefix_sum += 1 if nums[i] > k else -1
        # Store this prefix sum in our count map
        count_map[prefix_sum] = count_map.get(prefix_sum, 0) + 1

    # Step 4: Reset prefix sum for right side
    prefix_sum = 0

    # Step 5: Process elements from k to the end
    for i in range(pos, n):
        # Update prefix sum for current element
        prefix_sum += 1 if nums[i] > k else (-1 if nums[i] < k else 0)

        # For odd-length subarrays: we need total sum = 0
        # If current prefix sum = x, we need left sum = -x
        result += count_map.get(-prefix_sum, 0)

        # For even-length subarrays: we need total sum = 1
        # If current prefix sum = x, we need left sum = 1 - x
        result += count_map.get(1 - prefix_sum, 0)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function countSubarrays(nums, k) {
  /**
   * Count subarrays with median equal to k.
   *
   * Approach:
   * 1. Transform array: >k -> +1, <k -> -1, k -> 0
   * 2. Use prefix sums and hash map to count valid subarrays
   * 3. Handle both odd and even length subarrays
   */
  const n = nums.length;

  // Step 1: Find position of k
  let pos = -1;
  for (let i = 0; i < n; i++) {
    if (nums[i] === k) {
      pos = i;
      break;
    }
  }

  // Step 2: Initialize prefix sum and count map
  const countMap = new Map();
  countMap.set(0, 1); // Start with prefix sum 0 appearing once
  let prefixSum = 0;
  let result = 0;

  // Step 3: Process elements to the left of k
  for (let i = pos - 1; i >= 0; i--) {
    // Update prefix sum: +1 if nums[i] > k, -1 if < k
    prefixSum += nums[i] > k ? 1 : -1;
    // Store this prefix sum in our count map
    countMap.set(prefixSum, (countMap.get(prefixSum) || 0) + 1);
  }

  // Step 4: Reset prefix sum for right side
  prefixSum = 0;

  // Step 5: Process elements from k to the end
  for (let i = pos; i < n; i++) {
    // Update prefix sum for current element
    if (nums[i] > k) {
      prefixSum += 1;
    } else if (nums[i] < k) {
      prefixSum -= 1;
    }
    // nums[i] === k adds 0, so no change needed

    // For odd-length subarrays: we need total sum = 0
    // If current prefix sum = x, we need left sum = -x
    result += countMap.get(-prefixSum) || 0;

    // For even-length subarrays: we need total sum = 1
    // If current prefix sum = x, we need left sum = 1 - x
    result += countMap.get(1 - prefixSum) || 0;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int countSubarrays(int[] nums, int k) {
        /**
         * Count subarrays with median equal to k.
         *
         * Approach:
         * 1. Transform array: >k -> +1, <k -> -1, k -> 0
         * 2. Use prefix sums and hash map to count valid subarrays
         * 3. Handle both odd and even length subarrays
         */
        int n = nums.length;

        // Step 1: Find position of k
        int pos = -1;
        for (int i = 0; i < n; i++) {
            if (nums[i] == k) {
                pos = i;
                break;
            }
        }

        // Step 2: Initialize prefix sum and count map
        Map<Integer, Integer> countMap = new HashMap<>();
        countMap.put(0, 1);  // Start with prefix sum 0 appearing once
        int prefixSum = 0;
        int result = 0;

        // Step 3: Process elements to the left of k
        for (int i = pos - 1; i >= 0; i--) {
            // Update prefix sum: +1 if nums[i] > k, -1 if < k
            prefixSum += (nums[i] > k) ? 1 : -1;
            // Store this prefix sum in our count map
            countMap.put(prefixSum, countMap.getOrDefault(prefixSum, 0) + 1);
        }

        // Step 4: Reset prefix sum for right side
        prefixSum = 0;

        // Step 5: Process elements from k to the end
        for (int i = pos; i < n; i++) {
            // Update prefix sum for current element
            if (nums[i] > k) {
                prefixSum += 1;
            } else if (nums[i] < k) {
                prefixSum -= 1;
            }
            // nums[i] == k adds 0, so no change needed

            // For odd-length subarrays: we need total sum = 0
            // If current prefix sum = x, we need left sum = -x
            result += countMap.getOrDefault(-prefixSum, 0);

            // For even-length subarrays: we need total sum = 1
            // If current prefix sum = x, we need left sum = 1 - x
            result += countMap.getOrDefault(1 - prefixSum, 0);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding k's position: O(n)
- Processing left side: O(pos) ≤ O(n)
- Processing right side: O(n - pos) ≤ O(n)
- Hash map operations (get/put): O(1) average case
- Total: O(n) linear time

**Space Complexity: O(n)**

- Hash map stores at most O(n) prefix sums
- In worst case, all prefix sums are distinct
- No other significant storage needed

The O(n) time is optimal since we must examine each element at least once.

## Common Mistakes

1. **Forgetting that k must be in the subarray**: Some candidates count subarrays where the median would be k if k were present, but the problem requires k to actually be in the subarray.

2. **Incorrect handling of even-length subarrays**: The median definition for even-length arrays is tricky. Remember: for even length, k must be the right-middle element after sorting, which translates to having one more element less than k than greater than k.

3. **Off-by-one errors in prefix sum calculations**: When computing what left sum we need for a given right sum, the equations are:
   - For odd length: `left_sum + right_sum = 0` → `left_sum = -right_sum`
   - For even length: `left_sum + right_sum = 1` → `left_sum = 1 - right_sum`
     Mixing these up leads to incorrect counts.

4. **Not initializing the count map with {0: 1}**: We need to account for the case where we take no elements from the left side (subarray starts at k). This corresponds to left sum = 0.

## When You'll See This Pattern

This "transform and count with prefix sums" pattern appears in several counting problems:

1. **Subarray Sum Equals K (LeetCode 560)**: Count subarrays with sum equal to k. Uses prefix sums with hash map for O(n) solution.

2. **Count Number of Nice Subarrays (LeetCode 1248)**: Count subarrays with exactly k odd numbers. Can be transformed by marking odd as 1, even as 0, then counting subarrays with sum = k.

3. **Binary Subarrays With Sum (LeetCode 930)**: Similar to above but with binary arrays.

The core pattern: When you need to count subarrays satisfying some condition on their elements, consider transforming elements to simpler values (+1/-1/0) and using prefix sums with a hash map for efficient counting.

## Key Takeaways

1. **Median conditions can be transformed into sum conditions**: By marking numbers as +1 (greater than median), -1 (less than median), and 0 (equal to median), the median condition becomes a constraint on the sum of transformed values.

2. **Prefix sums + hash map = efficient subarray counting**: When you need to count subarrays satisfying `prefix[j] - prefix[i] = target`, use a hash map to store prefix sums seen so far for O(1) lookups.

3. **Split problems at a key element**: When counting subarrays containing a specific element (like k), process left and right sides separately and combine results, often leading to more efficient solutions.

Related problems: [Number of Subarrays with Bounded Maximum](/problem/number-of-subarrays-with-bounded-maximum), [Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold](/problem/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold), [Sum of Imbalance Numbers of All Subarrays](/problem/sum-of-imbalance-numbers-of-all-subarrays)
