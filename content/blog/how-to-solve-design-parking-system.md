---
title: "How to Solve Design Parking System — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Design Parking System. Easy difficulty, 87.2% acceptance rate. Topics: Design, Simulation, Counting."
date: "2027-10-03"
category: "dsa-patterns"
tags: ["design-parking-system", "design", "simulation", "counting", "easy"]
---

# How to Solve Design Parking System

This problem asks you to design a parking system that tracks available parking spots for three different vehicle sizes: big, medium, and small. While conceptually simple, it's interesting because it tests your ability to design a clean, efficient class that maintains state and handles constraints. The main challenge is creating a system that correctly tracks available spots and provides immediate feedback when a vehicle tries to park.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we initialize our parking system with:

- 1 big spot
- 2 medium spots
- 0 small spots

Our parking lot starts as: `Big: 1, Medium: 2, Small: 0`

**Step 1:** A big car arrives and calls `addCar(1)`

- Check if big spots > 0: Yes (1 > 0)
- Decrement big spots to 0
- Return `true` (car parked successfully)

**Step 2:** Another big car arrives and calls `addCar(1)`

- Check if big spots > 0: No (0 > 0 is false)
- Return `false` (no available big spots)

**Step 3:** A medium car arrives and calls `addCar(2)`

- Check if medium spots > 0: Yes (2 > 0)
- Decrement medium spots to 1
- Return `true`

**Step 4:** A small car arrives and calls `addCar(3)`

- Check if small spots > 0: No (0 > 0 is false)
- Return `false` (no small spots available)

The key insight is that we need to maintain counters for each spot type and decrement them when cars park successfully.

## Brute Force Approach

For this problem, there's no traditional "brute force" in the algorithmic sense since we're designing a class rather than solving a computational problem. However, we can think about what a poorly designed solution might look like:

A naive approach might try to track each individual parking spot rather than just counting them. For example, someone might create arrays or lists for each spot type:

```python
# Inefficient approach - tracking individual spots
class ParkingSystem:
    def __init__(self, big, medium, small):
        self.big_spots = [True] * big  # True = available
        self.medium_spots = [True] * medium
        self.small_spots = [True] * small

    def addCar(self, carType):
        if carType == 1:
            for i in range(len(self.big_spots)):
                if self.big_spots[i]:
                    self.big_spots[i] = False
                    return True
            return False
        # Similar logic for medium and small...
```

**Why this is inefficient:**

- **Space complexity:** O(big + medium + small) instead of O(1)
- **Time complexity:** O(n) for searching available spots instead of O(1)
- **Unnecessary complexity:** We don't need to track individual spots, just counts

The problem only asks whether a car can park, not which specific spot it takes. This means we only need to track how many spots are available, not which ones.

## Optimal Solution

The optimal solution uses simple integer counters for each parking spot type. When a car arrives, we check if there's an available spot of the appropriate size, decrement the counter if so, and return the result.

<div class="code-group">

```python
# Time: O(1) for addCar | Space: O(1) overall
class ParkingSystem:
    def __init__(self, big: int, medium: int, small: int):
        # Initialize counters for each parking spot type
        # We'll store them in a list for easy indexing
        # Index 0 is unused, indices 1-3 correspond to car types 1-3
        self.spots = [0, big, medium, small]

    def addCar(self, carType: int) -> bool:
        # Check if there's an available spot for this car type
        if self.spots[carType] > 0:
            # Decrement the available spots count
            self.spots[carType] -= 1
            return True
        # No available spots for this car type
        return False
```

```javascript
// Time: O(1) for addCar | Space: O(1) overall
class ParkingSystem {
  /**
   * @param {number} big - Number of big parking spots
   * @param {number} medium - Number of medium parking spots
   * @param {number} small - Number of small parking spots
   */
  constructor(big, medium, small) {
    // Store available spots in an array for easy indexing
    // Index 0 is unused to match carType values (1, 2, 3)
    this.spots = [0, big, medium, small];
  }

  /**
   * @param {number} carType - 1 for big, 2 for medium, 3 for small
   * @return {boolean} - True if car parked successfully, false otherwise
   */
  addCar(carType) {
    // Check if there's at least one spot available for this car type
    if (this.spots[carType] > 0) {
      // Decrement the count since we're using one spot
      this.spots[carType]--;
      return true;
    }
    // No spots available for this car type
    return false;
  }
}
```

```java
// Time: O(1) for addCar | Space: O(1) overall
class ParkingSystem {
    // Use an array to store available spots for each car type
    // Index 0 is unused, indices 1-3 correspond to car types 1-3
    private int[] spots;

    public ParkingSystem(int big, int medium, int small) {
        // Initialize the array with the given spot counts
        spots = new int[4];  // We need indices 1-3, so size 4
        spots[1] = big;
        spots[2] = medium;
        spots[3] = small;
    }

    public boolean addCar(int carType) {
        // Check if there's an available spot for this car type
        if (spots[carType] > 0) {
            // Decrement the count since we're allocating one spot
            spots[carType]--;
            return true;
        }
        // No available spots for this car type
        return false;
    }
}
```

</div>

**Key implementation details:**

1. **Array indexing:** We use an array of size 4 (with index 0 unused) so that car types 1, 2, and 3 map directly to array indices. This avoids needing conditional statements to check car types.

2. **State management:** The `spots` array maintains the current count of available spots. When a car parks successfully, we decrement the appropriate counter.

3. **Return value:** The method returns `true` if a spot was available and allocated, `false` otherwise.

## Complexity Analysis

**Time Complexity:**

- **Constructor:** O(1) - Just initializing three integer values
- **addCar():** O(1) - Single array access, comparison, and decrement operation

**Space Complexity:**

- **Overall:** O(1) - We store exactly three integers (or four with the array approach), which is constant space regardless of input size

The solution is optimal because:

1. Each operation completes in constant time
2. We use minimal memory (just the counters)
3. The code is clean and easy to understand

## Common Mistakes

1. **Using separate variables without array indexing:**

   ```python
   # Less clean approach
   def addCar(self, carType):
       if carType == 1:
           if self.big > 0:
               self.big -= 1
               return True
       elif carType == 2:
           if self.medium > 0:
               self.medium -= 1
               return True
       # ... and so on
   ```

   **Why it's problematic:** More code duplication, harder to maintain, and more prone to errors when adding new car types.

2. **Forgetting to check if spots are available before decrementing:**

   ```python
   # Wrong - could go negative
   def addCar(self, carType):
       self.spots[carType] -= 1  # What if spots[carType] was 0?
       return self.spots[carType] >= 0
   ```

   **Why it's problematic:** Counters could go negative, which doesn't make logical sense for parking spots.

3. **Not handling invalid carType values:**
   While the problem guarantees valid inputs (1, 2, or 3), in a real interview you might want to mention edge case handling:

   ```python
   def addCar(self, carType):
       if carType < 1 or carType > 3:
           return False  # Or throw an exception
       # ... rest of the logic
   ```

4. **Using complex data structures unnecessarily:**
   Some candidates might use dictionaries, lists of objects, or other complex structures when simple integers suffice. This adds unnecessary complexity.

## When You'll See This Pattern

This problem demonstrates the **counter pattern** - using simple integer counters to track resources or occurrences. You'll see similar patterns in:

1. **LeetCode 383: Ransom Note** - Count character frequencies to determine if you can construct one string from another.
2. **LeetCode 169: Majority Element** - Count element frequencies to find the element that appears more than n/2 times.
3. **LeetCode 242: Valid Anagram** - Count character frequencies to check if two strings are anagrams.

The core idea is the same: instead of tracking individual instances, track counts. This transforms what could be an O(n²) comparison problem into an O(n) counting problem.

## Key Takeaways

1. **Simple state management:** Many design problems can be solved with basic data types (integers, arrays) rather than complex structures. Don't over-engineer.

2. **Direct indexing for categorization:** When you have categories (like car types 1, 2, 3), using array indexing can simplify your code compared to multiple if-else statements.

3. **Resource tracking pattern:** The counter pattern is fundamental for tracking limited resources, whether it's parking spots, character counts, or inventory items.

Remember: The best solution is often the simplest one that meets all requirements. In interviews, clarity and correctness are more important than cleverness.

[Practice this problem on CodeJeet](/problem/design-parking-system)
