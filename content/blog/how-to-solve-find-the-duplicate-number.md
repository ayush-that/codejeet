---
title: "How to Solve Find the Duplicate Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Duplicate Number. Medium difficulty, 64.0% acceptance rate. Topics: Array, Two Pointers, Binary Search, Bit Manipulation."
date: "2026-04-23"
category: "dsa-patterns"
tags: ["find-the-duplicate-number", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Find the Duplicate Number

You're given an array of `n + 1` integers where each integer is between `1` and `n` inclusive. There's exactly one duplicate number in the array, and you need to find it. The challenge is that you can't modify the array and must use only constant extra space. This constraint makes the problem interesting — you can't just sort the array or use a hash set directly. Instead, you need to think about the problem mathematically and recognize the connection to cycle detection in linked lists.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, 4, 2, 2]`. Here `n = 4` (since we have `n + 1 = 5` elements), and all numbers are between 1 and 4.

Think of each index `i` (0 to 4) as a node, and the value `nums[i]` as a pointer to another node. This creates a linked list structure:

- Index 0 points to `nums[0] = 1` (node 1)
- Index 1 points to `nums[1] = 3` (node 3)
- Index 2 points to `nums[2] = 4` (node 4)
- Index 3 points to `nums[3] = 2` (node 2)
- Index 4 points to `nums[4] = 2` (node 2)

Now follow the pointers starting from index 0:
0 → 1 → 3 → 2 → 4 → 2 → 4 → 2 → ...

We have a cycle! The duplicate number `2` is where the cycle begins because two different indices (3 and 4) both point to node 2. This is exactly Floyd's Tortoise and Hare algorithm for cycle detection.

## Brute Force Approach

The most straightforward approach is to check every number against all other numbers:

1. For each number at position `i`, check if it exists at any other position `j` where `j ≠ i`
2. If found, return that number

This approach is simple but inefficient — it takes O(n²) time with O(1) space. For an array of size 10,000, that's 100 million comparisons, which is too slow.

Another naive approach would be to sort the array first, then scan for consecutive duplicates. However, this violates the "no modification" constraint since sorting changes the array. Even if we could modify it, the best sorting algorithms would give us O(n log n) time and O(1) space (if we ignore recursion stack).

## Optimized Approach

The key insight is that we can treat this as a linked list cycle detection problem. Here's why:

1. Since all numbers are between 1 and n, and we have n+1 elements, the array can be interpreted as a function `f(i) = nums[i]` that maps indices to values
2. This function creates a sequence: `i → nums[i] → nums[nums[i]] → ...`
3. Because there's a duplicate, two different indices will point to the same value, creating a cycle
4. The start of the cycle corresponds to the duplicate number

We use Floyd's Tortoise and Hare algorithm:

- Phase 1: Find the intersection point of the two runners
  - Slow pointer moves one step: `slow = nums[slow]`
  - Fast pointer moves two steps: `fast = nums[nums[fast]]`
  - When they meet, we've found a point inside the cycle
- Phase 2: Find the entrance to the cycle (the duplicate)
  - Reset one pointer to the start
  - Move both pointers one step at a time
  - Where they meet is the start of the cycle (the duplicate)

This works because the distance from the start to the cycle entrance equals the distance from the intersection point to the cycle entrance when moving around the cycle.

## Optimal Solution

Here's the complete implementation using Floyd's cycle detection algorithm:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findDuplicate(nums):
    """
    Find the duplicate number in an array using Floyd's Tortoise and Hare algorithm.

    The key insight is to treat the array as a linked list where nums[i] points to
    the next node. The duplicate creates a cycle, and we need to find where the cycle begins.
    """
    # Phase 1: Find the intersection point of the two runners
    slow = nums[0]  # Start from the first element
    fast = nums[0]  # Start from the first element

    # Move slow by 1 step, fast by 2 steps until they meet
    # This ensures we'll eventually meet inside the cycle
    while True:
        slow = nums[slow]          # Move slow pointer one step
        fast = nums[nums[fast]]    # Move fast pointer two steps
        if slow == fast:           # They've met inside the cycle
            break

    # Phase 2: Find the entrance to the cycle (the duplicate)
    # Reset slow to the beginning
    slow = nums[0]

    # Move both pointers one step at a time until they meet
    # The meeting point is the start of the cycle (duplicate)
    while slow != fast:
        slow = nums[slow]  # Move slow one step
        fast = nums[fast]  # Move fast one step

    # Both pointers now point to the duplicate number
    return slow
```

```javascript
// Time: O(n) | Space: O(1)
function findDuplicate(nums) {
  /**
   * Find the duplicate number in an array using Floyd's Tortoise and Hare algorithm.
   *
   * The array is treated as a linked list where nums[i] points to the next node.
   * The duplicate creates a cycle, and we need to find where the cycle begins.
   */

  // Phase 1: Find the intersection point of the two runners
  let slow = nums[0]; // Start from the first element
  let fast = nums[0]; // Start from the first element

  // Move slow by 1 step, fast by 2 steps until they meet
  // This ensures we'll eventually meet inside the cycle
  do {
    slow = nums[slow]; // Move slow pointer one step
    fast = nums[nums[fast]]; // Move fast pointer two steps
  } while (slow !== fast); // Continue until they meet inside the cycle

  // Phase 2: Find the entrance to the cycle (the duplicate)
  // Reset slow to the beginning
  slow = nums[0];

  // Move both pointers one step at a time until they meet
  // The meeting point is the start of the cycle (duplicate)
  while (slow !== fast) {
    slow = nums[slow]; // Move slow one step
    fast = nums[fast]; // Move fast one step
  }

  // Both pointers now point to the duplicate number
  return slow;
}
```

```java
// Time: O(n) | Space: O(1)
public int findDuplicate(int[] nums) {
    /**
     * Find the duplicate number in an array using Floyd's Tortoise and Hare algorithm.
     *
     * The array is treated as a linked list where nums[i] points to the next node.
     * The duplicate creates a cycle, and we need to find where the cycle begins.
     */

    // Phase 1: Find the intersection point of the two runners
    int slow = nums[0];  // Start from the first element
    int fast = nums[0];  // Start from the first element

    // Move slow by 1 step, fast by 2 steps until they meet
    // This ensures we'll eventually meet inside the cycle
    do {
        slow = nums[slow];          // Move slow pointer one step
        fast = nums[nums[fast]];    // Move fast pointer two steps
    } while (slow != fast);         // Continue until they meet inside the cycle

    // Phase 2: Find the entrance to the cycle (the duplicate)
    // Reset slow to the beginning
    slow = nums[0];

    // Move both pointers one step at a time until they meet
    // The meeting point is the start of the cycle (duplicate)
    while (slow != fast) {
        slow = nums[slow];  // Move slow one step
        fast = nums[fast];  // Move fast one step
    }

    // Both pointers now point to the duplicate number
    return slow;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- In Phase 1, the slow and fast pointers will meet within O(n) steps. Even in the worst case, the cycle length is at most n, and the fast pointer catches up to the slow pointer in linear time.
- In Phase 2, finding the cycle entrance takes at most O(n) steps.
- Overall, we perform at most 2n operations, which is O(n).

**Space Complexity:** O(1)

- We only use two integer variables (`slow` and `fast`) regardless of input size.
- No additional data structures are created, satisfying the constant space requirement.

## Common Mistakes

1. **Forgetting that indices start at 0 but values start at 1**: The array indices are 0 to n, but the values are 1 to n. When treating the array as a linked list, `nums[i]` gives a valid index since values are within bounds. Some candidates get confused by the off-by-one relationship.

2. **Incorrect cycle detection implementation**: A common error is to initialize both pointers to 0 instead of `nums[0]`. Remember: we're following values, not indices. The sequence starts at `nums[0]`, not index 0.

3. **Modifying the array**: Some candidates try to use the array itself for marking visited elements (like making values negative). This violates the "no modification" constraint. Always check problem constraints before implementing.

4. **Assuming multiple duplicates**: The problem states there's exactly one duplicate number, but it could appear more than twice. Our solution handles this correctly because any duplicate creates a cycle, regardless of how many times it appears.

## When You'll See This Pattern

The cycle detection pattern appears in problems where:

1. You have a sequence defined by a function `f(x)`
2. The domain and range are bounded
3. You need to find a repetition or cycle

Related problems:

- **Linked List Cycle II (Medium)**: Direct application of Floyd's algorithm to find where a cycle begins in a linked list.
- **Happy Number (Easy)**: Uses cycle detection to determine if a number eventually reaches 1 or enters a cycle.
- **Find All Duplicates in an Array (Medium)**: Similar constraints but allows modification and finds all duplicates.

## Key Takeaways

1. **When you see "find a duplicate with O(1) space and no modification," think cycle detection**: The constraint forces you away from hash sets and sorting, pointing toward mathematical or pointer-based solutions.

2. **Floyd's algorithm has two phases**: First find a meeting point inside the cycle, then find the cycle's entrance. Memorize this two-step process.

3. **The array-as-linked-list transformation is powerful**: By interpreting array indices as nodes and values as pointers, you can apply graph/cycle algorithms to array problems.

Related problems: [First Missing Positive](/problem/first-missing-positive), [Single Number](/problem/single-number), [Linked List Cycle II](/problem/linked-list-cycle-ii)
