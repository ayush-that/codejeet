---
title: "How to Solve Tallest Billboard — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Tallest Billboard. Hard difficulty, 51.8% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-01-30"
category: "dsa-patterns"
tags: ["tallest-billboard", "array", "dynamic-programming", "hard"]
---

# How to Solve Tallest Billboard

You need to build two steel supports of equal height using a collection of rods that can be welded together. The challenge is to maximize the height of both supports, which requires partitioning the rods into two groups with equal sum, but you can also leave some rods unused. This is essentially a variation of the partition problem with the twist that not all elements must be used, making it a challenging optimization problem.

## Visual Walkthrough

Let's trace through a small example: `rods = [1, 2, 3, 6]`. We want to find the maximum equal height for both supports.

**Key Insight**: For each rod, we have three choices:

1. Add it to the left support (positive contribution)
2. Add it to the right support (negative contribution)
3. Don't use it at all (zero contribution)

We can think of the difference between the two supports as a state. Let's track the maximum total height (sum of both supports) achievable for each possible difference.

**Step-by-step**:

- Start with difference 0, total height 0
- Process rod 1:
  - Add to left: diff = 1, height = 1
  - Add to right: diff = -1, height = 1
  - Skip: diff = 0, height = 0
- Process rod 2:
  - From diff 0: add to left → diff 2, height 2; add to right → diff -2, height 2; skip → diff 0, height 0
  - From diff 1: add to left → diff 3, height 3; add to right → diff -1, height 3; skip → diff 1, height 1
  - From diff -1: add to left → diff 1, height 3; add to right → diff -3, height 3; skip → diff -1, height 1
- Continue this process...

After processing all rods, we look at the maximum total height where difference = 0. For our example, the best we can do is use rods [1, 2, 3] to make two supports of height 3 each (1+2 on left, 3 on right), giving total height 6.

## Brute Force Approach

The brute force solution would try all possible assignments of each rod to left, right, or unused. With 3 choices per rod and n rods, this gives us 3^n possibilities. For each assignment, we would calculate the left and right sums, check if they're equal, and track the maximum equal height.

```python
def tallestBillboardBrute(rods):
    n = len(rods)
    max_height = 0

    # Try all 3^n combinations
    for mask in range(3**n):
        left = right = 0
        temp = mask

        for i in range(n):
            choice = temp % 3
            if choice == 1:  # Add to left
                left += rods[i]
            elif choice == 2:  # Add to right
                right += rods[i]
            temp //= 3

        if left == right:
            max_height = max(max_height, left)

    return max_height
```

This approach is far too slow for the constraints (n up to 20, which means 3^20 ≈ 3.5 billion operations). We need a smarter approach.

## Optimized Approach

The key insight is to use dynamic programming with the difference between the two supports as the state. Instead of tracking the actual heights of both supports, we track:

- The difference (left - right)
- The maximum total height (left + right) achievable for that difference

**Why this works**:

1. If we know the maximum total height for difference d, and we add a rod of length L to the left support, the new difference becomes d + L, and the total height increases by L.
2. If we add it to the right support, the new difference becomes d - L, and the total height still increases by L.
3. If we skip it, nothing changes.

**Optimization**: We use a dictionary/hash map to store only reachable differences. For each rod, we create a new dictionary from the current one, updating differences by adding the rod to left or right, or keeping the current state.

**Boundary condition**: We only care about positive differences since negative differences are symmetric (diff = -d has the same maximum height as diff = d).

## Optimal Solution

The optimal solution uses dynamic programming with a hash map to track the maximum total height for each difference. We process rods one by one, updating what differences are achievable and what maximum total height we can get for each.

<div class="code-group">

```python
# Time: O(n * sum(rods)) | Space: O(sum(rods))
def tallestBillboard(rods):
    """
    DP solution using difference as state.
    dp[diff] = maximum total height (left + right) achievable with difference = left - right
    """
    # Initialize dp with difference 0 having total height 0
    dp = {0: 0}

    for rod in rods:
        # Create a copy of current dp to update from
        # We can't modify dp while iterating over it
        new_dp = dp.copy()

        for diff, total_height in dp.items():
            # Option 1: Add rod to the taller support (left)
            # Difference increases by rod, total height increases by rod
            new_diff = diff + rod
            new_dp[new_diff] = max(new_dp.get(new_diff, 0), total_height + rod)

            # Option 2: Add rod to the shorter support (right)
            # This could make the shorter support become taller or remain shorter
            new_diff = diff - rod
            # The total height still increases by rod regardless of which side we add to
            new_dp[new_diff] = max(new_dp.get(new_diff, 0), total_height + rod)

            # Option 3: Skip the rod is already handled by using dp.copy()
            # The current state remains in new_dp

        # Update dp to new_dp for next iteration
        dp = new_dp

    # Return maximum total height for difference 0, divided by 2 to get height of one support
    # Since total_height = left + right, and we want left = right = height
    # So height = total_height / 2 when diff = 0
    return dp.get(0, 0) // 2
```

```javascript
// Time: O(n * sum(rods)) | Space: O(sum(rods))
function tallestBillboard(rods) {
  // dp[diff] = maximum total height (left + right) achievable with difference = left - right
  let dp = new Map();
  dp.set(0, 0); // Base case: difference 0 with total height 0

  for (const rod of rods) {
    // Create a new map from current dp to avoid modifying while iterating
    const newDp = new Map(dp);

    for (const [diff, totalHeight] of dp) {
      // Option 1: Add rod to left support
      const newDiff1 = diff + rod;
      const newHeight1 = totalHeight + rod;
      if (!newDp.has(newDiff1) || newDp.get(newDiff1) < newHeight1) {
        newDp.set(newDiff1, newHeight1);
      }

      // Option 2: Add rod to right support
      const newDiff2 = diff - rod;
      const newHeight2 = totalHeight + rod;
      if (!newDp.has(newDiff2) || newDp.get(newDiff2) < newHeight2) {
        newDp.set(newDiff2, newHeight2);
      }

      // Option 3: Skip rod is already handled by copying dp
    }

    // Update dp for next iteration
    dp = newDp;
  }

  // Return height of one support (total height / 2 when diff = 0)
  return (dp.get(0) || 0) / 2;
}
```

```java
// Time: O(n * sum(rods)) | Space: O(sum(rods))
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int tallestBillboard(int[] rods) {
        // dp[diff] = maximum total height (left + right) achievable with difference = left - right
        Map<Integer, Integer> dp = new HashMap<>();
        dp.put(0, 0);  // Base case: difference 0 with total height 0

        for (int rod : rods) {
            // Create a copy of current dp to avoid modifying while iterating
            Map<Integer, Integer> newDp = new HashMap<>(dp);

            for (Map.Entry<Integer, Integer> entry : dp.entrySet()) {
                int diff = entry.getKey();
                int totalHeight = entry.getValue();

                // Option 1: Add rod to left support
                int newDiff1 = diff + rod;
                int newHeight1 = totalHeight + rod;
                newDp.put(newDiff1, Math.max(newDp.getOrDefault(newDiff1, 0), newHeight1));

                // Option 2: Add rod to right support
                int newDiff2 = diff - rod;
                int newHeight2 = totalHeight + rod;
                newDp.put(newDiff2, Math.max(newDp.getOrDefault(newDiff2, 0), newHeight2));

                // Option 3: Skip rod is already handled by copying dp
            }

            // Update dp for next iteration
            dp = newDp;
        }

        // Return height of one support (total height / 2 when diff = 0)
        return dp.getOrDefault(0, 0) / 2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × S) where n is the number of rods and S is the sum of all rod lengths. In the worst case, we might have O(S) different differences in our dp map, and we process each rod, updating each difference.

**Space Complexity**: O(S) for the dp map which can store up to O(S) different differences. Each difference is at most the sum of all rods.

**Why this is acceptable**: For the problem constraints (n ≤ 20, rod lengths ≤ 1000), the maximum sum S is 20,000, making n × S = 400,000 operations, which is efficient.

## Common Mistakes

1. **Returning total height instead of single support height**: The dp stores total height (left + right), but the problem asks for the height of each support. Remember to divide by 2 when diff = 0.

2. **Modifying dp while iterating over it**: This is a classic mistake. When processing a rod, you need to create a new dp from the old one, not modify the old dp directly. Otherwise, you'll be using updated values within the same iteration.

3. **Not handling negative differences properly**: Some implementations try to only track positive differences, but you need to be careful with the transitions. The solution above handles both positive and negative differences naturally.

4. **Forgetting the "skip rod" option**: Each rod has three choices: left, right, or skip. The skip option is handled implicitly by starting with a copy of the previous dp state.

## When You'll See This Pattern

This "difference DP" pattern appears in problems where you need to partition elements into two groups with some relationship between them:

1. **Partition Array Into Two Arrays to Minimize Sum Difference** (LeetCode 2035): Very similar concept - partition array into two groups of equal size (or nearly equal) to minimize the absolute difference between their sums.

2. **Target Sum** (LeetCode 494): Assign + or - to each number to reach a target sum. This is essentially the same as our problem but with a specific target difference.

3. **Last Stone Weight II** (LeetCode 1049): Partition stones into two groups to minimize the difference between their weights, which reduces to a similar DP on difference.

The key insight is to use the difference between two groups as the DP state rather than tracking both groups separately.

## Key Takeaways

1. **Difference as state**: When dealing with two-group partitioning problems, consider using the difference between groups as your DP state rather than tracking each group separately. This often reduces the state space dramatically.

2. **Three choices per element**: In problems where elements can go to group A, group B, or be skipped, remember that each element has three possibilities, not two.

3. **Symmetry matters**: Positive and negative differences are symmetric in these problems. You can often optimize by only tracking absolute differences, but be careful with the transitions.

Related problems: [Partition Array Into Two Arrays to Minimize Sum Difference](/problem/partition-array-into-two-arrays-to-minimize-sum-difference)
