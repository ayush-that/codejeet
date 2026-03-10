---
title: "How to Solve Most Frequent Even Element — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Most Frequent Even Element. Easy difficulty, 53.3% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2026-12-10"
category: "dsa-patterns"
tags: ["most-frequent-even-element", "array", "hash-table", "counting", "easy"]
---

# How to Solve Most Frequent Even Element

You're given an array of integers and need to find the even number that appears most frequently. If multiple even numbers have the same highest frequency, return the smallest one. If there are no even numbers, return -1. This problem is interesting because it combines three simple concepts—filtering, counting, and comparison—but requires careful handling of edge cases and tie-breaking logic.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 4, 2, 4, 4, 1, 3, 5]`

**Step 1: Identify even numbers**

- Even numbers: 2, 4, 2, 4, 4
- Odd numbers: 1, 3, 5 (we ignore these)

**Step 2: Count frequencies**

- 2 appears 2 times
- 4 appears 3 times

**Step 3: Find the most frequent**

- Compare frequencies: 3 > 2
- Result: 4

What about ties? Let's try `nums = [2, 4, 2, 4, 1, 3]`

**Step 1: Even numbers**: 2, 4, 2, 4
**Step 2: Frequencies**: 2 appears 2 times, 4 appears 2 times
**Step 3: Tie-breaking**: Both have frequency 2, so we return the smaller number: 2

And for no even numbers: `nums = [1, 3, 5, 7]`
**Step 1**: No even numbers exist
**Result**: Return -1

## Brute Force Approach

A naive approach would be:

1. For each even number in the array
2. Count how many times it appears by scanning the entire array
3. Track the number with the highest count (and smallest value for ties)

This is inefficient because:

- We might count the same number multiple times
- Time complexity becomes O(n²) where n is the array length
- We need extra logic to avoid recounting numbers we've already processed

Here's what the brute force might look like:

```python
def mostFrequentEvenBrute(nums):
    max_freq = 0
    result = -1

    for i in range(len(nums)):
        # Only consider even numbers
        if nums[i] % 2 == 0:
            current_freq = 0

            # Count frequency of this number
            for j in range(len(nums)):
                if nums[j] == nums[i]:
                    current_freq += 1

            # Update result if we found a better candidate
            if current_freq > max_freq or (current_freq == max_freq and nums[i] < result):
                max_freq = current_freq
                result = nums[i]

    return result
```

The problem with this approach is the nested loop. For each even number, we scan the entire array again, leading to O(n²) time complexity. For large arrays (n = 100,000), this would be far too slow.

## Optimal Solution

The optimal approach uses a hash map (dictionary) to count frequencies in a single pass, then processes the counts to find the answer. Here's the step-by-step reasoning:

1. **Count frequencies**: Use a hash map to count occurrences of each number
2. **Filter even numbers**: Only consider numbers where `num % 2 == 0`
3. **Find maximum frequency**: Track the highest frequency seen
4. **Handle ties**: When frequencies are equal, choose the smaller number
5. **Handle no evens**: If no even numbers exist, return -1

The key insight is that we can separate counting from decision-making. First, we gather all the data (frequencies), then we make our decision based on that data.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def mostFrequentEven(nums):
    # Step 1: Count frequencies of all numbers
    freq_map = {}
    for num in nums:
        freq_map[num] = freq_map.get(num, 0) + 1

    # Step 2: Initialize tracking variables
    max_freq = 0      # Track highest frequency seen
    result = -1       # Default result if no even numbers found

    # Step 3: Iterate through frequency map
    for num, freq in freq_map.items():
        # Only consider even numbers
        if num % 2 == 0:
            # Check if this number has higher frequency than current result
            # OR same frequency but smaller number (tie-breaking rule)
            if freq > max_freq or (freq == max_freq and num < result):
                max_freq = freq
                result = num

    # Step 4: Return result (will be -1 if no even numbers found)
    return result
```

```javascript
// Time: O(n) | Space: O(n)
function mostFrequentEven(nums) {
  // Step 1: Count frequencies of all numbers
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Initialize tracking variables
  let maxFreq = 0; // Track highest frequency seen
  let result = -1; // Default result if no even numbers found

  // Step 3: Iterate through frequency map
  for (const [num, freq] of freqMap) {
    // Only consider even numbers
    if (num % 2 === 0) {
      // Check if this number has higher frequency than current result
      // OR same frequency but smaller number (tie-breaking rule)
      if (freq > maxFreq || (freq === maxFreq && num < result)) {
        maxFreq = freq;
        result = num;
      }
    }
  }

  // Step 4: Return result (will be -1 if no even numbers found)
  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int mostFrequentEven(int[] nums) {
    // Step 1: Count frequencies of all numbers
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : nums) {
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    // Step 2: Initialize tracking variables
    int maxFreq = 0;      // Track highest frequency seen
    int result = -1;      // Default result if no even numbers found

    // Step 3: Iterate through frequency map
    for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
        int num = entry.getKey();
        int freq = entry.getValue();

        // Only consider even numbers
        if (num % 2 == 0) {
            // Check if this number has higher frequency than current result
            // OR same frequency but smaller number (tie-breaking rule)
            if (freq > maxFreq || (freq == maxFreq && num < result)) {
                maxFreq = freq;
                result = num;
            }
        }
    }

    // Step 4: Return result (will be -1 if no even numbers found)
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the frequency map requires one pass through the array: O(n)
- Iterating through the frequency map: O(k) where k is the number of unique elements
- In the worst case, all elements are unique, so k = n
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- The frequency map stores at most n key-value pairs (when all elements are unique)
- Additional variables (max_freq, result) use O(1) space
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle the "no even numbers" case**: Many candidates forget that the array might contain only odd numbers. Always initialize your result to -1 and only update it when you find an even number.

2. **Incorrect tie-breaking logic**: When frequencies are equal, you must return the smaller number. A common mistake is to return the first one encountered or the larger one. The comparison `(freq == max_freq and num < result)` handles this correctly.

3. **Checking `num % 2 == 0` at the wrong time**: Some candidates filter the array first, then count. While this works, it's less efficient because you need to create a new filtered array. It's better to count everything first, then filter during the decision phase.

4. **Using integer division for even check**: In some languages, `num % 2` might return negative values for negative numbers. Use `num % 2 == 0` which works correctly for both positive and negative integers in most languages.

## When You'll See This Pattern

This problem combines three fundamental patterns:

1. **Frequency counting with hash maps**: Used in problems where you need to track how many times elements appear. Examples:
   - **Majority Element**: Find the element that appears more than n/2 times
   - **Top K Frequent Elements**: Find the k most frequent elements
   - **Single Number**: Find the element that appears exactly once (others appear twice)

2. **Filter-then-process pattern**: First gather all relevant data, then apply business logic. This separates data collection from decision-making, making code cleaner and easier to debug.

3. **Multi-criteria selection**: When you need to select an element based on multiple criteria (frequency first, then value for ties). This pattern appears in sorting problems with custom comparators.

## Key Takeaways

1. **Hash maps are your go-to for frequency problems**: When a problem asks about "most frequent," "count occurrences," or "find duplicates," reach for a hash map first. It gives you O(1) lookups and updates.

2. **Separate data collection from decision logic**: Count everything first, then apply your selection criteria. This makes your code more readable and avoids complex conditional logic mixed with counting.

3. **Always test edge cases**: Empty arrays, arrays with no even numbers, arrays with all same numbers, arrays with negative numbers, and tie scenarios. These edge cases often reveal bugs in your logic.

Related problems: [Majority Element](/problem/majority-element), [Majority Element II](/problem/majority-element-ii), [Top K Frequent Elements](/problem/top-k-frequent-elements)
