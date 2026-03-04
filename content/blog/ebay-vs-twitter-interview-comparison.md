---
title: "eBay vs Twitter: Interview Question Comparison"
description: "Compare coding interview questions at eBay and Twitter — difficulty levels, topic focus, and preparation strategy."
date: "2026-11-13"
category: "tips"
tags: ["ebay", "twitter", "comparison"]
---

When preparing for technical interviews at major tech companies, understanding their specific question patterns and focus areas is crucial for efficient study. eBay and Twitter (now X) both present distinct interview profiles that reflect their engineering priorities—eBay with its e-commerce marketplace systems and Twitter with its real-time social platform. This comparison breaks down their question volume, difficulty, core topics, and provides a strategic preparation order.

## Question Volume and Difficulty

eBay’s question set is slightly larger, with 60 total questions categorized as 12 Easy, 38 Medium, and 10 Hard. This distribution shows a strong emphasis on Medium-difficulty problems, which form the core of their technical screens and on-site interviews. The relatively lower proportion of Hard questions suggests that while depth is tested, the interview may prioritize robust, clean solutions to common algorithmic challenges over highly complex, obscure problems.

Twitter’s set is 53 questions, distributed as 8 Easy, 33 Medium, and 12 Hard. The key difference is the higher count and proportion of Hard questions. This aligns with Twitter’s historical focus on building scalable, low-latency systems for real-time data. Interviews often probe deeper into optimization, edge cases, and system-level thinking, even within coding rounds.

**Takeaway:** Expect a solid foundation of Medium problems at both. Twitter’s process is likely to push more frequently into Hard-difficulty optimization, while eBay’s may focus more on correctness and clarity on a wider range of Medium problems.

## Topic Overlap

Both companies heavily test the foundational trio: **Array, String, and Hash Table**. These are essential for data manipulation, which is central to both domains—product catalogs and user data at eBay, and tweets, timelines, and user interactions at Twitter.

**eBay’s specific focus on Sorting** as a top topic is telling. E-commerce platforms constantly sort and rank items—by price, relevance, rating, or date. Be prepared for problems involving custom comparators, merging sorted lists, and top-K elements.

<div class="code-group">

```python
# Example: Sorting with custom key (eBay-style)
products = [{'name': 'laptop', 'price': 800}, {'name': 'phone', 'price': 600}]
# Sort by price ascending
products.sort(key=lambda x: x['price'])
```

```javascript
// Example: Sorting with custom comparator (eBay-style)
let products = [
  { name: "laptop", price: 800 },
  { name: "phone", price: 600 },
];
// Sort by price ascending
products.sort((a, b) => a.price - b.price);
```

```java
// Example: Sorting with custom comparator (eBay-style)
import java.util.*;
class Product {
    String name;
    int price;
    // ... constructor ...
}
List<Product> products = new ArrayList<>();
// Sort by price ascending
products.sort(Comparator.comparingInt(p -> p.price));
```

</div>

**Twitter’s standout topic is Design.** This doesn't just mean System Design; it often includes Object-Oriented Design (OOD) for features like a tweet composer or a notification system, and sometimes data structure design (e.g., design a data structure for a social graph). This reflects the need to architect scalable, maintainable features.

**Takeaway:** Master Arrays, Strings, and Hash Tables for both. Then, drill into Sorting patterns for eBay and practice Design-oriented coding problems (like designing a class or a data structure) for Twitter.

## Which to Prepare for First

If you are interviewing at both, or simply want to build a broad foundation, **start with eBay’s question list**. Here’s why:

1.  **Broader Medium-Problem Foundation:** The larger set of Medium questions provides excellent practice for the most common interview hurdle. Solving these builds fluency in core algorithms and data structures.
2.  **Sorting is a Fundamental Skill:** Proficiency with sorting algorithms and their applications (two-pointer techniques, binary search on sorted arrays, intervals) is transferable and highly valuable for Twitter interviews as well.
3.  **Progressive Difficulty:** After conquering eBay’s Medium-heavy list, transitioning to Twitter’s set will feel like adding a layer of increased complexity and optimization focus, rather than facing a completely different challenge.

Once comfortable with eBay’s problems, pivot to Twitter’s list to:

- Tackle more Hard problems.
- Practice integrating system design principles into your code (e.g., discussing trade-offs between different data structures for a massive-scale feature).
- Get accustomed to questions where the "design" of your code’s structure and API is as important as the algorithm itself.

This approach ensures you build a strong, versatile core competency before specializing in the deeper optimization and design focus required at Twitter.

For targeted practice, explore the company-specific question lists: [eBay Interview Questions](/company/ebay) and [Twitter Interview Questions](/company/twitter).
