---
title: "How to Solve Count Pairs Whose Sum is Less than Target — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Pairs Whose Sum is Less than Target. Easy difficulty, 87.7% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2028-04-19"
category: "dsa-patterns"
tags:
  ["count-pairs-whose-sum-is-less-than-target", "array", "two-pointers", "binary-search", "easy"]
---

# How to Solve Count Pairs Whose Sum is Less than Target

This problem asks us to count all index pairs `(i, j)` in an array where `i < j` and `nums[i] + nums[j] < target`. While the problem statement is straightforward, the challenge lies in finding an efficient solution that doesn't require checking every possible pair. The key insight is that sorting the array enables us to use the two-pointer technique to count valid pairs in linear time after sorting.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 5, 2, 8, 1]` with `target = 7`.

**Step 1: Sort the array**  
First, we sort the array to enable efficient pair counting: `[1, 2, 3, 5, 8]`

**Step 2: Initialize two pointers**  
We'll use `left = 0` (pointing to the smallest element) and `right = len(nums)-1 = 4` (pointing to the largest element).

**Step 3: Count pairs**

- **First check**: `nums[left] + nums[right] = 1 + 8 = 9` which is NOT less than 7. Since the sum is too large, we move `right` leftward to try a smaller maximum: `right = 3`
- **Second check**: `1 + 5 = 6` which IS less than 7. This is a valid pair! More importantly, ALL pairs with `left=0` and any index between `left+1` and `right` are also valid because the array is sorted. So we add `(right - left) = 3 - 0 = 3` pairs to our count: `(1,2)`, `(1,3)`, `(1,5)` from the original indices. Then we move `left` rightward: `left = 1`
- **Third check**: `2 + 5 = 7` which is NOT less than 7 (it's equal). Move `right` leftward: `right = 2`
- **Fourth check**: `2 + 3 = 5` which IS less than 7. Add `(right - left) = 2 - 1 = 1` pair to our count: `(2,3)` from original indices. Move `left` rightward: `left = 2`
- **Fifth check**: Now `left = 2` and `right = 2`, so `left < right` is false. We stop.

**Result**: We found 4 valid pairs total.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)` where `i < j`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countPairsBruteForce(nums, target):
    count = 0
    n = len(nums)

    # Check every possible pair (i, j) where i < j
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] < target:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countPairsBruteForce(nums, target) {
  let count = 0;
  const n = nums.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] < target) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int countPairsBruteForce(int[] nums, int target) {
    int count = 0;
    int n = nums.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] < target) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this isn't optimal**: For an array of length `n`, there are `n*(n-1)/2` possible pairs, so this approach takes O(n²) time. With `n` up to 100 (as in many LeetCode constraints), this is 4950 operations, which is acceptable but not optimal. For larger constraints, this becomes prohibitively slow.

## Optimal Solution

The key optimization is to sort the array first. Once sorted, we can use the two-pointer technique to count all valid pairs in O(n) time after sorting. Here's how it works:

1. **Sort the array** - This allows us to make intelligent decisions about which pairs to check
2. **Initialize pointers** - `left` at the smallest element (index 0), `right` at the largest element (last index)
3. **Check and count**:
   - If `nums[left] + nums[right] < target`, then ALL pairs with this `left` and any index between `left+1` and `right` are valid (because the array is sorted, so those sums will be even smaller)
   - If the sum is too large, move `right` leftward to try a smaller maximum
   - If the sum is valid, count all those pairs and move `left` rightward to try the next smallest element

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def countPairs(nums, target):
    # Step 1: Sort the array to enable two-pointer technique
    nums.sort()

    # Step 2: Initialize pointers and counter
    left, right = 0, len(nums) - 1
    count = 0

    # Step 3: Use two-pointer technique to count valid pairs
    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum < target:
            # All pairs with current left and any index between left+1 and right are valid
            # because array is sorted, so nums[left] + nums[k] <= current_sum < target
            # for all k in (left, right]
            count += (right - left)
            # Move left pointer to try next smallest element
            left += 1
        else:
            # Sum is too large or equal to target, need smaller maximum
            # Move right pointer leftward
            right -= 1

    return count
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function countPairs(nums, target) {
  // Step 1: Sort the array to enable two-pointer technique
  nums.sort((a, b) => a - b); // Important: numeric sort, not lexicographic

  // Step 2: Initialize pointers and counter
  let left = 0;
  let right = nums.length - 1;
  let count = 0;

  // Step 3: Use two-pointer technique to count valid pairs
  while (left < right) {
    const currentSum = nums[left] + nums[right];

    if (currentSum < target) {
      // All pairs with current left and any index between left+1 and right are valid
      // because array is sorted, so nums[left] + nums[k] <= currentSum < target
      // for all k in (left, right]
      count += right - left;
      // Move left pointer to try next smallest element
      left++;
    } else {
      // Sum is too large or equal to target, need smaller maximum
      // Move right pointer leftward
      right--;
    }
  }

  return count;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
public int countPairs(int[] nums, int target) {
    // Step 1: Sort the array to enable two-pointer technique
    Arrays.sort(nums);

    // Step 2: Initialize pointers and counter
    int left = 0;
    int right = nums.length - 1;
    int count = 0;

    // Step 3: Use two-pointer technique to count valid pairs
    while (left < right) {
        int currentSum = nums[left] + nums[right];

        if (currentSum < target) {
            // All pairs with current left and any index between left+1 and right are valid
            // because array is sorted, so nums[left] + nums[k] <= currentSum < target
            // for all k in (left, right]
            count += (right - left);
            // Move left pointer to try next smallest element
            left++;
        } else {
            // Sum is too large or equal to target, need smaller maximum
            // Move right pointer leftward
            right--;
        }
    }

    return count;
}
```

</div>

**Why this works**: When we find that `nums[left] + nums[right] < target`, we know that for the current `left`, all elements from `left+1` to `right` will also form valid pairs with `left` because the array is sorted (so `nums[left] + nums[k] ≤ nums[left] + nums[right] < target` for any `k ≤ right`). This allows us to count `(right - left)` pairs at once instead of checking each one individually.

## Complexity Analysis

**Time Complexity**: O(n log n)

- Sorting the array takes O(n log n) time (using built-in sort like Timsort in Python, Merge sort in JavaScript/Java)
- The two-pointer traversal takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity**: O(1) or O(n) depending on the sorting algorithm

- For in-place sorting algorithms (like the one used in Python's `list.sort()`), space is O(1)
- For algorithms that create a new array (like JavaScript's `Array.sort()` may do), space is O(n)
- The two-pointer technique itself uses only O(1) extra space

## Common Mistakes

1. **Forgetting to sort the array**: This is the most common mistake. Without sorting, the two-pointer technique doesn't work because we can't guarantee that moving pointers in a certain direction will consistently increase or decrease the sum.

2. **Incorrect JavaScript sorting**: In JavaScript, `Array.sort()` without a comparator sorts lexicographically (alphabetically), not numerically. So `[10, 2, 5].sort()` becomes `[10, 2, 5]` (because '10' < '2' lexicographically). Always use `nums.sort((a, b) => a - b)` for numeric arrays.

3. **Off-by-one errors in pair counting**: When `current_sum < target`, the number of valid pairs with the current `left` is `(right - left)`, not `(right - left + 1)`. This is because we only count pairs where `i < j`, so when `left` and `right` point to the same index, that's not a valid pair.

4. **Misunderstanding the index requirement**: The problem asks for pairs `(i, j)` where `i < j`. After sorting, we lose the original indices, but that's okay because we're only counting the number of pairs, not returning the actual index pairs. If the problem required returning the original indices, we'd need a different approach.

## When You'll See This Pattern

The "sort + two pointers" pattern appears in many array problems where you need to find pairs satisfying certain conditions:

1. **Two Sum (sorted version)**: Find if there exists a pair summing to exactly `target`. After sorting, use two pointers to find the pair in O(n) time.

2. **3Sum**: Find all unique triplets that sum to zero. Sort the array, then for each element, use the two-pointer technique on the remaining subarray to find pairs that sum to the negative of the current element.

3. **Container With Most Water**: Find two lines that form a container holding the maximum water. Use two pointers starting at both ends, moving the pointer pointing to the shorter line inward.

4. **Count the Number of Fair Pairs**: A medium problem that extends this concept to count pairs where the sum is between `lower` and `upper` bounds.

The pattern is especially useful when:

- You need to find pairs/triplets satisfying a condition
- The condition involves comparing sums or products
- You can afford to sort the array (when original indices aren't needed)

## Key Takeaways

1. **When to sort**: If a problem asks about pairs/triplets and doesn't require preserving original indices, sorting is often the first step toward an efficient solution.

2. **Two-pointer intuition**: After sorting, if moving one pointer increases the sum and moving the other decreases it, you can use two pointers to efficiently explore the search space.

3. **Batch counting trick**: When you find a valid pair `(left, right)` in a sorted array, all pairs `(left, k)` for `left < k ≤ right` are also valid. This allows counting multiple pairs at once.

Remember: The two-pointer technique after sorting transforms an O(n²) brute force solution into an O(n log n) optimal solution, which is often the difference between passing and failing interview problems with large constraints.

Related problems: [Two Sum](/problem/two-sum), [Count the Number of Fair Pairs](/problem/count-the-number-of-fair-pairs)
