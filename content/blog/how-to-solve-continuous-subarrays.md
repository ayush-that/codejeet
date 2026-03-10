---
title: "How to Solve Continuous Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Continuous Subarrays. Medium difficulty, 57.9% acceptance rate. Topics: Array, Queue, Sliding Window, Heap (Priority Queue), Ordered Set."
date: "2027-02-24"
category: "dsa-patterns"
tags: ["continuous-subarrays", "array", "queue", "sliding-window", "medium"]
---

# How to Solve Continuous Subarrays

This problem asks us to count all subarrays where the absolute difference between any two elements is at most 2. What makes this interesting is that we need to check _all pairs_ within a subarray, not just adjacent elements. A subarray `[i, j]` is valid if `max(nums[i..j]) - min(nums[i..j]) <= 2`. The challenge is doing this efficiently without checking all O(n²) subarrays.

## Visual Walkthrough

Let's trace through `nums = [5, 4, 2, 4]`:

We need to count all subarrays where max-min ≤ 2. Let's build systematically:

**Starting at index 0:**

- `[5]`: max=5, min=5, diff=0 ≤ 2 ✓ (count=1)
- `[5,4]`: max=5, min=4, diff=1 ≤ 2 ✓ (count=2)
- `[5,4,2]`: max=5, min=2, diff=3 > 2 ✗ (stop expanding right)

**Starting at index 1:**

- `[4]`: diff=0 ✓ (count=3)
- `[4,2]`: max=4, min=2, diff=2 ≤ 2 ✓ (count=4)
- `[4,2,4]`: max=4, min=2, diff=2 ≤ 2 ✓ (count=5)

**Starting at index 2:**

- `[2]`: diff=0 ✓ (count=6)
- `[2,4]`: max=4, min=2, diff=2 ≤ 2 ✓ (count=7)

**Starting at index 3:**

- `[4]`: diff=0 ✓ (count=8)

Total: 8 valid continuous subarrays.

The brute force would check all 10 possible subarrays, but we can see a pattern: once a subarray becomes invalid (diff > 2), adding more elements to the right won't fix it (the range can only widen). This suggests a sliding window approach where we maintain the current window's min and max.

## Brute Force Approach

The straightforward solution checks every possible subarray `[i, j]` and verifies if `max(nums[i..j]) - min(nums[i..j]) <= 2`. For each subarray, we need O(j-i) time to find min and max, leading to O(n³) total time.

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def brute_force(nums):
    n = len(nums)
    count = 0

    for i in range(n):
        for j in range(i, n):
            # Find min and max in nums[i..j]
            min_val = nums[i]
            max_val = nums[i]
            for k in range(i, j + 1):
                min_val = min(min_val, nums[k])
                max_val = max(max_val, nums[k])

            if max_val - min_val <= 2:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function bruteForce(nums) {
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Find min and max in nums[i..j]
      let minVal = nums[i];
      let maxVal = nums[i];
      for (let k = i; k <= j; k++) {
        minVal = Math.min(minVal, nums[k]);
        maxVal = Math.max(maxVal, nums[k]);
      }

      if (maxVal - minVal <= 2) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int bruteForce(int[] nums) {
    int n = nums.length;
    int count = 0;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Find min and max in nums[i..j]
            int minVal = nums[i];
            int maxVal = nums[i];
            for (int k = i; k <= j; k++) {
                minVal = Math.min(minVal, nums[k]);
                maxVal = Math.max(maxVal, nums[k]);
            }

            if (maxVal - minVal <= 2) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

This is far too slow for n up to 10⁵. We need to optimize to O(n) or O(n log n).

## Optimized Approach

The key insight: for a valid window `[left, right]`, adding `nums[right+1]` might make it invalid if it expands the range beyond 2. Once invalid, we need to move `left` forward until valid again.

We need to efficiently track the current window's min and max. Two data structures work well:

1. **Two deques**: One monotonic increasing deque for min, one monotonic decreasing deque for max
2. **Two heaps**: A min-heap and max-heap (but removal is O(n) unless we use lazy deletion)
3. **TreeMap/OrderedDict**: Maintain frequency counts, giving O(log n) min/max operations

The deque approach gives O(1) amortized min/max operations. Here's how it works:

- `min_deque`: Stores indices in increasing order of their values
- `max_deque`: Stores indices in decreasing order of their values
- When adding a new element at `right`, remove from the back of deques while maintaining order
- When the window becomes invalid (`nums[max_deque[0]] - nums[min_deque[0]] > 2`), increment `left` and remove expired indices from deque fronts

For each `right`, count all valid windows ending at `right`: `right - left + 1`. This works because for fixed `right`, the smallest valid left gives all valid starting points.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def continuousSubarrays(nums):
    from collections import deque

    n = len(nums)
    count = 0
    left = 0

    # Two deques to track min and max in current window
    min_deque = deque()  # increasing order of values
    max_deque = deque()  # decreasing order of values

    for right in range(n):
        # Maintain min_deque: remove from back while nums[back] >= nums[right]
        # This keeps deque strictly increasing
        while min_deque and nums[min_deque[-1]] >= nums[right]:
            min_deque.pop()
        min_deque.append(right)

        # Maintain max_deque: remove from back while nums[back] <= nums[right]
        # This keeps deque strictly decreasing
        while max_deque and nums[max_deque[-1]] <= nums[right]:
            max_deque.pop()
        max_deque.append(right)

        # Shrink window from left if current window is invalid
        # Invalid means max-min > 2
        while nums[max_deque[0]] - nums[min_deque[0]] > 2:
            # Move left pointer forward
            left += 1

            # Remove indices that are now outside the window
            if min_deque[0] < left:
                min_deque.popleft()
            if max_deque[0] < left:
                max_deque.popleft()

        # All subarrays ending at 'right' with start from 'left' to 'right' are valid
        # That's (right - left + 1) subarrays
        count += (right - left + 1)

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function continuousSubarrays(nums) {
  const n = nums.length;
  let count = 0;
  let left = 0;

  // Two deques to track min and max in current window
  const minDeque = []; // increasing order of values
  const maxDeque = []; // decreasing order of values

  for (let right = 0; right < n; right++) {
    // Maintain minDeque: remove from back while nums[back] >= nums[right]
    while (minDeque.length && nums[minDeque[minDeque.length - 1]] >= nums[right]) {
      minDeque.pop();
    }
    minDeque.push(right);

    // Maintain maxDeque: remove from back while nums[back] <= nums[right]
    while (maxDeque.length && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {
      maxDeque.pop();
    }
    maxDeque.push(right);

    // Shrink window from left if current window is invalid
    while (nums[maxDeque[0]] - nums[minDeque[0]] > 2) {
      left++;

      // Remove indices that are now outside the window
      if (minDeque[0] < left) {
        minDeque.shift();
      }
      if (maxDeque[0] < left) {
        maxDeque.shift();
      }
    }

    // All subarrays ending at 'right' with start from 'left' to 'right' are valid
    count += right - left + 1;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayDeque;
import java.util.Deque;

public int continuousSubarrays(int[] nums) {
    int n = nums.length;
    int count = 0;
    int left = 0;

    // Two deques to track min and max in current window
    Deque<Integer> minDeque = new ArrayDeque<>();  // increasing order of values
    Deque<Integer> maxDeque = new ArrayDeque<>();  // decreasing order of values

    for (int right = 0; right < n; right++) {
        // Maintain minDeque: remove from back while nums[back] >= nums[right]
        while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[right]) {
            minDeque.pollLast();
        }
        minDeque.offerLast(right);

        // Maintain maxDeque: remove from back while nums[back] <= nums[right]
        while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[right]) {
            maxDeque.pollLast();
        }
        maxDeque.offerLast(right);

        // Shrink window from left if current window is invalid
        while (nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > 2) {
            left++;

            // Remove indices that are now outside the window
            if (!minDeque.isEmpty() && minDeque.peekFirst() < left) {
                minDeque.pollFirst();
            }
            if (!maxDeque.isEmpty() && maxDeque.peekFirst() < left) {
                maxDeque.pollFirst();
            }
        }

        // All subarrays ending at 'right' with start from 'left' to 'right' are valid
        count += (right - left + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
Each element is added to and removed from the deques at most once. The `while` loops for maintaining deques use amortized O(1) time per element. The outer loop runs n times, so total is O(n).

**Space Complexity: O(n)**  
In the worst case, the deques could store all n indices (when the array is strictly increasing or decreasing).

## Common Mistakes

1. **Forgetting to remove expired indices from deques**: When moving `left` forward, indices smaller than `left` are no longer in the window. You must check and remove them from the front of deques.

2. **Using values instead of indices in deques**: Storing values makes it impossible to know when an element leaves the window. Always store indices so you can check if they're still within `[left, right]`.

3. **Incorrect window counting**: For each `right`, the number of valid subarrays ending at `right` is `right - left + 1`, not just 1. This counts all possible starting points `left` to `right`.

4. **Wrong deque maintenance order**: The min deque should be _increasing_ (remove larger/equal elements from back). The max deque should be _decreasing_ (remove smaller/equal elements from back). Getting these reversed breaks the min/max tracking.

## When You'll See This Pattern

This "sliding window with min/max tracking" pattern appears in problems where you need to maintain a window satisfying constraints on the minimum and maximum values:

1. **Longest Subarray with Absolute Diff ≤ Limit (LeetCode 1438)**: Almost identical to this problem, but asks for the longest valid subarray length instead of counting all.

2. **Sliding Window Maximum (LeetCode 239)**: Uses a monotonic deque to track max in each sliding window.

3. **Subarrays with K Different Integers (LeetCode 992)**: Uses sliding window with frequency counting, similar idea but with different constraint.

## Key Takeaways

1. **When a problem asks about subarrays with constraints on min/max**, think sliding window with deques to track extremal values efficiently.

2. **The "count all valid subarrays" trick**: For each ending position `right`, if `left` is the smallest valid starting index, then all subarrays `[i, right]` for `i` from `left` to `right` are valid. This gives O(n) counting instead of O(n²).

3. **Monotonic deques are perfect for sliding window min/max**: They give O(1) amortized access to current window's minimum and maximum while supporting efficient addition and removal.

[Practice this problem on CodeJeet](/problem/continuous-subarrays)
