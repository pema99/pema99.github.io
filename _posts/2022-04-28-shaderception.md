---
layout: post
title: Shaderception - a deep dive
---

# Intro
A while back, I wrote a compiler for a shading language, named [Shaderception](https://github.com/pema99/Shaderception). The compiler runs within the social VR platform VRChat, which poses some interesting and odd technical challenges. The result was a virtual world accessible through VRChat, which functions similar to [Shadertoy](https://www.shadertoy.com/) and lets users write and execute interactive shaders entirely from within the platform. The name comes from the fact that the runtime for the language is, itself, written in a fragment shader.

I've briefly written about the project [in the past](https://pema.dev/2022/04/17/nans/), but have been meaning to write a more in-depth technical summary of the techniques I employed to make it all happen. The project consists of several distinct parts, each of which I'll describe separately. As a goal, I'll try to keep it fairly understandable even to people who don't know much about compilers. Apologies if I come off as condescending at times.

# The language
The language compiled by Shaderception, dubbed Shaderception language (I'm amazing at naming things), is fairly similar to HLSL with a few major differences. To motivate the rest of the post and show what we are working towards, here is an example program that calculates an image of the mandelbrot fractal:

```ocaml
fun squareComplex(z) {
	float2(
		z.x * z.x - z.y * z.y,
		z.x * z.y + z.y * z.x
	)
}
fun squareLength(a) {
	a.x * a.x + a.y * a.y
}
let maxSteps = 20;
let p = float2(-2.5 + (1.0 - (-2.5)) * uv().x,
               -1.7 + (1.7 - (-1.7)) * uv().y);
let z = p / (mod(time().y, 20.0) / 3.0);
let steps = 0;
let i = 0;
while (i < maxSteps) {
    if (squareLength(z) < 4.0) { 
        z = squareComplex(z) + p;
        steps++;
    }
    i++;
}
if (steps == maxSteps) {
    float4(1.0, 0.0, 0.0, 1.0)
} else {
    float4(steps / 15.0, 0.0, 0.0, steps / 15.0)
}
```
Which outputs this image:

![](https://i.imgur.com/k0lB0eV.gif)

Those familiar with HLSL will immediately notice a few major differences. Roughly, they are:
- Everything in Shaderception lives in a single global scope, where both functions and raw code are permitted. The last expression in the program will be the color of the pixel being shaded.
- The language is dynamically typed, simplifying the syntax for defining functions and variables quite a bit.
- The language uses implicit returns, just like Rust. The last expression in a function without a semicolon after it will be returned.
- The `let` keyword is used to declare or reassign variables. It is actually completely optional, since _every variable is global_.

Some other notable points which aren't immediately obvious from the snippet:
- There is a maximum of 256 variable names per program, which is simply a technical limitation.
- Recursion, and in general reentrant functions are not allowed, which is similar to HLSL.
- There are no matrices, only scalars and vectors of dimension 2-4.
- No `switch` statements.

The language was explicitly designed to be easy to compile with a stupid simple compiler, and to be executable with a stupid simple runtime, while maintaining a similar feel to existing shading languages where it was practical.

# The compiler
VRChat has 2 main ways of running user code: Shaders and Udon. It's completely unreasonable to attempt to write a compiler in a shader, so the compiler itself uses Udon. Udon is a scripting system which consists of a simple instruction set, usually referred to as Udon assembly, and an accompanying node-based visual scripting tool. For people who prefer to write code instead of using node graphs, we have Merlin's fantastic [UdonSharp](https://github.com/vrchat-community/UdonSharp) compiler, which compiles a subset of Unity-flavored C# to Udon assembly. This is what I utilized to create the compiler.

## On UdonSharp
UdonSharp is similar in spirit to normal C#, but there are some very notable differences that make the former a very strange environment to write larger programs in. Among these differences are: 

- The speed. UdonSharp code is extremely slow, usually several thousand times slower than the equivalent C#. This is no fault of the UdonSharp compiler - the underlying scripting system is just slow as a consequence of its design. What slows Udon are calls to external .NET methods, which have large overhead. This is such a big deal that asymptotic complexity becomes largely irrelevant, and the only factor that really matters for optimization is minimizing the amount of extern calls.
- There are no generics, which means no `List<T>` or `Dictionary<K, V>`.
- Splitting a program into multiple files is tedious, as each UdonSharp program must map to a _behavior_, which forces some restrictions on how the class is written. Inheritance becomes less powerful, and there is no simple way to define a quick plain-old-data struct or class for use within the program. Also, each behavior brings overhead.
- Many types and methods existing in regular .NET or in Unity's APIs are not exposed to the Udon scripting system. This is done intentionally to sandbox user scripts, but often means that the idiomatic .NET solution to a problem simply isn't possible.

For these reasons, the compiler is written as a single 1300 line C# script, containing a single class, and which uses arrays as the sole data structure, primarily arrays of `object` or `string`. An amazing code style, I know.

## Immediate mode compilation
Writing compilers is difficult work. Writing compilers in such a limited programming environment is not only difficult, but extremely tedious. To prevent myself from going insane and make it all easier to implement, I made a few fairly unorthodox design decisions. The main one being a property of the compilation pipeline which I shall refer to as immediate mode compilation (if you have a better word for it, please let me know, I'm not aware of one).

To understand what that is, let's talk briefly about architecting a compiler. If you've ever taken a course on the subject, you were probably taught that most compilers should consist *roughly* of the following distinct 'parts' aka. pipeline stages:
1. Lexing/Tokenization
2. Parsing
3. Typechecking and semantic analysis
4. Optimization passes
5. Code generation

Each of these being like a separate little program that takes input from the previous part and passes it to the next. Source code is first lexed to produce a stream of tokens, which is parsed to construct an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST). This tree structure is then used to check proper usage of types and program semantics, and later optimized into a semantically equivalent, but more performant form. Lastly, the syntax tree, or some other intermediate representation, is used to generate code in the target language (such as assembly).

Implementing all of this in the aforementioned limited environment is quite ambitious, so I started cutting stuff away. If I make the language dynamically typed, there is no need for type checking, which removes one pipeline stage. Another pipeline stage is removed by the decision to not make an optimizing compiler - if you write slow code, you will pay the price. Also, due to the lack of proper user types, tokens produced by the lexing stage are actually just `object`s, that can be either strings in the case of identifiers or keywords, `float`s in the case of literals, or `char`s in the case of symbols like `+` or `)` - a disgusting use of polymorphism. All of this leaves us with the following pipeline:
- Lexing to objects
- Parsing
- Code generation

Even this pipeline, however, I considered too ambitious. It turns out representing and working on more complex data structures, such as an abstract syntax tree, is pretty difficult and unwieldy with Udon due to the lack of proper user types. To circumvent dealing with that headache at all, parsing and code generation are done in one single step, which is what I mean by 'immediate mode compilation'. Code in the target language is immediately generated while the token stream is being read. 

To give an example, the code to compile a while loop looks like so:

```csharp
[RecursiveMethod]
void WhileLoop()
{
    string startLabel = "start_" + labelCount++;
    string endLabel = "end_" + labelCount++;

    Eat("while");
    Eat('(');
    
    Emit("LABEL", startLabel);
    Expression(); // condition
    Emit("CONDJUMP", endLabel);

    Eat(')');
    Eat('{');

    Block();
    Emit("JUMP", startLabel);
    
    Eat('}');

    Emit("LABEL", endLabel);
}
```
There are 2 main operations being performed in this code: `Eat` and `Emit`. `Eat` takes as input a token we expect to be present, consumes the next token in the token stream, and produces an error if it wasn't what we expected. `Emit` produces an instruction in the language used by the compiler as a compilation target, which I'll describe in further detail later. If you've ever written an assembly language, you may recognize some of these instructions. `Expression` and `Block` are recursive functions which look similar to the one above, and which compile a single expression and a block of code respectively.

Thus, the code functions roughly like so:
1. Eat a `while` keyword token.
2. Eat an opening parenthesis `(`.
3. Place a label in the generated code, which is just an indicator of a position in said code that we can jump to later. This one indicates the start of the loop body, including the loop condition.
4. Compile an expression - the loop condition we want to test.
5. Place a conditional jump `CONDJUMP` into the generated code, which will jump to the end of the loop if the loop condition evaluates to false.
6. Eat a closing parenthesis `)`
7. Eat a opening bracket `{`, indicating the start of a code block.
8. Compile a bunch of statements that make up the loop body.
9. Place a `JUMP` instruction in the generated code which jumps back to the start of the loop and tests the loop condition again.
10. Eat a closing bracket `}`.
11. Place another label in the generated code, this time indicating the end of the loop.

Phew, that was a bit of a mouthful, but I hope you see how this mixed approach cuts down on the amount of code I have to write quite drastically, at the cost of robustness and scalability; certains language constructs are very tricky to compile with this approach, and it implicitly puts limitations on the kind of languages we can make, since we don't really have a way to 'look ahead' and make decisions about how to compile something. For this same reason, the syntax was intentionally chosen to be _fairly_ unambiguous.

## Aggresive inlining
Most languages have a notion of a callstack, which is a stack data structure that stores several pieces of data vital to supporting function calls. Usually, that includes an address to return after a function is finished executing, and the values of local variables used within the function. For general purpose languages, the existence of a callstack is essentially assumed, since it is so common. However, this infrastructure has a complexity toll on both the compiler and target instruction set - both things I was trying to make as simple as possible. Therefore, Shaderception does not support function calls.

> Wait, what? No function calls? But you just showed a piece of code in the start of this post that defined and called several functions!

Indeed, Shaderception does support functions, both user defined and builtin, but has no _proper_ function calls. Instead, every single time we encounter a function call, we inline the function at the callsite. For those unfamiliar with the term, this literally means to remove the function call and replace it with a copy-pasted version of the body of the function being called. This process is necessarily recursive, since those functions may call other functions.

Here as an example of how this works at a semantic level:
```ocaml
fun bar(x) { x + 1337 }
fun foo(y) { bar(y) + 420 }
let baz = foo(69);
```
Would turn into:
```ocaml
fun bar(x) { x + 1337 }
let baz = bar(69) + 420;
```
And then finally into:
```ocaml
let baz = (69 + 1337) + 420;
```
As is evident from this example, all function calls have been removed, yay! And if there are no function calls, there is no need for a callstack or any other kind of data structure to keep track of calls. In reality, functions aren't inlined at the source level, but instead after the code is compiled.

This does, however, come at a cost. Inlining massively bloats the size of the generated code. If you define a function and call it 10 times, suddenly the body of that function will appear 10 times in the generated code! This can be quite problematic for larger programs.

Additionally, recursion and reentrancy becomes impossible, for example, if we tried to inline the following function:
```ocaml
fun foo(x) { foo(x) + 1 }
```
What should it become? The inlining process would never terminate, since this can be inlined an infinite amount of times, and there will still be a function call present. This is the reason recursion is forbidden in the language. This isn't actually so insane - most shading languages don't support recursion for very similar reasons.

## Extern calls
No language is complete without a way to perform input and output. In shaderception, this is facilitated with a bunch of builtin, external functions. This includes stuff like `uv()` to get the current pixel coordinates, but the same mechanism is also used for the typical expected math functions like `sin`, `round`, `log` etc. These functions are not written in Shaderception language, or even in the instruction set targeted by the compiler. Instead, they are written directly in HLSL, hardcoded into the runtime. An instruction `CALL` exists to call these external functions, and takes as input an integer identifier associated with each builtin. Notably, the `CALL` instruction _only_ works with builtin functions - it isn't possible to define your own that can be called with this mechanism.

## Label linking and register allocation
When describing the various pipeline stages of the compiler I made a slight distortion of the truth. In fact, more work is done after the initial round of code generation, namely label linking and register allocation. 
> Note: Both of these are slight misuse of technical terms, they are just simply names I've chosen to describe what is being done.

While generating code, we have been placing labels throughout that were used as the target of various jump instructions. But how do we know which memory address to jump to concretely when all we have is the name of the label? Label linking addresses, by traversing the generated code, and keeping track of the offsets of labels in the generated program binary as it goes. Every time a jump instruction is encountered, the target of the jump is replaced with the concrete offset in the binary. Label instructions are also removed in this process

Given a (pseudo) program binary that looks roughly like so:
```
1: JUMP BAR
2: LABEL FOO
3: SETVAR BAZ
4: LABEL BAR
5: PUSHCONST 1337
6: JUMP FOO
```
We would transform it to this:
```
1: JUMP 3
2: SETVAR 42
3: PUSHCONST 1337
4: JUMP 2
```

When that process is done, we perform register allocation. This solves a similar problem as we had with labels, but for variables. Another consequence of not having a callstack is that there isn't an immediately obvious place to store local variables. To solve this in the simplest way possible, all variables are stored in a globally accessible variable store, which can hold at most 256 variables, which one may also call registers. Register allocation is the process of mapping variable names to positions in that variable store.
> Note: Again, this is slightly different to what is usually understood in literature by register allocation, but similar enough in spirit that I have no shame in reusing the term.

Given a program binary like so:
```
1: PUSHCONST 1337
2: SETVAR FOO
3: PUSHCONST 42
4: SETVAR FOO
5: PUSHCONST 69
6: SETVAR BAR
```
We would transform it to:
```
1: PUSHCONST 1337
2: SETVAR 0
3: PUSHCONST 42
4: SETVAR 0
5: PUSHCONST 69
6: SETVAR 1
```
Assigning the variables `FOO` and `BAR` to position `0` and `1` in the variable store respectively. If you go over 256 variables, you get undefined behavior. Everybody loves undefined behavior. In a _real_ compiler, going over the max register count would result in a 'spill', in which spilled variables are stored in memory instead of a register.

## Producing a binary
All the program binaries and generated code I have shown so far have been in mnemonic form. The very final step of the compilation process is to convert this into a more practical, binary format. Of course, we don't actually store the string `"JUMP"` for every jump instruction, that would be insane. Thus, every instruction maps to a distinct operation code, or opcode for short. This is a straight forward matter of traversing the generated code in mnemonic forms and putting opcodes into a list which becomes the program binary.

# The virtual machine
So far, I've only described the process of compiling a source program to a binary format. Without a machine to run that binary, the compiler is largely useless. Most languages use one of three approaches to make the programs their compilers produce executable:
- Target an instruction set native to the computer you wish to run the program on, in which case you are done at this step.
- Interpret and execute the source program or a simplified version of it directly. This is quite flexible but can also be horribly slow and implies writing code to execute something much more complex than a program binary, which isn't ideal when trying to minimize complexity.
- Target an imaginary instruction set and write a program that pretends to be a machine that can execute this instruction set - a _virtual_ machine. This kind of instruction set is usually referred to as 'bytecode'. This is essentially a hybrid of the 2 other approaches, and inherits some nice benefits from both.

Frankly, the third and last option was the only viable one for this project, since the runtime (concretely, the virtual machine) will be implemented *in a fragment shader*. Now, why the hell would anyone write a virtual machine for a language like this in a shader? Shader languages are not general purpose and typically not well suited for programs like this.

Actually, I gave the answer to this near the start of the post. Udon is slow. Very slow. Extremely slow, even. Trying to write a virtual machine to execute our program in Udon is a complete lost cause - we would barely be able compute the color of a single pixel without lagging everyone out. GPUs on the other hand are very fast, and we can leverage this to make the language at least somewhat performant. Usually, this too is a bad idea, since general purpose languages cannot easily make use of the parallel nature that GPUs are famous for. Shaderception language is not general purpose though, and it turns out writing a virtual machine in a shader, for a shader language spefically, isn't actually such a terrible idea. The kind of programs we will become are parallel in nature, as all fragment shaders are, which will map nicely to the parallelism of the host GPU.

## Stack or register based?
In the world of virtual machines (and actually _real_ machines, as well), there are 2 main approaches: Stack or register based. A good example of register based instruction sets are x86 and ARM. Instructions for register machines refer directly to registers on said machine, of which there is usually a fairly limited amount. If we wanted to add 2 numbers and assign it to a variable in something similar to x86, for example, it may look something like this:

```
MOV   %eax, 1337
MOV   %ebx, 420
ADD   %eax, %ebx 
```
Where `%eax` and `%ebx` are two registers, and we are assuming the variable we are assigning to is being stored in `%eax`. `MOV` moves a value from one location to another, and `ADD` adds a value to another value stored at a given location.

In a fictitious stack based instruction set, the equivalent may look like so:
```
PUSHCONST 1337
PUSHCONST 420
ADD
SETVAR    res
```
Stack machines use an ever-present stack to perform their operations. Each instruction may push and pop values on the stack to perform calculations. In this example snippet, we first push the values 1337 and 420 onto the stack. Next, we execute the `ADD` instruction, which will pop the 2 topmost values of the stack, add them together, and push the result onto the stack. After this operation, the stack will contain 1 value, the number 1757. Lastly, we execute `SETVAR` which will pop a value from the stack and assign it to a variable. `res` is assumed to be some identifier referring to the variable we care about.
> Note: This 'stack' shouldn't be conflated with a callstack. Instead, you may perhaps call it a value-stack. This stack is used constantly, for almost every operation, unlike the callstack, which is only really used when calling functions. That being said, this stack may be used to store return addresses and local variables in a more sophisticated language.

For Shaderception, I designed a stack based virtual machine. The reason for this choice is very simple: They are dead simple to implement. A reoccuring theme in this project.

## The Shaderception instruction set
Before I describe the instruction set I decided on, a few things are worth noting. Every instruction consists of 2 `float4`s: An opcode and operand (wasteful I know, bite me). The opcode, which is an integer, goes in the `X` channel of the first `float4`.

Without further ado, here is the instruction set specification used by the Shaderception virtual machine, and generated by the compiler:

### `1 - PUSHCONST (float4)`
Push a constant floating point vector onto the stack

### `2 - PUSHVAR (id)`
Push a variable stored at location `id` to the stack

### `3 - BINOP (op)`
Take the 2 topmost elements of the stack, perform binary operation.

### `4 - UNOP (op)`
Take the topmost stack element and perform unary operation on it, put result on stack.

### `5 - CALL (id)`
Call builtin function with the given ID. Parameters should be on the stack when the instruction is invoked. Result is put on the stack.

### `6 - SETVAR (id)`
Pop a value off the stack and set the variable at location (id) to
the value. This operator also stores a mask of which elements of the vector to set in the y element of the opcode. An example of such a mask could be the float "1223.0"

### `7 - JUMP (loc)`
Jump to a specified memory location.

### `8 - CONDJUMP (loc)`
Pop a value off the stack. If it is false (equals 0), jump to the specified location.

## Executing the instructions
The [core of the bytecode virtual machine](https://github.com/pema99/Shaderception/blob/master/Assets/FuncWorld/Code/VM.cginc#L365) is actually really simple. It is essentially just a loop that runs until the program terminates, and which contains a giant switch statement that switches over the opcode of the next instruction in the program binary. The start of it looks like so:

```glsl
for (uint i = 0; i < 4092; i += 2)
{
    uint instr = round(_Program[i].x); // opcode
    float4 opf = _Program[i + 1];      // operand
    uint opi = round(opf).x;           // first part of operand
    [forcecase] switch(instr)
    {
        case 1: // PUSHCONST <float>
            pushStack(opf);
            break;
        case 2: // PUSHVAR <char>
            pushStack(getVar(opi));
            break;
    // and more down here ...
```
To store the variables and the stack, I use 2 little arrays and an offset pointing to the top of the stack:
```glsl
static float4 stack[128];
static uint stackPtr = 0;
static float4 vtab[256];
```
Similarly, the program binary is stored in a large array, and the instruction pointer is simply the loop index in the previous loop.

External calls are the only real non-trivial instruction. For these, I first use the integer ID of the extern to determine its arity, then pop that many values off the stack, and finally call the extern using those popped values, putting the result back onto the stack. 'Calling the extern' in practice means using a horrendous giant switch statement that switches over the ID and contains the implementation of every single extern. A similarly gross switch statement is used to determine the arity.

The start of that function looks like so:
```glsl
float4 callFun(uint opi, float4x4 ops, uint4 dims)
{
    [forcecase] switch(opi)
    {
        case 1:  return log(ops[0]);
        case 2:  return log2(ops[0]);
        case 3:  return sin(ops[0]);
```
Quite simple, really.

## Dynamic typing is cursed
Shaderception language is dynamically typed. In hindsight, this was both a good and a bad decision. The good was that it massively simplified the compiler. The bad was that it made the virtual machine more complex, and complex shader code kind of has a tendency to fail for seemingly random, mysterious reasons. In addition to just being dynamically typed, further complexity is added by implicit conversions between vector types being supported, and by builtin functions being polymorphic.

Every single value in the Shaderception is stored as `float4`. In order to determine the width of a vector, unused channels are set to `NaN` ([this is a horrible idea for the love of god don't do this](https://pema.dev/2022/04/17/nans/)). Some examples:

```glsl
float4(1337.0, NaN, NaN, NaN) // This is a scalar
float4(13.0, 23.0, 34.0, NaN) // This is a 3D vector
float4(1.0, NaN, 3.0, NaN)    // This is invalid
```
By counting the amount of `NaN`s in a vector (done simply with a dot product), I can thus get the dimension of the vector, and base behavior on it. A good example of why this is necessary is the following snippet of Shaderception language:

```glsl
let a = 3.0;
let b = float3(1.0, 2.0, 3.0);
let c = dot(a, b);
```
This is completely valid, and what should happen is that the value '`a`' is implicitly cast from a scalar `float` to a vector `float3`, and then we take the dot product of `(3.0, 3.0, 3.0)` and `(1.0, 2.0, 3.0)`. If we did something naive like, say, directly calling `dot` with the 2 operands and without the NaN encoding, we would take the dot product of `(3.0, ?, ?)` and `(1.0, 2.0, 3.0)` where `?` is a placeholder for whatever values happened to be in the channels that we didn't care about, since '`a`' was a scalar. This can lead to some seriously wrong results. Certain functions may also behave differently depending on what type of value was passed, which this approach addresses.

## NaN propagation is cursed
Play stupid games, win stupid prizes. This is the thought that should immediately have sprung into my mind when I came up with the idea of using `NaN` to encode types. For whatever reason, I did it anyways. One thing I learned pretty quickly is that `NaN` does not care about your feelings, and `NaN`s may propagate in very strange ways in HLSL. 

For example, dynamically indexing a vector that contains a `NaN` in one channel like so:

```glsl
// assume foo is a vector (0.0, NaN, 0.0, 0.0)
float bar(uint i) {
  // this returns NaN regardless of 'i'
  return foo[i];
}
```
I wrote an [entire post](https://pema.dev/2022/04/17/nans/) about similar issues, so won't go into further detail.

## How not to crash your GPU driver
The initial implementation of the virtual machine caused quite a few graphics driver crashes. I did 2 things 2 mitigate this.

The first was a jump counter that is incremented every time a jump instruction is performed. If this ever reaches some arbitrarily set maximum value, the program simply terminates. This prevents programs that manage to loop infinitely from causing timeouts and crashes.

The second was AMD specific. The small arrays shown in the previous section used to store variables and values on the stack would cause spurious crashes on several AMD cards. The fix turned out to be to always limit the passed index to the range of the array when indexing the array, like so:

```glsl
float4 getVar(uint opi)
{
    return vtab[opi % 256];
}
```
My code never actually did any read or writes out of bounds, but apparently the mere thought of this happening was enough to cause some AMD drivers to shit themselves.

# The tooling
In addition to the compiler and the virtual machine, the Shaderception project consists of a few, additional, projects of varying interest.

## The Shaderception world
The Shaderception world, which you can check out on VRChat [here](https://vrchat.com/home/launch?worldId=wrld_4d1a8927-452c-486d-af11-949a9aac58c3), even if you don't have a VR headset. Is the main way to interface with Shaderception. It consists of a fancy text input box, and a few screens that show the output. The world also has video players and cameras that feed their data to the Shaderception system, such that you can play around with them and make image-based effects.

Alternatively, here is a [tweet that shows it off](https://twitter.com/pemathedev/status/1434098876747862018).

## User submitted programs
I'd like to thank my good friends who have submitted their own programs written in my botched together language to me.

![](https://i.imgur.com/PACd4gI.gif)

By far the most notable is by my great friend Fuopy, who wrote an entire playable Pong game played against a simple AI (depicted above). Not only is this quite a feat in domain-specific shading language, but I'm particularly impressed by how he managed to get this done _while_ I was still working on the compiler and fixing bugs along the way. Thanks for the great motivation, Fuopy. He posted a [tweet about it here](https://twitter.com/fuopy/status/1434277652538355713).

Another person who contributed some very neat programs was M.O.O.N. They wrote some trippy image-based effects, and ported some neat shaders they had written previously to the language. Thanks for that.

## Shaderception cross
Shaderception is cool, but HLSL is also cool. Therefore, a compiler that takes Shaderception code and produces HLSL is per definition doubly cool. This is exactly what [shaderception-cross](https://github.com/pema99/shaderception-cross) is - an entirely separate, second compiler for Shaderception that emits HLSL.

> Why do I do this to my self.

One major challenge in writing this was the types. Since I am going from an untyped to a typed language, all the types have to be inferred from their use. This resulted in quite some spaghetti code for the type inference algorithm, but the source code is in general much nicer to read. If you want to look at a Shaderception compiler but also not feel dead inside while you do so, I suggest looking at this one.

## Shaderception standalone
I've written stubs for most of the Unity-only functionality I've used in the compiler. This allows Shaderception to be run outside of VRChat, and more generally outside of Unity. This was useful when testing out the compiler without having to spin up Unity each time. The link to this project is [here](https://github.com/pema99/shaderception-standalone).

## Shaderception VSCode syntax
I've written a tiny plugin for VSCode that adds syntax highlighting for Shaderception language. The source code is available [here](https://github.com/pema99/shaderception-vscode-syntax), and the plugin on the marketplace [here](https://marketplace.visualstudio.com/items?itemName=Pema99.psl).