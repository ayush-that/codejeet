---
title: "eBay vs Expedia: Interview Question Comparison"
description: "Compare coding interview questions at eBay and Expedia — difficulty levels, topic focus, and preparation strategy."
date: "2026-10-30"
category: "tips"
tags: ["ebay", "expedia", "comparison"]
---

# eBay vs Expedia: Interview Question Comparison

If you're interviewing at both eBay and Expedia, you're looking at two companies with surprisingly similar technical interview profiles at first glance, but with subtle differences that matter for preparation. Both are established tech companies with mature engineering cultures, but eBay leans slightly more toward algorithmic rigor while Expedia emphasizes practical problem-solving with a touch of greediness. The good news: there's significant overlap in what they test, meaning you can prepare efficiently for both simultaneously if you prioritize correctly.

## Question Volume and Difficulty

Looking at the numbers: eBay has 60 tagged questions (12 Easy, 38 Medium, 10 Hard) while Expedia has 54 (13 Easy, 35 Medium, 6 Hard).

The first insight: **both companies heavily favor Medium difficulty problems**. eBay's 38 Medium questions represent 63% of their tagged problems, while Expedia's 35 Mediums are 65% of theirs. This tells you that interviewers at both companies expect you to handle non-trivial algorithmic challenges, but they're not trying to stump you with obscure graph theory or advanced dynamic programming.

The key difference is in Hard problems: eBay has nearly twice as many (10 vs 6). This doesn't necessarily mean eBay interviews are harder—it could reflect that eBay's question bank includes more challenging follow-ups or that they're more willing to push candidates who ace the Medium questions. In practice, you should be prepared to handle at least one Medium-to-Hard problem in eBay's later rounds.

## Topic Overlap

Both companies test **Array, String, and Hash Table** problems extensively. This is the core of their technical interviews:

- **Arrays**: Everything from two-pointer techniques to sliding windows to prefix sums
- **Strings**: Manipulation, palindrome checks, anagram problems, and parsing
- **Hash Tables**: The go-to data structure for O(1) lookups and frequency counting

Where they diverge: eBay includes **Sorting** as a top topic, while Expedia lists **Greedy** algorithms. This is telling:

- eBay's sorting focus suggests they care about fundamental algorithmic knowledge and optimization. Sorting problems often test your ability to recognize when ordering matters and how to efficiently rearrange data.
- Expedia's greedy focus aligns with their travel business—many scheduling, resource allocation, and optimization problems in travel lend themselves to greedy approaches.

## Preparation Priority Matrix

Here's how to prioritize your study time for maximum ROI:

**High Priority (Study First - Overlap Topics):**

- Array manipulation (two-pointer, sliding window)
- String operations and pattern matching
- Hash table applications (frequency counting, caching)
- _Recommended problems_: Two Sum (#1), Valid Anagram (#242), Group Anagrams (#49), Contains Duplicate (#217)

**Medium Priority (eBay-Specific):**

- Sorting algorithms and their applications
- Problems where sorting enables optimal solutions
- _Recommended problems_: Merge Intervals (#56), Non-overlapping Intervals (#435), Meeting Rooms II (#253)

**Medium Priority (Expedia-Specific):**

- Greedy algorithm patterns
- Problems about optimization with local choices
- _Recommended problems_: Maximum Subarray (#53), Jump Game (#55), Task Scheduler (#621)

## Interview Format Differences

**eBay** typically follows a more traditional tech interview structure:

- 4-5 rounds including coding, system design, and behavioral
- Coding rounds often include 2 problems in 45-60 minutes
- System design is expected for senior roles (E4/E5 and above)
- Virtual interviews are common, but some positions may require on-site final rounds

**Expedia** tends to be slightly more practical:

- 3-4 rounds with heavier emphasis on real-world problem solving
- Coding problems often have a business context (scheduling, pricing, inventory)
- Behavioral questions may be integrated with technical discussions
- System design questions may focus more on API design and scalability than deep infrastructure

Both companies use LeetCode-style problems, but Expedia's problems more frequently have a thin veneer of travel industry context (flights, hotels, bookings).

## Specific Problem Recommendations

Here are 5 problems that provide excellent preparation value for both companies:

1. **Two Sum (#1)** - The classic hash table problem that tests basic data structure knowledge. If you can't solve this optimally, you're not ready for either company.

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

2. **Merge Intervals (#56)** - Tests sorting and array manipulation, valuable for both companies but especially eBay.

3. **Maximum Subarray (#53)** - A perfect greedy/dynamic programming hybrid that's highly relevant to Expedia's focus and tests important algorithmic thinking for eBay.

4. **Valid Parentheses (#20)** - String manipulation with stack usage—tests fundamental data structure knowledge that both companies expect.

5. **Group Anagrams (#49)** - Excellent hash table and string problem that tests your ability to use data structures creatively.

## Which to Prepare for First

Prepare for **eBay first**, then adapt for Expedia. Here's why:

1. eBay's broader difficulty range (more Hards) means if you're ready for eBay, you're over-prepared for Expedia's coding rounds
2. Sorting algorithms (eBay focus) are fundamental—mastering them improves your problem-solving generally
3. Greedy algorithms (Expedia focus) are often easier to pick up once you have strong algorithmic fundamentals

Spend 70% of your time on the overlapping topics (Arrays, Strings, Hash Tables), 20% on eBay-specific sorting problems, and 10% on Expedia's greedy problems. This gives you the best coverage for both interviews.

Remember: both companies value clean, maintainable code and clear communication. Practice explaining your thought process as you solve problems, and be prepared to discuss trade-offs between different approaches.

For more company-specific insights, check out our [eBay interview guide](/company/ebay) and [Expedia interview guide](/company/expedia).
