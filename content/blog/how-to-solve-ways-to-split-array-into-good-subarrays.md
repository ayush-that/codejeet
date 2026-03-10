---
title: "How to Solve Ways to Split Array Into Good Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Ways to Split Array Into Good Subarrays. Medium difficulty, 34.8% acceptance rate. Topics: Array, Math, Dynamic Programming."
date: "2029-06-18"
category: "dsa-patterns"
tags: ["ways-to-split-array-into-good-subarrays", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Ways to Split Array Into Good Subarrays

This problem asks us to count the number of ways to split a binary array into subarrays where each subarray contains exactly one `1`. The challenge lies in efficiently counting these splits without enumerating all possibilities, which would be exponential. The key insight is that splits can only occur between consecutive `1`s, and each gap between `1`s offers multiple split points that multiply together to give the total count.

## Visual Walkthrough

Let's trace through an example: `nums = [0,1,0,0,1,0,1]`.

First, identify all positions of `1`s:

- Index 1: first `1`
- Index 4: second `1`
- Index 6: third `1`

We need to split the array so each subarray has exactly one `1`. This means:

1. We must have exactly as many subarrays as there are `1`s (3 in this case)
2. Each `1` must be in its own subarray
3. The `0`s between `1`s can be distributed to either the left or right subarray

Let's look at the gaps between consecutive `1`s:

- Between index 1 and index 4: indices 2 and 3 contain `0`s
  - We can split anywhere in this gap: after index 1, after index 2, or after index 3
  - That's 3 possible split points
- Between index 4 and index 6: index 5 contains a `0`
  - We can split after index 4 or after index 5
  - That's 2 possible split points

The total number of ways is the product of these possibilities: `3 × 2 = 6`.

What about leading and trailing `0`s? They don't create additional split points because:

- Leading `0`s (before the first `1`) must go with the first subarray
- Trailing `0`s (after the last `1`) must go with the last subarray
  They don't offer choices for splitting.

Let's verify one valid split: `[0,1] | [0,0,1] | [0,1]`

- First subarray: `[0,1]` (contains index 1)
- Second subarray: `[0,0,1]` (contains index 4)
- Third subarray: `[0,1]` (contains index 6)

## Brute Force Approach

A naive approach would try all possible split points. For an array of length `n`, there are `n-1` potential split points (between each pair of adjacent elements). We could try all `2^(n-1)` combinations of split points and check if each resulting subarray contains exactly one `1`.

However, this is exponential time `O(2^n)`, which is completely impractical for the constraints (nums.length ≤ 10^5). Even for modest `n=20`, we'd have over 1 million possibilities to check.

A slightly better brute force would be to only consider splits that create exactly `k` subarrays where `k` is the number of `1`s. We could use recursion to try placing split points, but this would still be exponential in the worst case when there are many `0`s between `1`s.

The key observation that makes optimization possible: splits are independent between gaps! Once we realize that choices in one gap don't affect choices in another (except that we must have exactly one `1` per subarray), we can multiply the possibilities.

## Optimized Approach

The optimal solution follows this reasoning:

1. **Count the total number of 1s** - if it's zero, there are no valid splits (return 0)
2. **Find all indices where 1s occur** - store these in an array
3. **For each gap between consecutive 1s**, calculate how many ways we can split in that gap
   - If we have `1`s at positions `i` and `j`, the gap contains `j - i - 1` zeros
   - We can place the split anywhere between these `1`s: after the first `1`, or after any of the zeros
   - That gives us `(j - i)` possible split positions
4. **Multiply all these possibilities together** (modulo 10^9+7)
5. **Handle edge cases**:
   - If there are no `1`s, return 0
   - If there's only one `1`, we must take the entire array as one subarray, so return 1

Why does this work? Each split decision in one gap is independent of decisions in other gaps. Once we decide where to split between two consecutive `1`s, it doesn't affect where we can split between other pairs of `1`s.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(m) where m is number of 1s
class Solution:
    def numberOfGoodSubarraySplits(self, nums: List[int]) -> int:
        MOD = 10**9 + 7

        # Step 1: Collect indices of all 1s
        ones_indices = []
        for i, num in enumerate(nums):
            if num == 1:
                ones_indices.append(i)

        # Step 2: If no 1s, no valid splits
        if not ones_indices:
            return 0

        # Step 3: If only one 1, entire array must be one subarray
        if len(ones_indices) == 1:
            return 1

        # Step 4: Calculate product of gaps between consecutive 1s
        result = 1
        for i in range(1, len(ones_indices)):
            # Gap between current 1 and previous 1
            gap = ones_indices[i] - ones_indices[i-1]
            # Number of ways to split in this gap = gap
            # (we can split after any of the gap positions)
            result = (result * gap) % MOD

        return result
```

```javascript
// Time: O(n) | Space: O(m) where m is number of 1s
/**
 * @param {number[]} nums
 * @return {number}
 */
var numberOfGoodSubarraySplits = function (nums) {
  const MOD = 1_000_000_007;

  // Step 1: Collect indices of all 1s
  const onesIndices = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      onesIndices.push(i);
    }
  }

  // Step 2: If no 1s, no valid splits
  if (onesIndices.length === 0) {
    return 0;
  }

  // Step 3: If only one 1, entire array must be one subarray
  if (onesIndices.length === 1) {
    return 1;
  }

  // Step 4: Calculate product of gaps between consecutive 1s
  let result = 1;
  for (let i = 1; i < onesIndices.length; i++) {
    // Gap between current 1 and previous 1
    const gap = onesIndices[i] - onesIndices[i - 1];
    // Number of ways to split in this gap = gap
    result = (result * gap) % MOD;
  }

  return result;
};
```

```java
// Time: O(n) | Space: O(m) where m is number of 1s
class Solution {
    public int numberOfGoodSubarraySplits(int[] nums) {
        final int MOD = 1_000_000_007;

        // Step 1: Collect indices of all 1s
        List<Integer> onesIndices = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 1) {
                onesIndices.add(i);
            }
        }

        // Step 2: If no 1s, no valid splits
        if (onesIndices.isEmpty()) {
            return 0;
        }

        // Step 3: If only one 1, entire array must be one subarray
        if (onesIndices.size() == 1) {
            return 1;
        }

        // Step 4: Calculate product of gaps between consecutive 1s
        long result = 1; // Use long to avoid overflow before modulo
        for (int i = 1; i < onesIndices.size(); i++) {
            // Gap between current 1 and previous 1
            int gap = onesIndices.get(i) - onesIndices.get(i - 1);
            // Number of ways to split in this gap = gap
            result = (result * gap) % MOD;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the input array. We make a single pass through the array to collect indices of `1`s, then another pass through the list of indices (which has at most n elements) to calculate the product of gaps.

**Space Complexity: O(m)** where m is the number of `1`s in the array. In the worst case when all elements are `1`s, this becomes O(n). We could optimize to O(1) space by processing gaps on the fly without storing all indices, but the current approach is clearer and still efficient enough.

## Common Mistakes

1. **Forgetting to handle the case with no 1s**: If there are no `1`s, there's no way to create subarrays with exactly one `1` each. Some candidates return 1 instead of 0.

2. **Not using modulo correctly**: The result can be huge (imagine 100,000 gaps each of size ~100,000). We need to apply modulo after each multiplication, not just at the end. Also, in Java, using `int` for the result can cause overflow before modulo is applied - use `long` instead.

3. **Miscounting split possibilities**: A common error is to think there are `gap - 1` ways instead of `gap` ways. Between indices `i` and `j`, there are `j - i - 1` zeros, but we can split after the first `1` OR after any of those zeros, giving `(j - i - 1) + 1 = j - i` possibilities.

4. **Including leading/trailing zeros in calculations**: Zeros before the first `1` or after the last `1` don't create additional split options - they must be included with the first/last subarray respectively. Only zeros between `1`s create choices.

## When You'll See This Pattern

This "gap multiplication" pattern appears in several combinatorial counting problems:

1. **Binary Subarrays With Sum** (LeetCode 930): Counts subarrays with a given sum. The two-pointer/sliding window approach has similarities in how it handles gaps of zeros.

2. **Count Number of Nice Subarrays** (LeetCode 1248): Counts subarrays with exactly k odd numbers. The transformation (odd→1, even→0) makes it identical to counting subarrays with exactly k ones.

3. **Number of Substrings Containing All Three Characters** (LeetCode 1358): While not about binary arrays, it uses similar combinatorial reasoning about counting subarrays that satisfy certain conditions.

The core technique is: when choices in different segments are independent, the total count is the product of counts for each segment.

## Key Takeaways

1. **Look for independence in combinatorial problems**: When choices in different parts of the problem don't affect each other, you can multiply counts instead of enumerating all combinations.

2. **Transform the problem**: This problem is essentially about counting ways to place split points between consecutive `1`s. Recognizing this transformation from "split array" to "choose split points in gaps" is key.

3. **Handle edge cases systematically**: Always check for empty input, single element, all zeros, all ones, etc. These often reveal flaws in the main logic.

Related problems: [Binary Subarrays With Sum](/problem/binary-subarrays-with-sum), [Count Number of Nice Subarrays](/problem/count-number-of-nice-subarrays)
