---
title: "Sorting Questions at Zomato: What to Expect"
description: "Prepare for Sorting interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-18"
category: "dsa-patterns"
tags: ["zomato", "sorting", "interview prep"]
---

Sorting questions appear in about 10% of Zomato's technical interviews (3 out of 29 total problems). While this may seem like a small portion, these questions are critical because they test a fundamental skill: organizing data efficiently. At Zomato, efficient data organization is not an academic exercise—it's a daily operational necessity. The platform deals with massive, real-time datasets: restaurant listings must be sorted by distance, rating, price, or delivery time; search results need instant ranking; and delivery logistics require ordering tasks by priority or location. A candidate who demonstrates mastery over sorting algorithms shows they can build the performant, scalable systems that handle millions of orders and searches. It’s a direct signal of your ability to translate a core CS concept into real-world business logic.

## What to Expect — Types of Problems

You will rarely be asked to implement a basic sorting algorithm like Quicksort from scratch. Instead, Zomato’s problems focus on applying sorting as a tool to solve more complex, scenario-based challenges. Expect these categories:

1.  **Sorting with Custom Comparators:** This is the most common pattern. You'll be given objects or data points (e.g., restaurants, orders, reviews) and asked to sort them based on multiple, sometimes conflicting, criteria (e.g., sort restaurants by highest rating, but break ties by fastest delivery time).
2.  **Interval Merging & Scheduling:** Problems involving overlapping time slots (e.g., restaurant delivery schedules, peak time slots) often require sorting intervals by their start or end time as a first step before merging or finding gaps.
3.  **"K-th" Element Problems:** Finding the top K nearest restaurants, the K most popular cuisines, or the Kth largest order value. While optimal solutions may use heaps, sorting is a common and acceptable first approach.
4.  **Sorting as a Pre-processing Step:** Many problems become trivial if the input array is sorted first. Interviewers look for this insight—recognizing that sorting can reduce time complexity by enabling binary search or a two-pointer traversal.

## How to Prepare — Study Tips with One Code Example

Focus on the _application_ of sorting, not just the algorithms. Master writing custom comparison logic in your language of choice. Practice problems where sorting is the key insight that unlocks the solution. Always discuss time and space complexity; know that `O(n log n)` from sorting is often the bottleneck.

A fundamental pattern to internalize is the **custom comparator**. Here’s how you sort a list of restaurant objects by descending rating, with ascending price as the tie-breaker:

<div class="code-group">

```python
# List of tuples: (name, rating, price_for_two)
restaurants = [("Dosa Plaza", 4.3, 400), ("Burger Point", 4.3, 350), ("Pizza Hut", 4.1, 600)]

# Sort: higher rating first, then lower price
restaurants.sort(key=lambda x: (-x[1], x[2]))

print(restaurants)
# Output: [('Burger Point', 4.3, 350), ('Dosa Plaza', 4.3, 400), ('Pizza Hut', 4.1, 600)]
```

```javascript
// Array of objects: {name, rating, priceForTwo}
let restaurants = [
  { name: "Dosa Plaza", rating: 4.3, priceForTwo: 400 },
  { name: "Burger Point", rating: 4.3, priceForTwo: 350 },
  { name: "Pizza Hut", rating: 4.1, priceForTwo: 600 },
];

// Sort: higher rating first, then lower price
restaurants.sort((a, b) => {
  if (b.rating !== a.rating) {
    return b.rating - a.rating; // Descending rating
  }
  return a.priceForTwo - b.priceForTwo; // Ascending price
});

console.log(restaurants);
// Output: Burger Point, Dosa Plaza, Pizza Hut
```

```java
import java.util.*;

class Restaurant {
    String name;
    double rating;
    int priceForTwo;
    // ... constructor and getters
}

public class Main {
    public static void main(String[] args) {
        List<Restaurant> restaurants = Arrays.asList(
            new Restaurant("Dosa Plaza", 4.3, 400),
            new Restaurant("Burger Point", 4.3, 350),
            new Restaurant("Pizza Hut", 4.1, 600)
        );

        // Sort: higher rating first, then lower price
        restaurants.sort(Comparator
            .comparing(Restaurant::getRating).reversed()
            .thenComparing(Restaurant::getPriceForTwo)
        );

        // Output: Burger Point, Dosa Plaza, Pizza Hut
    }
}
```

</div>

## Recommended Practice Order

Build your competency in this sequence:

1.  **Master the Basics:** Ensure you can explain the mechanics and trade-offs (time/space complexity, stability) of QuickSort, MergeSort, and HeapSort.
2.  **Practice Custom Sorting:** Solve 5-10 problems that require writing a comparator for objects or multi-dimensional data.
3.  **Tackle Interval Problems:** Practice merging, inserting, and finding overlaps in sorted intervals.
4.  **Apply to "K-th" Problems:** Use sorting to solve "Top K" and "Kth Largest" questions, then learn the more optimal heap-based solution.
5.  **Simulate Zomato Contexts:** Finally, practice problems framed around real scenarios like ranking search results, scheduling deliveries, or analyzing time-series data.

[Practice Sorting at Zomato](/company/zomato/sorting)
