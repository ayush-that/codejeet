---
title: "How to Solve Sort Array by Increasing Frequency — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sort Array by Increasing Frequency. Easy difficulty, 80.7% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2027-10-20"
category: "dsa-patterns"
tags: ["sort-array-by-increasing-frequency", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Sort Array by Increasing Frequency

This problem asks us to sort an array based on how often each number appears. Numbers that appear more frequently should come later in the sorted array (increasing frequency order). When two numbers have the same frequency, we need to sort them in decreasing numerical order. The challenge lies in combining two different sorting criteria: first by frequency, then by value when frequencies tie.

## Visual Walkthrough

Let's trace through an example: `nums = [1,1,2,2,2,3]`

**Step 1: Count frequencies**

- 1 appears 2 times
- 2 appears 3 times
- 3 appears 1 time

**Step 2: Sort according to the rules**
We need to sort by frequency first (ascending), then by value (descending when frequencies tie).

Current data: (value: frequency)

- 1: 2
- 2: 3
- 3: 1

Sorting logic:

1. Compare by frequency: 3 (freq=1) comes before 1 (freq=2) comes before 2 (freq=3)
2. No ties in frequency, so we don't need to use the secondary sort

**Step 3: Build the result array**
For each element in sorted order, we need to add it to the result as many times as its frequency:

- 3 appears 1 time → [3]
- 1 appears 2 times → [3, 1, 1]
- 2 appears 3 times → [3, 1, 1, 2, 2, 2]

Final result: `[3, 1, 1, 2, 2, 2]`

Let's try another example with ties: `nums = [2,3,1,3,2]`

**Step 1: Count frequencies**

- 1 appears 1 time
- 2 appears 2 times
- 3 appears 2 times

**Step 2: Sort according to rules**
Data: (value: frequency)

- 1: 1
- 2: 2
- 3: 2

Sorting:

1. Compare by frequency: 1 (freq=1) comes before both 2 and 3 (freq=2)
2. For 2 and 3 (both freq=2), we need to sort by value in descending order → 3 comes before 2

**Step 3: Build result**

- 1 appears 1 time → [1]
- 3 appears 2 times → [1, 3, 3]
- 2 appears 2 times → [1, 3, 3, 2, 2]

Final result: `[1, 3, 3, 2, 2]`

## Brute Force Approach

A naive approach would be to:

1. Count frequencies of each number
2. For each unique number, create a pair (frequency, value)
3. Use a custom sorting function that compares frequencies first, then values when frequencies tie
4. Build the result by repeating each value according to its frequency

While this approach is actually optimal for this problem (O(n log n) time), let's consider what a truly brute force approach might look like:

We could try to sort the array directly by implementing a custom comparison that requires counting frequencies on the fly. For each comparison between two elements, we'd need to:

1. Count how many times element A appears in the array
2. Count how many times element B appears in the array
3. Compare these counts
4. If counts are equal, compare the values themselves

This would be O(n² log n) time because each comparison takes O(n) time and we need O(n log n) comparisons. This is clearly inefficient when we can count frequencies once in O(n) time.

## Optimal Solution

The optimal solution follows the intuitive approach we visualized:

1. Count frequencies using a hash map (O(n) time)
2. Sort the unique values based on frequency (ascending) and value (descending when frequencies tie)
3. Build the result array by repeating each value according to its frequency

The key insight is that we need a custom sorting comparator that handles both criteria. In Python, we can use a lambda function. In JavaScript and Java, we need to define custom comparison logic.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def frequencySort(nums):
    """
    Sort array by increasing frequency. When frequencies tie,
    sort by decreasing value.
    """
    # Step 1: Count frequencies using a dictionary
    freq_map = {}
    for num in nums:
        freq_map[num] = freq_map.get(num, 0) + 1

    # Step 2: Sort the numbers based on frequency and value
    # We sort the original array's unique values (keys of freq_map)
    # The lambda function returns a tuple: (frequency, -value)
    # Python sorts tuples element by element
    # For frequency: ascending order (default)
    # For -value: since we use negative, larger values become smaller
    sorted_nums = sorted(freq_map.keys(), key=lambda x: (freq_map[x], -x))

    # Step 3: Build the result array
    result = []
    for num in sorted_nums:
        # Append the number freq_map[num] times
        result.extend([num] * freq_map[num])

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function frequencySort(nums) {
  // Step 1: Count frequencies using a Map
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Sort the array based on custom comparator
  // We need to sort the original array, not just unique values,
  // because we need to return all elements
  return nums.sort((a, b) => {
    // Get frequencies for comparison
    const freqA = freqMap.get(a);
    const freqB = freqMap.get(b);

    // Primary sort: by frequency (ascending)
    if (freqA !== freqB) {
      return freqA - freqB;
    }

    // Secondary sort: by value (descending)
    // For descending order, return b - a
    return b - a;
  });
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[] frequencySort(int[] nums) {
        // Step 1: Count frequencies using a HashMap
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int num : nums) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        // Step 2: Convert array to Integer[] for custom sorting
        // We need Integer[] to use custom comparator
        Integer[] numsObj = new Integer[nums.length];
        for (int i = 0; i < nums.length; i++) {
            numsObj[i] = nums[i];
        }

        // Step 3: Sort with custom comparator
        Arrays.sort(numsObj, new Comparator<Integer>() {
            @Override
            public int compare(Integer a, Integer b) {
                // Get frequencies
                int freqA = freqMap.get(a);
                int freqB = freqMap.get(b);

                // Compare by frequency first
                if (freqA != freqB) {
                    return freqA - freqB; // Ascending order
                }

                // If frequencies are equal, compare by value in descending order
                return b - a; // Descending order
            }
        });

        // Step 4: Convert back to int[]
        for (int i = 0; i < nums.length; i++) {
            nums[i] = numsObj[i];
        }

        return nums;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Counting frequencies: O(n) where n is the length of the input array
- Sorting: O(n log n) for the comparison sort
- Building the result: O(n) in the Python version (extending the list)
- The sorting step dominates, giving us O(n log n) overall

**Space Complexity: O(n)**

- Frequency map: O(k) where k is the number of unique elements (k ≤ n)
- In Python: Additional O(n) for the result array
- In JavaScript/Java: Sorting is in-place, but we still need O(n) for the frequency map
- Worst case when all elements are unique: O(n) for the frequency map

## Common Mistakes

1. **Mixing up the sort order for frequencies and values**: The problem asks for increasing frequency (ascending) but decreasing value when frequencies tie. A common mistake is to sort both in ascending order or both in descending order. Always double-check: "increasing frequency" means smaller frequencies first, "decreasing order" for values means larger numbers first when frequencies are equal.

2. **Forgetting to handle the frequency counting properly for the comparator**: In JavaScript and Java solutions, if you try to count frequencies inside the comparator function, you'll get O(n² log n) time complexity. Always count frequencies once before sorting.

3. **In Java, trying to sort primitive arrays with custom comparators**: Java's `Arrays.sort()` doesn't support custom comparators for primitive arrays like `int[]`. You need to convert to `Integer[]` first, sort, then convert back. This is a common stumbling block.

4. **Not considering all elements in the result**: Some implementations might only include unique values in the result instead of repeating each value according to its frequency. Remember: if a number appears 3 times in the input, it must appear 3 times in the output.

## When You'll See This Pattern

This problem combines two fundamental patterns: frequency counting with hash maps and custom sorting with multiple criteria. You'll see variations of this pattern in:

1. **Sort Characters By Frequency (LeetCode 451)**: Very similar problem but with characters instead of numbers and single sort criterion (frequency only, descending).

2. **Top K Frequent Elements (LeetCode 347)**: Uses frequency counting but then needs to find the k most frequent elements, often solved with a min-heap or bucket sort.

3. **Custom sorting problems**: Any problem that requires sorting by multiple criteria (like "sort students by grade, then by name") uses the same approach of defining a custom comparator that considers primary and secondary keys.

The core technique of counting frequencies first, then using those counts in a sorting operation is widely applicable to optimization problems where you need to prioritize elements based on how often they occur.

## Key Takeaways

1. **When sorting by derived properties (like frequency), compute those properties first**: Don't try to compute frequencies during comparison - this leads to inefficient O(n² log n) solutions. Always use a hash map to count frequencies in O(n) time first.

2. **For multi-criteria sorting, define clear primary and secondary keys**: In this case, frequency is the primary key (ascending), value is the secondary key (descending when primary keys tie). Most languages support this through tuple sorting or custom comparators.

3. **Pay attention to data type requirements**: In Java, primitive arrays can't use custom comparators directly. You need wrapper classes. In Python, the `sorted()` function with a lambda returning a tuple is often the cleanest solution.

Related problems: [Sort Characters By Frequency](/problem/sort-characters-by-frequency), [Divide Array Into Equal Pairs](/problem/divide-array-into-equal-pairs), [Most Frequent Number Following Key In an Array](/problem/most-frequent-number-following-key-in-an-array)
