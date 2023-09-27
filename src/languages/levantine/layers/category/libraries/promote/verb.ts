import type {ApplyMatchAsType} from "/lib/alphabet";
import {promote as lib} from "/lib/transform";
import {category} from "../../../category";
import {letters} from "../../../underlying/letters";
import {underlying} from "../../../underlying/underlying";

function laxLongVowel(vowel: `a` | `i` | `u` | `e` | `o`): ApplyMatchAsType<typeof underlying.types.vowel> {
  switch (vowel) {
    case `a`:
      return letters.vowel.aa;
    case `i`:
    case `e`:
      return letters.vowel.ee;
    case `u`:
    case `o`:
      return letters.vowel.oo;
  }
}

function tenseLongVowel(vowel: `a` | `i` | `u`): ApplyMatchAsType<typeof underlying.types.vowel> {
  switch (vowel) {
    case `a`:
      return letters.vowel.aa;
    case `i`:
      return letters.vowel.ii;
    case `u`:
      return letters.vowel.uu;
  }
}

const library = lib(category, `verb`, underlying, x => ({
  affix: {
    n_: {
      left: () => x({consonant: letters.consonant.n}),
    },
    st_: {
      left: () => x(
        {consonant: letters.consonant.s},
        {consonant: letters.consonant.t},
      ),
    },
    sta_: {
      left: () => x(
        {consonant: letters.consonant.s},
        {consonant: letters.consonant.t},
        {vowel: letters.vowel.a},
      ),
    },
    v_: {
      feed: (vowel: `a` | `i`) => ({
        left: () => x(
          {consonant: letters.consonant.$},
          {vowel: letters.vowel[vowel]},
        ),
      }),
    },
  },
  template: {
    fv33: {
      feed: (vowel: `a` | `i` | `u`) => ({root: [f, c]}) => x(
        {consonant: f},
        {vowel: letters.vowel[vowel]},
        {consonant: c},
        {consonant: c},
      ),
    },
    fv3vl: {
      feed: (vowel1: `a` | `i` | `u`, vowel2: `a` | `i` | `u`) => ({root: [f, c, l]}) => x(
        {consonant: f},
        {vowel: letters.vowel[vowel1]},
        {consonant: c},
        {vowel: letters.vowel[vowel2]},
        {consonant: l},
      ),
    },
    f3vl: {
      feed: (vowel: `a` | `i` | `u`) => ({root: [f, c, l]}) => x(
        {consonant: f},
        {consonant: c},
        {vowel: letters.vowel[vowel]},
        {consonant: l},
      ),
    },
    f3vvl: {
      feed: (vowel: `a` | `i` | `u` | `e` | `o`) => ({root: [f, c, l]}) => x(
        {consonant: f},
        {consonant: c},
        {vowel: laxLongVowel(vowel)},
        {consonant: l},
      ),
    },
    fv3v: {
      feed: (vowel: `a` | `i`) => ({root: [f, c]}) => x(
        {consonant: f},
        {vowel: letters.vowel[vowel]},
        {consonant: c},
        {vowel: letters.vowel[vowel]},
      ),
    },
    f3vv: {
      feed: (vowel: `a` | `i` | `u`) => ({root: [f, c]}) => x(
        {consonant: f},
        {consonant: c},
        {vowel: tenseLongVowel(vowel)},
      ),
    },
    f3v: {
      feed: (vowel: `a` | `i` | `u`) => ({root: [f, c]}) => x(
        {consonant: f},
        {consonant: c},
        {vowel: letters.vowel[vowel]},
      ),
    },
    fvvl: {
      feed: (vowel: `a` | `i` | `u`) => ({root: [f, _, l]}) => x(
        {consonant: f},
        {vowel: tenseLongVowel(vowel)},
        {consonant: l},
      ),
    },
    fa33vl: {
      feed: (vowel: `a` | `i`) => ({root: [f, c, l]}) => x(
        {consonant: f},
        {vowel: letters.vowel.a},
        {consonant: c},
        {consonant: c},
        {vowel: letters.vowel[vowel]},
        {consonant: l},
      ),
    },
    fa33v: {
      feed: (vowel: `a` | `i`) => ({root: [f, c]}) => x(
        {consonant: f},
        {vowel: letters.vowel.a},
        {consonant: c},
        {consonant: c},
        {vowel: letters.vowel[vowel]},
      ),
    },
    fe3vl: {
      feed: (vowel: `a` | `i`) => ({root: [f, c, l]}) => x(
        {consonant: f},
        {vowel: letters.vowel.aa},
        {consonant: c},
        {vowel: letters.vowel[vowel]},
        {consonant: l},
      ),
    },
    fe3v: {
      feed: (vowel: `a` | `i`) => ({root: [f, c]}) => x(
        {consonant: f},
        {vowel: letters.vowel.aa},
        {consonant: c},
        {vowel: letters.vowel[vowel]},
      ),
    },
    ftv33: {
      feed: (vowel: `a` | `i` | `u`) => ({root: [f, c]}) => x(
        {consonant: f},
        {consonant: letters.consonant.t},
        {vowel: letters.vowel[vowel]},
        {consonant: c},
        {consonant: c},
      ),
    },
    ftv3vl: {
      feed: (vowel1: `a` | `i`, vowel2: `a` | `i`) => ({root: [f, c]}) => x(
        {consonant: f},
        {consonant: letters.consonant.t},
        {vowel: letters.vowel[vowel1]},
        {consonant: c},
        {vowel: letters.vowel[vowel2]},
      ),
    },
    ftv3v: {
      feed: (vowel1: `a` | `i`, vowel2: `a` | `i`) => ({root: [f, c]}) => x(
        {consonant: f},
        {consonant: letters.consonant.t},
        {vowel: letters.vowel[vowel1]},
        {consonant: c},
        {vowel: letters.vowel[vowel2]},
      ),
    },
    ftvvl: {
      feed: (vowel: `a` | `i`) => ({root: [f, _, l]}) => x(
        {consonant: f},
        {consonant: letters.consonant.t},
        {vowel: tenseLongVowel(vowel)},
        {consonant: l},
      ),
    },
    f3all: ({root: [f, c, l]}) => x(
      {consonant: f},
      {consonant: c},
      {vowel: letters.vowel.a},
      {consonant: l},
      {consonant: l},
    ),
    fa3lv2: {
      feed: (vowel: `a` | `i`) => ({root: [f, c, l, q]}) => x(
        {consonant: f},
        {vowel: letters.vowel.a},
        {consonant: c},
        {consonant: l},
        {vowel: letters.vowel[vowel]},
        {consonant: q},
      ),
    },
    fa3lv: {
      feed: (vowel: `a` | `i`) => ({root: [f, c, l]}) => x(
        {consonant: f},
        {vowel: letters.vowel.a},
        {consonant: c},
        {consonant: l},
        {vowel: letters.vowel[vowel]},
      ),
    },
  },
}));

const verb = category.promote.verb(underlying, features => ({
  
}));