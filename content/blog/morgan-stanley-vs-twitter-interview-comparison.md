---
title: "Morgan Stanley vs Twitter: Interview Question Comparison"
description: "Compare coding interview questions at Morgan Stanley and Twitter — difficulty levels, topic focus, and preparation strategy."
date: "2027-01-14"
category: "tips"
tags: ["morgan-stanley", "twitter", "comparison"]
---

# Morgan Stanley vs Twitter: Interview Question Comparison

If you're interviewing at both Morgan Stanley and Twitter, you're looking at two distinct cultures with surprisingly similar technical demands. The key insight from their LeetCode question distributions is that both companies heavily test fundamental data structures, but with different philosophical approaches. Morgan Stanley leans toward traditional algorithmic rigor with a finance-adjacent focus on correctness, while Twitter emphasizes practical implementation and system thinking. Preparing for both simultaneously is actually quite efficient — about 70% of your study effort will overlap, with the remaining 30% requiring company-specific tuning.

## Question Volume and Difficulty

Both companies have exactly 53 tagged questions on LeetCode, but the difficulty distributions tell different stories:

**Morgan Stanley (E13/M34/H6):** This is a classic "middle-heavy" distribution. With 64% medium questions, they're testing whether you can reliably solve standard algorithmic problems under pressure. The relatively low hard count (11%) suggests they're less interested in trick questions and more in solid fundamentals. The 13 easy questions (25%) typically appear in phone screens or as warm-ups.

**Twitter (E8/M33/H12):** Noticeably harder distribution. Only 15% easy questions, with 62% medium and 23% hard. Twitter expects you to handle complexity — either harder individual problems or multi-part questions within a single interview. That 23% hard rate is nearly double Morgan Stanley's, indicating Twitter interviews often include at least one genuinely challenging problem.

The implication: Twitter interviews feel more intense. You need to be comfortable with ambiguity and optimization. Morgan Stanley interviews feel more predictable but demand flawless execution.

## Topic Overlap

Both companies share their top three topics in identical order: **Array, Hash Table, String**. This trio represents 60-70% of questions at both firms. The overlap is your strategic advantage.

**Shared heavy hitters:**

- **Array manipulation:** Sliding window, two-pointer, prefix sums
- **Hash Table applications:** Frequency counting, lookups, memoization
- **String operations:** Palindrome checks, subsequence problems, parsing

**Morgan Stanley unique emphasis:** **Dynamic Programming** appears in their top four topics but not Twitter's. This aligns with finance's mathematical orientation — DP appears in optimization problems relevant to trading and risk.

**Twitter unique emphasis:** **Design** makes their top four. Twitter evaluates how you build systems, not just solve isolated algorithms. Expect questions about designing data structures or scalable components.

Other notable differences: Morgan Stanley has more **Tree** and **Graph** questions, while Twitter has more **Sorting** and **Greedy** problems.

## Preparation Priority Matrix

Here's how to allocate your study time efficiently:

**Tier 1: Overlap Topics (Study First - 70% effort)**

- Arrays & Strings with Hash Tables
- Two-pointer techniques
- Subarray/substring problems
- Basic data structure implementations

**Tier 2: Morgan Stanley Specific (20% effort)**

- Dynamic Programming (especially 1D and 2D)
- Matrix traversal problems
- Graph BFS/DFS

**Tier 3: Twitter Specific (10% effort)**

- Design problems (LRU cache, data stream processors)
- Optimization-heavy problems
- Real-world system adaptations

**Specific crossover problems that appear at both companies:**

- Two Sum (#1) - The ultimate hash table warm-up
- Merge Intervals (#56) - Tests sorting and array manipulation
- Longest Substring Without Repeating Characters (#3) - Classic sliding window
- Valid Parentheses (#20) - Stack fundamentals

## Interview Format Differences

**Morgan Stanley:**

- Typically 3-4 technical rounds plus behavioral
- Problems are often self-contained with clear specifications
- Expect follow-ups about edge cases and optimization
- System design appears only for senior roles (E5+)
- Interviews may include finance-specific scenarios (e.g., processing time-series data)

**Twitter:**

- Usually 4-5 technical rounds including system design
- Problems often have open-ended requirements
- Interviewers probe your thought process extensively
- System design appears earlier (E4+ at Twitter vs E5+ at MS)
- Coding questions may relate to Twitter's domain (feeds, social graphs, rate limiting)

Time pressure differs too: Morgan Stanley often gives 45 minutes for 1-2 problems, while Twitter might give 60 minutes for a single complex problem with multiple parts.

## Specific Problem Recommendations

These five problems provide maximum coverage for both companies:

1. **Product of Array Except Self (#238)** - Covers array manipulation, prefix thinking, and optimization. Tests whether you can improve from O(n²) to O(n) with O(1) extra space.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array
def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n

    # Left pass
    left_product = 1
    for i in range(n):
        result[i] = left_product
        left_product *= nums[i]

    # Right pass
    right_product = 1
    for i in range(n-1, -1, -1):
        result[i] *= right_product
        right_product *= nums[i]

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }

  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];

    int leftProduct = 1;
    for (int i = 0; i < n; i++) {
        result[i] = leftProduct;
        leftProduct *= nums[i];
    }

    int rightProduct = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= nums[i];
    }

    return result;
}
```

</div>

2. **LRU Cache (#146)** - Covers design, hash tables, and linked lists. Essential for Twitter, increasingly common at Morgan Stanley for system-adjacent roles.

3. **Coin Change (#322)** - The quintessential DP problem. Perfect for Morgan Stanley's mathematical bent, but also tests optimization thinking valuable at Twitter.

4. **Find All Anagrams in a String (#438)** - Excellent sliding window problem with hash table frequency counting. Tests both string manipulation and optimization.

5. **Design Twitter (#355)** - Meta: studying this helps you understand Twitter's domain while practicing design patterns useful for both companies.

## Which to Prepare for First

Start with **Twitter preparation**, then adapt for Morgan Stanley. Here's why:

1. Twitter's harder distribution means if you can handle their problems, Morgan Stanley's will feel more manageable (not easy, but familiar).

2. Twitter's emphasis on design and optimization forces you to think more deeply about trade-offs, which makes you better at explaining your solutions — a skill that benefits you at both companies.

3. The array/string/hash table fundamentals needed for Twitter directly transfer to Morgan Stanley's most common questions.

Adjust your Twitter prep for Morgan Stanley by:

- Adding more Dynamic Programming practice (study the "DP for Interviews" list)
- Practicing cleaner, more commented code (finance values readability)
- Preparing finance-adjacent examples for behavioral questions

The reverse approach (MS first, then Twitter) risks being underprepared for Twitter's harder problems and design focus.

Remember: Both companies ultimately want engineers who can translate complex requirements into efficient, maintainable code. The difference is in where they place the complexity — in the algorithm itself (Morgan Stanley) or in the system context (Twitter).

For company-specific question lists and interview experiences:

- [/company/morgan-stanley](/company/morgan-stanley)
- [/company/twitter](/company/twitter)
