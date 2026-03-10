---
title: "How to Solve Maximum Score After Binary Swaps — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Score After Binary Swaps. Medium difficulty, 35.0% acceptance rate. Topics: Array, String, Greedy, Heap (Priority Queue)."
date: "2026-02-25"
category: "dsa-patterns"
tags: ["maximum-score-after-binary-swaps", "array", "string", "greedy", "medium"]
---

# How to Solve Maximum Score After Binary Swaps

This problem asks us to maximize our score by strategically swapping elements in an array. We start with a score calculated from indices where a binary string has '1's, and we can swap any two indices in the array. The tricky part is that we want to maximize the sum of values at positions marked '1', but we can only swap entire array elements—not just move values to specific positions. This creates an interesting optimization problem where we need to pair the largest values with '1' positions.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
nums = [5, 3, 8, 2, 1]
s = "01101"
```

**Initial state:**

- Indices where s[i] = '1': positions 1, 2, and 4 (0-indexed)
- Initial score = nums[1] + nums[2] + nums[4] = 3 + 8 + 1 = 12

**Observation:** We can swap any two elements in `nums`. This means we can rearrange the array however we want! The key insight is that to maximize the sum at '1' positions, we should put the largest values at those positions.

**Step 1: Identify '1' positions and sort values:**

- '1' positions: indices 1, 2, 4
- All values in nums: [5, 3, 8, 2, 1]
- Sorted values: [8, 5, 3, 2, 1] (descending)

**Step 2: Assign largest values to '1' positions:**

- We have 3 '1' positions, so take the 3 largest values: 8, 5, 3
- New score = 8 + 5 + 3 = 16

**Step 3: Verify this is achievable:**
We can swap elements to achieve any permutation. For example:

- Swap nums[0] (5) with nums[2] (8): nums becomes [8, 3, 5, 2, 1]
- Swap nums[0] (8) with nums[1] (3): nums becomes [3, 8, 5, 2, 1]
- Swap nums[0] (3) with nums[4] (1): nums becomes [1, 8, 5, 2, 3]
  Now positions 1, 2, 4 have values 8, 5, 3 respectively.

**Final answer:** 16

## Brute Force Approach

A naive approach would be to try all possible permutations of the array and calculate the score for each, keeping track of the maximum. For an array of length n, there are n! permutations. Even for n=10, that's 3.6 million possibilities. For n=20, it's approximately 2.4×10¹⁸—completely infeasible.

Another brute force idea might be to try all possible swaps, but since we can perform any number of operations, we can achieve any permutation through a sequence of swaps. The problem reduces to: "Given we can rearrange the array arbitrarily, what's the maximum sum we can get at positions marked '1'?"

The brute force would have exponential time complexity O(n!), which is why we need a smarter approach.

## Optimized Approach

The key insight is that **since we can swap any two elements any number of times, we can rearrange the array into any permutation we want**. This is a fundamental property of swaps: with enough swaps, you can achieve any ordering.

Therefore, the problem simplifies to:

1. Count how many positions have '1' in the string s (let's call this count k)
2. Take the k largest values from nums
3. Sum those k largest values

Why does this work? Because we can always rearrange the array to place the k largest values at the k positions marked '1'. The remaining (n-k) values go to the positions marked '0'.

**Step-by-step reasoning:**

1. We want to maximize the sum of values at positions where s[i] = '1'
2. We can rearrange the entire array arbitrarily through swaps
3. Therefore, we should put the largest possible values at the '1' positions
4. If there are k '1' positions, we should put the k largest values there
5. The sum of those k largest values is our maximum possible score

This is a **greedy** approach: at each step, we take the largest available value and assign it to a '1' position. Since all '1' positions contribute equally to the score, and we want to maximize their sum, it's optimal to assign the largest values to them.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for sorting
def maximumScore(nums, s):
    """
    Calculate the maximum possible score after performing any number of swaps.

    Args:
        nums: List of integers representing values at each index
        s: Binary string of same length as nums

    Returns:
        Maximum possible score
    """
    # Step 1: Count how many '1's are in the string
    # This tells us how many positions contribute to our score
    k = s.count('1')

    # Step 2: Sort the numbers in descending order
    # We want the largest k numbers for our '1' positions
    sorted_nums = sorted(nums, reverse=True)

    # Step 3: Take the sum of the first k numbers
    # These are the k largest numbers that we'll place at '1' positions
    return sum(sorted_nums[:k])
```

```javascript
// Time: O(n log n) | Space: O(n) for sorting
function maximumScore(nums, s) {
  /**
   * Calculate the maximum possible score after performing any number of swaps.
   *
   * @param {number[]} nums - Array of integers representing values at each index
   * @param {string} s - Binary string of same length as nums
   * @return {number} Maximum possible score
   */

  // Step 1: Count how many '1's are in the string
  // This tells us how many positions contribute to our score
  let k = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "1") {
      k++;
    }
  }

  // Step 2: Sort the numbers in descending order
  // We want the largest k numbers for our '1' positions
  const sortedNums = [...nums].sort((a, b) => b - a);

  // Step 3: Take the sum of the first k numbers
  // These are the k largest numbers that we'll place at '1' positions
  let result = 0;
  for (let i = 0; i < k; i++) {
    result += sortedNums[i];
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n) for sorting
import java.util.Arrays;
import java.util.Collections;

class Solution {
    public int maximumScore(int[] nums, String s) {
        /**
         * Calculate the maximum possible score after performing any number of swaps.
         *
         * @param nums Array of integers representing values at each index
         * @param s Binary string of same length as nums
         * @return Maximum possible score
         */

        // Step 1: Count how many '1's are in the string
        // This tells us how many positions contribute to our score
        int k = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '1') {
                k++;
            }
        }

        // Step 2: Sort the numbers in descending order
        // We need to convert to Integer[] to sort in reverse order
        Integer[] numsObj = new Integer[nums.length];
        for (int i = 0; i < nums.length; i++) {
            numsObj[i] = nums[i];
        }
        Arrays.sort(numsObj, Collections.reverseOrder());

        // Step 3: Take the sum of the first k numbers
        // These are the k largest numbers that we'll place at '1' positions
        int result = 0;
        for (int i = 0; i < k; i++) {
            result += numsObj[i];
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Counting '1's in the string: O(n)
- Sorting the array: O(n log n) - this is the dominant operation
- Summing the first k elements: O(k) which is O(n) in worst case
- Overall: O(n log n)

**Space Complexity: O(n)**

- We need additional space for the sorted array: O(n)
- In Python and JavaScript, `sorted()` and `.sort()` create a new array or work in-place but may use O(n) auxiliary space
- In Java, we create an Integer array of size n: O(n)
- The counting operation uses O(1) extra space

**Optimization Note:** We could achieve O(n) time using a selection algorithm like QuickSelect to find the k largest elements without fully sorting, but O(n log n) is acceptable for most interview scenarios and the code is simpler.

## Common Mistakes

1. **Not realizing swaps allow full rearrangement:** Some candidates think they can only swap adjacent elements or have other restrictions. The problem clearly states "choose any two indices," which means we can achieve any permutation.

2. **Trying to actually perform swaps:** Candidates might attempt to simulate swaps to rearrange the array, which is unnecessary and inefficient. We only need to calculate the theoretical maximum, not find a sequence of swaps.

3. **Off-by-one errors with k:** When k = 0 (no '1's in the string), the answer should be 0. Make sure your code handles this edge case. Similarly, when k = n (all positions are '1'), we need to sum all elements.

4. **Forgetting to sort in descending order:** Sorting in ascending order and taking the last k elements works, but taking the first k elements after ascending sort would give the smallest k elements, which is wrong.

5. **Modifying the original array:** In some languages, sorting happens in-place. If you need the original array later, make a copy before sorting.

## When You'll See This Pattern

This problem uses a **greedy selection** pattern combined with the insight that swaps allow full rearrangement. You'll see similar patterns in:

1. **Maximum Swap (LeetCode 670)** - While different in specifics, it also involves maximizing a number through swaps, though with restrictions on swap count.

2. **Assign Cookies (LeetCode 455)** - Uses greedy assignment of largest cookies to most greedy children, similar to our assignment of largest values to '1' positions.

3. **Last Stone Weight (LeetCode 1046)** - Uses a max-heap to always select the two largest stones, similar to our need to select the largest values.

4. **Sorting-based optimization problems** - Many problems where you can rearrange elements freely reduce to "take the largest/smallest k elements."

The core pattern is: when you can rearrange freely to optimize a sum (or other metric) at specific positions, sort and assign the best values to those positions.

## Key Takeaways

1. **Swaps enable full permutation:** When a problem allows swapping any two elements any number of times, you can achieve any arrangement. This simplifies the problem to selecting which values go where.

2. **Greedy assignment works for sum maximization:** To maximize the sum of values at specific positions when all positions contribute equally, assign the largest values to those positions.

3. **Count then select:** First determine how many positions matter (count of '1's), then select that many largest values from the array. The implementation is straightforward once you have this insight.

[Practice this problem on CodeJeet](/problem/maximum-score-after-binary-swaps)
