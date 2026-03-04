---
title: "Sorting Questions at Infosys: What to Expect"
description: "Prepare for Sorting interview questions at Infosys — patterns, difficulty breakdown, and study tips."
date: "2027-12-18"
category: "dsa-patterns"
tags: ["infosys", "sorting", "interview prep"]
---

Sorting questions appear in nearly one-fifth of Infosys's technical assessment problems (27 out of 158). This frequency reflects a core truth: sorting is rarely the end goal, but it is a fundamental step that enables efficient solutions to more complex problems. Infosys uses these questions to evaluate a candidate's ability to recognize when data organization is required, implement efficient algorithms, and apply logical thinking to real-world data processing scenarios—skills directly applicable to the large-scale system development and maintenance work the company undertakes.

## What to Expect — Types of Problems

You will not be asked to simply implement a standard sorting algorithm from scratch. Instead, problems integrate sorting as a critical step. Expect these categories:

1.  **Sorting with Custom Comparisons:** The most common type. You'll sort objects, strings, or arrays based on non-standard rules (e.g., sort numbers by the number of factors, sort strings by length then alphabetically).
2.  **Efficiency-Driven Sorting:** Problems where choosing the right sorting approach (like using Counting Sort for a limited range of integers) is key to meeting time/space constraints.
3.  **Sorting as a Pre-processing Step:** The sorting operation itself is straightforward, but it transforms the data to simplify the core logic, such as finding a minimum difference, identifying duplicates, or merging intervals.
4.  **Hybrid Problems:** These combine sorting with other core concepts, like searching (binary search on a sorted result), two-pointer techniques, or greedy algorithms.

## How to Prepare — Study Tips with One Code Example

Master the theory behind **O(n log n)** comparison sorts like Merge Sort and QuickSort, but focus your practice on _applying_ the built-in sort functions intelligently. Your primary skill is learning to define the correct sort key or comparison function.

**Key Tip:** For any problem, ask: "Would sorting the input array make the solution easier or more efficient?" If the answer is yes, determine _exactly how_ the data should be ordered.

Consider this common pattern: **Sorting based on multiple criteria**. Many problems require a primary sort key and a secondary key to break ties.

<div class="code-group">

```python
# Sort a list of employees: primary by department (ascending),
# secondary by salary (descending)
employees = [
    {'name': 'Alice', 'dept': 'IT', 'salary': 90000},
    {'name': 'Bob', 'dept': 'HR', 'salary': 75000},
    {'name': 'Charlie', 'dept': 'IT', 'salary': 85000}
]

# Using a lambda to return a tuple (primary_key, secondary_key)
employees.sort(key=lambda x: (x['dept'], -x['salary']))
print(employees)
# Output: [{'name': 'Bob', 'dept': 'HR', 'salary': 75000},
#          {'name': 'Alice', 'dept': 'IT', 'salary': 90000},
#          {'name': 'Charlie', 'dept': 'IT', 'salary': 85000}]
```

```javascript
// Sort an array of employees: primary by department (ascending),
// secondary by salary (descending)
let employees = [
  { name: "Alice", dept: "IT", salary: 90000 },
  { name: "Bob", dept: "HR", salary: 75000 },
  { name: "Charlie", dept: "IT", salary: 85000 },
];

employees.sort((a, b) => {
  if (a.dept !== b.dept) {
    return a.dept.localeCompare(b.dept); // Primary: dept ascending
  }
  return b.salary - a.salary; // Secondary: salary descending
});
console.log(employees);
```

```java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Sort a list of employees: primary by department (ascending),
        // secondary by salary (descending)
        List<Employee> employees = Arrays.asList(
            new Employee("Alice", "IT", 90000),
            new Employee("Bob", "HR", 75000),
            new Employee("Charlie", "IT", 85000)
        );

        employees.sort(Comparator
            .comparing(Employee::getDept) // Primary: department ascending
            .thenComparing(Comparator.comparingInt(Employee::getSalary).reversed()) // Secondary: salary descending
        );
        System.out.println(employees);
    }
}

// Helper class
class Employee {
    String name;
    String dept;
    int salary;
    // Constructor, getters, and toString() omitted for brevity.
}
```

</div>

## Recommended Practice Order

1.  Start with basic custom sorting using your language's built-in tools (e.g., `sort(key=)` in Python, `Array.sort()` with a comparator in JS/Java).
2.  Practice problems where sorting is the primary enabler: finding min/max differences, checking for anagrams, or merging overlapping intervals.
3.  Tackle hybrid problems that combine sorting with binary search or the two-pointer technique.
4.  Finally, understand the edge cases where a non-comparison sort (like Counting Sort) would be optimal, as Infosys problems sometimes test for efficiency awareness.

[Practice Sorting at Infosys](/company/infosys/sorting)
