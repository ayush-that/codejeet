---
title: "Array Questions at Yandex: What to Expect"
description: "Prepare for Array interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-02-14"
category: "dsa-patterns"
tags: ["yandex", "array", "interview prep"]
---

If you're preparing for a Yandex interview, you should know this: **67 out of their 134 tagged LeetCode problems are Array-based.** That's exactly 50%. This isn't a coincidence or a quirk of the platform. It reflects a fundamental truth about their engineering interviews: they view the array as the ultimate data structure for testing a candidate's core algorithmic reasoning, problem decomposition, and code clarity under pressure. Unlike some companies that might jump straight to complex graph or system design questions, Yandex often uses array problems as the primary filter. Doing well here isn't just about passing one round; it's about demonstrating the kind of clean, efficient, and logical thinking they value in their developers, who work on everything from search algorithms to distributed systems and self-driving cars.

## Specific Patterns Yandex Favors

Yandex's array problems aren't about trivial iterations. They heavily favor a few specific patterns that test your ability to manipulate indices, manage state, and apply clever optimizations. You'll rarely see a simple "find the maximum" question.

1.  **In-Place Array Manipulation & Two Pointers:** This is arguably their signature style. They love problems where you must rearrange, partition, or modify an array **without using extra space (O(1) space)**. This tests your understanding of pointer logic and array indexing fundamentals.
    - **Examples:** **Move Zeroes (#283)** is a classic warm-up. **Sort Colors (#75)** (Dutch National Flag) is a quintessential Yandex problem. **Remove Duplicates from Sorted Array (#26 & #80)** are must-knows.

2.  **Prefix Sum & Sliding Window:** For subarray problems, Yandex frequently tests your ability to think in terms of cumulative sums or maintain a dynamic window. This pattern is crucial for problems involving contiguous subarrays meeting a sum or condition.
    - **Examples:** **Maximum Subarray (#53)** (Kadane's Algorithm), **Subarray Sum Equals K (#560)**, **Minimum Size Subarray Sum (#209)**.

3.  **Cyclic Sort & Index-Based Reasoning:** A more advanced pattern where you leverage the fact that values are in a specific range (e.g., `1 to n`). You sort by placing numbers at their correct index, which also helps find missing/duplicate numbers incredibly efficiently.
    - **Examples:** **Find All Numbers Disappeared in an Array (#448)**, **Find the Duplicate Number (#287)**.

4.  **Simulation & Matrix Traversal:** Yandex also asks a fair number of 2D array (matrix) problems that involve traversing in spirals, diagonals, or specific orders. These test your control flow and bug-free implementation skills.
    - **Examples:** **Spiral Matrix (#54)**, **Rotate Image (#48)**.

## How to Prepare

The key is to internalize the patterns, not just memorize solutions. Let's look at the **Two Pointers for in-place operations**, a pattern you _will_ see.

The mental model: You have two pointers (indices), often a "writer" (`w`) that tracks where the next valid element should go, and a "reader" (`r`) that scans the array. You process each element at `r` and decide if it should be written to position `w`.

<div class="code-group">

```python
# Pattern: Two Pointers for In-Place Operations (e.g., Remove Element #27)
# Time: O(n) | Space: O(1)
def removeElement(nums, val):
    """
    Removes all instances of `val` in-place, returning the new length.
    Elements beyond the new length are irrelevant.
    """
    writer = 0  # Tracks the position for the next valid element.

    for reader in range(len(nums)):  # Scans every element.
        if nums[reader] != val:
            nums[writer] = nums[reader]  # Place valid element at writer index.
            writer += 1  # Move writer forward.

    return writer  # New length of the array without `val`.

# This same pattern solves #26, #80, #283.
```

```javascript
// Pattern: Two Pointers for In-Place Operations (e.g., Remove Element #27)
// Time: O(n) | Space: O(1)
function removeElement(nums, val) {
  let writer = 0; // Tracks the position for the next valid element.

  for (let reader = 0; reader < nums.length; reader++) {
    if (nums[reader] !== val) {
      nums[writer] = nums[reader]; // Place valid element at writer index.
      writer++;
    }
  }

  return writer; // New length of the array without `val`.
}

// This same pattern solves #26, #80, #283.
```

```java
// Pattern: Two Pointers for In-Place Operations (e.g., Remove Element #27)
// Time: O(n) | Space: O(1)
public int removeElement(int[] nums, int val) {
    int writer = 0; // Tracks the position for the next valid element.

    for (int reader = 0; reader < nums.length; reader++) {
        if (nums[reader] != val) {
            nums[writer] = nums[reader]; // Place valid element at writer index.
            writer++;
        }
    }

    return writer; // New length of the array without `val`.
}

// This same pattern solves #26, #80, #283.
```

</div>

Another critical pattern is **Prefix Sum** for subarray problems. The insight is that the sum of a subarray `nums[i:j]` is `prefix[j] - prefix[i-1]`. This turns an O(n²) brute-force check into an O(n) or O(n log n) solution.

<div class="code-group">

```python
# Pattern: Prefix Sum (e.g., Subarray Sum Equals K #560)
# Time: O(n) | Space: O(n)
def subarraySum(nums, k):
    """
    Returns the total number of contiguous subarrays whose sum equals k.
    """
    count = 0
    current_sum = 0
    prefix_sum_count = {0: 1}  # A sum of 0 has occurred once (before start).

    for num in nums:
        current_sum += num
        # If (current_sum - k) exists in our map, we found subarrays ending here.
        count += prefix_sum_count.get(current_sum - k, 0)
        # Record the occurrence of this current prefix sum.
        prefix_sum_count[current_sum] = prefix_sum_count.get(current_sum, 0) + 1

    return count
```

```javascript
// Pattern: Prefix Sum (e.g., Subarray Sum Equals K #560)
// Time: O(n) | Space: O(n)
function subarraySum(nums, k) {
  let count = 0;
  let currentSum = 0;
  const prefixSumCount = new Map();
  prefixSumCount.set(0, 1); // A sum of 0 has occurred once (before start).

  for (const num of nums) {
    currentSum += num;
    // If (currentSum - k) exists in our map, we found subarrays ending here.
    count += prefixSumCount.get(currentSum - k) || 0;
    // Record the occurrence of this current prefix sum.
    prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0) + 1);
  }

  return count;
}
```

```java
// Pattern: Prefix Sum (e.g., Subarray Sum Equals K #560)
// Time: O(n) | Space: O(n)
public int subarraySum(int[] nums, int k) {
    int count = 0;
    int currentSum = 0;
    Map<Integer, Integer> prefixSumCount = new HashMap<>();
    prefixSumCount.put(0, 1); // A sum of 0 has occurred once (before start).

    for (int num : nums) {
        currentSum += num;
        // If (currentSum - k) exists in our map, we found subarrays ending here.
        count += prefixSumCount.getOrDefault(currentSum - k, 0);
        // Record the occurrence of this current prefix sum.
        prefixSumCount.put(currentSum, prefixSumCount.getOrDefault(currentSum, 0) + 1);
    }

    return count;
}
```

</div>

## How Yandex Tests Array vs Other Companies

- **vs. Google:** Google's array problems often have a clever "trick" or mathematical insight (e.g., **Product of Array Except Self (#238)**). Yandex's problems are more about flawless execution of a known algorithmic pattern under constraints (like O(1) space).
- **vs. Meta:** Meta leans heavily on hash maps (`Dict`, `HashMap`, `Object`) for array problems (e.g., **Two Sum (#1)** variants). While Yandex uses hashing, they place a stronger emphasis on pointer manipulation and in-place algorithms.
- **vs. Amazon:** Amazon often wraps array problems in a "real-world" scenario. Yandex's problems are typically presented in their raw, algorithmic form. The difficulty is similar, but Yandex's focus is purer on the algorithm itself.
- **The Yandex Difference:** The expectation for **clean, optimal, and well-explained code** is exceptionally high. They will ask for time/space complexity and expect you to justify every part of your solution. Bugs from off-by-one errors in pointer logic are a major red flag.

## Study Order

Tackle these sub-topics in this logical sequence to build a solid foundation:

1.  **Basic Iteration & Two Pointers:** Start with the absolute fundamentals of moving through an array with one and two indices. This builds muscle memory for index manipulation.
2.  **Sliding Window (Fixed & Dynamic):** Learn to manage a window of elements. This naturally extends two-pointer logic and is a precursor to more complex subarray problems.
3.  **Prefix Sum & Cumulative State:** Master the idea of deriving information from running totals. This is a powerful paradigm shift from thinking about individual elements to thinking about ranges.
4.  **In-Place Swaps & Partitioning:** Now combine pointers with swaps. This is critical for problems like **Sort Colors (#75)** and prepares you for sort algorithms.
5.  **Cyclic Sort:** This is an advanced application of in-place swapping, specific to arrays with values in a known range. It's a pattern that seems magical once understood.
6.  **Matrix Traversal:** Finally, apply your 1D skills to 2D arrays. The principles of managing indices and state remain the same, but the control flow becomes more complex.

## Recommended Practice Order

Solve these problems in sequence. Each one reinforces a pattern needed for the next.

1.  **Two Pointer Fundamentals:** **Remove Element (#27)** → **Remove Duplicates from Sorted Array (#26)** → **Move Zeroes (#283)**.
2.  **Sliding Window:** **Best Time to Buy and Sell Stock (#121)** (simple pass) → **Maximum Subarray (#53)** (Kadane's) → **Minimum Size Subarray Sum (#209)**.
3.  **Prefix Sum & Hashing:** **Subarray Sum Equals K (#560)** → **Contiguous Array (#525)**.
4.  **In-Place Partitioning:** **Sort Colors (#75)** (Dutch Flag) – practice this until you can write it flawlessly.
5.  **Cyclic Sort:** **Find All Numbers Disappeared in an Array (#448)** → **Find the Duplicate Number (#287)**.
6.  **Matrix Simulation:** **Spiral Matrix (#54)** → **Rotate Image (#48)**.

Mastering these patterns will make you exceptionally well-prepared for the array portion of a Yandex interview. Remember, their goal is to see if you can translate logical reasoning into perfect code. Practice doesn't just mean solving problems; it means solving them cleanly, explaining them clearly, and knowing the "why" behind every line.

[Practice Array at Yandex](/company/yandex/array)
