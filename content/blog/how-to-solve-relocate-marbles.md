---
title: "How to Solve Relocate Marbles — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Relocate Marbles. Medium difficulty, 51.2% acceptance rate. Topics: Array, Hash Table, Sorting, Simulation."
date: "2029-08-10"
category: "dsa-patterns"
tags: ["relocate-marbles", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Relocate Marbles

You're given the starting positions of marbles and a series of moves where marbles move from one position to another. After all moves, you need to return the sorted list of positions that contain marbles. The challenge is handling multiple marbles at the same position efficiently and ensuring moves are processed correctly when positions overlap.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- `nums = [1, 2, 3, 4]` (marbles at positions 1, 2, 3, 4)
- `moveFrom = [2, 3, 1, 4]` (move marbles from these positions)
- `moveTo = [3, 5, 2, 1]` (to these positions)

**Step-by-step simulation:**

1. **Move 0:** Move marbles from position 2 → position 3
   - Current positions: {1, 3, 4} ∪ {3} = {1, 3, 4}
   - Note: Position 3 already had a marble, now it has two marbles

2. **Move 1:** Move marbles from position 3 → position 5
   - Remove all marbles from position 3 (there are 2 marbles there)
   - Add marbles to position 5
   - Current positions: {1, 4} ∪ {5} = {1, 4, 5}

3. **Move 2:** Move marbles from position 1 → position 2
   - Remove marbles from position 1
   - Add marbles to position 2
   - Current positions: {4, 5} ∪ {2} = {2, 4, 5}

4. **Move 3:** Move marbles from position 4 → position 1
   - Remove marbles from position 4
   - Add marbles to position 1
   - Current positions: {2, 5} ∪ {1} = {1, 2, 5}

**Final result:** [1, 2, 5] (sorted)

The key insight: we need to track which positions have marbles, and when moving, we need to handle cases where multiple marbles might be at the same position, and where moves might overlap (moving to a position that already has marbles).

## Brute Force Approach

A naive approach would be to simulate each move literally by modifying an array or list:

1. Start with the initial positions in a list
2. For each move (moveFrom[i] → moveTo[i]):
   - Find all occurrences of moveFrom[i] in the list
   - Remove all those occurrences
   - Add moveTo[i] to the list (once for each marble moved)
3. Sort the final list and remove duplicates

The problem with this approach is efficiency. Finding all occurrences of a value in a list takes O(n) time, and we need to do this for m moves, giving us O(m × n) time complexity. With n and m up to 10⁵, this becomes O(10¹⁰) operations, which is far too slow.

Additionally, this approach doesn't handle the fact that multiple marbles can be at the same position efficiently. If we have 1000 marbles at position 5, we'd store 1000 copies of "5" in our list, which is wasteful.

## Optimized Approach

The key insight is that we don't need to track individual marbles—we only need to know which positions have at least one marble. This is a **set membership** problem.

**Optimal strategy:**

1. Use a **hash set** to store positions that contain marbles
   - Sets give us O(1) insertion, deletion, and lookup
   - They automatically handle duplicates (multiple marbles at same position)
2. Initialize the set with all starting positions
   - This automatically deduplicates if multiple marbles start at same position

3. For each move (moveFrom[i] → moveTo[i]):
   - Check if moveFrom[i] is in the set (has marbles)
   - If yes: remove it from the set and add moveTo[i]
   - If no: do nothing (no marbles to move from that position)
4. Convert the set to a sorted list and return it

**Why this works:**

- We only care about which positions are occupied, not how many marbles are there
- Moving marbles from position A to B means: if A has marbles, remove A and add B
- If B already has marbles, adding it again does nothing (set property)
- The final set contains all positions with ≥1 marble

**Edge cases handled:**

- Multiple marbles at same position: set stores position once
- Moving to occupied position: set.add() does nothing (already there)
- Moving from empty position: check prevents unnecessary operations
- Large inputs: O(1) operations per move scale to 10⁵ moves

## Optimal Solution

<div class="code-group">

```python
# Time: O((n + m) + k log k) where n = len(nums), m = len(moveFrom), k = final positions
# Space: O(n + m) for the set storing positions
def relocateMarbles(nums, moveFrom, moveTo):
    """
    Simulates moving marbles and returns sorted final positions.

    Args:
        nums: List of initial marble positions
        moveFrom: List of source positions for each move
        moveTo: List of destination positions for each move

    Returns:
        Sorted list of positions containing marbles after all moves
    """
    # Step 1: Create a set of current positions
    # Using a set automatically handles duplicate positions
    positions = set(nums)

    # Step 2: Process each move
    for i in range(len(moveFrom)):
        src = moveFrom[i]
        dst = moveTo[i]

        # Only move if there are marbles at the source position
        if src in positions:
            # Remove marbles from source position
            positions.remove(src)
            # Add marbles to destination position
            # If dst already has marbles, this is a no-op (set property)
            positions.add(dst)

    # Step 3: Convert to sorted list and return
    # Sorting is required by problem statement
    return sorted(positions)
```

```javascript
// Time: O((n + m) + k log k) where n = nums.length, m = moveFrom.length, k = final positions
// Space: O(n + m) for the set storing positions
function relocateMarbles(nums, moveFrom, moveTo) {
  /**
   * Simulates moving marbles and returns sorted final positions.
   *
   * @param {number[]} nums - Initial marble positions
   * @param {number[]} moveFrom - Source positions for each move
   * @param {number[]} moveTo - Destination positions for each move
   * @return {number[]} Sorted list of positions containing marbles after all moves
   */

  // Step 1: Create a Set of current positions
  // Set automatically handles duplicate positions
  const positions = new Set(nums);

  // Step 2: Process each move
  for (let i = 0; i < moveFrom.length; i++) {
    const src = moveFrom[i];
    const dst = moveTo[i];

    // Only move if there are marbles at the source position
    if (positions.has(src)) {
      // Remove marbles from source position
      positions.delete(src);
      // Add marbles to destination position
      // If dst already has marbles, this is a no-op (Set property)
      positions.add(dst);
    }
  }

  // Step 3: Convert to sorted array and return
  // Sorting is required by problem statement
  return Array.from(positions).sort((a, b) => a - b);
}
```

```java
// Time: O((n + m) + k log k) where n = nums.length, m = moveFrom.length, k = final positions
// Space: O(n + m) for the set storing positions
import java.util.*;

class Solution {
    public List<Integer> relocateMarbles(int[] nums, int[] moveFrom, int[] moveTo) {
        /**
         * Simulates moving marbles and returns sorted final positions.
         *
         * @param nums Initial marble positions
         * @param moveFrom Source positions for each move
         * @param moveTo Destination positions for each move
         * @return Sorted list of positions containing marbles after all moves
         */

        // Step 1: Create a HashSet of current positions
        // HashSet automatically handles duplicate positions
        Set<Integer> positions = new HashSet<>();
        for (int num : nums) {
            positions.add(num);
        }

        // Step 2: Process each move
        for (int i = 0; i < moveFrom.length; i++) {
            int src = moveFrom[i];
            int dst = moveTo[i];

            // Only move if there are marbles at the source position
            if (positions.contains(src)) {
                // Remove marbles from source position
                positions.remove(src);
                // Add marbles to destination position
                // If dst already has marbles, this is a no-op (Set property)
                positions.add(dst);
            }
        }

        // Step 3: Convert to sorted list and return
        // Sorting is required by problem statement
        List<Integer> result = new ArrayList<>(positions);
        Collections.sort(result);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization:** O(n) to add all starting positions to the set
- **Processing moves:** O(m) for m moves, with O(1) operations per move (set lookup, removal, addition)
- **Final sorting:** O(k log k) where k is the number of unique final positions
- **Total:** O(n + m + k log k)

In the worst case, k could be O(n + m) if all positions are unique, giving us O((n + m) log(n + m)). This is efficient for the constraints (n, m ≤ 10⁵).

**Space Complexity:**

- **Set storage:** O(n + m) in the worst case, as we might store all starting positions plus all destination positions
- **Result list:** O(k) for the sorted output
- **Total:** O(n + m)

The space usage is optimal because we need to track all positions that might contain marbles.

## Common Mistakes

1. **Not checking if source has marbles before moving:** Some candidates assume every moveFrom position has marbles. If you try to remove a position that's not in the set, you'll get an error (Python/Java) or unexpected behavior.

2. **Using lists instead of sets:** This leads to O(n) lookups and removals per move, making the solution O(n × m) which times out for large inputs. Always ask: "Do I need to track counts or just presence?" If just presence, use a set.

3. **Forgetting to sort the result:** The problem explicitly requires sorted output. Even though sets don't maintain order, you must sort before returning.

4. **Handling multiple marbles incorrectly:** If you track counts with a dictionary/counter, you need to decrement counts when moving and remove the key when count reaches 0. The set approach is simpler since we only care about presence.

5. **Not considering moveTo might equal moveFrom:** If src == dst, we should do nothing. Our solution handles this correctly: we check if src is in positions, remove it, then add dst (which is the same as src), effectively doing nothing.

## When You'll See This Pattern

This problem uses the **set for presence tracking** pattern, which appears in many problems where you need to efficiently track membership and perform add/remove operations.

**Related LeetCode problems:**

1. **Two Sum (Problem 1):** Uses a hash set/map to track seen numbers for O(1) lookups, similar to how we use a set here for O(1) position checks.

2. **Contains Duplicate (Problem 217):** Uses a set to check for duplicates in O(n) time, demonstrating the power of sets for membership testing.

3. **Intersection of Two Arrays (Problem 349):** Uses sets to find common elements efficiently, showing how sets simplify operations on collections.

4. **Design HashSet (Problem 705):** The underlying data structure we're using here—understanding how it works helps optimize solutions.

The core pattern: when you need to track "which items are present" rather than "how many of each item" or "in what order," reach for a hash set.

## Key Takeaways

1. **Sets are ideal for presence tracking:** When you only need to know if something exists (not how many or in what order), use a set for O(1) operations.

2. **Simplify the problem statement:** The problem talks about "marbles" and "moving," but fundamentally it's about tracking which positions are occupied. Always look for the underlying data structure problem.

3. **Check before removing:** When removing from a set/dictionary, always check if the key exists first to avoid errors (or use safe methods like `discard()` in Python).

4. **Read output requirements carefully:** The sorted requirement is easy to miss but crucial. Many interview problems require sorted output.

[Practice this problem on CodeJeet](/problem/relocate-marbles)
