const parseEmployees = (employeeText = "") => {

    if (!employeeText || employeeText.trim() === "-") {

        return [];

    }

    const employees = [];

    const blocks = employeeText

        .split(/\n\s*\n/)

        .filter(Boolean);

    blocks.forEach(block => {

        const employee = {

            empId: "",

            name: "",

            position: "",

            experience: 0,

            allocation: 0,

            startDate: "",

            endDate: "",

        };

        const lines = block

            .split("\n")

            .map(line => line.trim())

            .filter(Boolean);

        const first = lines[0];

        const match = first.match(

            /^\d+\.\s+(\S+)\s+-\s+(.+)$/i

        );

        if (!match) return;

        employee.empId = match[1].trim();
employee.name = match[2].trim();

        lines.forEach(line => {

            if (/^Position\s*:/i.test(line)) {

                employee.position = line.replace(/^Position\s*:/i, "").trim();

            }

            if (/^Experience\s*:/i.test(line)) {

                employee.experience = parseInt(

                    line

                        .replace(/^Experience\s*:/i, "")

                        .replace(/Years?/i, "")

                        .trim()

                );

            }

            if (/^Allocation\s*:/i.test(line)) {

                employee.allocation = parseInt(

                    line

                        .replace(/^Allocation\s*:/i, "")

                        .replace("%", "")

                        .trim()

                );

            }

            if (/^Start\s*:/i.test(line)) {

                employee.startDate = line.replace(/^Start\s*:/i, "").trim();

            }

            if (/^End\s*:/i.test(line)) {

                employee.endDate = line.replace(/^End\s*:/i, "").trim();

            }

        });

        employees.push(employee);

    });

    return employees;

};

module.exports = {

    parseEmployees,

};