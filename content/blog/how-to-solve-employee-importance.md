---
title: "How to Solve Employee Importance — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Employee Importance. Medium difficulty, 69.3% acceptance rate. Topics: Array, Hash Table, Tree, Depth-First Search, Breadth-First Search."
date: "2028-05-09"
category: "dsa-patterns"
tags: ["employee-importance", "array", "hash-table", "tree", "medium"]
---

# How to Solve Employee Importance

You're given a list of employees where each employee has an ID, importance value, and list of subordinate IDs. Given a target employee ID, you need to calculate the total importance of that employee plus all their subordinates (and their subordinates, recursively). The tricky part is that employees aren't given in any particular order, and you need to efficiently navigate this tree-like structure without knowing the hierarchy in advance.

## Visual Walkthrough

Let's trace through a concrete example. Suppose we have these employees:

```
Employee 1: importance 5, subordinates [2, 3]
Employee 2: importance 3, subordinates []
Employee 3: importance 3, subordinates [4]
Employee 4: importance 1, subordinates []
```

If we're asked for the total importance of employee 1, we need:

- Employee 1's own importance: 5
- Plus all subordinates of employee 1: employees 2 and 3
- Employee 2 has no subordinates, so just add 3
- Employee 3 has subordinate 4, so add 3 + 1

Total: 5 + 3 + 3 + 1 = 12

The key insight is that this forms a tree structure:

```
      1 (5)
     /      \
   2 (3)    3 (3)
            |
          4 (1)
```

We need to traverse this tree starting from the given employee ID, summing importance values along the way.

## Brute Force Approach

A naive approach would be to repeatedly search through the employees array to find each employee. For the target employee, we'd:

1. Linear search through employees to find the target ID
2. Add its importance
3. For each subordinate ID, repeat the process (another linear search)

The problem with this approach is the repeated linear searches. In the worst case where we have a chain of subordinates (like 1 → 2 → 3 → 4 → ... → n), we'd search through the entire array for each employee. This gives us O(n²) time complexity where n is the number of employees.

Here's what the brute force might look like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) for recursion stack
def getImportance(employees, id):
    # Linear search to find employee with matching ID
    for emp in employees:
        if emp.id == id:
            total = emp.importance
            # Recursively calculate importance for each subordinate
            for sub_id in emp.subordinates:
                total += getImportance(employees, sub_id)
            return total
    return 0  # ID not found
```

```javascript
// Time: O(n²) | Space: O(n) for recursion stack
function getImportance(employees, id) {
  // Linear search to find employee with matching ID
  for (const emp of employees) {
    if (emp.id === id) {
      let total = emp.importance;
      // Recursively calculate importance for each subordinate
      for (const subId of emp.subordinates) {
        total += getImportance(employees, subId);
      }
      return total;
    }
  }
  return 0; // ID not found
}
```

```java
// Time: O(n²) | Space: O(n) for recursion stack
public int getImportance(List<Employee> employees, int id) {
    // Linear search to find employee with matching ID
    for (Employee emp : employees) {
        if (emp.id == id) {
            int total = emp.importance;
            // Recursively calculate importance for each subordinate
            for (int subId : emp.subordinates) {
                total += getImportance(employees, subId);
            }
            return total;
        }
    }
    return 0;  // ID not found
}
```

</div>

This works but is inefficient because we're repeatedly scanning the entire employees list.

## Optimized Approach

The key optimization is to use a hash map (dictionary) to map employee IDs to their employee objects. This allows O(1) lookup instead of O(n) linear search. Once we have this map, we can use either DFS (depth-first search) or BFS (breadth-first search) to traverse the tree of subordinates.

**Step-by-step reasoning:**

1. **Build a lookup table**: Create a dictionary that maps employee IDs to their full employee objects. This is a one-time O(n) operation that saves us from repeated linear searches.
2. **Choose traversal method**: We can use either DFS (recursive or iterative with a stack) or BFS (with a queue). Both work equally well since we need to visit all nodes in the subtree.
3. **Traverse and sum**: Starting from the target employee, add their importance, then process all their subordinates, then their subordinates' subordinates, etc.
4. **Avoid cycles**: While the problem states there won't be cycles, in a real interview you might mention that a visited set could prevent infinite loops if cycles existed.

The hash map optimization reduces our time complexity from O(n²) to O(n), which is optimal since we need to potentially visit every employee anyway.

## Optimal Solution

Here's the complete solution using DFS with a hash map for O(1) lookups:

<div class="code-group">

```python
"""
# Definition for Employee.
class Employee:
    def __init__(self, id: int, importance: int, subordinates: List[int]):
        self.id = id
        self.importance = importance
        self.subordinates = subordinates
"""

# Time: O(n) | Space: O(n)
def getImportance(employees, id):
    # Step 1: Build a hash map for O(1) employee lookup
    # This is the key optimization - no more linear searches!
    emp_map = {emp.id: emp for emp in employees}

    # Step 2: Use DFS to traverse the tree of subordinates
    def dfs(emp_id):
        # Get the employee object from our map
        employee = emp_map[emp_id]

        # Start with this employee's importance
        total = employee.importance

        # Recursively add importance of all subordinates
        for sub_id in employee.subordinates:
            total += dfs(sub_id)

        return total

    # Step 3: Start DFS from the target employee ID
    return dfs(id)
```

```javascript
/**
 * Definition for Employee.
 * function Employee(id, importance, subordinates) {
 *     this.id = id;
 *     this.importance = importance;
 *     this.subordinates = subordinates;
 * }
 */

// Time: O(n) | Space: O(n)
function getImportance(employees, id) {
  // Step 1: Build a hash map for O(1) employee lookup
  // This is the key optimization - no more linear searches!
  const empMap = new Map();
  for (const emp of employees) {
    empMap.set(emp.id, emp);
  }

  // Step 2: Use DFS to traverse the tree of subordinates
  function dfs(empId) {
    // Get the employee object from our map
    const employee = empMap.get(empId);

    // Start with this employee's importance
    let total = employee.importance;

    // Recursively add importance of all subordinates
    for (const subId of employee.subordinates) {
      total += dfs(subId);
    }

    return total;
  }

  // Step 3: Start DFS from the target employee ID
  return dfs(id);
}
```

```java
/*
// Definition for Employee.
class Employee {
    public int id;
    public int importance;
    public List<Integer> subordinates;
};
*/

// Time: O(n) | Space: O(n)
class Solution {
    public int getImportance(List<Employee> employees, int id) {
        // Step 1: Build a hash map for O(1) employee lookup
        // This is the key optimization - no more linear searches!
        Map<Integer, Employee> empMap = new HashMap<>();
        for (Employee emp : employees) {
            empMap.put(emp.id, emp);
        }

        // Step 2: Use DFS to traverse the tree of subordinates
        return dfs(id, empMap);
    }

    private int dfs(int empId, Map<Integer, Employee> empMap) {
        // Get the employee object from our map
        Employee employee = empMap.get(empId);

        // Start with this employee's importance
        int total = employee.importance;

        // Recursively add importance of all subordinates
        for (int subId : employee.subordinates) {
            total += dfs(subId, empMap);
        }

        return total;
    }
}
```

</div>

**Alternative BFS solution:** Some candidates prefer BFS for tree traversal. Here's how it would look:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) - BFS version
def getImportance(employees, id):
    # Build lookup map
    emp_map = {emp.id: emp for emp in employees}

    total = 0
    queue = [id]  # Start with target employee ID

    while queue:
        current_id = queue.pop(0)  # Dequeue
        employee = emp_map[current_id]

        # Add this employee's importance
        total += employee.importance

        # Add all subordinates to the queue
        queue.extend(employee.subordinates)

    return total
```

```javascript
// Time: O(n) | Space: O(n) - BFS version
function getImportance(employees, id) {
  // Build lookup map
  const empMap = new Map();
  for (const emp of employees) {
    empMap.set(emp.id, emp);
  }

  let total = 0;
  const queue = [id]; // Start with target employee ID

  while (queue.length > 0) {
    const currentId = queue.shift(); // Dequeue
    const employee = empMap.get(currentId);

    // Add this employee's importance
    total += employee.importance;

    // Add all subordinates to the queue
    queue.push(...employee.subordinates);
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(n) - BFS version
public int getImportance(List<Employee> employees, int id) {
    // Build lookup map
    Map<Integer, Employee> empMap = new HashMap<>();
    for (Employee emp : employees) {
        empMap.put(emp.id, emp);
    }

    int total = 0;
    Queue<Integer> queue = new LinkedList<>();
    queue.offer(id);  // Start with target employee ID

    while (!queue.isEmpty()) {
        int currentId = queue.poll();  // Dequeue
        Employee employee = empMap.get(currentId);

        // Add this employee's importance
        total += employee.importance;

        // Add all subordinates to the queue
        for (int subId : employee.subordinates) {
            queue.offer(subId);
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the hash map takes O(n) where n is the number of employees
- The DFS/BFS traversal visits each employee at most once, also O(n)
- Each employee lookup in the hash map is O(1)

**Space Complexity: O(n)**

- The hash map stores all n employees: O(n)
- The recursion stack (DFS) or queue (BFS) in the worst case could hold all employees if the tree is a straight line: O(n)
- Total: O(n) + O(n) = O(n)

## Common Mistakes

1. **Forgetting to build a lookup map**: The most common mistake is doing repeated linear searches through the employees array. This turns an O(n) problem into O(n²). Always ask yourself: "Will I need to look up elements by key frequently?" If yes, use a hash map.

2. **Infinite recursion with cycles**: While the problem guarantees no cycles, in an interview you might want to mention that in a real-world scenario with possible cycles, you'd need a visited set to avoid infinite recursion. Example fix:

   ```python
   def dfs(emp_id, visited):
       if emp_id in visited:
           return 0
       visited.add(emp_id)
       # ... rest of the function
   ```

3. **Not handling missing employees**: What if the target ID doesn't exist in the list? The hash map approach will throw a KeyError/NullPointerException. Always consider edge cases:

   ```python
   if id not in emp_map:
       return 0
   ```

4. **Confusing employee objects with IDs**: When processing subordinates, remember they're IDs, not employee objects. You need to look them up in your map before accessing their properties.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Tree/Graph Traversal**: The employee hierarchy forms a tree (or more generally, a directed graph). Problems that involve traversing hierarchical data use similar DFS/BFS approaches:
   - **Nested List Weight Sum** (mentioned in the problem): Traverse nested lists, similar to traversing a tree
   - **Clone Graph**: Use BFS/DFS with a hash map to avoid cycles
   - **Course Schedule**: Detect cycles in a directed graph using DFS

2. **Hash Map for O(1) Lookup**: Any time you need to frequently look up elements by a key (like employee ID), a hash map is your friend:
   - **Two Sum**: Use a hash map to store seen numbers for O(1) lookups
   - **LRU Cache**: Combine hash map with linked list for O(1) operations

3. **Recursive Summation**: Calculating a sum over a tree structure:
   - **Maximum Depth of Binary Tree**: Recursively calculate depth
   - **Path Sum**: Recursively check for path sums in a binary tree

## Key Takeaways

1. **When you see "look up by ID/key" think "hash map"**: If you're given objects with unique identifiers and need to find them repeatedly, preprocess by building a dictionary/map. This single optimization often turns a brute force solution into an optimal one.

2. **Trees can be represented in non-obvious ways**: The employee hierarchy isn't given as a tree node structure with left/right children, but as a list with references (subordinate IDs). Recognize that this is still a tree/graph traversal problem.

3. **DFS vs BFS is often interchangeable for summation**: When you need to visit all nodes in a tree (like summing all values), both DFS and BFS work. Choose based on what's simpler or what the interviewer prefers. DFS is usually more concise for recursive problems.

Related problems: [Nested List Weight Sum](/problem/nested-list-weight-sum)
