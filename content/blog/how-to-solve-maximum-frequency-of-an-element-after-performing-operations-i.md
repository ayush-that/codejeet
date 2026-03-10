---
title: "How to Solve Maximum Frequency of an Element After Performing Operations I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Frequency of an Element After Performing Operations I. Medium difficulty, 40.1% acceptance rate. Topics: Array, Binary Search, Sliding Window, Sorting, Prefix Sum."
date: "2027-08-27"
category: "dsa-patterns"
tags:
  [
    "maximum-frequency-of-an-element-after-performing-operations-i",
    "array",
    "binary-search",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Maximum Frequency of an Element After Performing Operations I

This problem asks us to maximize the frequency of any element in an array after performing exactly `numOperations` operations, where each operation allows us to add any value in the range `[-k, k]` to a previously unselected element. The key challenge is that we can only modify each element once, and we must use exactly `numOperations` operations (not fewer). This constraint makes it different from similar frequency maximization problems where you can apply unlimited operations to any element.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

- `nums = [3, 1, 4, 2]`
- `k = 2`
- `numOperations = 2`

We need to perform exactly 2 operations, each on a different element, adding any value between -2 and 2 to that element. Our goal is to maximize how many elements end up with the same value.

**Step 1: Sort the array**  
Sorted: `[1, 2, 3, 4]`  
Sorting helps because if we want to make elements equal to some target value, it's easiest to work with consecutive elements.

**Step 2: Consider making elements equal to 3**  
Let's try to make as many elements as possible equal to 3:

- Element 1: Needs +2 to become 3 (within [-2,2] range ✓)
- Element 2: Needs +1 to become 3 (within range ✓)
- Element 3: Already 3 (no operation needed)
- Element 4: Needs -1 to become 3 (within range ✓)

We can make all 4 elements equal to 3! But wait — we only have 2 operations available. We need exactly 2 operations, not fewer. So we must choose which 2 elements to modify:

- Option: Modify elements 1 and 2 (costs 2 operations)
- Elements 3 and 4 remain unchanged
- Result: Values [3, 3, 3, 4] → frequency of 3 is 3

**Step 3: Consider making elements equal to 4**

- Element 1: Needs +3 (exceeds k=2 ✗)
- Element 2: Needs +2 (within range ✓)
- Element 3: Needs +1 (within range ✓)
- Element 4: Already 4

We can only modify elements 2 and 3 (2 operations), giving us [1, 4, 4, 4] → frequency of 4 is 3.

**Step 4: The key insight**  
We need to find the largest window of elements where we can make them all equal to the rightmost element in that window, using at most `numOperations` operations. But since we must use exactly `numOperations` operations, we might need to "waste" operations on elements that are already at the target value.

## Brute Force Approach

A brute force approach would try every possible target value and every combination of `numOperations` elements to modify. For each target value, we'd need to check which elements can reach it (within k), then choose exactly `numOperations` of them to modify.

The complexity is prohibitive:

- There are n possible target values (each element in the array)
- For each target, we need to check all elements (O(n))
- Choosing exactly `numOperations` elements from n gives C(n, numOperations) combinations
- Total: O(n² × C(n, numOperations)) — far too slow for n up to 10⁵

Even a simpler brute force that tries all windows would be O(n²), which is still too slow for the constraints.

## Optimized Approach

The optimal solution uses **sorting + sliding window + prefix sums**. Here's the step-by-step reasoning:

1. **Sort the array** - This allows us to consider consecutive elements, which will require the smallest adjustments to make them equal.

2. **Key observation** - If we want to make a window of elements `[left...right]` all equal to `nums[right]` (the largest in the window), the total operations needed is:

   ```
   total_ops = (right-left+1) * nums[right] - sum(nums[left...right])
   ```

   This calculates how much we need to add to each element to reach `nums[right]`.

3. **But there's a constraint** - Each element can only change by at most `k`. So we also need:

   ```
   nums[right] - nums[left] <= 2*k
   ```

   Why `2*k`? Because the leftmost element needs to increase by `nums[right] - nums[left]` to reach the target, and this must be ≤ `2*k` (since we can add up to k to any element).

4. **Sliding window technique** - We maintain a window `[left...right]` where:
   - All elements can be made equal to `nums[right]` (constraint 1)
   - The operations needed ≤ `numOperations` (constraint 2)

   We expand the window by moving `right` forward, and shrink from the left when constraints are violated.

5. **Handling exactly numOperations** - This is the tricky part! We must use exactly `numOperations` operations, not fewer. If our window needs fewer operations than `numOperations`, we can "waste" extra operations by applying them to elements that are already at the target value. But we can only waste operations if we have enough elements in the window.

   Actually, we need to think differently: The problem says we must perform exactly `numOperations` operations on distinct elements. So if our optimal window needs `ops_needed` operations, we must have:

   ```
   ops_needed <= numOperations <= window_size
   ```

   Why? We need at least `ops_needed` operations to make the window uniform, and we can waste at most `(window_size - ops_needed)` operations on elements already at the target.

6. **Prefix sums for efficiency** - To quickly compute the sum of any window, we use prefix sums so we can get `sum(nums[left...right])` in O(1) time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
# Space: O(n) for prefix sums (can be optimized to O(1) with running sum)
def maxFrequency(nums, k, numOperations):
    n = len(nums)
    nums.sort()  # Step 1: Sort to work with consecutive elements

    # Step 2: Create prefix sums for O(1) range sum queries
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    left = 0
    max_freq = 0

    # Step 3: Sliding window over sorted array
    for right in range(n):
        # Current window is [left, right]
        window_size = right - left + 1

        # Calculate sum of current window using prefix sums
        window_sum = prefix[right + 1] - prefix[left]

        # Calculate operations needed to make all elements equal to nums[right]
        # Formula: (window_size * target) - sum_of_window
        ops_needed = window_size * nums[right] - window_sum

        # Step 4: Check if we can make this window uniform
        # Condition 1: Each element can change by at most k
        # The leftmost element needs to change by (nums[right] - nums[left])
        # This must be <= 2*k since we can add up to k to any element
        if nums[right] - nums[left] > 2 * k:
            # Window violates the per-element change limit
            left += 1
            continue

        # Condition 2: We need enough operations but not too many
        # We must use exactly numOperations operations
        # We need at least ops_needed operations to make window uniform
        # We can waste at most (window_size - ops_needed) operations
        # So total operations must be between ops_needed and window_size
        if ops_needed <= numOperations <= window_size:
            # Valid window - update max frequency
            max_freq = max(max_freq, window_size)
        elif ops_needed > numOperations:
            # Need more operations than available - shrink window
            left += 1

    return max_freq
```

```javascript
// Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
// Space: O(n) for prefix sums
function maxFrequency(nums, k, numOperations) {
  const n = nums.length;
  nums.sort((a, b) => a - b); // Step 1: Sort ascending

  // Step 2: Build prefix sums array
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  let left = 0;
  let maxFreq = 0;

  // Step 3: Sliding window
  for (let right = 0; right < n; right++) {
    const windowSize = right - left + 1;

    // Get sum of current window [left, right]
    const windowSum = prefix[right + 1] - prefix[left];

    // Operations needed to make all elements = nums[right]
    const opsNeeded = windowSize * nums[right] - windowSum;

    // Condition 1: Check per-element change limit
    if (nums[right] - nums[left] > 2 * k) {
      left++;
      continue;
    }

    // Condition 2: Check if we can use exactly numOperations
    if (opsNeeded <= numOperations && numOperations <= windowSize) {
      maxFreq = Math.max(maxFreq, windowSize);
    } else if (opsNeeded > numOperations) {
      // Need more operations than available
      left++;
    }
    // If opsNeeded < numOperations but numOperations > windowSize,
    // we can't waste enough operations, but we don't shrink the window
    // because a larger window might work
  }

  return maxFreq;
}
```

```java
// Time: O(n log n) for sorting + O(n) for sliding window = O(n log n)
// Space: O(n) for prefix sums
class Solution {
    public int maxFrequency(int[] nums, int k, int numOperations) {
        int n = nums.length;
        Arrays.sort(nums);  // Step 1: Sort the array

        // Step 2: Build prefix sums
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }

        int left = 0;
        int maxFreq = 0;

        // Step 3: Sliding window
        for (int right = 0; right < n; right++) {
            int windowSize = right - left + 1;

            // Sum of window [left, right]
            long windowSum = prefix[right + 1] - prefix[left];

            // Operations needed: make all elements = nums[right]
            long opsNeeded = (long) windowSize * nums[right] - windowSum;

            // Condition 1: Check if leftmost element can reach nums[right]
            // It needs to change by (nums[right] - nums[left]), must be ≤ 2*k
            if (nums[right] - nums[left] > 2L * k) {
                left++;
                continue;
            }

            // Condition 2: Check if we can use exactly numOperations
            if (opsNeeded <= numOperations && numOperations <= windowSize) {
                maxFreq = Math.max(maxFreq, windowSize);
            } else if (opsNeeded > numOperations) {
                // Window requires more operations than we have
                left++;
            }
            // Note: If opsNeeded < numOperations but numOperations > windowSize,
            // we can't waste all operations, but keep window as is
        }

        return maxFreq;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array: O(n log n)
- Building prefix sums: O(n)
- Sliding window: Each element is processed at most twice (added once when `right` moves, removed once when `left` moves), so O(n)
- Dominated by sorting: O(n log n)

**Space Complexity: O(n)**

- Prefix sums array requires O(n) space
- Sorting typically uses O(log n) to O(n) space depending on implementation
- Can be optimized to O(1) extra space by calculating window sum incrementally instead of using prefix sums

## Common Mistakes

1. **Forgetting to sort the array** - This problem requires sorting to ensure we work with consecutive elements. Without sorting, the sliding window approach doesn't work because non-consecutive elements might require fewer operations but violate the "each element can only be modified once" constraint.

2. **Misunderstanding the operation constraint** - The condition `nums[right] - nums[left] <= 2*k` is subtle. Each element can change by at most `k`, so the leftmost element needs to increase by `nums[right] - nums[left]` to reach the target. This must be ≤ `2*k` (not `k`) because we're comparing the difference between two elements, each of which could be modified by up to `k`.

3. **Incorrectly handling "exactly numOperations"** - Many candidates check only `ops_needed <= numOperations`, forgetting that we must use ALL operations. We need `ops_needed <= numOperations <= window_size` because we can waste operations on elements already at the target, but only up to `window_size - ops_needed` of them.

4. **Integer overflow in prefix sums** - When n is large (up to 10⁵) and values are large (up to 10⁹), the prefix sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C) for prefix sums and operation calculations.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sorting + Sliding Window** - Used when you need to find a contiguous subsequence that satisfies some condition. Similar problems:
   - **Frequency of the Most Frequent Element** - Almost identical but allows unlimited operations on any element
   - **Longest Subarray with Absolute Diff ≤ Limit** - Find longest subarray where max-min ≤ limit
   - **Maximum Points You Can Obtain from Cards** - Sliding window on circular array

2. **Prefix Sums for Range Queries** - When you need frequent sum queries on subarrays:
   - **Range Sum Query - Immutable** - Direct prefix sum application
   - **Continuous Subarray Sum** - Prefix sums with modulo operation
   - **Subarray Sum Equals K** - Prefix sums with hash map

3. **Operation/Transformation Problems** - Problems where you can modify elements with constraints:
   - **Minimum Operations to Make Array Equal** - Make all elements equal with incremental changes
   - **Minimum Moves to Equal Array Elements II** - Make all elements equal with ±1 operations

## Key Takeaways

1. **When you need to make elements equal or similar, sort first** - Sorting transforms the problem from "choose any elements" to "choose consecutive elements," which is much easier to solve with sliding window.

2. **The sliding window condition often has two parts** - A per-element constraint (like `nums[right] - nums[left] <= 2*k`) and a global constraint (like `ops_needed <= numOperations`). Both must be checked.

3. **"Exactly N operations" means you might need to waste operations** - If you must use exactly N operations but only need M < N to achieve your goal, you need enough elements to absorb the extra (N-M) operations.

Related problems: [Frequency of the Most Frequent Element](/problem/frequency-of-the-most-frequent-element), [Count Elements With Maximum Frequency](/problem/count-elements-with-maximum-frequency)
