---
title: "Binary Search Questions at Zeta: What to Expect"
description: "Prepare for Binary Search interview questions at Zeta — patterns, difficulty breakdown, and study tips."
date: "2030-05-28"
category: "dsa-patterns"
tags: ["zeta", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Zeta

Zeta’s interview question distribution reveals a clear signal: with 5 out of 35 total questions being Binary Search, it’s a **secondary but significant** focus area. This isn't a company that asks Binary Search in every interview, but when they do, they expect you to have it down cold. In real interviews, you're more likely to see it as a component of a larger problem—often disguised within a data processing or optimization scenario—rather than a standalone "find the target in a sorted array" question. The frequency suggests that while not a "core" topic like Arrays or Dynamic Programming, Binary Search is a tool they value for assessing a candidate's ability to think about efficiency and boundaries. Missing a Binary Search question at Zeta is particularly costly because these problems are designed to have a clean, optimal solution; a brute-force approach will almost certainly be a rejection.

## Specific Patterns Zeta Favors

Zeta’s Binary Search problems tend to cluster around two specific, more advanced patterns. They rarely test the vanilla algorithm.

1.  **Search in a Sorted but Rotated or Modified Array:** This is their favorite twist. The array isn't perfectly sorted from A-Z, but it has a sorted property you can exploit. Problems like **Search in Rotated Sorted Array (LeetCode #33)** and **Find Minimum in Rotated Sorted Array (LeetCode #153)** are classic examples of this pattern. They test your ability to adapt the basic `mid` comparison logic to a more complex invariant.

2.  **Binary Search on Answer (or "Guess the Answer"):** This is the most powerful and frequently tested pattern at Zeta. Here, you aren't searching for an element in a physical array. Instead, you're searching for a specific _answer_ within a **monotonic search space**. The problem defines a condition function `isValid(guess)`, and you use Binary Search to find the smallest (or largest) `guess` for which the condition is true. This pattern is essential for problems like:
    - **Koko Eating Bananas (LeetCode #875):** Find the minimum eating speed `k`.
    - **Capacity To Ship Packages Within D Days (LeetCode #1011):** Find the minimum ship capacity.
    - **Split Array Largest Sum (LeetCode #410):** Find the minimum largest subarray sum.

The key insight is recognizing when the problem's ask ("find the minimum _something_") maps to a monotonic condition: if a candidate value `X` works, then all values greater than `X` also work (or vice-versa).

<div class="code-group">

```python
# Pattern: Binary Search on Answer (Finding Minimum Valid Value)
# Example: Koko Eating Bananas (LeetCode #875)
def minEatingSpeed(piles, h):
    def canEat(k):
        # Condition function: can Koko eat all piles at speed k within h hours?
        hours = 0
        for pile in piles:
            hours += (pile + k - 1) // k  # Ceiling division
        return hours <= h

    left, right = 1, max(piles)  # Search space: possible eating speeds
    while left < right:
        mid = (left + right) // 2
        if canEat(mid):
            right = mid  # Try for a smaller speed
        else:
            left = mid + 1  # Speed too slow, must increase
    return left
# Time: O(n * log(max(pile))) | Space: O(1)
```

```javascript
// Pattern: Binary Search on Answer (Finding Minimum Valid Value)
// Example: Koko Eating Bananas (LeetCode #875)
function minEatingSpeed(piles, h) {
  const canEat = (k) => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / k);
    }
    return hours <= h;
  };

  let left = 1;
  let right = Math.max(...piles);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canEat(mid)) {
      right = mid; // Try for a smaller speed
    } else {
      left = mid + 1; // Speed too slow, must increase
    }
  }
  return left;
}
// Time: O(n * log(max(pile))) | Space: O(1)
```

```java
// Pattern: Binary Search on Answer (Finding Minimum Valid Value)
// Example: Koko Eating Bananas (LeetCode #875)
public int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = 0;
    for (int pile : piles) {
        right = Math.max(right, pile);
    }

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canEat(piles, h, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

private boolean canEat(int[] piles, int h, int k) {
    long hours = 0; // Use long to prevent overflow
    for (int pile : piles) {
        hours += (pile + k - 1) / k; // Ceiling division
    }
    return hours <= h;
}
// Time: O(n * log(max(pile))) | Space: O(1)
```

</div>

## How Zeta Tests Binary Search vs Other Companies

Zeta's Binary Search questions sit at a unique intersection. Compared to FAANG companies:

- **Google/Amazon** might embed Binary Search in a vastly more complex system design or data structure question.
- **Meta** often uses it in a more straightforward, performance-critical context related to their platforms.

Zeta's approach is more akin to **high-frequency trading or data platform companies**. The questions are mathematically clean and focus on **optimal resource allocation or finding a precise threshold**—concepts directly relevant to financial technology and efficient batch processing. The difficulty is less about complex data structures and more about pure algorithmic insight: can you frame the problem correctly? The "twist" is usually in the problem statement itself, not in the implementation details.

## How to Prepare

Your study should be pattern-first, not problem-first.

1.  **Master the Classic Template:** Be able to write a bug-free, iterative Binary Search that avoids overflow and handles edge cases. Know the difference between `left <= right` (searching in a range) and `left < right` (finding a boundary).
2.  **Practice the Condition Function:** For "Binary Search on Answer" problems, spend most of your time designing the `isValid(guess)` function. This is the core of the problem. The Binary Search part is just the efficient finder.
3.  **Draw the Search Space:** For every problem, sketch the monotonic function. If `guess` is on the x-axis and `isValid(guess)` is on the y-axis, you should see a clear step function (e.g., all `false` then all `true`). This visualization confirms Binary Search is applicable.

<div class="code-group">

```python
# Pattern: Search in Rotated Sorted Array
# Example: LeetCode #33
def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Determine which side is normally sorted
        if nums[left] <= nums[mid]:  # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target is in the sorted left half
            else:
                left = mid + 1   # Target is in the right half
        else:  # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target is in the sorted right half
            else:
                right = mid - 1  # Target is in the left half
    return -1
# Time: O(log n) | Space: O(1)
```

```javascript
// Pattern: Search in Rotated Sorted Array
// Example: LeetCode #33
function search(nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
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
  return -1;
}
// Time: O(log n) | Space: O(1)
```

```java
// Pattern: Search in Rotated Sorted Array
// Example: LeetCode #33
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) { // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else { // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}
// Time: O(log n) | Space: O(1)
```

</div>

## Study Order

1.  **Standard Binary Search:** Build muscle memory for the iterative template. Problems: **704. Binary Search**.
2.  **Search in Rotated Sorted Array:** Learn to handle a broken sorted invariant. Problems: **153. Find Minimum in Rotated Sorted Array**, **33. Search in Rotated Sorted Array**.
3.  **Binary Search on Answer (Basic):** Learn to identify the monotonic condition. Problems: **875. Koko Eating Bananas**, **1011. Capacity To Ship Packages**.
4.  **Binary Search on Answer (Advanced):** Apply the pattern to less obvious search spaces. Problems: **410. Split Array Largest Sum**, **778. Swim in Rising Water**.
5.  **Binary Search on Data Structures:** Understand how it interfaces with other concepts. Problems: **74. Search a 2D Matrix**, **981. Time Based Key-Value Store**.

This order works because it builds from the absolute fundamental mechanic (Step 1) to its most common "twist" at Zeta (Step 2), then introduces the powerful paradigm shift of searching for an answer (Step 3), before combining complexity (Step 4) and related concepts (Step 5).

## Recommended Practice Order

Solve these problems in sequence to build the skill set Zeta tests:

1.  **704. Binary Search** (Vanilla)
2.  **153. Find Minimum in Rotated Sorted Array** (Rotated Array)
3.  **33. Search in Rotated Sorted Array** (Rotated Array + Target)
4.  **875. Koko Eating Bananas** (Binary Search on Answer - Introduction)
5.  **1011. Capacity To Ship Packages Within D Days** (Binary Search on Answer - Core)
6.  **410. Split Array Largest Sum** (Binary Search on Answer - Advanced)
7.  **74. Search a 2D Matrix** (Application in a 2D structure)

This sequence takes you from recognition to mastery of the two key patterns favored by Zeta.

[Practice Binary Search at Zeta](/company/zeta/binary-search)
