---
title: "How to Solve Circular Array Loop — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Circular Array Loop. Medium difficulty, 37.0% acceptance rate. Topics: Array, Hash Table, Two Pointers."
date: "2027-05-07"
category: "dsa-patterns"
tags: ["circular-array-loop", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve Circular Array Loop

This problem asks you to determine if there exists a "circular loop" in a circular array. A loop exists when you start at an index and follow the jumps according to the array values, eventually returning to the starting index while maintaining the same direction throughout. The tricky part is that the array is circular (wrapping around), jumps can be forward or backward, and the loop must have more than one element (you can't just stay in place).

What makes this interesting is that it combines cycle detection with direction constraints and circular array traversal. You need to ensure the entire loop moves consistently in one direction (all positive or all negative jumps) and contains multiple elements.

## Visual Walkthrough

Let's trace through an example: `nums = [2, -1, 1, 2, 2]`

**Step 1: Start at index 0**

- Value is 2 (positive, so forward direction)
- Move 2 steps: (0 + 2) % 5 = 2
- Index 2 has value 1 (positive, same direction ✓)
- Move 1 step: (2 + 1) % 5 = 3
- Index 3 has value 2 (positive, same direction ✓)
- Move 2 steps: (3 + 2) % 5 = 0
- Back to index 0 (starting point)
- Loop is: 0 → 2 → 3 → 0 (3 elements, all positive ✓)
- This IS a valid circular loop!

**Step 2: Start at index 1**

- Value is -1 (negative, backward direction)
- Move -1 step: (1 - 1) % 5 = 0 (in Python, -1 % 5 = 4, but we handle this carefully)
- Actually: (1 - 1 + 5) % 5 = 0
- Index 0 has value 2 (positive, different direction ✗)
- Not a valid loop since direction changed

**Step 3: Start at index 4**

- Value is 2 (positive, forward)
- Move 2 steps: (4 + 2) % 5 = 1
- Index 1 has value -1 (negative, different direction ✗)
- Not a valid loop

The key insight: We need to check every index as a potential starting point, but we can optimize by marking visited indices to avoid redundant work.

## Brute Force Approach

A naive approach would be to start from every index `i` and simulate the jumps:

1. For each starting index `i`, track visited indices in a set
2. Follow jumps according to `nums[i]`
3. Check if we return to a visited index (cycle detected)
4. Verify all jumps in the cycle have same direction
5. Verify cycle length > 1

The brute force code would look like this:

```python
def brute_force(nums):
    n = len(nums)
    for i in range(n):
        visited = set()
        curr = i
        direction = nums[curr] > 0  # True for positive, False for negative

        while curr not in visited:
            visited.add(curr)
            next_idx = (curr + nums[curr]) % n
            # Check if direction changes
            if (nums[next_idx] > 0) != direction:
                break
            curr = next_idx

        # Check if we found a cycle back to starting point
        if curr == i and len(visited) > 1:
            return True

    return False
```

**Why this is inefficient:**

- Time complexity: O(n²) in worst case (n starting points × n steps each)
- Space complexity: O(n) for the visited set per starting point
- We're doing redundant work - if we've already explored part of a path from a previous starting index, we're exploring it again

## Optimized Approach

The key insight is that we can use a **slow-fast pointer** approach (like Floyd's cycle detection) adapted for this problem. However, there's an even cleaner approach: **marking visited nodes**.

Here's the optimal strategy:

1. Iterate through each index as a potential starting point
2. Use two pointers: slow moves one jump at a time, fast moves two jumps
3. Check that direction remains consistent throughout
4. If slow and fast meet, check if it's a valid cycle (length > 1)
5. Mark all visited nodes in the current exploration to avoid re-checking them

The clever optimization: When we determine a path doesn't form a valid cycle, we mark all nodes along that path as "visited" or "invalid" so we don't start from them later. This brings us to O(n) time.

## Optimal Solution

The most efficient solution uses a visited marking approach. We traverse each index, and for unvisited indices, we simulate the jumps while marking nodes with a unique identifier. If we encounter our own marker, we found a cycle. If we encounter someone else's marker or a node that would break direction consistency, the current path is invalid.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def circularArrayLoop(nums):
    """
    Detects if there's a circular loop in the array.
    A valid loop must:
    1. Have consistent direction (all positive or all negative)
    2. Have length > 1
    3. Return to starting point
    """
    n = len(nums)
    if n == 0:
        return False

    # Helper function to get next index with proper circular wrapping
    def get_next_index(current):
        # Calculate next index with wrap-around
        # The extra +n ensures we handle negative values correctly
        return (current + nums[current]) % n

    # Main loop: check each index as potential starting point
    for i in range(n):
        # Skip if already marked as invalid
        if nums[i] == 0:
            continue

        # Determine direction of current path
        direction = nums[i] > 0  # True = forward, False = backward

        # Initialize slow and fast pointers
        slow = i
        fast = i

        # Use Floyd's cycle detection algorithm
        while True:
            # Move slow pointer one step
            slow = get_next_index(slow)

            # Check if slow pointer breaks direction consistency
            if (nums[slow] > 0) != direction:
                break

            # Move fast pointer two steps
            fast = get_next_index(fast)
            if (nums[fast] > 0) != direction:
                break
            fast = get_next_index(fast)
            if (nums[fast] > 0) != direction:
                break

            # If slow and fast meet, we found a cycle
            if slow == fast:
                # Check if cycle length > 1 (not self-loop)
                # Move one more step to verify it's not a single element cycle
                next_slow = get_next_index(slow)
                if next_slow != slow:  # Length > 1
                    return True
                else:  # Self-loop, not valid
                    break

        # Mark all visited nodes in this path as invalid (0)
        # This prevents re-checking them and ensures O(n) time
        slow = i
        while (nums[slow] > 0) == direction:
            next_slow = get_next_index(slow)
            nums[slow] = 0  # Mark as visited/invalid
            slow = next_slow

    return False
```

```javascript
// Time: O(n) | Space: O(1)
function circularArrayLoop(nums) {
  const n = nums.length;
  if (n === 0) return false;

  // Helper function to get next index with circular wrapping
  const getNextIndex = (current) => {
    // JavaScript's % operator returns negative for negative numbers
    // We add n to ensure positive result, then mod again
    let next = (current + nums[current]) % n;
    if (next < 0) next += n; // Handle negative wrap-around
    return next;
  };

  // Check each index as potential starting point
  for (let i = 0; i < n; i++) {
    // Skip already visited/invalid indices
    if (nums[i] === 0) continue;

    // Determine direction of current path
    const direction = nums[i] > 0; // true = forward, false = backward

    // Initialize slow and fast pointers
    let slow = i;
    let fast = i;

    // Floyd's cycle detection
    while (true) {
      // Move slow pointer one step
      slow = getNextIndex(slow);

      // Check direction consistency for slow
      if (nums[slow] > 0 !== direction) break;

      // Move fast pointer two steps
      fast = getNextIndex(fast);
      if (nums[fast] > 0 !== direction) break;
      fast = getNextIndex(fast);
      if (nums[fast] > 0 !== direction) break;

      // Cycle detected when slow and fast meet
      if (slow === fast) {
        // Verify cycle length > 1 (not self-loop)
        const nextSlow = getNextIndex(slow);
        if (nextSlow !== slow) {
          return true; // Valid cycle found
        } else {
          break; // Self-loop, invalid
        }
      }
    }

    // Mark all nodes in this path as visited/invalid
    // This optimization ensures O(n) time complexity
    slow = i;
    while (nums[slow] > 0 === direction) {
      const nextSlow = getNextIndex(slow);
      nums[slow] = 0; // Mark as visited
      slow = nextSlow;
    }
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(1)
public class Solution {
    public boolean circularArrayLoop(int[] nums) {
        int n = nums.length;
        if (n == 0) return false;

        // Check each index as potential starting point
        for (int i = 0; i < n; i++) {
            // Skip already visited/invalid indices
            if (nums[i] == 0) continue;

            // Determine direction of current path
            boolean direction = nums[i] > 0;  // true = forward, false = backward

            // Initialize slow and fast pointers
            int slow = i;
            int fast = i;

            // Floyd's cycle detection algorithm
            while (true) {
                // Move slow pointer one step
                slow = getNextIndex(nums, slow);

                // Check if direction changes for slow
                if ((nums[slow] > 0) != direction) break;

                // Move fast pointer two steps
                fast = getNextIndex(nums, fast);
                if ((nums[fast] > 0) != direction) break;
                fast = getNextIndex(nums, fast);
                if ((nums[fast] > 0) != direction) break;

                // Cycle detected when pointers meet
                if (slow == fast) {
                    // Check if cycle length > 1 (not self-loop)
                    int nextSlow = getNextIndex(nums, slow);
                    if (nextSlow != slow) {
                        return true;  // Valid cycle found
                    } else {
                        break;  // Self-loop, invalid
                    }
                }
            }

            // Mark all nodes in this path as visited/invalid
            // This is the key optimization for O(n) time
            slow = i;
            while ((nums[slow] > 0) == direction) {
                int nextSlow = getNextIndex(nums, slow);
                nums[slow] = 0;  // Mark as visited
                slow = nextSlow;
            }
        }

        return false;
    }

    // Helper method to calculate next index with circular wrapping
    private int getNextIndex(int[] nums, int current) {
        int n = nums.length;
        // Java's % operator returns negative for negative numbers
        // We add n to ensure positive result, then mod again
        int next = (current + nums[current]) % n;
        if (next < 0) next += n;  // Handle negative wrap-around
        return next;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each index at most twice: once as a starting point, and once when marking it as visited
- The marking optimization ensures we don't re-traverse paths we've already determined are invalid
- Even with the nested while loops, the total operations are linear because we mark nodes as we go

**Space Complexity: O(1)**

- We use only a constant amount of extra space (pointers, direction flag)
- We modify the input array in-place to mark visited nodes, but if we couldn't modify input, we'd need O(n) space for a separate visited array

## Common Mistakes

1. **Not handling negative modulo correctly**: In Python, `-1 % 5 = 4`, but in Java/JavaScript, `-1 % 5 = -1`. You must add the array length to get the correct positive index.

2. **Forgetting to check cycle length > 1**: A single element pointing to itself (like `nums[i] = 0` or `nums[i] = n`) is NOT a valid cycle. You must verify the cycle has at least 2 elements.

3. **Not checking direction consistency throughout the entire cycle**: All elements in a valid cycle must have the same sign (all positive or all negative). A common mistake is only checking the starting element's direction.

4. **Infinite loops in cycle detection**: Without proper visited marking or cycle detection, you can get stuck in an infinite loop when there's a cycle that doesn't return to the starting index but still forms a loop somewhere in the array.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Cycle Detection in Arrays**: Similar to "Find the Duplicate Number" (LeetCode 287) which uses Floyd's algorithm to detect cycles.

2. **Graph Traversal with State Tracking**: Like "Course Schedule" (LeetCode 207) where you mark nodes as visiting/visited to detect cycles in directed graphs.

3. **Two Pointers with Constraints**: Reminiscent of "Linked List Cycle II" (LeetCode 142) but adapted for array traversal with additional direction constraints.

The core technique of marking visited nodes to achieve O(n) time appears in many array traversal problems where you need to avoid redundant work.

## Key Takeaways

1. **Mark visited nodes to optimize**: When you determine a path is invalid, mark all nodes along it so you don't revisit them. This turns what looks like O(n²) into O(n).

2. **Adapt known algorithms to constraints**: Floyd's cycle detection works here, but you need to add direction checking and length validation.

3. **Handle circular arrays carefully**: The modulo operation for circular arrays needs special attention with negative numbers, and language-specific behavior matters.

4. **Validate all problem constraints**: Don't just detect cycles—check direction consistency and minimum length requirements.

[Practice this problem on CodeJeet](/problem/circular-array-loop)
