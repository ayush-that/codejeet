---
title: "Sorting Questions at Zepto: What to Expect"
description: "Prepare for Sorting interview questions at Zepto — patterns, difficulty breakdown, and study tips."
date: "2030-11-28"
category: "dsa-patterns"
tags: ["zepto", "sorting", "interview prep"]
---

## Why Sorting Matters at Zepto

Zepto, the 10-minute grocery delivery platform, operates in a world where milliseconds matter. Their entire business model is built on speed—from warehouse picking algorithms to delivery route optimization. This makes sorting not just an algorithmic curiosity, but a **core operational competency**. When you have thousands of pending orders, each with multiple items scattered across a dark store, the order in which you process them directly impacts delivery times and customer satisfaction.

In interviews, sorting appears in about 18% of their technical questions (5 out of 28). But that number is deceptive—sorting concepts frequently appear _embedded_ within other problems. You might be asked to find the top K most frequently purchased items (a sorting problem disguised as a heap problem), or optimize delivery batches (which often involves sorting intervals). Interviewers here don’t just test whether you know `array.sort()`. They test whether you understand _when_ to sort, _what_ to sort by, and _which_ sorting approach minimizes time in a real-time system.

## Specific Patterns Zepto Favors

Zepto’s sorting questions lean heavily toward **applied, comparator-based sorting** and **sorting as a preprocessing step** for more complex algorithms. You won’t see “implement quicksort” here. Instead, you’ll see problems where sorting transforms an intractable problem into a manageable one.

1. **Custom Sorting with Comparators**: Problems where you sort objects by multiple keys or custom logic. Think sorting delivery orders by priority, then by distance, then by item count.
2. **Sorting + Two Pointers**: After sorting an array, using two pointers to find pairs or optimize a metric. Common in resource allocation problems.
3. **Interval Sorting**: Sorting by start or end times, then merging or finding overlaps—directly applicable to scheduling delivery slots or batch assignments.
4. **Top K Elements**: Using partial sorting or heaps to find extremes without fully sorting, critical for real-time analytics.

A classic Zepto-style problem is **Meeting Rooms II (LeetCode #253)**. It’s not explicitly a “sorting” problem, but the efficient solution requires sorting meeting start and end times. Another is **Merge Intervals (LeetCode #56)**, which is pure sorting logic applied to time blocks.

## How to Prepare

Master the pattern of “sort first, then process.” The key insight is that sorting often brings order to chaos, allowing O(n²) brute force solutions to become O(n log n) elegant ones. Let’s look at the most important variation: custom comparators.

In many Zepto problems, you’ll sort objects not by their natural order, but by business logic. For example, sort tasks by deadline, but if deadlines are equal, sort by processing time. Here’s how you implement that in three languages:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def sort_tasks(tasks):
    """
    Each task is a tuple (deadline, processing_time).
    Sort by deadline ascending, then by processing_time ascending.
    """
    # In Python, tuples are compared lexicographically
    tasks.sort(key=lambda x: (x[0], x[1]))
    return tasks

# Example with custom object
class Order:
    def __init__(self, priority, distance, item_count):
        self.priority = priority
        self.distance = distance
        self.item_count = item_count

    def __repr__(self):
        return f"Order({self.priority}, {self.distance}, {self.item_count})"

# Sort by priority (desc), then distance (asc), then item_count (desc)
orders = [
    Order(1, 5.2, 3),
    Order(2, 3.1, 5),
    Order(1, 5.2, 1),
    Order(2, 1.5, 2)
]

orders.sort(key=lambda o: (-o.priority, o.distance, -o.item_count))
print(orders)  # Higher priority first, then closer, then more items
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function sortTasks(tasks) {
  // Each task is [deadline, processingTime]
  // Sort by deadline ascending, then by processingTime ascending
  return tasks.sort((a, b) => {
    if (a[0] !== b[0]) {
      return a[0] - b[0]; // deadline ascending
    }
    return a[1] - b[1]; // processingTime ascending
  });
}

// Example with custom comparator for objects
const orders = [
  { priority: 1, distance: 5.2, itemCount: 3 },
  { priority: 2, distance: 3.1, itemCount: 5 },
  { priority: 1, distance: 5.2, itemCount: 1 },
  { priority: 2, distance: 1.5, itemCount: 2 },
];

// Sort by priority (desc), then distance (asc), then itemCount (desc)
orders.sort((a, b) => {
  if (a.priority !== b.priority) {
    return b.priority - a.priority; // descending
  }
  if (a.distance !== b.distance) {
    return a.distance - b.distance; // ascending
  }
  return b.itemCount - a.itemCount; // descending
});
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.*;

public class ZeptoSorting {
    static class Order {
        int priority;
        double distance;
        int itemCount;

        Order(int p, double d, int i) {
            priority = p;
            distance = d;
            itemCount = i;
        }

        @Override
        public String toString() {
            return String.format("Order(%d, %.1f, %d)", priority, distance, itemCount);
        }
    }

    public static void main(String[] args) {
        List<Order> orders = Arrays.asList(
            new Order(1, 5.2, 3),
            new Order(2, 3.1, 5),
            new Order(1, 5.2, 1),
            new Order(2, 1.5, 2)
        );

        // Sort by priority (desc), then distance (asc), then itemCount (desc)
        orders.sort((a, b) -> {
            if (a.priority != b.priority) {
                return b.priority - a.priority; // descending
            }
            if (Double.compare(a.distance, b.distance) != 0) {
                return Double.compare(a.distance, b.distance); // ascending
            }
            return b.itemCount - a.itemCount; // descending
        });

        System.out.println(orders);
    }
}
```

</div>

Another critical pattern is **sorting then using two pointers**. This is essential for problems like "find two delivery routes that can be combined without exceeding a time limit."

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def find_optimal_pair(times, limit):
    """
    Given list of route times, find two routes whose combined time
    is maximum but <= limit. Return their sum or -1 if no pair exists.
    """
    times.sort()
    left, right = 0, len(times) - 1
    best = -1

    while left < right:
        current_sum = times[left] + times[right]
        if current_sum <= limit:
            best = max(best, current_sum)
            left += 1  # Try to increase sum
        else:
            right -= 1  # Sum too large, decrease it

    return best

# Example: Route times in minutes, limit is 15 minutes
print(find_optimal_pair([3, 8, 4, 9, 2, 7], 15))  # 14 (7 + 8 or 9 + 5)
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function findOptimalPair(times, limit) {
  times.sort((a, b) => a - b);
  let left = 0;
  let right = times.length - 1;
  let best = -1;

  while (left < right) {
    const currentSum = times[left] + times[right];
    if (currentSum <= limit) {
      best = Math.max(best, currentSum);
      left++; // Try to increase sum
    } else {
      right--; // Sum too large, decrease it
    }
  }

  return best;
}

// Example usage
console.log(findOptimalPair([3, 8, 4, 9, 2, 7], 15)); // 14
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

public class TwoPointerSort {
    public static int findOptimalPair(int[] times, int limit) {
        Arrays.sort(times);
        int left = 0, right = times.length - 1;
        int best = -1;

        while (left < right) {
            int currentSum = times[left] + times[right];
            if (currentSum <= limit) {
                best = Math.max(best, currentSum);
                left++; // Try to increase sum
            } else {
                right--; // Sum too large, decrease it
            }
        }

        return best;
    }

    public static void main(String[] args) {
        int[] times = {3, 8, 4, 9, 2, 7};
        System.out.println(findOptimalPair(times, 15)); // 14
    }
}
```

</div>

## How Zepto Tests Sorting vs Other Companies

At FAANG companies, sorting questions often test deep algorithmic knowledge: "Explain the difference between quicksort and mergesort in terms of cache locality." At startups like Zepto, the focus is **applied efficiency**. They want to see if you recognize that sorting an array of 1 million customer orders is O(n log n), but if you only need the top 100, you can use a heap for O(n log k).

What's unique about Zepto's approach is the **real-world context**. Problems are framed around delivery windows, inventory management, or route optimization. The sorting logic always serves a business goal. They might give you a problem where the naive solution is O(n²), then watch to see if you recognize that sorting reduces it to O(n log n). The difficulty is usually medium—they're testing pattern recognition, not algorithm invention.

## Study Order

1. **Basic Sorting APIs**: Know how to sort arrays and lists in your language of choice, including custom comparators. This is foundational.
2. **Sorting as Preprocessing**: Practice problems where sorting the input first simplifies everything (like Two Sum II - Input Array Is Sorted, #167).
3. **Interval Sorting**: Master sorting intervals by start or end time, then processing in one pass (Merge Intervals #56, Meeting Rooms II #253).
4. **Two Pointers After Sorting**: The pattern shown above—sort then use two pointers to find pairs or optimize.
5. **Top K Elements**: Learn when to use quickselect (O(n) average) vs. heap (O(n log k)) vs. full sort (O(n log n)).
6. **Advanced Custom Sorting**: Problems like Largest Number (#179) where you sort by concatenated comparison.

This order works because each step builds on the previous. You can't solve interval problems without understanding custom comparators. You can't optimize two-pointer solutions without recognizing that sorting enables them.

## Recommended Practice Order

1. **Merge Intervals (#56)** - The fundamental interval sorting pattern.
2. **Meeting Rooms II (#253)** - Interval sorting applied to counting resources.
3. **Two Sum II - Input Array Is Sorted (#167)** - Basic two-pointer after sorting.
4. **K Closest Points to Origin (#973)** - Custom comparator practice.
5. **Top K Frequent Elements (#347)** - When not to fully sort.
6. **Non-overlapping Intervals (#435)** - Greedy interval scheduling (sort by end time).
7. **Largest Number (#179)** - Advanced custom comparator challenge.

After these seven, you'll have covered 90% of sorting patterns Zepto uses. The key is to internalize the thought process: "Would sorting this input make the problem easier? What should I sort by? Do I need to sort entirely or just partially?"

[Practice Sorting at Zepto](/company/zepto/sorting)
