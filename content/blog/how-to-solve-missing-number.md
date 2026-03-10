---
title: "How to Solve Missing Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Missing Number. Easy difficulty, 71.7% acceptance rate. Topics: Array, Hash Table, Math, Binary Search, Bit Manipulation."
date: "2026-03-11"
category: "dsa-patterns"
tags: ["missing-number", "array", "hash-table", "math", "easy"]
---

# How to Solve Missing Number

You're given an array containing `n` distinct numbers from the range `[0, n]`. Since there are `n+1` numbers in that range but only `n` spots in the array, exactly one number is missing. Your task is to find and return that missing number.

What makes this problem interesting is that it has multiple valid solutions with different trade-offs, and it's a great example of how mathematical insight can dramatically simplify a problem. The "obvious" solution isn't always the most efficient one.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [3, 0, 1]` with `n = 3`. The range `[0, 3]` contains the numbers `{0, 1, 2, 3}`.

**Step 1: Sort the numbers mentally**  
Sorted: `[0, 1, 3]`

**Step 2: Check each position**

- Position 0: Should be 0, we have 0 ✓
- Position 1: Should be 1, we have 1 ✓
- Position 2: Should be 2, we have 3 ✗ → Found it!

The missing number is 2.

But sorting takes O(n log n) time. Can we do better? Let's think mathematically:  
The sum of numbers from 0 to n is `n*(n+1)/2`. For n=3, that's `3*4/2 = 6`.  
Our array sum is `3 + 0 + 1 = 4`.  
Missing number = `6 - 4 = 2`.

Even better: using XOR properties. If we XOR all numbers from 0 to n, then XOR with all numbers in the array, matching pairs cancel out, leaving only the missing number.

## Brute Force Approach

The most straightforward approach is to check for each number from 0 to n whether it exists in the array:

1. For each number `i` from 0 to n
2. Check if `i` exists in the array (linear search)
3. Return the first `i` that's not found

This takes O(n²) time because for each of n+1 numbers, we might scan the entire array of size n. The space is O(1), but the time complexity is unacceptable for large inputs.

A slightly better brute force would sort first (O(n log n)), then scan to find the gap. But we can do even better.

## Optimal Solution

We'll explore three optimal approaches, each with O(n) time and O(1) space (except the hash table version which uses O(n) space).

### Approach 1: Mathematical (Sum Formula)

Calculate the expected sum of numbers 0 to n, subtract the actual sum of the array.

### Approach 2: Bit Manipulation (XOR)

Use the property that `a ^ a = 0` and `a ^ 0 = a`. XOR all numbers from 0 to n, then XOR with all numbers in the array.

### Approach 3: Hash Table

Store all numbers in a hash set, then check for each number from 0 to n.

Here are implementations of all three approaches:

<div class="code-group">

```python
# Approach 1: Mathematical (Sum Formula)
# Time: O(n) | Space: O(1)
def missingNumber(nums):
    """
    Calculate expected sum of 0 to n using formula n*(n+1)/2,
    then subtract actual sum to find missing number.
    """
    n = len(nums)
    expected_sum = n * (n + 1) // 2  # Sum of numbers from 0 to n
    actual_sum = sum(nums)           # Sum of numbers in array
    return expected_sum - actual_sum  # Difference is missing number


# Approach 2: Bit Manipulation (XOR)
# Time: O(n) | Space: O(1)
def missingNumberXOR(nums):
    """
    XOR all numbers from 0 to n, then XOR with array elements.
    Pairs cancel out (a ^ a = 0), leaving only the missing number.
    """
    missing = len(nums)  # Start with n (last number in range)

    # XOR missing with all indices and values
    for i, num in enumerate(nums):
        missing ^= i ^ num  # XOR index i and value num

    # After loop: missing = n ^ (0^0) ^ (1^1) ^ ... ^ (missing^?)
    # All pairs cancel except the missing number
    return missing


# Approach 3: Hash Table
# Time: O(n) | Space: O(n)
def missingNumberHash(nums):
    """
    Store all numbers in a set for O(1) lookups,
    then check each number from 0 to n.
    """
    num_set = set(nums)  # Convert list to set for fast lookups

    # Check each number from 0 to n
    for num in range(len(nums) + 1):
        if num not in num_set:
            return num

    # Should never reach here given problem constraints
    return -1
```

```javascript
// Approach 1: Mathematical (Sum Formula)
// Time: O(n) | Space: O(1)
function missingNumber(nums) {
  // Calculate expected sum using formula n*(n+1)/2
  const n = nums.length;
  let expectedSum = (n * (n + 1)) / 2;

  // Calculate actual sum of array elements
  let actualSum = 0;
  for (let i = 0; i < n; i++) {
    actualSum += nums[i];
  }

  // Difference is the missing number
  return expectedSum - actualSum;
}

// Approach 2: Bit Manipulation (XOR)
// Time: O(n) | Space: O(1)
function missingNumberXOR(nums) {
  // Start with n (last number in range 0 to n)
  let missing = nums.length;

  // XOR with each index and value
  for (let i = 0; i < nums.length; i++) {
    missing ^= i ^ nums[i];
    // i represents the expected number at position i
    // nums[i] is the actual number at position i
  }

  // All pairs (expected ^ actual) cancel out except for missing number
  return missing;
}

// Approach 3: Hash Table
// Time: O(n) | Space: O(n)
function missingNumberHash(nums) {
  // Create a Set for O(1) lookups
  const numSet = new Set(nums);

  // Check each number from 0 to n
  for (let i = 0; i <= nums.length; i++) {
    if (!numSet.has(i)) {
      return i;
    }
  }

  // Should never reach here
  return -1;
}
```

```java
// Approach 1: Mathematical (Sum Formula)
// Time: O(n) | Space: O(1)
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        // Calculate expected sum: 0 + 1 + 2 + ... + n
        int expectedSum = n * (n + 1) / 2;

        // Calculate actual sum of array
        int actualSum = 0;
        for (int num : nums) {
            actualSum += num;
        }

        // Missing number = expected - actual
        return expectedSum - actualSum;
    }
}

// Approach 2: Bit Manipulation (XOR)
// Time: O(n) | Space: O(1)
class Solution {
    public int missingNumber(int[] nums) {
        int missing = nums.length; // Start with n

        // XOR with each index and value
        for (int i = 0; i < nums.length; i++) {
            missing ^= i ^ nums[i];
            // i is the expected number at position i
            // nums[i] is the actual number at position i
        }

        // After loop: all pairs cancel, leaving missing number
        return missing;
    }
}

// Approach 3: Hash Table
// Time: O(n) | Space: O(n)
import java.util.HashSet;

class Solution {
    public int missingNumber(int[] nums) {
        HashSet<Integer> numSet = new HashSet<>();

        // Add all numbers to hash set
        for (int num : nums) {
            numSet.add(num);
        }

        // Check each number from 0 to n
        for (int i = 0; i <= nums.length; i++) {
            if (!numSet.contains(i)) {
                return i;
            }
        }

        // Should never reach here
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Approach 1 (Sum Formula):**

- **Time:** O(n) - We need to calculate the sum of all elements
- **Space:** O(1) - We only use a few variables

**Approach 2 (XOR):**

- **Time:** O(n) - Single pass through the array
- **Space:** O(1) - Constant extra space

**Approach 3 (Hash Table):**

- **Time:** O(n) - Building the set takes O(n), checking takes O(n)
- **Space:** O(n) - Need to store all elements in a hash set

**Which approach is best?**

- **Sum formula** is simplest and usually fastest in practice
- **XOR** avoids potential integer overflow issues with large sums
- **Hash table** is easiest to understand but uses extra space

## Common Mistakes

1. **Off-by-one errors with n:** Remember the array has length n, but the range is [0, n], which has n+1 numbers. A common mistake is to loop from 0 to n-1 instead of 0 to n.

2. **Integer overflow with sum formula:** For large n (around 10^5), n\*(n+1) can exceed 32-bit integer limits. Use 64-bit integers or the XOR approach to avoid this. In Python, integers are arbitrary precision, so this isn't an issue.

3. **Forgetting the array is unsorted:** Don't assume the array is sorted! The problem doesn't state this, and your solution should work regardless of order.

4. **Incorrect XOR initialization:** In the XOR solution, you must start with `missing = n` (not 0) because we need to XOR all numbers from 0 to n. If you start with 0, you're missing n in the XOR chain.

## When You'll See This Pattern

The techniques used here appear in many other problems:

1. **Single Number** - Uses the same XOR trick to find the only non-duplicate in an array where every other number appears twice.

2. **First Missing Positive** - A harder variation where you need to find the smallest missing positive integer, often solved using index manipulation similar to the XOR approach.

3. **Find the Duplicate Number** - Another variation where instead of a missing number, you have an extra duplicate number in the array.

4. **Counting Elements** - Problems that involve finding missing or duplicate elements often use similar mathematical or bit manipulation approaches.

The key insight is that when dealing with ranges of numbers, you can often use mathematical properties (sums, XOR) rather than just checking each element.

## Key Takeaways

1. **Mathematical insight beats brute force:** Instead of checking each number (O(n²)), use the sum formula or XOR properties to solve in O(n) time.

2. **XOR is a powerful tool for finding missing/duplicate numbers:** The property that `a ^ a = 0` and `a ^ 0 = a` makes XOR ideal for problems where numbers should appear in pairs.

3. **Consider integer overflow:** For large inputs, multiplication in the sum formula can overflow. XOR avoids this issue entirely.

4. **Multiple valid approaches exist:** In interviews, mention different approaches even if you implement one. It shows deeper understanding of the problem space.

**Related problems:** [First Missing Positive](/problem/first-missing-positive), [Single Number](/problem/single-number), [Find the Duplicate Number](/problem/find-the-duplicate-number)
