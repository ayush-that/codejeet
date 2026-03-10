---
title: "Two Pointers Questions at Myntra: What to Expect"
description: "Prepare for Two Pointers interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-05-03"
category: "dsa-patterns"
tags: ["myntra", "two-pointers", "interview prep"]
---

# Two Pointers Questions at Myntra: What to Expect

Myntra’s technical interview process is known for its practical, product‑oriented problems. With 4 out of their 24 most‑asked questions being Two Pointers problems, this pattern isn’t just a random occurrence—it’s a deliberate focus. Why? Because Myntra deals heavily with sorted lists, interval‑based operations (think scheduling flash sales or managing inventory windows), and efficient array manipulations that mirror real‑time catalog filtering, recommendation deduplication, or merging user activity logs. If you’re interviewing at Myntra, you can bet you’ll see at least one Two Pointers question, often in the first or second coding round. It’s not a “nice‑to‑have” pattern; it’s a core tool they expect you to wield fluently.

## Specific Patterns Myntra Favors

Myntra’s Two Pointers questions tend to cluster around three practical themes:

1. **Sorted Array Pair‑Finding** – Think “find pairs that sum to a target” or “remove duplicates.” This directly models tasks like matching complementary fashion items or cleaning sorted user logs.  
   _Example:_ **Two Sum II – Input Array Is Sorted (LeetCode #167)** is a classic.

2. **Interval Merging/Overlap** – Myntra runs multiple sales, promotions, and delivery slots concurrently. Merging overlapping intervals is a frequent backend task.  
   _Example:_ **Merge Intervals (LeetCode #56)** appears in a Two Pointers guise (after sorting).

3. **In‑place Array Modification** – Removing duplicates, moving zeros, or partitioning arrays in‑place reflects memory‑efficient processing of large product lists.  
   _Example:_ **Remove Duplicates from Sorted Array (LeetCode #26)**.

Notice what’s missing: complex linked‑list cycles or convoluted string manipulations. Myntra prefers clean, array‑based problems that map to e‑commerce operations.

## How to Prepare

Master the two most common Two Pointers templates: **opposite‑ends pointers** and **fast‑slow pointers**. Let’s look at the opposite‑ends pattern, which solves “pair‑finding” problems.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def two_sum_sorted(numbers, target):
    """LeetCode #167: Two Sum II - Input array is sorted."""
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]  # 1‑based indices
        elif current_sum < target:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum
    return []  # No solution (problem guarantees one exists)
```

```javascript
// Time: O(n) | Space: O(1)
function twoSumSorted(numbers, target) {
  let left = 0,
    right = numbers.length - 1;
  while (left < right) {
    const currentSum = numbers[left] + numbers[right];
    if (currentSum === target) {
      return [left + 1, right + 1]; // 1‑based indices
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return []; // No solution
}
```

```java
// Time: O(n) | Space: O(1)
public int[] twoSumSorted(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int currentSum = numbers[left] + numbers[right];
        if (currentSum == target) {
            return new int[]{left + 1, right + 1}; // 1‑based indices
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{}; // No solution
}
```

</div>

The second essential pattern is **fast‑slow pointers** for in‑place array edits. Here’s how you’d remove duplicates from a sorted array—a problem that mirrors deduplicating sorted product IDs.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def remove_duplicates(nums):
    """LeetCode #26: Remove Duplicates from Sorted Array."""
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1  # Length of unique segment
```

```javascript
// Time: O(n) | Space: O(1)
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1; // Length of unique segment
}
```

```java
// Time: O(n) | Space: O(1)
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1; // Length of unique segment
}
```

</div>

## How Myntra Tests Two Pointers vs Other Companies

At FAANG companies, Two Pointers questions often involve tricky linked‑list cycles or obscure string permutations. Myntra keeps it grounded. Their problems are usually:

- **Medium difficulty**, rarely “hard.”
- **Explicitly sorted input**—they want you to leverage that ordering.
- **Single‑pass emphasis**—they’ll ask for O(n) time and O(1) space, testing your ability to optimize for large catalogs.
- **Concrete scenarios**—you might be asked to merge user session intervals or find complementary product pairs.

Unlike some fintech firms that add mathematical twists, Myntra’s variations are practical. For example, instead of “find two numbers that sum to target,” you might get “find two products whose price sum equals a gift‑card value.” The pattern is identical, but the framing is domain‑relevant.

## Study Order

1. **Basic Opposite‑Ends Pointers** – Start with Two Sum II (#167) and Valid Palindrome (#125). This builds intuition for moving pointers based on comparisons.
2. **In‑place Modification** – Move to Remove Duplicates (#26) and Move Zeroes (#283). These teach you to overwrite array slots efficiently.
3. **Interval Merging** – Tackle Merge Intervals (#56) after sorting; the merging step is a Two Pointers sweep.
4. **Container‑type Problems** – Try Container With Most Water (#11) and Trapping Rain Water (#42). These introduce the “move the smaller pointer” heuristic.
5. **Linked‑List Variations** – Although less common at Myntra, practice Linked List Cycle (#141) and Palindrome Linked List (#234) for completeness.

This order works because it progresses from simple value comparisons to more complex “area” or “volume” calculations, all while reinforcing the core idea of using two indices to traverse a data structure in one pass.

## Recommended Practice Order

Solve these problems in sequence—each builds on the previous:

1. **Two Sum II – Input Array Is Sorted (LeetCode #167)** – The foundational opposite‑ends problem.
2. **Remove Duplicates from Sorted Array (LeetCode #26)** – Master the fast‑slow pointer template.
3. **Merge Intervals (LeetCode #56)** – Sort first, then merge with a two‑pointers‑like sweep.
4. **Container With Most Water (LeetCode #11)** – Introduces the “move the smaller height” decision rule.
5. **Trapping Rain Water (LeetCode #42)** – A harder opposite‑ends problem that tests your understanding of local minima.
6. **3Sum (LeetCode #15)** – A Myntra favorite—it’s essentially Two Sum II extended to three items, requiring sorting and careful duplicate skipping.

If you can solve these six problems confidently, you’ll handle any Two Pointers question Myntra throws at you. Remember: at Myntra, it’s not about knowing the trickiest variation—it’s about writing clean, efficient code that solves a real e‑commerce problem.

[Practice Two Pointers at Myntra](/company/myntra/two-pointers)
