---
title: "How to Solve Binary Subarrays With Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Subarrays With Sum. Medium difficulty, 68.3% acceptance rate. Topics: Array, Hash Table, Sliding Window, Prefix Sum."
date: "2027-05-15"
category: "dsa-patterns"
tags: ["binary-subarrays-with-sum", "array", "hash-table", "sliding-window", "medium"]
---

# How to Solve Binary Subarrays With Sum

This problem asks us to count all contiguous subarrays in a binary array (containing only 0s and 1s) that sum to exactly `goal`. What makes this problem interesting is that while the array elements are binary, the solution requires recognizing a pattern that extends beyond simple prefix sums. The key challenge is efficiently counting subarrays without checking all O(n²) possibilities.

## Visual Walkthrough

Let's trace through an example: `nums = [1,0,1,0,1]` with `goal = 2`.

We want to count subarrays where the sum of 1s equals exactly 2. Let's list them manually:

- `[1,0,1]` (indices 0-2) → sum = 2
- `[1,0,1,0]` (indices 0-3) → sum = 2
- `[0,1,0,1]` (indices 1-4) → sum = 2
- `[1,0,1]` (indices 2-4) → sum = 2

That's 4 subarrays total. Notice something interesting: if we track the running sum (prefix sum) as we go:

- Index 0: sum = 1
- Index 1: sum = 1
- Index 2: sum = 2
- Index 3: sum = 2
- Index 4: sum = 3

For each position `i`, we want to know: how many starting positions `j` exist such that `prefix[i] - prefix[j-1] = goal`? This is equivalent to counting how many previous prefix sums equal `prefix[i] - goal`.

This insight leads us to a hash map approach where we track how many times each prefix sum has occurred so far.

## Brute Force Approach

The most straightforward solution checks every possible subarray:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numSubarraysWithSum(nums, goal):
    count = 0
    n = len(nums)

    # Check every possible starting point
    for i in range(n):
        current_sum = 0

        # Check every possible ending point
        for j in range(i, n):
            current_sum += nums[j]

            # If we reach the goal, count it
            if current_sum == goal:
                count += 1
            # Optimization: if we exceed goal, we can break early
            # (since all elements are non-negative)
            elif current_sum > goal:
                break

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function numSubarraysWithSum(nums, goal) {
  let count = 0;
  const n = nums.length;

  // Check every possible starting point
  for (let i = 0; i < n; i++) {
    let currentSum = 0;

    // Check every possible ending point
    for (let j = i; j < n; j++) {
      currentSum += nums[j];

      // If we reach the goal, count it
      if (currentSum === goal) {
        count++;
      }
      // Optimization: if we exceed goal, we can break early
      // (since all elements are non-negative)
      else if (currentSum > goal) {
        break;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numSubarraysWithSum(int[] nums, int goal) {
    int count = 0;
    int n = nums.length;

    // Check every possible starting point
    for (int i = 0; i < n; i++) {
        int currentSum = 0;

        // Check every possible ending point
        for (int j = i; j < n; j++) {
            currentSum += nums[j];

            // If we reach the goal, count it
            if (currentSum == goal) {
                count++;
            }
            // Optimization: if we exceed goal, we can break early
            // (since all elements are non-negative)
            else if (currentSum > goal) {
                break;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** For an array of length n, there are n(n+1)/2 possible subarrays, giving us O(n²) time complexity. With n up to 3×10⁴, this could mean ~450 million operations, which is far too slow. We need a solution that runs in O(n) time.

## Optimized Approach

The key insight is to use prefix sums with a hash map. Let's define:

- `prefix_sum[i]` = sum of elements from index 0 to i
- For a subarray from index j to i to have sum = goal, we need:
  `prefix_sum[i] - prefix_sum[j-1] = goal`

Rearranging: `prefix_sum[j-1] = prefix_sum[i] - goal`

So for each position i, we want to count how many previous positions j-1 had prefix sum equal to `prefix_sum[i] - goal`. We can track this with a hash map that stores how many times each prefix sum has occurred.

**Special case:** When `prefix_sum[i]` itself equals goal, that means the subarray from index 0 to i has sum goal, so we should count it. This corresponds to looking for `prefix_sum[j-1] = 0` when j = 0.

**Alternative approach (sliding window):** Since all elements are non-negative (0 or 1), we can also use a sliding window approach with atMost(goal) - atMost(goal-1). This counts subarrays with sum ≤ goal minus those with sum ≤ (goal-1), leaving exactly those with sum = goal.

## Optimal Solution

Here's the prefix sum with hash map solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numSubarraysWithSum(nums, goal):
    # Dictionary to store frequency of prefix sums encountered so far
    # Key: prefix sum value, Value: how many times we've seen it
    prefix_count = {0: 1}  # Initialize with prefix sum 0 seen once
    current_sum = 0
    result = 0

    for num in nums:
        # Update running sum
        current_sum += num

        # Check if (current_sum - goal) exists in our prefix_count
        # If it does, each occurrence represents a valid starting point
        # for a subarray ending at current position
        if (current_sum - goal) in prefix_count:
            result += prefix_count[current_sum - goal]

        # Update the count for current prefix sum
        prefix_count[current_sum] = prefix_count.get(current_sum, 0) + 1

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function numSubarraysWithSum(nums, goal) {
  // Map to store frequency of prefix sums encountered so far
  // Key: prefix sum value, Value: how many times we've seen it
  const prefixCount = new Map();
  prefixCount.set(0, 1); // Initialize with prefix sum 0 seen once
  let currentSum = 0;
  let result = 0;

  for (const num of nums) {
    // Update running sum
    currentSum += num;

    // Check if (currentSum - goal) exists in our prefixCount
    // If it does, each occurrence represents a valid starting point
    // for a subarray ending at current position
    const needed = currentSum - goal;
    if (prefixCount.has(needed)) {
      result += prefixCount.get(needed);
    }

    // Update the count for current prefix sum
    prefixCount.set(currentSum, (prefixCount.get(currentSum) || 0) + 1);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int numSubarraysWithSum(int[] nums, int goal) {
    // HashMap to store frequency of prefix sums encountered so far
    // Key: prefix sum value, Value: how many times we've seen it
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1);  // Initialize with prefix sum 0 seen once
    int currentSum = 0;
    int result = 0;

    for (int num : nums) {
        // Update running sum
        currentSum += num;

        // Check if (currentSum - goal) exists in our prefixCount
        // If it does, each occurrence represents a valid starting point
        // for a subarray ending at current position
        int needed = currentSum - goal;
        result += prefixCount.getOrDefault(needed, 0);

        // Update the count for current prefix sum
        prefixCount.put(currentSum, prefixCount.getOrDefault(currentSum, 0) + 1);
    }

    return result;
}
```

</div>

**Alternative sliding window solution:**

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numSubarraysWithSum(nums, goal):
    # Helper function to count subarrays with sum <= target
    def atMost(target):
        if target < 0:
            return 0
        left = 0
        current_sum = 0
        count = 0

        for right in range(len(nums)):
            current_sum += nums[right]

            # Shrink window from left while sum exceeds target
            while current_sum > target:
                current_sum -= nums[left]
                left += 1

            # All subarrays ending at 'right' with start between left and right
            # have sum <= target
            count += (right - left + 1)

        return count

    # Subarrays with sum = goal = (subarrays with sum <= goal) - (subarrays with sum <= goal-1)
    return atMost(goal) - atMost(goal - 1)
```

```javascript
// Time: O(n) | Space: O(1)
function numSubarraysWithSum(nums, goal) {
  // Helper function to count subarrays with sum <= target
  function atMost(target) {
    if (target < 0) return 0;
    let left = 0;
    let currentSum = 0;
    let count = 0;

    for (let right = 0; right < nums.length; right++) {
      currentSum += nums[right];

      // Shrink window from left while sum exceeds target
      while (currentSum > target) {
        currentSum -= nums[left];
        left++;
      }

      // All subarrays ending at 'right' with start between left and right
      // have sum <= target
      count += right - left + 1;
    }

    return count;
  }

  // Subarrays with sum = goal = (subarrays with sum <= goal) - (subarrays with sum <= goal-1)
  return atMost(goal) - atMost(goal - 1);
}
```

```java
// Time: O(n) | Space: O(1)
public int numSubarraysWithSum(int[] nums, int goal) {
    // Helper function to count subarrays with sum <= target
    private int atMost(int target) {
        if (target < 0) return 0;
        int left = 0;
        int currentSum = 0;
        int count = 0;

        for (int right = 0; right < nums.length; right++) {
            currentSum += nums[right];

            // Shrink window from left while sum exceeds target
            while (currentSum > target) {
                currentSum -= nums[left];
                left++;
            }

            // All subarrays ending at 'right' with start between left and right
            // have sum <= target
            count += (right - left + 1);
        }

        return count;
    }

    // Subarrays with sum = goal = (subarrays with sum <= goal) - (subarrays with sum <= goal-1)
    return atMost(goal) - atMost(goal - 1);
}
```

</div>

## Complexity Analysis

**Prefix Sum + Hash Map Approach:**

- **Time Complexity:** O(n) - We make a single pass through the array, and dictionary operations (get/set) are O(1) on average.
- **Space Complexity:** O(n) - In the worst case, we might store n different prefix sums in the hash map (if all elements are 0, we get many duplicate prefix sums, but we still need to count frequencies).

**Sliding Window Approach:**

- **Time Complexity:** O(n) - We make two passes through the array (one for atMost(goal) and one for atMost(goal-1)), and each element is processed at most twice (added once, removed once).
- **Space Complexity:** O(1) - We only use a few integer variables.

## Common Mistakes

1. **Forgetting to initialize prefix_count with {0: 1}:** This is crucial because when the prefix sum itself equals goal, we need to count the subarray from index 0 to current position. Without this initialization, we miss all subarrays starting at index 0.

2. **Updating prefix_count before checking for (current_sum - goal):** The order matters! We need to check if the needed prefix sum exists based on previous positions only, not including the current position. If we update the map first, we might incorrectly count subarrays with zero length.

3. **Using the sliding window approach incorrectly for non-binary arrays:** The atMost() trick only works because all elements are non-negative (0 or 1). For arrays with negative numbers, this approach fails because shrinking the window might not reduce the sum.

4. **Off-by-one errors in the sliding window count:** When counting subarrays in atMost(), remember that for a window [left, right], there are (right - left + 1) subarrays ending at 'right' (starting at left, left+1, ..., right).

## When You'll See This Pattern

This prefix sum + hash map pattern appears in many subarray counting problems:

1. **Subarray Sum Equals K (LeetCode 560):** Almost identical problem but with integers instead of binary arrays. The same prefix sum + hash map approach works perfectly.

2. **Count Number of Nice Subarrays (LeetCode 1248):** Counts subarrays with exactly k odd numbers. This can be transformed by marking odd numbers as 1 and even as 0, then it becomes exactly our problem.

3. **Continuous Subarray Sum (LeetCode 523):** Looks for subarrays with sum divisible by k. Uses a similar prefix sum approach but with modulo arithmetic.

The sliding window "atMost(k) - atMost(k-1)" pattern is useful for counting subarrays with "exactly k" of something when elements are non-negative, such as:

- Subarrays with at most k distinct elements
- Binary subarrays with sum (as in this problem)
- Subarrays with at most k odd numbers

## Key Takeaways

1. **Prefix sum + hash map is a powerful technique** for counting subarrays with a specific sum. The formula `prefix[j-1] = prefix[i] - goal` transforms the problem into a frequency counting problem.

2. **When dealing with binary arrays or arrays with non-negative elements**, consider the sliding window approach with `atMost(goal) - atMost(goal-1)` to count "exactly goal" occurrences.

3. **Always initialize your frequency map with {0: 1}** when counting subarrays from the beginning of the array. This handles the case where the subarray starts at index 0.

Related problems: [Count Subarrays With Score Less Than K](/problem/count-subarrays-with-score-less-than-k), [Ways to Split Array Into Good Subarrays](/problem/ways-to-split-array-into-good-subarrays), [Find All Possible Stable Binary Arrays I](/problem/find-all-possible-stable-binary-arrays-i)
