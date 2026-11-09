
export async function GET() {
  try {
    //Census API URL
    const url = new URL(
      "https://api.census.gov/data/2023/acs/acs5/profile"
    );

    //The Census variables we want
    const variables = [
      "NAME",

      // Demographics
      "DP05_0001E",
      "DP05_0018E",
      "DP05_0019E",
      "DP05_0024E",

      // Employment
      "DP03_0002PE",
      "DP03_0004E",
      "DP03_0005E",
      "DP03_0009PE",
      "DP03_0034E",
      "DP03_0035E",
      "DP03_0045E",

      // Transportation
      "DP03_0019PE",
      "DP03_0020PE",
      "DP03_0021PE",
      "DP03_0022PE",
      "DP03_0024PE",
      "DP03_0025E",

      // Education
      "DP02_0067PE",
      "DP02_0065PE",
      "DP02_0068PE",
      "DP02_0066PE",

      // Income and poverty
      "DP03_0128PE",
      "DP03_0129PE",

      // Housing
      "DP04_0003E",
      "DP04_0005E",
      "DP04_0089E",
      "DP04_0134E",
      "DP04_0101E",
      "DP04_0046PE",
      "DP04_0047PE",

      // Vehicle access
      "DP04_0058E",
      "DP04_0058PE",
      "DP04_0059E"
    ];

    //Add the variables and geographic location
    url.searchParams.set("get", variables.join(","));
    url.searchParams.set("for", "county:081");
    url.searchParams.set("in", "state:37");
    url.searchParams.set("key", process.env.CENSUS_API_KEY);

    //Request data from the Census Bureau
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Census API returned status ${response.status}`
      );
    }

    //Convert the response into JSON
    const data = await response.json();

    //Match each variable name with its value
    const headers = data[0];
    const values = data[1];

    const rawData = Object.fromEntries(
      headers.map((header, index) => [
        header,
        values[index]
      ])
    );

    //Helper function to convert strings into numbers
    function number(code) {
      const value = rawData[code];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return null;
      }

      const parsed = Number(value);

      return Number.isFinite(parsed) ? parsed : null;
    }

    //Organize the data into categories
    const county = {
      name: rawData.NAME,

      geography: {
        state: rawData.state,
        county: rawData.county
      },

      demographics: {
        population: number("DP05_0001E"),
        medianAge: number("DP05_0018E"),
        under18: number("DP05_0019E"),
        age65AndOlder: number("DP05_0024E")
      },

      employment: {
        laborForceParticipation: number("DP03_0002PE"),
        employed: number("DP03_0004E"),
        unemployed: number("DP03_0005E"),
        unemploymentRate: number("DP03_0009PE"),
        constructionJobs: number("DP03_0034E"),
        manufacturingJobs: number("DP03_0035E"),
        publicAdministrationJobs: number("DP03_0045E")
      },

      transportation: {
        driveAlone: number("DP03_0019PE"),
        carpool: number("DP03_0020PE"),
        publicTransportation: number("DP03_0021PE"),
        walkToWork: number("DP03_0022PE"),
        workFromHome: number("DP03_0024PE"),
        meanCommuteTime: number("DP03_0025E")
      },

      education: {
        highSchoolOrHigher: number("DP02_0067PE"),
        bachelorsDegree: number("DP02_0065PE"),
        bachelorsOrHigher: number("DP02_0068PE"),
        graduateOrProfessionalDegree: number("DP02_0066PE")
      },

      incomeAndPoverty: {
        povertyRate: number("DP03_0128PE"),
        childPovertyRate: number("DP03_0129PE")
      },

      housing: {
        vacantUnits: number("DP04_0003E"),
        homeownerVacancyRate: number("DP04_0005E"),
        medianHomeValue: number("DP04_0089E"),
        medianGrossRent: number("DP04_0134E"),
        medianOwnerCostsWithMortgage: number("DP04_0101E"),
        ownerOccupiedPercentage: number("DP04_0046PE"),
        renterOccupiedPercentage: number("DP04_0047PE")
      },

      vehicleAccess: {
        householdsWithoutVehicle: number("DP04_0058E"),
        householdsWithoutVehiclePercentage: number("DP04_0058PE"),
        householdsWithOneVehicle: number("DP04_0059E")
      }
    };

    return Response.json(county);

  } catch (error) {
    console.error("Census API error:", error);

    return Response.json(
      { error: "Unable to retrieve Census data" },
      { status: 500 }
    );
  }
}
