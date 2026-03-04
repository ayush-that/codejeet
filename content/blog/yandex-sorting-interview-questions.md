---
title: "Sorting Questions at Yandex: What to Expect"
description: "Prepare for Sorting interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-03-01"
category: "dsa-patterns"
tags: ["yandex", "sorting", "interview prep"]
---

Sorting questions appear in 12% of Yandex’s technical interview problems—16 out of 134 total. This frequency reflects a core expectation: you must understand how to organize data efficiently, not just implement a basic sort. At Yandex, a company handling massive datasets in search, maps, and machine learning, sorting is rarely an isolated task. It’s a foundational tool for optimizing more complex operations like range queries, deduplication, scheduling, and indexing. Your ability to select and adapt a sorting strategy directly impacts performance at scale.

## What to Expect — Types of Problems

Yandex sorting questions typically fall into three categories:

1. **Direct Application with a Twist**: You’ll be asked to sort data, but with a custom comparator or under specific constraints. Examples include sorting strings by a non-standard alphabet order, sorting intervals, or sorting based on multiple keys (e.g., primary sort by frequency, secondary sort by value).

2. **Sorting as a Subroutine**: The core challenge isn’t sorting itself, but using sorting to enable an efficient solution. This includes problems like finding the minimum number of swaps to make an array sorted, merging k sorted lists, or finding the kth largest element. These test if you recognize when sorting transforms an otherwise costly operation.

3. **Optimization and Hybrid Problems**: These combine sorting with other algorithms. A classic example is the “meeting rooms” problem—sort intervals by start time, then traverse to find overlaps or minimum rooms. Another is using sorting to preprocess data for a two-pointer technique or binary search.

You will rarely write a full sorting algorithm from scratch like quicksort. Instead, you’ll use built-in sort functions and focus on the comparison logic or overall algorithm design.

## How to Prepare — Study Tips with One Code Example

Master the built-in sorting functions and how to customize them. In Python, learn `sorted()` and `list.sort()` with `key` and custom `cmp` functions. In JavaScript, understand `array.sort()` and comparator functions. In Java, know `Arrays.sort()` and `Collections.sort()` with `Comparator`.

Crucially, practice writing clean comparators. A common pattern is sorting objects by multiple attributes. For example, sort people by age descending, then by name ascending.

<div class="code-group">

```python
people = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
    {"name": "Alice", "age": 25}
]

# Sort by age descending, then name ascending
people.sort(key=lambda p: (-p["age"], p["name"]))
print(people)
# Output: [{'name': 'Alice', 'age': 30}, {'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 25}]
```

```javascript
const people = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Alice", age: 25 },
];

// Sort by age descending, then name ascending
people.sort((a, b) => {
  if (a.age !== b.age) {
    return b.age - a.age; // descending
  }
  return a.name.localeCompare(b.name); // ascending
});
console.log(people);
// Output: [{name: 'Alice', age: 30}, {name: 'Alice', age: 25}, {name: 'Bob', age: 25}]
```

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<Person> people = new ArrayList<>();
        people.add(new Person("Alice", 30));
        people.add(new Person("Bob", 25));
        people.add(new Person("Alice", 25));

        // Sort by age descending, then name ascending
        people.sort(Comparator
            .comparingInt(Person::getAge).reversed()
            .thenComparing(Person::getName));

        System.out.println(people);
        // Output: [Alice (30), Alice (25), Bob (25)]
    }
}

class Person {
    String name;
    int age;
    // Constructor, getters omitted for brevity
}
```

</div>

Also, understand the time and space complexity of your language’s default sort (usually O(n log n)) and when stability matters.

## Recommended Practice Order

1. **Master Comparators**: Practice multi-key sorts and custom ordering.
2. **Solve Classic Hybrid Problems**: Practice “Merge Intervals,” “Top K Frequent Elements,” and “Meeting Rooms II.”
3. **Tackle Yandex-Specific Problems**: Work through their actual tagged questions. Start with direct applications, then move to subroutine and optimization problems.
4. **Analyze Edge Cases**: Consider empty input, duplicates, and large datasets. Verbally discuss trade-offs between sorting in-place versus creating a new array.

Focus on clarity and efficiency. Explain why sorting is the right approach and its impact on overall time complexity.

[Practice Sorting at Yandex](/company/yandex/sorting)
