---
title: "Medium Morgan Stanley Interview Questions: Strategy Guide"
description: "How to tackle 34 medium difficulty questions from Morgan Stanley — patterns, time targets, and practice tips."
date: "2032-09-22"
category: "tips"
tags: ["morgan-stanley", "medium", "interview prep"]
---

Medium questions at Morgan Stanley typically assess your ability to apply core data structures and algorithms to realistic, finance-adjacent scenarios. These problems often involve arrays, strings, linked lists, and trees, with a focus on clean implementation and edge-case handling under moderate time constraints. Success here demonstrates the logical rigor and coding clarity expected for technical roles.

## Common Patterns

Morgan Stanley's Medium problems frequently test a few key areas. **Array and String Manipulation** is common, often involving sliding windows, two-pointer techniques, or careful index management to simulate processes like order matching or transaction logging.

<div class="code-group">

```python
# Example: Two-pointer for a sorted array problem
def find_pair(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]
```

```javascript
// Example: Two-pointer for a sorted array problem
function findPair(arr, target) {
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    const currentSum = arr[left] + arr[right];
    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}
```

```java
// Example: Two-pointer for a sorted array problem
public int[] findPair(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        if (currentSum == target) {
            return new int[]{left, right};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{-1, -1};
}
```

</div>

**Linked List Operations** appear regularly, testing your ability to handle node reordering, detection of cycles, or merges without extra space. **Tree Traversal** problems (DFS/BFS) are also prevalent, sometimes framed around hierarchical data analysis or searching through structured records.

## Time Targets

For a 45-60 minute interview slot, you should aim to solve a Medium problem within **25-30 minutes**. This includes understanding the problem, discussing your approach (5-7 minutes), writing clean, correct code (15-18 minutes), and walking through test cases (5 minutes). Practice articulating your thought process clearly while coding to demonstrate communication skills under time pressure.

## Practice Strategy

Don't just solve problems passively. First, categorize each Morgan Stanley Medium question by its core pattern (e.g., "sliding window," "in-place reversal"). Solve it thoroughly, then immediately attempt a similar problem from another source to reinforce the pattern. Focus on writing bug-free code on your first attempt—this mirrors interview conditions. Regularly revisit problems you solved more than a week ago to ensure retention. Finally, simulate full interviews: set a 30-minute timer, explain your reasoning aloud, and code without an IDE.

[Practice Medium Morgan Stanley questions](/company/morgan-stanley/medium)
