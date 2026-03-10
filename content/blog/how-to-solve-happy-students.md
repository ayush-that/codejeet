---
title: "How to Solve Happy Students — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Happy Students. Medium difficulty, 50.9% acceptance rate. Topics: Array, Sorting, Enumeration."
date: "2029-08-03"
category: "dsa-patterns"
tags: ["happy-students", "array", "sorting", "enumeration", "medium"]
---

# How to Solve Happy Students

This problem asks us to count how many selection sizes `k` (from 1 to n) make all selected students happy, given that the i-th student is happy if either: 1) they're selected and have a score `nums[i]` strictly less than `k`, or 2) they're not selected and have a score strictly greater than `k`. The tricky part is that we need to find all `k` values where this condition holds for **all** students simultaneously, not just individual students.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 2, 3, 4]` with `n = 4`.

We need to check each possible selection size `k` from 1 to 4:

**k = 1** (select 1 student):

- Student 0 (score 1): Selected? Maybe. If selected: 1 < 1? No → unhappy if selected. If not selected: 1 > 1? No → unhappy if not selected. This student can't be happy with k=1.
- Since at least one student is unhappy, k=1 is invalid.

**k = 2** (select 2 students):

- Student 0 (score 1): If selected: 1 < 2? Yes → happy if selected.
- Student 1 (score 2): If selected: 2 < 2? No → unhappy if selected. If not selected: 2 > 2? No → unhappy if not selected. This student can't be happy.
- k=2 is invalid.

**k = 3** (select 3 students):

- Student 0 (score 1): If selected: 1 < 3? Yes → happy.
- Student 1 (score 2): If selected: 2 < 3? Yes → happy.
- Student 2 (score 3): If selected: 3 < 3? No → unhappy if selected. If not selected: 3 > 3? No → unhappy if not selected. Can't be happy.
- k=3 is invalid.

**k = 4** (select all 4 students):

- All students are selected. Check each: 1 < 4? Yes, 2 < 4? Yes, 3 < 4? Yes, 4 < 4? No → student 3 is unhappy.
- k=4 is invalid.

Wait, that gives us 0 valid k values, but let's think more carefully. The key insight is that for a given k, we can sort the students by score and select the k students with the lowest scores. Then:

- Selected students (first k in sorted order) are happy if their score < k
- Non-selected students (remaining n-k) are happy if their score > k

Let's sort: `[1, 2, 3, 4]` and re-evaluate:

**k = 1**: Select student with score 1. Selected: 1 < 1? No → unhappy. Invalid.

**k = 2**: Select students with scores 1 and 2.

- Selected students: 1 < 2? Yes (happy), 2 < 2? No (unhappy). Invalid.

**k = 3**: Select students with scores 1, 2, 3.

- Selected: 1<3✓, 2<3✓, 3<3✗ → student with score 3 unhappy. Invalid.

**k = 4**: Select all.

- Selected: 1<4✓, 2<4✓, 3<4✓, 4<4✗ → student with score 4 unhappy. Invalid.

Still 0. Let's try `nums = [1, 1, 1, 1]`:

Sorted: `[1, 1, 1, 1]`

**k = 1**: Select one student with score 1. Selected: 1 < 1? No → unhappy. Invalid.

**k = 2**: Select two students with score 1. Selected: 1 < 2? Yes (both happy). Non-selected: 1 > 2? No (both unhappy). Invalid.

**k = 3**: Select three students. Selected: 1 < 3? Yes. Non-selected: 1 > 3? No. Invalid.

**k = 4**: Select all. Selected: 1 < 4? Yes. No non-selected students. Valid! So k=4 works.

The pattern emerges: For k to be valid, we need:

1. The k-th smallest score (at index k-1 in 0-indexed sorted array) must be < k (so selected students are happy)
2. The (k+1)-th smallest score (at index k in 0-indexed) must be > k (so non-selected students are happy)

## Brute Force Approach

A brute force approach would try every possible selection of k students (for k from 1 to n) and check if all students are happy. For each k:

1. Generate all combinations of k students (n choose k combinations)
2. For each combination, check if all selected students have score < k and all non-selected have score > k

This is extremely inefficient: generating all combinations is O(2^n) and checking each combination adds more work. Even if we're clever and just check the "best" selection (choosing the k students with smallest scores), we'd still need to:

- Sort the array: O(n log n)
- For each k from 1 to n: O(n)
  - Check if nums[k-1] < k and (k == n or nums[k] > k): O(1)

This gives us O(n log n + n) = O(n log n), which is actually optimal! So there's no true "brute force" that's significantly worse than the optimal solution. The naive mistake would be to not realize we should select the k lowest-scoring students.

## Optimized Approach

The key insight is that for a given k, the optimal selection is always the k students with the lowest scores. Why? Because:

- Selected students need score < k → we want as many low scores as possible selected
- Non-selected students need score > k → we want high scores not selected

By selecting the k lowest scores, we maximize the chance that selected students have scores < k, and non-selected (the remaining higher scores) have scores > k.

After sorting, for k to be valid:

1. The largest score among selected students (the k-th smallest overall, at index k-1) must be < k
2. The smallest score among non-selected students (the (k+1)-th smallest overall, at index k, if it exists) must be > k

We also need to handle edge cases:

- k = 0: Not allowed by problem (we select at least 1 student)
- k = n: All students selected, so no non-selected students to check

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for sorted array (or O(1) if we sort in-place)
def countWays(nums):
    """
    Counts the number of selection sizes k that make all students happy.

    Args:
        nums: List of student scores

    Returns:
        Number of valid k values
    """
    n = len(nums)
    # Sort the scores to easily find the k smallest scores
    nums.sort()

    count = 0

    # Check each possible selection size k from 1 to n
    for k in range(1, n + 1):
        # Condition 1: The k-th smallest score (at index k-1) must be < k
        # This ensures all selected students (first k in sorted order) have score < k
        if nums[k - 1] < k:
            # Condition 2: If there are non-selected students (k < n),
            # the (k+1)-th smallest score (at index k) must be > k
            # This ensures all non-selected students have score > k
            if k == n or nums[k] > k:
                count += 1

    # Special case: k = 0? Problem says we select a group, so k >= 1
    # But let's check if k = n+1 could work? No, we can't select more than n students

    return count
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for sorted array (or O(1) if we sort in-place)
function countWays(nums) {
  /**
   * Counts the number of selection sizes k that make all students happy.
   *
   * @param {number[]} nums - Array of student scores
   * @return {number} Number of valid k values
   */
  const n = nums.length;
  // Sort the scores to easily find the k smallest scores
  nums.sort((a, b) => a - b); // Important: numeric sort, not lexicographic

  let count = 0;

  // Check each possible selection size k from 1 to n
  for (let k = 1; k <= n; k++) {
    // Condition 1: The k-th smallest score (at index k-1) must be < k
    // This ensures all selected students (first k in sorted order) have score < k
    if (nums[k - 1] < k) {
      // Condition 2: If there are non-selected students (k < n),
      // the (k+1)-th smallest score (at index k) must be > k
      // This ensures all non-selected students have score > k
      if (k === n || nums[k] > k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for sorted array (or O(1) if we sort in-place)
import java.util.Arrays;

class Solution {
    public int countWays(int[] nums) {
        /**
         * Counts the number of selection sizes k that make all students happy.
         *
         * @param nums Array of student scores
         * @return Number of valid k values
         */
        int n = nums.length;
        // Sort the scores to easily find the k smallest scores
        Arrays.sort(nums);

        int count = 0;

        // Check each possible selection size k from 1 to n
        for (int k = 1; k <= n; k++) {
            // Condition 1: The k-th smallest score (at index k-1) must be < k
            // This ensures all selected students (first k in sorted order) have score < k
            if (nums[k - 1] < k) {
                // Condition 2: If there are non-selected students (k < n),
                // the (k+1)-th smallest score (at index k) must be > k
                // This ensures all non-selected students have score > k
                if (k == n || nums[k] > k) {
                    count++;
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the array takes O(n log n) time
- The loop through k values from 1 to n takes O(n) time
- Total: O(n log n + n) = O(n log n)

**Space Complexity:** O(n) or O(1)

- If we sort in-place: O(1) additional space (but some languages may use O(n) for sorting)
- If we create a sorted copy: O(n) additional space
- The rest of the algorithm uses O(1) space for counters

## Common Mistakes

1. **Not sorting the array**: Some candidates try to work with the unsorted array, not realizing that the optimal selection is always the k lowest scores. This leads to incorrect logic.

2. **Off-by-one errors with indices**: The k-th smallest score is at index k-1 (0-indexed). Common mistakes include using nums[k] instead of nums[k-1] for the first condition, or nums[k+1] instead of nums[k] for the second condition.

3. **Forgetting the k = n edge case**: When k = n, all students are selected, so there are no non-selected students to check. The condition should be `k == n or nums[k] > k`, not just `nums[k] > k`.

4. **Incorrect comparison operators**: Using ≤ or ≥ instead of strict inequalities. The problem says "strictly less than" and "strictly greater than", so we need `<` and `>`, not `≤` or `≥`.

5. **In JavaScript: Forgetting numeric sort**: Using `nums.sort()` without a comparator does lexicographic (string) sorting, which fails for numbers like [10, 2, 1]. Always use `nums.sort((a, b) => a - b)`.

## When You'll See This Pattern

This problem uses a **sorting + greedy selection** pattern combined with **enumeration of possibilities**:

1. **Maximum Number of Coins You Can Get** (LeetCode 1561): Sort and select every second largest element.
2. **Assign Cookies** (LeetCode 455): Sort both arrays and use greedy matching.
3. **Minimum Difference Between Highest and Lowest of K Scores** (LeetCode 1984): Sort and use sliding window over sorted array.

The common theme is that sorting transforms the problem into one where a greedy approach becomes obvious. When you need to select k elements optimally according to some criteria, often sorting first reveals the optimal selection strategy.

## Key Takeaways

1. **When selection depends on relative order, sort first**: If the problem involves selecting k elements based on their values relative to k or to each other, sorting often reveals the optimal selection strategy.

2. **For "all must satisfy" conditions, check extremes**: When all selected/non-selected elements must satisfy a condition, you only need to check the worst-case (maximum of selected, minimum of non-selected) rather than checking every element.

3. **Enumeration + validation can be efficient**: Sometimes trying all possibilities (like all k from 1 to n) is acceptable if validation for each is O(1) after preprocessing (like sorting).

[Practice this problem on CodeJeet](/problem/happy-students)
