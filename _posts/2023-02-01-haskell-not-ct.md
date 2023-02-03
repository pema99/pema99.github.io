---
layout: post
title: Haskell is not category theory
---

# What, why, who?

If you have hung out in Haskell communities, you might have heard people mentioning concepts from the mathematical field of category theory, perhaps even claiming that Haskell is built upon category-theoretic foundations.

There is some truth to this, but I think it is more accurate to say that certain abstractions in Haskell are _inspired_ by category theory. When learning Haskell, I took this connection too literally and ended up confusing the hell out of myself. This post is aimed at my former self and aims to clear up some confusions I came across while trying to make sense of it all.

Before we get started, I want to get a few important disclaimers out of the way:

- This is not a Haskell tutorial and will assume some familiarity with the language. However, if you are proficient with any functional language, especially if it is a dialect of ML, you should be able to follow along.
- You do **not** need to know any category theory to learn and become proficient with Haskell. If you are looking to learn the language, I recommend [Learn You A Haskell](http://learnyouahaskell.com/).
- I'll try not to assume you know any category theory already.
- I am not a category theorist. I consider myself a novice. This is just my attempt of making sense of the parts I am familiar with, so take it with a grain of salt.
- As with several of my posts in the past, this is going to be structured more like a collection of notes, than as a coherent story.

# What is a category?

> Note: If you know any category theory, you can probably skip this section.

The primary object of study in category theory is the category. A category consists of:

- A collection of _objects_.
- A collection of _morphisms_, also known as _arrows_, which map from one object to another. I'll write these as $$f: a \rightarrow b$$. Here, $$f$$ is an arrow from the object $$a$$ to the object $$b$$.
- A binary operation called _composition_, which combines arrows together. I'll write composition as $$x \bullet y$$ where $$x$$ and $$y$$ are arrows.

A few additional criteria must be satisfied:

- Whenever we have an arrow from $$a$$ to $$b$$, and an arrow from $$b$$ to $$c$$, there is also an arrow from $$a$$ to $$c$$ which is the composition of the two. Thus, $$(x: b \rightarrow c) \bullet (y: a \rightarrow b) = (z: a \rightarrow c)$$.
- Composition is associative, so $$x \bullet (y \bullet z)$$ = $$(x \bullet y) \bullet z$$.
- For every object $$a$$, there is an identity arrow $$I_a: a \rightarrow a$$ which just maps from the object to itself.
- Composition with an identity arrow has no effect, so $$I \bullet f = f \bullet I = f$$.

This is intentionally pretty abstract. In the next section, I'll give a concrete example of a category.

# $$Hask$$ is a category

A concrete example of a category is the category of Haskell types, typically called $$Hask$$. In this category:

- Our objects are types, such as `Boolean`, `String`, `[a]`, and so on.
- Our arrows are just plain old functions. They take a value of one type and map it to a value of another.
- Our composition operator is just function composition '`.`'.
- The identity arrow for any type is the identity function, `id`.

All the criteria for a category are satisfied:

- If we have a function `x :: b -> c` and a function `y :: a -> b`, then `x . y` will be a function of type `a -> c`.
- Function composition is associative, `(x . y) . z == x . (y . z)`.
- Composing the identity function with any other function has no effect, `id . f == f . id == f`.

When we are talking about Haskell from a category-theoretic lens, we are almost always talking about $$Hask$$. Since types are more or less sets of possible values, this category is closely related to the category of sets, typically denoted $$Set$$.

# $$Hask$$ is not a category

> Note: If you are not interested in extreme pedantry, feel free to skip this section as well.

I lied. $$Hask$$ is technically not a category. There are several reasons for this, but I'll focus on just one of them.

Haskell has the notion of a _bottom_ value (uwu). Bottom values are a member of _any_ type. A bottom value is trivial to define - we just recurse infinitely!

```hs
bottom :: a
bottom = bottom
```

We can use it in place of _any_ type:

```hs
addNums :: Num a => a -> a -> a
addNums a b = a + b

-- no problems here!
addNums bottom 3
```

This value is allowed to be a member of any type because we can never fully evaluate it, so we will never actually violate any type constraint!

Haskell is a lazily evaluated language but provides a mechanism for strict evaluation through the `seq` combinator. The expression `seq a b` evaluates `b`, but will force `a` to be strictly evaluated.

With all of this in mind, let's revisit our criteria for a category. It must hold that composing the identity function with any other function has no effect - `id . a == a`. Consider the following Haskell program:

```hs
foo :: a -> b
foo = foo

main :: IO ()
main = do
    print (seq (id . foo) 1337)
    print (seq foo 1337)
```

This program will output:

```hs
1337
<<loop>>
```

So we can tell the difference between `foo` and `id . foo`, breaking the criteria! Oh, and by the way `<<loop>>` is just Haskell's way to tell us "this is definitely going to loop forever".

# `Functor` is not $$Functor$$

Another common object in category theory is a _functor_. A functor is a mapping (arrow) from a category to a category. I'll write these as $$F: A \rightarrow B$$ where $$F$$ is a functor from category $$A$$ to category $$B$$. Such a functor will map:

- Each object $$a$$ in category $$A$$ to an object $$F(a)$$ in category $$B$$
- Each arrow $$x: a \rightarrow b$$ in category $$A$$ to an arrow $$F(x) : F(a) \rightarrow F(b)$$

In the above, $$F(a)$$ should be read as "the result of applying functor F to element a", if $$a$$ is an object, we get an object back, and if $$a$$ is an arrow, we get an arrow back. You can view functors as a kind of polymorphic function on elements (be they objects or arrows) in a category.

A simple example of a functor is the _identity functor_, which does ... wait for it ... absolutely nothing! Every object and arrow in $$A$$ is mapped to the same object and arrow in $$B$$. Of course, an identity functor from $$A$$ to $$B$$ can only exist if $$A$$ and $$B$$ are the same since the mapping must be valid for _all_ objects in $$A$$. We call functors from a category to that same category _endofunctors_.

Haskell's standard library includes a typeclass (like a trait in Rust, or a C# interface on steroids) called `Functor`. It looks like this:

```hs
-- Functor typeclass declaration
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

Many built-in types implement this typeclass, such as lists and `Maybe`'s (optional values):

```hs
fmap (+2) [1, 2, 3] == [2, 3, 4]
fmap (*5) (Just 3) == Just 6
fmap (-10) Nothing == Nothing
```

If you are anything like me when I was learning Haskell, you might be tempted to assume that Haskell's `Functor` is equivalent to a functor from category theory, but in fact, it is something much more restricted. Perhaps the most obvious difference is that every Haskell `Functor` is really an _endofunctor on $$Hask$$_, since $$Hask$$ is the only category we can talk about in Haskell. What other differences are there, though?

Recall that objects in $$Hask$$ are types, and arrows are functions. A proper functor $$F$$ would then have to consist of:

- A mapping from a type `a` to a type `F(a)`
- A mapping from functions of type `a -> b` to functions of type `F(a) -> F(b)`

Looking at the definition of `fmap`, this pretty clearly implements the second of the 2 mappings. But what about the first one? This would have to be a function taking a type as input, and returning a type as output - but Haskell cannot treat types as values directly, so we cannot write such a function!

> Note: It is only partially true that Haskell has no type-level functions. With GHC extensions such as TypeFamilies, we can get something like this.

Instead, we'll have to settle for the next best thing - type constructors. We can view a datatype like this:

```hs
data Foo a = Bar a
```

As a sort of type-level function from any type to a subset of all types. Specifically those with the shape `forall a. Foo a`. This is the missing mapping - the type constructors implementing the `Functor` typeclass.

To illustrate why this makes Haskell's `Functor` a more limited abstraction than a full-blown category-theoretic endofunctor, let's try to implement the dead simple identity functor mentioned earlier in this section. This is the best we can do:

```hs
data Identity a = Identity a

instance Functor Identity where
    fmap f (Identity a) = Identity (f a)
```

With a property identity functor $$F$$, we would have that that $$F(a) = a$$ for any object or arrow $$a$$. This clearly isn't the case here; the values `Identity "foo"` and `"foo"` have two different types. Here we have an example of an endofunctor that cannot be made an instance of the `Functor` typeclass.

# A note on kinds of functors

Another piece of information that is implicit in Haskell's `Functor` typeclass, is that it is _covariant_. Covariance means that the direction of arrows in the category upon which the functor acts ($$Hask$$ in our case) is preserved. We can also define a contravariant functor, which flips the direction of arrows. In Haskell, the `Contravariant` typeclass is used to describe such functors:

```hs
class Contravariant f where
  contramap :: (a -> b) -> f b -> f a
```

Notice how `contramap` is almost equivalent to `fmap`, but that the direction of arrows (functions) is flipped. A function of type `a -> b` becomes a function of type `F(b) -> F(a)`.

Haskell's standard library contains several other kinds of functors lifted from category theory:

- `Bifunctor` is a combination of 2 covariant functors, kind of like a pair `Functor`'s.
- `Profunctor` is a combination of a covariant functor and a contravariant functor. Interesting for their use in [lenses](https://github.com/hablapps/DontFearTheProfunctorOptics).
- `Applicative` is [essentially](https://stackoverflow.com/a/35047673) a [monoidal functor](https://en.wikipedia.org/wiki/Monoidal_functor). You may know that every `Monad` is also `Applicative`, and `Applicative` is a kind of weaker monad, which is what makes this abstraction interesting. Alas, these are beyond the scope of this post.
- Probably even more that I don't know of...

# Natural transformations

I've described how functors are mappings between categories. Before moving on to monads, I should also mention mappings between functors. These are known as _natural transformations_. I'll write these as $$N_a : F(a) \rightarrow G(a)$$ where $$N$$ is a natural transformation from functor $$F$$ to functor $$G$$. $$N_a$$ is called the _component_ of $$N$$ at $$a$$. This is the concrete arrow of $$N$$ that applies to object $$a$$. 

We can express natural transformations quite directly in Haskell - they are just polymorphic functions. Here's an example using our `Identity` functor implementation from earlier:

```hs
identityToMaybe :: Identity a -> Maybe a
identityToMaybe (Identity a) = Just a
```

This particular function is a natural transformation from the Identity functor to the Maybe functor. The components of such a natural transformation are concrete instantiations of the polymorphic function, such as:

```hs
-- "component at Boolean"
identityToMaybe :: Identity Boolean -> Maybe Boolean

-- "component at [Integer]
identityToMaybe :: Identity [Integer] -> Maybe [Integer]
```

# `Monad` is almost $$Monad$$

For the same reason that Haskell's `Functor` is not quite a full-blown category-theoretic functor, Haskell's `Monad` can never be full-blown. It comes a tad closer than in the case of functor, though.

In category theory, a monad is typically defined in terms of an endofunctor $$F: C \rightarrow C$$ together with 2 _natural transformations_ $$r: I_C \rightarrow F$$ and $$j: (F \times F) \rightarrow F$$ where $$I_C$$ is the identity functor from $$C$$ to $$C$$, and $$F \times F$$ is the _functor composition_ of $$F$$ with itself. Just as we could use $$\bullet$$ to compose 2 arrows into a new arrow, we can use $$\times$$ to compose 2 functors into a new functor. Additionally, a few monad laws must hold:

- $$j \bullet Fj = j \bullet jF$$
- $$j \bullet Fr = j \bullet rF = I_F$$

Where $$I_F$$ is the identity natural transformation from $$F$$ to $$F$$. 

The notation $$Fj$$ means a natural transformation whose components $$(Fj)_a$$ are given by $$F(j_a)$$, ie. selecting the specific arrow from $$j$$ which applies to object $$a$$, _and then_ applying functor $$F$$ to the result. Similarly, $$jF$$ is a natural transformation with components $$(jF)_a = j_{F(a)}$$, ie. applying the functor $$F$$ to object $$a$$ first, and then using the resulting object to select an arrow from $$j$$.

Let's take a specific monad, `Maybe`, and see if we can write an implementation of $$r$$ and $$j$$ that seems to make sense. In the context of $$Hask$$, the natural transformation $$r$$ should be a function from the `Identity` functor to some other `Functor`. Since we are using `Maybe` as an example, this `Functor` is just `Maybe`. We get the following:

```hs
r :: Identity a -> Maybe a
r (Identity a) = Just a
```

Since `Identity a` carries no more information than `a`, let's get rid of it:

```hs
r :: a -> Maybe a
r a = Just a
```

This function lets us _lift_ a value of any type into our monad.

Next, recall that the natural transformation $$j$$ mapped from some composition of functors $$F \times F$$ to functor $$F$$. In Haskell, we would write $$F \times F$$ as `Functor f => f (f a)`, or `Maybe (Maybe a)` for the concrete case of `Maybe`. We get the following:

```hs
j :: Maybe (Maybe a) -> Maybe a
j (Nothing) = Nothing
j (Just (Nothing)) = Nothing
j (Just (Just a)) = Just a
```

This function lets us remove one level of monadic structure, _flattening_ a nested monad in a meaningful way. For the `Maybe` monad, it works sort of like a logical and.

With these implementations in mind, let's take a look at how Haskell's `Monad` typeclass looks (omitting a few irrelevancies):

```hs
class Applicative m => Monad m where
  (>>=) :: m a -> (a -> m b) -> m b
  return :: a -> m a
```

You can pretty easily convince yourself that the `r` function is precisely equivalent to the `return` function on this typeclass. But what about the `j` function? It is nowhere to be found. This confused me quite a bit when I was first learning about monads. It turns out that this missing function does exist in the standard library - just not on the `Monad` typeclass itself. This function is called `join`:

```hs
join :: Monad m => m (m a) -> m a
```

The missing piece of the puzzle is some nifty identities, which relate `join` and `>>=` (also known as the "bind" operator) together:

```hs
-- We can write >>= in terms of join and fmap:
(m >>= f) == (join (fmap f m))

-- Or join in terms of >>= and the identity function:
(join m) == (m >>= id)
```

Using this, we could write a valid instance of `Monad` for `Maybe` as so:

```hs
instance Monad Maybe where
    m >>= f = j (fmap f m)
    return = r
```

That's all fine and good, but what about the 2 monad laws from earlier? Does our implementation satisfy these? Let's take another look at the first law, $$j \bullet Fj = j \bullet jF$$, and translate each piece of the equation into Haskell:

- The composition operator $$\bullet$$ is function composition '`.`'.
- The natural transformation $$j$$ is the `j` function from earlier.
- The $$F$$ construct in $$Fj$$ translates to `fmap`. We are applying our functor $$F$$ to the natural transformation $$j$$, which in Haskell was just a function. Remember, `fmap` is the portion of a functor that maps functions to functions.
- The $$F$$ construct in $$jF$$ disappears. Here, the functor $$F$$ is applied to the objects (types) in $$Hask$$, turning any type `a` into the type `Maybe a`. We use this type to select the component of $$j$$ to apply. Concretely, we select the instantiation of `j` which applies to `Maybe` values - this is just `j`.

Putting all of this together, we can translate the law into Haskell like so:

```hs
j . fmap j == j . j
```

Cool. Does it hold? Well, let's check every possibility:

```hs
(j . j) (Just (Just (Just 42))) == Just 42
(j . j) (Just (Just Nothing)) == Nothing
(j . j) (Just Nothing) == Nothing
(j . j) Nothing == Nothing

(j . fmap j) (Just (Just (Just 42))) == Just 42
(j . fmap j) (Just (Just Nothing)) == Nothing
(j . fmap j) (Just Nothing) == Nothing
(j . fmap j) Nothing == Nothing
```

Yep, it checks out! Following similar logic, we can translate the second of the 2 laws into Haskell as:

```hs
j . fmap r == j . r == id
```

Which also holds for all possibilities. Both `(j . fmap r)` and `(j . r)` will do absolutely nothing when applied to a `Maybe` value.

# Monoid in the category of endofunctors

You might have heard the meme-worthy phrase "a monad is simply a monoid in the category of endofunctors" before. I don't intend to give a full explanation of what this phrase means, but I'd like to build some intuition. Most of the words in this phrase should be familiar by now, but I haven't yet defined what a _monoid_ is. The classical definition of a monoid is:

- A set S
- ... equipped with a binary operator $$\otimes$$
- ... which is associative, $$(a \otimes b) \otimes c = a \otimes (b \otimes c)$$
- ... and has an _neutral_ element $$ne$$ such that for all $$a \in S$$, we have $$a \otimes ne = ne \otimes a = a$$

Typical examples include:

- The set of natural numbers with $$+$$ as the operator, and $$0$$ as the neutral element.
- The set of natural numbers with $$*$$ as the operator, and $$1$$ as the neutral element.
- The set of strings with string concatenation as the operator, and "" as the neutral element.

In the last section, we derived a few laws for monads, written in Haskell:

```hs
j . fmap j == j . j
j . fmap r == j . r == id
```

Using the aforementioned standard library functions, we can generalize these to work for any monad:

```hs
join . fmap join == join . join
join . fmap return == join . return == id
```

If you stare at these laws for a moment, you might notice that they look sort of similar to the requirements for a monoid.

The first law is roughly saying "If we have a stack of 3 nested monadic values, it doesn't matter if we first use `join` to flatten the innermost 2 values (the left-hand side), or the 2 outermost values (the right-hand side)". In other words, it doesn't matter how we group our `join`'s - this is the essence of associativity.

The second law is saying "If we inject an extra monadic layer into a monadic value using `fmap return`, and then flatten using `join` (left-hand side), _or_ we wrap a monadic value in another monadic layer using `return`, and then flatten with `join` (middle part of the equation), we have achieved nothing. Since we achieved nothing, both of these operations are equivalent to the identity function `id`". Here, `return` plays the role of a monoidal neutral element, and the law describes something similar to left and right identity.

This intuitive explanation should hopefully give a hint as to why we can consider monads to be a specific kind of monoid.

# Don't break the law

So far, I've shed some light on the differences between some common abstractions in Haskell, and their category-theory equivalents. I've been insinuating that the Haskell counterparts of these abstractions are proper subsets of category-theory concepts. However, for each of the abstractions I've described so far, this hinges on the adherence to some _laws_, such as the monad laws described in the previous section.

Haskell isn't capable of enforcing these laws! For all of these abstractions, we can write implementations that type check but have absolutely nothing to do with category theory.

To illustrate this principle, let's take a look at some properties of category-theoretic functors that I chose to omit earlier. For any functor $$F: A \rightarrow B$$, the following laws must hold:

- $$F(I_a) = I_{F(a)}$$ where both $$I$$'s are identity arrows in their respective categories. Put simply, functors must preserve identity.
- $$F(x \bullet y) = F(x) \bullet F(y)$$, for all arrows $$x$$ and $$y$$ in category $$A$$. Put simply, functors must preserve composition.

In Haskell, these laws are spelled:

```hs
fmap id == id
fmap f . fmap g == fmap (f . g)
```

Now consider the following botched implementation of the `Functor` typeclass for `Maybe`:

```hs
instance Functor Maybe where
    fmap a b = Nothing
```

This type checks just fine. Let's check if the first law holds:

```hs
fmap id (Just a) == Nothing
id (Just a) == Just a
```

Oh no! It doesn't. Interestingly, the second law does actually hold, because both sides of the equation just evaluate to a function that always returns `Nothing`.

Of course, these kinds of botched implementations are not common and are considered buggy code, but they _are_ expressible, further distancing Haskell from a category-theoretic foundation.

# Some links

- [https://wiki.haskell.org/Hask](https://wiki.haskell.org/Hask)

- [https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

- [https://1lab.dev/#category-theory](https://1lab.dev/#category-theory)

- [https://ncatlab.org/nlab/show/whiskering](https://ncatlab.org/nlab/show/whiskering)

- [https://stackoverflow.com/questions/3870088/a-monad-is-just-a-monoid-in-the-category-of-endofunctors-whats-the-problem](https://stackoverflow.com/questions/3870088/a-monad-is-just-a-monoid-in-the-category-of-endofunctors-whats-the-problem)

- [https://stackoverflow.com/questions/45829110/monad-laws-expressed-in-terms-of-join-instead-of-bind](https://stackoverflow.com/questions/45829110/monad-laws-expressed-in-terms-of-join-instead-of-bind)

- [https://math.andrej.com/2016/08/06/hask-is-not-a-category/](https://math.andrej.com/2016/08/06/hask-is-not-a-category/)
