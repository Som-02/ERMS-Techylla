import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const exportEmployees = async (employees) => {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Employee Resource Management System";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Employees");

    // =========================
    // REPORT TITLE
    // =========================

    worksheet.mergeCells("A1:K1");

    const titleCell = worksheet.getCell("A1");

    titleCell.value = "Employee Details Report";

    titleCell.font = {
        bold: true,
        size: 18,
        color: { argb: "FFFFFFFF" },
    };

    titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1F4E78" },
    };

    worksheet.getRow(1).height = 28;

    // =========================
    // HEADER
    // =========================

    worksheet.addRow([
        "ID",
        "Name",
        "Position",
        "WWID",
        "Email",
        "Experience",
        "Reporting Manager",
        "Skills",
        "Client",
        "Project",
        "End Date",
    ]);

    const headerRow = worksheet.getRow(2);

for (let i = 1; i <= 11; i++) {

    const cell = headerRow.getCell(i);

    cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
    };

    cell.alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
    };

}

    headerRow.height = 22;

    // =========================
    // COLUMN WIDTHS
    // =========================

    worksheet.getColumn(1).width = 15;
worksheet.getColumn(2).width = 25;
worksheet.getColumn(3).width = 30;
worksheet.getColumn(4).width = 15;
worksheet.getColumn(5).width = 30;
worksheet.getColumn(6).width = 15;
worksheet.getColumn(7).width = 25;
worksheet.getColumn(8).width = 35;
worksheet.getColumn(9).width = 25;
worksheet.getColumn(10).width = 30;
worksheet.getColumn(11).width = 20;

    // =========================
    // EMPLOYEE DATA
    // =========================

    employees.forEach((employee) => {
        const skills =
            employee.skills?.length > 0
                ? employee.skills
                      .map(
                          (skill, index) =>
                              `${index + 1}. ${skill.skill} (${skill.rating}/5)`
                      )
                      .join("\n")
                : "-";

        const clients =
            employee.assignments?.length > 0
                ? employee.assignments
                      .map(
                          (assignment, index) =>
                              `${index + 1}. ${
                                  assignment.clientName ||
                                  assignment.client?.name ||
                                  "-"
                              }`
                      )
                      .join("\n")
                : "-";

        const projects =
            employee.assignments?.length > 0
                ? employee.assignments
                      .map(
                          (assignment, index) =>
                              `${index + 1}. ${
                                  assignment.projectName ||
                                  assignment.project?.name ||
                                  "-"
                              }`
                      )
                      .join("\n")
                : "-";

        const endDates =
            employee.assignments?.length > 0
                ? employee.assignments
                      .map(
                          (assignment, index) =>
                              `${index + 1}. ${formatDate(
                                  assignment.endDate
                              )}`
                      )
                      .join("\n")
                : "-";

        const row = worksheet.addRow([
            employee.empId,
            employee.name,
            employee.position,
            employee.wwid || "-",
            employee.email || "-",
            employee.experience,
            employee.reportingManager?.name || "-",
            skills,
            clients,
            projects,
            endDates,
        ]);

        row.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
        };

        row.height = Math.max(
            30,
            employee.skills.length * 15,
            employee.assignments.length * 15
        );
    });

    // =========================
    // STYLING
    // =========================

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
                bottom: { style: "thin" },
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

    // Freeze Title + Header
    worksheet.views = [
        {
            state: "frozen",
            ySplit: 2,
        },
    ];

    // Enable Filters
    worksheet.autoFilter = "A2:K2";

    // =========================
    // DOWNLOAD
    // =========================

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob([buffer]),
        "Employee_Details_Report.xlsx"
    );
};

export default exportEmployees;