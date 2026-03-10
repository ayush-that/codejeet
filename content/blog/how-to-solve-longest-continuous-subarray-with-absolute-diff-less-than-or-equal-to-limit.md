---
title: "How to Solve Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit. Medium difficulty, 57.4% acceptance rate. Topics: Array, Queue, Sliding Window, Heap (Priority Queue), Ordered Set."
date: "2027-12-29"
category: "dsa-patterns"
tags:
  [
    "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
    "array",
    "queue",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit

This problem asks us to find the longest subarray where the difference between the maximum and minimum values is at most `limit`. The challenge is that we need to efficiently track both the maximum and minimum values within a sliding window as it expands and contracts. A naive approach would check every possible subarray, but that's too slow. The optimal solution requires clever data structures to maintain window extremes in real time.

## Visual Walkthrough

Let's trace through an example: `nums = [8, 2, 4, 7]`, `limit = 4`

We'll use two deques: one for maximum values (decreasing order) and one for minimum values (increasing order).

**Step 1:** Window = [8]

- Max deque: [8] (stores indices: [0])
- Min deque: [8] (stores indices: [0])
- Current max = 8, min = 8, diff = 0 ≤ 4 ✓
- Longest length = 1

**Step 2:** Window = [8, 2]

- Max deque: [8, 2] → still decreasing ✓
- Min deque: [2] (8 > 2, so remove 8)
- Current max = 8, min = 2, diff = 6 > 4 ✗
- Shrink window from left: remove index 0 from deques
- Window = [2]
- Max deque: [2], Min deque: [2]
- Longest length = 1

**Step 3:** Window = [2, 4]

- Max deque: [4] (2 < 4, so remove 2)
- Min deque: [2, 4] → still increasing ✓
- Current max = 4, min = 2, diff = 2 ≤ 4 ✓
- Longest length = 2

**Step 4:** Window = [2, 4, 7]

- Max deque: [7] (4 < 7, so remove 4)
- Min deque: [2, 4, 7] → still increasing ✓
- Current max = 7, min = 2, diff = 5 > 4 ✗
- Shrink window from left: remove index 1 (value 2) from deques
- Window = [4, 7]
- Max deque: [7], Min deque: [4, 7]
- Current max = 7, min = 4, diff = 3 ≤ 4 ✓
- Longest length = 2

The answer is 2 (subarray [4, 7] or [2, 4]).

## Brute Force Approach

The most straightforward solution is to check every possible subarray:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Find the maximum and minimum values in nums[i:j+1]
4. Check if max-min ≤ limit
5. Track the maximum length where this condition holds

This approach has O(n³) time complexity (O(n²) subarrays × O(n) to find max/min for each). Even with optimization to track max/min as we expand j, it's still O(n²), which is too slow for n up to 10⁵.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def longestSubarrayBrute(nums, limit):
    n = len(nums)
    max_length = 0

    for i in range(n):
        # Track current window's min and max
        curr_min = nums[i]
        curr_max = nums[i]

        for j in range(i, n):
            # Update min and max as we expand window
            curr_min = min(curr_min, nums[j])
            curr_max = max(curr_max, nums[j])

            # Check if current window satisfies condition
            if curr_max - curr_min <= limit:
                max_length = max(max_length, j - i + 1)
            else:
                # If this window fails, larger windows starting at i will also fail
                break

    return max_length
```

```javascript
// Time: O(n²) | Space: O(1)
function longestSubarrayBrute(nums, limit) {
  let maxLength = 0;

  for (let i = 0; i < nums.length; i++) {
    let currMin = nums[i];
    let currMax = nums[i];

    for (let j = i; j < nums.length; j++) {
      currMin = Math.min(currMin, nums[j]);
      currMax = Math.max(currMax, nums[j]);

      if (currMax - currMin <= limit) {
        maxLength = Math.max(maxLength, j - i + 1);
      } else {
        break;
      }
    }
  }

  return maxLength;
}
```

```java
// Time: O(n²) | Space: O(1)
public int longestSubarrayBrute(int[] nums, int limit) {
    int maxLength = 0;

    for (int i = 0; i < nums.length; i++) {
        int currMin = nums[i];
        int currMax = nums[i];

        for (int j = i; j < nums.length; j++) {
            currMin = Math.min(currMin, nums[j]);
            currMax = Math.max(currMax, nums[j]);

            if (currMax - currMax <= limit) {
                maxLength = Math.max(maxLength, j - i + 1);
            } else {
                break;
            }
        }
    }

    return maxLength;
}
```

</div>

The brute force fails because with n=10⁵, O(n²) operations would be 10¹⁰, far too slow. We need O(n) or O(n log n).

## Optimized Approach

The key insight is that we need to efficiently track the maximum and minimum values in a sliding window. A sliding window approach with two monotonic deques gives us O(n) time:

1. **Sliding Window**: Maintain a window [left, right] where max-min ≤ limit
2. **Two Deques**:
   - `maxDeque`: Stores indices in decreasing order of values (front has max)
   - `minDeque`: Stores indices in increasing order of values (front has min)
3. **Expand Right**: Add each new element to both deques, maintaining monotonic properties
4. **Shrink Left**: When max-min > limit, move left pointer forward, removing outdated indices from deques
5. **Track Length**: Update maximum window size as we go

Why deques? We need to:

- Add new elements to the back (append)
- Remove outdated elements from the front (when shrinking window)
- Remove elements from the back (when maintaining monotonic order)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestSubarray(nums, limit):
    """
    Find the longest subarray where max-min <= limit.

    Args:
        nums: List of integers
        limit: Maximum allowed difference between max and min

    Returns:
        Length of the longest valid subarray
    """
    from collections import deque

    # Deques store indices, not values
    max_deque = deque()  # Decreasing order (front has max)
    min_deque = deque()  # Increasing order (front has min)

    left = 0  # Left pointer of sliding window
    max_length = 0

    # Expand window by moving right pointer
    for right in range(len(nums)):
        # Maintain max_deque in decreasing order
        # Remove elements from back while they're <= current element
        while max_deque and nums[max_deque[-1]] <= nums[right]:
            max_deque.pop()
        max_deque.append(right)

        # Maintain min_deque in increasing order
        # Remove elements from back while they're >= current element
        while min_deque and nums[min_deque[-1]] >= nums[right]:
            min_deque.pop()
        min_deque.append(right)

        # Check if current window violates limit condition
        # The front of deques have current window's max and min
        while nums[max_deque[0]] - nums[min_deque[0]] > limit:
            # Shrink window from left
            left += 1

            # Remove indices that are now outside the window
            if max_deque[0] < left:
                max_deque.popleft()
            if min_deque[0] < left:
                min_deque.popleft()

        # Update maximum length
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(n)
function longestSubarray(nums, limit) {
  // Deques store indices, not values
  let maxDeque = []; // Decreasing order (front has max)
  let minDeque = []; // Increasing order (front has min)

  let left = 0; // Left pointer of sliding window
  let maxLength = 0;

  // Expand window by moving right pointer
  for (let right = 0; right < nums.length; right++) {
    // Maintain maxDeque in decreasing order
    // Remove elements from back while they're <= current element
    while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {
      maxDeque.pop();
    }
    maxDeque.push(right);

    // Maintain minDeque in increasing order
    // Remove elements from back while they're >= current element
    while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right]) {
      minDeque.pop();
    }
    minDeque.push(right);

    // Check if current window violates limit condition
    // The front of deques have current window's max and min
    while (nums[maxDeque[0]] - nums[minDeque[0]] > limit) {
      // Shrink window from left
      left++;

      // Remove indices that are now outside the window
      if (maxDeque[0] < left) {
        maxDeque.shift();
      }
      if (minDeque[0] < left) {
        minDeque.shift();
      }
    }

    // Update maximum length
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayDeque;
import java.util.Deque;

public int longestSubarray(int[] nums, int limit) {
    // Deques store indices, not values
    Deque<Integer> maxDeque = new ArrayDeque<>();  // Decreasing order (front has max)
    Deque<Integer> minDeque = new ArrayDeque<>();  // Increasing order (front has min)

    int left = 0;  // Left pointer of sliding window
    int maxLength = 0;

    // Expand window by moving right pointer
    for (int right = 0; right < nums.length; right++) {
        // Maintain maxDeque in decreasing order
        // Remove elements from back while they're <= current element
        while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[right]) {
            maxDeque.pollLast();
        }
        maxDeque.offerLast(right);

        // Maintain minDeque in increasing order
        // Remove elements from back while they're >= current element
        while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[right]) {
            minDeque.pollLast();
        }
        minDeque.offerLast(right);

        // Check if current window violates limit condition
        // The front of deques have current window's max and min
        while (nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > limit) {
            // Shrink window from left
            left++;

            // Remove indices that are now outside the window
            if (maxDeque.peekFirst() < left) {
                maxDeque.pollFirst();
            }
            if (minDeque.peekFirst() < left) {
                minDeque.pollFirst();
            }
        }

        // Update maximum length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each element is added to and removed from the deques at most once
- The `while` loops for maintaining deque order use amortized O(1) time per element
- The outer loop runs exactly n times

**Space Complexity: O(n)**

- In the worst case, all elements could be stored in the deques (when array is strictly increasing or decreasing)
- Each deque can store up to n elements, but they won't both be full simultaneously

## Common Mistakes

1. **Using only one deque**: Some candidates try to track both max and min in one deque, but this doesn't work because the removal conditions are different for max (remove smaller elements) and min (remove larger elements).

2. **Storing values instead of indices**: If you store values, you can't tell when an element leaves the window when shrinking from the left. Indices let us check if `deque[0] < left` to know when to remove.

3. **Forgetting to remove outdated indices**: When shrinking the window, you must check if the front elements of the deques are still within the window. Otherwise, you might use a max/min value that's no longer in the current window.

4. **Incorrect deque maintenance order**: For max deque, remove from back while `nums[back] <= nums[right]` (maintain decreasing). For min deque, remove from back while `nums[back] >= nums[right]` (maintain increasing). Mixing these up gives wrong results.

## When You'll See This Pattern

This "sliding window with monotonic deques" pattern appears in problems where you need to track extreme values in a moving window:

1. **Sliding Window Maximum (LeetCode 239)**: Similar but only needs max deque
2. **Shortest Subarray with Sum at Least K (LeetCode 862)**: Uses monotonic deque to maintain prefix sums
3. **Maximum Sum Circular Subarray (LeetCode 918)**: Can use deque to find maximum in fixed-size windows

The pattern is: when you need to efficiently track min/max in a sliding window, think of monotonic deques. When the window constraint involves both min AND max, you need two deques.

## Key Takeaways

1. **Monotonic deques efficiently track window extremes**: By maintaining sorted order in deques, you get O(1) access to current min/max while supporting O(1) amortized updates.

2. **Sliding window + two pointers is powerful for subarray problems**: When the problem asks for "longest subarray satisfying condition," consider if the condition allows window expansion (when valid) and contraction (when invalid).

3. **Store indices, not values**: This lets you determine when elements leave the window as you move the left pointer, which is crucial for maintaining correct deques.

Related problems: [Partition Array Such That Maximum Difference Is K](/problem/partition-array-such-that-maximum-difference-is-k), [Count Subarrays With Fixed Bounds](/problem/count-subarrays-with-fixed-bounds)
