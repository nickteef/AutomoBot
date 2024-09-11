import elasticsearch from "elasticsearch-browser";
import stringSimilarity from "string-similarity";

// Initialize Elasticsearch client
const client = new elasticsearch.Client({
  host: "http://localhost:9200",
});

// Initialize Bonsai Elasticsearch client
const bonsaiClient = new elasticsearch.Client({
  host: "https://xoo119r5pt:fldo9x6klp@search-8813477231.eu-central-1.bonsaisearch.net:443",
});

// Function to search for VIN
export function searchVIN(vin) {
  return new Promise((resolve, reject) => {
    client
      .search({
        index: "opsi-data",
        body: {
          query: {
            match: {
              VIN: vin,
            },
          },
        },
      })
      .then(function (response) {
        // Assuming the first hit contains the desired data
        if (response.hits.total.value > 0) {
          resolve(response.hits.hits[0]._source);
        } else {
          reject("No results found for the given VIN.");
        }
      })
      .catch(function (error) {
        reject(error.message);
      });
  });
}

// Function to search by brand, model and year...
export function searchByBrandModelYear(selectedBrand, selectedModel, selectedYear) {
    return new Promise((resolve, reject) => { 
        client.search({
            index: 'opsi-data',
            body: {
                query: {
                    bool: {
                        must: [
                            { match: { "brand.keyword": selectedBrand } },
                            {
                                bool: {
                                    should: [
                                        { match: { "commercialTag.keyword": selectedModel } }, // Točno iskanje za model
                                        
                                    ],
                                    minimum_should_match: 1
                                }
                            },
                            {
                                bool: {
                                    should: [
                                        // Najprej poskusimo točno letnico
                                        { term: { "manufactureYear.keyword": selectedYear } },
                                        // Nato poskusimo poiskati letnico v razponu
                                        {
                                            range: {
                                                "manufactureYear.keyword": {
                                                    gte: selectedYear - 2, // Če `initialYear` ni določen, poiščemo letnice, ki so do 2 leti starejše od `manufactureYear`
                                                    lte: selectedYear
                                                }
                                            }
                                        },
                                        {
                                            range: {
                                                "initialYear.keyword": {
                                                    lte: selectedYear
                                                }
                                            }
                                        }
                                    ],
                                    minimum_should_match: 1
                                }
                            }
                        ]
                    }
                },
                sort: [
                    { "DR_score.keyword": { "order": "desc" } } // Sortiranje po DR_score
                ]
            }
        }).then(function (response) {
            if (response.hits.total.value > 0) {
                resolve(response.hits.hits[0]._source); // Vrne najboljši zadetek
            } else {
                reject(`No results were found for ${selectedYear} ${selectedBrand} ${selectedModel}`);
            }
        }, function (error) {
            reject(error.message);
        });
    });
}


export function populateBrandSelector() {
  return new Promise((resolve, reject) => {
    client
      .search({
        index: "opsi-data",
        size: 0,
        body: {
          aggs: {
            unique_brands: {
              terms: {
                field: "brand.keyword",
                size: 150, // Adjust the size according to your needs
                order: {
                  _count: "desc",
                },
              },
            },
          },
        },
      })
      .then((response) => {
        const brands = response.aggregations.unique_brands.buckets
          .map((bucket) => bucket.key)
          .sort();
        resolve(brands);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
        reject(error);
      });
  });
}

export function populateModelSelector(selectedBrand) {
    return new Promise((resolve, reject) => {
        client
            .search({
                index: "opsi-data",
                size: 0,
                body: {
                    query: {
                        bool: {
                            filter: [{ term: { "brand.keyword": selectedBrand } }],
                        },
                    },
                    aggs: {
                        unique_models: {
                            terms: {
                                field: "commercialTag.keyword",
                                size: 500, // Adjust the size according to your needs
                                order: {
                                    _count: "desc",
                                },
                            },
                        },
                    },
                },
            })
            .then((response) => {
                const models = response.aggregations.unique_models.buckets
                    .map((bucket) => normalizeModelName(bucket.key)) // Normalizacija imen
                    .sort();

                // Združevanje podobnih modelov
                const groupedModels = groupSimilarModels(models);
                resolve(groupedModels);
            })
            .catch((error) => {
                console.error("Error fetching models:", error);
                reject(error);
            });
    });
}

function normalizeModelName(name) {
    return name.toUpperCase().replace(/,/g, '.').trim();
}

function groupSimilarModels(models) {
    const threshold = 0.8; // Prag podobnosti, nad katerim se modeli združijo
    let groupedModels = [];
    let used = new Set();

    models.forEach(model => {
        if (!used.has(model)) {
            let similarModels = models.filter(m => !used.has(m) && stringSimilarity.compareTwoStrings(model, m) >= threshold);
            used = new Set([...used, ...similarModels]);
            groupedModels.push(getMostFrequentModel(similarModels));
        }
    });

    return groupedModels.sort();
}

function getMostFrequentModel(models) {
    // Izbere najpogostejše ime modela (ali lahko dodaš svojo logiko za izbiro)
    const frequency = {};
    models.forEach(model => {
        frequency[model] = (frequency[model] || 0) + 1;
    });
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
}


export function populateYearSelector(selectedBrand, selectedModel) {
    return new Promise((resolve, reject) => {
        client.search({
            index: 'opsi-data',
            size: 124,  // Nastavite ustrezno število zadetkov
            body: {
                query: {
                    bool: {
                        filter: [
                            { term: { "brand.keyword": selectedBrand } },
                            { term: { "commercialTag.keyword": selectedModel } }
                        ]
                    }
                },
                _source: ["initialYear", "manufactureYear"] // Omejite polja, ki jih želite pridobiti
            }
        }).then(response => {
            const allYears = new Set();

            response.hits.hits.forEach(hit => {
                const initialYear = hit._source.initialYear || (hit._source.manufactureYear-2);
                const manufactureYear = hit._source.manufactureYear;

                // Če je initialYear null, uporabimo samo manufactureYear
                for (let year = initialYear; year <= manufactureYear; year++) {
                    allYears.add(year);
                }
            });

            const sortedYears = Array.from(allYears).sort((a, b) => a - b);
            resolve(sortedYears);
        }).catch(error => {
            console.error('Error fetching years:', error);
            reject(error);
        });
    });
}

export function storeAnalyticsData(analyticsData) {
  console.log(analyticsData); // For debugging purposes

  return new Promise((resolve, reject) => {
    bonsaiClient
      .index({
        index: "analytics-data",
        body: analyticsData,
      })
      .then((response) => {
        console.log("Elasticsearch response:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error storing analytics data:", error);
        reject(error);
      });
  });
}

export function storeFeedbackData(feedbackData) {
  return new Promise((resolve, reject) => {
    bonsaiClient
      .index({
        index: "feedback-data",
        body: feedbackData,
      })
      .then((response) => {
        console.log("Elasticsearch response:", response);
        resolve(response);
      })
      .catch((error) => {
        console.error("Error storing feedback data:", error);
        reject(error);
      });
  });
}

// Example of checkIfVinExists
export function checkIfVinExists(VIN) {
  return new Promise((resolve, reject) => {
    client
      .search({
        index: "opsi-data",
        body: {
          query: {
            match: { VIN },
          },
        },
      })
      .then((response) => {
        const hits = response.hits.hits;
        resolve(hits.length > 0);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

// Functions to save the data back to opsi-data index
// Update vehicle data
export function updateVehicleData(data) {
  return new Promise((resolve, reject) => {
    client
      .updateByQuery({
        index: "opsi-data",
        body: {
          script: {
            source: "ctx._source = params.data",
            params: { data: data },
          },
          query: {
            term: { VIN: data.VIN },
          },
        },
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error.message);
      });
  });
}

// Insert vehicle data
export function insertVehicleData(data) {
  return new Promise((resolve, reject) => {
    client
      .index({
        index: "opsi-data",
        body: data,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error.message);
      });
  });
}
