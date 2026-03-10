---
title: "How to Solve Queue Reconstruction by Height — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Queue Reconstruction by Height. Medium difficulty, 74.6% acceptance rate. Topics: Array, Binary Indexed Tree, Segment Tree, Sorting."
date: "2027-10-21"
category: "dsa-patterns"
tags: ["queue-reconstruction-by-height", "array", "binary-indexed-tree", "segment-tree", "medium"]
---

# How to Solve Queue Reconstruction by Height

You're given a list of people where each person is represented by `[height, k]`, where `k` is the number of people in front of them who are at least as tall. Your task is to reconstruct the queue so that each person's `k` value correctly matches their position. The tricky part is that every insertion affects the counts for people already placed, making this a classic "insertion order matters" problem.

## Visual Walkthrough

Let's trace through a concrete example: `people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]`

**Step 1: Sort people by height (descending) and k (ascending)**

- Tallest people first: `[7,0]`, `[7,1]`, `[6,1]`, `[5,0]`, `[5,2]`, `[4,4]`
- When heights are equal, sort by k ascending so people with fewer taller/equal-height people in front come first

**Step 2: Insert people one by one at position k**
We'll build our result queue from an empty list:

1. Insert `[7,0]` at index 0 → `[[7,0]]`
2. Insert `[7,1]` at index 1 → `[[7,0],[7,1]]`
   - The 1 means: "1 person in front with height ≥ 7"
   - Currently only `[7,0]` is in front, which satisfies k=1
3. Insert `[6,1]` at index 1 → `[[7,0],[6,1],[7,1]]`
   - The 1 means: "1 person in front with height ≥ 6"
   - At index 1, there's exactly 1 person in front (`[7,0]`) with height ≥ 6
4. Insert `[5,0]` at index 0 → `[[5,0],[7,0],[6,1],[7,1]]`
   - The 0 means: "0 people in front with height ≥ 5"
   - At index 0, there are 0 people in front
5. Insert `[5,2]` at index 2 → `[[5,0],[7,0],[5,2],[6,1],[7,1]]`
   - The 2 means: "2 people in front with height ≥ 5"
   - At index 2, there are exactly 2 people in front (`[5,0]` and `[7,0]`) with height ≥ 5
6. Insert `[4,4]` at index 4 → `[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]`
   - The 4 means: "4 people in front with height ≥ 4"
   - At index 4, there are exactly 4 people in front with height ≥ 4

Final queue: `[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]`

**Why this works**: When we insert taller people first, each new person we insert is shorter than or equal to everyone already placed. Therefore, when we insert a person at position `k`, we're essentially saying: "Place me where there are exactly `k` people already in the queue who are at least as tall as me." Since everyone already placed is at least as tall, we can simply count positions.

## Brute Force Approach

A naive approach would be to try all permutations of the people and check which permutation satisfies all the `k` constraints. For each permutation, we'd need to verify for each person that exactly `k` people before them have height ≥ their height.

```python
# Brute force - try all permutations
from itertools import permutations

def reconstructQueueBruteForce(people):
    for perm in permutations(people):
        valid = True
        for i, (h, k) in enumerate(perm):
            # Count how many people before position i have height >= h
            count = 0
            for j in range(i):
                if perm[j][0] >= h:
                    count += 1
            if count != k:
                valid = False
                break
        if valid:
            return list(perm)
    return []
```

**Why this fails**: With `n` people, there are `n!` permutations. For each permutation, we check `n` people, and for each person we check up to `n` previous people. This gives us `O(n! × n²)` time complexity, which is completely impractical for even modest `n` (like `n = 10` gives us over 36 million operations).

## Optimized Approach

The key insight is that we should process people in a specific order to make the insertion decisions independent. Here's the step-by-step reasoning:

1. **Sort by height descending, then by k ascending**:
   - Tallest people first because their `k` value depends only on other tall people
   - When heights are equal, people with smaller `k` come first since they need fewer people in front

2. **Insert each person at position `k` in the result list**:
   - When we insert a shorter person, all people already in the queue are at least as tall
   - Therefore, inserting at position `k` guarantees exactly `k` people in front with height ≥ current height
   - The insertion position `k` serves as both the count requirement AND the actual index

3. **Why insertion works**:
   - Taller people are placed first, so when we insert a person, everyone already placed is at least as tall
   - The `k` value tells us exactly where to insert: at index `k`
   - This works because indices 0 through `k-1` contain exactly `k` people who are at least as tall

This greedy approach works because at each step, we're making a locally optimal choice (placing the current person at the correct position relative to already-placed people) that leads to a globally optimal solution.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) - for n insertions, each taking O(n) time in worst case
# Space: O(n) - for the output list
def reconstructQueue(people):
    """
    Reconstructs the queue based on height and k values.

    Steps:
    1. Sort people by height descending, then by k ascending
    2. Insert each person at index k in the result list

    Why this works: When we insert taller people first, each new person
    is shorter than everyone already placed, so k directly gives us
    the insertion index.
    """
    # Step 1: Sort by height descending, then by k ascending
    # People with same height: smaller k comes first
    people.sort(key=lambda x: (-x[0], x[1]))

    # Step 2: Initialize result list
    result = []

    # Step 3: Insert each person at position k
    for person in people:
        # person[1] is the k value - insert at this index
        # This works because all people already in result are >= current height
        result.insert(person[1], person)

    return result
```

```javascript
// Time: O(n²) - for n insertions, each taking O(n) time in worst case
// Space: O(n) - for the output array
/**
 * Reconstructs the queue based on height and k values.
 *
 * Steps:
 * 1. Sort people by height descending, then by k ascending
 * 2. Insert each person at index k in the result array
 *
 * Why this works: When we insert taller people first, each new person
 * is shorter than everyone already placed, so k directly gives us
 * the insertion index.
 */
function reconstructQueue(people) {
  // Step 1: Sort by height descending, then by k ascending
  // People with same height: smaller k comes first
  people.sort((a, b) => {
    if (a[0] !== b[0]) {
      return b[0] - a[0]; // Height descending
    }
    return a[1] - b[1]; // k ascending for same height
  });

  // Step 2: Initialize result array
  const result = [];

  // Step 3: Insert each person at position k
  for (const person of people) {
    // person[1] is the k value - insert at this index
    // This works because all people already in result are >= current height
    result.splice(person[1], 0, person);
  }

  return result;
}
```

```java
// Time: O(n²) - for n insertions, each taking O(n) time in worst case
// Space: O(n) - for the output list
import java.util.*;

class Solution {
    /**
     * Reconstructs the queue based on height and k values.
     *
     * Steps:
     * 1. Sort people by height descending, then by k ascending
     * 2. Insert each person at index k in the result list
     *
     * Why this works: When we insert taller people first, each new person
     * is shorter than everyone already placed, so k directly gives us
     * the insertion index.
     */
    public int[][] reconstructQueue(int[][] people) {
        // Step 1: Sort by height descending, then by k ascending
        // People with same height: smaller k comes first
        Arrays.sort(people, (a, b) -> {
            if (a[0] != b[0]) {
                return b[0] - a[0]; // Height descending
            }
            return a[1] - b[1]; // k ascending for same height
        });

        // Step 2: Initialize result list
        List<int[]> result = new ArrayList<>();

        // Step 3: Insert each person at position k
        for (int[] person : people) {
            // person[1] is the k value - insert at this index
            // This works because all people already in result are >= current height
            result.add(person[1], person);
        }

        // Step 4: Convert list back to array
        return result.toArray(new int[people.length][2]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Sorting takes O(n log n) time
- Inserting `n` people into a list/array takes O(n²) in worst case because each `insert`/`splice`/`add(index, element)` operation can take O(n) time to shift elements
- The O(n²) term dominates, so overall time is O(n²)

**Space Complexity: O(n)**

- We need O(n) space for the output list/array
- Sorting may use O(log n) or O(n) additional space depending on the language's sort implementation, but this doesn't change the O(n) overall space complexity

**Note**: There's an O(n log n) solution using Fenwick Tree (Binary Indexed Tree) or Segment Tree, but it's more complex and rarely expected in interviews. The O(n²) solution is typically acceptable for this problem.

## Common Mistakes

1. **Sorting incorrectly**: Sorting by height ascending or by k descending first will break the algorithm. Remember: height descending, then k ascending.
   - Fix: Always sort with `(-height, k)` in Python or equivalent in other languages.

2. **Using the wrong data structure for insertion**: Using a regular array without efficient insertion (like Python list) gives O(n²) time. Some candidates try to use linked lists for O(1) insertion, but finding the insertion point would still be O(n).
   - Fix: Accept the O(n²) complexity or implement the advanced Fenwick Tree solution.

3. **Misunderstanding the k value**: k counts people with height **greater than or equal to**, not just greater than. This affects the sorting logic.
   - Fix: When heights are equal, sort by k ascending so people with fewer requirements come first.

4. **Forgetting to handle empty input**: Always check for edge cases like empty array or single person.
   - Fix: The algorithm handles these naturally, but mention it in interviews.

## When You'll See This Pattern

This "sort then insert at specific position" pattern appears in problems where:

1. Elements have constraints relative to other elements
2. Processing in a specific order makes decisions independent
3. The constraint is about counts of elements with certain properties

**Related problems:**

1. **Count of Smaller Numbers After Self (Hard)**: Similar constraint counting, but requires more advanced data structures (Fenwick Tree/Segment Tree) for efficiency.
2. **Insert Interval (Medium)**: Also involves inserting elements at specific positions based on constraints.
3. **Merge Intervals (Medium)**: Similar pattern of sorting first to make the problem tractable.

## Key Takeaways

1. **Sorting transforms constraints**: When elements have relative constraints, sorting by one attribute can simplify how you satisfy the other constraints.
2. **Greedy insertion works when order matters**: If you process elements in the right order (like tallest first), you can use greedy insertion where each element's constraint directly gives its position.
3. **k as index is a powerful insight**: Recognizing that a count constraint can serve as an insertion index is the key breakthrough for this problem.

**Pattern recognition**: When you see problems about arranging elements with "X elements before/after having property Y", consider if sorting can help and if counts can translate to positions.

Related problems: [Count of Smaller Numbers After Self](/problem/count-of-smaller-numbers-after-self), [Reward Top K Students](/problem/reward-top-k-students)
