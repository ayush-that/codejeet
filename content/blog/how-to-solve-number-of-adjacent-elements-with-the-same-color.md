---
title: "How to Solve Number of Adjacent Elements With the Same Color — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Adjacent Elements With the Same Color. Medium difficulty, 58.1% acceptance rate. Topics: Array."
date: "2029-05-11"
category: "dsa-patterns"
tags: ["number-of-adjacent-elements-with-the-same-color", "array", "medium"]
---

# How to Solve Number of Adjacent Elements With the Same Color

This problem asks us to maintain a dynamic count of adjacent elements with the same color as we process queries that update individual positions in an array. The challenge is that each update can affect at most two adjacent relationships (left and right neighbors), but a brute force recount of all adjacent pairs after every query would be too slow. The key insight is to track how each query changes the count rather than recomputing it from scratch.

## Visual Walkthrough

Let's walk through a small example: `n = 4`, `queries = [[0, 2], [1, 3], [1, 2], [2, 2]]`

Initially: `colors = [0, 0, 0, 0]` and `count = 0` (no adjacent pairs have the same color)

**Query 1:** `[0, 2]`

- Set `colors[0] = 2`
- Check left neighbor: index -1 doesn't exist, so no change
- Check right neighbor: `colors[1] = 0` (different from 2), so no change
- Count remains 0
- Output: 0

**Query 2:** `[1, 3]`

- Set `colors[1] = 3`
- Check left neighbor: `colors[0] = 2` (different from 3), so no change
- Check right neighbor: `colors[2] = 0` (different from 3), so no change
- Count remains 0
- Output: 0

**Query 3:** `[1, 2]`

- **Before update:** `colors[1] = 3`
- Check left neighbor: `colors[0] = 2`
  - Before: 2 ≠ 3, so this pair didn't contribute to count
  - After: 2 = 2, so this pair WILL contribute to count
  - Change: +1 to count
- Check right neighbor: `colors[2] = 0`
  - Before: 3 ≠ 0, so no contribution
  - After: 2 ≠ 0, so still no contribution
  - Change: 0
- Set `colors[1] = 2`
- Count becomes 1
- Output: 1

**Query 4:** `[2, 2]`

- **Before update:** `colors[2] = 0`
- Check left neighbor: `colors[1] = 2`
  - Before: 2 ≠ 0, so no contribution
  - After: 2 = 2, so this pair WILL contribute
  - Change: +1 to count
- Check right neighbor: `colors[3] = 0`
  - Before: 0 = 0, so this pair DID contribute
  - After: 2 ≠ 0, so this pair will NOT contribute
  - Change: -1 to count
- Set `colors[2] = 2`
- Count becomes 1 + 1 - 1 = 1
- Output: 1

Final output: `[0, 0, 1, 1]`

## Brute Force Approach

The most straightforward approach would be to:

1. Initialize an array of zeros with length `n`
2. For each query:
   - Update the color at the given index
   - Scan through the entire array, counting how many adjacent pairs have the same color
   - Add this count to the result

This approach is simple to implement but extremely inefficient. With `n` elements and `q` queries, the time complexity would be O(n × q), which is too slow for the constraints (n and q can be up to 10^5, making O(10^10) operations).

The brute force fails because it doesn't leverage the crucial observation: each query only affects at most two adjacent relationships (with left and right neighbors). Recomputing all n-1 relationships after each update is wasteful.

## Optimized Approach

The key insight is that when we update a single element at index `i`, only its relationships with its left neighbor (at `i-1`) and right neighbor (at `i+1`) can change. We don't need to check any other pairs in the array.

Here's the step-by-step reasoning:

1. **Initial state**: All elements are 0 (uncolored), so no adjacent elements have the same color. Count starts at 0.

2. **For each query** `[index, color]`:
   - **Before updating**: Check the current color at `index` and compare it with:
     - Left neighbor (if `index > 0`): If they're equal, this pair currently contributes to the count
     - Right neighbor (if `index < n-1`): If they're equal, this pair currently contributes to the count
   - **Update**: Change the color at `index` to the new color
   - **After updating**: Check the new color at `index` and compare it with:
     - Left neighbor: If they're equal now, this pair contributes to the count
     - Right neighbor: If they're equal now, this pair contributes to the count
   - **Update count**: For each neighbor, if the relationship changed from "equal" to "not equal", decrement count. If it changed from "not equal" to "equal", increment count.

3. **Track the count**: Maintain a running count that we update after each query, and append it to our result list.

This approach gives us O(1) time per neighbor check, and since we only check 2 neighbors per query, the overall time complexity is O(q), where q is the number of queries.

## Optimal Solution

<div class="code-group">

```python
# Time: O(q) where q is the number of queries
# Space: O(n) for the colors array
def colorTheArray(n, queries):
    # Initialize all elements as 0 (uncolored)
    colors = [0] * n
    # Initialize count of adjacent same-color pairs
    count = 0
    # List to store results for each query
    result = []

    for index, new_color in queries:
        # Check left neighbor if it exists
        if index > 0:
            old_left_same = colors[index] == colors[index - 1]
            new_left_same = new_color == colors[index - 1]

            # Update count based on change in left relationship
            if old_left_same and not new_left_same:
                count -= 1
            elif not old_left_same and new_left_same:
                count += 1

        # Check right neighbor if it exists
        if index < n - 1:
            old_right_same = colors[index] == colors[index + 1]
            new_right_same = new_color == colors[index + 1]

            # Update count based on change in right relationship
            if old_right_same and not new_right_same:
                count -= 1
            elif not old_right_same and new_right_same:
                count += 1

        # Update the color at the current index
        colors[index] = new_color
        # Append the current count to results
        result.append(count)

    return result
```

```javascript
// Time: O(q) where q is the number of queries
// Space: O(n) for the colors array
function colorTheArray(n, queries) {
  // Initialize all elements as 0 (uncolored)
  const colors = new Array(n).fill(0);
  // Initialize count of adjacent same-color pairs
  let count = 0;
  // Array to store results for each query
  const result = [];

  for (const [index, newColor] of queries) {
    // Check left neighbor if it exists
    if (index > 0) {
      const oldLeftSame = colors[index] === colors[index - 1];
      const newLeftSame = newColor === colors[index - 1];

      // Update count based on change in left relationship
      if (oldLeftSame && !newLeftSame) {
        count--;
      } else if (!oldLeftSame && newLeftSame) {
        count++;
      }
    }

    // Check right neighbor if it exists
    if (index < n - 1) {
      const oldRightSame = colors[index] === colors[index + 1];
      const newRightSame = newColor === colors[index + 1];

      // Update count based on change in right relationship
      if (oldRightSame && !newRightSame) {
        count--;
      } else if (!oldRightSame && newRightSame) {
        count++;
      }
    }

    // Update the color at the current index
    colors[index] = newColor;
    // Append the current count to results
    result.push(count);
  }

  return result;
}
```

```java
// Time: O(q) where q is the number of queries
// Space: O(n) for the colors array
import java.util.*;

class Solution {
    public int[] colorTheArray(int n, int[][] queries) {
        // Initialize all elements as 0 (uncolored)
        int[] colors = new int[n];
        // Initialize count of adjacent same-color pairs
        int count = 0;
        // Array to store results for each query
        int[] result = new int[queries.length];

        for (int i = 0; i < queries.length; i++) {
            int index = queries[i][0];
            int newColor = queries[i][1];

            // Check left neighbor if it exists
            if (index > 0) {
                boolean oldLeftSame = colors[index] == colors[index - 1];
                boolean newLeftSame = newColor == colors[index - 1];

                // Update count based on change in left relationship
                if (oldLeftSame && !newLeftSame) {
                    count--;
                } else if (!oldLeftSame && newLeftSame) {
                    count++;
                }
            }

            // Check right neighbor if it exists
            if (index < n - 1) {
                boolean oldRightSame = colors[index] == colors[index + 1];
                boolean newRightSame = newColor == colors[index + 1];

                // Update count based on change in right relationship
                if (oldRightSame && !newRightSame) {
                    count--;
                } else if (!oldRightSame && newRightSame) {
                    count++;
                }
            }

            // Update the color at the current index
            colors[index] = newColor;
            // Store the current count in results
            result[i] = count;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(q), where q is the number of queries. For each query, we perform at most 4 comparisons (checking old and new relationships with left and right neighbors), which are all O(1) operations.

**Space Complexity:** O(n) for storing the colors array. Additionally, we use O(q) space for the output array, but this is typically not counted in auxiliary space complexity since it's part of the required output.

The key to achieving this efficiency is recognizing that each update only affects local relationships. Instead of recomputing the entire count from scratch (O(n) per query), we only update the count based on what changed (O(1) per query).

## Common Mistakes

1. **Forgetting to check boundary conditions**: When checking left and right neighbors, candidates might forget to verify that `index > 0` before checking left neighbor and `index < n-1` before checking right neighbor. This leads to array index out of bounds errors.

2. **Updating the color before checking relationships**: This is a subtle but critical error. We must check relationships using the OLD color value before updating to the new color. If we update first, we lose the ability to compare "before" and "after" states correctly.

3. **Not handling the case where color doesn't change**: If the new color is the same as the current color, no relationships change. Our code handles this correctly because if `newColor == colors[index]`, then `oldLeftSame == newLeftSame` and `oldRightSame == newRightSame`, so no count updates occur.

4. **Incorrect count update logic**: The logic for updating count must correctly handle all four cases for each neighbor:
   - Same → Same: No change
   - Same → Different: Decrement count
   - Different → Same: Increment count
   - Different → Different: No change

## When You'll See This Pattern

This "local update" pattern appears in many problems where we need to maintain aggregate information about a data structure that's being modified incrementally. Instead of recomputing the aggregate from scratch after each modification, we track how each modification affects the aggregate.

Related LeetCode problems:

1. **Range Sum Query - Mutable (LeetCode 307)**: Uses a similar idea where instead of recomputing sums from scratch, we use a Fenwick Tree or Segment Tree to update sums efficiently after each modification.
2. **Number of Islands II (LeetCode 305)**: When adding land cells one by one, we use Union-Find to efficiently update the island count by checking only neighboring cells.
3. **Design Underground System (LeetCode 1396)**: Maintains running averages by updating aggregates incrementally rather than recomputing from all historical data.

## Key Takeaways

1. **Think locally for incremental updates**: When maintaining aggregate information about a data structure that changes incrementally, consider how each change affects only a small part of the aggregate rather than recomputing everything.

2. **Compare before and after states**: For problems involving incremental updates, the key is often to compare the state before and after the update to determine what changed in the aggregate measure.

3. **Boundary conditions matter**: Always check array bounds when accessing neighbors, and consider edge cases like the first/last elements in an array.

[Practice this problem on CodeJeet](/problem/number-of-adjacent-elements-with-the-same-color)
