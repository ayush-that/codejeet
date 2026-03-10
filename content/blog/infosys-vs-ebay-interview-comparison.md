---
title: "Infosys vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Infosys and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2032-04-17"
category: "tips"
tags: ["infosys", "ebay", "comparison"]
---

# Infosys vs eBay: Interview Question Comparison

If you're interviewing at both Infosys and eBay, you're looking at two fundamentally different interview experiences. Infosys, as a global IT services and consulting giant, focuses on foundational problem-solving and algorithmic thinking across a broad spectrum of difficulty. eBay, as a specialized e-commerce tech company, targets more practical, data-structure intensive problems with a sharper focus on medium difficulty. The key insight? Preparing for eBay will give you excellent coverage for Infosys's medium questions, but you'll need additional depth for Infosys's harder problems and broader topic list. Let's break down exactly how to allocate your study time.

## Question Volume and Difficulty

The numbers tell a clear story. Infosys has a massive, publicly tagged question bank of **158 problems** on platforms like LeetCode, distributed as **42 Easy, 82 Medium, and 34 Hard**. This indicates a process that can test a wide range of candidates, from new graduates to experienced hires, with a significant emphasis on medium-difficulty problem-solving stamina. You should expect at least one, possibly two, coding rounds with problems spanning this difficulty spectrum.

eBay's tagged list is smaller at **60 problems**, with a distribution of **12 Easy, 38 Medium, and 10 Hard**. This points to a more curated, focused interview process. The heavy skew toward Medium (63% of their questions) is the critical takeaway. eBay interviews are designed to find candidates who can reliably solve non-trivial, practical algorithmic challenges under pressure. The lower volume doesn't mean it's easier—it means their question pool is more targeted and consistent.

**Implication:** For Infosys, you must be prepared for a wider net, including a non-trivial chance of a tricky Hard problem. For eBay, you should drill Medium problems until you can solve them cleanly and communicate your approach flawlessly. Mastery of Mediums is your ticket.

## Topic Overlap

Both companies heavily test **Array** and **String** manipulation. These are the bread and butter of coding interviews, and proficiency here is non-negotiable for either company.

- **Shared High-Value Topics:** Array, String.
- **Infosys-Specific Emphasis:** Dynamic Programming (DP) and Math. The presence of 34 Hard problems often correlates with DP (e.g., knapsack variants, complex state transitions) and tricky mathematical reasoning (combinatorics, number theory).
- **eBay-Specific Emphasis:** Hash Table and Sorting. This aligns with e-commerce fundamentals: efficiently matching items (Hash Table), organizing listings or search results (Sorting), and managing data lookups. Think of problems involving user sessions, product catalogs, or transaction data.

The overlap is your efficiency gain. Getting rock-solid on array and string problems serves both companies simultaneously.

## Preparation Priority Matrix

Use this matrix to prioritize your study. The goal is maximum return on investment (ROI) for a dual-track interview prep.

| Priority                 | Topics                             | Reason                                                                        | Company Focus         |
| :----------------------- | :--------------------------------- | :---------------------------------------------------------------------------- | :-------------------- |
| **Tier 1 (Study First)** | Array, String, Hash Table, Sorting | Covers 100% of eBay's top topics and the core of Infosys's list. Highest ROI. | **Both**              |
| **Tier 2 (Study Next)**  | Dynamic Programming, Math          | Essential to tackle Infosys's Hard problem segment. Less critical for eBay.   | **Primarily Infosys** |
| **Tier 3 (Review)**      | Tree, Graph, Greedy                | Appear in both lists but less frequently. Cover once Tiers 1 & 2 are solid.   | **Both (Secondary)**  |

**Specific Crossover Problems:** These LeetCode problems are excellent because they test Tier 1 topics common to both companies:

- **Two Sum (#1):** Array + Hash Table fundamental.
- **Merge Intervals (#56):** Array + Sorting classic.
- **Longest Substring Without Repeating Characters (#3):** String + Hash Table (Sliding Window).

## Interview Format Differences

This is where the experiences truly diverge.

**Infosys** interviews often follow a more traditional, academic structure. You might encounter:

- **Rounds:** 2-3 technical rounds, possibly including a written test.
- **Problem Focus:** One problem per round, but it may be complex (especially in later rounds). They may ask for a brute-force solution first, then optimization.
- **Behavioral/System Design:** For senior roles, expect some system design discussion, but the weight is strongly on algorithmic problem-solving. Behavioral questions are standard but not the primary filter.

**eBay** interviews tend to mirror other product-based tech companies:

- **Rounds:** 4-5 rounds in a "virtual on-site," typically including 2-3 coding rounds, 1 system design, and 1 behavioral/experience deep-dive.
- **Problem Focus:** One, maybe two, Medium+ problems per coding round with a strong emphasis on clean code, testing, and trade-off discussion. You're expected to go from problem to optimal solution efficiently.
- **Behavioral/System Design:** Significant weight. The system design round is crucial for mid-level and above roles (think "design a nearby listings feature"). Behavioral questions using the STAR method are taken seriously to assess collaboration.

## Specific Problem Recommendations for Dual Prep

Here are 5 problems that provide outsized value for preparing for both companies. They cover the key overlapping topics and thinking patterns.

1.  **Group Anagrams (#49):** A perfect hash table + sorting problem. It's eBay-relevant for data categorization and Infosys-relevant as a classic medium string problem.
2.  **Product of Array Except Self (#238):** A quintessential array problem that requires clever forward/backward passes. It tests fundamental logic without advanced data structures, loved by both types of interviewers.
3.  **Longest Palindromic Substring (#5):** A string problem that can be approached with expanding windows (more common) or DP. It bridges core string skills (for eBay) and introduces DP thinking (for Infosys).
4.  **Merge Sorted Array (#88):** A fundamental array/pointer manipulation question. It's simple enough to be an Infosys easy/medium warm-up but tests precise in-place operations critical for real-world coding.
5.  **Container With Most Water (#11):** An excellent array + two-pointer problem. It's a medium-difficulty challenge that tests optimization intuition and is highly representative of problem styles at both companies.

<div class="code-group">

```python
# Example: Problem #11 - Container With Most Water
# Time: O(n) | Space: O(1)
def maxArea(height):
    """
    Uses two pointers to find the maximum area.
    The intuition: move the pointer pointing at the shorter line,
    as that's the limiting factor for area.
    """
    left, right = 0, len(height) - 1
    max_area = 0

    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        max_area = max(max_area, current_area)

        # Move the pointer with the smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_area
```

```javascript
// Example: Problem #11 - Container With Most Water
// Time: O(n) | Space: O(1)
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    const currentArea = width * currentHeight;
    maxArea = Math.max(maxArea, currentArea);

    // Move the pointer pointing to the shorter line
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
}
```

```java
// Example: Problem #11 - Container With Most Water
// Time: O(n) | Space: O(1)
public int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int maxArea = 0;

    while (left < right) {
        int width = right - left;
        int currentHeight = Math.min(height[left], height[right]);
        int currentArea = width * currentHeight;
        maxArea = Math.max(maxArea, currentArea);

        // Move the pointer pointing to the shorter line
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}
```

</div>

## Which to Prepare for First?

**Prepare for eBay first.**

Here’s the strategic reasoning: Mastering the **Medium-difficulty Array, String, Hash Table, and Sorting** problems that eBay focuses on will automatically make you highly competitive for the majority (the Medium 82) of Infosys's questions. This approach gives you the strongest dual-company foundation with the least context switching.

Once you are confident with eBay's core topics, _then_ layer on the additional preparation needed for Infosys: specifically, dive into **Dynamic Programming** and **Math** problems, and practice a few **Hard** problems to build stamina and exposure to complex edge cases. This sequential approach is more efficient than trying to tackle Infosys's vast list from the start.

In short, use eBay prep to build your core engineering interview muscle. Use Infosys prep to add breadth and depth. Good luck.

---

_Explore detailed question lists and interview experiences: [Infosys Interview Questions](/company/infosys) | [eBay Interview Questions](/company/ebay)_
