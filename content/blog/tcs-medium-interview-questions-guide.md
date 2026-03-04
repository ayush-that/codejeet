---
title: "Medium TCS Interview Questions: Strategy Guide"
description: "How to tackle 103 medium difficulty questions from TCS — patterns, time targets, and practice tips."
date: "2032-02-19"
category: "tips"
tags: ["tcs", "medium", "interview prep"]
---

Medium questions at TCS represent the core of their technical interview, making up nearly half (103 out of 217) of their listed problems. These questions typically require applying a known algorithm or data structure to a moderately complex scenario. You won't find obscure tricks, but you must demonstrate clean, efficient, and correct implementation under time pressure. Success here separates candidates who can merely code from those who can solve problems systematically.

## Common Patterns

TCS's Medium problems heavily favor a few key areas. Mastering these patterns is essential.

**1. Array & String Manipulation:** Problems often involve searching, sorting, or transforming sequences. Sliding window and two-pointer techniques are frequent.

<div class="code-group">

```python
# Two-pointer: Remove duplicates from sorted array
def removeDuplicates(nums):
    if not nums:
        return 0
    i = 0
    for j in range(1, len(nums)):
        if nums[j] != nums[i]:
            i += 1
            nums[i] = nums[j]
    return i + 1
```

```javascript
// Two-pointer: Remove duplicates from sorted array
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  return i + 1;
}
```

```java
// Two-pointer: Remove duplicates from sorted array
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int i = 0;
    for (int j = 1; j < nums.length; j++) {
        if (nums[j] != nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1;
}
```

</div>

**2. Tree & Graph Traversal:** Binary tree problems (DFS/BFS, property checks) and basic graph algorithms (like finding connected components) are common.

**3. Dynamic Programming:** Expect straightforward DP applications, such as classic "knapsack" variants or path-counting problems. The focus is on identifying the state and recurrence relation.

## Time Targets

In a 45-60 minute interview slot, you may be given 1-2 Medium problems. Your target is to solve one complete Medium question in **20-25 minutes**. This includes:

- **3-5 minutes:** Understanding the problem, asking clarifying questions, and explaining your approach.
- **10-12 minutes:** Writing clean, syntactically correct code in your chosen language.
- **3-5 minutes:** Walking through a test case and discussing edge cases or optimization.

If you hit the 15-minute mark without a clear implementation path, you're in danger. Practice to build the muscle memory that lets you code the solution almost automatically once the approach is set.

## Practice Strategy

Don't just solve all 103 problems. Practice with intent.

1. **Pattern-First Sorting:** Use the "Tags" or "Patterns" filter. Group and solve all "Binary Search" or "Dynamic Programming" questions in a batch to deeply internalize the template.
2. **Simulate Interview Conditions:** Always set a 25-minute timer. Write code on a whiteboard or in a plain editor without auto-complete. Verbally explain your steps.
3. **Post-Solution Analysis:** After solving, immediately review the most efficient solution. If you used extra space or a suboptimal approach, re-implement it correctly. The goal is to refine your first instinct to match the optimal approach.
4. **Focus on Weaknesses:** If you consistently struggle with tree recursion, dedicate a week to just those problems. Depth, not breadth, builds competency.

[Practice Medium TCS questions](/company/tcs/medium)
