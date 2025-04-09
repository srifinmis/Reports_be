const { fetchDropdownLoanApplicationReport,generateLoanApplicationReportService,generateReport, generateReupload, getReportHeaderTrailerService,generateLoanDetailsReportService,generateLUCReportservice,fetchdropdownluc,fetchdropdownloan ,fetchDropdownCreditReport,generateCreditReportService,generateBorrowerMasterReportService,fetchBorrowerMasterBranches,generateDeathReportService,fetchDropdownDeathReport,generateEmployeeMasterReportService,fetchEmployeeMasterDropdowns,generateForeClosureReportService,fetchForeClosureDropdowns} = require("../Services/reportservices");

const getReport = async (req, res) => {
  const { fromDate, toDate, reportType, cutoff_date } = req.body;
  if (!fromDate || !toDate || !reportType || !cutoff_date) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const results = await generateReport(fromDate, toDate, reportType, cutoff_date);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message });
  }
};

const getReupload = async (req, res) => {
  const { csvData, reportType, cutoff_date } = req.body;
  if (!csvData || csvData.length === 0 || !cutoff_date || !reportType) {
    return res.status(400).json({ error: "Missing required parameters or empty CSV data" });
  }

  try {
    const results = await generateReupload(csvData, reportType, cutoff_date);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error generating reupload:", error);
    res.status(500).json({ error: error.message });
  }
};
const getReportHeaderTrailer = async (req, res) => {
  const { reportType } = req.body;

  if (!reportType) {
    return res.status(400).json({ error: "Missing reportType parameter" });
  }

  try {
    const result = await getReportHeaderTrailerService(reportType);

    if (!result || result.length < 2) {
      return res.status(404).json({ error: "No data found for the given reportType" });
    }

    const { column1: header = "", column2: trail = "" } = result[1];

    console.log("Header and Trailer fetched:", { header, trail });

    res.json({ header, trail });
  } catch (error) {
    console.error("Error fetching report header & trailer:", error);
    res.status(500).json({ error: error.message });
  }
};

const generateLoanDetailsReport = async (req, res) => {
  try {
    const result = await generateLoanDetailsReportService(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating loan details report:", error);
    res.status(500).json({ error: error.message });
  }
};
const dropdowndataluc = async (req, res) => {
  try {
    const dropdownData = await fetchdropdownluc();
    res.json(dropdownData);
  } catch (error) {
    console.error("Error fetching dropdowns:", error);
    res.status(500).json({ error: error.message });
  }
};
const generateLUCReport = async (req, res) => {
  try {
    const result = await generateLUCReportservice(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating LUC details report:", error);
    res.status(500).json({ error: error.message });
  }
};
  const dropdowndataloan = async (req, res) => {
    try {
      const filters = req.query; 
      const dropdownData = await fetchdropdownloan (filters);
      res.json(dropdownData);
    } catch (error) {
      console.error("Error fetching dependent dropdowns:", error);
      res.status(500).json({ error: error.message });
    }
  };


  const generateCreditReport = async (req, res) => {
    try {
      const result = await generateCreditReportService(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error generating LUC details report:", error);
      res.status(500).json({ error: error.message });
    }
  };
    const dropdowndataCredit = async (req, res) => {
      try {
        const filters = req.query; 
        const dropdownData = await fetchDropdownCreditReport (filters);
        res.json(dropdownData);
      } catch (error) {
        console.error("Error fetching dependent dropdowns:", error);
        res.status(500).json({ error: error.message });
      }
    };


    const generateBorrowerMasterReport = async (req, res) => {
      try {
        const result = await generateBorrowerMasterReportService(req.body);
        res.status(200).json(result);
      } catch (error) {
        console.error("Error generating LUC details report:", error);
        res.status(500).json({ error: error.message });
      }
    };
      const dropdowndataBorrowerMaster = async (req, res) => {
        try {
          const filters = req.query; 
          const dropdownData = await fetchBorrowerMasterBranches (filters);
          res.json(dropdownData);
        } catch (error) {
          console.error("Error fetching dependent dropdowns:", error);
          res.status(500).json({ error: error.message });
        }
      };

      const generateDeathReport = async (req, res) => {
        try {
          const result = await generateDeathReportService(req.body);
          res.status(200).json(result);
        } catch (error) {
          console.error("Error generating LUC details report:", error);
          res.status(500).json({ error: error.message });
        }
      };
        const dropdowndataDeath = async (req, res) => {
          try {
            const filters = req.query; 
            const dropdownData = await fetchDropdownDeathReport (filters);
            if (dropdownData !== null) {
              res.json(dropdownData); // Proper Express response
            } else {
              res.status(404).json({ message: 'No data found' });
            }
          } catch (error) {
            console.error("Error fetching dependent dropdowns:", error);
            res.status(500).json({ error: error.message });
          }
        };
        const generateEmployeeMasterReport = async (req, res) => {
          try {
            const result = await generateEmployeeMasterReportService(req.body);
            res.status(200).json(result);
          } catch (error) {
            console.error("Error generating LUC details report:", error);
            res.status(500).json({ error: error.message });
          }
        };
          const dropdowndataEmployeeMaster = async (req, res) => {
            try {
              const filters = req.query; 
              const dropdownData = await fetchEmployeeMasterDropdowns (filters);
              if (dropdownData !== null) {
                res.json(dropdownData); // Proper Express response
              } else {
                res.status(404).json({ message: 'No data found' });
              }
            } catch (error) {
              console.error("Error fetching dependent dropdowns:", error);
              res.status(500).json({ error: error.message });
            }
          };
          const generateForeClosureReport = async (req, res) => {
            try {
              const result = await generateForeClosureReportService(req.body);
              res.status(200).json(result);
            } catch (error) {
              console.error("Error generating LUC details report:", error);
              res.status(500).json({ error: error.message });
            }
          };
            const dropdowndataForeClosure = async (req, res) => {
              try {
                const filters = req.query; 
                const dropdownData = await fetchForeClosureDropdowns (filters);
                if (dropdownData !== null) {
                  res.json(dropdownData); // Proper Express response
                } else {
                  res.status(404).json({ message: 'No data found' });
                }
              } catch (error) {
                console.error("Error fetching dependent dropdowns:", error);
                res.status(500).json({ error: error.message });
              }
            };
            const generateLoanapplicationReport = async (req, res) => {
              try {
                const result = await generateLoanApplicationReportService(req.body);
                res.status(200).json(result);
              } catch (error) {
                console.error("Error generating LUC details report:", error);
                res.status(500).json({ error: error.message });
              }
            };
              const dropdowndataLoanapplication = async (req, res) => {
                try {
                  const filters = req.query; 
                  const dropdownData = await fetchDropdownLoanApplicationReport (filters);
                  if (dropdownData !== null) {
                    res.json(dropdownData); // Proper Express response
                  } else {
                    res.status(404).json({ message: 'No data found' });
                  }
                } catch (error) {
                  console.error("Error fetching dependent dropdowns:", error);
                  res.status(500).json({ error: error.message });
                }
              };
module.exports = {dropdowndataLoanapplication,generateLoanapplicationReport,dropdowndataForeClosure,generateForeClosureReport,dropdowndataEmployeeMaster, generateEmployeeMasterReport,generateDeathReport,getReport, getReupload ,dropdowndataluc,generateLoanDetailsReport,generateLUCReport,getReportHeaderTrailer,dropdowndataloan,generateCreditReport,dropdowndataCredit,generateBorrowerMasterReport,dropdowndataBorrowerMaster,dropdowndataDeath};
