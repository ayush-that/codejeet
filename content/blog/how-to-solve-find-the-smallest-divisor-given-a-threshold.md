---
title: "How to Solve Find the Smallest Divisor Given a Threshold — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Smallest Divisor Given a Threshold. Medium difficulty, 65.5% acceptance rate. Topics: Array, Binary Search."
date: "2027-07-06"
category: "dsa-patterns"
tags: ["find-the-smallest-divisor-given-a-threshold", "array", "binary-search", "medium"]
---

# How to Solve Find the Smallest Divisor Given a Threshold

You're given an array of integers `nums` and a threshold value. Your task is to find the smallest positive integer divisor such that when you divide each number in the array by this divisor (rounding up the result) and sum all these results, the total is less than or equal to the threshold. This problem is interesting because it looks like a simple division problem at first, but the optimal solution requires recognizing a binary search pattern in the divisor space rather than trying every possible divisor.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have `nums = [1, 2, 5, 9]` and `threshold = 6`.

**Understanding the calculation:**
For any divisor `d`, we calculate the sum of `ceil(num / d)` for all numbers in `nums`. For example:

- With `d = 1`: ceil(1/1) + ceil(2/1) + ceil(5/1) + ceil(9/1) = 1 + 2 + 5 + 9 = 17
- With `d = 2`: ceil(1/2) + ceil(2/2) + ceil(5/2) + ceil(9/2) = 1 + 1 + 3 + 5 = 10
- With `d = 3`: ceil(1/3) + ceil(2/3) + ceil(5/3) + ceil(9/3) = 1 + 1 + 2 + 3 = 7
- With `d = 4`: ceil(1/4) + ceil(2/4) + ceil(5/4) + ceil(9/4) = 1 + 1 + 2 + 3 = 7
- With `d = 5`: ceil(1/5) + ceil(2/5) + ceil(5/5) + ceil(9/5) = 1 + 1 + 1 + 2 = 5

We need the smallest `d` where the sum ≤ threshold (6). Looking at our calculations:

- `d = 1`: sum = 17 (too high)
- `d = 2`: sum = 10 (too high)
- `d = 3`: sum = 7 (too high)
- `d = 4`: sum = 7 (too high)
- `d = 5`: sum = 5 (≤ 6, works!)

So the answer is 5. Notice something important: as the divisor increases, the sum decreases or stays the same. This monotonic relationship is what allows us to use binary search!

## Brute Force Approach

The most straightforward approach is to try every possible divisor starting from 1 and going up until we find one that works. For each divisor, we calculate the sum of ceiling divisions and check if it's ≤ threshold.

**Why this is inefficient:**
The maximum divisor we might need to check could be as large as the maximum number in `nums` (since dividing by a number larger than the maximum will give us 1 for each element). In the worst case, if `nums = [1000000, 1000000, ...]` and threshold is small, we might need to check up to 1,000,000 divisors. For each divisor, we need to iterate through all `n` elements to calculate the sum. This gives us O(n × max(nums)) time complexity, which is far too slow for the constraints (n up to 5×10⁴, nums[i] up to 10⁶).

## Optimized Approach

The key insight is that the relationship between the divisor and the resulting sum is **monotonic**:

- As the divisor increases, the sum decreases or stays the same
- As the divisor decreases, the sum increases or stays the same

This monotonic property allows us to use **binary search** to find the smallest divisor that satisfies the condition. Instead of checking every possible divisor linearly, we can search the divisor space efficiently.

**Binary search setup:**

1. **Left boundary (low):** The smallest possible divisor is 1
2. **Right boundary (high):** The largest divisor we need to consider is `max(nums)` because:
   - If we use a divisor larger than the maximum number, every `ceil(num / divisor)` will be 1
   - The sum will be `n` (number of elements)
   - If threshold < n, then no divisor works (but the problem guarantees a solution exists)
   - So we can safely use `max(nums)` as our upper bound

3. **Midpoint calculation:** `mid = (low + high) // 2`
4. **Check function:** Calculate the sum with divisor = `mid`
   - If sum ≤ threshold: `mid` might be our answer, but we need to check if there's a smaller divisor that also works (search left half)
   - If sum > threshold: `mid` is too small, we need a larger divisor (search right half)

This reduces our time complexity from O(n × max(nums)) to O(n × log(max(nums))), which is efficient enough for the given constraints.

## Optimal Solution

Here's the complete solution using binary search:

<div class="code-group">

```python
# Time: O(n * log(max(nums))) | Space: O(1)
def smallestDivisor(nums, threshold):
    """
    Find the smallest divisor such that the sum of ceil(num / divisor)
    for all nums is <= threshold.
    """
    # Helper function to calculate the sum with a given divisor
    def calculate_sum(divisor):
        total = 0
        for num in nums:
            # Ceiling division: (num + divisor - 1) // divisor
            total += (num + divisor - 1) // divisor
        return total

    # Binary search boundaries
    left = 1  # Smallest possible divisor
    right = max(nums)  # Largest divisor we need to check

    # Perform binary search
    while left < right:
        mid = (left + right) // 2

        # Calculate sum with current divisor
        current_sum = calculate_sum(mid)

        if current_sum <= threshold:
            # Current divisor works, but we need the smallest one
            # So we search in the left half (including mid)
            right = mid
        else:
            # Current divisor is too small, sum exceeds threshold
            # So we need a larger divisor
            left = mid + 1

    # When left == right, we've found the smallest divisor
    return left
```

```javascript
// Time: O(n * log(max(nums))) | Space: O(1)
function smallestDivisor(nums, threshold) {
  /**
   * Find the smallest divisor such that the sum of ceil(num / divisor)
   * for all nums is <= threshold.
   */

  // Helper function to calculate the sum with a given divisor
  const calculateSum = (divisor) => {
    let total = 0;
    for (const num of nums) {
      // Ceiling division: Math.ceil(num / divisor)
      total += Math.ceil(num / divisor);
    }
    return total;
  };

  // Binary search boundaries
  let left = 1; // Smallest possible divisor
  let right = Math.max(...nums); // Largest divisor we need to check

  // Perform binary search
  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Calculate sum with current divisor
    const currentSum = calculateSum(mid);

    if (currentSum <= threshold) {
      // Current divisor works, but we need the smallest one
      // So we search in the left half (including mid)
      right = mid;
    } else {
      // Current divisor is too small, sum exceeds threshold
      // So we need a larger divisor
      left = mid + 1;
    }
  }

  // When left == right, we've found the smallest divisor
  return left;
}
```

```java
// Time: O(n * log(max(nums))) | Space: O(1)
class Solution {
    public int smallestDivisor(int[] nums, int threshold) {
        /**
         * Find the smallest divisor such that the sum of ceil(num / divisor)
         * for all nums is <= threshold.
         */

        // Helper function to calculate the sum with a given divisor
        // Defined as a lambda for clarity
        java.util.function.IntUnaryOperator calculateSum = (divisor) -> {
            int total = 0;
            for (int num : nums) {
                // Ceiling division: (num + divisor - 1) / divisor
                total += (num + divisor - 1) / divisor;
            }
            return total;
        };

        // Binary search boundaries
        int left = 1;  // Smallest possible divisor
        int right = 0; // Will be set to max(nums)

        // Find the maximum value in nums for the upper bound
        for (int num : nums) {
            if (num > right) {
                right = num;
            }
        }

        // Perform binary search
        while (left < right) {
            int mid = left + (right - left) / 2;  // Avoids overflow

            // Calculate sum with current divisor
            int currentSum = calculateSum.applyAsInt(mid);

            if (currentSum <= threshold) {
                // Current divisor works, but we need the smallest one
                // So we search in the left half (including mid)
                right = mid;
            } else {
                // Current divisor is too small, sum exceeds threshold
                // So we need a larger divisor
                left = mid + 1;
            }
        }

        // When left == right, we've found the smallest divisor
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × log(max(nums)))**

- We perform binary search over the range [1, max(nums)], which takes O(log(max(nums))) iterations
- In each iteration, we calculate the sum by iterating through all `n` elements, which takes O(n) time
- Therefore, total time is O(n × log(max(nums)))

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables like `left`, `right`, `mid`, and the running sum
- The input array is not modified, and we don't create any additional data structures proportional to the input size

## Common Mistakes

1. **Incorrect ceiling division implementation:** Using integer division `num // divisor` gives the floor, not the ceiling. The correct formula is `(num + divisor - 1) // divisor` in Python/Java or `Math.ceil(num / divisor)` in JavaScript.

2. **Wrong binary search boundaries:** Setting the upper bound too low (like `sum(nums)` instead of `max(nums)`). If the threshold is very small, we might need divisors larger than individual elements to reduce the sum enough.

3. **Infinite binary search loop:** Using `while (left <= right)` with `right = mid - 1` can work, but you need to be careful with the termination condition. The pattern shown above with `while (left < right)` and `right = mid` (when condition is met) or `left = mid + 1` (when not met) is more straightforward for "find the smallest that satisfies condition" problems.

4. **Not handling the monotonic property correctly:** Some candidates try to optimize by starting the search at `sum(nums) // threshold` or similar heuristics, but these can fail on edge cases. Binary search over the entire valid range is more reliable.

## When You'll See This Pattern

This problem uses the **"binary search on answer"** pattern, where instead of searching through the input array, you're searching through the space of possible answers. You'll see this pattern in problems where:

1. The answer space is monotonic (as the candidate answer increases/decreases, some condition changes predictably)
2. Checking whether a candidate answer works is easier than finding the answer directly

**Related problems:**

- **Minimized Maximum of Products Distributed to Any Store (LeetCode 2064):** Very similar structure - find the minimum maximum allocation by binary searching on the allocation size.
- **Koko Eating Bananas (LeetCode 875):** Almost identical pattern - find the minimum eating speed by binary searching on speed values.
- **Capacity To Ship Packages Within D Days (LeetCode 1011):** Find the minimum ship capacity by binary searching on capacity values.

## Key Takeaways

1. **Recognize monotonic relationships:** When a problem asks for the "minimum X such that condition Y is satisfied," and as X increases, Y changes in a predictable way (either always increasing or always decreasing), binary search on the answer space is often the solution.

2. **Binary search works on more than just sorted arrays:** You can binary search over any range where you have a monotonic predicate function. The range doesn't need to be an array - it can be integers, floating-point numbers, or any ordered set.

3. **Separate the check from the search:** Implement a helper function that checks if a candidate answer works. This makes the binary search logic cleaner and easier to reason about.

Related problems: [Minimized Maximum of Products Distributed to Any Store](/problem/minimized-maximum-of-products-distributed-to-any-store)
