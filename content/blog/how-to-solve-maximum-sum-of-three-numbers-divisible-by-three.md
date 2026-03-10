---
title: "How to Solve Maximum Sum of Three Numbers Divisible by Three — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Sum of Three Numbers Divisible by Three. Medium difficulty, 47.7% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2029-10-06"
category: "dsa-patterns"
tags: ["maximum-sum-of-three-numbers-divisible-by-three", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Sum of Three Numbers Divisible by Three

You need to find the maximum sum of exactly three numbers from an array where the sum is divisible by three. What makes this problem interesting is that you can't just pick the three largest numbers—their sum might not be divisible by three. You need to consider the remainders when dividing by three to ensure divisibility while maximizing the sum.

## Visual Walkthrough

Let's trace through `nums = [3, 6, 5, 1, 8]`. We want the maximum sum of three numbers divisible by 3.

First, let's sort the array: `[1, 3, 5, 6, 8]`. The three largest numbers are 8, 6, and 5 with sum 19 (19 % 3 = 1), which doesn't work.

The key insight: When we take three numbers, the sum of their remainders modulo 3 must be divisible by 3. The possible remainder combinations are:

- 0 + 0 + 0 = 0
- 1 + 1 + 1 = 3 (divisible by 3)
- 2 + 2 + 2 = 6 (divisible by 3)
- 0 + 1 + 2 = 3 (divisible by 3)

So we need to track the largest numbers with each remainder (0, 1, 2). From our sorted array:

- Remainder 0: [3, 6] → largest three: [6, 3]
- Remainder 1: [1] → largest three: [1]
- Remainder 2: [5, 8] → largest three: [8, 5]

Now evaluate the valid combinations:

1. Three numbers with remainder 0: 6 + 3 + ? (we only have two numbers with remainder 0) → Not possible
2. Three numbers with remainder 1: 1 + ? + ? (only one number with remainder 1) → Not possible
3. Three numbers with remainder 2: 8 + 5 + ? (only two numbers with remainder 2) → Not possible
4. One from each remainder: Need largest from each → 6 (rem 0) + 1 (rem 1) + 8 (rem 2) = 15 ✓

Check if we can do better: What about 8 (rem 2) + 5 (rem 2) + 3 (rem 0) = 16? That's 16 % 3 = 1, not divisible by 3. So 15 is our answer.

## Brute Force Approach

The brute force solution tries all possible triplets using three nested loops. For each triplet, check if the sum is divisible by 3 and track the maximum sum.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def maxSumDivThree(nums):
    n = len(nums)
    max_sum = 0

    # Try all possible triplets
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                current_sum = nums[i] + nums[j] + nums[k]
                # Check if divisible by 3 and update max
                if current_sum % 3 == 0:
                    max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n³) | Space: O(1)
function maxSumDivThree(nums) {
  let maxSum = 0;
  const n = nums.length;

  // Try all possible triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const currentSum = nums[i] + nums[j] + nums[k];
        // Check if divisible by 3 and update max
        if (currentSum % 3 === 0) {
          maxSum = Math.max(maxSum, currentSum);
        }
      }
    }
  }

  return maxSum;
}
```

```java
// Time: O(n³) | Space: O(1)
public int maxSumDivThree(int[] nums) {
    int maxSum = 0;
    int n = nums.length;

    // Try all possible triplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                int currentSum = nums[i] + nums[j] + nums[k];
                // Check if divisible by 3 and update max
                if (currentSum % 3 == 0) {
                    maxSum = Math.max(maxSum, currentSum);
                }
            }
        }
    }

    return maxSum;
}
```

</div>

This approach is too slow for large arrays since it has O(n³) time complexity. For n = 10⁴, that's 10¹² operations—far too many.

## Optimized Approach

The key insight is that we only care about numbers' remainders when divided by 3. For the sum to be divisible by 3, the remainders must sum to a multiple of 3. As we saw earlier, valid combinations are:

1. Three numbers with remainder 0
2. Three numbers with remainder 1
3. Three numbers with remainder 2
4. One number from each remainder group (0, 1, 2)

We can track the largest numbers in each remainder group. For each group, we need up to the three largest numbers because:

- For cases 1-3, we need three numbers from the same group
- For case 4, we need one from each group

By keeping the three largest numbers in each remainder group, we can evaluate all valid combinations efficiently. We sort each group in descending order to easily access the largest numbers.

## Optimal Solution

Here's the efficient solution that groups numbers by remainder and checks all valid combinations:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxSumDivThree(nums):
    # Group numbers by their remainder when divided by 3
    remainder_groups = {0: [], 1: [], 2: []}

    # Add each number to its corresponding remainder group
    for num in nums:
        remainder = num % 3
        remainder_groups[remainder].append(num)

    # Sort each group in descending order to get largest numbers first
    for remainder in remainder_groups:
        remainder_groups[remainder].sort(reverse=True)

    max_sum = 0

    # Case 1: Three numbers with remainder 0
    if len(remainder_groups[0]) >= 3:
        max_sum = max(max_sum, sum(remainder_groups[0][:3]))

    # Case 2: Three numbers with remainder 1
    if len(remainder_groups[1]) >= 3:
        max_sum = max(max_sum, sum(remainder_groups[1][:3]))

    # Case 3: Three numbers with remainder 2
    if len(remainder_groups[2]) >= 3:
        max_sum = max(max_sum, sum(remainder_groups[2][:3]))

    # Case 4: One number from each remainder group
    if (len(remainder_groups[0]) >= 1 and
        len(remainder_groups[1]) >= 1 and
        len(remainder_groups[2]) >= 1):
        max_sum = max(max_sum,
                     remainder_groups[0][0] +
                     remainder_groups[1][0] +
                     remainder_groups[2][0])

    return max_sum
```

```javascript
// Time: O(n log n) | Space: O(n)
function maxSumDivThree(nums) {
  // Group numbers by their remainder when divided by 3
  const remainderGroups = { 0: [], 1: [], 2: [] };

  // Add each number to its corresponding remainder group
  for (const num of nums) {
    const remainder = num % 3;
    remainderGroups[remainder].push(num);
  }

  // Sort each group in descending order to get largest numbers first
  for (const remainder in remainderGroups) {
    remainderGroups[remainder].sort((a, b) => b - a);
  }

  let maxSum = 0;

  // Case 1: Three numbers with remainder 0
  if (remainderGroups[0].length >= 3) {
    const sum = remainderGroups[0][0] + remainderGroups[0][1] + remainderGroups[0][2];
    maxSum = Math.max(maxSum, sum);
  }

  // Case 2: Three numbers with remainder 1
  if (remainderGroups[1].length >= 3) {
    const sum = remainderGroups[1][0] + remainderGroups[1][1] + remainderGroups[1][2];
    maxSum = Math.max(maxSum, sum);
  }

  // Case 3: Three numbers with remainder 2
  if (remainderGroups[2].length >= 3) {
    const sum = remainderGroups[2][0] + remainderGroups[2][1] + remainderGroups[2][2];
    maxSum = Math.max(maxSum, sum);
  }

  // Case 4: One number from each remainder group
  if (
    remainderGroups[0].length >= 1 &&
    remainderGroups[1].length >= 1 &&
    remainderGroups[2].length >= 1
  ) {
    const sum = remainderGroups[0][0] + remainderGroups[1][0] + remainderGroups[2][0];
    maxSum = Math.max(maxSum, sum);
  }

  return maxSum;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

public int maxSumDivThree(int[] nums) {
    // Group numbers by their remainder when divided by 3
    List<Integer>[] remainderGroups = new ArrayList[3];
    for (int i = 0; i < 3; i++) {
        remainderGroups[i] = new ArrayList<>();
    }

    // Add each number to its corresponding remainder group
    for (int num : nums) {
        int remainder = num % 3;
        remainderGroups[remainder].add(num);
    }

    // Sort each group in descending order to get largest numbers first
    for (int i = 0; i < 3; i++) {
        remainderGroups[i].sort(Collections.reverseOrder());
    }

    int maxSum = 0;

    // Case 1: Three numbers with remainder 0
    if (remainderGroups[0].size() >= 3) {
        maxSum = Math.max(maxSum,
                         remainderGroups[0].get(0) +
                         remainderGroups[0].get(1) +
                         remainderGroups[0].get(2));
    }

    // Case 2: Three numbers with remainder 1
    if (remainderGroups[1].size() >= 3) {
        maxSum = Math.max(maxSum,
                         remainderGroups[1].get(0) +
                         remainderGroups[1].get(1) +
                         remainderGroups[1].get(2));
    }

    // Case 3: Three numbers with remainder 2
    if (remainderGroups[2].size() >= 3) {
        maxSum = Math.max(maxSum,
                         remainderGroups[2].get(0) +
                         remainderGroups[2].get(1) +
                         remainderGroups[2].get(2));
    }

    // Case 4: One number from each remainder group
    if (remainderGroups[0].size() >= 1 &&
        remainderGroups[1].size() >= 1 &&
        remainderGroups[2].size() >= 1) {
        maxSum = Math.max(maxSum,
                         remainderGroups[0].get(0) +
                         remainderGroups[1].get(0) +
                         remainderGroups[2].get(0));
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Grouping numbers by remainder: O(n)
- Sorting each of the three groups: In worst case, all numbers could be in one group, so O(n log n)
- Checking the four cases: O(1) since we only look at the first few elements of each group

**Space Complexity:** O(n)

- We store all numbers in the remainder groups, which collectively contain all n numbers
- The sorting may use O(log n) additional space for the recursion stack (depending on the sorting algorithm)

## Common Mistakes

1. **Only checking the three largest numbers**: Candidates often sort the entire array and take the three largest numbers, forgetting that their sum might not be divisible by 3. Always verify the divisibility condition.

2. **Not considering all valid remainder combinations**: Some candidates only check the "one from each remainder" case and forget that three numbers with the same remainder can also work (e.g., three numbers with remainder 1 sum to a multiple of 3).

3. **Insufficient numbers in remainder groups**: When checking each case, candidates might forget to verify that there are enough numbers in each remainder group before accessing them, leading to index errors.

4. **Sorting the entire array unnecessarily**: While sorting the entire array works, it's less efficient than just sorting the three remainder groups separately, especially when the array is large.

## When You'll See This Pattern

This problem uses **remainder grouping** and **greedy selection** of largest elements—patterns that appear in many coding problems:

1. **Two Sum** (LeetCode 1): While not identical, it teaches the concept of tracking complements (remainders in our case) to find pairs that sum to a target.

2. **Partition Array Into Three Parts With Equal Sum** (LeetCode 1013): Uses similar remainder logic to determine if an array can be partitioned.

3. **Make Sum Divisible by P** (LeetCode 1590): Requires finding subarrays with specific remainder properties, using similar modulo arithmetic.

4. **Continuous Subarray Sum** (LeetCode 523): Checks for subarrays with sums divisible by k using remainder tracking.

## Key Takeaways

1. **Modulo arithmetic simplifies divisibility problems**: When dealing with "divisible by k" constraints, consider grouping elements by their remainder modulo k. The sum's remainder equals the sum of individual remainders modulo k.

2. **Greedy selection works with sorting**: To maximize sum, always prefer larger numbers. Sorting each remainder group in descending order lets you easily pick the largest elements for each valid combination.

3. **Enumerate all valid cases systematically**: For problems with fixed-size selections (like triplets), enumerate all remainder combinations that satisfy the divisibility condition to ensure you don't miss any valid cases.

[Practice this problem on CodeJeet](/problem/maximum-sum-of-three-numbers-divisible-by-three)
