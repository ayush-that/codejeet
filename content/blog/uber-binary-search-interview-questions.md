---
title: "Binary Search Questions at Uber: What to Expect"
description: "Prepare for Binary Search interview questions at Uber — patterns, difficulty breakdown, and study tips."
date: "2027-06-01"
category: "dsa-patterns"
tags: ["uber", "binary-search", "interview prep"]
---

## Why Binary Search Matters at Uber

Uber’s engineering challenges are fundamentally about optimization at scale. Whether it’s matching riders to drivers, calculating ETAs across a dynamic road network, or efficiently allocating resources in real-time, the core problem is often: _given a massive search space, find the optimal point as fast as possible._ This is the exact domain of binary search.

With 39 Binary Search questions in their tagged LeetCode list (over 10% of their total), it’s not just a common topic—it’s a **core screening mechanism**. Interviewers use it to assess if you can move beyond the textbook “find an element in a sorted array” and apply the _principle of reduction_ to ambiguous, real-world constraints. In my experience conducting and passing interviews there, a Binary Search question appears in roughly **1 out of every 3 technical rounds**, often as the second coding question. They don’t just test if you know the algorithm; they test if you can recognize when to use it on non-obvious data.

## Specific Patterns Uber Favors

Uber’s Binary Search problems rarely involve a simple sorted list. They focus on two advanced patterns that mirror their real systems:

1.  **Binary Search on Answer (or "Guess the Solution")**: You aren’t searching for an element in an array; you’re searching for the _minimum or maximum feasible value_ of a function. The "array" is the monotonic function of your guess, and you use a helper to check feasibility.
    - **Example:** LeetCode #410 "Split Array Largest Sum". Given an array and `m` splits, minimize the largest subarray sum. The search space is all possible maximum sums (from `max(nums)` to `sum(nums)`). Your helper function checks if a given maximum sum is feasible with `m` splits.
    - **Uber Connection:** This directly models load balancing across servers or batching jobs to minimize maximum processing time.

2.  **Binary Search on Implicitly Sorted/Rotated Structures**: The data isn’t in a plain 1D array. It could be a 2D matrix (sorted row-wise and column-wise), a rotated sorted array, or even the output of a black-box function.
    - **Example:** LeetCode #33 "Search in Rotated Sorted Array". This tests your ability to handle partial order and make decisions based on which segment is sorted.
    - **Uber Connection:** Think of searching through time-series data that might have cyclical patterns or rolled-over logs.

Here is the canonical template for the "Binary Search on Answer" pattern, which is arguably the most critical to master for Uber:

<div class="code-group">

```python
def binary_search_on_answer(nums, m):
    """
    Template for problems like "Split Array Largest Sum" (#410).
    We search for the minimum feasible maximum sum.
    """
    def can_split(limit):
        """Helper: returns True if we can split into <= m subarrays
        each with sum <= limit."""
        current_sum = 0
        required_splits = 1  # start with one subarray
        for num in nums:
            if current_sum + num > limit:
                # Need a new split
                required_splits += 1
                current_sum = num
                if required_splits > m:
                    return False
            else:
                current_sum += num
        return True

    # Define the search space: low is the largest single element,
    # high is the total sum.
    low, high = max(nums), sum(nums)
    answer = high

    while low <= high:
        mid = low + (high - low) // 2
        if can_split(mid):
            # Feasible with mid as max sum. Try for a smaller sum.
            answer = mid
            high = mid - 1
        else:
            # Not feasible, need a larger allowed sum.
            low = mid + 1
    return answer

# Time: O(n * log(S)) where n = len(nums), S = sum(nums) - max(nums)
# Space: O(1)
```

```javascript
function binarySearchOnAnswer(nums, m) {
  const canSplit = (limit) => {
    let currentSum = 0;
    let requiredSplits = 1;
    for (const num of nums) {
      if (currentSum + num > limit) {
        requiredSplits++;
        currentSum = num;
        if (requiredSplits > m) return false;
      } else {
        currentSum += num;
      }
    }
    return true;
  };

  let low = Math.max(...nums);
  let high = nums.reduce((a, b) => a + b, 0);
  let answer = high;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (canSplit(mid)) {
      answer = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return answer;
}
// Time: O(n * log(S)) | Space: O(1)
```

```java
public class BinarySearchOnAnswer {
    public int splitArray(int[] nums, int m) {
        int low = 0, high = 0;
        for (int num : nums) {
            low = Math.max(low, num);
            high += num;
        }
        int answer = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (canSplit(nums, m, mid)) {
                answer = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return answer;
    }

    private boolean canSplit(int[] nums, int m, int limit) {
        int currentSum = 0;
        int requiredSplits = 1;
        for (int num : nums) {
            if (currentSum + num > limit) {
                requiredSplits++;
                currentSum = num;
                if (requiredSplits > m) return false;
            } else {
                currentSum += num;
            }
        }
        return true;
    }
}
// Time: O(n * log(S)) | Space: O(1)
```

</div>

## How Uber Tests Binary Search vs Other Companies

At companies like Google or Meta, a Binary Search problem might be one component of a more complex, multi-step problem. At Uber, it’s often the **entire problem**, but with a twist that requires deep understanding. The difficulty isn’t in the code volume; it’s in the **problem framing**.

- **Uber:** "Here’s a business constraint (minimize max driver wait time). Design the search space and feasibility function." You must derive the monotonic property.
- **Other Companies (e.g., Amazon):** Might present a more literal, array-based search but wrapped in a story about warehouse logistics. The binary search logic is more direct.

The unique aspect of Uber’s approach is the **emphasis on the helper function**. You’ll spend most of your interview time reasoning about and coding the `canSplit` (or equivalent) function. The binary search loop itself is trivial once you’ve correctly defined the search bounds and the monotonic condition.

## How to Prepare

1.  **Internalize the Principle:** Binary search applies any time you have a _monotonic predicate_ over a _search space_. If condition `P(x)` is `True`, then `P(y)` is `True` for all `y > x` (or vice versa). Your first question for any problem should be: "Can I define a yes/no question where the answers are sorted?"
2.  **Master the Two-Pointer Loop:** Use `while (low <= high)` for clarity and to avoid off-by-one errors. Always calculate `mid` as `low + (high - low) // 2`.
3.  **Practice Deriving Bounds:** The `low` and `high` are not always `0` and `n-1`. They are the absolute minimum and maximum possible answers. Start broadly if unsure.

Let’s look at the second critical pattern: searching in a rotated array. This tests your ability to navigate broken order.

<div class="code-group">

```python
def search_rotated(nums, target):
    """LeetCode #33: Search in Rotated Sorted Array."""
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # Determine which side is properly sorted
        if nums[left] <= nums[mid]:  # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target is in the sorted left half
            else:
                left = mid + 1   # Target is in the right half
        else:  # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target is in the sorted right half
            else:
                right = mid - 1  # Target is in the left half
    return -1

# Time: O(log n) | Space: O(1)
```

```javascript
function searchRotated(nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      // Left side is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right side is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}
// Time: O(log n) | Space: O(1)
```

```java
public int searchRotated(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}
// Time: O(log n) | Space: O(1)
```

</div>

## Study Order

1.  **Classic Binary Search:** (LeetCode #704). Cement the basic loop and the concept of reducing the search space by half. This is your foundation.
2.  **Search in Rotated/Modified Arrays:** (LeetCode #33, #81, #153). Learn to handle data that isn't perfectly sorted. This builds flexibility.
3.  **Binary Search on Answer:** (LeetCode #410, #875, #1011). This is the most important category for Uber. Practice identifying the search space (the answer) and writing the feasibility check.
4.  **2D/Multi-dimensional Search:** (LeetCode #74, #240). Extend the logic to matrices. This is less common but good for completeness.
5.  **Advanced Applications:** (LeetCode #4 "Median of Two Sorted Arrays"). This combines binary search with deep index manipulation. Consider this a "test of mastery."

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **704. Binary Search** - The absolute baseline.
2.  **33. Search in Rotated Sorted Array** - Handle broken order.
3.  **153. Find Minimum in Rotated Sorted Array** - A slight variation on #33.
4.  **875. Koko Eating Bananas** - A perfect, straightforward "Binary Search on Answer" problem.
5.  **1011. Capacity To Ship Packages Within D Days** - Same pattern as #875, slightly more complex helper.
6.  **410. Split Array Largest Sum** - The quintessential Uber-style problem. This is your final exam for this topic.

Mastering these patterns will make you exceptionally prepared for the optimization-focused problems Uber loves to ask. Remember, they care less about you reciting code and more about you modeling a constraint and efficiently searching for its optimum.

[Practice Binary Search at Uber](/company/uber/binary-search)
