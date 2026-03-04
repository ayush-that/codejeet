---
title: "Goldman Sachs vs DE Shaw: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and DE Shaw — difficulty levels, topic focus, and preparation strategy."
date: "2028-01-23"
category: "tips"
tags: ["goldman-sachs", "de-shaw", "comparison"]
---

When preparing for technical interviews at top quantitative and financial firms, understanding the specific focus areas and difficulty profiles of each company can significantly streamline your study process. Goldman Sachs and DE Shaw represent two distinct archetypes: a global investment bank with a broad engineering footprint and a premier quantitative hedge fund known for its rigorous technical bar. While both assess core algorithmic competency, their question distributions and emphasis reveal different priorities in candidate evaluation.

## Question Volume and Difficulty

Goldman Sachs presents a larger volume of documented interview questions (270 total) compared to DE Shaw (124 total). The difficulty distribution also differs notably.

Goldman Sachs (E51/M171/H48) shows a pronounced focus on **Medium-difficulty problems**, which constitute nearly 63% of its question pool. This suggests their interviews heavily test the reliable application of standard algorithms to moderately complex scenarios. The substantial number of Easy questions (51) indicates they may screen for fundamental coding fluency early in the process. The 48 Hard questions typically appear in later rounds or for specialized roles.

DE Shaw (E12/M74/H38) has a more compact question set with a steeper baseline. The proportion of Easy questions is significantly lower (less than 10%), pointing to an expectation of strong fundamentals from the outset. Like Goldman, the majority of questions are Medium (60%), but the overall set is more concentrated on challenging applications. The higher ratio of Hard questions (31% vs Goldman's 18%) underscores DE Shaw's reputation for a highly selective, depth-oriented process.

## Topic Overlap

Both firms heavily test **Array**, **String**, and **Dynamic Programming (DP)**. This is the core technical overlap.

- **Array and String** problems form the foundation, often involving two-pointers, sliding window, or matrix traversal.
- **Dynamic Programming** is critical for both, frequently covering classic problems like knapsack, longest common subsequence, or unique paths, as well as optimized variations.

The key divergence is in the fourth most frequent topic:

- **Goldman Sachs** prioritizes **Hash Table** problems. This aligns with a focus on data organization, lookups, and solving problems involving frequency counting or matching (e.g., two-sum, group anagrams).
- **DE Shaw** emphasizes **Greedy** algorithms. This points to an interview style that favors problems requiring optimal local choices and rigorous proof of correctness (e.g., task scheduling, interval problems).

Here is a typical problem that could appear at either firm, solved using a two-pointer technique on an array:

<div class="code-group">

```python
def remove_duplicates(nums):
    if not nums:
        return 0
    insert_pos = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i-1]:
            nums[insert_pos] = nums[i]
            insert_pos += 1
    return insert_pos
```

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let insertPos = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }
  return insertPos;
}
```

```java
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int insertPos = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] != nums[i - 1]) {
            nums[insertPos] = nums[i];
            insertPos++;
        }
    }
    return insertPos;
}
```

</div>

## Which to Prepare for First

Prepare for **Goldman Sachs first** if you are early in your interview journey or targeting multiple company types. Its broader question set and higher number of Easy/Medium problems provide a comprehensive review of data structures and common algorithms. Mastering the Goldman Sachs list will build a strong, general foundation. The emphasis on Hash Tables is also highly transferable to other tech interviews.

Shift focus to **DE Shaw** after establishing that strong base. Its question set assumes proficiency and tests for deeper optimization and more advanced problem-solving, particularly in Greedy and DP. Use the Goldman preparation as a prerequisite; then, concentrate on solving harder problems, proving algorithm correctness, and refining your approach to the most challenging Medium and Hard questions. The skills gained from DE Shaw prep will then serve you well in any subsequent high-bar interview.

For targeted practice, visit the company pages: [Goldman Sachs](/company/goldman-sachs) and [DE Shaw](/company/de-shaw).
