import elasticsearch from 'elasticsearch-browser';

// Initialize Elasticsearch client
const client = new elasticsearch.Client({
    host: 'http://localhost:9200',
});

// Function to search for VIN
export function searchVIN(vin) {
    return new Promise((resolve, reject) => {
        client.search({
        index: 'opsi-data',
        body: {
            query: {
            match: {
                VIN: vin
            }
            }
        }
        }).then(function (response) {
        // Assuming the first hit contains the desired data
        if (response.hits.total.value > 0) {
            resolve(response.hits.hits[0]._source);
        } else {
            reject("No results found for the given VIN.");
        }
        }).catch(function (error) {
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
                    { match: { "znamka.keyword": selectedBrand } },
                    { match: { "komercOznaka.keyword": selectedModel } },
                    { match: { "letnik.keyword": selectedYear } }  // Use match instead of wildcard
                ]
                }
            }
            }
        }).then(function (response) {
            // Assuming the first hit contains the desired data
            if (response.hits.total.value > 0) {
            resolve(response.hits.hits[0]._source);
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
      client.search({
          index: 'opsi-data',
          size: 0,
          body: {
              aggs: {
                  unique_brands: {
                      terms: {
                          field: 'znamka.keyword',
                          size: 100, // Adjust the size according to your needs
                          order: {
                              _count: "desc"
                          }
                      }
                  }
              }
          }
      }).then(response => {
          const brands = response.aggregations.unique_brands.buckets
                          .map(bucket => bucket.key)
                          .sort();
          resolve(brands);
      }).catch(error => {
          console.error('Error fetching brands:', error);
          reject(error);
      });
  });
}  
  
export function populateModelSelector(selectedBrand) {
  return new Promise((resolve, reject) => {
      client.search({
          index: 'opsi-data',
          size: 0,
          body: {
              query: {
                  bool: {
                      filter: [
                          { term: { "znamka.keyword": selectedBrand } }
                      ]
                  }
              },
              aggs: {
                  unique_models: {
                      terms: {
                          field: 'komercOznaka.keyword',
                          size: 1000, // Adjust the size according to your needs
                          order: {
                              _count: "desc"
                          }
                      }
                  }
              }
          }
      }).then(response => {
          const models = response.aggregations.unique_models.buckets
                          .map(bucket => bucket.key)
                          .sort();
          resolve(models);
      }).catch(error => {
          console.error('Error fetching models:', error);
          reject(error);
      });
  });
}

export function populateYearSelector(selectedBrand, selectedModel) {
  return new Promise((resolve, reject) => {
      client.search({
          index: 'opsi-data',
          size: 0,
          body: {
              query: {
                  bool: {
                      filter: [
                          { term: { "znamka.keyword": selectedBrand } },
                          { term: { "komercOznaka.keyword": selectedModel } }
                      ]
                  }
              },
              aggs: {
                  unique_years: {
                      terms: {
                          field: "letnik.keyword",  // Use the letnik field directly
                          size: 124 // Adjust as needed
                      }
                  }
              }
          }
      }).then(response => {
          const years = response.aggregations.unique_years.buckets
                          .map(bucket => bucket.key)
                          .sort();
          resolve(years);
      }).catch(error => {
          console.error('Error fetching years:', error);
          reject(error);
      });
  });
}

// Function to save the data back to opsi-data index

// Function to save feedback data




