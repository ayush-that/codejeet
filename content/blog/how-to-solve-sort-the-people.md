---
title: "How to Solve Sort the People — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sort the People. Easy difficulty, 84.8% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2027-08-31"
category: "dsa-patterns"
tags: ["sort-the-people", "array", "hash-table", "string", "easy"]
---

# How to Solve Sort the People

You're given two arrays: `names` containing people's names, and `heights` containing their corresponding heights. The heights are all distinct positive integers. Your task is to return the names sorted in **descending** order by height (tallest person first).

What makes this problem interesting is that you need to sort one array based on the values in another array. While it's easy to sort the heights themselves, you need to maintain the connection between each height and its corresponding name throughout the sorting process.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
names = ["Mary", "John", "Emma"]
heights = [180, 165, 170]
```

**Step 1:** We need to sort by height in descending order. The heights are: 180, 165, 170.

**Step 2:** Sort the heights in descending order: 180, 170, 165.

**Step 3:** But we need to return the corresponding names in that order. So:

- Height 180 corresponds to "Mary"
- Height 170 corresponds to "Emma"
- Height 165 corresponds to "John"

**Step 4:** The result should be: `["Mary", "Emma", "John"]`

The key insight is that we need to maintain the pairing between names and heights throughout the sorting process. We can't just sort the heights array independently—we need to sort the pairs together.

## Brute Force Approach

A naive approach might be to manually find the tallest person, add their name to the result, then find the next tallest, and so on. This would involve repeatedly scanning the heights array to find the maximum height, recording the corresponding name, and then marking that person as "processed."

While this approach would work, it's inefficient—O(n²) time complexity because for each of the n people, we'd scan through up to n heights to find the maximum. This is clearly not optimal when we can do better with proper sorting.

## Optimal Solution

The optimal approach is to pair each name with its height, sort these pairs by height in descending order, and then extract just the names. We can do this in several ways:

1. **Create pairs and sort**: Create an array of (height, name) pairs, sort by height in descending order, then extract names.
2. **Use indices**: Create an array of indices [0, 1, 2, ..., n-1], sort these indices based on the corresponding heights in descending order, then use these sorted indices to arrange the names.
3. **Use a hash map**: Map heights to names, sort the heights in descending order, then look up names.

The first approach is the most straightforward. Let's implement it:

<div class="code-group">

```python
# Time: O(n log n) - due to sorting
# Space: O(n) - for storing the pairs
def sortPeople(names, heights):
    """
    Sort names in descending order by their corresponding heights.

    Args:
        names: List of strings representing people's names
        heights: List of distinct positive integers representing heights

    Returns:
        List of names sorted by height in descending order
    """
    # Step 1: Create pairs of (height, name)
    # We use height as the first element so we can sort by it directly
    pairs = [(heights[i], names[i]) for i in range(len(names))]

    # Step 2: Sort the pairs in descending order by height
    # The reverse=True parameter sorts in descending order
    pairs.sort(key=lambda x: x[0], reverse=True)

    # Step 3: Extract just the names from the sorted pairs
    # We use list comprehension to get the second element (name) from each pair
    result = [name for _, name in pairs]

    return result
```

```javascript
// Time: O(n log n) - due to sorting
// Space: O(n) - for storing the pairs
function sortPeople(names, heights) {
  /**
   * Sort names in descending order by their corresponding heights.
   *
   * @param {string[]} names - Array of people's names
   * @param {number[]} heights - Array of distinct positive integers representing heights
   * @return {string[]} Names sorted by height in descending order
   */
  // Step 1: Create an array of objects with height and name properties
  // This makes it easy to sort by height
  const people = [];
  for (let i = 0; i < names.length; i++) {
    people.push({
      height: heights[i],
      name: names[i],
    });
  }

  // Step 2: Sort the array in descending order by height
  // We subtract b.height from a.height to get descending order
  people.sort((a, b) => b.height - a.height);

  // Step 3: Extract just the names from the sorted array
  const result = people.map((person) => person.name);

  return result;
}
```

```java
// Time: O(n log n) - due to sorting
// Space: O(n) - for storing the pairs
import java.util.*;

class Solution {
    public String[] sortPeople(String[] names, int[] heights) {
        /**
         * Sort names in descending order by their corresponding heights.
         *
         * @param names Array of people's names
         * @param heights Array of distinct positive integers representing heights
         * @return Names sorted by height in descending order
         */
        int n = names.length;

        // Step 1: Create a list of Person objects
        // Using a custom class makes the sorting logic clear
        List<Person> people = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            people.add(new Person(names[i], heights[i]));
        }

        // Step 2: Sort the list in descending order by height
        // Collections.sort with a custom comparator gives us control over the sort order
        Collections.sort(people, (a, b) -> b.height - a.height);

        // Step 3: Extract just the names from the sorted list
        String[] result = new String[n];
        for (int i = 0; i < n; i++) {
            result[i] = people.get(i).name;
        }

        return result;
    }

    // Helper class to store name-height pairs
    class Person {
        String name;
        int height;

        Person(String name, int height) {
            this.name = name;
            this.height = height;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Creating the pairs takes O(n) time
- Sorting the pairs takes O(n log n) time (this is the dominant operation)
- Extracting the names takes O(n) time
- Total: O(n) + O(n log n) + O(n) = O(n log n)

**Space Complexity: O(n)**

- We need O(n) space to store the pairs of (height, name)
- The output array also takes O(n) space
- Total: O(n) + O(n) = O(n)

The O(n log n) time complexity is optimal for comparison-based sorting. We can't do better than this unless we use non-comparison sorting algorithms (like counting sort), but those would only help if the heights had specific constraints (like being within a small range).

## Common Mistakes

1. **Sorting heights independently**: Some candidates sort just the heights array and then try to match names back to heights. This fails because after sorting, you lose the original pairing. Always keep names and heights together during sorting.

2. **Forgetting that heights are distinct**: The problem states heights are distinct, which means we don't need to handle tie-breaking. If heights weren't guaranteed to be distinct, we'd need a secondary sort criterion (like alphabetical order of names).

3. **Incorrect sort order**: The problem asks for descending order (tallest first), but some candidates implement ascending order by mistake. Always double-check the sort direction.

4. **Not handling edge cases**: While the problem guarantees both arrays have the same length and heights are positive, in a real interview you should mention checking for:
   - Empty arrays (return empty array)
   - Single element arrays (return the single name)
   - Null/None inputs

## When You'll See This Pattern

This "sort based on another array" pattern appears in many problems where you need to order one sequence based on values in another sequence. Here are some related problems:

1. **Sort Array by Increasing Frequency (LeetCode 1636)**: Sort numbers based on their frequency counts, with tie-breaking rules. Similar pattern: you need to count frequencies first, then sort based on those counts.

2. **Sort the Students by Their Kth Score (LeetCode 2545)**: Sort a matrix (2D array) based on values in a specific column. The core idea is the same: you're sorting rows based on values in one column.

3. **Relative Sort Array (LeetCode 1122)**: Sort one array based on the order defined by another array. This extends the pattern to custom ordering rather than just numerical ordering.

The key insight across all these problems is: when you need to sort A based on B, keep A and B together during the sorting process, either by creating pairs or by sorting indices.

## Key Takeaways

1. **Pair before you sort**: When you need to sort one array based on values in another, create (value, item) pairs first, then sort the pairs by value. This maintains the relationship throughout the sorting process.

2. **Consider space-time tradeoffs**: The O(n) space for storing pairs is usually acceptable for the clarity it provides. In memory-constrained situations, you could sort indices instead to avoid creating new objects.

3. **Read constraints carefully**: The fact that heights are distinct simplifies the problem. In real interviews, always check for and mention how you'd handle duplicates if they weren't guaranteed to be distinct.

This problem teaches fundamental sorting with custom keys—a pattern that appears in countless real-world applications from sorting database results to organizing UI elements.

Related problems: [Sort Array by Increasing Frequency](/problem/sort-array-by-increasing-frequency), [Sort the Students by Their Kth Score](/problem/sort-the-students-by-their-kth-score)
