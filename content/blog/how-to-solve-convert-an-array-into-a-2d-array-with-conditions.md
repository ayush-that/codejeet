---
title: "How to Solve Convert an Array Into a 2D Array With Conditions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Convert an Array Into a 2D Array With Conditions. Medium difficulty, 86.4% acceptance rate. Topics: Array, Hash Table."
date: "2028-07-13"
category: "dsa-patterns"
tags: ["convert-an-array-into-a-2d-array-with-conditions", "array", "hash-table", "medium"]
---

# How to Solve "Convert an Array Into a 2D Array With Conditions"

This problem asks us to transform a 1D array into a 2D array where each row contains only distinct integers, while using all elements from the original array. What makes this interesting is that we need to determine the _minimum_ number of rows required while satisfying the distinctness constraint in each row. The challenge lies in efficiently distributing duplicates across different rows.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, 4, 1, 2, 3, 1]`

**Step 1:** Count frequency of each number

- 1 appears 3 times
- 3 appears 2 times
- 4 appears 1 time
- 2 appears 1 time

**Step 2:** The maximum frequency determines the number of rows

- The number 1 appears most frequently (3 times)
- We need at least 3 rows to accommodate all three 1's (since each row can have only one 1)

**Step 3:** Distribute elements across rows
We'll build rows one element at a time, ensuring no duplicates in any row:

```
Row 1: [1, 3, 4, 2]  (Take first occurrence of each available number)
Row 2: [1, 3]        (Take second occurrence of numbers that appear at least twice)
Row 3: [1]           (Take third occurrence of numbers that appear at least three times)
```

**Step 4:** Final 2D array: `[[1, 3, 4, 2], [1, 3], [1]]`

Notice how we essentially need to "stagger" the duplicates across different rows, similar to dealing cards from a deck.

## Brute Force Approach

A naive approach might try to build rows sequentially, scanning through the array and adding each element to the first row where it doesn't already exist. However, this becomes inefficient because:

1. For each element, we might need to check multiple rows
2. We'd need to backtrack if we can't place an element in any existing row
3. The worst-case time complexity could be O(n²) if we have many duplicates

Here's what that might look like:

```python
def brute_force(nums):
    result = []
    for num in nums:
        placed = False
        # Try to place in existing rows
        for row in result:
            if num not in row:
                row.append(num)
                placed = True
                break
        # If couldn't place, create new row
        if not placed:
            result.append([num])
    return result
```

This approach is O(n²) in the worst case because for each of n elements, we might check up to n rows, and checking if a number is in a row is O(row_length). More importantly, this doesn't guarantee the minimum number of rows - it just builds rows greedily.

## Optimized Approach

The key insight is that **the maximum frequency of any number determines the minimum number of rows needed**. If a number appears k times, we need at least k rows to place all occurrences of that number (one per row).

Here's the step-by-step reasoning:

1. **Count frequencies**: First, count how many times each number appears in the array.
2. **Find maximum frequency**: The largest frequency tells us how many rows we need.
3. **Distribute systematically**: Create empty rows, then for each unique number, place its occurrences across different rows (one per row).

Think of it like dealing cards: if you have 3 aces, you need to deal them to 3 different players (rows). The player with the most cards determines how many rounds of dealing you need.

This approach is efficient because:

- Counting frequencies takes O(n) time with a hash map
- Distribution takes O(n) time since we process each element once
- We use O(n) space to store the result and frequency counts

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findMatrix(nums):
    """
    Convert array to 2D array where each row has distinct integers.
    The number of rows equals the maximum frequency of any number.
    """
    # Step 1: Count frequency of each number
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Initialize result list with empty rows
    # The number of rows needed is the maximum frequency
    max_freq = max(freq.values())
    result = [[] for _ in range(max_freq)]

    # Step 3: Distribute numbers across rows
    # For each unique number, place its occurrences in different rows
    for num, count in freq.items():
        # Place this number in 'count' different rows
        for i in range(count):
            result[i].append(num)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function findMatrix(nums) {
  /**
   * Convert array to 2D array where each row has distinct integers.
   * The number of rows equals the maximum frequency of any number.
   */
  // Step 1: Count frequency of each number
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Initialize result array with empty rows
  // The number of rows needed is the maximum frequency
  let maxFreq = 0;
  for (const count of freq.values()) {
    maxFreq = Math.max(maxFreq, count);
  }

  const result = Array.from({ length: maxFreq }, () => []);

  // Step 3: Distribute numbers across rows
  // For each unique number, place its occurrences in different rows
  for (const [num, count] of freq.entries()) {
    // Place this number in 'count' different rows
    for (let i = 0; i < count; i++) {
      result[i].push(num);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public List<List<Integer>> findMatrix(int[] nums) {
        /**
         * Convert array to 2D array where each row has distinct integers.
         * The number of rows equals the maximum frequency of any number.
         */
        // Step 1: Count frequency of each number
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 2: Initialize result list with empty rows
        // The number of rows needed is the maximum frequency
        int maxFreq = 0;
        for (int count : freq.values()) {
            maxFreq = Math.max(maxFreq, count);
        }

        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < maxFreq; i++) {
            result.add(new ArrayList<>());
        }

        // Step 3: Distribute numbers across rows
        // For each unique number, place its occurrences in different rows
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            int num = entry.getKey();
            int count = entry.getValue();

            // Place this number in 'count' different rows
            for (int i = 0; i < count; i++) {
                result.get(i).add(num);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies: O(n) to iterate through all n elements
- Finding maximum frequency: O(k) where k is number of unique elements (k ≤ n)
- Distributing elements: O(k × max_freq) which is bounded by O(n) since each element gets placed exactly once

**Space Complexity: O(n)**

- Frequency map: O(k) where k is number of unique elements
- Result array: O(n) to store all elements
- Total: O(n) since k ≤ n and we store all elements

## Common Mistakes

1. **Not realizing max frequency determines row count**: Some candidates try to dynamically grow rows, which leads to incorrect results or inefficient solutions. Remember: if a number appears 5 times, you need at least 5 rows.

2. **Incorrect distribution logic**: Placing all occurrences of a number in the same row (violating distinctness) or placing them randomly across rows. The key is systematic distribution: first occurrence in row 0, second in row 1, etc.

3. **Forgetting to handle empty input**: While the problem guarantees nums.length ≥ 1, in interviews you should mention edge cases. For empty input, you'd return an empty list.

4. **Using unnecessary data structures**: Some candidates use sets for each row to check membership, but that's not needed with our frequency-based approach. The distribution is deterministic once we know frequencies.

## When You'll See This Pattern

This frequency-based distribution pattern appears in several problems:

1. **Task Scheduler (LeetCode 621)**: Similar concept of spacing out identical tasks with a cooldown period. The minimum time is determined by the most frequent task.

2. **Rearrange String k Distance Apart (LeetCode 358)**: Requires placing same characters at least k positions apart, using frequency counts to determine feasibility.

3. **Sort Characters By Frequency (LeetCode 451)**: While simpler, it uses frequency counting to reconstruct strings.

The core pattern is: **when you need to separate identical items, the maximum frequency often determines the minimum structure size needed**.

## Key Takeaways

1. **Frequency determines structure**: When dealing with distribution constraints, always start by counting frequencies. The maximum frequency often gives you a lower bound on the solution size.

2. **Systematic distribution beats greedy placement**: Instead of trying to place elements reactively, pre-calculate what you need and distribute methodically.

3. **Hash maps are your friend**: For frequency counting problems, hash maps provide O(1) lookups and updates, making them ideal for these types of problems.

[Practice this problem on CodeJeet](/problem/convert-an-array-into-a-2d-array-with-conditions)
