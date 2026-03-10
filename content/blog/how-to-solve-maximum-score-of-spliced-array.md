---
title: "How to Solve Maximum Score Of Spliced Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Score Of Spliced Array. Hard difficulty, 58.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2029-09-05"
category: "dsa-patterns"
tags: ["maximum-score-of-spliced-array", "array", "dynamic-programming", "hard"]
---

# How to Solve Maximum Score Of Spliced Array

This problem asks us to maximize the sum of one array by swapping a contiguous subarray with the corresponding segment from another array. The tricky part is that we can only swap once, and we need to find which contiguous segment to swap to get the maximum possible sum for either array. What makes this interesting is that it looks like we need to try all possible subarrays (O(n²)), but we can solve it in O(n) using a clever transformation.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Example:**

```
nums1 = [20, 40, 20, 70, 30]
nums2 = [50, 20, 50, 40, 50]
```

We want to maximize the sum of either `nums1` or `nums2` after at most one swap of a contiguous subarray.

**Step 1: Understanding the swap impact**
If we swap a subarray from `nums2` into `nums1`, the change in `nums1`'s sum is:

- For each position `i` in the swapped segment: `nums2[i] - nums1[i]`
- The total change = sum of `(nums2[i] - nums1[i])` over the swapped segment

Similarly, if we swap from `nums1` into `nums2`, the change is `nums1[i] - nums2[i]`.

**Step 2: Thinking about maximum gain**
For maximizing `nums1`'s sum, we want to find the contiguous subarray where `diff1[i] = nums2[i] - nums1[i]` gives us the maximum possible positive sum. This is exactly the **maximum subarray problem** (Kadane's algorithm)!

Let's calculate `diff1 = nums2 - nums1`:

```
nums1: [20, 40, 20, 70, 30]
nums2: [50, 20, 50, 40, 50]
diff1: [30, -20, 30, -30, 20]
```

**Step 3: Finding best swap for nums1**
We need the maximum subarray sum in `diff1`:

- Start with 0: max = 0, current = 0
- i=0: current = max(0, 0+30) = 30, max = max(0, 30) = 30
- i=1: current = max(0, 30-20) = 10, max = max(30, 10) = 30
- i=2: current = max(0, 10+30) = 40, max = max(30, 40) = 40
- i=3: current = max(0, 40-30) = 10, max = max(40, 10) = 40
- i=4: current = max(0, 10+20) = 30, max = max(40, 30) = 40

Best gain for `nums1` = 40. Original `nums1` sum = 180, so max possible = 180 + 40 = 220.

**Step 4: Finding best swap for nums2**
Now `diff2 = nums1 - nums2`:

```
diff2: [-30, 20, -30, 30, -20]
```

Maximum subarray sum:

- i=0: current = max(0, 0-30) = 0, max = 0
- i=1: current = max(0, 0+20) = 20, max = max(0, 20) = 20
- i=2: current = max(0, 20-30) = 0, max = 20
- i=3: current = max(0, 0+30) = 30, max = max(20, 30) = 30
- i=4: current = max(0, 30-20) = 10, max = max(30, 10) = 30

Best gain for `nums2` = 30. Original `nums2` sum = 210, so max possible = 210 + 30 = 240.

**Step 5: Final answer**
The maximum of both possibilities is max(220, 240) = **240**.

## Brute Force Approach

The brute force approach would try every possible `(left, right)` pair and compute the sum after swapping:

1. Compute base sums of both arrays
2. For each `left` from 0 to n-1:
   - For each `right` from left to n-1:
     - Calculate new sum for `nums1` after swapping `nums1[left:right+1]` with `nums2[left:right+1]`
     - Calculate new sum for `nums2` after the same swap
     - Track maximum of both

This approach has O(n³) time complexity if we naively recompute sums, or O(n²) if we use prefix sums. Even O(n²) is too slow for n up to 10⁵.

**Why brute force fails:**

- With n up to 10⁵, O(n²) would require ~10¹⁰ operations, which is far too slow
- We need an O(n) or O(n log n) solution
- The key insight is recognizing this as a maximum subarray problem in disguise

## Optimized Approach

The key insight is that swapping a subarray from `nums2` into `nums1` changes `nums1`'s sum by the sum of `(nums2[i] - nums1[i])` over that subarray. To maximize `nums1`'s final sum, we need to find the contiguous subarray of `diff1 = nums2[i] - nums1[i]` with the maximum sum. This is exactly what Kadane's algorithm solves in O(n)!

Similarly, to maximize `nums2`'s sum, we find the maximum subarray sum of `diff2 = nums1[i] - nums2[i]`.

**Step-by-step reasoning:**

1. Calculate the base sums of both arrays
2. Create `diff1` where `diff1[i] = nums2[i] - nums1[i]`
3. Find maximum subarray sum in `diff1` using Kadane's algorithm
4. The best possible sum for `nums1` = base_sum_nums1 + max_subarray_sum(diff1)
5. Repeat steps 2-4 for `diff2 = nums1[i] - nums2[i]` to find best sum for `nums2`
6. Return the maximum of both possibilities

**Why this works:**

- The maximum subarray sum gives us the maximum positive gain we can achieve by swapping
- If the maximum subarray sum is negative, we don't swap anything (gain = 0)
- We consider both directions because we can choose to optimize either array

## Optimal Solution

Here's the complete solution using Kadane's algorithm:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumsSplicedArray(nums1, nums2):
    """
    Returns the maximum possible sum of either array after swapping
    at most one contiguous subarray between them.
    """
    def kadane(arr):
        """Kadane's algorithm to find maximum subarray sum."""
        max_sum = curr_sum = 0
        for num in arr:
            # Either extend previous subarray or start new one at 0
            curr_sum = max(0, curr_sum + num)
            max_sum = max(max_sum, curr_sum)
        return max_sum

    # Calculate base sums of both arrays
    sum1 = sum(nums1)
    sum2 = sum(nums2)

    # Calculate difference arrays
    # diff1[i] = nums2[i] - nums1[i] → gain if we swap into nums1
    # diff2[i] = nums1[i] - nums2[i] → gain if we swap into nums2
    n = len(nums1)
    diff1 = [0] * n
    diff2 = [0] * n
    for i in range(n):
        diff1[i] = nums2[i] - nums1[i]
        diff2[i] = nums1[i] - nums2[i]

    # Find maximum gain for each array using Kadane's algorithm
    max_gain_nums1 = kadane(diff1)  # Best gain by swapping into nums1
    max_gain_nums2 = kadane(diff2)  # Best gain by swapping into nums2

    # Calculate maximum possible sums
    max_sum1 = sum1 + max_gain_nums1  # nums1 with best possible swap
    max_sum2 = sum2 + max_gain_nums2  # nums2 with best possible swap

    # Return the maximum of both possibilities
    return max(max_sum1, max_sum2)
```

```javascript
// Time: O(n) | Space: O(1)
function maximumsSplicedArray(nums1, nums2) {
  /**
   * Kadane's algorithm to find maximum subarray sum.
   * @param {number[]} arr - Input array
   * @return {number} Maximum subarray sum (minimum 0)
   */
  const kadane = (arr) => {
    let maxSum = 0;
    let currSum = 0;

    for (let num of arr) {
      // Extend previous subarray or start new one at 0
      currSum = Math.max(0, currSum + num);
      maxSum = Math.max(maxSum, currSum);
    }

    return maxSum;
  };

  // Calculate base sums of both arrays
  let sum1 = 0,
    sum2 = 0;
  for (let i = 0; i < nums1.length; i++) {
    sum1 += nums1[i];
    sum2 += nums2[i];
  }

  // Create difference arrays
  const n = nums1.length;
  const diff1 = new Array(n);
  const diff2 = new Array(n);

  for (let i = 0; i < n; i++) {
    diff1[i] = nums2[i] - nums1[i]; // Gain if swapping into nums1
    diff2[i] = nums1[i] - nums2[i]; // Gain if swapping into nums2
  }

  // Find maximum gain for each array
  const maxGainNums1 = kadane(diff1); // Best gain for nums1
  const maxGainNums2 = kadane(diff2); // Best gain for nums2

  // Calculate maximum possible sums
  const maxSum1 = sum1 + maxGainNums1; // nums1 with optimal swap
  const maxSum2 = sum2 + maxGainNums2; // nums2 with optimal swap

  // Return the better of both possibilities
  return Math.max(maxSum1, maxSum2);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maximumsSplicedArray(int[] nums1, int[] nums2) {
        /**
         * Kadane's algorithm to find maximum subarray sum.
         * @param arr Input array
         * @return Maximum subarray sum (minimum 0)
         */
        private int kadane(int[] arr) {
            int maxSum = 0;
            int currSum = 0;

            for (int num : arr) {
                // Extend previous subarray or start new one at 0
                currSum = Math.max(0, currSum + num);
                maxSum = Math.max(maxSum, currSum);
            }

            return maxSum;
        }

        // Calculate base sums of both arrays
        int sum1 = 0, sum2 = 0;
        int n = nums1.length;

        for (int i = 0; i < n; i++) {
            sum1 += nums1[i];
            sum2 += nums2[i];
        }

        // Create difference arrays
        int[] diff1 = new int[n];  // Gain if swapping into nums1
        int[] diff2 = new int[n];  // Gain if swapping into nums2

        for (int i = 0; i < n; i++) {
            diff1[i] = nums2[i] - nums1[i];
            diff2[i] = nums1[i] - nums2[i];
        }

        // Find maximum gain for each array
        int maxGainNums1 = kadane(diff1);  // Best gain for nums1
        int maxGainNums2 = kadane(diff2);  // Best gain for nums2

        // Calculate maximum possible sums
        int maxSum1 = sum1 + maxGainNums1;  // nums1 with optimal swap
        int maxSum2 = sum2 + maxGainNums2;  // nums2 with optimal swap

        // Return the better of both possibilities
        return Math.max(maxSum1, maxSum2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make 3 passes through the arrays:
  1. Calculate base sums: O(n)
  2. Create difference arrays: O(n)
  3. Run Kadane's algorithm twice: O(n) each
- Total: O(4n) = O(n)

**Space Complexity: O(n)** for the difference arrays

- We store two difference arrays of size n
- Could be optimized to O(1) by computing differences on the fly, but O(n) is acceptable for clarity
- Kadane's algorithm itself uses O(1) space

## Common Mistakes

1. **Forgetting to consider both directions**: Some candidates only optimize for one array. Remember we can choose to maximize EITHER `nums1` OR `nums2`, so we need to check both.

2. **Not handling negative maximum subarray sum correctly**: If Kadane's algorithm returns a negative value, we shouldn't swap (gain = 0). Our implementation handles this by using `max(0, currSum + num)`.

3. **Off-by-one errors in subarray indices**: When thinking about the brute force approach, it's easy to make mistakes with inclusive/exclusive bounds. The Kadane approach avoids this entirely.

4. **Confusing when to use which difference array**: Remember:
   - `nums2[i] - nums1[i]` = gain for `nums1` if we swap `nums2[i]` into it
   - `nums1[i] - nums2[i]` = gain for `nums2` if we swap `nums1[i]` into it

## When You'll See This Pattern

This problem combines two important patterns:

1. **Maximum Subarray (Kadane's Algorithm)**: Used to find the contiguous subarray with maximum sum. This pattern appears in:
   - [Maximum Subarray](/problem/maximum-subarray) (the classic problem)
   - [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock) (maximum difference with ordering constraint)
   - [Maximum Sum Circular Subarray](/problem/maximum-sum-circular-subarray)

2. **Transforming problems into known patterns**: The key insight was recognizing that the swap gain calculation transforms into a maximum subarray problem. This "problem transformation" technique is crucial for many hard problems.

3. **Array manipulation with difference arrays**: Using difference arrays to track changes is common in problems involving range updates or comparing two sequences.

## Key Takeaways

1. **Look for problem transformations**: When a problem seems complex, try to express it in terms of a known algorithm. Here, we transformed "best swap" into "maximum subarray sum of differences."

2. **Kadane's algorithm is versatile**: It's not just for finding maximum sums—it can find maximum of any quantity where you want the best contiguous segment.

3. **Consider all possibilities**: We needed to check both arrays as the target for optimization. In interview problems, always check if you need to consider symmetric cases.

4. **The empty subarray is a valid choice**: If no swap improves the sum, we choose not to swap (empty subarray with sum 0).

Related problems: [Maximum Subarray](/problem/maximum-subarray)
