---
title: "How to Solve Count Elements With Maximum Frequency — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Elements With Maximum Frequency. Easy difficulty, 79.8% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2027-07-17"
category: "dsa-patterns"
tags: ["count-elements-with-maximum-frequency", "array", "hash-table", "counting", "easy"]
---

# How to Solve Count Elements With Maximum Frequency

You're given an array of positive integers and need to find the total frequencies of all elements that have the maximum frequency in the array. In other words, if some elements appear 3 times (the most frequent), you need to return 3 × (number of distinct elements that appear 3 times). This problem is interesting because it combines frequency counting with finding maximums and careful summation—a common pattern in many coding interview questions.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 2, 3, 3, 3, 4]`.

**Step 1: Count frequencies**

- 1 appears 1 time
- 2 appears 2 times
- 3 appears 3 times
- 4 appears 1 time

**Step 2: Find maximum frequency**
Looking at the frequencies: 1, 2, 3, 1
The maximum frequency is 3 (element 3 has this frequency)

**Step 3: Identify elements with maximum frequency**
Only element 3 has frequency 3

**Step 4: Calculate total frequencies**
Total = maximum frequency × number of elements with that frequency
Total = 3 × 1 = 3

Let's try another example: `nums = [1, 1, 2, 2, 3, 3]`

**Step 1: Count frequencies**

- 1 appears 2 times
- 2 appears 2 times
- 3 appears 2 times

**Step 2: Find maximum frequency**
All elements have frequency 2, so maximum frequency = 2

**Step 3: Identify elements with maximum frequency**
All three elements (1, 2, 3) have frequency 2

**Step 4: Calculate total frequencies**
Total = 2 × 3 = 6

This visual walkthrough shows we need to: count frequencies, find the maximum, then sum the frequencies of elements that share that maximum.

## Brute Force Approach

A naive approach would be to:

1. For each element, count how many times it appears by scanning the entire array
2. Track the maximum frequency found
3. For each element again, if its frequency equals the maximum, add that frequency to the total

The problem with this approach is efficiency. For an array of size `n`, checking each element against all others gives us O(n²) time complexity. While this would work for small inputs, it's inefficient for larger arrays. Additionally, we'd need to avoid double-counting elements, which adds complexity.

Here's what the brute force might look like:

```python
def maxFrequencyElements_brute(nums):
    max_freq = 0
    n = len(nums)

    # First pass: find maximum frequency
    for i in range(n):
        freq = 0
        for j in range(n):
            if nums[i] == nums[j]:
                freq += 1
        max_freq = max(max_freq, freq)

    # Second pass: count total frequencies of elements with max frequency
    total = 0
    counted = set()
    for i in range(n):
        if nums[i] in counted:
            continue

        freq = 0
        for j in range(n):
            if nums[i] == nums[j]:
                freq += 1

        if freq == max_freq:
            total += freq
            counted.add(nums[i])

    return total
```

This approach has O(n²) time complexity and O(n) space complexity (for the `counted` set). We can do much better!

## Optimal Solution

The optimal solution uses a hash map (dictionary) to count frequencies in a single pass, then processes those frequencies. Here's the step-by-step reasoning:

1. **Count frequencies**: Use a hash map to store how many times each element appears
2. **Find maximum frequency**: Track the highest frequency while counting, or find it after counting
3. **Calculate total**: For each frequency in our map, if it equals the maximum, add it to our total

The key insight is that we can do everything in O(n) time with O(n) space using a hash map.

<div class="code-group">

```python
# Time: O(n) - we make two passes through the data: one to count, one to sum
# Space: O(n) - in the worst case, all elements are unique, so our frequency map has n entries
def maxFrequencyElements(nums):
    # Step 1: Count frequencies of each element
    freq_map = {}
    for num in nums:
        # Increment count for this number, starting at 0 if not seen before
        freq_map[num] = freq_map.get(num, 0) + 1

    # Step 2: Find the maximum frequency
    max_freq = 0
    for freq in freq_map.values():
        max_freq = max(max_freq, freq)

    # Step 3: Sum frequencies of elements that have the maximum frequency
    total = 0
    for freq in freq_map.values():
        if freq == max_freq:
            total += freq

    return total
```

```javascript
// Time: O(n) - two passes through the data
// Space: O(n) - worst case all elements are unique
function maxFrequencyElements(nums) {
  // Step 1: Count frequencies of each element
  const freqMap = new Map();
  for (const num of nums) {
    // Get current count or 0 if not seen, then increment
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Find the maximum frequency
  let maxFreq = 0;
  for (const freq of freqMap.values()) {
    maxFreq = Math.max(maxFreq, freq);
  }

  // Step 3: Sum frequencies of elements that have the maximum frequency
  let total = 0;
  for (const freq of freqMap.values()) {
    if (freq === maxFreq) {
      total += freq;
    }
  }

  return total;
}
```

```java
// Time: O(n) - two passes through the data
// Space: O(n) - worst case all elements are unique
public int maxFrequencyElements(int[] nums) {
    // Step 1: Count frequencies of each element
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : nums) {
        // Increment count for this number, starting at 0 if not seen
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    // Step 2: Find the maximum frequency
    int maxFreq = 0;
    for (int freq : freqMap.values()) {
        maxFreq = Math.max(maxFreq, freq);
    }

    // Step 3: Sum frequencies of elements that have the maximum frequency
    int total = 0;
    for (int freq : freqMap.values()) {
        if (freq == maxFreq) {
            total += freq;
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the frequency map: O(n) - we iterate through all n elements once
- Finding maximum frequency: O(k) where k is the number of unique elements (k ≤ n)
- Summing frequencies with maximum value: O(k)
- Total: O(n + k + k) = O(n) since k ≤ n

**Space Complexity: O(n)**

- The frequency map stores at most n entries (when all elements are unique)
- In the best case (all elements the same), we store only 1 entry
- Additional variables (max_freq, total) use O(1) space

## Common Mistakes

1. **Double-counting elements**: When iterating through the original array to find elements with maximum frequency, you might add the same element's frequency multiple times. Always use a frequency map or track which elements you've already counted.

2. **Confusing "total frequencies" with "count of elements"**: The problem asks for the _sum_ of frequencies, not the _number_ of elements with maximum frequency. For `[1, 2, 2, 3, 3, 3]`, the answer is 3 (just element 3's frequency), not 1 (one element has max frequency).

3. **Inefficient maximum finding**: Some candidates find the maximum by sorting frequencies (O(k log k)) or scanning the array multiple times (O(n²)). The optimal approach finds the maximum in O(k) time while building or after building the frequency map.

4. **Forgetting that elements are positive integers**: While not critical for the hash map approach, this constraint means we don't need to handle negative numbers or zero, which might affect some alternative approaches.

## When You'll See This Pattern

This "frequency counting + aggregation" pattern appears in many problems:

1. **Top K Frequent Elements (LeetCode 347)**: Similar frequency counting, but instead of summing frequencies with the maximum, you find the k most frequent elements.

2. **Sort Characters By Frequency (LeetCode 451)**: Count frequencies, then sort or bucket elements by frequency to reconstruct the string.

3. **Majority Element (LeetCode 169)**: Find the element that appears more than n/2 times—another frequency-based problem.

4. **Find All Duplicates in an Array (LeetCode 442)**: Identify elements that appear exactly twice using frequency counting or marking techniques.

The core pattern is: when you need to analyze how often elements appear, reach for a hash map to count frequencies efficiently.

## Key Takeaways

1. **Hash maps are your friend for frequency problems**: When a problem involves counting occurrences, a hash map/dictionary is usually the right starting point. It gives you O(1) access to update and check frequencies.

2. **Separate counting from processing**: First build the complete frequency map, then analyze it. This clean separation makes code easier to reason about and debug.

3. **Read the problem carefully**: "Total frequencies" means sum of frequencies, not count of elements. Always verify you're computing what's actually asked for.

This problem teaches fundamental hash map usage and demonstrates how to efficiently solve what seems like a multi-step problem with simple, clean operations.

Related problems: [Maximum Frequency of an Element After Performing Operations I](/problem/maximum-frequency-of-an-element-after-performing-operations-i), [Maximum Frequency of an Element After Performing Operations II](/problem/maximum-frequency-of-an-element-after-performing-operations-ii), [Maximum Difference Between Even and Odd Frequency II](/problem/maximum-difference-between-even-and-odd-frequency-ii)
