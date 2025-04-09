const { queryAthena } = require("../utils/athena");

const updateCutoffDate = async (cutoff_date) => {
  const updateQuery = `UPDATE srifincredit_views.srifin_loan_details_cutoffdate SET cutoff_date = DATE '${cutoff_date}'`;
  await queryAthena(updateQuery);
  await new Promise((resolve) => setTimeout(resolve, 5000)); 
};

const generateReport = async (fromDate, toDate, reportType, cutoff_date) => {
  await updateCutoffDate(cutoff_date);
  const query = `
    SELECT * FROM srifincredit_views.vw_cic_base_data 
    WHERE CAST(cycledate AS DATE) = DATE '${cutoff_date}' 
    AND CAST(disb_date AS DATE) BETWEEN DATE '${fromDate}' AND DATE '${toDate}'`;
  return await queryAthena(query);
};

const generateReupload = async (csvData, reportType, cutoff_date) => {
  await updateCutoffDate(cutoff_date);
  const formattedCsvData = csvData.slice(1).filter((val) => val.trim() !== "").join(",");
  const query = `
    SELECT * FROM srifincredit_views.vw_cic_base_data 
    WHERE CAST(cycledate AS DATE) = DATE '${cutoff_date}' 
    AND loan_application_id IN (${formattedCsvData})`;
  return await queryAthena(query);
};


const getReportHeaderTrailerService = async (reportType) => {
    const query = `SELECT header, trail FROM srifincredit_views.vw_srifin_cic_report_types WHERE report_type='${reportType}'`;
    console.log("Executing Athena Query:", query);
    
    return await queryAthena(query);
  };

const generateLUCReportservice = async (payload) => {
    let query = `SELECT * FROM srifincredit_views.vw_luc_report WHERE 1=1`;
    
    if (payload.zone) {
      query += ` AND "zone name" = '${payload.zone.replace(/'/g, "''")}'`;
    }
    if (payload.cluster) {
      query += ` AND "cluster name" = '${payload.cluster.replace(/'/g, "''")}'`;
    }
    if (payload.region) {
      query += ` AND "region name" = '${payload.region.replace(/'/g, "''")}'`;
    }
    if (payload.branch) {
      query += ` AND "branch name" = '${payload.branch.replace(/'/g, "''")}'`;
    }
    return await queryAthena(query);
};

const fetchdropdownluc = async () => {
    const queries = {
      branches: `SELECT DISTINCT "branch name", "region name" FROM  srifincredit_views.vw_luc_report`,
      regions: `SELECT DISTINCT "region name", "cluster name" FROM srifincredit_views.vw_luc_report`,
      clusters: `SELECT DISTINCT "cluster name", "zone name" FROM  srifincredit_views.vw_luc_report`,
      zones: `SELECT DISTINCT "zone name" FROM  srifincredit_views.vw_luc_report`,
    };
  
    const dropdownData = {
      branches: [],
      regions: [],
      clusters: [],
      zones: [],
      branchRegionMap: {},
      regionClusterMap: {},
      clusterZoneMap: {},
      zoneClusterMap: {},
      clusterRegionMap: {},
      regionBranchMap: {},
    };
  
    for (const [key, query] of Object.entries(queries)) {
      try {
        const result = await queryAthena(query);
  
        if (!result || result.length <= 1) {
          continue;
        }
  
        // Process data starting from the second row
        result.slice(1).forEach((row) => {
          const values = Object.values(row);
  
          if (key === "branches") {
            const branch_name = values[0];
            const region_name = values[1];
  
            if (branch_name && region_name) {
              dropdownData.branches.push(branch_name);
              dropdownData.branchRegionMap[branch_name] = region_name;
  
              if (!dropdownData.regionBranchMap[region_name]) {
                dropdownData.regionBranchMap[region_name] = [];
              }
              dropdownData.regionBranchMap[region_name].push(branch_name);
            }
          } else if (key === "regions") {
            const region_name = values[0];
            const cluster_name = values[1];
  
            if (region_name && cluster_name) {
              dropdownData.regions.push(region_name);
              dropdownData.regionClusterMap[region_name] = cluster_name;
  
              if (!dropdownData.clusterRegionMap[cluster_name]) {
                dropdownData.clusterRegionMap[cluster_name] = [];
              }
              dropdownData.clusterRegionMap[cluster_name].push(region_name);
            }
          } else if (key === "clusters") {
            const cluster_name = values[0];
            const zone_name = values[1];
  
            if (cluster_name && zone_name) {
              dropdownData.clusters.push(cluster_name);
              dropdownData.clusterZoneMap[cluster_name] = zone_name;
  
              if (!dropdownData.zoneClusterMap[zone_name]) {
                dropdownData.zoneClusterMap[zone_name] = [];
              }
              dropdownData.zoneClusterMap[zone_name].push(cluster_name);
            }
          } else if (key === "zones") {
            const zone_name = values[0];
            if (zone_name) {
              dropdownData.zones.push(zone_name);
            }
          }
        });
      } catch (error) {
        console.error(`❌ Error fetching ${key}:`, error);
      }
    }
  
    return dropdownData;
  };

const generateLoanDetailsReportService = async (payload) => {
    let query = `SELECT * FROM srifincredit_views.srifin_loan_details WHERE 1=1`;
  
    if (payload.zone) {
      query += ` AND "Zone Name" = '${payload.zone.replace(/'/g, "''")}'`;
    }
    if (payload.cluster) {
      query += ` AND "Cluster Name" = '${payload.cluster.replace(/'/g, "''")}'`;
    }
    if (payload.region) {
      query += ` AND "Region Name" = '${payload.region.replace(/'/g, "''")}'`;
    }
    if (payload.branch) {
      query += ` AND "Branch Name" = '${payload.branch.replace(/'/g, "''")}'`;
    }
  
    return await queryAthena(query);
  };
  const fetchdropdownloan = async () => {
    const queries = {
      branches: `SELECT DISTINCT "branch name", "region name" FROM srifincredit_views.srifin_loan_details`,
      regions: `SELECT DISTINCT "region name", "cluster name" FROM srifincredit_views.srifin_loan_details`,
      clusters: `SELECT DISTINCT "cluster name", "zone name" FROM srifincredit_views.srifin_loan_details`,
      zones: `SELECT DISTINCT "zone name" FROM srifincredit_views.srifin_loan_details`,
    };
  
    const dropdownData = {
      branches: [],
      regions: [],
      clusters: [],
      zones: [],
      branchRegionMap: {},
      regionClusterMap: {},
      clusterZoneMap: {},
      zoneClusterMap: {},
      clusterRegionMap: {},
      regionBranchMap: {},
    };
  
    for (const [key, query] of Object.entries(queries)) {
      try {
        const result = await queryAthena(query);
  
        if (!result || result.length <= 1) {
          continue;
        }
  
        // Process data starting from the second row
        result.slice(1).forEach((row) => {
          const values = Object.values(row);
  
          if (key === "branches") {
            const branch_name = values[0];
            const region_name = values[1];
  
            if (branch_name && region_name) {
              dropdownData.branches.push(branch_name);
              dropdownData.branchRegionMap[branch_name] = region_name;
  
              if (!dropdownData.regionBranchMap[region_name]) {
                dropdownData.regionBranchMap[region_name] = [];
              }
              dropdownData.regionBranchMap[region_name].push(branch_name);
            }
          } else if (key === "regions") {
            const region_name = values[0];
            const cluster_name = values[1];
  
            if (region_name && cluster_name) {
              dropdownData.regions.push(region_name);
              dropdownData.regionClusterMap[region_name] = cluster_name;
  
              if (!dropdownData.clusterRegionMap[cluster_name]) {
                dropdownData.clusterRegionMap[cluster_name] = [];
              }
              dropdownData.clusterRegionMap[cluster_name].push(region_name);
            }
          } else if (key === "clusters") {
            const cluster_name = values[0];
            const zone_name = values[1];
  
            if (cluster_name && zone_name) {
              dropdownData.clusters.push(cluster_name);
              dropdownData.clusterZoneMap[cluster_name] = zone_name;
  
              if (!dropdownData.zoneClusterMap[zone_name]) {
                dropdownData.zoneClusterMap[zone_name] = [];
              }
              dropdownData.zoneClusterMap[zone_name].push(cluster_name);
            }
          } else if (key === "zones") {
            const zone_name = values[0];
            if (zone_name) {
              dropdownData.zones.push(zone_name);
            }
          }
        });
      } catch (error) {
        console.error(`❌ Error fetching ${key}:`, error);
      }
    }
  
    return dropdownData;
  };



  const generateCreditReportService = async (payload) => {
    let query = `SELECT * FROM srifincredit_views.vw_process_credit_report WHERE 1=1`;
  
    if (payload.branch) {
      query += ` AND "BranchID_Name" = '${payload.branch.replace(/'/g, "''")}'`;
    } else {
      throw new Error("Branch is required");
    }
  
    if (payload.fromDate && payload.toDate) {
    query += ` AND CAST(app_date AS DATE) BETWEEN DATE('${payload.fromDate}') AND DATE('${payload.toDate}')`;
    } else {
      throw new Error("Both fromDate and toDate are required");
    }
  
    if (payload.status) {
      query += ` AND "Credit_App_Status" = '${payload.status.replace(/'/g, "''")}'`;
    }
  
    return await queryAthena(query);
  };
  const fetchDropdownCreditReport = async () => {
    const queries = {
      branches: `SELECT DISTINCT "BranchID_Name" FROM srifincredit_views.vw_process_credit_report`,
      statuses: `SELECT DISTINCT "Credit_App_Status" FROM srifincredit_views.vw_process_credit_report`,
    };
  
    const dropdownData = {
      branches: [],
      statuses: [],
    };
  
    for (const [key, query] of Object.entries(queries)) {
      try {
        const result = await queryAthena(query);
        if (!result || result.length <= 1) continue;
  
        result.slice(1).forEach((row) => {
          const value = Object.values(row)[0];
          if (value) {
            dropdownData[key].push(value);
          }
        });
      } catch (error) {
        console.error(`❌ Error fetching ${key}:`, error);
      }
    }
  
    return dropdownData;
  };


  const generateBorrowerMasterReportService = async (payload) => {
    if (!payload.branch) {
      throw new Error('"branch name" is required');
    }
  
    const query = `
      SELECT * FROM srifincredit_views.srifin_customer_master 
      WHERE "branch name" = '${payload.branch.replace(/'/g, "''")}'
    `;
  
    return await queryAthena(query);
  };
  const fetchBorrowerMasterBranches = async () => {
    const query = `SELECT DISTINCT "branch name" FROM srifincredit_views.srifin_customer_master`;
    const branches = [];
  
    try {
      const result = await queryAthena(query);
      if (result && result.length > 1) {
        result.slice(1).forEach((row) => {
          const branchName = row["branch name"] || Object.values(row)[0];
          if (branchName) {
            branches.push(branchName);
          }
        });
      }
    } catch (error) {
      console.error("❌ Error fetching branches for Borrower Master:", error);
    }
  
    return branches;
  };


  const generateDeathReportService = async (payload) => {
    let query = `SELECT * FROM srifincredit_views.vw_own_death_report WHERE 1=1`;
  
    if (payload.branch) {
      query += ` AND "Branch" = '${payload.branch.replace(/'/g, "''")}'`;
    }
  
    if (payload.region) {
      query += ` AND "Region" = '${payload.region.replace(/'/g, "''")}'`;
    }
  
    if (payload.cluster) {
      query += ` AND "Cluster" = '${payload.cluster.replace(/'/g, "''")}'`;
    }
  
    return await queryAthena(query);
  };
  const fetchDropdownDeathReport = async () => {
    const queries = {
      branches: `SELECT DISTINCT "Branch", "Region" FROM srifincredit_views.vw_own_death_report`,
      regions: `SELECT DISTINCT "Region", "Cluster" FROM srifincredit_views.vw_own_death_report`,
      clusters: `SELECT DISTINCT "Cluster" FROM srifincredit_views.vw_own_death_report`,
    };
  
    const dropdownData = {
      branches: [],
      regions: [],
      clusters: [],
      branchRegionMap: {},
      regionClusterMap: {},
      clusterRegionMap: {},
      regionBranchMap: {},
    };
  
    for (const [key, query] of Object.entries(queries)) {
      try {
        const result = await queryAthena(query);
        if (!result || result.length <= 1) continue;
  
        result.slice(1).forEach((row) => {
          const values = Object.values(row);
  
          if (key === "branches") {
            const branch = values[0];
            const region = values[1];
  
            if (branch && region) {
              dropdownData.branches.push(branch);
              dropdownData.branchRegionMap[branch] = region;
  
              if (!dropdownData.regionBranchMap[region]) {
                dropdownData.regionBranchMap[region] = [];
              }
              dropdownData.regionBranchMap[region].push(branch);
            }
          } else if (key === "regions") {
            const region = values[0];
            const cluster = values[1];
  
            if (region && cluster) {
              dropdownData.regions.push(region);
              dropdownData.regionClusterMap[region] = cluster;
  
              if (!dropdownData.clusterRegionMap[cluster]) {
                dropdownData.clusterRegionMap[cluster] = [];
              }
              dropdownData.clusterRegionMap[cluster].push(region);
            }
          } else if (key === "clusters") {
            const cluster = values[0];
            if (cluster) {
              dropdownData.clusters.push(cluster);
            }
          }
        });
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
      }
    }
  
    return dropdownData;
  };
  
   
  
  const generateEmployeeMasterReportService = async (payload) => {
    let query = `SELECT * FROM srifincredit_views.vw_srifin_employee_master_report WHERE 1=1`;
  
    if (payload.cluster) {
      query += ` AND "ClusterID_Name" = '${payload.cluster.replace(/'/g, "''")}'`;
    }
    if (payload.region) {
      query += ` AND "RegionID_Name" = '${payload.region.replace(/'/g, "''")}'`;
    }
    if (payload.area) {
      query += ` AND "AreaID_Name" = '${payload.area.replace(/'/g, "''")}'`;
    }
    if (payload.branch) {
      query += ` AND "BranchID_Name" = '${payload.branch.replace(/'/g, "''")}'`;
    }
    if (payload.status) {
      query += ` AND "Employee_Status" = '${payload.status.replace(/'/g, "''")}'`;
    }
  
    return await queryAthena(query);
  };
  
  const fetchEmployeeMasterDropdowns = async () => {
    const queries = {
        branches: `SELECT DISTINCT "BranchID_Name", "AreaID_Name" FROM srifincredit_views.vw_srifin_employee_master_report`,
        areas: `SELECT DISTINCT "AreaID_Name", "RegionID_Name" FROM srifincredit_views.vw_srifin_employee_master_report`,
        regions: `SELECT DISTINCT "RegionID_Name", "ClusterID_Name" FROM srifincredit_views.vw_srifin_employee_master_report`,
        clusters: `SELECT DISTINCT "ClusterID_Name" FROM srifincredit_views.vw_srifin_employee_master_report`,
        statuses: `SELECT DISTINCT "Employee_Status" FROM srifincredit_views.vw_srifin_employee_master_report`,
      };
    
      const dropdownData = {
        branches: [],
        areas: [],
        regions: [],
        clusters: [],
        statuses: [],
        branchAreaMap: {},
        areaRegionMap: {},
        regionClusterMap: {},
        clusterRegionMap: {},
      };
    
      for (const [key, query] of Object.entries(queries)) {
        try {
          const result = await queryAthena(query);
    
          if (!result || result.length <= 1) continue;
    
          result.slice(1).forEach((row) => {
            const values = Object.values(row);
    
            if (key === "branches") {
              const branch = values[0];
              const area = values[1];
    
              if (branch && area) {
                dropdownData.branches.push(branch);
                dropdownData.branchAreaMap[branch] = area;
              }
            } else if (key === "areas") {
              const area = values[0];
              const region = values[1];
    
              if (area && region) {
                dropdownData.areas.push(area);
                dropdownData.areaRegionMap[area] = region;
              }
            } else if (key === "regions") {
              const region = values[0];
              const cluster = values[1];
    
              if (region && cluster) {
                dropdownData.regions.push(region);
                dropdownData.regionClusterMap[region] = cluster;
    
                if (!dropdownData.clusterRegionMap[cluster]) {
                  dropdownData.clusterRegionMap[cluster] = [];
                }
                dropdownData.clusterRegionMap[cluster].push(region);
              }
            } else if (key === "clusters") {
              const cluster = values[0];
              if (cluster) dropdownData.clusters.push(cluster);
            } else if (key === "statuses") {
              const status = values[0];
              if (status) dropdownData.statuses.push(status);
            }
          });
        } catch (error) {
          console.error(`❌ Error fetching ${key}:`, error);
        }
      }
    
      return dropdownData;
    };
    const generateForeClosureReportService = async (payload) => {
        let query = `SELECT * FROM srifincredit_views.vw_preclosure_report WHERE 1=1`;
      
        if (payload.branch) {
          query += ` AND "Branch_ID" = '${payload.branch.replace(/'/g, "''")}'`;
        }
        if (payload.region) {
          query += ` AND "region" = '${payload.region.replace(/'/g, "''")}'`;
        }
      
        return await queryAthena(query);
      };
    
      const fetchForeClosureDropdowns = async () => {
        const queries = {
          branches: `SELECT DISTINCT "Branch_ID", "region" FROM srifincredit_views.vw_preclosure_report`,
          regions: `SELECT DISTINCT "region" FROM srifincredit_views.vw_preclosure_report`,
        };
      
        const dropdownData = {
          branches: [],
          regions: [],
          branchRegionMap: {},
        };
      
        for (const [key, query] of Object.entries(queries)) {
          try {
            const result = await queryAthena(query);
            if (!result || result.length <= 1) continue;
      
            result.slice(1).forEach((row) => {
              const values = Object.values(row);
      
              if (key === "branches") {
                const branch = values[0];
                const region = values[1];
                if (branch && region) {
                  dropdownData.branches.push(branch);
                  dropdownData.branchRegionMap[branch] = region;
                }
              } else if (key === "regions") {
                const region = values[0];
                if (region) dropdownData.regions.push(region);
              }
            });
          } catch (error) {
            console.error(`❌ Error fetching ${key}:`, error);
          }
        }
      
        return dropdownData;
      };
      const generateLoanApplicationReportService = async (payload) => {
        let query = `SELECT * FROM srifincredit_views.srifin_loan_applications_standardised WHERE 1=1`;
      
        if (payload.branch) {
          query += ` AND "Branch Name" = '${payload.branch.replace(/'/g, "''")}'`;
        } else {
          throw new Error("Branch is required");
        }
      
        if (payload.appStatus && Array.isArray(payload.appStatus) && payload.appStatus.length > 0) {
          const statuses = payload.appStatus.map(status => `'${status.replace(/'/g, "''")}'`).join(',');
          query += ` AND app_status IN (${statuses})`;
        }
      
        if (payload.app_date_from && payload.app_date_to) {
          query += ` AND app_date BETWEEN DATE('${payload.app_date_from}') AND DATE('${payload.app_date_to}')`;
        } else {
          throw new Error("Date range (startDate and endDate) is required");
        }
      
        return await queryAthena(query);
      };
      const fetchDropdownLoanApplicationReport = async () => {
        const queries = {
          branches: `SELECT DISTINCT "Branch Name" FROM srifincredit_views.srifin_loan_applications_standardised`,
          statuses: `SELECT DISTINCT app_status FROM srifincredit_views.srifin_loan_applications_standardised`
        };
      
        const dropdownData = {
          branches: [],
          statuses: []
        };
      
        for (const [key, query] of Object.entries(queries)) {
          try {
            const result = await queryAthena(query);
            if (!result || result.length <= 1) continue;
      
            result.slice(1).forEach((row) => {
              const value = Object.values(row)[0];
              if (value) {
                dropdownData[key].push(value);
              }
            });
          } catch (error) {
            console.error(`Error fetching ${key}:`, error);
          }
        }
      
        return dropdownData;
      };
         
    
module.exports = { fetchdropdownluc,generateLoanDetailsReportService,fetchDropdownLoanApplicationReport,generateLoanApplicationReportService,fetchForeClosureDropdowns,generateForeClosureReportService,fetchEmployeeMasterDropdowns,generateReport, generateReupload,getReportHeaderTrailerService ,fetchdropdownloan,generateLUCReportservice,generateCreditReportService,fetchDropdownCreditReport,generateBorrowerMasterReportService,fetchBorrowerMasterBranches,fetchDropdownDeathReport,generateDeathReportService,generateEmployeeMasterReportService};
