# A simple CLI with autocomplete

## Introduction
A quick way to store long cli commands with auto-complete

```
> alscli security-token-service get-user-identity

{
  "UserId": "XXXXX:XXXX",
  "Account": "XXXXXX",
  "Arn": "arn:aws:sts::XXXX:assumed-role/Admin/XXX-XXXX",
  "AccountAliases": []
}
```

## Installation
1. install CLI to global
```
FOLDER_PATH=~/alscli

mkdir $FOLDER_PATH
cd $FOLDER_PATH
git clone https://github.com/sebastianlzy/alscli
npm install -g .

```

2. Append to `~/.zshrc` for auto-compete
```shell
if type compdef &>/dev/null; then
  _alscli_completion() {
    compadd -- `alscli-autocomplete --compzsh --compgen "${CURRENT}" "${words[CURRENT-1]}" "${BUFFER}"`
  }
  compdef _alscli_completion alscli
elif type complete &>/dev/null; then
  _alscli_completion() {
    local cur prev nb_colon
    _get_comp_words_by_ref -n : cur prev
    nb_colon=$(grep -o ":" <<< "$COMP_LINE" | wc -l)

    COMPREPLY=( $(compgen -W '$(alscli-autocomplete --compbash --compgen "$((COMP_CWORD - (nb_colon * 2)))" "$prev" "${COMP_LINE}")' -- "$cur") )

    __ltrim_colon_completions "$cur"
  }
  complete -F _alscli_completion alscli
fi
```
 
 3. Add or modify commands in $FOLDER_PATH/commands.js