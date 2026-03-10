---
title: "How to Solve 4Sum II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode 4Sum II. Medium difficulty, 57.8% acceptance rate. Topics: Array, Hash Table."
date: "2027-08-22"
category: "dsa-patterns"
tags: ["4sum-ii", "array", "hash-table", "medium"]
---

## How to Solve 4Sum II

You're given four integer arrays of equal length `n`. You need to count how many index combinations `(i, j, k, l)` satisfy `nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0`. The challenge is that with `n` up to 200, a brute force check of all `n⁴` combinations would be impossibly slow. This problem is interesting because it teaches you how to trade space for time using hash maps to reduce a 4-sum problem to a 2-sum problem.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
nums1 = [1, 2]
nums2 = [-2, -1]
nums3 = [-1, 2]
nums4 = [0, 2]
```

We need to find all index combinations where the sum equals 0. Instead of checking all 2×2×2×2 = 16 combinations, we can be smarter:

1. **Step 1: Combine nums1 and nums2**
   - Calculate all possible sums from nums1 and nums2:
     - nums1[0] + nums2[0] = 1 + (-2) = -1
     - nums1[0] + nums2[1] = 1 + (-1) = 0
     - nums1[1] + nums2[0] = 2 + (-2) = 0
     - nums1[1] + nums2[1] = 2 + (-1) = 1

2. **Step 2: Store these sums in a hash map**
   - Count how many times each sum appears:
     - {-1: 1, 0: 2, 1: 1}

3. **Step 3: Combine nums3 and nums4**
   - Calculate all possible sums from nums3 and nums4:
     - nums3[0] + nums4[0] = -1 + 0 = -1
     - nums3[0] + nums4[1] = -1 + 2 = 1
     - nums3[1] + nums4[0] = 2 + 0 = 2
     - nums3[1] + nums4[1] = 2 + 2 = 4

4. **Step 4: Check for complements**
   - For each sum from nums3+nums4, we need its complement to make 0:
     - If sum = -1, we need complement = 1 (since -1 + 1 = 0)
       - Hash map shows 1 appears 1 time → add 1 to count
     - If sum = 1, we need complement = -1 → hash map shows -1 appears 1 time → add 1
     - If sum = 2, we need complement = -2 → not in hash map → add 0
     - If sum = 4, we need complement = -4 → not in hash map → add 0

5. **Step 5: Total count**
   - 1 + 1 + 0 + 0 = 2 valid tuples

Let's verify one valid combination: `(i=0, j=1, k=0, l=0)` gives 1 + (-1) + (-1) + 0 = -1? Wait, that's not 0. Let me recalculate: Actually, 1 + (-1) = 0, plus (-1) = -1, plus 0 = -1. That's wrong. Let me trace more carefully:

Actually, the correct combinations are:

- (0,0,0,1): 1 + (-2) + (-1) + 2 = 0 ✓
- (1,1,0,0): 2 + (-1) + (-1) + 0 = 0 ✓

So our hash map approach correctly found 2 solutions without checking all 16 combinations.

## Brute Force Approach

The most straightforward solution is to check all possible index combinations using four nested loops:

<div class="code-group">

```python
# Time: O(n⁴) | Space: O(1)
def fourSumCountBruteForce(nums1, nums2, nums3, nums4):
    n = len(nums1)
    count = 0

    # Check all possible index combinations
    for i in range(n):
        for j in range(n):
            for k in range(n):
                for l in range(n):
                    if nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0:
                        count += 1

    return count
```

```javascript
// Time: O(n⁴) | Space: O(1)
function fourSumCountBruteForce(nums1, nums2, nums3, nums4) {
  const n = nums1.length;
  let count = 0;

  // Check all possible index combinations
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        for (let l = 0; l < n; l++) {
          if (nums1[i] + nums2[j] + nums3[k] + nums4[l] === 0) {
            count++;
          }
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n⁴) | Space: O(1)
public int fourSumCountBruteForce(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
    int n = nums1.length;
    int count = 0;

    // Check all possible index combinations
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                for (int l = 0; l < n; l++) {
                    if (nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With `n = 200`, we'd need to check 200⁴ = 1.6 billion combinations. At 1 million operations per second, this would take about 27 minutes — far too slow for LeetCode's constraints. We need a more efficient approach.

## Optimized Approach

The key insight is that we can split the problem into two halves:

1. Calculate all possible sums from `nums1` and `nums2`, storing them in a hash map with their frequencies.
2. For each sum from `nums3` and `nums4`, check if its complement exists in the hash map.

This transforms an O(n⁴) problem into O(n²) by trading space for time. Here's the reasoning:

- **Step 1: Reduce 4 arrays to 2 groups**
  - Group A: All sums from nums1[i] + nums2[j] (n² possibilities)
  - Group B: All sums from nums3[k] + nums4[l] (n² possibilities)
- **Step 2: Use hash map for fast lookup**
  - Store all sums from Group A in a hash map with their counts
  - For each sum in Group B, we need to find if `-sum` exists in Group A
  - If `-sum` appears `count` times in Group A, then we have `count` valid combinations for that particular Group B sum

- **Step 3: Why this works**
  - We're essentially solving: `(nums1[i] + nums2[j]) + (nums3[k] + nums4[l]) = 0`
  - Which is equivalent to: `(nums1[i] + nums2[j]) = -(nums3[k] + nums4[l])`
  - So for each sum from the first two arrays, we look for its negative in the sums from the last two arrays

This approach is a classic example of the **meet-in-the-middle** technique, where we split the problem in half to reduce exponential time complexity.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²)
def fourSumCount(nums1, nums2, nums3, nums4):
    """
    Counts the number of tuples (i, j, k, l) such that
    nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.

    Approach: Split into two groups and use hash map for O(1) lookups.
    """
    # Step 1: Create a hash map to store sums from nums1 and nums2
    # Key: sum of nums1[i] + nums2[j]
    # Value: how many times this sum occurs
    sum_map = {}

    # Step 2: Calculate all possible sums from nums1 and nums2
    # This gives us n² combinations
    for num1 in nums1:
        for num2 in nums2:
            current_sum = num1 + num2
            # Increment count for this sum, or initialize to 1 if not seen
            sum_map[current_sum] = sum_map.get(current_sum, 0) + 1

    # Step 3: Initialize counter for valid tuples
    count = 0

    # Step 4: For each sum from nums3 and nums4, check if complement exists
    # We need nums3[k] + nums4[l] = - (nums1[i] + nums2[j])
    # So we look for the negative of current sum in our hash map
    for num3 in nums3:
        for num4 in nums4:
            current_sum = num3 + num4
            complement = -current_sum  # What we need from first two arrays

            # If complement exists in our map, add its count to total
            # Each occurrence of complement represents a valid combination
            if complement in sum_map:
                count += sum_map[complement]

    return count
```

```javascript
// Time: O(n²) | Space: O(n²)
function fourSumCount(nums1, nums2, nums3, nums4) {
  /**
   * Counts the number of tuples (i, j, k, l) such that
   * nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.
   *
   * Approach: Split into two groups and use hash map for O(1) lookups.
   */
  // Step 1: Create a hash map to store sums from nums1 and nums2
  const sumMap = new Map();

  // Step 2: Calculate all possible sums from nums1 and nums2
  for (const num1 of nums1) {
    for (const num2 of nums2) {
      const sum = num1 + num2;
      // Increment count for this sum
      sumMap.set(sum, (sumMap.get(sum) || 0) + 1);
    }
  }

  // Step 3: Initialize counter for valid tuples
  let count = 0;

  // Step 4: For each sum from nums3 and nums4, check if complement exists
  for (const num3 of nums3) {
    for (const num4 of nums4) {
      const sum = num3 + num4;
      const complement = -sum; // What we need from first two arrays

      // If complement exists in our map, add its count to total
      if (sumMap.has(complement)) {
        count += sumMap.get(complement);
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(n²)
public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
    /**
     * Counts the number of tuples (i, j, k, l) such that
     * nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.
     *
     * Approach: Split into two groups and use hash map for O(1) lookups.
     */
    // Step 1: Create a hash map to store sums from nums1 and nums2
    Map<Integer, Integer> sumMap = new HashMap<>();

    // Step 2: Calculate all possible sums from nums1 and nums2
    for (int num1 : nums1) {
        for (int num2 : nums2) {
            int sum = num1 + num2;
            // Increment count for this sum
            sumMap.put(sum, sumMap.getOrDefault(sum, 0) + 1);
        }
    }

    // Step 3: Initialize counter for valid tuples
    int count = 0;

    // Step 4: For each sum from nums3 and nums4, check if complement exists
    for (int num3 : nums3) {
        for (int num4 : nums4) {
            int sum = num3 + num4;
            int complement = -sum;  // What we need from first two arrays

            // If complement exists in our map, add its count to total
            if (sumMap.containsKey(complement)) {
                count += sumMap.get(complement);
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We have two nested loops for nums1×nums2: O(n²)
- We have two nested loops for nums3×nums4: O(n²)
- Hash map operations (insert and lookup) are O(1) on average
- Total: O(n²) + O(n²) = O(n²)

**Space Complexity: O(n²)**

- In the worst case, all n² sums from nums1 and nums2 could be distinct
- The hash map stores up to n² key-value pairs
- No other significant space usage

For n = 200, n² = 40,000 operations, which is efficient. Compare this to the brute force's 1.6 billion operations!

## Common Mistakes

1. **Forgetting to count frequencies, not just existence**
   - Wrong: Using a set instead of a map
   - Why: If the same sum appears multiple times from different index pairs, each is a distinct valid combination
   - Fix: Always store counts in a hash map, not just whether a sum exists

2. **Mixing up the complement sign**
   - Wrong: Looking for `current_sum` instead of `-current_sum`
   - Why: We need `nums1[i] + nums2[j] = -(nums3[k] + nums4[l])`
   - Fix: Always use `complement = -current_sum` when checking

3. **Assuming arrays have different lengths**
   - Wrong: Using different loop bounds for different arrays
   - Why: The problem states all arrays have the same length `n`
   - Fix: Use `n = len(nums1)` and use it for all loops

4. **Over-optimizing with early termination**
   - Wrong: Trying to sort arrays or use two-pointer technique
   - Why: We need all combinations, not just one. Sorting doesn't help when we need counts.
   - Fix: Stick with the hash map approach; it's already optimal for this problem

## When You'll See This Pattern

The "split and hash" or "meet-in-the-middle" pattern appears in several LeetCode problems:

1. **Two Sum (Easy)**
   - The classic problem that introduces the complement-in-hash-map pattern
   - Instead of splitting 4 arrays, you're finding two numbers in one array that sum to target

2. **4Sum II (this problem)**
   - Extends Two Sum to four arrays by splitting them into two groups
   - Demonstrates how to reduce O(n⁴) to O(n²) using hash maps

3. **Group Anagrams (Medium)**
   - Uses hash maps to group related items (anagrams) by a common key
   - Similar idea: transform each item to a canonical form, then group

4. **Subarray Sum Equals K (Medium)**
   - Uses prefix sums and hash maps to find subarrays summing to k
   - Similar pattern: track cumulative sums and look for complements

The core insight is recognizing when you can trade space (hash map storage) for time (reducing nested loops).

## Key Takeaways

1. **Split complex problems into simpler subproblems**
   - When faced with multiple arrays or high time complexity, consider splitting them into groups
   - The meet-in-the-middle technique can reduce exponential problems to polynomial time

2. **Hash maps are your best friend for counting problems**
   - When you need to track frequencies or check for complements, hash maps provide O(1) operations
   - Remember to store counts, not just existence, when combinations matter

3. **Look for mathematical relationships to simplify**
   - `a + b + c + d = 0` is equivalent to `a + b = -(c + d)`
   - This transformation is what enables the split into two independent problems

This problem teaches you to recognize when a multi-sum problem can be reduced to multiple Two Sum problems using hash maps — a powerful pattern that appears in many interview questions.

Related problems: [4Sum](/problem/4sum)
