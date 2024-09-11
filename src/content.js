// This function returns a promise that resolves after n milliseconds
const delay = n => new Promise(res => setTimeout(res, n));

export async function fillForm(data) {
  const vehicleCategorySelect = document.querySelector('select[name="category_id"]');
  const vehicleTypeSelect = document.querySelector('select[name="type_id"]');
  const brandSelect = document.querySelector('select[name="brand_id"]');
  const modelSelect = document.querySelector('select[name="model_id"]');
  const commercialTag = document.querySelector('input[name="commercial_tag"]');
  const vin = document.querySelector('input[name="vin"]');
  const originCountrySelect = document.querySelector('select[name="origin_country_id"]');
  const motorNum = document.querySelector('input[name="motor_nr"]');
  const motorType = document.querySelector('input[name="motor_type"]');
  const manufactureYear = document.querySelector('input[name="manufacture_year"]');
  const initialYear = document.querySelector('input[name="initial_year"]');
  const numOfSeats = document.querySelector('input[name="seats_nr"]');
  const numOfStands = document.querySelector('input[name="standing_nr"]');
  const tyreSizeFront = document.querySelector('input[name="tyre_size_front"]');
  const tyreSizeBack = document.querySelector('input[name="tyre_size_back"]');
  const vehicleWeight = document.querySelector('input[name="vehicle_weight"]');
  const maxWeight = document.querySelector('input[name="max_weight"]');
  const wheelbase = document.querySelector('input[name="wheelbase"]');
  const length = document.querySelector('input[name="length"]');
  const height = document.querySelector('input[name="height"]');
  const width = document.querySelector('input[name="width"]');
  const engineConstruction = document.querySelector('select[name="engine_construction"]');
  const valveNum = document.querySelector('input[name="valve_nr"]');
  const valveArrangement = document.querySelector('select[name="valve_arrangements"]');
  const engineCapacity = document.querySelector('input[name="engine_capacity"]');
  const enginePower = document.querySelector('input[name="engine_power"]');
  const valveSteering = document.querySelector('select[name="valve_steering"]');
  const carburetor = document.querySelector('input[name="carburettor"]');
  const vehicleColor = document.querySelector('input[name="vehicle_color"]');
  const ignitionSwitch = document.querySelector('select[name="ignition_switch"]');
  const coolingSystem = document.querySelector('select[name="cooling_system"]');
  const gearbox = document.querySelector('input[name="gearbox"]');
  const topSpeed = document.querySelector('input[name="top_speed"]');
  const lighting = document.querySelector('select[name="lightning"]');

  if (vehicleCategorySelect) autofillSelectBox(vehicleCategorySelect, data.vehicleCategory);
  if (vehicleTypeSelect) autofillSelectBox(vehicleTypeSelect, data.vehicleType);
  if (brandSelect) autofillSelectBox(brandSelect, data.brand);

  if (modelSelect) {
    autofillSelectBox(modelSelect, data.commercialTag);
    await delay(2000);  // wait for 2 seconds
  }
  if (commercialTag) {
    commercialTag.value = data.model || '';
    await delay(2000);  // wait for 2 seconds
  }

  if (vin) vin.value = data.VIN || '';
  if (originCountrySelect) autofillSelectBox(originCountrySelect, data.originCountry); 
  if (motorNum) motorNum.value = data.motorNum || '';
  if (motorType) motorType.value = data.motorType || '';
  if (manufactureYear) manufactureYear.value = data.manufactureYear || '';
  if (initialYear) initialYear.value = data.initialYear || '';
  if (numOfSeats) numOfSeats.value = data.numOfSeats || '';
  if (numOfStands) numOfStands.value = data.numOfStands || '0';
  if (tyreSizeFront) tyreSizeFront.value = data.tyreSize.toUpperCase() || '/';
  if (tyreSizeBack) tyreSizeBack.value = data.tyreSize.toUpperCase() || '/';
  if (vehicleWeight) vehicleWeight.value = data.weight || '/';
  if (maxWeight) maxWeight.value = data.maxWeight === '0' ? '/' : data.maxWeight;
  if (wheelbase) wheelbase.value = data.wheelbase || '/';
  if (length) length.value = data["length"] || '/';
  if (height) height.value = data.height || '/';
  if (width) width.value = data.width || '/';
  if (engineConstruction) autofillSelectBox(engineConstruction, data.engineConstruction);
  if (valveNum) valveNum.value = data.valveNum || '/';
  if (valveArrangement) autofillSelectBox(valveArrangement, data.valveArrangement);
  if (engineCapacity) engineCapacity.value = data.engineDisplacement || '/';  
  if (enginePower) enginePower.value = data.enginePower || '/';
  if (valveSteering) autofillSelectBox(valveSteering, data.valveSteering);
  if (carburetor) carburetor.value = data.carburetor || '/';
  if (vehicleColor) vehicleColor.value = data.vehicleColor || '/';
  if (ignitionSwitch) autofillSelectBox(ignitionSwitch, data.ignitionSwitch);
  if (coolingSystem) autofillSelectBox(coolingSystem, data.coolingSystem);
  if (gearbox) gearbox.value = data.gearbox || '/';
  if (topSpeed) topSpeed.value = data.topSpeed || '/';
  if (lighting) lighting.value = data.lighting || '/';
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

// Function that listens to autofill
document.addEventListener('AutomoBotAutofill', function(e) {
  const data = e.detail;
  fillForm(data);
});

// Function to add event listener to the target button
function addButtonClickListener() {
  const targetButton = document.querySelector('.FormButton.save');
  if (targetButton) {
      targetButton.addEventListener('click', () => {
          const vehicleData = gatherFormData();
          chrome.runtime.sendMessage({ message: 'targetButtonClick', data: vehicleData });
      });
  }
}

// Gather form data to send to the background script
function gatherFormData() {
  const tyreSizeFront = document.querySelector('input[name="tyre_size_front"]');
  const tyreSizeBack = document.querySelector('input[name="tyre_size_back"]');
  const tyreSize = `${tyreSizeFront.value}; ${tyreSizeBack.value}`;
  let fuelType;
  const engineConstruction = document.querySelector('select[name="engine_construction"]').value.toLowerCase();
  if (engineConstruction.includes("dizel")) {
    fuelType = "Dizel";
  } else {
    fuelType = "Bencin";
  }

  function getSelectedText(selectElement) {
    return selectElement.options[selectElement.selectedIndex].text;
  }

  return {
    vehicleCategory: getSelectedText(document.querySelector('select[name="category_id"]')),
    vehicleType: getSelectedText(document.querySelector('select[name="type_id"]')),
    brand: getSelectedText(document.querySelector('select[name="brand_id"]')),
    model: getSelectedText(document.querySelector('select[name="model_id"]')),
    commercialTag: document.querySelector('input[name="commercial_tag"]').value,
    VIN: document.querySelector('input[name="vin"]').value,
    originCountry: getSelectedText(document.querySelector('select[name="origin_country_id"]')),
    motorNum: document.querySelector('input[name="motor_nr"]').value,
    motorType: document.querySelector('input[name="motor_type"]').value,
    manufactureYear: document.querySelector('input[name="manufacture_year"]').value,
    initialYear: document.querySelector('input[name="initial_year"]').value,
    numOfSeats: document.querySelector('input[name="seats_nr"]').value,
    numOfStands: document.querySelector('input[name="standing_nr"]').value,
    tyreSize: tyreSize,
    weight: document.querySelector('input[name="vehicle_weight"]').value,
    maxWeight: document.querySelector('input[name="max_weight"]').value,
    wheelbase: document.querySelector('input[name="wheelbase"]').value,
    length: document.querySelector('input[name="length"]').value,
    height: document.querySelector('input[name="height"]').value,
    width: document.querySelector('input[name="width"]').value,
    fuelType: fuelType,
    engineConstruction: getSelectedText(document.querySelector('select[name="engine_construction"]')),
    valveNum: document.querySelector('input[name="valve_nr"]').value,
    valveArrangement: getSelectedText(document.querySelector('select[name="valve_arrangements"]')),
    engineDisplacement: document.querySelector('input[name="engine_capacity"]').value,
    enginePower: document.querySelector('input[name="engine_power"]').value,
    valveSteering: getSelectedText(document.querySelector('select[name="valve_steering"]')),
    carburetor: document.querySelector('input[name="carburettor"]').value,
    vehicleColor: document.querySelector('input[name="vehicle_color"]').value,
    ignitionSwitch: getSelectedText(document.querySelector('select[name="ignition_switch"]')),
    coolingSystem: getSelectedText(document.querySelector('select[name="cooling_system"]')),
    gearbox: document.querySelector('input[name="gearbox"]').value,
    topSpeed: document.querySelector('input[name="top_speed"]').value,
    lighting: getSelectedText(document.querySelector('select[name="lightning"]')),
  };
}

// Check if the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addButtonClickListener);
} else {
  addButtonClickListener();
}

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
          addButtonClickListener();
      }
  });
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});



