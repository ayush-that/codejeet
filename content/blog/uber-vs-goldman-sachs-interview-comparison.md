---
title: "Uber vs Goldman Sachs: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Goldman Sachs — difficulty levels, topic focus, and preparation strategy."
date: "2027-04-28"
category: "tips"
tags: ["uber", "goldman-sachs", "comparison"]
---

When preparing for technical interviews at top companies, understanding their specific question patterns and focus areas is crucial for efficient study. Both Uber and Goldman Sachs ask rigorous coding questions, but their profiles differ in volume, difficulty distribution, and topical emphasis. This comparison breaks down their question banks to help you prioritize your preparation.

## Question Volume and Difficulty

Uber's question bank is notably larger and more challenging. With 381 total questions, it has a higher proportion of Hard questions (103, or 27%) compared to Goldman Sachs's 270 total questions, which includes only 48 Hard questions (18%). The Medium question count is also significantly higher at Uber (224 vs. 171). This suggests Uber's technical screen and onsite rounds often involve complex problem-solving under pressure, requiring deep mastery of algorithms.

Goldman Sachs, while still demanding, presents a more moderate difficulty curve. Over half of its questions are categorized as Easy or Medium (222 out of 270), indicating a stronger focus on assessing fundamental competency and clean code. The interview may place greater weight on financial domain knowledge, system design, or behavioral fit alongside core coding skills.

## Topic Overlap

Both companies heavily test the same four core data structures: **Array, String, Hash Table, and Dynamic Programming**. This massive overlap is your strategic advantage. Mastering these topics serves a dual purpose.

- **Array and String** questions often involve two-pointers, sliding window, and matrix traversal.
- **Hash Table** is ubiquitous for optimizing lookups and solving problems related to counts/frequencies.
- **Dynamic Programming** is critical for optimization problems, though Goldman's lower Hard count may imply slightly less emphasis on its most complex variants.

The key difference lies in application context. Uber's questions frequently model real-world logistics, mapping, and dispatch problems (e.g., shortest path variants, rate limiting, matching). Goldman Sachs questions may lean toward numerical analysis, data processing, and transaction simulation.

<div class="code-group">

```python
# Example: A Hash Table problem applicable to both.
# Count elements to find a pair/sum.
def count_pairs(arr, target):
    seen = {}
    count = 0
    for num in arr:
        complement = target - num
        if complement in seen:
            count += seen[complement]
        seen[num] = seen.get(num, 0) + 1
    return count
```

```javascript
// Example: A Hash Table problem applicable to both.
// Count elements to find a pair/sum.
function countPairs(arr, target) {
  const seen = new Map();
  let count = 0;
  for (const num of arr) {
    const complement = target - num;
    count += seen.get(complement) || 0;
    seen.set(num, (seen.get(num) || 0) + 1);
  }
  return count;
}
```

```java
// Example: A Hash Table problem applicable to both.
// Count elements to find a pair/sum.
public int countPairs(int[] arr, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    int count = 0;
    for (int num : arr) {
        int complement = target - num;
        count += seen.getOrDefault(complement, 0);
        seen.put(num, seen.getOrDefault(num, 0) + 1);
    }
    return count;
}
```

</div>

## Which to Prepare for First

Prepare for **Uber first**. This is the most efficient path because its question bank is broader and deeper. If you can solve a significant portion of Uber's Medium and Hard problems on the core topics, you will inherently cover nearly the entire scope of Goldman Sachs's coding interview. This approach builds a higher ceiling of problem-solving skill.

Start by drilling the shared core topics (Array, String, Hash Table, DP). Practice Uber's questions to get comfortable with higher difficulty and problem modeling. Then, as your interview with Goldman Sachs approaches, you can shift to reviewing their specific question list to familiarize yourself with any financial context and confirm your mastery of the fundamentals. This strategy ensures you are over-prepared for Goldman and adequately prepared for Uber, rather than the reverse.

For targeted practice, visit the company-specific pages: [Uber Interview Questions](/company/uber) and [Goldman Sachs Interview Questions](/company/goldman-sachs).
