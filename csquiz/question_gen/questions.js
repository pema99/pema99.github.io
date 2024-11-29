const questions = [
    {
        question: "using System;\n                    \npublic class Foo\n{\n    public override string ToString() { return \"0\"; }\n    public static implicit operator string(Foo f) { return \"1\"; }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        Foo f = new Foo();\n        Console.Write(f);\n        Console.Write($\"{f}\");\n        Console.Write(f + \"\");\n    }\n}",
        answer: "101",
        explanation: "TODO",
        hint: "String interpolation works on any type of object.",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUASEML1QGYACDcgMQHta8BvPfM82gNwFMwwBLOF0qYADOQAqtAMrB+UAOYAKAJTlGlAOzkARCO0BucgF8WbVJgBs5PgFsADgBs+AYz7B2dngENgtMMJFFOlpyADNVdVQtbUwDYzwTXBIKKnMNJlN0dBZmAnxgsPIAXnIoLgB3GnoVfRZ8AGFaKABnWgcuADoAdX5gLkVw2rzGlrbOnrd+gBJtRlCjbWUhwhHW9u7e/tDyRB1F5cSjIA="
    },
    {
        question: "using System;\n\npublic class Foo<T> { }\n\npublic static class FooExt\n{\n    public static void Bar(this Foo<int> foo) { Console.Write(\"0\"); }\n    public static void Bar<T>(this Foo<T> foo) { Console.Write(\"1\"); }\n}\n\npublic class Program\n{	\n    public static void Main()\n    {\n        Foo<int> f = new Foo<int>();\n        f.Bar();\n        Baz(f);\n    }\n        \n    public static void Baz<T>(Foo<T> f)\n    {\n        f.Bar();\n    }\n}",
        answer: "01",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINiAxAe0oB4AVAPmIG9iBfPAk1TANlPQVqAUQAewPMzwBIIqT6kALMQBCAQzAAKYAAsAlgGchtPVGBMAZtQCULYgGFKUA5QA2AUwB0AdTB7g7poARAAMQdYA3Owycjz8qMrqYPQM2vpGVLSMxFaUtqyOzm5evv6BQZjhURy4NVwC8gDsktIx6OgyUrjS0pk0puY5xAC8xFDuAO7G/WapkTLSFp5JmvPd0uoAXpoWa9I1PTHcCgmqapspmn3Zu50LSyt7NWxAA"
    },
    {
        question: "using System;\nusing System.Runtime.InteropServices;\n                    \npublic class Program\n{\n    public struct Empty { }\n    public struct OneByte { byte a; }\n    \n    public static int Size(object obj)\n    {\n        return Marshal.SizeOf(obj);\n    }\n    \n    public static void Main()\n    {\n        Console.Write(Marshal.SizeOf<Empty>());\n        Console.Write(Marshal.SizeOf<OneByte>());\n        Console.Write(Size(new OneByte()));\n    }\n}",
        answer: "111",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUKgBgAJVMA6AJWmAEsBbAUzIEkpgGwB7ABwGUOAbjQDGDAM4BuPAEhZsvKgDMJdCUwB2PAG9pMjOhlaZ0gMKcoYzgBsmAdTA12ACjE0AXg04AzJzTYBKfylcWTMLazsHZwBZAEMwMQALWKsyXncGAHkvAB4/YAA+J0Dg+RDTc0sbMntHBhcM7ycAI05rEuMwqsi6pziE5NT0j2yc1usijvLOyoiaqPrXDybhZLAp0Nnq2pj4pJS0jNHV+MmgmQBfPAugA==="
    },
    {
        question: "using System;\n\npublic struct FooStruct\n{\n    private int count;\n    public int Increment => ++count;\n}\n\npublic class FooClass\n{\n    private int count;\n    public int Increment => ++count;\n}\n\npublic class Program\n{\n    public static readonly FooStruct a = new();\n    public static FooStruct b = new();\n    \n    public static readonly FooClass c = new();\n    public static FooClass d = new();\n\n    public static void Main()\n    {\n        Console.Write(a.Increment);\n        Console.Write(a.Increment);\n        \n        Console.Write(b.Increment);\n        Console.Write(b.Increment);\n        \n        Console.Write(c.Increment);\n        Console.Write(c.Increment);\n        \n        Console.Write(d.Increment);\n        Console.Write(d.Increment);\n    }\n}",
        answer: "11121212",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAIBnYSAY2GIDEB7egZQomrwG89ifiAHMAEsAbgENgAU2KCoNSvWjAA3N15Fps4gEkolMBIC2EzQF4AfMUSJ5ilbgC+eAiQx1GAYQA2o0qU6qeARFxKRk5BVk7XmJ1MO1dfSNTCysbSLxHfFx1V1RMAHZ/XGiczAA2Yn1ROHooTwBPN2ZWamJRYhNiKAkAdwAKAEootRdyppYqGgAjDq7eweGePABIUoqqmrrGhnovH1JiSlnu/qGAmNGKnb3fYjhj+bOskvR0c65i6N53WtJ6TwkADoAOpCSR9USAnR6QzGYBPL7fX7/IGgwTgyHQxJwp7LZbnaI/KB/AEgsESPpTKEJWGyBGI4hEkmo8mU6kwpLwux4lbLJkosnoimUdnYumLL780lo8EirG0rm83lSllCvpwUUK+mIlWC8Ea+Wc7XETL2IA="
    },
    {
        question: "using System;\n\npublic struct Foo\n{\n    public int num;\n    public void Set() => num = 1;\n}\n\npublic class Program\n{\n    public static void Bar(in Foo f)\n    {\n        f.Set();\n        Console.Write(f.num);\n    }\n    \n    public static void Baz(Foo f)\n    {\n        f.Set();\n        Console.Write(f.num);\n    }\n\n    static void Main()\n    {\n        Foo bar = new Foo();\n        Bar(bar);\n        Baz(bar);\n    }\n}",
        answer: "01",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAIBnYSAY2GIDEB7evAbzwEgjiBLKGqCALYBudp1QAWYgGUApsAAUASmIBeAHzF+A1cUwjcAXzwESGYqkwB2FnmJ3zpzADZzkgEIBDMPJ51GxADNFdlZcNjYAgDpZBUV9cIBheihSegAbGUiAdTAuYBl5KK049iMw0UcXCWJPAC95BnpA4LDQ8KiYpXi2JJT0zJy8gqLBErCy23sLKskAWQ8eJUm7NrZG4gAjLx0oGQB3P3ou9jZPby2wMfC6+Qux+2IygyA==="
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
        explanation: "TODO",
        hint: "TODO",
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
        question: "using System;\n\npublic class Foo<T>\n{\n    public void Bar() { Console.Write(\"0\"); }\n}\n\npublic static class FooExt\n{\n    public static void Bar<T>(this Foo<T> foo) { Console.Write(\"1\"); }\n}\n\npublic class Program\n{	\n    public static void Main()\n    {\n        Foo<int> f = new Foo<int>();\n        f.Bar();\n    }\n}",
        answer: "0",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINiAxAe0oB4AVAPjwG89j3STUAWYgIQCGYABQBKYs2IBhSlADOlADYBTAHQB1MAEtgy4QCIADPtEBuYgF88V/LiKlMANlLoK1AKIAPYCzYd7qE6kvIJg9AzCwAAWWnJutIzEAGbU4pIy8kpqmjp6+pgm5jY2BFyugQDsLACQfuwY6HUSTRzxNFpQwAzJxAC8xFDKAO5tHV1ipi0cSaqhE03FQA==="
    },
    {
        question: "using System;\nusing System.Collections;\n\npublic class Foo : IEnumerable\n{\n    IEnumerator IEnumerable.GetEnumerator()\n    {\n        return new int[] { 0 }.GetEnumerator();\n    }\n\n    public IEnumerator GetEnumerator()\n    {\n        return new int[] { 1 }.GetEnumerator();\n    }\n}\n\npublic class Program\n{	\n    public static void Main()\n    {\n        foreach (var f in new Foo())\n            Console.Write(f);\n        \n        foreach (var f in (IEnumerable)new Foo())\n            Console.Write(f);\n    }\n}",
        answer: "10",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINiAxAe0oB4AVAPjwG89j3STUAWYgIQCGYABQBKYs2IBhSlADOlADYBTAHQB1MAEtgy4QCIADPtEBuYgF88V/LiKlMANlLoK1AKIAPYCzYd7qE6kvIJg9AzCwAAWWnJutIzEAGbU4pIy8kpqmjp6+pgm5jY2BFyugQDsLACQfuwY6HUSTRzxNFpQwAzJxAC8xFDKAO5tHV1ipi0cSaqhE03FQA==="
    },
    {
        question: "using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        string x = new string(new char[0]);\n        string y = new string(new char[0]);\n        if (object.ReferenceEquals(x, y))\n            Console.Write(1);\n        else\n            Console.Write(0);\n    }\n}",
        answer: "1",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUH1AZgAINTMB2PAbzwEgN17bc6HMAGYgD2IF5iUAKYB3chwAUwsQGMAFgEMwAbQ4BdAJQBueuy4BPfoNHipJ+UtWadrOgEsAZsQkB7AEYArITOAA6AEpCDkJgQlAyQgCiAI4QCgA2AM4S3DDE+hoaunQAwi5QiS7xQr4A6mB2wEISmNq6QklC2XkFRSXlldUcdawAvni9QA="
    },
    {
        question: "using System;\n\npublic class Program\n{\n    public static void Foo<T>()\n        where T : new()\n    {\n        T t = new T();\n        if (typeof(T) == t.GetType())\n            Console.Write(\"0\");\n        else\n            Console.Write(\"1\");\n    }\n    \n    public static void Main()\n    {\n        try\n        {\n            Foo<int>();\n            Foo<int?>();\n        }\n        catch\n        {\n            Console.Write(\"2\");\n        }\n    }\n}",
        answer: "02",
        explanation: "TODO",
        hint: "TODO",
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
        question: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\npublic static class Foo\n{\n    public static IEnumerable<T> Where<T>(\n        this IEnumerable<T> src,\n        Func<T, bool> pred)\n    {\n        yield return default;\n    }\n    \n    public static IEnumerator<int> GetEnumerator<T>(this T src)\n    {\n        return ((IEnumerable<int>)new int[] { 4 }).GetEnumerator();\n    }\n}\n\npublic class Program\n{\n    public static void Main()\n    {\n        int[] arr = new int[] { 1, 2, 3 };\n        \n        var filtered = \n            from x in arr\n            where x > 1\n            select x;\n        \n        foreach (var num in filtered)\n            Console.Write(num);\n        \n        foreach (var num in \"5\")\n            Console.Write(num);\n    }\n}",
        answer: "05",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUKgBgAJVMAWAbj0JMwDoAZASygEcrdqBmWgNhPREAYgHsReAN54iMkj1L9SXADwAVAHxEA6gAsApmD1r1ACjwBIc8B1MAzrRUaitsAGMYF86gCsamEQAjMQAbTQAHQzgASmlZKVxZRNpMEgB2Ijg9ADMAQwhg4A5EgF8LC1R5TH4ASQBRKAgAWwMc4BEwZRZgTQBxPWB6ppa2jo0TazsiVWc3GNxzeMtUdJMTJU6obqioPQB3Ii6AbQBdIgkiMiJiqLo+gYbmsFb2kyiOc1LcT+4BWlTJcrodAWRbmI6nHJgMBEAC8RB2+3BZyImH86H8PGK73MngAbpCiFkmAUDHo4LCiJ5zFkwCJGkQAB4HKBESFgKm7fSGRlETQ4eaWWx6YJ6VzARnYzxZdp6HKuHREEz46EPZmE4nAUnRKkAYREUFsIhFdC0YCYmpMDzenilMrlCqVBNVLCIACJvK65pZzHqDUa9CazRare9PsUgA==="
    },
    {
        question: "using System;\nusing System.Runtime.InteropServices;\n                    \npublic class Program\n{	\n    public static void Main()\n    {\n        Console.Write(sizeof(int));\n        Console.Write(Marshal.SizeOf<int>());\n        \n        Console.Write(sizeof(bool));\n        Console.Write(Marshal.SizeOf<bool>());\n        \n        Console.Write(sizeof(char));\n        Console.Write(Marshal.SizeOf<char>());\n    }\n}",
        answer: "441421",
        explanation: "TODO",
        hint: "TODO",
        sharpLabUrl: "https://sharplab.io/#v2:C4LgTgrgdgNAJiA1AHwAICYCMBYAUKgBgAJVMA6AJWmAEsBbAUzIEkpgGwB7ABwGUOAbjQDGDAM4BuPAEhZsvKgDMJdCUwB2PAG9pMjOhlaZ0gMKcoYzgBsmAdTA12ACjE0AXg04AzJzTYBKfylcWTMLazsHZwBZAEMwMQALWKsyXncGAHkvAB4/YAA+J0Dg+RDTc0sbMntHBhcM7ycAI05rEuMwqsi6pziE5NT0j2yc1usijvLOyoiaqPrXDybhZLAp0Nnq2pj4pJS0jNHV+MmgmQBfPAugA==="
    },
];
