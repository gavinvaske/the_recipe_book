const TEST_LABEL_QUANTITIES = [
    100, 200, 300,
    400, 500, 600,
    700, 800
  ]

const TEST_QUOTE_INPUTS = {
  dieOverride: {
    numberAcross: 7,
    sizeAcross: 2.875,
    sizeAround: 3.625,
    cornerRadius: 0.125,
    shape: 'Rectangle',
    spaceAcross: 0.125,
    spaceAround: 0.125,
    numberAround: 4
  },
  primaryMaterialOverride: {
    costPerMsi: 0.281,
    freightCostPerMsi: 0.0030,
    quotePricePerMsi: 0.748,
    thickness: 5.5
  },
  secondaryMaterialOverride: {},
  finishOverride: {
    costPerMsi: 0.1,
    freightCostPerMsi: 0,
    quotePricePerMsi: 0.1,
    thickness: 1.250
  },
  labelsPerRollOverride: 1000,
  numberOfDesignsOverride: 1,
  profitMargin: 0.20,
  coreDiameterOverride: 3.25,
  numberOfColorsOverride: 4
}