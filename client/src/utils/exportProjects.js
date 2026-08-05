import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const formatDate = (date) => {

    if (!date) return "";

    return new Date(date)
        .toISOString()
        .split("T")[0];

};

const exportProjects = async (projects) => {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Employee Resource Management System";

    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Projects");

    // ===========================
    // TITLE
    // ===========================
    worksheet.mergeCells("C1:I1");
const title = worksheet.getCell("C1");

title.value = "Project Details Report";

title.font = {
    bold: true,
    size: 18,
    color: { argb: "000000" },
};

title.alignment = {
    horizontal: "center",
    vertical: "middle",
};

title.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "ddf23d" },
};
worksheet.mergeCells("A1:B1");

const legend = worksheet.getCell("A1");

legend.value = {
    richText: [
        {
            text: "Red",
            font: {
                bold: true,
                color: { argb: "FF0000" },
            },
        },
        {
            text: " = Read Only",
            font: {
                color: { argb: "000000" },
            },
        },
        {
            text: "   |   ",
            font: {
                color: { argb: "000000" },
            },
        },
        {
            text: "Blue",
            font: {
                bold: true,
                color: { argb: "4F81BD" },
            },
        },
        {
            text: " = Editable",
            font: {
                color: { argb: "000000" },
            },
        },
    ],
};

legend.alignment = {
    horizontal: "center",
    vertical: "middle",
};

legend.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "ddf23d" },
};

    worksheet.getRow(1).height = 28;

    // ===========================
    // HEADER
    // ===========================

    worksheet.addRow([

        "Project",

        "Client",

        "Start Date",

        "End Date",

        "Status",

        "Roles",

        "Employees Assigned",

        "Employee Details",

        "Total Allocation",

    ]);

    const header = worksheet.getRow(2);

header.eachCell((cell, colNumber) => {

    cell.font = {

        bold: true,

        color: {

            argb: "FFFFFFFF",

        },

    };

    cell.alignment = {

        horizontal: "center",

        vertical: "middle",

    };

    // Read-only columns
    if ([1, 2, 6, 7, 8, 9].includes(colNumber)) {

        cell.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {

                argb: "C00000",

            },

        };

    }

    // Editable columns
    else {

        cell.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {

                argb: "4F81BD",

            },

        };

    }

});

    worksheet.columns = [

        { width: 25 },

        { width: 22 },

        { width: 18 },

        { width: 18 },

        { width: 15 },

        { width: 35 },

        { width: 18 },

        { width: 60 },

        { width: 18 },

    ];
    // ===========================
    // DATA
    // ===========================

    projects.forEach(project => {

        const roles =

            project.roles?.length > 0

                ? project.roles

                      .map(skill => skill.name)

                      .join(", ")

                : "-";

        const employeeDetails = project.employees?.length
    ? {
          richText: project.employees.flatMap((employee, index) => {

              const text = [];

              // RED
              text.push({
                  font: {
                      color: { argb: "C00000" },
                      bold: true,
                  },
                  text: `${index + 1}. ${employee.empId} - ${employee.name}\n`,
              });

              text.push({
                  font: {
                      color: { argb: "C00000" },
                  },
                  text: `Position : ${employee.position}\n`,
              });

              text.push({
                  font: {
                      color: { argb: "C00000" },
                  },
                  text: `Experience : ${employee.experience} Years\n`,
              });

              // BLACK (Editable)
              text.push({
                  font: {color: { argb: "C00000" },},
                  text: `Allocation : ${employee.allocation}%\n`,
              });

              text.push({
                  font: {color: { argb: "C00000" },},
                  text: `Start : ${formatDate(employee.startDate)}\n`,
              });

              text.push({
                  font: {color: { argb: "C00000" },},
                  text: `End : ${formatDate(employee.endDate)}\n\n`,
              });

              return text;

          }),
      }
    : "-";

        const totalAllocation =

            project.employees?.reduce(

                (sum, employee) =>

                    sum + (employee.allocation || 0),

                0

            ) || 0;

        const row = worksheet.addRow([
    project.name,
    project.client?.name || "-",
    formatDate(project.startDate),
    formatDate(project.endDate),
    project.status,
    roles,
    project.employees.length,
    "",
    `${totalAllocation}%`,
]);
row.getCell(8).value = employeeDetails;
[1, 2, 6, 7, 9].forEach((col) => {

    row.getCell(col).font = {

        color: { argb: "C00000" },

        bold: true,

    };

});
        row.alignment = {

            vertical: "middle",

            horizontal: "center",

            wrapText: true,

        };

        row.height = Math.max(

            30,

            project.employees.length * 25

        );

    });

    worksheet.eachRow((row, rowNumber) => {

        row.eachCell(cell => {

            cell.border = {

                top: { style: "thin" },

                left: { style: "thin" },

                bottom: { style: "thin" },

                right: { style: "thin" },

            };

            if (rowNumber > 2) {

                cell.alignment = {

                    horizontal: "center",

                    vertical: "middle",

                    wrapText: true,

                };

            }

        });

    });

    worksheet.views = [

        {

            state: "frozen",

            ySplit: 2,

        },

    ];

    worksheet.autoFilter = "A2:I2";

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(

        new Blob([buffer]),

        "Project_Details_Report.xlsx"

    );

};

export default exportProjects;