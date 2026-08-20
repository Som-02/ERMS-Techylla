export const getStatusClass = (status) => {

    switch (status) {

        case "Lead":
            return "lead";

        case "Pipeline":
            return "pipeline";

        case "Active":
            return "active";

        case "Completed":
            return "completed";

        case "On Hold":
            return "hold";

        default:
            return "custom";

    }

};