---
title: "How to Solve Maximize Points After Choosing K Tasks — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Points After Choosing K Tasks. Medium difficulty, 59.9% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2030-02-13"
category: "dsa-patterns"
tags: ["maximize-points-after-choosing-k-tasks", "array", "greedy", "sorting", "medium"]
---

# How to Solve "Maximize Points After Choosing K Tasks"

You're given two arrays representing points you can earn for each task using two different techniques. You must choose exactly `k` tasks to complete, and for each chosen task, you can pick which technique to use. The goal is to maximize your total points. What makes this problem interesting is that you're not just picking the highest values from either array—you need to consider the opportunity cost of not using the other technique for each task.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
technique1 = [5, 4, 3, 2, 1]
technique2 = [1, 2, 3, 4, 5]
k = 3
```

We need to choose 3 tasks and decide which technique to use for each. Let's think through the possibilities:

1. **First approach**: Look at the differences between techniques. For each task `i`, the benefit of using technique1 over technique2 is `technique1[i] - technique2[i]`:
   - Task 0: 5 - 1 = 4 (big advantage for technique1)
   - Task 1: 4 - 2 = 2 (advantage for technique1)
   - Task 2: 3 - 3 = 0 (no difference)
   - Task 3: 2 - 4 = -2 (advantage for technique2)
   - Task 4: 1 - 5 = -4 (big advantage for technique2)

2. **Key insight**: We want to pick tasks where one technique gives us significantly more points than the other. But we must pick exactly `k` tasks, so we can't just take all tasks with positive differences.

3. **Better approach**: Sort tasks by the absolute value of their difference `|technique1[i] - technique2[i]|` in descending order. This prioritizes tasks where one technique is clearly better:
   - Task 0: |4| = 4
   - Task 4: |-4| = 4
   - Task 1: |2| = 2
   - Task 3: |-2| = 2
   - Task 2: |0| = 0

4. **Process in order**: Take the first `k` tasks from this sorted list, choosing the higher-valued technique for each:
   - Task 0: choose technique1 (5 points)
   - Task 4: choose technique2 (5 points)
   - Task 1: choose technique1 (4 points)
     Total: 5 + 5 + 4 = 14 points

This gives us the optimal solution! But wait—what if we need to pick exactly `k` tasks and some tasks have negative differences? Let's formalize this approach.

## Brute Force Approach

A naive solution would consider all possible combinations of `k` tasks from `n` tasks, and for each combination, try all possible technique choices. For each chosen task, we have 2 choices (technique1 or technique2), so for `k` tasks, there are `2^k` technique assignments. The number of combinations is `C(n, k)`, making the total complexity `O(C(n, k) * 2^k)`, which is exponential and impractical for even moderate `n`.

Even a slightly better brute force would be to try all subsets of size `k` and always pick the better technique for each task in the subset. This is `O(C(n, k))`, which is still too slow when `n` is large (e.g., `n=1000, k=500` would be astronomical).

The brute force fails because it doesn't leverage the structure of the problem—we can make independent decisions for each task once we decide which tasks to include.

## Optimized Approach

The key insight is that we can think of this as: we start by taking the maximum of `technique1[i]` and `technique2[i]` for all tasks, then we need to "pay a penalty" for the `n-k` tasks we don't choose. Alternatively, we can think: we want to pick `k` tasks where the gain from choosing the better technique is maximized.

Here's the step-by-step reasoning:

1. **Calculate differences**: For each task `i`, compute `diff[i] = technique1[i] - technique2[i]`. This tells us how much better technique1 is than technique2 for that task (negative means technique2 is better).

2. **Sort by absolute difference**: Sort tasks by `|diff[i]|` in descending order. Tasks with large absolute differences are where one technique is clearly superior—these give us the biggest "bang for our buck" when we choose them.

3. **Greedy selection**: Process tasks in this sorted order. For the first `k` tasks:
   - If `diff[i] >= 0`, choose technique1 (add `technique1[i]` to total)
   - If `diff[i] < 0`, choose technique2 (add `technique2[i]` to total)

   For the remaining `n-k` tasks, we must choose the _other_ technique (the worse one for that task).

4. **Why this works**: By processing tasks with the largest absolute differences first, we ensure we get the biggest gains for our `k` choices. The remaining tasks force us to take the smaller value, but since they have smaller absolute differences, the penalty is minimized.

5. **Alternative viewpoint**: We're effectively saying: "If I could choose the better technique for all tasks, I'd get `sum(max(technique1[i], technique2[i]))`. But I can only choose `k` tasks to get their better technique—for the other `n-k` tasks, I must take the worse technique. So my total is the ideal sum minus the penalties from the `n-k` tasks where I take the worse technique. I want to minimize those penalties, which means picking tasks with the smallest penalties (smallest absolute differences) to be in the `n-k` group."

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maximizePoints(technique1, technique2, k):
    n = len(technique1)

    # Step 1: Create a list of tuples (absolute_difference, index)
    # We'll sort by absolute difference in descending order
    tasks = []
    for i in range(n):
        diff = technique1[i] - technique2[i]
        # Store absolute difference and the original index
        tasks.append((abs(diff), i))

    # Step 2: Sort by absolute difference in descending order
    # This puts tasks with the biggest difference (biggest gain/loss) first
    tasks.sort(reverse=True, key=lambda x: x[0])

    total_points = 0

    # Step 3: Process first k tasks - we get to choose the better technique
    for i in range(k):
        _, idx = tasks[i]
        # Choose the technique with higher value for this task
        total_points += max(technique1[idx], technique2[idx])

    # Step 4: Process remaining n-k tasks - we must take the worse technique
    for i in range(k, n):
        _, idx = tasks[i]
        # Take the technique with lower value for this task
        total_points += min(technique1[idx], technique2[idx])

    return total_points
```

```javascript
// Time: O(n log n) | Space: O(n)
function maximizePoints(technique1, technique2, k) {
  const n = technique1.length;

  // Step 1: Create an array of objects with absolute difference and index
  const tasks = [];
  for (let i = 0; i < n; i++) {
    const diff = technique1[i] - technique2[i];
    tasks.push({
      absDiff: Math.abs(diff),
      index: i,
    });
  }

  // Step 2: Sort by absolute difference in descending order
  // Tasks with larger differences come first
  tasks.sort((a, b) => b.absDiff - a.absDiff);

  let totalPoints = 0;

  // Step 3: Process first k tasks - choose the better technique
  for (let i = 0; i < k; i++) {
    const idx = tasks[i].index;
    totalPoints += Math.max(technique1[idx], technique2[idx]);
  }

  // Step 4: Process remaining n-k tasks - must take the worse technique
  for (let i = k; i < n; i++) {
    const idx = tasks[i].index;
    totalPoints += Math.min(technique1[idx], technique2[idx]);
  }

  return totalPoints;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

public class Solution {
    public int maximizePoints(int[] technique1, int[] technique2, int k) {
        int n = technique1.length;

        // Step 1: Create a list of tasks with absolute difference and index
        List<int[]> tasks = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int diff = technique1[i] - technique2[i];
            int absDiff = Math.abs(diff);
            tasks.add(new int[]{absDiff, i});
        }

        // Step 2: Sort by absolute difference in descending order
        // Using custom comparator to sort by first element (absDiff)
        tasks.sort((a, b) -> Integer.compare(b[0], a[0]));

        int totalPoints = 0;

        // Step 3: Process first k tasks - choose the better technique
        for (int i = 0; i < k; i++) {
            int idx = tasks.get(i)[1];
            totalPoints += Math.max(technique1[idx], technique2[idx]);
        }

        // Step 4: Process remaining n-k tasks - must take the worse technique
        for (int i = k; i < n; i++) {
            int idx = tasks.get(i)[1];
            totalPoints += Math.min(technique1[idx], technique2[idx]);
        }

        return totalPoints;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(n log n)`

- Creating the list of tasks with differences: `O(n)`
- Sorting the tasks by absolute difference: `O(n log n)` (dominant term)
- Processing the sorted tasks: `O(n)`
- Total: `O(n + n log n + n) = O(n log n)`

**Space Complexity**: `O(n)`

- We store a list of `n` tasks, each containing the absolute difference and index
- The sorting algorithm may use `O(log n)` to `O(n)` additional space depending on implementation, but we count the `O(n)` for our data structure as the dominant term

## Common Mistakes

1. **Sorting by raw difference instead of absolute difference**: Candidates sometimes sort by `technique1[i] - technique2[i]` (which can be negative) instead of the absolute value. This fails because a large negative difference (e.g., -100) is just as valuable as a large positive difference (+100)—both represent tasks where one technique is much better than the other.

2. **Forgetting to handle the case when k = 0 or k = n**: When `k = 0`, you must take the worse technique for all tasks. When `k = n`, you get to choose the better technique for all tasks. The solution handles these naturally, but some candidates write special cases that introduce bugs.

3. **Using the wrong index after sorting**: After sorting, you must use the original index to access `technique1` and `technique2` values. A common mistake is to use the sorted position instead of the stored original index.

4. **Not considering that n could be less than k**: While the problem constraints typically ensure `k ≤ n`, in an interview you should mention this edge case. If `k > n`, you can only choose at most `n` tasks, so you'd adjust `k = min(k, n)`.

## When You'll See This Pattern

This "choose k items with maximum gain" pattern appears in several problems:

1. **Maximum Performance of a Team (LeetCode 1383)**: Similar structure where you choose k engineers to maximize performance, considering both speed and efficiency. You sort by one attribute and use a min-heap to track the other.

2. **Maximum Sum Obtained of Any Permutation (LeetCode 1589)**: You want to place the largest numbers in the most frequently requested positions. Sort both the numbers and the frequency counts.

3. **Two City Scheduling (LeetCode 1029)**: You need to send n people to two cities, with costs for each city. You sort by the difference in costs and send the first n/2 to one city and the rest to the other.

The common theme is: when you need to make binary choices for items and want to maximize/minimize a total, consider sorting by the "opportunity cost" or "difference" between choices.

## Key Takeaways

1. **Greedy with sorting by difference**: When faced with binary choices where you must pick exactly k items to receive the "better" option, sort by the absolute difference between options. This ensures you allocate your k picks to items where the choice matters most.

2. **Think in terms of penalties**: Instead of thinking "which k items get the better treatment," think "all items ideally get the better treatment, but n-k items must get the worse treatment—minimize the total penalty." This reframing often reveals the sorting solution.

3. **Preserve original indices**: When sorting based on computed values, always store and use the original indices to access the actual data. This is a common pattern in many sorting-based solutions.

[Practice this problem on CodeJeet](/problem/maximize-points-after-choosing-k-tasks)
