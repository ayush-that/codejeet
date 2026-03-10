---
title: "How to Solve Make Lexicographically Smallest Array by Swapping Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Make Lexicographically Smallest Array by Swapping Elements. Medium difficulty, 60.2% acceptance rate. Topics: Array, Union-Find, Sorting."
date: "2027-06-11"
category: "dsa-patterns"
tags:
  [
    "make-lexicographically-smallest-array-by-swapping-elements",
    "array",
    "union-find",
    "sorting",
    "medium",
  ]
---

# How to Solve "Make Lexicographically Smallest Array by Swapping Elements"

This problem asks us to transform an array into its lexicographically smallest possible form, but with a twist: we can only swap elements if their values are within `limit` of each other. The challenge is that swaps aren't freely available between all elements—they're constrained by value proximity, creating connected groups of elements that can be rearranged among themselves. This makes it more complex than a simple sort.

**What makes this interesting:** Unlike problems where you can swap any elements, here the swapping ability depends on the actual values in the array. Two elements far apart in the array can be swapped if their values are close, while adjacent elements might not be swappable if their values differ too much. This creates a graph-like structure based on value proximity rather than array positions.

## Visual Walkthrough

Let's trace through an example: `nums = [5, 9, 2, 10, 7]` with `limit = 3`

**Step 1: Understanding the swapping constraint**

- We can swap `nums[i]` and `nums[j]` if `|nums[i] - nums[j]| <= 3`
- For example: 5 and 7 can swap (|5-7|=2 ≤ 3), but 5 and 10 cannot (|5-10|=5 > 3)

**Step 2: Identifying connected groups**
Let's sort the array values while tracking their original indices:

Sorted values with original indices:

- 2 (index 2)
- 5 (index 0)
- 7 (index 4)
- 9 (index 1)
- 10 (index 3)

Now group elements where consecutive sorted values are within `limit`:

- Group 1: 2, 5, 7 (all within 3 of each other)
  - 2 and 5: |2-5|=3 ≤ 3 ✓
  - 5 and 7: |5-7|=2 ≤ 3 ✓
- Group 2: 9, 10 (within 3 of each other)
  - 9 and 10: |9-10|=1 ≤ 3 ✓
- Note: 7 and 9: |7-9|=2 ≤ 3, so actually all elements are connected!

Wait, let's check more carefully:

- 2→5: |2-5|=3 ✓
- 5→7: |5-7|=2 ✓
- 7→9: |7-9|=2 ✓
- 9→10: |9-10|=1 ✓

Since each consecutive pair is within limit, ALL elements form one connected group! This means we can rearrange the entire array.

**Step 3: Creating the result**
Original array: [5, 9, 2, 10, 7]
All elements are swappable, so we can sort the entire array: [2, 5, 7, 9, 10]

But what if we had a different example? Let's try `nums = [1, 5, 3, 9, 8]` with `limit = 2`

Sorted with indices:

- 1 (index 0)
- 3 (index 2)
- 5 (index 1)
- 8 (index 4)
- 9 (index 3)

Check consecutive differences:

- 1→3: |1-3|=2 ≤ 2 ✓
- 3→5: |3-5|=2 ≤ 2 ✓
- 5→8: |5-8|=3 > 2 ✗ (break!)
- 8→9: |8-9|=1 ≤ 2 ✓

So we have two groups:

- Group 1: 1, 3, 5 (indices 0, 2, 1)
- Group 2: 8, 9 (indices 4, 3)

Within each group, we can sort the values and place them at the sorted positions of the group's indices.

**Step 4: Building the result**
Group 1: values [1, 3, 5], indices [0, 1, 2] (sorted)

- Put smallest value (1) at smallest index (0)
- Next value (3) at next index (1)
- Last value (5) at last index (2)

Group 2: values [8, 9], indices [3, 4] (sorted)

- Put 8 at index 3, 9 at index 4

Result: [1, 3, 5, 8, 9]

## Brute Force Approach

A naive approach might try to simulate all possible swaps or use BFS/DFS to explore reachable states. However, the state space is enormous—with n elements, there are n! possible permutations. Even if we only consider valid swaps, exploring all reachable states would be exponential.

Another brute force idea: repeatedly scan the array and make any swap that improves lexicographic order. This is like bubble sort with constraints. The problem is it could require O(n²) swaps, and checking if a swap is valid requires checking all pairs, leading to O(n³) time complexity.

```python
# Pseudo-code for naive bubble-sort-like approach
def brute_force(nums, limit):
    n = len(nums)
    changed = True
    while changed:
        changed = False
        for i in range(n):
            for j in range(i+1, n):
                # Check if swap improves order and is valid
                if nums[i] > nums[j] and abs(nums[i] - nums[j]) <= limit:
                    nums[i], nums[j] = nums[j], nums[i]
                    changed = True
    return nums
```

**Why this fails:**

1. O(n³) worst-case time complexity (while loop × nested loops)
2. Might not find optimal arrangement due to local optima
3. Doesn't guarantee lexicographically smallest result

## Optimized Approach

The key insight is that this problem is about **connected components in a value graph**. Think of each element as a node. There's an edge between two elements if their values are within `limit`. Elements in the same connected component can be rearranged arbitrarily among themselves (via transitive swaps).

**Step-by-step reasoning:**

1. **Model as a graph problem**: Each array element is a node. Connect nodes i and j if |nums[i] - nums[j]| ≤ limit.
2. **Observation**: If we sort the array values with their indices, elements with close values will be adjacent in the sorted list.
3. **Better approach**: Sort (value, index) pairs. Then scan the sorted list and group consecutive elements where the value difference ≤ limit.
4. **Within each group**: Collect all indices and all values separately. Sort the indices and values. Assign the smallest value to the smallest index, next value to next index, etc.
5. **Why this works**: Elements in the same group can reach each other through swaps (transitive property). Within a group, we can achieve any permutation.

**Alternative approach using Union-Find**:
We can also solve this with Union-Find (Disjoint Set Union):

1. Sort (value, index) pairs
2. Scan sorted pairs, union indices of consecutive elements if their values are within limit
3. For each component, collect indices and values, sort both, and assign values to indices

Both approaches have similar complexity. The grouping approach is simpler to implement.

## Optimal Solution

Here's the implementation using the grouping approach:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def lexicographicallySmallestArray(nums, limit):
    """
    Transform nums into lexicographically smallest array using swaps
    where |nums[i] - nums[j]| <= limit.

    Approach:
    1. Create list of (value, index) pairs
    2. Sort by value
    3. Group consecutive elements where value difference <= limit
    4. Within each group, sort indices and values separately
    5. Assign sorted values to sorted indices
    """
    n = len(nums)

    # Step 1: Create list of (value, original_index) pairs
    pairs = [(nums[i], i) for i in range(n)]

    # Step 2: Sort pairs by value
    pairs.sort(key=lambda x: x[0])

    # Step 3: Group consecutive elements with value difference <= limit
    groups = []
    current_group = [pairs[0]]  # Start first group with first element

    for i in range(1, n):
        curr_val, curr_idx = pairs[i]
        prev_val, prev_idx = pairs[i-1]

        # If current value is within limit of previous value, add to same group
        if curr_val - prev_val <= limit:
            current_group.append((curr_val, curr_idx))
        else:
            # Start a new group
            groups.append(current_group)
            current_group = [(curr_val, curr_idx)]

    # Don't forget the last group
    groups.append(current_group)

    # Step 4: Process each group
    result = [0] * n

    for group in groups:
        # Extract indices and values from the group
        indices = [idx for _, idx in group]
        values = [val for val, _ in group]

        # Sort indices to assign values in correct positions
        indices.sort()

        # Assign sorted values to sorted indices
        for idx, val in zip(indices, values):
            result[idx] = val

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function lexicographicallySmallestArray(nums, limit) {
  /**
   * Transform nums into lexicographically smallest array using swaps
   * where |nums[i] - nums[j]| <= limit.
   *
   * Approach:
   * 1. Create array of [value, index] pairs
   * 2. Sort by value
   * 3. Group consecutive elements where value difference <= limit
   * 4. Within each group, sort indices and values separately
   * 5. Assign sorted values to sorted indices
   */
  const n = nums.length;

  // Step 1: Create array of [value, index] pairs
  const pairs = nums.map((value, index) => [value, index]);

  // Step 2: Sort pairs by value
  pairs.sort((a, b) => a[0] - b[0]);

  // Step 3: Group consecutive elements with value difference <= limit
  const groups = [];
  let currentGroup = [pairs[0]]; // Start first group with first element

  for (let i = 1; i < n; i++) {
    const currVal = pairs[i][0];
    const prevVal = pairs[i - 1][0];

    // If current value is within limit of previous value, add to same group
    if (currVal - prevVal <= limit) {
      currentGroup.push(pairs[i]);
    } else {
      // Start a new group
      groups.push(currentGroup);
      currentGroup = [pairs[i]];
    }
  }

  // Don't forget the last group
  groups.push(currentGroup);

  // Step 4: Process each group
  const result = new Array(n);

  for (const group of groups) {
    // Extract indices and values from the group
    const indices = group.map((pair) => pair[1]);
    const values = group.map((pair) => pair[0]);

    // Sort indices to assign values in correct positions
    indices.sort((a, b) => a - b);

    // Assign sorted values to sorted indices
    for (let i = 0; i < indices.length; i++) {
      result[indices[i]] = values[i];
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int[] lexicographicallySmallestArray(int[] nums, int limit) {
        /**
         * Transform nums into lexicographically smallest array using swaps
         * where |nums[i] - nums[j]| <= limit.
         *
         * Approach:
         * 1. Create list of [value, index] pairs
         * 2. Sort by value
         * 3. Group consecutive elements where value difference <= limit
         * 4. Within each group, sort indices and values separately
         * 5. Assign sorted values to sorted indices
         */
        int n = nums.length;

        // Step 1: Create array of pairs (value, index)
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; i++) {
            pairs[i][0] = nums[i];
            pairs[i][1] = i;
        }

        // Step 2: Sort pairs by value
        Arrays.sort(pairs, (a, b) -> Integer.compare(a[0], b[0]));

        // Step 3: Group consecutive elements with value difference <= limit
        List<List<int[]>> groups = new ArrayList<>();
        List<int[]> currentGroup = new ArrayList<>();
        currentGroup.add(pairs[0]);  // Start first group with first element

        for (int i = 1; i < n; i++) {
            int currVal = pairs[i][0];
            int prevVal = pairs[i-1][0];

            // If current value is within limit of previous value, add to same group
            if (currVal - prevVal <= limit) {
                currentGroup.add(pairs[i]);
            } else {
                // Start a new group
                groups.add(currentGroup);
                currentGroup = new ArrayList<>();
                currentGroup.add(pairs[i]);
            }
        }

        // Don't forget the last group
        groups.add(currentGroup);

        // Step 4: Process each group
        int[] result = new int[n];

        for (List<int[]> group : groups) {
            // Extract indices and values from the group
            List<Integer> indices = new ArrayList<>();
            List<Integer> values = new ArrayList<>();

            for (int[] pair : group) {
                values.add(pair[0]);
                indices.add(pair[1]);
            }

            // Sort indices to assign values in correct positions
            Collections.sort(indices);

            // Assign sorted values to sorted indices
            for (int i = 0; i < indices.size(); i++) {
                result[indices.get(i)] = values.get(i);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Creating pairs: O(n)
- Sorting pairs by value: O(n log n)
- Grouping elements: O(n)
- Sorting indices within each group: In total O(n log n) across all groups (each element sorted once)
- Total: O(n log n) dominated by sorting

**Space Complexity: O(n)**

- Storing pairs: O(n)
- Storing groups: O(n)
- Result array: O(n)
- Total: O(n)

The O(n log n) time is optimal because we need to sort values to identify connected components. The O(n) space is for storing intermediate data structures.

## Common Mistakes

1. **Forgetting that swaps are transitive**: Some candidates think only directly swappable pairs can exchange elements. Actually, if A can swap with B, and B can swap with C, then A can eventually swap with C through B. This transitive property is why we can form connected components.

2. **Incorrect grouping logic**: When scanning sorted pairs, you must check `currVal - prevVal <= limit` (not absolute value since we're scanning in sorted order). Also, remember to handle the last group after the loop ends.

3. **Not sorting indices within groups**: After grouping, you must sort the indices within each group before assigning values. If you assign the smallest value to a random index in the group, you might break lexicographic order.

4. **Confusing array positions with values**: Remember that the swapping constraint depends on VALUES (`|nums[i] - nums[j]| ≤ limit`), not on indices. Two elements can swap regardless of their positions if their values are close enough.

## When You'll See This Pattern

This problem uses the **"connected components in value/constraint space"** pattern, which appears in several LeetCode problems:

1. **Smallest String With Swaps (Medium)**: You're given pairs of indices that can be swapped arbitrarily. Within each connected component of indices (formed by the swap pairs), you can rearrange characters freely. Very similar structure but with explicit swap pairs instead of value-based constraints.

2. **Minimize Hamming Distance After Swap Operations (Medium)**: Given source and target arrays and allowed swap pairs, minimize Hamming distance. Again uses connected components formed by swap pairs.

3. **Similar String Groups (Hard)**: Groups strings where each string is similar to others in its group (by edit distance). Forms connected components based on similarity.

The pattern: When you have elements that can be rearranged within groups but not between groups, and groups are defined by some constraint (value proximity, explicit swap pairs, similarity), think about:

1. Identifying connected components
2. Processing each component independently
3. Within each component, you can optimally arrange elements (usually by sorting)

## Key Takeaways

1. **Constraint-based swapping creates connected components**: When swaps are allowed only under certain conditions, elements form connected components where rearrangement is free within each component but impossible between components.

2. **Sort to reveal structure**: Sorting values (often with their indices) is a powerful technique to identify which elements are "close enough" to be in the same component.

3. **Two-phase approach works well**: First identify components (using sorting or Union-Find), then process each component independently. Within each component, you typically sort elements to achieve the optimal arrangement.

**Related problems**: [Smallest String With Swaps](/problem/smallest-string-with-swaps), [Minimize Hamming Distance After Swap Operations](/problem/minimize-hamming-distance-after-swap-operations)
