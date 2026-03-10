---
title: "Binary Search Questions at Goldman Sachs: What to Expect"
description: "Prepare for Binary Search interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-07-31"
category: "dsa-patterns"
tags: ["goldman-sachs", "binary-search", "interview prep"]
---

If you're preparing for a Goldman Sachs technical interview, you'll likely encounter Binary Search. With 30 dedicated problems in their tagged question bank, it's a significant focus area. But here's the crucial insight: at Goldman Sachs, Binary Search is rarely about finding a number in a sorted array. Instead, it's a powerful algorithmic pattern used to solve optimization problems, often disguised within domains like financial modeling, data stream analysis, or system design. You need to recognize when to apply it and how to adapt its classic form.

## Specific Patterns Goldman Sachs Favors

Goldman Sachs interviewers favor Binary Search problems that test your ability to **identify the search space and define a valid predicate function**. The classic "find target in sorted array" is a warm-up; the real challenges involve searching for an optimal value in a result space, not an index in an array.

The most common patterns are:

1.  **Binary Search on Answer (or "Binary Search for the Result"):** You're not searching an existing data structure. You're searching for the _minimum_ or _maximum_ value that satisfies a certain condition. The "array" is a conceptual range of possible answers.
    - **Example:** "What is the minimum capacity a ship must have to ship all packages within D days?" (LeetCode #1011: _Capacity To Ship Packages Within D Days_). The answer is a weight, not an index. You binary search over possible capacities and use a helper function to check feasibility.

2.  **Search in a Modified/Rotated Sorted Array:** This tests your understanding of the invariant—that at least one half of a rotated array is always sorted. It's a favorite because it requires careful condition checking.
    - **Example:** LeetCode #33: _Search in Rotated Sorted Array_. You must determine which half is sorted and if your target lies within it.

3.  **Finding Boundaries (First/Last Position):** This is about precision and handling duplicates. A common finance analogy is finding the first time a stock price crossed a threshold or the last valid data point before an anomaly.
    - **Example:** LeetCode #34: _Find First and Last Position of Element in Sorted Array_. It requires two binary searches with slight variations in the termination condition.

Here is the canonical template for the "Binary Search on Answer" pattern, which is paramount for Goldman Sachs:

<div class="code-group">

```python
def binary_search_on_answer(possible_range):
    """
    Template for finding the minimum value that satisfies a condition.
    """
    left, right = min_possible, max_possible  # Define your search space

    while left < right:
        mid = left + (right - left) // 2  # Prevents overflow, standard in interviews

        if condition(mid):  # The core predicate: "Is mid good enough?"
            right = mid     # Try for a smaller answer (for min problem)
        else:
            left = mid + 1  # Must increase the answer

    # Post-processing: left == right, the smallest value that meets the condition
    return left

# Example for LeetCode #1011
def shipWithinDays(weights, days):
    def can_ship(capacity):
        current_load, days_needed = 0, 1
        for w in weights:
            if current_load + w > capacity:
                days_needed += 1
                current_load = 0
            current_load += w
        return days_needed <= days

    left, right = max(weights), sum(weights)
    while left < right:
        mid = (left + right) // 2
        if can_ship(mid):
            right = mid
        else:
            left = mid + 1
    return left
# Time: O(n log S) where n is len(weights), S is sum(weights) | Space: O(1)
```

```javascript
/**
 * Template for finding the minimum value that satisfies a condition.
 */
function binarySearchOnAnswer(minPossible, maxPossible, condition) {
  let left = minPossible;
  let right = maxPossible;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (condition(mid)) {
      right = mid; // Try for a smaller answer
    } else {
      left = mid + 1; // Must increase
    }
  }
  return left; // or right, they are equal
}

// Example for LeetCode #1011
function shipWithinDays(weights, days) {
  const canShip = (capacity) => {
    let currentLoad = 0,
      daysNeeded = 1;
    for (const w of weights) {
      if (currentLoad + w > capacity) {
        daysNeeded++;
        currentLoad = 0;
      }
      currentLoad += w;
    }
    return daysNeeded <= days;
  };

  let left = Math.max(...weights);
  let right = weights.reduce((a, b) => a + b, 0);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canShip(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
// Time: O(n log S) | Space: O(1)
```

```java
// Template for finding the minimum value that satisfies a condition.
public int binarySearchOnAnswer(int minPossible, int maxPossible) {
    int left = minPossible;
    int right = maxPossible;

    while (left < right) {
        int mid = left + (right - left) / 2; // Standard overflow-safe calculation

        if (condition(mid)) {
            right = mid; // Try for a smaller answer
        } else {
            left = mid + 1; // Must increase
        }
    }
    return left; // left == right
}

// Example for LeetCode #1011
public int shipWithinDays(int[] weights, int days) {
    int left = 0, right = 0;
    for (int w : weights) {
        left = Math.max(left, w);
        right += w;
    }

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canShip(weights, days, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

private boolean canShip(int[] weights, int days, int capacity) {
    int currentLoad = 0, daysNeeded = 1;
    for (int w : weights) {
        if (currentLoad + w > capacity) {
            daysNeeded++;
            currentLoad = 0;
        }
        currentLoad += w;
    }
    return daysNeeded <= days;
}
// Time: O(n log S) | Space: O(1)
```

</div>

## How Goldman Sachs Tests Binary Search vs Other Companies

At companies like Google or Meta, a Binary Search problem might be one part of a more complex, multi-step problem. At Goldman Sachs, the Binary Search _is_ often the core of the problem, but the challenge lies in the problem framing. They might embed it in a financial context: "Find the minimum interest rate that keeps default risk below X%" or "Determine the maximum transaction batch size that doesn't exceed latency SLOs." The difficulty isn't in the code—it's in realizing that the problem reduces to a monotonic condition you can test, making Binary Search the optimal O(log n) solution versus a naive O(n) linear scan.

Their questions often feel more like applied mathematics. You need to translate the business constraint into a boolean function `condition(mid)` that returns True or False, and prove it's monotonic (e.g., if capacity `X` works, then all capacities > `X` also work). This logical leap is what they're evaluating.

## Study Order

Master this topic in this logical sequence:

1.  **Classic Binary Search:** Internalize the non-recursive, two-pointer approach. Be able to implement it flawlessly and explain the `mid = left + (right - left) // 2` idiom to prevent overflow.
2.  **Finding Boundaries:** Practice variations that find the first or last occurrence. This teaches you to tweak the condition when `nums[mid] == target`. This is critical for clean code.
3.  **Search in Rotated Sorted Array:** This solidifies your ability to analyze which partition is sorted and how to discard the correct half. It's a direct test of the pattern's flexibility.
4.  **Binary Search on Answer:** This is the main event. Start with straightforward problems like _Capacity To Ship Packages_ before moving to more abstract ones.
5.  **Advanced Variations:** This includes 2D binary search (e.g., _Search a 2D Matrix II_), or problems where the predicate function itself is non-trivial (e.g., involving another algorithm like greedy or DFS).

## Recommended Practice Order

Solve these problems in sequence to build the required skills:

1.  **LeetCode #704: Binary Search** - The pure, basic form. Do it perfectly.
2.  **LeetCode #34: Find First and Last Position of Element in Sorted Array** - Master boundary finding.
3.  **LeetCode #33: Search in Rotated Sorted Array** - Understand the rotated array invariant.
4.  **LeetCode #153: Find Minimum in Rotated Sorted Array** - A slight twist on the same theme.
5.  **LeetCode #1011: Capacity To Ship Packages Within D Days** - Your first "Binary Search on Answer." This is a Goldman Sachs staple.
6.  **LeetCode #410: Split Array Largest Sum** - A harder version of #1011, excellent for deepening the concept.
7.  **LeetCode #875: Koko Eating Bananas** - Another classic optimization-in-disguise problem.
8.  **LeetCode #162: Find Peak Element** - Uses binary search logic on a non-sorted but locally predictable array.

By following this path, you move from executing the algorithm to wielding it as a problem-solving tool. For your Goldman Sachs interview, focus less on memorizing solutions and more on practicing the art of asking: "Can I define a yes/no question for a candidate answer such that the answers form a sorted list `[no, no, ..., yes, yes, ...]`?" If you can, binary search is your solution.

[Practice Binary Search at Goldman Sachs](/company/goldman-sachs/binary-search)
