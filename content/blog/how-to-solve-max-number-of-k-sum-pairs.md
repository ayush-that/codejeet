---
title: "How to Solve Max Number of K-Sum Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Max Number of K-Sum Pairs. Medium difficulty, 56.9% acceptance rate. Topics: Array, Hash Table, Two Pointers, Sorting."
date: "2027-03-13"
category: "dsa-patterns"
tags: ["max-number-of-k-sum-pairs", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve Max Number of K-Sum Pairs

This problem asks us to find the maximum number of pairs we can form from an array where each pair sums to exactly `k`. Once we use two numbers in a pair, we remove them from consideration for future pairs. What makes this interesting is that it's essentially the Two Sum problem, but instead of finding just one pair, we need to find the maximum number of non-overlapping pairs.

## Visual Walkthrough

Let's trace through an example: `nums = [3,1,3,4,3]` with `k = 6`

**Step 1:** We need pairs that sum to 6. Let's sort the array first: `[1,3,3,3,4]`

**Step 2:** Use two pointers:

- Left pointer at index 0 (value 1)
- Right pointer at index 4 (value 4)
- Sum = 1 + 4 = 5 (too small, move left pointer)

**Step 3:** Left pointer at index 1 (value 3), right at index 4 (value 4)

- Sum = 3 + 4 = 7 (too large, move right pointer)

**Step 4:** Left at index 1 (value 3), right at index 3 (value 3)

- Sum = 3 + 3 = 6 (perfect! Found a pair)
- Count = 1, move both pointers inward

**Step 5:** Left at index 2 (value 3), right at index 2 (same index)

- Pointers have crossed, we're done
- Total pairs = 1

But wait, we could have done better! Let's try a different approach with a hash map:

**Step 1:** Count frequencies: {3: 3, 1: 1, 4: 1}

**Step 2:** For each number `num`:

- If `num = 3`, complement = 6 - 3 = 3
- Since 3's complement is itself, we can pair two 3s together
- We have 3 occurrences of 3, so we can form ⌊3/2⌋ = 1 pair
- Mark 3 as used

**Step 3:** If `num = 1`, complement = 6 - 1 = 5

- 5 is not in our map, skip

**Step 4:** If `num = 4`, complement = 6 - 4 = 2

- 2 is not in our map, skip

**Step 5:** Total pairs = 1

Actually, let's think more carefully. With the hash map approach:

- When we see 3 (count = 3), complement = 3
- We can form min(3, 3) = 3 pairs? No, because each pair uses TWO numbers
- Actually, we can form ⌊3/2⌋ = 1 pair of (3,3)

But what about (3,3) and (3,3)? That would be 2 pairs using 4 threes, but we only have 3. So 1 pair is correct.

The key insight: We need to be careful when a number is its own complement!

## Brute Force Approach

A naive approach would be to try all possible pairs:

1. For each number at index i
2. For each number at index j > i
3. If nums[i] + nums[j] == k, remove both and increment count
4. Repeat until no more pairs can be found

This is extremely inefficient - O(n³) time in worst case because after removing a pair, we'd need to shift elements or create new arrays. Even without removal, checking all pairs is O(n²).

A slightly better brute force would be:

1. Sort the array
2. For each number, binary search for its complement
3. Remove both when found

But removal is still expensive, and we'd need to mark elements as used. This approach would be O(n² log n) in practice.

The main problem with brute force is that we don't track which numbers we've already used efficiently, leading to repeated work and expensive removals.

## Optimized Approach

The optimal solution uses one of two approaches:

**Approach 1: Hash Map (Frequency Counter)**

1. Count frequency of each number
2. For each unique number `num`:
   - Calculate `complement = k - num`
   - If complement exists in our frequency map:
     - If `num == complement`: we can pair it with itself, use ⌊count/2⌋ pairs
     - Otherwise: use `min(count, freq[complement])` pairs
   - Mark numbers as used to avoid double counting

**Approach 2: Two Pointers with Sorting**

1. Sort the array
2. Use two pointers: one at start, one at end
3. While left < right:
   - If sum == k: found a pair, move both pointers
   - If sum < k: move left pointer right (increase sum)
   - If sum > k: move right pointer left (decrease sum)

The hash map approach is more intuitive for those familiar with Two Sum, while the two-pointer approach is more space-efficient (O(1) extra space if we ignore the sort, or O(log n) for sort stack space).

## Optimal Solution

Here are both optimal approaches implemented:

<div class="code-group">

```python
# Approach 1: Hash Map (Frequency Counter)
# Time: O(n) | Space: O(n)
def maxOperations(nums, k):
    """
    Find maximum number of pairs that sum to k.

    Args:
        nums: List of integers
        k: Target sum

    Returns:
        Maximum number of operations (pairs)
    """
    freq = {}
    operations = 0

    # Count frequency of each number
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Try to form pairs
    for num in list(freq.keys()):  # Use list to avoid dictionary size change during iteration
        if freq[num] == 0:
            continue  # Skip numbers we've already used

        complement = k - num

        if complement in freq and freq[complement] > 0:
            if num == complement:
                # Special case: number pairs with itself
                # We can form floor(count/2) pairs
                pairs = freq[num] // 2
                operations += pairs
                freq[num] -= pairs * 2
            else:
                # Form pairs using min(count of num, count of complement)
                pairs = min(freq[num], freq[complement])
                operations += pairs
                freq[num] -= pairs
                freq[complement] -= pairs

    return operations


# Approach 2: Two Pointers with Sorting
# Time: O(n log n) | Space: O(1) or O(log n) for sort stack space
def maxOperationsTwoPointers(nums, k):
    """
    Alternative solution using two pointers after sorting.

    Args:
        nums: List of integers
        k: Target sum

    Returns:
        Maximum number of operations (pairs)
    """
    nums.sort()  # Sort the array to use two pointers
    left, right = 0, len(nums) - 1
    operations = 0

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == k:
            # Found a valid pair
            operations += 1
            left += 1    # Move left pointer right
            right -= 1   # Move right pointer left
        elif current_sum < k:
            # Sum is too small, need larger number
            left += 1
        else:
            # Sum is too large, need smaller number
            right -= 1

    return operations
```

```javascript
// Approach 1: Hash Map (Frequency Counter)
// Time: O(n) | Space: O(n)
function maxOperations(nums, k) {
  const freq = new Map();
  let operations = 0;

  // Count frequency of each number
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Try to form pairs
  for (const [num, count] of freq) {
    if (count === 0) continue;

    const complement = k - num;

    if (freq.has(complement) && freq.get(complement) > 0) {
      if (num === complement) {
        // Special case: number pairs with itself
        const pairs = Math.floor(count / 2);
        operations += pairs;
        freq.set(num, count - pairs * 2);
      } else {
        // Form pairs using min(count of num, count of complement)
        const complementCount = freq.get(complement);
        const pairs = Math.min(count, complementCount);
        operations += pairs;
        freq.set(num, count - pairs);
        freq.set(complement, complementCount - pairs);
      }
    }
  }

  return operations;
}

// Approach 2: Two Pointers with Sorting
// Time: O(n log n) | Space: O(1) or O(log n) for sort stack space
function maxOperationsTwoPointers(nums, k) {
  nums.sort((a, b) => a - b); // Sort the array
  let left = 0;
  let right = nums.length - 1;
  let operations = 0;

  while (left < right) {
    const currentSum = nums[left] + nums[right];

    if (currentSum === k) {
      // Found a valid pair
      operations++;
      left++; // Move left pointer right
      right--; // Move right pointer left
    } else if (currentSum < k) {
      // Sum is too small, need larger number
      left++;
    } else {
      // Sum is too large, need smaller number
      right--;
    }
  }

  return operations;
}
```

```java
// Approach 1: Hash Map (Frequency Counter)
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxOperations(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        int operations = 0;

        // Count frequency of each number
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Try to form pairs
        // Note: We need to iterate over a copy of key set to avoid concurrent modification
        for (int num : freq.keySet().toArray(new Integer[0])) {
            int count = freq.get(num);
            if (count == 0) continue;

            int complement = k - num;

            if (freq.containsKey(complement) && freq.get(complement) > 0) {
                if (num == complement) {
                    // Special case: number pairs with itself
                    int pairs = count / 2;  // Integer division gives floor
                    operations += pairs;
                    freq.put(num, count - pairs * 2);
                } else {
                    // Form pairs using min(count of num, count of complement)
                    int complementCount = freq.get(complement);
                    int pairs = Math.min(count, complementCount);
                    operations += pairs;
                    freq.put(num, count - pairs);
                    freq.put(complement, complementCount - pairs);
                }
            }
        }

        return operations;
    }
}

// Approach 2: Two Pointers with Sorting
// Time: O(n log n) | Space: O(1) or O(log n) for sort stack space
import java.util.Arrays;

class SolutionTwoPointers {
    public int maxOperations(int[] nums, int k) {
        Arrays.sort(nums);  // Sort the array
        int left = 0;
        int right = nums.length - 1;
        int operations = 0;

        while (left < right) {
            int currentSum = nums[left] + nums[right];

            if (currentSum == k) {
                // Found a valid pair
                operations++;
                left++;    // Move left pointer right
                right--;   // Move right pointer left
            } else if (currentSum < k) {
                // Sum is too small, need larger number
                left++;
            } else {
                // Sum is too large, need smaller number
                right--;
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Hash Map Approach:**

- **Time Complexity:** O(n) - We make two passes through the array: one to build the frequency map, and one to process pairs. Each operation on the hash map is O(1) average case.
- **Space Complexity:** O(n) - We store a frequency count for each unique number in the array.

**Two Pointers Approach:**

- **Time Complexity:** O(n log n) - Dominated by the sorting step. The two-pointer traversal is O(n).
- **Space Complexity:** O(1) or O(log n) - If we consider in-place sorting, it's O(1) extra space. However, some sorting algorithms (like quicksort) use O(log n) stack space for recursion.

**Trade-offs:** The hash map approach is faster (O(n) vs O(n log n)) but uses more space. The two-pointer approach is more space-efficient but slower due to sorting. In interviews, it's good to mention both and discuss the trade-off.

## Common Mistakes

1. **Double counting pairs:** When using a hash map, candidates often forget to mark numbers as used after forming pairs. For example, if we have `[1,1,1]` with `k=2`, we should only form 1 pair (using two 1s), not 3 pairs by reusing the same 1 multiple times.

2. **Handling the num == complement case incorrectly:** When a number pairs with itself (like `num=3`, `k=6`), we need to use `count // 2` pairs, not `min(count, freq[complement])` which would give us `min(3, 3) = 3` incorrectly.

3. **Modifying the hash map while iterating:** In some languages, modifying a collection while iterating over it causes errors. Always iterate over a copy of the keys or use an alternative approach.

4. **Forgetting to check if complement exists:** Always verify `freq.get(complement) > 0` before using it, not just `freq.containsKey(complement)`.

5. **Off-by-one errors in two-pointer approach:** When moving pointers after finding a match, remember to move BOTH pointers inward, not just one.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Two Sum Pattern:** The core idea of finding pairs that sum to a target appears in:
   - [Two Sum](/problem/two-sum) - Find one pair that sums to target
   - [3Sum](/problem/3sum) - Find triplets that sum to zero
   - [4Sum](/problem/4sum) - Find quadruplets that sum to target

2. **Frequency Counting with Hash Maps:** When you need to track counts of elements:
   - [Count Good Meals](/problem/count-good-meals) - Count pairs where sum is a power of two
   - [Divide Players Into Teams of Equal Skill](/problem/divide-players-into-teams-of-equal-skill) - Pair players with complementary skills

3. **Two Pointers on Sorted Arrays:** When the array can be sorted to enable efficient pairing:
   - [Container With Most Water](/problem/container-with-most-water) - Find maximum area
   - [3Sum Closest](/problem/3sum-closest) - Find triplet with sum closest to target

## Key Takeaways

1. **Recognize the Two Sum pattern:** When a problem asks for pairs with a specific sum (especially with removal/usage constraints), think of hash maps for O(n) solutions or sorting + two pointers for O(n log n) solutions.

2. **Handle special cases carefully:** When an element can pair with itself (`num == k - num`), you need different logic than when pairing distinct elements. Always test with examples where numbers repeat.

3. **Consider space-time trade-offs:** The hash map solution is faster but uses more memory. The two-pointer solution is more memory-efficient but requires sorting. Mentioning both approaches shows depth of understanding.

4. **Track usage efficiently:** When elements can't be reused, you need a way to mark them as used. Frequency maps are perfect for this - just decrement counts as you use elements.

Related problems: [Two Sum](/problem/two-sum), [Count Good Meals](/problem/count-good-meals), [Divide Players Into Teams of Equal Skill](/problem/divide-players-into-teams-of-equal-skill)
