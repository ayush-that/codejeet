---
title: "Binary Search Questions at Capgemini: What to Expect"
description: "Prepare for Binary Search interview questions at Capgemini — patterns, difficulty breakdown, and study tips."
date: "2030-04-28"
category: "dsa-patterns"
tags: ["capgemini", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Capgemini

Let's start with the numbers: Capgemini has 3 Binary Search questions out of 36 total in their tagged problem list. That's about 8% — not a dominant percentage, but significant enough that you'll almost certainly encounter it during your interview process. What's more telling is _when_ you'll encounter it.

Unlike companies like Google or Meta where Binary Search might appear in any technical round, Capgemini tends to use it as a filtering mechanism in their initial coding assessments and early technical screens. They're testing whether you understand the fundamental divide-and-conquer principle and can apply it beyond the textbook "find an element in sorted array" scenario. The questions are rarely pure Binary Search — they're usually disguised as optimization problems where you need to recognize that Binary Search can be applied to the _answer space_ rather than a physical array.

## Specific Patterns Capgemini Favors

Capgemini's Binary Search problems typically fall into two categories:

1. **Modified Binary Search on Arrays**: These aren't simple "find target" problems. They're variations where the array might be rotated, have duplicates, or require finding boundaries. Think "find minimum in rotated sorted array" or "find first and last position of element." They test if you can handle edge cases and modify the standard algorithm.

2. **Binary Search on Answer Space (Predicate Search)**: This is where Capgemini really differentiates itself. They love problems where you need to find the minimum or maximum value that satisfies certain conditions. The array isn't given — you're searching through a range of possible answers. For example, "Koko Eating Bananas" (LeetCode #875) or "Capacity To Ship Packages Within D Days" (LeetCode #1011). These problems test if you recognize that Binary Search can optimize what appears to be a simulation problem.

Here's the key insight: Capgemini's problems often involve _monotonic functions_ — as your candidate answer increases, some condition becomes easier to satisfy (or vice versa). Once you recognize that monotonic relationship, Binary Search becomes the optimal approach.

<div class="code-group">

```python
# Pattern: Binary Search on Answer Space
# LeetCode #875: Koko Eating Bananas
# Time: O(n * log(max(piles))) | Space: O(1)

def minEatingSpeed(piles, h):
    """
    Find minimum eating speed k such that Koko can eat all bananas in h hours.
    As k increases, hours needed decreases (monotonic relationship).
    """
    left, right = 1, max(piles)

    while left < right:
        mid = (left + right) // 2
        hours_needed = sum((pile + mid - 1) // mid for pile in piles)

        if hours_needed <= h:
            # Can eat within h hours, try slower speed
            right = mid
        else:
            # Too slow, need faster speed
            left = mid + 1

    return left
```

```javascript
// Pattern: Binary Search on Answer Space
// LeetCode #875: Koko Eating Bananas
// Time: O(n * log(max(piles))) | Space: O(1)

function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const hoursNeeded = piles.reduce((sum, pile) => sum + Math.ceil(pile / mid), 0);

    if (hoursNeeded <= h) {
      // Can eat within h hours, try slower speed
      right = mid;
    } else {
      // Too slow, need faster speed
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Pattern: Binary Search on Answer Space
// LeetCode #875: Koko Eating Bananas
// Time: O(n * log(max(piles))) | Space: O(1)

public int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = 0;
    for (int pile : piles) {
        right = Math.max(right, pile);
    }

    while (left < right) {
        int mid = left + (right - left) / 2;
        int hoursNeeded = 0;

        for (int pile : piles) {
            hoursNeeded += (pile + mid - 1) / mid; // ceiling division
        }

        if (hoursNeeded <= h) {
            // Can eat within h hours, try slower speed
            right = mid;
        } else {
            // Too slow, need faster speed
            left = mid + 1;
        }
    }

    return left;
}
```

</div>

## How to Prepare

First, master the standard Binary Search template until you can write it flawlessly without thinking. Then practice the variations. Here's my recommended approach:

1. **Learn to identify the monotonic relationship**: Ask yourself — if I try answer X and it works, will all values greater than X also work? If yes, you have a monotonic function suitable for Binary Search.

2. **Practice the predicate function**: In answer-space problems, the core challenge is writing an efficient `canDo(guess)` function that checks if a candidate answer works.

3. **Handle the off-by-one errors**: Capgemini's test cases often include edge cases. Practice questions with duplicate elements, empty arrays, and single-element cases.

<div class="code-group">

```python
# Pattern: Modified Binary Search with Duplicates
# LeetCode #81: Search in Rotated Sorted Array II
# Time: O(n) worst case (with duplicates) | Space: O(1)

def search(nums, target):
    """
    Search in rotated sorted array with duplicates.
    The presence of duplicates requires extra handling.
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return True

        # Handle duplicates: shrink search space
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        elif nums[left] <= nums[mid]:  # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return False
```

```javascript
// Pattern: Modified Binary Search with Duplicates
// LeetCode #81: Search in Rotated Sorted Array II
// Time: O(n) worst case (with duplicates) | Space: O(1)

function search(nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return true;

    // Handle duplicates: shrink search space
    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
      left++;
      right--;
    } else if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return false;
}
```

```java
// Pattern: Modified Binary Search with Duplicates
// LeetCode #81: Search in Rotated Sorted Array II
// Time: O(n) worst case (with duplicates) | Space: O(1)

public boolean search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return true;

        // Handle duplicates: shrink search space
        if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
            left++;
            right--;
        } else if (nums[left] <= nums[mid]) {  // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {  // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return false;
}
```

</div>

## How Capgemini Tests Binary Search vs Other Companies

At FAANG companies, Binary Search questions are often combined with other data structures (like trees or matrices) and are more algorithmic in nature. At Capgemini, the focus is more practical:

- **Less theoretical, more applied**: Problems often simulate real-world scenarios like resource allocation, scheduling, or optimization.
- **Emphasis on correctness over optimization**: While efficiency matters, they care more about whether you get the right answer with proper edge case handling.
- **Clearer problem statements**: Capgemini problems tend to be more straightforward in their description compared to some FAANG problems that might have hidden requirements.

The difficulty level is generally medium — harder than basic "find element" but not as complex as some of the harder LeetCode problems. They want to see that you understand the pattern and can adapt it.

## Study Order

1. **Standard Binary Search**: Master the basic algorithm first. Understand the while loop condition, how to calculate mid without overflow, and when to use `left <= right` vs `left < right`.

2. **Search in Rotated Sorted Array**: Learn to handle the rotation case (LeetCode #33). This teaches you to identify which half is sorted.

3. **Find Boundaries**: Practice finding the first/last occurrence (LeetCode #34). This is crucial for understanding how to modify the search condition.

4. **Binary Search on Answer Space**: This is the most important for Capgemini. Start with "Koko Eating Bananas" (#875) to understand the pattern.

5. **More Complex Answer-Space Problems**: Move to problems like "Capacity To Ship Packages" (#1011) and "Split Array Largest Sum" (#410).

6. **With Duplicates**: Finally, practice the duplicate variations (#81) to handle edge cases.

## Recommended Practice Order

Solve these problems in sequence:

1. **Binary Search** (LeetCode #704) - Warm up with the standard algorithm
2. **Search in Rotated Sorted Array** (#33) - Learn rotation handling
3. **Find First and Last Position** (#34) - Practice boundary finding
4. **Koko Eating Bananas** (#875) - Introduction to answer-space search
5. **Capacity To Ship Packages** (#1011) - More complex predicate function
6. **Search in Rotated Sorted Array II** (#81) - Handle duplicates

This progression builds from fundamentals to the specific patterns Capgemini favors. Each problem introduces a new concept while reinforcing previous ones.

Remember: The key to Binary Search at Capgemini isn't just knowing the algorithm — it's recognizing when to use it on problems that don't initially look like search problems. Look for optimization problems with monotonic relationships, and you'll spot the Binary Search opportunity.

[Practice Binary Search at Capgemini](/company/capgemini/binary-search)
