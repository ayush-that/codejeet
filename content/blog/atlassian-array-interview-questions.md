---
title: "Array Questions at Atlassian: What to Expect"
description: "Prepare for Array interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-18"
category: "dsa-patterns"
tags: ["atlassian", "array", "interview prep"]
---

Array questions dominate Atlassian's technical interview landscape, making up 40 of their 62 most frequently asked problems. This focus isn't arbitrary. Atlassian's core products—like Jira, Confluence, and Bitbucket—are built on systems that manage vast streams of data: issue histories, user permissions, version control commits, and real-time updates. Under the hood, these operations rely heavily on efficient array and list manipulation for sorting, filtering, searching, and transforming data. Mastering arrays is not just about solving a puzzle; it's about demonstrating the fundamental skill of processing ordered data efficiently, a daily requirement for engineers building and scaling their platforms.

## What to Expect — Types of Problems

Atlassian's array problems tend to test practical application over obscure theory. You can expect a strong emphasis on **in-place algorithms** that modify the input array without using extra space, reflecting constraints in memory-efficient software. **Two-pointer techniques** are pervasive, used for tasks like partitioning, searching in sorted data, or finding pairs. Problems often involve **simulation**, where you must model a process step-by-step, such as rotating an array or rearranging elements based on specific rules. Another common theme is **prefix sums or running totals**, useful for quick range queries. The problems are frequently framed in a business-logic context—like managing a queue of tasks, processing log entries, or calculating aggregates—but they ultimately reduce to core array manipulation patterns.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition. Don't just memorize solutions; learn the underlying techniques. Practice writing clean, bug-free code under time pressure. A critical pattern is the **two-pointer swap for in-place rearrangement**, commonly used to move specific elements (like zeros or a target value) to one end.

Here is a classic example: moving all zeros in an array to the end while maintaining the relative order of non-zero elements.

<div class="code-group">

```python
def moveZeroes(nums):
    # Pointer for the position of the next non-zero element
    insert_pos = 0

    for i in range(len(nums)):
        if nums[i] != 0:
            # Swap the non-zero element to the front section
            nums[insert_pos], nums[i] = nums[i], nums[insert_pos]
            insert_pos += 1
    # The array is modified in-place
    return nums
```

```javascript
function moveZeroes(nums) {
  let insertPos = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      // Swap elements
      [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
      insertPos++;
    }
  }
  return nums;
}
```

```java
public void moveZeroes(int[] nums) {
    int insertPos = 0;

    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            // Swap elements
            int temp = nums[insertPos];
            nums[insertPos] = nums[i];
            nums[i] = temp;
            insertPos++;
        }
    }
}
```

</div>

The key is using one pointer (`insertPos`) to track where the next non-zero element should go, and another (`i`) to scan the array. This runs in O(n) time and O(1) space.

## Recommended Practice Order

Start with foundational in-place operations and two-pointer techniques. Then, move to problems involving sliding windows and prefix sums. Finally, tackle the more complex simulation-style questions that combine multiple patterns. Prioritize problems that appear most frequently in Atlassian's question list.

[Practice Array at Atlassian](/company/atlassian/array)
