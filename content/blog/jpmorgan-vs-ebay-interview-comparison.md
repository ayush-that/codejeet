---
title: "JPMorgan vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at JPMorgan and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2026-02-28"
category: "tips"
tags: ["jpmorgan", "ebay", "comparison"]
---

If you're preparing for interviews at both JPMorgan and eBay, you're in a fortunate position: these two companies share a remarkably similar technical focus, which means your preparation has excellent overlap. However, the subtle differences in their question distributions, difficulty, and interview formats can significantly impact your strategy. As someone who's coached candidates through both processes, I can tell you that a one-size-fits-all approach will leave you underprepared for the specific nuances of each. Let's break down what the data tells us and how you should tailor your prep.

## Question Volume and Difficulty

The raw numbers reveal the first strategic insight. JPMorgan's list shows **78 questions**, while eBay's shows **60**. This doesn't necessarily mean JPMorgan asks more questions in an interview; rather, it suggests their known question bank from past interviews is larger, possibly indicating a broader set of problems you might encounter.

More telling is the difficulty distribution:

- **JPMorgan (E25/M45/H8):** 32% Easy, 58% Medium, 10% Hard.
- **eBay (E12/M38/H10):** 20% Easy, 63% Medium, 17% Hard.

**What this implies:** JPMorgan's interview leans slightly more accessible, with a higher proportion of Easy questions serving as warm-ups or screening tools. eBay's distribution is more concentrated in Medium and Hard territory. The takeaway? For eBay, you must be rock-solid on Medium problems and comfortable tackling a non-trivial Hard. For JPMorgan, while Mediums are still the core, you should also be flawless on Easies—they're more likely to be used as a filter, and stumbling on one could be a red flag.

## Topic Overlap

This is where your prep gets efficient. Both companies heavily test the same four fundamental topics:

1.  **Array**
2.  **String**
3.  **Hash Table**
4.  **Sorting**

This overlap is not a coincidence. These topics form the bedrock of data manipulation and are excellent proxies for assessing a candidate's basic coding fluency, problem decomposition skills, and knowledge of data structures. A problem like **Two Sum (#1)** combines Array, Hash Table, and often a form of logical "sorting" in its two-pointer variant. Mastering these core topics gives you immense shared value.

You'll notice advanced topics like Dynamic Programming, Graphs, or Trees are not listed as primary focuses for either. While they may appear, especially in Hard problems, the core of your interview will almost certainly be built upon manipulating arrays and strings using hash maps and sorting paradigms.

## Preparation Priority Matrix

Use this matrix to allocate your study time strategically. The goal is maximum return on investment (ROI).

| Priority                    | Topics                                                                   | Rationale                                                                         | Sample Focus                                                                  |
| :-------------------------- | :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Tier 1 (Highest ROI)**    | **Array, String, Hash Table, Sorting**                                   | Heavily tested by **both** companies. Mastery here is non-negotiable.             | Sliding Window, Two-Pointers, Frequency Counting, Custom Sorting.             |
| **Tier 2 (JPMorgan Focus)** | **Slightly more emphasis on straightforward array/string manipulation.** | Their higher Easy count means you need speed and accuracy on fundamentals.        | Problems like **Merge Sorted Array (#88)** or **Valid Palindrome (#125)**.    |
| **Tier 2 (eBay Focus)**     | **Depth within core topics, especially for Medium/Hard.**                | Need to handle complex combinations (e.g., hash map + sorting + array traversal). | Problems like **Group Anagrams (#49)** or **Top K Frequent Elements (#347)**. |

## Interview Format Differences

The _how_ is as important as the _what_.

**JPMorgan** (for Software Engineer roles):

- **Process:** Typically starts with an online assessment (OA), followed by 1-2 technical phone/video screens, and a final round (often virtual). The final round may include 2-3 back-to-back 45-60 minute sessions.
- **Problems per Round:** Often 1-2 problems. The first might be an Easy/Medium, the second a Medium.
- **Behavioral/System Design:** Behavioral questions are integrated into most rounds. For early-career roles (0-3 years), system design is usually light or absent. For senior roles, expect a basic system design conversation focused on scalability of a feature, not deep distributed systems.
- **Key Trait:** They value clean, correct, and maintainable code. Explain your thought process clearly.

**eBay**:

- **Process:** Also often begins with an OA. Technical phone screens are common, leading to a virtual or on-site final round consisting of 3-4 separate interviews.
- **Problems per Round:** Often 1 problem per 45-60 minute session, but it will be deeper. You're expected to code a robust solution, discuss edge cases, and optimize.
- **Behavioral/System Design:** Behavioral rounds are usually separate ("Values Interview"). For mid-level and senior roles, a dedicated system design round is **very likely**, even if the listed topics don't show it. Expect to discuss designing a scalable service relevant to e-commerce (catalog, cart, bidding system).
- **Key Trait:** They lean towards practical problem-solving. Your solution should be efficient and handle real-world data quirks.

## Specific Problem Recommendations

Here are 5 problems that provide exceptional prep value for **both** companies. They all center on the core overlapping topics.

1.  **Two Sum (#1):** The quintessential hash table problem. Be prepared to derive the O(n) solution from the brute force. Know the two-pointer solution for a sorted array variant.

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

# Two-pointer variant for sorted input (Different Problem #167)
# Time: O(n) | Space: O(1)
def twoSumSorted(numbers, target):
    l, r = 0, len(numbers) - 1
    while l < r:
        total = numbers[l] + numbers[r]
        if total == target:
            return [l + 1, r + 1]  # 1-indexed
        elif total < target:
            l += 1
        else:
            r -= 1
    return []
```

```javascript
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Two-pointer variant for sorted input
// Time: O(n) | Space: O(1)
function twoSumSorted(numbers, target) {
  let left = 0,
    right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}

// Two-pointer variant for sorted input
// Time: O(n) | Space: O(1)
public int[] twoSumSorted(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}
```

</div>

2.  **Group Anagrams (#49):** Perfectly combines **String, Hash Table, and Sorting**. The core trick is using a sorted string as a key. Discuss alternative keys (e.g., character count arrays) for optimization.
3.  **Merge Intervals (#56):** A classic **Array and Sorting** problem with high practical value (scheduling, time merging). Tests your ability to sort with a custom comparator and manage overlapping ranges.
4.  **Top K Frequent Elements (#347):** Combines **Hash Table, Sorting (via heap), and Array**. You must know both the O(n log k) heap solution and the O(n) bucket sort approach. This is eBay-hard in terms of concept density.
5.  **Longest Substring Without Repeating Characters (#3):** The definitive **String and Sliding Window** problem. It tests your ability to manage a dynamic window with a hash map, a pattern that appears constantly.

## Which to Prepare for First?

**Prepare for eBay first.** Here’s the strategic reasoning: eBay’s concentration on Medium/Hard problems within the core topics will force you to a higher level of proficiency. If you can comfortably solve eBay-style problems—where you need to combine concepts fluidly and optimize—then JPMorgan’s problems, with their slightly higher Easy count, will feel more manageable. The reverse is not true. Preparing only for JPMorgan's mix might leave you under-gunned for eBay's deeper dives.

**Final Strategy:** Build a deep mastery of Array, String, Hash Table, and Sorting patterns. Use eBay's problem list to push your comfort zone with Medium/Hard combinations. Then, use JPMorgan's list to polish your speed, accuracy, and communication on a wider set of problems, ensuring you can handle the "easier" questions with flawless execution.

For more detailed company-specific question lists and guides, check out our pages for [JPMorgan](/company/jpmorgan) and [eBay](/company/ebay).
