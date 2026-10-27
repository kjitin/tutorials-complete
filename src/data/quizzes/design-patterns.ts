import type { Quiz } from './types';

export default {
  id: 'design-patterns',
  title: 'Design Patterns & SOLID',
  track: 'design-patterns',
  description: 'SOLID and the Gang of Four patterns — intent, structure, trade-offs and real-world usage.',
  questions: [
    {
      q: 'Which Singleton implementation is safe against reflection and serialization by default?',
      options: ['Double-checked locking', 'Enum singleton', 'Holder idiom', 'Synchronized `getInstance()`'],
      answer: 1,
      explain: 'The JVM guarantees enum constants are instantiated once and cannot be created reflectively or by deserialisation.',
    },
    {
      q: 'What does this print?',
      code: `enum S { INSTANCE; }
System.out.println(S.INSTANCE == S.valueOf("INSTANCE"));`,
      options: ['`true`', '`false`', 'Compile error', 'Throws at runtime'],
      answer: 0,
      explain: '`valueOf` returns the existing constant — there is only one.',
    },
    {
      q: 'You need to create families of related objects (AWS storage + AWS queue) that must be used together. Which pattern?',
      options: ['Factory Method', 'Abstract Factory', 'Builder', 'Prototype'],
      answer: 1,
      explain: 'An abstract factory has one method per product and guarantees products come from the same family.',
    },
    {
      q: 'Which pattern best replaces a constructor with eight parameters, several optional?',
      options: ['Prototype', 'Builder', 'Adapter', 'Flyweight'],
      answer: 1,
      explain: 'A builder gives readable, validated construction of an immutable result.',
    },
    {
      q: '`new BufferedReader(new InputStreamReader(new FileInputStream(f)))` is an example of…',
      options: ['Adapter only', 'Decorator (with an adapter in the chain)', 'Composite', 'Facade'],
      answer: 1,
      explain: 'Each wrapper adds behaviour around the same abstraction. `InputStreamReader` also adapts bytes to characters.',
    },
    {
      q: '`Arrays.asList(array)` letting an array be used as a `List` is an example of…',
      options: ['Decorator', 'Proxy', 'Adapter', 'Bridge'],
      answer: 2,
      explain: 'It converts one interface (an array) into another the client expects (`List`).',
    },
    {
      q: 'How does Spring implement `@Transactional`?',
      options: ['Template Method', 'Proxy', 'Observer', 'Memento'],
      answer: 1,
      explain: 'A proxy intercepts calls and wraps them in begin/commit/rollback — which is also why self-invocation bypasses it.',
    },
    {
      q: 'Which pattern lets clients treat a single file and a whole directory tree uniformly?',
      options: ['Iterator', 'Composite', 'Visitor', 'Chain of Responsibility'],
      answer: 1,
      explain: 'Leaves and composites share one interface; composites delegate to their children recursively.',
    },
    {
      q: 'Why is `Integer a = 127, b = 127; a == b` true?',
      options: [
        'Autoboxing compares values',
        '`Integer.valueOf` returns shared cached instances — a flyweight',
        'The JIT inlines the constants',
        'Integers are interned like strings',
      ],
      answer: 1,
      explain: 'Values -128..127 are cached flyweights. For 128 you get two objects, so always use `equals`.',
    },
    {
      q: 'JDBC — one API with interchangeable vendor drivers — is the textbook example of…',
      options: ['Facade', 'Bridge', 'Mediator', 'Singleton'],
      answer: 1,
      explain: 'The `java.sql` abstraction and the driver implementations vary independently.',
    },
    {
      q: 'Spring Security’s filter chain is an example of…',
      options: ['Observer', 'Chain of Responsibility', 'State', 'Strategy'],
      answer: 1,
      explain: 'Each filter handles the request, passes it on, or stops the chain (e.g. returning 401).',
    },
    {
      q: 'In which pattern do the objects themselves decide the next object to switch to?',
      options: ['Strategy', 'State', 'Command', 'Template Method'],
      answer: 1,
      explain: 'States trigger transitions; with Strategy the client chooses the algorithm.',
    },
    {
      q: 'Which pattern naturally supports undo/redo by turning requests into objects?',
      options: ['Command', 'Observer', 'Iterator', 'Facade'],
      answer: 0,
      explain: 'Commands can be stored, re-executed and reversed — often combined with Memento snapshots.',
    },
    {
      q: '`JdbcTemplate.query(sql, rowMapper)` follows which pattern?',
      options: ['Template Method (callback style)', 'Builder', 'Abstract Factory', 'Prototype'],
      answer: 0,
      explain: 'The fixed algorithm (connection, statement, iteration, cleanup, exception translation) calls your supplied step.',
    },
    {
      q: 'Java 21 sealed interfaces with exhaustive pattern-matching switches are a modern alternative to…',
      options: ['Singleton', 'Visitor', 'Decorator', 'Facade'],
      answer: 1,
      explain: 'They give type-safe dispatch over a closed hierarchy without `accept`/`visit` boilerplate.',
    },
    {
      q: '`Square extends Rectangle` where `setWidth` also changes the height violates which principle?',
      options: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation'],
      answer: 2,
      explain: 'Code written for `Rectangle` breaks when given a `Square`, so it isn’t substitutable.',
    },
    {
      q: 'A `Robot` class forced to implement `eat()` from a `Worker` interface signals a violation of…',
      options: ['Dependency Inversion', 'Interface Segregation', 'Single Responsibility', 'Liskov Substitution only'],
      answer: 1,
      explain: 'Split fat interfaces into role interfaces such as `Workable` and `Feedable`.',
    },
    {
      q: 'Spring injecting every `PaymentStrategy` bean into a `Map` and choosing one at runtime applies which pattern and principle?',
      options: ['Observer + SRP', 'Strategy + Open/Closed', 'Factory + LSP', 'Proxy + ISP'],
      answer: 1,
      explain: 'New payment methods are new classes; the service never changes.',
    },
  ],
} satisfies Quiz;
