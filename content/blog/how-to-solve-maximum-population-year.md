---
title: "How to Solve Maximum Population Year — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Population Year. Easy difficulty, 63.7% acceptance rate. Topics: Array, Counting, Prefix Sum."
date: "2027-03-23"
category: "dsa-patterns"
tags: ["maximum-population-year", "array", "counting", "prefix-sum", "easy"]
---

# How to Solve Maximum Population Year

This problem asks us to find the year with the highest population given birth and death years of individuals. What makes this interesting is that people are counted as alive during their birth year but not during their death year (since death occurs at the end of that year). This creates a subtle off-by-one challenge that trips up many candidates.

## Visual Walkthrough

Let's trace through an example: `logs = [[1993,1999],[2000,2010]]`

**Step 1: Understanding the counting rules**

- Person 1: Born 1993, dies 1999 → Alive during years: 1993, 1994, 1995, 1996, 1997, 1998
- Person 2: Born 2000, dies 2010 → Alive during years: 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009

**Step 2: Year-by-year population**

- 1993: 1 person (Person 1)
- 1994-1998: 1 person (Person 1)
- 1999: 0 people (Person 1 died at end of 1998)
- 2000-2009: 1 person (Person 2)
- 2010: 0 people (Person 2 died at end of 2009)

**Step 3: Finding the maximum**
The maximum population is 1, which occurs in multiple years. According to the problem, we return the earliest such year, so we'd return **1993**.

The key insight: When a person is born, population increases by 1. When they die, population decreases by 1, but **in the year after their death year** since they're alive during their death year.

## Brute Force Approach

The most straightforward approach is to check every possible year from the minimum birth year to the maximum death year:

1. Find the minimum birth year and maximum death year
2. For each year in that range, count how many people were alive
3. Track the year with maximum population

**Why this is inefficient:**

- Time complexity: O(n × y) where n is number of people and y is the year range
- Year range could be up to 100 years (1950-2050), but in worst case could be larger
- For each person, we'd check if they were alive in each year, leading to repeated work

**What a naive candidate might miss:**

- Forgetting that death year is exclusive (person is alive during death year)
- Not handling multiple years with same maximum population correctly
- Checking an unnecessarily large year range

## Optimal Solution

The optimal approach uses a **prefix sum** or **sweep line** technique. We treat births as +1 events and deaths as -1 events, but we need to be careful about the timing of deaths.

**Key insight:** Create a population change array where:

- `change[birth] += 1` (person starts contributing to population)
- `change[death] -= 1` (person stops contributing to population NEXT year)

Then compute running sum to find the year with maximum population.

<div class="code-group">

```python
# Time: O(n + y) where n = len(logs), y = year range (100 in this case)
# Space: O(y) for the population change array
def maximumPopulation(logs):
    # We know years are between 1950 and 2050 inclusive
    # Create array for years 1950-2050 (101 years total)
    # We'll index as year - 1950 to map years to array indices
    CHANGE_OFFSET = 1950
    MAX_YEAR = 2050

    # Initialize change array with zeros
    # Size is MAX_YEAR - CHANGE_OFFSET + 1 = 101
    change = [0] * (MAX_YEAR - CHANGE_OFFSET + 1)

    # Step 1: Mark population changes
    for birth, death in logs:
        # Person adds to population starting at birth year
        change[birth - CHANGE_OFFSET] += 1
        # Person leaves population at death year (since death year is exclusive)
        # We subtract at death year because they won't be counted in death year's population
        change[death - CHANGE_OFFSET] -= 1

    # Step 2: Compute running population and track maximum
    max_population = 0
    current_population = 0
    max_year = 1950  # Default to earliest possible year

    for year_offset in range(len(change)):
        # Update current population for this year
        current_population += change[year_offset]

        # Check if this year has higher population than previous maximum
        if current_population > max_population:
            max_population = current_population
            # Convert offset back to actual year
            max_year = year_offset + CHANGE_OFFSET

    return max_year
```

```javascript
// Time: O(n + y) where n = logs.length, y = year range (100)
// Space: O(y) for the population change array
function maximumPopulation(logs) {
  // Years are between 1950 and 2050 inclusive
  const CHANGE_OFFSET = 1950;
  const MAX_YEAR = 2050;

  // Create array for years 1950-2050 (101 years)
  // Initialize all values to 0
  const change = new Array(MAX_YEAR - CHANGE_OFFSET + 1).fill(0);

  // Step 1: Mark population changes
  for (const [birth, death] of logs) {
    // Person adds to population at birth year
    change[birth - CHANGE_OFFSET] += 1;
    // Person leaves at death year (death year is exclusive)
    change[death - CHANGE_OFFSET] -= 1;
  }

  // Step 2: Compute running population and track maximum
  let maxPopulation = 0;
  let currentPopulation = 0;
  let maxYear = 1950; // Default to earliest possible year

  for (let yearOffset = 0; yearOffset < change.length; yearOffset++) {
    // Update population for current year
    currentPopulation += change[yearOffset];

    // Check if this year has higher population
    if (currentPopulation > maxPopulation) {
      maxPopulation = currentPopulation;
      // Convert offset back to actual year
      maxYear = yearOffset + CHANGE_OFFSET;
    }
  }

  return maxYear;
}
```

```java
// Time: O(n + y) where n = logs.length, y = year range (100)
// Space: O(y) for the population change array
public int maximumPopulation(int[][] logs) {
    // Years are between 1950 and 2050 inclusive
    final int CHANGE_OFFSET = 1950;
    final int MAX_YEAR = 2050;

    // Create array for years 1950-2050 (101 years)
    int[] change = new int[MAX_YEAR - CHANGE_OFFSET + 1];

    // Step 1: Mark population changes
    for (int[] log : logs) {
        int birth = log[0];
        int death = log[1];

        // Person adds to population at birth year
        change[birth - CHANGE_OFFSET] += 1;
        // Person leaves at death year (death year is exclusive)
        change[death - CHANGE_OFFSET] -= 1;
    }

    // Step 2: Compute running population and track maximum
    int maxPopulation = 0;
    int currentPopulation = 0;
    int maxYear = 1950; // Default to earliest possible year

    for (int yearOffset = 0; yearOffset < change.length; yearOffset++) {
        // Update population for current year
        currentPopulation += change[yearOffset];

        // Check if this year has higher population
        if (currentPopulation > maxPopulation) {
            maxPopulation = currentPopulation;
            // Convert offset back to actual year
            maxYear = yearOffset + CHANGE_OFFSET;
        }
    }

    return maxYear;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + y)**

- `O(n)` to iterate through all logs and mark birth/death events
- `O(y)` to compute the running sum and find maximum, where y is the year range (100 in this problem)
- Since y is constant (100), we could also say O(n) in practice

**Space Complexity: O(y)**

- We need an array of size y (year range) to track population changes
- In this problem, y = 101 (1950 to 2050 inclusive), so space is constant O(1) in practice
- If year range wasn't bounded, space would be O(max_year - min_year)

## Common Mistakes

1. **Incorrect death year handling**: The most common error is treating the death year as inclusive. Remember: if someone dies in 1999, they're alive during 1999 but not 2000. So we subtract from population at the death year index, not death+1.

2. **Not returning earliest maximum year**: When multiple years have the same maximum population, we must return the earliest one. The natural iteration from earliest to latest year handles this automatically if we use `>` (not `>=`) when comparing.

3. **Array index out of bounds**: Forgetting that array indices start at 0 when mapping years (1950 → index 0). Always subtract the offset (1950) when accessing the array.

4. **Assuming sorted input**: The logs array isn't guaranteed to be sorted. Don't make assumptions about birth/death year ordering.

## When You'll See This Pattern

This **sweep line** or **interval counting** pattern appears whenever you need to track overlapping intervals or cumulative changes over time:

1. **Meeting Rooms II** (Medium) - Find minimum meeting rooms needed by treating start times as +1 and end times as -1
2. **Car Pooling** (Medium) - Similar to this problem but with capacity constraints
3. **Corporate Flight Bookings** (Medium) - Range addition using prefix sums
4. **Shifting Letters II** (Medium) - The "similar problem" mentioned, which uses the same prefix sum technique for range updates

The core idea: Instead of checking each point against all intervals (O(n²)), mark changes at interval boundaries and compute cumulative effect in one pass (O(n)).

## Key Takeaways

1. **Think in terms of events**: When dealing with intervals over time, convert them to "start" and "end" events. This transforms an O(n²) checking problem into an O(n) sweeping problem.

2. **Watch boundary conditions**: Always clarify whether intervals are inclusive or exclusive at boundaries. Draw small examples to verify your logic.

3. **Prefix sums for range updates**: When you need to apply many range updates and then query points, prefix sums (difference arrays) are often the optimal solution.

Related problems: [Shifting Letters II](/problem/shifting-letters-ii)
