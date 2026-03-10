---
title: "Two Pointers Questions at Swiggy: What to Expect"
description: "Prepare for Two Pointers interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-02-03"
category: "dsa-patterns"
tags: ["swiggy", "two-pointers", "interview prep"]
---

# Two Pointers Questions at Swiggy: What to Expect

If you're preparing for a software engineering interview at Swiggy, you've likely noticed their problem breakdown: 5 out of 41 tagged questions involve the Two Pointers technique. That's roughly 12% of their technical question pool. While this might seem like a niche topic, in practice, Two Pointers problems appear with surprising frequency in live interviews—especially for roles involving backend systems, logistics optimization, or data processing. Why? Because Swiggy's core business—food delivery and quick commerce—revolves around efficient data traversal, matching, and interval management. Think of matching orders to delivery executives, optimizing delivery routes, or merging time slots for restaurant operations. The Two Pointers technique isn't just an algorithmic curiosity here; it's a practical tool for solving real-world problems they face daily.

## Specific Patterns Swiggy Favors

Swiggy's Two Pointers questions tend to cluster around three specific patterns, each mirroring a domain problem they encounter.

1. **Sorted Array Pair Searching**: This is their most common pattern. Problems like "Two Sum II - Input Array Is Sorted" (LeetCode #167) directly model matching scenarios—finding two delivery executives whose combined capacity meets an order requirement, or identifying two time slots that can be merged. The sorted array is key because their data (like delivery windows or sorted IDs) often arrives ordered.

2. **In-place Array Manipulation**: Swiggy loves problems where you must rearrange or filter data without extra space. "Remove Duplicates from Sorted Array" (LeetCode #26) or "Move Zeroes" (LeetCode #283) test your ability to efficiently clean or transform datasets, similar to processing real-time order streams or filtering invalid location pings.

3. **Interval Merging and Overlap**: While sometimes categorized under "Intervals," these problems are frequently solved with a Two Pointers approach after sorting. "Merge Intervals" (LeetCode #56) is a classic example. At Swiggy, this translates to consolidating delivery schedules, merging promotional time windows, or combining overlapping service areas.

Notice what's missing: complex linked list cycles or abstract palindrome problems. Swiggy's questions are grounded in array/list manipulation that mirrors operational data structures.

## How to Prepare

Mastering Two Pointers for Swiggy means internalizing the pattern variations. Let's walk through the most common one: the opposite-direction pointers for a sorted array.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def two_sum_sorted(numbers, target):
    """
    LeetCode #167: Two Sum II - Input Array Is Sorted
    Given a 1-indexed sorted array, find two numbers that sum to target.
    """
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            # Problem uses 1-indexed, so add 1
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1  # Need a larger sum, move left pointer right
        else:
            right -= 1  # Need a smaller sum, move right pointer left

    return []  # No solution found
```

```javascript
// Time: O(n) | Space: O(1)
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const currentSum = numbers[left] + numbers[right];

    if (currentSum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}
```

```java
// Time: O(n) | Space: O(1)
public int[] twoSumSorted(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;

    while (left < right) {
        int currentSum = numbers[left] + numbers[right];

        if (currentSum == target) {
            return new int[]{left + 1, right + 1};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }

    return new int[]{};
}
```

</div>

The second pattern to master is same-direction pointers for in-place operations. This is essentially the "slow and fast pointer" technique applied to arrays.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def remove_duplicates_sorted(nums):
    """
    LeetCode #26: Remove Duplicates from Sorted Array
    Remove duplicates in-place, return new length.
    """
    if not nums:
        return 0

    # slow pointer tracks the position of the last unique element
    slow = 0

    # fast pointer explores the array
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    # Length is slow + 1 (0-indexed)
    return slow + 1
```

```javascript
// Time: O(n) | Space: O(1)
function removeDuplicatesSorted(nums) {
  if (nums.length === 0) return 0;

  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1;
}
```

```java
// Time: O(n) | Space: O(1)
public int removeDuplicatesSorted(int[] nums) {
    if (nums.length == 0) return 0;

    int slow = 0;

    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }

    return slow + 1;
}
```

</div>

## How Swiggy Tests Two Pointers vs Other Companies

Swiggy's approach to Two Pointers differs from other tech companies in subtle but important ways. At FAANG companies, you might encounter Two Pointers as part of a multi-step problem or combined with other patterns (like in "Trapping Rain Water"). Swiggy, however, tends to present it as a standalone, clean algorithmic test—but with a practical twist. They often embed the problem in a domain context: "Given sorted delivery time windows, find two that can be combined to meet a large order deadline."

The difficulty level is typically medium, but they emphasize clarity and optimality. While a company like Google might accept a suboptimal solution to see your thought process, Swiggy interviewers often expect you to arrive at the O(n) time, O(1) space solution quickly, because that's what their systems require for scalability. They're less interested in clever tricks and more in robust, maintainable implementations.

## Study Order

Tackle Two Pointers in this sequence to build a solid foundation:

1. **Basic Opposite-Direction Pointers**: Start with "Two Sum II" (#167) and "Valid Palindrome" (#125). This teaches you the fundamental movement logic when pointers move toward each other.
2. **Same-Direction Pointers**: Move to "Remove Duplicates from Sorted Array" (#26) and "Remove Element" (#27). These introduce the slow/fast pointer pattern for in-place operations.
3. **Window Variants**: Practice "Container With Most Water" (#11) and "3Sum" (#15). These add complexity with area calculations or multiple pointers.
4. **Interval Problems**: Tackle "Merge Intervals" (#56) and "Insert Interval" (#57). While not exclusively Two Pointers, they rely heavily on sorted traversal and pointer logic.
5. **Linked List Applications**: Finally, practice "Linked List Cycle" (#141) and "Palindrome Linked List" (#234). These transfer the pattern to pointer-based structures.

This order works because it progresses from simple array traversal to more complex decision-making, then applies the pattern to different data structures. Each step reinforces pointer movement logic while adding new constraints.

## Recommended Practice Order

Solve these problems in sequence to build Swiggy-specific competency:

1. **Two Sum II - Input Array Is Sorted** (#167) - The foundational opposite-pointer pattern.
2. **Remove Duplicates from Sorted Array** (#26) - Master same-direction pointers.
3. **Merge Intervals** (#56) - Apply sorting plus pointer traversal.
4. **3Sum** (#15) - Handle multiple pointers and deduplication.
5. **Container With Most Water** (#11) - Practice pointer movement based on conditions.
6. **Trapping Rain Water** (#42) - Advanced application combining multiple patterns.

After completing these, you'll have covered every Two Pointers variation Swiggy commonly tests. Remember to verbalize your thought process during practice—Swiggy interviewers value clear communication about trade-offs as much as the solution itself.

[Practice Two Pointers at Swiggy](/company/swiggy/two-pointers)
