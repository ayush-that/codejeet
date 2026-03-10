---
title: "Array Questions at Agoda: What to Expect"
description: "Prepare for Array interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-04"
category: "dsa-patterns"
tags: ["agoda", "array", "interview prep"]
---

If you're preparing for an Agoda software engineering interview, you should be looking at your calendar and thinking, "I need to get good at arrays." Not just good—proficient. The data is stark: on their public LeetCode profile, **30 of Agoda's 46 tagged problems are array-based**. That's a 65% concentration. In the world of tech interviews, where topics are usually spread across data structures, this is a significant signal. It's not just a favorite topic; it's a core competency they test for repeatedly. From my conversations with engineers who've interviewed there and the problem patterns themselves, arrays form the bedrock of their technical screening because they're the fundamental data structure for so much of their work—handling hotel listings, pricing data, date ranges, and user session information. You will almost certainly face at least one array problem in your interview loop.

## Specific Patterns Agoda Favors

Agoda's array problems aren't about obscure tricks. They heavily favor **practical, iterative problem-solving** that mirrors real-world backend and data processing tasks. You'll see a distinct lean toward:

1.  **In-Place Array Manipulation & Two-Pointers:** This is their bread and butter. Think about tasks like deduplicating sorted data, merging sorted lists, or partitioning—common operations in data pipelines. Problems like **Remove Duplicates from Sorted Array (#26)** and **Merge Sorted Array (#88)** are classic examples.
2.  **Sliding Window:** Given Agoda's domain (search, bookings, analytics), efficiently processing contiguous subarrays is key. This pattern is everywhere, from calculating maximum averages (**Maximum Average Subarray I, #643**) to more complex problems with constraints.
3.  **Intervals:** This is a huge theme. Managing and merging overlapping date ranges or booking times is a direct analog to their business. **Merge Intervals (#56)** and **Insert Interval (#57)** are not just practice problems; they are simplified versions of actual system logic.
4.  **Hash Map for Lookup & Counting:** While not exclusively an array pattern, it's most often applied to them. Problems like **Two Sum (#1)** and its variants test your ability to use auxiliary data structures for efficient lookups, crucial for feature matching or validation systems.

You'll notice a relative _absence_ of highly abstract, purely mathematical array puzzles or the most complex forms of dynamic programming. The focus is on clean, efficient, and robust manipulation of the data structure itself.

## How to Prepare

Don't just solve problems; internalize the patterns. For Agoda, depth on the core patterns is more valuable than breadth across every data structure. Let's look at the **Sliding Window** pattern, which you must master.

The key is to recognize the problem asks for a contiguous subarray/substring meeting a condition (max sum, min length, containing certain characters). The template uses two pointers (`left` and `right`) to define the window and a variable to track the window's state (like its sum).

Here’s a template for a variable-length sliding window finding the **minimum length subarray with a sum >= target**:

<div class="code-group">

```python
def min_subarray_len(target, nums):
    """
    Finds the minimal length of a contiguous subarray of which
    the sum is greater than or equal to target.
    Time: O(n) - Each element visited at most twice (by `right` and `left`).
    Space: O(1) - Only a few integer variables used.
    """
    n = len(nums)
    left = 0
    current_sum = 0
    min_len = float('inf')

    for right in range(n):
        # Expand the window by adding the element at `right`
        current_sum += nums[right]

        # Shrink the window from the left as long as the condition is met
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1

    return 0 if min_len == float('inf') else min_len
```

```javascript
function minSubArrayLen(target, nums) {
  /**
   * Finds the minimal length of a contiguous subarray of which
   * the sum is greater than or equal to target.
   * Time: O(n) - Each element visited at most twice.
   * Space: O(1) - Constant extra space.
   */
  let n = nums.length;
  let left = 0;
  let currentSum = 0;
  let minLen = Infinity;

  for (let right = 0; right < n; right++) {
    // Expand the window
    currentSum += nums[right];

    // Shrink the window from the left while condition is satisfied
    while (currentSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}
```

```java
public int minSubArrayLen(int target, int[] nums) {
    /**
     * Finds the minimal length of a contiguous subarray of which
     * the sum is greater than or equal to target.
     * Time: O(n) - Each element visited at most twice.
     * Space: O(1) - Constant extra space.
     */
    int n = nums.length;
    int left = 0;
    int currentSum = 0;
    int minLen = Integer.MAX_VALUE;

    for (int right = 0; right < n; right++) {
        // Expand the window
        currentSum += nums[right];

        // Shrink the window from the left while condition is satisfied
        while (currentSum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }

    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
```

</div>

Another critical pattern is **In-Place Modification with Two-Pointers**. A classic is moving all zeros to the end while maintaining relative order. The trick is to use one pointer (`insert_pos`) to track where the next non-zero element should go, and another (`i`) to scan the array.

<div class="code-group">

```python
def move_zeroes(nums):
    """
    Moves all 0's to the end while maintaining the relative order
    of the non-zero elements. Operates in-place.
    Time: O(n) - Single pass through the array.
    Space: O(1) - Modification is done in-place.
    """
    insert_pos = 0  # Tracks the position for the next non-zero element

    # First pass: move all non-zero elements to the front
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert_pos] = nums[i]
            insert_pos += 1

    # Second pass: fill the remaining positions with zeros
    for i in range(insert_pos, len(nums)):
        nums[i] = 0
```

```javascript
function moveZeroes(nums) {
  /**
   * Moves all 0's to the end while maintaining the relative order
   * of the non-zero elements. Operates in-place.
   * Time: O(n) - Single pass through the array.
   * Space: O(1) - Modification is done in-place.
   */
  let insertPos = 0;

  // Move non-zero elements forward
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }

  // Fill the rest with zeros
  for (let i = insertPos; i < nums.length; i++) {
    nums[i] = 0;
  }
}
```

```java
public void moveZeroes(int[] nums) {
    /**
     * Moves all 0's to the end while maintaining the relative order
     * of the non-zero elements. Operates in-place.
     * Time: O(n) - Single pass through the array.
     * Space: O(1) - Modification is done in-place.
     */
    int insertPos = 0;

    // Move non-zero elements forward
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            nums[insertPos] = nums[i];
            insertPos++;
        }
    }

    // Fill the rest with zeros
    for (int i = insertPos; i < nums.length; i++) {
        nums[i] = 0;
    }
}
```

</div>

## How Agoda Tests Array vs Other Companies

Compared to other major tech companies, Agoda's array questions tend to be more **applied and less algorithmic**. Let's contrast:

- **Google/Meta:** Often use arrays as an input to test deeper algorithmic knowledge (e.g., complex dynamic programming, graph transformations, or divide-and-conquer). The array is just the vessel.
- **Amazon:** Leans heavily toward arrays in the context of system design or behavioral questions (e.g., "how would you design a system that handles this data stream?").
- **Agoda:** The array _is_ the problem. The operations—sorting, merging, partitioning, windowing—are the direct focus. The difficulty is typically in the **LeetCode Medium** range, with an emphasis on writing bug-free, efficient code that clearly demonstrates mastery of the pattern, rather than on deriving a novel, complex algorithm on the spot. It's engineering proficiency over computer science brilliance.

## Study Order

Tackle array topics in this order to build a logical progression of skills:

1.  **Basic Traversal & Hash Map Lookup:** Start with the absolute fundamentals. Can you iterate and use a dictionary/set to solve a problem like Two Sum? This builds confidence.
2.  **Two-Pointers (Sorted Input):** Learn to use two pointers on a _sorted_ array for problems like pair summing or deduplication. This introduces the concept of directional movement.
3.  **Sliding Window:** Master fixed and variable-length windows. This is a direct extension of two-pointers but for contiguous segments. It's one of Agoda's most frequent patterns.
4.  **In-Place Manipulation & Two-Pointers (Unsorted):** Now apply two-pointer techniques to unsorted arrays for tasks like partitioning (Move Zeroes) or element segregation. This tests your ability to manage indices carefully.
5.  **Intervals:** Tackle merging, inserting, and comparing intervals. This pattern has a clear real-world parallel at Agoda and requires good spatial reasoning.
6.  **Prefix Sum:** Learn to pre-compute cumulative sums to answer range queries quickly. It's a powerful optimization pattern that appears in various guises.

## Recommended Practice Order

Solve these Agoda-tagged or highly relevant problems in sequence:

1.  **Two Sum (#1)** - Hash Map fundamentals.
2.  **Remove Duplicates from Sorted Array (#26)** - Basic two-pointers on sorted data.
3.  **Maximum Average Subarray I (#643)** - Classic fixed-length sliding window.
4.  **Minimum Size Subarray Sum (#209)** - Variable-length sliding window (use the template above).
5.  **Move Zeroes (#283)** - In-place manipulation with two-pointers.
6.  **Merge Sorted Array (#88)** - Two-pointers from the end.
7.  **Merge Intervals (#56)** - The essential interval pattern. Sort and merge.
8.  **Insert Interval (#57)** - A more challenging variant of merge intervals.
9.  **Product of Array Except Self (#238)** - A clever problem combining prefix and suffix concepts.
10. **Find All Duplicates in an Array (#442)** - Excellent test of in-place marking using the array itself as a hash map.

Mastering this progression will give you the toolkit needed for the vast majority of Agoda's array-focused interviews. Remember, they're looking for clean, logical, and efficient code that solves a concrete problem—exactly the skills you use as a professional software engineer.

[Practice Array at Agoda](/company/agoda/array)
