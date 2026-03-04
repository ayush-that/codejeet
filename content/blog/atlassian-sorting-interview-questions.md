---
title: "Sorting Questions at Atlassian: What to Expect"
description: "Prepare for Sorting interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-26"
category: "dsa-patterns"
tags: ["atlassian", "sorting", "interview prep"]
---

Sorting questions appear in roughly 20% of Atlassian's technical interview problems. This isn't about testing if you can call `.sort()`. It's about evaluating your ability to recognize when sorting transforms an inefficient solution into an optimal one, and your skill in applying custom comparison logic to complex data—a daily task when managing tickets, priorities, and dependencies in systems like Jira.

## What to Expect — Types of Problems

Atlassian's sorting problems typically fall into two categories.

First, **"Sorting as Optimization"**: A brute-force solution exists, but sorting the input first unlocks a better time complexity, often reducing it from O(n²) to O(n log n). These questions test if you can identify sorting as the key step. Examples include finding the minimum number of meetings rooms required (overlap problems) or the maximum number of non-overlapping tasks.

Second, **"Custom Object Sorting"**: You'll be given data structures like lists of tickets, events, or file versions with multiple attributes (e.g., priority, timestamp, ID). You must implement a comparator to sort them according to a specific, multi-field rule set that mirrors real-world prioritization logic in Atlassian products.

You will almost never be asked to implement a raw sorting algorithm like quicksort from scratch. The focus is on application.

## How to Prepare — Study Tips with Code Example

Master the pattern of sorting first to simplify the rest of the problem. Drill problems where the optimal approach starts with `array.sort()`. Then, practice writing custom comparator functions until they are second nature.

A key pattern is sorting based on a specific key or computed property to group or order elements effectively. Here is a common example: sorting strings by a custom order (like priority levels: "High", "Medium", "Low").

<div class="code-group">

```python
def sort_by_custom_priority(tickets):
    priority_order = {"High": 0, "Medium": 1, "Low": 2}
    # Sort by the integer rank from the mapping
    tickets.sort(key=lambda ticket: priority_order[ticket['priority']])
    return tickets

# Example usage:
tickets = [{'id': 1, 'priority': 'Low'}, {'id': 2, 'priority': 'High'}]
print(sort_by_custom_priority(tickets))
```

```javascript
function sortByCustomPriority(tickets) {
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  // Sort by the integer rank from the mapping
  tickets.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return tickets;
}

// Example usage:
const tickets = [
  { id: 1, priority: "Low" },
  { id: 2, priority: "High" },
];
console.log(sortByCustomPriority(tickets));
```

```java
import java.util.*;

public class TicketSorter {
    public static List<Map<String, String>> sortByCustomPriority(List<Map<String, String>> tickets) {
        Map<String, Integer> priorityOrder = Map.of("High", 0, "Medium", 1, "Low", 2);
        tickets.sort(Comparator.comparing(ticket -> priorityOrder.get(ticket.get("priority"))));
        return tickets;
    }

    // Example usage:
    public static void main(String[] args) {
        List<Map<String, String>> tickets = new ArrayList<>();
        tickets.add(Map.of("id", "1", "priority", "Low"));
        tickets.add(Map.of("id", "2", "priority", "High"));
        System.out.println(sortByCustomPriority(tickets));
    }
}
```

</div>

## Recommended Practice Order

1.  **Fundamentals**: Start with basic sorting applications (Two Sum, Meeting Rooms). Ensure you can articulate the time/space complexity improvement.
2.  **Comparators**: Practice multi-level sorting (sort by status, then by priority, then by date). Implement this in your primary interview language.
3.  **Atlassian Context**: Solve their tagged company questions. Look for problems involving tickets, versions, or scheduling.
4.  **Integration**: Combine sorting with other techniques like two-pointers or greedy algorithms in a single solution.

[Practice Sorting at Atlassian](/company/atlassian/sorting)
