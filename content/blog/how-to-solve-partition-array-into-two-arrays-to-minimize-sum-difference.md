---
title: "How to Solve Partition Array Into Two Arrays to Minimize Sum Difference — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Partition Array Into Two Arrays to Minimize Sum Difference. Hard difficulty, 23.0% acceptance rate. Topics: Array, Two Pointers, Binary Search, Dynamic Programming, Bit Manipulation."
date: "2028-05-21"
category: "dsa-patterns"
tags:
  [
    "partition-array-into-two-arrays-to-minimize-sum-difference",
    "array",
    "two-pointers",
    "binary-search",
    "hard",
  ]
---

# How to Solve Partition Array Into Two Arrays to Minimize Sum Difference

You're given an array of `2n` integers and need to split them into two equal-sized groups to minimize the absolute difference between their sums. This is a hard problem because brute force checking all combinations is impossible for large inputs (it would be O(2^(2n))), and it requires clever optimization using meet-in-the-middle and binary search techniques.

What makes this problem particularly interesting is that it looks like a standard subset sum problem, but with the additional constraint that both groups must have exactly `n` elements. This constraint prevents us from using standard dynamic programming approaches directly and requires a more sophisticated solution.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, -1, 0, 4, -2, -3]` with `n = 3`.

**Step 1: Understanding the goal**
We need to split these 6 numbers into two groups of 3 each. The total sum is `2 + (-1) + 0 + 4 + (-2) + (-3) = 0`. Ideally, we'd want both groups to sum to 0, giving a difference of 0.

**Step 2: Why this is hard**
There are `C(6,3) = 20` ways to choose 3 elements for the first group. For each choice, the remaining 3 go to the second group. We could check all 20 combinations, but for `n=15` (30 total elements), there would be `C(30,15) ≈ 155 million` combinations - too many to check.

**Step 3: The meet-in-the-middle insight**
Instead of working with all 2n elements at once, we split them into two halves:

- First half: `[2, -1, 0]`
- Second half: `[4, -2, -3]`

For each half, we generate all possible subsets of size `k` (where `k` ranges from 0 to `n`), along with their sums. Then we combine subsets from both halves to make complete groups of size `n`.

**Step 4: Generating subsets**
For the first half `[2, -1, 0]`:

- Size 0 subsets: `[]` sum = 0
- Size 1 subsets: `[2]` sum = 2, `[-1]` sum = -1, `[0]` sum = 0
- Size 2 subsets: `[2, -1]` sum = 1, `[2, 0]` sum = 2, `[-1, 0]` sum = -1
- Size 3 subsets: `[2, -1, 0]` sum = 1

We organize these by size: `left[k]` contains all sums of subsets of size `k`.

**Step 5: Combining halves**
If we take a subset of size `k` from the first half, we need a subset of size `n-k` from the second half to make a complete group of size `n`. For each possible `k`, we:

1. Take a sum `s1` from `left[k]`
2. Look for a sum `s2` from `right[n-k]` that makes `s1 + s2` as close as possible to `total_sum/2`

The group sum would be `s1 + s2`, and the other group would have `total_sum - (s1 + s2)`. The difference is `abs(total_sum - 2*(s1 + s2))`.

**Step 6: Finding the minimum**
We use binary search on sorted `right[n-k]` lists to quickly find the sum that makes `s1 + s2` closest to `total_sum/2`. This is much faster than checking all combinations.

## Brute Force Approach

The brute force solution would generate all possible ways to choose `n` elements from `2n` elements for the first group. For each choice, we calculate:

- Sum of first group = `sum1`
- Sum of second group = `total_sum - sum1`
- Difference = `abs(total_sum - 2*sum1)`

We then return the minimum difference found.

<div class="code-group">

```python
# Brute Force - Too slow for n > 10
# Time: O(C(2n, n)) which is exponential
# Space: O(n) for recursion stack
def minimumDifference_brute(nums):
    n = len(nums) // 2
    total_sum = sum(nums)
    min_diff = float('inf')

    # Generate all combinations of n elements using recursion
    def dfs(idx, count, current_sum):
        nonlocal min_diff

        if count == n:
            # We've selected n elements
            other_sum = total_sum - current_sum
            diff = abs(current_sum - other_sum)
            min_diff = min(min_diff, diff)
            return

        if idx == 2*n:
            return

        # Option 1: Take current element
        dfs(idx + 1, count + 1, current_sum + nums[idx])

        # Option 2: Skip current element
        dfs(idx + 1, count, current_sum)

    dfs(0, 0, 0)
    return min_diff
```

```javascript
// Brute Force - Too slow for n > 10
// Time: O(C(2n, n)) which is exponential
// Space: O(n) for recursion stack
function minimumDifferenceBrute(nums) {
  const n = nums.length / 2;
  const totalSum = nums.reduce((a, b) => a + b, 0);
  let minDiff = Infinity;

  function dfs(idx, count, currentSum) {
    if (count === n) {
      // We've selected n elements
      const otherSum = totalSum - currentSum;
      const diff = Math.abs(currentSum - otherSum);
      minDiff = Math.min(minDiff, diff);
      return;
    }

    if (idx === 2 * n) return;

    // Option 1: Take current element
    dfs(idx + 1, count + 1, currentSum + nums[idx]);

    // Option 2: Skip current element
    dfs(idx + 1, count, currentSum);
  }

  dfs(0, 0, 0);
  return minDiff;
}
```

```java
// Brute Force - Too slow for n > 10
// Time: O(C(2n, n)) which is exponential
// Space: O(n) for recursion stack
public int minimumDifferenceBrute(int[] nums) {
    int n = nums.length / 2;
    int totalSum = 0;
    for (int num : nums) totalSum += num;

    int[] minDiff = {Integer.MAX_VALUE};

    dfs(0, 0, 0, nums, n, totalSum, minDiff);
    return minDiff[0];
}

private void dfs(int idx, int count, int currentSum, int[] nums, int n, int totalSum, int[] minDiff) {
    if (count == n) {
        int otherSum = totalSum - currentSum;
        int diff = Math.abs(currentSum - otherSum);
        minDiff[0] = Math.min(minDiff[0], diff);
        return;
    }

    if (idx == 2 * n) return;

    // Option 1: Take current element
    dfs(idx + 1, count + 1, currentSum + nums[idx], nums, n, totalSum, minDiff);

    // Option 2: Skip current element
    dfs(idx + 1, count, currentSum, nums, n, totalSum, minDiff);
}
```

</div>

**Why this fails:** For `n=15` (30 elements), there are `C(30,15) ≈ 155 million` combinations to check. Even if we could process 1 million combinations per second, it would take over 2.5 minutes - far too slow for LeetCode constraints.

## Optimized Approach

The key insight is to use **meet-in-the-middle** combined with **binary search**:

1. **Split the array**: Divide the `2n` elements into two halves of size `n` each.
2. **Generate subsets by size**: For each half, generate all subsets grouped by how many elements they contain. We get `left[k]` and `right[k]` lists containing sums of all subsets of size `k` from each half.
3. **Sort the right side**: Sort each `right[k]` list to enable binary search.
4. **Combine intelligently**: For each possible `k` (0 to `n`), we need subsets of size `k` from the left and `n-k` from the right. For each sum in `left[k]`, we binary search in `right[n-k]` to find the value that makes the combined sum closest to `total_sum/2`.
5. **Calculate minimum difference**: The difference for a combined sum `s` is `abs(total_sum - 2*s)`.

This reduces the complexity from exponential to roughly `O(2^n * n)`, which is manageable for `n ≤ 15`.

## Optimal Solution

Here's the complete implementation using meet-in-the-middle with binary search:

<div class="code-group">

```python
# Time: O(2^n * n) - We generate 2^n subsets and sort lists of size up to C(n, n/2)
# Space: O(2^n) - We store all subset sums grouped by size
def minimumDifference(nums):
    n = len(nums) // 2
    total_sum = sum(nums)

    # Step 1: Split array into two halves
    left_half = nums[:n]
    right_half = nums[n:]

    # Step 2: Generate all subset sums for each half, grouped by subset size
    # left[k] will contain all sums of subsets of size k from left_half
    left = [[] for _ in range(n + 1)]
    right = [[] for _ in range(n + 1)]

    # Generate subsets for left half using bitmask technique
    # There are 2^n possible subsets for an array of size n
    for mask in range(1 << n):
        sum_val = 0
        count = 0

        # Count bits and calculate sum for this mask
        for i in range(n):
            if mask & (1 << i):  # If i-th bit is set
                sum_val += left_half[i]
                count += 1

        left[count].append(sum_val)

    # Generate subsets for right half
    for mask in range(1 << n):
        sum_val = 0
        count = 0

        for i in range(n):
            if mask & (1 << i):
                sum_val += right_half[i]
                count += 1

        right[count].append(sum_val)

    # Step 3: Sort right subsets for binary search
    for k in range(n + 1):
        right[k].sort()

    # Step 4: Find minimum difference by combining subsets
    min_diff = float('inf')

    # For each possible number of elements from left half
    for k in range(n + 1):
        # We need n-k elements from right half to make a complete group of n
        right_sums = right[n - k]

        # For each sum in left[k], find best match in right[n-k]
        for left_sum in left[k]:
            # Target sum we want to achieve: total_sum/2 - left_sum
            # We want left_sum + right_sum to be as close as possible to total_sum/2
            target = total_sum / 2 - left_sum

            # Binary search in right_sums to find value closest to target
            idx = bisect_left(right_sums, target)

            # Check the found index and the one before it (if exists)
            if idx < len(right_sums):
                combined_sum = left_sum + right_sums[idx]
                diff = abs(total_sum - 2 * combined_sum)
                min_diff = min(min_diff, diff)

            if idx > 0:
                combined_sum = left_sum + right_sums[idx - 1]
                diff = abs(total_sum - 2 * combined_sum)
                min_diff = min(min_diff, diff)

    return int(min_diff)

# Note: Import bisect_left from bisect module
```

```javascript
// Time: O(2^n * n) - We generate 2^n subsets and sort lists
// Space: O(2^n) - We store all subset sums grouped by size
function minimumDifference(nums) {
  const n = nums.length / 2;
  const totalSum = nums.reduce((a, b) => a + b, 0);

  // Step 1: Split array into two halves
  const leftHalf = nums.slice(0, n);
  const rightHalf = nums.slice(n);

  // Step 2: Generate all subset sums for each half, grouped by subset size
  const left = Array.from({ length: n + 1 }, () => []);
  const right = Array.from({ length: n + 1 }, () => []);

  // Generate subsets for left half using bitmask technique
  for (let mask = 0; mask < 1 << n; mask++) {
    let sumVal = 0;
    let count = 0;

    // Count bits and calculate sum for this mask
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        // If i-th bit is set
        sumVal += leftHalf[i];
        count++;
      }
    }

    left[count].push(sumVal);
  }

  // Generate subsets for right half
  for (let mask = 0; mask < 1 << n; mask++) {
    let sumVal = 0;
    let count = 0;

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sumVal += rightHalf[i];
        count++;
      }
    }

    right[count].push(sumVal);
  }

  // Step 3: Sort right subsets for binary search
  for (let k = 0; k <= n; k++) {
    right[k].sort((a, b) => a - b);
  }

  // Step 4: Find minimum difference by combining subsets
  let minDiff = Infinity;

  // For each possible number of elements from left half
  for (let k = 0; k <= n; k++) {
    // We need n-k elements from right half to make a complete group of n
    const rightSums = right[n - k];

    // For each sum in left[k], find best match in right[n-k]
    for (const leftSum of left[k]) {
      // Target sum we want to achieve: totalSum/2 - leftSum
      const target = totalSum / 2 - leftSum;

      // Binary search in rightSums to find value closest to target
      let low = 0,
        high = rightSums.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (rightSums[mid] < target) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      // Check the found index and the one before it (if exists)
      if (low < rightSums.length) {
        const combinedSum = leftSum + rightSums[low];
        const diff = Math.abs(totalSum - 2 * combinedSum);
        minDiff = Math.min(minDiff, diff);
      }

      if (low > 0) {
        const combinedSum = leftSum + rightSums[low - 1];
        const diff = Math.abs(totalSum - 2 * combinedSum);
        minDiff = Math.min(minDiff, diff);
      }
    }
  }

  return minDiff;
}
```

```java
// Time: O(2^n * n) - We generate 2^n subsets and sort lists
// Space: O(2^n) - We store all subset sums grouped by size
public int minimumDifference(int[] nums) {
    int n = nums.length / 2;
    int totalSum = 0;
    for (int num : nums) totalSum += num;

    // Step 1: Split array into two halves
    int[] leftHalf = new int[n];
    int[] rightHalf = new int[n];
    System.arraycopy(nums, 0, leftHalf, 0, n);
    System.arraycopy(nums, n, rightHalf, 0, n);

    // Step 2: Generate all subset sums for each half, grouped by subset size
    List<List<Integer>> left = new ArrayList<>(n + 1);
    List<List<Integer>> right = new ArrayList<>(n + 1);
    for (int i = 0; i <= n; i++) {
        left.add(new ArrayList<>());
        right.add(new ArrayList<>());
    }

    // Generate subsets for left half using bitmask technique
    for (int mask = 0; mask < (1 << n); mask++) {
        int sumVal = 0;
        int count = 0;

        // Count bits and calculate sum for this mask
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {  // If i-th bit is set
                sumVal += leftHalf[i];
                count++;
            }
        }

        left.get(count).add(sumVal);
    }

    // Generate subsets for right half
    for (int mask = 0; mask < (1 << n); mask++) {
        int sumVal = 0;
        int count = 0;

        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                sumVal += rightHalf[i];
                count++;
            }
        }

        right.get(count).add(sumVal);
    }

    // Step 3: Sort right subsets for binary search
    for (int k = 0; k <= n; k++) {
        Collections.sort(right.get(k));
    }

    // Step 4: Find minimum difference by combining subsets
    int minDiff = Integer.MAX_VALUE;

    // For each possible number of elements from left half
    for (int k = 0; k <= n; k++) {
        // We need n-k elements from right half to make a complete group of n
        List<Integer> rightSums = right.get(n - k);

        // For each sum in left[k], find best match in right[n-k]
        for (int leftSum : left.get(k)) {
            // Target sum we want to achieve: totalSum/2 - leftSum
            double target = totalSum / 2.0 - leftSum;

            // Binary search in rightSums to find value closest to target
            int idx = Collections.binarySearch(rightSums, (int)Math.round(target));

            if (idx < 0) {
                idx = -idx - 1;  // Convert to insertion point
            }

            // Check the found index and the one before it (if exists)
            if (idx < rightSums.size()) {
                int combinedSum = leftSum + rightSums.get(idx);
                int diff = Math.abs(totalSum - 2 * combinedSum);
                minDiff = Math.min(minDiff, diff);
            }

            if (idx > 0) {
                int combinedSum = leftSum + rightSums.get(idx - 1);
                int diff = Math.abs(totalSum - 2 * combinedSum);
                minDiff = Math.min(minDiff, diff);
            }
        }
    }

    return minDiff;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(2^n \* n)**

- Generating all subsets for each half: O(2^n \* n) - we iterate through 2^n masks and for each, check n bits
- Sorting the right subsets: O(∑\_{k=0}^n C(n,k) _ log C(n,k)) which is O(2^n _ n) in worst case
- Combining subsets: O(∑\_{k=0}^n C(n,k) \* log C(n,k)) for binary searches
- Overall: O(2^n _ n) which is manageable for n ≤ 15 (2^15 _ 15 ≈ 500,000 operations)

**Space Complexity: O(2^n)**

- We store all subset sums for both halves: O(2^n) total elements
- The lists are grouped by size, but the total number of elements is still 2^n for each half

## Common Mistakes

1. **Forgetting to group subsets by size**: If you don't track how many elements are in each subset, you might combine subsets that don't add up to exactly n elements total. Remember: we need exactly n elements in the first group.

2. **Not handling both sides of binary search**: When doing binary search to find the closest value, you need to check both the found index AND the index before it. The closest value could be on either side of the insertion point.

3. **Integer division issues with target calculation**: When calculating `target = total_sum / 2 - left_sum`, be careful with integer division. It's better to work with floating point or multiply everything by 2 to avoid precision issues.

4. **Not optimizing subset generation**: Using recursion to generate subsets can be slower and more memory-intensive than the bitmask approach. The bitmask technique is more efficient for n ≤ 15.

## When You'll See This Pattern

The meet-in-the-middle pattern is useful when:

- You need to solve a problem that would normally require checking all subsets (exponential time)
- The input size is moderate (typically n ≤ 20-30)
- The problem involves combining two halves of the input

**Related problems:**

1. **Partition Equal Subset Sum (Medium)**: Split array into two subsets with equal sum. Uses dynamic programming instead of meet-in-the-middle since there's no size constraint.
2. **Split Array With Same Average (Hard)**: Similar to this problem but focuses on averages rather than sums. Uses the same meet-in-the-middle technique.
3. **Tallest Billboard (Hard)**: Find two subsets with equal sum (like building a billboard with two equal sides). Uses meet-in-the-middle with hash maps.

## Key Takeaways

1. **Meet-in-the-middle transforms exponential problems**: When you have 2n elements and need to choose n, brute force is O(C(2n,n)) which is huge. Splitting into halves reduces it to O(2^n \* n).

2. **Group subsets by additional constraints**: When your subsets need to satisfy multiple conditions (like having a specific size), organize them by those constraints to make combination easier.

3. **Binary search enables efficient combination**: Once you have sorted lists of possible values, binary search lets you find the best match in logarithmic time instead of linear time.

Related problems: [Partition Equal Subset Sum](/problem/partition-equal-subset-sum), [Split Array With Same Average](/problem/split-array-with-same-average), [Tallest Billboard](/problem/tallest-billboard)
