import type { Quiz } from './types';

export default {
  id: 'concurrency-jvm',
  title: 'Concurrency & the JVM',
  track: 'java',
  description: 'Threads, executors, the memory model, locks, atomics, CompletableFuture, GC and class loading.',
  questions: [
    {
      q: 'What happens when you call `thread.run()` instead of `thread.start()`?',
      options: [
        'A new thread is created',
        'The code runs on the calling thread, with no new thread',
        '`IllegalThreadStateException`',
        'The thread starts but as a daemon',
      ],
      answer: 1,
      explain: 'Only `start()` creates a new thread of execution; `run()` is an ordinary method call.',
    },
    {
      q: 'Eight threads each run `counter++` 100,000 times on a shared `volatile int`. The final value is…',
      options: ['Always 800,000', 'Usually less than 800,000', 'Always more than 800,000', 'Exactly 100,000'],
      answer: 1,
      explain: '`volatile` gives visibility, not atomicity. `++` is read-modify-write, so updates are lost. Use `AtomicInteger` or a lock.',
    },
    {
      q: 'What does `volatile` guarantee?',
      options: [
        'Mutual exclusion',
        'Visibility of writes and ordering for that variable',
        'Atomicity of compound operations',
        'That the variable lives in main memory only and is never cached',
      ],
      answer: 1,
      explain: 'A volatile write happens-before every later read of that variable. It does not make `x++` or check-then-act atomic.',
    },
    {
      q: 'Why does double-checked locking need the instance field to be `volatile`?',
      options: [
        'To make `synchronized` faster',
        'To stop other threads seeing a partially constructed object',
        'Because static fields must be volatile',
        'To allow lazy class loading',
      ],
      answer: 1,
      explain: 'Without volatile, the reference write can be reordered before the constructor writes complete.',
    },
    {
      q: 'A `ThreadPoolExecutor` has core 4, max 16 and an unbounded `LinkedBlockingQueue`. How many threads will it ever run?',
      options: ['4', '16', 'Unlimited', 'It depends on the number of CPUs'],
      answer: 0,
      explain: 'Extra threads beyond the core size are only created when the queue is full — an unbounded queue is never full.',
    },
    {
      q: 'Which `ReentrantLock` feature does `synchronized` lack?',
      options: ['Reentrancy', 'Memory visibility guarantees', '`tryLock` with a timeout', 'Mutual exclusion'],
      answer: 2,
      explain: '`ReentrantLock` adds tryLock, interruptible locking, fairness and multiple conditions; both are reentrant and give visibility.',
    },
    {
      q: 'Which is the classic way to prevent deadlock between two locks?',
      options: [
        'Make both locks `volatile`',
        'Always acquire the locks in the same global order',
        'Use `Thread.yield()` between acquisitions',
        'Increase the thread priority',
      ],
      answer: 1,
      explain: 'Consistent lock ordering breaks the circular-wait condition. `tryLock` with timeouts is another option.',
    },
    {
      q: 'You need N threads to wait for each other at the end of each phase, repeatedly. Which synchroniser fits?',
      options: ['`CountDownLatch`', '`CyclicBarrier`', '`Semaphore`', '`Exchanger`'],
      answer: 1,
      explain: '`CyclicBarrier` is a reusable rendezvous. `CountDownLatch` is one-shot.',
    },
    {
      q: 'Your function returns a `CompletableFuture<User>`. Which method chains it without nesting futures?',
      options: ['`thenApply`', '`thenCompose`', '`thenAccept`', '`thenRun`'],
      answer: 1,
      explain: '`thenCompose` is flatMap; `thenApply` would produce `CompletableFuture<CompletableFuture<User>>`.',
    },
    {
      q: 'Where do `supplyAsync(supplier)` tasks run if you pass no executor?',
      options: ['A new platform thread per task', '`ForkJoinPool.commonPool()`', 'The calling thread', 'A virtual thread per task'],
      answer: 1,
      explain: 'The common pool is shared JVM-wide and sized for CPU work — pass a dedicated executor for blocking I/O.',
    },
    {
      q: 'Which statement about virtual threads (Java 21) is correct?',
      options: [
        'They make CPU-bound code faster',
        'You should pool them like platform threads',
        'A virtual thread blocked on I/O unmounts and frees its carrier thread',
        'They can’t use `ThreadLocal`',
      ],
      answer: 2,
      explain: 'That unmounting is what makes millions of blocking virtual threads cheap. They improve I/O throughput, not CPU speed, and should not be pooled.',
    },
    {
      q: 'Where are objects created with `new` allocated?',
      options: ['On the thread stack', 'On the heap', 'In Metaspace', 'In the code cache'],
      answer: 1,
      explain: 'Objects live on the heap; the stack holds local primitives and references (escape analysis may optimise some allocations away).',
    },
    {
      q: 'How does the GC decide an object is garbage?',
      options: [
        'Its reference count drops to zero',
        'It isn’t reachable from any GC root',
        'It hasn’t been accessed for a while',
        'Its `finalize()` returned true',
      ],
      answer: 1,
      explain: 'Java GCs trace reachability from roots (stacks, statics, JNI), so unreachable cycles are collected too.',
    },
    {
      q: 'Which collector targets sub-millisecond pauses largely independent of heap size?',
      options: ['Serial', 'Parallel', 'G1', 'ZGC'],
      answer: 3,
      explain: 'ZGC (generational since Java 21) relocates objects concurrently with the application.',
    },
    {
      q: 'What replaced PermGen in Java 8?',
      options: ['The young generation', 'Metaspace in native memory', 'The code cache', 'The string pool'],
      answer: 1,
      explain: 'Class metadata moved to Metaspace, which grows dynamically (cap it with `-XX:MaxMetaspaceSize`).',
    },
    {
      q: 'What does `String.class.getClassLoader()` return?',
      options: ['The application class loader', 'The platform class loader', '`null` — the bootstrap loader', 'A `URLClassLoader`'],
      answer: 2,
      explain: 'Core classes are loaded by the bootstrap loader, which is represented as `null` in Java.',
    },
  ],
} satisfies Quiz;
