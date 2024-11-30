const questions = [
    {
        question: "using System;\n                    \npublic class Foo\n{\n    public override string ToString() { return \"0\"; }\n    public static implicit operator string(Foo f) { return \"1\"; }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Foo f = new Foo();\n        Console.Write(f);\n        Console.Write($\"{f}\");\n        Console.Write(f + \"\");\n        Console.Write((object)f);\n    }\n}",
        answer: "1010",
        explanation: "The class <code>Foo</code> defines 2 members - a <code>ToString()</code> method and an implicit conversion to string. The question is about which of the these is preferred in different cases.<br><br>In the first case, the implicit conversion is preferred because <code>Console.Write()</code> has an overload that takes a string. There also happens to be an overload taking <code>object</code>, but when resolving function overloads, the overload with the most specific types (string) is chosen.<br><br>In the second case, we are using string interpolation. String interpolation works with any object, and has a few rules for how the conversion is done. If we pass a custom formatter, that is used. Next, if the type implements <code>IFormattable</code>, that is used. Finally, we fall back to the <code>ToString()</code> method, which is guaranteed to exist for any object.<br><br>In the third case, the implicit conversion is used again. There is no addition operator between <code>Foo</code> and string, so the only thing the language can do to resolve this is cast one side to string.<br><br>In the final case, we explicitly cast to object. Now the operand exactly matches the overload of <code>Console.Write()</code> that takes an <code>object</code>. The only way to convert any <code>object</code> to a string is via its <code>ToString()</code> method.",
        hint: "In .NET, all objects have a <code>ToString()</code> method. String interpolation works with any type.",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUAAkKOJJL1QGZ8N8AxAe3rwG89jL96A3AUzDACWcHtUwAGfABV6AZWCCoAcwAUASnzNqAdnwAiMboDc+AL5siHVJgBs+AQFsADgBsBAYwHBOjvgENg9GCiYsoM9PgAZuqaqDq6mEameGa45FQ0Vlos5oQY6DkaBcRhkfgAvPhQPADudIxqhkVEAML0UADO9M48AHQA6oLAPMpRjQSk+K0dXb0DnsMAJLrMESa6qmMTk22d3f2DwxH4iHrrmxNTu7MHysr0AEYAVjxuwKqjBSkmQA"
    },
    {
        question: "using System;\n\npublic class Foo&lt;T&gt; { }\n\npublic static class FooExt\n{\n    public static void Bar(this Foo&lt;int&gt; foo) { Console.Write(\"0\"); }\n    public static void Bar&lt;T&gt;(this Foo&lt;T&gt; foo) { Console.Write(\"1\"); }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Foo&lt;int&gt; f = new Foo&lt;int&gt;();\n        f.Bar();\n        Baz(f);\n    }\n        \n    public static void Baz&lt;T&gt;(Foo&lt;T&gt; f)\n    {\n        f.Bar();\n    }\n}",
        answer: "01",
        explanation: "<code>FooExt</code> defines 2 overloaded extension methods on <code>Foo&lt;T&gt;</code>. The question is about which overload is chosen in 2 different cases. Extension method overloads are resolved entirely at compile time, and the resolution algorithm always prefers the overload with the most concrete/specific type. <br><br>In the first case, we know at compile time that we have <code>Foo&lt;int&gt;</code>. <code>Foo&lt;int&gt;</code> is more specific than <code>Foo&lt;T&gt;</code>, so we pick that corresponding overload.<br><br>In the second case, looking at the body of <code>Baz</code>, the only information the function has at compile time is that the input is of type <code>Foo&lt;T&gt;</code>, so there is only one possible choice of overload. In C#, generics are a feature of the runtime - they are not monomorphized.",
        hint: "Resolution of overloaded extension methods is done entirely at compile time.",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINiAxAe0oB4AVAPmIG9iBfPAk1TANlPQVqAUQAewPMzwBIIqT6kALMQBCAQzAAKYAAsAlgGchtPVGBMAZtQCULYgGFKUA5QA2AUwB0AdTB7g7poARAAMQdYA3Owycjz8qMrqYPQM2vpGVLSMxFaUtqyOzm5evv6BQZjhURy4NVwC8gDsktIx6OgyUrjS0pk0puY5xAC8xFDuAO7G/WapkTLSFp5JmvPd0uoAXpoWa9I1PTHcCgmqapspmn3Zu50LSyt7NWxAA"
    },
    {
        question: "using System;\nusing System.Runtime.InteropServices;\n                    \npublic class Program\n{\n    public struct Empty { }\n    public struct OneByte { byte a; }\n    \n    public static int Size(object obj)\n    {\n        return Marshal.SizeOf(obj);\n    }\n    \n    public static void Main()\n    {\n        Console.Write(Marshal.SizeOf&lt;Empty&gt;());\n        Console.Write(Marshal.SizeOf&lt;OneByte&gt;());\n        Console.Write(Size(new OneByte()));\n    }\n}",
        answer: "111",
        explanation: "In this question, we query the size in bytes of a few different objects.<br><br>In the first case, the size is 1 byte, because .NET has no zero-sized types, and 1 is the minimum.<br><br>In the second case, the size is again 1 byte, because the contains 1 byte, which meets the minimum size.<br><br>In the final case, the size is also 1 byte. Casting to object doesn't erase the type information, it just boxes the struct. <code>Marshal.TypeOf(object)</code> uses the runtime type information of the boxed struct to return the correct size. You can read more about boxing <a href=\"https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/types/boxing-and-unboxing\">on MSDN.</a>",
        hint: "In .NET, all objects implement a <code>GetType()</code> method. Also, there are no zero-sized types.",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUKgBgAJVMA6AJWmAEsBbAUzIEkpgGwB7ABwGUOAbjQDGDAM4BuPAEhZsvKgDMJdCUwB2PAG9pMjOhlaZ0gMKcoYzgBsmAdTA12ACjE0AXg04AzJzTYBKfylcWTMLazsHZwBZAEMwMQALWKsyXncGAHkvAB4/YAA+J0Dg+RDTc0sbMntHBhcM7ycAI05rEuMwqsi6pziE5NT0j2yc1usijvLOyoiaqPrXDybhZLAp0Nnq2pj4pJS0jNHV+MmgmQBfPAugA==="
    },
    {
        question: "using System;\n\npublic struct FooStruct\n{\n    private int count;\n    public int Increment =&gt; ++count;\n}\n\npublic class FooClass\n{\n    private int count;\n    public int Increment =&gt; ++count;\n}\n\npublic class Program\n{\n    public static readonly FooStruct a = new();\n    public static FooStruct b = new();\n    \n    public static readonly FooClass c = new();\n    public static FooClass d = new();\n\n    public static void Main()\n    {\n        Console.Write(a.Increment);\n        Console.Write(a.Increment);\n        \n        Console.Write(b.Increment);\n        Console.Write(b.Increment);\n        \n        Console.Write(c.Increment);\n        Console.Write(c.Increment);\n        \n        Console.Write(d.Increment);\n        Console.Write(d.Increment);\n    }\n}",
        answer: "11121212",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAIBnYSAY2GIDEB7egZQomrwG89ifiAHMAEsAbgENgAU2KCoNSvWjAA3N15Fps4gEkolMBIC2EzQF4AfMUSJ5ilbgC+eAiQx1GAYQA2o0qU6qeARFxKRk5BVk7XmJ1MO1dfSNTCysbSLxHfFx1V1RMAHZ/XGiczAA2Yn1ROHooTwBPN2ZWamJRYhNiKAkAdwAKAEootRdyppYqGgAjDq7eweGePABIUoqqmrrGhnovH1JiSlnu/qGAmNGKnb3fYjhj+bOskvR0c65i6N53WtJ6TwkADoAOpCSR9USAnR6QzGYBPL7fX7/IGgwTgyHQxJwp7LZbnaI/KB/AEgsESPpTKEJWGyBGI4hEkmo8mU6kwpLwux4lbLJkosnoimUdnYumLL780lo8EirG0rm83lSllCvpwUUK+mIlWC8Ea+Wc7XETL2IA="
    },
    {
        question: "using System;\n\npublic struct Foo\n{\n    public int num;\n    public void Set() { num = 1; }\n}\n\npublic class Program\n{\n    public static void Bar(in Foo f)\n    {\n        f.Set();\n        Console.Write(f.num);\n    }\n    \n    public static void Baz(Foo f)\n    {\n        f.Set();\n        Console.Write(f.num);\n    }\n\n    static void Main()\n    {\n        Foo bar = new Foo();\n        Bar(bar);\n        Baz(bar);\n    }\n}",
        answer: "01",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAIBnYSAY2GIDEB7evAbz2PeKOIEsoaoIAWwDcbDl1QAWYgGUApsAAUASmLNiAwcQC8xTMOIBfPMfy4J6TpgDsLMewmYAbJ2kAhAIZhFvOo2IAZsr2aiEcgQB08krKorjh4QDC9FCk9AA2chEA6mDcwHKKARGasSGm4SGOLlLEngBeigz0gcHxHKztCZHRKnHd7MmpGVm5+YXFpf0cplXOrsQAsh68KiGdA34tAEZeOhpyAO5bfWEcnt67YGVdCQ2KVzfhpoZAA"
    },
    {
        question: "using System;\n\npublic struct Foo\n{\n    public Foo()\n    {\n        Console.Write(\"0\");\n    }\n}\n\npublic class Program\n{\n    public static Foo bar;\n    public static Foo baz = new Foo();\n\n    public static void Main()\n    {\n        Foo bom = new Foo();\n    }\n}",
        answer: "0",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAIBnYSAY2GIDEB7evAbz2PeKLsYAoBKNh1a4Oo4gGF6UUvQA2AUwB0AdTABLYPJ4AiAAza+AbkHsAvnnP5cXDJ0wB2Fic4lUmAGzd6xAEYBDMGMRDhsPL18/AC9iAF5iKHkAdy9+IOcMdGdhMQ4Gbx96AFtY+KSUo2dLUyA==="
    },
    {
        question: "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string foo = null;\n        if (foo is string bar) Console.Write(\"0\");\n        if (foo is string) Console.Write(\"1\");\n        if (foo is null) Console.Write(\"2\");\n        if (foo is var baz) Console.Write(\"3\");\n    }\n}",
        answer: "23",
        explanation: "In this question we pattern match on a null-valued string with 4 different patterns.<br><br>The first 2 patterns do not match, as pattern matching on a speficic type always inserts an implicit null-check. <br><br>The third pattern matches because foo is, in fact, null. <br><br>The final pattern also matches, because <code>var</code> patterns are special and match any value, including null. <code>var</code> patterns are not super useful in isolation, but can be combined with other patterns, like so:<br><pre><code class=\"language-csharp\"><br>public struct Foo<br>{<br>    public string bar;<br>}<br><br>static void Main()<br>{<br>    var foo = new Foo();<br>    if (foo is Foo { bar: var boo })<br>    {<br>        ...<br>    }<br>}<br></code></pre>",
        hint: "Pattern matching on a <b>specific</b> type inserts an implicit null-check.",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINTMB2PAbz2PtPXTodtwY/IAZiAzAe37EAvMSgQANhIDcLTsQCWvYgAoBQhQGduxAEYBDMAEpiAYX5RN/CQFMAdAHUwC4DZUAiLu6Oz28xcpqgoraqJhcJuaW1vZOLm7umN6+/gGq6iFikhKRFla2js6uHujJcpxK6cFaxABuhnr6AF650QVxxe6EZX70AL54fUA="
    },
    {
        question: "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string foo = null;\n        if (foo is string) Console.Write(\"0\");\n        if (foo is not string or null) Console.Write(\"1\");\n        if (foo is not string and null) Console.Write(\"2\");\n        if (foo is string or null) Console.Write(\"3\");\n    }\n}",
        answer: "123",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINTMB2PAbz2PtPXTwEhbcHPyAGYgMwD2A4gF5iUCABtJAblYsAln2IAKQcIUBnHgEpiAYQFRNAyQFMAdAHUwC4GZUAibo51zcLRcrVDiW8QLAPMQCYOJSknqGxqaWNnYOjpiu7p5Kqup+2lCBwQCGUHDh0lFGJubWtvZO6Cny6T4a2qiYvKHFkQZlsZUJToR1HAwAvnjDQA=="
    },
    {
        question: "using System;\n                    \npublic class Program\n{\n    interface IFoo\n    {\n        void Bar(int a = 1);\n    }\n    \n    public class Baz : IFoo\n    {\n        public void Bar(int a = 2) { Console.Write(a); }\n    }\n    \n    public static void Main()\n    {\n        new Baz().Bar();\n    }\n}",
        answer: "2",
        explanation: "Default parameter values on interfaces are bit special. They are not enforced on implementors, so the only time they are relevant is when you are calling a method directly on an interface type, like so:<br><pre><code><br>IFoo foo = new Baz();<br>foo.Bar(); // Prints 1<br></code></pre>",
        hint: "Think about what would happen if we were implementing multiple interfaces that define the same method, but with different default parameters.",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUASEML1QGYACDSzAdjwG898BLKYAUzADMBDAY3bkAkgDEA9mKaMC+VABZyAIR5gAFK2Dke5ALzlMASgDc+JgF8mTMpXRKeAL3Ihh4yQWmFr8u2o1bd5OgG5PTkAMJiUADOYgA27AB0AOpgzByqPMbkFgQ5pgQY6FJM+FDsAO529qoGCcpqxuZ4ZkA==="
    },
    {
        question: "using System;\n                    \npublic class Program\n{\n    struct Foo : IDisposable\n    {\n        public int id;\n        \n        public void Dispose()\n        {\n            if (this.id != 0)\n            {\n                Console.Write(\"0\");\n            }\n            this.id = 0;\n        }\n    }\n    \n    public static void Main()\n    {\n        var baz = new Foo();\n        baz.id = 1;\n        \n        using (var boo = ((IDisposable)baz))\n        {\n            Console.Write(((Foo)boo).id);\n        }\n        Console.Write(baz.id);\n    }\n}",
        answer: "101",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUASEML1QGYACDSzAdjwG898BnYSAY2HIDEB7X8iHIBJACIBLZgAdezAIYAjADYBTJowL4y5cVC7i4Abib4T21ABZyE6bJUAKAJQmNRcQDNy94AAtJAOgNyAEIAXnIABmdNfFciAGFeKGZeVX8AdTBxYAcAIgjcx2MYgF8TfF8AoPCI4sIyggbTAgx0dRMANzkwcgU5AC9ycKgVAHcefic6/D7+wLgh8kxpswivLp6FfkX7ezFJGXllFUdZx2jCOPxE5NSVDKyc3fs+XlP+R3mikybrpJS0plsg5Zl86g0SkA"
    },
    {
        question: "using System;\nusing System;\n\nclass Program\n{\n    public static bool GetNum(bool useDecimal, out object val)\n    {\n        if (useDecimal)\n        {\n            val = 1M;\n            return true;\n        }\n        else\n        {\n            val = 2;\n            return false;\n        }\n    }\n    \n    public static void Main()\n    {\n        try\n        {\n            object result;\n            bool isDecimal = GetNum(true, out result);\n            decimal amount = (decimal)(isDecimal ? result : 0);\n            Console.Write(amount);\n            \n            isDecimal = GetNum(false, out result);\n            amount = (decimal)(isDecimal ? result : 0);\n            Console.Write(amount);\n        }\n        catch\n        {\n            Console.Write(\"3\");\n        }\n    }\n}",
        answer: "13",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUHjAAlUwHY8BvPASFQGZjMA2QgIwHt2AbQgcQFNgAOQgBbABQduhCAGd+AEX4BjAJaiAhlxiF2EYLtYArFQYBuWgJQ0quatVUAzQuLmKV6qzWq371CzwAvISYALIA3N60pITAkPyRdtQAvt78XPLevvYBhMHoiX6oMY5a8oUpNKl2eIR1xOjotfXZcQCeWVHsxqaEYPyyEFzAFdRSPKqySmqaQXyCIhJxEPw6egb9g8OWo3Aes4QaonpQBsHiezNW4pPTnjwA/H0DQwYghAAMO1EAwuxQsm4/AAdAB1MCqYD8cRHE7Ab5JahRW77LR5ebCMTiUoZVa6fTPLbw0aw6BnFyXe6WG5TVGPQmvQjvL6jP4AoFgiFQmHHMkI+zVezKDTAZQAC06iLZgK4IPBkOhACI6IqdkiktV6oRqskgA=="
    },
    {
        question: "using System;\n\npublic interface Up&lt;U&gt;\n{\n    void Bar(U i);\n    void Bar(int i);\n}\n\npublic interface Down&lt;U&gt;\n{\n    void Bar(int i);\n    void Bar(U i);\n}\n\npublic class Foo : Up&lt;int&gt;, Down&lt;int&gt; \n{\n    void Up&lt;int&gt;.Bar(int i) { Console.Write(\"0\"); }\n    void Down&lt;int&gt;.Bar(int i) { Console.Write(\"1\"); }\n    public void Bar(int i) { Console.Write(\"2\"); }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Foo foo = new Foo();\n        ((Up&lt;int&gt;)foo).Bar(0);\n        ((Down&lt;int&gt;)foo).Bar(0);\n    }\n}",
        answer: "21",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAIBLKYAUzADMBDAY0uIFUAHAHhYD48BvPMSHFUAFmIAhOmAAULMgEoA3IOFjJ0meWCKVuAL54CJbdXpNiAEQD2AdyhdeuAbmEjxU2dt2qh6z3I+Bka4RCLoxABi1tbEIKyc2twwVnYOScT8vu4JHEkAdAHepArEfMQAwtZQAM7WADaU+QDqYKRUMgBEAAydysSGrmriNvZ5FNyFmsWl5VW1DU2t7ZRdmH1KA9lh/tMUimWV1XWNLW0dnegbW8H4oRGomADsWUN+mABsOQCydOQyCmyLjcbmisRoMWIAF5iFBKLYojEAXoQcIZHJEhMFBDrAoprJuspsm50aN0licXiAoSUcJBvogA="
    },
    {
        question: "using System;\n\npublic class Foo&lt;T&gt;\n{\n    public void Bar() { Console.Write(\"0\"); }\n}\n\npublic static class FooExt\n{\n    public static void Bar&lt;T&gt;(this Foo&lt;T&gt; foo) { Console.Write(\"1\"); }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Foo&lt;int&gt; f = new Foo&lt;int&gt;();\n        f.Bar();\n    }\n}",
        answer: "0",
        explanation: "The question is asking which method is preferred if you have an extension method and inherent method that are equally good choices. In this case, the inherent method is preferred, as it is considered more specific. <br><br>Eric Lippert describes the behavior by describing a <a href=\"https://ericlippert.com/2013/12/23/closer-is-better/\">\"closeness\" heuristic</a>.",
        hint: "The various mechanisms in C# that resolve ambiguity tend to prefer the most specific/concrete choice.",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINiAxAe0oB4AVAPjwG89j3STUAWYgIQCGYABQBKYs2IBhSlADOlADYBTAHQB1MAEtgy4QCIADPtEBuYgF88V/LiKlMANlLoK1AKIAPYCzYd7qE6kvIJg9AzCwAAWWnJutIzEAGbU4pIy8kpqmjp6+pgm5jY2BFyugQDsLACQfuwY6HUSTRzxNFpQwAzJxAC8xFDKAO5tHV1ipi0cSaqhE03FQA==="
    },
    {
        question: "using System;\n\npublic struct Foo : IDisposable\n{\n    public int a;\n    \n    public void Dispose()\n    {\n        a++;\n    }\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var foo = new Foo();\n        \n        using (var bar = foo)\n        {\n            using (var baz = bar)\n            {\n                Console.Write(baz.a);\n            }\n            Console.Write(bar.a);\n        }\n        Console.Write(foo.a);\n    }\n}",
        answer: "000",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAIBnYSAY2GIDEB7e4kYgSQBEBLUgB3tICGAIwA2AUzwBvPAEgixTlBoCA3LNnzUAFmJde/MQAoAlLOm4ZMgYkRqLAXzyP8uDMVSYA7FLzE/7zAA2dx0AWQFFE19/c3844gA3ATBiADNGYgBeYigxAHc6RhM7eP9ZOQAGYkMklKFkrLTGUwsZc0tK6trieoAvRvqwFo72joBheihSenEAOgB1ME5gIz7ZgWM7Dudxyem5xeXV5PXN8p2ZCamZsQWllcN0+lOS/2d7IA"
    },
    {
        question: "using System;\nusing System.Collections;\n\npublic class Foo : IEnumerable\n{\n    IEnumerator IEnumerable.GetEnumerator()\n    {\n        return new int[] { 0 }.GetEnumerator();\n    }\n\n    public IEnumerator GetEnumerator()\n    {\n        return new int[] { 1 }.GetEnumerator();\n    }\n}\n\npublic class Program\n{	\n    public static void Main()\n    {\n        foreach (var f in new Foo())\n            Console.Write(f);\n        \n        foreach (var f in (IEnumerable)new Foo())\n            Console.Write(f);\n    }\n}",
        answer: "10",
        explanation: "The class <code>Foo</code> implements the interface <code>IEnumerable</code> with 2 methods - 1 implicit implementation and 1 explicit implementation. The reason these 2 mechanisms of implementing interfaces exist, is to handle cases where multiple interfaces define the same members. You can either have 1 implicit implementation binding to multiple interfaces, or several explicit implementations binding to each their interface. In this case, we only have 1 interface, but C# still allows us to implement it with both mechanisms. The implementations will just overlap.<br><br>The next important piece of information is that <code>foreach</code> uses <a href=\"https://im5tu.io/article/2022/01/things-you-might-not-know-about-csharp-duck-typing/\">duck typing</a>. In other words, the <code>foreach</code> construct doesn't care that our type implements <code>IEnumerable</code>, it's completely irrelevant. All it requires is a method called <code>GetEnumerator</code> which returns an <code>IEnumerator</code>.<br><br>The question thus boils down to this: Which of 2 the implementations is preferred in these 2 cases:<br><pre><code><br>(new Foo()).GetEnumerator()<br>((IEnumerable)new Foo()).GetEnumerator()<br></code></pre><br>In the first case, we choose the implicit implementation as it is considered more specific (or \"closer\" <a href=\"https://ericlippert.com/2013/12/23/closer-is-better/\">in the words of Eric Lippert</a>) - we are talking about the concrete <code>Foo</code> type after all. <br><br>In the second case, there is only 1 possible choice, as neither of the implementations are virtual. We've thrown away the type of <code>Foo</code> for the purposes of compile time analysis, and only have an <code>IEnumerable</code>. The call is thus resolved to the explicit implementation at compile time.",
        hint: "In C#, the <code>foreach</code> construct is duck-typed, and doesn't care about which interfaces the operand implements.",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUKgBgAJVMA6AYQHsAbGgUwGNgBLKqAZwG489UBmEuiIAxKlSIgSmfngDeeIkqIBJAKJQIAW3pgAhsCphp/MgHF6wDdt0GjACgCUi5QtzKPJAOxEo9AO5ELFDAANoAukRyRMQAvuaW1jr6hmBOPO7KsbyZSgKqSbapRBZWmsl2ac65US6e3r4BQSERUUSYRPGlhSkOjhke2bhDfIIY0l7yAJB1QuizbvVKAGZG9HqMABZE9gBuesbLzY2BYlRO1Uue1Jy09GQA6mAswPT2y/2zHl/Kq2DrWx2+0Ox3spH4jj8p3EFx+9RuHDuj2er3enxqQ1iQA=="
    },
    {
        question: "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string x = new string(new char[0]);\n        string y = new string(new char[0]);\n        if (object.ReferenceEquals(x, y))\n            Console.Write(1);\n        else\n            Console.Write(0);\n    }\n}",
        answer: "1",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINTMB2PAbzwEgN17bc6HMAGYgD2IF5iUAKYB3chwAUwsQGMAFgEMwAbQ4BdAJQBueuy4BPfoNHipJ+UtWadrOgEsAZsQkB7AEYArITOAA6AEpCDkJgQlAyQgCiAI4QCgA2AM4S3DDE+hoaunQAwi5QiS7xQr4A6mB2wEISmNq6QklC2XkFRSXlldUcdawAvni9QA="
    },
    {
        question: "using System;\n\npublic class Program\n{\n    public static void Foo&lt;T&gt;()\n        where T : new()\n    {\n        T t = new T();\n        if (typeof(T) == t.GetType())\n            Console.Write(\"0\");\n        else\n            Console.Write(\"1\");\n    }\n    \n    public static void Main()\n    {\n        try\n        {\n            Foo&lt;int&gt;();\n            Foo&lt;int?&gt;();\n        }\n        catch\n        {\n            Console.Write(\"2\");\n        }\n    }\n}",
        answer: "02",
        explanation: "The first call to <code>Foo</code> works completely as you'd expect and prints \"0\". The default constructor for an <code>int</code> just produces the value 0.<br><br>The second call uses a <b>nullable</b> int as the generic type. Default constructing a nullable int like so: <code>var a = new int?();</code> will simply produce the value <code>null</code>. We then try to call <code>t.GetType()</code>, but <code>t</code> is <code>null</code>, so the function throws a null reference exception, and we enter the exception handler, printing \"2\".",
        hint: "<code>int?</code> denotes a nullable <code>int</code>. What do you get if you call the default constructor for a nullable <code>int</code>?",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINTMB2PAbzwEgjyA2UgFmIDEB7LgHgBUAfAAoAlPToB3ABYBTMLOL9iIYlFmSx9Wrjp1lwYgF41GpWIDcEgJYAzYsOABPAA6yut4f1HGTwAHQA4rLA/K6yYuK6egDCXFAAzlwANrL+AOpg1sARAEQADLmiVtGyyQmyEnRxiSlpmdl5mEUldAC+9PQY6NoSwGBOEjp6dNx81lDAIsVVY7wTwAD8063tEgDGAIbA69JDVTVJqRlZOcK56C0SHbo3bUA"
    },
    {
        question: "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        Console.Write((int)Math.Round(-0.5));\n        Console.Write((int)Math.Round(0.5));\n        Console.Write((int)Math.Round(1.5));\n    }\n}",
        answer: "002",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINTMB2PAbzwEgN17bc66BhAeygGdOAbAKYA6AOpgAlsEEAKGRKjAAlAFkAhsAAWwgEqdocGQFoADMICsSpQG56HbnyFjJ0uQuXqtu/VENnLNnZcvAIi4lKy8oqqGtp6BjKYFla2rAC+eGlAA="
    },
    {
        question: "using System;\n                    \npublic class Program\n{\n    public enum Foo { A = 1, B = 2 }\n    \n    public static void Bar(Foo a) { Console.Write(\"0\"); }\n    public static void Bar(object a) { Console.Write(\"1\"); }\n    \n    public static void Main()\n    {\n        Bar(0);\n        Bar(1);\n        Bar((object)(Foo.A));\n    }\n}",
        answer: "011",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUASEML1QGYACDSzAdjwG898zyBTKCAW3IDEB7PuXrkAguQC85TDHIAhCeXTkAvkyYtUmAGyUALHICGYABT9BBgJRDyAYT5QAznwA2rAHQB1MAEtgrYwBEAAwBFgDcKuoUmjqo+rJGxnwARgBWrADGwOSW1naOLu5evv4BmKERqgTq6OhMjAT4CSZB4UxNiZhtjc3GSWmZwBamAm4iFt34VcpAA=="
    },
    {
        question: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic static class Foo\n{\n    public static IEnumerable&lt;T&gt; Where&lt;T&gt;(\n        this IEnumerable&lt;T&gt; src,\n        Func&lt;T, bool&gt; pred)\n    {\n        yield return default;\n    }\n    \n    public static IEnumerator&lt;int&gt; GetEnumerator&lt;T&gt;(this T src)\n    {\n        return ((IEnumerable&lt;int&gt;)new int[] { 4 }).GetEnumerator();\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        int[] arr = new int[] { 1, 2, 3 };\n        \n        var filtered = \n            from x in arr\n            where x &gt; 1\n            select x;\n        \n        foreach (var num in filtered)\n            Console.Write(num);\n        \n        foreach (var num in \"5\")\n            Console.Write(num);\n    }\n}",
        answer: "05",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUKgBgAJVMAWAbj0JMwDoAZASygEcrdqBmWgNhPREAYgHsReAN54iMkj1L9SXADwAVAHxEA6gAsApmD1r1ACjwBIc8B1MAzrRUaitsAGMYF86gCsamEQAjMQAbTQAHQzgASmlZKVxZRNpMEgB2Ijg9ADMAQwhg4A5EgF8LC1R5TH4ASQBRKAgAWwMc4BEwZRZgTQBxPWB6ppa2jo0TazsiVWc3GNxzeMtUdJMTJU6obqioPQB3Ii6AbQBdIgkiMiJiqLo+gYbmsFb2kyiOc1LcT+4BWlTJcrodAWRbmI6nHJgMBEAC8RB2+3BZyImH86H8PGK73MngAbpCiFkmAUDHo4LCiJ5zFkwCJGkQAB4HKBESFgKm7fSGRlETQ4eaWWx6YJ6VzARnYzxZdp6HKuHREEz46EPZmE4nAUnRKkAYREUFsIhFdC0YCYmpMDzenilMrlCqVBNVLCIACJvK65pZzHqDUa9CazRare9PsUgA==="
    },
    {
        question: "using System;\nusing System.Runtime.InteropServices;\n                    \npublic class Program\n{	\n    public static void Main()\n    {\n        Console.Write(sizeof(int));\n        Console.Write(Marshal.SizeOf&lt;int&gt;());\n        \n        Console.Write(sizeof(bool));\n        Console.Write(Marshal.SizeOf&lt;bool&gt;());\n        \n        Console.Write(sizeof(char));\n        Console.Write(Marshal.SizeOf&lt;char&gt;());\n    }\n}",
        answer: "441421",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUKgBgAJVMA6AJWmAEsBbAUzIEkpgGwB7ABwGUOAbjQDGDAM4BuPAEhZsvKgDMJdCUwB2PAG9pMjOhlaZ0gMKcoYzgBsmAdTA12ACjE0AXg04AzJzTYBKfylcWTMLazsHZwBZAEMwMQALWKsyXncGAHkvAB4/YAA+J0Dg+RDTc0sbMntHBhcM7ycAI05rEuMwqsi6pziE5NT0j2yc1usijvLOyoiaqPrXDybhZLAp0Nnq2pj4pJS0jNHV+MmgmQBfPAugA==="
    },
];
