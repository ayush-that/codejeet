---
title: "How to Solve Find All Lonely Numbers in the Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find All Lonely Numbers in the Array. Medium difficulty, 62.7% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-02-06"
category: "dsa-patterns"
tags: ["find-all-lonely-numbers-in-the-array", "array", "hash-table", "counting", "medium"]
---

# How to Solve Find All Lonely Numbers in the Array

This problem asks us to find all "lonely" numbers in an array—numbers that appear exactly once and have no adjacent values (x-1 or x+1) present in the array. What makes this problem interesting is that it combines frequency counting with adjacency checking, requiring us to track both how often numbers appear and whether their neighbors exist. The challenge lies in doing this efficiently without repeatedly scanning the array.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [10, 6, 5, 8, 10, 5, 8]`.

**Step 1: Count frequencies**

- 10 appears 2 times
- 6 appears 1 time
- 5 appears 2 times
- 8 appears 2 times

**Step 2: Check each unique number for loneliness**

- **10**: Frequency = 2 → not lonely (must appear exactly once)
- **6**: Frequency = 1 → check neighbors:
  - Is 5 in the array? Yes (frequency 2) → not lonely
  - Is 7 in the array? No → but 5 exists, so still not lonely
- **5**: Frequency = 2 → not lonely
- **8**: Frequency = 2 → not lonely

**Result:** No lonely numbers → `[]`

Now let's try `nums = [1, 3, 5, 3]`:

- **1**: Frequency = 1, check neighbors:
  - 0 not in array, 2 not in array → lonely ✓
- **3**: Frequency = 2 → not lonely
- **5**: Frequency = 1, check neighbors:
  - 4 not in array, 6 not in array → lonely ✓

**Result:** `[1, 5]`

The key insight is that we need to check three conditions for each number: frequency = 1, x-1 not present, and x+1 not present.

## Brute Force Approach

A naive approach would be to check each number individually by scanning the entire array multiple times:

1. For each number x in the array:
2. Count how many times x appears (O(n) scan)
3. Check if x-1 exists (another O(n) scan)
4. Check if x+1 exists (another O(n) scan)
5. If frequency = 1 and both neighbors don't exist, add to result

This gives us O(n²) time complexity since for each of n elements, we might scan the array up to 3 times. For an array of 10⁵ elements, this would be 10¹⁰ operations—far too slow.

Even if we sort first (O(n log n)), we'd still need to check neighbors efficiently, which would require careful index manipulation and could be error-prone with duplicate values.

## Optimized Approach

The optimal solution uses a hash map (dictionary) to count frequencies in a single pass. Here's the step-by-step reasoning:

1. **Count frequencies first**: Create a frequency map where keys are numbers and values are their counts. This takes O(n) time and O(n) space.

2. **Check each unique number**: Instead of checking every occurrence in the array, we only need to check each unique number once. For each number x in the frequency map:
   - If `freq[x] != 1`, skip (not lonely)
   - If `freq[x] == 1`, check if `x-1` exists in the map
   - Check if `x+1` exists in the map
   - If neither neighbor exists, x is lonely

3. **Why this works**: The frequency map gives us O(1) lookups for both frequency checks and neighbor existence checks. We're essentially trading space for time—using O(n) extra space to reduce time from O(n²) to O(n).

The beauty of this approach is its simplicity: we separate the problem into two clear phases (counting then checking) and use the right data structure for fast lookups.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - we make two passes through the array
# Space: O(n) - for the frequency dictionary
def findLonely(nums):
    """
    Find all lonely numbers in the array.
    A number is lonely if it appears exactly once
    and neither x-1 nor x+1 exists in the array.
    """
    # Step 1: Count frequencies of all numbers
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Check each number for loneliness
    lonely = []

    # We iterate through the original array, not the frequency map,
    # to maintain the ability to add duplicates to the result
    # if needed (though for lonely numbers, duplicates won't exist)
    for num in nums:
        # Check if the number appears exactly once
        if freq[num] != 1:
            continue

        # Check if adjacent numbers exist
        # We use .get() with default 0 to avoid KeyError
        has_prev = freq.get(num - 1, 0) > 0
        has_next = freq.get(num + 1, 0) > 0

        # If no adjacent numbers exist, it's lonely
        if not has_prev and not has_next:
            lonely.append(num)

    return lonely
```

```javascript
// Time: O(n) - two passes through the array
// Space: O(n) - for the frequency map
function findLonely(nums) {
  /**
   * Find all lonely numbers in the array.
   * A number is lonely if it appears exactly once
   * and neither x-1 nor x+1 exists in the array.
   */

  // Step 1: Count frequencies of all numbers
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Check each number for loneliness
  const lonely = [];

  // Iterate through the original array
  for (const num of nums) {
    // Check if the number appears exactly once
    if (freq.get(num) !== 1) {
      continue;
    }

    // Check if adjacent numbers exist
    const hasPrev = (freq.get(num - 1) || 0) > 0;
    const hasNext = (freq.get(num + 1) || 0) > 0;

    // If no adjacent numbers exist, it's lonely
    if (!hasPrev && !hasNext) {
      lonely.push(num);
    }
  }

  return lonely;
}
```

```java
// Time: O(n) - two passes through the array
// Space: O(n) - for the frequency map
import java.util.*;

class Solution {
    public List<Integer> findLonely(int[] nums) {
        /**
         * Find all lonely numbers in the array.
         * A number is lonely if it appears exactly once
         * and neither x-1 nor x+1 exists in the array.
         */

        // Step 1: Count frequencies of all numbers
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 2: Check each number for loneliness
        List<Integer> lonely = new ArrayList<>();

        // Iterate through the original array
        for (int num : nums) {
            // Check if the number appears exactly once
            if (freq.get(num) != 1) {
                continue;
            }

            // Check if adjacent numbers exist
            boolean hasPrev = freq.getOrDefault(num - 1, 0) > 0;
            boolean hasNext = freq.getOrDefault(num + 1, 0) > 0;

            // If no adjacent numbers exist, it's lonely
            if (!hasPrev && !hasNext) {
                lonely.add(num);
            }
        }

        return lonely;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the frequency map: O(n) for iterating through all n elements
- Checking each element for loneliness: O(n) for iterating through the array again
- Each lookup in the frequency map is O(1) on average
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- The frequency map stores at most n key-value pairs (in the worst case when all numbers are unique)
- The result list stores at most n elements (in the worst case when all numbers are lonely)
- Total: O(n) + O(n) = O(n)

## Common Mistakes

1. **Checking neighbors before checking frequency**: Some candidates check if neighbors exist first, then check frequency. This is inefficient because if frequency > 1, the neighbor checks were unnecessary. Always check the cheaper condition (frequency = 1) first.

2. **Using array instead of hash map for frequency counting**: If numbers have a large range (e.g., -10⁹ to 10⁹), an array would be impractical due to memory constraints. Hash maps handle sparse data efficiently.

3. **Forgetting to handle negative numbers**: The problem statement doesn't restrict numbers to positive values. Ensure your solution handles negative numbers correctly—adjacency works the same way (e.g., -2 and 0 are adjacent to -1).

4. **Adding duplicates to the result**: If you iterate through the original array and add lonely numbers without checking if they're already in the result, you might add duplicates. In our solution, since lonely numbers by definition appear only once, this isn't an issue, but it's good to be aware of this edge case.

## When You'll See This Pattern

This problem uses the **frequency counting with hash map** pattern, which appears in many array problems:

1. **Two Sum** (Easy): Uses a hash map to store numbers and their indices for O(1) lookups of complements.
2. **Contains Duplicate** (Easy): Uses a hash set to track seen numbers for duplicate detection.
3. **Top K Frequent Elements** (Medium): Uses a frequency map followed by bucket sort or heap to find most frequent elements.
4. **Longest Consecutive Sequence** (Medium): Uses a hash set to check for sequence starts and track consecutive numbers.

The core insight is that when you need to check existence or count frequencies, hash maps provide O(1) operations, transforming O(n²) brute force solutions into O(n) optimal ones.

## Key Takeaways

1. **When to reach for a hash map**: Any time you need to check if an element exists in an array or count frequencies, consider using a hash map. The O(1) lookup time often turns quadratic solutions into linear ones.

2. **Separate counting from processing**: First build your frequency map, then use it to make decisions. This clean separation makes code easier to reason about and debug.

3. **Check the cheapest condition first**: In conditional logic with multiple checks, always check the condition that's fastest to evaluate or most likely to short-circuit first. Here, checking frequency = 1 before neighbor existence saves unnecessary lookups.

Related problems: [Frequency of the Most Frequent Element](/problem/frequency-of-the-most-frequent-element)
