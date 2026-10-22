# NOTICE

Cuban Cards Components
Copyright (C) 2026 Chichimokers

This repository contains a React/Vue reimplementation inspired by the public
Explorador de tarjetas cubanas. The original visual style, layout ideas and some
image assets come from that MIT-licensed project. The catalog data is consumed
at runtime from the MIT-licensed `qvapay/cuban_cards_prefixes` repository.

The source code of this repository is licensed under the GNU General Public
License, version 3 or later. See `LICENSE`.

## 1. Explorador de tarjetas cubanas

Source: https://github.com/rblez/explorador-tarjetas-cubanas

```text
MIT License

Copyright (c) 2026 Ray Omar Blez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 2. cuban_cards_prefixes

Source: https://github.com/qvapay/cuban_cards_prefixes

```text
MIT License

Copyright (c) 2026 QvaPay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 3. Assets and trademarks

The card backgrounds, bank isotypes, fonts and the tropical background image in
`packages/core/src/assets/` were derived from the MIT-licensed Explorador de
tarjetas cubanas. They are included only to render the card previews.

Bank names, logos and trademarks belong to their respective owners. Their use
here is solely for identification of the card issuer and does not imply
sponsorship or endorsement.

## 4. Data and privacy

The component fetches the public catalog from the CDN at runtime and analyzes
card numbers entirely in the browser. Report links include only the first 8
digits of a card number, never the complete number.
