---
title: "Medium Atlassian Interview Questions: Strategy Guide"
description: "How to tackle 43 medium difficulty questions from Atlassian — patterns, time targets, and practice tips."
date: "2032-08-05"
category: "tips"
tags: ["atlassian", "medium", "interview prep"]
---

Atlassian’s 43 Medium difficulty questions form the core of their technical interview process. These problems are designed to assess not just your ability to write correct code, but your approach to system design trade-offs, clean implementation, and collaborative problem-solving. A typical Medium question here often blends a standard algorithmic pattern with a practical, real-world context—like optimizing a feature flag system, processing JQL-style queries, or managing concurrent user states. Success requires translating the business logic into efficient code.

## Common Patterns

Atlassian’s Medium problems frequently test a few key areas. Mastering these patterns is crucial.

**Array/String Manipulation & Hashing:** Many problems involve processing logs, user activity streams, or configuration data. Efficient lookups and state tracking using hash maps are essential.

<div class="code-group">
```python
def find_duplicate_transactions(transactions):
    seen = {}
    duplicates = []
    for txn in transactions:
        key = (txn['user'], txn['amount'], txn['timestamp'])
        if key in seen:
            duplicates.append(txn)
        seen[key] = True
    return duplicates
```
```javascript
function findDuplicateTransactions(transactions) {
    const seen = new Set();
    const duplicates = [];
    for (const txn of transactions) {
        const key = `${txn.user}-${txn.amount}-${txn.timestamp}`;
        if (seen.has(key)) duplicates.push(txn);
        seen.add(key);
    }
    return duplicates;
}
```
```java
public List<Transaction> findDuplicateTransactions(List<Transaction> transactions) {
    Set<String> seen = new HashSet<>();
    List<Transaction> duplicates = new ArrayList<>();
    for (Transaction txn : transactions) {
        String key = txn.getUser() + "-" + txn.getAmount() + "-" + txn.getTimestamp();
        if (seen.contains(key)) duplicates.add(txn);
        seen.add(key);
    }
    return duplicates;
}
```
</div>

**Tree/Graph Traversal:** Questions about dependency resolution, permission hierarchies, or team structures often map to DFS/BFS on trees or directed graphs.
**Design-Oriented Implementation:** You'll often implement a specific component, like a rate limiter or a cache, requiring careful thought about data structures and edge cases rather than a complex algorithm.

## Time Targets

In a 45-60 minute interview slot, you should aim to solve a Medium problem within 25-30 minutes. This breakdown is a reliable guide:

- **First 5-10 minutes:** Clarify requirements, ask edge case questions, and explain your initial approach. Communication here is critical.
- **Next 10-15 minutes:** Write clean, syntactically correct code in your chosen language. Prioritize readability and correct use of data structures.
- **Final 5-10 minutes:** Walk through test cases, discuss time/space complexity, and be prepared to extend the solution (e.g., "How would this scale?" or "How would you make it thread-safe?"). The discussion is as important as the code.

## Practice Strategy

Don't just solve for correctness. Practice with Atlassian's specific question style.

1.  **Context First:** When you read a problem, identify the underlying pattern _and_ the business context. Practice explaining why a particular algorithm fits the real-world scenario.
2.  **Communicate While Coding:** Practice verbalizing your thought process as you write. Explain your choice of data structure aloud.
3.  **Analyze Trade-offs:** For each problem, be prepared to answer: "What if input size grew 1000x?" or "What is the memory overhead?" This shows engineering judgment.
4.  **Targeted Review:** Focus your practice on the most frequent patterns listed above. Solve problems sequentially, but spend more time reviewing and optimizing your solutions to these core types.

[Practice Medium Atlassian questions](/company/atlassian/medium)
