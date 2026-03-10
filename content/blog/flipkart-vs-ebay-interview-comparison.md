---
title: "Flipkart vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Flipkart and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2033-05-28"
category: "tips"
tags: ["flipkart", "ebay", "comparison"]
---

If you're preparing for interviews at both Flipkart and eBay, you're looking at two distinct beasts in the e-commerce jungle. Flipkart, India's homegrown giant, runs a marathon of algorithmic rigor, while eBay, the global auction pioneer, tends toward a more focused, practical sprint. The data tells a clear story: Flipkart's 117 tagged questions on platforms like LeetCode, with a significant hard problem count, signals a process designed to stress-test fundamental computer science knowledge under pressure. eBay's 60 questions, with far fewer hards, suggests interviews that prioritize clean, efficient solutions to common engineering problems. Preparing for both simultaneously is absolutely feasible, but requires a smart, layered strategy that maximizes overlap while efficiently targeting their unique demands.

## Question Volume and Difficulty

The raw numbers—117 questions for Flipkart versus 60 for eBay—are your first clue about interview intensity. More tagged questions generally correlate with a larger, more established interview question bank and a process that delves deeper into algorithmic variety.

Flipkart's distribution (E13/M73/H31) is the more revealing metric. The heavy skew toward medium problems (73) indicates that passing the bar requires consistent, reliable performance on problems that are non-trivial but well within the standard DSA curriculum. The substantial number of hard problems (31), nearly triple eBay's count, is a warning: you must be prepared to tackle at least one complex, multi-step algorithmic challenge. This could involve advanced dynamic programming, tricky graph manipulations, or optimized greedy algorithms. Failing a hard problem isn't always an automatic reject, but not making substantial progress likely is.

eBay's distribution (E12/M38/H10) paints a picture of a more streamlined process. The focus is overwhelmingly on medium-difficulty problems. The low hard count suggests that while they might throw a curveball, the interview is primarily gauging your competency in solving the bread-and-butter problems of software engineering. The expectation here is flawlessness on mediums and a strong, logical approach to any harder problem presented. The lower volume also means there's less lore and fewer "famous" eBay questions; the interview is more likely to pull from a common pool of standard problems.

**Implication:** For Flipkart, build stamina. Practice doing 2-3 medium problems back-to-back, then cap it with a hard. For eBay, polish your fundamentals until they shine. A single bug or suboptimal solution on a medium problem could be costlier.

## Topic Overlap

The core of your preparation for both companies is identical, which is great news. Both lists are dominated by:

- **Array:** The fundamental data structure. Expect everything from two-pointer techniques and sliding windows to sorting and searching transformations.
- **Hash Table:** The go-to tool for O(1) lookups. Essential for frequency counting, memoization, and complement finding (like in Two Sum).
- **Sorting:** Rarely tested in isolation, but a critical preprocessing step for countless other patterns (e.g., meeting schedules, merging intervals, binary search).

This trio forms the absolute bedrock. If you are not instantly comfortable identifying when and how to use a hash map or sort an array to simplify a problem, start here.

**Flipkart's Unique Emphasis:** The standout is **Dynamic Programming**. Its prominent place on Flipkart's list, compared to its absence from eBay's top topics, is a major differentiator. Flipkart interviewers have a demonstrated appetite for DP problems, from classic ones like knapsack variations to string-based DP like edit distance or palindromic subsequences.

**eBay's Unique Emphasis:** **String** manipulation problems are notably more prominent for eBay. This aligns with e-commerce domains involving search queries, product titles, data parsing, and validation. Think problems involving anagrams, palindromes, subsequences, and string transformations.

## Preparation Priority Matrix

Use this to allocate your study time efficiently.

1.  **Maximum ROI (Study First):** Array, Hash Table, Sorting. Master the patterns within these.
    - **Patterns to Know:** Two-pointers (for sorted arrays, palindromes), Sliding Window (fixed & variable), Prefix Sum, Frequency counting with hash maps, Sorting + Greedy approach, Sorting + Two-pointers.
    - **Example Problem (Covers Multiple):** **3Sum (#15)**. Requires sorting + two-pointers + avoiding duplicates. It's a classic that tests fundamental array manipulation.

2.  **Flipkart-Specific Priority:** **Dynamic Programming.** Dedicate a solid block of time here.
    - **Start with:** Fibonacci-style, Climbing Stairs (#70), then move to 2D DP like Unique Paths (#62).
    - **Crucial for Flipkart:** Knapsack variations (Partition Equal Subset Sum #416), and string DP (Longest Common Subsequence #1143, Edit Distance #72).

3.  **eBay-Specific Priority:** **String Manipulation.** Deep dive into string algorithms.
    - **Focus on:** Anagram grouping (Group Anagrams #49), palindrome checks (valid, longest palindromic substring #5), and substring search (sliding window problems like Longest Substring Without Repeating Characters #3).

## Interview Format Differences

- **Flipkart:** The process is typically a gauntlet. Expect multiple rigorous coding rounds (often 3-4), sometimes including an "machine coding" round where you build a working, modular system (like a parking lot or elevator) in 2-3 hours, focusing on OOP principles and design. The coding problems themselves are given significant time (45-60 minutes) with high expectation for optimal solutions. System design is a major component for mid-level and senior roles, often focusing on high-scale, low-latency systems relevant to e-commerce (catalog service, cart service).
- **eBay:** The process is often more condensed. Coding rounds may be 1-2 deep, with problems expected to be solved in 30-45 minutes. The emphasis is on clean, runnable code and communication. Behavioral questions ("Tell me about a time...") often carry more explicit weight and are integrated into the process. System design for eBay may also involve scale, but can sometimes lean into domain-specific problems like designing an auction bidding system or a product search index.

## Specific Problem Recommendations for Dual Prep

Here are 5 problems that provide exceptional cross-company value, blending the core topics and touching on each company's specialties.

1.  **Longest Substring Without Repeating Characters (#3)**
    - **Why:** A perfect hash table (for character indexing) + sliding window problem. It's a medium-difficulty staple that tests your ability to manage a dynamic window, a skill applicable to countless array and string problems at both companies.

<div class="code-group">

```python
# Time: O(n) | Space: O(min(m, n)) where m is charset size
def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}  # Hash map: char -> its most recent index
    left = 0
    max_len = 0

    for right, ch in enumerate(s):
        # If char is in map and its index is >= left, shrink window
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1
        # Update char's latest index
        char_index[ch] = right
        # Update max length
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Time: O(n) | Space: O(min(m, n))
function lengthOfLongestSubstring(s) {
  const charIndex = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (charIndex.has(ch) && charIndex.get(ch) >= left) {
      left = charIndex.get(ch) + 1;
    }
    charIndex.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```java
// Time: O(n) | Space: O(min(m, n))
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char ch = s.charAt(right);
        if (charIndex.containsKey(ch) && charIndex.get(ch) >= left) {
            left = charIndex.get(ch) + 1;
        }
        charIndex.put(ch, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

</div>

2.  **Merge Intervals (#56)**
    - **Why:** A quintessential sorting + array traversal problem. It teaches how to sort a custom object (by start time) and then make a single pass to merge, a pattern useful for scheduling problems common in any domain.

3.  **Two Sum (#1)**
    - **Why:** The canonical hash table problem. It's so fundamental that not knowing it cold is a red flag. Its variations (sorted input, data stream, three-sum) form the basis for many follow-ups.

4.  **Coin Change (#322)**
    - **Why:** This is your bridge into Flipkart's DP territory while remaining highly practical (making change). Understanding the difference between the DP approaches for the minimum coins (this problem) and the number of combinations (Coin Change 2, #518) is invaluable.

5.  **Group Anagrams (#49)**
    - **Why:** Hits eBay's string focus and the universal hash table topic. The core technique—using a sorted string or character count array as a hash map key—is a powerful pattern for grouping by any transformed signature.

## Which to Prepare for First?

**Prepare for Flipkart first.** Here’s the strategic reasoning: The Flipkart preparation envelope is larger. If you build a study plan that conquers Array, Hash Table, Sorting, **and** Dynamic Programming, you will have covered 100% of eBay's core technical needs plus the extra DP layer. Preparing in the reverse order (eBay first) might leave you underprepared for Flipkart's depth, especially on DP. Think of it as training for a marathon first; running a 5k afterwards feels manageable. Use the heavier Flipkart prep to build your endurance and depth, then polish your string manipulation and behavioral stories specifically for eBay.

For deeper dives into each company's process, check out our dedicated pages: [Flipkart Interview Guide](/company/flipkart) and [eBay Interview Guide](/company/ebay).
