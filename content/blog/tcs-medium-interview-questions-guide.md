---
title: "Medium TCS Interview Questions: Strategy Guide"
description: "How to tackle 103 medium difficulty questions from TCS — patterns, time targets, and practice tips."
date: "2032-02-11"
category: "tips"
tags: ["tcs", "medium", "interview prep"]
---

Tata Consultancy Services (TCS) interviews often feature a distinct flavor of Medium problems that sit at the perfect intersection of algorithmic thinking and practical implementation. While their Easy questions typically test basic syntax, data structure familiarity, and straightforward logic, their Medium problems are where the real interview is decided. The key differentiator is that TCS Medium problems are rarely about applying a single, well-known algorithm in isolation. Instead, they are **"glue" problems**—they require you to combine 2-3 fundamental concepts (like hashing, sorting, and two-pointer techniques) into a cohesive solution that models a realistic, albeit simplified, scenario. Success here isn't about knowing the most obscure algorithm; it's about cleanly assembling the right basic blocks under time pressure.

## Common Patterns and Templates

The most prevalent pattern in TCS Medium problems is the **Modified Traversal or Search**. You're often given a data structure (array, string, matrix, or tree) and asked to find, count, or validate something based on a condition that requires state tracking beyond a simple loop. This frequently involves using a hash map (`dict`, `Map`, `HashMap`) to store intermediate results or counts, coupled with a greedy or sliding window pass.

A classic template for this pattern involves iterating through an array or string while maintaining a map of seen elements or running totals to make O(1) lookback decisions.

<div class="code-group">

```python
# Template: Modified Traversal with State Tracking
# Common in problems like finding subarrays with a certain sum, longest substring with K distinct chars, etc.
# Time: O(n) | Space: O(k) where k is the size of the tracking map
def modified_traversal_template(nums, target):
    # Initialize tracking structure (often a hash map or set)
    tracker = {}
    running_sum = 0
    result = 0

    # Crucial: Often need to seed the tracker with an initial state (e.g., sum 0 at index -1)
    tracker[0] = 1

    for num in nums:
        # Update running state (sum, product, character count, etc.)
        running_sum += num

        # Calculate the "complement" or key we need to look for
        needed = running_sum - target

        # Check if that needed state exists in our history
        if needed in tracker:
            result += tracker[needed]

        # Update the tracker with the current running state for future iterations
        tracker[running_sum] = tracker.get(running_sum, 0) + 1

    return result
```

```javascript
// Template: Modified Traversal with State Tracking
// Time: O(n) | Space: O(k)
function modifiedTraversalTemplate(nums, target) {
  const tracker = new Map();
  let runningSum = 0;
  let result = 0;

  // Seed the initial state
  tracker.set(0, 1);

  for (const num of nums) {
    runningSum += num;
    const needed = runningSum - target;

    if (tracker.has(needed)) {
      result += tracker.get(needed);
    }

    tracker.set(runningSum, (tracker.get(runningSum) || 0) + 1);
  }

  return result;
}
```

```java
// Template: Modified Traversal with State Tracking
// Time: O(n) | Space: O(k)
public int modifiedTraversalTemplate(int[] nums, int target) {
    Map<Integer, Integer> tracker = new HashMap<>();
    int runningSum = 0;
    int result = 0;

    // Seed the initial state
    tracker.put(0, 1);

    for (int num : nums) {
        runningSum += num;
        int needed = runningSum - target;

        if (tracker.containsKey(needed)) {
            result += tracker.get(needed);
        }

        tracker.put(runningSum, tracker.getOrDefault(runningSum, 0) + 1);
    }

    return result;
}
```

</div>

This exact pattern solves problems like **Subarray Sum Equals K (LeetCode #560)**. The "Medium" leap is recognizing that a brute-force O(n²) check of all subarrays can be optimized to O(n) by realizing you're looking for `current_sum - previous_sum = k`, which rearranges to `previous_sum = current_sum - k`.

## Time Benchmarks and What Interviewers Look For

For a TCS Medium problem, you should aim to arrive at a working, reasonably optimized solution within **20-25 minutes**. This includes understanding the problem, discussing your approach, writing the code, and walking through test cases. The interviewer is evaluating several signals beyond correctness:

1.  **Systematic Edge Case Identification:** Do you immediately consider empty inputs, single-element inputs, large values, negative numbers, or duplicate values? Mentioning these _before_ coding, and perhaps writing a comment where you'd handle them, shows foresight.
2.  **Code Clarity Over Cleverness:** TCS values maintainable code. Use descriptive variable names (`maxLength` instead of `ml`), write helper functions if logic becomes nested, and add brief inline comments for the non-obvious steps. A clean, readable O(n log n) solution is often better than a cryptic O(n) one.
3.  **Verbalizing the Trade-off:** When presenting your solution, explicitly state, "This uses O(n) extra space for the hash map, which is a trade-off for the O(n) time complexity. If we were extremely memory-constrained, an alternative would be..." This demonstrates you understand the engineering decision, not just the algorithm.

## Key Differences from Easy Problems

The jump from Easy to Medium at TCS is defined by three specific skill upgrades:

1.  **From Single-Pass to Multi-Pass or Multi-Structure:** Easy problems are often solvable with one loop and maybe a temporary variable. Medium problems require two independent passes (e.g., one to build a map, another to use it) or the simultaneous management of two data structures (e.g., a min-heap and a hash map for a problem like **Top K Frequent Elements (LeetCode #347)**).
2.  **Conditional Logic and State Transitions:** The core challenge shifts from "find the maximum" to "find the maximum _when_ this condition flips." You need to track a changing condition (e.g., have we used our one allowed deletion? Are we inside a valid transaction window?). This often involves a `state` variable or a more complex loop condition.
3.  **Recognizing the "Trick":** Easy problems are usually direct applications. Medium problems have a non-obvious insight or transformation. For example, a problem about rotating a matrix might _actually_ be solved by transposing and then reversing rows. The skill is to quickly map the problem statement to a known core concept (like prefix sums or two-pointers) after a minute or two of exploration.

## Specific Patterns for Medium

Beyond the general traversal template, watch for these two patterns:

**1. In-Place Array Reorganization (Two-Pointer Variant):**
Problems like moving zeroes, removing duplicates in-place, or partitioning an array around a pivot use this. You maintain a "write" pointer that tracks the position of the next valid element and a "read" pointer that explores the array.

**2. BFS/DFS on Implicit Graphs:**
Many matrix problems (e.g., number of islands, rotting oranges, shortest path in a binary maze) are graph traversal problems in disguise. The nodes are cells, and edges are the four directional moves. Recognizing this allows you to apply standard BFS (for shortest path) or DFS (for connected components) immediately.

## Practice Strategy

Don't just solve the 103 Medium problems randomly. Practice with intent:

1.  **Pattern-First, Not Difficulty-First:** Group problems by the pattern (e.g., "Sliding Window," "Matrix as Graph"). Solve 3-4 from the same pattern in one sitting to burn the template into your muscle memory.
2.  **Strict 25-Minute Timer:** For each problem, set a timer. Spend the first 5 minutes understanding and brainstorming, 15 minutes coding, and 5 minutes testing and discussing complexity. If you can't solve it, study the solution _thoroughly_, then re-implement it from memory the next day.
3.  **Recommended Starting Order:** Begin with high-frequency patterns:
    - Modified Traversal / Prefix Sum with Hash Map (LeetCode #560, #525, #325)
    - Two-Pointer In-Place (LeetCode #283, #75, #26)
    - Matrix BFS (LeetCode #200, #994, #542)
    - Then move to less frequent but important ones like Modified Binary Search or Greedy Scheduling.

Aim for **2-3 Medium problems per day** with deep review, rather than 10 with shallow understanding. Your goal is to reduce the time between reading the problem and identifying the core pattern from 10 minutes to 2 minutes.

[Practice Medium TCS questions](/company/tcs/medium)
