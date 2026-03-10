---
title: "How to Solve Array Nesting — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Array Nesting. Medium difficulty, 56.5% acceptance rate. Topics: Array, Depth-First Search."
date: "2026-09-27"
category: "dsa-patterns"
tags: ["array-nesting", "array", "depth-first-search", "medium"]
---

# How to Solve Array Nesting

Array Nesting is a clever problem that appears to be about building sets, but actually reveals a fundamental property of permutations. You're given a permutation of numbers from 0 to n-1, and you need to find the longest chain you can form by repeatedly using the current value as the next index. What makes this problem interesting is that the permutation structure creates independent cycles, and finding the longest cycle becomes the core challenge.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [5, 4, 0, 3, 1, 2]`.

If we start at index 0:

- `nums[0] = 5` → go to index 5
- `nums[5] = 2` → go to index 2
- `nums[2] = 0` → go to index 0 (we've already seen index 0)

The set starting at index 0 is `{5, 2, 0}` with size 3.

If we start at index 1:

- `nums[1] = 4` → go to index 4
- `nums[4] = 1` → go to index 1 (already seen)

Set: `{4, 1}` with size 2.

If we start at index 3:

- `nums[3] = 3` → go to index 3 (already seen)

Set: `{3}` with size 1.

The maximum size is 3. Notice something important: once we've visited indices 0, 2, and 5, we don't need to check them again because they're all part of the same cycle. Any starting point within a cycle will produce the same set size. This is our key insight for optimization.

## Brute Force Approach

The most straightforward approach is to try every possible starting index and follow the chain until we see a repeat. For each starting index `k`, we create a set to track visited indices, then repeatedly jump to `nums[current]` until we encounter an index we've already seen.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def arrayNesting_brute(nums):
    max_length = 0

    # Try every possible starting index
    for k in range(len(nums)):
        visited = set()
        current = k

        # Follow the chain until we see a repeat
        while current not in visited:
            visited.add(current)
            current = nums[current]

        # Update maximum length found
        max_length = max(max_length, len(visited))

    return max_length
```

```javascript
// Time: O(n²) | Space: O(n)
function arrayNestingBrute(nums) {
  let maxLength = 0;

  // Try every possible starting index
  for (let k = 0; k < nums.length; k++) {
    const visited = new Set();
    let current = k;

    // Follow the chain until we see a repeat
    while (!visited.has(current)) {
      visited.add(current);
      current = nums[current];
    }

    // Update maximum length found
    maxLength = Math.max(maxLength, visited.size);
  }

  return maxLength;
}
```

```java
// Time: O(n²) | Space: O(n)
public int arrayNestingBrute(int[] nums) {
    int maxLength = 0;

    // Try every possible starting index
    for (int k = 0; k < nums.length; k++) {
        Set<Integer> visited = new HashSet<>();
        int current = k;

        // Follow the chain until we see a repeat
        while (!visited.contains(current)) {
            visited.add(current);
            current = nums[current];
        }

        // Update maximum length found
        maxLength = Math.max(maxLength, visited.size());
    }

    return maxLength;
}
```

</div>

**Why this is inefficient:** The time complexity is O(n²) in the worst case. Consider when the array forms one big cycle: `[1, 2, 3, 4, 5, 0]`. Starting at index 0, we'll visit all n elements. Starting at index 1, we'll also visit all n elements (just in a different order). We're doing O(n) work for each of n starting points, resulting in O(n²) total work. We need to avoid revisiting elements that are already part of a known cycle.

## Optimized Approach

The key insight is that the permutation creates **disjoint cycles**. Each index belongs to exactly one cycle, and every starting point within a cycle produces the same set size. Once we've explored a cycle, we never need to visit any of its indices again.

Think of it like this: the array defines a directed graph where each node `i` points to node `nums[i]`. Since `nums` is a permutation of `[0, n-1]`, each node has exactly one outgoing edge and one incoming edge. This means the graph decomposes into disjoint cycles.

Our optimized approach:

1. Keep a visited array to track which indices we've already processed
2. For each unvisited index, follow the chain until we return to the start
3. Count the length of the cycle
4. Update our maximum length
5. Mark all indices in this cycle as visited so we don't process them again

This works because if we encounter an already-visited index while following a chain, we know we've entered a previously explored cycle and can stop early.

## Optimal Solution

Here's the optimal implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def arrayNesting(nums):
    """
    Find the longest set formed by repeatedly jumping to nums[current].

    The key insight: nums is a permutation, so it forms disjoint cycles.
    Once we visit a cycle, we never need to visit its nodes again.
    """
    n = len(nums)
    visited = [False] * n  # Track visited indices
    max_length = 0

    # Try each index as potential starting point
    for i in range(n):
        # Skip if already visited (part of a previously explored cycle)
        if not visited[i]:
            current = i
            count = 0

            # Follow the chain until we return to a visited node
            while not visited[current]:
                visited[current] = True  # Mark as visited
                current = nums[current]  # Jump to next index
                count += 1

            # Update maximum cycle length found
            max_length = max(max_length, count)

    return max_length
```

```javascript
// Time: O(n) | Space: O(n)
function arrayNesting(nums) {
  /**
   * Find the longest set formed by repeatedly jumping to nums[current].
   *
   * The key insight: nums is a permutation, so it forms disjoint cycles.
   * Once we visit a cycle, we never need to visit its nodes again.
   */
  const n = nums.length;
  const visited = new Array(n).fill(false); // Track visited indices
  let maxLength = 0;

  // Try each index as potential starting point
  for (let i = 0; i < n; i++) {
    // Skip if already visited (part of a previously explored cycle)
    if (!visited[i]) {
      let current = i;
      let count = 0;

      // Follow the chain until we return to a visited node
      while (!visited[current]) {
        visited[current] = true; // Mark as visited
        current = nums[current]; // Jump to next index
        count++;
      }

      // Update maximum cycle length found
      maxLength = Math.max(maxLength, count);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(n)
public int arrayNesting(int[] nums) {
    /**
     * Find the longest set formed by repeatedly jumping to nums[current].
     *
     * The key insight: nums is a permutation, so it forms disjoint cycles.
     * Once we visit a cycle, we never need to visit its nodes again.
     */
    int n = nums.length;
    boolean[] visited = new boolean[n];  // Track visited indices
    int maxLength = 0;

    // Try each index as potential starting point
    for (int i = 0; i < n; i++) {
        // Skip if already visited (part of a previously explored cycle)
        if (!visited[i]) {
            int current = i;
            int count = 0;

            // Follow the chain until we return to a visited node
            while (!visited[current]) {
                visited[current] = true;  // Mark as visited
                current = nums[current];  // Jump to next index
                count++;
            }

            // Update maximum cycle length found
            maxLength = Math.max(maxLength, count);
        }
    }

    return maxLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We visit each index exactly once. Even though we have nested loops, the inner `while` loop only processes unvisited indices, and we mark them as visited as we go. In total, we perform O(n) operations because each index is visited at most once.

**Space Complexity: O(n)**  
We use a `visited` array of size n to track which indices we've processed. This is necessary to avoid reprocessing cycles. We could optimize to O(1) extra space by marking visited indices in-place (e.g., setting them to -1), but the O(n) solution is clearer and acceptable in interviews.

## Common Mistakes

1. **Not skipping visited indices**: The most common error is reprocessing cycles. Candidates might use the brute force approach without realizing indices can be skipped once visited. This leads to O(n²) time instead of O(n).

2. **Infinite loops without proper termination**: When following the chain, you must have a termination condition. Some candidates check `while current != start`, but this fails for cycles that don't immediately return to the start. Always check if the current index has been visited.

3. **Confusing indices with values**: Remember `nums[i]` gives the next index to jump to, not a value to compare. The problem says "nums is a permutation of [0, n-1]", so values are valid indices.

4. **Missing the permutation property**: The fact that `nums` contains all numbers from 0 to n-1 exactly once is crucial. Without this guarantee, the cycle-finding approach wouldn't work reliably.

## When You'll See This Pattern

This cycle detection pattern in permutations appears in several problems:

1. **Find the Duplicate Number (LeetCode 287)**: Uses similar cycle detection in an array where values point to indices, though with one duplicate.

2. **First Missing Positive (LeetCode 41)**: Uses index-value relationships to place numbers in their correct positions, similar to following chains.

3. **Linked List Cycle II (LeetCode 142)**: While not in an array, the Floyd's Tortoise and Hare algorithm for cycle detection uses similar logic of following pointers until a repeat is found.

The core pattern is recognizing that when you have a mapping from indices to other indices (like `i → nums[i]`), you're effectively working with a graph of out-degree 1, which decomposes into cycles.

## Key Takeaways

1. **Permutations create cycles**: When you have a permutation array where values are valid indices, following the chain `i → nums[i] → nums[nums[i]] → ...` will always eventually cycle back. All indices belong to exactly one cycle.

2. **Visit each element once**: By marking visited elements, you avoid O(n²) complexity. This is a common optimization pattern in array problems where you're following pointers or indices.

3. **Think in terms of graph theory**: Many array problems become clearer when you recognize the underlying graph structure. Here, each index is a node with one outgoing edge to `nums[i]`, forming disjoint cycles.

Related problems: [Nested List Weight Sum](/problem/nested-list-weight-sum), [Flatten Nested List Iterator](/problem/flatten-nested-list-iterator), [Nested List Weight Sum II](/problem/nested-list-weight-sum-ii)
