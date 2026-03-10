---
title: "How to Solve Find the Minimum and Maximum Number of Nodes Between Critical Points — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Minimum and Maximum Number of Nodes Between Critical Points. Medium difficulty, 69.5% acceptance rate. Topics: Linked List."
date: "2028-09-30"
category: "dsa-patterns"
tags:
  ["find-the-minimum-and-maximum-number-of-nodes-between-critical-points", "linked-list", "medium"]
---

# How to Solve "Find the Minimum and Maximum Number of Nodes Between Critical Points"

This problem asks us to identify critical points in a singly linked list—nodes that are either local maxima (greater than both neighbors) or local minima (less than both neighbors)—and then find the minimum and maximum distances between any two critical points. The challenge lies in efficiently tracking critical points while traversing the list once, and correctly computing distances between them without extra space.

What makes this problem interesting is that it combines linked list traversal with distance calculations, requiring careful handling of node relationships and boundary conditions. The key insight is that critical points can be identified during a single pass, and distances can be tracked incrementally.

## Visual Walkthrough

Let's trace through an example: `[3,1,2,5,4,1,2,5,3,2]`

We'll label nodes by index (starting at 0):

- Node 0: 3 (no previous node, can't be critical)
- Node 1: 1 (previous=3, next=2) → 1 < 3 and 1 < 2 → local minima ✓
- Node 2: 2 (previous=1, next=5) → 2 > 1 and 2 < 5 → not critical
- Node 3: 5 (previous=2, next=4) → 5 > 2 and 5 > 4 → local maxima ✓
- Node 4: 4 (previous=5, next=1) → 4 < 5 and 4 > 1 → not critical
- Node 5: 1 (previous=4, next=2) → 1 < 4 and 1 < 2 → local minima ✓
- Node 6: 2 (previous=1, next=5) → 2 > 1 and 2 < 5 → not critical
- Node 7: 5 (previous=2, next=3) → 5 > 2 and 5 > 3 → local maxima ✓
- Node 8: 3 (previous=5, next=2) → 3 < 5 and 3 > 2 → not critical
- Node 9: 2 (no next node, can't be critical)

Critical points at indices: [1, 3, 5, 7]

Now calculate distances:

- Between 1 and 3: 2 nodes apart (distance = 2)
- Between 1 and 5: 4 nodes apart (distance = 4)
- Between 1 and 7: 6 nodes apart (distance = 6)
- Between 3 and 5: 2 nodes apart (distance = 2)
- Between 3 and 7: 4 nodes apart (distance = 4)
- Between 5 and 7: 2 nodes apart (distance = 2)

Minimum distance = 2, Maximum distance = 6

## Brute Force Approach

A naive approach would be:

1. Traverse the list once to collect all values into an array
2. Iterate through the array to identify critical points (indices where `arr[i-1] < arr[i] > arr[i+1]` or `arr[i-1] > arr[i] < arr[i+1]`)
3. Store all critical point indices
4. Calculate all pairwise distances to find min and max

While this works, it requires O(n) extra space for the array and O(k²) time for pairwise distance calculations where k is the number of critical points. In the worst case (alternating critical points), k ≈ n/2, making this O(n²).

More importantly, this misses the point of the problem—we should work directly with the linked list structure without converting to an array. Interviewers expect you to handle the linked list directly.

## Optimized Approach

The key insight is that we only need to track:

1. The **first critical point** (for maximum distance calculation)
2. The **previous critical point** (for minimum distance calculation)
3. The **current index** as we traverse

Why this works:

- **Minimum distance**: Since we traverse sequentially, the minimum distance will always be between consecutive critical points. We just need to track the distance between the current critical point and the previous one.
- **Maximum distance**: The maximum distance will always be between the first and last critical points (since they're the farthest apart in a sequence).

We can do this in one pass with O(1) extra space:

1. Traverse the list with three pointers: `prev`, `curr`, `next`
2. For each node (except first and last), check if it's a critical point
3. When we find a critical point:
   - If it's the first, store its position
   - If we have a previous critical point, update the minimum distance
   - Update the last critical point position
4. After traversal, compute results based on what we found

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - single pass through the linked list
# Space: O(1) - only using constant extra space
class Solution:
    def nodesBetweenCriticalPoints(self, head):
        # Edge case: need at least 3 nodes to have any critical points
        if not head or not head.next or not head.next.next:
            return [-1, -1]

        prev = head
        curr = head.next
        next_node = head.next.next

        # Track positions (1-indexed as per problem statement)
        first_critical = None
        prev_critical = None
        min_distance = float('inf')
        position = 1  # Current node index (curr is at position 2 initially)

        # Traverse until we run out of next nodes
        while next_node:
            position += 1  # Move to current node's position

            # Check if current node is a critical point
            # Local maxima: curr > prev and curr > next
            # Local minima: curr < prev and curr < next
            is_maxima = curr.val > prev.val and curr.val > next_node.val
            is_minima = curr.val < prev.val and curr.val < next_node.val

            if is_maxima or is_minima:
                # This is a critical point
                if first_critical is None:
                    # First critical point found
                    first_critical = position
                else:
                    # Update minimum distance with previous critical point
                    min_distance = min(min_distance, position - prev_critical)

                # Update previous critical point for next comparison
                prev_critical = position

            # Move pointers forward
            prev = curr
            curr = next_node
            next_node = next_node.next

        # Calculate results
        if first_critical is None or prev_critical is None or first_critical == prev_critical:
            # Less than 2 critical points found
            return [-1, -1]

        # Maximum distance is between first and last critical points
        max_distance = prev_critical - first_critical

        return [min_distance, max_distance]
```

```javascript
// Time: O(n) - single pass through the linked list
// Space: O(1) - only using constant extra space
var nodesBetweenCriticalPoints = function (head) {
  // Edge case: need at least 3 nodes to have any critical points
  if (!head || !head.next || !head.next.next) {
    return [-1, -1];
  }

  let prev = head;
  let curr = head.next;
  let nextNode = head.next.next;

  // Track positions (1-indexed as per problem statement)
  let firstCritical = null;
  let prevCritical = null;
  let minDistance = Infinity;
  let position = 1; // Current node index (curr is at position 2 initially)

  // Traverse until we run out of next nodes
  while (nextNode) {
    position++; // Move to current node's position

    // Check if current node is a critical point
    // Local maxima: curr > prev and curr > next
    // Local minima: curr < prev and curr < next
    const isMaxima = curr.val > prev.val && curr.val > nextNode.val;
    const isMinima = curr.val < prev.val && curr.val < nextNode.val;

    if (isMaxima || isMinima) {
      // This is a critical point
      if (firstCritical === null) {
        // First critical point found
        firstCritical = position;
      } else {
        // Update minimum distance with previous critical point
        minDistance = Math.min(minDistance, position - prevCritical);
      }

      // Update previous critical point for next comparison
      prevCritical = position;
    }

    // Move pointers forward
    prev = curr;
    curr = nextNode;
    nextNode = nextNode.next;
  }

  // Calculate results
  if (firstCritical === null || prevCritical === null || firstCritical === prevCritical) {
    // Less than 2 critical points found
    return [-1, -1];
  }

  // Maximum distance is between first and last critical points
  const maxDistance = prevCritical - firstCritical;

  return [minDistance, maxDistance];
};
```

```java
// Time: O(n) - single pass through the linked list
// Space: O(1) - only using constant extra space
class Solution {
    public int[] nodesBetweenCriticalPoints(ListNode head) {
        // Edge case: need at least 3 nodes to have any critical points
        if (head == null || head.next == null || head.next.next == null) {
            return new int[]{-1, -1};
        }

        ListNode prev = head;
        ListNode curr = head.next;
        ListNode nextNode = head.next.next;

        // Track positions (1-indexed as per problem statement)
        Integer firstCritical = null;
        Integer prevCritical = null;
        int minDistance = Integer.MAX_VALUE;
        int position = 1;  // Current node index (curr is at position 2 initially)

        // Traverse until we run out of next nodes
        while (nextNode != null) {
            position++;  // Move to current node's position

            // Check if current node is a critical point
            // Local maxima: curr > prev and curr > next
            // Local minima: curr < prev and curr < next
            boolean isMaxima = curr.val > prev.val && curr.val > nextNode.val;
            boolean isMinima = curr.val < prev.val && curr.val < nextNode.val;

            if (isMaxima || isMinima) {
                // This is a critical point
                if (firstCritical == null) {
                    // First critical point found
                    firstCritical = position;
                } else {
                    // Update minimum distance with previous critical point
                    minDistance = Math.min(minDistance, position - prevCritical);
                }

                // Update previous critical point for next comparison
                prevCritical = position;
            }

            // Move pointers forward
            prev = curr;
            curr = nextNode;
            nextNode = nextNode.next;
        }

        // Calculate results
        if (firstCritical == null || prevCritical == null || firstCritical.equals(prevCritical)) {
            // Less than 2 critical points found
            return new int[]{-1, -1};
        }

        // Maximum distance is between first and last critical points
        int maxDistance = prevCritical - firstCritical;

        return new int[]{minDistance, maxDistance};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the linked list exactly once with the three-pointer technique
- Each node is visited once, and we perform constant-time operations at each node
- The while loop runs (n-2) times for an n-node list (since we need prev, curr, and next)

**Space Complexity: O(1)**

- We use only a fixed number of variables regardless of input size
- No additional data structures that grow with n
- The input linked list is not counted toward space complexity

## Common Mistakes

1. **Not handling the head and tail nodes correctly**: Critical points can only exist at nodes that have both previous and next nodes. Forgetting to skip the first and last nodes will cause incorrect results or index errors.

2. **Using 0-based indexing when problem expects 1-based**: The problem defines positions starting from 1 (head is position 1). Using 0-based indexing will give wrong distance calculations.

3. **Forgetting the case with fewer than 2 critical points**: If there are 0 or 1 critical points, we must return [-1, -1]. Candidates often forget to check this edge case.

4. **Calculating distances incorrectly**: The distance between nodes at positions i and j is |i-j|, not the number of edges between them. For example, nodes at positions 2 and 4 have distance 2 (not 1).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Linked List Traversal with Multiple Pointers**: Similar to problems like "Middle of the Linked List" or "Detect Cycle in Linked List" where you need to track multiple positions simultaneously.

2. **Local Extremum Detection**: The critical point detection logic appears in problems like "Find Peak Element" or "Wiggle Sort" where you need to identify local maxima/minima.

3. **Distance Tracking in Sequences**: The technique of tracking first and previous occurrences appears in problems like "Minimum Distance Between BST Nodes" or "Shortest Word Distance".

Related LeetCode problems:

- **#2058: Find the Minimum and Maximum Number of Nodes Between Critical Points** (this problem)
- **#876: Middle of the Linked List** (similar pointer traversal)
- **#162: Find Peak Element** (similar local maxima detection)
- **#783: Minimum Distance Between BST Nodes** (similar distance tracking)

## Key Takeaways

1. **Single-pass algorithms often track "first" and "previous" occurrences**: When you need min/max distances between special points in a sequence, you usually only need to track the first occurrence and update distances as you find new ones.

2. **Critical thinking about what information you actually need**: You don't need to store all critical points—just the first, previous, and current positions are sufficient to compute both min and max distances.

3. **Careful boundary handling is crucial**: With linked list problems, always consider edge cases like empty lists, single nodes, two nodes, and the beginning/end of the list.

[Practice this problem on CodeJeet](/problem/find-the-minimum-and-maximum-number-of-nodes-between-critical-points)
