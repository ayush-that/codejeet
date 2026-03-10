---
title: "How to Solve Maximum Number of Pairs in Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Number of Pairs in Array. Easy difficulty, 76.0% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2027-08-14"
category: "dsa-patterns"
tags: ["maximum-number-of-pairs-in-array", "array", "hash-table", "counting", "easy"]
---

# How to Solve Maximum Number of Pairs in Array

This problem asks us to find how many pairs of equal numbers we can form from an array, and what remains after we've made all possible pairs. While conceptually simple, it's interesting because it requires careful counting and handling of remainders—a common pattern in frequency-based problems.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 3, 2, 1, 3, 2, 2]`

**Step 1: Count frequencies**

- 1 appears 2 times
- 2 appears 3 times
- 3 appears 2 times

**Step 2: Calculate pairs from each number**

- For number 1: 2 occurrences → 1 pair (2 ÷ 2 = 1)
- For number 2: 3 occurrences → 1 pair (3 ÷ 2 = 1, remainder 1)
- For number 3: 2 occurrences → 1 pair (2 ÷ 2 = 1)

**Step 3: Calculate totals**

- Total pairs: 1 + 1 + 1 = 3 pairs
- Leftover numbers:
  - Number 1: 2 occurrences used up completely (0 leftover)
  - Number 2: 3 occurrences used 2 for a pair (1 leftover)
  - Number 3: 2 occurrences used up completely (0 leftover)
  - Total leftovers: 0 + 1 + 0 = 1

**Result:** We can form 3 pairs, with 1 number leftover.

## Brute Force Approach

A naive approach might try to sort the array and then iterate through it, pairing adjacent equal numbers:

1. Sort the array
2. Iterate through with two pointers
3. When you find two equal adjacent numbers, count a pair and skip both
4. Otherwise, count a leftover and move forward

However, this has issues:

- Sorting takes O(n log n) time when we can do better
- The pointer logic gets messy with odd counts
- It doesn't naturally handle the counting aspect

More importantly, this approach misses the key insight: we don't need to actually pair the numbers, we just need to count how many pairs we _could_ form. The frequency of each number tells us everything we need.

## Optimal Solution

The optimal approach uses a hash map (dictionary) to count frequencies:

1. Count how many times each number appears
2. For each number, calculate:
   - Pairs = frequency ÷ 2 (integer division)
   - Leftover = frequency % 2 (modulo operation)
3. Sum up all pairs and all leftovers

This works because each pair requires two identical numbers, so the maximum pairs for a number with frequency `f` is `f // 2`, and what remains is `f % 2`.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numberOfPairs(nums):
    """
    Counts maximum number of pairs that can be formed from equal numbers,
    and returns the count of leftover numbers.

    Args:
        nums: List of integers to form pairs from

    Returns:
        List with two integers: [number_of_pairs, number_of_leftovers]
    """
    # Step 1: Count frequency of each number using a dictionary
    freq = {}
    for num in nums:
        # Increment count for this number, defaulting to 0 if not seen
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Initialize counters for pairs and leftovers
    pairs = 0
    leftovers = 0

    # Step 3: Process each unique number's frequency
    for count in freq.values():
        # Integer division gives number of complete pairs
        pairs += count // 2
        # Modulo gives leftover after forming pairs
        leftovers += count % 2

    # Step 4: Return result as required by problem
    return [pairs, leftovers]
```

```javascript
// Time: O(n) | Space: O(n)
function numberOfPairs(nums) {
  /**
   * Counts maximum number of pairs that can be formed from equal numbers,
   * and returns the count of leftover numbers.
   *
   * @param {number[]} nums - Array of integers to form pairs from
   * @return {number[]} - Array with two numbers: [pairs, leftovers]
   */

  // Step 1: Count frequency of each number using a Map
  const freq = new Map();

  for (const num of nums) {
    // Get current count or 0 if not seen, then increment
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Initialize counters
  let pairs = 0;
  let leftovers = 0;

  // Step 3: Process each frequency count
  for (const count of freq.values()) {
    // Math.floor for integer division in JavaScript
    pairs += Math.floor(count / 2);
    // Modulo gives remainder
    leftovers += count % 2;
  }

  // Step 4: Return as array per problem requirements
  return [pairs, leftovers];
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int[] numberOfPairs(int[] nums) {
        /**
         * Counts maximum number of pairs that can be formed from equal numbers,
         * and returns the count of leftover numbers.
         *
         * @param nums Array of integers to form pairs from
         * @return Array with two integers: [pairs, leftovers]
         */

        // Step 1: Count frequency using HashMap
        Map<Integer, Integer> freq = new HashMap<>();

        for (int num : nums) {
            // Increment count, starting from 0 if not present
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 2: Initialize counters
        int pairs = 0;
        int leftovers = 0;

        // Step 3: Process each frequency
        for (int count : freq.values()) {
            // Integer division gives pairs
            pairs += count / 2;
            // Modulo gives leftovers
            leftovers += count % 2;
        }

        // Step 4: Return as array
        return new int[]{pairs, leftovers};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the array to count frequencies: O(n)
- We make one pass through the unique values (at most n): O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- In the worst case, all numbers are unique, so our frequency map stores n entries
- Even with duplicates, we store at most n entries
- Additional variables (pairs, leftovers) use O(1) space
- Total: O(n) for the frequency map

## Common Mistakes

1. **Forgetting to handle empty input**: While the problem doesn't explicitly state empty arrays aren't allowed, your code should handle them gracefully. With our approach, an empty array correctly returns `[0, 0]`.

2. **Incorrect integer division in JavaScript**: JavaScript doesn't have integer division like Python or Java. Using `count / 2` gives a float. You must use `Math.floor(count / 2)` or `~~(count / 2)`.

3. **Trying to actually pair numbers**: Some candidates try to sort and match adjacent numbers or use complex pointer logic. This overcomplicates the solution. Remember: we only need counts, not the actual pairs.

4. **Not using the right data structure**: Using an array of size equal to the maximum value in `nums` would waste space if values are sparse or large. A hash map is the right choice here.

## When You'll See This Pattern

This frequency counting pattern appears in many problems:

1. **Sort Characters By Frequency (Medium)**: Count character frequencies, then sort by frequency to reconstruct the string.

2. **Top K Frequent Words (Medium)**: Count word frequencies, then use a heap to find the k most frequent.

3. **Sort Array by Increasing Frequency (Easy)**: Similar to this problem but requires sorting by frequency instead of just counting.

The core technique—using a hash map to count frequencies—is fundamental to solving problems involving duplicates, anagrams, or distribution analysis.

## Key Takeaways

1. **When you need to work with duplicates or counts, think "frequency map"**: A hash map/dictionary is your go-to tool for counting occurrences efficiently.

2. **Don't overcomplicate pairing problems**: Often you don't need to actually pair items—just calculate how many pairs you could form using division and modulo operations.

3. **Integer division and modulo are powerful tools**: `count // 2` gives you pairs, `count % 2` gives you leftovers. This pattern appears in many "grouping" problems.

Related problems: [Sort Characters By Frequency](/problem/sort-characters-by-frequency), [Top K Frequent Words](/problem/top-k-frequent-words), [Sort Array by Increasing Frequency](/problem/sort-array-by-increasing-frequency)
