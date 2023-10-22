This is blatant abuse of `affected`. Really I'm not aware of any "mainstream Levantine" dialect that retains the actual CaCiC shape of form 1, but I do need it for forms 7 and 8, where it's very common for varieties to retain the shapes -nCaCiC and -CtaCiC. That's mainly why this folder is here: I can specify that those varieties' forms 7 and 8 mock an "affected" `fa3il` instead of a plain one. (If I do happen to need to document a dialect that has form-1 CaCiC, I can have a custom transformation rule that just turns all ``{features {door: `fa3il`}}`` verbs into `{context: {affected: true}}` ones, I guess)

The biggest downside is that the "user" turning this rulepack into an actual dialect's rules will have to specify `fa3il.affected.defective.y()` / `fa3il.affected.defective.aa()` in order to affect `nfa3il` and `fta3il`... in the future I need to see if there's a DRYer way to specify these kinds of duplicated rulesets on the rulepack side :(