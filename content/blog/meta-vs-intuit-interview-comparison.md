---
title: "Meta vs Intuit: Interview Question Comparison"
description: "Compare coding interview questions at Meta and Intuit — difficulty levels, topic focus, and preparation strategy."
date: "2029-03-24"
category: "tips"
tags: ["meta", "intuit", "comparison"]
---

If you're preparing for interviews at both Meta and Intuit, you're looking at two distinct beasts. Meta's process is a high-volume, high-intensity marathon testing breadth and speed on core data structures. Intuit's is a more focused, medium-depth assessment with a surprising emphasis on practical problem-solving and dynamic programming. Preparing for both simultaneously is absolutely possible, but requires a smart, layered strategy that prioritizes shared fundamentals before branching into company-specific specialties.

## Question Volume and Difficulty: A Tale of Two Scales

The raw numbers tell a clear story. Meta has a tagged pool of **1,387 questions** on LeetCode, dwarfing Intuit's **71**. This disparity isn't just about company size; it's a direct reflection of interview philosophy.

- **Meta (1,387 questions: 414 Easy, 762 Medium, 211 Hard):** This massive pool means you cannot "grind" your way to a guaranteed question match. The goal is breadth. You're expected to have such a deep, intuitive grasp of fundamental patterns (Array, String, Hash Table) that you can apply them to any novel variation. The high Medium count is key—Meta's on-site rounds are famous for two Medium problems in 45 minutes, testing not just correctness but coding speed and communication under pressure.
- **Intuit (71 questions: 10 Easy, 47 Medium, 14 Hard):** This smaller, more curated pool suggests a different approach. While you still can't rely on memorization, the scope is narrower. The difficulty distribution leans heavily toward Medium, indicating they favor problems with clear, logical steps that might involve a clever insight or a standard algorithm applied in a business-adjacent context. The presence of Dynamic Programming as a top-4 topic (which we'll explore) is a major differentiator.

**Implication:** Meta prep is about building a fast, reliable problem-solving engine for fundamentals. Intuit prep is about deepening your understanding of a few key advanced topics, especially DP, within that fundamental framework.

## Topic Overlap and Divergence

Both companies test **Array, String, and Hash Table** relentlessly. These are the absolute non-negotiable core for any interview, but especially here. If you're weak on two-pointer techniques, sliding windows, or hash map lookups, you will struggle at both.

The critical divergence is in the fourth pillar:

- **Meta's #4: Math.** This often translates to number manipulation, bitwise operations, or mathematical reasoning within array/string problems (e.g., "Product of Array Except Self").
- **Intuit's #4: Dynamic Programming.** This is a significant signal. Intuit frequently asks DP problems, particularly those related to subsequences, knapsack variants, or string transformation—problems that model multi-step decision making, akin to business logic or optimization.

**Unique Flavors:** Meta heavily features **Graphs** (BFS/DFS) and **Trees**, especially in later rounds. Intuit's list shows a stronger relative weighting for **Sorting** and **Greedy** algorithms, often in combination with arrays.

## Preparation Priority Matrix

Maximize your Return on Investment (ROI) with this layered approach:

1.  **Layer 1: Universal Foundation (Prep for Both)**
    - **Topics:** Array, String, Hash Table.
    - **Patterns:** Two-pointers (for sorted arrays, palindromes), Sliding Window (fixed & variable), Prefix Sum, Hash Map for O(1) lookups.
    - **Study First.** Mastery here is 70% of the battle for both companies.

2.  **Layer 2: Meta-Specific Depth**
    - **Topics:** Graphs (BFS/DFS), Trees (Traversals, Recursion), Math/Bit Manipulation.
    - **Add after Layer 1.** Meta's breadth demands comfort here.

3.  **Layer 3: Intuit-Specific Depth**
    - **Topics:** Dynamic Programming (1D/2D), Greedy Algorithms.
    - **Add after Layer 1.** DP has a high learning curve but is a major differentiator for Intuit.

## Interview Format Differences

- **Meta:** Typically starts with a phone screen (1-2 coding problems), followed by a virtual on-site of 4-5 rounds. These include 2-3 coding rounds (often 2 Mediums in 45 mins), 1 system design round (for E5+), and 1 behavioral/cultural fit round ("Meta Leadership Principles"). Speed, clean code, and optimal solutions are paramount.
- **Intuit:** Process can vary more. Often a technical phone screen, followed by a final round of 3-4 interviews. This commonly includes 2 coding rounds, 1 system design or object-oriented design round (sometimes with a practical, business-system focus), and 1 behavioral round. The pacing may feel slightly less frantic than Meta's, but solution depth and clarity are valued. They have a strong focus on "customer-driven innovation" in behavioral questions.

## Specific Problem Recommendations for Dual Prep

These problems build Layer 1 (Universal Foundation) while touching on each company's specialties.

1.  **3Sum (LeetCode #15):** A classic array/hash table/two-pointer problem. Mastering this teaches you how to reduce a O(n³) brute force to O(n²) using sorting and pointers, a pattern applicable everywhere.
2.  **Longest Substring Without Repeating Characters (LeetCode #3):** The definitive sliding window problem with a hash map. Essential for both companies' string manipulation questions.
3.  **Merge Intervals (LeetCode #56):** A supremely practical array/sorting pattern. It tests your ability to sort with a custom comparator and manage overlapping ranges—relevant for Meta's generalist focus and Intuit's practical bent.
4.  **Best Time to Buy and Sell Stock (LeetCode #121):** The simplest DP/Greedy problem. It's the perfect bridge: for Meta, it's an array problem; for Intuit, it's your gateway to understanding the DP state transition (`maxProfit = max(maxProfit, price - minPrice)`). From here, you can tackle Intuit's harder DP questions.
5.  **Subarray Sum Equals K (LeetCode #560):** A brilliant problem that combines hash tables and prefix sums. It looks like a sliding window but isn't (due to negative numbers). Understanding this teaches a powerful pattern useful at both companies.

<div class="code-group">

```python
# LeetCode #560: Subarray Sum Equals K - Python
# Time: O(n) | Space: O(n)
def subarraySum(nums, k):
    """
    Uses a hashmap to store prefix sums.
    count_map[prefix_sum] = number of times this sum has occurred.
    If (current_prefix_sum - k) exists in the map, we found subarrays summing to k.
    """
    count_map = {0: 1}  # Base case: prefix sum of 0 has occurred once.
    prefix_sum = 0
    count = 0

    for num in nums:
        prefix_sum += num
        # Check if (prefix_sum - k) exists
        count += count_map.get(prefix_sum - k, 0)
        # Update the map with the current prefix_sum
        count_map[prefix_sum] = count_map.get(prefix_sum, 0) + 1

    return count
```

```javascript
// LeetCode #560: Subarray Sum Equals K - JavaScript
// Time: O(n) | Space: O(n)
function subarraySum(nums, k) {
  const countMap = new Map();
  countMap.set(0, 1); // Base case
  let prefixSum = 0;
  let count = 0;

  for (const num of nums) {
    prefixSum += num;
    // Check if (prefixSum - k) exists
    if (countMap.has(prefixSum - k)) {
      count += countMap.get(prefixSum - k);
    }
    // Update the map
    countMap.set(prefixSum, (countMap.get(prefixSum) || 0) + 1);
  }
  return count;
}
```

```java
// LeetCode #560: Subarray Sum Equals K - Java
// Time: O(n) | Space: O(n)
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> countMap = new HashMap<>();
    countMap.put(0, 1); // Base case
    int prefixSum = 0;
    int count = 0;

    for (int num : nums) {
        prefixSum += num;
        // Check if (prefixSum - k) exists
        count += countMap.getOrDefault(prefixSum - k, 0);
        // Update the map
        countMap.put(prefixSum, countMap.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}
```

</div>

## Which to Prepare for First?

**Start with Meta's core.** Here’s the strategy:

1.  **Weeks 1-3:** Attack **Layer 1 (Array, String, Hash Table)** using Meta's vast Medium problem set. This builds the speed and pattern recognition needed for both.
2.  **Week 4:** Layer in **Meta-Specific (Graphs, Trees)**. This is the hardest part of Meta prep.
3.  **Week 5:** Pivot to **Intuit-Specific (DP)**. Your solid foundation from Layer 1 will make learning DP patterns (like 0/1 knapsack or LCS) much easier. Practice with Intuit's tagged Medium DP problems.
4.  **Final Days:** Do mock interviews simulating Meta's 2-Medium/45min pace, and practice explaining DP solutions clearly for Intuit.

By preparing for Meta first, you build the rigorous, fast-paced fundamental engine. Adapting to Intuit's style then becomes a matter of adding a specialized module (DP) to that engine, rather than building two separate systems from scratch. You'll be over-prepared on fundamentals for Intuit, which is a great position to be in.

For deeper dives into each company's question frequency and patterns, check out the CodeJeet pages for [Meta](/company/meta) and [Intuit](/company/intuit).
