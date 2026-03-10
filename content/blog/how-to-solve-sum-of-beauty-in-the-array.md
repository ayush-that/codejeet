---
title: "How to Solve Sum of Beauty in the Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum of Beauty in the Array. Medium difficulty, 51.1% acceptance rate. Topics: Array."
date: "2029-03-28"
category: "dsa-patterns"
tags: ["sum-of-beauty-in-the-array", "array", "medium"]
---

# How to Solve Sum of Beauty in the Array

This problem asks us to calculate the "beauty" of each element in an array based on how it compares to elements on its left and right sides. The tricky part is that the beauty definition has two different conditions: one requiring comparison with **all** elements on the left and right (worth 2 points), and another requiring comparison with just the immediate neighbors (worth 1 point). This creates an interesting challenge where we need to efficiently track both local and global relationships for each position.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 2, 3, 4, 5]`

For each index `i` from 1 to 3 (indices 0 and 4 are excluded since we need elements on both sides):

**Index 1 (value = 2):**

- Condition for beauty = 2: Check if 2 > **all** elements on left (just `nums[0] = 1`) AND 2 < **all** elements on right (`nums[2]=3, nums[3]=4, nums[4]=5`)
  - Left: 2 > 1 ✓
  - Right: 2 < 3 ✓, 2 < 4 ✓, 2 < 5 ✓
  - Result: Beauty = 2

**Index 2 (value = 3):**

- Condition for beauty = 2: Check if 3 > **all** elements on left (`nums[0]=1, nums[1]=2`) AND 3 < **all** elements on right (`nums[3]=4, nums[4]=5`)
  - Left: 3 > 1 ✓, 3 > 2 ✓
  - Right: 3 < 4 ✓, 3 < 5 ✓
  - Result: Beauty = 2

**Index 3 (value = 4):**

- Condition for beauty = 2: Check if 4 > **all** elements on left (`nums[0]=1, nums[1]=2, nums[2]=3`) AND 4 < **all** elements on right (`nums[4]=5`)
  - Left: 4 > 1 ✓, 4 > 2 ✓, 4 > 3 ✓
  - Right: 4 < 5 ✓
  - Result: Beauty = 2

Total beauty = 2 + 2 + 2 = 6

Now let's try a more interesting example: `nums = [2, 4, 6, 4]`

**Index 1 (value = 4):**

- Condition for beauty = 2: Check if 4 > **all** elements on left (`nums[0]=2`) AND 4 < **all** elements on right (`nums[2]=6, nums[3]=4`)
  - Left: 4 > 2 ✓
  - Right: 4 < 6 ✓, but 4 < 4 ✗ (equal, not strictly less)
  - Result: Does NOT qualify for beauty = 2
- Condition for beauty = 1: Check if `nums[0] < nums[1] < nums[2]`
  - 2 < 4 < 6 ✓
  - Result: Beauty = 1

**Index 2 (value = 6):**

- Condition for beauty = 2: Check if 6 > **all** elements on left (`nums[0]=2, nums[1]=4`) AND 6 < **all** elements on right (`nums[3]=4`)
  - Left: 6 > 2 ✓, 6 > 4 ✓
  - Right: 6 < 4 ✗
  - Result: Does NOT qualify for beauty = 2
- Condition for beauty = 1: Check if `nums[1] < nums[2] < nums[3]`
  - 4 < 6 < 4 ✗
  - Result: Beauty = 0

Total beauty = 1 + 0 = 1

This shows us that checking the "beauty = 2" condition naively would require comparing each element with all elements on its left and right, which is inefficient.

## Brute Force Approach

The most straightforward approach is to check each condition literally:

1. For each index `i` from 1 to `n-2`:
   - Check if `nums[i]` is greater than **all** elements to its left (indices 0 to i-1)
   - Check if `nums[i]` is less than **all** elements to its right (indices i+1 to n-1)
   - If both conditions are true, add 2 to the total beauty
   - Otherwise, check if `nums[i-1] < nums[i] < nums[i+1]` and add 1 if true

The problem with this approach is its time complexity. For each of the O(n) indices, we're doing O(n) comparisons on both sides, resulting in O(n²) time complexity. For an array of size 10⁵ (common in LeetCode constraints), this would be 10¹⁰ operations, which is far too slow.

## Optimized Approach

The key insight is that we can **precompute** information about the maximum values on the left and minimum values on the right for each position. This allows us to check the "beauty = 2" condition in constant time per element.

Here's the step-by-step reasoning:

1. **Precompute left maximums**: Create an array `leftMax` where `leftMax[i]` stores the maximum value from indices `0` to `i-1`. This tells us the largest value to the left of position `i`.
2. **Precompute right minimums**: Create an array `rightMin` where `rightMin[i]` stores the minimum value from indices `i+1` to `n-1`. This tells us the smallest value to the right of position `i`.

3. **Check conditions efficiently**: For each index `i` from 1 to `n-2`:
   - Beauty = 2 if: `nums[i] > leftMax[i]` AND `nums[i] < rightMin[i]`
     - If `nums[i]` is greater than the maximum on its left, it's greater than ALL elements on its left
     - If `nums[i]` is less than the minimum on its right, it's less than ALL elements on its right
   - Beauty = 1 if: `nums[i-1] < nums[i] < nums[i+1]` (and we didn't already get beauty = 2)

This approach reduces the time complexity from O(n²) to O(n) with O(n) extra space for the precomputed arrays.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def sumOfBeauties(nums):
    """
    Calculate the total beauty of the array where:
    - Beauty = 2 if nums[i] > all elements on left AND < all elements on right
    - Beauty = 1 if nums[i-1] < nums[i] < nums[i+1]
    """
    n = len(nums)

    # Step 1: Precompute left maximums
    # left_max[i] = maximum value in nums[0..i-1]
    left_max = [0] * n
    left_max[0] = 0  # No elements to the left of index 0

    for i in range(1, n):
        # Current left_max is max of previous left_max and previous element
        left_max[i] = max(left_max[i-1], nums[i-1])

    # Step 2: Precompute right minimums
    # right_min[i] = minimum value in nums[i+1..n-1]
    right_min = [float('inf')] * n
    right_min[n-1] = float('inf')  # No elements to the right of last index

    for i in range(n-2, -1, -1):
        # Current right_min is min of next right_min and next element
        right_min[i] = min(right_min[i+1], nums[i+1])

    # Step 3: Calculate total beauty
    total_beauty = 0

    # Check indices 1 through n-2 (inclusive)
    for i in range(1, n-1):
        # Check condition for beauty = 2
        if left_max[i] < nums[i] < right_min[i]:
            total_beauty += 2
        # Check condition for beauty = 1
        elif nums[i-1] < nums[i] < nums[i+1]:
            total_beauty += 1
        # Otherwise, beauty = 0 (do nothing)

    return total_beauty
```

```javascript
// Time: O(n) | Space: O(n)
function sumOfBeauties(nums) {
  const n = nums.length;

  // Step 1: Precompute left maximums
  // leftMax[i] = maximum value in nums[0..i-1]
  const leftMax = new Array(n);
  leftMax[0] = 0; // No elements to the left of index 0

  for (let i = 1; i < n; i++) {
    // Current leftMax is max of previous leftMax and previous element
    leftMax[i] = Math.max(leftMax[i - 1], nums[i - 1]);
  }

  // Step 2: Precompute right minimums
  // rightMin[i] = minimum value in nums[i+1..n-1]
  const rightMin = new Array(n);
  rightMin[n - 1] = Infinity; // No elements to the right of last index

  for (let i = n - 2; i >= 0; i--) {
    // Current rightMin is min of next rightMin and next element
    rightMin[i] = Math.min(rightMin[i + 1], nums[i + 1]);
  }

  // Step 3: Calculate total beauty
  let totalBeauty = 0;

  // Check indices 1 through n-2 (inclusive)
  for (let i = 1; i < n - 1; i++) {
    // Check condition for beauty = 2
    if (leftMax[i] < nums[i] && nums[i] < rightMin[i]) {
      totalBeauty += 2;
    }
    // Check condition for beauty = 1
    else if (nums[i - 1] < nums[i] && nums[i] < nums[i + 1]) {
      totalBeauty += 1;
    }
    // Otherwise, beauty = 0 (do nothing)
  }

  return totalBeauty;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int sumOfBeauties(int[] nums) {
        int n = nums.length;

        // Step 1: Precompute left maximums
        // leftMax[i] = maximum value in nums[0..i-1]
        int[] leftMax = new int[n];
        leftMax[0] = 0; // No elements to the left of index 0

        for (int i = 1; i < n; i++) {
            // Current leftMax is max of previous leftMax and previous element
            leftMax[i] = Math.max(leftMax[i-1], nums[i-1]);
        }

        // Step 2: Precompute right minimums
        // rightMin[i] = minimum value in nums[i+1..n-1]
        int[] rightMin = new int[n];
        rightMin[n-1] = Integer.MAX_VALUE; // No elements to the right of last index

        for (int i = n-2; i >= 0; i--) {
            // Current rightMin is min of next rightMin and next element
            rightMin[i] = Math.min(rightMin[i+1], nums[i+1]);
        }

        // Step 3: Calculate total beauty
        int totalBeauty = 0;

        // Check indices 1 through n-2 (inclusive)
        for (int i = 1; i < n-1; i++) {
            // Check condition for beauty = 2
            if (leftMax[i] < nums[i] && nums[i] < rightMin[i]) {
                totalBeauty += 2;
            }
            // Check condition for beauty = 1
            else if (nums[i-1] < nums[i] && nums[i] < nums[i+1]) {
                totalBeauty += 1;
            }
            // Otherwise, beauty = 0 (do nothing)
        }

        return totalBeauty;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make three passes through the array:
  1. One forward pass to compute `leftMax` array: O(n)
  2. One backward pass to compute `rightMin` array: O(n)
  3. One pass through the middle indices to calculate beauty: O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We use two additional arrays of size n:
  - `leftMax` array: O(n)
  - `rightMin` array: O(n)
- Total extra space: O(2n) = O(n)

## Common Mistakes

1. **Off-by-one errors in index ranges**: The problem states we should only consider indices `1 <= i <= nums.length - 2`. A common mistake is including index 0 or the last index, or using `i < n-1` instead of `i <= n-2`. Remember: we need elements on **both** sides of `i`.

2. **Incorrect initialization of boundary values**: For `leftMax[0]`, we should initialize it to a value that won't affect comparisons. Since we're checking `nums[i] > leftMax[i]`, initializing to 0 works for positive integers, but for the general case, we should use `-inf` or handle it carefully. Similarly for `rightMin[n-1]`, we use `inf`.

3. **Misunderstanding the "all" condition**: The beauty = 2 condition requires `nums[i]` to be greater than **ALL** elements on the left and less than **ALL** elements on the right. Some candidates mistakenly check only against immediate neighbors or use average values. Remember: checking against the maximum on the left and minimum on the right is sufficient.

4. **Forgetting the "else" in condition checking**: The problem states that beauty = 1 only applies if beauty = 2 doesn't apply. Using separate `if` statements instead of `if-else` could incorrectly give beauty = 3 for elements that satisfy both conditions.

## When You'll See This Pattern

This problem uses the **prefix/suffix array** pattern, where we precompute information from one direction to answer queries about relationships between elements. This pattern appears in many array problems:

1. **Best Time to Buy and Sell Stock**: We track the minimum price seen so far (similar to our `leftMax` but for minimum) to determine the maximum profit if we buy at that minimum and sell later.

2. **Partition Array into Disjoint Intervals**: We need to find a partition where all elements in the left segment are ≤ all elements in the right segment. This requires tracking maximums on the left and minimums on the right, exactly like our solution.

3. **Maximum Value of an Ordered Triplet II**: Similar precomputation of maximum values on the left and right helps find the maximum value of `(nums[i] - nums[j]) * nums[k]` where `i < j < k`.

The core idea is: when you need to compare each element with **all** elements on one side, precomputing extreme values (max/min) in that direction allows O(1) comparisons instead of O(n).

## Key Takeaways

1. **Precomputation transforms O(n²) to O(n)**: When a problem requires comparing each element with all elements on one or both sides, consider precomputing prefix/suffix arrays of maximums or minimums.

2. **Check extreme values, not all values**: To verify that `nums[i]` is greater than all elements on the left, you only need to check if it's greater than the **maximum** value on the left. Similarly, to check if it's less than all elements on the right, check if it's less than the **minimum** value on the right.

3. **Read conditions carefully**: Notice that beauty = 1 and beauty = 2 are **mutually exclusive** conditions. An element can't get both scores, even if it satisfies both conditions. The problem explicitly states this through the "otherwise" structure.

Related problems: [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock), [Partition Array into Disjoint Intervals](/problem/partition-array-into-disjoint-intervals), [Maximum Value of an Ordered Triplet II](/problem/maximum-value-of-an-ordered-triplet-ii)
