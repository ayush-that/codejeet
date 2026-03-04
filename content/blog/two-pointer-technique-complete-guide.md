---
title: "The Two Pointer Technique: A Complete Guide"
description: "Master the two pointer pattern — when to use it, common variations, and practice problems to solidify your understanding."
date: "2026-06-05"
category: "tips"
tags: ["two pointers", "arrays", "patterns", "interview prep"]
---

The two pointer technique reduces brute force O(n^2) solutions to O(n) by using two indices that move through a data structure in a coordinated way. If you are preparing for technical interviews, this is one of the first patterns you should internalize.

## When to Use Two Pointers

Two pointers work best when the problem involves a sorted array or linked list and you need to find pairs, triplets, or subarrays that satisfy some condition. The key signal is that a naive approach would require nested loops over the same data. If sorting the input first does not break the problem, two pointers can almost always replace that nested loop.

Look for these clues: "find a pair that sums to X," "remove duplicates in place," "determine if a string is a palindrome," or "merge two sorted arrays."

## The Three Main Variations

### Opposite-End Pointers

Place one pointer at the start and one at the end. Move them inward based on a condition. In Two Sum II (Input Array Is Sorted), if the sum is too small, increment `left`. If too large, decrement `right`. Each step eliminates possibilities, giving you O(n) instead of O(n^2).

Container With Most Water uses the same pattern -- you always move the pointer with the shorter height because moving the taller one can never increase the area.

**Example: Two Sum II - Input Array Is Sorted**
Given a 1-indexed sorted array of integers, find two numbers that add up to a specific target. The solution uses opposite-end pointers to find the pair in O(n) time.

<div class="code-group">

```python
def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            # Return 1-indexed positions
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]  # No solution found
```

```javascript
function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    if (currentSum === target) {
      // Return 1-indexed positions
      return [left + 1, right + 1];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1]; // No solution found
}
```

```java
public int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    while (left < right) {
        int currentSum = numbers[left] + numbers[right];
        if (currentSum == target) {
            // Return 1-indexed positions
            return new int[]{left + 1, right + 1};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{-1, -1}; // No solution found
}
```

</div>

### Same-Direction Pointers (Fast and Slow)

Both pointers start at the same position but move at different speeds. The classic use case is cycle detection in a linked list: slow moves one step, fast moves two. If they meet, there is a cycle.

This pattern also handles in-place array modifications. In Remove Duplicates from Sorted Array, the slow pointer marks the position of the next unique element while the fast pointer scans ahead.

The same-direction approach powers the "find middle of linked list" trick -- when the fast pointer reaches the end, the slow pointer is at the middle.

**Example: Remove Duplicates from Sorted Array**
Given a sorted array, remove duplicates in-place such that each unique element appears only once. Return the new length. The fast pointer (`j`) explores the array, while the slow pointer (`i`) tracks the position of the last unique element.

<div class="code-group">

```python
def removeDuplicates(nums):
    if not nums:
        return 0
    i = 0  # Slow pointer
    for j in range(1, len(nums)):  # Fast pointer
        if nums[j] != nums[i]:
            i += 1
            nums[i] = nums[j]
    return i + 1  # Length of unique elements
```

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let i = 0; // Slow pointer
  for (let j = 1; j < nums.length; j++) {
    // Fast pointer
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  return i + 1; // Length of unique elements
}
```

```java
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int i = 0; // Slow pointer
    for (int j = 1; j < nums.length; j++) { // Fast pointer
        if (nums[j] != nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1; // Length of unique elements
}
```

</div>

### Sliding Window (A Close Relative)

Sliding window is a variant where both pointers move in the same direction and define a range. The key difference: two pointers search for specific elements, while sliding window maintains a valid subarray or substring. We cover this in a [separate article](/blog/sliding-window-pattern-explained).

## Common Techniques

**Sorting first.** Three Sum sorts the array, fixes one element, then runs opposite-end pointers on the rest. If the problem does not say the input is sorted, consider whether sorting changes the answer.

**Skipping duplicates.** When the problem asks for unique results (like Three Sum returning unique triplets), skip duplicate values as you advance pointers past identical values.

**Multiple passes.** Trapping Rain Water can be solved with two passes (prefix max from left, suffix max from right) or with opposite-end pointers in a single pass.

**Example: Three Sum**
Find all unique triplets in an array that sum to zero. The solution involves sorting the array, then for each element, using opposite-end pointers to find pairs that sum to the negative of that element. Duplicate skipping is crucial.

<div class="code-group">

```python
def threeSum(nums):
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 2):
        # Skip duplicate starting elements
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, n - 1
        target = -nums[i]

        while left < right:
            current_sum = nums[left] + nums[right]
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                # Skip duplicates for left and right pointers
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    return result
```

```javascript
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    // Skip duplicate starting elements
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = n - 1;
    const target = -nums[i];

    while (left < right) {
      const currentSum = nums[left] + nums[right];
      if (currentSum === target) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        // Skip duplicates for left and right pointers
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (currentSum < target) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}
```

```java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;

    for (int i = 0; i < n - 2; i++) {
        // Skip duplicate starting elements
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        int left = i + 1;
        int right = n - 1;
        int target = -nums[i];

        while (left < right) {
            int currentSum = nums[left] + nums[right];
            if (currentSum == target) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++;
                right--;
                // Skip duplicates for left and right pointers
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}
```

</div>

## Complexity

Two pointer solutions run in O(n) time for a single pass, or O(n log n) when sorting is required. Space complexity is typically O(1) for in-place operations, though some problems like Three Sum require O(k) space for storing results (where k is the number of valid combinations).

**Time Complexity Breakdown:**

- **Opposite-End Pointers:** O(n) for a single pass through the array
- **Same-Direction Pointers:** O(n) for a single traversal
- **With Sorting:** O(n log n) for the sort plus O(n) for pointer operations = O(n log n) overall

**Space Complexity:**

- Most two pointer solutions use O(1) extra space
- Exceptions include problems that require storing results (like Three Sum) or recursive implementations

## Practice Problems

1. **Valid Palindrome** -- Basic opposite-end check. Check if a string reads the same forward and backward, ignoring non-alphanumeric characters and case.

2. **Two Sum II (Input Array Is Sorted)** -- Classic opposite-end pair finding. As shown in the example above.

3. **Remove Duplicates from Sorted Array** -- Same-direction pointer for in-place modification. As shown in the example above.

4. **Three Sum** -- Sorting, fixing one element, and running two pointers. Practice skipping duplicates. As shown in the example above.

5. **Container With Most Water** -- Opposite-end with a greedy argument for which pointer to move. Given an array of heights, find two lines that together with the x-axis form a container that holds the most water.

6. **Trapping Rain Water** -- Try both the prefix/suffix approach and the two pointer O(1) space approach. Given an elevation map, compute how much water it can trap after raining.

**Example: Container With Most Water**
This problem demonstrates the greedy nature of opposite-end pointers. You always move the pointer with the smaller height, as moving the taller pointer cannot possibly increase the area.

<div class="code-group">

```python
def maxArea(height):
    left, right = 0, len(height) - 1
    max_area = 0

    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        max_area = max(max_area, current_area)

        # Move the pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_area
```

```javascript
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    // Calculate current area
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    const currentArea = width * currentHeight;
    maxArea = Math.max(maxArea, currentArea);

    // Move the pointer with smaller height
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
}
```

```java
public int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int maxArea = 0;

    while (left < right) {
        // Calculate current area
        int width = right - left;
        int currentHeight = Math.min(height[left], height[right]);
        int currentArea = width * currentHeight;
        maxArea = Math.max(maxArea, currentArea);

        // Move the pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}
```

</div>

Find related problems organized by company on the [CodeJeet dashboard](/dashboard). Companies like [Google](/company/google) and [Amazon](/company/amazon) frequently test two pointer variations.

When you see a problem involving arrays, strings, or linked lists, ask yourself: "Can I solve this with two indices instead of nested loops?" Drill the three variations until they feel automatic, and you will recognize the pattern within seconds during an interview.

## Advanced Applications and Edge Cases

**Linked List Problems:** The fast and slow pointer technique is essential for linked list problems beyond cycle detection. It can be used to find the middle node, detect palindromes in linked lists, or find the kth node from the end.

**String Manipulation:** Two pointers are frequently used in string problems for tasks like comparing strings with backspaces, checking subsequences, or compressing strings in-place.

**Multiple Pointer Variations:** Some problems require more than two pointers. For example, the Four Sum problem can be solved by extending the Three Sum approach with an additional outer loop.

**Non-Sorted Arrays:** While two pointers typically work best with sorted data, some problems with unsorted arrays can still benefit from this technique when combined with other data structures like hash maps.

**Memory-Efficient Solutions:** Two pointer techniques often provide the most memory-efficient solutions, making them ideal for environments with strict memory constraints or when working with very large datasets.
