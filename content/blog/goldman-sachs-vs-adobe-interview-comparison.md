---
title: "Goldman Sachs vs Adobe: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Adobe — difficulty levels, topic focus, and preparation strategy."
date: "2030-10-01"
category: "tips"
tags: ["goldman-sachs", "adobe", "comparison"]
---

If you're preparing for interviews at both Goldman Sachs and Adobe, you're in a fortunate but challenging position. These two tech giants represent different ends of the software engineering spectrum: one a financial powerhouse where code moves billions, the other a creative technology leader where code creates experiences. The good news? Your preparation has significant overlap. The better news? By understanding their distinct flavors, you can craft a targeted strategy that maximizes your efficiency. This isn't about studying harder; it's about studying smarter by knowing exactly where each company focuses its technical evaluation.

## Question Volume and Difficulty

Let's decode the numbers. Goldman Sachs' tagged list on LeetCode sits at **270 questions** (51 Easy, 171 Medium, 48 Hard). Adobe's is **227 questions** (68 Easy, 129 Medium, 30 Hard).

The first takeaway is **intensity**. Goldman's list is not only larger but has a much higher proportion of Medium and Hard problems (81% vs 70% for Adobe). This suggests their interviews are known for pushing candidates into more complex problem-solving territory. The sheer volume of Mediums for Goldman (171) indicates you should expect at least one, if not two, problems that require combining multiple concepts or careful edge-case handling within a 45-60 minute session.

Adobe's distribution is more forgiving, with a higher percentage of Easy problems. This doesn't mean their interviews are easy—it often means they value clean, optimal, and bug-free implementation of fundamental algorithms under pressure. A "Medium" at Adobe might focus on a single core concept executed perfectly, whereas a "Medium" at Goldman might involve a twist that requires an additional insight.

## Topic Overlap

This is where your prep gets efficient. Both companies heavily test:

- **Array & String Manipulation:** The bread and butter. Expect slicing, searching, sorting, and in-place modifications.
- **Hash Table:** The most common tool for achieving O(1) lookups to optimize a naive solution. If you're not immediately thinking "can a hash map help?" when you see a search problem, you're underprepared for either company.

The key difference lies in their secondary focuses:

- **Goldman Sachs' Signature: Dynamic Programming.** The presence of DP as a top-tier topic is telling. Finance deals with optimization, risk, and multi-stage decision-making—concepts naturally modeled by DP. You **must** be comfortable with classic DP patterns (0/1 Knapsack, Longest Common Subsequence, Fibonacci-style) and, more importantly, able to _identify_ when a problem has an optimal substructure.
- **Adobe's Signature: Two Pointers.** This aligns with Adobe's domain in creative software, which often involves processing sequences of data (like image pixel arrays, document text, or timeline events). Mastering the sliding window and left-right pointer patterns is non-negotiable for Adobe.

## Preparation Priority Matrix

Maximize your return on investment (ROI) by prioritizing in this order:

1.  **High-ROI Overlap (Study First):** Array, String, Hash Table. These are foundational for both.
2.  **Goldman-Specific Priority:** Dynamic Programming. This is your biggest delta. If you're weak here, it's a major Goldman risk.
3.  **Adobe-Specific Priority:** Two Pointers. Crucial for Adobe, but also a generally useful pattern that pops up elsewhere.

For overlap prep, don't just solve random problems. Solve the classics that teach the pattern:

- **Two Sum (#1):** The quintessential hash map problem.
- **Best Time to Buy and Sell Stock (#121):** Teaches array traversal and tracking min/max. The follow-ups (#122, #123) dive into state machine DP, which is excellent Goldman prep.
- **Merge Intervals (#56):** Excellent for practicing array sorting and greedy merges, common in both sets.

## Interview Format Differences

The _how_ is as important as the _what_.

**Goldman Sachs** interviews often follow a more traditional finance tech structure. You might encounter:

- **HackerRank-style OA:** A timed online assessment with 2-3 problems, often leaning medium-hard.
- **Technical Rounds:** Typically 2-3 rounds. Problems can be mathematically inclined or involve data stream processing. There's a stronger emphasis on **performance optimization and scalability** even in coding rounds—they want to know you're thinking about how the code would handle millions of transactions.
- **System Design:** For senior roles, expect a dedicated system design round focused on high-throughput, low-latency, or highly reliable systems.

**Adobe** interviews tend to mirror pure-play tech companies:

- **Technical Rounds:** 3-4 rounds, often starting with a phone screen. Problems are more likely to be directly drawn from their core topics list.
- **Focus on Implementation:** They prize **clean, production-ready code**. Use meaningful variable names, handle edge cases explicitly, and discuss testing. A working, readable solution can sometimes trump a slightly more optimal but messy one.
- **Behavioral & Domain Fit:** Given their creative products, be prepared to discuss your approach to software design, collaboration, and perhaps how you balance technical constraints with user experience goals.

## Specific Problem Recommendations for Dual Prep

Target these problems because they build skills applicable to **both** interviewers:

1.  **Longest Substring Without Repeating Characters (#3):** This is a **triple-threat**. It's a classic **Sliding Window (Two Pointers)** problem (Adobe core), it uses a **Hash Table** to track characters (overlap core), and the optimization teaches you to think about state management, a stepping stone to **DP** thinking (Goldman core).
2.  **Product of Array Except Self (#238):** A superb **Array** problem that forces you to think about prefix and suffix computations. It has an optimal O(n) time, O(1) space solution (if output array doesn't count) that demonstrates clever space reuse—a concept highly valued in performance-conscious environments like both Goldman and Adobe.
3.  **Coin Change (#322):** This is your **bridge problem** to Goldman's DP focus. It's a canonical Dynamic Programming problem (unbounded knapsack). Understanding its DP solution deeply will unlock a whole class of Goldman problems. While less likely at Adobe, the problem-solving rigor is universal.
4.  **Merge k Sorted Lists (#23):** This moves beyond basic data structures. Solving it efficiently requires a Min-Heap (Priority Queue), a data structure that frequently appears in advanced array/stream processing questions at both companies. It tests your ability to choose the right tool for a non-trivial merging task.

## Which to Prepare for First?

The strategic answer: **Prepare for Goldman Sachs first.**

Here's why: The Goldman Sachs question set is broader and generally more difficult. If you build a study plan that conquers their emphasis on Dynamic Programming and their large volume of Medium/Hard problems, you will automatically cover the core Array/String/Hash Table fundamentals that Adobe requires. You'll then only need to "top up" your preparation with focused practice on **Two Pointers** patterns for Adobe.

Think of it as lifting heavier weights. Training for the heavier lift (Goldman) will make the lighter one (Adobe) feel more manageable. Reversing the order would leave you underprepared for Goldman's specific and challenging demands.

Start with the overlap topics, then dive deep into DP. Use the "Specific Problem Recommendations" above as your initial study blocks. This approach ensures no matter which interview comes first, you're building the most comprehensive and resilient problem-solving skillset.

For more detailed company-specific question lists and trends, visit the CodeJeet pages for [Goldman Sachs](/company/goldman-sachs) and [Adobe](/company/adobe).
