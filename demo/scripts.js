const baseURL = '../api';

const getDefinition = async (word) => {
    const dir = word.slice(0, 1);
    const file = word.slice(0, 2);

    const url = `${baseURL}/${dir}/${file}.json`;

    const definitions = await fetch(url).then(res => res.json());

    return definitions[word];
}

const renderDefinition = (data, word) => {
    const raw = document.querySelector('#raw code');
    raw.innerHTML = JSON.stringify(data, null, 4);

    const formatted = document.getElementById('formatted');

    if (!data) {
        formatted.innerHTML = `<p style="margin-top: 2rem;"><b>${word}</b> is not defined.</p>`;
        return;
    }

    formatted.innerHTML = `<h1>${data.word}</h1>`;

    data.etymologies.forEach((etymology, i) => {
        formatted.innerHTML += `<h2>Etymology ${i + 1}</h2>`;
        etymology.partsOfSpeech.forEach(pos => {
            formatted.innerHTML += `<h3>${pos.partOfSpeech}</h3>`;
            formatted.innerHTML += `
                <ol>
                    ${pos.senses.reduce((acc, sense) => {
                        return acc + `
                            <li>
                                <p>${
                                    sense.sense
                                        .replace(/^(\(.+?\))/g, '<i>$1</i>')
                                        .replace(/<math>(.+?)<\/math>/g, '\\($1\\)')
                                }</p>
                                <ul>
                                    ${sense.examples.reduce((acc, example) => {
                                        return acc + `
                                            <li>
                                                <p><i>${
                                                    example
                                                        .replace(/<math>(.+?)<\/math>/g, '\\($1\\)')
                                                }</i></p>
                                            </li>
                                        `;
                                    }, '')}
                                </ul>
                                ${sense.date ? `<small>[${sense.date}]</small>` : ''}
                            </li>
                        `;
                    }, '')}
                </ol>
            `;
        })
    });
}

const fetchAndRenderDefinition = async (word)=> {
    const data = await getDefinition(word);

    renderDefinition(data, word);

    hljs.highlightAll();
    MathJax.typeset();
}

const defineInputWord = () => {
    const word = document.querySelector('#word').value.toLowerCase().trim();
    if (!word) return;
    fetchAndRenderDefinition(word);
}

const defineRandomWord = async () => {
    const validWords = await fetch(baseURL + '/valid_words.json').then(res => res.json());
    const words = Object.keys(validWords);
    const word = words[Math.floor(Math.random() * words.length)];
    document.querySelector('#word').value = word;
    fetchAndRenderDefinition(word);
}

document.querySelector('#raw-tab').addEventListener('click', () => {
    document.querySelector('.response').className = 'response raw';
});

document.querySelector('#formatted-tab').addEventListener('click', () => {
    document.querySelector('.response').className = 'response formatted';
});

document.querySelector('#search-form').addEventListener('submit', e => {
    e.preventDefault();
    defineInputWord();
});

document.querySelector('#define').addEventListener('click', defineInputWord);
document.querySelector('#random').addEventListener('click', defineRandomWord);

fetchAndRenderDefinition('awesome');