---
title: "Sorting Questions at Turing: What to Expect"
description: "Prepare for Sorting interview questions at Turing — patterns, difficulty breakdown, and study tips."
date: "2030-03-05"
category: "dsa-patterns"
tags: ["turing", "sorting", "interview prep"]
---

Sorting questions at Turing represent exactly 10% of their technical interview question bank—four out of forty total problems. This isn't a trivial slice; it’s a deliberate signal. In the landscape of coding interviews, sorting is often treated as a foundational warm-up or a hidden step within a more complex algorithm. At Turing, it’s treated as a core competency for assessing a candidate’s grasp of algorithmic efficiency, trade-off analysis, and the ability to manipulate data in-place. You won’t just be asked to implement Quicksort. You’ll be given problems where the _insight_ that sorting unlocks the solution is the key, and your implementation choices reveal your depth. In real interviews here, a sorting-based question is highly likely to appear, either as the main problem or as a critical optimization step in a system design or data processing scenario.

## Specific Patterns Turing Favors

Turing’s sorting questions lean heavily on **applied sorting for problem simplification**. They favor patterns where an unsorted array’s disorder is the main obstacle, and sorting transforms it into a structure where a simple linear scan or greedy approach works. You won't find abstract, pure sorting algorithm implementation questions. Instead, expect these two patterns:

1.  **The "Sort to Enable Greedy or Two-Pointer" Pattern:** The problem involves finding pairs, triples, or optimal groupings. The naive solution is O(n²) or involves complex bookkeeping. Sorting the array first (O(n log n)) allows you to then apply an efficient O(n) greedy strategy or use the two-pointer technique. This tests if you can identify the preprocessing step that changes the problem's complexity class.
2.  **The "Custom Comparator" Pattern:** The objects you need to sort aren’t integers; they are intervals, strings, or custom objects. The core of the problem is defining the correct order. This tests your understanding of stable vs. unstable sorts and your ability to model business logic (e.g., "schedule these meetings") into a comparison function.

A classic example merging both patterns is **Merge Intervals (LeetCode #56)**. Sorting the intervals by their start time is the non-obvious key that makes the linear merge possible.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for the result list (or O(1) if sorted in-place)
def merge(intervals):
    if not intervals:
        return []

    # PATTERN: Sort by the start time to bring overlapping intervals together
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    # PATTERN: After sorting, a linear greedy merge works
    for current_start, current_end in intervals[1:]:
        last_start, last_end = merged[-1]

        if current_start <= last_end:  # Overlap exists
            # Merge by updating the end of the last interval in merged list
            merged[-1][1] = max(last_end, current_end)
        else:
            # No overlap, append the current interval
            merged.append([current_start, current_end])

    return merged
```

```javascript
// Time: O(n log n) | Space: O(n) for the result array (or O(1) if sorted in-place)
function merge(intervals) {
  if (intervals.length === 0) return [];

  // PATTERN: Sort by the start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const [currStart, currEnd] = intervals[i];
    const [lastStart, lastEnd] = merged[merged.length - 1];

    if (currStart <= lastEnd) {
      // Merge
      merged[merged.length - 1][1] = Math.max(lastEnd, currEnd);
    } else {
      // No overlap
      merged.push([currStart, currEnd]);
    }
  }
  return merged;
}
```

```java
// Time: O(n log n) | Space: O(n) for the result list (or O(1) if sorted in-place)
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;

    // PATTERN: Sort by the start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        int[] curr = intervals[i];

        if (curr[0] <= last[1]) {
            // Merge
            last[1] = Math.max(last[1], curr[1]);
        } else {
            // No overlap
            merged.add(curr);
        }
    }
    // Convert list back to array
    return merged.toArray(new int[merged.size()][]);
}
```

</div>

Another quintessential Turing-style problem is **Non-overlapping Intervals (LeetCode #435)**, which uses a custom comparator (sort by end time) to enable a greedy selection algorithm.

## How to Prepare

Your study should focus on pattern recognition, not memorization. When you see a problem involving arrays of pairs or groups, ask: "Would sorting this by a key property reveal a simpler sub-problem?"

1.  **Master the Custom Comparator:** Be fluent in writing comparator functions (or lambda expressions) in your language of choice. Practice sorting lists of tuples, objects, and strings based on multiple keys.
2.  **Internalize the Trade-off:** Always articulate the trade-off: "By spending O(n log n) time on sorting, we reduce the subsequent step from O(n²) to O(n), yielding a net O(n log n) solution, which is optimal for this problem." This shows you understand complexity analysis, not just code.
3.  **Practice In-place Operations:** Many sorting-based solutions can be done in O(1) extra space if you sort the input array and use pointers within it. This is often the follow-up question.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) - In-place sort and two-pointer
def find_unsorted_subarray(nums):
    # Create a sorted copy to compare against
    sorted_nums = sorted(nums)
    start, end = len(nums), 0

    for i in range(len(nums)):
        if nums[i] != sorted_nums[i]:
            start = min(start, i)
            end = max(end, i)
    # If the array was already sorted, start > end, return 0
    return end - start + 1 if end - start >= 0 else 0

# A more advanced, O(n) time O(1) space solution exists, but this
# sorting-based approach is often acceptable and demonstrates the pattern.
```

```javascript
// Time: O(n log n) | Space: O(n) - for the sorted copy
function findUnsortedSubarray(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  let start = nums.length,
    end = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== sorted[i]) {
      start = Math.min(start, i);
      end = Math.max(end, i);
    }
  }
  return end - start >= 0 ? end - start + 1 : 0;
}
```

```java
// Time: O(n log n) | Space: O(n) - for the sorted copy
public int findUnsortedSubarray(int[] nums) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int start = nums.length, end = 0;

    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != sorted[i]) {
            start = Math.min(start, i);
            end = Math.max(end, i);
        }
    }
    return end - start >= 0 ? end - start + 1 : 0;
}
```

</div>

## How Turing Tests Sorting vs Other Companies

At larger FAANG-style companies, a sorting question might be a straightforward warm-up or deeply embedded in a complex problem (e.g., find the median from a data stream). They test if you know the library sort complexity and can apply it.

Turing’s approach is more **applied and product-adjacent**. The problems often mirror real-world data sequencing tasks: scheduling user events, batching processes, or optimizing resource allocation. The "custom comparator" pattern is prevalent because it directly translates product rules (e.g., "priority customers first, then by request time") into code. The difficulty isn't in exotic algorithms; it's in cleanly translating somewhat messy requirements into a single, correct sort order that makes everything else trivial. They test for clarity of thought and practical implementation.

## Study Order

Tackle sorting topics in this order to build a logical progression:

1.  **Library Sorting & Basic Comparators:** Learn how to sort primitives and custom objects in your language. Understand stable vs. unstable sorts conceptually.
2.  **The "Sort-First" Insight:** Practice problems where the entire solution hinges on sorting first. Start with easy problems like **Meeting Rooms (LeetCode #252)** to build the instinct.
3.  **Greedy Algorithms Enabled by Sorting:** This is the core. Study **Non-overlapping Intervals (#435)** and **Task Scheduler (#621)**. Here, sorting doesn't just help; it defines the optimal strategy.
4.  **Two-Pointer on Sorted Arrays:** Problems like **Two Sum II (LeetCode #167)** or **3Sum (LeetCode #15)**. Sorting enables the efficient two-pointer technique.
5.  **Advanced Custom Sorting:** Practice multi-key sorting (e.g., sort by one property ascending, another descending) and handling edge cases in comparators, as seen in **Largest Number (LeetCode #179)**.

This order works because it moves from mechanics (how to sort) to strategy (why to sort) to advanced application (complex sort rules).

## Recommended Practice Order

Solve these problems in sequence. Each builds on the pattern of the last.

1.  **Meeting Rooms (LeetCode #252):** The simplest "sort to compare" problem.
2.  **Merge Intervals (LeetCode #56):** Introduces merging after sorting, a fundamental pattern.
3.  **Non-overlapping Intervals (LeetCode #435):** Teaches that _how_ you sort (by start vs. end) changes the greedy algorithm.
4.  **Valid Anagram (LeetCode #242):** A classic example where sorting both strings provides a simple solution.
5.  **K Closest Points to Origin (LeetCode #973):** Custom comparator practice and using a sort to select top K elements.
6.  **Sort Colors (LeetCode #75):** A pivot to in-place partitioning (Dutch Flag Problem), which is the core of Quicksort. This is as close to "implement a sort" as you might get.

Mastering these will give you the toolkit and, more importantly, the _instinct_ to see when sorting is the key that unlocks a Turing interview problem.

[Practice Sorting at Turing](/company/turing/sorting)
