---
title: "How to Solve The Dining Philosophers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The Dining Philosophers. Medium difficulty, 54.2% acceptance rate. Topics: Concurrency."
date: "2028-06-10"
category: "dsa-patterns"
tags: ["the-dining-philosophers", "concurrency", "medium"]
---

# How to Solve The Dining Philosophers

The Dining Philosophers problem asks you to design a concurrent system where five philosophers alternate between thinking and eating, requiring both adjacent forks to eat. The core challenge is preventing deadlock (where all philosophers hold one fork and wait forever) while ensuring fairness and avoiding starvation. This is a classic synchronization problem that tests your understanding of concurrency primitives like mutexes and semaphores.

## Visual Walkthrough

Let's trace through what can go wrong. Imagine philosophers 0-4 sitting around a table, with fork 0 between philosophers 0 and 1, fork 1 between 1 and 2, and so on.

**Deadlock Scenario:**

1. Philosopher 0 picks up left fork (fork 0)
2. Philosopher 1 picks up left fork (fork 1)
3. Philosopher 2 picks up left fork (fork 2)
4. Philosopher 3 picks up left fork (fork 3)
5. Philosopher 4 picks up left fork (fork 4)

Now each philosopher has their left fork but cannot get their right fork (which is held by their neighbor as a left fork). All philosophers wait forever → deadlock.

**Key Insight:** We need to break the circular wait condition. One effective approach is to ensure at least one philosopher picks up forks in a different order, or to limit how many philosophers can try to eat simultaneously.

## Brute Force Approach

A naive approach might give each philosopher this logic:

1. Pick up left fork
2. Pick up right fork
3. Eat
4. Put down both forks

This leads directly to the deadlock scenario described above. The code would look like:

<div class="code-group">

```python
# BROKEN - Causes deadlock
import threading

class DiningPhilosophers:
    def __init__(self):
        self.forks = [threading.Lock() for _ in range(5)]

    def wantsToEat(self, philosopher, *actions):
        left = philosopher
        right = (philosopher + 1) % 5

        # Deadlock-prone approach
        self.forks[left].acquire()
        self.forks[right].acquire()

        # Eat
        actions[4]()  # eat function

        self.forks[right].release()
        self.forks[left].release()
```

```javascript
// BROKEN - Causes deadlock
class DiningPhilosophers {
  constructor() {
    this.forks = Array(5)
      .fill()
      .map(() => new Promise((resolve) => resolve())); // Simplified
  }

  async wantsToEat(philosopher, actions) {
    const left = philosopher;
    const right = (philosopher + 1) % 5;

    // Deadlock-prone approach
    await this.forks[left];
    await this.forks[right];

    // Eat
    actions[4](); // eat function

    // Release forks (simplified)
  }
}
```

```java
// BROKEN - Causes deadlock
class DiningPhilosophers {
    private Lock[] forks = new Lock[5];

    public DiningPhilosophers() {
        for (int i = 0; i < 5; i++) {
            forks[i] = new ReentrantLock();
        }
    }

    public void wantsToEat(int philosopher,
                           Runnable pickLeftFork,
                           Runnable pickRightFork,
                           Runnable eat,
                           Runnable putLeftFork,
                           Runnable putRightFork) throws InterruptedException {
        int left = philosopher;
        int right = (philosopher + 1) % 5;

        // Deadlock-prone approach
        forks[left].lock();
        forks[right].lock();

        // Eat
        eat.run();

        forks[right].unlock();
        forks[left].unlock();
    }
}
```

</div>

**Why this fails:** When all philosophers simultaneously pick up their left fork first, we get circular wait → deadlock. We need a strategy to prevent all philosophers from entering this waiting state simultaneously.

## Optimized Approach

The key insight is to **break the symmetry** in how philosophers pick up forks. There are several established solutions:

1. **Resource hierarchy solution:** Number the forks 0-4. Philosophers always pick up the lower-numbered fork first, then the higher-numbered fork. This breaks the circular wait because philosopher 4 will try to pick up fork 0 before fork 4 (since 0 < 4), while philosopher 0 picks up fork 0 before fork 1.

2. **Limiting concurrent eaters:** Use a semaphore to allow at most 4 philosophers to try to eat simultaneously. With 5 philosophers and 5 forks, if only 4 can try to eat, at least one will succeed in getting both forks.

3. **Chandy/Misra solution:** A more complex but elegant solution using request messages.

The **resource hierarchy** solution is clean and efficient. For philosopher i:

- If i ≠ 4: pick up left fork (i), then right fork ((i+1)%5)
- If i = 4: pick up right fork (0), then left fork (4)

This ensures philosopher 4 picks forks in reverse order, breaking the circular dependency.

## Optimal Solution

Here's the complete solution using the resource hierarchy approach:

<div class="code-group">

```python
import threading
from typing import Callable

# Time: O(1) per philosopher | Space: O(1) for synchronization primitives
class DiningPhilosophers:
    def __init__(self):
        # Create 5 forks (locks)
        self.forks = [threading.Lock() for _ in range(5)]

    def wantsToEat(self,
                   philosopher: int,
                   pickLeftFork: Callable[[], None],
                   pickRightFork: Callable[[], None],
                   eat: Callable[[], None],
                   putLeftFork: Callable[[], None],
                   putRightFork: Callable[[], None]) -> None:
        """
        philosopher: 0 to 4
        Each function parameter is a callback you need to call
        """
        # Determine left and right fork indices
        left_fork = philosopher
        right_fork = (philosopher + 1) % 5

        # Resource hierarchy solution: break circular wait
        # Philosopher 4 picks forks in reverse order
        if philosopher == 4:
            # Pick right fork first, then left fork
            self.forks[right_fork].acquire()
            pickRightFork()
            self.forks[left_fork].acquire()
            pickLeftFork()
        else:
            # All other philosophers pick left fork first, then right fork
            self.forks[left_fork].acquire()
            pickLeftFork()
            self.forks[right_fork].acquire()
            pickRightFork()

        # Now we have both forks - can eat
        eat()

        # Put down forks (order doesn't matter for releasing)
        putLeftFork()
        self.forks[left_fork].release()

        putRightFork()
        self.forks[right_fork].release()
```

```javascript
// Time: O(1) per philosopher | Space: O(1) for synchronization primitives
class DiningPhilosophers {
  constructor() {
    // Create 5 forks (mutexes using Promises as simple locks)
    this.forks = Array(5)
      .fill()
      .map(() => new Mutex());
  }

  async wantsToEat(philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork) {
    const left = philosopher;
    const right = (philosopher + 1) % 5;

    // Resource hierarchy solution
    if (philosopher === 4) {
      // Philosopher 4 picks right fork first
      await this.forks[right].acquire();
      pickRightFork();
      await this.forks[left].acquire();
      pickLeftFork();
    } else {
      // Others pick left fork first
      await this.forks[left].acquire();
      pickLeftFork();
      await this.forks[right].acquire();
      pickRightFork();
    }

    // Eat with both forks
    eat();

    // Release forks
    putLeftFork();
    this.forks[left].release();
    putRightFork();
    this.forks[right].release();
  }
}

// Simple Mutex implementation for JavaScript
class Mutex {
  constructor() {
    this._locked = false;
    this._queue = [];
  }

  acquire() {
    return new Promise((resolve) => {
      if (!this._locked) {
        this._locked = true;
        resolve();
      } else {
        this._queue.push(resolve);
      }
    });
  }

  release() {
    if (this._queue.length > 0) {
      const next = this._queue.shift();
      next();
    } else {
      this._locked = false;
    }
  }
}
```

```java
// Time: O(1) per philosopher | Space: O(1) for synchronization primitives
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class DiningPhilosophers {
    // Array of 5 fork locks
    private final Lock[] forks;

    public DiningPhilosophers() {
        forks = new Lock[5];
        for (int i = 0; i < 5; i++) {
            forks[i] = new ReentrantLock();
        }
    }

    // call the run() method of any runnable to execute its code
    public void wantsToEat(int philosopher,
                           Runnable pickLeftFork,
                           Runnable pickRightFork,
                           Runnable eat,
                           Runnable putLeftFork,
                           Runnable putRightFork) throws InterruptedException {

        int leftFork = philosopher;
        int rightFork = (philosopher + 1) % 5;

        // Resource hierarchy: break symmetry to prevent deadlock
        if (philosopher == 4) {
            // Philosopher 4 picks right fork first (fork 0), then left fork (fork 4)
            forks[rightFork].lock();
            pickRightFork.run();
            forks[leftFork].lock();
            pickLeftFork.run();
        } else {
            // All other philosophers pick left fork first, then right fork
            forks[leftFork].lock();
            pickLeftFork.run();
            forks[rightFork].lock();
            pickRightFork.run();
        }

        // Now has both forks - can eat
        eat.run();

        // Put down forks (order doesn't matter for unlocking)
        putLeftFork.run();
        forks[leftFork].unlock();

        putRightFork.run();
        forks[rightFork].unlock();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) per philosopher operation

- Each philosopher performs a constant number of lock operations (acquire and release)
- The eating and thinking operations are considered O(1) for analysis purposes

**Space Complexity:** O(1) for synchronization primitives

- We use 5 locks (one per fork), which is constant space
- No additional data structures that scale with input

**Why constant time/space:** There are always exactly 5 philosophers and 5 forks. The solution doesn't depend on variable input size.

## Common Mistakes

1. **Deadlock from symmetric fork acquisition:** The most common mistake is having all philosophers pick up left fork first. Always remember to break symmetry in concurrent resource allocation.

2. **Forgetting to release locks:** In concurrent programming, every lock acquisition must have a corresponding release. Missing a release() call will cause deadlock.

3. **Incorrect fork indexing:** The right fork for philosopher i is (i+1)%5, not i+1. For philosopher 4, the right fork is 0, not 5. Off-by-one errors here cause philosophers to try to access non-existent forks.

4. **Not calling the required callback functions:** The problem requires calling pickLeftFork(), pickRightFork(), eat(), putLeftFork(), and putRightFork() at appropriate times. Forgetting these calls will fail the test cases even if your synchronization is correct.

## When You'll See This Pattern

The Dining Philosophers teaches **resource allocation in concurrent systems** and **deadlock prevention strategies**. You'll see similar patterns in:

1. **Producer-Consumer Problem (LeetCode 1188):** Multiple threads sharing a bounded buffer, requiring synchronization for put and take operations.

2. **Print in Order (LeetCode 1114):** Coordinating multiple threads to execute in a specific sequence using semaphores or condition variables.

3. **Traffic Light Controlled Intersection (LeetCode 1279):** Managing concurrent access to shared resources (road segments) with fairness constraints.

4. **Design Bounded Blocking Queue (LeetCode 1188):** Implementing thread-safe data structures with capacity limits.

These problems all involve coordinating multiple threads accessing shared resources while maintaining correctness and avoiding deadlock.

## Key Takeaways

1. **Break symmetry to prevent deadlock:** When multiple processes compete for multiple resources in a circular dependency, introduce asymmetry (like different acquisition orders or resource numbering) to break the circular wait condition.

2. **The four necessary conditions for deadlock:** Mutual exclusion, hold and wait, no preemption, and circular wait. Remove any one to prevent deadlock. Our solution removes circular wait.

3. **Concurrency primitives are tools:** Mutexes (locks) provide mutual exclusion, semaphores can limit concurrent access, and condition variables allow waiting for state changes. Choose the right tool for your synchronization needs.

[Practice this problem on CodeJeet](/problem/the-dining-philosophers)
