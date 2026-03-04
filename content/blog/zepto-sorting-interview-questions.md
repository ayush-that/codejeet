---
title: "Sorting Questions at Zepto: What to Expect"
description: "Prepare for Sorting interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-12-06"
category: "dsa-patterns"
tags: ["zepto", "sorting", "interview prep"]
---

Sorting questions appear in nearly 20% of Zepto's technical interview problems. For a company that manages real-time delivery logistics, inventory, and partner data, efficient sorting isn't an academic exercise—it's a core operational requirement. Systems that match customers to the nearest delivery executive, rank grocery items by relevance or price, and batch orders for optimal routing all rely on underlying sorting logic. Your ability to implement and, more importantly, _apply_ sorting algorithms demonstrates you can build the performant, scalable systems Zepto needs.

## What to Expect — types of problems

Zepto's sorting questions typically fall into two categories. The first is **direct application**, where you're asked to implement a modified sort or use sorting as the primary solution step. Examples include sorting a list of orders by delivery time, sorting products by price within a category, or implementing a custom comparator to arrange data.

The second, more common category is **sorting as a tool**. Here, sorting is the key insight that transforms an inefficient solution into an optimal one. You'll encounter problems where sorting the input first unlocks an efficient two-pointer approach, a binary search, or a greedy strategy. Classic patterns involve finding pairs with a given difference, merging overlapping intervals, or selecting non-conflicting tasks. Expect to justify _why_ sorting is the correct preprocessing step and analyze the time complexity trade-off.

## How to Prepare — study tips with one code example

Focus on understanding the properties of standard sorting algorithms (QuickSort, MergeSort) and their built-in language implementations. More crucial is mastering the application of sorting to other problem domains. Practice writing custom comparison functions fluently. For any problem involving pairs, overlaps, or ordering constraints, ask yourself: "Would sorting this input first simplify the logic?"

A key pattern is using sorting to enable a two-pointer solution. Consider the problem: "Given an array of order values and a target delivery cost, find if any two distinct orders sum exactly to the target."

A brute-force approach checks every pair (O(n²)). By sorting first, you can use a two-pointer technique for an O(n log n) solution.

<div class="code-group">

```python
def has_target_sum(orders, target):
    orders.sort()
    left, right = 0, len(orders) - 1
    while left < right:
        current_sum = orders[left] + orders[right]
        if current_sum == target:
            return True
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return False
```

```javascript
function hasTargetSum(orders, target) {
  orders.sort((a, b) => a - b);
  let left = 0;
  let right = orders.length - 1;
  while (left < right) {
    const currentSum = orders[left] + orders[right];
    if (currentSum === target) {
      return true;
    } else if (currentSum < target) {
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

public class OrderChecker {
    public static boolean hasTargetSum(int[] orders, int target) {
        Arrays.sort(orders);
        int left = 0;
        int right = orders.length - 1;
        while (left < right) {
            int currentSum = orders[left] + orders[right];
            if (currentSum == target) {
                return true;
            } else if (currentSum < target) {
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

1.  **Fundamentals:** Implement basic sorts and practice with custom comparators (e.g., sort objects by multiple fields).
2.  **Core Patterns:** Solve problems where sorting enables two-pointer techniques, greedy selection, or binary search.
3.  **Zepto Context:** Apply these patterns to logistics-themed problems, like scheduling deliveries (non-overlapping intervals) or matching orders (finding pairs).

Master these concepts to show you don't just know how to sort, but know when and why to use it.

[Practice Sorting at Zepto](/company/zepto/sorting)
