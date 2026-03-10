---
title: "Yandex vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Yandex and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2032-12-17"
category: "tips"
tags: ["yandex", "ebay", "comparison"]
---

# Yandex vs eBay: Interview Question Comparison

If you're preparing for interviews at both Yandex and eBay, you're looking at two distinct tech cultures with surprisingly similar technical expectations. Yandex, Russia's search giant, operates like a European Google with deep algorithmic roots, while eBay, the American e-commerce pioneer, focuses on practical problem-solving for scalable systems. The good news: you can prepare for both simultaneously with smart strategy. The bad news: their interview styles differ enough that you'll need to adjust your approach.

## Question Volume and Difficulty

Let's start with the raw numbers from LeetCode's company-tagged questions:

**Yandex**: 134 questions (Easy: 52, Medium: 72, Hard: 10)  
**eBay**: 60 questions (Easy: 12, Medium: 38, Hard: 10)

These numbers tell a story. Yandex has more than twice the tagged questions, suggesting either more active interviewing or more willingness to share interview content. More importantly, look at the distribution: Yandex has a massive Easy section (52 vs eBay's 12), but both have exactly 10 Hard problems. This suggests Yandex might start with simpler warm-up questions before progressing to Mediums, while eBay jumps straight into Medium-difficulty problems.

The Medium-heavy distribution for both (72 for Yandex, 38 for eBay) confirms what experienced candidates know: you'll spend most of your interview time solving Medium problems. Don't neglect Easy problems though—they're excellent for building pattern recognition and speed, especially for Yandex.

## Topic Overlap

Both companies test the same core four topics, just in different proportions:

**Shared Top 4**: Array, String, Hash Table, Sorting

This overlap is your golden ticket. Master these four topics, and you're covering approximately 70-80% of what both companies test. The ordering differs slightly—Yandex lists Array first, eBay lists Array first but String is equally important—but the core is identical.

**Yandex-specific emphasis**: Two Pointers appears in their top topics, which aligns with their algorithmic focus. You'll see more problems requiring clever pointer manipulation rather than brute force.

**eBay-specific patterns**: While not in their top 4, eBay frequently tests Tree and Graph problems related to their marketplace structure (recommendation systems, category hierarchies). Sorting appears more prominently for eBay, likely due to product ranking and search relevance problems.

## Preparation Priority Matrix

Here's how to allocate your study time for maximum ROI:

**Tier 1: Overlap Topics (Study First)**

- Arrays & Strings: Master sliding window, prefix sums, and in-place modifications
- Hash Tables: Know when to use them for O(1) lookups vs arrays for O(1) indexing
- Sorting: Not just how to sort, but when sorting transforms a problem (like making Two Sum solvable with two pointers)

**Tier 2: Yandex-Specific**

- Two Pointers: Especially for sorted array problems
- Dynamic Programming: More algorithmic puzzles
- Matrix/Grid problems: Think "Russian search engine" problems

**Tier 3: eBay-Specific**

- Trees: BST operations, traversals
- System Design Lite: Even in coding rounds, think about scalability implications
- String processing: Real-world text parsing for product titles/descriptions

## Interview Format Differences

**Yandex** typically follows the Russian tech interview pattern:

- 4-5 rounds including algorithmic coding, system design, and sometimes math/probability
- Coding rounds often include 2-3 problems in 60-90 minutes
- Heavy emphasis on optimal solutions with mathematical proof of correctness
- On-site interviews are common for Russian positions, virtual for international
- Behavioral questions exist but are less weighted than at American companies

**eBay** follows Silicon Valley patterns:

- Usually 3-4 rounds: coding, system design, behavioral/cultural fit
- Coding rounds: 1-2 Medium problems in 45-60 minutes
- They care about clean, maintainable code more than mathematical elegance
- Virtual interviews are standard post-pandemic
- Behavioral rounds ("Leadership Principles") carry significant weight

For eBay, expect follow-up questions about scalability: "What if you had 10 million products?" For Yandex, expect follow-ups about edge cases and time complexity proofs.

## Specific Problem Recommendations

These 5 problems give you the most bang for your buck when preparing for both:

1. **Two Sum (#1)** - The ultimate hash table vs two pointers comparison problem. Solve it both ways to understand the tradeoffs.

<div class="code-group">

```python
# Hash Table approach - better for unsorted input
# Time: O(n) | Space: O(n)
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Two Pointers approach - better for sorted input
# Time: O(n log n) for sort + O(n) for search = O(n log n)
# Space: O(n) if we need to preserve indices, O(1) otherwise
def two_sum_sorted(nums, target):
    sorted_nums = sorted(nums)
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = sorted_nums[left] + sorted_nums[right]
        if current_sum == target:
            # Need to find original indices - implementation depends on requirements
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

```javascript
// Hash Table approach
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Two Pointers approach (requires sorted array)
// Time: O(n log n) | Space: O(n) for indices, O(1) otherwise
function twoSumSorted(nums, target) {
  const sorted = [...nums].sort((a, b) => a - b);
  let left = 0,
    right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}
```

```java
// Hash Table approach
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}

// Two Pointers approach (requires sorted array)
// Time: O(n log n) | Space: O(n) for indices copy, O(1) otherwise
public int[] twoSumSorted(int[] nums, int target) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int left = 0, right = sorted.length - 1;
    while (left < right) {
        int sum = sorted[left] + sorted[right];
        if (sum == target) {
            return new int[] { left, right };
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[0];
}
```

</div>

2. **Merge Intervals (#56)** - Tests sorting, array manipulation, and edge case handling. eBay loves this for calendar/scheduling problems, Yandex for algorithmic thinking.

3. **Longest Substring Without Repeating Characters (#3)** - Perfect sliding window problem that both companies test. Demonstrates hash table + two pointers combination.

4. **Group Anagrams (#49)** - Hash table mastery with string manipulation. Tests if you recognize that sorted strings can be hash keys.

5. **Product of Array Except Self (#238)** - Array manipulation at its finest. Tests prefix/suffix thinking without division—relevant for eBay's product data and Yandex's algorithmic puzzles.

## Which to Prepare for First

Start with **Yandex preparation**, even if your eBay interview comes first. Here's why:

1. Yandex's broader question base (134 vs 60) means you'll cover more ground
2. Their emphasis on algorithmic rigor and mathematical thinking raises your ceiling
3. The skills needed for Yandex (optimal solutions, edge cases, proofs) translate perfectly to eBay, but not necessarily vice versa

If you master Yandex-style problems, eBay's coding rounds will feel more approachable. The reverse isn't as true—eBay's focus on practical, clean code might leave you underprepared for Yandex's algorithmic depth.

Spend 70% of your time on overlap topics, 20% on Yandex-specific patterns (especially two pointers and DP), and 10% on eBay-specific areas (trees and system design thinking). This allocation maximizes your chances at both companies while respecting their differences.

Remember: Both companies ultimately want engineers who can think clearly about problems. The patterns differ, but the core skill—breaking down complex problems into solvable pieces—remains the same.

For more company-specific insights, check out our [Yandex interview guide](/company/yandex) and [eBay interview guide](/company/ebay).
