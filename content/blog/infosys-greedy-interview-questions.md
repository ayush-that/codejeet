---
title: "Greedy Questions at Infosys: What to Expect"
description: "Prepare for Greedy interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-12-20"
category: "dsa-patterns"
tags: ["infosys", "greedy", "interview prep"]
---

Greedy algorithms are a practical subset of Infosys's technical interview problem set. With 18 out of their 158 cataloged questions being greedy-based, it represents a significant portion you must be ready for. These questions test your ability to identify optimal local choices that lead to a globally optimal solution, a skill valued for developing efficient, real-world logic in software systems. Mastering them demonstrates strong problem-solving intuition.

## What to Expect — Types of Problems

Infosys's greedy questions typically fall into a few predictable categories. You will not encounter overly complex theoretical problems; instead, expect applied scenarios.

- **Activity Selection & Scheduling:** The classic problem type. You'll be given tasks with start and end times and asked to find the maximum number of non-overlapping activities. Variations include meeting rooms or job scheduling.
- **Coin Change (Canonical Systems):** Given an infinite supply of coins of certain denominations, find the minimum number of coins to make a specific amount. _Crucially, this only applies where the greedy approach is valid_, such as with standard Indian currency (1, 2, 5, 10, etc.). You must recognize when the coin system allows for a greedy choice.
- **Fractional Knapsack:** You have a bag with a weight capacity and items with values and weights. You can take fractions of items. The goal is to maximize total value by greedily picking items with the highest value-to-weight ratio.
- **Minimum Sum or Cost Problems:** These often involve array manipulation, like connecting ropes with minimum cost or minimizing the sum of absolute differences.

The key is to quickly identify the problem pattern and the correct greedy property (sort by end time, sort by ratio, etc.).

## How to Prepare — Study Tips with One Code Example

Start by solidifying the core greedy patterns. Do not memorize code—memorize the _decision rule_. For each problem type, ask: "What is the single best thing I can do right now?"

1.  **Prove the Greedy Choice:** Before coding, briefly justify why making the locally optimal choice is safe. This is often the interview discussion point.
2.  **Sorting is Key:** Most greedy solutions begin with sorting the input data (by end time, ratio, etc.). This is the most common preprocessing step.
3.  **Practice Edge Cases:** What if the array is empty? What if two activities end at the same time? Test these.

Consider the **Activity Selection** problem, the most frequent pattern. The greedy choice is to always pick the next activity that finishes the earliest and does not conflict.

<div class="code-group">

```python
def max_activities(activities):
    # activities: list of [start, end] pairs
    # Sort activities by their finish time
    activities.sort(key=lambda x: x[1])

    count = 1
    last_end = activities[0][1]

    for i in range(1, len(activities)):
        start, end = activities[i]
        if start >= last_end:
            count += 1
            last_end = end

    return count

# Example
print(max_activities([[1, 3], [2, 5], [4, 6]])) # Output: 2
```

```javascript
function maxActivities(activities) {
  // activities: array of [start, end] pairs
  // Sort by finish time
  activities.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let lastEnd = activities[0][1];

  for (let i = 1; i < activities.length; i++) {
    const [start, end] = activities[i];
    if (start >= lastEnd) {
      count++;
      lastEnd = end;
    }
  }
  return count;
}

// Example
console.log(
  maxActivities([
    [1, 3],
    [2, 5],
    [4, 6],
  ])
); // Output: 2
```

```java
import java.util.Arrays;
import java.util.Comparator;

public class ActivitySelection {
    public static int maxActivities(int[][] activities) {
        // Sort by finish time
        Arrays.sort(activities, Comparator.comparingInt(a -> a[1]));

        int count = 1;
        int lastEnd = activities[0][1];

        for (int i = 1; i < activities.length; i++) {
            int start = activities[i][0];
            int end = activities[i][1];
            if (start >= lastEnd) {
                count++;
                lastEnd = end;
            }
        }
        return count;
    }

    // Example
    public static void main(String[] args) {
        int[][] acts = {{1, 3}, {2, 5}, {4, 6}};
        System.out.println(maxActivities(acts)); // Output: 2
    }
}
```

</div>

## Recommended Practice Order

Tackle problems in this order to build understanding progressively:

1.  **Activity Selection** – The fundamental problem.
2.  **Fractional Knapsack** – Introduces sorting by ratio.
3.  **Coin Change (Canonical)** – Understand when greedy fails.
4.  **Minimum Sum of Absolute Differences** – Array-based greedy.
5.  **Minimum Cost to Connect Ropes** – Uses a min-heap (priority queue).
6.  **Job Sequencing with Deadlines** – A more advanced scheduling variant.

After mastering these core patterns, move to Infosys's specific company-tagged questions. This ensures you understand the concept before applying it to their format.

[Practice Greedy at Infosys](/company/infosys/greedy)
