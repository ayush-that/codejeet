---
title: "DoorDash vs Expedia: Interview Question Comparison"
description: "Compare coding interview questions at DoorDash and Expedia — difficulty levels, topic focus, and preparation strategy."
date: "2034-03-04"
category: "tips"
tags: ["doordash", "expedia", "comparison"]
---

# DoorDash vs Expedia: A Strategic Interview Question Comparison

If you're interviewing at both DoorDash and Expedia, you're looking at two distinct technical interview cultures. DoorDash interviews like a pure tech company, while Expedia interviews like a tech-enabled travel business. The preparation overlap is about 70% — enough that you can study efficiently for both, but different enough that you'll need targeted work for each. Here's what you need to know to allocate your limited prep time effectively.

## Question Volume and Difficulty: Intensity vs Selectivity

DoorDash's 87 questions in the database versus Expedia's 54 tells the first story: DoorDash interviews more candidates, has more data points, and likely has a more standardized, intense process. The difficulty breakdown reveals even more:

**DoorDash (E6/M51/H30):** Medium-heavy with substantial hard questions (34% hard). This matches their reputation for rigorous technical screening. They're testing not just if you can solve problems, but if you can solve _challenging_ problems under pressure. The high hard percentage suggests they expect senior candidates to handle complex graph traversals, optimization problems, or tricky dynamic programming.

**Expedia (E13/M35/H6):** Medium-focused with minimal hard questions (11% hard). This reflects a more practical, business-oriented technical screen. They want to know you can write clean, maintainable code for real-world problems, not necessarily that you can derive novel algorithms. The higher easy percentage (24% vs DoorDash's 7%) suggests they might include more straightforward warm-up questions or focus heavily on implementation correctness.

The implication: If you're strong on medium problems but shaky on hards, Expedia's bar might feel more approachable. But don't underestimate their mediums — they're likely testing for production-quality code, not just algorithmic cleverness.

## Topic Overlap: The 70% Foundation

Both companies heavily test **Array, String, and Hash Table** problems. This is your core preparation zone — these topics form the backbone of most practical programming interviews because they test fundamental data manipulation skills.

**DoorDash-specific emphasis: Depth-First Search** appears in their top four topics but not Expedia's. This makes perfect sense given DoorDash's domain: mapping delivery routes, restaurant-to-customer graphs, and dispatch optimization all naturally map to graph traversal problems. If you're interviewing at DoorDash, you must be comfortable with DFS/BFS, cycle detection, and pathfinding.

**Expedia-specific emphasis: Greedy Algorithms** appear in their top topics. Travel optimization — finding the cheapest flights, optimal itineraries, scheduling — often involves greedy approaches. Think "minimum number of planes to catch all flights" or "maximum activities you can schedule."

The shared foundation means studying arrays, strings, and hash tables gives you maximum return on investment for both companies. The specialized topics require targeted study based on which company you're prioritizing.

## Preparation Priority Matrix

Here's how to allocate your study time if interviewing at both:

**Tier 1: Overlap Topics (Study First)**

- **Arrays:** Sliding window, two-pointer, prefix sums
- **Strings:** Palindrome checks, anagrams, string builders
- **Hash Tables:** Frequency counting, complement finding, caching

**Tier 2: DoorDash-Specific**

- **Graphs:** DFS/BFS, topological sort, union-find
- **Trees:** Binary tree traversals, BST operations
- **Dynamic Programming:** Medium-hard DP problems (less emphasis on ultra-hard)

**Tier 3: Expedia-Specific**

- **Greedy:** Interval scheduling, task assignment, optimization
- **Sorting:** Custom comparators, meeting room problems
- **Design:** Likely more practical system design questions

## Interview Format Differences

**DoorDash** typically follows the FAANG-style: 4-5 rounds including 2-3 coding rounds, 1 system design, 1 behavioral. Coding rounds are 45-60 minutes, often with 2 problems (medium + medium/hard). They expect optimal solutions with clean code. System design is crucial for senior roles — think "design a food delivery system" (literally their business).

**Expedia** tends toward: 3-4 rounds with 1-2 coding rounds, 1 system design/architecture, behavioral/cultural fit. Coding rounds might be 45 minutes with 1-2 problems (usually medium). They place more weight on code quality, readability, and maintainability. System design questions might be more generic ("design a hotel booking system") rather than their exact business.

The behavioral difference is key: DoorDash evaluates "bar raiser" culture fit (move fast, scale), while Expedia might emphasize collaboration in a more corporate environment.

## Specific Problem Recommendations for Both Companies

These five problems give you coverage for overlapping patterns and company-specific flavors:

1. **Two Sum (#1)** — The ultimate hash table problem. Master this and its variants (Two Sum II - sorted input, Three Sum). Tests basic hash table usage that appears everywhere.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

```javascript
// Time: O(n) | Space: O(n)
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
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

</div>

2. **Merge Intervals (#56)** — Covers sorting, array manipulation, and greedy thinking. Useful for both: DoorDash (merging delivery time windows), Expedia (merging flight schedules).

3. **Number of Islands (#200)** — Classic DFS problem. Essential for DoorDash's graph emphasis. Tests traversal, visited tracking, and grid manipulation.

4. **Meeting Rooms II (#253)** — Greedy + intervals + min-heap. Perfect for Expedia's scheduling focus, but also tests data structure selection that DoorDash values.

5. **LRU Cache (#146)** — Combines hash table and linked list. Tests system design thinking and data structure implementation — valuable for both companies' practical coding expectations.

## Which to Prepare for First?

**Prepare for DoorDash first if:** You're interviewing for senior roles (they have higher hard question percentage), you enjoy algorithmic challenges, or your interview timelines are similar. DoorDash preparation will cover most of Expedia's needs plus give you graph practice.

**Prepare for Expedia first if:** Your Expedia interview comes first (obviously), you're stronger on implementation quality than algorithm derivation, or you want to build confidence with medium problems before tackling DoorDash's hards.

The strategic approach: Start with the overlap topics (arrays, strings, hash tables), then add DoorDash's graphs, then Expedia's greedy. If time is limited, DoorDash prep gives you more coverage since it includes the hard problems Expedia doesn't emphasize.

Remember: Both companies ultimately want engineers who can translate business problems into clean, efficient code. DoorDash leans slightly more toward algorithmic rigor, Expedia toward practical implementation. Tailor your practice accordingly.

For more company-specific details, check out our [DoorDash interview guide](/company/doordash) and [Expedia interview guide](/company/expedia).
