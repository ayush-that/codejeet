---
title: "Array Questions at Turing: What to Expect"
description: "Prepare for Array interview questions at Turing — patterns, difficulty breakdown, and study tips."
date: "2030-02-25"
category: "dsa-patterns"
tags: ["turing", "array", "interview prep"]
---

# Array Questions at Turing: What to Expect

If you're preparing for a Turing interview, you've likely noticed their problem list: 25 out of 40 total questions are Array-based. That's not a coincidence—it's a signal. At most companies, arrays are a foundational data structure, but at Turing, they're the primary battleground. In real interviews here, you can expect at least one, often two, array-focused problems in a 45-60 minute coding round. Why? Arrays are the perfect vehicle to test three things simultaneously: your grasp of fundamental data structures, your ability to manipulate indices and boundaries, and your skill in applying core algorithms to constrained, linear data. They strip away complex object modeling and force you to demonstrate raw algorithmic thinking.

## Specific Patterns Turing Favors

Turing's array problems aren't random. They heavily favor **in-place manipulation** and **two-pointer techniques** over more abstract graph or dynamic programming patterns. The interviewers want to see you handle indices with precision and optimize for space. You'll rarely see pure recursion; iterative solutions are preferred.

The most frequent patterns are:

1.  **Two Pointers (often with sorting):** Problems like "Two Sum II - Input Array Is Sorted (#167)" and "3Sum (#15)" are classic. The twist Turing often adds is requiring in-place modification or handling duplicates without extra space.
2.  **Sliding Window (Fixed & Dynamic):** This is huge. Expect problems about subarrays meeting a sum or character count condition, like "Maximum Subarray (#53)" (Kadane's algorithm is a sliding window variant) and "Minimum Size Subarray Sum (#209)."
3.  **Cyclic Sort / In-place Rearrangement:** Turing loves questions where you must rearrange an array based on its own values, using the array itself as a hash map. "Find All Duplicates in an Array (#442)" and "First Missing Positive (#41)" are quintessential examples. These test your ability to think about array indices as a source of truth.

You'll notice a distinct lack of heavy graph traversal or complex DP. When DP appears, it's usually the 1D iterative kind applied to arrays, like "House Robber (#198)." The focus is on clean, efficient, O(1) or O(n) space solutions.

## How to Prepare

Your preparation should mirror their focus: master index manipulation. Don't just solve problems—solve them with strict space constraints. For every problem, ask: "Can I do this in O(1) extra space?"

Let's look at the **Cyclic Sort** pattern, a Turing favorite. The core idea is to place each number in its correct index (if the array were `[1, 2, ..., n]`) by swapping.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def cyclic_sort(nums):
    """
    Sorts an array containing n distinct numbers in the range [1, n].
    """
    i = 0
    while i < len(nums):
        # Correct index for the current value is (value - 1)
        correct_idx = nums[i] - 1
        # If the number at the current index is not the one that belongs there, swap.
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    return nums

# Example: Find all missing numbers in an array [4,3,2,7,8,2,3,1]
def find_all_missing(nums):
    cyclic_sort(nums)  # In-place sort
    missing = []
    for i in range(len(nums)):
        if nums[i] != i + 1:
            missing.append(i + 1)
    return missing
```

```javascript
// Time: O(n) | Space: O(1)
function cyclicSort(nums) {
  let i = 0;
  while (i < nums.length) {
    const correctIdx = nums[i] - 1;
    if (nums[i] !== nums[correctIdx]) {
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
    } else {
      i++;
    }
  }
  return nums;
}

// Example: Find all missing numbers
function findAllMissing(nums) {
  cyclicSort(nums);
  const missing = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
      missing.push(i + 1);
    }
  }
  return missing;
}
```

```java
// Time: O(n) | Space: O(1)
public class CyclicSort {
    public static void cyclicSort(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            int correctIdx = nums[i] - 1;
            if (nums[i] != nums[correctIdx]) {
                swap(nums, i, correctIdx);
            } else {
                i++;
            }
        }
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    // Example: Find all missing numbers
    public static List<Integer> findAllMissing(int[] nums) {
        cyclicSort(nums);
        List<Integer> missing = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != i + 1) {
                missing.add(i + 1);
            }
        }
        return missing;
    }
}
```

</div>

Another critical pattern is the **Sliding Window**. Here's the template for a dynamic window (finding the smallest subarray with a sum >= target):

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def min_subarray_len(target, nums):
    """
    Returns the minimal length of a contiguous subarray whose sum >= target.
    """
    min_len = float('inf')
    window_sum = 0
    left = 0

    for right in range(len(nums)):
        window_sum += nums[right]  # Expand the window

        # Shrink the window from the left as long as the condition is met
        while window_sum >= target:
            min_len = min(min_len, right - left + 1)
            window_sum -= nums[left]
            left += 1

    return 0 if min_len == float('inf') else min_len
```

```javascript
// Time: O(n) | Space: O(1)
function minSubarrayLen(target, nums) {
  let minLen = Infinity;
  let windowSum = 0;
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right]; // Expand

    while (windowSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      windowSum -= nums[left];
      left++; // Shrink
    }
  }

  return minLen === Infinity ? 0 : minLen;
}
```

```java
// Time: O(n) | Space: O(1)
public class SlidingWindow {
    public static int minSubarrayLen(int target, int[] nums) {
        int minLen = Integer.MAX_VALUE;
        int windowSum = 0;
        int left = 0;

        for (int right = 0; right < nums.length; right++) {
            windowSum += nums[right]; // Expand

            while (windowSum >= target) {
                minLen = Math.min(minLen, right - left + 1);
                windowSum -= nums[left];
                left++; // Shrink
            }
        }

        return minLen == Integer.MAX_VALUE ? 0 : minLen;
    }
}
```

</div>

## How Turing Tests Array vs Other Companies

Compared to other major tech companies, Turing's array questions are less about clever mathematical tricks (like some of Google's) and less about complex system design masquerading as code (like some of Amazon's). They are more **fundamental and execution-focused**.

- **vs. Google:** Google might ask a convoluted array problem that's really a graph in disguise or requires a non-obvious mathematical insight. Turing's problems are more direct: "Here's an array, transform it efficiently."
- **vs. Meta:** Meta leans heavily into graphs/trees and recursion. Turing stays closer to linear data structures and iteration.
- **vs. Amazon:** Amazon often blends array problems with object-oriented design or real-world scenarios. Turing's problems are purer, more academic algorithm tests.

The unique aspect of Turing's approach is the **emphasis on in-place operations**. They want to see if you understand that an array's memory is fixed and can be repurposed, not just if you can find a correct answer using a hash map.

## Study Order

Tackle array patterns in this logical progression:

1.  **Basic Traversal & Two-Pointers:** Start with simple iteration and the foundational two-pointer technique (one at start, one at end). This builds intuition for index movement. (Problems: Two Sum II, Reverse String).
2.  **Fast & Slow Pointers:** A specialized two-pointer variant for cycle detection or finding midpoints. It's a slight complexity bump. (Problem: Find the Duplicate Number).
3.  **Sliding Window:** Learn the fixed-window variant first (easier to reason about), then graduate to dynamic windows. This is critical for subarray problems.
4.  **In-place Operations / Cyclic Sort:** This is where Turing's style shines. Practice overwriting and swapping within the array to achieve the result. This builds on the pointer control from earlier steps.
5.  **Binary Search on Arrays:** Even unsorted arrays can be candidates for modified binary search (e.g., finding rotation point). This introduces a logarithmic optimization mindset.
6.  **1-D Dynamic Programming:** Finally, tackle DP problems where the state is based on array position. This combines traversal with state decision-making.

This order works because each step uses skills from the previous one. You can't do efficient in-place manipulation without solid pointer control, and you can't optimize subarray searches without understanding window mechanics.

## Recommended Practice Order

Solve these problems in sequence to build the competency Turing tests:

1.  **Two Sum II - Input Array Is Sorted (#167)** - Basic two-pointer.
2.  **Move Zeroes (#283)** - Simple in-place operation.
3.  **Container With Most Water (#11)** - Two-pointer with area calculation.
4.  **Maximum Subarray (#53)** - Introduction to Kadane's (a sliding window concept).
5.  **Minimum Size Subarray Sum (#209)** - Dynamic sliding window template.
6.  **Find All Duplicates in an Array (#442)** - Classic cyclic sort application.
7.  **First Missing Positive (#41)** - Advanced in-place hashing/cyclic sort.
8.  **Search in Rotated Sorted Array (#33)** - Binary search on a modified array.
9.  **House Robber (#198)** - 1D DP on an array.
10. **Product of Array Except Self (#238)** - Combines traversal, prefix/suffix logic, and O(1) space challenge.

Master this progression, and you'll be able to handle the vast majority of array problems Turing throws at you. Remember, their goal is to see precise, efficient code—not just a correct answer.

[Practice Array at Turing](/company/turing/array)
