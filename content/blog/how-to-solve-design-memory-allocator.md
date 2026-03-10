---
title: "How to Solve Design Memory Allocator — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Memory Allocator. Medium difficulty, 49.7% acceptance rate. Topics: Array, Hash Table, Design, Simulation."
date: "2028-10-13"
category: "dsa-patterns"
tags: ["design-memory-allocator", "array", "hash-table", "design", "medium"]
---

# How to Solve Design Memory Allocator

This problem asks you to design a memory allocator that can allocate blocks of consecutive memory units and free all memory associated with a specific ID. What makes this problem interesting is that it's a simplified simulation of real memory allocation systems, requiring you to track which memory units are free/allocated and efficiently find contiguous free blocks. The challenge lies in balancing implementation simplicity with performance.

## Visual Walkthrough

Let's trace through an example with `n = 10` (memory indices 0-9):

**Initial state:** All memory is free: `[F, F, F, F, F, F, F, F, F, F]`

**Step 1:** `allocate(3, 1)` → Allocate 3 units with ID 1

- We need to find the leftmost block of 3 consecutive free units
- Starting from index 0: indices 0-2 are free ✓
- Allocate: `[1, 1, 1, F, F, F, F, F, F, F]`
- Returns 0 (starting index)

**Step 2:** `allocate(4, 2)` → Allocate 4 units with ID 2

- Find leftmost block of 4 consecutive free units
- Check index 0: occupied by ID 1
- Check index 3: indices 3-6 are free ✓
- Allocate: `[1, 1, 1, 2, 2, 2, 2, F, F, F]`
- Returns 3

**Step 3:** `allocate(2, 3)` → Allocate 2 units with ID 3

- Find leftmost block of 2 consecutive free units
- Check index 0: occupied
- Check index 3: occupied
- Check index 7: indices 7-8 are free ✓
- Allocate: `[1, 1, 1, 2, 2, 2, 2, 3, 3, F]`
- Returns 7

**Step 4:** `free(2)` → Free all memory with ID 2

- Find all units with ID 2 and mark them free
- Result: `[1, 1, 1, F, F, F, F, 3, 3, F]`

**Step 5:** `allocate(5, 4)` → Allocate 5 units with ID 4

- Need 5 consecutive free units
- Check index 0: only 3 free units (0-2 are occupied)
- Check index 3: indices 3-6 are free (4 units) → not enough
- Check index 7: only 2 free units (7-8)
- Check index 9: only 1 free unit
- No block of 5 consecutive free units exists
- Returns -1

## Brute Force Approach

The most straightforward approach is to maintain an array where each index stores either 0 (free) or the memory ID (allocated). For allocation, we scan from left to right looking for `size` consecutive zeros. For freeing, we scan the entire array and set any element with the target ID to 0.

**Why this is inefficient:**

- Allocation is O(n × size) in worst case because for each starting position, we check up to `size` elements
- Freeing is O(n) which is acceptable, but allocation can be very slow
- The main issue is repeatedly scanning the same memory locations when checking for consecutive free blocks

<div class="code-group">

```python
# Brute Force Solution - Too Slow for Large Inputs
class MemoryAllocatorBruteForce:
    def __init__(self, n: int):
        self.memory = [0] * n  # 0 means free

    def allocate(self, size: int, mID: int) -> int:
        n = len(self.memory)

        # Try every possible starting position
        for start in range(n - size + 1):
            # Check if all 'size' positions are free
            all_free = True
            for i in range(size):
                if self.memory[start + i] != 0:
                    all_free = False
                    break

            if all_free:
                # Allocate the block
                for i in range(size):
                    self.memory[start + i] = mID
                return start

        return -1

    def free(self, mID: int) -> int:
        count = 0
        for i in range(len(self.memory)):
            if self.memory[i] == mID:
                self.memory[i] = 0
                count += 1
        return count
```

```javascript
// Brute Force Solution - Too Slow for Large Inputs
class MemoryAllocatorBruteForce {
  constructor(n) {
    this.memory = new Array(n).fill(0); // 0 means free
  }

  allocate(size, mID) {
    const n = this.memory.length;

    // Try every possible starting position
    for (let start = 0; start <= n - size; start++) {
      // Check if all 'size' positions are free
      let allFree = true;
      for (let i = 0; i < size; i++) {
        if (this.memory[start + i] !== 0) {
          allFree = false;
          break;
        }
      }

      if (allFree) {
        // Allocate the block
        for (let i = 0; i < size; i++) {
          this.memory[start + i] = mID;
        }
        return start;
      }
    }

    return -1;
  }

  free(mID) {
    let count = 0;
    for (let i = 0; i < this.memory.length; i++) {
      if (this.memory[i] === mID) {
        this.memory[i] = 0;
        count++;
      }
    }
    return count;
  }
}
```

```java
// Brute Force Solution - Too Slow for Large Inputs
class MemoryAllocatorBruteForce {
    private int[] memory;

    public MemoryAllocatorBruteForce(int n) {
        memory = new int[n];  // 0 means free
    }

    public int allocate(int size, int mID) {
        int n = memory.length;

        // Try every possible starting position
        for (int start = 0; start <= n - size; start++) {
            // Check if all 'size' positions are free
            boolean allFree = true;
            for (int i = 0; i < size; i++) {
                if (memory[start + i] != 0) {
                    allFree = false;
                    break;
                }
            }

            if (allFree) {
                // Allocate the block
                for (int i = 0; i < size; i++) {
                    memory[start + i] = mID;
                }
                return start;
            }
        }

        return -1;
    }

    public int free(int mID) {
        int count = 0;
        for (int i = 0; i < memory.length; i++) {
            if (memory[i] == mID) {
                memory[i] = 0;
                count++;
            }
        }
        return count;
    }
}
```

</div>

## Optimized Approach

The key insight is that we don't need to scan `size` elements for every possible starting position. Instead, we can track the **longest consecutive free blocks** as we scan. Here's the optimized strategy:

1. **Allocation:** Scan the memory array once. Maintain a counter of consecutive free cells. When we find `size` consecutive free cells, allocate them and return the starting index.

2. **Freeing:** Still O(n) scan to find all cells with the target ID, but this is acceptable since freeing doesn't need to be faster than O(n).

**Why this is better:**

- Allocation becomes O(n) instead of O(n × size)
- We only scan each element once during allocation
- Simple to implement with clear logic

**Optimization details:**

- Start with `freeCount = 0` to track consecutive free cells
- When we see a free cell, increment `freeCount`
- When we see an allocated cell, reset `freeCount = 0`
- If `freeCount == size`, we found our block at position `currentIndex - size + 1`

## Optimal Solution

Here's the optimized implementation with single-pass allocation:

<div class="code-group">

```python
# Optimal Solution - Single Pass Allocation
# Time: O(n) for allocate, O(n) for free
# Space: O(n) for the memory array
class Allocator:
    def __init__(self, n: int):
        # Initialize memory array with all zeros (free)
        self.memory = [0] * n

    def allocate(self, size: int, mID: int) -> int:
        free_count = 0  # Track consecutive free memory units

        # Scan through memory to find first block of 'size' consecutive free units
        for i in range(len(self.memory)):
            if self.memory[i] == 0:
                # Found a free unit, increment consecutive free count
                free_count += 1
            else:
                # Found an allocated unit, reset consecutive free count
                free_count = 0

            # Check if we've found enough consecutive free units
            if free_count == size:
                # Calculate starting index of the block
                start_index = i - size + 1

                # Allocate the block by setting each unit to mID
                for j in range(start_index, i + 1):
                    self.memory[j] = mID

                return start_index

        # No block of required size found
        return -1

    def free(self, mID: int) -> int:
        freed_count = 0

        # Scan entire memory and free all units with the given mID
        for i in range(len(self.memory)):
            if self.memory[i] == mID:
                self.memory[i] = 0  # Mark as free
                freed_count += 1

        return freed_count
```

```javascript
// Optimal Solution - Single Pass Allocation
// Time: O(n) for allocate, O(n) for free
// Space: O(n) for the memory array
class Allocator {
  constructor(n) {
    // Initialize memory array with all zeros (free)
    this.memory = new Array(n).fill(0);
  }

  allocate(size, mID) {
    let freeCount = 0; // Track consecutive free memory units

    // Scan through memory to find first block of 'size' consecutive free units
    for (let i = 0; i < this.memory.length; i++) {
      if (this.memory[i] === 0) {
        // Found a free unit, increment consecutive free count
        freeCount++;
      } else {
        // Found an allocated unit, reset consecutive free count
        freeCount = 0;
      }

      // Check if we've found enough consecutive free units
      if (freeCount === size) {
        // Calculate starting index of the block
        const startIndex = i - size + 1;

        // Allocate the block by setting each unit to mID
        for (let j = startIndex; j <= i; j++) {
          this.memory[j] = mID;
        }

        return startIndex;
      }
    }

    // No block of required size found
    return -1;
  }

  free(mID) {
    let freedCount = 0;

    // Scan entire memory and free all units with the given mID
    for (let i = 0; i < this.memory.length; i++) {
      if (this.memory[i] === mID) {
        this.memory[i] = 0; // Mark as free
        freedCount++;
      }
    }

    return freedCount;
  }
}
```

```java
// Optimal Solution - Single Pass Allocation
// Time: O(n) for allocate, O(n) for free
// Space: O(n) for the memory array
class Allocator {
    private int[] memory;

    public Allocator(int n) {
        // Initialize memory array with all zeros (free)
        memory = new int[n];
    }

    public int allocate(int size, int mID) {
        int freeCount = 0;  // Track consecutive free memory units

        // Scan through memory to find first block of 'size' consecutive free units
        for (int i = 0; i < memory.length; i++) {
            if (memory[i] == 0) {
                // Found a free unit, increment consecutive free count
                freeCount++;
            } else {
                // Found an allocated unit, reset consecutive free count
                freeCount = 0;
            }

            // Check if we've found enough consecutive free units
            if (freeCount == size) {
                // Calculate starting index of the block
                int startIndex = i - size + 1;

                // Allocate the block by setting each unit to mID
                for (int j = startIndex; j <= i; j++) {
                    memory[j] = mID;
                }

                return startIndex;
            }
        }

        // No block of required size found
        return -1;
    }

    public int free(int mID) {
        int freedCount = 0;

        // Scan entire memory and free all units with the given mID
        for (int i = 0; i < memory.length; i++) {
            if (memory[i] == mID) {
                memory[i] = 0;  // Mark as free
                freedCount++;
            }
        }

        return freedCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `allocate(size, mID)`: O(n) where n is the total memory size. We scan the array once, and when we find a suitable block, we allocate it in O(size) time, but size ≤ n, so overall O(n).
- `free(mID)`: O(n) since we scan the entire array to find and free all units with the given ID.

**Space Complexity:**

- O(n) for storing the memory array where each index tracks whether it's free or which ID owns it.

**Why this is optimal:**

- Any solution must at least examine the memory array to find free blocks, so Ω(n) is a lower bound for allocation
- Our solution achieves this lower bound with a simple single-pass algorithm
- The freeing operation also achieves the obvious lower bound of Ω(n) since we need to examine each element to find all with the target ID

## Common Mistakes

1. **Off-by-one errors in allocation:** When you find `size` consecutive free cells ending at index `i`, the starting index is `i - size + 1`, not `i - size`. For example, if you find 3 free cells ending at index 5, they occupy indices 3, 4, 5, so starting index is 5 - 3 + 1 = 3.

2. **Not resetting freeCount properly:** When you encounter an allocated cell, you must reset `freeCount = 0`, not `freeCount = 1`. The consecutive free sequence is broken, so you start counting from 0 again.

3. **Forgetting to handle the case when size > n:** While the problem constraints might prevent this, robust code should handle it. Our solution handles it naturally since we'll never find `size` consecutive free cells if `size > n`.

4. **Inefficient allocation search:** Some candidates try to optimize by jumping ahead when they find an allocated cell, but this can cause them to miss valid blocks. For example, with memory `[F, F, A, F, F, F]` and `size = 3`, jumping from index 2 (A) to index 3 would miss the block at indices 3-5. Our linear scan is both correct and optimal.

## When You'll See This Pattern

This problem uses the **consecutive elements tracking** pattern, which appears in various forms:

1. **Maximum Consecutive Ones** (LeetCode 485): Find the maximum number of consecutive 1s in a binary array. Similar tracking of consecutive elements.

2. **Longest Substring Without Repeating Characters** (LeetCode 3): While more complex, it uses a similar idea of tracking a "window" of valid elements.

3. **Minimum Size Subarray Sum** (LeetCode 209): Find the minimal length of a contiguous subarray whose sum ≥ target. Uses a sliding window approach similar to our consecutive free block search.

The core pattern is maintaining a counter or window that expands/contracts based on certain conditions as you scan through an array.

## Key Takeaways

1. **When searching for consecutive elements satisfying a condition**, maintain a running counter that resets when the condition is violated and check when it reaches your target size.

2. **Simple linear scans can often be optimal** for problems where you need to examine all elements anyway. Don't overcomplicate with advanced data structures unless necessary.

3. **For simulation/design problems**, focus on correctness first, then optimize. The brute force approach helps understand the problem before optimizing.

[Practice this problem on CodeJeet](/problem/design-memory-allocator)
