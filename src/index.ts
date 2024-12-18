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
                SELECT ?country ?countryLabel
                WHERE {
                    ?country wdt:P31 wd:Q6256.  # Instance of country
                    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
                }
                LIMIT 5
                OFFSET 5
    `;

    try {

        const bindingsStream = await queryEngine.queryBindings(query, { sources: [ENDPOINT], });
        const bindings = await bindingsStream.toArray();

        bindings.forEach((binding: any, index: any) => {

            const country = binding.get('country')?.value || 'Unknown';
            const countryLabel = binding.get('countryLabel')?.value || 'Unknown';

            console.log(`${index + 1}: Country: ${countryLabel} & Country Wikidata URL: ${country}`)
        });
        
    } catch (error) {
        console.error('Error executing query:', error);
    }
}

executeQuery();