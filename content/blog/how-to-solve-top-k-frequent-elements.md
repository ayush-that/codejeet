---
title: "How to Solve Top K Frequent Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Top K Frequent Elements. Medium difficulty, 65.9% acceptance rate. Topics: Array, Hash Table, Divide and Conquer, Sorting, Heap (Priority Queue)."
date: "2026-03-17"
category: "dsa-patterns"
tags: ["top-k-frequent-elements", "array", "hash-table", "divide-and-conquer", "medium"]
---

# How to Solve Top K Frequent Elements

Given an array of integers `nums` and an integer `k`, we need to return the `k` most frequent elements. The answer can be in any order. This problem is interesting because it combines several fundamental concepts: frequency counting, sorting/bucketing, and selection algorithms. The challenge lies in finding an efficient way to select the top k frequencies without fully sorting all elements, which would be unnecessarily expensive.

## Visual Walkthrough

Let's trace through an example: `nums = [1,1,1,2,2,3]`, `k = 2`

**Step 1: Count frequencies**
We need to know how many times each number appears:

- 1 appears 3 times
- 2 appears 2 times
- 3 appears 1 time

**Step 2: Organize by frequency**
We could sort these by frequency: [(1,3), (2,2), (3,1)]

**Step 3: Select top k**
The top 2 most frequent elements are 1 (frequency 3) and 2 (frequency 2)

**Step 4: Return result**
We return `[1, 2]` (order doesn't matter, so `[2, 1]` is also acceptable)

The key insight is that we don't actually need the full sorted order - we just need the k highest frequencies. This opens up optimization opportunities.

## Brute Force Approach

A naive approach would be:

1. Count frequencies of each element using a hash map
2. Sort all elements by their frequency in descending order
3. Take the first k elements

While this works, it's inefficient because we're sorting all n elements when we only need the top k. The sorting step takes O(n log n) time, which is acceptable but not optimal. A candidate might also try to maintain a sorted structure while counting, but that would be even less efficient.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def topKFrequent(nums, k):
    # Step 1: Count frequencies
    freq_map = {}
    for num in nums:
        freq_map[num] = freq_map.get(num, 0) + 1

    # Step 2: Sort by frequency (descending)
    # Convert to list of (num, freq) tuples and sort by freq
    sorted_items = sorted(freq_map.items(), key=lambda x: x[1], reverse=True)

    # Step 3: Take first k elements
    result = []
    for i in range(k):
        result.append(sorted_items[i][0])

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function topKFrequent(nums, k) {
  // Step 1: Count frequencies
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Sort by frequency (descending)
  // Convert to array of [num, freq] pairs and sort by freq
  const sortedArray = Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]);

  // Step 3: Take first k elements
  const result = [];
  for (let i = 0; i < k; i++) {
    result.push(sortedArray[i][0]);
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
public int[] topKFrequent(int[] nums, int k) {
    // Step 1: Count frequencies
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : nums) {
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    // Step 2: Sort by frequency (descending)
    // Convert to list of Map.Entry objects
    List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(freqMap.entrySet());
    entries.sort((a, b) -> b.getValue() - a.getValue());

    // Step 3: Take first k elements
    int[] result = new int[k];
    for (int i = 0; i < k; i++) {
        result[i] = entries.get(i).getKey();
    }

    return result;
}
```

</div>

## Optimized Approach

The brute force sorts all elements, which is O(n log n). We can do better by recognizing we only need the top k elements, not the full sorted order. Two optimal approaches exist:

**Approach 1: Min-Heap (Priority Queue) - O(n log k)**

- Count frequencies (O(n))
- Use a min-heap of size k to keep track of the k most frequent elements
- For each element, add it to the heap; if heap size exceeds k, remove the smallest (least frequent) element
- This gives us O(n log k) time since we perform heap operations for n elements on a heap of size k

**Approach 2: Bucket Sort - O(n)**

- Count frequencies (O(n))
- Create buckets where index represents frequency, and each bucket contains elements with that frequency
- Since maximum frequency is n, we need n+1 buckets
- Iterate from highest frequency bucket down, collecting elements until we have k
- This gives us O(n) time but O(n) space

The bucket sort approach is theoretically faster (linear time) and is often preferred in interviews when the problem constraints allow it. The heap approach is more general and works well when k is small relative to n.

## Optimal Solution

Here's the bucket sort solution, which runs in O(n) time:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def topKFrequent(nums, k):
    # Step 1: Count frequency of each element
    # We use a dictionary where key = number, value = frequency
    freq_map = {}
    for num in nums:
        freq_map[num] = freq_map.get(num, 0) + 1

    # Step 2: Create buckets for frequencies
    # Index represents frequency, value is list of numbers with that frequency
    # We need n+1 buckets because frequency can range from 0 to n
    n = len(nums)
    buckets = [[] for _ in range(n + 1)]

    # Step 3: Place each number in its frequency bucket
    # freq_map.items() gives us (number, frequency) pairs
    for num, freq in freq_map.items():
        buckets[freq].append(num)

    # Step 4: Collect top k frequent elements
    result = []
    # Start from highest frequency (end of buckets array) and go downwards
    for i in range(n, 0, -1):
        # For each number in current frequency bucket
        for num in buckets[i]:
            result.append(num)
            # Stop when we have k elements
            if len(result) == k:
                return result

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function topKFrequent(nums, k) {
  // Step 1: Count frequency of each element
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Create buckets for frequencies
  // Index represents frequency, value is array of numbers with that frequency
  // We need n+1 buckets because frequency can range from 0 to n
  const n = nums.length;
  const buckets = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    buckets[i] = [];
  }

  // Step 3: Place each number in its frequency bucket
  // freqMap.entries() gives us [number, frequency] pairs
  for (const [num, freq] of freqMap.entries()) {
    buckets[freq].push(num);
  }

  // Step 4: Collect top k frequent elements
  const result = [];
  // Start from highest frequency (end of buckets array) and go downwards
  for (let i = n; i >= 0; i--) {
    // For each number in current frequency bucket
    for (const num of buckets[i]) {
      result.push(num);
      // Stop when we have k elements
      if (result.length === k) {
        return result;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] topKFrequent(int[] nums, int k) {
    // Step 1: Count frequency of each element
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : nums) {
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    // Step 2: Create buckets for frequencies
    // Index represents frequency, value is list of numbers with that frequency
    // We need n+1 buckets because frequency can range from 0 to n
    int n = nums.length;
    List<Integer>[] buckets = new List[n + 1];
    for (int i = 0; i <= n; i++) {
        buckets[i] = new ArrayList<>();
    }

    // Step 3: Place each number in its frequency bucket
    for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
        int num = entry.getKey();
        int freq = entry.getValue();
        buckets[freq].add(num);
    }

    // Step 4: Collect top k frequent elements
    int[] result = new int[k];
    int index = 0;
    // Start from highest frequency (end of buckets array) and go downwards
    for (int i = n; i >= 0; i--) {
        // For each number in current frequency bucket
        for (int num : buckets[i]) {
            result[index++] = num;
            // Stop when we have k elements
            if (index == k) {
                return result;
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting frequencies: O(n) - we iterate through all n elements once
- Building buckets: O(n) - we iterate through at most n unique elements
- Collecting results: O(n) - in worst case we iterate through all buckets

**Space Complexity: O(n)**

- Frequency map: O(u) where u is number of unique elements (≤ n)
- Buckets array: O(n) for n+1 buckets, each potentially containing elements
- Result array: O(k) which is ≤ O(n)

The O(n) time is optimal because we must examine each element at least once to count frequencies.

## Common Mistakes

1. **Forgetting that k could equal n**: Some solutions assume k < n and fail when k = n. Always check if you've collected enough elements before returning.

2. **Incorrect bucket indexing**: Using frequency as index without considering that frequency ranges from 1 to n, not 0 to n-1. We need n+1 buckets (0 through n).

3. **Not handling duplicate frequencies correctly**: When multiple elements have the same frequency, they should all be in the same bucket. The bucket approach handles this naturally.

4. **Using heap without size constraint**: If you use a max-heap and push all elements, you get O(n log n) time. For O(n log k), you need a min-heap of size k, removing the smallest when size exceeds k.

5. **Assuming input is non-empty**: While the problem guarantees k is in the range [1, unique elements], always consider edge cases like empty arrays if not explicitly forbidden.

## When You'll See This Pattern

The "top k frequent elements" pattern appears in many variations:

1. **Sort Characters By Frequency (LeetCode 451)**: Same problem but with characters instead of integers. The bucket sort solution works identically.

2. **Word Frequency (bash)**: Counting word frequencies in a text file - the core frequency counting logic is the same.

3. **Kth Largest Element in an Array (LeetCode 215)**: While not identical, it uses similar selection techniques (quickselect, heaps) to find the kth element without full sorting.

4. **Find K Closest Elements (LeetCode 658)**: Uses similar "top k" logic but with distance metric instead of frequency.

The bucket sort technique is particularly useful when:

- You need to sort by frequency or count
- The range of possible counts is bounded by n
- You need linear time complexity

## Key Takeaways

1. **Frequency counting + bucketing = linear time**: When you need to sort by frequency and the maximum frequency is bounded by n, bucket sort gives you O(n) time vs O(n log n) for full sorting.

2. **Heaps are great for top-k problems**: When k is small relative to n, a min-heap of size k gives O(n log k) time, which is often sufficient and easier to implement.

3. **Know when to use which approach**:
   - Use bucket sort when frequency range is limited (like this problem)
   - Use heaps when you need incremental updates or k is very small
   - Use quickselect when you need the kth element but not all top k

4. **The "any order" constraint matters**: It allows us to use algorithms that don't preserve order among elements with equal frequency, simplifying the solution.

Related problems: [Word Frequency](/problem/word-frequency), [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array), [Sort Characters By Frequency](/problem/sort-characters-by-frequency)
