---
title: "How to Solve Group the People Given the Group Size They Belong To — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Group the People Given the Group Size They Belong To. Medium difficulty, 87.5% acceptance rate. Topics: Array, Hash Table, Greedy."
date: "2028-05-13"
category: "dsa-patterns"
tags:
  [
    "group-the-people-given-the-group-size-they-belong-to",
    "array",
    "hash-table",
    "greedy",
    "medium",
  ]
---

# How to Solve "Group the People Given the Group Size They Belong To"

You’re given an array `groupSizes` where `groupSizes[i]` tells you the size of the group that person `i` must belong to. Your task is to reconstruct the actual grouping of people into valid groups where each group has exactly the size specified for every member in it. The tricky part is that you don’t know beforehand how many groups there are or which people belong together—you only know each person’s required group size. This problem is interesting because it requires matching people with the same group size while dynamically forming groups as they fill up.

## Visual Walkthrough

Let’s walk through a concrete example to build intuition. Suppose we have `groupSizes = [3, 3, 3, 3, 3, 1, 3]`. There are 7 people (IDs 0–6). Their required group sizes are:

- Persons 0, 1, 2, 3, 4, 6 → group size 3
- Person 5 → group size 1

We need to form valid groups. A valid group of size 3 must contain exactly 3 people who all require group size 3. A group of size 1 must contain exactly 1 person who requires group size 1.

Step-by-step grouping:

1. Start with an empty mapping from group size to a list of people waiting to form a group of that size.
2. Process person 0 (group size 3): Add 0 to the list for size 3 → `{3: [0]}`
3. Process person 1 (group size 3): Add 1 to the list for size 3 → `{3: [0, 1]}`
4. Process person 2 (group size 3): Add 2 to the list for size 3 → `{3: [0, 1, 2]}`. Now we have exactly 3 people for size 3, so we can form a group `[0, 1, 2]`. Reset the list for size 3 to empty.
5. Process person 3 (group size 3): Add 3 to the (now empty) list for size 3 → `{3: [3]}`
6. Process person 4 (group size 3): Add 4 → `{3: [3, 4]}`
7. Process person 5 (group size 1): Add 5 to the list for size 1 → `{1: [5]}`. Since the required size is 1, we immediately form a group `[5]` and reset the list for size 1.
8. Process person 6 (group size 3): Add 6 → `{3: [3, 4, 6]}`. Now we have 3 people again, so form group `[3, 4, 6]`.

Final groups: `[[0, 1, 2], [5], [3, 4, 6]]`. Notice that all groups satisfy: each person in a group of size `k` has `groupSizes[i] = k`.

## Brute Force Approach

A naive approach might try to brute-force all possible groupings. For each person, you could try placing them into existing groups or starting new groups, checking all combinations. This would involve backtracking or generating all partitions of the set of people, which is astronomically slow—O(n^n) in the worst case. Even for small n, this is infeasible.

Another naive idea: sort people by their group size, then try to group them sequentially. But simply sorting doesn’t tell you when to cut off a group—you need to track when you’ve collected exactly `k` people for a group of size `k`. Without careful tracking, you might incorrectly merge people across group boundaries.

The brute force teaches us that we need a way to collect people by their required group size and detect when we have exactly enough to form a valid group.

## Optimized Approach

The key insight is that **people with the same required group size can be placed together, but only up to exactly that many per group**. This leads to a greedy, hash-map-based solution:

1. Use a dictionary/hash map where keys are group sizes and values are lists of people currently waiting to form a group of that size.
2. Iterate through each person `i`:
   - Add `i` to the list for `groupSizes[i]`.
   - If the list’s length equals the required group size, that means we’ve collected exactly enough people to form a valid group. So, take all people in that list, add them as a group to the answer, and clear the list (since those people are now assigned).
3. Continue until all people are processed.

Why does this work? Because whenever we have exactly `k` people who all require group size `k`, they must form a group together—there’s no reason to split them or wait for others. This greedy grouping is safe because:

- Each person appears in exactly one group (we remove them from the waiting list once grouped).
- Every group formed has exactly the required size for all its members.
- The process is deterministic and runs in linear time.

This is essentially a **bucketing with immediate grouping** strategy. It’s similar to filling buckets of size `k` and emptying them as soon as they’re full.

## Optimal Solution

Here’s the implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) — we process each person exactly once
# Space: O(n) — in the worst case, the hash map holds all n people before grouping
def groupThePeople(groupSizes):
    """
    Groups people such that each group has size equal to each member's required size.
    Args:
        groupSizes: List[int] where groupSizes[i] is the required group size for person i
    Returns:
        List[List[int]]: List of groups, each group is a list of person IDs
    """
    # Map group size -> list of people currently waiting to form a group of that size
    size_to_people = {}
    result = []

    for person_id, required_size in enumerate(groupSizes):
        # Step 1: Add current person to the waiting list for their required size
        # If this size hasn't been seen before, initialize an empty list
        if required_size not in size_to_people:
            size_to_people[required_size] = []
        size_to_people[required_size].append(person_id)

        # Step 2: Check if the waiting list for this size is now full
        # If we have exactly 'required_size' people waiting, they form a complete group
        if len(size_to_people[required_size]) == required_size:
            # Add the complete group to the result
            result.append(size_to_people[required_size])
            # Clear the waiting list for this size so new people can start forming the next group
            size_to_people[required_size] = []

    return result
```

```javascript
// Time: O(n) — one pass through the array
// Space: O(n) — hash map may store up to n elements
function groupThePeople(groupSizes) {
  /**
   * Groups people such that each group has size equal to each member's required size.
   * @param {number[]} groupSizes - groupSizes[i] is the required group size for person i
   * @return {number[][]} - List of groups, each group is an array of person IDs
   */
  // Map group size -> array of people waiting to form a group of that size
  const sizeToPeople = new Map();
  const result = [];

  for (let personId = 0; personId < groupSizes.length; personId++) {
    const requiredSize = groupSizes[personId];

    // Step 1: Add current person to the waiting list for their required size
    // If this size isn't in the map yet, initialize an empty array
    if (!sizeToPeople.has(requiredSize)) {
      sizeToPeople.set(requiredSize, []);
    }
    const waitingList = sizeToPeople.get(requiredSize);
    waitingList.push(personId);

    // Step 2: Check if the waiting list for this size is now full
    // If we have exactly 'requiredSize' people waiting, they form a complete group
    if (waitingList.length === requiredSize) {
      // Add the complete group to the result (make a copy to avoid reference issues)
      result.push([...waitingList]);
      // Clear the waiting list for this size
      sizeToPeople.set(requiredSize, []);
    }
  }

  return result;
}
```

```java
// Time: O(n) — single iteration over the array
// Space: O(n) — HashMap may store all n people before grouping
import java.util.*;

class Solution {
    public List<List<Integer>> groupThePeople(int[] groupSizes) {
        /**
         * Groups people such that each group has size equal to each member's required size.
         * @param groupSizes - groupSizes[i] is the required group size for person i
         * @return List of groups, each group is a list of person IDs
         */
        // Map group size -> list of people waiting to form a group of that size
        Map<Integer, List<Integer>> sizeToPeople = new HashMap<>();
        List<List<Integer>> result = new ArrayList<>();

        for (int personId = 0; personId < groupSizes.length; personId++) {
            int requiredSize = groupSizes[personId];

            // Step 1: Add current person to the waiting list for their required size
            // If this size isn't in the map yet, create a new ArrayList
            sizeToPeople.putIfAbsent(requiredSize, new ArrayList<>());
            List<Integer> waitingList = sizeToPeople.get(requiredSize);
            waitingList.add(personId);

            // Step 2: Check if the waiting list for this size is now full
            // If we have exactly 'requiredSize' people waiting, they form a complete group
            if (waitingList.size() == requiredSize) {
                // Add the complete group to the result (create a new list to avoid reference issues)
                result.add(new ArrayList<>(waitingList));
                // Clear the waiting list for this size
                waitingList.clear();
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `groupSizes`. We iterate through each person exactly once, and each hash map operation (insert, lookup, append) is O(1) on average.
- **Space Complexity:** O(n) in the worst case. The hash map stores lists of people waiting to be grouped. In the worst case (e.g., all people have the same large group size), we might store almost all people before forming a group. The output list also stores all people, but that’s required by the problem and usually not counted toward auxiliary space. If we do count it, total space is O(n).

## Common Mistakes

1. **Not clearing the waiting list after forming a group:** If you forget to reset the list for a given size, you’ll keep adding people to the same list, creating oversized groups that violate the size requirement. Always clear the list immediately after adding a group to the result.

2. **Assuming groups are contiguous in the input:** The problem doesn’t say people with the same group size appear consecutively. Your solution must handle cases where people with the same required size are scattered throughout the array.

3. **Using an array instead of a hash map for storage:** Since group sizes can be up to `n`, an array of size `n` would work, but it’s less intuitive and wastes space if group sizes are sparse. A hash map is more natural and efficient for this problem.

4. **Forgetting to handle the immediate grouping for size 1:** When a person requires group size 1, they should form a group immediately. The algorithm naturally handles this because when you add them to the waiting list, the list length becomes 1, which equals the required size, triggering group formation.

## When You’ll See This Pattern

This **bucketing with immediate flush** pattern appears in problems where you need to collect items by a key and process them as soon as you have a complete set. Similar problems:

1. **Rabbits in Forest (Medium):** In this problem, each rabbit says how many other rabbits have the same color. You need to determine the minimum number of rabbits in the forest. The solution involves grouping rabbits by their claimed number and applying similar logic: if `k+1` rabbits claim there are `k` others with the same color, they can all be the same color. This requires grouping and counting similar to our problem.

2. **Maximum Number of Groups With Increasing Length (Hard):** This is a more complex variant where you need to form groups of increasing sizes under constraints. It builds on the same fundamental idea of grouping items by size requirements while managing counts.

3. **Task Scheduler (Medium):** While not identical, it also involves grouping tasks with constraints and managing counts to determine optimal scheduling. The pattern of collecting items and processing when a threshold is met is similar.

## Key Takeaways

- **Greedy grouping works when you can form groups as soon as you have enough members** that satisfy the condition. There’s no benefit to waiting or rearranging.
- **Hash maps are ideal for grouping items by a key** when the keys are not contiguous or known ahead of time. Use the key (group size) to collect items and track counts.
- **Always check for “full group” condition immediately after adding an item** to avoid off-by-one errors and ensure groups are formed at the right moment.

Related problems: [Rabbits in Forest](/problem/rabbits-in-forest), [Maximum Number of Groups With Increasing Length](/problem/maximum-number-of-groups-with-increasing-length)
