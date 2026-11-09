
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [county, setCounty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getCountyData() {
      try {
        const response = await fetch("/api/census");

        if (!response.ok) {
          throw new Error("Failed to fetch county data");
        }

        const data = await response.json();
        setCounty(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getCountyData();
  }, []);

  // Format numbers with commas
  function formatNumber(value) {
    if (value === null || value === undefined) return "N/A";

    return value.toLocaleString("en-US");
  }

  // Format dollar amounts
  function formatCurrency(value) {
    if (value === null || value === undefined) return "N/A";

    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });
  }

  // Format percentages
  function formatPercent(value) {
    if (value === null || value === undefined) return "N/A";

    return `${value}%`;
  }

  // Reusable statistic card
  function StatCard({ label, value, description }) {
    return (
      <div className="stat-card">
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
        {description && (
          <p className="stat-description">{description}</p>
        )}
      </div>
    );
  }

  // Reusable dashboard section
  function DashboardSection({ title, children }) {
    return (
      <section className="dashboard-section">
        <h2>{title}</h2>
        <div className="stats-grid">{children}</div>
      </section>
    );
  }

  return (
    <main>
      <header className="dashboard-header">
        <p className="eyebrow">COMMUNITY DATA EXPLORER</p>
        <h1>Census Mini Explorer</h1>
        <p>
          Explore demographics, employment, housing,
          education, and quality-of-life indicators.
        </p>
      </header>

      {loading && <p>Loading Census data...</p>}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {county && (
        <>
          <div className="county-heading">
            <div>
              <p className="eyebrow">CURRENT LOCATION</p>
              <h2>{county.name}</h2>
            </div>
          </div>

          <DashboardSection title="Demographics">
            <StatCard
              label="Total Population"
              value={formatNumber(county.demographics.population)}
            />
            <StatCard
              label="Median Age"
              value={`${county.demographics.medianAge} years`}
            />
            <StatCard
              label="Under Age 18"
              value={formatNumber(county.demographics.under18)}
            />
            <StatCard
              label="Age 65 and Older"
              value={formatNumber(county.demographics.age65AndOlder)}
            />
          </DashboardSection>

          <DashboardSection title="Employment">
            <StatCard
              label="Labor Force Participation"
              value={formatPercent(county.employment.laborForceParticipation)}
            />
            <StatCard
              label="Employed Residents"
              value={formatNumber(county.employment.employed)}
            />
            <StatCard
              label="Unemployed Residents"
              value={formatNumber(county.employment.unemployed)}
            />
            <StatCard
              label="Unemployment Rate"
              value={formatPercent(county.employment.unemploymentRate)}
            />
            <StatCard
              label="Construction Employment"
              value={formatNumber(county.employment.constructionJobs)}
            />
            <StatCard
              label="Manufacturing Employment"
              value={formatNumber(county.employment.manufacturingJobs)}
            />
            <StatCard
              label="Public Administration Employment"
              value={formatNumber(county.employment.publicAdministrationJobs)}
            />
          </DashboardSection>

          <DashboardSection title="Education">
            <StatCard
              label="High School Graduate or Higher"
              value={formatPercent(county.education.highSchoolOrHigher)}
            />
            <StatCard
              label="Bachelor's Degree"
              value={formatPercent(county.education.bachelorsDegree)}
            />
            <StatCard
              label="Bachelor's Degree or Higher"
              value={formatPercent(county.education.bachelorsOrHigher)}
            />
            <StatCard
              label="Graduate or Professional Degree"
              value={formatPercent(county.education.graduateOrProfessionalDegree)}
            />
          </DashboardSection>

          <DashboardSection title="Income & Poverty">
            <StatCard
              label="Poverty Rate"
              value={formatPercent(county.incomeAndPoverty.povertyRate)}
            />
            <StatCard
              label="Child Poverty Rate"
              value={formatPercent(county.incomeAndPoverty.childPovertyRate)}
            />
          </DashboardSection>

          <DashboardSection title="Housing">
            <StatCard
              label="Median Home Value"
              value={formatCurrency(county.housing.medianHomeValue)}
            />
            <StatCard
              label="Median Gross Rent"
              value={formatCurrency(county.housing.medianGrossRent)}
            />
            <StatCard
              label="Monthly Owner Costs with Mortgage"
              value={formatCurrency(county.housing.medianOwnerCostsWithMortgage)}
            />
            <StatCard
              label="Vacant Housing Units"
              value={formatNumber(county.housing.vacantUnits)}
            />
            <StatCard
              label="Homeowner Vacancy Rate"
              value={formatPercent(county.housing.homeownerVacancyRate)}
            />
            <StatCard
              label="Owner-Occupied Housing"
              value={formatPercent(county.housing.ownerOccupiedPercentage)}
            />
            <StatCard
              label="Renter-Occupied Housing"
              value={formatPercent(county.housing.renterOccupiedPercentage)}
            />
          </DashboardSection>

          <DashboardSection title="Transportation">
            <StatCard
              label="Drive Alone"
              value={formatPercent(county.transportation.driveAlone)}
            />
            <StatCard
              label="Carpool"
              value={formatPercent(county.transportation.carpool)}
            />
            <StatCard
              label="Public Transportation"
              value={formatPercent(county.transportation.publicTransportation)}
            />
            <StatCard
              label="Walk to Work"
              value={formatPercent(county.transportation.walkToWork)}
            />
            <StatCard
              label="Work from Home"
              value={formatPercent(county.transportation.workFromHome)}
            />
            <StatCard
              label="Mean Commute Time"
              value={`${county.transportation.meanCommuteTime} minutes`}
            />
          </DashboardSection>

          <DashboardSection title="Vehicle Access">
            <StatCard
              label="Households Without a Vehicle"
              value={formatNumber(county.vehicleAccess.householdsWithoutVehicle)}
            />
            <StatCard
              label="Households Without a Vehicle (%)"
              value={formatPercent(county.vehicleAccess.householdsWithoutVehiclePercentage)}
            />
            <StatCard
              label="Households with One Vehicle"
              value={formatNumber(county.vehicleAccess.householdsWithOneVehicle)}
            />
          </DashboardSection>
        </>
      )}

    </main>
  );
}
