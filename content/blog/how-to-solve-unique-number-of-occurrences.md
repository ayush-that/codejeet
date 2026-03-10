---
title: "How to Solve Unique Number of Occurrences — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Unique Number of Occurrences. Easy difficulty, 78.6% acceptance rate. Topics: Array, Hash Table."
date: "2026-10-25"
category: "dsa-patterns"
tags: ["unique-number-of-occurrences", "array", "hash-table", "easy"]
---

# How to Solve Unique Number of Occurrences

This problem asks us to determine whether the frequency of each number in an array is unique. While the concept is straightforward, the challenge lies in efficiently tracking both the frequency of each number and ensuring those frequencies don't repeat. What makes this interesting is that we need to solve two related but distinct problems: counting occurrences and checking for duplicates among those counts.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the input array: `[1, 2, 2, 1, 1, 3]`

**Step 1: Count occurrences of each number**

- Number 1 appears 3 times
- Number 2 appears 2 times
- Number 3 appears 1 time

So we have frequencies: `[3, 2, 1]`

**Step 2: Check if frequencies are unique**

- Frequency 3 appears once
- Frequency 2 appears once
- Frequency 1 appears once

All frequencies are unique, so we return `true`.

Now let's try a counterexample: `[1, 2, 2, 3, 3, 3]`

**Step 1: Count occurrences**

- Number 1 appears 1 time
- Number 2 appears 2 times
- Number 3 appears 3 times

Frequencies: `[1, 2, 3]` (all unique) → `true`

Wait, that's actually unique! Let's try: `[1, 1, 2, 2, 3, 3]`

**Step 1: Count occurrences**

- Number 1 appears 2 times
- Number 2 appears 2 times
- Number 3 appears 2 times

Frequencies: `[2, 2, 2]` (2 appears three times) → `false`

The key insight is that we need to track both:

1. How many times each number appears
2. Whether any frequency value repeats

## Brute Force Approach

A naive approach might involve:

1. For each number, count its occurrences by scanning the entire array
2. Store these counts in a list
3. For each count, check if it appears again in the list

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def uniqueOccurrences_brute(arr):
    # Step 1: Get unique numbers
    unique_nums = []
    for num in arr:
        if num not in unique_nums:
            unique_nums.append(num)

    # Step 2: Count occurrences for each unique number
    counts = []
    for num in unique_nums:
        count = 0
        for val in arr:
            if val == num:
                count += 1
        counts.append(count)

    # Step 3: Check for duplicate counts
    for i in range(len(counts)):
        for j in range(i + 1, len(counts)):
            if counts[i] == counts[j]:
                return False

    return True
```

```javascript
// Time: O(n²) | Space: O(n)
function uniqueOccurrencesBrute(arr) {
  // Step 1: Get unique numbers
  const uniqueNums = [];
  for (const num of arr) {
    if (!uniqueNums.includes(num)) {
      uniqueNums.push(num);
    }
  }

  // Step 2: Count occurrences for each unique number
  const counts = [];
  for (const num of uniqueNums) {
    let count = 0;
    for (const val of arr) {
      if (val === num) {
        count++;
      }
    }
    counts.push(count);
  }

  // Step 3: Check for duplicate counts
  for (let i = 0; i < counts.length; i++) {
    for (let j = i + 1; j < counts.length; j++) {
      if (counts[i] === counts[j]) {
        return false;
      }
    }
  }

  return true;
}
```

```java
// Time: O(n²) | Space: O(n)
public boolean uniqueOccurrencesBrute(int[] arr) {
    // Step 1: Get unique numbers
    List<Integer> uniqueNums = new ArrayList<>();
    for (int num : arr) {
        if (!uniqueNums.contains(num)) {
            uniqueNums.add(num);
        }
    }

    // Step 2: Count occurrences for each unique number
    List<Integer> counts = new ArrayList<>();
    for (int num : uniqueNums) {
        int count = 0;
        for (int val : arr) {
            if (val == num) {
                count++;
            }
        }
        counts.add(count);
    }

    // Step 3: Check for duplicate counts
    for (int i = 0; i < counts.size(); i++) {
        for (int j = i + 1; j < counts.size(); j++) {
            if (counts.get(i).equals(counts.get(j))) {
                return false;
            }
        }
    }

    return true;
}
```

</div>

**Why this is inefficient:**

- Time complexity is O(n²) because we have nested loops
- The `contains()`/`includes()`/`in` checks are O(n) each time
- We're doing redundant work by scanning the array multiple times

## Optimal Solution

The optimal approach uses two hash maps (or dictionaries/objects):

1. First hash map: Count occurrences of each number
2. Second hash map (or set): Track which frequencies we've seen

The key insight is that we can use a set to efficiently check for duplicate frequencies in O(1) time.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def uniqueOccurrences(arr):
    """
    Determines if the number of occurrences of each value in the array is unique.

    Approach:
    1. Count frequency of each number using a dictionary
    2. Check if all frequencies are unique using a set
    3. Compare sizes - if they match, all frequencies are unique

    Args:
        arr: List of integers

    Returns:
        bool: True if frequencies are unique, False otherwise
    """
    # Step 1: Count frequency of each number
    # We'll use a dictionary where keys are numbers and values are their counts
    freq_map = {}

    # Iterate through each number in the array
    for num in arr:
        # If number is already in dictionary, increment its count
        # Otherwise, initialize count to 1
        freq_map[num] = freq_map.get(num, 0) + 1

    # Step 2: Check if frequencies are unique
    # Convert frequency values to a set
    # Sets automatically remove duplicates, so size will be smaller if there were duplicates
    freq_set = set(freq_map.values())

    # Step 3: Compare sizes
    # If the set size equals the map size, all frequencies were unique
    # If there were duplicate frequencies, the set would be smaller
    return len(freq_set) == len(freq_map)
```

```javascript
// Time: O(n) | Space: O(n)
function uniqueOccurrences(arr) {
  /**
   * Determines if the number of occurrences of each value in the array is unique.
   *
   * Approach:
   * 1. Count frequency of each number using an object
   * 2. Check if all frequencies are unique using a Set
   * 3. Compare sizes - if they match, all frequencies are unique
   *
   * @param {number[]} arr - Array of integers
   * @return {boolean} - True if frequencies are unique, False otherwise
   */

  // Step 1: Count frequency of each number
  // We'll use an object where keys are numbers and values are their counts
  const freqMap = {};

  // Iterate through each number in the array
  for (const num of arr) {
    // If number is already in object, increment its count
    // Otherwise, initialize count to 1
    freqMap[num] = (freqMap[num] || 0) + 1;
  }

  // Step 2: Check if frequencies are unique
  // Get all frequency values and convert to a Set
  // Sets automatically remove duplicates, so size will be smaller if there were duplicates
  const freqValues = Object.values(freqMap);
  const freqSet = new Set(freqValues);

  // Step 3: Compare sizes
  // If the set size equals the array of values size, all frequencies were unique
  // If there were duplicate frequencies, the set would be smaller
  return freqSet.size === freqValues.length;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean uniqueOccurrences(int[] arr) {
    /**
     * Determines if the number of occurrences of each value in the array is unique.
     *
     * Approach:
     * 1. Count frequency of each number using a HashMap
     * 2. Check if all frequencies are unique using a HashSet
     * 3. Compare sizes - if they match, all frequencies are unique
     *
     * @param arr - Array of integers
     * @return boolean - True if frequencies are unique, False otherwise
     */

    // Step 1: Count frequency of each number
    // We'll use a HashMap where keys are numbers and values are their counts
    Map<Integer, Integer> freqMap = new HashMap<>();

    // Iterate through each number in the array
    for (int num : arr) {
        // If number is already in map, increment its count
        // Otherwise, initialize count to 1
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    // Step 2: Check if frequencies are unique
    // Get all frequency values and add to a HashSet
    // Sets automatically remove duplicates, so size will be smaller if there were duplicates
    Set<Integer> freqSet = new HashSet<>(freqMap.values());

    // Step 3: Compare sizes
    // If the set size equals the map size, all frequencies were unique
    // If there were duplicate frequencies, the set would be smaller
    return freqSet.size() == freqMap.size();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the frequency map: O(n) - we iterate through the array once
- Creating the set from frequency values: O(k) where k is the number of unique numbers
- Since k ≤ n in the worst case, overall time is O(n)

**Space Complexity: O(n)**

- Frequency map stores at most n entries (if all numbers are unique)
- Set stores at most n frequency values
- In practice, both store at most the number of unique numbers, which is ≤ n

## Common Mistakes

1. **Forgetting to handle empty or single-element arrays**
   - Empty array: All numbers (none) have unique frequencies → should return `true`
   - Single element: That element appears once, and frequency 1 is unique → should return `true`
   - Always test edge cases: `[]`, `[1]`, `[1,1]`

2. **Using arrays instead of hash maps for counting**
   - Some candidates try to use an array sized to the maximum value
   - This fails when numbers are large or negative
   - Hash maps handle any integer value efficiently

3. **Incorrect duplicate checking**
   - Comparing each frequency with every other frequency (O(k²) time)
   - Forgetting that multiple numbers can have the same count
   - The set comparison trick (`len(set) == len(map)`) is elegant and efficient

4. **Confusing numbers with their frequencies**
   - Remember: We're checking if FREQUENCIES are unique, not if the NUMBERS are unique
   - `[1, 2, 2, 3, 3, 3]` has numbers 1, 2, 3 with frequencies 1, 2, 3 (all unique)
   - `[1, 1, 2, 2]` has numbers 1, 2 with frequencies 2, 2 (not unique)

## When You'll See This Pattern

This "count then check uniqueness" pattern appears in many problems:

1. **Two Sum** (LeetCode #1) - Similar pattern of using a hash map to track what we've seen
2. **Contains Duplicate** (LeetCode #217) - Checking for duplicates using a set
3. **Group Anagrams** (LeetCode #49) - Using character counts as keys in a hash map
4. **Find All Anagrams in a String** (LeetCode #438) - Comparing frequency maps

The core technique is using hash maps to count occurrences and sets to check for duplicates. This combination is powerful for many frequency-based problems.

## Key Takeaways

1. **Hash maps are ideal for counting frequencies** - They provide O(1) insertion and lookup, making frequency counting efficient regardless of input size.

2. **Sets efficiently check for duplicates** - Converting a collection to a set removes duplicates, and comparing sizes tells you if there were any duplicates.

3. **Break complex problems into simpler steps** - This problem combines two simpler operations: counting frequencies and checking for duplicates. Solving each separately makes the overall solution clearer.

4. **The size comparison trick is elegant** - Instead of manually checking for duplicates, compare the size of a set (with duplicates removed) to the original collection size.

[Practice this problem on CodeJeet](/problem/unique-number-of-occurrences)
