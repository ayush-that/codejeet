---
title: "How to Solve Minimum Moves to Pick K Ones — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Pick K Ones. Hard difficulty, 21.5% acceptance rate. Topics: Array, Greedy, Sliding Window, Prefix Sum."
date: "2026-09-12"
category: "dsa-patterns"
tags: ["minimum-moves-to-pick-k-ones", "array", "greedy", "sliding-window", "hard"]
---

# How to Solve Minimum Moves to Pick K Ones

This problem asks you to find the minimum moves needed to collect `k` ones from a binary array, where you can either move to adjacent positions (costing 1 move) or use "change" operations to convert zeros to ones at a distance. The tricky part is balancing between moving to existing ones versus creating new ones at strategic positions, and finding the optimal gathering point that minimizes total movement cost.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1,0,0,0,1,0,1]`, `k = 3`, `maxChanges = 1`

We need to pick 3 ones. We have 3 existing ones at indices 0, 4, and 6. We also have 1 change operation available.

**Key Insight**: The optimal strategy involves picking some existing ones and possibly creating new ones. When we create ones using changes, we should create them at the same position to minimize movement cost. This means we need to find a "gathering point" where we bring existing ones to us, and create additional ones right at that point if needed.

Let's test index 4 as a potential gathering point:

- Existing ones at indices 0, 4, and 6
- Distance from index 0 to 4: 4 moves
- Distance from index 4 to 4: 0 moves (already there)
- Distance from index 6 to 4: 2 moves
- Total moves for existing ones: 4 + 0 + 2 = 6 moves
- We have k=3 ones, and we found 3 existing ones, so we don't need changes
- Total cost: 6 moves

But what if we use index 2 as gathering point?

- Existing ones at indices 0, 4, and 6
- Distance from 0 to 2: 2 moves
- Distance from 4 to 2: 2 moves
- Distance from 6 to 2: 4 moves
- Total moves for existing ones: 2 + 2 + 4 = 8 moves
- We have 3 existing ones, so total cost: 8 moves (worse than index 4)

What if we use index 3 with our change operation?

- We need 3 ones total
- We have 3 existing ones at indices 0, 4, 6
- But what if we use 1 change at index 3, and pick 2 existing ones?
- Pick existing ones at indices 0 and 4 (or 0 and 6)
- Distance from 0 to 3: 3 moves
- Distance from 4 to 3: 1 move
- Use 1 change at index 3: cost = maxChanges × 2 = 1 × 2 = 2 moves
- Total: 3 + 1 + 2 = 6 moves (same as before)

The optimal solution requires systematically checking all potential gathering points and calculating the minimum cost for each.

## Brute Force Approach

A naive approach would be to:

1. Consider every index `i` as a potential gathering point
2. For each gathering point `i`, calculate distances to all existing ones
3. Sort these distances and pick the closest `m` ones (where `m = k - changes_used`)
4. Use changes for the remaining ones needed
5. Track the minimum total cost

The brute force code would look like this:

<div class="code-group">

```python
# Brute Force - Too Slow: O(n² log n)
def minMovesBruteForce(nums, k, maxChanges):
    n = len(nums)
    min_cost = float('inf')

    # Get all indices where nums[i] == 1
    ones = [i for i in range(n) if nums[i] == 1]

    # Try every possible gathering point
    for gather_point in range(n):
        # Calculate distances from gathering point to all ones
        distances = []
        for idx in ones:
            distances.append(abs(idx - gather_point))

        # Sort distances to pick closest ones first
        distances.sort()

        # Try different numbers of changes
        for changes_used in range(min(maxChanges, k) + 1):
            ones_needed = k - changes_used

            if ones_needed > len(distances):
                continue

            # Cost for picking closest ones_needed existing ones
            pick_cost = sum(distances[:ones_needed])

            # Cost for using changes: each change costs 2 moves
            change_cost = changes_used * 2

            total_cost = pick_cost + change_cost
            min_cost = min(min_cost, total_cost)

    return min_cost
```

```javascript
// Brute Force - Too Slow: O(n² log n)
function minMovesBruteForce(nums, k, maxChanges) {
  const n = nums.length;
  let minCost = Infinity;

  // Get all indices where nums[i] === 1
  const ones = [];
  for (let i = 0; i < n; i++) {
    if (nums[i] === 1) ones.push(i);
  }

  // Try every possible gathering point
  for (let gatherPoint = 0; gatherPoint < n; gatherPoint++) {
    // Calculate distances from gathering point to all ones
    const distances = [];
    for (const idx of ones) {
      distances.push(Math.abs(idx - gatherPoint));
    }

    // Sort distances to pick closest ones first
    distances.sort((a, b) => a - b);

    // Try different numbers of changes
    for (let changesUsed = 0; changesUsed <= Math.min(maxChanges, k); changesUsed++) {
      const onesNeeded = k - changesUsed;

      if (onesNeeded > distances.length) continue;

      // Cost for picking closest onesNeeded existing ones
      let pickCost = 0;
      for (let i = 0; i < onesNeeded; i++) {
        pickCost += distances[i];
      }

      // Cost for using changes: each change costs 2 moves
      const changeCost = changesUsed * 2;

      const totalCost = pickCost + changeCost;
      minCost = Math.min(minCost, totalCost);
    }
  }

  return minCost;
}
```

```java
// Brute Force - Too Slow: O(n² log n)
public long minMovesBruteForce(int[] nums, int k, int maxChanges) {
    int n = nums.length;
    long minCost = Long.MAX_VALUE;

    // Get all indices where nums[i] == 1
    List<Integer> ones = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        if (nums[i] == 1) ones.add(i);
    }

    // Try every possible gathering point
    for (int gatherPoint = 0; gatherPoint < n; gatherPoint++) {
        // Calculate distances from gathering point to all ones
        List<Integer> distances = new ArrayList<>();
        for (int idx : ones) {
            distances.add(Math.abs(idx - gatherPoint));
        }

        // Sort distances to pick closest ones first
        Collections.sort(distances);

        // Try different numbers of changes
        for (int changesUsed = 0; changesUsed <= Math.min(maxChanges, k); changesUsed++) {
            int onesNeeded = k - changesUsed;

            if (onesNeeded > distances.size()) continue;

            // Cost for picking closest onesNeeded existing ones
            long pickCost = 0;
            for (int i = 0; i < onesNeeded; i++) {
                pickCost += distances.get(i);
            }

            // Cost for using changes: each change costs 2 moves
            long changeCost = changesUsed * 2L;

            long totalCost = pickCost + changeCost;
            minCost = Math.min(minCost, totalCost);
        }
    }

    return minCost;
}
```

</div>

**Why this is too slow**: For each of `n` gathering points, we calculate `O(n)` distances, sort them (`O(n log n)`), and try up to `k` change counts. This gives us `O(n² log n)` time complexity, which is far too slow for `n` up to 10⁵.

## Optimized Approach

The key insight is that we only need to consider gathering points at or near existing ones. Specifically, we should use a **sliding window** over the existing ones:

1. **Prefix sums for efficient distance calculation**: If we have a window of existing ones with indices `[i, i+1, ..., j]` and we want to bring them to a gathering point at index `x`, the total distance is `sum(|ones[m] - x|)` for `m` in the window. With prefix sums, we can compute this in O(1) time.

2. **Optimal gathering point within a window**: For a window of `m` consecutive existing ones, the optimal gathering point that minimizes total distance is the **median** of their positions. If `m` is odd, pick the middle one; if `m` is even, either of the two middle positions works.

3. **Sliding window over existing ones**: We maintain a window of size `m = k - changes_used` existing ones. For each window position, we calculate the minimum distance to bring these ones to their median, then add the cost for any changes needed.

4. **Two-phase approach**:
   - Phase 1: Use only existing ones (no changes)
   - Phase 2: Use some changes and some existing ones

The algorithm:

1. Collect all indices where `nums[i] == 1`
2. Compute prefix sums of these indices for O(1) distance calculation
3. For each possible number of changes used (from 0 to `min(maxChanges, k)`):
   - Let `m = k - changes_used` (number of existing ones needed)
   - If `m > len(ones)`, skip (not enough existing ones)
   - Use sliding window of size `m` over the existing ones
   - For each window, calculate cost to bring ones to median
   - Add `changes_used * 2` for the change operations
   - Track minimum total cost

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + k * m) where m = number of ones, but typically O(n) | Space: O(n)
def minimumMoves(nums, k, maxChanges):
    n = len(nums)

    # Step 1: Collect indices of all ones
    ones = []
    for i in range(n):
        if nums[i] == 1:
            ones.append(i)

    m = len(ones)
    if m == 0:
        # No existing ones, must use all changes
        return min(k, maxChanges) * 2

    # Step 2: Compute prefix sums for efficient distance calculation
    prefix = [0] * (m + 1)
    for i in range(m):
        prefix[i + 1] = prefix[i] + ones[i]

    # Step 3: Initialize answer with a large value
    INF = 10**18
    ans = INF

    # Step 4: Try different numbers of changes
    for changes_used in range(min(maxChanges, k) + 1):
        ones_needed = k - changes_used

        # If we need more existing ones than available, skip
        if ones_needed > m:
            continue

        # If we don't need any existing ones, all come from changes
        if ones_needed == 0:
            ans = min(ans, changes_used * 2)
            continue

        # Step 5: Sliding window over existing ones
        # For a window of size ones_needed, optimal gathering point is median
        for left in range(m - ones_needed + 1):
            right = left + ones_needed - 1
            mid = (left + right) // 2
            median_idx = ones[mid]

            # Calculate total distance to bring all ones in window to median
            # Left side: median_idx * count_left - sum_left
            count_left = mid - left
            sum_left = prefix[mid] - prefix[left]
            left_cost = median_idx * count_left - sum_left

            # Right side: sum_right - median_idx * count_right
            count_right = right - mid
            sum_right = prefix[right + 1] - prefix[mid + 1]
            right_cost = sum_right - median_idx * count_right

            total_move_cost = left_cost + right_cost
            total_cost = total_move_cost + changes_used * 2

            ans = min(ans, total_cost)

    return ans
```

```javascript
// Time: O(n + k * m) where m = number of ones, but typically O(n) | Space: O(n)
function minimumMoves(nums, k, maxChanges) {
  const n = nums.length;

  // Step 1: Collect indices of all ones
  const ones = [];
  for (let i = 0; i < n; i++) {
    if (nums[i] === 1) ones.push(i);
  }

  const m = ones.length;
  if (m === 0) {
    // No existing ones, must use all changes
    return Math.min(k, maxChanges) * 2;
  }

  // Step 2: Compute prefix sums for efficient distance calculation
  const prefix = new Array(m + 1).fill(0);
  for (let i = 0; i < m; i++) {
    prefix[i + 1] = prefix[i] + ones[i];
  }

  // Step 3: Initialize answer with a large value
  let ans = Infinity;

  // Step 4: Try different numbers of changes
  for (let changesUsed = 0; changesUsed <= Math.min(maxChanges, k); changesUsed++) {
    const onesNeeded = k - changesUsed;

    // If we need more existing ones than available, skip
    if (onesNeeded > m) continue;

    // If we don't need any existing ones, all come from changes
    if (onesNeeded === 0) {
      ans = Math.min(ans, changesUsed * 2);
      continue;
    }

    // Step 5: Sliding window over existing ones
    // For a window of size onesNeeded, optimal gathering point is median
    for (let left = 0; left <= m - onesNeeded; left++) {
      const right = left + onesNeeded - 1;
      const mid = Math.floor((left + right) / 2);
      const medianIdx = ones[mid];

      // Calculate total distance to bring all ones in window to median
      // Left side: medianIdx * countLeft - sumLeft
      const countLeft = mid - left;
      const sumLeft = prefix[mid] - prefix[left];
      const leftCost = medianIdx * countLeft - sumLeft;

      // Right side: sumRight - medianIdx * countRight
      const countRight = right - mid;
      const sumRight = prefix[right + 1] - prefix[mid + 1];
      const rightCost = sumRight - medianIdx * countRight;

      const totalMoveCost = leftCost + rightCost;
      const totalCost = totalMoveCost + changesUsed * 2;

      ans = Math.min(ans, totalCost);
    }
  }

  return ans;
}
```

```java
// Time: O(n + k * m) where m = number of ones, but typically O(n) | Space: O(n)
public long minimumMoves(int[] nums, int k, int maxChanges) {
    int n = nums.length;

    // Step 1: Collect indices of all ones
    List<Integer> ones = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        if (nums[i] == 1) ones.add(i);
    }

    int m = ones.size();
    if (m == 0) {
        // No existing ones, must use all changes
        return Math.min(k, maxChanges) * 2L;
    }

    // Step 2: Compute prefix sums for efficient distance calculation
    long[] prefix = new long[m + 1];
    for (int i = 0; i < m; i++) {
        prefix[i + 1] = prefix[i] + ones.get(i);
    }

    // Step 3: Initialize answer with a large value
    long ans = Long.MAX_VALUE;

    // Step 4: Try different numbers of changes
    for (int changesUsed = 0; changesUsed <= Math.min(maxChanges, k); changesUsed++) {
        int onesNeeded = k - changesUsed;

        // If we need more existing ones than available, skip
        if (onesNeeded > m) continue;

        // If we don't need any existing ones, all come from changes
        if (onesNeeded == 0) {
            ans = Math.min(ans, changesUsed * 2L);
            continue;
        }

        // Step 5: Sliding window over existing ones
        // For a window of size onesNeeded, optimal gathering point is median
        for (int left = 0; left <= m - onesNeeded; left++) {
            int right = left + onesNeeded - 1;
            int mid = (left + right) / 2;
            int medianIdx = ones.get(mid);

            // Calculate total distance to bring all ones in window to median
            // Left side: medianIdx * countLeft - sumLeft
            int countLeft = mid - left;
            long sumLeft = prefix[mid] - prefix[left];
            long leftCost = medianIdx * (long)countLeft - sumLeft;

            // Right side: sumRight - medianIdx * countRight
            int countRight = right - mid;
            long sumRight = prefix[right + 1] - prefix[mid + 1];
            long rightCost = sumRight - medianIdx * (long)countRight;

            long totalMoveCost = leftCost + rightCost;
            long totalCost = totalMoveCost + changesUsed * 2L;

            ans = Math.min(ans, totalCost);
        }
    }

    return ans;
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- Collecting ones: O(n)
- Building prefix sums: O(m) where m = number of ones
- Outer loop over changes_used: O(min(k, maxChanges)) iterations
- Inner sliding window: O(m) iterations in worst case
- Total: O(n + m \* min(k, maxChanges))

In practice, since k and maxChanges are relatively small compared to n, this is effectively O(n).

**Space Complexity**: O(n) for storing the ones indices and prefix sums.

## Common Mistakes

1. **Not considering the median as optimal gathering point**: Some candidates try to use the mean or try every position in the window. The median minimizes the sum of absolute distances, which is a known mathematical property.

2. **Forgetting that changes cost 2 moves each**: Each change operation requires moving to a zero, changing it (1 move), then picking it (1 move), for a total of 2 moves per change.

3. **Incorrect sliding window bounds**: When the window size (ones_needed) is larger than the number of available ones, we need to skip that configuration. Also, the window should slide over existing ones, not all array indices.

4. **Integer overflow**: The total cost can be large (up to ~10¹⁴), so use 64-bit integers (long in Java/C++, long long in C).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window with Prefix Sums**: Similar to problems where you need to calculate sums or costs over contiguous subarrays efficiently.
   - Related: [Minimum Swaps to Group All 1's Together](/problem/minimum-swaps-to-group-all-1s-together) - also uses sliding window over ones
   - Related: [Minimum Operations to Make All Array Elements Equal](https://leetcode.com/problems/minimum-operations-to-make-all-array-elements-equal/) - uses prefix sums to calculate movement costs

2. **Median Optimization**: Problems where you need to minimize the sum of absolute distances often involve finding the median.
   - Related: [Best Meeting Point](https://leetcode.com/problems/best-meeting-point/) - find point that minimizes total Manhattan distance to all ones

3. **Resource Allocation with Constraints**: Balancing between different types of operations with different costs.
   - Related: [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/) - similar trade-off between moving elements and other operations

## Key Takeaways

1. **When minimizing sum of absolute distances, the median is optimal**: This is a mathematical fact worth memorizing for interview problems.

2. **Prefix sums enable O(1) range sum queries**: When you need to frequently calculate sums of subarrays, prefix sums are your friend.

3. **Consider all resource allocation strategies**: When you have multiple ways to achieve a goal (existing ones vs. creating new ones), systematically try all reasonable combinations.

4. **Sliding window over relevant elements only**: Instead of considering all array indices, often you only need to consider positions where something interesting happens (like where ones are located).

Related problems: [Minimum Swaps to Group All 1's Together](/problem/minimum-swaps-to-group-all-1s-together)
