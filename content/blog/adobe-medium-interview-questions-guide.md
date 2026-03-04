---
title: "Medium Adobe Interview Questions: Strategy Guide"
description: "How to tackle 129 medium difficulty questions from Adobe — patterns, time targets, and practice tips."
date: "2032-02-13"
category: "tips"
tags: ["adobe", "medium", "interview prep"]
---

Medium Adobe interview questions typically involve implementing core algorithms, optimizing solutions, and handling edge cases—all within a 30-45 minute interview slot. These problems are less about obscure tricks and more about applying fundamental computer science concepts to practical scenarios. You'll often be asked to explain your reasoning, discuss trade-offs, and possibly improve an initial solution. Success here demonstrates you can write clean, efficient, and correct code under pressure.

## Common Patterns

Adobe's Medium problems frequently test a few key areas. Recognizing these patterns is crucial for a fast, structured response.

**Array/String Manipulation & Two Pointers:** Many problems involve searching, comparing, or transforming sequences. The two-pointer technique is a staple for optimizing these tasks.

<div class="code-group">

```python
# Example: Remove duplicates from sorted array in-place
def removeDuplicates(nums):
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read-1]:
            nums[write] = nums[read]
            write += 1
    return write
```

```javascript
// Example: Remove duplicates from sorted array in-place
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}
```

```java
// Example: Remove duplicates from sorted array in-place
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[read - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}
```

</div>

**Tree/Graph Traversal:** Questions often involve Binary Trees (BST operations, LCA) or basic graph searches (BFS/DFS) for hierarchical data.
**Dynamic Programming:** Expect problems where you must break down a problem into overlapping subproblems, such as finding maximum subarray or unique paths.
**Hash Map for Frequency/Index Tracking:** A common optimization to achieve O(1) or O(n) lookups for problems involving pairs, duplicates, or subarrays.

## Time Targets

In a typical 45-minute interview, your timeline should be:

- **Minutes 0-5:** Clarify the problem. Ask detailed questions about input, output, edge cases, and constraints. Verbally outline 1-2 approaches.
- **Minutes 5-25:** Code your optimal solution. Explain your logic as you write. Prioritize correctness and clean structure over premature optimization.
- **Minutes 25-35:** Test your code with the examples provided, plus edge cases (empty input, single element, large values). Fix any bugs.
- **Minutes 35-45:** Discuss time/space complexity. If asked, briefly explain how you might scale the solution or handle follow-up constraints.

Aim to have a fully coded and verbally explained solution within 30 minutes, leaving ample time for testing and discussion.

## Practice Strategy

Don't just solve problems; simulate interview conditions.

1. **Pattern-First Practice:** Group Adobe's Medium questions by the patterns above. Solve 3-5 of each type in a row to build pattern recognition muscle memory.
2. **Timebox Strictly:** Use a 30-minute timer for each problem. Spend the first 5 minutes planning without code. If stuck, note your blocking thought, review the solution, and re-attempt the same problem 24 hours later.
3. **Verbally Articulate:** Practice explaining your reasoning out loud as you code, as you will in the interview. Record yourself to identify unclear explanations.
4. **Prioritize Adobe's List:** Focus on the 129 Medium questions tagged for Adobe. They reflect the company's recent problem trends and technical focus areas.

[Practice Medium Adobe questions](/company/adobe/medium)
