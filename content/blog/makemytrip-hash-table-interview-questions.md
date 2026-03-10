---
title: "Hash Table Questions at MakeMyTrip: What to Expect"
description: "Prepare for Hash Table interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-05"
category: "dsa-patterns"
tags: ["makemytrip", "hash-table", "interview prep"]
---

If you're preparing for a software engineering interview at MakeMyTrip, you'll quickly notice a significant pattern: **8 out of their 24 most-frequently asked coding problems involve hash tables**. That's one-third of their question bank. This isn't a coincidence or a minor detail—it's a direct signal about what the company values in its engineering candidates. MakeMyTrip, as a leading online travel company, deals with massive datasets: flight itineraries, hotel bookings, user sessions, pricing caches, and real-time availability checks. The core operations—fast lookups, deduplication, session management, and frequency counting—are fundamentally hash table operations. In their technical interviews, hash tables aren't just a data structure you might use; they are often the _primary_ data structure being tested. Expect at least one, and very likely two, problems in any coding round where the optimal solution hinges on clever hash map usage.

## Specific Patterns MakeMyTrip Favors

MakeMyTrip's hash table questions tend to cluster around two high-level themes: **frequency/counting problems** and **complement/paired-sum problems**. They rarely ask the most trivial "implement a hash map" question. Instead, they test your ability to use a hash table as a tool to transform an O(n²) brute-force solution into an O(n) or O(n log n) optimal one.

1.  **Frequency as a Proxy for State:** Many problems involve tracking counts of characters, numbers, or tokens. The hash map acts as a frequency counter. This pattern is key for anagrams (`Valid Anagram` #242), duplicate detection, and majority elements (`Majority Element` #169).
2.  **The Complement Pattern:** This is arguably their favorite. The classic "Two Sum" (#1) is the archetype: instead of checking all pairs (O(n²)), you store each element as you iterate. For each new number `num`, you check if its complement (`target - num`) already exists in your hash map. This pattern extends to problems about finding pairs, subarrays summing to a target (using prefix sums), and even some string problems.
3.  **Hash Maps for Precomputation (Caching):** They ask questions where you precompute and store intermediate results to avoid repeated work. This is seen in problems like `First Unique Character in a String` (#387), where you first build a frequency map, then use it for an O(1) lookup per character during the second pass.

You will _not_ typically see highly abstract graph theory problems disguised as hash map questions here. The focus is on practical, iterative application to optimize time complexity for data processing tasks.

## How to Prepare

The most effective preparation is to internalize the complement pattern. Let's break it down with the canonical example and a common variation.

**Core Pattern: The Two-Sum Complement**

<div class="code-group">

```python
def twoSum(nums, target):
    """
    Finds two indices such that their values sum to target.
    Time: O(n) - Single pass through the list.
    Space: O(n) - In the worst case, we store n-1 elements in the map.
    """
    seen = {}  # Map value -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            # Found the pair: current num and a previously seen complement
            return [seen[complement], i]
        # Store the current number and its index for future lookups
        seen[num] = i
    return []  # Problem guarantees a solution, but return empty for safety

# Example: nums = [3, 2, 4], target = 6
# Iteration 1: num=3, comp=3, seen={} -> store {3:0}
# Iteration 2: num=2, comp=4, seen={3:0} -> store {3:0, 2:1}
# Iteration 3: num=4, comp=2, seen={3:0, 2:1} -> FOUND. Return [1, 2]
```

```javascript
function twoSum(nums, target) {
  // Time: O(n) | Space: O(n)
  const seen = new Map(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
```

```java
public int[] twoSum(int[] nums, int target) {
    // Time: O(n) | Space: O(n)
    Map<Integer, Integer> seen = new HashMap<>(); // value -> index

    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] {seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[] {}; // or throw an exception
}
```

</div>

**Variation: Prefix Sum for Subarray Problems**
A powerful extension is using a hash map to store **prefix sums**. This solves "find a subarray summing to k" in O(n) time.

<div class="code-group">

```python
def subarraySum(nums, k):
    """
    Counts the number of subarrays whose sum equals k.
    Time: O(n) - Single pass.
    Space: O(n) - For the prefix sum map.
    """
    count = 0
    prefix_sum = 0
    # Map: prefix_sum_value -> frequency of occurrences
    prefix_map = {0: 1}  # Crucial: a prefix sum of 0 has occurred once (empty subarray)

    for num in nums:
        prefix_sum += num
        # The complement here is (prefix_sum - k).
        # If it exists in the map, it means there is a previous subarray we can subtract
        # to get a current subarray summing to k.
        complement = prefix_sum - k
        count += prefix_map.get(complement, 0)
        # Update the frequency of the current prefix sum
        prefix_map[prefix_sum] = prefix_map.get(prefix_sum, 0) + 1
    return count

# Example: nums = [1, 1, 1], k = 2
# prefix_sum progression: 0 -> 1 -> 2 -> 3
# When prefix_sum=2, complement=0, count += prefix_map[0]=1 -> count=1
# When prefix_sum=3, complement=1, count += prefix_map[1]=1 -> count=2
# Result: 2 subarrays ([1,1] and [1,1] from indices 0-1 and 1-2).
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
    const complement = prefixSum - k;
    if (prefixMap.has(complement)) {
      count += prefixMap.get(complement);
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
        int complement = prefixSum - k;
        count += prefixMap.getOrDefault(complement, 0);
        prefixMap.put(prefixSum, prefixMap.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}
```

</div>

## How MakeMyTrip Tests Hash Table vs Other Companies

Compared to other companies, MakeMyTrip's hash table questions are **applied and data-centric**. Let's contrast:

- **FAANG (Meta, Google):** Often use hash tables as a component in more complex system design or multi-step algorithm problems (e.g., as part of a graph traversal cache or in a randomized data structure). The difficulty is layered.
- **Product-Based Startups (Uber, Airbnb):** May tie hash map problems directly to a domain scenario (e.g., matching riders to drivers, booking conflicts) requiring you to model the problem first.
- **MakeMyTrip:** The problems are more "pure." You are given a clear data processing task—find duplicates, count frequencies, check pairs—and are evaluated on your fluency in reducing its time complexity. The "cleverness" is in seeing the O(n) hash map solution where a less-prepared candidate might settle for O(n²). The difficulty is in the optimization insight, not in complex abstraction.

## Study Order

Tackle hash table concepts in this logical progression to build a solid foundation:

1.  **Fundamental Operations & Syntax:** Before anything else, be able to instantiate, add, remove, and check for keys in your language's hash map ( `dict`, `Map`, `HashMap`) without hesitation. This is muscle memory.
2.  **Frequency Counting Pattern:** Start with problems that require building a simple count map. This teaches you to use the hash map as a state tracker. (Problems: #242, #387, #169).
3.  **The Complement Pattern (Two-Sum):** Master the classic. Understand why iterating and looking back is powerful. This is the core insight for many problems.
4.  **Complement Pattern Extended (Prefix Sum):** Learn how the complement idea applies to continuous subarrays using prefix sums. This is a non-obvious leap for many. (Problem: #560).
5.  **Hash Map for Deduplication & Lookup Acceleration:** Practice problems where the hash map helps you avoid a nested loop by providing O(1) lookups for previously seen elements. (Problems: #217 Contains Duplicate, #1 Two Sum).
6.  **Combining with Other Structures:** Finally, tackle problems where a hash map is used in tandem with a heap, linked list, or as an index. (e.g., #146 LRU Cache). This is less common at MakeMyTrip but good for completeness.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous concept:

1.  **#217 Contains Duplicate:** The simplest frequency map. (Pattern 2)
2.  **#242 Valid Anagram:** Two frequency maps, or one with increment/decrement. (Pattern 2)
3.  **#1 Two Sum:** The absolute must-know complement pattern. (Pattern 3)
4.  **#387 First Unique Character in a String:** Two-pass approach: count then find. (Pattern 2, 5)
5.  **#169 Majority Element:** Frequency map, or the Boyer-Moore voting algorithm (good follow-up). (Pattern 2)
6.  **#560 Subarray Sum Equals K:** The critical prefix sum extension. (Pattern 4)
7.  **#525 Contiguous Array:** Treats 0s as -1s to create a sum-to-zero subarray problem—a clever variant of prefix sum. (Pattern 4)
8.  **#36 Valid Sudoku:** Uses hash sets (a type of hash table) to track row, column, and box states. Excellent for 2D state tracking.

Mastering this progression will make you exceptionally well-prepared for the type of hash table reasoning MakeMyTrip's interviewers are looking for. They want to see that you instinctively reach for a hash map to trade space for time, and that you understand the classic patterns to apply it effectively.

[Practice Hash Table at MakeMyTrip](/company/makemytrip/hash-table)
