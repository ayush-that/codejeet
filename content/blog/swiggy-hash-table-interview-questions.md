---
title: "Hash Table Questions at Swiggy: What to Expect"
description: "Prepare for Hash Table interview questions at Swiggy — patterns, difficulty breakdown, and study tips."
date: "2030-01-24"
category: "dsa-patterns"
tags: ["swiggy", "hash-table", "interview prep"]
---

If you're preparing for a Swiggy interview, you'll quickly notice that Hash Table questions aren't just another topic—they're a central pillar. With 14 out of 41 tagged problems, that's over a third of their technical question bank dedicated to this single data structure. This isn't a coincidence. Swiggy's core business—real-time order matching, delivery partner allocation, and inventory management—is built on operations that are fundamentally about fast lookups, deduplication, and counting. In a real interview, you are almost guaranteed to encounter at least one problem where the optimal solution hinges on a hash table (dictionary, map, or set). They use it to test if you can move beyond brute-force O(n²) solutions to the efficient O(n) or O(1) operations that their systems require at scale.

## Specific Patterns Swiggy Favors

Swiggy's hash table problems aren't about obscure tricks. They focus on practical applications that mirror their engineering challenges. You'll see a heavy emphasis on two intertwined patterns:

1.  **Frequency Counting for State Tracking:** This is their bread and butter. The problem isn't just "find if an element exists," but "track how many times something happens" to make a decision. This pattern is crucial for features like detecting duplicate orders, managing restaurant inventory (counting items), or analyzing user behavior patterns.
2.  **The Prefix Sum + Hash Table Combo for Subarray Problems:** Many of their problems involve finding a subarray that meets a condition (e.g., number of orders in a time window summing to a target). The naive solution is O(n²). The optimal O(n) solution uses a hash table to store prefix sums, allowing you to check in constant time if a needed complementary sum has already been seen. This pattern is non-negotiable to know.

You will also see hash tables used as a supporting actor for more complex algorithms, like graph traversal (BFS/DFS visited sets) or as a cache (memoization) in dynamic programming. However, the two patterns above are where they most frequently test _core_ hash table mastery.

## How to Prepare

Your preparation should move from understanding the basic tool to applying it in these specific, high-leverage patterns. Let's start with the foundational pattern: **Frequency Counting**.

The mental model is simple: iterate once, use the hash table to count occurrences. The power comes from what you do with that map afterward. Let's solve a classic: Given an array of integers `nums` and an integer `k`, return the `k` most frequent elements. This models a "top k" analytics query Swiggy might run.

<div class="code-group">

```python
def topKFrequent(nums, k):
    """
    Time: O(n) for counting + O(n log n) for sorting in worst case.
    Space: O(n) for the frequency map and list of unique elements.
    """
    freq_map = {}
    # 1. Build frequency map: O(n) time, O(n) space
    for num in nums:
        freq_map[num] = freq_map.get(num, 0) + 1

    # 2. Get unique numbers and sort by frequency (descending)
    # Sorting n unique numbers is O(u log u), where u <= n.
    unique_nums = list(freq_map.keys())
    unique_nums.sort(key=lambda x: freq_map[x], reverse=True)

    # 3. Return first k elements
    return unique_nums[:k]
```

```javascript
function topKFrequent(nums, k) {
  // Time: O(n) + O(u log u) | Space: O(n)
  const freqMap = new Map();
  // Build frequency map
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Get unique numbers, sort by frequency
  const uniqueNums = Array.from(freqMap.keys());
  uniqueNums.sort((a, b) => freqMap.get(b) - freqMap.get(a));

  // Return top k
  return uniqueNums.slice(0, k);
}
```

```java
public int[] topKFrequent(int[] nums, int k) {
    // Time: O(n) + O(u log u) | Space: O(n)
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : nums) {
        freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
    }

    // Put unique numbers in a list
    List<Integer> uniqueNums = new ArrayList<>(freqMap.keySet());
    // Sort by frequency descending
    uniqueNums.sort((a, b) -> freqMap.get(b) - freqMap.get(a));

    // Convert first k to array
    int[] result = new int[k];
    for (int i = 0; i < k; i++) {
        result[i] = uniqueNums.get(i);
    }
    return result;
}
```

</div>

Now, let's level up to the more advanced and critical pattern: **Prefix Sum with a Hash Table**. This solves problems like "find the number of subarrays that sum to k" or "find the longest subarray with sum k". The insight is that if you know the cumulative sum up to index `i` (`prefix_sum[i]`) and you've seen a cumulative sum of `prefix_sum[i] - k` at some earlier index `j`, then the subarray from `j+1` to `i` sums to `k`.

<div class="code-group">

```python
def subarraySum(nums, k):
    """
    LeetCode #560. Subarray Sum Equals K.
    Time: O(n) - single pass.
    Space: O(n) - in worst case, all prefix sums are unique.
    """
    count = 0
    prefix_sum = 0
    # Map: prefix_sum_value -> number of times it has occurred
    prefix_map = {0: 1}  # Crucial: a prefix sum of 0 has occurred once (before start)

    for num in nums:
        prefix_sum += num
        # If (prefix_sum - k) exists in map, we found subarrays ending here that sum to k.
        count += prefix_map.get(prefix_sum - k, 0)
        # Record the current prefix sum in the map for future indices.
        prefix_map[prefix_sum] = prefix_map.get(prefix_sum, 0) + 1

    return count
```

```javascript
function subarraySum(nums, k) {
  // Time: O(n) | Space: O(n)
  let count = 0;
  let prefixSum = 0;
  const prefixMap = new Map();
  prefixMap.set(0, 1); // Base case

  for (const num of nums) {
    prefixSum += num;
    if (prefixMap.has(prefixSum - k)) {
      count += prefixMap.get(prefixSum - k);
    }
    prefixMap.set(prefixSum, (prefixMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
```

```java
public int subarraySum(int[] nums, int k) {
    // Time: O(n) | Space: O(n)
    int count = 0, prefixSum = 0;
    Map<Integer, Integer> prefixMap = new HashMap<>();
    prefixMap.put(0, 1); // Base case

    for (int num : nums) {
        prefixSum += num;
        // Add the number of times we've seen the needed complementary sum.
        count += prefixMap.getOrDefault(prefixSum - k, 0);
        // Update the frequency of the current prefix sum.
        prefixMap.put(prefixSum, prefixMap.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}
```

</div>

## How Swiggy Tests Hash Table vs Other Companies

Compared to FAANG companies, Swiggy's hash table questions tend to be less about theoretical computer science and more directly tied to data processing scenarios. A company like Google might ask a hash table question that is a clever reduction of a complex graph problem. Amazon might frame it around optimizing a customer's shopping cart. Swiggy's problems often feel like you're writing a function for a real backend service—processing a stream of order IDs, analyzing delivery route points, or checking menu item availability.

The difficulty is often in the **"medium"** range on LeetCode. They want to see that you not only know `map.put` and `map.get`, but that you can design the _key_ intelligently. For example, the key might be a tuple `(city, hour)` for counting deliveries, or a string representation of a sorted character array for grouping anagrams (a classic problem). The uniqueness lies in this applied, key-design focus.

## Study Order

Don't jump into the hardest problems. Build your understanding sequentially:

1.  **Basic Operations & Existence Checking:** Master `Two Sum (#1)`. It's the "Hello World" of hash tables. Understand why the two-pass and one-pass hash table solutions work.
2.  **Frequency Counting:** Solve problems like `Valid Anagram (#242)` and `Top K Frequent Elements (#347)`. Get comfortable building and querying a frequency map.
3.  **Hash Table for Deduplication & State:** Practice `Contains Duplicate (#217)` and `Longest Consecutive Sequence (#128)`. Learn to use a `Set` for O(1) membership tests to optimize algorithms.
4.  **Prefix Sum + Hash Table:** This is the peak. Thoroughly understand `Subarray Sum Equals K (#560)` and `Contiguous Array (#525)`. This pattern is a major differentiator.
5.  **Advanced Key Design:** Finally, tackle problems where you construct the key, such as `Group Anagrams (#49)` (key is sorted string) or problems where you use a hash table to cache results for a tuple of parameters.

This order works because each step provides the conceptual building block for the next. You can't efficiently design a key for a prefix sum map if you're not rock-solid on what a hash table stores and how it provides O(1) access.

## Recommended Practice Order

Here is a targeted sequence of LeetCode problems that mirrors Swiggy's focus:

1.  **Two Sum (#1)** - Foundational lookup.
2.  **Contains Duplicate (#217)** - Basic set usage.
3.  **Valid Anagram (#242)** - Frequency counting comparison.
4.  **Group Anagrams (#49)** - Level up: frequency counting _as_ the key.
5.  **Top K Frequent Elements (#347)** - Frequency counting + sorting/priority queue.
6.  **Subarray Sum Equals K (#560)** - **CRITICAL.** Master this pattern.
7.  **Contiguous Array (#525)** - A brilliant variation of the prefix sum pattern.
8.  **Longest Consecutive Sequence (#128)** - Excellent example of using a set for O(1) lookups to optimize a sequence-finding algorithm.

After completing this list, you'll have covered the core hash table archetypes Swiggy employs. You'll be able to recognize when a problem's optimal solution requires that O(1) lookup, transforming your approach from brute-force to efficient—exactly what they're looking for in a candidate.

[Practice Hash Table at Swiggy](/company/swiggy/hash-table)
