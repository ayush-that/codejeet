---
title: "Sorting Questions at Myntra: What to Expect"
description: "Prepare for Sorting interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-05-05"
category: "dsa-patterns"
tags: ["myntra", "sorting", "interview prep"]
---

Sorting questions appear in nearly 25% of Myntra's technical interviews. With 5 out of 24 total questions dedicated to this topic, it's a core area you cannot afford to overlook. For an e-commerce giant like Myntra, efficient sorting is not an academic exercise—it's a daily operational necessity. Product listings, search result rankings, personalized recommendations, inventory management, and pricing filters all rely on underlying sorting algorithms to deliver a fast, relevant user experience. Your ability to implement and, more importantly, _apply_ sorting logic directly correlates to building the high-performance systems that handle millions of users and transactions.

## What to Expect — types of problems

You will rarely be asked to implement a vanilla sorting algorithm like quicksort from scratch. Instead, Myntra's problems test your ability to use sorting as a tool to enable an efficient solution. Expect these categories:

1.  **Sorting with Custom Comparators:** The most frequent pattern. You'll sort objects or data based on complex rules (e.g., sort products by rating, then by price if ratings are equal).
2.  **Interval Merging & Scheduling:** Problems involving overlapping time slots, meeting rooms, or discount periods often require sorting intervals by their start time as a first step.
3.  **"K" Based Problems:** Finding the Kth largest/smallest element, top K frequent items, or K closest points. Sorting or partial sorting (using a heap) is key here.
4.  **Sorting as Pre-processing:** Many array and string problems become tractable only after sorting the input, turning an O(n²) brute-force solution into an O(n log n) one.

## How to Prepare — study tips with one code example

Master the theory of common sorting algorithms (time/space complexity, stability), but focus your practice on application. For each problem, ask: "Would sorting the input first simplify this?" The most critical skill is writing custom sort keys or comparator functions. Practice this in all three languages.

Here is a fundamental example of a custom comparator to sort products based on multiple criteria: first by highest rating (descending), then by lowest price (ascending).

<div class="code-group">

```python
def sort_products(products):
    # products is a list of tuples: (name, rating, price)
    # Sort by rating descending (-x[1]), then price ascending (x[2])
    products.sort(key=lambda x: (-x[1], x[2]))
    return products

# Example
products = [("Shirt", 4.2, 799), ("Jeans", 4.5, 1899), ("Jacket", 4.5, 1499)]
print(sort_products(products))
# Output: [('Jeans', 4.5, 1899), ('Jacket', 4.5, 1499), ('Shirt', 4.2, 799)]
```

```javascript
function sortProducts(products) {
  // products is an array of objects: {name, rating, price}
  return products.sort((a, b) => {
    if (a.rating !== b.rating) {
      return b.rating - a.rating; // Descending rating
    }
    return a.price - b.price; // Ascending price
  });
}

// Example
let products = [
  { name: "Shirt", rating: 4.2, price: 799 },
  { name: "Jeans", rating: 4.5, price: 1899 },
  { name: "Jacket", rating: 4.5, price: 1499 },
];
console.log(sortProducts(products));
```

```java
import java.util.*;

public class ProductSorter {
    static class Product {
        String name;
        double rating;
        int price;
        // ... constructor and getters
    }

    public static List<Product> sortProducts(List<Product> products) {
        products.sort((a, b) -> {
            if (Double.compare(b.rating, a.rating) != 0) {
                return Double.compare(b.rating, a.rating); // Descending
            }
            return Integer.compare(a.price, b.price); // Ascending
        });
        return products;
    }
}
```

</div>

## Recommended Practice Order

1.  Start with basic custom comparator problems to build syntax fluency.
2.  Move to interval-based problems (merge intervals, insert interval).
3.  Tackle "K" related problems, often combining sorting with heap usage.
4.  Finally, solve complex problems where sorting is one of several steps in the solution.

[Practice Sorting at Myntra](/company/myntra/sorting)
