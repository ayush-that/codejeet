---
title: "How to Solve Transform Array to All Equal Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Transform Array to All Equal Elements. Medium difficulty, 33.0% acceptance rate. Topics: Array, Greedy."
date: "2029-04-25"
category: "dsa-patterns"
tags: ["transform-array-to-all-equal-elements", "array", "greedy", "medium"]
---

# How to Solve Transform Array to All Equal Elements

You're given an array containing only 1 and -1, and you can perform at most k operations where each operation flips the signs of two adjacent elements. The goal is to determine if you can make all elements equal. What makes this problem interesting is that flipping two adjacent elements creates a subtle relationship between operations—this isn't just about counting mismatches, but understanding how operations propagate through the array.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, -1, -1, 1]` with `k = 2`.

**Initial state:** `[1, -1, -1, 1]`
We want all elements to be either all 1s or all -1s. Let's try to make them all 1s.

**Step 1:** Look for adjacent mismatches. At index 0 and 1, we have `[1, -1]`. If we flip both (multiply by -1), they become `[-1, 1]`. But wait—this doesn't help! We just moved the -1 one position to the left.

Actually, let's think differently. Notice that flipping `nums[i]` and `nums[i+1]` is equivalent to flipping the _difference_ between them. More precisely, if we look at pairs of consecutive elements, flipping both changes their relationship.

Better approach: Let's track the number of -1s. We have 2 -1s at indices 1 and 2. To make all elements 1, we need to eliminate these -1s.

**Operation 1:** Flip indices 1 and 2: `[1, -1, -1, 1]` → `[1, 1, 1, 1]`
We flipped both -1s in one operation! Now all elements are 1, and we used only 1 operation (k = 2, so we succeed).

But what if the -1s weren't adjacent? Let's try `nums = [1, -1, 1, -1]` with `k = 2`.

**Initial state:** `[1, -1, 1, -1]` (alternating pattern)
We have -1s at indices 1 and 3.

**Operation 1:** Flip indices 1 and 2: `[1, -1, 1, -1]` → `[1, 1, -1, -1]`
Now we have -1s at indices 2 and 3 (adjacent!).

**Operation 2:** Flip indices 2 and 3: `[1, 1, -1, -1]` → `[1, 1, 1, 1]`
Success with exactly 2 operations.

The key insight: Each operation can either fix two adjacent -1s in one go, or it can move a -1 around. When -1s are separated, we need to "bring them together" to eliminate them efficiently.

## Brute Force Approach

A naive approach would be to try all possible sequences of up to k operations. For each operation, we have n-1 choices of index i. With k operations, there are (n-1)^k possible sequences to check. Even for moderate n and k, this becomes astronomically large.

For example, with n=10 and k=5, we'd have 9^5 = 59,049 sequences to check. With n=100 and k=20, we'd have 99^20 ≈ 8.2×10^39 sequences—completely infeasible.

What about a greedy brute force? We could try to always flip when we see a -1, but this doesn't guarantee minimal operations. We might flip in a suboptimal order and use more operations than necessary.

The brute force fails because it doesn't recognize the underlying structure: operations are commutative (order doesn't matter) and each operation toggles the parity of affected elements in a predictable way.

## Optimized Approach

The key insight comes from noticing two important properties:

1. **Operation effect on count of -1s:** Each operation flips exactly two elements. If both were -1, they become 1 (reducing -1 count by 2). If both were 1, they become -1 (increasing -1 count by 2). If one was 1 and one was -1, they swap (no change to total -1 count).

2. **Parity constraint:** Since each operation changes the total number of -1s by -2, 0, or +2, the parity (odd/even) of the -1 count never changes. If we start with an odd number of -1s, we'll always have an odd number.

This leads to our algorithm:

1. Count how many -1s are in the array.
2. To make all elements 1, we need to eliminate all -1s.
3. The most efficient way is to pair up -1s and flip adjacent pairs. Each such operation eliminates 2 -1s.
4. If we have `count` -1s, we need at least `count/2` operations (rounded up if we need to create an extra -1 then eliminate it).
5. But we also need to consider making all elements -1 instead! This would require turning all 1s into -1s.

Let's formalize:

- Let `count` = number of -1s in the array
- To make all 1s: We need to eliminate all -1s. If `count` is even, we need exactly `count/2` operations (pair and flip). If `count` is odd, we need to first create an extra -1 (by flipping two 1s), then eliminate all -1s: `(count+1)/2 + 1` operations.
- To make all -1s: Let `countOnes = n - count` (number of 1s). Similarly, if `countOnes` is even: `countOnes/2` operations; if odd: `(countOnes+1)/2 + 1` operations.

The answer is "YES" if `k` is at least the minimum of these two values.

Wait, there's a catch! When we have an odd count, that "+1" operation (flipping two 1s to create -1s) might not be possible if we don't have two adjacent 1s. But in our array of only 1 and -1, if we have an odd number of -1s and at least 2 elements, we can always find either two adjacent -1s to eliminate or two adjacent 1s to flip. Let's verify this with examples.

## Optimal Solution

The complete solution: Count the -1s. Calculate the minimum operations needed to make all 1s and all -1s. Return true if k is at least the smaller of these two values AND has the same parity as needed (since we can waste operations by flipping adjacent equal elements).

Actually, we need to handle one more subtlety: We can perform "wasteful" operations that don't change the array (flipping two 1s or two -1s twice). So if k is larger than needed but has different parity, we might still succeed if we can waste 2 operations. But since we can flip any adjacent pair, we can always waste 2 operations if n > 1.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def can_transform(nums, k):
    """
    Determines if we can make all elements equal with at most k operations.

    Args:
        nums: List[int] containing only 1 and -1
        k: int, maximum operations allowed

    Returns:
        bool: True if possible, False otherwise
    """
    n = len(nums)

    # Count number of -1s in the array
    count_neg = sum(1 for x in nums if x == -1)

    # Calculate minimum operations needed for both targets
    # Target: all 1s
    if count_neg % 2 == 0:
        # Even number of -1s: need count_neg/2 operations
        # Each operation eliminates 2 -1s
        ops_for_ones = count_neg // 2
    else:
        # Odd number of -1s: need to create an extra -1 then eliminate all
        # Step 1: Flip two 1s to create 2 more -1s (now count_neg + 2)
        # Step 2: Eliminate all (count_neg + 2)/2 = count_neg//2 + 1 operations
        # Total: count_neg//2 + 1 + 1 = count_neg//2 + 2
        ops_for_ones = count_neg // 2 + 2

    # Target: all -1s (count_neg is number of -1s, so ones = n - count_neg)
    count_ones = n - count_neg
    if count_ones % 2 == 0:
        # Even number of 1s: need count_ones/2 operations
        ops_for_neg_ones = count_ones // 2
    else:
        # Odd number of 1s: similar logic as above
        ops_for_neg_ones = count_ones // 2 + 2

    # We need k to be at least the minimum of the two
    min_ops = min(ops_for_ones, ops_for_neg_ones)

    # If k < min_ops, impossible
    if k < min_ops:
        return False

    # If k >= min_ops, check parity
    # We can waste 2 operations by flipping same pair twice
    # So if (k - min_ops) is even, we're good
    # OR if n > 1, we can always waste operations
    if (k - min_ops) % 2 == 0:
        return True

    # If parity doesn't match and we can't waste operations
    # Only case where we can't waste: n == 1 (no adjacent pair to flip)
    # But if n == 1, array is already all equal with 0 operations
    # So for n == 1, we only need k >= 0
    if n == 1:
        return k >= 0

    # For n > 1, we can waste 2 operations
    # So we need to check if we can adjust by 2
    return k >= min_ops + 2
```

```javascript
// Time: O(n) | Space: O(1)
function canTransform(nums, k) {
  const n = nums.length;

  // Count number of -1s in the array
  let countNeg = 0;
  for (let i = 0; i < n; i++) {
    if (nums[i] === -1) {
      countNeg++;
    }
  }

  // Calculate minimum operations needed for all 1s
  let opsForOnes;
  if (countNeg % 2 === 0) {
    // Even number of -1s: need countNeg/2 operations
    opsForOnes = Math.floor(countNeg / 2);
  } else {
    // Odd number of -1s: need to create extra -1 then eliminate
    opsForOnes = Math.floor(countNeg / 2) + 2;
  }

  // Calculate minimum operations needed for all -1s
  const countOnes = n - countNeg;
  let opsForNegOnes;
  if (countOnes % 2 === 0) {
    // Even number of 1s: need countOnes/2 operations
    opsForNegOnes = Math.floor(countOnes / 2);
  } else {
    // Odd number of 1s: need to create extra 1 then eliminate
    opsForNegOnes = Math.floor(countOnes / 2) + 2;
  }

  // Minimum operations needed for either target
  const minOps = Math.min(opsForOnes, opsForNegOnes);

  // If k is less than minimum needed, impossible
  if (k < minOps) {
    return false;
  }

  // Check if we can achieve with exactly k operations
  // If difference is even, we can waste operations in pairs
  if ((k - minOps) % 2 === 0) {
    return true;
  }

  // Special case: single element array is already all equal
  if (n === 1) {
    return k >= 0;
  }

  // For arrays with more than 1 element, we can waste 2 operations
  // So check if we have room to waste 2 more
  return k >= minOps + 2;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean canTransform(int[] nums, int k) {
        int n = nums.length;

        // Count number of -1s in the array
        int countNeg = 0;
        for (int num : nums) {
            if (num == -1) {
                countNeg++;
            }
        }

        // Calculate minimum operations needed for all 1s
        int opsForOnes;
        if (countNeg % 2 == 0) {
            // Even number of -1s: need countNeg/2 operations
            opsForOnes = countNeg / 2;
        } else {
            // Odd number of -1s: need to create extra -1 then eliminate
            opsForOnes = countNeg / 2 + 2;
        }

        // Calculate minimum operations needed for all -1s
        int countOnes = n - countNeg;
        int opsForNegOnes;
        if (countOnes % 2 == 0) {
            // Even number of 1s: need countOnes/2 operations
            opsForNegOnes = countOnes / 2;
        } else {
            // Odd number of 1s: need to create extra 1 then eliminate
            opsForNegOnes = countOnes / 2 + 2;
        }

        // Minimum operations needed for either target
        int minOps = Math.min(opsForOnes, opsForNegOnes);

        // If k is less than minimum needed, impossible
        if (k < minOps) {
            return false;
        }

        // Check if we can achieve with exactly k operations
        // If difference is even, we can waste operations in pairs
        if ((k - minOps) % 2 == 0) {
            return true;
        }

        // Special case: single element array is already all equal
        if (n == 1) {
            return k >= 0;
        }

        // For arrays with more than 1 element, we can waste 2 operations
        // So check if we have room to waste 2 more
        return k >= minOps + 2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We make a single pass through the array to count the -1s. All subsequent calculations are constant time operations (arithmetic, comparisons).

**Space Complexity:** O(1)  
We only use a few integer variables to store counts and operation calculations. No additional data structures that scale with input size.

The linear time comes from the initial scan to count -1s. The constant space is because we don't store the array or any intermediate results—we process on the fly.

## Common Mistakes

1. **Only considering one target:** Candidates often try to make all elements 1s without considering that making all -1s might require fewer operations. Always check both possibilities.

2. **Ignoring parity constraints:** Forgetting that when the count of elements to flip is odd, you need extra operations to adjust the parity. The formula differs for even vs. odd counts.

3. **Not handling the "waste operations" case:** When k is larger than needed but has different parity, you can often still succeed by wasting operations (flipping the same pair twice). This requires at least 2 extra operations and n > 1.

4. **Overcomplicating with BFS/DFS:** Some candidates try to model this as a graph search problem, which is correct but inefficient. The mathematical insight about pairing elements is much more efficient.

## When You'll See This Pattern

This problem uses **parity reasoning** and **pairing strategies**, which appear in many combinatorial optimization problems:

1. **Minimum Domino Rotations (LeetCode 1007):** Similar parity constraints when trying to make all values in a row match.
2. **Bulb Switcher (LeetCode 319):** Uses parity of factors to determine final state.
3. **Minimum Operations to Make Array Equal (LeetCode 1551):** Mathematical approach to making array elements equal through operations on pairs.

The core pattern is recognizing when operations have symmetric effects and how they interact through parity constraints. When you see problems where each operation affects exactly two elements or has predictable effects on counts, think about parity and pairing strategies.

## Key Takeaways

1. **Operations on adjacent pairs often create parity constraints:** When each operation flips two elements, the parity (odd/even) of counts changes in predictable ways. Track how operations affect the total count of elements you care about.

2. **Always consider both transformation targets:** When trying to make all elements equal, check both possible final values (all 1s and all -1s in this case). The easier target might require fewer operations.

3. **Waste operations can help with parity mismatches:** If you need an even number of operations but have an odd k (or vice versa), you can often perform "wasteful" operations that cancel each other out, as long as you have enough operations to spare.

[Practice this problem on CodeJeet](/problem/transform-array-to-all-equal-elements)
