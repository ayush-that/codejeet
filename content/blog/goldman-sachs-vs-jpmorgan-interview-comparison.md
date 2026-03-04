---
title: "Goldman Sachs vs JPMorgan: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and JPMorgan — difficulty levels, topic focus, and preparation strategy."
date: "2028-02-12"
category: "tips"
tags: ["goldman-sachs", "jpmorgan", "comparison"]
---

When preparing for technical interviews at top investment banks, understanding the specific focus and expectations of each firm is crucial. Both Goldman Sachs and JPMorgan Chase are renowned for their rigorous technical screening, but data from coding interview platforms reveals distinct differences in their approach. This comparison analyzes their question volume, difficulty distribution, and core topics to help you strategize your preparation effectively.

## Question Volume and Difficulty

The most striking difference is the sheer volume of documented questions. Goldman Sachs has a significantly larger pool, with approximately **270 questions** cataloged. JPMorgan's pool is smaller, with around **78 questions**. This suggests that Goldman's interview process may pull from a broader set of problems or that its process has been more extensively documented by candidates.

The difficulty distribution also differs markedly:

- **Goldman Sachs (270q):** Easy: 51 (19%), Medium: 171 (63%), Hard: 48 (18%).
- **JPMorgan (78q):** Easy: 25 (32%), Medium: 45 (58%), Hard: 8 (10%).

Goldman Sachs places a heavier emphasis on **Medium and Hard problems**, with over 80% of its questions falling into these categories. The presence of nearly 50 Hard problems indicates you must be prepared for complex algorithmic challenges. In contrast, JPMorgan's question set is more approachable, with a higher proportion of Easy questions and far fewer Hard ones. This doesn't mean JPMorgan interviews are easy, but it suggests their initial technical screens might focus more on foundational correctness and problem-solving approach rather than extreme optimization.

## Topic Overlap

Both firms heavily test fundamental data structures. The core overlapping topics are **Array, String, and Hash Table** problems. Mastering these is non-negotiable for either interview.

**Goldman Sachs** has a fourth major topic: **Dynamic Programming (DP)**. The significant number of DP questions indicates you must be proficient with this paradigm, particularly for medium and hard problems involving optimization, counting, or decision-making.

**JPMorgan's** fourth key topic is **Sorting**. While sorting algorithms themselves are less likely to be implemented from scratch, many array and string problems will require efficient sorting as a key step. JPMorgan's focus here aligns with a strong emphasis on data manipulation and logical ordering.

Here’s a typical problem that could appear at either firm, focusing on the core overlap of arrays and hash tables:

<div class="code-group">

```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Example
print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]
```

```javascript
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

// Example
console.log(twoSum([2, 7, 11, 15], 9)); // Output: [0, 1]
```

```java
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

// Example usage would return [0, 1] for twoSum(new int[]{2,7,11,15}, 9)
```

</div>

A Goldman-specific DP problem might involve finding the length of the longest increasing subsequence, while a JPMorgan-specific problem might involve custom sorting of an array of strings.

## Which to Prepare for First

Your preparation priority should be guided by the breadth and depth required.

**Prepare for Goldman Sachs first if** you are interviewing there, or if you have time for a deep, comprehensive study cycle. Mastering the Goldman Sachs question set inherently covers JPMorgan's requirements. The rigorous practice with Medium/Hard problems and Dynamic Programming will make JPMorgan's focus areas feel more manageable. Use the large question pool to pressure-test your skills under time constraints.

**Prepare for JPMorgan first if** you are new to technical interviews or have an earlier interview date with them. The smaller, slightly less difficult question pool allows you to build confidence by solidifying fundamentals in Arrays, Strings, Hash Tables, and Sorting. This creates a strong foundation. You can then layer on the additional complexity of Dynamic Programming and more challenging problems needed for Goldman Sachs.

Ultimately, a strong candidate will be proficient in the shared core topics. The key differentiator is the dedicated practice required for Goldman's Dynamic Programming and harder problem sets. Start with the firm whose interview comes first, but structure your study plan to build from fundamental data manipulation (JPMorgan's strength) to advanced algorithmic optimization (Goldman's demand).

For specific question lists and patterns, visit the [Goldman Sachs](/company/goldman-sachs) and [JPMorgan Chase](/company/jpmorgan) company pages.
