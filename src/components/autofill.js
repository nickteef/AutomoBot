// This function returns a promise that resolves after n milliseconds
const delay = n => new Promise(res => setTimeout(res, n));

export async function fillForm(data) {
  const vehicleCategorySelect = document.querySelector('select[name="category_id"]');
  const vehicleTypeSelect = document.querySelector('select[name="type_id"]');
  const brandSelect = document.querySelector('select[name="brand_id"]');
  const modelSelect = document.querySelector('select[name="model_id"]');
  const commTagInput = document.querySelector('input[name="commercial_tag"]');
  const vinInput = document.querySelector('input[name="vin"]');
  const originCountrySelect = document.querySelector('select[name="origin_country_id"]');
  const motorTypeInput = document.querySelector('input[name="motor_type"]');
  const manufactureYear = document.querySelector('input[name="manufacture_year"]');
  const initialYear = document.querySelector('input[name="initial_year"]');
  const numOfSeats = document.querySelector('input[name="seats_nr"]');
  const numOfStand = document.querySelector('input[name="standing_nr"]');
  const tyreSizeFront = document.querySelector('input[name="tyre_size_front"]');
  const tyreSizeBack = document.querySelector('input[name="tyre_size_back"]');
  const vehicleWeight = document.querySelector('input[name="vehicle_weight"]');
  const maxWeight = document.querySelector('input[name="max_weight"]');
  const wheelbase = document.querySelector('input[name="wheelbase"]');
  const length = document.querySelector('input[name="length"]');
  const height = document.querySelector('input[name="height"]');
  const width = document.querySelector('input[name="width"]');
  const engineCapacity = document.querySelector('input[name="engine_capacity"]');
  const enginePower = document.querySelector('input[name="engine_power"]');
  const vehicleColor = document.querySelector('input[name="vehicle_color"]');
  const topSpeed = document.querySelector('input[name="top_speed"]');

  if (vehicleCategorySelect) autofillSelectBox(vehicleCategorySelect, data.vrstaVozila);
  if (vehicleTypeSelect) autofillSelectBox(vehicleTypeSelect, data.oblikaNadgradnje);
  if (brandSelect) autofillSelectBox(brandSelect, data.znamka);  

  if (modelSelect) {
    autofillSelectBox(modelSelect, data.komercOznaka);
    await delay(2000);  // wait for 2 seconds
  }
  if (commTagInput) {
    commTagInput.value = data.model || '';
    await delay(2000);  // wait for 2 seconds
  }

  if (vinInput) vinInput.value = data.VIN || '';
  if (originCountrySelect) autofillSelectBox(originCountrySelect, data.drzavaProizvajalca); 
  if (motorTypeInput) motorTypeInput.value = data.oznakaMotorja || '';
  if (manufactureYear) manufactureYear.value = data.letnik || '';
  if (initialYear) initialYear.value = data.letnik || '';
  if (numOfSeats) numOfSeats.value = data.stSedezev || '';
  if (numOfStand) numOfStand.value = data.stStojisc || '0';
  if (tyreSizeFront) tyreSizeFront.value = data.dovoljenePnevmatike.toUpperCase() || '/';
  if (tyreSizeBack) tyreSizeBack.value = data.dovoljenePnevmatike.toUpperCase() || '/';
  if (vehicleWeight) vehicleWeight.value = data.masa || '/';
  if (maxWeight) maxWeight.value = data.najDovoljenaMasa === '0' ? '/' : data.najDovoljenaMasa;
  if (maxWeight) maxWeight.value = data.najDovoljenaMasa || '/'; 
  if (wheelbase) wheelbase.value = data.medosje || '/';
  if (length) length.value = data.dolzina || '/';
  if (height) height.value = data.visina || '/';
  if (width) width.value = data.sirina || '/';
  if (engineCapacity) engineCapacity.value = data.delovnaProstornina || '/';
  if (enginePower) enginePower.value = data.nazivnaMoc || '/';
  if (vehicleColor) vehicleColor.value = data.barva || '/';
  if (topSpeed) topSpeed.value = data.najHitrost || '/';
}

function autofillSelectBox(selectElement, brandName) {
    // Normalize the brand name (to lowercase, trim spaces)
    const normalizedBrandName = brandName.toLowerCase().trim();

    // Iterate over the options to find the closest match
    let closestMatch = null;
    let closestDistance = Infinity; // Initialize with a large number

    for (let option of selectElement.options) {
        const optionText = option.text.toLowerCase().trim();
        
        // Calculate the 'distance' between the option text and the brand name
        let distance = stringDistance(normalizedBrandName, optionText);

        // Update if this option is a closer match
        if (distance < closestDistance) {
            closestDistance = distance;
            closestMatch = option;
        }
    }

    // If a match is found, select it
    if (closestMatch) {
        selectElement.value = closestMatch.value;
        // Dispatch a change event
        selectElement.dispatchEvent(new Event('change'));
    }
}

// Basic function to measure 'distance' between two strings
function stringDistance(a, b) {
    // Example: Count the number of different characters
    let distance = 0;
    let maxLength = Math.max(a.length, b.length);

    for (let i = 0; i < maxLength; i++) {
        if (i >= a.length || i >= b.length || a[i] !== b[i]) {
            distance++;
        }
    }
    return distance;
}

document.addEventListener('AutomoBotAutofill', function(e) {
  const data = e.detail;
  fillForm(data);
});


