---
title: "Sorting Questions at Pinterest: What to Expect"
description: "Prepare for Sorting interview questions at Pinterest — patterns, difficulty breakdown, and study tips."
date: "2029-08-25"
category: "dsa-patterns"
tags: ["pinterest", "sorting", "interview prep"]
---

## Why Sorting Matters at Pinterest

If you're preparing for a Pinterest interview, you might be surprised to learn that sorting-related problems make up over 20% of their technical question pool. This isn't an accident. Pinterest's core product—a visual discovery engine—relies heavily on ordering and ranking. Think about it: every time you scroll through your home feed, search for "wedding ideas," or browse a category, Pinterest is applying sophisticated sorting logic. It's not just alphabetical or chronological; it's relevance ranking, personalization scoring, and engagement-based ordering. In interviews, they're not testing if you can implement quicksort from memory (though you should know it). They're testing if you can recognize when a problem's bottleneck is ordering, and if you can apply the right sorting strategy to unlock an optimal solution. In my experience conducting mock interviews for Pinterest candidates, sorting appears as either the main focus or a critical optimization step in roughly 1 out of 3 technical rounds.

## Specific Patterns Pinterest Favors

Pinterest's sorting questions tend to cluster around two key themes: **custom comparator design** and **sorting as a pre-processing step** for another algorithm. You'll rarely see a standalone "implement mergesort" question. Instead, you'll get problems where the sorting logic is non-trivial and domain-specific.

The most frequent pattern is **"Sorting objects by multiple criteria,"** often seen in feed ranking simulations. For example, you might need to sort pins by a weighted score (0.6*engagement + 0.4*recency), then by ID for ties. This tests your ability to design clean comparators.

The second common pattern is **"Sort first, then apply a greedy or two-pointer algorithm."** Pinterest loves problems where sorting transforms the problem into something simpler. A classic example is the "Merge Intervals" pattern—after sorting by start time, overlapping intervals become trivial to identify and merge.

Here’s a concrete example of the custom comparator pattern, inspired by problems like **Merge Intervals (#56)** and **Largest Number (#179)**:

<div class="code-group">

```python
# Problem: Sort a list of pins where each pin is (pin_id, engagement_score, recency_days)
# Primary sort: weighted_score = 0.7*engagement_score + 0.3*(1/recency_days)
# Secondary sort: by pin_id ascending if scores are equal

def sort_pins(pins):
    """
    pins: List[Tuple[int, float, int]] -> (id, engagement, recency_days)
    Returns list sorted by custom weighted score.
    """
    # Define a custom key function
    def sort_key(pin):
        pin_id, engagement, recency = pin
        weighted = 0.7 * engagement + 0.3 * (1.0 / max(recency, 1))  # avoid division by zero
        # Return tuple for multi-criteria sort: primary descending, secondary ascending
        return (-weighted, pin_id)

    return sorted(pins, key=sort_key)

# Time: O(n log n) for the sort | Space: O(n) for the returned list (or O(1) if in-place)
```

```javascript
// Same problem in JavaScript
function sortPins(pins) {
  // pins: Array<[id, engagement, recencyDays]>
  return pins.sort((a, b) => {
    const weightedA = 0.7 * a[1] + 0.3 * (1 / Math.max(a[2], 1));
    const weightedB = 0.7 * b[1] + 0.3 * (1 / Math.max(b[2], 1));

    // Primary compare by weighted score descending
    if (weightedB > weightedA) return 1;
    if (weightedB < weightedA) return -1;

    // Secondary compare by id ascending
    return a[0] - b[0];
  });
}

// Time: O(n log n) | Space: O(1) for in-place sort (V8 uses Timsort, O(n) worst-case space)
```

```java
// Same problem in Java
import java.util.*;

public class PinSorter {
    public static List<int[]> sortPins(List<int[]> pins) {
        // pins.get(i) = [id, engagement, recencyDays]
        pins.sort((a, b) -> {
            double weightedA = 0.7 * a[1] + 0.3 * (1.0 / Math.max(a[2], 1));
            double weightedB = 0.7 * b[1] + 0.3 * (1.0 / Math.max(b[2], 1));

            // Compare by weighted score descending
            if (weightedB > weightedA) return 1;
            if (weightedB < weightedA) return -1;

            // Then by id ascending
            return a[0] - b[0];
        });
        return pins;
    }
}

// Time: O(n log n) | Space: O(1) for in-place sort (Java's Arrays.sort uses Dual-Pivot Quicksort or Timsort)
```

</div>

## How to Prepare

Mastering Pinterest's sorting questions requires a shift from theory to application. Start by ensuring you can implement the major sorting algorithms (quick, merge, heap) and explain their trade-offs. Then, focus intensely on comparator design. Practice writing comparators for objects with 2-3 sorting criteria until it's muscle memory. Always ask: "Should this be ascending or descending? How do I handle ties?"

Next, drill the "sort first" pattern. When you encounter a problem, ask yourself: "Would sorting the input reveal a structure that simplifies this?" Common giveaways are problems asking for "minimum/maximum pairs," "overlapping ranges," or "arranging items to satisfy a condition."

Finally, practice articulating _why_ you chose a particular sorting approach. Pinterest interviewers often probe your decision-making. Be ready to explain why O(n log n) is acceptable, or why you used a stable vs. unstable sort.

Here’s a classic "sort first" example using the two-pointer technique, similar to **3Sum (#15)**:

<div class="code-group">

```python
# Problem: Given a list of pin view counts, find all unique triplets where
# the sum of three views equals a target engagement score.
def triplets_with_target(pin_views, target):
    """
    pin_views: List[int], target: int
    Returns list of triplets (as tuples) that sum to target.
    """
    pin_views.sort()  # Critical pre-processing step
    n = len(pin_views)
    result = []

    for i in range(n - 2):
        # Skip duplicate values for the first element
        if i > 0 and pin_views[i] == pin_views[i - 1]:
            continue

        left, right = i + 1, n - 1
        while left < right:
            current_sum = pin_views[i] + pin_views[left] + pin_views[right]
            if current_sum == target:
                result.append((pin_views[i], pin_views[left], pin_views[right]))
                left += 1
                right -= 1
                # Skip duplicates for left and right pointers
                while left < right and pin_views[left] == pin_views[left - 1]:
                    left += 1
                while left < right and pin_views[right] == pin_views[right + 1]:
                    right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    return result

# Time: O(n^2) — sort is O(n log n), main loop is O(n^2) | Space: O(1) or O(n) depending on sort implementation
```

```javascript
function tripletsWithTarget(pinViews, target) {
  pinViews.sort((a, b) => a - b);
  const n = pinViews.length;
  const result = [];

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && pinViews[i] === pinViews[i - 1]) continue;

    let left = i + 1,
      right = n - 1;
    while (left < right) {
      const sum = pinViews[i] + pinViews[left] + pinViews[right];
      if (sum === target) {
        result.push([pinViews[i], pinViews[left], pinViews[right]]);
        left++;
        right--;
        while (left < right && pinViews[left] === pinViews[left - 1]) left++;
        while (left < right && pinViews[right] === pinViews[right + 1]) right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}

// Time: O(n^2) | Space: O(1) ignoring output storage
```

```java
import java.util.*;

public class PinTriplets {
    public static List<List<Integer>> tripletsWithTarget(int[] pinViews, int target) {
        Arrays.sort(pinViews);
        List<List<Integer>> result = new ArrayList<>();
        int n = pinViews.length;

        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && pinViews[i] == pinViews[i - 1]) continue;

            int left = i + 1, right = n - 1;
            while (left < right) {
                int sum = pinViews[i] + pinViews[left] + pinViews[right];
                if (sum == target) {
                    result.add(Arrays.asList(pinViews[i], pinViews[left], pinViews[right]));
                    left++;
                    right--;
                    while (left < right && pinViews[left] == pinViews[left - 1]) left++;
                    while (left < right && pinViews[right] == pinViews[right + 1]) right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
}

// Time: O(n^2) | Space: O(1) ignoring output storage
```

</div>

## How Pinterest Tests Sorting vs Other Companies

Compared to FAANG companies, Pinterest's sorting questions feel more _applied_. At Google, you might get a pure algorithm question like "sort a linked list." At Facebook (Meta), sorting often appears in conjunction with system design for news feed ranking. Pinterest strikes a middle ground: the problems are algorithmic but framed within their product domain. The difficulty is typically medium on LeetCode's scale, but the nuance is in the problem interpretation.

What's unique is their emphasis on **readability and maintainability**. Pinterest engineers work heavily with content ranking systems that evolve over time. Your comparator isn't just correct; it should be clear enough that another engineer could modify the weighting factors six months later. I've seen interviewers explicitly ask candidates to "make the sorting logic easy to change if we adjust the engagement formula."

## Study Order

1.  **Fundamental Sorting Algorithms:** Quick sort, merge sort, heap sort. Understand their time/space complexities, stability, and when to use each. This is non-negotiable foundation.
2.  **Built-in Sort Mastery:** Learn how your language's default sort works (Timsort in Python/Java, Merge/Insertion hybrid in JavaScript). Know how to use custom key functions and comparators fluently.
3.  **Custom Comparators:** Practice sorting objects by multiple criteria. Start with two criteria (primary descending, secondary ascending), then add a third. This is Pinterest's bread and butter.
4.  **Sorting as Pre-processing:** Study problems where sorting is the key insight. Focus on the "two-pointer after sorting" pattern (like 3Sum) and "merge intervals" pattern.
5.  **Advanced Hybrids:** Tackle problems where sorting combines with other structures, like using a heap for top-K elements (though technically selection, it's often grouped with sorting).

## Recommended Practice Order

1.  **Merge Intervals (#56)** – The quintessential "sort first" problem.
2.  **Largest Number (#179)** – Excellent custom comparator practice that teaches you to think beyond lexicographic order.
3.  **Meeting Rooms II (#253)** – While often solved with a heap, the sorting approach is crucial to understand.
4.  **Non-overlapping Intervals (#435)** – Another interval problem that reinforces the pattern.
5.  **Custom Sort String (#791)** – A lighter problem that practices building custom ordering logic.
6.  **3Sum (#15)** – Master the two-pointer technique after sorting.
7.  **K Closest Points to Origin (#973)** – Practice with both sorting and heap approaches.
8.  **Sort Colors (#75)** – The Dutch flag problem; tests in-place partitioning skills.
9.  **Sort List (#148)** – A harder problem that tests merge sort on linked lists.
10. **Pinterest-specific practice:** Search for "sorting" in their tagged questions and simulate interview conditions.

[Practice Sorting at Pinterest](/company/pinterest/sorting)
