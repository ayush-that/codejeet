---
title: "How to Solve Assign Elements to Groups with Constraints — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Assign Elements to Groups with Constraints. Medium difficulty, 26.8% acceptance rate. Topics: Array, Hash Table."
date: "2029-11-05"
category: "dsa-patterns"
tags: ["assign-elements-to-groups-with-constraints", "array", "hash-table", "medium"]
---

# How to Solve Assign Elements to Groups with Constraints

You're given two arrays: `groups` (sizes of groups) and `elements` (available elements). Each group needs exactly one element, but an element at index `j` can only be assigned to group `i` if `groups[i] <= elements[j]`. The challenge is to determine if we can assign a unique element to every group. What makes this interesting is that we need to match groups to elements with a size constraint, which resembles matching problems but with a greedy twist.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `groups = [3, 5, 2]`
- `elements = [1, 4, 5, 3]`

**Step 1:** Sort both arrays for easier matching

- Sorted groups: `[2, 3, 5]`
- Sorted elements: `[1, 3, 4, 5]`

**Step 2:** Start with the smallest group (size 2)

- Look for the smallest element that's at least 2
- Element 1 is too small (1 < 2)
- Element 3 works (3 ≥ 2) → assign element 3 to group 2
- Remaining elements: `[1, 4, 5]`

**Step 3:** Move to next group (size 3)

- Look for smallest element ≥ 3
- Element 1 is too small (1 < 3)
- Element 4 works (4 ≥ 3) → assign element 4 to group 3
- Remaining elements: `[1, 5]`

**Step 4:** Move to last group (size 5)

- Look for smallest element ≥ 5
- Element 1 is too small (1 < 5)
- Element 5 works (5 ≥ 5) → assign element 5 to group 5
- All groups assigned!

**Result:** Return `true` since we successfully assigned all groups.

If we had `elements = [1, 2, 3]` instead, we'd fail at step 4 because no element ≥ 5 exists.

## Brute Force Approach

A naive approach would try all possible assignments. For each group, we could:

1. Try assigning every available element that satisfies the constraint
2. Recursively try to assign remaining groups
3. Backtrack if an assignment leads to failure

This is essentially a backtracking search with complexity O(n! \* m) in the worst case, where n is the number of groups and m is the number of elements. The factorial complexity comes from trying all permutations of assignments.

The brute force fails because:

- With just 20 groups, we'd have 20! ≈ 2.4×10¹⁸ possibilities
- Even with pruning, it's impractical for typical constraints
- We need a more efficient matching strategy

## Optimized Approach

The key insight is that this is a **greedy matching problem**. Think about it: if we have to assign the smallest possible element to each group, we should:

1. Sort both arrays so we can process them in order
2. For each group (from smallest to largest), find the smallest available element that fits it
3. Once assigned, that element can't be reused

Why does greedy work here?

- If a small element can satisfy a larger group, it can certainly satisfy a smaller group
- By assigning the smallest fitting element to each group, we leave larger elements available for larger groups
- This minimizes "waste" and maximizes our chances of success

The algorithm becomes:

1. Sort `groups` in ascending order
2. Sort `elements` in ascending order
3. Use two pointers: one for groups, one for elements
4. For each group, advance the element pointer until we find a fitting element
5. If we run out of elements before assigning all groups, return false

This approach runs in O(n log n + m log m) due to sorting, which is much better than factorial time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + m log m) where n = len(groups), m = len(elements)
# Space: O(1) if we ignore sorting memory, O(log n + log m) for sorting
def canAssignGroups(groups, elements):
    # Step 1: Sort both arrays to enable greedy matching
    # Sorting allows us to process groups from smallest to largest
    # and elements from smallest to largest
    groups.sort()
    elements.sort()

    # Step 2: Initialize pointers
    # group_idx tracks which group we're trying to assign
    # elem_idx tracks which element we're considering
    group_idx = 0
    elem_idx = 0

    # Step 3: Try to assign each group
    # We need to assign all groups, so loop until we've processed all
    while group_idx < len(groups) and elem_idx < len(elements):
        # Check if current element can satisfy current group
        if elements[elem_idx] >= groups[group_idx]:
            # Element fits! Assign it to this group
            # Move to next group since this one is satisfied
            group_idx += 1

        # Whether we used this element or not, move to next element
        # If we used it, it's no longer available
        # If it was too small, it can't help any future group (since groups are sorted)
        elem_idx += 1

    # Step 4: Check if we assigned all groups
    # If group_idx reached the end, we successfully assigned all groups
    return group_idx == len(groups)
```

```javascript
// Time: O(n log n + m log m) where n = groups.length, m = elements.length
// Space: O(1) if we ignore sorting memory, O(log n + log m) for sorting
function canAssignGroups(groups, elements) {
  // Step 1: Sort both arrays to enable greedy matching
  // Sorting allows us to process groups from smallest to largest
  // and elements from smallest to largest
  groups.sort((a, b) => a - b);
  elements.sort((a, b) => a - b);

  // Step 2: Initialize pointers
  // groupIdx tracks which group we're trying to assign
  // elemIdx tracks which element we're considering
  let groupIdx = 0;
  let elemIdx = 0;

  // Step 3: Try to assign each group
  // We need to assign all groups, so loop until we've processed all
  while (groupIdx < groups.length && elemIdx < elements.length) {
    // Check if current element can satisfy current group
    if (elements[elemIdx] >= groups[groupIdx]) {
      // Element fits! Assign it to this group
      // Move to next group since this one is satisfied
      groupIdx++;
    }

    // Whether we used this element or not, move to next element
    // If we used it, it's no longer available
    // If it was too small, it can't help any future group (since groups are sorted)
    elemIdx++;
  }

  // Step 4: Check if we assigned all groups
  // If groupIdx reached the end, we successfully assigned all groups
  return groupIdx === groups.length;
}
```

```java
// Time: O(n log n + m log m) where n = groups.length, m = elements.length
// Space: O(1) if we ignore sorting memory, O(log n + log m) for sorting
import java.util.Arrays;

public class Solution {
    public boolean canAssignGroups(int[] groups, int[] elements) {
        // Step 1: Sort both arrays to enable greedy matching
        // Sorting allows us to process groups from smallest to largest
        // and elements from smallest to largest
        Arrays.sort(groups);
        Arrays.sort(elements);

        // Step 2: Initialize pointers
        // groupIdx tracks which group we're trying to assign
        // elemIdx tracks which element we're considering
        int groupIdx = 0;
        int elemIdx = 0;

        // Step 3: Try to assign each group
        // We need to assign all groups, so loop until we've processed all
        while (groupIdx < groups.length && elemIdx < elements.length) {
            // Check if current element can satisfy current group
            if (elements[elemIdx] >= groups[groupIdx]) {
                // Element fits! Assign it to this group
                // Move to next group since this one is satisfied
                groupIdx++;
            }

            // Whether we used this element or not, move to next element
            // If we used it, it's no longer available
            // If it was too small, it can't help any future group (since groups are sorted)
            elemIdx++;
        }

        // Step 4: Check if we assigned all groups
        // If groupIdx reached the end, we successfully assigned all groups
        return groupIdx == groups.length;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + m log m)**

- Sorting `groups` takes O(n log n) where n = len(groups)
- Sorting `elements` takes O(m log m) where m = len(elements)
- The two-pointer scan takes O(n + m) which is dominated by the sorting
- Total: O(n log n + m log m)

**Space Complexity: O(log n + log m)**

- This is the space used by the sorting algorithm (typically quicksort or timsort)
- If we consider the input arrays as given (not counting them as extra space), then it's O(1) extra space
- The two-pointer approach uses only constant extra memory beyond sorting

## Common Mistakes

1. **Forgetting to sort**: The greedy approach only works when both arrays are sorted. Without sorting, you might assign a large element to a small group early on, leaving no elements for larger groups later.

2. **Incorrect pointer movement**: A common error is to only move the element pointer when an assignment happens. You must always move the element pointer because:
   - If the element was used, it's no longer available
   - If the element was too small for the current group, it's also too small for all future groups (since groups are sorted ascending)

3. **Wrong comparison operator**: Using `>` instead of `>=` fails when an element exactly equals the group size. The problem says "group[i] <= elements[j]", so equality is allowed.

4. **Not handling empty arrays**: If `groups` is empty, we should return `true` (all zero groups are assigned). If `elements` is empty but `groups` is not, we should return `false`. The provided code handles these cases correctly.

## When You'll See This Pattern

This "greedy matching with two sorted arrays" pattern appears in several LeetCode problems:

1. **Assign Cookies (LeetCode 455)**: Very similar! Children have greed factors, cookies have sizes. Assign the smallest adequate cookie to each child. The exact same two-pointer greedy approach works.

2. **Boats to Save People (LeetCode 881)**: People have weights, boats have weight limits. Match people to boats using a similar two-pointer approach, though here you can put two people in one boat.

3. **Meeting Rooms II (LeetCode 253)**: While not identical, it uses similar "matching resources to demands" thinking with sorting and greedy allocation.

The core pattern is: when you need to match items from two sets with constraints, and you want to maximize/minimize some metric, sorting + greedy + two pointers is often the solution.

## Key Takeaways

1. **Sorting enables greedy**: When constraints involve comparisons (like `element ≥ group`), sorting both arrays often reveals a simple greedy strategy that's optimal.

2. **Two-pointer scanning**: After sorting, using two pointers to scan through both arrays is an efficient O(n + m) way to find matches without nested loops.

3. **Prove greedy correctness**: For interview problems, be prepared to explain why greedy works. Usually it's because: "If we have a choice, picking the smallest adequate X leaves more options for future choices."

[Practice this problem on CodeJeet](/problem/assign-elements-to-groups-with-constraints)
