---
title: "How to Solve All Divisions With the Highest Score of a Binary Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode All Divisions With the Highest Score of a Binary Array. Medium difficulty, 65.5% acceptance rate. Topics: Array."
date: "2029-01-15"
category: "dsa-patterns"
tags: ["all-divisions-with-the-highest-score-of-a-binary-array", "array", "medium"]
---

# How to Solve All Divisions With the Highest Score of a Binary Array

You're given a binary array `nums` and need to find all indices `i` where dividing the array at position `i` (with elements 0 to i-1 on the left and i to n-1 on the right) maximizes the score, which is defined as the number of zeros on the left plus the number of ones on the right. What makes this problem interesting is that we need to efficiently compute scores for all possible division points and find which ones give the maximum score.

## Visual Walkthrough

Let's trace through an example: `nums = [0,0,1,0]`

We can divide at any index from 0 to 4 (inclusive). For each division point `i`:

- `numsleft` = elements from index 0 to i-1
- `numsright` = elements from index i to n-1
- Score = count of 0s in `numsleft` + count of 1s in `numsright`

Let's calculate each score:

**i = 0**:

- Left: [] → 0 zeros = 0
- Right: [0,0,1,0] → 1 one = 1
- Score = 0 + 1 = 1

**i = 1**:

- Left: [0] → 1 zero = 1
- Right: [0,1,0] → 1 one = 1
- Score = 1 + 1 = 2

**i = 2**:

- Left: [0,0] → 2 zeros = 2
- Right: [1,0] → 1 one = 1
- Score = 2 + 1 = 3

**i = 3**:

- Left: [0,0,1] → 2 zeros = 2
- Right: [0] → 0 ones = 0
- Score = 2 + 0 = 2

**i = 4**:

- Left: [0,0,1,0] → 3 zeros = 3
- Right: [] → 0 ones = 0
- Score = 3 + 0 = 3

The maximum score is 3, achieved at indices i = 2 and i = 4. So the answer would be [2,4].

## Brute Force Approach

The most straightforward approach is to try every possible division point `i` from 0 to n, and for each one:

1. Count zeros in the left subarray (indices 0 to i-1)
2. Count ones in the right subarray (indices i to n-1)
3. Calculate the score and track the maximum

This approach would require O(n) time for each division point to count zeros and ones, leading to O(n²) total time complexity. For an array of length up to 10⁵ (common in LeetCode constraints), O(n²) is far too slow.

Even if we try to optimize by precomputing prefix sums, a naive implementation might still be inefficient if we don't think carefully about how to compute scores incrementally.

## Optimized Approach

The key insight is that we can compute all scores efficiently using prefix sums. Here's the step-by-step reasoning:

1. **Precompute total ones**: First, count the total number of 1s in the entire array. This tells us how many ones are in the right subarray when i=0.

2. **Iterate through division points**: For each i from 0 to n:
   - Left zeros = number of zeros in nums[0..i-1]
   - Right ones = number of ones in nums[i..n-1]
3. **Efficient computation**: Instead of counting from scratch each time:
   - Track `leftZeros` as we go: increment when we see a 0 at the current index before moving to the next division point
   - Track `rightOnes` as we go: start with total ones, decrement when we pass a 1 (since it moves from right to left)

4. **Find maximum scores**: As we compute scores, track the maximum. When we find a score equal to the current maximum, add the index to our result list. When we find a new maximum, clear the result list and start fresh with the new maximum.

This approach gives us O(n) time complexity with O(1) extra space (excluding the output array).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output
def maxScoreIndices(self, nums):
    """
    Find all indices i that give the maximum score when dividing nums at i.
    Score = zeros in nums[0..i-1] + ones in nums[i..n-1]
    """
    n = len(nums)

    # Step 1: Count total ones in the entire array
    total_ones = sum(nums)

    # Step 2: Initialize counters
    left_zeros = 0      # zeros in left subarray
    right_ones = total_ones  # ones in right subarray
    max_score = 0       # track maximum score found
    result = []         # indices with maximum score

    # Step 3: Check division point i = 0 (empty left, full right)
    # Score for i=0: left_zeros (0) + right_ones (total_ones)
    current_score = left_zeros + right_ones
    max_score = current_score
    result.append(0)

    # Step 4: Iterate through division points i = 1 to n
    for i in range(1, n + 1):
        # Update counters based on element at index i-1
        # This element was in right subarray for previous i,
        # now moves to left subarray for current i
        if nums[i - 1] == 0:
            left_zeros += 1      # zero moved from right to left
        else:  # nums[i - 1] == 1
            right_ones -= 1      # one moved from right to left

        # Calculate score for current division point
        current_score = left_zeros + right_ones

        # Update maximum score and result list
        if current_score > max_score:
            max_score = current_score
            result = [i]         # new maximum, start fresh
        elif current_score == max_score:
            result.append(i)     # tie with current maximum

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output
function maxScoreIndices(nums) {
  const n = nums.length;

  // Step 1: Count total ones in the entire array
  let totalOnes = 0;
  for (let num of nums) {
    totalOnes += num;
  }

  // Step 2: Initialize counters
  let leftZeros = 0; // zeros in left subarray
  let rightOnes = totalOnes; // ones in right subarray
  let maxScore = 0; // track maximum score found
  let result = []; // indices with maximum score

  // Step 3: Check division point i = 0 (empty left, full right)
  // Score for i=0: leftZeros (0) + rightOnes (totalOnes)
  let currentScore = leftZeros + rightOnes;
  maxScore = currentScore;
  result.push(0);

  // Step 4: Iterate through division points i = 1 to n
  for (let i = 1; i <= n; i++) {
    // Update counters based on element at index i-1
    // This element was in right subarray for previous i,
    // now moves to left subarray for current i
    if (nums[i - 1] === 0) {
      leftZeros++; // zero moved from right to left
    } else {
      rightOnes--; // one moved from right to left
    }

    // Calculate score for current division point
    currentScore = leftZeros + rightOnes;

    // Update maximum score and result list
    if (currentScore > maxScore) {
      maxScore = currentScore;
      result = [i]; // new maximum, start fresh
    } else if (currentScore === maxScore) {
      result.push(i); // tie with current maximum
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output
public List<Integer> maxScoreIndices(int[] nums) {
    int n = nums.length;

    // Step 1: Count total ones in the entire array
    int totalOnes = 0;
    for (int num : nums) {
        totalOnes += num;
    }

    // Step 2: Initialize counters
    int leftZeros = 0;           // zeros in left subarray
    int rightOnes = totalOnes;   // ones in right subarray
    int maxScore = 0;            // track maximum score found
    List<Integer> result = new ArrayList<>();

    // Step 3: Check division point i = 0 (empty left, full right)
    // Score for i=0: leftZeros (0) + rightOnes (totalOnes)
    int currentScore = leftZeros + rightOnes;
    maxScore = currentScore;
    result.add(0);

    // Step 4: Iterate through division points i = 1 to n
    for (int i = 1; i <= n; i++) {
        // Update counters based on element at index i-1
        // This element was in right subarray for previous i,
        // now moves to left subarray for current i
        if (nums[i - 1] == 0) {
            leftZeros++;         // zero moved from right to left
        } else {
            rightOnes--;         // one moved from right to left
        }

        // Calculate score for current division point
        currentScore = leftZeros + rightOnes;

        // Update maximum score and result list
        if (currentScore > maxScore) {
            maxScore = currentScore;
            result.clear();      // new maximum, start fresh
            result.add(i);
        } else if (currentScore == maxScore) {
            result.add(i);       // tie with current maximum
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass to count total ones: O(n)
- We make another pass through all division points (n+1 of them): O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1) excluding output**

- We use only a constant amount of extra space for counters and variables
- The output array can be up to O(n) in size if all division points give the same score, but this is required for the output and not counted in auxiliary space complexity

## Common Mistakes

1. **Off-by-one errors with indices**: The division point `i` ranges from 0 to n (inclusive), not 0 to n-1. When i=0, left is empty; when i=n, right is empty. Many candidates forget to check i=n.

2. **Inefficient score computation**: Recalculating zeros and ones from scratch for each division point leads to O(n²) time. The key optimization is updating counters incrementally as we move through division points.

3. **Incorrect counter updates**: When moving from division point i to i+1, element nums[i] moves from right to left. If it's a 0, leftZeros increases; if it's a 1, rightOnes decreases. Some candidates update both counters incorrectly.

4. **Not handling ties correctly**: When finding a new maximum score, you must clear the previous result list. When finding an equal score, you should append to the current list. Mixing up these cases is a common error.

## When You'll See This Pattern

This problem uses the **prefix sum with sliding window** pattern, which appears in many array problems:

1. **Maximum Subarray (Easy)**: Uses Kadane's algorithm, a similar incremental computation approach.
2. **Product of Array Except Self (Medium)**: Uses prefix and suffix products computed in O(n) time.
3. **Range Sum Query - Immutable (Easy)**: Precomputes prefix sums to answer range queries in O(1) time.
4. **Count Subarrays With More Ones Than Zeros (Medium)**: Similar binary array problem that can use prefix sums with hash maps.

The core idea is to precompute or incrementally update some cumulative metric (sum, count, etc.) to avoid redundant calculations.

## Key Takeaways

1. **Incremental updates beat recalculation**: When you need to compute a value for all positions in an array, see if you can update it incrementally as you move through the array rather than recalculating from scratch each time.

2. **Think about what changes between consecutive states**: When moving from division point i to i+1, only one element changes sides. This observation is key to the O(n) solution.

3. **Binary arrays often simplify to counting problems**: With only 0s and 1s, many operations reduce to counting, which can be done efficiently with prefix sums or incremental counters.

Related problems: [Ones and Zeroes](/problem/ones-and-zeroes), [Max Consecutive Ones II](/problem/max-consecutive-ones-ii), [Count Subarrays With More Ones Than Zeros](/problem/count-subarrays-with-more-ones-than-zeros)
