---
title: "Goldman Sachs vs Intuit: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Intuit — difficulty levels, topic focus, and preparation strategy."
date: "2028-02-16"
category: "tips"
tags: ["goldman-sachs", "intuit", "comparison"]
---

When preparing for technical interviews at top companies, understanding their specific focus areas can dramatically improve your efficiency. Goldman Sachs and Intuit, while both prestigious, have distinct hiring processes reflected in their question libraries. Goldman Sachs presents a massive, broad set of challenges, while Intuit offers a more concentrated, role-specific list. This comparison breaks down the key differences in volume, difficulty, and topic emphasis to help you strategize your preparation.

## Question Volume and Difficulty

The most striking difference is scale. Goldman Sachs' list of approximately 270 questions dwarfs Intuit's 71. This volume suggests Goldman Sachs interviews may pull from a wider pool of problems or that candidates need to be prepared for more varied challenges.

The difficulty distribution also differs:

- **Goldman Sachs (E51/M171/H48):** Medium difficulty questions form the core (63% of the list), with a significant number of Hard (18%) and Easy (19%) problems. This indicates a strong emphasis on complex problem-solving and algorithmic optimization.
- **Intuit (E10/M47/H14):** The focus is even more sharply on Medium difficulty, which constitutes 66% of its list. The proportions of Easy (14%) and Hard (20%) questions are similar to Goldman's, but the absolute number is far smaller.

In practice, preparing for Goldman Sachs is a broader, more intensive endeavor due to sheer volume. Mastering the Medium and Hard problems in their list requires significant time. For Intuit, depth on a smaller set of core Medium problems is crucial.

## Topic Overlap

Both companies emphasize the same fundamental data structures, but with a subtle shift in priority.

**Goldman Sachs:** Array, String, Hash Table, Dynamic Programming
**Intuit:** Array, Dynamic Programming, String, Hash Table

The top four topics are identical, confirming their universal importance. However, Goldman leads with **Array** and **String** manipulations, often the basis for complex scenarios involving sorting, searching, and two-pointer techniques. Intuit places **Dynamic Programming** in the second position, potentially signaling a slightly greater emphasis on optimization and recursive problem-solving, which is common in domains dealing with complex financial or data logic.

Here’s a typical array problem that could appear at either company:

<div class="code-group">

```python
def max_subarray(nums):
    max_current = max_global = nums[0]
    for num in nums[1:]:
        max_current = max(num, max_current + num)
        max_global = max(max_global, max_current)
    return max_global
```

```javascript
function maxSubarray(nums) {
  let maxCurrent = nums[0];
  let maxGlobal = nums[0];
  for (let i = 1; i < nums.length; i++) {
    maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
    maxGlobal = Math.max(maxGlobal, maxCurrent);
  }
  return maxGlobal;
}
```

```java
public int maxSubArray(int[] nums) {
    int maxCurrent = nums[0];
    int maxGlobal = nums[0];
    for (int i = 1; i < nums.length; i++) {
        maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
        maxGlobal = Math.max(maxGlobal, maxCurrent);
    }
    return maxGlobal;
}
```

</div>

For a DP-heavy question more aligned with Intuit's visible emphasis, a problem like "Longest Increasing Subsequence" is highly relevant.

## Which to Prepare for First

Your preparation order should be guided by your goals and timeline.

**Prepare for Intuit first if:** You are early in your interview preparation cycle or are specifically targeting Intuit. The smaller, more focused question set allows you to achieve deep competency on high-probability topics like Arrays and DP efficiently. Success here builds a strong foundation in core patterns that are also essential for Goldman Sachs.

**Prepare for Goldman Sachs first if:** You are aiming for investment banks or have a longer preparation timeline. Tackling the extensive Goldman list will force you to cover a wider range of problem variations and difficulty levels. This comprehensive preparation inherently covers virtually all of Intuit's potential questions, making subsequent Intuit-focused study a quick review.

A strategic hybrid approach is often best: **Start with the core topics common to both (Array, String, Hash Table, DP)**. Achieve mastery here using problems from both lists. Then, if targeting Goldman Sachs, expand into the larger volume of Medium and Hard problems across other categories. If targeting Intuit, drill down on the specific problems in their list.

For detailed question lists and patterns, visit the Goldman Sachs and Intuit company pages: [Goldman Sachs](/company/goldman-sachs), [Intuit](/company/intuit).
