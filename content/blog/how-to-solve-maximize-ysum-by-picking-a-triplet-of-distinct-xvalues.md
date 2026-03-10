---
title: "How to Solve Maximize Y‑Sum by Picking a Triplet of Distinct X‑Values — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Y‑Sum by Picking a Triplet of Distinct X‑Values. Medium difficulty, 63.2% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting, Heap (Priority Queue)."
date: "2029-04-19"
category: "dsa-patterns"
tags:
  [
    "maximize-ysum-by-picking-a-triplet-of-distinct-xvalues",
    "array",
    "hash-table",
    "greedy",
    "medium",
  ]
---

# How to Solve Maximize Y‑Sum by Picking a Triplet of Distinct X‑Values

You are given two arrays `x` and `y` of length `n`. You must pick three distinct indices where all three corresponding `x` values are different from each other, and you want to maximize the sum of their `y` values. The challenge is that you cannot simply pick the three largest `y` values—they might share the same `x` value, which violates the constraint. This problem tests your ability to combine greedy selection with careful tracking of multiple categories.

## Visual Walkthrough

Let’s walk through a concrete example to build intuition:

```
x = [1, 1, 2, 2, 3, 3]
y = [10, 20, 30, 40, 50, 60]
```

We need three indices with different `x` values. The largest `y` values are 60, 50, and 40, but notice:

- 60 has `x = 3`
- 50 has `x = 3` (same as 60!)
- 40 has `x = 2`

We can't use both 60 and 50 because they share `x = 3`. So we need to consider alternatives.

Let's think systematically:

1. Group by `x` value:
   - `x = 1`: [10, 20]
   - `x = 2`: [30, 40]
   - `x = 3`: [50, 60]

2. For each group, we only care about the top few largest `y` values since we can pick at most one from each group. Actually, we might need up to the top 3 from each group because we could pick the largest from three different groups, or we might need the second largest if the largest from another group conflicts.

3. The optimal solution will be one of these combinations:
   - Pick the largest from three different groups
   - Pick the largest from two groups and the second largest from the third
   - Pick the largest from one group and the second largest from two others

Why? Because if we ever pick a third or lower value from a group when a higher value exists in that same group, we could improve our sum by swapping to the higher value (as long as it doesn't create a conflict with the other picks).

So for our example:

- Top values: `x=1:20`, `x=2:40`, `x=3:60` → sum = 120
- What if we try `x=1:20`, `x=2:40`, `x=3:50`? Sum = 110 (worse)
- What about `x=1:20`, `x=2:30`, `x=3:60`? Sum = 110 (worse)

The best is clearly 20 + 40 + 60 = 120.

Now consider a trickier case:

```
x = [1, 1, 1, 2, 2, 3]
y = [100, 90, 80, 95, 85, 99]
```

Grouped:

- `x=1`: [100, 90, 80]
- `x=2`: [95, 85]
- `x=3`: [99]

Possible combinations:

- 100 (x=1) + 95 (x=2) + 99 (x=3) = 294
- 90 (x=1) + 95 (x=2) + 99 (x=3) = 284 (worse)
- 100 (x=1) + 85 (x=2) + 99 (x=3) = 284 (worse)

The optimal is 294. Notice we needed to check multiple combinations because simply taking the top 3 overall y-values (100, 99, 95) would have worked here since they all have different x values.

## Brute Force Approach

The brute force solution tries all possible triplets of indices and checks if their x values are all different:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def brute_force(x, y):
    n = len(x)
    max_sum = -float('inf')

    # Try all possible triplets
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                # Check if all x values are different
                if x[i] != x[j] and x[j] != x[k] and x[i] != x[k]:
                    current_sum = y[i] + y[j] + y[k]
                    max_sum = max(max_sum, current_sum)

    return max_sum if max_sum != -float('inf') else 0
```

```javascript
// Time: O(n³) | Space: O(1)
function bruteForce(x, y) {
  const n = x.length;
  let maxSum = -Infinity;

  // Try all possible triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        // Check if all x values are different
        if (x[i] !== x[j] && x[j] !== x[k] && x[i] !== x[k]) {
          const currentSum = y[i] + y[j] + y[k];
          maxSum = Math.max(maxSum, currentSum);
        }
      }
    }
  }

  return maxSum !== -Infinity ? maxSum : 0;
}
```

```java
// Time: O(n³) | Space: O(1)
public int bruteForce(int[] x, int[] y) {
    int n = x.length;
    int maxSum = Integer.MIN_VALUE;

    // Try all possible triplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                // Check if all x values are different
                if (x[i] != x[j] && x[j] != x[k] && x[i] != x[k]) {
                    int currentSum = y[i] + y[j] + y[k];
                    maxSum = Math.max(maxSum, currentSum);
                }
            }
        }
    }

    return maxSum != Integer.MIN_VALUE ? maxSum : 0;
}
```

</div>

**Why this is insufficient:** With n up to 10^5 in typical constraints, O(n³) is far too slow. We need something closer to O(n log n) or O(n).

## Optimized Approach

The key insight is that we only need to consider at most the **top 3 y-values for each distinct x-value**. Here's why:

1. We can only pick at most one value from each x-group (since all x values in our triplet must be different).
2. If we have more than 3 values in a group, we would never pick the 4th or lower when forming a triplet because:
   - We can only pick one from that group
   - If we pick a lower value when a higher one exists in the same group, we could always improve our sum by swapping to the higher value (as long as it doesn't conflict with picks from other groups, which it won't since it's from the same group)

Once we have the top 3 values for each x-group, we need to consider all combinations of picking one value from three different groups. However, there's a more efficient way: we can collect all candidate values (keeping track of which x-group they come from) and try to pick the three largest with different x values.

The algorithm:

1. Group y-values by their corresponding x-value
2. For each group, keep only the top 3 values (or fewer if the group has fewer)
3. Collect all these candidate values into a list
4. Sort the candidates by y-value in descending order
5. Try to pick the first three candidates with different x-values
6. But wait—what if the three largest by y-value all have different x-values? That's our answer! If not, we need to consider alternatives...

Actually, we need to be more careful. The optimal triplet might not be simply the three largest y-values with different x. Consider:

- Group A: [100, 99]
- Group B: [98]
- Group C: [1]

The three largest with different x are 100(A), 98(B), 1(C) = 199
But what about 99(A), 98(B), and we need a third from another group... we only have C with 1, so 99+98+1=198 (worse)

But consider:

- Group A: [100, 90]
- Group B: [95, 85]
- Group C: [99, 80]

Three largest with different x: 100(A), 99(C), 95(B) = 294
But 100(A), 99(C), 90(A) is invalid (same x)
And 100(A), 95(B), 90(A) is invalid

Actually, the algorithm should be:

1. Get top 3 values for each x-group
2. Generate all possible triplets from these candidates where all x-values are different
3. Take the maximum sum

But how many candidates? If there are m distinct x-values, we have at most 3m candidates. Generating all triplets would be O((3m)³) which could be large if m is large.

Better approach: Since we only need the maximum sum, we can:

1. Get top 3 values for each x-group
2. Flatten into a list of (y-value, x-value) pairs
3. Sort by y-value descending
4. Consider the first k candidates (where k is small, say 10 or 15) because beyond that, the y-values are too small to beat the best triplet from the top candidates

Why does this work? The optimal triplet must come from the highest y-values overall. If we look at the top L candidates (where L is reasonably small), we're guaranteed to find the optimal triplet there. A safe choice is L = 10 because in the worst case, we might need to skip some of the very top values if they share x-values.

## Optimal Solution

Here's the complete implementation:

<div class="code-group">

```python
# Time: O(n + m log m) where m is number of distinct x-values
# Space: O(n) for storing groups
def maximize_sum(x, y):
    from collections import defaultdict
    import heapq

    # Step 1: Group y-values by x-value, keeping top 3 for each group
    groups = defaultdict(list)

    for xi, yi in zip(x, y):
        # Use min-heap to keep top 3 (we store negative values for min-heap as max-heap)
        heapq.heappush(groups[xi], yi)
        if len(groups[xi]) > 3:
            heapq.heappop(groups[xi])  # Remove smallest (since it's a min-heap)

    # Step 2: Collect all candidates with their x-value
    candidates = []
    for xi, ys in groups.items():
        for yi in ys:
            candidates.append((yi, xi))

    # Step 3: Sort candidates by y-value in descending order
    candidates.sort(reverse=True)

    # Step 4: Try to find the best triplet
    max_sum = 0
    n_candidates = len(candidates)

    # We only need to check a limited number of candidates
    # The optimal triplet will be among the top candidates
    for i in range(min(n_candidates, 10)):  # Check first 10 candidates
        for j in range(i + 1, min(n_candidates, 10)):
            if candidates[i][1] == candidates[j][1]:
                continue  # Same x-value, skip
            for k in range(j + 1, min(n_candidates, 10)):
                if (candidates[k][1] == candidates[i][1] or
                    candidates[k][1] == candidates[j][1]):
                    continue  # x-value not distinct

                current_sum = candidates[i][0] + candidates[j][0] + candidates[k][0]
                max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n + m log m) where m is number of distinct x-values
// Space: O(n) for storing groups
function maximizeSum(x, y) {
  // Step 1: Group y-values by x-value, keeping top 3 for each group
  const groups = new Map();

  for (let i = 0; i < x.length; i++) {
    const xi = x[i];
    const yi = y[i];

    if (!groups.has(xi)) {
      groups.set(xi, []);
    }

    const heap = groups.get(xi);
    heap.push(yi);
    heap.sort((a, b) => a - b); // Keep sorted ascending

    // Keep only top 3 (largest) by removing smallest if more than 3
    if (heap.length > 3) {
      heap.shift(); // Remove smallest (first element in ascending order)
    }
  }

  // Step 2: Collect all candidates with their x-value
  const candidates = [];
  for (const [xi, ys] of groups) {
    for (const yi of ys) {
      candidates.push([yi, xi]);
    }
  }

  // Step 3: Sort candidates by y-value in descending order
  candidates.sort((a, b) => b[0] - a[0]);

  // Step 4: Try to find the best triplet
  let maxSum = 0;
  const nCandidates = candidates.length;

  // We only need to check a limited number of candidates
  // The optimal triplet will be among the top candidates
  const limit = Math.min(nCandidates, 10);
  for (let i = 0; i < limit; i++) {
    for (let j = i + 1; j < limit; j++) {
      if (candidates[i][1] === candidates[j][1]) {
        continue; // Same x-value, skip
      }
      for (let k = j + 1; k < limit; k++) {
        if (candidates[k][1] === candidates[i][1] || candidates[k][1] === candidates[j][1]) {
          continue; // x-value not distinct
        }

        const currentSum = candidates[i][0] + candidates[j][0] + candidates[k][0];
        maxSum = Math.max(maxSum, currentSum);
      }
    }
  }

  return maxSum;
}
```

```java
// Time: O(n + m log m) where m is number of distinct x-values
// Space: O(n) for storing groups
import java.util.*;

public int maximizeSum(int[] x, int[] y) {
    // Step 1: Group y-values by x-value, keeping top 3 for each group
    Map<Integer, PriorityQueue<Integer>> groups = new HashMap<>();

    for (int i = 0; i < x.length; i++) {
        int xi = x[i];
        int yi = y[i];

        groups.putIfAbsent(xi, new PriorityQueue<>()); // Min-heap

        PriorityQueue<Integer> heap = groups.get(xi);
        heap.offer(yi);

        // Keep only top 3 (largest) by removing smallest if more than 3
        if (heap.size() > 3) {
            heap.poll(); // Remove smallest (min-heap)
        }
    }

    // Step 2: Collect all candidates with their x-value
    List<int[]> candidates = new ArrayList<>();
    for (Map.Entry<Integer, PriorityQueue<Integer>> entry : groups.entrySet()) {
        int xi = entry.getKey();
        PriorityQueue<Integer> heap = entry.getValue();

        // Convert min-heap to list (it's already just the top values)
        List<Integer> values = new ArrayList<>(heap);
        for (int yi : values) {
            candidates.add(new int[]{yi, xi});
        }
    }

    // Step 3: Sort candidates by y-value in descending order
    candidates.sort((a, b) -> Integer.compare(b[0], a[0]));

    // Step 4: Try to find the best triplet
    int maxSum = 0;
    int nCandidates = candidates.size();

    // We only need to check a limited number of candidates
    // The optimal triplet will be among the top candidates
    int limit = Math.min(nCandidates, 10);
    for (int i = 0; i < limit; i++) {
        for (int j = i + 1; j < limit; j++) {
            if (candidates.get(i)[1] == candidates.get(j)[1]) {
                continue; // Same x-value, skip
            }
            for (int k = j + 1; k < limit; k++) {
                if (candidates.get(k)[1] == candidates.get(i)[1] ||
                    candidates.get(k)[1] == candidates.get(j)[1]) {
                    continue; // x-value not distinct
                }

                int currentSum = candidates.get(i)[0] + candidates.get(j)[0] + candidates.get(k)[0];
                maxSum = Math.max(maxSum, currentSum);
            }
        }
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m log m) where n is the length of the arrays and m is the number of distinct x-values.

- Grouping values takes O(n)
- Each heap operation (push/pop) is O(log 3) = O(1) since we limit heap size to 3
- Sorting candidates takes O(m log m) where m ≤ n
- The triple nested loop runs O(10³) = O(1) constant time since we limit to top 10 candidates

**Space Complexity:** O(n) for storing the groups and candidates.

## Common Mistakes

1. **Only checking the top 3 overall y-values:** Candidates might pick the three largest y-values without checking if their x-values are distinct. This fails when the top y-values share x-values.

2. **Not limiting candidates per group:** Keeping all y-values for each x-group wastes time and space. We only need the top 3 from each group since we can pick at most one from each group.

3. **Checking too many combinations:** After getting candidates, trying all O(m³) triplets is inefficient. The optimal solution will be among the top y-values, so we can limit our search to the first 10-15 candidates.

4. **Forgetting to handle the case with fewer than 3 distinct x-values:** If there are fewer than 3 distinct x-values, no valid triplet exists. Our solution handles this by returning 0 when no valid triplet is found.

## When You'll See This Pattern

This problem combines **grouping with greedy selection** and **top-k element tracking**—patterns that appear in many coding problems:

1. **Top K Frequent Elements (LeetCode 347)** - Similar grouping and tracking top k elements
2. **Maximum Sum of 3 Non-Overlapping Subarrays** - Also requires selecting non-overlapping segments to maximize sum
3. **Largest Values From Labels** - Constrained selection where items have categories (labels) and you can only pick limited items per category

The core technique of "group then select top k from each group" appears whenever you need to make selections subject to category constraints.

## Key Takeaways

1. **When selection is constrained by categories**, group items by category first, then apply selection logic within each group.

2. **For "pick k items with constraints" problems**, you often only need to consider the top few items from each group rather than all items.

3. **Greedy approaches often work** when combined with sorting—if the optimal solution involves the largest values, start with the largest candidates and search downward.

Related problems: [Maximum Sum of 3 Non-Overlapping Subarrays](/problem/maximum-sum-of-3-non-overlapping-subarrays), [Largest Values From Labels](/problem/largest-values-from-labels)
