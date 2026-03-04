---
title: "Sorting Questions at Expedia: What to Expect"
description: "Prepare for Sorting interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-06-12"
category: "dsa-patterns"
tags: ["expedia", "sorting", "interview prep"]
---

Sorting questions appear in nearly 15% of Expedia's technical interview problem set. For a company managing vast datasets—flight itineraries, hotel bookings, price comparisons, and user reviews—efficient data organization is not an academic exercise. It’s a core operational requirement. The ability to sort data, or to leverage sorting as a foundational step in a more complex algorithm, directly translates to building performant features like ranking search results, finding optimal travel bundles, or scheduling backend processes. Mastering these questions demonstrates you can think about data systematically and implement efficient solutions under constraints.

## What to Expect — Types of Problems

Expedia's sorting questions typically extend beyond asking you to implement a basic sort. You should be prepared for two main categories:

1.  **Direct Application and Hybrid Problems:** These questions require you to apply a sorting algorithm to a dataset as a primary step. Examples include merging sorted lists (like combining hotel results from different providers), finding the Kth largest/smallest element (e.g., a top-rated hotel), or scheduling problems (like arranging bookings). You'll need to know when sorting is the optimal pre-processing step.
2.  **Custom Comparison Sorting:** This is a frequent pattern. You'll be given objects (like `[price, rating, distance]` for hotels) and asked to sort them based on complex, multi-key rules. This tests your understanding of your language's sort comparator and the ability to translate business logic (e.g., "sort by highest rating, then by lowest price") into clean code.

The focus is on applying the right tool (`O(n log n)` sorting) to simplify a problem, not on implementing Quicksort from scratch. Expect to use your language's built-in sort function effectively.

## How to Prepare — Study Tips with Code Example

Focus on concepts, not memorization. Understand the time and space complexity of standard sorts (Merge Sort, QuickSort, Heap Sort). Practice writing custom comparators until it's second nature. A key strategy is to identify when a problem's "brute force" solution is `O(n^2)`; if sorting the input first would reduce it to `O(n log n)`, that's often the correct path.

A fundamental pattern is the **Two-Pointer Technique on Sorted Data**. Once data is sorted, you can often solve problems like finding pairs or triplets that meet a condition (e.g., "find two hotel packages whose total price equals a target budget") in linear time.

<div class="code-group">

```python
def find_pair_with_sum(sorted_prices, target):
    left, right = 0, len(sorted_prices) - 1
    while left < right:
        current_sum = sorted_prices[left] + sorted_prices[right]
        if current_sum == target:
            return [sorted_prices[left], sorted_prices[right]]
        elif current_sum < target:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum
    return []  # No pair found

# Example: Find two add-ons that sum to $200
# prices = [50, 75, 120, 145, 180]
# find_pair_with_sum(prices, 200) -> [120, 80]
```

```javascript
function findPairWithSum(sortedPrices, target) {
  let left = 0;
  let right = sortedPrices.length - 1;
  while (left < right) {
    const currentSum = sortedPrices[left] + sortedPrices[right];
    if (currentSum === target) {
      return [sortedPrices[left], sortedPrices[right]];
    } else if (currentSum < target) {
      left++; // Need a larger sum
    } else {
      right--; // Need a smaller sum
    }
  }
  return []; // No pair found
}
```

```java
public int[] findPairWithSum(int[] sortedPrices, int target) {
    int left = 0;
    int right = sortedPrices.length - 1;
    while (left < right) {
        int currentSum = sortedPrices[left] + sortedPrices[right];
        if (currentSum == target) {
            return new int[]{sortedPrices[left], sortedPrices[right]};
        } else if (currentSum < target) {
            left++; // Need a larger sum
        } else {
            right--; // Need a smaller sum
        }
    }
    return new int[]{}; // No pair found
}
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  Start with **basic comparator writing** for objects and multi-key sorts.
2.  Move to **classic applications**: Kth element, merging intervals, merging sorted lists.
3.  Tackle **hybrid problems** where sorting enables a two-pointer or greedy solution (like the pair-sum example above).
4.  Finally, practice **Expedia-specific problems** to familiarize yourself with their problem style and constraints.

[Practice Sorting at Expedia](/company/expedia/sorting)
