---
title: "Sorting Questions at Zomato: What to Expect"
description: "Prepare for Sorting interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-10"
category: "dsa-patterns"
tags: ["zomato", "sorting", "interview prep"]
---

# Sorting Questions at Zomato: What to Expect

If you're preparing for a software engineering interview at Zomato, you might have noticed that sorting questions appear in about 10% of their problem set (3 out of 29 total). That's not a coincidence — it reflects how Zomato's engineering challenges intersect with sorting fundamentals. While sorting isn't their most frequent topic, it's a critical one that often appears in interviews for roles dealing with restaurant ranking, delivery optimization, and data processing pipelines.

Here's what most candidates miss: Zomato's sorting questions aren't about implementing quicksort from scratch. They're about applying sorting as a tool to solve domain-specific problems. The company deals with massive datasets — restaurant listings, user reviews, delivery times, menu items — where efficient ordering and ranking directly impact user experience and business metrics. When they ask sorting questions, they're testing whether you can recognize when sorting transforms an O(n²) brute force solution into an elegant O(n log n) one.

## Specific Patterns Zomato Favors

Zomato's sorting problems tend to cluster around three specific patterns:

1. **Sorting with custom comparators** — This is their most frequent pattern. Think about restaurant ranking: you might need to sort by rating, then by number of reviews, then by proximity. Or consider delivery assignments where you sort drivers by availability, then rating, then distance.

2. **Interval merging and scheduling** — Delivery time slots, restaurant operating hours, peak demand periods. These naturally map to interval problems where sorting endpoints enables efficient merging.

3. **Two-pointer techniques after sorting** — Once data is sorted, many problems become tractable with two-pointer approaches. This appears in menu item combinations, delivery route optimization, and duplicate detection.

A classic example is the "Merge Intervals" pattern (LeetCode #56). At Zomato, this could represent merging overlapping delivery time windows or consolidating restaurant operating hours across multiple locations.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for output, O(log n) for sort
def merge_intervals(intervals):
    if not intervals:
        return []

    # Sort by start time - this is the key insight
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]

        # If intervals overlap, merge them
        if current_start <= last_end:
            merged[-1] = [last_start, max(last_end, current_end)]
        else:
            merged.append([current_start, current_end])

    return merged
```

```javascript
// Time: O(n log n) | Space: O(n) for output, O(log n) for sort
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [currentStart, currentEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    // Check for overlap
    if (currentStart <= lastEnd) {
      merged[merged.length - 1] = [lastStart, Math.max(lastEnd, currentEnd)];
    } else {
      merged.push([currentStart, currentEnd]);
    }
  }

  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n) for output, O(log n) for sort
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
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.add(current);
        }
    }

    return merged.toArray(new int[merged.size()][]);
}
```

</div>

Another frequent pattern is custom sorting, like in "Largest Number" (LeetCode #179), which could represent ranking restaurants by composite scores.

## How to Prepare

Most candidates waste time memorizing sorting algorithms. Instead, focus on these three skills:

1. **Recognize when sorting helps** — If a problem asks for "closest," "nearest," "maximum/minimum pairs," or involves comparisons between all elements, sorting might reduce complexity.

2. **Master comparator writing** — Practice until you can write comparators without hesitation. Remember: return negative if a should come before b, positive if a should come after b, zero if equal.

3. **Combine sorting with other techniques** — Sorting alone rarely solves the problem. It's usually step one, followed by two-pointer traversal, greedy selection, or binary search.

Here's a custom comparator example for sorting strings to form the largest number:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def largest_number(nums):
    # Convert to strings for concatenation comparison
    str_nums = list(map(str, nums))

    # Custom comparator: which concatenation is larger?
    str_nums.sort(key=cmp_to_key(lambda a, b: 1 if a + b < b + a else -1))

    # Handle edge case: all zeros
    result = ''.join(str_nums)
    return result if result[0] != '0' else '0'
```

```javascript
// Time: O(n log n) | Space: O(n)
function largestNumber(nums) {
  // Convert to strings
  const strNums = nums.map(String);

  // Custom comparator
  strNums.sort((a, b) => {
    const order1 = a + b;
    const order2 = b + a;
    return order2.localeCompare(order1);
  });

  // Handle edge case: all zeros
  const result = strNums.join("");
  return result[0] === "0" ? "0" : result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

public String largestNumber(int[] nums) {
    // Convert to strings
    String[] strNums = new String[nums.length];
    for (int i = 0; i < nums.length; i++) {
        strNums[i] = String.valueOf(nums[i]);
    }

    // Custom comparator
    Arrays.sort(strNums, (a, b) -> {
        String order1 = a + b;
        String order2 = b + a;
        return order2.compareTo(order1);
    });

    // Handle edge case: all zeros
    if (strNums[0].equals("0")) {
        return "0";
    }

    StringBuilder result = new StringBuilder();
    for (String num : strNums) {
        result.append(num);
    }
    return result.toString();
}
```

</div>

## How Zomato Tests Sorting vs Other Companies

Zomato's sorting questions differ from FAANG companies in subtle but important ways:

- **Domain context matters more** — While Google might ask abstract sorting puzzles, Zomato often wraps sorting in food delivery or restaurant management scenarios. You need to translate the business problem into a sorting problem.

- **Medium difficulty dominates** — Zomato rarely asks "hard" sorting problems. Their questions typically sit at LeetCode medium level, but with practical twists that test your ability to apply rather than invent.

- **Emphasis on efficiency** — Given Zomato's scale (millions of orders daily), they care about the practical efficiency of your solution more than theoretical optimality. Be prepared to discuss real-world constraints.

- **Follow-up questions** — Expect "what if" scenarios: "What if the data doesn't fit in memory?" or "How would this change for real-time updates?" These test your systems thinking alongside algorithmic skills.

## Study Order

Don't study sorting topics randomly. Follow this progression:

1. **Basic sorting algorithms** — Understand how quicksort, mergesort, and heapsort work conceptually. You won't implement them, but you need to know their properties (stable/unstable, time/space complexity).

2. **Built-in sorting with custom comparators** — Practice until writing comparators is muscle memory. Start with simple numeric sorts, then move to multi-key sorts.

3. **Interval problems** — These are sorting in disguise. Master merging, inserting, and finding overlaps.

4. **Two-pointer techniques on sorted data** — Problems like "Two Sum II" (LeetCode #167) or "3Sum" (LeetCode #15) rely on sorting first.

5. **Greedy algorithms with sorting** — Many greedy solutions require sorting as a preprocessing step, like "Meeting Rooms II" (LeetCode #253).

6. **Advanced patterns** — Bucket sort variants, radix sort applications, and topological sort (though less common at Zomato).

This order works because each step builds on the previous one. You can't solve interval problems without understanding comparators, and you can't apply two-pointer techniques effectively without recognizing when sorting enables them.

## Recommended Practice Order

Solve these problems in sequence:

1. **Merge Intervals** (LeetCode #56) — Fundamental interval pattern
2. **Meeting Rooms II** (LeetCode #253) — Interval counting with sorting
3. **Largest Number** (LeetCode #179) — Custom comparator mastery
4. **Two Sum II** (LeetCode #167) — Two-pointer after sorting
5. **3Sum** (LeetCode #15) — Advanced two-pointer application
6. **K Closest Points to Origin** (LeetCode #973) — Custom comparator with distance
7. **Custom Sort String** (LeetCode #791) — Real-world sorting application
8. **Non-overlapping Intervals** (LeetCode #435) — Greedy interval selection

After these eight problems, you'll have covered 90% of sorting patterns Zomato uses. The key is not just solving them, but understanding why sorting was the right approach and how it transformed the problem.

Remember: at Zomato, sorting questions test your ability to bring order to chaos — both in code and in real-world delivery systems. They're looking for engineers who can see the sorting pattern hidden in business requirements and implement it cleanly.

[Practice Sorting at Zomato](/company/zomato/sorting)
