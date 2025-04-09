const express = require("express");
const { generateLoanapplicationReport,dropdowndataLoanapplication,getReport, getReupload,getReportHeaderTrailer,dropdowndataluc ,generateLUCReport,generateLoanDetailsReport,dropdowndataloan,generateCreditReport,dropdowndataCredit,generateBorrowerMasterReport,dropdowndataBorrowerMaster,generateDeathReport,dropdowndataDeath,generateEmployeeMasterReport,dropdowndataEmployeeMaster,generateForeClosureReport,dropdowndataForeClosure} = require("../Controllers/reportController");
const { login } = require("../Controllers/loginController");

const router = express.Router();

router.post("/Login", login);
router.post("/generate-report", getReport);
router.post("/generate-reupload", getReupload);
router.post("/get-report-header-trailer", getReportHeaderTrailer);
router.post("/generate-loan-details-report", generateLoanDetailsReport);
router.post("/generate-luc-details-report", generateLUCReport);
router.get("/dropdowndataluc", dropdowndataluc);
router.get("/dropdowndataloan",dropdowndataloan);
router.post("/generate-credit-report",generateCreditReport);
router.get("/dropdowndataCredit",dropdowndataCredit);
router.post("/generate-borrower-master-report",generateBorrowerMasterReport);
router.get("/dropdown-borrower-branches",dropdowndataBorrowerMaster);
router.post("/death-report",generateDeathReport),
router.get("/death-report-dropdowns",dropdowndataDeath),
router.get("/dropdownemployee",dropdowndataEmployeeMaster),
router.post("/generate-employee-master-report",generateEmployeeMasterReport),
router.post("/generate-foreclosure-report",generateForeClosureReport),
router.get("/dropdowndataforeclosure",dropdowndataForeClosure),
router.get("/dropdown-loan-application-report",dropdowndataLoanapplication),
router.post("/generate-loan-application-report",generateLoanapplicationReport),
module.exports = router;
