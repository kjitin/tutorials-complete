import type { Quiz } from './types';

export default {
  id: 'modern-java',
  title: 'Modern Java (17–21)',
  track: 'java',
  description: 'Records, sealed types, pattern matching, switch expressions, var, text blocks and sequenced collections.',
  questions: [
    {
      q: 'Which method does the compiler NOT generate for `record Point(int x, int y) {}`?',
      options: ['`x()`', '`equals(Object)`', '`setX(int)`', '`toString()`'],
      answer: 2,
      explain: 'Record fields are final; there are no setters. Accessors are named after the components.',
    },
    {
      q: 'What does this print?',
      code: `record Point(int x, int y) {}
System.out.println(new Point(1, 2).equals(new Point(1, 2)));`,
      options: ['`true`', '`false`', 'Compile error', 'Depends on the JVM'],
      answer: 0,
      explain: 'Records generate value-based `equals` and `hashCode` from all components.',
    },
    {
      q: 'Which of these can a record declare?',
      options: ['An extra instance field', 'A superclass via `extends`', 'A static factory method', 'A non-final component field'],
      answer: 2,
      explain: 'Records may have static members, instance methods and implement interfaces — but no extra instance fields or superclass.',
    },
    {
      q: 'A record has a `List<String>` component. How do you make it effectively immutable?',
      options: [
        'Mark the component `final`',
        'Copy it in the compact constructor with `List.copyOf`',
        'Records are always deeply immutable',
        'Annotate it with `@Immutable`',
      ],
      answer: 1,
      explain: 'Records are only shallowly immutable — defensively copy mutable components.',
    },
    {
      q: 'Each permitted subclass of a sealed class must be declared…',
      options: ['`abstract`', '`final`, `sealed` or `non-sealed`', '`static`', '`public`'],
      answer: 1,
      explain: 'Every permitted subtype must state how the hierarchy continues. Records are implicitly final.',
    },
    {
      q: 'Why does this switch need no `default` branch?',
      code: `sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double s) implements Shape {}

double area(Shape sh) {
    return switch (sh) {
        case Circle c -> Math.PI * c.r() * c.r();
        case Square s -> s.s() * s.s();
    };
}`,
      options: [
        'Switch expressions never need a default',
        'The compiler knows Circle and Square are the only possible Shapes',
        'Records can’t be null',
        'It actually fails to compile',
      ],
      answer: 1,
      explain: 'Sealed hierarchies make pattern switches exhaustive; adding a new permitted type makes this stop compiling.',
    },
    {
      q: 'What does a pattern-matching switch do with a null selector when there is no `case null`?',
      options: ['Takes the default branch', 'Throws `NullPointerException`', 'Returns null', 'Matches the first case'],
      answer: 1,
      explain: 'Add `case null ->` (or `case null, default ->`) to handle it explicitly.',
    },
    {
      q: 'Which keyword returns a value from a block inside a switch expression?',
      options: ['`return`', '`break`', '`yield`', '`case`'],
      answer: 2,
      explain: '`yield` produces the value of a switch-expression block; `return` would return from the enclosing method.',
    },
    {
      q: 'Which line compiles?',
      options: ['`var x;`', '`var y = null;`', '`var list = new ArrayList<String>();`', '`private var field = 1;`'],
      answer: 2,
      explain: '`var` needs an initialiser with a known type and works only for local variables.',
    },
    {
      q: 'Inside a text block, what does a backslash at the end of a line do?',
      options: ['Inserts a literal backslash', 'Joins the line with the next one — no newline', 'Inserts a tab', 'Ends the text block'],
      answer: 1,
      explain: 'The line-continuation escape is handy for long SQL strings; `\\s` keeps a trailing space.',
    },
    {
      q: 'What does this print?',
      code: `Object o = 42;
if (o instanceof Integer i && i > 40) {
    System.out.println(i + 1);
}`,
      options: ['`42`', '`43`', 'Nothing', 'Compile error'],
      answer: 1,
      explain: 'Pattern matching for instanceof binds `i` where the match is definitely true, including the right side of `&&`.',
    },
    {
      q: 'Which Java 21 API returns the last element of a `LinkedHashSet` directly?',
      options: ['`set.last()`', '`set.getLast()`', '`set.tail()`', '`set.peekLast()`'],
      answer: 1,
      explain: 'Sequenced collections add `getFirst`, `getLast`, `addFirst`, `addLast`, `removeFirst`, `removeLast` and `reversed()`.',
    },
    {
      q: 'What is wrong with `case CharSequence cs ->` appearing before `case String s ->`?',
      options: [
        'Nothing',
        'It’s a compile error — the String case is dominated and unreachable',
        'The String case runs first anyway',
        'It throws `MatchException` at runtime',
      ],
      answer: 1,
      explain: 'More specific patterns must come before more general ones (dominance).',
    },
    {
      q: 'Which Java version made virtual threads a final (non-preview) feature?',
      options: ['17', '19', '21', '25'],
      answer: 2,
      explain: 'Virtual threads previewed in 19 and 20 and became final in Java 21 (JEP 444).',
    },
  ],
} satisfies Quiz;
