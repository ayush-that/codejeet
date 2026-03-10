---
title: "How to Solve Sort Characters By Frequency — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort Characters By Frequency. Medium difficulty, 75.1% acceptance rate. Topics: Hash Table, String, Sorting, Heap (Priority Queue), Bucket Sort."
date: "2026-09-28"
category: "dsa-patterns"
tags: ["sort-characters-by-frequency", "hash-table", "string", "sorting", "medium"]
---

# How to Solve Sort Characters By Frequency

This problem asks us to rearrange a string so characters appear in order from most frequent to least frequent. The challenge is efficiently counting frequencies and then reconstructing the string in the correct order. What makes this interesting is that while it seems like a simple sorting problem, the most efficient solutions use clever combinations of data structures to achieve better performance than plain sorting.

## Visual Walkthrough

Let's trace through an example: `s = "tree"`

**Step 1: Count frequencies**

- 't': appears 1 time
- 'r': appears 1 time
- 'e': appears 2 times

**Step 2: Sort by frequency**
Characters sorted by frequency: ['e', 't', 'r'] (or ['e', 'r', 't'] since 't' and 'r' have equal frequency)

**Step 3: Build result string**

- Append 'e' twice: "ee"
- Append 't' once: "eet"
- Append 'r' once: "eetr"

The final result is "eetr" (or "eert" would also be valid since 't' and 'r' have equal frequency).

For another example: `s = "Aabb"`

- 'A': 1, 'a': 1, 'b': 2
- Sorted: ['b', 'A', 'a'] (or ['b', 'a', 'A'])
- Result: "bbaA" or "bbAa"

## Brute Force Approach

The most straightforward approach is:

1. Count frequency of each character using a hash map
2. Sort the characters by their frequency in descending order
3. Build the result string by repeating each character according to its frequency

While this approach works, the sorting step takes O(n log n) time where n is the number of unique characters. For strings with many unique characters (like long strings with mostly distinct characters), this could be inefficient. More importantly, there's a better way using bucket sort that can achieve O(n) time complexity.

Here's what the brute force looks like:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def frequencySort(s: str) -> str:
    # Step 1: Count frequencies
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Step 2: Sort characters by frequency (descending)
    sorted_chars = sorted(freq.keys(), key=lambda x: freq[x], reverse=True)

    # Step 3: Build result
    result = []
    for char in sorted_chars:
        result.append(char * freq[char])

    return ''.join(result)
```

```javascript
// Time: O(n log n) | Space: O(n)
function frequencySort(s) {
  // Step 1: Count frequencies
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Step 2: Sort characters by frequency (descending)
  const sortedChars = Array.from(freq.keys()).sort((a, b) => freq.get(b) - freq.get(a));

  // Step 3: Build result
  let result = "";
  for (const char of sortedChars) {
    result += char.repeat(freq.get(char));
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
public String frequencySort(String s) {
    // Step 1: Count frequencies
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }

    // Step 2: Sort characters by frequency (descending)
    List<Character> chars = new ArrayList<>(freq.keySet());
    chars.sort((a, b) -> freq.get(b) - freq.get(a));

    // Step 3: Build result
    StringBuilder result = new StringBuilder();
    for (char c : chars) {
        for (int i = 0; i < freq.get(c); i++) {
            result.append(c);
        }
    }

    return result.toString();
}
```

</div>

## Optimized Approach

The key insight is that we can use **bucket sort** to achieve O(n) time complexity. Here's the reasoning:

1. **Frequency counting is already O(n)** - We need to examine each character once
2. **The maximum frequency is bounded by n** - No character can appear more than n times
3. **We can use an array of lists (buckets) where index = frequency** - This lets us group characters by their frequency
4. **Building the result from highest to lowest frequency is O(n)** - We iterate through buckets from highest to lowest frequency

The bucket sort approach works because:

- We create an array where each index represents a frequency
- At each index, we store all characters with that frequency
- We then traverse this array from highest to lowest frequency, appending characters the appropriate number of times

This eliminates the O(n log n) sorting step, giving us O(n) time complexity.

## Optimal Solution

Here's the bucket sort implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def frequencySort(s: str) -> str:
    # Step 1: Count frequency of each character
    # We'll use a dictionary to store character -> frequency
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Step 2: Create buckets where index = frequency
    # The maximum possible frequency is len(s), so we need len(s) + 1 buckets
    # (including index 0 which we won't use)
    max_freq = max(freq.values()) if freq else 0
    buckets = [[] for _ in range(max_freq + 1)]

    # Step 3: Place characters in their corresponding frequency bucket
    for char, count in freq.items():
        buckets[count].append(char)

    # Step 4: Build the result string
    # Start from highest frequency and go down to 1
    result = []
    for count in range(max_freq, 0, -1):
        # For each character in this frequency bucket
        for char in buckets[count]:
            # Append the character 'count' times
            result.append(char * count)

    return ''.join(result)
```

```javascript
// Time: O(n) | Space: O(n)
function frequencySort(s) {
  // Step 1: Count frequency of each character
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Step 2: Create buckets where index = frequency
  // Find maximum frequency to determine bucket array size
  let maxFreq = 0;
  for (const count of freq.values()) {
    maxFreq = Math.max(maxFreq, count);
  }

  // Create array of buckets (index 0 won't be used)
  const buckets = new Array(maxFreq + 1).fill().map(() => []);

  // Step 3: Place characters in their corresponding frequency bucket
  for (const [char, count] of freq.entries()) {
    buckets[count].push(char);
  }

  // Step 4: Build the result string
  let result = "";
  // Start from highest frequency and go down to 1
  for (let count = maxFreq; count > 0; count--) {
    // For each character in this frequency bucket
    for (const char of buckets[count]) {
      // Append the character 'count' times
      result += char.repeat(count);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public String frequencySort(String s) {
    // Step 1: Count frequency of each character
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) {
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    }

    // Step 2: Create buckets where index = frequency
    // Find maximum frequency to determine bucket array size
    int maxFreq = 0;
    for (int count : freq.values()) {
        maxFreq = Math.max(maxFreq, count);
    }

    // Create list of buckets (index 0 won't be used)
    List<List<Character>> buckets = new ArrayList<>();
    for (int i = 0; i <= maxFreq; i++) {
        buckets.add(new ArrayList<>());
    }

    // Step 3: Place characters in their corresponding frequency bucket
    for (Map.Entry<Character, Integer> entry : freq.entrySet()) {
        char c = entry.getKey();
        int count = entry.getValue();
        buckets.get(count).add(c);
    }

    // Step 4: Build the result string
    StringBuilder result = new StringBuilder();
    // Start from highest frequency and go down to 1
    for (int count = maxFreq; count > 0; count--) {
        // For each character in this frequency bucket
        for (char c : buckets.get(count)) {
            // Append the character 'count' times
            for (int i = 0; i < count; i++) {
                result.append(c);
            }
        }
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies: O(n) where n is the length of the string
- Creating buckets: O(k) where k is the number of unique characters (k ≤ n)
- Placing characters in buckets: O(k)
- Building result: O(n) (each character is appended once)

**Space Complexity: O(n)**

- Frequency map: O(k) where k is the number of unique characters
- Buckets array: O(n) in worst case (if all characters are unique, we need n+1 buckets)
- Result string: O(n)

The O(n) time complexity is optimal because we must examine each character at least once to count its frequency.

## Common Mistakes

1. **Forgetting to handle empty string**: Always check for edge cases. An empty string should return an empty string.

2. **Incorrect bucket size**: The bucket array needs to be size `max_freq + 1` because array indices start at 0, but we need to store characters with frequency `max_freq` at index `max_freq`.

3. **Using the wrong sorting order**: The problem asks for decreasing order (most frequent first), not increasing order. Make sure to iterate buckets from highest to lowest frequency.

4. **Not handling characters with same frequency correctly**: The problem states "If there are multiple answers, return any of them." Characters with the same frequency can appear in any order, so don't waste time trying to sort them alphabetically.

5. **Inefficient string concatenation**: In languages like Python and Java, repeatedly concatenating strings with `+` creates new string objects. Use `join()` in Python or `StringBuilder` in Java for better performance.

## When You'll See This Pattern

This frequency counting + bucket sort pattern appears in several other problems:

1. **Top K Frequent Elements (LeetCode 347)**: Very similar problem - instead of sorting all elements by frequency, you only need the top K. The bucket sort approach works well here too.

2. **First Unique Character in a String (LeetCode 387)**: Requires counting character frequencies and then finding the first one with frequency 1.

3. **Sort Array by Increasing Frequency (LeetCode 1636)**: Almost identical problem but with numbers instead of characters and increasing instead of decreasing order.

4. **Group Anagrams (LeetCode 49)**: Uses a similar approach of grouping items (anagrams) based on a computed key (sorted string or character count).

The pattern is: when you need to process elements based on their frequency, consider using a frequency map followed by either sorting or bucket sort.

## Key Takeaways

1. **Frequency problems often follow a two-step pattern**: First count frequencies (O(n)), then process based on frequency. The processing step determines the overall time complexity.

2. **Bucket sort is optimal when maximum frequency is bounded by n**: If you need to sort by frequency and the maximum frequency is limited (like in strings where frequency ≤ length), bucket sort gives O(n) time vs O(n log n) for comparison sorting.

3. **Consider trade-offs between different approaches**: The hash map + sorting approach is simpler to implement and works well for most cases. The bucket sort approach is more complex but offers better theoretical complexity. In interviews, it's good to mention both and explain why you chose one.

Related problems: [Top K Frequent Elements](/problem/top-k-frequent-elements), [First Unique Character in a String](/problem/first-unique-character-in-a-string), [Sort Array by Increasing Frequency](/problem/sort-array-by-increasing-frequency)
