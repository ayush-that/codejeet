---
title: "How to Solve Display Table of Food Orders in a Restaurant — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Display Table of Food Orders in a Restaurant. Medium difficulty, 76.4% acceptance rate. Topics: Array, Hash Table, String, Sorting, Ordered Set."
date: "2029-01-06"
category: "dsa-patterns"
tags: ["display-table-of-food-orders-in-a-restaurant", "array", "hash-table", "string", "medium"]
---

# How to Solve "Display Table of Food Orders in a Restaurant"

This problem asks us to transform a list of individual food orders into a formatted table showing how many of each food item were ordered at each table. The challenge lies in efficiently aggregating data from multiple dimensions (tables and food items) while maintaining proper ordering for the final output.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
orders = [
    ["David","3","Ceviche"],
    ["Corina","10","Beef Burrito"],
    ["David","3","Fried Chicken"],
    ["Carla","5","Water"],
    ["Carla","5","Ceviche"],
    ["Rous","3","Ceviche"]
]
```

**Step 1: Identify all unique food items**

- Scan through all orders and collect unique food items: "Ceviche", "Beef Burrito", "Fried Chicken", "Water"
- Sort them alphabetically: ["Beef Burrito", "Ceviche", "Fried Chicken", "Water"]

**Step 2: Identify all unique table numbers**

- Collect unique table numbers: "3", "10", "5"
- Sort them numerically: ["3", "5", "10"]

**Step 3: Count orders for each table-food combination**
We need to track how many times each food item was ordered at each table:

- Table 3: Ceviche × 2, Fried Chicken × 1
- Table 5: Water × 1, Ceviche × 1
- Table 10: Beef Burrito × 1

**Step 4: Build the output table**
First row: ["Table", "Beef Burrito", "Ceviche", "Fried Chicken", "Water"]
Then for each table in sorted order:

- Table 3: ["3", "0", "2", "1", "0"]
- Table 5: ["5", "0", "1", "0", "1"]
- Table 10: ["10", "1", "0", "0", "0"]

The tricky part is efficiently counting and organizing this data while maintaining the correct ordering for both rows and columns.

## Brute Force Approach

A naive approach might involve:

1. Finding all unique tables and food items
2. For each table, for each food item, count how many orders match that combination
3. Sort everything and build the output

The problem with this approach is efficiency. If we have T tables and F food items, checking every table-food combination against all N orders would take O(T × F × N) time, which becomes O(N³) in the worst case when T and F are both O(N).

Even a slightly better brute force that pre-processes data into a dictionary would still need careful handling of sorting and counting. The main challenge isn't that brute force is impossibly slow, but that it's easy to make mistakes with the complex data organization required.

## Optimized Approach

The key insight is to use nested hash maps (dictionaries) to efficiently count orders by table and food item:

1. **Use a dictionary of dictionaries** to count orders: `table_counts[table][food] = count`
2. **Maintain separate sorted sets** for tables and food items as we process orders
3. **Convert table numbers to integers for proper numeric sorting** (since "10" should come after "9", not between "1" and "2" in string sorting)

The optimal approach has these steps:

- Initialize a dictionary to track counts per table per food item
- Use sets to collect all unique food items and table numbers
- Process each order once to update counts and collect unique values
- Sort food items alphabetically and table numbers numerically
- Build the header row starting with "Table"
- For each table in sorted order, build a row with counts for each food item in the sorted order

This gives us O(N) processing time with O(N) space, plus O(F log F + T log T) for sorting the unique items.

## Optimal Solution

<div class="code-group">

```python
# Time: O(N + T log T + F log F) where N = number of orders,
#       T = number of unique tables, F = number of unique food items
# Space: O(T * F) for storing the count dictionary
def displayTable(orders):
    # Step 1: Initialize data structures
    # We'll use a nested dictionary: table_counts[table][food] = count
    table_counts = {}

    # Sets to collect all unique food items and table numbers
    food_items = set()
    tables = set()

    # Step 2: Process each order
    for _, table, food in orders:
        # Convert table to integer for proper numeric sorting later
        table_num = int(table)

        # Add to sets of unique values
        food_items.add(food)
        tables.add(table_num)

        # Initialize nested dictionary if needed
        if table_num not in table_counts:
            table_counts[table_num] = {}

        # Increment count for this table-food combination
        table_counts[table_num][food] = table_counts[table_num].get(food, 0) + 1

    # Step 3: Sort the unique values
    # Food items should be sorted alphabetically
    sorted_foods = sorted(food_items)

    # Tables should be sorted numerically
    sorted_tables = sorted(tables)

    # Step 4: Build the result table
    result = []

    # Header row: "Table" followed by sorted food items
    header = ["Table"] + sorted_foods
    result.append(header)

    # Data rows: one for each table in sorted order
    for table in sorted_tables:
        # Start row with table number as string
        row = [str(table)]

        # For each food in sorted order, get count or 0 if not ordered
        for food in sorted_foods:
            count = table_counts[table].get(food, 0)
            row.append(str(count))

        result.append(row)

    return result
```

```javascript
// Time: O(N + T log T + F log F) where N = number of orders,
//       T = number of unique tables, F = number of unique food items
// Space: O(T * F) for storing the count map
function displayTable(orders) {
  // Step 1: Initialize data structures
  // We'll use a nested map: tableCounts[table][food] = count
  const tableCounts = new Map();

  // Sets to collect all unique food items and table numbers
  const foodItems = new Set();
  const tables = new Set();

  // Step 2: Process each order
  for (const [_, table, food] of orders) {
    // Convert table to number for proper numeric sorting
    const tableNum = parseInt(table, 10);

    // Add to sets of unique values
    foodItems.add(food);
    tables.add(tableNum);

    // Initialize nested map if needed
    if (!tableCounts.has(tableNum)) {
      tableCounts.set(tableNum, new Map());
    }

    const foodMap = tableCounts.get(tableNum);
    // Increment count for this table-food combination
    foodMap.set(food, (foodMap.get(food) || 0) + 1);
  }

  // Step 3: Sort the unique values
  // Food items should be sorted alphabetically
  const sortedFoods = Array.from(foodItems).sort();

  // Tables should be sorted numerically
  const sortedTables = Array.from(tables).sort((a, b) => a - b);

  // Step 4: Build the result table
  const result = [];

  // Header row: "Table" followed by sorted food items
  const header = ["Table", ...sortedFoods];
  result.push(header);

  // Data rows: one for each table in sorted order
  for (const table of sortedTables) {
    // Start row with table number as string
    const row = [table.toString()];

    // Get the food count map for this table
    const foodMap = tableCounts.get(table);

    // For each food in sorted order, get count or 0 if not ordered
    for (const food of sortedFoods) {
      const count = foodMap.get(food) || 0;
      row.push(count.toString());
    }

    result.push(row);
  }

  return result;
}
```

```java
// Time: O(N + T log T + F log F) where N = number of orders,
//       T = number of unique tables, F = number of unique food items
// Space: O(T * F) for storing the count map
import java.util.*;

public List<List<String>> displayTable(List<List<String>> orders) {
    // Step 1: Initialize data structures
    // We'll use a nested map: tableCounts[table][food] = count
    Map<Integer, Map<String, Integer>> tableCounts = new HashMap<>();

    // Sets to collect all unique food items and table numbers
    Set<String> foodItems = new HashSet<>();
    Set<Integer> tables = new HashSet<>();

    // Step 2: Process each order
    for (List<String> order : orders) {
        String tableStr = order.get(1);
        String food = order.get(2);
        int tableNum = Integer.parseInt(tableStr);

        // Add to sets of unique values
        foodItems.add(food);
        tables.add(tableNum);

        // Initialize nested map if needed
        tableCounts.putIfAbsent(tableNum, new HashMap<>());

        // Increment count for this table-food combination
        Map<String, Integer> foodMap = tableCounts.get(tableNum);
        foodMap.put(food, foodMap.getOrDefault(food, 0) + 1);
    }

    // Step 3: Sort the unique values
    // Food items should be sorted alphabetically
    List<String> sortedFoods = new ArrayList<>(foodItems);
    Collections.sort(sortedFoods);

    // Tables should be sorted numerically
    List<Integer> sortedTables = new ArrayList<>(tables);
    Collections.sort(sortedTables);

    // Step 4: Build the result table
    List<List<String>> result = new ArrayList<>();

    // Header row: "Table" followed by sorted food items
    List<String> header = new ArrayList<>();
    header.add("Table");
    header.addAll(sortedFoods);
    result.add(header);

    // Data rows: one for each table in sorted order
    for (int table : sortedTables) {
        List<String> row = new ArrayList<>();
        // Start row with table number as string
        row.add(String.valueOf(table));

        // Get the food count map for this table
        Map<String, Integer> foodMap = tableCounts.get(table);

        // For each food in sorted order, get count or 0 if not ordered
        for (String food : sortedFoods) {
            int count = foodMap.getOrDefault(food, 0);
            row.add(String.valueOf(count));
        }

        result.add(row);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N + T log T + F log F)**

- **O(N)**: We process each order once to update counts and collect unique values
- **O(F log F)**: Sorting the unique food items alphabetically
- **O(T log T)**: Sorting the unique table numbers numerically
- **O(T × F)**: Building the final table (iterating through all table-food combinations)

**Space Complexity: O(T × F)**

- We store a count for each unique table-food combination that appears in the orders
- In the worst case, if every table orders every food item at least once, this is T × F
- Additional O(T + F) space for the sorted lists of unique tables and food items

## Common Mistakes

1. **Not converting table numbers to integers before sorting**: If you keep table numbers as strings and sort them alphabetically, "10" would come before "2" because string comparison is character-by-character. Always convert to integers for numeric sorting.

2. **Forgetting to handle missing combinations**: When building the final table, some tables may not have ordered certain food items. You must return "0" for these, not skip them or return empty string.

3. **Incorrect header format**: The first column must be "Table" (capital T), not "table" or anything else. The first row must contain all food items in alphabetical order.

4. **Not sorting food items alphabetically**: The problem specifies that food items in the header should be in lexicographical (alphabetical) order. Using an unordered set or map won't guarantee this.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Data aggregation with nested dictionaries**: Similar to "Group Anagrams" (LeetCode 49) where you group strings by a key, or "Find Duplicate File in System" (LeetCode 609) where you group files by content.

2. **Multi-dimensional counting**: Like "Design Underground System" (LeetCode 1396) where you track travel times between stations, or "Tweet Counts Per Frequency" (LeetCode 1348) where you count events in time intervals.

3. **Table formatting problems**: Such as "Excel Sheet Column Title" (LeetCode 168) or "Cells in a Range on an Excel Sheet" (LeetCode 2194) which involve converting between different data representations.

The core pattern is using hash maps to efficiently aggregate multi-dimensional data, then transforming it into a human-readable format with proper sorting.

## Key Takeaways

1. **Use nested dictionaries for multi-dimensional counting**: When you need to count occurrences across two or more categories (like table and food), a dictionary of dictionaries is often the right tool.

2. **Separate data collection from sorting**: First collect all unique values in sets (for O(1) lookups), then sort them once at the end. This is more efficient than trying to maintain sorted order during insertion.

3. **Pay attention to sorting requirements**: Different columns may need different sort orders (numeric vs. alphabetical). Always check the problem statement carefully for sorting requirements.

[Practice this problem on CodeJeet](/problem/display-table-of-food-orders-in-a-restaurant)
