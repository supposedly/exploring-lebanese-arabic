const { parseString: $, parseLetter } = require(`../utils/parseWord`);
const { PERSONS: P, GENDERS: G, NUMBERS: N } = require(`../symbols`);

const I = Object.freeze(parseLetter`I`);

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
  if (gender.fem) {
    if (number.singular) { return $`Fem`; }
    if (number.dual) { return $`Fem.Dual`; }
    if (number.plural) { return $`FemPlural`; }
    return null;  // error?
  }
  // masc and "commmon" gender are the same for now
  if (number.singular) { return $``; }
  if (number.dual) { return $`=`; }  // merging verbal and nominal participles here
  if (number.plural) { return $`+`; }
  return null;  // error?
}

// past-tense verbs
function verbSuffix(person, gender, number) {
  if (person.first) {
    if (number.singular) { return $`Schwa.t`; }
    return $`n.aa`;
  }
  if (person.second) {
    if (number.singular) {
      if (gender.fem) { return $`t.ii`; }
      return $`Schwa.t`;
    }
    return $`t.uu`;
  }
  if (person.third) {
    if (number.singular) {
      if (gender.fem) { return $`Fem`; }  // -it/-at
      return $``;
    }
    return $`uu`;
  }
  return null;  // error?
}

// nonpast verbs
function verbCircumfix(person, gender, number) {
  if (person.first) {
    if (number.singular) {
      // 1cs
      return suffixPrefix($``, [$`2`, $``]);
    }
    // "1cd", 1cp
    return suffixPrefix($``, [$`n`]);
  }
  if (person.second) {
    if (number.singular) {
      if (gender.feminine) {
        // 2fs
        return suffixPrefix($`ii`, [$`t`]);
      }
      // 2ms, 2cs
      return suffixPrefix($``, [$`t`]);
    }
    // 2cd, 2cp
    return suffixPrefix($`uu`, [$`t`]);
  }
  if (person.third) {
    if (number.singular) {
      if (gender.feminine) {
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
    first: person === P.first,
    second: person === P.second,
    third: person === P.third
  };
  gender = {
    value: gender,
    masc: gender === G.masc,
    fem: gender === G.fem,
    common: gender === G.common
  };
  number = {
    value: number,
    singular: number === N.singular,
    dual: number === N.dual,
    plural: number === N.plural
  };

  return {
    person,
    gender,
    number,
    participle: {
      suffix: ppSuffix(person, gender, number)
    },
    past: verbSuffix(person, gender, number),
    nonpast: verbCircumfix(person, gender, number)
  };
}

module.exports = {
  pronoun
};