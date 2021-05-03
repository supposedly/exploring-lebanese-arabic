const { parseWord: { parseString: $, parseLetter }} = require(`../utils`);
const _ = require(`../objects`);
const { PERSONS: P, GENDERS: G, NUMBERS: N } = require(`../symbols`);

const I = Object.freeze(parseLetter`i`);
const FEM_T = Object.freeze(_.edit(parseLetter`Fem`, { meta: { t: true }}));

// circumfix-generator for verbCircumfix()
const suffixPrefix = (suffix, [cc, cv], indicative = $`b`) => ({
  prefix: {
    indicative,
    subjunctive: {
      cc: [...cc, I],
      cv: cv !== undefined ? cv : cc
    }
  },
  suffix
});

function ppSuffix(person, gender, number) {
  // person only matters when clitics are added so we ignore it here
  if (gender.fem()) {
    if (number.singular()) { return $`Fem`; }
    if (number.dual()) { return $`Fem.Dual`; }
    if (number.plural()) { return $`FemPlural`; }
    return null;  // error?
  }
  // masc and "commmon" gender are the same for now
  if (number.singular()) { return $``; }
  if (number.dual()) { return $`=`; }  // merging verbal and nominal participles here
  if (number.plural()) { return $`+`; }
  return null;  // error?
}

// past-tense verbs
function verbSuffix(person, gender, number) {
  if (person.first()) {
    if (number.singular()) { return $`Schwa.t`; }
    return $`n.aa`;
  }
  if (person.second()) {
    if (number.singular()) {
      if (gender.fem()) { return $`t.ii`; }
      return $`Schwa.t`;
    }
    return $`t.uu`;
  }
  if (person.third()) {
    if (number.singular()) {
      if (gender.fem()) { return [FEM_T]; }  // -it/-at
      return $``;
    }
    return $`uu`;
  }
  return null;  // error?
}

// nonpast verbs
function verbCircumfix(person, gender, number) {
  if (person.first()) {
    if (number.singular()) {
      // 1cs
      return suffixPrefix($``, [$`2`, $``]);
    }
    // "1cd", 1cp
    return suffixPrefix($``, [$`n`]);
  }
  if (person.second()) {
    if (number.singular()) {
      if (gender.fem()) {
        // 2fs
        return suffixPrefix($`ii`, [$`t`]);
      }
      // 2ms, 2cs
      return suffixPrefix($``, [$`t`]);
    }
    // 2cd, 2cp
    return suffixPrefix($`uu`, [$`t`]);
  }
  if (person.third()) {
    if (number.singular()) {
      if (gender.fem()) {
        // 3fs
        return suffixPrefix($``, [$`t`]);
      }
      // 3ms, 3cs
      return suffixPrefix($``, [$`y`]);
    }
    // 3cp
    return suffixPrefix($`uu`, [$`y`]);
  }
  return null;  // error?
}

// value is a string but we can still destructure it
function pronoun({ value: [person, gender, number] }) {
  person = {
    value: person,
    first() { return this.value === P.first; },
    second() { return this.value === P.second; },
    third() { return this.value === P.third; }
  };
  gender = {
    value: gender,
    masc() { return this.value === G.masc; },
    fem() { return this.value === G.fem; },
    common() { return this.value === G.common; }
  };
  number = {
    value: number,
    singular() { return this.value === N.singular; },
    dual() { return this.value === N.dual; },
    plural() { return this.value === N.plural; }
  };

  return {
    person,
    gender,
    number,
    participle: {
      suffix: ppSuffix(person, gender, number)
    },
    past: {
      suffix: verbSuffix(person, gender, number)
    },
    nonpast: verbCircumfix(person, gender, number)
  };
}

module.exports = {
  pronoun
};
