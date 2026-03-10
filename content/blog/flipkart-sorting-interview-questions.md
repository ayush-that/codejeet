---
title: "Sorting Questions at Flipkart: What to Expect"
description: "Prepare for Sorting interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-04-20"
category: "dsa-patterns"
tags: ["flipkart", "sorting", "interview prep"]
---

# Sorting Questions at Flipkart: What to Expect

Flipkart’s technical interview process is known for its practical, data‑intensive problems. With 21 of their 117 tagged questions involving sorting, it’s clear this isn’t just a warm‑up topic—it’s a core assessment area. Why? Because Flipkart deals with massive datasets: product catalogs, user reviews, delivery routes, and real‑time inventory. Efficient sorting and ordering logic directly impact search relevance, recommendation engines, and logistics optimization. In interviews, sorting rarely appears as “just implement quicksort.” Instead, it’s woven into problems where ordering is the key to unlocking an optimal solution. If you’re interviewing at Flipkart, expect sorting to be a fundamental tool you must wield fluently.

## Specific Patterns Flipkart Favors

Flipkart’s sorting questions tend to cluster around a few high‑value patterns that mirror real‑world engineering tasks:

1. **Custom Comparator Sorting** – This is the most frequent pattern. You’ll be given objects or data points that need ordering based on multiple criteria (e.g., sort products by rating, then by price, then by recency). The interviewer tests your ability to model business rules in a comparison function.
2. **Interval Merging & Overlap** – Many logistics and scheduling problems reduce to merging intervals after sorting by start time. Think of delivery time windows or meeting room bookings.
3. **K‑th Element in Sorted Order** – Finding top‑K items, median of a stream, or K‑closest points often uses a sorting‑based approach (or a heap, which is conceptually related).
4. **Sorting as a Pre‑processing Step** – Sorting transforms the problem, enabling a two‑pointer solution or binary search. Flipkart likes problems where sorting isn’t the end goal but the enabler for an efficient algorithm.

For example, **Merge Intervals (#56)** is a classic Flipkart problem because it models overlapping delivery slots. **K Closest Points to Origin (#973)** appears in logistics contexts. **Largest Number (#179)** tests custom comparator skills for arranging numbers into the largest possible string—a pattern relevant to generating sorted IDs or keys.

## How to Prepare

Master the custom comparator pattern first. In interviews, you’ll often need to sort a list of objects by multiple attributes. Let’s look at a typical example: sort a list of products where each product has a rating (descending), price (ascending), and name (alphabetical).

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
class Product:
    def __init__(self, name, rating, price):
        self.name = name
        self.rating = rating
        self.price = price

def sort_products(products):
    # Sort by rating descending, then price ascending, then name ascending
    products.sort(key=lambda p: (-p.rating, p.price, p.name))
    return products

# Example usage
products = [
    Product("Tablet", 4.5, 300),
    Product("Phone", 4.5, 500),
    Product("Laptop", 4.8, 1000),
]
sorted_products = sort_products(products)
for p in sorted_products:
    print(p.name, p.rating, p.price)
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
class Product {
  constructor(name, rating, price) {
    this.name = name;
    this.rating = rating;
    this.price = price;
  }
}

function sortProducts(products) {
  // Sort by rating descending, then price ascending, then name ascending
  products.sort((a, b) => {
    if (a.rating !== b.rating) return b.rating - a.rating; // descending
    if (a.price !== b.price) return a.price - b.price; // ascending
    return a.name.localeCompare(b.name); // alphabetical
  });
  return products;
}

// Example usage
const products = [
  new Product("Tablet", 4.5, 300),
  new Product("Phone", 4.5, 500),
  new Product("Laptop", 4.8, 1000),
];
sortProducts(products);
products.forEach((p) => console.log(p.name, p.rating, p.price));
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.*;

class Product {
    String name;
    double rating;
    int price;

    Product(String name, double rating, int price) {
        this.name = name;
        this.rating = rating;
        this.price = price;
    }
}

public class Main {
    public static List<Product> sortProducts(List<Product> products) {
        // Sort by rating descending, then price ascending, then name ascending
        products.sort((a, b) -> {
            if (a.rating != b.rating) return Double.compare(b.rating, a.rating);
            if (a.price != b.price) return Integer.compare(a.price, b.price);
            return a.name.compareTo(b.name);
        });
        return products;
    }

    public static void main(String[] args) {
        List<Product> products = Arrays.asList(
            new Product("Tablet", 4.5, 300),
            new Product("Phone", 4.5, 500),
            new Product("Laptop", 4.8, 1000)
        );
        sortProducts(products);
        for (Product p : products) {
            System.out.println(p.name + " " + p.rating + " " + p.price);
        }
    }
}
```

</div>

Next, practice the “sort then two‑pointer” pattern. A classic problem is **3Sum (#15)**, where sorting the array first allows you to find triplets efficiently.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) ignoring output space
def threeSum(nums):
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue  # skip duplicates
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1  # skip duplicates
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result
```

```javascript
// Time: O(n²) | Space: O(1) ignoring output space
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1,
      right = n - 1;
    while (left < right) {
      const total = nums[i] + nums[left] + nums[right];
      if (total === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
      } else if (total < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}
```

```java
// Time: O(n²) | Space: O(1) ignoring output space
import java.util.*;

public class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        int n = nums.length;

        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = n - 1;
            while (left < right) {
                int total = nums[i] + nums[left] + nums[right];
                if (total == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    left++;
                    right--;
                    while (left < right && nums[left] == nums[left - 1]) left++;
                } else if (total < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
}
```

</div>

## How Flipkart Tests Sorting vs Other Companies

At companies like Google or Meta, sorting problems often appear as part of more complex algorithmic puzzles (e.g., sorting colors in place, or designing a custom data structure). At Flipkart, the emphasis is on **applied sorting**—you’re more likely to get a problem statement that mirrors a real Flipkart scenario: “Given a list of delivery slots, merge overlapping ones to find available time windows,” or “Sort customer reviews by helpfulness, then date.” The difficulty is moderate (LeetCode Medium), but the expectation is that you write clean, production‑ready code with proper edge‑case handling. They also pay close attention to whether you recognize when sorting is the right pre‑processing step, as opposed to jumping straight into a brute‑force solution.

## Study Order

1. **Basic Sorting Algorithms** – Understand how quicksort, mergesort, and heapsort work conceptually. You won’t implement them from scratch, but you should know their trade‑offs (stable vs unstable, in‑place, time complexity).
2. **Custom Comparators** – Learn to sort objects by multiple fields in your language of choice. This is the most frequently tested skill.
3. **Interval Problems** – Practice merging, inserting, and finding overlaps in intervals. Sorting by start time is the key insight.
4. **K‑th Element Problems** – Use sorting to find top‑K items, medians, or closest points. Understand when a heap might be better.
5. **Sorting as a Pre‑processing Step** – Solve problems where sorting transforms an O(n²) brute force into an O(n log n) or O(n) solution (e.g., two‑pointer techniques).
6. **Advanced Patterns** – Counting sort/radix sort for constrained ranges, sorting linked lists, and problems where you sort characters in strings.

This order builds from fundamentals to application, ensuring you have the tools before tackling the integrated problems.

## Recommended Practice Order

1. **Merge Intervals (#56)** – Foundation for interval‑based sorting.
2. **Sort Colors (#75)** – In‑place partitioning (like quicksort’s partition step).
3. **K Closest Points to Origin (#973)** – Custom comparator with Euclidean distance.
4. **Largest Number (#179)** – Tricky custom comparator that combines numbers as strings.
5. **Meeting Rooms II (#253)** – Requires sorting intervals and using a min‑heap (tests sorting plus additional data structure).
6. **Custom Sort String (#791)** – Sorting based on a custom order, common in catalog sorting.
7. **3Sum (#15)** – Classic “sort then two‑pointer” problem.
8. **Flipkart‑specific problems** – Search for Flipkart‑tagged sorting questions on LeetCode and practice them last.

Remember, at Flipkart, sorting is rarely the end goal—it’s the means to an efficient, clean solution. Practice until you instinctively ask, “Would sorting help here?” when faced with an array or list problem.

[Practice Sorting at Flipkart](/company/flipkart/sorting)
