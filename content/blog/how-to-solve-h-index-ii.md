---
title: "How to Solve H-Index II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode H-Index II. Medium difficulty, 39.4% acceptance rate. Topics: Array, Binary Search."
date: "2028-04-08"
category: "dsa-patterns"
tags: ["h-index-ii", "array", "binary-search", "medium"]
---

# How to Solve H-Index II

The H-Index II problem asks us to calculate a researcher's h-index given their citation counts sorted in non-decreasing order. The h-index is defined as the maximum value `h` such that the researcher has at least `h` papers with at least `h` citations each. What makes this problem interesting is that while the unsorted version (H-Index) can be solved with sorting or counting, this sorted version invites a more efficient binary search solution that leverages the sorted property.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `citations = [0, 1, 3, 5, 6]`.

The h-index definition says: we need to find the largest `h` where at least `h` papers have at least `h` citations. Since the array is sorted, we can think about this differently: for any index `i`, there are `n - i` papers from position `i` to the end (including `i` itself). If `citations[i] >= n - i`, then those `n - i` papers all have at least `citations[i]` citations (because the array is sorted), and `citations[i]` is at least `n - i`.

Let's check each position:

- At index 0: `citations[0] = 0`, `n - i = 5`. `0 >= 5`? No.
- At index 1: `citations[1] = 1`, `n - i = 4`. `1 >= 4`? No.
- At index 2: `citations[2] = 3`, `n - i = 3`. `3 >= 3`? Yes! This means 3 papers have at least 3 citations.
- At index 3: `citations[3] = 5`, `n - i = 2`. `5 >= 2`? Yes, but we're looking for the maximum `h`, and `n - i = 2` here.
- At index 4: `citations[4] = 6`, `n - i = 1`. `6 >= 1`? Yes, but `n - i = 1` is smaller.

The h-index is the maximum value of `n - i` where `citations[i] >= n - i`. In our case, that's `n - 2 = 3` (from index 2).

## Brute Force Approach

A brute force approach would check every possible `h` value from 0 up to `n` (the number of papers). For each candidate `h`, we'd need to verify if there are at least `h` papers with at least `h` citations. Since the array is sorted, we could use binary search to check this condition for each `h`, but that would still be O(n log n) overall.

A simpler brute force would be linear scan: for each index `i`, calculate `n - i` and check if `citations[i] >= n - i`. We could return the maximum such `n - i`. This is actually O(n) and works, but we can do better with binary search since the array is sorted and the condition `citations[i] >= n - i` creates a boundary we can search for.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def hIndexBruteForce(citations):
    n = len(citations)
    h = 0

    # Check each possible h value from 0 to n
    for i in range(n):
        # papers_with_at_least_h_citations = n - i
        papers = n - i
        # If current paper has at least 'papers' citations
        if citations[i] >= papers:
            h = max(h, papers)

    return h
```

```javascript
// Time: O(n) | Space: O(1)
function hIndexBruteForce(citations) {
  const n = citations.length;
  let h = 0;

  // Check each possible h value from 0 to n
  for (let i = 0; i < n; i++) {
    // papers_with_at_least_h_citations = n - i
    const papers = n - i;
    // If current paper has at least 'papers' citations
    if (citations[i] >= papers) {
      h = Math.max(h, papers);
    }
  }

  return h;
}
```

```java
// Time: O(n) | Space: O(1)
public int hIndexBruteForce(int[] citations) {
    int n = citations.length;
    int h = 0;

    // Check each possible h value from 0 to n
    for (int i = 0; i < n; i++) {
        // papers_with_at_least_h_citations = n - i
        int papers = n - i;
        // If current paper has at least 'papers' citations
        if (citations[i] >= papers) {
            h = Math.max(h, papers);
        }
    }

    return h;
}
```

</div>

The brute force O(n) solution is actually acceptable for this problem, but interviewers expect you to recognize that binary search can improve it to O(log n) when they explicitly mention the array is sorted.

## Optimized Approach

The key insight is that the condition `citations[i] >= n - i` creates a monotonic property we can binary search over. As `i` increases:

- `citations[i]` increases (array is sorted in non-decreasing order)
- `n - i` decreases (as we move right, fewer papers remain)

This means there's a "boundary" point where the condition switches from false to true. We want to find the first index `i` where `citations[i] >= n - i`. Once we find this boundary, the h-index will be `n - i` (the number of papers from that point onward).

Why does this work? Let's think about the condition:

- If `citations[i] >= n - i` is true at index `i`, then it's also true for all indices `j > i` because `citations[j] >= citations[i]` (sorted) and `n - j <= n - i`. So once we find the first true position, everything to the right also satisfies the condition.
- The h-index is the maximum `n - i` where the condition holds. Since `n - i` decreases as `i` increases, the first position where it's true gives us the maximum value.

We can use binary search to find this boundary efficiently in O(log n) time.

## Optimal Solution

Here's the binary search implementation that finds the first index where `citations[i] >= n - i`:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def hIndex(citations):
    n = len(citations)
    left, right = 0, n - 1

    # Binary search for the first index where citations[i] >= n - i
    while left <= right:
        mid = left + (right - left) // 2  # Avoid overflow, standard binary search midpoint

        # papers_with_at_least_h_citations = n - mid
        papers = n - mid

        if citations[mid] >= papers:
            # This position satisfies the h-index condition
            # Try to find an earlier position (to maximize n - i)
            right = mid - 1
        else:
            # This position doesn't satisfy the condition
            # We need to look further right
            left = mid + 1

    # After the loop, left points to the first position where condition is true
    # The h-index is n - left (number of papers from left to end)
    return n - left
```

```javascript
// Time: O(log n) | Space: O(1)
function hIndex(citations) {
  const n = citations.length;
  let left = 0,
    right = n - 1;

  // Binary search for the first index where citations[i] >= n - i
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2); // Avoid overflow

    // papers_with_at_least_h_citations = n - mid
    const papers = n - mid;

    if (citations[mid] >= papers) {
      // This position satisfies the h-index condition
      // Try to find an earlier position (to maximize n - i)
      right = mid - 1;
    } else {
      // This position doesn't satisfy the condition
      // We need to look further right
      left = mid + 1;
    }
  }

  // After the loop, left points to the first position where condition is true
  // The h-index is n - left (number of papers from left to end)
  return n - left;
}
```

```java
// Time: O(log n) | Space: O(1)
public int hIndex(int[] citations) {
    int n = citations.length;
    int left = 0, right = n - 1;

    // Binary search for the first index where citations[i] >= n - i
    while (left <= right) {
        int mid = left + (right - left) / 2;  // Avoid overflow

        // papers_with_at_least_h_citations = n - mid
        int papers = n - mid;

        if (citations[mid] >= papers) {
            // This position satisfies the h-index condition
            // Try to find an earlier position (to maximize n - i)
            right = mid - 1;
        } else {
            // This position doesn't satisfy the condition
            // We need to look further right
            left = mid + 1;
        }
    }

    // After the loop, left points to the first position where condition is true
    // The h-index is n - left (number of papers from left to end)
    return n - left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n) where n is the number of papers. We're using binary search which halves the search space each iteration.

**Space Complexity:** O(1). We only use a constant amount of extra space for pointers and variables, regardless of input size.

The binary search approach is optimal because:

1. The array is sorted (given in the problem)
2. The condition `citations[i] >= n - i` creates a monotonic boundary
3. We need to find a boundary point, which is exactly what binary search excels at

## Common Mistakes

1. **Forgetting to handle edge cases:** What if all citations are 0? The function should return 0. Our solution handles this correctly because if no position satisfies `citations[i] >= n - i`, then `left` will be `n` at the end, and `n - n = 0`.

2. **Off-by-one errors in binary search:** The classic pitfalls include using `mid = (left + right) // 2` which can overflow in some languages (though not in Python), or incorrect loop condition. We use `left <= right` and update bounds as `mid ± 1` to avoid infinite loops.

3. **Returning the wrong value:** Some candidates return `citations[left]` instead of `n - left`. Remember: the h-index is the number of papers, not the citation count at the boundary. In our example `[0, 1, 3, 5, 6]`, at the boundary (index 2), we return `5 - 2 = 3`, not `citations[2] = 3` (though they happen to be equal in this case).

4. **Not recognizing the sorted property:** Some candidates might sort the array first, not realizing it's already sorted. This would be O(n log n) instead of leveraging the given sorted order for O(log n) solution.

## When You'll See This Pattern

This "binary search on answer" or "binary search for boundary" pattern appears in many problems:

1. **First Bad Version (LeetCode 278):** Find the first bad version in a sorted sequence of good then bad versions. The condition "isBadVersion(i)" creates a similar boundary.

2. **Find Peak Element (LeetCode 162):** Find a peak element in an array where neighbors are guaranteed to be different. The comparison with neighbors creates a directional signal for binary search.

3. **Search in Rotated Sorted Array (LeetCode 33):** Search in a rotated sorted array by identifying which half is properly sorted and applying binary search accordingly.

4. **Find Minimum in Rotated Sorted Array (LeetCode 153):** Similar to above, finding the rotation point using binary search.

The common theme is: when you have a sorted sequence (or a sequence with some monotonic property) and you're looking for a boundary point where some condition changes, binary search is often the optimal approach.

## Key Takeaways

1. **Sorted arrays invite binary search:** When you see "sorted" or "non-decreasing" in the problem description, always consider if binary search could apply.

2. **Look for boundary conditions:** Many problems ask you to find the "first" or "last" position where some condition holds. This is a classic binary search application.

3. **Understand the h-index definition deeply:** The h-index isn't just about counting—it's about finding the maximum h where the condition holds. The sorted version lets us transform this into a search problem.

4. **Test edge cases:** Always test with all zeros, all large numbers, empty array, and single element arrays to ensure your binary search handles boundaries correctly.

Related problems: [H-Index](/problem/h-index)
