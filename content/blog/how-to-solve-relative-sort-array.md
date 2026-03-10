---
title: "How to Solve Relative Sort Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Relative Sort Array. Easy difficulty, 75.1% acceptance rate. Topics: Array, Hash Table, Sorting, Counting Sort."
date: "2027-08-02"
category: "dsa-patterns"
tags: ["relative-sort-array", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Relative Sort Array

You’re given two arrays: `arr1` and `arr2`. All elements in `arr2` are distinct and also appear in `arr1`. Your task is to sort `arr1` so that elements appear in the same relative order as they do in `arr2`. Any elements in `arr1` that aren’t in `arr2` should be placed at the end in ascending order.

What makes this problem interesting is that it’s not a standard sort—it’s a **custom ordering** problem. You can’t just call a generic sort function; you need to define a custom comparison rule based on `arr2` and handle leftover elements separately.

## Visual Walkthrough

Let’s walk through an example to build intuition.

**Input:**

```
arr1 = [2,3,1,3,2,4,6,7,9,2,19]
arr2 = [2,1,4,3,9,6]
```

**Step 1: Understand the goal**
We want to rearrange `arr1` so that:

1. All elements that appear in `arr2` come first, in the exact order they appear in `arr2`
2. Elements not in `arr2` come after, sorted in ascending order

**Step 2: Count frequencies**
First, let’s count how many times each number appears in `arr1`:

- 2 appears 3 times
- 3 appears 2 times
- 1 appears 1 time
- 4 appears 1 time
- 6 appears 1 time
- 7 appears 1 time
- 9 appears 1 time
- 19 appears 1 time

**Step 3: Build result following arr2 order**
Now we go through `arr2` in order:

- First element in `arr2` is 2 → add all 2's: `[2, 2, 2]`
- Next is 1 → add all 1's: `[2, 2, 2, 1]`
- Next is 4 → add all 4's: `[2, 2, 2, 1, 4]`
- Next is 3 → add all 3's: `[2, 2, 2, 1, 4, 3, 3]`
- Next is 9 → add all 9's: `[2, 2, 2, 1, 4, 3, 3, 9]`
- Next is 6 → add all 6's: `[2, 2, 2, 1, 4, 3, 3, 9, 6]`

**Step 4: Add remaining elements**
Elements in `arr1` but not in `arr2`: 7 and 19
Sort them ascending: 7, 19
Add to end: `[2, 2, 2, 1, 4, 3, 3, 9, 6, 7, 19]`

**Final result:** `[2, 2, 2, 1, 4, 3, 3, 9, 6, 7, 19]`

## Brute Force Approach

A naive approach might be to:

1. Create an empty result array
2. For each element in `arr2`, find all occurrences in `arr1` and append them to result
3. Remove those elements from `arr1` (or mark them as used)
4. Sort the remaining elements in `arr1` and append them

The problem with this approach is efficiency. Finding and removing elements from an array is expensive:

- Finding all occurrences of an element requires scanning the entire array: O(n) per element
- Removing elements from an array requires shifting elements: O(n) per removal
- Overall complexity could be O(n²) in worst case

Additionally, marking elements as "used" requires extra space and careful tracking to avoid duplicates.

## Optimal Solution

The optimal approach uses **counting sort** with a hash map. Here's the strategy:

1. Count the frequency of each element in `arr1` using a hash map
2. Create a result array
3. For each element in `arr2` (in order), add that element to the result as many times as it appears in `arr1`
4. Remove those elements from our frequency count
5. For the remaining elements (keys in our frequency map), sort them and add them to the result

This approach is efficient because:

- Counting frequencies: O(n)
- Building result by following `arr2` order: O(m + n) where m is length of `arr2`
- Sorting remaining elements: O(k log k) where k is number of unique remaining elements
- Overall: O(n + k log k), which is much better than O(n²)

<div class="code-group">

```python
# Time: O(n + k log k) where n = len(arr1), k = number of unique elements not in arr2
# Space: O(n) for the frequency map and result array
def relativeSortArray(arr1, arr2):
    # Step 1: Count frequency of each element in arr1
    freq = {}
    for num in arr1:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Initialize result array
    result = []

    # Step 3: Add elements in the order specified by arr2
    for num in arr2:
        if num in freq:
            # Add this number as many times as it appears
            result.extend([num] * freq[num])
            # Remove from frequency map since we've used all occurrences
            del freq[num]

    # Step 4: Get remaining elements (not in arr2)
    remaining = []
    for num, count in freq.items():
        # Add each remaining number count times
        remaining.extend([num] * count)

    # Step 5: Sort remaining elements and add to result
    remaining.sort()
    result.extend(remaining)

    return result
```

```javascript
// Time: O(n + k log k) where n = arr1.length, k = number of unique elements not in arr2
// Space: O(n) for the frequency map and result array
function relativeSortArray(arr1, arr2) {
  // Step 1: Count frequency of each element in arr1
  const freq = new Map();
  for (const num of arr1) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Initialize result array
  const result = [];

  // Step 3: Add elements in the order specified by arr2
  for (const num of arr2) {
    if (freq.has(num)) {
      // Add this number as many times as it appears
      const count = freq.get(num);
      for (let i = 0; i < count; i++) {
        result.push(num);
      }
      // Remove from frequency map since we've used all occurrences
      freq.delete(num);
    }
  }

  // Step 4: Get remaining elements (not in arr2)
  const remaining = [];
  for (const [num, count] of freq) {
    // Add each remaining number count times
    for (let i = 0; i < count; i++) {
      remaining.push(num);
    }
  }

  // Step 5: Sort remaining elements and add to result
  remaining.sort((a, b) => a - b);
  result.push(...remaining);

  return result;
}
```

```java
// Time: O(n + k log k) where n = arr1.length, k = number of unique elements not in arr2
// Space: O(n) for the frequency map and result list
public int[] relativeSortArray(int[] arr1, int[] arr2) {
    // Step 1: Count frequency of each element in arr1
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : arr1) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    // Step 2: Initialize result list (we'll convert to array at the end)
    List<Integer> result = new ArrayList<>();

    // Step 3: Add elements in the order specified by arr2
    for (int num : arr2) {
        if (freq.containsKey(num)) {
            // Add this number as many times as it appears
            int count = freq.get(num);
            for (int i = 0; i < count; i++) {
                result.add(num);
            }
            // Remove from frequency map since we've used all occurrences
            freq.remove(num);
        }
    }

    // Step 4: Get remaining elements (not in arr2)
    List<Integer> remaining = new ArrayList<>();
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
        int num = entry.getKey();
        int count = entry.getValue();
        // Add each remaining number count times
        for (int i = 0; i < count; i++) {
            remaining.add(num);
        }
    }

    // Step 5: Sort remaining elements and add to result
    Collections.sort(remaining);
    result.addAll(remaining);

    // Convert list to array
    int[] resultArray = new int[result.size()];
    for (int i = 0; i < result.size(); i++) {
        resultArray[i] = result.get(i);
    }

    return resultArray;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Counting frequencies in `arr1`: O(n) where n is length of `arr1`
- Building result by following `arr2` order: O(m + n) where m is length of `arr2` (we process each element in `arr2` and potentially add multiple elements from `arr1`)
- Sorting remaining elements: O(k log k) where k is the number of unique elements not in `arr2`
- **Overall: O(n + k log k)**

**Space Complexity:**

- Frequency map: O(u) where u is number of unique elements in `arr1`
- Result array: O(n)
- **Overall: O(n)** (since we need to store the result)

In the worst case where all elements in `arr1` are unique and none are in `arr2`, k = n, so time complexity becomes O(n log n), which is still efficient.

## Common Mistakes

1. **Forgetting to handle duplicates correctly**: Some candidates add each element only once instead of adding it as many times as it appears in `arr1`. Remember: if `arr1` has three 2's, the result should have three 2's.

2. **Not properly removing used elements from frequency count**: After adding all occurrences of an element from `arr2`, you must remove it from your frequency map. Otherwise, you might add it again when processing remaining elements.

3. **Incorrectly sorting remaining elements**: The problem specifies that elements not in `arr2` should be placed at the end in **ascending order**. Some candidates forget to sort them or sort them in the wrong order.

4. **Using inefficient data structures**: Avoid using arrays with large indices (like size 1001) unless the problem constraints guarantee small values. The hash map approach works for any integer values and is more general.

## When You'll See This Pattern

This problem teaches the **frequency counting + custom ordering** pattern, which appears in many coding problems:

1. **Sort Characters By Frequency (LeetCode 451)**: Similar concept but with characters instead of numbers. You count frequencies, then sort by frequency instead of a custom order.

2. **Custom Sort String (LeetCode 791)**: Almost identical to this problem but with strings instead of arrays of integers.

3. **Top K Frequent Elements (LeetCode 347)**: Uses frequency counting but then finds the most frequent elements rather than custom ordering.

The core pattern is: when you need to reorder elements based on some custom rule (not natural ordering), think about counting frequencies first, then building the result according to your rule.

## Key Takeaways

1. **Frequency maps are your friend**: When you need to track counts of elements, a hash map (dictionary) is usually the right tool. It gives you O(1) access to counts.

2. **Separate "rule-based" ordering from "natural" ordering**: Handle elements that follow a custom rule first, then handle the rest with standard sorting. This keeps your logic clean.

3. **Think about what to do with "leftover" elements**: Many ordering problems have elements that don't fit the main rule. Always clarify what should happen to them (in this case, sort them ascending).

[Practice this problem on CodeJeet](/problem/relative-sort-array)
