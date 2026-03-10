---
title: "How to Solve Building H2O — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Building H2O. Medium difficulty, 58.4% acceptance rate. Topics: Concurrency."
date: "2027-10-07"
category: "dsa-patterns"
tags: ["building-h2o", "concurrency", "medium"]
---

# How to Solve Building H2O

This problem asks you to synchronize two types of threads (oxygen and hydrogen) so they form water molecules (H₂O) in the correct ratio: two hydrogen threads for every oxygen thread. The challenge is coordinating these threads to release their outputs in the proper sequence without deadlocks or race conditions.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have the following sequence of threads arriving:

1. Hydrogen thread H1 arrives
2. Hydrogen thread H2 arrives
3. Oxygen thread O1 arrives
4. Hydrogen thread H3 arrives
5. Oxygen thread O2 arrives

A correct execution would form two water molecules:

- H1, H2, and O1 form the first molecule (output: HHO or HOH or OHH)
- H3, O2, and a future hydrogen thread would form the second molecule

The synchronization challenge is ensuring that:

1. Exactly 2 hydrogen threads proceed for every 1 oxygen thread
2. Threads wait until a complete molecule is ready before any of them proceed
3. No thread gets stuck waiting forever (no deadlock)

Think of it like a bouncer at a club who only lets groups of exactly 2 men (hydrogen) and 1 woman (oxygen) enter together. If only 1 man and 1 woman show up, they wait. If 2 men show up but no woman, they wait. Only when the complete group is present can they all enter.

## Brute Force Approach

In concurrency problems, a "brute force" approach might involve busy waiting or inefficient synchronization. A naive candidate might try:

1. Use a simple counter for hydrogen and oxygen
2. When a hydrogen thread arrives, increment hydrogen counter
3. When an oxygen thread arrives, increment oxygen counter
4. Check if we have at least 2 hydrogen and 1 oxygen
5. If yes, decrement counters and proceed

The problem with this approach is **race conditions**. Multiple threads might read and modify counters simultaneously, leading to incorrect counts. Even with locks, we need careful coordination to ensure threads wait properly and don't proceed prematurely.

A more sophisticated but still problematic approach might use `while` loops with conditions:

```python
# Problematic approach - prone to deadlocks
class H2O:
    def __init__(self):
        self.h_count = 0
        self.o_count = 0
        self.lock = threading.Lock()

    def hydrogen(self):
        with self.lock:
            self.h_count += 1
            # Wait until we have 2H and 1O
            while self.h_count < 2 or self.o_count < 1:
                pass  # Busy waiting - terrible!
            # Form molecule
            self.h_count -= 2
            self.o_count -= 1
        releaseHydrogen()
```

This has multiple issues:

- **Busy waiting** wastes CPU cycles
- **Deadlock risk** if threads don't wake up properly
- **No guarantee** that the right threads proceed together

## Optimized Approach

The key insight is to use **semaphores** or **barriers** to coordinate the threads. Semaphores are perfect for this problem because:

1. They allow threads to wait until a condition is met
2. They can be used to limit how many threads of each type proceed
3. They provide efficient waiting (not busy waiting)

The optimal approach uses:

- **Two semaphores for hydrogen**: One to control access, another to signal when to proceed
- **One semaphore for oxygen**: To control when oxygen can proceed
- **A mutex lock**: To protect shared state updates
- **Counters**: To track how many hydrogen threads have arrived

The synchronization logic:

1. When a hydrogen thread arrives, it increments the hydrogen counter
2. If we now have 2 hydrogen threads waiting, we signal the oxygen semaphore
3. Hydrogen threads wait on their own semaphore until the oxygen thread signals them
4. When an oxygen thread arrives, it waits until signaled by 2 hydrogen threads
5. Once all three threads are ready, the oxygen thread signals both hydrogen threads to proceed

This creates a handshake mechanism where hydrogen threads "invite" oxygen when they have a pair, and oxygen "releases" the hydrogen pair when it's ready.

## Optimal Solution

Here's the complete solution using semaphores for synchronization:

<div class="code-group">

```python
import threading

class H2O:
    def __init__(self):
        # Semaphore for hydrogen - allows up to 2 threads
        self.h_sem = threading.Semaphore(2)
        # Semaphore for oxygen - allows up to 1 thread
        self.o_sem = threading.Semaphore(1)
        # Barrier to synchronize all three threads
        self.barrier = threading.Barrier(3)
        # Mutex lock for shared variables
        self.lock = threading.Lock()
        # Counter for hydrogen threads in current molecule
        self.h_count = 0

    def hydrogen(self, releaseHydrogen: 'Callable[[], None]') -> None:
        # Acquire hydrogen semaphore - only 2 can proceed at once
        self.h_sem.acquire()

        with self.lock:
            self.h_count += 1

        # Wait at the barrier for all three threads
        self.barrier.wait()

        # releaseHydrogen() outputs "H". Do not change or remove this line.
        releaseHydrogen()

        # After releasing hydrogen, check if we need to reset
        with self.lock:
            self.h_count -= 1
            # If this was the second hydrogen, reset semaphores for next molecule
            if self.h_count == 0:
                self.h_sem.release(2)  # Allow 2 new hydrogen threads
                self.o_sem.release()   # Allow 1 new oxygen thread

    def oxygen(self, releaseOxygen: 'Callable[[], None]') -> None:
        # Acquire oxygen semaphore - only 1 can proceed at once
        self.o_sem.acquire()

        # Wait at the barrier for all three threads
        self.barrier.wait()

        # releaseOxygen() outputs "O". Do not change or remove this line.
        releaseOxygen()

        # Oxygen doesn't need to reset semaphores - hydrogen handles it
        # This ensures proper sequencing
```

```javascript
class H2O {
  constructor() {
    // Semaphore for hydrogen - allows 2 threads
    this.hSem = 2;
    // Semaphore for oxygen - allows 1 thread
    this.oSem = 1;
    // Count of hydrogen threads in current molecule
    this.hCount = 0;
    // Mutex for protecting shared state
    this.mutex = Promise.resolve();
    // Promise-based barrier for synchronization
    this.barrier = {
      count: 0,
      resolve: null,
      promise: null,
    };
    this._resetBarrier();
  }

  _resetBarrier() {
    this.barrier.count = 0;
    this.barrier.promise = new Promise((resolve) => {
      this.barrier.resolve = resolve;
    });
  }

  async hydrogen(releaseHydrogen) {
    // Wait for hydrogen semaphore
    while (this.hSem <= 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    this.hSem--;

    // Update hydrogen count atomically
    let releaseMutex;
    this.mutex = this.mutex.then(() => {
      this.hCount++;
      return new Promise((resolve) => {
        releaseMutex = resolve;
      });
    });
    await this.mutex;
    releaseMutex();

    // Wait at barrier
    this.barrier.count++;
    if (this.barrier.count === 3) {
      this.barrier.resolve();
    }
    await this.barrier.promise;

    // Release hydrogen
    releaseHydrogen();

    // Update state after release
    this.mutex = this.mutex.then(() => {
      this.hCount--;
      // If molecule complete, reset for next one
      if (this.hCount === 0) {
        this.hSem += 2;
        this.oSem += 1;
        this._resetBarrier();
      }
      return Promise.resolve();
    });
    await this.mutex;
  }

  async oxygen(releaseOxygen) {
    // Wait for oxygen semaphore
    while (this.oSem <= 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    this.oSem--;

    // Wait at barrier
    this.barrier.count++;
    if (this.barrier.count === 3) {
      this.barrier.resolve();
    }
    await this.barrier.promise;

    // Release oxygen
    releaseOxygen();

    // Oxygen doesn't reset semaphores - hydrogen handles it
  }
}
```

```java
import java.util.concurrent.*;

class H2O {
    private Semaphore hSem, oSem;
    private CyclicBarrier barrier;
    private int hCount;
    private final Object lock = new Object();

    public H2O() {
        // Semaphore for hydrogen with 2 permits
        hSem = new Semaphore(2, true);
        // Semaphore for oxygen with 1 permit
        oSem = new Semaphore(1, true);
        // Barrier for 3 threads (2H + 1O)
        barrier = new CyclicBarrier(3);
        hCount = 0;
    }

    public void hydrogen(Runnable releaseHydrogen) throws InterruptedException {
        // Acquire hydrogen permit
        hSem.acquire();

        // Update hydrogen count atomically
        synchronized (lock) {
            hCount++;
        }

        try {
            // Wait at barrier for all threads
            barrier.await();
        } catch (BrokenBarrierException e) {
            e.printStackTrace();
        }

        // releaseHydrogen.run() outputs "H". Do not change or remove this line.
        releaseHydrogen.run();

        // Update state after releasing
        synchronized (lock) {
            hCount--;
            // If molecule complete, reset for next one
            if (hCount == 0) {
                hSem.release(2);  // Release 2 permits for next hydrogen threads
                oSem.release();   // Release 1 permit for next oxygen thread
            }
        }
    }

    public void oxygen(Runnable releaseOxygen) throws InterruptedException {
        // Acquire oxygen permit
        oSem.acquire();

        try {
            // Wait at barrier for all threads
            barrier.await();
        } catch (BrokenBarrierException e) {
            e.printStackTrace();
        }

        // releaseOxygen.run() outputs "O". Do not change or remove this line.
        releaseOxygen.run();

        // Oxygen doesn't reset semaphores - hydrogen handles it
        // This ensures proper sequencing
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) per thread operation

- Each thread performs a constant number of semaphore operations and barrier waits
- The barrier synchronization is O(1) for each thread
- No loops or iterations depend on input size

**Space Complexity:** O(1) additional space

- We use a fixed number of semaphores, a barrier, and a few integer counters
- Memory usage doesn't grow with the number of threads
- Each data structure uses constant space

The key insight is that while we may have many threads, the synchronization primitives themselves use constant space, and each thread's operations are constant time.

## Common Mistakes

1. **Not protecting shared state with locks**: When multiple threads read/write `h_count` simultaneously without synchronization, you get race conditions. Always use mutex locks when modifying shared variables.

2. **Using busy waiting instead of proper synchronization**: Code like `while not ready: pass` wastes CPU and may never exit if the condition isn't properly signaled. Use semaphores, barriers, or condition variables instead.

3. **Forgetting to reset semaphores after forming a molecule**: If you don't release the semaphore permits after completing a molecule, subsequent threads will deadlock waiting for permits that never become available.

4. **Letting oxygen reset the semaphores instead of hydrogen**: This can cause race conditions where oxygen resets before hydrogen threads have finished. Let the last hydrogen thread (when count goes to 0) handle the reset.

5. **Not handling the barrier exception in Java**: `CyclicBarrier.await()` can throw `BrokenBarrierException` or `InterruptedException`. Candidates often forget to handle these.

## When You'll See This Pattern

This synchronization pattern appears in many producer-consumer and resource coordination problems:

1. **Print FooBar Alternately (LeetCode 1115)**: Similar coordination between two types of threads that need to alternate in a specific pattern.

2. **Print Zero Even Odd (LeetCode 1116)**: Coordinating three types of threads to print in a specific sequence (0, odd, 0, even, etc.).

3. **Traffic Light Controlled Intersection (LeetCode 1279)**: Coordinating multiple cars (threads) to safely pass through an intersection.

4. **Dining Philosophers (LeetCode 1226)**: Classic synchronization problem where multiple threads (philosophers) compete for shared resources (forks).

The common theme is **multiple threads needing to coordinate their execution according to specific rules or ratios**. The solution typically involves semaphores, barriers, or condition variables to enforce the coordination rules.

## Key Takeaways

1. **Semaphores are ideal for resource counting**: When you need to limit how many threads of a certain type can proceed, semaphores with permits are the perfect tool.

2. **Barriers synchronize groups of threads**: When multiple threads need to reach a common point before any proceed, barriers provide clean synchronization.

3. **Always protect shared state**: Any variable accessed by multiple threads needs proper synchronization (locks, atomic operations, etc.).

4. **Let the last thread reset state**: To avoid race conditions, have the last thread to finish a group operation handle resetting synchronization primitives.

This problem teaches elegant thread coordination using standard concurrency primitives. Mastering these patterns is essential for systems programming and high-performance computing roles.

[Practice this problem on CodeJeet](/problem/building-h2o)
