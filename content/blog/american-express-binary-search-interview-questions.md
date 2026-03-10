---
title: "Binary Search Questions at American Express: What to Expect"
description: "Prepare for Binary Search interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-03-26"
category: "dsa-patterns"
tags: ["american-express", "binary-search", "interview prep"]
---

If you're preparing for software engineering interviews at American Express, you'll likely encounter a Binary Search question. With 2 out of their 24 total coding questions dedicated to this algorithm, it's a consistent, non-negotiable part of their technical screen. But here's the crucial insight: at AmEx, Binary Search is rarely about finding an element in a sorted array. Instead, they use it as a clever optimization tool for problems that don't initially look like search problems at all. They're testing whether you can recognize when a brute-force solution has a monotonic property that can be exploited.

## Specific Patterns American Express Favors

American Express interviewers favor a specific category: **Binary Search on Answer (or Binary Search on Result)**. You won't be given a sorted array and told to find `target`. You'll be given a problem with a feasible condition, and you'll need to find the minimum or maximum value that satisfies it. The "search space" becomes a range of possible answers, not an explicit data structure.

The classic example is **Koko Eating Bananas (LeetCode #875)**. You're not searching an array; you're searching for the minimum eating speed `k`. For any given `k`, you can check if Koko can finish in time (the feasible function). This creates a monotonic condition: if speed `k` works, then any speed > `k` also works. This allows binary search over the possible speeds.

Another pattern they use is **Binary Search in a Rotated or Partially Sorted Array**, but with a twist that involves financial data or transaction logs. Think **Search in Rotated Sorted Array (LeetCode #33)** but framed around finding a specific transaction timestamp in a cyclically sorted log file.

## How to Prepare

The key is to master the template for Binary Search on Answer. You must be able to:

1. Identify the search space (what's the minimum and maximum possible answer?).
2. Implement a feasible function (given a candidate answer, can it work?).
3. Apply a standard binary search to converge on the optimal answer.

Let's look at the core pattern using the "Koko" problem as our model.

<div class="code-group">

```python
def minEatingSpeed(piles, h):
    """
    Find the minimum integer k such that Koko can eat all bananas in h hours.
    Time: O(n * log(max(piles))) | Space: O(1)
    - n = len(piles), binary search runs log(max(pile)) times.
    - Each feasibility check is O(n).
    """
    left, right = 1, max(piles)

    while left < right:
        mid = left + (right - left) // 2
        hours_needed = 0

        # Feasibility function: can we finish with speed = mid?
        for pile in piles:
            hours_needed += (pile + mid - 1) // mid  # ceil division

        # Binary search decision: if feasible, try a smaller speed.
        # If not feasible, we need a larger speed.
        if hours_needed <= h:
            right = mid  # Try for a smaller k (more optimal)
        else:
            left = mid + 1  # Must increase speed

    return left
```

```javascript
function minEatingSpeed(piles, h) {
  // Time: O(n * log(max(piles))) | Space: O(1)
  let left = 1;
  let right = Math.max(...piles);

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    let hoursNeeded = 0;

    // Feasibility check
    for (const pile of piles) {
      hoursNeeded += Math.ceil(pile / mid);
    }

    // Binary search on the condition
    if (hoursNeeded <= h) {
      right = mid; // mid is feasible, try smaller
    } else {
      left = mid + 1; // mid is too slow
    }
  }
  return left;
}
```

```java
public int minEatingSpeed(int[] piles, int h) {
    // Time: O(n * log(max(piles))) | Space: O(1)
    int left = 1;
    int right = 1;
    for (int pile : piles) {
        right = Math.max(right, pile);
    }

    while (left < right) {
        int mid = left + (right - left) / 2;
        int hoursNeeded = 0;

        // Feasibility function
        for (int pile : piles) {
            hoursNeeded += (pile + mid - 1) / mid; // ceiling division
        }

        // Binary search decision
        if (hoursNeeded <= h) {
            right = mid; // mid works, try smaller
        } else {
            left = mid + 1; // mid too slow
        }
    }
    return left;
}
```

</div>

The second pattern to prepare for is searching in a rotated array. The twist at AmEx is they might ask you to find the _rotation point_ (the index of the minimum element), which is essentially **Find Minimum in Rotated Sorted Array (LeetCode #153)**. This is a foundational skill for any rotated array problem.

<div class="code-group">

```python
def findMin(nums):
    """
    Find the minimum element in a rotated sorted array.
    Time: O(log n) | Space: O(1)
    """
    left, right = 0, len(nums) - 1

    while left < right:
        mid = left + (right - left) // 2

        # Compare mid element with rightmost element
        if nums[mid] > nums[right]:
            # Minimum must be in the right half (excluding mid)
            left = mid + 1
        else:
            # Minimum is in the left half (including mid)
            right = mid

    return nums[left]
```

```javascript
function findMin(nums) {
  // Time: O(log n) | Space: O(1)
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return nums[left];
}
```

```java
public int findMin(int[] nums) {
    // Time: O(log n) | Space: O(1)
    int left = 0;
    int right = nums.length - 1;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return nums[left];
}
```

</div>

## How American Express Tests Binary Search vs Other Companies

At FAANG companies, Binary Search questions often test pure algorithmic agility—think advanced variations like **Median of Two Sorted Arrays (LeetCode #4)**. At American Express, the focus is more practical. They embed Binary Search in business contexts: optimizing resource allocation, finding thresholds in financial data, or searching time-series logs. The difficulty is typically medium; they want to see clean, bug-free implementation of the pattern rather than complex mathematical reasoning.

What's unique is their emphasis on the _feasibility check_. They might spend more interview time discussing how you derived that function and its correctness, because in their domain (financial services, fraud detection, transaction processing), verifying a condition is as important as optimizing it.

## Study Order

Don't jump straight to rotated arrays. Build your understanding systematically:

1.  **Standard Binary Search:** Master the basic "find target in sorted array" pattern. This builds your intuition for the loop condition and pointer updates. (LeetCode #704)
2.  **Search Insert Position:** Learn to handle the "not found" case by finding the insertion point. This teaches you the subtle difference between `left < right` and `left <= right`. (LeetCode #35)
3.  **Find First/Last Position of Element:** Handle duplicates and understand how to modify the condition to find boundaries. This is crucial for real-world data. (LeetCode #34)
4.  **Find Minimum in Rotated Sorted Array:** Learn the core pattern for rotated arrays. This is a prerequisite for any search in a rotated array. (LeetCode #153)
5.  **Search in Rotated Sorted Array:** Apply the rotation logic to find a specific target. (LeetCode #33)
6.  **Binary Search on Answer:** This is the peak. Practice identifying the search space and writing the feasibility function. Start with the classic examples. (LeetCode #875, #1011)

This order works because it moves from concrete searching in data to abstract searching over a solution space, layering complexity at each step.

## Recommended Practice Order

Solve these problems in sequence to build the specific competency American Express looks for:

1.  **Binary Search (LeetCode #704)** - The absolute foundation.
2.  **First Bad Version (LeetCode #278)** - Introduces the "feasibility function" concept in a simple way.
3.  **Search Insert Position (LeetCode #35)** - Solidifies edge case handling.
4.  **Find Minimum in Rotated Sorted Array (LeetCode #153)** - Master the rotation pattern.
5.  **Search in Rotated Sorted Array (LeetCode #33)** - Apply the pattern to find a target.
6.  **Koko Eating Bananas (LeetCode #875)** - The quintessential "Binary Search on Answer" problem.
7.  **Capacity To Ship Packages Within D Days (LeetCode #1011)** - Another excellent "on answer" problem with a similar structure.
8.  **Find Peak Element (LeetCode #162)** - A variation that tests understanding of local conditions in binary search.

By following this progression, you'll be able to recognize when an American Express problem is asking for Binary Search, even when it's disguised as an optimization question. Remember, their goal is to see if you can replace an O(n²) or O(n) brute-force solution with an O(n log n) or O(log n) optimized one by spotting the monotonic property.

[Practice Binary Search at American Express](/company/american-express/binary-search)
