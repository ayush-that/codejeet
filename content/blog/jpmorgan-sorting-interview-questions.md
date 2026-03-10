---
title: "Sorting Questions at JPMorgan: What to Expect"
description: "Prepare for Sorting interview questions at JPMorgan — patterns, difficulty breakdown, and study tips."
date: "2028-09-19"
category: "dsa-patterns"
tags: ["jpmorgan", "sorting", "interview prep"]
---

If you're preparing for a JPMorgan software engineering interview, you'll quickly notice that sorting isn't just another topic—it's a fundamental building block woven into their problem-solving philosophy. With 17 out of their 78 tagged questions involving sorting, that's over 20% of their technical repertoire. This isn't a coincidence. In financial systems, data integrity, transaction ordering, and time-series analysis are paramount. Sorting is rarely the end goal; it's the critical preprocessing step that transforms an intractable O(n²) search into a manageable O(n log n) operation, or that enables efficient merging of financial records. At JPMorgan, you're not just implementing `sort()`—you're using sorting as a strategic tool to impose order on chaotic data, which is exactly what their systems do daily.

## Specific Patterns JPMorgan Favors

JPMorgan's sorting questions rarely ask you to implement quicksort from scratch. Instead, they focus on **applied sorting patterns** where the sorting logic is custom and integral to the algorithm. You'll see three dominant patterns:

1.  **Custom Comparator Sorting:** This is their bread and butter. Problems where you must sort objects (like intervals, strings, or transactions) based on multiple, often non-obvious, criteria. The sorting key isn't the element itself, but a derived property.
2.  **Sorting as a Preprocessing Enabler:** They love problems where sorting the input first unlocks a simple linear or two-pointer solution to a problem that initially looks complex. The "sort first, ask questions later" approach.
3.  **Merge Pattern Variations:** Given their domain, merging sorted lists or intervals is a common theme, simulating the consolidation of financial data streams or time blocks.

A quintessential JPMorgan problem is **Merge Intervals (LeetCode #56)**. It perfectly combines custom sorting (sort intervals by start time) with a linear merge pass. Another favorite is **Non-overlapping Intervals (LeetCode #435)**, which uses the same sorted foundation to solve a different optimization problem. For custom comparators, look at **Largest Number (LeetCode #179)**, where you sort numbers as strings based on concatenated results.

## How to Prepare

Master the custom comparator. In interviews, you'll be expected to write it fluently without hesitation. The mental model is: "To sort array `A` in a custom order, define how to compare any two elements `a` and `b`. Should `a` come before `b`? Return `-1` (or `True`). Should `b` come before `a`? Return `1` (or `False`)."

Let's look at a pattern for interval problems. After sorting by the start time, the merge or check process is always a linear scan.

<div class="code-group">

```python
def merge_intervals(intervals):
    """
    Merge all overlapping intervals.
    Time: O(n log n) for sorting + O(n) for merge = O(n log n)
    Space: O(log n) for sorting space (Timsort) or O(n) if output considered.
    """
    if not intervals:
        return []

    # 1. Sort by start time using a simple key
    intervals.sort(key=lambda x: x[0])

    merged = []
    for interval in intervals:
        # 2. If no overlap with last merged, append new
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            # 3. Otherwise, merge by updating the end time
            merged[-1][1] = max(merged[-1][1], interval[1])

    return merged
```

```javascript
function mergeIntervals(intervals) {
  // Time: O(n log n) | Space: O(log n) for sorting space or O(n) for output.
  if (intervals.length === 0) return [];

  // 1. Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    // 2. Check for overlap
    if (last[1] < current[0]) {
      merged.push(current);
    } else {
      // 3. Merge by updating end
      last[1] = Math.max(last[1], current[1]);
    }
  }
  return merged;
}
```

```java
public int[][] merge(int[][] intervals) {
    // Time: O(n log n) | Space: O(log n) sorting space, O(n) for output list.
    if (intervals.length <= 1) return intervals;

    // 1. Sort by start time using a custom comparator
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    int[] currentInterval = intervals[0];
    merged.add(currentInterval);

    for (int[] interval : intervals) {
        int currentEnd = currentInterval[1];
        int nextStart = interval[0];
        int nextEnd = interval[1];

        // 2. Check for overlap
        if (currentEnd >= nextStart) {
            // 3. Merge
            currentInterval[1] = Math.max(currentEnd, nextEnd);
        } else {
            currentInterval = interval;
            merged.add(currentInterval);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

For complex custom sorts, like in **Largest Number**, the comparator logic is the entire challenge.

<div class="code-group">

```python
def largest_number(nums):
    """
    Sort numbers such that concatenation is largest.
    Time: O(k * n log n) where k is avg length of number strings.
    Space: O(n) for the string conversion list.
    """
    # 1. Convert to strings for custom comparison
    str_nums = list(map(str, nums))

    # 2. Define comparator: which order gives a larger concatenation?
    # If a+b > b+a, then a should come before b in our sorted list.
    str_nums.sort(key=functools.cmp_to_key(lambda a, b: 1 if a+b < b+a else -1))

    # 3. Edge case: if the largest number is "0", return "0"
    result = ''.join(str_nums)
    return result if result[0] != '0' else '0'
```

```javascript
function largestNumber(nums) {
  // Time: O(k * n log n) | Space: O(n)
  // 1. Convert to strings
  const strNums = nums.map(String);

  // 2. Custom sort: compare concatenations
  strNums.sort((a, b) => {
    const order1 = a + b;
    const order2 = b + a;
    return order2.localeCompare(order1); // Descending order
  });

  // 3. Handle leading zero edge case
  const result = strNums.join("");
  return result[0] === "0" ? "0" : result;
}
```

```java
public String largestNumber(int[] nums) {
    // Time: O(k * n log n) | Space: O(n)
    // 1. Convert to String array
    String[] strNums = new String[nums.length];
    for (int i = 0; i < nums.length; i++) {
        strNums[i] = String.valueOf(nums[i]);
    }

    // 2. Custom comparator: sort descending by concatenated value
    Arrays.sort(strNums, (a, b) -> {
        String order1 = a + b;
        String order2 = b + a;
        return order2.compareTo(order1); // Descending
    });

    // 3. Edge case: largest number is "0"
    if (strNums[0].equals("0")) {
        return "0";
    }

    StringBuilder sb = new StringBuilder();
    for (String num : strNums) {
        sb.append(num);
    }
    return sb.toString();
}
```

</div>

## How JPMorgan Tests Sorting vs Other Companies

At pure tech companies (FAANG), a sorting question might be a clever trick within a complex data structure problem or a step in system design (e.g., merge k sorted streams). The focus is on algorithmic optimization and scalability.

At JPMorgan, the context is different. The sorting problems often model **real financial data processing**:

- **Difficulty:** They tend to be medium-difficulty. The hard part isn't a obscure algorithm, but cleanly implementing the correct sorting logic and handling edge cases (empty input, all zeros, single element).
- **Uniqueness:** They test for **practical correctness and clarity**. Can you write a bug-free comparator on the first try? Is your merge logic robust? They care about the solution being _financially sound_—no data loss during merges, proper ordering of transactions.
- **Contrast:** Unlike some tech companies that might ask about the internals of Timsort or stability, JPMorgan assumes you'll use the language's built-in sort. Their question is _how_ you use it to solve their business-like problem.

## Study Order

Tackle sorting in this logical progression:

1.  **Master the Built-in Sort:** Know exactly how to use `sort()` with a custom key or comparator in your language of choice. This is non-negotiable.
2.  **Basic Custom Sorting:** Practice problems where you sort objects by one, then multiple attributes (e.g., sort people by age, then by name). This builds comparator intuition.
3.  **Sorting as Enabler:** Solve problems where sorting is the first, crucial step. Recognize the pattern: if a problem asks for "pairs," "overlaps," or "minimum something," sorting the input often reduces complexity dramatically.
4.  **Advanced Comparator Logic:** Tackle problems where the sort order is non-trivial and based on a derived value or comparison of concatenated strings (like Largest Number).
5.  **Merge Patterns:** Finally, specialize in interval merging and merging k sorted lists. These are direct analogs to financial data consolidation tasks.

## Recommended Practice Order

Solve these problems in sequence to build the skill ladder:

1.  **Sort Colors (LeetCode #75)** - Basic in-place sort (Dutch Flag).
2.  **Meeting Rooms (LeetCode #252)** - Simple sort and check for overlap. The gateway to intervals.
3.  **Merge Intervals (LeetCode #56)** - The foundational pattern. Do this until you can write it perfectly in <5 minutes.
4.  **Non-overlapping Intervals (LeetCode #435)** - Applies the same sorted foundation to a different goal (removal count).
5.  **Largest Number (LeetCode #179)** - Deep dive into custom comparator logic. The ultimate test.
6.  **Merge Sorted Array (LeetCode #88)** - Basic merge pattern from the end.
7.  **K Closest Points to Origin (LeetCode #973)** - Sorting with a custom key (distance).
8.  **Custom Sort String (LeetCode #791)** - A clever application of sorting by a custom order map.

This sequence moves from basic usage to strategic application, mirroring how JPMorgan interviews progress from warm-up to core problem-solving. Remember, at JPMorgan, sorting is less about theory and more about wielding a practical tool with precision. Your goal is to make sorting look like the obvious, natural first step—because in their world of ordered data, it usually is.

[Practice Sorting at JPMorgan](/company/jpmorgan/sorting)
