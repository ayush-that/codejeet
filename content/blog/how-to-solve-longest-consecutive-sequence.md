---
title: "How to Solve Longest Consecutive Sequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Consecutive Sequence. Medium difficulty, 47.0% acceptance rate. Topics: Array, Hash Table, Union-Find."
date: "2026-03-26"
category: "dsa-patterns"
tags: ["longest-consecutive-sequence", "array", "hash-table", "union-find", "medium"]
---

# How to Solve Longest Consecutive Sequence

You're given an unsorted array of integers and need to find the length of the longest sequence of consecutive numbers. The tricky part is that the numbers don't need to be adjacent in the array—they just need to be consecutive values. For example, in `[100, 4, 200, 1, 3, 2]`, the longest consecutive sequence is `[1, 2, 3, 4]` with length 4. The challenge is solving this in O(n) time, which means we can't sort the array (that would be O(n log n)).

## Visual Walkthrough

Let's trace through the example `[100, 4, 200, 1, 3, 2]` to build intuition:

1. We want to find sequences like 1→2→3→4 (consecutive numbers)
2. The brute force approach would check every number and see how far we can count up: for 100, check if 101 exists, 102 exists... This is inefficient
3. The key insight: a sequence starts when there's no number one less than the current number
4. Let's identify sequence starters:
   - 100: Is 99 in the array? No → 100 could start a sequence
   - 4: Is 3 in the array? Yes → 4 is not a sequence starter
   - 200: Is 199 in the array? No → 200 could start a sequence
   - 1: Is 0 in the array? No → 1 could start a sequence
   - 3: Is 2 in the array? Yes → 3 is not a sequence starter
   - 2: Is 1 in the array? Yes → 2 is not a sequence starter

5. Now we only need to explore from sequence starters:
   - Starting at 100: Check 101 (not in array) → sequence length = 1
   - Starting at 200: Check 201 (not in array) → sequence length = 1
   - Starting at 1: Check 2 (exists), check 3 (exists), check 4 (exists), check 5 (not in array) → sequence length = 4

The longest sequence has length 4.

## Brute Force Approach

A naive approach would be to check for every number how long a consecutive sequence we can build from it:

1. For each number `num` in the array
2. Initialize `current_num = num` and `current_streak = 1`
3. While `current_num + 1` exists in the array:
   - Increment `current_num`
   - Increment `current_streak`
4. Update the maximum streak found

The problem is checking if a number exists in the array. If we do this with a linear scan, checking existence takes O(n) time, and we do this for each number in the worst case, giving us O(n³) time complexity (O(n) numbers × O(n) checks per while loop × O(n) for existence check).

Even if we first convert the array to a set for O(1) lookups, we still have O(n²) time because for each of n numbers, we might traverse up to n consecutive numbers in the worst case (like `[1, 2, 3, 4, 5]`).

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def longestConsecutive_brute(nums):
    if not nums:
        return 0

    nums_set = set(nums)
    max_length = 0

    for num in nums:
        current_num = num
        current_streak = 1

        # Keep checking for the next consecutive number
        while current_num + 1 in nums_set:
            current_num += 1
            current_streak += 1

        max_length = max(max_length, current_streak)

    return max_length
```

```javascript
// Time: O(n²) | Space: O(n)
function longestConsecutiveBrute(nums) {
  if (nums.length === 0) return 0;

  const numsSet = new Set(nums);
  let maxLength = 0;

  for (const num of nums) {
    let currentNum = num;
    let currentStreak = 1;

    // Keep checking for the next consecutive number
    while (numsSet.has(currentNum + 1)) {
      currentNum++;
      currentStreak++;
    }

    maxLength = Math.max(maxLength, currentStreak);
  }

  return maxLength;
}
```

```java
// Time: O(n²) | Space: O(n)
public int longestConsecutiveBrute(int[] nums) {
    if (nums.length == 0) return 0;

    Set<Integer> numsSet = new HashSet<>();
    for (int num : nums) {
        numsSet.add(num);
    }

    int maxLength = 0;

    for (int num : nums) {
        int currentNum = num;
        int currentStreak = 1;

        // Keep checking for the next consecutive number
        while (numsSet.contains(currentNum + 1)) {
            currentNum++;
            currentStreak++;
        }

        maxLength = Math.max(maxLength, currentStreak);
    }

    return maxLength;
}
```

</div>

## Optimized Approach

The brute force is inefficient because it does redundant work. In the example `[1, 2, 3, 4]`, it checks sequences starting at 1, 2, 3, and 4, but once we find the sequence starting at 1, we've already covered all the others.

The key optimization: **Only start counting from numbers that are the beginning of a sequence**. A number is the start of a sequence if `num - 1` is NOT in the set.

Here's the optimized algorithm:

1. Convert the array to a set for O(1) lookups
2. For each number in the set:
   - If `num - 1` is in the set, skip it (it's not a sequence starter)
   - If `num - 1` is NOT in the set, this is a sequence starter:
     - Count how many consecutive numbers exist starting from `num`
     - Update the maximum length found

This ensures each sequence is only traversed once, giving us O(n) time complexity. Even though we have nested loops, each number is visited at most twice: once when we check if it's a sequence starter, and once when we traverse its sequence.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestConsecutive(nums):
    """
    Find the length of the longest consecutive sequence in an unsorted array.

    The key insight: a sequence starts when there's no number one less than it.
    By only counting from sequence starters, we ensure O(n) time complexity.
    """
    if not nums:
        return 0

    # Step 1: Convert to set for O(1) lookups
    num_set = set(nums)
    max_length = 0

    # Step 2: Iterate through each unique number
    for num in num_set:
        # Step 3: Check if this is the start of a sequence
        # A number starts a sequence if num-1 is NOT in the set
        if num - 1 not in num_set:
            current_num = num
            current_streak = 1

            # Step 4: Count how long this sequence goes
            # Keep checking for the next consecutive number
            while current_num + 1 in num_set:
                current_num += 1
                current_streak += 1

            # Step 5: Update the maximum length found
            max_length = max(max_length, current_streak)

    return max_length
```

```javascript
// Time: O(n) | Space: O(n)
function longestConsecutive(nums) {
  /**
   * Find the length of the longest consecutive sequence in an unsorted array.
   *
   * The key insight: a sequence starts when there's no number one less than it.
   * By only counting from sequence starters, we ensure O(n) time complexity.
   */
  if (nums.length === 0) return 0;

  // Step 1: Convert to set for O(1) lookups
  const numSet = new Set(nums);
  let maxLength = 0;

  // Step 2: Iterate through each unique number
  for (const num of numSet) {
    // Step 3: Check if this is the start of a sequence
    // A number starts a sequence if num-1 is NOT in the set
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;

      // Step 4: Count how long this sequence goes
      // Keep checking for the next consecutive number
      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
      }

      // Step 5: Update the maximum length found
      maxLength = Math.max(maxLength, currentStreak);
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(n)
public int longestConsecutive(int[] nums) {
    /**
     * Find the length of the longest consecutive sequence in an unsorted array.
     *
     * The key insight: a sequence starts when there's no number one less than it.
     * By only counting from sequence starters, we ensure O(n) time complexity.
     */
    if (nums.length == 0) return 0;

    // Step 1: Convert to set for O(1) lookups
    Set<Integer> numSet = new HashSet<>();
    for (int num : nums) {
        numSet.add(num);
    }

    int maxLength = 0;

    // Step 2: Iterate through each unique number
    for (int num : numSet) {
        // Step 3: Check if this is the start of a sequence
        // A number starts a sequence if num-1 is NOT in the set
        if (!numSet.contains(num - 1)) {
            int currentNum = num;
            int currentStreak = 1;

            // Step 4: Count how long this sequence goes
            // Keep checking for the next consecutive number
            while (numSet.contains(currentNum + 1)) {
                currentNum++;
                currentStreak++;
            }

            // Step 5: Update the maximum length found
            maxLength = Math.max(maxLength, currentStreak);
        }
    }

    return maxLength;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Converting the array to a set takes O(n)
- The outer loop iterates through each unique number (at most n iterations)
- The inner while loop only runs for sequence starters, and each number is visited at most twice: once when we check if it's a sequence starter, and once when we traverse its sequence
- Therefore, the total operations are proportional to n, giving us O(n) time

**Space Complexity: O(n)**

- We store all numbers in a hash set, which requires O(n) space
- The algorithm uses only a constant amount of additional space for variables

## Common Mistakes

1. **Sorting the array first**: Many candidates immediately think to sort the array, which gives O(n log n) time. The problem specifically asks for O(n) time, so sorting is not acceptable. Always check the time complexity requirements before choosing an approach.

2. **Not handling empty input**: Forgetting to check if the array is empty can lead to errors. Always include this edge case check at the beginning of your function.

3. **Using array instead of set for lookups**: Checking if a number exists in an array takes O(n) time with linear search. Even if you sort and use binary search, you still get O(n log n). The hash set is crucial for O(1) lookups.

4. **Counting from every number**: This is the most common mistake—not realizing you should only count from sequence starters. If you count from every number, you get O(n²) time in the worst case (like when the array is already a consecutive sequence).

5. **Off-by-one errors in sequence counting**: When counting a sequence, make sure you start counting from 1 (the current number itself) and increment correctly. Test with simple cases like `[1]` (should return 1) and `[1, 2]` (should return 2).

## When You'll See This Pattern

This "sequence detection using hash sets" pattern appears in several problems:

1. **Binary Tree Longest Consecutive Sequence** (LeetCode 298): Similar concept but in a binary tree context. Instead of checking a hash set, you traverse the tree and track consecutive sequences along paths.

2. **Longest Consecutive Sequence in 2D Grid** (variations): Finding consecutive sequences in matrices often uses similar logic with DFS/BFS instead of simple iteration.

3. **First Missing Positive** (LeetCode 41): While not exactly the same, it also uses the insight that we can use array indices or sets to track number existence efficiently.

4. **Find All Numbers Disappeared in an Array** (LeetCode 448): Uses similar set-based or index-marking techniques to track number presence.

The core pattern is: when you need to find sequences, groups, or relationships between elements, and sorting is too expensive, consider using a hash set to track element existence and look for "starters" or "boundaries" of groups.

## Key Takeaways

1. **Hash sets enable O(1) existence checks**: When you need to frequently check if elements exist in a collection, convert to a set first. This is a fundamental optimization technique.

2. **Look for sequence starters**: When finding consecutive sequences, only start counting from numbers that don't have their immediate predecessor in the set. This avoids redundant work and ensures O(n) time.

3. **Nested loops don't always mean O(n²)**: In this solution, we have a while loop inside a for loop, but the total operations are still O(n) because each element is processed at most twice. Always analyze the actual work being done, not just the loop structure.

4. **Test edge cases**: Empty array, single element, all duplicates, already sorted input, reverse sorted input, and large ranges. These tests will catch most implementation errors.

Related problems: [Binary Tree Longest Consecutive Sequence](/problem/binary-tree-longest-consecutive-sequence), [Find Three Consecutive Integers That Sum to a Given Number](/problem/find-three-consecutive-integers-that-sum-to-a-given-number), [Maximum Consecutive Floors Without Special Floors](/problem/maximum-consecutive-floors-without-special-floors)
