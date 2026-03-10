---
title: "Sorting Questions at DoorDash: What to Expect"
description: "Prepare for Sorting interview questions at DoorDash — patterns, difficulty breakdown, and study tips."
date: "2028-08-12"
category: "dsa-patterns"
tags: ["doordash", "sorting", "interview prep"]
---

## Why Sorting Matters at DoorDash

At DoorDash, sorting isn't just another algorithmic topic—it's a fundamental building block that directly mirrors their core business logic. When you open the DoorDash app, every restaurant list, every delivery time estimate, and every driver dispatch queue involves sorting operations. The platform needs to sort restaurants by relevance (distance, rating, price), sort delivery routes by efficiency, and sort orders by priority.

This practical relevance translates directly to their technical interviews. With 14 out of 87 total questions focused on sorting (approximately 16%), you're statistically likely to encounter at least one sorting-related problem in your interview loop. More importantly, these questions often serve as a gateway to assess your ability to handle real-time data processing and optimization—key skills for a company dealing with millions of concurrent orders and deliveries.

Unlike companies where sorting might appear as isolated algorithmic puzzles, DoorDash frequently embeds sorting within larger system design contexts. You might be asked to optimize a delivery dispatch system or implement a restaurant ranking algorithm, where sorting is the critical component that makes the entire system work efficiently.

## Specific Patterns DoorDash Favors

DoorDash's sorting questions tend to cluster around three specific patterns that reflect their operational needs:

1. **Custom Comparator Sorting** - Problems where you need to sort objects based on multiple criteria (e.g., sort drivers by proximity first, then by rating). This mirrors how they actually rank restaurants and drivers in production.

2. **Interval Merging with Sorting** - Scheduling delivery windows, merging overlapping time slots, or optimizing route segments. The sorting step is crucial for making these problems tractable.

3. **Top K Elements with Partial Sorting** - Finding the K closest restaurants, K most popular menu items, or K busiest delivery zones. These problems test whether you know when full sorting is unnecessary.

A classic example is **Merge Intervals (LeetCode #56)**, which appears in various guises at DoorDash. You might be asked to merge delivery time windows or combine overlapping service areas. Another frequent pattern is **K Closest Points to Origin (LeetCode #973)**, which directly models finding the nearest restaurants or drivers.

<div class="code-group">

```python
# Custom Comparator Pattern - Sorting drivers by distance then rating
# Time: O(n log n) | Space: O(1) for in-place sort, O(n) for Timsort
def sort_drivers(drivers):
    """
    Sort drivers by distance (ascending) first, then by rating (descending).
    Each driver is a tuple: (id, distance_in_miles, rating)
    """
    # Sort by distance ascending, then by rating descending
    drivers.sort(key=lambda x: (x[1], -x[2]))
    return drivers

# Example usage:
# drivers = [(1, 2.5, 4.8), (2, 1.2, 4.5), (3, 2.5, 4.9)]
# Result: [(2, 1.2, 4.5), (3, 2.5, 4.9), (1, 2.5, 4.8)]
```

```javascript
// Custom Comparator Pattern - Sorting drivers by distance then rating
// Time: O(n log n) | Space: O(log n) for V8's Timsort implementation
function sortDrivers(drivers) {
  // Each driver is an object: {id, distance, rating}
  return drivers.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance; // Ascending distance
    }
    return b.rating - a.rating; // Descending rating
  });
}

// Example usage:
// const drivers = [{id: 1, distance: 2.5, rating: 4.8}, ...]
// Result sorted by distance then rating
```

```java
// Custom Comparator Pattern - Sorting drivers by distance then rating
// Time: O(n log n) | Space: O(log n) for Java's Timsort
import java.util.*;

class Driver {
    int id;
    double distance;
    double rating;

    public Driver(int id, double distance, double rating) {
        this.id = id;
        this.distance = distance;
        this.rating = rating;
    }
}

public class DriverSorter {
    public static List<Driver> sortDrivers(List<Driver> drivers) {
        drivers.sort((a, b) -> {
            if (Double.compare(a.distance, b.distance) != 0) {
                return Double.compare(a.distance, b.distance);
            }
            return Double.compare(b.rating, a.rating); // Descending
        });
        return drivers;
    }
}
```

</div>

## How to Prepare

Mastering sorting for DoorDash requires moving beyond simple array.sort() calls. Here's my recommended approach:

1. **Understand the underlying algorithms** - Know when QuickSort (average O(n log n), worst O(n²)) is appropriate vs. MergeSort (stable, always O(n log n)) vs. HeapSort (good for partial sorting). DoorDash interviewers often ask about tradeoffs.

2. **Practice writing custom comparators** until they're second nature. The key insight: comparators should return negative, zero, or positive values to indicate ordering.

3. **Recognize when sorting is the optimization** - Many problems become trivial once you realize sorting first creates the structure you need. For example, **Meeting Rooms II (LeetCode #253)** becomes straightforward when you sort start times and use a min-heap for end times.

4. **Know your language's sorting specifics** - Python's Timsort is stable and adaptive, JavaScript's Array.sort() implementation varies by browser, Java's Arrays.sort() uses Dual-Pivot QuickSort for primitives and Timsort for objects.

<div class="code-group">

```python
# Top K Pattern with QuickSelect (Partial Sorting)
# Time: O(n) average, O(n²) worst | Space: O(1)
import random

def find_k_closest(points, k):
    """
    Find k closest points to origin using QuickSelect.
    Returns the k closest points in any order.
    """
    def distance(point):
        return point[0]**2 + point[1]**2

    def quick_select(left, right, k_smallest):
        if left == right:
            return

        pivot_index = random.randint(left, right)
        pivot_index = partition(left, right, pivot_index)

        if k_smallest == pivot_index:
            return
        elif k_smallest < pivot_index:
            quick_select(left, pivot_index - 1, k_smallest)
        else:
            quick_select(pivot_index + 1, right, k_smallest)

    def partition(left, right, pivot_index):
        pivot_distance = distance(points[pivot_index])
        points[pivot_index], points[right] = points[right], points[pivot_index]

        store_index = left
        for i in range(left, right):
            if distance(points[i]) < pivot_distance:
                points[store_index], points[i] = points[i], points[store_index]
                store_index += 1

        points[right], points[store_index] = points[store_index], points[right]
        return store_index

    quick_select(0, len(points) - 1, k)
    return points[:k]
```

```javascript
// Top K Pattern with Min-Heap
// Time: O(n log k) | Space: O(k)
function findKClosest(points, k) {
  // Max-heap implementation (we want to remove largest distances)
  const heap = [];

  function distance(point) {
    return point[0] * point[0] + point[1] * point[1];
  }

  for (let i = 0; i < points.length; i++) {
    const dist = distance(points[i]);

    if (heap.length < k) {
      heap.push([dist, points[i]]);
      // Bubble up
      let idx = heap.length - 1;
      while (idx > 0 && heap[Math.floor((idx - 1) / 2)][0] < heap[idx][0]) {
        [heap[Math.floor((idx - 1) / 2)], heap[idx]] = [heap[idx], heap[Math.floor((idx - 1) / 2)]];
        idx = Math.floor((idx - 1) / 2);
      }
    } else if (dist < heap[0][0]) {
      heap[0] = [dist, points[i]];
      // Heapify down
      let idx = 0;
      while (true) {
        let left = 2 * idx + 1;
        let right = 2 * idx + 2;
        let largest = idx;

        if (left < heap.length && heap[left][0] > heap[largest][0]) {
          largest = left;
        }
        if (right < heap.length && heap[right][0] > heap[largest][0]) {
          largest = right;
        }

        if (largest === idx) break;

        [heap[idx], heap[largest]] = [heap[largest], heap[idx]];
        idx = largest;
      }
    }
  }

  return heap.map((item) => item[1]);
}
```

```java
// Top K Pattern with Priority Queue
// Time: O(n log k) | Space: O(k)
import java.util.*;

public class KClosestPoints {
    public int[][] kClosest(int[][] points, int k) {
        // Max-heap: store the k smallest distances
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            (a, b) -> Integer.compare(b[0] * b[0] + b[1] * b[1],
                                     a[0] * a[0] + a[1] * a[1])
        );

        for (int[] point : points) {
            pq.offer(point);
            if (pq.size() > k) {
                pq.poll(); // Remove the point with largest distance
            }
        }

        int[][] result = new int[k][2];
        for (int i = 0; i < k; i++) {
            result[i] = pq.poll();
        }
        return result;
    }
}
```

</div>

## How DoorDash Tests Sorting vs Other Companies

DoorDash's sorting questions differ from other companies in several key ways:

**Compared to FAANG:** While Google might ask about theoretical aspects of sorting algorithms (stable vs unstable, in-place requirements), DoorDash focuses on practical application. They're more likely to ask "How would you sort delivery drivers in real-time?" than "Explain the difference between MergeSort and QuickSort."

**Compared to finance companies:** Banks like Goldman Sachs often ask sorting questions as pure algorithmic challenges. DoorDash embeds sorting within business context—you'll often need to extract the sorting problem from a narrative about delivery logistics.

**Unique DoorDash characteristics:**

1. **Time-critical sorting** - Questions often involve real-time constraints, like sorting incoming orders by priority while minimizing latency.
2. **Multi-criteria sorting** - Rarely just sort by one field; usually need to balance multiple factors (distance, rating, delivery time).
3. **Scalability focus** - They might ask how your solution would handle millions of concurrent requests, pushing you toward O(n log n) or better solutions.

The difficulty tends to be medium level, but with a twist: the sorting is usually just step one. You'll need to combine it with other techniques (two pointers, heaps, greedy algorithms) to solve the complete problem.

## Study Order

1. **Basic sorting algorithms** - Understand how QuickSort, MergeSort, and HeapSort work at a conceptual level. You don't need to implement them from scratch, but know their time/space complexities and when to use each.

2. **Custom comparators** - Master writing comparison functions in your language of choice. This is the single most important skill for DoorDash sorting questions.

3. **Interval problems** - Start with Merge Intervals (#56), then move to Meeting Rooms (#252) and Meeting Rooms II (#253). These patterns appear frequently in scheduling delivery windows.

4. **Top K problems** - Learn both the heap approach (O(n log k)) and QuickSelect approach (O(n) average). Practice with K Closest Points to Origin (#973) and Kth Largest Element in Array (#215).

5. **Bucket sort variations** - Problems like Top K Frequent Elements (#347) often use bucket sort after frequency counting. This is useful for analyzing order patterns or popular restaurants.

6. **Advanced applications** - Finally, tackle problems where sorting is part of a larger solution, like Non-overlapping Intervals (#435) or Queue Reconstruction by Height (#406).

This order works because it builds from fundamentals to application. You need to understand how sorting works before you can effectively use it as a tool to solve more complex problems.

## Recommended Practice Order

1. **Merge Intervals (#56)** - The foundational interval problem
2. **Meeting Rooms II (#253)** - Sorting + heap pattern
3. **K Closest Points to Origin (#973)** - Custom comparator or QuickSelect
4. **Sort Colors (#75)** - Dutch national flag problem (in-place sort)
5. **Largest Number (#179)** - Tricky custom comparator
6. **Non-overlapping Intervals (#435)** - Greedy approach with sorting
7. **Queue Reconstruction by Height (#406)** - Multiple sorting passes
8. **Car Fleet (#853)** - Sorting with monotonic stack thinking
9. **Minimum Number of Arrows to Burst Balloons (#452)** - Interval variation
10. **Custom Sort String (#791)** - HashMap + custom comparator

Work through these in sequence, and you'll cover 90% of the sorting patterns DoorDash uses. Focus on understanding why sorting helps in each case, not just memorizing solutions.

[Practice Sorting at DoorDash](/company/doordash/sorting)
