---
title: "Array Questions at Oracle: What to Expect"
description: "Prepare for Array interview questions at Oracle — patterns, difficulty breakdown, and study tips."
date: "2027-06-29"
category: "dsa-patterns"
tags: ["oracle", "array", "interview prep"]
---

With 160 Array questions out of 340 total on their tagged LeetCode list, arrays aren't just a topic at Oracle—they are the dominant data structure you must master. This isn't a coincidence. Oracle's core products—databases, cloud infrastructure, enterprise software—are fundamentally about storing, retrieving, and manipulating ordered data. Think rows in a database table, entries in a log file, or packets in a network stream. Your interview will almost certainly involve an array problem, not as a trivial warm-up, but as the main algorithmic challenge designed to test your grasp of fundamentals, optimization, and clean implementation under pressure.

## Specific Patterns Oracle Favors

Oracle's array problems tend to avoid esoteric, purely mathematical tricks. Instead, they favor practical patterns that mirror real-world data processing tasks. You'll see a heavy emphasis on:

1.  **In-place Array Modification:** This is a hallmark. Questions often require rearranging or partitioning an array without allocating significant extra space, testing your ability to manipulate indices carefully. Problems like **Move Zeroes (#283)** and **Remove Duplicates from Sorted Array (#26)** are classic examples.
2.  **Prefix Sum and Sliding Window:** For problems involving subarrays, Oracle frequently uses these patterns. They test your ability to optimize from a naive O(n²) or O(n³) solution to an elegant O(n) one. Look for problems asking for sums, products, or counts of contiguous subarrays that meet a condition, such as **Maximum Subarray (#53)** (Kadane's Algorithm, a special case of sliding window) and **Subarray Sum Equals K (#560)**.
3.  **Two-Pointer and Multi-Pointer Techniques:** This is crucial for sorted arrays or when comparing/combining elements from different positions. It's the go-to strategy for problems like **Two Sum II - Input Array Is Sorted (#167)** and **3Sum (#15)**.
4.  **Simulation on a 2D Array (Matrix):** Oracle doesn't shy away from 2D arrays, often framing them as matrix traversal or modification problems. These test your control flow and index arithmetic. **Spiral Matrix (#54)** and **Rotate Image (#48)** are quintessential.

You'll notice a distinct _lack_ of heavy recursion or complex dynamic programming on arrays. The focus is on iterative, pointer-driven logic.

## How to Prepare

Mastery comes from internalizing the patterns, not memorizing problems. For the core pattern of **in-place modification with two pointers**, let's break it down. The mental model is: use one pointer (`write` or `slow`) to track the position where the next valid element should go, and another (`read` or `fast`) to scan through the array.

<div class="code-group">

```python
# Problem: Remove Duplicates from Sorted Array (LeetCode #26)
# Time: O(n) | Space: O(1)
def removeDuplicates(nums):
    """
    Returns the new length of the array after duplicates are removed in-place.
    Elements beyond the new length are irrelevant.
    """
    if not nums:
        return 0

    write_index = 1  # The first element is always unique
    for read_index in range(1, len(nums)):
        if nums[read_index] != nums[write_index - 1]:
            nums[write_index] = nums[read_index]
            write_index += 1
    return write_index

# Example: nums = [0,0,1,1,1,2,2,3,3,4]
# write_index progresses: 1 -> 2 -> 3 -> 4 -> 5
# Final nums (first 5 elements): [0, 1, 2, 3, 4]
```

```javascript
// Problem: Remove Duplicates from Sorted Array (LeetCode #26)
// Time: O(n) | Space: O(1)
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let writeIndex = 1;
  for (let readIndex = 1; readIndex < nums.length; readIndex++) {
    if (nums[readIndex] !== nums[writeIndex - 1]) {
      nums[writeIndex] = nums[readIndex];
      writeIndex++;
    }
  }
  return writeIndex;
}
```

```java
// Problem: Remove Duplicates from Sorted Array (LeetCode #26)
// Time: O(n) | Space: O(1)
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;

    int writeIndex = 1;
    for (int readIndex = 1; readIndex < nums.length; readIndex++) {
        if (nums[readIndex] != nums[writeIndex - 1]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }
    return writeIndex;
}
```

</div>

The same `read`/`write` pointer pattern applies to **Move Zeroes (#283)**, but with a different condition (`if (nums[read] != 0)`). Practice until this dual-pointer movement feels automatic.

For **prefix sum**, the key insight is to pre-compute cumulative sums to answer any subarray sum query in O(1) time. This often pairs with a hash map to track previously seen sums, as in the classic **Subarray Sum Equals K (#560)**.

<div class="code-group">

```python
# Problem: Subarray Sum Equals K (LeetCode #560)
# Time: O(n) | Space: O(n)
def subarraySum(nums, k):
    """
    Returns the total number of contiguous subarrays whose sum equals k.
    """
    count = 0
    current_sum = 0
    # Map: cumulative sum -> number of times we've seen it
    prefix_sum_count = {0: 1}  # Base case: a sum of 0 has occurred once

    for num in nums:
        current_sum += num
        # If (current_sum - k) exists in our map, we found a subarray summing to k
        count += prefix_sum_count.get(current_sum - k, 0)
        # Record the current cumulative sum
        prefix_sum_count[current_sum] = prefix_sum_count.get(current_sum, 0) + 1

    return count
```

```javascript
// Problem: Subarray Sum Equals K (LeetCode #560)
// Time: O(n) | Space: O(n)
function subarraySum(nums, k) {
  let count = 0;
  let currentSum = 0;
  const prefixSumCount = new Map();
  prefixSumCount.set(0, 1); // Base case

  for (const num of nums) {
    currentSum += num;
    if (prefixSumCount.has(currentSum - k)) {
      count += prefixSumCount.get(currentSum - k);
    }
    prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0) + 1);
  }
  return count;
}
```

```java
// Problem: Subarray Sum Equals K (LeetCode #560)
// Time: O(n) | Space: O(n)
public int subarraySum(int[] nums, int k) {
    int count = 0, currentSum = 0;
    Map<Integer, Integer> prefixSumCount = new HashMap<>();
    prefixSumCount.put(0, 1); // Base case

    for (int num : nums) {
        currentSum += num;
        count += prefixSumCount.getOrDefault(currentSum - k, 0);
        prefixSumCount.put(currentSum, prefixSumCount.getOrDefault(currentSum, 0) + 1);
    }
    return count;
}
```

</div>

## How Oracle Tests Array vs Other Companies

Compared to other tech giants, Oracle's array questions have a distinct flavor:

- **vs. Google:** Google often layers array problems with complex data structures (e.g., arrays of intervals, trees, or with special ordering). Oracle's are more "pure" and self-contained.
- **vs. Meta:** Meta loves to combine arrays with hashing for optimization, but often in the context of a more open-ended design. Oracle's problems are more narrowly algorithmic.
- **vs. Amazon:** Amazon's array problems frequently involve strings or are embedded in a larger system design narrative (e.g., log processing). Oracle's feel more like direct CS fundamentals assessments.

The unique aspect of Oracle's approach is the **emphasis on correctness and robustness in implementation**. They care that your solution handles edge cases (empty arrays, single elements, large negative/positive numbers) and that your in-place modifications don't have off-by-one errors. The difficulty is often "Medium," but the expectation for bug-free, well-reasoned code is high.

## Study Order

Tackle these sub-topics in sequence to build a solid foundation:

1.  **Basic Traversal and Index Manipulation:** Get comfortable with simple loops, accessing elements, and basic calculations. This builds muscle memory.
2.  **Two-Pointer Techniques (Sorted Arrays):** Start with the simplest case where the array is sorted. This introduces the concept of strategic pointer movement.
3.  **In-place Modification (Two-Pointer, Unsorted):** Apply the two-pointer pattern to unsorted arrays for operations like partitioning (Move Zeroes). This is harder and solidifies the pattern.
4.  **Prefix Sum & Sliding Window:** Learn to optimize subarray problems. Start with fixed-size windows (easier) before moving to variable-size.
5.  **Simulation on 2D Arrays:** Practice matrix traversal in different orders (spiral, diagonal). This is about precise control flow, not new algorithms.
6.  **Integration with Hash Maps:** Finally, combine arrays with hash maps for O(1) lookups to solve problems like Two Sum (unsorted) or Subarray Sum Equals K.

This order works because it progresses from simple mechanics to combined techniques, ensuring you fully understand each tool before using it in a more complex context.

## Recommended Practice Order

Solve these problems in this sequence to follow the study order:

1.  **Max Consecutive Ones (#485)** - Basic traversal.
2.  **Two Sum II - Input Array Is Sorted (#167)** - Two-pointer on sorted array.
3.  **Remove Duplicates from Sorted Array (#26)** - In-place modification (easier).
4.  **Move Zeroes (#283)** - In-place modification (harder, unsorted).
5.  **Maximum Subarray (#53)** - Introduction to Kadane's algorithm (a sliding window variant).
6.  **Minimum Size Subarray Sum (#209)** - Classic sliding window with variable size.
7.  **Spiral Matrix (#54)** - 2D array simulation.
8.  **Subarray Sum Equals K (#560)** - Combines prefix sum with a hash map.
9.  **Rotate Image (#48)** - Advanced in-place 2D manipulation.
10. **Product of Array Except Self (#238)** - A challenging problem that combines prefix-style thinking with in-place results.

Focus on writing clean, correct code on your first try for each. At Oracle, that's what will set you apart.

[Practice Array at Oracle](/company/oracle/array)
