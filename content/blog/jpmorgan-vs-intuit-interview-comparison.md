---
title: "JPMorgan vs Intuit: Interview Question Comparison"
description: "Compare coding interview questions at JPMorgan and Intuit — difficulty levels, topic focus, and preparation strategy."
date: "2028-01-01"
category: "tips"
tags: ["jpmorgan", "intuit", "comparison"]
---

When preparing for technical interviews at major companies, understanding their specific question patterns and focus areas is crucial for efficient study. JPMorgan and Intuit, while both prominent in the financial technology space, have distinct profiles in their technical interview question banks. JPMorgan's list comprises 78 questions with a difficulty distribution of 25% Easy, 45% Medium, and 8% Hard. Intuit's list is slightly smaller at 71 questions, but with a more challenging spread: 10% Easy, 47% Medium, and 14% Hard. This data reveals not just volume, but a fundamental difference in the expected depth of problem-solving.

## Question Volume and Difficulty

The raw question counts are similar, but the difficulty distributions tell a more important story. JPMorgan's question bank is more accessible, with a significant portion (25%) classified as Easy. This suggests their interviews may place a stronger emphasis on foundational correctness, clear communication, and perhaps speed on more straightforward problems. The bulk of their questions are Medium (45%), which are the standard for assessing core algorithmic competency.

Intuit's bank signals a greater emphasis on complex problem-solving. With only 10% Easy questions and nearly double the proportion of Hard questions (14%) compared to JPMorgan, Intuit's interviews are likely designed to push candidates further. Succeeding here requires not just implementing a known algorithm, but often combining concepts or optimizing solutions under constraints. The high concentration of Medium questions (47%) remains the critical target for both.

## Topic Overlap

Both companies heavily test **Array** and **String** manipulation, as well as **Hash Table** usage. These are fundamental data structures for organizing and accessing data, making them universal interview staples. Mastery here is non-negotiable for either company.

The key differentiator lies in their secondary focus areas:

- **JPMorgan** lists **Sorting** as a top topic. This implies questions that involve organizing data as a primary step—think merging intervals, finding anagrams, or top K frequent elements—where the sorting logic is central to the solution.
- **Intuit** lists **Dynamic Programming (DP)** as a top topic. This is a significant ramp in complexity. DP problems (e.g., knapsack, longest common subsequence, unique paths) require breaking problems into overlapping subproblems and are a classic filter for advanced algorithmic thinking.

A problem like "Merge Intervals" could appear at both, but Intuit is more likely to follow it with a DP variant, while JPMorgan might lean toward a problem where sorting enables a hash map solution.

<div class="code-group">

```python
# Example: Top K Frequent Elements (Overlaps Sorting & Hash Table)
def topKFrequent(nums, k):
    count = {}
    for n in nums:
        count[n] = 1 + count.get(n, 0)
    # Sorting approach: O(n log n)
    sorted_items = sorted(count.items(), key=lambda x: x[1], reverse=True)
    return [num for num, freq in sorted_items[:k]]
```

```javascript
// Example: Top K Frequent Elements (Overlaps Sorting & Hash Table)
function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) {
    count.set(n, (count.get(n) || 0) + 1);
  }
  // Sorting approach: O(n log n)
  const sorted = Array.from(count.entries()).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, k).map((entry) => entry[0]);
}
```

```java
// Example: Top K Frequent Elements (Overlaps Sorting & Hash Table)
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int n : nums) {
        count.put(n, count.getOrDefault(n, 0) + 1);
    }
    // Sorting approach: O(n log n)
    List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(count.entrySet());
    entries.sort((a, b) -> b.getValue().compareTo(a.getValue()));
    int[] result = new int[k];
    for (int i = 0; i < k; i++) {
        result[i] = entries.get(i).getKey();
    }
    return result;
}
```

</div>

## Which to Prepare for First

Start with **JPMorgan's question list**. Its higher proportion of Easy questions and focus on Sorting provides a more gradual learning curve. You can solidify your fundamentals in arrays, strings, hash tables, and sorting algorithms. This builds a strong, versatile base. Solving most of JPMorgan's list will comfortably cover a large portion of Intuit's foundational (Easy/Medium) questions as well.

Once that base is solid, transition to **Intuit's list** to tackle the steeper challenge. Use the JPMorgan-prepared foundation to efficiently work through the shared Medium problems, then dedicate focused time to mastering Dynamic Programming patterns. This sequential approach prevents the discouragement of hitting complex DP problems before you've built confidence with core techniques.

For targeted practice, visit the JPMorgan question list and the Intuit question list on CodeJeet.
