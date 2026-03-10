---
title: "Binary Search Questions at Turing: What to Expect"
description: "Prepare for Binary Search interview questions at Turing — patterns, difficulty breakdown, and study tips."
date: "2030-03-09"
category: "dsa-patterns"
tags: ["turing", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Turing

With 4 out of 40 questions dedicated to Binary Search, Turing allocates 10% of its problem bank to this algorithm. This is a significant allocation—higher than many companies—and signals that Binary Search is a core assessment area, not just a secondary topic. In real interviews at Turing, you're likely to encounter at least one Binary Search problem, often disguised within a more complex scenario. Unlike companies that test Binary Search as a pure algorithm question (e.g., "implement binary search"), Turing uses it as a tool to solve optimization problems on sorted or sortable data. The frequency here tells you something important: Turing values engineers who can recognize when a problem has a "search space" that can be halved, even when that space isn't an obvious array. This is a higher-order skill than simply memorizing the implementation.

## Specific Patterns Turing Favors

Turing's Binary Search problems tend to fall into two distinct categories, both more advanced than the textbook array search.

**1. The "Find Minimum/Maximum of Something" Optimization Pattern**
This is their most frequent pattern. You're given a scenario where you need to find the minimum or maximum value of some parameter that satisfies a condition. The trick is recognizing that if a value `X` works, then all values greater (or lesser) than `X` might also work, creating a monotonic condition perfect for binary search. The search space is often a range of integers, not an explicit array.

_Example LeetCode Analogy:_ **Koko Eating Bananas (#875)** is a perfect prototype. You search for the minimum eating speed `k` such that Koko can eat all bananas within `h` hours. For any candidate `k`, you can check if it's feasible (monotonic: if speed `k` works, any speed > `k` also works). Turing uses this exact pattern in problems like allocating resources or minimizing maximum load.

**2. The "Search in a Sorted but Transformed Array" Pattern**
Here, you have a data structure that is conceptually sorted but has been rotated, shifted, or has some non-obvious ordering property. The classic example is searching in a rotated sorted array. Turing extends this to matrices or custom data structures.

_Example LeetCode Analogy:_ **Search in Rotated Sorted Array (#33)**. The core skill is adapting the standard binary search logic by comparing `mid` with the boundaries to determine which side is properly sorted and where the target must lie.

<div class="code-group">

```python
# Pattern 1: Find Minimum Viable Value (Koko Eating Bananas style)
# Time: O(n * log(max(piles))) | Space: O(1)
def min_eating_speed(piles, h):
    def can_eat(k):
        # Monotonic feasibility function
        hours = 0
        for bananas in piles:
            hours += (bananas + k - 1) // k  # ceil division
            if hours > h:
                return False
        return True

    left, right = 1, max(piles)
    while left < right:
        mid = (left + right) // 2
        if can_eat(mid):
            right = mid  # Try for a smaller speed
        else:
            left = mid + 1  # Need a faster speed
    return left
```

```javascript
// Pattern 1: Find Minimum Viable Value
// Time: O(n * log(max(piles))) | Space: O(1)
function minEatingSpeed(piles, h) {
  const canEat = (k) => {
    let hours = 0;
    for (const bananas of piles) {
      hours += Math.ceil(bananas / k);
      if (hours > h) return false;
    }
    return true;
  };

  let left = 1;
  let right = Math.max(...piles);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canEat(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
```

```java
// Pattern 1: Find Minimum Viable Value
// Time: O(n * log(max(piles))) | Space: O(1)
public int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = 0;
    for (int p : piles) right = Math.max(right, p);

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
    for (int bananas : piles) {
        hours += (bananas + k - 1) / k; // Ceiling division
        if (hours > h) return false;
    }
    return true;
}
```

</div>

## How to Prepare

Master the two-step mental model: **1) Identify the search space and monotonic condition, 2) Implement the "feasibility check" function.** For Pattern 1, your practice should focus on writing clean, efficient feasibility functions (like `canEat` above). For Pattern 2, drill the logic of comparing the `mid` element with the boundaries to navigate the sorted segments.

Always verify your loop termination. The standard pattern `while (left < right)` with `right = mid` and `left = mid + 1` works for finding minimum viable values. For pure search, use `while (left <= right)` with `+/- 1` adjustments.

<div class="code-group">

```python
# Pattern 2: Search in Rotated Sorted Array
# Time: O(log n) | Space: O(1)
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Determine which side is properly sorted
        if nums[left] <= nums[mid]:  # Left side is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target is in the sorted left side
            else:
                left = mid + 1   # Target is in the right side
        else:  # Right side is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target is in the sorted right side
            else:
                right = mid - 1  # Target is in the left side
    return -1
```

```javascript
// Pattern 2: Search in Rotated Sorted Array
// Time: O(log n) | Space: O(1)
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
```

```java
// Pattern 2: Search in Rotated Sorted Array
// Time: O(log n) | Space: O(1)
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) {
            // Left part is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right part is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}
```

</div>

## How Turing Tests Binary Search vs Other Companies

At companies like Google or Meta, Binary Search often appears as a component in a more complex system design or multi-step problem (e.g., distributed search index). At Turing, the focus is more applied: you're given a business-like constraint (minimize cost, maximize throughput) and must frame it as a search problem. The difficulty is in the _framing_, not the implementation. Their questions are "cleaner" than the abstract puzzles at some hedge funds but more conceptually demanding than the straightforward array searches at many enterprise companies. What's unique is the emphasis on the **optimization flavor** (Pattern 1). They want to see if you can move from "find an exact item" to "find the optimal boundary where a condition flips."

## Study Order

1.  **Standard Binary Search on a Sorted Array:** Lock down the basic iterative implementation with perfect index management. This is your foundation.
2.  **Search in a Rotated Sorted Array:** Learn to handle transformed data. This teaches you to analyze the _state_ of the `mid` point relative to boundaries.
3.  **Find First/Last Position of an Element (Lower/Upper Bound):** Master the subtle `left < right` loops and off-by-one errors. This directly leads into the optimization pattern.
4.  **The Optimization Pattern (Min/Max of something):** This is the climax. Practice identifying the search space (often `[1, max_value]`) and writing the feasibility function.
5.  **Binary Search on a Matrix or Custom Structure:** Apply the pattern to 2D data or other non-linear but ordered spaces.

This order works because it builds from concrete array manipulation to abstract problem modeling. You cannot jump to step 4 without the muscle memory from steps 1-3.

## Recommended Practice Order

Solve these problems in sequence. Each builds a skill needed for Turing's questions.

1.  **Binary Search (#704)** - The absolute basic. Ensure you can write this flawlessly in under 2 minutes.
2.  **Search in Rotated Sorted Array (#33)** - Core Turing Pattern 2.
3.  **Find First and Last Position of Element in Sorted Array (#34)** - Teaches lower/upper bound logic.
4.  **Koko Eating Bananas (#875)** - The quintessential Turing Pattern 1. Study this exhaustively.
5.  **Capacity To Ship Packages Within D Days (#1011)** - A direct variant of the Koko pattern. If you understand #875, this should be straightforward.
6.  **Split Array Largest Sum (#410)** - A harder variant of the optimization pattern. This is near the upper bound of what Turing might ask.
7.  **Search a 2D Matrix (#74)** - Apply binary search to a 2D structure, a possible extension.

After this sequence, you will have covered the exact patterns Turing employs. The key is to internalize the template for the optimization pattern, as that is their favorite.

[Practice Binary Search at Turing](/company/turing/binary-search)
