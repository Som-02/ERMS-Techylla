const ExcelJS = require("exceljs");

const {

    validateProjectImport,

} = require("../services/projectImportService");

const {

    importProjects,

} = require("../services/projectSyncService");
console.log("========== PREVIEW IMPORT CALLED ==========");
const previewImport = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Excel file required.",

            });

        }

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(req.file.buffer);

        const worksheet = workbook.getWorksheet("Projects");

        if (!worksheet) {

            return res.status(400).json({

                success: false,

                message: "Projects sheet not found.",

            });

        }

        const rows = [];
console.log("Worksheet name:", worksheet.name);
console.log("Row count:", worksheet.rowCount);
        worksheet.eachRow((row, index) => {
console.log("INDEX:", index);
            if (index <= 2) return;
console.log("AFTER SKIP:", index);
            rows.push({

                project: row.getCell(1).text,

                client: row.getCell(2).text,

                projectStart: row.getCell(3).text,

                projectEnd: row.getCell(4).text,

                status: row.getCell(5).text,

                requiredSkills: row.getCell(6).text,

                employeesAssigned: row.getCell(7).text,

                employeeDetails: row.getCell(8).text,

                totalAllocation: row.getCell(9).text,

            });

        });

        const validation =

            await validateProjectImport(rows);

        res.json(validation);

    }

    catch (error) {

    res.status(500).json({

        success: false,

        message: error.message,

    });

}

};
const importExcel = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Excel required.",

            });

        }

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(req.file.buffer);

        const worksheet = workbook.getWorksheet("Projects");

        const rows = [];

       worksheet.eachRow((row, index) => {

    if (index <= 2) return;


    rows.push({
        project: row.getCell(1).text,
        client: row.getCell(2).text,
        projectStart: row.getCell(3).value,
        projectEnd: row.getCell(4).value,
        status: row.getCell(5).text,
        requiredSkills: row.getCell(6).text,
        employeesAssigned: row.getCell(7).text,
        employeeDetails: row.getCell(8).text,
        totalAllocation: row.getCell(9).text,
    });

});

        const validation =

            await validateProjectImport(rows);
        
        if (!validation.success) {

            return res.status(400).json(validation);

        }

        const result =

            await importProjects(validation.preview);
        
        res.json(result);

    }

    catch (error) {

    res.status(500).json({

        success: false,

        message: error.message,

    });

}

};

module.exports = {

    previewImport,

    importExcel,

};