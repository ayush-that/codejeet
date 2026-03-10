---
title: "Sorting Questions at Atlassian: What to Expect"
description: "Prepare for Sorting interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-18"
category: "dsa-patterns"
tags: ["atlassian", "sorting", "interview prep"]
---

## Sorting Questions at Atlassian: What to Expect

Atlassian’s 13 Sorting questions represent about 21% of their total problem set—a significant portion that tells you this topic isn’t just a warm-up. In real interviews, especially for backend and full-stack roles, sorting fundamentals appear frequently as a building block for more complex problems. Atlassian’s products (Jira, Confluence, Bitbucket) heavily involve ordered data—think of sorting tickets by priority, ranking search results, or ordering version histories. Interviewers here don’t just ask you to implement quicksort; they embed sorting logic into problems that test your ability to reason about efficiency and data relationships. If you neglect sorting, you’re ignoring one of their core assessment areas for algorithmic maturity.

## Specific Patterns Atlassian Favors

Atlassian’s sorting questions lean heavily on **custom comparator logic** and **hybrid problems where sorting is the key insight**. You’ll rarely see a standalone “sort an array” question. Instead, they combine sorting with:

- **Interval manipulation** (e.g., merging, overlapping)
- **Greedy algorithms** where sorting enables the optimal approach
- **String/array transformations** that become trivial once data is ordered

A classic example is the “Merge Intervals” pattern (LeetCode #56). Atlassian has variations that ask you to sort intervals by start time, then process them in a single pass. Another favorite is “Largest Number” (LeetCode #179), where you sort numbers as strings with a custom comparator to form the largest possible number. These problems test whether you recognize that sorting can reduce an O(n²) brute-force approach to O(n log n).

Here’s the core pattern for a custom comparator, using the “Largest Number” problem as a template:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def largestNumber(nums):
    # Convert numbers to strings for custom comparison
    str_nums = list(map(str, nums))

    # Custom comparator: compare concatenations a+b vs b+a
    def compare(a, b):
        if a + b > b + a:
            return -1  # a should come before b
        elif a + b < b + a:
            return 1   # b should come before a
        else:
            return 0

    # Sort using the comparator
    str_nums.sort(key=functools.cmp_to_key(compare))

    # Edge case: if the largest number is "0", return "0"
    if str_nums[0] == "0":
        return "0"

    return ''.join(str_nums)
```

```javascript
// Time: O(n log n) | Space: O(n)
function largestNumber(nums) {
  // Convert numbers to strings
  const strNums = nums.map(String);

  // Custom comparator: compare concatenations a+b vs b+a
  strNums.sort((a, b) => {
    const order1 = a + b;
    const order2 = b + a;
    if (order1 > order2) return -1; // a before b
    if (order1 < order2) return 1; // b before a
    return 0;
  });

  // Edge case: if the largest number is "0", return "0"
  if (strNums[0] === "0") {
    return "0";
  }

  return strNums.join("");
}
```

```java
// Time: O(n log n) | Space: O(n)
public String largestNumber(int[] nums) {
    // Convert ints to Strings
    String[] strNums = new String[nums.length];
    for (int i = 0; i < nums.length; i++) {
        strNums[i] = String.valueOf(nums[i]);
    }

    // Custom comparator: compare concatenations a+b vs b+a
    Arrays.sort(strNums, (a, b) -> {
        String order1 = a + b;
        String order2 = b + a;
        return order2.compareTo(order1); // Descending order
    });

    // Edge case: if the largest number is "0", return "0"
    if (strNums[0].equals("0")) {
        return "0";
    }

    return String.join("", strNums);
}
```

</div>

## How to Prepare

Master two skills: **identifying when sorting is the key** and **writing clean comparator logic**. For interval problems, always sort by start time first. For greedy problems, ask yourself: “Would ordering the data make the greedy choice obvious?” Practice writing comparators in your sleep—Atlassian interviewers often watch for off-by-one errors or incorrect inequality signs.

When you see a problem involving grouping, ordering, or maximizing/minimizing based on position, sorting is likely involved. A frequent pattern is “sort then traverse,” where you sort once and then solve the rest in linear time. Here’s the interval merging pattern, another Atlassian staple:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) (for output list)
def merge(intervals):
    if not intervals:
        return []

    # Sort by start time
    intervals.sort(key=lambda x: x[0])

    merged = []
    for interval in intervals:
        # If merged is empty or no overlap, add new interval
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            # Merge by updating the end time
            merged[-1][1] = max(merged[-1][1], interval[1])

    return merged
```

```javascript
// Time: O(n log n) | Space: O(n) (for output list)
function merge(intervals) {
  if (intervals.length === 0) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [];
  for (let interval of intervals) {
    // If merged is empty or no overlap, add new interval
    if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
      merged.push(interval);
    } else {
      // Merge by updating the end time
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
    }
  }

  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n) (for output list)
public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];

    // Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    for (int[] interval : intervals) {
        // If merged is empty or no overlap, add new interval
        if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {
            merged.add(interval);
        } else {
            // Merge by updating the end time
            merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);
        }
    }

    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## How Atlassian Tests Sorting vs Other Companies

Atlassian’s sorting questions are more applied than theoretical. Unlike companies like Google that might ask you to derive a sorting algorithm’s complexity or prove its correctness, Atlassian focuses on practical implementation within a business context. Their problems often mirror real scenarios: merging time ranges (for scheduling), ordering tasks by priority, or ranking search results.

Compared to Facebook (Meta), which tends toward more abstract array manipulation, Atlassian’s sorting problems are grounded in data organization. Amazon might emphasize sorting in system design contexts (like sorting product listings), but Atlassian tests it as a core algorithmic tool. The difficulty is usually medium—they want to see you apply sorting cleanly, not invent a new algorithm.

## Study Order

1.  **Basic Sorting Algorithms:** Understand quicksort, mergesort, and heapsort conceptually. You don’t need to implement them from scratch, but know their time/space complexities and stability. This foundation explains why O(n log n) is the barrier for comparison sorts.
2.  **Built-in Sort with Custom Comparators:** Practice modifying sort order in your language of choice. This is the most frequent operation in Atlassian problems.
3.  **Interval Patterns:** Sorting intervals by start or end time is a recurring theme. Start with Merge Intervals (#56) before moving to more complex variants like Non-overlapping Intervals (#435).
4.  **Greedy + Sorting:** Problems where sorting enables a greedy solution, like Meeting Rooms II (#253) or Task Scheduler (#621). Recognize that sorting transforms the problem space.
5.  **String/Number Custom Sorting:** Practice problems like Largest Number (#179) that require non-standard comparisons. This tests your ability to define ordering logic.
6.  **Advanced Hybrids:** Finally, tackle problems where sorting is one step of a multi-step solution, such as in combination with two pointers or binary search.

## Recommended Practice Order

Solve these problems in sequence to build competency:

1.  **Merge Intervals (#56)** – The fundamental interval pattern.
2.  **Meeting Rooms II (#253)** – Sorting plus a greedy/min-heap approach.
3.  **Largest Number (#179)** – Master custom comparators.
4.  **Non-overlapping Intervals (#435)** – A slight twist on the interval theme.
5.  **Task Scheduler (#621)** – Sorting as part of a more complex greedy solution.
6.  **Custom Sort String (#791)** – A lighter problem that reinforces comparator logic.
7.  **Atlassian-specific problems** from their tagged list, which often combine these patterns.

This progression moves from pure sorting applications to integrated solutions, matching how Atlassian interviews escalate in complexity.

[Practice Sorting at Atlassian](/company/atlassian/sorting)
