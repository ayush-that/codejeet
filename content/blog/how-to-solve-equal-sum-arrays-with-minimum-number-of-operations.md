---
title: "How to Solve Equal Sum Arrays With Minimum Number of Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Equal Sum Arrays With Minimum Number of Operations. Medium difficulty, 54.6% acceptance rate. Topics: Array, Hash Table, Greedy, Counting."
date: "2029-02-05"
category: "dsa-patterns"
tags:
  ["equal-sum-arrays-with-minimum-number-of-operations", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Equal Sum Arrays With Minimum Number of Operations

You're given two arrays where each element is between 1 and 6, and you can change any element to any value between 1 and 6. Your goal is to make the sums of both arrays equal using the minimum number of operations. What makes this problem interesting is that you need to think about the "gap" between the sums and which changes give you the biggest reduction in that gap per operation.

## Visual Walkthrough

Let's trace through an example: `nums1 = [1,2,3,4,5,6]` (sum = 21) and `nums2 = [1,1,2,2,2,2]` (sum = 10).

**Step 1: Calculate the gap**

- Sum1 = 21, Sum2 = 10
- Gap = |21 - 10| = 11
- We need to reduce this gap to 0

**Step 2: Identify possible changes**
For each element, we can change it to make the gap smaller:

- In the larger array (nums1), we can decrease elements to reduce the gap
- In the smaller array (nums2), we can increase elements to reduce the gap

**Step 3: Calculate potential gains**
For nums1 (larger sum):

- Element 1: Can change to 6 → gain = 1-6 = -5 (actually a loss, not helpful)
- Element 2: Can change to 1 → gain = 2-1 = 1
- Element 3: Can change to 1 → gain = 3-1 = 2
- Element 4: Can change to 1 → gain = 4-1 = 3
- Element 5: Can change to 1 → gain = 5-1 = 4
- Element 6: Can change to 1 → gain = 6-1 = 5

For nums2 (smaller sum):

- Element 1: Can change to 6 → gain = 6-1 = 5
- Element 1: Can change to 6 → gain = 6-1 = 5
- Element 2: Can change to 6 → gain = 6-2 = 4
- Element 2: Can change to 6 → gain = 6-2 = 4
- Element 2: Can change to 6 → gain = 6-2 = 4
- Element 2: Can change to 6 → gain = 6-2 = 4

**Step 4: Sort gains and apply largest first**
All possible gains: [5, 5, 5, 4, 4, 4, 4, 4, 3, 2, 1]
Sorted descending: [5, 5, 5, 4, 4, 4, 4, 4, 3, 2, 1]

Apply operations:

1. Use gain 5 → gap = 11 - 5 = 6
2. Use gain 5 → gap = 6 - 5 = 1
3. Use gain 5 → gap = 1 - 5 = -4 (overshoot, but gap becomes 0 since we only need to reach 0 or less)

We used 3 operations. The key insight: we want to use the largest possible gain each time.

## Brute Force Approach

A naive approach would try all possible combinations of operations. For each element in both arrays, we could try changing it to any of the 6 possible values. With n elements total, this gives us 6^n possibilities to check - clearly exponential and infeasible.

Even a slightly better brute force might try all possible numbers of operations k from 1 to n, and check if we can reduce the gap to 0 with exactly k operations. But this still requires checking combinations, which grows combinatorially.

The problem with brute force is it doesn't leverage the structure: we always want to make the change that gives us the biggest reduction in the gap. This leads us to a greedy approach.

## Optimized Approach

The key insight is that this is a **greedy** problem where we always want to make the change that gives us the largest possible reduction in the gap between the two sums.

**Step-by-step reasoning:**

1. **Calculate the initial gap**: Find the absolute difference between the sums of the two arrays.
2. **If gap is 0**: We're done - return 0 operations.
3. **Identify which array is larger**: This tells us whether we need to decrease elements (in the larger array) or increase elements (in the smaller array).
4. **Calculate possible gains for each element**:
   - For elements in the larger array: The maximum gain is `element - 1` (changing it from its current value down to 1)
   - For elements in the smaller array: The maximum gain is `6 - element` (changing it from its current value up to 6)
5. **Collect all gains**: Put all possible gains into a single list.
6. **Sort gains in descending order**: We want to use the largest gains first.
7. **Greedily apply gains**: Starting with the largest gain, subtract it from the gap until the gap becomes ≤ 0.
8. **Count operations**: The number of gains we used is our answer.

**Why greedy works**: Each operation is independent, and using a larger gain now never prevents us from using a smaller gain later. There's no interaction between operations that would make a different ordering better.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) where n = len(nums1) + len(nums2)
# Space: O(n) for storing the gains array
def minOperations(nums1, nums2):
    # Step 1: Calculate sums and the gap between them
    sum1 = sum(nums1)
    sum2 = sum(nums2)

    # If sums are already equal, no operations needed
    if sum1 == sum2:
        return 0

    # Ensure sum1 is the larger sum for consistent logic
    if sum1 < sum2:
        # Swap to make sum1 the larger sum
        nums1, nums2 = nums2, nums1
        sum1, sum2 = sum2, sum1

    gap = sum1 - sum2  # Positive since sum1 > sum2

    # Step 2: Calculate maximum possible gain for each element
    gains = []

    # For elements in the larger array (nums1), we can decrease them
    # Maximum gain: change from current value to 1
    for num in nums1:
        gain = num - 1  # Changing from num to 1 reduces sum by (num-1)
        if gain > 0:    # Only add if it actually reduces the gap
            gains.append(gain)

    # For elements in the smaller array (nums2), we can increase them
    # Maximum gain: change from current value to 6
    for num in nums2:
        gain = 6 - num  # Changing from num to 6 increases sum by (6-num)
        if gain > 0:    # Only add if it actually reduces the gap
            gains.append(gain)

    # Step 3: Sort gains in descending order
    # We want to use the largest gains first
    gains.sort(reverse=True)

    # Step 4: Greedily apply gains until gap <= 0
    operations = 0
    for gain in gains:
        gap -= gain     # Apply the gain to reduce the gap
        operations += 1 # Count this operation

        # If gap becomes 0 or negative, we've equalized the sums
        if gap <= 0:
            return operations

    # Step 5: If we've used all gains and gap is still > 0
    # It means we cannot equalize the sums
    return -1
```

```javascript
// Time: O(n log n) where n = nums1.length + nums2.length
// Space: O(n) for storing the gains array
function minOperations(nums1, nums2) {
  // Step 1: Calculate sums and the gap between them
  let sum1 = nums1.reduce((a, b) => a + b, 0);
  let sum2 = nums2.reduce((a, b) => a + b, 0);

  // If sums are already equal, no operations needed
  if (sum1 === sum2) {
    return 0;
  }

  // Ensure sum1 is the larger sum for consistent logic
  if (sum1 < sum2) {
    // Swap to make sum1 the larger sum
    [nums1, nums2] = [nums2, nums1];
    [sum1, sum2] = [sum2, sum1];
  }

  let gap = sum1 - sum2; // Positive since sum1 > sum2

  // Step 2: Calculate maximum possible gain for each element
  const gains = [];

  // For elements in the larger array (nums1), we can decrease them
  // Maximum gain: change from current value to 1
  for (const num of nums1) {
    const gain = num - 1; // Changing from num to 1 reduces sum by (num-1)
    if (gain > 0) {
      // Only add if it actually reduces the gap
      gains.push(gain);
    }
  }

  // For elements in the smaller array (nums2), we can increase them
  // Maximum gain: change from current value to 6
  for (const num of nums2) {
    const gain = 6 - num; // Changing from num to 6 increases sum by (6-num)
    if (gain > 0) {
      // Only add if it actually reduces the gap
      gains.push(gain);
    }
  }

  // Step 3: Sort gains in descending order
  // We want to use the largest gains first
  gains.sort((a, b) => b - a);

  // Step 4: Greedily apply gains until gap <= 0
  let operations = 0;
  for (const gain of gains) {
    gap -= gain; // Apply the gain to reduce the gap
    operations++; // Count this operation

    // If gap becomes 0 or negative, we've equalized the sums
    if (gap <= 0) {
      return operations;
    }
  }

  // Step 5: If we've used all gains and gap is still > 0
  // It means we cannot equalize the sums
  return -1;
}
```

```java
// Time: O(n log n) where n = nums1.length + nums2.length
// Space: O(n) for storing the gains list
class Solution {
    public int minOperations(int[] nums1, int[] nums2) {
        // Step 1: Calculate sums and the gap between them
        int sum1 = 0, sum2 = 0;
        for (int num : nums1) sum1 += num;
        for (int num : nums2) sum2 += num;

        // If sums are already equal, no operations needed
        if (sum1 == sum2) {
            return 0;
        }

        // Ensure sum1 is the larger sum for consistent logic
        if (sum1 < sum2) {
            // Swap to make sum1 the larger sum
            int[] temp = nums1;
            nums1 = nums2;
            nums2 = temp;
            int tempSum = sum1;
            sum1 = sum2;
            sum2 = tempSum;
        }

        int gap = sum1 - sum2;  // Positive since sum1 > sum2

        // Step 2: Calculate maximum possible gain for each element
        List<Integer> gains = new ArrayList<>();

        // For elements in the larger array (nums1), we can decrease them
        // Maximum gain: change from current value to 1
        for (int num : nums1) {
            int gain = num - 1;  // Changing from num to 1 reduces sum by (num-1)
            if (gain > 0) {      // Only add if it actually reduces the gap
                gains.add(gain);
            }
        }

        // For elements in the smaller array (nums2), we can increase them
        // Maximum gain: change from current value to 6
        for (int num : nums2) {
            int gain = 6 - num;  // Changing from num to 6 increases sum by (6-num)
            if (gain > 0) {      // Only add if it actually reduces the gap
                gains.add(gain);
            }
        }

        // Step 3: Sort gains in descending order
        // We want to use the largest gains first
        Collections.sort(gains, Collections.reverseOrder());

        // Step 4: Greedily apply gains until gap <= 0
        int operations = 0;
        for (int gain : gains) {
            gap -= gain;     // Apply the gain to reduce the gap
            operations++;    // Count this operation

            // If gap becomes 0 or negative, we've equalized the sums
            if (gap <= 0) {
                return operations;
            }
        }

        // Step 5: If we've used all gains and gap is still > 0
        // It means we cannot equalize the sums
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Calculating sums: O(n) where n = len(nums1) + len(nums2)
- Building gains array: O(n)
- Sorting gains: O(n log n) - this dominates
- Applying gains greedily: O(n)

**Space Complexity: O(n)**

- We store the gains array which has at most n elements
- Other variables use O(1) space

**Optimization Note**: We could achieve O(n) time using counting sort since gains are integers between 0 and 5. We could count how many of each gain value we have, then iterate from gain 5 down to 1. This would give us O(n) time and O(1) space since we only need an array of size 6 to count gains.

## Common Mistakes

1. **Forgetting to handle the case where sums are already equal**: Always check this first - it's an easy early return that saves computation.

2. **Not swapping arrays when sum1 < sum2**: If you don't ensure the first array has the larger sum, your gain calculations will be wrong. You'll try to increase elements in the larger array or decrease elements in the smaller array, which would increase the gap instead of reducing it.

3. **Including zero gains in the gains array**: Elements that are already at their limit (1 in the larger array or 6 in the smaller array) give zero gain. Including them wastes space and could lead to unnecessary operations.

4. **Forgetting to return -1 when impossible**: If the total maximum possible gain (sum of all gains) is less than the initial gap, it's impossible to equalize the sums. The code will use all gains and still have gap > 0, so we need to return -1.

5. **Off-by-one in gain calculation**: Remember that changing from value `x` to 1 gives gain `x-1`, not `x`. Changing from value `x` to 6 gives gain `6-x`, not `7-x`.

## When You'll See This Pattern

This greedy approach of "always take the largest possible gain" appears in several types of problems:

1. **Minimum Operations to Reduce X to Zero** (LeetCode 1658): Similar concept of reducing a value to zero using the largest possible reductions from either end of an array.

2. **Maximum Units on a Truck** (LeetCode 1710): Greedily take boxes with the highest units per box first.

3. **Assign Cookies** (LeetCode 455): Greedily assign the smallest cookie that satisfies each child.

The pattern is: when you need to optimize something (minimize operations, maximize units, etc.) and each choice is independent with diminishing returns, sorting and taking the best option first often works.

## Key Takeaways

1. **Greedy with sorting**: When operations are independent and have different "values" (gains), sorting and taking the best first is often optimal.

2. **Think in terms of "gap reduction"**: Many equalization problems become easier when you frame them as reducing a gap to zero, rather than making two things equal.

3. **Check bounds and limits**: Always consider what the maximum possible change is (here, 1 to 6 bounds) - this defines your potential gains.

4. **Handle the trivial case first**: Check if you're already done (gap = 0) before doing any computation.

Related problems: [Number of Dice Rolls With Target Sum](/problem/number-of-dice-rolls-with-target-sum)
