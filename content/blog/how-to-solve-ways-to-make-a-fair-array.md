---
title: "How to Solve Ways to Make a Fair Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Ways to Make a Fair Array. Medium difficulty, 66.4% acceptance rate. Topics: Array, Prefix Sum."
date: "2028-05-30"
category: "dsa-patterns"
tags: ["ways-to-make-a-fair-array", "array", "prefix-sum", "medium"]
---

# How to Solve Ways to Make a Fair Array

This problem asks us to count how many indices we can remove from an array such that after removal, the sum of elements at even indices equals the sum of elements at odd indices. What makes this tricky is that removing an element shifts all subsequent elements' indices, changing their parity (even/odd status). A naive approach would recompute sums for each removal, but we need an efficient way to handle this index shift.

## Visual Walkthrough

Let's trace through `nums = [2,1,6,4]` step by step. We need to check each index we could remove:

**If we remove index 0 (value 2):**

- Remaining array: `[1,6,4]`
- New indices: 0:1, 1:6, 2:4
- Even-index sum = 1 + 4 = 5
- Odd-index sum = 6 = 6
- Not fair (5 ≠ 6)

**If we remove index 1 (value 1):**

- Remaining array: `[2,6,4]`
- New indices: 0:2, 1:6, 2:4
- Even-index sum = 2 + 4 = 6
- Odd-index sum = 6 = 6
- Fair! ✓

**If we remove index 2 (value 6):**

- Remaining array: `[2,1,4]`
- New indices: 0:2, 1:1, 2:4
- Even-index sum = 2 + 4 = 6
- Odd-index sum = 1 = 1
- Not fair (6 ≠ 1)

**If we remove index 3 (value 4):**

- Remaining array: `[2,1,6]`
- New indices: 0:2, 1:1, 2:6
- Even-index sum = 2 + 6 = 8
- Odd-index sum = 1 = 1
- Not fair (8 ≠ 1)

So there's 1 way to make the array fair. The key insight: when we remove an element at index `i`, all elements to the right shift left, flipping their parity. Elements before `i` keep their original parity, while elements after `i` swap even↔odd.

## Brute Force Approach

The brute force solution would try removing each index, reconstruct the new array, and compute sums:

1. For each index `i` from 0 to n-1
2. Create a new array without `nums[i]`
3. Compute sum of even-indexed elements
4. Compute sum of odd-indexed elements
5. Compare and count if equal

This requires O(n²) time because for each of n removals, we process up to n-1 elements. For n up to 10⁵ (typical constraint), O(n²) is far too slow (10¹⁰ operations). We need to avoid recomputing sums from scratch for each removal.

## Optimized Approach

The optimal approach uses **prefix sums** to compute sums in O(1) time for each removal. Here's the key insight broken down:

1. **Before removal index `i`**: Elements at indices < `i` keep their original parity.
2. **After removal index `i`**: Elements at indices > `i` flip their parity (even becomes odd, odd becomes even).

So for index `i`:

- Even sum after removal = (sum of even elements before i) + (sum of odd elements after i)
- Odd sum after removal = (sum of odd elements before i) + (sum of even elements after i)

We can precompute:

- `prefixEven[i]` = sum of even-indexed elements up to index i-1
- `prefixOdd[i]` = sum of odd-indexed elements up to index i-1
- `suffixEven[i]` = sum of even-indexed elements from index i+1 onward
- `suffixOdd[i]` = sum of odd-indexed elements from index i+1 onward

But we can optimize further: we only need running totals and can compute "after i" sums using total sums minus "up to i" sums.

**Algorithm:**

1. Compute total even sum and total odd sum for the entire array
2. Initialize running even sum (`leftEven`) and running odd sum (`leftOdd`) to 0
3. For each index `i`:
   - If `i` is even in original array: subtract `nums[i]` from total even sum
   - If `i` is odd in original array: subtract `nums[i]` from total odd sum
   - Now `totalEven` and `totalOdd` represent sums of elements **after** `i`
   - Check if: `leftEven + totalOdd == leftOdd + totalEven`
     - Left side: even before + odd after
     - Right side: odd before + even after
   - If equal, increment count
   - Add `nums[i]` to appropriate running sum based on original parity

This gives us O(n) time with O(1) extra space!

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def waysToMakeFair(nums):
    """
    Count how many indices can be removed to make sum(even) == sum(odd)
    after removal, considering index shift.
    """
    # Step 1: Compute total sums for even and odd indices
    total_even = sum(nums[i] for i in range(0, len(nums), 2))
    total_odd = sum(nums[i] for i in range(1, len(nums), 2))

    # Step 2: Initialize running sums and result counter
    left_even = 0  # Sum of even-indexed elements before current index
    left_odd = 0   # Sum of odd-indexed elements before current index
    count = 0      # Number of fair removal indices

    # Step 3: Iterate through each index as potential removal point
    for i in range(len(nums)):
        # Step 4: Temporarily remove nums[i] from appropriate total sum
        # The totals now represent sums of elements AFTER current index
        if i % 2 == 0:  # Current element is at even index originally
            total_even -= nums[i]  # Remove from even total (it's after removal)
        else:  # Current element is at odd index originally
            total_odd -= nums[i]   # Remove from odd total (it's after removal)

        # Step 5: Check if array would be fair after removing index i
        # left_even + total_odd = even before + odd after removal
        # left_odd + total_even = odd before + even after removal
        if left_even + total_odd == left_odd + total_even:
            count += 1

        # Step 6: Add current element to appropriate running sum
        # This element becomes part of "before" for next iteration
        if i % 2 == 0:
            left_even += nums[i]
        else:
            left_odd += nums[i]

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function waysToMakeFair(nums) {
  // Step 1: Compute total sums for even and odd indices
  let totalEven = 0;
  let totalOdd = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i % 2 === 0) {
      totalEven += nums[i];
    } else {
      totalOdd += nums[i];
    }
  }

  // Step 2: Initialize running sums and result counter
  let leftEven = 0; // Sum of even-indexed elements before current index
  let leftOdd = 0; // Sum of odd-indexed elements before current index
  let count = 0; // Number of fair removal indices

  // Step 3: Iterate through each index as potential removal point
  for (let i = 0; i < nums.length; i++) {
    // Step 4: Temporarily remove nums[i] from appropriate total sum
    // The totals now represent sums of elements AFTER current index
    if (i % 2 === 0) {
      // Current element is at even index originally
      totalEven -= nums[i]; // Remove from even total (it's after removal)
    } else {
      // Current element is at odd index originally
      totalOdd -= nums[i]; // Remove from odd total (it's after removal)
    }

    // Step 5: Check if array would be fair after removing index i
    // leftEven + totalOdd = even before + odd after removal
    // leftOdd + totalEven = odd before + even after removal
    if (leftEven + totalOdd === leftOdd + totalEven) {
      count++;
    }

    // Step 6: Add current element to appropriate running sum
    // This element becomes part of "before" for next iteration
    if (i % 2 === 0) {
      leftEven += nums[i];
    } else {
      leftOdd += nums[i];
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int waysToMakeFair(int[] nums) {
        // Step 1: Compute total sums for even and odd indices
        int totalEven = 0;
        int totalOdd = 0;

        for (int i = 0; i < nums.length; i++) {
            if (i % 2 == 0) {
                totalEven += nums[i];
            } else {
                totalOdd += nums[i];
            }
        }

        // Step 2: Initialize running sums and result counter
        int leftEven = 0;  // Sum of even-indexed elements before current index
        int leftOdd = 0;   // Sum of odd-indexed elements before current index
        int count = 0;     // Number of fair removal indices

        // Step 3: Iterate through each index as potential removal point
        for (int i = 0; i < nums.length; i++) {
            // Step 4: Temporarily remove nums[i] from appropriate total sum
            // The totals now represent sums of elements AFTER current index
            if (i % 2 == 0) {  // Current element is at even index originally
                totalEven -= nums[i];  // Remove from even total (it's after removal)
            } else {  // Current element is at odd index originally
                totalOdd -= nums[i];   // Remove from odd total (it's after removal)
            }

            // Step 5: Check if array would be fair after removing index i
            // leftEven + totalOdd = even before + odd after removal
            // leftOdd + totalEven = odd before + even after removal
            if (leftEven + totalOdd == leftOdd + totalEven) {
                count++;
            }

            // Step 6: Add current element to appropriate running sum
            // This element becomes part of "before" for next iteration
            if (i % 2 == 0) {
                leftEven += nums[i];
            } else {
                leftOdd += nums[i];
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the array: one to compute initial totals (O(n)), and one to check each removal index (O(n))
- Each pass does constant work per element, so overall O(2n) = O(n)

**Space Complexity:** O(1)

- We only use a fixed number of integer variables (totalEven, totalOdd, leftEven, leftOdd, count, loop counter)
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting to handle parity flip correctly**: The most common error is not realizing that elements after the removal point flip parity. Candidates might try `leftEven + totalEven == leftOdd + totalOdd` which doesn't account for the flip. Always trace through a small example to verify your parity logic.

2. **Updating running sums in wrong order**: If you add `nums[i]` to `leftEven` or `leftOdd` BEFORE checking fairness, you're including the current element in "before" sums when it should be removed. The correct order is: subtract from totals → check fairness → add to running sums.

3. **Off-by-one errors in index parity**: When `i` is even in the original array, it contributes to `totalEven` initially. After removal, elements that were at odd indices > i become even in the new array. Double-check with concrete examples like `[2,1,6,4]`.

4. **Not considering empty or single-element arrays**: Edge cases matter! For `nums = [1]`, removing the only element gives empty array where even sum = odd sum = 0, so answer is 1. For `nums = []`, answer is 0. Always test these.

## When You'll See This Pattern

The prefix/suffix sum pattern with parity considerations appears in several problems:

1. **Product of Array Except Self (LeetCode 238)**: Similar concept of computing "left products" and "right products" for each index, then combining them.

2. **Maximum Sum of Two Non-Overlapping Subarrays (LeetCode 1031)**: Uses prefix sums to efficiently compute sums of subarrays at different positions.

3. **Range Sum Query - Immutable (LeetCode 303)**: The foundational prefix sum problem where you precompute sums to answer range queries quickly.

The core idea is precomputing cumulative values to avoid recomputation. When you need to answer "what if I remove/change this element" questions for each position, think about what you can compute once and reuse.

## Key Takeaways

1. **Prefix sums enable O(1) range queries**: When you need to compute sums (or other associative operations) for different subarrays repeatedly, precomputing prefix sums lets you answer in constant time using `sum(i,j) = prefix[j] - prefix[i-1]`.

2. **Track "before" and "after" separately for removal problems**: When considering removing/changing an element at position i, maintain running totals for elements before i and use modified totals for elements after i.

3. **Parity flips matter with index shifts**: Any operation that changes indices (removal, insertion) can flip element parity. Always test with concrete examples to ensure your parity logic is correct.

[Practice this problem on CodeJeet](/problem/ways-to-make-a-fair-array)
