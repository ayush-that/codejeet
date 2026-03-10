---
title: "Array Questions at Capgemini: What to Expect"
description: "Prepare for Array interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-04-14"
category: "dsa-patterns"
tags: ["capgemini", "array", "interview prep"]
---

# Array Questions at Capgemini: What to Expect

If you’re preparing for a Capgemini technical interview, you’ve probably noticed the data: roughly 20 out of their 36 most frequently asked coding questions involve arrays. That’s over 55%. This isn’t a coincidence—it’s a deliberate focus. Arrays are the foundational data structure in software engineering, and Capgemini, like many large consulting and technology services firms, uses them as a primary tool to assess core programming competency, logical thinking, and clean code habits. Unlike some product-based tech giants that might dive deep into system design or niche algorithms early on, Capgemini’s initial technical screens often rely heavily on array manipulation to filter candidates. Mastering arrays isn’t just a part of your prep; it’s the single most impactful area you can study for this company.

## Specific Patterns Capgemini Favors

Capgemini’s array problems tend to skew toward practical, business-logic-style manipulation rather than abstract mathematical puzzles. You’ll see a strong emphasis on **iteration, searching, sorting, and in-place modification**. Recursive solutions are less common; they prefer clear, iterative approaches. Specifically, watch for these patterns:

1.  **Two-Pointer Technique:** Used for problems involving sorted arrays, pair searching, or in-place rearrangements (like moving zeros). This tests your ability to optimize space.
2.  **Sliding Window:** For subarray or substring problems with constraints (e.g., maximum sum, longest substring with K distinct characters). This assesses your grasp of time optimization.
3.  **Cyclic Sort:** A niche but favorite pattern for problems involving arrays containing numbers in a given range (e.g., finding missing or duplicate numbers). It perfectly tests the ability to achieve O(n) time and O(1) space.
4.  **Prefix Sum:** For problems where you need to frequently calculate the sum of a subarray. It’s a straightforward but crucial optimization pattern.

You are unlikely to see complex dynamic programming or graph-based array problems (like matrix traversal disguised as a graph) in the initial rounds. The focus is on solid fundamentals applied cleverly.

## How to Prepare

The key is pattern recognition through deliberate practice. Don’t just solve problems; solve them with the optimal pattern in mind. Let’s look at the **Two-Pointer** pattern, which is ubiquitous. The classic example is the "Two Sum II - Input Array Is Sorted" problem (LeetCode #167).

The brute force approach is O(n²). The two-pointer method leverages the sorted property.

<div class="code-group">

```python
# LeetCode #167 - Two Sum II - Input Array Is Sorted
# Time: O(n) | Space: O(1)
def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            # Problem expects 1-indexed indices
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1  # We need a larger sum, move left pointer right
        else:
            right -= 1  # We need a smaller sum, move right pointer left
    return []  # According to problem, one valid answer always exists

# Example:
# print(twoSum([2, 7, 11, 15], 9))  # Output: [1, 2]
```

```javascript
// LeetCode #167 - Two Sum II - Input Array Is Sorted
// Time: O(n) | Space: O(1)
function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return []; // Guaranteed to have a solution
}
```

```java
// LeetCode #167 - Two Sum II - Input Array Is Sorted
// Time: O(n) | Space: O(1)
public int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return new int[]{left + 1, right + 1}; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{}; // Guaranteed to have a solution
}
```

</div>

Another critical pattern is **Cyclic Sort**, ideal for problems like "Find All Numbers Disappeared in an Array" (LeetCode #448).

<div class="code-group">

```python
# LeetCode #448 - Find All Numbers Disappeared in an Array
# Time: O(n) | Space: O(1) excluding the output list
def findDisappearedNumbers(nums):
    i = 0
    n = len(nums)
    # Cyclic Sort: Place each number at its correct index (nums[i] should be at index nums[i]-1)
    while i < n:
        correct_index = nums[i] - 1
        if nums[i] != nums[correct_index]:
            # Swap
            nums[i], nums[correct_index] = nums[correct_index], nums[i]
        else:
            i += 1

    # Find indices that do not contain the correct number
    disappeared = []
    for i in range(n):
        if nums[i] != i + 1:
            disappeared.append(i + 1)
    return disappeared

# Example:
# print(findDisappearedNumbers([4,3,2,7,8,2,3,1]))  # Output: [5, 6]
```

```javascript
// LeetCode #448 - Find All Numbers Disappeared in an Array
// Time: O(n) | Space: O(1) excluding the output array
function findDisappearedNumbers(nums) {
  let i = 0;
  const n = nums.length;
  // Cyclic Sort
  while (i < n) {
    const correctIdx = nums[i] - 1;
    if (nums[i] !== nums[correctIdx]) {
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]]; // Swap
    } else {
      i++;
    }
  }
  // Find missing numbers
  const result = [];
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      result.push(i + 1);
    }
  }
  return result;
}
```

```java
// LeetCode #448 - Find All Numbers Disappeared in an Array
// Time: O(n) | Space: O(1) excluding the output list
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
    // Find indices with wrong numbers
    List<Integer> result = new ArrayList<>();
    for (i = 0; i < n; i++) {
        if (nums[i] != i + 1) {
            result.add(i + 1);
        }
    }
    return result;
}
```

</div>

## How Capgemini Tests Array vs Other Companies

Compared to FAANG companies, Capgemini’s array questions are often more direct and less "tricky." At Google or Meta, an array problem might be a gateway to a complex follow-up involving multiple data structures or requiring a non-intuitive insight. At Capgemini, the problem statement is usually clearer, and the optimal solution often applies one of the classic patterns cleanly. The difficulty is in executing it flawlessly under pressure—writing bug-free, well-structured code with proper edge cases. They value **correctness and clarity** slightly more than squeezing out the last ounce of asymptotic optimization. However, you are still expected to know and apply the standard O(n) and O(n log n) solutions.

## Study Order

Tackle array topics in this logical progression to build a strong foundation:

1.  **Basic Iteration and Counting:** Start with simple traversal, counting, and aggregation problems. This builds comfort with array syntax and basic loops.
2.  **Sorting and Binary Search:** Understand how to sort an array and then leverage that order with binary search (O(log n) lookups). This is a prerequisite for many efficient algorithms.
3.  **Two-Pointer Technique:** Learn this after sorting, as it often depends on a sorted input. It’s a fundamental optimization pattern.
4.  **Sliding Window:** Master fixed and dynamic windows. This pattern is key for subarray problems and teaches you to manage a running computation.
5.  **Prefix Sum:** A simple but powerful concept for optimizing range sum queries.
6.  **Cyclic Sort:** A specialized but highly testable pattern for a specific class of problems. Learn it well, as it’s a favorite.
7.  **In-place Array Operations:** Practice modifying arrays without extra space (e.g., moving zeros, removing duplicates). This combines several of the above skills.

## Recommended Practice Order

Solve these problems in sequence to build your skills methodically:

1.  **Find the Maximum and Minimum Element in an Array** (Basic iteration)
2.  **Two Sum** (LeetCode #1) - Use a hash map. Then solve **Two Sum II** (LeetCode #167) with two-pointers.
3.  **Best Time to Buy and Sell Stock** (LeetCode #121) - Simple one-pass iteration.
4.  **Merge Sorted Array** (LeetCode #88) - Classic two-pointer from the end.
5.  **Move Zeroes** (LeetCode #283) - In-place operation with two-pointers.
6.  **Contains Duplicate** (LeetCode #217) - Use a hash set.
7.  **Maximum Subarray** (LeetCode #53) - Kadane’s Algorithm (a form of dynamic programming/iteration).
8.  **Find All Numbers Disappeared in an Array** (LeetCode #448) - Master Cyclic Sort here.
9.  **Product of Array Except Self** (LeetCode #238) - Tests understanding of prefix and suffix products.
10. **Sliding Window Maximum** (LeetCode #239) - A more challenging sliding window problem using a deque.

This progression takes you from fundamentals to more integrated problem-solving, mirroring the difficulty curve you might see in an interview.

[Practice Array at Capgemini](/company/capgemini/array)
