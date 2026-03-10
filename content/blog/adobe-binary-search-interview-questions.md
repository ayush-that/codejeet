---
title: "Binary Search Questions at Adobe: What to Expect"
description: "Prepare for Binary Search interview questions at Adobe — patterns, difficulty breakdown, and study tips."
date: "2027-08-20"
category: "dsa-patterns"
tags: ["adobe", "binary-search", "interview prep"]
---

If you're preparing for Adobe interviews, you've likely seen the statistic: 24 of their 227 tagged problems on LeetCode involve Binary Search. That's roughly 10.5%, a significant chunk that demands your attention. But this number alone is misleading. In my experience conducting and analyzing interviews, Binary Search at Adobe isn't just about finding a number in a sorted array. It's a core tool for solving optimization problems, searching in rotated or unknown spaces, and answering "find the minimum/maximum of something" questions that are prevalent in their domains—think PDF rendering (finding page breaks), Adobe Analytics (searching through time-series data), or Photoshop (working with pixel data arrays). You will almost certainly face at least one problem that uses the Binary Search _paradigm_, even if it's cleverly disguised.

## Specific Patterns Adobe Favors

Adobe's Binary Search problems tend to cluster around three specific, non-basic patterns. They test your ability to recognize when Binary Search applies beyond the obvious sorted list.

1.  **Search in a Rotated or Modified Sorted Array:** This is a staple. The classic "sorted array was rotated" scenario tests if you understand that one half of a rotated array is always sorted. Problems like **Search in Rotated Sorted Array (#33)** and **Find Minimum in Rotated Sorted Array (#153)** are highly representative.
2.  **Binary Search on Answer (or "Optimization Problems"):** This is arguably the most important pattern for Adobe. Here, you are not searching an explicit array. Instead, you have a search space of possible answers (e.g., a capacity, a time, a distance), and you use Binary Search to find the minimum or maximum feasible answer. A quintessential example is **Capacity To Ship Packages Within D Days (#1011)**. The question "What's the least capacity?" defines a monotonic condition: if a capacity `C` works, then any capacity > `C` also works. This creates the perfect setup for Binary Search.
3.  **Search in a 2D or Multi-Dimensional Space:** While less frequent, problems like **Search a 2D Matrix (#74)** appear. The key is recognizing the sorted property that allows a 1D Binary Search to be mapped onto 2D indices.

They rarely ask the vanilla "find target in sorted array." The twist is always present.

## How to Prepare

The mental shift for pattern #2 (Binary Search on Answer) is critical. Your preparation must internalize this template:

1.  Identify the search space (e.g., `low = max(weights)`, `high = sum(weights)`).
2.  Define a helper function `canDo(x)` that returns `True` if `x` is a feasible answer.
3.  Perform a standard Binary Search on `[low, high]`. If `canDo(mid)` is true, you might look for a smaller answer (`high = mid`). If false, you need a larger answer (`low = mid + 1`).

Let's look at the core implementation pattern for a rotated array search, which is different from the vanilla approach.

<div class="code-group">

```python
def search_rotated(nums, target):
    """
    Search target in a rotated sorted array (no duplicates).
    Time: O(log n) | Space: O(1)
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # Determine which half is properly sorted
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
```

```javascript
function searchRotated(nums, target) {
  // Time: O(log n) | Space: O(1)
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);

    if (nums[mid] === target) return mid;

    // Check which side is sorted
    if (nums[left] <= nums[mid]) {
      // Left side is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // Search left sorted side
      } else {
        left = mid + 1; // Search right side
      }
    } else {
      // Right side is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1; // Search right sorted side
      } else {
        right = mid - 1; // Search left side
      }
    }
  }
  return -1;
}
```

```java
public int searchRotated(int[] nums, int target) {
    // Time: O(log n) | Space: O(1)
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return mid;

        // Determine the sorted half
        if (nums[left] <= nums[mid]) { // Left half [left..mid] is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1; // Target lies in the sorted left half
            } else {
                left = mid + 1;  // Target lies in the right half
            }
        } else { // Right half [mid..right] is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;  // Target lies in the sorted right half
            } else {
                right = mid - 1; // Target lies in the left half
            }
        }
    }
    return -1;
}
```

</div>

## How Adobe Tests Binary Search vs Other Companies

Compared to other major tech companies, Adobe's Binary Search questions have a distinct flavor:

- **vs. Google:** Google often embeds Binary Search in much more complex, multi-step problems (e.g., find the k-th smallest in a sorted matrix, or a complex simulation). Adobe's problems are more self-contained and directly test your mastery of the pattern's variations.
- **vs. Amazon:** Amazon leans heavily on the "Binary Search on Answer" pattern for optimization in system design contexts (like the ship packages problem). Adobe uses this pattern too, but often applies it to data structure or algorithm optimization questions that feel closer to their product suite.
- **vs. Meta:** Meta frequently uses Binary Search in conjunction with other patterns (e.g., Binary Search + DFS). Adobe's questions are more "pure" in testing your understanding of the search boundaries and conditions.

The unique aspect at Adobe is the **emphasis on clean, bug-free implementation of the modified search logic**. Interviewers will watch closely for your off-by-one errors, how you handle the `<=` vs `<` comparisons, and whether you can correctly identify the sorted half in a rotated array. The difficulty is usually in the "Medium" range, but the expectation for precision is high.

## Study Order

Tackle these sub-topics in this order to build a solid foundation before hitting Adobe's favorite patterns:

1.  **Classic Binary Search:** Master the basic iterative and recursive versions. Understand why `mid = left + (right - left) / 2` is used to avoid overflow.
2.  **Search with Duplicates & Variants:** Practice **Find First and Last Position of Element in Sorted Array (#34)**. This teaches you how to modify the basic algorithm to find boundaries, which is a fundamental skill.
3.  **Search in Rotated Sorted Array:** Start with finding the minimum (#153), then progress to searching for a target (#33). This pattern relies on comparing `nums[mid]` with `nums[left]` or `nums[right]` to identify the sorted half.
4.  **Binary Search on Answer (Optimization):** This is the conceptual leap. Start with a simple problem like **Sqrt(x) (#69)** to see the pattern, then move to **Capacity To Ship Packages (#1011)** and **Split Array Largest Sum (#410)**. The core challenge is writing the feasibility function `canDo(x)`.
5.  **Search in 2D/Structured Data:** Finally, practice mapping a 1D index to 2D coordinates in **Search a 2D Matrix (#74)**.

This order works because each step introduces one new conceptual twist on top of a pattern you've just solidified.

## Recommended Practice Order

Solve these specific problems in sequence. Each builds towards the patterns favored at Adobe.

1.  **Binary Search (#704)** - The absolute baseline.
2.  **First Bad Version (#278)** - Teaches the "find first true" variant.
3.  **Find First and Last Position (#34)** - Essential for understanding search boundaries.
4.  **Find Minimum in Rotated Sorted Array (#153)** - Introduces the rotated array logic.
5.  **Search in Rotated Sorted Array (#33)** - Applies the rotated logic to target search.
6.  **Sqrt(x) (#69)** - Gentle introduction to "Binary Search on Answer."
7.  **Capacity To Ship Packages (#1011)** - The canonical Adobe-style optimization problem.
8.  **Split Array Largest Sum (#410)** - Another excellent optimization problem.
9.  **Search a 2D Matrix (#74)** - For completeness on structured data.

Mastering this progression will make you exceptionally well-prepared for any Binary Search question Adobe throws your way. Remember, the goal isn't to memorize code, but to internalize the decision logic: "How do I determine which half to discard based on the properties of this specific problem?"

[Practice Binary Search at Adobe](/company/adobe/binary-search)
