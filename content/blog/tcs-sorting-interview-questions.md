---
title: "Sorting Questions at TCS: What to Expect"
description: "Prepare for Sorting interview questions at TCS — patterns, difficulty breakdown, and study tips."
date: "2027-09-15"
category: "dsa-patterns"
tags: ["tcs", "sorting", "interview prep"]
---

Sorting questions appear in 15% of TCS coding problems (34 out of 217). This frequency means you will almost certainly encounter one. Sorting is not just about ordering data; it’s a foundational technique that enables efficient solutions to more complex problems. Mastering it demonstrates your ability to manipulate data, understand time/space complexity, and apply algorithmic thinking—core skills TCS assesses in its technical interviews.

## What to Expect — Types of Problems

TCS sorting questions typically fall into three categories:

1.  **Direct Application:** Problems where sorting the input is the primary step to reach a solution. Examples include finding the Kth largest/smallest element, finding minimum/maximum differences, or arranging an array in a specific order (like wave form).
2.  **Sorting as an Enabler:** These problems use sorting to transform the problem into something simpler. After sorting, a linear scan or a two-pointer approach often solves it. Common examples include finding all unique triplets that sum to zero, finding pairs with a given difference, or merging overlapping intervals.
3.  **Custom Sorting:** Problems that require you to sort objects based on custom rules or multiple criteria. This tests your understanding of comparator functions. Examples include sorting strings by length and then lexicographically, or sorting jobs by profit and deadline.

You will rarely be asked to implement a raw sorting algorithm like quicksort from scratch. Instead, you’ll use your language’s built-in sort function and focus on how to apply it strategically.

## How to Prepare — Study Tips with Code Example

Focus on concepts, not memorization. Understand _why_ sorting helps for a given problem type. The most critical pattern is the **Two-Pointer Technique** applied on a sorted array. This is a cornerstone for solving problems involving pairs, triplets, or subarrays efficiently.

Practice by identifying the pattern: if a problem asks for elements satisfying a condition related to their values (like sum, difference, or proximity), sorting followed by a two-pointer scan is often the key.

Here is a classic example: **"Given an array, find if there exists a pair of elements with a given sum K."** After sorting, you can solve this in O(n log n) time with O(1) extra space.

<div class="code-group">

```python
def has_pair_with_sum(arr, K):
    arr.sort()  # Built-in Timsort: O(n log n)
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == K:
            return True
        elif current_sum < K:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum
    return False
```

```javascript
function hasPairWithSum(arr, K) {
  arr.sort((a, b) => a - b); // Numeric sort
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const currentSum = arr[left] + arr[right];
    if (currentSum === K) {
      return true;
    } else if (currentSum < K) {
      left++;
    } else {
      right--;
    }
  }
  return false;
}
```

```java
import java.util.Arrays;

public class Main {
    public static boolean hasPairWithSum(int[] arr, int K) {
        Arrays.sort(arr); // Dual-Pivot Quicksort
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int currentSum = arr[left] + arr[right];
            if (currentSum == K) {
                return true;
            } else if (currentSum < K) {
                left++;
            } else {
                right--;
            }
        }
        return false;
    }
}
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  Start with **basic applications**: Kth element, minimum difference, moving zeros.
2.  Move to **two-pointer patterns**: Pair sum, triplet sum, remove duplicates.
3.  Tackle **custom sorting**: Practice writing comparator functions for objects.
4.  Finally, solve **integrated problems** where sorting is one part of a larger solution, like interval merging or task scheduling.

This order ensures you solidify the core mechanic before applying it in increasingly complex scenarios.

[Practice Sorting at TCS](/company/tcs/sorting)
