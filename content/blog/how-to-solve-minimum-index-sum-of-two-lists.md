---
title: "How to Solve Minimum Index Sum of Two Lists — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Index Sum of Two Lists. Easy difficulty, 59.5% acceptance rate. Topics: Array, Hash Table, String."
date: "2027-12-19"
category: "dsa-patterns"
tags: ["minimum-index-sum-of-two-lists", "array", "hash-table", "string", "easy"]
---

# How to Solve Minimum Index Sum of Two Lists

This problem asks us to find common strings between two lists that have the smallest combined index sum. While the concept is straightforward, the challenge lies in efficiently tracking both the existence of strings and their indices to calculate the minimum sum. The interesting part is that we need to find **all** strings with the same minimum sum, not just one.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
list1 = ["Shogun", "Tapioca Express", "Burger King", "KFC"]
list2 = ["Piatti", "The Grill at Torrey Pines", "Hungry Hunter Steakhouse", "Shogun"]
```

**Step-by-step reasoning:**

1. We need to find strings that appear in both lists
2. For each common string, calculate: `index_in_list1 + index_in_list2`
3. Track the minimum sum and all strings achieving that sum

Let's process this example:

- "Shogun" appears at index 0 in list1 and index 3 in list2
- Sum = 0 + 3 = 3
- Since this is the only common string, it's our answer

**Another example:**

```
list1 = ["Shogun", "Tapioca Express", "Burger King", "KFC"]
list2 = ["KFC", "Shogun", "Burger King"]
```

Processing:

- "Shogun": index 0 in list1, index 1 in list2 → sum = 1
- "Burger King": index 2 in list1, index 2 in list2 → sum = 4
- "KFC": index 3 in list1, index 0 in list2 → sum = 3

The minimum sum is 1 (from "Shogun"), so our answer is ["Shogun"].

**One more to show multiple results:**

```
list1 = ["A", "B", "C", "D"]
list2 = ["D", "A", "C", "B"]
```

Processing:

- "A": index 0 + index 1 = 1
- "B": index 1 + index 3 = 4
- "C": index 2 + index 2 = 4
- "D": index 3 + index 0 = 3

Minimum sum is 1 (from "A"), so answer is ["A"].

## Brute Force Approach

The most straightforward approach would be to:

1. For each string in list1
2. For each string in list2
3. If they match, calculate the sum of indices
4. Track the minimum sum and corresponding strings

This approach has O(n×m) time complexity where n and m are the lengths of the two lists. For lists of length 1000 each, that's 1,000,000 comparisons - too slow for large inputs.

The brute force also doesn't efficiently handle tracking multiple strings with the same minimum sum. While we could make it work with careful tracking, the quadratic time complexity makes it impractical.

## Optimal Solution

The key insight is to use a hash map (dictionary) to store strings from the first list with their indices. Then, when we iterate through the second list, we can check in O(1) time if a string exists in the first list and immediately calculate the index sum.

Here's the optimal approach:

1. Create a hash map mapping each string in list1 to its index
2. Initialize `min_sum` to a large value and `result` as an empty list
3. Iterate through list2 with index j
4. For each string in list2, check if it exists in the hash map
5. If yes, calculate `i + j` where i is from the hash map
6. If this sum equals our current minimum, add the string to results
7. If this sum is less than our current minimum, update minimum and reset results
8. Return the result list

<div class="code-group">

```python
# Time: O(n + m) where n = len(list1), m = len(list2)
# Space: O(n) for the hash map storing list1 elements
def findRestaurant(list1, list2):
    """
    Finds common strings between two lists with the minimum index sum.

    Args:
        list1: First list of strings
        list2: Second list of strings

    Returns:
        List of strings that appear in both lists with the minimum index sum
    """
    # Step 1: Create a hash map of list1 strings to their indices
    # This allows O(1) lookup when checking list2
    index_map = {}
    for i, restaurant in enumerate(list1):
        index_map[restaurant] = i

    # Step 2: Initialize tracking variables
    min_sum = float('inf')  # Start with infinity as our minimum
    result = []  # Will store all strings with current minimum sum

    # Step 3: Iterate through list2
    for j, restaurant in enumerate(list2):
        # Check if current restaurant exists in list1
        if restaurant in index_map:
            # Calculate the index sum
            current_sum = index_map[restaurant] + j

            # Step 4: Compare with current minimum
            if current_sum < min_sum:
                # Found a new minimum, reset results
                min_sum = current_sum
                result = [restaurant]
            elif current_sum == min_sum:
                # Same minimum, add to results
                result.append(restaurant)

    return result
```

```javascript
// Time: O(n + m) where n = list1.length, m = list2.length
// Space: O(n) for the map storing list1 elements
function findRestaurant(list1, list2) {
  /**
   * Finds common strings between two lists with the minimum index sum.
   *
   * @param {string[]} list1 - First list of strings
   * @param {string[]} list2 - Second list of strings
   * @return {string[]} Strings that appear in both lists with minimum index sum
   */

  // Step 1: Create a map of list1 strings to their indices
  // Using Map provides O(1) average case lookup
  const indexMap = new Map();
  for (let i = 0; i < list1.length; i++) {
    indexMap.set(list1[i], i);
  }

  // Step 2: Initialize tracking variables
  let minSum = Infinity; // Start with the largest possible value
  const result = []; // Will store all strings with current minimum sum

  // Step 3: Iterate through list2
  for (let j = 0; j < list2.length; j++) {
    const restaurant = list2[j];

    // Check if current restaurant exists in list1
    if (indexMap.has(restaurant)) {
      // Calculate the index sum
      const currentSum = indexMap.get(restaurant) + j;

      // Step 4: Compare with current minimum
      if (currentSum < minSum) {
        // Found a new minimum, reset results
        minSum = currentSum;
        result.length = 0; // Clear the array
        result.push(restaurant);
      } else if (currentSum === minSum) {
        // Same minimum, add to results
        result.push(restaurant);
      }
    }
  }

  return result;
}
```

```java
// Time: O(n + m) where n = list1.length, m = list2.length
// Space: O(n) for the map storing list1 elements
import java.util.*;

class Solution {
    public String[] findRestaurant(String[] list1, String[] list2) {
        /**
         * Finds common strings between two lists with the minimum index sum.
         *
         * @param list1 First list of strings
         * @param list2 Second list of strings
         * @return Array of strings that appear in both lists with minimum index sum
         */

        // Step 1: Create a hash map of list1 strings to their indices
        // HashMap provides O(1) average case lookup
        Map<String, Integer> indexMap = new HashMap<>();
        for (int i = 0; i < list1.length; i++) {
            indexMap.put(list1[i], i);
        }

        // Step 2: Initialize tracking variables
        int minSum = Integer.MAX_VALUE;  // Start with maximum integer value
        List<String> result = new ArrayList<>();  // Flexible list for results

        // Step 3: Iterate through list2
        for (int j = 0; j < list2.length; j++) {
            String restaurant = list2[j];

            // Check if current restaurant exists in list1
            if (indexMap.containsKey(restaurant)) {
                // Calculate the index sum
                int currentSum = indexMap.get(restaurant) + j;

                // Step 4: Compare with current minimum
                if (currentSum < minSum) {
                    // Found a new minimum, reset results
                    minSum = currentSum;
                    result.clear();  // Remove all previous results
                    result.add(restaurant);
                } else if (currentSum == minSum) {
                    // Same minimum, add to results
                    result.add(restaurant);
                }
            }
        }

        // Convert List to array for return type
        return result.toArray(new String[0]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building the hash map from list1 takes O(n) time
- Iterating through list2 and checking the hash map takes O(m) time
- Each hash map operation (insertion and lookup) is O(1) on average
- Total: O(n + m), which is linear in the combined size of both lists

**Space Complexity: O(min(n, m))**

- We store the smaller list in the hash map to minimize space
- In the worst case, we store all elements of one list: O(n) where n is the length of that list
- The result list in the worst case could store all common strings, but this is bounded by min(n, m)

## Common Mistakes

1. **Forgetting to handle multiple results with the same minimum sum**
   - Candidates often return only the first string they find with the minimum sum
   - Solution: Maintain a list of results and reset it when you find a new minimum

2. **Using the wrong initial value for min_sum**
   - Starting with 0 can cause issues if all sums are positive
   - Solution: Use `float('inf')` in Python, `Infinity` in JavaScript, or `Integer.MAX_VALUE` in Java

3. **Not considering which list to put in the hash map**
   - Putting the longer list in the hash map uses more memory
   - Solution: You can optimize by putting the shorter list in the hash map, though either works

4. **Off-by-one errors with index calculations**
   - Remember that indices start at 0, so the sum of two indices can be 0 (if both are at position 0)
   - Solution: Test with edge cases where strings are at the beginning of both lists

## When You'll See This Pattern

This problem uses the **hash map for fast lookup** pattern, which is fundamental to many algorithmic problems:

1. **Two Sum (LeetCode #1)** - Uses a hash map to store values and their indices for O(1) lookup
2. **Intersection of Two Arrays (LeetCode #349)** - Uses sets/hash maps to find common elements
3. **Contains Duplicate (LeetCode #217)** - Uses a hash set to check for duplicates
4. **Word Pattern (LeetCode #290)** - Uses hash maps to establish bi-directional mappings

The core idea is trading space for time: by storing data in a hash map, we reduce lookup time from O(n) to O(1), transforming many problems from quadratic to linear time.

## Key Takeaways

1. **Hash maps are your best friend for lookup problems** - When you need to check if something exists or find its associated value, a hash map provides O(1) average-case lookup time.

2. **Think about which data to store** - In this problem, we store strings with their indices from one list, then use that to efficiently process the second list.

3. **Pay attention to multiple results** - Many problems ask for "all" solutions meeting a criteria, not just one. Always check if you need to handle multiple results.

4. **Initialization matters** - Choosing the right initial value (like infinity for minimum searches) prevents bugs with edge cases.

Related problems: [Intersection of Two Linked Lists](/problem/intersection-of-two-linked-lists)
