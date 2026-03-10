---
title: "Array Questions at TCS: What to Expect"
description: "Prepare for Array interview questions at TCS — patterns, difficulty breakdown, and study tips."
date: "2027-08-28"
category: "dsa-patterns"
tags: ["tcs", "array", "interview prep"]
---

With 116 Array questions out of 217 total on their tagged LeetCode list, TCS's focus on this data structure is not just significant—it's foundational. For candidates interviewing at TCS, this statistic is a clear directive: mastery of arrays is non-negotiable. But this prevalence raises a critical question: is this a core focus because arrays are inherently important, or because they serve as the perfect vehicle to test fundamental algorithmic thinking? The answer is both. In real TCS interviews, especially for entry and mid-level roles, you are highly likely to encounter at least one array-based problem. It's the company's preferred sandbox for evaluating your problem decomposition, your ability to manipulate data in-place, and your grasp of core algorithmic patterns like two-pointer techniques and prefix sums. Don't mistake quantity for simplicity, however. The range spans from straightforward traversals to complex problems that disguise dynamic programming or mathematical insights behind an array facade.

## Specific Patterns TCS Favors

TCS's array problems tend to cluster around a few key, practical patterns. They favor **iterative optimization** and **in-place manipulation** over heavily recursive or abstract graph-theoretic approaches. You'll rarely see a pure "graph traversal" problem presented with an array; instead, the array is the graph (e.g., Jump Game problems). Their emphasis is on clean, efficient logic.

1.  **Two-Pointer & Sliding Window:** This is arguably the most frequent pattern. It's used for problems involving sorted arrays, subarrays with constraints, or removing duplicates in-place. Look for problems where you need to find a pair, a subarray sum, or partition elements.
2.  **Prefix Sum & Cumulative Calculations:** TCS often includes problems where you need to answer range queries or calculate running metrics. This pattern transforms an O(n²) brute-force into an O(n) solution by pre-processing.
3.  **Cyclic Sort / In-Place Rearrangement:** A signature pattern for problems involving arrays containing numbers in a certain range (e.g., 1 to n). The goal is to sort or rearrange the array in O(n) time and O(1) space by leveraging indices.
4.  **Array as a Logical Model:** Problems like "Product of Array Except Self" or various "Rain Water" trapping problems. These require thinking about the array's properties (left-pass, right-pass) rather than a standard algorithm.

For example, **"Find All Duplicates in an Array" (LeetCode #442)** is a classic TCS-style problem that uses the array indices themselves for marking, exemplifying in-place manipulation. **"Maximum Subarray" (Kadane's Algorithm, LeetCode #53)** is a staple for testing understanding of dynamic programming on arrays.

## How to Prepare

Preparation should be pattern-centric, not problem-centric. For each pattern, understand the _why_ and the _when_ to apply it. Let's look at the **Cyclic Sort** pattern, which is highly efficient and appears frequently in variations.

The core insight: If you have an array of size `n` containing elements in the range `[1, n]`, the correct position for the number `x` is the index `x-1`. You can iterate and swap each number to its correct position until it's either correct or you find a duplicate.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findDisappearedNumbers(nums):
    # Cyclic Sort Phase
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1  # Desired index for nums[i]
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]  # Swap
        else:
            i += 1

    # Find missing numbers (indices where value doesn't match)
    result = []
    for idx, num in enumerate(nums):
        if num != idx + 1:
            result.append(idx + 1)
    return result
```

```javascript
// Time: O(n) | Space: O(1)
function findDisappearedNumbers(nums) {
  // Cyclic Sort Phase
  let i = 0;
  while (i < nums.length) {
    const correctIdx = nums[i] - 1;
    if (nums[i] !== nums[correctIdx]) {
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]]; // Swap
    } else {
      i++;
    }
  }

  // Find missing numbers
  const result = [];
  for (let idx = 0; idx < nums.length; idx++) {
    if (nums[idx] !== idx + 1) {
      result.push(idx + 1);
    }
  }
  return result;
}
```

```java
// Time: O(n) | Space: O(1) - output list typically not counted in space complexity for this problem.
import java.util.ArrayList;
import java.util.List;

public List<Integer> findDisappearedNumbers(int[] nums) {
    // Cyclic Sort Phase
    int i = 0;
    while (i < nums.length) {
        int correctIdx = nums[i] - 1;
        if (nums[i] != nums[correctIdx]) {
            int temp = nums[i];
            nums[i] = nums[correctIdx];
            nums[correctIdx] = temp;
        } else {
            i++;
        }
    }

    // Find missing numbers
    List<Integer> result = new ArrayList<>();
    for (int idx = 0; idx < nums.length; idx++) {
        if (nums[idx] != idx + 1) {
            result.add(idx + 1);
        }
    }
    return result;
}
```

</div>

Another critical pattern is **Prefix Sum**, essential for optimizing subarray queries.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - reusing input list for prefix sum.
def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n

    # Left pass: result[i] contains product of all elements to the left of i
    left_running = 1
    for i in range(n):
        result[i] = left_running
        left_running *= nums[i]

    # Right pass: multiply result[i] by product of all elements to the right of i
    right_running = 1
    for i in range(n-1, -1, -1):
        result[i] *= right_running
        right_running *= nums[i]

    return result
```

```javascript
// Time: O(n) | Space: O(1) - output array is typically not counted.
function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // Left pass
  let leftRunning = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftRunning;
    leftRunning *= nums[i];
  }

  // Right pass
  let rightRunning = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightRunning;
    rightRunning *= nums[i];
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];

    // Left pass
    int leftRunning = 1;
    for (int i = 0; i < n; i++) {
        result[i] = leftRunning;
        leftRunning *= nums[i];
    }

    // Right pass
    int rightRunning = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= rightRunning;
        rightRunning *= nums[i];
    }

    return result;
}
```

</div>

## How TCS Tests Array vs Other Companies

Compared to FAANG companies, TCS's array problems often have a different flavor. At companies like Google or Meta, an array problem might be a thin wrapper for a complex graph search (e.g., "Number of Islands" on a 2D array) or might require a non-intuitive combinatorial insight. TCS problems are more likely to be **direct applications of a standard pattern**. The difficulty often lies not in discovering a novel algorithm, but in executing a known pattern flawlessly, handling edge cases, and achieving optimal space complexity.

What's unique is the emphasis on **mathematical reasoning** intertwined with arrays. Problems involving digit manipulations, sequences, or specific numerical properties (like in "Missing Number" or "Find the Duplicate Number") are common. The expectation is a solution that is mathematically sound and efficiently coded, not just brute force.

## Study Order

Tackle the patterns in this logical progression to build a compounding understanding:

1.  **Basic Traversal & Pointers:** Start with the absolute fundamentals. How do you reverse an array in-place? How do you use a single loop with indices? This builds comfort with array indexing.
2.  **Two-Pointer Technique:** Master this on sorted arrays first (pair sum, removing duplicates), then move to the sliding window variant for subarray problems. This is a workhorse pattern.
3.  **Prefix Sum & Suffix Calculations:** Learn to think in terms of cumulative values. This pattern is a powerful tool for optimizing repeated calculations and is a prerequisite for more advanced dynamic programming.
4.  **Cyclic Sort & In-Place Marking:** This pattern teaches you to use the array structure itself as a hash map or state tracker, which is critical for O(1) space solutions.
5.  **Array as a Logical Model (Multi-pass):** Practice problems that require separate left-to-right and right-to-left passes. This develops the skill of breaking a problem into complementary scans.
6.  **Kadane's Algorithm & Basic DP on Arrays:** Introduce the concept of local/global optima tracking. This is your first step into dynamic programming thinking using arrays.

## Recommended Practice Order

Solve these problems in sequence. Each introduces a slight twist on the pattern learned from the previous one.

1.  **Two-Pointer Fundamentals:** Move Zeroes (LeetCode #283) -> Remove Duplicates from Sorted Array (LeetCode #26) -> Two Sum II (LeetCode #167).
2.  **Sliding Window:** Best Time to Buy and Sell Stock (LeetCode #121) -> Maximum Subarray (LeetCode #53) -> Longest Substring Without Repeating Characters (LeetCode #3 - uses a hash map with window).
3.  **Prefix Sum:** Range Sum Query - Immutable (LeetCode #303) -> Product of Array Except Self (LeetCode #238) -> Subarray Sum Equals K (LeetCode #560 - combines prefix sum with a hash map).
4.  **Cyclic Sort / In-Place:** Find All Numbers Disappeared in an Array (LeetCode #448) -> Find the Duplicate Number (LeetCode #287) -> First Missing Positive (LeetCode #41).
5.  **Multi-pass Logic:** Trapping Rain Water (LeetCode #42) -> Candy (LeetCode #135).

This progression ensures you solidify each concept before combining it with others. Remember, at TCS, the goal is to demonstrate clear, efficient, and correct application of these core patterns under interview conditions.

[Practice Array at TCS](/company/tcs/array)
