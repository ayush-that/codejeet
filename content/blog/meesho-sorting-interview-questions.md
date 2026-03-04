---
title: "Sorting Questions at Meesho: What to Expect"
description: "Prepare for Sorting interview questions at Meesho — patterns, difficulty breakdown, and study tips."
date: "2029-11-29"
category: "dsa-patterns"
tags: ["meesho", "sorting", "interview prep"]
---

Sorting questions appear in roughly 11% of Meesho's technical interviews (5 out of 44 total problems). While this may seem like a small portion, these questions are foundational. They test your ability to choose the right tool for data organization, which is critical for building efficient features at scale—whether it's ranking supplier products, organizing user feeds by relevance, or batch-processing transaction logs.

## What to Expect — types of problems

Meesho's sorting problems typically extend beyond simply calling a library `sort()` function. You can expect questions that require you to:

- **Implement a custom comparator:** Sorting objects based on multiple or non-standard criteria (e.g., sort products by price, then by rating).
- **Apply sorting as a key step:** Many problems use sorting to pre-process data, making a subsequent greedy or two-pointer approach possible. A classic example is finding the minimum number of meetings rooms required, which hinges on sorting start and end times.
- **Modify or analyze sorting algorithms:** You might be asked about the stability of a sort, or to trace the steps of a specific algorithm like quicksort on a given input.

The focus is on applying sorting logic to model real-world scenarios, such as ordering search results or optimizing delivery schedules.

## How to Prepare — study tips with one code example

Master the standard sorting algorithms (QuickSort, MergeSort) conceptually, but focus your coding practice on application. Understand time and space complexity trade-offs. The most crucial skill is writing custom comparison logic. Practice by solving problems where you must sort strings, tuples, or custom objects based on specific rules.

A key pattern is the **custom sort (comparator)**. Below is an example of sorting a list of products, represented as `[name, price, rating]`, primarily by ascending price, and then by descending rating for items with the same price.

<div class="code-group">

```python
def sort_products(products):
    # Sort by price (index 1) ascending, then rating (index 2) descending
    products.sort(key=lambda x: (x[1], -x[2]))
    return products

# Example
products = [["Shirt", 500, 4.2], ["Dress", 300, 4.5], ["Jeans", 500, 4.0]]
print(sort_products(products))
# Output: [['Dress', 300, 4.5], ['Jeans', 500, 4.0], ['Shirt', 500, 4.2]]
```

```javascript
function sortProducts(products) {
  // Sort by price (index 1) ascending, then rating (index 2) descending
  return products.sort((a, b) => {
    if (a[1] !== b[1]) {
      return a[1] - b[1]; // Ascending price
    }
    return b[2] - a[2]; // Descending rating
  });
}

// Example
let products = [
  ["Shirt", 500, 4.2],
  ["Dress", 300, 4.5],
  ["Jeans", 500, 4.0],
];
console.log(sortProducts(products));
// Output: [['Dress', 300, 4.5], ['Jeans', 500, 4.0], ['Shirt', 500, 4.2]]
```

```java
import java.util.*;

public class Main {
    public static List<List<Object>> sortProducts(List<List<Object>> products) {
        products.sort((a, b) -> {
            int priceCompare = ((Integer) a.get(1)).compareTo((Integer) b.get(1));
            if (priceCompare != 0) {
                return priceCompare; // Ascending price
            }
            // Descending rating
            return ((Double) b.get(2)).compareTo((Double) a.get(2));
        });
        return products;
    }

    public static void main(String[] args) {
        List<List<Object>> products = new ArrayList<>();
        products.add(Arrays.asList("Shirt", 500, 4.2));
        products.add(Arrays.asList("Dress", 300, 4.5));
        products.add(Arrays.asList("Jeans", 500, 4.0));
        System.out.println(sortProducts(products));
        // Output: [[Dress, 300, 4.5], [Jeans, 500, 4.0], [Shirt, 500, 4.2]]
    }
}
```

</div>

## Recommended Practice Order

1.  Start with fundamental comparator-based sorts (as shown above).
2.  Move to problems where sorting enables a two-pointer solution (e.g., "Two Sum" on a sorted array, finding pairs with a given difference).
3.  Tackle interval-based problems that require sorting start/end points (e.g., merge intervals, meeting rooms).
4.  Finally, practice more complex problems where sorting is combined with other techniques, like greedy algorithms.

[Practice Sorting at Meesho](/company/meesho/sorting)
