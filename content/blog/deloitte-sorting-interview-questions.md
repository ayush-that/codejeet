---
title: "Sorting Questions at Deloitte: What to Expect"
description: "Prepare for Sorting interview questions at Deloitte — patterns, difficulty breakdown, and study tips."
date: "2030-03-31"
category: "dsa-patterns"
tags: ["deloitte", "sorting", "interview prep"]
---

Sorting questions appear in nearly 20% of Deloitte's technical interview problem set, making them a non-negotiable area of preparation. For a global consulting and advisory firm like Deloitte, sorting isn't just about algorithms—it's about data organization, report generation, and efficient information retrieval for client deliverables. The ability to select and implement the right sorting approach demonstrates logical structuring, an understanding of time/space trade-offs, and the capacity to handle real-world data processing tasks, which are core to many technical analyst and consultant roles.

## What to Expect — Types of Problems

Deloitte’s sorting questions typically focus on applied problem-solving rather than asking you to implement a raw algorithm like quicksort from scratch. You can expect problems that involve:

- **Custom Sorting:** Ordering objects or data points based on multiple criteria (e.g., sort transactions by date, then by amount descending).
- **Sorting as a Subroutine:** Using sorting to enable an efficient solution to a broader problem, such as finding the minimum difference between elements or identifying duplicates.
- **Hybrid Problems:** Combining sorting with other fundamental concepts like hash maps (for frequency counting) or two-pointer techniques.

The goal is to test if you can recognize when sorting transforms an inefficient O(n²) brute-force solution into a cleaner, more optimal O(n log n) approach.

## How to Prepare — Study Tips with One Code Example

Master the standard comparison-based sorts (Merge Sort, QuickSort) for their theoretical properties, but focus your practical coding on your language’s built-in sort function and how to customize it. The key skill is writing effective comparator functions. Understand the stable sort property when dealing with multiple keys.

A common pattern is sorting based on a derived property or a custom order. For example, sorting numbers by their frequency.

<div class="code-group">

```python
def sort_by_frequency(nums):
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Sort: primary key = frequency (desc), secondary key = value (asc)
    nums.sort(key=lambda x: (-freq[x], x))
    return nums

# Example: [2,3,4,2,3,5,1] -> [2,2,3,3,1,4,5]
```

```javascript
function sortByFrequency(nums) {
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Sort: primary key = frequency (desc), secondary key = value (asc)
  nums.sort((a, b) => {
    const freqA = freq.get(a);
    const freqB = freq.get(b);
    if (freqA !== freqB) {
      return freqB - freqA; // Descending frequency
    }
    return a - b; // Ascending value
  });
  return nums;
}
```

```java
import java.util.*;

public class SortByFrequency {
    public static List<Integer> sortByFrequency(List<Integer> nums) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Sort using a custom comparator
        nums.sort((a, b) -> {
            int freqA = freq.get(a);
            int freqB = freq.get(b);
            if (freqA != freqB) {
                return freqB - freqA; // Descending frequency
            }
            return a - b; // Ascending value
        });
        return nums;
    }
}
```

</div>

## Recommended Practice Order

1.  **Foundation:** Solidify understanding of built-in sort and comparators in your primary language.
2.  **Basic Patterns:** Solve problems involving custom object sorting and multi-key sorting.
3.  **Application:** Tackle problems where sorting is the key optimization step (e.g., "Meeting Rooms," "Kth Largest Element").
4.  **Integration:** Practice hybrid problems that combine sorting with hashing or the two-pointer technique.

[Practice Sorting at Deloitte](/company/deloitte/sorting)
