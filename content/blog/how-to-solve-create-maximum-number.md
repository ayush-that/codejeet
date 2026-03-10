---
title: "How to Solve Create Maximum Number — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Create Maximum Number. Hard difficulty, 34.7% acceptance rate. Topics: Array, Two Pointers, Stack, Greedy, Monotonic Stack."
date: "2027-10-20"
category: "dsa-patterns"
tags: ["create-maximum-number", "array", "two-pointers", "stack", "hard"]
---

# How to Solve Create Maximum Number

You need to create the largest possible number of length `k` by selecting digits from two arrays while preserving their relative order within each array. The challenge is that you must decide how many digits to take from each array and then merge them optimally to maximize the result.

This problem is tricky because it combines three separate optimization problems: 1) choosing how many digits to take from each array, 2) selecting the best subsequence from each array, and 3) merging those subsequences to form the largest number. Each step requires careful greedy reasoning.

## Visual Walkthrough

Let's trace through a concrete example:  
`nums1 = [3, 4, 6, 5]`, `nums2 = [9, 1, 2, 5, 8, 3]`, `k = 5`

**Step 1: Consider all possible splits**  
We need 5 total digits. We could take:

- 0 from nums1, 5 from nums2
- 1 from nums1, 4 from nums2
- 2 from nums1, 3 from nums2
- 3 from nums1, 2 from nums2
- 4 from nums1, 1 from nums2
- 5 from nums1, 0 from nums2 (but nums1 only has 4 digits, so invalid)

**Step 2: Find best subsequence from each array**  
For each split, we need the largest subsequence of that length from each array while preserving order.

Let's examine split (2 from nums1, 3 from nums2):

- From nums1 with length 2: We want the largest 2-digit number. Compare 3 vs 4 (keep 4), then 6 vs 5 (keep 6) → `[4, 6]`
- From nums2 with length 3: Largest 3-digit number. Process digits:  
  9 (keep), 1 (compare with 9, keep 9), 2 (keep), 5 (compare with 2, replace 2 with 5), 8 (compare with 5, replace 5 with 8), 3 (keep) → `[9, 8, 3]`

**Step 3: Merge the two subsequences**  
Merge `[4, 6]` and `[9, 8, 3]` to get largest 5-digit number:  
Compare 4 vs 9 → take 9  
Compare 4 vs 8 → take 8  
Compare 4 vs 3 → take 4  
Compare 6 vs 3 → take 6  
Take remaining 3 → `[9, 8, 4, 6, 3]`

**Step 4: Compare all splits**  
We repeat this for all valid splits and keep the best result. The optimal solution for this example is `[9, 8, 6, 5, 3]`.

## Brute Force Approach

A naive approach would:

1. Generate all possible ways to select `k` digits total from both arrays while preserving order within each array
2. For each selection, generate the actual number
3. Compare all numbers and return the largest

This is exponential in complexity. For each array of length `n`, there are `C(n, i)` ways to choose `i` digits while preserving order. We'd need to consider all combinations of `i` from nums1 and `k-i` from nums2, then generate and compare all resulting numbers.

The brute force is impractical because with `m` and `n` up to 500, the number of combinations is astronomical. Even if we could generate them efficiently, comparing them would be too slow.

## Optimized Approach

The key insight is to break the problem into three independent subproblems:

1. **For each possible split**: Determine how many digits to take from each array (`i` from nums1, `k-i` from nums2`)

2. **Get max subsequence**: For a given array and length `x`, find the largest subsequence of length `x` while preserving order. This can be solved using a **monotonic stack** approach similar to "Remove K Digits" but maximizing instead of minimizing.

3. **Merge two subsequences**: Given two subsequences, merge them to form the largest possible number of length `k`. This is similar to merge sort but with a twist: when digits are equal, we need to look ahead to decide which array to take from first.

The monotonic stack approach for getting the max subsequence works because:

- We iterate through the array
- While we have digits in our stack and the current digit is greater than the top of the stack, and we still have enough digits left to reach our target length, we pop from the stack
- This ensures we keep the largest digits in the correct order

The merge step requires careful comparison: when two digits are equal, we compare the remaining portions of both arrays lexicographically to decide which one gives us a larger overall number.

## Optimal Solution

<div class="code-group">

```python
# Time: O(k * (m + n)) | Space: O(k)
class Solution:
    def maxNumber(self, nums1: List[int], nums2: List[int], k: int) -> List[int]:
        def max_subsequence(nums: List[int], k: int) -> List[int]:
            """
            Get the largest subsequence of length k from nums while preserving order.
            Uses a monotonic stack approach.
            """
            drop = len(nums) - k  # How many digits we can afford to drop
            stack = []

            for num in nums:
                # While we can drop digits (drop > 0) and the current digit
                # is greater than the last digit in our stack, pop from stack
                while drop > 0 and stack and stack[-1] < num:
                    stack.pop()
                    drop -= 1
                stack.append(num)

            # If we didn't drop enough digits (in case of increasing sequence),
            # truncate to exactly k digits
            return stack[:k]

        def merge(nums1: List[int], nums2: List[int]) -> List[int]:
            """
            Merge two arrays to form the largest possible number.
            Similar to merge sort but when digits are equal, we need to
            compare the remaining portions lexicographically.
            """
            result = []
            i, j = 0, 0

            while i < len(nums1) or j < len(nums2):
                # Compare which array gives us a larger next digit
                if greater(nums1, i, nums2, j):
                    result.append(nums1[i])
                    i += 1
                else:
                    result.append(nums2[j])
                    j += 1
            return result

        def greater(nums1: List[int], i: int, nums2: List[int], j: int) -> bool:
            """
            Compare nums1[i:] and nums2[j:] lexicographically.
            Returns True if nums1[i:] is greater than nums2[j:].
            """
            while i < len(nums1) and j < len(nums2):
                if nums1[i] != nums2[j]:
                    return nums1[i] > nums2[j]
                i += 1
                j += 1

            # If all compared digits are equal, the longer array is "greater"
            # because we want to take from the array that has more digits left
            return (len(nums1) - i) > (len(nums2) - j)

        # Try all possible splits: i digits from nums1, k-i from nums2
        # i must be between max(0, k - len(nums2)) and min(k, len(nums1))
        start = max(0, k - len(nums2))
        end = min(k, len(nums1))

        best_result = []

        for i in range(start, end + 1):
            # Get best subsequences from each array
            subsequence1 = max_subsequence(nums1, i)
            subsequence2 = max_subsequence(nums2, k - i)

            # Merge them
            current = merge(subsequence1, subsequence2)

            # Update best result if current is better
            if greater(current, 0, best_result, 0):
                best_result = current

        return best_result
```

```javascript
// Time: O(k * (m + n)) | Space: O(k)
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number[]}
 */
var maxNumber = function (nums1, nums2, k) {
  // Helper: Get max subsequence of length k from an array
  const maxSubsequence = (nums, k) => {
    const drop = nums.length - k; // Digits we can afford to drop
    const stack = [];

    for (const num of nums) {
      // While we can drop digits and current digit > top of stack
      while (drop > 0 && stack.length > 0 && stack[stack.length - 1] < num) {
        stack.pop();
        drop--;
      }
      stack.push(num);
    }

    // Trim to exactly k digits (in case we didn't drop enough)
    return stack.slice(0, k);
  };

  // Helper: Compare two arrays lexicographically starting from given indices
  const greater = (nums1, i, nums2, j) => {
    while (i < nums1.length && j < nums2.length) {
      if (nums1[i] !== nums2[j]) {
        return nums1[i] > nums2[j];
      }
      i++;
      j++;
    }
    // If all compared digits equal, longer remainder is "greater"
    return nums1.length - i > nums2.length - j;
  };

  // Helper: Merge two arrays to form largest number
  const merge = (nums1, nums2) => {
    const result = [];
    let i = 0,
      j = 0;

    while (i < nums1.length || j < nums2.length) {
      // Choose the array that gives larger next digit
      if (greater(nums1, i, nums2, j)) {
        result.push(nums1[i]);
        i++;
      } else {
        result.push(nums2[j]);
        j++;
      }
    }
    return result;
  };

  // Try all valid splits between the two arrays
  const start = Math.max(0, k - nums2.length);
  const end = Math.min(k, nums1.length);

  let bestResult = [];

  for (let i = start; i <= end; i++) {
    // Get best subsequences for current split
    const subsequence1 = maxSubsequence(nums1, i);
    const subsequence2 = maxSubsequence(nums2, k - i);

    // Merge them
    const current = merge(subsequence1, subsequence2);

    // Update best result if current is better
    if (greater(current, 0, bestResult, 0)) {
      bestResult = current;
    }
  }

  return bestResult;
};
```

```java
// Time: O(k * (m + n)) | Space: O(k)
class Solution {
    public int[] maxNumber(int[] nums1, int[] nums2, int k) {
        int m = nums1.length, n = nums2.length;
        int[] bestResult = new int[k];

        // Try all possible splits: i from nums1, k-i from nums2
        // i must be between max(0, k-n) and min(k, m)
        int start = Math.max(0, k - n);
        int end = Math.min(k, m);

        for (int i = start; i <= end; i++) {
            // Get max subsequence from each array
            int[] subsequence1 = maxSubsequence(nums1, i);
            int[] subsequence2 = maxSubsequence(nums2, k - i);

            // Merge the two subsequences
            int[] current = merge(subsequence1, subsequence2);

            // Update best result if current is better
            if (greater(current, 0, bestResult, 0)) {
                bestResult = current;
            }
        }

        return bestResult;
    }

    // Get largest subsequence of length k from nums
    private int[] maxSubsequence(int[] nums, int k) {
        if (k == 0) return new int[0];
        if (k == nums.length) return nums.clone();

        int drop = nums.length - k;  // Digits we can drop
        int[] stack = new int[nums.length];
        int top = -1;  // Stack pointer

        for (int num : nums) {
            // While we can drop digits and current > top of stack
            while (drop > 0 && top >= 0 && stack[top] < num) {
                top--;  // Pop from stack
                drop--;
            }
            stack[++top] = num;  // Push to stack
        }

        // Take first k elements (in case we didn't drop enough)
        int[] result = new int[k];
        System.arraycopy(stack, 0, result, 0, k);
        return result;
    }

    // Merge two arrays to form largest number
    private int[] merge(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        int[] result = new int[m + n];
        int i = 0, j = 0, idx = 0;

        while (i < m || j < n) {
            // Choose array that gives larger next digit
            if (greater(nums1, i, nums2, j)) {
                result[idx++] = nums1[i++];
            } else {
                result[idx++] = nums2[j++];
            }
        }
        return result;
    }

    // Compare nums1[i:] and nums2[j:] lexicographically
    private boolean greater(int[] nums1, int i, int[] nums2, int j) {
        int m = nums1.length, n = nums2.length;

        while (i < m && j < n) {
            if (nums1[i] != nums2[j]) {
                return nums1[i] > nums2[j];
            }
            i++;
            j++;
        }

        // If all compared digits equal, longer remainder is "greater"
        return (m - i) > (n - j);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k × (m + n))

- We try O(k) possible splits (from `start` to `end`)
- For each split, `max_subsequence` runs in O(m + n) since each digit is pushed and popped at most once
- The `merge` operation takes O(k) time
- The `greater` comparison in worst case compares all k digits
- Total: O(k × (m + n + k)) = O(k × (m + n)) since k ≤ m + n

**Space Complexity:** O(k)

- We store subsequences of size at most k
- The stack in `max_subsequence` uses O(m) or O(n), but we only keep the final k digits
- The merge result uses O(k) space

## Common Mistakes

1. **Incorrect merge when digits are equal**: Simply taking from either array when digits are equal can give wrong results. You must compare the remaining portions lexicographically.  
   _Example_: Merging `[6, 7]` and `[6, 0, 4]` - if you take the first 6 from nums1, you get `[6, 7, 6, 0, 4]`, but taking from nums2 gives `[6, 6, 7, 0, 4]` which is larger.

2. **Wrong bounds for the split loop**: Forgetting that `i` (digits from nums1) must be between `max(0, k - len(nums2))` and `min(k, len(nums1))`. Taking `i` outside this range would either require more digits than available or negative digits from the other array.

3. **Not handling the monotonic stack correctly in `max_subsequence`**: Forgetting to check that we still have enough digits left to reach our target length when popping from the stack. The condition should consider `drop > 0` (digits we can still remove).

4. **Comparing arrays incorrectly in `greater` function**: When all compared digits are equal, candidates often return `false`, but we should return `true` if nums1 has more digits remaining, as this allows us to take from the array that will give us more options later.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Monotonic Stack**: Used in `max_subsequence` to get the largest digits while preserving order. Similar to:
   - **Remove K Digits (LeetCode 402)**: Minimize number by removing k digits (uses decreasing stack)
   - **Next Greater Element (LeetCode 496)**: Find next greater element for each element

2. **Greedy Merging with Lookahead**: The merge step with lexicographic comparison appears in:
   - **Largest Number (LeetCode 179)**: Arrange numbers to form largest number (custom comparator)
   - **Merge Sorted Array (LeetCode 88)**: Basic merging but with twist when values are equal

3. **Split and Combine Strategy**: Breaking a complex problem into independent subproblems is common in:
   - **Maximum Product Subarray (LeetCode 152)**: Consider max/min ending at each position
   - **Best Time to Buy/Sell Stock with Cooldown (LeetCode 309)**: Consider states (hold, sold, rest)

## Key Takeaways

1. **Complex problems can often be decomposed** into simpler, independent subproblems. Here, we split into: choosing the split point, getting max subsequence from each array, and merging optimally.

2. **Monotonic stacks are powerful** for problems where you need to maintain order while optimizing some property (max/min). Remember: increasing stack for minimizing, decreasing stack for maximizing.

3. **When merging with greedy choices**, sometimes you need to look ahead when current values are equal. Lexicographic comparison of remaining portions ensures optimal decisions.

Related problems: [Remove K Digits](/problem/remove-k-digits), [Maximum Swap](/problem/maximum-swap)
