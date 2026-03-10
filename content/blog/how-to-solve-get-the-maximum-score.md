---
title: "How to Solve Get the Maximum Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Get the Maximum Score. Hard difficulty, 40.8% acceptance rate. Topics: Array, Two Pointers, Dynamic Programming, Greedy."
date: "2029-01-27"
category: "dsa-patterns"
tags: ["get-the-maximum-score", "array", "two-pointers", "dynamic-programming", "hard"]
---

# How to Solve "Get the Maximum Score"

You're given two sorted arrays of distinct integers, and you need to find the maximum score of a valid path. A valid path starts at index 0 of either array, moves left to right, and can switch to the other array only at common values (values that appear in both arrays). The score is the sum of all values visited. The challenge is that you need to maximize this sum while respecting the switching rules and the left-to-right traversal constraint.

What makes this problem tricky is that it combines elements of two-pointer traversal with greedy decision-making. You can't simply take all values from one array because switching at common values might give you access to higher values later. The optimal path might switch multiple times between arrays.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
nums1 = [2, 4, 5, 8, 10]
nums2 = [4, 6, 8, 9]
```

Both arrays are sorted and have distinct integers. The common values are 4 and 8.

**Step 1: Identify common values**

- Common values: 4 (at nums1[1], nums2[0]) and 8 (at nums1[3], nums2[2])

**Step 2: Think about possible paths**
We can start in either array. Let's consider starting in nums1:

- Path 1: Stay in nums1: 2 → 4 → 5 → 8 → 10 = 29
- Path 2: Switch at 4: 2 → 4 (switch) → 6 → 8 → 9 = 29
- Path 3: Switch at 8: 2 → 4 → 5 → 8 (switch) → 9 = 28
- Path 4: Switch at both: 2 → 4 (switch) → 6 → 8 (switch) → 10 = 30

Wait, that last path isn't valid! Once we switch at 4 to nums2, we're in nums2 at value 4. We then take 6, then 8. At 8, we could switch back to nums1, but nums1 has 8 at index 3, and we'd continue with 10. So 2 → 4 (switch) → 6 → 8 (switch) → 10 = 30 is actually valid!

**Step 3: The key insight**
Between any two consecutive common values (or from start to first common, or last common to end), we should take the path with the larger sum. We can calculate these segment sums independently and make greedy choices at common values.

Let's break it down:

- Segment 1 (start to first common value 4):
  - nums1: 2 = 2
  - nums2: (can't start here for this segment) = 0
  - Max: 2 (take nums1)
- Segment 2 (4 to 8):
  - nums1: 5 = 5
  - nums2: 6 = 6
  - Max: 6 (take nums2)
- Segment 3 (8 to end):
  - nums1: 10 = 10
  - nums2: 9 = 9
  - Max: 10 (take nums1)

Total: 2 + 4 + 6 + 8 + 10 = 30

This matches our best path! The algorithm emerges: find common values, calculate segment sums between them, and take the maximum at each segment.

## Brute Force Approach

A naive approach would be to try all possible paths. At each position, if we're at a common value, we have two choices: stay in the current array or switch. If not at a common value, we must continue in the current array.

This leads to exponential time complexity because at each common value, we have a branching factor of 2. With k common values, we'd have O(2^k) possible paths. Since k could be up to min(m, n) where m and n are array lengths, this is far too slow for the constraints (arrays can have up to 10^5 elements).

Even if we tried to implement this with recursion or backtracking, it would time out on large inputs. We need a more efficient approach.

## Optimized Approach

The key insight is that **between any two consecutive common values, the optimal path will take the segment with the higher sum**. This allows us to break the problem into independent segments.

Here's the step-by-step reasoning:

1. **Common values act as decision points**: At common values, we can choose which array to take for the next segment.

2. **Segments are independent**: The sum we accumulate between common value i and common value i+1 doesn't affect decisions before i or after i+1.

3. **Greedy choice works**: For each segment between common values (or from start to first common, or last common to end), we should take the path with the maximum sum through that segment.

4. **Two-pointer technique**: Since both arrays are sorted, we can use two pointers to efficiently find common values and calculate segment sums.

The algorithm:

1. Initialize two pointers i=0 (nums1) and j=0 (nums2)
2. Initialize sums sum1=0 and sum2=0 for current segment sums
3. Initialize result=0
4. While both pointers are within bounds:
   - If nums1[i] < nums2[j]: Add nums1[i] to sum1, increment i
   - If nums1[i] > nums2[j]: Add nums2[j] to sum2, increment j
   - If nums1[i] == nums2[j] (common value):
     - Add the common value to both sums
     - Add max(sum1, sum2) to result
     - Reset sum1 and sum2 to 0 (start new segment)
     - Increment both i and j
5. After the loop, handle remaining elements in either array
6. Add max(sum1, sum2) to result (final segment)
7. Return result modulo 10^9+7

## Optimal Solution

<div class="code-group">

```python
# Time: O(m + n) where m = len(nums1), n = len(nums2)
# Space: O(1) - we only use a few variables
def maxSum(nums1, nums2):
    MOD = 10**9 + 7

    # Initialize pointers and sums
    i, j = 0, 0  # Pointers for nums1 and nums2
    sum1, sum2 = 0, 0  # Running sums for current segment
    result = 0  # Final maximum score

    m, n = len(nums1), len(nums2)

    # Process both arrays until one is exhausted
    while i < m and j < n:
        if nums1[i] < nums2[j]:
            # nums1 has smaller value, add to sum1
            sum1 += nums1[i]
            i += 1
        elif nums1[i] > nums2[j]:
            # nums2 has smaller value, add to sum2
            sum2 += nums2[j]
            j += 1
        else:
            # Found a common value - decision point
            # Add the common value to both sums
            sum1 += nums1[i]
            sum2 += nums2[j]

            # Take the maximum path to this common value
            result += max(sum1, sum2)
            result %= MOD

            # Reset sums for next segment
            sum1, sum2 = 0, 0

            # Move both pointers past the common value
            i += 1
            j += 1

    # Process remaining elements in nums1
    while i < m:
        sum1 += nums1[i]
        i += 1

    # Process remaining elements in nums2
    while j < n:
        sum2 += nums2[j]
        j += 1

    # Add the maximum of the final segment sums
    result += max(sum1, sum2)
    result %= MOD

    return result
```

```javascript
// Time: O(m + n) where m = nums1.length, n = nums2.length
// Space: O(1) - constant extra space
function maxSum(nums1, nums2) {
  const MOD = 1000000007;

  // Initialize pointers and sums
  let i = 0,
    j = 0; // Pointers for nums1 and nums2
  let sum1 = 0,
    sum2 = 0; // Running sums for current segment
  let result = 0; // Final maximum score

  const m = nums1.length,
    n = nums2.length;

  // Process both arrays until one is exhausted
  while (i < m && j < n) {
    if (nums1[i] < nums2[j]) {
      // nums1 has smaller value, add to sum1
      sum1 += nums1[i];
      i++;
    } else if (nums1[i] > nums2[j]) {
      // nums2 has smaller value, add to sum2
      sum2 += nums2[j];
      j++;
    } else {
      // Found a common value - decision point
      // Add the common value to both sums
      sum1 += nums1[i];
      sum2 += nums2[j];

      // Take the maximum path to this common value
      result = (result + Math.max(sum1, sum2)) % MOD;

      // Reset sums for next segment
      sum1 = 0;
      sum2 = 0;

      // Move both pointers past the common value
      i++;
      j++;
    }
  }

  // Process remaining elements in nums1
  while (i < m) {
    sum1 += nums1[i];
    i++;
  }

  // Process remaining elements in nums2
  while (j < n) {
    sum2 += nums2[j];
    j++;
  }

  // Add the maximum of the final segment sums
  result = (result + Math.max(sum1, sum2)) % MOD;

  return result;
}
```

```java
// Time: O(m + n) where m = nums1.length, n = nums2.length
// Space: O(1) - constant extra space
class Solution {
    public int maxSum(int[] nums1, int[] nums2) {
        final int MOD = 1000000007;

        // Initialize pointers and sums
        int i = 0, j = 0;  // Pointers for nums1 and nums2
        long sum1 = 0, sum2 = 0;  // Use long to prevent overflow
        long result = 0;  // Final maximum score

        int m = nums1.length, n = nums2.length;

        // Process both arrays until one is exhausted
        while (i < m && j < n) {
            if (nums1[i] < nums2[j]) {
                // nums1 has smaller value, add to sum1
                sum1 += nums1[i];
                i++;
            } else if (nums1[i] > nums2[j]) {
                // nums2 has smaller value, add to sum2
                sum2 += nums2[j];
                j++;
            } else {
                // Found a common value - decision point
                // Add the common value to both sums
                sum1 += nums1[i];
                sum2 += nums2[j];

                // Take the maximum path to this common value
                result += Math.max(sum1, sum2);
                result %= MOD;

                // Reset sums for next segment
                sum1 = 0;
                sum2 = 0;

                // Move both pointers past the common value
                i++;
                j++;
            }
        }

        // Process remaining elements in nums1
        while (i < m) {
            sum1 += nums1[i];
            i++;
        }

        // Process remaining elements in nums2
        while (j < n) {
            sum2 += nums2[j];
            j++;
        }

        // Add the maximum of the final segment sums
        result += Math.max(sum1, sum2);
        result %= MOD;

        return (int)result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m + n)** where m and n are the lengths of nums1 and nums2. We traverse each array exactly once with our two pointers. Each pointer moves from 0 to the end of its array, and we never backtrack.

**Space Complexity: O(1)** for all implementations. We only use a constant amount of extra space for pointers, running sums, and the result. The input arrays are given and not counted toward our space usage.

The efficiency comes from:

1. The two-pointer technique that leverages the sorted property of both arrays
2. The greedy decision-making at common values that eliminates the need to explore multiple paths
3. Processing each element exactly once without recursion or backtracking

## Common Mistakes

1. **Not using modulo correctly**: The problem requires returning the result modulo 10^9+7. Candidates often forget to apply the modulo operation after each addition, which can lead to integer overflow in languages like Java. Always apply modulo after each arithmetic operation when the problem specifies it.

2. **Incorrect pointer movement at common values**: When finding a common value, you must increment both pointers. A common mistake is to increment only one pointer, which causes the algorithm to get stuck or skip values.

3. **Forgetting to handle remaining elements**: After the main while loop, one array might still have unprocessed elements. These need to be added to their respective sums before taking the final max. Missing this results in an incomplete score.

4. **Using int instead of long for large sums**: In Java, the sums can exceed 2^31-1, so using int can cause overflow. Always use long for intermediate sums when dealing with large numbers and modulo operations.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Two-pointer technique on sorted arrays**: Used when you need to process two sorted sequences simultaneously. Other problems using this pattern:
   - "Intersection of Two Arrays" (Easy) - finding common elements
   - "Merge Sorted Array" (Easy) - merging two sorted arrays
   - "3Sum" (Medium) - though it uses three pointers

2. **Greedy segmentation with decision points**: Used when you can break a problem into independent segments and make optimal local decisions. Other problems using this pattern:
   - "Jump Game II" (Medium) - making optimal jumps to reach the end
   - "Partition Labels" (Medium) - partitioning string into segments
   - "Video Stitching" (Medium) - selecting video clips to cover time interval

The specific combination of these patterns appears in problems where you need to traverse multiple sequences with switching points, maximizing or minimizing some metric.

## Key Takeaways

1. **Sorted arrays + common elements = two-pointer approach**: When dealing with multiple sorted sequences and you need to find common elements or process them in order, the two-pointer technique is often the right approach.

2. **Look for independent segments**: If a problem can be broken into segments where decisions don't affect other segments, you can solve each segment independently and combine results. This often turns exponential problems into linear ones.

3. **Common values as decision points**: In path traversal problems, points where you have choices (like switching between arrays) are natural places to make greedy decisions if the segments between them are independent.

Related problems: [Maximum Score of a Node Sequence](/problem/maximum-score-of-a-node-sequence)
