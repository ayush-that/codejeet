---
title: "Sorting Questions at Myntra: What to Expect"
description: "Prepare for Sorting interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-04-27"
category: "dsa-patterns"
tags: ["myntra", "sorting", "interview prep"]
---

# Sorting Questions at Myntra: What to Expect

If you're preparing for Myntra interviews, you've likely noticed that sorting problems make up a significant portion of their question bank—5 out of 24 total questions. This isn't random. Myntra deals with massive product catalogs, recommendation systems, inventory management, and search functionality where efficient sorting and ordering are fundamental operations. While they're not a "sorting company" in the academic sense, they're an e-commerce platform where organizing data efficiently directly impacts user experience and business metrics.

Here's what you need to know: Myntra's sorting questions aren't about asking you to implement quicksort from scratch. They're about applying sorting as a tool to solve practical problems—often as a preprocessing step that transforms an otherwise complex problem into something manageable. In real interviews, you might encounter sorting concepts in about 20-30% of technical rounds, usually disguised within problems about scheduling, optimization, or data organization.

## Specific Patterns Myntra Favors

Myntra leans toward **comparator-based sorting** and **interval merging** patterns. These appear frequently in their problem set because they map directly to real-world scenarios: sorting products by multiple attributes (price, rating, relevance), managing time slots for flash sales, or grouping similar items.

The most common patterns are:

1. **Custom Comparators**: Sorting objects based on multiple criteria (e.g., sort by price ascending, then by rating descending)
2. **Interval Problems**: Using sorting to organize time ranges or numerical intervals
3. **Two-Pointer After Sort**: Sorting an array first to enable efficient two-pointer solutions
4. **Greedy with Sort**: Sorting inputs to apply greedy algorithms correctly

A classic example is the "Merge Intervals" pattern (LeetCode #56), which appears in various forms at Myntra. Another frequent pattern is "Meeting Rooms II" (LeetCode #253) style problems, where you need to find minimum resources required for overlapping intervals.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for sorting (or O(1) if we can sort in-place)
def merge_intervals(intervals):
    """
    Merge overlapping intervals after sorting by start time.
    Myntra variation: Could be merging product availability windows
    or consolidating shipping time slots.
    """
    if not intervals:
        return []

    # Sort by start time - this is the key preprocessing step
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]

        # If current interval overlaps with last merged interval
        if current_start <= last_end:
            # Merge them by updating the end time
            merged[-1] = [last_start, max(last_end, current_end)]
        else:
            # Add as new interval
            merged.append([current_start, current_end])

    return merged
```

```javascript
// Time: O(n log n) | Space: O(n) for sorting
function mergeIntervals(intervals) {
  if (!intervals.length) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [currentStart, currentEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    if (currentStart <= lastEnd) {
      // Merge intervals
      merged[merged.length - 1][1] = Math.max(lastEnd, currentEnd);
    } else {
      merged.push([currentStart, currentEnd]);
    }
  }

  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n) for sorting (or O(1) if sorting in-place)
public int[][] mergeIntervals(int[][] intervals) {
    if (intervals.length == 0) return new int[0][0];

    // Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = merged.get(merged.size() - 1);

        if (current[0] <= last[1]) {
            // Merge intervals
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.add(current);
        }
    }

    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## How to Prepare

The key insight for Myntra sorting questions is recognizing when sorting is the optimal preprocessing step. Here's my approach:

1. **Identify the pattern**: When you see problems about "minimum rooms," "overlapping intervals," "merging ranges," or "arranging items by multiple criteria," think sorting first.

2. **Master custom comparators**: Myntra loves problems where you need to sort objects by multiple fields. Practice writing comparators for different scenarios.

3. **Time-space tradeoffs**: Be prepared to discuss when to use in-place sorting vs. creating new arrays, especially for large datasets.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) for in-place sort
def sort_by_multiple_criteria(products):
    """
    Sort products: first by category ascending, then by price descending,
    then by rating descending.
    Myntra variation: This mimics actual product sorting on their platform.
    """
    # Key insight: Python's sort is stable, so we can sort by multiple passes
    # But it's more efficient to do it in one comparator
    products.sort(key=lambda x: (x['category'], -x['price'], -x['rating']))
    return products

# Alternative: Using custom comparator class for complex logic
from functools import cmp_to_key

def product_comparator(a, b):
    if a['category'] != b['category']:
        return -1 if a['category'] < b['category'] else 1
    if a['price'] != b['price']:
        return 1 if a['price'] > b['price'] else -1  # Descending price
    return 1 if a['rating'] > b['rating'] else -1  # Descending rating
```

```javascript
// Time: O(n log n) | Space: O(1) for in-place sort
function sortProducts(products) {
  return products.sort((a, b) => {
    // First by category (ascending)
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    // Then by price (descending)
    if (a.price !== b.price) {
      return b.price - a.price;
    }
    // Then by rating (descending)
    return b.rating - a.rating;
  });
}
```

```java
// Time: O(n log n) | Space: O(1) for in-place sort
public List<Product> sortProducts(List<Product> products) {
    products.sort((a, b) -> {
        // Compare category first
        int categoryCompare = a.getCategory().compareTo(b.getCategory());
        if (categoryCompare != 0) return categoryCompare;

        // Then price descending
        int priceCompare = Integer.compare(b.getPrice(), a.getPrice());
        if (priceCompare != 0) return priceCompare;

        // Then rating descending
        return Integer.compare(b.getRating(), a.getRating());
    });
    return products;
}
```

</div>

## How Myntra Tests Sorting vs Other Companies

Myntra's sorting questions differ from other companies in three key ways:

1. **Practical over theoretical**: While Google might ask you to prove sorting algorithm complexity, Myntra focuses on applying sorting to solve business problems. They want to see if you can recognize that sorting makes a problem tractable.

2. **Medium difficulty**: Myntra's sorting questions tend to be LeetCode Medium level. You won't see esoteric hard problems about sorting networks or counting sort edge cases. Instead, expect problems like "Minimum Number of Arrows to Burst Balloons" (LeetCode #452) or "Non-overlapping Intervals" (LeetCode #435).

3. **E-commerce context**: Problems often have e-commerce framing—sorting products, scheduling deliveries, or optimizing inventory. The sorting logic itself is standard, but the problem statement connects to their business.

Compared to FAANG companies, Myntra places more weight on clean, maintainable code with good variable names rather than ultra-optimized one-liners. They care about whether your solution would work in their codebase.

## Study Order

1. **Basic sorting algorithms**: Understand when to use built-in sort (O(n log n)) vs. when a counting sort (O(n + k)) might be better for bounded integer ranges.

2. **Custom comparators**: Learn to sort by multiple criteria in all three languages. This is fundamental for Myntra problems.

3. **Interval merging**: Master the pattern shown above. This single pattern solves a huge class of Myntra problems.

4. **Greedy after sorting**: Problems like "Maximum Number of Events That Can Be Attended" (LeetCode #1353) where sorting enables a greedy approach.

5. **Two-pointer with sorted arrays**: Once an array is sorted, two-pointer solutions often become possible (e.g., "Two Sum II - Input Array Is Sorted" - LeetCode #167).

This order works because each concept builds on the previous one. You can't effectively solve interval problems without understanding custom sorting, and you can't apply greedy algorithms correctly without understanding how sorting changes the problem structure.

## Recommended Practice Order

Solve these problems in sequence:

1. **Merge Intervals** (LeetCode #56) - The fundamental pattern
2. **Meeting Rooms II** (LeetCode #253) - Interval counting variation
3. **Non-overlapping Intervals** (LeetCode #435) - Greedy after sorting
4. **Sort Colors** (LeetCode #75) - Specialized sorting (Dutch flag)
5. **Largest Number** (LeetCode #179) - Custom comparator challenge
6. **Minimum Number of Arrows to Burst Balloons** (LeetCode #452) - Myntra favorite pattern

After these six, you'll have covered 90% of sorting patterns Myntra uses. The key is not just solving them, but understanding why sorting works as a preprocessing step in each case.

Remember: At Myntra, they're not testing if you know how to sort—they're testing if you know when to sort. The insight that "if I sort this first, the problem becomes easy" is what separates candidates who pass from those who struggle.

[Practice Sorting at Myntra](/company/myntra/sorting)
