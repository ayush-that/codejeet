---
title: "Array Questions at Coupang: What to Expect"
description: "Prepare for Array interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-06-14"
category: "dsa-patterns"
tags: ["coupang", "array", "interview prep"]
---

If you're preparing for a Coupang interview, you need to understand one thing immediately: arrays are not just another topic. They are the single most important data structure you will face. With 24 out of 53 tagged questions being array-based, nearly half of their technical question pool revolves around manipulating sequences of data. This isn't a coincidence. Coupang's core business—logistics, inventory management, real-time delivery tracking, and warehouse optimization—is fundamentally built on processing ordered data: delivery routes, product SKU lists, time-series event logs, and warehouse slot indices. Your ability to efficiently traverse, transform, and reason about arrays directly mirrors the day-to-day problem-solving required of their engineers. Expect at least one, and very likely two, array-focused problems in any given technical round.

## Specific Patterns Coupang Favors

Coupang's array problems tend to cluster around a few high-impact patterns that model real-world systems. You won't see many abstract mathematical puzzles. Instead, you'll get problems that feel like simplified versions of their operational challenges.

1.  **Sliding Window & Two Pointers:** This is the undisputed king. Think processing continuous data streams—like analyzing a sequence of delivery status updates over time or finding optimal batches in a conveyor system. Problems often involve finding a subarray meeting a condition (max sum, shortest/longest length with a constraint).
2.  **Prefix Sum & Hashing:** Closely related to the above, this pattern is for problems involving cumulative quantities or needing rapid lookup to find complementary values. This models inventory lookup (have we seen this product ID before?) or checking if a running total matches a target.
3.  **In-Place Array Manipulation:** Coupang likes problems that require modifying an array without extra space, reflecting constraints of processing high-volume data in memory. This includes techniques like cyclic sort for a range of numbers or the classic "Dutch National Flag" partition.
4.  **Merge Intervals:** A direct analog for scheduling delivery windows, managing overlapping promotional periods, or consolidating warehouse operating hours. If the problem mentions "ranges," "schedules," or "overlap," think intervals.

You'll notice a distinct _absence_ of heavily recursive patterns like complex backtracking or divide-and-conquer (e.g., custom sort implementations). Their focus is on **iterative, pointer-based logic** that can handle large, streaming datasets—exactly what their systems do.

## How to Prepare

Don't just solve problems; solve them with the right mental model. For Coupang, your preparation should ingrain the sliding window and two-pointer approach until it's reflexive. Let's break down the most common variation: finding the longest subarray with a sum constraint.

The brute-force approach is to check every subarray, which is O(n²). The optimal pattern uses a sliding window expanded by a right pointer and contracted by a left pointer to maintain validity.

<div class="code-group">

```python
def longest_subarray_with_sum_at_most_k(nums, k):
    """
    Finds the length of the longest subarray where the sum is <= k.
    Models problems like "maximum deliveries possible within a fuel limit."
    """
    left = 0
    current_sum = 0
    max_length = 0

    for right in range(len(nums)):
        # 1. Expand the window to the right
        current_sum += nums[right]

        # 2. If constraint is broken (sum > k), contract from the left
        while current_sum > k and left <= right:
            current_sum -= nums[left]
            left += 1

        # 3. Window is now valid. Update the answer.
        # The window [left, right] always has sum <= k here.
        max_length = max(max_length, right - left + 1)

    return max_length

# Time: O(n) - Each element is processed at most twice (added once, removed once).
# Space: O(1) - Only a few integer variables are used.
```

```javascript
function longestSubarrayWithSumAtMostK(nums, k) {
  let left = 0;
  let currentSum = 0;
  let maxLength = 0;

  for (let right = 0; right < nums.length; right++) {
    // Expand window
    currentSum += nums[right];

    // Shrink window until constraint is satisfied
    while (currentSum > k && left <= right) {
      currentSum -= nums[left];
      left++;
    }

    // Update answer with valid window
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Time: O(n) | Space: O(1)
```

```java
public int longestSubarrayWithSumAtMostK(int[] nums, int k) {
    int left = 0;
    int currentSum = 0;
    int maxLength = 0;

    for (int right = 0; right < nums.length; right++) {
        // Add the new element to the window
        currentSum += nums[right];

        // If the sum exceeds k, move the left boundary forward
        while (currentSum > k && left <= right) {
            currentSum -= nums[left];
            left++;
        }

        // The window [left, right] is now valid
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// Time: O(n) | Space: O(1)
```

</div>

The core logic is always the same: `expand (right++)`, `shrink while invalid (while... left++)`, `record answer`. Practice this skeleton until you can derive variations for problems like "minimum size subarray sum" (where you shrink to find the minimum valid window) or "subarrays with exactly K distinct integers" (which often uses a hash map with the window).

Another critical pattern is in-place manipulation for arrays representing permutations or containing duplicates. Here's the classic "move all zeros to the end" problem, which is a simpler variant of the partition logic used in quicksort.

<div class="code-group">

```python
def move_zeroes(nums):
    """
    Moves all 0's to the end while maintaining the relative order of non-zero elements.
    Analogous to filtering valid events to the front of a log stream.
    """
    # `write` pointer marks the position for the next non-zero element.
    write = 0

    for read in range(len(nums)):
        if nums[read] != 0:
            # Place the non-zero element at the `write` index
            nums[write] = nums[read]
            # Only increment write after placing an element
            write += 1

    # Fill the remaining positions from `write` to end with zeroes
    for i in range(write, len(nums)):
        nums[i] = 0

# Time: O(n) - Two passes, but each element is touched a constant number of times.
# Space: O(1) - Modification is done in-place.
```

```javascript
function moveZeroes(nums) {
  let write = 0;

  // First pass: move all non-zero elements forward
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }

  // Second pass: fill the rest with zeroes
  for (let i = write; i < nums.length; i++) {
    nums[i] = 0;
  }
}

// Time: O(n) | Space: O(1)
```

```java
public void moveZeroes(int[] nums) {
    int write = 0;

    // Move non-zero elements to the front
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) {
            nums[write] = nums[read];
            write++;
        }
    }

    // Zero out the remaining slots
    for (int i = write; i < nums.length; i++) {
        nums[i] = 0;
    }
}

// Time: O(n) | Space: O(1)
```

</div>

## How Coupang Tests Array vs Other Companies

Compared to other tech companies, Coupang's array questions have a specific flavor:

- **vs. Google/Meta:** These companies often layer array problems with complex data structures (e.g., arrays of trees) or combine them with advanced graph algorithms. Coupang's problems are more "pure" array manipulation.
- **vs. Amazon:** Both focus on practical problems, but Amazon leans more toward object-oriented design with data structures. Coupang's questions are often more algorithmic and leaner, testing raw efficiency.
- **vs. FinTech (e.g., Citadel):** FinTech array problems are often about numerical optimization or stochastic processes. Coupang's are about sequence processing and state tracking.

The unique aspect of Coupang's approach is the **constraint-driven narrative**. The problem description will often implicitly describe a real logistics or e-commerce scenario. Your job is to strip away the narrative and identify the underlying array pattern—usually sliding window, two pointers, or intervals.

## Study Order

Tackle these sub-topics in this order to build a logical progression of skills:

1.  **Basic Traversal & Pointers:** Get comfortable with iterating and using indices. This is your foundation.
2.  **Two Pointers (Opposite Ends):** Problems like "Two Sum II" (#167) or "Container With Most Water" (#11). This teaches you to reason about two indices moving independently.
3.  **Sliding Window (Fixed & Dynamic):** Start with fixed-size windows (e.g., maximum average subarray), then move to dynamic windows that grow and shrink based on a condition. This is your most important skill.
4.  **Prefix Sum & Hashing:** Learn how to pre-compute running sums and use hash maps for instant lookups to solve problems like "Subarray Sum Equals K" (#560).
5.  **In-Place Manipulation:** Practice overwriting arrays intelligently (move zeroes, remove duplicates, cyclic sort). This is critical for space-optimized solutions.
6.  **Merge Intervals:** Learn to sort by start times and merge. This pattern is distinct but appears frequently enough to warrant dedicated practice.

This order works because each step uses skills from the previous one. You can't efficiently implement a sliding window without mastery of two-pointer movement, and in-place manipulation often uses a read/write pointer pattern you first learn in the basics.

## Recommended Practice Order

Solve these specific LeetCode problems in sequence. They escalate in a way that mirrors Coupang's question progression.

1.  **Two Sum** (#1) - The classic hash map warm-up.
2.  **Best Time to Buy and Sell Stock** (#121) - Simple one-pass pointer logic.
3.  **Merge Intervals** (#56) - Learn the standard sort-and-merge approach.
4.  **Product of Array Except Self** (#238) - Excellent for learning prefix/postfix thinking without division.
5.  **Maximum Subarray** (#53) - Kadane's Algorithm, a special case of dynamic programming on arrays.
6.  **Longest Substring Without Repeating Characters** (#3) - The canonical sliding window problem (applied to a string, which is a character array).
7.  **Minimum Size Subarray Sum** (#209) - Dynamic sliding window where you shrink to find a minimum.
8.  **Subarray Sum Equals K** (#560) - Combines prefix sum and hash map for an O(n) solution.
9.  **Find All Duplicates in an Array** (#442) - Advanced in-place manipulation using the array itself as a hash map.

Mastering this progression will give you the toolkit to handle the vast majority of Coupang's array questions. Remember, they're testing for clean, efficient, and practical code that could be extended to handle their scale. Your solution should be as optimized and straightforward as their logistics network aims to be.

[Practice Array at Coupang](/company/coupang/array)
