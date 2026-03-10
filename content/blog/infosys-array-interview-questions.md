---
title: "Array Questions at Infosys: What to Expect"
description: "Prepare for Array interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-11-30"
category: "dsa-patterns"
tags: ["infosys", "array", "interview prep"]
---

If you're preparing for an Infosys technical interview, you'll quickly notice something striking: **Array problems dominate their question bank**. With 97 out of 158 total problems, arrays aren't just a topic—they are _the_ topic. This isn't a coincidence. Arrays are the fundamental data structure for representing sequential data, and mastery here tests core programming logic, index manipulation, and problem decomposition without the overhead of more complex structures. In real Infosys interviews, especially for entry and mid-level roles, you are almost guaranteed to face at least one array-based question. It's the company's primary filter for assessing clean, logical, and efficient coding ability.

## Specific Patterns Infosys Favors

Infosys's array problems tend to cluster around a few key, practical patterns. They favor **iterative logic and in-place manipulation** over heavy recursion or advanced data structures. The goal is to see if you can navigate indices correctly and transform data efficiently.

1.  **In-Place Array Modification:** This is their bread and butter. Problems where you must rearrange, segregate, or modify the array using constant extra space (`O(1)`). Think "move all zeros to the end" or "segregate even and odd numbers." It tests your ability to use two (or three) pointers wisely without creating a new array.
2.  **Prefix Sum and Sliding Window:** For subarray problems, Infosys frequently uses variations of these patterns. They are less interested in the most complex dynamic programming (DP) subarray problems and more in problems where a running total or a fixed/ variable-size window provides an efficient solution. **Two Sum (#1)** and its variants are classic examples here.
3.  **Cyclic Sort / Index-Based Rearrangement:** A subtle but powerful pattern for problems involving arrays containing numbers in a given range (e.g., `1 to n`). The ability to place numbers at their correct index by swapping is a highly valued trick.
4.  **Basic Multi-Pointer Logic:** Merging two sorted arrays, finding a pair with a target sum, or removing duplicates from a sorted array. These test fundamental algorithmic thinking.

You will see far fewer problems on advanced graph traversal (like Dijkstra) or complex recursive DP (like knapsack variations). Their array questions are grounded in applied, iterative logic.

## How to Prepare

Your preparation should focus on internalizing the pointer-manipulation patterns. Let's look at the most common one: the **Two-Pointer technique for in-place operations**.

Consider the problem: **Move all zeroes in an array to the end while maintaining the relative order of non-zero elements.** The brute-force approach involves creating a new array. The Infosys-preferred solution does it in-place.

The strategy: Use one pointer (`insert_pos`) to track the position where the next non-zero element should go, and another (`i`) to scan the array. Swap when you find a non-zero.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def moveZeroes(nums):
    """
    Moves all zeros to the end of the array in-place.
    Maintains the relative order of non-zero elements.
    """
    insert_pos = 0  # Tracks the position for the next non-zero element

    # First pass: move all non-zero elements to the front
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert_pos], nums[i] = nums[i], nums[insert_pos]
            insert_pos += 1
    # No return needed; modifying in-place

# Example:
# Input: [0,1,0,3,12]
# After loop iteration, nums becomes [1,3,12,0,0]
```

```javascript
// Time: O(n) | Space: O(1)
function moveZeroes(nums) {
  let insertPos = 0; // Tracks the position for the next non-zero element

  // Move non-zero elements forward
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      // Swap elements
      [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
      insertPos++;
    }
  }
  // Array is modified in-place
}
```

```java
// Time: O(n) | Space: O(1)
public void moveZeroes(int[] nums) {
    int insertPos = 0; // Tracks the position for the next non-zero element

    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            // Swap elements
            int temp = nums[insertPos];
            nums[insertPos] = nums[i];
            nums[i] = temp;
            insertPos++;
        }
    }
}
```

</div>

Another critical pattern is **Cyclic Sort**. It's optimal for problems like **Find All Numbers Disappeared in an Array (#448)**.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - ignoring the output list
def findDisappearedNumbers(nums):
    """
    Given an array nums of n integers where nums[i] is in [1, n],
    return an array of all integers in [1, n] that do not appear in nums.
    """
    i = 0
    n = len(nums)

    # Cyclic Sort: place each number at its correct index (num - 1)
    while i < n:
        correct_idx = nums[i] - 1
        # If the number is not already at its correct position, swap
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1

    # Find indices that do not contain the correct number
    disappeared = []
    for i in range(n):
        if nums[i] != i + 1:
            disappeared.append(i + 1)
    return disappeared
```

```javascript
// Time: O(n) | Space: O(1) - ignoring output array
function findDisappearedNumbers(nums) {
  let i = 0;
  const n = nums.length;

  // Cyclic Sort
  while (i < n) {
    const correctIdx = nums[i] - 1;
    if (nums[i] !== nums[correctIdx]) {
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
    } else {
      i++;
    }
  }

  // Find missing numbers
  const disappeared = [];
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      disappeared.push(i + 1);
    }
  }
  return disappeared;
}
```

```java
// Time: O(n) | Space: O(1) - ignoring the output list
public List<Integer> findDisappearedNumbers(int[] nums) {
    int i = 0;
    int n = nums.length;

    // Cyclic Sort
    while (i < n) {
        int correctIdx = nums[i] - 1;
        if (nums[i] != nums[correctIdx]) {
            int temp = nums[i];
            nums[i] = nums[correctIdx];
            nums[correctIdx] = temp;
        } else {
            i++;
        }
    }

    // Find indices that don't match
    List<Integer> disappeared = new ArrayList<>();
    for (i = 0; i < n; i++) {
        if (nums[i] != i + 1) {
            disappeared.add(i + 1);
        }
    }
    return disappeared;
}
```

</div>

## How Infosys Tests Array vs Other Companies

Compared to FAANG companies, Infosys's array questions are typically more **focused on correctness and clear logic** than on optimizing for the most esoteric edge cases or the absolute lowest time complexity. At companies like Google or Meta, you might get an array problem that is a thin disguise for a graph (Union-Find) or requires a non-obvious DP state definition. At Infosys, the array problem is usually just about the array.

The difficulty is often **"Easy" to "Medium"** on the LeetCode scale, but the emphasis is on writing **production-ready code** during the interview: clean, well-commented, with proper variable names and handling of edge cases (empty array, single element, large values). They care about the _how_ as much as the _what_. The unique aspect is their preference for problems that have a direct analogy to data processing tasks common in enterprise software—sorting, filtering, and transforming lists of records.

## Study Order

Tackle array topics in this logical progression to build a solid foundation:

1.  **Basic Iteration and Index Manipulation:** Before anything else, be comfortable looping through arrays, accessing elements, and handling off-by-one errors. This is non-negotiable.
2.  **Two-Pointer Techniques:** Start with opposite-end pointers (like in **Two Sum II - Input Array Is Sorted (#167)**), then move to same-direction pointers (like in **Remove Duplicates from Sorted Array (#26)**). This builds intuition for managing multiple indices.
3.  **Sliding Window:** Learn the fixed-size window first (e.g., **Maximum Average Subarray I (#643)**), then tackle variable-size windows (e.g., **Minimum Size Subarray Sum (#209)**). This pattern is crucial for subarray problems.
4.  **Prefix Sum:** Understand how to pre-compute running sums to answer subarray sum queries in O(1) time. This often pairs with hash map problems like **Subarray Sum Equals K (#560)**.
5.  **In-Place Operations:** Practice the "swap-and-move" logic shown in the `moveZeroes` example. This includes segregation problems (even/odd, colors for **Sort Colors (#75)**).
6.  **Cyclic Sort:** Specialize in this pattern for the "numbers in a range" problem family. It's a high-value, compact pattern.
7.  **Basic Binary Search on Arrays:** While less frequent, know how to apply binary search to rotated or sorted arrays (**Search in Rotated Sorted Array (#33)**).

This order works because each step uses skills from the previous one. You can't do efficient in-place operations without mastering two-pointers, and sliding window often feels like a dynamic application of the two-pointer concept.

## Recommended Practice Order

Solve these problems in sequence to build competency in the patterns Infosys uses:

1.  **Two Sum (#1)** - Hash map basics.
2.  **Remove Duplicates from Sorted Array (#26)** - Same-direction two-pointer.
3.  **Move Zeroes (#283)** - In-place modification (foundational).
4.  **Sort Colors (#75)** - In-place modification with three pointers.
5.  **Maximum Subarray (#53)** - Kadane's Algorithm (simple DP).
6.  **Merge Sorted Array (#88)** - Two-pointer from the end.
7.  **Find All Numbers Disappeared in an Array (#448)** - Master Cyclic Sort.
8.  **Maximum Average Subarray I (#643)** - Fixed-size sliding window.
9.  **Subarray Sum Equals K (#560)** - Prefix sum with hash map.
10. **Search in Rotated Sorted Array (#33)** - Binary search application.

Mastering these will cover the vast majority of patterns Infosys employs in their array-focused interviews. Remember, the goal is to write clear, efficient, and correct code under interview conditions.

[Practice Array at Infosys](/company/infosys/array)
