---
title: "How to Solve 3Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode 3Sum. Medium difficulty, 38.6% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2026-02-13"
category: "dsa-patterns"
tags: ["3sum", "array", "two-pointers", "sorting", "medium"]
---

# How to Solve 3Sum

The 3Sum problem asks us to find all unique triplets in an array that sum to zero. What makes this problem tricky is the combination of two challenges: we need to find three numbers that sum to a target (0), and we must avoid duplicate triplets in our result. This is a classic interview question because it builds on the simpler Two Sum problem while introducing sorting and two-pointer techniques.

## Visual Walkthrough

Let's walk through an example step by step. Consider the input array: `[-1, 0, 1, 2, -1, -4]`.

**Step 1: Sort the array**
First, we sort the array to make it easier to avoid duplicates and use the two-pointer technique. After sorting: `[-4, -1, -1, 0, 1, 2]`.

**Step 2: Fix the first element and find pairs that sum to the complement**
We'll iterate through the array, treating each element as the potential first element of a triplet. For each fixed element at index `i`, we need to find two other elements whose sum equals `-nums[i]` (since we want all three to sum to 0).

**Step 3: Use two pointers to find pairs**
For `i = 0`, `nums[i] = -4`. We need two numbers that sum to `4`. We set `left = i+1 = 1` and `right = len(nums)-1 = 5`.

- `nums[left] = -1`, `nums[right] = 2`, sum = `1` (too small, move left pointer right)
- `nums[left] = -1`, `nums[right] = 2`, sum = `1` (still too small, move left)
- `nums[left] = 0`, `nums[right] = 2`, sum = `2` (too small, move left)
- `nums[left] = 1`, `nums[right] = 2`, sum = `3` (too small, move left)
- Now `left = 5`, which equals `right`, so no valid pair for `-4`.

**Step 4: Handle duplicates**
For `i = 1`, `nums[i] = -1`. We need two numbers that sum to `1`. Set `left = 2`, `right = 5`.

- `nums[left] = -1`, `nums[right] = 2`, sum = `1` (perfect! Add `[-1, -1, 2]` to results)
- Move both pointers: `left = 3`, `right = 4`
- `nums[left] = 0`, `nums[right] = 1`, sum = `1` (perfect! Add `[-1, 0, 1]` to results)

When we move to `i = 2`, `nums[i] = -1`, which is the same as the previous element. To avoid duplicate triplets, we skip this element entirely.

**Step 5: Continue through all elements**
We continue this process for all `i` from `0` to `len(nums)-3`. The final result is `[[-1, -1, 2], [-1, 0, 1]]`.

## Brute Force Approach

The most straightforward approach is to check every possible triplet in the array. We would use three nested loops to generate all combinations of three indices `(i, j, k)` where `i < j < k`, check if their sum equals zero, and add valid triplets to our result while avoiding duplicates.

The problem with this approach is its time complexity: O(n³) for the three nested loops, plus additional overhead for checking duplicates. For an array of size 1000, that's 1 billion operations - far too slow for typical constraints.

Even if we try to optimize by using a hash set to store results and avoid duplicates, the O(n³) time complexity remains unacceptable. We need a more efficient approach.

## Optimized Approach

The key insight is that we can reduce the problem from finding three numbers to finding two numbers that sum to a specific target. For each element `nums[i]`, we need to find two other elements whose sum equals `-nums[i]`. This transforms our 3Sum problem into multiple 2Sum problems.

Here's the step-by-step reasoning:

1. **Sort the array first** - This allows us to:
   - Skip duplicate elements easily to avoid duplicate triplets
   - Use the two-pointer technique efficiently

2. **For each element `nums[i]` as the first element of a potential triplet**:
   - Calculate `target = -nums[i]` (the sum we need from the other two elements)
   - Use two pointers (`left` starting at `i+1`, `right` starting at `n-1`) to find pairs that sum to `target`
   - If the sum of `nums[left] + nums[right]` equals `target`, we found a valid triplet
   - If the sum is less than `target`, move `left` pointer right (to increase the sum)
   - If the sum is greater than `target`, move `right` pointer left (to decrease the sum)

3. **Handle duplicates carefully**:
   - Skip duplicate values for `nums[i]` to avoid duplicate triplets starting with the same value
   - When we find a valid triplet, skip duplicate values for both `left` and `right` pointers

This approach reduces the time complexity from O(n³) to O(n²) - O(n log n) for sorting plus O(n²) for the main algorithm.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) - We iterate through each element (n) and for each,
#               use two pointers (n) to find pairs
# Space: O(1) or O(n) depending on sorting implementation
#        (O(n) if we count the space needed for output, but O(1) extra space)
def threeSum(nums):
    """
    Find all unique triplets in the array that sum to zero.

    Args:
        nums: List of integers

    Returns:
        List of lists, each containing three integers that sum to zero
    """
    result = []
    n = len(nums)

    # Step 1: Sort the array to enable two-pointer technique and easy duplicate skipping
    nums.sort()

    # Step 2: Iterate through each element as potential first element of triplet
    for i in range(n - 2):  # We need at least 3 elements, so stop at n-2
        # Skip duplicate values for the first element to avoid duplicate triplets
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        # Step 3: For current nums[i], find two numbers that sum to -nums[i]
        target = -nums[i]
        left, right = i + 1, n - 1  # Two pointers starting after i and at the end

        while left < right:
            current_sum = nums[left] + nums[right]

            if current_sum == target:
                # Found a valid triplet
                result.append([nums[i], nums[left], nums[right]])

                # Skip duplicate values for left pointer
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                # Skip duplicate values for right pointer
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1

                # Move both pointers after processing current valid pair
                left += 1
                right -= 1

            elif current_sum < target:
                # Sum is too small, move left pointer right to increase sum
                left += 1
            else:
                # Sum is too large, move right pointer left to decrease sum
                right -= 1

    return result
```

```javascript
// Time: O(n²) - Sorting takes O(n log n), two-pointer search takes O(n²)
// Space: O(1) or O(n) depending on sorting implementation
function threeSum(nums) {
  const result = [];
  const n = nums.length;

  // Step 1: Sort the array to enable two-pointer technique
  nums.sort((a, b) => a - b);

  // Step 2: Iterate through each element as potential first element
  for (let i = 0; i < n - 2; i++) {
    // Skip duplicate values for the first element
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    // Step 3: For current nums[i], find two numbers that sum to -nums[i]
    const target = -nums[i];
    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const currentSum = nums[left] + nums[right];

      if (currentSum === target) {
        // Found a valid triplet
        result.push([nums[i], nums[left], nums[right]]);

        // Skip duplicate values for left pointer
        while (left < right && nums[left] === nums[left + 1]) {
          left++;
        }
        // Skip duplicate values for right pointer
        while (left < right && nums[right] === nums[right - 1]) {
          right--;
        }

        // Move both pointers after processing current valid pair
        left++;
        right--;
      } else if (currentSum < target) {
        // Sum is too small, move left pointer right
        left++;
      } else {
        // Sum is too large, move right pointer left
        right--;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n²) - Sorting takes O(n log n), two-pointer search takes O(n²)
// Space: O(1) or O(n) depending on sorting implementation
import java.util.*;

public List<List<Integer>> threeSum(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;

    // Step 1: Sort the array to enable two-pointer technique
    Arrays.sort(nums);

    // Step 2: Iterate through each element as potential first element
    for (int i = 0; i < n - 2; i++) {
        // Skip duplicate values for the first element
        if (i > 0 && nums[i] == nums[i - 1]) {
            continue;
        }

        // Step 3: For current nums[i], find two numbers that sum to -nums[i]
        int target = -nums[i];
        int left = i + 1;
        int right = n - 1;

        while (left < right) {
            int currentSum = nums[left] + nums[right];

            if (currentSum == target) {
                // Found a valid triplet
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));

                // Skip duplicate values for left pointer
                while (left < right && nums[left] == nums[left + 1]) {
                    left++;
                }
                // Skip duplicate values for right pointer
                while (left < right && nums[right] == nums[right - 1]) {
                    right--;
                }

                // Move both pointers after processing current valid pair
                left++;
                right--;
            } else if (currentSum < target) {
                // Sum is too small, move left pointer right
                left++;
            } else {
                // Sum is too large, move right pointer left
                right--;
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Sorting the array takes O(n log n) time
- The main loop runs O(n) times (for each element as the first element)
- For each iteration of the main loop, the two-pointer search takes O(n) time in the worst case
- Total: O(n log n) + O(n²) = O(n²) since O(n²) dominates for large n

**Space Complexity: O(1) or O(n)**

- The space complexity depends on the sorting algorithm implementation:
  - Some sorting algorithms (like Timsort in Python) use O(n) space
  - Others (like quicksort) use O(log n) space for recursion stack
- If we don't count the space needed for the output, the algorithm uses O(1) extra space (just a few pointers and variables)
- If we count the output, it's O(k) where k is the number of triplets, which in worst case could be O(n²)

## Common Mistakes

1. **Forgetting to sort the array first**: The two-pointer technique only works on sorted arrays. Without sorting, you can't guarantee that moving pointers in the correct direction will help you find the target sum.

2. **Not handling duplicates properly**: This is the most common mistake. Candidates often find all triplets but then struggle to remove duplicates. The key is to skip duplicate values at three points:
   - When choosing the first element (`nums[i]`)
   - After finding a valid triplet, skip duplicate values for the left pointer
   - After finding a valid triplet, skip duplicate values for the right pointer

3. **Incorrect pointer movement**: When `current_sum < target`, you need to move the left pointer right (to increase the sum). When `current_sum > target`, move the right pointer left (to decrease the sum). Mixing these up will cause infinite loops or missed solutions.

4. **Off-by-one errors in loops**: The outer loop should go up to `n-2` (not `n-1` or `n`) because we need at least three elements to form a triplet. Similarly, the left pointer starts at `i+1`, not `i`.

## When You'll See This Pattern

The two-pointer technique on a sorted array is a powerful pattern that appears in many problems:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: The simpler version where you find two numbers that sum to a target in a sorted array.

2. **3Sum Closest (LeetCode 16)**: Almost identical to 3Sum, but instead of finding exact matches to zero, you find the triplet with the sum closest to a given target.

3. **4Sum (LeetCode 18)**: An extension where you need to find quadruplets that sum to a target. The solution often involves adding an extra loop and using the same two-pointer technique.

4. **Container With Most Water (LeetCode 11)**: Uses two pointers moving inward from both ends, though with different movement logic based on height comparisons.

## Key Takeaways

1. **Sorting enables efficient searching**: Many array problems become much easier when the array is sorted. Sorting allows us to use techniques like binary search and two-pointer approaches.

2. **Reduce complex problems to simpler ones**: 3Sum reduces to multiple 2Sum problems. This pattern of reducing a k-Sum problem to a (k-1)-Sum problem is common and can be extended to 4Sum, 5Sum, etc.

3. **Handle duplicates at the source**: Instead of finding all solutions and then removing duplicates (which is inefficient), it's better to skip duplicate values during the search process. This is more efficient and cleaner.

Related problems: [Two Sum](/problem/two-sum), [3Sum Closest](/problem/3sum-closest), [4Sum](/problem/4sum)
