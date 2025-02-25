# Quill Delta to HTML

[![Build](https://github.com/LucaScorpion/quill-delta-to-html/actions/workflows/build.yml/badge.svg)](https://github.com/LucaScorpion/quill-delta-to-html/actions/workflows/build.yml)

A simple package that converts output from the [Quill editor](https://quilljs.com)
(the [Delta](https://quilljs.com/docs/delta) format) to HTML.

## Installation and Usage

Install the package using:

```shell
npm i @luca_scorpion/quill-delta-to-html
```

The package exports a single function, `deltaToHtml`:

```typescript
import { deltaToHtml } from '@luca_scorpion/quill-delta-to-html';

const quill = new Quill('#editor', {});

// Use `getContents` to get the delta from the Quill editor.
const html = deltaToHtml(quill.getContents());
```
