---
title: "How to Solve Running Sum of 1d Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Running Sum of 1d Array. Easy difficulty, 86.9% acceptance rate. Topics: Array, Prefix Sum."
date: "2026-05-03"
category: "dsa-patterns"
tags: ["running-sum-of-1d-array", "array", "prefix-sum", "easy"]
---

# How to Solve Running Sum of 1d Array

The problem asks us to transform an array by replacing each element with the sum of all elements up to that position. While conceptually simple, this is a foundational **prefix sum** problem that teaches how to build cumulative results efficiently. The "tricky" part isn't complexity—it's recognizing this as the most basic form of a pattern that appears in countless interview questions.

## Visual Walkthrough

Let's trace through the example `nums = [1, 2, 3, 4]`:

**Step 1:** The first element stays the same since it's just the sum of itself.

- `runningSum[0] = nums[0] = 1`
- Result so far: `[1]`

**Step 2:** For the second element, we add the current number to the previous running sum.

- `runningSum[1] = runningSum[0] + nums[1] = 1 + 2 = 3`
- Result so far: `[1, 3]`

**Step 3:** Continue the pattern: current running sum equals previous running sum plus current number.

- `runningSum[2] = runningSum[1] + nums[2] = 3 + 3 = 6`
- Result so far: `[1, 3, 6]`

**Step 4:** Final element follows the same rule.

- `runningSum[3] = runningSum[2] + nums[3] = 6 + 4 = 10`
- Final result: `[1, 3, 6, 10]`

The key insight: each position's value depends **only** on the previous position's result and the current input value. This means we can compute the entire result in a single pass through the array.

## Brute Force Approach

A truly naive approach would be to calculate each running sum independently by summing from the beginning each time:

```python
def runningSum(nums):
    result = []
    for i in range(len(nums)):
        # Sum elements from index 0 to i
        current_sum = 0
        for j in range(i + 1):
            current_sum += nums[j]
        result.append(current_sum)
    return result
```

**Why this is inefficient:**

- **Time Complexity:** O(n²) — For an array of length n, we're doing 1 + 2 + 3 + ... + n = n(n+1)/2 operations
- **Redundant Work:** We're repeatedly summing the same elements. For example, to calculate the sum at index 3, we sum indices 0-3, but we already summed indices 0-2 for the previous position.

While this brute force approach would technically produce the correct answer, it's unnecessarily slow for larger arrays. In an interview, you'd want to immediately recognize the opportunity to optimize by reusing previous computations.

## Optimal Solution

The optimal solution uses the **prefix sum** technique, where we build the result incrementally. Each element in the result array is the sum of the previous result and the current input value. This approach eliminates redundant calculations by carrying forward the cumulative sum.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) if we modify input, O(n) if we create new array
def runningSum(nums):
    """
    Calculate running sum in-place to save space.
    Each element becomes the sum of itself and all previous elements.
    """
    # Start from index 1 because the first element stays the same
    for i in range(1, len(nums)):
        # Add the previous running sum to current element
        nums[i] += nums[i - 1]

    return nums
```

```javascript
// Time: O(n) | Space: O(1) if we modify input, O(n) if we create new array
function runningSum(nums) {
  /**
   * Calculate running sum in-place to save space.
   * Each element becomes the sum of itself and all previous elements.
   */
  // Start from index 1 because the first element stays the same
  for (let i = 1; i < nums.length; i++) {
    // Add the previous running sum to current element
    nums[i] += nums[i - 1];
  }

  return nums;
}
```

```java
// Time: O(n) | Space: O(1) if we modify input, O(n) if we create new array
public int[] runningSum(int[] nums) {
    /**
     * Calculate running sum in-place to save space.
     * Each element becomes the sum of itself and all previous elements.
     */
    // Start from index 1 because the first element stays the same
    for (int i = 1; i < nums.length; i++) {
        // Add the previous running sum to current element
        nums[i] += nums[i - 1];
    }

    return nums;
}
```

</div>

**Alternative (preserving original array):**
If you need to preserve the original array, create a new result array:

```python
def runningSum(nums):
    result = [0] * len(nums)
    result[0] = nums[0]
    for i in range(1, len(nums)):
        result[i] = result[i - 1] + nums[i]
    return result
```

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array, performing one addition operation per element (except the first).
- For n elements, we perform n-1 operations, which simplifies to O(n).

**Space Complexity:** O(1) or O(n)

- **O(1) extra space** if we modify the input array in-place (as shown in the main solution).
- **O(n) extra space** if we create a new result array to preserve the original input.
- The choice depends on whether the problem allows modifying the input and whether you need to preserve the original data.

## Common Mistakes

1. **Starting the loop at index 0 instead of 1**
   - Mistake: `for i in range(len(nums)):` then accessing `nums[i-1]` which causes index error at i=0
   - Fix: Always start at index 1 since the first element doesn't need modification

2. **Creating unnecessary extra arrays when not needed**
   - Mistake: Always creating a new result array even when the problem allows in-place modification
   - Fix: Check if you can modify the input. If allowed, in-place modification saves space.

3. **Confusing the operation order**
   - Mistake: `nums[i-1] += nums[i]` (adding current to previous instead of previous to current)
   - Fix: Remember we want `current = previous + current`, so `nums[i] += nums[i-1]`

4. **Not handling empty or single-element arrays**
   - Mistake: Code crashes or returns wrong result for `[]` or `[5]`
   - Fix: The loop from 1 to len(nums) automatically handles these cases correctly since range(1, 0) and range(1, 1) are empty

## When You'll See This Pattern

The prefix sum technique appears in many more complex problems:

1. **Range Sum Queries** (LeetCode 303, 304)
   - Problem: Answer multiple queries for sum of subarrays
   - Connection: Precompute prefix sums once, then answer each query in O(1) time by subtracting prefix sums

2. **Subarray Sum Equals K** (LeetCode 560)
   - Problem: Count subarrays that sum to a target value
   - Connection: Use prefix sums with a hash map to find pairs of indices where the difference equals k

3. **Maximum Subarray** (LeetCode 53)
   - Problem: Find contiguous subarray with the largest sum
   - Connection: While not using prefix sums directly, it uses a similar cumulative approach (Kadane's algorithm)

4. **Product of Array Except Self** (LeetCode 238)
   - Problem: Compute product of all elements except current
   - Connection: Uses prefix products (similar concept) from left and right

## Key Takeaways

1. **Prefix sums transform O(n) queries into O(1) lookups** — When you need to answer many range sum queries, precomputing prefix sums is almost always the optimal approach.

2. **In-place modification vs. new array** — Always consider whether you can modify the input. In-place saves space but destroys original data; a new array preserves data but uses more space.

3. **This is the simplest dynamic programming** — Each result depends only on the immediately previous result, making it a 1D DP problem with O(n) time and O(1) extra space.

4. **The pattern generalizes to 2D** — For matrix problems, you can compute 2D prefix sums where each cell contains the sum of the submatrix from (0,0) to (i,j).

[Practice this problem on CodeJeet](/problem/running-sum-of-1d-array)
