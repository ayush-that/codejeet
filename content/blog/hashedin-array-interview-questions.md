---
title: "Array Questions at Hashedin: What to Expect"
description: "Prepare for Array interview questions at Hashedin — patterns, difficulty breakdown, and study tips."
date: "2030-07-19"
category: "dsa-patterns"
tags: ["hashedin", "array", "interview prep"]
---

If you're preparing for a HashedIn interview, you should be looking at your screen right now and thinking one thing: **arrays**. With 24 out of their 32 curated problems being array-based, this isn't just a topic—it's the entire playing field. This ratio is staggering compared to most companies, where arrays might share the spotlight with strings, trees, and dynamic programming. At HashedIn, array manipulation is treated as the fundamental test of a candidate's problem-solving clarity, code organization, and ability to handle in-place operations. It's not a secondary topic; it's the primary filter. In real interviews, you can almost guarantee your first coding question will involve an array, and the follow-ups will test how deeply you can optimize and extend your initial solution.

## Specific Patterns Hashedin Favors

HashedIn's array problems aren't about obscure mathematical tricks. They favor **applied, practical patterns** that software engineers use daily: sorting, searching, partitioning, and two-pointer techniques. You won't find heavy graph theory or complex recursive DP here. Instead, expect problems that test if you can do the simple things perfectly and efficiently.

Their problem set reveals a clear preference:

1.  **In-place Array Modification:** Problems like moving zeroes, removing duplicates, or rearranging elements (e.g., **Move Zeroes (#283)**, **Remove Duplicates from Sorted Array (#26)**). These test your understanding of space complexity and careful index management.
2.  **Two-Pointers (often with Sorting):** This is arguably their favorite technique. It's used for finding pairs, triples, or partitioning arrays. Problems like **Two Sum II - Input Array Is Sorted (#167)** and **3Sum (#15)** are classic examples. They love combining sorting with a two-pointer sweep.
3.  **Prefix Sum & Sliding Window:** For subarray problems involving sums or contiguous conditions. **Maximum Subarray (#53)** (Kadane's Algorithm) and **Subarray Sum Equals K (#560)** are core concepts here.
4.  **Cyclic Sort / Index-based Rearrangement:** A more advanced pattern for problems where numbers are in a fixed range (e.g., 1 to n). **Find All Duplicates in an Array (#442)** is a prime example. This pattern tests your ability to think about the array's indices as first-class data.

The emphasis is on **iterative logic** and **optimal space usage** (usually O(1) extra space). Recursive solutions are rarely the right answer for their array problems.

## How to Prepare

Master the two-pointer technique in its various forms. Let's look at a critical variation: the **"Opposite Ends" two-pointer**, used for problems like **Two Sum II** or partitioning.

<div class="code-group">

```python
def two_sum_sorted(numbers, target):
    """
    LeetCode #167: Two Sum II - Input Array Is Sorted
    Strategy: Use two pointers at opposite ends.
    Move the left pointer right if sum is too small.
    Move the right pointer left if sum is too large.
    Time: O(n) | Space: O(1)
    """
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            # Problem uses 1-based indexing
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1  # Need a larger sum
        else:  # current_sum > target
            right -= 1  # Need a smaller sum
    return []  # Problem guarantees a solution, but safe return

# Example usage:
# print(two_sum_sorted([2, 7, 11, 15], 9))  # Output: [1, 2]
```

```javascript
/**
 * LeetCode #167: Two Sum II - Input Array Is Sorted
 * Time: O(n) | Space: O(1)
 */
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    if (currentSum === target) {
      return [left + 1, right + 1]; // 1-based index
    } else if (currentSum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }
  return []; // Guaranteed solution exists
}
```

```java
// LeetCode #167: Two Sum II - Input Array Is Sorted
// Time: O(n) | Space: O(1)
public int[] twoSumSorted(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    while (left < right) {
        int currentSum = numbers[left] + numbers[right];
        if (currentSum == target) {
            return new int[]{left + 1, right + 1}; // 1-based index
        } else if (currentSum < target) {
            left++; // Need larger sum
        } else { // currentSum > target
            right--; // Need smaller sum
        }
    }
    return new int[]{}; // Guaranteed solution exists
}
```

</div>

Next, internalize the **"Fast & Slow" or "Reader/Writer" two-pointer** pattern for in-place operations. This is the workhorse for problems like **Remove Duplicates from Sorted Array**.

<div class="code-group">

```python
def remove_duplicates(nums):
    """
    LeetCode #26: Remove Duplicates from Sorted Array
    Strategy: Reader/Writer two-pointer.
    'write_index' points to the last position of the unique array.
    'read_index' explores the array.
    Time: O(n) | Space: O(1)
    """
    if not nums:
        return 0
    write_index = 1  # First element is always unique
    for read_index in range(1, len(nums)):
        if nums[read_index] != nums[read_index - 1]:
            nums[write_index] = nums[read_index]
            write_index += 1
    return write_index  # New length of array with unique elements

# Example: nums = [1,1,2,2,3,4,4]
# After function: nums becomes [1,2,3,4, ...] and returns 4.
```

```javascript
/**
 * LeetCode #26: Remove Duplicates from Sorted Array
 * Time: O(n) | Space: O(1)
 */
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let writeIndex = 1; // First element is always unique
  for (let readIndex = 1; readIndex < nums.length; readIndex++) {
    if (nums[readIndex] !== nums[readIndex - 1]) {
      nums[writeIndex] = nums[readIndex];
      writeIndex++;
    }
  }
  return writeIndex; // New length
}
```

```java
// LeetCode #26: Remove Duplicates from Sorted Array
// Time: O(n) | Space: O(1)
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int writeIndex = 1; // First element is always unique
    for (int readIndex = 1; readIndex < nums.length; readIndex++) {
        if (nums[readIndex] != nums[readIndex - 1]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }
    return writeIndex; // New length
}
```

</div>

## How Hashedin Tests Array vs Other Companies

Compared to FAANG companies, HashedIn's array questions are less about knowing esoteric algorithms and more about **flawless execution of fundamentals**. At a company like Google, an array problem might be a thin disguise for a graph search or require a non-intuitive combinatorial insight. At HashedIn, the challenge is in achieving O(1) space, handling all edge cases elegantly, and writing clean, maintainable code under pressure.

What's unique is their focus on **"in-place"** as a default expectation. Where another company might accept a solution using a hash map for a finding problem, HashedIn often looks for the solution that uses the array itself as the data structure. This tests a candidate's understanding of memory and references—a very practical skill for backend and systems work.

## Study Order

Tackle these sub-topics in this order to build a logical skill pyramid:

1.  **Basic Iteration & Counting:** Start with simple traversals and frequency counting. This builds comfort with array indices and loops. (e.g., **Contains Duplicate (#217)**).
2.  **Sorting & Custom Comparators:** Understand how to sort an array. Many optimal solutions start with a sorted array. Practice writing custom sort keys.
3.  **Two-Pointer Techniques:** Master this next. Start with opposite-ends pointers for sorted arrays, then learn the fast-slow pointer for in-place operations. This is the single most important pattern.
4.  **Prefix Sum & Sliding Window:** Learn to think about subarrays. Prefix sum helps with range queries, and the sliding window is essential for contiguous subarray problems.
5.  **Cyclic Sort:** Tackle this last. It's a specific but powerful pattern for problems with values in a fixed range. It requires a mental leap to use indices for storage.

This order works because each concept either builds on the previous (e.g., you often sort before using two-pointers) or introduces a new, distinct way of thinking (like the index-as-data model of cyclic sort).

## Recommended Practice Order

Solve these problems in sequence. Each introduces a slight twist on the core patterns.

1.  **Two Sum (#1)** - The classic hash map warm-up.
2.  **Best Time to Buy and Sell Stock (#121)** - Simple single pass, introduces the "track minimum so far" idea.
3.  **Contains Duplicate (#217)** - Basic iteration and set usage.
4.  **Move Zeroes (#283)** - Your first true in-place, two-pointer (reader/writer) problem.
5.  **Remove Duplicates from Sorted Array (#26)** - Reinforces the in-place two-pointer pattern.
6.  **Two Sum II - Input Array Is Sorted (#167)** - Introduces the opposite-ends two-pointer on a sorted array.
7.  **3Sum (#15)** - The natural and challenging extension of Two Sum II. Combines sorting, fixed-point iteration, and two-pointers.
8.  **Maximum Subarray (#53)** - Kadane's Algorithm, a must-know for subarray sums.
9.  **Find All Duplicates in an Array (#442)** - The entry point to cyclic sort thinking. Teaches you to use the array's indices for marking.
10. **Subarray Sum Equals K (#560)** - A more advanced problem combining prefix sums and hash maps. Tests if you can move beyond simple sliding windows.

This sequence takes you from basic familiarity to handling HashedIn's more complex, in-place array challenges. Remember, the goal isn't just to solve them, but to solve them with the optimal space complexity and clean code that you'd be proud to submit in a code review.

[Practice Array at Hashedin](/company/hashedin/array)
