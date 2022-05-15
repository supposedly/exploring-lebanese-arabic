/* eslint-disable template-curly-spacing */
/* eslint-disable no-multi-spaces */
import {Any, Function, Union} from "ts-toolbelt";
import {cheat, Base, newAlphabet, FillDefaults} from "./common";
import {
  Of, EnumOf, toEnum,
  Articulator, Location, Manner,
  $Articulator, $Location, $Manner,
  $Ps as $P, $Gn as $G, $Nb as $N,
  Ps, Gn, Nb, TamToken, Wazn, PPWazn, VoiceToken,
} from "../enums";

export const NAME = `underlying`;
type $<T> = Function.Narrow<T>;

export type Types = {
  consonant: Consonant
  vowel: Vowel
  suffix: Suffix
  modifier: Modifier
  delimiter: Delimiter
  pronoun: Pronoun
  af3al: Af3al
  idafe: Idafe
  number: Number
  participle: Participle
  tif3il: Tif3il
  verb: Verb
};
// Not a fan of this duplication
// At least I can use EnumOf<...> to statically verify it but still :/
export const $Type: EnumOf<typeof NAME, keyof Types> = toEnum(NAME, `
  consonant
  vowel
  suffix
  modifier
  delimiter
  pronoun
  af3al
  idafe
  number
  participle
  tif3il
  verb
`);
export type Type = typeof $Type;

export interface Segment<V, S> extends Base<Of<Type>, V> {
  type: Of<Type>
  meta?: Record<string, any>
  features?: Readonly<Record<string, any>>
  value: V
  symbol: S
}

export interface Template<V> extends Base<Of<Type>, V> {
  type: Of<Type>
  meta?: Record<string, any>
  features?: Readonly<Record<string, any>>
  value: V
}

type StringSegment<V, S> = Segment<
  V extends number ? `${V}` : V,
  S extends number ? `${S}` : S
>;

export interface Consonant<V = unknown, S = unknown, Features = unknown> extends StringSegment<V, S> {
  type: Type[`consonant`]
  meta: {
    weak: boolean
  }
  features: Readonly<FillDefaults<Features, {
    emphatic?: false
    semivocalic?: false
    voiced?: false
    isNull?: false
    articulator: Of<Articulator>
    location: Of<Location>
    manner: Of<Manner>
  }>>
}

export interface Vowel<V = unknown, S = unknown, Features = unknown> extends StringSegment<V, S> {
  type: Type[`vowel`]
  meta: {
    lengthOffset: number
    stressed: boolean
  }
  features: Readonly<FillDefaults<Features, {
    length: V extends {length: number} ? V[`length`] : number
    diphthongal?: false
    rounded?: false
    nasalized?: false
  }>>
}

export interface Suffix<V = unknown, S = unknown> extends StringSegment<V, S> {
  type: Type[`suffix`]
}

export interface Modifier<V = unknown, S = unknown> extends StringSegment<V, S> {
  type: Type[`modifier`]
  features?: {}
}

export interface Delimiter<V = unknown, S = unknown> extends StringSegment<V, S> {
  type: Type[`delimiter`]
  features?: {}
}

export interface Pronoun<
  P extends Of<Ps> = Of<Ps>,
  N extends Of<Nb> = Of<Nb>,
  G extends Of<Gn> = Of<Gn>,
> extends Segment<`${P}${G}${N}`, undefined> {
  type: Type[`pronoun`]
  features: Readonly<{
    person: P,
    number: N,
    gender: G
  }>
}

// todo: maybe different file for this ex-initializer stuff? or idk
export interface Af3al<V = unknown> extends Template<V> {
  type: Type[`af3al`]
}

export interface Idafe<V = unknown> extends Template<V> {
  type: Type[`idafe`]
}

export interface Number<V = unknown> extends Template<V> {
  type: Type[`number`]
}

export interface Participle<V = unknown> extends Template<V> {
  type: Type[`participle`],
  features: Readonly<{
    subject: Pronoun
    voice: VoiceToken
    wazn: PPWazn
  }>
}

export interface Tif3il<V = unknown> extends Template<V> {
  type: Type[`tif3il`]
}

export interface Verb<V = unknown> extends Template<V> {
  type: Type[`verb`]
  features: Readonly<{
    subject: Pronoun
    tam: TamToken
    wazn: Wazn
  }>
}

export type SymbolOf<K extends keyof any, T extends Record<K, unknown>> = T[K] extends {symbol: string} ? T[K][`symbol`] : K;
export type ValueOf<K extends keyof any, T extends Record<K, unknown>> = T[K] extends {value: string} ? T[K][`value`] : K;
// lowercase:
export type LowercaseSymbolOf<K extends keyof any, T extends Record<K, unknown>> = K extends string ? Lowercase<SymbolOf<K, T>> : SymbolOf<K, T>;
export type LowercaseValueOf<K extends keyof any, T extends Record<K, unknown>> = K extends string ? Lowercase<ValueOf<K, T>> : ValueOf<K, T>;

export type SymbolValueAnd<T> = {symbol?: string, value?: string} & T;
export type SymbolValueAndFeaturesOf<T, U extends string = never> = Record<
  string,
  T extends {features: Readonly<Record<string, unknown>>}
    ? SymbolValueAnd<Partial<T[`features`]>> & Pick<T[`features`], U>
    : SymbolValueAnd<{}>
>;

export function consonants<
  T extends SymbolValueAndFeaturesOf<Consonant, `articulator` | `location` | `manner`>,
>(
  o: $<T>,
): $<{[K in keyof typeof o]: Consonant<ValueOf<K, typeof o>, SymbolOf<K, typeof o>, typeof o[K]>}> {
  return Object.fromEntries(Object.entries(o as T).map(([k, v]) => [
    k,
    {
      type: $Type.consonant,
      value: v.value ?? k,
      symbol: v.symbol ?? k,
      meta: {
        weak: false,
      },
      features: {
        articulator: v.articulator,
        location: v.location,
        manner: v.manner,
        emphatic: v.emphatic ?? false,
        semivocalic: v.semivocalic ?? false,
        voiced: v.voiced ?? false,
        isNull: v.isNull ?? false,
      },
    } as Consonant,
  ])) as any;
}

export function vowels<
  T extends SymbolValueAndFeaturesOf<Vowel>,
>(
  o: $<T>,
): $<{[K in keyof typeof o]: Vowel<ValueOf<K, typeof o>, SymbolOf<K, typeof o>, typeof o[K]>}> {
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k,
    {
      type: $Type.vowel,
      value: v.value ?? k,
      symbol: v.symbol ?? k,
      meta: {
        lengthOffset: 0, // 1 = elongated, -1 = contracted (don't think this is useful but it was already there lol)
        stressed: false,
      },
      features: {
        length: v.length ?? k.length,
        diphthongal: v.diphthongal ?? false,
        nasalized: v.nasalized ?? false,
        rounded: v.rounded ?? false,
      },
    } as Vowel,
  ])) as any;
}

export function suffixes<T extends SymbolValueAndFeaturesOf<Suffix>>(
  o: $<T>,
): {[K in keyof typeof o]: Suffix<LowercaseValueOf<K, $<T>>, SymbolOf<K, $<T>>>} {
  return Object.fromEntries(Object.entries(o as T).map(([k, v]) => [
    k,
    {
      type: $Type.suffix,
      value: (v.value ?? k).toLowerCase(),
      symbol: v.symbol ?? k,
    } as Suffix,
  ])) as any;
}

export function modifiers<T extends SymbolValueAndFeaturesOf<Modifier>>(
  o: $<T>,
): $<{[K in keyof typeof o]: Modifier<LowercaseValueOf<K, typeof o>, SymbolOf<K, typeof o>>}> {
  return Object.fromEntries(Object.entries(o as T).map(([k, v]) => [
    k,
    {
      type: $Type.modifier,
      value: (v.value ?? k).toLowerCase(),
      symbol: v.symbol ?? k,
    } as Modifier,
  ])) as any;
}

export function delimiters<T extends SymbolValueAndFeaturesOf<Delimiter>>(
  o: $<T>,
): $<{[K in keyof typeof o]: Delimiter<LowercaseValueOf<K, typeof o>, SymbolOf<K, typeof o>>}> {
  return Object.fromEntries(Object.entries(o as T).map(([k, v]) => [
    k,
    {
      type: $Type.delimiter,
      value: (v.value ?? k).toLowerCase(),
      symbol: v.symbol ?? k,
    } as Delimiter,
  ])) as any;
}

type PronounString<S> =
  S extends `${infer P}${infer G}${infer N}` ?
    P extends Of<Ps> ? G extends Of<Gn> ? N extends Of<Nb>
      ? Pronoun<P, N, G>
      : never : never : never
    : never;
type PronounStringArray<T extends string[]> = {[K in T[Union.Select<keyof T, number>]]: PronounString<K>};

export function pronouns<T extends `${Of<Ps>}${Of<Gn>}${Of<Nb>}`[]>(p: T): PronounStringArray<T> {
  return Object.fromEntries(
    p.map(s => [s, {
        type: $Type.pronoun,
        value: s,
        /* symbol: none */
        features: {
          person: s[0],
          gender: s[1],
          number: s[2],
        },
      } as PronounString<typeof s>]),
  ) as any;
}

export default newAlphabet(
  cheat<Types>($Type),  // see cheat()'s function comment
  {
    consonant: consonants({
      h: {
        location: $Location.glottis,
        articulator: $Articulator.throat,
        manner: $Manner.fricative,
        voiced: false,
      },
      2: {
        location: $Location.glottis,
        articulator: $Articulator.throat,
        manner: $Manner.plosive,
        voiced: false,
      },
      7: {
        location: $Location.pharynx,
        articulator: $Articulator.throat,
        manner: $Manner.fricative,
        voiced: false,
      },
      3: {
        location: $Location.pharynx,
        articulator: $Articulator.throat,
        manner: $Manner.approximant,
        voiced: true,
      },
      5: {
        location: $Location.uvula,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: false,
      },
      gh: {
        symbol: `9`,
        location: $Location.uvula,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: true,
      },
      q: {
        location: $Location.uvula,
        articulator: $Articulator.tongue,
        manner: $Manner.plosive,
        voiced: false,
      },
      k: {
        location: $Location.velum,
        articulator: $Articulator.tongue,
        manner: $Manner.plosive,
        voiced: false,
      },
      g: {
        location: $Location.velum,
        articulator: $Articulator.tongue,
        manner: $Manner.plosive,
        voiced: true,
      },
      y: {
        location: $Location.palate,
        articulator: $Articulator.tongue,
        manner: $Manner.approximant,
        voiced: true,
        semivocalic: true,
      },
      sh: {
        symbol: `x`,
        location: $Location.bridge,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: false,
      },
      j: {
        location: $Location.bridge,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: true,
      },
      r: {
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.flap,
        voiced: true,
      },
      R: {  // the """""""emphatic""""""""" r
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.flap,
        voiced: true,
      },
      l: {
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.approximant,  // lateral don't real
        voiced: true,
      },
      s: {
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: false,
      },
      Z: { // to be used for z <- S (i guess :/)
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: true,
      },
      z: {
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: true,
      },
      n: {
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.nasal,
        voiced: true,
      },
      t: {
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.plosive,
        voiced: false,
      },
      d: {
        location: $Location.ridge,
        articulator: $Articulator.tongue,
        manner: $Manner.plosive,
        voiced: true,
      },
      th: {
        symbol: `8`,
        location: $Location.teeth,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: false,
      },
      dh: {
        symbol: `6`,
        location: $Location.teeth,
        articulator: $Articulator.tongue,
        manner: $Manner.fricative,
        voiced: true,
      },
      f: {
        location: $Location.teeth,
        articulator: $Articulator.lips,
        manner: $Manner.fricative,
        voiced: false,
      },
      v: {
        location: $Location.teeth,
        articulator: $Articulator.lips,
        manner: $Manner.fricative,
        voiced: true,
      },
      w: {
        location: $Location.lips,
        articulator: $Articulator.lips,
        manner: $Manner.approximant,
        voiced: true,
        semivocalic: true,
      },
      m: {
        location: $Location.lips,
        articulator: $Articulator.lips,
        manner: $Manner.nasal,
        voiced: true,
      },
      b: {
        location: $Location.lips,
        articulator: $Articulator.lips,
        manner: $Manner.plosive,
        voiced: true,
      },
      p: {
        location: $Location.lips,
        articulator: $Articulator.lips,
        manner: $Manner.plosive,
        voiced: false,
      },
    }),
    vowel: vowels({
      a: {symbol: `a`},
      aa: {symbol: `A`},
      AA: {symbol: `&`},  // lowered aa, like in شاي
      ae: {symbol: `{`},  // (possibly supplanted by `^`) 'foreign' ae, like in نان or فادي
                          // (hate xsampa for making { a reasonable way to represent this lmao)

      I: {symbol: `1`},  /* lax i, specifically for unstressed open syllables
                          * like null<i<a when still in the medial stage, e.g. for ppl with kitIr كتير
                          * aaand for stuff like mixYk/mixEke and mixAn (when not something like mxYk and mxAn)
                          */
      i: {symbol: `i`},  // default unspecified-tenseness i (= kasra)
      ii: {symbol: `I`},

      U: {symbol: `0`},  /* lax u, specifically for unstressed open syllables
                          * like l08C instead of lu8C (is that a thing?)
                          */
      u: {symbol: `u`},  // default unspecified-tenseness u (= damme)
      uu: {symbol: `U`},

      e: {symbol: `e`},  /* word-final for *-a, like hYdIke
                          * plus undecided on e.g. hEdIk vs hedIk (or just hYdIk?) for the short pron of هيديك
                          * .......or h1dIk lol
                          * also possibly for loans like fetta فتا or elI" إيلي
                          */
      ee: {symbol: `E`},

      o: {symbol: `o`},  // motEr?
      oo: {symbol: `O`},

      ay: {symbol: `Y`, diphthongal: true},
      aw: {symbol: `W`, diphthongal: true},
    }),
    suffix: suffixes({
      // fem suffix is its own thing bc -a vs -e vs -i variation
      c: {value: `fem`},
      // not sure if this is a good idea?
      // (it can instead just be `c.Dual` / `c=`)
      // FemDual: {
      //   symbol: `<`,
      //   value: `fdual`
      // },
      C: {value: `fplural`},
      // dual suffix is its own thing bc -ayn/-een vs -aan variation (per Mekki 1984)
      Dual: {symbol: `=`},  // equals sign bc it's two lines
      // plural suffix is its own thing bc -iin-l- vs -in-l- variation, or stuff
      // like meshteryiin vs meshtriyyiin vs meshtriin
      Plural: {symbol: `+`},  // plus sign because plural is uhh... more
      // fossilized "dual" suffix like 3YnYn => 3Yn# and 7awAlYn => 7awAl# or 7awal#:
      AynPlural: {
        symbol: `#`,  // kindasortamaybenot like a mix between + and = lol
        value: `ayn`,
      },
      // adverbial -an, ـًا
      An: {symbol: `@`},  // bc i needed an unused symbol that still resembles an A
      // nisba suffix ـي
      // special treatment necessary bc it alternates between -i and -iyy-
      // (and maybe -(consonant)%= can become -yIn ~ -In instead of -iyyIn too?)
      // also-also bc it has effects like معمار mi3mar => معماري mi3meri
      // (still don't know how to handle """emphatic""" R btw...)
      Iyy: {symbol: `%`},  // ahahahaha get it
      // -ji suffix... has to be separate from $`j.Iyy` because this one contracts preceding vowels
      Jiyy: {
        symbol: `G`,  // hahahahahaha
      },
      // -sh suffix (this one also contracts preceding vowels in some dialects)
      Negative: {
        symbol: `X`,  // capital X because normal sh is a lowercase x
      },
    }),
    delimiter: delimiters({
      Of: {  // introduces idafe pronouns
        symbol: `-`,
        value: `genitive`,
      },
      Object: {  // introduces verbs and active participles
        symbol: `.`,
      },
      PseudoSubject: {  // s`arr~3ms/s`all~3ms, badd~3ms/bidd~3ms, أوعك أصحك etc
        symbol: `~`,
        value: `pseudo-subject`,
      },
      Dative: {  // this stands for the dative L
        symbol: `|`,
      },
    }),
    modifier: modifiers({
      Emphatic: {
        symbol: `*`,
      },
      Stressed: {  // goes after the stressed vowel; only use if the word's stress is not automatic
        symbol: `"`,
      },
      Nasalized: {  // nasalized and, if final, stressed; 2ONrI" lOsyON kappitAN
        symbol: `N`,
      },
      // marks something as fus7a or like elevated (goes into ctx i guess)
      // e.g. for me T = /t/ while T^ = /s/ (and both are interdental for someone who preserves interdentals)
      // or -I = /e/ while -I^ = /i/
      // orr 3Y^n = /3ayn/ (letter name) while 3Yn = /3e:n/ (eye)
      // also gonna use this for `hY^k (l yWm)`
      // i guess this actually supplants `ae` because I can do aa^ instead...
      // ae could maybe still be useful for loans like نان though? not sure
      // in any case having too many symbols is great, too little is worse
      Fus7a: {
        symbol: `^`,
      },
    }),
    pronoun: pronouns([
      `${$P.first }${$G.masc  }${$N.singular}`,  // -e according to loun
      `${$P.first }${$G.fem   }${$N.singular}`,  // -i according to loun
      `${$P.first }${$G.common}${$N.singular}`,  // the normal neutral one idk
      `${$P.first }${$G.common}${$N.plural  }`,
      `${$P.second}${$G.masc  }${$N.singular}`,
      `${$P.second}${$G.fem   }${$N.singular}`,
      `${$P.second}${$G.masc  }${$N.plural  }`,    // -kVm in case it exists in some southern dialect
      `${$P.second}${$G.fem   }${$N.plural  }`,    // ditto but -kVn
      `${$P.second}${$G.common}${$N.plural  }`,
      `${$P.third }${$G.masc  }${$N.singular}`,
      `${$P.third }${$G.fem   }${$N.singular}`,
      `${$P.third }${$G.masc  }${$N.plural  }`,    // ditto but -(h)Vm
      `${$P.third }${$G.fem   }${$N.plural  }`,    // ditto but -(h)Vn
      `${$P.third }${$G.common}${$N.plural  }`,

      /* forms that don't exist */
      `${$P.first }${$G.masc  }${$N.dual    }`,
      `${$P.first }${$G.fem   }${$N.dual    }`,
      `${$P.first }${$G.common}${$N.dual    }`,
      `${$P.first }${$G.masc  }${$N.plural  }`,
      `${$P.first }${$G.fem   }${$N.plural  }`,
      `${$P.second}${$G.common}${$N.singular}`,  // maybe in the future?
                                                // (whether intentionally or just bc of -e inevitably dropping out)
      `${$P.second}${$G.masc  }${$N.dual    }`,
      `${$P.second}${$G.fem   }${$N.dual    }`,
      `${$P.second}${$G.common}${$N.dual    }`,
      `${$P.third }${$G.common}${$N.singular}`,  // maybe in the future?
      `${$P.third }${$G.masc  }${$N.dual    }`,
      `${$P.third }${$G.fem   }${$N.dual    }`,
      `${$P.third }${$G.common}${$N.dual    }`,
    ]),
    af3al: {},
    augmentation: {},
    idafe: {},
    number: {},
    participle: {},
    tif3il: {},
    verb: {},
  },
);