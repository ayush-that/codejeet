---
title: "How to Solve IPO — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode IPO. Hard difficulty, 53.3% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2027-12-24"
category: "dsa-patterns"
tags: ["ipo", "array", "greedy", "sorting", "hard"]
---

# How to Solve IPO

You have an initial capital `w` and can complete at most `k` projects. Each project has a profit and a minimum capital requirement. You can only start a project if your current capital meets its requirement. After completing a project, you add its profit to your capital. The goal is to maximize your final capital after selecting up to `k` projects. The challenge is that you must repeatedly choose the most profitable project you can afford at each step, which requires efficiently tracking available projects as your capital grows.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose:

- `k = 2` (maximum projects)
- `w = 0` (initial capital)
- Profits: `[1, 2, 3]`
- Capital requirements: `[0, 1, 1]`

**Step 1:** Start with capital `w = 0`. Which projects can we afford? Only project 0 (requires 0 capital). We want the maximum profit among affordable projects, so we take project 0 with profit 1. New capital: `w = 0 + 1 = 1`.

**Step 2:** Now with `w = 1`, we can afford projects 1 and 2 (both require ≤1 capital). The maximum profit among these is 3 from project 2. Take project 2. New capital: `w = 1 + 3 = 4`.

We've completed `k = 2` projects, so we stop. Final capital is 4.

The key insight: At each step, we need to:

1. Find all projects we can afford with current capital
2. Choose the one with maximum profit
3. Add that profit to our capital
4. Repeat until we've done `k` projects or no more affordable projects exist

## Brute Force Approach

A naive approach would be: for each of the `k` steps, scan through all projects to find those with capital requirement ≤ current capital, then pick the one with maximum profit. After picking, mark it as used so we don't select it again.

Why this fails: With `n` projects and `k` steps, each step requires O(n) time to scan for affordable projects and find the maximum. That's O(k·n) total time. Since `k` can be up to 10⁵ and `n` up to 10⁵, this becomes O(10¹⁰) operations—far too slow.

The brute force also doesn't efficiently handle the fact that as our capital grows, more projects become available. We need a way to avoid rescanning all projects every time.

## Optimized Approach

The optimal solution uses two data structures:

1. **Min-heap for capital requirements**: Store projects sorted by minimum capital needed. This lets us efficiently find all projects we can afford as our capital increases.
2. **Max-heap for profits**: Store affordable projects by profit (largest first) so we can always pick the most profitable one in O(log n) time.

**Step-by-step reasoning:**

1. **Pair projects**: Combine each project's capital requirement with its profit so we can sort them together.
2. **Sort by capital requirement**: This groups projects by the capital needed to start them.
3. **Use a min-heap for capital**: Actually, we don't need a heap here—we can just sort once and iterate through the sorted list. As our capital grows, we move through this sorted list to find newly affordable projects.
4. **Use a max-heap for profits**: As we find affordable projects, we add their profits to a max-heap. The heap's root always gives us the maximum profit among affordable projects.
5. **Greedy selection**: At each of the `k` steps, pop from the max-heap (if not empty) to get the best profit, add it to capital.
6. **Repeat**: After increasing capital, check if more projects in the sorted list have become affordable, and add them to the max-heap.

This approach is greedy because at each step we always choose the maximum profit available. Why is this optimal? Because picking a smaller profit now wouldn't give us access to any projects that a larger profit wouldn't also unlock (capital only increases, never decreases). So delaying a large profit for a smaller one can't help us reach better projects later.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + k log n) | Space: O(n)
def findMaximizedCapital(self, k: int, w: int, profits: List[int], capital: List[int]) -> int:
    # Step 1: Pair each project's capital requirement with its profit
    projects = list(zip(capital, profits))

    # Step 2: Sort projects by capital requirement (min capital first)
    # This lets us efficiently find newly affordable projects as capital grows
    projects.sort()

    # Step 3: Use a max-heap (in Python, we use min-heap with negative values)
    # to store profits of affordable projects
    max_heap = []

    # Step 4: Pointer to track our position in the sorted projects list
    i = 0
    n = len(projects)

    # Step 5: Complete up to k projects
    for _ in range(k):
        # Step 5a: Add all newly affordable projects to the max-heap
        # While we have projects left and current capital meets the requirement
        while i < n and projects[i][0] <= w:
            # Push negative profit to simulate max-heap (Python has min-heap by default)
            heapq.heappush(max_heap, -projects[i][1])
            i += 1

        # Step 5b: If no affordable projects, we can't proceed further
        if not max_heap:
            break

        # Step 5c: Take the project with maximum profit (pop from max-heap)
        # Negate because we stored negative values
        w += -heapq.heappop(max_heap)

    return w
```

```javascript
// Time: O(n log n + k log n) | Space: O(n)
function findMaximizedCapital(k, w, profits, capital) {
  // Step 1: Pair each project's capital requirement with its profit
  const projects = [];
  for (let i = 0; i < profits.length; i++) {
    projects.push([capital[i], profits[i]]);
  }

  // Step 2: Sort projects by capital requirement (min capital first)
  projects.sort((a, b) => a[0] - b[0]);

  // Step 3: Use a max-heap to store profits of affordable projects
  // In JavaScript, we can use an array and sort, but that's O(n log n) per operation.
  // Better: Use a max-heap implementation with O(log n) operations.
  // For simplicity, we'll use an array and sort, but note this makes it O(n log n) per pop.
  const maxHeap = [];

  // Helper function to add to max-heap (maintain max at end for pop())
  const pushToMaxHeap = (profit) => {
    maxHeap.push(profit);
    maxHeap.sort((a, b) => b - a); // Sort descending
  };

  // Helper function to pop from max-heap
  const popFromMaxHeap = () => {
    return maxHeap.shift(); // Remove and return first (max) element
  };

  // Step 4: Pointer to track position in sorted projects
  let i = 0;

  // Step 5: Complete up to k projects
  for (let projectCount = 0; projectCount < k; projectCount++) {
    // Step 5a: Add all newly affordable projects to max-heap
    while (i < projects.length && projects[i][0] <= w) {
      pushToMaxHeap(projects[i][1]);
      i++;
    }

    // Step 5b: If no affordable projects, can't proceed
    if (maxHeap.length === 0) {
      break;
    }

    // Step 5c: Take project with maximum profit
    w += popFromMaxHeap();
  }

  return w;
}
```

```java
// Time: O(n log n + k log n) | Space: O(n)
public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
    int n = profits.length;

    // Step 1: Create array of projects (capital, profit pairs)
    int[][] projects = new int[n][2];
    for (int i = 0; i < n; i++) {
        projects[i][0] = capital[i];
        projects[i][1] = profits[i];
    }

    // Step 2: Sort projects by capital requirement (min first)
    Arrays.sort(projects, (a, b) -> Integer.compare(a[0], b[0]));

    // Step 3: Max-heap for profits of affordable projects
    // Java's PriorityQueue is min-heap by default, so use Comparator.reverseOrder()
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

    // Step 4: Pointer to track position in sorted projects
    int i = 0;

    // Step 5: Complete up to k projects
    for (int projectCount = 0; projectCount < k; projectCount++) {
        // Step 5a: Add all newly affordable projects to max-heap
        while (i < n && projects[i][0] <= w) {
            maxHeap.offer(projects[i][1]);
            i++;
        }

        // Step 5b: If no affordable projects, can't proceed
        if (maxHeap.isEmpty()) {
            break;
        }

        // Step 5c: Take project with maximum profit
        w += maxHeap.poll();
    }

    return w;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + k log n)**

- Sorting the projects: O(n log n)
- Each of the `k` iterations:
  - The while loop to add affordable projects runs at most `n` times total across all iterations (each project added to heap once): O(n log n) total for all heap pushes
  - Popping from max-heap: O(log n) per pop, O(k log n) total
- Overall: O(n log n + k log n)

**Space Complexity: O(n)**

- Storing the projects array: O(n)
- Max-heap can contain up to n elements: O(n)
- Total: O(n)

## Common Mistakes

1. **Not sorting by capital requirement first**: Candidates sometimes try to use only a heap without sorting, requiring them to scan all projects each time. The sorted list is crucial for efficiently finding newly affordable projects as capital grows.

2. **Using a single heap with custom comparator**: Some try to put all projects in a min-heap by capital, then pop and re-add with updated capital after completing projects. This doesn't work because you'd need to constantly update heap elements (not efficient in standard heaps).

3. **Forgetting to break when no affordable projects**: If the max-heap is empty but we haven't completed `k` projects, we must stop. Continuing would either cause an error or incorrect selection.

4. **Incorrect heap type**: Using a min-heap instead of max-heap for profits, or vice versa for capital requirements. Remember: we want minimum capital to find affordable projects easily, but maximum profit to choose the best one.

## When You'll See This Pattern

This "two-heap" or "sorted list + heap" pattern appears in problems where you need to:

1. Process elements in a sorted order
2. Make greedy selections based on some criterion
3. Your selection affects what's available later

**Related problems:**

1. **Maximum Subsequence Score (Medium)**: Similar structure—sort one array, use heap to track top k elements from another array. You're maximizing a score based on two factors.
2. **Maximum Elegance of a K-Length Subsequence (Hard)**: Another profit-maximization problem with constraints, often solved with sorting and heaps.
3. **Meeting Rooms II (Medium)**: Uses sorting and min-heap to track room availability over time.
4. **Course Schedule III (Hard)**: Sort by deadline, use max-heap to manage course durations.

## Key Takeaways

1. **When you need to repeatedly select the "best" available option that changes over time**, consider combining sorting with a heap. Sort by the constraint that unlocks options, use a heap to track the best choices.

2. **Greedy with proof of optimality**: This problem is greedy because taking the maximum profit available at each step is always optimal. In interviews, be prepared to explain why greedy works (delaying a large profit can't help you access projects that the large profit wouldn't also unlock).

3. **Two-phase processing**: First organize data (sorting), then process iteratively with a heap. This pattern avoids O(k·n) scanning by ensuring each project is examined at most twice.

Related problems: [Maximum Subsequence Score](/problem/maximum-subsequence-score), [Maximum Elegance of a K-Length Subsequence](/problem/maximum-elegance-of-a-k-length-subsequence)
