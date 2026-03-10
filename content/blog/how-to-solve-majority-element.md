---
title: "How to Solve Majority Element — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Majority Element. Easy difficulty, 66.1% acceptance rate. Topics: Array, Hash Table, Divide and Conquer, Sorting, Counting."
date: "2026-02-17"
category: "dsa-patterns"
tags: ["majority-element", "array", "hash-table", "divide-and-conquer", "easy"]
---

# How to Solve Majority Element

The problem asks us to find the element that appears more than `⌊n/2⌋` times in an array of size `n`, with the guarantee that such an element exists. What makes this problem interesting is that while it seems straightforward, the optimal solution uses a clever algorithm that finds the answer in O(n) time and O(1) space without needing to count every element's frequency. This is a classic example of how algorithmic insight can dramatically improve efficiency.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 2, 3, 1, 3]` with `n = 5`.

**Step-by-step reasoning:**

1. The majority element must appear at least `⌊5/2⌋ + 1 = 3` times
2. Looking at the array: 3 appears 3 times, 2 appears once, 1 appears once
3. So 3 is our majority element

But how do we find this efficiently? Let's use the Boyer-Moore Voting Algorithm approach:

Initialize: `candidate = None`, `count = 0`

1. `nums[0] = 3`: count is 0, so candidate = 3, count = 1
2. `nums[1] = 2`: different from candidate (3), so count = 0
3. `nums[2] = 3`: count is 0, so candidate = 3, count = 1
4. `nums[3] = 1`: different from candidate (3), so count = 0
5. `nums[4] = 3`: count is 0, so candidate = 3, count = 1

Final candidate = 3, which is indeed the majority element.

The algorithm works because the majority element will "survive" the pairing process where we cancel out non-majority elements.

## Brute Force Approach

The most straightforward approach is to count the frequency of each element and return the one with count > n/2.

**Brute Force Steps:**

1. For each element in the array
2. Count how many times it appears by scanning the entire array
3. If count > n/2, return that element

**Why it's insufficient:**

- Time complexity: O(n²) - For each of n elements, we scan n elements
- Space complexity: O(1) - We only use a few variables
- This is too slow for large arrays (n up to 5×10⁴ in typical constraints)

**Improved Brute Force (but still not optimal):**
We could use a hash map to count frequencies in O(n) time, but that requires O(n) space. While this is acceptable for many cases, the optimal solution achieves O(1) space.

## Optimal Solution

The Boyer-Moore Voting Algorithm provides an elegant O(n) time, O(1) space solution. The key insight is that if we pair each occurrence of the majority element with a different element, we'll have at least one majority element left unpaired at the end.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def majorityElement(nums):
    """
    Find the majority element using Boyer-Moore Voting Algorithm.
    The majority element appears more than ⌊n/2⌋ times.
    """
    candidate = None  # Current candidate for majority element
    count = 0         # Count of how many times we've seen candidate

    # First pass: Find a candidate
    for num in nums:
        if count == 0:
            # If count is 0, we start considering a new candidate
            candidate = num
            count = 1
        elif num == candidate:
            # If we see the same candidate, increase its count
            count += 1
        else:
            # If we see a different element, cancel one vote
            count -= 1

    # Note: The problem guarantees a majority element exists,
    # so we don't need a second pass to verify.
    # In a general case without guarantee, we would:
    # 1. Count occurrences of candidate
    # 2. Verify count > n/2

    return candidate
```

```javascript
// Time: O(n) | Space: O(1)
function majorityElement(nums) {
  /**
   * Find the majority element using Boyer-Moore Voting Algorithm.
   * The majority element appears more than ⌊n/2⌋ times.
   */
  let candidate = null; // Current candidate for majority element
  let count = 0; // Count of how many times we've seen candidate

  // First pass: Find a candidate
  for (let num of nums) {
    if (count === 0) {
      // If count is 0, we start considering a new candidate
      candidate = num;
      count = 1;
    } else if (num === candidate) {
      // If we see the same candidate, increase its count
      count++;
    } else {
      // If we see a different element, cancel one vote
      count--;
    }
  }

  // Note: The problem guarantees a majority element exists,
  // so we don't need a second pass to verify.
  // In a general case without guarantee, we would:
  // 1. Count occurrences of candidate
  // 2. Verify count > n/2

  return candidate;
}
```

```java
// Time: O(n) | Space: O(1)
public int majorityElement(int[] nums) {
    /**
     * Find the majority element using Boyer-Moore Voting Algorithm.
     * The majority element appears more than ⌊n/2⌋ times.
     */
    Integer candidate = null;  // Current candidate for majority element
    int count = 0;             // Count of how many times we've seen candidate

    // First pass: Find a candidate
    for (int num : nums) {
        if (count == 0) {
            // If count is 0, we start considering a new candidate
            candidate = num;
            count = 1;
        } else if (num == candidate) {
            // If we see the same candidate, increase its count
            count++;
        } else {
            // If we see a different element, cancel one vote
            count--;
        }
    }

    // Note: The problem guarantees a majority element exists,
    // so we don't need a second pass to verify.
    // In a general case without guarantee, we would:
    // 1. Count occurrences of candidate
    // 2. Verify count > nums.length / 2

    return candidate;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array with n elements
- Each iteration performs O(1) operations (comparisons and arithmetic)

**Space Complexity: O(1)**

- We only use two variables (`candidate` and `count`)
- No additional data structures that scale with input size

**Why this is optimal:**

- We must examine each element at least once to determine the majority, so Ω(n) is a lower bound
- Our algorithm achieves this lower bound with constant space

## Common Mistakes

1. **Forgetting the guarantee of existence**: Some candidates add unnecessary verification code. While it's good practice in general, the problem explicitly states the majority element always exists, so the verification step is redundant.

2. **Misunderstanding the count logic**: The algorithm doesn't track the actual count of the majority element. It tracks a "net advantage" that the candidate has over other elements. When `count` becomes 0, we're essentially resetting and looking for a new candidate in the remaining elements.

3. **Using sorting unnecessarily**: Some candidates sort the array and return the middle element (since the majority element will occupy the middle position). While this works (O(n log n) time, O(1) or O(n) space depending on sort implementation), it's not optimal for time or space when we have the O(n) O(1) solution.

4. **Off-by-one in count comparisons**: When implementing a hash map solution, some candidates check `count >= n/2` instead of `count > n/2`. Remember: "more than ⌊n/2⌋ times" means strictly greater than, not greater than or equal to.

## When You'll See This Pattern

The Boyer-Moore Voting Algorithm pattern appears in problems where you need to find elements that appear with certain frequency thresholds:

1. **Majority Element II (LeetCode 229)**: Find all elements that appear more than ⌊n/3⌋ times. This extends the voting algorithm to track two candidates simultaneously.

2. **Check If Array Is Majority Element (LeetCode 1150)**: Given a sorted array, check if a given target is the majority element. The voting algorithm isn't needed here since the array is sorted, but it's the same core concept of frequency counting.

3. **Element Appearing More Than 25% In Sorted Array (LeetCode 1287)**: Find the element that appears more than 25% of the time in a sorted array. Again, similar frequency-based reasoning.

The pattern also teaches the important concept of **element pairing/cancellation** which appears in other algorithms like finding missing numbers or duplicate detection.

## Key Takeaways

1. **The voting algorithm demonstrates cancellation**: When you have a majority element (appearing > n/2 times), pairing it with different elements will leave at least one instance of the majority element. This cancellation principle is powerful for frequency-based problems.

2. **Always check problem guarantees**: The fact that a majority element is guaranteed to exist simplifies the solution. Without this guarantee, you'd need a second pass to verify the candidate actually appears > n/2 times.

3. **Consider multiple approaches**: While sorting or hash maps work, the optimal solution often requires deeper insight. When a problem asks for O(n) time and O(1) space, think about what information you can track as you make a single pass.

**Related problems:** [Majority Element II](/problem/majority-element-ii), [Check If a Number Is Majority Element in a Sorted Array](/problem/check-if-a-number-is-majority-element-in-a-sorted-array), [Most Frequent Even Element](/problem/most-frequent-even-element)
