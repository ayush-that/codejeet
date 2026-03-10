---
title: "Oracle vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Oracle and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2030-09-11"
category: "tips"
tags: ["oracle", "ebay", "comparison"]
---

# Oracle vs eBay: Interview Question Comparison

If you're interviewing at both Oracle and eBay, you're facing two distinct challenges. One is a legacy tech giant with a massive question bank, the other a focused e-commerce platform with a more curated set. The key insight isn't just that Oracle has more questions—it's that their interview philosophies differ significantly. Oracle tests breadth and algorithmic rigor across more domains, while eBay emphasizes practical, data-heavy problems relevant to their business. Preparing for both simultaneously is possible with smart prioritization.

## Question Volume and Difficulty

The numbers tell a clear story: **Oracle (340 questions)** versus **eBay (60 questions)**. This isn't just about quantity—it's about what each company values in their screening process.

Oracle's distribution (Easy: 70, Medium: 205, Hard: 65) reveals their approach: they lean heavily on Medium problems as their primary filter. With 205 Medium questions, they're testing not just whether you can solve problems, but whether you can solve moderately complex problems reliably. The 65 Hard questions typically appear in later rounds for senior positions. This spread suggests Oracle interviews will have multiple coding rounds with increasing difficulty.

eBay's distribution (Easy: 12, Medium: 38, Hard: 10) is more concentrated. The 38 Medium questions form their core assessment, with fewer extremes on either end. This indicates eBay interviews might involve fewer coding rounds or combine coding with more domain-specific discussions. The smaller question bank also means they likely reuse questions more frequently or dive deeper into follow-ups.

**Implication:** For Oracle, you need broader pattern recognition. For eBay, you need deeper mastery of their favored topics.

## Topic Overlap

Both companies heavily test **Array, String, and Hash Table** problems. This overlap is your preparation sweet spot—mastering these topics gives you maximum return on investment for both interviews.

However, their unique focuses reveal different priorities:

- **Oracle adds Dynamic Programming** as a core topic. This isn't surprising for a company dealing with database optimization, distributed systems, and complex enterprise software. DP questions test systematic thinking and optimization—skills valuable for their infrastructure roles.
- **eBay adds Sorting** as a core topic. This aligns with e-commerce needs: ranking products, processing transactions, organizing user data, and optimizing search results. Sorting algorithms and their applications appear frequently in their problem set.

The Hash Table emphasis at both companies is worth noting. For Oracle, it's often about optimizing lookups in system design scenarios. For eBay, it's frequently about user session management, shopping cart tracking, or inventory counting.

## Preparation Priority Matrix

Here's how to allocate your study time strategically:

**Tier 1: Overlap Topics (Study First)**

- Arrays: Two-pointer techniques, sliding window, prefix sums
- Strings: Manipulation, palindrome checks, anagram problems
- Hash Tables: Frequency counting, complement finding, caching patterns

**Tier 2: Oracle-Specific Priority**

- Dynamic Programming: Start with 1D DP (Fibonacci patterns), then 2D DP (grid problems)
- Also prepare for Tree and Graph problems (common in their full question set)

**Tier 3: eBay-Specific Priority**

- Sorting: Not just knowing algorithms, but applying them creatively
- Focus on problems where sorting enables an optimal solution

**Recommended LeetCode problems for overlap preparation:**

- Two Sum (#1) - The classic hash table problem
- Valid Anagram (#242) - String manipulation with frequency counting
- Product of Array Except Self (#238) - Array manipulation without division
- Longest Substring Without Repeating Characters (#3) - Sliding window on strings
- Merge Intervals (#56) - Array sorting and merging (doubly useful for eBay)

## Interview Format Differences

**Oracle** typically follows a more traditional tech interview structure:

- 4-5 rounds including coding, system design, and behavioral
- Coding rounds: 45-60 minutes, often 2 problems per round (one Medium, one Medium-Hard)
- System design expectations: Varies by level, but for mid-senior roles, expect distributed system design
- Behavioral weight: Moderate—they care about cultural fit in enterprise environment
- Often includes a "data structures deep dive" round focusing on implementation details

**eBay** tends toward a more integrated approach:

- 3-4 rounds with mixed focus
- Coding rounds: 60 minutes, often 1 problem with multiple follow-up questions
- System design: More practical, focused on e-commerce scenarios (shopping carts, recommendation systems)
- Behavioral weight: Higher—they emphasize collaboration and product thinking
- May include a "data manipulation" round focusing on real dataset problems

The key difference: Oracle tests algorithmic purity, eBay tests practical application.

## Specific Problem Recommendations

These five problems provide coverage for both companies:

1. **Two Sum (#1)** - The foundational hash table problem. Master the basic version, then practice variants like Two Sum II (sorted input) and Three Sum. This pattern appears constantly.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

```javascript
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const seen = new Map();
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
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}
```

</div>

2. **Merge Intervals (#56)** - Covers sorting (valuable for eBay) and array manipulation (valuable for both). Practice both the basic merge and variants like inserting new intervals.

3. **Longest Palindromic Substring (#5)** - Excellent for string manipulation practice with dynamic programming aspects. The DP solution helps prepare for Oracle, while the expanding window solution is efficient and elegant.

4. **Maximum Subarray (#53)** - Teaches both the sliding window/Kadane's algorithm approach and has DP interpretations. This problem's patterns apply to many real-world scenarios both companies care about.

5. **Coin Change (#322)** - A classic DP problem that's highly relevant for Oracle. Even if eBay doesn't ask pure DP, the systematic thinking here translates to optimization problems they do ask.

## Which to Prepare for First

**Prepare for Oracle first, then adapt for eBay.** Here's why:

Oracle's broader coverage means studying for them automatically prepares you for 80% of eBay's technical interview. Once you've built your foundation with Oracle's question bank (focusing on Arrays, Strings, Hash Tables, and DP), you only need to:

1. Add sorting-specific practice for eBay
2. Shift your mindset from "algorithmic purity" to "practical application"
3. Practice explaining your solutions in business context for eBay

The reverse doesn't work as well—preparing only for eBay leaves gaps in DP and other topics Oracle consistently tests.

**Timeline suggestion:** If you have 4 weeks, spend 3 on Oracle-focused prep (with overlap topics first), then 1 week transitioning to eBay mindset with sorting practice and mock interviews focused on practical explanations.

Remember: Both companies ultimately test problem-solving, not just memorization. The patterns you learn for one will serve you at the other, and throughout your career.

For more company-specific insights, visit our [Oracle interview guide](/company/oracle) and [eBay interview guide](/company/ebay).
