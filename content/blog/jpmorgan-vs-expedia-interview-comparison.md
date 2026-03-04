---
title: "JPMorgan vs Expedia: Interview Question Comparison"
description: "Compare coding interview questions at JPMorgan and Expedia — difficulty levels, topic focus, and preparation strategy."
date: "2028-01-25"
category: "tips"
tags: ["jpmorgan", "expedia", "comparison"]
---

When preparing for technical interviews at major companies, understanding their specific focus areas can dramatically improve your efficiency. JPMorgan and Expedia, while both requiring strong algorithmic skills, present distinct profiles in question volume, difficulty, and topic emphasis. This comparison breaks down their patterns to help you prioritize your study.

## Question Volume and Difficulty

JPMorgan's question bank is notably larger and slightly more challenging overall. With 78 total questions, it provides a broader set of problems to study. The difficulty distribution (25 Easy, 45 Medium, 8 Hard) shows a strong emphasis on Medium-level problems, which are the core of most technical screens. The presence of several Hard questions indicates you may encounter complex scenarios, especially in later interview rounds.

Expedia's list is more compact at 54 questions, which can make focused preparation more manageable. Its distribution (13 Easy, 35 Medium, 6 Hard) also centers on Medium difficulty but with a slightly lower volume in each category. This suggests the interview process may be slightly less intensive in its pure algorithmic demands, though still rigorous.

**Key Takeaway:** JPMorgan requires preparation across a wider array of problems and a higher likelihood of encountering a challenging Hard question. Expedia's list, while still substantial, allows for deeper mastery of a smaller core set.

## Topic Overlap

Both companies heavily test foundational data structures. **Array, String, and Hash Table** problems form the common core for both. These are essential for any interview prep.

The primary difference lies in their secondary focus:

- **JPMorgan** lists **Sorting** as a key topic. This often involves not just using a built-in sort, but implementing custom comparators, solving problems where sorting is the key insight (like "Kth Largest Element" or "Merge Intervals"), and understanding time/space complexity of sort operations.
- **Expedia** highlights **Greedy** algorithms. This points to problems where making a locally optimal choice at each step leads to a global optimum, such as "Task Scheduler," "Jump Game," or "Maximum Subarray."

This distinction influences the problem types you'll see most frequently.

<div class="code-group">

```python
# JPMorgan Focus: Custom Sorting (Python)
# Problem: Sort a list of intervals [start, end] by start time.
intervals = [[1,3],[8,10],[2,6],[15,18]]
intervals.sort(key=lambda x: x[0])
print(intervals) # [[1, 3], [2, 6], [8, 10], [15, 18]]

# Expedia Focus: Greedy (Python)
# Problem: Find minimum number of jumps to reach end (Jump Game II).
def jump(nums):
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums)-1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    return jumps
```

```javascript
// JPMorgan Focus: Custom Sorting (JavaScript)
// Problem: Sort strings by custom order (e.g., by length).
let strings = ["apple", "fig", "banana"];
strings.sort((a, b) => a.length - b.length);
console.log(strings); // ['fig', 'apple', 'banana']

// Expedia Focus: Greedy (JavaScript)
// Problem: Maximum sum of non-adjacent elements (House Robber).
function rob(nums) {
  let prev1 = 0,
    prev2 = 0;
  for (let num of nums) {
    let temp = prev1;
    prev1 = Math.max(prev2 + num, prev1);
    prev2 = temp;
  }
  return prev1;
}
```

```java
// JPMorgan Focus: Custom Sorting (Java)
// Problem: Sort a 2D array based on the second element.
import java.util.Arrays;
import java.util.Comparator;
int[][] intervals = {{1,3}, {8,10}, {2,6}, {15,18}};
Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
// intervals is now sorted by start time.

// Expedia Focus: Greedy (Java)
// Problem: Partition labels (minimize partitions so each letter appears in one).
public List<Integer> partitionLabels(String s) {
    int[] lastIndex = new int[26];
    for (int i = 0; i < s.length(); i++) {
        lastIndex[s.charAt(i) - 'a'] = i;
    }
    List<Integer> result = new ArrayList<>();
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, lastIndex[s.charAt(i) - 'a']);
        if (i == end) {
            result.add(end - start + 1);
            start = i + 1;
        }
    }
    return result;
}
```

</div>

## Which to Prepare for First

Start with the **common core**. Mastering Array, String, and Hash Table problems will build a foundation applicable to both companies. Practice high-frequency problems like Two Sum, Sliding Window, and Anagram checks.

If your goal is to interview at **both**, prepare for **JPMorgan first**. Its larger question bank and inclusion of Sorting covers more ground. The problem-solving patterns you develop for its Medium and Hard questions will naturally encompass the logic needed for many Greedy problems. Once comfortable with JPMorgan's list, reviewing Expedia's specific Greedy-focused problems will be a more targeted, efficient step.

If you are only targeting one company, tailor your deep dive accordingly: dedicate extra time to Sorting techniques and a wider variety of problems for JPMorgan, and drill down on canonical Greedy algorithms for Expedia.

For specific question lists and patterns, visit the company pages: [JPMorgan Interview Questions](/company/jpmorgan) and [Expedia Interview Questions](/company/expedia).
