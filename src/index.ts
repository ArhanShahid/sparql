import { QueryEngine } from '@comunica/query-sparql';

const ENDPOINT = 'https://query.wikidata.org/sparql';
const PREFIX = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX bd: <http://www.bigdata.com/rdf#>
`;

const executeQuery = async (): Promise<void> => {

    const queryEngine = new QueryEngine();

    const query = `${PREFIX}
                    SELECT ?book ?bookLabel
                    WHERE {
                    ?book wdt:P31 wd:Q571.  # Instances of books
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                    }
                    LIMIT 10
    `;

    try {

        const bindingsStream = await queryEngine.queryBindings(query, { sources: [ENDPOINT], });
        const bindings = await bindingsStream.toArray();

        bindings.forEach(binding => {

            // console.log(binding)

            const book = binding.get('book')?.value || 'Unknown';
            const bookLabel = binding.get('bookLabel')?.value || 'Unknown';

            console.log({ book, bookLabel });
        });
    } catch (error) {
        console.error('Error executing query:', error);
    }
}

executeQuery();