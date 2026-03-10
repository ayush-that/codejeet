---
title: "Two Pointers Questions at MakeMyTrip: What to Expect"
description: "Prepare for Two Pointers interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-13"
category: "dsa-patterns"
tags: ["makemytrip", "two-pointers", "interview prep"]
---

If you're preparing for a MakeMyTrip interview, you might notice something interesting in their question distribution: out of approximately 24 frequently asked problems, three are Two Pointers questions. That's 12.5% of their technical interview repertoire—a significant enough chunk that you can't afford to treat this as a secondary topic. Unlike companies that might use Two Pointers as a warm-up, MakeMyTrip often employs these problems to assess your ability to think about spatial relationships and optimize solutions in array and string manipulation scenarios common in travel and booking systems.

The key insight here isn't just that Two Pointers appears—it's _how_ it appears. MakeMyTrip's Two Pointers questions tend to be practical rather than purely academic. They're problems where the brute force solution is obvious but inefficient, and the optimal solution requires recognizing how to move two indices to converge on an answer without unnecessary computation. This mirrors real-world scenarios in their systems: finding matching flights within a budget, optimizing hotel search results, or validating user input formats.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's Two Pointers problems consistently fall into two specific patterns: **sorted array pair searching** and **in-place array manipulation**. They rarely ask about linked list cycle detection or the more exotic variations.

The sorted array pattern appears in problems like finding pairs that sum to a target—directly applicable to their flight search where you might need to find flight combinations within a price range. The in-place manipulation pattern shows up in problems requiring rearrangement without extra space, which relates to how they might optimize memory usage when processing large datasets of travel options.

A classic example is the **Two Sum II - Input Array Is Sorted (LeetCode #167)** variation. While the standard Two Sum uses a hash map, the sorted version is perfect for Two Pointers. MakeMyTrip might adapt this to a travel context: "Given sorted arrays of flight prices for two airlines, find one flight from each that sum exactly to your budget."

<div class="code-group">

```python
def two_sum_sorted(numbers, target):
    """
    Find two numbers that sum to target in sorted array.
    Returns indices (1-indexed) of the two numbers.
    """
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1  # Need larger sum, move left pointer right
        else:
            right -= 1  # Need smaller sum, move right pointer left

    return []  # No solution found

# Time: O(n) | Space: O(1)
# We traverse the array at most once with two pointers
```

```javascript
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const currentSum = numbers[left] + numbers[right];

    if (currentSum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (currentSum < target) {
      left++; // Need larger sum
    } else {
      right--; // Need smaller sum
    }
  }

  return []; // No solution
}

// Time: O(n) | Space: O(1)
// Single pass through array with two moving pointers
```

```java
public int[] twoSumSorted(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;

    while (left < right) {
        int currentSum = numbers[left] + numbers[right];

        if (currentSum == target) {
            return new int[]{left + 1, right + 1};  // 1-indexed
        } else if (currentSum < target) {
            left++;  // Need larger sum
        } else {
            right--;  // Need smaller sum
        }
    }

    return new int[]{};  // No solution
}

// Time: O(n) | Space: O(1)
// Each iteration moves at least one pointer toward the center
```

</div>

The second pattern they favor is **in-place manipulation with slow and fast pointers**, similar to **Remove Duplicates from Sorted Array (LeetCode #26)**. This tests whether you can modify data efficiently without allocating additional arrays—a valuable skill when dealing with large datasets of hotel listings or flight routes.

## How to Prepare

Focus on mastering the movement logic of two pointers. The most common mistake candidates make is moving pointers incorrectly when conditions are met. Remember: when searching in a sorted array, if the sum is too small, move the left pointer right to increase it; if too large, move the right pointer left to decrease it.

Practice explaining this logic clearly. MakeMyTrip interviewers want to hear your reasoning: "Since the array is sorted, I know that moving the left pointer right will give me a larger value, while moving the right pointer left will give me a smaller value."

For in-place manipulation problems, master the slow/fast pointer pattern where the slow pointer tracks the position for the next valid element, and the fast pointer explores the array:

<div class="code-group">

```python
def remove_duplicates(nums):
    """
    Remove duplicates in-place from sorted array.
    Returns new length of array with unique elements.
    """
    if not nums:
        return 0

    slow = 0  # Tracks position for next unique element

    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    return slow + 1  # Length is position + 1

# Time: O(n) | Space: O(1)
# Single pass with fast pointer, slow only moves for unique elements
```

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let slow = 0; // Position for next unique element

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1; // New length
}

// Time: O(n) | Space: O(1)
// Fast pointer scans all elements, slow only advances for uniques
```

```java
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;

    int slow = 0;  // Position for next unique element

    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }

    return slow + 1;  // New length
}

// Time: O(n) | Space: O(1)
// Each element visited once by fast pointer
```

</div>

## How MakeMyTrip Tests Two Pointers vs Other Companies

MakeMyTrip's Two Pointers questions differ from other companies in their practical framing. While Google might ask about theoretical array manipulations and Amazon might focus on efficiency at scale, MakeMyTrip often presents these problems in travel-related contexts. The difficulty is typically medium—hard enough to require genuine insight but not so complex that it becomes a marathon coding session.

What's unique is their emphasis on clean, efficient code rather than clever tricks. They want to see that you can implement the Two Pointers pattern correctly and explain why it's optimal. At companies like Facebook, you might need to handle multiple variations or combine Two Pointers with other patterns, but MakeMyTrip tends to test the core pattern in isolation.

## Study Order

1. **Basic Two Pointers on Sorted Arrays** - Start with the fundamental pattern of having left and right pointers move toward each other. This builds intuition about how sorted order enables this approach.

2. **In-place Manipulation with Slow/Fast Pointers** - Learn how to modify arrays without extra space. This is crucial for understanding space complexity trade-offs.

3. **String Variations** - Practice Two Pointers on strings, particularly palindrome validation and comparison problems. This tests if you can apply the same spatial reasoning to different data types.

4. **Combination Problems** - Finally, tackle problems where Two Pointers is part of a larger solution, like the three-sum problem. This ensures you can integrate the pattern with other techniques.

This order works because it builds from simple to complex. You master the movement logic in the simplest context (sorted arrays), then apply it to modification problems, then to different data structures, and finally to integrated solutions.

## Recommended Practice Order

1. Two Sum II - Input Array Is Sorted (LeetCode #167) - The fundamental sorted array pattern
2. Remove Duplicates from Sorted Array (LeetCode #26) - Basic in-place modification
3. Valid Palindrome (LeetCode #125) - String application of Two Pointers
4. Container With Most Water (LeetCode #11) - Teaches a different movement logic
5. 3Sum (LeetCode #15) - Combines sorting with multiple Two Pointers passes
6. Trapping Rain Water (LeetCode #42) - Advanced application requiring left/right max tracking

Solve these in sequence, and you'll build the exact skills MakeMyTrip tests in their Two Pointers questions. Each problem introduces a new nuance while reinforcing the core pattern.

[Practice Two Pointers at MakeMyTrip](/company/makemytrip/two-pointers)
