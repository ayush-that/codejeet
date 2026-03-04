---
title: "Uber vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Uber and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2027-06-29"
category: "tips"
tags: ["uber", "ebay", "comparison"]
---

When preparing for technical interviews, the sheer volume and nature of questions can define your study strategy. Comparing Uber and eBay's interview landscapes reveals two distinct profiles: one representing a high-volume, high-stakes Big Tech environment, and the other a more focused, mid-tier tech company scope. Understanding their differences in question volume, difficulty distribution, and core topics is crucial for efficient preparation.

## Question Volume and Difficulty

The most striking difference is scale. Uber's listed repository of **381 questions** dwarfs eBay's **60**. This volume reflects Uber's status as a larger, more algorithmically intensive company with a highly competitive interview process.

The difficulty breakdown further highlights their contrasting demands:

- **Uber (E54/M224/H103)**: The distribution is heavily weighted toward medium and hard problems. With **224 medium** and **103 hard** questions, Uber's interview process is designed to rigorously test problem-solving under pressure, often involving complex optimizations and nuanced edge cases. The high number of hard questions suggests you can expect at least one deeply challenging problem in a typical loop.
- **eBay (E12/M38/H10)**: The profile is more moderate. The majority of questions are **38 medium** difficulty, with a smaller set of easy and hard problems. This indicates a strong focus on foundational competency and practical problem-solving, with less emphasis on extreme algorithmic optimization compared to Uber.

## Topic Overlap

Both companies emphasize a core set of fundamental data structures, creating a significant overlap you can leverage.

**Shared Core Topics:** Array, String, and Hash Table problems form the backbone of interviews at both companies. Mastering these is non-negotiable.

- **Array/String Manipulation:** Sliding window, two-pointer techniques, and in-place modifications are key.
- **Hash Table Usage:** For frequency counting, memoization, and providing O(1) lookups to optimize solutions.

**Diverging Emphasis:**

- **Uber's Distinct Edge:** **Dynamic Programming (DP)** is a explicitly noted major topic for Uber. Given their focus on complex optimization (matching drivers to riders, calculating routes, pricing), DP questions on topics like knapsack, longest common subsequence, or state machine DP are common and must be prepared thoroughly.
- **eBay's Additional Focus:** **Sorting** is explicitly highlighted. This suggests a focus on problems involving ordering data, merging intervals, or using sorting as a pre-processing step for more efficient algorithms, which is a very practical and common need in e-commerce systems.

<div class="code-group">

```python
# Example of a Hash Table + Array problem common to both:
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Example of a Dynamic Programming problem more specific to Uber:
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Example of a Hash Table + Array problem common to both:
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

// Example of a Dynamic Programming problem more specific to Uber:
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```java
// Example of a Hash Table + Array problem common to both:
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

// Example of a Dynamic Programming problem more specific to Uber:
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

## Which to Prepare for First

Your preparation order should be dictated by your goals and timeline.

**Prepare for eBay first if:** You are newer to technical interviews or are on a tighter timeline. The smaller, more focused question set allows you to build core competency efficiently. Mastering the shared topics (Array, String, Hash Table) and sorting algorithms will give you strong coverage for eBay and simultaneously lay a solid foundation for Uber. It's a practical stepping stone.

**Prepare for Uber first if:** You are targeting Big Tech roles generally, have more time, or are already comfortable with medium-difficulty problems. The Uber question list is a superset in terms of depth and difficulty. Conquering its medium and hard problems, especially in Dynamic Programming, will make you over-prepared for eBay's typical questions. This is the more comprehensive, high-effort path.

Ultimately, start with the shared core. Then, branch based on your target: add deep Sorting practice for eBay, and intensive Dynamic Programming drill-down for Uber.

For further study, visit the Uber and eBay question lists: [Uber Interview Questions](/company/uber) | [eBay Interview Questions](/company/ebay)
