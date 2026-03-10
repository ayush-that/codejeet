---
title: "Sorting Questions at Meesho: What to Expect"
description: "Prepare for Sorting interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-21"
category: "dsa-patterns"
tags: ["meesho", "sorting", "interview prep"]
---

# Sorting Questions at Meesho: What to Expect

If you're preparing for a software engineering interview at Meesho, you might have noticed that sorting questions make up a significant portion of their problem set—5 out of 44 total questions in their tagged collection. That's over 11%, which tells you something important: Meesho doesn't treat sorting as just a basic warm-up topic. They use it as a vehicle to assess fundamental algorithmic thinking, especially around data organization and optimization.

Why does a social commerce platform care so much about sorting? Because at its core, Meesho deals with massive product catalogs, user preferences, search rankings, and recommendation systems—all of which require efficient data organization. When you're serving millions of users who need to find products quickly, how you sort and filter data directly impacts user experience and platform performance. In real interviews, you're likely to encounter at least one sorting-related question, often disguised as a problem about arranging intervals, merging lists, or processing streams of data.

## Specific Patterns Meesho Favors

Meesho's sorting questions tend to fall into three distinct categories, each testing different aspects of problem-solving:

1. **Custom Comparator Problems** - These aren't about implementing sort algorithms from scratch, but about knowing how to sort objects by multiple criteria. Think "sort these orders by priority, then by timestamp" or "arrange products by rating, then by price."

2. **Interval Merging and Overlap Detection** - Classic problems like Merge Intervals (#56) and Meeting Rooms II (#253) appear frequently in variations. These test whether you can sort endpoints and process them intelligently.

3. **Sorting as a Preprocessing Step** - Many Meesho problems use sorting to simplify subsequent operations. For example, you might sort an array first to enable a two-pointer solution or binary search approach.

What's interesting is what they _don't_ emphasize: you won't often see "implement quicksort" or theoretical questions about sorting algorithm stability. Instead, they focus on practical applications where sorting enables an efficient solution.

## How to Prepare

The key to acing Meesho's sorting questions is mastering custom comparators and recognizing when sorting transforms an O(n²) brute force into an O(n log n) elegant solution. Let's look at the most important pattern: the custom comparator.

<div class="code-group">

```python
# Problem: Sort products by decreasing rating, then by increasing price
# Time: O(n log n) | Space: O(1) for in-place sort, O(n) for Timsort worst-case
def sort_products(products):
    # Each product is a tuple: (name, rating, price)
    # Sort by rating descending, then price ascending
    products.sort(key=lambda x: (-x[1], x[2]))
    return products

# More complex example with custom comparator class
class Product:
    def __init__(self, name, rating, price):
        self.name = name
        self.rating = rating
        self.price = price

    # For sorting, define __lt__ (less than) method
    def __lt__(self, other):
        if self.rating != other.rating:
            return self.rating > other.rating  # Higher rating first
        return self.price < other.price  # Lower price first

# Usage
products = [Product("Shirt", 4.5, 499), Product("Dress", 4.5, 799)]
sorted_products = sorted(products)
```

```javascript
// Problem: Sort products by decreasing rating, then by increasing price
// Time: O(n log n) | Space: O(log n) for V8's Timsort implementation
function sortProducts(products) {
  // Each product is an object: {name, rating, price}
  return products.sort((a, b) => {
    if (a.rating !== b.rating) {
      return b.rating - a.rating; // Descending rating
    }
    return a.price - b.price; // Ascending price
  });
}

// Alternative with explicit comparator
const productComparator = (a, b) => {
  // Primary: rating descending
  if (a.rating > b.rating) return -1;
  if (a.rating < b.rating) return 1;

  // Secondary: price ascending
  if (a.price < b.price) return -1;
  if (a.price > b.price) return 1;

  return 0;
};
```

```java
// Problem: Sort products by decreasing rating, then by increasing price
// Time: O(n log n) | Space: O(log n) for Java's Timsort
import java.util.*;

class Product {
    String name;
    double rating;
    int price;

    public Product(String name, double rating, int price) {
        this.name = name;
        this.rating = rating;
        this.price = price;
    }
}

class ProductComparator implements Comparator<Product> {
    @Override
    public int compare(Product a, Product b) {
        // Compare by rating descending
        if (a.rating != b.rating) {
            return Double.compare(b.rating, a.rating); // Reverse order
        }
        // Then by price ascending
        return Integer.compare(a.price, b.price);
    }
}

// Usage
List<Product> products = new ArrayList<>();
products.add(new Product("Shirt", 4.5, 499));
products.add(new Product("Dress", 4.5, 799));
Collections.sort(products, new ProductComparator());
```

</div>

The second critical pattern is interval merging, which appears in various forms at Meesho. Here's the core approach:

<div class="code-group">

```python
# Merge Intervals pattern (LeetCode #56)
# Time: O(n log n) | Space: O(n) for output (or O(1) if modifying in-place)
def merge_intervals(intervals):
    if not intervals:
        return []

    # Sort by start time
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]
    for current in intervals[1:]:
        last = merged[-1]

        # If current interval overlaps with last merged interval
        if current[0] <= last[1]:
            # Merge them by updating the end time
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)

    return merged
```

```javascript
// Merge Intervals pattern (LeetCode #56)
// Time: O(n log n) | Space: O(n) for output
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];

    // Check for overlap
    if (current[0] <= last[1]) {
      // Merge intervals
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}
```

```java
// Merge Intervals pattern (LeetCode #56)
// Time: O(n log n) | Space: O(n) for output
import java.util.*;

public int[][] mergeIntervals(int[][] intervals) {
    if (intervals.length == 0) return new int[0][0];

    // Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = merged.get(merged.size() - 1);

        // Check for overlap
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

## How Meesho Tests Sorting vs Other Companies

Meesho's approach to sorting questions differs from other companies in subtle but important ways:

- **Compared to FAANG**: While Google might ask you to implement radix sort or discuss sorting stability theoretically, Meesho focuses on practical business applications. Their questions often have clear e-commerce contexts—sorting products, orders, or user sessions.

- **Difficulty level**: Meesho's sorting questions are typically medium difficulty. You won't see hard-level sorting puzzles requiring exotic algorithms, but you might need to combine sorting with other concepts like two-pointers or greedy algorithms.

- **Unique aspect**: Meesho often presents sorting as part of a larger system design discussion. You might be asked: "How would you sort trending products in real-time?" This tests whether you understand the trade-offs between different sorting approaches in production systems.

- **Interview style**: Interviewers at Meesho tend to be more interested in your reasoning process than perfect syntax. They want to see if you can identify when sorting is the right approach and explain why O(n log n) is acceptable for the problem constraints.

## Study Order

When preparing for Meesho's sorting questions, follow this logical progression:

1. **Basic sorting algorithms** - Understand how quicksort, mergesort, and heapsort work at a high level. You don't need to implement them from memory, but you should know their time/space complexities and when to use each.

2. **Built-in sorting with custom comparators** - This is 80% of what you'll actually use. Practice sorting arrays of objects by multiple criteria in different languages.

3. **Interval problems** - Start with Merge Intervals (#56), then move to Meeting Rooms (#252) and Meeting Rooms II (#253). These teach you how sorting transforms overlap detection from O(n²) to O(n log n).

4. **Two-pointer techniques after sorting** - Problems like 3Sum (#15) and Two Sum II (#167) become manageable once the array is sorted. This pattern is common at Meesho.

5. **Sorting for greedy algorithms** - Many greedy solutions (like scheduling problems) require sorting first. Practice identifying when sorting enables a greedy approach.

6. **Advanced applications** - Finally, look at problems where sorting is part of a more complex solution, like finding the Kth largest element (#215) using quickselect or heaps.

This order works because it builds from fundamentals to applications, ensuring you understand both the "how" and the "why" of sorting.

## Recommended Practice Order

Here are specific problems to solve in sequence, starting easy and building up to Meesho-level questions:

1. **Merge Intervals (#56)** - The foundational interval problem
2. **Meeting Rooms II (#253)** - Interval problem with counting
3. **Sort Colors (#75)** - In-place sorting (Dutch national flag problem)
4. **Kth Largest Element in an Array (#215)** - Sorting vs heap approaches
5. **Non-overlapping Intervals (#435)** - Greedy approach after sorting
6. **Custom Sort String (#791)** - Custom comparator practice
7. **Merge Sorted Array (#88)** - Two-pointer merging
8. **Sort List (#148)** - Sorting linked lists (bonus challenge)

After mastering these, look for Meesho-specific problems in their tagged collection. Pay special attention to any problems involving products, orders, or timelines—these often have real-world relevance to their platform.

Remember: at Meesho, sorting questions aren't just about algorithms—they're about organizing data efficiently to solve business problems. Always think about how your solution would perform at scale with thousands of products or users.

[Practice Sorting at Meesho](/company/meesho/sorting)
