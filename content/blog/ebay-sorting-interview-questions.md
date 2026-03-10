---
title: "Sorting Questions at eBay: What to Expect"
description: "Prepare for Sorting interview questions at eBay — patterns, difficulty breakdown, and study tips."
date: "2029-03-08"
category: "dsa-patterns"
tags: ["ebay", "sorting", "interview prep"]
---

## Sorting at eBay: More Than Just Ordering Data

If you're preparing for an eBay interview, you've probably noticed their question distribution: 15 out of 60 total questions are tagged with Sorting. That's 25% — a significant chunk that tells you something important. Sorting isn't just a warm-up topic here; it's a fundamental assessment tool. Why? Because eBay's core systems — search relevance, auction listings, recommendation feeds, and pricing analytics — all rely heavily on efficient data ordering. When you're dealing with millions of listings that need to be filtered, ranked, and displayed in real-time, the difference between O(n log n) and O(n²) isn't academic; it's the difference between a usable site and a broken one. In interviews, they're testing whether you can recognize when sorting is the optimal pre-processing step, and whether you can implement or leverage it efficiently under pressure.

## Specific Patterns eBay Favors

eBay's sorting questions tend to cluster around two main themes: **custom comparators** and **sorting as a pre-processing step for another algorithm**. They rarely ask you to implement quicksort from scratch. Instead, they give you problems where the sorting logic is non-trivial, or where sorting transforms an otherwise complex problem into a manageable one.

1.  **Custom Object Sorting:** You'll frequently need to sort arrays of objects or tuples based on multiple criteria. Think "sort products by price ascending, then by rating descending." This tests your ability to design a clean comparison function.
2.  **Interval Problems:** A huge category. Sorting intervals by their start (or end) time is the key first step to solving problems about merging, scheduling, or finding overlaps. This pattern is ubiquitous at eBay.
3.  **"K-th" or "Top K" Problems:** Once data is sorted, finding the k-th largest, smallest, or most frequent element becomes straightforward. eBay often uses this to assess if you know when a full sort is overkill (and a heap is better).
4.  **Greedy Algorithms with Sorting:** Many greedy solutions only work correctly if the input is sorted first. eBay likes problems where the sorting step is the crucial insight that enables the greedy approach.

For example, **Meeting Rooms II (LeetCode #253)** is a classic eBay-style problem. The brute-force approach is messy. The elegant solution? Sort the meeting start and end times separately and use a two-pointer traversal to simulate room allocation. The sorting pre-processing is the entire key.

## How to Prepare

Master the standard library sorting functions and the concept of the comparator. Then, drill the pattern of "sort first, then apply a simpler algorithm." Let's look at the custom comparator pattern, which is essential.

<div class="code-group">

```python
# Example: Sort a list of products (tuples of name, price, rating)
# Primary key: price ascending. Secondary key: rating descending.
products = [("laptop", 999, 4.5), ("phone", 999, 4.7), ("tablet", 499, 4.2)]

# Using a custom key function. We return a tuple where the first element is the
# primary key, and the second is the secondary key (negated for descending).
products.sort(key=lambda x: (x[1], -x[2]))
print(products)  # [('tablet', 499, 4.2), ('laptop', 999, 4.5), ('phone', 999, 4.7)]

# Time: O(n log n) for the Timsort algorithm | Space: O(n) in the worst case for the sort
```

```javascript
// Example: Sort an array of product objects.
// Primary key: price ascending. Secondary key: rating descending.
let products = [
  { name: "laptop", price: 999, rating: 4.5 },
  { name: "phone", price: 999, rating: 4.7 },
  { name: "tablet", price: 499, rating: 4.2 },
];

products.sort((a, b) => {
  if (a.price !== b.price) {
    return a.price - b.price; // Ascending price
  }
  return b.rating - a.rating; // Descending rating if prices are equal
});

console.log(products);
// Time: O(n log n) | Space: O(log n) for the sort's stack space (V8 uses Timsort)
```

```java
// Example: Sort an array of Product objects using a custom Comparator.
import java.util.*;

class Product {
    String name;
    int price;
    double rating;
    // ... constructor ...
}

public class Main {
    public static void main(String[] args) {
        List<Product> products = Arrays.asList(
            new Product("laptop", 999, 4.5),
            new Product("phone", 999, 4.7),
            new Product("tablet", 499, 4.2)
        );

        Collections.sort(products, new Comparator<Product>() {
            @Override
            public int compare(Product a, Product b) {
                if (a.price != b.price) {
                    return Integer.compare(a.price, b.price); // Ascending
                }
                // For descending rating, compare b to a.
                return Double.compare(b.rating, a.rating);
            }
        });
        // With Java 8+: products.sort(Comparator.comparingInt(Product::getPrice).thenComparing(Product::getRating, Comparator.reverseOrder()));
    }
}
// Time: O(n log n) | Space: O(log n) to O(n) depending on sort implementation
```

</div>

The second critical pattern is using sorting to enable a two-pointer solution. Here's the skeleton for interval merging:

<div class="code-group">

```python
def merge_intervals(intervals):
    if not intervals:
        return []
    # KEY STEP: Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]
        if current_start <= last_end:  # Overlap
            merged[-1] = (last_start, max(last_end, current_end))
        else:
            merged.append((current_start, current_end))
    return merged
# Time: O(n log n) due to sort | Space: O(n) for the output list (or O(1) if modifying in-place)
```

```javascript
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  // KEY STEP: Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];
    if (currStart <= lastEnd) {
      merged[merged.length - 1][1] = Math.max(lastEnd, currEnd);
    } else {
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
// Time: O(n log n) | Space: O(n)
```

```java
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    // KEY STEP: Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int[] curr = intervals[i];
        if (curr[0] <= last[1]) {
            last[1] = Math.max(last[1], curr[1]);
        } else {
            merged.add(curr);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
// Time: O(n log n) | Space: O(n) for the list
```

</div>

## How eBay Tests Sorting vs Other Companies

eBay's sorting questions sit at a sweet spot between the theoretical depth of a company like Google and the pure implementation focus of some smaller firms. At Google, you might be asked to prove the lower bound of comparison sorts or derive the runtime of a hybrid sort. At many startups, you might just be asked to implement mergesort. eBay leans practical: "Here's a realistic data processing problem. What's the most efficient way to organize the data?" The difficulty is often in recognizing that sorting is the catalyst, not in the sorting itself. Their questions also frequently have a "business logic" flavor—sorting products, transactions, or time-based events—which makes them feel less abstract than pure algorithm problems.

## Study Order

1.  **Master the Built-in Sort:** Learn how to use `sorted()`/`sort()` in Python, `Array.sort()` in JavaScript, and `Arrays.sort()`/`Collections.sort()` in Java with custom comparators. This is 80% of the battle.
2.  **Basic Custom Sorting:** Practice single-key and multi-key sorts on arrays of primitives and simple objects. (LeetCode #179: Largest Number is a fantastic, tricky comparator problem).
3.  **Sorting as a Pre-process:** Learn the patterns. Practice problems where the first line of your solution is sorting the input. This includes:
    - Interval problems (Merge Intervals #56, Meeting Rooms #252).
    - Two-pointer problems that require sorted input (Two Sum II #167).
    - Greedy problems (Non-overlapping Intervals #435).
4.  **Understanding "K-th" Problems:** Learn when to use a full sort (O(n log n)) vs. a heap (O(n log k)) vs. quickselect (O(n) average) for finding top/bottom K elements. (Kth Largest Element #215).
5.  **Advanced Patterns:** Tackle problems where sorting is part of a more complex algorithm, like using a "sweep line" after sorting points/events.

## Recommended Practice Order

Solve these in sequence to build the pattern recognition muscle:

1.  **Meeting Rooms (LeetCode #252):** The simplest "sort intervals" check.
2.  **Merge Intervals (LeetCode #56):** The foundational interval merging pattern.
3.  **Non-overlapping Intervals (LeetCode #435):** A classic greedy + sorting application.
4.  **Kth Largest Element in an Array (LeetCode #215):** Teaches you to question if a full sort is necessary.
5.  **Largest Number (LeetCode #179):** A deep dive into crafting a non-obvious comparator.
6.  **Meeting Rooms II (LeetCode #253):** A step up in difficulty, using sorting to enable a efficient simulation.
7.  **Car Fleet (LeetCode #853):** An excellent problem that combines sorting with a single-pass simulation, very eBay-relevant for modeling concurrent events.

By following this progression, you move from using sorting as a simple tool to wielding it as a strategic pre-processing step that unlocks efficient solutions to otherwise complex problems—exactly what eBay interviewers are looking for.

[Practice Sorting at eBay](/company/ebay/sorting)
