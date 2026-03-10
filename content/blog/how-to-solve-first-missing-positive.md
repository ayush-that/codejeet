---
title: "How to Solve First Missing Positive — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode First Missing Positive. Hard difficulty, 42.5% acceptance rate. Topics: Array, Hash Table."
date: "2026-06-22"
category: "dsa-patterns"
tags: ["first-missing-positive", "array", "hash-table", "hard"]
---

# How to Solve First Missing Positive

The problem asks us to find the smallest positive integer that does not appear in an unsorted integer array. The challenge lies in achieving O(n) time complexity while using only O(1) extra space—meaning we cannot use hash tables or other auxiliary data structures that scale with input size. This constraint forces us to think creatively about how to use the input array itself as our workspace.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 4, -1, 1]`

We need to find the smallest positive integer not in the array. Positive integers start at 1. Let's think about where numbers _should_ go if we could organize them:

- If all positive integers from 1 to n were present, they would occupy indices 0 through n-1 (since array indices start at 0).
- Specifically, the number 1 should be at index 0, number 2 at index 1, and so on.

Our strategy will be to rearrange the array so that each positive integer `x` (where `1 ≤ x ≤ n`) ends up at position `x-1`. Let's walk through this:

**Initial:** `[3, 4, -1, 1]` (n = 4)

**Step 1:** Look at index 0, value = 3. Since 3 is between 1 and 4, it should go to index 2 (3-1). Swap with index 2:
`[-1, 4, 3, 1]`

**Step 2:** Index 0 now has -1. Negative numbers and numbers > n we ignore (they stay where they are).

**Step 3:** Move to index 1, value = 4. 4 is between 1 and 4, should go to index 3 (4-1). Swap with index 3:
`[-1, 1, 3, 4]`

**Step 4:** Index 1 now has 1. 1 should go to index 0 (1-1). Swap with index 0:
`[1, -1, 3, 4]`

**Step 5:** Continue scanning. At index 2: value = 3, already at correct position (3-1 = 2). Index 3: value = 4, already at correct position.

**Final arranged array:** `[1, -1, 3, 4]`

Now we scan through indices 0 to 3:

- Index 0: has 1 ✓
- Index 1: has -1 (should have 2) → Found missing number: 2

If all positions had correct numbers, the answer would be n+1 (5 in this case).

## Brute Force Approach

A naive approach would be to check for each positive integer starting from 1 whether it exists in the array:

1. Start with `answer = 1`
2. While `answer` is in the array, increment `answer`
3. Return `answer`

The "is in the array" check takes O(n) time, and we might need to check up to n+1 numbers, giving us O(n²) time complexity. We could improve this to O(n log n) by sorting first, but that violates the O(n) requirement. Alternatively, we could use a hash set to achieve O(n) time, but that requires O(n) extra space, violating the O(1) space constraint.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def firstMissingPositiveBrute(nums):
    answer = 1
    while True:
        found = False
        for num in nums:
            if num == answer:
                found = True
                break
        if not found:
            return answer
        answer += 1
```

```javascript
// Time: O(n²) | Space: O(1)
function firstMissingPositiveBrute(nums) {
  let answer = 1;
  while (true) {
    let found = false;
    for (let num of nums) {
      if (num === answer) {
        found = true;
        break;
      }
    }
    if (!found) return answer;
    answer++;
  }
}
```

```java
// Time: O(n²) | Space: O(1)
public int firstMissingPositiveBrute(int[] nums) {
    int answer = 1;
    while (true) {
        boolean found = false;
        for (int num : nums) {
            if (num == answer) {
                found = true;
                break;
            }
        }
        if (!found) return answer;
        answer++;
    }
}
```

</div>

## Optimized Approach

The key insight is that for an array of size n, the answer must be in the range [1, n+1]. Why? Consider the best case: if the array contains all numbers from 1 to n, the missing number is n+1. If any number from 1 to n is missing, that's our answer.

This observation allows us to use the array itself as a lookup table through a technique called **index marking** or **cyclic sort**:

1. We iterate through the array and try to place each number in its "correct" position: number `x` should be at index `x-1` (if `1 ≤ x ≤ n`).
2. We swap numbers to their correct positions, but only if:
   - The number is between 1 and n (inclusive)
   - The number is not already at its correct position
   - The target position doesn't already have the correct number (to avoid infinite loops)
3. After rearranging, we do a second pass: the first index `i` where `nums[i] != i+1` gives us the missing number `i+1`.
4. If all positions are correct, the answer is `n+1`.

This approach works because we're using the array indices themselves to track which numbers are present. Each swap places at least one number in its correct position, and we process each element at most twice (once when we encounter it, and possibly once when it gets swapped into our current position).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def firstMissingPositive(nums):
    n = len(nums)

    # First pass: place each number in its correct position if possible
    for i in range(n):
        # While the current number is between 1 and n, and not in its correct position
        # nums[i] should be at index nums[i]-1
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            # Swap nums[i] with the number at its target position
            # This moves nums[i] to where it belongs
            correct_idx = nums[i] - 1
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]

    # Second pass: find the first missing positive
    for i in range(n):
        if nums[i] != i + 1:
            # Position i should have i+1, but it doesn't
            return i + 1

    # If all positions 0..n-1 have correct numbers 1..n
    # then the missing number is n+1
    return n + 1
```

```javascript
// Time: O(n) | Space: O(1)
function firstMissingPositive(nums) {
  const n = nums.length;

  // First pass: rearrange numbers to their correct positions
  for (let i = 0; i < n; i++) {
    // Keep swapping while current number is valid and not in correct position
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      // Swap nums[i] to its correct position
      const correctIdx = nums[i] - 1;
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
    }
  }

  // Second pass: find first position where number doesn't match index+1
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      return i + 1;
    }
  }

  // All numbers 1..n are present
  return n + 1;
}
```

```java
// Time: O(n) | Space: O(1)
public int firstMissingPositive(int[] nums) {
    int n = nums.length;

    // Rearrange numbers: place each number at its correct index if possible
    for (int i = 0; i < n; i++) {
        // While current number is valid and not already in correct position
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            // Swap nums[i] with the element at its target position
            int correctIdx = nums[i] - 1;
            int temp = nums[i];
            nums[i] = nums[correctIdx];
            nums[correctIdx] = temp;
        }
    }

    // Find first index where number doesn't match expected value
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) {
            return i + 1;
        }
    }

    // All numbers 1..n are present
    return n + 1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
Even though we have nested loops (a `while` inside a `for`), each element is swapped at most once to its correct position. Once an element is in its correct position, we never move it again. Each swap operation places at least one element in its final position, so we perform at most n swaps total. The two passes each take O(n) time, giving us O(n) overall.

**Space Complexity: O(1)**  
We only use a constant amount of extra space for variables like `i`, `n`, and temporary swap variables. We modify the input array in place without allocating additional data structures that scale with input size.

## Common Mistakes

1. **Infinite loop in swapping**: Forgetting to check `nums[nums[i] - 1] != nums[i]` before swapping can cause infinite loops when the target position already contains the correct number. Always verify the number at the target position is different before swapping.

2. **Off-by-one errors with indices**: Remember that number `x` belongs at index `x-1`, not `x`. A common mistake is using `nums[i]` as an index directly instead of `nums[i] - 1`.

3. **Not handling numbers outside 1..n range**: The while loop condition must check `1 <= nums[i] <= n` (or equivalent). Numbers ≤ 0 or > n should be ignored since they can't be placed in valid indices and don't affect the answer (which is always between 1 and n+1).

4. **Assuming answer is always ≤ n**: The answer can be n+1 when the array contains all numbers from 1 to n. Always handle this case by returning `n+1` after the second pass if no missing number was found.

## When You'll See This Pattern

This "index marking" or "cyclic sort" pattern appears in problems where:

- You need to find missing/duplicate numbers in an array
- The array size gives you bounds on possible values
- O(1) space is required, forcing you to use the array itself as a data structure

**Related problems:**

1. **Missing Number (Easy)**: Find the missing number in range [0, n] from an array of n distinct numbers. Similar index marking approach works.
2. **Find All Duplicates in an Array (Medium)**: Find all elements that appear twice. Can be solved by marking visited indices as negative.
3. **Find the Duplicate Number (Medium)**: Similar constraints but uses Floyd's cycle detection instead of index marking due to the single duplicate constraint.

## Key Takeaways

1. **When asked for O(1) space with array elements in a known range**, consider using the array indices themselves to store information. The index becomes a implicit hash key.

2. **For problems involving missing numbers in [1, n]**, the answer is always in [1, n+1]. This bounded range is what makes the index marking technique possible.

3. **Cyclic sort is a powerful pattern** for placing elements in their correct positions with minimal swaps. It's especially useful when you need to find missing/duplicate numbers with O(n) time and O(1) space.

Related problems: [Missing Number](/problem/missing-number), [Find the Duplicate Number](/problem/find-the-duplicate-number), [Find All Numbers Disappeared in an Array](/problem/find-all-numbers-disappeared-in-an-array)
