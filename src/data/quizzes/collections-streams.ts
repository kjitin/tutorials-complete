import type { Quiz } from './types';

export default {
  id: 'collections-streams',
  title: 'Collections & Streams',
  track: 'java',
  description: 'HashMap internals, choosing collections, iterators, lambdas, streams and collectors.',
  questions: [
    {
      q: 'In Java 8+, when does a HashMap bucket turn into a red-black tree?',
      options: [
        'When the map exceeds 64 entries',
        'When a bucket holds 8+ nodes and the table has at least 64 buckets',
        'When the load factor exceeds 0.75',
        'Never — buckets are always linked lists',
      ],
      answer: 1,
      explain: 'TREEIFY_THRESHOLD is 8 and MIN_TREEIFY_CAPACITY is 64; with a smaller table, HashMap resizes instead.',
    },
    {
      q: 'A HashMap has the default capacity and load factor. At what size does it first resize?',
      options: ['When it holds more than 8 entries', 'When it holds more than 12 entries', 'When it holds more than 16 entries', 'When it holds more than 32 entries'],
      answer: 1,
      explain: 'Threshold = capacity × load factor = 16 × 0.75 = 12.',
    },
    {
      q: 'What does this throw?',
      code: `List<String> list = new ArrayList<>(List.of("a", "b", "c"));
for (String s : list) {
    if (s.equals("a")) list.remove(s);
}`,
      options: ['Nothing', '`ConcurrentModificationException`', '`UnsupportedOperationException`', '`IndexOutOfBoundsException`'],
      answer: 1,
      explain: 'Structural modification during for-each iteration trips the fail-fast iterator. Use `removeIf` or `Iterator.remove()`.',
    },
    {
      q: 'What happens here?',
      code: `List<Integer> nums = List.of(1, 2, 3);
nums.add(4);`,
      options: ['The list becomes [1, 2, 3, 4]', '`UnsupportedOperationException`', 'Compile error', '`ConcurrentModificationException`'],
      answer: 1,
      explain: '`List.of` returns an immutable list; mutators throw at runtime.',
    },
    {
      q: 'Which collection keeps keys sorted and supports `floorKey` / `ceilingKey`?',
      options: ['`HashMap`', '`LinkedHashMap`', '`TreeMap`', '`EnumMap`'],
      answer: 2,
      explain: '`TreeMap` is a red-black tree implementing `NavigableMap`, with O(log n) operations.',
    },
    {
      q: 'What is the best general-purpose choice for a FIFO queue or a stack?',
      options: ['`Stack`', '`LinkedList`', '`ArrayDeque`', '`Vector`'],
      answer: 2,
      explain: '`ArrayDeque` is faster than `LinkedList` and `Stack` (which is synchronized and legacy).',
    },
    {
      q: 'Which `LinkedHashMap` constructor argument enables LRU-style ordering?',
      options: ['`initialCapacity`', '`loadFactor`', '`accessOrder = true`', '`removeEldest = true`'],
      answer: 2,
      explain: 'With access order, `get` moves an entry to the end; override `removeEldestEntry` to evict.',
    },
    {
      q: 'What does this print?',
      code: `Stream.of("a", "bb", "ccc")
      .peek(s -> System.out.print(s + " "))
      .filter(s -> s.length() > 1)
      .findFirst();`,
      options: ['`a bb ccc `', '`a bb `', '`bb `', 'Nothing'],
      answer: 1,
      explain: 'Streams are lazy and process elements one at a time. `findFirst` short-circuits after "bb" passes the filter, so "ccc" is never peeked.',
    },
    {
      q: 'What does this print?',
      code: `Stream.of("a", "b").map(String::toUpperCase);
System.out.println("done");`,
      options: ['`A B done`', '`done`', '`A\\nB\\ndone`', 'Compile error'],
      answer: 1,
      explain: 'Without a terminal operation, intermediate operations never execute.',
    },
    {
      q: 'Which operation turns `Stream<List<String>>` into `Stream<String>`?',
      options: ['`map(List::stream)`', '`flatMap(List::stream)`', '`collect(toList())`', '`reduce(List::addAll)`'],
      answer: 1,
      explain: '`map` would give `Stream<Stream<String>>`; `flatMap` flattens.',
    },
    {
      q: 'What happens when `Collectors.toMap(Person::city, Person::name)` meets two people in the same city?',
      options: ['The later value wins', 'The earlier value wins', '`IllegalStateException: Duplicate key`', 'Values are concatenated'],
      answer: 2,
      explain: 'Without a merge function `toMap` throws on duplicate keys. Pass one, e.g. `(a, b) -> a + "," + b`.',
    },
    {
      q: 'Which collector builds `Map<Boolean, List<T>>` that always contains both keys?',
      options: ['`groupingBy(predicate)`', '`partitioningBy(predicate)`', '`toMap(predicate, identity())`', '`teeing`'],
      answer: 1,
      explain: '`partitioningBy` always has `true` and `false` entries; `groupingBy` only creates keys that occur.',
    },
    {
      q: 'Why does this fail to compile?',
      code: `int count = 0;
list.forEach(x -> count++);`,
      options: [
        '`forEach` can’t take a lambda',
        'Lambdas can only capture effectively final local variables',
        '`count` must be declared `volatile`',
        'Lambdas can’t contain the `++` operator',
      ],
      answer: 1,
      explain: 'Captured locals must not be reassigned. Use `list.size()`, a stream `count()`, or an `AtomicInteger`.',
    },
    {
      q: 'What is the difference between `orElse(x)` and `orElseGet(() -> x)` on an Optional with a value?',
      options: [
        'No difference',
        '`orElse` still evaluates its argument; `orElseGet` does not call the supplier',
        '`orElseGet` throws if a value is present',
        '`orElse` returns the default even when a value is present',
      ],
      answer: 1,
      explain: 'Arguments are evaluated before a method is called, so an expensive default passed to `orElse` always runs.',
    },
    {
      q: 'Which is a poor use of a parallel stream?',
      options: [
        'Summing a 50-million-element `int[]`',
        'Calling a slow REST API for each element',
        'Computing primes over `IntStream.range(0, 10_000_000)`',
        'Mapping a large `ArrayList` with a pure CPU-bound function',
      ],
      answer: 1,
      explain: 'Blocking I/O on the shared common ForkJoinPool starves the whole JVM. Use virtual threads or a dedicated executor for I/O fan-out.',
    },
    {
      q: '`String::compareToIgnoreCase` is used as a `Comparator<String>`. What kind of method reference is it?',
      options: ['Static', 'Bound instance', 'Unbound instance (arbitrary object of the type)', 'Constructor'],
      answer: 2,
      explain: 'The first lambda parameter becomes the receiver: `(a, b) -> a.compareToIgnoreCase(b)`.',
    },
  ],
} satisfies Quiz;
