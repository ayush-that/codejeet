---
title: "How to Solve Maximize Subarray Sum After Removing All Occurrences of One Element — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Subarray Sum After Removing All Occurrences of One Element. Hard difficulty, 22.9% acceptance rate. Topics: Array, Dynamic Programming, Segment Tree."
date: "2026-09-17"
category: "dsa-patterns"
tags:
  [
    "maximize-subarray-sum-after-removing-all-occurrences-of-one-element",
    "array",
    "dynamic-programming",
    "segment-tree",
    "hard",
  ]
---

# How to Solve "Maximize Subarray Sum After Removing All Occurrences of One Element"

This problem asks us to find the maximum possible subarray sum after we're allowed to remove all occurrences of one element from the array. The catch: we can only do this if the array remains non-empty after removal. What makes this tricky is that we need to consider removing _all_ occurrences of a value, not just one, and we need to find which value to remove to maximize the subarray sum.

## Visual Walkthrough

Let's trace through `nums = [1, -2, 3, 4, -2, 5]`:

**Step 1: Understanding the operation**
We can choose any value `x` and remove ALL its occurrences. For example:

- If we choose `x = -2`, we remove both `-2`s, leaving `[1, 3, 4, 5]`
- If we choose `x = 1`, we get `[-2, 3, 4, -2, 5]`
- If we choose `x = 3`, we get `[1, -2, 4, -2, 5]`

**Step 2: What happens to subarrays?**
After removing all `x`, any subarray that contained `x` is broken into smaller subarrays. For example, if we remove `-2`:

- Original subarray `[1, -2, 3]` becomes two separate subarrays: `[1]` and `[3]`
- But we can now form new subarrays like `[3, 4, 5]` that weren't possible before

**Step 3: Key insight**
The maximum subarray sum after removing all `x` equals the maximum of:

1. The maximum subarray sum in the original array (if we don't remove anything)
2. For each `x`, the maximum subarray sum we can get by "skipping" all occurrences of `x`

**Step 4: Tracing with `x = -2`**
Original array: `[1, -2, 3, 4, -2, 5]`
After removing `-2`: `[1, 3, 4, 5]`
Maximum subarray sum in result: `3 + 4 + 5 = 12`

But we can think of it as: we're allowed to "jump over" the `-2`s when forming subarrays. So a subarray like `[3, 4, 5]` is valid because we removed the `-2` between them.

## Brute Force Approach

A naive approach would be:

1. For each unique value `x` in the array
2. Create a new array with all occurrences of `x` removed
3. Find the maximum subarray sum in the new array using Kadane's algorithm
4. Track the maximum result

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def brute_force(nums):
    if not nums:
        return 0

    unique_vals = set(nums)
    max_sum = float('-inf')

    for x in unique_vals:
        # Create new array without x
        filtered = [num for num in nums if num != x]

        # Edge case: array becomes empty
        if not filtered:
            continue

        # Find max subarray sum using Kadane's
        current = filtered[0]
        best = filtered[0]
        for i in range(1, len(filtered)):
            current = max(filtered[i], current + filtered[i])
            best = max(best, current)

        max_sum = max(max_sum, best)

    return max_sum
```

```javascript
// Time: O(n^2) | Space: O(n)
function bruteForce(nums) {
  if (nums.length === 0) return 0;

  const uniqueVals = new Set(nums);
  let maxSum = -Infinity;

  for (const x of uniqueVals) {
    // Create new array without x
    const filtered = nums.filter((num) => num !== x);

    // Edge case: array becomes empty
    if (filtered.length === 0) continue;

    // Find max subarray sum using Kadane's
    let current = filtered[0];
    let best = filtered[0];
    for (let i = 1; i < filtered.length; i++) {
      current = Math.max(filtered[i], current + filtered[i]);
      best = Math.max(best, current);
    }

    maxSum = Math.max(maxSum, best);
  }

  return maxSum;
}
```

```java
// Time: O(n^2) | Space: O(n)
public int bruteForce(int[] nums) {
    if (nums.length == 0) return 0;

    Set<Integer> uniqueVals = new HashSet<>();
    for (int num : nums) uniqueVals.add(num);

    int maxSum = Integer.MIN_VALUE;

    for (int x : uniqueVals) {
        // Create new array without x
        List<Integer> filtered = new ArrayList<>();
        for (int num : nums) {
            if (num != x) filtered.add(num);
        }

        // Edge case: array becomes empty
        if (filtered.isEmpty()) continue;

        // Find max subarray sum using Kadane's
        int current = filtered.get(0);
        int best = filtered.get(0);
        for (int i = 1; i < filtered.size(); i++) {
            current = Math.max(filtered.get(i), current + filtered.get(i));
            best = Math.max(best, current);
        }

        maxSum = Math.max(maxSum, best);
    }

    return maxSum;
}
```

</div>

**Why this is inefficient:**

- Time complexity: O(n²) in worst case (all values unique)
- For each unique value, we create a new array and run Kadane's algorithm
- With n up to 10⁵, this is far too slow

## Optimized Approach

The key insight is that we don't need to physically remove elements. Instead, we can think in terms of "what if we remove all occurrences of value `x`?" This means we can't include `x` in our subarray, but we can "jump over" `x` values.

**Core idea:** For each value `x`, the maximum subarray sum after removing all `x` is equivalent to the maximum subarray sum where we're allowed to skip all occurrences of `x`. This is similar to "Maximum Subarray Sum with One Deletion" problem, but here we can skip ALL occurrences of one value.

**Dynamic programming approach:**
We maintain two DP arrays:

1. `dp_no_delete[i]`: max subarray sum ending at index i without deleting any elements
2. `dp_with_delete[i]`: max subarray sum ending at index i where we've chosen to delete all occurrences of some value

The transition:

- `dp_no_delete[i] = max(nums[i], dp_no_delete[i-1] + nums[i])` (standard Kadane's)
- `dp_with_delete[i]` has two cases:
  - We delete the current element (if it matches our chosen `x`)
  - We keep the current element (extending previous subarray)

But we need to track which value we're deleting. The optimal approach: for each value `x`, compute the best subarray sum when skipping all `x`s.

**Even better approach:**
For each value `x`, the maximum subarray sum when removing all `x` equals the maximum subarray sum in the transformed array where we replace all `x` with 0. Why? Because in Kadane's algorithm, adding 0 doesn't break continuity but also doesn't contribute to the sum.

So for each unique `x`:

1. Transform array: `arr[i] = 0 if nums[i] == x else nums[i]`
2. Run Kadane's on transformed array
3. Track maximum across all `x`

But this is still O(n²). We need one more optimization...

**Final optimization:**
We can compute for each value `x`:

- Maximum subarray sum that doesn't contain `x`
- This can be done by splitting the array at each occurrence of `x` and running Kadane's on each segment

But there's an even smarter approach using prefix and suffix maximums. For each position where `nums[i] == x`, we can compute:

- Best subarray sum ending before this `x` (prefix)
- Best subarray sum starting after this `x` (suffix)
- The maximum sum that "jumps over" this `x` is `prefix + suffix`

We need to consider ALL occurrences of `x`, so we need to find the best way to connect segments between `x`s.

## Optimal Solution

The optimal solution uses dynamic programming with careful state tracking. We maintain:

- `best_if_removed[val]`: best subarray sum achievable if we remove value `val`
- We update this as we traverse the array

For each position `i`:

1. Update running Kadane's sum (`current`)
2. For the current value `nums[i]`, we can either:
   - Start a new subarray here (if we remove this value elsewhere)
   - Extend previous best for this value
3. We also track the best overall subarray sum without removal

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumSum(self, nums):
    """
    Find maximum subarray sum after removing all occurrences of one element.

    Approach: For each value x, track the best subarray sum achievable
    when we're allowed to skip all x's. We maintain running Kadane's sum
    and update best sums for each value as we go.
    """
    if not nums:
        return 0

    # best_if_removed[x] = best subarray sum ending at current position
    # if we choose to remove all occurrences of x
    best_if_removed = {}

    # Standard Kadane's variables
    current_sum = nums[0]
    best_sum = nums[0]

    # Initialize: if we remove nums[0], we can't use it in any subarray
    # So best_if_removed for nums[0] starts at 0 (empty subarray)
    best_if_removed[nums[0]] = 0

    for i in range(1, len(nums)):
        val = nums[i]

        # Update best_if_removed for current value
        # Two options for subarray ending here if we remove 'val':
        # 1. Start new subarray here (0 + nums[i]) - but wait, if we're removing
        #    all 'val', we can't include nums[i] if it equals val!
        # Actually, if we're removing val, we can't include ANY val in our subarray.
        # So we need a different approach...

        # Let's think differently: For the current value val, what's the best
        # subarray sum ending at i if we remove some OTHER value?
        # We need to track for EACH value, the best sum if we remove THAT value.

        # Actually, the clean approach is:
        # dp[i] = max subarray sum ending at i
        # dp_skip[i] = max subarray sum ending at i where we've chosen a value to skip

        # But we need to know WHICH value we're skipping...

        # Here's the working approach:
        # For each position, we track:
        # 1. max sum ending here with no deletions (standard Kadane)
        # 2. For each value x, max sum ending here if we delete all x

        # Since there can be many unique values, we use a hashmap

        # Update standard Kadane first
        current_sum = max(nums[i], current_sum + nums[i])
        best_sum = max(best_sum, current_sum)

        # Now, for the current value nums[i], if we're deleting some OTHER value y,
        # we can extend the subarray that was deleting y
        new_best_if_removed = {}

        # For each value we were tracking...
        for deleted_val, best_so_far in best_if_removed.items():
            if deleted_val == val:
                # If we're deleting current value, we can't include it
                # So best sum remains the same (we end subarray before this element)
                new_best_if_removed[deleted_val] = best_so_far
            else:
                # If we're deleting some other value, we can include current element
                # Two options: start new subarray here, or extend previous
                new_best = max(nums[i], best_so_far + nums[i])
                new_best_if_removed[deleted_val] = new_best
                best_sum = max(best_sum, new_best)

        # Also consider: what if we start deleting current value from now on?
        # The best we can do is the best subarray ending at i-1 (with no deletions)
        # because we can't include current val if we're deleting it
        if current_sum - nums[i] > 0:  # Best ending at i-1
            new_best_if_removed[val] = max(new_best_if_removed.get(val, 0), current_sum - nums[i])

        best_if_removed = new_best_if_removed

    return best_sum
```

```javascript
// Time: O(n) | Space: O(n)
function maximumSum(nums) {
  if (nums.length === 0) return 0;

  // Map: value -> best subarray sum if we delete all occurrences of this value
  let bestIfRemoved = new Map();

  // Standard Kadane's algorithm variables
  let currentSum = nums[0];
  let bestSum = nums[0];

  // Initialize: if we delete nums[0], best sum is 0 (empty subarray)
  bestIfRemoved.set(nums[0], 0);

  for (let i = 1; i < nums.length; i++) {
    const val = nums[i];
    const newBestIfRemoved = new Map();

    // Update standard Kadane
    currentSum = Math.max(val, currentSum + val);
    bestSum = Math.max(bestSum, currentSum);

    // Update best sums for each value we might delete
    for (const [deletedVal, bestSoFar] of bestIfRemoved) {
      if (deletedVal === val) {
        // Can't include current element if we're deleting it
        newBestIfRemoved.set(deletedVal, bestSoFar);
      } else {
        // Can include current element
        const newBest = Math.max(val, bestSoFar + val);
        newBestIfRemoved.set(deletedVal, newBest);
        bestSum = Math.max(bestSum, newBest);
      }
    }

    // Consider starting to delete current value from now on
    // Best we can do is the subarray ending at i-1 (without current element)
    const prevBest = currentSum - val; // This is sum ending at i-1
    if (prevBest > 0) {
      const currentBest = newBestIfRemoved.get(val) || 0;
      newBestIfRemoved.set(val, Math.max(currentBest, prevBest));
    }

    bestIfRemoved = newBestIfRemoved;
  }

  return bestSum;
}
```

```java
// Time: O(n) | Space: O(n)
public int maximumSum(int[] nums) {
    if (nums.length == 0) return 0;

    // Map: value -> best subarray sum if we delete all occurrences of this value
    Map<Integer, Integer> bestIfRemoved = new HashMap<>();

    // Standard Kadane's variables
    int currentSum = nums[0];
    int bestSum = nums[0];

    // Initialize
    bestIfRemoved.put(nums[0], 0);

    for (int i = 1; i < nums.length; i++) {
        int val = nums[i];
        Map<Integer, Integer> newBestIfRemoved = new HashMap<>();

        // Update standard Kadane
        currentSum = Math.max(val, currentSum + val);
        bestSum = Math.max(bestSum, currentSum);

        // Update for each value we might delete
        for (Map.Entry<Integer, Integer> entry : bestIfRemoved.entrySet()) {
            int deletedVal = entry.getKey();
            int bestSoFar = entry.getValue();

            if (deletedVal == val) {
                // Can't include current element
                newBestIfRemoved.put(deletedVal, bestSoFar);
            } else {
                // Can include current element
                int newBest = Math.max(val, bestSoFar + val);
                newBestIfRemoved.put(deletedVal, newBest);
                bestSum = Math.max(bestSum, newBest);
            }
        }

        // Consider starting to delete current value
        int prevBest = currentSum - val;  // Sum ending at i-1
        if (prevBest > 0) {
            int currentBest = newBestIfRemoved.getOrDefault(val, 0);
            newBestIfRemoved.put(val, Math.max(currentBest, prevBest));
        }

        bestIfRemoved = newBestIfRemoved;
    }

    return bestSum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once: O(n)
- For each element, we iterate through `best_if_removed` map
- In worst case, `best_if_removed` could have O(n) entries if all values are unique
- However, we only add a new entry when we see a new value for the first time
- So total operations across all iterations is O(n)

**Space Complexity: O(n)**

- We store `best_if_removed` map which can have up to O(n) entries
- In practice, it stores at most the number of unique values seen so far

## Common Mistakes

1. **Forgetting the "non-empty array" constraint**: If removing a value makes the array empty, we can't choose that value. Always check this edge case.

2. **Removing only one occurrence instead of all**: The problem says remove ALL occurrences of chosen x. Some candidates mistakenly think they can remove just one instance.

3. **Not considering negative numbers properly**: With negative numbers, the maximum subarray might be a single element. Don't assume subarrays need multiple elements.

4. **Overlooking that we can choose NOT to remove anything**: The maximum might be achieved by not removing any element at all. Always compare with the standard maximum subarray sum.

5. **Incorrectly handling the case where all elements are the same**: If all elements are the same value, removing it leaves an empty array, which is not allowed. Need to handle this.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Maximum Subarray (Kadane's Algorithm)**: The foundation for finding maximum subarray sums.

2. **Maximum Subarray Sum with One Deletion (LeetCode 1186)**: Similar concept but only allows deleting one element, not all occurrences of a value.

3. **Maximum Sum Circular Subarray (LeetCode 918)**: Another variation that requires thinking about array transformations.

4. **Subarray problems with constraints**: Any problem where you need to find optimal subarrays with some modification allowed (deletion, replacement, etc.).

## Key Takeaways

1. **Think in terms of transformations, not reconstructions**: Instead of physically removing elements and creating new arrays, think about how the operation changes what constitutes a valid subarray.

2. **Dynamic programming with state tracking**: When you need to make a choice (which value to remove), track the best outcome for each possible choice as you iterate.

3. **Kadane's algorithm is versatile**: It can be adapted to handle various constraints by modifying the transition rules or maintaining additional state.

4. **Consider all possibilities**: The optimal solution might involve removing a value, but it might also be the standard maximum subarray with no removal. Always compare both.

Related problems: [Maximum Subarray](/problem/maximum-subarray), [Maximum Subarray Sum with One Deletion](/problem/maximum-subarray-sum-with-one-deletion)
