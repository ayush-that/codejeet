---
title: "How to Solve Merge Similar Items — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Merge Similar Items. Easy difficulty, 77.4% acceptance rate. Topics: Array, Hash Table, Sorting, Ordered Set."
date: "2027-11-14"
category: "dsa-patterns"
tags: ["merge-similar-items", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Merge Similar Items

You're given two lists of items where each item has a value and weight. Your task is to merge them by summing weights for items with the same value. While this is an easy problem, it's interesting because it tests your ability to choose the right data structure for aggregation tasks—a common pattern in real-world data processing.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
items1 = [[1,1], [4,5], [3,8]]
items2 = [[3,1], [1,3]]
```

**Step 1:** Create a dictionary to track value-weight totals
We'll use a hash map where keys are values and values are total weights.

**Step 2:** Process items1

- Item [1,1]: Add value 1 with weight 1 → `{1: 1}`
- Item [4,5]: Add value 4 with weight 5 → `{1: 1, 4: 5}`
- Item [3,8]: Add value 3 with weight 8 → `{1: 1, 4: 5, 3: 8}`

**Step 3:** Process items2

- Item [3,1]: Value 3 exists, add weight 1 → `{1: 1, 4: 5, 3: 9}`
- Item [1,3]: Value 1 exists, add weight 3 → `{1: 4, 4: 5, 3: 9}`

**Step 4:** Convert to sorted list
Extract key-value pairs: [[1,4], [3,9], [4,5]]
Sort by value (first element): [[1,4], [3,9], [4,5]]

**Output:** `[[1,4], [3,9], [4,5]]`

## Brute Force Approach

A naive approach would be to combine both arrays and then manually search for duplicates:

1. Combine items1 and items2 into one list
2. For each item, search through the result list to see if that value already exists
3. If found, add the weights; if not, append a new entry
4. Sort the final result

This approach has O((m+n)²) time complexity because for each of the (m+n) items, you might search through the entire result list. The space complexity would be O(m+n).

While this works for small inputs, it becomes inefficient as the number of items grows. The key insight is that we need fast lookups to check if we've seen a value before, which points us toward using a hash map.

## Optimal Solution

The optimal solution uses a hash map (dictionary) to aggregate weights by value, then converts to a sorted list. Here's why this works:

1. **Hash maps provide O(1) lookups** - we can quickly check if we've seen a value
2. **Hash maps allow O(1) updates** - we can efficiently add to existing weights
3. **Sorting at the end** ensures the output is in ascending order by value

<div class="code-group">

```python
# Time: O((m+n)log(m+n)) - processing + sorting
# Space: O(m+n) - storing all unique values
def mergeSimilarItems(items1, items2):
    # Step 1: Create a dictionary to store value-weight mappings
    # We use a dictionary because it provides O(1) lookups and updates
    weight_map = {}

    # Step 2: Process all items from the first list
    # For each [value, weight] pair, add to our running total
    for value, weight in items1:
        # If value already exists, add to existing weight
        # Otherwise, initialize with current weight
        weight_map[value] = weight_map.get(value, 0) + weight

    # Step 3: Process all items from the second list
    # Same logic as above - we're merging both lists
    for value, weight in items2:
        weight_map[value] = weight_map.get(value, 0) + weight

    # Step 4: Convert dictionary to list of [value, weight] pairs
    # We need to return a list, not a dictionary
    result = [[value, weight] for value, weight in weight_map.items()]

    # Step 5: Sort by value in ascending order
    # The problem requires output sorted by value
    result.sort(key=lambda x: x[0])

    return result
```

```javascript
// Time: O((m+n)log(m+n)) - processing + sorting
// Space: O(m+n) - storing all unique values
function mergeSimilarItems(items1, items2) {
  // Step 1: Create a Map to store value-weight mappings
  // Using Map provides clear key-value semantics
  const weightMap = new Map();

  // Step 2: Process all items from the first list
  // For each [value, weight] pair, update our running total
  for (const [value, weight] of items1) {
    // Get current weight or 0 if value doesn't exist yet
    const currentWeight = weightMap.get(value) || 0;
    // Update with new total weight
    weightMap.set(value, currentWeight + weight);
  }

  // Step 3: Process all items from the second list
  // Same merging logic as above
  for (const [value, weight] of items2) {
    const currentWeight = weightMap.get(value) || 0;
    weightMap.set(value, currentWeight + weight);
  }

  // Step 4: Convert Map to array of [value, weight] pairs
  // We need to return an array, not a Map
  const result = Array.from(weightMap.entries());

  // Step 5: Sort by value in ascending order
  // The problem requires output sorted by value
  result.sort((a, b) => a[0] - b[0]);

  return result;
}
```

```java
// Time: O((m+n)log(m+n)) - processing + sorting
// Space: O(m+n) - storing all unique values
import java.util.*;

class Solution {
    public List<List<Integer>> mergeSimilarItems(int[][] items1, int[][] items2) {
        // Step 1: Create a TreeMap to store value-weight mappings
        // TreeMap automatically sorts by keys, saving us a separate sort step
        Map<Integer, Integer> weightMap = new TreeMap<>();

        // Step 2: Process all items from the first list
        // For each [value, weight] pair, add to our running total
        for (int[] item : items1) {
            int value = item[0];
            int weight = item[1];
            // Merge weights: get current or 0, then add new weight
            weightMap.put(value, weightMap.getOrDefault(value, 0) + weight);
        }

        // Step 3: Process all items from the second list
        // Same merging logic as above
        for (int[] item : items2) {
            int value = item[0];
            int weight = item[1];
            weightMap.put(value, weightMap.getOrDefault(value, 0) + weight);
        }

        // Step 4: Convert TreeMap to List<List<Integer>>
        // TreeMap is already sorted by value, so we just need to format
        List<List<Integer>> result = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : weightMap.entrySet()) {
            List<Integer> pair = new ArrayList<>();
            pair.add(entry.getKey());
            pair.add(entry.getValue());
            result.add(pair);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O((m+n)log(m+n))**

- Processing both arrays: O(m+n) where m = len(items1), n = len(items2)
- Sorting the result: O(k log k) where k = number of unique values (k ≤ m+n)
- Total: O(m+n + k log k) = O((m+n)log(m+n)) in worst case

**Space Complexity: O(m+n)**

- The hash map stores at most m+n entries (if all values are unique)
- The result list also stores k entries
- Total: O(m+n)

Note: In Java, using TreeMap gives us O((m+n)log(m+n)) time for insertions but eliminates the need for separate sorting.

## Common Mistakes

1. **Forgetting to sort the output**: The problem statement requires the result to be sorted by value in ascending order. Always read the output requirements carefully.

2. **Using arrays instead of hash maps for large value ranges**: Some candidates try to use an array indexed by value, but this fails when values can be large or non-contiguous. Hash maps handle sparse data efficiently.

3. **Not handling duplicate values within the same array**: While the problem doesn't explicitly state there are no duplicates within each array, a robust solution should handle this case. Our solution does because we use `getOrDefault` or similar methods.

4. **Incorrect weight aggregation**: Adding weights incorrectly (e.g., overwriting instead of summing) is a common error. Remember: when you see the same value again, you need to add to the existing weight, not replace it.

## When You'll See This Pattern

This "aggregate by key" pattern appears in many problems:

1. **Two Sum (Easy)**: Uses hash maps for O(1) lookups to find complement pairs
2. **Group Anagrams (Medium)**: Aggregates strings by their character frequency signature
3. **Merge Two 2D Arrays by Summing Values (Easy)**: Nearly identical to this problem
4. **Top K Frequent Elements (Medium)**: Counts frequencies then sorts or uses heap

The core pattern is: when you need to group, count, or aggregate data by some key, and you need efficient lookups, reach for a hash map. If you need the results sorted, either sort at the end or use a TreeMap/TreeSet.

## Key Takeaways

1. **Hash maps are your go-to for aggregation problems**: When you need to group, count, or sum by keys, hash maps provide O(1) operations that make your solution efficient.

2. **Separate processing from formatting**: Process all data first (aggregation), then format the output (sorting, converting to required format). This keeps your code clean and logical.

3. **Consider the data characteristics**: If values have a small, contiguous range, arrays might work. For sparse or large ranges, hash maps are better. If you need sorted output, TreeMap (Java) or sorting at the end works.

Related problems: [Merge Two 2D Arrays by Summing Values](/problem/merge-two-2d-arrays-by-summing-values)
