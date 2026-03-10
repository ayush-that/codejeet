---
title: "How to Solve Split the Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Split the Array. Easy difficulty, 60.9% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2027-11-05"
category: "dsa-patterns"
tags: ["split-the-array", "array", "hash-table", "counting", "easy"]
---

# How to Solve Split the Array

You need to split an even-length array into two equal halves where each half contains only distinct elements. The challenge is determining if such a split is possible at all, which depends entirely on the frequency of each element in the original array.

What makes this problem interesting is that you don't actually need to construct the two halves—you just need to check if it's possible. The key insight is that if any element appears more than twice, it's impossible to split because you'd have to place at least two identical elements in the same half. Conversely, if all elements appear at most twice, you can always find a valid split.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 1, 2, 3, 4, 4]`

**Step 1: Count element frequencies**

- 1 appears 2 times
- 2 appears 1 time
- 3 appears 1 time
- 4 appears 2 times

**Step 2: Check the critical condition**
We need to split 6 elements into two groups of 3. Each group must have distinct elements. The problem arises if any element appears more than 2 times—we'd have to put at least 2 identical elements in the same group.

In our example:

- All elements appear at most 2 times ✓

**Step 3: Verify it's always possible when condition is met**
When no element appears more than twice, we can always find a valid split. Here's one possible arrangement:

- Group 1: [1, 2, 4] (all distinct)
- Group 2: [1, 3, 4] (all distinct)

The elements that appear twice (1 and 4) get split with one copy in each group. Elements that appear once (2 and 3) can go in either group as long as we maintain distinctness.

Now consider a counterexample: `nums = [1, 1, 1, 2, 3, 4]`

- 1 appears 3 times (> 2)
- This is impossible because we'd have to put at least 2 copies of 1 in the same group of 3, violating the distinctness requirement.

## Brute Force Approach

A naive approach would try to generate all possible splits and check each one. For an array of length n, we'd need to:

1. Generate all combinations of n/2 elements from n (there are C(n, n/2) combinations)
2. For each combination, check if both the selected and remaining halves have all distinct elements

This approach has factorial time complexity O(n! / ((n/2)! × (n/2)!)), which is astronomically large even for moderate n. For n=20, that's already 184,756 combinations to check. Clearly, we need a smarter approach.

The brute force fails because it doesn't recognize the simple frequency-based condition that determines feasibility. We're doing unnecessary work by actually constructing splits when we just need to check a simple condition.

## Optimal Solution

The optimal solution uses a frequency counter. We count how many times each element appears, then check if any element appears more than twice. If so, return false. Otherwise, return true.

Why does this work? Let's think about it:

- Each half has n/2 elements
- If an element appears k > 2 times, then by the pigeonhole principle, at least ⌈k/2⌉ copies must go in one half
- Since k > 2, ⌈k/2⌉ ≥ 2, meaning at least 2 identical elements would end up in the same half
- This violates the distinctness requirement
- Conversely, if all k ≤ 2, we can always split: put one copy of each double in each half, and distribute singles arbitrarily

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def isPossibleToSplit(nums):
    """
    Determines if nums can be split into two equal halves
    where each half contains only distinct elements.

    Args:
        nums: List[int] - array of even length

    Returns:
        bool - True if split is possible, False otherwise
    """
    # Step 1: Count frequency of each element
    # We use a dictionary to track how many times each number appears
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Check if any element appears more than twice
    # If any count > 2, we cannot split the array as required
    for count in freq.values():
        if count > 2:
            return False

    # Step 3: If we get here, all counts are ≤ 2
    # This means we can always find a valid split
    return True
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Determines if nums can be split into two equal halves
 * where each half contains only distinct elements.
 *
 * @param {number[]} nums - array of even length
 * @return {boolean} - True if split is possible, False otherwise
 */
function isPossibleToSplit(nums) {
  // Step 1: Count frequency of each element
  // We use a Map to track how many times each number appears
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Check if any element appears more than twice
  // If any count > 2, we cannot split the array as required
  for (const count of freq.values()) {
    if (count > 2) {
      return false;
    }
  }

  // Step 3: If we get here, all counts are ≤ 2
  // This means we can always find a valid split
  return true;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Determines if nums can be split into two equal halves
     * where each half contains only distinct elements.
     *
     * @param nums - array of even length
     * @return true if split is possible, false otherwise
     */
    public boolean isPossibleToSplit(int[] nums) {
        // Step 1: Count frequency of each element
        // We use a HashMap to track how many times each number appears
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 2: Check if any element appears more than twice
        // If any count > 2, we cannot split the array as required
        for (int count : freq.values()) {
            if (count > 2) {
                return false;
            }
        }

        // Step 3: If we get here, all counts are ≤ 2
        // This means we can always find a valid split
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once to count frequencies: O(n)
- We iterate through the frequency map values once: O(k) where k ≤ n
- Total: O(n + k) = O(n) since k ≤ n

**Space Complexity: O(n)**

- In the worst case, all elements are distinct, so our frequency map stores n entries
- Even if elements repeat, we still need O(n) space for the map in the worst case

The space complexity could be optimized to O(1) if we could sort the array in-place and check frequencies, but that would require O(n log n) time for sorting. The hash map approach gives us the best time complexity.

## Common Mistakes

1. **Actually trying to construct the split**: Many candidates waste time trying to actually build the two halves. The problem only asks if it's _possible_, not to produce an actual split. Recognizing this saves time and complexity.

2. **Checking for count > n/2 instead of count > 2**: Some candidates think "if an element appears more than half the array length, it's impossible." While technically correct, it's not the tightest bound. An element appearing 3 times in a 10-element array (n/2 = 5) is already impossible because 3 > 2.

3. **Forgetting that the array length is even**: The problem guarantees even length, but some candidates add unnecessary checks. While defensive programming is good, in interviews it's better to mention the assumption and move on.

4. **Using arrays instead of hash maps for counting when value range is large**: If the problem said nums[i] ≤ 1000, an array of size 1001 would work. But without that constraint, hash maps are safer and more general.

## When You'll See This Pattern

This frequency counting pattern appears in many problems:

1. **Majority Element (LeetCode 169)**: Find the element that appears more than n/2 times. Similar frequency counting, but with a different threshold.

2. **Contains Duplicate (LeetCode 217)**: Check if any element appears at least twice. This is essentially checking if any count > 1.

3. **Divide Array Into Equal Pairs (LeetCode 2206)**: Check if you can divide the array into n/2 pairs where each pair has equal elements. This requires checking if all counts are even.

4. **Sort Characters By Frequency (LeetCode 451)**: Sort string by character frequency. Uses frequency counting then sorting by frequency.

The core technique—using a hash map to count frequencies and then checking conditions on those counts—is fundamental to many array and string problems.

## Key Takeaways

1. **Don't solve harder than necessary**: The problem asks if a split is _possible_, not to produce one. This changes the solution from combinatorial (trying all splits) to simple (checking a frequency condition).

2. **Frequency analysis often simplifies problems**: When dealing with constraints about element repetition, counting frequencies is usually the first step toward a solution.

3. **The pigeonhole principle is powerful**: The insight that "if an element appears 3+ times, at least 2 must go in the same half" is an application of the pigeonhole principle. Recognizing such combinatorial constraints can simplify many problems.

[Practice this problem on CodeJeet](/problem/split-the-array)
