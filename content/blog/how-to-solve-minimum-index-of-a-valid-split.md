---
title: "How to Solve Minimum Index of a Valid Split — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Index of a Valid Split. Medium difficulty, 75.5% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2026-09-20"
category: "dsa-patterns"
tags: ["minimum-index-of-a-valid-split", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Minimum Index of a Valid Split

This problem asks us to find the smallest index where we can split an array such that the dominant element (appearing in more than half the elements) in the left subarray is the same as the dominant element in the right subarray. The challenge lies in efficiently tracking the dominant element as we move through the array without repeatedly scanning sections, which would be too slow for large inputs.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 2, 1, 1, 1, 2, 2, 2]`

The dominant element in the entire array is `2` (appears 5 times out of 9, which is more than half).

Now let's check potential split points:

**Split at i = 0**:

- Left: `[1]` → dominant: 1
- Right: `[2, 2, 1, 1, 1, 2, 2, 2]` → dominant: 2
- Different dominants → invalid

**Split at i = 1**:

- Left: `[1, 2]` → no dominant (both appear once, not more than half)
- Right: `[2, 1, 1, 1, 2, 2, 2]` → dominant: 2
- Left has no dominant → invalid

**Split at i = 2**:

- Left: `[1, 2, 2]` → dominant: 2 (appears 2/3, which is more than half)
- Right: `[1, 1, 1, 2, 2, 2]` → dominant: 2 (appears 3/6, which is exactly half → NOT more than half)
- Right has no dominant → invalid

**Split at i = 3**:

- Left: `[1, 2, 2, 1]` → no dominant (1 and 2 each appear twice, not more than half)
- Right: `[1, 1, 2, 2, 2]` → dominant: 2 (appears 3/5, which is more than half)
- Left has no dominant → invalid

**Split at i = 4**:

- Left: `[1, 2, 2, 1, 1]` → dominant: 1 (appears 3/5, which is more than half)
- Right: `[1, 2, 2, 2]` → dominant: 2 (appears 3/4, which is more than half)
- Different dominants → invalid

**Split at i = 5**:

- Left: `[1, 2, 2, 1, 1, 1]` → dominant: 1 (appears 4/6, which is more than half)
- Right: `[2, 2, 2]` → dominant: 2 (appears 3/3, which is more than half)
- Different dominants → invalid

**Split at i = 6**:

- Left: `[1, 2, 2, 1, 1, 1, 2]` → dominant: 1 (appears 4/7, which is more than half)
- Right: `[2, 2]` → dominant: 2 (appears 2/2, which is more than half)
- Different dominants → invalid

**Split at i = 7**:

- Left: `[1, 2, 2, 1, 1, 1, 2, 2]` → dominant: 2 (appears 4/8, which is exactly half → NOT more than half)
- Right: `[2]` → dominant: 2 (appears 1/1, which is more than half)
- Left has no dominant → invalid

**No valid split exists** → return -1

This brute force approach requires checking each split point and scanning both halves to find dominants, which is O(n²) time. We need a more efficient approach.

## Brute Force Approach

The naive solution would check every possible split index `i` from 0 to n-2:

1. For each split index `i`, extract left subarray `nums[0..i]` and right subarray `nums[i+1..n-1]`
2. Find the dominant element in each subarray by counting frequencies
3. Check if both subarrays have the same dominant element

This approach has O(n²) time complexity because for each of O(n) split points, we need to scan both halves (O(n) each) to find dominants. For n=10⁵, this would be 10¹⁰ operations, which is far too slow.

## Optimized Approach

The key insight is that we can find the dominant element of the entire array in O(n) time using the Boyer-Moore Majority Vote algorithm. Once we know the overall dominant element `dom`, we only need to check if it remains dominant in both halves at each split point.

Here's the step-by-step reasoning:

1. **Find the overall dominant element** using Boyer-Moore algorithm
   - This gives us the candidate that appears more than n/2 times
   - We can verify it by counting its total occurrences

2. **Track prefix counts of the dominant element**
   - As we iterate through the array, maintain how many times `dom` has appeared so far
   - This lets us know in O(1) time whether `dom` is dominant in the left subarray

3. **Track suffix counts of the dominant element**
   - Similarly, precompute how many times `dom` appears from each position to the end
   - This lets us know in O(1) time whether `dom` is dominant in the right subarray

4. **Check each split point efficiently**
   - For split at index `i`, left subarray length = `i+1`
   - `dom` is dominant in left if: `prefixCount[i] > (i+1)/2`
   - Right subarray length = `n-i-1`
   - `dom` is dominant in right if: `suffixCount[i+1] > (n-i-1)/2`
   - If both conditions hold, we found a valid split

This reduces the time complexity to O(n) with O(n) extra space for the suffix counts.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumIndex(nums):
    """
    Find the smallest index where we can split nums such that
    the dominant element in both halves is the same.
    """
    n = len(nums)

    # Step 1: Find the dominant element using Boyer-Moore algorithm
    candidate, count = None, 0
    for num in nums:
        if count == 0:
            candidate = num
            count = 1
        elif num == candidate:
            count += 1
        else:
            count -= 1

    # Verify the candidate is actually dominant
    total_count = sum(1 for num in nums if num == candidate)
    if total_count <= n // 2:
        return -1  # Should not happen per problem statement

    # Step 2: Build prefix counts of the dominant element
    prefix_counts = [0] * n
    running_count = 0
    for i in range(n):
        if nums[i] == candidate:
            running_count += 1
        prefix_counts[i] = running_count

    # Step 3: Build suffix counts of the dominant element
    suffix_counts = [0] * (n + 1)  # Extra element for easier indexing
    running_count = 0
    for i in range(n - 1, -1, -1):
        if nums[i] == candidate:
            running_count += 1
        suffix_counts[i] = running_count

    # Step 4: Check each possible split point
    for i in range(n - 1):  # Can't split at last element
        left_len = i + 1
        right_len = n - i - 1

        # Check if candidate is dominant in left subarray
        left_dominant = prefix_counts[i] > left_len // 2

        # Check if candidate is dominant in right subarray
        right_dominant = suffix_counts[i + 1] > right_len // 2

        if left_dominant and right_dominant:
            return i

    return -1
```

```javascript
// Time: O(n) | Space: O(n)
function minimumIndex(nums) {
  const n = nums.length;

  // Step 1: Find the dominant element using Boyer-Moore algorithm
  let candidate = null;
  let count = 0;

  for (const num of nums) {
    if (count === 0) {
      candidate = num;
      count = 1;
    } else if (num === candidate) {
      count++;
    } else {
      count--;
    }
  }

  // Verify the candidate is actually dominant
  const totalCount = nums.filter((num) => num === candidate).length;
  if (totalCount <= Math.floor(n / 2)) {
    return -1; // Should not happen per problem statement
  }

  // Step 2: Build prefix counts of the dominant element
  const prefixCounts = new Array(n).fill(0);
  let runningCount = 0;

  for (let i = 0; i < n; i++) {
    if (nums[i] === candidate) {
      runningCount++;
    }
    prefixCounts[i] = runningCount;
  }

  // Step 3: Build suffix counts of the dominant element
  const suffixCounts = new Array(n + 1).fill(0); // Extra element for easier indexing
  runningCount = 0;

  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] === candidate) {
      runningCount++;
    }
    suffixCounts[i] = runningCount;
  }

  // Step 4: Check each possible split point
  for (let i = 0; i < n - 1; i++) {
    // Can't split at last element
    const leftLen = i + 1;
    const rightLen = n - i - 1;

    // Check if candidate is dominant in left subarray
    const leftDominant = prefixCounts[i] > Math.floor(leftLen / 2);

    // Check if candidate is dominant in right subarray
    const rightDominant = suffixCounts[i + 1] > Math.floor(rightLen / 2);

    if (leftDominant && rightDominant) {
      return i;
    }
  }

  return -1;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minimumIndex(List<Integer> nums) {
        int n = nums.size();

        // Step 1: Find the dominant element using Boyer-Moore algorithm
        int candidate = 0;
        int count = 0;

        for (int num : nums) {
            if (count == 0) {
                candidate = num;
                count = 1;
            } else if (num == candidate) {
                count++;
            } else {
                count--;
            }
        }

        // Verify the candidate is actually dominant
        int totalCount = 0;
        for (int num : nums) {
            if (num == candidate) {
                totalCount++;
            }
        }
        if (totalCount <= n / 2) {
            return -1;  // Should not happen per problem statement
        }

        // Step 2: Build prefix counts of the dominant element
        int[] prefixCounts = new int[n];
        int runningCount = 0;

        for (int i = 0; i < n; i++) {
            if (nums.get(i) == candidate) {
                runningCount++;
            }
            prefixCounts[i] = runningCount;
        }

        // Step 3: Build suffix counts of the dominant element
        int[] suffixCounts = new int[n + 1];  // Extra element for easier indexing
        runningCount = 0;

        for (int i = n - 1; i >= 0; i--) {
            if (nums.get(i) == candidate) {
                runningCount++;
            }
            suffixCounts[i] = runningCount;
        }

        // Step 4: Check each possible split point
        for (int i = 0; i < n - 1; i++) {  // Can't split at last element
            int leftLen = i + 1;
            int rightLen = n - i - 1;

            // Check if candidate is dominant in left subarray
            boolean leftDominant = prefixCounts[i] > leftLen / 2;

            // Check if candidate is dominant in right subarray
            boolean rightDominant = suffixCounts[i + 1] > rightLen / 2;

            if (leftDominant && rightDominant) {
                return i;
            }
        }

        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the dominant element: O(n)
- Building prefix counts: O(n)
- Building suffix counts: O(n)
- Checking split points: O(n)
- Total: O(4n) = O(n)

**Space Complexity: O(n)**

- We store prefix counts: O(n)
- We store suffix counts: O(n)
- Total: O(2n) = O(n)

We could optimize space to O(1) by only storing prefix counts and calculating suffix counts on the fly, but the O(n) space solution is clearer and still efficient.

## Common Mistakes

1. **Not handling integer division correctly**: When checking if an element is dominant, remember that "more than half" means `count > length/2`, not `count >= length/2`. With integer division, `length/2` truncates, so `count > length//2` correctly implements "more than half".

2. **Off-by-one errors in split indices**: Remember that splitting at index `i` means left subarray is `nums[0..i]` (length i+1) and right subarray is `nums[i+1..n-1]` (length n-i-1). A common mistake is using `i` instead of `i+1` for the left length.

3. **Forgetting to verify the Boyer-Moore candidate**: While the problem guarantees a dominant element exists, it's good practice to verify the candidate actually appears more than n/2 times. This catches bugs in the Boyer-Moore implementation.

4. **Checking invalid split points**: You can't split at the last element (i = n-1) because the right subarray would be empty. The loop should only go up to `n-2`.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Boyer-Moore Majority Vote**: Used to find the element appearing more than half the time in O(n) time and O(1) space. This pattern appears in:
   - [Majority Element](https://leetcode.com/problems/majority-element/) (Easy) - Direct application
   - [Majority Element II](https://leetcode.com/problems/majority-element-ii/) (Medium) - Extension to find elements appearing more than n/3 times

2. **Prefix/Suffix Precomputation**: When you need to answer queries about subarrays efficiently, precomputing prefix or suffix sums/counts is a common technique. This appears in:
   - [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) (Medium) - Uses prefix and suffix products
   - [Partition Array into Disjoint Intervals](https://leetcode.com/problems/partition-array-into-disjoint-intervals/) (Medium) - Uses prefix max and suffix min

## Key Takeaways

1. **When you need to find an element appearing more than half the time, Boyer-Moore is your go-to algorithm**. It's O(n) time and O(1) space, much better than using a hash map for counting.

2. **Prefix/suffix precomputation turns O(n²) problems into O(n)**. If you find yourself repeatedly scanning subarrays, consider whether you can precompute running statistics.

3. **Read dominance conditions carefully**: "More than half" means strictly greater than 50%, not greater than or equal to. This affects your comparison operators and integer division logic.

Related problems: [Majority Element](/problem/majority-element), [Partition Array into Disjoint Intervals](/problem/partition-array-into-disjoint-intervals)
