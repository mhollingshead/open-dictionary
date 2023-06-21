<h1 align="center">
    <div>📙 Open Dictionary</div>
</h1>

<p align="center">
    JSON files with dictionary definitions for <b>over 260k</b> English words sourced from Wiktionary.
</p>

<p align="center">
    <a href="#usage">Usage</a>&nbsp;&nbsp;•&nbsp;&nbsp;<a href="#schema">Schema</a>&nbsp;&nbsp;•&nbsp;&nbsp;<a href="#sources--issues">Sources & Issues</a>&nbsp;&nbsp;•&nbsp;&nbsp;<a href="https://mhollingshead.github.io/open-dictionary/">Demo</a>
</p>

## Usage

You can retrieve word definitions in [JSON format](#schema) directly from GitHub using the following base URL:

```
https://raw.githubusercontent.com/mhollingshead/open-dictionary/main/api
```

The definitions are organized into folders and files based on the first letters of each word. The directory structure looks like this:

```
api
├── a
│   ├── a.json
│   ├── aa.json
│   ├── ab.json
│   ...
├── b
│   ├── b.json
│   ├── ba.json
│   ├── bb.json
│   ...
...
```

To fetch the definition for a specific word, use the following structure for your requests:

```http
<BASE URL>/<FIRST LETTER>/<FIRST TWO LETTERS>.json
```

Where `<BASE URL>` is the base URL mentioned above, `<FIRST LETTER>` is the first letter of the word, and `<FIRST TWO LETTERS>` are the first two letters of the word (except for 1-letter words, where this would be the first letter again).

For example, to get the definition for the word **awesome**, fetch the following file:

```http
https://raw.githubusercontent.com/mhollingshead/open-dictionary/main/api/a/aw.json
```

Here's a JavaScript function that can be used to retrieve the definition of any given word:

```javascript
const baseURL = 'https://raw.githubusercontent.com/mhollingshead/open-dictionary/main/api';

const getDefinition = async (word) => {
    const dir = word.slice(0, 1);
    const file = word.slice(0, 2);

    const url = `${baseURL}/${dir}/${file}.json`;

    const definitions = await fetch(url).then(res => res.json());

    return definitions[word];
}
```

## Schema

> Check out the [interactive demo](https://mhollingshead.github.io/open-dictionary/) to see the definition data for any word of your choice.

The JSON files are structured such that words are mapped to their definitions:

```javascript
{
    ...
    "awesome": Definition { ... },
    "awesomely": Definition { ... },
    ...
}
```

The definitions themselves have the following schema:

<!-- awesome, jiffy, magic -->

```javascript
Definition {
    "word": "awesome",
    "etymologies": [
        {
            "partsOfSpeech": [
                {
                    "partOfSpeech": "Adjective",
                    "senses": [
                        {
                            "sense": "(dated) Causing awe or terror; inspiring wonder or excitement.",
                            "date": "from 1590–1600"
                            "examples": [
                                "The waterfall in the middle of the rainforest was an awesome sight.",
                                "The tsunami was awesome in its destructive power.",
                                ...
                            ]
                        },
                        ...
                    ]
                },
                ...
            ]
        },
        ...
    ]
}
```

| Attribute | Type | Description |
| --- | --- | --- |
| `word` | `String` | The word to be defined |
| `etymologies` | `Array<Object>` | An array of **Etymology** objects, representing different meanings or origins of the word. |
| **Etymology**.`partsOfSpeech` | `Array<Object>` | An array of **Part of Speech** objects, representing different parts of speech within the etymology. |
| **Part&nbsp;of&nbsp;Speech**.`partOfSpeech` | `String` | The part of speech associated with the word, such as `Noun`, `Verb`, `Adjective`, etc. |
| **Part&nbsp;of&nbsp;Speech**.`senses` | `Array<Object>` | An array of **Sense** objects representing different senses or meanings of the word within the specific part of speech. |
| **Sense**.`sense` | `String` | The specific sense or meaning associated with the word within a particular context or part of speech. |
| **Sense**.`examples` | `Array<String>` | An array of example usages that illustrate the given sense or definition of the word. |
| **Sense**.`date` | `String` | (Optional) Additional information about the time period or usage context associated with the specific sense of the word. |

Some senses and examples may contain HTML tags or escaped characters. While most unnecessary html has been removed and replaced with plain text, some tags are necessary for correctly rendering and interpreting certain terms (e.g. `<sup>`, `<sub>`, `<math>`, and `<chem>`). 

> **NOTE**: The `<math>` tags **do not** contain valid MathML. They are used to indicate the presence of mathematical expressions. Math content is typically written in TeX format, which can be rendered by various inline LaTeX renderers (like [MathJax](https://www.mathjax.org/)). You can easily replace the `<math>` tags with the opening and closing tags required by your math-rendering library.

## Sources & Issues

All definitions are sourced and parsed from [Wiktionary](https://en.wiktionary.org/). 

Since manually verifying hundreds of thousands of outputs would be impractical, a significant amount of trust is placed in the parsing algorithm. Consequently, the following potential issues may arise:

* Some words might not have been included in the original word list.
* The structure of the Wikimedia source code for certain words may be inconsistent, leading to their omission from the final dictionary.
* Certain templates could bypass the parser or even cause it to malfunction, resulting in incorrect or corrupted definition data.

While I have made every effort to ensure the accuracy of the parser, it is impossible to guarantee accuracy for each and every entry in the dictionary. 

**If you come across any of these issues, feel free to [open an issue](https://github.com/mhollingshead/open-dictionary/issues/new) so that they can be investigated and resolved!**