---
title: "Amazon vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Amazon and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2026-04-15"
category: "tips"
tags: ["amazon", "ebay", "comparison"]
---

When preparing for technical interviews at major tech companies, understanding the differences in their question patterns can significantly streamline your study process. Amazon and eBay, while both e-commerce giants, present distinct interview landscapes in terms of volume, difficulty, and focus. This comparison breaks down their technical interview question profiles to help you prioritize your preparation effectively.

## Question Volume and Difficulty

The most striking difference is the sheer scale of available and reported questions.

**Amazon** has a massive question bank, with approximately 1938 questions categorized by difficulty: 530 Easy, 1057 Medium, and 351 Hard. This volume reflects Amazon's vast hiring scale across numerous technical roles and teams. The distribution suggests a strong emphasis on Medium-difficulty problems, which are typical for assessing core problem-solving and data structure application. The significant number of Hard questions indicates that roles at Amazon, particularly senior or specialized positions, will require mastery of complex algorithmic concepts.

**eBay** has a much more focused question bank, with around 60 total questions: 12 Easy, 38 Medium, and 10 Hard. This smaller, more curated set likely represents the most frequent and characteristic questions asked in eBay interviews. The emphasis is overwhelmingly on Medium-difficulty problems, which form the bulk of their technical screening.

_Preparation Implication:_ For Amazon, you must prepare for breadth and unpredictability within a large set. For eBay, you can aim for depth on a more predictable, core set of problems.

## Topic Overlap

Both companies heavily test fundamental data structures, but with different secondary emphases.

**Core Shared Topics:** Array, String, and Hash Table problems are central to both companies' interviews. These form the essential toolkit for solving a wide range of problems.

**Amazon's Additional Focus:** Dynamic Programming (DP) is a standout specific topic for Amazon. Its presence in their top topics, alongside the large number of Hard questions, signals that you must be proficient in breaking down complex problems into overlapping subproblems. Expect scenarios involving optimization, counting, or decision-making that require a DP approach.

**eBay's Additional Focus:** Sorting appears as a key topic. This often involves not just applying a sort function, but understanding sorting algorithms, custom comparators, and using sorting as a pre-processing step to enable efficient solutions (like the two-pointer technique) for problems involving arrays or strings.

<div class="code-group">

```python
# Example of a Sorting-focused problem pattern (Two Sum II - Input Array Is Sorted)
def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []

# Example of a Dynamic Programming pattern (Climbing Stairs)
def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
```

```javascript
// Example of a Sorting-focused problem pattern (Two Sum II - Input Array Is Sorted)
function twoSumSorted(numbers, target) {
  let left = 0,
    right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}

// Example of a Dynamic Programming pattern (Climbing Stairs)
function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
```

```java
// Example of a Sorting-focused problem pattern (Two Sum II - Input Array Is Sorted)
public int[] twoSumSorted(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}

// Example of a Dynamic Programming pattern (Climbing Stairs)
public int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1; dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

</div>

## Which to Prepare for First

Your preparation order should be guided by the breadth of coverage.

**Prepare for eBay's core set first.** Mastering the ~60 questions, with a special focus on Array, String, Hash Table, and **Sorting-based techniques**, will build a solid foundation. This set covers the essential Medium-difficulty problems that are also highly relevant to Amazon. It's an efficient way to gain confidence and core competency.

**Then, expand to Amazon's vast question bank.** Use your strong foundation to tackle the larger volume. Prioritize the Medium questions, but ensure you dedicate significant time to **Dynamic Programming** and other advanced topics (like Trees, Graphs, and System Design, which are likely present beyond the listed top topics) to handle their Hard problems. The skills you build here will far exceed what's needed for eBay's interviews.

In summary, eBay's interview preparation acts as a focused core curriculum. Amazon's requires a broad university-level study plan. Start with the core, then expand to the comprehensive set.

For specific question lists and patterns, visit the Amazon and eBay question pages: [Amazon Interview Questions](/company/amazon) | [eBay Interview Questions](/company/ebay)
