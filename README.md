# [Dialect museum](https://write.lebn.xyz)

This project is **on hiatus** until I get a job :) In its current state it's also incomplete in that (1) there's no UI and (2)
there are still a couple breaking bugs left to resolve, but I'm going to save my energy for now because what it's really hankering
for is a full, ground-up redesign. My estimate's that it's 4&ndash;6 months away (in other words my estimate is 4 but really
it'll probably hit 6) from reaching the point where it works and is presentable, but its actual finish date depends on when I
can start those 4&ndash;6 months and how much time I can devote to the project during them. This README documents the current
state of things!

## What is this?

The short answer: I set out to make a tool to help you explore the unique features of different
dialects of Lebanese Arabic, which is helpful for learners and for native speakers who are curious about that heritage.
Along the way, the project turned into a way-more-general tool that can be used to give that treatment to any language at all.

There are a lot of dimensions that language varieties can vary in, like the sentence structures they use, their sound systems,
the way they change words for different grammatical reasons, and their vocabulary. This project is good at two of those,
give or take, plus an unexpected challenger for good measure:

1. it's mostly about sounds, aka phonology and phonetics,
2. it also allows you to represent morphology, the way words change for grammatical purposes (e.g. verb conjugations),
3. and it even lets you explore different writing systems using the exact same tools.

This mostly stems from a desire to give dictionaries a run for their money. Historically, dictionaries haven't documented
much more than a couple standard or standard-ish accents of whatever language they're for, and I'd bet it's because manually
punching in all of the different pronunciation variants you can think of is really time-consuming and super msitake-prone.
But what if we could outsource it to a computer instead?

- **Step 1.** Obtain computer.
- **Step 2.** Devise magic representation of our language that encodes **every** variety in one go. That way we don't have to type a bunch of different ones out ourselves.
- **Step 3.** Devise rules we can apply to transform magic representation into any variety we want.
- **Step 4.** Politely ask computer to do it for us.

In broad strokes, steps 2 and 3 are the idea behind [comparative reconstruction](https://en.wikipedia.org/wiki/Comparative_method).
Language change tends to be regular enough that, for any 2+ language varieties that used to be one single language in the past,
you can often suss out the changes they each must've undergone to get to where they are. Rewinding these changes gets you the magic from
step 2, and you can unrewind them as in step 3 to get from there to any variety you want to check out.

<details>
<summary><b>But you can take shortcuts!</b></summary>
The fun part is that corners can be cut here! You don't have to replay diachronic changes
step-by-step if you don't need to be 100% faithful to the exact chronology in order to produce the same
synchronic result. For example, these are four steps that likely happened on the way to my dialect of Lebanese Arabic:

1. The historic sound /r/ gains [emphasis](https://en.wikipedia.org/wiki/Emphatic_consonant) by default, becoming
   phonemically ṛ (meaning /rˤ/). This did not take place following a short *i* or long *ī*, where the sound remained /r/.
   This affected and was evidenced by the behavior of the feminine suffix, which in Levantine Arabic dialects is
   characterized by varying between a high vowel like *-e* and a low one like *-a* depending on the preceding sound's
   emphasis: "tree" would've been _\*šaǧaṛa_, "gums" would've been _\*nīre_, "she thinks" would've been _\*m(V)fakkire_,
   "she's decided" would've been _\*m(V)qaṛṛire_.
2. Short, unstressed high vowels syncopate in open syllables, although not between two consonants with identical PoA.
   We now get _\*mfakkre_, _\*mqarrire_, still attested in some more-southern Levantine varieties.
3. *r* regains its emphasis in places where it's no longer after an *i*, giving  _\*mfakkṛa_, _\*mqaṛṛire_.
4. This analogically carries over to all participles (those two words are participles), even when the *i* actually never
   dropped out:  _\*mfakkṛa_, _\*mqaṛṛiṛa_! The current forms in my dialect are *mfakkra*, *mʔarira*.

When it comes to reaching the two forms *mfakkra*, *mʔarira* from original _\*mufakkira_, _\*muqarrira_ (these are
reconstructions for before step 1), I have two options:
1. I could replay all of those changes one by one.
2. Or I could ignore history and keep only step 1, where *r* becomes *ṛ* by default across the board. To get to step 4 directly from here,
   we can say that in my dialect and dialects like mine, it becomes *ṛ* even if it is after a short *i*.

While it's absolutely possible (and absolutely really cool) to use this project to model historical sound changes, that's not a
must if your real concern is to document a language's varieties as they exist today. You can instead focus on devising a model that's
easy to represent within the constraints of this framework as long as it achieves the correct end result.
</details>

### History and prior art
One way to conceive of this project is as a kind of [sound change applier](https://linguifex.com/wiki/Guide:Conlanging_tools#Sound_change_appliers).
It spent a long time not knowing it was one, but I think any kind of linguistics-y tool that tries to transform things into other things
will carcinize soon enough into an advanced, featural SCA. Personally I was really surprised to do a proper review of the SCA toolspace and find how
much depth people have put into these things. A couple particular giants I think I should pay respects to are [Phonix](https://gitlab.com/jaspax/phonix)
and [Lexurgy](https://www.meamoria.com/lexurgy/html/sc-tutorial.html). You'll notice lots of convergences between their design and what's below!

### Why are there like 600 commits?
Between school and the horrors of life, it took me a long time to hit on a workable design for this project. The current architecture
is the result of two months of thinking and coding and thinking and coding, but it's built atop a good couple years of intermittently
messing around and crash-landing. Glad to finally be here! There's only more work ahead.

## What's in a language

Not much, what's in a language with you?

There are three parts to defining a language with this thing. You have to get your **alphabets** in order, then you have to write **rule packs**, and finally
you can build off of those into specific **profiles** of individual speakers of a dialect.

Let me go over what each of those things are. If you want to try and go from there to get this thing working for your own language, my present advice is **don't.**

### How to add your own language

Don't.

> [!IMPORTANT]  
> Don't!

The beast just isn't ready yet in its current state, like I said at the top of this README. This is the very first draft of a working design, and
because it's a first draft there are a lot of pain points you'll run into. I'll go into more detail below, but the main ones are that the type system
randomly breaks in at least two (fortunately avoidable) cases and is weirdly slow in at least one other (`(un-) × (fortunately avoidable)`) case, and the
part where you actually define your language is (1) kind of disappointingly inflexible, so you have to copy/paste your entire setup to create another one
with minor variations, and (2) missing some big quality-of-life features that make working with it a little bit demotivating. See tracking issues
[#6](https://github.com/supposedly/dialect-museum/issues/6) and [#7](https://github.com/supposedly/dialect-museum/issues/7).

### How to add your own language if you really, really want to and also want to file a boatload of bug reports

<!-- CC0 :) -->
![Picture of a bug, namely a weevil, that's captioned "FEATURE"](https://user-images.githubusercontent.com/32081933/281660206-60f819eb-3dbf-4adc-9250-452a5af6c262.png)

Promise? In that case, you should fork this repository and follow the instructions below to add your language to the `src/languages` folder.

## Under-the-hood documentation

This project is written in [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html). It uses TypeScript's type system
to make sure, as much as possible, that you're writing exactly what you mean to write. The instructions below are mostly tailored to the editor
[Visual Studio Code](https://code.visualstudio.com/), but if you're comfortable enough with programming that you're set on using another IDE or editor,
I'll be assuming that that means you're comfortable translating any VSCodeisms (e.g. `Ctrl+.` for autocomplete) into their equivalents in your own toolchain.

One ideal for this project is for it not to require you to know any programming beyond what's required for it itself -- a **domain-specific-language**
sort of walled garden. As of writing, though, it does not achieve that goal :( That means the documentation below also assumes programming knowledge for now.

### Overarching model

This project works by taking **input** and applying **transformation rules** to it until there aren't any changes left to make. Your one big job is
to write those rules.

Each rule itself takes in an input and defines what output it needs to turn into. For example, a simple rule might be one that turns `z` into `gl`
and `ee` into `or`. Feeding the input `zeep` into these rules will give you the transformations: `zeep` -> `gleep` -> `glorp`.

Nice and simple. But language is complicated, and it's really hard to model complex things using raw text and simple substitution-y transformations
like those. To approach complexity, our rules are going to need to be able to make their decision based on a lot of other factors. For example:

1. *What's the current value of our input?* &mdash; This is what our two `z` -> `gl` and `ee` -> `or` rules are based on: they take
   an input with the value `z` or `ee` and transform it into something else based on that info alone.
2. *What other stuff is **around** our input?* &mdash; This is called its "environment".
3. Our input is probably the product of other rules that have applied in the past. *What did it used to look like?*
4. Lastly, and this is the toughest one to reason about: what will our input's environment look like **in the future**, after other rules have run?
   - This info isn't needed for every rule. I've found two solid usecases for it so far, one hacky and one actually valid. The valid one is when
     you need to write a rule with **directionality**, i.e. one that applies iteratively from right to left or left to right, which I'll sell you harder
     on below.
   - As it happens, this feature is also broken in the project's current implementation! That means that iterative stress rules are impossible to write
     efficiently for now &mdash; you have to duplicate the environment of, like, the entire word for every single stress location. Again, more later.

![Graph of nodes with different colors. On the top is a group of three nodes, each of which is linked to each of its two neighbors by an arrow. This group is connected to another group of the same sort, except this one has a lot more nodes branching out from the original middle one. Lastly, this second group connects to an even-larger third group. Going forward, these groups will be called "stages".](https://user-images.githubusercontent.com/32081933/281906398-229ec8cf-65c6-4f15-8b62-39eaccaa72c8.png)

This is a screenshot of this project's visual debugger to help you (and me, I'm not gonna lie) understand how the actual process of transforming inputs into outputs works
under the hood.

The input here is the middle node at the very top, which is an object of type "verb". That means that any rules that operate on verbs will apply to it. Between you and me,
that node also carries info inside it that doesn't show up in the debugger -- specifically, `verb` nodes also store the subject they conjugate for, their
[TAM](https://en.wikipedia.org/wiki/TAM) combo (tense, aspect, and mood), and their [root](https://en.wikipedia.org/wiki/Semitic_root) and [measure](https://en.wiktionary.org/wiki/Appendix:Arabic_verbs#Derived_stems). For this verb here, that's:

- **Subject:** They (third-person plural)
- **TAM:** Past
- **Root:** `K-T-B`
- **Measure:** `CaCaC`

The rule system's job is to conjugate this verb into its form in my dialect, `katabo`. With the model I chose for Levantine Arabic specifically, a simplified
rundown of the way my rules go about that is:

1. First, generate the verb's stem. Because it's a `CaCaC` verb with the root `K-T-B`, its past-tense stem is `katab`.
2. Then, pop out an attached pronoun on each side of that stem. These nodes will literally be of type `pronoun` and match the subject of the verb, so they won't yet store any
   information about how they're actually pronounced.
3. Transform those pronouns into the appropriate conjugation prefix and suffix. Past-tense verbs don't have prefixes in Arabic, but the other pronoun will turn into `uu`
   because that's the best underlying form we can devise for the third-person plural's suffix conjugation.
4. Finally, perform all the necessary sound shifts in whatever dialect all these rules belong to. In my case, we just need to shorten and lax the final vowel: `uu` -> `u` -> `o`.

Every single time one of these changes applies, it leaves its mark on history. That's what the vertical dimension is for: whenever a rule applies to a node,
it pops its result out as a child node and stops being available to have rules run on it &mdash; that's its child's job now.

Notice how the nodes are organized into distinct rows (connected by red and green arrows)? Here's how applying the rules works with that in mind:

1. Find the bottommost row of nodes. Let's call this the "leading" row. Load up the first node in it.
2. Have it check **all** the rules that could apply to it, one by one, until one finds that this node is an actual match (i.e. the node's value and environment and everything
   else match what the rule is looking for). Then run that rule on the node's value and eject its output into a new row below. If no rule matches, though,
   continue to step 3 without doing anything.
3. Discard this node and load up the very next one, i.e. the one right after ours. Repeat step 2 on it.
4. When you've finished checking all the nodes in the row, all of the outputs you ejected will join together to form a new leading row below. Jump to the first node in this new row and repeat step 1.
5. When no more changes can be made (i.e. no more new nodes created from running all the rules), you're done.

There's one last catch: rules are organized into **stages**. Different stages have different types of nodes associated with them, color-coded respectively
on the graph above, and accordingly they have their own groups of rules that deal in those specific types of nodes. Rules have the option to
either eject children within the same stage or to jump ahead to the next stage, so what you really have to do when you start step 1 above is find the leading
row **for each stage** and run that stage's rules starting from there.

For Levantine Arabic, my model has four stages:

1. **Word templates**. This stage encodes morphology, namely part of speech and word form, as best it can. I have a morphology
   stage for two reasons: first, different varieties of the language differ as predictably in their morphology (e.g. verb
   conjugations, participle forms, stuff like that) as they do in their phonology, and second, there are certain sound-change
   rules that only apply in certain word classes, so it'll be useful in later stages to be able to check if some node `was` a
   verb/participle/what-have-you. All node types:
     - **Verb.** Stores root, TAM, subject, and measure.
     - **Participle.** Same!
     - **Masdar,** the Arabic name for verbal nouns/gerunds. Stores root and measure.
     - **'Special' word class,** which covers some of those classes that have specific sound shifts apply to them. The ones
       I've chosen to handle are elatives, CaCāCīC and CaCāCiC words, and CaCaCe and maCCaCe nouns where the -e is the feminine
       suffix.
     - **Affix**, **pronoun**, and **morpheme boundary**, for which see below.
2. **'Underlying' sounds and morphemes**. The "sounds" aren't too important here, but they're just consonants and vowels in some
   reconstructed form that can later be used to generate different dialects' sound systems. The morphemes are really the important
   part, and the full list of those is:
     - **Affix**, namely suffixes (like the feminine suffix or the [nisba](http://allthearabicyouneverlearnedthefirsttimearound.com/p1/p1-ch3/the-nisba-adjective/) suffix) and the b- prefix used on indicative verbs. These often are the subject or
     catalyst of morpheme-specific sound shifts &mdash; for example, that b- prefix becomes m- before the first-person-plural
     prefix n- in many Levantine varieties (e.g. mnektob 'we write'), but no sequence bn- from any other source gets the same regular treatment.
     - **Pronoun**. Stores the pronoun's person, gender, and number.
     - **Morpheme boundary**. This is specifically only for the boundary between a word and some enclitic pronoun, so it store
       the type of connection it joins the two with: either it's linking the base to an object pronoun, a possessive pronoun, or
       being used with the dative *l*.
3. **Sounds.** This stage only has consonants and vowels.
4. **Display.** This **should** really be a ton of different end-stages corresponding to different writing systems,
   but all I had time to implement was this one that outputs to
   [IPA](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet). The only node type in this stage is **literal**,
   which see below.

There are also two node types shared by most stages:
1. **Boundary,** found in all stages except display. It stores a flag that indicates what type of boundary it is.
   On **sounds**, the types of boundaries available include **morpheme**, **syllable**, **word**, **pause**, and **sentence**,
   while the other stages only have the last three types (morpheme boundaries are represented by a different node on
   earlier stages for either technical reasons or technical debt reasons... don't ask me which.)
2. **Literal,** which just stores a string of literal text. Punctuation can usually be implemented by using two nodes,
   one literal with the actual punctuation followed by one boundary that indicates what kind of boundary that punctuation
   represents.

> [!NOTE]  
> This isn't some perfect model! It feels pretty clunky, actually, both in terms of the distinctions I've chosen to make
> here and in terms of the linear procession of stages that this project requires all languages to stick to.
> 
> For this specific language, I think a
> smart design under the project's constraints could actually cut this down to just three stages and remove
> the difference between the "word templates" stage and the "underlying" stage. On top of that, a smart design in terms
> of project internals might actually ditch 'stages' altogether and allow different node types to coexist in the same
> row no matter what stage of rule-application they're at (albeit with the eventual goal of getting all neighboring
> nodes to be of the same type). Much redesign work to do!

A different set of rules has to be defined for the nodes of each stage, like mentioned earlier.

#### Mocks and fixtures

I've mentioned a couple times that you sometimes want to look at what a node's value or environment looked like during
a previous stage. To help keep this practical, all rules can choose to output one of two types of nodes: a **fixture**,
which is a permanent member of the historical record, and a **mock** node, which just pretends it never existed after
it's done what it needs to in terms of outputting rules. **Fixtures** are what shows up when you search back for
a node's value at some previous stage.

#### Target
This feature is broken right now. Don't read this section.
<details>
<summary>Details</summary>
I said don't read. Anyway, another piece of info rules can check for when deciding whether to run is what a node's
<b>future</b> environment will look like. A node that checking for a rule like this will wait
until that future environment gets filled in (by rules running on other nodes) before it decides whether it can
run the rule or not. This is really useful for writing rules that run iteratively in one direction or the other,
like assigning stress in languages where the position of stress depends on factors like position and syllable
weight: you can start from the first stressable syllable, then have subsequent syllables check whether the one
before them <b>will end up</b> stressed or not before deciding whether to run their own stress rules.
</details>

#### One last thing about how rules are run

We've nearly understood the overall model in full now. The last thing I want to point out is pretty important: rules
apply in **discrete generations,** covering all nodes in the leading row before starting the next generation.

> [!NOTE]
> While this makes for a good model of applying rules to each other, it makes it tricky to formalize concepts relating
> to rule-ordering, especially bleeding/counterbleeding. I'll flesh out this part later.

### Match library

### Layers and alphabets

#### Letters

### Rule packs

### Finally: Profiles

## Web interface documentation

There's no web interface for now! At some point it'll be a repository of texts that you can choose to display in different accents and writing systems, and there'll
also be a page where you can explore morphology stuff like verb conjugation. But currently all that's there is the graph-visualization debugger.
