import type { Quiz } from './types';

export default {
  id: 'java-core',
  title: 'Core Java & OOP',
  track: 'java',
  description: 'Strings, equality, inheritance, exceptions, generics and initialization order.',
  questions: [
    {
      q: 'What does this print?',
      code: `String a = "java";
String b = new String("java");
System.out.println((a == b) + " " + a.equals(b));`,
      options: ['`true true`', '`false true`', '`true false`', '`false false`'],
      answer: 1,
      explain: '`new String` creates a distinct heap object, so `==` (reference comparison) is false, while `equals` compares characters.',
    },
    {
      q: 'What does this print?',
      code: `Integer x = 127, y = 127;
Integer p = 128, q = 128;
System.out.println((x == y) + " " + (p == q));`,
      options: ['`true true`', '`false false`', '`true false`', '`false true`'],
      answer: 2,
      explain: 'Autoboxing uses `Integer.valueOf`, which caches -128..127. 128 creates two separate objects, so `==` is false. Always use `equals` for boxed values.',
    },
    {
      q: 'Java passes object arguments to methods…',
      options: ['by reference', 'by value — the value is a copy of the reference', 'by value — the whole object is copied', 'by reference for mutable objects, by value for immutable ones'],
      answer: 1,
      explain: 'Java is always pass-by-value. For objects the copied value is the reference, so methods can mutate the object but reassigning the parameter has no effect on the caller.',
    },
    {
      q: 'Which statement about method overloading is true?',
      options: [
        'The JVM chooses the overload at runtime based on the argument’s actual class',
        'The compiler chooses the overload based on the static (declared) types of the arguments',
        'Overloads may differ only by return type',
        'Overloaded methods must be in the same class',
      ],
      answer: 1,
      explain: 'Overload resolution happens at compile time using declared types. Overriding is the one resolved at runtime.',
    },
    {
      q: 'You override `equals` but not `hashCode`. What is the most likely symptom?',
      options: [
        'A compile error',
        '`HashSet.contains` returns false for an equal object',
        '`TreeSet` throws `ClassCastException`',
        '`equals` stops being symmetric',
      ],
      answer: 1,
      explain: 'Equal objects get different identity hash codes, so hash-based collections look in the wrong bucket.',
    },
    {
      q: 'Which of these exceptions is checked?',
      options: ['`IllegalArgumentException`', '`NullPointerException`', '`IOException`', '`ArithmeticException`'],
      answer: 2,
      explain: '`IOException` extends `Exception` but not `RuntimeException`, so it must be caught or declared. The others are unchecked.',
    },
    {
      q: 'What does this method return?',
      code: `static int f() {
    try { return 1; }
    finally { return 2; }
}`,
      options: ['`1`', '`2`', 'It doesn’t compile', 'It throws an exception'],
      answer: 1,
      explain: 'A `return` in `finally` overrides the earlier return value (and would also swallow any exception) — which is why you should never return from `finally`.',
    },
    {
      q: 'In try-with-resources, if both the try body and `close()` throw, what happens?',
      options: [
        'The `close()` exception propagates and the body’s is lost',
        'The body’s exception propagates; the `close()` exception is added as suppressed',
        'Both are wrapped in a new exception',
        'Only the first resource is closed',
      ],
      answer: 1,
      explain: 'The primary exception wins and close failures are available via `getSuppressed()`.',
    },
    {
      q: 'What is printed by `new Child()`?',
      code: `class Parent {
    Parent() { show(); }
    void show() { System.out.println("parent"); }
}
class Child extends Parent {
    String name = "child";
    @Override void show() { System.out.println(name); }
}`,
      options: ['`parent`', '`child`', '`null`', 'Nothing — it throws NullPointerException'],
      answer: 2,
      explain: 'The parent constructor runs before the child’s field initialisers, so the overridden `show()` sees `name == null`. Never call overridable methods from constructors.',
    },
    {
      q: 'Which declaration accepts a `List<Integer>`, a `List<Double>` and a `List<Number>` for reading numbers?',
      options: ['`List<Number>`', '`List<? super Number>`', '`List<? extends Number>`', '`List<Object>`'],
      answer: 2,
      explain: 'Generics are invariant, so `List<Number>` won’t accept `List<Integer>`. A producer you read from uses `? extends` (PECS).',
    },
    {
      q: 'Which is NOT a consequence of type erasure?',
      options: ['You cannot write `new T()`', 'You cannot use `instanceof List<String>`', 'You cannot declare a generic method', 'Two overloads `m(List<String>)` and `m(List<Integer>)` clash'],
      answer: 2,
      explain: 'Generic methods are perfectly legal. The other three are restrictions caused by erasing type arguments at runtime.',
    },
    {
      q: 'Which keyword prevents a class from being subclassed?',
      options: ['`static`', '`final`', '`abstract`', '`private`'],
      answer: 1,
      explain: '`final` classes such as `String` and all records cannot be extended.',
    },
    {
      q: 'A class implements two interfaces that both declare the same `default` method. What must it do?',
      options: [
        'Nothing — the first interface listed wins',
        'Override the method (optionally delegating with `A.super.m()`)',
        'It can’t implement both interfaces',
        'Mark the method `final`',
      ],
      answer: 1,
      explain: 'Unless a superclass method or a more specific interface resolves it, the compiler forces the class to override and pick an implementation.',
    },
    {
      q: 'Why should you build a long string in a loop with `StringBuilder` instead of `+=`?',
      options: [
        '`+=` is not allowed on strings inside loops',
        'Each `+=` creates a new String, giving quadratic copying',
        '`StringBuilder` is thread-safe',
        '`+=` doesn’t compile to bytecode',
      ],
      answer: 1,
      explain: 'Strings are immutable, so every concatenation copies all previous characters. `StringBuilder` appends in place (and is not thread-safe).',
    },
    {
      q: 'Which comparator is safe for any `int` values?',
      options: ['`(a, b) -> a - b`', '`(a, b) -> a > b ? 1 : 0`', '`Integer::compare`', '`(a, b) -> a.hashCode() - b.hashCode()`'],
      answer: 2,
      explain: 'Subtraction overflows for large or negative values, and option B never returns a negative number. `Integer.compare` is correct.',
    },
  ],
} satisfies Quiz;
