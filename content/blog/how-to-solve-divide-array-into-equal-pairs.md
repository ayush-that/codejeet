---
title: "How to Solve Divide Array Into Equal Pairs — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Divide Array Into Equal Pairs. Easy difficulty, 79.2% acceptance rate. Topics: Array, Hash Table, Bit Manipulation, Counting."
date: "2028-01-11"
category: "dsa-patterns"
tags: ["divide-array-into-equal-pairs", "array", "hash-table", "bit-manipulation", "easy"]
---

# How to Solve Divide Array Into Equal Pairs

This problem asks whether we can partition an array of `2 * n` integers into `n` pairs where each pair contains two equal numbers. While the concept is straightforward, the challenge lies in efficiently verifying that every number appears an even number of times. This is interesting because it reveals how counting problems can be solved with different trade-offs between time, space, and code simplicity.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 2, 3, 2, 2, 2]`

We need to check if we can form `n = 3` pairs (since there are 6 elements). For successful pairing:

- Each number must appear an even number of times
- We can pair equal numbers together

Step-by-step counting:

- Number 3 appears twice → can form 1 pair (3,3)
- Number 2 appears four times → can form 2 pairs (2,2) and (2,2)

Since all counts are even, we can form 3 total pairs. The actual pairing arrangement doesn't matter as long as each element is paired with an equal element.

Now consider a failing example: `nums = [1, 2, 3, 4]`

- Number 1 appears once → cannot form a pair
- Number 2 appears once → cannot form a pair
- Number 3 appears once → cannot form a pair
- Number 4 appears once → cannot form a pair

Since all counts are odd, we cannot form any valid pairs.

The key insight: **We can form valid pairs if and only if every integer in the array appears an even number of times.**

## Brute Force Approach

A naive approach would be to try all possible pairings, but with `2n` elements, the number of possible pairings grows factorially. Even for small `n`, this becomes computationally infeasible.

What a candidate might initially consider:

1. Sort the array and check adjacent pairs
2. But this only works if equal numbers are adjacent after sorting
3. We still need to verify all numbers appear in pairs

Actually, the sorting approach leads to a reasonable O(n log n) solution, but we can do better with O(n) time using a hash map. The truly brute force would be to generate all permutations and check each one, which is O((2n)!) - completely impractical.

## Optimal Solution

The optimal solution uses a hash map (or dictionary) to count frequencies. After counting, we simply check if all frequencies are even. An even more space-efficient approach uses XOR bit manipulation, but the hash map solution is more intuitive and easier to explain in an interview.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def divideArray(nums):
    """
    Determines if the array can be divided into equal pairs.

    Approach:
    1. Count frequency of each number using a dictionary
    2. Check if all frequencies are even
    3. If any frequency is odd, return False

    Args:
        nums: List of integers with length 2 * n

    Returns:
        True if array can be divided into n equal pairs, False otherwise
    """
    # Step 1: Create frequency counter
    freq = {}

    # Step 2: Count occurrences of each number
    for num in nums:
        # Increment count for current number
        # Using get() with default value 0 if num not in dictionary
        freq[num] = freq.get(num, 0) + 1

    # Step 3: Check if all frequencies are even
    for count in freq.values():
        # If any count is odd, we cannot form pairs
        if count % 2 != 0:
            return False

    # Step 4: All counts are even, so we can form pairs
    return True
```

```javascript
// Time: O(n) | Space: O(n)
function divideArray(nums) {
  /**
   * Determines if the array can be divided into equal pairs.
   *
   * Approach:
   * 1. Count frequency of each number using a Map
   * 2. Check if all frequencies are even
   * 3. If any frequency is odd, return false
   *
   * @param {number[]} nums - Array of integers with length 2 * n
   * @return {boolean} True if array can be divided into n equal pairs
   */

  // Step 1: Create frequency counter
  const freq = new Map();

  // Step 2: Count occurrences of each number
  for (const num of nums) {
    // Get current count or 0 if not in map, then increment
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 3: Check if all frequencies are even
  for (const count of freq.values()) {
    // If any count is odd, we cannot form pairs
    if (count % 2 !== 0) {
      return false;
    }
  }

  // Step 4: All counts are even, so we can form pairs
  return true;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public boolean divideArray(int[] nums) {
        /**
         * Determines if the array can be divided into equal pairs.
         *
         * Approach:
         * 1. Count frequency of each number using a HashMap
         * 2. Check if all frequencies are even
         * 3. If any frequency is odd, return false
         *
         * @param nums Array of integers with length 2 * n
         * @return True if array can be divided into n equal pairs
         */

        // Step 1: Create frequency counter
        Map<Integer, Integer> freq = new HashMap<>();

        // Step 2: Count occurrences of each number
        for (int num : nums) {
            // Increment count for current number
            // Using getOrDefault to handle numbers not yet in map
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 3: Check if all frequencies are even
        for (int count : freq.values()) {
            // If any count is odd, we cannot form pairs
            if (count % 2 != 0) {
                return false;
            }
        }

        // Step 4: All counts are even, so we can form pairs
        return true;
    }
}
```

</div>

**Alternative XOR Solution:** There's a clever bit manipulation approach using XOR. Since XOR of a number with itself is 0, if we XOR all numbers together and get 0, it suggests all numbers appear in pairs. However, this approach has a flaw: `a XOR a XOR b XOR b = 0` works, but `a XOR a XOR a XOR a = 0` also works even though we have 4 of the same number. The XOR approach only tells us if the overall XOR is 0, not if each number appears an even number of times. For example, `[1, 1, 2, 2, 3, 3]` gives XOR 0, but so does `[1, 1, 1, 1, 2, 2, 2, 2]`. The XOR approach would incorrectly return true for arrays where some numbers appear 4 times and others appear 0 times. Stick with the frequency counting approach for correctness.

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once to count frequencies: O(n)
- We iterate through the frequency map values once: O(k) where k ≤ n
- Total: O(n + k) = O(n) since k ≤ n

**Space Complexity: O(n)**

- In the worst case, all numbers are distinct, so our frequency map stores n entries
- Each entry stores an integer and its count
- Total space: O(n)

The hash map approach gives us the best possible time complexity for this problem since we must examine every element at least once to determine if pairs can be formed.

## Common Mistakes

1. **Not checking array length constraint**: The problem states the array has `2 * n` elements, but some candidates forget that `n` must be an integer. If the array has odd length, we immediately know we can't form pairs, but the problem guarantees even length.

2. **Using XOR incorrectly**: As mentioned earlier, using XOR to check if the result is 0 doesn't guarantee each number appears in pairs. For example, `[1, 1, 1, 1, 2, 2]` XORs to 0 but has 4 ones and 2 twos - we can't form 3 pairs from this.

3. **Sorting without proper pairing logic**: Some candidates sort and then check adjacent elements, but they might incorrectly assume pairs must be adjacent after sorting. They need to verify they're actually pairing equal elements, not just checking `nums[i] == nums[i+1]` for all i.

4. **Early termination without full check**: When using a frequency map, some candidates return `True` as soon as they find one even count, but we need to check ALL counts are even.

## When You'll See This Pattern

This frequency counting pattern appears in many LeetCode problems:

1. **Sort Array by Increasing Frequency (Easy)**: Similar frequency counting, but then sorting by frequency rather than checking for even counts.

2. **Single Number (Easy)**: Uses XOR to find the element that appears exactly once when all others appear twice - a variation of the pairing concept.

3. **Majority Element (Easy)**: Uses frequency counting (or the Boyer-Moore algorithm) to find elements that appear more than n/2 times.

4. **Find All Duplicates in an Array (Medium)**: Requires identifying elements that appear exactly twice.

The core pattern is: **When you need to track occurrences or relationships between elements, consider frequency counting with hash maps.** This approach transforms problems about relationships into problems about counting, which are often easier to solve.

## Key Takeaways

1. **Frequency counting solves many "pairing" and "occurrence" problems**: When a problem asks about whether elements can be paired, grouped, or whether certain counts exist, reach for a hash map to track frequencies.

2. **Even/odd parity matters in pairing problems**: For elements to be paired completely, each must appear an even number of times. This simple parity check often provides the solution.

3. **Consider constraints when choosing approach**: While sorting gives O(n log n) time, hash maps give O(n) time at the cost of O(n) space. In interviews, discuss both options and their trade-offs.

4. **Test with edge cases**: Always test with arrays containing all same numbers, all different numbers, and mixed counts to ensure your solution handles all scenarios.

Related problems: [Sort Array by Increasing Frequency](/problem/sort-array-by-increasing-frequency), [Distribute Elements Into Two Arrays I](/problem/distribute-elements-into-two-arrays-i), [Distribute Elements Into Two Arrays II](/problem/distribute-elements-into-two-arrays-ii)
