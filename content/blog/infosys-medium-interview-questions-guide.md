---
title: "Medium Infosys Interview Questions: Strategy Guide"
description: "How to tackle 82 medium difficulty questions from Infosys — patterns, time targets, and practice tips."
date: "2032-03-20"
category: "tips"
tags: ["infosys", "medium", "interview prep"]
---

Medium questions at Infosys form the core technical assessment, representing over half of their problem set. These problems test your ability to apply fundamental data structures and algorithms to scenarios more complex than basic array manipulation. Expect to see problems that require combining concepts—like using a hash map to optimize a traversal or applying a standard algorithm to a slightly novel situation. Success here demonstrates you can move beyond syntax to solve practical, logical challenges.

## Common Patterns

Infosys's Medium questions frequently test a few key areas. Recognizing these patterns is crucial for efficient problem-solving.

**Array/String Manipulation & Hashing:** Many problems involve searching, comparing, or transforming sequences. Using a hash map (dictionary, object, HashMap) to store counts or indices for O(1) lookups is a common optimization tactic.

<div class="code-group">

```python
# Example: Find two numbers that sum to a target.
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

```javascript
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
public int[] twoSum(int[] nums, int target) {
    HashMap<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] {map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[0];
}
```

</div>

**Tree & Graph Traversals:** Questions often involve standard Breadth-First Search (BFS) or Depth-First Search (DFS) on binary trees or simple graphs to find paths, levels, or validate properties.

**Dynamic Programming Fundamentals:** You'll encounter introductory DP problems, typically 1D, focused on classic patterns like counting ways or finding optimal sub-structures (e.g., climbing stairs, house robber variants).

**Sorting & Two-Pointer Techniques:** Problems involving pairing elements, finding triples, or merging intervals often have efficient solutions using sorting followed by the two-pointer approach.

## Time Targets

In a timed interview or online assessment, your goal for a Medium problem should be to produce a working, optimized solution within **25-30 minutes**. Break this down: spend 5-7 minutes understanding the problem and edge cases, 10-12 minutes designing the algorithm and writing pseudocode, and 8-10 minutes implementing and testing the code. If you hit the 15-minute mark without a clear approach, state your current thoughts and ask for a hint rather than staying silent. Demonstrating logical progression is more important than perfect, unaided speed.

## Practice Strategy

Don't just solve problems; simulate interview conditions. Pick a Medium Infosys question, set a 30-minute timer, and solve it verbally as if explaining to an interviewer. Focus on problems tagged with the patterns above. After solving, analyze the official solution—even if your code worked. Identify the most efficient approach and note any language-specific optimizations. Revisit problems you solved more than a week later to reinforce the pattern without relying on short-term memory. This active recall builds the fluency needed to handle variations under pressure.

[Practice Medium Infosys questions](/company/infosys/medium)
