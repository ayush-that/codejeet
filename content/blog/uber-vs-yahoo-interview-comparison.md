---
title: "Uber vs Yahoo: Interview Question Comparison"
description: "Compare coding interview questions at Uber and Yahoo — difficulty levels, topic focus, and preparation strategy."
date: "2030-03-25"
category: "tips"
tags: ["uber", "yahoo", "comparison"]
---

# Uber vs Yahoo: Interview Question Comparison

If you're interviewing at both Uber and Yahoo, you're looking at two distinct interview cultures shaped by different engineering priorities. Uber's interviews are famously intense, algorithm-heavy, and resemble the FAANG playbook. Yahoo's process is more moderate, with a stronger emphasis on practical coding and foundational data structures. Preparing for both simultaneously is actually quite strategic—if you prep for Uber's rigor, you'll likely over-prepare for Yahoo's technical screen. But there are nuances in topic focus and format that demand a tailored approach. Let's break down exactly what to expect and how to allocate your study time.

## Question Volume and Difficulty

The numbers tell a clear story about intensity. On LeetCode's company-tagged questions, Uber has **381 problems** (54 Easy, 224 Medium, 103 Hard). Yahoo has **64 problems** (26 Easy, 32 Medium, 6 Hard).

**Uber's profile** screams depth and breadth. With over 200 Medium/Hard problems, they test a wide range of algorithmic concepts, often with twists. The high Hard count (103) indicates they're not afraid to throw complex DP, graph, or optimization problems at candidates, especially for senior roles. You need to be comfortable under pressure, optimizing on the fly.

**Yahoo's profile** is more foundational. The majority of questions are Easy/Medium, focusing on core competency. The tiny Hard count (6) suggests they rarely go into esoteric algorithm territory. This doesn't mean it's easy—it means they care more about clean, correct, and maintainable code for standard problems. A buggy, over-optimized solution might hurt you more here than at Uber.

The implication: Use Uber prep to build your algorithmic muscle. Use Yahoo prep to polish your communication and code quality.

## Topic Overlap

Both companies heavily test **Array, Hash Table, and String** manipulation. This is your common core. If you master these, you're covering a huge percentage of questions from both.

**Uber's unique emphasis:** Dynamic Programming appears in their top four. They love DP for optimization problems (think ride matching, pricing, routing). You'll also see heavier doses of **Graphs** (BFS/DFS for map-like structures), **Trees**, and **Design** questions, even for mid-level roles.

**Yahoo's unique emphasis:** Sorting is in their top four. They care about efficient data organization and retrieval—classic problems involving merging, searching, and comparing datasets. You'll also see more straightforward **Linked List** and **Matrix** problems.

The shared foundation means studying for one has direct carryover to the other. Uber's extra topics require dedicated study blocks.

## Preparation Priority Matrix

Maximize your return on study time with this priority list:

1.  **Overlap Topics (Study First - Highest ROI):**
    - **Array & Hash Table:** Two Sum (#1), Group Anagrams (#49), Subarray Sum Equals K (#560).
    - **String:** Longest Substring Without Repeating Characters (#3), Valid Parentheses (#20), String to Integer (atoi) (#8).

2.  **Uber-Specific Topics (Study Second):**
    - **Dynamic Programming:** Coin Change (#322), Longest Increasing Subsequence (#300), Word Break (#139).
    - **Graphs:** Number of Islands (#200), Course Schedule (#207), Clone Graph (#133).

3.  **Yahoo-Specific Topics (Study Last / Polish):**
    - **Sorting:** Merge Intervals (#56), Meeting Rooms II (#253), K Closest Points to Origin (#973).
    - **Linked List:** Merge Two Sorted Lists (#21), Reverse Linked List (#206).

## Interview Format Differences

**Uber** typically has 4-5 rounds in a virtual onsite: 2-3 coding, 1 system design (for roles E4+), and 1 behavioral (the "Uber Values" interview). Coding rounds are 45-60 minutes, often with one medium-hard problem or two medium problems. Interviewers expect optimal solutions, clear complexity analysis, and discussion of trade-offs. They are known for follow-ups that increase constraints (e.g., "now what if the data streamed in?").

**Yahoo** often has a simpler structure: a technical phone screen (1-2 coding problems), followed by a virtual onsite with 3-4 rounds. The onsite usually mixes coding (often practical, like parsing logs or manipulating data), behavioral, and sometimes a lightweight system design or past project discussion. The pace is less frantic; they often leave time for multiple solutions and deeper discussion about code structure.

The key distinction: Uber interviews are a **sprint** to an optimal solution. Yahoo interviews are a **conversation** about sound engineering.

## Specific Problem Recommendations

Here are 5 problems that provide exceptional value for both companies, covering overlap topics with common patterns.

**1. Two Sum (#1)**

- **Why:** The quintessential Hash Table problem. Master this and its variants (Two Sum II - Sorted, Two Sum IV - BST).
- **Pattern:** Complement lookup using a hash map.

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

# Example: nums = [2,7,11,15], target=9 -> [0,1]
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
```

</div>

**2. Group Anagrams (#49)**

- **Why:** Tests string manipulation, hashing, and clever use of data structures. Common at both companies.
- **Pattern:** Using a sorted string or character count as a canonical key.

**3. Merge Intervals (#56)**

- **Why:** A classic sorting problem (great for Yahoo) that also appears in Uber contexts (merging time ranges, scheduling).
- **Pattern:** Sort by start time, then iterate and merge.

**4. Longest Substring Without Repeating Characters (#3)**

- **Why:** A perfect medium-difficulty problem combining string, hash table, and the sliding window pattern.
- **Pattern:** Maintain a set/map for the current window, adjust left pointer on duplicate.

**5. Word Break (#139)**

- **Why:** A foundational Dynamic Programming problem (Uber focus) that's also a great string problem (overlap).
- **Pattern:** `dp[i]` means substring up to `i` can be segmented. `dp[i]` is true if `dp[j]` is true and `s[j:i]` is in the dictionary.

## Which to Prepare for First

**Prepare for Uber first.** Their interview is broader and deeper. If you can handle Uber's DP and graph questions, Yahoo's array and sorting problems will feel like a subset. Allocate 70% of your technical prep time to Uber's question bank and patterns, especially DP and graphs. Use the remaining 30% to run through Yahoo's tagged questions, focusing on writing impeccably clean code and explaining your reasoning clearly—skills that will serve you well in both interviews.

The strategic sequence: Build algorithmic depth for Uber, then transition to refining clarity and completeness for Yahoo. This approach ensures you're not caught off-guard by a Hard problem from Uber while being perfectly polished for Yahoo's emphasis on fundamentals.

For more detailed breakdowns of each company's process, visit the CodeJeet guides for [Uber](/company/uber) and [Yahoo](/company/yahoo).
