---
title: "How to Solve Maximize Distance to Closest Person — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Distance to Closest Person. Medium difficulty, 49.6% acceptance rate. Topics: Array."
date: "2028-02-19"
category: "dsa-patterns"
tags: ["maximize-distance-to-closest-person", "array", "medium"]
---

# How to Solve "Maximize Distance to Closest Person"

You're given an array of seats where 1 represents an occupied seat and 0 represents an empty seat. You need to find the empty seat where the distance to the nearest person is maximized. What makes this problem interesting is that you're not just finding the largest gap between people—you need to carefully handle the edges where someone might sit at the very beginning or end of the row.

## Visual Walkthrough

Let's walk through an example: `seats = [1, 0, 0, 0, 1, 0, 1]`

We need to find the best empty seat (0) that maximizes distance to the nearest person (1).

Looking at the gaps:

- Between index 0 (person) and index 4 (person): This is a gap of 3 empty seats [1, 2, 3]
  - The middle seat (index 2) is farthest from both ends: distance = 2
- Between index 4 (person) and index 6 (person): This is a gap of 1 empty seat [5]
  - Only one seat available: distance = 1
- Edge case: What if we sit at the very beginning or end?
  - Beginning: No person before index 0, so distance = ∞ (but we have person at index 0)
  - End: After index 6, no person, so distance = ∞

Wait, but we need to be careful! The edges are special cases:

- If we sit at index 0 (but it's occupied in our example)
- If we sit at index 6 (occupied)
- What about sitting before the first person? In our example, index 0 has a person, so we can't sit before them
- What about sitting after the last person? Index 6 has a person, so we can't sit after them

Actually, let's trace through systematically:

1. **Left edge**: The first seat at index 0 is occupied, so we can't sit there
2. **Middle gaps**:
   - Gap between index 0 and 4: seats [1, 2, 3] are empty
     - Best seat in this gap: middle seat (index 2) gives distance 2 to nearest person
   - Gap between index 4 and 6: seat [5] is empty
     - Only seat gives distance 1 to nearest person
3. **Right edge**: The last seat at index 6 is occupied

So the maximum distance is 2, achieved by sitting at index 2.

## Brute Force Approach

A naive approach would be: for each empty seat, scan left and right to find the nearest person, calculate the distance, and track the maximum.

Here's how that would work:

1. For each index `i` where `seats[i] == 0`:
2. Scan left from `i` until you find a person or reach the beginning
3. Scan right from `i` until you find a person or reach the end
4. Take the minimum of these two distances (or just one if at edge)
5. Track the maximum of these minimum distances

The problem? This is O(n²) time in the worst case. If all seats are empty except the first and last, for each of the n-2 empty seats, you'd scan up to n positions, giving O(n²) operations. With n up to 2×10⁴ (typical LeetCode constraints), this is too slow.

## Optimized Approach

The key insight is that we don't need to scan from every empty seat. Instead, we can:

1. **Handle edges separately**: If the first seat is empty, we can sit there with distance = distance to first person
2. **Handle middle gaps**: For gaps between two people, the best seat is in the middle, giving distance = floor(gap/2)
3. **Handle right edge**: If the last seat is empty, we can sit there with distance = distance to last person

We can find all these by:

- Tracking the position of the last person we saw
- For each new person we find, calculate the gap since the last person
- The maximum distance in that gap is floor(gap/2) for middle seats
- Special handling for the beginning (if first seat isn't a person) and end (if last seat isn't a person)

## Optimal Solution

The cleanest approach uses a single pass through the array. We track:

- `lastPerson`: index of the last person seen (initialize to -1 to represent "no person seen yet")
- `maxDist`: maximum distance found so far

For each seat:

- If it's occupied (`seats[i] == 1`):
  - If `lastPerson == -1` (this is the first person), handle left edge
  - Otherwise, handle middle gap between `lastPerson` and current person
  - Update `lastPerson = i`
- After the loop, handle right edge if last seat is empty

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxDistToClosest(seats):
    """
    Find the maximum distance to the closest person from any empty seat.

    Args:
        seats: List[int] where 1 = occupied, 0 = empty

    Returns:
        int: Maximum distance to closest person
    """
    n = len(seats)
    last_person = -1  # Initialize to -1 to indicate no person seen yet
    max_dist = 0

    for i in range(n):
        if seats[i] == 1:  # Found a person
            if last_person == -1:
                # First person found - handle left edge case
                # All seats from beginning to i-1 are empty
                # Distance if sitting at seat 0 would be i
                max_dist = max(max_dist, i)
            else:
                # Person found after some gap
                # Best seat in middle of gap gives distance = floor(gap/2)
                # Gap between last_person and i has (i - last_person - 1) empty seats
                gap = i - last_person - 1
                max_dist = max(max_dist, (gap + 1) // 2)

            # Update last person position
            last_person = i

    # Handle right edge case
    # If last seat is empty, distance = n - 1 - last_person
    if seats[n - 1] == 0:
        max_dist = max(max_dist, n - 1 - last_person)

    return max_dist
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Find the maximum distance to the closest person from any empty seat.
 * @param {number[]} seats - Array where 1 = occupied, 0 = empty
 * @return {number} Maximum distance to closest person
 */
function maxDistToClosest(seats) {
  const n = seats.length;
  let lastPerson = -1; // Initialize to -1 to indicate no person seen yet
  let maxDist = 0;

  for (let i = 0; i < n; i++) {
    if (seats[i] === 1) {
      // Found a person
      if (lastPerson === -1) {
        // First person found - handle left edge case
        // All seats from beginning to i-1 are empty
        // Distance if sitting at seat 0 would be i
        maxDist = Math.max(maxDist, i);
      } else {
        // Person found after some gap
        // Best seat in middle of gap gives distance = floor(gap/2)
        // Gap between lastPerson and i has (i - lastPerson - 1) empty seats
        const gap = i - lastPerson - 1;
        maxDist = Math.max(maxDist, Math.floor((gap + 1) / 2));
      }

      // Update last person position
      lastPerson = i;
    }
  }

  // Handle right edge case
  // If last seat is empty, distance = n - 1 - lastPerson
  if (seats[n - 1] === 0) {
    maxDist = Math.max(maxDist, n - 1 - lastPerson);
  }

  return maxDist;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Find the maximum distance to the closest person from any empty seat.
     * @param seats Array where 1 = occupied, 0 = empty
     * @return Maximum distance to closest person
     */
    public int maxDistToClosest(int[] seats) {
        int n = seats.length;
        int lastPerson = -1;  // Initialize to -1 to indicate no person seen yet
        int maxDist = 0;

        for (int i = 0; i < n; i++) {
            if (seats[i] == 1) {  // Found a person
                if (lastPerson == -1) {
                    // First person found - handle left edge case
                    // All seats from beginning to i-1 are empty
                    // Distance if sitting at seat 0 would be i
                    maxDist = Math.max(maxDist, i);
                } else {
                    // Person found after some gap
                    // Best seat in middle of gap gives distance = floor(gap/2)
                    // Gap between lastPerson and i has (i - lastPerson - 1) empty seats
                    int gap = i - lastPerson - 1;
                    maxDist = Math.max(maxDist, (gap + 1) / 2);
                }

                // Update last person position
                lastPerson = i;
            }
        }

        // Handle right edge case
        // If last seat is empty, distance = n - 1 - lastPerson
        if (seats[n - 1] == 0) {
            maxDist = Math.max(maxDist, n - 1 - lastPerson);
        }

        return maxDist;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of length n
- Each seat is examined exactly once
- Constant-time operations are performed for each seat

**Space Complexity: O(1)**

- We use only a few integer variables (`lastPerson`, `maxDist`, loop counter)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting edge cases**: The most common error is not handling seats at the beginning or end of the row properly. Remember:
   - If the first seat is empty, you can sit there with distance = distance to first person
   - If the last seat is empty, you can sit there with distance = distance to last person
   - Test cases like `[0, 0, 0, 1]` and `[1, 0, 0, 0]` will catch this

2. **Incorrect gap calculation**: When calculating distance in a gap between two people:
   - Gap length = `rightPerson - leftPerson - 1` (empty seats between them)
   - Maximum distance = `(gap + 1) // 2` or `Math.floor((gap + 1) / 2)`
   - Example: 3 empty seats (indices 1, 2, 3 between people at 0 and 4):
     - Gap = 4 - 0 - 1 = 3
     - Best distance = (3 + 1) // 2 = 2 (sit at index 2)

3. **Off-by-one errors with indices**: Be careful with 0-based vs 1-based thinking:
   - When `lastPerson = -1` initially, distance to first person is `i`, not `i - 1`
   - When calculating right edge distance: `n - 1 - lastPerson`, not `n - lastPerson`

4. **Assuming at least one person on each side**: In a gap between two people, the nearest person could be on either side. You must take the minimum distance to either person, which is why sitting in the middle is optimal.

## When You'll See This Pattern

This "gap analysis" pattern appears in problems where you need to find optimal placement within intervals:

1. **Exam Room (LeetCode 855)**: Similar concept but with dynamic seat assignment and vacancy. Instead of finding the best seat once, you need to support repeated seat assignments and removals.

2. **Task Scheduler II (LeetCode 2365)**: While not identical, it involves calculating gaps between elements with constraints, requiring similar gap analysis thinking.

3. **Two Sum II - Input Array Is Sorted**: Different problem but teaches the same lesson of using two pointers to avoid O(n²) scanning.

4. **Container With Most Water**: Another two-pointer problem where you analyze gaps between elements to optimize a value.

The core pattern is recognizing that you don't need to check every position exhaustively—you can reason about gaps and edges separately.

## Key Takeaways

1. **Break the problem into cases**: Edge cases (beginning/end) and middle cases often require different handling. Identifying these cases early helps structure your solution.

2. **Single pass with state tracking**: Many array problems can be solved in O(n) time by maintaining key state variables (like `lastPerson`) as you iterate, avoiding nested loops.

3. **Gap analysis is powerful**: When looking for optimal placement between boundaries, the solution is often at the midpoint. The formula `(gap + 1) // 2` gives the maximum minimum distance.

Related problems: [Exam Room](/problem/exam-room), [Task Scheduler II](/problem/task-scheduler-ii)
