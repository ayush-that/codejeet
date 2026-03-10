---
title: "How to Solve Count Hills and Valleys in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Hills and Valleys in an Array. Easy difficulty, 69.1% acceptance rate. Topics: Array."
date: "2026-04-06"
category: "dsa-patterns"
tags: ["count-hills-and-valleys-in-an-array", "array", "easy"]
---

# How to Solve Count Hills and Valleys in an Array

This problem asks us to count how many indices in an array qualify as either hills or valleys. A hill occurs when an element is greater than its closest non-equal neighbors, while a valley occurs when it's smaller than those neighbors. The tricky part is handling plateaus—consecutive equal values—where we need to look beyond immediate neighbors to find the first different value on each side to determine the true "slope."

## Visual Walkthrough

Let's trace through example `nums = [2, 4, 1, 1, 6, 5]`:

**Index 0 (value 2):** Only has a right neighbor. We need both neighbors to classify, so skip.

**Index 1 (value 4):**

- Left neighbor is 2 (different, so we can use it directly)
- Right neighbor is 1 (different, so we can use it directly)
- 4 > 2 and 4 > 1 → This is a hill ✓

**Index 2 (value 1):**

- Left neighbor is 4 (different, so we can use it)
- Right neighbor is also 1 (equal, so we need to find the first different value to the right)
- Looking right: index 3 is 1 (equal), index 4 is 6 (different)
- So right "neighbor" is 6
- 1 < 4 and 1 < 6 → This is a valley ✓

**Index 3 (value 1):**

- Left: index 2 is 1 (equal), so find first different left: index 1 is 4
- Right: index 4 is 6 (different)
- 1 < 4 and 1 < 6 → This is also a valley ✓

Wait—indices 2 and 3 are part of the same valley! The problem says we should count each index individually, even if they're in the same plateau. So both count.

**Index 4 (value 6):**

- Left: index 3 is 1 (different)
- Right: index 5 is 5 (different)
- 6 > 1 and 6 > 5 → This is a hill ✓

**Index 5 (value 5):** Only has left neighbor, so skip.

Total: 1 hill + 2 valleys = 3. But wait, we double-counted the valley! Actually, the problem states we should count each index where the condition holds. Let's check the exact definition more carefully.

Looking at the problem statement again: "An index i is part of a hill in nums if the closest non-equal neighbors of i are smaller than nums[i]." For index 3, the closest non-equal neighbors are 4 (left) and 6 (right). Since 1 < 4 and 1 < 6, it's a valley. So yes, both indices 2 and 3 qualify as valleys.

Final count: hills at indices 1 and 4, valleys at indices 2 and 3 = 4 total.

## Brute Force Approach

A naive approach would be: for each index i, scan left until we find a different value, scan right until we find a different value, then compare. This would be O(n²) in the worst case (like when all values are equal except the ends).

Actually, let's think about what makes this inefficient. If we have `[1, 1, 1, 1, 1, 2]`, for index 0 we'd scan right through 4 equal values before finding 2. For index 1, we'd do the same. This repeated scanning gives us O(n²) time complexity.

Here's what the brute force might look like:

```python
def countHillValley_brute(nums):
    count = 0
    n = len(nums)

    for i in range(1, n - 1):  # Skip first and last
        # Find left neighbor (first different value to the left)
        left = i - 1
        while left >= 0 and nums[left] == nums[i]:
            left -= 1

        # Find right neighbor (first different value to the right)
        right = i + 1
        while right < n and nums[right] == nums[i]:
            right += 1

        # Check if we found valid neighbors on both sides
        if left >= 0 and right < n:
            if nums[i] > nums[left] and nums[i] > nums[right]:
                count += 1  # Hill
            elif nums[i] < nums[left] and nums[i] < nums[right]:
                count += 1  # Valley

    return count
```

This works but is inefficient. For an array like `[1, 1, 1, 1, 1]`, each index would scan almost the entire array, giving O(n²) time.

## Optimal Solution

The key insight is that we don't need to rescan for each index. We can preprocess the array to collapse consecutive duplicates, or better yet, we can traverse the array once and compare each element with the last "different" value we've seen.

Here's the optimal approach:

1. Traverse the array from left to right
2. Keep track of the last value that was different from the current one
3. For each position, check if it forms a hill or valley with the previous different value and the next different value
4. Skip the first and last elements since they don't have both neighbors

Actually, there's an even cleaner approach: First, remove consecutive duplicates to create a "compressed" array where adjacent elements are always different. Then, count hills and valleys in this compressed array (excluding first and last). Each hill/valley in the compressed array corresponds to one or more indices in the original array.

Wait, but we need to count each index in the original array. If we have `[2, 4, 1, 1, 6, 5]`, compressing gives `[2, 4, 1, 6, 5]`. The valley at value 1 in the compressed array corresponds to 2 indices in the original array. So we need to track how many original indices each compressed element represents.

Actually, there's a simpler way: We can iterate through the original array and for each index, find its effective left and right neighbors by looking for the next different values. But we can do this efficiently by skipping over consecutive duplicates as we iterate.

Here's the most efficient approach: Iterate through indices 1 to n-2. For each index i, find the nearest different neighbor to the left and right. But instead of scanning each time, we can use two pointers or track the last different value.

The cleanest solution: First create a new array with no consecutive duplicates. Then count hills and valleys in that array (excluding first and last). The count from the compressed array equals the count in the original array because:

- Each hill/valley in compressed array corresponds to at least one index in original
- No hill/valley in original is missed because consecutive equal values don't change the hill/valley status

Let's implement this:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the compressed array
def countHillValley(nums):
    """
    Counts the number of hills and valleys in the array.
    A hill is when an element is greater than its closest non-equal neighbors.
    A valley is when an element is smaller than its closest non-equal neighbors.
    """
    # Step 1: Create compressed array without consecutive duplicates
    compressed = []
    for num in nums:
        # Only add if it's different from the last element in compressed
        if not compressed or num != compressed[-1]:
            compressed.append(num)

    # Step 2: Count hills and valleys in compressed array
    # (excluding first and last elements since they don't have both neighbors)
    count = 0
    for i in range(1, len(compressed) - 1):
        left, curr, right = compressed[i-1], compressed[i], compressed[i+1]

        # Check if current element is a hill (greater than both neighbors)
        if curr > left and curr > right:
            count += 1
        # Check if current element is a valley (smaller than both neighbors)
        elif curr < left and curr < right:
            count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(n) for the compressed array
function countHillValley(nums) {
  /**
   * Counts the number of hills and valleys in the array.
   * A hill is when an element is greater than its closest non-equal neighbors.
   * A valley is when an element is smaller than its closest non-equal neighbors.
   */

  // Step 1: Create compressed array without consecutive duplicates
  const compressed = [];
  for (const num of nums) {
    // Only add if it's different from the last element in compressed
    if (compressed.length === 0 || num !== compressed[compressed.length - 1]) {
      compressed.push(num);
    }
  }

  // Step 2: Count hills and valleys in compressed array
  // (excluding first and last elements since they don't have both neighbors)
  let count = 0;
  for (let i = 1; i < compressed.length - 1; i++) {
    const left = compressed[i - 1];
    const curr = compressed[i];
    const right = compressed[i + 1];

    // Check if current element is a hill (greater than both neighbors)
    if (curr > left && curr > right) {
      count++;
    }
    // Check if current element is a valley (smaller than both neighbors)
    else if (curr < left && curr < right) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n) for the compressed list
class Solution {
    public int countHillValley(int[] nums) {
        /**
         * Counts the number of hills and valleys in the array.
         * A hill is when an element is greater than its closest non-equal neighbors.
         * A valley is when an element is smaller than its closest non-equal neighbors.
         */

        // Step 1: Create compressed list without consecutive duplicates
        List<Integer> compressed = new ArrayList<>();
        for (int num : nums) {
            // Only add if it's different from the last element in compressed
            if (compressed.isEmpty() || num != compressed.get(compressed.size() - 1)) {
                compressed.add(num);
            }
        }

        // Step 2: Count hills and valleys in compressed list
        // (excluding first and last elements since they don't have both neighbors)
        int count = 0;
        for (int i = 1; i < compressed.size() - 1; i++) {
            int left = compressed.get(i - 1);
            int curr = compressed.get(i);
            int right = compressed.get(i + 1);

            // Check if current element is a hill (greater than both neighbors)
            if (curr > left && curr > right) {
                count++;
            }
            // Check if current element is a valley (smaller than both neighbors)
            else if (curr < left && curr < right) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the array to create the compressed version: O(n)
- We make another pass through the compressed array to count hills/valleys: O(m) where m ≤ n
- Total: O(n) + O(m) = O(n)

**Space Complexity: O(n)** in the worst case

- In the worst case (no consecutive duplicates), the compressed array has the same size as the input: O(n)
- In the best case (all elements equal), the compressed array has size 1: O(1)
- We could optimize to O(1) extra space by comparing in-place, but the compressed array approach is clearer and easier to reason about

## Common Mistakes

1. **Not handling plateaus correctly**: The most common mistake is comparing with immediate neighbors instead of finding the closest non-equal neighbors. For `[3, 2, 2, 1]`, index 2 (value 2) has immediate neighbors 2 and 1, but its closest non-equal neighbors are 3 and 1.

2. **Double-counting or missing indices in plateaus**: In `[2, 4, 1, 1, 6, 5]`, both indices 2 and 3 are valleys. Some solutions might count only one because they think "it's the same valley," but the problem asks to count each index that satisfies the condition.

3. **Incorrect boundary handling**: Remember that the first and last elements cannot be hills or valleys because they don't have both neighbors. Always start from index 1 and end at index n-2 (or equivalent in compressed array).

4. **Forgetting to check both conditions separately**: A hill requires `nums[i] > left AND nums[i] > right`. A valley requires `nums[i] < left AND nums[i] < right`. Using `if-else` without proper conditions might miss some cases.

## When You'll See This Pattern

This problem uses the "array compression" or "run-length encoding" pattern where consecutive duplicates are treated as a single unit. You'll see similar patterns in:

1. **Remove Duplicates from Sorted Array (Easy)**: Similar compression technique to remove duplicates in-place.
2. **Monotonic Array (Easy)**: Checking if an array is entirely non-increasing or non-decreasing often involves skipping through plateaus.
3. **Find Peak Element (Medium)**: Finding local maxima in an array, though that problem allows plateaus to be treated differently.
4. **Wiggle Sort (Medium)**: Creating sequences that alternate between increasing and decreasing, often requiring comparison with non-equal neighbors.

The core idea is recognizing when consecutive equal values should be treated as a single entity for comparison purposes.

## Key Takeaways

1. **Plateaus matter**: When dealing with "local" properties (hills, valleys, peaks), consecutive equal values form plateaus that should be treated as a single unit. Always look for the nearest _different_ value when making comparisons.

2. **Compression simplifies**: Creating a compressed version of the array (removing consecutive duplicates) often makes problems easier to reason about and implement correctly.

3. **Boundaries are special**: First and last elements in an array often need special handling because they don't have both neighbors. Always consider edge cases explicitly.

4. **Count indices, not features**: In this problem, we count each index that satisfies the condition, not each "hill" or "valley" as a geographical feature. Two adjacent indices can both be part of the same valley but still count separately.

Related problems: [Find Peak Element](/problem/find-peak-element), [Monotonic Array](/problem/monotonic-array), [Minimum Subsequence in Non-Increasing Order](/problem/minimum-subsequence-in-non-increasing-order)
