---
title: "Sorting Questions at Goldman Sachs: What to Expect"
description: "Prepare for Sorting interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-08-06"
category: "dsa-patterns"
tags: ["goldman-sachs", "sorting", "interview prep"]
---

Sorting questions appear in roughly 14% of Goldman Sachs technical interviews (37 out of 270 total problems). This frequency isn't about testing your ability to call `.sort()`; it's about evaluating how you structure data, optimize operations, and apply fundamental algorithms to real-world financial data processing. In trading systems, risk calculations, and portfolio management, efficiently ordering and merging massive datasets is a daily necessity. A strong grasp of sorting patterns signals you can handle the latency-sensitive and data-intensive environments common at the firm.

## What to Expect — Types of Problems

You will rarely be asked to implement a vanilla sorting algorithm like quicksort from scratch. Instead, expect problems where sorting is a critical _step_ in the solution. Common patterns include:

1.  **Interval Problems:** Merging overlapping time periods, scheduling meetings, or finding minimum conference rooms. Sorting by start or end times is the essential first step.
2.  **Top K / K-th Element Problems:** Finding the K largest transactions, K closest points to origin, or K most frequent symbols. Solutions often involve sorting, heaps, or quickselect.
3.  **Greedy Problems with Sorting:** Tasks like maximum number of events you can attend or minimum number of arrows to burst balloons require sorting the data to apply a greedy rule correctly.
4.  **Custom Sorting (Comparators):** Sorting objects based on multiple, complex rules (e.g., sort orders by price, then time, then client tier). You must be fluent in writing comparator functions.

## How to Prepare — Study Tips with One Code Example

Focus on the _application_ of sorting. Master writing custom comparators in your language of choice. Understand the time/space complexity trade-offs between sorting (`O(n log n)`) and using a heap (`O(n log k)`) for Top K problems. Always clarify input characteristics: Can you sort in-place? Is the data already partially sorted?

A key pattern is modifying an array based on sorted order. For example, the problem "**Sort an Array by Increasing Frequency**" asks that if two numbers have the same frequency, the number with the higher value should come first. The solution involves counting frequencies, then using a custom sort.

<div class="code-group">

```python
def frequencySort(self, nums):
    from collections import Counter
    freq = Counter(nums)
    # Sort by frequency ascending (freq[x]), then by value descending (-x)
    nums.sort(key=lambda x: (freq[x], -x))
    return nums
```

```javascript
function frequencySort(nums) {
  const freq = new Map();
  for (let num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  // Sort by frequency ascending, then by value descending
  return nums.sort((a, b) => {
    if (freq.get(a) === freq.get(b)) {
      return b - a;
    }
    return freq.get(a) - freq.get(b);
  });
}
```

```java
public int[] frequencySort(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    // Count frequencies
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }
    // Convert to Integer[] for custom comparator
    Integer[] arr = Arrays.stream(nums).boxed().toArray(Integer[]::new);
    Arrays.sort(arr, (a, b) -> {
        if (freq.get(a).equals(freq.get(b))) {
            return b - a; // Descending value if frequency equal
        }
        return freq.get(a) - freq.get(b); // Ascending frequency
    });
    // Convert back
    return Arrays.stream(arr).mapToInt(Integer::intValue).toArray();
}
```

</div>

## Recommended Practice Order

1.  **Fundamentals:** Practice writing comparators. Solve basic custom sort problems.
2.  **Interval Merging:** Start with "Merge Intervals." This is a classic pattern.
3.  **Top K Elements:** Practice both the sorting (`O(n log n)`) and heap (`O(n log k)`) solutions.
4.  **Greedy + Sort:** Problems like "Non-overlapping Intervals" or "Minimum Number of Arrows to Burst Balloons."
5.  **Tricky Applications:** Move to problems where sorting is a less obvious but optimal step, such as "Largest Number" (sorting strings lexicographically).

[Practice Sorting at Goldman Sachs](/company/goldman-sachs/sorting)
