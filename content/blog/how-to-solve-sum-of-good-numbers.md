---
title: "How to Solve Sum of Good Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of Good Numbers. Easy difficulty, 69.5% acceptance rate. Topics: Array."
date: "2028-07-12"
category: "dsa-patterns"
tags: ["sum-of-good-numbers", "array", "easy"]
---

# How to Solve Sum of Good Numbers

This problem asks us to sum all "good" numbers in an array. A number is good if it's strictly greater than both its k-distance neighbors (when those neighbors exist). The tricky part is handling the boundary conditions correctly—when indices `i-k` or `i+k` fall outside the array bounds, we should still consider the element good as long as it satisfies the other condition.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [5, 2, 8, 1, 4]` with `k = 2`.

For each index `i`:

- **i=0**: Check left neighbor at i-k = -2 (doesn't exist) and right neighbor at i+k = 2 (value 8). Since left doesn't exist, we only need to check if 5 > 8? No → not good.
- **i=1**: Left neighbor at i-k = -1 (doesn't exist), right neighbor at i+k = 3 (value 1). 2 > 1? Yes → good (sum = 2).
- **i=2**: Left neighbor at i-k = 0 (value 5), right neighbor at i+k = 4 (value 4). Check 8 > 5 AND 8 > 4? Yes → good (sum = 2 + 8 = 10).
- **i=3**: Left neighbor at i-k = 1 (value 2), right neighbor at i+k = 5 (doesn't exist). Since right doesn't exist, we only need to check if 1 > 2? No → not good.
- **i=4**: Left neighbor at i-k = 2 (value 8), right neighbor at i+k = 6 (doesn't exist). Check 4 > 8? No → not good.

Final sum = 10.

The pattern emerges: for each index, we check if the element is greater than its valid k-distance neighbors. If a neighbor doesn't exist, we skip that comparison.

## Brute Force Approach

A naive approach would be to iterate through each index and explicitly check both neighbors:

1. For each index `i` from 0 to n-1
2. Initialize `isGood = true`
3. If `i-k >= 0`, check if `nums[i] > nums[i-k]`. If not, `isGood = false`
4. If `i+k < n`, check if `nums[i] > nums[i+k]`. If not, `isGood = false`
5. If `isGood`, add `nums[i]` to sum

This approach is straightforward but already optimal for this problem. The "brute force" aspect would be if we misunderstood the problem and tried to compare with ALL elements within k distance, which would be O(nk) time. But the problem specifically asks for only the elements at exactly distance k.

The key insight is that we only need to check two specific positions for each element, making this an O(n) solution.

## Optimal Solution

The optimal solution directly implements the problem definition: iterate through each index, check the conditions for both neighbors (if they exist), and accumulate the sum of good numbers.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def sumOfGoodNumbers(nums, k):
    """
    Calculate the sum of all good numbers in the array.
    A number is good if it's strictly greater than both its
    k-distance neighbors (when those neighbors exist).
    """
    n = len(nums)
    total_sum = 0

    # Iterate through each element in the array
    for i in range(n):
        is_good = True

        # Check left neighbor at distance k (if it exists)
        left_index = i - k
        if left_index >= 0:
            # Element must be strictly greater than left neighbor
            if nums[i] <= nums[left_index]:
                is_good = False

        # Check right neighbor at distance k (if it exists)
        right_index = i + k
        if right_index < n:
            # Element must be strictly greater than right neighbor
            if nums[i] <= nums[right_index]:
                is_good = False

        # If element passed all checks, add it to the sum
        if is_good:
            total_sum += nums[i]

    return total_sum
```

```javascript
// Time: O(n) | Space: O(1)
function sumOfGoodNumbers(nums, k) {
  /**
   * Calculate the sum of all good numbers in the array.
   * A number is good if it's strictly greater than both its
   * k-distance neighbors (when those neighbors exist).
   */
  const n = nums.length;
  let totalSum = 0;

  // Iterate through each element in the array
  for (let i = 0; i < n; i++) {
    let isGood = true;

    // Check left neighbor at distance k (if it exists)
    const leftIndex = i - k;
    if (leftIndex >= 0) {
      // Element must be strictly greater than left neighbor
      if (nums[i] <= nums[leftIndex]) {
        isGood = false;
      }
    }

    // Check right neighbor at distance k (if it exists)
    const rightIndex = i + k;
    if (rightIndex < n) {
      // Element must be strictly greater than right neighbor
      if (nums[i] <= nums[rightIndex]) {
        isGood = false;
      }
    }

    // If element passed all checks, add it to the sum
    if (isGood) {
      totalSum += nums[i];
    }
  }

  return totalSum;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int sumOfGoodNumbers(int[] nums, int k) {
        /**
         * Calculate the sum of all good numbers in the array.
         * A number is good if it's strictly greater than both its
         * k-distance neighbors (when those neighbors exist).
         */
        int n = nums.length;
        int totalSum = 0;

        // Iterate through each element in the array
        for (int i = 0; i < n; i++) {
            boolean isGood = true;

            // Check left neighbor at distance k (if it exists)
            int leftIndex = i - k;
            if (leftIndex >= 0) {
                // Element must be strictly greater than left neighbor
                if (nums[i] <= nums[leftIndex]) {
                    isGood = false;
                }
            }

            // Check right neighbor at distance k (if it exists)
            int rightIndex = i + k;
            if (rightIndex < n) {
                // Element must be strictly greater than right neighbor
                if (nums[i] <= nums[rightIndex]) {
                    isGood = false;
                }
            }

            // If element passed all checks, add it to the sum
            if (isGood) {
                totalSum += nums[i];
            }
        }

        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations for each element.
- For each index `i`, we perform at most 2 comparisons (checking left and right neighbors).
- Even though we calculate indices `i-k` and `i+k`, these are O(1) operations.

**Space Complexity: O(1)**

- We only use a few variables: `total_sum`, `is_good`, and loop indices.
- No additional data structures are created that scale with input size.
- The input array is not modified.

## Common Mistakes

1. **Using non-strict comparisons (≥ instead of >)**: The problem says "strictly greater than," so `nums[i] > nums[i-k]` is correct, not `nums[i] >= nums[i-k]`. Using `>=` would include equal values, which is wrong.

2. **Incorrect boundary handling**: Forgetting to check if indices exist before accessing them. Always verify `i-k >= 0` before accessing `nums[i-k]` and `i+k < n` before accessing `nums[i+k]`. Accessing out-of-bounds indices causes runtime errors.

3. **Misunderstanding "if neither exists"**: Some candidates think an element is only good if BOTH neighbors don't exist. Actually, the rule is: if a neighbor doesn't exist, we simply don't check that condition. An element with one existing neighbor only needs to be greater than that one neighbor.

4. **Early optimization attempts**: Trying to use sliding windows or other complex patterns when a simple linear scan suffices. This is an easy problem—don't overcomplicate it. The straightforward O(n) solution is already optimal.

## When You'll See This Pattern

This problem teaches **conditional neighbor checking with boundary awareness**, a pattern that appears in several array problems:

1. **Peak Element (LeetCode 162)**: Find an element greater than its neighbors. Similar neighbor comparison logic but with adjacent neighbors (distance 1).

2. **Find All Numbers Disappeared in an Array (LeetCode 448)**: Uses index manipulation (`nums[nums[i]-1]`) with bounds checking, similar to how we calculate `i-k` and `i+k`.

3. **Can Place Flowers (LeetCode 605)**: Check if current position and its neighbors satisfy certain conditions, with careful boundary handling.

The core pattern is: iterate through an array, for each position check conditions involving calculated indices (often `i ± offset`), and handle cases where those indices might be out of bounds.

## Key Takeaways

1. **Read conditions carefully**: "Strictly greater" means `>`, not `>=`. "If those indices exist" means we must check bounds before accessing.

2. **Boundary conditions are critical**: Array problems often fail at edges. Always test with `k=0`, `k >= n`, and arrays with 0, 1, or 2 elements.

3. **Simple is often sufficient**: Not every array problem needs complex data structures. A linear scan with conditional checks is sometimes the optimal solution.

[Practice this problem on CodeJeet](/problem/sum-of-good-numbers)
