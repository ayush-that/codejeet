---
title: "Sorting Questions at Deutsche Bank: What to Expect"
description: "Prepare for Sorting interview questions at Deutsche Bank — patterns, difficulty breakdown, and study tips."
date: "2031-09-12"
category: "dsa-patterns"
tags: ["deutsche-bank", "sorting", "interview prep"]
---

Sorting questions appear in roughly 20% of Deutsche Bank’s technical interviews (4 out of 21 total problems). This frequency reflects a core principle in financial software: ordered data is fundamental to analysis, reporting, and transaction processing. Whether you’re merging trade feeds, generating sorted risk reports, or optimizing data retrieval, the ability to efficiently organize information is non-negotiable. Mastering sorting algorithms and their applications demonstrates you can handle the large-scale, time-sensitive data systems common in investment banking.

## What to Expect — Types of Problems

You will rarely be asked to implement a basic sorting algorithm like Quicksort from scratch. Instead, expect problems where sorting is the key enabling step to an efficient solution. The two most common patterns are:

1.  **"Sort First, Then Solve":** The problem’s optimal solution becomes straightforward once the data is ordered. Examples include finding the minimum absolute difference between elements, merging overlapping intervals, or arranging numbers to form the largest possible integer.
2.  **Custom Sorting (Comparator-Based):** You’ll need to sort objects or data points based on a specific, non-obvious rule. This tests your ability to define a comparison function. A classic example is sorting a list of strings to order them in a custom "alien" dictionary order.

The difficulty typically ranges from easy to medium, focusing on correct application and reasoning rather than complex algorithm derivation.

## How to Prepare — Study Tips with One Code Example

Focus on understanding _when_ to sort, not just how. For each practice problem, ask: "Would sorting the input first simplify the logic?" If the answer is yes, analyze the time complexity. Sorting adds an O(n log n) cost, which is often acceptable for improving an O(n²) brute-force approach.

A critical skill is writing custom comparators. This pattern is essential for solving many of Deutsche Bank’s sorting problems. Below is a multi-language example for a common custom sort task: sorting a list of numbers to form the largest possible concatenated number.

<div class="code-group">

```python
def largest_number(nums):
    # Convert numbers to strings for lexicographic comparison
    str_nums = list(map(str, nums))

    # Custom comparator: compare a+b vs b+a
    str_nums.sort(key=functools.cmp_to_key(lambda a, b: 1 if a + b < b + a else -1))

    # Join and handle leading zeros (e.g., [0, 0] -> "0")
    result = ''.join(str_nums)
    return result if result[0] != '0' else '0'
```

```javascript
function largestNumber(nums) {
  // Convert numbers to strings
  const strNums = nums.map(String);

  // Custom comparator: compare a+b vs b+a
  strNums.sort((a, b) => {
    const order1 = a + b;
    const order2 = b + a;
    return order2.localeCompare(order1);
  });

  // Join and handle leading zeros
  const result = strNums.join("");
  return result[0] === "0" ? "0" : result;
}
```

```java
import java.util.*;

public class Solution {
    public String largestNumber(int[] nums) {
        // Convert ints to Strings
        String[] strNums = new String[nums.length];
        for (int i = 0; i < nums.length; i++) {
            strNums[i] = String.valueOf(nums[i]);
        }

        // Custom comparator: compare a+b vs b+a
        Arrays.sort(strNums, (a, b) -> {
            String order1 = a + b;
            String order2 = b + a;
            return order2.compareTo(order1); // Descending order
        });

        // Handle leading zero case
        if (strNums[0].equals("0")) {
            return "0";
        }

        StringBuilder result = new StringBuilder();
        for (String num : strNums) {
            result.append(num);
        }
        return result.toString();
    }
}
```

</div>

## Recommended Practice Order

1.  **Fundamentals:** Ensure you understand the mechanics and time/space complexity of standard sorts (QuickSort, MergeSort).
2.  **Basic Application:** Solve easy LeetCode problems that use `sort()` as a one-line helper (e.g., "Sort Array By Parity").
3.  **Custom Comparators:** Practice medium-difficulty problems that require defining a sort key or comparison function, like the example above or "Merge Intervals."
4.  **Optimization:** Tackle problems where sorting is part of an optimized two-pointer or greedy approach, such as "Two Sum Less Than K."

[Practice Sorting at Deutsche Bank](/company/deutsche-bank/sorting)
