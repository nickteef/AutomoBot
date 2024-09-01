import elasticsearch from 'elasticsearch-browser';

// Initialize Elasticsearch client
const client = new elasticsearch.Client({
    host: 'http://localhost:9200',
});

// Initialize Bonsai Elasticsearch client
const bonsaiClient = new elasticsearch.Client({
    host: 'https://xoo119r5pt:fldo9x6klp@search-8813477231.eu-central-1.bonsaisearch.net:443',
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
                    { match: { "brand.keyword": selectedBrand } },
                    { match: { "commercialTag.keyword": selectedModel } },
                    { match: { "manufactureYear.keyword": selectedYear } }  // Use match instead of wildcard
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
                          field: 'brand.keyword',
                          size: 150, // Adjust the size according to your needs
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
                          { term: { "brand.keyword": selectedBrand } }
                      ]
                  }
              },
              aggs: {
                  unique_models: {
                      terms: {
                          field: 'commercialTag.keyword',
                          size: 200, // Adjust the size according to your needs
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
                          { term: { "brand.keyword": selectedBrand } },
                          { term: { "commercialTag.keyword": selectedModel } }
                      ]
                  }
              },
              aggs: {
                  unique_years: {
                      terms: {
                          field: "manufactureYear.keyword",  // Use the manufactureYear field directly
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

export function storeAnalyticsData(analyticsData) {
    console.log(analyticsData); // For debugging purposes

    return new Promise((resolve, reject) => {
        bonsaiClient.index({
            index: 'analytics-data',
            body: analyticsData,
        })
        .then(response => {
            console.log('Elasticsearch response:', response);
            resolve(response);
        })
        .catch(error => {
            console.error('Error storing analytics data:', error);
            reject(error);
        });
    });
};

export function storeFeedbackData(feedbackData) {
    return new Promise((resolve, reject) => {
        bonsaiClient.index({
            index: 'feedback-data',
            body: feedbackData,
        })
        .then(response => {
            console.log('Elasticsearch response:', response);
            resolve(response);
        })
        .catch(error => {
            console.error('Error storing feedback data:', error);
            reject(error);
        });
    });
};

// Example of checkIfVinExists
export function checkIfVinExists(VIN) {
    return new Promise((resolve, reject) => {
        client.search({
            index: 'opsi-data',
            body: {
                query: {
                    match: { VIN }
                }
            }
        }).then(response => {
            const hits = response.hits.hits;
            resolve(hits.length > 0);
        }).catch(error => {
            reject(error.message);
        });
    });
}

// Functions to save the data back to opsi-data index
// Update vehicle data
export function updateVehicleData(data) {
    return new Promise((resolve, reject) => {
        client.updateByQuery({
            index: 'opsi-data',
            body: {
                script: {
                    source: "ctx._source = params.data",
                    params: { data: data }
                },
                query: {
                    term: { VIN: data.VIN }
                }
            }
        }).then(function (response) {
            resolve(response);
        }).catch(function (error) {
            reject(error.message);
        });
    });
}

// Insert vehicle data
export function insertVehicleData(data) {
    return new Promise((resolve, reject) => {
        client.index({
            index: 'opsi-data',
            body: data
        }).then(function (response) {
            resolve(response);
        }).catch(function (error) {
            reject(error.message);
        });
    });
}
